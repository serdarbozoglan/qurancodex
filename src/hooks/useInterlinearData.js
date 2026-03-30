import { useState, useEffect } from 'react';

const CACHE_KEY_PREFIX = 'wbw_v5_';

const TR_SURAH_SLUGS = {
  1: 'fatiha', 2: 'bakara', 3: 'ali-imran', 4: 'nisa', 5: 'maide',
  6: 'enam', 7: 'araf', 8: 'enfal', 9: 'tevbe', 10: 'yunus',
  11: 'hud', 12: 'yusuf', 13: 'rad', 14: 'ibrahim', 15: 'hicr',
  16: 'nahl', 17: 'isra', 18: 'kehf', 19: 'meryem', 20: 'taha',
  21: 'enbiya', 22: 'hac', 23: 'muminun', 24: 'nur', 25: 'furkan',
  26: 'suara', 27: 'neml', 28: 'kasas', 29: 'ankebut', 30: 'rum',
  31: 'lokman', 32: 'secde', 33: 'ahzab', 34: 'sebe', 35: 'fatir',
  36: 'yasin', 37: 'saffat', 38: 'sad', 39: 'zumer', 40: 'mumin',
  41: 'fussilet', 42: 'sura', 43: 'zuhruf', 44: 'duhan', 45: 'casiye',
  46: 'ahkaf', 47: 'muhammed', 48: 'fetih', 49: 'hucurat', 50: 'kaf',
  51: 'zariyat', 52: 'tur', 53: 'necm', 54: 'kamer', 55: 'rahman',
  56: 'vakia', 57: 'hadid', 58: 'mucadele', 59: 'hasr', 60: 'mumtahine',
  61: 'saf', 62: 'cuma', 63: 'munafikun', 64: 'tegabun', 65: 'talak',
  66: 'tahrim', 67: 'mulk', 68: 'kalem', 69: 'hakka', 70: 'mearic',
  71: 'nuh', 72: 'cin', 73: 'muzzemmil', 74: 'muddessir', 75: 'kiyamet',
  76: 'insan', 77: 'murselat', 78: 'nebe', 79: 'naziat', 80: 'abese',
  81: 'tekvir', 82: 'intifar', 83: 'mutaffifin', 84: 'insikak', 85: 'buruc',
  86: 'tarik', 87: 'ala', 88: 'gasiye', 89: 'fecr', 90: 'beled',
  91: 'sems', 92: 'leyl', 93: 'duha', 94: 'insirah', 95: 'tin',
  96: 'alak', 97: 'kadir', 98: 'beyyine', 99: 'zilzal', 100: 'adiyat',
  101: 'karia', 102: 'tekasur', 103: 'asr', 104: 'humeze', 105: 'fil',
  106: 'kureys', 107: 'maun', 108: 'kevser', 109: 'kafirun', 110: 'nasr',
  111: 'leheb', 112: 'ihlas', 113: 'felak', 114: 'nas',
};

// English slugs verified against kuran.com (all 114 return HTTP 200)
const EN_SURAH_SLUGS = {
  1: 'the-opening', 2: 'the-cow', 3: 'the-family-of-imran', 4: 'women', 5: 'the-food',
  6: 'the-cattle', 7: 'the-elevated-place', 8: 'the-spoils-of-war', 9: 'repentance', 10: 'yunus',
  11: 'hud', 12: 'yusuf', 13: 'the-thunder', 14: 'ibrahim', 15: 'the-rock',
  16: 'the-bee', 17: 'the-israelites', 18: 'the-cave', 19: 'marium', 20: 'ta-ha',
  21: 'the-prophets', 22: 'the-pilgrimage', 23: 'the-believers', 24: 'the-light', 25: 'the-criterion',
  26: 'the-poets', 27: 'the-ant', 28: 'the-narrative', 29: 'the-spider', 30: 'the-romans',
  31: 'luqman', 32: 'the-adoration', 33: 'the-allies', 34: 'saba', 35: 'the-originator',
  36: 'ya-seen', 37: 'the-rangers', 38: 'suad', 39: 'the-companies', 40: 'the-believer',
  41: 'ha-mim', 42: 'the-counsel', 43: 'the-embellishment', 44: 'the-evident-smoke', 45: 'the-kneeling',
  46: 'the-sandhills', 47: 'muhammad', 48: 'the-victory', 49: 'the-chambers', 50: 'qaf',
  51: 'the-scatterers', 52: 'the-mountain', 53: 'the-star', 54: 'the-moon', 55: 'the-beneficient',
  56: 'the-great-event', 57: 'the-iron', 58: 'the-pleading-one', 59: 'the-banishment', 60: 'the-examined-one',
  61: 'the-ranks', 62: 'friday', 63: 'the-hypocrites', 64: 'loss-and-gain', 65: 'the-divorce',
  66: 'the-prohibition', 67: 'the-kingdom', 68: 'the-pen', 69: 'the-sure-calamity', 70: 'the-ways-of-ascent',
  71: 'nuh', 72: 'the-jinn', 73: 'the-wrapped-up', 74: 'the-clothe-done', 75: 'the-resurrection',
  76: 'the-man', 77: 'the-emissaries', 78: 'the-great-event', 79: 'those-who-pull-out', 80: 'he-frowned',
  81: 'the-covering-up', 82: 'the-cleaving-asund', 83: 'the-defrauders', 84: 'the-bursting-asund', 85: 'the-mansions-of-the-stars',
  86: 'the-night-comer', 87: 'the-most-high', 88: 'the-overwhelming', 89: 'the-daybreak', 90: 'the-city',
  91: 'the-sun', 92: 'the-night', 93: 'the-early-hours', 94: 'the-expansion', 95: 'the-fig',
  96: 'the-clot', 97: 'the-majesty', 98: 'the-clear-evidence', 99: 'the-shaking', 100: 'the-assaulters',
  101: 'the-terrible-calam', 102: 'the-multiplicatio', 103: 'time', 104: 'the-slanderer', 105: 'the-elephant',
  106: 'the-qureaish', 107: 'the-daily-necessar', 108: 'the-heavenly-fount', 109: 'the-unbelievers', 110: 'the-help',
  111: 'the-flame', 112: 'the-unity', 113: 'the-dawn', 114: 'the-men',
};

function trApiUrl(surahNumber) {
  const slug = TR_SURAH_SLUGS[surahNumber];
  if (!slug) return null;
  return `/kuran-proxy/kelime-meali/turkce/${slug}-suresi/veriler`;
}

function enApiUrl(surahNumber) {
  const slug = EN_SURAH_SLUGS[surahNumber];
  if (!slug) return null;
  return `/kuran-proxy/kelime-meali/english/${slug}/veriler`;
}

// Parse kuran.com response for both TR and EN (same JSON structure, only field name differs)
function stripKuranResponse(json, lang) {
  const entries = Object.values(json).filter(
    (v) => v && typeof v === 'object' && v.ayetno
  );

  const byAyah = {};
  for (const entry of entries) {
    const ayah = entry.ayetno;
    if (!byAyah[ayah]) {
      byAyah[ayah] = {
        verseKey: `${entry.sureno}:${ayah}`,
        ayah,
        words: [],
      };
    }
    const word = { arabic: entry.orjinal || '', translit: entry.kelime_okunus || '' };
    if (lang === 'tr') {
      word.tr = entry.meal || '';
    } else {
      word.en = entry.meal || '';
    }
    byAyah[ayah].words.push(word);
  }

  return Object.values(byAyah).sort((a, b) => a.ayah - b.ayah);
}

export function useInterlinearData(surahNumber, lang = 'en') {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!surahNumber) return;

    const cacheKey = `${CACHE_KEY_PREFIX}${lang}:${surahNumber}`;

    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        setData(JSON.parse(cached));
        return;
      }
    } catch {
      // Cache read failed — proceed to fetch
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    const url = lang === 'tr' ? trApiUrl(surahNumber) : enApiUrl(surahNumber);

    if (!url) {
      setError(`No API URL for surah ${surahNumber} (lang: ${lang})`);
      setLoading(false);
      return;
    }

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        if (cancelled) return;

        const stripped = stripKuranResponse(json, lang);

        try {
          localStorage.setItem(cacheKey, JSON.stringify(stripped));
        } catch {
          // Storage quota exceeded — skip caching silently
        }

        setData(stripped);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message || 'Failed to load interlinear data');
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [surahNumber, lang]);

  return { data, loading, error };
}
