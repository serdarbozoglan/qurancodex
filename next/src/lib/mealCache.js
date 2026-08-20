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

// Faz 6.3 — direct acikkuran.com yerine kendi API route'umuza gidiyoruz.
// Bu rotada Next.js fetch cache (revalidate 24h) + Cache-Control header'lar
// var; aynı surah+author kombinasyonu için tek upstream call yapılıp tüm
// kullanıcılara dağıtılır.
const API_BASE = '/api/meal';
const FALLBACK_BASE = '/api/meal-fallback';

// 2026-08-19 — kullanıcı raporu: api.acikkuran.com'un DNS'i çözülmüyordu
// (ENOTFOUND, hem yerel hem sunucu tarafında doğrulandı — ana alan adı
// acikkuran.com çözülüyor, yalnız api. alt-alan-adı çözülmüyor). acikkuran
// author ID'sinden alquran.cloud edition kimliğine eşleştirme — yalnız
// GERÇEK karşılığı doğrulanmış yazarlar (canlı istekle kontrol edildi).
// Karşılığı olmayan yazarlar (İslamoğlu, Bayraktar, Okuyan, Haleem) bu
// haritada YOK — onlar için üçüncü katman denenmez, doğrudan hata gösterilir.
const ALQURAN_CLOUD_FALLBACK = {
  11: 'tr.diyanet',    // Diyanet İşleri
  14: 'tr.yazir',      // Elmalılı Hamdi Yazır
  6: 'tr.bulac',       // Ali Bulaç
  27: 'tr.ates',       // Süleyman Ateş
  30: 'tr.ozturk',     // Yaşar Nuri Öztürk
  2: 'en.yusufali',    // Abdullah Yusuf Ali
  109: 'en.pickthall', // Marmaduke Pickthall
  9: 'en.asad',        // Muhammad Asad
};

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

  // Step 2 — fall back to our Next.js API route (proxies + caches acikkuran).
  try {
    const res = await fetch(`${API_BASE}/${author}/${surah}`, { signal });
    if (res.ok) {
      const data = await res.json();
      memo.set(key, data);
      return data;
    }
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    // Other errors: fall through to Step 3.
  }

  // Step 3 — acikkuran unreachable (2026-08-19). Only for authors with a
  // verified alquran.cloud equivalent (ALQURAN_CLOUD_FALLBACK); others throw
  // immediately below, same as before this fallback existed.
  const edition = ALQURAN_CLOUD_FALLBACK[author];
  if (edition) {
    const res = await fetch(`${FALLBACK_BASE}/${edition}/${surah}`, { signal });
    if (res.ok) {
      const data = await res.json();
      memo.set(key, data);
      return data;
    }
  }

  throw new Error(`meal API unreachable for surah=${surah} author=${author}`);
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

  // Last-ditch: single-verse endpoint via /api/meal proxy.
  const res = await fetch(`${API_BASE}/${author}/${surah}/verse/${ayah}`, { signal });
  if (!res.ok) {
    throw new Error(`verse API ${res.status} for ${surah}:${ayah}`);
  }
  return res.json();
}

/** Clear the in-memory cache (useful for tests). */
export function __clearMealMemo() {
  memo.clear();
}
