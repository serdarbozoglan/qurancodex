#!/usr/bin/env node
// ─── split-tefsir.mjs ──────────────────────────────────────────────────────
// Faz 2d — Tefsir dual embedding.
// Elmalılı (TR) + İbn Kesîr (EN) per-sure tefsirlerini per-ayet segment'lere
// böler, next/public/tefsir-per-verse.json olarak yazar.
//
// Regex-based ayet marker parse: her sure metninde "N-" formatında ayet
// numarası prefix'leri var (örn: "1- Mushaf-ı şeriflerde..."). Bu marker'lar
// segment boundary olarak kullanılır.
//
// Aynı ayete birden fazla marker olabilir (uzun tefsirde ayeti tekrar
// referans verme) — hepsini birleştirir.
//
// Her segment MAX_WORDS (200) kelimeye truncate edilir → chunk boyutu makul.
//
// Output: next/public/tefsir-per-verse.json
//   { "1:1": { tr: "elmalili text...", en: "ibnkathir text..." }, ... }
// ────────────────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const ELMALILI_DIR = path.join(ROOT, 'public/tafsir/elmalili');
const IBNKATHIR_DIR = path.join(ROOT, 'public/tafsir/ibnkathir-en');
const OUT = path.join(ROOT, 'public/tefsir-per-verse.json');

const MAX_WORDS = 200; // her segment max 200 kelimeye truncate
const MIN_CHARS = 40;  // çok kısa segment'i skip et (muhtemelen boş marker)

// Segment splitter: text içindeki "N-" marker'larına göre parse et,
// aynı ayet için tüm segment'leri BİRLEŞTİRİR.
// matchStart = marker'ın BAŞLANGICI (satırbaşı dahil).
// contentStart = marker'ın SONRASI (segment metni başlangıcı).
function splitByVerse(text) {
  if (!text || typeof text !== 'string') return {};
  const rx = /(?:^|\n)(\d+)-/g;
  const matches = [];
  let m;
  while ((m = rx.exec(text)) !== null) {
    matches.push({
      verse: parseInt(m[1]),
      matchStart: m.index,           // marker'ın başladığı yer
      contentStart: rx.lastIndex,     // marker sonrası — content buradan başlar
    });
  }
  const segments = {}; // verse -> [text1, text2, ...]
  for (let i = 0; i < matches.length; i++) {
    const { verse, contentStart } = matches[i];
    const end = i + 1 < matches.length ? matches[i + 1].matchStart : text.length;
    const raw = text.slice(contentStart, end).trim();
    if (raw.length < 5) continue;
    if (!segments[verse]) segments[verse] = [];
    segments[verse].push(raw);
  }
  // Concatenate + truncate to MAX_WORDS
  const out = {};
  for (const [v, parts] of Object.entries(segments)) {
    const joined = parts.join(' ').replace(/\s+/g, ' ').trim();
    if (joined.length < MIN_CHARS) continue;
    const words = joined.split(/\s+/).slice(0, MAX_WORDS);
    out[v] = words.join(' ');
  }
  return out;
}

// Strip HTML tags for IbnKathir (verses dict values are HTML).
function stripHtml(s) {
  if (!s) return '';
  return String(s)
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

// Truncate to MAX_WORDS.
function truncateWords(text) {
  if (!text) return '';
  const words = text.split(/\s+/).slice(0, MAX_WORDS);
  return words.join(' ');
}

// Elmalılı loader — text is single blob with "N-" verse markers.
async function loadElmaliliDir(dir) {
  if (!fs.existsSync(dir)) return {};
  const files = fs.readdirSync(dir).filter(f => /^\d+\.json$/.test(f));
  const result = {};
  let processed = 0;
  let totalSegs = 0;
  for (const f of files) {
    const surahNum = parseInt(f.replace('.json', ''));
    const raw = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    const text = raw.text || '';
    const segs = splitByVerse(text);
    for (const [v, t] of Object.entries(segs)) {
      result[`${surahNum}:${v}`] = t;
    }
    totalSegs += Object.keys(segs).length;
    processed++;
    if (processed % 20 === 0) process.stdout.write(`\r   ${processed}/${files.length}...`);
  }
  console.log(`\r   ${processed}/${files.length} sure, ${totalSegs} segment          `);
  return result;
}

// IbnKathir loader — verses dict {"1": "<html>...", "2": "..."}
async function loadIbnKathirDir(dir) {
  if (!fs.existsSync(dir)) return {};
  const files = fs.readdirSync(dir).filter(f => /^\d+\.json$/.test(f));
  const result = {};
  let processed = 0;
  let totalSegs = 0;
  for (const f of files) {
    const surahNum = parseInt(f.replace('.json', ''));
    const raw = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    const versesDict = raw.verses || {};
    for (const [v, html] of Object.entries(versesDict)) {
      const plain = stripHtml(html);
      if (plain.length < MIN_CHARS) continue;
      const truncated = truncateWords(plain);
      result[`${surahNum}:${v}`] = truncated;
      totalSegs++;
    }
    processed++;
    if (processed % 20 === 0) process.stdout.write(`\r   ${processed}/${files.length}...`);
  }
  console.log(`\r   ${processed}/${files.length} sure, ${totalSegs} segment          `);
  return result;
}

console.log('📖 Elmalılı (TR) tefsir loading...');
const elmalili = await loadElmaliliDir(ELMALILI_DIR);
console.log(`   Segments: ${Object.keys(elmalili).length}`);

console.log('\n📖 İbn Kesîr (EN) tefsir loading...');
const ibnkathir = await loadIbnKathirDir(IBNKATHIR_DIR);
console.log(`   Segments: ${Object.keys(ibnkathir).length}`);

// Merge into unified structure
const merged = {};
const allKeys = new Set([...Object.keys(elmalili), ...Object.keys(ibnkathir)]);
for (const k of allKeys) {
  merged[k] = {
    tr: elmalili[k] || '',
    en: ibnkathir[k] || '',
  };
}

fs.writeFileSync(OUT, JSON.stringify(merged));
const sizeMb = (fs.statSync(OUT).size / 1024 / 1024).toFixed(2);

console.log(`\n📊 Sanity:`);
console.log(`   Total keys: ${Object.keys(merged).length}`);
console.log(`   With BOTH tr and en: ${Object.values(merged).filter(v => v.tr && v.en).length}`);
console.log(`   TR only: ${Object.values(merged).filter(v => v.tr && !v.en).length}`);
console.log(`   EN only: ${Object.values(merged).filter(v => !v.tr && v.en).length}`);
console.log(`\n✅ Written: ${path.relative(ROOT, OUT)} (${sizeMb} MB)`);
