'use client';

import { useRouter, useParams } from 'next/navigation';
import SunnetullahAtlasi from '@/components/SunnetullahAtlasi';
import { closeToPrevious } from '@/lib/navOrigin';

export default function SunnetullahAtlasiRoute() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale === 'en' ? 'en' : 'tr';
  return <SunnetullahAtlasi onClose={() => closeToPrevious(router, `/${locale}`)} />;
}
