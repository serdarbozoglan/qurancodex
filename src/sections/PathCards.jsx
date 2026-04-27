// ─── PathCards section ────────────────────────────────────────────────────────
// "Nereden Başlamak İstiyorsun?" — the discovery layer's primary entry point.
// Renders 4 large PathCards in a 2x2 grid (desktop) or horizontally scrollable
// row (mobile). Each card scrolls to a curated section in the long-form content
// area below.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SectionWrapper, { fadeUpItem } from '../components/SectionWrapper';
import PathCard from '../components/PathCard';
import { useLanguage } from '../i18n/LanguageContext';
// v1.2 — clicking a card activates path mode (PathContext) instead of a
// one-shot scroll. Path step lists live in src/data/paths.jsx; the visual
// metadata (icon / title / desc / pill preview) stays here in PathCards
// because it only matters for the card UI itself.
import { usePath } from '../contexts/PathContext';
import { COLORS, FONTS, BREAKPOINT_TABLET } from '../tokens';

// ── Path definitions ────────────────────────────────────────────────────────
// Each path corresponds to one PathCard. The first step is the scroll target.
const PATHS = [
  {
    id: 'dil',
    target: 'linguistic',
    titleTr: "Kur'an'ın Dilini Keşfet",
    titleEn: "Discover the Quran's Language",
    descTr: 'Arapça bilmeden anlayabileceğin dilbilimsel mucizeler',
    descEn: 'Linguistic miracles you can grasp without knowing Arabic',
    steps: [
      { tr: 'Dilsel DNA',          en: 'Linguistic DNA' },
      { tr: 'İmkansız Ritim',      en: 'Impossible Rhythm' },
      { tr: 'Ses Mimarisi',        en: 'Sound Architecture' },
      { tr: "Kur'an'ın Retoriği",  en: 'Quranic Rhetoric' },
    ],
    icon: (
      // Sound wave / cadence
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12h2M6 7v10M10 4v16M14 7v10M18 10v4M22 12h-2" />
      </svg>
    ),
  },
  {
    id: 'peygamberler',
    target: 'history', // legacy field, unused now that the card triggers path mode
    titleTr: 'Peygamberleri ve Kıssaları Tanı',
    titleEn: 'Meet the Prophets and Their Stories',
    descTr: '23 yıla yayılan vahyin içindeki insan hikayeleri',
    descEn: 'The human stories woven through 23 years of revelation',
    // Pill preview must match paths.jsx step order — prophets path is
    // 3 overlay steps after the content-accuracy revision (2026-04-10).
    steps: [
      { tr: 'Kıssa Atlası',       en: 'Story Atlas' },
      { tr: 'Peygamberler Atlası',en: 'Prophets Atlas' },
      { tr: 'Kavimler Atlası',    en: 'Nations Atlas' },
    ],
    icon: (
      // Path / footprints
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="5"  r="1.6" fill="currentColor" />
        <circle cx="7"  cy="11" r="1.4" fill="currentColor" />
        <circle cx="16" cy="13" r="1.4" fill="currentColor" />
        <circle cx="9"  cy="18" r="1.2" fill="currentColor" />
        <circle cx="14" cy="20" r="1.2" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: 'insan',
    target: 'human-definition',
    titleTr: 'İnsan ve Ruh Haritası',
    titleEn: 'Map of the Human Soul',
    descTr: "Kur'an insanı nasıl tanımlıyor, nasıl dönüştürüyor?",
    descEn: 'How the Quran defines and transforms the human being',
    steps: [
      { tr: "Kur'an'da İnsan",   en: 'The Human in the Quran' },
      { tr: 'İnsan Psikolojisi', en: 'Human Psychology' },
      { tr: 'Dua Dili',          en: 'Language of Prayer' },
      { tr: 'Dua Ayetleri',      en: 'Prayer Verses' },
    ],
    icon: (
      // Heart-in-circle
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 16s-4-2.5-4-5.5A2.5 2.5 0 0 1 12 8a2.5 2.5 0 0 1 4 2.5C16 13.5 12 16 12 16z" />
      </svg>
    ),
  },
  {
    id: 'evren',
    target: 'science', // legacy field, unused now that the card triggers path mode
    titleTr: 'Evren ve Bilim',
    titleEn: 'Universe and Science',
    descTr: 'Kâinat ayetleri ve bilim — paralellikler ve sınırlar',
    descEn: 'Cosmic verses and science — parallels and limits',
    // Pill preview must match paths.jsx step order. Tarihsel Kanıtlar moved
    // here from the Prophets path because its content is archaeological
    // verification (same epistemic category as Scientific Signs). Cennet &
    // Cehennem removed — eschatology, not physical cosmos.
    steps: [
      { tr: 'Bilimsel İşaretler', en: 'Scientific Signs' },
      { tr: 'Tarihsel Kanıtlar',  en: 'Historical Proof' },
      { tr: 'Kevni Ayetler',      en: 'Cosmic Signs' },
      { tr: 'Zaman Boyutları',    en: 'Dimensions of Time' },
    ],
    icon: (
      // Star / cosmos
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l2.4 6.5L21 9.3l-5 4.6 1.5 6.6L12 17l-5.5 3.5L8 14l-5-4.6 6.6-.8z" />
      </svg>
    ),
  },
];

export default function PathCards() {
  const { language } = useLanguage();
  const { startPath, isPathCompleted } = usePath();
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < BREAKPOINT_TABLET);

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < BREAKPOINT_TABLET);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  return (
    <SectionWrapper id="path-cards" dark={false}>
      {/* Section label */}
      <motion.div variants={fadeUpItem}>
        <span
          style={{
            color: COLORS.gold,
            opacity: 0.6,
            fontSize: '0.75rem',
            fontFamily: FONTS.body,
            textTransform: 'uppercase',
            letterSpacing: '0.3em',
          }}
        >
          {language === 'tr' ? 'Keşif Yolları' : 'Discovery Paths'}
        </span>
      </motion.div>

      {/* Heading — slightly tighter than other sections so the 2x2 grid
          plus heading + subtitle fit cleanly inside one viewport when the
          user clicks "Keşfe Başla" from Hero. */}
      <motion.h2
        variants={fadeUpItem}
        style={{
          fontFamily: FONTS.display,
          fontSize: 'clamp(1.7rem, 3.6vw, 2.4rem)',
          fontWeight: 700,
          color: COLORS.offWhite,
          marginTop: '8px',
          marginBottom: '8px',
          maxWidth: '60ch',
          lineHeight: 1.15,
        }}
      >
        {language === 'tr' ? 'Nereden Başlamak İstiyorsun?' : 'Where Do You Want to Begin?'}
      </motion.h2>

      {/* Subtitle */}
      <motion.p
        variants={fadeUpItem}
        className="text-silver leading-relaxed max-w-3xl mb-6"
        style={{ fontSize: '0.95rem' }}
      >
        {language === 'tr'
          ? 'Konuya göre bir yol seç. Her yol seni bir keşif zincirinden geçirir.'
          : 'Pick a path by topic. Each one walks you through a chain of discoveries.'}
      </motion.p>

      {/* Cards grid */}
      <motion.div
        variants={fadeUpItem}
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
          gap: isMobile ? '12px' : '16px',
        }}
      >
        {PATHS.map((path) => (
          <PathCard
            key={path.id}
            icon={path.icon}
            titleTr={path.titleTr}
            titleEn={path.titleEn}
            descTr={path.descTr}
            descEn={path.descEn}
            steps={path.steps}
            completed={isPathCompleted(path.id)}
            // v1.2 — activate path mode (PathContext handles scroll/overlay)
            onClick={() => startPath(path.id)}
          />
        ))}
      </motion.div>
    </SectionWrapper>
  );
}
