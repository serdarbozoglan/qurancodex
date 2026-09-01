'use client';

// ─── MotionPrefs — hareket tercihi tek yerden ───────────────────────────────
//
// 2026-08-31. §9 "Reduced motion media query to disable animations" diyordu
// ama fiilen uygulanmıyordu: ölçüm, 31 bileşenin `whileInView` kullandığını
// ve yalnız 13'ünün `useReducedMotion` dinlediğini gösterdi. Conclusion,
// HiddenArchitecture, Highlights, HistoricalProof gibi anasayfa bölümleri
// hiç dinlemiyordu — yani sistem ayarında "hareketi azalt" seçmiş bir
// kullanıcı, ayarına rağmen kayan/ölçeklenen animasyonları görüyordu.
//
// 23 dosyayı tek tek düzenlemek yerine framer-motion'ın kendi mekanizması
// kullanılıyor: MotionConfig `reducedMotion="user"` ile prefers-reduced-motion
// açıkken transform ve layout animasyonları KAPANIR — kaydırma, ölçekleme,
// yer değiştirme gibi vestibüler rahatsızlık veren hareketler. Opaklık
// geçişleri bilerek korunur; framer-motion'ın da duruşu budur, çünkü sönümlü
// bir görünme baş dönmesi tetiklemez ve içeriğin belirişini anlaşılır kılar.
//
// Bileşen bazlı `useReducedMotion` kullanımları geçerliliğini korur; bu
// katman onların üstüne değil, onları KULLANMAYAN her yerin altına serilir.
// ────────────────────────────────────────────────────────────────────────────

// SSR NOTU: sunucu kullanıcının hareket tercihini bilemez. `reducedMotion`
// ilk render'da doğrudan "user" verilirse sunucu animasyonun başlangıç hâlini
// (ör. opacity:0.5) basar, istemci tercihi okuyup atlar ve React hidrasyon
// uyuşmazlığı verir — ölçüldü. Bu yüzden §16.6'nın SSR-güvenli kalıbı:
// ilk render sunucuyla aynı ("never"), tercih mount'tan sonra devreye girer.
import { useState, useEffect } from 'react';
import { MotionConfig } from 'framer-motion';

export default function MotionPrefs({ children }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  return (
    <MotionConfig reducedMotion={mounted ? 'user' : 'never'}>
      {children}
    </MotionConfig>
  );
}
