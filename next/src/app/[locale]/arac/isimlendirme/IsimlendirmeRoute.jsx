'use client';

import { useRouter, useParams } from 'next/navigation';
import Isimlendirme from '@/components/Isimlendirme';
import { closeToPrevious } from '@/lib/navOrigin';

export default function IsimlendirmeRoute() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale === 'en' ? 'en' : 'tr';
  return <Isimlendirme onClose={() => closeToPrevious(router, `/${locale}`)} />;
}
