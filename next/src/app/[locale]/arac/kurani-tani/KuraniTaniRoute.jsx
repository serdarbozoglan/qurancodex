'use client';

// A planı Phase 0 + 0.5 — slug `wow` → `kurani-tani` Türkçeleştirildi.
// Overlay header kaldırıldı; close butonu yok (browser back + Navbar bu rolü
// yapar). onClose prop'u no-op olarak geçilir (tool component'ı uyumluluk için
// hala kabul eder).
import WowFacts from '@/components/WowFacts';

export default function KuraniTaniRoute() {
  return <WowFacts onClose={() => {}} />;
}
