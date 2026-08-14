'use client';
import { useRouter, useParams } from 'next/navigation';
import TekrarAnatomi from '@/components/TekrarAnatomi';
import { closeToPrevious } from '@/lib/navOrigin';
export default function TekrarAnatomiRoute() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale === 'en' ? 'en' : 'tr';
  return <TekrarAnatomi onClose={() => closeToPrevious(router, `/${locale}`)} />;
}
