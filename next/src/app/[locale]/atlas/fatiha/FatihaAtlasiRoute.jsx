'use client';

import { useRouter, useParams } from 'next/navigation';
import FatihaAtlasi from '@/components/FatihaAtlasi';
import { closeToPrevious } from '@/lib/navOrigin';

export default function FatihaAtlasiRoute() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale === 'en' ? 'en' : 'tr';
  return <FatihaAtlasi onClose={() => closeToPrevious(router, `/${locale}`)} />;
}
