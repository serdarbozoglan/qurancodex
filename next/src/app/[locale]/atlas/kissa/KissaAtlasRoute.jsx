'use client';

// KissaAtlas'i route içinde full-page olarak render eden client wrapper.
// onClose Vite'ta overlay'i kapatıyordu; burada Next router ile homepage'e
// döner. Görsel olarak KissaAtlas overlay'inin TAM aynısı (CLAUDE.md §13.3
// OVERLAY_BASE pattern).

import { useRouter, useParams } from 'next/navigation';
import KissaAtlas from '@/components/KissaAtlas';
import { closeToPrevious } from '@/lib/navOrigin';

export default function KissaAtlasRoute() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale === 'en' ? 'en' : 'tr';
  return <KissaAtlas onClose={() => closeToPrevious(router, `/${locale}`)} />;
}
