'use client';

import dynamic from 'next/dynamic';
import { useRouter, useParams } from 'next/navigation';
import { closeToPrevious } from '@/lib/navOrigin';

// KiraatAtlasi react-leaflet kullanıyor — SSR'da patlar.
const KiraatAtlasi = dynamic(() => import('@/components/KiraatAtlasi'), { ssr: false });

export default function KiraatAtlasiRoute() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale === 'en' ? 'en' : 'tr';
  return <KiraatAtlasi onClose={() => closeToPrevious(router, `/${locale}`)} />;
}
