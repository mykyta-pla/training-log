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

const store = new Map();
const sandbox = {document: undefined, localStorage: {
  getItem: k => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
}};
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync('movements.js', 'utf8') + `
  ;globalThis.__m = {LIB, FOCUS, REPS, ROLES, SLOT_ROLES, LOGGABLE, focusSequence,
    slotPool, drawStrength, orderStrength, swapNote, detailFor, roleOf, eligible,
    pickFresh, recencyMap, itemRole, movementFor, customMovements, allMovements,
    VARIETY, withSets, ownsSets, targetReps, DEMANDS, demandSteps, capDemand,
    demandRank};`, sandbox);
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
  const take = (pattern, role, drawn, test) => {
    const pool = role
      ? M.slotPool({p: pattern, r: role}, equip, avoid, used, drawn, test).pool
      : M.eligible(pattern, equip, avoid, used);
    const x = M.pickFresh(pool, rec || new Map());
    if (!x) return null;
    used.add(x.n);
    return {name: x.n, pattern, p: x.p, detail: x.d, t: x.t, r: M.roleOf(x), e: x.e,
            a: x.a || [], pl: x.pl, u: x.u, dm: x.dm};
  };
  take.used = used;
  return take;
}

// A full-body 60-minute session draws five exercises: build() gives the strength block
// 33 minutes at that total, and nEx is 5 once the block is 32 minutes or more.
const fullBody = (equip = 3, avoid = []) => {
  const t = taker(equip, avoid);
  return M.drawStrength(M.focusSequence(['full']), 5, t, [], t.used);
};

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

console.log('\nboth sides of an either|or slot');

test('a five-exercise full body trains the hinge and the squat, never one twice', () => {
  for (let i = 0; i < 400; i++) {
    const pats = fullBody().map(x => x.p);
    assert.ok(pats.includes('hinge'), 'no hinge: ' + pats.join(', '));
    assert.ok(pats.includes('squat'), 'no squat: ' + pats.join(', '));
  }
});

test('the wrap prefers the side the block has not used', () => {
  // asked for a hinge-or-squat secondary with the squat already spent
  const {pool} = M.slotPool({p: 'hinge|squat', r: 'sec'}, 3, [], new Set(), new Set(['squat']));
  assert.ok(pool.length, 'nothing offered');
  assert.ok(pool.every(x => x.p === 'hinge'), 'offered a squat: ' + pool.map(x => x.n));
  // and the other way round
  const b = M.slotPool({p: 'hinge|squat', r: 'sec'}, 3, [], new Set(), new Set(['hinge'])).pool;
  assert.ok(b.length && b.every(x => x.p === 'squat'), 'offered a hinge: ' + b.map(x => x.n));
});

test('with both sides used it goes back to drawing from either', () => {
  const {pool} = M.slotPool({p: 'hinge|squat', r: 'sec'}, 3, [], new Set(), new Set(['hinge', 'squat']));
  assert.ok(pool.some(x => x.p === 'hinge') && pool.some(x => x.p === 'squat'),
    'the tie-break outlived its tie');
});

test('freshness is a tie-break inside a role, never above it', () => {
  // squat spent, and the slot wants a main: the hinge mains and squat mains are both
  // main, so it stays among mains and prefers the hinge — it does not drop to a hinge
  // accessory to avoid a squat main
  const {pool, role} = M.slotPool({p: 'hinge|squat', r: 'main'}, 3, [], new Set(), new Set(['squat']));
  assert.strictEqual(role, 'main');
  assert.ok(pool.every(x => x.r === 'main'), 'left the role to chase a fresh side');
});

test('a single-pattern slot is unaffected by the tie-break', () => {
  const a = M.slotPool({p: 'push', r: 'sec'}, 3, [], new Set()).pool.map(x => x.n).sort();
  const b = M.slotPool({p: 'push', r: 'sec'}, 3, [], new Set(), new Set(['push'])).pool.map(x => x.n).sort();
  assert.deepStrictEqual(a, b);
});

console.log('\nfalling back when no main fits');

test('a main slot with no main in reach settles for a secondary', () => {
  // no push movement is both a main and doable with no equipment
  assert.ok(!M.LIB.some(x => x.p === 'push' && x.r === 'main' && x.e === 0));
  const {pool, role} = M.slotPool({p: 'push', r: 'main'}, 0, [], new Set());
  assert.strictEqual(role, 'sec', 'left the slot empty instead of settling');
  assert.ok(pool.length);
});

test('and falls all the way to accessory rather than leaving a hole', () => {
  const {pool, role} = M.slotPool({p: 'acc', r: 'main'}, 0, ['floor', 'deepknee'], new Set());
  assert.strictEqual(role, 'acc');
  assert.ok(pool.length);
});

test('bodyweight and dumbbells can now anchor a session', () => {
  // v2 added non-barbell mains on purpose; before it, every main needed a full gym
  const low = M.LIB.filter(x => x.r === 'main' && x.e < 3);
  assert.ok(low.length >= 4, 'expected non-barbell mains, found ' + low.length);
  for (let i = 0; i < 200; i++) {
    const items = fullBody(0);
    assert.strictEqual(items.length, 5, 'the block must still fill');
    assert.ok(items.filter(x => x.r === 'main').length <= 1, 'more than one main');
  }
});

test('two focuses merged still give one main', () => {
  for (let i = 0; i < 300; i++) {
    const t = taker(3, []);
    const items = M.drawStrength(M.focusSequence(['upper', 'lower']), 5, t, [], t.used);
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

console.log('\ndemand');

// the builder's take(), minus the DOM: the ladder is ambient, so drawStrength is untouched
function dmTaker(equip, level, avoid) {
  const used = new Set();
  const steps = M.demandSteps(level);
  const take = (pattern, role, drawn, test) => {
    let x = null;
    // a repair is the softest rule here and may not climb the ladder to satisfy itself
    for (const allow of (test ? steps.slice(0, 1) : steps)) {
      const dmOk = allow ? (m => allow.includes(m.dm)) : null;
      const filter = (test && dmOk) ? (m => test(m) && dmOk(m)) : (test || dmOk);
      const pool = role
        ? M.slotPool({p: pattern, r: role}, equip, avoid || [], used, drawn, filter).pool
        : M.eligible(pattern, equip, avoid || [], used).filter(m => !filter || filter(m));
      x = M.pickFresh(pool, new Map());
      if (x) break;
    }
    if (!x) return null;
    used.add(x.n);
    return {name: x.n, pattern, p: x.p, detail: x.d, t: x.t, r: M.roleOf(x), e: x.e,
            a: x.a || [], pl: x.pl, u: x.u, dm: x.dm};
  };
  take.used = used;
  return take;
}
// one mobility block, drawn the way the builder draws it
const mobBlock = (level, equip = 3, n = 4) => {
  const take = dmTaker(equip, level);
  const areas = ['shoulder', 'hip', 'spine', 'neck'], out = [];
  for (let i = 0; i < n; i++) { const it = take('m_' + areas[i % areas.length], null); if (it) out.push(it); }
  return out;
};

test('the ladder falls towards the middle, and ends unrestricted', () => {
  const steps = l => JSON.stringify(M.demandSteps(l));
  assert.strictEqual(steps('hard'),    '[[3],[2,3],null]');
  assert.strictEqual(steps('light'),   '[[1,2],[2,3],null]');
  assert.strictEqual(steps('working'), '[[2,3],null]');
  // an unknown level is Working, not a crash and not a filter that matches nothing
  assert.strictEqual(steps('nonsense'), '[[2,3],null]');
});

test('at Hard a mobility block draws demanding movements where the area has them', () => {
  // m_neck tops out at dm 2 — the ladder settles for Working there rather than coming
  // back empty, which is the preference doing its job, not a failure
  const hasHard = p => M.LIB.some(x => x.p === p && x.dm === 3);
  for (let i = 0; i < 200; i++) {
    const items = mobBlock('hard');
    assert.strictEqual(items.length, 4, 'the block came back short');
    for (const x of items)
      if (hasHard('m_' + ['shoulder','hip','spine','neck'].find(a => 'm_' + a === x.pattern)?.replace(/^/, '') ))
        assert.strictEqual(x.dm, 3, x.name + ' is dm ' + x.dm + ' where the area has dm 3');
  }
});

test('an area with nothing demanding settles for Working rather than emptying', () => {
  const neckMax = Math.max(...M.LIB.filter(x => x.p === 'm_neck').map(x => x.dm));
  assert.strictEqual(neckMax, 2, 'm_neck gained a dm 3 movement — tighten this test');
  const take = dmTaker(3, 'hard');
  const out = [];
  for (let i = 0; i < 3; i++) { const it = take('m_neck', null); if (it) out.push(it); }
  assert.strictEqual(out.length, 3, 'Hard emptied the neck area');
  assert.ok(out.every(x => x.dm === 2), 'settled below Working: ' + out.map(x => x.dm));
});

test('at Light nothing demanding is drawn', () => {
  for (let i = 0; i < 200; i++)
    for (const x of mobBlock('light'))
      assert.ok(x.dm <= 2, x.name + ' is dm ' + x.dm + ' in a Light block');
});

test('a Light strength block stays at or under dm 2', () => {
  for (let i = 0; i < 200; i++) {
    const t = dmTaker(3, 'light');
    for (const x of M.drawStrength(M.focusSequence(['full']), 5, t, [], t.used))
      assert.ok(x.dm <= 2, x.name + ' is dm ' + x.dm + ' in a Light block');
  }
});

test('demand is a preference — a block is never returned empty over it', () => {
  // bands only, avoiding most of the library: whatever is left, Hard still fills the block
  for (const level of ['light', 'working', 'hard']) {
    const take = dmTaker(1, level, ['floor', 'grip', 'overhead', 'deepknee', 'jump']);
    const out = [];
    for (let i = 0; i < 3; i++) { const it = take('m_neck', null); if (it) out.push(it); }
    assert.ok(out.length >= 1, level + ' emptied the block');
  }
});

test('readiness outranks the control', () => {
  assert.strictEqual(M.capDemand('hard', 'light'), 'light');
  assert.strictEqual(M.capDemand('hard', 'working'), 'working');
  assert.strictEqual(M.capDemand('light', 'working'), 'light');   // a cap only lowers
  assert.strictEqual(M.capDemand('hard', null), 'hard');
});

test('on a red band nothing above dm 2 appears anywhere', () => {
  for (const asked of ['light', 'working', 'hard']) {
    const level = M.capDemand(asked, 'light');           // red caps at Light
    for (let i = 0; i < 120; i++) {
      for (const x of mobBlock(level))
        assert.ok(x.dm <= 2, `${x.name} dm ${x.dm} got through with ${asked} capped to ${level}`);
      const t = dmTaker(3, level);
      for (const x of M.drawStrength(M.focusSequence(['full']), 5, t, [], t.used))
        assert.ok(x.dm <= 2, `${x.name} dm ${x.dm} got through in strength`);
    }
  }
});

test('demand does not break the rules above it', () => {
  for (const level of ['light', 'working', 'hard']) {
    for (let i = 0; i < 150; i++) {
      const t = dmTaker(3, level);
      const items = M.drawStrength(M.focusSequence(['full']), 5, t, [], t.used);
      assert.strictEqual(items.length, 5, level + ': block came back short');
      assert.ok(items.filter(x => x.r === 'main').length <= 1, level + ': more than one main');
      if (items.some(x => x.r === 'main')) assert.strictEqual(items[0].r, 'main', level + ': main not first');
      assert.strictEqual(new Set(items.map(x => x.name)).size, items.length, level + ': drew a movement twice');
      const pats = items.map(x => x.p);
      assert.ok(pats.includes('hinge') && pats.includes('squat'), level + ': either|or broken — ' + pats);
    }
  }
});

test('the library serves Hard everywhere except the neck, which is known', () => {
  for (const p of ['m_shoulder', 'm_hip', 'm_spine', 'core', 'fin', 'hinge', 'squat', 'push', 'pull'])
    assert.ok(M.LIB.some(x => x.p === p && x.dm === 3), 'nothing demanding in ' + p);
  assert.ok(!M.LIB.some(x => x.p === 'm_neck' && x.dm === 3),
    'm_neck gained a dm 3 movement — the Hard fallback test above assumes it has none');
});

console.log('\nprecedence — the order of authority in CLAUDE.md');

test('the three hard rules hold under maximum pressure', () => {
  // red band capping Hard to Light, five avoid tags, dumbbells only: the case where
  // every soft rule has the strongest possible reason to reach past a hard one
  const avoid = ['floor', 'grip', 'overhead', 'deepknee', 'jump'];
  const cap = M.capDemand('hard', 'light');
  for (let i = 0; i < 400; i++) {
    const t = dmTaker(2, cap, avoid);
    for (const x of M.drawStrength(M.focusSequence(['full']), 5, t, [], t.used)) {
      assert.ok(x.dm <= 2, `1. readiness cap: ${x.name} is dm ${x.dm}`);
      assert.ok(!x.a.some(g => avoid.includes(g)), `2. avoid tags: ${x.name} has ${x.a}`);
      assert.ok(x.e <= 2, `3. equipment: ${x.name} needs e${x.e}`);
    }
  }
});

test('a variety repair yields rather than breaking a rule above it', () => {
  // the case that produced the rule: the only transverse hinge in the library is dm 3,
  // so at Light the plane repair can only be satisfied by escalating demand. It must
  // decline instead.
  const transHinge = M.LIB.filter(x => x.p === 'hinge' && x.pl !== 'sag');
  assert.strictEqual(transHinge.length, 1, 'the library gained another non-sagittal hinge');
  assert.strictEqual(transHinge[0].dm, 3, transHinge[0].n + ' is no longer dm 3');
  for (let i = 0; i < 400; i++) {
    const t = dmTaker(3, 'light');
    const items = M.drawStrength(M.focusSequence(['full']), 5, t, [], t.used);
    assert.ok(items.every(x => x.dm <= 2), '6 escalated 5: ' + items.map(x => x.name + '/' + x.dm));
    const pats = items.map(x => x.p);
    assert.ok(pats.includes('hinge') && pats.includes('squat'), '6 broke 4: ' + pats);
  }
});

console.log('\nvariety: plane and unilateral');

const sagittal = x => !!x.pl && x.pl !== 'sag';

test('a session gets at least one movement out of the sagittal plane', () => {
  let missed = 0;
  for (let i = 0; i < 400; i++) if (!fullBody().some(sagittal)) missed++;
  assert.strictEqual(missed, 0, missed + '/400 sessions were entirely sagittal');
});

test('a session gets at least one unilateral movement', () => {
  let missed = 0;
  for (let i = 0; i < 400; i++) if (!fullBody().some(x => x.u)) missed++;
  assert.strictEqual(missed, 0, missed + '/400 sessions had nothing unilateral');
});

test('both hold at every equipment level the pool can serve', () => {
  for (const equip of [0, 1, 2, 3]) {
    for (let i = 0; i < 120; i++) {
      const items = fullBody(equip);
      assert.ok(items.some(sagittal), 'equip ' + equip + ': all sagittal — ' + items.map(x => x.name));
      assert.ok(items.some(x => x.u), 'equip ' + equip + ': none unilateral — ' + items.map(x => x.name));
    }
  }
});

test('they are soft — a pool with neither still yields a session', () => {
  // band-only pull, where the eligible movements are sagittal and bilateral
  const t = taker(1, ['floor', 'grip', 'overhead', 'deepknee', 'jump']);
  const items = M.drawStrength([{p: 'pull', r: 'sec'}, {p: 'pull', r: 'acc'}], 2, t, [], t.used);
  assert.ok(items.length >= 1, 'the invariants emptied the session');
});

test('fixing one invariant never costs the other', () => {
  for (let i = 0; i < 400; i++) {
    const items = fullBody();
    assert.ok(items.some(sagittal) && items.some(x => x.u),
      'ended with only one of the two: ' + items.map(x => x.name + '/' + x.pl + (x.u ? '/u' : '')));
  }
});

test('the invariants do not break the rules above them', () => {
  for (let i = 0; i < 300; i++) {
    const items = fullBody();
    assert.strictEqual(items.filter(x => x.r === 'main').length, 1, 'main count changed');
    assert.strictEqual(items[0].r, 'main', 'main is no longer first');
    assert.strictEqual(new Set(items.map(x => x.name)).size, items.length, 'a movement was drawn twice');
    const pats = items.map(x => x.p);
    assert.ok(pats.includes('hinge') && pats.includes('squat'), 'either|or rule broken: ' + pats);
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

test('a prescription that counts its own sets is not given a second count', () => {
  // v2 movements carry whole prescriptions where a set count is part of the thing:
  // a pistol squat is 4 × 5 a side, and Heavy Slow Resistance is its tempo
  assert.strictEqual(M.withSets(3, '4 × 5 each side'), '4 × 5 each side');
  assert.strictEqual(M.withSets(3, '4 × 6, 3 sec up and 3 sec down'), '4 × 6, 3 sec up and 3 sec down');
  assert.strictEqual(M.withSets(3, '3–5'), '3 × 3–5');
  assert.strictEqual(M.ownsSets('3 × 12–15'), true);
  assert.strictEqual(M.ownsSets('8–12 each side'), false);
});

test('no strength movement can produce a doubled set count', () => {
  for (const x of M.LIB.filter(x => M.LOGGABLE.has(x.p))) {
    const out = M.withSets(3, x.d);
    assert.ok(!/^\s*\d+\s*×\s*\d+\s*×/.test(out), x.n + ' → ' + out);
  }
});

test('the reps box fills from a fixed prescription as well as a range', () => {
  assert.strictEqual(M.targetReps('4 × 5 each side'), '5');
  assert.strictEqual(M.targetReps('3–5'), '3');
  assert.strictEqual(M.targetReps('3 × 12–15'), '12');
});

test('a swapped mobility drill keeps its whole prescription', () => {
  const by = n => M.LIB.find(x => x.n === n);
  assert.strictEqual(M.detailFor(by('Bird dog'), '2 × 10', 'm_spine'), '8 each side');
  assert.strictEqual(M.detailFor(by('Pigeon'), '8 each side', 'm_hip'), '1 min each side');
});

console.log('\nthe role you choose on a movement you added');

test('a movement you called a main lift anchors the session', () => {
  store.set('tl.custom', JSON.stringify([
    {n: 'Zercher squat', p: 'squat', e: 3, a: [], d: '5–8', t: 'c', r: 'main'},
    {n: 'Band pull-through', p: 'hinge', e: 1, a: [], d: '12–15', t: 's', r: 'acc'}]));
  try {
    for (let i = 0; i < 100; i++) {
      const items = fullBody();
      assert.strictEqual(items[0].name, 'Zercher squat',
        'yours is the only main available and did not go first: ' + items.map(x => x.name));
      assert.notStrictEqual(items[0].name, 'Band pull-through');
    }
  } finally { store.delete('tl.custom'); }
});

test('a movement you added with no role is a secondary, never the anchor', () => {
  store.set('tl.custom', JSON.stringify([{n: 'Mystery lift', p: 'squat', e: 3, a: [], d: '8', t: 's'}]));
  try {
    assert.strictEqual(M.customMovements()[0].r, 'sec');
    for (let i = 0; i < 100; i++)
      assert.notStrictEqual(fullBody()[0].name, 'Mystery lift', 'an unlabelled movement anchored a session');
  } finally { store.delete('tl.custom'); }
});

test('a movement somebody else shared is an accessory whatever it claims', () => {
  store.set('tl.usecommunity', '1');
  store.set('tl.community', JSON.stringify([{n: 'Stranger lift', p: 'squat', e: 0, a: [], d: '5', t: 's', r: 'main'}]));
  try {
    const it = M.allMovements().find(x => x.n === 'Stranger lift');
    assert.ok(it, 'the community tier did not load');
    assert.strictEqual(it.r, 'acc', 'a shared movement kept a role it sent');
  } finally { store.delete('tl.community'); store.delete('tl.usecommunity'); }
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

test('Box jump is a finisher, not a squat', () => {
  const bj = M.LIB.find(x => x.n === 'Box jump');
  assert.strictEqual(bj.p, 'fin', 'three or five jumps are power work, not a squat slot');
  assert.ok(bj.a.includes('jump'));
});

test('a finisher carries a whole prescription, not a bare rep range', () => {
  // only strength gets a set count written in front of it; anywhere else a bare "3–5"
  // reaches the card as "3–5" and means nothing
  const bad = M.LIB.filter(x => !M.LOGGABLE.has(x.p) && /^\s*\d+\s*[–—-]\s*\d+\s*$/.test(x.d || ''));
  assert.strictEqual(bad.length, 0, 'bare rep range outside strength: ' + bad.map(x => x.n));
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
