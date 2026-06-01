#!/usr/bin/env node
// ─── build-surah-name-heatmap.mjs ─────────────────────────────────────────────
// Top N ismin 114 sure üzerinde dağılımını hesaplar — heatmap için matrix.
//
// Output: next/public/esma-surah-heatmap.json
// Şema:
//   {
//     names: [{ isim, arapca, total }],
//     surahs: [{ surah, surahName, surahNameEn, ayetCount, total }],
//     matrix: number[][],  // [surahIdx][nameIdx] = count
//     methodology: { ... }
//   }
//
// Bu data NamesAtlas üstünde küçük bir compact heatmap olarak gösterilir.
// ──────────────────────────────────────────────────────────────────────────────

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const ESMA_PATH = join(ROOT, 'next/public/esma-frekans.json');
const VG_PATH = join(ROOT, 'next/public/verse-graph-bgem3.json');
const OUT_PATH = join(ROOT, 'next/public/esma-surah-heatmap.json');

function stripArabic(s) {
  if (!s) return '';
  return s
    .replace(/[ً-ْ]/g, '').replace(/[ٰٓ-ٕ]/g, '').replace(/[ۖ-۠ۢۨ]/g, '')
    .replace(/[ؐ-ؚ]/g, '').replace(/[۪-ۯ]/g, '').replace(/[‌-‏]/g, '')
    .replace(/[ٱآإأ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه')
    .replace(/\s+/g, ' ').trim();
}

// Match factory — ismin stripped formu için lām+ال+tanvin esnek pattern.
// Burada da name-pairs script'iyle aynı 'pairPattern' philosophy
function namePattern(stripped) {
  return new RegExp(`(?:^|\\s)ل?(?:ال)?${stripped}ا?(?:\\s|$|[وفبكل])`, 'u');
}

// 15 en frekantlı isim — Allah ve esma-i hüsnâ ağırlıklı.
// Bunlar Top 20'deki en güçlü Esma'lar (Lafza-i Celâl 'Allah' hariç,
// çünkü heatmap onunla domine olur). isim → arapça stripped form.
const TOP_NAMES = [
  { isim: 'El-Hakk',    arabic: 'الحق',   stripped: 'حق' },
  { isim: 'El-Alîm',    arabic: 'العليم', stripped: 'عليم' },
  { isim: 'Er-Rahîm',   arabic: 'الرحيم', stripped: 'رحيم' },
  { isim: 'El-Azîm',    arabic: 'العظيم', stripped: 'عظيم' },
  { isim: 'El-Azîz',    arabic: 'العزيز', stripped: 'عزيز' },
  { isim: 'El-Hakîm',   arabic: 'الحكيم', stripped: 'حكيم' },
  { isim: 'El-Gafûr',   arabic: 'الغفور', stripped: 'غفور' },
  { isim: 'Er-Rahmân',  arabic: 'الرحمان', stripped: 'رحم(ا?ن|ن)' },
  { isim: 'Es-Semî\'',  arabic: 'السميع', stripped: 'سميع' },
  { isim: 'El-Basîr',   arabic: 'البصير', stripped: 'بصير' },
  { isim: 'El-Kerîm',   arabic: 'الكريم', stripped: 'كريم' },
  { isim: 'El-Halîm',   arabic: 'الحليم', stripped: 'حليم' },
  { isim: 'El-Hayy',    arabic: 'الحي',   stripped: 'حي' },
  { isim: 'El-Kayyûm',  arabic: 'القيوم', stripped: 'قيوم' },
  { isim: 'El-Vedûd',   arabic: 'الودود', stripped: 'ودود' },
];

// ── Load ──────────────────────────────────────────────────────────────────────
const vg = JSON.parse(readFileSync(VG_PATH, 'utf8'));

// Pre-strip all verses for performance
const versesBySurah = new Map();
for (const v of vg) {
  if (!versesBySurah.has(v.surah)) versesBySurah.set(v.surah, []);
  versesBySurah.get(v.surah).push({
    ayah: v.ayah,
    stripped: stripArabic(v.arabic),
    surahName: v.surahName,
    surahNameEn: v.surahNameEn,
  });
}

console.log('[build-surah-name-heatmap] taranıyor...');

// names[i].pattern
const names = TOP_NAMES.map(n => ({
  ...n,
  pattern: new RegExp(`(?:^|\\s)ل?(?:ال)?${n.stripped}ا?(?:\\s|$)`, 'gu'),
  total: 0,
}));

// surahs[i] = { surah, surahName, surahNameEn, ayetCount, total }
const surahs = [];
const matrix = []; // matrix[surahIdx][nameIdx] = count

for (let surahNo = 1; surahNo <= 114; surahNo++) {
  const verses = versesBySurah.get(surahNo) || [];
  const row = new Array(names.length).fill(0);

  for (const v of verses) {
    for (let ni = 0; ni < names.length; ni++) {
      const m = v.stripped.match(names[ni].pattern);
      if (m) {
        row[ni] += m.length;
      }
    }
  }

  const total = row.reduce((a, b) => a + b, 0);
  for (let ni = 0; ni < names.length; ni++) names[ni].total += row[ni];

  surahs.push({
    surah: surahNo,
    surahName: verses[0]?.surahName || '',
    surahNameEn: verses[0]?.surahNameEn || '',
    ayetCount: verses.length,
    total,
  });
  matrix.push(row);
}

// İlk 20 en aktif sure (toplam isim sayısına göre)
const topSurahIndices = surahs
  .map((s, i) => ({ idx: i, total: s.total }))
  .sort((a, b) => b.total - a.total)
  .slice(0, 20)
  .map(x => x.idx)
  .sort((a, b) => a - b); // mushaf sırası geri al

// İsim sütunlarını TOP-20 SURE İÇİ TOPLAMA göre desc sırala.
// Top 20'de 0 olan isimleri ELE (Vedûd gibi sadece az-kullanılan surede
// görünenler heatmap'i kirletir).
const namesTop20Totals = names.map((n, ni) => ({
  ni,
  isim: n.isim,
  total: topSurahIndices.reduce((acc, si) => acc + matrix[si][ni], 0),
}));
const namesSorted = namesTop20Totals
  .filter(x => x.total > 0)
  .sort((a, b) => b.total - a.total);

const reorderedNames = namesSorted.map(x => ({
  isim: names[x.ni].isim,
  arabic: names[x.ni].arabic,
  total: names[x.ni].total,         // full corpus total
  top20Total: x.total,               // top 20 sure içi
}));

// Matrix'i de yeni sıraya göre kaydır
const reorderedMatrix = matrix.map(row =>
  namesSorted.map(x => row[x.ni])
);

console.log('\nTop 20 içi sıra (desc):');
namesSorted.forEach((x, i) => console.log(`  ${(i+1).toString().padStart(2)}. ${x.isim.padEnd(12)} ${x.total}`));

const result = {
  names: reorderedNames,
  surahs,
  matrix: reorderedMatrix,
  topSurahIndices,
  methodology: {
    tr: "15 en sık Esmâ-i Hüsnâ ismi × 114 sure matrisi. Her hücre: o sureyi sıyıran ismin (stripped form, ال + lām + accusative tanvin esnek) toplam görünümü. Top 20 sure (mushaf sırasında) varsayılan heatmap'te görünür.",
    en: "Matrix of 15 most frequent Beautiful Names × 114 surahs. Each cell: total occurrences of the name (stripped form, flexible al-/lām-/tanwīn) in that surah. Top 20 surahs (in mushaf order) shown by default.",
  },
  generated_at: new Date().toISOString(),
};

writeFileSync(OUT_PATH, JSON.stringify(result, null, 2));
console.log(`[build-surah-name-heatmap] ${OUT_PATH} yazıldı.`);
console.log(`İsimler: ${names.length}, Sureler: ${surahs.length}, Top 20: surah ${topSurahIndices.map(i => i+1).join(', ')}`);
