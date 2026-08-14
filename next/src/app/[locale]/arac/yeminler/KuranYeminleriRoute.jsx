'use client';

import { useRouter, useParams } from 'next/navigation';
import KuranYeminleri from '@/components/KuranYeminleri';
import { closeToPrevious } from '@/lib/navOrigin';

export default function KuranYeminleriRoute() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale === 'en' ? 'en' : 'tr';
  return <KuranYeminleri onClose={() => closeToPrevious(router, `/${locale}`)} />;
}
