'use client';

// ─── global-error — kök hata sınırı (2026-09-15) ─────────────────────────────
//
// Projede hiç hata sınırı YOKTU. Pratikte en sık görülen hâli şuydu: yeni bir
// sürüm yayına girince parça (chunk) dosyalarının adları değişir; o an açık
// duran bir sekme artık var olmayan dosyaları ister, 404 alır ve sayfa hidrate
// olmaz. Kullanıcı görünüşte normal bir sayfaya bakar ama hiçbir düğme
// çalışmaz — ne bir uyarı görür, ne de kendiliğinden düzelir.
//
// Burada iki şey yapılır:
//   1. Hata parça yükleme hatasıysa sayfa BİR KEZ yenilenir. Yeni sürümü
//      çekmek sorunu kapatır. Tek seferlik oluşu önemli: sunucu gerçekten
//      bozuksa sonsuz yenileme döngüsüne girmemeli. İşaret sessionStorage'da
//      tutulur, yani sekmeye özeldir ve sekme kapanınca sıfırlanır.
//   2. Başka her hatada sade bir ekran gösterilir ve yeniden deneme sunulur.
//
// global-error kök layout'un YERİNE geçer, o yüzden kendi <html>/<body>'sini
// yazmak zorundadır (Next.js kuralı). Provider'lar bu noktada yüklü olmayabilir
// — dil bağlamı okunmaz, metin belge diline bakılarak seçilir.

import { useEffect, useState } from 'react';
// tokens.js duz bir modul; global-error kok layout'un yerine gecse de onu
// import edebilir (saglayici/baglam gerektirmez). Ham hex yazmak §13.25 ihlali.
import { COLORS, FONTS, SEMANTIC } from '@/tokens';

const RELOAD_FLAG = 'qc:chunk-reload';

const isChunkError = (err) => {
  const s = `${err?.name || ''} ${err?.message || ''}`;
  return /ChunkLoadError|Loading chunk|Failed to fetch dynamically imported module|Importing a module script failed/i.test(s);
};

export default function GlobalError({ error, reset }) {
  const [reloading, setReloading] = useState(false);

  useEffect(() => {
    if (!isChunkError(error)) return;
    let already = false;
    try { already = sessionStorage.getItem(RELOAD_FLAG) === '1'; } catch { /* özel sekme */ }
    if (already) return;
    try { sessionStorage.setItem(RELOAD_FLAG, '1'); } catch { /* yoksay */ }
    setReloading(true);
    window.location.reload();
  }, [error]);

  // Sayfa başarıyla açıldıysa işareti temizle ki bir sonraki sürümde yenileme
  // hakkı yeniden doğsun.
  useEffect(() => {
    if (isChunkError(error)) return;
    try { sessionStorage.removeItem(RELOAD_FLAG); } catch { /* yoksay */ }
  }, [error]);

  const tr = typeof document === 'undefined' || !/^en/.test(document.documentElement.lang || 'tr');

  return (
    <html lang={tr ? 'tr' : 'en'}>
      <body style={{ margin: 0, background: COLORS.cosmicBlack, color: COLORS.offWhite, fontFamily: FONTS.body }}>
        <main style={{
          minHeight: '100svh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: '18px', padding: '24px', textAlign: 'center',
        }}>
          <div aria-hidden="true" style={{ fontSize: '1.6rem', color: COLORS.gold, fontFamily: FONTS.bismillah }}>﷽</div>
          <h1 style={{ fontFamily: FONTS.display, fontWeight: 700, fontSize: 'clamp(1.4rem, 4vw, 1.9rem)', margin: 0 }}>
            {reloading
              ? (tr ? 'Sayfa yenileniyor' : 'Reloading')
              : (tr ? 'Bu sayfa açılamadı' : 'This page did not load')}
          </h1>
          <p style={{ color: SEMANTIC.textMuted, fontSize: '0.95rem', lineHeight: 1.7, maxWidth: '48ch', margin: 0 }}>
            {reloading
              ? (tr ? 'Yeni bir sürüm yayına girmiş. Güncel hâli getiriyoruz.'
                    : 'A new version went live. Fetching the current one.')
              : (tr ? 'Beklenmedik bir durum oldu. Yeniden denemek çoğu zaman yeterli oluyor.'
                    : 'Something unexpected happened. Trying again usually works.')}
          </p>
          {!reloading && (
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => reset()}
                style={{
                  padding: '10px 20px', borderRadius: '999px', cursor: 'pointer',
                  background: COLORS.goldAlpha15, border: `1px solid ${COLORS.goldAlpha45}`,
                  color: COLORS.gold, font: 'inherit', fontWeight: 600, letterSpacing: '0.06em',
                }}
              >
                {tr ? 'Yeniden dene' : 'Try again'}
              </button>
              <a
                href="/"
                style={{
                  padding: '10px 20px', borderRadius: '999px', textDecoration: 'none',
                  background: 'transparent', border: `1px solid ${COLORS.glassBorderSoft}`,
                  color: SEMANTIC.textMuted, font: 'inherit', fontWeight: 600, letterSpacing: '0.06em',
                }}
              >
                {tr ? 'Anasayfa' : 'Home'}
              </a>
            </div>
          )}
        </main>
      </body>
    </html>
  );
}
