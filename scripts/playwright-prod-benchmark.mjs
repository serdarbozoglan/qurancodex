import { chromium } from '/tmp/playwright-runner/node_modules/playwright/index.mjs';

const BASE = 'http://localhost:3000';
const ROUTES = [
  ['/tr', 'homepage'],
  ['/tr/atlas/kavim', 'W16-O1 — kavim (was 11.7s dev)'],
  ['/tr/arac/cennet-cehennem', 'cennet (was 4.7s dev)'],
  ['/tr/arac/esma-frekans', 'esma (was 4.7s dev)'],
  ['/tr/arac/iblis-seytan', 'iblis (was 4.5s dev)'],
  ['/tr/graf/karsilastir', 'karsilastir (was 4.1s dev)'],
  ['/tr/oku/1', 'oku-fatiha'],
  ['/tr/oku/2', 'oku-bakara'],
];

const browser = await chromium.launch();
const results = [];

// Warm-up — first request initializes server cache
console.log('Warming up...');
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  for (const [route] of ROUTES) {
    try { await p.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 30000 }); } catch {}
  }
  await ctx.close();
}

console.log('\nBenchmarking (cold per-route via fresh context)...\n');

for (const [route, label] of ROUTES) {
  const samples = [];
  const errors = [];
  for (let i = 0; i < 3; i++) {
    const ctx = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      bypassCSP: true,
    });
    const page = await ctx.newPage();
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text().slice(0, 100)); });
    page.on('pageerror', err => errors.push('PageError: ' + err.message.slice(0, 100)));

    const start = Date.now();
    try {
      await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 45000 });
      samples.push(Date.now() - start);
    } catch (e) {
      samples.push(-1);
    }
    await ctx.close();
  }
  const valid = samples.filter(s => s > 0);
  const min = Math.min(...valid);
  const max = Math.max(...valid);
  const avg = Math.round(valid.reduce((a, b) => a + b, 0) / valid.length);
  const errCount = errors.filter(e => !e.includes('ERR_ABORTED') && !e.includes('Failed to load resource')).length;
  console.log(`${route.padEnd(35)} avg=${String(avg).padStart(5)}ms  min=${String(min).padStart(5)}ms  max=${String(max).padStart(5)}ms  err=${errCount}  [${label}]`);
  results.push({ route, label, avg, min, max, errCount });
}

await browser.close();
console.log('\n--- SUMMARY ---');
const total = results.reduce((a, r) => a + r.avg, 0);
console.log(`Total avg: ${total}ms across ${results.length} routes`);
console.log(`Slowest:   ${results.reduce((a, r) => r.avg > a.avg ? r : a).route} @ ${Math.max(...results.map(r => r.avg))}ms`);
