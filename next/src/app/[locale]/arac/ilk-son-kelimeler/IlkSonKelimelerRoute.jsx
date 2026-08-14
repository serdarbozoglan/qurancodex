'use client';

import { useRouter, useParams } from 'next/navigation';
import IlkSonKelimeler from '@/components/IlkSonKelimeler';
import { closeToPrevious } from '@/lib/navOrigin';

export default function IlkSonKelimelerRoute() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale === 'en' ? 'en' : 'tr';
  return <IlkSonKelimeler onClose={() => closeToPrevious(router, `/${locale}`)} />;
}
