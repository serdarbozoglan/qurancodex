#!/usr/bin/env node
// ─── measure-vitals.mjs — üretim build'inde LCP/CLS/TBT + kontrast ölçümü ────
//
// Kullanım:
//   node scripts/measure-vitals.mjs                    # varsayılan sayfa seti
//   node scripts/measure-vitals.mjs /tr /tr/oku/1      # belirli rotalar
//   PORT=3210 node scripts/measure-vitals.mjs
//
// Neden ayrı script (Playwright spec değil): ölçüm ÜRETİM sunucusuna karşı
// yapılmalı. Playwright config'i dev sunucusuna bağlı; oradan ölçmek yanıltır
// (kod bölünmesi yok, HMR runtime var, sıkıştırma yok).
//
// Sunucuyu bu script kendi ayağa kaldırır ve sonunda kapatır. `npm run build`
// ÖNCEDEN çalıştırılmış olmalı.
// ────────────────────────────────────────────────────────────────────────────

import { spawn } from 'node:child_process';
import { chromium } from 'playwright';
import { VITALS_INIT, VITALS_READ, verdict } from '../tests/lib/vitals.mjs';
import { CONTRAST_PROBE } from '../tests/lib/contrast.mjs';

const PORT = process.env.PORT || 3210;
const BASE = `http://localhost:${PORT}`;
const ROUTES = process.argv.slice(2).length ? process.argv.slice(2) : ['/tr', '/en'];
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
const browser = await chromium.launch();

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

    // Kontrast yalnız masaüstünde (aynı DOM, iki kez taramaya gerek yok)
    if (vp.width === 1440) {
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
process.exit(0);
