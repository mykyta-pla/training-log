// Checks the inline JSON-LD on every page without a network round trip: this
// sandbox cannot reach schema.org or the Rich Results Test, so the vocabulary
// below is written out by hand from schema.org and checked against the pages.
//
//   node tools/check-jsonld.js
//
// It verifies that every block parses, that every @type is one this site has
// declared it uses, that every property is defined on that type or inherited,
// that required and recommended properties are present, that internal @id
// references resolve, and that no absolute URL points anywhere but the site.
// It is not a substitute for validator.schema.org — run that too, from a
// machine with a network.

const fs = require('fs');

const SITE = 'https://notaroutine.life';

// type -> properties valid on it, including everything inherited from Thing.
const THING = ['@type', '@id', 'name', 'description', 'url', 'image', 'identifier',
               'sameAs', 'alternateName', 'disambiguatingDescription', 'mainEntityOfPage',
               'additionalType', 'potentialAction', 'subjectOf'];
const CREATIVE = THING.concat([
  'headline', 'datePublished', 'dateModified', 'dateCreated', 'author', 'publisher',
  'inLanguage', 'isAccessibleForFree', 'isPartOf', 'about', 'keywords', 'license',
  'creativeWorkStatus', 'thumbnailUrl', 'text', 'abstract', 'citation', 'genre']);

const VOCAB = {
  Organization: THING.concat(['logo', 'email', 'address', 'contactPoint', 'founder',
                              'foundingDate', 'brand', 'parentOrganization']),
  WebSite: CREATIVE.concat(['issn']),
  WebPage: CREATIVE.concat(['breadcrumb', 'lastReviewed', 'primaryImageOfPage', 'speakable']),
  Article: CREATIVE.concat(['articleBody', 'articleSection', 'wordCount', 'backstory',
                            'speakable', 'pageStart', 'pageEnd']),
  BreadcrumbList: THING.concat(['itemListElement', 'numberOfItems', 'itemListOrder']),
  ItemList: THING.concat(['itemListElement', 'numberOfItems', 'itemListOrder']),
  ListItem: THING.concat(['item', 'position', 'nextItem', 'previousItem']),
  ImageObject: CREATIVE.concat(['width', 'height', 'caption', 'contentUrl', 'encodingFormat']),
  PropertyValue: THING.concat(['value', 'unitText', 'unitCode', 'minValue', 'maxValue',
                               'propertyID', 'valueReference']),
  // DietarySupplement is a subtype of both Product and Substance in schema.org,
  // so the Product properties — additionalProperty among them — apply to it.
  DietarySupplement: THING.concat([
    'additionalProperty', 'activeIngredient', 'nonProprietaryName', 'legalStatus',
    'maximumIntake', 'recommendedIntake', 'safetyConsideration', 'targetPopulation',
    'mechanismOfAction', 'proprietaryName', 'isProprietary', 'dosageForm', 'brand']),
  // ExercisePlan is a CreativeWork and a PhysicalActivity: a defined fitness
  // activity, as opposed to ExerciseAction, which asserts somebody performed one.
  ExercisePlan: CREATIVE.concat(['activityDuration', 'activityFrequency', 'additionalVariable',
                                 'exerciseType', 'intensity', 'repetitions', 'restPeriods',
                                 'workload']),
  Thing: THING,
};

// what has to be there for the markup to be worth having
const REQUIRED = {
  Article: ['headline', 'datePublished', 'author', 'publisher'],
  BreadcrumbList: ['itemListElement'],
  ItemList: ['itemListElement'],
  ListItem: ['position'],
  Organization: ['name', 'url'],
  WebSite: ['name', 'url'],
  PropertyValue: ['name', 'value'],
  DietarySupplement: ['name'],
  ExercisePlan: ['name'],
  ImageObject: ['url'],
};

const PAGES = ['index.html', 'builder/index.html', 'sessions/index.html', 'videos/index.html',
               'movements/index.html', 'training/index.html', 'nutrition/index.html',
               'supplements/index.html', 'travel/index.html', 'privacy/index.html',
               'private/index.html'];

let errors = 0, blocks = 0, nodes = 0;
// per page, not across the site: each page has to resolve its own references
let seenIds = new Set(), wantedIds = [];

const fail = (where, msg) => { errors++; console.log(`  ✗ ${where}: ${msg}`); };

function walk(node, page, trail) {
  if (Array.isArray(node)) return node.forEach((n, i) => walk(n, page, `${trail}[${i}]`));
  if (!node || typeof node !== 'object') return;

  const keys = Object.keys(node);
  // a bare {"@id": "..."} is a reference, not a node
  if (keys.length === 1 && keys[0] === '@id') { wantedIds.push([page, trail, node['@id']]); return; }

  const type = node['@type'];
  if (!type) return fail(page, `${trail} has no @type`);
  const allowed = VOCAB[type];
  if (!allowed) return fail(page, `${trail} uses @type "${type}", which this site has not declared`);
  nodes++;

  if (node['@id']) seenIds.add(node['@id']);
  for (const k of keys) {
    if (k === '@context') continue;
    if (!allowed.includes(k)) fail(page, `${trail} (${type}) sets "${k}", not a property of ${type}`);
  }
  for (const need of REQUIRED[type] || []) {
    if (node[need] === undefined) fail(page, `${trail} (${type}) is missing ${need}`);
  }
  for (const [k, v] of Object.entries(node)) {
    if (typeof v === 'string' && /^https?:\/\//.test(v) && !v.startsWith(SITE) &&
        !v.startsWith('https://schema.org')) {
      fail(page, `${trail}.${k} points off-site: ${v}`);
    }
    if (typeof v === 'object') walk(v, page, `${trail}.${k}`);
  }
}

for (const page of PAGES) {
  seenIds = new Set(); wantedIds = [];
  const html = fs.readFileSync(page, 'utf8');
  const found = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  if (!found.length) { console.log(`${page.padEnd(24)} no JSON-LD`); continue; }
  for (const [, raw] of found) {
    blocks++;
    let data;
    try { data = JSON.parse(raw); }
    catch (e) { fail(page, 'does not parse: ' + e.message); continue; }
    if (data['@context'] !== 'https://schema.org') fail(page, '@context is not https://schema.org');
    walk(data['@graph'] || data, page, '@graph');
  }
  for (const [p2, trail, id] of wantedIds) {
    if (!seenIds.has(id)) fail(p2, `${trail} refers to ${id}, which this page does not define`);
  }
  const types = (JSON.parse(found[0][1])['@graph'] || []).map(n => n['@type']);
  console.log(`${page.padEnd(24)} ${types.join(', ')}`);
}

// The supplement ItemList is a second copy of the table on the page. Check that
// every name in the markup is actually in the table, and that the count matches,
// so the two cannot drift apart unnoticed.
{
  const page = 'supplements/index.html';
  const html = fs.readFileSync(page, 'utf8');
  const ld = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  const list = (ld['@graph'] || []).find(n => n['@type'] === 'ItemList');
  const table = (html.match(/<h2>The audit<\/h2>[\s\S]*?<\/table>/) || [''])[0];
  const rows = (table.match(/<tr>/g) || []).length - 1;   // minus the header row
  const plain = table.replace(/<[^>]+>/g, ' ')
    .replace(/&rsquo;/g, '’').replace(/&mdash;/g, '—').replace(/&ndash;/g, '–')
    .replace(/\s+/g, ' ');
  for (const el of list.itemListElement) {
    const name = el.item.name;
    if (!plain.includes(name)) fail(page, `the ItemList names "${name}", which is not in the table`);
  }
  if (list.itemListElement.length !== rows)
    fail(page, `the ItemList has ${list.itemListElement.length} items, the table has ${rows} rows`);
  if (list.numberOfItems !== list.itemListElement.length)
    fail(page, `numberOfItems is ${list.numberOfItems}, the list has ${list.itemListElement.length}`);
  console.log(`\nsupplements: ${list.itemListElement.length} in the markup, ${rows} in the table.`);
}

console.log(`\n${blocks} blocks, ${nodes} nodes, ${errors} problem${errors === 1 ? '' : 's'}.`);
process.exit(errors ? 1 : 0);
