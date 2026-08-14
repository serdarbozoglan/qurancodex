'use client';

import { useRouter, useParams } from 'next/navigation';
import DogaAtlasi from '@/components/DogaAtlasi';
import { closeToPrevious } from '@/lib/navOrigin';

export default function DogaAtlasiRoute() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale === 'en' ? 'en' : 'tr';
  return <DogaAtlasi onClose={() => closeToPrevious(router, `/${locale}`)} />;
}
