'use client';

import { motion } from 'framer-motion';
import { COLORS, FONTS, RADIUS } from '../../tokens';
import { renderInlineMarkdown } from './inlineMarkdown';

// ContrastDuo — İki-kutuplu karşılaştırma paneli (ENE↔TABİAT, Kalp↔Kuru çekirdek,
// vb). Sol/sağ iki dikey kart, ortada opsiyonel "bridge" (ok, alıntı veya
// geçiş etiketi).
//
// Veri şekli:
//   {
//     captionTr, captionEn,
//     left:  { ar?, titleTr, titleEn, descTr, descEn, accent?, bullets?: [tr/en] },
//     right: { ar?, titleTr, titleEn, descTr, descEn, accent?, bullets?: [tr/en] },
//     bridgeTr?, bridgeEn?,  // ortadaki çözüm/dönüşüm satırı (örn: "Eneden Hüve'ye")
//     bridgeMode?: "arrow" | "vs" | "merge" | "diverge"
//   }

function Pole({ pole, idx, language, totalDelay = 0 }) {
  const tr = language === 'tr';
  const accent = pole.accent || COLORS.purple || '#8b5cf6';
  const fromLeft = idx === 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: fromLeft ? -16 : 16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.5, delay: totalDelay + idx * 0.12, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -3, boxShadow: `0 10px 30px ${accent}33` }}
      style={{
        flex: 1,
        minWidth: '220px',
        padding: '22px 20px 20px',
        background: `linear-gradient(160deg, ${accent}14, rgba(0,0,0,0.40))`,
        border: `1px solid ${accent}55`,
        borderRadius: RADIUS.lg,
        display: 'flex', flexDirection: 'column', gap: '12px',
        position: 'relative', overflow: 'hidden',
        transition: 'box-shadow 0.25s, transform 0.25s',
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Top accent strip */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
        background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
        opacity: 0.7,
      }} />

      {/* Header — Arabic + Title */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', textAlign: 'center' }}>
        {pole.ar && (
          <span lang="ar" dir="rtl" style={{
            fontFamily: FONTS.quran,
            fontSize: '2.1rem',
            color: COLORS.gold,
            lineHeight: 1.2,
            letterSpacing: '0.03em',
            textShadow: `0 0 22px ${accent}33`,
          }}>
            {pole.ar}
          </span>
        )}
        <div style={{
          fontSize: '1.05rem', fontWeight: 700,
          color: COLORS.offWhite, fontFamily: FONTS.body,
          lineHeight: 1.3,
          letterSpacing: '0.01em',
        }}>
          {renderInlineMarkdown(tr ? pole.titleTr : (pole.titleEn || pole.titleTr))}
        </div>
      </div>

      {/* Description */}
      {(pole.descTr || pole.descEn) && (
        <div style={{
          fontSize: '0.88rem',
          color: COLORS.silver,
          fontFamily: FONTS.body,
          lineHeight: 1.65,
          fontStyle: 'italic',
          textAlign: 'center',
        }}>
          {renderInlineMarkdown(tr ? pole.descTr : (pole.descEn || pole.descTr))}
        </div>
      )}

      {/* Bullets */}
      {pole.bullets && pole.bullets.length > 0 && (
        <div style={{
          display: 'flex', flexDirection: 'column', gap: '7px',
          marginTop: '6px',
          paddingTop: '10px',
          borderTop: `1px dashed ${accent}33`,
        }}>
          {pole.bullets.map((b, bi) => {
            const text = typeof b === 'string' ? b : (tr ? b.tr : (b.en || b.tr));
            return (
              <div key={bi} style={{
                display: 'flex', alignItems: 'flex-start', gap: '8px',
                fontSize: '0.82rem', color: COLORS.offWhite,
                fontFamily: FONTS.body, lineHeight: 1.5,
              }}>
                <span style={{
                  width: '5px', height: '5px', borderRadius: '50%',
                  background: accent, marginTop: '7px', flexShrink: 0,
                  boxShadow: `0 0 6px ${accent}`,
                }} />
                <span>{renderInlineMarkdown(text)}</span>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}

function Bridge({ bridgeTr, bridgeEn, mode = 'arrow', language }) {
  const tr = language === 'tr';
  const label = tr ? bridgeTr : (bridgeEn || bridgeTr);

  let symbol = '→';
  if (mode === 'vs') symbol = '↔';
  else if (mode === 'merge') symbol = '⇒';
  else if (mode === 'diverge') symbol = '⇄';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.45, delay: 0.45, ease: [0.4, 0, 0.2, 1] }}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', gap: '8px',
        padding: '10px 14px',
        minWidth: '100px',
        position: 'relative',
      }}
    >
      <span style={{
        fontSize: '1.8rem', color: COLORS.gold,
        textShadow: `0 0 14px ${COLORS.gold}55`,
        fontFamily: FONTS.body,
        lineHeight: 1,
      }}>
        {symbol}
      </span>
      {label && (
        <span style={{
          fontSize: '0.7rem', fontWeight: 700,
          letterSpacing: '0.18em', textTransform: 'uppercase',
          color: COLORS.gold, fontFamily: FONTS.body,
          textAlign: 'center', lineHeight: 1.4,
          maxWidth: '140px',
        }}>
          {label}
        </span>
      )}
    </motion.div>
  );
}

export default function ContrastDuo({ captionTr, captionEn, left, right, bridgeTr, bridgeEn, bridgeMode, language }) {
  const tr = language === 'tr';
  return (
    <div style={{
      margin: '34px 0 30px',
      padding: '26px 22px 28px',
      background: `linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(212,165,116,0.04) 100%)`,
      border: `1px solid rgba(212,165,116,0.20)`,
      borderRadius: RADIUS.lg,
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Top accent */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
        background: `linear-gradient(90deg, ${left?.accent || COLORS.purple}, ${COLORS.gold}, ${right?.accent || '#e74c3c'})`,
        opacity: 0.55,
      }} />

      {(captionTr || captionEn) && (
        <div style={{
          fontSize: '0.66rem', fontWeight: 700, letterSpacing: '0.22em',
          textTransform: 'uppercase', color: COLORS.gold,
          fontFamily: FONTS.body, marginBottom: '20px', textAlign: 'center',
        }}>
          {tr ? (captionTr || 'İkili Karşılaştırma') : (captionEn || 'Dual Contrast')}
        </div>
      )}

      <div style={{
        display: 'flex',
        alignItems: 'stretch',
        gap: '8px',
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}>
        <Pole pole={left}  idx={0} language={language} />
        <Bridge bridgeTr={bridgeTr} bridgeEn={bridgeEn} mode={bridgeMode} language={language} />
        <Pole pole={right} idx={1} language={language} />
      </div>
    </div>
  );
}
