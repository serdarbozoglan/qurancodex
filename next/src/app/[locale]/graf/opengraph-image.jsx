// ─── Graf Category OG Image — Faz 7.5 ──────────────────────────────────────
// /[locale]/graf/* segment'leri için kategori-level OG kartı. Tüm graf
// alt route'larına (ayet, kavram, kelime-isi, diyalog, zaman, semantik,
// karsilastir) cascade eder. Bireysel tool'lar kendi opengraph-image.jsx
// dosyalarıyla override edebilir.

import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export const alt = 'QuranCodex — Graph';

export default async function Image({ params }) {
  const { locale } = await params;
  const isEN = locale === 'en';

  const titleLine = isEN ? 'Graph' : 'Graf';
  const tagline = isEN
    ? 'Verses, concepts, and dialogues as interactive networks'
    : 'Ayetler, kavramlar ve diyaloglar etkileşimli ağlar olarak';

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
        {/* Top brand label */}
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
          QURAN CODEX · {isEN ? 'GRAPH' : 'GRAF'}
        </div>

        {/* Category title */}
        <div
          style={{
            fontSize: 140,
            fontWeight: 800,
            lineHeight: 1.0,
            textAlign: 'center',
            color: '#d4a574',
            marginBottom: 36,
            maxWidth: 1080,
            letterSpacing: '-0.02em',
          }}
        >
          {titleLine}
        </div>

        {/* Decorative line */}
        <div
          style={{
            width: 220,
            height: 2,
            background:
              'linear-gradient(to right, transparent, #d4a574, transparent)',
            marginBottom: 32,
          }}
        />

        {/* Tagline */}
        <div
          style={{
            color: '#e8e6e3',
            fontSize: 32,
            textAlign: 'center',
            maxWidth: 1000,
            lineHeight: 1.4,
            fontWeight: 400,
          }}
        >
          {tagline}
        </div>

        {/* Bottom-left brand */}
        <div
          style={{
            position: 'absolute',
            bottom: 36,
            left: 60,
            color: '#d4a574',
            fontSize: 24,
            letterSpacing: '0.18em',
            fontWeight: 600,
          }}
        >
          QURAN CODEX
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 36,
            right: 60,
            color: '#94a3b8',
            opacity: 0.6,
            fontSize: 20,
            letterSpacing: '0.18em',
          }}
        >
          qurancodex.com
        </div>
      </div>
    ),
    { ...size }
  );
}
