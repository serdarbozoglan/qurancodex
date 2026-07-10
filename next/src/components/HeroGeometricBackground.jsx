'use client';

// ─── HeroGeometricBackground — reusable Islamic geometric hero backdrop ─────
//
// Extracted from SunnetullahAtlasi's inline `#sunnet-geometric` pattern
// (2026-07-10) so every cinematic Hero can pick up the same subtle
// eight-fold star + inner hex + center-glow visual language.
//
// Renders two absolute-positioned decorative layers behind the Hero content:
//   1. An SVG <pattern> tiled across the wrapper — hexagons + inner hex +
//      center dot, all in low-opacity gold. Pattern id is instance-unique
//      so multiple Heroes on one page never collide.
//   2. A radial gold-glow centered on the wrapper — adds atmospheric depth.
//
// **Usage:** wrap it inside a Hero container that has `position: relative`
// and `overflow: hidden`. Content siblings that should render OVER the
// pattern must also have `position: relative; zIndex: 1`.
//
// <div style={{ position: 'relative', overflow: 'hidden', padding: '56px 32px' }}>
//   <HeroGeometricBackground />
//   <div style={{ position: 'relative', zIndex: 1 }}>
//     {/* Bismillah, anchor verse, H1, subtitle */}
//   </div>
// </div>
//
// Props:
//   - id           (optional) — override the auto-generated pattern id.
//                                Useful if you need a stable snapshot key.
//   - patternOpacity (default 0.05) — decorative SVG layer opacity.
//   - glowOpacity  (default 0x0F ~= 0.06) — radial glow intensity.
//   - tileSize     (default 72) — pattern tile size in px.
//   - color        (default COLORS.gold) — stroke/fill for the pattern.

import { useId } from 'react';
import { COLORS } from '../tokens';

export default function HeroGeometricBackground({
  id,
  patternOpacity = 0.05,
  glowOpacity = '0F',
  tileSize = 72,
  color,
}) {
  const autoId = useId();
  const patternId = id || `qc-geo-${autoId.replace(/[:]/g, '')}`;
  const stroke = color || COLORS.gold;
  const half = tileSize / 2;
  const inner = tileSize / 4;

  return (
    <>
      <svg
        aria-hidden="true"
        width="100%"
        height="100%"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: patternOpacity,
          mixBlendMode: 'screen',
        }}
      >
        <defs>
          <pattern id={patternId} x="0" y="0" width={tileSize} height={tileSize} patternUnits="userSpaceOnUse">
            <path
              d={`M${half} ${half - 30 * (tileSize/72)} L${half + 25 * (tileSize/72)} ${half - 18 * (tileSize/72)} L${half + 25 * (tileSize/72)} ${half + 6 * (tileSize/72)} L${half} ${half + 18 * (tileSize/72)} L${half - 25 * (tileSize/72)} ${half + 6 * (tileSize/72)} L${half - 25 * (tileSize/72)} ${half - 18 * (tileSize/72)} Z`}
              stroke={stroke}
              strokeWidth="0.6"
              fill="none"
            />
            <path
              d={`M${half} ${half - inner} L${half + inner * 0.75} ${half - inner * 0.4} L${half + inner * 0.75} ${half + inner * 0.4} L${half} ${half + inner} L${half - inner * 0.75} ${half + inner * 0.4} L${half - inner * 0.75} ${half - inner * 0.4} Z`}
              stroke={stroke}
              strokeWidth="0.5"
              fill="none"
              opacity="0.6"
            />
            <circle cx={half} cy={half - inner * 0.15} r="2" fill={stroke} opacity="0.4" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          height: '90%',
          pointerEvents: 'none',
          background: `radial-gradient(ellipse at center, ${stroke}${glowOpacity} 0%, transparent 70%)`,
          filter: 'blur(4px)',
        }}
      />
    </>
  );
}
