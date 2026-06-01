#!/usr/bin/env node
// ─── build-name-pairs.mjs ─────────────────────────────────────────────────────
// EsmaFrekans Section 5 "İsim Çiftleri" için ardışık geçen isim pair'lerini
// verse-graph-bgem3.json üzerinden tarar ve doğrulanmış ayet referanslarını
// üretir.
//
// Output: next/public/esma-pairs-ayetler.json
// Şema:
//   { pairs: [
//       { id, count, ayetler: [ { ref, surah, ayah, snippet_tr } ] }
//     ],
//     methodology: { ... }
//   }
//
// Matching strategy:
//   1. Diacritic-stripped substring match — surface form esnek
//   2. Definite ("al-X al-Y") VE indefinite ("X Y") formları ayrı sayılır
//   3. Mushaf sırasına göre sıralanır (surah, ayah)
//
// CLAUDE.md §13.15: JSON'a yazılan Arapça yok — sadece TR snippet ve refs.
// ──────────────────────────────────────────────────────────────────────────────

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const VG_PATH = join(ROOT, 'next/public/verse-graph-bgem3.json');
const OUT_PATH = join(ROOT, 'next/public/esma-pairs-ayetler.json');

// ── Display normalization (CLAUDE.md §13.15) ──────────────────────────────────
// KFGQPC font'ta render edilecek Arapça metin için. Stripping değil —
// Uthmani-özel karakterleri (U+06E1, U+0671, U+06EA) standart muadiliyle
// değiştirir; hareke korunur (görsel render düzgün olsun diye).
function cleanArabicForDisplay(str) {
  if (!str) return str;
  return str
    .replace(/۪/g, 'ِ')   // U+06EA → U+0650 (KRİTİK)
    .replace(/ۡ/g, 'ْ')   // U+06E1 → U+0652
    .replace(/[ً-ْ]ٓ/gu, 'ٓ')  // §13.14 maddah fix
    .replace(/ٱ/g, 'ا')   // U+0671 → U+0627
    .replace(/ی/g, 'ي')   // Farsi yeh → Arabic yeh
    .replace(/[ؐ-ؔؖؗ]/g, '')        // İslami kısaltma işaretleri
    .replace(/[؀-؅]/g, '')                    // Numara/dipnot
    .replace(/[۝۞۩]/g, '')               // ayet sonu, rub el hizb, secde
    .replace(/ۦ/g, ' ')                            // small yeh → boşluk
    .replace(/[ۖ-ۜۢۨ]/g, '')  // waqf + dekoratif tajwid
    .replace(/[﴾﴿]/g, '');                    // süslü parantezler
}

// ── Diacritic strip (CLAUDE.md §13.15 + extra) ────────────────────────────────
// Tüm hareke, sukun, shadda, Uthmani işaretleri, tajwid'i çıkarır.
// Alef varyantlarını tek forma normalize eder. Sadece pattern matching için.
function stripArabic(s) {
  if (!s) return '';
  return s
    .replace(/[ً-ْ]/g, '')   // fatha/kasra/damma/sukun/shadda + tanvin
    .replace(/[ٰٓ-ٕ]/g, '') // alef khanjariyya, maddah, hamza marks
    .replace(/[ۖ-ۭ]/g, '')   // Quranic annotation marks
    .replace(/[ؐ-ؚ]/g, '')   // honorific signs
    .replace(/[۪-ۯ]/g, '')   // Uthmani sub/superscript marks
    .replace(/[‌-‏]/g, '')   // ZWJ/ZWNJ/LRM/RLM
    .replace(/[ٱآإأ]/g, 'ا')           // alef variants → bare alef
    .replace(/ى/g, 'ي')                // alif maqsura → ya
    .replace(/ة/g, 'ه')                // ta marbuta → ha
    .replace(/\s+/g, ' ')              // collapse whitespace
    .trim();
}

// ── Pair tanımları ────────────────────────────────────────────────────────────
// Her pair için forward pattern + opsiyonel reverse pattern. Pattern tüm i'rab
// durumlarını yakalar:
//   - lām al-tawkīd:  "ل?" prefix opsiyonel — "لغفور رحيم" gibi emphasis form
//   - definite:       "(ال)?" prefix opsiyonel
//   - vav (wa-):      "و?" prefix ikinci ismi koordine eder
//   - accusative tanvin: sonda "ا?" opsiyonel
//
// allowReverse:
//   true  → "Hakîm Alîm" gibi gerçek pair ters sırada — sayılır
//   false → "Basîr Semî'" 11:24 zıtlık bağlamında, Esma çifti değil — sayılmaz
//
// Pattern factory — DRY: aynı yapı her pair için, kelimeler değişir.
function pairPattern(w1, w2) {
  return new RegExp(`(?:^|\\s)ل?(?:ال)?${w1}ا? و?ل?(?:ال)?${w2}ا?(?:\\s|$)`, 'u');
}

const PAIRS = [
  {
    id: 'gafur-rahim',
    trName: 'El-Gafûr · Er-Rahîm',
    classicalCount: 72,
    patterns: [pairPattern('غفور', 'رحيم'), pairPattern('رحيم', 'غفور')],
  },
  {
    id: 'semi-basir',
    trName: "Es-Semî' · El-Basîr",
    classicalCount: 40,
    // Reverse açılmadı: 11:24 "والبصير والسميع" zıtlık bağlamı, pair değil.
    patterns: [pairPattern('سميع', 'بصير')],
  },
  {
    id: 'aziz-hakim',
    trName: 'El-Azîz · El-Hakîm',
    classicalCount: 38,
    patterns: [pairPattern('عزيز', 'حكيم'), pairPattern('حكيم', 'عزيز')],
  },
  {
    id: 'alim-hakim',
    trName: 'El-Alîm · El-Hakîm',
    classicalCount: 35,
    patterns: [pairPattern('عليم', 'حكيم'), pairPattern('حكيم', 'عليم')],
  },
  {
    id: 'tevvab-rahim',
    trName: 'Et-Tevvâb · Er-Rahîm',
    classicalCount: 6,
    patterns: [pairPattern('تواب', 'رحيم')],
  },
  // ── Genişletilmiş pair set (v2): klasik Esmâ literatüründe iyi bilinen
  // ek çiftler. Allow reverse ise pair anlam taşıyan ters sıra var demek.
  {
    id: 'rauf-rahim',
    trName: 'Er-Raûf · Er-Rahîm',
    classicalCount: null, // klasik sayı doğrulanmayacak, korpus tarama tek kaynak
    // verse-graph'ta Râûf: رَؤُ۫فٌ (silent waw + U+06EB). Strip sonrası "رؤف".
    patterns: [pairPattern('رؤف', 'رحيم'), pairPattern('رحيم', 'رؤف')],
  },
  {
    id: 'vasi-alim',
    trName: "El-Vâsi' · El-Alîm",
    classicalCount: null,
    patterns: [pairPattern('واسع', 'عليم'), pairPattern('عليم', 'واسع')],
  },
  {
    id: 'latif-habir',
    trName: 'El-Latîf · El-Habîr',
    classicalCount: null,
    patterns: [pairPattern('لطيف', 'خبير'), pairPattern('خبير', 'لطيف')],
  },
  {
    id: 'gafur-sekur',
    trName: 'El-Gafûr · Eş-Şekûr',
    classicalCount: null,
    patterns: [pairPattern('غفور', 'شكور'), pairPattern('شكور', 'غفور')],
  },
];

// ── Tara ──────────────────────────────────────────────────────────────────────
console.log('[build-name-pairs] verse-graph yükleniyor...');
const vg = JSON.parse(readFileSync(VG_PATH, 'utf8'));
console.log(`[build-name-pairs] ${vg.length} ayet yüklendi.`);

// Her ayet için stripped form'u pre-compute + display-ready Arabic
const verseIndex = vg.map(v => ({
  ref: v.id,
  surah: v.surah,
  ayah: v.ayah,
  surahName: v.surahName,
  surahNameEn: v.surahNameEn,
  arabic: cleanArabicForDisplay(v.arabic),  // KFGQPC-ready render
  arabicStripped: stripArabic(v.arabic),    // pattern match için
  turkish: v.turkish,
  english: v.english,
}));

const result = { pairs: [], generated_at: new Date().toISOString() };

for (const pair of PAIRS) {
  const matches = new Map(); // ref → first matched form (de-dupe)

  for (const v of verseIndex) {
    for (const pat of pair.patterns) {
      const m = v.arabicStripped.match(pat);
      if (m && !matches.has(v.ref)) {
        matches.set(v.ref, m[0].trim());
        break;
      }
    }
  }

  // Mushaf order + siyak-sibak (ayet içi konum) analizi
  const sorted = Array.from(matches.entries())
    .map(([ref, matchedForm]) => {
      const v = verseIndex.find(x => x.ref === ref);
      // matchedForm'un stripped ayet içindeki konumu:
      // 'end' = son %25 (fâsıla bölgesi), 'middle' = ortada, 'start' = ilk %35
      const idx = v.arabicStripped.indexOf(matchedForm);
      const matchEnd = idx >= 0 ? idx + matchedForm.length : -1;
      const ratio = idx >= 0 ? matchEnd / v.arabicStripped.length : null;
      let position = null;
      if (ratio !== null) {
        if (ratio >= 0.75) position = 'end';
        else if (ratio <= 0.35) position = 'start';
        else position = 'middle';
      }
      return {
        ref: v.ref,
        surah: v.surah,
        ayah: v.ayah,
        surahName: v.surahName,
        surahNameEn: v.surahNameEn,
        arabic: v.arabic,        // display-ready, KFGQPC-uyumlu
        turkish: v.turkish,
        english: v.english,
        matchedForm,
        position,                // 'end' | 'middle' | 'start' | null
        positionRatio: ratio,    // 0..1 — debug/visualization için ham değer
      };
    })
    .sort((a, b) => (a.surah - b.surah) || (a.ayah - b.ayah));

  console.log(`  ${pair.id.padEnd(16)} klasik=${pair.classicalCount}  bulunan=${sorted.length}`);

  result.pairs.push({
    id: pair.id,
    trName: pair.trName,
    classicalCount: pair.classicalCount,
    foundCount: sorted.length,
    ayetler: sorted,
  });
}

// Toplam siyak-sibak istatistiği — fâsıla iddiasının veri doğrulaması
let endCount = 0, midCount = 0, startCount = 0, totalScanned = 0;
for (const p of result.pairs) {
  for (const a of p.ayetler) {
    if (!a.position) continue;
    totalScanned++;
    if (a.position === 'end') endCount++;
    else if (a.position === 'middle') midCount++;
    else if (a.position === 'start') startCount++;
  }
}
result.positionStats = {
  total: totalScanned,
  endCount,
  middleCount: midCount,
  startCount,
  endPercent: totalScanned > 0 ? +(endCount / totalScanned * 100).toFixed(1) : 0,
};

result.methodology = {
  tr: "Diacritic-stripped substring match — definite (al-X al-Y) ve indefinite (X Y) formları ayrı sayılır. Klasik konkordans (Abdülbâkî) ile karşılaştırmalı.",
  en: "Diacritic-stripped substring match — definite (al-X al-Y) and indefinite (X Y) forms counted separately. Compared against classical concordance (Abdülbāqī).",
  source: "verse-graph-bgem3.json (canonical Quran corpus, 6236 verses, standard Unicode)",
};

writeFileSync(OUT_PATH, JSON.stringify(result, null, 2));
console.log(`[build-name-pairs] ${OUT_PATH} yazıldı.`);
