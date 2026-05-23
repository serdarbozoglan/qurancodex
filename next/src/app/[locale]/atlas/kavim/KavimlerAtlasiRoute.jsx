'use client';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

// KavimlerAtlasi react-leaflet kullanıyor — react-leaflet module-level
// window erişimi yapıyor; SSR'da patlar. ssr: false ile yalnızca client.
const KavimlerAtlasi = dynamic(() => import('@/components/KavimlerAtlasi'), { ssr: false });

export default function KavimlerAtlasiRoute() {
  const router = useRouter();
  return <KavimlerAtlasi onClose={() => router.back()} />;
}
