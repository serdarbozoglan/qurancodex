// ─── Meal cache — local-first fetcher for acikkuran API responses ────────────
// Tries /meal-cache/<author>/<surah>.json first (shipped as static assets).
// Falls back to api.acikkuran.com on cache miss or parse failure.
//
// Why: isolate the site from api.acikkuran.com availability. Author 105
// (Erhan Aktaş — used by KissaAtlas, MeselAtlasi, SebebiNuzul) is pre-cached
// for all 114 surahs via scripts/prefetch-meal.mjs. Other authors still fall
// through to the live API — they degrade independently.
//
// Response shape matches the raw API: `{ data: { verses: [...], ... } }`.

const API_BASE = 'https://api.acikkuran.com';

// In-memory cache of parsed JSON responses (per session).
// Key: `${author}:${surah}`.
const memo = new Map();

/**
 * Fetch one surah for the given author.
 * @param {number|string} surah 1-114
 * @param {number} author Author ID (e.g., 105 for Erhan Aktaş)
 * @param {AbortSignal} [signal] Optional abort signal for cancellation.
 * @returns {Promise<object>} Parsed API response `{ data: { verses, ... } }`.
 */
export async function fetchMealSurah(surah, author, signal) {
  const key = `${author}:${surah}`;
  if (memo.has(key)) return memo.get(key);

  // Step 1 — try local snapshot.
  try {
    const res = await fetch(`/meal-cache/${author}/${surah}.json`, { signal });
    if (res.ok) {
      const data = await res.json();
      memo.set(key, data);
      return data;
    }
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    // Other errors (network, parse): fall through to API.
  }

  // Step 2 — fall back to live API.
  const res = await fetch(`${API_BASE}/surah/${surah}?author=${author}`, { signal });
  if (!res.ok) {
    throw new Error(`meal API ${res.status} for surah=${surah} author=${author}`);
  }
  const data = await res.json();
  memo.set(key, data);
  return data;
}

/**
 * Fetch one verse. Pulls the whole surah (cached), then returns the matching verse.
 * Falls back to the /surah/X/verse/Y endpoint on cache miss AND live-surah failure.
 * @param {number} surah
 * @param {number} ayah
 * @param {number} [author=105]
 * @returns {Promise<object>} `{ data: verseObject }` (matches API contract).
 */
export async function fetchMealVerse(surah, ayah, author = 105, signal) {
  try {
    const surahData = await fetchMealSurah(surah, author, signal);
    const verse = surahData?.data?.verses?.find(v => v.verse_number === ayah);
    if (verse) return { data: verse };
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    // Fall through.
  }

  // Last-ditch: the single-verse endpoint (used by FurukAtlasi historically).
  const res = await fetch(`${API_BASE}/surah/${surah}/verse/${ayah}`, { signal });
  if (!res.ok) {
    throw new Error(`verse API ${res.status} for ${surah}:${ayah}`);
  }
  return res.json();
}

/** Clear the in-memory cache (useful for tests). */
export function __clearMealMemo() {
  memo.clear();
}
