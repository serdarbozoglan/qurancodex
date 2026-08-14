// ─── InventoryStrip — Hero altındaki envanter şeridi ────────────────────────
//
// 2026-08-14 · B5 (görsel tasarım mockup turu, onaylandı).
// Hero'nun altında ~200px amaçsız boşluk vardı (B0d ölçümü — çakışma yok ama
// amaç da yok). Aynı zamanda D1: ziyaretçi kaydırmadan sitede ne olduğunu
// öğrenemiyordu. Tek şerit ikisini birden çözer.
//
// Sayılar UYDURULMADI, ölçüldü (2026-08-14):
//   - araç:    src/data/toolCatalog.js → TOOL_CATALOG.length (62)
//   - tefekkür: public/tefekkur/_index.json → articles.length (53)
//   - âyet:     public/verse-graph-bgem3.json → length (6236)
// Bu dosya değiştiğinde sayılar burada da elle güncellenmeli — kaynak
// otomatik okunmuyor (Hero sunucu bileşeni, derleme zamanında sabitleniyor).
// ────────────────────────────────────────────────────────────────────────────

import { COLORS, FONTS, SEMANTIC } from '../tokens';

const STATS = [
  { n: '62', labelTr: 'Araç', labelEn: 'Tools' },
  { n: '53', labelTr: 'Tefekkür Yazısı', labelEn: 'Reflection Essays' },
  { n: '6.236', labelTr: 'Âyet', labelEn: 'Verses' },
];

export default function InventoryStrip({ locale = 'tr' }) {
  const tr = locale === 'tr';
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        borderTop: `1px solid ${COLORS.gold}26`,
        borderBottom: `1px solid ${COLORS.gold}26`,
        padding: '22px 20px',
        margin: '24px auto 0',
        maxWidth: '640px',
      }}
    >
      {STATS.map((s, i) => (
        <div
          key={s.labelEn}
          style={{
            padding: '0 clamp(20px, 5vw, 34px)',
            textAlign: 'center',
            position: 'relative',
            borderLeft: i > 0 ? `1px solid ${SEMANTIC.textFaint}33` : 'none',
          }}
        >
          <div
            style={{
              fontFamily: FONTS.display,
              fontSize: '1.7rem',
              fontWeight: 700,
              color: COLORS.goldBright,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {s.n}
          </div>
          <div
            style={{
              fontFamily: FONTS.body,
              fontSize: '0.7rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: SEMANTIC.textFaint,
              marginTop: '4px',
            }}
          >
            {tr ? s.labelTr : s.labelEn}
          </div>
        </div>
      ))}
    </div>
  );
}
