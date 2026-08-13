'use client';

// ─── ScrollRevealRoot — TEK IntersectionObserver, tüm sayfa için ─────────────
//
// 2026-08-13 · P5. Öncesinde 14 anlatı kartının her biri 'use client' +
// framer-motion `whileInView` kullanıyordu: 14 ayrı hydration adası, her
// birinde motion runtime. Kartlar sunucu bileşenine indirilince animasyon
// da tek bir yere toplandı.
//
// Sözleşme: `data-reveal` taşıyan her öge görünür alana girince `.is-revealed`
// sınıfını alır. Görünüm tamamen CSS'te (globals.css → `[data-reveal]`).
// `prefers-reduced-motion` CSS tarafında karşılanır — burada dal yok.
//
// Emniyet: (1) <noscript> ile JS yoksa içerik görünür kalır, (2) observer
// hiç ateşlemezse 2.5sn sonra hepsi açılır — animasyon bir içeriği kalıcı
// olarak gizleyemez.
// ────────────────────────────────────────────────────────────────────────────

import { useEffect } from 'react';

const NOSCRIPT_CSS = '[data-reveal]{opacity:1!important;transform:none!important}';

export default function ScrollRevealRoot() {
  useEffect(() => {
    const revealAll = () =>
      document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-revealed'));

    if (typeof IntersectionObserver === 'undefined') {
      revealAll();
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add('is-revealed');
          io.unobserve(e.target);
        }
      },
      // -60px: kart tam kenardayken değil, biraz içeri girince açılsın.
      { rootMargin: '0px 0px -60px 0px', threshold: 0 }
    );

    document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));

    // Ağ/observer arızasına karşı kesin çıkış. Yalnız HİÇBİRİ açılmadıysa
    // devreye girer — aksi halde ekranın altındaki kartların animasyonunu
    // daha kullanıcı oraya varmadan harcardı.
    const failsafe = setTimeout(() => {
      if (!document.querySelector('[data-reveal].is-revealed')) revealAll();
    }, 2500);

    return () => {
      clearTimeout(failsafe);
      io.disconnect();
    };
  }, []);

  return (
    <noscript>
      <style dangerouslySetInnerHTML={{ __html: NOSCRIPT_CSS }} />
    </noscript>
  );
}
