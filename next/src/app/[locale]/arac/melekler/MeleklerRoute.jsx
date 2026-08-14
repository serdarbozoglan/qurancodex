'use client';

import { useRouter, useParams } from 'next/navigation';
import Melekler from '@/components/Melekler';
import { closeToPrevious } from '@/lib/navOrigin';

export default function MeleklerRoute() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale === 'en' ? 'en' : 'tr';
  return <Melekler onClose={() => closeToPrevious(router, `/${locale}`)} />;
}
