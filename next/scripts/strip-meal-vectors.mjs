#!/usr/bin/env node
// ─── strip-meal-vectors.mjs ────────────────────────────────────────────────
// Vercel 250 MB function limit için multi-vector meal sayısını azaltır.
// Mevcut corpus-embeddings.json'daki verse item'larının embTrArr/embEnArr
// alanlarındaki istenmeyen (whitelist dışı) meal embedding'lerini SİLER.
//
// Sıra korunur (Faz 2a'da: SuatY→AliBulaç→Diyanet için TR, Sahih→YusufAli→Asad EN):
//   TR indexes: 0=suatYildirim, 1=aliBulac, 2=diyanet
//   EN indexes: 0=sahih, 1=yusufAli, 2=asad
//
// Whitelist (2026-07-14):
//   TR keep: [0, 2] (suatYildirim + diyanet)
//   EN keep: [0]    (sahih)
//
// Bu script re-embed yapmaz — sadece mevcut embedding'lerden istenmeyenleri
// çıkarır. Corpus dosyası shrink olur. Manifest güncellemez (hash aynı kalır,
// gelecek build'lerde re-embed tetiklenmez).
//
// Usage:
//   node scripts/strip-meal-vectors.mjs
// ────────────────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const IN = path.join(ROOT, 'src/lib/corpus-embeddings.json');
const OUT = IN; // overwrite

const KEEP_TR_INDEXES = [0, 2]; // suatYildirim + diyanet
const KEEP_EN_INDEXES = [0];    // sahih

console.log('📖 Loading corpus-embeddings.json...');
const raw = JSON.parse(fs.readFileSync(IN, 'utf8'));
const beforeSize = fs.statSync(IN).size;
console.log(`   ${raw.items.length} items, ${(beforeSize / 1024 / 1024).toFixed(2)} MB`);

let stripped = 0;
let trOriginal = 0, trKept = 0;
let enOriginal = 0, enKept = 0;

for (const item of raw.items) {
  if (item.type !== 'verse') continue;
  if (Array.isArray(item.embTrArr)) {
    trOriginal += item.embTrArr.length;
    item.embTrArr = KEEP_TR_INDEXES
      .map(i => item.embTrArr[i])
      .filter(Boolean);
    trKept += item.embTrArr.length;
  }
  if (Array.isArray(item.embEnArr)) {
    enOriginal += item.embEnArr.length;
    item.embEnArr = KEEP_EN_INDEXES
      .map(i => item.embEnArr[i])
      .filter(Boolean);
    enKept += item.embEnArr.length;
  }
  stripped++;
}

console.log(`\n📊 Verse embeddings:`);
console.log(`   TR: ${trOriginal} → ${trKept} (${trOriginal - trKept} removed)`);
console.log(`   EN: ${enOriginal} → ${enKept} (${enOriginal - enKept} removed)`);
console.log(`   Verse items processed: ${stripped}`);

// Write back
fs.writeFileSync(OUT, JSON.stringify(raw));
const afterSize = fs.statSync(OUT).size;
const reduction = ((beforeSize - afterSize) / beforeSize * 100).toFixed(1);
console.log(`\n✅ Written`);
console.log(`   Before: ${(beforeSize / 1024 / 1024).toFixed(2)} MB`);
console.log(`   After:  ${(afterSize / 1024 / 1024).toFixed(2)} MB`);
console.log(`   Reduction: -${reduction}%`);
