'use client';

import { useRouter } from 'next/navigation';
import KiyametSahneleri from '@/components/KiyametSahneleri';

export default function KiyametSahneleriRoute() {
  const router = useRouter();
  return <KiyametSahneleri onClose={() => router.back()} />;
}
