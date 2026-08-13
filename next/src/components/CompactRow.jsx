// ─── CompactRow — hafif kademedeki kartların ızgarası (SUNUCU BİLEŞENİ) ─────
//
// 2026-08-13 · P4. `compact` kartlar tek başına tam genişlik kaplamaz;
// 2–3'lü ızgarada yan yana durur. Cluster'ın arka plan gradyanını ve
// radial altın parıltısını kartlar yerine SATIR taşır — yoksa yan yana
// duran her kart kendi gradyanını çizip dikey şeritler oluşturuyordu.
//
// Mobilde (<720px) tek sütuna iner; kart yüksekliği ~950px'ten ~430px'e
// düşer, sayfa hedefine (<20.000px) esas katkı buradan gelir.
// ────────────────────────────────────────────────────────────────────────────

import { COLORS, SEMANTIC } from '../tokens';

export default function CompactRow({ children, cols = 2 }) {
  return (
    <div
      className="portal-compact-row"
      style={{
        background: `linear-gradient(180deg, ${SEMANTIC.surface} 0%, ${SEMANTIC.surfaceRaised} 50%, ${SEMANTIC.surface} 100%)`,
        padding: '72px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: `radial-gradient(ellipse at center, ${COLORS.gold}10 0%, transparent 55%)`,
        }}
      />
      {/* cols: `auto-fit` KULLANILMIYOR — 4 kartta 1440px'de 3+1 asimetrisi
          üretiyordu (ölçüldü). Sütun sayısı çağıran tarafından verilir; CSS
          yalnız daralt­ma yapar (≤1023px → 2, ≤719px → 1). */}
      <div className="portal-compact-row__grid" style={{ '--portal-cols': cols }}>
        {children}
      </div>
    </div>
  );
}
