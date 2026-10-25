#!/usr/bin/env node
// ─── audit-arabic-json — §13.15: public/*.json'a yazılan Arapça temiz mi ────
// Değişen (ya da yeni) public/*.json dosyalarında, KFGQPC'de tofu/daire ya da
// üst üste binen hareke üreten Arapça arar. §13.15'in doğrulama komutunun
// push-öncesi zorunlu hâli.
//
// ⚠ 2026-10-25: ÖLÇÜT DEĞİŞTİ, ve bu değişiklik gerçek borç ortaya çıkardı.
// Eski sürüm elle yazılmış bir karakter listesi (bir regex) tarıyordu ve o
// liste EKSİKTİ: U+0653 (maddah), U+06DF ve U+06E0 listede yoktu. Sonuç,
// kapının sessizce yeşil yanmasıydı. Aynı hata sınıfı projede daha önce de
// yaşandı (U+06EB/U+06EC kaçırılmıştı), yani liste tutmak yapısal olarak
// yanlış: `arabic.js` her genişlediğinde listenin de elle genişletilmesi
// gerekiyor ve kimse hatırlamıyor.
//
// Doğru ölçüt tek ve kendi kendini güncelliyor:
//     cleanArabicForDisplay(s) === s
// Yani "bu dizeyi ekrana basmadan önce temizleyici bir şey yapıyor mu?"
// Fonksiyon otoritedir (§13.15: "Otorite = next/src/lib/arabic.js (kod)"),
// bu yüzden listeyi kopyalamak yerine fonksiyonun KENDİSİ çağrılıyor.
//
// ⚠ Eski sürüm ayrıca `public/tefekkur/` dizinini taramadan muaf tutuyordu ve
// bu muafiyet HİÇBİR YERDE belgelenmemişti: betiğin kendi başlık yorumu üç
// muafiyet sayarken kodda dördüncüsü vardı. Kaldırıldı. Tefekkür yazılarının
// Arapçası VerseInline ile ekrana basılıyor, yani overlay'siz hat; §13.15
// tam olarak bu durumu kapsıyor.
//
// İstisna: ReadingMode/InterlinearView veri hattı (CSS tecvid overlay ister) —
// `public/tafsir/`, `public/corpus/`, `public/meal-cache/` kapsam dışı.
//
// ⚠ 2026-10-25, ÖLÇÜLDÜ VE KURALIN GEREKÇESİ DOĞRULANMADI: bu kapıyı
// düzelttikten sonra yedi dizeyi normalize ettim, sonra yazı tipinin cmap
// tablosunu okudum. Sevk edilen iki KFGQPC dosyasında da U+0653, U+06DF,
// U+06E0, U+06EA, U+0671 ve U+06D6 için GLİF VAR. §13.15 bu karakterler
// için "glyph'i bulunmayan ... tofu olarak render olur" diyor; o gerekçe
// en azından bugünkü yazı tipi için geçerli değil. Üstelik U+06DF ve U+06E0
// süs değil, harfin okunmadığını bildiren işlevli okuyuş işaretleri.
// Yedi dizelik düzeltmem GERİ ALINDI.
//
// Kapı yine de duruyor, çünkü ölçtüğü şey hâlâ gerçek: "bu dize, görüntüleme
// hattının üreteceği şeyden farklı." Ama artık ihlal değil TUTARSIZLIK
// bildiriyor ve uyarı metni normalize etmeden önce okunmasını istiyor.
//
// Açık kalan iki iş (astra'nın bulguları):
//   · Fonksiyonun KENDİSİ sınanmıyor. Kapı düzeltmeyle aynı fonksiyonu
//     çağırdığı için hatalı bir silme kuralı hem düzeltmeden hem denetimden
//     geçer. Korunması gereken işaretler için bağımsız test gerekiyor.
//   · Âyet, dua ve diğer Arapça metinler aynı kaynak eşleştirme kuralına
//     tabi tutulmamalı; her dizenin onayı kaynak ve bağlam denetimine
//     dayanmalı.
//
// Muaf DÖRT dosya, her biri gerekçesiyle:
//   verse-graph-bgem3.json — KANONİK âyet kaynağı. §13.15 bu dosya için
//     açıkça "buradaki Arapça metne DOKUNMA" diyor; vakıf işaretlerini
//     taşıması gerekiyor, çünkü ReadingMode onları CSS overlay ile
//     konumlandırıyor.
//   verses-lite.json — yukarıdakinin türevi (scripts/build-verses-lite.mjs,
//     yalnız connections + x/y/z atılır). Metin birebir aynı, muafiyeti de
//     aynı. Aynı hattı besliyor: okuma modu, ısı haritası, kıssa/mesel
//     atlası, kavram grafı, Esmâ Frekans, sebeb-i nüzûl.
//   mushaf-line-breaks.json — mushaf sayfa düzeni; tüketicileri
//     ReadingMode.jsx ve MushafFontInlineView.jsx, yani aynı overlay hattı.
//     (Doğrulandı, varsayılmadı: iki tüketici de arandı.)
//   tecvid-rehberi.json — tecvid rehberi, tüketicisi TecvidRehberi.jsx.
//     Kural anahtarları işaretin KENDİSİ (ör. `key: "ٱ"`); normalize etmek
//     kural eşleşmesini kırar. Bir tecvid rehberi öğrettiği işareti
//     göstermek zorundadır.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { changedFiles } from './lib/changed.mjs';
import { cleanArabicForDisplay } from '../src/lib/arabic.js';

const CI = process.argv.includes('--ci');
const ALL = process.argv.includes('--all');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ARABIC = /[؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿]/;

const MUAF = new Set([
  'public/verse-graph-bgem3.json',
  'public/verses-lite.json',
  'public/mushaf-line-breaks.json',
  'public/tecvid-rehberi.json',
]);

const inScope = (f) =>
  (/^public\/[^/]+\.json$/.test(f) || /^public\/(?!tafsir|corpus|meal-cache)[^/]+\/.*\.json$/.test(f))
  && !MUAF.has(f);

// --all: tüm ağacı tara (borç envanteri için). Varsayılan: diff tabanlı.
function everyPublicJson() {
  const out = [];
  const SKIP = new Set(['tafsir', 'corpus', 'meal-cache', 'audio', 'amthal', 'fonts', 'icons']);
  (function walk(dir, rel) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (e.isDirectory()) { if (!SKIP.has(e.name)) walk(path.join(dir, e.name), `${rel}${e.name}/`); continue; }
      if (e.name.endsWith('.json')) out.push(`public/${rel}${e.name}`);
    }
  })(path.join(ROOT, 'public'), '');
  return out.filter(f => !MUAF.has(f));
}

const files = (ALL ? everyPublicJson() : changedFiles(ROOT).filter(inScope));

const findings = [];
for (const f of files) {
  const p = path.join(ROOT, f);
  if (!fs.existsSync(p)) continue;
  let n = 0, sample = '';
  const points = new Set();
  const walk = (o) => {
    if (typeof o === 'string') {
      if (!ARABIC.test(o)) return;
      const clean = cleanArabicForDisplay(o);
      if (clean === o) return;
      n += 1;
      if (!sample) sample = o.slice(0, 60);
      // Hangi karakterin düştüğünü söyle; eski sürüm yalnız sayı veriyordu.
      for (const ch of o) {
        if (!clean.includes(ch)) points.add(`U+${ch.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')}`);
      }
    } else if (Array.isArray(o)) o.forEach(walk);
    else if (o && typeof o === 'object') Object.values(o).forEach(walk);
  };
  try { walk(JSON.parse(fs.readFileSync(p, 'utf8'))); } catch { continue; }
  if (n) findings.push([f, n, sample, [...points]]);
}

const kapsam = ALL ? `tüm ağaç, ${files.length} dosya` : `değişen ${files.length} dosya`;
console.log(`\n─── ARAPÇA JSON (§13.15) — ${kapsam} ${'─'.repeat(22)}`);
if (!findings.length) { console.log('  ✓ cleanArabicForDisplay her dizeyi aynen döndürüyor'); process.exit(0); }
for (const [f, n, s, pts] of findings.sort((a, b) => b[1] - a[1])) {
  console.log(`  ✗ ${f}: ${n} dize  (${pts.join(', ')})  örn. "${s}"`);
}
console.log('\n  Bu kapı bir TUTARSIZLIK bildirir: dize, görüntüleme hattının üreteceği');
console.log('  şeyden farklı. Hemen normalize ETME, önce şunu oku:');
console.log('  ⚠ 2026-10-25 ÖLÇÜMÜ: sevk edilen KFGQPC dosyalarında U+0653, U+06DF,');
console.log('    U+06E0, U+06EA, U+0671 ve U+06D6 için GLİF VAR (cmap okundu, hem');
console.log('    kfgqpc-hafs.otf hem subset). Yani §13.15\'in "glifi yok, tofu basar"');
console.log('    gerekçesi bu karakterler için doğrulanmadı. U+06DF ve U+06E0 harfin');
console.log('    okunmadığını bildiren İŞLEVLİ okuyuş işaretleridir; silmek okuyuş');
console.log('    bilgisi kaybeder. Kuralın gerekçesi gözden geçirilene kadar âyet');
console.log('    metnini körlemesine normalize etmeyin.');
console.log('  §13.14: eski kuralla yazılmış veriyi fonksiyondan geçirmek yetmez;');
console.log('  âyet metni KANONİK kaynaktan yeniden üretilir (verse-graph-bgem3).');
process.exit(CI ? 1 : 0);
