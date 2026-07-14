// ─── query-lang.js ─────────────────────────────────────────────────────────
// Concierge query dilini heuristic ile tespit eder.
// Öncelik:
//   1. Türkçe karakterler (ğüşıçö) VAR → tr kesin
//   2. TR stopword sayısı > EN stopword sayısı → tr
//   3. EN stopword sayısı > TR stopword sayısı → en
//   4. Belirsiz → default tr
//
// Kullanım: /sor sayfası user query'ye göre API'ye lang param'ini set eder.
// Sayfa locale'inden bağımsız — user Türkçe UI'da EN sorabilir.
// ────────────────────────────────────────────────────────────────────────────

const TR_STOPWORDS = new Set([
  'nedir', 'nasıl', 'nasil', 'niçin', 'nicin', 'neden', 'niye',
  'kim', 'kimdir', 'hangi', 'hangisi', 'hangisidir', 'hangisdir',
  've', 'veya', 'ile', 'için', 'icin', 'gibi', 'olan', 'olarak',
  'da', 'de', 'daha', 'çok', 'cok', 'en', 'ne', 'mi', 'mu', 'mü', 'mı',
  'bir', 'bu', 'şu', 'su', 'o', 'sen', 'ben', 'biz', 'siz',
  'ayet', 'ayeti', 'sure', 'suresi', 'kur\'an', 'kuran', 'kur\'anda',
  'geçen', 'gecen', 'ismi', 'anlam', 'anlamı', 'anlamı',
  'peygamber', 'nebi', 'hz',
]);

const EN_STOPWORDS = new Set([
  'what', 'how', 'why', 'when', 'where', 'which', 'who', 'whom', 'whose',
  'is', 'are', 'was', 'were', 'be', 'been', 'being', 'do', 'does', 'did',
  'the', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
  'about', 'from', 'as', 'and', 'or', 'but', 'if', 'because', 'while',
  'quran', "quran's", 'verse', 'verses', 'surah', 'sura', 'chapter',
  'prophet', 'prophets', 'name', 'names', 'meaning', 'story',
  'says', 'said', 'this', 'that', 'these', 'those', 'they', 'them', 'their',
]);

/**
 * Detect query language: 'tr' | 'en'.
 * Default: 'tr' (site default + Turkish user base).
 */
export function detectQueryLang(query) {
  if (!query || typeof query !== 'string') return 'tr';
  const q = query.trim();

  // 1. Türkçe karakter kesin sinyal
  if (/[ğüşıçöĞÜŞİÇÖ]/.test(q)) return 'tr';

  // 2. Stopword sayımı
  const words = q.toLowerCase().split(/[\s\p{P}]+/u).filter(Boolean);
  let trHits = 0, enHits = 0;
  for (const w of words) {
    if (TR_STOPWORDS.has(w)) trHits++;
    if (EN_STOPWORDS.has(w)) enHits++;
  }

  if (trHits > enHits) return 'tr';
  if (enHits > trHits) return 'en';

  // 3. Belirsiz — default 'tr'
  return 'tr';
}
