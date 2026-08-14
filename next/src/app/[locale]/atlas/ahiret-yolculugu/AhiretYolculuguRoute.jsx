'use client';

import { useRouter, useParams } from 'next/navigation';
import AhiretYolculugu from '@/components/AhiretYolculugu';
import { closeToPrevious } from '@/lib/navOrigin';

export default function AhiretYolculuguRoute() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale === 'en' ? 'en' : 'tr';
  return <AhiretYolculugu onClose={() => closeToPrevious(router, `/${locale}`)} />;
}
