'use client';

// ─── HomeLinkPill — "← Anasayfa" çıkışı ─────────────────────────────────────
//
// Tool sayfalarında bu buton `ToolHeader` içinde zaten vardı (§13.17). Ama
// `/hakkinda` ve `/kaynakca` ToolHeader kullanmadığı için o sayfalarda yoktu.
//
// 2026-08-13 — kullanıcı iki kez sordu, ilk cevabım yanlıştı. "Navbar logosu
// zaten anasayfaya gidiyor, ikinci bir çıkış gereksiz" demiştim. İki itiraz
// haklı çıktı:
//   1. TUTARLILIK — site bu soruyu zaten cevaplamış; tool sayfalarının hepsinde
//      sağ üstte "← ANASAYFA" var. Tutarsız olan buton değil, o iki sayfaydı.
//   2. KEŞFEDİLEBİLİRLİK — kullanıcı logonun anasayfaya gittiğini bilemez.
//      Etiketli buton tahmini ortadan kaldırır.
//
// Görsel olarak ToolHeader'daki pill ile birebir aynı: altın ince kenarlık,
// versal, 0.68rem, mobilde yalnız ok.
// ────────────────────────────────────────────────────────────────────────────

import Link from 'next/link';
import { COLORS, FONTS } from '../tokens';

export default function HomeLinkPill({ language = 'tr' }) {
  const en = language === 'en';
  return (
    <Link
      href={`/${language}`}
      aria-label={en ? 'Back to home' : 'Anasayfaya dön'}
      title={en ? 'Back to home' : 'Anasayfaya dön'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '4px 10px',
        borderRadius: '999px',
        border: `1px solid ${COLORS.gold}33`,
        color: `${COLORS.gold}bb`,
        fontFamily: FONTS.body,
        fontSize: '0.68rem',
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        textDecoration: 'none',
        flexShrink: 0,
        transition: 'all 0.15s',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = `${COLORS.gold}12`;
        e.currentTarget.style.borderColor = `${COLORS.gold}66`;
        e.currentTarget.style.color = COLORS.gold;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.borderColor = `${COLORS.gold}33`;
        e.currentTarget.style.color = `${COLORS.gold}bb`;
      }}
    >
      <span style={{ fontSize: '0.85rem', lineHeight: 1 }}>←</span>
      <span className="hidden sm:inline">{en ? 'Home' : 'Anasayfa'}</span>
    </Link>
  );
}
