'use client';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

// ProphetAtlas dolaylı leaflet bağımlısı (ProphetMap içinden). ssr: false ile
// yalnızca client tarafında render.
const ProphetAtlas = dynamic(() => import('@/sections/ProphetAtlas'), { ssr: false });

export default function ProphetAtlasRoute() {
  const router = useRouter();
  return <ProphetAtlas onClose={() => router.back()} />;
}
