'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS, BREAKPOINT_MOBILE, TRANSITION, RADIUS } from '../tokens';
import { AlertTriangleIcon } from './icons';
import ToolHeader from './ToolHeader';
import CrossToolCTA from './CrossToolCTA';

// ── Category SVG Icons (20×20, thin stroke, amber) ──────────────────────────
const CATEGORY_ICONS = {
  ibadet: (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3C10 7 6 8 6 12s6 6 6 6 6-2 6-6-4-5-6-9z"/>
      <line x1="12" y1="18" x2="12" y2="21"/>
    </svg>
  ),
  aile: (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="7" r="2.5"/>
      <circle cx="16" cy="7" r="2"/>
      <path d="M2 21c0-4 3-6 7-6h2c4 0 7 2 7 6"/>
      <path d="M16 9c2.5 0 5 1.5 5 5"/>
    </svg>
  ),
  ahlak: (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="3" x2="12" y2="21"/>
      <path d="M5 8h7m-7 0l-2 5c0 2 2 3 4 3s4-1 4-3L12 8"/>
      <path d="M19 8h-7m7 0l2 5c0 2-2 3-4 3s-4-1-4-3l2-5"/>
    </svg>
  ),
  mal: (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/>
      <path d="M12 6v2m0 8v2"/>
      <path d="M9.5 9.5A2.5 2.5 0 0 1 12 8c1.5 0 2.5 1 2.5 2.3 0 2.7-5 2.4-5 5.2 0 1.4 1 2.5 2.5 2.5s2.5-1 2.5-2.5"/>
    </svg>
  ),
  bilgi: (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10"/>
      <path d="M4 19h16"/>
      <line x1="8" y1="10" x2="16" y2="10"/>
      <line x1="8" y1="14" x2="13" y2="14"/>
    </svg>
  ),
  yasaklar: (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l8 4v5c0 5-4 9-8 10C8 21 4 17 4 12V7l8-4z"/>
      <line x1="9" y1="12" x2="15" y2="12"/>
    </svg>
  ),
  'sosyal-adalet': (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 11V9a4 4 0 0 0-8 0v2"/>
      <path d="M6 11v2a4 4 0 0 0 4 4h4a4 4 0 0 0 4-4v-2"/>
      <path d="M12 15v3m-3 2h6"/>
    </svg>
  ),
  iletisim: (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
  emir:  { bg: COLORS.softGoldAlpha15, border: COLORS.softGoldAlpha35, color: COLORS.softGold },
  nehiy: { bg: 'rgba(232,90,74,0.15)', border: 'rgba(232,90,74,0.35)', color: '#e85a4a' },
};

export default function QuranCommands({ onClose }) {
  const { language } = useLanguage();
  const [data, setData]           = useState(null);
  const [activeId, setActiveId]   = useState('ibadet');
  const [filter, setFilter]       = useState('all'); // 'all' | 'emir' | 'nehiy'
  const [expanded, setExpanded]   = useState(false);
  const [isMobile, setIsMobile]   = useState(false)  // SSR-safe; useEffect h() post-mount hydrate;

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
    const h = () => setIsMobile(window.innerWidth < BREAKPOINT_MOBILE);
    h(); // post-mount hydrate
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  // Reset expanded when category or filter changes
  /* eslint-disable react-hooks/set-state-in-effect -- resetting derived state on dep change */
  useEffect(() => { setExpanded(false); }, [activeId, filter]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // #202 (2026-07-16) — CTA hem loading skeleton'da hem main return'de görünsün (SSR SEO)
  const RELATED_CTA = (
    <div style={{ maxWidth: 1080, margin: '0 auto', padding: isMobile ? '24px 16px 32px' : '40px 24px 48px', width: '100%' }}>
      <CrossToolCTA
        language={language}
        isMobile={isMobile}
        links={[
          { href: `/${language}/atlas/ibadetler`, titleTr: 'İbadetler Atlası', titleEn: 'Worship Atlas', descTr: 'Emirlerin uygulaması — namaz, oruç, zekât, hac, kurban, tevbe, zikir.', descEn: 'Application of commands — prayer, fasting, zakāt, hajj, sacrifice, repentance, dhikr.' },
          { href: `/${language}/arac/sebebi-nuzul`, titleTr: 'Sebeb-i Nüzûl', titleEn: 'Occasions of Revelation', descTr: 'Emirlerin iniş bağlamı — hangi olay hangi hükmü doğurdu.', descEn: 'Revelation context of commands — which event birthed which ruling.' },
          { href: `/${language}/arac/muhataplar`, titleTr: 'Muhataplar', titleEn: 'Addressees', descTr: 'Emirlerin kime yönelik olduğu — müminler, ehl-i kitap, insanlık.', descEn: 'Who commands are addressed to — believers, People of the Book, humanity.' },
        ]}
      />
    </div>
  );

  if (!data) return (
    <div style={{ background: COLORS.cosmicBlack, minHeight: 'calc(100vh - 62px)', paddingTop: '62px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: COLORS.silver, fontFamily: "'Inter', sans-serif" }}>{language === 'tr' ? 'Yükleniyor…' : 'Loading…'}</div>
      </div>
      {RELATED_CTA}
    </div>
  );

  const categories = data.categories || [];
  const activeCategory = categories.find(c => c.id === activeId) || categories[0];
  const accent = activeCategory?.accent || COLORS.softGold;

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
      background: COLORS.cosmicBlack,
      minHeight: 'calc(100vh - 62px)',
      paddingTop: '62px',
      fontFamily: "'Inter', sans-serif",
    }}>
      <ToolHeader
        icon={<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>}
        titleTr="Kur'an'ın Emirleri"
        titleEn="Quran Commands"
        subtitleTr="Emir · nehiy · 5 hüküm"
        subtitleEn="Command · prohibition · 5 rulings"
        language={language}
      />

      {/* Header — Cinematic Hero (Bismillah + Nahl 16:90 anchor + framing + filigree) */}
      <div style={{ padding: isMobile ? '56px 16px 28px' : '60px 32px 36px', maxWidth: '1280px', margin: '0 auto', borderBottom: '1px solid rgba(255,255,255,0.07)', textAlign: 'center' }}>
        {/* Bismillah */}
        <div
          dir="rtl" lang="ar" aria-label="Bismillāh"
          style={{
            fontFamily: FONTS.bismillah,
            fontSize: isMobile ? '1.5rem' : '1.95rem',
            color: COLORS.gold,
            opacity: 0.82,
            lineHeight: 1,
            marginBottom: isMobile ? '28px' : '40px',
            textShadow: `0 0 22px ${COLORS.gold}28`,
          }}
        >
          ﷽
        </div>

        {/* Anchor verse — Nahl 16:90 (canonical command/prohibition verse) */}
        <p
          dir="rtl" lang="ar"
          style={{
            fontFamily: FONTS.quran,
            fontSize: isMobile ? 'clamp(1.05rem, 4.2vw, 1.4rem)' : 'clamp(1.25rem, 2.3vw, 1.65rem)',
            color: COLORS.gold,
            lineHeight: 2.1,
            margin: '0 auto 16px',
            maxWidth: '820px',
            textShadow: `0 0 20px ${COLORS.gold}1c`,
          }}
        >
          اِنَّ اللّٰهَ يَأْمُرُ بِالْعَدْلِ وَالْاِحْسَانِ وَاِيتَٓاءِ ذِي الْقُرْبٰى وَيَنْهٰى عَنِ الْفَحْشَٓاءِ وَالْمُنْكَرِ وَالْبَغْيِ
        </p>

        <p style={{
          color: COLORS.offWhite,
          fontFamily: FONTS.display,
          fontStyle: 'italic',
          fontSize: isMobile ? '0.94rem' : 'clamp(0.95rem, 1.6vw, 1.05rem)',
          lineHeight: 1.7,
          margin: '0 auto 8px',
          maxWidth: '660px',
          opacity: 0.95,
        }}>
          "{language === 'tr'
            ? 'Şüphesiz Allah adaleti, iyiliği ve akrabaya yardımı emreder; çirkin işleri, fenalığı ve azgınlığı da yasaklar.'
            : 'Indeed, Allah commands justice, kindness, and giving to relatives; and He forbids indecency, evil, and oppression.'}"
        </p>

        <p style={{
          color: COLORS.silver,
          fontFamily: "'Inter', sans-serif",
          fontSize: '0.72rem',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          margin: '0 0 36px',
          opacity: 0.65,
        }}>
          — {language === 'tr' ? 'Nahl 16:90' : 'An-Naḥl 16:90'}
        </p>

        {/* Framing whisper */}
        <p style={{
          color: COLORS.silver,
          fontFamily: FONTS.display,
          fontStyle: 'italic',
          fontSize: isMobile ? '0.92rem' : 'clamp(0.95rem, 1.55vw, 1.02rem)',
          lineHeight: 1.7,
          margin: '0 auto 40px',
          maxWidth: '700px',
          opacity: 0.88,
        }}>
          {language === 'tr'
            ? <>Kur'an iki kanatla yürür: <em style={{ fontStyle: 'normal', color: COLORS.gold, opacity: 0.95 }}>emir</em> (`if'al`) ve <em style={{ fontStyle: 'normal', color: COLORS.gold, opacity: 0.95 }}>nehiy</em> (`lā taf'al`). Klasik fıkıh bu çifti beş hükme açar: vâcip, mendûb, mubâh, mekrûh, harâm.</>
            : <>The Quran walks on two wings: <em style={{ fontStyle: 'normal', color: COLORS.gold, opacity: 0.95 }}>command</em> (`if'al`) and <em style={{ fontStyle: 'normal', color: COLORS.gold, opacity: 0.95 }}>prohibition</em> (`lā taf'al`). Classical fiqh unfolds this pair into five rulings: wājib, mandūb, mubāḥ, makrūh, ḥarām.</>}
        </p>

        {/* Filigree divider */}
        <div aria-hidden="true" style={{
          width: '120px',
          height: '1px',
          background: `linear-gradient(to right, transparent, ${COLORS.gold}66, transparent)`,
          margin: '0 auto 32px',
        }} />

        {/* Eyebrow */}
        <div style={{ marginBottom: '12px' }}>
          <span style={{ fontSize: '0.68rem', color: COLORS.gold, letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 700, opacity: 0.72, fontFamily: "'Inter', sans-serif" }}>
            {language === 'tr' ? "KUR'AN'IN EMİRLERİ · 5 HÜKÜM" : "QURAN COMMANDS · 5 RULINGS"}
          </span>
        </div>

        <h2 style={{
          fontFamily: FONTS.display,
          fontSize: isMobile ? 'clamp(1.6rem, 7vw, 2rem)' : 'clamp(2rem, 3.6vw, 2.7rem)',
          fontWeight: 700,
          color: COLORS.offWhite,
          margin: '0 auto 14px',
          lineHeight: 1.18,
          letterSpacing: '-0.015em',
          maxWidth: '780px',
        }}>
          {L.title}
        </h2>
        <p style={{
          fontFamily: FONTS.display,
          fontSize: isMobile ? '1rem' : 'clamp(1.05rem, 1.8vw, 1.18rem)',
          color: COLORS.gold,
          margin: '0 auto 22px',
          lineHeight: 1.55,
          fontStyle: 'italic',
          maxWidth: '700px',
          opacity: 0.92,
        }}>
          {L.subtitle}
        </p>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '14px' }}>
          <div style={{
            background: COLORS.softGoldAlpha10, border: `1px solid ${COLORS.softGoldAlpha28}`,
            borderRadius: RADIUS.md, padding: '7px 14px',
            display: 'flex', alignItems: 'center', gap: '7px',
          }}>
            <span style={{ fontSize: '1.3rem', fontWeight: 800, color: COLORS.softGold, lineHeight: 1 }}>{emirCount}</span>
            <span style={{ fontSize: '0.75rem', color: COLORS.silver, fontWeight: 500 }}>{L.emirStat}</span>
          </div>
          <div style={{
            background: 'rgba(232,90,74,0.1)', border: '1px solid rgba(232,90,74,0.28)',
            borderRadius: RADIUS.md, padding: '7px 14px',
            display: 'flex', alignItems: 'center', gap: '7px',
          }}>
            <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#e85a4a', lineHeight: 1 }}>{nehiyCount}</span>
            <span style={{ fontSize: '0.75rem', color: COLORS.silver, fontWeight: 500 }}>{L.nehiyStat}</span>
          </div>
          <div style={{
            background: 'rgba(74,158,232,0.08)', border: '1px solid rgba(74,158,232,0.22)',
            borderRadius: RADIUS.md, padding: '7px 14px',
            display: 'flex', alignItems: 'center', gap: '7px',
          }}>
            <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#4A9EE8', lineHeight: 1 }}>{categories.length}</span>
            <span style={{ fontSize: '0.75rem', color: COLORS.silver, fontWeight: 500 }}>{L.kategoriler}</span>
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
                  flexShrink: 0, padding: '6px 12px', borderRadius: RADIUS.pillSm,
                  border: `1px solid ${isActive ? cat.accent : 'rgba(255,255,255,0.1)'}`,
                  background: isActive ? cat.accent + '22' : 'transparent',
                  color: isActive ? cat.accent : '#94a3b8',
                  fontSize: '0.78rem', fontWeight: isActive ? 600 : 400,
                  cursor: 'pointer', transition: `all ${TRANSITION.fast}`,
                  fontFamily: "'Inter', sans-serif",
                  display: 'flex', alignItems: 'center', gap: '5px',
                }}
              >
                <CategoryIcon id={cat.id} color={isActive ? cat.accent : '#64748b'} />
                <span>{language === 'tr' ? cat.titleTr : cat.titleEn}</span>
                <span style={{
                  background: isActive ? cat.accent + '30' : 'rgba(255,255,255,0.08)',
                  color: isActive ? cat.accent : '#64748b',
                  borderRadius: RADIUS.chip, padding: '0 5px',
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
          position: 'sticky', top: '110px', alignSelf: 'flex-start',
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
                  border: 'none',
                  borderLeft: isActive ? `3px solid ${cat.accent}` : '3px solid transparent',
                  cursor: 'pointer',
                  transition: `all ${TRANSITION.fast}`, textAlign: 'left',
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
                  borderRadius: RADIUS.chip, padding: '1px 7px',
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
              borderRadius: RADIUS.md, padding: '3px',
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
                    transition: `all ${TRANSITION.fast}`,
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
            <p style={{ color: COLORS.silver, fontSize: '0.9rem', textAlign: 'center', padding: '40px 0' }}>
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
                      borderRadius: RADIUS.md,
                      color: accent,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      transition: `all ${TRANSITION.fast}`,
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
      {RELATED_CTA}
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
        borderRadius: RADIUS.chip,
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
          borderRadius: RADIUS.pillSm, padding: '2px 9px',
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
            borderRadius: RADIUS.pillSm, padding: '2px 8px',
            display: 'flex', alignItems: 'center', gap: '3px',
          }}>
            <AlertTriangleIcon size={10} strokeWidth={2.5} />
            {L.unverified}
          </span>
        )}
      </div>

      {/* Arabic verse */}
      <div dir="rtl" lang="ar" style={{
        fontFamily: FONTS.quran,
        fontSize: 'clamp(1.2rem, 1.8vw, 1.45rem)', lineHeight: 2,
        color: accent,
        textAlign: 'right',
        direction: 'rtl',
      }}>
        {cmd.verseAr}
      </div>

      {/* Summary */}
      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: COLORS.offWhite, lineHeight: 1.4 }}>
        {language === 'tr' ? cmd.summaryTr : cmd.summaryEn}
      </div>

      {/* Source ref */}
      <div>
        <span style={{
          fontSize: '0.7rem', fontWeight: 600,
          color: accent,
          background: `${accent}20`,
          border: `1px solid ${accent}55`,
          borderRadius: RADIUS.pillSm, padding: '2px 9px',
          display: 'inline-block',
        }}>
          {cmd.surahName} · {cmd.verseRef}
        </span>
      </div>

      {/* Meal */}
      {cmd.verseTr && (
        <div style={{
          fontSize: '0.82rem', color: COLORS.silver,
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
          borderRadius: RADIUS.sm, padding: '7px 10px',
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
