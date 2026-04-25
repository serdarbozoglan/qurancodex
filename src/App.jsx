import { lazy, Suspense } from 'react';
import { LanguageProvider } from './i18n/LanguageContext';
// v1.2 — path-aware navigation (sticky breadcrumb walks the user through
// a curated sequence of sections / overlays)
import { PathProvider } from './contexts/PathContext';
import PathBreadcrumb from './components/PathBreadcrumb';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ChapterProgress from './components/ChapterProgress';
import Footer from './components/Footer';

// Below-fold discovery layer — deferred to shrink the initial bundle.
const PathCards = lazy(() => import('./sections/PathCards'));
const AllTopics = lazy(() => import('./sections/AllTopics'));
const ToolsHighlight = lazy(() => import('./sections/ToolsHighlight'));
const ToolsBrowser = lazy(() => import('./components/ToolsBrowser'));

// Lazy-loaded long-form content sections — not needed for initial paint.
// Each section is ~5-30KB; deferring them cuts the main bundle significantly.
const LinguisticDNA = lazy(() => import('./sections/LinguisticDNA'));
const ImpossibleRhythm = lazy(() => import('./sections/ImpossibleRhythm'));
const QuranRhetoric = lazy(() => import('./sections/QuranRhetoric'));
const QuranDua = lazy(() => import('./sections/QuranDua'));
const SoundArchitecture = lazy(() => import('./sections/SoundArchitecture'));
const PsychologySection = lazy(() => import('./sections/PsychologySection'));
const HiddenArchitecture = lazy(() => import('./sections/HiddenArchitecture'));
const ScientificSigns = lazy(() => import('./sections/ScientificSigns'));
const HistoricalProof = lazy(() => import('./sections/HistoricalProof'));
const LivingPreservation = lazy(() => import('./sections/LivingPreservation'));
const ZeroRedundancy = lazy(() => import('./sections/ZeroRedundancy'));
const Highlights = lazy(() => import('./sections/Highlights'));
const HumanDefinition = lazy(() => import('./sections/HumanDefinition'));
const ToolsShowcase = lazy(() => import('./sections/ToolsShowcase'));
const Conclusion = lazy(() => import('./sections/Conclusion'));

export default function App() {
  return (
    <LanguageProvider>
      <PathProvider>
        <Navbar />
        <ChapterProgress />
        <main>
          {/* Hero */}
          <Hero />

          {/* ── v1.1 discovery layer ───────────────────────────────────────
              Hero ve PathCards her ikisi de cosmic-black zeminli — D-10
              gradient bridge'i (cosmic→navy) burada zemin farkı olmadığı
              için fantom lacivert bant üretiyordu. Kaldırıldı. */}
          <Suspense fallback={null}>
            <PathCards />
            <AllTopics />
            <ToolsHighlight />
          </Suspense>

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
          <Suspense fallback={null}>
            {/* ToolsHighlight (cosmic) → LinguisticDNA (cosmic): aynı zemin, bridge phantom — kaldırıldı */}
            <LinguisticDNA />
            <div className="gradient-divider" />
            <ImpossibleRhythm />
            <div className="gradient-divider-reverse" />
            <SoundArchitecture />
            <QuranRhetoric />
            <div className="gradient-divider" />
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
            {/* Highlights (navy) → HumanDefinition (navy): aynı zemin, bridge phantom — kaldırıldı */}
            <HumanDefinition />
            <div className="gradient-divider-reverse" />
            <PsychologySection />
            <div className="gradient-divider" />
            <QuranDua />
            <div className="gradient-divider-reverse" />
            <ToolsShowcase />
            {/* ToolsShowcase (cosmic) → Conclusion (cosmic): aynı zemin, bridge phantom — kaldırıldı */}
            <Conclusion />
          </Suspense>
        </main>
        <Footer />
        {/* Tools browser modal — opens via openOverlay('allTools') from anywhere */}
        <Suspense fallback={null}><ToolsBrowser /></Suspense>
        {/* v1.2 — sticky bottom path-mode breadcrumb (renders nothing when inactive) */}
        <PathBreadcrumb />
      </PathProvider>
    </LanguageProvider>
  );
}
