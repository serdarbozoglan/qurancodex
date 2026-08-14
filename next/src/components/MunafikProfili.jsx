'use client';

import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { cleanArabicForDisplay as cleanArabic } from '../lib/arabic';
import {
  COLORS,
  FONTS,
  VERSE_DISPLAY_CARD,
  GLASS_CARD,
  BREAKPOINT_TABLET,
  RADIUS,
  TEXT, SEMANTIC } from '../tokens';
import ToolHeader from './ToolHeader';
import CrossToolCTA from './CrossToolCTA';
import SourcesCitation from './SourcesCitation';
import useFocusTrap from '../hooks/useFocusTrap';


// ─── Tabs ────────────────────────────────────────────────────────────────────
// ─── Profil ikonları — 12 farklı SVG kimlik ──────────────────────────────
// Kur'ân'ın münâfık davranış paletindeki her profile ayrı bir görsel çıpa.
// Her ikon 22×22 view box, stroke color prop olarak gelir.

const PROFILE_ICONS = {
  'self-deception': (color) => (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      {/* Two masks — outer and inner */}
      <path d="M4 7 Q4 4 7 4 Q10 4 10 7 Q10 10 7 10 Q4 10 4 7 Z" stroke={color} strokeWidth="1.4" fill={`${color}20`} />
      <path d="M12 12 Q12 9 15 9 Q18 9 18 12 Q18 15 15 15 Q12 15 12 12 Z" stroke={color} strokeWidth="1.4" fill={`${color}20`} />
      <circle cx="7" cy="7" r="0.9" fill={color} />
      <circle cx="15" cy="12" r="0.9" fill={color} />
    </svg>
  ),
  'reformer-identity': (color) => (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      {/* Wrench crossed with broken bar */}
      <path d="M4 18 L18 4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M15 3 L18 3 L18 6 M5 15 L4 18 L7 18" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 12 L13 8" stroke={color} strokeWidth="2.3" strokeLinecap="round" opacity="0.4" strokeDasharray="1 2" />
    </svg>
  ),
  'fear-cycle': (color) => (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      {/* Heart with lightning */}
      <path d="M11 18 C4 13 3 8 6 5 Q11 3 11 8 Q11 3 16 5 C19 8 18 13 11 18 Z" stroke={color} strokeWidth="1.4" fill={`${color}22`} />
      <path d="M11 8 L9 12 L12 11 L10 15" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  ),
  'ruin-plotting': (color) => (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      {/* Broken bridge */}
      <path d="M2 15 Q6 12 8 15" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M14 15 Q16 12 20 15" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M2 18 H8 M14 18 H20" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M9 13 L11 10 L13 13" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.7" />
      <circle cx="6" cy="7" r="1" fill={color} opacity="0.6" />
      <circle cx="14" cy="6" r="0.8" fill={color} opacity="0.4" />
    </svg>
  ),
  'prayer-laziness': (color) => (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      {/* Clock with sagging hands */}
      <circle cx="11" cy="11" r="8" stroke={color} strokeWidth="1.5" fill="none" />
      <path d="M11 5 V11 L15 14" stroke={color} strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <path d="M4 4 Q6 6 4 8" stroke={color} strokeWidth="1.3" strokeLinecap="round" fill="none" opacity="0.6" />
    </svg>
  ),
  'wealth-waste': (color) => (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      {/* Coin with slash */}
      <circle cx="11" cy="11" r="7" stroke={color} strokeWidth="1.5" fill={`${color}18`} />
      <path d="M11 6 V16 M8 8 Q11 7 14 8 T14 12 Q11 13 8 12 T8 14 Q11 15 14 14" stroke={color} strokeWidth="1.3" strokeLinecap="round" fill="none" opacity="0.7" />
      <path d="M4 17 L18 5" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
    </svg>
  ),
  'alternative-allegiance': (color) => (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      {/* Two crossed flags */}
      <path d="M5 4 V19 M17 4 V19" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M5 4 L12 6 L5 8 Z" stroke={color} strokeWidth="1.3" fill={`${color}25`} strokeLinejoin="round" />
      <path d="M17 6 L10 8 L17 10 Z" stroke={color} strokeWidth="1.3" fill={`${color}25`} strokeLinejoin="round" />
    </svg>
  ),
  'cowardice-pride': (color) => (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      {/* Crown split with running figure */}
      <path d="M4 8 L7 4 L11 8 L15 4 L18 8 V12 H4 Z" stroke={color} strokeWidth="1.3" fill={`${color}22`} strokeLinejoin="round" />
      <circle cx="7" cy="6" r="0.8" fill={color} />
      <circle cx="11" cy="8" r="0.8" fill={color} />
      <circle cx="15" cy="6" r="0.8" fill={color} />
      <path d="M6 16 L10 20 M10 20 L14 16" stroke={color} strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.7" />
    </svg>
  ),
  'kalp-hastaligi': (color) => (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      {/* Brain / neural web */}
      <path d="M11 3 Q6 3 5 8 Q4 12 6 15 Q8 18 11 18 Q14 18 16 15 Q18 12 17 8 Q16 3 11 3 Z" stroke={color} strokeWidth="1.4" fill={`${color}20`} />
      <path d="M11 3 V18 M7 6 Q11 9 15 6 M7 15 Q11 12 15 15" stroke={color} strokeWidth="1.1" fill="none" opacity="0.65" />
      <circle cx="11" cy="10" r="1.3" fill={color} opacity="0.75" />
    </svg>
  ),
  'riya-i-salat': (color) => (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      {/* Eye in mirror */}
      <path d="M3 11 Q11 4 19 11 Q11 18 3 11 Z" stroke={color} strokeWidth="1.4" fill={`${color}18`} />
      <circle cx="11" cy="11" r="3.5" stroke={color} strokeWidth="1.3" fill="none" />
      <circle cx="11" cy="11" r="1.6" fill={color} />
      <path d="M6 4 L4 6 M16 4 L18 6" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
    </svg>
  ),
  'soz-tasima': (color) => (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      {/* Whisper with tongue lines */}
      <path d="M4 6 Q6 4 8 6 L8 12 Q6 14 4 12 Z" stroke={color} strokeWidth="1.4" fill={`${color}20`} strokeLinejoin="round" />
      <path d="M14 4 Q16 3 18 4 L18 14 Q16 15 14 14 Z" stroke={color} strokeWidth="1.4" fill={`${color}20`} strokeLinejoin="round" />
      <path d="M9 9 L13 9 M9 12 Q11 11 13 12" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
      <circle cx="11" cy="17" r="0.9" fill={color} opacity="0.55" />
      <circle cx="8" cy="19" r="0.6" fill={color} opacity="0.4" />
      <circle cx="14" cy="19" r="0.6" fill={color} opacity="0.4" />
    </svg>
  ),
  'kuran-alay': (color) => (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      {/* Laughing mask + open book */}
      <path d="M3 15 L11 6 L19 15" stroke={color} strokeWidth="1.4" fill="none" strokeLinejoin="round" />
      <path d="M4 15 H18 V18 H4 Z" stroke={color} strokeWidth="1.4" fill={`${color}20`} strokeLinejoin="round" />
      <path d="M7 11 Q9 9 11 11 Q13 9 15 11" stroke={color} strokeWidth="1.3" strokeLinecap="round" fill="none" />
      <circle cx="8.5" cy="13" r="0.8" fill={color} opacity="0.7" />
      <circle cx="13.5" cy="13" r="0.8" fill={color} opacity="0.7" />
    </svg>
  ),
  'karar-krizi': (color) => (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      {/* Compass with wavering needle */}
      <circle cx="11" cy="11" r="8" stroke={color} strokeWidth="1.4" fill={`${color}18`} />
      <path d="M11 6 L9 12 L11 11 L13 12 Z" stroke={color} strokeWidth="1.3" fill={color} strokeLinejoin="round" />
      <path d="M4 6 Q11 3 18 6" stroke={color} strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.55" strokeDasharray="2 2" />
    </svg>
  ),
};

function ProfileIcon({ id, color, size = 24 }) {
  const IconFn = PROFILE_ICONS[id];
  if (!IconFn) return null;
  return (
    <span style={{
      display: 'inline-flex', width: size, height: size,
      alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      {IconFn(color)}
    </span>
  );
}

const TABS = [
  {
    tr: 'Profiller', en: 'Profiles',
    icon: (
      <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="8" r="3" />
        <circle cx="17" cy="8" r="3" />
        <path d="M3 20c0-3 3-5 6-5s6 2 6 5" />
        <path d="M13 20c0-3 3-5 6-5" />
      </svg>
    ),
  },
  {
    tr: 'İbn Kayyim Tipolojisi', en: 'Ibn Qayyim Typology',
    icon: (
      <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
      </svg>
    ),
  },
  {
    tr: 'Sahih Hadis', en: 'Authentic Hadith',
    icon: (
      <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <path d="M14 2v6h6" />
        <path d="M9 13h6M9 17h4" />
      </svg>
    ),
  },
  {
    tr: 'Ayet Yoğunluğu', en: 'Verse Density',
    icon: (
      <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21H21" />
        <path d="M6 17V10" />
        <path d="M11 17V6" />
        <path d="M16 17V13" />
        <path d="M21 17V8" />
      </svg>
    ),
  },
  {
    tr: 'Tarihî Kısaslar', en: 'Historical Episodes',
    icon: (
      <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2 L15 8 L22 9 L17 14 L18 21 L12 18 L6 21 L7 14 L2 9 L9 8 Z" />
      </svg>
    ),
  },
];

// ─── Main overlay ────────────────────────────────────────────────────────────
export default function MunafikProfili({ onClose }) {
  const { language } = useLanguage();
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [expandedProfileId, setExpandedProfileId] = useState(null);
  const [isMobile, setIsMobile] = useState(false)  // SSR-safe; useEffect h() post-mount hydrate;
  const bodyRef = useRef(null);
  const trapRef = useFocusTrap(true);

  // Escape to close
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  // Mobile resize
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < BREAKPOINT_TABLET);
    h(); // post-mount hydrate
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  // Body scroll lock kaldırıldı — WowFacts/IlkSon pattern: normal-flow document scroll.

  // Data load
  useEffect(() => {
    fetch('/munafik-profili.json')
      .then(r => r.json())
      .then(setData)
      .catch(() => {});
  }, []);

  // Reset body scroll on tab change
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
  }, [activeTab]);

  const MUNAFIK_TOOL_HEADER = (
    <ToolHeader
      icon={<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12z" /><circle cx="8.5" cy="12" r="1.5" fill={COLORS.gold} /><circle cx="15.5" cy="12" r="1.5" fill={COLORS.gold} /></svg>}
      titleTr="Münafık Profili"
      titleEn="Profile of the Hypocrite"
      subtitleTr="12 profil · 8 sûre · 3 kısas · psikolojik portre"
      subtitleEn="12 profiles · 8 surahs · 3 episodes · psychological portrait"
      language={language}
    />
  );

  // #202 (2026-07-16) — CTA SSR-safe (loading skeleton'a da eklenir)
  const RELATED_CTA = (
    <div style={{ maxWidth: 1080, margin: '0 auto', padding: isMobile ? '24px 16px 32px' : '40px 24px 48px', width: '100%' }}>
      <CrossToolCTA
        language={language}
        isMobile={isMobile}
        links={[
          { href: `/${language}/atlas/insan-psikolojisi`, titleTr: 'İnsan Psikolojisi', titleEn: 'Human Psychology', descTr: 'Nifâkın psikolojik kökleri — savunma mekanizmaları, kalp hastalığı.', descEn: 'Psychological roots of nifāq — defense mechanisms, disease of the heart.' },
          { href: `/${language}/atlas/nefs-mertebeleri`, titleTr: 'Nefs Mertebeleri', titleEn: 'Stages of the Self', descTr: 'Nifâkın karşıtı — nefs-i mutmainne\'ye giden 7 mertebe.', descEn: 'The opposite of nifāq — 7 stages leading to nafs muṭma\'inna.' },
          { href: `/${language}/arac/kiyamet`, titleTr: 'Kıyâmet Sahneleri', titleEn: 'Doomsday Scenes', descTr: 'Münâfıkların kıyâmet gününde hâli — Kur\'an\'ın kesin tasviri.', descEn: 'The state of hypocrites on Doomsday — the Quran\'s definitive depiction.' },
        ]}
      />
    </div>
  );

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
        {MUNAFIK_TOOL_HEADER}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: COLORS.silver, fontSize: '0.9rem', fontFamily: FONTS.body }}>
            {language === 'tr' ? 'Yükleniyor…' : 'Loading…'}
          </span>
        </div>
        {RELATED_CTA}
      </div>
    );
  }

  const { intro, profiles, typologies, authenticHadith } = data;
  const typology = typologies?.[0];

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
      {MUNAFIK_TOOL_HEADER}

      {/* ── SCROLLABLE BODY ─────────────────────────────────────────────── */}
      <div ref={bodyRef} style={{ flex: 1, overflowX: 'hidden' }}>

        {/* ── HERO ──────────────────────────────────────────────────────── */}
        <div style={{
          padding: isMobile ? '40px 20px 28px' : '56px 40px 36px',
          background: 'linear-gradient(180deg, rgba(231,76,60,0.06) 0%, transparent 100%)',
          borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Islamic geometric pattern — subtle background */}
          <svg aria-hidden="true" width="100%" height="100%" style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            opacity: 0.04, mixBlendMode: 'screen',
          }}>
            <defs>
              <pattern id="munafik-geometric" x="0" y="0" width="64" height="64" patternUnits="userSpaceOnUse">
                <path d="M32 4 L52 16 L52 40 L32 52 L12 40 L12 16 Z" stroke={COLORS.softRed || '#e74c3c'} strokeWidth="0.6" fill="none" />
                <circle cx="32" cy="28" r="2" fill={COLORS.softRed || '#e74c3c'} opacity="0.5" />
                <path d="M32 12 L44 20 L44 36 L32 44 L20 36 L20 20 Z" stroke={COLORS.gold} strokeWidth="0.4" fill="none" opacity="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#munafik-geometric)" />
          </svg>
          {/* Center-glow radial */}
          <div aria-hidden="true" style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%', height: '90%', pointerEvents: 'none',
            background: `radial-gradient(ellipse at center, rgba(231,76,60,0.08) 0%, transparent 70%)`,
            filter: 'blur(4px)',
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Bismillah ornament */}
          <div
            dir="rtl" lang="ar" aria-label="Bismillāh"
            style={{
              fontFamily: FONTS.bismillah,
              fontSize: isMobile ? '1.5rem' : '1.9rem',
              color: COLORS.gold,
              opacity: 0.82,
              lineHeight: 1,
              textAlign: 'center',
              marginBottom: isMobile ? '28px' : '40px',
              textShadow: `0 0 22px ${COLORS.gold}28`,
            }}
          >
            ﷽
          </div>

          {/* Anchor verse — Bakara 2:8 (KFGQPC, centered) */}
          <p
            dir="rtl" lang="ar"
            style={{
              fontFamily: FONTS.quran,
              fontSize: isMobile ? 'clamp(1.05rem, 4.2vw, 1.4rem)' : 'clamp(1.2rem, 2.2vw, 1.6rem)',
              color: COLORS.gold,
              lineHeight: 2.1,
              margin: '0 auto 16px',
              maxWidth: '820px',
              textAlign: 'center',
              textShadow: `0 0 20px ${COLORS.gold}1c`,
            }}
          >
            وَمِنَ النَّاسِ مَنْ يَقُولُ اٰمَنَّا بِاللّٰهِ وَبِالْيَوْمِ الْاٰخِرِ وَمَا هُمْ بِمُؤْمِنِينَ
          </p>

          <p style={{
            color: COLORS.offWhite,
            fontFamily: FONTS.display,
            fontStyle: 'italic',
            fontSize: isMobile ? '0.92rem' : 'clamp(0.95rem, 1.6vw, 1.05rem)',
            lineHeight: 1.7,
            margin: '0 auto 8px',
            maxWidth: '620px',
            textAlign: 'center',
            opacity: 0.95,
          }}>
            "{language === 'tr'
              ? "İnsanlardan kimi de vardır ki, inanmadıkları halde, 'Allah'a ve âhiret gününe inandık' derler."
              : "Among the people are some who say 'We believe in Allah and the Last Day,' but they are not believers."}"
          </p>

          <p style={{
            color: COLORS.silver,
            fontFamily: FONTS.body,
            fontSize: '0.72rem',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            margin: '0 0 32px',
            textAlign: 'center',
            opacity: 0.78,
          }}>
            — {language === 'tr' ? 'Bakara 2:8' : 'Al-Baqarah 2:8'}
          </p>

          {/* Framing whisper */}
          <p style={{
            color: COLORS.silver,
            fontFamily: FONTS.display,
            fontStyle: 'italic',
            fontSize: isMobile ? '0.92rem' : 'clamp(0.95rem, 1.55vw, 1.02rem)',
            lineHeight: 1.7,
            margin: '0 auto 36px',
            maxWidth: '700px',
            textAlign: 'center',
            opacity: 0.88,
          }}>
            {language === 'tr'
              ? <>İmanı inkâr etmek değil, <em style={{ fontStyle: 'normal', color: '#e74c3c', opacity: 0.95 }}>inkârı imanla maskelemek</em>. Kur'an bu tipi diğer tüm günahkârlardan ayrı tutar.</>
              : <>Not denying belief but <em style={{ fontStyle: 'normal', color: '#e74c3c', opacity: 0.95 }}>masking denial with belief</em>. The Quran sets this type apart from every other sinner.</>}
          </p>

          {/* Filigree divider */}
          <div aria-hidden="true" style={{
            width: '120px',
            height: '1px',
            background: `linear-gradient(to right, transparent, ${COLORS.gold}66, transparent)`,
            margin: '0 auto 32px',
          }} />

          {/* Eyebrow */}
          <div style={{
            fontSize: '0.68rem', letterSpacing: '0.3em',
            color: COLORS.softRed, textTransform: 'uppercase',
            fontFamily: FONTS.body, fontWeight: 700,
            opacity: 0.72,
            marginBottom: '14px',
            textAlign: 'center',
          }}>
            {language === 'tr' ? "PSİKOLOJİ · 300+ AYET" : "PSYCHOLOGY · 300+ VERSES"}
          </div>

          {/* Big pull quote */}
          <h2 style={{
            fontFamily: FONTS.display,
            fontSize: isMobile ? '1.55rem' : 'clamp(1.9rem, 3.4vw, 2.55rem)',
            fontWeight: 700,
            color: COLORS.gold,
            lineHeight: 1.2,
            margin: '0 auto 14px',
            letterSpacing: '-0.015em',
            maxWidth: '780px',
            textAlign: 'center',
          }}>
            {language === 'tr'
              ? '300+ ayet tek bir karakter tipine ayrıldı.'
              : '300+ verses are devoted to a single character type.'}
          </h2>

          {/* Subtitle */}
          <p style={{
            color: COLORS.silver,
            fontSize: isMobile ? '0.9rem' : '0.95rem',
            fontFamily: FONTS.body,
            fontStyle: 'italic',
            margin: '0 0 18px 0',
            lineHeight: 1.6,
          }}>
            {language === 'tr' ? intro.subtitleTr : intro.subtitleEn}
          </p>

          {/* Description */}
          <p style={{
            color: COLORS.offWhite,
            fontSize: isMobile ? '0.92rem' : '0.98rem',
            fontFamily: FONTS.body,
            margin: '0 0 18px 0',
            lineHeight: 1.75,
            maxWidth: '720px',
          }}>
            {language === 'tr' ? intro.descTr : intro.descEn}
          </p>

          {/* Etymology — klasik Arap dilbilim çerçevesi */}
          {(intro.etymologyTr || intro.etymologyEn) && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(231,76,60,0.06) 0%, rgba(212,165,116,0.03) 100%)',
              border: '1px solid rgba(231,76,60,0.28)',
              borderLeft: '2px solid rgba(231,76,60,0.7)',
              borderRadius: '10px',
              padding: isMobile ? '16px 16px' : '18px 22px',
              margin: '0 0 20px 0',
              maxWidth: '820px',
              display: 'flex',
              gap: isMobile ? '14px' : '20px',
              alignItems: 'flex-start',
              flexDirection: isMobile ? 'column' : 'row',
            }}>
              {/* Nafak burrow illustration — iki kapılı yuva */}
              <div style={{
                flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: isMobile ? '100%' : '124px',
                padding: '6px',
              }}>
                <NafakBurrow size={isMobile ? 130 : 120} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  color: COLORS.softRed,
                  fontSize: '0.7rem',
                  fontFamily: FONTS.body,
                  fontWeight: 700,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  margin: '0 0 8px 0',
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                }}>
                  <span style={{ opacity: 0.9 }}>{language === 'tr' ? 'Etimoloji — Nafak (نَفَق)' : 'Etymology — Nafaq (نَفَق)'}</span>
                </p>
                <p style={{
                  color: COLORS.silver,
                  fontSize: isMobile ? '0.84rem' : '0.88rem',
                  fontFamily: FONTS.body,
                  lineHeight: 1.75,
                  margin: 0,
                }}>
                  {language === 'tr' ? intro.etymologyTr : intro.etymologyEn}
                </p>
              </div>
            </div>
          )}

          {/* Mini stat chips */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
          }}>
            {[
              { tr: `${profiles.length} psikolojik profil`, en: `${profiles.length} psychological profiles` },
              { tr: 'İbn Kayyim tipolojisi', en: "Ibn Qayyim's typology" },
              { tr: '1 sahih hadis', en: '1 authentic hadith' },
              { tr: `${data.surahDistribution?.items.length || 8} sûre yoğunluğu`, en: `${data.surahDistribution?.items.length || 8} surah density` },
              { tr: `${data.historicalKissalar?.items.length || 3} tarihî kısas`, en: `${data.historicalKissalar?.items.length || 3} historical episodes` },
            ].map((chip, i) => (
              <span key={i} style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '6px 12px',
                background: 'rgba(231,76,60,0.08)',
                border: '1px solid rgba(231,76,60,0.25)',
                borderRadius: RADIUS.pill,
                color: COLORS.offWhite,
                fontSize: '0.76rem',
                fontFamily: FONTS.body,
                fontWeight: 500,
              }}>
                {language === 'tr' ? chip.tr : chip.en}
              </span>
            ))}
          </div>
          </div>
        </div>

        {/* ── TAB BAR (UPPERCASE site-wide pattern) ──────────────────────── */}
        <div id="munafik-tab-bar" style={{
          display: 'flex',
          gap: '2px',
          padding: isMobile ? '0 8px' : '0 16px',
          borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
          background: 'rgb(6, 8, 14)',
          backgroundColor: 'rgb(6, 8, 14)',
          isolation: 'isolate',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          flexShrink: 0,
          position: 'sticky',
          top: '110px',
          zIndex: 20,
          scrollMarginTop: '120px',
        }}>
          {TABS.map((tab, i) => {
            const isActive = activeTab === i;
            return (
              <button
                key={i}
                onClick={() => {
                  setActiveTab(i);
                  setTimeout(() => {
                    const tb = document.getElementById('munafik-tab-bar');
                    if (tb) tb.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 50);
                }}
                style={{
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: isMobile ? '14px 16px' : '16px 26px',
                  border: 'none',
                  background: isActive ? COLORS.goldAlpha15 : 'transparent',
                  borderBottom: isActive ? `2px solid ${COLORS.gold}` : '2px solid transparent',
                  borderRadius: 0,
                  color: isActive ? COLORS.gold : COLORS.silver,
                  fontSize: isMobile ? '0.72rem' : '0.78rem',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  fontFamily: FONTS.body,
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = COLORS.offWhite; } }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = COLORS.silver; } }}
              >
                <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{tab.icon}</span>
                <span>{language === 'tr' ? tab.tr : tab.en}</span>
              </button>
            );
          })}
        </div>

        {/* ── TAB CONTENT ───────────────────────────────────────────────── */}
        <div style={{ padding: isMobile ? '20px 16px 48px' : '28px 32px 64px' }}>

          {activeTab === 0 && (
            <ProfilesTab
              profiles={profiles}
              expandedId={expandedProfileId}
              onToggle={(id) => setExpandedProfileId(expandedProfileId === id ? null : id)}
              language={language}
              isMobile={isMobile}
            />
          )}

          {activeTab === 1 && typology && (
            <TypologyTab typology={typology} language={language} isMobile={isMobile} />
          )}

          {activeTab === 2 && authenticHadith && (
            <HadithTab hadith={authenticHadith} language={language} isMobile={isMobile} />
          )}

          {activeTab === 3 && data.surahDistribution && (
            <SurahDistributionTab dist={data.surahDistribution} language={language} isMobile={isMobile} />
          )}

          {activeTab === 4 && data.historicalKissalar && (
            <KissalarTab data={data.historicalKissalar} language={language} isMobile={isMobile} />
          )}

          {/* Klasik Kaynaklar */}
          <SourcesCitation
            language={language}
            isMobile={isMobile}
            sources={[
              { author: 'İbn Kayyim el-Cevziyye',     workTr: 'Medâricu\'s-Sâlikîn',           workEn: 'Madārij al-Sālikīn',           period: '1292–1350 (Şâm)',     noteTr: 'Münâfık tipolojisi — nifâkın küçük/büyük ayrımı.',     noteEn: 'Hypocrite typology — minor vs major nifāq.' },
              { author: 'el-Begavî',                  workTr: 'Meâlimu\'t-Tenzîl',             workEn: 'Maʿālim al-Tanzīl',            period: '1044–1117 (Horasan)', noteTr: 'Münâfikûn sûresi tefsiri — esbâbu\'n-nüzûl detayları.', noteEn: 'Munāfiqūn surah commentary — occasions of revelation.' },
              { author: 'İmam el-Buhârî',             workTr: 'Sahîh — Kitâbu\'l-Îmân',        workEn: 'Ṣaḥīḥ — Kitāb al-Īmān',        period: '810–870 (Buhârâ)',    noteTr: 'Münafık alâmetleri hadis-i şerifi (3 ayrı versiyon).', noteEn: 'Hadith on the marks of the hypocrite (3 versions).' },
              { author: 'er-Râzî',                    workTr: 'Mefâtîhu\'l-Ğayb',              workEn: 'Mafātīḥ al-Ghayb',             period: '1149–1209 (Rey)',     noteTr: 'Münâfik psikolojisi — küfür vs nifâk arasındaki incelik.', noteEn: 'Psychology of the hypocrite — the nuance between kufr and nifāq.' },
            ]}
          />

          {/* Cross-page CTA — Psychology section'a yönlendir */}
          <PsychologyCTA onClose={onClose} language={language} isMobile={isMobile} />

          {RELATED_CTA}

        </div>
      </div>
    </div>
  );
}

// ─── Cross-page CTA: Psychology section bağlantısı ───────────────────────────
function PsychologyCTA({ onClose, language, isMobile }) {
  const handleClick = () => {
    onClose();
    setTimeout(() => {
      const el = document.getElementById('psychology');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 120);
  };
  return (
    <button
      onClick={handleClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        width: '100%',
        marginTop: '32px',
        padding: isMobile ? '14px 16px' : '16px 22px',
        background: 'linear-gradient(135deg, rgba(212,165,116,0.06), rgba(212,165,116,0.02))',
        border: `1px solid ${COLORS.gold}40`,
        borderRadius: RADIUS.lg,
        color: COLORS.offWhite,
        fontFamily: FONTS.body,
        fontSize: isMobile ? '0.85rem' : '0.92rem',
        textAlign: 'left',
        cursor: 'pointer',
        transition: 'all 0.18s',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = `linear-gradient(135deg, rgba(212,165,116,0.12), ${COLORS.goldAlpha04})`; e.currentTarget.style.borderColor = COLORS.gold; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(212,165,116,0.06), rgba(212,165,116,0.02))'; e.currentTarget.style.borderColor = `${COLORS.gold}40`; }}
    >
      <div>
        <div style={{
          color: COLORS.gold,
          fontSize: '0.66rem',
          fontWeight: 700,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          marginBottom: '6px',
        }}>
          {language === 'tr' ? '↗ Devamı için' : '↗ Continue with'}
        </div>
        <div style={{ color: COLORS.offWhite, fontWeight: 600, marginBottom: '4px' }}>
          {language === 'tr' ? 'İnsanın Psikolojisi — Bölüme Git' : 'Human Psychology — Go to Section'}
        </div>
        <div style={{ color: COLORS.silver, fontSize: '0.78rem', lineHeight: 1.5 }}>
          {language === 'tr'
            ? 'Anna Freud savunma mekanizmaları, kalp kavramı, modern psikoloji ile Kur\'ânî psikoloji köprüsü.'
            : 'Anna Freud defense mechanisms, the concept of the heart, classical Quranic psychology bridged with modern theory.'}
        </div>
      </div>
      <span style={{ color: COLORS.gold, fontSize: '1.4rem', flexShrink: 0 }}>→</span>
    </button>
  );
}

// ─── Tab 1: Profiles accordion ───────────────────────────────────────────────
function ProfilesTab({ profiles, expandedId, onToggle, language, isMobile }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
      gap: '16px',
      alignItems: 'start',
    }}>
      {profiles.map((profile) => (
        <ProfileCard
          key={profile.id}
          profile={profile}
          isOpen={expandedId === profile.id}
          onToggle={() => onToggle(profile.id)}
          language={language}
          isMobile={isMobile}
        />
      ))}
    </div>
  );
}

// ─── Single profile accordion card ──────────────────────────────────────────
function ProfileCard({ profile, isOpen, onToggle, language, isMobile }) {
  const title = language === 'tr' ? profile.titleTr : profile.titleEn;
  const pattern = language === 'tr' ? profile.behaviorPatternTr : profile.behaviorPatternEn;
  const classical = language === 'tr' ? profile.classicalAnalysisTr : profile.classicalAnalysisEn;
  const modern = language === 'tr' ? profile.modernParallelTr : profile.modernParallelEn;
  const source = language === 'tr' ? profile.sourceTr : profile.sourceEn;
  const info = language === 'tr' ? profile.infoTr : profile.infoEn;
  const accent = profile.color || COLORS.softRed;

  // First 110 characters of pattern for preview
  const preview = pattern.length > 110 ? pattern.slice(0, 110).trim() + '…' : pattern;

  return (
    <div style={{
      ...GLASS_CARD,
      borderLeft: `3px solid ${accent}`,
      overflow: 'hidden',
      transition: 'all 0.25s',
      position: 'relative',
      background: `linear-gradient(135deg, ${accent}08 0%, rgba(255,255,255,0.03) 45%)`,
    }}>
      {/* Ambient corner glow */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: '-30px', right: '-30px',
        width: '140px', height: '140px', pointerEvents: 'none',
        background: `radial-gradient(circle at center, ${accent}22 0%, transparent 65%)`,
        filter: 'blur(2px)',
      }} />
      {/* Header — always visible, clickable toggle */}
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          background: 'transparent',
          border: 'none',
          padding: isMobile ? '16px 16px 14px' : '20px 22px 16px',
          cursor: 'pointer',
          textAlign: 'left',
          color: 'inherit',
          display: 'flex', gap: isMobile ? '12px' : '16px', alignItems: 'flex-start',
          position: 'relative', zIndex: 1,
        }}
      >
        {/* Profile icon — visual identity */}
        <div style={{
          flexShrink: 0,
          width: isMobile ? '46px' : '54px', height: isMobile ? '46px' : '54px',
          borderRadius: '50%',
          background: `radial-gradient(circle at center, ${accent}25 0%, ${accent}08 70%, transparent 100%)`,
          border: `1px solid ${accent}55`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 0 18px ${accent}22`,
        }}>
          <ProfileIcon id={profile.id} color={accent} size={isMobile ? 26 : 30} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
        {/* Key verse ref chip */}
        <div style={{
          display: 'inline-block',
          padding: '3px 9px',
          background: `${accent}14`,
          border: `1px solid ${accent}40`,
          borderRadius: RADIUS.pill,
          color: accent,
          fontSize: '0.7rem',
          fontFamily: FONTS.body,
          fontWeight: 600,
          letterSpacing: '0.02em',
          marginBottom: '10px',
        }}>
          {profile.keyVerseRef}
        </div>

        {/* Profile title */}
        <h3 style={{
          fontFamily: FONTS.display,
          fontSize: isMobile ? '1.15rem' : '1.35rem',
          fontWeight: 700,
          color: COLORS.offWhite,
          margin: '0 0 10px 0',
          lineHeight: 1.3,
        }}>
          {title}
        </h3>

        {/* Preview (only when closed) */}
        {!isOpen && (
          <p style={{
            color: COLORS.silver,
            fontSize: '0.85rem',
            fontFamily: FONTS.body,
            lineHeight: 1.6,
            margin: '0 0 12px 0',
          }}>
            {preview}
          </p>
        )}

        {/* Toggle affordance */}
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          color: accent,
          fontSize: '0.78rem',
          fontFamily: FONTS.body,
          fontWeight: 600,
        }}>
          {isOpen
            ? (language === 'tr' ? 'Kapat' : 'Close')
            : (language === 'tr' ? 'Detayı aç' : 'Open details')}
          <svg aria-hidden="true" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
        </div>
      </button>

      {/* Expanded content */}
      {isOpen && (
        <div style={{
          padding: isMobile ? '0 16px 18px' : '0 22px 22px',
          borderTop: `1px solid ${COLORS.glassBorderSoft}`,
          paddingTop: '18px',
        }}>
          {/* Verses */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
            {profile.verses.map((verse, vi) => (
              <VerseCard key={vi} verse={verse} language={language} />
            ))}
          </div>

          {/* Behavior pattern */}
          <SectionBlock
            label={language === 'tr' ? 'Davranış Deseni' : 'Behavioral Pattern'}
            color={accent}
          >
            <p style={{
              color: COLORS.silver,
              fontSize: '0.88rem',
              fontFamily: FONTS.body,
              fontStyle: 'italic',
              lineHeight: 1.75,
              margin: 0,
            }}>
              {pattern}
            </p>
          </SectionBlock>

          {/* Classical analysis */}
          <SectionBlock
            label={language === 'tr' ? 'Klasik Analiz' : 'Classical Analysis'}
            color={COLORS.gold}
          >
            <p style={{
              color: COLORS.offWhite,
              fontSize: '0.88rem',
              fontFamily: FONTS.body,
              lineHeight: 1.75,
              margin: '0 0 10px 0',
            }}>
              {classical}
            </p>
            {/* Source names as chips */}
            <ScholarChips sourceText={source} />
          </SectionBlock>

          {/* Modern parallel — dashed warning box */}
          <div style={{
            margin: '16px 0 12px',
            padding: isMobile ? '12px 14px' : '14px 16px',
            border: `1px dashed ${COLORS.softRed}55`,
            borderRadius: RADIUS.md,
            background: 'rgba(231,76,60,0.04)',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '8px',
            }}>
              <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={COLORS.softRed} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <span style={{
                color: COLORS.softRed,
                fontSize: '0.72rem',
                fontFamily: FONTS.body,
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}>
                {language === 'tr' ? 'Modern Paralellik' : 'Modern Parallel'}
              </span>
            </div>
            <p style={{
              color: COLORS.offWhite,
              fontSize: '0.85rem',
              fontFamily: FONTS.body,
              lineHeight: 1.7,
              margin: 0,
            }}>
              {modern}
            </p>
          </div>

          {/* Info note */}
          {info && (
            <p style={{
              color: COLORS.silver,
              fontSize: '0.78rem',
              fontFamily: FONTS.body,
              fontStyle: 'italic',
              lineHeight: 1.65,
              margin: '12px 0 14px 0',
            }}>
              {info}
            </p>
          )}

          {/* Mukâbele kartı — sadece collective-network profilinde (9:67 ↔ 9:71) */}
          {profile.mukabele && (
            <MukabeleCard data={profile.mukabele} language={language} isMobile={isMobile} />
          )}

          {/* Ekol etiketi chip */}
          {profile.ekolEtiketi && (
            <div style={{ marginTop: '8px' }}>
              <EkolChip label={profile.ekolEtiketi} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Mukâbele Card — 9:67 ↔ 9:71 yan yana ────────────────────────────────────
function MukabeleCard({ data, language, isMobile }) {
  const title = language === 'tr' ? data.titleTr : data.titleEn;
  const note  = language === 'tr' ? data.noteTr  : data.noteEn;
  const mirrorVerseTr = language === 'tr' ? data.mirrorVerseTr : data.mirrorVerseEn;
  return (
    <div style={{
      marginTop: '16px',
      background: 'rgba(212,165,116,0.05)',
      border: `1px solid ${COLORS.goldAlpha25}`,
      borderRadius: '10px',
      padding: isMobile ? '14px 14px' : '16px 18px',
    }}>
      <p style={{
        color: COLORS.gold,
        fontSize: '0.72rem',
        fontFamily: FONTS.body,
        fontWeight: 700,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        margin: '0 0 6px 0',
      }}>
        ⚖ {title}
      </p>
      <p style={{
        color: COLORS.silver,
        fontSize: '0.82rem',
        fontFamily: FONTS.body,
        lineHeight: 1.65,
        margin: '0 0 14px 0',
      }}>
        {note}
      </p>

      {/* 4-pair grid — desktop'ta 2 sütun, mobilde tek sütun */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
        {data.pairs?.map((pair, i) => (
          <div key={i} style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 24px 1fr',
            alignItems: 'center',
            gap: isMobile ? '4px' : '8px',
            padding: '8px 10px',
            background: 'rgba(0,0,0,0.18)',
            borderRadius: RADIUS.md,
            fontSize: '0.82rem',
            fontFamily: FONTS.body,
          }}>
            <span style={{ color: COLORS.softRed }}>
              <strong style={{ color: COLORS.softRed, fontSize: '0.65rem', letterSpacing: '0.1em', display: 'block', textTransform: 'uppercase', marginBottom: '2px' }}>Münâfık</strong>
              {language === 'tr' ? pair.munafikTr : pair.munafikEn}
            </span>
            {!isMobile && (
              <span style={{ color: COLORS.gold, textAlign: 'center', fontWeight: 700, opacity: 0.75 }}>↔</span>
            )}
            <span style={{ color: COLORS.offWhite }}>
              <strong style={{ color: COLORS.gold, fontSize: '0.65rem', letterSpacing: '0.1em', display: 'block', textTransform: 'uppercase', marginBottom: '2px' }}>Mü'min</strong>
              {language === 'tr' ? pair.muminTr : pair.muminEn}
            </span>
          </div>
        ))}
      </div>

      {/* Mirror verse Arabic */}
      <div dir="rtl" lang="ar" style={{
        fontFamily: FONTS.quran,
        fontSize: 'clamp(1.2rem, 2vw, 1.4rem)',
        color: COLORS.gold,
        lineHeight: 1.85,
        textAlign: 'right',
        background: 'rgba(0,0,0,0.20)',
        borderRadius: RADIUS.md,
        padding: '10px 14px',
        margin: '0 0 6px 0',
      }}>
        {cleanArabic(data.mirrorVerseAr)}
      </div>
      <p style={{
        color: COLORS.silver,
        fontSize: '0.78rem',
        fontFamily: FONTS.body,
        fontStyle: 'italic',
        margin: 0,
      }}>
        {mirrorVerseTr}
      </p>
    </div>
  );
}

// ─── Labeled section block ───────────────────────────────────────────────────
function SectionBlock({ label, color, children }) {
  return (
    <div style={{ marginBottom: '14px' }}>
      <div style={{
        color: color || COLORS.gold,
        fontSize: '0.7rem',
        fontFamily: FONTS.body,
        fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        marginBottom: '8px',
      }}>
        {label}
      </div>
      {children}
    </div>
  );
}

// ─── Verse card — canonical TEXT tokens (§13.5) ────────────────────────────
function VerseCard({ verse, language }) {
  return (
    <div style={{
      ...VERSE_DISPLAY_CARD,
      padding: '14px 16px',
    }}>
      {/* Arabic */}
      <p
        dir="rtl"
        lang="ar"
        style={{
          ...TEXT.verseArabic,
          fontSize: '1.5rem',
          color: COLORS.offWhite,
          margin: '0 0 10px 0',
        }}
      >
        {cleanArabic(verse.verseAr)}
      </p>
      {/* Translation */}
      <p style={{
        color: COLORS.silver,
        fontSize: '0.85rem',
        fontFamily: FONTS.body,
        fontStyle: 'italic',
        lineHeight: 1.7,
        margin: '0 0 8px 0',
      }}>
        {language === 'tr' ? verse.verseTr : verse.verseEn}
      </p>
      {/* Reference */}
      <p style={{
        ...TEXT.verseRef,
        color: COLORS.gold,
        opacity: 1,
        margin: 0,
      }}>
        — {verse.verseRef}
      </p>
    </div>
  );
}

// ─── Scholar chips (parsed from source string) ───────────────────────────────
function ScholarChips({ sourceText }) {
  if (!sourceText) return null;
  // Split on semicolons — each entry is one source reference
  const entries = sourceText.split(/;\s*/).filter(Boolean).slice(0, 4);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
      {entries.map((entry, i) => {
        // Take first 40 characters as the chip label — keeps it compact
        const label = entry.length > 44 ? entry.slice(0, 44).trim() + '…' : entry.trim();
        return (
          <span key={i} style={{
            display: 'inline-block',
            padding: '4px 10px',
            background: 'rgba(212,165,116,0.06)',
            border: `1px solid ${COLORS.goldAlpha25}`,
            borderRadius: RADIUS.pill,
            color: COLORS.offWhite,
            fontSize: '0.72rem',
            fontFamily: FONTS.body,
          }}>
            {label}
          </span>
        );
      })}
    </div>
  );
}

// ─── SurahDistributionTab — 8 sûrede ayet yoğunluğu bar chart ─────────────
function SurahDistributionTab({ dist, language, isMobile }) {
  const tr = language === 'tr';
  const maxCount = Math.max(...dist.items.map(i => i.count));
  const [hovered, setHovered] = useState(null);
  return (
    <div>
      <p style={{
        color: COLORS.silver, fontSize: isMobile ? '0.88rem' : '0.92rem',
        fontFamily: FONTS.body, lineHeight: 1.75, margin: '0 0 24px',
      }}>
        {tr ? dist.descTr : dist.descEn}
      </p>

      {/* Bar chart */}
      <div style={{
        padding: isMobile ? '22px 18px' : '28px 32px',
        background: 'linear-gradient(180deg, rgba(212,165,116,0.04) 0%, rgba(212,165,116,0.01) 100%)',
        border: `1px solid ${COLORS.gold}25`,
        borderRadius: RADIUS.md,
        marginBottom: '24px',
      }}>
        <div style={{
          fontSize: '0.66rem', letterSpacing: '0.2em',
          color: COLORS.gold, textTransform: 'uppercase',
          fontFamily: FONTS.body, fontWeight: 700,
          opacity: 0.85, marginBottom: '20px',
        }}>
          {tr ? `Ayet Sayısı · Toplam ${dist.totalCount}` : `Verse Count · Total ${dist.totalCount}`}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {dist.items.map((it, i) => {
            const pct = (it.count / maxCount) * 100;
            const isHover = hovered === i;
            return (
              <div key={i}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '110px 1fr 32px' : '160px 1fr 40px',
                  gap: '10px', alignItems: 'center',
                  padding: '4px 0',
                  cursor: 'default',
                }}>
                <div style={{
                  fontSize: isMobile ? '0.75rem' : '0.82rem',
                  color: isHover ? COLORS.gold : COLORS.offWhite,
                  fontWeight: 600, fontFamily: FONTS.body,
                  transition: 'color 0.15s',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {it.surah}
                </div>
                <div style={{
                  position: 'relative',
                  height: isMobile ? '18px' : '22px',
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    position: 'absolute', inset: 0,
                    width: `${pct}%`,
                    background: `linear-gradient(90deg, ${COLORS.gold}40 0%, ${COLORS.gold}80 100%)`,
                    borderRight: isHover ? `2px solid ${COLORS.gold}` : 'none',
                    transition: 'all 0.25s ease',
                    boxShadow: isHover ? `0 0 12px ${COLORS.gold}55` : 'none',
                  }} />
                  {isHover && (
                    <div style={{
                      position: 'absolute', left: '12px', top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: '0.7rem', color: COLORS.cosmicBlack,
                      fontWeight: 700, fontFamily: FONTS.body,
                      whiteSpace: 'nowrap', pointerEvents: 'none',
                    }}>
                      {it.range}
                    </div>
                  )}
                </div>
                <div style={{
                  fontSize: '0.82rem', textAlign: 'right',
                  color: COLORS.gold, fontWeight: 800,
                  fontFamily: FONTS.body,
                }}>
                  {it.count}
                </div>
              </div>
            );
          })}
        </div>
        {/* Hover note */}
        {hovered !== null && (
          <div style={{
            marginTop: '16px',
            padding: '10px 14px',
            background: `${COLORS.gold}10`,
            border: `1px solid ${COLORS.gold}30`,
            borderLeft: `2px solid ${COLORS.gold}`,
            borderRadius: RADIUS.sm,
            fontSize: '0.78rem', color: COLORS.silver,
            fontFamily: FONTS.body, fontStyle: 'italic',
            lineHeight: 1.6,
          }}>
            {dist.items[hovered].note}
          </div>
        )}
      </div>

      {/* Total context */}
      <div style={{
        padding: '16px 20px',
        background: 'rgba(52,152,219,0.06)',
        border: `1px solid rgba(52,152,219,0.22)`,
        borderLeft: `2px solid ${COLORS.skyBlue}`,
        borderRadius: RADIUS.sm,
      }}>
        <div style={{
          fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.14em',
          color: COLORS.skyBlue, textTransform: 'uppercase',
          fontFamily: FONTS.body, marginBottom: '6px', opacity: 0.9,
        }}>
          {tr ? 'Bağlam Notu' : 'Contextual Note'}
        </div>
        <p style={{
          fontSize: '0.82rem', color: COLORS.offWhite,
          fontFamily: FONTS.body, lineHeight: 1.7,
          margin: 0,
        }}>
          {tr ? dist.totalContextTr : dist.totalContextEn}
        </p>
      </div>
    </div>
  );
}

// ─── KissalarTab — 3 tarihî münâfık episode ────────────────────────────────
function KissalarTab({ data, language, isMobile }) {
  const tr = language === 'tr';
  return (
    <div>
      <p style={{
        color: COLORS.silver, fontSize: isMobile ? '0.88rem' : '0.92rem',
        fontFamily: FONTS.body, lineHeight: 1.75, margin: '0 0 24px',
      }}>
        {tr ? data.descTr : data.descEn}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {data.items.map((k, i) => <KissaCard key={k.id} kissa={k} index={i + 1} language={language} isMobile={isMobile} />)}
      </div>
    </div>
  );
}

function KissaCard({ kissa, index, language, isMobile }) {
  const tr = language === 'tr';
  const accent = kissa.color || COLORS.gold;
  return (
    <div style={{
      padding: isMobile ? '20px 18px' : '28px 32px',
      background: `linear-gradient(135deg, ${accent}0A 0%, rgba(255,255,255,0.02) 45%)`,
      border: `1px solid ${accent}35`,
      borderLeft: `3px solid ${accent}`,
      borderRadius: RADIUS.md,
      display: 'flex', flexDirection: 'column', gap: '16px',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Ambient corner glow */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: '-30px', right: '-30px',
        width: '160px', height: '160px', pointerEvents: 'none',
        background: `radial-gradient(circle at center, ${accent}22 0%, transparent 65%)`,
        filter: 'blur(2px)',
      }} />

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: '14px',
        flexWrap: 'wrap', position: 'relative', zIndex: 1,
      }}>
        <span style={{
          flexShrink: 0,
          width: '40px', height: '40px', borderRadius: '50%',
          background: `${accent}22`,
          border: `1px solid ${accent}55`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.05rem', fontWeight: 800,
          color: accent, fontFamily: FONTS.display,
          boxShadow: `0 0 18px ${accent}22`,
        }}>{index}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: '0.62rem', letterSpacing: '0.18em',
            color: accent, textTransform: 'uppercase',
            fontFamily: FONTS.body, fontWeight: 700,
            opacity: 0.85, marginBottom: '4px',
          }}>
            {kissa.year}
          </div>
          <h3 style={{
            margin: 0,
            fontFamily: FONTS.display,
            fontSize: isMobile ? '1.2rem' : '1.4rem',
            fontWeight: 700, color: COLORS.offWhite,
            lineHeight: 1.25,
          }}>
            {tr ? kissa.titleTr : kissa.titleEn}
          </h3>
          <div style={{
            fontSize: '0.76rem', color: COLORS.silver,
            fontFamily: FONTS.body, marginTop: '6px',
          }}>
            <span style={{ opacity: 0.55 }}>{tr ? 'Baş rol:' : 'Key figure:'}</span>{' '}
            <strong style={{ color: accent, fontWeight: 600 }}>{tr ? kissa.keyFigureTr : kissa.keyFigureEn}</strong>
          </div>
        </div>
      </div>

      {/* Event narrative */}
      <div style={{
        padding: '14px 18px',
        background: 'rgba(255,255,255,0.025)',
        border: `1px solid ${COLORS.glassBorderSoft}`,
        borderRadius: RADIUS.sm,
        position: 'relative', zIndex: 1,
      }}>
        <div style={{
          fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.14em',
          color: COLORS.gold, textTransform: 'uppercase',
          fontFamily: FONTS.body, marginBottom: '8px', opacity: 0.75,
        }}>
          {tr ? 'Olay' : 'Event'}
        </div>
        <p style={{
          margin: 0, color: COLORS.offWhite,
          fontSize: '0.86rem', fontFamily: FONTS.body,
          lineHeight: 1.75,
        }}>
          {tr ? kissa.eventTr : kissa.eventEn}
        </p>
      </div>

      {/* Qur'anic reply */}
      <div style={{
        padding: '14px 18px',
        background: 'rgba(212,165,116,0.05)',
        border: `1px solid ${COLORS.gold}30`,
        borderLeft: `2px solid ${COLORS.gold}`,
        borderRadius: RADIUS.sm,
        position: 'relative', zIndex: 1,
      }}>
        <div style={{
          fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.14em',
          color: COLORS.gold, textTransform: 'uppercase',
          fontFamily: FONTS.body, marginBottom: '8px', opacity: 0.9,
        }}>
          {tr ? 'Kur\'ânî Yanıt' : 'Qur\'anic Response'}
        </div>
        <p style={{
          margin: '0 0 8px', color: COLORS.offWhite,
          fontSize: '0.85rem', fontFamily: FONTS.body,
          lineHeight: 1.75, fontStyle: 'italic',
        }}>
          {tr ? kissa.quranReplyTr : kissa.quranReplyEn}
        </p>
        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginTop: '8px' }}>
          {kissa.verses.map((v, vi) => (
            <span key={vi} style={{
              padding: '3px 10px',
              background: `${COLORS.gold}15`,
              border: `1px solid ${COLORS.gold}35`,
              borderRadius: RADIUS.pill,
              fontSize: '0.7rem', color: COLORS.gold,
              fontFamily: FONTS.body, fontWeight: 500,
            }}>{v}</span>
          ))}
        </div>
      </div>

      {/* Source line */}
      <p style={{
        margin: 0, fontSize: '0.72rem', color: COLORS.silver,
        fontFamily: FONTS.body, lineHeight: 1.5,
        opacity: 0.78, fontStyle: 'italic',
        position: 'relative', zIndex: 1,
        paddingTop: '10px',
        borderTop: `1px solid ${COLORS.glassBorderSoft}`,
      }}>
        {tr ? kissa.sourceTr : kissa.sourceEn}
      </p>
    </div>
  );
}

// ─── NafakBurrow — etymology için iki-kapılı yuva SVG ─────────────────────
function NafakBurrow({ size = 96 }) {
  return (
    <svg width={size} height={size * 0.7} viewBox="0 0 96 68" fill="none" aria-hidden="true">
      {/* Ground line */}
      <path d="M0 22 H96" stroke={COLORS.silver} strokeWidth="1" opacity="0.4" />
      {/* Underground burrow — dashed path connecting two entrances */}
      <path d="M14 22 Q14 42 30 46 Q48 50 66 42 Q82 30 82 22" stroke={COLORS.gold} strokeWidth="1.6" strokeDasharray="4 3" fill="none" opacity="0.7" />
      {/* Left visible entrance (zâhir) — open */}
      <ellipse cx="14" cy="22" rx="8" ry="4" fill="rgba(212,165,116,0.25)" stroke={COLORS.gold} strokeWidth="1.4" />
      <text x="14" y="12" textAnchor="middle" fontSize="7" fill={COLORS.gold} fontFamily="serif" fontStyle="italic">zâhir</text>
      {/* Right hidden exit (bâtın) — with a fleeing figure suggestion */}
      <ellipse cx="82" cy="22" rx="6" ry="3" fill="rgba(148,163,184,0.15)" stroke={COLORS.silver} strokeWidth="1.3" strokeDasharray="2 2" />
      <text x="82" y="12" textAnchor="middle" fontSize="7" fill={COLORS.silver} fontFamily="serif" fontStyle="italic">bâtın</text>
      {/* Fleeing jerboa arrow */}
      <path d="M85 22 L92 20 M92 20 L89 24 M92 20 L90 17" stroke={COLORS.silver} strokeWidth="1.3" strokeLinecap="round" fill="none" opacity="0.75" />
      {/* Danger arrow entering left */}
      <path d="M2 24 L10 26 M2 24 L6 20 M2 24 L6 28" stroke="#e74c3c" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.55" />
      {/* Small sand grains */}
      <circle cx="26" cy="52" r="0.7" fill={COLORS.gold} opacity="0.35" />
      <circle cx="38" cy="55" r="0.6" fill={COLORS.gold} opacity="0.3" />
      <circle cx="55" cy="53" r="0.7" fill={COLORS.gold} opacity="0.35" />
      <circle cx="70" cy="50" r="0.6" fill={COLORS.gold} opacity="0.3" />
    </svg>
  );
}

// ─── Ekol chip (small silver, italic) ────────────────────────────────────────
function EkolChip({ label }) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '3px 10px',
      background: 'transparent',
      border: `1px solid ${COLORS.silverAlpha40}`,
      borderRadius: RADIUS.pill,
      color: COLORS.silver,
      fontSize: '0.7rem',
      fontFamily: FONTS.body,
      fontStyle: 'italic',
    }}>
      {label}
    </span>
  );
}

// ─── Tab 2: Ibn Qayyim typology ──────────────────────────────────────────────
function TypologyTab({ typology, language, isMobile }) {
  const title = language === 'tr' ? typology.titleTr : typology.titleEn;
  const scholarName = language === 'tr' ? typology.scholar : typology.scholarEn;
  const workName = language === 'tr' ? typology.work : typology.workEn;
  const source = language === 'tr' ? typology.sourceTr : typology.sourceEn;

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Section heading */}
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div style={{
          color: COLORS.softRed,
          fontSize: '0.72rem',
          fontFamily: FONTS.body,
          fontWeight: 700,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          marginBottom: '10px',
        }}>
          {language === 'tr' ? 'Klasik Tipoloji' : 'Classical Typology'}
        </div>
        <h2 style={{
          fontFamily: FONTS.display,
          fontSize: isMobile ? '1.5rem' : '2rem',
          fontWeight: 700,
          color: COLORS.offWhite,
          margin: '0 0 8px 0',
          lineHeight: 1.25,
        }}>
          {title}
        </h2>
        <p style={{
          color: COLORS.silver,
          fontSize: '0.88rem',
          fontFamily: FONTS.body,
          fontStyle: 'italic',
          margin: 0,
        }}>
          {scholarName} · <span style={{ color: COLORS.gold }}>{workName}</span>
        </p>
      </div>

      {/* Categories — 2 columns desktop, 1 column mobile */}
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: 'stretch',
        gap: isMobile ? '14px' : '0',
        position: 'relative',
      }}>
        {typology.categories.map((cat, idx) => {
          const isFirst = idx === 0;
          const catLabel = language === 'tr' ? cat.labelTr : cat.labelEn;
          const catDesc = language === 'tr' ? cat.descTr : cat.descEn;
          // First category (itikadi) = harder red, second (ameli) = silver
          const catColor = isFirst ? COLORS.softRed : COLORS.silver;

          return (
            <div
              key={cat.id}
              style={{
                ...GLASS_CARD,
                flex: 1,
                padding: isMobile ? '20px 18px' : '28px 26px',
                borderLeft: `3px solid ${catColor}`,
                margin: !isMobile ? (isFirst ? '0 10px 0 0' : '0 0 0 10px') : 0,
              }}
            >
              {/* Category number */}
              <div style={{
                color: catColor,
                fontFamily: FONTS.display,
                fontSize: '2.2rem',
                fontWeight: 700,
                lineHeight: 1,
                marginBottom: '10px',
              }}>
                {idx + 1}
              </div>

              {/* Label */}
              <h3 style={{
                fontFamily: FONTS.display,
                fontSize: isMobile ? '1.15rem' : '1.3rem',
                fontWeight: 700,
                color: COLORS.offWhite,
                margin: '0 0 14px 0',
                lineHeight: 1.3,
              }}>
                {catLabel}
              </h3>

              {/* Description */}
              <p style={{
                color: COLORS.silver,
                fontSize: '0.9rem',
                fontFamily: FONTS.body,
                lineHeight: 1.8,
                margin: 0,
              }}>
                {catDesc}
              </p>
            </div>
          );
        })}

        {/* Separator for desktop — vertical line between cards */}
        {!isMobile && (
          <div style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '32px',
            height: '32px',
            background: COLORS.cosmicBlack,
            border: `1px solid ${COLORS.glassBorder}`,
            borderRadius: RADIUS.full,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: COLORS.silver,
            fontFamily: FONTS.display,
            fontSize: '1rem',
            pointerEvents: 'none',
            zIndex: 1,
          }}>
            ×
          </div>
        )}
      </div>

      {/* Source note */}
      <div style={{
        marginTop: '28px',
        padding: isMobile ? '14px 16px' : '16px 20px',
        background: COLORS.glassBgFaint,
        border: `1px solid ${COLORS.glassBorderSoft}`,
        borderRadius: '10px',
      }}>
        <div style={{
          color: COLORS.gold,
          fontSize: '0.7rem',
          fontFamily: FONTS.body,
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          marginBottom: '8px',
        }}>
          {language === 'tr' ? 'Kaynak' : 'Source'}
        </div>
        <p style={{
          color: COLORS.silver,
          fontSize: '0.82rem',
          fontFamily: FONTS.body,
          lineHeight: 1.7,
          margin: '0 0 10px 0',
        }}>
          {source}
        </p>
        {typology.ekolEtiketi && <EkolChip label={typology.ekolEtiketi} />}
      </div>
    </div>
  );
}

// ─── Tab 3: Authentic hadith ─────────────────────────────────────────────────
function HadithTab({ hadith, language, isMobile }) {
  const title = language === 'tr' ? hadith.titleTr : hadith.titleEn;
  const text = language === 'tr' ? hadith.textTr : hadith.textEn;
  const source = language === 'tr' ? hadith.source : hadith.sourceEn;
  const status = language === 'tr' ? hadith.statusTr : hadith.statusEn;
  const note = language === 'tr' ? hadith.noteTr : hadith.noteEn;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Sahih hadis badge */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '18px',
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 18px',
          background: 'rgba(212,165,116,0.08)',
          border: `1.5px solid ${COLORS.gold}`,
          borderRadius: RADIUS.pill,
          color: COLORS.gold,
          fontSize: '0.78rem',
          fontFamily: FONTS.body,
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}>
          <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L4 6v6c0 5 3.4 9.3 8 10 4.6-.7 8-5 8-10V6l-8-4z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
          {language === 'tr' ? 'Sahih Hadis · Mütefekkun Aleyh' : 'Authentic Hadith · Muttafaqun ʿAlayh'}
        </div>
      </div>

      {/* Title */}
      <h2 style={{
        fontFamily: FONTS.display,
        fontSize: isMobile ? '1.5rem' : '1.95rem',
        fontWeight: 700,
        color: COLORS.offWhite,
        textAlign: 'center',
        margin: '0 0 28px 0',
        lineHeight: 1.3,
      }}>
        {title}
      </h2>

      {/* Main hadith card */}
      <div style={{
        ...GLASS_CARD,
        border: `1px solid ${COLORS.goldAlpha25}`,
        padding: isMobile ? '24px 20px' : '40px 48px',
        textAlign: 'center',
        position: 'relative',
      }}>
        {/* Opening quote mark */}
        <div style={{
          fontFamily: FONTS.display,
          fontSize: isMobile ? '3rem' : '4rem',
          color: COLORS.goldAlpha25,
          lineHeight: 0.5,
          margin: '0 0 10px 0',
          userSelect: 'none',
        }}>
          “
        </div>

        {/* Hadith text */}
        <p style={{
          fontFamily: FONTS.display,
          fontSize: isMobile ? '1.1rem' : '1.35rem',
          fontWeight: 400,
          fontStyle: 'italic',
          color: COLORS.offWhite,
          lineHeight: 1.75,
          margin: '0 0 22px 0',
        }}>
          {text}
        </p>

        {/* Metadata row */}
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: isMobile ? '10px' : '16px',
          paddingTop: '18px',
          borderTop: `1px solid ${COLORS.glassBorderSoft}`,
        }}>
          <div style={{ textAlign: isMobile ? 'center' : 'left' }}>
            <div style={{
              color: SEMANTIC.textFaint,
              fontSize: '0.66rem',
              fontFamily: FONTS.body,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: '3px',
            }}>
              {language === 'tr' ? 'Ravi' : 'Narrator'}
            </div>
            <div style={{
              color: COLORS.offWhite,
              fontSize: '0.86rem',
              fontFamily: FONTS.body,
              fontWeight: 600,
            }}>
              {hadith.narrator}
            </div>
          </div>

          {!isMobile && (
            <div style={{
              width: '1px',
              height: '28px',
              background: COLORS.glassBorder,
            }} />
          )}

          <div style={{ textAlign: isMobile ? 'center' : 'left' }}>
            <div style={{
              color: SEMANTIC.textFaint,
              fontSize: '0.66rem',
              fontFamily: FONTS.body,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: '3px',
            }}>
              {language === 'tr' ? 'Kaynak' : 'Source'}
            </div>
            <div style={{
              color: COLORS.offWhite,
              fontSize: '0.86rem',
              fontFamily: FONTS.body,
              fontWeight: 500,
            }}>
              {source}
            </div>
          </div>
        </div>
      </div>

      {/* Status chip */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginTop: '18px',
      }}>
        <span style={{
          display: 'inline-block',
          padding: '7px 16px',
          background: 'rgba(46,204,113,0.08)',
          border: '1px solid rgba(46,204,113,0.35)',
          borderRadius: RADIUS.pill,
          color: COLORS.softEmerald,
          fontSize: '0.78rem',
          fontFamily: FONTS.body,
          fontWeight: 500,
        }}>
          {language === 'tr' ? 'Statü: ' : 'Status: '}{status}
        </span>
      </div>

      {/* Note */}
      {note && (
        <p style={{
          color: COLORS.silver,
          fontSize: '0.8rem',
          fontFamily: FONTS.body,
          fontStyle: 'italic',
          lineHeight: 1.7,
          textAlign: 'center',
          margin: '20px auto 0',
          maxWidth: '620px',
        }}>
          {note}
        </p>
      )}

      {/* Ekol chip */}
      {hadith.ekolEtiketi && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
          <EkolChip label={hadith.ekolEtiketi} />
        </div>
      )}
    </div>
  );
}

