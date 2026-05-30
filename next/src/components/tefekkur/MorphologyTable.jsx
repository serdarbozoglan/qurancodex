'use client';

import { motion } from 'framer-motion';
import { COLORS, FONTS, RADIUS } from '../../tokens';
import { surahNameTr } from '../../lib/surahNames';

// Sûre adı + ayet referansı formatı.
// TR: "Bakara 2:8"  (kısa form — Arapça artikelsiz)
// EN: "2:8"          (TR sûre-isim listesi yok; numerik form)
function formatVerseRef(ref, language) {
  if (language !== 'tr') return ref;
  const m = /^(\d+):/.exec(ref);
  if (!m) return ref;
  const surahNum = parseInt(m[1], 10);
  const fullName = surahNameTr(surahNum);
  // "El-Bakara" → "Bakara", "Eş-Şems" → "Şems", "En-Nâziât" → "Nâziât"
  const short = fullName.replace(/^E[lnstrz]-/i, '').replace(/^Eş-/i, '');
  return `${short} ${ref}`;
}

// MorphologyTable — Felsufi'nin "Kuran'daki Kullanım Kalıpları" tablolarının
// site-yerel premium karşılığı. Glassmorphism row + Arabic pattern (FONTS.quran) +
// gramatik etiket + Türkçe/EN anlam + verse-chip pill'leri.
//
// Veri şekli:
//   {
//     captionTr, captionEn,
//     columns: [{ labelTr, labelEn }, ...]  // optional — header
//     rows: [
//       {
//         ar: "طَغَى",
//         patternTr: "fiil — mâzî",  patternEn: "verb — past",
//         meaningTr: "Azdı, haddi aştı",  meaningEn: "Transgressed (past)",
//         verses: ["79:17", "96:6"]
//       }
//     ]
//   }

function VerseChip({ ref: vref, language, delay }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.28, delay }}
      whileHover={{ y: -2, boxShadow: `0 4px 14px ${COLORS.gold}22` }}
      style={{
        display: 'inline-block',
        padding: '4px 9px',
        background: `linear-gradient(135deg, rgba(212,165,116,0.14), rgba(139,92,246,0.10))`,
        border: `1px solid rgba(212,165,116,0.32)`,
        borderRadius: '999px',
        fontSize: '0.72rem',
        fontWeight: 600,
        color: COLORS.gold,
        fontFamily: FONTS.body,
        letterSpacing: '0.02em',
        cursor: 'default',
        whiteSpace: 'nowrap',
      }}
    >
      {formatVerseRef(vref, language)}
    </motion.span>
  );
}

function Row({ row, idx, language, isLast }) {
  const tr = language === 'tr';
  const verses = row.verses || [];
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.35, delay: idx * 0.06, ease: [0.4, 0, 0.2, 1] }}
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(120px, 0.9fr) minmax(140px, 1.1fr) minmax(180px, 1.6fr)',
        gap: '14px',
        padding: '14px 16px',
        borderBottom: isLast ? 'none' : `1px solid rgba(255,255,255,0.04)`,
        alignItems: 'center',
        transition: 'background 0.2s',
        cursor: 'default',
      }}
      whileHover={{ background: 'rgba(255,255,255,0.022)' }}
    >
      {/* Col 1: Arabic pattern + gramatik etiket */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
        <span lang="ar" dir="rtl" style={{
          fontFamily: FONTS.quran,
          fontSize: '1.4rem',
          color: COLORS.gold,
          lineHeight: 1.3,
          letterSpacing: '0.02em',
        }}>
          {row.ar}
        </span>
        {(row.patternTr || row.patternEn) && (
          <span style={{
            fontSize: '0.66rem',
            color: COLORS.silver,
            fontStyle: 'italic',
            fontFamily: FONTS.body,
            letterSpacing: '0.04em',
          }}>
            {tr ? row.patternTr : (row.patternEn || row.patternTr)}
          </span>
        )}
      </div>

      {/* Col 2: Anlam */}
      <div style={{
        fontSize: '0.92rem',
        color: COLORS.offWhite,
        fontFamily: FONTS.body,
        fontWeight: 500,
        lineHeight: 1.5,
      }}>
        {tr ? row.meaningTr : (row.meaningEn || row.meaningTr)}
      </div>

      {/* Col 3: Ayet chip'leri */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {verses.map((v, vi) => (
          <VerseChip key={vi} ref={v} language={language} delay={idx * 0.06 + vi * 0.03 + 0.1} />
        ))}
      </div>
    </motion.div>
  );
}

export default function MorphologyTable({ captionTr, captionEn, columns, rows, language }) {
  const tr = language === 'tr';
  const cols = columns || [
    { labelTr: 'Kalıp', labelEn: 'Pattern' },
    { labelTr: 'Anlam', labelEn: 'Meaning' },
    { labelTr: 'Ayet Örnekleri', labelEn: 'Verse Examples' },
  ];

  return (
    <div style={{
      margin: '32px 0 28px',
      position: 'relative',
    }}>
      {/* Caption */}
      {(captionTr || captionEn) && (
        <div style={{
          fontSize: '0.66rem', fontWeight: 700, letterSpacing: '0.22em',
          textTransform: 'uppercase', color: COLORS.gold,
          fontFamily: FONTS.body, marginBottom: '12px',
        }}>
          {tr ? (captionTr || 'Morfoloji & Ayet Eşleştirmeleri') : (captionEn || 'Morphology & Verse Mapping')}
        </div>
      )}

      <div style={{
        background: `linear-gradient(180deg, rgba(212,165,116,0.04) 0%, rgba(0,0,0,0.28) 100%)`,
        border: `1px solid rgba(212,165,116,0.22)`,
        borderRadius: RADIUS.lg,
        overflow: 'hidden',
        boxShadow: `0 8px 28px rgba(0,0,0,0.20)`,
      }}>
        {/* Header strip */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(120px, 0.9fr) minmax(140px, 1.1fr) minmax(180px, 1.6fr)',
          gap: '14px',
          padding: '11px 16px',
          background: 'rgba(212,165,116,0.06)',
          borderBottom: `1px solid rgba(212,165,116,0.18)`,
        }}>
          {cols.map((c, i) => (
            <div key={i} style={{
              fontSize: '0.66rem', fontWeight: 700,
              letterSpacing: '0.18em', textTransform: 'uppercase',
              color: COLORS.silver, fontFamily: FONTS.body,
            }}>
              {tr ? c.labelTr : (c.labelEn || c.labelTr)}
            </div>
          ))}
        </div>

        {/* Rows */}
        <div>
          {rows.map((row, idx) => (
            <Row key={idx} row={row} idx={idx} language={language} isLast={idx === rows.length - 1} />
          ))}
        </div>
      </div>
    </div>
  );
}
