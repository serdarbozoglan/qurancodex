'use client';
import { useRouter } from 'next/navigation';
import DuaDili from '@/components/DuaDili';
export default function DuaDiliRoute() {
  const router = useRouter();
  return <DuaDili onClose={() => router.back()} />;
}
