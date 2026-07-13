#!/usr/bin/env node
// ─── reencode-embeddings.mjs ───────────────────────────────────────────────
// Convert float arrays to binary Float32Array base64 strings.
// Reduces file size from ~279 MB → ~55 MB.
//
// Format:
//   {
//     builtAt: "...",
//     dim: 1024,
//     items: [
//       { id, type, ..., embTr: "base64string", embEn: "base64string" }
//     ]
//   }
//
// Runtime decode:
//   const buf = Buffer.from(item.embTr, 'base64');
//   const arr = new Float32Array(buf.buffer, buf.byteOffset, buf.byteLength / 4);
// ─────────────────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const IN = path.join(ROOT, 'src/lib/corpus-embeddings.json');
const OUT = path.join(ROOT, 'src/lib/corpus-embeddings.json'); // overwrite

if (!fs.existsSync(IN)) {
  console.error(`❌ Not found: ${IN}`);
  process.exit(1);
}

console.log('📖 Loading current embeddings...');
const data = JSON.parse(fs.readFileSync(IN, 'utf8'));
console.log(`   ${data.items?.length || 0} items`);

if (!data.items || !data.items.length) {
  console.error('❌ No items array in file');
  process.exit(1);
}

// Detect: are embeddings already binary?
const sample = data.items[0];
if (typeof sample.embTr === 'string' || typeof sample.embeddingTr === 'string') {
  console.log('⚠  Embeddings already appear to be strings. Skipping.');
  process.exit(0);
}

function toB64(floatArr) {
  if (!floatArr || !Array.isArray(floatArr)) return null;
  const f32 = new Float32Array(floatArr);
  const buf = Buffer.from(f32.buffer);
  return buf.toString('base64');
}

console.log('⚙️  Encoding to binary base64...');
let done = 0;
let totalDim = 0;

const encodedItems = data.items.map(item => {
  const { embeddingTr, embeddingEn, ...rest } = item;
  const embTr = toB64(embeddingTr);
  const embEn = toB64(embeddingEn);
  if (embTr && !totalDim) totalDim = embeddingTr.length;

  done++;
  if (done % 500 === 0) console.log(`   ${done}/${data.items.length}`);
  return { ...rest, embTr, embEn };
});

const output = {
  builtAt: data.builtAt || new Date().toISOString(),
  count: encodedItems.length,
  dim: totalDim,
  format: 'float32-base64',
  items: encodedItems,
};

console.log('💾 Writing...');
fs.writeFileSync(OUT, JSON.stringify(output));

const size = fs.statSync(OUT).size;
console.log(`\n✅ Reencoded`);
console.log(`   File: ${path.relative(ROOT, OUT)}`);
console.log(`   Size: ${(size / 1024 / 1024).toFixed(2)} MB`);
console.log(`   Items: ${encodedItems.length}`);
console.log(`   Dim: ${totalDim}`);
console.log(`   Format: float32-base64`);
