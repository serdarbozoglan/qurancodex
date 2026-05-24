'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { COLORS, FONTS } from '../tokens';

const QURAN_CDN = 'https://audio.qurancdn.com/';

// CLAUDE.md §13.15 — KFGQPC + ShaykhHamdullah fontları yalnızca standart Arabic
// Unicode ile düzgün çalışır. Uthmani-özel karakterleri normalize et ki tooltip
// büyük puntoda tofu/circle göstermesin (örn. الْعَالَم۪ينَ'deki U+06EA).
// NOT: Ortak lib/arabic.js cleanArabicForDisplay'den FARKLI: (1) maddah fix yok,
// (2) ۦ→space DEĞİL strip (tek kelime tooltip için ayraç gereksiz), (3) Leeds
// artifact'leri (@#_) strip listesinde. Component-local bırakıldı.
function cleanArabicForTooltip(s) {
  if (!s) return s;
  return s
    .replace(/۪/g, 'ِ')   // Uthmani subscript kasra → standart kasra
    .replace(/ۡ/g, 'ْ')   // Uthmani sukun → standart sukun
    .replace(/ٱ/g, 'ا')   // Alef wasla → düz alef
    .replace(/ی/g, 'ي')   // Farsi yeh → Arabic yeh
    .replace(/[ؐ-ؔؖؗ]/g, '')  // Islamic phrase abbreviations
    .replace(/[؀-؅]/g, '')              // Quranic number marks
    .replace(/[۝۞۩]/g, '')          // Ayet sonu, rub el hizb, sajda
    .replace(/[ۖ-ۜ۟۠ۢ-ۤۧۨ۫-ۭ]/g, '')
    .replace(/[@#_]/g, '');         // Leeds corpus artifacts
}

// Floating tooltip shown near a word. Positions itself to avoid viewport edges.
// audio: plays a per-word mp3 from quran.com CDN (same source kuran.com points to).
export default function WordTooltip({ word, anchorRect, onClose, language, dayMode }) {
  const ref = useRef(null);
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  // `ready` gates the first paint until useLayoutEffect has measured + placed
  // the tooltip. Without it, hovering quickly between words produced a brief
  // top-left flash because the initial render painted at (0,0) before
  // positioning ran on the next tick.
  const [pos, setPos] = useState({ top: 0, left: 0, arrowSide: 'bottom', ready: false });

  // Compute position based on anchor + measured tooltip size. useLayoutEffect
  // runs synchronously after DOM mutations but BEFORE the browser paints, so
  // the corrected position is applied in the same frame as the mount.
  useLayoutEffect(() => {
    if (!anchorRect || !ref.current) return;
    const el = ref.current;
    const ww = window.innerWidth;
    const wh = window.innerHeight;
    const tw = el.offsetWidth || 220;
    const th = el.offsetHeight || 120;
    const gap = 10;
    // Prefer above the word; if no room, put below
    let top = anchorRect.top - th - gap;
    let arrowSide = 'bottom';
    if (top < 12) { top = anchorRect.bottom + gap; arrowSide = 'top'; }
    // Horizontal: center on anchor, clamp to viewport
    let left = anchorRect.left + anchorRect.width / 2 - tw / 2;
    left = Math.max(8, Math.min(ww - tw - 8, left));
    // Clamp top too
    top = Math.max(8, Math.min(wh - th - 8, top));
    // eslint-disable-next-line react-hooks/set-state-in-effect -- canonical useLayoutEffect measure-then-position pattern.
    setPos({ top, left, arrowSide, ready: true });
  }, [anchorRect, word]);

  // Close on Escape / scroll / resize
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    const handleScroll = () => onClose();
    window.addEventListener('keydown', handleKey);
    window.addEventListener('resize', onClose);
    document.addEventListener('scroll', handleScroll, true);
    return () => {
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('resize', onClose);
      document.removeEventListener('scroll', handleScroll, true);
    };
  }, [onClose]);

  // Cleanup audio on unmount
  useEffect(() => () => { if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; } }, []);

  if (!word) return null;

  const C = dayMode ? {
    bg:       '#fdfaed',
    border:   'rgba(100,60,10,0.28)',
    shadow:   '0 10px 30px rgba(0,0,0,0.18)',
    text:     '#2a1a08',
    translit: '#6b4420',
    tr:       '#3a2410',
    gold:     '#8b6914',
    btnBg:    'rgba(139,105,20,0.08)',
  } : {
    bg:       '#0d1b2a',
    border:   COLORS.goldAlpha25,
    shadow:   '0 10px 30px rgba(0,0,0,0.55)',
    text:     COLORS.offWhite,
    translit: COLORS.silver,
    tr:       COLORS.offWhite,
    gold:     COLORS.gold,
    btnBg:    'rgba(212,165,116,0.12)',
  };

  const handleAudio = () => {
    if (!word.read_url) return;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setPlaying(false);
      return;
    }
    // read_url is either full URL or relative path like "wbw/001_001_001.mp3"
    const src = word.read_url.startsWith('http') ? word.read_url : `${QURAN_CDN}${word.read_url.replace(/^\//, '')}`;
    const a = new Audio(src);
    audioRef.current = a;
    setPlaying(true);
    a.onended = () => { audioRef.current = null; setPlaying(false); };
    a.onerror = () => { audioRef.current = null; setPlaying(false); };
    a.play().catch(() => { audioRef.current = null; setPlaying(false); });
  };

  return (
    <div
      ref={ref}
      onClick={(e) => e.stopPropagation()}
      style={{
        position: 'fixed',
        top: pos.top, left: pos.left,
        zIndex: 210,
        minWidth: '180px', maxWidth: '260px',
        padding: '10px 14px',
        background: C.bg,
        border: `1px solid ${C.border}`,
        borderRadius: '10px',
        boxShadow: C.shadow,
        fontFamily: FONTS.body,
        color: C.text,
        pointerEvents: pos.ready ? 'auto' : 'none',
        userSelect: 'text',
        // Hide the tooltip until layout has measured and positioned it,
        // otherwise rapid hover-swipes between words flash an unpositioned
        // shell at the top-left corner of the viewport for one frame.
        visibility: pos.ready ? 'visible' : 'hidden',
      }}
    >
      {/* Arabic */}
      <div
        dir="rtl" lang="ar"
        style={{
          fontFamily: FONTS.quran,
          fontSize: '1.8rem',
          lineHeight: 1.4,
          color: C.gold,
          textAlign: 'center',
          marginBottom: '6px',
        }}
      >
        {cleanArabicForTooltip(word.arabic)}
      </div>
      {/* Transliteration */}
      {word.translit && (
        <div style={{ textAlign: 'center', fontSize: '0.78rem', color: C.translit, fontStyle: 'italic', letterSpacing: '0.02em', marginBottom: '6px' }}>
          {word.translit}
        </div>
      )}
      {/* Translation */}
      <div style={{ textAlign: 'center', fontSize: '0.9rem', color: C.tr, fontWeight: 500, lineHeight: 1.4, marginBottom: word.read_url ? '10px' : 0 }}>
        {word.tr || word.en || (language === 'tr' ? '(anlam yok)' : '(no translation)')}
      </div>
      {/* Audio button */}
      {word.read_url && (
        <button
          onClick={handleAudio}
          aria-label={language === 'tr' ? 'Kelimeyi dinle' : 'Listen to word'}
          style={{
            width: '100%', padding: '6px 10px',
            background: C.btnBg,
            border: `1px solid ${C.gold}33`,
            borderRadius: '6px',
            color: C.gold, fontSize: '0.78rem', fontWeight: 600,
            cursor: 'pointer', letterSpacing: '0.04em',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            fontFamily: FONTS.body,
          }}
        >
          {playing
            ? <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/></svg>
            : <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>}
          <span>{playing ? (language === 'tr' ? 'Durdur' : 'Stop') : (language === 'tr' ? 'Dinle' : 'Play')}</span>
        </button>
      )}
    </div>
  );
}
