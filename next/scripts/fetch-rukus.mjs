#!/usr/bin/env node
// ─── fetch-rukus.mjs ───────────────────────────────────────────────────────
// Faz 2c-E — Ruku (pericope) baseline data.
// api.alquran.cloud/v1/meta'dan 556 ruku başlangıç noktasını alır, next
// ruku'nun başlangıcı ile end verse'i hesaplar, next/public/rukus.json'a
// yazar.
//
// Her ruku = { start: {surah, ayah}, end: {surah, ayah}, verses: ["s:a", ...] }
// ────────────────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'public/rukus.json');
const SURAH_VERSE_COUNTS_PATH = path.join(ROOT, 'public/verse-graph-bgem3.json');

console.log('📥 Fetching ruku metadata from api.alquran.cloud...');
const res = await fetch('https://api.alquran.cloud/v1/meta');
if (!res.ok) throw new Error(`HTTP ${res.status}`);
const data = await res.json();
const refs = data?.data?.rukus?.references || [];
console.log(`   ${refs.length} ruku start points`);

// Sure başına ayet sayısı gerekli (last ruku end hesabı için).
console.log('\n📖 Building surah verse count index...');
const versesRaw = JSON.parse(fs.readFileSync(SURAH_VERSE_COUNTS_PATH, 'utf8'));
const versesArr = Array.isArray(versesRaw) ? versesRaw : Object.values(versesRaw);
const surahMaxAyah = {};
for (const v of versesArr) {
  surahMaxAyah[v.surah] = Math.max(surahMaxAyah[v.surah] || 0, v.ayah);
}
console.log(`   ${Object.keys(surahMaxAyah).length} sure indexed`);

// Build ruku objects with computed end.
const rukus = [];
for (let i = 0; i < refs.length; i++) {
  const start = refs[i];
  const nextStart = refs[i + 1];
  let end;
  if (!nextStart) {
    // Last ruku — end at last ayah of same surah
    end = { surah: start.surah, ayah: surahMaxAyah[start.surah] || start.ayah };
  } else if (nextStart.surah === start.surah) {
    end = { surah: start.surah, ayah: nextStart.ayah - 1 };
  } else {
    // Ruku spans to end of surah
    end = { surah: start.surah, ayah: surahMaxAyah[start.surah] || start.ayah };
  }
  const verses = [];
  for (let a = start.ayah; a <= end.ayah; a++) {
    verses.push(`${start.surah}:${a}`);
  }
  rukus.push({
    index: i + 1,
    start,
    end,
    verses,
    verseCount: verses.length,
  });
}

// Sanity
const shortRukus = rukus.filter(r => r.verseCount < 1);
if (shortRukus.length) console.warn(`⚠  ${shortRukus.length} short rukus (< 1 verse)`);

const longRukus = rukus.filter(r => r.verseCount > 30);
console.log(`\n📊 Sanity:`);
console.log(`   Total rukus: ${rukus.length}`);
console.log(`   Long rukus (>30 verses): ${longRukus.length}`);
console.log(`   Avg verses per ruku: ${(rukus.reduce((s, r) => s + r.verseCount, 0) / rukus.length).toFixed(1)}`);
console.log(`   Min: ${Math.min(...rukus.map(r => r.verseCount))}, Max: ${Math.max(...rukus.map(r => r.verseCount))}`);

fs.writeFileSync(OUT, JSON.stringify(rukus, null, 0));
const sizeKb = (fs.statSync(OUT).size / 1024).toFixed(1);
console.log(`\n✅ Written: ${path.relative(ROOT, OUT)} (${sizeKb} KB)`);
