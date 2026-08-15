'use client';

import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useQuranNav } from '@/hooks/useQuranNav';
import { cleanArabicForDisplay as cleanArabic } from '../lib/arabic';
import {
  COLORS,
  FONTS,
  VERSE_DISPLAY_CARD,
  GLASS_CARD,
  BREAKPOINT_TABLET,
  RADIUS,
  TEXT, SEMANTIC } from '../tokens';
import { AlertTriangleIcon } from './icons';
import ToolHeader from './ToolHeader';
import CrossToolCTA from './CrossToolCTA';
import SourcesCitation from './SourcesCitation';
import BookmarkButton from './BookmarkButton';
import useFocusTrap from '../hooks/useFocusTrap';
// 2026-08-14 (Z3f2) — fetch yerine static import: SSR "Yükleniyor" iskeleti
// döndürüyordu, JS başarısız olursa sayfa boş kalıyordu.
import sunnetullahDataStatic from '../../public/sunnetullah-atlasi.json';


// ─── Tab definitions ──────────────────────────────────────────────────────────
const TABS = [
  {
    tr: 'Lafzî Ayetler', en: 'Literal Verses',
    icon: (
      <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
      </svg>
    ),
  },
  {
    tr: 'Tematik Kanunlar', en: 'Thematic Laws',
    icon: (
      <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    tr: 'Ulema Görüşleri', en: 'Scholar Views',
    icon: (
      <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
  {
    tr: 'Kavim Örüntüleri', en: 'Civilization Patterns',
    icon: (
      <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18" />
        <path d="M5 21V7l8-4v18" />
        <path d="M19 21V11l-6-4" />
        <path d="M9 9v.01" />
        <path d="M9 12v.01" />
        <path d="M9 15v.01" />
        <path d="M9 18v.01" />
      </svg>
    ),
  },
];

// ─── Mode icons for civilization patterns ───────────────────────────────────
// Nûh, Firavun → water (flood). Âd → wind. Semûd, Medyen → shockwave. Lût → meteor.
// Her ikonun içinde animasyon güçlendirmesi için SVG stroke/opacity ile varyans var.

function ModeIcon({ mode, color, size = 44 }) {
  const s = size;
  const stroke = color || '#d4a574';
  switch (mode) {
    case 'flood':
      return (
        <svg width={s} height={s} viewBox="0 0 44 44" fill="none" aria-hidden="true">
          <path d="M2 18 Q7 14 12 18 T22 18 T32 18 T42 18" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" opacity="0.9" />
          <path d="M2 26 Q7 22 12 26 T22 26 T32 26 T42 26" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" opacity="0.7" />
          <path d="M2 34 Q7 30 12 34 T22 34 T32 34 T42 34" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" opacity="0.5" />
          <circle cx="9" cy="10" r="1.5" fill={stroke} opacity="0.6" />
          <circle cx="24" cy="8" r="1" fill={stroke} opacity="0.4" />
          <circle cx="36" cy="11" r="1.2" fill={stroke} opacity="0.5" />
        </svg>
      );
    case 'wind':
      return (
        <svg width={s} height={s} viewBox="0 0 44 44" fill="none" aria-hidden="true">
          <path d="M4 14 H30 Q35 14 35 10 T31 6" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" fill="none" />
          <path d="M4 22 H36 Q41 22 41 18 T37 14" stroke={stroke} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.85" />
          <path d="M4 30 H28 Q33 30 33 26 T29 22" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.7" />
          <path d="M4 38 H20 Q25 38 25 34" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.5" />
        </svg>
      );
    case 'shockwave':
      return (
        <svg width={s} height={s} viewBox="0 0 44 44" fill="none" aria-hidden="true">
          <circle cx="22" cy="22" r="4" fill={stroke} opacity="0.9" />
          <circle cx="22" cy="22" r="8" stroke={stroke} strokeWidth="1.4" fill="none" opacity="0.7" />
          <circle cx="22" cy="22" r="13" stroke={stroke} strokeWidth="1.3" fill="none" opacity="0.5" />
          <circle cx="22" cy="22" r="18" stroke={stroke} strokeWidth="1.2" fill="none" opacity="0.3" strokeDasharray="2 3" />
          <path d="M22 2 V6 M22 38 V42 M2 22 H6 M38 22 H42" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        </svg>
      );
    case 'meteorite':
      return (
        <svg width={s} height={s} viewBox="0 0 44 44" fill="none" aria-hidden="true">
          <path d="M6 6 L20 20" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" opacity="0.5" />
          <path d="M12 4 L26 18" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" opacity="0.4" />
          <path d="M4 12 L18 26" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" opacity="0.4" />
          <circle cx="26" cy="26" r="6" fill={stroke} opacity="0.85" />
          <circle cx="34" cy="18" r="2.5" fill={stroke} opacity="0.6" />
          <circle cx="18" cy="34" r="2" fill={stroke} opacity="0.5" />
          <circle cx="36" cy="32" r="1.5" fill={stroke} opacity="0.4" />
          <circle cx="10" cy="38" r="1.2" fill={stroke} opacity="0.35" />
        </svg>
      );
    default:
      return (
        <svg width={s} height={s} viewBox="0 0 44 44" fill="none" aria-hidden="true">
          <circle cx="22" cy="22" r="8" stroke={stroke} strokeWidth="1.5" fill="none" />
        </svg>
      );
  }
}

// ─── Law icons for thematic categories ─────────────────────────────────────
// 8 kanuna karşılık gelen distinctive SVG'ler. Her biri sadece "stroke" ile
// çalışır — accent color dışarıdan verilir, ikonun kimliği farklı olur.

const LAW_ICONS = {
  'helak-kanunu': (color) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2 L4 22 L20 22 Z" stroke={color} strokeWidth="1.6" strokeLinejoin="round" fill={`${color}18`} />
      <path d="M12 9 V15" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="18" r="0.9" fill={color} />
    </svg>
  ),
  'yardim-kanunu': (color) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2 L4 6 V12 C4 17 8 21 12 22 C16 21 20 17 20 12 V6 Z" stroke={color} strokeWidth="1.6" strokeLinejoin="round" fill={`${color}18`} />
      <path d="M8.5 12 L11 14.5 L15.5 10" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  ),
  'imtihan-kanunu': (color) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3 C13 8 17 9 17 14 C17 17.3 14.8 20 12 20 C9.2 20 7 17.3 7 14 C7 11 9 9.5 10 7 C10.5 5.5 11 4 12 3 Z" stroke={color} strokeWidth="1.6" strokeLinejoin="round" fill={`${color}22`} />
      <circle cx="12" cy="15" r="1.5" fill={color} opacity="0.7" />
    </svg>
  ),
  'yaratma-kanunu': (color) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2 L14.5 9.5 L22 12 L14.5 14.5 L12 22 L9.5 14.5 L2 12 L9.5 9.5 Z" stroke={color} strokeWidth="1.4" strokeLinejoin="round" fill={`${color}18`} />
      <circle cx="12" cy="12" r="2" fill={color} opacity="0.9" />
    </svg>
  ),
  'nimet-sukur-kanunu': (color) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 20 C6 20 8 8 12 8 C16 8 18 20 18 20" stroke={color} strokeWidth="1.6" strokeLinecap="round" fill={`${color}12`} />
      <circle cx="12" cy="6" r="2" fill={`${color}30`} stroke={color} strokeWidth="1.3" />
      <path d="M9 14 H15" stroke={color} strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
      <path d="M10 17 H14" stroke={color} strokeWidth="1.4" strokeLinecap="round" opacity="0.5" />
    </svg>
  ),
  'ecel-kanunu': (color) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.6" fill={`${color}12`} />
      <path d="M12 7 V12 L15.5 15" stroke={color} strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <circle cx="12" cy="12" r="1" fill={color} />
    </svg>
  ),
  'zulum-kanunu': (color) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="8" width="16" height="10" rx="1" stroke={color} strokeWidth="1.5" fill={`${color}14`} />
      <path d="M8 4 V8 M12 4 V8 M16 4 V8" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8 13 L16 13 M8 16 L14 16" stroke={color} strokeWidth="1.4" strokeLinecap="round" opacity="0.65" />
    </svg>
  ),
  'sabir-nasr-kanunu': (color) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3 L12 21" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M12 8 Q7 6 4 9 T4 13 Q8 12 12 14" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill={`${color}12`} />
      <path d="M12 11 Q18 9 21 12 T20 16 Q16 15 12 17" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill={`${color}12`} />
    </svg>
  ),
};

function LawIcon({ id, color, size = 24 }) {
  const IconFn = LAW_ICONS[id];
  if (!IconFn) return null;
  return <span style={{ display: 'inline-flex', width: size, height: size, flexShrink: 0 }}>{IconFn(color)}</span>;
}

// ─── Main component ──────────────────────────────────────────────────────────
export default function SunnetullahAtlasi({ onClose }) {
  const { language } = useLanguage();
  const trapRef = useFocusTrap(true);
  const [data] = useState(sunnetullahDataStatic);
  const [activeTab, setActiveTab] = useState(0);
  const [activeCategoryId, setActiveCategoryId] = useState(sunnetullahDataStatic.thematicCategories?.[0]?.id ?? null);
  const [isMobile, setIsMobile] = useState(false)  // SSR-safe; useEffect h() post-mount hydrate;
  const bodyRef = useRef(null);

  // Escape key closes overlay
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  // Body scroll lock kaldırıldı — WowFacts/IlkSon pattern: normal-flow document scroll.

  // Mobile detection
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < BREAKPOINT_TABLET);
    h(); // post-mount hydrate
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  // Scroll to top on tab change
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
  }, [activeTab]);

  const SUNNETULLAH_TOOL_HEADER = (
    <ToolHeader
      icon={<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" /></svg>}
      titleTr="Sünnetullah Atlası"
      titleEn="Atlas of Divine Patterns"
      subtitleTr="Yükseliş-çöküş örüntüleri"
      subtitleEn="Patterns of rise and fall"
      language={language}
    />
  );

  // #204 (2026-07-16) — Sünnetullah literatürü, hem loading hem main render (SSR SEO)
  const SOURCES = (
    <div className="mq-box" style={{ maxWidth: 1200, margin: '0 auto', '--pt-d': "32px", '--pt-m': "24px", '--pr-d': "24px", '--pr-m': "16px", '--pb-d': "48px", '--pb-m': "32px", '--pl-d': "24px", '--pl-m': "16px", width: '100%' }}>
      <SourcesCitation
        language={language}
        isMobile={isMobile}
        sources={[
          {
            author: 'ez-Zemahşerî',
            workTr: "el-Keşşâf",
            workEn: 'al-Kashshāf',
            period: '1075–1144 (Harezm)',
            noteTr: "Sünnetullah bahsi (Fetih 48:23, Ahzâb 33:62) — Allah'ın değişmeyen yasasının tefsir perspektifinden kapsamlı analizi.",
            noteEn: "On sunnatullāh (Fatḥ 48:23, Aḥzāb 33:62) — comprehensive exegetical analysis of God's unchanging law.",
          },
          {
            author: 'er-Râzî',
            workTr: "Mefâtîhu'l-Ğayb",
            workEn: 'Mafātīḥ al-Ghayb',
            period: '1149–1209 (Rey)',
            noteTr: "Sünnetullah'ın kelâmî çerçevesi; ilâhî fiil, tarih ve kozmik nizamda örüntü kavramının epistemolojik temelleri.",
            noteEn: "Theological framing of sunnatullāh; epistemological foundations of pattern in divine action, history, and cosmic order.",
          },
          {
            author: 'Muhammed Bâkır es-Sadr',
            workTr: "es-Sünenü't-Târîhiyye fi'l-Kur'ân",
            workEn: 'al-Sunan al-Tarikhiyya fi\'l-Qur\'an',
            period: '1935–1980 (Necef)',
            noteTr: "Modern Kurʾânî sosyoloji — sünnetullah kavramını tarihsel değişim yasaları çerçevesinde teorize eden çağdaş klasik.",
            noteEn: 'Modern Quranic sociology — contemporary classic theorizing sunnatullāh as historical laws of change.',
          },
          {
            author: 'Muhammed İkbal',
            workTr: "İslam'da Dinî Düşüncenin Yeniden İnşası",
            workEn: 'The Reconstruction of Religious Thought in Islam',
            period: '1930 (Lahor)',
            noteTr: "Sünnetullah'ı tarih felsefesi + dinamik ilâhî yasa çerçevesinde okuyan modern islam düşüncesinin dönüm noktası.",
            noteEn: 'A turning point in modern Islamic thought — reading sunnatullāh as philosophy of history and dynamic divine law.',
          },
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
        {SUNNETULLAH_TOOL_HEADER}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: COLORS.silver, fontSize: '0.9rem', fontFamily: FONTS.body }}>
            {language === 'tr' ? 'Yükleniyor…' : 'Loading…'}
          </span>
        </div>
        {SOURCES}
      </div>
    );
  }

  const { meta, intro, literalOccurrences, thematicCategories, scholarViews, linguisticFormula } = data;

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
      {SUNNETULLAH_TOOL_HEADER}

      {/* ── SCROLLABLE BODY ─────────────────────────────────────────────── */}
      <div ref={bodyRef} style={{ flex: 1, overflowX: 'hidden' }}>

        {/* ── HERO ──────────────────────────────────────────────────────── */}
        <div className="mq-box" style={{
          '--pt-d': "60px", '--pt-m': "40px", '--pr-d': "48px", '--pr-m': "20px", '--pb-d': "36px", '--pb-m': "28px", '--pl-d': "48px", '--pl-m': "20px",
          background: 'linear-gradient(180deg, rgba(212,165,116,0.06) 0%, transparent 100%)',
          borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Islamic geometric pattern — subtle background */}
          <svg aria-hidden="true" width="100%" height="100%" style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            opacity: 0.05, mixBlendMode: 'screen',
          }}>
            <defs>
              <pattern id="sunnet-geometric" x="0" y="0" width="72" height="72" patternUnits="userSpaceOnUse">
                <path d="M36 6 L54 18 L54 42 L36 54 L18 42 L18 18 Z" stroke={COLORS.gold} strokeWidth="0.6" fill="none" />
                <path d="M36 18 L45 24 L45 36 L36 42 L27 36 L27 24 Z" stroke={COLORS.gold} strokeWidth="0.5" fill="none" opacity="0.6" />
                <circle cx="36" cy="30" r="2" fill={COLORS.gold} opacity="0.4" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#sunnet-geometric)" />
          </svg>
          {/* Center-glow radial (extra atmosphere) */}
          <div aria-hidden="true" style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%', height: '90%', pointerEvents: 'none',
            background: `radial-gradient(ellipse at center, ${COLORS.gold}0F 0%, transparent 70%)`,
            filter: 'blur(4px)',
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Bismillah ornament */}
          <div className="mq-box"
            dir="rtl" lang="ar" aria-label="Bismillāh"
            style={{
              fontFamily: FONTS.bismillah,
              fontSize: isMobile ? '1.5rem' : '1.95rem',
              color: COLORS.gold,
              opacity: 0.82,
              lineHeight: 1,
              '--mb-d': '40px', '--mb-m': '28px',
              textShadow: `0 0 22px ${COLORS.gold}28`,
            }}
          >
            ﷽
          </div>

          {/* Anchor verse — Fâtır 35:43 (the classical Sunnetullah verse) */}
          <p
            dir="rtl" lang="ar"
            style={{
              fontFamily: FONTS.quran,
              fontSize: isMobile ? 'clamp(1.05rem, 4.2vw, 1.4rem)' : 'clamp(1.25rem, 2.3vw, 1.7rem)',
              color: COLORS.gold,
              lineHeight: 2.1,
              margin: '0 auto 16px',
              maxWidth: '820px',
              textShadow: `0 0 20px ${COLORS.gold}1c`,
            }}
          >
            فَلَنْ تَجِدَ لِسُنَّتِ اللّٰهِ تَبْدِيلاً وَلَنْ تَجِدَ لِسُنَّتِ اللّٰهِ تَحْوِيلاً
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
            &quot;{language === 'tr'
              ? "Allah'ın sünnetinde asla bir değişme bulamazsın; Allah'ın sünnetinde asla bir sapma da bulamazsın."
              : "You will never find any change in the way of Allah; you will never find any deviation in the way of Allah."}&quot;
          </p>

          <p style={{
            color: COLORS.silver,
            fontFamily: FONTS.body,
            fontSize: '0.72rem',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            margin: '0 0 36px',
            opacity: 0.78,
          }}>
            — {language === 'tr' ? 'Fâtır 35:43' : 'Fāṭir 35:43'}
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
              ? <>Tarih tesadüf değildir. Aynı suç <em style={{ fontStyle: 'normal', color: COLORS.gold, opacity: 0.95 }}>aynı sonucu</em> doğurur — bu, Allah&apos;ın <em style={{ fontStyle: 'normal', color: COLORS.gold, opacity: 0.95 }}>değişmeyen yasası</em>dır.</>
              : <>History is no accident. The same sin produces <em style={{ fontStyle: 'normal', color: COLORS.gold, opacity: 0.95 }}>the same consequence</em> — this is Allah&apos;s <em style={{ fontStyle: 'normal', color: COLORS.gold, opacity: 0.95 }}>unchanging law</em>.</>}
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
            color: COLORS.gold, textTransform: 'uppercase',
            fontFamily: FONTS.body, fontWeight: 700,
            opacity: 0.75,
            marginBottom: '14px',
          }}>
            {language === 'tr' ? 'İLAHÎ ÖRÜNTÜ · TARİHİN YASASI' : 'DIVINE PATTERN · LAW OF HISTORY'}
          </div>

          {/* Big Title */}
          <h2 style={{
            color: COLORS.offWhite,
            fontSize: isMobile ? 'clamp(1.6rem, 7vw, 2rem)' : 'clamp(2rem, 3.6vw, 2.7rem)',
            fontWeight: 700,
            fontFamily: FONTS.display,
            margin: '0 auto 14px',
            lineHeight: 1.18,
            letterSpacing: '-0.015em',
            maxWidth: '760px',
          }}>
            {language === 'tr' ? intro.titleTr : intro.titleEn}
          </h2>

          {/* Dramatic subtitle */}
          <p style={{
            fontFamily: FONTS.display,
            fontSize: isMobile ? '1rem' : 'clamp(1.05rem, 1.8vw, 1.18rem)',
            color: COLORS.gold,
            margin: '0 auto 28px',
            lineHeight: 1.55,
            fontStyle: 'italic',
            maxWidth: '700px',
            opacity: 0.92,
          }}>
            {language === 'tr' ? intro.subtitleTr : intro.subtitleEn}
          </p>

          {/* Description (left-aligned body) */}
          <p style={{
            color: COLORS.silver,
            fontSize: '0.9rem',
            fontFamily: FONTS.body,
            margin: '0 auto 28px',
            lineHeight: 1.75,
            maxWidth: '720px',
            opacity: 0.95,
            textAlign: 'left',
          }}>
            {language === 'tr' ? intro.descTr : intro.descEn}
          </p>

          {/* Stat chips */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: isMobile ? '8px' : '12px',
            flexWrap: 'wrap',
          }}>
            {[
              { value: meta.totalLiteralOccurrences, tr: 'lafzî ayet', en: 'literal verses', color: COLORS.gold },
              { value: meta.totalThematicCategories, tr: 'tematik kanun', en: 'thematic laws', color: COLORS.emerald },
              { value: scholarViews.length, tr: 'ulema', en: 'scholars', color: COLORS.skyBlue },
              { value: data.kavimPatterns?.length ?? 0, tr: 'kavim', en: 'nations', color: '#a78bfa' },
            ].map((s, i) => (
              <div className="mq-box" key={i} style={{
                '--pt-d': "10px", '--pt-m': "8px", '--pr-d': "18px", '--pr-m': "14px", '--pb-d': "10px", '--pb-m': "8px", '--pl-d': "18px", '--pl-m': "14px",
                background: `${s.color}12`,
                border: `1px solid ${s.color}30`,
                borderRadius: RADIUS.pill,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <span style={{
                  color: s.color,
                  fontSize: '1rem',
                  fontWeight: 800,
                  fontFamily: FONTS.body,
                  lineHeight: 1,
                }}>
                  {s.value}
                </span>
                <span style={{
                  color: COLORS.silver,
                  fontSize: '0.75rem',
                  fontFamily: FONTS.body,
                  lineHeight: 1,
                }}>
                  {language === 'tr' ? s.tr : s.en}
                </span>
              </div>
            ))}
          </div>

          {/* ── LINGUISTIC FORMULA BOX — the "لن تجد" grammar breakdown ─── */}
          {linguisticFormula && (
            <FormulaBox formula={linguisticFormula} language={language} isMobile={isMobile} />
          )}
          </div>
        </div>

        {/* ── TAB BAR ───────────────────────────────────────────────────── */}
        <div className="mq-box" id="sunnetullah-tab-bar" style={{
          display: 'flex',
          gap: '2px',
          '--pt-d': "0", '--pt-m': "0", '--pr-d': "16px", '--pr-m': "8px", '--pb-d': "0", '--pb-m': "0", '--pl-d': "16px", '--pl-m': "8px",
          borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
          background: 'rgb(6, 8, 14)',
          backgroundColor: 'rgb(6, 8, 14)',
          isolation: 'isolate',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          flexShrink: 0,
          position: 'sticky',
          top: '110px',
          scrollMarginTop: '120px',
          zIndex: 20,
        }}>
          {TABS.map((tab, i) => {
            const isActive = activeTab === i;
            return (
              <button className="mq-box"
                key={i}
                onClick={() => { setActiveTab(i); setTimeout(() => { const _tb = document.getElementById('sunnetullah-tab-bar'); if (_tb) _tb.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 50); }}
                style={{
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  '--pt-d': "13px", '--pt-m': "12px", '--pr-d': "22px", '--pr-m': "14px", '--pb-d': "13px", '--pb-m': "12px", '--pl-d': "22px", '--pl-m': "14px",
                  border: 'none',
                  background: isActive ? COLORS.goldAlpha15 : 'transparent',
                  borderBottom: isActive ? `2px solid ${COLORS.gold}` : '2px solid transparent',
                  borderRadius: '0',
                  color: isActive ? COLORS.gold : COLORS.silver,
                  fontSize: isMobile ? '0.82rem' : '0.9rem',
                  fontFamily: FONTS.body,
                  fontWeight: isActive ? 600 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                    e.currentTarget.style.color = COLORS.offWhite;
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = COLORS.silver;
                  }
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{tab.icon}</span>
                <span>{language === 'tr' ? tab.tr : tab.en}</span>
              </button>
            );
          })}
        </div>

        {/* ── TAB CONTENT ───────────────────────────────────────────────── */}
        <div className="mq-box" style={{ '--pt-d': "32px", '--pt-m': "20px", '--pr-d': "40px", '--pr-m': "16px", '--pb-d': "64px", '--pb-m': "48px", '--pl-d': "40px", '--pl-m': "16px" }}>

          {activeTab === 0 && (
            <TabLafziAyetler items={literalOccurrences} language={language} isMobile={isMobile} />
          )}

          {activeTab === 1 && (
            <TabTematikKanunlar
              categories={thematicCategories}
              activeCategoryId={activeCategoryId}
              onSelect={setActiveCategoryId}
              language={language}
              isMobile={isMobile}
            />
          )}

          {activeTab === 2 && (
            <TabUlemaGorusleri views={scholarViews} language={language} isMobile={isMobile} />
          )}

          {activeTab === 3 && (
            <TabKavimPatterns patterns={data.kavimPatterns} language={language} isMobile={isMobile} />
          )}

          {/* Cross-tool CTA — sayfa sonu */}
          <CrossToolCTA
            language={language}
            isMobile={isMobile}
            links={[
              { href: `/${language}/atlas/kavim`,        titleTr: 'Kavimler Atlası',      titleEn: 'Nations Atlas',         descTr: 'Sünnetullah\'ın somut kayıtları — 20+ kavmin helak biçimleri ve gerekçeleri.',     descEn: 'Concrete records of sunnatullāh — modes of destruction of 20+ peoples and their causes.' },
              { href: `/${language}/atlas/kissa`,        titleTr: 'Kıssa Atlası',         titleEn: 'Story Atlas',           descTr: 'Peygamberlerin tekrarlanan örüntüsü: davet, ret, helak — sünnetullah\'ın yapısı.', descEn: 'The repeated pattern of prophets: call, rejection, destruction — the structure of sunnatullāh.' },
              { href: `/${language}/atlas/nefs-mertebeleri`, titleTr: 'Nefs Mertebeleri', titleEn: 'Stations of the Self',  descTr: 'İçsel sünnetullah — nefs-i emmâreden mutmainneye giden değişmeyen yasalar.',       descEn: 'Inner sunnatullāh — the unchanging laws from ammāra to muṭmaʾinna.' },
            ]}
          />

          {SOURCES}
        </div>
      </div>
    </div>
  );
}

// ─── Tab 1: Lafzî Ayetler ─────────────────────────────────────────────────────

function TabLafziAyetler({ items, language, isMobile }) {
  return (
    <div>
      <p style={{
        color: COLORS.silver,
        fontSize: isMobile ? '0.88rem' : '0.92rem',
        fontFamily: FONTS.body,
        lineHeight: 1.75,
        margin: '0 0 24px',
        maxWidth: '760px',
      }}>
        {language === 'tr'
          ? "Kur'ân-ı Kerîm'de 'sünnetullâh' ifadesi lafzen altı ayette geçer. Her birinin bağlamı farklıdır; ama ortak iddiası aynıdır — Allah'ın kanunları değişmez."
          : "The expression *sunnatullāh* appears literally in six verses of the Qur'an. Each has a different context, yet they share a single claim — God's laws do not change."
        }
      </p>

      <div className="g-1-2" style={{
        display: 'grid',
        gap: isMobile ? '14px' : '18px',
      }}>
        {items.map((item) => (
          <LiteralVerseCard key={item.id} item={item} language={language} isMobile={isMobile} />
        ))}
      </div>
    </div>
  );
}

function LiteralVerseCard({ item, language, isMobile }) {
  const [hover, setHover] = useState(false);
  // GLASS_CARD spread'inden `border` ve `borderRadius`'u ayır: shorthand `border`
  // ile aşağıdaki per-side long-form (borderLeftWidth/borderLeftColor) karışırsa
  // React "Updating a style property during rerender (border) when a conflicting
  // property is set (borderLeftColor/Left/LeftWidth) can lead to styling bugs"
  // uyarısı verir. Fix: long-form-only pattern.
  const { border: _b, ...glassBase } = GLASS_CARD;
  return (
    <div className="mq-box"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        ...glassBase,
        borderStyle: 'solid',
        borderTopWidth: '1px',
        borderRightWidth: '1px',
        borderBottomWidth: '1px',
        borderLeftWidth: '3px',
        borderTopColor: hover ? `${COLORS.gold}55` : COLORS.glassBorder,
        borderRightColor: hover ? `${COLORS.gold}55` : COLORS.glassBorder,
        borderBottomColor: hover ? `${COLORS.gold}55` : COLORS.glassBorder,
        borderLeftColor: COLORS.gold,
        '--pt-d': "20px", '--pt-m': "16px", '--pr-d': "22px", '--pr-m': "16px", '--pb-d': "18px", '--pb-m': "14px", '--pl-d': "22px", '--pl-m': "16px",
        transform: hover ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'all 0.2s',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      {/* Top row: verse ref + Sünnetullah badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
        <span style={{
          padding: '3px 10px',
          background: 'rgba(167,139,250,0.14)',
          border: `1px solid rgba(167,139,250,0.30)`,
          borderRadius: RADIUS.pill,
          color: COLORS.purple,
          fontSize: '0.72rem',
          fontFamily: FONTS.body,
          fontWeight: 600,
        }}>
          {item.verseRef}
        </span>
        <span style={{
          padding: '3px 10px',
          background: 'rgba(201,162,36,0.14)',
          border: `1px solid ${COLORS.gold}40`,
          borderRadius: RADIUS.pill,
          color: COLORS.gold,
          fontSize: '0.68rem',
          fontFamily: FONTS.body,
          fontWeight: 700,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
        }}>
          {language === 'tr' ? 'Sünnetullah' : 'Sunnatullāh'}
        </span>
      </div>

      {/* Arabic verse — canonical TEXT.verseArabic (§13.5) */}
      <div
        dir="rtl"
        lang="ar"
        style={{
          ...TEXT.verseArabic,
          fontSize: isMobile ? '1.35rem' : '1.55rem',
          color: COLORS.offWhite,
          lineHeight: 2.0,
        }}
      >
        {cleanArabic(item.verseAr)}
      </div>

      {/* Highlight phrase (the subject!) */}
      <div style={{
        background: 'rgba(201,162,36,0.08)',
        border: `1px solid ${COLORS.gold}35`,
        borderLeft: `2px solid ${COLORS.gold}`,
        borderRadius: '6px',
        padding: '10px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
      }}>
        <div
          dir="rtl"
          lang="ar"
          style={{
            fontFamily: FONTS.quran,
            fontSize: isMobile ? '1.05rem' : '1.25rem',
            color: COLORS.gold,
            direction: 'rtl',
            textAlign: 'right',
            lineHeight: 1.8,
          }}
        >
          {item.highlightPhraseAr}
        </div>
        <div style={{
          fontSize: '0.78rem',
          color: COLORS.offWhite,
          fontFamily: FONTS.body,
          fontStyle: 'italic',
          lineHeight: 1.55,
        }}>
          «{language === 'tr' ? item.highlightPhraseTr : item.highlightPhraseEn}»
        </div>
      </div>

      {/* Translation */}
      <p style={{
        color: COLORS.offWhite,
        fontSize: '0.85rem',
        fontFamily: FONTS.body,
        lineHeight: 1.65,
        margin: 0,
      }}>
        {language === 'tr' ? item.verseTr : item.verseEn}
      </p>

      {/* Context */}
      <p style={{
        color: COLORS.silver,
        fontSize: '0.78rem',
        fontFamily: FONTS.body,
        lineHeight: 1.65,
        margin: 0,
        fontStyle: 'italic',
      }}>
        {language === 'tr' ? item.contextTr : item.contextEn}
      </p>

      {/* Info note (dil/belâgat incelikleri) — always visible */}
      {(item.infoTr || item.infoEn) && (
        <div style={{
          background: 'rgba(52,152,219,0.07)',
          border: `1px solid rgba(52,152,219,0.22)`,
          borderRadius: '6px',
          padding: '10px 12px',
        }}>
          <div style={{
            fontSize: '0.62rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: COLORS.skyBlue,
            fontFamily: FONTS.body,
            marginBottom: '6px',
          }}>
            {language === 'tr' ? 'Dilbilim / Belâgat Notu' : 'Linguistic / Rhetorical Note'}
          </div>
          <p style={{
            color: COLORS.silver,
            fontSize: '0.77rem',
            fontFamily: FONTS.body,
            lineHeight: 1.65,
            margin: 0,
          }}>
            {language === 'tr' ? item.infoTr : item.infoEn}
          </p>
        </div>
      )}

      {/* Bottom chips: source + ekol */}
      <div style={{
        display: 'flex',
        gap: '6px',
        flexWrap: 'wrap',
        paddingTop: '8px',
        borderTop: `1px solid ${COLORS.glassBorderSoft}`,
      }}>
        <span style={{
          fontSize: '0.7rem',
          color: COLORS.silver,
          fontFamily: FONTS.body,
          flex: 1,
          minWidth: 0,
          lineHeight: 1.45,
        }}>
          {language === 'tr' ? item.sourceTr : item.sourceEn}
        </span>
        <EkolChip label={item.ekolEtiketi} />
      </div>
    </div>
  );
}

// ─── Tab 2: Tematik Kanunlar ──────────────────────────────────────────────────

function TabTematikKanunlar({ categories, activeCategoryId, onSelect, language, isMobile }) {
  const { openOverlay } = useQuranNav();
  const active = categories.find(c => c.id === activeCategoryId) ?? categories[0];
  if (!active) return null;

  return (
    <div>
      <p style={{
        color: COLORS.silver,
        fontSize: isMobile ? '0.88rem' : '0.92rem',
        fontFamily: FONTS.body,
        lineHeight: 1.75,
        margin: '0 0 20px',
        maxWidth: '760px',
      }}>
        {language === 'tr'
          ? "Lafzî geçişlerin ötesinde, Kur'ân sünnetullâh'ı on iki tematik kanun olarak ortaya koyar. Her biri farklı bir kavim örneğiyle — ama hepsi aynı ilke etrafında."
          : "Beyond literal occurrences, the Qur'an presents *sunnatullāh* as twelve thematic laws. Each illustrated by different peoples — all revolving around the same principle."
        }
      </p>

      {/* Category chips */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        marginBottom: '24px',
      }}>
        {categories.map(cat => {
          const isActive = cat.id === activeCategoryId;
          return (
            <button className="mq-box"
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              style={{
                '--pt-d': "8px", '--pt-m': "6px", '--pr-d': "16px", '--pr-m': "12px", '--pb-d': "8px", '--pb-m': "6px", '--pl-d': "16px", '--pl-m': "12px",
                borderRadius: RADIUS.pill,
                border: `1px solid ${isActive ? cat.color : COLORS.glassBorder}`,
                background: isActive ? `${cat.color}22` : 'transparent',
                color: isActive ? cat.color : COLORS.silver,
                fontSize: isMobile ? '0.78rem' : '0.85rem',
                fontWeight: isActive ? 600 : 400,
                fontFamily: FONTS.body,
                cursor: 'pointer',
                transition: 'all 0.18s',
                whiteSpace: 'nowrap',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                boxShadow: isActive ? `0 0 14px ${cat.color}22` : 'none',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = `${cat.color}10`; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
            >
              <LawIcon id={cat.id} color={isActive ? cat.color : COLORS.silver} size={16} />
              <span>{language === 'tr' ? cat.titleTr : cat.titleEn}</span>
              <span style={{ opacity: 0.65, fontSize: '0.72rem' }}>({cat.items.length})</span>
            </button>
          );
        })}
      </div>

      {/* Category header */}
      <div className="mq-box" style={{
        '--pt-d': "26px", '--pt-m': "20px", '--pr-d': "28px", '--pr-m': "18px", '--pb-d': "26px", '--pb-m': "20px", '--pl-d': "28px", '--pl-m': "18px",
        background: `linear-gradient(135deg, ${active.color}12 0%, rgba(255,255,255,0.02) 60%)`,
        border: `1px solid ${active.color}35`,
        borderLeft: `4px solid ${active.color}`,
        borderRadius: '10px',
        marginBottom: '20px',
        display: 'flex', alignItems: 'flex-start', gap: '16px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Ambient glow */}
        <div aria-hidden="true" style={{
          position: 'absolute', top: '-40px', right: '-40px',
          width: '180px', height: '180px', pointerEvents: 'none',
          background: `radial-gradient(circle at center, ${active.color}22 0%, transparent 60%)`,
          filter: 'blur(3px)',
        }} />
        {/* Big icon */}
        <div style={{
          flexShrink: 0,
          width: isMobile ? '46px' : '56px', height: isMobile ? '46px' : '56px',
          borderRadius: '50%',
          background: `radial-gradient(circle at center, ${active.color}25 0%, ${active.color}08 70%, transparent 100%)`,
          border: `1px solid ${active.color}55`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 0 20px ${active.color}22`,
          zIndex: 1,
        }}>
          <LawIcon id={active.id} color={active.color} size={isMobile ? 26 : 32} />
        </div>
        <div style={{ flex: 1, minWidth: 0, position: 'relative', zIndex: 1 }}>
        <h3 style={{
          color: active.color,
          fontSize: isMobile ? '1.15rem' : '1.35rem',
          fontFamily: FONTS.display,
          fontWeight: 700,
          margin: '0 0 10px',
          lineHeight: 1.3,
        }}>
          {language === 'tr' ? active.titleTr : active.titleEn}
        </h3>
        <p style={{
          color: COLORS.offWhite,
          fontSize: '0.88rem',
          fontFamily: FONTS.body,
          lineHeight: 1.7,
          margin: 0,
        }}>
          {language === 'tr' ? active.descTr : active.descEn}
        </p>
        </div>
      </div>

      {/* Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
        {active.items.map((item, i) => (
          <ThematicItemCard key={item.id} item={item} accent={active.color} index={i} language={language} isMobile={isMobile} />
        ))}
      </div>

      {/* Scholar note */}
      <div className="mq-box" style={{
        '--pt-d': "20px", '--pt-m': "16px", '--pr-d': "24px", '--pr-m': "16px", '--pb-d': "20px", '--pb-m': "16px", '--pl-d': "24px", '--pl-m': "16px",
        background: 'rgba(255,255,255,0.025)',
        border: `1px solid ${COLORS.glassBorder}`,
        borderRadius: '10px',
        marginBottom: (active.modernNoteTr || active.scienceNoteTr) ? '14px' : '0',
      }}>
        <div style={{
          fontSize: '0.65rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          color: COLORS.gold,
          fontFamily: FONTS.body,
          marginBottom: '10px',
        }}>
          {language === 'tr' ? 'Ulema Notu' : 'Scholar Note'}
        </div>
        <p style={{
          color: COLORS.offWhite,
          fontSize: '0.86rem',
          fontFamily: FONTS.body,
          lineHeight: 1.75,
          margin: 0,
          fontStyle: 'italic',
        }}>
          {language === 'tr' ? active.scholarNoteTr : active.scholarNoteEn}
        </p>
      </div>

      {/* Modern note (Izutsu etc.) */}
      {(active.modernNoteTr || active.modernNoteEn) && (
        <WarningNote
          kind="modern"
          label={language === 'tr' ? 'Modern Akademik Not' : 'Modern Academic Note'}
          body={language === 'tr' ? active.modernNoteTr : active.modernNoteEn}
          isMobile={isMobile}
        />
      )}

      {/* Science note (analogy with caveat) */}
      {(active.scienceNoteTr || active.scienceNoteEn) && (
        <WarningNote
          kind="science"
          label={language === 'tr' ? 'Bilimsel Paralellik — Dikkat' : 'Scientific Parallel — Caveat'}
          body={language === 'tr' ? active.scienceNoteTr : active.scienceNoteEn}
          isMobile={isMobile}
        />
      )}

      {/* Ekol etiketi at bottom */}
      <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
        <EkolChip label={active.ekolEtiketi} />
      </div>

      {/* Cross-link to Kavimler Atlası — somut helâk örnekleri için */}
      {active.id === 'helak-kanunu' && (
        <button className="mq-box"
          onClick={() => openOverlay('kavimler')}
          style={{
            width: '100%',
            marginTop: '20px',
            '--pt-d': "14px", '--pt-m': "14px", '--pr-d': "22px", '--pr-m': "16px", '--pb-d': "14px", '--pb-m': "14px", '--pl-d': "22px", '--pl-m': "16px",
            background: 'rgba(212,165,116,0.06)',
            border: '1px solid rgba(212,165,116,0.3)',
            borderRadius: '10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            transition: 'all 0.2s',
            textAlign: 'left',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(212,165,116,0.12)';
            e.currentTarget.style.borderColor = 'rgba(212,165,116,0.5)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(212,165,116,0.06)';
            e.currentTarget.style.borderColor = 'rgba(212,165,116,0.3)';
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ color: COLORS.gold, fontSize: '0.74rem', fontWeight: 600, letterSpacing: '0.1em', margin: '0 0 3px', fontFamily: FONTS.body }}>
              {language === 'tr' ? '↗ KAVİMLER ATLASI' : '↗ NATIONS ATLAS'}
            </p>
            <p style={{ color: COLORS.silver, fontSize: '0.82rem', fontFamily: FONTS.body, margin: 0, lineHeight: 1.5 }}>
              {language === 'tr'
                ? 'Bu kanunun somut tarihsel uygulamaları: Âd · Semûd · Lût kavmi · Firavun · Sebe — helâk biçimleri ve arkeolojik izler'
                : 'Concrete historical applications of this law: ʿĀd · Thamūd · the people of Lot · Pharaoh · Sabaʾ — modes of destruction and archaeological traces'}
            </p>
          </div>
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.7 }}>
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      )}
    </div>
  );
}

function ThematicItemCard({ item, accent, index, language, isMobile }) {
  return (
    <div className="mq-box" style={{
      ...VERSE_DISPLAY_CARD,
      borderLeft: `3px solid ${accent}`,
      '--pt-d': "18px", '--pt-m': "14px", '--pr-d': "22px", '--pr-m': "16px", '--pb-d': "18px", '--pb-m': "14px", '--pl-d': "22px", '--pl-m': "16px",
    }}>
      {/* Header: number badge + verseRef */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '12px',
      }}>
        <div style={{
          width: '26px',
          height: '26px',
          borderRadius: RADIUS.full,
          background: `${accent}18`,
          border: `1px solid ${accent}40`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.7rem',
          fontWeight: 800,
          color: accent,
          fontFamily: FONTS.body,
          flexShrink: 0,
        }}>
          {String(index + 1).padStart(2, '0')}
        </div>
        <span style={{
          color: accent,
          fontSize: '0.88rem',
          fontFamily: FONTS.body,
          fontWeight: 700,
        }}>
          {item.verseRef}
        </span>
      </div>

      {/* Arabic */}
      <div
        dir="rtl"
        lang="ar"
        style={{
          fontFamily: FONTS.quran,
          fontSize: isMobile ? '1.3rem' : '1.5rem',
          color: COLORS.offWhite,
          direction: 'rtl',
          textAlign: 'right',
          lineHeight: 2.0,
          marginBottom: '12px',
        }}
      >
        {cleanArabic(item.verseAr)}
      </div>

      {/* Translation */}
      <p style={{
        color: COLORS.silver,
        fontSize: '0.85rem',
        fontFamily: FONTS.body,
        lineHeight: 1.7,
        margin: 0,
        fontStyle: 'italic',
      }}>
        {language === 'tr' ? item.verseTr : item.verseEn}
      </p>
    </div>
  );
}

function WarningNote({ kind, label, body, isMobile }) {
  // kind: 'modern' => sky blue, 'science' => soft red (dikkat)
  const color = kind === 'science' ? COLORS.softRed : COLORS.skyBlue;
  return (
    <div className="mq-box" style={{
      '--pt-d': "18px", '--pt-m': "14px", '--pr-d': "22px", '--pr-m': "16px", '--pb-d': "18px", '--pb-m': "14px", '--pl-d': "22px", '--pl-m': "16px",
      background: `${color}0D`,
      border: `1px solid ${color}40`,
      borderLeft: `3px solid ${color}`,
      borderRadius: '10px',
      marginBottom: '14px',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '0.68rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        color: color,
        fontFamily: FONTS.body,
        marginBottom: '10px',
      }}>
        <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        {label}
      </div>
      <p style={{
        color: COLORS.offWhite,
        fontSize: '0.85rem',
        fontFamily: FONTS.body,
        lineHeight: 1.75,
        margin: 0,
      }}>
        {body}
      </p>
    </div>
  );
}

// ─── Tab 3: Ulema Görüşleri ───────────────────────────────────────────────────

function TabUlemaGorusleri({ views, language, isMobile }) {
  return (
    <div>
      <p style={{
        color: COLORS.silver,
        fontSize: isMobile ? '0.88rem' : '0.92rem',
        fontFamily: FONTS.body,
        lineHeight: 1.75,
        margin: '0 0 24px',
        maxWidth: '760px',
      }}>
        {language === 'tr'
          ? "Sünnetullâh kavramı klasik ve çağdaş ulemanın üzerinde yüzyıllarca çalıştığı bir meseledir. Aşağıda dört temsilî ses — klasik tefsir, eş'arî kelâm ve çağdaş akademi."
          : "*Sunnatullāh* is a concept scholars have engaged for centuries. Below are four representative voices — classical tafsīr, Ashʿarite *kalām*, and contemporary academia."
        }
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {views.map((view) => (
          <ScholarCard key={view.id} view={view} language={language} isMobile={isMobile} />
        ))}
      </div>
    </div>
  );
}

function ScholarCard({ view, language, isMobile }) {
  const isFazlur = view.id === 'fazlur-rahman';
  const accent = isFazlur ? COLORS.softRed : COLORS.gold;

  return (
    <div className="mq-box" style={{
      ...GLASS_CARD,
      borderLeft: `3px solid ${accent}`,
      '--pt-d': "24px", '--pt-m': "18px", '--pr-d': "28px", '--pr-m': "16px", '--pb-d': "24px", '--pb-m': "18px", '--pl-d': "28px", '--pl-m': "16px",
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    }}>
      {/* Header: scholar + century chip */}
      <div style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: '12px',
        flexWrap: 'wrap',
      }}>
        <h3 style={{
          color: COLORS.offWhite,
          fontSize: isMobile ? '1.25rem' : '1.55rem',
          fontFamily: FONTS.display,
          fontWeight: 700,
          margin: 0,
          lineHeight: 1.2,
        }}>
          {language === 'tr' ? view.scholar : (view.scholarEn ?? view.scholar)}
        </h3>
        <span style={{
          padding: '3px 10px',
          background: `${accent}18`,
          border: `1px solid ${accent}35`,
          borderRadius: RADIUS.pill,
          color: accent,
          fontSize: '0.7rem',
          fontFamily: FONTS.body,
          fontWeight: 600,
          whiteSpace: 'nowrap',
        }}>
          {view.century}
        </span>
      </div>

      {/* Work name */}
      <div style={{
        color: COLORS.silver,
        fontSize: '0.85rem',
        fontFamily: FONTS.body,
        fontStyle: 'italic',
        margin: 0,
      }}>
        {language === 'tr' ? view.work : (view.workEn ?? view.work)}
      </div>

      {/* Insight */}
      <p style={{
        color: COLORS.offWhite,
        fontSize: isMobile ? '0.88rem' : '0.92rem',
        fontFamily: FONTS.body,
        lineHeight: 1.8,
        margin: 0,
      }}>
        {language === 'tr' ? view.insightTr : view.insightEn}
      </p>

      {/* Source */}
      <div style={{
        fontSize: '0.75rem',
        color: SEMANTIC.textFaint,
        fontFamily: FONTS.body,
        lineHeight: 1.55,
        paddingTop: '4px',
      }}>
        {language === 'tr' ? view.sourceTr : view.sourceEn}
      </div>

      {/* Fazlur Rahman — contested source warning (always visible) */}
      {isFazlur && (view.infoTr || view.infoEn) && (
        <div className="mq-box" style={{
          '--pt-d': "16px", '--pt-m': "14px", '--pr-d': "20px", '--pr-m': "16px", '--pb-d': "16px", '--pb-m': "14px", '--pl-d': "20px", '--pl-m': "16px",
          background: `${COLORS.softRed}0D`,
          border: `1px solid ${COLORS.softRed}50`,
          borderRadius: '8px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.7rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: COLORS.softRed,
            fontFamily: FONTS.body,
            marginBottom: '10px',
          }}>
            <AlertTriangleIcon size={14} strokeWidth={2.2} />
            {language === 'tr' ? 'Tartışmalı Kaynak — Uyarı Notu' : 'Contested Source — Caveat'}
          </div>
          <p style={{
            color: COLORS.offWhite,
            fontSize: '0.82rem',
            fontFamily: FONTS.body,
            lineHeight: 1.75,
            margin: 0,
          }}>
            {language === 'tr' ? view.infoTr : view.infoEn}
          </p>
        </div>
      )}

      {/* Ekol chip at bottom */}
      <div style={{
        paddingTop: '8px',
        borderTop: `1px solid ${COLORS.glassBorderSoft}`,
        display: 'flex',
        justifyContent: 'flex-end',
      }}>
        <EkolChip label={view.ekolEtiketi} />
      </div>
    </div>
  );
}

// ─── FormulaBox — inline "لن تجد" linguistic breakdown widget ───────────────
// Yerleşim: Hero'nun altında, tab bar'ın üstünde. Anchor verse'ın Arapça
// gramatik yapısını 4 parçalı görsel breakdown ile açar. Her parça hover/click
// ile ayrı bir kart açar (mobile: her zaman genişlemiş).

function FormulaBox({ formula, language, isMobile }) {
  const [activePart, setActivePart] = useState(null);
  const tr = language === 'tr';
  const parts = formula.partsTr; // both TR/EN share same structure keys
  return (
    <div className="mq-box" style={{
      '--mt-d': "48px", '--mt-m': "40px", '--mr-d': "auto", '--mr-m': "auto", '--mb-d': "0", '--mb-m': "0", '--ml-d': "auto", '--ml-m': "auto",
      maxWidth: '820px',
      '--pt-d': "32px", '--pt-m': "24px", '--pr-d': "32px", '--pr-m': "18px", '--pb-d': "32px", '--pb-m': "24px", '--pl-d': "32px", '--pl-m': "18px",
      background: 'linear-gradient(180deg, rgba(212,165,116,0.05) 0%, rgba(212,165,116,0.02) 100%)',
      border: `1px solid ${COLORS.gold}30`,
      borderRadius: RADIUS.md,
      textAlign: 'left',
    }}>
      {/* Eyebrow */}
      <div style={{
        fontSize: '0.66rem', letterSpacing: '0.22em',
        color: COLORS.gold, textTransform: 'uppercase',
        fontFamily: FONTS.body, fontWeight: 700,
        opacity: 0.85, marginBottom: '10px', textAlign: 'center',
      }}>
        {tr ? 'Formül · لن تجد لسنة الله تبديلا' : 'Formula · لن تجد لسنة الله تبديلا'}
      </div>

      {/* Arabic verse (large) */}
      <p
        dir="rtl" lang="ar"
        style={{
          fontFamily: FONTS.quran,
          fontSize: isMobile ? '1.15rem' : '1.55rem',
          color: COLORS.gold,
          lineHeight: 2.0,
          margin: '0 auto 6px',
          textAlign: 'center',
          textShadow: `0 0 18px ${COLORS.gold}22`,
        }}
      >
        {formula.verseAr}
      </p>

      <p style={{
        fontFamily: FONTS.display, fontStyle: 'italic',
        color: COLORS.offWhite, fontSize: '0.88rem',
        textAlign: 'center', margin: '0 0 6px', opacity: 0.9,
      }}>
        &quot;{tr ? formula.verseTr : formula.verseEn}&quot;
      </p>

      <p style={{
        color: COLORS.silver, fontSize: '0.66rem',
        letterSpacing: '0.14em', textTransform: 'uppercase',
        textAlign: 'center', margin: '0 0 22px', opacity: 0.78,
        fontFamily: FONTS.body,
      }}>
        — {formula.sourceRef}
      </p>

      {/* 4-part breakdown */}
      <div className="g-1-4" style={{
        display: 'grid',
        gap: isMobile ? '8px' : '10px',
        marginBottom: '18px',
      }}>
        {parts.map((p, i) => {
          const isActive = activePart === i;
          return (
            <button className="mq-box"
              key={i}
              onClick={() => setActivePart(isActive ? null : i)}
              style={{
                '--pt-d': "14px", '--pt-m': "12px", '--pr-d': "12px", '--pr-m': "14px", '--pb-d': "14px", '--pb-m': "12px", '--pl-d': "12px", '--pl-m': "14px",
                background: isActive ? `${COLORS.gold}18` : 'rgba(255,255,255,0.025)',
                border: `1px solid ${isActive ? COLORS.gold + '55' : COLORS.gold + '20'}`,
                borderRadius: RADIUS.sm,
                cursor: 'pointer',
                textAlign: 'center',
                fontFamily: FONTS.body,
                transition: 'all 0.18s',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(212,165,116,0.08)'; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.025)'; }}
            >
              <div dir="rtl" lang="ar" style={{
                fontFamily: FONTS.quran,
                fontSize: isMobile ? '1.15rem' : '1.35rem',
                color: COLORS.gold,
                lineHeight: 1.8,
                marginBottom: '4px',
              }}>
                {p.part}
              </div>
              <div style={{
                fontSize: '0.68rem', color: COLORS.silver,
                fontStyle: 'italic', letterSpacing: '0.04em',
                marginBottom: '4px', opacity: 0.78,
              }}>
                {p.translit}
              </div>
              <div style={{
                fontSize: '0.72rem', color: COLORS.offWhite,
                fontWeight: 600, lineHeight: 1.35,
              }}>
                {tr ? p.labelTr : p.labelEn}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active part explanation */}
      {activePart !== null && (
        <div style={{
          padding: '14px 18px',
          background: 'rgba(212,165,116,0.06)',
          border: `1px solid ${COLORS.gold}35`,
          borderLeft: `3px solid ${COLORS.gold}`,
          borderRadius: RADIUS.sm,
          marginBottom: '18px',
        }}>
          <p style={{
            fontSize: '0.82rem', color: COLORS.offWhite,
            fontFamily: FONTS.body, lineHeight: 1.7,
            margin: 0, fontStyle: 'italic',
          }}>
            {tr ? parts[activePart].explanationTr : parts[activePart].explanationEn}
          </p>
        </div>
      )}

      {/* Structural note (always visible) */}
      <div style={{
        padding: '12px 16px',
        background: 'rgba(52,152,219,0.06)',
        border: `1px solid rgba(52,152,219,0.18)`,
        borderRadius: RADIUS.sm,
        borderLeft: `2px solid ${COLORS.skyBlue}`,
      }}>
        <div style={{
          fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.14em',
          color: COLORS.skyBlue, textTransform: 'uppercase',
          fontFamily: FONTS.body, marginBottom: '6px', opacity: 0.9,
        }}>
          {tr ? 'Yapısal Not · Klasik Belâgat' : 'Structural Note · Classical Balāgha'}
        </div>
        <p style={{
          fontSize: '0.78rem', color: COLORS.silver,
          fontFamily: FONTS.body, lineHeight: 1.7,
          margin: 0,
        }}>
          {tr ? formula.structuralNoteTr : formula.structuralNoteEn}
        </p>
      </div>

      {!isMobile && activePart === null && (
        <p style={{
          fontSize: '0.7rem', color: COLORS.silver,
          fontFamily: FONTS.body, fontStyle: 'italic',
          textAlign: 'center', margin: '14px 0 0', opacity: 0.78,
        }}>
          {tr ? '↑ bir parçaya tıkla — dilbilim analizini aç' : '↑ click any part to reveal the linguistic analysis'}
        </p>
      )}
    </div>
  );
}

// ─── Tab 4: Kavim Örüntüleri ─────────────────────────────────────────────────
// 6 helâk edilen kavim, her biri için uyarı → red → sonuç akışı.
// Her card: prophet meta + verses + 3-stage flow + laws invoked + source.

function TabKavimPatterns({ patterns, language, isMobile }) {
  const tr = language === 'tr';
  return (
    <div>
      <p style={{
        color: COLORS.silver, fontSize: isMobile ? '0.88rem' : '0.92rem',
        fontFamily: FONTS.body, lineHeight: 1.75, margin: '0 0 24px',
      }}>
        {tr
          ? 'Kur\'ân, sünnetullah kanununun somut kayıtlarını 10 kavim üzerinden gösterir. Her biri farklı bir peygamberin uyarısına, farklı bir helâk biçimine ve farklı bir sebebe sahiptir — ama örüntü aynıdır: peygamber → uyarı → yalanlama → delil → sonuç. Bu tab bu örüntüyü kavim kavim açar; daha kapsamlı arkeoloji ve tarihsel tartışma için '
          : 'The Qur\'an demonstrates the concrete records of the sunnatullāh law through 10 nations. Each has a different prophet\'s warning, a different mode of destruction, and a different cause — but the pattern is identical: prophet → warning → rejection → sign → outcome. This tab unfolds the pattern nation by nation; for more extensive archaeology and historical discussion, see '}
        <a href={`/${language}/atlas/kavim`} style={{ color: COLORS.gold, borderBottom: `1px dashed ${COLORS.gold}55`, textDecoration: 'none' }}>
          {tr ? 'Kavimler Atlası' : 'the Nations Atlas'}
        </a>.
      </p>

      {/* Comparison grid — 10 kavim at once */}
      <KavimComparisonGrid patterns={patterns} language={language} isMobile={isMobile} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {patterns.map((p, i) => (
          <KavimPatternCard key={p.id} pattern={p} index={i + 1} language={language} isMobile={isMobile} />
        ))}
      </div>
    </div>
  );
}

// KavimComparisonGrid — 10 kavim tek görünümde, mode-icon vurgulu.
// Amaç: tab'a girer girmez görsel bir "aynı örüntü, farklı sahne" özeti.
function KavimComparisonGrid({ patterns, language, isMobile }) {
  const tr = language === 'tr';
  return (
    <div className="mq-box" style={{
      marginBottom: '32px',
      '--pt-d': "26px", '--pt-m': "20px", '--pr-d': "28px", '--pr-m': "16px", '--pb-d': "26px", '--pb-m': "20px", '--pl-d': "28px", '--pl-m': "16px",
      background: 'linear-gradient(180deg, rgba(212,165,116,0.04) 0%, rgba(212,165,116,0.01) 100%)',
      border: `1px solid ${COLORS.gold}25`,
      borderRadius: RADIUS.md,
    }}>
      <div style={{
        fontSize: '0.66rem', letterSpacing: '0.2em',
        color: COLORS.gold, textTransform: 'uppercase',
        fontFamily: FONTS.body, fontWeight: 700,
        opacity: 0.85, marginBottom: '18px', textAlign: 'center',
      }}>
        {tr ? 'Örüntü Panoraması — On Kavim, Tek Yasa' : 'Pattern Panorama — Ten Nations, One Law'}
      </div>
      <div className="g-2-6" style={{
        display: 'grid',
        gap: isMobile ? '10px' : '14px',
      }}>
        {patterns.map(p => {
          const accent = p.color || COLORS.gold;
          return (
            <div key={p.id} style={{
              padding: '14px 8px 12px',
              background: 'rgba(255,255,255,0.02)',
              border: `1px solid ${accent}30`,
              borderRadius: RADIUS.sm,
              textAlign: 'center',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: '6px',
              transition: 'all 0.2s ease',
              cursor: 'default',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = `${accent}12`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.transform = 'none'; }}
            >
              <div style={{
                width: '48px', height: '48px', borderRadius: '50%',
                background: `radial-gradient(circle at center, ${accent}25 0%, ${accent}05 70%, transparent 100%)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 0 18px ${accent}18`,
              }}>
                <ModeIcon mode={p.iconMode} color={accent} size={30} />
              </div>
              <div style={{
                fontSize: '0.78rem', fontWeight: 700,
                color: COLORS.offWhite, fontFamily: FONTS.body,
                lineHeight: 1.25,
              }}>
                {(tr ? p.titleTr : p.titleEn).split(' ')[0]}
              </div>
              <div style={{
                fontSize: '0.66rem', color: accent,
                fontFamily: FONTS.body, fontWeight: 600,
                lineHeight: 1.35,
              }}>
                {tr ? p.prophetTr : p.prophetEn}
              </div>
              <div style={{
                fontSize: '0.62rem', color: COLORS.silver,
                fontFamily: FONTS.body, fontStyle: 'italic',
                lineHeight: 1.35, opacity: 0.85,
              }}>
                {(tr ? p.modeTr : p.modeEn).split(' ')[0].replace(/,$/, '')}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function KavimPatternCard({ pattern, index, language, isMobile }) {
  const tr = language === 'tr';
  const accent = pattern.color || COLORS.gold;
  return (
    <div className="mq-box" style={{
      '--pt-d': "28px", '--pt-m': "20px", '--pr-d': "32px", '--pr-m': "18px", '--pb-d': "28px", '--pb-m': "20px", '--pl-d': "32px", '--pl-m': "18px",
      background: `linear-gradient(135deg, ${accent}0A 0%, rgba(255,255,255,0.02) 45%)`,
      border: `1px solid ${accent}35`,
      borderLeft: `3px solid ${accent}`,
      borderRadius: RADIUS.md,
      display: 'flex', flexDirection: 'column', gap: '18px',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.25s ease',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${accent}18`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      {/* Ambient corner glow */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: '-30px', right: '-30px',
        width: '160px', height: '160px', pointerEvents: 'none',
        background: `radial-gradient(circle at center, ${accent}22 0%, transparent 65%)`,
        filter: 'blur(2px)',
      }} />

      {/* Header — mode icon + index + title + meta */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: isMobile ? '12px' : '18px',
        flexWrap: 'wrap', position: 'relative', zIndex: 1,
      }}>
        {/* Mode icon — visual identity */}
        <div style={{
          flexShrink: 0,
          width: isMobile ? '52px' : '64px', height: isMobile ? '52px' : '64px',
          borderRadius: '50%',
          background: `radial-gradient(circle at center, ${accent}20 0%, ${accent}08 70%, transparent 100%)`,
          border: `1px solid ${accent}55`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 0 24px ${accent}22, inset 0 0 12px ${accent}12`,
        }}>
          <ModeIcon mode={pattern.iconMode} color={accent} size={isMobile ? 32 : 40} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.18em',
            color: accent, textTransform: 'uppercase',
            fontFamily: FONTS.body, marginBottom: '4px', opacity: 0.85,
          }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: '20px', height: '20px', borderRadius: '50%',
              background: `${accent}22`, border: `1px solid ${accent}55`,
              fontSize: '0.68rem', fontWeight: 800,
            }}>{index}</span>
            {tr ? 'Kavim Örüntüsü' : 'Nation Pattern'}
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
            <h3 style={{
              margin: 0,
              fontFamily: FONTS.display,
              fontSize: isMobile ? '1.3rem' : '1.55rem',
              fontWeight: 700, color: COLORS.offWhite,
              lineHeight: 1.2,
              flex: 1,
            }}>
              {tr ? pattern.titleTr : pattern.titleEn}
            </h3>
            {/* #200 (2026-07-16) — Bookmark this pattern */}
            <BookmarkButton
              item={{
                id: `sunnetullah:${pattern.id || pattern.titleEn?.slice(0, 40) || pattern.titleTr?.slice(0, 40)}`,
                type: 'sunnetullah',
                title: tr ? pattern.titleTr : pattern.titleEn,
                subtitle: tr ? pattern.prophetTr : pattern.prophetEn,
                description: (tr ? pattern.summaryTr : pattern.summaryEn || '').slice(0, 240),
                url: `/${language}/atlas/sunnetullah`,
              }}
              size="sm"
              language={language}
            />
          </div>
          <div style={{
            display: 'flex', gap: '14px', flexWrap: 'wrap',
            marginTop: '8px', fontSize: '0.74rem',
            color: COLORS.silver, fontFamily: FONTS.body,
          }}>
            <span><span style={{ opacity: 0.55 }}>{tr ? 'Peygamber:' : 'Prophet:'}</span> <strong style={{ color: accent, fontWeight: 600 }}>{tr ? pattern.prophetTr : pattern.prophetEn}</strong></span>
            <span><span style={{ opacity: 0.55 }}>{tr ? 'Süre:' : 'Duration:'}</span> {tr ? pattern.durationTr : pattern.durationEn}</span>
            <span><span style={{ opacity: 0.55 }}>{tr ? 'Biçim:' : 'Mode:'}</span> <strong style={{ color: COLORS.offWhite, fontWeight: 600 }}>{tr ? pattern.modeTr : pattern.modeEn}</strong></span>
          </div>
        </div>
      </div>

      {/* 3-stage flow */}
      <div className="g-1-3" style={{
        display: 'grid',
        gap: '10px',
      }}>
        {[
          { key: 'warning',   labelTr: 'Uyarı / Sebep',     labelEn: 'Warning / Cause',      body: tr ? pattern.warningTr : pattern.warningEn,     dot: '#c9a227' },
          { key: 'rejection', labelTr: 'Yalanlama',         labelEn: 'Rejection',            body: tr ? pattern.rejectionTr : pattern.rejectionEn, dot: '#e67e22' },
          { key: 'outcome',   labelTr: 'Sonuç · Sünnetullah', labelEn: 'Outcome · Sunnatullāh', body: tr ? pattern.outcomeTr : pattern.outcomeEn,     dot: accent },
        ].map((stage) => (
          <div key={stage.key} style={{
            padding: '12px 14px',
            background: 'rgba(255,255,255,0.02)',
            border: `1px solid ${COLORS.glassBorderSoft}`,
            borderRadius: RADIUS.sm,
            display: 'flex', flexDirection: 'column', gap: '6px',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              fontSize: '0.62rem', fontWeight: 700,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              color: stage.dot, fontFamily: FONTS.body,
            }}>
              <span style={{
                width: '5px', height: '5px', borderRadius: '50%',
                background: stage.dot, flexShrink: 0,
              }} />
              {tr ? stage.labelTr : stage.labelEn}
            </div>
            <p style={{
              margin: 0, color: COLORS.offWhite,
              fontSize: '0.8rem', fontFamily: FONTS.body,
              lineHeight: 1.65,
            }}>
              {stage.body}
            </p>
          </div>
        ))}
      </div>

      {/* Bottom row: verses + laws invoked */}
      <div className="fd-row" style={{
        display: 'flex',
        gap: '14px', paddingTop: '12px',
        borderTop: `1px solid ${COLORS.glassBorderSoft}`,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.14em',
            color: COLORS.gold, textTransform: 'uppercase',
            fontFamily: FONTS.body, marginBottom: '6px', opacity: 0.75,
          }}>
            {tr ? 'Ayet Kaynakları' : 'Verse References'}
          </div>
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
            {pattern.verses.map((v, vi) => (
              <span key={vi} style={{
                padding: '3px 9px',
                background: 'rgba(212,165,116,0.10)',
                border: `1px solid ${COLORS.gold}30`,
                borderRadius: RADIUS.pill,
                fontSize: '0.7rem', color: COLORS.gold,
                fontFamily: FONTS.body, fontWeight: 500,
              }}>{v}</span>
            ))}
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.14em',
            color: COLORS.emerald, textTransform: 'uppercase',
            fontFamily: FONTS.body, marginBottom: '6px', opacity: 0.75,
          }}>
            {tr ? 'İşleyen Kanunlar' : 'Laws in Play'}
          </div>
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
            {(tr ? pattern.lawsInvokedTr : pattern.lawsInvokedEn).map((l, li) => (
              <span key={li} style={{
                padding: '3px 9px',
                background: 'rgba(26,122,76,0.10)',
                border: `1px solid ${COLORS.emerald}30`,
                borderRadius: RADIUS.pill,
                fontSize: '0.7rem', color: COLORS.emerald,
                fontFamily: FONTS.body, fontWeight: 500,
              }}>{l}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Source line */}
      <p style={{
        margin: 0, fontSize: '0.7rem', color: COLORS.silver,
        fontFamily: FONTS.body, lineHeight: 1.5,
        opacity: 0.78, fontStyle: 'italic',
      }}>
        {tr ? pattern.sourceTr : pattern.sourceEn}
      </p>
    </div>
  );
}

// ─── Ekol etiketi chip ───────────────────────────────────────────────────────

function EkolChip({ label }) {
  if (!label) return null;
  return (
    <span style={{
      padding: '2px 10px',
      border: `1px solid ${COLORS.silver}40`,
      borderRadius: RADIUS.pill,
      color: COLORS.silver,
      fontSize: '0.68rem',
      fontFamily: FONTS.body,
      fontStyle: 'italic',
      whiteSpace: 'nowrap',
      flexShrink: 0,
    }}>
      {label}
    </span>
  );
}

