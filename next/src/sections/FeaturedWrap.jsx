// ─── FeaturedWrap — Featured kartı sarmalayan div + "ÖNE ÇIKAN" badge ─────────
// CSS pseudo-element badge dev server'da hot-reload edilmedi; inline component
// ile garantili render. Kart yapısını değiştirmez — sadece sarmalar.
//
// 2026-08-13 · P5 — SUNUCU BİLEŞENİ oldu. `useLanguage()` yerine `locale`
// prop'u alıyor (dil URL'den türüyor, değişince tam navigasyon var).
// globals.css'teki ikiz `::before` rozeti de bu turda kaldırıldı: aynı
// konuma iki rozet basılıyordu ve pseudo-element İngilizce sayfada bile
// Türkçe "ÖNE ÇIKAN" yazıyordu.
// ──────────────────────────────────────────────────────────────────────────────

import HeroGeometricBackground from '../components/HeroGeometricBackground';
import { SEMANTIC } from '../tokens';

export default function FeaturedWrap({ children, locale = 'tr' }) {
  const label = locale === 'tr' ? 'ÖNE ÇIKAN' : 'FEATURED';
  return (
    <div
      className="featured-card-wrap"
      style={{ position: 'relative', overflow: 'hidden', borderRadius: '18px' }}
    >
      {/* Auditor #2 (2026-07-21): HeroGeometric wrapper içinde geometric
          atmosfer — SunnetullahAtlasi + 7 diğer tool ile aynı DNA imzası.
          Featured card sarmalayan alanın atmosferini tutarlılaştırır. */}
      <HeroGeometricBackground patternOpacity={0.035} glowOpacity="0A" tileSize={64} />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '70px',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '5px 16px',
          background: 'linear-gradient(135deg, rgba(212,165,116,0.95), rgba(232,184,96,0.85))',
          color: SEMANTIC.surface,
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
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </div>
  );
}
