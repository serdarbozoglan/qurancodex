'use client';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

// VerseGraph three.js / react-force-graph-3d kullanıyor — WebGL canvas
// module-level. SSR'da window erişir, ssr: false zorunlu.
const VerseGraph = dynamic(() => import('@/components/VerseGraph'), { ssr: false });

export default function VerseGraphRoute() {
  const router = useRouter();
  return <VerseGraph onClose={() => router.back()} />;
}
