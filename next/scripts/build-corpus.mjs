#!/usr/bin/env node
// ─── build-corpus.mjs ────────────────────────────────────────────────────────
// Content sources'ları scan eder, unified corpus JSON üretir.
// Her item için deterministik hash hesaplar (SHA256).
//
// Usage:
//   node scripts/build-corpus.mjs           — corpus.raw.json üret
//   node scripts/build-corpus.mjs --stats   — sadece istatistik yazdır
//
// Output:
//   src/lib/corpus-raw.json  — embedding'siz ham corpus (~2 MB)
// ─────────────────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { CONTENT_SOURCES, TOOL_CATALOG } from './corpus-sources.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'src/lib/corpus-raw.json');

const args = process.argv.slice(2);
const statsOnly = args.includes('--stats');

// ── Hash: text + metadata → deterministik SHA256
function itemHash(item) {
  const key = [
    item.searchTextTr || '',
    item.searchTextEn || '',
    item.type,
    item.id,
  ].join('|');
  return crypto.createHash('sha256').update(key).digest('hex').slice(0, 16);
}

// ── File source: single JSON file
function loadFileSource(source) {
  const filePath = path.join(ROOT, source.file);
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠  Skip ${source.type}: ${source.file} not found`);
    return [];
  }
  const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const rawItems = source.extract ? source.extract(raw) : raw;
  return (rawItems || []).map(source.buildItem).filter(Boolean);
}

// ── Directory source: multiple JSON files matching pattern
function loadDirSource(source) {
  const dirPath = path.join(ROOT, source.dir);
  if (!fs.existsSync(dirPath)) {
    console.warn(`⚠  Skip ${source.type}: ${source.dir} not found`);
    return [];
  }
  const files = fs.readdirSync(dirPath).filter(f => {
    if (source.exclude?.includes(f)) return false;
    if (source.pattern instanceof RegExp) return source.pattern.test(f);
    return f.endsWith('.json');
  });
  return files.map(f => {
    try {
      const raw = JSON.parse(fs.readFileSync(path.join(dirPath, f), 'utf8'));
      return source.buildItem(raw);
    } catch (err) {
      console.warn(`⚠  Failed to parse ${f}: ${err.message}`);
      return null;
    }
  }).filter(Boolean);
}

// ── Tool catalog → items
function loadToolCatalog() {
  return TOOL_CATALOG.map(t => ({
    id: `tool:${t.route}`,
    type: 'tool',
    route: t.route,
    titleTr: t.titleTr,
    titleEn: t.titleEn,
    descTr: t.descTr,
    descEn: t.descEn,
    keywords: t.keywords || [],
    searchTextTr: `${t.titleTr}. ${t.descTr} ${(t.keywords || []).join(' ')}`,
    searchTextEn: `${t.titleEn}. ${t.descEn} ${(t.keywords || []).join(' ')}`,
  }));
}

// ── Main
console.log('📖 Building corpus...\n');

const corpus = [];
const stats = {};

for (const source of CONTENT_SOURCES) {
  const items = source.file ? loadFileSource(source) : loadDirSource(source);
  const withHash = items.map(item => ({ ...item, hash: itemHash(item) }));
  corpus.push(...withHash);
  stats[source.type] = withHash.length;
  console.log(`   ✓ ${source.type.padEnd(20)} → ${String(withHash.length).padStart(5)} items`);
}

// Tool catalog
const tools = loadToolCatalog().map(item => ({ ...item, hash: itemHash(item) }));
corpus.push(...tools);
stats.tool = tools.length;
console.log(`   ✓ ${'tool'.padEnd(20)} → ${String(tools.length).padStart(5)} items`);

console.log(`\n   Total: ${corpus.length} items`);
console.log(`\n📊 Breakdown by type:`);
for (const [k, v] of Object.entries(stats).sort((a, b) => b[1] - a[1])) {
  console.log(`   ${k.padEnd(20)} ${v}`);
}

if (statsOnly) {
  console.log('\n🔍 Stats-only mode, exiting.');
  process.exit(0);
}

// ── Duplicate ID check
const idSet = new Set();
const dupes = [];
for (const item of corpus) {
  if (idSet.has(item.id)) dupes.push(item.id);
  idSet.add(item.id);
}
if (dupes.length > 0) {
  console.error(`\n❌ Duplicate IDs found: ${dupes.slice(0, 10).join(', ')}${dupes.length > 10 ? '...' : ''}`);
  process.exit(1);
}

// ── Sanity: minimum text length
const shortItems = corpus.filter(item => (item.searchTextTr || '').length < 10 && (item.searchTextEn || '').length < 10);
if (shortItems.length > 0) {
  console.warn(`\n⚠  ${shortItems.length} items with short search text (< 10 char):`);
  shortItems.slice(0, 5).forEach(i => console.warn(`   ${i.id}: tr="${(i.searchTextTr || '').slice(0, 40)}"`));
}

// ── Write
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(corpus, null, 0));

const size = fs.statSync(OUT).size;
console.log(`\n✅ Corpus written`);
console.log(`   File: ${path.relative(ROOT, OUT)}`);
console.log(`   Size: ${(size / 1024 / 1024).toFixed(2)} MB`);
console.log(`   Items: ${corpus.length}`);
