'use client';

import { motion } from 'framer-motion';
import { COLORS, FONTS, RADIUS } from '../../tokens';
import { renderInlineMarkdown } from './inlineMarkdown';

// HierarchyTree — kök kavramdan dallanarak alt katmanlara inen SVG-bağlantılı diyagram.
// Felsufi'nin semantik analizi makalelerindeki "Anlam Hiyerarşisi" görselinin
// site-yerel, brand-uyumlu, framer-motion'lu karşılığı.
//
// Veri şekli:
//   {
//     root: { ar, tr, en, transliteration? },
//     branches: [
//       {
//         id, labelTr, labelEn, accent?,
//         children: [
//           { ar, tr, en, transliteration?,
//             subChildren?: [ { tr, en, secondaryTr?, secondaryEn? } ]
//           }
//         ]
//       }
//     ]
//   }

function Node({ ar, tr, en, transliteration, language, tone = 'default', size = 'md', delay = 0 }) {
  const isPrimary = tone === 'primary';
  const isSecondary = tone === 'secondary';
  const isLeaf = tone === 'leaf';

  const borderColor = isPrimary
    ? `${COLORS.gold}aa`
    : isSecondary
    ? `${COLORS.purple}66`
    : isLeaf
    ? 'rgba(255,255,255,0.10)'
    : `${COLORS.purple}44`;

  const bgGradient = isPrimary
    ? `linear-gradient(160deg, rgba(212,165,116,0.18), rgba(139,92,246,0.10))`
    : isSecondary
    ? `linear-gradient(160deg, rgba(139,92,246,0.14), rgba(0,0,0,0.40))`
    : isLeaf
    ? 'rgba(0,0,0,0.30)'
    : `linear-gradient(160deg, rgba(139,92,246,0.10), rgba(0,0,0,0.35))`;

  const padding = size === 'lg' ? '14px 18px' : size === 'sm' ? '7px 11px' : '10px 14px';
  const arFontSize = size === 'lg' ? '1.55rem' : size === 'sm' ? '0.95rem' : '1.15rem';
  const trFontSize = size === 'lg' ? '0.82rem' : size === 'sm' ? '0.66rem' : '0.74rem';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay, ease: [0.4, 0, 0.2, 1] }}
      style={{
        position: 'relative', zIndex: 2,
        padding,
        background: bgGradient,
        border: `1px solid ${borderColor}`,
        borderRadius: RADIUS.md,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
        minWidth: ar ? '88px' : '108px',
        textAlign: 'center',
        boxShadow: isPrimary
          ? `0 0 22px rgba(212,165,116,0.20), 0 4px 14px rgba(0,0,0,0.30)`
          : isSecondary
          ? `0 0 14px rgba(139,92,246,0.16), 0 3px 10px rgba(0,0,0,0.25)`
          : '0 2px 8px rgba(0,0,0,0.18)',
        backdropFilter: 'blur(6px)',
      }}
    >
      {ar && (
        <span lang="ar" dir="rtl" style={{
          fontFamily: FONTS.quran,
          fontSize: arFontSize,
          color: COLORS.gold,
          lineHeight: 1.2,
          letterSpacing: '0.02em',
        }}>
          {ar}
        </span>
      )}
      {transliteration && (
        <span style={{
          fontSize: '0.62rem', color: COLORS.silver,
          fontStyle: 'italic', fontFamily: FONTS.body,
          letterSpacing: '0.04em',
        }}>
          {transliteration}
        </span>
      )}
      <span style={{
        fontSize: trFontSize,
        color: COLORS.offWhite,
        fontWeight: 600,
        fontFamily: FONTS.body,
        lineHeight: 1.35,
        maxWidth: '180px',
      }}>
        {renderInlineMarkdown(language === 'tr' ? tr : (en || tr))}
      </span>
    </motion.div>
  );
}

function BranchLabel({ labelTr, labelEn, language, accent, delay = 0 }) {
  const color = accent || COLORS.purple;
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay }}
      style={{
        display: 'inline-flex',
        alignItems: 'center', gap: '8px',
        padding: '6px 12px',
        background: `${color}22`,
        border: `1px solid ${color}55`,
        borderRadius: '999px',
        fontSize: '0.7rem',
        fontWeight: 700,
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        color: COLORS.offWhite,
        fontFamily: FONTS.body,
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{
        width: '6px', height: '6px', borderRadius: '50%',
        background: color, boxShadow: `0 0 8px ${color}`,
      }} />
      {renderInlineMarkdown(language === 'tr' ? labelTr : (labelEn || labelTr))}
    </motion.div>
  );
}

function SubChildPill({ tr, en, secondaryTr, secondaryEn, language, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -4 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay }}
      style={{
        padding: '8px 12px',
        background: 'rgba(255,255,255,0.03)',
        border: `1px dashed ${COLORS.purple}44`,
        borderRadius: RADIUS.sm || '8px',
        fontSize: '0.78rem',
        color: COLORS.offWhite,
        fontFamily: FONTS.body,
        lineHeight: 1.45,
        textAlign: 'left',
        maxWidth: '210px',
      }}
    >
      <div style={{ fontWeight: 600 }}>{renderInlineMarkdown(language === 'tr' ? tr : (en || tr))}</div>
      {(secondaryTr || secondaryEn) && (
        <div style={{
          marginTop: '3px',
          fontSize: '0.7rem',
          color: COLORS.silver,
          fontStyle: 'italic',
        }}>
          → {renderInlineMarkdown(language === 'tr' ? secondaryTr : (secondaryEn || secondaryTr))}
        </div>
      )}
    </motion.div>
  );
}

export default function HierarchyTree({ titleTr, titleEn, root, branches, language }) {
  const tr = language === 'tr';
  return (
    <div style={{
      margin: '32px 0 28px',
      padding: '28px 22px 32px',
      background: `linear-gradient(180deg, rgba(139,92,246,0.06) 0%, rgba(255,255,255,0.012) 60%, rgba(0,0,0,0.20) 100%)`,
      border: `1px solid rgba(139,92,246,0.20)`,
      borderRadius: RADIUS.lg,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Top accent line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
        background: `linear-gradient(90deg, transparent, ${COLORS.gold}, ${COLORS.purple}, transparent)`,
        opacity: 0.6,
      }} />

      {/* Optional caption */}
      {(titleTr || titleEn) && (
        <div style={{
          fontSize: '0.66rem', fontWeight: 700, letterSpacing: '0.22em',
          textTransform: 'uppercase', color: COLORS.purple,
          fontFamily: FONTS.body, marginBottom: '20px', textAlign: 'center',
        }}>
          {tr ? (titleTr || 'Anlam Hiyerarşisi') : (titleEn || 'Semantic Hierarchy')}
        </div>
      )}

      {/* Root node — centered, large */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '22px', position: 'relative' }}>
        <Node {...root} language={language} tone="primary" size="lg" delay={0} />
      </div>

      {/* SVG branching connector from root to each branch label */}
      {branches.length > 0 && (
        <div style={{
          position: 'relative',
          height: '36px',
          marginBottom: '6px',
        }}>
          <svg
            aria-hidden="true"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
            preserveAspectRatio="none"
            viewBox={`0 0 ${branches.length * 100} 36`}
          >
            {branches.map((_, i) => {
              const totalWidth = branches.length * 100;
              const cx = (i + 0.5) * 100;
              return (
                <motion.path
                  key={i}
                  d={`M ${totalWidth / 2} 0 Q ${cx} 18, ${cx} 36`}
                  fill="none"
                  stroke={COLORS.purple}
                  strokeWidth="1.4"
                  strokeOpacity="0.45"
                  strokeDasharray="4 4"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: 0.1 + i * 0.08 }}
                />
              );
            })}
          </svg>
        </div>
      )}

      {/* Branches — equal columns */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${branches.length}, minmax(0, 1fr))`,
        gap: '20px',
        alignItems: 'start',
      }}>
        {branches.map((branch, bi) => (
          <div key={branch.id || bi} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px',
          }}>
            <BranchLabel
              labelTr={branch.labelTr} labelEn={branch.labelEn}
              language={language} accent={branch.accent}
              delay={0.15 + bi * 0.1}
            />

            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
              width: '100%',
            }}>
              {(branch.children || []).map((child, ci) => (
                <div key={ci} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                  width: '100%',
                }}>
                  <Node
                    {...child}
                    language={language}
                    tone="secondary"
                    size="md"
                    delay={0.25 + bi * 0.1 + ci * 0.05}
                  />

                  {child.subChildren && child.subChildren.length > 0 && (
                    <div style={{
                      display: 'flex', flexDirection: 'column', gap: '6px',
                      alignItems: 'center',
                      paddingLeft: '4px',
                      borderLeft: `1px dashed ${COLORS.purple}33`,
                      marginLeft: '0',
                    }}>
                      {child.subChildren.map((sub, si) => (
                        <SubChildPill
                          key={si}
                          {...sub}
                          language={language}
                          delay={0.4 + bi * 0.1 + ci * 0.05 + si * 0.04}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
