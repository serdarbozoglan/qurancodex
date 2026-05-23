'use client';

import { useRouter } from 'next/navigation';
import SurahComparator from '@/components/SurahComparator';

export default function SurahComparatorRoute() {
  const router = useRouter();
  return <SurahComparator onClose={() => router.back()} />;
}
