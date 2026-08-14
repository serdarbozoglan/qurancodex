'use client';

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
import { COLORS, FONTS, GLASS_CARD, RADIUS } from '../tokens';

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
  completed = false,
}) {
  const { language } = useLanguage();
  const title = language === 'tr' ? titleTr : titleEn;
  const desc  = language === 'tr' ? descTr  : descEn;
  // Once a user has finished a path, the CTA shifts from "start" to
  // "revisit" — the badge does most of the signaling, but the button
  // label matters for screen readers and quick glance.
  const cta = completed
    ? (language === 'tr' ? 'Tekrar İncele' : 'Revisit Path')
    : (language === 'tr' ? ctaTr : ctaEn);
  const completedLabel = language === 'tr' ? 'Tamamlandı' : 'Completed';

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
        gap: '14px',
        padding: '22px 24px',
        textAlign: 'left',
        cursor: 'pointer',
        width: '100%',
        minHeight: '215px',
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: '46px',
          height: '46px',
          borderRadius: RADIUS.lg,
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
      <div style={{ width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
          <h3
            style={{
              fontFamily: FONTS.display,
              fontSize: '1.4rem',
              fontWeight: 700,
              color: COLORS.offWhite,
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            {title}
          </h3>
          {completed && (
            // Small amber check badge — persistent marker that the user
            // has walked this path before. Sits top-right of the title
            // so it doesn't compete with the icon on the left.
            <span
              title={completedLabel}
              aria-label={completedLabel}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '3px 8px',
                borderRadius: RADIUS.pill,
                background: COLORS.goldAlpha15,
                border: `1px solid ${COLORS.goldAlpha45}`,
                color: COLORS.gold,
                fontFamily: FONTS.body,
                fontSize: '0.64rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                flexShrink: 0,
                marginTop: '3px',
              }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12l5 5L20 7" />
              </svg>
              {completedLabel}
            </span>
          )}
        </div>
        <p
          style={{
            fontFamily: FONTS.body,
            fontSize: '0.88rem',
            // Hero-paralel body tonu: silver yerine offWhite/72 → kartın gövdesi
            // soğuk bir not değil, sıcak bir davet olur. Heading'den hâlâ ayrı.
            color: COLORS.offWhiteAlpha72,
            margin: '6px 0 0',
            lineHeight: 1.55,
          }}
        >
          {desc}
        </p>
      </div>

      {/* Path steps — separators are interpuncts (·), not arrows.
          The pills are a topic preview ("this path covers these subjects"),
          not a sequenced promise. Changing the separator from → to ·
          avoids implying a strict ordering that the long-form layout
          can't currently guarantee. Path-aware sequenced navigation is
          tracked separately for a future branch. */}
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
                  borderRadius: RADIUS.pill,
                  padding: '4px 10px',
                  whiteSpace: 'nowrap',
                }}
              >
                {language === 'tr' ? step.tr : step.en}
              </span>
              {i < steps.length - 1 && (
                <span style={{ color: COLORS.silver, opacity: 0.78, fontSize: '0.75rem' }}>·</span>
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
