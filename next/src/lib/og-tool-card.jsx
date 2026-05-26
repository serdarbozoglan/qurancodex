// ─── Tool OG Card Helper — Faz 7.5 (audit 2026-05-26 tool-route-og) ──────────
// Per-route opengraph-image.jsx için ortak ImageResponse JSX'i. Approach B
// (audit §5.2): 35 tool route × ~30 LoC + 1 helper ≈ 1,170 LoC toplam,
// per-route standalone (4,550 LoC) yerine tercih edildi.
//
// Layout, /atlas/peygamber/[id]/opengraph-image.jsx ile aynı kompozisyondur:
//   QURAN CODEX · <CATEGORY>     (top brand label, gold, uppercase, tracked)
//   ─────────────────────────
//   <Arabic glyph>               (large, accent renkte, RTL)
//   ─── decorative line ───      (accent gradient)
//   <Latin Title>                (off-white, bold)
//   <Subtitle>                   (silver, 28px)
//   QURAN CODEX     qurancodex.com   (bottom brand strip)
//
// Tokens: COLORS.cosmicBlack / deepNavy / offWhite / silver / gold — hardcoded
// hex YASAK (CLAUDE.md §13.1). Accent rengi tool'a göre dışarıdan gelir.
// Font: system-ui — Edge runtime'da KFGQPC subset embedding maliyetli
// (per-prophet pattern'le aynı tercih). Glyph'ler harekesiz/light-haraka
// olmalı (audit §5.4 risk notu).

import { ImageResponse } from 'next/og';
import { COLORS } from '../tokens';

const CACHE_HEADERS = {
  'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
};

const BG_GRADIENT =
  `radial-gradient(ellipse at center, ${COLORS.deepNavy} 0%, ${COLORS.cosmicBlack} 60%, #050510 100%)`;

/**
 * Build a tool-route OpenGraph PNG (1200×630).
 *
 * @param {object} args
 * @param {string} args.category    Top label (e.g. 'ATLAS', 'GRAF', 'ARAÇ').
 * @param {string} args.title       Latin title (locale-resolved).
 * @param {string} args.subtitle    One-line descriptor below the title.
 * @param {string} args.glyph       Arabic glyph (RTL, single short word/phrase).
 * @param {string} args.accentColor Hex (e.g. '#60a5fa') — drives glyph + line.
 * @returns {ImageResponse}
 */
export function toolOgCard({ category, title, subtitle, glyph, accentColor }) {
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
          background: BG_GRADIENT,
          color: COLORS.offWhite,
          padding: '60px',
          fontFamily: 'system-ui',
        }}
      >
        {/* Top brand label */}
        <div
          style={{
            color: COLORS.gold,
            fontSize: 22,
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            marginBottom: 28,
            fontWeight: 600,
          }}
        >
          QURAN CODEX · {category}
        </div>

        {/* Arabic glyph — accent-themed */}
        <div
          dir="rtl"
          lang="ar"
          style={{
            fontSize: 130,
            fontWeight: 700,
            lineHeight: 1.15,
            color: accentColor,
            marginBottom: 24,
            textAlign: 'center',
            maxWidth: 1080,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {glyph}
        </div>

        {/* Decorative line */}
        <div
          style={{
            width: 220,
            height: 2,
            background: `linear-gradient(to right, transparent, ${accentColor}, transparent)`,
            marginBottom: 28,
          }}
        />

        {/* Latin title */}
        <div
          style={{
            fontSize: 84,
            fontWeight: 800,
            color: COLORS.offWhite,
            marginBottom: 20,
            textAlign: 'center',
            letterSpacing: '-0.01em',
            maxWidth: 1080,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {title}
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 28,
            color: COLORS.silver,
            textAlign: 'center',
            fontWeight: 400,
            maxWidth: 1000,
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
            color: COLORS.gold,
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
            color: COLORS.silver,
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
      width: 1200,
      height: 630,
      headers: CACHE_HEADERS,
    },
  );
}
