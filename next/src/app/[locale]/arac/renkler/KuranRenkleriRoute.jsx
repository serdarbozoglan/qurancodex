'use client';

import { useRouter, useParams } from 'next/navigation';
import KuranRenkleri from '@/components/KuranRenkleri';
import { closeToPrevious } from '@/lib/navOrigin';

export default function KuranRenkleriRoute() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale === 'en' ? 'en' : 'tr';
  return <KuranRenkleri onClose={() => closeToPrevious(router, `/${locale}`)} />;
}
