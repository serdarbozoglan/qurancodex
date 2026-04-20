import { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

// ── Category SVG Icons (20×20, thin stroke, amber) ──────────────────────────
const CATEGORY_ICONS = {
  ibadet: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3C10 7 6 8 6 12s6 6 6 6 6-2 6-6-4-5-6-9z"/>
      <line x1="12" y1="18" x2="12" y2="21"/>
    </svg>
  ),
  aile: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="7" r="2.5"/>
      <circle cx="16" cy="7" r="2"/>
      <path d="M2 21c0-4 3-6 7-6h2c4 0 7 2 7 6"/>
      <path d="M16 9c2.5 0 5 1.5 5 5"/>
    </svg>
  ),
  ahlak: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="3" x2="12" y2="21"/>
      <path d="M5 8h7m-7 0l-2 5c0 2 2 3 4 3s4-1 4-3L12 8"/>
      <path d="M19 8h-7m7 0l2 5c0 2-2 3-4 3s-4-1-4-3l2-5"/>
    </svg>
  ),
  mal: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/>
      <path d="M12 6v2m0 8v2"/>
      <path d="M9.5 9.5A2.5 2.5 0 0 1 12 8c1.5 0 2.5 1 2.5 2.3 0 2.7-5 2.4-5 5.2 0 1.4 1 2.5 2.5 2.5s2.5-1 2.5-2.5"/>
    </svg>
  ),
  bilgi: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10"/>
      <path d="M4 19h16"/>
      <line x1="8" y1="10" x2="16" y2="10"/>
      <line x1="8" y1="14" x2="13" y2="14"/>
    </svg>
  ),
  yasaklar: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l8 4v5c0 5-4 9-8 10C8 21 4 17 4 12V7l8-4z"/>
      <line x1="9" y1="12" x2="15" y2="12"/>
    </svg>
  ),
  'sosyal-adalet': (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 11V9a4 4 0 0 0-8 0v2"/>
      <path d="M6 11v2a4 4 0 0 0 4 4h4a4 4 0 0 0 4-4v-2"/>
      <path d="M12 15v3m-3 2h6"/>
    </svg>
  ),
  iletisim: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
};

function CategoryIcon({ id, color }) {
  const icon = CATEGORY_ICONS[id];
  if (!icon) return null;
  return (
    <span style={{ color, display: 'inline-flex', alignItems: 'center', flexShrink: 0 }}>
      {icon}
    </span>
  );
}

// ── Badge colors ──────────────────────────────────────────────────────────────
const BADGE = {
  emir:  { bg: 'rgba(201,169,110,0.15)', border: 'rgba(201,169,110,0.35)', color: '#c9a96e' },
  nehiy: { bg: 'rgba(232,90,74,0.15)',   border: 'rgba(232,90,74,0.35)',   color: '#e85a4a' },
};

export default function QuranCommands({ onClose }) {
  const { language } = useLanguage();
  const [data, setData]           = useState(null);
  const [activeId, setActiveId]   = useState('ibadet');
  const [filter, setFilter]       = useState('all'); // 'all' | 'emir' | 'nehiy'
  const [expanded, setExpanded]   = useState(false);
  const [isMobile, setIsMobile]   = useState(() => window.innerWidth < 768);

  useEffect(() => {
    fetch('/quran-commands.json')
      .then(r => r.json())
      .then(d => setData(d))
      .catch(() => {});

    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  // Reset expanded when category or filter changes
  /* eslint-disable react-hooks/set-state-in-effect -- resetting derived state on dep change */
  useEffect(() => { setExpanded(false); }, [activeId, filter]);
  /* eslint-enable react-hooks/set-state-in-effect */

  if (!data) return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#0d1b2a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#94a3b8', fontFamily: "'Inter', sans-serif" }}>Yükleniyor...</div>
    </div>
  );

  const categories = data.categories || [];
  const activeCategory = categories.find(c => c.id === activeId) || categories[0];
  const accent = activeCategory?.accent || '#c9a96e';

  // Total stats
  const allCommands = categories.flatMap(c => c.commands);
  const emirCount = allCommands.filter(c => c.type === 'emir').length;
  const nehiyCount = allCommands.filter(c => c.type === 'nehiy').length;

  // Filtered commands for active category
  const commands = (activeCategory?.commands || []).filter(cmd =>
    filter === 'all' ? true : cmd.type === filter
  );

  const SHOW_INITIAL = 6;
  const visibleCommands = expanded ? commands : commands.slice(0, SHOW_INITIAL);
  const remaining = commands.length - SHOW_INITIAL;

  const labelTr = {
    title: "Kur'an Bize Ne Emrediyor?",
    subtitle: 'Doğrudan emirler, tavsiyeler ve yasaklar — her biri bir ayet',
    allCommands: 'Tümü',
    emir: 'Emirler',
    nehiy: 'Yasaklar',
    emirStat: 'Emir',
    nehiyStat: 'Yasak',
    kategoriler: 'Kategori',
    showMore: (n) => `+ ${n} daha göster`,
    curatedNote: 'Seçki — Bu liste temel emir ve yasakların derlenmiş bir özetidir, kapsamlı bir tefsir değildir.',
    disclaimer: "Her madde ilgili Kur'an ayetiyle birlikte sunulmaktadır.",
    unverified: 'Doğrulanmamış',
    note: 'Not',
    emirBadge: 'EMİR',
    nehiyBadge: 'YASAK',
  };
  const labelEn = {
    title: 'What Does the Quran Command?',
    subtitle: 'Direct commands, guidance, and prohibitions — each one a verse',
    allCommands: 'All',
    emir: 'Commands',
    nehiy: 'Prohibitions',
    emirStat: 'Commands',
    nehiyStat: 'Prohibitions',
    kategoriler: 'Categories',
    showMore: (n) => `+ ${n} more`,
    curatedNote: 'Curated selection — This list is a condensed overview of key commands and prohibitions, not a comprehensive commentary.',
    disclaimer: 'Each item is presented with its source Quranic verse.',
    unverified: 'Unverified',
    note: 'Note',
    emirBadge: 'COMMAND',
    nehiyBadge: 'PROHIBITION',
  };
  const L = language === 'tr' ? labelTr : labelEn;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: '#0d1b2a',
      overflowY: 'auto',
      fontFamily: "'Inter', sans-serif",
    }}>
      {/* Close button */}
      <button
        onClick={onClose}
        aria-label="Kapat"
        style={{
          position: 'fixed', top: '16px', right: '20px', zIndex: 10000,
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '50%', width: '36px', height: '36px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: '#94a3b8', transition: 'all 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = '#fff'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#94a3b8'; }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>

      {/* Header */}
      <div style={{ padding: isMobile ? '56px 16px 20px' : '40px 32px 28px', maxWidth: '1280px', margin: '0 auto', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ marginBottom: '6px' }}>
          <span style={{ fontSize: '11px', color: 'rgba(201,169,110,0.7)', letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 600 }}>
            {language === 'tr' ? "KUR'AN'IN EMİRLERİ" : "QURAN COMMANDS"}
          </span>
        </div>
        <h1 style={{ fontSize: isMobile ? '1.4rem' : '2rem', fontWeight: 800, color: '#e8e6e3', fontFamily: "'Playfair Display', serif", marginBottom: '8px', lineHeight: 1.2 }}>
          {L.title}
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '20px' }}>
          {L.subtitle}
        </p>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '14px' }}>
          <div style={{
            background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.28)',
            borderRadius: '8px', padding: '7px 14px',
            display: 'flex', alignItems: 'center', gap: '7px',
          }}>
            <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#c9a96e', lineHeight: 1 }}>{emirCount}</span>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>{L.emirStat}</span>
          </div>
          <div style={{
            background: 'rgba(232,90,74,0.1)', border: '1px solid rgba(232,90,74,0.28)',
            borderRadius: '8px', padding: '7px 14px',
            display: 'flex', alignItems: 'center', gap: '7px',
          }}>
            <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#e85a4a', lineHeight: 1 }}>{nehiyCount}</span>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>{L.nehiyStat}</span>
          </div>
          <div style={{
            background: 'rgba(74,158,232,0.08)', border: '1px solid rgba(74,158,232,0.22)',
            borderRadius: '8px', padding: '7px 14px',
            display: 'flex', alignItems: 'center', gap: '7px',
          }}>
            <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#4A9EE8', lineHeight: 1 }}>{categories.length}</span>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>{L.kategoriler}</span>
          </div>
        </div>

        {/* Curated note + disclaimer */}
        <p style={{ fontSize: '0.75rem', color: 'rgba(148,163,184,0.55)', lineHeight: 1.5 }}>
          ℹ {L.curatedNote} {L.disclaimer}
        </p>
      </div>

      {/* Mobile category chips */}
      {isMobile && (
        <div style={{
          display: 'flex', gap: '6px', overflowX: 'auto',
          padding: '10px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          scrollbarWidth: 'none',
        }}>
          {categories.map(cat => {
            const isActive = cat.id === activeId;
            return (
              <button
                key={cat.id}
                onClick={() => { setActiveId(cat.id); setFilter('all'); }}
                style={{
                  flexShrink: 0, padding: '6px 12px', borderRadius: '20px',
                  border: `1px solid ${isActive ? cat.accent : 'rgba(255,255,255,0.1)'}`,
                  background: isActive ? cat.accent + '22' : 'transparent',
                  color: isActive ? cat.accent : '#94a3b8',
                  fontSize: '0.78rem', fontWeight: isActive ? 600 : 400,
                  cursor: 'pointer', transition: 'all 0.15s',
                  fontFamily: "'Inter', sans-serif",
                  display: 'flex', alignItems: 'center', gap: '5px',
                }}
              >
                <CategoryIcon id={cat.id} color={isActive ? cat.accent : '#64748b'} />
                <span>{language === 'tr' ? cat.titleTr : cat.titleEn}</span>
                <span style={{
                  background: isActive ? cat.accent + '30' : 'rgba(255,255,255,0.08)',
                  color: isActive ? cat.accent : '#64748b',
                  borderRadius: '10px', padding: '0 5px',
                  fontSize: '0.7rem', fontWeight: 700,
                }}>
                  {(cat.commands || []).length}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Body: sidebar + content */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', gap: '0', minHeight: 'calc(100vh - 220px)' }}>

        {/* Sidebar — hidden on mobile */}
        <nav style={{
          width: '220px', flexShrink: 0,
          borderRight: '1px solid rgba(255,255,255,0.07)',
          padding: '20px 0',
          position: 'sticky', top: 0, alignSelf: 'flex-start',
          maxHeight: 'calc(100vh - 220px)', overflowY: 'auto',
          display: isMobile ? 'none' : 'block',
        }}>
          {categories.map(cat => {
            const isActive = cat.id === activeId;
            const catCommands = cat.commands || [];
            return (
              <button
                key={cat.id}
                role="button"
                aria-pressed={isActive}
                onClick={() => { setActiveId(cat.id); setFilter('all'); }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  width: '100%', padding: '10px 20px',
                  background: isActive ? cat.accent + '14' : 'transparent',
                  borderLeft: isActive ? `3px solid ${cat.accent}` : '3px solid transparent',
                  border: 'none', cursor: 'pointer',
                  transition: 'all 0.15s', textAlign: 'left',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
              >
                <span style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  fontSize: '0.82rem', fontWeight: isActive ? 600 : 400,
                  color: isActive ? cat.accent : '#94a3b8',
                  lineHeight: 1.3,
                }}>
                  <CategoryIcon id={cat.id} color={isActive ? cat.accent : '#64748b'} />
                  {language === 'tr' ? cat.titleTr : cat.titleEn}
                </span>
                <span style={{
                  fontSize: '0.7rem', fontWeight: 600,
                  color: isActive ? cat.accent : 'rgba(148,163,184,0.5)',
                  background: isActive ? cat.accent + '20' : 'rgba(255,255,255,0.05)',
                  borderRadius: '10px', padding: '1px 7px',
                  flexShrink: 0,
                }}>
                  {catCommands.length}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Main content */}
        <div style={{ flex: 1, padding: isMobile ? '16px 16px 40px' : '24px 32px 48px', minWidth: 0 }}>

          {/* Category title + filter toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CategoryIcon id={activeCategory?.id} color={accent} />
              <div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: accent, margin: 0, lineHeight: 1.2 }}>
                  {language === 'tr' ? activeCategory?.titleTr : activeCategory?.titleEn}
                </h2>
                <p style={{ fontSize: '0.78rem', color: 'rgba(148,163,184,0.55)', margin: '2px 0 0' }}>
                  {(activeCategory?.commands || []).length} {language === 'tr' ? 'madde' : 'items'}
                </p>
              </div>
            </div>

            {/* Emir / Nehiy toggle */}
            <div style={{
              display: 'flex', gap: '4px',
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '8px', padding: '3px',
            }}>
              {[
                { key: 'all',   labelTr: L.allCommands, labelEn: L.allCommands },
                { key: 'emir',  labelTr: L.emir,        labelEn: L.emir },
                { key: 'nehiy', labelTr: L.nehiy,        labelEn: L.nehiy },
              ].map(f => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  style={{
                    padding: '5px 12px', borderRadius: '5px',
                    border: 'none', cursor: 'pointer',
                    fontSize: '0.78rem', fontWeight: 500,
                    background: filter === f.key ? accent : 'transparent',
                    color: filter === f.key ? '#0d1b2a' : '#94a3b8',
                    transition: 'all 0.15s',
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {language === 'tr' ? f.labelTr : f.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Cards grid */}
          {commands.length === 0 ? (
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', textAlign: 'center', padding: '40px 0' }}>
              {language === 'tr' ? 'Bu kategoride seçili filtreyle eşleşen madde yok.' : 'No items match the selected filter in this category.'}
            </p>
          ) : (
            <>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))',
                gap: '12px',
              }}>
                {visibleCommands.map(cmd => (
                  <CommandCard key={cmd.id} cmd={cmd} accent={accent} language={language} L={L} />
                ))}
              </div>

              {!expanded && remaining > 0 && (
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  <button
                    onClick={() => setExpanded(true)}
                    style={{
                      padding: '8px 20px',
                      background: 'transparent',
                      border: `1px solid ${accent}50`,
                      borderRadius: '8px',
                      color: accent,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      fontFamily: "'Inter', sans-serif",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = accent + '15'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    {L.showMore(remaining)}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function CommandCard({ cmd, accent, language, L }) {
  const isNehiy = cmd.type === 'nehiy';
  const badge = isNehiy ? BADGE.nehiy : BADGE.emir;

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderLeft: `2px solid ${accent}`,
        borderRadius: '10px',
        padding: '16px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        transition: 'transform 0.15s, border-color 0.15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.01)'; e.currentTarget.style.borderLeftColor = accent; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.13)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.borderLeftColor = accent; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
    >
      {/* Type badge + unverified warning */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
        <span style={{
          fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em',
          color: badge.color,
          background: badge.bg,
          border: `1px solid ${badge.border}`,
          borderRadius: '20px', padding: '2px 9px',
          textTransform: 'uppercase',
        }}>
          {isNehiy ? L.nehiyBadge : L.emirBadge}
        </span>
        {!cmd.verified && (
          <span style={{
            fontSize: '0.65rem', fontWeight: 600,
            color: '#E8A24A',
            background: 'rgba(232,162,74,0.1)',
            border: '1px solid rgba(232,162,74,0.28)',
            borderRadius: '20px', padding: '2px 8px',
            display: 'flex', alignItems: 'center', gap: '3px',
          }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            {L.unverified}
          </span>
        )}
      </div>

      {/* Arabic verse */}
      <div style={{
        fontFamily: "'KFGQPC', 'Amiri Quran', serif",
        fontSize: '1.15rem', lineHeight: 2,
        color: accent,
        textAlign: 'right',
        direction: 'rtl',
        lang: 'ar',
      }}>
        {cmd.verseAr}
      </div>

      {/* Summary */}
      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#e8e6e3', lineHeight: 1.4 }}>
        {language === 'tr' ? cmd.summaryTr : cmd.summaryEn}
      </div>

      {/* Source ref */}
      <div>
        <span style={{
          fontSize: '0.7rem', fontWeight: 600,
          color: accent,
          background: `${accent}20`,
          border: `1px solid ${accent}55`,
          borderRadius: '20px', padding: '2px 9px',
          display: 'inline-block',
        }}>
          {cmd.surahName} · {cmd.verseRef}
        </span>
      </div>

      {/* Meal */}
      {cmd.verseTr && (
        <div style={{
          fontSize: '0.82rem', color: '#94a3b8',
          fontStyle: 'italic', lineHeight: 1.55,
          borderTop: '1px solid rgba(255,255,255,0.06)',
          paddingTop: '8px',
        }}>
          "{cmd.verseTr}"
        </div>
      )}

      {/* Academic note */}
      {cmd.note && (
        <div style={{
          fontSize: '0.73rem', color: 'rgba(148,163,184,0.7)',
          background: 'rgba(148,163,184,0.06)',
          border: '1px solid rgba(148,163,184,0.12)',
          borderRadius: '6px', padding: '7px 10px',
          lineHeight: 1.5,
          display: 'flex', gap: '6px', alignItems: 'flex-start',
        }}>
          <span style={{ flexShrink: 0 }}>ℹ</span>
          <span>{cmd.note}</span>
        </div>
      )}
    </div>
  );
}
