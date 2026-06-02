'use client';

import { COLORS, FONTS } from '../../tokens';
import { renderInlineMarkdown } from './inlineMarkdown';

// PullQuote — museum-style büyük italic quote (gold-bordered).
export default function PullQuote({ tr: trText, en: enText, source, language }) {
  const tr = language === 'tr';
  return (
    <div style={{
      margin: '32px 0',
      padding: '24px 28px',
      borderLeft: `3px solid ${COLORS.gold}`,
      background: `linear-gradient(90deg, rgba(212,165,116,0.06), transparent 80%)`,
      position: 'relative',
    }}>
      {/* Decorative quote mark */}
      <div style={{
        position: 'absolute',
        top: '8px', left: '20px',
        fontFamily: FONTS.display, fontSize: '3rem',
        color: COLORS.gold, opacity: 0.18,
        lineHeight: 1, fontWeight: 800,
        pointerEvents: 'none',
      }}>
        ❝
      </div>
      <p style={{
        margin: '0 0 10px 28px',
        fontFamily: FONTS.display,
        fontSize: 'clamp(1.2rem, 2.2vw, 1.55rem)',
        fontStyle: 'italic',
        color: COLORS.offWhite,
        lineHeight: 1.5,
        fontWeight: 500,
      }}>
        {renderInlineMarkdown(tr ? trText : enText, { boldColor: COLORS.gold })}
      </p>
      {source && (
        <div style={{
          marginLeft: '28px',
          fontSize: '0.72rem',
          fontWeight: 600,
          color: COLORS.gold,
          fontFamily: FONTS.body,
          letterSpacing: '0.06em',
          opacity: 0.8,
          textTransform: 'uppercase',
        }}>
          — {source}
        </div>
      )}
    </div>
  );
}
