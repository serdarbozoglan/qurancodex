#!/usr/bin/env node
// ─── build-embeddings.mjs ───────────────────────────────────────────────────
// DeepInfra BGE-M3 API ile corpus item'ları embed eder.
// Manifest-based incremental: sadece yeni veya değişmiş item'ları embed eder.
//
// Usage:
//   node scripts/build-embeddings.mjs             — incremental embed
//   node scripts/build-embeddings.mjs --check-only — sadece kontrol, embed yapma
//   node scripts/build-embeddings.mjs --force     — tüm item'ları yeniden embed
//
// Inputs:
//   src/lib/corpus-raw.json      — build-corpus.mjs çıktısı
//   src/lib/corpus-manifest.json — mevcut manifest (varsa)
//   .env.local: DEEPINFRA_API_KEY
//
// Outputs:
//   src/lib/corpus-embeddings.json  — item'lar + embedding'ler (~35 MB)
//   src/lib/corpus-manifest.json    — hash-based tracking
// ─────────────────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CORPUS_RAW = path.join(ROOT, 'src/lib/corpus-raw.json');
const MANIFEST = path.join(ROOT, 'src/lib/corpus-manifest.json');
const OUT = path.join(ROOT, 'src/lib/corpus-embeddings.json');

const args = process.argv.slice(2);
const checkOnly = args.includes('--check-only');
const force = args.includes('--force');

// ── Env
function loadEnv() {
  const envPath = path.join(ROOT, '.env.local');
  if (!fs.existsSync(envPath)) return;
  const raw = fs.readFileSync(envPath, 'utf8');
  for (const line of raw.split('\n')) {
    const m = line.match(/^([A-Z_]+)=(.+)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
  }
}
loadEnv();

const API_KEY = process.env.DEEPINFRA_API_KEY;
if (!API_KEY && !checkOnly) {
  console.error('❌ DEEPINFRA_API_KEY not found in .env.local or environment');
  process.exit(1);
}

// ── DeepInfra BGE-M3 API
const DEEPINFRA_URL = 'https://api.deepinfra.com/v1/inference/BAAI/bge-m3';
const BATCH_SIZE = 96; // BGE-M3 supports large batches; 96 is a safe balance

async function embedBatch(texts, retries = 3) {
  const body = { inputs: texts };
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(DEEPINFRA_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}: ${text.slice(0, 200)}`);
      }
      const data = await res.json();
      // DeepInfra BGE-M3 response: { embeddings: [[...], [...], ...] }
      if (!data.embeddings || !Array.isArray(data.embeddings)) {
        throw new Error(`Unexpected response shape: ${JSON.stringify(data).slice(0, 200)}`);
      }
      return data.embeddings;
    } catch (err) {
      if (attempt === retries) throw err;
      const wait = 1000 * attempt;
      console.warn(`   ⚠  Attempt ${attempt}/${retries} failed: ${err.message}. Retry in ${wait}ms...`);
      await new Promise(r => setTimeout(r, wait));
    }
  }
}

// ── Load corpus + manifest
if (!fs.existsSync(CORPUS_RAW)) {
  console.error(`❌ Corpus not found: ${CORPUS_RAW}\n   Run: node scripts/build-corpus.mjs`);
  process.exit(1);
}
const corpus = JSON.parse(fs.readFileSync(CORPUS_RAW, 'utf8'));
console.log(`📖 Loaded corpus: ${corpus.length} items`);

let manifest = {};
// Manifest yalnızca corpus-embeddings.json da varsa güvenli.
// Vercel build'de manifest git'te var ama corpus.json .gitignore'da → yok.
// O durumda manifest'i skip → full rebuild.
const corpusExists = fs.existsSync(OUT);
if (fs.existsSync(MANIFEST) && !force && corpusExists) {
  manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
  console.log(`📋 Loaded manifest: ${Object.keys(manifest).length} known items`);
} else if (!corpusExists) {
  console.log(`📋 Manifest skipped (corpus-embeddings.json missing → full rebuild)`);
}

// ── Diff: new + changed items
const toEmbed = [];
const unchanged = [];
for (const item of corpus) {
  const known = manifest[item.id];
  if (!known || known.hash !== item.hash) {
    toEmbed.push(item);
  } else {
    unchanged.push(item.id);
  }
}

console.log(`\n🔍 Detection:`);
console.log(`   → New/changed: ${toEmbed.length}`);
console.log(`   → Unchanged:   ${unchanged.length}`);

// NOTE: "nothing to embed" early-exit taşındı — aşağıda `embeddings` variable
// initialize edildikten SONRA çalışıyor. Corpus metadata refresh için embed
// cache gerekli.

if (checkOnly) {
  console.log(`\n⚠  Check-only mode. ${toEmbed.length} items need embedding.`);
  console.log(`   Sample:`);
  toEmbed.slice(0, 5).forEach(item => console.log(`   - ${item.id}`));
  process.exit(1);
}

// ── Embed in batches
console.log(`\n⚙️  Embedding ${toEmbed.length} items × 2 languages...`);
console.log(`   Batch size: ${BATCH_SIZE}`);

const embeddings = {}; // { itemId: { embeddingTr: [...], embeddingEn: [...] } }

// ── Base64 → float array (for reencoded format)
function b64ToArr(b64) {
  const buf = Buffer.from(b64, 'base64');
  return Array.from(new Float32Array(buf.buffer, buf.byteOffset, buf.byteLength / 4));
}

// Load existing embeddings if OUT exists (handles both raw and reencoded formats)
if (fs.existsSync(OUT) && !force) {
  const existing = JSON.parse(fs.readFileSync(OUT, 'utf8'));
  const isReencoded = existing.format === 'float32-base64';
  for (const item of existing.items || []) {
    const tr = item.embeddingTr || (isReencoded && item.embTr ? b64ToArr(item.embTr) : null);
    const en = item.embeddingEn || (isReencoded && item.embEn ? b64ToArr(item.embEn) : null);
    if (tr && en) {
      embeddings[item.id] = { embeddingTr: tr, embeddingEn: en };
    }
  }
  console.log(`   Reused ${Object.keys(embeddings).length} existing embeddings (${isReencoded ? 'from base64' : 'from raw'})`);
}

async function embedForLang(items, lang) {
  const texts = items.map(item => item[`searchText${lang === 'tr' ? 'Tr' : 'En'}`] || '');
  const totalBatches = Math.ceil(texts.length / BATCH_SIZE);
  let done = 0;

  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batchTexts = texts.slice(i, i + BATCH_SIZE);
    const batchItems = items.slice(i, i + BATCH_SIZE);
    const embs = await embedBatch(batchTexts);
    for (let j = 0; j < batchItems.length; j++) {
      const id = batchItems[j].id;
      embeddings[id] = embeddings[id] || {};
      embeddings[id][`embedding${lang === 'tr' ? 'Tr' : 'En'}`] = embs[j];
    }
    done++;
    if (done % 5 === 0 || done === totalBatches) {
      console.log(`   ${lang.toUpperCase()}: batch ${done}/${totalBatches} (${((done / totalBatches) * 100).toFixed(0)}%)`);
    }
  }
}

const t0 = Date.now();
console.log(`\n🌐 Embedding TR...`);
await embedForLang(toEmbed, 'tr');
console.log(`\n🌐 Embedding EN...`);
await embedForLang(toEmbed, 'en');
const dt = ((Date.now() - t0) / 1000).toFixed(1);

// ── Write outputs
const finalItems = corpus.map(item => {
  const emb = embeddings[item.id] || {};
  return { ...item, embeddingTr: emb.embeddingTr, embeddingEn: emb.embeddingEn };
});

// Sanity check
const missingEmb = finalItems.filter(i => !i.embeddingTr || !i.embeddingEn);
if (missingEmb.length > 0) {
  console.warn(`\n⚠  ${missingEmb.length} items missing embeddings after run`);
  missingEmb.slice(0, 5).forEach(i => console.warn(`   - ${i.id}`));
}

// Update manifest
const now = new Date().toISOString();
for (const item of toEmbed) {
  manifest[item.id] = { hash: item.hash, embeddedAt: now, type: item.type };
}
// Remove stale entries (items no longer in corpus)
const activeIds = new Set(corpus.map(i => i.id));
for (const id of Object.keys(manifest)) {
  if (!activeIds.has(id)) delete manifest[id];
}

fs.writeFileSync(OUT, JSON.stringify({ builtAt: now, count: finalItems.length, items: finalItems }));
fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2));

const size = fs.statSync(OUT).size;
console.log(`\n✅ Embeddings written`);
console.log(`   Corpus file: ${path.relative(ROOT, OUT)}`);
console.log(`   Size: ${(size / 1024 / 1024).toFixed(2)} MB`);
console.log(`   Total items with embedding: ${finalItems.filter(i => i.embeddingTr && i.embeddingEn).length}`);
console.log(`   New/changed embedded: ${toEmbed.length}`);
console.log(`   Time: ${dt}s`);
console.log(`   Estimated cost: $${((toEmbed.length * 2 * 50) / 1_000_000 * 0.010).toFixed(4)}`);
