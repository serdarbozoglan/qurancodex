'use client';

import { useRouter } from 'next/navigation';
import KuranRetorigi from '@/components/KuranRetorigi';

export default function KuranRetorigiRoute() {
  const router = useRouter();
  return <KuranRetorigi onClose={() => router.back()} />;
}
