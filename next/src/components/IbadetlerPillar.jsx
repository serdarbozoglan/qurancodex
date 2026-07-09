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
import { COLORS, FONTS, RADIUS, TRANSITION, IBADET_CLAIM_TYPE_STYLES, IBADET_CONFIDENCE_STYLES } from '../tokens';
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

// ─── Tab body dispatcher ──────────────────────────────────────────────────
function PillarTabBody({ tabKey, pillarData, language, isMobile }) {
  switch (tabKey) {
    case 'genel':        return <TabGenel        data={pillarData.genelBakis}              language={language} isMobile={isMobile} />;
    case 'semantik':     return <TabSemantik     data={pillarData.kuraniIsimler}           language={language} isMobile={isMobile} />;
    case 'pasajlar':     return <TabPasajlar     data={pillarData.anaPasajlar}             language={language} isMobile={isMobile} />;
    case 'mimari':       return <TabMimari       data={pillarData.rakamsalMimari}          language={language} isMobile={isMobile} />;
    case 'peygamberler': return <TabPeygamberler data={pillarData.peygamberVaryasyonlari} language={language} isMobile={isMobile} />;
    case 'icboyut':      return <TabIcBoyut      data={pillarData.icBoyut}                 language={language} isMobile={isMobile} />;
    case 'kaynaklar':    return <SourcesCitation language={language}                       isMobile={isMobile} sources={pillarData.kaynaklar} />;
    default:             return null;
  }
}

// ─── Küçük ortak parça: ClaimTypeBadge ────────────────────────────────────
function ClaimTypeBadge({ claimType, confidence, language, small = true }) {
  const style = IBADET_CLAIM_TYPE_STYLES[claimType];
  if (!style) return null;
  const confStyle = IBADET_CONFIDENCE_STYLES[confidence];
  return (
    <span
      title={confStyle ? `Confidence: ${confidence}` : undefined}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: small ? '2px 8px' : '4px 10px',
        background: `${style.color}18`,
        border: `1px solid ${style.color}55`,
        borderRadius: '10px',
        color: style.color,
        fontSize: small ? '0.62rem' : '0.7rem',
        fontWeight: 600,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        opacity: confStyle?.opacity ?? 1,
      }}
    >
      {language === 'tr' ? style.labelTr : style.labelEn}
      {confStyle && <span style={{ fontSize: '0.55rem', opacity: 0.7 }}>{confStyle.icon}</span>}
    </span>
  );
}

// ─── Tab 1: Genel Bakış ───────────────────────────────────────────────────
function TabGenel({ data, language, isMobile }) {
  if (!data) return null;
  return (
    <div style={{ maxWidth: '780px', margin: '0 auto' }}>
      <p style={{
        fontFamily: FONTS.body,
        color: COLORS.offWhite,
        fontSize: '1.05rem',
        lineHeight: 1.85,
        marginBottom: '32px',
      }}>
        {language === 'tr' ? data.introTr : data.introEn}
      </p>
      {(data.keyPoints ?? []).length > 0 && (
        <div style={{ display: 'grid', gap: '16px' }}>
          {data.keyPoints.map((kp, i) => (
            <div key={i} style={{
              padding: '20px 24px',
              border: `1px solid ${COLORS.glassBorderSoft}`,
              borderRadius: RADIUS.md,
              background: 'rgba(255,255,255,0.03)',
            }}>
              <h3 style={{
                color: COLORS.gold,
                fontFamily: FONTS.display,
                fontSize: '1.05rem',
                margin: '0 0 8px',
                fontWeight: 700,
              }}>
                {language === 'tr' ? kp.titleTr : kp.titleEn}
              </h3>
              <p style={{
                color: COLORS.offWhite,
                margin: 0,
                fontSize: '0.95rem',
                lineHeight: 1.75,
              }}>
                {language === 'tr' ? kp.descTr : kp.descEn}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Tab 2: Kur'ânî Semantik Alan ─────────────────────────────────────────
function TabSemantik({ data, language, isMobile }) {
  if (!data?.length) return null;
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <p style={{
        color: COLORS.silver,
        fontFamily: FONTS.body,
        fontSize: '0.92rem',
        lineHeight: 1.7,
        marginBottom: '32px',
        maxWidth: '760px',
      }}>
        {language === 'tr'
          ? "Namaz Kur'ân'da tek isimle değil, birbirini tamamlayan bir kavram alanıyla anlatılır. Her terim namaz pratiğinin farklı bir boyutunu — hareket, zaman, iç durum — işaret eder."
          : 'Prayer in the Qur\'an is described not by a single word but by a complementary semantic field. Each term points to a different dimension — movement, time, inner state.'}
      </p>
      <div style={{
        display: 'grid',
        gap: '20px',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
      }}>
        {data.map((term, i) => (
          <SemanticTermCard key={i} term={term} language={language} isMobile={isMobile} />
        ))}
      </div>
    </div>
  );
}

function SemanticTermCard({ term, language, isMobile }) {
  return (
    <div style={{
      padding: '22px',
      border: `1px solid ${COLORS.goldAlpha25}`,
      borderRadius: RADIUS.md,
      background: 'rgba(212,165,116,0.03)',
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap', marginBottom: '14px' }}>
        <h3 style={{
          fontFamily: FONTS.quran,
          fontSize: '1.8rem',
          color: COLORS.gold,
          margin: 0,
          direction: 'rtl',
          lineHeight: 1,
        }} lang="ar">{term.ar}</h3>
        <span style={{ fontFamily: FONTS.display, color: COLORS.offWhite, fontSize: '1.15rem', fontWeight: 700 }}>{term.term}</span>
        {term.root && (
          <span style={{
            fontFamily: FONTS.body,
            color: COLORS.silver,
            fontSize: '0.72rem',
            letterSpacing: '0.1em',
            padding: '2px 6px',
            background: 'rgba(255,255,255,0.06)',
            borderRadius: '4px',
          }}>
            {term.root}
          </span>
        )}
      </div>
      {term.occurrenceCount?.value != null && (
        <p style={{
          color: COLORS.silver,
          fontSize: '0.78rem',
          margin: '0 0 16px',
          fontStyle: 'italic',
        }}>
          {language === 'tr' ? term.occurrenceCount.displayLabelTr : term.occurrenceCount.displayLabelEn}
        </p>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {(term.anlamKatmanlari ?? []).map((k, i) => (
          <div key={i} style={{
            padding: '10px 12px',
            background: 'rgba(255,255,255,0.03)',
            borderLeft: `2px solid ${COLORS.gold}`,
            borderRadius: '0 4px 4px 0',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
              <div style={{ color: COLORS.gold, fontWeight: 700, fontSize: '0.9rem' }}>{k.layer}</div>
              {k.claimType && <ClaimTypeBadge claimType={k.claimType} confidence={k.confidence} language={language} />}
            </div>
            <div style={{ color: COLORS.offWhite, fontSize: '0.88rem', lineHeight: 1.65 }}>
              {language === 'tr' ? k.descTr : (k.descEn ?? k.descTr)}
            </div>
            {k.kaynak && (
              <div style={{ color: COLORS.silver, fontSize: '0.7rem', fontStyle: 'italic', marginTop: '6px' }}>
                — {k.kaynak}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Tab 3: Ana Pasajlar + Ritüel Bağlam ─────────────────────────────────
function TabPasajlar({ data, language, isMobile }) {
  if (!data) return null;
  const { ayetler = [], rituelBaglam = [] } = data;
  if (!ayetler.length && !rituelBaglam.length) return null;
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {ayetler.length > 0 && (
        <div style={{ marginBottom: rituelBaglam.length ? '48px' : 0 }}>
          <h3 style={{
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: COLORS.gold,
            opacity: 0.8,
            fontSize: '0.72rem',
            marginBottom: '20px',
          }}>
            {language === 'tr' ? 'Ana Ayetler' : 'Key Verses'}
          </h3>
          <div style={{ display: 'grid', gap: '18px' }}>
            {ayetler.map((a, i) => <VerseCard key={i} ayah={a} language={language} isMobile={isMobile} />)}
          </div>
        </div>
      )}
      {rituelBaglam.length > 0 && (
        <div>
          <h3 style={{
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: COLORS.gold,
            opacity: 0.8,
            fontSize: '0.72rem',
            marginBottom: '20px',
          }}>
            {language === 'tr' ? 'Ritüel Bağlam' : 'Ritual Context'}
          </h3>
          <div style={{ display: 'grid', gap: '18px' }}>
            {rituelBaglam.map((r, i) => <VerseCard key={i} ayah={r} language={language} isMobile={isMobile} />)}
          </div>
        </div>
      )}
    </div>
  );
}

function VerseCard({ ayah, language, isMobile }) {
  const noteText = ayah.not ?? ayah.sceneTr;
  return (
    <div style={{
      padding: '22px 24px',
      border: `1px solid ${COLORS.glassBorderSoft}`,
      borderRadius: RADIUS.md,
      background: 'rgba(255,255,255,0.02)',
    }}>
      {ayah.ar && (
        <div style={{
          fontFamily: FONTS.quran,
          fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)',
          color: COLORS.gold,
          lineHeight: 2.1,
          marginBottom: '14px',
          direction: 'rtl',
          textAlign: 'right',
        }} lang="ar" dir="rtl">
          {ayah.ar}
        </div>
      )}
      {(ayah.tr || ayah.en) && (
        <p style={{
          color: COLORS.offWhite,
          fontSize: '0.98rem',
          lineHeight: 1.75,
          margin: '0 0 10px',
          fontStyle: 'italic',
        }}>
          "{language === 'tr' ? (ayah.tr ?? '') : (ayah.en ?? ayah.tr ?? '')}"
        </p>
      )}
      <div style={{
        color: COLORS.silver,
        fontSize: '0.72rem',
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        marginBottom: noteText ? '14px' : 0,
      }}>
        — {ayah.ref}
      </div>
      {noteText && (
        <div style={{
          padding: '10px 14px',
          background: 'rgba(212,165,116,0.06)',
          borderLeft: `2px solid ${COLORS.gold}`,
          marginTop: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: noteText ? '6px' : 0, flexWrap: 'wrap' }}>
            {ayah.claimType && <ClaimTypeBadge claimType={ayah.claimType} confidence={ayah.confidence} language={language} />}
          </div>
          <p style={{ color: COLORS.offWhite, fontSize: '0.88rem', lineHeight: 1.7, margin: 0 }}>
            {noteText}
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Tab 4: Rakamsal Mimari (Kur'ân ↔ Sünnet) ───────────────────────────
function TabMimari({ data, language, isMobile }) {
  if (!data) return null;
  return (
    <div style={{ maxWidth: '950px', margin: '0 auto' }}>
      {data.framingTr && (
        <div style={{
          padding: '18px 22px',
          background: 'rgba(212,165,116,0.06)',
          borderLeft: `3px solid ${COLORS.gold}`,
          borderRadius: '4px',
          marginBottom: '32px',
        }}>
          <p style={{
            color: COLORS.offWhite,
            margin: 0,
            lineHeight: 1.75,
            fontStyle: 'italic',
            fontSize: '0.95rem',
          }}>
            {language === 'tr' ? data.framingTr : (data.framingEn ?? data.framingTr)}
          </p>
        </div>
      )}
      <div style={{
        display: 'grid',
        gap: '20px',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
      }}>
        <SidePanel side={data.kuraniSide} language={language} accent={COLORS.gold} />
        <SidePanel side={data.sunnetSide} language={language} accent="#2ecc71" />
      </div>
      {data.tensionNote && (
        <div style={{
          marginTop: '32px',
          padding: '16px 20px',
          background: 'rgba(255,255,255,0.03)',
          borderRadius: RADIUS.md,
          color: COLORS.silver,
          fontSize: '0.88rem',
          lineHeight: 1.75,
        }}>
          {language === 'tr' ? data.tensionNote : (data.tensionNoteEn ?? data.tensionNote)}
        </div>
      )}
    </div>
  );
}

function SidePanel({ side, language, accent }) {
  if (!side?.points?.length) return null;
  return (
    <div style={{
      padding: '20px',
      border: `1px solid ${accent}44`,
      borderRadius: RADIUS.md,
      background: 'rgba(255,255,255,0.02)',
    }}>
      <h4 style={{
        color: accent,
        fontFamily: FONTS.display,
        fontSize: '1.05rem',
        marginTop: 0,
        marginBottom: '16px',
        fontWeight: 700,
      }}>
        {language === 'tr' ? side.titleTr : (side.titleEn ?? side.titleTr)}
      </h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {side.points.map((p, i) => (
          <div key={i} style={{
            padding: '12px 14px',
            background: 'rgba(0,0,0,0.18)',
            borderRadius: '6px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
              <div style={{ color: accent, fontSize: '0.82rem', fontWeight: 700 }}>{p.label}</div>
              {p.claimType && <ClaimTypeBadge claimType={p.claimType} confidence={p.confidence} language={language} />}
            </div>
            <div style={{ color: COLORS.offWhite, fontSize: '0.95rem', marginTop: '4px', fontWeight: 600 }}>{p.value}</div>
            {p.note && (
              <div style={{ color: COLORS.silver, fontSize: '0.82rem', marginTop: '8px', lineHeight: 1.65 }}>
                {p.note}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Tab 5: Peygamber Varyasyonları — vertical timeline ─────────────────
function TabPeygamberler({ data, language, isMobile }) {
  if (!data?.length) return null;
  return (
    <div style={{ maxWidth: '720px', margin: '0 auto' }}>
      <p style={{
        color: COLORS.silver,
        fontFamily: FONTS.body,
        fontSize: '0.92rem',
        lineHeight: 1.7,
        marginBottom: '32px',
      }}>
        {language === 'tr'
          ? "Aynı ibadetin farklı peygamberlerdeki tezahürü. Katı takvim değil, kulluk mirasının Kur'ân'daki anlatı silsilesi."
          : "The same worship in different prophets. Not a strict timeline but the Qur'an's narrative lineage of worship."}
      </p>
      <div style={{ position: 'relative', paddingLeft: isMobile ? '28px' : '36px' }}>
        {/* Timeline line */}
        <div style={{
          position: 'absolute',
          left: isMobile ? '11px' : '13px',
          top: '10px',
          bottom: '10px',
          width: '2px',
          background: `linear-gradient(180deg, ${COLORS.gold}, ${COLORS.gold}22)`,
        }} />
        {data.map((p, i) => (
          <div key={i} style={{ position: 'relative', marginBottom: '20px' }}>
            {/* Circle badge */}
            <div style={{
              position: 'absolute',
              left: isMobile ? '-28px' : '-36px',
              top: '4px',
              width: isMobile ? '24px' : '28px',
              height: isMobile ? '24px' : '28px',
              borderRadius: '50%',
              background: COLORS.gold,
              color: COLORS.cosmicBlack,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: isMobile ? '0.68rem' : '0.75rem',
              border: `2px solid ${COLORS.cosmicBlack}`,
              boxShadow: `0 0 0 2px ${COLORS.gold}55`,
            }}>{i + 1}</div>

            {/* Card */}
            <div style={{
              padding: '14px 18px',
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${COLORS.glassBorderSoft}`,
              borderRadius: RADIUS.md,
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
                <div style={{ color: COLORS.gold, fontWeight: 700, fontSize: '1rem' }}>{p.prophet}</div>
                <div style={{ color: COLORS.silver, fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{p.ref}</div>
                {p.claimType && <ClaimTypeBadge claimType={p.claimType} confidence={p.confidence} language={language} />}
              </div>
              <div style={{ color: COLORS.offWhite, fontSize: '0.92rem', lineHeight: 1.7 }}>
                {language === 'tr' ? p.sceneTr : (p.sceneEn ?? p.sceneTr)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Tab 6: İç Boyut ────────────────────────────────────────────────────
function TabIcBoyut({ data, language, isMobile }) {
  if (!data?.length) return null;
  return (
    <div style={{
      maxWidth: '1000px',
      margin: '0 auto',
      display: 'grid',
      gap: '18px',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
    }}>
      {data.map((item, i) => (
        <div key={i} style={{
          padding: '20px 22px',
          background: 'rgba(212,165,116,0.04)',
          border: `1px solid ${COLORS.goldAlpha25}`,
          borderRadius: RADIUS.md,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
            <h4 style={{
              color: COLORS.gold,
              fontFamily: FONTS.display,
              fontSize: '1.05rem',
              margin: 0,
              fontWeight: 700,
            }}>
              {item.titleTr}
            </h4>
            {item.claimType && <ClaimTypeBadge claimType={item.claimType} confidence={item.confidence} language={language} />}
          </div>
          {item.refs && (
            <div style={{
              color: COLORS.silver,
              fontSize: '0.7rem',
              letterSpacing: '0.1em',
              marginBottom: '10px',
              textTransform: 'uppercase',
            }}>
              {item.refs.join(' · ')}
            </div>
          )}
          <p style={{
            color: COLORS.offWhite,
            fontSize: '0.92rem',
            lineHeight: 1.75,
            margin: 0,
          }}>
            {item.descTr}
          </p>
          {item.auditGuardTr && (
            <div style={{
              marginTop: '12px',
              padding: '8px 12px',
              background: 'rgba(255,255,255,0.03)',
              borderLeft: `2px solid ${COLORS.silver}`,
              color: COLORS.silver,
              fontSize: '0.78rem',
              lineHeight: 1.6,
              fontStyle: 'italic',
            }}>
              {item.auditGuardTr}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
