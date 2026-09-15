#!/usr/bin/env node
/**
 * Oturmuş hâlde kontrast denetimi — §13.26'nın eksik aracı.
 *
 * NEDEN VAR (2026-09-13):
 * `audit-contrast.mjs` sayfayı gezerken ölçer ve bir ögeyi reveal animasyonu
 * ortasında yakalayabilir. §13.26 bunu belgeliyor ve "bir bulguyu düzeltmeden
 * önce o ögeyi tek tek, OTURMUŞ hâlinde doğrula" diyor, ama bunu yapan bir
 * betik yoktu; her tur elle yazılıyordu. Sonuç: iki kez yanlış genelleme
 * yapıldı ("hepsi artefakt", sonra "hepsi gerçek"). İkisi de yanlıştı.
 *
 * Ölçülen örnek: anasayfadaki 12 bulgunun net opaklığı sayfa oturunca 1
 * çıkıyor (hepsi artefakt), Halka Kompozisyon'daki 5 bulgu ise oturmuş hâlde
 * de bozuk çıkıyor (hepsi gerçek). Aynı sayıdan iki farklı sonuç.
 *
 * BU BETİK NE YAPAR:
 *   1. Sayfayı baştan sona gezip HER reveal'ı tetikler ve tamamlatır.
 *      (viewport={{ once: true }} kullanıldığı için ikinci geçişte animasyon
 *      yeniden tetiklenmez; her şey oturmuş hâlde kalır.)
 *   2. Tepeye döner, bekler, sonra sayfayı İKİNCİ KEZ gezerek probe'u koşturur.
 *   3. İkinci geçişte hâlâ bildirilen her bulgu GERÇEKTİR.
 *
 * ORANI YENİDEN HESAPLAMAZ. Denendi ve bırakıldı: efektif zemini bulmak genel
 * hâlde zor, ata zincirinde ilk gradyanı yakalamak dekoratif bir katmana
 * çarpıyor ve altın metni altın gradyana ölçüp "oran 1" gibi uydurma bulgular
 * üretiyor. Zemin çözümlemesini zaten tests/lib/contrast.mjs doğru yapıyor;
 * bu betik onu yeniden kullanır, taklit etmez.
 *
 * Kasıtlı sönük durumlar (devre dışı düğme vb.) ayrı işaretlenir: §13.26 md.5
 * onlar için taban 4.5 değil 3.0'dır, o yüzden otomatik "gerçek" sayılmazlar.
 *
 * KULLANIM:
 *   node scripts/audit-contrast-settled.mjs /tr /tr/arac/halka-kompozisyon
 *   node scripts/audit-contrast-settled.mjs --mobile /tr/arac/dua-dili
 */

import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';
import { CONTRAST_PROBE } from '../tests/lib/contrast.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

const args = process.argv.slice(2);
const MOBILE = args.includes('--mobile');
const ROUTES = args.filter(a => !a.startsWith('--'));

if (!ROUTES.length) {
  console.error('Kullanım: node scripts/audit-contrast-settled.mjs [--mobile] <rota> [rota...]');
  process.exit(1);
}

// Cosmic-black üstünde oran. Zemin bilinmiyorsa probe'un kendi oranı kullanılır.
const lin = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
const L = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const BG = [10, 10, 26];
const ratioOnBg = (rgb, alpha = 1, bg = BG) => {
  const f = alpha < 1 ? rgb.map((c, i) => c * alpha + bg[i] * (1 - alpha)) : rgb;
  const l1 = L(f), l2 = L(bg);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
};
const parseColor = s => {
  const m = String(s || '').match(/rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)(?:[,\s/]+([\d.]+))?/);
  return m ? { rgb: [+m[1], +m[2], +m[3]], a: m[4] === undefined ? 1 : parseFloat(m[4]) } : null;
};

// Ögenin durumu: 'deco' | 'dim' | null
//
// İKİSİ AYRI ŞEYDİR ve 2026-09-14'e kadar aynı kovaya atılıyordu:
//   · aria-hidden  → DEKORATİF. WCAG saf dekoratif içeriği kontrast
//     ölçütünden muaf tutar, §13.26 md.3 de öyle. Taban YOKTUR.
//   · disabled / aria-disabled → KASITLI SÖNÜK durum. Bilgi taşır, o yüzden
//     §13.26 md.5 ona 3.0 tabanı koyar.
// Karıştırılınca anasayfadaki aria-hidden besmele (süs) 2.88 ile "gerçek
// ihlal" diye raporlanıyordu; oysa hiç ölçülmemeliydi.
async function stateOf(page, text) {
  if (!text) return null;
  return page.evaluate(t => {
    const el = [...document.querySelectorAll('*')]
      .find(e => e.children.length === 0 && (e.textContent || '').trim().includes(t.trim().slice(0, 24)));
    if (!el) return null;
    if (el.closest('[aria-hidden="true"]')) return 'deco';
    if (el.closest('[disabled]') || el.closest('[aria-disabled="true"]')) return 'dim';
    return null;
  }, text);
}

const browser = await chromium.launch();
let grandReal = 0, grandArtifact = 0, grandDim = 0, grandDeco = 0;

for (const route of ROUTES) {
  const ctx = await browser.newContext({
    viewport: MOBILE ? { width: 390, height: 844 } : { width: 1440, height: 900 },
    reducedMotion: 'reduce',
    deviceScaleFactor: MOBILE ? 2 : 1,
  });
  const page = await ctx.newPage();
  try {
    await page.goto(BASE_URL + route, { waitUntil: 'networkidle', timeout: 90000 });
    await page.waitForTimeout(1500);

    // 1) BİRİNCİ GEÇİŞ: tüm reveal'ları tetikle ve tamamlat
    //
    // YÜKSEKLİK HER ADIMDA YENİDEN OKUNUR. Eskiden döngü başında bir kez
    // ölçülüyordu ve bu SESSİZ BİR HATAYDI: SectionWrapper'ın `hidden` hâli
    // `opacity: 0.5` (bilinçli — bölüm asla bomboş görünmesin diye), iç ögeler
    // de 0.5 ile çarpılınca 0.25. Sayfa açıldıkça uzuyorsa eski yükseklikte
    // döngü erken bitiyor, alt bölümlere HİÇ inilmiyor ve oralar `hidden`
    // hâlinde ölçülüp "gerçek ihlal" diye raporlanıyordu. Halka Kompozisyon'da
    // 25 bulgunun 24'ü böyle doğdu; tam denetim aynı sayfada 1 diyordu.
    const seenFirst = new Map();
    let y = 0;
    for (let guard = 0; guard < 400; guard++) {
      await page.evaluate(yy => window.scrollTo(0, yy), y);
      await page.waitForTimeout(650);
      for (const f of await page.evaluate(CONTRAST_PROBE)) {
        seenFirst.set(`${f.color}|${f.px}|${f.bg}|${f.opacity}`, f);
      }
      const h = await page.evaluate(() => document.body.scrollHeight);
      if (y + 700 >= h) break;
      y += 700;
    }
    const raw = [...seenFirst.values()].filter(f => f.px < 24);

    // 2) otur: tepeye dön ve animasyonların bitmesini bekle
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1800);

    // 3) İKİNCİ GEÇİŞ: her şey oturmuşken yeniden ölç
    const seenSecond = new Map();
    let y2 = 0;
    for (let guard = 0; guard < 400; guard++) {
      await page.evaluate(yy => window.scrollTo(0, yy), y2);
      await page.waitForTimeout(500);
      for (const f of await page.evaluate(CONTRAST_PROBE)) {
        seenSecond.set(`${f.color}|${f.px}|${f.bg}|${f.opacity}`, f);
      }
      const h = await page.evaluate(() => document.body.scrollHeight);
      if (y2 + 700 >= h) break;
      y2 += 700;
    }
    const settledFindings = [...seenSecond.values()].filter(f => f.px < 24);

    // Kasıtlı sönük hâlleri ayır (§13.26 md.5: onlar için taban 3.0)
    const real = [], dim = [], deco = [];
    for (const f of settledFindings) {
      const r = parseFloat(f.ratio);
      const st = await stateOf(page, f.text);
      if (st === 'deco') deco.push(f);                                  // muaf
      else if (st === 'dim' && Number.isFinite(r) && r >= 3.0) dim.push(f);
      else real.push(f);
    }
    const artifact = raw.filter(f =>
      !settledFindings.some(g => g.color === f.color && g.px === f.px && g.text === f.text));

    grandReal += real.length; grandArtifact += artifact.length; grandDim += dim.length; grandDeco += deco.length;
    console.log(`\n── ${route}`);
    console.log(`   ham: ${raw.length}  |  GERÇEK: ${real.length}  |  artefakt: ${artifact.length}  |  kasıtlı sönük: ${dim.length}  |  dekoratif: ${deco.length}`);
    for (const x of real.sort((a, b) => parseFloat(a.ratio) - parseFloat(b.ratio))) {
      console.log(`   ✗ ${String(x.ratio).padStart(5)}  ${x.color} @${x.opacity}  zemin ${x.bg}  "${(x.text || '').slice(0, 46)}"`);
    }
  } catch (e) {
    console.log(`\n── ${route}\n   HATA: ${e.message.slice(0, 80)}`);
  }
  await ctx.close();
}

await browser.close();
console.log(`\n═══ TOPLAM  GERÇEK: ${grandReal}  |  artefakt: ${grandArtifact}  |  kasıtlı sönük: ${grandDim}  |  dekoratif: ${grandDeco}`);
console.log('   Yalnız GERÇEK satırları düzeltilir. Artefaktlar ölçüm zamanlamasıdır;');
console.log('   kasıtlı sönük olanlar §13.26 md.5 tabanını (3.0) geçiyorsa kusur değil;');
console.log('   aria-hidden dekoratif ögeler kontrast ölçütünden MUAFTIR.');
