'use client';

import dynamic from 'next/dynamic';
import { useRouter, useParams } from 'next/navigation';
import { closeToPrevious } from '@/lib/navOrigin';

// KavimlerAtlasi react-leaflet kullanıyor — react-leaflet module-level
// window erişimi yapıyor; SSR'da patlar. ssr: false ile yalnızca client.
const KavimlerAtlasi = dynamic(() => import('@/components/KavimlerAtlasi'), { ssr: false });

export default function KavimlerAtlasiRoute() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale === 'en' ? 'en' : 'tr';
  return <KavimlerAtlasi onClose={() => closeToPrevious(router, `/${locale}`)} />;
}
