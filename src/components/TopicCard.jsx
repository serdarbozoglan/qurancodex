// ─── TopicCard ────────────────────────────────────────────────────────────────
// Compact grid item used in the v1.1 homepage "Tüm İçerikler" section.
// One row per topic: small icon + title + 1-line description + indicator.
//
// Visual differentiator (decision in todo_v1.1.md, Faz 2):
//   - kind="section"  → simple right-arrow icon (→), in-page scroll
//   - kind="overlay"  → external-link icon (↗),     opens an interactive module
//
// Hover tooltip clarifies the distinction. No badges, no extra noise.
// ─────────────────────────────────────────────────────────────────────────────

import { motion } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS } from '../tokens';

export default function TopicCard({
  icon,
  titleTr,
  titleEn,
  descTr,
  descEn,
  kind = 'section', // 'section' | 'overlay'
  onClick,
}) {
  const { language } = useLanguage();
  const title = language === 'tr' ? titleTr : titleEn;
  const desc  = language === 'tr' ? descTr  : descEn;
  const isOverlay = kind === 'overlay';

  const tooltip = isOverlay
    ? (language === 'tr' ? 'İnteraktif modülde aç' : 'Open in interactive module')
    : (language === 'tr' ? 'Sayfaya git'           : 'Jump to section');

  return (
    <motion.button
      type="button"
      onClick={onClick}
      title={tooltip}
      aria-label={`${title} — ${tooltip}`}
      whileHover={{ x: 3 }}
      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
      style={{
        display: 'grid',
        gridTemplateColumns: '28px 1fr auto',
        alignItems: 'center',
        gap: '12px',
        padding: '11px 14px',
        background: COLORS.glassBgFaint,
        border: `1px solid ${COLORS.glassBorderSoft}`,
        borderRadius: '10px',
        cursor: 'pointer',
        textAlign: 'left',
        width: '100%',
        transition: 'border-color 0.2s, background 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = COLORS.goldAlpha25;
        e.currentTarget.style.background = COLORS.goldAlpha04;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = COLORS.glassBorderSoft;
        e.currentTarget.style.background = COLORS.glassBgFaint;
      }}
    >
      {/* Topic icon */}
      <div
        style={{
          color: COLORS.gold,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        aria-hidden="true"
      >
        {icon}
      </div>

      {/* Title + description */}
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontFamily: FONTS.body,
            fontSize: '0.9rem',
            fontWeight: 600,
            color: COLORS.offWhite,
            lineHeight: 1.3,
            marginBottom: '2px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {title}
        </div>
        {desc && (
          <div
            style={{
              fontFamily: FONTS.body,
              fontSize: '0.72rem',
              color: COLORS.silver,
              lineHeight: 1.4,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {desc}
          </div>
        )}
      </div>

      {/* Right indicator: differs by kind */}
      <div
        style={{
          color: isOverlay ? COLORS.gold : COLORS.silver,
          opacity: isOverlay ? 0.85 : 0.6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        aria-hidden="true"
      >
        {isOverlay ? (
          // External-link / open-in-new icon
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 4h6v6" />
            <path d="M20 4L10 14" />
            <path d="M19 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6" />
          </svg>
        ) : (
          // Right arrow
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 6l6 6-6 6" />
          </svg>
        )}
      </div>
    </motion.button>
  );
}
