// Screenshots tools/og-card.html at exactly 1200×630 into og.png at the repo root.
// Run from the repo root with the site served locally:
//   python3 -m http.server 8799 &  node tools/render-og.js
// Nothing on the site depends on this at runtime; og.png is committed.
const { chromium } = require('playwright-core');
const PORT = process.env.PORT || 8799;
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const p = await (await b.newContext({ viewport: {width: 1200, height: 630}, deviceScaleFactor: 1 })).newPage();
  await p.goto(`http://localhost:${PORT}/tools/og-card.html`);
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(300);
  await p.screenshot({ path: 'og.png' });
  await b.close();
  console.log('og.png written at 1200x630');
})();
