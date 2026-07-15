#!/usr/bin/env node
// ─── build-ahiret-yolculugu.mjs ──────────────────────────────────────────────
// ahiret-yolculugu.json içindeki anchor + additional verse referanslarını
// verse-graph-bgem3.json'dan Arapça metinlerle enrich eder + §13.15 normalize
// uygulanır. Çıktı: ahiret-yolculugu.json (in-place update, "arabic" alanları
// eklenir).
//
// Kullanım: node next/scripts/build-ahiret-yolculugu.mjs
// ────────────────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd(), 'next/public');
const TARGET = path.join(ROOT, 'ahiret-yolculugu.json');
const VERSE_GRAPH = path.join(ROOT, 'verse-graph-bgem3.json');

// §13.15 cleanArabicForDisplay — build script inline (ES module port)
// Expanded per Ahiret Yolculuğu visual audit K-02 (2026-07-15): U+06DF-U+06E0
// range added to strip small-high-rounded-zero + small-high-mim-isolated
// (KFGQPC glyph eksikliği → □ tofu).
function cleanArabicForDisplay(str) {
  if (!str) return str;
  return str
    .replace(/۪/g, 'ِ')                      // U+06EA → U+0650 (KRİTİK — KFGQPC daire fix)
    .replace(/ۡ/g, 'ْ')                       // U+06E1 → U+0652
    .replace(/[ً-ْ]ٓ/gu, 'ٓ')                  // §13.14 maddah fix
    .replace(/ٱ/g, 'ا')                       // U+0671 → U+0627
    .replace(/ی/g, 'ي')                       // Farsi yeh → Arabic yeh
    .replace(/[ؐ-ؔؖؗ]/g, '')                  // İslami kısaltma işaretleri
    .replace(/[؀-؅]/g, '')                    // Numara/dipnot
    .replace(/[۝۞۩]/g, '')                    // ayet sonu, rub el hizb, secde
    .replace(/ۦ/g, ' ')                        // small yeh → boşluk
    .replace(/[ؕۖ-ۜ۟-ۭۤۧۨ]/g, '')            // waqf + tajwid + U+06DF-U+06E0 range
    .replace(/[﴾﴿]/g, '');                    // süslü parantezler
}

console.log('[build-ahiret-yolculugu] Reading files...');

const data = JSON.parse(fs.readFileSync(TARGET, 'utf8'));
const graphRaw = JSON.parse(fs.readFileSync(VERSE_GRAPH, 'utf8'));

// Build lookup map: "surah:ayah" → { arabic, english, turkish }
const lookup = new Map();
for (const v of graphRaw) {
  lookup.set(`${v.surah}:${v.ayah}`, v);
}

console.log(`[build-ahiret-yolculugu] Verse lookup ready: ${lookup.size} verses`);

let enriched = 0;
let missing = [];

function enrichRef(ref) {
  if (!ref || typeof ref.surah !== 'number' || typeof ref.ayah !== 'number') return ref;
  const key = `${ref.surah}:${ref.ayah}`;
  const v = lookup.get(key);
  if (!v) {
    missing.push(key);
    return ref;
  }
  ref.arabic = cleanArabicForDisplay(v.arabic);
  ref.surahName = v.surahName;
  ref.surahNameEn = v.surahNameEn;
  enriched++;
  return ref;
}

// Enrich each stage
for (const stage of data.stages) {
  // Anchor verse
  if (stage.anchorVerseRef) {
    const enrichedRef = enrichRef({ ...stage.anchorVerseRef });
    stage.anchorVerseRef = enrichedRef;
  }

  // Additional refs
  if (Array.isArray(stage.additionalRefs)) {
    stage.additionalRefs = stage.additionalRefs.map(r => enrichRef({ ...r }));
  }
}

// Verify §13.15: no problem characters left
const PROBLEM_CHARS = ['۪', 'ۡ', 'ٱ', 'ی', '۝', '۞', '۩', 'ۖ', 'ۗ', 'ۘ', 'ۙ', 'ۚ', 'ۛ', 'ۜ'];
let problems = 0;
function walk(o) {
  if (typeof o === 'string') {
    for (const c of PROBLEM_CHARS) if (o.includes(c)) problems++;
  } else if (Array.isArray(o)) {
    o.forEach(walk);
  } else if (o && typeof o === 'object') {
    Object.values(o).forEach(walk);
  }
}
walk(data);

fs.writeFileSync(TARGET, JSON.stringify(data, null, 2) + '\n');

console.log(`[build-ahiret-yolculugu] ✅ Enriched: ${enriched} refs`);
if (missing.length) {
  console.warn(`[build-ahiret-yolculugu] ⚠ Missing verses (${missing.length}):`, missing);
}
console.log(`[build-ahiret-yolculugu] §13.15 problem chars: ${problems}`);
console.log(`[build-ahiret-yolculugu] Output: ${TARGET}`);

if (problems > 0) {
  console.error('[build-ahiret-yolculugu] ❌ Problem chars detected — normalize failed');
  process.exit(1);
}
