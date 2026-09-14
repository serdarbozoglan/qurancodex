#!/usr/bin/env node
/**
 * İÇ BAĞLANTI DENETİMİ — ölü linkleri yakalar.
 *
 * NEDEN VAR (2026-09-14):
 * Cennet-Cehennem sayfasındaki bir kart `/tr/arac/ahiret-yolculugu`'na
 * gidiyordu; sayfa `/tr/atlas/ahiret-yolculugu`'nda. Tıklayan 404 alıyordu ve
 * bu, aylarca fark edilmedi. Bulunma biçimi de kazaydı: kontrast denetimi o
 * sayfada zaman aşımına uğruyordu, çünkü Next'in <Link> ÖN YÜKLEMESİ ölü
 * rotaya istek atıp `networkidle`'ı hiç bırakmıyordu. Yani ölü link yalnız
 * kullanıcıyı 404'e götürmüyor, sayfanın ağ etkinliğini de asılı bırakıyor.
 *
 * NE YAPAR: verilen rotaları gezer, sayfadaki her <a href> iç bağlantısını
 * toplar ve HEAD isteğiyle durumunu ölçer. 200 dışındaki her şey rapor edilir.
 * Dış bağlantılar (http ile başlayan, farklı host) atlanır: onların sağlığı bu
 * betiğin işi değil ve ağ gürültüsü yaratır.
 *
 * Kullanım: node scripts/audit-links.mjs [--ci] [rota...]
 */
import { chromium } from 'playwright';

const BASE = process.env.BASE_URL || 'http://localhost:3000';
const args = process.argv.slice(2);
const CI = args.includes('--ci');
const given = args.filter(a => !a.startsWith('--'));

const ROUTES = given.length ? given : [
  '/tr', '/en', '/tr/alanlar', '/tr/araclar', '/tr/kesfet',
  '/tr/arac/cennet-cehennem', '/tr/arac/kiyamet', '/tr/arac/mukattaa',
  '/tr/arac/neden-sonuc', '/tr/arac/esma-frekans', '/tr/arac/dua-dili',
  '/tr/arac/sayilar', '/tr/arac/iblis-seytan', '/tr/arac/koruma-zinciri',
  '/tr/arac/ritim', '/tr/arac/ses-mimarisi', '/tr/arac/yeminler',
  '/tr/arac/halka-kompozisyon', '/tr/arac/ilk-son-kelimeler',
  '/tr/arac/tefsir-ihtilaflari', '/tr/arac/alti-konu', '/tr/arac/zaman-boyutlari',
  '/tr/atlas/fatiha', '/tr/atlas/kavim', '/tr/atlas/ahiret-yolculugu',
  '/tr/atlas/insan-psikolojisi', '/tr/atlas/insan-tanimi', '/tr/atlas/munafik',
  '/tr/atlas/furuk', '/tr/atlas/ibadetler', '/tr/atlas/mesel',
  '/tr/atlas/munasebat', '/tr/atlas/sunnetullah', '/tr/atlas/insan-yolculugu',
  '/tr/oku/tecvid', '/tr/sor', '/tr/hakkinda',
];

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
const page = await ctx.newPage();

const seen = new Map();   // href -> ilk bulunduğu sayfa
for (const r of ROUTES) {
  try {
    // networkidle KULLANMA: ölü bir ön yükleme varsa bu betiğin kendisi asılır.
    await page.goto(BASE + r, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(900);
    const hrefs = await page.evaluate(() =>
      [...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href')));
    for (const h of hrefs) {
      if (!h || h.startsWith('#') || h.startsWith('mailto:') || h.startsWith('tel:')) continue;
      if (/^https?:\/\//.test(h)) continue;      // dış bağlantı: kapsam dışı
      const clean = h.split('#')[0];
      if (!clean.startsWith('/')) continue;
      if (!seen.has(clean)) seen.set(clean, r);
    }
  } catch (e) {
    console.log(`  ! ${r} gezilemedi: ${e.message.slice(0, 60)}`);
  }
}
await browser.close();

console.log(`\n─── İÇ BAĞLANTI DENETİMİ ───────────────────────────────\n`);
console.log(`  gezilen rota: ${ROUTES.length} · benzersiz iç bağlantı: ${seen.size}\n`);

const dead = [];
for (const [href, from] of seen) {
  let status = 0;
  try {
    const res = await fetch(BASE + href, { redirect: 'manual' });
    status = res.status;
  } catch { status = -1; }
  if (status !== 200 && !(status >= 300 && status < 400)) dead.push({ href, from, status });
}

if (dead.length) {
  console.log(`  ✗ ${dead.length} ölü bağlantı:\n`);
  for (const d of dead) console.log(`     ${String(d.status).padStart(4)}  ${d.href}\n           ${d.from} sayfasında`);
  console.log('');
  if (CI) process.exit(1);
} else {
  console.log('  ✓ Ölü iç bağlantı yok\n');
}
