#!/usr/bin/env node
// ─── measure-vitals.mjs — üretim build'inde LCP/CLS/TBT + kontrast ölçümü ────
//
// Kullanım:
//   node scripts/measure-vitals.mjs                    # varsayılan sayfa seti
//   node scripts/measure-vitals.mjs /tr /tr/oku/1      # belirli rotalar
//   node scripts/measure-vitals.mjs --full             # 70 rota × 2 dil (~140 sayfa)
//   PORT=3210 node scripts/measure-vitals.mjs
//
// 14 Ağustos: CWV bu tarihe kadar YALNIZ anasayfada (/tr, /en) ölçülmüştü —
// kontrastta olduğu gibi 73 sayfa tamamen bilinmeyendi. `--full` bunu kapatır:
// `audit-contrast.mjs`'teki allRoutes() ile AYNI rota keşfi, sonuç
// `tests/__baseline__/vitals.json`'a yazılır (analiz için, konsol taşmasın diye
// --full modunda kontrast dökümü atlanır — o zaten audit-contrast.mjs'in işi).
//
// Neden ayrı script (Playwright spec değil): ölçüm ÜRETİM sunucusuna karşı
// yapılmalı. Playwright config'i dev sunucusuna bağlı; oradan ölçmek yanıltır
// (kod bölünmesi yok, HMR runtime var, sıkıştırma yok).
//
// Sunucuyu bu script kendi ayağa kaldırır ve sonunda kapatır. `npm run build`
// ÖNCEDEN çalıştırılmış olmalı.
// ────────────────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';
import { VITALS_INIT, VITALS_READ, verdict } from '../tests/lib/vitals.mjs';
import { CONTRAST_PROBE } from '../tests/lib/contrast.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const BASELINE = path.join(ROOT, 'tests/__baseline__/vitals.json');

const PORT = process.env.PORT || 3210;
const BASE = `http://localhost:${PORT}`;
const args = process.argv.slice(2);
const FULL = args.includes('--full');
const cliRoutes = args.filter((a) => !a.startsWith('--'));

function allRoutes() {
  const dir = path.join(ROOT, 'src/app/[locale]');
  const out = [];
  (function walk(d, rel = '') {
    for (const f of fs.readdirSync(d)) {
      const p = path.join(d, f);
      if (fs.statSync(p).isDirectory()) {
        if (f.startsWith('[')) continue;              // dinamik rota: örneklem dışı
        walk(p, rel + '/' + f);
      } else if (f === 'page.js') out.push(rel || '');
    }
  })(dir);
  return out.sort();
}

const ROUTES = FULL
  ? ['tr', 'en'].flatMap((l) => allRoutes().map((r) => `/${l}${r}`))
  : (cliRoutes.length ? cliRoutes : ['/tr', '/en']);

const VIEWPORTS = [
  { name: 'mobil-390', width: 390, height: 844, cpu: 4 },
  { name: 'masaüstü-1440', width: 1440, height: 900, cpu: 1 },
];

function startServer() {
  return new Promise((resolve, reject) => {
    const p = spawn('npx', ['next', 'start', '-p', String(PORT)], {
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env },
    });
    const to = setTimeout(() => reject(new Error('sunucu 60sn içinde açılmadı')), 60_000);
    p.stdout.on('data', (d) => {
      if (/Ready|started server|Local:/i.test(String(d))) { clearTimeout(to); resolve(p); }
    });
    p.stderr.on('data', (d) => { if (/EADDRINUSE/.test(String(d))) { clearTimeout(to); reject(new Error(`port ${PORT} dolu`)); } });
    p.on('exit', (c) => { clearTimeout(to); reject(new Error('sunucu çıktı: ' + c)); });
  });
}

const server = await startServer();
// İlk isteklerde sunucu ısınıyor; ölçümden önce bir tur at.
// ─── GPU: WebGL sayfalarinda olcum artefaktini onlemek icin ────────────────
// 2 Eylul 2026. Bassiz Chromium varsayilan olarak WebGL'i SwiftShader ile
// YAZILIMDA cizer. Bu, WebGL kullanan sayfalarda TBT'yi taninmaz hale
// getiriyordu — olculdu, /tr/graf/ayet masaustu-1440:
//     SwiftShader 6690ms   ·   gercek GPU (Metal) 549ms
// Yani raporlanan degerin ~%92'si gercek kullanicida OLMAYAN bir maliyetti;
// taban aylarca bu sayfalari yanlis "agir" gosterdi. (Mobilde fark yok:
// IS_MOBILE_3D_BLOCKED 3D'yi zaten kapatiyor, oradaki TBT gercek JS isi.)
//
// Bayraklar GPU'yu ZORLAMAZ, yalnizca engelleri kaldirir; GPU'su olmayan bir
// ortamda (CI konteyneri) Chromium sessizce SwiftShader'a doner ve olcum
// eskisi gibi calisir. Kullanilan renderer asagida bir kez yazdirilir ki
// rapora bakan kisi hangi kosulda olculdugunu bilsin.
// Not: `--ignore-gpu-blocklist` TEK BASINA yetmiyor (denendi, macOS'ta hala
// SwiftShader donuyordu). Isi yapan bayrak ANGLE arka ucunu acikca secmek.
const GPU_ARGS = process.platform === 'darwin'
  ? ['--use-angle=metal', '--ignore-gpu-blocklist']
  : ['--ignore-gpu-blocklist', '--enable-gpu-rasterization'];
const browser = await chromium.launch({ args: GPU_ARGS });

{
  const probe = await browser.newPage();
  await probe.goto('about:blank');
  const renderer = await probe.evaluate(() => {
    const gl = document.createElement('canvas').getContext('webgl2')
            || document.createElement('canvas').getContext('webgl');
    if (!gl) return 'WebGL yok';
    const d = gl.getExtension('WEBGL_debug_renderer_info');
    return d ? gl.getParameter(d.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
  });
  await probe.close();
  const yazilim = /swiftshader|llvmpipe|software/i.test(renderer);
  console.log(`\nWebGL renderer: ${renderer}`);
  if (yazilim) {
    console.log('UYARI: yazilim render\'i aktif — WebGL kullanan sayfalarin (/graf/ayet)');
    console.log('       TBT degerleri GERCEK KULLANICIYI YANSITMAZ, ~10x sisirilir.');
  }
}

console.log(`\n═══ ÜRETİM ÖLÇÜMÜ · ${BASE} ═══\n`);
const summary = [];

for (const route of ROUTES) {
  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await ctx.newPage();
    // Mobilde CPU kısıtı — laboratuvar ölçümü gerçek cihaza yaklaşsın
    if (vp.cpu > 1) {
      const cdp = await ctx.newCDPSession(page);
      await cdp.send('Emulation.setCPUThrottlingRate', { rate: vp.cpu });
    }
    await page.addInitScript({ content: VITALS_INIT });
    await page.goto(BASE + route, { waitUntil: 'load' });
    // LCP kesinleşsin + tembel içerik otursun
    await page.waitForTimeout(3000);
    const m = await page.evaluate(VITALS_READ);
    const bad = verdict(m);
    console.log(`── ${route} · ${vp.name}${vp.cpu > 1 ? ` (CPU ×${vp.cpu})` : ''}`);
    console.log(`   LCP ${String(m.lcp).padStart(5)}ms  CLS ${String(m.cls).padStart(5)}  TBT ${String(m.tbt).padStart(4)}ms  FCP ${String(m.fcp).padStart(5)}ms  TTFB ${m.ttfb}ms`);
    console.log(`   istek ${m.reqCount} · toplam ${m.kb}KB · JS ${m.jsKb}KB · LCP ögesi: ${m.lcpEl || '?'}`);
    console.log(bad.length ? `   ❌ ${bad.join(' · ')}` : '   ✓ dört eşik de geçildi');
    summary.push({ route, vp: vp.name, ...m, bad });

    // Kontrast yalnız masaüstünde (aynı DOM, iki kez taramaya gerek yok).
    // --full modunda atlanır: kontrast zaten audit-contrast.mjs'in işi ve o
    // reducedMotion context'i kullanıyor (bkz. K6), burada kullanmadığımız
    // için sayı yanıltıcı olurdu.
    if (vp.width === 1440 && !FULL) {
      const c = await page.evaluate(CONTRAST_PROBE);
      const sure = c.filter((x) => !x.approx);
      const approx = c.filter((x) => x.approx);
      const show = (list, tag) => {
        if (!list.length) return;
        console.log(`   ${tag} (${list.length}):`);
        list.slice(0, 10).forEach((x) =>
          console.log(`      ${String(x.ratio).padStart(5)} (gerek ${x.need})  ${String(x.px).padStart(5)}px  ${x.color}  [${x.sec}] "${x.text}"`)
        );
        if (list.length > 10) console.log(`      … ve ${list.length - 10} tane daha`);
      };
      console.log(`   kontrast: kesin ${sure.length} · yaklaşık ${approx.length} öge AA altında`);
      show(sure, '❌ KESİN — zemin tek opak renk');
      show(approx, '⚠ YAKLAŞIK — zeminde gradyan, gözle doğrula');
    }
    console.log('');
    await ctx.close();
  }
}

await browser.close();
server.kill();

const failing = summary.filter((s) => s.bad.length);
console.log('═══ ÖZET ═══');
console.log(`${summary.length} ölçüm · ${failing.length} tanesi bir veya daha fazla eşiği aşıyor`);

if (FULL) {
  fs.mkdirSync(path.dirname(BASELINE), { recursive: true });
  fs.writeFileSync(BASELINE, JSON.stringify({
    at: new Date().toISOString().slice(0, 10),
    pages: ROUTES.length,
    measurements: summary.length,
    failing: failing.length,
    summary,
  }, null, 1));
  console.log(`\n📌 yazıldı: ${BASELINE}`);
}
process.exit(0);
