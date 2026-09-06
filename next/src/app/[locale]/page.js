// Home — Yeni iskelet (2026-06-15 gece, 13 kart taşıma sonrası):
//   Hero → SixGates → 3 cluster (14 kart) → İnteraktif Araçlar → Kapanış
// PathCards + AllTopics + ToolsShowcase kaldırıldı (redundant — SixGates bunları konsolide eder).

import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import Hero from '@/components/Hero';
import InventoryStrip from '@/sections/InventoryStrip';
import ReadingProgressCard from '@/components/ReadingProgressCard';
import RecentBookmarksStrip from '@/components/RecentBookmarksStrip';
import RecentQueriesStrip from '@/components/RecentQueriesStrip';

// Navigasyon
import SixGates from '@/sections/SixGates';
import ConciergePrompt from '@/sections/ConciergePrompt';
import MethodologyRibbon from '@/sections/MethodologyRibbon';
import CardSeam from '@/sections/CardSeam';
import ClusterWhisper from '@/sections/ClusterWhisper';
import QuietParticles from '@/sections/QuietParticles';
import FeaturedWrap from '@/sections/FeaturedWrap';
import ToolsHighlight from '@/sections/ToolsHighlight';
import TefekkurHighlight from '@/sections/TefekkurHighlight';

// 14 tanıtıcı kart (anlatı bölümleri → tool sayfasına yönlendiren portal)
// ─── Anlatı kartları — 14 dosya yerine tek sunucu bileşeni + veri (P4+P5) ───
// Öncesinde 14 ayrı 'use client' dosyası vardı (2.742 satır, 14 hydration
// adası). Yapı %95 aynıydı; yalnız veri değişiyordu. Bkz. src/data/homeCards.js
import { CATEGORY } from '@/tokens';
import { CARD_BY_ID } from '@/data/homeCards';
import PortalCard from '@/components/PortalCard';
import ScienceTimelineCard from '@/components/ScienceTimelineCard';
import EditorialCard from '@/components/EditorialCard';
import CompactRow from '@/components/CompactRow';
import EsmaTeaser from '@/components/EsmaTeaser';
import ScrollRevealRoot from '@/components/ScrollRevealRoot';
import ProofSection from '@/sections/ProofSection';

import Conclusion from '@/sections/Conclusion';
import Footer from '@/components/Footer';
import MobileSectionChipNav from '@/components/MobileSectionChipNav';
import DesktopSidebarTOC from '@/components/DesktopSidebarTOC';
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
      : "Kur'an'ın gizli mimarisini, sayısal örüntülerini, dilsel DNA'sını ve halka kompozisyonunu interaktif görsellerle keşfedin.",
  });
}

export default async function Home({ params }) {
  const { locale } = await params;
  return (
    <>
      <JsonLd schemas={buildBreadcrumb(locale, '')} />
      <HashAnchorScroll />
      {/* Tek IntersectionObserver — 14 kartın framer-motion adasının yerine */}
      <ScrollRevealRoot />
      <MobileSectionChipNav />
      <DesktopSidebarTOC />
      {/* <ScrollToTopFab /> KALDIRILDI (2026-08-13, P7).
          Sağ altta yüzen ayrı bir "başa dön" düğmesiydi; bölüm rafıyla aynı
          anda ekranda duruyor ve mobilde kart CTA'larının üzerine biniyordu.
          Uzun anlatı sayfalarında dünya standardı breakpoint başına TEK kalıcı
          gezinme ögesidir. İşlev kaybolmadı — "başa dön" artık rafın kendi
          içinde: <MobileSectionChipNav>'de sabit ↑ düğmesi,
          <DesktopSidebarTOC>'ta "↑ BÖLÜMLER" başlığı. */}

      <Hero />

      {/* Envanter şeridi (2026-08-14, B5) — Hero altındaki amaçsız boşluğun
          yerini alır; ziyaretçi kaydırmadan önce sitenin kapsamını görür. */}
      <InventoryStrip locale={locale} />

      {/* Reading Progress — sadece progress varsa render (#175, 2026-07-15) */}
      <div style={{ marginTop: 24 }}>
        <ReadingProgressCard />
      </div>

      {/* Recent Bookmarks — sadece bookmark varsa render (#196, 2026-07-16) */}
      <RecentBookmarksStrip />

      {/* Recent Queries — sadece geçmiş varsa render (2026-07-16) */}
      <RecentQueriesStrip />

      {/* Semantik Concierge — Hero altı cinematic prompt (RAG) */}
      <ConciergePrompt />

      {/* Metodoloji güven şeridi — "örtüşme ≠ kanıt" (GPT-5.2 review A1) */}
      <MethodologyRibbon />

      {/* 6 Kapı — kategorize edici navigasyon */}
      <SixGates />

      {/* ─── Kanıt bölümü (2026-08-13) ───
          Site "görünmeyen mimariyi görünür kılıyoruz" diyordu ama anasayfada
          tek bir görselleştirme yoktu — halka kompozisyonunu ANLATIYOR, hiç
          GÖSTERMİYORDU. Burası tezin sayfada gösterildiği yer.
          Kapılardan HEMEN SONRA: ziyaretçi hangi kapıyı seçeceğine karar
          vermeden önce "burada gerçekten bir şey gösteriliyor mu?" sorusunun
          cevabını görmeli. */}
      <ProofSection locale={locale} />

      {/* ─── Hayranlık cluster — dil ve mimari (6 kart) ───
          P4 ritmi: ÇIPA (feature) → YANKI (medium) → IZGARA (compact ×4).
          Kart sırası ve içeriği değişmedi; yalnız ölçek kademelendi. */}
      <div className="cluster-fascination">
        <QuietParticles />
        <FeaturedWrap locale={locale}>
          <PortalCard card={CARD_BY_ID['mukattaa-card']} locale={locale} />
        </FeaturedWrap>
        <CardSeam />
        <PortalCard card={CARD_BY_ID['ritim-card']} locale={locale} />
        <CardSeam />
        <CompactRow cols={2}>
          <PortalCard card={CARD_BY_ID['retorik-card']} locale={locale} />
          <PortalCard card={CARD_BY_ID['ses-card']} locale={locale} />
          <PortalCard card={CARD_BY_ID['halka-card']} locale={locale} />
          <PortalCard card={CARD_BY_ID['tekrar-card']} locale={locale} />
        </CompactRow>
        <ClusterWhisper
          tr="Yorum çok, örüntü tek."
          en="Many readings, one pattern."
        />
        <CardSeam variant="seal" />
      </div>

      {/* ─── Hayret cluster — bilim ve tarih (3 kart) ─── */}
      <div className="cluster-astonishment">
        <QuietParticles />
        {/* Bu kümede yalnız 3 kart var — araya "medium" bir yankı sığmıyor,
            ritim ÇIPA → IZGARA (×2) olarak kısalıyor. Bilinçli istisna. */}
        <FeaturedWrap locale={locale}>
          <ScienceTimelineCard card={CARD_BY_ID['bilimsel-card']} locale={locale} />
        </FeaturedWrap>
        <CardSeam />
        {/* 2026-08-14 (B1b/B4, mockup turu onaylandı) — "kanıt" kümesi
            (tarihsel izler, koruma zinciri) artık PortalCard'ın ortalı +
            altın çerçeveli panelini DEĞİL, sola dayalı EditorialCard'ı
            kullanıyor. Önceden 2'li CompactRow ızgarasındaydı; dergi
            düzeni dar sütunda çalışmadığı için tam genişliğe alındı. */}
        <EditorialCard card={CARD_BY_ID['tarih-card']} locale={locale} surahNum={10} accent={CATEGORY.blue} />
        <CardSeam />
        <EditorialCard card={CARD_BY_ID['koruma-card']} locale={locale} surahNum={15} accent={CATEGORY.blue} />
        {/* §13.24 (2026-08-13): önceki metin "Bilim bir gün gelir, DOĞRULAR /
            Science ... CONFIRMS" idi. Kural tasdikin öznesini bilim/tarih
            yapmayı ismen yasaklıyor — "Kur'ân haber verir, BİZ tasdik ederiz;
            bulgu tefekküre vesiledir." Sayfa bu kuralı zaten başka yerde
            uyguluyordu (MethodologyRibbon "örtüşme ≠ kanıt"; BilimselCard
            "bu sayfa bir 'bilimsel mucize' iddiası değil"), tek bu cümle
            kendi şeridiyle çelişiyordu. "Tarih ... eğilir" de aynı zaferci
            tonu taşıdığı için birlikte yumuşatıldı. */}
        <ClusterWhisper
          tr="Bulgular örtüşebilir, izler çoğalabilir; hüküm tefekkürün işidir. Metin değişmez."
          en="Findings may align and traces may multiply; the verdict belongs to reflection. The text does not change."
        />
        <CardSeam variant="seal" />
      </div>

      {/* ─── İçe Bakış cluster — insan ve Yaratıcı (5 kart) ─── */}
      <div className="cluster-reflection">
        <QuietParticles />
        {/* Çıpa ortada: "dua → öne çıkanlar → Yaratıcı → insan → nefis"
            anlatı sırası yazarın kurduğu sıra. Kademe uygulanırken kart
            TAŞINMADI; Esmâ köprüsü kümenin ortasında kalıyor. */}
        <PortalCard card={CARD_BY_ID['dua-card']} locale={locale} accent={CATEGORY.emerald} />
        <CardSeam />
        <PortalCard card={CARD_BY_ID['alti-konu-card']} locale={locale} accent={CATEGORY.emerald} />
        <CardSeam />
        <FeaturedWrap locale={locale}>
          <PortalCard
            card={CARD_BY_ID['allah-kendini-tanitir']}
            locale={locale}
            accent={CATEGORY.emerald}
            extra={<EsmaTeaser locale={locale} />}
          />
        </FeaturedWrap>
        <CardSeam />
        <CompactRow>
          <PortalCard card={CARD_BY_ID['insan-tanimi-card']} locale={locale} accent={CATEGORY.emerald} />
          <PortalCard card={CARD_BY_ID['psikoloji-card']} locale={locale} accent={CATEGORY.emerald} />
        </CompactRow>
        <ClusterWhisper
          tr="Senden önce seni bilen, senden öte sana yakın olan."
          en="He who knew you before you knew yourself, and is nearer to you than you are to yourself."
          verse={{
            arabic: 'وَلَقَدْ خَلَقْنَا الْاِنْسَانَ وَنَعْلَمُ مَا تُوَسْوِسُ بِهِ نَفْسُهُ وَنَحْنُ اَقْرَبُ اِلَيْهِ مِنْ حَبْلِ الْوَرِيدِ',
            translationTr: 'Andolsun, insanı biz yarattık ve nefsinin kendisine fısıldadıklarını biliriz ve biz ona şah damarından daha yakınız.',
            translationEn: 'And We have already created man and know what his soul whispers to him, and We are closer to him than his jugular vein.',
            referenceTr: 'Kaf 50:16',
            referenceEn: 'Qaf 50:16',
          }}
        />
      </div>

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
