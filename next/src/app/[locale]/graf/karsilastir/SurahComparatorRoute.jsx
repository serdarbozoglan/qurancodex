'use client';

import { useRouter, useParams } from 'next/navigation';
import SurahComparator from '@/components/SurahComparator';
import { closeToPrevious } from '@/lib/navOrigin';

export default function SurahComparatorRoute() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale === 'en' ? 'en' : 'tr';
  return <SurahComparator onClose={() => closeToPrevious(router, `/${locale}`)} />;
}
