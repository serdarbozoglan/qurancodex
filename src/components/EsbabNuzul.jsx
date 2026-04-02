import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import { CLOSE_BTN, FONTS, OVERLAY_TITLE } from '../tokens';

const CATEGORY_META = {
  vahiy:     { tr: 'Vahiy',     en: 'Revelation',  color: '#d4a574', bg: 'rgba(212,165,116,0.15)' },
  savas:     { tr: 'Savaş',     en: 'Battle',       color: '#e74c3c', bg: 'rgba(231,76,60,0.15)'  },
  hukuki:    { tr: 'Hukuki',    en: 'Legal',        color: '#3498db', bg: 'rgba(52,152,219,0.15)' },
  kisisel:   { tr: 'Kişisel',   en: 'Personal',     color: '#a29bfe', bg: 'rgba(162,155,254,0.15)'},
  toplumsal: { tr: 'Toplumsal', en: 'Social',       color: '#2ecc71', bg: 'rgba(46,204,113,0.15)' },
  siyasi:    { tr: 'Siyasi',    en: 'Political',    color: '#00cec9', bg: 'rgba(0,206,201,0.15)'  },
};

const PERIOD_META = {
  'erken-mekki': { tr: 'Erken Mekki',  en: 'Early Meccan',  color: '#f39c12', years: '610–614 M' },
  'mekki':       { tr: 'Mekki Dönem',  en: 'Meccan Period', color: '#e67e22', years: '614–622 M' },
  'medeni':      { tr: 'Medeni Dönem', en: 'Medinan Period', color: '#2ecc71', years: '622–632 M' },
};

// Group events by period, preserving order
function groupByPeriod(events) {
  const groups = {};
  for (const ev of events) {
    if (!groups[ev.period]) groups[ev.period] = [];
    groups[ev.period].push(ev);
  }
  return groups;
}

const ARABIC_FONT = "'KFGQPC', 'Amiri Quran', serif";
const PERIOD_ORDER = ['erken-mekki', 'mekki', 'medeni'];

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const BackIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M19 12H5M12 5l-7 7 7 7"/>
  </svg>
);

export default function EsbabNuzul({ onClose }) {
  const { language } = useLanguage();
  const [events, setEvents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all' | period key | category key
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const detailRef = useRef(null);

  useEffect(() => {
    fetch('/esbabin-nuzul.json')
      .then(r => r.json())
      .then(data => { setEvents(data.events || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Escape key
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') { if (selected) setSelected(null); else onClose(); } };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [selected, onClose]);

  // Scroll detail panel to top on selection
  useEffect(() => {
    if (selected && detailRef.current) detailRef.current.scrollTop = 0;
  }, [selected]);

  const filtered = events.filter(ev => {
    if (filter !== 'all' && ev.period !== filter && ev.category !== filter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const inTitle = (language === 'tr' ? ev.titleTr : ev.titleEn).toLowerCase().includes(q);
      const inDesc = (language === 'tr' ? ev.descTr : ev.descEn).toLowerCase().includes(q);
      const inSurah = ev.surahs.some(s => s.nameTr.toLowerCase().includes(q));
      if (!inTitle && !inDesc && !inSurah) return false;
    }
    return true;
  });

  const groups = groupByPeriod(filtered);
  const cat = selected ? CATEGORY_META[selected.category] : null;

  const FILTERS = [
    { key: 'all', tr: 'Tümü', en: 'All' },
    ...PERIOD_ORDER.map(p => ({ key: p, tr: PERIOD_META[p].tr, en: PERIOD_META[p].en, isPeriod: true })),
    ...Object.entries(CATEGORY_META).map(([k, v]) => ({ key: k, tr: v.tr, en: v.en, color: v.color })),
  ];

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: '#08091a',
        display: 'flex', flexDirection: 'column',
        fontFamily: "'Inter', sans-serif",
      }}
      role="dialog"
      aria-label={language === 'tr' ? "Esbâb-ı Nüzul Haritası" : "Occasions of Revelation Map"}
    >
      {/* ── Header ─────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(8,9,26,0.95)',
        flexShrink: 0,
        gap: '16px',
      }}>
        {/* Left: back (mobile) + title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
          {selected && (
            <button
              onClick={() => setSelected(null)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                color: '#94a3b8', cursor: 'pointer',
              }}
              aria-label="Back"
            >
              <BackIcon />
            </button>
          )}
          <div>
            <div style={{
              fontSize: '0.65rem', color: '#d4a574', fontWeight: 600,
              letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '2px',
            }}>
              {language === 'tr' ? 'Esbâb-ı Nüzul' : 'Occasions of Revelation'}
            </div>
            <h1 style={{
              margin: 0, fontSize: '1.1rem', fontWeight: 700,
              color: '#e8e6e3', fontFamily: FONTS.body,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {selected
                ? (language === 'tr' ? selected.titleTr : selected.titleEn)
                : (language === 'tr' ? 'Vahyin Tarihi' : 'History of Revelation')}
            </h1>
          </div>
        </div>

        {/* Right: search + close */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          {!selected && (
            <div style={{ position: 'relative' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"
                style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={language === 'tr' ? 'Ara...' : 'Search...'}
                style={{
                  paddingLeft: '32px', paddingRight: '12px', height: '34px',
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px', color: '#e8e6e3', fontSize: '0.82rem',
                  outline: 'none', width: '160px',
                }}
              />
            </div>
          )}
          <button
            onClick={onClose}
            style={{ ...CLOSE_BTN }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#e8e6e3'; }}
            onMouseLeave={e => { e.currentTarget.style.background = CLOSE_BTN.background; e.currentTarget.style.color = '#94a3b8'; }}
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </div>
      </div>

      {/* ── Filter bar ─────────────────────────────────────────── */}
      {!selected && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0', padding: '0 24px',
          overflowX: 'auto', flexShrink: 0,
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          scrollbarWidth: 'none', minHeight: '52px',
          background: 'rgba(8,9,26,0.6)',
        }}>
          {/* Group label */}
          <span style={{
            fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: 'rgba(148,163,184,0.35)',
            whiteSpace: 'nowrap', marginRight: '10px', flexShrink: 0,
          }}>
            {language === 'tr' ? 'Dönem' : 'Period'}
          </span>

          {/* Period pills — segmented style */}
          <div style={{
            display: 'flex', gap: '2px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '10px', padding: '3px', flexShrink: 0,
          }}>
            {[{ key: 'all', tr: 'Tümü', en: 'All', color: '#d4a574' },
              ...PERIOD_ORDER.map(p => ({ key: p, tr: PERIOD_META[p].tr, en: PERIOD_META[p].en, color: PERIOD_META[p].color }))
            ].map(f => {
              const active = filter === f.key;
              return (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  style={{
                    padding: '5px 14px', borderRadius: '7px', whiteSpace: 'nowrap',
                    fontSize: '0.8rem', fontWeight: active ? 600 : 400, cursor: 'pointer',
                    border: 'none',
                    background: active ? `${f.color}28` : 'transparent',
                    color: active ? f.color : 'rgba(148,163,184,0.7)',
                    boxShadow: active ? `0 0 12px ${f.color}22` : 'none',
                    transition: 'all 0.15s', fontFamily: "'Inter', sans-serif",
                  }}
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#e8e6e3'; }}}
                  onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(148,163,184,0.7)'; }}}
                >
                  {language === 'tr' ? f.tr : f.en}
                </button>
              );
            })}
          </div>

          {/* Divider */}
          <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.08)', margin: '0 16px', flexShrink: 0 }} />

          {/* Group label */}
          <span style={{
            fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: 'rgba(148,163,184,0.35)',
            whiteSpace: 'nowrap', marginRight: '10px', flexShrink: 0,
          }}>
            {language === 'tr' ? 'Konu' : 'Topic'}
          </span>

          {/* Category pills — colored dots */}
          <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
            {Object.entries(CATEGORY_META).map(([k, v]) => {
              const active = filter === k;
              return (
                <button
                  key={k}
                  onClick={() => setFilter(active ? 'all' : k)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '5px 12px', borderRadius: '8px', whiteSpace: 'nowrap',
                    fontSize: '0.8rem', fontWeight: active ? 600 : 400, cursor: 'pointer',
                    border: active ? `1px solid ${v.color}55` : '1px solid rgba(255,255,255,0.08)',
                    background: active ? `${v.color}18` : 'rgba(255,255,255,0.03)',
                    color: active ? v.color : 'rgba(148,163,184,0.7)',
                    boxShadow: active ? `0 0 10px ${v.color}20` : 'none',
                    transition: 'all 0.15s', fontFamily: "'Inter', sans-serif",
                  }}
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#e8e6e3'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}}
                  onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = 'rgba(148,163,184,0.7)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}}
                >
                  <span style={{
                    width: '7px', height: '7px', borderRadius: '50%',
                    background: active ? v.color : `${v.color}80`,
                    flexShrink: 0, transition: 'background 0.15s',
                  }} />
                  {language === 'tr' ? v.tr : v.en}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Body ───────────────────────────────────────────────── */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>

        {loading && (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
              {language === 'tr' ? 'Yükleniyor...' : 'Loading...'}
            </div>
          </div>
        )}

        {!loading && !selected && (
          /* ── Timeline list ──────────────────────────── */
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px 24px 40px' }}>
            {filtered.length === 0 && (
              <p style={{ color: '#94a3b8', textAlign: 'center', marginTop: '60px', fontSize: '0.9rem' }}>
                {language === 'tr' ? 'Sonuç bulunamadı.' : 'No results found.'}
              </p>
            )}

            {PERIOD_ORDER.map(periodKey => {
              const evs = groups[periodKey];
              if (!evs || evs.length === 0) return null;
              const pm = PERIOD_META[periodKey];

              return (
                <div key={periodKey} style={{ marginBottom: '40px' }}>
                  {/* Period header */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    marginBottom: '20px',
                  }}>
                    <div style={{
                      width: '10px', height: '10px', borderRadius: '50%', flexShrink: 0,
                      background: pm.color, boxShadow: `0 0 8px ${pm.color}88`,
                    }}/>
                    <div style={{
                      fontSize: '0.8rem', fontWeight: 700, color: pm.color,
                      letterSpacing: '0.06em', textTransform: 'uppercase',
                    }}>
                      {language === 'tr' ? pm.tr : pm.en}
                    </div>
                    <div style={{
                      flex: 1, height: '1px',
                      background: `linear-gradient(90deg, ${pm.color}44, transparent)`,
                    }}/>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', flexShrink: 0 }}>
                      {pm.years}
                    </div>
                  </div>

                  {/* Events in this period */}
                  <div style={{
                    display: 'flex', flexDirection: 'column', gap: '10px',
                    paddingLeft: '22px',
                    borderLeft: `2px solid ${pm.color}33`,
                  }}>
                    {evs.map((ev, i) => {
                      const cm = CATEGORY_META[ev.category] || CATEGORY_META.vahiy;
                      return (
                        <motion.button
                          key={ev.id}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.04, duration: 0.25 }}
                          onClick={() => setSelected(ev)}
                          style={{
                            display: 'flex', gap: '14px', alignItems: 'flex-start',
                            padding: '14px 16px', borderRadius: '12px', cursor: 'pointer',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.07)',
                            textAlign: 'left', width: '100%',
                            transition: 'all 0.15s',
                            position: 'relative',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                            e.currentTarget.style.borderColor = `${cm.color}44`;
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                          }}
                        >
                          {/* Dot on timeline */}
                          <div style={{
                            position: 'absolute', left: '-27px', top: '20px',
                            width: '10px', height: '10px', borderRadius: '50%',
                            background: cm.color, flexShrink: 0,
                            boxShadow: `0 0 6px ${cm.color}66`,
                          }}/>

                          {/* Year badge */}
                          <div style={{
                            minWidth: '64px', textAlign: 'center', paddingTop: '2px', flexShrink: 0,
                          }}>
                            <div style={{
                              fontSize: '0.68rem', color: pm.color, fontWeight: 600,
                              letterSpacing: '0.04em',
                            }}>
                              {ev.hijriLabel}
                            </div>
                          </div>

                          {/* Content */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                              <span style={{
                                fontSize: '0.94rem', fontWeight: 600, color: '#e8e6e3',
                              }}>
                                {language === 'tr' ? ev.titleTr : ev.titleEn}
                              </span>
                              <span style={{
                                fontSize: '0.65rem', fontWeight: 600, padding: '2px 8px',
                                borderRadius: '10px', background: cm.bg, color: cm.color,
                                flexShrink: 0,
                              }}>
                                {language === 'tr' ? cm.tr : cm.en}
                              </span>
                            </div>
                            <div style={{
                              fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.5,
                              overflow: 'hidden', display: '-webkit-box',
                              WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                            }}>
                              {language === 'tr' ? ev.descTr : ev.descEn}
                            </div>
                            {/* Surah chips */}
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
                              {ev.surahs.map(s => (
                                <span key={s.num} style={{
                                  fontSize: '0.68rem', padding: '2px 7px', borderRadius: '8px',
                                  background: 'rgba(212,165,116,0.1)',
                                  border: '1px solid rgba(212,165,116,0.25)', color: '#d4a574',
                                }}>
                                  {s.num}. {s.nameTr}
                                  {s.verses && <span style={{ opacity: 0.6 }}> {s.verses}</span>}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Arrow */}
                          <div style={{ color: '#94a3b8', paddingTop: '4px', flexShrink: 0 }}>
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

        {!loading && selected && (
          /* Detail panel */
          <motion.div
            ref={detailRef}
            key={selected.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{ flex: 1, overflowY: 'auto', padding: '28px 28px 60px' }}
          >
            {/* Period + year */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <span style={{
                fontSize: '0.7rem', fontWeight: 700, padding: '3px 10px', borderRadius: '12px',
                background: `${PERIOD_META[selected.period].color}22`,
                border: `1px solid ${PERIOD_META[selected.period].color}44`,
                color: PERIOD_META[selected.period].color, letterSpacing: '0.06em', textTransform: 'uppercase',
              }}>
                {language === 'tr' ? PERIOD_META[selected.period].tr : PERIOD_META[selected.period].en}
              </span>
              <span style={{
                fontSize: '0.7rem', fontWeight: 700, padding: '3px 10px', borderRadius: '12px',
                background: cat.bg, border: `1px solid ${cat.color}44`, color: cat.color,
                letterSpacing: '0.06em', textTransform: 'uppercase',
              }}>
                {language === 'tr' ? cat.tr : cat.en}
              </span>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8', marginLeft: 'auto' }}>
                {selected.hijriLabel}
              </span>
            </div>

            {/* Title */}
            <h2 style={{
              margin: '0 0 24px', fontSize: '1.55rem', fontWeight: 700,
              color: '#e8e6e3', fontFamily: "'Playfair Display', serif",
              lineHeight: 1.3,
            }}>
              {language === 'tr' ? selected.titleTr : selected.titleEn}
            </h2>

            {/* Arabic verse block */}
            {selected.verseAr && (
              <div style={{
                margin: '0 0 28px', padding: '20px 24px',
                background: 'rgba(212,165,116,0.07)',
                border: '1px solid rgba(212,165,116,0.2)',
                borderRadius: '12px', borderLeft: `3px solid #d4a574`,
              }}>
                <p style={{
                  fontFamily: ARABIC_FONT,
                  fontSize: '1.7rem', lineHeight: 2,
                  color: '#d4a574', textAlign: 'right',
                  direction: 'rtl', margin: '0 0 10px',
                }}>
                  {selected.verseAr}
                </p>
                <p style={{
                  fontSize: '0.85rem', color: '#e8e6e3', lineHeight: 1.7,
                  margin: '0 0 6px', fontStyle: 'italic',
                }}>
                  {selected.verseTr}
                </p>
                <p style={{ margin: 0, fontSize: '0.72rem', color: '#94a3b8' }}>
                  — {selected.verseRef}
                </p>
              </div>
            )}

            {/* Occasion narrative */}
            <div style={{ marginBottom: '28px' }}>
              <div style={{
                fontSize: '0.65rem', color: '#d4a574', fontWeight: 700,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                marginBottom: '10px',
              }}>
                {language === 'tr' ? 'İniş Sebebi' : 'Occasion'}
              </div>
              <p style={{
                fontSize: '0.95rem', color: '#e8e6e3', lineHeight: 1.85,
                margin: 0, borderLeft: '2px solid rgba(212,165,116,0.3)',
                paddingLeft: '16px',
              }}>
                {language === 'tr' ? selected.occasionTr : selected.occasionEn}
              </p>
            </div>

            {/* Theological insight */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{
                fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                marginBottom: '10px',
              }}>
                {language === 'tr' ? 'Tefsir Notu' : 'Insight'}
              </div>
              <p style={{
                fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.85,
                margin: 0,
              }}>
                {language === 'tr' ? selected.descTr : selected.descEn}
              </p>
            </div>

            {/* Linked surahs */}
            <div>
              <div style={{
                fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                marginBottom: '12px',
              }}>
                {language === 'tr' ? 'İlgili Sureler' : 'Related Surahs'}
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {selected.surahs.map(s => (
                  <div key={s.num} style={{
                    padding: '10px 16px', borderRadius: '10px',
                    background: 'rgba(212,165,116,0.08)',
                    border: '1px solid rgba(212,165,116,0.25)',
                  }}>
                    <div style={{ fontSize: '0.7rem', color: '#d4a574', fontWeight: 700, marginBottom: '2px' }}>
                      {s.num}. Sure
                    </div>
                    <div style={{ fontSize: '0.95rem', color: '#e8e6e3', fontWeight: 600 }}>
                      {s.nameTr}
                    </div>
                    {s.verses && (
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '3px' }}>
                        {language === 'tr' ? 'Ayet' : 'Verse'} {s.verses}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation: prev/next */}
            <PrevNextNav events={events} current={selected} onSelect={setSelected} language={language} />
          </motion.div>
        )}
      </div>

      {/* ── Footer bar: stats ──────────────────────────────────── */}
      {!selected && !loading && (
        <div style={{
          display: 'flex', gap: '24px', padding: '10px 24px',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          background: 'rgba(8,9,26,0.9)', flexShrink: 0, flexWrap: 'wrap',
        }}>
          {[
            { val: events.length, tr: 'Olay', en: 'Events' },
            { val: events.filter(e => e.period !== 'medeni').length, tr: 'Mekki', en: 'Meccan' },
            { val: events.filter(e => e.period === 'medeni').length, tr: 'Medeni', en: 'Medinan' },
            { val: [...new Set(events.flatMap(e => e.surahs.map(s => s.num)))].length, tr: 'Sure', en: 'Surahs' },
          ].map(s => (
            <div key={s.tr} style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
              <span style={{ fontSize: '1rem', fontWeight: 700, color: '#d4a574' }}>{s.val}</span>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{language === 'tr' ? s.tr : s.en}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PrevNextNav({ events, current, onSelect, language }) {
  const idx = events.findIndex(e => e.id === current.id);
  const prev = idx > 0 ? events[idx - 1] : null;
  const next = idx < events.length - 1 ? events[idx + 1] : null;

  return (
    <div style={{
      display: 'flex', gap: '12px', marginTop: '40px',
      paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.06)',
    }}>
      {prev && (
        <button
          onClick={() => onSelect(prev)}
          style={{
            flex: 1, padding: '12px 14px', borderRadius: '10px', cursor: 'pointer',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            textAlign: 'left', color: '#94a3b8',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(212,165,116,0.3)'; e.currentTarget.style.color = '#d4a574'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#94a3b8'; }}
        >
          <div style={{ fontSize: '0.6rem', marginBottom: '4px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            ← {language === 'tr' ? 'Önceki' : 'Previous'}
          </div>
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#e8e6e3' }}>
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
            textAlign: 'right', color: '#94a3b8',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(212,165,116,0.3)'; e.currentTarget.style.color = '#d4a574'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#94a3b8'; }}
        >
          <div style={{ fontSize: '0.6rem', marginBottom: '4px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {language === 'tr' ? 'Sonraki' : 'Next'} →
          </div>
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#e8e6e3' }}>
            {language === 'tr' ? next.titleTr : next.titleEn}
          </div>
        </button>
      )}
    </div>
  );
}
