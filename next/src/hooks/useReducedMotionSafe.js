'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * SSR-güvenli useReducedMotion — §16.6.
 *
 * NEDEN VAR (2026-09-01):
 * framer-motion'ın useReducedMotion()'ı sunucuda HER ZAMAN false döner
 * (matchMedia yok). İstemcide, kullanıcının tercihi açıksa ilk render'da
 * true döner. Bu değer render sırasında dallanmaya girdiği anda sunucu ve
 * istemcinin ürettiği HTML ayrışır ve React hidrasyon uyuşmazlığı basar.
 *
 * Ayrışma yalnız stilde olmuyor; en sinsi hâli jest proplarında:
 *   whileHover={reduced ? undefined : {...}}
 * framer-motion bir jest propu VERİLDİĞİNDE elemana tabIndex="0" ekler.
 * Sunucu (reduced=false) tabindex'li, istemci (reduced=true) tabindex'siz
 * HTML üretir → uyuşmazlık. Anasayfada tam olarak bu yakalandı
 * (TefekkurHighlight → FeaturedEssayCard, reduce modunda 1 uyuşmazlık).
 *
 * ÇÖZÜM: ilk istemci render'ında sunucuyla aynı cevabı (false) ver, gerçek
 * tercihi mount sonrasına ertele. Hidrasyon birebir eşleşir; effect
 * çalışınca bileşen doğru değerle yeniden render olur ve hareket gerçekten
 * kısılır. Kısıtlama bir kare gecikir — reveal/gesture için görünmez.
 *
 * KULLANIM: render'da dallanacaksan framer-motion'ın useReducedMotion'ını
 * DEĞİL bunu kullan. Doğrudan olanı yalnız effect/olay içinde okuman
 * güvenli.
 */
export default function useReducedMotionSafe() {
  const preferred = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted ? preferred : false;
}
