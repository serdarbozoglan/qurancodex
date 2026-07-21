'use client';

import { useRouter } from 'next/navigation';
import YakinAnlamliNuanslar from '@/components/YakinAnlamliNuanslar';

export default function YakinAnlamliNuanslarRoute() {
  const router = useRouter();
  return <YakinAnlamliNuanslar onClose={() => router.back()} />;
}
