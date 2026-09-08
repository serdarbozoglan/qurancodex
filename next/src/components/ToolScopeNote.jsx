'use client';

// ─── ToolScopeNote — çakışan araçların sınırını açıkla (ChatGPT C2) ──────────
// Birçok araç yakın konuları işliyor (İnsan Tanımı ↔ Psikoloji ↔ Nefs ↔
// Yolculuk gibi). Kullanıcı hangi araçta olduğunu ve komşusundan farkını
// hızlı anlasın: hero'nun hemen altında, "Bu sayfa neye odaklanır +
// yakın araçların farkı" kompakt şeridi. CrossToolCTA (sayfa dibi, ilgili
// araçlar) ile tamamlayıcı; bu şerit VARIŞTA yönlendirir.
//
// Props:
//   thisTr / thisEn — bu aracın tek cümlelik odağı
//   neighbors: [{ href, labelTr, labelEn, noteTr, noteEn }] — komşu araçlar +
//     her birinin AYIRICI odağı (bu araçtan farkı)

import Link from 'next/link';
import { COLORS, FONTS, RADIUS } from '../tokens';

export default function ToolScopeNote({ language, thisTr, thisEn, neighbors = [] }) {
  const tr = language !== 'en';
  return (
    <div style={{
      maxWidth: 960, margin: '0 auto 24px', width: '100%',
      padding: '12px 16px',
      background: 'rgba(255,255,255,0.025)',
      border: `1px solid ${COLORS.goldAlpha15}`,
      borderLeft: `2px solid ${COLORS.gold}`,
      borderRadius: RADIUS.md,
    }}>
      <p style={{ margin: 0, color: COLORS.silver, fontSize: '0.85rem', lineHeight: 1.6, fontFamily: FONTS.body }}>
        <span style={{ color: COLORS.gold, fontWeight: 700 }}>
          {tr ? 'Bu sayfa: ' : 'This page: '}
        </span>
        {tr ? thisTr : thisEn}
      </p>
      {neighbors.length > 0 && (
        <p style={{ margin: '8px 0 0', color: COLORS.silver, fontSize: '0.8rem', lineHeight: 1.65, fontFamily: FONTS.body }}>
          <span style={{ color: `${COLORS.gold}bb`, fontWeight: 600 }}>
            {tr ? 'Karıştırma: ' : "Don't confuse: "}
          </span>
          {neighbors.map((n, i) => (
            <span key={n.href}>
              {i > 0 && <span style={{ color: COLORS.textFaint }}> · </span>}
              <Link href={n.href} style={{ color: COLORS.gold, textDecoration: 'none', fontWeight: 600 }}>
                {tr ? n.labelTr : n.labelEn}
              </Link>
              <span style={{ color: COLORS.silver }}> — {tr ? n.noteTr : n.noteEn}</span>
            </span>
          ))}
        </p>
      )}
    </div>
  );
}
