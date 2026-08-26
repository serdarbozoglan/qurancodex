'use client';

// ─── Mushaf Görünümü (ReadingMode içine gömülü, PROTOTİP, 2026-08-20) ───────
// ReadingMode.jsx'in 4. görünüm seçeneği ("Kitap / Ayet / Kırık Meal / Mushaf").
// Gerçek Hüsrev hattı mushaf sayfa görselini (kuran.hayrat.com.tr) gösterir —
// site fontunun aksine ekran genişliğine göre satır kırmaz, fiziksel basılı
// mushafla birebir satır/sayfa yapısını korur.
//
// "Hıfz" ADI KASITLI OLARAK KULLANILMADI: sitede zaten useHifzSession/
// HifzPanel/HifzIcon ile çalışan, ayrı ve tamamen farklı bir ezber-tekrar
// (kartopu yöntemi) özelliği var — aynı isim iki farklı özelliği çakıştırır
// (kullanıcı 2026-08-20 karar: "Mushaf" ismi).
//
// Telif izni Hayrat Neşriyat'tan HENÜZ alınmadı. 2026-08-25'te kullanıcı
// bilinçli olarak canlıya almayı onayladı ve görseller kendi sunucumuzda
// barındırılmaya (public/mushaf-hayrat/{sayfa}.webp, aşağıda) taşındı —
// bu, telif riskini ORTADAN KALDIRMAZ, yalnızca Hayrat'ın sunucusuna canlı
// bağımlılığı keser. İzin süreci ayrıca ele alınmalı.
//
// Sûre/cüz başlangıç sayfaları Hayrat'ın quran-reader-data.js'inden türetildi
// ve site kanonik 114 sûre listesine karşı programatik doğrulandı
// (scripts/build-hifz-page-index.mjs, 114/114 eşleşti) — TÜM 609 sayfa için
// sûre/cüz navigasyonu çalışır. Sayfa-içi ayet listesi ise yalnız
// `verifiedPageVerses`'te elle görsel doğrulaması yapılmış sayfalarda
// mevcuttur (şimdilik 4 sayfa: Fâtiha, Bakara 1-24) — kapsam genişledikçe
// bu obje büyütülür.

import { useRef, useEffect } from 'react';
import { useAudioWithFallback } from '../hooks/useAudioWithFallback';
import { SURAH_NAMES_TR, SURAH_NAMES_EN } from '../lib/surahNames';
import { COLORS, FONTS, SEMANTIC, RADIUS, TRANSITION } from '../tokens';
import pageIndex from '../../public/hifz-page-index.json';

const PlayIcon = () => (
  <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="6,3 20,12 6,21" />
  </svg>
);
const PauseIcon = () => (
  <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <rect x="6" y="4" width="4" height="16" rx="1" />
    <rect x="14" y="4" width="4" height="16" rx="1" />
  </svg>
);
const ChevronIcon = ({ dir }) => (
  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={dir === 'left' ? 'M15 18l-6-6 6-6' : 'M9 18l6-6-6-6'} />
  </svg>
);

function VerseRow({ surah, ayah, language, theme, translation }) {
  const { playing, loading, failed, toggle } = useAudioWithFallback(surah, ayah);
  const names = language === 'en' ? SURAH_NAMES_EN : SURAH_NAMES_TR;
  const label = `${names[surah - 1]} ${surah}:${ayah}`;

  return (
    <div
      style={{
        borderRadius: RADIUS.md,
        border: `1px solid ${playing ? COLORS.goldAlpha45 : theme.border}`,
        background: playing ? COLORS.goldAlpha15 : theme.rowBg,
        overflow: 'hidden',
      }}
    >
      <button
        onClick={toggle}
        disabled={failed}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          width: '100%',
          padding: '10px 14px',
          border: 'none',
          background: 'transparent',
          color: failed ? theme.faint : theme.text,
          cursor: failed ? 'default' : 'pointer',
          transition: TRANSITION.fast || 'all 0.15s',
          fontFamily: FONTS.body,
          fontSize: '0.86rem',
          textAlign: 'left',
        }}
      >
        <span
          aria-hidden="true"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '26px',
            height: '26px',
            borderRadius: '50%',
            background: playing ? COLORS.gold : theme.iconBg,
            color: playing ? COLORS.cosmicBlack : theme.muted,
            flexShrink: 0,
          }}
        >
          {loading ? '…' : playing ? <PauseIcon /> : <PlayIcon />}
        </span>
        <span>{label}</span>
        {failed && (
          <span style={{ marginLeft: 'auto', fontSize: '0.72rem', color: theme.faint }}>
            {language === 'en' ? 'unavailable' : 'sesli okuma yok'}
          </span>
        )}
      </button>
      {translation && (
        <p style={{ margin: 0, padding: '0 14px 12px 50px', fontFamily: FONTS.body, fontStyle: 'italic', fontSize: '0.82rem', lineHeight: 1.6, color: theme.muted }}>
          {translation}
        </p>
      )}
    </div>
  );
}

export default function MushafInlineView({ language, selectedSurah, isMobile, dayMode, surahVerses, showTranslation, getTranslation, spreadMode = false, pageBg, currentPage, onNavigate }) {
  // Sayfa numarası artık KENDİ state'i DEĞİL — ReadingMode'un tek gerçek
  // kaynağı olan `currentPage`'den geliyor (bkz. navigateToPage). Hayrat'ın
  // kendi URL numaralaması site'nin `page` alanıyla BİREBİR aynı (2026-08-25
  // doğrulandı: Sayfalar/0.jpg=Fâtiha, Sayfalar/604.jpg=son sayfa), offset
  // yok. Önceki tasarım (kendi local state'i + selectedSurah'ı izleyen ayrı
  // bir efekt) üst araç çubuğundaki SAYFA ileri/geri kontrolüyle senkron
  // DEĞİLDİ — kullanıcı üstten "3"e geçince başlık "3" yazıyordu ama görsel
  // hâlâ eski sayfadaydı (kullanıcı raporu 2026-08-25: "sayfa 3 nerede").
  const hayratPage = currentPage;
  const theme = dayMode
    ? { text: '#3a3226', muted: '#7a6f5c', faint: '#9a8f7c', border: 'rgba(120,90,40,0.18)', rowBg: 'rgba(120,90,40,0.04)', iconBg: 'rgba(120,90,40,0.08)', selectBg: 'rgba(120,90,40,0.05)' }
    : { text: SEMANTIC.textPrimary, muted: SEMANTIC.textMuted, faint: SEMANTIC.textFaint, border: SEMANTIC.textFaint + '22', rowBg: 'rgba(255,255,255,0.03)', iconBg: 'rgba(255,255,255,0.08)', selectBg: 'rgba(255,255,255,0.03)' };

  // ReadingMode'un klasik Kitap modu çerçevesiyle (data-ar-col'daki
  // frameDouble formülü) BİREBİR aynı çift-çizgili altın çerçeve — görsel
  // kendi baskı süslemesini zaten taşıyor, bu ikinci katman siteyle görsel
  // tutarlılık sağlıyor (kullanıcı talebi 2026-08-25: "bizim normal kitap
  // modumuzdaki belirlenen çerçevenin içine yerleştireceksin").
  const frameOuter = dayMode ? 'rgba(154,111,16,0.65)' : 'rgba(232,181,71,0.55)';
  const frameInner = dayMode ? 'rgba(110,72,10,0.35)' : 'rgba(244,206,131,0.22)';
  const frameDouble = `inset 0 0 0 1px ${frameOuter}, inset 0 0 0 3px ${pageBg || theme.rowBg}, inset 0 0 0 4px ${frameInner}`;

  const verses = pageIndex.verifiedPageVerses[String(hayratPage)] || null;
  // Kitap modunda meal açıkken Arapça sağda / meal solda durur (RTL kitap
  // kuralı). Mobilde yer olmadığından tek sütuna (görsel üstte) düşer.
  const sideBySide = !isMobile && showTranslation;
  // Meal kapalıyken VE masaüstünde geniş ekran → iki Arapça sayfa yan yana
  // (kullanıcı talebi 2026-08-25: "iki sayfayı Arapça görmek isterse de,
  // yan yana iki sayfa Arapça gösterecek"). spreadMode zaten ReadingMode'da
  // aynı koşulla (bookMode && !showTranslation && !isMobile && isWide)
  // hesaplanıyor — burada tekrar üretmek yerine prop olarak alınıyor.
  const showSpread = spreadMode && !sideBySide;

  // Dış overlay artık scroll'u kendi taşımıyor (overflow:hidden) — bu kök
  // scroll'u BURADA yönetiyoruz, çünkü sayfa değişince eski scrollTop
  // kalıyordu ve yeni sayfanın üst kısmı (sûre başlık cartouche'u) görünmez
  // kalıyordu (kullanıcı ekran görüntüsüyle bildirdi, 2026-08-20).
  const scrollRef = useRef(null);
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [hayratPage]);

  // ReadingMode'un KENDİ sûre/cüz seçicisi zaten üstte var — burada ikinci
  // bir tane daha koymak dupliker/kafa karıştırıcıydı (kullanıcı ekran
  // görüntüsüyle bildirdi, 2026-08-20: "bunları neden tekrar create
  // ettin"). Sûre değişince `currentPage` zaten ReadingMode tarafında
  // otomatik güncelleniyor (changeSurah → setBookPage(null) → currentPage
  // = surahStartPage) — burada ayrıca senkronize etmeye gerek yok.
  const goPrev = () => onNavigate(Math.max(0, hayratPage - 1));
  const goNext = () => onNavigate(Math.min(604, hayratPage + 1));

  const overlayBtnStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    border: 'none',
    background: 'rgba(10,10,10,0.45)',
    color: '#fff',
    cursor: 'pointer',
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 2,
  };

  return (
    <div
      ref={scrollRef}
      style={{ height: '100%', overflowY: 'auto', overflowX: 'hidden' }}
    >
    <div style={{ maxWidth: showSpread ? '1400px' : sideBySide ? '1080px' : '760px', margin: '0 auto', width: '100%', padding: isMobile ? '16px 12px 60px' : '20px 16px 60px' }}>
      {/* ReadingMode'un kendi SÛRE/CÜZ/SAYFA seçici bar'ı zaten üstte var —
          burada ikinci bir tane daha koymak kafa karıştırıcıydı (kullanıcı
          ekran görüntüsüyle bildirdi, 2026-08-20: "bu menüler neden var
          yukarıda var ya zaten"). Sayfalama artık görselin üstüne bindirilmiş
          küçük ok butonlarıyla, ayrı bir bar olmadan yapılıyor. */}
      {(() => {
        const attribution = (
          <p style={{ fontSize: '0.7rem', color: theme.faint, fontFamily: FONTS.body, margin: 0, textAlign: 'center' }}>
            {language === 'en'
              ? 'Page image sourced from kuran.hayrat.com.tr (Ahmed Hüsrev calligraphy). Prototype — not final.'
              : 'Sayfa görseli kuran.hayrat.com.tr kaynağından alınmıştır (Ahmed Hüsrev hattı). Prototip — henüz kesinleşmedi.'}
          </p>
        );

        const singlePage = (pageNum, { withNav } = {}) => (
          <div style={{ position: 'relative', overflow: 'hidden', marginBottom: '8px', borderRadius: '6px', background: pageBg || theme.rowBg, boxShadow: frameDouble, padding: '14px' }}>
            {withNav && pageNum > 0 && (
              <button onClick={goPrev} aria-label={language === 'en' ? 'Previous page' : 'Önceki sayfa'} style={{ ...overlayBtnStyle, left: '20px' }}>
                <ChevronIcon dir="left" />
              </button>
            )}
            {withNav && pageNum < 604 && (
              <button onClick={goNext} aria-label={language === 'en' ? 'Next page' : 'Sonraki sayfa'} style={{ ...overlayBtnStyle, right: '20px' }}>
                <ChevronIcon dir="right" />
              </button>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element -- yerel statik asset (public/mushaf-hayrat/), next/image'a taşınabilir ama boyutlar sayfa sayfa değişken */}
            <img
              src={`/mushaf-hayrat/${pageNum}.webp`}
              alt={language === 'en' ? `Mushaf page ${pageNum}` : `Mushaf sayfa ${pageNum}`}
              style={{ width: '100%', display: 'block', borderRadius: '2px' }}
            />
          </div>
        );

        const imageBlock = (
          <div style={{ flex: sideBySide ? '1 1 55%' : undefined }}>
            {singlePage(hayratPage, { withNav: true })}
            {attribution}
          </div>
        );

        // İki sayfa Arapça yan yana — sağda mevcut sayfa, solda bir sonraki
        // (RTL kitap akışı: sayfa numarası sağdan sola artar, tıpkı basılı
        // mushafta olduğu gibi).
        const rightPage = hayratPage;
        const leftPage = Math.min(hayratPage + 1, 604);
        const spreadBlock = (
          <div style={{ width: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', alignItems: 'stretch' }}>
              <div style={{ flex: '1 1 50%', position: 'relative' }}>
                {singlePage(leftPage)}
                {leftPage > 0 && (
                  <button onClick={goPrev} aria-label={language === 'en' ? 'Previous spread' : 'Önceki yayılım'} style={{ ...overlayBtnStyle, left: '20px' }}>
                    <ChevronIcon dir="left" />
                  </button>
                )}
              </div>
              <div style={{ flex: '1 1 50%', position: 'relative' }}>
                {singlePage(rightPage)}
                {rightPage < 604 && (
                  <button onClick={goNext} aria-label={language === 'en' ? 'Next spread' : 'Sonraki yayılım'} style={{ ...overlayBtnStyle, right: '20px' }}>
                    <ChevronIcon dir="right" />
                  </button>
                )}
              </div>
            </div>
            {attribution}
          </div>
        );

        if (showSpread) return spreadBlock;

        const listBlock = verses ? (
          <div style={{ flex: sideBySide ? '1 1 45%' : undefined, maxWidth: sideBySide ? undefined : '520px', margin: sideBySide ? 0 : '0 auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {verses.map(([s, a]) => (
              <VerseRow
                key={`${s}:${a}`}
                surah={s}
                ayah={a}
                language={language}
                theme={theme}
                translation={
                  showTranslation && getTranslation && s === selectedSurah
                    ? getTranslation(surahVerses?.find(v => v.ayah === a) || { surah: s, ayah: a })
                    : null
                }
              />
            ))}
          </div>
        ) : (
          <div style={{ flex: sideBySide ? '1 1 45%' : undefined, maxWidth: sideBySide ? undefined : '520px', margin: sideBySide ? 0 : '0 auto', padding: '18px 16px', borderRadius: RADIUS.md, border: `1px dashed ${theme.border}`, color: theme.faint, fontFamily: FONTS.body, fontSize: '0.8rem', textAlign: 'center' }}>
            {language === 'en'
              ? 'The tap-to-play verse list is only ready for the prototype\'s first pages (Al-Fatiha, Al-Baqarah 1–24) — not yet on this page.'
              : 'Ayete dokunup dinleme listesi şimdilik yalnız prototipin ilk sayfaları için hazır (Fâtiha, Bakara 1–24) — bu sayfada henüz yok.'}
          </div>
        );

        // Mevcut Kitap modunda meal AÇIKKEN Arapça sağda, meal solda durur
        // (RTL kitap kuralı — sayfa "sağdan" ilerler). Mushaf modu bunu
        // yansıtmıyordu, tek sütun (görsel üstte, liste altta) idi —
        // kullanıcı ekran görüntüsüyle bildirdi: "neden meal solda değil,
        // Arapça sağda değil" (2026-08-20). showTranslation açıkken VE
        // masaüstünde yan yana: meal SOL, görsel SAĞ. Mobilde veya meal
        // kapalıyken tek sütun (görsel üstte) — geniş resim önceliği kalır.
        return sideBySide ? (
          <div style={{ display: 'flex', flexDirection: 'row', gap: '24px', alignItems: 'flex-start' }}>
            {listBlock}
            {imageBlock}
          </div>
        ) : (
          <>
            {imageBlock}
            <div style={{ height: '16px' }} />
            {listBlock}
          </>
        );
      })()}
    </div>
    </div>
  );
}
