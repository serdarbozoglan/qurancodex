// ─── EditorialCard — "kanıt/analiz" kümesi için sola dayalı kart ────────────
//
// 2026-08-14 · B1b + B4 (görsel tasarım mockup turu, onaylandı).
// PortalCard'ın ortalı + altın çerçeveli paneli, iddia sunan kartlarda
// (tarihsel izler, koruma zinciri) törensel bir ton veriyordu — bu kartlar
// bir dosya sunuyor, bir sunak değil. Karar: küme bazlı ikinci bir dil.
//   - Devotional/anlatı kartları (dua, mukattaa, halka) → PortalCard, ortalı.
//   - Kanıt/analiz kartları (tarihsel, koruma) → EditorialCard, sola dayalı.
// Sûre numarası büyük, boş (yalnız kontur) bir rakam olarak asılı — dergi
// künyesi kalıbı. Aynı bileşen iki farklı karta uygulanıp tutarlı çalışıyor;
// tek seferlik bir istisna değil.
//
// §13.2/§13.15 — âyet metni `homeCards.js`ten aynen gelir, burada
// değiştirilmez/paraphraze edilmez.
// ────────────────────────────────────────────────────────────────────────────

import Link from 'next/link';
import { COLORS, FONTS, SEMANTIC } from '../tokens';

export default function EditorialCard({ card, locale = 'tr', surahNum }) {
  const tr = locale === 'tr';
  const pick = (o) => (tr ? o.tr : o.en);

  return (
    <section
      id={card.id}
      style={{
        background: `linear-gradient(180deg, ${SEMANTIC.surface} 0%, ${SEMANTIC.surfaceRaised} 50%, ${SEMANTIC.surface} 100%)`,
        padding: '80px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        className="editorial-card__grid"
        style={{
          position: 'relative',
          maxWidth: '760px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'auto minmax(0, 1fr)',
          gap: '28px',
        }}
      >
        <div
          aria-hidden="true"
          className="editorial-card__surah-num"
          style={{
            fontFamily: FONTS.display,
            fontSize: '5rem',
            lineHeight: 0.8,
            fontWeight: 700,
            color: 'transparent',
            WebkitTextStroke: `1px ${COLORS.gold}73`,
            paddingTop: '4px',
          }}
        >
          {surahNum}
        </div>

        <div>
          <div
            style={{
              color: `${COLORS.gold}cc`,
              fontFamily: FONTS.body,
              fontSize: '0.72rem',
              fontWeight: 600,
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              marginBottom: '16px',
            }}
          >
            {pick(card.eyebrow)}
          </div>

          <h3
            style={{
              fontFamily: FONTS.display,
              fontWeight: 700,
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              color: COLORS.offWhite,
              lineHeight: 1.2,
              letterSpacing: '-0.015em',
              margin: '0 0 22px',
            }}
          >
            {pick(card.title)}
          </h3>

          <div
            style={{
              borderLeft: `2px solid ${COLORS.gold}`,
              paddingLeft: '18px',
              marginBottom: '22px',
            }}
          >
            <p
              dir="rtl"
              lang="ar"
              style={{
                fontFamily: FONTS.quran,
                // 2026-08-14 — kullanıcı geri bildirimi: ScienceTimelineCard
                // ile aynı ayarlama, tutarlılık için.
                // 2026-08-14 — site geneli tek ortak âyet boyutu, bkz.
                // PortalCard.jsx'teki aynı tarihli not.
                fontSize: '1.95rem',
                color: COLORS.goldBright,
                lineHeight: 2,
                margin: '0 0 8px',
              }}
            >
              {card.verseAr}
            </p>
            <p
              style={{
                fontFamily: FONTS.display,
                fontStyle: 'italic',
                color: COLORS.offWhite,
                fontSize: '0.96rem',
                lineHeight: 1.6,
                margin: '0 0 6px',
              }}
            >
              &ldquo;{pick(card.verseTrans)}&rdquo;
            </p>
            <div
              style={{
                fontSize: '0.72rem',
                color: SEMANTIC.textFaint,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              {pick(card.verseRef)}
            </div>
          </div>

          <p
            style={{
              color: COLORS.silver,
              fontFamily: FONTS.body,
              fontSize: '0.98rem',
              lineHeight: 1.75,
              maxWidth: '62ch',
              margin: '0 0 22px',
            }}
          >
            {pick(card.blurb)}
          </p>

          <Link
            href={`/${locale}${card.href}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: COLORS.gold,
              fontFamily: FONTS.body,
              fontSize: '0.88rem',
              fontWeight: 600,
              textDecoration: 'none',
              borderBottom: `1px solid ${COLORS.gold}66`,
              paddingBottom: '2px',
            }}
          >
            <span>{pick(card.cta)}</span>
            <span aria-hidden style={{ fontSize: '1rem', lineHeight: 1 }}>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
