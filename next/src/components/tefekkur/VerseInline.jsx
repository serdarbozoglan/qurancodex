'use client';

import { COLORS, FONTS, RADIUS } from '../../tokens';
import { surahNameTr } from '../../lib/surahNames';
import { renderInlineMarkdown } from './inlineMarkdown';

// Sûre adı + ayet ref formatı (TR'de "Bakara 2:8", EN'de "2:8")
function formatVerseRef(ref, language) {
  if (language !== 'tr') return ref;
  const m = /^(\d+):/.exec(ref);
  if (!m) return ref;
  const surah = parseInt(m[1], 10);
  const name = surahNameTr(surah).replace(/^E[lnstrz]-/i, '').replace(/^Eş-/i, '');
  return `${name} ${ref}`;
}

// Note metni "Hâkka 69:11 — abc..." gibi prefix taşıyorsa onu temizle.
// Badge zaten ref'i gösterir; redundancy önlemi.
function stripRefPrefix(text, ref) {
  if (!text) return text;
  const escapedRef = ref.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`^[^\\d—–-]*\\b${escapedRef}\\b\\s*[—–-]\\s*`);
  return text.replace(re, '');
}

// VerseInline — makale içinde ayet referansı.
// `ar` field varsa: ayet metni FONTS.quran ile RTL blokta prominent gösterilir,
// altında ref badge + not. `ar` yoksa: legacy görünüm (badge + not yan yana).
//
// Arabic auto-inject: scripts/enrich-tefekkur-arabic.mjs build-time'da
// verse-graph-bgem3.json'dan ham metni çekip §13.15 normalize ile yazar.
export default function VerseInline({ ref, ar, isRange, noteTr, noteEn, language }) {
  const tr = language === 'tr';
  const cleanNote = stripRefPrefix(tr ? noteTr : noteEn, ref);

  // ---- Legacy varyant (Arapça yok) — geriye dönük uyum ----
  if (!ar) {
    return (
      <div style={{
        margin: '20px 0',
        padding: '14px 18px',
        background: 'rgba(29,158,117,0.06)',
        border: '1px solid rgba(29,158,117,0.25)',
        borderLeft: '3px solid #1D9E75',
        borderRadius: RADIUS.md,
        display: 'flex', alignItems: 'flex-start', gap: '12px',
      }}>
        <div style={{
          flexShrink: 0,
          padding: '4px 11px',
          background: 'rgba(29,158,117,0.15)',
          border: '1px solid rgba(29,158,117,0.40)',
          borderRadius: RADIUS.pillSm,
          fontSize: '0.74rem', fontWeight: 700,
          color: '#1D9E75', fontFamily: FONTS.body,
          letterSpacing: '0.04em',
        }}>
          {formatVerseRef(ref, language)}
        </div>
        <p style={{
          flex: 1, margin: 0,
          fontSize: '0.92rem',
          color: COLORS.offWhite, fontFamily: FONTS.body,
          lineHeight: 1.7,
        }}>
          {renderInlineMarkdown(cleanNote)}
        </p>
      </div>
    );
  }

  // ---- Premium varyant (Arapça + not iki katmanda) ----
  return (
    <div style={{
      margin: '24px 0',
      padding: '18px 20px 16px',
      background: 'linear-gradient(180deg, rgba(29,158,117,0.07) 0%, rgba(29,158,117,0.03) 100%)',
      border: '1px solid rgba(29,158,117,0.28)',
      borderLeft: '3px solid #1D9E75',
      borderRadius: RADIUS.md,
      position: 'relative',
    }}>
      {/* Arabic verse — primary visual element */}
      <p
        lang="ar"
        dir="rtl"
        style={{
          margin: '0 0 12px',
          fontFamily: FONTS.quran,
          fontSize: '1.55rem',
          lineHeight: 2.0,
          color: COLORS.offWhite,
          textAlign: 'right',
          letterSpacing: '0.01em',
        }}
      >
        {ar}
        {isRange && (
          <span style={{
            fontFamily: FONTS.body,
            fontSize: '0.7rem',
            color: COLORS.silver,
            marginInlineStart: '8px',
            fontStyle: 'italic',
            verticalAlign: 'middle',
            letterSpacing: '0.04em',
          }}>
            {tr ? '…ve devamı' : '…and following'}
          </span>
        )}
      </p>

      {/* Ref badge + note row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
        <div style={{
          flexShrink: 0,
          padding: '3px 10px',
          background: 'rgba(29,158,117,0.18)',
          border: '1px solid rgba(29,158,117,0.40)',
          borderRadius: RADIUS.pillSm,
          fontSize: '0.7rem', fontWeight: 700,
          color: '#1D9E75', fontFamily: FONTS.body,
          letterSpacing: '0.04em',
        }}>
          {formatVerseRef(ref, language)}
        </div>
        {cleanNote && (
          <p style={{
            flex: 1, margin: 0,
            fontSize: '0.88rem',
            color: COLORS.silver, fontFamily: FONTS.body,
            lineHeight: 1.65, fontStyle: 'italic',
          }}>
            {renderInlineMarkdown(cleanNote)}
          </p>
        )}
      </div>
    </div>
  );
}
