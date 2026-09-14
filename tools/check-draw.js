// The session builder's draw, exercised without a browser.
//
// It loads movements.js the way build-library.js does and drives the real slot logic —
// FOCUS, slotPool, drawStrength, orderStrength, swapNote, detailFor — so the things
// asserted here are the things the page runs, not a copy of them.
//
//   node tools/check-draw.js
//
// Run from the repo root. Nothing on the site loads this file.

const fs = require('fs');
const vm = require('vm');
const assert = require('assert');

const sandbox = {localStorage: {getItem: () => null, setItem: () => {}}, document: undefined};
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync('movements.js', 'utf8') + `
  ;globalThis.__m = {LIB, FOCUS, REPS, ROLES, SLOT_ROLES, LOGGABLE, focusSequence,
    slotPool, drawStrength, orderStrength, swapNote, detailFor, roleOf, eligible,
    pickFresh, recencyMap, itemRole, movementFor};`, sandbox);
const M = sandbox.__m;

let failed = 0, ran = 0;
const test = (name, fn) => {
  ran++;
  try { fn(); console.log('  ok   ' + name); }
  catch (e) { failed++; console.log('  FAIL ' + name + '\n       ' + e.message); }
};

// The builder's own take(), minus the DOM: the same shape drawStrength is handed there.
function taker(equip, avoid, rec) {
  const used = new Set();
  return (pattern, role) => {
    const pool = role
      ? M.slotPool({p: pattern, r: role}, equip, avoid, used).pool
      : M.eligible(pattern, equip, avoid, used);
    const x = M.pickFresh(pool, rec || new Map());
    if (!x) return null;
    used.add(x.n);
    return {name: x.n, pattern, detail: x.d, t: x.t, r: M.roleOf(x), e: x.e, a: x.a || []};
  };
}

// A full-body 60-minute session draws five exercises: build() gives the strength block
// 33 minutes at that total, and nEx is 5 once the block is 32 minutes or more.
const fullBody = (equip = 3, avoid = []) =>
  M.drawStrength(M.focusSequence(['full']), 5, taker(equip, avoid), []);

console.log('\nfull body, 60 minutes, full gym');

test('draws five movements', () => {
  for (let i = 0; i < 200; i++) assert.strictEqual(fullBody().length, 5);
});

test('exactly one main lift', () => {
  for (let i = 0; i < 400; i++) {
    const mains = fullBody().filter(x => x.r === 'main');
    assert.strictEqual(mains.length, 1, `got ${mains.length}: ${fullBody().map(x => x.name + '/' + x.r)}`);
  }
});

test('the main lift is first', () => {
  for (let i = 0; i < 400; i++) {
    const items = fullBody();
    assert.strictEqual(items[0].r, 'main', 'first was ' + items[0].name + '/' + items[0].r);
  }
});

test('every movement carries its own prescription', () => {
  for (let i = 0; i < 200; i++) for (const it of fullBody()) {
    assert.ok(it.detail, it.name + ' drew no prescription');
    assert.ok(/\d/.test(it.detail), it.name + ' prescription has no numbers: ' + it.detail);
  }
});

test('a deadlift and a good morning never share a prescription', () => {
  const by = n => M.LIB.find(x => x.n === n);
  assert.notStrictEqual(by('Conventional deadlift').d, by('Good morning').d);
  assert.strictEqual(by('Conventional deadlift').d, '3–5');
  assert.strictEqual(by('Good morning').d, '8–12');
});

test('roles run heaviest first, then coached before straightforward', () => {
  const rank = {main: 0, sec: 1, acc: 2}, tr = {c: 0, p: 1, s: 2};
  for (let i = 0; i < 300; i++) {
    const items = fullBody();
    for (let j = 1; j < items.length; j++) {
      const a = items[j - 1], b = items[j];
      assert.ok(rank[a.r] <= rank[b.r], `${a.name}/${a.r} before ${b.name}/${b.r}`);
      if (a.r === b.r) assert.ok(tr[a.t] <= tr[b.t], `${a.name}/${a.t} before ${b.name}/${b.t}`);
    }
  }
});

console.log('\nfalling back when no main fits');

test('dumbbells only: no main exists, the slot takes a secondary', () => {
  const mains = M.LIB.filter(x => x.r === 'main' && (x.p === 'hinge' || x.p === 'squat'));
  assert.ok(mains.every(x => x.e === 3), 'a main hinge/squat under a full gym would void this test');
  for (let i = 0; i < 200; i++) {
    const items = fullBody(2);
    assert.strictEqual(items.filter(x => x.r === 'main').length, 0);
    assert.strictEqual(items.length, 5, 'the block must still fill');
    assert.strictEqual(items[0].r, 'sec');
  }
});

test('bodyweight only: falls all the way to accessory rather than failing', () => {
  for (let i = 0; i < 200; i++) {
    const items = fullBody(0);
    assert.ok(items.length >= 1, 'drew nothing at all');
    assert.strictEqual(items.filter(x => x.r === 'main').length, 0);
  }
});

test('two focuses merged still give one main', () => {
  for (let i = 0; i < 300; i++) {
    const items = M.drawStrength(M.focusSequence(['upper', 'lower']), 5, taker(3, []), []);
    assert.ok(items.filter(x => x.r === 'main').length <= 1,
      'merged focuses drew ' + items.filter(x => x.r === 'main').map(x => x.name));
  }
});

test('a sec or acc slot never draws a main', () => {
  const used = new Set();
  for (const slot of [{p: 'push', r: 'sec'}, {p: 'pull', r: 'acc'}, {p: 'hinge', r: 'sec'}]) {
    const {pool} = M.slotPool(slot, 3, [], used);
    assert.ok(pool.every(x => M.roleOf(x) !== 'main'), slot.p + '/' + slot.r + ' offered a main');
  }
});

console.log('\nswapping inside a slot');

test('a swap stays in the same pattern and the same role', () => {
  const used = new Set(['Conventional deadlift']);
  const {pool} = M.slotPool({p: 'hinge', r: 'main'}, 3, [], used);
  assert.ok(pool.length, 'no alternative main hinge to swap to');
  assert.ok(pool.every(x => x.p === 'hinge' && x.r === 'main'));
  assert.ok(!pool.some(x => x.n === 'Conventional deadlift'), 'offered the movement it replaced');
});

test('the note is read off the data, not written', () => {
  const by = n => M.LIB.find(x => x.n === n);
  assert.strictEqual(M.swapNote(by('Conventional deadlift'), by('Good morning')),
    'Same slot · no heavy grip');
  assert.strictEqual(M.swapNote(by('Back squat'), by('Bodyweight squat')),
    'Same slot · needs only bodyweight alone · straightforward where that was coached');
  // two movements alike on all three axes get an honest "nothing changed"
  assert.ok(M.swapNote(by('Pull-up'), by('Chin-up')).endsWith('same equipment, same tags, same technique'));
});

test('a swapped strength movement keeps the set count and brings its own reps', () => {
  const by = n => M.LIB.find(x => x.n === n);
  assert.strictEqual(M.detailFor(by('Good morning'), '4 × 3–5', 'hinge'), '4 × 8–12');
  assert.strictEqual(M.detailFor(by('Conventional deadlift'), '3 × 8–12', 'hinge'), '3 × 3–5');
});

test('a swapped mobility drill keeps its whole prescription', () => {
  const by = n => M.LIB.find(x => x.n === n);
  assert.strictEqual(M.detailFor(by('Bird dog'), '2 × 10', 'm_spine'), '8 each side');
  assert.strictEqual(M.detailFor(by('Pigeon'), '8 each side', 'm_hip'), '1 min each side');
});

console.log('\nsessions saved before roles existed');

test('an old item recovers its role from the library by name', () => {
  // what a saved session looked like: a name, a pattern, a prescription, nothing else
  const old = {name: 'Conventional deadlift', pattern: 'hinge', detail: '4 × 5–8'};
  assert.strictEqual(M.itemRole(old), 'main', 'the main lift would have swapped for an accessory');
  assert.strictEqual(M.itemRole({name: 'Biceps curl', pattern: 'acc', detail: '3 × 10'}), 'acc');
});

test('an unrecognised name falls back to accessory rather than throwing', () => {
  assert.strictEqual(M.itemRole({name: 'Something deleted', pattern: 'push'}), 'acc');
});

test('the note claims nothing about axes an old item never stored', () => {
  const old = {name: 'Conventional deadlift', pattern: 'hinge', detail: '4 × 5–8'};
  const by = n => M.LIB.find(x => x.n === n);
  assert.strictEqual(M.swapNote(old, by('Good morning')), 'Same slot',
    'invented a difference against fields the item does not have');
  // once recovered through movementFor it can speak again
  assert.strictEqual(M.swapNote(M.movementFor(old), by('Good morning')),
    'Same slot · no heavy grip');
});

console.log('\nthe library itself');

test('every movement has a role from the vocabulary', () => {
  const bad = M.LIB.filter(x => !M.ROLES[x.r]);
  assert.strictEqual(bad.length, 0, 'no role: ' + bad.map(x => x.n));
});

test('every strength movement has its own prescription', () => {
  const bad = M.LIB.filter(x => M.LOGGABLE.has(x.p) && !x.d);
  assert.strictEqual(bad.length, 0, 'no prescription: ' + bad.map(x => x.n));
});

test('every pattern a main slot asks for has a main to offer', () => {
  const wanted = new Set();
  Object.values(M.FOCUS).forEach(seq => seq.forEach(s => {
    if (s.r === 'main') String(s.p).split('|').forEach(p => wanted.add(p));
  }));
  for (const p of wanted)
    assert.ok(M.LIB.some(x => x.p === p && x.r === 'main'), 'no main movement for pattern ' + p);
});

console.log(`\n${ran - failed}/${ran} passed\n`);
process.exit(failed ? 1 : 0);
