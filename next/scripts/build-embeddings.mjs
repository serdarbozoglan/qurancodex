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
// Manifest yalnızca corpus-embeddings.json da varsa VE LFS pointer değilse güvenli.
// Vercel'de LFS enabled değilse corpus.json ~130 byte "version https://git-lfs..."
// pointer'ı olur — manifest 6584 known der, embeddings yok → tüm request 500.
const corpusExists = fs.existsSync(OUT);
let corpusIsLfsPointer = false;
if (corpusExists) {
  const head = fs.readFileSync(OUT, 'utf8').slice(0, 100);
  corpusIsLfsPointer = head.startsWith('version https://git-lfs') || fs.statSync(OUT).size < 1024;
}
if (fs.existsSync(MANIFEST) && !force && corpusExists && !corpusIsLfsPointer) {
  manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
  console.log(`📋 Loaded manifest: ${Object.keys(manifest).length} known items`);
} else if (!corpusExists) {
  console.log(`📋 Manifest skipped (corpus-embeddings.json missing → full rebuild)`);
} else if (corpusIsLfsPointer) {
  console.log(`📋 Manifest skipped (corpus-embeddings.json is LFS pointer → full rebuild)`);
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
// Faz 2a: verse item'ları çoklu meal ile embed edilir (searchTextTrArr / searchTextEnArr).
// Non-verse item'lar tek embed (searchTextTr / searchTextEn).
console.log(`\n⚙️  Embedding ${toEmbed.length} items × 2 languages (multi-vector for verses)...`);
console.log(`   Batch size: ${BATCH_SIZE}`);

const embeddings = {}; // { itemId: { embeddingTr, embeddingEn, embeddingTrArr, embeddingEnArr } }

// ── Base64 → float array (for reencoded format)
function b64ToArr(b64) {
  const buf = Buffer.from(b64, 'base64');
  return Array.from(new Float32Array(buf.buffer, buf.byteOffset, buf.byteLength / 4));
}

// Load existing embeddings (backward compat + resume)
if (fs.existsSync(OUT) && !force) {
  const rawExisting = fs.readFileSync(OUT, 'utf8');
  const isLfsPointer = rawExisting.startsWith('version https://git-lfs') || rawExisting.length < 1024;
  if (isLfsPointer) {
    console.warn(`   ⚠  Existing corpus-embeddings.json is LFS pointer. Skipping reuse — will re-embed all.`);
  } else {
    try {
      const existing = JSON.parse(rawExisting);
      const isReencoded = existing.format === 'float32-base64';
      for (const item of existing.items || []) {
        const cache = {};
        if (item.embeddingTr) cache.embeddingTr = item.embeddingTr;
        else if (isReencoded && item.embTr) cache.embeddingTr = b64ToArr(item.embTr);
        if (item.embeddingEn) cache.embeddingEn = item.embeddingEn;
        else if (isReencoded && item.embEn) cache.embeddingEn = b64ToArr(item.embEn);
        if (Array.isArray(item.embeddingTrArr)) cache.embeddingTrArr = item.embeddingTrArr;
        else if (isReencoded && Array.isArray(item.embTrArr)) cache.embeddingTrArr = item.embTrArr.map(b64ToArr);
        if (Array.isArray(item.embeddingEnArr)) cache.embeddingEnArr = item.embeddingEnArr;
        else if (isReencoded && Array.isArray(item.embEnArr)) cache.embeddingEnArr = item.embEnArr.map(b64ToArr);
        if (Object.keys(cache).length) embeddings[item.id] = cache;
      }
      console.log(`   Reused ${Object.keys(embeddings).length} existing embeddings`);
    } catch (err) {
      console.warn(`   ⚠  Failed to parse existing embeddings: ${err.message}. Skipping reuse.`);
    }
  }
}

// Batch embedder — collects texts across many items into one API call.
async function embedManyTexts(texts) {
  const out = [];
  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batchTexts = texts.slice(i, i + BATCH_SIZE);
    const embs = await embedBatch(batchTexts);
    out.push(...embs);
    const done = Math.min(i + BATCH_SIZE, texts.length);
    if ((done % (BATCH_SIZE * 5)) === 0 || done === texts.length) {
      console.log(`     batch ${done}/${texts.length} (${((done / texts.length) * 100).toFixed(0)}%)`);
    }
  }
  return out;
}

// Per-lang embed: multi-vector for verses (searchTextTrArr), single for others.
async function embedForLang(items, lang) {
  const suffix = lang === 'tr' ? 'Tr' : 'En';
  // Job list: { id, targetField, offset, count } — flat text queue.
  const texts = [];
  const jobs = [];
  for (const item of items) {
    const arrField = `searchText${suffix}Arr`;
    const singleField = `searchText${suffix}`;
    const arr = item[arrField];
    if (Array.isArray(arr) && arr.length > 0) {
      const start = texts.length;
      texts.push(...arr);
      jobs.push({ id: item.id, targetField: `embedding${suffix}Arr`, offset: start, count: arr.length });
    } else {
      const t = item[singleField] || '';
      const start = texts.length;
      texts.push(t);
      jobs.push({ id: item.id, targetField: `embedding${suffix}`, offset: start, count: 1 });
    }
  }

  console.log(`   ${lang.toUpperCase()}: ${texts.length} texts across ${jobs.length} items`);
  const embs = await embedManyTexts(texts);

  for (const job of jobs) {
    embeddings[job.id] = embeddings[job.id] || {};
    if (job.count === 1) {
      embeddings[job.id][job.targetField] = embs[job.offset];
    } else {
      const slice = embs.slice(job.offset, job.offset + job.count);
      embeddings[job.id][job.targetField] = slice;
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
// IMPORTANT (Faz 2a): 3x embed per verse × 6236 verses × 2 langs makes the raw
// float-array JSON ~700-800 MB — exceeds Node's max string length in
// JSON.stringify. So we encode to Float32 base64 INLINE and skip the
// separate reencode step. Output format = 'float32-base64' directly.
function toB64(floatArr) {
  if (!floatArr || !Array.isArray(floatArr)) return null;
  const f32 = new Float32Array(floatArr);
  return Buffer.from(f32.buffer).toString('base64');
}

let dim = 0;
const finalItems = corpus.map(item => {
  const emb = embeddings[item.id] || {};
  const out = { ...item };
  // Base64 encode: verses use *Arr, others use single.
  if (Array.isArray(emb.embeddingTrArr) && emb.embeddingTrArr.length > 0) {
    out.embTrArr = emb.embeddingTrArr.map(toB64).filter(Boolean);
    if (!dim && emb.embeddingTrArr[0]) dim = emb.embeddingTrArr[0].length;
  } else if (emb.embeddingTr) {
    out.embTr = toB64(emb.embeddingTr);
    if (!dim) dim = emb.embeddingTr.length;
  }
  if (Array.isArray(emb.embeddingEnArr) && emb.embeddingEnArr.length > 0) {
    out.embEnArr = emb.embeddingEnArr.map(toB64).filter(Boolean);
  } else if (emb.embeddingEn) {
    out.embEn = toB64(emb.embeddingEn);
  }
  return out;
});

// Sanity check — verse items should have Arr, others should have single.
const missingEmb = finalItems.filter(i => {
  if (i.type === 'verse') {
    const hasTr = Array.isArray(i.embTrArr) || i.embTr;
    const hasEn = Array.isArray(i.embEnArr) || i.embEn;
    return !hasTr || !hasEn;
  }
  return !i.embTr || !i.embEn;
});
if (missingEmb.length > 0) {
  console.warn(`\n⚠  ${missingEmb.length} items missing embeddings after run`);
  missingEmb.slice(0, 5).forEach(i => console.warn(`   - ${i.id} (${i.type})`));
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

fs.writeFileSync(OUT, JSON.stringify({
  builtAt: now,
  count: finalItems.length,
  dim,
  format: 'float32-base64',
  items: finalItems,
}));
fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2));

const size = fs.statSync(OUT).size;
console.log(`\n✅ Embeddings written`);
console.log(`   Corpus file: ${path.relative(ROOT, OUT)}`);
console.log(`   Size: ${(size / 1024 / 1024).toFixed(2)} MB`);
const okItems = finalItems.filter(i => (i.embTr || Array.isArray(i.embTrArr)) && (i.embEn || Array.isArray(i.embEnArr))).length;
console.log(`   Total items with embedding: ${okItems}`);
console.log(`   Verses with multi-vector Arr: ${finalItems.filter(i => Array.isArray(i.embTrArr)).length}`);
console.log(`   New/changed embedded: ${toEmbed.length}`);
console.log(`   Format: float32-base64 (dim=${dim})`);
console.log(`   Time: ${dt}s`);
console.log(`   Estimated cost: $${((toEmbed.length * 5 * 50) / 1_000_000 * 0.010).toFixed(4)}`);
