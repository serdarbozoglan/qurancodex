'use client';

// ─── FatihaRingDiagram — ProofSection'ın İNTERAKTİF şeması (v2.0) ─────────────
// Önceden ProofSection sunucu bileşeni bu çatıyı STATİK render ediyordu. Şema
// yalnız GÖSTERİYOR ama okuyucuyu eşleşmeye DOKUNDURMUYORDU. Bu client alt-
// bileşen tam olarak onu ekler: bir düğümün üstüne gel → aynadaki eşi ve
// aralarındaki bağ yayı yanar, altında o âyetin Arapça metni + teması belirir.
//
// Metin/SEO ProofSection'da (sunucu) kalır; yalnız bu diyagram client (§16.1).
// Geometri ProofSection ile aynı (çatı/chevron) — tek kaynak drift'i olmasın
// diye buraya bilinçli kopyalandı, ikisi de fatihaRing.js verisini kullanır.
// Reduced-motion (§9): geçişler kapanır, hover yine çalışır (renk anında değişir).

import { useState } from 'react';
import { FATIHA_RING } from '../data/fatihaRing';
import { COLORS, FONTS, SEMANTIC } from '../tokens';

const W = 720, H = 300, PAD_X = 60, TOP = 60, BOTTOM = 210;
const STEP = (W - PAD_X * 2) / 6;
function xy(i) {
  const depth = i <= 3 ? i : 6 - i;
  return { x: PAD_X + i * STEP, y: TOP + (depth / 3) * (BOTTOM - TOP) };
}
const PAIRS = [[0, 6], [1, 5], [2, 4]];
// düğüm i → eşinin indeksi (merkez 3 = eşsiz)
const MIRROR = { 0: 6, 6: 0, 1: 5, 5: 1, 2: 4, 4: 2 };

export default function FatihaRingDiagram({ locale = 'tr' }) {
  const tr = locale === 'tr';
  const pts = FATIHA_RING.map((_, i) => xy(i));
  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const [active, setActive] = useState(null); // hovered/focused node index

  const isLit = (i) => active !== null && (i === active || i === MIRROR[active]);
  const pairLit = (a, b) => active !== null && (active === a || active === b || MIRROR[active] === a);

  const cur = active !== null ? FATIHA_RING[active] : null;
  const mir = active !== null && MIRROR[active] !== undefined ? FATIHA_RING[MIRROR[active]] : null;

  return (
    <div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        className="proof-chevron-svg"
        style={{ display: 'block', margin: '0 auto' }}
        role="img"
        aria-labelledby="proof-svg-title proof-svg-desc"
      >
        <title id="proof-svg-title">
          {tr ? 'Fâtiha sûresinin halka kompozisyon şeması' : 'Ring composition diagram of al-Fātiḥa'}
        </title>
        <desc id="proof-svg-desc">
          {tr
            ? 'Yedi konum simetrik bir çatı üzerinde diziliyor (Besmele hariç). 1:2 ile 1:7\'nin son cümleciği, 1:3 ile 1:7\'nin ilk cümleciği, 1:4 ile 1:6 eşleşiyor. Ortada 1:5 eşsiz duruyor. Bir düğüme dokununca aynadaki eşi vurgulanır.'
            : 'Seven positions on a symmetric chevron (basmala excluded). 1:2 pairs with the final clause of 1:7, 1:3 with the first clause of 1:7, and 1:4 with 1:6. At the centre, 1:5 stands alone. Hover a node to highlight its mirror.'}
        </desc>

        {/* eşleşme bağları */}
        {PAIRS.map(([a, b], i) => {
          const pa = pts[a], pb = pts[b];
          const lift = 26 + i * 14;
          const lit = pairLit(a, b);
          return (
            <path
              key={`pair-${a}`}
              d={`M ${pa.x} ${pa.y} Q ${(pa.x + pb.x) / 2} ${pa.y - lift} ${pb.x} ${pb.y}`}
              fill="none"
              stroke={COLORS.gold}
              strokeOpacity={lit ? 0.95 : 0.28}
              strokeWidth={lit ? 2.2 : 1}
              strokeDasharray={lit ? 'none' : '3 4'}
              style={{ transition: 'stroke-opacity .25s, stroke-width .25s' }}
            />
          );
        })}

        {/* çatı hattı */}
        <path d={path} fill="none" stroke={`${COLORS.gold}55`} strokeWidth="1.2" />

        {FATIHA_RING.map((r, i) => {
          const p = pts[i];
          const isPivot = r.pair === null;
          const lit = isLit(i);
          return (
            <g
              key={`${r.pos}-${r.ayah}`}
              tabIndex={0}
              role="button"
              aria-label={`${r.pos} — 1:${r.ayah} ${tr ? r.theme.tr : r.theme.en}`}
              style={{ cursor: 'pointer', outline: 'none' }}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onBlur={() => setActive(null)}
            >
              {/* görünmez geniş isabet alanı */}
              <circle cx={p.x} cy={p.y} r={22} fill="transparent" />
              <circle
                cx={p.x}
                cy={p.y}
                r={isPivot ? 9 : lit ? 8 : 6}
                fill={isPivot || lit ? COLORS.gold : SEMANTIC.surface}
                stroke={COLORS.gold}
                strokeWidth={isPivot ? 0 : lit ? 2 : 1.4}
                style={{ transition: 'r .2s, fill .2s, stroke-width .2s' }}
              />
              <text
                x={p.x} y={p.y - 18} textAnchor="middle"
                style={{ fill: isPivot || lit ? COLORS.gold : `${COLORS.offWhite}cc`, fontFamily: FONTS.body, fontSize: '13px', fontWeight: isPivot || lit ? 700 : 600 }}
              >
                {r.pos}
              </text>
              <text x={p.x} y={p.y + 26} textAnchor="middle" style={{ fill: `${COLORS.silver}d9`, fontFamily: FONTS.body, fontSize: '11px' }}>
                1:{r.ayah}
              </text>
              <text x={p.x} y={p.y + 42} textAnchor="middle" style={{ fill: `${COLORS.silver}d9`, fontFamily: FONTS.body, fontSize: '10px' }}>
                {tr ? r.theme.tr : r.theme.en}
              </text>
            </g>
          );
        })}
      </svg>

      {/* hover okuması — âyet metni + eşleşme (min yükseklik: layout kaymasın) */}
      <div
        aria-live="polite"
        style={{
          minHeight: '96px',
          marginTop: '18px',
          textAlign: 'center',
          padding: '16px 20px',
          borderRadius: '14px',
          border: `1px solid ${COLORS.gold}1f`,
          background: `${COLORS.deepNavy}55`,
          transition: 'opacity .25s',
          opacity: cur ? 1 : 0.7,
        }}
      >
        {cur ? (
          <>
            <div style={{ fontFamily: FONTS.body, fontSize: '0.66rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: COLORS.gold, fontWeight: 600 }}>
              {cur.pair === null
                ? (tr ? `Eksen · 1:${cur.ayah}` : `Pivot · 1:${cur.ayah}`)
                : `${cur.pos} ↔ ${mir.pos} · 1:${cur.ayah} ↔ 1:${mir.ayah}`}
            </div>
            <div lang="ar" dir="rtl" style={{ fontFamily: FONTS.quran, fontSize: '1.35rem', color: COLORS.gold, lineHeight: 2, marginTop: '8px' }}>
              {cur.ar}
            </div>
            <div style={{ fontFamily: FONTS.body, fontSize: '0.85rem', color: SEMANTIC.textMuted, marginTop: '4px' }}>
              {tr ? cur.theme.tr : cur.theme.en}
            </div>
          </>
        ) : (
          <div style={{ fontFamily: FONTS.body, fontSize: '0.85rem', color: SEMANTIC.textMuted }}>
            {tr ? 'Bir düğüme dokunun — aynadaki eşi ve âyet metni belirir.' : 'Hover a node — its mirror and the verse text appear.'}
          </div>
        )}
      </div>
    </div>
  );
}
