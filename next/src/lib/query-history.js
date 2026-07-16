// ─── query-history.js — Concierge son sorgu geçmişi ────────────────────────
// Shared utility: SorRoute pushHistory ile buradan okur/yazar.
// localStorage key: qurancodex_query_history
// Format: [{ q: string, lang: 'tr'|'en', ts: number }, ...]  (max 20, newest-first)
// ────────────────────────────────────────────────────────────────────────────

const HISTORY_KEY = 'qurancodex_query_history';
const HISTORY_MAX = 20;

export function readQueryHistory() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

export function writeQueryHistory(list) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, HISTORY_MAX)));
    window.dispatchEvent(new CustomEvent('query-history-changed'));
  } catch { /* quota — skip */ }
}

// Dedup + en başa taşı; TS güncelle
export function pushQueryHistory(q, lang) {
  const normalized = String(q || '').trim();
  if (normalized.length < 3) return;
  const list = readQueryHistory();
  const filtered = list.filter(e => (e.q || '').toLowerCase() !== normalized.toLowerCase());
  filtered.unshift({ q: normalized, lang, ts: Date.now() });
  writeQueryHistory(filtered);
}

export function removeQueryHistory(q) {
  const list = readQueryHistory().filter(e => e.q !== q);
  writeQueryHistory(list);
}

export function clearQueryHistory() {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(HISTORY_KEY);
    window.dispatchEvent(new CustomEvent('query-history-changed'));
  } catch { /* silent */ }
}

export const QUERY_HISTORY_KEY = HISTORY_KEY;
