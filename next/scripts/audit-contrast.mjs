#!/usr/bin/env node
// ─── Kontrast denetimi (WCAG 2.1 AA) — bir kez yazılır, her turda koşar ─────
//
// 14 Ağustos 2026: kontrast bu tarihe kadar YALNIZ ANASAYFADA ölçülmüştü;
// 73 sayfa bilinmiyordu. Ölçülünce 3.508 gerçek ihlal çıktı. K1+K2+K3 ile
// 1.394'e indi. Bu script o sayının bir daha YÜKSELMEMESİ için var.
//
// ⚠ 14 Ağustos, ikinci tur: ilk `--full` koşusu 1.894 verdi ve bu şişikti —
// `SectionWrapper`/`fadeUpItem` gibi scroll-reveal bileşenleri ölçüm anında
// (domcontentloaded + 1.6sn) hâlâ fade-up ortasındaydı, opaklık düşük
// yakalanıyordu. Kanıt: `/tr/arac/tekrar-anatomi` normal ölçümde 27,
// sayfa gerçekten kaydırılıp animasyon oturmaya bırakılınca **4**'e düşüyor.
// Site zaten `useReducedMotion()` ile bu animasyonları TAMAMEN atlıyor
// (bkz. `SectionWrapper.jsx`: `initial={reduced ? false : 'hidden'}`) —
// yani gerçek çözüm scroll simülasyonu değil, context'i
// `reducedMotion: 'reduce'` ile açmak: animasyon hiç başlamıyor, öge
// doğrudan son (görünür) hâliyle render oluyor. Aynı sekiz sayfada
// doğrulandı: ritim 70→7, dua-dili 52→0, insan-tanımı 28→0, tekrar-anatomi
// 27→0 — ama melekler/kadınlar/kavram (53/36/32) **hiç değişmedi**, yani
// oradaki ihlaller animasyon değil GERÇEK.
//
// `audit-colors.mjs` ile aynı sözleşme:
//   node scripts/audit-contrast.mjs          → örneklem (12 rota, ~40 sn)
//   node scripts/audit-contrast.mjs --full   → 70 rota × 2 dil (~4 dk)
//   node scripts/audit-contrast.mjs --ci     → taban aşılırsa exit 1
//   node scripts/audit-contrast.mjs --update → tabanı GÜNCELLE (bilinçli)
//   node scripts/audit-contrast.mjs --mobile [--full]  → 390px görünüm (K5)
//
// K5 (14 Ağustos): masaüstünde (1440px) ölçülen "büyük metin" muafiyeti
// (≥24px veya ≥18.66px+bold → eşik 3.0, yoksa 4.5) mobilde `clamp()`
// yüzünden punto küçülünce KALKABİLİR — aynı öge masaüstünde muaf,
// mobilde muaf değil olabilir. `--mobile` bunu ayrı bir taban altında
// (`mobile-sample`/`mobile-full`) ölçer; `full`/`sample` tabanlarına karışmaz.
//
// ⚠ Çalışan bir sunucu ister (dev yeterli): http://localhost:3000
//
// Ölçüm mantığı `tests/lib/contrast.mjs`'te — alfa ve ata-opacity zincirini
// zemine katman katman karıştırır, gradyanlı zeminleri "yaklaşık" işaretler.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';
import { CONTRAST_PROBE } from '../tests/lib/contrast.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const BASELINE = path.join(ROOT, 'tests/__baseline__/contrast.json');
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

const args = process.argv.slice(2);
const FULL = args.includes('--full');
const CI = args.includes('--ci');
const UPDATE = args.includes('--update');
const MOBILE = args.includes('--mobile');

// Örneklem: en çok ihlal üreten sayfa tipleri (atlas / graf / arac / okuma / kök)
const SAMPLE = [
  '/tr', '/en',
  '/tr/atlas/kissa', '/tr/graf/zaman', '/tr/arac/dualar', '/tr/arac/sebebi-nuzul',
  '/tr/arac/ilk-son-kelimeler', '/tr/atlas/kavim', '/tr/graf/karsilastir',
  '/tr/arac/melekler', '/tr/oku', '/tr/sor',
];

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

// Sayıyı dürüst tutan ayıklama — ham sayı yanıltır:
//   · gradyan üstündeki koyu metin (ÖNE ÇIKAN rozeti) probe'un bilinen sınırı
//   · ≥24px dev dekoratif rakamlar
const isReal = (f) => !/ÖNE ÇIKAN|FEATURED/.test(f.text) && f.px < 24;

const urls = FULL
  ? ['tr', 'en'].flatMap((l) => allRoutes().map((r) => `/${l}${r}`))
  : SAMPLE;

const VIEWPORT = MOBILE ? { width: 390, height: 844 } : { width: 1440, height: 900 };
const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: VIEWPORT, reducedMotion: 'reduce' })).newPage();
const perPage = {};
let total = 0;

for (const u of urls) {
  try {
    await page.goto(BASE_URL + u, { waitUntil: 'domcontentloaded', timeout: 90000 });
    await page.waitForTimeout(1600);
    await page.evaluate(() => document.querySelectorAll('[data-reveal]').forEach((e) => e.classList.add('is-revealed')));
    const found = (await page.evaluate(CONTRAST_PROBE)).filter(isReal);
    perPage[u] = found.length;
    total += found.length;
    if (found.length) process.stdout.write(`   ${String(found.length).padStart(4)}  ${u}\n`);
  } catch (e) {
    perPage[u] = null;
    process.stdout.write(`   HATA  ${u}\n`);
  }
}
await browser.close();

const key = (MOBILE ? 'mobile-' : '') + (FULL ? 'full' : 'sample');
let base = {};
try { base = JSON.parse(fs.readFileSync(BASELINE, 'utf8')); } catch {}
const prev = base[key]?.total;

console.log(`\n─── KONTRAST DENETİMİ (${key}) ${'─'.repeat(30)}`);
console.log(`  sayfa            : ${urls.length}`);
console.log(`  gerçek ihlal     : ${total}${prev !== undefined ? `  (taban ${prev})` : ''}`);
console.log(`  temiz sayfa      : ${Object.values(perPage).filter((v) => v === 0).length}`);

if (UPDATE || prev === undefined) {
  base[key] = { total, perPage, at: new Date().toISOString().slice(0, 10) };
  fs.mkdirSync(path.dirname(BASELINE), { recursive: true });
  fs.writeFileSync(BASELINE, JSON.stringify(base, null, 1));
  console.log(`\n  📌 taban yazıldı: ${total}`);
  process.exit(0);
}

if (total > prev) {
  console.log(`\n  ❌ TABAN AŞILDI: ${prev} → ${total}  (+${total - prev})`);
  const worse = Object.entries(perPage).filter(([u, n]) => n > (base[key].perPage?.[u] ?? 0));
  worse.slice(0, 8).forEach(([u, n]) => console.log(`     ${u}: ${base[key].perPage?.[u] ?? 0} → ${n}`));
  console.log('\n  Kural: bu sayı ARTMAZ. Yeni metin rengi eklerken:');
  console.log('    · üçüncü kademe → SEMANTIC.textFaint (#7e8fa6, oran 5.94)');
  console.log('    · silver opaklığı ≥ 0.78 · gold opaklığı ≥ 0.75');
  console.log('    · ham slate500-800 METİN rengi olamaz (kenarlık olabilir)');
  console.log('    · kategori/kimlik renkleri de bu eşiklere tabidir (§13.26 md.6)');
  if (CI) process.exit(1);
} else if (total < prev) {
  console.log(`\n  ✅ İYİLEŞME: ${prev} → ${total}  (−${prev - total})`);
  console.log('     Tabanı düşürmek için: --update');
} else {
  console.log('\n  ✓ taban korundu');
}
