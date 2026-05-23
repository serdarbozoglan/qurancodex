'use client';

import { useRouter } from 'next/navigation';
import QuranCommands from '@/components/QuranCommands';

export default function QuranCommandsRoute() {
  const router = useRouter();
  return <QuranCommands onClose={() => router.back()} />;
}
