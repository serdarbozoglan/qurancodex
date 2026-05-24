import { chromium } from '/tmp/playwright-runner/node_modules/playwright/index.mjs';

const BASE = 'http://localhost:3000';
const ROUTES = [
  '/tr/oku/36', '/en/oku/36',
  '/tr/oku/1',  '/tr/oku/2', '/tr/oku/114',  // edge surahs
];

const browser = await chromium.launch();
for (const route of ROUTES) {
  for (const vp of [
    { name: 'desktop', w: 1440, h: 900 },
    { name: 'mobile',  w: 390,  h: 844 },
  ]) {
    const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h } });
    const page = await ctx.newPage();
    const errors = [];
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text().slice(0, 150)); });
    page.on('pageerror', e => errors.push('PageError: ' + e.message.slice(0, 200)));
    try {
      await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(1500);
    } catch (e) {
      errors.push('NAV: ' + e.message.slice(0, 100));
    }
    const filtered = errors.filter(e => !e.includes('ERR_ABORTED') && !e.includes('Failed to load resource'));
    console.log(`${vp.name} ${route} -> ${filtered.length} errors`);
    for (const err of filtered.slice(0, 2)) console.log(`  └─ ${err}`);
    await ctx.close();
  }
}
await browser.close();
