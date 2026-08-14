'use client';

import dynamic from 'next/dynamic';
import { useRouter, useParams } from 'next/navigation';
import { closeToPrevious } from '@/lib/navOrigin';

// ProphetAtlas dolaylı leaflet bağımlısı (ProphetMap içinden). ssr: false ile
// yalnızca client tarafında render.
const ProphetAtlas = dynamic(() => import('@/sections/ProphetAtlas'), { ssr: false });

export default function ProphetAtlasRoute() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale === 'en' ? 'en' : 'tr';
  return <ProphetAtlas onClose={() => closeToPrevious(router, `/${locale}`)} />;
}
