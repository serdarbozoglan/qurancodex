'use client';

import { motion } from 'framer-motion';
import { COLORS, FONTS, RADIUS } from '../../tokens';
import { renderInlineMarkdown } from './inlineMarkdown';

// FlowChain — Felsufi'nin "İstiğnâ → Tuğyan → Tâğût" gibi nedensellik
// zincirleri için interaktif yatay akış şeması. Her node bir kavram kartı;
// aralarındaki SVG ok'lar nedensellik akışını gösterir. Hover'da node parlar.
//
// Veri şekli:
//   {
//     captionTr, captionEn,
//     nodes: [
//       {
//         ar?, transliteration?,
//         titleTr, titleEn,
//         subtitleTr?, subtitleEn?,
//         tone?: "trigger" | "state" | "outcome" | "default"
//       }
//     ]
//   }

const TONES = {
  trigger:  { accent: COLORS.purple || '#8b5cf6', label: { tr: 'TETİK',  en: 'TRIGGER' } },
  state:    { accent: COLORS.gold,                label: { tr: 'HÂL',    en: 'STATE'   } },
  outcome:  { accent: '#e74c3c',                  label: { tr: 'SONUÇ',  en: 'OUTCOME' } },
  default:  { accent: COLORS.silver,              label: null },
};

function ChainNode({ node, idx, total, language }) {
  const tone = TONES[node.tone] || TONES.default;
  const tr = language === 'tr';
  const isFirst = idx === 0;
  const isLast = idx === total - 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.5, delay: idx * 0.15, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{
        y: -3,
        boxShadow: `0 8px 28px ${tone.accent}44, 0 0 24px ${tone.accent}22`,
        borderColor: `${tone.accent}aa`,
      }}
      style={{
        flex: 1,
        minWidth: '170px',
        position: 'relative', zIndex: 2,
        padding: '18px 16px 16px',
        background: `linear-gradient(160deg, ${tone.accent}14, rgba(0,0,0,0.40))`,
        border: `1px solid ${tone.accent}55`,
        borderRadius: RADIUS.lg,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
        textAlign: 'center',
        cursor: 'default',
        transition: 'border-color 0.25s, box-shadow 0.25s',
        backdropFilter: 'blur(8px)',
        boxShadow: `0 4px 16px rgba(0,0,0,0.28), inset 0 0 0 1px ${tone.accent}11`,
      }}
    >
      {/* Phase label */}
      {tone.label && (
        <div style={{
          fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.22em',
          color: tone.accent, fontFamily: FONTS.body,
          marginBottom: '4px',
        }}>
          {tr ? tone.label.tr : tone.label.en}
        </div>
      )}

      {/* Arabic */}
      {node.ar && (
        <span lang="ar" dir="rtl" style={{
          fontFamily: FONTS.quran,
          fontSize: '1.85rem',
          color: COLORS.gold,
          lineHeight: 1.25,
          letterSpacing: '0.03em',
          textShadow: `0 0 18px ${tone.accent}33`,
        }}>
          {node.ar}
        </span>
      )}

      {node.transliteration && (
        <span style={{
          fontSize: '0.7rem',
          color: COLORS.silver,
          fontStyle: 'italic',
          fontFamily: FONTS.body,
          letterSpacing: '0.04em',
        }}>
          {node.transliteration}
        </span>
      )}

      {/* Title */}
      <div style={{
        fontSize: '0.92rem', fontWeight: 700,
        color: COLORS.offWhite,
        fontFamily: FONTS.body,
        lineHeight: 1.35,
        marginTop: '2px',
      }}>
        {renderInlineMarkdown(tr ? node.titleTr : (node.titleEn || node.titleTr))}
      </div>

      {/* Subtitle / nuance */}
      {(node.subtitleTr || node.subtitleEn) && (
        <div style={{
          fontSize: '0.74rem',
          color: COLORS.silver,
          fontFamily: FONTS.body,
          fontStyle: 'italic',
          lineHeight: 1.5,
          marginTop: '2px',
          maxWidth: '200px',
        }}>
          {renderInlineMarkdown(tr ? node.subtitleTr : (node.subtitleEn || node.subtitleTr))}
        </div>
      )}
    </motion.div>
  );
}

function Arrow({ delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.4, delay, ease: [0.4, 0, 0.2, 1] }}
      style={{
        flex: '0 0 36px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative',
        transformOrigin: 'left center',
      }}
    >
      <svg width="36" height="14" viewBox="0 0 36 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <linearGradient id="flowArrow" x1="0" y1="0" x2="36" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%"  stopColor={COLORS.purple || '#8b5cf6'} stopOpacity="0.4" />
            <stop offset="50%" stopColor={COLORS.gold} stopOpacity="0.85" />
            <stop offset="100%" stopColor="#e74c3c" stopOpacity="0.65" />
          </linearGradient>
        </defs>
        <line x1="2" y1="7" x2="28" y2="7" stroke="url(#flowArrow)" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M 26 2 L 33 7 L 26 12" stroke={COLORS.gold} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.85" />
      </svg>
    </motion.div>
  );
}

export default function FlowChain({ captionTr, captionEn, nodes, language }) {
  const tr = language === 'tr';
  return (
    <div style={{
      margin: '36px 0 32px',
      padding: '26px 22px 28px',
      background: `linear-gradient(180deg, rgba(0,0,0,0.32) 0%, rgba(139,92,246,0.04) 100%)`,
      border: `1px solid rgba(212,165,116,0.18)`,
      borderRadius: RADIUS.lg,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Top accent strip */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
        background: `linear-gradient(90deg, ${COLORS.purple || '#8b5cf6'}, ${COLORS.gold}, #e74c3c)`,
        opacity: 0.55,
      }} />

      {(captionTr || captionEn) && (
        <div style={{
          fontSize: '0.66rem', fontWeight: 700, letterSpacing: '0.22em',
          textTransform: 'uppercase', color: COLORS.gold,
          fontFamily: FONTS.body, marginBottom: '18px', textAlign: 'center',
        }}>
          {tr ? (captionTr || 'Kavram Zinciri') : (captionEn || 'Conceptual Chain')}
        </div>
      )}

      {/* Horizontal flow */}
      <div style={{
        display: 'flex',
        alignItems: 'stretch',
        gap: '0',
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}>
        {nodes.map((node, i) => (
          <ChainNodeWithArrow
            key={i}
            node={node}
            idx={i}
            total={nodes.length}
            language={language}
          />
        ))}
      </div>
    </div>
  );
}

function ChainNodeWithArrow({ node, idx, total, language }) {
  const isLast = idx === total - 1;
  return (
    <>
      <ChainNode node={node} idx={idx} total={total} language={language} />
      {!isLast && <Arrow delay={0.2 + idx * 0.15} />}
    </>
  );
}
