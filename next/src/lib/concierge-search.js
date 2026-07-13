// ─── concierge-search.js ────────────────────────────────────────────────────
// In-memory cosine similarity search over corpus embeddings.
// Corpus loaded once (module-level cache), searched by cosine similarity.
//
// Format: corpus-embeddings.json items have:
//   - id, type, ..., embTr (base64 Float32), embEn (base64 Float32)
//
// Decoded on first load into Float32Array for fast search.
// ────────────────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CORPUS_PATH = path.join(__dirname, 'corpus-embeddings.json');

let CORPUS_CACHE = null;

// ── Decode base64 → Float32Array
function b64ToFloat32(b64) {
  const buf = Buffer.from(b64, 'base64');
  return new Float32Array(buf.buffer, buf.byteOffset, buf.byteLength / 4);
}

// ── Load corpus into memory (once)
export function loadCorpus() {
  if (CORPUS_CACHE) return CORPUS_CACHE;
  if (!fs.existsSync(CORPUS_PATH)) {
    throw new Error(`Corpus not found at ${CORPUS_PATH}. Run \`npm run embed:build\`.`);
  }
  const raw = JSON.parse(fs.readFileSync(CORPUS_PATH, 'utf8'));
  const items = raw.items.map(item => ({
    ...item,
    _embTr: b64ToFloat32(item.embTr),
    _embEn: b64ToFloat32(item.embEn),
  }));
  CORPUS_CACHE = {
    items,
    dim: raw.dim,
    builtAt: raw.builtAt,
    // Pre-computed norms for fast cosine (norm(a) * norm(b) denominator)
    // Actually — BGE-M3 embeddings are already L2-normalized by the model.
    // Cosine similarity = dot product for normalized vectors.
    isNormalized: true,
  };
  return CORPUS_CACHE;
}

// ── Cosine similarity for L2-normalized vectors = dot product
function dotProduct(a, b) {
  let sum = 0;
  const len = a.length;
  for (let i = 0; i < len; i++) sum += a[i] * b[i];
  return sum;
}

// ── Search — top K by cosine similarity, per type filtering
export function search(queryEmbedding, options = {}) {
  const {
    lang = 'tr',              // 'tr' | 'en' — which embedding field to use
    topK = 20,                // number of top items to return before type filter
    perType = null,           // { verse: 5, article: 2, tool: 3, ... } — items per type
    typeFilter = null,        // Set<string> — only these types
    minScore = 0.30,          // filter out weak matches
  } = options;

  const corpus = loadCorpus();
  const embField = lang === 'en' ? '_embEn' : '_embTr';

  // Compute scores
  const scored = [];
  for (const item of corpus.items) {
    const emb = item[embField];
    if (!emb || emb.length !== queryEmbedding.length) continue;
    if (typeFilter && !typeFilter.has(item.type)) continue;
    const score = dotProduct(queryEmbedding, emb);
    if (score < minScore) continue;
    scored.push({ item, score });
  }

  // Sort by score desc
  scored.sort((a, b) => b.score - a.score);

  // Per-type limit
  if (perType) {
    const grouped = {};
    for (const type of Object.keys(perType)) grouped[type] = [];
    for (const { item, score } of scored) {
      const list = grouped[item.type];
      if (list && list.length < perType[item.type]) {
        list.push({ item, score });
      }
    }
    return grouped;
  }

  return scored.slice(0, topK);
}

// ── Convenience: search with default concierge preset
export function conciergeSearch(queryEmbedding, lang = 'tr') {
  return search(queryEmbedding, {
    lang,
    perType: {
      verse: 3,
      article: 2,
      tool: 3,
      'atlas-kissa': 2,
      'atlas-kavim': 2,
      'atlas-esma': 2,
      'atlas-dua': 2,
      'atlas-kavram': 2,
    },
    minScore: 0.35,
  });
}

// ── Debug helper: quick single-query search from CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  const corpus = loadCorpus();
  console.log(`✅ Corpus loaded: ${corpus.items.length} items, dim ${corpus.dim}`);
  console.log(`   Types:`, Object.entries(
    corpus.items.reduce((acc, i) => ({ ...acc, [i.type]: (acc[i.type] || 0) + 1 }), {})
  ).map(([k, v]) => `${k}:${v}`).join(' '));
  console.log(`   Sample item:`, corpus.items[0].id, `(dim: ${corpus.items[0]._embTr.length})`);
}
