// ReadingMode'un dynamic-import yüklenme iskeleti (CLS düzeltmesi, 14 Ağustos).
// ReadingMode kendisi position:fixed/inset:0 tam-viewport bir overlay —
// bu iskelet AYNI konum/boyutu ve gündüz-modu varsayılan zeminini (#f4f0e0,
// dayMode useState'in kendi varsayılanıyla eşleşir) taklit eder, böylece
// "boş → tam ekran içerik" sıçraması yerine "iskelet → içerik" geçişi olur.
// Gece modu tercihi olan kullanıcılar için kısa bir renk uyumsuzluğu kabul
// edilebilir — bu sadece boyut/konum eşleşmesi için (§13.0 madde 6).
export default function ReadingModeSkeleton() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        background: '#f4f0e0',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}
    >
      {/* Baslik yuksekligi 2 Eylul 2026'da OLCULDU ve responsive yapildi.
          Onceden sabit 64px'ti: masaustunde dogru (gercek baslik 64px, CLS
          0.000) ama MOBILDE gercek baslik 130px — iskeletten gerceke gecerken
          altindaki her sey 66px asagi kayiyordu (olculdu: 0.072 CLS, /oku
          mobil-390'da kalan TEK kayma).
          Esik 640px = tokens.js'teki BREAKPOINT_MOBILE ile ayni; ReadingMode
          isMobile'i de o sabiti kullaniyor, yani iki taraf ayni yerde kirilir.
          Iskelet JS'ten once boyanmak zorunda oldugu icin JS degil CSS media
          query kullaniliyor. */}
      <style>{`
        .rm-skeleton-header { height: 64px; }
        @media (max-width: 639.98px) { .rm-skeleton-header { height: 130px; } }
      `}</style>
      <div
        className="rm-skeleton-header"
        style={{ flexShrink: 0, borderBottom: '1px solid rgba(154,111,16,0.12)' }}
      />
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: '20px',
      }}>
        <div style={{
          width: '48px', height: '48px', borderRadius: '999px',
          border: '3px solid rgba(154,111,16,0.15)',
          borderTopColor: 'rgba(154,111,16,0.55)',
          animation: 'rm-skeleton-spin 0.9s linear infinite',
        }} />
        <style>{`@keyframes rm-skeleton-spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}
