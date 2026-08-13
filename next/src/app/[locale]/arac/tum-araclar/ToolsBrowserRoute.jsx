'use client';

import { useRouter, useParams } from 'next/navigation';
import ToolsBrowser from '@/components/ToolsBrowser';

export default function ToolsBrowserRoute() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale === 'en' ? 'en' : 'tr';

  // Kapanış hedefi (2026-08-13). Önceden koşulsuz router.back() idi; kullanıcı
  // sayfaya doğrudan geldiyse (paylaşılan link, yeni sekme, arama sonucu)
  // geçmiş boş olduğu için back() hiçbir şey yapmıyor ve ekranda boş sayfa
  // kalıyordu. Geçmiş varsa geri dön, yoksa anasayfaya git.
  const handleClose = () => {
    if (typeof window === 'undefined') return;
    // history.length güvenilir değil (yeni sekme bile 2 olabiliyor). Site içinden
    // gelinip gelinmediğini referrer söyler: aynı origin ise geri dön, aksi hâlde
    // (paylaşılan link, arama sonucu, doğrudan adres) anasayfaya git.
    let sameOrigin = false;
    try {
      sameOrigin = !!document.referrer &&
        new URL(document.referrer).origin === window.location.origin;
    } catch { sameOrigin = false; }
    if (sameOrigin && window.history.length > 1) router.back();
    else router.push(`/${locale}`);
  };

  return <ToolsBrowser onClose={handleClose} defaultOpen />;
}
