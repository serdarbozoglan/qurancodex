'use client';

import { useRouter } from 'next/navigation';
import MeselAtlasi from '@/components/MeselAtlasi';

export default function MeselAtlasiRoute() {
  const router = useRouter();
  return <MeselAtlasi onClose={() => router.back()} />;
}
