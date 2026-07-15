// ─── lib/reading-progress.js — Reading Mode kaldığın yerden devam
// (2026-07-15 #175) ──────────────────────────────────────────────────────
// ReadingMode `qurancodex_last_position` → {surah, page, timestamp}
// kaydeder. Bu util anasayfa/kütüphanem tarafından read + formatlanır.
// ─────────────────────────────────────────────────────────────────────────

const KEY = 'qurancodex_last_position';

export function readReadingProgress() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed.surah !== 'number') return null;
    return {
      surah: parsed.surah,
      page: typeof parsed.page === 'number' ? parsed.page : null,
      timestamp: typeof parsed.timestamp === 'number' ? parsed.timestamp : null,
    };
  } catch {
    return null;
  }
}

export function clearReadingProgress() {
  if (typeof window === 'undefined') return;
  try { window.localStorage.removeItem(KEY); } catch { /* silent */ }
}

// Relative time formatting — TR + EN
export function formatRelativeTime(timestamp, language = 'tr') {
  if (!timestamp) return null;
  const tr = language === 'tr';
  const diff = Date.now() - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return tr ? 'az önce' : 'just now';
  if (minutes < 60) return tr ? `${minutes} dk önce` : `${minutes}m ago`;
  if (hours < 24) return tr ? `${hours} saat önce` : `${hours}h ago`;
  if (days === 1) return tr ? 'dün' : 'yesterday';
  if (days < 7) return tr ? `${days} gün önce` : `${days}d ago`;
  if (days < 30) {
    const w = Math.floor(days / 7);
    return tr ? `${w} hafta önce` : `${w}w ago`;
  }
  const months = Math.floor(days / 30);
  return tr ? `${months} ay önce` : `${months}mo ago`;
}
