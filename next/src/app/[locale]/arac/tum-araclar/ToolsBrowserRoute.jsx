'use client';

import { useRouter, useParams } from 'next/navigation';
import ToolsBrowser from '@/components/ToolsBrowser';
import { closeToPrevious } from '@/lib/navOrigin';

export default function ToolsBrowserRoute() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale === 'en' ? 'en' : 'tr';

  // Kapanış hedefi. İki tur da yanlış tahmine dayanıyordu:
  //   2026-08-13: koşulsuz `router.back()` → doğrudan gelen kullanıcıda
  //     geçmiş boş olduğu için ekranda BOŞ SAYFA kalıyordu.
  //   2026-08-13b: `document.referrer` ile "site içinden mi geldi" tahmini →
  //     SPA geçişi referrer'ı GÜNCELLEMEDİĞİ için hep "dışarıdan" sanıyor,
  //     `push('/')` çalışıyor ve KAYDIRMA KONUMU KAYBOLUYORDU
  //     (kullanıcı raporu 2026-08-14; ölçüldü: referrer "" , scrollY 14552 → 0).
  // Artık tahmin yok: `InAppNavMarker` gerçek gezinmeyi kaydediyor.
  // Reddedilen alternatifler ve gerekçeleri: src/lib/navOrigin.js
  const handleClose = () => closeToPrevious(router, `/${locale}`);

  return <ToolsBrowser onClose={handleClose} defaultOpen />;
}
