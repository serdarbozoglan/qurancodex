'use client';

import { COLORS, FONTS, RADIUS } from '../../tokens';

// SeriesTimeline — series'teki current position'ı dot-based timeline ile gösterir.
// Tuğyan için: Semantik 1-2-3-4'lük dot çizgisi, current (4) gold glow.
export default function SeriesTimeline({ seriesLabel, currentNumber, total, language }) {
  const tr = language === 'tr';
  if (!total || total < 2) return null;
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: '10px',
      padding: '16px 18px',
      background: 'rgba(139,92,246,0.06)',
      border: '1px solid rgba(139,92,246,0.22)',
      borderRadius: RADIUS.md,
      marginBottom: '24px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
        <span style={{
          fontSize: '0.66rem', fontWeight: 700, letterSpacing: '0.18em',
          color: COLORS.purple, textTransform: 'uppercase', fontFamily: FONTS.body,
        }}>
          {seriesLabel}
        </span>
        <span style={{
          fontSize: '0.78rem', fontWeight: 600,
          color: COLORS.silver, fontFamily: FONTS.body,
        }}>
          {currentNumber} / {total}
        </span>
      </div>
      {/* Dot timeline */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', position: 'relative' }}>
        {Array.from({ length: total }).map((_, i) => {
          const num = i + 1;
          const isCurrent = num === currentNumber;
          const isPast = num < currentNumber;
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1 }}>
              <div style={{
                width: isCurrent ? '14px' : '10px',
                height: isCurrent ? '14px' : '10px',
                borderRadius: '50%',
                background: isCurrent || isPast ? COLORS.purple : 'rgba(255,255,255,0.10)',
                border: isCurrent ? `2px solid ${COLORS.gold}` : '1px solid rgba(255,255,255,0.18)',
                boxShadow: isCurrent ? `0 0 14px ${COLORS.gold}aa, 0 0 8px ${COLORS.purple}aa` : 'none',
                transition: 'all 0.2s',
                flexShrink: 0,
              }} />
              {i < total - 1 && (
                <div style={{
                  flex: 1, height: '2px',
                  background: isPast ? COLORS.purple : 'rgba(255,255,255,0.08)',
                  borderRadius: '1px',
                  minWidth: '12px',
                }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
