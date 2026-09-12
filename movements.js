/* The movement library. Shared by the builder and the video library — one source of truth. */

const LIB = [
  // mobility — shoulders & upper back
  {n:'Band shoulder dislocations', p:'m_shoulder', e:1, a:[],            d:'2 × 10', t:'p'},
  {n:'Wall slides',                p:'m_shoulder', e:0, a:[],            d:'2 × 10', t:'s'},
  {n:'Prone Y/T/W raises',         p:'m_shoulder', e:0, a:['floor'],     d:'2 × 8 each', t:'s'},
  {n:'Doorway pec stretch',        p:'m_shoulder', e:0, a:[],            d:'30 sec each side', t:'s'},
  {n:'Thread the needle',          p:'m_shoulder', e:0, a:['floor'],     d:'8 each side', t:'s'},
  {n:'Banded face pulls, light',   p:'m_shoulder', e:1, a:[],            d:'2 × 15', t:'s'},
  {n:'Foam roller thoracic extensions', p:'m_shoulder', e:2, a:['floor'],d:'1–2 min', t:'s'},
  // mobility — hips
  {n:'90/90 hip rotations',        p:'m_hip', e:0, a:['floor'],          d:'8 each side', t:'s'},
  {n:'Kneeling hip flexor stretch',p:'m_hip', e:0, a:['floor'],          d:'45 sec each side', t:'s'},
  {n:"World's greatest stretch",   p:'m_hip', e:0, a:['floor'],          d:'5 each side', t:'s'},
  {n:'Pigeon',                     p:'m_hip', e:0, a:['floor'],          d:'1 min each side', t:'s'},
  {n:'Cossack stretch, unloaded, partial range', p:'m_hip', e:0, a:['floor','deepknee'], d:'8 each side', t:'s'},
  {n:'Couch stretch',              p:'m_hip', e:0, a:['floor'],          d:'45 sec each side', t:'s'},
  {n:'Banded hip openers',         p:'m_hip', e:1, a:['floor'],          d:'10 each direction', t:'s'},
  {n:'Standing hip circles',       p:'m_hip', e:0, a:[],                 d:'10 each direction', t:'s'},
  // mobility — spine
  {n:'Cat-cow with thoracic rotation', p:'m_spine', e:0, a:['floor'],    d:'8 each direction', t:'s'},
  {n:'Bird dog',                   p:'m_spine', e:0, a:['floor'],        d:'8 each side', t:'s'},
  {n:'Dead bug',                   p:'m_spine', e:0, a:['floor'],        d:'8 each side', t:'s'},
  {n:'Open book',                  p:'m_spine', e:0, a:['floor'],        d:'8 each side', t:'s'},
  {n:'Supine spinal twist',        p:'m_spine', e:0, a:['floor'],        d:'30 sec each side', t:'s'},
  {n:'Standing side bend',         p:'m_spine', e:0, a:[],               d:'8 each side', t:'s'},
  // mobility — neck & traps
  {n:'Upper trap release, hands or ball', p:'m_neck', e:0, a:[],         d:'30 sec each side', t:'s'},
  {n:'Levator scapulae stretch',   p:'m_neck', e:0, a:[],                d:'30 sec each side', t:'s'},
  {n:'Chin tucks',                 p:'m_neck', e:0, a:[],                d:'2 × 10', t:'s'},
  {n:'Suboccipital release, towel under the skull', p:'m_neck', e:0, a:['floor'], d:'1 min', t:'s'},

  // hinge
  {n:'Trap-bar deadlift',    p:'hinge', e:3, a:['grip'], d:'', t:'p'},
  {n:'Conventional deadlift',p:'hinge', e:3, a:['grip'], d:'', t:'c'},
  {n:'Romanian deadlift',    p:'hinge', e:2, a:['grip'], d:'', t:'p'},
  {n:'Single-leg RDL',       p:'hinge', e:2, a:[],       d:'', t:'p'},
  {n:'Hip thrust',           p:'hinge', e:3, a:[],       d:'', t:'p'},
  {n:'Kettlebell swing',     p:'hinge', e:2, a:['grip'], d:'', t:'c'},
  {n:'Good morning',         p:'hinge', e:3, a:[],       d:'', t:'c'},
  {n:'Glute bridge',         p:'hinge', e:0, a:['floor'],d:'', t:'s'},
  // squat
  {n:'Back squat',           p:'squat', e:3, a:[],           d:'', t:'c'},
  {n:'Front squat',          p:'squat', e:3, a:[],           d:'', t:'c'},
  {n:'Goblet squat',         p:'squat', e:2, a:[],           d:'', t:'s'},
  {n:'Leg press',            p:'squat', e:3, a:[],           d:'', t:'s'},
  {n:'Bulgarian split squat',p:'squat', e:2, a:[],           d:'', t:'p'},
  {n:'Walking lunge',        p:'squat', e:2, a:[],           d:'', t:'s'},
  {n:'Step-up',              p:'squat', e:2, a:[],           d:'', t:'s'},
  {n:'Bodyweight squat',     p:'squat', e:0, a:[],           d:'', t:'s'},
  {n:'Cossack squat',        p:'squat', e:0, a:['deepknee'], d:'', t:'p'},
  {n:'Deep ATG squat',       p:'squat', e:3, a:['deepknee'], d:'', t:'c'},
  {n:'Box jump',             p:'squat', e:3, a:['jump'],     d:'', t:'p'},
  // push
  {n:'Barbell bench press',   p:'push', e:3, a:[],                  d:'', t:'p'},
  {n:'Dumbbell bench press',  p:'push', e:2, a:[],                  d:'', t:'s'},
  {n:'Incline dumbbell press',p:'push', e:2, a:[],                  d:'', t:'s'},
  {n:'Overhead press',        p:'push', e:3, a:['overhead'],        d:'', t:'p'},
  {n:'Dumbbell shoulder press',p:'push',e:2, a:['overhead'],        d:'', t:'s'},
  {n:'Push-up',               p:'push', e:0, a:['floor'],           d:'', t:'s'},
  {n:'Loaded push-up',        p:'push', e:2, a:['floor'],           d:'', t:'s'},
  {n:'Dip',                   p:'push', e:3, a:[],                  d:'', t:'p'},
  {n:'Cable fly',             p:'push', e:3, a:[],                  d:'', t:'s'},
  {n:'Pike push-up',          p:'push', e:0, a:['floor','overhead'],d:'', t:'p'},
  // pull
  {n:'Pull-up',           p:'pull', e:3, a:['grip'], d:'', t:'p'},
  {n:'Chin-up',           p:'pull', e:3, a:['grip'], d:'', t:'p'},
  {n:'Weighted pull-up',  p:'pull', e:3, a:['grip'], d:'', t:'p'},
  {n:'Lat pulldown',      p:'pull', e:3, a:[],       d:'', t:'s'},
  {n:'Barbell row',       p:'pull', e:3, a:['grip'], d:'', t:'p'},
  {n:'Dumbbell row',      p:'pull', e:2, a:[],       d:'', t:'s'},
  {n:'Cable row',         p:'pull', e:3, a:[],       d:'', t:'s'},
  {n:'Inverted row',      p:'pull', e:3, a:[],       d:'', t:'s'},
  {n:'Face pull',         p:'pull', e:1, a:[],       d:'', t:'s'},
  {n:'Band pull-apart',   p:'pull', e:1, a:[],       d:'', t:'s'},
  // accessory
  {n:'Lateral raise',     p:'acc', e:2, a:[], d:'', t:'s'},
  {n:'Biceps curl',       p:'acc', e:2, a:[], d:'', t:'s'},
  {n:'Triceps extension', p:'acc', e:2, a:[], d:'', t:'s'},
  {n:'Calf raise',        p:'acc', e:0, a:[], d:'', t:'s'},
  {n:'Rear delt fly',     p:'acc', e:2, a:[], d:'', t:'s'},
  // core
  {n:'Plank',             p:'core', e:0, a:['floor'], d:'30–60 sec', t:'s'},
  {n:'Side plank',        p:'core', e:0, a:['floor'], d:'30–45 sec each', t:'s'},
  {n:'Hollow hold',       p:'core', e:0, a:['floor'], d:'20–40 sec', t:'p'},
  {n:'Dead bug',          p:'core', e:0, a:['floor'], d:'8–12 each side', t:'s'},
  {n:'Hanging leg raise', p:'core', e:3, a:['grip'],  d:'8–12', t:'p'},
  {n:'Ab wheel rollout',  p:'core', e:3, a:['floor'], d:'6–10', t:'p'},
  {n:'Pallof press',      p:'core', e:1, a:[],        d:'10–12 each side', t:'s'},
  {n:'Russian twist',     p:'core', e:0, a:['floor'], d:'12–16 each side', t:'s'},
  {n:'Suitcase carry',    p:'core', e:2, a:['grip'],  d:'30 m each side', t:'s'},
  // finisher
  {n:'Rower intervals',      p:'fin', e:3, a:['grip'],         d:'5 × 250 m, 1 min rest', t:'p'},
  {n:'Assault bike sprints', p:'fin', e:3, a:[],               d:'6 × 20 sec hard, 40 sec easy', t:'s'},
  {n:'Wall ball',            p:'fin', e:3, a:['overhead'],     d:'3 × 15', t:'p'},
  {n:'Kettlebell swings',    p:'fin', e:2, a:['grip'],         d:'5 × 15, 30 sec rest', t:'c'},
  {n:'Farmer’s carry',       p:'fin', e:2, a:['grip'],         d:'4 × 40 m', t:'s'},
  {n:'Battle ropes',         p:'fin', e:3, a:['grip'],         d:'6 × 20 sec', t:'s'},
  {n:'Burpees',              p:'fin', e:0, a:['jump','floor'], d:'5 × 8', t:'s'},
  {n:'Mountain climbers',    p:'fin', e:0, a:['floor'],        d:'4 × 40 sec', t:'s'},
  {n:'Jump rope',            p:'fin', e:0, a:['jump'],         d:'5 × 1 min', t:'s'},
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

/* The rating as it appears on a movement card in a session. Coached is never folded
   away — it is the one that changes what you should do about the movement. A rating
   that came from the shared library says so: nobody checked it. */
function techTag(it) {
  if (!it || !it.t || !TECHNIQUE[it.t]) return '';
  const unver = it.community ? ' <span class="unver">self-reported</span>' : '';
  return `<span class="tech t-${it.t}">${techLabel(it.t)}${unver}</span>`;
}

function customMovements() {
  try {
    const v = JSON.parse(localStorage.getItem(CUSTOM_KEY) || '[]');
    return Array.isArray(v)
      ? v.filter(x => x && x.n && x.p)
          .map(x => ({...x, a: x.a || [], e: +x.e || 0, t: x.t || 's', mine: true}))
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
          .map(x => ({...x, a: x.a || [], e: +x.e || 0, t: x.t || 's', community: true}))
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
