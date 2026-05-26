'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS, OVERLAY_BASE, OVERLAY_HEADER, OVERLAY_TITLE, CLOSE_BTN, TRANSITION } from '../tokens';

const VERIFIED_COUNT = 81;
const HADITH_COUNT = 19;
const MAX_BAR_COUNT = 157; // El-Alîm

const top10 = [
  { name: 'El-Alîm',   arabic: 'الْعَلِيم',    count: 157 },
  { name: 'Er-Rahîm',  arabic: 'الرَّحِيم',    count: 114, disputed: true },
  { name: 'El-Hakîm',  arabic: 'الْحَكِيم',    count: 97  },
  { name: 'El-Azîz',   arabic: 'الْعَزِيز',    count: 92  },
  { name: 'El-Gafûr',  arabic: 'الْغَفُور',    count: 91  },
  { name: 'Er-Rahmân', arabic: 'الرَّحْمَٰن',  count: 57  },
  { name: 'Es-Semî',   arabic: 'السَّمِيع',    count: 45  },
  { name: 'El-Habîr',  arabic: 'الْخَبِير',    count: 45  },
  { name: 'El-Kâdir',  arabic: 'الْقَادِر',    count: 45  },
  { name: 'El-Basîr',  arabic: 'الْبَصِير',    count: 42  },
];

const pairs = [
  { arabic: 'الْغَفُورُ الرَّحِيم',  tr: 'El-Gafûr Er-Rahîm',    meaning: 'Bağışlayan, Merhametli',              count: 72 },
  { arabic: 'الْعَزِيزُ الْحَكِيم',  tr: 'El-Azîz El-Hakîm',     meaning: 'Güçlü ve Üstün, Hikmet Sahibi',       count: 38 },
  { arabic: 'السَّمِيعُ الْبَصِير',  tr: 'Es-Semî El-Basîr',     meaning: 'İşiten, Gören',                        count: 40 },
  { arabic: 'الْعَلِيمُ الْحَكِيم',  tr: 'El-Alîm El-Hakîm',     meaning: 'Bilen, Hikmet Sahibi',                 count: 35 },
  { arabic: 'التَّوَّابُ الرَّحِيم', tr: 'Et-Tevvâb Er-Rahîm',   meaning: 'Tövbeleri Kabul Eden, Merhametli',     count: 6  },
];

const FILTER_OPTIONS = [
  { key: 'all',        labelTr: 'Tümü',          labelEn: 'All'           },
  { key: 'verified',   labelTr: "Kur'an'da var",  labelEn: 'In Quran'     },
  { key: 'disputed',   labelTr: 'Tartışmalı',     labelEn: 'Disputed'     },
  { key: 'hadith_only',labelTr: "Kur'an'da yok",  labelEn: 'Hadith only'  },
];

const SORT_OPTIONS = [
  { value: 'no',       labelTr: 'Sıra',       labelEn: 'Order'       },
  { value: 'count_desc', labelTr: 'Frekans ↓', labelEn: 'Freq ↓'    },
  { value: 'count_asc',  labelTr: 'Frekans ↑', labelEn: 'Freq ↑'    },
];

const PAGE_SIZE = 100;

// ── Styles ────────────────────────────────────────────────────────────────────

const sectionLabelStyle = {
  color: `${COLORS.gold}99`,
  fontSize: '0.7rem',
  fontFamily: FONTS.body,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  marginBottom: '14px',
};

const sectionTitleStyle = {
  color: COLORS.offWhite,
  fontFamily: FONTS.display,
  fontSize: '1.15rem',
  fontWeight: 700,
  margin: '0 0 18px',
};

const statCardStyle = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '10px',
  padding: '16px 20px',
  minWidth: '140px',
  flex: '1 1 140px',
};

const controlInputStyle = {
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '8px',
  color: COLORS.offWhite,
  padding: '8px 12px',
  fontSize: '0.82rem',
  fontFamily: FONTS.body,
  outline: 'none',
};

const badgeBase = {
  display: 'inline-flex',
  alignItems: 'center',
  borderRadius: '20px',
  padding: '2px 8px',
  fontSize: '0.7rem',
  fontFamily: FONTS.body,
  whiteSpace: 'nowrap',
};

const verifiedBadge = {
  ...badgeBase,
  background: 'rgba(76,175,125,0.15)',
  color: '#4caf7d',
  border: '1px solid rgba(76,175,125,0.3)',
};

const disputedBadge = {
  ...badgeBase,
  background: COLORS.softGoldAlpha15,
  color: COLORS.gold,
  border: `1px solid ${COLORS.softGoldAlpha30}`,
};

const hadithBadge = {
  ...badgeBase,
  background: 'rgba(148,163,184,0.1)',
  color: COLORS.silver,
  border: '1px solid rgba(148,163,184,0.2)',
};

function StatusBadge({ status }) {
  if (status === 'verified')    return <span style={verifiedBadge}>✅ Teyitli</span>;
  if (status === 'disputed')    return <span style={disputedBadge}>🔶 Çelişkili</span>;
  if (status === 'hadith_only') return <span style={hadithBadge}>➖ Hadis</span>;
  return null;
}

function FilterChip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: active ? `${COLORS.gold}22` : 'transparent',
        border: active ? `1px solid ${COLORS.gold}55` : '1px solid rgba(255,255,255,0.1)',
        color: active ? COLORS.gold : COLORS.silver,
        borderRadius: '20px',
        padding: '5px 14px',
        fontSize: '0.78rem',
        fontFamily: FONTS.body,
        cursor: 'pointer',
        transition: `all ${TRANSITION.fast}`,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </button>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function EsmaFrekans({ onClose }) {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const [names, setNames] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('no');
  const [filter, setFilter] = useState('all');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [methOpen, setMethOpen] = useState(false);
  const bodyRef = useRef(null);

  // Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
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

  // Load JSON
  useEffect(() => {
    fetch('/esma-frekans.json')
      .then((r) => r.json())
      .then((data) => setNames(data.names))
      .catch((err) => console.error('[EsmaFrekans] Failed to load data:', err));
  }, []);

  // Filtered + sorted rows
  const filtered = useMemo(() => {
    let rows = [...names];

    // Status filter
    if (filter !== 'all') {
      rows = rows.filter((n) => n.status === filter);
    }

    // Search
    const q = search.trim().toLowerCase();
    if (q) {
      rows = rows.filter(
        (n) =>
          n.arabic.includes(q) ||
          n.name.toLowerCase().includes(q) ||
          n.meaning.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sort === 'count_desc') {
      rows.sort((a, b) => b.count - a.count);
    } else if (sort === 'count_asc') {
      rows.sort((a, b) => a.count - b.count);
    } else {
      rows.sort((a, b) => a.no - b.no);
    }

    return rows;
  }, [names, filter, search, sort]);

  const visibleRows = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  // Reset visible count when filter/search changes
  /* eslint-disable react-hooks/set-state-in-effect -- resetting derived state on dep change is intentional */
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [filter, search, sort]);
  /* eslint-enable react-hooks/set-state-in-effect */

  return (
    <div style={{ ...OVERLAY_BASE, display: 'flex', flexDirection: 'column' }} role="dialog" aria-label={tr ? 'Esmaül Hüsna Frekansları' : 'Divine Names Frequencies'}>

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div style={OVERLAY_HEADER}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.1rem' }}>☪</span>
          <span style={OVERLAY_TITLE}>
            {tr ? 'Esmaül Hüsna — Kur\'an\'daki Frekanslar' : 'Divine Names — Quranic Frequencies'}
          </span>
        </div>
        <button
          style={CLOSE_BTN}
          onClick={onClose}
          aria-label={tr ? 'Kapat' : 'Close'}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = COLORS.offWhite; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = COLORS.silver; }}
        >
          ✕
        </button>
      </div>

      {/* ── Body ────────────────────────────────────────────────────────────── */}
      <div ref={bodyRef} style={{ flex: 1, overflowY: 'auto', padding: '24px 24px 40px' }}>

        {/* ── SECTION 1: Hero stat cards ──────────────────────────────────── */}
        <div style={{ marginBottom: '32px' }}>
          <div style={sectionLabelStyle}>{tr ? 'Genel Bakış' : 'Overview'}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>

            {/* Card 1 */}
            <div style={statCardStyle}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: COLORS.gold, fontFamily: FONTS.body, lineHeight: 1.1, marginBottom: '6px' }}>
                El-Alîm
              </div>
              <div style={{ fontSize: '0.72rem', color: COLORS.silver, textTransform: 'uppercase', letterSpacing: '0.06em', lineHeight: 1.4 }}>
                {tr ? 'En sık geçen isim (Allah hariç)' : 'Most frequent name (excl. Allah)'}
              </div>
              <div style={{ fontSize: '0.9rem', color: COLORS.gold, fontWeight: 700, marginTop: '6px', fontFamily: FONTS.body }}>
                157 {tr ? 'kez' : 'times'}
              </div>
            </div>

            {/* Card 2 */}
            <div style={statCardStyle}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#4caf7d', fontFamily: FONTS.body, lineHeight: 1.1, marginBottom: '6px' }}>
                ~{VERIFIED_COUNT}
                <span style={{ fontSize: '1rem', fontWeight: 400, color: COLORS.silver }}> / 99</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: COLORS.silver, textTransform: 'uppercase', letterSpacing: '0.06em', lineHeight: 1.4 }}>
                {tr ? "Kur'an'da teyitli isim" : 'Names confirmed in Quran'}
              </div>
            </div>

            {/* Card 3 */}
            <div style={statCardStyle}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: COLORS.silver, fontFamily: FONTS.body, lineHeight: 1.1, marginBottom: '6px' }}>
                ~{HADITH_COUNT}
              </div>
              <div style={{ fontSize: '0.72rem', color: COLORS.silver, textTransform: 'uppercase', letterSpacing: '0.06em', lineHeight: 1.4 }}>
                {tr ? 'Yalnızca hadiste sabit isim' : 'Names from hadith only'}
              </div>
            </div>

            {/* Card 4 */}
            <div style={statCardStyle}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: COLORS.gold, fontFamily: FONTS.body, lineHeight: 1.1, marginBottom: '6px' }}>
                2699
              </div>
              <div style={{ fontSize: '0.72rem', color: COLORS.silver, textTransform: 'uppercase', letterSpacing: '0.06em', lineHeight: 1.4 }}>
                {tr ? 'Allah lafzının Kur\'an\'daki geçiş sayısı' : '"Allah" occurrences in the Quran'}
              </div>
            </div>

          </div>
        </div>

        {/* ── SECTION 2: Methodology note ─────────────────────────────────── */}
        <div style={{ marginBottom: '32px' }}>
          <button
            onClick={() => setMethOpen((v) => !v)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '8px',
              padding: '10px 16px',
              color: COLORS.silver,
              fontSize: '0.82rem',
              fontFamily: FONTS.body,
              cursor: 'pointer',
              width: '100%',
              textAlign: 'left',
            }}
          >
            <span>ℹ️</span>
            <span style={{ flex: 1, fontWeight: 600 }}>{tr ? 'Metodoloji Notu' : 'Methodology Note'}</span>
            <span style={{ transition: 'transform 0.2s', transform: methOpen ? 'rotate(180deg)' : 'rotate(0deg)', display: 'inline-block' }}>▾</span>
          </button>
          {methOpen && (
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderTop: 'none',
              borderRadius: '0 0 8px 8px',
              padding: '12px 16px',
              color: COLORS.silver,
              fontSize: '0.84rem',
              fontFamily: FONTS.body,
              lineHeight: 1.7,
            }}>
              {tr
                ? 'Bu sayfa Quranic Arabic Corpus ve Tanzil Quran Text verilerine dayanan akademik sayımlara dayanmaktadır. Sayımlar exact word-form (yüzey formu) esasıyla yapılmıştır. Besmele sayımı, kök (lemma) vs. yüzey form farkı ve bazı isimlerin Allah\'a mı başkasına mı atfedildiği meselesi nedeniyle kaynaklarda ±5–10 fark gözlemlenebilir. 🔶 işareti çelişkili verileri gösterir. ➖ işareti bu exact isim formunun Kur\'an\'da geçmediğini; ismin hadis rivayetiyle sabit olduğunu gösterir.'
                : 'This page is based on academic counts derived from the Quranic Arabic Corpus and Tanzil Quran Text datasets. Counts are based on exact surface word-form. Due to differences in Bismillah counting, lemma vs. surface form distinctions, and attributional ambiguity, sources may differ by ±5–10. 🔶 marks disputed data. ➖ indicates the name does not appear in this exact form in the Quran; it is established through hadith.'}
            </div>
          )}
        </div>

        {/* ── SECTION 3: Interactive table ────────────────────────────────── */}
        <div style={{ marginBottom: '40px' }}>
          <div style={sectionLabelStyle}>{tr ? 'İsim Tablosu' : 'Name Table'}</div>

          {/* Controls */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '12px', alignItems: 'center' }}>
            <input
              type="text"
              className="qc-focus-ring"
              placeholder={tr ? 'İsim veya Arapça ara…' : 'Search name or Arabic…'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ ...controlInputStyle, flex: '1 1 180px', minWidth: '0' }}
            />
            <select
              value={sort}
              className="qc-focus-ring"
              onChange={(e) => setSort(e.target.value)}
              style={{ ...controlInputStyle, cursor: 'pointer' }}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value} style={{ background: COLORS.cosmicBlack }}>
                  {tr ? o.labelTr : o.labelEn}
                </option>
              ))}
            </select>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {FILTER_OPTIONS.map((f) => (
                <FilterChip key={f.key} active={filter === f.key} onClick={() => setFilter(f.key)}>
                  {tr ? f.labelTr : f.labelEn}
                </FilterChip>
              ))}
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: FONTS.body }}>
              <thead>
                <tr style={{
                  position: 'sticky',
                  top: 0,
                  background: '#06080e',
                  borderBottom: '1px solid rgba(255,255,255,0.08)',
                }}>
                  <th style={{ width: '40px', padding: '10px 12px', color: COLORS.silver, fontSize: '0.72rem', textAlign: 'left', fontWeight: 600 }}>#</th>
                  <th style={{ padding: '10px 12px', color: COLORS.silver, fontSize: '0.72rem', textAlign: 'right', fontWeight: 600 }}>
                    {tr ? 'Arapça' : 'Arabic'}
                  </th>
                  <th style={{ padding: '10px 12px', color: COLORS.silver, fontSize: '0.72rem', textAlign: 'left', fontWeight: 600 }}>
                    {tr ? 'İsim' : 'Name'}
                  </th>
                  <th className="hidden sm:table-cell" style={{ padding: '10px 12px', color: COLORS.silver, fontSize: '0.72rem', textAlign: 'left', fontWeight: 600 }}>
                    {tr ? 'Anlam' : 'Meaning'}
                  </th>
                  <th style={{ padding: '10px 12px', color: COLORS.silver, fontSize: '0.72rem', textAlign: 'left', fontWeight: 600 }}>
                    {tr ? 'Frekans' : 'Freq.'}
                  </th>
                  <th style={{ padding: '10px 12px', color: COLORS.silver, fontSize: '0.72rem', textAlign: 'left', fontWeight: 600 }}>
                    {tr ? 'Durum' : 'Status'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((row) => (
                  <tr
                    key={row.no}
                    style={{
                      opacity: row.status === 'hadith_only' ? 0.55 : 1,
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                      transition: 'background 0.12s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    {/* No */}
                    <td style={{ padding: '10px 12px', color: COLORS.slate500, fontSize: '0.78rem', verticalAlign: 'middle' }}>
                      {row.no}
                    </td>
                    {/* Arabic */}
                    <td
                      dir="rtl"
                      lang="ar"
                      style={{
                        padding: '10px 12px',
                        fontFamily: FONTS.quran,
                        fontSize: '1.2rem',
                        color: COLORS.gold,
                        textAlign: 'right',
                        verticalAlign: 'middle',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {row.arabic}
                    </td>
                    {/* Turkish name */}
                    <td style={{ padding: '10px 12px', color: COLORS.offWhite, fontSize: '0.82rem', fontWeight: 600, verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                      {row.name}
                    </td>
                    {/* Meaning */}
                    <td
                      className="hidden sm:table-cell"
                      style={{ padding: '10px 12px', color: COLORS.silver, fontSize: '0.78rem', verticalAlign: 'middle' }}
                    >
                      {row.meaning}
                    </td>
                    {/* Count */}
                    <td style={{ padding: '10px 12px', verticalAlign: 'middle' }}>
                      {row.status === 'hadith_only' ? (
                        <span style={{ color: COLORS.slate500, fontSize: '0.82rem', opacity: 0.5 }}>—</span>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{
                            width: `${Math.min(120, Math.max(12, (row.count / MAX_BAR_COUNT) * 120))}px`,
                            height: '4px',
                            background: `${COLORS.gold}80`,
                            borderRadius: '2px',
                            flexShrink: 0,
                          }} />
                          <span
                            style={{ color: COLORS.offWhite, fontSize: '0.82rem', whiteSpace: 'nowrap' }}
                            title={row.tooltipTr || undefined}
                          >
                            {row.countDisplay}
                          </span>
                        </div>
                      )}
                    </td>
                    {/* Status */}
                    <td style={{ padding: '10px 12px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                      <StatusBadge status={row.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Load more */}
          {hasMore && (
            <div style={{ textAlign: 'center', marginTop: '14px' }}>
              <button
                onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
                style={{
                  background: 'transparent',
                  border: `1px solid ${COLORS.softGoldAlpha40}`,
                  borderRadius: '8px',
                  color: COLORS.gold,
                  padding: '7px 20px',
                  fontSize: '0.82rem',
                  fontFamily: FONTS.body,
                  cursor: 'pointer',
                }}
              >
                {filtered.length - visibleCount} {tr ? 'isim daha göster' : 'more names'}
              </button>
            </div>
          )}

          {filtered.length === 0 && names.length > 0 && (
            <div style={{ textAlign: 'center', padding: '32px', color: COLORS.silver, fontSize: '0.88rem', fontFamily: FONTS.body }}>
              {tr ? 'Sonuç bulunamadı.' : 'No results found.'}
            </div>
          )}
        </div>

        {/* ── SECTION 4: Top 10 bar chart ─────────────────────────────────── */}
        <div style={{ marginBottom: '40px' }}>
          <div style={sectionLabelStyle}>{tr ? 'Frekans Grafiği' : 'Frequency Chart'}</div>
          <h3 style={sectionTitleStyle}>
            {tr ? 'En Sık Geçen 10 İsim (Allah hariç)' : 'Top 10 Most Frequent Names (excl. Allah)'}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {top10.map((item) => (
              <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* Arabic */}
                <div
                  dir="rtl"
                  lang="ar"
                  style={{
                    fontFamily: FONTS.quran,
                    fontSize: '1.1rem',
                    color: COLORS.gold,
                    width: '140px',
                    textAlign: 'right',
                    flexShrink: 0,
                  }}
                >
                  {item.arabic}
                </div>
                {/* Turkish name */}
                <div style={{ fontFamily: FONTS.body, color: COLORS.silver, width: '90px', fontSize: '0.8rem', flexShrink: 0, lineHeight: 1.3 }}>
                  {item.name}
                  {item.disputed && <span style={{ marginLeft: '4px', fontSize: '0.75rem' }}>🔶</span>}
                </div>
                {/* Bar */}
                <div
                  onClick={() => window.open('https://corpus.quran.com/search.jsp?q=' + encodeURIComponent(item.arabic), '_blank')}
                  title={tr ? 'Corpus Quran\'da ara' : 'Search on Corpus Quran'}
                  style={{
                    width: `${(item.count / MAX_BAR_COUNT) * 200}px`,
                    height: '8px',
                    background: `linear-gradient(90deg, ${COLORS.gold}80, ${COLORS.gold}40)`,
                    borderRadius: '4px',
                    cursor: 'pointer',
                    flexShrink: 0,
                    transition: 'opacity 0.15s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.75'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
                />
                {/* Count */}
                <div style={{ color: COLORS.offWhite, fontWeight: 700, fontSize: '0.9rem', fontFamily: FONTS.body, marginLeft: '8px', whiteSpace: 'nowrap' }}>
                  {item.count}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── SECTION 5: Semantic pairs ────────────────────────────────────── */}
        <div style={{ marginBottom: '40px' }}>
          <div style={sectionLabelStyle}>{tr ? 'Semantik Çiftler' : 'Semantic Pairs'}</div>
          <h3 style={sectionTitleStyle}>
            {tr ? "Kur'an'da Birlikte Geçen İsimler" : 'Names That Appear Together in the Quran'}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {pairs.map((pair) => (
              <div
                key={pair.tr}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '12px',
                  padding: '18px 20px',
                }}
              >
                {/* Arabic pair */}
                <div
                  dir="rtl"
                  lang="ar"
                  style={{
                    fontFamily: FONTS.quran,
                    fontSize: '1.4rem',
                    color: COLORS.gold,
                    textAlign: 'right',
                    marginBottom: '8px',
                    lineHeight: 1.5,
                  }}
                >
                  {pair.arabic}
                </div>
                {/* Turkish names */}
                <div style={{ fontFamily: FONTS.body, fontWeight: 700, color: COLORS.offWhite, fontSize: '0.9rem', marginBottom: '4px' }}>
                  {pair.tr}
                </div>
                {/* Meaning */}
                <div style={{ color: COLORS.silver, fontSize: '0.8rem', marginBottom: '10px', fontFamily: FONTS.body }}>
                  {pair.meaning}
                </div>
                {/* Count badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                  <span style={{
                    background: COLORS.softGoldAlpha12,
                    border: `1px solid ${COLORS.softGoldAlpha25}`,
                    borderRadius: '20px',
                    padding: '2px 10px',
                    color: COLORS.gold,
                    fontSize: '0.75rem',
                    fontFamily: FONTS.body,
                  }}>
                    ~{pair.count} {tr ? 'kez birlikte' : 'times together'}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'rgba(148,163,184,0.6)', fontFamily: FONTS.body }}>
                    ℹ️ {tr ? "Kur'an'da sıklıkla birlikte geçer" : 'Frequently paired in the Quran'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── SECTION 6: Verification links ───────────────────────────────── */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '10px',
          padding: '14px 20px',
        }}>
          <div style={{ color: COLORS.silver, fontSize: '0.82rem', fontFamily: FONTS.body, marginBottom: '10px', fontWeight: 600 }}>
            {tr ? 'Verileri bağımsız olarak doğrulamak için:' : 'To verify data independently:'}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
            <a
              href="https://corpus.quran.com/search.jsp"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: 'transparent',
                border: `1px solid ${COLORS.softGoldAlpha40}`,
                borderRadius: '8px',
                color: COLORS.gold,
                padding: '6px 14px',
                fontSize: '0.8rem',
                fontFamily: FONTS.body,
                textDecoration: 'none',
                cursor: 'pointer',
                display: 'inline-block',
              }}
            >
              {tr ? "Corpus Quran'da Ara →" : 'Search on Corpus Quran →'}
            </a>
            <a
              href="https://tanzil.net/#search/ar"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: 'transparent',
                border: `1px solid ${COLORS.softGoldAlpha40}`,
                borderRadius: '8px',
                color: COLORS.gold,
                padding: '6px 14px',
                fontSize: '0.8rem',
                fontFamily: FONTS.body,
                textDecoration: 'none',
                cursor: 'pointer',
                display: 'inline-block',
              }}
            >
              {tr ? "Tanzil'de Ara →" : 'Search on Tanzil →'}
            </a>
          </div>
          <div style={{ color: 'rgba(148,163,184,0.6)', fontSize: '0.75rem', fontFamily: FONTS.body, marginTop: '8px' }}>
            {tr
              ? 'Arapça isim kökünü bu araçlara yapıştırarak bağımsız doğrulama yapabilirsiniz.'
              : 'Paste the Arabic name root into these tools for independent verification.'}
          </div>
        </div>

      </div>{/* end body */}
    </div>
  );
}
