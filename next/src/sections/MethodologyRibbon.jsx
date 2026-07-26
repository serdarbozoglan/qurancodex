'use client';

// ─── MethodologyRibbon — "Örtüşme ≠ Kanıt" güven şeridi ───────────────────────
// Hero + Concierge sonrası, keşfe (SixGates) dalmadan önce yerleşen ince güven
// bloğu. Amaç: yeni ziyaretçinin "bu güvenilir mi?" sorusuna ilk ekranlarda
// yanıt (GPT-5.2 review A1 · 2026-07-25). Epistemik kısıt: işaretler kanıt değil
// örtüşme; Kur'ân metni esastır. Renk-nötr — mevcut token'lar (freeze uyumlu).

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS } from '../tokens';

export default function MethodologyRibbon() {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 640);
    h();
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  const chips = tr
    ? ['Metin: Hafs mushafı', 'Klasik tefsir + akademik kaynak', 'Örtüşme ≠ kanıt']
    : ['Text: Ḥafṣ muṣḥaf', 'Classical tafsir + academic sources', 'Alignment ≠ proof'];

  return (
    <section
      aria-label={tr ? 'Yöntem ve çerçeve' : 'Method and framing'}
      style={{
        padding: isMobile ? '26px 16px' : '38px 24px',
        background: `linear-gradient(180deg, transparent 0%, ${COLORS.gold}06 50%, transparent 100%)`,
      }}
    >
      <div
        style={{
          maxWidth: '860px',
          margin: '0 auto',
          textAlign: 'center',
          border: `1px solid ${COLORS.gold}1f`,
          borderRadius: '14px',
          background: 'rgba(255,255,255,0.02)',
          padding: isMobile ? '22px 18px' : '28px 34px',
        }}
      >
        <div
          style={{
            color: `${COLORS.gold}cc`,
            fontFamily: FONTS.body,
            fontSize: '0.7rem',
            fontWeight: 600,
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            marginBottom: '12px',
          }}
        >
          {tr ? 'Çerçeve · Yöntem' : 'Framing · Method'}
        </div>

        <p
          style={{
            color: COLORS.offWhite,
            fontFamily: FONTS.display,
            fontStyle: 'italic',
            fontSize: isMobile ? '1.05rem' : '1.2rem',
            lineHeight: 1.5,
            margin: '0 auto 18px',
            maxWidth: '640px',
          }}
        >
          {tr
            ? '"İşaretler" kanıt değil, örtüşmedir. Kur\'ân metni esastır; her çıkarım klasik tefsir ve akademik kaynağa dayanır.'
            : '"Signs" are alignment, not proof. The Qur\'anic text is primary; every inference rests on classical tafsir and academic sources.'}
        </p>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '20px',
          }}
        >
          {chips.map((c, i) => (
            <span
              key={i}
              style={{
                fontFamily: FONTS.body,
                fontSize: '0.74rem',
                color: COLORS.silver,
                border: `1px solid ${COLORS.gold}22`,
                borderRadius: '999px',
                padding: '5px 13px',
                background: `${COLORS.gold}0a`,
                whiteSpace: 'nowrap',
              }}
            >
              {c}
            </span>
          ))}
        </div>

        <Link
          href={`/${language}/hakkinda`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '7px',
            color: COLORS.gold,
            fontFamily: FONTS.body,
            fontSize: '0.85rem',
            fontWeight: 600,
            letterSpacing: '0.04em',
            textDecoration: 'none',
            borderBottom: `1px solid ${COLORS.gold}44`,
            paddingBottom: '2px',
          }}
        >
          {tr ? 'Metodoloji & Kaynaklar' : 'Methodology & Sources'}
          <span style={{ fontSize: '1rem', lineHeight: 1 }}>→</span>
        </Link>
      </div>
    </section>
  );
}
