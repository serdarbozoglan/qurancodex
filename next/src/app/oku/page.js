import Link from 'next/link';
import { COLORS, FONTS } from '@/tokens';

export const metadata = {
  title: "Kur'an Okuma",
  description: "ReadingMode migration in progress — Faz 4.1'de tam Kur'an okuma deneyimi gelecek.",
};

// Geçici placeholder. ReadingMode (~8700 satır, audio karaoke + tajweed
// render + per-surah cache + 6 reciter) Faz 4.1'in ana işi. O migrate
// edilince burası gerçek okuma sayfasıyla değişir.

export default function OkuPlaceholder() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '64px 24px',
        background: COLORS.cosmicBlack,
        color: COLORS.offWhite,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontFamily: FONTS.body,
          fontSize: '0.78rem',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: COLORS.gold,
          marginBottom: '16px',
        }}
      >
        Faz 4.1 · Yapım Aşamasında
      </div>

      <h1
        style={{
          fontFamily: FONTS.display,
          fontWeight: 900,
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          color: COLORS.offWhite,
          margin: '0 0 16px',
        }}
      >
        Kur'an Okuma
      </h1>

      <p
        style={{
          color: COLORS.silver,
          maxWidth: '520px',
          lineHeight: 1.7,
          marginBottom: '40px',
        }}
      >
        ReadingMode (per-sure audio + karaoke + tajweed + 6 kâri + tefsir paneli)
        Next.js'e migrate ediliyor. Bu sayfa şu an iskelet hâlinde.
      </p>

      <p
        dir="rtl"
        lang="ar"
        style={{
          fontFamily: FONTS.quran,
          fontSize: '2rem',
          color: COLORS.gold,
          marginBottom: '40px',
        }}
      >
        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
      </p>

      <Link
        href="/"
        style={{
          height: '36px',
          display: 'inline-flex',
          alignItems: 'center',
          padding: '0 18px',
          background: 'rgba(255,255,255,0.06)',
          border: `1px solid ${COLORS.glassBorder}`,
          borderRadius: '8px',
          color: COLORS.offWhite,
          fontFamily: FONTS.body,
          fontSize: '0.85rem',
          textDecoration: 'none',
          transition: 'background 0.15s',
        }}
      >
        ← Ana sayfa
      </Link>
    </main>
  );
}
