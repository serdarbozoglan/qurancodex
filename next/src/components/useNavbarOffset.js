'use client';

// ─── useNavbarOffset — navbarın GERÇEK alt kenarı ───────────────────────────
//
// 2026-08-13. Bu hata sitede ÜÇ kez ayrı ayrı yaşandı ve üçünde de sebep
// aynıydı: navbarın yüksekliği sabit sayıyla tahmin edilmişti.
//
//   MobileSectionChipNav   NAVBAR_HEIGHT = 62 → gerçek 69/93 → 1024'te 31px
//                          örtüşme, chip'lerin üst yarısı tıklanamıyordu
//   /hakkinda, /kaynakca   padding 64 → navbar altı 82 → 18px örtüşme;
//                          104'e çıkarıldı ama 1024px'te İNGİLİZCE navbar
//                          (menü öğeleri uzun, iki satıra sarıyor) yine
//                          30px örtüyordu — TÜRKÇEDE görünmüyordu
//   /arac/tum-araclar      overlay üst dolgusu 96 → aynı hikâye
//
// Ders: navbar yüksekliği DİLE, GENİŞLİĞE ve SCROLL durumuna göre değişiyor.
// Tahmin edilemez, ölçülmeli. Bu kanca o ölçümü tek yere topluyor.
//
// Zamanlama tuzağı: navbar scroll'da kompaktlaşıyor ve bu bir CSS geçişi.
// Yalnız `scroll` olayında ölçmek geçiş BAŞLAMADAN eski değeri okuyor ve
// kalıcı boşluk bırakıyor (ölçüldü). Bu yüzden geçiş bittikten sonra da
// bir kez daha ölçülüyor.
// ────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from 'react';

const FALLBACK = 96;

export default function useNavbarOffset(extra = 24, min = FALLBACK) {
  const [offset, setOffset] = useState(min);

  useEffect(() => {
    let settle;
    const measure = () => {
      const nav = document.querySelector('nav[aria-label="Main navigation"]');
      const b = nav ? Math.round(nav.getBoundingClientRect().bottom) : 0;
      setOffset(Math.max(min, b + extra));
    };
    measure();
    const onScroll = () => {
      measure();
      clearTimeout(settle);
      settle = setTimeout(measure, 450);   // kompaktlaşma geçişi bitsin
    };
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', onScroll);
      clearTimeout(settle);
    };
  }, [extra, min]);

  return offset;
}
