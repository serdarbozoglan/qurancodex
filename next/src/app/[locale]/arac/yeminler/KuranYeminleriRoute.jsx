'use client';

import { useRouter } from 'next/navigation';
import KuranYeminleri from '@/components/KuranYeminleri';

export default function KuranYeminleriRoute() {
  const router = useRouter();
  return <KuranYeminleri onClose={() => router.back()} />;
}
