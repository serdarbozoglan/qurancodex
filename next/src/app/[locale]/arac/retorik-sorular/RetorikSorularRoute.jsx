'use client';
import { useRouter } from 'next/navigation';
import RetorikSorular from '@/components/RetorikSorular';
export default function RetorikSorularRoute() {
  const router = useRouter();
  return <RetorikSorular onClose={() => router.back()} />;
}
