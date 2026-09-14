/* The movement library. Shared by the builder and the video library — one source of truth. */

/* Every movement carries three axes beside its pattern:

   e  equipment, 0–3      the least kit it needs
   t  technique, s|p|c    how much skill it asks for, not how hard it feels
   r  role, main|sec|acc  what it can carry in a session

   Role is independent of the other two. A back squat is a main because it is the
   heaviest, most systemically demanding thing you would do that day — not because
   it is coached, and not because it needs a rack. A goblet squat needs the same
   pattern and less skill and is still only secondary, because its loading ceiling
   is low. Role decides which slot a movement may fill and what order the block is
   written in; equipment and avoid tags decide whether it may appear at all.

   d  is the movement's own prescription. For strength it is a rep range alone —
   the builder puts the set count in front of it, because that scales with the time
   you have. For mobility, core and finishers it is the whole prescription, because
   nothing scales it. */

const LIB = [
  // mobility — shoulders & upper back
  {n:'Band shoulder dislocations', p:'m_shoulder', e:1, a:[],            d:'2 × 10', t:'p', r:'acc'},
  {n:'Wall slides',                p:'m_shoulder', e:0, a:[],            d:'2 × 10', t:'s', r:'acc'},
  {n:'Prone Y/T/W raises',         p:'m_shoulder', e:0, a:['floor'],     d:'2 × 8 each', t:'s', r:'acc'},
  {n:'Doorway pec stretch',        p:'m_shoulder', e:0, a:[],            d:'30 sec each side', t:'s', r:'acc'},
  {n:'Thread the needle',          p:'m_shoulder', e:0, a:['floor'],     d:'8 each side', t:'s', r:'acc'},
  {n:'Banded face pulls, light',   p:'m_shoulder', e:1, a:[],            d:'2 × 15', t:'s', r:'acc'},
  {n:'Foam roller thoracic extensions', p:'m_shoulder', e:2, a:['floor'],d:'1–2 min', t:'s', r:'acc'},
  // mobility — hips
  {n:'90/90 hip rotations',        p:'m_hip', e:0, a:['floor'],          d:'8 each side', t:'s', r:'acc'},
  {n:'Kneeling hip flexor stretch',p:'m_hip', e:0, a:['floor'],          d:'45 sec each side', t:'s', r:'acc'},
  {n:"World's greatest stretch",   p:'m_hip', e:0, a:['floor'],          d:'5 each side', t:'s', r:'acc'},
  {n:'Pigeon',                     p:'m_hip', e:0, a:['floor'],          d:'1 min each side', t:'s', r:'acc'},
  {n:'Cossack stretch, unloaded, partial range', p:'m_hip', e:0, a:['floor','deepknee'], d:'8 each side', t:'s', r:'acc'},
  {n:'Couch stretch',              p:'m_hip', e:0, a:['floor'],          d:'45 sec each side', t:'s', r:'acc'},
  {n:'Banded hip openers',         p:'m_hip', e:1, a:['floor'],          d:'10 each direction', t:'s', r:'acc'},
  {n:'Standing hip circles',       p:'m_hip', e:0, a:[],                 d:'10 each direction', t:'s', r:'acc'},
  // mobility — spine
  {n:'Cat-cow with thoracic rotation', p:'m_spine', e:0, a:['floor'],    d:'8 each direction', t:'s', r:'acc'},
  {n:'Bird dog',                   p:'m_spine', e:0, a:['floor'],        d:'8 each side', t:'s', r:'acc'},
  {n:'Dead bug',                   p:'m_spine', e:0, a:['floor'],        d:'8 each side', t:'s', r:'acc'},
  {n:'Open book',                  p:'m_spine', e:0, a:['floor'],        d:'8 each side', t:'s', r:'acc'},
  {n:'Supine spinal twist',        p:'m_spine', e:0, a:['floor'],        d:'30 sec each side', t:'s', r:'acc'},
  {n:'Standing side bend',         p:'m_spine', e:0, a:[],               d:'8 each side', t:'s', r:'acc'},
  // mobility — neck & traps
  {n:'Upper trap release, hands or ball', p:'m_neck', e:0, a:[],         d:'30 sec each side', t:'s', r:'acc'},
  {n:'Levator scapulae stretch',   p:'m_neck', e:0, a:[],                d:'30 sec each side', t:'s', r:'acc'},
  {n:'Chin tucks',                 p:'m_neck', e:0, a:[],                d:'2 × 10', t:'s', r:'acc'},
  {n:'Suboccipital release, towel under the skull', p:'m_neck', e:0, a:['floor'], d:'1 min', t:'s', r:'acc'},

  // hinge
  {n:'Trap-bar deadlift',    p:'hinge', e:3, a:['grip'], d:'3–5', t:'p', r:'main'},
  {n:'Conventional deadlift',p:'hinge', e:3, a:['grip'], d:'3–5', t:'c', r:'main'},
  {n:'Romanian deadlift',    p:'hinge', e:2, a:['grip'], d:'6–10', t:'p', r:'sec'},
  {n:'Single-leg RDL',       p:'hinge', e:2, a:[],       d:'8–12 each side', t:'p', r:'acc'},
  {n:'Hip thrust',           p:'hinge', e:3, a:[],       d:'8–12', t:'p', r:'sec'},
  {n:'Kettlebell swing',     p:'hinge', e:2, a:['grip'], d:'10–15', t:'c', r:'sec'},
  {n:'Good morning',         p:'hinge', e:3, a:[],       d:'8–12', t:'c', r:'sec'},
  {n:'Glute bridge',         p:'hinge', e:0, a:['floor'],d:'12–15', t:'s', r:'acc'},
  // squat
  {n:'Back squat',           p:'squat', e:3, a:[],           d:'4–6', t:'c', r:'main'},
  {n:'Front squat',          p:'squat', e:3, a:[],           d:'3–6', t:'c', r:'main'},
  {n:'Goblet squat',         p:'squat', e:2, a:[],           d:'8–12', t:'s', r:'sec'},
  {n:'Leg press',            p:'squat', e:3, a:[],           d:'8–12', t:'s', r:'sec'},
  {n:'Bulgarian split squat',p:'squat', e:2, a:[],           d:'8–12 each side', t:'p', r:'sec'},
  {n:'Walking lunge',        p:'squat', e:2, a:[],           d:'10–12 each side', t:'s', r:'acc'},
  {n:'Step-up',              p:'squat', e:2, a:[],           d:'8–12 each side', t:'s', r:'acc'},
  {n:'Bodyweight squat',     p:'squat', e:0, a:[],           d:'15–20', t:'s', r:'acc'},
  {n:'Cossack squat',        p:'squat', e:0, a:['deepknee'], d:'6–8 each side', t:'p', r:'acc'},
  {n:'Deep ATG squat',       p:'squat', e:3, a:['deepknee'], d:'5–8', t:'c', r:'sec'},
  {n:'Box jump',             p:'squat', e:3, a:['jump'],     d:'3–5', t:'p', r:'sec'},
  // push
  {n:'Barbell bench press',   p:'push', e:3, a:[],                  d:'4–6', t:'p', r:'main'},
  {n:'Dumbbell bench press',  p:'push', e:2, a:[],                  d:'8–12', t:'s', r:'sec'},
  {n:'Incline dumbbell press',p:'push', e:2, a:[],                  d:'8–12', t:'s', r:'sec'},
  {n:'Overhead press',        p:'push', e:3, a:['overhead'],        d:'5–8', t:'p', r:'main'},
  {n:'Dumbbell shoulder press',p:'push',e:2, a:['overhead'],        d:'8–12', t:'s', r:'sec'},
  {n:'Push-up',               p:'push', e:0, a:['floor'],           d:'10–20', t:'s', r:'acc'},
  {n:'Loaded push-up',        p:'push', e:2, a:['floor'],           d:'8–12', t:'s', r:'sec'},
  {n:'Dip',                   p:'push', e:3, a:[],                  d:'6–10', t:'p', r:'sec'},
  {n:'Cable fly',             p:'push', e:3, a:[],                  d:'12–15', t:'s', r:'acc'},
  {n:'Pike push-up',          p:'push', e:0, a:['floor','overhead'],d:'6–10', t:'p', r:'sec'},
  // pull
  {n:'Pull-up',           p:'pull', e:3, a:['grip'], d:'5–8', t:'p', r:'sec'},
  {n:'Chin-up',           p:'pull', e:3, a:['grip'], d:'5–8', t:'p', r:'sec'},
  {n:'Weighted pull-up',  p:'pull', e:3, a:['grip'], d:'3–6', t:'p', r:'main'},
  {n:'Lat pulldown',      p:'pull', e:3, a:[],       d:'8–12', t:'s', r:'sec'},
  {n:'Barbell row',       p:'pull', e:3, a:['grip'], d:'6–10', t:'p', r:'main'},
  {n:'Dumbbell row',      p:'pull', e:2, a:[],       d:'8–12 each side', t:'s', r:'sec'},
  {n:'Cable row',         p:'pull', e:3, a:[],       d:'8–12', t:'s', r:'sec'},
  {n:'Inverted row',      p:'pull', e:3, a:[],       d:'10–15', t:'s', r:'acc'},
  {n:'Face pull',         p:'pull', e:1, a:[],       d:'12–20', t:'s', r:'acc'},
  {n:'Band pull-apart',   p:'pull', e:1, a:[],       d:'15–20', t:'s', r:'acc'},
  // accessory
  {n:'Lateral raise',     p:'acc', e:2, a:[], d:'12–15', t:'s', r:'acc'},
  {n:'Biceps curl',       p:'acc', e:2, a:[], d:'10–15', t:'s', r:'acc'},
  {n:'Triceps extension', p:'acc', e:2, a:[], d:'10–15', t:'s', r:'acc'},
  {n:'Calf raise',        p:'acc', e:0, a:[], d:'12–20', t:'s', r:'acc'},
  {n:'Rear delt fly',     p:'acc', e:2, a:[], d:'12–20', t:'s', r:'acc'},
  // core
  {n:'Plank',             p:'core', e:0, a:['floor'], d:'30–60 sec', t:'s', r:'acc'},
  {n:'Side plank',        p:'core', e:0, a:['floor'], d:'30–45 sec each', t:'s', r:'acc'},
  {n:'Hollow hold',       p:'core', e:0, a:['floor'], d:'20–40 sec', t:'p', r:'acc'},
  {n:'Dead bug',          p:'core', e:0, a:['floor'], d:'8–12 each side', t:'s', r:'acc'},
  {n:'Hanging leg raise', p:'core', e:3, a:['grip'],  d:'8–12', t:'p', r:'sec'},
  {n:'Ab wheel rollout',  p:'core', e:3, a:['floor'], d:'6–10', t:'p', r:'sec'},
  {n:'Pallof press',      p:'core', e:1, a:[],        d:'10–12 each side', t:'s', r:'acc'},
  {n:'Russian twist',     p:'core', e:0, a:['floor'], d:'12–16 each side', t:'s', r:'acc'},
  {n:'Suitcase carry',    p:'core', e:2, a:['grip'],  d:'30 m each side', t:'s', r:'sec'},
  // finisher
  {n:'Rower intervals',      p:'fin', e:3, a:['grip'],         d:'5 × 250 m, 1 min rest', t:'p', r:'sec'},
  {n:'Assault bike sprints', p:'fin', e:3, a:[],               d:'6 × 20 sec hard, 40 sec easy', t:'s', r:'sec'},
  {n:'Wall ball',            p:'fin', e:3, a:['overhead'],     d:'3 × 15', t:'p', r:'sec'},
  {n:'Kettlebell swings',    p:'fin', e:2, a:['grip'],         d:'5 × 15, 30 sec rest', t:'c', r:'sec'},
  {n:'Farmer’s carry',       p:'fin', e:2, a:['grip'],         d:'4 × 40 m', t:'s', r:'sec'},
  {n:'Battle ropes',         p:'fin', e:3, a:['grip'],         d:'6 × 20 sec', t:'s', r:'acc'},
  {n:'Burpees',              p:'fin', e:0, a:['jump','floor'], d:'5 × 8', t:'s', r:'sec'},
  {n:'Mountain climbers',    p:'fin', e:0, a:['floor'],        d:'4 × 40 sec', t:'s', r:'acc'},
  {n:'Jump rope',            p:'fin', e:0, a:['jump'],         d:'5 × 1 min', t:'s', r:'acc'},
];

/* A starting load in kg for someone of ordinary strength, used to prefill the log on a
   saved session so there is something to correct rather than an empty box. Nobody's real
   numbers and not a recommendation — a neutral middle to type over. Dumbbell movements are
   per hand. 'BW' means bodyweight. Anything missing here starts blank. */
const START_KG = {
  // hinge
  'Trap-bar deadlift':60, 'Conventional deadlift':60, 'Romanian deadlift':50,
  'Single-leg RDL':14, 'Hip thrust':50, 'Kettlebell swing':16, 'Good morning':30,
  'Glute bridge':'BW',
  // squat
  'Back squat':50, 'Front squat':35, 'Goblet squat':18, 'Leg press':80,
  'Bulgarian split squat':12, 'Walking lunge':12, 'Step-up':12, 'Bodyweight squat':'BW',
  'Cossack squat':'BW', 'Deep ATG squat':20, 'Box jump':'BW',
  // push
  'Barbell bench press':45, 'Dumbbell bench press':18, 'Incline dumbbell press':14,
  'Overhead press':30, 'Dumbbell shoulder press':12, 'Push-up':'BW', 'Loaded push-up':10,
  'Dip':'BW', 'Cable fly':12, 'Pike push-up':'BW',
  // pull
  'Pull-up':'BW', 'Chin-up':'BW', 'Weighted pull-up':5, 'Lat pulldown':40, 'Barbell row':40,
  'Dumbbell row':20, 'Cable row':40, 'Inverted row':'BW', 'Face pull':15, 'Band pull-apart':'BW',
  // accessory
  'Lateral raise':7, 'Biceps curl':10, 'Triceps extension':12, 'Calf raise':20, 'Rear delt fly':7,
};

/* Planned loads. What goes in the boxes before you have typed anything, and how a set reads
   back as text. Sessions fills its log with these; the builder puts the same numbers into the
   prompt it hands your tracker, so the workout you log there is the one you planned here. */

// Only these carry a load worth logging. Mobility, core and finishers are ticked, not weighed.
const LOGGABLE = new Set(['hinge', 'squat', 'push', 'pull', 'acc']);

const setLabel = st => (st && (st.kg || st.reps))
  ? `${st.kg || '—'}${st.reps ? ' × ' + st.reps : ''}` : '';

const setsSummary = it => Array.isArray(it.sets)
  ? it.sets.map(setLabel).filter(Boolean).join(', ') : (it.load || '');

// the sets you logged the last time this movement came up in a finished session
function lastLoggedSets(name, done) {
  for (const s of done || []) {
    for (const b of s.blocks || []) {
      for (const it of b.items || []) {
        if (it.name === name && Array.isArray(it.sets) && it.sets.some(x => x.kg || x.reps))
          return it.sets;
      }
    }
  }
  return null;
}

// "3 × 6–10" is 3 sets of 6; "8–12 reps" is 8. The bottom of the range, not the top.
const setCount   = d => { const m = (d || '').match(/^(\d+)\s*×/); return m ? Math.min(8, Math.max(1, +m[1])) : 3; };
const targetReps = d => { const m = (d || '').match(/(\d+)\s*[–—-]\s*(\d+)/); return m ? m[1] : ''; };
const startLoad  = n => { const v = START_KG[n]; return v == null ? '' : String(v); };

// What you lifted last time wins, set by set; otherwise an ordinary starting load.
function plannedSets(it, done) {
  const n = setCount(it.detail), reps = targetReps(it.detail);
  const prev = lastLoggedSets(it.name, done);
  return Array.from({length: n}, (_, i) => {
    const p = prev && prev[i];
    return {
      kg:   (p && p.kg)   ? p.kg   : startLoad(it.name),
      reps: (p && p.reps) ? p.reps : reps,
      done: false,
      prev: setLabel(p),
    };
  });
}

/* The prompt you paste into your tracker's own AI chat to get the workout logged there. It
   is a statement, not a question: the session is drawn, saved and open in front of you. So it
   says what you are doing, with the weights you plan to lift, and asks for it back as a
   workout ready to save. Nothing about recovery, nothing to argue with. */

// which tracker's chat this is headed for — set in the builder's readiness panel
const TRACKER_KEY = 'tl.tracker';
const trackerName = () => {
  try { return localStorage.getItem(TRACKER_KEY) || 'Whoop'; } catch (_) { return 'Whoop'; }
};

function trackerSessionPrompt(S, done) {
  const L = [];

  L.push(`I'm training today and I log my workouts in ${trackerName()}. Here is exactly what`);
  L.push('I am doing. Set it up as a workout I can save and log.');
  L.push('');
  L.push(`TODAY — ${S.total} min in total`);

  (S.blocks || []).forEach(b => {
    L.push('');
    L.push(`${b.title} — ${b.mins} min`);
    if (b.sub) L.push(`  ${b.sub}`);
    (b.items || []).forEach(it => {
      const pat = String(it.pattern || '').split('|')[0];
      if (!LOGGABLE.has(pat)) {           // mobility, core, finisher: as prescribed, no load
        L.push(`  - ${it.name}${it.detail ? ' — ' + it.detail : ''}`);
        return;
      }
      // one line per movement, carrying the loads in the boxes — corrections included
      const sets = Array.isArray(it.sets) && it.sets.length ? it.sets : plannedSets(it, done);
      const shown = sets.map(st => {
        const kg = st.kg === 'BW' ? 'bodyweight' : (st.kg ? st.kg + ' kg' : 'no load set');
        return `${kg} × ${st.reps || '?'}`;
      });
      const same = shown.every(x => x === shown[0]);
      L.push(`  - ${it.name} — ${sets.length} sets: ` +
             (same ? `${shown[0]} each` : shown.join(', ')));
    });
  });

  L.push('');
  L.push('The weights are what I lifted last time, or an ordinary starting load where the');
  L.push('movement is new to me. I will correct them in the app if the day goes differently.');
  L.push('');
  L.push('Build it as a workout ready to save and log: closest activity type, the duration');
  L.push('above, and the movements in with their sets, reps and weights. This is what I am');
  L.push('doing today — I am not asking whether I should.');
  return L.join('\n');
}

/* Movements you added yourself, from a video you found somewhere. Same shape as the library
   above — name, pattern, equipment level, avoid tags, prescription — plus the link it came
   from and a flag. Stored in this browser, never uploaded, and drawn FIRST: a movement you
   went looking for beats one of the defaults. */

const CUSTOM_KEY = 'tl.custom';
const COMMUNITY_KEY = 'tl.community';      // last list fetched from the shared library
const USE_COMMUNITY_KEY = 'tl.usecommunity';

/* The third axis, beside equipment and avoid tags: how much skill a movement asks for,
   not how hard it feels. A goblet squat is straightforward and can still finish you. */
const TECHNIQUE = {
  s: ['Straightforward', 'pick it up and do it'],
  p: ['Practised', 'you should have done it before'],
  c: ['Coached', 'learn it from a person, not a video'],
};
const techLabel = t => (TECHNIQUE[t] || TECHNIQUE.s)[0];
const techNote  = t => (TECHNIQUE[t] || TECHNIQUE.s)[1];

/* Role: what a movement can carry, not what it trains. Ordered — a session is written
   heaviest first, and ROLES is that order. */
const ROLES = {
  main: ['Main lift', 'can anchor the session'],
  sec:  ['Secondary', 'substantial, but not the anchor'],
  acc:  ['Accessory', 'assistance and isolation'],
};
const ROLE_ORDER = ['main', 'sec', 'acc'];
const roleOf    = x => (x && ROLES[x.r]) ? x.r : 'acc';
const roleLabel = r => (ROLES[r] || ROLES.acc)[0];
const roleRank  = r => { const i = ROLE_ORDER.indexOf(r); return i < 0 ? 2 : i; };

/* Which roles a slot will accept, best first.

   A main slot takes a main, and settles for less rather than leaving a hole — at 60 kg of
   dumbbells there is no main hinge in the library, and the answer to that is a Romanian
   deadlift, not an empty first line.

   Nothing else will take a main. That is what keeps a session to one: the rule is enforced
   by what a slot is allowed to draw, not by counting afterwards. */
const SLOT_ROLES = {
  main: ['main', 'sec', 'acc'],
  sec:  ['sec', 'acc'],
  acc:  ['acc', 'sec'],
};

/* Avoid tags in words, for saying out loud what changed when a movement is swapped. */
const AVOID_LABEL = {
  deepknee: 'deep knee flexion', overhead: 'overhead loading',
  jump: 'jumping and impact', floor: 'floor work', grip: 'heavy grip',
};

/* The rating as it appears on a movement card in a session. Coached is never folded
   away — it is the one that changes what you should do about the movement. A rating
   that came from the shared library says so: nobody checked it. */
function techTag(it) {
  if (!it || !it.t || !TECHNIQUE[it.t]) return '';
  const unver = it.community ? ' <span class="unver">self-reported</span>' : '';
  return `<span class="tech t-${it.t}">${techLabel(it.t)}${unver}</span>`;
}

/* A session item is not a library record. It carries a name and a prescription, and —
   only if it was drawn after roles existed — a role. Sessions saved before that have
   neither r nor the equipment level and avoid tags a swap wants to compare against, so
   look the movement back up by name. Without this, swapping the main lift of an old
   session would draw from the accessories. */
const movementFor = it => (it && allMovements().find(x => x.n === it.name)) || it || {};
const itemRole = it => (it && ROLES[it.r]) ? it.r : roleOf(movementFor(it));

/* The role on a card. Only the main lift is marked: it is the one whose position in the
   session is a claim — this is the heaviest thing today and it goes first. Secondary and
   accessory are what everything else already looks like, so labelling them says nothing. */
function roleTag(it) {
  return (it && itemRole(it) === 'main') ? `<span class="role">${roleLabel('main')}</span>` : '';
}

function customMovements() {
  try {
    const v = JSON.parse(localStorage.getItem(CUSTOM_KEY) || '[]');
    return Array.isArray(v)
      ? v.filter(x => x && x.n && x.p)
          .map(x => ({...x, a: x.a || [], e: +x.e || 0, t: x.t || 's',
                      r: ROLES[x.r] ? x.r : 'sec', mine: true}))
      : [];
  } catch (_) { return []; }
}

function saveCustomMovements(list) {
  try { localStorage.setItem(CUSTOM_KEY, JSON.stringify(list)); return true; }
  catch (_) { return false; }
}

/* Movements other people have shared. They are nobody's but the person who sent them:
   unreviewed, and their technique rating is self-reported. They are drawn only if you have
   asked for them, and they are drawn last. The list is whatever the shared library last
   returned, cached here so a draw still works with the API unreachable. */

const useCommunity = () => {
  try { return localStorage.getItem(USE_COMMUNITY_KEY) === '1'; } catch (_) { return false; }
};
const setUseCommunity = on => {
  try { localStorage.setItem(USE_COMMUNITY_KEY, on ? '1' : '0'); } catch (_) {}
};

function communityMovements() {
  if (!useCommunity()) return [];
  try {
    const v = JSON.parse(localStorage.getItem(COMMUNITY_KEY) || '[]');
    return Array.isArray(v)
      ? v.filter(x => x && x.n && x.p)
          .map(x => ({...x, a: x.a || [], e: +x.e || 0, t: x.t || 's',
                      r: 'acc', community: true}))
      : [];
  } catch (_) { return []; }
}

function saveCommunityMovements(list) {
  try { localStorage.setItem(COMMUNITY_KEY, JSON.stringify(list)); return true; }
  catch (_) { return false; }
}

// The library the builder actually draws from: yours, the defaults, and — only if you
// switched them on — the ones other people shared.
const allMovements = () => customMovements().concat(LIB, communityMovements());

// "Strength · pull — back, biceps" for a pattern key, for labelling a movement anywhere.
const groupLabel = p => (GROUPS.find(g => g[0] === p) || [null, p])[1];

/* Drawing a movement. The builder uses these to lay out a session; Sessions uses them again
   when you swap something out mid-session. One copy, so the two can't drift apart. */

const pick = a => a[Math.floor(Math.random() * a.length)];

// How many sessions back each movement was last used, over the most recent `depth` of the
// completed sessions handed in. 0 means the session before this one.
function recencyMap(done, depth) {
  const m = new Map();
  if (!depth) return m;
  (done || []).slice(0, depth).forEach((s, i) => {
    (s.blocks || []).forEach(b => (b.items || []).forEach(it => {
      if (!m.has(it.name)) m.set(it.name, i);
    }));
  });
  return m;
}

function eligible(pattern, equip, avoid, used) {
  const pats = String(pattern || '').split('|');
  return allMovements().filter(x => pats.includes(x.p) && x.e <= equip &&
    !x.a.some(t => (avoid || []).includes(t)) && !used.has(x.n));
}

/* Three tiers, in this order: movements you added, then the library this site ships with,
   then anything from the shared library. A tier is only consulted when the one above it has
   nothing that fits the slot — a stranger's movement never lands in a session that the
   defaults could have filled, and never lands at all unless you asked for it. */
const tier = x => x.mine ? 0 : x.community ? 2 : 1;

// Prefer movements not seen recently. Never fails while any candidate exists:
// falls back to the least recently used rather than returning nothing.
//
// Yours come first, always: if any movement you added fits this slot, the draw happens
// among those alone and the defaults are not consulted. Freshness then decides between
// them. With only one or two of yours for a pattern that means they will repeat — which
// is what "first priority" costs, and the Repeats setting is still there to see it.
function pickFresh(pool, rec) {
  if (!pool.length) return null;
  const best = Math.min(...pool.map(tier));
  const from = pool.filter(x => tier(x) === best);
  const unseen = from.filter(x => !rec.has(x.n));
  if (unseen.length) return pick(unseen);
  const maxAgo = Math.max(...from.map(x => rec.get(x.n)));
  return pick(from.filter(x => rec.get(x.n) === maxAgo));
}

/* ============================================================ slots and roles ==

   A slot is a pattern and a role together: "a main hinge or squat", not "a hinge".
   Before this existed a hinge slot drew a conventional deadlift or a good morning with
   equal probability, and both were then prescribed the same 8–12 reps, because the
   prescription was keyed by pattern. Two movements that share a pattern are not
   interchangeable, and the role is what says so. */

const FOCUS = {
  full:  [{p:'hinge|squat', r:'main'}, {p:'push', r:'sec'}, {p:'pull', r:'sec'}, {p:'acc', r:'acc'}],
  upper: [{p:'push', r:'main'}, {p:'pull', r:'sec'}, {p:'push', r:'sec'}, {p:'pull', r:'acc'}],
  lower: [{p:'hinge', r:'main'}, {p:'squat', r:'sec'}, {p:'hinge|squat', r:'sec'}, {p:'acc', r:'acc'}],
  push:  [{p:'push', r:'main'}, {p:'push', r:'sec'}, {p:'push', r:'sec'}, {p:'acc', r:'acc'}],
  pull:  [{p:'pull', r:'main'}, {p:'pull', r:'sec'}, {p:'pull', r:'sec'}, {p:'acc', r:'acc'}],
  post:  [{p:'hinge', r:'main'}, {p:'pull', r:'sec'}, {p:'hinge', r:'sec'}, {p:'acc', r:'acc'}],
};

// The fallback when a movement carries no prescription of its own. Keyed by pattern, so
// every movement sharing a pattern gets the same numbers — which is the thing that was
// wrong. It is a floor under movements that have nothing better, not the normal path.
const REPS = {hinge:'5–8', squat:'6–10', push:'6–10', pull:'6–10', acc:'10–15'};

// One focus draws its own sequence. Several draw round-robin, so Upper + Lower goes
// push, hinge, pull, squat — four exercises give two of each instead of four of one.
function focusSequence(keys) {
  const seqs = (keys || []).map(k => FOCUS[k]).filter(Boolean);
  if (!seqs.length) return FOCUS.full;
  if (seqs.length === 1) return seqs[0];
  const out = [], longest = Math.max(...seqs.map(x => x.length));
  for (let i = 0; i < longest; i++) seqs.forEach(x => { if (i < x.length) out.push(x[i]); });
  return out;
}

// Everything that fits the slot: the pattern filter first, then the best role the slot
// will settle for. Returns the pool and the role it actually found, because "we asked for
// a main and got a secondary" is worth knowing further up.
function slotPool(slot, equip, avoid, used) {
  const all = eligible(slot.p, equip, avoid, used);
  for (const r of (SLOT_ROLES[slot.r] || SLOT_ROLES.acc)) {
    const pool = all.filter(x => roleOf(x) === r);
    if (pool.length) return {pool, role: r};
  }
  return {pool: [], role: null};
}

/* Heaviest first, and within that, skill first: a coached movement happens while you are
   fresh, not fourth. Ties keep the order the sequence drew them in, so push before pull
   stays push before pull. */
const techRank = t => ({c: 0, p: 1, s: 2}[t] == null ? 2 : {c: 0, p: 1, s: 2}[t]);

function orderStrength(items) {
  return items.map((it, i) => [it, i]).sort((A, B) =>
    roleRank(roleOf(A[0])) - roleRank(roleOf(B[0])) ||
    techRank(A[0].t) - techRank(B[0].t) ||
    A[1] - B[1]
  ).map(x => x[0]);
}

/* Draw the strength block. `take` is the builder's own — it is what knows about recency,
   marks a movement used and counts repeats — and is handed a pattern and a role.

   Only the first main slot stays a main. A five-exercise block wraps back round to the
   start of the sequence, and two focuses merged round-robin can put two main slots in a
   row; both would otherwise give a second main. */
function drawStrength(seq, nEx, take, notes) {
  const items = [];
  let mainTaken = false;
  for (let i = 0; i < nEx; i++) {
    const slot = seq[i % seq.length];
    const want = (slot.r === 'main' && mainTaken) ? 'sec' : slot.r;
    const it = take(slot.p, want);
    if (!it) {
      (notes || []).push('No ' + slot.p.replace('|', ' or ') + ' movement available with those settings.');
      continue;
    }
    if (roleOf(it) === 'main') mainTaken = true;
    items.push(it);
  }
  return orderStrength(items);
}

/* What changed, when a movement is swapped for another in the same slot. Every clause is
   read off the two movements — equipment level, avoid tags, technique rating — so the line
   is a description of the data and not a claim about training. If nothing differs on those
   three axes it says so rather than inventing a distinction. */
function swapNote(before, after) {
  if (!before || !after) return '';
  // an axis the movement being replaced never recorded can't be compared, and saying
  // "needs dumbbells" off an undefined is how a made-up line gets written
  const hasKit = typeof before.e === 'number', hasTech = !!before.t, hasTags = Array.isArray(before.a);
  if (!hasKit && !hasTech && !hasTags) return 'Same slot';

  const bits = [];
  const KIT = ['bodyweight alone', 'a band', 'dumbbells', 'a full gym'];
  if (hasKit && after.e !== before.e)
    bits.push((after.e < before.e ? 'needs only ' : 'needs ') + KIT[after.e]);
  const words = t => AVOID_LABEL[t] || t;
  if (hasTags) {
    const gone  = before.a.filter(t => !(after.a || []).includes(t));
    const added = (after.a || []).filter(t => !before.a.includes(t));
    if (gone.length)  bits.push('no ' + gone.map(words).join(' or '));
    if (added.length) bits.push('adds ' + added.map(words).join(' and '));
  }
  if (hasTech && after.t !== before.t)
    bits.push(techLabel(after.t).toLowerCase() + ' where that was ' + techLabel(before.t).toLowerCase());

  if (bits.length) return 'Same slot · ' + bits.join(' · ');
  const same = [hasKit && 'equipment', hasTags && 'tags', hasTech && 'technique'].filter(Boolean);
  return 'Same slot · same ' + same.join(', same ');
}

/* The prescription a swapped-in movement should carry. A strength movement keeps the set
   count the block was written with and brings its own reps — swapping a deadlift for a
   good morning has to change the numbers, which is the whole point. Everything else owns
   its prescription outright: a mobility drill's "2 × 10" is not 2 sets of anything the
   block decided. */
function detailFor(after, prevDetail, pattern) {
  const p = String(pattern || after.p || '').split('|')[0];
  const own = after.d || REPS[p] || '8–12';
  if (!LOGGABLE.has(p)) return after.d || prevDetail || '';
  const m = String(prevDetail || '').match(/^(\d+)\s*×\s*/);
  return m ? m[1] + ' × ' + own : own;
}

/* Group labels, used by the video library. */
const GROUPS = [
  ['m_shoulder', 'Mobility · shoulders & upper back'],
  ['m_hip',      'Mobility · hips'],
  ['m_spine',    'Mobility · spine'],
  ['m_neck',     'Mobility · neck & traps'],
  ['hinge',      'Strength · hinge — deadlifts, hips, hamstrings'],
  ['squat',      'Strength · squat — quads, legs'],
  ['push',       'Strength · push — chest, shoulders, triceps'],
  ['pull',       'Strength · pull — back, biceps'],
  ['acc',        'Strength · accessory'],
  ['core',       'Core'],
  ['fin',        'Finisher · conditioning'],
];
