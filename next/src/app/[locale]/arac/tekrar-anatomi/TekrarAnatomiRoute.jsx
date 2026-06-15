'use client';
import { useRouter } from 'next/navigation';
import TekrarAnatomi from '@/components/TekrarAnatomi';
export default function TekrarAnatomiRoute() {
  const router = useRouter();
  return <TekrarAnatomi onClose={() => router.back()} />;
}
