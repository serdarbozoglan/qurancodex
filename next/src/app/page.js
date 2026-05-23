// Migration home — Batch 3b wiring:
// - Hero + ParticleBackground (Batch 2)
// - Discovery layer: PathCards + AllTopics + ToolsHighlight (Batch 3a)
// - Scroll-story başlangıcı: LinguisticDNA + ImpossibleRhythm +
//   SoundArchitecture (Batch 3b) — Fascination katmanı
// - LivingPreservation (Batch 1)
// - Footer (Batch 1)
// Batch 3c'de Awe katmanı (HiddenArchitecture, PsychologySection, vs.)

import Hero from '@/components/Hero';
import PathCards from '@/sections/PathCards';
import AllTopics from '@/sections/AllTopics';
import ToolsHighlight from '@/sections/ToolsHighlight';
import LinguisticDNA from '@/sections/LinguisticDNA';
import ImpossibleRhythm from '@/sections/ImpossibleRhythm';
import SoundArchitecture from '@/sections/SoundArchitecture';
import LivingPreservation from '@/sections/LivingPreservation';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Hero />
      <PathCards />
      <AllTopics />
      <ToolsHighlight />
      <LinguisticDNA />
      <ImpossibleRhythm />
      <SoundArchitecture />
      <LivingPreservation />
      <Footer />
    </>
  );
}
