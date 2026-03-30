import { LanguageProvider } from './i18n/LanguageContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import LinguisticDNA from './sections/LinguisticDNA';
import ImpossibleRhythm from './sections/ImpossibleRhythm';
import SoundArchitecture from './sections/SoundArchitecture';
import PsychologySection from './sections/PsychologySection';
import HiddenArchitecture from './sections/HiddenArchitecture';
import ScientificSigns from './sections/ScientificSigns';
import HistoricalProof from './sections/HistoricalProof';
import LivingPreservation from './sections/LivingPreservation';
import ZeroRedundancy from './sections/ZeroRedundancy';
import Highlights from './sections/Highlights';
import HumanDefinition from './sections/HumanDefinition';
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
        <div className="gradient-divider" />
        <PsychologySection />
        <div className="gradient-divider-reverse" />
        <Conclusion />
      </main>
      <Footer />
    </LanguageProvider>
  );
}
