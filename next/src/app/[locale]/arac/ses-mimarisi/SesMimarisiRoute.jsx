'use client';
import { useRouter } from 'next/navigation';
import SesMimarisi from '@/components/SesMimarisi';
export default function SesMimarisiRoute() {
  const router = useRouter();
  return <SesMimarisi onClose={() => router.back()} />;
}
