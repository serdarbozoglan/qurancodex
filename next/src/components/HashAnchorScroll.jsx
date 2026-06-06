'use client';

// ─── HashAnchorScroll ────────────────────────────────────────────────────────
// Ana sayfada hash anchor (örn. #rhythm) için stable-layout-aware scroll.
//
// Problem: Tool sayfasından (örn. /arac/renkler) Keşfet → İmkansız Ritim
// tıklandığında window.location.href = '/tr#rhythm' ile navigate ediliyor.
// Browser native hash handling devreye girer AMA: ana sayfa section'lar
// progressive olarak load ettiği için (framer-motion whileInView, image
// decode, font swap), browser ilk scroll'u erken yapıyor → section yüklenince
// yüksekliği büyüyor → visitor section'ın ortasında/sonunda kalıyor.
//
// Çözüm: window.load event + 2x requestAnimationFrame + setTimeout fallback
// ile layout stabilize olduktan SONRA scroll yap. Bu element'in *baş kısmına*
// (block: 'start') instant scroll yapar — smooth değil, doğru pozisyon kritik.

import { useEffect } from 'react';

export default function HashAnchorScroll() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash;
    if (!hash || hash.length < 2) return;
    const id = hash.slice(1);

    let cancelled = false;

    const performScroll = () => {
      if (cancelled) return;
      const el = document.getElementById(id);
      if (!el) return;
      // Browser navbar yüksekliğini compensate et (62px sticky)
      const rect = el.getBoundingClientRect();
      const top = rect.top + window.scrollY - 70;
      window.scrollTo({ top, behavior: 'instant' });
    };

    // 3-aşamalı scroll: progressive layout stabilization için.
    // 1. window.load event sonrası (tüm resourceler hazır)
    // 2. requestAnimationFrame x2 (layout pass tamamlansın)
    // 3. 500ms ek fallback (framer-motion whileInView animasyonları için)
    const scheduleScroll = () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          performScroll();
          setTimeout(performScroll, 500);
        });
      });
    };

    if (document.readyState === 'complete') {
      scheduleScroll();
    } else {
      window.addEventListener('load', scheduleScroll, { once: true });
    }

    return () => { cancelled = true; };
  }, []);

  return null;
}
