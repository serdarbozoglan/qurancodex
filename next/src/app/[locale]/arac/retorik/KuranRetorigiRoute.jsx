'use client';

import { useRouter, useParams } from 'next/navigation';
import KuranRetorigi from '@/components/KuranRetorigi';
import { closeToPrevious } from '@/lib/navOrigin';

export default function KuranRetorigiRoute() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale === 'en' ? 'en' : 'tr';
  return <KuranRetorigi onClose={() => closeToPrevious(router, `/${locale}`)} />;
}
