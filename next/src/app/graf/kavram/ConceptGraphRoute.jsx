'use client';

import { useRouter } from 'next/navigation';
import ConceptGraph from '@/components/ConceptGraph';

export default function ConceptGraphRoute() {
  const router = useRouter();
  return <ConceptGraph onClose={() => router.back()} />;
}
