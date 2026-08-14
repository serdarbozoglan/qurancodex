// ─── page-audit — kontrol listesinin ÇALIŞTIRILABİLİR hâli ──────────────────
//
// `tasks/sayfa_denetim_kontrol_listesi.md` maddelerinin otomatikleştirilebilir
// olanları. 2026-08-13'te anasayfada bulunan hataların KARDEŞLERİNİ diğer 73
// sayfada aramak için yazıldı; her kontrolün karşılığı listede bir bölüm.
//
// Kullanım:
//   AUDIT_ROUTES=/arac/tum-araclar,/hakkinda npx playwright test tests/page-audit.spec.js
//   AUDIT_ROUTES=... AUDIT_LOCALES=tr npx playwright test tests/page-audit.spec.js
//
// Kapsamadıkları (elle/ayrı araçla):
//   · kontrast + Core Web Vitals → `node scripts/measure-vitals.mjs <rota>`
//     (üretim build'i gerektirir; dev sunucusunda ölçüm yanıltır)
//   · bidi gözle kontrol · ekran görüntüsü incelemesi · hydration metin farkı
// ────────────────────────────────────────────────────────────────────────────

import { test } from '@playwright/test';

const ROUTES = (process.env.AUDIT_ROUTES || '/').split(',').map((s) => s.trim()).filter(Boolean);
const LOCALES = (process.env.AUDIT_LOCALES || 'tr,en').split(',').map((s) => s.trim());
const VIEWPORTS = [
  { name: 'masaüstü-1440', width: 1440, height: 900 },
  { name: 'dizüstü-1024', width: 1024, height: 800 },   // ← EN ÇOK HATA BURADA
  { name: 'mobil-390', width: 390, height: 844 },
];

test.setTimeout(240_000);

const PROBE = `(() => {
  const doc = document.documentElement;
  const txt = document.body.innerText;
  const btns = [...document.querySelectorAll('button')];
  const links = [...document.querySelectorAll('a[href]')];
  const heads = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')];

  // Başlık seviyesi atlaması (h2 → h4 gibi)
  const skips = [];
  let prev = 0;
  for (const h of heads) {
    const lvl = Number(h.tagName[1]);
    if (prev && lvl > prev + 1) skips.push(prev + '→' + lvl + ' "' + (h.innerText || '').trim().slice(0, 30) + '"');
    prev = lvl;
  }

  // Navbar örtüşmesi — KAPSAYICININ değil, GERÇEK İÇERİĞİN konumu ölçülür.
  // 2026-08-13: ilk sürüm kapsayıcı top'unu ölçüyordu ve /arac/tum-araclar'da
  // 3 viewport'ta da "82-134px örtüşme" diye YANLIŞ POZİTİF üretti — sayfa tam
  // ekran bir overlay ve doğal olarak y=0'dan başlıyor, ama iç dolgusuyla
  // navbarı temizliyor (ilk metin 113px'te). Doğru ölçüm: metin/etkileşimli
  // ögelerin navbarın ALTINA girip girmediği.
  const nav = document.querySelector('nav[aria-label="Main navigation"]');
  const navBottom = nav ? nav.getBoundingClientRect().bottom : 0;
  const overlaps = [];
  const seenOv = new Set();
  for (const el of document.querySelectorAll('h1,h2,h3,h4,p,a,button,li,span,input')) {
    if (el === nav || nav?.contains(el)) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none' || parseFloat(cs.opacity) < 0.05) continue;
    if (!(el.innerText || el.value || '').trim()) continue;
    const r = el.getBoundingClientRect();
    if (r.height < 4 || r.width < 4 || r.bottom < 0) continue;
    // Ögenin ORTASI navbarın altında mı? (kenar teması değil, gerçek gizlenme)
    const mid = r.top + r.height / 2;
    if (mid >= navBottom || r.bottom <= 0) continue;
    const hit = document.elementFromPoint(Math.min(window.innerWidth - 2, r.left + r.width / 2), mid);
    if (!hit || (hit !== nav && !nav?.contains(hit))) continue;   // navbar örtmüyorsa sorun yok
    const key = el.tagName + (el.innerText || '').trim().slice(0, 20);
    if (seenOv.has(key)) continue;
    seenOv.add(key);
    overlaps.push(Math.round(navBottom - r.top) + 'px · ' + el.tagName + ' "' + (el.innerText || '').trim().slice(0, 26) + '"');
  }
  // Navbar altındaki ilk içeriğin boşluk payı (5px'ten az ise sıkışık)
  let clearance = null;
  for (const el of document.querySelectorAll('h1,h2,h3,p,button,a')) {
    if (nav?.contains(el)) continue;
    const r = el.getBoundingClientRect();
    if (r.top > navBottom - 40 && r.top < navBottom + 300 && (el.innerText || '').trim()) {
      clearance = Math.round(r.top - navBottom);
      break;
    }
  }

  // Görünmez ama klavyeyle gezilebilen bölgeler
  const ghost = [];
  for (const el of document.querySelectorAll('nav,aside,[role="dialog"],[role="menu"]')) {
    const cs = getComputedStyle(el);
    const invisible = cs.opacity === '0' || cs.visibility === 'hidden';
    if (!invisible) continue;
    if (el.hasAttribute('inert') || el.getAttribute('aria-hidden') === 'true') continue;
    const n = [...el.querySelectorAll('a[href],button,input,select,textarea,[tabindex]')]
      .filter((x) => x.tabIndex >= 0 && !x.disabled).length;
    if (n) ghost.push(el.tagName + (el.getAttribute('aria-label') ? '[' + el.getAttribute('aria-label').slice(0, 22) + ']' : '') + ' → ' + n + ' odaklanabilir');
  }

  return {
    height: doc.scrollHeight,
    hscroll: doc.scrollWidth > doc.clientWidth ? doc.scrollWidth + '>' + doc.clientWidth : null,
    htmlLang: doc.getAttribute('lang'),
    h1: document.querySelectorAll('h1').length,
    h2: document.querySelectorAll('h2').length,
    h3: document.querySelectorAll('h3').length,
    headingSkips: skips,
    btnNoName: btns.filter((b) => !b.getAttribute('aria-label') && !(b.innerText || '').trim() && !b.title).length,
    linkNoName: links.filter((a) => !(a.innerText || '').trim() && !a.getAttribute('aria-label') && !a.title).length,
    imgNoAlt: [...document.images].filter((i) => !i.hasAttribute('alt')).length,
    svgNoAria: [...document.querySelectorAll('svg')].filter((s) => !s.getAttribute('aria-hidden') && !s.getAttribute('aria-label') && !s.querySelector('title')).length,
    svgTotal: document.querySelectorAll('svg').length,
    arabicBad: [...document.querySelectorAll('[lang="ar"],[dir="rtl"]')]
      .filter((e) => e.getAttribute('lang') !== 'ar' || e.getAttribute('dir') !== 'rtl').length,
    arabicTotal: document.querySelectorAll('[lang="ar"],[dir="rtl"]').length,
    backslash: (txt.match(/\\\\"/g) || []).length,
    stars: (txt.match(/\\*\\*/g) || []).length,
    tofu: (txt.match(/[\\uFFFD\\u25A1]/g) || []).length,
    navOverlap: overlaps,
    ghostTabbable: ghost,
    navClearance: clearance,
    anchors: links.length,
    buttons: btns.length,
    noindex: /noindex/i.test((document.querySelector('meta[name="robots"]') || {}).content || ''),
    canonical: (document.querySelector('link[rel="canonical"]') || {}).href || null,
    hreflang: [...document.querySelectorAll('link[rel="alternate"][hreflang]')].map((l) => l.hreflang).join(','),
    internalLinks: [...new Set(links.map((a) => a.getAttribute('href')).filter((h) => h && h.startsWith('/')))],
  };
})()`;

for (const route of ROUTES) {
  for (const loc of LOCALES) {
    test(`denetim ${loc}${route}`, async ({ page }) => {
      const errors = [];
      page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
      page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));

      const url = `/${loc}${route === '/' ? '' : route}`;
      const findings = [];
      let first = null;

      for (const vp of VIEWPORTS) {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        const res = await page.goto(url, { waitUntil: 'networkidle' });
        await page.evaluate(() => document.querySelectorAll('[data-reveal]').forEach((e) => e.classList.add('is-revealed')));
        await page.waitForTimeout(1400);
        const m = await page.evaluate(PROBE);
        if (!first) first = { status: res?.status(), ...m };

        console.log(`   ${vp.name.padEnd(15)} ${String(m.height).padStart(6)}px  yatay:${m.hscroll || 'yok'}  h1=${m.h1} h2=${m.h2} h3=${m.h3}`);
        if (m.hscroll) findings.push(`[H] ${vp.name}: YATAY KAYDIRMA ${m.hscroll}`);
        if (m.navOverlap.length) findings.push(`[B] ${vp.name}: navbar İÇERİĞİ ÖRTÜYOR → ${m.navOverlap.join(' | ')}`);
        if (m.navClearance !== null && m.navClearance < 8) findings.push(`[B] ${vp.name}: navbar altı boşluk yalnız ${m.navClearance}px (sıkışık)`);
        if (m.ghostTabbable.length) findings.push(`[P] ${vp.name}: görünmez ama klavyeyle gezilebilir → ${m.ghostTabbable.join(' | ')}`);
      }

      const f = first;
      if (f.status !== 200) findings.push(`[M] HTTP ${f.status}`);
      if (f.htmlLang !== loc) findings.push(`[N] <html lang="${f.htmlLang}"> — "${loc}" olmalı`);
      if (f.h1 !== 1) findings.push(`[H] h1 sayısı ${f.h1} — tam 1 olmalı`);
      if (f.headingSkips.length) findings.push(`[H] başlık seviyesi atlaması: ${f.headingSkips.join(', ')}`);
      if (f.btnNoName) findings.push(`[P] adsız buton: ${f.btnNoName}`);
      if (f.linkNoName) findings.push(`[P] adsız bağlantı: ${f.linkNoName}`);
      if (f.imgNoAlt) findings.push(`[Y] alt'sız görsel: ${f.imgNoAlt}`);
      if (f.svgNoAria) findings.push(`[Y] etiketsiz svg: ${f.svgNoAria}/${f.svgTotal}`);
      if (f.arabicBad) findings.push(`[O] lang="ar"+dir="rtl" eksik Arapça öge: ${f.arabicBad}/${f.arabicTotal}`);
      if (f.backslash) findings.push(`[D] ekranda ters bölü: ${f.backslash}`);
      if (f.stars) findings.push(`[D] ekranda ham **: ${f.stars}`);
      if (f.tofu) findings.push(`[D] tofu/replacement karakter: ${f.tofu}`);
      // noindex sayfalarda canonical/hreflang ARANMAZ. /kutuphanem bilerek
      // noindex — kullanıcıya özgü özel sayfa; arama motoruna verilecek
      // kanonik adresi yok. 2026-08-13 taramasında bunu bulgu diye
      // raporlamıştım, yanlış pozitifti.
      if (!f.noindex) {
        if (!f.canonical) findings.push(`[N] canonical YOK`);
        if (!/tr/.test(f.hreflang) || !/en/.test(f.hreflang)) findings.push(`[N] hreflang eksik: "${f.hreflang}"`);
      }
      if (errors.length) findings.push(`[F] console error ${errors.length}: ${errors[0].slice(0, 90)}`);

      // EN sayfasında Türkçe'ye özgü harf
      if (loc === 'en') {
        const leak = await page.evaluate(() => {
          const t = document.body.innerText;
          return [...new Set((t.match(/[^\n.!?]*[çğışöüĞİŞÖÜÇ][^\n.!?]*/g) || []).map((s) => s.trim().slice(0, 50)))].slice(0, 5);
        });
        if (leak.length) findings.push(`[E] EN'de Türkçe karakter (${leak.length}): ${leak.join(' | ')}`);
      }

      // İç bağlantı sağlığı
      const broken = [];
      for (const href of f.internalLinks.slice(0, 40)) {
        const r = await page.request.get(href).catch(() => null);
        if (!r || r.status() >= 400) broken.push(`${href} → ${r ? r.status() : 'hata'}`);
      }
      if (broken.length) findings.push(`[G] kırık bağlantı: ${broken.join(', ')}`);

      console.log(`\n╔═ ${url}`);
      console.log(`║  <a> ${f.anchors} · <button> ${f.buttons} · iç bağlantı ${f.internalLinks.length} · svg ${f.svgTotal} · Arapça ${f.arabicTotal} · console error ${errors.length}`);
      // Gezinme <button> ile yapılıyorsa: orta tık / yeni sekme / tarayıcı
      // önizlemesi çalışmaz, tarayıcı geçmişi ve tarayıcılar için görünmez olur.
      if (f.buttons > 20 && f.anchors < f.buttons / 5) {
        findings.push(`[G] gezinme <button> ile yapılıyor gibi: ${f.buttons} buton / ${f.anchors} bağlantı — orta tık ve "yeni sekmede aç" çalışmaz`);
      }
      if (findings.length) {
        console.log(`║  ❌ ${findings.length} BULGU`);
        findings.forEach((x) => console.log(`║   • ${x}`));
      } else {
        console.log('║  ✓ otomatik kontrollerde bulgu yok');
      }
      console.log('╚═\n');
    });
  }
}
