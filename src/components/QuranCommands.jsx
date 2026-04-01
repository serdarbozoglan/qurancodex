import { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

export default function QuranCommands({ onClose }) {
  const { language } = useLanguage();
  const [data, setData]           = useState(null);
  const [activeId, setActiveId]   = useState('ibadet');
  const [filter, setFilter]       = useState('all'); // 'all' | 'emir' | 'nehiy'
  const [expanded, setExpanded]   = useState(false);
  const [isMobile, setIsMobile]   = useState(() => window.innerWidth < 640);

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
    const h = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  // Reset expanded when category or filter changes
  useEffect(() => { setExpanded(false); }, [activeId, filter]);

  if (!data) return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: '#0d1b2a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
    disclaimer: "Bu liste Kur'an ayetlerine dayalıdır. Her madde ilgili ayetle birlikte sunulmaktadır.",
    unverified: 'Doğrulanmamış',
    note: 'Not',
    emirBadge: 'Emir',
    nehiyBadge: 'Yasak',
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
    disclaimer: 'This list is based on Quranic verses. Each item is presented with its source verse.',
    unverified: 'Unverified',
    note: 'Note',
    emirBadge: 'Command',
    nehiyBadge: 'Prohibition',
  };
  const L = language === 'tr' ? labelTr : labelEn;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: '#0d1b2a',
      overflowY: 'auto',
      fontFamily: "'Inter', sans-serif",
    }}>
      {/* Close button */}
      <button
        onClick={onClose}
        aria-label="Kapat"
        style={{
          position: 'fixed', top: '16px', right: '20px', zIndex: 201,
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
      <div style={{ padding: isMobile ? '60px 16px 20px' : '40px 32px 28px', maxWidth: '1280px', margin: '0 auto', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ marginBottom: '6px' }}>
          <span style={{ fontSize: '11px', color: 'rgba(201,169,110,0.7)', letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 600 }}>
            {language === 'tr' ? "KUR'AN'IN EMİRLERİ" : "QURAN COMMANDS"}
          </span>
        </div>
        <h1 style={{ fontSize: isMobile ? '1.4rem' : '2rem', fontWeight: 800, color: '#e8e6e3', fontFamily: "'Playfair Display', serif", marginBottom: '8px', lineHeight: 1.2 }}>
          {L.title}
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '24px' }}>
          {L.subtitle}
        </p>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {[
            { value: emirCount, label: L.emirStat, color: '#4A9EE8' },
            { value: nehiyCount, label: L.nehiyStat, color: '#E84A4A' },
            { value: categories.length, label: L.kategoriler, color: '#C9A96E' },
          ].map((stat, i) => (
            <div key={i} style={{
              background: stat.color + '12',
              border: `1px solid ${stat.color}30`,
              borderRadius: '8px', padding: '8px 16px',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <span style={{ fontSize: '1.35rem', fontWeight: 800, color: stat.color, lineHeight: 1 }}>{stat.value}</span>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 500 }}>{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <p style={{ marginTop: '16px', fontSize: '0.78rem', color: 'rgba(148,163,184,0.65)', lineHeight: 1.5 }}>
          ℹ {L.disclaimer}
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
                  flexShrink: 0, padding: '5px 12px', borderRadius: '20px',
                  border: `1px solid ${isActive ? cat.accent : 'rgba(255,255,255,0.1)'}`,
                  background: isActive ? cat.accent + '22' : 'transparent',
                  color: isActive ? cat.accent : '#94a3b8',
                  fontSize: '0.78rem', fontWeight: isActive ? 600 : 400,
                  cursor: 'pointer', transition: 'all 0.15s',
                  fontFamily: "'Inter', sans-serif",
                  display: 'flex', alignItems: 'center', gap: '5px',
                }}
              >
                <span>{cat.icon}</span>
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
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', gap: '0', minHeight: 'calc(100vh - 260px)' }}>

        {/* Sidebar — hidden on mobile, chip row above handles navigation */}
        <nav style={{
          width: '220px', flexShrink: 0,
          borderRight: '1px solid rgba(255,255,255,0.07)',
          padding: '20px 0',
          position: 'sticky', top: 0, alignSelf: 'flex-start',
          maxHeight: 'calc(100vh - 260px)', overflowY: 'auto',
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
                  fontSize: '0.82rem', fontWeight: isActive ? 600 : 400,
                  color: isActive ? cat.accent : '#94a3b8',
                  lineHeight: 1.3,
                }}>
                  <span style={{ marginRight: '6px' }}>{cat.icon}</span>
                  {language === 'tr' ? cat.titleTr : cat.titleEn}
                </span>
                <span style={{
                  fontSize: '0.7rem', fontWeight: 600,
                  color: isActive ? cat.accent : 'rgba(148,163,184,0.5)',
                  background: isActive ? cat.accent + '20' : 'rgba(255,255,255,0.05)',
                  borderRadius: '10px', padding: '1px 6px',
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
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: accent, marginBottom: '2px' }}>
                {activeCategory?.icon} {language === 'tr' ? activeCategory?.titleTr : activeCategory?.titleEn}
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'rgba(148,163,184,0.6)' }}>
                {(activeCategory?.commands || []).length} {language === 'tr' ? 'madde' : 'items'}
              </p>
            </div>

            {/* Emir / Nehiy toggle */}
            <div style={{
              display: 'flex', gap: '4px',
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '8px', padding: '3px',
            }}>
              {[
                { key: 'all', labelTr: L.allCommands, labelEn: L.allCommands },
                { key: 'emir', labelTr: L.emir, labelEn: L.emir },
                { key: 'nehiy', labelTr: L.nehiy, labelEn: L.nehiy },
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

              {/* Show more */}
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
  const typeColor = isNehiy ? '#E84A4A' : '#4A9EE8';

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderLeft: `3px solid ${accent}`,
      borderRadius: '10px',
      padding: '16px 18px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    }}>
      {/* Type badge + unverified warning */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
        <span style={{
          fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em',
          color: typeColor,
          background: typeColor + '18',
          border: `1px solid ${typeColor}35`,
          borderRadius: '4px', padding: '2px 7px',
          textTransform: 'uppercase',
        }}>
          {isNehiy ? L.nehiyBadge : L.emirBadge}
        </span>
        {!cmd.verified && (
          <span style={{
            fontSize: '0.68rem', fontWeight: 600,
            color: '#E8A24A',
            background: 'rgba(232,162,74,0.12)',
            border: '1px solid rgba(232,162,74,0.3)',
            borderRadius: '4px', padding: '2px 7px',
            display: 'flex', alignItems: 'center', gap: '3px',
          }}>
            ⚠️ {L.unverified}
          </span>
        )}
      </div>

      {/* Arabic verse */}
      <div style={{
        fontFamily: "'Amiri', serif",
        fontSize: '18px', lineHeight: 1.9,
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

      {/* Sure ref */}
      <div style={{ fontSize: '0.75rem', color: 'rgba(148,163,184,0.65)', fontWeight: 500 }}>
        {cmd.surahName} · {cmd.verseRef}
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
