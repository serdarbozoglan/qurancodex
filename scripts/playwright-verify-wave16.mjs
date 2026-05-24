import { chromium } from '/tmp/playwright-runner/node_modules/playwright/index.mjs';

const BASE = 'http://localhost:3000';
const ROUTES = [
  '/tr',
  '/en',
  '/tr/oku',
  '/tr/oku/1',
  '/tr/oku/2',
  '/tr/graf/kelime-isi',
  '/tr/arac/zaman-boyutlari',
  '/tr/arac/iblis-seytan',
  '/tr/arac/sebebi-nuzul',
];

const browser = await chromium.launch();
const results = [];

for (const route of ROUTES) {
  for (const vp of [
    { name: 'desktop', width: 1440, height: 900 },
    { name: 'mobile', width: 390, height: 844 },
  ]) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await ctx.newPage();
    const errors = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    page.on('pageerror', err => errors.push('PageError: ' + err.message.slice(0, 200)));
    try {
      await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(1200);
    } catch (e) {
      errors.push('NAV: ' + e.message.slice(0, 100));
    }
    const filtered = errors.filter(e => !e.includes('ERR_ABORTED'));
    results.push({ route, vp: vp.name, errCount: filtered.length, errors: filtered.slice(0, 3) });
    console.log(`${vp.name} ${route} -> ${filtered.length} errors`);
    if (filtered.length > 0) for (const e of filtered.slice(0, 2)) console.log(`  └─ ${e.slice(0, 150)}`);
    await ctx.close();
  }
}

await browser.close();
console.log('\n--- SUMMARY ---');
const ok = results.filter(r => r.errCount === 0).length;
console.log(`${ok}/${results.length} routes clean`);
