'use client';

import { useRouter, useParams } from 'next/navigation';
import DiyalogAgi from '@/components/DiyalogAgi';
import { closeToPrevious } from '@/lib/navOrigin';

export default function DiyalogAgiRoute() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale === 'en' ? 'en' : 'tr';
  return <DiyalogAgi onClose={() => closeToPrevious(router, `/${locale}`)} />;
}
