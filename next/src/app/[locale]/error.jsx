'use client';

// ─── [locale]/error — rota düzeyi hata sınırı (2026-09-15) ───────────────────
//
// `global-error` yalnızca kök layout'un kendisi patlarsa devreye girer. Bir
// sayfanın içinde oluşan hatayı yakalayan sınır budur; navbar ve footer yerinde
// kalır, yalnız içerik alanı değişir.
//
// Parça (chunk) yükleme hatasında aynı tek-seferlik yenileme uygulanır:
// yeni sürüm yayına girdiğinde açık kalan sekmeler eski dosyaları ister ve
// 404 alır. Gerekçenin tamamı `app/global-error.jsx` başlığında.

import { useEffect, useState } from 'react';
import { COLORS, FONTS, SEMANTIC } from '@/tokens';

const RELOAD_FLAG = 'qc:chunk-reload';

const isChunkError = (err) => {
  const s = `${err?.name || ''} ${err?.message || ''}`;
  return /ChunkLoadError|Loading chunk|Failed to fetch dynamically imported module|Importing a module script failed/i.test(s);
};

export default function LocaleError({ error, reset }) {
  const [reloading, setReloading] = useState(false);

  useEffect(() => {
    if (!isChunkError(error)) {
      try { sessionStorage.removeItem(RELOAD_FLAG); } catch { /* yoksay */ }
      return;
    }
    let already = false;
    try { already = sessionStorage.getItem(RELOAD_FLAG) === '1'; } catch { /* özel sekme */ }
    if (already) return;
    try { sessionStorage.setItem(RELOAD_FLAG, '1'); } catch { /* yoksay */ }
    setReloading(true);
    window.location.reload();
  }, [error]);

  const tr = typeof document === 'undefined' || !/^en/.test(document.documentElement.lang || 'tr');

  return (
    <main style={{
      minHeight: '60svh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: '16px',
      padding: '64px 24px', textAlign: 'center',
    }}>
      <h1 style={{
        fontFamily: FONTS.display, color: COLORS.offWhite, fontWeight: 700,
        fontSize: 'clamp(1.4rem, 4vw, 1.9rem)', margin: 0,
      }}>
        {reloading
          ? (tr ? 'Sayfa yenileniyor' : 'Reloading')
          : (tr ? 'Bu sayfa açılamadı' : 'This page did not load')}
      </h1>
      <p style={{
        color: SEMANTIC.textMuted, fontFamily: FONTS.body, fontSize: '0.95rem',
        lineHeight: 1.7, maxWidth: '48ch', margin: 0,
      }}>
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
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('qc:feedback-open'))}
            style={{
              padding: '10px 20px', borderRadius: '999px', cursor: 'pointer',
              background: 'transparent', border: `1px solid ${COLORS.glassBorderSoft}`,
              color: SEMANTIC.textMuted, font: 'inherit', fontWeight: 600, letterSpacing: '0.06em',
            }}
          >
            {tr ? 'Bize bildir' : 'Tell us'}
          </button>
        </div>
      )}
    </main>
  );
}
