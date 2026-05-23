'use client';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

// KiraatAtlasi react-leaflet kullanıyor — SSR'da patlar.
const KiraatAtlasi = dynamic(() => import('@/components/KiraatAtlasi'), { ssr: false });

export default function KiraatAtlasiRoute() {
  const router = useRouter();
  return <KiraatAtlasi onClose={() => router.back()} />;
}
