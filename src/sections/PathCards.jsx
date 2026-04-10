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
import { useQuranNav } from '../hooks/useQuranNav';
import { COLORS, FONTS } from '../tokens';

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
    target: 'history',
    titleTr: 'Peygamberleri ve Kıssaları Tanı',
    titleEn: 'Meet the Prophets and Their Stories',
    descTr: '23 yıla yayılan vahyin içindeki insan hikayeleri',
    descEn: 'The human stories woven through 23 years of revelation',
    steps: [
      { tr: 'Tarihsel Kanıtlar', en: 'Historical Proof' },
      { tr: 'Kıssa Atlası',      en: 'Story Atlas' },
      { tr: 'Peygamberler',      en: 'Prophets' },
      { tr: 'Kavimler',          en: 'Nations' },
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
    target: 'science',
    titleTr: 'Evren ve Bilim',
    titleEn: 'Universe and Science',
    descTr: 'Modern bilimin 1.400 yıl sonra keşfettikleri',
    descEn: 'What modern science only discovered 1,400 years later',
    steps: [
      { tr: 'Bilimsel İşaretler', en: 'Scientific Signs' },
      { tr: 'Kevni Ayetler',      en: 'Cosmic Signs' },
      { tr: 'Zaman Boyutları',    en: 'Dimensions of Time' },
      { tr: 'Cennet & Cehennem',  en: 'Heaven & Hell' },
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
  const { scrollToSection } = useQuranNav();
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 768);
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

      {/* Heading */}
      <motion.h2
        variants={fadeUpItem}
        style={{
          fontFamily: FONTS.display,
          fontSize: 'clamp(1.8rem, 4vw, 2.75rem)',
          fontWeight: 700,
          color: COLORS.offWhite,
          marginTop: '12px',
          marginBottom: '12px',
          maxWidth: '60ch',
          lineHeight: 1.15,
        }}
      >
        {language === 'tr' ? 'Nereden Başlamak İstiyorsun?' : 'Where Do You Want to Begin?'}
      </motion.h2>

      {/* Subtitle */}
      <motion.p
        variants={fadeUpItem}
        className="text-silver text-lg leading-relaxed max-w-3xl mb-10"
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
          gap: isMobile ? '14px' : '20px',
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
            onClick={() => scrollToSection(path.target)}
          />
        ))}
      </motion.div>
    </SectionWrapper>
  );
}
