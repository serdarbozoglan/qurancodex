'use client';

import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { CLOSE_BTN, OVERLAY_TITLE, FONTS, COLORS, TRANSITION, BREAKPOINT_TABLET, RADIUS } from '../tokens';

// ── Color system ──────────────────────────────────────────────────────────────
const CENNET   = { accent: '#1D9E75', bg: 'rgba(27,110,86,0.12)',   border: 'rgba(29,158,117,0.28)' };
const CEHENNEM = { accent: '#D85A30', bg: 'rgba(153,60,29,0.12)',   border: 'rgba(216,90,48,0.28)' };
const ARAF     = { accent: COLORS.softGold, bg: COLORS.softGoldAlpha10, border: COLORS.softGoldAlpha28 };
const HAPAX    = '#8b5cf6';
const GOLD     = COLORS.softGold;

// ── Reusable components ───────────────────────────────────────────────────────
function HadisBadge({ language }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '3px',
      fontSize: '0.65rem', fontWeight: 600,
      color: COLORS.softGoldAlpha75,
      background: COLORS.softGoldAlpha08,
      border: `1px solid ${COLORS.softGoldAlpha20}`,
      borderRadius: RADIUS.pillSm, padding: '1px 7px',
    }}>
      ℹ {language === 'tr' ? 'Hadis' : 'Hadith'}
    </span>
  );
}

function HapaxBadge({ language }) {
  const [show, setShow] = useState(false);
  const tip = language === 'tr'
    ? 'Hapax legomenon: Kur\'an\'da yalnızca bir kez geçen kelime. Anlam ve kök tartışmalıdır.'
    : 'Hapax legomenon: A word that appears only once in the Quran. Its meaning and root are debated.';
  return (
    <span
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: '4px',
        fontSize: '0.65rem', fontWeight: 700,
        color: HAPAX,
        background: 'rgba(139,92,246,0.1)',
        border: '1px solid rgba(139,92,246,0.3)',
        borderRadius: RADIUS.pillSm, padding: '1px 7px',
        textTransform: 'uppercase', letterSpacing: '0.05em',
        cursor: 'default',
      }}>
        Hapax
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ opacity: 0.75, flexShrink: 0 }}>
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </span>
      {show && (
        <span style={{
          position: 'absolute', bottom: 'calc(100% + 6px)', left: '50%',
          transform: 'translateX(-50%)',
          background: '#1e1b2e',
          border: '1px solid rgba(139,92,246,0.4)',
          borderRadius: RADIUS.md,
          padding: '8px 12px',
          fontSize: '0.75rem',
          color: '#c4b5fd',
          lineHeight: 1.5,
          whiteSpace: 'normal',
          width: '220px',
          zIndex: 100,
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          pointerEvents: 'none',
        }}>
          {tip}
        </span>
      )}
    </span>
  );
}

function VerseBlock({ ar, tr, en, kaynak, language, color }) {
  const c = color || GOLD;
  return (
    <div style={{
      background: `${c}08`,
      border: `1px solid ${c}25`,
      borderRight: `3px solid ${c}`,
      borderRadius: RADIUS.md,
      padding: '14px 16px',
      marginBottom: '12px',
      direction: 'rtl',
    }}>
      <p style={{ fontFamily: FONTS.quran, fontSize: '1.3rem', color: c, lineHeight: 2, margin: '0 0 8px', textAlign: 'right', direction: 'rtl', lang: 'ar' }}>
        {ar}
      </p>
      <p style={{ fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic', margin: '0 0 4px', direction: 'ltr', textAlign: 'left' }}>
        {language === 'tr' ? tr : en}
      </p>
      <p style={{ fontSize: '0.72rem', color: `${c}99`, fontWeight: 600, margin: 0, direction: 'ltr', textAlign: 'left' }}>
        — {kaynak}
      </p>
    </div>
  );
}

function SectionTitle({ children, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', marginTop: '28px' }}>
      <div style={{ width: '3px', height: '18px', background: color || GOLD, borderRadius: '2px', flexShrink: 0 }} />
      <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#e8e6e3', margin: 0, fontFamily: "'Inter', sans-serif" }}>
        {children}
      </h3>
    </div>
  );
}

function InfoNote({ text }) {
  return (
    <div style={{
      display: 'flex', gap: '6px', alignItems: 'flex-start',
      fontSize: '0.73rem', color: 'rgba(148,163,184,0.7)',
      background: 'rgba(148,163,184,0.05)',
      border: '1px solid rgba(148,163,184,0.12)',
      borderRadius: RADIUS.sm, padding: '8px 10px',
      lineHeight: 1.55,
    }}>
      <span style={{ flexShrink: 0, marginTop: '1px' }}>ℹ</span>
      <span>{text}</span>
    </div>
  );
}

// ── TABS definition ───────────────────────────────────────────────────────────
const TABS = [
  { id: 'isimler',   labelTr: 'İsimler',       labelEn: 'Names',        icon: '📖' },
  { id: 'cennet',    labelTr: 'Cennet',         labelEn: 'Paradise',     icon: '🌿' },
  { id: 'cehennem',  labelTr: 'Cehennem',       labelEn: 'Hell',         icon: '🔥' },
  { id: 'araf',      labelTr: "A'râf",          labelEn: "A'raf",        icon: '⚖️' },
  { id: 'rahman',    labelTr: 'Rahman Simetrisi', labelEn: 'Al-Rahman Symmetry', icon: '↔️' },
  { id: 'kaynaklar', labelTr: 'Kaynaklar',      labelEn: 'Sources',      icon: '📚' },
];

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function CennetCehennem({ onClose }) {
  const { language } = useLanguage();
  const [data, setData]           = useState(null);
  const [activeTab, setActiveTab] = useState('isimler');
  const [isMobile, setIsMobile]   = useState(false)  // SSR-safe; useEffect h() post-mount hydrate;
  const bodyRef = useRef(null);

  useEffect(() => {
    fetch('/cennet-cehennem.json')
      .then(r => r.json())
      .then(d => setData(d))
      .catch(() => {});

    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < BREAKPOINT_TABLET);
    h(); // post-mount hydrate
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  // Scroll content to top on tab change
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
  }, [activeTab]);

  if (!data) return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#06080e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#94a3b8', fontFamily: "'Inter', sans-serif" }}>
        {language === 'tr' ? 'Yükleniyor...' : 'Loading...'}
      </div>
    </div>
  );

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: '#06080e',
      display: 'flex', flexDirection: 'column',
      fontFamily: "'Inter', sans-serif",
    }}>
      {/* ── HEADER ────────────────────────────────────────────────── */}
      <div style={{
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        background: 'rgba(6,8,14,0.96)',
        backdropFilter: 'blur(16px)',
        flexShrink: 0,
      }}>
        {/* Top row: title + close */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: isMobile ? '10px 14px' : '0 20px',
          height: isMobile ? 'auto' : '52px',
        }}>
          {/* FlameIcon — matches exploreCategories.jsx for navbar/header consistency */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
          </svg>
          <span style={OVERLAY_TITLE}>
            {language === 'tr' ? 'Cennet & Cehennem' : 'Paradise & Hell'}
          </span>
          <div style={{ flex: 1 }} />
          <button
            onClick={onClose}
            style={{ ...CLOSE_BTN }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#e8e6e3'; }}
            onMouseLeave={e => { e.currentTarget.style.background = CLOSE_BTN.background; e.currentTarget.style.color = '#94a3b8'; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tab bar */}
        <div style={{
          display: 'flex', gap: '2px',
          padding: isMobile ? '0 8px' : '0 16px',
          borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
          background: 'rgba(10,10,26,0.97)',
          backdropFilter: 'blur(20px)',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          flexShrink: 0,
        }}>
          {TABS.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: isMobile ? '12px 14px' : '13px 22px',
                  border: 'none', borderRadius: '0', flexShrink: 0,
                  borderBottom: isActive ? `2px solid ${COLORS.gold}` : '2px solid transparent',
                  background: isActive ? COLORS.goldAlpha15 : 'transparent',
                  color: isActive ? COLORS.gold : COLORS.silver,
                  fontSize: isMobile ? '0.85rem' : '0.9rem',
                  fontWeight: isActive ? 600 : 400,
                  cursor: 'pointer', transition: `all ${TRANSITION.fast}`,
                  fontFamily: FONTS.body,
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = COLORS.offWhite; } }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = COLORS.silver; } }}
              >
                <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{tab.icon}</span>
                {!isMobile && <span>{language === 'tr' ? tab.labelTr : tab.labelEn}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── BODY ──────────────────────────────────────────────────── */}
      <div ref={bodyRef} style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '16px 14px 48px' : '24px 32px 48px' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>

          {/* ── HERO BANNER ─────────────────────────────────────── */}
          <HeroBanner data={data} language={language} isMobile={isMobile} />

          {activeTab === 'isimler'   && <TabIsimler   data={data} language={language} isMobile={isMobile} />}
          {activeTab === 'cennet'    && <TabCennet    data={data} language={language} isMobile={isMobile} />}
          {activeTab === 'cehennem'  && <TabCehennem  data={data} language={language} isMobile={isMobile} />}
          {activeTab === 'araf'      && <TabAraf      data={data} language={language} isMobile={isMobile} />}
          {activeTab === 'rahman'    && <TabRahman    data={data} language={language} isMobile={isMobile} />}
          {activeTab === 'kaynaklar' && <TabKaynaklar data={data} language={language} isMobile={isMobile} />}

        </div>
      </div>
    </div>
  );
}

// ── TAB 1: İSİMLER ────────────────────────────────────────────────────────────
function TabIsimler({ data, language, isMobile }) {
  const tr = language === 'tr';
  const cennetIsimleri   = data.cennetIsimleri   || [];
  const cehennemIsimleri = data.cehennemIsimleri || [];

  return (
    <div>
      {/* Hero intro */}
      <div style={{ marginBottom: '28px' }}>
        <p style={{ fontSize: '0.98rem', color: '#94a3b8', lineHeight: 1.8, maxWidth: '680px' }}>
          {tr
            ? "Kur'an cenneti de cehennemi de tek isimle değil, her biri farklı bir anlam boyutu taşıyan birden fazla isimle anlatır. Her isim, öteki alemin ayrı bir yüzünü aydınlatır."
            : "The Quran describes both Paradise and Hell not with a single name, but with multiple names — each carrying a distinct dimension of meaning. Every name illuminates a different facet of the afterlife."}
        </p>
      </div>

      {/* Two-column grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: '24px',
      }}>
        {/* Cennet column */}
        <div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            marginBottom: '16px', paddingBottom: '10px',
            borderBottom: `2px solid ${CENNET.accent}40`,
          }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: CENNET.accent }} />
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: CENNET.accent, margin: 0 }}>
              {tr ? `Cennetin ${cennetIsimleri.length} İsmi` : `${cennetIsimleri.length} Names of Paradise`}
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {cennetIsimleri.map(item => (
              <IsimCard key={item.id} item={item} language={language} color={CENNET.accent} bg={CENNET.bg} border={CENNET.border} />
            ))}
          </div>
        </div>

        {/* Cehennem column */}
        <div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            marginBottom: '16px', paddingBottom: '10px',
            borderBottom: `2px solid ${CEHENNEM.accent}40`,
          }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: CEHENNEM.accent }} />
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: CEHENNEM.accent, margin: 0 }}>
              {tr ? `Cehennemin ${cehennemIsimleri.length} İsmi` : `${cehennemIsimleri.length} Names of Hell`}
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {cehennemIsimleri.map(item => (
              <IsimCard key={item.id} item={item} language={language} color={CEHENNEM.accent} bg={CEHENNEM.bg} border={CEHENNEM.border} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function IsimCard({ item, language, color, bg, border }) {
  const tr = language === 'tr';
  return (
    <div style={{
      background: bg,
      border: `1px solid ${border}`,
      borderRadius: RADIUS.chip,
      padding: '14px 16px',
    }}>
      {/* Arabic name */}
      <p style={{
        fontFamily: FONTS.quran,
        fontSize: '1.4rem', lineHeight: 1.8,
        color: GOLD,
        textAlign: 'right', direction: 'rtl', lang: 'ar',
        margin: '0 0 6px',
      }}>
        {item.nameAr}
      </p>

      {/* Turkish/English name + meaning */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
        <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#e8e6e3' }}>
          {tr ? item.nameTr : item.nameEn}
        </span>
        <span style={{
          fontSize: '0.7rem', fontWeight: 600, color: color,
          background: `${color}18`, border: `1px solid ${color}35`,
          borderRadius: RADIUS.pillSm, padding: '1px 8px', flexShrink: 0,
        }}>
          {tr ? item.frequency : item.frequencyEn}
        </span>
      </div>

      <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 8px', fontStyle: 'italic' }}>
        {tr ? item.meaningTr : item.meaningEn}
      </p>

      {/* Source */}
      <p style={{ fontSize: '0.72rem', color: `${color}90`, margin: '0 0 8px', fontWeight: 500 }}>
        {tr ? item.kaynak : item.kaynakEn}
      </p>

      {/* Note */}
      {(tr ? item.notTr : item.notEn) && (
        <p style={{ fontSize: '0.78rem', color: 'rgba(148,163,184,0.75)', lineHeight: 1.55, margin: '0 0 6px' }}>
          {tr ? item.notTr : item.notEn}
        </p>
      )}

      {/* Badges */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {item.isHadis && <HadisBadge language={language} />}
        {item.isTartismaali && (
          <span style={{
            fontSize: '0.65rem', fontWeight: 600,
            color: 'rgba(148,163,184,0.6)',
            background: 'rgba(148,163,184,0.07)',
            border: '1px solid rgba(148,163,184,0.15)',
            borderRadius: RADIUS.pillSm, padding: '1px 7px',
          }}>
            {language === 'tr' ? 'Tartışmalı' : 'Disputed'}
          </span>
        )}
      </div>
    </div>
  );
}

// ── STAT PILL ────────────────────────────────────────────────────────────────
function StatPill({ value, label, color, isMobile }) {
  return (
    <div style={{
      background: 'rgba(0,0,0,0.25)',
      borderRadius: RADIUS.md,
      padding: isMobile ? '8px 10px' : '10px 14px',
      textAlign: 'center',
      minWidth: '60px',
    }}>
      <div style={{ fontSize: isMobile ? '1.1rem' : '1.3rem', fontWeight: 800, color, lineHeight: 1.1 }}>{value}</div>
      <div style={{ fontSize: '0.62rem', color: '#475569', marginTop: '2px', letterSpacing: '0.04em' }}>{label}</div>
    </div>
  );
}

// ── HERO BANNER ───────────────────────────────────────────────────────────────
function HeroBanner({ data, language, isMobile }) {
  const tr = language === 'tr';
  const cennetCount  = data.cennetIsimleri?.length  ?? 9;
  const cehennemCount = data.cehennemIsimleri?.length ?? 7;

  return (
    <div style={{
      display: isMobile ? 'flex' : 'grid',
      flexDirection: isMobile ? 'column' : undefined,
      gridTemplateColumns: isMobile ? undefined : '1fr 260px 1fr',
      marginBottom: '28px',
      borderRadius: RADIUS.xl,
      overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.08)',
    }}>
      {/* Left: Cennet */}
      <div style={{ background: CENNET.bg, padding: isMobile ? '16px' : '24px 28px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '14px' }}>
        <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: CENNET.accent }}>
          {tr ? 'Cennet' : 'Paradise'}
        </div>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <StatPill value={cennetCount}  label={tr ? 'İsim' : 'Names'}   color={CENNET.accent} isMobile={isMobile} />
          <StatPill value="~147"         label={tr ? 'Ayet' : 'Verses'}  color={CENNET.accent} isMobile={isMobile} />
          <StatPill value={4}            label={tr ? 'Nehir' : 'Rivers'} color={CENNET.accent} isMobile={isMobile} />
        </div>
      </div>

      {/* Center: verse + meal */}
      {!isMobile ? (
        <div style={{
          background: COLORS.softGoldAlpha04,
          borderLeft: '1px solid rgba(255,255,255,0.07)',
          borderRight: '1px solid rgba(255,255,255,0.07)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '20px 24px', gap: '10px',
        }}>
          <div style={{
            fontFamily: FONTS.quran, fontSize: '1.55rem', color: GOLD,
            direction: 'rtl', textAlign: 'center', lineHeight: 1.9, lang: 'ar',
          }}>
            وَبَيْنَهُمَا حِجَابٌ
          </div>
          <div style={{
            fontSize: '0.78rem', color: '#94a3b8', textAlign: 'center',
            fontStyle: 'italic', lineHeight: 1.5, maxWidth: '220px',
          }}>
            {tr
              ? '"İkisi arasında bir perde vardır."'
              : '"Between them is a barrier."'}
          </div>
          <div style={{ fontSize: '0.68rem', color: `${GOLD}70`, fontWeight: 600, letterSpacing: '0.04em' }}>
            {tr ? "A'râf 7:46" : "Al-A'raf 7:46"}
          </div>
        </div>
      ) : (
        <div style={{
          background: COLORS.softGoldAlpha04,
          borderTop: '1px solid rgba(255,255,255,0.07)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', padding: '16px 24px', gap: '8px',
        }}>
          <div style={{ fontFamily: FONTS.quran, fontSize: '1.3rem', color: GOLD, direction: 'rtl', textAlign: 'center', lineHeight: 1.9, lang: 'ar' }}>
            وَبَيْنَهُمَا حِجَابٌ
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic', textAlign: 'center' }}>
            {tr ? '"İkisi arasında bir perde vardır."' : '"Between them is a barrier."'}
          </div>
          <div style={{ fontSize: '0.65rem', color: `${GOLD}70`, fontWeight: 600 }}>
            {tr ? "A'râf 7:46" : "Al-A'raf 7:46"}
          </div>
        </div>
      )}

      {/* Right: Cehennem */}
      <div style={{
        background: CEHENNEM.bg,
        padding: isMobile ? '16px' : '24px 28px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '14px',
      }}>
        <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: CEHENNEM.accent }}>
          {tr ? 'Cehennem' : 'Hell'}
        </div>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <StatPill value={cehennemCount} label={tr ? 'İsim' : 'Names'}   color={CEHENNEM.accent} isMobile={isMobile} />
          <StatPill value="~77"           label={tr ? 'Ayet' : 'Verses'}  color={CEHENNEM.accent} isMobile={isMobile} />
          <StatPill value={19}            label={tr ? 'Melek' : 'Angels'} color={CEHENNEM.accent} isMobile={isMobile} />
        </div>
      </div>
    </div>
  );
}

// ── TAB 2: CENNET ─────────────────────────────────────────────────────────────
function TabCennet({ data, language, isMobile }) {
  const tr = language === 'tr';
  const d = data.cennetDetaylari || {};

  return (
    <div>
      {/* Section A — Nehirler */}
      <SectionTitle color={CENNET.accent}>
        {tr ? 'A. Cennetin 4 Nehri' : 'A. The 4 Rivers of Paradise'}
      </SectionTitle>
      <VerseBlock
        ar="فِيهَا أَنْهَارٌ مِّن مَّاءٍ غَيْرِ آسِنٍ وَأَنْهَارٌ مِّن لَّبَنٍ لَّمْ يَتَغَيَّرْ طَعْمُهُ وَأَنْهَارٌ مِّنْ خَمْرٍ لَّذَّةٍ لِّلشَّارِبِينَ وَأَنْهَارٌ مِّنْ عَسَلٍ مُّصَفًّى"
        tr="İçinde bozulmayan sudan ırmaklar, tadı değişmeyen sütten ırmaklar, içenlere lezzet veren şaraptan ırmaklar ve arıtılmış baldan ırmaklar bulunur."
        en="In it are rivers of water unaltered, rivers of milk of which the taste never changes, rivers of wine delicious to those who drink, and rivers of purified honey."
        kaynak="Muhammed 47:15"
        language={language}
        color={CENNET.accent}
      />
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
        gap: '10px',
        marginBottom: '8px',
      }}>
        {(d.nehirler || []).map(n => (
          <div key={n.id} style={{
            background: CENNET.bg,
            border: `1px solid ${CENNET.border}`,
            borderRadius: RADIUS.chip, padding: '12px 14px',
            textAlign: 'center',
          }}>
            <p style={{ fontFamily: FONTS.quran, fontSize: '1.2rem', color: GOLD, textAlign: 'right', direction: 'rtl', lang: 'ar', margin: '0 0 6px' }}>{n.nameAr}</p>
            <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#e8e6e3', margin: '0 0 4px' }}>{tr ? n.nameTr : n.nameEn}</p>
            <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 4px', lineHeight: 1.4 }}>{tr ? n.descTr : n.descEn}</p>
            {n.notTr && <p style={{ fontSize: '0.7rem', color: 'rgba(148,163,184,0.5)', fontStyle: 'italic', margin: 0, lineHeight: 1.4 }}>{tr ? n.notTr : n.notEn}</p>}
          </div>
        ))}
      </div>

      {/* Section B — Bitkiler */}
      <SectionTitle color={CENNET.accent}>
        {tr ? 'B. Cennet Bitkileri & Pınarları' : 'B. Plants & Springs of Paradise'}
      </SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '10px', marginBottom: '8px' }}>
        {(d.bitkiler || []).map(b => (
          <div key={b.id} style={{
            background: 'rgba(255,255,255,0.03)',
            border: `1px solid ${b.isHapax ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.08)'}`,
            borderLeft: `2px solid ${b.isHapax ? HAPAX : CENNET.accent}`,
            borderRadius: RADIUS.chip, padding: '12px 14px',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '6px' }}>
              <p style={{ fontFamily: FONTS.quran, fontSize: '1.2rem', color: GOLD, textAlign: 'right', direction: 'rtl', lang: 'ar', margin: 0 }}>{b.nameAr}</p>
              <div style={{ display: 'flex', gap: '4px', flexShrink: 0, marginTop: '4px' }}>
                {b.isHapax && <HapaxBadge language={language} />}
              </div>
            </div>
            <p style={{ fontSize: '0.88rem', fontWeight: 700, color: '#e8e6e3', margin: '0 0 4px' }}>{tr ? b.nameTr : b.nameEn}</p>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '0 0 6px', lineHeight: 1.5 }}>{tr ? b.descTr : b.descEn}</p>
            <p style={{ fontSize: '0.7rem', color: `${CENNET.accent}80`, fontWeight: 500, margin: 0 }}>{b.kaynak}</p>
          </div>
        ))}
      </div>

      {/* Section C — Sakinler */}
      <SectionTitle color={CENNET.accent}>
        {tr ? 'C. Cennet Sakinleri' : 'C. The Inhabitants of Paradise'}
      </SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '10px', marginBottom: '8px' }}>
        {(d.sakinler || []).map(s => (
          <div key={s.id} style={{
            background: CENNET.bg,
            border: `1px solid ${CENNET.border}`,
            borderRadius: RADIUS.chip, padding: '14px 16px',
          }}>
            <p style={{ fontFamily: FONTS.quran, fontSize: '1.15rem', color: GOLD, textAlign: 'right', direction: 'rtl', lang: 'ar', margin: '0 0 8px' }}>{s.nameAr}</p>
            <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#e8e6e3', margin: '0 0 6px' }}>{tr ? s.nameTr : s.nameEn}</p>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '0 0 8px', lineHeight: 1.55 }}>{tr ? s.descTr : s.descEn}</p>
            <p style={{ fontSize: '0.7rem', color: `${CENNET.accent}80`, fontWeight: 500, margin: '0 0 6px' }}>{s.kaynak}</p>
            {s.notTr && <InfoNote text={tr ? s.notTr : s.notEn} />}
          </div>
        ))}
      </div>

      {/* Section D — Fiziksel Özellikler */}
      <SectionTitle color={CENNET.accent}>
        {tr ? 'D. Fiziksel Özellikler' : 'D. Physical Properties'}
      </SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3, 1fr)', gap: '10px', marginBottom: '8px' }}>
        {(d.fiziksel || []).map(f => (
          <div key={f.id} style={{
            background: f.isSessizlik ? 'rgba(255,255,255,0.02)' : CENNET.bg,
            border: `1px solid ${f.isSessizlik ? 'rgba(255,255,255,0.06)' : CENNET.border}`,
            borderRadius: RADIUS.chip, padding: '12px 14px',
          }}>
            <p style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 4px', fontWeight: 600 }}>
              {tr ? f.labelTr : f.labelEn}
            </p>
            <p style={{ fontSize: '0.88rem', fontWeight: 700, color: f.isSessizlik ? '#475569' : '#e8e6e3', margin: '0 0 6px', lineHeight: 1.4 }}>
              {tr ? f.valueTr : f.valueEn}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', flexWrap: 'wrap' }}>
              <p style={{ fontSize: '0.7rem', color: `${CENNET.accent}80`, fontWeight: 500, margin: 0 }}>{f.kaynak !== '—' ? f.kaynak : '—'}</p>
              {f.isHadis && <HadisBadge language={language} />}
            </div>
          </div>
        ))}
      </div>

      {/* Section E — Vakıa Sınıflandırması */}
      <SectionTitle color={CENNET.accent}>
        {tr ? "E. Vâkıa Sûresi'nin Üçlü Sınıflandırması" : 'E. The Tripartite Classification of Al-Waqi\'a'}
      </SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '10px' }}>
        {[
          {
            nameAr: 'السَّابِقُونَ',
            nameTr: "Sâbikûn — Öne Geçenler",
            nameEn: "Al-Sabiqun — The Foremost",
            descTr: "Öne geçenler — işte onlar mukarreblerdir. En yüksek cennet tabakası.",
            descEn: "The foremost — they are the ones brought near. The highest tier of Paradise.",
            kaynak: "Vâkıa 56:10-11",
            color: CENNET.accent, bg: CENNET.bg, border: CENNET.border
          },
          {
            nameAr: 'أَصْحَابُ الْيَمِينِ',
            nameTr: "Ashâbu'l-Yemîn — Sağ Taraftakiler",
            nameEn: "Ashab al-Yamin — Companions of the Right",
            descTr: "Sağ taraftakiler — ne mutlu sağ taraftakilere! Cennet ehli.",
            descEn: "Companions of the Right — how blessed are the Companions of the Right! The people of Paradise.",
            kaynak: "Vâkıa 56:27",
            color: CENNET.accent, bg: CENNET.bg, border: CENNET.border
          },
          {
            nameAr: 'أَصْحَابُ الشِّمَالِ',
            nameTr: "Ashâbu'ş-Şimâl — Sol Taraftakiler",
            nameEn: "Ashab al-Shimal — Companions of the Left",
            descTr: "Sol taraftakiler — ne kötü sol taraftakiler! Cehennem ehli.",
            descEn: "Companions of the Left — how wretched are the Companions of the Left! The people of Hell.",
            kaynak: "Vâkıa 56:41",
            color: CEHENNEM.accent, bg: CEHENNEM.bg, border: CEHENNEM.border
          },
        ].map((g, i) => (
          <div key={i} style={{ background: g.bg, border: `1px solid ${g.border}`, borderRadius: RADIUS.chip, padding: '14px 16px' }}>
            <p style={{ fontFamily: FONTS.quran, fontSize: '1.2rem', color: GOLD, textAlign: 'right', direction: 'rtl', lang: 'ar', margin: '0 0 8px' }}>{g.nameAr}</p>
            <p style={{ fontSize: '0.88rem', fontWeight: 700, color: g.color, margin: '0 0 6px' }}>{language === 'tr' ? g.nameTr : g.nameEn}</p>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '0 0 8px', lineHeight: 1.55 }}>{language === 'tr' ? g.descTr : g.descEn}</p>
            <p style={{ fontSize: '0.7rem', color: `${g.color}80`, fontWeight: 500, margin: 0 }}>{g.kaynak}</p>
          </div>
        ))}
      </div>
      <p style={{ fontSize: '0.78rem', color: '#475569', marginTop: '10px', lineHeight: 1.6, fontStyle: 'italic' }}>
        {language === 'tr'
          ? "Vâkıa sûresi insanlığı bu üç gruba ayırır. İlk iki grup detaylı cennet tasvirleriyle ödüllendirilir — her biri farklı nimetlerle."
          : "Surah Al-Waqi'a divides humanity into these three groups. The first two groups are rewarded with detailed descriptions of Paradise — each with distinct blessings."}
      </p>
    </div>
  );
}

// ── TAB 3: CEHENNEM ───────────────────────────────────────────────────────────
function TabCehennem({ data, language, isMobile }) {
  const tr = language === 'tr';
  const d = data.cehennemDetaylari || {};

  return (
    <div>
      {/* Section A — Duyusal Tasvir */}
      <SectionTitle color={CEHENNEM.accent}>
        {tr ? 'A. Beş Duyuyla Cehennem' : 'A. Hell Through the Five Senses'}
      </SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '10px', marginBottom: '8px' }}>
        {(d.duyusal || []).map(item => (
          <div key={item.id} style={{
            background: item.isSessizlik ? 'rgba(255,255,255,0.03)' : CEHENNEM.bg,
            border: `1px solid ${item.isSessizlik ? 'rgba(255,255,255,0.10)' : CEHENNEM.border}`,
            borderLeft: `2px solid ${item.isSessizlik ? '#475569' : CEHENNEM.accent}`,
            borderRadius: RADIUS.chip, padding: '14px 16px',
          }}>
            {/* Sense label */}
            <p style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: item.isSessizlik ? '#64748b' : CEHENNEM.accent, margin: '0 0 10px' }}>
              {tr ? item.duyuTr : item.duyuEn}
            </p>
            {/* Arabic verse */}
            {item.verseAr ? (
              <p style={{ fontFamily: FONTS.quran, fontSize: '1.15rem', color: '#e8e6e3', textAlign: 'right', direction: 'rtl', lineHeight: 1.9, margin: '0 0 8px' }} lang="ar">
                {item.verseAr}
              </p>
            ) : (
              /* Sessizlik placeholder */
              <p style={{ fontSize: '1.1rem', color: '#475569', textAlign: 'center', letterSpacing: '0.3em', margin: '4px 0 12px', fontStyle: 'italic' }}>— — —</p>
            )}
            {/* Translation */}
            {(tr ? item.verseTr : item.verseEn) ? (
              <p style={{ fontSize: '0.82rem', color: item.isSessizlik ? '#64748b' : '#94a3b8', margin: '0 0 8px', lineHeight: 1.6, fontStyle: 'italic' }}>
                {tr ? item.verseTr : item.verseEn}
              </p>
            ) : null}
            {/* Analytical note */}
            {(tr ? item.notTr : item.notEn) && (
              <div style={{ marginBottom: '8px' }}>
                {item.isSessizlik && (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                    fontSize: '0.62rem', fontWeight: 600,
                    color: 'rgba(148,163,184,0.6)',
                    background: 'rgba(148,163,184,0.07)',
                    border: '1px solid rgba(148,163,184,0.18)',
                    borderRadius: RADIUS.pillSm, padding: '1px 8px',
                    marginBottom: '6px',
                    letterSpacing: '0.04em',
                  }}>
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    {tr ? 'Tefsir Görüşü' : 'Scholarly Interpretation'}
                  </span>
                )}
                <p style={{ fontSize: '0.75rem', color: item.isSessizlik ? '#64748b' : `${CEHENNEM.accent}90`, margin: 0, lineHeight: 1.55, fontStyle: 'italic' }}>
                  {tr ? item.notTr : item.notEn}
                </p>
              </div>
            )}
            {/* Source */}
            {item.kaynak !== '—' && (
              <p style={{ fontSize: '0.68rem', color: `${CEHENNEM.accent}70`, fontWeight: 600, margin: 0 }}>{item.kaynak}</p>
            )}
          </div>
        ))}
      </div>

      {/* Section B — Yiyecekler */}
      <SectionTitle color={CEHENNEM.accent}>
        {tr ? 'B. Cehennem Yiyecekleri' : 'B. Food of Hell'}
      </SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '10px', marginBottom: '8px' }}>
        {(d.yiyecekler || []).map(y => (
          <div key={y.id} style={{
            background: CEHENNEM.bg,
            border: `1px solid ${y.isHapax ? 'rgba(139,92,246,0.3)' : CEHENNEM.border}`,
            borderLeft: `2px solid ${y.isHapax ? HAPAX : CEHENNEM.accent}`,
            borderRadius: RADIUS.chip, padding: '14px 16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '6px' }}>
              <p style={{ fontFamily: FONTS.quran, fontSize: '1.2rem', color: GOLD, textAlign: 'right', direction: 'rtl', lang: 'ar', margin: 0 }}>{y.nameAr}</p>
              {y.isHapax && <div style={{ flexShrink: 0, marginTop: '4px' }}><HapaxBadge language={language} /></div>}
            </div>
            <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#e8e6e3', margin: '0 0 6px' }}>{tr ? y.nameTr : y.nameEn}</p>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '0 0 8px', lineHeight: 1.55 }}>{tr ? y.descTr : y.descEn}</p>
            <p style={{ fontSize: '0.7rem', color: `${CEHENNEM.accent}80`, fontWeight: 500, margin: 0 }}>{y.kaynak}</p>
          </div>
        ))}
      </div>

      {/* Section C — 19 Bekçi */}
      {d.bekciMelekler && (
        <>
          <SectionTitle color={CEHENNEM.accent}>
            {tr ? 'C. 19 Bekçi Meleği' : 'C. The 19 Guardian Angels'}
          </SectionTitle>
          <div style={{
            background: CEHENNEM.bg,
            border: `2px solid ${CEHENNEM.border}`,
            borderRadius: RADIUS.lg, padding: '20px 24px',
            marginBottom: '8px',
          }}>
            <p style={{ fontFamily: FONTS.quran, fontSize: '1.6rem', color: GOLD, textAlign: 'right', direction: 'rtl', lang: 'ar', margin: '0 0 10px' }}>
              {d.bekciMelekler.verseAr}
            </p>
            <p style={{ fontSize: '0.88rem', color: '#94a3b8', fontStyle: 'italic', margin: '0 0 6px' }}>
              {tr ? d.bekciMelekler.verseTr : d.bekciMelekler.verseEn}
            </p>
            <p style={{ fontSize: '0.72rem', color: `${CEHENNEM.accent}80`, fontWeight: 500, margin: '0 0 14px' }}>
              — {d.bekciMelekler.kaynak}
            </p>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '14px' }}>
              <p style={{ fontSize: '0.83rem', color: '#94a3b8', lineHeight: 1.75, margin: 0 }}>
                {tr ? d.bekciMelekler.aciklamaTr : d.bekciMelekler.aciklamaEn}
              </p>
            </div>
          </div>
        </>
      )}

      {/* Section D — 7 Kapı */}
      <SectionTitle color={CEHENNEM.accent}>
        {tr ? "D. Cehennemin 7 Kapısı" : "D. The 7 Gates of Hell"}
      </SectionTitle>
      <VerseBlock
        ar="لَهَا سَبْعَةُ أَبْوَابٍ لِّكُلِّ بَابٍ مِّنْهُمْ جُزْءٌ مَّقْسُومٌ"
        tr="Onun yedi kapısı vardır. Her kapıya onlardan belirlenmiş bir grup ayrılmıştır."
        en="It has seven gates; for each gate is of them a portion designated."
        kaynak="Hicr 15:44"
        language={language}
        color={CEHENNEM.accent}
      />
      {/* 7 gates visual — names from cehennemIsimleri */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '10px' }}>
        {(data.cehennemIsimleri || []).map((item, idx) => {
          const depth = idx / 6; // 0 → 1 as we go deeper
          return (
            <div key={item.id} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              background: `rgba(153,60,29,${0.05 + depth * 0.12})`,
              border: `1px solid rgba(216,90,48,${0.12 + depth * 0.18})`,
              borderRadius: RADIUS.md,
              padding: isMobile ? '9px 12px' : '10px 16px',
            }}>
              {/* Gate number badge */}
              <div style={{
                width: '26px', height: '26px', borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: `rgba(216,90,48,${0.1 + depth * 0.15})`,
                border: `1px solid rgba(216,90,48,${0.3 + depth * 0.3})`,
                fontSize: '0.72rem', fontWeight: 800, color: CEHENNEM.accent,
              }}>{idx + 1}</div>
              {/* Arabic name */}
              <div style={{ fontFamily: FONTS.quran, fontSize: isMobile ? '1rem' : '1.15rem', color: GOLD, direction: 'rtl', flexShrink: 0, lineHeight: 1.8 }}>
                {item.nameAr}
              </div>
              {/* Name + meaning */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#e8e6e3' }}>
                  {tr ? item.nameTr : item.nameEn}
                </span>
                {(tr ? item.meaningTr : item.meaningEn) && (
                  <span style={{ fontSize: '0.72rem', color: '#64748b', marginLeft: '8px', fontStyle: 'italic' }}>
                    {tr ? item.meaningTr : item.meaningEn}
                  </span>
                )}
              </div>
              {/* Frequency */}
              <div style={{ fontSize: '0.65rem', color: `${CEHENNEM.accent}70`, flexShrink: 0, textAlign: 'right' }}>
                {tr ? item.frequency : item.frequencyEn}
              </div>
            </div>
          );
        })}
      </div>
      <InfoNote text={tr
        ? "Kur'an kapı sayısını 7 verir ancak hangi kapıdan kimin gireceğini belirtmez. Bu ayrıntı müfessirlere aittir."
        : "The Quran states there are 7 gates but does not specify who enters through which gate. This detail belongs to the commentators."
      } />
    </div>
  );
}

// ── TAB 4: A'RAF ──────────────────────────────────────────────────────────────
function TabAraf({ data, language, isMobile }) {
  const tr = language === 'tr';
  const araf = data.araf || {};

  return (
    <div>
      {/* Feature verse */}
      <div style={{
        background: ARAF.bg,
        border: `2px solid ${ARAF.border}`,
        borderRadius: RADIUS.lg, padding: '22px 24px',
        marginBottom: '20px',
      }}>
        <p style={{ fontFamily: FONTS.quran, fontSize: '1.5rem', color: GOLD, textAlign: 'right', direction: 'rtl', lang: 'ar', margin: '0 0 10px', lineHeight: 2 }}>
          {araf.verseAr}
        </p>
        <p style={{ fontSize: '0.88rem', color: '#94a3b8', fontStyle: 'italic', margin: '0 0 6px' }}>
          {tr ? araf.verseTr : araf.verseEn}
        </p>
        <p style={{ fontSize: '0.72rem', color: `${ARAF.accent}90`, fontWeight: 600, margin: 0 }}>
          — {araf.kaynak}
        </p>
      </div>

      {/* Explanation */}
      <p style={{ fontSize: '0.92rem', color: '#94a3b8', lineHeight: 1.8, maxWidth: '700px', marginBottom: '24px' }}>
        {tr ? araf.aciklamaTr : araf.aciklamaEn}
      </p>

      {/* Questions */}
      <SectionTitle color={ARAF.accent}>
        {tr ? 'A\'râf Hakkında Üç Soru' : 'Three Questions About A\'raf'}
      </SectionTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
        {(araf.sorular || []).map(s => (
          <div key={s.id} style={{
            background: ARAF.bg,
            border: `1px solid ${ARAF.border}`,
            borderLeft: `3px solid ${ARAF.accent}`,
            borderRadius: RADIUS.chip, padding: '16px 18px',
          }}>
            <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#e8e6e3', margin: '0 0 8px' }}>
              {tr ? s.soruTr : s.soruEn}
            </p>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.65, margin: '0 0 8px' }}>
              {tr ? s.cevapTr : s.cevapEn}
            </p>
            {s.isHadis && <HadisBadge language={language} />}
          </div>
        ))}
      </div>

      {/* İlliyyûn vs Siccîn */}
      <SectionTitle color={ARAF.accent}>
        {tr ? "İlliyyûn & Siccîn — Öteki Alemin Kayıt Sistemi" : "Illiyyun & Sijjin — The Record System of the Hereafter"}
      </SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '12px' }}>
        {(araf.illiyyunSiccin || []).map(item => {
          const c = item.taraf === 'cennet' ? CENNET : CEHENNEM;
          return (
            <div key={item.id} style={{
              background: c.bg,
              border: `1px solid ${c.border}`,
              borderRadius: RADIUS.chip, padding: '16px 18px',
            }}>
              <p style={{ fontFamily: FONTS.quran, fontSize: '1.3rem', color: GOLD, textAlign: 'right', direction: 'rtl', lang: 'ar', margin: '0 0 8px' }}>{item.nameAr}</p>
              <p style={{ fontSize: '0.9rem', fontWeight: 700, color: c.accent, margin: '0 0 6px' }}>{tr ? item.nameTr : item.nameEn}</p>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '0 0 8px', lineHeight: 1.55 }}>{tr ? item.descTr : item.descEn}</p>
              <p style={{ fontSize: '0.7rem', color: `${c.accent}80`, fontWeight: 500, margin: 0 }}>{item.kaynak}</p>
            </div>
          );
        })}
      </div>
      <InfoNote text={tr
        ? "İlliyyûn ve Siccîn — her iki kavramın tam anlamı da müfessirler arasında tartışmalıdır."
        : "Illiyyun and Sijjin — the precise meaning of both concepts is debated among scholars."
      } />
    </div>
  );
}

// ── TAB 5: RAHMAN SİMETRİSİ ───────────────────────────────────────────────────
function TabRahman({ data, language, isMobile }) {
  const tr = language === 'tr';
  const rs = data.rahmanSimetrisi || {};

  return (
    <div>
      {/* Feature nakarat */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: RADIUS.xl, padding: '24px',
        marginBottom: '20px',
        textAlign: 'center',
      }}>
        <p style={{ fontFamily: FONTS.quran, fontSize: '1.6rem', color: GOLD, direction: 'rtl', lang: 'ar', margin: '0 0 10px', lineHeight: 2, textAlign: 'center' }}>
          {rs.nakaratAr}
        </p>
        <p style={{ fontSize: '0.92rem', color: '#94a3b8', fontStyle: 'italic', margin: '0 0 6px' }}>
          {tr ? rs.nakaratTr : rs.nakaratEn}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <span style={{
            fontSize: '1.1rem', fontWeight: 800, color: GOLD,
          }}>{rs.nakaratCount}×</span>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
            {tr ? rs.nakaratKaynak : rs.nakaratKaynakEn}
          </span>
        </div>
      </div>

      {/* Explanation */}
      <p style={{ fontSize: '0.92rem', color: '#94a3b8', lineHeight: 1.8, maxWidth: '700px', marginBottom: '24px' }}>
        {tr ? rs.aciklamaTr : rs.aciklamaEn}
      </p>

      {/* Two-column symmetry visual */}
      <SectionTitle color={GOLD}>
        {tr ? "Cennet & Cehennem: Paralel Tasvirler" : "Paradise & Hell: Parallel Descriptions"}
      </SectionTitle>
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 28px 1fr',
        gap: '0',
        marginBottom: '24px',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: RADIUS.lg,
        overflow: 'hidden',
      }}>
        {/* Paradise col */}
        <div style={{ padding: '16px', background: CENNET.bg }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: CENNET.accent, margin: '0 0 12px' }}>
            {tr ? 'Cennet Tasvirleri' : 'Paradise Descriptions'}
          </p>
          {[
            { tr: 'İki bahçe — çeşit çeşit meyveler', en: 'Two gardens — fruits of every kind', ref: '55:46-53' },
            { tr: 'Uzanan gölge, çağlayan su', en: 'Extended shade, flowing water', ref: '55:54' },
            { tr: 'Uzanan kollarla meyve veren ağaçlar', en: 'Fruit trees within reach', ref: '55:54' },
            { tr: 'Yataklara yaslanmış eşler', en: 'Spouses reclining on cushions', ref: '55:54-56' },
            { tr: "Bunun ötesinde daha iki bahçe daha", en: 'Beyond these, two more gardens', ref: '55:62-76' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{language === 'tr' ? item.tr : item.en}</span>
              <span style={{ fontSize: '0.68rem', color: `${CENNET.accent}80`, flexShrink: 0 }}>{item.ref}</span>
            </div>
          ))}
        </div>

        {/* Center divider */}
        {!isMobile && (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(255,255,255,0.02)',
            gap: '6px', padding: '8px 0',
          }}>
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} style={{ width: '4px', height: '4px', borderRadius: '50%', background: `${GOLD}50` }} />
            ))}
          </div>
        )}

        {/* Hell col */}
        <div style={{ padding: '16px', background: CEHENNEM.bg }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: CEHENNEM.accent, margin: '0 0 12px' }}>
            {tr ? 'Cehennem Tasvirleri' : 'Hell Descriptions'}
          </p>
          {[
            { tr: 'Ateş ve kaynar su', en: 'Fire and boiling water', ref: '55:44' },
            { tr: 'Günahkârların yüzüyle bilinen işaretler', en: 'Marks by which sinners are known', ref: '55:41' },
            { tr: 'Zakkum ve kaynar su içmek', en: 'Zaqqum tree and boiling water to drink', ref: '55:54' },
            { tr: 'Cehennemin aşırı sıcağı', en: 'The intense heat of Hell', ref: '55:44' },
            { tr: 'Suçlular yalanlayıp duruyor', en: 'The guilty persist in denial', ref: '55:43-45' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{language === 'tr' ? item.tr : item.en}</span>
              <span style={{ fontSize: '0.68rem', color: `${CEHENNEM.accent}80`, flexShrink: 0 }}>{item.ref}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Analysis cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {(rs.kartlar || []).map(k => (
          <div key={k.id} style={{
            background: 'rgba(255,255,255,0.03)',
            border: `1px solid ${COLORS.softGoldAlpha20}`,
            borderLeft: `3px solid ${GOLD}`,
            borderRadius: RADIUS.chip, padding: '16px 18px',
          }}>
            <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#e8e6e3', margin: '0 0 8px' }}>
              {tr ? k.titleTr : k.titleEn}
            </p>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.7, margin: 0 }}>
              {tr ? k.bodyTr : k.bodyEn}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── TAB 6: KAYNAKLAR ──────────────────────────────────────────────────────────
const SOURCE_URLS = {
  corpus:       'https://corpus.quran.com',
  tanzil:       'https://tanzil.net',
  kuranvemeali: 'https://www.kuranvemeali.com',
  'tdv-cehennem': 'https://islamansiklopedisi.org.tr/cehennem',
  'tdv-cahim':    'https://islamansiklopedisi.org.tr/cahim',
};

const CROSS_LINKS = [
  { labelTr: 'Tabiat Atlası',       labelEn: 'Nature Atlas',         event: 'openNatureAtlas' },
  { labelTr: 'Muhatap Sistemi',      labelEn: 'Addressee System',     event: 'openAddresseeSystem' },
  { labelTr: 'İmkânsız Ritim',       labelEn: 'Impossible Rhythm',    section: '#impossible-rhythm' },
  { labelTr: 'Kavram Ağı',           labelEn: 'Concept Graph',        event: 'openConceptGraph' },
  { labelTr: 'Kur\'an\'ın Emirleri', labelEn: 'Quran Commands',       event: 'openQuranCommands' },
];

function SourceSection({ titleTr, titleEn, items, tr }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <h3 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#64748b', margin: '0 0 10px' }}>
        {tr ? titleTr : titleEn}
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {items.map(item => {
          const url = SOURCE_URLS[item.id];
          const label = tr ? item.nameTr : item.nameEn;
          return (
            <div key={item.id} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: RADIUS.md, padding: '10px 14px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px',
            }}>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0, flex: 1 }}>
                {label}
              </p>
              {url && (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                    fontSize: '0.72rem', fontWeight: 600,
                    color: GOLD, textDecoration: 'none', flexShrink: 0,
                    padding: '3px 8px',
                    border: `1px solid ${GOLD}30`,
                    borderRadius: RADIUS.sm,
                    background: `${GOLD}08`,
                  }}
                >
                  {tr ? 'Aç' : 'Open'}
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TabKaynaklar({ data, language }) {
  const tr = language === 'tr';
  const k = data.kaynaklar || {};

  return (
    <div style={{ maxWidth: '680px' }}>
      {/* Global note */}
      <div style={{
        background: COLORS.softGoldAlpha08,
        border: `1px solid ${COLORS.softGoldAlpha20}`,
        borderRadius: RADIUS.chip, padding: '16px 18px',
        marginBottom: '24px',
        display: 'flex', gap: '10px', alignItems: 'flex-start',
      }}>
        <span style={{ color: GOLD, flexShrink: 0, fontSize: '1rem', marginTop: '1px' }}>ℹ</span>
        <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.7, margin: 0 }}>
          {tr ? k.globalNotTr : k.globalNotEn}
        </p>
      </div>

      <SourceSection titleTr="Klasik Tefsir" titleEn="Classical Commentary" items={k.klasikTefsir || []} tr={tr} />
      <SourceSection titleTr="Akademik Kaynaklar" titleEn="Academic Sources" items={k.akademik || []} tr={tr} />
      <SourceSection titleTr="Dijital Doğrulama" titleEn="Digital Verification" items={k.dijital || []} tr={tr} />

      {/* Cross-tool links */}
      <div style={{ marginTop: '28px' }}>
        <h3 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#64748b', margin: '0 0 10px' }}>
          {tr ? 'İlgili Araçlar' : 'Related Tools'}
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {CROSS_LINKS.map((link, i) => (
            <button
              key={i}
              onClick={() => link.event && window.dispatchEvent(new CustomEvent(link.event))}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                padding: '6px 14px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: RADIUS.pillSm,
                color: '#94a3b8',
                fontSize: '0.8rem',
                cursor: 'pointer',
                fontFamily: "'Inter', sans-serif",
                transition: `all ${TRANSITION.fast}`,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#e8e6e3'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#94a3b8'; }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
              {tr ? link.labelTr : link.labelEn}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
