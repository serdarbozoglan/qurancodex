'use client';

import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS, GLASS_CARD, BREAKPOINT_MOBILE, RADIUS } from '../tokens';
import ToolHeader from './ToolHeader';
import LoadingOverlay from './LoadingOverlay';
import useFocusTrap from '../hooks/useFocusTrap';

// ── Context badge color map ───────────────────────────────────────────────────
const ANIMAL_CONTEXT_COLORS = {
  'delil':           '#f59e0b',
  'kissa':           '#14b8a6',
  'haram-helal':     '#ef4444',
  'cennet-cehennem': '#22c55e',
  'sure-adi':        '#fbbf24',
  'mecaz':           '#60a5fa',
  'hapax':           '#a855f7',
};

const PLANT_CONTEXT_COLORS = {
  'cennet': '#22c55e',
  'cehennem': '#ef4444',
  'dunya': COLORS.gold,
  'yemin': '#a855f7',
  'kissa': '#14b8a6',
  'mecaz': '#60a5fa',
  'hapax': '#a855f7',
};

// ── Filter option lists ───────────────────────────────────────────────────────
const ANIMAL_FILTERS = ['Tümü', 'delil', 'kissa', 'haram-helal', 'cennet-cehennem', 'sure-adi', 'hapax'];
const PLANT_FILTERS  = ['Tümü', 'cennet', 'cehennem', 'dunya', 'yemin', 'hapax'];

const ANIMAL_FILTER_LABELS_TR = {
  'Tümü': 'Tümü', 'delil': 'Delil', 'kissa': 'Kıssa',
  'haram-helal': 'Haram-Helal', 'cennet-cehennem': 'Cennet-Cehennem',
  'sure-adi': 'Sûre Adı', 'hapax': 'Hapax',
};
const ANIMAL_FILTER_LABELS_EN = {
  'Tümü': 'All', 'delil': 'Evidence', 'kissa': 'Narrative',
  'haram-helal': 'Lawful/Forbidden', 'cennet-cehennem': 'Paradise/Hell',
  'sure-adi': 'Surah Name', 'hapax': 'Hapax',
};

const PLANT_FILTER_LABELS_TR = {
  'Tümü': 'Tümü', 'cennet': 'Cennet', 'cehennem': 'Cehennem',
  'dunya': 'Dünya', 'yemin': 'Yemin', 'hapax': 'Hapax',
};
const PLANT_FILTER_LABELS_EN = {
  'Tümü': 'All', 'cennet': 'Paradise', 'cehennem': 'Hell',
  'dunya': 'World', 'yemin': 'Oath', 'hapax': 'Hapax',
};

// ── Tab definitions ───────────────────────────────────────────────────────────
const TAB_ICONS = [
  // Hayvanlar — paw print
  <svg aria-hidden="true" key="t0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="7" cy="8" r="2"/><circle cx="17" cy="8" r="2"/><circle cx="4.5" cy="13.5" r="1.5"/><circle cx="19.5" cy="13.5" r="1.5"/><path d="M8.5 14s1.5-1 3.5-1 3.5 1 3.5 1l1 3.5a2 2 0 0 1-2 2.5h-5a2 2 0 0 1-2-2.5z"/></svg>,
  // Bitkiler — leaf
  <svg aria-hidden="true" key="t1" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22V12"/><path d="M5 3c0 0 1 11 7 9s7 9 7 9"/><path d="M5 3s4 4 7 9"/></svg>,
  // Sûre İsimleri — book
  <svg aria-hidden="true" key="t2" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="14" y2="11"/></svg>,
  // Bağlam — layers
  <svg aria-hidden="true" key="t3" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
  // Tefsir — scroll
  <svg aria-hidden="true" key="t4" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="12" y2="17"/></svg>,
];
const TABS = [
  { icon: TAB_ICONS[0], labelTr: 'Hayvanlar',    labelEn: 'Animals',     shortTr: 'Hayvan', shortEn: 'Animal'   },
  { icon: TAB_ICONS[1], labelTr: 'Bitkiler',      labelEn: 'Plants',      shortTr: 'Bitki',  shortEn: 'Plant'    },
  { icon: TAB_ICONS[2], labelTr: 'Sûre İsimleri', labelEn: 'Surah Names', shortTr: 'Sûre',   shortEn: 'Surah'    },
  { icon: TAB_ICONS[3], labelTr: 'Bağlam',        labelEn: 'Context',     shortTr: 'Bağlam', shortEn: 'Context'  },
  { icon: TAB_ICONS[4], labelTr: 'Tefsir',        labelEn: 'Tafsir',      shortTr: 'Tefsir', shortEn: 'Tafsir'   },
];

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ label, isMobile, onClick, active }) {
  const isClickable = !!onClick;
  const Tag = isClickable ? 'button' : 'div';
  return (
    <Tag
      onClick={onClick}
      style={{
        ...GLASS_CARD,
        border: `1px solid ${active ? COLORS.gold : COLORS.goldAlpha25}`,
        background: active ? COLORS.goldAlpha15 : GLASS_CARD.background,
        padding: isMobile ? '10px 12px' : '14px 20px',
        textAlign: 'center',
        flexShrink: 0,
        cursor: isClickable ? 'pointer' : 'default',
        transition: 'all 0.15s',
        outline: 'none',
        font: 'inherit',
      }}
      onMouseEnter={isClickable ? (e) => { if (!active) e.currentTarget.style.borderColor = COLORS.gold; } : undefined}
      onMouseLeave={isClickable ? (e) => { if (!active) e.currentTarget.style.borderColor = COLORS.goldAlpha25; } : undefined}
    >
      <span style={{ color: COLORS.gold, fontSize: isMobile ? '0.78rem' : '0.85rem', fontFamily: FONTS.body, fontWeight: 600 }}>
        {label}
      </span>
    </Tag>
  );
}

const CTX_LABELS = {
  'delil':           'Delil',
  'kissa':           'Kıssa',
  'haram-helal':     'Haram-Helal',
  'cennet-cehennem': 'Cennet-Cehennem',
  'sure-adi':        'Sûre Adı',
  'mecaz':           'Mecaz',
  'hapax':           'Hapax',
  'cennet':          'Cennet',
  'cehennem':        'Cehennem',
  'dunya':           'Dünya',
  'yemin':           'Yemin',
};

// Classical Islamic terminology — shown as tooltip/secondary label on context badges
const CTX_CLASSICAL_TR = {
  'delil':       "İ'tibâr",
  'kissa':       'Kasas',
  'haram-helal': 'Ahkâm',
  'mecaz':       'Temsîl',
  'sure-adi':    'Tesmiye',
  'hapax':       'Garîb',
};
const CTX_CLASSICAL_EN = {
  'delil':       "I'tibār (lesson-drawing)",
  'kissa':       'Qaṣaṣ (narrative)',
  'haram-helal': 'Aḥkām (rulings)',
  'mecaz':       'Tamthīl (analogy)',
  'sure-adi':    'Tasmiya (titling)',
  'hapax':       'Gharīb (rare word)',
};

// ── Context Badge ─────────────────────────────────────────────────────────────
function ContextBadge({ ctx, colorMap, language }) {
  const [tip, setTip] = useState(false);
  const color = colorMap[ctx] ?? COLORS.silver;
  const isHapax = ctx === 'hapax';
  const classical = (language === 'tr' ? CTX_CLASSICAL_TR : CTX_CLASSICAL_EN)[ctx];

  const tipText = isHapax
    ? (language === 'tr'
        ? "Hapax legomenon — Kur'an'da yalnızca 1 kez geçen kelime"
        : "Hapax legomenon — a word that appears only once in the Quran")
    : classical
      ? (language === 'tr'
          ? `Klasik tefsir terimi: ${classical}`
          : `Classical exegesis term: ${classical}`)
      : null;

  const showTooltipTrigger = isHapax || !!classical;

  return (
    <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
      <span style={{
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: '99px',
        fontSize: '0.72rem',
        fontWeight: 600,
        fontFamily: FONTS.body,
        background: color + '22',
        color,
        border: `1px solid ${color}55`,
      }}>
        {CTX_LABELS[ctx] ?? ctx}
      </span>
      {showTooltipTrigger && (
        <span
          onMouseEnter={() => setTip(true)}
          onMouseLeave={() => setTip(false)}
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '14px', height: '14px', borderRadius: RADIUS.full,
            background: color + '30', border: `1px solid ${color}60`,
            color, fontSize: '0.6rem', fontWeight: 700, fontFamily: FONTS.body,
            cursor: 'default', flexShrink: 0,
          }}
        >
          {isHapax ? '?' : 'ℹ'}
        </span>
      )}
      {showTooltipTrigger && tip && tipText && (
        <span style={{
          position: 'absolute', bottom: '22px', left: 0,
          background: 'rgba(8,10,26,0.97)',
          border: `1px solid ${color}40`,
          borderRadius: '8px',
          padding: '7px 10px',
          color: COLORS.silver,
          fontSize: '0.72rem',
          fontFamily: FONTS.body,
          lineHeight: 1.5,
          whiteSpace: 'nowrap',
          zIndex: 50,
          pointerEvents: 'none',
          boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
        }}>
          {tipText}
        </span>
      )}
    </span>
  );
}

// ── Filter Pills ──────────────────────────────────────────────────────────────
function FilterPills({ filters, labels, counts, active, onChange }) {
  return (
    <div style={{
      display: 'flex',
      gap: '6px',
      overflowX: 'auto',
      scrollbarWidth: 'none',
      paddingBottom: '2px',
      flexShrink: 0,
    }}>
      {filters.map(f => {
        const isActive = active === f;
        const count = counts ? counts[f] : undefined;
        const isEmpty = count === 0;
        return (
          <button
            key={f}
            onClick={() => !isEmpty && onChange(f)}
            disabled={isEmpty}
            style={{
              flexShrink: 0,
              padding: '5px 14px',
              borderRadius: '99px',
              border: isActive ? `1px solid ${COLORS.gold}` : `1px solid ${COLORS.glassBorder}`,
              background: isActive ? COLORS.goldAlpha15 : 'transparent',
              color: isEmpty ? COLORS.slate500 : isActive ? COLORS.gold : COLORS.silver,
              fontSize: '0.8rem',
              fontFamily: FONTS.body,
              cursor: isEmpty ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s',
              fontWeight: isActive ? 600 : 400,
              opacity: isEmpty ? 0.45 : 1,
            }}
          >
            {labels[f] ?? f}
            {count !== undefined && (
              <span style={{ marginLeft: '6px', fontSize: '0.7rem', opacity: 0.7 }}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ── Search Input ──────────────────────────────────────────────────────────────
function SearchInput({ value, onChange, placeholder }) {
  return (
    <div style={{
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
    }}>
      <svg
        aria-hidden="true"
        width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        style={{ position: 'absolute', left: '12px', color: COLORS.silver, pointerEvents: 'none' }}
      >
        <circle cx="11" cy="11" r="8"/>
        <path d="M21 21l-4.3-4.3"/>
      </svg>
      <input
        type="search"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '8px 12px 8px 34px',
          borderRadius: '99px',
          border: `1px solid ${COLORS.glassBorder}`,
          background: 'rgba(255,255,255,0.04)',
          color: COLORS.offWhite,
          fontSize: '0.85rem',
          fontFamily: FONTS.body,
          outline: 'none',
        }}
        onFocus={e => { e.currentTarget.style.borderColor = COLORS.gold; }}
        onBlur={e => { e.currentTarget.style.borderColor = COLORS.glassBorder; }}
      />
    </div>
  );
}

// Normalize Turkish characters for search comparison
function normalizeSearch(str) {
  return (str || '').toString().toLowerCase()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/â/g, 'a').replace(/î/g, 'i').replace(/û/g, 'u')
    .trim();
}

// ── Featured Spotlight Card ───────────────────────────────────────────────────
function FeaturedCard({ item, language }) {
  return (
    <div style={{
      ...GLASS_CARD,
      border: `1px solid ${COLORS.gold}`,
      background: 'linear-gradient(135deg, rgba(212,165,116,0.10), rgba(212,165,116,0.03))',
      padding: '20px 22px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Top accent strip */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
        background: `linear-gradient(90deg, transparent, ${COLORS.gold}, transparent)`,
      }} />

      {/* "Özel Kart" badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <span style={{
          color: COLORS.gold,
          fontSize: '0.65rem',
          fontFamily: FONTS.body,
          fontWeight: 800,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          padding: '3px 10px',
          background: COLORS.goldAlpha15,
          border: `1px solid ${COLORS.gold}55`,
          borderRadius: '99px',
        }}>
          {language === 'tr' ? '★ Özel Kart' : '★ Featured'}
        </span>
        <p style={{
          margin: 0,
          color: COLORS.silver,
          fontSize: '0.78rem',
          fontFamily: FONTS.body,
        }}>
          {item.featuredVerseRef}
        </p>
      </div>

      {/* Title */}
      <h3 style={{
        margin: 0,
        color: COLORS.offWhite,
        fontFamily: FONTS.display,
        fontSize: '1.15rem',
        fontWeight: 700,
        lineHeight: 1.3,
      }}>
        {language === 'tr' ? item.featuredTitleTr : item.featuredTitleEn}
      </h3>

      {/* Arabic verse */}
      <div dir="rtl" lang="ar" style={{
        fontFamily: FONTS.quran,
        color: COLORS.gold,
        fontSize: '1.4rem',
        lineHeight: 1.85,
        textAlign: 'right',
        background: 'rgba(0,0,0,0.20)',
        borderRadius: '8px',
        padding: '12px 16px',
        borderRight: `3px solid ${COLORS.gold}`,
        wordBreak: 'keep-all',
      }}>
        {item.featuredArabic}
      </div>

      {/* Translation */}
      <p style={{
        margin: 0,
        color: COLORS.offWhite,
        fontFamily: FONTS.body,
        fontSize: '0.88rem',
        fontStyle: 'italic',
        lineHeight: 1.65,
      }}>
        {language === 'tr' ? item.featuredVerseTr : item.featuredVerseEn}
      </p>

      {/* Insight (markdown-lite: **bold** rendered) */}
      <p style={{
        margin: 0,
        color: COLORS.silver,
        fontFamily: FONTS.body,
        fontSize: '0.86rem',
        lineHeight: 1.75,
      }}>
        {(language === 'tr' ? item.featuredInsightTr : item.featuredInsightEn).split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
          /^\*\*[^*]+\*\*$/.test(part)
            ? <strong key={i} style={{ color: COLORS.gold, fontWeight: 700 }}>{part.replace(/\*\*/g, '')}</strong>
            : <span key={i}>{part}</span>
        )}
      </p>
    </div>
  );
}

// ── Animal Card ───────────────────────────────────────────────────────────────
function AnimalCard({ item, language }) {
  const isHapax = item.isHapax || false;
  return (
    <div style={{
      ...GLASS_CARD,
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
        <p style={{
          fontFamily: FONTS.quran,
          color: COLORS.gold,
          fontSize: '1.4rem',
          direction: 'rtl',
          margin: 0,
          lineHeight: 1.4,
        }}>
          {item.arabic}
        </p>
        <span style={{
          flexShrink: 0,
          padding: '2px 10px',
          borderRadius: '99px',
          background: COLORS.glassBg,
          border: `1px solid ${COLORS.glassBorder}`,
          color: COLORS.silver,
          fontSize: '0.72rem',
          fontFamily: FONTS.body,
        }}>
          {item.frequency}
        </span>
      </div>
      <p style={{ margin: 0, color: COLORS.offWhite, fontFamily: FONTS.body, fontWeight: 600, fontSize: '0.95rem' }}>
        {item.nameTr}
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
        {item.contexts.map(ctx => (
          <ContextBadge key={ctx} ctx={ctx} colorMap={ANIMAL_CONTEXT_COLORS} language={language} />
        ))}
        {isHapax && <ContextBadge ctx="hapax" colorMap={ANIMAL_CONTEXT_COLORS} language={language} />}
      </div>
      {item.sureRef && (
        <p style={{ margin: 0, color: COLORS.silver, fontSize: '0.78rem', fontFamily: FONTS.body }}>
          {item.sureRef}
        </p>
      )}
      {(item.noteTr || item.noteEn) && (
        <p style={{ margin: 0, color: COLORS.silver, fontSize: '0.8rem', fontFamily: FONTS.body, fontStyle: 'italic', lineHeight: 1.5 }}>
          {language === 'tr' ? item.noteTr : (item.noteEn ?? item.noteTr)}
        </p>
      )}
    </div>
  );
}

// ── Plant Card ────────────────────────────────────────────────────────────────
function PlantCard({ item, language }) {
  const isHapax = item.isHapax || false;
  return (
    <div style={{
      ...GLASS_CARD,
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
        <p style={{
          fontFamily: FONTS.quran,
          color: COLORS.gold,
          fontSize: '1.4rem',
          direction: 'rtl',
          margin: 0,
          lineHeight: 1.4,
        }}>
          {item.arabic}
        </p>
        <span style={{
          flexShrink: 0,
          padding: '2px 10px',
          borderRadius: '99px',
          background: COLORS.glassBg,
          border: `1px solid ${COLORS.glassBorder}`,
          color: COLORS.silver,
          fontSize: '0.72rem',
          fontFamily: FONTS.body,
        }}>
          {item.frequency}
        </span>
      </div>
      <p style={{ margin: 0, color: COLORS.offWhite, fontFamily: FONTS.body, fontWeight: 600, fontSize: '0.95rem' }}>
        {item.nameTr}
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
        {item.contexts.map(ctx => (
          <ContextBadge key={ctx} ctx={ctx} colorMap={PLANT_CONTEXT_COLORS} language={language} />
        ))}
        {isHapax && <ContextBadge ctx="hapax" colorMap={PLANT_CONTEXT_COLORS} language={language} />}
      </div>
      {item.sureRef && (
        <p style={{ margin: 0, color: COLORS.silver, fontSize: '0.78rem', fontFamily: FONTS.body }}>
          {item.sureRef}
        </p>
      )}
      {(item.noteTr || item.noteEn) && (
        <p style={{ margin: 0, color: COLORS.silver, fontSize: '0.8rem', fontFamily: FONTS.body, fontStyle: 'italic', lineHeight: 1.5 }}>
          {language === 'tr' ? item.noteTr : (item.noteEn ?? item.noteTr)}
        </p>
      )}
    </div>
  );
}

// Per-filter count helper — counts items per filter category (incl. 'Tümü')
function buildFilterCounts(items, filters) {
  const counts = {};
  filters.forEach(f => {
    if (f === 'Tümü') {
      counts[f] = items.length;
    } else if (f === 'hapax') {
      counts[f] = items.filter(it => it.isHapax).length;
    } else {
      counts[f] = items.filter(it => (it.contexts || []).includes(f)).length;
    }
  });
  return counts;
}

// ── Tab 0: Hayvanlar ──────────────────────────────────────────────────────────
function TabHayvanlar({ animals, isMobile, language }) {
  const [filter, setFilter] = useState('Tümü');
  const [query, setQuery]   = useState('');

  const featured = animals.filter(a => a.featured);

  const counts = buildFilterCounts(animals, ANIMAL_FILTERS);

  const byFilter = filter === 'Tümü'
    ? animals
    : animals.filter(a => {
        if (filter === 'hapax') return a.isHapax;
        return a.contexts.includes(filter);
      });

  const q = normalizeSearch(query);
  const filtered = q
    ? byFilter.filter(a => {
        const haystack = [a.nameTr, a.nameEn, a.arabic, a.sureRef, a.noteTr, a.noteEn].map(normalizeSearch).join(' ');
        return haystack.includes(q);
      })
    : byFilter;

  const labels = language === 'tr' ? ANIMAL_FILTER_LABELS_TR : ANIMAL_FILTER_LABELS_EN;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Featured spotlights — only when no filter/search */}
      {filter === 'Tümü' && !query && featured.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
          gap: '12px',
          marginBottom: '4px',
        }}>
          {featured.map(a => <FeaturedCard key={`f-${a.id}`} item={a} language={language} />)}
        </div>
      )}

      <SearchInput
        value={query}
        onChange={setQuery}
        placeholder={language === 'tr' ? 'Hayvan ara (Türkçe veya Arapça)...' : 'Search animals (Turkish or Arabic)...'}
      />

      <FilterPills filters={ANIMAL_FILTERS} labels={labels} counts={counts} active={filter} onChange={setFilter} />

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
        gap: '12px',
      }}>
        {filtered.map(a => <AnimalCard key={a.id} item={a} language={language} />)}
      </div>

      {filtered.length === 0 && (
        <p style={{ color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.9rem', textAlign: 'center', padding: '40px 0' }}>
          {query
            ? (language === 'tr' ? `"${query}" için sonuç bulunamadı.` : `No results for "${query}".`)
            : (language === 'tr' ? 'Bu kategoride kayıt bulunamadı.' : 'No entries found in this category.')}
        </p>
      )}
    </div>
  );
}

// ── Tab 1: Bitkiler ───────────────────────────────────────────────────────────
function TabBitkiler({ plants, isMobile, language }) {
  const [filter, setFilter] = useState('Tümü');
  const [query, setQuery]   = useState('');

  const counts = buildFilterCounts(plants, PLANT_FILTERS);

  const byFilter = filter === 'Tümü'
    ? plants
    : plants.filter(p => {
        if (filter === 'hapax') return p.isHapax;
        return p.contexts.includes(filter);
      });

  const q = normalizeSearch(query);
  const filtered = q
    ? byFilter.filter(p => {
        const haystack = [p.nameTr, p.nameEn, p.arabic, p.sureRef, p.noteTr, p.noteEn].map(normalizeSearch).join(' ');
        return haystack.includes(q);
      })
    : byFilter;

  const labels = language === 'tr' ? PLANT_FILTER_LABELS_TR : PLANT_FILTER_LABELS_EN;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <SearchInput
        value={query}
        onChange={setQuery}
        placeholder={language === 'tr' ? 'Bitki ara (Türkçe veya Arapça)...' : 'Search plants (Turkish or Arabic)...'}
      />

      <FilterPills filters={PLANT_FILTERS} labels={labels} counts={counts} active={filter} onChange={setFilter} />

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
        gap: '12px',
      }}>
        {filtered.map(p => <PlantCard key={p.id} item={p} language={language} />)}
      </div>

      {filtered.length === 0 && (
        <p style={{ color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.9rem', textAlign: 'center', padding: '40px 0' }}>
          {query
            ? (language === 'tr' ? `"${query}" için sonuç bulunamadı.` : `No results for "${query}".`)
            : (language === 'tr' ? 'Bu kategoride kayıt bulunamadı.' : 'No entries found in this category.')}
        </p>
      )}
    </div>
  );
}

// ── Tab 2: Sûre İsimleri ──────────────────────────────────────────────────────
function TabSureIsimleri({ sureNames, isMobile, language }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
      gap: '16px',
    }}>
      {sureNames.map(s => (
        <div key={s.id} style={{
          ...GLASS_CARD,
          border: `1px solid ${(s.accent ?? COLORS.gold) + '55'}`,
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <p style={{
              fontFamily: FONTS.quran,
              color: s.accent ?? COLORS.gold,
              fontSize: '1.8rem',
              direction: 'rtl',
              margin: 0,
              lineHeight: 1.3,
            }}>
              {s.arabic}
            </p>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <p style={{ margin: 0, color: COLORS.silver, fontSize: '0.75rem', fontFamily: FONTS.body }}>
                {language === 'tr' ? `Sûre ${s.sureNo}` : `Surah ${s.sureNo}`}
              </p>
              <p style={{ margin: 0, color: COLORS.silver, fontSize: '0.75rem', fontFamily: FONTS.body }}>
                {language === 'tr' ? `${s.ayahCount} ayet` : `${s.ayahCount} verses`}
              </p>
            </div>
          </div>
          <div>
            <p style={{ margin: '0 0 2px', color: COLORS.offWhite, fontFamily: FONTS.body, fontWeight: 700, fontSize: '1rem' }}>
              {language === 'tr' ? s.sureTr : (s.sureEn ?? s.sureTr)}
            </p>
            <p style={{ margin: 0, color: s.accent ?? COLORS.gold, fontFamily: FONTS.body, fontSize: '0.8rem', fontWeight: 600 }}>
              {s.nameTr}
            </p>
          </div>
          <p style={{ margin: 0, color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.85rem', lineHeight: 1.6 }}>
            {language === 'tr' ? s.storyTr : (s.storyEn ?? s.storyTr)}
          </p>
          <p style={{ margin: 0, color: COLORS.slate500, fontFamily: FONTS.body, fontSize: '0.75rem' }}>
            {s.keyRef}
          </p>
        </div>
      ))}
    </div>
  );
}

// ── Tab 3: Bağlam Analizi ─────────────────────────────────────────────────────
function TabBaglamAnalizi({ contexts, language }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {contexts.map(ctx => (
        <div key={ctx.id} style={{
          ...GLASS_CARD,
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '10px',
              height: '10px',
              borderRadius: RADIUS.full,
              background: ctx.color ?? COLORS.gold,
              flexShrink: 0,
            }} />
            <p style={{ margin: 0, color: ctx.color ?? COLORS.gold, fontFamily: FONTS.body, fontWeight: 700, fontSize: '1rem' }}>
              {language === 'tr' ? ctx.titleTr : (ctx.titleEn ?? ctx.titleTr)}
            </p>
          </div>
          {ctx.arabic && (
            <p style={{
              fontFamily: FONTS.quran,
              color: COLORS.offWhite,
              fontSize: '1.2rem',
              direction: 'rtl',
              margin: 0,
              lineHeight: 1.6,
              padding: '10px 14px',
              background: COLORS.glassBg,
              borderRadius: '8px',
              borderRight: `3px solid ${ctx.color ?? COLORS.gold}`,
            }}>
              {ctx.arabic}
            </p>
          )}
          <p style={{ margin: 0, color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.85rem', lineHeight: 1.6 }}>
            {language === 'tr' ? ctx.noteTr : (ctx.noteEn ?? ctx.noteTr)}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {((language === 'tr' ? ctx.animalsTr : (ctx.animalsEn ?? ctx.animalsTr)) ?? '').split(',').map(a => a.trim()).filter(Boolean).map(a => (
              <span key={a} style={{
                padding: '3px 10px',
                borderRadius: '99px',
                background: (ctx.color ?? COLORS.gold) + '22',
                border: `1px solid ${(ctx.color ?? COLORS.gold) + '55'}`,
                color: ctx.color ?? COLORS.gold,
                fontSize: '0.75rem',
                fontFamily: FONTS.body,
              }}>
                {a}
              </span>
            ))}
          </div>
          <p style={{ margin: 0, color: COLORS.slate500, fontFamily: FONTS.body, fontSize: '0.78rem', fontStyle: 'italic' }}>
            {language === 'tr' ? ctx.keyVerseTr : (ctx.keyVerseEn ?? ctx.keyVerseTr)}
          </p>
        </div>
      ))}
    </div>
  );
}

// ── Tab 4: Tefsir Notları ─────────────────────────────────────────────────────
function TabTefsirNotlari({ tefsirNotes, sources, language }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {tefsirNotes.map(note => (
        <div key={note.id} style={{
          ...GLASS_CARD,
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}>
          <p style={{ margin: 0, color: COLORS.gold, fontFamily: FONTS.body, fontWeight: 700, fontSize: '0.95rem' }}>
            {language === 'tr' ? note.titleTr : (note.titleEn ?? note.titleTr)}
          </p>
          <p style={{ margin: 0, color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.88rem', lineHeight: 1.7 }}>
            {language === 'tr' ? note.bodyTr : (note.bodyEn ?? note.bodyTr)}
          </p>
        </div>
      ))}

      {/* Sources */}
      <div style={{
        ...GLASS_CARD,
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}>
        <p style={{ margin: 0, color: COLORS.gold, fontFamily: FONTS.body, fontWeight: 700, fontSize: '0.95rem' }}>
          {language === 'tr' ? 'Kaynaklar' : 'Sources'}
        </p>
        <ul style={{ margin: 0, padding: '0 0 0 18px' }}>
          {sources.map((s, i) => (
            <li key={i} style={{ color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.85rem', lineHeight: 1.8 }}>
              {s}
            </li>
          ))}
        </ul>
      </div>

      <p style={{
        color: COLORS.slate500,
        fontFamily: FONTS.body,
        fontSize: '0.78rem',
        fontStyle: 'italic',
        lineHeight: 1.6,
        textAlign: 'center',
        padding: '0 16px',
      }}>
        {language === 'tr'
          ? 'Bu çalışma, tefsir ilminin genel kabul görmüş kaynaklarına dayanmaktadır. Hayvan ve bitki isimleri klasik Arapça terimlerin Türkçe karşılıklarıdır.'
          : 'This work is based on the generally accepted sources of Quranic exegesis. Animal and plant names are Turkish equivalents of classical Arabic terms.'}
      </p>
    </div>
  );
}

// ── Hero Section ──────────────────────────────────────────────────────────────
function HeroSection({ isMobile, language, counts, activeTab, onTabChange }) {
  // Tab indices: 0 Hayvanlar · 1 Bitkiler · 2 Sûre İsimleri · 3 Bağlam · null (no jump)
  const stats = [
    {
      tabIdx: 0,
      labelTr: `${counts.animals} Hayvan Türü`,
      labelEn: `${counts.animals} Animal Species`,
    },
    {
      tabIdx: 1,
      labelTr: `${counts.plants} Bitki Türü`,
      labelEn: `${counts.plants} Plant Species`,
    },
    {
      tabIdx: 2,
      labelTr: `${counts.sureNames} Sûre Adı`,
      labelEn: `${counts.sureNames} Surah Names`,
    },
    {
      tabIdx: 3,
      labelTr: `${counts.contexts} Bağlam Fonksiyonu`,
      labelEn: `${counts.contexts} Context Functions`,
    },
    {
      tabIdx: 0,
      labelTr: `${counts.featured} Özel Kart`,
      labelEn: `${counts.featured} Featured Cards`,
    },
  ];

  return (
    <div style={{
      padding: isMobile ? '24px 16px 20px' : '40px 32px 28px',
      borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
      background: 'linear-gradient(180deg, rgba(20,30,48,0.6) 0%, transparent 100%)',
    }}>
      {/* Arabic verse */}
      <p style={{
        fontFamily: FONTS.quran,
        color: COLORS.gold,
        fontSize: isMobile ? '1.3rem' : '1.6rem',
        direction: 'rtl',
        textAlign: 'right',
        margin: '0 0 6px',
        lineHeight: 1.7,
      }}>
        أَفَلَا يَنظُرُونَ إِلَى الْإِبِلِ كَيْفَ خُلِقَتْ
      </p>
      <p style={{
        color: COLORS.silver,
        fontFamily: FONTS.body,
        fontSize: '0.85rem',
        fontStyle: 'italic',
        margin: '0 0 24px',
        textAlign: 'right',
      }}>
        {language === 'tr'
          ? '"Onlar deveye bakmıyorlar mı, nasıl yaratılmıştır?" — Ğaşiye 88:17'
          : '"Do they not look at the camel — how it was created?" — Al-Ghashiyah 88:17'}
      </p>

      {/* Title */}
      <h2 style={{
        fontFamily: FONTS.display,
        color: COLORS.gold,
        fontSize: isMobile ? '1.5rem' : '2rem',
        fontWeight: 700,
        margin: '0 0 10px',
        lineHeight: 1.2,
      }}>
        {language === 'tr' ? "Kevni Ayetler — Kur'an'ın Tabiat Atlası" : "Cosmic Signs — The Quran's Nature Atlas"}
      </h2>

      {/* Âyât-ı Kevniyye framing */}
      <div style={{
        background: COLORS.goldAlpha10 ?? 'rgba(212,165,116,0.06)',
        border: `1px solid ${COLORS.goldAlpha25}`,
        borderRadius: '10px',
        padding: isMobile ? '12px 14px' : '14px 18px',
        margin: '0 0 18px',
        maxWidth: '720px',
      }}>
        <p style={{
          color: COLORS.gold,
          fontFamily: FONTS.body,
          fontSize: '0.7rem',
          fontWeight: 700,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          margin: '0 0 6px',
        }}>
          {language === 'tr' ? 'Klasik Çerçeve' : 'Classical Framing'}
        </p>
        <p style={{
          color: COLORS.silver,
          fontFamily: FONTS.body,
          fontSize: isMobile ? '0.85rem' : '0.9rem',
          lineHeight: 1.7,
          margin: 0,
        }}>
          {language === 'tr' ? (
            <>
              Klasik tefsir Kur'an'ın iki tür ayetinden bahseder: <strong style={{ color: COLORS.gold }}>âyât-ı tilâvet</strong> (okunan ayetler — Mushaf'taki metin) ve <strong style={{ color: COLORS.gold }}>âyât-ı kevniyye</strong> (yaratılış ayetleri — doğanın kendisi). Kur'an, doğayı <em>kitâb-ı kâinât</em> (yaratılışın kitabı) olarak sunar; her canlı, okunması gereken bir delildir.
            </>
          ) : (
            <>
              Classical exegesis distinguishes two kinds of divine signs: <strong style={{ color: COLORS.gold }}>āyāt al-tilāwa</strong> (recited verses — the Mushaf text) and <strong style={{ color: COLORS.gold }}>āyāt al-kawniyya</strong> (cosmic verses — creation itself). The Quran presents nature as <em>kitāb al-kāʾināt</em> (the Book of Creation); every creature is a sign meant to be read.
            </>
          )}
        </p>
      </div>

      <p style={{
        color: COLORS.silver,
        fontFamily: FONTS.body,
        fontSize: isMobile ? '0.88rem' : '0.95rem',
        lineHeight: 1.7,
        margin: '0 0 24px',
        maxWidth: '680px',
      }}>
        {language === 'tr'
          ? "Bu atlas Kur'an'da geçen hayvan, bitki, sûre adı ve bağlamları doğrudan veriden okur — abartı yok, eklenti yok. Klasik tefsir geleneğinin (Demîrî, İbn el-Baytâr, Suyûtî) interaktif bir referansıdır."
          : "This atlas reads animals, plants, surah names, and contexts directly from the data — no exaggeration, no padding. An interactive reference rooted in classical exegesis (al-Damīrī, Ibn al-Bayṭār, al-Suyūṭī)."}
      </p>

      {/* Stat cards — clickable */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(5, 1fr)',
        gap: '8px',
      }}>
        {stats.map((s, i) => (
          <StatCard
            key={i}
            label={language === 'tr' ? s.labelTr : s.labelEn}
            isMobile={isMobile}
            onClick={s.tabIdx != null ? () => onTabChange(s.tabIdx) : undefined}
            active={s.tabIdx != null && activeTab === s.tabIdx}
          />
        ))}
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function DogaAtlasi({ onClose }) {
  const { language } = useLanguage();
  const trapRef = useFocusTrap(true);
  const [data, setData]       = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [isMobile, setIsMobile]   = useState(false)  // SSR-safe; useEffect h() post-mount hydrate eder (audit fix);
  const bodyRef = useRef(null);

  // Escape key handler
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  // Body scroll lock kaldırıldı — WowFacts/IlkSon pattern: normal-flow document scroll.

  // Resize listener
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < BREAKPOINT_MOBILE);
    h(); // post-mount hydrate
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  // Fetch data
  useEffect(() => {
    fetch('/doga-atlasi.json')
      .then(r => r.json())
      .then(d => setData(d))
      .catch(() => {});
  }, []);

  // Scroll body to top on tab change
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
  }, [activeTab]);

  const DOGA_TOOL_HEADER = (
    <ToolHeader
      icon={<span style={{ fontSize: '1.05rem', color: COLORS.gold, lineHeight: 1 }}>🌿</span>}
      titleTr="Doğa Atlası"
      titleEn="Atlas of Nature"
      subtitleTr="~40 doğa unsuru · sembolik anlam"
      subtitleEn="~40 nature elements · symbolic meaning"
      language={language}
    />
  );

  // Loading state
  if (!data) {
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
        {DOGA_TOOL_HEADER}
        <div style={{ flex: 1, display: 'flex' }}>
          <LoadingOverlay />
        </div>
      </div>
    );
  }

  const { animals, plants, sureNames, contexts, tefsirNotes, sources } = data;

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
      {DOGA_TOOL_HEADER}

      {/* ── BODY ───────────────────────────────────────────────────── */}
      <div
        ref={bodyRef}
        style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}
      >
        {/* Hero */}
        <HeroSection
          isMobile={isMobile}
          language={language}
          counts={{
            animals: animals.length,
            plants: plants.length,
            sureNames: sureNames.length,
            contexts: contexts.length,
            featured: animals.filter(a => a.featured).length,
          }}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Tab bar — sticky */}
        <div style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          display: 'flex',
          gap: '2px',
          padding: isMobile ? '0 8px' : '0 16px',
          borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
          background: 'rgba(10,10,26,0.97)',
          backdropFilter: 'blur(20px)',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          flexShrink: 0,
        }}>
          {TABS.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              style={{
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: isMobile ? '12px 14px' : '13px 22px',
                border: 'none',
                background: activeTab === i ? `${COLORS.goldAlpha15}` : 'transparent',
                borderBottom: activeTab === i ? `2px solid ${COLORS.gold}` : '2px solid transparent',
                borderRadius: '0',
                color: activeTab === i ? COLORS.gold : COLORS.silver,
                fontSize: isMobile ? '0.85rem' : '0.9rem',
                fontFamily: FONTS.body,
                fontWeight: activeTab === i ? 600 : 400,
                cursor: 'pointer',
                transition: 'all 0.15s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => { if (activeTab !== i) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = COLORS.offWhite; } }}
              onMouseLeave={e => { if (activeTab !== i) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = COLORS.silver; } }}
            >
              <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{tab.icon}</span>
              <span>
                {language === 'tr'
                  ? (isMobile ? tab.shortTr : tab.labelTr)
                  : (isMobile ? tab.shortEn : tab.labelEn)}
              </span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ padding: isMobile ? '16px' : '24px 32px', flex: 1 }}>
          {activeTab === 0 && <TabHayvanlar animals={animals} isMobile={isMobile} language={language} />}
          {activeTab === 1 && <TabBitkiler plants={plants} isMobile={isMobile} language={language} />}
          {activeTab === 2 && <TabSureIsimleri sureNames={sureNames} isMobile={isMobile} language={language} />}
          {activeTab === 3 && <TabBaglamAnalizi contexts={contexts} language={language} />}
          {activeTab === 4 && <TabTefsirNotlari tefsirNotes={tefsirNotes} sources={sources} language={language} />}
        </div>
      </div>
    </div>
  );
}

// ── Close Button ──────────────────────────────────────────────────────────────
function CloseButton({ onClose }) {
  return (
    <button
      onClick={onClose}
      style={{ ...CLOSE_BTN }}
      onMouseEnter={e => {
        e.currentTarget.style.background = COLORS.glassBorder;
        e.currentTarget.style.color = COLORS.offWhite;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = CLOSE_BTN.background;
        e.currentTarget.style.color = COLORS.silver;
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M18 6L6 18M6 6l12 12" />
      </svg>
    </button>
  );
}
