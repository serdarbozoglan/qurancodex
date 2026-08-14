'use client';

import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

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
  const params = useSearchParams();
  return (
    <VerseGraph
      initialSearch={params.get('q') || ''}
      onClose={() => router.back()}
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
