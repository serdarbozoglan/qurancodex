// ─── PortalCard — anasayfa anlatı kartı (SUNUCU BİLEŞENİ) ───────────────────
//
// 2026-08-13 · P4 + P5. Öncesinde 14 ayrı dosya / 2.742 satır / hepsi
// 'use client' + framer-motion. Yapı %95 aynıydı; yalnız veri değişiyordu.
// Veri `src/data/homeCards.js`e, yapı buraya taşındı.
//
// NEDEN SUNUCU BİLEŞENİ:
//   - `useLanguage()` yerine `locale` prop'u — dil zaten URL'den türüyor
//     (LanguageContext pathname'i source-of-truth alıyor), dil değişince
//     tam navigasyon oluyor. Yani context'e ihtiyaç yok.
//   - `whileInView` yerine `data-reveal` + tek <ScrollRevealRoot> observer.
//   - `onMouseEnter` yerine CSS `:hover` (globals.css → `.portal-card`).
// Sonuç: 14 hydration adası → 1.
//
// ÜÇ KADEME (P4 — ritim):
//   feature — küme çıpası. Tam anlatı, en geniş dolgu, FeaturedWrap rozeti.
//   medium  — tam anlatı, 760px panel. Eski tüm kartların formatı.
//   compact — <CompactRow> ızgarasında ikili/üçlü. Uzun blurb düşer;
//             eyebrow · başlık · âyet · çeviri · referans · kicker · CTA kalır.
//             Derin metin zaten CTA'nın gittiği araç sayfasında.
//
// §13.2 — Arapça yalnız FONTS.quran. §13.1 — renkler yalnız tokens.
// ────────────────────────────────────────────────────────────────────────────

import Link from 'next/link';
import { COLORS, FONTS, SEMANTIC } from '../tokens';
import CardWaveViz from './CardWaveViz';

export default function PortalCard({ card, locale = 'tr', extra = null, accent = COLORS.gold }) {
  const tr = locale === 'tr';
  const pick = (o) => (tr ? o.tr : o.en);
  // v2.0 — küme aksanı: eyebrow bu rengi alır (kutsal metin/başlık/kicker
  // DAİMA gold kalır). Varsayılan gold → mevcut kartlar değişmez.
  const { id, weight = 'medium', href } = card;
  const compact = weight === 'compact';

  // P7 (2026-08-13) — başlık SEVİYESİ kademeyi izler.
  // Öncesinde 14 kartın 14'ü de <h2>ydi; anasayfada 19 düz h2 vardı ve
  // hiçbiri diğerinden daha önemli görünmüyordu. P4 ritmi kartları üç
  // ağırlığa ayırdıktan sonra bunu başlık ağacına da yansıtmamak tutarsız
  // kalıyordu. compact kartlar ızgarada, kendilerinden ÖNCE gelen feature/
  // medium kartın altına düşüyor — seviye atlaması yok (h2 → h3).
  // Sonuç: 19 h2 → 11. Görsel değişiklik YOK, font boyutu inline.
  const Heading = compact ? 'h3' : 'h2';

  return (
    <section
      id={id}
      className={`portal-card portal-card--${weight}`}
      style={
        compact
          ? { position: 'relative' }
          : {
              background: `linear-gradient(180deg, ${SEMANTIC.surface} 0%, ${SEMANTIC.surfaceRaised} 50%, ${SEMANTIC.surface} 100%)`,
              padding: weight === 'feature' ? '110px 24px' : '90px 24px',
              position: 'relative',
              overflow: 'hidden',
            }
      }
    >
      {!compact && (
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: `radial-gradient(ellipse at center, ${COLORS.gold}10 0%, transparent 55%)`,
          }}
        />
      )}

      <div
        className="portal-card__panel lift-hover"
        data-reveal
        style={{
          position: 'relative',
          maxWidth: compact ? 'none' : '760px',
          margin: compact ? 0 : '0 auto',
          height: compact ? '100%' : undefined,
          textAlign: 'center',
          padding: compact
            ? 'clamp(28px, 4vw, 36px) clamp(20px, 3vw, 28px)'
            : 'clamp(40px, 6vw, 64px) clamp(28px, 5vw, 56px)',
          // v2.0 — "havada asılı" glass panel: navy taban + hafif blur.
          background:
            'linear-gradient(180deg, rgba(13,27,42,0.55) 0%, rgba(7,9,19,0.42) 100%)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          // kenarlık küme aksanını taşır (kutsal metin/başlık gold kalır)
          border: `1px solid ${accent}${compact ? '33' : '4d'}`,
          borderRadius: '18px',
          boxShadow: `inset 0 0 0 1px ${accent}12, 0 30px 80px rgba(0,0,0,0.4)`,
          display: compact ? 'flex' : undefined,
          flexDirection: compact ? 'column' : undefined,
        }}
      >
        <div
          style={{
            color: accent === COLORS.gold ? `${COLORS.gold}cc` : accent,
            fontFamily: FONTS.body,
            fontSize: compact ? '0.66rem' : '0.72rem',
            fontWeight: 600,
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            marginBottom: compact ? '14px' : '22px',
          }}
        >
          {pick(card.eyebrow)}
        </div>

        <Heading
          style={{
            fontFamily: FONTS.display,
            fontWeight: 700,
            // 2026-08-14 (B3, mockup turu onaylandı) — feature ve medium
            // öncesi AYNI ölçeği kullanıyordu, tek fark dolgu (110px/90px)
            // idi. Küme çıpası (feature) artık gerçekten daha büyük konuşur.
            fontSize: compact
              ? 'clamp(1.2rem, 2.4vw, 1.45rem)'
              : weight === 'feature'
                ? 'clamp(2.2rem, 5vw, 3.4rem)'
                : 'clamp(1.7rem, 4vw, 2.6rem)',
            color: COLORS.offWhite,
            lineHeight: 1.15,
            letterSpacing: weight === 'feature' ? '-0.02em' : '-0.015em',
            margin: compact ? '0 0 22px' : '0 0 36px',
          }}
        >
          {pick(card.title)}
        </Heading>

        {/* Çıpa âyet — §13.15: metin homeCards.js'ten gelir, hafızadan yazılmaz */}
        <div style={{ marginBottom: compact ? '20px' : '36px' }}>
          <p
            dir="rtl"
            lang="ar"
            style={{
              fontFamily: FONTS.quran,
              // 2026-08-14 — kullanıcı geri bildirimi: anasayfada âyet
              // boyutu kart tipine göre 4 farklı değere dağılmıştı (20.8 /
              // 23.2 / 26.4 / 31.2px). Tek ortak boyuta indirildi — en dar
              // bağlam (kompakt 2'li ızgara, 390px) 1.95rem'de test edildi,
              // taşma yok (6/6 âyet, 40px+ pay).
              fontSize: '1.95rem',
              color: COLORS.gold,
              lineHeight: 2.1,
              margin: '0 0 14px',
              // 2026-08-13 — âyet metnindeki dekoratif `textShadow` KALDIRILDI.
              // GPT-5.4 hakem turu: "Ayetin kendisini efekt nesnesi yapmak en
              // riskli olanı; glow/particle/reveal efektleri kutsal metni
              // ucuzlaştırır." Sitenin kendi §13.24 disiplini de aynı yöne
              // bakıyor. Âyet altın rengiyle zaten ayrışıyor; parıltıya gerek yok.
            }}
          >
            {card.verseAr}
          </p>
          <p
            style={{
              color: COLORS.offWhite,
              fontFamily: FONTS.display,
              fontStyle: 'italic',
              fontSize: compact
                ? 'clamp(0.88rem, 1.6vw, 0.95rem)'
                : 'clamp(0.95rem, 2vw, 1.1rem)',
              lineHeight: 1.65,
              margin: '0 0 6px',
              maxWidth: compact ? 'none' : '600px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            &ldquo;{pick(card.verseTrans)}&rdquo;
          </p>
          <p
            style={{
              color: COLORS.silver,
              fontFamily: FONTS.body,
              fontSize: '0.72rem',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              margin: 0,
              // 0.7 idi → 4.23 kontrast, AA'nın (4.5) altında. Ölçüldü:
              // silver #94a3b8 cosmic-black üstünde opaklık .75'ten itibaren
              // geçiyor (4.70). Renk tokenı değil, OPAKLIK sorunuydu.
              opacity: 0.78,
            }}
          >
            — {pick(card.verseRef)}
          </p>
        </div>

        {/* compact kademede uzun blurb düşer — derin metin araç sayfasında */}
        {!compact && (
          <p
            style={{
              color: COLORS.silver,
              fontFamily: FONTS.body,
              fontSize: 'clamp(0.95rem, 2vw, 1.05rem)',
              lineHeight: 1.75,
              maxWidth: '620px',
              margin: '0 auto 40px',
            }}
          >
            {pick(card.blurb)}
          </p>
        )}

        {extra}

        {/* v2.0 — Ses Mimarisi kartına canlı ses dokusu (sert→akıcı dalga).
            Kartın kendi temasının görsel karşılığı, süs değil. */}
        {id === 'ses-card' && <CardWaveViz />}

        {/* compact'te kicker CTA'nın ÜSTÜNDE: özet cümle karta gövde verir,
            CTA en altta kalınca ızgaradaki kartların butonları hizalanır. */}
        {compact && (
          <p
            style={{
              color: COLORS.silver,
              fontFamily: FONTS.display,
              fontStyle: 'italic',
              fontSize: '0.84rem',
              lineHeight: 1.6,
              margin: '0 0 22px',
              opacity: 0.78,
              flexGrow: 1,
            }}
          >
            {pick(card.kicker)}
          </p>
        )}

        <div style={{ marginTop: compact ? 'auto' : 0 }}>
          <Link
            href={`/${locale}${href}`}
            className="portal-card__cta"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              background: `${accent}1a`,
              border: `1px solid ${accent}66`,
              borderRadius: '999px',
              padding: compact ? '11px 20px' : '14px 28px',
              color: accent,
              fontFamily: FONTS.body,
              fontSize: compact ? '0.8rem' : '0.94rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              textDecoration: 'none',
            }}
          >
            <span>{pick(card.cta)}</span>
            <span aria-hidden style={{ fontSize: '1.1rem', lineHeight: 1 }}>
              →
            </span>
          </Link>
        </div>

        {!compact && (
          <p
            style={{
              color: COLORS.silver,
              fontFamily: FONTS.display,
              fontStyle: 'italic',
              fontSize: '0.9rem',
              marginTop: '34px',
              lineHeight: 1.6,
              opacity: 0.78,
            }}
          >
            {pick(card.kicker)}
          </p>
        )}
      </div>
    </section>
  );
}
