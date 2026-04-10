// ─── ToolHighlightCard ────────────────────────────────────────────────────────
// Mid-sized glass card used in the v1.1 homepage "İnteraktif Araçlar" showcase.
// 6 of these are rendered in a 3-column grid (2 rows on desktop) below the
// path cards. Each highlights one interactive tool overlay.
// ─────────────────────────────────────────────────────────────────────────────

import { motion } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS, GLASS_CARD } from '../tokens';

export default function ToolHighlightCard({
  icon,
  titleTr,
  titleEn,
  descTr,
  descEn,
  onClick,
}) {
  const { language } = useLanguage();
  const title = language === 'tr' ? titleTr : titleEn;
  const desc  = language === 'tr' ? descTr  : descEn;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -3, borderColor: COLORS.goldAlpha45 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      style={{
        ...GLASS_CARD,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '14px',
        padding: '22px 20px',
        textAlign: 'left',
        cursor: 'pointer',
        width: '100%',
        minHeight: '170px',
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '10px',
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
            fontFamily: FONTS.body,
            fontSize: '1rem',
            fontWeight: 700,
            color: COLORS.offWhite,
            margin: 0,
            lineHeight: 1.3,
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontFamily: FONTS.body,
            fontSize: '0.82rem',
            color: COLORS.silver,
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
