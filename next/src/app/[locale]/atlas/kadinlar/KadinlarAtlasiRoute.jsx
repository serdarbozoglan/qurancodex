'use client';

import { useRouter } from 'next/navigation';
import KadinlarAtlasi from '@/components/KadinlarAtlasi';

export default function KadinlarAtlasiRoute() {
  const router = useRouter();
  return <KadinlarAtlasi onClose={() => router.back()} />;
}
