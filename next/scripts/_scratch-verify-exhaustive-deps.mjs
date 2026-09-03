import { chromium } from 'playwright';

const BASE = 'http://localhost:4173';
const routes = [
  '/tr/sor',
  '/tr/graf/kavram',
  '/tr/graf/karsilastir',
  '/tr/graf/ayet',
  '/tr/oku/2',
  '/tr/arac/tum-araclar',
];

const browser = await chromium.launch();
let anyError = false;

for (const route of routes) {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (err) => errors.push('pageerror: ' + err.message));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push('console.error: ' + msg.text());
  });
  const res = await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 20000 });
  await page.waitForTimeout(800);
  console.log(`${route} -> ${res.status()} | errors: ${errors.length}`);
  if (errors.length) {
    anyError = true;
    errors.forEach((e) => console.log('   ' + e));
  }
  await page.close();
}

await browser.close();
process.exit(anyError ? 1 : 0);
