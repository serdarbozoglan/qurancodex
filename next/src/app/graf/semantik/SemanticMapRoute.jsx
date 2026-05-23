'use client';

import { useRouter } from 'next/navigation';
import SemanticMap from '@/components/SemanticMap';

export default function SemanticMapRoute() {
  const router = useRouter();
  return <SemanticMap onClose={() => router.back()} />;
}
