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
// Multi-vector schema (Faz 2a):
//   verse item: { embTrArr: [b64_meal1, b64_meal2, b64_meal3], embEnArr: [...] }
//     → parsed as _embTrArr: [Float32Array, Float32Array, Float32Array]
//   non-verse item: { embTr, embEn }
//     → parsed as _embTr, _embEn (single Float32Array)
// Backward compat: if item has embTr (not embTrArr), treat as single-vector.
export function loadCorpus() {
  if (CORPUS_CACHE) return CORPUS_CACHE;
  if (!fs.existsSync(CORPUS_PATH)) {
    throw new Error(`Corpus not found at ${CORPUS_PATH}. Run \`npm run embed:build\`.`);
  }
  const raw = JSON.parse(fs.readFileSync(CORPUS_PATH, 'utf8'));
  const items = raw.items.map(item => {
    const out = { ...item };
    if (Array.isArray(item.embTrArr) && item.embTrArr.length > 0) {
      out._embTrArr = item.embTrArr.map(b64ToFloat32);
    } else if (item.embTr) {
      out._embTr = b64ToFloat32(item.embTr);
    }
    if (Array.isArray(item.embEnArr) && item.embEnArr.length > 0) {
      out._embEnArr = item.embEnArr.map(b64ToFloat32);
    } else if (item.embEn) {
      out._embEn = b64ToFloat32(item.embEn);
    }
    return out;
  });
  CORPUS_CACHE = {
    items,
    dim: raw.dim,
    builtAt: raw.builtAt,
    // BGE-M3 embeddings are already L2-normalized — cosine = dot product.
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

// ── Multi-vector MAX cosine: return highest similarity across all meal embeddings.
// User query "sabır" → 3 meals'ten hangisi en yakın anlatıyorsa o skor.
// Bu, tek meal'in kelime seçimine bağlı recall kaybını önler (Diyanet "sabr",
// Suat "dayanma", Ali Bulaç "katlanmak" → query hangisiyle örtüşürse o kazanır).
function maxDot(queryEmb, embArr) {
  let max = -Infinity;
  for (const emb of embArr) {
    if (!emb || emb.length !== queryEmb.length) continue;
    const s = dotProduct(queryEmb, emb);
    if (s > max) max = s;
  }
  return max;
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
  const singleField = lang === 'en' ? '_embEn' : '_embTr';
  const arrField = lang === 'en' ? '_embEnArr' : '_embTrArr';

  // Compute scores — multi-vector MAX for verses, single for others.
  const scored = [];
  for (const item of corpus.items) {
    if (typeFilter && !typeFilter.has(item.type)) continue;
    let score;
    const arr = item[arrField];
    if (arr && arr.length > 0) {
      score = maxDot(queryEmbedding, arr);
    } else {
      const emb = item[singleField];
      if (!emb || emb.length !== queryEmbedding.length) continue;
      score = dotProduct(queryEmbedding, emb);
    }
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
// perType TOTAL: 3+2+2+5 = 12 candidates (was 18). Claude nihayetinde
// 3-7 seçtiği için üstteki 6 aday çoğunlukla artıyor + fazladan input token
// LLM latency'yi artırıyordu. Cut atlaslarda: her tip 2→1 (5×2 → 5×1).
// tool 3→2 (rarely need 3). verse 3, article 2 korundu (en yüksek recall).
// Beklenen: ~-300 input token, ~-200-300ms LLM latency, recall değişmez.
export function conciergeSearch(queryEmbedding, lang = 'tr') {
  return search(queryEmbedding, {
    lang,
    perType: {
      verse: 3,
      article: 2,
      tool: 2,
      'atlas-kissa': 1,
      'atlas-kavim': 1,
      'atlas-esma': 1,
      'atlas-dua': 1,
      'atlas-kavram': 1,
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
