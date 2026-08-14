'use client';

import { useRouter, useParams } from 'next/navigation';
import MunafikProfili from '@/components/MunafikProfili';
import { closeToPrevious } from '@/lib/navOrigin';

export default function MunafikProfiliRoute() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale === 'en' ? 'en' : 'tr';
  return <MunafikProfili onClose={() => closeToPrevious(router, `/${locale}`)} />;
}
