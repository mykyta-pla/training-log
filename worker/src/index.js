/**
 * api.notaroutine.life — the shared video library, and nothing else.
 *
 * GET  /videos   every entry that isn't flagged, edge-cached 60 seconds
 * POST /videos   {movement, url, label?}   no auth, rate limited at the edge
 * POST /report   {id, reason}              hides an entry immediately
 *
 * What a row holds: a random id, a movement name, a URL, an optional label,
 * and a status. That is the whole schema and it stays that way. No submitter,
 * no IP, no timestamp, no user agent, no headers kept, nothing that could tie
 * a row to a person or two rows to each other. The id is crypto.randomUUID —
 * it carries no order and no origin, and exists only so a report can name
 * which row it means.
 *
 * Readiness, sessions and logged sets never come near this Worker. It has no
 * endpoint that would accept them.
 */

const ORIGIN = 'https://notaroutine.life';
const CACHE_SECONDS = 60;

// Where a link may point. Exact host, or a subdomain of it — so m.youtube.com
// and vm.tiktok.com pass, and youtube.com.example.net does not.
const HOSTS = ['youtube.com', 'youtu.be', 'instagram.com', 'vimeo.com', 'tiktok.com'];

// Reports say what is wrong from a fixed list. Free text is never stored: it
// would be the one field on this server where a person could write anything,
// including something about themselves.
const REASONS = ['broken', 'wrong-movement', 'unsafe', 'spam', 'not-a-movement'];

const MAX_MOVEMENT = 80;
const MAX_LABEL = 80;
const MAX_URL = 300;
const MAX_BODY = 2048;

/* ------------------------------------------------------------------ CORS -- */

// One origin, and only when it asks. A request from anywhere else gets no
// access-control header at all, so the browser refuses to hand over the body.
function cors(request) {
  const origin = request.headers.get('Origin');
  const h = {'Vary': 'Origin'};
  if (origin === ORIGIN) {
    h['Access-Control-Allow-Origin'] = ORIGIN;
    h['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS';
    h['Access-Control-Allow-Headers'] = 'Content-Type';
    h['Access-Control-Max-Age'] = '86400';
  }
  return h;
}

const json = (body, status, request, extra) => new Response(JSON.stringify(body), {
  status,
  headers: {'Content-Type': 'application/json; charset=utf-8', ...cors(request), ...(extra || {})},
});

const oops = (message, status, request) => json({error: message}, status, request);

/* ------------------------------------------------------------- validation -- */

// Returns the URL as it will be stored, or null.
//
// Everything after the path is dropped except YouTube's v and t. Share links
// carry identifiers — Instagram's igshid, TikTok's share ids, utm_* from
// wherever the link was copied — and some of those name the person who copied
// it. Nothing here needs them, so nothing here keeps them.
function cleanUrl(raw) {
  let u;
  try { u = new URL(String(raw).trim()); } catch (_) { return null; }
  if (u.protocol !== 'https:' && u.protocol !== 'http:') return null;
  u.protocol = 'https:';

  const host = u.hostname.toLowerCase().replace(/^www\./, '');
  if (!HOSTS.some(h => host === h || host.endsWith('.' + h))) return null;
  u.hostname = host;
  u.username = ''; u.password = ''; u.port = '';
  u.hash = '';

  const keep = new URLSearchParams();
  if (host === 'youtube.com' || host.endsWith('.youtube.com')) {
    for (const k of ['v', 't']) if (u.searchParams.has(k)) keep.set(k, u.searchParams.get(k));
  }
  u.search = keep.toString();

  if (u.pathname.length > 1 && u.pathname.endsWith('/')) u.pathname = u.pathname.slice(0, -1);
  const out = u.toString();
  return out.length <= MAX_URL ? out : null;
}

// Printable single-line text, trimmed, or null. Control characters go: they
// are only ever there to break something downstream.
function cleanText(raw, max) {
  if (typeof raw !== 'string') return null;
  const t = raw.replace(/[\u0000-\u001f\u007f-\u009f]/g, ' ').replace(/\s+/g, ' ').trim();
  if (!t || t.length > max) return null;
  return t;
}

async function readBody(request) {
  const type = request.headers.get('Content-Type') || '';
  if (!type.includes('application/json')) return null;
  const text = await request.text();
  if (text.length > MAX_BODY) return null;
  try { const v = JSON.parse(text); return v && typeof v === 'object' && !Array.isArray(v) ? v : null; }
  catch (_) { return null; }
}

/* ------------------------------------------------------------ rate limits -- */

// Cloudflare's own rate limiting binding. It counts at the edge; this Worker
// holds no counter, no address and no log. What it is handed is a SHA-256 of
// the connecting address, not the address — and the binding keeps only a
// counter against that hash for the length of the window.
async function limited(env, request, binding) {
  const limiter = env[binding];
  if (!limiter) return false;                    // not bound in dev — don't fail closed locally
  const ip = request.headers.get('CF-Connecting-IP') || '';
  const bytes = new TextEncoder().encode(ip + '|' + binding);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  const key = [...new Uint8Array(digest).slice(0, 16)].map(b => b.toString(16).padStart(2, '0')).join('');
  const {success} = await limiter.limit({key});
  return !success;
}

/* ---------------------------------------------------------------- routes -- */

async function getVideos(request, env, ctx) {
  const cache = caches.default;
  const key = new Request(new URL(request.url).origin + '/videos', {method: 'GET'});
  const hit = await cache.match(key);
  if (hit) {
    const out = new Response(hit.body, hit);
    for (const [k, v] of Object.entries(cors(request))) out.headers.set(k, v);
    return out;
  }

  // ORDER BY movement, id: alphabetical, then by a random id. Ordering by
  // anything else would leak the order things were submitted in.
  const {results} = await env.DB.prepare(
    "SELECT id, movement, url, label FROM videos WHERE status = 'ok' ORDER BY movement, id"
  ).all();

  const body = JSON.stringify({videos: results || []});
  const store = new Response(body, {headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': `public, max-age=${CACHE_SECONDS}`,
  }});
  ctx.waitUntil(cache.put(key, store.clone()));

  const out = new Response(body, store);
  for (const [k, v] of Object.entries(cors(request))) out.headers.set(k, v);
  return out;
}

async function postVideo(request, env, ctx) {
  if (await limited(env, request, 'SUBMIT_LIMIT'))
    return oops('That is a lot of links at once. Give it a minute and try again.', 429, request);

  const body = await readBody(request);
  if (!body) return oops('Send JSON: {movement, url, label}.', 400, request);

  const movement = cleanText(body.movement, MAX_MOVEMENT);
  if (!movement) return oops('Say which movement the video is for.', 400, request);

  const url = cleanUrl(body.url);
  if (!url) return oops(
    'That link is not somewhere this library accepts. It takes YouTube, youtu.be, ' +
    'Instagram, Vimeo and TikTok links — nothing else.', 400, request);

  const label = body.label == null || body.label === '' ? null : cleanText(body.label, MAX_LABEL);
  if (label === null && body.label) return oops('That label is too long — 80 characters.', 400, request);

  // Same link for the same movement twice is not an error, it is a no-op.
  const dup = await env.DB.prepare(
    'SELECT id FROM videos WHERE movement = ? AND url = ?'
  ).bind(movement, url).first();
  if (dup) return json({ok: true, id: dup.id, duplicate: true}, 200, request);

  const id = crypto.randomUUID();
  await env.DB.prepare(
    "INSERT INTO videos (id, movement, url, label, status) VALUES (?, ?, ?, ?, 'ok')"
  ).bind(id, movement, url, label).run();

  ctx.waitUntil(caches.default.delete(new Request(new URL(request.url).origin + '/videos')));
  return json({ok: true, id}, 201, request);
}

async function postReport(request, env, ctx) {
  if (await limited(env, request, 'REPORT_LIMIT'))
    return oops('Too many reports at once. Give it a minute.', 429, request);

  const body = await readBody(request);
  if (!body) return oops('Send JSON: {id, reason}.', 400, request);

  const id = cleanText(body.id, 40);
  if (!id) return oops('Which entry?', 400, request);

  const reason = cleanText(body.reason, 40);
  if (!reason || !REASONS.includes(reason))
    return oops('Reason must be one of: ' + REASONS.join(', ') + '.', 400, request);

  // The reason rides along inside the status flag rather than in a column of
  // its own — a fixed vocabulary, so there is nowhere for free text to land.
  // One report hides an entry. Hiding something that turns out to be fine
  // costs nothing; leaving something bad up costs more.
  const res = await env.DB.prepare(
    "UPDATE videos SET status = ? WHERE id = ? AND status = 'ok'"
  ).bind('flagged:' + reason, id).run();

  ctx.waitUntil(caches.default.delete(new Request(new URL(request.url).origin + '/videos')));
  return json({ok: true, hidden: (res.meta && res.meta.changes) > 0}, 200, request);
}

/* ----------------------------------------------------------------- entry -- */

export default {
  async fetch(request, env, ctx) {
    const {pathname} = new URL(request.url);

    if (request.method === 'OPTIONS') return new Response(null, {status: 204, headers: cors(request)});

    try {
      if (pathname === '/videos' && request.method === 'GET')  return await getVideos(request, env, ctx);
      if (pathname === '/videos' && request.method === 'POST') return await postVideo(request, env, ctx);
      if (pathname === '/report' && request.method === 'POST') return await postReport(request, env, ctx);
    } catch (_) {
      // Nothing about the request goes into a log line, including on the way out.
      return oops('The library is having a bad moment. Try again shortly.', 500, request);
    }

    if (pathname === '/videos' || pathname === '/report')
      return oops('Wrong method for that path.', 405, request);
    return oops('No such endpoint. This API serves the shared video library and nothing else.', 404, request);
  },
};
