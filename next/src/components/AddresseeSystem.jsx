'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS, OVERLAY_BASE, OVERLAY_HEADER, OVERLAY_TITLE, CLOSE_BTN, BREAKPOINT_MOBILE } from '../tokens';

const INITIAL_SHOW = 2;

export default function AddresseeSystem({ onClose }) {
  const { language } = useLanguage();
  const [data, setData]         = useState(null);
  const [activeId, setActiveId] = useState('iman');
  const [expanded, setExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false)  // SSR-safe; useEffect h() post-mount hydrate;

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < BREAKPOINT_MOBILE);
    h(); // post-mount hydrate
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  useEffect(() => {
    fetch('/addressees.json')
      .then(r => r.json())
      .then(setData)
      .catch(err => console.error('[AddresseeSystem] fetch failed:', err));
  }, []);

  // Escape to close (§13.3)
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  // Body scroll lock — CLAUDE.md §13.16 Katman 1 (tek scrollbar kuralı)
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;
    const prevPad  = body.style.paddingRight;
    const sbWidth = window.innerWidth - html.clientWidth;
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    if (sbWidth > 0) body.style.paddingRight = `${sbWidth}px`;
    return () => {
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
      body.style.paddingRight = prevPad;
    };
  }, []);

  const categories = (data?.categories ?? []).slice().sort((a, b) => (b.stats?.count ?? 0) - (a.stats?.count ?? 0));
  const active     = categories.find(c => c.id === activeId) ?? null;
  const accent     = active?.accent ?? COLORS.gold;

  function selectCategory(id) {
    setActiveId(id);
    setExpanded(false);
  }

  const shownVerses = active
    ? expanded
      ? active.example_verses
      : active.example_verses.slice(0, INITIAL_SHOW)
    : [];

  const hiddenCount = active
    ? active.example_verses.length - INITIAL_SHOW
    : 0;

  // ── Loading skeleton ─────────────────────────────────────────────────────────
  if (!data) {
    return (
      <div style={{ ...OVERLAY_BASE, display: 'flex', flexDirection: 'column' }}>
        <div style={{ ...OVERLAY_HEADER }}>
          <span style={{ ...OVERLAY_TITLE }}>
            {language === 'tr' ? 'Muhatap Sistemi' : 'Addressee System'}
          </span>
          <button style={{ ...CLOSE_BTN }} onClick={onClose}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = COLORS.offWhite; }}
            onMouseLeave={e => { e.currentTarget.style.background = CLOSE_BTN.background; e.currentTarget.style.color = COLORS.silver; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: COLORS.silver, fontSize: '0.9rem' }}>
            {language === 'tr' ? 'Yükleniyor...' : 'Loading...'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ ...OVERLAY_BASE, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* ── HEADER ───────────────────────────────────────────────────────────── */}
      <div style={{ ...OVERLAY_HEADER }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          <span style={{ ...OVERLAY_TITLE, flexShrink: 0 }}>
            {language === 'tr' ? 'Muhatap Sistemi' : 'Addressee System'}
          </span>
          {active && (
            <>
              <span style={{ color: COLORS.slate500, fontSize: '0.8rem', flexShrink: 0 }}>›</span>
              <span style={{
                color: accent, fontSize: '0.82rem', fontWeight: 600,
                fontFamily: FONTS.body, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {language === 'tr' ? active.tr : active.en}
              </span>
            </>
          )}
        </div>
        <button
          onClick={onClose}
          style={{ ...CLOSE_BTN }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = COLORS.offWhite; }}
          onMouseLeave={e => { e.currentTarget.style.background = CLOSE_BTN.background; e.currentTarget.style.color = COLORS.silver; }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* ── CHIP ROW ─────────────────────────────────────────────────────────── */}
      <div style={{
        flexShrink: 0,
        display: 'flex', gap: '6px', overflowX: 'auto',
        padding: '10px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(0,0,0,0.2)',
        scrollbarWidth: 'none',
      }}>
        {categories.map(cat => {
          const isActive = cat.id === activeId;
          return (
            <button
              key={cat.id}
              onClick={() => selectCategory(cat.id)}
              style={{
                flexShrink: 0,
                padding: '5px 14px',
                borderRadius: '20px',
                border: `1px solid ${isActive ? cat.accent : 'rgba(255,255,255,0.1)'}`,
                background: isActive ? `${cat.accent}22` : 'transparent',
                color: isActive ? cat.accent : COLORS.silver,
                fontSize: '0.8rem', fontWeight: isActive ? 600 : 400,
                fontFamily: FONTS.body,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {language === 'tr' ? cat.tr : cat.en}
            </button>
          );
        })}
      </div>

      {/* ── BODY (sidebar + detail) ───────────────────────────────────────────── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Sidebar — hidden on mobile, chip row handles navigation there */}
        <div style={{
          width: '200px', flexShrink: 0,
          borderRight: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(255,255,255,0.02)',
          overflowY: 'auto',
          display: isMobile ? 'none' : 'flex', flexDirection: 'column',
          padding: '12px 0',
        }}>
          <div style={{
            padding: '0 16px 8px',
            fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: COLORS.slate500,
            fontFamily: FONTS.body,
          }}>
            {language === 'tr' ? 'Muhataplar' : 'Addressees'}
          </div>

          {categories.map(cat => {
            const isActive = cat.id === activeId;
            return (
              <button
                key={cat.id}
                onClick={() => selectCategory(cat.id)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '9px 16px',
                  background: isActive ? `${cat.accent}14` : 'transparent',
                  borderLeft: `3px solid ${isActive ? cat.accent : 'transparent'}`,
                  border: 'none',
                  color: isActive ? cat.accent : COLORS.silver,
                  fontSize: '0.83rem', fontWeight: isActive ? 600 : 400,
                  fontFamily: FONTS.body,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  textAlign: 'left',
                  width: '100%',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
              >
                <span>{language === 'tr' ? cat.tr : cat.en}</span>
                <span style={{
                  fontSize: '0.72rem',
                  color: isActive ? cat.accent : COLORS.slate500,
                  fontWeight: 700,
                }}>
                  {cat.stats.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Detail panel */}
        <div style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '16px' : '28px 32px' }}>
          {active && (
            <>
              {/* Arabic hitap */}
              <div style={{
                fontFamily: FONTS.quran,
                fontSize: isMobile ? '1.5rem' : '2rem',
                color: accent,
                direction: 'rtl',
                textAlign: 'right',
                lineHeight: 1.8,
                marginBottom: '12px',
              }}>
                {active.arabic}
              </div>

              {/* Turkish name */}
              <h2 style={{
                color: COLORS.offWhite, fontSize: '1.25rem',
                fontWeight: 700, fontFamily: FONTS.body,
                margin: '0 0 8px 0',
              }}>
                {language === 'tr' ? active.tr : active.en}
              </h2>

              {/* Description */}
              <p style={{
                color: COLORS.silver, fontSize: '0.88rem',
                lineHeight: 1.7, margin: '0 0 24px 0',
                fontFamily: FONTS.body,
                maxWidth: '680px',
              }}>
                {language === 'tr' ? active.desc.tr : active.desc.en}
              </p>

              {/* ── Stats ── */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                gap: '12px',
                marginBottom: '28px',
              }}>
                <StatBox
                  label={language === 'tr' ? 'Hitap' : 'Addresses'}
                  value={active.stats.count}
                  valueColor={accent}
                />
                <StatBox
                  label={language === 'tr' ? (active.stats.medeni_percent >= 50 ? '% Medenî' : '% Mekkî') : (active.stats.medeni_percent >= 50 ? '% Medinan' : '% Meccan')}
                  value={active.stats.medeni_percent >= 50 ? active.stats.medeni_percent : 100 - active.stats.medeni_percent}
                  valueColor="#4caf7d"
                />
                <StatBox
                  label={language === 'tr' ? 'Sûre' : 'Surahs'}
                  value={active.stats.sure_count}
                  valueColor="#4a9ee8"
                />
                <StatBox
                  label={language === 'tr' ? 'Yoğun Sûreler' : 'Top Surahs'}
                  value={active.stats.yogun_sureler.slice(0, 2).join(', ')}
                  valueColor={COLORS.gold}
                  small
                />
              </div>

              {/* ── Theme map ── */}
              <div style={{ marginBottom: '28px' }}>
                <SectionTitle language={language} tr="Tema Haritası" en="Theme Map" />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {(language === 'tr' ? active.themes.tr : active.themes.en).map(theme => (
                    <span key={theme} style={{
                      padding: '5px 12px',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '20px',
                      color: COLORS.offWhite,
                      fontSize: '0.8rem',
                      fontFamily: FONTS.body,
                    }}>
                      {theme}
                    </span>
                  ))}
                </div>
              </div>

              {/* ── Example verses ── */}
              <div>
                <SectionTitle language={language} tr="Örnek Ayetler" en="Example Verses" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {shownVerses.map((v, i) => (
                    <VerseCard key={i} verse={v} accent={accent} language={language} />
                  ))}
                </div>

                {!expanded && hiddenCount > 0 && (
                  <button
                    onClick={() => setExpanded(true)}
                    style={{
                      marginTop: '14px',
                      padding: '8px 18px',
                      background: 'transparent',
                      border: `1px solid ${accent}44`,
                      borderRadius: '8px',
                      color: accent,
                      fontSize: '0.82rem',
                      fontFamily: FONTS.body,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = `${accent}11`; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    + {hiddenCount} {language === 'tr' ? 'ayet daha göster' : 'more verses'}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatBox({ label, value, valueColor, small = false }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '10px',
      padding: '14px 16px',
    }}>
      <div style={{
        color: valueColor,
        fontSize: small ? '0.88rem' : '1.6rem',
        fontWeight: 700,
        fontFamily: FONTS.body,
        lineHeight: 1.1,
        marginBottom: '4px',
      }}>
        {value}
      </div>
      <div style={{
        color: COLORS.slate500,
        fontSize: '0.72rem',
        fontFamily: FONTS.body,
        letterSpacing: '0.03em',
      }}>
        {label}
      </div>
    </div>
  );
}

function SectionTitle({ language, tr, en }) {
  return (
    <div style={{
      color: COLORS.silver,
      fontSize: '0.75rem',
      fontWeight: 700,
      fontFamily: FONTS.body,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      marginBottom: '12px',
    }}>
      {language === 'tr' ? tr : en}
    </div>
  );
}

function VerseCard({ verse, accent, language }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderLeft: `3px solid ${accent}`,
      borderRadius: '10px',
      padding: '16px 18px',
    }}>
      {/* Arabic */}
      <div style={{
        fontFamily: FONTS.quran,
        fontSize: '1.5rem',
        color: accent,
        direction: 'rtl',
        textAlign: 'right',
        lineHeight: 2,
        marginBottom: '8px',
      }} dir="rtl" lang="ar">
        {verse.arabic}
      </div>

      {/* Ref + topic */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        marginBottom: '6px',
      }}>
        <span style={{
          color: COLORS.slate500, fontSize: '0.72rem',
          fontFamily: FONTS.body,
        }}>
          {verse.surah} {verse.ref}
        </span>
        {verse.topic && (
          <>
            <span style={{ color: COLORS.slate500, fontSize: '0.7rem' }}>·</span>
            <span style={{
              color: COLORS.silver, fontSize: '0.72rem',
              fontFamily: FONTS.body,
            }}>
              {language === 'tr' ? verse.topic.tr : verse.topic.en}
            </span>
          </>
        )}
      </div>

      {/* Translation */}
      <div style={{
        color: COLORS.offWhite,
        fontSize: '0.88rem',
        fontFamily: FONTS.body,
        fontStyle: 'italic',
        lineHeight: 1.65,
      }}>
        {language === 'tr' ? verse.tr : verse.en}
      </div>
    </div>
  );
}
