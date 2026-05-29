'use client';

// A planı Phase 0 — overlay header kaldırıldı; close butonu artık yok
// (browser back tuşu + global Navbar bu rolü yapar). onClose prop'u boş
// fonksiyon olarak geçilir, tool component'ı bunu kullanmaz hale getirildi.
import WowFacts from '@/components/WowFacts';

export default function WowFactsRoute() {
  return <WowFacts onClose={() => {}} />;
}
</content>
</invoke>