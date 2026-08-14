'use client';

import { useRouter, useParams } from 'next/navigation';
import InsanYolculugu from '@/components/InsanYolculugu';
import { closeToPrevious } from '@/lib/navOrigin';

export default function InsanYolculuguRoute() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale === 'en' ? 'en' : 'tr';
  return <InsanYolculugu onClose={() => closeToPrevious(router, `/${locale}`)} />;
}
