'use client';

// ─── BookmarkButton — site-wide global bookmark toggle ───────────────────
// Kullanım:
//   <BookmarkButton item={{ id, type, title, subtitle, description, url, arabic }} />
//
// Reading Mode'daki sayfa bookmark'ından bağımsız. Bu, item-based global library
// içindir (bkz. src/lib/bookmarks.js).
// ────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from 'react';
import { COLORS } from '../tokens';
import { isBookmarked, toggleBookmark } from '../lib/bookmarks';

const SIZE_STYLES = {
  sm: { w: 26, iconSize: 13 },
  md: { w: 32, iconSize: 15 },
  lg: { w: 36, iconSize: 17 },
};

export default function BookmarkButton({ item, size = 'sm', language = 'tr' }) {
  const [saved, setSaved] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Post-mount hydration — SSR safe
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSaved(isBookmarked(item?.id));
    setMounted(true);
    const onChange = () => setSaved(isBookmarked(item?.id));
    window.addEventListener('library-changed', onChange);
    return () => window.removeEventListener('library-changed', onChange);
  }, [item?.id]);

  const handleClick = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();
    const nowSaved = toggleBookmark(item);
    setSaved(nowSaved);
  }, [item]);

  if (!item?.id) return null;

  const { w, iconSize } = SIZE_STYLES[size] || SIZE_STYLES.sm;
  const label = saved
    ? (language === 'tr' ? 'Kütüphaneden çıkar' : 'Remove from library')
    : (language === 'tr' ? 'Kütüphaneye ekle' : 'Add to library');

  return (
    <button
      onClick={handleClick}
      aria-label={label}
      title={label}
      style={{
        width: `${w}px`,
        height: `${w}px`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        background: saved ? `${COLORS.gold}22` : 'rgba(255,255,255,0.04)',
        border: `1px solid ${saved ? `${COLORS.gold}66` : 'rgba(255,255,255,0.1)'}`,
        color: saved ? COLORS.gold : COLORS.silver,
        cursor: 'pointer',
        transition: 'all 0.15s',
        flexShrink: 0,
        opacity: mounted ? 1 : 0.6,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = `${COLORS.gold}26`;
        e.currentTarget.style.borderColor = `${COLORS.gold}88`;
        e.currentTarget.style.color = COLORS.gold;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = saved ? `${COLORS.gold}22` : 'rgba(255,255,255,0.04)';
        e.currentTarget.style.borderColor = saved ? `${COLORS.gold}66` : 'rgba(255,255,255,0.1)';
        e.currentTarget.style.color = saved ? COLORS.gold : COLORS.silver;
      }}
    >
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
      </svg>
    </button>
  );
}
