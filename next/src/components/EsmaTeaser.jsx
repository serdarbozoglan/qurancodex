// ─── EsmaTeaser — Esmâ kartının 4 isim ızgarası (SUNUCU BİLEŞENİ) ───────────
//
// `allah-kendini-tanitir` kartını diğer 13'ten ayıran tek şey buydu. PortalCard'ın
// `extra` slotundan geçirilir; şablonu bozmadan o karta kendi ağırlığını verir.
// Eski AllahKendiniTanitir.jsx'ten birebir taşındı (sayılar dahil).
// ────────────────────────────────────────────────────────────────────────────

import { COLORS, FONTS } from '../tokens';

const TEASER_NAMES = [
  { ar: 'اللَّه', trName: 'Allah', enName: 'Allāh', count: 2699 },
  { ar: 'الرَّحْمَٰن', trName: 'Er-Rahmân', enName: 'ar-Raḥmān', count: 60 },
  { ar: 'الْعَلِيم', trName: 'El-Alîm', enName: 'al-ʿAlīm', count: 161 },
  { ar: 'الْحَكِيم', trName: 'El-Hakîm', enName: 'al-Ḥakīm', count: 97 },
];

export default function EsmaTeaser({ locale = 'tr' }) {
  const tr = locale === 'tr';
  return (
    <div
      className="esma-teaser-grid"
      style={{
        display: 'grid',
        // 4 kart için sabit 2×2 — auto-fit minmax 3+1 asimetri üretiyor.
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '14px',
        marginBottom: '56px',
      }}
    >
      {TEASER_NAMES.map((n) => (
        <div
          key={n.trName}
          style={{
            background: `linear-gradient(180deg, ${COLORS.gold}0c 0%, rgba(255,255,255,0.02) 100%)`,
            border: `1px solid ${COLORS.gold}26`,
            borderRadius: '14px',
            padding: '22px 16px',
            textAlign: 'center',
          }}
        >
          <p
            dir="rtl"
            lang="ar"
            style={{
              fontFamily: FONTS.quran,
              fontSize: 'clamp(1.4rem, 2.4vw, 1.7rem)',
              color: COLORS.gold,
              lineHeight: 1.4,
              margin: '0 0 10px',
            }}
          >
            {n.ar}
          </p>
          <p
            style={{
              color: COLORS.offWhite,
              fontFamily: FONTS.body,
              fontSize: '0.86rem',
              fontWeight: 600,
              margin: '0 0 6px',
            }}
          >
            {tr ? n.trName : n.enName}
          </p>
          <p
            style={{
              color: `${COLORS.gold}aa`,
              fontFamily: FONTS.body,
              fontSize: '0.74rem',
              letterSpacing: '0.06em',
              margin: 0,
            }}
          >
            {n.count.toLocaleString(tr ? 'tr-TR' : 'en-US')} {tr ? 'geçiş' : 'occurrences'}
          </p>
        </div>
      ))}
    </div>
  );
}
