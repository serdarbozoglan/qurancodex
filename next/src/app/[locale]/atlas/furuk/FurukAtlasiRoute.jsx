'use client';

import { useRouter } from 'next/navigation';
import FurukAtlasi from '@/components/FurukAtlasi';

export default function FurukAtlasiRoute() {
  const router = useRouter();
  return <FurukAtlasi onClose={() => router.back()} />;
}
