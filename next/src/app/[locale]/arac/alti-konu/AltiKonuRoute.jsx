'use client';
import { useRouter } from 'next/navigation';
import AltiKonu from '@/components/AltiKonu';
export default function AltiKonuRoute() {
  const router = useRouter();
  return <AltiKonu onClose={() => router.back()} />;
}
