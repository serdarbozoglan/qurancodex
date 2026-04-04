import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import {
  OVERLAY_BASE, OVERLAY_HEADER, OVERLAY_TITLE, CLOSE_BTN,
  COLORS, FONTS, GLASS_CARD,
} from '../tokens';

// ── Arabic text cleanup ───────────────────────────────────────────────────────
function cleanArabic(str) {
  if (!str) return str;
  return str
    .replace(/\u06EA/g, '\u0650')
    .replace(/[\u064B-\u0652]\u0653/gu, '\u0653')
    .replace(/\u0671/g, '\u0627')
    .replace(/\u06CC/g, '\u064A')
    .replace(/[\u0610-\u0614\u0616\u0617]/g, '')
    .replace(/[\u0600-\u0605]/g, '')
    .replace(/[\u06DD\u06DE\u06E9]/g, '')
    .replace(/\u06E6/g, ' ')
    .replace(/[\u06D6-\u06DC\u06E0\u06E2-\u06E4\u06E7\u06E8\u06EB\u06ED]/g, '')
    .replace(/[\uFD3E\uFD3F]/g, '');
}

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

// ── Tab definitions ───────────────────────────────────────────────────────────
const TABS = [
  {
    labelTr: 'Arama',
    labelEn: 'Search',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    ),
  },
  {
    labelTr: 'İstatistik',
    labelEn: 'Statistics',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
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
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </svg>
    ),
  },
  {
    labelTr: 'Kaynaklar',
    labelEn: 'Sources',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2"/>
        <polyline points="2 17 12 22 22 17"/>
        <polyline points="2 12 12 17 22 12"/>
      </svg>
    ),
  },
];

// ── OccasionCard ──────────────────────────────────────────────────────────────
function OccasionCard({ occ, language, isMobile }) {
  const [expanded, setExpanded] = useState(false);
  const [verseData, setVerseData] = useState(null);

  const catMeta = CATEGORY_META[occ.category] || { tr: occ.category, en: occ.category, color: COLORS.silver };
  const relMeta = RELIABILITY_META[occ.reliability] || { tr: occ.reliability, en: occ.reliability, color: COLORS.silver };
  const periodMeta = PERIOD_META[occ.period] || { tr: occ.period, en: occ.period, color: COLORS.silver };

  const title = language === 'tr' ? occ.titleTr : occ.titleEn;
  const summary = language === 'tr' ? occ.summaryTr : occ.summaryEn;

  function handleToggle() {
    const next = !expanded;
    setExpanded(next);
    if (next && verseData === null && occ.verses && occ.verses.length > 0) {
      const v = occ.verses[0];
      setVerseData({ loading: true, verses: [] });
      fetch(`https://api.acikkuran.com/surah/${v.surah}?author=105`)
        .then(r => r.json())
        .then(d => {
          const allVerses = d.data?.verses || [];
          const filtered = allVerses
            .filter(ve => ve.verse_number >= v.ayahStart && ve.verse_number <= v.ayahEnd)
            .map(ve => ({
              num: ve.verse_number,
              arabic: cleanArabic(ve.verse),
              turkish: ve.translation?.text || '',
            }));
          setVerseData({ loading: false, verses: filtered });
        })
        .catch(() => setVerseData({ loading: false, verses: [] }));
    }
  }

  const chipStyle = (color) => ({
    display: 'inline-flex',
    alignItems: 'center',
    padding: '2px 8px',
    borderRadius: '99px',
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
    borderRadius: '99px',
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
                padding: '1px 7px', borderRadius: '99px',
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
            borderRadius: '6px',
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
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
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
                width: '24px', height: '24px', borderRadius: '50%',
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
                  {occ.verses[0].surah}:{ve.num}
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
    if (reliabilityFilter === 'no-daif' && occ.reliability === 'daif') return false;

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

  const chipBtn = (active, onClick, label, color) => (
    <button
      onClick={onClick}
      style={{
        padding: '4px 12px',
        borderRadius: '99px',
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
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </span>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={
            mode === 'verse'
              ? (language === 'tr' ? 'Sure:Ayet girin (örn. 24:11)…' : 'Enter Surah:Ayah (e.g. 24:11)…')
              : (language === 'tr' ? 'Olay, kişi veya konu ara…' : 'Search event, person or topic…')
          }
          style={{
            width: '100%',
            padding: '10px 12px 10px 38px',
            borderRadius: '8px',
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
            borderRadius: '99px',
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
            borderRadius: '99px',
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
          {chipBtn(catFilter === 'all', () => setCatFilter('all'), language === 'tr' ? 'Tümü' : 'All')}
          {Object.entries(CATEGORY_META).map(([key, meta]) =>
            chipBtn(catFilter === key, () => setCatFilter(key), language === 'tr' ? meta.tr : meta.en, meta.color)
          )}
        </div>
      </div>

      {/* Period filter */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
        {chipBtn(periodFilter === 'all', () => setPeriodFilter('all'), language === 'tr' ? 'Tüm Dönemler' : 'All Periods')}
        {chipBtn(periodFilter === 'makki', () => setPeriodFilter('makki'), language === 'tr' ? 'Mekkî' : 'Meccan', '#f39c12')}
        {chipBtn(periodFilter === 'madani', () => setPeriodFilter('madani'), language === 'tr' ? 'Medenî' : 'Medinan', '#3498db')}
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

  // Build conic gradient for donut
  let gradientParts = [];
  let cumulative = 0;
  byCategory.forEach(item => {
    const meta = CATEGORY_META[item.category];
    if (!meta) return;
    const start = cumulative;
    const end = cumulative + item.percent;
    gradientParts.push(`${meta.color} ${start.toFixed(1)}% ${end.toFixed(1)}%`);
    cumulative = end;
  });
  const donutGradient = `conic-gradient(${gradientParts.join(', ')})`;

  const makki = byPeriod.find(p => p.period === 'makki') || { approxCount: 0, percent: 0 };
  const madani = byPeriod.find(p => p.period === 'madani') || { approxCount: 0, percent: 0 };

  const heroStats = [
    {
      value: '570',
      labelTr: 'Sebeb-i nüzulü bilinen ayet',
      labelEn: 'Verses with known occasion',
    },
    {
      value: '%9.1',
      labelTr: 'Toplam ayetlerin oranı',
      labelEn: 'Of all Quranic verses',
    },
    {
      value: '83→102',
      labelTr: 'Kapsanan sure (Vâhidî→Süyûtî)',
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
              borderRadius: '50%',
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
                borderRadius: '50%',
                background: '#0a0a1a',
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
          borderRadius: '99px',
          overflow: 'hidden',
          display: 'flex',
          marginBottom: '12px',
        }}>
          <div style={{
            width: `${makki.percent}%`,
            background: '#f39c12',
            transition: 'width 0.8s ease',
          }} />
          <div style={{
            width: `${madani.percent}%`,
            background: '#3498db',
            transition: 'width 0.8s ease',
          }} />
        </div>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#f39c12' }} />
            <span style={{ fontSize: '0.8rem', color: COLORS.silver, fontFamily: FONTS.body }}>
              {language === 'tr' ? 'Mekkî' : 'Meccan'}: {makki.percent}% (~{makki.approxCount})
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#3498db' }} />
            <span style={{ fontSize: '0.8rem', color: COLORS.silver, fontFamily: FONTS.body }}>
              {language === 'tr' ? 'Medenî' : 'Medinan'}: {madani.percent}% (~{madani.approxCount})
            </span>
          </div>
        </div>
        <p style={{ margin: 0, fontSize: '0.82rem', color: COLORS.silver, fontFamily: FONTS.body, lineHeight: 1.6 }}>
          {language === 'tr'
            ? 'Medenî dönemin %72 oranıyla öne çıkması, Medine'de toplum inşasına yönelik sosyal, hukuki ve siyasi meselelerin ön plana çıktığının göstergesidir.'
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
                <div style={{ fontSize: '0.72rem', color: COLORS.silver, fontFamily: FONTS.body }}>{language === 'tr' ? 'Sure' : 'Surahs'}</div>
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
                <div style={{ fontSize: '0.72rem', color: COLORS.silver, fontFamily: FONTS.body }}>{language === 'tr' ? 'Sure' : 'Surahs'}</div>
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

// ── TabIlkeler ────────────────────────────────────────────────────────────────
function TabIlkeler({ data, language, isMobile }) {
  const principles = data.principles || [];

  const majority = principles.filter(p => p.camp === 'majority');
  const minority = principles.filter(p => p.camp === 'minority');
  const rest = principles.filter(p => p.camp !== 'majority' && p.camp !== 'minority');

  const pad = isMobile ? '16px' : '24px 32px';

  function PrincipleCard({ principle, badge, badgeColor }) {
    return (
      <div style={{ ...GLASS_CARD, padding: isMobile ? '16px' : '20px 24px' }}>
        {badge && (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '2px 10px',
            borderRadius: '99px',
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
            />
          ))}
          {minority.map(p => (
            <PrincipleCard
              key={p.id}
              principle={p}
              badge={language === 'tr' ? 'AZINLIK GÖRÜŞÜ' : 'MINORITY VIEW'}
              badgeColor={COLORS.amber}
            />
          ))}
        </div>
      )}

      {/* Remaining principles */}
      {rest.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
          {rest.map(p => (
            <PrincipleCard key={p.id} principle={p} />
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
    expander:  { tr: 'Genişletici', en: 'Expander', color: COLORS.skyBlue },
    precursor: { tr: 'Öncü', en: 'Precursor',  color: COLORS.softEmerald },
  };

  const historyNarrative = language === 'tr' ? [
    'Sebeb-i nüzul bilgisi, İslam'ın ilk dönemlerinden itibaren hadis ve tefsir külliyatı içinde dağınık biçimde mevcut olmuştur. Sahabe ve tabiîn nesli, Hz. Peygamber'in (s.a.v.) vahyin iniş sürecini bizzat yaşadıkları için bu bilgileri titizlikle aktarmıştır.',
    'Hicri 5. asırda Alî b. Ahmed el-Vâhidî en-Nîşâbûrî (ö. 468/1075), "Kitâbu Esbâbi'n-Nüzûl" adlı eseriyle bu alanda kaleme alınan ilk müstakil çalışmayı ortaya koymuştur. Vâhidî, Kur'an'ın 83 suresine dair rivayetleri derlemiş ve bu ilmin metodolojik temellerini atmıştır.',
    'Hicri 9. asırda Celâlüddîn es-Süyûtî (ö. 911/1505) "Lübâbu'n-Nukûl fî Esbâbi'n-Nüzûl" adlı eseriyle kapsamı 102 sureye genişletmiş, rivayetleri tenkit süzgecinden geçirmiş ve ilmin metodolojisini daha da olgunlaştırmıştır.',
    'Modern dönemde sebeb-i nüzul ilmi, Kur'an'ın siyak-sibak dışında yorumlanmasını önleyen kritik bir referans alanı olarak önemini korumaktadır. Metin tenkidi, tarihî bağlam araştırmaları ve karşılaştırmalı tefsir çalışmaları, bu ilmin verilerinden beslenmeye devam etmektedir.',
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
                  borderRadius: '99px',
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
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.04)',
                      border: `1px solid ${COLORS.glassBorderSoft}`,
                      textAlign: 'center',
                    }}>
                      <div style={{ fontWeight: 800, color: COLORS.offWhite, fontFamily: FONTS.body, fontSize: '1.1rem', lineHeight: 1 }}>
                        {scholar.surahsCovered}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: COLORS.silver, fontFamily: FONTS.body, marginTop: '2px' }}>
                        {language === 'tr' ? 'Sure' : 'Surahs'}
                      </div>
                    </div>
                  )}
                  {scholar.versesCovered != null && (
                    <div style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
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

// ── Main component ────────────────────────────────────────────────────────────
export default function SebebiNuzul({ onClose }) {
  const { language } = useLanguage();
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640);
  const [activeTab, setActiveTab] = useState(0);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const contentRef = useRef(null);

  // Mobile detection
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 640);
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

  // Scroll to top on tab change
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [activeTab]);

  // Loading screen
  if (loading) {
    return (
      <div style={{ ...OVERLAY_BASE, display: 'flex', alignItems: 'center', justifyContent: 'center' }} role="dialog" aria-modal="true">
        <div style={{
          width: '36px', height: '36px', borderRadius: '50%',
          border: `3px solid ${COLORS.glassBorder}`,
          borderTopColor: COLORS.gold,
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div
      style={{ ...OVERLAY_BASE, display: 'flex', flexDirection: 'column' }}
      role="dialog"
      aria-modal="true"
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Header */}
      <div style={{ ...OVERLAY_HEADER }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ color: COLORS.gold, flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </span>
          <span style={OVERLAY_TITLE}>
            {language === 'tr' ? 'Sebeb-i Nüzul Veritabanı' : 'Occasions of Revelation Database'}
          </span>
        </div>
        <button
          onClick={onClose}
          style={{ ...CLOSE_BTN }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = COLORS.offWhite; }}
          onMouseLeave={e => { e.currentTarget.style.background = CLOSE_BTN.background; e.currentTarget.style.color = COLORS.silver; }}
          aria-label="Kapat"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>

      {/* Tab bar */}
      <div style={{
        display: 'flex',
        borderBottom: `1px solid ${COLORS.glassBorder}`,
        overflowX: 'auto',
        scrollbarWidth: 'none',
        flexShrink: 0,
        background: 'rgba(8,9,26,0.7)',
      }}>
        {TABS.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: isMobile ? '10px 14px' : '12px 20px',
              border: 'none',
              borderBottom: `2px solid ${activeTab === i ? COLORS.gold : 'transparent'}`,
              background: 'transparent',
              color: activeTab === i ? COLORS.gold : COLORS.silver,
              fontSize: '0.82rem',
              fontWeight: activeTab === i ? 600 : 400,
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
      <div ref={contentRef} style={{ flex: 1, overflowY: 'auto' }}>
        {activeTab === 0 && <TabArama data={data} language={language} isMobile={isMobile} />}
        {activeTab === 1 && <TabIstatistik data={data} language={language} isMobile={isMobile} />}
        {activeTab === 2 && <TabIlkeler data={data} language={language} isMobile={isMobile} />}
        {activeTab === 3 && <TabKaynaklar data={data} language={language} isMobile={isMobile} />}
      </div>
    </div>
  );
}
