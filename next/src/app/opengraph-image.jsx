// ─── Default OpenGraph Image — Faz 7.5 ──────────────────────────────────────
// Tüm route'lar için fallback OG kartı (1200x630).
// Twitter card, Facebook, LinkedIn, WhatsApp paylaşımlarında görünür.
// ImageResponse Next.js 16 built-in (next/og) — extra paket yok.

import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = "QuranCodex — Kur'an-ı Kerim'in Görünmeyen Mimarisi";
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
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
            fontSize: 24,
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            marginBottom: 32,
            fontWeight: 600,
          }}
        >
          QURAN CODEX
        </div>

        {/* Main title — serif (Playfair-like) */}
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
          Kur'an-ı Kerim'in
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
          Görünmeyen Mimarisi
        </div>

        {/* Decorative line */}
        <div
          style={{
            width: 180,
            height: 2,
            background: 'linear-gradient(to right, transparent, #d4a574, transparent)',
            marginBottom: 32,
          }}
        />

        {/* Subtitle */}
        <div
          style={{
            color: '#94a3b8',
            fontSize: 28,
            textAlign: 'center',
            maxWidth: 900,
            lineHeight: 1.4,
          }}
        >
          Dilbilimsel, matematiksel ve bilimsel kanıtlarla interaktif keşif
        </div>

        {/* Bottom domain */}
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
