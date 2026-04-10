import { LanguageProvider } from './i18n/LanguageContext';
// v1.2 — path-aware navigation (sticky breadcrumb walks the user through
// a curated sequence of sections / overlays)
import { PathProvider } from './contexts/PathContext';
import PathBreadcrumb from './components/PathBreadcrumb';
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
      <PathProvider>
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

          {/* ── Long-form content ─────────────────────────────────────────
              Order is now path-aware: every discovery path defined in
              src/data/paths.jsx walks its sections strictly downward.
              Two moves vs the original v1.1 order:
                - SoundArchitecture moved up to sit between ImpossibleRhythm
                  and QuranRhetoric, so the Dil path goes
                  linguistic → rhythm → sounds → rhetoric in actual page
                  scroll order (was: linguistic → rhythm → rhetoric →
                  jump-down to sounds).
                - QuranDua moved down to sit between PsychologySection and
                  ToolsShowcase, so the İnsan path goes
                  human-definition → psychology → dua-language → dua(overlay)
                  in actual page scroll order (was: human-definition was
                  9th but its 3rd step dua-language was 4th, forcing a
                  jump up).
              The 3 language sections now form a tight cluster, and the
              3 human/prayer sections form another tight cluster — a small
              narrative win on top of the path-mode fix. */}
          <div className="gradient-divider-reverse" />
          <LinguisticDNA />
          <ImpossibleRhythm />
          <SoundArchitecture />
          <div className="gradient-divider" />
          <QuranRhetoric />
          <div className="gradient-divider-reverse" />
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
          <QuranDua />
          <ToolsShowcase />
          <Conclusion />
        </main>
        <Footer />
        {/* Tools browser modal — opens via openOverlay('allTools') from anywhere */}
        <ToolsBrowser />
        {/* v1.2 — sticky bottom path-mode breadcrumb (renders nothing when inactive) */}
        <PathBreadcrumb />
      </PathProvider>
    </LanguageProvider>
  );
}
