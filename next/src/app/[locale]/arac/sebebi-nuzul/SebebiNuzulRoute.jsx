'use client';

import { useRouter, useParams } from 'next/navigation';
import SebebiNuzul from '@/components/SebebiNuzul';
import { closeToPrevious } from '@/lib/navOrigin';

export default function SebebiNuzulRoute() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale === 'en' ? 'en' : 'tr';
  return <SebebiNuzul onClose={() => closeToPrevious(router, `/${locale}`)} />;
}
