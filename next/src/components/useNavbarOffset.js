'use client';

import { useEffect, useState } from 'react';

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
// 2026-08-30 — İKİNCİ tur. Navbar scroll'da kompaktlaşıyor (Navbar.jsx
// `py-5`→`py-3`, `transition-all duration-500`) — alt kenarı ~16px küçülüyor
// (1920px'te 82→67). Bu geçiş SIRASINDA doğru değeri sürekli takip etmek
// gerekiyor, tek seferlik bir ölçüm + tahmini gecikme YETMEZ:
//
//   Deneme 1 (scroll event + 450ms sabit gecikme): geçiş başlarken alınan
//   TEK ölçüm donuyor, 450ms boyunca (geçişin kendisi 500ms sürüyor —
//   gecikme geçişten bile kısaydı) sticky header navbar'ın gerçek alt
//   kenarından ~17px aşağıda kalıyor, aradaki boşluktan kaydırılan içerik
//   görünüyor (kullanıcı ekran görüntüsüyle bildirdi, /atlas/munasebat).
//
//   Deneme 2 (ResizeObserver, varsayılan `content-box`): HİÇ tetiklenmedi —
//   çünkü kompaktlaşma yalnız `padding`i değiştiriyor, content-box padding'i
//   saymaz. `{box:'border-box'}` ile düzeltildi — artık geçişin HER karesinde
//   doğru tetikleniyor (ölçüldü: 82→67 arası ~45 ayrı callback).
//
//   Deneme 3 (border-box ResizeObserver + "kompakt durumda ayrı, düşük
//   taban" — `scrollY>50` eşiğiyle iki tabanlı): AŞAĞI kaydırırken düzeldi
//   ama YUKARI kaydırırken (navbar tekrar büyürken) aynı hata ters yönde
//   geri geldi — eşik anında atlıyor, navbar'ın gerçek yüksekliği ise
//   kademeli büyüyor; taban navbar'dan önce yükselince ARADA yine boşluk
//   açılıyor (kullanıcı ikinci kez bildirdi).
//
// Ders: EŞİK TABANLI hiçbir taban-değiştirme mantığı güvenli değil — geçiş
// hangi yöne giderse gitsin, ölçülen değerle taban arasında anlık bir
// uyumsuzluk anı yaratıyor. Çözüm: artık ResizeObserver SÜREKLİ ve DOĞRU
// ölçtüğüne göre, tabanı yalnız İLK RENDER'ın (SSR/hydration, ölçüm henüz
// çalışmadan önceki) güvenli varsayılanı olarak kullan — ölçüm bir kez
// gerçekleştikten SONRA taban tarafından bir daha ASLA yukarı çekilmesin.
const FALLBACK = 96;

// Ölçülmüş taban (2026-08-26, üretim build'i): navbarın GENİŞ (scroll'suz)
// haldeki alt kenarı — yalnız ilk render'ın (SSR + hydration öncesi)
// varsayılan değeri için kullanılır, bkz. yukarıdaki not.
//   390px  TR/EN → 84      1440px TR/EN → 82      1024px EN → 81
const MEASURED_FLOOR = 84;

export default function useNavbarOffset(extra = 24, min = FALLBACK) {
  const initial = Math.max(min, MEASURED_FLOOR);
  const [offset, setOffset] = useState(initial);

  useEffect(() => {
    const measure = () => {
      const nav = document.querySelector('nav[aria-label="Main navigation"]');
      const b = nav ? Math.round(nav.getBoundingClientRect().bottom) : 0;
      // Taban artık yalnız navbar hiç bulunamazsa (ölçüm imkansız) devreye
      // girer — gerçek bir ölçüm geldiğinde ona güvenilir, yukarı ÇEKİLMEZ.
      setOffset(b > 0 ? b + extra : initial);
    };
    measure();
    window.addEventListener('resize', measure);

    // ResizeObserver navbarın border-box'ını (padding dahil) izler — scroll
    // kompaktlaşma geçişinin HER karesinde tetiklenir, sabit gecikme veya
    // eşik tahminine gerek kalmaz (bkz. yukarıdaki "Deneme 1-3" notu).
    const nav = document.querySelector('nav[aria-label="Main navigation"]');
    let ro;
    if (nav && typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(measure);
      ro.observe(nav, { box: 'border-box' });
    }
    return () => {
      window.removeEventListener('resize', measure);
      ro?.disconnect();
    };
  }, [extra, initial]);

  return offset;
}
