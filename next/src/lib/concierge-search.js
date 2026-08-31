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
    // Tip-başına puan tabanı (2026-08-31). Tek bir global eşik uzun kuyruk
    // için çalışmıyor: ölçümde bu tiplerin ORTALAMASI 0.47, yani 0.35
    // eşiğinde alâkasız sorgularda da kotalarını dolduruyor ve sorgu başına
    // +4.4k girdi token'ı ekliyorlardı (%54). Aynı tipler DOĞRU sorguda
    // 0.55-0.69 veriyor — o yüzden elenmeleri değil, eşiklerinin
    // yükseltilmesi gerekiyordu.
    minScoreByType = null,    // { 'atlas-mesel': 0.55, ... }
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
    const floor = (minScoreByType && minScoreByType[item.type]) || minScore;
    if (score < floor) continue;
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

// ── Faz 3: apply item quality boost to grouped search results
// final_score = cosine * (1 + 0.3 * (quality - 0.5))
//   quality 0.5 → no change (cold start default)
//   quality 1.0 → +15% (all thumbs up)
//   quality 0.0 → -15% (all thumbs down)
// Only items with ≥MIN_FEEDBACK_FOR_BOOST feedback have non-neutral quality.
export function applyQualityBoost(grouped, qualityScores) {
  if (!qualityScores || Object.keys(qualityScores).length === 0) return grouped;
  const out = {};
  for (const [type, arr] of Object.entries(grouped)) {
    out[type] = arr.map(entry => {
      const q = qualityScores[entry.item.id];
      if (q === undefined) return entry;
      const multiplier = 1 + 0.3 * (q - 0.5);
      return { ...entry, score: entry.score * multiplier, qualityBoost: q };
    });
    // Re-sort within type after boost
    out[type].sort((a, b) => b.score - a.score);
  }
  return out;
}

// Helper — flatten grouped map to list of item IDs (for KV batch lookup)
export function extractItemIds(grouped) {
  const ids = [];
  for (const arr of Object.values(grouped)) {
    for (const { item } of arr) ids.push(item.id);
  }
  return ids;
}

// Uzun kuyruk tiplerinin puan tabanı. 0.55 ölçümle seçildi: bu tipler doğru
// sorguda 0.55-0.69 veriyor, alâkasız sorguda 0.40-0.50 bandında kalıyor.
// Taban 0.55 olunca yalnız gerçekten isabetli olduklarında aday listesine
// giriyorlar.
const LONG_TAIL_FLOOR = 0.55;
const LONG_TAIL_FLOORS = Object.fromEntries([
  'atlas-mesel', 'sebeb-nuzul', 'dialogue', 'munasebat',
  'sunnetullah-kanun', 'sunnetullah-kavim',
  'atlas-ahiret-yolculugu-stage', 'insan-yolculugu-stage', 'addressee',
  'nuance-set', 'neden-sonuc', 'kitap-kavrami', 'atlas-ibadet',
].map(t => [t, LONG_TAIL_FLOOR]));

// Bu iki tipin ölçülen en yüksek puanı 0.53 ve 0.50 — 0.55 tabanıyla hiçbir
// sorguda listeye giremiyorlardı, yani eklenmiş ama yine ölü kalıyorlardı.
// Kendi bantlarına göre 0.48'e çekildi; ölçümde 25 sorgunun 3'ünde ve
// 2'sinde devreye giriyorlar (ort. +0.2 aday).
LONG_TAIL_FLOORS['tefsir-ihtilaf'] = 0.48;
LONG_TAIL_FLOORS['sunnetullah-ulema'] = 0.48;

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
      tefsir: 2,                 // Faz 2d: Elmalılı TR + İbn Kesîr EN
      article: 2,
      'article-section': 2,      // Faz 2c-D: makale section child'ları
      tool: 2,
      'atlas-kissa': 1,
      'atlas-kissa-scene': 2,    // Faz 2c-B: peygamber kıssası sahneleri
      'atlas-kavim': 1,
      'atlas-esma': 1,
      'atlas-dua': 1,
      'atlas-kavram': 1,
      'surah-summary': 2,        // Faz 2c-C: sure özet (114)
      pericope: 2,               // Faz 2c-E: klasik ruku (~556)
      // 2026-08-31 — corpus'ta olup bu listede olmadığı için aramada hiç
      // görünmeyen üç tip. Kota 1: aday sayısı 12 → 15, LLM girdisine
      // etkisi sınırlı tutuldu.
      elestirel: 1,              // zorlu sorular — itiraz/cevap/netice
      'bilimsel-isaret': 1,      // âyet-i kevniyye + usûl notu
      'tarihsel-iz': 1,          // arkeolojik/epigrafik izler
      // ── Uzun kuyruk (2026-08-31) ────────────────────────────────────────
      // Bu 15 tip corpus'ta duruyordu ama hiçbir arama yolunda yoktu:
      // embed edilmiş 280 kalem /sor'a hiç ulaşmıyordu. Kota 1 + yüksek
      // taban (LONG_TAIL_FLOOR) ile eklendi; ölçümde ortalama maliyet
      // sorgu başına +14.4 adaydan +1.5 adaya indi.
      'atlas-mesel': 1,
      'sebeb-nuzul': 1,
      dialogue: 1,
      munasebat: 1,
      'sunnetullah-kanun': 1,
      'sunnetullah-kavim': 1,
      'sunnetullah-ulema': 1,
      'atlas-ahiret-yolculugu-stage': 1,
      'insan-yolculugu-stage': 1,
      addressee: 1,
      'nuance-set': 1,
      'neden-sonuc': 1,
      'kitap-kavrami': 1,
      'atlas-ibadet': 1,
      'tefsir-ihtilaf': 1,
    },
    minScore: 0.35,
    minScoreByType: LONG_TAIL_FLOORS,
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
