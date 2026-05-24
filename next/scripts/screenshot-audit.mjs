// Screenshot audit script — Faz 9.4 visual regression baseline.
// Runs against the local dev server (http://localhost:3000) and captures
// desktop (1440x900) + mobile (390x844) screenshots for key routes.
// Output: docs/screenshots/2026-05-24/

import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const BASE = 'http://localhost:3000';
const OUTDIR = path.resolve('../docs/screenshots/2026-05-24');

const ROUTES = [
  ['homepage-tr',          '/tr',                'homepage'],
  ['homepage-en',          '/en',                'homepage'],
  ['reading-bakara',       '/tr/oku/2',          'reading'],
  ['reading-yasin',        '/tr/oku/36',         'reading'],
  ['atlas-kissa',          '/tr/atlas/kissa',    'tool'],
  ['atlas-peygamber',      '/tr/atlas/peygamber','tool'],
  ['atlas-kiraat',         '/tr/atlas/kiraat',   'tool'],
  ['graf-ayet',            '/tr/graf/ayet',      'tool'],
  ['graf-kavram',          '/tr/graf/kavram',    'tool'],
  ['arac-wow',             '/tr/arac/wow',       'tool'],
  ['arac-dualar',          '/tr/arac/dualar',    'tool'],
  ['arac-tum-araclar',     '/tr/arac/tum-araclar','tool'],
];

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile',  width:  390, height: 844 },
];

await mkdir(OUTDIR, { recursive: true });

const browser = await chromium.launch({ headless: true });

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  page.on('pageerror', err => console.log(`  [PAGE ERROR] ${err.message}`));

  for (const [slug, route, kind] of ROUTES) {
    const fullName = `${slug}-${vp.name}.png`;
    const target = path.join(OUTDIR, fullName);
    try {
      const t0 = Date.now();
      await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 25000 });
      // Let scroll-reveal / framer-motion animations settle
      await page.waitForTimeout(800);
      // Tool overlays sometimes render after a brief loading spinner.
      // Homepage: capture FULL page (long scroll story).
      // Others: capture viewport (overlay is fixed inset:0).
      const fullPage = (kind === 'homepage');
      await page.screenshot({ path: target, fullPage });
      const dt = Date.now() - t0;
      console.log(`✓ ${vp.name.padEnd(7)} ${route.padEnd(28)} ${dt}ms`);
    } catch (err) {
      console.log(`✗ ${vp.name.padEnd(7)} ${route.padEnd(28)} ERROR: ${err.message.split('\n')[0]}`);
    }
  }
  await ctx.close();
}

await browser.close();
console.log('\nDone. Screenshots in:', OUTDIR);
