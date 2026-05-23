// ─── Per-Surah OpenGraph Image — Faz 7.5 ────────────────────────────────────
// Her sure için unique OG kartı — sure adı + numara + Arapça aciton.
// Twitter/Facebook paylaşımı: "/tr/oku/2 paylaşıldığında El-Bakara branded
// kartı görünür".

import { ImageResponse } from 'next/og';
import { SURAH_NAMES_TR } from '@/lib/surahNames';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export const alt = 'QuranCodex';

export default async function Image({ params }) {
  const { surah } = await params;
  const s = parseInt(surah, 10);
  const valid = !Number.isNaN(s) && s >= 1 && s <= 114;
  const nameTr = valid ? SURAH_NAMES_TR[s - 1] : 'Kur\'an';

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
        {/* Top label */}
        <div
          style={{
            color: '#d4a574',
            fontSize: 22,
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            marginBottom: 24,
            fontWeight: 600,
          }}
        >
          Quran Codex · Sure {valid ? s : '?'}
        </div>

        {/* Surah name — Latin */}
        <div
          style={{
            fontSize: 124,
            fontWeight: 800,
            lineHeight: 1.05,
            textAlign: 'center',
            color: '#e8e6e3',
            marginBottom: 30,
            maxWidth: 1080,
            letterSpacing: '-0.01em',
          }}
        >
          {nameTr}
        </div>

        {/* Decorative line */}
        <div
          style={{
            width: 180,
            height: 2,
            background: 'linear-gradient(to right, transparent, #d4a574, transparent)',
            marginBottom: 28,
          }}
        />

        {/* Bottom-left brand + bottom-right URL */}
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
