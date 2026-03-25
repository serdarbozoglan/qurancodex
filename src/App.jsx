import { LanguageProvider } from './i18n/LanguageContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProphetAtlas from './sections/ProphetAtlas';
import LinguisticDNA from './sections/LinguisticDNA';
import ImpossibleRhythm from './sections/ImpossibleRhythm';
import SoundArchitecture from './sections/SoundArchitecture';
import HiddenArchitecture from './sections/HiddenArchitecture';
import ScientificSigns from './sections/ScientificSigns';
import HistoricalProof from './sections/HistoricalProof';
import LivingPreservation from './sections/LivingPreservation';
import ZeroRedundancy from './sections/ZeroRedundancy';
import Highlights from './sections/Highlights';
import HumanDefinition from './sections/HumanDefinition';
import Conclusion from './sections/Conclusion';
import Footer from './components/Footer';

export default function App() {
  return (
    <LanguageProvider>
      <Navbar />
      <main>
        <Hero />
        <div className="gradient-divider" />
        <ProphetAtlas />
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
        <div className="gradient-divider-reverse" />
        <Conclusion />
      </main>
      <Footer />
    </LanguageProvider>
  );
}
