'use client';

import { useRouter } from 'next/navigation';
import ToolsBrowser from '@/components/ToolsBrowser';

export default function ToolsBrowserRoute() {
  const router = useRouter();
  return <ToolsBrowser onClose={() => router.back()} />;
}
