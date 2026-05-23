'use client';

import { useRouter } from 'next/navigation';
import NefisMertebeleri from '@/components/NefisMertebeleri';

export default function NefisMertebeleriRoute() {
  const router = useRouter();
  return <NefisMertebeleri onClose={() => router.back()} />;
}
