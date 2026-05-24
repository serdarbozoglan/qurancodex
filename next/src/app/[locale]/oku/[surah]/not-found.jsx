'use client';

import Link from 'next/link';
import { useLanguage } from '@/i18n/LanguageContext';
import { COLORS, FONTS, RADIUS } from '@/tokens';

export default function SurahNotFound() {
  const { language } = useLanguage();
  const isEn = language === 'en';

  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontSize: '4rem',
          fontFamily: FONTS.quran,
          color: COLORS.gold,
          marginBottom: '24px',
          opacity: 0.6,
        }}
        dir="rtl"
        lang="ar"
        aria-hidden="true"
      >
        لَا
      </div>
      <h1
        style={{
          fontSize: 'clamp(1.5rem, 3vw, 2rem)',
          fontFamily: FONTS.display,
          color: COLORS.offWhite,
          marginBottom: '12px',
        }}
      >
        {isEn ? 'Surah Not Found' : 'Sure Bulunamadı'}
      </h1>
      <p
        style={{
          color: COLORS.silver,
          fontSize: '1rem',
          maxWidth: '480px',
          marginBottom: '32px',
          lineHeight: 1.6,
        }}
      >
        {isEn
          ? "The Quran has 114 surahs (1-114). The number you entered doesn't match a valid surah."
          : "Kur'an'da 114 sure vardır (1-114). Girdiğiniz numara geçerli bir sure ile eşleşmiyor."}
      </p>
      <Link
        href={`/${isEn ? 'en' : 'tr'}/oku`}
        style={{
          padding: '12px 28px',
          borderRadius: RADIUS.pill,
          background: COLORS.gold,
          color: COLORS.cosmicBlack,
          fontWeight: 700,
          textDecoration: 'none',
          transition: 'all 0.2s ease',
        }}
      >
        {isEn ? 'View All Surahs' : 'Tüm Sureleri Gör'}
      </Link>
    </div>
  );
}
