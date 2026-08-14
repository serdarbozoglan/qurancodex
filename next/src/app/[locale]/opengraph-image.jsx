// ─── Locale-Aware Default OG Image — Faz 7.5 ────────────────────────────────
// app/[locale]/* segment'leri için default OG kartı. Per-route OG image
// dosyaları (örn. /oku/[surah]/opengraph-image) bu'nu override eder.

import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export const alt = "QuranCodex — Kur'an-ı Kerim'in Görünmeyen Mimarisi";

export default async function Image({ params }) {
  const { locale } = await params;
  const isEN = locale === 'en';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background:
            'radial-gradient(ellipse at center, #0d1b2a 0%, #0a0a1a 60%, #050510 100%)',
          color: '#e8e6e3',
          padding: '60px',
          fontFamily: 'system-ui',
        }}
      >
        <div
          style={{
            color: '#d4a574',
            fontSize: 24,
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            marginBottom: 32,
            fontWeight: 600,
          }}
        >
          QURAN CODEX
        </div>
        <div
          style={{
            fontSize: 84,
            fontWeight: 800,
            lineHeight: 1.05,
            textAlign: 'center',
            color: '#e8e6e3',
            marginBottom: 28,
            maxWidth: 1000,
            letterSpacing: '-0.01em',
          }}
        >
          {isEN ? 'The Invisible' : "Kur'an-ı Kerim'in"}
        </div>
        <div
          style={{
            fontSize: 84,
            fontWeight: 800,
            lineHeight: 1.05,
            textAlign: 'center',
            color: '#d4a574',
            marginBottom: 40,
            maxWidth: 1000,
            letterSpacing: '-0.01em',
          }}
        >
          {isEN ? 'Architecture of the Quran' : 'Görünmeyen Mimarisi'}
        </div>
        <div
          style={{
            width: 180,
            height: 2,
            background: 'linear-gradient(to right, transparent, #d4a574, transparent)',
            marginBottom: 32,
          }}
        />
        <div
          style={{
            color: '#94a3b8',
            fontSize: 28,
            textAlign: 'center',
            maxWidth: 900,
            lineHeight: 1.4,
          }}
        >
          {isEN
            ? 'Linguistic, mathematical, and scientific evidence in interactive form'
            : 'Dilbilimsel, matematiksel ve bilimsel kanıtlarla interaktif keşif'}
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 36,
            color: '#94a3b8',
            opacity: 0.78,
            fontSize: 20,
            letterSpacing: '0.18em',
          }}
        >
          qurancodex.com
        </div>
      </div>
    ),
    {
      ...size,
      headers: {
        'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
      },
    }
  );
}
