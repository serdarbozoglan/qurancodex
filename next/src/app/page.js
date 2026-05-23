// Migration home — Batch 3c wiring:
// Awe katmanı (HiddenArchitecture + PsychologySection + HumanDefinition)
// scroll-story'ye eklendi.

import Hero from '@/components/Hero';
import PathCards from '@/sections/PathCards';
import AllTopics from '@/sections/AllTopics';
import ToolsHighlight from '@/sections/ToolsHighlight';
import LinguisticDNA from '@/sections/LinguisticDNA';
import ImpossibleRhythm from '@/sections/ImpossibleRhythm';
import SoundArchitecture from '@/sections/SoundArchitecture';
import HiddenArchitecture from '@/sections/HiddenArchitecture';
import PsychologySection from '@/sections/PsychologySection';
import HumanDefinition from '@/sections/HumanDefinition';
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
      <HiddenArchitecture />
      <PsychologySection />
      <HumanDefinition />
      <LivingPreservation />
      <Footer />
    </>
  );
}
