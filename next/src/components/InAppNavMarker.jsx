'use client';

// Layout'ta oturur, hiçbir şey render etmez. İstemci tarafı her rota
// değişiminde "site içinden gezindi" bayrağını kaldırır.
// İLK YÜKLEME bayrağı kaldırmaz — `first` guard'ı tam olarak bunun için.
// Gerekçe ve reddedilen alternatifler: src/lib/navOrigin.js
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { markInAppNav } from '@/lib/navOrigin';

export default function InAppNavMarker() {
  const pathname = usePathname();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    markInAppNav();
  }, [pathname]);
  return null;
}
