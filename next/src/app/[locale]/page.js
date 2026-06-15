// Home — Yeni iskelet (2026-06-15 gece, 13 kart taşıma sonrası):
//   Hero → SixGates → 3 cluster (14 kart) → İnteraktif Araçlar → Kapanış
// PathCards + AllTopics + ToolsShowcase kaldırıldı (redundant — SixGates bunları konsolide eder).

import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import Hero from '@/components/Hero';

// Navigasyon
import SixGates from '@/sections/SixGates';
import ClusterHeader from '@/sections/ClusterHeader';
import ToolsHighlight from '@/sections/ToolsHighlight';
import TefekkurHighlight from '@/sections/TefekkurHighlight';

// 14 tanıtıcı kart (anlatı bölümleri → tool sayfasına yönlendiren portal)
import MukattaaCard from '@/sections/MukattaaCard';
import RitimCard from '@/sections/RitimCard';
import RetorikSorularCard from '@/sections/RetorikSorularCard';
import SesMimarisiCard from '@/sections/SesMimarisiCard';
import HalkaCard from '@/sections/HalkaCard';
import TekrarCard from '@/sections/TekrarCard';
import BilimselCard from '@/sections/BilimselCard';
import TarihselCard from '@/sections/TarihselCard';
import KorumaCard from '@/sections/KorumaCard';
import DuaDiliCard from '@/sections/DuaDiliCard';
import AltiKonuCard from '@/sections/AltiKonuCard';
import AllahKendiniTanitir from '@/sections/AllahKendiniTanitir';
import InsanTanimiCard from '@/sections/InsanTanimiCard';
import PsikolojiCard from '@/sections/PsikolojiCard';

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

      {/* 6 Kapı — kategorize edici navigasyon */}
      <SixGates />

      {/* ─── Fascination cluster ─── */}
      <ClusterHeader
        eyebrowTr="FASCINATION · DİL VE MİMARİ"
        eyebrowEn="FASCINATION · LANGUAGE & ARCHITECTURE"
        titleTr="Görünmeyen Mimari"
        titleEn="The Invisible Architecture"
        subtitleTr="14 harf · 16 vezin · ses · halka · refrain — Kur'an'ın yapısal parmak izi"
        subtitleEn="14 letters · 16 meters · sound · ring · refrain — the Quran's structural fingerprint"
      />
      <MukattaaCard />
      <RitimCard />
      <RetorikSorularCard />
      <SesMimarisiCard />
      <HalkaCard />
      <TekrarCard />

      {/* ─── Astonishment cluster ─── */}
      <ClusterHeader
        eyebrowTr="ASTONISHMENT · BİLİM VE TARİH"
        eyebrowEn="ASTONISHMENT · SCIENCE & HISTORY"
        titleTr="1.400 Yıl Önce"
        titleEn="Fourteen Centuries Earlier"
        subtitleTr="Kevnî işaretler · tarihsel kanıtlar · yaşayan koruma — modern ile paralellikler ve sınırlar"
        subtitleEn="Cosmic signs · historical proofs · living preservation — parallels and limits with modernity"
      />
      <BilimselCard />
      <TarihselCard />
      <KorumaCard />

      {/* ─── Reflection cluster ─── */}
      <ClusterHeader
        eyebrowTr="REFLECTION · İNSAN VE YARATICI"
        eyebrowEn="REFLECTION · HUMANITY & CREATOR"
        titleTr="Kur'an Seni Nasıl Tanımlıyor?"
        titleEn="How Does the Quran Define You?"
        subtitleTr="Yakarış · sırlar · isimler · insan · psikoloji — iç dünyanın haritası"
        subtitleEn="Prayer · secrets · names · humanity · psychology — the map of the inner world"
      />
      <DuaDiliCard />
      <AltiKonuCard />
      <AllahKendiniTanitir />
      <InsanTanimiCard />
      <PsikolojiCard />

      {/* ─── İnteraktif Araçlar (anlatı sonrası teknik katman) ─── */}
      <ClusterHeader
        eyebrowTr="ARAÇLAR · İNTERAKTİF KEŞİF"
        eyebrowEn="TOOLS · INTERACTIVE EXPLORATION"
        titleTr="Veriyle Keşfet"
        titleEn="Discover by Data"
        subtitleTr="Ayet graf · kavram ağı · kelime ısı · sûre karşılaştırma · atlas tool'ları"
        subtitleEn="Verse graph · concept network · word heat · sura comparison · atlas tools"
      />
      <ToolsHighlight />

      {/* Kapanış */}
      <Conclusion />
      <TefekkurHighlight compact />
      <Footer />
    </>
  );
}
