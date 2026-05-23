'use client';

import { useRouter } from 'next/navigation';
import EsmaFrekans from '@/components/EsmaFrekans';

export default function EsmaFrekansRoute() {
  const router = useRouter();
  return <EsmaFrekans onClose={() => router.back()} />;
}
