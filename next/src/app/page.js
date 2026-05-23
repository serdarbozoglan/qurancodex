// Migration home — Batch 2 wiring:
// - Hero + ParticleBackground (canvas yıldız animasyonu)
// - LivingPreservation (Batch 1)
// - Footer (Batch 1)
// Batch 3'te diğer 18 scroll-story section.

import Hero from '@/components/Hero';
import LivingPreservation from '@/sections/LivingPreservation';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Hero />
      <LivingPreservation />
      <Footer />
    </>
  );
}
