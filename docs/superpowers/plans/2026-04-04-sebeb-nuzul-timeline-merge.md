# Sebeb-i Nüzul + Nüzul Haritası Merge Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port EsbabNuzul's chronological timeline UI into SebebiNuzul as a 5th tab ("Zaman Çizelgesi"), then remove EsbabNuzul from the Navbar and tools menu entirely.

**Architecture:** SebebiNuzul gains a `TabZaman` component that fetches `/esbabin-nuzul.json` independently (no shared state with the other 4 tabs). EsbabNuzul.jsx file stays on disk but is no longer registered in Navbar. The tools array loses one entry (index 8), so all subsequent tool indices shift down by 1 — vizTools/analysisTools/researchTools arrays must be updated accordingly.

**Tech Stack:** React 18, Vite, Framer Motion (already in package.json), inline styles, project tokens (`src/tokens.js`), `useLanguage` hook.

---

## File Map

| File | Change |
|------|--------|
| `src/components/SebebiNuzul.jsx` | Add framer-motion import, add TPERIOD_META/TCAT_META constants, add `groupByPeriod` helper, add `TimelinePrevNext` component, add `TabZaman` component, add 5th TABS entry, add tab render case |
| `src/components/Navbar.jsx` | Remove EsbabNuzul lazy import, remove esbabBackRef, remove esbabOpen state, remove from anyOpen + deps, remove popstate handler block, remove tools[8] entry, update vizTools/analysisTools/researchTools indices, remove Suspense block |

**Files NOT touched:** `src/components/EsbabNuzul.jsx` (kept on disk), `public/esbabin-nuzul.json` (kept, consumed by TabZaman).

---

## Task 1: Add TabZaman to SebebiNuzul.jsx

**Files:**
- Modify: `src/components/SebebiNuzul.jsx`

### Context

`SebebiNuzul.jsx` currently has 4 tabs: Arama (0), İstatistik (1), İlkeler (2), Kaynaklar (3).
The TABS array is at the top of the file (lines ~47–91).
The main `SebebiNuzul` component renders tabs at the bottom: `{activeTab === 0 && <TabArama ...>}` etc.
`framer-motion` is NOT yet imported in this file (EsbabNuzul uses it, SebebiNuzul does not).
The project's token file is `src/tokens.js` — use `COLORS`, `FONTS`, `COLORS.gold`, `COLORS.silver`, `COLORS.offWhite`, `COLORS.glassBorder`, `COLORS.goldAlpha15`, `FONTS.body`, `FONTS.quran`, `FONTS.display`.

- [ ] **Step 1: Add framer-motion import**

In `src/components/SebebiNuzul.jsx`, the first line is:
```js
import { useState, useEffect, useRef, useMemo } from 'react';
```

After that line, add:
```js
import { motion } from 'framer-motion';
```

- [ ] **Step 2: Verify no duplicate import**

Run: `grep -n "framer-motion" src/components/SebebiNuzul.jsx`
Expected: exactly 1 line returned.

- [ ] **Step 3: Add timeline constants after existing PERIOD_META block**

The existing `PERIOD_META` in SebebiNuzul ends around line 45:
```js
const PERIOD_META = {
  'makki':  { tr: 'Mekkî',  en: 'Meccan',  color: '#f39c12' },
  'madani': { tr: 'Medenî', en: 'Medinan', color: '#3498db' },
};
```

Immediately after that block (before the `// ── Tab definitions` comment), insert:

```js
// ── Timeline tab constants (separate from SebebiNuzul's own period/category meta) ──
const TPERIOD_META = {
  'erken-mekki': { tr: 'Erken Mekkî',  en: 'Early Meccan',  color: '#f39c12', years: '610–614 M' },
  'mekki':       { tr: 'Mekkî Dönem',  en: 'Meccan Period', color: '#e67e22', years: '614–622 M' },
  'medeni':      { tr: 'Medenî Dönem', en: 'Medinan Period', color: '#2ecc71', years: '622–632 M' },
};
const TPERIOD_ORDER = ['erken-mekki', 'mekki', 'medeni'];

const TCAT_META = {
  vahiy:     { tr: 'Vahiy',     en: 'Revelation', color: '#d4a574', bg: 'rgba(212,165,116,0.15)' },
  savas:     { tr: 'Savaş',     en: 'Battle',      color: '#e74c3c', bg: 'rgba(231,76,60,0.15)'  },
  hukuki:    { tr: 'Hukuki',    en: 'Legal',       color: '#3498db', bg: 'rgba(52,152,219,0.15)' },
  kisisel:   { tr: 'Kişisel',   en: 'Personal',    color: '#a29bfe', bg: 'rgba(162,155,254,0.15)'},
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
```

- [ ] **Step 4: Add 5th entry to TABS array**

The TABS array ends with the Kaynaklar entry. After its closing `},` and before the `];` closing bracket, add:

```js
  {
    labelTr: 'Zaman Çizelgesi',
    labelEn: 'Timeline',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <line x1="8" y1="6" x2="21" y2="6"/>
        <line x1="8" y1="12" x2="21" y2="12"/>
        <line x1="8" y1="18" x2="21" y2="18"/>
        <line x1="3" y1="6" x2="3.01" y2="6"/>
        <line x1="3" y1="12" x2="3.01" y2="12"/>
        <line x1="3" y1="18" x2="3.01" y2="18"/>
      </svg>
    ),
  },
```

- [ ] **Step 5: Add `TimelinePrevNext` helper component**

This is a module-level component (not inside another component). Place it right before the `// ── OccasionCard` comment block. The full component:

```jsx
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
            flex: 1, padding: '12px 14px', borderRadius: '10px', cursor: 'pointer',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            textAlign: 'left', color: COLORS.silver, transition: 'all 0.15s',
            fontFamily: FONTS.body,
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = `${COLORS.gold}4d`; e.currentTarget.style.color = COLORS.gold; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = COLORS.silver; }}
        >
          <div style={{ fontSize: '0.6rem', marginBottom: '4px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            ← {language === 'tr' ? 'Önceki' : 'Previous'}
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
            flex: 1, padding: '12px 14px', borderRadius: '10px', cursor: 'pointer',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            textAlign: 'right', color: COLORS.silver, transition: 'all 0.15s',
            fontFamily: FONTS.body,
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = `${COLORS.gold}4d`; e.currentTarget.style.color = COLORS.gold; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = COLORS.silver; }}
        >
          <div style={{ fontSize: '0.6rem', marginBottom: '4px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {language === 'tr' ? 'Sonraki' : 'Next'} →
          </div>
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: COLORS.offWhite }}>
            {language === 'tr' ? next.titleTr : next.titleEn}
          </div>
        </button>
      )}
    </div>
  );
}
```

- [ ] **Step 6: Add `TabZaman` component**

Add this full component right before the `export default function SebebiNuzul` line. It is a module-level component (not nested):

```jsx
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

  useEffect(() => {
    if (timeSelected && detailRef.current) detailRef.current.scrollTop = 0;
    setExpandedSecondary(null);
  }, [timeSelected]);

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

  if (timeLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px' }}>
        <div style={{
          width: '28px', height: '28px', borderRadius: '50%',
          border: `2px solid ${COLORS.glassBorder}`,
          borderTopColor: COLORS.gold,
          animation: 'spin 0.8s linear infinite',
        }} />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

      {/* ── Filter + search bar (only when no event is selected) ── */}
      {!timeSelected && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0',
          padding: '0 24px', overflowX: 'auto', flexShrink: 0,
          borderBottom: `1px solid ${COLORS.glassBorder}`,
          scrollbarWidth: 'none', minHeight: '52px',
          background: 'rgba(8,9,26,0.6)',
        }}>
          {/* Period label */}
          <span style={{
            fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: 'rgba(148,163,184,0.35)',
            whiteSpace: 'nowrap', marginRight: '10px', flexShrink: 0,
          }}>
            {language === 'tr' ? 'Dönem' : 'Period'}
          </span>

          {/* Period pills */}
          <div style={{
            display: 'flex', gap: '2px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '10px', padding: '3px', flexShrink: 0,
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
                    color: active ? f.color : 'rgba(148,163,184,0.7)',
                    boxShadow: active ? `0 0 12px ${f.color}22` : 'none',
                    transition: 'all 0.15s', fontFamily: FONTS.body,
                  }}
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = COLORS.offWhite; }}}
                  onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(148,163,184,0.7)'; }}}
                >
                  {language === 'tr' ? f.tr : f.en}
                </button>
              );
            })}
          </div>

          {/* Divider */}
          <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.08)', margin: '0 16px', flexShrink: 0 }} />

          {/* Category label */}
          <span style={{
            fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: 'rgba(148,163,184,0.35)',
            whiteSpace: 'nowrap', marginRight: '10px', flexShrink: 0,
          }}>
            {language === 'tr' ? 'Konu' : 'Topic'}
          </span>

          {/* Category pills */}
          <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
            {Object.entries(TCAT_META).map(([k, v]) => {
              const active = timeFilter === k;
              return (
                <button
                  key={k}
                  onClick={() => setTimeFilter(active ? 'all' : k)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '5px 12px', borderRadius: '8px', whiteSpace: 'nowrap',
                    fontSize: '0.8rem', fontWeight: active ? 600 : 400, cursor: 'pointer',
                    border: active ? `1px solid ${v.color}55` : '1px solid rgba(255,255,255,0.08)',
                    background: active ? `${v.color}18` : 'rgba(255,255,255,0.03)',
                    color: active ? v.color : 'rgba(148,163,184,0.7)',
                    boxShadow: active ? `0 0 10px ${v.color}20` : 'none',
                    transition: 'all 0.15s', fontFamily: FONTS.body,
                  }}
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = COLORS.offWhite; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}}
                  onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = 'rgba(148,163,184,0.7)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}}
                >
                  <span style={{
                    width: '7px', height: '7px', borderRadius: '50%',
                    background: active ? v.color : `${v.color}80`,
                    flexShrink: 0,
                  }} />
                  {language === 'tr' ? v.tr : v.en}
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div style={{ position: 'relative', marginLeft: '16px', flexShrink: 0 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={COLORS.silver} strokeWidth="2" strokeLinecap="round"
              style={{ position: 'absolute', left: '9px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              value={timeSearch}
              onChange={e => setTimeSearch(e.target.value)}
              placeholder={language === 'tr' ? 'Olay veya sure ara...' : 'Search event or surah...'}
              style={{
                paddingLeft: '30px', paddingRight: '10px', height: '32px',
                background: 'rgba(255,255,255,0.05)', border: `1px solid ${COLORS.glassBorder}`,
                borderRadius: '8px', color: COLORS.offWhite, fontSize: '0.8rem',
                outline: 'none', width: '170px', fontFamily: FONTS.body,
              }}
              onFocus={e => { e.target.style.borderColor = COLORS.gold; }}
              onBlur={e => { e.target.style.borderColor = COLORS.glassBorder; }}
            />
          </div>
        </div>
      )}

      {/* ── Body ── */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

        {/* Timeline list */}
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
                  {/* Period header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                    <div style={{
                      width: '10px', height: '10px', borderRadius: '50%', flexShrink: 0,
                      background: pm.color, boxShadow: `0 0 8px ${pm.color}88`,
                    }}/>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: pm.color, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                      {language === 'tr' ? pm.tr : pm.en}
                    </div>
                    <div style={{ flex: 1, height: '1px', background: `linear-gradient(90deg, ${pm.color}44, transparent)` }}/>
                    <div style={{ fontSize: '0.72rem', color: COLORS.silver, flexShrink: 0 }}>{pm.years}</div>
                  </div>

                  {/* Events */}
                  <div style={{
                    display: 'flex', flexDirection: 'column', gap: '10px',
                    paddingLeft: '22px',
                    borderLeft: `2px solid ${pm.color}33`,
                  }}>
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
                            padding: '14px 16px', borderRadius: '12px', cursor: 'pointer',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.07)',
                            textAlign: 'left', width: '100%',
                            transition: 'all 0.15s',
                            position: 'relative',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = `${cm.color}44`; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
                        >
                          {/* Timeline dot */}
                          <div style={{
                            position: 'absolute', left: '-27px', top: '20px',
                            width: '10px', height: '10px', borderRadius: '50%',
                            background: cm.color, flexShrink: 0,
                            boxShadow: `0 0 6px ${cm.color}66`,
                          }}/>
                          {/* Year */}
                          <div style={{ minWidth: '64px', textAlign: 'center', paddingTop: '2px', flexShrink: 0 }}>
                            <div style={{ fontSize: '0.68rem', color: pm.color, fontWeight: 600, letterSpacing: '0.04em' }}>
                              {ev.hijriLabel}
                            </div>
                          </div>
                          {/* Content */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                              <span style={{ fontSize: '0.94rem', fontWeight: 600, color: COLORS.offWhite, fontFamily: FONTS.body }}>
                                {language === 'tr' ? ev.titleTr : ev.titleEn}
                              </span>
                              <span style={{ fontSize: '0.65rem', fontWeight: 600, padding: '2px 8px', borderRadius: '10px', background: cm.bg, color: cm.color, flexShrink: 0 }}>
                                {language === 'tr' ? cm.tr : cm.en}
                              </span>
                            </div>
                            <div style={{ fontSize: '0.78rem', color: COLORS.silver, lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', fontFamily: FONTS.body }}>
                              {language === 'tr' ? ev.descTr : ev.descEn}
                            </div>
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
                              {ev.surahs.map(s => (
                                <span key={s.num} style={{ fontSize: '0.68rem', padding: '2px 7px', borderRadius: '8px', background: COLORS.goldAlpha15, border: `1px solid ${COLORS.gold}40`, color: COLORS.gold, fontFamily: FONTS.body }}>
                                  {s.num}. {s.nameTr}{s.verses && <span style={{ opacity: 0.6 }}> {s.verses}</span>}
                                </span>
                              ))}
                            </div>
                          </div>
                          {/* Arrow */}
                          <div style={{ color: COLORS.silver, paddingTop: '4px', flexShrink: 0 }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
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

        {/* Detail panel */}
        {timeSelected && (
          <motion.div
            ref={detailRef}
            key={timeSelected.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '20px 16px 60px' : '28px 28px 60px' }}
          >
            {/* Back button */}
            <button
              onClick={() => setTimeSelected(null)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px',
                padding: '6px 12px', borderRadius: '8px',
                background: 'rgba(255,255,255,0.05)', border: `1px solid ${COLORS.glassBorder}`,
                color: COLORS.silver, cursor: 'pointer', fontSize: '0.8rem',
                fontFamily: FONTS.body, transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; e.currentTarget.style.color = COLORS.offWhite; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = COLORS.silver; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M19 12H5M12 5l-7 7 7 7"/>
              </svg>
              {language === 'tr' ? 'Zaman çizelgesine dön' : 'Back to timeline'}
            </button>

            {/* Badges */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '3px 10px', borderRadius: '12px', background: `${TPERIOD_META[timeSelected.period].color}22`, border: `1px solid ${TPERIOD_META[timeSelected.period].color}44`, color: TPERIOD_META[timeSelected.period].color, letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: FONTS.body }}>
                {language === 'tr' ? TPERIOD_META[timeSelected.period].tr : TPERIOD_META[timeSelected.period].en}
              </span>
              {selCat && (
                <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '3px 10px', borderRadius: '12px', background: selCat.bg, border: `1px solid ${selCat.color}44`, color: selCat.color, letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: FONTS.body }}>
                  {language === 'tr' ? selCat.tr : selCat.en}
                </span>
              )}
              <span style={{ fontSize: '0.78rem', color: COLORS.silver, marginLeft: 'auto', fontFamily: FONTS.body }}>
                {timeSelected.hijriLabel}
              </span>
            </div>

            {/* Title */}
            <h2 style={{ margin: '0 0 24px', fontSize: isMobile ? '1.3rem' : '1.55rem', fontWeight: 700, color: COLORS.offWhite, fontFamily: FONTS.display, lineHeight: 1.3 }}>
              {language === 'tr' ? timeSelected.titleTr : timeSelected.titleEn}
            </h2>

            {/* Primary verse */}
            {timeSelected.verseAr && (
              <div style={{ margin: '0 0 28px', padding: '20px 24px', background: `${COLORS.gold}11`, border: `1px solid ${COLORS.gold}33`, borderRadius: '12px', borderLeft: `3px solid ${COLORS.gold}` }}>
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

            {/* Secondary verses (expandable) */}
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
                          padding: '10px 14px', borderRadius: '10px',
                          background: isOpen ? `${COLORS.gold}1a` : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${isOpen ? `${COLORS.gold}55` : 'rgba(255,255,255,0.08)'}`,
                          transition: 'all 0.2s', fontFamily: FONTS.body,
                        }}
                        onMouseEnter={e => { if (!isOpen) { e.currentTarget.style.background = `${COLORS.gold}0d`; e.currentTarget.style.borderColor = `${COLORS.gold}33`; }}}
                        onMouseLeave={e => { if (!isOpen) { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="2.5" strokeLinecap="round"
                          style={{ flexShrink: 0, transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>
                          <path d="M9 18l6-6-6-6"/>
                        </svg>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.7rem', color: COLORS.gold, fontWeight: 700, marginBottom: '2px', fontFamily: FONTS.body }}>{sv.verseRef}</div>
                          <div style={{ fontSize: '0.78rem', color: COLORS.silver, fontFamily: FONTS.body }}>{language === 'tr' ? sv.labelTr : sv.labelEn}</div>
                        </div>
                      </button>
                      {isOpen && (
                        <div style={{ marginTop: '6px', padding: '18px 20px', background: `${COLORS.gold}0d`, border: `1px solid ${COLORS.gold}2e`, borderRadius: '10px', borderLeft: `3px solid ${COLORS.gold}80` }}>
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

            {/* Occasion */}
            <div style={{ marginBottom: '28px' }}>
              <div style={{ fontSize: '0.65rem', color: COLORS.gold, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '10px', fontFamily: FONTS.body }}>
                {language === 'tr' ? 'İniş Sebebi' : 'Occasion'}
              </div>
              <p style={{ fontSize: '0.95rem', color: COLORS.offWhite, lineHeight: 1.85, margin: 0, borderLeft: `2px solid ${COLORS.gold}4d`, paddingLeft: '16px', fontFamily: FONTS.body }}>
                {language === 'tr' ? timeSelected.occasionTr : timeSelected.occasionEn}
              </p>
            </div>

            {/* Tefsir notu */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ fontSize: '0.65rem', color: COLORS.silver, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '10px', fontFamily: FONTS.body }}>
                {language === 'tr' ? 'Tefsir Notu' : 'Insight'}
              </div>
              <p style={{ fontSize: '0.88rem', color: COLORS.silver, lineHeight: 1.85, margin: 0, fontFamily: FONTS.body }}>
                {language === 'tr' ? timeSelected.descTr : timeSelected.descEn}
              </p>
            </div>

            {/* Related surahs */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.65rem', color: COLORS.silver, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '12px', fontFamily: FONTS.body }}>
                {language === 'tr' ? 'İlgili Sureler' : 'Related Surahs'}
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {timeSelected.surahs.map(s => (
                  <div key={s.num} style={{ padding: '10px 16px', borderRadius: '10px', background: `${COLORS.gold}14`, border: `1px solid ${COLORS.gold}40` }}>
                    <div style={{ fontSize: '0.7rem', color: COLORS.gold, fontWeight: 700, marginBottom: '2px', fontFamily: FONTS.body }}>{s.num}. Sure</div>
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

      {/* ── Footer stats ── */}
      {!timeSelected && (
        <div style={{
          display: 'flex', gap: '24px', padding: '10px 24px',
          borderTop: `1px solid ${COLORS.glassBorder}`,
          background: 'rgba(8,9,26,0.9)', flexShrink: 0, flexWrap: 'wrap',
        }}>
          {[
            { val: timeEvents.length, tr: 'Olay', en: 'Events' },
            { val: timeEvents.filter(e => e.period !== 'medeni').length, tr: 'Mekkî', en: 'Meccan' },
            { val: timeEvents.filter(e => e.period === 'medeni').length, tr: 'Medenî', en: 'Medinan' },
            { val: [...new Set(timeEvents.flatMap(e => e.surahs.map(s => s.num)))].length, tr: 'Sure', en: 'Surahs' },
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
```

- [ ] **Step 7: Wire up the 5th tab in the render**

In the `SebebiNuzul` component's tab content section, the current last line is:
```jsx
        {activeTab === 3 && <TabKaynaklar data={data} language={language} isMobile={isMobile} />}
```

After that line, add:
```jsx
        {activeTab === 4 && <TabZaman language={language} isMobile={isMobile} />}
```

- [ ] **Step 8: Verify the build passes**

Run: `npm run build`
Expected: `✓ built in` with no errors. `SebebiNuzul-*.js` should appear in the output.

If build fails with a syntax error, check:
- All JSX strings containing Turkish apostrophes (like `Kur'an`, `Mekkî'de`) must be in double-quoted JS strings
- The `motion` import is present at the top

- [ ] **Step 9: Commit Task 1**

```bash
git add src/components/SebebiNuzul.jsx
git commit -m "feat: add Zaman Çizelgesi tab to SebebiNuzul (ported from EsbabNuzul)"
```

---

## Task 2: Remove EsbabNuzul from Navbar.jsx

**Files:**
- Modify: `src/components/Navbar.jsx`

### Context

Current tools array has 18 entries (indices 0–17). EsbabNuzul is at **tools[8]** ("Nüzul Haritası"). After removal, tools[9]–tools[17] become tools[8]–tools[16]. All references to these indices in `vizTools`, `analysisTools`, and `researchTools` must be updated.

Current index comment in Navbar.jsx (around line 1134):
```
// tools: [0]Wow [1]Ayet [2]Kelime [3]Nüzul Sırası [4]Peygamberler [5]Kavram [6]Kıssa [7]Sure DNA [8]Nüzul Haritası [9]Emirler [10]Dua [11]Muhatap [12]Esmaül Hüsna [13]Zamanın Boyutları [14]Kıraat Atlası [15]Diyalog Ağı [16]Mesel Atlası [17]Sebeb-i Nüzul
```

After removal it becomes:
```
// tools: [0]Wow [1]Ayet [2]Kelime [3]Nüzul Sırası [4]Peygamberler [5]Kavram [6]Kıssa [7]Sure DNA [8]Emirler [9]Dua [10]Muhatap [11]Esmaül Hüsna [12]Zamanın Boyutları [13]Kıraat Atlası [14]Diyalog Ağı [15]Mesel Atlası [16]Sebeb-i Nüzul
```

Array updates required:

| Variable | Before | After |
|----------|--------|-------|
| vizTools | `[tools[1], tools[2], tools[3], tools[8], tools[6], tools[16]]` | `[tools[1], tools[2], tools[3], tools[6], tools[15]]` |
| analysisTools | `[tools[12], tools[7], tools[5], tools[11], tools[15], tools[14]]` | `[tools[11], tools[7], tools[5], tools[10], tools[14], tools[13]]` |
| researchTools | `[tools[0], tools[4], tools[9], tools[10], tools[17]]` | `[tools[0], tools[4], tools[8], tools[9], tools[16]]` |

- [ ] **Step 1: Remove EsbabNuzul lazy import**

Find and remove this exact line:
```js
const EsbabNuzul       = lazy(() => import('./EsbabNuzul'));
```

- [ ] **Step 2: Remove esbabBackRef**

Find and remove this exact line:
```js
  const esbabBackRef   = useRef(null); // set by EsbabNuzul when detail is open
```

- [ ] **Step 3: Remove esbabOpen state**

Find and remove this exact line:
```js
  const [esbabOpen,      setEsbabOpen]      = useState(false);
```

- [ ] **Step 4: Remove esbabOpen from anyOpen expression**

Current:
```js
    const anyOpen = readingOpen || graphOpen || heatmapOpen || revelationOpen || duaOpen || wowOpen || prophetOpen || conceptOpen || kissaOpen || comparatorOpen || esbabOpen || commandsOpen || addresseeOpen || esmaOpen || zamanOpen || yeminlerOpen || dogaOpen || kavimlerOpen || cennetOpen || meleklerOpen || renkleriOpen || kiyametOpen || retorigiOpen || kiraatOpen || diyalogOpen || meselOpen || sebebOpen;
```

Replace with:
```js
    const anyOpen = readingOpen || graphOpen || heatmapOpen || revelationOpen || duaOpen || wowOpen || prophetOpen || conceptOpen || kissaOpen || comparatorOpen || commandsOpen || addresseeOpen || esmaOpen || zamanOpen || yeminlerOpen || dogaOpen || kavimlerOpen || cennetOpen || meleklerOpen || renkleriOpen || kiyametOpen || retorigiOpen || kiraatOpen || diyalogOpen || meselOpen || sebebOpen;
```

- [ ] **Step 5: Remove esbabOpen from anyOpen useEffect dep array**

Current:
```js
  }, [readingOpen, graphOpen, heatmapOpen, revelationOpen, duaOpen, wowOpen, prophetOpen, conceptOpen, kissaOpen, comparatorOpen, esbabOpen, commandsOpen, addresseeOpen, esmaOpen, zamanOpen, yeminlerOpen, dogaOpen, kavimlerOpen, cennetOpen, meleklerOpen, renkleriOpen, kiyametOpen, retorigiOpen, kiraatOpen, diyalogOpen, meselOpen, sebebOpen]);
```

(This is the closing of the anyOpen useEffect — it's the first dep array after the anyOpen expression.)

Replace with:
```js
  }, [readingOpen, graphOpen, heatmapOpen, revelationOpen, duaOpen, wowOpen, prophetOpen, conceptOpen, kissaOpen, comparatorOpen, commandsOpen, addresseeOpen, esmaOpen, zamanOpen, yeminlerOpen, dogaOpen, kavimlerOpen, cennetOpen, meleklerOpen, renkleriOpen, kiyametOpen, retorigiOpen, kiraatOpen, diyalogOpen, meselOpen, sebebOpen]);
```

- [ ] **Step 6: Remove esbabOpen popstate handler block**

Find and remove this entire block (6 lines):
```js
      if (esbabOpen) {
        if (esbabBackRef.current) {
          esbabBackRef.current();
          window.history.pushState({ overlay: true }, '');
        } else {
          setEsbabOpen(false);
        }
        return;
      }
```

- [ ] **Step 7: Remove esbabOpen from popstate useEffect dep array**

Current (this is the dep array for the handlePop useEffect):
```js
  }, [readingOpen, graphOpen, graphReturnToWow, graphReturnToConcept, heatmapOpen, revelationOpen, duaOpen, wowOpen, prophetOpen, conceptOpen, kissaOpen, comparatorOpen, esbabOpen, commandsOpen, addresseeOpen, esmaOpen, zamanOpen, yeminlerOpen, dogaOpen, kavimlerOpen, cennetOpen, meleklerOpen, renkleriOpen, kiyametOpen, retorigiOpen, kiraatOpen, diyalogOpen, meselOpen, sebebOpen]);
```

Replace with:
```js
  }, [readingOpen, graphOpen, graphReturnToWow, graphReturnToConcept, heatmapOpen, revelationOpen, duaOpen, wowOpen, prophetOpen, conceptOpen, kissaOpen, comparatorOpen, commandsOpen, addresseeOpen, esmaOpen, zamanOpen, yeminlerOpen, dogaOpen, kavimlerOpen, cennetOpen, meleklerOpen, renkleriOpen, kiyametOpen, retorigiOpen, kiraatOpen, diyalogOpen, meselOpen, sebebOpen]);
```

- [ ] **Step 8: Remove the tools[8] Nüzul Haritası entry from tools array**

Find and remove this entire object from the tools array (including the trailing comma):
```js
    {
      labelTr: 'Nüzul Haritası', labelEn: 'Revelation Map',
      descTr: 'Hangi ayet, hangi olay üzerine indi?', descEn: 'Which verse was revealed on which occasion?',
      icon: (
        // Map pin + scroll/book — revelation occasion marker
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
          <circle cx="12" cy="9" r="2.5" fill="currentColor" stroke="none"/>
        </svg>
      ),
      action: () => { setEsbabOpen(true); setToolsOpen(false); },
    },
```

- [ ] **Step 9: Update tools index comment and the 3 category arrays**

Find:
```js
                    // tools: [0]Wow [1]Ayet [2]Kelime [3]Nüzul Sırası [4]Peygamberler [5]Kavram [6]Kıssa [7]Sure DNA [8]Nüzul Haritası [9]Emirler [10]Dua [11]Muhatap [12]Esmaül Hüsna [13]Zamanın Boyutları [14]Kıraat Atlası [15]Diyalog Ağı [16]Mesel Atlası [17]Sebeb-i Nüzul
                    const vizTools      = [tools[1], tools[2], tools[3], tools[8], tools[6], tools[16]];
                    const analysisTools = [tools[12], tools[7], tools[5], tools[11], tools[15], tools[14]];
                    const researchTools = [tools[0], tools[4], tools[9], tools[10], tools[17]];
```

Replace with:
```js
                    // tools: [0]Wow [1]Ayet [2]Kelime [3]Nüzul Sırası [4]Peygamberler [5]Kavram [6]Kıssa [7]Sure DNA [8]Emirler [9]Dua [10]Muhatap [11]Esmaül Hüsna [12]Zamanın Boyutları [13]Kıraat Atlası [14]Diyalog Ağı [15]Mesel Atlası [16]Sebeb-i Nüzul
                    const vizTools      = [tools[1], tools[2], tools[3], tools[6], tools[15]];
                    const analysisTools = [tools[11], tools[7], tools[5], tools[10], tools[14], tools[13]];
                    const researchTools = [tools[0], tools[4], tools[8], tools[9], tools[16]];
```

- [ ] **Step 10: Remove the esbabOpen Suspense JSX block**

Find and remove this entire block:
```jsx
    {esbabOpen && (
      <Suspense fallback={null}>
        <EsbabNuzul onClose={() => setEsbabOpen(false)} backRef={esbabBackRef} />
      </Suspense>
    )}
```

- [ ] **Step 11: Verify build passes**

Run: `npm run build`
Expected: `✓ built in` with no errors. Confirm `EsbabNuzul` does NOT appear as a chunk in the output (since it's no longer imported).

If build fails:
- Check if any remaining reference to `esbabOpen`, `esbabBackRef`, or `EsbabNuzul` exists: `grep -n "esbab\|EsbabNuzul" src/components/Navbar.jsx`
- Should return 0 results.

- [ ] **Step 12: Verify correct tool count in runtime**

Run: `npm run dev` then open the app. Open the tools dropdown — it should show 17 tools (not 18). "Nüzul Haritası" should be gone. "Sebeb-i Nüzul Veritabanı" should still appear and open the 5-tab overlay including the new "Zaman Çizelgesi" tab.

- [ ] **Step 13: Commit Task 2**

```bash
git add src/components/Navbar.jsx
git commit -m "refactor: remove EsbabNuzul from Navbar (merged into SebebiNuzul Zaman Çizelgesi tab)"
```

---

## Self-Review

**Spec coverage:**
- [x] TabZaman fetches `/esbabin-nuzul.json` (20 events)
- [x] Timeline grouped by 3 periods (erken-mekki, mekki, medeni) with period headers + gradient lines
- [x] Category filter (6 categories) + period filter + search bar in one scrollable row
- [x] Framer Motion `motion.button` entrance animation (stagger 0.04s, x: -12→0)
- [x] Event list: year badge, title, category chip, 2-line description clamp, surah chips, timeline dot
- [x] Detail panel: slide-in animation (x: 30→0, 0.25s), back button, primary verse block (Arabic + TR + ref), secondary verses expandable, occasionTr/En, descTr/En (Tefsir Notu), surahs grid
- [x] `TimelinePrevNext` component for prev/next navigation in detail view
- [x] Footer stats: event count, Meccan count, Medinan count, surah count
- [x] All Arabic text uses `FONTS.quran` with `dir="rtl"` and `lang="ar"`
- [x] All colors via COLORS token (no raw hex in TabZaman)
- [x] Mobile: isMobile-aware padding in detail panel
- [x] EsbabNuzul removed from: lazy import, useRef, useState, anyOpen, both dep arrays, popstate handler, tools array, vizTools, Suspense JSX
- [x] Tool index comment updated to reflect new 17-tool count

**Placeholder scan:** No "TBD", "TODO", or "implement later" in this plan. All code is complete.

**Type consistency:** `timeSelected`, `timeEvents`, `timeFilter`, `timeSearch`, `expandedSecondary`, `detailRef` all defined in `TabZaman`. `TimelinePrevNext` receives `events`, `current`, `onSelect`, `language` — all passed correctly from `TabZaman`. `TPERIOD_META` and `TCAT_META` are module-level constants. `groupByPeriod` is a module-level function. No naming inconsistency.
