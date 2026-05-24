import { chromium } from '/tmp/playwright-runner/node_modules/playwright/index.mjs';
import { writeFile } from 'fs/promises';
import path from 'path';

const BASE = 'http://localhost:3000';
const OUT = '/Users/serdar/dev/00_dev_PROJECTS/01_qurancodex/docs/reviews/playwright-2026-05-24';

const ROUTES = [
  // Homepage
  ['/tr', 'home-tr'],
  ['/en', 'home-en'],
  // Oku
  ['/tr/oku', 'oku-list'],
  ['/tr/oku/1', 'oku-fatiha'],
  ['/tr/oku/2', 'oku-bakara'],
  // Atlas (12)
  ['/tr/atlas/kissa', 'atlas-kissa'],
  ['/tr/atlas/peygamber', 'atlas-peygamber'],
  ['/tr/atlas/kavim', 'atlas-kavim'],
  ['/tr/atlas/doga', 'atlas-doga'],
  ['/tr/atlas/mesel', 'atlas-mesel'],
  ['/tr/atlas/furuk', 'atlas-furuk'],
  ['/tr/atlas/munasebat', 'atlas-munasebat'],
  ['/tr/atlas/kiraat', 'atlas-kiraat'],
  ['/tr/atlas/sunnetullah', 'atlas-sunnetullah'],
  ['/tr/atlas/munafik', 'atlas-munafik'],
  ['/tr/atlas/nefs-mertebeleri', 'atlas-nefs'],
  ['/tr/atlas/kadinlar', 'atlas-kadinlar'],
  // Graf (6)
  ['/tr/graf/ayet', 'graf-ayet'],
  ['/tr/graf/kavram', 'graf-kavram'],
  ['/tr/graf/diyalog', 'graf-diyalog'],
  ['/tr/graf/zaman', 'graf-zaman'],
  ['/tr/graf/karsilastir', 'graf-karsilastir'],
  ['/tr/graf/kelime-isi', 'graf-kelime-isi'],
  // Arac (16)
  ['/tr/arac/tum-araclar', 'arac-tum-araclar'],
  ['/tr/arac/cennet-cehennem', 'arac-cennet'],
  ['/tr/arac/retorik', 'arac-retorik'],
  ['/tr/arac/sebebi-nuzul', 'arac-sebebi-nuzul'],
  ['/tr/arac/dualar', 'arac-dualar'],
  ['/tr/arac/yeminler', 'arac-yeminler'],
  ['/tr/arac/melekler', 'arac-melekler'],
  ['/tr/arac/renkler', 'arac-renkler'],
  ['/tr/arac/zaman-boyutlari', 'arac-zaman'],
  ['/tr/arac/kiyamet', 'arac-kiyamet'],
  ['/tr/arac/wow', 'arac-wow'],
  ['/tr/arac/esma-frekans', 'arac-esma'],
  ['/tr/arac/muhataplar', 'arac-muhataplar'],
  ['/tr/arac/buyruklar', 'arac-buyruklar'],
  ['/tr/arac/iblis-seytan', 'arac-iblis'],
  ['/tr/arac/ilk-son-kelimeler', 'arac-ilkson'],
];

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
];

async function run() {
  const browser = await chromium.launch();
  const results = [];

  for (const [route, slug] of ROUTES) {
    for (const vp of VIEWPORTS) {
      const ctx = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 1,
      });
      const page = await ctx.newPage();
      const consoleErrors = [];
      const networkErrors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
      });
      page.on('pageerror', err => consoleErrors.push('PageError: ' + err.message));
      page.on('requestfailed', req => networkErrors.push(req.url() + ': ' + req.failure()?.errorText));

      const start = Date.now();
      let status = 'OK';
      let loadTime = 0;
      try {
        await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 30000 });
        loadTime = Date.now() - start;
        // Wait a bit more for animations
        await page.waitForTimeout(800);
        const screenshotPath = path.join(OUT, vp.name, `${slug}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: true });
      } catch (err) {
        status = 'TIMEOUT_OR_ERROR: ' + err.message.slice(0, 100);
      }

      results.push({
        route,
        viewport: vp.name,
        status,
        loadTime,
        consoleErrors: consoleErrors.slice(0, 5),
        networkErrors: networkErrors.slice(0, 5),
      });
      console.log(`${vp.name} ${route} -> ${status} (${loadTime}ms, ${consoleErrors.length} errors)`);
      await ctx.close();
    }
  }

  await browser.close();

  // Write report
  const report = generateReport(results);
  await writeFile(path.join(OUT, 'visual-audit-report.md'), report);
  await writeFile(path.join(OUT, 'raw-results.json'), JSON.stringify(results, null, 2));
  console.log('\nReport written:', path.join(OUT, 'visual-audit-report.md'));
}

function generateReport(results) {
  const desktop = results.filter(r => r.viewport === 'desktop');
  const mobile = results.filter(r => r.viewport === 'mobile');
  const totalErrors = results.reduce((s, r) => s + r.consoleErrors.length, 0);
  const failedRoutes = results.filter(r => r.status !== 'OK');

  let md = `# Playwright Visual Audit — QuranCodex\n\n`;
  md += `**Tarih:** 2026-05-24\n`;
  md += `**Test edilen:** ${desktop.length} route × 2 viewport = ${results.length} screenshot\n`;
  md += `**Console errors toplam:** ${totalErrors}\n`;
  md += `**Başarısız route'lar:** ${failedRoutes.length}\n\n`;

  md += `## Özet\n\n`;
  md += `| Viewport | OK | Hatalı | Avg load (ms) | Toplam console errors |\n`;
  md += `|---|---|---|---|---|\n`;
  for (const vp of ['desktop', 'mobile']) {
    const r = results.filter(x => x.viewport === vp);
    const ok = r.filter(x => x.status === 'OK').length;
    const fail = r.length - ok;
    const avg = Math.round(r.reduce((s, x) => s + x.loadTime, 0) / r.length);
    const errs = r.reduce((s, x) => s + x.consoleErrors.length, 0);
    md += `| ${vp} | ${ok} | ${fail} | ${avg} | ${errs} |\n`;
  }

  md += `\n## Başarısız Sayfalar\n\n`;
  if (failedRoutes.length === 0) {
    md += `Tüm sayfalar başarıyla yüklendi.\n`;
  } else {
    for (const f of failedRoutes) {
      md += `- **[${f.viewport}] ${f.route}**: ${f.status}\n`;
    }
  }

  md += `\n## Console Errors Bulunan Sayfalar\n\n`;
  const withErrors = results.filter(r => r.consoleErrors.length > 0);
  if (withErrors.length === 0) {
    md += `Hiçbir sayfada console error yok.\n`;
  } else {
    for (const r of withErrors) {
      md += `### [${r.viewport}] ${r.route}\n`;
      for (const e of r.consoleErrors) {
        md += `- \`${e.slice(0, 200)}\`\n`;
      }
      md += `\n`;
    }
  }

  md += `\n## Network Errors\n\n`;
  const withNetwork = results.filter(r => r.networkErrors.length > 0);
  if (withNetwork.length === 0) {
    md += `Hiçbir sayfada network error yok.\n`;
  } else {
    for (const r of withNetwork) {
      md += `### [${r.viewport}] ${r.route}\n`;
      for (const e of r.networkErrors) {
        md += `- \`${e.slice(0, 250)}\`\n`;
      }
      md += `\n`;
    }
  }

  md += `\n## Performance — En yavaş 10 sayfa\n\n`;
  const slowest = [...results].sort((a, b) => b.loadTime - a.loadTime).slice(0, 10);
  md += `| Route | Viewport | Load (ms) |\n`;
  md += `|---|---|---|\n`;
  for (const r of slowest) {
    md += `| ${r.route} | ${r.viewport} | ${r.loadTime} |\n`;
  }

  md += `\n## Screenshot Dizinleri\n\n`;
  md += `- Desktop: \`docs/reviews/playwright-2026-05-24/desktop/\`\n`;
  md += `- Mobile: \`docs/reviews/playwright-2026-05-24/mobile/\`\n`;
  md += `- Raw JSON: \`docs/reviews/playwright-2026-05-24/raw-results.json\`\n`;

  return md;
}

run().catch(err => {
  console.error('FATAL:', err);
  process.exit(1);
});
