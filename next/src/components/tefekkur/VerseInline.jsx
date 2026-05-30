'use client';

import { COLORS, FONTS, RADIUS } from '../../tokens';
import { surahNameTr } from '../../lib/surahNames';

// Sûre adı + ayet ref formatı (TR'de "Bakara 2:8", EN'de "2:8")
function formatVerseRef(ref, language) {
  if (language !== 'tr') return ref;
  const m = /^(\d+):/.exec(ref);
  if (!m) return ref;
  const surah = parseInt(m[1], 10);
  const name = surahNameTr(surah).replace(/^E[lnstrz]-/i, '').replace(/^Eş-/i, '');
  return `${name} ${ref}`;
}

// VerseInline — makale içinde ayet referansı (inline card pattern).
// Şimdilik static display; hover/click ile detail expand sonraki iterasyonda.
export default function VerseInline({ ref, noteTr, noteEn, language }) {
  const tr = language === 'tr';
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
      {/* Verse ref badge */}
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

      {/* Note */}
      <p style={{
        flex: 1,
        margin: 0,
        fontSize: '0.92rem',
        color: COLORS.offWhite,
        fontFamily: FONTS.body,
        lineHeight: 1.7,
      }}>
        {tr ? noteTr : noteEn}
      </p>
    </div>
  );
}
