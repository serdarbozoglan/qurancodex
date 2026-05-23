'use client';

import { useRouter } from 'next/navigation';
import MunasebatAtlasi from '@/components/MunasebatAtlasi';

export default function MunasebatAtlasiRoute() {
  const router = useRouter();
  return <MunasebatAtlasi onClose={() => router.back()} />;
}
