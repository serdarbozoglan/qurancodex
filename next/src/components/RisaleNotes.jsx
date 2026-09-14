'use client';

// ─── RisaleNotes — Risale-i Nur alıntı bölümü (paylaşılan) ───────────────────
//
// Dua Dili, Esmâ-i Hüsnâ ve Zaman Boyutları sayfalarında aynı blok üç kez
// kopyalanmıştı; tek kaynağa alındı. Metin DEĞİŞMEZ — bu bileşen yalnız sunum
// katmanıdır (alıntılar birincil metinden doğrulanmış hâlleriyle gelir).
//
// Görsel dil: mushaf kenar notu. Her kart solda ince altın bir cetvel ve onun
// başında bir elmas düğüm taşır; sağ üstte şeffaf bir sıra numarası, altında
// künye, açılış tırnağı iri ve soluk, alıntı Playfair italik, notu filigran bir
// ayraç ayırır. Kart zemini üstten altına doğru koyulaşan çok hafif bir altın
// yıkamadır.

import { COLORS, FONTS, RADIUS, SEMANTIC } from '../tokens';

function Ornament({ color = COLORS.gold }) {
  return (
    <svg aria-hidden="true" width="86" height="12" viewBox="0 0 86 12" fill="none" style={{ display: 'block', margin: '0 auto' }}>
      <path d="M0 6h30M56 6h30" stroke={color} strokeOpacity="0.42" strokeWidth="1" />
      <path d="M43 1.4 47.6 6 43 10.6 38.4 6z" stroke={color} strokeOpacity="0.72" strokeWidth="1" fill="none" />
      <circle cx="43" cy="6" r="1.3" fill={color} fillOpacity="0.75" />
    </svg>
  );
}

export default function RisaleNotes({ items, language, eyebrowTr, eyebrowEn, introTr, introEn }) {
  const tr = language === 'tr';
  if (!items || items.length === 0) return null;

  return (
    <div style={{ maxWidth: '1060px', margin: '0 auto', width: '100%' }}>
      {/* Başlık bloğu */}
      <div style={{ maxWidth: '760px', margin: '0 auto 30px', textAlign: 'center' }}>
        <Ornament />
        <p style={{
          fontSize: '0.68rem', letterSpacing: '0.26em', textTransform: 'uppercase',
          color: COLORS.gold,  fontFamily: FONTS.body, fontWeight: 700,
          margin: '14px 0 12px',
        }}>
          {tr ? (eyebrowTr || 'BEŞERÎ YORUM KATMANI · RİSALE-İ NUR') : (eyebrowEn || 'HUMAN INTERPRETIVE LAYER · RISALE-I NUR')}
        </p>
        <p style={{ color: COLORS.offWhite, fontSize: '0.95rem', lineHeight: 1.78, fontFamily: FONTS.body, margin: 0, opacity: 0.94 }}>
          {tr ? introTr : introEn}
        </p>
      </div>

      {/* Kartlar — sütun sayısı saf CSS ile (§14.2: düzen JS state'ine bağlanmaz) */}
      <div style={{
        display: 'grid', gap: '18px',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(360px, 100%), 1fr))',
      }}>
        {items.map((pt, i) => (
          <article
            key={i}
            className="risale-card"
            style={{
              position: 'relative',
              background: `linear-gradient(170deg, ${COLORS.gold}0b 0%, rgba(0,0,0,0.24) 70%)`,
              border: `1px solid ${COLORS.gold}22`,
              borderRadius: RADIUS.lg,
              padding: '22px 24px 20px 30px',
              overflow: 'hidden',
            }}
          >
            {/* Sol cetvel + elmas düğüm (mushaf kenar notu motifi) */}
            <span aria-hidden="true" style={{
              position: 'absolute', insetInlineStart: '12px', top: '26px', bottom: '22px',
              width: '1px', background: `linear-gradient(180deg, ${COLORS.gold}88, ${COLORS.gold}18)`,
            }} />
            <span aria-hidden="true" style={{
              position: 'absolute', insetInlineStart: '9px', top: '22px',
              width: '7px', height: '7px', transform: 'rotate(45deg)',
              border: `1px solid ${COLORS.gold}aa`, background: COLORS.cosmicBlack,
            }} />

            {/* Şeffaf sıra numarası */}
            <span aria-hidden="true" style={{
              position: 'absolute', top: '10px', insetInlineEnd: '16px',
              fontFamily: FONTS.display, fontWeight: 700, fontSize: '2.6rem',
              color: COLORS.gold, opacity: 0.07, lineHeight: 1, letterSpacing: '-0.02em',
            }}>
              {String(i + 1).padStart(2, '0')}
            </span>

            {/* Künye */}
            <p style={{
              fontSize: '0.62rem', letterSpacing: '0.14em', textTransform: 'uppercase',
              color: COLORS.gold,  fontFamily: FONTS.body, fontWeight: 700,
              margin: '0 46px 14px 0', lineHeight: 1.5,
            }}>
              {tr ? pt.sourceTr : pt.sourceEn}
            </p>

            {/* Alıntı — açılış tırnağı dekoratif */}
            <div style={{ position: 'relative', paddingTop: '4px' }}>
              <span aria-hidden="true" style={{
                position: 'absolute', insetInlineStart: '-6px', top: '-14px',
                fontFamily: FONTS.display, fontSize: '2.4rem', lineHeight: 1,
                color: COLORS.gold, opacity: 0.22, pointerEvents: 'none',
              }}>&ldquo;</span>
              <p style={{
                color: COLORS.offWhite, fontSize: '0.98rem', lineHeight: 1.8,
                fontFamily: FONTS.display, fontStyle: 'italic', margin: '0 0 16px',
                position: 'relative',
              }}>
                {tr ? pt.quoteTr : pt.quoteEn}
              </p>
            </div>

            {/* Filigran ayraç */}
            <span aria-hidden="true" style={{
              display: 'block', height: '1px', margin: '0 0 14px',
              background: `linear-gradient(90deg, ${COLORS.gold}55, transparent)`,
            }} />

            <p style={{
              color: SEMANTIC.textMuted, fontSize: '0.84rem', lineHeight: 1.68,
              fontFamily: FONTS.body, margin: 0,
            }}>
              {tr ? pt.noteTr : pt.noteEn}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
