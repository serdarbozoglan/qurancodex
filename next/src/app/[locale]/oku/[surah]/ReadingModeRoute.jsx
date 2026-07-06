'use client';

import dynamic from 'next/dynamic';
import { useRouter, useParams } from 'next/navigation';

// ReadingMode'da 21 HIGH SSR-unsafe useState (window/localStorage doğrudan erişim).
// SSR'da render etmek hydration mismatch'e yol açar; ssr:false ile client-only render.
// SEO sinyalleri (PageHeading H1 + JsonLd) page.js server'da kalır.
const ReadingMode = dynamic(() => import('@/components/ReadingMode'), {
  ssr: false,
  loading: () => null,
});

export default function ReadingModeRoute({ initialSurah }) {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale || 'tr';
  // Close daima QuranCodex anasayfasına gider. Önceki router.back() external
  // referrer'dan (Google, sosyal medya) gelen kullanıcıyı geri Google'a
  // atıyordu (user #169 2026-07-06). Anasayfa net bir "exit" hedefi.
  return <ReadingMode onClose={() => router.push(`/${locale}`)} initialSurah={initialSurah} />;
}
