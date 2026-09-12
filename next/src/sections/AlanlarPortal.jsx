'use client';

// Anasayfa "Alanına Göre Keşfet" portal bölümü — 12 disiplin kapısı.
// Mobil-uyumlu (auto-fill minmax grid + clamp font, JS düzen yok → CLS yok) ve
// performant (statik, animasyonsuz). Disiplin listesi tek kaynak: disciplines.js.

import Link from 'next/link';
import { useLanguage } from '@/i18n/LanguageContext';
import { COLORS, FONTS, SEMANTIC, RADIUS } from '@/tokens';
import { DISCIPLINES } from '@/data/disciplines';

export default function AlanlarPortal() {
  const { language } = useLanguage();
  const tr = language !== 'en';
  return (
    <section
      aria-label={tr ? 'Alanına Göre Keşfet' : 'Explore by Field'}
      style={{ maxWidth: 1120, margin: '0 auto', width: '100%', padding: 'clamp(40px, 7vw, 64px) 20px', boxSizing: 'border-box' }}
    >
      <div style={{ textAlign: 'center', marginBottom: 30 }}>
        <div style={{ fontFamily: FONTS.body, fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.26em', textTransform: 'uppercase', color: COLORS.gold, opacity: 0.78, marginBottom: 12 }}>
          {tr ? 'Alanına Göre Keşfet' : 'Explore by Field'}
        </div>
        <h2 style={{ fontFamily: FONTS.display, color: COLORS.offWhite, fontWeight: 700, fontSize: 'clamp(1.5rem, 4.4vw, 2.2rem)', lineHeight: 1.18, margin: '0 0 14px' }}>
          {tr ? "Kendi alanından Kur'an'a bir kapı" : "A gateway to the Qur'an from your own field"}
        </h2>
        <p style={{ fontFamily: FONTS.body, color: SEMANTIC.textMuted, fontSize: '0.98rem', lineHeight: 1.7, margin: '0 auto', maxWidth: 620 }}>
          {tr
            ? 'Psikoloji, liderlik, adalet, dil, tarih… İlgi ya da uzmanlık alanından gir; o alanla ilgili âyet, tefsir ve araçlar bir arada.'
            : 'Psychology, leadership, justice, language, history… Enter from your interest or expertise; the related verses, exegesis and tools in one place.'}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
        {DISCIPLINES.map((d) => (
          <Link
            key={d.id}
            href={`/${language}/alanlar/${d.id}`}
            className="alanlar-portal-chip"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
              textDecoration: 'none',
              background: 'rgba(255,255,255,0.025)',
              border: `1px solid ${COLORS.gold}26`,
              borderRadius: RADIUS.md,
              padding: '13px 16px',
              fontFamily: FONTS.body,
              color: COLORS.offWhite,
              fontSize: '0.9rem', fontWeight: 600,
              minWidth: 0,
            }}
          >
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {tr ? d.titleTr : d.titleEn}
            </span>
            <span aria-hidden="true" style={{ color: COLORS.gold, opacity: 0.7, flexShrink: 0 }}>→</span>
          </Link>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <Link
          href={`/${language}/alanlar`}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none',
            background: `${COLORS.gold}1a`, border: `1px solid ${COLORS.gold}40`,
            borderRadius: RADIUS.pill, padding: '10px 22px',
            fontFamily: FONTS.body, color: COLORS.gold, fontSize: '0.86rem', fontWeight: 700, letterSpacing: '0.02em',
          }}
        >
          {tr ? 'Tüm alanları gör' : 'See all fields'} <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
