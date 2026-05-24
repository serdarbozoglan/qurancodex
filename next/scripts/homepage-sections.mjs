// Capture homepage section-by-section by scrolling through and screenshotting
// each viewport. Scroll-reveal animations trigger; sections become visible.

import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const BASE = 'http://localhost:3000';
const OUTDIR = path.resolve('../docs/screenshots/2026-05-24/homepage-sections');
await mkdir(OUTDIR, { recursive: true });

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();

await page.goto(BASE + '/tr', { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(1500);

// Get full page height
const totalH = await page.evaluate(() => document.documentElement.scrollHeight);
const vpH = 900;
const steps = Math.ceil(totalH / vpH);
console.log(`Homepage height: ${totalH}px, ${steps} viewports`);

for (let i = 0; i < steps; i++) {
  const y = i * vpH;
  await page.evaluate((scrollY) => window.scrollTo({ top: scrollY, behavior: 'instant' }), y);
  await page.waitForTimeout(900);  // let animations settle
  const fn = `section-${String(i+1).padStart(2,'0')}.png`;
  await page.screenshot({ path: path.join(OUTDIR, fn), clip: { x: 0, y: 0, width: 1440, height: vpH } });
  console.log(`✓ ${fn} (scrolled to ${y})`);
}

await browser.close();
console.log('\nSection screenshots in:', OUTDIR);
