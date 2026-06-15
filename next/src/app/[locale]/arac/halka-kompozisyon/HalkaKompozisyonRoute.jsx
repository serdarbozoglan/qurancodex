'use client';
import { useRouter } from 'next/navigation';
import HalkaKompozisyon from '@/components/HalkaKompozisyon';
export default function HalkaKompozisyonRoute() {
  const router = useRouter();
  return <HalkaKompozisyon onClose={() => router.back()} />;
}
