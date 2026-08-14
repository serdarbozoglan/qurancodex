'use client';

import { useRouter, useParams } from 'next/navigation';
import FurukAtlasi from '@/components/FurukAtlasi';
import { closeToPrevious } from '@/lib/navOrigin';

export default function FurukAtlasiRoute() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale === 'en' ? 'en' : 'tr';
  return <FurukAtlasi onClose={() => closeToPrevious(router, `/${locale}`)} />;
}
