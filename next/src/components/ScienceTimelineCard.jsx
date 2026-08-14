// ─── ScienceTimelineCard — "Bilimsel İşaretler" anasayfa kartı ──────────────
//
// 2026-08-14 · B1a (görsel tasarım mockup turu, onaylandı).
// PortalCard'ın 14/14 tekrar eden "ortalı panel + altın çerçeve" iskeletinin
// TEK istisnası. İçerik zaten kronolojik (4 keşif, 4 tarih) — bunu düz
// metinde anlatmak yerine dikey zaman çizelgesi olarak gösteriyoruz.
//
// Şablon PortalCard'ın feature dış kabuğuyla (gradient + radyal parıltı)
// aynı kalır — FeaturedWrap'in "ÖNE ÇIKAN" rozetiyle tutarlı otursun diye.
// Yalnız İÇ panel değişti: ortalı → sola dayalı zaman çizelgesi.
//
// §13.15 — Âyet metinleri `data/scienceTimeline.js`ten gelir (mekanik +
// doğrulanmış), burada hafızadan yazılmaz.
// ────────────────────────────────────────────────────────────────────────────

import Link from 'next/link';
import { COLORS, FONTS, SEMANTIC } from '../tokens';
import { SCIENCE_TIMELINE } from '../data/scienceTimeline';

export default function ScienceTimelineCard({ card, locale = 'tr' }) {
  const tr = locale === 'tr';
  const pick = (o) => (tr ? o.tr : o.en);

  return (
    <section
      id={card.id}
      style={{
        background: `linear-gradient(180deg, ${SEMANTIC.surface} 0%, ${SEMANTIC.surfaceRaised} 50%, ${SEMANTIC.surface} 100%)`,
        padding: '110px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: `radial-gradient(ellipse at center, ${COLORS.gold}10 0%, transparent 55%)`,
        }}
      />

      <div
        data-reveal
        style={{
          position: 'relative',
          maxWidth: '640px',
          margin: '0 auto',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div
            style={{
              color: `${COLORS.gold}cc`,
              fontFamily: FONTS.body,
              fontSize: '0.72rem',
              fontWeight: 600,
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              marginBottom: '22px',
            }}
          >
            {pick(card.eyebrow)}
          </div>
          <h2
            style={{
              fontFamily: FONTS.display,
              fontWeight: 700,
              fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
              color: COLORS.offWhite,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              margin: '0 0 20px',
            }}
          >
            {pick(card.title)}
          </h2>
          <p
            style={{
              color: COLORS.silver,
              fontFamily: FONTS.body,
              fontSize: '1rem',
              lineHeight: 1.7,
              maxWidth: '520px',
              margin: '0 auto',
            }}
          >
            {pick(card.blurb)}
          </p>
        </div>

        {/* Zaman çizelgesi — sola dayalı, keşif sırasına göre */}
        <div
          style={{
            position: 'relative',
            paddingLeft: '30px',
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: '6px',
              top: '6px',
              bottom: '6px',
              width: '1px',
              background: `linear-gradient(180deg, ${COLORS.gold} 0%, ${COLORS.gold}26 100%)`,
            }}
          />
          {SCIENCE_TIMELINE.map((node, i) => (
            <div
              key={`${node.surah}:${node.ayah}`}
              style={{
                position: 'relative',
                paddingBottom: i === SCIENCE_TIMELINE.length - 1 ? 0 : '34px',
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  left: '-30px',
                  top: '6px',
                  width: '9px',
                  height: '9px',
                  borderRadius: '50%',
                  background: COLORS.cosmicBlack,
                  border: `2px solid ${COLORS.gold}`,
                }}
              />
              <div
                style={{
                  fontFamily: FONTS.body,
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  color: COLORS.gold,
                }}
              >
                {pick({ tr: node.discoveryTr, en: node.discoveryEn })}
              </div>
              <div
                style={{
                  fontFamily: FONTS.display,
                  fontSize: '1.15rem',
                  color: COLORS.offWhite,
                  margin: '5px 0 10px',
                }}
              >
                {pick({ tr: node.topicTr, en: node.topicEn })}
              </div>
              <p
                dir="rtl"
                lang="ar"
                style={{
                  fontFamily: FONTS.quran,
                  // 2026-08-14 — kullanıcı geri bildirimi: timeline burada
                  // kartın asıl içeriği, ikincil değil; 1.15rem çok küçük
                  // kalıyordu.
                  // 2026-08-14 — site geneli tek ortak âyet boyutu, bkz.
                  // PortalCard.jsx'teki aynı tarihli not.
                  fontSize: '1.95rem',
                  color: COLORS.goldBright,
                  lineHeight: 2,
                  margin: '0 0 8px',
                }}
              >
                {node.ar}
              </p>
              <div
                style={{
                  fontSize: '0.76rem',
                  color: SEMANTIC.textFaint,
                  letterSpacing: '0.04em',
                }}
              >
                {pick({ tr: node.refTr, en: node.refEn })}
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '48px' }}>
          <Link
            href={`/${locale}${card.href}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              background: `${COLORS.gold}1a`,
              border: `1px solid ${COLORS.gold}66`,
              borderRadius: '999px',
              padding: '14px 28px',
              color: COLORS.gold,
              fontFamily: FONTS.body,
              fontSize: '0.94rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              textDecoration: 'none',
            }}
          >
            <span>{pick(card.cta)}</span>
            <span aria-hidden style={{ fontSize: '1.1rem', lineHeight: 1 }}>→</span>
          </Link>
          <p
            style={{
              color: COLORS.silver,
              fontFamily: FONTS.display,
              fontStyle: 'italic',
              fontSize: '0.9rem',
              marginTop: '26px',
              lineHeight: 1.6,
              opacity: 0.78,
            }}
          >
            {pick(card.kicker)}
          </p>
        </div>
      </div>
    </section>
  );
}
