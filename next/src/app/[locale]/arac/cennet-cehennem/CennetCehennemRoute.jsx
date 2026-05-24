'use client';

import { useRouter } from 'next/navigation';
import CennetCehennem from '@/components/CennetCehennem';

export default function CennetCehennemRoute() {
  const router = useRouter();
  return <CennetCehennem onClose={() => router.back()} />;
}
