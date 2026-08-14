// ─── Esmâ-i Hüsnâ OG Image ─────────────────────────────────────────────────────
// /[locale]/arac/esma-frekans için custom OG kartı. Genel /arac/* kategori
// kartını override eder (Next.js Metadata cascade — yakın dosya kazanır).
//
// Tasarım: Üst marka şeridi · "114 · 19 · 1" mührü · büyük başlık · alt manifesto.
// ──────────────────────────────────────────────────────────────────────────────

import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export const alt = "QuranCodex — Esmâ-i Hüsnâ";

export default async function Image({ params }) {
  const { locale } = await params;
  const isEN = locale === 'en';

  const titleTr = "Esmâ-i Hüsnâ";
  const titleEn = "Names of God";
  const tagline = isEN
    ? "114 names · 6 236 verses · 19 thematic axes · one Creator"
    : "114 isim · 6 236 ayet · 19 tematik eksen · tek Yaratıcı";
  const subtagline = isEN
    ? "How God describes Himself in the Quran"
    : "Allah'ın Kur'an'da kendisini tanıttığı isimler";

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
            fontSize: 22,
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            marginBottom: 18,
            fontWeight: 600,
          }}
        >
          QURAN CODEX · {isEN ? 'NAMES' : 'ESMÂ'}
        </div>

        {/* Numeric seal — 114 · 19 · 1 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 28,
            marginBottom: 24,
            color: '#d4a574',
            opacity: 0.85,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontSize: 60, fontWeight: 800, lineHeight: 1 }}>114</span>
            <span style={{ fontSize: 18, letterSpacing: '0.16em', textTransform: 'uppercase', opacity: 0.7 }}>
              {isEN ? 'NAMES' : 'İSİM'}
            </span>
          </div>
          <div style={{ fontSize: 40, opacity: 0.4 }}>·</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontSize: 60, fontWeight: 800, lineHeight: 1 }}>19</span>
            <span style={{ fontSize: 18, letterSpacing: '0.16em', textTransform: 'uppercase', opacity: 0.7 }}>
              {isEN ? 'AXES' : 'EKSEN'}
            </span>
          </div>
          <div style={{ fontSize: 40, opacity: 0.4 }}>·</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontSize: 60, fontWeight: 800, lineHeight: 1 }}>1</span>
            <span style={{ fontSize: 18, letterSpacing: '0.16em', textTransform: 'uppercase', opacity: 0.7 }}>
              {isEN ? 'CREATOR' : 'YARATICI'}
            </span>
          </div>
        </div>

        {/* Big title */}
        <div
          style={{
            fontSize: 110,
            fontWeight: 800,
            lineHeight: 1.05,
            textAlign: 'center',
            color: '#d4a574',
            marginBottom: 22,
            maxWidth: 1080,
            letterSpacing: '-0.02em',
          }}
        >
          {isEN ? titleEn : titleTr}
        </div>

        {/* Decorative line */}
        <div
          style={{
            width: 220,
            height: 2,
            background: 'linear-gradient(to right, transparent, #d4a574, transparent)',
            marginBottom: 24,
          }}
        />

        {/* Subtagline */}
        <div
          style={{
            color: '#e8e6e3',
            fontSize: 28,
            textAlign: 'center',
            maxWidth: 1000,
            lineHeight: 1.4,
            fontWeight: 400,
            marginBottom: 14,
          }}
        >
          {subtagline}
        </div>

        {/* Numeric tagline */}
        <div
          style={{
            color: '#94a3b8',
            fontSize: 20,
            textAlign: 'center',
            maxWidth: 1000,
            lineHeight: 1.4,
            opacity: 0.8,
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
            fontSize: 22,
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
            opacity: 0.78,
            fontSize: 18,
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
