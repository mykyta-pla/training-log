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

// movements.js is a plain script meant for a browser. Give it just enough of one.
const sandbox = {localStorage: {getItem: () => null, setItem: () => {}}, document: undefined};
vm.createContext(sandbox);
// top-level const stays in the script's own scope, so hand the three out explicitly
vm.runInContext(fs.readFileSync('movements.js', 'utf8') +
  '\n;globalThis.__lib = {LIB, GROUPS, START_KG};', sandbox);
const {LIB, GROUPS, START_KG} = sandbox.__lib;

const KIT = ['bodyweight alone', 'a band', 'dumbbells', 'a full gym'];
const TECH = {s: 'Straightforward', p: 'Practised', c: 'Coached'};
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
const sentence = x => {
  const bits = [KIT[x.e]];
  const kg = START_KG[x.n];
  if (x.d) bits.push(x.d);
  else if (typeof kg === 'number') bits.push('starts at ' + kg + ' kg');
  const held = (x.a || []).map(t => AVOID[t]).filter(Boolean);
  return bits.join(', ') +
    (held.length ? `. Held back when you ask it to avoid ${held.join(' or ')}` : '') + '.';
};

const line = x =>
  `    <li><strong>${ent(x.n)}</strong> &mdash; ${ent(sentence(x))}` +
  `\n        <span class="tech t-${x.t}">${TECH[x.t]}</span></li>`;

// ExercisePlan, not ExerciseAction. An Action asserts that something was or will
// be performed, by an agent, at a time — none of which is true of a menu nobody
// has done yet. schema.org defines ExercisePlan as a fitness activity "including
// defined exercise routines", which is what each of these is, and it carries
// exerciseType and additionalVariable, where the pattern, the equipment, the
// starting load and the avoid tags actually belong.
const plan = (x, label) => {
  const extra = [`Minimum equipment: ${KIT[x.e]}`];
  const kg = START_KG[x.n];
  if (x.d) extra.push(`Prescription: ${x.d}`);
  else if (typeof kg === 'number')
    extra.push(`Starting load for someone of average strength: ${kg} kg`);
  else if (kg === 'BW') extra.push('Starting load: bodyweight');
  const held = (x.a || []).map(t => AVOID[t]).filter(Boolean);
  if (held.length) extra.push(`Held back when avoiding: ${held.join(', ')}`);
  extra.push(`Technique: ${TECH[x.t]}`);
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

const page = fs.readFileSync(PAGE, 'utf8');
const from = page.indexOf(START), to = page.indexOf(END);
if (from < 0 || to < 0) {
  console.error(`${PAGE} has no ${START} … ${END} block to fill.`);
  process.exit(2);
}
const next = page.slice(0, from) + body + page.slice(to + END.length);

if (process.argv.includes('--check')) {
  if (next === page) { console.log(`${PAGE}: the movement library matches movements.js.`); process.exit(0); }
  console.error(`${PAGE}: the movement library is out of date. Run: node tools/build-library.js`);
  process.exit(1);
}
fs.writeFileSync(PAGE, next);
console.log(`${PAGE}: wrote ${seen.size} movements across ${blocks.length} groups.`);
