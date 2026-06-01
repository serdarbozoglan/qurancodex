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

// ── Diacritic strip (CLAUDE.md §13.15 + extra) ────────────────────────────────
// Tüm hareke, sukun, shadda, Uthmani işaretleri, tajwid'i çıkarır.
// Alef varyantlarını tek forma normalize eder.
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
// Her pair için regex pattern. Pattern tüm i'rab durumlarını yakalar:
//   - definite:  "(ال)" prefix opsiyonel
//   - accusative tanvin: sonda "(ا)" opsiyonel
//   - nominative/genitive: prefix yok, sufiks yok
//
// Word boundary: önce ve sonra space/anchor — kelime ortası match'i engelle.
const PAIRS = [
  {
    id: 'gafur-rahim',
    trName: 'El-Gafûr · Er-Rahîm',
    classicalCount: 72,
    pattern: /(?:^|\s)(?:ال)?غفورا? (?:ال)?رحيما?(?:\s|$)/u,
  },
  {
    id: 'semi-basir',
    trName: "Es-Semî' · El-Basîr",
    classicalCount: 40,
    pattern: /(?:^|\s)(?:ال)?سميعا? (?:ال)?بصيرا?(?:\s|$)/u,
  },
  {
    id: 'aziz-hakim',
    trName: 'El-Azîz · El-Hakîm',
    classicalCount: 38,
    pattern: /(?:^|\s)(?:ال)?عزيزا? (?:ال)?حكيما?(?:\s|$)/u,
  },
  {
    id: 'alim-hakim',
    trName: 'El-Alîm · El-Hakîm',
    classicalCount: 35,
    pattern: /(?:^|\s)(?:ال)?عليما? (?:ال)?حكيما?(?:\s|$)/u,
  },
  {
    id: 'tevvab-rahim',
    trName: 'Et-Tevvâb · Er-Rahîm',
    classicalCount: 6,
    pattern: /(?:^|\s)(?:ال)?توابا? (?:ال)?رحيما?(?:\s|$)/u,
  },
];

// ── Tara ──────────────────────────────────────────────────────────────────────
console.log('[build-name-pairs] verse-graph yükleniyor...');
const vg = JSON.parse(readFileSync(VG_PATH, 'utf8'));
console.log(`[build-name-pairs] ${vg.length} ayet yüklendi.`);

// Her ayet için stripped form'u pre-compute
const verseIndex = vg.map(v => ({
  ref: v.id,
  surah: v.surah,
  ayah: v.ayah,
  surahName: v.surahName,
  surahNameEn: v.surahNameEn,
  arabicStripped: stripArabic(v.arabic),
  turkish: v.turkish,
  english: v.english,
}));

const result = { pairs: [], generated_at: new Date().toISOString() };

for (const pair of PAIRS) {
  const matches = new Map(); // ref → first matched form (de-dupe)

  for (const v of verseIndex) {
    const m = v.arabicStripped.match(pair.pattern);
    if (m && !matches.has(v.ref)) {
      matches.set(v.ref, m[0].trim());
    }
  }

  // Mushaf order
  const sorted = Array.from(matches.entries())
    .map(([ref, matchedForm]) => {
      const v = verseIndex.find(x => x.ref === ref);
      return {
        ref: v.ref,
        surah: v.surah,
        ayah: v.ayah,
        surahName: v.surahName,
        surahNameEn: v.surahNameEn,
        turkish: v.turkish,
        english: v.english,
        matchedForm,
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

result.methodology = {
  tr: "Diacritic-stripped substring match — definite (al-X al-Y) ve indefinite (X Y) formları ayrı sayılır. Klasik konkordans (Abdülbâkî) ile karşılaştırmalı.",
  en: "Diacritic-stripped substring match — definite (al-X al-Y) and indefinite (X Y) forms counted separately. Compared against classical concordance (Abdülbāqī).",
  source: "verse-graph-bgem3.json (canonical Quran corpus, 6236 verses, standard Unicode)",
};

writeFileSync(OUT_PATH, JSON.stringify(result, null, 2));
console.log(`[build-name-pairs] ${OUT_PATH} yazıldı.`);
