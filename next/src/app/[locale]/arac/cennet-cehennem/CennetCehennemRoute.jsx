'use client';

import { useRouter, useParams } from 'next/navigation';
import CennetCehennem from '@/components/CennetCehennem';
import { closeToPrevious } from '@/lib/navOrigin';

export default function CennetCehennemRoute() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale === 'en' ? 'en' : 'tr';
  return <CennetCehennem onClose={() => closeToPrevious(router, `/${locale}`)} />;
}
