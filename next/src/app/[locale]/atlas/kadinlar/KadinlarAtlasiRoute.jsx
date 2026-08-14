'use client';

import { useRouter, useParams } from 'next/navigation';
import KadinlarAtlasi from '@/components/KadinlarAtlasi';
import { closeToPrevious } from '@/lib/navOrigin';

export default function KadinlarAtlasiRoute() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale === 'en' ? 'en' : 'tr';
  return <KadinlarAtlasi onClose={() => closeToPrevious(router, `/${locale}`)} />;
}
