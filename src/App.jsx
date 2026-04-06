import { LanguageProvider } from './i18n/LanguageContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
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

export default function App() {
  return (
    <LanguageProvider>
      <Navbar />
      <ChapterProgress />
      <main>
        <Hero />
        <div className="gradient-divider" />
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
    </LanguageProvider>
  );
}
