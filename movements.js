/* The movement library. Shared by the builder and the video library — one source of truth. */

const LIB = [
  // mobility — shoulders & upper back
  {n:'Band shoulder dislocations', p:'m_shoulder', e:1, a:[],            d:'2 × 10'},
  {n:'Wall slides',                p:'m_shoulder', e:0, a:[],            d:'2 × 10'},
  {n:'Prone Y/T/W raises',         p:'m_shoulder', e:0, a:['floor'],     d:'2 × 8 each'},
  {n:'Doorway pec stretch',        p:'m_shoulder', e:0, a:[],            d:'30 sec each side'},
  {n:'Thread the needle',          p:'m_shoulder', e:0, a:['floor'],     d:'8 each side'},
  {n:'Banded face pulls, light',   p:'m_shoulder', e:1, a:[],            d:'2 × 15'},
  {n:'Foam roller thoracic extensions', p:'m_shoulder', e:2, a:['floor'],d:'1–2 min'},
  // mobility — hips
  {n:'90/90 hip rotations',        p:'m_hip', e:0, a:['floor'],          d:'8 each side'},
  {n:'Kneeling hip flexor stretch',p:'m_hip', e:0, a:['floor'],          d:'45 sec each side'},
  {n:"World's greatest stretch",   p:'m_hip', e:0, a:['floor'],          d:'5 each side'},
  {n:'Pigeon',                     p:'m_hip', e:0, a:['floor'],          d:'1 min each side'},
  {n:'Cossack stretch, unloaded, partial range', p:'m_hip', e:0, a:['floor','deepknee'], d:'8 each side'},
  {n:'Couch stretch',              p:'m_hip', e:0, a:['floor'],          d:'45 sec each side'},
  {n:'Banded hip openers',         p:'m_hip', e:1, a:['floor'],          d:'10 each direction'},
  {n:'Standing hip circles',       p:'m_hip', e:0, a:[],                 d:'10 each direction'},
  // mobility — spine
  {n:'Cat-cow with thoracic rotation', p:'m_spine', e:0, a:['floor'],    d:'8 each direction'},
  {n:'Bird dog',                   p:'m_spine', e:0, a:['floor'],        d:'8 each side'},
  {n:'Dead bug',                   p:'m_spine', e:0, a:['floor'],        d:'8 each side'},
  {n:'Open book',                  p:'m_spine', e:0, a:['floor'],        d:'8 each side'},
  {n:'Supine spinal twist',        p:'m_spine', e:0, a:['floor'],        d:'30 sec each side'},
  {n:'Standing side bend',         p:'m_spine', e:0, a:[],               d:'8 each side'},
  // mobility — neck & traps
  {n:'Upper trap release, hands or ball', p:'m_neck', e:0, a:[],         d:'30 sec each side'},
  {n:'Levator scapulae stretch',   p:'m_neck', e:0, a:[],                d:'30 sec each side'},
  {n:'Chin tucks',                 p:'m_neck', e:0, a:[],                d:'2 × 10'},
  {n:'Suboccipital release, towel under the skull', p:'m_neck', e:0, a:['floor'], d:'1 min'},

  // hinge
  {n:'Trap-bar deadlift',    p:'hinge', e:3, a:['grip'], d:''},
  {n:'Conventional deadlift',p:'hinge', e:3, a:['grip'], d:''},
  {n:'Romanian deadlift',    p:'hinge', e:2, a:['grip'], d:''},
  {n:'Single-leg RDL',       p:'hinge', e:2, a:[],       d:''},
  {n:'Hip thrust',           p:'hinge', e:3, a:[],       d:''},
  {n:'Kettlebell swing',     p:'hinge', e:2, a:['grip'], d:''},
  {n:'Good morning',         p:'hinge', e:3, a:[],       d:''},
  {n:'Glute bridge',         p:'hinge', e:0, a:['floor'],d:''},
  // squat
  {n:'Back squat',           p:'squat', e:3, a:[],           d:''},
  {n:'Front squat',          p:'squat', e:3, a:[],           d:''},
  {n:'Goblet squat',         p:'squat', e:2, a:[],           d:''},
  {n:'Leg press',            p:'squat', e:3, a:[],           d:''},
  {n:'Bulgarian split squat',p:'squat', e:2, a:[],           d:''},
  {n:'Walking lunge',        p:'squat', e:2, a:[],           d:''},
  {n:'Step-up',              p:'squat', e:2, a:[],           d:''},
  {n:'Bodyweight squat',     p:'squat', e:0, a:[],           d:''},
  {n:'Cossack squat',        p:'squat', e:0, a:['deepknee'], d:''},
  {n:'Deep ATG squat',       p:'squat', e:3, a:['deepknee'], d:''},
  {n:'Box jump',             p:'squat', e:3, a:['jump'],     d:''},
  // push
  {n:'Barbell bench press',   p:'push', e:3, a:[],                  d:''},
  {n:'Dumbbell bench press',  p:'push', e:2, a:[],                  d:''},
  {n:'Incline dumbbell press',p:'push', e:2, a:[],                  d:''},
  {n:'Overhead press',        p:'push', e:3, a:['overhead'],        d:''},
  {n:'Dumbbell shoulder press',p:'push',e:2, a:['overhead'],        d:''},
  {n:'Push-up',               p:'push', e:0, a:['floor'],           d:''},
  {n:'Loaded push-up',        p:'push', e:2, a:['floor'],           d:''},
  {n:'Dip',                   p:'push', e:3, a:[],                  d:''},
  {n:'Cable fly',             p:'push', e:3, a:[],                  d:''},
  {n:'Pike push-up',          p:'push', e:0, a:['floor','overhead'],d:''},
  // pull
  {n:'Pull-up',           p:'pull', e:3, a:['grip'], d:''},
  {n:'Chin-up',           p:'pull', e:3, a:['grip'], d:''},
  {n:'Weighted pull-up',  p:'pull', e:3, a:['grip'], d:''},
  {n:'Lat pulldown',      p:'pull', e:3, a:[],       d:''},
  {n:'Barbell row',       p:'pull', e:3, a:['grip'], d:''},
  {n:'Dumbbell row',      p:'pull', e:2, a:[],       d:''},
  {n:'Cable row',         p:'pull', e:3, a:[],       d:''},
  {n:'Inverted row',      p:'pull', e:3, a:[],       d:''},
  {n:'Face pull',         p:'pull', e:1, a:[],       d:''},
  {n:'Band pull-apart',   p:'pull', e:1, a:[],       d:''},
  // accessory
  {n:'Lateral raise',     p:'acc', e:2, a:[], d:''},
  {n:'Biceps curl',       p:'acc', e:2, a:[], d:''},
  {n:'Triceps extension', p:'acc', e:2, a:[], d:''},
  {n:'Calf raise',        p:'acc', e:0, a:[], d:''},
  {n:'Rear delt fly',     p:'acc', e:2, a:[], d:''},
  // core
  {n:'Plank',             p:'core', e:0, a:['floor'], d:'30–60 sec'},
  {n:'Side plank',        p:'core', e:0, a:['floor'], d:'30–45 sec each'},
  {n:'Hollow hold',       p:'core', e:0, a:['floor'], d:'20–40 sec'},
  {n:'Dead bug',          p:'core', e:0, a:['floor'], d:'8–12 each side'},
  {n:'Hanging leg raise', p:'core', e:3, a:['grip'],  d:'8–12'},
  {n:'Ab wheel rollout',  p:'core', e:3, a:['floor'], d:'6–10'},
  {n:'Pallof press',      p:'core', e:1, a:[],        d:'10–12 each side'},
  {n:'Russian twist',     p:'core', e:0, a:['floor'], d:'12–16 each side'},
  {n:'Suitcase carry',    p:'core', e:2, a:['grip'],  d:'30 m each side'},
  // finisher
  {n:'Rower intervals',      p:'fin', e:3, a:['grip'],         d:'5 × 250 m, 1 min rest'},
  {n:'Assault bike sprints', p:'fin', e:3, a:[],               d:'6 × 20 sec hard, 40 sec easy'},
  {n:'Wall ball',            p:'fin', e:3, a:['overhead'],     d:'3 × 15'},
  {n:'Kettlebell swings',    p:'fin', e:2, a:['grip'],         d:'5 × 15, 30 sec rest'},
  {n:'Farmer’s carry',       p:'fin', e:2, a:['grip'],         d:'4 × 40 m'},
  {n:'Battle ropes',         p:'fin', e:3, a:['grip'],         d:'6 × 20 sec'},
  {n:'Burpees',              p:'fin', e:0, a:['jump','floor'], d:'5 × 8'},
  {n:'Mountain climbers',    p:'fin', e:0, a:['floor'],        d:'4 × 40 sec'},
  {n:'Jump rope',            p:'fin', e:0, a:['jump'],         d:'5 × 1 min'},
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
  return LIB.filter(x => pats.includes(x.p) && x.e <= equip &&
    !x.a.some(t => (avoid || []).includes(t)) && !used.has(x.n));
}

// Prefer movements not seen recently. Never fails while any candidate exists:
// falls back to the least recently used rather than returning nothing.
function pickFresh(pool, rec) {
  if (!pool.length) return null;
  const unseen = pool.filter(x => !rec.has(x.n));
  if (unseen.length) return pick(unseen);
  const maxAgo = Math.max(...pool.map(x => rec.get(x.n)));
  return pick(pool.filter(x => rec.get(x.n) === maxAgo));
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
