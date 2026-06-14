// Migration home — Batch 3e wiring (final scroll-story katmanı):
// Reflection + Misc: QuranRhetoric, QuranDua, ToolsShowcase, Conclusion
// Eklenmedi: ProphetMap (leaflet bağımlısı — Faz 4'te react-leaflet + L
// kurulunca taşınacak)
//
// Final ana sayfa sırası Vite App.jsx ile uyumlu (eksik: ProphetMap).
// Navbar henüz yok — Faz 4'te 50+ tool route registry'siyle gelecek.

import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import Hero from '@/components/Hero';
import PathCards from '@/sections/PathCards';
import AllTopics from '@/sections/AllTopics';
import ToolsHighlight from '@/sections/ToolsHighlight';
import TefekkurHighlight from '@/sections/TefekkurHighlight';
import AllahKendiniTanitir from '@/sections/AllahKendiniTanitir';
import LinguisticDNA from '@/sections/LinguisticDNA';
import ImpossibleRhythm from '@/sections/ImpossibleRhythm';
import QuranRhetoric from '@/sections/QuranRhetoric';
import QuranDua from '@/sections/QuranDua';
import SoundArchitecture from '@/sections/SoundArchitecture';
import PsychologySection from '@/sections/PsychologySection';
import HiddenArchitecture from '@/sections/HiddenArchitecture';
import ScientificSigns from '@/sections/ScientificSigns';
import HistoricalProof from '@/sections/HistoricalProof';
import LivingPreservation from '@/sections/LivingPreservation';
import ZeroRedundancy from '@/sections/ZeroRedundancy';
import Highlights from '@/sections/Highlights';
import HumanDefinition from '@/sections/HumanDefinition';
import ToolsShowcase from '@/sections/ToolsShowcase';
import Conclusion from '@/sections/Conclusion';
import Footer from '@/components/Footer';
import MobileSectionChipNav from '@/components/MobileSectionChipNav';
import DesktopSidebarTOC from '@/components/DesktopSidebarTOC';
import ScrollToTopFab from '@/components/ScrollToTopFab';
import HashAnchorScroll from '@/components/HashAnchorScroll';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const isEN = locale === 'en';
  return pageMetadata({
    params,
    path: '',
    title: isEN
      ? "QuranCodex — The Invisible Architecture of the Quran"
      : "QuranCodex — Kur'an-ı Kerim'in Görünmeyen Mimarisi",
    description: isEN
      ? "Discover the hidden architecture of the Quran — mathematical patterns, linguistic DNA, ring composition, and scientific signs — through interactive visualizations."
      : "Kur'an'ın gizli mimarisini, sayısal mucizesini, dilsel DNA'sını ve halka kompozisyonunu interaktif görsellerle keşfedin.",
  });
}

export default async function Home({ params }) {
  const { locale } = await params;
  return (
    <>
      <JsonLd schemas={buildBreadcrumb(locale, '')} />
      <HashAnchorScroll />
      <MobileSectionChipNav />
      <DesktopSidebarTOC />
      <ScrollToTopFab />
      <Hero />
      <PathCards />
      <AllTopics />
      <ToolsHighlight />
      <LinguisticDNA />
      <ImpossibleRhythm />
      <QuranRhetoric />
      <QuranDua />
      <SoundArchitecture />
      <HiddenArchitecture />
      <ScientificSigns />
      <HistoricalProof />
      <LivingPreservation />
      <ZeroRedundancy />
      <Highlights />
      <AllahKendiniTanitir />
      <HumanDefinition />
      <PsychologySection />
      <ToolsShowcase />
      <Conclusion />
      <TefekkurHighlight compact />
      <Footer />
    </>
  );
}
