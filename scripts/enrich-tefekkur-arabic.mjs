// scripts/enrich-tefekkur-arabic.mjs
//
// Tefekkür makalelerindeki her verseInline bloğuna `ar` field'ı inject eder.
// Veri kaynağı: next/public/verse-graph-bgem3.json
// Normalize: CLAUDE.md §13.15 cleanArabicForDisplay (KFGQPC-uyumlu).
//
// Range ref (örn. "96:6-7"): ilk ayet alınır (range hint için VerseInline'da
// rangeRefSuffix UI'ı gösterilebilir, ama Arapça olarak sadece ilk ayet inject).
//
// Manuel override koruma: Eğer bloğun zaten `ar` field'ı varsa DOKUNMA.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const GRAPH_PATH = path.join(ROOT, 'next/public/verse-graph-bgem3.json');
const TEFEKKUR_DIR = path.join(ROOT, 'next/public/tefekkur');

// §13.15 cleanArabicForDisplay — KFGQPC-uyumlu normalizasyon.
// next/src/lib/arabic.js'in birebir port'u (ES module bağlamında inline).
function cleanArabicForDisplay(str) {
  if (!str || typeof str !== 'string') return str;
  return str
    .replace(/۪/g, 'ِ')   // U+06EA → U+0650 (KRİTİK — bu olmazsa KFGQPC daire render eder)
    .replace(/ۡ/g, 'ْ')   // U+06E1 Uthmani sukun → U+0652 standart sukun
    .replace(/[ً-ْ]ٓ/gu, 'ٓ')  // §13.14 maddah fix
    .replace(/ٱ/g, 'ا')   // U+0671 Alef wasla → U+0627 düz alef
    .replace(/ی/g, 'ي')   // Farsi yeh → Arabic yeh
    .replace(/[ؐ-ؔؖؗ]/g, '')        // İslami kısaltma işaretleri
    .replace(/[؀-؅]/g, '')                    // Numara/dipnot
    .replace(/[۝۞۩]/g, '')               // ayet sonu, rub el hizb, secde
    .replace(/ۦ/g, ' ')                            // small yeh → boşluk
    .replace(/[ۖ-ۜۢۨ]/g, '')  // waqf + dekoratif tajwid
    .replace(/[﴾﴿]/g, '');                    // süslü parantezler
}

// "2:255" veya "96:6-7" → "2:255" (ilk ayet ref).
function firstRefOf(ref) {
  if (!ref) return null;
  const m = /^(\d+):(\d+)/.exec(ref.trim());
  if (!m) return null;
  return `${m[1]}:${m[2]}`;
}

// Range ref'i mi? ("96:6-7" → true, "2:255" → false)
function isRange(ref) {
  return /^\d+:\d+[-–]\d+/.test(ref || '');
}

console.log('[enrich] Loading verse-graph-bgem3.json (~12 MB)...');
const graphRaw = fs.readFileSync(GRAPH_PATH, 'utf-8');
const graph = JSON.parse(graphRaw);
console.log(`[enrich] Graph loaded: ${graph.length} verses`);

const byId = new Map();
for (const v of graph) {
  byId.set(v.id, v.arabic);
}

const files = fs.readdirSync(TEFEKKUR_DIR)
  .filter(f => f.endsWith('.json') && f !== '_index.json')
  .sort();

console.log(`[enrich] Processing ${files.length} article JSONs\n`);

let totalBlocks = 0;
let injected = 0;
let skipped = 0;       // Already has `ar` (manual override)
let missing = 0;       // Ref not found in graph
const missingRefs = [];
const fileStats = [];

for (const file of files) {
  const filePath = path.join(TEFEKKUR_DIR, file);
  const article = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  if (!Array.isArray(article.blocks)) {
    console.log(`[enrich] ${file} — no blocks[] array, skipping`);
    continue;
  }

  let fileInjected = 0;
  let fileSkipped = 0;
  let fileMissing = 0;

  for (const block of article.blocks) {
    if (block.type !== 'verseInline') continue;
    totalBlocks++;

    if (block.ar) {
      // Manuel override koruma
      skipped++;
      fileSkipped++;
      continue;
    }

    const firstRef = firstRefOf(block.ref);
    if (!firstRef) {
      console.warn(`  ⚠ ${file}: invalid ref "${block.ref}"`);
      missing++;
      fileMissing++;
      missingRefs.push(`${file}: ${block.ref}`);
      continue;
    }

    const rawArabic = byId.get(firstRef);
    if (!rawArabic) {
      console.warn(`  ⚠ ${file}: ref "${block.ref}" → "${firstRef}" not in graph`);
      missing++;
      fileMissing++;
      missingRefs.push(`${file}: ${block.ref}`);
      continue;
    }

    block.ar = cleanArabicForDisplay(rawArabic);
    if (isRange(block.ref)) {
      block.isRange = true;  // VerseInline "ve devamı" hint'i için
    }
    injected++;
    fileInjected++;
  }

  if (fileInjected + fileSkipped + fileMissing > 0) {
    fileStats.push({ file, injected: fileInjected, skipped: fileSkipped, missing: fileMissing });
    fs.writeFileSync(filePath, JSON.stringify(article, null, 2) + '\n', 'utf-8');
  }
}

console.log('\n[enrich] ─ Per file ──────────────────────');
for (const s of fileStats) {
  const parts = [];
  if (s.injected) parts.push(`+${s.injected}`);
  if (s.skipped) parts.push(`skip ${s.skipped}`);
  if (s.missing) parts.push(`miss ${s.missing}`);
  console.log(`  ${s.file.padEnd(40)} ${parts.join(', ')}`);
}

console.log('\n[enrich] ─ Summary ──────────────────────');
console.log(`  Total verseInline blocks  : ${totalBlocks}`);
console.log(`  Injected (new ar field)   : ${injected}`);
console.log(`  Skipped (already had ar)  : ${skipped}`);
console.log(`  Missing (ref not in graph): ${missing}`);

if (missingRefs.length > 0) {
  console.log('\n[enrich] Missing refs:');
  for (const m of missingRefs) console.log(`  - ${m}`);
}

console.log('\n[enrich] Done.');
