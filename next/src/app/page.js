// Migration home — Batch 3a wiring:
// - Hero + ParticleBackground (Batch 2)
// - PathCards (discovery layer — Hero CTA hedefi)
// - AllTopics (içerik keşif grid)
// - ToolsHighlight (interaktif araçlar grid)
// - LivingPreservation (Batch 1)
// - Footer (Batch 1)
// Batch 3b'de scroll-story başlangıç (LinguisticDNA, ImpossibleRhythm, vs.)

import Hero from '@/components/Hero';
import PathCards from '@/sections/PathCards';
import AllTopics from '@/sections/AllTopics';
import ToolsHighlight from '@/sections/ToolsHighlight';
import LivingPreservation from '@/sections/LivingPreservation';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Hero />
      <PathCards />
      <AllTopics />
      <ToolsHighlight />
      <LivingPreservation />
      <Footer />
    </>
  );
}
