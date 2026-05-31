'use client';

// ─── TefekkurCategoryCard ────────────────────────────────────────────────────
// Glass card used on the homepage "Tefekkür" discovery-layer showcase.
// 6 of these render the 6 Felsufi essay categories — semantic mirror to the
// 6 tool cards rendered by ToolsHighlight just above. Each links to the
// /tefekkur index pre-filtered to that category via ?cat=<id>.
// ─────────────────────────────────────────────────────────────────────────────

import { motion } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS, GLASS_CARD, RADIUS } from '../tokens';

export default function TefekkurCategoryCard({
  accent,
  count,
  titleTr,
  titleEn,
  descTr,
  descEn,
  icon,
  onClick,
}) {
  const { language } = useLanguage();
  const title = language === 'tr' ? titleTr : titleEn;
  const desc  = language === 'tr' ? descTr  : descEn;
  const countLabel = language === 'tr' ? 'makale' : 'essays';

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{
        y: -3,
        borderColor: `${accent}aa`,
        boxShadow: `0 0 24px ${accent}22, 0 8px 24px rgba(0,0,0,0.28)`,
      }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      style={{
        ...GLASS_CARD,
        border: undefined,
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: `${accent}33`,
        background: `linear-gradient(180deg, ${accent}0d 0%, rgba(255,255,255,0.022) 60%)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '14px',
        padding: '22px 20px',
        textAlign: 'left',
        cursor: 'pointer',
        width: '100%',
        minHeight: '170px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top accent stripe */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: '2px',
          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
          opacity: 0.55,
          pointerEvents: 'none',
        }}
      />

      {/* Icon + count row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: RADIUS.chip,
            background: `${accent}1f`,
            border: `1px solid ${accent}55`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: accent,
            flexShrink: 0,
          }}
          aria-hidden="true"
        >
          {icon}
        </div>
        <span
          style={{
            display: 'inline-flex', alignItems: 'baseline', gap: '4px',
            padding: '3px 9px',
            borderRadius: RADIUS.pillSm,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
            fontFamily: FONTS.body,
          }}
        >
          <span style={{ color: accent, fontSize: '0.78rem', fontWeight: 700 }}>{count}</span>
          <span style={{ color: COLORS.silver, fontSize: '0.66rem', letterSpacing: '0.04em' }}>{countLabel}</span>
        </span>
      </div>

      {/* Title + description */}
      <div>
        <h3
          style={{
            fontFamily: FONTS.body,
            fontSize: '1rem',
            fontWeight: 700,
            color: COLORS.offWhite,
            margin: 0,
            lineHeight: 1.3,
            letterSpacing: '0.005em',
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontFamily: FONTS.body,
            fontSize: '0.82rem',
            color: COLORS.offWhiteAlpha72,
            margin: '6px 0 0',
            lineHeight: 1.55,
          }}
        >
          {desc}
        </p>
      </div>
    </motion.button>
  );
}
