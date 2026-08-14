'use client';

import { useRouter, useParams } from 'next/navigation';
import MeselAtlasi from '@/components/MeselAtlasi';
import { closeToPrevious } from '@/lib/navOrigin';

export default function MeselAtlasiRoute() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale === 'en' ? 'en' : 'tr';
  return <MeselAtlasi onClose={() => closeToPrevious(router, `/${locale}`)} />;
}
