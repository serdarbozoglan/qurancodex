'use client';

// ─── CollapsibleHero — KATLANABİLİR TOOL GİRİŞİ (ChatGPT A1) ────────────────
// §13.18 sinematik hero'yu (bismillah + ayet + meal + whisper + başlık) bir
// araç sayfasının ÜSTÜNE iten sorun: asıl araç ekranın altında kalıyor.
// Bu sarmalayıcı hero'yu (children) katlanabilir yapar:
//   - İLK ZİYARET: açık (poetik giriş tam görünür — §13.18 korunur).
//   - Kullanıcı "Girişi gizle" derse: kapanır + localStorage'da HATIRLANIR,
//     böylece dönüş ziyaretlerinde araç doğrudan üstte açılır.
// İçerik birebir korunur (children); yalnızca sunum katmanı eklenir
// ([[feedback_enhance_dont_invent]]).
//
// Kullanım (araç sayfası hero kapsayıcısını sarar):
//   <CollapsibleHero id="ilk-son-kelimeler" language={language}
//     labelTr="İlk & Son Kelimeler" labelEn="First & Last Words">
//     {/* mevcut hero JSX */}
//   </CollapsibleHero>

import { useEffect, useState } from 'react';
import { COLORS, FONTS } from '../tokens';

export default function CollapsibleHero({ id, language, labelTr, labelEn, children }) {
  const storageKey = `qc_hero_collapsed_${id}`;
  // SSR ilk render'da her zaman açık (hidrasyon uyuşmazlığını önler); tercih
  // mount sonrası localStorage'dan okunur.
  const [collapsed, setCollapsed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(storageKey) === '1') setCollapsed(true);
    } catch { /* private mode vb. — açık kalır */ }
    setReady(true);
  }, [storageKey]);

  const setAndStore = (next) => {
    setCollapsed(next);
    try { localStorage.setItem(storageKey, next ? '1' : '0'); } catch { /* yut */ }
  };

  const tr = language !== 'en';
  const label = tr ? (labelTr || '') : (labelEn || '');

  // Kapalı görünüm — ince, tıklanınca genişleyen şerit.
  if (ready && collapsed) {
    return (
      <div style={{ maxWidth: '960px', margin: '0 auto 20px', padding: '0 8px' }}>
        <button
          type="button"
          onClick={() => setAndStore(false)}
          aria-expanded={false}
          aria-label={tr ? 'Girişi göster' : 'Show introduction'}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '10px', padding: '10px 16px',
            background: 'linear-gradient(180deg, rgba(212,165,116,0.06), rgba(212,165,116,0.02))',
            border: `1px solid ${COLORS.gold}22`, borderRadius: '999px',
            color: `${COLORS.gold}cc`, cursor: 'pointer', fontFamily: FONTS.body,
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = `${COLORS.gold}55`; e.currentTarget.style.color = COLORS.gold; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = `${COLORS.gold}22`; e.currentTarget.style.color = `${COLORS.gold}cc`; }}
        >
          <span aria-hidden="true" style={{ fontSize: '0.9rem', lineHeight: 1, color: `${COLORS.gold}88` }}>✦</span>
          {label && (
            <span style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              {label}
            </span>
          )}
          <span style={{ fontSize: '0.72rem', opacity: 0.85 }}>
            {tr ? 'Girişi göster' : 'Show intro'}
          </span>
          <span aria-hidden="true" style={{ fontSize: '0.8rem', lineHeight: 1 }}>▾</span>
        </button>
      </div>
    );
  }

  // Açık görünüm — hero'nun tamamı + altında ince "Girişi gizle" düğmesi.
  return (
    <div style={{ position: 'relative' }}>
      {children}
      <div style={{ display: 'flex', justifyContent: 'center', margin: '-8px 0 28px' }}>
        <button
          type="button"
          onClick={() => setAndStore(true)}
          aria-expanded={true}
          aria-label={tr ? 'Girişi gizle' : 'Hide introduction'}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '5px 14px', background: 'transparent',
            border: `1px solid ${COLORS.gold}1e`, borderRadius: '999px',
            color: `${COLORS.gold}99`, cursor: 'pointer', fontFamily: FONTS.body,
            fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.1em',
            textTransform: 'uppercase', transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = `${COLORS.gold}44`; e.currentTarget.style.color = `${COLORS.gold}dd`; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = `${COLORS.gold}1e`; e.currentTarget.style.color = `${COLORS.gold}99`; }}
        >
          <span aria-hidden="true" style={{ fontSize: '0.8rem', lineHeight: 1 }}>▴</span>
          {tr ? 'Girişi gizle' : 'Hide intro'}
        </button>
      </div>
    </div>
  );
}
