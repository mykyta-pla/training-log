/**
 * Runs on plain node — no wrangler, no network, no build step.
 *
 *   cd worker && node test/api.test.js
 *
 * D1 and the edge cache are stubbed just far enough to exercise the routing,
 * the URL allowlist, the query stripping, CORS and the report vocabulary.
 * What it is really checking is that nothing about the caller can reach the
 * table: every assertion about a stored row is also an assertion that the row
 * has four fields and an id, and nothing more.
 */

import assert from 'node:assert/strict';
import test from 'node:test';

/* ------------------------------------------------------- the fake edge -- */

globalThis.caches = {default: new Map([['store', new Map()]]).get('store') && {
  _m: new Map(),
  async match(req) { const v = this._m.get(req.url); return v ? v.clone() : undefined; },
  async put(req, res) { this._m.set(req.url, res); },
  async delete(req) { return this._m.delete(req.url); },
}};

function fakeDb(rows = []) {
  const db = {rows, queries: []};
  db.prepare = sql => {
    let args = [];
    const run = () => {
      db.queries.push({sql, args});
      if (/^SELECT id, movement/.test(sql))
        return {results: db.rows.filter(r => !r.status.startsWith('hidden:'))
          .sort((a, b) => a.movement.localeCompare(b.movement) || a.id.localeCompare(b.id))
          .map(({id, movement, url, label}) => ({id, movement, url, label}))};
      if (/^SELECT id FROM videos WHERE movement/.test(sql))
        return db.rows.find(r => r.movement === args[0] && r.url === args[1]) || null;
      if (/^INSERT/.test(sql)) {
        db.rows.push({id: args[0], movement: args[1], url: args[2], label: args[3], status: 'ok'});
        return {meta: {changes: 1}};
      }
      if (/^UPDATE/.test(sql)) {
        const clean = /status = 'ok'$/.test(sql);
        const row = db.rows.find(r => r.id === args[1] &&
          (clean ? r.status === 'ok' : !r.status.startsWith('hidden:')));
        if (row) row.status = args[0];
        return {meta: {changes: row ? 1 : 0}};
      }
      throw new Error('unexpected SQL: ' + sql);
    };
    return {
      bind: (...a) => { args = a; return {all: async () => run(), first: async () => run(), run: async () => run()}; },
      all: async () => run(), first: async () => run(), run: async () => run(),
    };
  };
  return db;
}

const ctx = {waitUntil: p => p};
const SITE = 'https://notaroutine.life';

const { default: worker } = await import('../src/index.js');

const call = (method, path, {body, origin = SITE, env} = {}) => worker.fetch(
  new Request('https://api.notaroutine.life' + path, {
    method,
    headers: {
      ...(origin ? {Origin: origin} : {}),
      ...(body ? {'Content-Type': 'application/json'} : {}),
      'CF-Connecting-IP': '198.51.100.7',
    },
    body: body ? JSON.stringify(body) : undefined,
  }), env, ctx);

const fresh = rows => { globalThis.caches.default._m.clear(); return {DB: fakeDb(rows)}; };

/* ----------------------------------------------------------- the tests -- */

test('GET /videos serves the flagged and withholds the hidden', async () => {
  const env = fresh([
    {id: 'b', movement: 'Goblet squat', url: 'https://youtu.be/aaa', label: null, status: 'ok'},
    {id: 'a', movement: 'Barbell row',  url: 'https://youtu.be/bbb', label: 'cue at 0:14', status: 'ok'},
    {id: 'c', movement: 'Barbell row',  url: 'https://youtu.be/ccc', label: null, status: 'flagged:spam'},
    {id: 'd', movement: 'Barbell row',  url: 'https://youtu.be/ddd', label: null, status: 'hidden:unsafe'},
  ]);
  const res = await call('GET', '/videos', {env});
  const {videos} = await res.json();
  assert.equal(res.status, 200);
  assert.deepEqual(videos.map(v => v.id), ['a', 'c', 'b']);
  assert.equal(res.headers.get('Cache-Control'), 'public, max-age=60');
  assert.deepEqual(Object.keys(videos[0]).sort(), ['id', 'label', 'movement', 'url']);
});

test('GET /videos is served from the edge cache the second time', async () => {
  const env = fresh([{id: 'a', movement: 'Row', url: 'https://youtu.be/a', label: null, status: 'ok'}]);
  await call('GET', '/videos', {env});
  const before = env.DB.queries.length;
  const res = await call('GET', '/videos', {env});
  assert.equal(env.DB.queries.length, before, 'second GET should not touch D1');
  assert.equal((await res.json()).videos.length, 1);
});

test('CORS: only notaroutine.life is answered', async () => {
  const env = fresh([]);
  const mine = await call('GET', '/videos', {env});
  assert.equal(mine.headers.get('Access-Control-Allow-Origin'), SITE);
  assert.equal(mine.headers.get('Vary'), 'Origin');

  const theirs = await call('GET', '/videos', {env, origin: 'https://evil.example'});
  assert.equal(theirs.headers.get('Access-Control-Allow-Origin'), null);

  const pre = await call('OPTIONS', '/videos', {env});
  assert.equal(pre.status, 204);
  assert.equal(pre.headers.get('Access-Control-Allow-Origin'), SITE);
});

test('POST /videos accepts the five allowlisted hosts and their subdomains', async () => {
  for (const url of [
    'https://www.youtube.com/watch?v=abc123',
    'https://m.youtube.com/watch?v=abc124',
    'https://youtu.be/abc125',
    'https://www.instagram.com/reel/xyz/',
    'https://vimeo.com/12345678',
    'https://vm.tiktok.com/ZMabcdef/',
  ]) {
    const env = fresh([]);
    const res = await call('POST', '/videos', {env, body: {movement: 'Goblet squat', url}});
    assert.equal(res.status, 201, url + ' should be accepted');
  }
});

test('POST /videos rejects everything else with a message that says what it takes', async () => {
  for (const url of [
    'https://youtube.com.evil.example/watch?v=a',
    'https://notyoutube.com/watch?v=a',
    'https://example.com/video.mp4',
    'javascript:alert(1)',
    'data:text/html,<script>alert(1)</script>',
    'not a url at all',
  ]) {
    const env = fresh([]);
    const res = await call('POST', '/videos', {env, body: {movement: 'Goblet squat', url}});
    assert.equal(res.status, 400, url + ' should be rejected');
    assert.match((await res.json()).error, /YouTube/);
    assert.equal(env.DB.rows.length, 0);
  }
});

test('tracking parameters never reach the table', async () => {
  const env = fresh([]);
  await call('POST', '/videos', {env, body: {
    movement: 'Barbell row',
    url: 'https://www.instagram.com/reel/abc/?igshid=SOMEONES_SHARE_ID&utm_source=ig_web',
  }});
  await call('POST', '/videos', {env, body: {
    movement: 'Goblet squat',
    url: 'http://www.youtube.com/watch?v=abc123&t=14s&si=ANOTHER_SHARE_ID&list=WATCH_HISTORY',
  }});
  assert.equal(env.DB.rows[0].url, 'https://instagram.com/reel/abc');
  assert.equal(env.DB.rows[1].url, 'https://youtube.com/watch?v=abc123&t=14s');
});

test('a row holds four fields and an id, and the id is not a sequence', async () => {
  const env = fresh([]);
  await call('POST', '/videos', {env, body: {movement: 'Goblet squat', url: 'https://youtu.be/a', label: 'knees out'}});
  const row = env.DB.rows[0];
  assert.deepEqual(Object.keys(row).sort(), ['id', 'label', 'movement', 'status', 'url']);
  assert.match(row.id, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  assert.equal(row.status, 'ok');
});

test('the same link for the same movement is stored once', async () => {
  const env = fresh([]);
  const first = await call('POST', '/videos', {env, body: {movement: 'Row', url: 'https://youtu.be/a'}});
  const again = await call('POST', '/videos', {env, body: {movement: 'Row', url: 'https://youtu.be/a?utm_source=x'}});
  assert.equal(first.status, 201);
  assert.equal(again.status, 200);
  assert.equal((await again.json()).duplicate, true);
  assert.equal(env.DB.rows.length, 1);
});

test('POST /report takes only the four known reasons', async () => {
  const env = fresh([{id: 'a', movement: 'Row', url: 'https://youtu.be/a', label: null, status: 'ok'}]);
  for (const reason of ['i just do not like it', 'not-a-movement', 'wrong-movement', '', 'UNSAFE']) {
    const bad = await call('POST', '/report', {env, body: {id: 'a', reason}});
    assert.equal(bad.status, 400, JSON.stringify(reason) + ' should be refused');
    assert.equal(env.DB.rows[0].status, 'ok');
  }
});

test('unsafe hides on one report', async () => {
  const env = fresh([{id: 'a', movement: 'Row', url: 'https://youtu.be/a', label: null, status: 'ok'}]);
  const res = await call('POST', '/report', {env, body: {id: 'a', reason: 'unsafe'}});
  assert.deepEqual(await res.json(), {ok: true, hidden: true, flagged: false});
  assert.equal(env.DB.rows[0].status, 'hidden:unsafe');
  assert.deepEqual((await (await call('GET', '/videos', {env})).json()).videos, []);
});

test('broken, wrong and spam flag the row and leave it visible', async () => {
  for (const reason of ['broken', 'wrong', 'spam']) {
    const env = fresh([{id: 'a', movement: 'Row', url: 'https://youtu.be/a', label: null, status: 'ok'}]);
    const res = await call('POST', '/report', {env, body: {id: 'a', reason}});
    assert.deepEqual(await res.json(), {ok: true, hidden: false, flagged: true});
    assert.equal(env.DB.rows[0].status, 'flagged:' + reason);
    const {videos} = await (await call('GET', '/videos', {env})).json();
    assert.deepEqual(videos.map(v => v.id), ['a'], reason + ' must not take the entry down');
  }
});

test('a second report cannot overwrite the first reason, and unsafe still wins', async () => {
  const env = fresh([{id: 'a', movement: 'Row', url: 'https://youtu.be/a', label: null, status: 'ok'}]);
  await call('POST', '/report', {env, body: {id: 'a', reason: 'broken'}});
  const second = await call('POST', '/report', {env, body: {id: 'a', reason: 'spam'}});
  assert.equal((await second.json()).flagged, false);
  assert.equal(env.DB.rows[0].status, 'flagged:broken');

  const unsafe = await call('POST', '/report', {env, body: {id: 'a', reason: 'unsafe'}});
  assert.equal((await unsafe.json()).hidden, true);
  assert.equal(env.DB.rows[0].status, 'hidden:unsafe');

  // and nothing can flag it back into view
  await call('POST', '/report', {env, body: {id: 'a', reason: 'broken'}});
  assert.equal(env.DB.rows[0].status, 'hidden:unsafe');
});

test('a report writes no free text anywhere', async () => {
  const env = fresh([{id: 'a', movement: 'Row', url: 'https://youtu.be/a', label: null, status: 'ok'}]);
  await call('POST', '/report', {env, body: {
    id: 'a', reason: 'spam', note: 'my name is X and my email is y@z', email: 'y@z',
  }});
  const stored = JSON.stringify(env.DB.rows) + JSON.stringify(env.DB.queries);
  assert.equal(/my name is X|y@z/.test(stored), false);
  assert.equal(env.DB.rows[0].status, 'flagged:spam');
});

test('there is no endpoint that would take readiness', async () => {
  const env = fresh([]);
  for (const path of ['/readiness', '/sync/abc', '/sessions', '/']) {
    const res = await call('POST', path, {env, body: {rec: 61, hrv: 49, note: 'slept badly'}});
    assert.equal(res.status, 404, path + ' should not exist');
  }
  assert.equal(env.DB.rows.length, 0);
  assert.equal(env.DB.queries.length, 0);
});

test('wrong methods are refused, not misread', async () => {
  const env = fresh([]);
  assert.equal((await call('POST', '/videos', {env, body: null})).status, 400);
  assert.equal((await call('GET', '/report', {env})).status, 405);
  assert.equal((await call('PUT', '/videos', {env})).status, 405);
});

test('a body that is not JSON is refused before it reaches the table', async () => {
  const env = fresh([]);
  const res = await worker.fetch(new Request('https://api.notaroutine.life/videos', {
    method: 'POST', headers: {Origin: SITE, 'Content-Type': 'text/plain'}, body: 'movement=x&url=y',
  }), env, ctx);
  assert.equal(res.status, 400);
  assert.equal(env.DB.rows.length, 0);
});

test('the rate limiter is handed a hash, never an address', async () => {
  const env = fresh([]);
  const seen = [];
  env.SUBMIT_LIMIT = {limit: async ({key}) => { seen.push(key); return {success: true}; }};
  await call('POST', '/videos', {env, body: {movement: 'Row', url: 'https://youtu.be/a'}});
  assert.equal(seen.length, 1);
  assert.match(seen[0], /^[0-9a-f]{32}$/);
  assert.equal(seen[0].includes('198.51.100'), false);
});

test('over the limit, nothing is written', async () => {
  const env = fresh([]);
  env.SUBMIT_LIMIT = {limit: async () => ({success: false})};
  const res = await call('POST', '/videos', {env, body: {movement: 'Row', url: 'https://youtu.be/a'}});
  assert.equal(res.status, 429);
  assert.equal(env.DB.rows.length, 0);
});
