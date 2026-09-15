#!/usr/bin/env node
/**
 * DİL SIZINTISI DENETİMİ — İngilizce sayfada kalmış Türkçe metni yakalar.
 *
 * NEDEN VAR (2026-09-14):
 * Üç ayrı sayfada, İngilizce seçiliyken Türkçe metin basılıyordu ve bunların
 * hiçbiri gözle fark edilmemişti:
 *   · /en/oku/tecvid BAŞTAN SONA Türkçeydi (veride hiç İngilizce alan yoktu),
 *   · /en/arac/tefsir-ihtilaflari 190 Türkçe alana karşı 33 İngilizce alan
 *     taşıyordu ve sekmeli olduğu için ilk ekranda görünmüyordu,
 *   · beş sayfada kaynak künyeleri ("… tefsiri", "… bölümü") Türkçe kalmıştı.
 * Ortak sebep: veri dosyasına `xEn` alanı eklenmeyi unutulduğunda bileşen
 * sessizce Türkçeye düşüyor. Sessiz düşüş, gözle denetlenemez.
 *
 * NE YAPAR: /en rotalarını gezer, sekmeleri ve açılır bölümleri tıklayarak
 * içeriği açar, görünür metinde Türkçeye özgü işaret arar.
 *
 * YANLIŞ POZİTİF ELEME — bu üçü Türkçe sızıntısı DEĞİLDİR:
 *   · Arapça metin ve `lang="ar"` / `lang="tr"` işaretli bloklar,
 *   · ÖZEL İSİM ve eser künyeleri (İbn Kesîr, ez-Zerkeşî, Nazmü'd-Dürer):
 *     bunlar transliterasyondur, çeviri gerektirmez. Bu yüzden ölçüt
 *     "Türkçe harf" değil, EN AZ ALTI KELİMELİK BİR CÜMLE olmasıdır.
 *   · İngilizce "her", "the" gibi kelimelerle çakışan Türkçe kelimeler:
 *     kelime listesinden çıkarıldı (ilk sürüm "her" yüzünden tamamen
 *     İngilizce bir cümleyi Türkçe sanmıştı).
 *
 * Kullanım: node scripts/audit-i18n-leak.mjs [--ci] [rota...]
 */
import { chromium } from 'playwright';

const BASE = process.env.BASE_URL || 'http://localhost:3000';
const args = process.argv.slice(2);
const CI = args.includes('--ci');
const given = args.filter(a => !a.startsWith('--'));

const ROUTES = given.length ? given : [
  '/en', '/en/alanlar', '/en/araclar',
  '/en/arac/tefsir-ihtilaflari', '/en/arac/mukattaa', '/en/arac/ritim',
  '/en/arac/ses-mimarisi', '/en/arac/yeminler', '/en/arac/kiyamet',
  '/en/arac/cennet-cehennem', '/en/arac/dua-dili', '/en/arac/dualar',
  '/en/arac/esma-frekans', '/en/arac/koruma-zinciri', '/en/arac/sayilar',
  '/en/arac/iblis-seytan', '/en/arac/halka-kompozisyon', '/en/arac/alti-konu',
  '/en/arac/ilk-son-kelimeler', '/en/arac/zaman-boyutlari',
  '/en/atlas/fatiha', '/en/atlas/kavim', '/en/atlas/ahiret-yolculugu',
  '/en/atlas/insan-psikolojisi', '/en/atlas/insan-tanimi', '/en/atlas/munafik',
  '/en/atlas/furuk', '/en/atlas/ibadetler', '/en/atlas/mesel',
  '/en/atlas/munasebat', '/en/atlas/sunnetullah', '/en/atlas/insan-yolculugu',
  '/en/oku/tecvid', '/en/sor', '/en/hakkinda',
];

// Türkçeye özgü, İngilizcede karşılığı olmayan işlev sözcükleri.
// "her", "bu", "bir", "ve" gibi İngilizceyle çakışanlar KASITLI olarak yok.
const TR_WORDS = /\b(için|olarak|değil|olan|üzerine|arasında|göre|kadar|yalnız|sûre|âyet|bölüm|kaynak|örnek|şekilde|birlikte|hâlde|gösterir|verir|olduğu|edilir|yapılır|okunur|nakleder|tercih|çünkü|ancak|dolayı|böylece|ayrıca)\b/i;

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
const page = await ctx.newPage();

const report = [];
for (const r of ROUTES) {
  try {
    await page.goto(BASE + r, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(1100);
    // Sekmeleri ve açılır bölümleri aç: içerik gizliyse denetlenemez.
    for (let round = 0; round < 3; round++) {
      for (const btn of await page.$$('button, summary')) {
        try { await btn.click({ timeout: 500 }); await page.waitForTimeout(70); } catch { /* tıklanamayan öge */ }
      }
      await page.waitForTimeout(250);
    }
    const hits = await page.evaluate((src) => {
      const re = new RegExp(src, 'i');
      const out = [];
      for (const el of document.querySelectorAll('*')) {
        if (el.children.length) continue;
        if (el.closest('[lang="ar"], [lang="tr"]')) continue;
        if (/^(SCRIPT|STYLE|NOSCRIPT)$/.test(el.tagName)) continue;
        const t = (el.textContent || '').trim();
        if (t.split(/\s+/).length < 6) continue;   // künye/isim değil, CÜMLE ara
        if (/[؀-ۿ]/.test(t)) continue;   // Arapça
        if (/[ğşı]|İ/.test(t) || re.test(t)) out.push(t.slice(0, 120));
      }
      return [...new Set(out)];
    }, TR_WORDS.source);
    if (hits.length) report.push({ r, hits });
  } catch (e) {
    console.log(`  ! ${r} gezilemedi: ${e.message.slice(0, 60)}`);
  }
}
await browser.close();

console.log('\n─── DİL SIZINTISI (İngilizce sayfada Türkçe cümle) ─────────\n');
console.log(`  gezilen rota: ${ROUTES.length}\n`);
let total = 0;
for (const { r, hits } of report) {
  console.log(`  ✗ ${r}  (${hits.length})`);
  hits.slice(0, 5).forEach(h => console.log(`       · ${h}`));
  total += hits.length;
}
if (!total) console.log('  ✓ İngilizce sayfalarda Türkçe cümle yok\n');
else { console.log(`\n  toplam ${total} satır, ${report.length} sayfa\n`); if (CI) process.exit(1); }
