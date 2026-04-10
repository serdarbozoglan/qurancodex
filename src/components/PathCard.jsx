// ─── PathCard ─────────────────────────────────────────────────────────────────
// Large discovery card used in the v1.1 homepage "Nereden Başlamak İstiyorsun?"
// section. Each card represents a curated learning path: an icon, title,
// description, and a chain of pill-shaped steps connected by arrows.
//
// Caller is responsible for the onClick (typically scrollToSection or openOverlay
// from useQuranNav).
// ─────────────────────────────────────────────────────────────────────────────

import { motion } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS, GLASS_CARD } from '../tokens';

export default function PathCard({
  icon,
  titleTr,
  titleEn,
  descTr,
  descEn,
  steps = [], // [{ tr, en }]
  ctaTr = 'Bu Yola Başla',
  ctaEn = 'Start This Path',
  onClick,
}) {
  const { language } = useLanguage();
  const title = language === 'tr' ? titleTr : titleEn;
  const desc  = language === 'tr' ? descTr  : descEn;
  const cta   = language === 'tr' ? ctaTr   : ctaEn;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{
        y: -4,
        borderColor: COLORS.goldAlpha45,
        boxShadow: `0 0 32px ${COLORS.goldAlpha15}`,
      }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: 'spring', stiffness: 320, damping: 24 }}
      style={{
        // Spread first, then override border with longhand so framer-motion
        // can animate borderColor cleanly (shorthand `border` blocks animation)
        ...GLASS_CARD,
        border: undefined,
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: COLORS.glassBorder,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '18px',
        padding: '28px 26px',
        textAlign: 'left',
        cursor: 'pointer',
        width: '100%',
        minHeight: '260px',
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: '52px',
          height: '52px',
          borderRadius: '12px',
          background: COLORS.goldAlpha15,
          border: `1px solid ${COLORS.goldAlpha25}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: COLORS.gold,
          flexShrink: 0,
        }}
        aria-hidden="true"
      >
        {icon}
      </div>

      {/* Title + description */}
      <div>
        <h3
          style={{
            fontFamily: FONTS.display,
            fontSize: '1.5rem',
            fontWeight: 700,
            color: COLORS.offWhite,
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontFamily: FONTS.body,
            fontSize: '0.92rem',
            color: COLORS.silver,
            margin: '8px 0 0',
            lineHeight: 1.6,
          }}
        >
          {desc}
        </p>
      </div>

      {/* Path steps */}
      {steps.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
            alignItems: 'center',
            marginTop: 'auto',
          }}
        >
          {steps.map((step, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  fontFamily: FONTS.body,
                  fontSize: '0.7rem',
                  fontWeight: 500,
                  color: COLORS.gold,
                  background: COLORS.goldAlpha15,
                  border: `1px solid ${COLORS.goldAlpha25}`,
                  borderRadius: '999px',
                  padding: '4px 10px',
                  whiteSpace: 'nowrap',
                }}
              >
                {language === 'tr' ? step.tr : step.en}
              </span>
              {i < steps.length - 1 && (
                <span style={{ color: COLORS.silver, opacity: 0.5, fontSize: '0.7rem' }}>→</span>
              )}
            </span>
          ))}
        </div>
      )}

      {/* CTA hint */}
      <span
        style={{
          fontFamily: FONTS.body,
          fontSize: '0.78rem',
          fontWeight: 600,
          color: COLORS.gold,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        {cta}
        <svg
          width="13"
          height="13"
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
      </span>
    </motion.button>
  );
}
