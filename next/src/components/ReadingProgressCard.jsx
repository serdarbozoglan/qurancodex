'use client';

// ─── ReadingProgressCard — Anasayfa "Kaldığın yerden devam et" (2026-07-15 #175)
// localStorage.qurancodex_last_position okur → sadece progress varsa render.
// SSR-safe: mount öncesi null (hydration mismatch önlemi).
// ─────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { COLORS, FONTS, STATUS } from '../tokens';
import { useLanguage } from '../i18n/LanguageContext';
import { readReadingProgress, formatRelativeTime, clearReadingProgress } from '../lib/reading-progress';
import { SURAH_NAMES_TR, SURAH_NAMES_EN } from '../lib/surahNames';

export default function ReadingProgressCard() {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const [progress, setProgress] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    setProgress(readReadingProgress());
    setIsMobile(window.innerWidth < 640);
    const h = () => setIsMobile(window.innerWidth < 640);
    const onStorage = (e) => {
      if (e.key === 'qurancodex_last_position') setProgress(readReadingProgress());
    };
    window.addEventListener('resize', h);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('resize', h);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  // SSR / no-progress → hiçbir şey render etme (hydration mismatch önlenir)
  if (!mounted || !progress) return null;

  const nameTr = SURAH_NAMES_TR?.[progress.surah - 1] || `Sure ${progress.surah}`;
  const nameEn = SURAH_NAMES_EN?.[progress.surah - 1] || `Sūrah ${progress.surah}`;
  const surahName = tr ? nameTr : nameEn;
  const relative = formatRelativeTime(progress.timestamp, language);

  const href = `/${language}/oku/${progress.surah}${progress.page ? `?page=${progress.page}` : ''}`;

  const handleClear = (e) => {
    e.preventDefault();
    e.stopPropagation();
    clearReadingProgress();
    setProgress(null);
  };

  return (
    <div style={{
      maxWidth: 900,
      margin: '0 auto',
      padding: isMobile ? '0 16px' : '0 32px',
    }}>
      <Link
        href={href}
        style={{
          display: 'block',
          textDecoration: 'none',
          background: `linear-gradient(135deg, ${COLORS.gold}12, ${COLORS.gold}06)`,
          border: `1px solid ${COLORS.gold}44`,
          borderRadius: 12,
          padding: isMobile ? '14px 16px' : '18px 22px',
          position: 'relative',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = `${COLORS.gold}88`;
          e.currentTarget.style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = `${COLORS.gold}44`;
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Bookmark icon */}
          <div style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: `${COLORS.gold}22`,
            border: `1px solid ${COLORS.gold}55`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            color: COLORS.gold,
          }}>
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </div>

          {/* Text */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: '0.7rem',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: COLORS.gold,
              fontWeight: 700,
              opacity: 0.8,
              marginBottom: 4,
            }}>
              {tr ? 'Kaldığın yerden devam et' : 'Continue reading'}
            </div>
            <div style={{
              fontFamily: FONTS.body,
              fontSize: isMobile ? '0.95rem' : '1.02rem',
              color: COLORS.offWhite,
              fontWeight: 600,
              lineHeight: 1.35,
            }}>
              {surahName}
              {progress.page && (
                <span style={{ color: COLORS.silver, fontWeight: 400, marginLeft: 8, fontSize: '0.85rem' }}>
                  · {tr ? `Sayfa ${progress.page}` : `Page ${progress.page}`}
                </span>
              )}
            </div>
            {relative && (
              <div style={{
                fontSize: '0.72rem',
                color: COLORS.silver,
                opacity: 0.7,
                marginTop: 3,
                fontFamily: FONTS.body,
              }}>
                {relative}
              </div>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <button
              onClick={handleClear}
              aria-label={tr ? 'Kaydı sil' : 'Clear'}
              title={tr ? 'Kaydı sil' : 'Clear'}
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'transparent',
                color: COLORS.silver,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(231,76,60,0.5)'; e.currentTarget.style.color = STATUS.error; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = COLORS.silver; }}
            >
              <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
            <span style={{
              color: COLORS.gold,
              fontSize: '1.2rem',
              lineHeight: 1,
              opacity: 0.75,
            }}>→</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
