'use client';

// ─── AllTopics section ────────────────────────────────────────────────────────
// "Tüm İçerikler" — comprehensive grid of every discovery topic, organized by
// category. Each TopicCard either scrolls to a long-form section on the page
// (kind="section") or opens an interactive module overlay (kind="overlay").
//
// Visual differentiator (decision in todo_v1.1.md, Faz 2):
//   - section items: → arrow icon
//   - overlay items: ↗ external-link icon (rendered by TopicCard automatically)
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SectionWrapper, { fadeUpItem } from '../components/SectionWrapper';
import TopicCard from '../components/TopicCard';
import { useLanguage } from '../i18n/LanguageContext';
import { useQuranNav } from '../hooks/useQuranNav';
import { COLORS, FONTS } from '../tokens';
// v1.1 — shared categories source (used by Navbar Keşfet dropdown too)
import { EXPLORE_CATEGORIES } from '../data/exploreCategories';

export default function AllTopics() {
  const { language } = useLanguage();
  const { scrollToSection, openOverlay } = useQuranNav();
  const [columns, setColumns] = useState(() => typeof window !== 'undefined' ? getColumnCount(window.innerWidth) : 1);

  useEffect(() => {
    const h = () => setColumns(getColumnCount(window.innerWidth));
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  const handleClick = (item) => {
    if (item.kind === 'section') {
      scrollToSection(item.target);
    } else {
      openOverlay(item.target);
    }
  };

  return (
    <SectionWrapper id="all-topics" dark={true}>
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
          {language === 'tr' ? 'İçerik Haritası' : 'Content Map'}
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
        {language === 'tr' ? 'Tüm İçerikler' : 'All Topics'}
      </motion.h2>

      {/* Subtitle + legend */}
      <motion.p
        variants={fadeUpItem}
        className="text-silver text-lg leading-relaxed max-w-3xl mb-4"
      >
        {language === 'tr'
          ? 'Tüm konular tek yerde. Kategoriden bir başlık seç.'
          : 'Every topic in one place. Pick a heading from any category.'}
      </motion.p>

      {/* Legend — pill container, more prominent than original 0.78rem text */}
      <motion.div
        variants={fadeUpItem}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '14px',
          flexWrap: 'wrap',
          marginBottom: '28px',
          padding: '10px 18px',
          background: COLORS.glassBgFaint,
          border: `1px solid ${COLORS.glassBorderSoft}`,
          borderRadius: '999px',
          fontFamily: FONTS.body,
        }}
      >
        {/* Section legend item */}
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.82rem',
            color: COLORS.offWhite,
            fontWeight: 500,
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '22px',
              height: '22px',
              borderRadius: '50%',
              background: COLORS.silverAlpha12,
              color: COLORS.silver,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </span>
          {language === 'tr' ? 'Sayfaya gider' : 'Jumps to section'}
        </span>

        {/* Vertical divider */}
        <span style={{ width: '1px', height: '20px', background: COLORS.glassBorder }} />

        {/* Overlay legend item */}
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.82rem',
            color: COLORS.gold,
            fontWeight: 600,
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '22px',
              height: '22px',
              borderRadius: '50%',
              background: COLORS.goldAlpha15,
              border: `1px solid ${COLORS.goldAlpha25}`,
              color: COLORS.gold,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 4h6v6" />
              <path d="M20 4L10 14" />
              <path d="M19 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6" />
            </svg>
          </span>
          {language === 'tr' ? 'İnteraktif modülde açar' : 'Opens interactive module'}
        </span>
      </motion.div>

      {/* Categories grid */}
      <motion.div
        variants={fadeUpItem}
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: '24px',
        }}
      >
        {EXPLORE_CATEGORIES.map((cat) => (
          <div key={cat.id}>
            {/* Category label */}
            <h3
              style={{
                fontFamily: FONTS.body,
                fontSize: '0.72rem',
                fontWeight: 700,
                color: COLORS.gold,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                marginBottom: '12px',
                paddingBottom: '8px',
                borderBottom: `1px solid ${COLORS.goldAlpha25}`,
              }}
            >
              {language === 'tr' ? cat.titleTr : cat.titleEn}
            </h3>

            {/* Topic items — icon is a React component in exploreCategories.jsx,
                so we instantiate it here before passing to TopicCard which
                expects pre-rendered JSX. */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {cat.items.map((item) => {
                const Icon = item.icon;
                return (
                  <TopicCard
                    key={`${cat.id}-${item.id}`}
                    icon={<Icon size={18} />}
                    titleTr={item.titleTr}
                    titleEn={item.titleEn}
                    descTr={item.descTr}
                    descEn={item.descEn}
                    kind={item.kind}
                    onClick={() => handleClick(item)}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </motion.div>
    </SectionWrapper>
  );
}

function getColumnCount(width) {
  if (width >= 1280) return 4;
  if (width >= 768)  return 2;
  return 1;
}
