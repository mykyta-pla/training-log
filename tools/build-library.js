// Writes the whole movement library into movements/index.html as plain HTML, so
// it is in the page source rather than only inside movements.js, where no crawler
// and no reader without JavaScript would ever see it.
//
// It writes two things from the one source: the visible list, and the ItemList
// JSON-LD that mirrors it. Neither can drift from movements.js or from the other.
//
//   node tools/build-library.js          rewrite the block
//   node tools/build-library.js --check  exit 1 if the block is out of date
//
// Run from the repo root. Nothing on the site loads this file.

const fs = require('fs');
const vm = require('vm');

const START = '<!-- library:start -->';
const END = '<!-- library:end -->';
const PAGE = 'movements/index.html';

const PSTART = '<!-- protocols:start -->';
const PEND = '<!-- protocols:end -->';
const PPAGE = 'protocols/index.html';

// movements.js is a plain script meant for a browser. Give it just enough of one.
const sandbox = {localStorage: {getItem: () => null, setItem: () => {}}, document: undefined};
vm.createContext(sandbox);
// top-level const stays in the script's own scope, so hand the three out explicitly
vm.runInContext(fs.readFileSync('movements.js', 'utf8') +
  '\n;globalThis.__lib = {LIB, GROUPS, START_KG, LOGGABLE, sourcesFor, SOURCES, movementsFrom};', sandbox);
const {LIB, GROUPS, START_KG, LOGGABLE, sourcesFor, SOURCES, movementsFrom} = sandbox.__lib;

const KIT = ['bodyweight alone', 'a band', 'dumbbells', 'a full gym'];
const TECH = {s: 'Straightforward', p: 'Practised', c: 'Coached'};
// plane and demand, in words. Demand is not technique: a supine twist asks for no
// skill and costs nothing, a Jefferson curl asks for a lot of both, and a wall sit
// asks for none and still costs you something.
const PLANE = {sag: 'Forward and back', front: 'Side to side', trans: 'Rotation'};
const DEMAND = ['', 'Easy day', 'Real work', 'Costs you something'];
const AVOID = {
  deepknee: 'deep knee flexion', overhead: 'overhead loading',
  jump: 'jumping and impact', floor: 'floor work', grip: 'heavy grip',
};
const esc = s => String(s).replace(/&(?![a-z]+;|#\d+;)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// The page is written with HTML entities, not literal punctuation. Match it.
const ent = s => esc(s).replace(/—/g, '&mdash;').replace(/–/g, '&ndash;')
  .replace(/’/g, '&rsquo;').replace(/×/g, '&times;').replace(/·/g, '&middot;');

// The one sentence each movement gets, as plain text. The page shows it with
// the name in bold; the JSON-LD carries the same sentence as a description, so
// the markup says exactly what a reader sees and nothing more.
// A strength movement's prescription is a rep range on its own — the builder puts the set
// count in front of it — so it needs the word, and it does not replace the starting load
// the way a mobility drill's whole prescription does.
const reps = d => /^\d+\s*[–—-]\s*\d+$/.test(d) ? d + ' reps' : d;

const sentence = x => {
  const bits = [KIT[x.e]];
  const kg = START_KG[x.n];
  if (x.d) bits.push(LOGGABLE.has(x.p) ? reps(x.d) : x.d);
  if (typeof kg === 'number') bits.push('starts at ' + kg + ' kg');
  const held = (x.a || []).map(t => AVOID[t]).filter(Boolean);
  return bits.join(', ') +
    (held.length ? `. Held back when you ask it to avoid ${held.join(' or ')}` : '') + '.';
};

/* Where a movement came from, on the library page. Same rules as a session card:
   nothing at all when there is no protocol, the protocol's own name for the movement
   where it differs, the approximation spelled out where the mapping is not exact, and
   contested in the signal colour. */
const source = x => sourcesFor(x.n).map(m => {
  const as = (m.as && m.as !== x.n) ? ` Called &ldquo;${ent(m.as)}&rdquo; there.` : '';
  const ap = m.approx ? ` ${ent(m.approx)}` : '';
  return `\n        <span class="src">From <a href="${ent(m.src.url)}" target="_blank" rel="noopener">`
       + `${ent(m.src.name)}</a> &mdash; ${ent(m.src.sport.split(' — ')[0])} &middot; evidence: `
       + `<b class="ev ev-${m.src.evidence}">${m.src.evidence}</b>`
       + (as || ap ? `<span class="sas">${(as + ap).trim()}</span>` : '') + `</span>`;
}).join('');

const line = x =>
  `    <li><strong>${ent(x.n)}</strong> &mdash; ${ent(sentence(x))}` +
  `\n        <span class="tech t-${x.t}">${TECH[x.t]}</span>` +
  `\n        <span class="axis">${ent(PLANE[x.pl] || '')}${x.u ? ', one side at a time' : ''}` +
  ` &middot; ${ent(DEMAND[x.dm] || '')}</span>${source(x)}</li>`;

// ExercisePlan, not ExerciseAction. An Action asserts that something was or will
// be performed, by an agent, at a time — none of which is true of a menu nobody
// has done yet. schema.org defines ExercisePlan as a fitness activity "including
// defined exercise routines", which is what each of these is, and it carries
// exerciseType and additionalVariable, where the pattern, the equipment, the
// starting load and the avoid tags actually belong.
const plan = (x, label) => {
  const extra = [`Minimum equipment: ${KIT[x.e]}`];
  const kg = START_KG[x.n];
  if (x.d) extra.push(`Prescription: ${LOGGABLE.has(x.p) ? reps(x.d) : x.d}`);
  if (typeof kg === 'number')
    extra.push(`Starting load for someone of average strength: ${kg} kg`);
  else if (kg === 'BW') extra.push('Starting load: bodyweight');
  const held = (x.a || []).map(t => AVOID[t]).filter(Boolean);
  if (held.length) extra.push(`Held back when avoiding: ${held.join(', ')}`);
  extra.push(`Technique: ${TECH[x.t]}`);
  if (PLANE[x.pl]) extra.push(`Plane of movement: ${PLANE[x.pl]}${x.u ? ', one side at a time' : ''}`);
  if (DEMAND[x.dm]) extra.push(`Demand: ${DEMAND[x.dm]}`);
  sourcesFor(x.n).forEach(m => extra.push(
    `From the published protocol: ${m.src.name} (${m.src.sport}) — evidence: ${m.src.evidence}`
    + (m.as && m.as !== x.n ? `, called "${m.as}" there` : '')
    + (m.approx ? `. ${m.approx}` : '')));
  return {
    '@type': 'ExercisePlan',
    name: x.n,
    // a line that stands up on its own, since a description is quoted without
    // the heading that sits above it on the page
    description: `${x.n} — needs ${sentence(x)}`,
    exerciseType: label,
    // technique rides in additionalVariable, not in intensity: schema.org means
    // physical intensity by that, and this is skill. Wrong word, no thanks.
    additionalVariable: extra,
  };
};

// every group, in the order GROUPS declares them
const WANT = GROUPS.map(g => g[0]);
const seen = new Set();
const plans = [];
const blocks = WANT.map(key => {
  const label = (GROUPS.find(g => g[0] === key) || [null, key])[1];
  const items = LIB.filter(x => x.p === key && !seen.has(x.n) && seen.add(x.n) !== undefined);
  if (!items.length) return '';
  items.forEach(x => plans.push(plan(x, label)));
  return `  <h3>${ent(label)}</h3>\n  <ul>\n${items.map(line).join('\n')}\n  </ul>`;
}).filter(Boolean);

// the same 86 movements again, as markup
const graph = {
  '@context': 'https://schema.org',
  '@graph': [{
    '@type': 'ItemList',
    '@id': 'https://notaroutine.life/movements/#library',
    name: 'The movement library',
    description: 'Every movement the notaroutine session builder can draw, grouped by what '
      + 'it trains, with the least equipment each one needs and either its prescription or '
      + 'an ordinary starting load.',
    itemListOrder: 'https://schema.org/ItemListUnordered',
    numberOfItems: plans.length,
    itemListElement: plans.map((p, i) => ({'@type': 'ListItem', position: i + 1, item: p})),
  }],
};
const ld = JSON.stringify(graph, null, 2).split('\n').map(l => '    ' + l).join('\n');

const body = [
  START,
  '  <!-- Generated by tools/build-library.js from movements.js. Edit the movement',
  '       there and re-run it; do not edit these lists by hand. -->',
  ...blocks,
  '',
  '  <script type="application/ld+json">',
  ld,
  '  </script>',
  '  ' + END,
].join('\n');

/* ---------------------------------------------------------------- protocols --
   The same source, a second page. Each protocol's own words — what it is, what the
   trial measured — are written out verbatim from SOURCES, and the movements under
   it are whatever actually points at it, so neither can drift from movements.js. */

const protoBlocks = Object.keys(SOURCES).map(key => {
  const s = SOURCES[key];
  const mv = movementsFrom(key);
  const links = [['The trial', s.url], ['A second trial', s.extra], ['The protocol itself', s.manual]]
    .filter(([, u]) => u)
    .map(([label, u]) => `<a href="${ent(u)}" target="_blank" rel="noopener">${label}</a>`)
    .join(' &middot; ');
  const list = mv.length
    ? `  <p class="hint">In the library &mdash; ${mv.length} movement${mv.length === 1 ? '' : 's'}:</p>\n`
      + `  <ul>\n` + mv.map(x => {
          const m = sourcesFor(x.n).find(y => y.s === key);
          const as = (m.as && m.as !== x.n) ? ` &mdash; called &ldquo;${ent(m.as)}&rdquo; there` : '';
          const ap = m.approx ? ` <span class="sap">${ent(m.approx)}</span>` : '';
          return `    <li><a href="../movements/">${ent(x.n)}</a>${as}${ap}</li>`;
        }).join('\n') + `\n  </ul>`
    : `  <p class="hint">No movement in the library carries this as a source.</p>`;
  return [
    `  <h2 id="${key}">${ent(s.name)}</h2>`,
    `  <p class="hint">${ent(s.sport)} &middot; evidence: `
      + `<b class="ev ev-${s.evidence}">${s.evidence}</b></p>`,
    `  <p>${ent(s.what)}</p>`,
    `  <p>${ent(s.note)}</p>`,
    `  <p class="hint">${links}</p>`,
    list,
  ].join('\n');
});

// Article, and an ItemList of the protocols carrying name, evidence grade and url.
const protoGraph = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      '@id': 'https://notaroutine.life/protocols/#article',
      isPartOf: {'@id': 'https://notaroutine.life/#website'},
      mainEntityOfPage: {'@type': 'WebPage', '@id': 'https://notaroutine.life/protocols/'},
      headline: 'The five protocols with a paper behind them',
      description: 'Five published training protocols, what each trial measured and in whom, '
        + 'the evidence grade each carries, and which movements in the library come from them.',
      datePublished: '2026-09-14',
      dateModified: '2026-09-14',
      author: {'@id': 'https://notaroutine.life/#org'},
      publisher: {'@id': 'https://notaroutine.life/#org'},
      inLanguage: 'en-GB',
    },
    {
      '@type': 'ItemList',
      '@id': 'https://notaroutine.life/protocols/#protocols',
      name: 'Published protocols behind movements in this library',
      itemListOrder: 'https://schema.org/ItemListUnordered',
      numberOfItems: Object.keys(SOURCES).length,
      itemListElement: Object.keys(SOURCES).map((key, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'ExercisePlan',
          name: SOURCES[key].name,
          description: SOURCES[key].what,
          url: SOURCES[key].url,
          // the grade this site gives the evidence, not a claim the protocol makes
          additionalVariable: [
            `Evidence: ${SOURCES[key].evidence}`,
            `Field: ${SOURCES[key].sport}`,
            `Movements in this library: ${movementsFrom(key).length}`,
          ],
        },
      })),
    },
  ],
};
const pld = JSON.stringify(protoGraph, null, 2).split('\n').map(l => '    ' + l).join('\n');

const protoBody = [
  PSTART,
  '  <!-- Generated by tools/build-library.js from movements.js. Edit SOURCES there',
  '       and re-run it; do not edit this block by hand. -->',
  ...protoBlocks,
  '',
  '  <script type="application/ld+json">',
  pld,
  '  </script>',
  '  ' + PEND,
].join('\n');

const ppage = fs.readFileSync(PPAGE, 'utf8');
const pfrom = ppage.indexOf(PSTART), pto = ppage.indexOf(PEND);
if (pfrom < 0 || pto < 0) {
  console.error(`${PPAGE} has no ${PSTART} … ${PEND} block to fill.`);
  process.exit(2);
}
const pnext = ppage.slice(0, pfrom) + protoBody + ppage.slice(pto + PEND.length);

const page = fs.readFileSync(PAGE, 'utf8');
const from = page.indexOf(START), to = page.indexOf(END);
if (from < 0 || to < 0) {
  console.error(`${PAGE} has no ${START} … ${END} block to fill.`);
  process.exit(2);
}
const next = page.slice(0, from) + body + page.slice(to + END.length);

if (process.argv.includes('--check')) {
  const stale = [next === page ? null : PAGE, pnext === ppage ? null : PPAGE].filter(Boolean);
  if (!stale.length) {
    console.log(`${PAGE}: the movement library matches movements.js.`);
    console.log(`${PPAGE}: the protocols match movements.js.`);
    process.exit(0);
  }
  console.error(`${stale.join(' and ')} out of date. Run: node tools/build-library.js`);
  process.exit(1);
}
fs.writeFileSync(PAGE, next);
console.log(`${PAGE}: wrote ${seen.size} movements across ${blocks.length} groups.`);
fs.writeFileSync(PPAGE, pnext);
console.log(`${PPAGE}: wrote ${protoBlocks.length} protocols.`);
