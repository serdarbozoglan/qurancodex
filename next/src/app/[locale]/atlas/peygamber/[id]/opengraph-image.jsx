// ─── Per-Prophet OpenGraph Image — Faz 7.5 (audit 2026-05-26) ──────────────
// /[locale]/atlas/peygamber/[id]/opengraph-image — kissa-atlas.json'daki
// her peygamber için unique branded PNG (1200×630) pre-generate.
// generateImageMetadata + generateStaticParams ile build-time'da render.

import { ImageResponse } from 'next/og';
import data from '../../../../../../public/kissa-atlas.json';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'QuranCodex — Peygamber';

const PROPHETS = data.prophets || [];

// Tek bir PNG dönüyoruz; generateImageMetadata KULLANMIYORUZ çünkü edge
// runtime ile uyumsuz (sibling page.js'in generateStaticParams'ı zaten her
// id × locale kombinasyonunu pre-render ediyor → 4×2 = 8 statik PNG artifact).
export default async function Image({ params }) {
  const { locale, id } = await params;
  const p = PROPHETS.find(x => x.id === id);
  const isEN = locale === 'en';

  // Fallback (geçersiz id): generic kart, ama build asla buraya düşmemeli
  // çünkü generateStaticParams sadece geçerli id'leri dönüyor.
  if (!p) {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'radial-gradient(ellipse at center, #0d1b2a 0%, #0a0a1a 60%, #050510 100%)',
            color: '#d4a574', fontFamily: 'system-ui', fontSize: 64, fontWeight: 700,
          }}
        >
          QuranCodex
        </div>
      ),
      { ...size, headers: { 'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800' } },
    );
  }

  const accent = p.color || '#d4a574';
  const nameLatin = isEN ? (p.nameEn || p.nameTr) : (p.nameTr || p.nameEn);
  const sceneCount = Array.isArray(p.scenes) ? p.scenes.length : 0;
  const surahCount = typeof p.surahCount === 'number'
    ? p.surahCount
    : (Array.isArray(p.surahs) ? p.surahs.length : 0);
  const subtitle = isEN
    ? `${surahCount} Surahs · ${sceneCount} Narrative Scenes`
    : `${surahCount} Sure · ${sceneCount} Kıssa Sahnesi`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: 'radial-gradient(ellipse at center, #0d1b2a 0%, #0a0a1a 60%, #050510 100%)',
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
            marginBottom: 28,
            fontWeight: 600,
          }}
        >
          QURAN CODEX · {isEN ? 'PROPHET' : 'PEYGAMBER'}
        </div>

        {/* Arabic name — prophet's themed color */}
        <div
          dir="rtl"
          lang="ar"
          style={{
            fontSize: 124,
            fontWeight: 700,
            lineHeight: 1.15,
            color: accent,
            marginBottom: 24,
            textAlign: 'center',
            maxWidth: 1080,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {p.nameAr}
        </div>

        {/* Decorative line */}
        <div
          style={{
            width: 220,
            height: 2,
            background: `linear-gradient(to right, transparent, ${accent}, transparent)`,
            marginBottom: 28,
          }}
        />

        {/* Latin name */}
        <div
          style={{
            fontSize: 84,
            fontWeight: 800,
            color: '#e8e6e3',
            marginBottom: 20,
            textAlign: 'center',
            letterSpacing: '-0.01em',
            maxWidth: 1080,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {nameLatin}
        </div>

        {/* Subtitle — surah + scene count */}
        <div
          style={{
            fontSize: 28,
            color: '#94a3b8',
            textAlign: 'center',
            fontWeight: 400,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {subtitle}
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
        {/* Bottom-right URL */}
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
    {
      ...size,
      headers: {
        'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
      },
    },
  );
}
