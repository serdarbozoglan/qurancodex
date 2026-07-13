#!/usr/bin/env node
// ─── fetch-meals-multi.mjs ──────────────────────────────────────────────────
// Faz 2a — Multi-vector 3-meal fetch pipeline.
// api.acikkuran.com'dan 3 TR + 3 EN meal çeker, tek JSON'a yazar.
//
// Authors (acikkuran ID'leri):
//   TR: 26 Suat Yıldırım · 6 Ali Bulaç · 11 Diyanet İşleri
//   EN: 32 Sahih International · 2 Abdullah Yusuf Ali · 9 Muhammad Asad
//
// Output:
//   next/public/meals-multi.json
//   Şeması: { "1:1": { tr: { suatYildirim, aliBulac, diyanet }, en: { sahih, yusufAli, asad } }, ... }
//
// Usage:
//   node scripts/fetch-meals-multi.mjs           — full fetch (114 sure × 6 author)
//   node scripts/fetch-meals-multi.mjs --resume  — skip already-fetched sure/author combos
//   node scripts/fetch-meals-multi.mjs --author=26 — sadece tek author
// ────────────────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { setTimeout as sleep } from 'node:timers/promises';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'public/meals-multi.json');

const args = process.argv.slice(2);
const resume = args.includes('--resume');
const singleAuthor = args.find(a => a.startsWith('--author='))?.split('=')[1];

const AUTHORS = [
  { id: 26, lang: 'tr', key: 'suatYildirim', name: 'Suat Yıldırım' },
  { id: 6,  lang: 'tr', key: 'aliBulac',     name: 'Ali Bulaç' },
  { id: 11, lang: 'tr', key: 'diyanet',      name: 'Diyanet İşleri' },
  { id: 32, lang: 'en', key: 'sahih',        name: 'Sahih International' },
  { id: 2,  lang: 'en', key: 'yusufAli',     name: 'Abdullah Yusuf Ali' },
  { id: 9,  lang: 'en', key: 'asad',         name: 'Muhammad Asad' },
];

const API = 'https://api.acikkuran.com';
const REQUEST_DELAY_MS = 250; // rate-limit safety
const MAX_RETRIES = 3;

async function fetchSurah(surahNum, authorId) {
  const url = `${API}/surah/${surahNum}?author=${authorId}`;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const verses = data?.data?.verses;
      if (!Array.isArray(verses)) throw new Error(`bad shape: ${JSON.stringify(data).slice(0, 200)}`);
      return verses;
    } catch (err) {
      if (attempt === MAX_RETRIES) throw err;
      const wait = 1500 * attempt;
      console.warn(`   ⚠  surah ${surahNum} author ${authorId} attempt ${attempt} failed: ${err.message}. wait ${wait}ms`);
      await sleep(wait);
    }
  }
}

async function fetchAuthorAll(author) {
  const out = {}; // { "surah:ayah": text }
  for (let s = 1; s <= 114; s++) {
    try {
      const verses = await fetchSurah(s, author.id);
      for (const v of verses) {
        const key = `${s}:${v.verse_number}`;
        out[key] = v.translation?.text || '';
      }
      const ratio = ((s / 114) * 100).toFixed(1);
      process.stdout.write(`\r   [${author.key.padEnd(14)}] sure ${String(s).padStart(3)}/114 (${ratio}%)   `);
    } catch (err) {
      console.error(`\n   ❌ ${author.key} sure ${s}: ${err.message}`);
      throw err;
    }
    await sleep(REQUEST_DELAY_MS);
  }
  console.log(''); // newline after progress
  return out;
}

// ── Load existing (resume)
let existing = {};
if (resume && fs.existsSync(OUT)) {
  existing = JSON.parse(fs.readFileSync(OUT, 'utf8'));
  console.log(`📋 Resume: mevcut ${Object.keys(existing).length} verse key yüklendi`);
}

// ── Fetch loop
const dataByAuthor = {}; // { key: { surahAyah: text } }
const authorsToFetch = singleAuthor ? AUTHORS.filter(a => String(a.id) === singleAuthor) : AUTHORS;

console.log(`🚀 Fetching ${authorsToFetch.length} author(s) × 114 sure = ${authorsToFetch.length * 114} request`);

for (const author of authorsToFetch) {
  console.log(`\n📥 ${author.name} (id=${author.id}, ${author.lang})`);
  // Resume: eğer bu author için tüm 6236 verse'te data varsa skip
  if (resume) {
    let existingCount = 0;
    for (const key of Object.keys(existing)) {
      if (existing[key]?.[author.lang]?.[author.key]) existingCount++;
    }
    if (existingCount >= 6200) {
      console.log(`   ⏭  Already have ${existingCount}/6236 for ${author.key}, skipping`);
      dataByAuthor[author.key] = null; // marker: skip merge
      continue;
    }
  }
  dataByAuthor[author.key] = await fetchAuthorAll(author);
}

// ── Merge into single output structure
console.log(`\n🔀 Merging into ${OUT}...`);
const merged = { ...existing };
for (const author of authorsToFetch) {
  const authorData = dataByAuthor[author.key];
  if (!authorData) continue;
  for (const [key, text] of Object.entries(authorData)) {
    if (!merged[key]) merged[key] = { tr: {}, en: {} };
    if (!merged[key][author.lang]) merged[key][author.lang] = {};
    merged[key][author.lang][author.key] = text;
  }
}

// ── Sanity
const totalKeys = Object.keys(merged).length;
const withAllAuthors = Object.entries(merged).filter(([_, v]) => {
  const trAll = v.tr && Object.keys(v.tr).length === 3;
  const enAll = v.en && Object.keys(v.en).length === 3;
  return trAll && enAll;
}).length;

console.log(`\n📊 Sanity:`);
console.log(`   Total verses: ${totalKeys}`);
console.log(`   With all 6 authors: ${withAllAuthors}`);

fs.writeFileSync(OUT, JSON.stringify(merged));
const sizeMb = (fs.statSync(OUT).size / 1024 / 1024).toFixed(2);
console.log(`\n✅ Written: ${path.relative(ROOT, OUT)} (${sizeMb} MB)`);
