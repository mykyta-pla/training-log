/* The movement library. Shared by the builder and the video library — one source of truth. */

/* Every movement carries five axes beside its pattern:

   e   equipment, 0–3       the least kit it needs
   t   technique, s|p|c     how much skill it asks for, not how hard it feels
   r   role, main|sec|acc   what it can carry in a session
   dm  demand, 1–3          how hard it is, which technique could never say:
                            1 you could do it on a red-recovery day, 2 real work
                            and repeatable, 3 it costs you something. A supine
                            twist is t:'s' dm:1; a Jefferson curl is t:'c' dm:3.
   pl  plane                'sag' forward and back, 'front' side to side,
                            'trans' rotation
   u   unilateral           1 when one side works at a time, absent otherwise
   sp  sport                'racket', 'bike', 'calisthenics' — only where the
                            movement is genuinely preparatory, not wishful

   Role is independent of the other four. A back squat is a main because it is
   the heaviest, most systemically demanding thing you would do that day — not
   because it is coached, and not because it needs a rack. A goblet squat needs
   the same pattern and less skill and is still only secondary, because its
   loading ceiling is low. Role decides which slot a movement may fill and what
   order the block is written in; equipment and avoid tags decide whether it may
   appear at all; plane and unilateral decide nothing on their own, but the draw
   will not write a whole session in one plane if it can help it.

   d  is the movement's own prescription. For strength it is a rep range alone —
   the builder puts the set count in front of it, because that scales with the
   time you have. For mobility, core and finishers it is the whole prescription,
   because nothing scales it. */

const LIB = [

  /* ===== MOBILITY — shoulders & upper back ================================ */
  {n:'Band shoulder dislocations', p:'m_shoulder', e:1, a:[],            d:'2 × 10', t:'p', r:'acc', dm:2, pl:'sag'},
  {n:'Wall slides',                p:'m_shoulder', e:0, a:[],            d:'2 × 10', t:'s', r:'acc', dm:1, pl:'sag'},
  {n:'Prone Y/T/W raises',         p:'m_shoulder', e:0, a:['floor'],     d:'2 × 8 each', t:'s', r:'acc', dm:2, pl:'sag'},
  {n:'Doorway pec stretch',        p:'m_shoulder', e:0, a:[],            d:'30 sec each side', t:'s', r:'acc', dm:1, pl:'trans', u:1},
  {n:'Thread the needle',          p:'m_shoulder', e:0, a:['floor'],     d:'8 each side', t:'s', r:'acc', dm:1, pl:'trans', u:1},
  {n:'Banded face pulls, light',   p:'m_shoulder', e:1, a:[],            d:'2 × 15', t:'s', r:'acc', dm:1, pl:'sag'},
  {n:'Foam roller thoracic extensions', p:'m_shoulder', e:2, a:['floor'],d:'1–2 min', t:'s', r:'acc', dm:1, pl:'sag'},
  // new — demanding
  {n:'Shoulder CARs, slow',        p:'m_shoulder', e:0, a:[],            d:'3 each side, 30 sec per rep', t:'p', r:'acc', dm:2, pl:'trans', u:1},
  {n:'Passive hang',               p:'m_shoulder', e:3, a:['grip','overhead'], d:'3 × 30–45 sec', t:'s', r:'acc', dm:2, pl:'sag', sp:['calisthenics']},
  {n:'Active hang, scapular pull', p:'m_shoulder', e:3, a:['grip','overhead'], d:'3 × 8', t:'p', r:'acc', dm:3, pl:'sag', sp:['calisthenics']},
  {n:'Weighted dead hang',         p:'m_shoulder', e:3, a:['grip','overhead'], d:'3 × 20–30 sec', t:'p', r:'acc', dm:3, pl:'sag'},
  {n:'Skin the cat, partial',      p:'m_shoulder', e:3, a:['grip','overhead'], d:'3 × 3', t:'c', r:'acc', dm:3, pl:'sag', sp:['calisthenics']},
  {n:'Wall-supported handstand hold', p:'m_shoulder', e:0, a:['overhead','floor'], d:'3 × 30 sec', t:'c', r:'acc', dm:3, pl:'sag', sp:['calisthenics']},
  {n:'Prone press-up to thoracic extension', p:'m_shoulder', e:0, a:['floor'], d:'2 × 10', t:'s', r:'acc', dm:2, pl:'sag'},
  {n:'Bottoms-up kettlebell carry', p:'m_shoulder', e:2, a:['grip','overhead'], d:'4 × 20 m each side', t:'c', r:'acc', dm:3, pl:'front', u:1},
  {n:'Half-kneeling landmine press, slow', p:'m_shoulder', e:3, a:['overhead'], d:'2 × 8 each side', t:'p', r:'acc', dm:2, pl:'trans', u:1},

  /* ===== MOBILITY — hips ================================================== */
  {n:'90/90 hip rotations',        p:'m_hip', e:0, a:['floor'],          d:'8 each side', t:'s', r:'acc', dm:1, pl:'trans', u:1},
  {n:'Kneeling hip flexor stretch',p:'m_hip', e:0, a:['floor'],          d:'45 sec each side', t:'s', r:'acc', dm:1, pl:'sag', u:1},
  {n:"World's greatest stretch",   p:'m_hip', e:0, a:['floor'],          d:'5 each side', t:'s', r:'acc', dm:2, pl:'trans', u:1},
  {n:'Pigeon',                     p:'m_hip', e:0, a:['floor'],          d:'1 min each side', t:'s', r:'acc', dm:1, pl:'trans', u:1},
  {n:'Cossack stretch, unloaded, partial range', p:'m_hip', e:0, a:['floor','deepknee'], d:'8 each side', t:'s', r:'acc', dm:2, pl:'front', u:1},
  {n:'Couch stretch',              p:'m_hip', e:0, a:['floor'],          d:'45 sec each side', t:'s', r:'acc', dm:2, pl:'sag', u:1},
  {n:'Banded hip openers',         p:'m_hip', e:1, a:['floor'],          d:'10 each direction', t:'s', r:'acc', dm:1, pl:'trans', u:1},
  {n:'Standing hip circles',       p:'m_hip', e:0, a:[],                 d:'10 each direction', t:'s', r:'acc', dm:1, pl:'trans', u:1},
  // new — demanding
  {n:'Hip CARs, slow',             p:'m_hip', e:0, a:[],                 d:'3 each side, 30 sec per rep', t:'p', r:'acc', dm:2, pl:'trans', u:1},
  {n:'90/90 lift-offs',            p:'m_hip', e:0, a:['floor'],          d:'3 × 5 each side, 3 sec hold', t:'p', r:'acc', dm:3, pl:'trans', u:1},
  {n:'ATG split squat',            p:'m_hip', e:0, a:['deepknee'],       d:'3 × 8 each side', t:'p', r:'acc', dm:3, pl:'sag', u:1},
  {n:'Loaded Cossack hold',        p:'m_hip', e:2, a:['deepknee'],       d:'3 × 20 sec each side', t:'p', r:'acc', dm:3, pl:'front', u:1, sp:['racket']},
  {n:'Deep squat hold with pry',   p:'m_hip', e:0, a:['deepknee'],       d:'3 × 45 sec', t:'s', r:'acc', dm:2, pl:'sag'},
  {n:'Seated pancake, active press', p:'m_hip', e:0, a:['floor'],        d:'3 × 8, 5 sec hold', t:'p', r:'acc', dm:3, pl:'front'},
  {n:'Elevated pigeon, active press', p:'m_hip', e:3, a:[],              d:'3 × 8 each side', t:'p', r:'acc', dm:3, pl:'trans', u:1},
  {n:'Jefferson curl, light',      p:'m_hip', e:2, a:[],                 d:'3 × 6, very slow', t:'c', r:'acc', dm:3, pl:'sag'},
  {n:'Copenhagen plank, short lever', p:'m_hip', e:3, a:[],              d:'3 × 20 sec each side', t:'p', r:'acc', dm:3, pl:'front', u:1, sp:['racket']},
  {n:'Reverse Nordic curl',        p:'m_hip', e:0, a:['floor','deepknee'], d:'3 × 6', t:'p', r:'acc', dm:3, pl:'sag'},
  {n:'Tibialis wall raise',        p:'m_hip', e:0, a:[],                 d:'3 × 15', t:'s', r:'acc', dm:2, pl:'sag', sp:['racket']},

  /* ===== MOBILITY — spine ================================================= */
  {n:'Cat-cow with thoracic rotation', p:'m_spine', e:0, a:['floor'],    d:'8 each direction', t:'s', r:'acc', dm:1, pl:'trans'},
  {n:'Bird dog',                   p:'m_spine', e:0, a:['floor'],        d:'8 each side', t:'s', r:'acc', dm:2, pl:'sag', u:1},
  {n:'Dead bug',                   p:'m_spine', e:0, a:['floor'],        d:'8 each side', t:'s', r:'acc', dm:2, pl:'sag', u:1},
  {n:'Open book',                  p:'m_spine', e:0, a:['floor'],        d:'8 each side', t:'s', r:'acc', dm:1, pl:'trans', u:1},
  {n:'Supine spinal twist',        p:'m_spine', e:0, a:['floor'],        d:'30 sec each side', t:'s', r:'acc', dm:1, pl:'trans', u:1},
  {n:'Standing side bend',         p:'m_spine', e:0, a:[],               d:'8 each side', t:'s', r:'acc', dm:1, pl:'front', u:1},
  // new — demanding
  {n:'Jefferson curl, loaded',     p:'m_spine', e:2, a:[],               d:'3 × 6, 5 sec down', t:'c', r:'acc', dm:3, pl:'sag'},
  {n:'Segmented cat-cow, slow',    p:'m_spine', e:0, a:['floor'],        d:'3 × 8, 10 sec per rep', t:'p', r:'acc', dm:2, pl:'sag'},
  {n:'Half-kneeling cable chop',   p:'m_spine', e:3, a:[],               d:'3 × 10 each side', t:'p', r:'acc', dm:3, pl:'trans', u:1, sp:['racket']},
  {n:'Side plank with reach-through', p:'m_spine', e:0, a:['floor'],     d:'3 × 8 each side', t:'p', r:'acc', dm:3, pl:'trans', u:1},
  {n:'Loaded side bend',           p:'m_spine', e:2, a:['grip'],         d:'3 × 10 each side', t:'s', r:'acc', dm:2, pl:'front', u:1},
  {n:'Hanging knee raise with rotation', p:'m_spine', e:3, a:['grip','overhead'], d:'3 × 8 each side', t:'p', r:'acc', dm:3, pl:'trans', u:1},

  /* ===== MOBILITY — neck & traps ========================================== */
  {n:'Upper trap release, hands or ball', p:'m_neck', e:0, a:[],         d:'30 sec each side', t:'s', r:'acc', dm:1, pl:'front', u:1},
  {n:'Levator scapulae stretch',   p:'m_neck', e:0, a:[],                d:'30 sec each side', t:'s', r:'acc', dm:1, pl:'trans', u:1},
  {n:'Chin tucks',                 p:'m_neck', e:0, a:[],                d:'2 × 10', t:'s', r:'acc', dm:1, pl:'sag'},
  {n:'Suboccipital release, towel under the skull', p:'m_neck', e:0, a:['floor'], d:'1 min', t:'s', r:'acc', dm:1, pl:'sag'},
  // new — demanding
  {n:'Isometric neck holds, four directions', p:'m_neck', e:0, a:[],     d:'4 × 20 sec each', t:'p', r:'acc', dm:2, pl:'sag'},
  {n:'Neck CARs, slow',            p:'m_neck', e:0, a:[],                d:'3 each direction, 20 sec per rep', t:'p', r:'acc', dm:2, pl:'trans'},
  {n:'Prone trap raise, light load', p:'m_neck', e:2, a:['floor'],       d:'3 × 12', t:'p', r:'acc', dm:2, pl:'sag'},
  {n:'Banded scapular retraction hold', p:'m_neck', e:1, a:[],           d:'3 × 20 sec', t:'s', r:'acc', dm:2, pl:'sag'},

  /* ===== HINGE ============================================================ */
  {n:'Trap-bar deadlift',    p:'hinge', e:3, a:['grip'], d:'3–5', t:'p', r:'main', dm:3, pl:'sag'},
  {n:'Conventional deadlift',p:'hinge', e:3, a:['grip'], d:'3–5', t:'c', r:'main', dm:3, pl:'sag'},
  {n:'Romanian deadlift',    p:'hinge', e:2, a:['grip'], d:'6–10', t:'p', r:'sec', dm:3, pl:'sag'},
  {n:'Single-leg RDL',       p:'hinge', e:2, a:[],       d:'8–12 each side', t:'p', r:'acc', dm:2, pl:'sag', u:1},
  {n:'Hip thrust',           p:'hinge', e:3, a:[],       d:'8–12', t:'p', r:'sec', dm:2, pl:'sag'},
  {n:'Kettlebell swing',     p:'hinge', e:2, a:['grip'], d:'10–15', t:'c', r:'sec', dm:3, pl:'sag'},
  {n:'Good morning',         p:'hinge', e:3, a:[],       d:'8–12', t:'c', r:'sec', dm:2, pl:'sag'},
  {n:'Glute bridge',         p:'hinge', e:0, a:['floor'],d:'12–15', t:'s', r:'acc', dm:1, pl:'sag'},
  // new — bands
  {n:'Band good morning',    p:'hinge', e:1, a:[],       d:'3 × 15', t:'s', r:'acc', dm:2, pl:'sag'},
  {n:'Band pull-through',    p:'hinge', e:1, a:[],       d:'3 × 15', t:'s', r:'acc', dm:2, pl:'sag'},
  {n:'Banded hip thrust',    p:'hinge', e:1, a:['floor'],d:'3 × 15', t:'s', r:'sec', dm:2, pl:'sag'},
  {n:'Banded RDL',           p:'hinge', e:1, a:[],       d:'3 × 12', t:'s', r:'sec', dm:2, pl:'sag'},
  // new — bodyweight, including an anchor
  {n:'Nordic hamstring curl',p:'hinge', e:0, a:['floor','deepknee'], d:'4 × 5, 5 sec down', t:'c', r:'main', dm:3, pl:'sag'},
  {n:'Single-leg glute bridge', p:'hinge', e:0, a:['floor'], d:'3 × 12 each side', t:'s', r:'acc', dm:2, pl:'sag', u:1},
  {n:'Slider hamstring curl',p:'hinge', e:0, a:['floor'], d:'3 × 10', t:'p', r:'sec', dm:3, pl:'sag'},
  {n:'Hip hinge to wall',    p:'hinge', e:0, a:[],       d:'3 × 12', t:'s', r:'acc', dm:1, pl:'sag'},
  // new — gym
  {n:'Sumo deadlift',        p:'hinge', e:3, a:['grip'], d:'3–5', t:'c', r:'main', dm:3, pl:'sag'},
  {n:'Deficit deadlift',     p:'hinge', e:3, a:['grip'], d:'4–6', t:'c', r:'sec', dm:3, pl:'sag'},
  {n:'Single-leg hip thrust',p:'hinge', e:3, a:[],       d:'3 × 10 each side', t:'p', r:'sec', dm:3, pl:'sag', u:1},
  {n:'Back extension',       p:'hinge', e:3, a:[],       d:'3 × 12–15', t:'s', r:'acc', dm:2, pl:'sag'},
  {n:'Reverse hyperextension', p:'hinge', e:3, a:[],     d:'3 × 12', t:'s', r:'acc', dm:2, pl:'sag'},
  {n:'Kettlebell single-arm swing', p:'hinge', e:2, a:['grip'], d:'5 × 10 each side', t:'c', r:'sec', dm:3, pl:'trans', u:1},
  {n:'Landmine RDL',         p:'hinge', e:3, a:['grip'], d:'3 × 10', t:'p', r:'sec', dm:2, pl:'sag'},
  {n:'Cable pull-through',   p:'hinge', e:3, a:[],       d:'3 × 15', t:'s', r:'acc', dm:2, pl:'sag'},

  /* ===== SQUAT ============================================================ */
  {n:'Back squat',           p:'squat', e:3, a:[],           d:'4–6', t:'c', r:'main', dm:3, pl:'sag'},
  {n:'Front squat',          p:'squat', e:3, a:[],           d:'3–6', t:'c', r:'main', dm:3, pl:'sag'},
  {n:'Goblet squat',         p:'squat', e:2, a:[],           d:'8–12', t:'s', r:'sec', dm:2, pl:'sag'},
  {n:'Leg press',            p:'squat', e:3, a:[],           d:'8–12', t:'s', r:'sec', dm:2, pl:'sag'},
  {n:'Bulgarian split squat',p:'squat', e:2, a:[],           d:'8–12 each side', t:'p', r:'sec', dm:3, pl:'sag', u:1},
  {n:'Walking lunge',        p:'squat', e:2, a:[],           d:'10–12 each side', t:'s', r:'acc', dm:2, pl:'sag', u:1},
  {n:'Step-up',              p:'squat', e:2, a:[],           d:'8–12 each side', t:'s', r:'acc', dm:2, pl:'sag', u:1},
  {n:'Bodyweight squat',     p:'squat', e:0, a:[],           d:'15–20', t:'s', r:'acc', dm:1, pl:'sag'},
  {n:'Cossack squat',        p:'squat', e:0, a:['deepknee'], d:'6–8 each side', t:'p', r:'acc', dm:3, pl:'front', u:1, sp:['racket']},
  {n:'Deep ATG squat',       p:'squat', e:3, a:['deepknee'], d:'5–8', t:'c', r:'sec', dm:3, pl:'sag'},
  // new — bands
  {n:'Banded squat',         p:'squat', e:1, a:[],           d:'3 × 15', t:'s', r:'sec', dm:2, pl:'sag'},
  {n:'Banded lateral walk',  p:'squat', e:1, a:[],           d:'3 × 15 each way', t:'s', r:'acc', dm:2, pl:'front', sp:['racket']},
  {n:'Monster walk',         p:'squat', e:1, a:[],           d:'3 × 20 steps', t:'s', r:'acc', dm:2, pl:'front', sp:['racket']},
  {n:'Band-resisted split squat', p:'squat', e:1, a:[],      d:'3 × 12 each side', t:'s', r:'sec', dm:2, pl:'sag', u:1},
  // new — bodyweight, including an anchor
  {n:'Pistol squat',         p:'squat', e:0, a:['deepknee'], d:'4 × 5 each side', t:'c', r:'main', dm:3, pl:'sag', u:1, sp:['calisthenics']},
  {n:'Shrimp squat',         p:'squat', e:0, a:['deepknee'], d:'3 × 6 each side', t:'c', r:'sec', dm:3, pl:'sag', u:1, sp:['calisthenics']},
  {n:'Sissy squat',          p:'squat', e:0, a:['deepknee'], d:'3 × 10', t:'p', r:'acc', dm:3, pl:'sag'},
  {n:'Wall sit',             p:'squat', e:0, a:[],           d:'3 × 45–60 sec', t:'s', r:'acc', dm:2, pl:'sag', sp:['bike']},
  {n:'Split squat, bodyweight', p:'squat', e:0, a:[],        d:'3 × 12 each side', t:'s', r:'acc', dm:2, pl:'sag', u:1},
  // new — gym and dumbbell
  {n:'Hack squat',           p:'squat', e:3, a:[],           d:'8–12', t:'s', r:'sec', dm:3, pl:'sag'},
  {n:'Double kettlebell front squat', p:'squat', e:2, a:['grip'], d:'5–8', t:'p', r:'main', dm:3, pl:'sag'},
  {n:'Zercher squat',        p:'squat', e:3, a:[],           d:'5–8', t:'c', r:'sec', dm:3, pl:'sag'},
  {n:'Lateral lunge',        p:'squat', e:2, a:[],           d:'3 × 10 each side', t:'p', r:'sec', dm:3, pl:'front', u:1, sp:['racket']},
  {n:'Curtsy lunge',         p:'squat', e:2, a:[],           d:'3 × 10 each side', t:'p', r:'acc', dm:2, pl:'trans', u:1},
  {n:'Reverse lunge',        p:'squat', e:2, a:[],           d:'3 × 10 each side', t:'s', r:'sec', dm:2, pl:'sag', u:1},
  {n:'Lateral step-down',    p:'squat', e:3, a:['deepknee'], d:'3 × 10 each side', t:'p', r:'acc', dm:3, pl:'front', u:1},
  {n:'Belt squat',           p:'squat', e:3, a:[],           d:'8–12', t:'s', r:'sec', dm:2, pl:'sag'},
  {n:'Sled push',            p:'squat', e:3, a:[],           d:'6 × 20 m', t:'s', r:'sec', dm:3, pl:'sag', sp:['bike']},

  /* ===== PUSH ============================================================= */
  {n:'Barbell bench press',   p:'push', e:3, a:[],                  d:'4–6', t:'p', r:'main', dm:3, pl:'sag'},
  {n:'Dumbbell bench press',  p:'push', e:2, a:[],                  d:'8–12', t:'s', r:'sec', dm:2, pl:'sag'},
  {n:'Incline dumbbell press',p:'push', e:2, a:[],                  d:'8–12', t:'s', r:'sec', dm:2, pl:'sag'},
  {n:'Overhead press',        p:'push', e:3, a:['overhead'],        d:'5–8', t:'p', r:'main', dm:3, pl:'sag'},
  {n:'Dumbbell shoulder press',p:'push',e:2, a:['overhead'],        d:'8–12', t:'s', r:'sec', dm:2, pl:'sag'},
  {n:'Push-up',               p:'push', e:0, a:['floor'],           d:'10–20', t:'s', r:'acc', dm:2, pl:'sag'},
  {n:'Loaded push-up',        p:'push', e:2, a:['floor'],           d:'8–12', t:'s', r:'sec', dm:3, pl:'sag'},
  {n:'Dip',                   p:'push', e:3, a:[],                  d:'6–10', t:'p', r:'sec', dm:3, pl:'sag'},
  {n:'Cable fly',             p:'push', e:3, a:[],                  d:'12–15', t:'s', r:'acc', dm:2, pl:'trans'},
  {n:'Pike push-up',          p:'push', e:0, a:['floor','overhead'],d:'6–10', t:'p', r:'sec', dm:3, pl:'sag', sp:['calisthenics']},
  // new — bands
  {n:'Band chest press',      p:'push', e:1, a:[],                  d:'3 × 15', t:'s', r:'sec', dm:2, pl:'sag'},
  {n:'Band overhead press',   p:'push', e:1, a:['overhead'],        d:'3 × 15', t:'s', r:'sec', dm:2, pl:'sag'},
  {n:'Band-resisted push-up', p:'push', e:1, a:['floor'],           d:'3 × 12', t:'s', r:'sec', dm:3, pl:'sag'},
  {n:'Single-arm band press', p:'push', e:1, a:[],                  d:'3 × 12 each side', t:'p', r:'acc', dm:2, pl:'trans', u:1},
  // new — bodyweight
  {n:'Archer push-up',        p:'push', e:0, a:['floor'],           d:'3 × 6 each side', t:'c', r:'sec', dm:3, pl:'front', u:1, sp:['calisthenics']},
  {n:'Diamond push-up',       p:'push', e:0, a:['floor'],           d:'3 × 10', t:'s', r:'acc', dm:3, pl:'sag'},
  {n:'Decline push-up',       p:'push', e:0, a:['floor'],           d:'3 × 12', t:'s', r:'sec', dm:3, pl:'sag'},
  {n:'Pseudo-planche push-up',p:'push', e:0, a:['floor'],           d:'3 × 6', t:'c', r:'sec', dm:3, pl:'sag', sp:['calisthenics']},
  // new — gym and dumbbell, including an anchor
  {n:'Weighted dip',          p:'push', e:3, a:[],                  d:'4–6', t:'p', r:'main', dm:3, pl:'sag'},
  {n:'Single-arm dumbbell bench press', p:'push', e:2, a:[],        d:'6–8 each side', t:'p', r:'main', dm:3, pl:'trans', u:1},
  {n:'Close-grip bench press',p:'push', e:3, a:[],                  d:'6–8', t:'p', r:'sec', dm:3, pl:'sag'},
  {n:'Incline barbell press', p:'push', e:3, a:[],                  d:'5–8', t:'p', r:'sec', dm:3, pl:'sag'},
  {n:'Landmine press',        p:'push', e:3, a:[],                  d:'3 × 10 each side', t:'p', r:'sec', dm:2, pl:'trans', u:1, sp:['racket']},
  {n:'Half-kneeling overhead press', p:'push', e:2, a:['overhead'], d:'3 × 8 each side', t:'p', r:'sec', dm:2, pl:'sag', u:1},
  {n:'Push press',            p:'push', e:3, a:['overhead'],        d:'3 × 5', t:'c', r:'sec', dm:3, pl:'sag'},
  {n:'Machine chest press',   p:'push', e:3, a:[],                  d:'10–12', t:'s', r:'acc', dm:2, pl:'sag'},
  {n:'Cable crossover, low to high', p:'push', e:3, a:[],           d:'3 × 15', t:'s', r:'acc', dm:2, pl:'trans'},

  /* ===== PULL ============================================================= */
  {n:'Pull-up',           p:'pull', e:3, a:['grip'], d:'5–8', t:'p', r:'sec', dm:3, pl:'sag', sp:['calisthenics']},
  {n:'Chin-up',           p:'pull', e:3, a:['grip'], d:'5–8', t:'p', r:'sec', dm:3, pl:'sag', sp:['calisthenics']},
  {n:'Weighted pull-up',  p:'pull', e:3, a:['grip'], d:'3–6', t:'p', r:'main', dm:3, pl:'sag'},
  {n:'Lat pulldown',      p:'pull', e:3, a:[],       d:'8–12', t:'s', r:'sec', dm:2, pl:'sag'},
  {n:'Barbell row',       p:'pull', e:3, a:['grip'], d:'6–10', t:'p', r:'main', dm:3, pl:'sag'},
  {n:'Dumbbell row',      p:'pull', e:2, a:[],       d:'8–12 each side', t:'s', r:'sec', dm:2, pl:'sag', u:1},
  {n:'Cable row',         p:'pull', e:3, a:[],       d:'8–12', t:'s', r:'sec', dm:2, pl:'sag'},
  {n:'Inverted row',      p:'pull', e:3, a:[],       d:'10–15', t:'s', r:'acc', dm:2, pl:'sag'},
  {n:'Face pull',         p:'pull', e:1, a:[],       d:'12–20', t:'s', r:'acc', dm:1, pl:'sag'},
  {n:'Band pull-apart',   p:'pull', e:1, a:[],       d:'15–20', t:'s', r:'acc', dm:1, pl:'front'},
  // new — bands
  {n:'Band row, seated',  p:'pull', e:1, a:[],       d:'3 × 15', t:'s', r:'sec', dm:2, pl:'sag'},
  {n:'Band lat pulldown', p:'pull', e:1, a:['overhead'], d:'3 × 15', t:'s', r:'sec', dm:2, pl:'sag'},
  {n:'Band straight-arm pulldown', p:'pull', e:1, a:[], d:'3 × 15', t:'s', r:'acc', dm:2, pl:'sag'},
  {n:'Single-arm band row', p:'pull', e:1, a:[],     d:'3 × 12 each side', t:'s', r:'acc', dm:2, pl:'trans', u:1},
  // new — bodyweight
  {n:'Towel row, under a table', p:'pull', e:0, a:['floor','grip'], d:'3 × 12', t:'s', r:'sec', dm:2, pl:'sag'},
  {n:'Doorway isometric row', p:'pull', e:0, a:['grip'], d:'3 × 20 sec each side', t:'s', r:'acc', dm:2, pl:'sag', u:1},
  {n:'Prone swimmers',    p:'pull', e:0, a:['floor'], d:'3 × 30 sec', t:'s', r:'acc', dm:2, pl:'sag'},
  {n:'Superman hold',     p:'pull', e:0, a:['floor'], d:'3 × 30 sec', t:'s', r:'acc', dm:2, pl:'sag'},
  // new — gym and dumbbell
  {n:'Archer pull-up',    p:'pull', e:3, a:['grip'],  d:'3 × 4 each side', t:'c', r:'sec', dm:3, pl:'front', u:1, sp:['calisthenics']},
  {n:'Chest-supported row', p:'pull', e:3, a:[],      d:'8–12', t:'s', r:'sec', dm:2, pl:'sag'},
  {n:'Pendlay row',       p:'pull', e:3, a:['grip'],  d:'5–8', t:'c', r:'sec', dm:3, pl:'sag'},
  {n:'Meadows row',       p:'pull', e:3, a:['grip'],  d:'3 × 10 each side', t:'p', r:'sec', dm:3, pl:'trans', u:1},
  {n:'Single-arm cable row, rotating', p:'pull', e:3, a:[], d:'3 × 12 each side', t:'p', r:'sec', dm:2, pl:'trans', u:1, sp:['racket']},
  {n:'Straight-arm pulldown', p:'pull', e:3, a:[],    d:'3 × 15', t:'s', r:'acc', dm:2, pl:'sag'},
  {n:'Scapular pull-up',  p:'pull', e:3, a:['grip','overhead'], d:'3 × 8', t:'p', r:'acc', dm:2, pl:'sag', sp:['calisthenics']},
  {n:'Shrug',             p:'pull', e:2, a:['grip'],  d:'3 × 12', t:'s', r:'acc', dm:2, pl:'sag'},

  /* ===== ACCESSORY ======================================================== */
  {n:'Lateral raise',     p:'acc', e:2, a:[], d:'12–15', t:'s', r:'acc', dm:2, pl:'front'},
  {n:'Biceps curl',       p:'acc', e:2, a:[], d:'10–15', t:'s', r:'acc', dm:2, pl:'sag'},
  {n:'Triceps extension', p:'acc', e:2, a:[], d:'10–15', t:'s', r:'acc', dm:2, pl:'sag'},
  {n:'Calf raise',        p:'acc', e:0, a:[], d:'12–20', t:'s', r:'acc', dm:2, pl:'sag'},
  {n:'Rear delt fly',     p:'acc', e:2, a:[], d:'12–20', t:'s', r:'acc', dm:2, pl:'trans'},
  // new — bands
  {n:'Band biceps curl',  p:'acc', e:1, a:[], d:'3 × 15', t:'s', r:'acc', dm:2, pl:'sag'},
  {n:'Band triceps pressdown', p:'acc', e:1, a:[], d:'3 × 15', t:'s', r:'acc', dm:2, pl:'sag'},
  {n:'Band lateral raise',p:'acc', e:1, a:[], d:'3 × 15', t:'s', r:'acc', dm:2, pl:'front'},
  {n:'Band external rotation', p:'acc', e:1, a:[], d:'3 × 15 each side', t:'s', r:'acc', dm:1, pl:'trans', u:1, sp:['racket']},
  {n:'Band wrist extension', p:'acc', e:1, a:['grip'], d:'3 × 20 each side', t:'s', r:'acc', dm:1, pl:'sag', u:1, sp:['racket']},
  {n:'Band face-away curl', p:'acc', e:1, a:[], d:'3 × 15', t:'s', r:'acc', dm:2, pl:'sag'},
  // new — bodyweight
  {n:'Single-leg calf raise', p:'acc', e:0, a:[], d:'3 × 15 each side', t:'s', r:'acc', dm:2, pl:'sag', u:1},
  {n:'Tibialis raise',    p:'acc', e:0, a:[], d:'3 × 20', t:'s', r:'acc', dm:2, pl:'sag', sp:['racket']},
  {n:'Wrist push-up, kneeling', p:'acc', e:0, a:['floor','grip'], d:'3 × 12', t:'p', r:'acc', dm:2, pl:'sag', sp:['racket']},
  // new — dumbbell and gym
  {n:'Hammer curl',       p:'acc', e:2, a:[], d:'10–15', t:'s', r:'acc', dm:2, pl:'sag'},
  {n:'Reverse curl',      p:'acc', e:2, a:['grip'], d:'12–15', t:'s', r:'acc', dm:2, pl:'sag', sp:['racket']},
  {n:'Overhead triceps extension', p:'acc', e:2, a:['overhead'], d:'10–15', t:'s', r:'acc', dm:2, pl:'sag'},
  {n:'Cable lateral raise', p:'acc', e:3, a:[], d:'3 × 15 each side', t:'s', r:'acc', dm:2, pl:'front', u:1},
  {n:'External rotation, cable', p:'acc', e:3, a:[], d:'3 × 15 each side', t:'s', r:'acc', dm:2, pl:'trans', u:1, sp:['racket']},
  {n:'Wrist roller',      p:'acc', e:3, a:['grip'], d:'3 × 2 up and down', t:'s', r:'acc', dm:3, pl:'sag', sp:['racket','calisthenics']},
  {n:'Forearm pronation / supination', p:'acc', e:2, a:['grip'], d:'3 × 15 each side', t:'s', r:'acc', dm:2, pl:'trans', u:1, sp:['racket']},
  {n:'Copenhagen plank',  p:'acc', e:3, a:[], d:'3 × 25 sec each side', t:'p', r:'sec', dm:3, pl:'front', u:1, sp:['racket']},
  {n:'Nordic curl, assisted', p:'acc', e:0, a:['floor','deepknee'], d:'3 × 6', t:'p', r:'sec', dm:3, pl:'sag'},
  {n:'Seated calf raise', p:'acc', e:3, a:[], d:'3 × 15', t:'s', r:'acc', dm:2, pl:'sag'},

  /* ===== CORE ============================================================= */
  {n:'Plank',             p:'core', e:0, a:['floor'], d:'30–60 sec', t:'s', r:'acc', dm:2, pl:'sag'},
  {n:'Side plank',        p:'core', e:0, a:['floor'], d:'30–45 sec each', t:'s', r:'acc', dm:2, pl:'front', u:1},
  {n:'Hollow hold',       p:'core', e:0, a:['floor'], d:'20–40 sec', t:'p', r:'acc', dm:3, pl:'sag', sp:['calisthenics']},
  {n:'Dead bug',          p:'core', e:0, a:['floor'], d:'8–12 each side', t:'s', r:'acc', dm:2, pl:'sag', u:1},
  {n:'Hanging leg raise', p:'core', e:3, a:['grip'],  d:'8–12 reps', t:'p', r:'sec', dm:3, pl:'sag', sp:['calisthenics']},
  {n:'Ab wheel rollout',  p:'core', e:3, a:['floor'], d:'6–10 reps', t:'p', r:'sec', dm:3, pl:'sag'},
  {n:'Pallof press',      p:'core', e:1, a:[],        d:'10–12 each side', t:'s', r:'acc', dm:2, pl:'trans', u:1, sp:['racket']},
  {n:'Russian twist',     p:'core', e:0, a:['floor'], d:'12–16 each side', t:'s', r:'acc', dm:2, pl:'trans', u:1},
  {n:'Suitcase carry',    p:'core', e:2, a:['grip'],  d:'30 m each side', t:'s', r:'sec', dm:3, pl:'front', u:1},
  // new
  {n:'Cable woodchop, high to low', p:'core', e:3, a:[], d:'3 × 12 each side', t:'p', r:'sec', dm:3, pl:'trans', u:1, sp:['racket']},
  {n:'Cable woodchop, low to high', p:'core', e:3, a:[], d:'3 × 12 each side', t:'p', r:'sec', dm:3, pl:'trans', u:1, sp:['racket']},
  {n:'Landmine rotation', p:'core', e:3, a:[],        d:'3 × 10 each side', t:'p', r:'sec', dm:3, pl:'trans', u:1, sp:['racket']},
  {n:'Medicine ball rotational throw', p:'core', e:3, a:[], d:'4 × 6 each side', t:'p', r:'sec', dm:3, pl:'trans', u:1, sp:['racket']},
  {n:'Half-kneeling Pallof hold', p:'core', e:3, a:[], d:'3 × 25 sec each side', t:'p', r:'acc', dm:3, pl:'trans', u:1, sp:['racket']},
  {n:'L-sit progression', p:'core', e:3, a:[],        d:'4 × 15–25 sec', t:'c', r:'sec', dm:3, pl:'sag', sp:['calisthenics']},
  {n:'Hollow rock',       p:'core', e:0, a:['floor'], d:'3 × 20', t:'p', r:'acc', dm:3, pl:'sag', sp:['calisthenics']},
  {n:'Bear crawl',        p:'core', e:0, a:['floor'], d:'4 × 20 m', t:'s', r:'acc', dm:3, pl:'trans'},
  {n:'Side plank with hip dip', p:'core', e:0, a:['floor'], d:'3 × 12 each side', t:'p', r:'acc', dm:3, pl:'front', u:1},
  {n:'Overhead carry',    p:'core', e:2, a:['grip','overhead'], d:'4 × 30 m each side', t:'p', r:'sec', dm:3, pl:'front', u:1},
  {n:'Weighted plank',    p:'core', e:2, a:['floor'], d:'3 × 40 sec', t:'s', r:'sec', dm:3, pl:'sag'},
  {n:'Reverse crunch',    p:'core', e:0, a:['floor'], d:'3 × 15', t:'s', r:'acc', dm:2, pl:'sag'},
  {n:'Banded anti-rotation hold', p:'core', e:1, a:[], d:'3 × 20 sec each side', t:'s', r:'acc', dm:2, pl:'trans', u:1, sp:['racket']},

  /* ===== FINISHER ========================================================= */
  {n:'Rower intervals',      p:'fin', e:3, a:['grip'],         d:'5 × 250 m, 1 min rest', t:'p', r:'sec', dm:3, pl:'sag'},
  {n:'Assault bike sprints', p:'fin', e:3, a:[],               d:'6 × 20 sec hard, 40 sec easy', t:'s', r:'sec', dm:3, pl:'sag', sp:['bike']},
  {n:'Wall ball',            p:'fin', e:3, a:['overhead'],     d:'3 × 15', t:'p', r:'sec', dm:3, pl:'sag'},
  {n:'Kettlebell swings',    p:'fin', e:2, a:['grip'],         d:'5 × 15, 30 sec rest', t:'c', r:'sec', dm:3, pl:'sag'},
  {n:'Farmer’s carry',       p:'fin', e:2, a:['grip'],         d:'4 × 40 m', t:'s', r:'sec', dm:3, pl:'front'},
  {n:'Battle ropes',         p:'fin', e:3, a:['grip'],         d:'6 × 20 sec', t:'s', r:'acc', dm:3, pl:'sag'},
  {n:'Burpees',              p:'fin', e:0, a:['jump','floor'], d:'5 × 8', t:'s', r:'sec', dm:3, pl:'sag'},
  {n:'Mountain climbers',    p:'fin', e:0, a:['floor'],        d:'4 × 40 sec', t:'s', r:'acc', dm:2, pl:'trans'},
  {n:'Jump rope',            p:'fin', e:0, a:['jump'],         d:'5 × 1 min', t:'s', r:'acc', dm:2, pl:'sag', sp:['racket']},
  // new — Box jump moved here from squat, per the earlier decision
  {n:'Box jump',             p:'fin', e:3, a:['jump'],         d:'5 × 3, 90 sec rest', t:'p', r:'sec', dm:3, pl:'sag'},
  {n:'Lateral bound',        p:'fin', e:0, a:['jump'],         d:'4 × 6 each side', t:'p', r:'sec', dm:3, pl:'front', u:1, sp:['racket']},
  {n:'Medicine ball slam',   p:'fin', e:3, a:['overhead'],     d:'4 × 10', t:'s', r:'sec', dm:3, pl:'sag'},
  {n:'Sled drag, backwards', p:'fin', e:3, a:[],               d:'5 × 25 m', t:'s', r:'sec', dm:3, pl:'sag'},
  {n:'Ski erg intervals',    p:'fin', e:3, a:['grip'],         d:'6 × 30 sec hard, 30 sec easy', t:'s', r:'sec', dm:3, pl:'sag'},
  {n:'Shuttle runs',         p:'fin', e:0, a:['jump'],         d:'6 × 20 m there and back', t:'s', r:'sec', dm:3, pl:'trans', sp:['racket']},
  {n:'Kettlebell clean and press', p:'fin', e:2, a:['grip','overhead'], d:'5 × 5 each side', t:'c', r:'sec', dm:3, pl:'sag', u:1},
  {n:'Bear crawl shuttle',   p:'fin', e:0, a:['floor'],        d:'5 × 15 m', t:'s', r:'sec', dm:3, pl:'trans'},
  {n:'Dumbbell thruster',    p:'fin', e:2, a:['overhead'],     d:'4 × 10', t:'p', r:'sec', dm:3, pl:'sag'},
  {n:'Jumping lunge',        p:'fin', e:0, a:['jump'],         d:'4 × 10 each side', t:'p', r:'acc', dm:3, pl:'sag', u:1},
  {n:'Rowing, steady',       p:'fin', e:3, a:['grip'],         d:'8 min at a conversational pace', t:'s', r:'acc', dm:2, pl:'sag'},
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
  'Cossack squat':'BW', 'Deep ATG squat':20,
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
const targetReps = d => {
  const range = (d || '').match(/(\d+)\s*[–—-]\s*(\d+)/);
  if (range) return range[1];
  const fixed = (d || '').match(/^\s*\d+\s*×\s*(\d+)/);   // "4 × 5 each side"
  return fixed ? fixed[1] : '';
};
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
  main: ['Main lift', 'the heaviest thing you do that day'],
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

/* Everything that fits the slot: the pattern filter first, then the best role the slot
   will settle for. Returns the pool and the role it actually found, because "we asked for
   a main and got a secondary" is worth knowing further up.

   `drawn` is the set of patterns this block has already used. On an either|or slot it
   breaks the tie towards the side that has not been used: a five-exercise full body wraps
   back to the hinge-or-squat slot, and without this it could answer "squat" twice and
   never train a hinge. It is a tie-break inside a role and not above it — a hinge
   accessory is not a better answer than a squat secondary, it is just a fresher one. */
function slotPool(slot, equip, avoid, used, drawn, test) {
  const all = eligible(slot.p, equip, avoid, used).filter(x => !test || test(x));
  const sides = String(slot.p).split('|');
  const fresh = (drawn && sides.length > 1) ? sides.filter(p => !drawn.has(p)) : [];
  for (const r of (SLOT_ROLES[slot.r] || SLOT_ROLES.acc)) {
    const pool = all.filter(x => roleOf(x) === r);
    if (!pool.length) continue;
    if (fresh.length) {
      const unused = pool.filter(x => fresh.includes(x.p));
      if (unused.length) return {pool: unused, role: r};
    }
    return {pool, role: r};
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
/* Two things a session should have, if the pool can supply them.

   The library was about 95% sagittal before v2, and a draw left to itself will
   happily write five movements that all push and pull along the same line. Both
   sports here are rotational, and one side at a time is where an imbalance shows
   up. So: at least one movement out of the sagittal plane, and at least one
   unilateral.

   Both are soft. They are a repair after the draw, not a filter during it — a
   filter would bend every slot towards variety, and these are session-level
   wants, not slot-level ones. If nothing in the pool satisfies one, the session
   is written without it rather than failing. */
const VARIETY = [
  {name: 'plane',      test: x => !!x.pl && x.pl !== 'sag'},
  {name: 'unilateral', test: x => !!x.u},
];

/* Trade one drawn movement for another in the same slot that satisfies `test`.
   Works backwards from the last movement, so an accessory is disturbed before
   the main lift. Never gives up the only movement meeting an invariant that is
   already met — fixing the plane must not cost the unilateral. */
function nudge(items, slots, test, take, used, protect) {
  if (!items.length || items.some(test)) return false;
  for (let i = items.length - 1; i >= 0; i--) {
    const was = items[i];
    if ((protect || []).some(p => p(was) && items.filter(p).length === 1)) continue;
    used.delete(was.name);
    // the other patterns still standing, so a repair cannot undo the either|or rule
    const others = new Set(items.filter((_, j) => j !== i).map(x => x.p).filter(Boolean));
    const alt = take(slots[i].p, slots[i].r, others, test);
    if (alt) { items[i] = alt; return true; }
    used.add(was.name);
  }
  return false;
}

function drawStrength(seq, nEx, take, notes, used) {
  const items = [], slots = [];
  const drawn = new Set();       // the patterns actually used, not the slots asked for
  let mainTaken = false;
  for (let i = 0; i < nEx; i++) {
    const slot = seq[i % seq.length];
    const want = (slot.r === 'main' && mainTaken) ? 'sec' : slot.r;
    const it = take(slot.p, want, drawn);
    if (!it) {
      (notes || []).push('No ' + slot.p.replace('|', ' or ') + ' movement available with those settings.');
      continue;
    }
    if (roleOf(it) === 'main') mainTaken = true;
    // the movement's own pattern, which for an either|or slot is one side of it
    drawn.add(it.p || movementFor(it).p);
    items.push(it);
    slots.push({p: slot.p, r: want});
  }
  if (used) VARIETY.forEach(v => {
    if (items.some(v.test)) return;
    const protect = VARIETY.filter(o => o !== v && items.some(o.test)).map(o => o.test);
    nudge(items, slots, v.test, take, used, protect);
  });
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

/* Some prescriptions name their own sets. "4 × 6, 3 sec up and 3 sec down" is the whole
   of Heavy Slow Resistance, tempo included, and "4 × 5 each side" is what a pistol squat
   is worth — neither is a rep range waiting for a set count in front of it. A movement
   that gives a bare range gets the block's set count; one that already counts its own
   keeps what it says, or you get "3 × 4 × 6". */
const ownsSets = d => /^\s*\d+\s*×/.test(String(d || ''));
const withSets = (sets, reps) => ownsSets(reps) ? String(reps) : sets + ' × ' + reps;

/* The prescription a swapped-in movement should carry. A strength movement keeps the set
   count the block was written with and brings its own reps — swapping a deadlift for a
   good morning has to change the numbers, which is the whole point. Everything else owns
   its prescription outright: a mobility drill's "2 × 10" is not 2 sets of anything the
   block decided. */
function detailFor(after, prevDetail, pattern) {
  const p = String(pattern || after.p || '').split('|')[0];
  const own = after.d || REPS[p] || '8–12';
  if (!LOGGABLE.has(p)) return after.d || prevDetail || '';
  if (ownsSets(own)) return own;
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
