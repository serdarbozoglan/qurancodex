'use client';

// ─── RecentQueriesStrip — Anasayfa "Son soruların" (2026-07-16)
// Concierge son 3 sorgusu chip olarak. Sadece geçmiş varsa render.
// SSR-safe: mount öncesi null (hydration mismatch önlemi).
// query-history-changed event + storage event ile cross-tool sync.
// ─────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { COLORS, FONTS } from '../tokens';
import { useLanguage } from '../i18n/LanguageContext';
import { readQueryHistory, QUERY_HISTORY_KEY } from '../lib/query-history';

const MAX_SHOWN = 3;

export default function RecentQueriesStrip() {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const [queries, setQueries] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    setQueries(readQueryHistory().slice(0, MAX_SHOWN));
    setIsMobile(window.innerWidth < 640);

    const refresh = () => setQueries(readQueryHistory().slice(0, MAX_SHOWN));
    const onResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('query-history-changed', refresh);
    const onStorage = (e) => {
      if (e.key === QUERY_HISTORY_KEY) refresh();
    };
    window.addEventListener('storage', onStorage);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('query-history-changed', refresh);
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  // SSR / no-history → render nothing
  if (!mounted || queries.length === 0) return null;

  return (
    <div className="mq-box" style={{
      maxWidth: 900,
      margin: '16px auto 0',
      '--pt-d': "0", '--pt-m': "0", '--pr-d': "32px", '--pr-m': "16px", '--pb-d': "0", '--pb-m': "0", '--pl-d': "32px", '--pl-m': "16px",
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
          {tr ? 'Son Soruların' : 'Your Recent Questions'}
        </div>
        <Link
          href={`/${language}/sor`}
          style={{
            fontSize: '0.7rem',
            color: COLORS.silver,
            opacity: 0.78,
            fontFamily: FONTS.body,
            textDecoration: 'none',
            marginLeft: 'auto',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = '1'; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '0.7'; }}
        >
          {tr ? 'Yeni soru →' : 'New question →'}
        </Link>
      </div>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
      }}>
        {queries.map((entry) => (
          <Link
            key={entry.q + entry.ts}
            href={`/${language}/sor?q=${encodeURIComponent(entry.q)}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '7px 14px',
              background: 'rgba(255,255,255,0.02)',
              border: `1px solid ${COLORS.gold}22`,
              borderRadius: 999,
              textDecoration: 'none',
              color: COLORS.silver,
              fontSize: '0.8rem',
              fontFamily: FONTS.body,
              transition: 'all 0.15s',
              maxWidth: isMobile ? '100%' : 320,
              minWidth: 0,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = `${COLORS.gold}12`;
              e.currentTarget.style.borderColor = `${COLORS.gold}66`;
              e.currentTarget.style.color = COLORS.offWhite;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
              e.currentTarget.style.borderColor = `${COLORS.gold}22`;
              e.currentTarget.style.color = COLORS.silver;
            }}
          >
            <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.7 }}>
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <span style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              minWidth: 0,
            }}>
              {entry.q}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
