'use client';

import dynamic from 'next/dynamic';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { Suspense } from 'react';
import { closeToPrevious } from '@/lib/navOrigin';

// VerseGraph three.js / react-force-graph-3d kullanıyor — WebGL canvas
// module-level. SSR'da window erişir, ssr: false zorunlu.
const VerseGraph = dynamic(() => import('@/components/VerseGraph'), { ssr: false });

// 2026-08-13 (Z3b): `?q=2:255` desteği eklendi. VerseGraph zaten
// `initialSearch` prop'u kabul ediyordu ama route hiç beslemiyordu; bu yüzden
// WordPopover'ın "Ayet Haritası" rozeti kullanıcıyı tıkladığı ayeti KAYBEDEREK
// genel grafiğe düşürüyordu. Durum artık URL'de taşınıyor (§16.9) — yani
// bağlantı paylaşılabilir ve geri tuşu çalışır.
function VerseGraphInner() {
  const router = useRouter();
  const routeParams = useParams();
  const locale = routeParams?.locale === 'en' ? 'en' : 'tr';
  const search = useSearchParams();
  return (
    <VerseGraph
      initialSearch={search.get('q') || ''}
      onClose={() => closeToPrevious(router, `/${locale}`)}
    />
  );
}

export default function VerseGraphRoute() {
  // useSearchParams CSR bailout gerektirir — Suspense zorunlu.
  return (
    <Suspense fallback={null}>
      <VerseGraphInner />
    </Suspense>
  );
}
