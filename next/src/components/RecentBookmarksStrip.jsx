'use client';

// ─── RecentBookmarksStrip — Anasayfa "Son yer imlerin" (2026-07-16)
// Kullanıcının son 3 bookmark'ını chip olarak gösterir. Sadece bookmark varsa render.
// SSR-safe: mount öncesi null (hydration mismatch önlemi).
// library-changed event ile cross-tool sync.
// ─────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { COLORS, FONTS } from '../tokens';
import { useLanguage } from '../i18n/LanguageContext';
import { listBookmarks } from '../lib/bookmarks';

const MAX_SHOWN = 3;

// Type → kısa TR/EN label + accent (visual hint)
const TYPE_LABELS = {
  'verse':                          { tr: 'Ayet',           en: 'Verse',            icon: '﷽' },
  'tefsir':                         { tr: 'Tefsir',         en: 'Tafsīr',           icon: '📖' },
  'article':                        { tr: 'Makale',         en: 'Article',          icon: '✎' },
  'atlas-kissa-scene':              { tr: 'Kıssa',          en: 'Story',            icon: '★' },
  'atlas-ahiret-yolculugu-stage':   { tr: 'Ahiret',         en: 'Afterlife',        icon: '☾' },
  'atlas-kavram':                   { tr: 'Kavram',         en: 'Concept',          icon: '✧' },
  'surah-summary':                  { tr: 'Sûre',           en: 'Sūrah',            icon: '§' },
  'pericope':                       { tr: 'Ayet Grubu',     en: 'Pericope',         icon: '¶' },
  'sebeb-nuzul':                    { tr: 'Sebeb-i Nüzûl',  en: 'Occasion',         icon: '⌛' },
  'wowfact':                        { tr: 'Wow',            en: 'Wow',              icon: '✨' },
  'atlas-kadin':                    { tr: 'Kadın',          en: 'Woman',            icon: '☙' },
  'atlas-kavim':                    { tr: 'Kavim',          en: 'Nation',           icon: '⚑' },
  'atlas-mesel':                    { tr: 'Mesel',          en: 'Parable',          icon: '❈' },
};

function typeMeta(type, tr) {
  const meta = TYPE_LABELS[type];
  if (!meta) return { label: tr ? 'İçerik' : 'Item', icon: '•' };
  return { label: tr ? meta.tr : meta.en, icon: meta.icon };
}

export default function RecentBookmarksStrip() {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const [bookmarks, setBookmarks] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    setBookmarks(listBookmarks({ sort: 'newest' }).slice(0, MAX_SHOWN));
    setIsMobile(window.innerWidth < 640);

    const refresh = () => setBookmarks(listBookmarks({ sort: 'newest' }).slice(0, MAX_SHOWN));
    const onResize = () => setIsMobile(window.innerWidth < 640);
    // Same-tab: custom event fired by bookmarks.js on write
    window.addEventListener('library-changed', refresh);
    // Cross-tab: native storage event
    const onStorage = (e) => {
      if (e.key === 'qurancodex_library') refresh();
    };
    window.addEventListener('storage', onStorage);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('library-changed', refresh);
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  // SSR / no-bookmarks → render nothing (hydration mismatch önlenir)
  if (!mounted || bookmarks.length === 0) return null;

  return (
    <div style={{
      maxWidth: 900,
      margin: '20px auto 0',
      padding: isMobile ? '0 16px' : '0 32px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
        <div style={{
          fontSize: '0.66rem',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: COLORS.gold,
          fontWeight: 700,
          opacity: 0.75,
          fontFamily: FONTS.body,
        }}>
          {tr ? 'Son Yer İmlerin' : 'Your Recent Bookmarks'}
        </div>
        <Link
          href={`/${language}/kutuphanem`}
          style={{
            fontSize: '0.7rem',
            color: COLORS.silver,
            opacity: 0.7,
            fontFamily: FONTS.body,
            textDecoration: 'none',
            marginLeft: 'auto',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = '1'; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '0.7'; }}
        >
          {tr ? 'Tümü →' : 'All →'}
        </Link>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : `repeat(${bookmarks.length}, 1fr)`,
        gap: 8,
      }}>
        {bookmarks.map((bm) => {
          const meta = typeMeta(bm.type, tr);
          return (
            <Link
              key={bm.id}
              href={bm.url || '#'}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 14px',
                background: 'rgba(255,255,255,0.02)',
                border: `1px solid ${COLORS.gold}22`,
                borderRadius: 10,
                textDecoration: 'none',
                transition: 'all 0.15s',
                minWidth: 0,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = `${COLORS.gold}08`;
                e.currentTarget.style.borderColor = `${COLORS.gold}55`;
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                e.currentTarget.style.borderColor = `${COLORS.gold}22`;
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span style={{
                color: COLORS.gold,
                fontSize: '1rem',
                opacity: 0.7,
                flexShrink: 0,
                width: 20,
                textAlign: 'center',
                fontFamily: bm.type === 'verse' ? "'Amiri Quran', serif" : FONTS.body,
              }}>
                {meta.icon}
              </span>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{
                  fontSize: '0.62rem',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: COLORS.gold,
                  opacity: 0.7,
                  fontFamily: FONTS.body,
                  fontWeight: 700,
                  marginBottom: 2,
                }}>
                  {meta.label}
                </div>
                <div style={{
                  fontFamily: FONTS.body,
                  fontSize: '0.82rem',
                  color: COLORS.offWhite,
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {bm.title || (tr ? 'Kaydedilen içerik' : 'Saved item')}
                </div>
              </div>
              <span style={{
                color: COLORS.gold,
                opacity: 0.55,
                fontSize: '0.9rem',
                flexShrink: 0,
              }}>→</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
