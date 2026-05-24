'use client';

import { useRouter } from 'next/navigation';
import IblisSatan from '@/components/IblisSatan';

export default function IblisSatanRoute() {
  const router = useRouter();
  return <IblisSatan onClose={() => router.back()} />;
}
