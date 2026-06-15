'use client';
import { useRouter } from 'next/navigation';
import BilimselIsaretler from '@/components/BilimselIsaretler';
export default function BilimselIsaretlerRoute() {
  const router = useRouter();
  return <BilimselIsaretler onClose={() => router.back()} />;
}
