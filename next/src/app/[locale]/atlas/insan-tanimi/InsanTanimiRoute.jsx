'use client';
import { useRouter } from 'next/navigation';
import InsanTanimi from '@/components/InsanTanimi';
export default function InsanTanimiRoute() {
  const router = useRouter();
  return <InsanTanimi onClose={() => router.back()} />;
}
