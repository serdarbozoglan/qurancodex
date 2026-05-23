'use client';

import { useRouter } from 'next/navigation';
import IlkSonKelimeler from '@/components/IlkSonKelimeler';

export default function IlkSonKelimelerRoute() {
  const router = useRouter();
  return <IlkSonKelimeler onClose={() => router.back()} />;
}
