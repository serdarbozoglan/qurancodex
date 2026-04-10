import { LanguageProvider } from './i18n/LanguageContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
// v1.1 redesign — discovery layer (mounted right after Hero)
import PathCards from './sections/PathCards';
import AllTopics from './sections/AllTopics';
import ToolsHighlight from './sections/ToolsHighlight';
// Existing long-form content sections
import LinguisticDNA from './sections/LinguisticDNA';
import ImpossibleRhythm from './sections/ImpossibleRhythm';
import QuranRhetoric from './sections/QuranRhetoric';
import QuranDua from './sections/QuranDua';
import SoundArchitecture from './sections/SoundArchitecture';
import PsychologySection from './sections/PsychologySection';
import HiddenArchitecture from './sections/HiddenArchitecture';
import ScientificSigns from './sections/ScientificSigns';
import HistoricalProof from './sections/HistoricalProof';
import LivingPreservation from './sections/LivingPreservation';
import ZeroRedundancy from './sections/ZeroRedundancy';
import Highlights from './sections/Highlights';
import HumanDefinition from './sections/HumanDefinition';
import ToolsShowcase from './sections/ToolsShowcase';
import Conclusion from './sections/Conclusion';
import ChapterProgress from './components/ChapterProgress';
import Footer from './components/Footer';
// v1.1 — centered modal listing all 17 interactive tools
import ToolsBrowser from './components/ToolsBrowser';

export default function App() {
  return (
    <LanguageProvider>
      <Navbar />
      <ChapterProgress />
      <main>
        {/* Hero */}
        <Hero />

        {/* ── v1.1 discovery layer ─────────────────────────────────────── */}
        <div className="gradient-divider" />
        <PathCards />
        <AllTopics />
        <ToolsHighlight />

        {/* ── Existing long-form content (unchanged order) ─────────────── */}
        <div className="gradient-divider-reverse" />
        <LinguisticDNA />
        <ImpossibleRhythm />
        <div className="gradient-divider" />
        <QuranRhetoric />
        <div className="gradient-divider-reverse" />
        <QuranDua />
        <SoundArchitecture />
        <HiddenArchitecture />
        <ScientificSigns />
        <div className="gradient-divider-reverse" />
        <HistoricalProof />
        <div className="gradient-divider" />
        <LivingPreservation />
        <div className="gradient-divider-reverse" />
        <ZeroRedundancy />
        <div className="gradient-divider" />
        <Highlights />
        <div className="gradient-divider" />
        <HumanDefinition />
        <PsychologySection />
        <ToolsShowcase />
        <Conclusion />
      </main>
      <Footer />
      {/* Tools browser modal — opens via openOverlay('allTools') from anywhere */}
      <ToolsBrowser />
    </LanguageProvider>
  );
}
