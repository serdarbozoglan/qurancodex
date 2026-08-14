'use client';

import { useRouter, useParams } from 'next/navigation';
import MunasebatAtlasi from '@/components/MunasebatAtlasi';
import { closeToPrevious } from '@/lib/navOrigin';

export default function MunasebatAtlasiRoute() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale === 'en' ? 'en' : 'tr';
  return <MunasebatAtlasi onClose={() => closeToPrevious(router, `/${locale}`)} />;
}
