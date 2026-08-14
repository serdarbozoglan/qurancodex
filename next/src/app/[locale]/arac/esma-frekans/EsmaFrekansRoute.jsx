'use client';

import { useRouter, useParams } from 'next/navigation';
import EsmaFrekans from '@/components/EsmaFrekans';
import { closeToPrevious } from '@/lib/navOrigin';

export default function EsmaFrekansRoute() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale === 'en' ? 'en' : 'tr';
  return <EsmaFrekans onClose={() => closeToPrevious(router, `/${locale}`)} />;
}
