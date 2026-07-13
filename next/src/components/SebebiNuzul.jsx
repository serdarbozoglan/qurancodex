'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import {
  COLORS, FONTS, GLASS_CARD, BREAKPOINT_MOBILE, RADIUS,
} from '../tokens';
import ToolHeader from './ToolHeader';
import { fetchMealSurah } from '../lib/mealCache';
import useFocusTrap from '../hooks/useFocusTrap';


import { cleanArabicForDisplay as cleanArabic } from '../lib/arabic';
// ── Category / reliability / period metadata ──────────────────────────────────
const CATEGORY_META = {
  'event-response':     { tr: 'Olaya Cevap',       en: 'Event Response',        color: '#e67e22' },
  'question-answer':    { tr: 'Soruya Cevap',       en: 'Question Answer',       color: '#3498db' },
  'need-response':      { tr: 'İhtiyaca Cevap',     en: 'Need Response',         color: '#2ecc71' },
  'hypocrite-response': { tr: 'Münafık/Müşrik',     en: 'Hypocrite/Polytheist',  color: '#e74c3c' },
  'companion-case':     { tr: 'Sahabî Durumu',      en: 'Companion Case',        color: '#9b59b6' },
  'ahl-kitab':          { tr: 'Ehl-i Kitap',        en: 'People of the Book',    color: '#1abc9c' },
  'family-law':         { tr: 'Aile/Toplum Hukuku', en: 'Family/Social Law',     color: '#f39c12' },
};

const RELIABILITY_META = {
  'sahih':    { tr: 'Sahih',     en: 'Authentic', color: '#2ecc71' },
  'hasan':    { tr: 'Hasen',     en: 'Good',      color: '#d4a574' },
  'daif':     { tr: 'Zayıf',     en: 'Weak',      color: '#94a3b8' },
  'disputed': { tr: 'İhtilâflı', en: 'Disputed',  color: '#e74c3c' },
};

const PERIOD_META = {
  'makki':  { tr: 'Mekkî',  en: 'Meccan',  color: '#f39c12' },
  'madani': { tr: 'Medenî', en: 'Medinan', color: '#3498db' },
};

// ── Timeline tab constants (separate from SebebiNuzul's own period/category meta) ──
const TPERIOD_META = {
  'erken-mekki': { tr: 'Erken Mekkî',  en: 'Early Meccan',  color: '#f39c12', years: '610–614 M' },
  'mekki':       { tr: "Mekkî Dönem",  en: 'Meccan Period', color: '#e67e22', years: '614–622 M' },
  'medeni':      { tr: "Medenî Dönem", en: 'Medinan Period', color: '#2ecc71', years: '622–632 M' },
};
const TPERIOD_ORDER = ['erken-mekki', 'mekki', 'medeni'];

const TCAT_META = {
  vahiy:     { tr: 'Vahiy',     en: 'Revelation', color: '#d4a574', bg: 'rgba(212,165,116,0.15)' },
  savas:     { tr: "Savaş",     en: 'Battle',      color: '#e74c3c', bg: 'rgba(231,76,60,0.15)'  },
  hukuki:    { tr: 'Hukuki',    en: 'Legal',       color: '#3498db', bg: 'rgba(52,152,219,0.15)' },
  kisisel:   { tr: "Kişisel",   en: 'Personal',    color: '#a29bfe', bg: 'rgba(162,155,254,0.15)'},
  toplumsal: { tr: 'Toplumsal', en: 'Social',      color: '#2ecc71', bg: 'rgba(46,204,113,0.15)' },
  siyasi:    { tr: 'Siyasi',    en: 'Political',   color: '#00cec9', bg: 'rgba(0,206,201,0.15)'  },
};

function groupByPeriod(events) {
  const groups = {};
  for (const ev of events) {
    if (!groups[ev.period]) groups[ev.period] = [];
    groups[ev.period].push(ev);
  }
  return groups;
}

// ── Tab definitions ───────────────────────────────────────────────────────────
const TABS = [
  {
    labelTr: 'Arama',
    labelEn: 'Search',
    icon: (
      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    ),
  },
  {
    labelTr: 'İstatistik',
    labelEn: 'Statistics',
    icon: (
      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
  },
  {
    labelTr: 'İlkeler',
    labelEn: 'Principles',
    icon: (
      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </svg>
    ),
  },
  {
    labelTr: 'Kaynaklar',
    labelEn: 'Sources',
    icon: (
      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2"/>
        <polyline points="2 17 12 22 22 17"/>
        <polyline points="2 12 12 17 22 12"/>
      </svg>
    ),
  },
  {
    labelTr: "Zaman Çizelgesi",
    labelEn: 'Timeline',
    icon: (
      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <line x1="8" y1="6" x2="21" y2="6"/>
        <line x1="8" y1="12" x2="21" y2="12"/>
        <line x1="8" y1="18" x2="21" y2="18"/>
        <line x1="3" y1="6" x2="3.01" y2="6"/>
        <line x1="3" y1="12" x2="3.01" y2="12"/>
        <line x1="3" y1="18" x2="3.01" y2="18"/>
      </svg>
    ),
  },
];

// ── TimelinePrevNext ──────────────────────────────────────────────────────────
function TimelinePrevNext({ events, current, onSelect, language }) {
  const idx = events.findIndex(e => e.id === current.id);
  const prev = idx > 0 ? events[idx - 1] : null;
  const next = idx < events.length - 1 ? events[idx + 1] : null;

  return (
    <div style={{
      display: 'flex', gap: '12px', marginTop: '40px',
      paddingTop: '20px', borderTop: `1px solid ${COLORS.glassBorder}`,
    }}>
      {prev && (
        <button
          onClick={() => onSelect(prev)}
          style={{
            flex: 1, padding: '12px 14px', borderRadius: RADIUS.chip, cursor: 'pointer',
            background: 'rgba(255,255,255,0.04)', border: `1px solid ${COLORS.glassBgStrong}`,
            textAlign: 'left', color: COLORS.silver, transition: 'all 0.15s',
            fontFamily: FONTS.body,
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = `${COLORS.gold}4d`; e.currentTarget.style.color = COLORS.gold; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.glassBgStrong; e.currentTarget.style.color = COLORS.silver; }}
        >
          <div style={{ fontSize: '0.6rem', marginBottom: '4px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {language === 'tr' ? '← Önceki' : '← Previous'}
          </div>
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: COLORS.offWhite }}>
            {language === 'tr' ? prev.titleTr : prev.titleEn}
          </div>
        </button>
      )}
      {next && (
        <button
          onClick={() => onSelect(next)}
          style={{
            flex: 1, padding: '12px 14px', borderRadius: RADIUS.chip, cursor: 'pointer',
            background: 'rgba(255,255,255,0.04)', border: `1px solid ${COLORS.glassBgStrong}`,
            textAlign: 'right', color: COLORS.silver, transition: 'all 0.15s',
            fontFamily: FONTS.body,
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = `${COLORS.gold}4d`; e.currentTarget.style.color = COLORS.gold; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.glassBgStrong; e.currentTarget.style.color = COLORS.silver; }}
        >
          <div style={{ fontSize: '0.6rem', marginBottom: '4px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {language === 'tr' ? 'Sonraki →' : 'Next →'}
          </div>
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: COLORS.offWhite }}>
            {language === 'tr' ? next.titleTr : next.titleEn}
          </div>
        </button>
      )}
    </div>
  );
}

// ── OccasionCard ──────────────────────────────────────────────────────────────
function OccasionCard({ occ, language, isMobile }) {
  const [expanded, setExpanded] = useState(false);
  const [verseData, setVerseData] = useState(null);
  const acRef = useRef(null);

  // Abort any in-flight fetch on unmount
  useEffect(() => () => { acRef.current?.abort(); }, []);

  const catMeta = CATEGORY_META[occ.category] || { tr: occ.category, en: occ.category, color: COLORS.silver };
  const relMeta = RELIABILITY_META[occ.reliability] || { tr: occ.reliability, en: occ.reliability, color: COLORS.silver };
  const periodMeta = PERIOD_META[occ.period] || { tr: occ.period, en: occ.period, color: COLORS.silver };

  const title = language === 'tr' ? occ.titleTr : occ.titleEn;
  const summary = language === 'tr' ? occ.summaryTr : occ.summaryEn;

  function handleToggle() {
    const next = !expanded;
    setExpanded(next);
    if (next && verseData === null && occ.verses && occ.verses.length > 0) {
      // Abort any previous fetch
      acRef.current?.abort();
      const ac = new AbortController();
      acRef.current = ac;

      setVerseData({ loading: true, verses: [] });

      // Fetch all surahs referenced by this occasion in parallel.
      // Local-first via meal cache (author 105); API fallback on cache miss.
      Promise.all(
        occ.verses.map(v =>
          fetchMealSurah(v.surah, 105, ac.signal)
            .then(d => {
              const allVerses = d.data?.verses || [];
              return allVerses
                .filter(ve => ve.verse_number >= v.ayahStart && ve.verse_number <= v.ayahEnd)
                .map(ve => ({
                  surah: v.surah,
                  num: ve.verse_number,
                  arabic: cleanArabic(ve.verse),
                  turkish: ve.translation?.text || '',
                }));
            })
        )
      )
        .then(results => {
          const merged = results.flat();
          setVerseData({ loading: false, verses: merged });
        })
        .catch(err => {
          if (err.name === 'AbortError') return;
          setVerseData({ loading: false, verses: [] });
        });
    }
  }

  const chipStyle = (color) => ({
    display: 'inline-flex',
    alignItems: 'center',
    padding: '2px 8px',
    borderRadius: RADIUS.pill,
    fontSize: '0.72rem',
    fontWeight: 600,
    color,
    background: `${color}22`,
    border: `1px solid ${color}55`,
    fontFamily: FONTS.body,
  });

  const goldChipStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '2px 8px',
    borderRadius: RADIUS.pill,
    fontSize: '0.72rem',
    fontWeight: 600,
    color: COLORS.gold,
    background: COLORS.goldAlpha15,
    border: `1px solid ${COLORS.gold}55`,
    fontFamily: FONTS.body,
  };

  const pad = isMobile ? '12px 14px' : '14px 18px';

  return (
    <div style={{
      ...GLASS_CARD,
      borderLeft: `3px solid ${catMeta.color}`,
      marginBottom: '12px',
    }}>
      {/* Header section */}
      <div style={{ padding: pad }}>
        {/* Title row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
          <span style={{ fontWeight: 700, color: COLORS.offWhite, fontFamily: FONTS.body, fontSize: isMobile ? '0.9rem' : '0.95rem', lineHeight: 1.4 }}>
            {title}
          </span>
          <span style={{ ...chipStyle(relMeta.color), flexShrink: 0 }}>
            {language === 'tr' ? relMeta.tr : relMeta.en}
          </span>
        </div>

        {/* Chips row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
          <span style={chipStyle(catMeta.color)}>{language === 'tr' ? catMeta.tr : catMeta.en}</span>
          <span style={chipStyle(periodMeta.color)}>{language === 'tr' ? periodMeta.tr : periodMeta.en}</span>
          {(occ.verses || []).map((v, i) => (
            <span key={i} style={goldChipStyle}>
              {v.surah}:{v.ayahStart}{v.ayahEnd && v.ayahEnd !== v.ayahStart ? `–${v.ayahEnd}` : ''}
            </span>
          ))}
        </div>

        {/* Key persons */}
        {occ.keyPersons && occ.keyPersons.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '8px' }}>
            {occ.keyPersons.map((p, i) => (
              <span key={i} style={{
                display: 'inline-flex', alignItems: 'center',
                padding: '1px 7px', borderRadius: RADIUS.pill,
                fontSize: '0.7rem', color: COLORS.silver,
                background: 'rgba(148,163,184,0.1)',
                border: '1px solid rgba(148,163,184,0.2)',
                fontFamily: FONTS.body,
              }}>
                {p}
              </span>
            ))}
          </div>
        )}

        {/* Summary */}
        <p style={{
          margin: '0 0 8px',
          color: COLORS.silver,
          fontSize: '0.85rem',
          lineHeight: 1.7,
          fontFamily: FONTS.body,
        }}>
          {summary}
        </p>

        {/* Tags */}
        {occ.tags && occ.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '8px' }}>
            {occ.tags.map((tag, i) => (
              <span key={i} style={{
                fontSize: '0.7rem',
                color: COLORS.slate500,
                fontFamily: FONTS.body,
              }}>
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Source */}
        {occ.source && (
          <p style={{ margin: '0 0 10px', fontSize: '0.72rem', color: COLORS.slate500, fontFamily: FONTS.body }}>
            {language === 'tr' ? 'Kaynak:' : 'Source:'} {occ.source}
          </p>
        )}

        {/* Expand toggle */}
        <button
          onClick={handleToggle}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 12px',
            borderRadius: RADIUS.sm,
            border: `1px solid ${COLORS.gold}55`,
            background: COLORS.goldAlpha15,
            color: COLORS.gold,
            fontSize: '0.78rem',
            fontWeight: 600,
            fontFamily: FONTS.body,
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
        >
          <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {expanded
              ? <path d="M18 15l-6-6-6 6"/>
              : <path d="M6 9l6 6 6-6"/>}
          </svg>
          {expanded
            ? (language === 'tr' ? 'Ayetleri gizle' : 'Hide verses')
            : (language === 'tr' ? 'Ayetleri göster' : 'Show verses')}
        </button>
      </div>

      {/* Expanded section */}
      {expanded && (
        <div style={{
          borderTop: `1px solid ${COLORS.glassBorder}`,
          padding: pad,
        }}>
          {verseData === null || verseData.loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0' }}>
              <div style={{
                width: '24px', height: '24px', borderRadius: RADIUS.full,
                border: `2px solid ${COLORS.glassBorder}`,
                borderTopColor: COLORS.gold,
                animation: 'spin 0.8s linear infinite',
              }} />
            </div>
          ) : verseData.verses.length === 0 ? (
            <p style={{ color: COLORS.silver, fontSize: '0.85rem', fontFamily: FONTS.body, textAlign: 'center' }}>
              {language === 'tr' ? 'Ayet verisi bulunamadı.' : 'Verse data not found.'}
            </p>
          ) : (
            verseData.verses.map((ve) => (
              <div key={ve.num} style={{ marginBottom: '20px' }}>
                <p style={{
                  fontFamily: FONTS.quran,
                  fontSize: isMobile ? '1.5rem' : '1.8rem',
                  lineHeight: 2,
                  color: COLORS.offWhite,
                  textAlign: 'right',
                  direction: 'rtl',
                  margin: '0 0 6px',
                }} dir="rtl" lang="ar">
                  {ve.arabic}
                </p>
                {ve.turkish && (
                  <p style={{
                    fontFamily: FONTS.body,
                    fontSize: '0.85rem',
                    color: COLORS.silver,
                    fontStyle: 'italic',
                    lineHeight: 1.7,
                    margin: '0 0 4px',
                  }}>
                    {ve.turkish}
                  </p>
                )}
                <p style={{ fontSize: '0.75rem', color: COLORS.slate500, fontFamily: FONTS.body, margin: 0 }}>
                  {ve.surah}:{ve.num}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ── TabArama ──────────────────────────────────────────────────────────────────
function TabArama({ data, language, isMobile }) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [mode, setMode] = useState('event'); // 'event' | 'verse'
  const [catFilter, setCatFilter] = useState('all');
  const [periodFilter, setPeriodFilter] = useState('all');
  const [reliabilityFilter, setReliabilityFilter] = useState('all');
  const debounceRef = useRef(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  function parseVerseQuery(q) {
    const m = q.trim().match(/^(\d+):(\d+)$/);
    if (!m) return null;
    return { surah: parseInt(m[1], 10), ayah: parseInt(m[2], 10) };
  }

  const occasions = data.occasions || [];

  const filtered = occasions.filter(occ => {
    // Category filter
    if (catFilter !== 'all' && occ.category !== catFilter) return false;
    // Period filter
    if (periodFilter !== 'all' && occ.period !== periodFilter) return false;
    // Reliability filter
    if (reliabilityFilter === 'sahih' && occ.reliability !== 'sahih') return false;
    if (reliabilityFilter === 'hasan' && occ.reliability !== 'hasan') return false;
    if (reliabilityFilter === 'no-daif' && (occ.reliability === 'daif' || occ.reliability === 'disputed')) return false;

    // Text/verse search
    if (!debouncedQuery) return true;

    if (mode === 'verse') {
      const parsed = parseVerseQuery(debouncedQuery);
      if (parsed) {
        return (occ.verses || []).some(v =>
          v.surah === parsed.surah &&
          parsed.ayah >= v.ayahStart &&
          parsed.ayah <= v.ayahEnd
        );
      }
    }

    // Text search (both modes fall through here if not verse-parseable)
    const q = debouncedQuery.toLowerCase();
    return (
      (occ.titleTr || '').toLowerCase().includes(q) ||
      (occ.titleEn || '').toLowerCase().includes(q) ||
      (occ.summaryTr || '').toLowerCase().includes(q) ||
      (occ.summaryEn || '').toLowerCase().includes(q) ||
      (occ.tags || []).some(t => t.toLowerCase().includes(q)) ||
      (occ.keyPersons || []).some(p => p.toLowerCase().includes(q))
    );
  });

  const pad = isMobile ? '16px' : '24px 32px';

  const chipBtn = (active, onClick, label, color, keyId) => (
    <button
      key={keyId}
      onClick={onClick}
      style={{
        padding: '4px 12px',
        borderRadius: RADIUS.pill,
        border: `1px solid ${active ? (color || COLORS.gold) : COLORS.glassBorder}`,
        background: active ? (color ? `${color}22` : COLORS.goldAlpha15) : 'transparent',
        color: active ? (color || COLORS.gold) : COLORS.silver,
        fontSize: '0.78rem',
        fontWeight: active ? 600 : 400,
        fontFamily: FONTS.body,
        cursor: 'pointer',
        transition: 'all 0.15s',
        whiteSpace: 'nowrap',
        flexShrink: 0,
      }}
    >
      {label}
    </button>
  );

  return (
    <div style={{ padding: pad }}>
      {/* Search input */}
      <div style={{ position: 'relative', marginBottom: '14px' }}>
        <span style={{
          position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
          color: COLORS.silver, pointerEvents: 'none',
        }}>
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </span>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={
            mode === 'verse'
              ? (language === 'tr' ? 'Sûre:Ayet girin (örn. 24:11)…' : 'Enter Surah:Ayah (e.g. 24:11)…')
              : (language === 'tr' ? 'Olay, kişi veya konu ara…' : 'Search event, person or topic…')
          }
          style={{
            width: '100%',
            padding: '10px 12px 10px 38px',
            borderRadius: RADIUS.md,
            border: `1px solid ${COLORS.glassBorder}`,
            background: COLORS.glassBg,
            color: COLORS.offWhite,
            fontSize: '0.9rem',
            fontFamily: FONTS.body,
            outline: 'none',
            boxSizing: 'border-box',
            transition: 'border-color 0.15s',
          }}
          onFocus={e => { e.target.style.borderColor = COLORS.gold; }}
          onBlur={e => { e.target.style.borderColor = COLORS.glassBorder; }}
        />
      </div>

      {/* Mode toggle */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
        <button
          onClick={() => setMode('event')}
          style={{
            padding: '6px 14px',
            borderRadius: RADIUS.pill,
            border: `1px solid ${mode === 'event' ? COLORS.gold : COLORS.glassBorder}`,
            background: mode === 'event' ? COLORS.goldAlpha15 : 'transparent',
            color: mode === 'event' ? COLORS.gold : COLORS.silver,
            fontSize: '0.8rem',
            fontWeight: mode === 'event' ? 600 : 400,
            fontFamily: FONTS.body,
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
        >
          🔄 {language === 'tr' ? 'Olay → Ayet' : 'Event → Verse'}
        </button>
        <button
          onClick={() => setMode('verse')}
          style={{
            padding: '6px 14px',
            borderRadius: RADIUS.pill,
            border: `1px solid ${mode === 'verse' ? COLORS.gold : COLORS.glassBorder}`,
            background: mode === 'verse' ? COLORS.goldAlpha15 : 'transparent',
            color: mode === 'verse' ? COLORS.gold : COLORS.silver,
            fontSize: '0.8rem',
            fontWeight: mode === 'verse' ? 600 : 400,
            fontFamily: FONTS.body,
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
        >
          🔍 {language === 'tr' ? 'Ayet → Olay' : 'Verse → Event'}
        </button>
      </div>

      {/* Category filter */}
      <div style={{ overflowX: 'auto', scrollbarWidth: 'none', marginBottom: '10px' }}>
        <div style={{ display: 'flex', gap: '6px', paddingBottom: '4px' }}>
          {chipBtn(catFilter === 'all', () => setCatFilter('all'), language === 'tr' ? 'Tümü' : 'All', null, 'cat-all')}
          {Object.entries(CATEGORY_META).map(([key, meta]) =>
            chipBtn(catFilter === key, () => setCatFilter(key), language === 'tr' ? meta.tr : meta.en, meta.color, `cat-${key}`)
          )}
        </div>
      </div>

      {/* Period filter */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
        {chipBtn(periodFilter === 'all', () => setPeriodFilter('all'), language === 'tr' ? 'Tüm Dönemler' : 'All Periods')}
        {chipBtn(periodFilter === 'makki', () => setPeriodFilter('makki'), language === 'tr' ? 'Mekkî' : 'Meccan', PERIOD_META['makki'].color)}
        {chipBtn(periodFilter === 'madani', () => setPeriodFilter('madani'), language === 'tr' ? 'Medenî' : 'Medinan', PERIOD_META['madani'].color)}
      </div>

      {/* Reliability filter */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {chipBtn(reliabilityFilter === 'all', () => setReliabilityFilter('all'), language === 'tr' ? 'Tüm Güvenilirlik' : 'All Reliability')}
        {chipBtn(reliabilityFilter === 'sahih', () => setReliabilityFilter('sahih'), language === 'tr' ? 'Sahih' : 'Authentic', '#2ecc71')}
        {chipBtn(reliabilityFilter === 'hasan', () => setReliabilityFilter('hasan'), language === 'tr' ? 'Hasen' : 'Good', '#d4a574')}
        {chipBtn(reliabilityFilter === 'no-daif', () => setReliabilityFilter('no-daif'), language === 'tr' ? 'Zayıf Hariç' : 'Excl. Weak')}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: COLORS.silver, fontFamily: FONTS.body }}>
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🔍</div>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            {language === 'tr' ? 'Sonuç bulunamadı.' : 'No results found.'}
          </p>
        </div>
      ) : (
        <>
          <p style={{ color: COLORS.silver, fontSize: '0.8rem', fontFamily: FONTS.body, marginBottom: '14px' }}>
            {filtered.length} {language === 'tr' ? 'sonuç' : 'result'}{filtered.length !== 1 ? (language === 'tr' ? '' : 's') : ''}
          </p>
          {filtered.map(occ => (
            <OccasionCard key={occ.id} occ={occ} language={language} isMobile={isMobile} />
          ))}
        </>
      )}
    </div>
  );
}

// ── TabIstatistik ─────────────────────────────────────────────────────────────
function TabIstatistik({ data, language, isMobile }) {
  const stats = data.stats || {};
  const overview = stats.overview || {};
  const byCategory = stats.byCategory || [];
  const byPeriod = stats.byPeriod || [];

  const pad = isMobile ? '16px' : '24px 32px';

  // Build conic gradient for donut (memoized to avoid recompute on every render)
  const donutGradient = useMemo(() => {
    const { stops } = byCategory.reduce((acc, item) => {
      const meta = CATEGORY_META[item.category];
      if (!meta) return acc;
      const start = acc.cum;
      const end = acc.cum + item.percent;
      acc.stops.push(`${meta.color} ${start.toFixed(1)}% ${end.toFixed(1)}%`);
      acc.cum = end;
      return acc;
    }, { stops: [], cum: 0 });
    return `conic-gradient(${stops.join(', ')})`;
  }, [byCategory]);

  const makki = byPeriod.find(p => p.period === 'makki') || { approxCount: 0, percent: 0 };
  const madani = byPeriod.find(p => p.period === 'madani') || { approxCount: 0, percent: 0 };

  const heroStats = [
    {
      value: String(overview.versesWithSabab ?? 570),
      labelTr: 'Sebeb-i nüzulü bilinen ayet',
      labelEn: 'Verses with known occasion',
    },
    {
      value: `%${overview.percentWithSabab ?? 9.1}`,
      labelTr: 'Toplam ayetlerin oranı',
      labelEn: 'Of all Quranic verses',
    },
    {
      value: `${overview.wahidiSurahs ?? 83}→${overview.suyutiSurahs ?? 102}`,
      labelTr: 'Kapsanan sûre (Vâhidî→Süyûtî)',
      labelEn: 'Surahs covered (Wahidi→Suyuti)',
    },
    {
      value: '~23 yıl',
      labelTr: 'Vahiy süreci',
      labelEn: 'Revelation period',
    },
  ];

  const statCardStyle = {
    ...GLASS_CARD,
    padding: isMobile ? '16px' : '20px 24px',
    textAlign: 'center',
  };

  return (
    <div style={{ padding: pad }}>

      {/* A. Hero Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
        gap: '12px',
        marginBottom: '32px',
      }}>
        {heroStats.map((s, i) => (
          <div key={i} style={statCardStyle}>
            <div style={{
              fontSize: isMobile ? '1.6rem' : '2rem',
              fontWeight: 800,
              color: COLORS.gold,
              fontFamily: FONTS.body,
              lineHeight: 1.2,
              marginBottom: '6px',
            }}>
              {s.value}
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: COLORS.silver,
              fontFamily: FONTS.body,
              lineHeight: 1.4,
            }}>
              {language === 'tr' ? s.labelTr : s.labelEn}
            </div>
          </div>
        ))}
      </div>

      {/* B. Donut Chart */}
      <div style={{ ...GLASS_CARD, padding: isMobile ? '20px' : '28px', marginBottom: '24px' }}>
        <h3 style={{
          color: COLORS.offWhite,
          fontFamily: FONTS.body,
          fontSize: '0.95rem',
          fontWeight: 700,
          margin: '0 0 20px',
        }}>
          {language === 'tr' ? 'Kategorilere Göre Dağılım' : 'Distribution by Category'}
        </h3>
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'center',
          gap: '24px',
        }}>
          {/* Donut */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{
              width: '180px',
              height: '180px',
              borderRadius: RADIUS.full,
              background: donutGradient,
              position: 'relative',
            }}>
              {/* Center cutout */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '108px',
                height: '108px',
                borderRadius: RADIUS.full,
                background: COLORS.cosmicBlack,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: COLORS.gold, fontFamily: FONTS.body, lineHeight: 1 }}>570</span>
                <span style={{ fontSize: '0.65rem', color: COLORS.silver, fontFamily: FONTS.body, marginTop: '2px' }}>
                  {language === 'tr' ? 'ayet' : 'verses'}
                </span>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
            {byCategory.map((item, i) => {
              const meta = CATEGORY_META[item.category];
              if (!meta) return null;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: meta.color, flexShrink: 0 }} />
                  <span style={{ fontSize: '0.78rem', color: COLORS.silver, fontFamily: FONTS.body, flex: 1 }}>
                    {language === 'tr' ? meta.tr : meta.en}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: COLORS.offWhite, fontFamily: FONTS.body, fontWeight: 600 }}>
                    {item.percent}%
                  </span>
                  <span style={{ fontSize: '0.72rem', color: COLORS.slate500, fontFamily: FONTS.body }}>
                    (~{item.approxCount})
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* C. Mekkî/Medenî Stacked Bar */}
      <div style={{ ...GLASS_CARD, padding: isMobile ? '20px' : '28px', marginBottom: '24px' }}>
        <h3 style={{
          color: COLORS.offWhite,
          fontFamily: FONTS.body,
          fontSize: '0.95rem',
          fontWeight: 700,
          margin: '0 0 16px',
        }}>
          {language === 'tr' ? 'Mekkî / Medenî Dağılımı' : 'Meccan / Medinan Distribution'}
        </h3>
        <div style={{
          height: '24px',
          borderRadius: RADIUS.pill,
          overflow: 'hidden',
          display: 'flex',
          marginBottom: '12px',
        }}>
          <div style={{
            width: `${makki.percent}%`,
            background: PERIOD_META['makki'].color,
            transition: 'width 0.8s ease',
          }} />
          <div style={{
            width: `${madani.percent}%`,
            background: PERIOD_META['madani'].color,
            transition: 'width 0.8s ease',
          }} />
        </div>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: PERIOD_META['makki'].color }} />
            <span style={{ fontSize: '0.8rem', color: COLORS.silver, fontFamily: FONTS.body }}>
              {language === 'tr' ? 'Mekkî' : 'Meccan'}: {makki.percent}% (~{makki.approxCount})
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: PERIOD_META['madani'].color }} />
            <span style={{ fontSize: '0.8rem', color: COLORS.silver, fontFamily: FONTS.body }}>
              {language === 'tr' ? 'Medenî' : 'Medinan'}: {madani.percent}% (~{madani.approxCount})
            </span>
          </div>
        </div>
        <p style={{ margin: 0, fontSize: '0.82rem', color: COLORS.silver, fontFamily: FONTS.body, lineHeight: 1.6 }}>
          {language === 'tr'
            ? "Medenî dönemin %72 oranıyla öne çıkması, Medine'de toplum inşasına yönelik sosyal, hukuki ve siyasi meselelerin ön plana çıktığının göstergesidir."
            : 'The Medinan period dominating at 72% reflects how social, legal, and political issues related to community-building came to the foreground in Medina.'}
        </p>
      </div>

      {/* D. Vâhidî → Süyûtî Comparison */}
      <div style={{ ...GLASS_CARD, padding: isMobile ? '20px' : '28px' }}>
        <h3 style={{
          color: COLORS.offWhite,
          fontFamily: FONTS.body,
          fontSize: '0.95rem',
          fontWeight: 700,
          margin: '0 0 16px',
        }}>
          {language === 'tr' ? 'Vâhidî → Süyûtî Karşılaştırması' : 'Wahidi → Suyuti Comparison'}
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr auto 1fr',
          gap: '16px',
          alignItems: 'center',
        }}>
          {/* Vâhidî */}
          <div style={{
            ...GLASS_CARD,
            border: `1px solid ${COLORS.gold}55`,
            padding: '16px 20px',
          }}>
            <div style={{ fontWeight: 700, color: COLORS.gold, fontFamily: FONTS.body, fontSize: '0.9rem', marginBottom: '4px' }}>
              Alî b. Ahmed el-Vâhidî
            </div>
            <div style={{ fontSize: '0.75rem', color: COLORS.slate500, fontFamily: FONTS.body, marginBottom: '12px' }}>
              {language === 'tr' ? 'Vefat: H. 468 / M. 1075' : 'Died: AH 468 / CE 1075'}
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div>
                <div style={{ fontWeight: 800, color: COLORS.offWhite, fontFamily: FONTS.body, fontSize: '1.4rem' }}>83</div>
                <div style={{ fontSize: '0.72rem', color: COLORS.silver, fontFamily: FONTS.body }}>{language === 'tr' ? 'Sûre' : 'Surahs'}</div>
              </div>
              <div>
                <div style={{ fontWeight: 800, color: COLORS.offWhite, fontFamily: FONTS.body, fontSize: '1.4rem' }}>570</div>
                <div style={{ fontSize: '0.72rem', color: COLORS.silver, fontFamily: FONTS.body }}>{language === 'tr' ? 'Ayet' : 'Verses'}</div>
              </div>
            </div>
          </div>

          {/* Arrow */}
          {!isMobile && (
            <div style={{ textAlign: 'center', color: COLORS.gold, fontSize: '1.5rem' }}>→</div>
          )}
          {isMobile && (
            <div style={{ textAlign: 'center', color: COLORS.gold, fontSize: '1.5rem' }}>↓</div>
          )}

          {/* Süyûtî */}
          <div style={{
            ...GLASS_CARD,
            border: `1px solid ${COLORS.skyBlue}55`,
            padding: '16px 20px',
          }}>
            <div style={{ fontWeight: 700, color: COLORS.skyBlue, fontFamily: FONTS.body, fontSize: '0.9rem', marginBottom: '4px' }}>
              Celâlüddîn es-Süyûtî
            </div>
            <div style={{ fontSize: '0.75rem', color: COLORS.slate500, fontFamily: FONTS.body, marginBottom: '12px' }}>
              {language === 'tr' ? 'Vefat: H. 911 / M. 1505' : 'Died: AH 911 / CE 1505'}
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div>
                <div style={{ fontWeight: 800, color: COLORS.offWhite, fontFamily: FONTS.body, fontSize: '1.4rem' }}>102</div>
                <div style={{ fontSize: '0.72rem', color: COLORS.silver, fontFamily: FONTS.body }}>{language === 'tr' ? 'Sûre' : 'Surahs'}</div>
              </div>
              <div>
                <div style={{ fontWeight: 800, color: COLORS.offWhite, fontFamily: FONTS.body, fontSize: '1.4rem' }}>570+</div>
                <div style={{ fontSize: '0.72rem', color: COLORS.silver, fontFamily: FONTS.body }}>{language === 'tr' ? 'Ayet' : 'Verses'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── PrincipleCard ─────────────────────────────────────────────────────────────
function PrincipleCard({ principle, badge, badgeColor, language, isMobile }) {
  return (
    <div style={{ ...GLASS_CARD, padding: isMobile ? '16px' : '20px 24px' }}>
      {badge && (
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '2px 10px',
          borderRadius: RADIUS.pill,
          border: `1px solid ${badgeColor}55`,
          background: `${badgeColor}22`,
          color: badgeColor,
          fontSize: '0.7rem',
          fontWeight: 700,
          fontFamily: FONTS.body,
          letterSpacing: '0.05em',
          marginBottom: '12px',
        }}>
          {badge}
        </div>
      )}
      <p style={{
        fontFamily: FONTS.quran,
        fontSize: isMobile ? '1.3rem' : '1.6rem',
        lineHeight: 1.8,
        color: COLORS.gold,
        textAlign: 'center',
        direction: 'rtl',
        margin: '0 0 6px',
      }} dir="rtl" lang="ar">
        {cleanArabic(principle.arabicPhrase)}
      </p>
      <p style={{
        textAlign: 'center',
        fontStyle: 'italic',
        color: COLORS.slate500,
        fontSize: '0.8rem',
        fontFamily: FONTS.body,
        margin: '0 0 12px',
      }}>
        {principle.transliteration}
      </p>
      <p style={{
        fontWeight: 700,
        color: COLORS.offWhite,
        fontFamily: FONTS.body,
        fontSize: '0.9rem',
        margin: '0 0 8px',
      }}>
        {language === 'tr' ? principle.titleTr : principle.titleEn}
      </p>
      <p style={{
        color: COLORS.silver,
        fontSize: '0.85rem',
        lineHeight: 1.75,
        fontFamily: FONTS.body,
        margin: 0,
      }}>
        {language === 'tr' ? principle.descriptionTr : principle.descriptionEn}
      </p>
    </div>
  );
}

// ── TabIlkeler ────────────────────────────────────────────────────────────────
function TabIlkeler({ data, language, isMobile }) {
  const principles = data.principles || [];

  const majority = principles.filter(p => p.camp === 'majority');
  const minority = principles.filter(p => p.camp === 'minority');
  const rest = principles.filter(p => p.camp !== 'majority' && p.camp !== 'minority');

  const pad = isMobile ? '16px' : '24px 32px';

  return (
    <div style={{ padding: pad }}>
      {/* Majority vs Minority */}
      {(majority.length > 0 || minority.length > 0) && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: '16px',
          marginBottom: '20px',
        }}>
          {majority.map(p => (
            <PrincipleCard
              key={p.id}
              principle={p}
              badge={language === 'tr' ? 'CUMHUR GÖRÜŞÜ' : 'MAJORITY VIEW'}
              badgeColor={COLORS.softEmerald}
              language={language}
              isMobile={isMobile}
            />
          ))}
          {minority.map(p => (
            <PrincipleCard
              key={p.id}
              principle={p}
              badge={language === 'tr' ? 'AZINLIK GÖRÜŞÜ' : 'MINORITY VIEW'}
              badgeColor={COLORS.amber}
              language={language}
              isMobile={isMobile}
            />
          ))}
        </div>
      )}

      {/* Remaining principles */}
      {rest.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
          {rest.map(p => (
            <PrincipleCard key={p.id} principle={p} language={language} isMobile={isMobile} />
          ))}
        </div>
      )}

      {/* Warning info box */}
      <div style={{
        ...GLASS_CARD,
        border: `1px solid ${COLORS.gold}44`,
        padding: isMobile ? '16px' : '20px 24px',
        background: COLORS.goldAlpha15,
      }}>
        <p style={{ margin: 0, fontSize: '0.85rem', color: COLORS.offWhite, fontFamily: FONTS.body, lineHeight: 1.7 }}>
          <span style={{ color: COLORS.gold, fontWeight: 700 }}>
            ⚠ {language === 'tr' ? 'Dikkat:' : 'Note:'}
          </span>
          {' '}
          {language === 'tr'
            ? 'Bir ayetin sebeb-i nüzulünü bilmek, o ayetin hükmünü yalnızca o sebebe bağlamak anlamına gelmez. Cumhur âlimlere göre "lafzın genelliği" esas olup ayet, benzeri tüm durumlar için uygulanmaya devam eder. Sebeb-i nüzul bilgisi; ayeti doğru anlamak, bağlamı kavramak ve yanlış tevillerin önüne geçmek için vazgeçilmez bir araçtır.'
            : 'Knowing the occasion of revelation of a verse does not mean limiting its ruling to that specific occasion. According to the majority of scholars, the "generality of the wording" takes precedence, and the verse continues to apply to all similar situations. Knowledge of the occasion of revelation is an indispensable tool for correctly understanding the verse, grasping its context, and preventing misinterpretations.'}
        </p>
      </div>
    </div>
  );
}

// ── TabKaynaklar ──────────────────────────────────────────────────────────────
function TabKaynaklar({ data, language, isMobile }) {
  const scholars = data.scholars || [];
  const pad = isMobile ? '16px' : '24px 32px';

  const statusMeta = {
    founder:   { tr: 'Kurucu', en: 'Founder',   color: COLORS.gold },
    expander:  { tr: 'Geliştirici', en: 'Expander', color: COLORS.skyBlue },
    precursor: { tr: 'Öncü', en: 'Precursor',  color: COLORS.softEmerald },
  };

  const historyNarrative = language === 'tr' ? [
    "Sebeb-i nüzul bilgisi, İslam'ın ilk dönemlerinden itibaren hadis ve tefsir külliyatı içinde dağınık biçimde mevcut olmuştur. Sahabe ve tabiîn nesli, Hz. Peygamber'in (s.a.v.) vahyin iniş sürecini bizzat yaşadıkları için bu bilgileri titizlikle aktarmıştır.",
    "Hicri 5. asırda Alî b. Ahmed el-Vâhidî en-Nîşâbûrî (ö. 468/1075), \"Kitâbu Esbâbi'n-Nüzûl\" adlı eseriyle bu alanda kaleme alınan ilk müstakil çalışmayı ortaya koymuştur. Vâhidî, Kur'an'ın 83 sûresine dair rivayetleri derlemiş ve bu ilmin metodolojik temellerini atmıştır.",
    "Hicri 9. asırda Celâlüddîn es-Süyûtî (ö. 911/1505) \"Lübâbu'n-Nukûl fî Esbâbi'n-Nüzûl\" adlı eseriyle kapsamı 102 sûreye genişletmiş, rivayetleri tenkit süzgecinden geçirmiş ve ilmin metodolojisini daha da olgunlaştırmıştır.",
    "Modern dönemde sebeb-i nüzul ilmi, Kur'an'ın siyak-sibak dışında yorumlanmasını önleyen kritik bir referans alanı olarak önemini korumaktadır. Metin tenkidi, tarihî bağlam araştırmaları ve karşılaştırmalı tefsir çalışmaları, bu ilmin verilerinden beslenmeye devam etmektedir.",
  ] : [
    'Knowledge of the occasions of revelation has existed since the earliest days of Islam, scattered throughout hadith and tafsir collections. The Companions and Successors who lived through the revelation process transmitted this knowledge with great care.',
    'In the 5th century AH, Ali ibn Ahmad al-Wahidi al-Naysaburi (d. 468/1075) produced the first independent work in this field with his "Kitab Asbab al-Nuzul," compiling narrations for 83 surahs and laying the methodological foundations of the discipline.',
    'In the 9th century AH, Jalaluddin al-Suyuti (d. 911/1505) expanded the scope to 102 surahs in his "Lubab al-Nuqul fi Asbab al-Nuzul," critically evaluated the narrations, and further refined the methodology of the discipline.',
    'In the modern era, the science of occasions of revelation remains critically important as a reference preventing the Quran from being interpreted out of context. Textual criticism, historical context research, and comparative tafsir studies continue to draw upon its data.',
  ];

  return (
    <div style={{ padding: pad }}>
      {/* Scholar cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
        {scholars.map(scholar => {
          const sm = statusMeta[scholar.status] || { tr: scholar.status, en: scholar.status, color: COLORS.silver };
          return (
            <div key={scholar.id} style={{ ...GLASS_CARD, padding: isMobile ? '16px' : '20px 24px' }}>
              {/* Name row */}
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '6px' }}>
                <span style={{ fontWeight: 700, color: COLORS.offWhite, fontFamily: FONTS.body, fontSize: '0.95rem' }}>
                  {scholar.nameTr}
                </span>
                <span style={{
                  fontFamily: FONTS.quran,
                  color: COLORS.gold,
                  fontSize: '1rem',
                  lineHeight: 1.6,
                  direction: 'rtl',
                }} dir="rtl" lang="ar">
                  {cleanArabic(scholar.nameAr)}
                </span>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '2px 10px',
                  borderRadius: RADIUS.pill,
                  border: `1px solid ${sm.color}55`,
                  background: `${sm.color}22`,
                  color: sm.color,
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  fontFamily: FONTS.body,
                }}>
                  {language === 'tr' ? sm.tr : sm.en}
                </span>
              </div>

              {/* Death + city */}
              <p style={{ margin: '0 0 8px', fontSize: '0.78rem', color: COLORS.slate500, fontFamily: FONTS.body }}>
                {language === 'tr' ? 'Vefat:' : 'Died:'} H. {scholar.deathH} / M. {scholar.deathM} · {scholar.city}
              </p>

              {/* Work title */}
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <span style={{ fontStyle: 'italic', color: COLORS.offWhite, fontFamily: FONTS.body, fontSize: '0.85rem' }}>
                  {scholar.workTr}
                </span>
                <span style={{
                  fontFamily: FONTS.quran,
                  color: COLORS.gold,
                  fontSize: '0.9rem',
                  direction: 'rtl',
                }} dir="rtl" lang="ar">
                  {cleanArabic(scholar.workAr)}
                </span>
              </div>

              {/* Stats mini-cards */}
              {(scholar.surahsCovered || scholar.versesCovered) && (
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
                  {scholar.surahsCovered != null && (
                    <div style={{
                      padding: '6px 12px',
                      borderRadius: RADIUS.md,
                      background: 'rgba(255,255,255,0.04)',
                      border: `1px solid ${COLORS.glassBorderSoft}`,
                      textAlign: 'center',
                    }}>
                      <div style={{ fontWeight: 800, color: COLORS.offWhite, fontFamily: FONTS.body, fontSize: '1.1rem', lineHeight: 1 }}>
                        {scholar.surahsCovered}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: COLORS.silver, fontFamily: FONTS.body, marginTop: '2px' }}>
                        {language === 'tr' ? 'Sûre' : 'Surahs'}
                      </div>
                    </div>
                  )}
                  {scholar.versesCovered != null && (
                    <div style={{
                      padding: '6px 12px',
                      borderRadius: RADIUS.md,
                      background: 'rgba(255,255,255,0.04)',
                      border: `1px solid ${COLORS.glassBorderSoft}`,
                      textAlign: 'center',
                    }}>
                      <div style={{ fontWeight: 800, color: COLORS.offWhite, fontFamily: FONTS.body, fontSize: '1.1rem', lineHeight: 1 }}>
                        {scholar.versesCovered}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: COLORS.silver, fontFamily: FONTS.body, marginTop: '2px' }}>
                        {language === 'tr' ? 'Ayet' : 'Verses'}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Note */}
              <p style={{
                margin: 0,
                fontSize: '0.85rem',
                color: COLORS.silver,
                fontFamily: FONTS.body,
                lineHeight: 1.7,
              }}>
                {language === 'tr' ? scholar.noteTr : scholar.noteEn}
              </p>
            </div>
          );
        })}
      </div>

      {/* History narrative */}
      <div style={{ ...GLASS_CARD, padding: isMobile ? '20px' : '28px' }}>
        <h3 style={{
          color: COLORS.gold,
          fontFamily: FONTS.body,
          fontSize: '0.95rem',
          fontWeight: 700,
          margin: '0 0 16px',
        }}>
          {language === 'tr' ? 'İlmin Tarihçesi' : 'History of the Discipline'}
        </h3>
        {historyNarrative.map((para, i) => (
          <p key={i} style={{
            margin: i < historyNarrative.length - 1 ? '0 0 14px' : '0',
            fontSize: '0.87rem',
            color: COLORS.silver,
            fontFamily: FONTS.body,
            lineHeight: 1.8,
          }}>
            {para}
          </p>
        ))}
      </div>
    </div>
  );
}

// ── TabZaman ──────────────────────────────────────────────────────────────────
function TabZaman({ language, isMobile }) {
  const [timeEvents, setTimeEvents] = useState([]);
  const [timeLoading, setTimeLoading] = useState(true);
  const [timeSelected, setTimeSelected] = useState(null);
  const [timeFilter, setTimeFilter] = useState('all');
  const [timeSearch, setTimeSearch] = useState('');
  const [expandedSecondary, setExpandedSecondary] = useState(null);
  const detailRef = useRef(null);

  useEffect(() => {
    fetch('/esbabin-nuzul.json')
      .then(r => r.json())
      .then(d => { setTimeEvents(d.events || []); setTimeLoading(false); })
      .catch(() => setTimeLoading(false));
  }, []);

  /* eslint-disable react-hooks/set-state-in-effect -- resetting derived state when selection changes */
  useEffect(() => {
    if (timeSelected && detailRef.current) detailRef.current.scrollTop = 0;
    setExpandedSecondary(null);
  }, [timeSelected]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const filtered = timeEvents.filter(ev => {
    if (timeFilter !== 'all' && ev.period !== timeFilter && ev.category !== timeFilter) return false;
    if (timeSearch.trim()) {
      const q = timeSearch.toLowerCase();
      const inTitle = (language === 'tr' ? ev.titleTr : ev.titleEn).toLowerCase().includes(q);
      const inDesc = (language === 'tr' ? ev.descTr : ev.descEn).toLowerCase().includes(q);
      const inSurah = ev.surahs.some(s => s.nameTr.toLowerCase().includes(q));
      if (!inTitle && !inDesc && !inSurah) return false;
    }
    return true;
  });

  const groups = groupByPeriod(filtered);
  const selCat = timeSelected ? TCAT_META[timeSelected.category] : null;
  const selPeriod = timeSelected ? (TPERIOD_META[timeSelected.period] || TPERIOD_META['mekki']) : null;

  if (timeLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px' }}>
        <div style={{
          width: '28px', height: '28px', borderRadius: RADIUS.full,
          border: `2px solid ${COLORS.glassBorder}`,
          borderTopColor: COLORS.gold,
          animation: 'spin 0.8s linear infinite',
        }} />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

      {!timeSelected && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0',
          padding: '0 24px', overflowX: 'auto', flexShrink: 0,
          borderBottom: `1px solid ${COLORS.glassBorder}`,
          scrollbarWidth: 'none', minHeight: '52px',
          background: 'rgba(8,9,26,0.6)',
        }}>
          <span style={{
            fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: 'rgba(148,163,184,0.35)',
            whiteSpace: 'nowrap', marginRight: '10px', flexShrink: 0,
          }}>
            {language === 'tr' ? 'Dönem' : 'Period'}
          </span>

          <div style={{
            display: 'flex', gap: '2px',
            background: 'rgba(255,255,255,0.04)',
            border: `1px solid ${COLORS.glassBgStrong}`,
            borderRadius: RADIUS.chip, padding: '3px', flexShrink: 0,
          }}>
            {[
              { key: 'all', tr: 'Tümü', en: 'All', color: COLORS.gold },
              ...TPERIOD_ORDER.map(p => ({ key: p, tr: TPERIOD_META[p].tr, en: TPERIOD_META[p].en, color: TPERIOD_META[p].color })),
            ].map(f => {
              const active = timeFilter === f.key;
              return (
                <button
                  key={f.key}
                  onClick={() => setTimeFilter(f.key)}
                  style={{
                    padding: '5px 14px', borderRadius: '7px', whiteSpace: 'nowrap',
                    fontSize: '0.8rem', fontWeight: active ? 600 : 400, cursor: 'pointer',
                    border: 'none',
                    background: active ? `${f.color}28` : 'transparent',
                    color: active ? f.color : COLORS.silverAlpha70,
                    boxShadow: active ? `0 0 12px ${f.color}22` : 'none',
                    transition: 'all 0.15s', fontFamily: FONTS.body,
                  }}
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = COLORS.offWhite; }}}
                  onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = COLORS.silverAlpha70; }}}
                >
                  {language === 'tr' ? f.tr : f.en}
                </button>
              );
            })}
          </div>

          <div style={{ width: '1px', height: '20px', background: COLORS.glassBgStrong, margin: '0 16px', flexShrink: 0 }} />

          <span style={{
            fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: 'rgba(148,163,184,0.35)',
            whiteSpace: 'nowrap', marginRight: '10px', flexShrink: 0,
          }}>
            {language === 'tr' ? 'Konu' : 'Topic'}
          </span>

          <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
            {Object.entries(TCAT_META).map(([k, v]) => {
              const active = timeFilter === k;
              return (
                <button
                  key={k}
                  onClick={() => setTimeFilter(active ? 'all' : k)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '5px 12px', borderRadius: RADIUS.md, whiteSpace: 'nowrap',
                    fontSize: '0.8rem', fontWeight: active ? 600 : 400, cursor: 'pointer',
                    border: active ? `1px solid ${v.color}55` : `1px solid ${COLORS.glassBgStrong}`,
                    background: active ? `${v.color}18` : 'rgba(255,255,255,0.03)',
                    color: active ? v.color : COLORS.silverAlpha70,
                    boxShadow: active ? `0 0 10px ${v.color}20` : 'none',
                    transition: 'all 0.15s', fontFamily: FONTS.body,
                  }}
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = COLORS.offWhite; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}}
                  onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = COLORS.silverAlpha70; e.currentTarget.style.borderColor = COLORS.glassBgStrong; }}}
                >
                  <span style={{
                    width: '7px', height: '7px', borderRadius: RADIUS.full,
                    background: active ? v.color : `${v.color}80`, flexShrink: 0,
                  }} />
                  {language === 'tr' ? v.tr : v.en}
                </button>
              );
            })}
          </div>

          <div style={{ position: 'relative', marginLeft: '16px', flexShrink: 0 }}>
            <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={COLORS.silver} strokeWidth="2" strokeLinecap="round"
              style={{ position: 'absolute', left: '9px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              value={timeSearch}
              onChange={e => setTimeSearch(e.target.value)}
              placeholder={language === 'tr' ? 'Olay veya sûre ara...' : 'Search event or surah...'}
              style={{
                paddingLeft: '30px', paddingRight: '10px', height: '32px',
                background: COLORS.glassBg, border: `1px solid ${COLORS.glassBorder}`,
                borderRadius: RADIUS.md, color: COLORS.offWhite, fontSize: '0.8rem',
                outline: 'none', width: '170px', fontFamily: FONTS.body,
              }}
              onFocus={e => { e.target.style.borderColor = COLORS.gold; }}
              onBlur={e => { e.target.style.borderColor = COLORS.glassBorder; }}
            />
          </div>
        </div>
      )}

      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

        {!timeSelected && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px 24px 40px' }}>
            {filtered.length === 0 && (
              <p style={{ color: COLORS.silver, textAlign: 'center', marginTop: '60px', fontSize: '0.9rem', fontFamily: FONTS.body }}>
                {language === 'tr' ? 'Sonuç bulunamadı.' : 'No results found.'}
              </p>
            )}
            {TPERIOD_ORDER.map(periodKey => {
              const evs = groups[periodKey];
              if (!evs || evs.length === 0) return null;
              const pm = TPERIOD_META[periodKey];
              return (
                <div key={periodKey} style={{ marginBottom: '40px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: RADIUS.full, flexShrink: 0, background: pm.color, boxShadow: `0 0 8px ${pm.color}88` }}/>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: pm.color, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                      {language === 'tr' ? pm.tr : pm.en}
                    </div>
                    <div style={{ flex: 1, height: '1px', background: `linear-gradient(90deg, ${pm.color}44, transparent)` }}/>
                    <div style={{ fontSize: '0.72rem', color: COLORS.silver, flexShrink: 0 }}>{pm.years}</div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingLeft: '22px', borderLeft: `2px solid ${pm.color}33` }}>
                    {evs.map((ev, i) => {
                      const cm = TCAT_META[ev.category] || TCAT_META.vahiy;
                      return (
                        <motion.button
                          key={ev.id}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.04, duration: 0.25 }}
                          onClick={() => setTimeSelected(ev)}
                          style={{
                            display: 'flex', gap: '14px', alignItems: 'flex-start',
                            padding: '14px 16px', borderRadius: RADIUS.lg, cursor: 'pointer',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.07)',
                            textAlign: 'left', width: '100%',
                            transition: 'all 0.15s', position: 'relative',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = `${cm.color}44`; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
                        >
                          <div style={{ position: 'absolute', left: '-27px', top: '20px', width: '10px', height: '10px', borderRadius: RADIUS.full, background: cm.color, flexShrink: 0, boxShadow: `0 0 6px ${cm.color}66` }}/>
                          <div style={{ minWidth: '64px', textAlign: 'center', paddingTop: '2px', flexShrink: 0 }}>
                            <div style={{ fontSize: '0.68rem', color: pm.color, fontWeight: 600, letterSpacing: '0.04em' }}>{ev.hijriLabel}</div>
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                              <span style={{ fontSize: '0.94rem', fontWeight: 600, color: COLORS.offWhite, fontFamily: FONTS.body }}>
                                {language === 'tr' ? ev.titleTr : ev.titleEn}
                              </span>
                              <span style={{ fontSize: '0.65rem', fontWeight: 600, padding: '2px 8px', borderRadius: RADIUS.chip, background: cm.bg, color: cm.color, flexShrink: 0 }}>
                                {language === 'tr' ? cm.tr : cm.en}
                              </span>
                            </div>
                            <div style={{ fontSize: '0.78rem', color: COLORS.silver, lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', fontFamily: FONTS.body }}>
                              {language === 'tr' ? ev.descTr : ev.descEn}
                            </div>
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
                              {ev.surahs.map(s => (
                                <span key={s.num} style={{ fontSize: '0.68rem', padding: '2px 7px', borderRadius: RADIUS.md, background: COLORS.goldAlpha15, border: `1px solid ${COLORS.gold}40`, color: COLORS.gold, fontFamily: FONTS.body }}>
                                  {s.num}. {s.nameTr}{s.verses && <span style={{ opacity: 0.6 }}> {s.verses}</span>}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div style={{ color: COLORS.silver, paddingTop: '4px', flexShrink: 0 }}>
                            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                              <path d="M5 12h14M12 5l7 7-7 7"/>
                            </svg>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {timeSelected && (
          <motion.div
            ref={detailRef}
            key={timeSelected.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '20px 16px 60px' : '28px 28px 60px' }}
          >
            <button
              onClick={() => setTimeSelected(null)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px',
                padding: '6px 12px', borderRadius: RADIUS.md,
                background: COLORS.glassBg, border: `1px solid ${COLORS.glassBorder}`,
                color: COLORS.silver, cursor: 'pointer', fontSize: '0.8rem',
                fontFamily: FONTS.body, transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; e.currentTarget.style.color = COLORS.offWhite; }}
              onMouseLeave={e => { e.currentTarget.style.background = COLORS.glassBg; e.currentTarget.style.color = COLORS.silver; }}
            >
              <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M19 12H5M12 5l-7 7 7 7"/>
              </svg>
              {language === 'tr' ? "Zaman çizelgesine dön" : 'Back to timeline'}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
              {selPeriod && (
                <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '3px 10px', borderRadius: RADIUS.lg, background: `${selPeriod.color}22`, border: `1px solid ${selPeriod.color}44`, color: selPeriod.color, letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: FONTS.body }}>
                  {language === 'tr' ? selPeriod.tr : selPeriod.en}
                </span>
              )}
              {selCat && (
                <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '3px 10px', borderRadius: RADIUS.lg, background: selCat.bg, border: `1px solid ${selCat.color}44`, color: selCat.color, letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: FONTS.body }}>
                  {language === 'tr' ? selCat.tr : selCat.en}
                </span>
              )}
              <span style={{ fontSize: '0.78rem', color: COLORS.silver, marginLeft: 'auto', fontFamily: FONTS.body }}>
                {timeSelected.hijriLabel}
              </span>
            </div>

            <h2 style={{ margin: '0 0 24px', fontSize: isMobile ? '1.3rem' : '1.55rem', fontWeight: 700, color: COLORS.offWhite, fontFamily: FONTS.display, lineHeight: 1.3 }}>
              {language === 'tr' ? timeSelected.titleTr : timeSelected.titleEn}
            </h2>

            {timeSelected.verseAr && (
              <div style={{ margin: '0 0 28px', padding: '20px 24px', background: `${COLORS.gold}11`, border: `1px solid ${COLORS.gold}33`, borderRadius: RADIUS.lg, borderLeft: `3px solid ${COLORS.gold}` }}>
                <p style={{ fontFamily: FONTS.quran, fontSize: '1.7rem', lineHeight: 2, color: COLORS.gold, textAlign: 'right', direction: 'rtl', margin: '0 0 10px' }} dir="rtl" lang="ar">
                  {timeSelected.verseAr}
                </p>
                <p style={{ fontSize: '0.85rem', color: COLORS.offWhite, lineHeight: 1.7, margin: '0 0 6px', fontStyle: 'italic', fontFamily: FONTS.body }}>
                  {timeSelected.verseTr}
                </p>
                <p style={{ margin: 0, fontSize: '0.72rem', color: COLORS.silver, fontFamily: FONTS.body }}>
                  — {timeSelected.verseRef}
                </p>
              </div>
            )}

            {timeSelected.secondaryVerses && timeSelected.secondaryVerses.length > 0 && (
              <div style={{ marginBottom: '28px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {timeSelected.secondaryVerses.map(sv => {
                  const isOpen = expandedSecondary === sv.verseRef;
                  return (
                    <div key={sv.verseRef}>
                      <button
                        onClick={() => setExpandedSecondary(isOpen ? null : sv.verseRef)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '10px',
                          width: '100%', textAlign: 'left', cursor: 'pointer',
                          padding: '10px 14px', borderRadius: RADIUS.chip,
                          background: isOpen ? `${COLORS.gold}1a` : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${isOpen ? `${COLORS.gold}55` : COLORS.glassBgStrong}`,
                          transition: 'all 0.2s', fontFamily: FONTS.body,
                        }}
                        onMouseEnter={e => { if (!isOpen) { e.currentTarget.style.background = `${COLORS.gold}0d`; e.currentTarget.style.borderColor = `${COLORS.gold}33`; }}}
                        onMouseLeave={e => { if (!isOpen) { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = COLORS.glassBgStrong; }}}
                      >
                        <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="2.5" strokeLinecap="round"
                          style={{ flexShrink: 0, transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>
                          <path d="M9 18l6-6-6-6"/>
                        </svg>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.7rem', color: COLORS.gold, fontWeight: 700, marginBottom: '2px', fontFamily: FONTS.body }}>{sv.verseRef}</div>
                          <div style={{ fontSize: '0.78rem', color: COLORS.silver, fontFamily: FONTS.body }}>{language === 'tr' ? sv.labelTr : sv.labelEn}</div>
                        </div>
                      </button>
                      {isOpen && (
                        <div style={{ marginTop: '6px', padding: '18px 20px', background: `${COLORS.gold}0d`, border: `1px solid ${COLORS.gold}2e`, borderRadius: RADIUS.chip, borderLeft: `3px solid ${COLORS.gold}80` }}>
                          <p style={{ fontFamily: FONTS.quran, fontSize: '1.55rem', lineHeight: 2, color: COLORS.gold, textAlign: 'right', direction: 'rtl', margin: '0 0 10px' }} dir="rtl" lang="ar">{sv.verseAr}</p>
                          <p style={{ fontSize: '0.85rem', color: COLORS.offWhite, lineHeight: 1.7, margin: '0 0 6px', fontStyle: 'italic', fontFamily: FONTS.body }}>{sv.verseTr}</p>
                          <p style={{ margin: 0, fontSize: '0.72rem', color: COLORS.silver, fontFamily: FONTS.body }}>— {sv.verseRef}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            <div style={{ marginBottom: '28px' }}>
              <div style={{ fontSize: '0.65rem', color: COLORS.gold, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '10px', fontFamily: FONTS.body }}>
                {language === 'tr' ? "İniş Sebebi" : 'Occasion'}
              </div>
              <p style={{ fontSize: '0.95rem', color: COLORS.offWhite, lineHeight: 1.85, margin: 0, borderLeft: `2px solid ${COLORS.gold}4d`, paddingLeft: '16px', fontFamily: FONTS.body }}>
                {language === 'tr' ? timeSelected.occasionTr : timeSelected.occasionEn}
              </p>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <div style={{ fontSize: '0.65rem', color: COLORS.silver, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '10px', fontFamily: FONTS.body }}>
                {language === 'tr' ? 'Tefsir Notu' : 'Insight'}
              </div>
              <p style={{ fontSize: '0.88rem', color: COLORS.silver, lineHeight: 1.85, margin: 0, fontFamily: FONTS.body }}>
                {language === 'tr' ? timeSelected.descTr : timeSelected.descEn}
              </p>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.65rem', color: COLORS.silver, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '12px', fontFamily: FONTS.body }}>
                {language === 'tr' ? "İlgili Sûreler" : 'Related Surahs'}
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {timeSelected.surahs.map(s => (
                  <div key={s.num} style={{ padding: '10px 16px', borderRadius: RADIUS.chip, background: `${COLORS.gold}14`, border: `1px solid ${COLORS.gold}40` }}>
                    <div style={{ fontSize: '0.7rem', color: COLORS.gold, fontWeight: 700, marginBottom: '2px', fontFamily: FONTS.body }}>{s.num}. Sûre</div>
                    <div style={{ fontSize: '0.95rem', color: COLORS.offWhite, fontWeight: 600, fontFamily: FONTS.body }}>{s.nameTr}</div>
                    {s.verses && <div style={{ fontSize: '0.72rem', color: COLORS.silver, marginTop: '3px', fontFamily: FONTS.body }}>{language === 'tr' ? 'Ayet' : 'Verse'} {s.verses}</div>}
                  </div>
                ))}
              </div>
            </div>

            <TimelinePrevNext events={timeEvents} current={timeSelected} onSelect={setTimeSelected} language={language} />
          </motion.div>
        )}
      </div>

      {!timeSelected && (
        <div style={{
          display: 'flex', gap: '24px', padding: '10px 24px',
          borderTop: `1px solid ${COLORS.glassBorder}`,
          background: 'rgba(8,9,26,0.9)', flexShrink: 0, flexWrap: 'wrap',
        }}>
          {[
            { val: timeEvents.length, tr: 'Olay', en: 'Events' },
            { val: timeEvents.filter(e => e.period !== 'medeni').length, tr: "Mekkî", en: 'Meccan' },
            { val: timeEvents.filter(e => e.period === 'medeni').length, tr: "Medenî", en: 'Medinan' },
            { val: [...new Set(timeEvents.flatMap(e => e.surahs.map(s => s.num)))].length, tr: 'Sûre', en: 'Surahs' },
          ].map(s => (
            <div key={s.tr} style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
              <span style={{ fontSize: '1rem', fontWeight: 700, color: COLORS.gold, fontFamily: FONTS.body }}>{s.val}</span>
              <span style={{ fontSize: '0.72rem', color: COLORS.silver, fontFamily: FONTS.body }}>{language === 'tr' ? s.tr : s.en}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function SebebiNuzul({ onClose }) {
  const { language } = useLanguage();
  const [isMobile, setIsMobile] = useState(false)  // SSR-safe; useEffect h() post-mount hydrate;
  const [activeTab, setActiveTab] = useState(0);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const contentRef = useRef(null);
  const trapRef = useFocusTrap(true);

  // Mobile detection
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < BREAKPOINT_MOBILE);
    h(); // post-mount hydrate
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  // Fetch data
  useEffect(() => {
    fetch('/sebeb-i-nuzul.json')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Escape key
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  // Body scroll lock kaldırıldı — WowFacts/IlkSon pattern: normal-flow document scroll.

  // Scroll to top on tab change
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [activeTab]);

  // Loading screen
  if (loading) {
    return (
      <div ref={trapRef} style={{
        background: COLORS.cosmicBlack,
        minHeight: 'calc(100vh - 62px)',
        display: 'flex', flexDirection: 'column',
        paddingTop: '62px',
      }}>
        <ToolHeader
          icon={<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
          titleTr="Sebeb-i Nüzûl"
          titleEn="Occasions of Revelation"
          subtitleTr="Ayetlerin iniş bağlamı"
          subtitleEn="The historical context of revelation"
          language={language}
        />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: RADIUS.full,
            border: `3px solid ${COLORS.glassBorder}`,
            borderTopColor: COLORS.gold,
            animation: 'spin 0.8s linear infinite',
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div
      ref={trapRef}
      style={{
        background: COLORS.cosmicBlack,
        minHeight: 'calc(100vh - 62px)',
        display: 'flex', flexDirection: 'column',
        paddingTop: '62px',
      }}
    >
      <ToolHeader
        icon={<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
        titleTr="Sebeb-i Nüzûl"
        titleEn="Occasions of Revelation"
        subtitleTr="Ayetlerin iniş bağlamı · Vâhidî & Suyûtî"
        subtitleEn="Context of revelation · al-Wāḥidī & al-Suyūṭī"
        language={language}
      />

      {/* ── HERO (Cinematic) ───────────────────────────────────────── */}
      <div style={{
        padding: isMobile ? '40px 16px 28px' : '56px 32px 36px',
        background: 'linear-gradient(180deg, rgba(212,165,116,0.06) 0%, transparent 100%)',
        borderBottom: `1px solid ${COLORS.glassBorderSoft || COLORS.glassBorder}`,
        textAlign: 'center',
        flexShrink: 0,
      }}>
        <div dir="rtl" lang="ar" aria-label="Bismillāh" style={{ fontFamily: "'Amiri Quran', 'Amiri', serif", fontSize: isMobile ? '1.5rem' : '1.95rem', color: COLORS.gold, opacity: 0.82, lineHeight: 1, marginBottom: isMobile ? '26px' : '36px', textShadow: `0 0 22px ${COLORS.gold}28` }}>﷽</div>
        <p dir="rtl" lang="ar" style={{ fontFamily: FONTS.quran, fontSize: isMobile ? 'clamp(1.05rem, 4.2vw, 1.4rem)' : 'clamp(1.25rem, 2.3vw, 1.65rem)', color: COLORS.gold, lineHeight: 2.1, margin: '0 auto 16px', maxWidth: '820px', textShadow: `0 0 20px ${COLORS.gold}1c` }}>
          وَقَالَ الَّذِينَ كَفَرُوا لَوْلَا نُزِّلَ عَلَيْهِ الْقُرْاٰنُ جُمْلَةً وَاحِدَةً كَذٰلِكَ لِنُثَبِّتَ بِهِ فُؤَادَكَ
        </p>
        <p style={{ color: COLORS.offWhite, fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: isMobile ? '0.94rem' : 'clamp(0.95rem, 1.6vw, 1.05rem)', lineHeight: 1.7, margin: '0 auto 8px', maxWidth: '680px', opacity: 0.95 }}>
          "{language === 'tr' ? "İnkâr edenler, 'Kur'an ona bir defada toptan indirilseydi ya' dediler. Biz onu kalbine sağlam yerleştirelim diye böyle yaptık." : "The disbelievers said, 'Why was the Quran not sent down to him all at once?' We have done it this way to firmly establish your heart with it."}"
        </p>
        <p style={{ color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.72rem', letterSpacing: '0.16em', textTransform: 'uppercase', margin: '0 0 32px', opacity: 0.65 }}>
          — {language === 'tr' ? 'Furkân 25:32' : 'Al-Furqān 25:32'}
        </p>
        <p style={{ color: COLORS.silver, fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: isMobile ? '0.92rem' : 'clamp(0.95rem, 1.55vw, 1.02rem)', lineHeight: 1.7, margin: '0 auto 36px', maxWidth: '700px', opacity: 0.88 }}>
          {language === 'tr' ? <>Kur'an <em style={{ fontStyle: 'normal', color: COLORS.gold }}>23 yılda</em> ayet ayet indi. Her ayetin bir <em style={{ fontStyle: 'normal', color: COLORS.gold }}>iniş anı</em> var. Sebeb-i Nüzul bilmek, anlamı bağlamına yerleştirmektir.</> : <>The Quran descended <em style={{ fontStyle: 'normal', color: COLORS.gold }}>over 23 years</em>, verse by verse. Each verse has a <em style={{ fontStyle: 'normal', color: COLORS.gold }}>moment of descent</em>. To know its occasion is to place meaning in its context.</>}
        </p>
        <div aria-hidden="true" style={{ width: '120px', height: '1px', background: `linear-gradient(to right, transparent, ${COLORS.gold}66, transparent)`, margin: '0 auto 28px' }} />
        <div style={{ fontSize: '0.68rem', letterSpacing: '0.3em', color: COLORS.gold, textTransform: 'uppercase', fontFamily: FONTS.body, fontWeight: 700, opacity: 0.72, marginBottom: '14px' }}>
          {language === 'tr' ? "İNİŞ BAĞLAMI · VÂHİDÎ · SUYÛTÎ" : "OCCASION OF REVELATION · AL-WĀḤIDĪ · AL-SUYŪṬĪ"}
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: isMobile ? 'clamp(1.6rem, 7vw, 2rem)' : 'clamp(2rem, 3.6vw, 2.7rem)', fontWeight: 700, color: COLORS.offWhite, margin: '0 auto 14px', lineHeight: 1.18, letterSpacing: '-0.015em', maxWidth: '760px' }}>
          {language === 'tr' ? "Her Ayetin Bir Anı Vardır" : 'Every Verse Has Its Moment'}
        </h1>
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: isMobile ? '1rem' : 'clamp(1.05rem, 1.8vw, 1.18rem)', color: COLORS.gold, margin: '0 auto 12px', lineHeight: 1.55, fontStyle: 'italic', maxWidth: '700px', opacity: 0.92 }}>
          {language === 'tr' ? 'Klasik kural: "Lâ yûsenu illâ bi-nass." — Yalnız sahih rivayetle bilinir.' : 'Classical rule: "lā yūsenu illā bi-naṣṣ." — Known only through authentic transmission.'}
        </p>
      </div>

      {/* Tab bar — UPPERCASE site-wide pattern */}
      <div id="sebebi-tab-bar" style={{
        display: 'flex',
        borderBottom: `1px solid ${COLORS.glassBorder}`,
        overflowX: 'auto',
        scrollbarWidth: 'none',
        flexShrink: 0,
        background: 'rgb(6, 8, 14)',
        backgroundColor: 'rgb(6, 8, 14)',
        isolation: 'isolate',
        position: 'sticky',
        top: '110px',
        zIndex: 20,
        scrollMarginTop: '120px',
      }}>
        {TABS.map((tab, i) => (
          <button
            key={i}
            onClick={() => { setActiveTab(i); setTimeout(() => { const tb = document.getElementById('sebebi-tab-bar'); if (tb) tb.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 50); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: isMobile ? '14px 16px' : '16px 26px',
              border: 'none',
              borderBottom: `2px solid ${activeTab === i ? COLORS.gold : 'transparent'}`,
              background: activeTab === i ? COLORS.goldAlpha15 : 'transparent',
              color: activeTab === i ? COLORS.gold : COLORS.silver,
              fontSize: isMobile ? '0.72rem' : '0.78rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              fontWeight: activeTab === i ? 700 : 500,
              fontFamily: FONTS.body,
              cursor: 'pointer',
              transition: 'all 0.15s',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            {tab.icon}
            {language === 'tr' ? tab.labelTr : tab.labelEn}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 4 ? (
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <TabZaman language={language} isMobile={isMobile} />
        </div>
      ) : (
        <div ref={contentRef} style={{ flex: 1 }}>
          {activeTab === 0 && <TabArama data={data} language={language} isMobile={isMobile} />}
          {activeTab === 1 && <TabIstatistik data={data} language={language} isMobile={isMobile} />}
          {activeTab === 2 && <TabIlkeler data={data} language={language} isMobile={isMobile} />}
          {activeTab === 3 && <TabKaynaklar data={data} language={language} isMobile={isMobile} />}
        </div>
      )}
    </div>
  );
}
