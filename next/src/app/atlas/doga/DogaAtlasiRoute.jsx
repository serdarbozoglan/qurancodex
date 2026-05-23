'use client';

import { useRouter } from 'next/navigation';
import DogaAtlasi from '@/components/DogaAtlasi';

export default function DogaAtlasiRoute() {
  const router = useRouter();
  return <DogaAtlasi onClose={() => router.back()} />;
}
