'use client';
// İbadetler shared pillar layout — spec §3.2 + §5.1 + §5.2.
// 7 tab yapısı (Genel / Semantik / Pasajlar / Mimari / Peygamberler / İçBoyut / Kaynaklar)
// + visibleTabs filter (hafif pillar'da boş tab render edilmez)
// + URL query param tab state (deep-linkable)
// + URL fallback (geçersiz ?tab=X → Tab 1)
//
// Cinematic hero: §13.18 pattern (bismillah + anchor + eyebrow + H1 + subtitle)
// Sticky tab bar: §13.19 pattern (opak bg, top:110px, uppercase)
//
// Tab body: Task 7'de ayrı ayrı renderer'lar.

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { COLORS, FONTS, RADIUS, TRANSITION } from '../tokens';
import ToolHeader from './ToolHeader';
import SourcesCitation from './SourcesCitation';

// Tab defs — 7 sabit, visibleTabs data'ya göre filtreler.
const TAB_DEFS = [
  { key: 'genel',        titleTr: 'Genel Bakış',        titleEn: 'Overview',           dataKey: 'genelBakis' },
  { key: 'semantik',     titleTr: 'Semantik Alan',      titleEn: 'Semantic Field',     dataKey: 'kuraniIsimler' },
  { key: 'pasajlar',     titleTr: 'Ana Pasajlar',       titleEn: 'Key Passages',       dataKey: 'anaPasajlar' },
  { key: 'mimari',       titleTr: 'Rakamsal Mimari',    titleEn: 'Numeric Design',     dataKey: 'rakamsalMimari' },
  { key: 'peygamberler', titleTr: 'Peygamberler',       titleEn: 'Prophets',           dataKey: 'peygamberVaryasyonlari' },
  { key: 'icboyut',      titleTr: 'İç Boyut',           titleEn: 'Inner Dimension',    dataKey: 'icBoyut' },
  { key: 'kaynaklar',    titleTr: 'Kaynaklar',          titleEn: 'Sources',            dataKey: 'kaynaklar' },
];

// Data'nın ilgili alanı doldu mu — boş tab render etme.
function hasContent(pillarData, dataKey) {
  const val = pillarData?.[dataKey];
  if (!val) return false;
  if (Array.isArray(val)) return val.length > 0;
  if (typeof val === 'object') {
    // Nested check: anaPasajlar.ayetler[] veya rakamsalMimari.kuraniSide.points[]
    // Boş obje veya sadece string field'lar da "içerik yok" sayılır.
    const values = Object.values(val);
    return values.some(v =>
      (Array.isArray(v) && v.length > 0) ||
      (v && typeof v === 'object' && Object.keys(v).length > 0 &&
       (Array.isArray(v.points) ? v.points.length > 0 : Object.values(v).some(vv => Array.isArray(vv) && vv.length > 0)))
    );
  }
  return String(val).trim().length > 0;
}

export default function IbadetlerPillar({ pillarData, language, isMobile }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const visibleTabs = useMemo(
    () => TAB_DEFS.filter(t => hasContent(pillarData, t.dataKey)),
    [pillarData]
  );

  // URL tab initial
  const requestedTab = searchParams?.get('tab');
  const initialTab = visibleTabs.find(t => t.key === requestedTab) ?? visibleTabs[0];
  const [activeTab, setActiveTab] = useState(initialTab?.key);

  // Aktif tab değişince URL'e yaz (deep-linkable)
  useEffect(() => {
    if (!activeTab) return;
    const currentUrl = searchParams?.get('tab');
    if (currentUrl === activeTab) return;
    const params = new URLSearchParams(searchParams?.toString() ?? '');
    params.set('tab', activeTab);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [activeTab, pathname, router, searchParams]);

  // URL fallback: geçersiz ?tab=X → sessiz redirect
  useEffect(() => {
    if (requestedTab && !visibleTabs.find(t => t.key === requestedTab)) {
      const params = new URLSearchParams(searchParams?.toString() ?? '');
      params.delete('tab');
      const qs = params.toString();
      router.replace(pathname + (qs ? `?${qs}` : ''), { scroll: false });
    }
  }, [requestedTab, visibleTabs, pathname, router, searchParams]);

  if (!visibleTabs.length) {
    return (
      <div style={{ padding: 40, color: COLORS.silver, fontFamily: FONTS.body, textAlign: 'center' }}>
        {language === 'tr' ? 'İçerik hazırlanıyor…' : 'Content coming soon…'}
      </div>
    );
  }

  return (
    <div style={{
      background: COLORS.cosmicBlack,
      minHeight: 'calc(100vh - 62px)',
      display: 'flex',
      flexDirection: 'column',
      paddingTop: '62px',
    }}>
      <ToolHeader
        titleTr={pillarData.titleTr}
        titleEn={pillarData.titleEn}
        subtitleTr={pillarData.hero?.eyebrowTr}
        subtitleEn={pillarData.hero?.eyebrowEn}
        language={language}
      />

      {/* Cinematic Hero — §13.18 */}
      <PillarHero pillarData={pillarData} language={language} isMobile={isMobile} />

      {/* Sticky Tab Bar — §13.19 */}
      <div id="ibadet-tab-bar" style={{
        display: 'flex',
        gap: '2px',
        padding: isMobile ? '0 8px' : '0 16px',
        borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
        background: 'rgb(6, 8, 14)',
        backgroundColor: 'rgb(6, 8, 14)',
        isolation: 'isolate',
        position: 'sticky',
        top: '110px',
        zIndex: 20,
        scrollMarginTop: '120px',
        overflowX: 'auto',
        scrollbarWidth: 'none',
        flexShrink: 0,
      }}>
        {visibleTabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key);
              setTimeout(() => {
                document.getElementById('ibadet-tab-bar')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }, 50);
            }}
            style={{
              padding: isMobile ? '14px 16px' : '16px 26px',
              fontSize: isMobile ? '0.72rem' : '0.78rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              fontWeight: activeTab === tab.key ? 700 : 500,
              color: activeTab === tab.key ? COLORS.gold : COLORS.silver,
              borderBottom: activeTab === tab.key ? `2px solid ${COLORS.gold}` : '2px solid transparent',
              background: activeTab === tab.key ? COLORS.goldAlpha15 : 'transparent',
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: `all ${TRANSITION.fast}`,
              fontFamily: 'inherit',
            }}
          >
            {language === 'tr' ? tab.titleTr : tab.titleEn}
          </button>
        ))}
      </div>

      {/* Tab body */}
      <div style={{
        flex: 1,
        minHeight: 0,
        padding: isMobile ? '20px 16px' : '32px 48px',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
      }}>
        {activeTab && <PillarTabBody tabKey={activeTab} pillarData={pillarData} language={language} isMobile={isMobile} />}
      </div>
    </div>
  );
}

function PillarHero({ pillarData, language, isMobile }) {
  const anchor = pillarData.anchorVerse;
  const hero = pillarData.hero ?? {};
  if (!anchor) return null;
  return (
    <div style={{
      padding: isMobile ? '40px 16px 28px' : '56px 32px 36px',
      background: 'linear-gradient(180deg, rgba(212,165,116,0.06) 0%, transparent 100%)',
      borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
      textAlign: 'center',
    }}>
      {/* Bismillah ornament */}
      <div style={{
        fontFamily: FONTS.arabic,
        fontSize: '1.6rem',
        color: COLORS.gold,
        opacity: 0.82,
        marginBottom: '24px',
      }}>﷽</div>

      {/* Anchor verse — Kur'ânî metin, KFGQPC, gold */}
      <div style={{
        fontFamily: FONTS.quran,
        fontSize: isMobile ? 'clamp(1.2rem, 5vw, 1.6rem)' : 'clamp(1.4rem, 3vw, 2rem)',
        color: COLORS.gold,
        lineHeight: 2.1,
        marginBottom: '20px',
        direction: 'rtl',
        maxWidth: '720px',
        margin: '0 auto 20px',
      }} lang="ar" dir="rtl">
        {anchor.ar}
      </div>

      {/* İtalik çeviri */}
      <p style={{
        fontFamily: FONTS.display,
        fontStyle: 'italic',
        color: COLORS.offWhite,
        maxWidth: '660px',
        margin: '0 auto 12px',
        fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
        lineHeight: 1.6,
      }}>
        "{language === 'tr' ? anchor.tr : anchor.en}"
      </p>

      {/* Reference label */}
      <p style={{
        textTransform: 'uppercase',
        letterSpacing: '0.16em',
        color: COLORS.silver,
        opacity: 0.65,
        fontSize: '0.72rem',
        marginBottom: '28px',
      }}>
        — {language === 'tr' ? anchor.refTr : anchor.refEn}
      </p>

      {/* Filigree divider */}
      <div style={{
        width: '120px',
        height: '1px',
        background: `linear-gradient(90deg, transparent, ${COLORS.gold}, transparent)`,
        margin: '0 auto 24px',
      }} />

      {/* Eyebrow */}
      {(hero.eyebrowTr || hero.eyebrowEn) && (
        <p style={{
          textTransform: 'uppercase',
          letterSpacing: '0.3em',
          color: COLORS.gold,
          opacity: 0.72,
          fontSize: '0.72rem',
          marginBottom: '12px',
        }}>
          {language === 'tr' ? hero.eyebrowTr : hero.eyebrowEn}
        </p>
      )}

      {/* H1 title */}
      <h1 style={{
        fontFamily: FONTS.display,
        color: COLORS.offWhite,
        fontSize: isMobile ? 'clamp(1.6rem, 7vw, 2rem)' : 'clamp(2rem, 3.6vw, 2.7rem)',
        margin: '0 0 12px',
        fontWeight: 700,
      }}>
        {language === 'tr' ? pillarData.titleTr : pillarData.titleEn}
      </h1>

      {/* Dramatic subtitle */}
      {(hero.subtitleTr || hero.subtitleEn) && (
        <p style={{
          fontFamily: FONTS.display,
          fontStyle: 'italic',
          color: COLORS.gold,
          fontSize: 'clamp(1.05rem, 1.8vw, 1.18rem)',
          margin: 0,
        }}>
          {language === 'tr' ? hero.subtitleTr : hero.subtitleEn}
        </p>
      )}
    </div>
  );
}

// PillarTabBody — Task 7'de tab-by-tab renderer'lar eklenecek. Şimdilik placeholder.
function PillarTabBody({ tabKey, pillarData, language, isMobile }) {
  if (tabKey === 'kaynaklar') {
    return <SourcesCitation language={language} isMobile={isMobile} sources={pillarData.kaynaklar} />;
  }
  return (
    <div style={{
      color: COLORS.silver,
      fontFamily: FONTS.body,
      padding: 40,
      textAlign: 'center',
      background: 'rgba(255,255,255,0.03)',
      borderRadius: RADIUS.md,
    }}>
      {language === 'tr'
        ? `[${tabKey}] tab renderer — Task 7'de eklenecek`
        : `[${tabKey}] tab renderer — added in Task 7`}
    </div>
  );
}
