// Home — 13 tanıtıcı kart + 3 navigasyon + kapanış.
// Anasayfa anlatı bölümleri tool sayfalarına AYNEN taşındı; burada kart kapı.
// Hedef tool sayfaları için bkz. /arac/{slug} + /atlas/{slug}.

import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import Hero from '@/components/Hero';
import PathCards from '@/sections/PathCards';
import AllTopics from '@/sections/AllTopics';
import ToolsHighlight from '@/sections/ToolsHighlight';
import TefekkurHighlight from '@/sections/TefekkurHighlight';

// 13 tanıtıcı kart (anlatı bölümleri → tool sayfasına yönlendiren portal)
import MukattaaCard from '@/sections/MukattaaCard';
import RitimCard from '@/sections/RitimCard';
import RetorikSorularCard from '@/sections/RetorikSorularCard';
import DuaDiliCard from '@/sections/DuaDiliCard';
import SesMimarisiCard from '@/sections/SesMimarisiCard';
import HalkaCard from '@/sections/HalkaCard';
import BilimselCard from '@/sections/BilimselCard';
import TarihselCard from '@/sections/TarihselCard';
import KorumaCard from '@/sections/KorumaCard';
import TekrarCard from '@/sections/TekrarCard';
import AltiKonuCard from '@/sections/AltiKonuCard';
import InsanTanimiCard from '@/sections/InsanTanimiCard';
import PsikolojiCard from '@/sections/PsikolojiCard';

// Esmâ köprüsü (zaten kapı formunda — kart pattern'ı ile uyumlu)
import AllahKendiniTanitir from '@/sections/AllahKendiniTanitir';

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

      {/* Navigasyon katmanı (mevcut — SixGates ileride bunları konsolide edecek) */}
      <PathCards />
      <AllTopics />
      <ToolsHighlight />

      {/* ─── Anlatı kartları (Fascination cluster) ─── */}
      <MukattaaCard />
      <RitimCard />
      <RetorikSorularCard />
      <SesMimarisiCard />
      <HalkaCard />
      <TekrarCard />

      {/* ─── Anlatı kartları (Astonishment cluster) ─── */}
      <BilimselCard />
      <TarihselCard />
      <KorumaCard />

      {/* ─── Anlatı kartları (Reflection cluster) ─── */}
      <DuaDiliCard />
      <AltiKonuCard />
      <AllahKendiniTanitir />
      <InsanTanimiCard />
      <PsikolojiCard />

      {/* Kapanış katmanı */}
      <ToolsShowcase />
      <Conclusion />
      <TefekkurHighlight compact />
      <Footer />
    </>
  );
}
