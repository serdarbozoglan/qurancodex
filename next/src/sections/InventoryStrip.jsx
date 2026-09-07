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

import { COLORS, FONTS, SEMANTIC, GRADIENTS } from '../tokens';

const STATS = [
  { n: '65', labelTr: 'Araç', labelEn: 'Tools' },
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
          {/* v2.0 — düz hardal-altın yerine sıcak altın gradyan (§13.25 md.7:
              stat sayısı rolü korunur; erişilebilir taban accentStats, gradyan
              yalnız görsel zenginlik). background-clip desteklenmezse metin
              yine görünür — fallback rengi accentStats. */}
          <div
            style={{
              fontFamily: FONTS.display,
              fontSize: '1.9rem',
              fontWeight: 800,
              letterSpacing: '-0.01em',
              fontVariantNumeric: 'tabular-nums',
              color: GRADIENTS.statNumberFallback,
              backgroundImage: GRADIENTS.statNumber,
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block',
            }}
          >
            {s.n}
          </div>
          <div
            style={{
              position: 'relative',
              fontFamily: FONTS.body,
              fontSize: '0.7rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: SEMANTIC.textMuted,
              marginTop: '14px',
            }}
          >
            {/* etiket üstü ince altın vurgu çizgisi */}
            <span
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: '-9px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '24px',
                height: '2px',
                borderRadius: '2px',
                background: `linear-gradient(90deg, transparent, ${COLORS.gold}66, transparent)`,
              }}
            />
            {tr ? s.labelTr : s.labelEn}
          </div>
        </div>
      ))}
    </div>
  );
}
