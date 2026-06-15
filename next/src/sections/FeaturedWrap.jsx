'use client';

// ─── FeaturedWrap — Featured kartı sarmalayan div + "ÖNE ÇIKAN" badge ─────────
// CSS pseudo-element badge dev server'da hot-reload edilmedi; inline component
// ile garantili render. Kart yapısını değiştirmez — sadece sarmalar.
// ──────────────────────────────────────────────────────────────────────────────

export default function FeaturedWrap({ children, language = 'tr' }) {
  const label = language === 'tr' ? 'ÖNE ÇIKAN' : 'FEATURED';
  return (
    <div className="featured-card-wrap" style={{ position: 'relative' }}>
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '70px',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '5px 16px',
          background: 'linear-gradient(135deg, rgba(212,165,116,0.95), rgba(232,184,96,0.85))',
          color: '#0a0a1a',
          fontFamily: "'Inter', sans-serif",
          fontSize: '0.62rem',
          fontWeight: 800,
          letterSpacing: '0.26em',
          borderRadius: '999px',
          zIndex: 5,
          boxShadow: '0 6px 20px rgba(212,165,116,0.45), 0 0 0 1px rgba(212,165,116,0.35)',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </div>
      {children}
    </div>
  );
}
