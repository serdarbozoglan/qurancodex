'use client';
import { useRouter } from 'next/navigation';
import InsanPsikolojisi from '@/components/InsanPsikolojisi';
export default function InsanPsikolojisiRoute() {
  const router = useRouter();
  return <InsanPsikolojisi onClose={() => router.back()} />;
}
