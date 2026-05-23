'use client';

// KissaAtlas'i route içinde full-page olarak render eden client wrapper.
// onClose Vite'ta overlay'i kapatıyordu; burada Next router ile homepage'e
// döner. Görsel olarak KissaAtlas overlay'inin TAM aynısı (CLAUDE.md §13.3
// OVERLAY_BASE pattern).

import { useRouter } from 'next/navigation';
import KissaAtlas from '@/components/KissaAtlas';

export default function KissaAtlasRoute() {
  const router = useRouter();
  return <KissaAtlas onClose={() => router.back()} />;
}
