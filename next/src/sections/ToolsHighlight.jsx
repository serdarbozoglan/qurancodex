'use client';

// ─── ToolsHighlight section ───────────────────────────────────────────────────
// "İnteraktif Araçlar" — discovery-layer showcase for 6 featured analysis tools.
// Sits below AllTopics, above the existing long-form content.
//
// Distinct from the existing ToolsShowcase (which lives near the bottom of the
// page and serves as the closing layer): this section is positioned at the top
// to give tools their deserved prominence in the discovery flow.
//
// Tool selection (curated, justified):
//   1. Ayet Haritası        — VerseGraph, the flagship visualization
//   2. Peygamberler Atlası  — ProphetAtlas, narrative-spatial analysis
//   3. Esmâ-i Hüsnâ         — EsmaFrekans, divine names & self-description (114 names)
//   4. Sebeb-i Nüzul        — SebebiNuzul, bidirectional event/verse search
//   5. Kıssa Atlası         — KissaAtlas, prophet stories grid
//   6. Diyalog Ağı          — DiyalogAgi, who speaks to whom
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import SectionWrapper, { fadeUpItem } from '../components/SectionWrapper';
import ToolHighlightCard from '../components/ToolHighlightCard';
import { useLanguage } from '../i18n/LanguageContext';
import { useQuranNav } from '../hooks/useQuranNav';
import { COLORS, FONTS, RADIUS } from '../tokens';

// ── 6 featured tools ────────────────────────────────────────────────────────
// Esmâ-i Hüsnâ 1. sırada — sayfanın flagship vitrin parçası (114 isim ve sıfat).
const FEATURED_TOOLS = [
  {
    id: 'esma',
    overlay: 'esma',
    titleTr: 'Esmâ-i Hüsnâ',
    titleEn: 'The Beautiful Names',
    descTr: "Allah'ın Kur'an'da kendini tanıtması · 114 isim ve sıfat",
    descEn: 'How God describes Himself in the Quran · 114 names & attributes',
    icon: (
      <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    id: 'graph',
    overlay: 'graph',
    titleTr: 'Ayet Haritası',
    titleEn: 'Verse Map',
    descTr: '6.236 ayeti uzayda gör · semantik ilişki ağı',
    descEn: 'See 6,236 verses in 3D space · semantic network',
    icon: (
      <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <circle cx="5"  cy="6"  r="2.5" />
        <circle cx="14" cy="4"  r="1.5" />
        <circle cx="20" cy="10" r="3" />
        <circle cx="8"  cy="16" r="2" />
        <circle cx="18" cy="19" r="1.5" />
        <circle cx="3"  cy="19" r="1" />
        <circle cx="12" cy="12" r="1" />
      </svg>
    ),
  },
  {
    id: 'prophet',
    overlay: 'prophet',
    titleTr: 'Peygamberler Atlası',
    titleEn: 'Prophets Atlas',
    descTr: '23 yıla yayılan anlatıların gizli haritası',
    descEn: 'The hidden map of narratives across 23 years',
    icon: (
      <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="5"  cy="12" r="2" />
        <circle cx="12" cy="5"  r="2" />
        <circle cx="19" cy="12" r="2" />
        <circle cx="12" cy="19" r="2" />
        <path d="M7 12h3M14 12h3M12 7v3M12 14v3" />
      </svg>
    ),
  },
  {
    id: 'sebeb',
    overlay: 'sebeb',
    titleTr: 'Sebeb-i Nüzul',
    titleEn: 'Occasions of Revelation',
    descTr: '~570 ayet · olay→ayet & ayet→olay · çift yönlü arama',
    descEn: '~570 verses · event→verse & verse→event · bidirectional',
    icon: (
      <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
        <path d="M12 7v5l4 2" />
      </svg>
    ),
  },
  {
    id: 'kissa',
    overlay: 'kissa',
    titleTr: 'Kıssa Atlası',
    titleEn: 'Story Atlas',
    descTr: '4 peygamber — hangi sûrede hangi sahne?',
    descEn: '4 prophets — which scene in which surah?',
    icon: (
      <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="8" y1="13" x2="16" y2="13" />
        <line x1="8" y1="17" x2="13" y2="17" />
      </svg>
    ),
  },
  {
    id: 'diyalog',
    overlay: 'diyalog',
    titleTr: 'Diyalog Ağı',
    titleEn: 'Dialogue Network',
    descTr: 'Kim kiminle konuşuyor? ~300 diyalog · 25 eksen',
    descEn: 'Who speaks to whom? ~300 dialogues · 25 axes',
    icon: (
      <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
];

export default function ToolsHighlight() {
  const { language } = useLanguage();
  const { openOverlay } = useQuranNav();
  const reduced = useReducedMotion();
  // SSR-safe: start with 1 (matches server render), useEffect hydrates with
  // actual viewport-based column count after mount. Prevents hydration mismatch.
  const [columns, setColumns] = useState(1);

  useEffect(() => {
    const h = () => setColumns(getColumnCount(window.innerWidth));
    h(); // post-mount measurement
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  // "Tüm Araçları Gör" → open the centered ToolsBrowser modal.
  // The modal is intentional, persistent, doesn't conflict with underlying
  // content, and matches the user intent ("browse all tools") rather than
  // navigation ("go somewhere"). Long-term: dedicated /araclar page.
  const handleViewAll = () => openOverlay('allTools');

  return (
    <SectionWrapper id="tools-highlight" dark={false}>
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
          {language === 'tr' ? 'İnteraktif Araçlar' : 'Interactive Tools'}
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
          letterSpacing: '-0.01em',
        }}
      >
        {language === 'tr' ? 'Veriyle Keşfet, Görselle Anla' : 'Explore Data, See It Live'}
      </motion.h2>

      {/* Subtitle — Hero baseline imza. */}
      <motion.p
        variants={fadeUpItem}
        className="max-w-2xl mb-10"
        style={{
          fontFamily: FONTS.body,
          color: COLORS.offWhiteAlpha78,
          fontSize: 'clamp(0.95rem, 1.6vw, 1.0625rem)',
          lineHeight: 1.7,
          letterSpacing: '0.01em',
        }}
      >
        {language === 'tr'
          ? "Sitenin en güçlü yanı: 6.236 ayeti farklı açılardan tarayan interaktif modüller. Aşağıda 6 öne çıkan araç."
          : 'The strongest part of the site: interactive modules that scan all 6,236 verses from different angles. Six featured tools below.'}
      </motion.p>

      {/* Tools grid */}
      <motion.div
        variants={fadeUpItem}
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: columns === 1 ? '14px' : '18px',
        }}
      >
        {FEATURED_TOOLS.map((tool) => (
          <ToolHighlightCard
            key={tool.id}
            icon={tool.icon}
            titleTr={tool.titleTr}
            titleEn={tool.titleEn}
            descTr={tool.descTr}
            descEn={tool.descEn}
            onClick={() => openOverlay(tool.overlay)}
          />
        ))}
      </motion.div>

      {/* "View all tools" CTA — secondary imzası: Hero primary'nin sönük yansıması.
          Statik gold halo + hover'da glow yükselir + scale 1.02 (primary 1.04'ten
          alçak — secondary aksiyon hiyerarşisi). Framer-only hover; DOM mouseenter
          ile çift sistem yok. */}
      <motion.div
        variants={fadeUpItem}
        style={{
          marginTop: '24px',
          display: 'flex',
          justifyContent: 'flex-start',
        }}
      >
        <motion.button
          type="button"
          onClick={handleViewAll}
          whileHover={
            reduced
              ? undefined
              : {
                  scale: 1.02,
                  backgroundColor: COLORS.goldAlpha15,
                  borderColor: COLORS.goldAlpha45,
                  boxShadow: `0 0 28px 2px ${COLORS.goldAlpha15}`,
                }
          }
          whileTap={reduced ? undefined : { scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 320, damping: 24 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '11px 20px',
            background: 'transparent',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: COLORS.goldAlpha25,
            borderRadius: RADIUS.md,
            cursor: 'pointer',
            color: COLORS.gold,
            fontFamily: FONTS.body,
            fontSize: '0.82rem',
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            boxShadow: `0 0 16px ${COLORS.goldAlpha04}`,
          }}
        >
          {language === 'tr' ? 'Tüm Araçları Gör' : 'View All Tools'}
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </motion.button>
      </motion.div>
    </SectionWrapper>
  );
}

function getColumnCount(width) {
  if (width >= 1024) return 3;
  if (width >= 640)  return 2;
  return 1;
}
