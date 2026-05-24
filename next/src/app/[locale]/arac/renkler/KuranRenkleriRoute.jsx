'use client';

import { useRouter } from 'next/navigation';
import KuranRenkleri from '@/components/KuranRenkleri';

export default function KuranRenkleriRoute() {
  const router = useRouter();
  return <KuranRenkleri onClose={() => router.back()} />;
}
