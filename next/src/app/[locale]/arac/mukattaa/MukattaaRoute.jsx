'use client';

import { useRouter, useParams } from 'next/navigation';
import Mukattaa from '@/components/Mukattaa';
import { closeToPrevious } from '@/lib/navOrigin';

export default function MukattaaRoute() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale === 'en' ? 'en' : 'tr';
  return <Mukattaa onClose={() => closeToPrevious(router, `/${locale}`)} />;
}
