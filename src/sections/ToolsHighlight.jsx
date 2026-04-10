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
//   3. Esmaül Hüsna         — EsmaFrekans, divine names frequency
//   4. Sebeb-i Nüzul        — SebebiNuzul, bidirectional event/verse search
//   5. Kıssa Atlası         — KissaAtlas, prophet stories grid
//   6. Diyalog Ağı          — DiyalogAgi, who speaks to whom
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SectionWrapper, { fadeUpItem } from '../components/SectionWrapper';
import ToolHighlightCard from '../components/ToolHighlightCard';
import { useLanguage } from '../i18n/LanguageContext';
import { useQuranNav } from '../hooks/useQuranNav';
import { COLORS, FONTS } from '../tokens';

// ── 6 featured tools ────────────────────────────────────────────────────────
const FEATURED_TOOLS = [
  {
    id: 'graph',
    overlay: 'graph',
    titleTr: 'Ayet Haritası',
    titleEn: 'Verse Map',
    descTr: '6.236 ayeti uzayda gör · semantik ilişki ağı',
    descEn: 'See 6,236 verses in 3D space · semantic network',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="none">
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
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="5"  cy="12" r="2" />
        <circle cx="12" cy="5"  r="2" />
        <circle cx="19" cy="12" r="2" />
        <circle cx="12" cy="19" r="2" />
        <path d="M7 12h3M14 12h3M12 7v3M12 14v3" />
      </svg>
    ),
  },
  {
    id: 'esma',
    overlay: 'esma',
    titleTr: 'Esmaül Hüsna',
    titleEn: 'Divine Names',
    descTr: "99 ismin Kur'an'daki frekans analizi",
    descEn: 'Frequency analysis of the 99 divine names in the Quran',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
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
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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
    descTr: '4 peygamber — hangi surede hangi sahne?',
    descEn: '4 prophets — which scene in which surah?',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
];

export default function ToolsHighlight() {
  const { language } = useLanguage();
  const { openOverlay } = useQuranNav();
  const [columns, setColumns] = useState(() => getColumnCount(window.innerWidth));

  useEffect(() => {
    const h = () => setColumns(getColumnCount(window.innerWidth));
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  // "Tüm Araçları Gör" → open the Tools mega-menu in Navbar without scrolling.
  // Navbar is fixed-top so the dropdown emerges from the top of the viewport
  // while the user keeps their current scroll position. Single, consistent
  // mechanism for all "view tools" actions across the page.
  // Long-term: dedicated /araclar page with all 17 tools and category filters.
  const handleViewAll = () => openOverlay('toolsMenu');

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
        }}
      >
        {language === 'tr' ? 'Veriyle Keşfet, Görselle Anla' : 'Explore Data, See It Live'}
      </motion.h2>

      {/* Subtitle */}
      <motion.p
        variants={fadeUpItem}
        className="text-silver text-lg leading-relaxed max-w-3xl mb-10"
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

      {/* "View all tools" CTA */}
      <motion.div
        variants={fadeUpItem}
        style={{
          marginTop: '24px',
          display: 'flex',
          justifyContent: 'flex-start',
        }}
      >
        <button
          type="button"
          onClick={handleViewAll}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            background: 'transparent',
            border: `1px solid ${COLORS.goldAlpha25}`,
            borderRadius: '8px',
            cursor: 'pointer',
            color: COLORS.gold,
            fontFamily: FONTS.body,
            fontSize: '0.85rem',
            fontWeight: 600,
            letterSpacing: '0.04em',
            transition: 'background 0.2s, border-color 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = COLORS.goldAlpha15;
            e.currentTarget.style.borderColor = COLORS.goldAlpha45;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.borderColor = COLORS.goldAlpha25;
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
        </button>
      </motion.div>
    </SectionWrapper>
  );
}

function getColumnCount(width) {
  if (width >= 1024) return 3;
  if (width >= 640)  return 2;
  return 1;
}
