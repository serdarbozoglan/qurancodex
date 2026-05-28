'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import SectionWrapper, { fadeUpItem } from '../components/SectionWrapper';
import { useAudioWithFallback } from '../hooks/useAudioWithFallback';
import { PlayIcon, PauseIcon } from '../components/icons';
import { COLORS, FONTS, RADIUS, BREAKPOINT_MOBILE } from '../tokens';

// Parse references like "Yusuf, 12:84", "Tawba 9:128", or "12:84"
function parseRef(ref) {
  if (!ref) return null;
  const m = String(ref).match(/(\d+)\s*[:,]\s*(\d+)/);
  if (!m) return null;
  return { surah: parseInt(m[1], 10), ayah: parseInt(m[2], 10) };
}

function VerseAudioButton({ surah, ayah, accentColor }) {
  const { playing, loading, failed, toggle } = useAudioWithFallback(surah, ayah);
  const disabled = failed;
  return (
    <button
      onClick={(e) => { e.stopPropagation(); if (!disabled) toggle(); }}
      disabled={disabled}
      aria-label={playing ? 'Pause' : 'Play verse'}
      style={{
        width: 26, height: 26, borderRadius: RADIUS.full, flexShrink: 0,
        background: disabled ? 'rgba(100,116,139,0.08)' : playing ? `${accentColor}28` : `${accentColor}12`,
        border: `1px solid ${disabled ? 'rgba(100,116,139,0.2)' : playing ? `${accentColor}80` : `${accentColor}30`}`,
        color: disabled ? '#475569' : accentColor,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.15s',
        marginLeft: 'auto',
      }}
    >
      {loading ? (
        <svg aria-hidden="true" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
        </svg>
      ) : playing ? (
        <PauseIcon size={10} />
      ) : (
        <PlayIcon size={10} />
      )}
    </button>
  );
}

const MAIN_TABS = ['nefs', 'kalp', 'korku', 'savunma', 'yusuf', 'sosyal', 'araclar', 'anlam', 'modern'];
const APPENDIX_TABS = ['a', 'b', 'c'];

const TAB_META = {
  nefs:     { color: '#8B5CF6', dim: 'rgba(139,92,246,0.12)',  border: 'rgba(139,92,246,0.35)' },
  kalp:     { color: '#F43F5E', dim: 'rgba(244,63,94,0.12)',   border: 'rgba(244,63,94,0.35)'  },
  korku:    { color: '#F59E0B', dim: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.35)' },
  savunma:  { color: '#6366F1', dim: 'rgba(99,102,241,0.12)',  border: 'rgba(99,102,241,0.35)' },
  yusuf:    { color: '#10B981', dim: 'rgba(16,185,129,0.12)',  border: 'rgba(16,185,129,0.35)' },
  sosyal:   { color: '#0EA5E9', dim: 'rgba(14,165,233,0.12)',  border: 'rgba(14,165,233,0.35)' },
  araclar:  { color: '#14B8A6', dim: 'rgba(20,184,166,0.12)',  border: 'rgba(20,184,166,0.35)' },
  anlam:    { color: '#A855F7', dim: 'rgba(168,85,247,0.12)',  border: 'rgba(168,85,247,0.35)' },
  modern:   { color: '#F97316', dim: 'rgba(249,115,22,0.12)',  border: 'rgba(249,115,22,0.35)' },
  ekler:    { color: '#94A3B8', dim: 'rgba(148,163,184,0.10)', border: 'rgba(148,163,184,0.30)' },
};

const TAB_ICONS = {
  nefs: (
    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 6v6l4 2"/>
    </svg>
  ),
  kalp: (
    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ),
  korku: (
    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  savunma: (
    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
    </svg>
  ),
  yusuf: (
    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  sosyal: (
    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  araclar: (
    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
    </svg>
  ),
  anlam: (
    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  ),
  modern: (
    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v11m0 0H5m4 0h10m0-11v11m0 0h-4"/><rect x="4" y="14" width="6" height="7"/><rect x="14" y="14" width="6" height="7"/>
    </svg>
  ),
  ekler: (
    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
    </svg>
  ),
};

function AccordionItem({ item, accentColor }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        background: open ? 'rgba(255,255,255,0.045)' : 'rgba(255,255,255,0.025)',
        border: `1px solid ${open ? accentColor + '55' : 'rgba(255,255,255,0.07)'}`,
        borderRadius: '12px',
        transition: 'all 0.25s ease',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', padding: '14px 18px',
          background: 'none', border: 'none', cursor: 'pointer',
          textAlign: 'left', gap: '12px',
        }}
      >
        <span style={{
          fontFamily: "'Inter', sans-serif", fontWeight: 600,
          fontSize: '0.9rem', color: open ? '#e8e6e3' : '#94a3b8',
          lineHeight: 1.4, transition: 'color 0.2s',
        }}>
          {item.title}
        </span>
        <svg
          aria-hidden="true"
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke={open ? accentColor : '#64748b'} strokeWidth="2.5" strokeLinecap="round"
          style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s, stroke 0.2s' }}
        >
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {/* Body */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '0 18px 18px' }}>

              {/* Arabic verse */}
              {item.arabic && (
                <div style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: `1px solid ${accentColor}33`,
                  borderRadius: '10px',
                  padding: '14px 18px',
                  marginBottom: '14px',
                }}>
                  <p style={{
                    fontFamily: "'KFGQPC', 'Amiri Quran', serif",
                    fontSize: '1.5rem', color: '#d4a574',
                    lineHeight: 1.8, direction: 'rtl',
                    textAlign: 'right',
                    margin: '0 0 8px',
                  }}>
                    {item.arabic}
                  </p>
                  <p style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '0.82rem', color: '#94a3b8',
                    fontStyle: 'italic', margin: '0 0 4px',
                  }}>
                    {item.translation}
                  </p>
                  {item.reference && (() => {
                    const ref = parseRef(item.reference);
                    return (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <p style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: '0.72rem', color: accentColor,
                          margin: 0, opacity: 0.8,
                        }}>
                          {item.reference}
                        </p>
                        {ref && <VerseAudioButton surah={ref.surah} ayah={ref.ayah} accentColor={accentColor} />}
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Description */}
              <p style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.875rem', color: '#c8c5c0',
                lineHeight: 1.75, margin: '0 0 12px',
              }}>
                {item.description}
              </p>

              {/* Modern note */}
              {item.modernNote && (
                <div style={{
                  display: 'flex', gap: '10px', alignItems: 'flex-start',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderLeft: `3px solid ${accentColor}`,
                  borderRadius: '0 8px 8px 0',
                  padding: '10px 14px',
                }}>
                  <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2" style={{ flexShrink: 0, marginTop: 2 }}>
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <p style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '0.78rem', color: '#7a8899',
                    lineHeight: 1.6, margin: 0,
                  }}>
                    {item.modernNote}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Cross-page CTA: opens an Atlas overlay relevant to the tab content
const TAB_CTA = {
  nefs: {
    event: 'openNefisMertebeleri',
    labelTr: '↗ NEFSİN MERTEBELERİ ATLAS — TAM 7 MAKÂM',
    labelEn: '↗ STAGES OF THE SOUL ATLAS — FULL 7 STATIONS',
    descTr: 'Tasavvufî sistematik (Necmeddin Kübra) — bu sayfadaki 5\'li özetin tam karşılığı',
    descEn: 'Sufi systematization (Najm al-Dīn Kubrā) — the full counterpart to this page\'s 5-stage summary',
  },
  yusuf: {
    event: 'openProphetAtlas',
    labelTr: '↗ PEYGAMBERLER ATLAS — HZ. YUSUF',
    labelEn: '↗ PROPHETS ATLAS — JOSEPH (AS)',
    descTr: 'Kıssanın tam zaman çizelgesi, mekânlar ve aile bağları',
    descEn: 'Full timeline of the narrative, locations and family ties',
  },
};

function TabCTA({ cfg, accentColor, language }) {
  return (
    <button
      onClick={() => window.dispatchEvent(new CustomEvent(cfg.event))}
      style={{
        marginTop: '20px',
        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 18px', borderRadius: '12px',
        background: `${accentColor}10`,
        border: `1px solid ${accentColor}40`,
        cursor: 'pointer', textAlign: 'left',
        transition: 'all 0.2s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = `${accentColor}18`;
        e.currentTarget.style.borderColor = `${accentColor}70`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = `${accentColor}10`;
        e.currentTarget.style.borderColor = `${accentColor}40`;
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ color: accentColor, fontSize: '0.74rem', fontWeight: 700, letterSpacing: '0.08em', margin: '0 0 3px', fontFamily: "'Inter', sans-serif" }}>
          {language === 'tr' ? cfg.labelTr : cfg.labelEn}
        </p>
        <p style={{ color: '#94a3b8', fontSize: '0.78rem', fontFamily: "'Inter', sans-serif", margin: 0, lineHeight: 1.45 }}>
          {language === 'tr' ? cfg.descTr : cfg.descEn}
        </p>
      </div>
      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.7, marginLeft: 12 }}>
        <path d="M5 12h14M12 5l7 7-7 7"/>
      </svg>
    </button>
  );
}

function TabPanel({ tabKey, accentColor }) {
  const { t, language } = useLanguage();
  const data = t(`psychology.sections.${tabKey}`) || {};
  const items = data.items || [];
  const cta = TAB_CTA[tabKey];

  return (
    <div>
      {/* Tab intro */}
      {data.intro && (
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '0.95rem', color: '#94a3b8',
          lineHeight: 1.75, marginBottom: '22px',
          maxWidth: '760px',
        }}>
          {data.intro}
        </p>
      )}

      {/* Accordion items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {items.map((item) => (
          <AccordionItem key={item.id} item={item} accentColor={accentColor} />
        ))}
      </div>

      {/* Cross-page CTA (only for tabs with a relevant Atlas overlay) */}
      {cta && <TabCTA cfg={cta} accentColor={accentColor} language={language} />}
    </div>
  );
}

function AppendixPanel() {
  const { t } = useLanguage();
  const [activeEk, setActiveEk] = useState('a');
  const tabs = t('psychology.appendix.tabs') || {};

  const EK_COLORS = { a: '#F97316', b: '#0EA5E9', c: '#10B981' };
  const EK_LETTERS = { a: 'أ', b: 'ب', c: 'ج' };

  return (
    <div>
      {/* Sub-tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
        {APPENDIX_TABS.map((ek) => {
          const isActive = activeEk === ek;
          const col = EK_COLORS[ek];
          return (
            <button
              key={ek}
              onClick={() => setActiveEk(ek)}
              style={{
                padding: '7px 16px', borderRadius: '8px', cursor: 'pointer',
                border: `1px solid ${isActive ? col + '66' : 'rgba(255,255,255,0.07)'}`,
                background: isActive ? col + '1a' : 'rgba(255,255,255,0.025)',
                color: isActive ? col : '#64748b',
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.8rem', fontWeight: isActive ? 600 : 400,
                transition: 'all 0.2s',
              }}
            >
              <span dir="rtl" lang="ar" style={{ fontFamily: "'KFGQPC', 'Amiri Quran', serif", fontSize: '0.9rem', opacity: 0.7 }}>{EK_LETTERS[ek]}</span>
              {tabs[ek] || ek.toUpperCase()}
            </button>
          );
        })}
      </div>

      {/* Sub-tab content */}
      <AnimatePresence mode="wait">
        {APPENDIX_TABS.map((ek) => {
          if (activeEk !== ek) return null;
          const ekData = t(`psychology.appendix.${ek}`) || {};
          const items = ekData.items || [];
          const col = EK_COLORS[ek];

          return (
            <motion.div
              key={ek}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {ekData.intro && (
                <p style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.95rem', color: '#94a3b8',
                  lineHeight: 1.75, marginBottom: '20px', maxWidth: '760px',
                }}>
                  {ekData.intro}
                </p>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {items.map((item) => (
                  <AccordionItem key={item.id} item={item} accentColor={col} />
                ))}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

export default function PsychologySection() {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState('nefs');
  const tabs = t('psychology.tabs') || {};
  // §14.1 SSR-safe mobile detect — tabs mobilde wrap'lensin diye gerekli.
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < BREAKPOINT_MOBILE);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const allTabKeys = [...MAIN_TABS, 'ekler'];
  const activeMeta = TAB_META[activeTab] || TAB_META.nefs;

  return (
    <SectionWrapper id="psychology" dark={false}>

      {/* Badge */}
      <motion.div variants={fadeUpItem}>
        <span className="text-gold/60 text-xs font-body uppercase tracking-[0.3em]">
          {t('psychology.badge')}
        </span>
      </motion.div>

      {/* Title — Hero/Discovery parity. */}
      <motion.h2
        variants={fadeUpItem}
        style={{
          fontFamily: FONTS.display,
          fontSize: 'clamp(1.8rem, 4vw, 2.75rem)',
          fontWeight: 700,
          color: COLORS.offWhite,
          marginTop: '12px',
          marginBottom: '12px',
          maxWidth: '60ch',
          lineHeight: 1.15,
          letterSpacing: '-0.01em',
        }}
      >
        {t('psychology.title')}
      </motion.h2>

      {/* Intro — Hero baseline imzası. */}
      <motion.p
        variants={fadeUpItem}
        className="max-w-3xl mb-8"
        style={{
          fontFamily: FONTS.body,
          color: COLORS.offWhiteAlpha78,
          fontSize: 'clamp(0.95rem, 1.6vw, 1.0625rem)',
          lineHeight: 1.7,
          letterSpacing: '0.01em',
        }}
      >
        {t('psychology.intro')}
      </motion.p>

      {/* Tab bar
          Desktop: yatay scroll, tek satır, alt-border underline-style.
          Mobil: 2-sütun grid, kart-style — asimetrik wrap yerine simetrik düzen,
                  aktif tab tam-renkli border + dim background, inactive minimal. */}
      <motion.div
        variants={fadeUpItem}
        style={
          isMobile
            ? {
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                marginBottom: '24px',
              }
            : {
                display: 'flex',
                gap: '2px',
                overflowX: 'auto',
                marginBottom: '24px',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
              }
        }
      >
        {allTabKeys.map((key) => {
          const isActive = activeTab === key;
          const meta = TAB_META[key];
          const mobileStyle = {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 12px',
            borderRadius: '10px',
            border: `1px solid ${isActive ? meta.color : 'rgba(255,255,255,0.06)'}`,
            background: isActive ? meta.dim : 'rgba(255,255,255,0.022)',
            color: isActive ? meta.color : '#94a3b8',
            fontFamily: "'Inter', sans-serif",
            fontSize: '0.78rem',
            fontWeight: isActive ? 600 : 500,
            lineHeight: 1.25,
            cursor: 'pointer',
            transition: 'all 0.18s',
            textAlign: 'left',
            minHeight: '44px',
          };
          const desktopStyle = {
            flexShrink: 0,
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '12px 18px',
            border: 'none', borderRadius: '0',
            borderBottom: isActive ? `2px solid ${meta.color}` : '2px solid transparent',
            background: isActive ? meta.dim : 'transparent',
            color: isActive ? meta.color : '#64748b',
            fontFamily: "'Inter', sans-serif",
            fontSize: '0.85rem', fontWeight: isActive ? 600 : 400,
            cursor: 'pointer', transition: 'all 0.2s',
            whiteSpace: 'nowrap',
          };
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              style={isMobile ? mobileStyle : desktopStyle}
              onMouseEnter={e => {
                if (isActive) return;
                if (isMobile) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.color = '#e8e6e3';
                } else {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                  e.currentTarget.style.color = '#e8e6e3';
                }
              }}
              onMouseLeave={e => {
                if (isActive) return;
                if (isMobile) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.022)';
                  e.currentTarget.style.color = '#94a3b8';
                } else {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#64748b';
                }
              }}
              aria-pressed={isActive}
            >
              <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{TAB_ICONS[key]}</span>
              <span style={{ whiteSpace: isMobile ? 'normal' : 'nowrap', overflow: 'hidden', textOverflow: isMobile ? 'clip' : 'ellipsis' }}>
                {tabs[key] || key}
              </span>
            </button>
          );
        })}
      </motion.div>

      {/* Tab content panel */}
      <motion.div variants={fadeUpItem}>
        <div style={{
          background: 'rgba(255,255,255,0.022)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderTop: `3px solid ${activeMeta.color}`,
          borderRadius: '16px',
          padding: '24px',
          minHeight: '200px',
        }}>
          <AnimatePresence mode="wait">
            {allTabKeys.map((key) => {
              if (activeTab !== key) return null;
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  {key === 'ekler'
                    ? <AppendixPanel />
                    : <TabPanel tabKey={key} accentColor={activeMeta.color} />
                  }
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* CTA — IblisSatan atlas link (psikolojik dinamik ↔ saldırgan) */}
      <motion.div variants={fadeUpItem} className="mt-10">
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('openIblisSatan'))}
          style={{
            width: '100%',
            padding: '14px 24px',
            background: 'rgba(212,165,116,0.06)',
            border: '1px solid rgba(212,165,116,0.3)',
            borderRadius: '10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(212,165,116,0.12)';
            e.currentTarget.style.borderColor = 'rgba(212,165,116,0.5)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(212,165,116,0.06)';
            e.currentTarget.style.borderColor = 'rgba(212,165,116,0.3)';
          }}
        >
          <div style={{ textAlign: 'left' }}>
            <p style={{ color: '#d4a574', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.1em', margin: '0 0 3px', fontFamily: "'Inter', sans-serif" }}>
              {language === 'tr' ? '↗ KUR’AN’DA İBLİS / ŞEYTAN — ATLASI AÇ' : '↗ IBLĪS / SHAYṬĀN IN THE QUR’AN — OPEN THE ATLAS'}
            </p>
            <p style={{ color: '#94a3b8', fontSize: '0.82rem', fontFamily: "'Inter', sans-serif", margin: 0 }}>
              {language === 'tr'
                ? '7 sûre · vesvese · iğva · kibir · psikolojik saldırı kalıpları'
                : '7 surahs · whispering · deception · arrogance · psychological attack patterns'}
            </p>
          </div>
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4a574" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.7 }}>
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </motion.div>

    </SectionWrapper>
  );
}
