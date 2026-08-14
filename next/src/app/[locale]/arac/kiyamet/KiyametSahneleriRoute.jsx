'use client';

import { useRouter, useParams } from 'next/navigation';
import KiyametSahneleri from '@/components/KiyametSahneleri';
import { closeToPrevious } from '@/lib/navOrigin';

export default function KiyametSahneleriRoute() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale === 'en' ? 'en' : 'tr';
  return <KiyametSahneleri onClose={() => closeToPrevious(router, `/${locale}`)} />;
}
