import { LanguageProvider } from './i18n/LanguageContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MathMiracle from './sections/MathMiracle';
import LinguisticDNA from './sections/LinguisticDNA';
import ImpossibleRhythm from './sections/ImpossibleRhythm';
import SoundArchitecture from './sections/SoundArchitecture';
import HiddenSymmetry from './sections/HiddenSymmetry';
import SevenLayers from './sections/SevenLayers';
import ScientificSigns from './sections/ScientificSigns';
import HistoricalProof from './sections/HistoricalProof';
import LivingPreservation from './sections/LivingPreservation';
import ZeroRedundancy from './sections/ZeroRedundancy';
import Highlights from './sections/Highlights';
import Conclusion from './sections/Conclusion';
import Footer from './components/Footer';

export default function App() {
  return (
    <LanguageProvider>
      <Navbar />
      <main>
        <Hero />
        <div className="gradient-divider" />
        <MathMiracle />
        <div className="gradient-divider-reverse" />
        <LinguisticDNA />
        <div className="gradient-divider" />
        <ImpossibleRhythm />
        <div className="gradient-divider-reverse" />
        <SoundArchitecture />
        <div className="gradient-divider" />
        <HiddenSymmetry />
        <div className="gradient-divider-reverse" />
        <SevenLayers />
        <div className="gradient-divider" />
        <ScientificSigns />
        <div className="gradient-divider-reverse" />
        <HistoricalProof />
        <div className="gradient-divider" />
        <LivingPreservation />
        <div className="gradient-divider-reverse" />
        <ZeroRedundancy />
        <div className="gradient-divider" />
        <Highlights />
        <div className="gradient-divider-reverse" />
        <Conclusion />
      </main>
      <Footer />
    </LanguageProvider>
  );
}
