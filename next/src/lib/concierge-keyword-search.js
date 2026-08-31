// ─── concierge-keyword-search.js ────────────────────────────────────────────
// Keyword full-text search over corpus. Alternative to semantic (BGE-M3) search.
// Same output shape as concierge-search.js (grouped: verses / tafsirs / atlases /
// articles / tools) so downstream (Claude curate + hydrate) works unchanged.
//
// Scoring:
//   - title (3x)  : query token found in titleTr/titleEn or arabic
//   - keyword hit (2x): query token = one of item.keywords entry
//   - body (1x)   : query token in searchTextTr/searchTextEn or descTr/descEn
// Turkish diacritic-fold applied for TR queries (ş→s, ı→i, ç→c, ğ→g, ü→u, ö→o).
// English is lowercased.
// Arabic query tokens matched raw against arabic field.
// ────────────────────────────────────────────────────────────────────────────

import { loadCorpus } from './concierge-search.js';

// ── Turkish diacritic-fold for search-friendly comparison
function foldTr(s) {
  if (!s) return '';
  return String(s)
    .toLowerCase()
    .replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ç/g, 'c')
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ö/g, 'o')
    .replace(/â/g, 'a').replace(/î/g, 'i').replace(/û/g, 'u')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function foldEn(s) {
  if (!s) return '';
  return String(s)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// ── Build lightweight search index (once per corpus load)
let INDEX_CACHE = null;

function buildIndex(items) {
  return items.map((item, idx) => {
    // Combined searchable strings — pre-normalized
    const titleTr = foldTr([item.titleTr, item.tr, item.nameTr, item.arabic].filter(Boolean).join(' '));
    const titleEn = foldEn([item.titleEn, item.en, item.nameEn, item.arabic].filter(Boolean).join(' '));
    const bodyTr = foldTr([item.descTr, item.searchTextTr, item.tafsirTr, item.notesTr].filter(Boolean).join(' '));
    const bodyEn = foldEn([item.descEn, item.searchTextEn, item.tafsirEn, item.notesEn].filter(Boolean).join(' '));
    const keywords = Array.isArray(item.keywords) ? item.keywords.map(foldTr) : [];
    const arabic = item.arabic || '';
    return { idx, titleTr, titleEn, bodyTr, bodyEn, keywords, arabic };
  });
}

function getIndex() {
  if (INDEX_CACHE) return INDEX_CACHE;
  const corpus = loadCorpus();
  INDEX_CACHE = {
    items: corpus.items,
    index: buildIndex(corpus.items),
  };
  return INDEX_CACHE;
}

// ── Tokenize query
function tokenize(q, lang) {
  const fold = lang === 'en' ? foldEn : foldTr;
  const parts = fold(q).split(' ').filter(t => t.length >= 2);
  return [...new Set(parts)];  // dedupe
}

// ── Score a single item against tokens (lang-specific)
// Perf: inner loop hot path — sadece includes() kullan, regex yok. Word-boundary
// bonus için title'ın ' '+t+' ' varyantını (padded) kontrol et.
function scoreItem(entry, tokens, lang) {
  const title = lang === 'en' ? entry.titleEn : entry.titleTr;
  const body = lang === 'en' ? entry.bodyEn : entry.bodyTr;
  const paddedTitle = title ? ` ${title} ` : '';
  const paddedBody = body ? ` ${body} ` : '';
  let score = 0;
  let hits = 0;
  for (let ti = 0; ti < tokens.length; ti++) {
    const t = tokens[ti];
    // Title match — highest weight
    if (title && title.includes(t)) {
      score += 3;
      hits++;
      // Word-boundary bonus — padded includes() (regex'ten 20x hızlı)
      if (paddedTitle.includes(` ${t} `)) score += 2;
    }
    // Keyword match — medium weight (keywords array kısa: ~5 entry)
    const kw = entry.keywords;
    for (let ki = 0; ki < kw.length; ki++) {
      if (kw[ki] === t || kw[ki].includes(t)) { score += 2; break; }
    }
    // Body match — base weight
    if (body && body.includes(t)) {
      score += 1;
      hits++;
      if (paddedBody.includes(` ${t} `)) score += 1;
    }
    // Arabic literal match (no fold)
    if (entry.arabic && entry.arabic.includes(t)) {
      score += 2;
    }
  }
  // Coverage bonus — items matching all query tokens rank higher
  if (hits === tokens.length && tokens.length > 1) score += tokens.length;
  return score;
}

// ── Group into per-TYPE map matching conciergeSearch output shape
// conciergeSearch returns { verse: [{item,score}], tefsir: [...], ...} keyed by
// exact type name. Downstream applyQualityBoost + extractItemIds + Claude
// curate all iterate Object.entries(grouped), so any type key works — but we
// preserve the same set of types the semantic pipeline emits.
// Uzun kuyruk tipleri için göreli kapı (2026-08-31). Keyword puanı toplamsal
// ve üst sınırı yok, dolayısıyla semantik taraftaki gibi sabit bir taban
// konamıyor; onun yerine "o sorgudaki en yüksek puana göre" oran aranıyor.
// Böylece bu tipler ancak gerçekten güçlü eşleşme verdiklerinde listeye
// giriyor, her sorguda kotalarını doldurmuyorlar.
// Oran süpürmesi (25 sorgu): 0.0 → 36.2 aday (gürültülü) · 0.4 → 28.3, 15/15
// tip erişilebilir · 0.5 → 27.3 ama bir tip hiç giremiyor · 0.6 → 13/15.
// 0.4 seçildi: her tipin ulaşılabilir kalması bu değişikliğin asıl amacı.
const LONG_TAIL_RATIO = 0.4;

function groupByType(scoredItems, perType, ratioByType = null) {
  const grouped = {};
  for (const type of Object.keys(perType)) grouped[type] = [];
  const top = scoredItems.length ? scoredItems[0].score : 0;
  for (const { item, score } of scoredItems) {
    const list = grouped[item.type];
    if (!list || list.length >= perType[item.type]) continue;
    const ratio = ratioByType && ratioByType[item.type];
    if (ratio && top > 0 && score < top * ratio) continue;
    list.push({ item, score });
  }
  return grouped;
}

// ── Main API: keyword search
// Same output shape as conciergeSearch — { type: [{item,score}, ...], ... }
export function conciergeKeywordSearch(query, lang) {
  const perType = {
    verse: 5,
    tefsir: 3,
    article: 2,
    'article-section': 2,
    tool: 3,
    'atlas-kissa': 1,
    'atlas-kissa-scene': 2,
    'atlas-kavim': 1,
    'atlas-esma': 1,
    'atlas-dua': 1,
    'atlas-kavram': 2,
    'atlas-ahiret-yolculugu-stage': 1,
    'surah-summary': 2,
    pericope: 2,
    'sebeb-nuzul': 2,
    dialogue: 2,
    addressee: 1,
    // 2026-08-31 — bu üç tip corpus'ta vardı ama bu listede olmadığı için
    // aramada sessizce eleniyordu: embed edilmiş içerik /sor'a hiç ulaşmıyordu.
    elestirel: 2,
    'bilimsel-isaret': 1,
    'tarihsel-iz': 1,
    // ── Uzun kuyruk — corpus'ta olup hiçbir arama yolunda bulunmayan tipler
    'atlas-mesel': 1,
    munasebat: 1,
    'sunnetullah-kanun': 1,
    'sunnetullah-kavim': 1,
    'sunnetullah-ulema': 1,
    'insan-yolculugu-stage': 1,
    'nuance-set': 1,
    'neden-sonuc': 1,
    'kitap-kavrami': 1,
    'atlas-ibadet': 1,
    'tefsir-ihtilaf': 1,
  };
  const ratioByType = Object.fromEntries([
    'atlas-mesel', 'munasebat', 'sunnetullah-kanun', 'sunnetullah-kavim',
    'sunnetullah-ulema', 'insan-yolculugu-stage', 'nuance-set', 'neden-sonuc',
    'kitap-kavrami', 'atlas-ibadet', 'tefsir-ihtilaf',
    // sebeb-nuzul, dialogue, addressee ve atlas-ahiret-yolculugu-stage
    // BİLEREK dışarıda: bunlar bu listede zaten vardı ve kotaları ayrıca
    // ayarlanmıştı; onlara kapı koymak mevcut davranışı daraltırdı.
  ].map(t => [t, LONG_TAIL_RATIO]));
  const tokens = tokenize(query, lang);
  const emptyGrouped = () => Object.fromEntries(Object.keys(perType).map(k => [k, []]));
  if (tokens.length === 0) return emptyGrouped();

  const { items, index } = getIndex();
  const scored = [];
  for (let i = 0; i < index.length; i++) {
    const s = scoreItem(index[i], tokens, lang);
    if (s > 0) scored.push({ item: items[i], score: s });
  }
  scored.sort((a, b) => b.score - a.score);
  return groupByType(scored, perType, ratioByType);
}
