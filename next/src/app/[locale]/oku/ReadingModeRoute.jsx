'use client';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

// ReadingMode'da 21 HIGH SSR-unsafe useState (window/localStorage doğrudan erişim).
// SSR'da render etmek hydration mismatch'e yol açar; ssr:false ile client-only render.
// SEO sinyalleri (PageHeading H1 + JsonLd) page.js server'da kalır.
const ReadingMode = dynamic(() => import('@/components/ReadingMode'), {
  ssr: false,
  loading: () => null,
});

export default function ReadingModeRoute() {
  const router = useRouter();
  return <ReadingMode onClose={() => router.back()} />;
}
