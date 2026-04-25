#!/usr/bin/env node
/**
 * extract-first-last-words.mjs
 *
 * F-11 (İlk ve Son Kelimeler) için veri dolgusu.
 *
 * Girdi:
 *   - public/verse-graph-bgem3.json  (tek doğruluk kaynağı — standart Arapça encoding)
 *   - public/ilk-son-kelimeler.json  (mevcut iskelet, kullanıcı manuel girişleri korunacak)
 *
 * Çıktı:
 *   - public/ilk-son-kelimeler.json  (atomic write)
 *
 * Kural:
 *   - Sadece `null` olan alanlar doldurulur. Kullanıcının elle girdiği değerler (Fatiha
 *     hanefi sayımı, mukattaa etiketleri, tafsir notları vs.) ASLA ezilmez.
 *   - Bismillah politikası: Fatiha için kullanıcı kararı (al-ḥamdu) korunur. Diğer
 *     sûrelerde 1:1'deki Bismillah içerik değil — her sûrenin mushaf verisinde gerçek
 *     ilk ayet (`ayah=1`) baş ayet olarak alınır. Tevbe (9) zaten Bismillah'sız.
 *     NOT: verse-graph-bgem3.json'da Fatiha için 1:1 = Bismillah (7 ayet Hanefî sayım).
 *     Diğer sûrelerin 1:1'leri Bismillah DEĞİL (kontrol edildi: 2:1 = الم, 9:1 = براءة…).
 *
 * Çalıştır:
 *   node scripts/extract-first-last-words.mjs [--dry]
 */
import { readFileSync, writeFileSync, renameSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const GRAPH_PATH = resolve(ROOT, 'public', 'verse-graph-bgem3.json');
const TARGET_PATH = resolve(ROOT, 'public', 'ilk-son-kelimeler.json');

const DRY = process.argv.includes('--dry');

// Arapça ayet sonu/durak işaretleri ve bazı pause işaretleri — son kelimeden
// temizlenir. Harekeleri KORURuz (kelimenin kimliği için gereklidir).
// Ek olarak yan yana gelen köşebent/parantez işaretlerini de süpürürüz.
const TRAILING_MARKERS = [
  '\u06D6', '\u06D7', '\u06D8', '\u06D9', '\u06DA', '\u06DB',
  '\u06DC', '\u06DD', '\u06DE', '\u06DF', '\u06E0',
  '\u06E9', // place of sajdah
  '\u060C', '\u061B', '\u061F', // Arabic comma/semicolon/question mark
  '\u06D4', // Arabic full stop
  '.', ',', ';', ':', '!', '?',
];
const MARKER_REGEX = new RegExp(`[${TRAILING_MARKERS.join('')}]+$`, 'u');

function stripTrailingMarkers(word) {
  if (!word) return word;
  // Birden çok geçişte temizle (işaret arkası işaret olabilir)
  let w = word;
  let prev;
  do {
    prev = w;
    w = w.replace(MARKER_REGEX, '');
  } while (w !== prev);
  return w.trim();
}

function tokenize(arabic) {
  return arabic
    .split(/\s+/)
    .map(tok => stripTrailingMarkers(tok))
    .filter(Boolean);
}

function extractFirstLast(arabic) {
  const tokens = tokenize(arabic);
  if (tokens.length === 0) return { first: null, last: null };
  return {
    first: tokens[0],
    last: tokens[tokens.length - 1],
  };
}

// ── Load inputs ──────────────────────────────────────────────────────────────
const verses = JSON.parse(readFileSync(GRAPH_PATH, 'utf8'));
const target = JSON.parse(readFileSync(TARGET_PATH, 'utf8'));

// ── Build surah → first/last ayah map from verse-graph ───────────────────────
const bySurah = new Map();
for (const v of verses) {
  if (!bySurah.has(v.surah)) bySurah.set(v.surah, { first: v, last: v });
  else {
    const cur = bySurah.get(v.surah);
    if (v.ayah < cur.first.ayah) cur.first = v;
    if (v.ayah > cur.last.ayah) cur.last = v;
  }
}

// ── Merge into target (preserve user entries) ────────────────────────────────
let filledFirst = 0;
let filledLast = 0;
let preservedFirst = 0;
let preservedLast = 0;
let filledAyahText = 0;
const warnings = [];

for (const entry of target.surahs) {
  const graph = bySurah.get(entry.surah);
  if (!graph) {
    warnings.push(`Surah ${entry.surah}: verse-graph'da bulunamadı`);
    continue;
  }

  const { first, last } = {
    first: extractFirstLast(graph.first.arabic).first,
    last:  extractFirstLast(graph.last.arabic).last,
  };

  // firstWord.ar
  if (entry.firstWord && entry.firstWord.ar === null) {
    entry.firstWord.ar = first;
    filledFirst++;
  } else if (entry.firstWord && entry.firstWord.ar) {
    preservedFirst++;
  } else {
    // firstWord objesi hiç yoksa (bu case beklenmiyor ama güvenli)
    entry.firstWord = { ar: first, translit: null, meaning: null, root: null };
    filledFirst++;
  }

  // lastWord.ar
  if (entry.lastWord && entry.lastWord.ar === null) {
    entry.lastWord.ar = last;
    filledLast++;
  } else if (entry.lastWord && entry.lastWord.ar) {
    preservedLast++;
  } else {
    entry.lastWord = { ar: last, translit: null, meaning: null, root: null };
    filledLast++;
  }

  // Full ayah texts for detail panel (detail view needs full verse, not just word).
  // Re-fill on every run — verse-graph is the source of truth for ayah text.
  entry.firstAyah = {
    ar: graph.first.arabic,
    tr: graph.first.turkish,
    en: graph.first.english,
  };
  entry.lastAyah = {
    ar: graph.last.arabic,
    tr: graph.last.turkish,
    en: graph.last.english,
  };
  filledAyahText++;
}

// ── Update meta ──────────────────────────────────────────────────────────────
target.meta.dataCompleteness.firstWord =
  preservedFirst + filledFirst + ' sûre dolu' +
  (preservedFirst ? ` (${preservedFirst}'i elle, ${filledFirst}'i extract)` : ` (${filledFirst} extract)`);
target.meta.dataCompleteness.lastWord =
  preservedLast + filledLast + ' sûre dolu' +
  (preservedLast ? ` (${preservedLast}'i elle, ${filledLast}'i extract)` : ` (${filledLast} extract)`);
target.meta.lastExtractedAt = new Date().toISOString().slice(0, 10);
if (!target.meta.sources.includes('public/verse-graph-bgem3.json (ilk/son kelime extract, scripts/extract-first-last-words.mjs)')) {
  target.meta.sources.push('public/verse-graph-bgem3.json (ilk/son kelime extract, scripts/extract-first-last-words.mjs)');
}

// ── Write atomically ─────────────────────────────────────────────────────────
const out = JSON.stringify(target, null, 2);
if (DRY) {
  console.log(`[DRY] Would write ${out.length} bytes to ${TARGET_PATH}`);
} else {
  const tmp = `${TARGET_PATH}.tmp`;
  writeFileSync(tmp, out);
  renameSync(tmp, TARGET_PATH);
}

// ── Summary ──────────────────────────────────────────────────────────────────
console.log('─── Extract summary ───');
console.log(`  firstWord.ar  doldurulan: ${filledFirst}  korunan: ${preservedFirst}`);
console.log(`  lastWord.ar   doldurulan: ${filledLast}  korunan: ${preservedLast}`);
console.log(`  firstAyah + lastAyah (ar/tr/en) dolduruldu: ${filledAyahText} sûre`);
if (warnings.length) {
  console.log('─── Warnings ───');
  warnings.forEach(w => console.log(`  ⚠ ${w}`));
}
if (DRY) console.log('(DRY RUN — dosya yazılmadı)');
