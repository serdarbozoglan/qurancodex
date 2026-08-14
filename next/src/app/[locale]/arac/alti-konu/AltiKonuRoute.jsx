'use client';
import { useRouter, useParams } from 'next/navigation';
import AltiKonu from '@/components/AltiKonu';
import { closeToPrevious } from '@/lib/navOrigin';
export default function AltiKonuRoute() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale === 'en' ? 'en' : 'tr';
  return <AltiKonu onClose={() => closeToPrevious(router, `/${locale}`)} />;
}
