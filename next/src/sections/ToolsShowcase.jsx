'use client';

// ─── ToolsShowcase (closing layer only) ──────────────────────────────────────
// Originally a featured-tools grid plus a "Henüz yüzeyi gördünüz" closing
// block. The tools grid was removed in v1.1 redesign because it duplicated
// the new ToolsHighlight section in the discovery layer. What remains is the
// closing CTA: a single moment near the bottom of the page where we tell the
// visitor they've only seen the surface and offer two doors to dive deeper.
//
// Both CTA buttons (Keşfet, Araçlar) trigger the corresponding Navbar
// mega-menu via custom events. No scroll jump — the Navbar is fixed-top, so
// the dropdown emerges from the top of the viewport while the user keeps
// their scroll position.
// ─────────────────────────────────────────────────────────────────────────────

import { motion } from 'framer-motion';
import SectionWrapper, { fadeUpItem } from '../components/SectionWrapper';
import { useLanguage } from '../i18n/LanguageContext';
import { useQuranNav } from '../hooks/useQuranNav';
import { COLORS, FONTS } from '../tokens';

export default function ToolsShowcase() {
  const { language } = useLanguage();
  const { openOverlay } = useQuranNav();

  const openExplore = () => openOverlay('exploreMenu');
  // Closing-layer "Araçlar" button → top navbar Araçlar dropdown (mirrors
  // the "Keşfet" button above). Both buttons now open the navbar's own
  // mega-menu so the bottom surface stays consistent with the top one.
  const openTools   = () => openOverlay('toolsMenu');

  return (
    <SectionWrapper id="tools-showcase" noPadding className="py-[30px] px-6 md:px-12 lg:px-16">
      {/* ── Discovery closing layer ─────────────────────────────────── */}
      <motion.div variants={fadeUpItem} style={{ textAlign: 'center', marginTop: '8px' }}>
        {/* Title — closing-layer h3 (sub-headline, not a section H2).
            Kept compact on purpose: this is a transitional CTA, not a chapter. */}
        <h3
          style={{
            fontFamily: FONTS.display,
            fontSize: 'clamp(1.25rem, 2.4vw, 1.6rem)',
            fontWeight: 700,
            color: COLORS.gold,
            letterSpacing: '-0.005em',
            lineHeight: 1.2,
            margin: '0 0 1rem',
          }}
        >
          {language === 'tr' ? 'Henüz yüzeyi gördünüz' : 'You’ve only seen the surface'}
        </h3>

        {/* Stat chips */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
          {[
            { num: '25+', label: language === 'tr' ? 'araç' : 'tools' },
            { num: '8',   label: language === 'tr' ? 'keşif bölümü' : 'discovery sections' },
            { num: '6.236', label: language === 'tr' ? 'ayet' : 'verses' },
            { num: '114', label: language === 'tr' ? 'sûre' : 'surahs' },
          ].map((s, i) => (
            <div key={i}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full"
              style={{
                background: COLORS.goldAlpha04,
                border: `1px solid ${COLORS.goldAlpha25}`,
                fontSize: '13px',
              }}>
              <span className="font-body font-bold text-gold">{s.num}</span>
              <span style={{ color: COLORS.offWhiteAlpha78 }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Buttons — both open the corresponding Navbar mega-menu, no scroll */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <motion.button
            onClick={openExplore}
            className="font-body font-semibold text-sm uppercase tracking-[0.12em] cursor-pointer transition-all duration-200"
            style={{
              minWidth: 'clamp(140px, 20vw, 180px)',
              padding: '10px 24px',
              borderRadius: '8px',
              border: `1px solid ${COLORS.goldAlpha45}`,
              background: 'transparent',
              color: COLORS.gold,
            }}
            whileHover={{ background: COLORS.goldAlpha15, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {language === 'tr' ? 'Keşfet' : 'Discover'}
          </motion.button>
          <motion.button
            onClick={openTools}
            className="font-body font-semibold text-sm uppercase tracking-[0.12em] cursor-pointer transition-all duration-200"
            style={{
              minWidth: 'clamp(140px, 20vw, 180px)',
              padding: '10px 24px',
              borderRadius: '8px',
              border: `1px solid ${COLORS.gold}`,
              background: COLORS.gold,
              color: COLORS.inkBlack,
            }}
            whileHover={{ boxShadow: `0 0 28px ${COLORS.goldAlpha45}`, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {language === 'tr' ? 'Araçlar' : 'Tools'}
          </motion.button>
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
