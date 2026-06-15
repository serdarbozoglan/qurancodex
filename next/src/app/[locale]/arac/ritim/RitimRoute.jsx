'use client';
import { useRouter } from 'next/navigation';
import Ritim from '@/components/Ritim';
export default function RitimRoute() {
  const router = useRouter();
  return <Ritim onClose={() => router.back()} />;
}
