// Home — Yeni iskelet (2026-06-15 gece, 13 kart taşıma sonrası):
//   Hero → SixGates → 3 cluster (14 kart) → İnteraktif Araçlar → Kapanış
// PathCards + AllTopics + ToolsShowcase kaldırıldı (redundant — SixGates bunları konsolide eder).

import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import Hero from '@/components/Hero';

// Navigasyon
import SixGates from '@/sections/SixGates';
import CardSeam from '@/sections/CardSeam';
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

      {/* ─── Hayranlık cluster — dil ve mimari (6 kart) ─── */}
      <MukattaaCard />
      <CardSeam />
      <RitimCard />
      <CardSeam />
      <RetorikSorularCard />
      <CardSeam />
      <SesMimarisiCard />
      <CardSeam />
      <HalkaCard />
      <CardSeam />
      <TekrarCard />
      <CardSeam variant="seal" />

      {/* ─── Hayret cluster — bilim ve tarih (3 kart) ─── */}
      <BilimselCard />
      <CardSeam />
      <TarihselCard />
      <CardSeam />
      <KorumaCard />
      <CardSeam variant="seal" />

      {/* ─── İçe Bakış cluster — insan ve Yaratıcı (5 kart) ─── */}
      <DuaDiliCard />
      <CardSeam />
      <AltiKonuCard />
      <CardSeam />
      <AllahKendiniTanitir />
      <CardSeam />
      <InsanTanimiCard />
      <CardSeam />
      <PsikolojiCard />
      {/* Cluster seal kaldırıldı — ToolsHighlight kendi ✦ filigree seam'iyle başlıyor (SectionWrapper),
          aksi takdirde iki ayıraç üst üste binar. */}

      {/* ─── İnteraktif Araçlar (anlatı sonrası teknik katman) ───
          NOT: ClusterHeader kaldırıldı — ToolsHighlight kendi zengin başlığı
          ile geliyor (eyebrow + h2 + alt + 6 grid + "tüm araçları gör" CTA). */}
      <ToolsHighlight />

      {/* Kapanış */}
      <Conclusion />
      <TefekkurHighlight compact />
      <Footer />
    </>
  );
}
