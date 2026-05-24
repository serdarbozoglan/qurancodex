'use client';

import { useRouter } from 'next/navigation';
import SunnetullahAtlasi from '@/components/SunnetullahAtlasi';

export default function SunnetullahAtlasiRoute() {
  const router = useRouter();
  return <SunnetullahAtlasi onClose={() => router.back()} />;
}
