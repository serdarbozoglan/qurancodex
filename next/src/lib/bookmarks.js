// ─── bookmarks.js ─────────────────────────────────────────────────────────
// Global bookmark storage — localStorage, site-wide, item-based.
// Reading Mode'daki sayfa bookmark'ından AYRI (o mushaf sayfa için, bu item için).
//
// Storage key: qurancodex_library
// Format:
//   {
//     "verse:2:255": {
//       type: 'verse' | 'tefsir' | 'article' | 'atlas-kissa' | 'atlas-kavram' | ...
//       id: 'verse:2:255',
//       title: 'El-Bakara 2:255',
//       subtitle: 'Ayete-l Kürsi',  // opsiyonel
//       description: '...',
//       url: '/tr/oku/2?ayah=255',
//       arabic: '...',  // opsiyonel
//       addedAt: timestamp
//     },
//     ...
//   }
// ────────────────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'qurancodex_library';
const MAX_ITEMS = 100;

export function readLibrary() {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch { return {}; }
}

function writeLibrary(lib) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lib));
    // Broadcast — same-tab listeners refresh
    window.dispatchEvent(new CustomEvent('library-changed'));
  } catch (err) {
    // Quota exceeded — evict oldest
    if (err.name === 'QuotaExceededError') {
      const list = Object.values(lib).sort((a, b) => a.addedAt - b.addedAt);
      const evictCount = Math.max(1, Math.floor(list.length / 4));
      for (const item of list.slice(0, evictCount)) delete lib[item.id];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(lib));
        window.dispatchEvent(new CustomEvent('library-changed'));
      } catch { /* still failing — silently skip */ }
    }
  }
}

export function isBookmarked(id) {
  if (!id) return false;
  const lib = readLibrary();
  return !!lib[id];
}

export function addBookmark(item) {
  if (!item || !item.id) return;
  const lib = readLibrary();
  // Cap at MAX_ITEMS — oldest eviction
  if (!lib[item.id] && Object.keys(lib).length >= MAX_ITEMS) {
    const list = Object.values(lib).sort((a, b) => a.addedAt - b.addedAt);
    delete lib[list[0].id];
  }
  lib[item.id] = { ...item, addedAt: Date.now() };
  writeLibrary(lib);
}

export function removeBookmark(id) {
  if (!id) return;
  const lib = readLibrary();
  if (lib[id]) {
    delete lib[id];
    writeLibrary(lib);
  }
}

export function toggleBookmark(item) {
  if (!item || !item.id) return false;
  if (isBookmarked(item.id)) {
    removeBookmark(item.id);
    return false;
  }
  addBookmark(item);
  return true;
}

export function listBookmarks({ type, sort = 'newest' } = {}) {
  const lib = readLibrary();
  let arr = Object.values(lib);
  if (type) arr = arr.filter(x => x.type === type);
  if (sort === 'newest') arr.sort((a, b) => b.addedAt - a.addedAt);
  else if (sort === 'oldest') arr.sort((a, b) => a.addedAt - b.addedAt);
  else if (sort === 'title') arr.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
  return arr;
}

export function libraryStats() {
  const lib = readLibrary();
  const values = Object.values(lib);
  const byType = {};
  for (const item of values) {
    byType[item.type] = (byType[item.type] || 0) + 1;
  }
  return {
    total: values.length,
    byType,
    max: MAX_ITEMS,
  };
}
