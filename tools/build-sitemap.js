// Writes sitemap.xml from the public pages and their last content change.
//
//   node tools/build-sitemap.js          rewrite it
//   node tools/build-sitemap.js --check  exit 1 if a public page is missing
//
// lastmod is the date the page's content last changed, which is not always the
// date of the last commit touching the file — a metadata-only pass does not make
// a page newer. Edit the table when the content changes.

const fs = require('fs');

const SITE = 'https://notaroutine.life';
// path, lastmod, priority, changefreq
const PAGES = [
  ['/',             '2026-09-11', '1.0', 'monthly'],
  ['/training/',    '2026-09-11', '0.9', 'monthly'],
  ['/movements/',   '2026-09-12', '0.9', 'monthly'],
  ['/supplements/', '2026-09-09', '0.9', 'monthly'],
  ['/nutrition/',   '2026-09-09', '0.8', 'monthly'],
  ['/travel/',      '2026-09-09', '0.7', 'monthly'],
  ['/builder/',     '2026-09-12', '0.7', 'monthly'],
  ['/videos/',      '2026-09-12', '0.5', 'monthly'],
  ['/sessions/',    '2026-09-12', '0.4', 'monthly'],
  ['/privacy/',     '2026-09-12', '0.3', 'yearly'],
];

// Every directory with an index.html is public except these.
const PRIVATE = ['private'];

const onDisk = ['/'].concat(fs.readdirSync('.', {withFileTypes: true})
  .filter(d => d.isDirectory() && !d.name.startsWith('.') &&
               !['fonts', 'tools', 'worker'].includes(d.name) &&
               fs.existsSync(`${d.name}/index.html`))
  .map(d => `/${d.name}/`));

const listed = new Set(PAGES.map(p => p[0]));
const missing = onDisk.filter(p => !listed.has(p) && !PRIVATE.includes(p.replace(/\//g, '')));
const extra = [...listed].filter(p => !onDisk.includes(p));

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...PAGES.map(([path, mod, pri, freq]) => [
    '  <url>',
    `    <loc>${SITE}${path}</loc>`,
    `    <lastmod>${mod}</lastmod>`,
    `    <changefreq>${freq}</changefreq>`,
    `    <priority>${pri}</priority>`,
    '  </url>',
  ].join('\n')),
  '</urlset>',
  '',
].join('\n');

if (process.argv.includes('--check')) {
  const problems = [
    ...missing.map(p => `${p} has an index.html but is not in sitemap.xml`),
    ...extra.map(p => `${p} is in sitemap.xml but has no index.html`),
  ];
  if (fs.existsSync('sitemap.xml') && fs.readFileSync('sitemap.xml', 'utf8') !== xml)
    problems.push('sitemap.xml is out of date — run: node tools/build-sitemap.js');
  if (problems.length) { problems.forEach(p => console.error('✗ ' + p)); process.exit(1); }
  console.log(`sitemap.xml lists all ${PAGES.length} public pages.`);
  process.exit(0);
}

fs.writeFileSync('sitemap.xml', xml);
console.log(`sitemap.xml: ${PAGES.length} pages${missing.length ? ', MISSING ' + missing.join(', ') : ''}`);
