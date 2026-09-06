'use client';

// ─── CrossToolCTA — Reusable cross-tool deep-link strip ──────────────────────
// Renkler/İlk-Son pattern: sayfa altında "Daha Derine — İlgili Araçlar" eyebrow
// + 2-3 deep link kart grid. Her kart: gold title + → + gri açıklama.
// Hover: lift + brighten.
//
// 14 Ağustos — CLS düzeltmesi: grid-template-columns/padding/marginTop artık
// JS `isMobile` prop'undan DEĞİL, CSS media query'den geliyor (globals.css,
// `.cross-tool-cta__*` kuralları). Sebep: `isMobile` her çağıran sayfada
// §14.1'in zorunlu koştuğu `useState(false)+useEffect` kalıbıyla geliyor —
// yani hydration ANINDA hep `false`. Mobilde sayfa önce 3 sütunlu masaüstü
// ızgarasıyla render oluyor, hydration'dan hemen sonra `isMobile` true
// olunca 1 sütuna yeniden diziliyor. Bu tam olarak `/graf/karsilastir`
// (CLS 0.78), `/arac/neden-sonuc` (0.68) gibi sayfalardaki en büyük kayma
// kaynağıydı — 54 dosyada kullanılan paylaşılan bileşen olduğu için etkisi
// geniş. CSS media query tarayıcı tarafından JS beklenmeden çözülür, kayma
// olmaz. `isMobile` prop'u geriye dönük uyumluluk için imzada kalıyor ama
// artık kullanılmıyor — 54 çağıran yer dokunulmadan çalışmaya devam eder.

import { COLORS, FONTS, RADIUS, TRANSITION } from '../tokens';

export default function CrossToolCTA({ language, isMobile: _isMobile, links, labelTr, labelEn, accent }) {
  const tr = language === 'tr';
  const ACC = accent || COLORS.gold;
  const ACC_BG = `${ACC}10`;
  const ACC_BG_HOVER = `${ACC}1A`;
  const ACC_BORDER = `${ACC}40`;
  const ACC_BORDER_HOVER = `${ACC}80`;

  return (
    <div className="cross-tool-cta__wrap" style={{
      borderTop: `1px solid ${COLORS.goldAlpha15}`,
    }}>
      {/* Eyebrow — <h2>, <span> DEĞİL.
          2026-08-13: bu bölüm 54 dosyada kullanılıyor ve kartları <h4> basıyordu.
          Bölüm etiketi ise başlık değil <span>'di. Sonuç: sayfa h1/h2'sinden
          doğrudan h4'e atlıyordu — 29 rotada "başlık seviyesi atlaması" bulgusu
          bunun tek kaynağıydı. Etiket h2, kartlar h3 olunca zincir tamamlanıyor.
          Görsel çıktı AYNI: stiller birebir taşındı, margin sıfırlandı. */}
      <div style={{ textAlign: 'center', marginBottom: '22px' }}>
        <h2 style={{
          margin: 0,
          fontSize: '0.68rem',
          fontFamily: FONTS.body,
          fontWeight: 700,
          letterSpacing: '0.24em',
          textTransform: 'uppercase',
          color: ACC,
          opacity: 0.78,
        }}>
          {tr ? (labelTr || 'Daha Derine: İlgili Araçlar') : (labelEn || 'Go Deeper: Related Tools')}
        </h2>
      </div>

      {/* Grid */}
      <div className="cross-tool-cta__grid" style={{
        display: 'grid',
        gap: '12px',
        maxWidth: '960px',
        margin: '0 auto',
        '--cta-cols': Math.min(links.length, 3),
      }}>
        {links.map((link, i) => (
          <a
            key={i}
            href={link.href}
            className="cross-tool-cta__card"
            style={{
              display: 'block',
              background: `linear-gradient(180deg, ${ACC_BG} 0%, rgba(255,255,255,0.02) 100%)`,
              border: `1px solid ${ACC_BORDER}`,
              borderRadius: RADIUS.lg,
              textDecoration: 'none',
              transition: `all ${TRANSITION.base}`,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = `linear-gradient(180deg, ${ACC_BG_HOVER} 0%, rgba(255,255,255,0.04) 100%)`;
              e.currentTarget.style.borderColor = ACC_BORDER_HOVER;
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = `linear-gradient(180deg, ${ACC_BG} 0%, rgba(255,255,255,0.02) 100%)`;
              e.currentTarget.style.borderColor = ACC_BORDER;
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '8px',
              gap: '10px',
            }}>
              <h3 style={{
                fontFamily: FONTS.body,
                fontWeight: 700,
                fontSize: '0.95rem',
                color: ACC,
                margin: 0,
                lineHeight: 1.3,
              }}>
                {tr ? link.titleTr : link.titleEn}
              </h3>
              <span style={{ color: ACC, opacity: 0.65, fontSize: '1.05rem', flexShrink: 0 }}>→</span>
            </div>
            <p style={{
              fontFamily: FONTS.body,
              fontSize: '0.85rem',
              color: COLORS.silver,
              lineHeight: 1.6,
              margin: 0,
              opacity: 0.85,
            }}>
              {tr ? link.descTr : link.descEn}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
