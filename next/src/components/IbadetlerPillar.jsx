'use client';
// İbadetler shared pillar layout — spec §3.2 + §5.1 + §5.2.
// 7 tab yapısı (Genel / Semantik / Ayet Grupları / Mimari / Peygamberler / İçBoyut / Kaynaklar)
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

// Tab defs — visibleTabs data'ya göre filtreler.
const TAB_DEFS = [
  { key: 'genel',         titleTr: 'Genel Bakış',       titleEn: 'Overview',           dataKey: 'genelBakis' },
  { key: 'semantik',      titleTr: 'Semantik Alan',     titleEn: 'Semantic Field',     dataKey: 'kuraniIsimler' },
  { key: 'ayet-gruplari',      titleTr: 'Ana Ayetler',       titleEn: 'Key Verses',         dataKey: 'anaPasajlar' },
  { key: 'ozel-namazlar', titleTr: 'Özel Namazlar',     titleEn: 'Special Prayers',    dataKey: 'ozelNamazlar' },
  { key: 'vakit-mekan',   titleTr: 'Vakit ve Mekân',    titleEn: 'Time and Space',     dataKey: 'vakitMekan' },
  { key: 'kiraat',        titleTr: 'Namazın Sözü',      titleEn: 'The Word of Prayer', dataKey: 'kiraatBoyutu' },
  { key: 'mimari',        titleTr: 'Rakamsal Mimari',   titleEn: 'Numeric Design',     dataKey: 'rakamsalMimari' },
  { key: 'peygamberler',  titleTr: 'Peygamberler',      titleEn: 'Prophets',           dataKey: 'peygamberVaryasyonlari' },
  { key: 'icboyut',       titleTr: 'İç Boyut',          titleEn: 'Inner Dimension',    dataKey: 'icBoyut' },
  { key: 'insan-etkisi',  titleTr: 'İnsan Etkisi',      titleEn: 'Human Impact',       dataKey: 'insanEtkisi' },
  { key: 'kaynaklar',     titleTr: 'Kaynaklar',         titleEn: 'Sources',            dataKey: 'kaynaklar' },
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
              // borderTop/Left/Right = none; borderBottom yalnızca active için gold underline.
              // Not: 'border: none' shorthand YASAK — React strict mode warning tetikler (§UX audit K-01, 2026-07-12).
              borderTop: 'none', borderLeft: 'none', borderRight: 'none',
              borderBottom: activeTab === tab.key ? `2px solid ${COLORS.gold}` : '2px solid transparent',
              background: activeTab === tab.key ? COLORS.goldAlpha15 : 'transparent',
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
    case 'genel':          return <TabGenel          data={pillarData.genelBakis}              language={language} isMobile={isMobile} pillarData={pillarData} />;
    case 'semantik':       return <TabSemantik       data={pillarData.kuraniIsimler}           language={language} isMobile={isMobile} />;
    case 'ayet-gruplari':       return <TabPasajlar       data={pillarData.anaPasajlar}             language={language} isMobile={isMobile} />;
    case 'ozel-namazlar':  return <TabOzelNamazlar   data={pillarData.ozelNamazlar}            language={language} isMobile={isMobile} />;
    case 'vakit-mekan':    return <TabVakitMekan     data={pillarData.vakitMekan}              language={language} isMobile={isMobile} />;
    case 'kiraat':         return <TabKiraat         data={pillarData.kiraatBoyutu}            language={language} isMobile={isMobile} />;
    case 'mimari':         return <TabMimari         data={pillarData.rakamsalMimari}          language={language} isMobile={isMobile} />;
    case 'peygamberler':   return <TabPeygamberler   data={pillarData.peygamberVaryasyonlari} language={language} isMobile={isMobile} />;
    case 'icboyut':        return <TabIcBoyut        data={pillarData.icBoyut}                 language={language} isMobile={isMobile} />;
    case 'insan-etkisi':   return <TabInsanEtkisi    data={pillarData.insanEtkisi}             language={language} isMobile={isMobile} />;
    case 'kaynaklar':      return <SourcesCitation   language={language}                       isMobile={isMobile} sources={pillarData.kaynaklar} />;
    default:               return null;
  }
}

// ─── Küçük ortak parça: ClaimTypeBadge ────────────────────────────────────
function ClaimTypeBadge({ claimType, confidence, language, small = true }) {
  const style = IBADET_CLAIM_TYPE_STYLES[claimType];
  if (!style) return null;
  const confStyle = IBADET_CONFIDENCE_STYLES[confidence];
  const CONF_LABELS = {
    high:   { tr: 'Yüksek güvenlik', en: 'High confidence' },
    medium: { tr: 'Orta güvenlik',   en: 'Medium confidence' },
    low:    { tr: 'Düşük güvenlik',  en: 'Low confidence' },
  };
  const confTitle = CONF_LABELS[confidence]?.[language] ?? '';
  return (
    <span
      title={confTitle || undefined}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: small ? '3px 9px' : '5px 12px',
        background: `${style.color}18`,
        border: `1px solid ${style.color}55`,
        borderRadius: '10px',
        color: style.color,
        fontSize: small ? '0.62rem' : '0.7rem',
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        opacity: confStyle?.opacity ?? 1,
        flexShrink: 0,
      }}
    >
      {language === 'tr' ? style.labelTr : style.labelEn}
    </span>
  );
}

// ─── Ref chip listesi — comma-separated yerine görsel pill ───────────────
function RefChips({ refs }) {
  if (!refs?.length) return null;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
      {refs.map((r, i) => (
        <span key={i} style={{
          display: 'inline-flex', alignItems: 'center',
          padding: '3px 10px',
          background: 'rgba(212,165,116,0.10)',
          border: `1px solid ${COLORS.goldAlpha25}`,
          borderRadius: '10px',
          color: COLORS.gold,
          fontSize: '0.68rem',
          fontWeight: 600,
          letterSpacing: '0.08em',
          whiteSpace: 'nowrap',
        }}>{r}</span>
      ))}
    </div>
  );
}

// ─── Tab 1: Genel Bakış ───────────────────────────────────────────────────
function TabGenel({ data, language, isMobile, pillarData }) {
  if (!data) return null;
  const terms = pillarData?.kuraniIsimler ?? [];

  // Extract verse refs mentioned in intro (Turkish surah names + N:M)
  const introText = language === 'tr' ? (data.introTr ?? '') : (data.introEn ?? '');
  const refPattern = /(?:Bakara|Fâtiha|Fatiha|Nisa|Nisâ|Nisâ'|Maide|Mâide|En'âm|A'râf|Enfâl|Tevbe|Yûnus|Hûd|Yûsuf|Ra'd|İbrahim|Hicr|Nahl|İsra|İsrâ|Kehf|Meryem|Tâhâ|Enbiyâ|Hac|Mü'minûn|Nûr|Furkan|Şuarâ|Neml|Kasas|Ankebût|Rûm|Rum|Lokman|Secde|Ahzâb|Sebe|Fâtır|Yâsîn|Sâffât|Sâd|Zümer|Mü'min|Fussilet|Şûrâ|Zuhruf|Duhân|Câsiye|Ahkâf|Muhammed|Fetih|Hucurât|Kâf|Zâriyât|Tûr|Necm|Kamer|Rahmân|Vakıa|Vâkıa|Hadîd|Mücâdele|Mücadele|Haşr|Mümtehine|Saff|Cum'a|Cuma|Münâfikûn|Teğâbün|Talâk|Tahrîm|Tahrim|Mülk|Kalem|Hâkka|Meâric|Nûh|Cin|Müzzemmil|Müddessir|Kıyâme|İnsân|Mürselât|Nebe|Nâziât|Abese|Tekvîr|İnfitâr|Mutaffifîn|İnşikâk|Bürûc|Târık|A'lâ|Ğâşiye|Fecr|Beled|Şems|Leyl|Duhâ|İnşirâh|Tîn|Alak|Kadir|Beyyine|Zilzâl|Âdiyât|Kâri'a|Tekâsür|Asr|Hümeze|Fîl|Kureyş|Mâûn|Kevser|Kâfirûn|Nasr|Tebbet|Leheb|İhlâs|Felak|Nâs)\s+\d+:\d+/g;
  const foundRefs = [...new Set(introText.match(refPattern) ?? [])];

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Intro paragraph — glassmorphism card with gold accent */}
      <div style={{
        position: 'relative',
        padding: isMobile ? '24px 20px 24px 26px' : '32px 32px 28px 40px',
        marginBottom: '36px',
        background: 'linear-gradient(135deg, rgba(212,165,116,0.06) 0%, rgba(255,255,255,0.02) 100%)',
        border: `1px solid ${COLORS.goldAlpha25}`,
        borderRadius: RADIUS.md,
        overflow: 'hidden',
      }}>
        {/* Left vertical gold accent bar */}
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0,
          width: '3px',
          background: `linear-gradient(180deg, ${COLORS.gold} 0%, ${COLORS.gold}44 100%)`,
        }} />

        {/* Eyebrow */}
        <div style={{
          color: COLORS.gold, fontSize: '0.7rem',
          letterSpacing: '0.24em', textTransform: 'uppercase',
          fontWeight: 700, opacity: 0.82,
          marginBottom: '14px',
        }}>{language === 'tr' ? 'Bir Bakışta' : 'At a Glance'}</div>

        {/* Intro text — larger, better line-height */}
        <p style={{
          fontFamily: FONTS.body,
          color: COLORS.offWhite,
          fontSize: isMobile ? '1rem' : '1.06rem',
          lineHeight: 1.9,
          margin: 0,
          letterSpacing: '0.005em',
        }}>{introText}</p>

        {/* Extracted verse refs — inline chip row */}
        {foundRefs.length > 0 && (
          <div style={{
            marginTop: '20px',
            paddingTop: '18px',
            borderTop: `1px dashed ${COLORS.goldAlpha25}`,
            display: 'flex', flexWrap: 'wrap', gap: '6px',
            alignItems: 'center',
          }}>
            <span style={{
              color: COLORS.silver, fontSize: '0.7rem',
              letterSpacing: '0.16em', textTransform: 'uppercase',
              marginRight: '4px', opacity: 0.75,
            }}>{language === 'tr' ? 'Anılan Ayetler' : 'Cited Verses'}:</span>
            {foundRefs.map((r, i) => (
              <span key={i} style={{
                padding: '3px 10px',
                background: 'rgba(212,165,116,0.10)',
                border: `1px solid ${COLORS.goldAlpha25}`,
                borderRadius: '10px',
                color: COLORS.gold, fontSize: '0.7rem',
                fontWeight: 600, letterSpacing: '0.04em',
                whiteSpace: 'nowrap',
              }}>{r}</span>
            ))}
          </div>
        )}
      </div>

      {/* Semantik Alan Haritası — chip grid (auto-derive from kuraniIsimler) */}
      {terms.length > 0 && (
        <div style={{
          padding: isMobile ? '20px 18px' : '26px 28px',
          background: 'linear-gradient(135deg, rgba(212,165,116,0.05) 0%, rgba(255,255,255,0.02) 100%)',
          border: `1px solid ${COLORS.goldAlpha25}`,
          borderRadius: RADIUS.md,
          marginBottom: '36px',
        }}>
          <div style={{
            display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap',
            marginBottom: '18px',
          }}>
            <div style={{
              color: COLORS.gold, fontSize: '0.72rem',
              letterSpacing: '0.2em', textTransform: 'uppercase',
              opacity: 0.85, fontWeight: 700,
            }}>{language === 'tr' ? 'Semantik Alan Haritası' : 'Semantic Field Map'}</div>
            <div style={{
              color: COLORS.silver, fontSize: '0.75rem', fontStyle: 'italic', opacity: 0.7,
            }}>{language === 'tr' ? `${terms.length} terim` : `${terms.length} terms`}</div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {terms.map((t, i) => (
              <div key={i} style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '6px 12px 6px 10px',
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid ${COLORS.goldAlpha25}`,
                borderRadius: '999px',
                transition: 'background 0.15s',
              }}>
                <span style={{
                  fontFamily: FONTS.quran, color: COLORS.gold,
                  fontSize: '1rem', direction: 'rtl', lineHeight: 1,
                }} lang="ar">{t.ar}</span>
                <span style={{
                  color: COLORS.offWhite, fontSize: '0.78rem',
                  fontWeight: 600, letterSpacing: '0.02em',
                }}>{language === 'tr' ? (t.termTr ?? t.term) : (t.termEn ?? t.term)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Points — numbered visual cards */}
      {(data.keyPoints ?? []).length > 0 && (
        <div style={{
          display: 'grid', gap: '14px',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(340px, 1fr))',
        }}>
          {data.keyPoints.map((kp, i) => (
            <div key={i} style={{
              display: 'flex', gap: '16px',
              padding: '20px 22px',
              border: `1px solid ${COLORS.glassBorderSoft}`,
              borderRadius: RADIUS.md,
              background: 'rgba(255,255,255,0.03)',
              alignItems: 'flex-start',
            }}>
              <div style={{
                flexShrink: 0,
                width: '32px', height: '32px',
                borderRadius: '50%',
                background: COLORS.goldAlpha15,
                border: `1px solid ${COLORS.goldAlpha25}`,
                color: COLORS.gold,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: FONTS.display,
                fontSize: '0.95rem', fontWeight: 700,
              }}>{i + 1}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
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
                  fontSize: '0.92rem',
                  lineHeight: 1.7,
                }}>
                  {language === 'tr' ? kp.descTr : kp.descEn}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Kategori renk map — semantik terimleri görsel olarak grupla
const CATEGORY_STYLES = {
  'core-name':   { color: '#d4a574', labelTr: 'Ana İsim',       labelEn: 'Core Name' },
  'action':      { color: '#22d3ee', labelTr: 'Eylem',          labelEn: 'Action' },
  'state':       { color: '#a855f7', labelTr: 'Hâl',            labelEn: 'State' },
  'inner-state': { color: '#8b5cf6', labelTr: 'İç Hâl',         labelEn: 'Inner State' },
  'time':        { color: '#3498db', labelTr: 'Vakit',          labelEn: 'Time' },
  'concept':     { color: '#94a3b8', labelTr: 'Kavram',         labelEn: 'Concept' },
  'purpose':     { color: '#e8c98a', labelTr: 'Amaç',           labelEn: 'Purpose' },
  'warning':     { color: '#e74c3c', labelTr: 'Uyarı',          labelEn: 'Warning' },
};

// ─── Tab 2: Kur'ânî Semantik Alan ─────────────────────────────────────────
function TabSemantik({ data, language, isMobile }) {
  if (!data?.length) return null;

  // Kategori sayımı → filter chip'leri için
  const categories = [...new Set(data.map(t => t.kategori).filter(Boolean))];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <p style={{
        color: COLORS.silver,
        fontFamily: FONTS.body,
        fontSize: '0.92rem',
        lineHeight: 1.7,
        marginBottom: '20px',
        maxWidth: '760px',
      }}>
        {language === 'tr'
          ? "Kur'ân'da tek isimle değil, birbirini tamamlayan bir kavram alanıyla anlatılır. Her terim ibadetin farklı bir boyutunu — eylem, zaman, iç hâl — işaret eder."
          : 'Described not by a single word but by a complementary semantic field. Each term points to a different dimension — action, time, inner state.'}
      </p>

      {/* Kategori legenda */}
      {categories.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '28px' }}>
          {categories.map(cat => {
            const cs = CATEGORY_STYLES[cat];
            if (!cs) return null;
            return (
              <span key={cat} style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '3px 10px',
                background: `${cs.color}15`,
                border: `1px solid ${cs.color}44`,
                borderRadius: '999px',
                color: cs.color, fontSize: '0.68rem',
                fontWeight: 700, letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: cs.color, display: 'inline-block' }} />
                {language === 'tr' ? cs.labelTr : cs.labelEn}
              </span>
            );
          })}
        </div>
      )}

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
  const catStyle = CATEGORY_STYLES[term.kategori];
  return (
    <div style={{
      padding: '22px',
      border: `1px solid ${catStyle ? `${catStyle.color}44` : COLORS.goldAlpha25}`,
      borderRadius: RADIUS.md,
      background: catStyle
        ? `linear-gradient(180deg, ${catStyle.color}08 0%, rgba(255,255,255,0.02) 100%)`
        : 'rgba(212,165,116,0.03)',
      position: 'relative',
    }}>
      {/* Kategori badge */}
      {catStyle && (
        <span style={{
          position: 'absolute', top: '14px', right: '14px',
          padding: '2px 8px',
          background: `${catStyle.color}18`,
          border: `1px solid ${catStyle.color}44`,
          borderRadius: '999px',
          color: catStyle.color, fontSize: '0.6rem',
          fontWeight: 700, letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}>{language === 'tr' ? catStyle.labelTr : catStyle.labelEn}</span>
      )}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap', marginBottom: '14px', paddingRight: catStyle ? '60px' : '0' }}>
        <h3 style={{
          fontFamily: FONTS.quran,
          fontSize: '1.8rem',
          color: catStyle?.color ?? COLORS.gold,
          margin: 0,
          direction: 'rtl',
          lineHeight: 1,
        }} lang="ar">{term.ar}</h3>
        <span style={{ fontFamily: FONTS.display, color: COLORS.offWhite, fontSize: '1.15rem', fontWeight: 700 }}>{language === 'tr' ? (term.termTr ?? term.term) : (term.termEn ?? term.term)}</span>
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

// ─── Tab 3: Ana Ayetler + Bağlam Ayetleri ────────────────────────────────
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
            {language === 'tr' ? 'Bağlam Ayetleri' : 'Contextual Verses'}
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
              padding: '16px 20px',
              background: 'linear-gradient(180deg, rgba(212,165,116,0.04) 0%, rgba(255,255,255,0.02) 100%)',
              border: `1px solid ${COLORS.goldAlpha25}`,
              borderRadius: RADIUS.md,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
                <div style={{
                  fontFamily: FONTS.display, color: COLORS.gold,
                  fontWeight: 700, fontSize: '1.1rem',
                }}>{p.prophet}</div>
                <span style={{
                  padding: '2px 8px',
                  background: 'rgba(212,165,116,0.10)',
                  border: `1px solid ${COLORS.goldAlpha25}`,
                  borderRadius: '10px',
                  color: COLORS.gold, fontSize: '0.66rem',
                  fontWeight: 600, letterSpacing: '0.08em',
                }}>{p.ref}</span>
                {p.claimType && <ClaimTypeBadge claimType={p.claimType} confidence={p.confidence} language={language} />}
              </div>
              <div style={{ color: COLORS.offWhite, fontSize: '0.93rem', lineHeight: 1.75 }}>
                {language === 'tr' ? p.sceneTr : (p.sceneEn ?? p.sceneTr)}
              </div>
              {p.auditGuardTr && (
                <div style={{
                  marginTop: '10px',
                  padding: '8px 12px',
                  background: 'rgba(255,255,255,0.03)',
                  borderLeft: `2px solid ${COLORS.silver}`,
                  color: COLORS.silver,
                  fontSize: '0.78rem',
                  lineHeight: 1.6,
                  fontStyle: 'italic',
                }}>{p.auditGuardTr}</div>
              )}
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
          <RefChips refs={item.refs} />
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

// ─── Tab: Özel Namazlar ─────────────────────────────────────────────────
function TabOzelNamazlar({ data, language, isMobile }) {
  if (!data?.length) return null;
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <p style={{
        color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.92rem',
        lineHeight: 1.7, marginBottom: '36px', maxWidth: '760px',
      }}>
        {language === 'tr'
          ? "Kur'ân'ın kendi metnine tutunan özel namaz kategorileri: Cuma, Havf, Cenaze, Bayram, Teheccüd. Her biri için Kur'ânî delil ve sünnet-i mütevâtire tafsili birlikte."
          : 'Special prayer categories anchored in the Qur\'anic text: Jumuʿah, Fear, Funeral, Eid, Tahajjud. For each: Qur\'anic evidence and mutawātir sunnah detail together.'}
      </p>
      <div style={{ display: 'grid', gap: '24px' }}>
        {data.map((n, i) => (
          <div key={i} style={{
            padding: isMobile ? '22px 20px' : '28px 32px',
            border: `1px solid ${COLORS.goldAlpha25}`,
            borderRadius: RADIUS.md,
            background: 'linear-gradient(180deg, rgba(212,165,116,0.04) 0%, rgba(255,255,255,0.02) 100%)',
          }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', flexWrap: 'wrap', marginBottom: '14px' }}>
              <h3 style={{
                fontFamily: FONTS.display, color: COLORS.gold,
                fontSize: isMobile ? '1.25rem' : '1.45rem',
                margin: 0, fontWeight: 700,
              }}>{language === 'tr' ? n.titleTr : (n.titleEn ?? n.titleTr)}</h3>
              {n.arabicName && (
                <span style={{
                  fontFamily: FONTS.quran, color: COLORS.gold, fontSize: '1.35rem',
                  opacity: 0.85, direction: 'rtl',
                }} lang="ar" dir="rtl">{n.arabicName}</span>
              )}
              {n.claimType && <ClaimTypeBadge claimType={n.claimType} confidence={n.confidence} language={language} />}
            </div>

            {/* Kur'ânî Delil */}
            {n.kuraniDelil && (
              <div style={{
                padding: '16px 18px',
                background: 'rgba(0,0,0,0.22)',
                borderLeft: `3px solid ${COLORS.gold}`,
                borderRadius: '0 6px 6px 0',
                marginBottom: '18px',
              }}>
                <div style={{
                  color: COLORS.gold, fontSize: '0.68rem',
                  letterSpacing: '0.18em', textTransform: 'uppercase',
                  opacity: 0.85, marginBottom: '10px',
                }}>{language === 'tr' ? "Kur'ânî Delil" : 'Qur\'anic Evidence'}</div>
                {n.kuraniDelil.ar && (
                  <div style={{
                    fontFamily: FONTS.quran, color: COLORS.gold,
                    fontSize: 'clamp(1.1rem, 2.2vw, 1.35rem)', lineHeight: 2.1,
                    marginBottom: '10px', direction: 'rtl', textAlign: 'right',
                  }} lang="ar" dir="rtl">{n.kuraniDelil.ar}</div>
                )}
                <p style={{
                  color: COLORS.offWhite, fontSize: '0.93rem',
                  fontStyle: 'italic', margin: '0 0 8px', lineHeight: 1.7,
                }}>"{language === 'tr' ? n.kuraniDelil.trShort : (n.kuraniDelil.enShort ?? n.kuraniDelil.trShort)}"</p>
                <div style={{
                  color: COLORS.silver, fontSize: '0.7rem',
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                }}>— {n.kuraniDelil.ref}</div>
              </div>
            )}

            {/* Açıklama */}
            <p style={{
              color: COLORS.offWhite, fontSize: '0.95rem',
              lineHeight: 1.8, margin: '0 0 18px',
            }}>{language === 'tr' ? n.aciklamaTr : (n.aciklamaEn ?? n.aciklamaTr)}</p>

            {/* Kur'ânî Özellikler */}
            {n.kuraniOzellikler?.length > 0 && (
              <div style={{ marginBottom: '18px' }}>
                <div style={{
                  color: COLORS.gold, fontSize: '0.7rem',
                  letterSpacing: '0.16em', textTransform: 'uppercase',
                  marginBottom: '10px', opacity: 0.85,
                }}>{language === 'tr' ? "Kur'ânî Çerçeve" : 'Qur\'anic Frame'}</div>
                <ul style={{ margin: 0, paddingLeft: '20px', color: COLORS.offWhite, fontSize: '0.9rem', lineHeight: 1.75 }}>
                  {n.kuraniOzellikler.map((k, j) => <li key={j} style={{ marginBottom: '6px' }}>{k}</li>)}
                </ul>
              </div>
            )}

            {/* Sünnet Tafsili */}
            {n.sunnetTafsil && (
              <div style={{
                padding: '12px 16px',
                background: 'rgba(46,204,113,0.06)',
                borderLeft: `3px solid #2ecc71`,
                borderRadius: '0 4px 4px 0',
                marginBottom: '14px',
              }}>
                <div style={{
                  color: '#2ecc71', fontSize: '0.68rem',
                  letterSpacing: '0.18em', textTransform: 'uppercase',
                  marginBottom: '6px', opacity: 0.9,
                }}>{language === 'tr' ? 'Sünnet-i Mütevâtire Tafsili' : 'Mutawātir Sunnah Detail'}</div>
                <p style={{
                  color: COLORS.offWhite, fontSize: '0.88rem',
                  lineHeight: 1.75, margin: 0,
                }}>{language === 'tr' ? n.sunnetTafsil : (n.sunnetTafsilEn ?? n.sunnetTafsil)}</p>
              </div>
            )}

            {n.kaynak && (
              <div style={{
                color: COLORS.silver, fontSize: '0.75rem',
                fontStyle: 'italic', marginTop: '10px',
              }}>— {n.kaynak}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Tab: Vakit ve Mekân ─────────────────────────────────────────────────
function TabVakitMekan({ data, language, isMobile }) {
  if (!data) return null;
  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', display: 'grid', gap: '48px' }}>
      {data.vakitEkseni && <VakitEkseniSection section={data.vakitEkseni} language={language} isMobile={isMobile} />}
      {data.kibleHikayesi && <KibleHikayesiSection section={data.kibleHikayesi} language={language} isMobile={isMobile} />}
    </div>
  );
}

function VakitEkseniSection({ section, language, isMobile }) {
  return (
    <div>
      <h3 style={{
        fontFamily: FONTS.display, color: COLORS.gold,
        fontSize: isMobile ? '1.3rem' : '1.55rem',
        margin: '0 0 12px', fontWeight: 700,
      }}>{language === 'tr' ? section.titleTr : (section.titleEn ?? section.titleTr)}</h3>
      <p style={{ color: COLORS.silver, fontSize: '0.95rem', lineHeight: 1.75, marginBottom: '24px' }}>
        {language === 'tr' ? section.introTr : (section.introEn ?? section.introTr)}
      </p>
      {section.anaAyet && <VerseCard ayah={section.anaAyet} language={language} isMobile={isMobile} />}
      {section.sozlukselAcilim?.length > 0 && (
        <div style={{ marginTop: '28px', display: 'grid', gap: '14px' }}>
          {section.sozlukselAcilim.map((s, i) => (
            <div key={i} style={{
              padding: '18px 22px',
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${COLORS.glassBorderSoft}`,
              borderRadius: RADIUS.md,
            }}>
              <div style={{
                fontFamily: FONTS.quran, color: COLORS.gold,
                fontSize: '1.4rem', direction: 'rtl',
                marginBottom: '10px', lineHeight: 1.6,
              }} lang="ar" dir="rtl">{s.kelime}</div>
              <p style={{ color: COLORS.offWhite, fontSize: '0.92rem', lineHeight: 1.75, margin: '0 0 8px' }}>
                {language === 'tr' ? s.anlamTr : (s.anlamEn ?? s.anlamTr)}
              </p>
              {s.kaynak && (
                <div style={{ color: COLORS.silver, fontSize: '0.72rem', fontStyle: 'italic' }}>
                  — {s.kaynak}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {section.notTr && (
        <div style={{
          marginTop: '20px',
          padding: '14px 18px',
          background: 'rgba(255,255,255,0.02)',
          borderRadius: RADIUS.md,
          color: COLORS.silver,
          fontSize: '0.85rem',
          lineHeight: 1.7,
          fontStyle: 'italic',
        }}>{language === 'tr' ? section.notTr : (section.notEn ?? section.notTr)}</div>
      )}
    </div>
  );
}

function KibleHikayesiSection({ section, language, isMobile }) {
  return (
    <div>
      <h3 style={{
        fontFamily: FONTS.display, color: COLORS.gold,
        fontSize: isMobile ? '1.3rem' : '1.55rem',
        margin: '0 0 12px', fontWeight: 700,
      }}>{language === 'tr' ? section.titleTr : (section.titleEn ?? section.titleTr)}</h3>
      <p style={{ color: COLORS.silver, fontSize: '0.95rem', lineHeight: 1.75, marginBottom: '24px' }}>
        {language === 'tr' ? section.introTr : (section.introEn ?? section.introTr)}
      </p>
      {/* Pasaj — vertical connected timeline */}
      {section.pasaj?.length > 0 && (
        <div style={{ position: 'relative', marginBottom: '28px' }}>
          <div style={{
            position: 'absolute',
            left: isMobile ? '11px' : '15px',
            top: '20px', bottom: '20px',
            width: '2px',
            background: `linear-gradient(180deg, ${COLORS.gold}, ${COLORS.gold}33)`,
          }} />
          <div style={{ display: 'grid', gap: '16px', paddingLeft: isMobile ? '32px' : '40px' }}>
            {section.pasaj.map((p, i) => (
              <div key={i} style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  left: isMobile ? '-32px' : '-40px',
                  top: '10px',
                  width: isMobile ? '24px' : '30px',
                  height: isMobile ? '24px' : '30px',
                  borderRadius: '50%',
                  background: COLORS.gold,
                  color: COLORS.cosmicBlack,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: '0.7rem',
                  border: `2px solid ${COLORS.cosmicBlack}`,
                  boxShadow: `0 0 0 2px ${COLORS.gold}55`,
                }}>{i + 1}</div>
                <VerseCard ayah={p} language={language} isMobile={isMobile} />
              </div>
            ))}
          </div>
        </div>
      )}
      {section.aciklamaTr && (
        <div style={{
          padding: '18px 22px',
          background: 'rgba(212,165,116,0.06)',
          borderLeft: `3px solid ${COLORS.gold}`,
          borderRadius: '0 4px 4px 0',
          marginBottom: '14px',
        }}>
          <p style={{ color: COLORS.offWhite, fontSize: '0.93rem', lineHeight: 1.8, margin: 0 }}>
            {language === 'tr' ? section.aciklamaTr : (section.aciklamaEn ?? section.aciklamaTr)}
          </p>
        </div>
      )}
      {section.kaynak && (
        <div style={{ color: COLORS.silver, fontSize: '0.78rem', fontStyle: 'italic' }}>
          — {section.kaynak}
        </div>
      )}
    </div>
  );
}

// ─── Tab: Kıraat Boyutu ─────────────────────────────────────────────────
function TabKiraat({ data, language, isMobile }) {
  if (!data) return null;
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <p style={{
        color: COLORS.silver, fontSize: '0.95rem', lineHeight: 1.75,
        marginBottom: '32px', maxWidth: '760px',
      }}>{language === 'tr' ? data.introTr : (data.introEn ?? data.introTr)}</p>
      <div style={{ display: 'grid', gap: '22px' }}>
        {(data.unsurlar ?? []).map((u, i) => (
          <div key={i} style={{
            padding: isMobile ? '20px 18px' : '26px 30px',
            border: `1px solid ${COLORS.goldAlpha25}`,
            borderRadius: RADIUS.md,
            background: 'rgba(212,165,116,0.03)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
              <h3 style={{
                fontFamily: FONTS.display, color: COLORS.gold,
                fontSize: isMobile ? '1.15rem' : '1.3rem',
                margin: 0, fontWeight: 700,
              }}>{language === 'tr' ? u.titleTr : (u.titleEn ?? u.titleTr)}</h3>
              {u.claimType && <ClaimTypeBadge claimType={u.claimType} confidence={u.confidence} language={language} />}
            </div>
            <RefChips refs={u.refs} />
            {u.anaAyet && (
              <div style={{ marginBottom: '16px' }}>
                <VerseCard ayah={u.anaAyet} language={language} isMobile={isMobile} />
              </div>
            )}
            <p style={{
              color: COLORS.offWhite, fontSize: '0.93rem',
              lineHeight: 1.8, margin: '0 0 10px',
            }}>{language === 'tr' ? u.descTr : (u.descEn ?? u.descTr)}</p>
            {u.kaynak && (
              <div style={{ color: COLORS.silver, fontSize: '0.75rem', fontStyle: 'italic' }}>
                — {u.kaynak}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Tab: İnsan Etkisi ─────────────────────────────────────────────────
function TabInsanEtkisi({ data, language, isMobile }) {
  if (!data?.length) return null;
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <p style={{
        color: COLORS.silver, fontSize: '0.95rem', lineHeight: 1.75,
        marginBottom: '32px', maxWidth: '760px',
      }}>
        {language === 'tr'
          ? "Namazın Kur'ânî vaadi soyut bir eylem değildir. Ayetler namazın ahlâk, iç dünya, sosyal doku ve zorluk anlarındaki insana yansımasını açıkça anar."
          : 'The Qur\'anic promise of prayer is not an abstract ritual. Verses explicitly name prayer\'s reflection on ethics, inner life, social fabric, and moments of hardship.'}
      </p>
      <div style={{ display: 'grid', gap: '22px' }}>
        {data.map((k, i) => (
          <div key={i} style={{
            padding: isMobile ? '22px 20px' : '28px 32px',
            border: `1px solid ${COLORS.glassBorderSoft}`,
            borderRadius: RADIUS.md,
            background: 'linear-gradient(180deg, rgba(212,165,116,0.03) 0%, rgba(255,255,255,0.02) 100%)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
              <h3 style={{
                fontFamily: FONTS.display, color: COLORS.gold,
                fontSize: isMobile ? '1.2rem' : '1.35rem',
                margin: 0, fontWeight: 700,
              }}>{language === 'tr' ? k.titleTr : (k.titleEn ?? k.titleTr)}</h3>
              {k.claimType && <ClaimTypeBadge claimType={k.claimType} confidence={k.confidence} language={language} />}
            </div>
            <RefChips refs={k.refs} />
            {k.anaAyet && (
              <div style={{ marginBottom: '16px' }}>
                <VerseCard ayah={k.anaAyet} language={language} isMobile={isMobile} />
              </div>
            )}
            <p style={{
              color: COLORS.offWhite, fontSize: '0.94rem',
              lineHeight: 1.8, margin: '0 0 14px',
            }}>{language === 'tr' ? k.descTr : (k.descEn ?? k.descTr)}</p>
            {k.modernIzlerTr && (
              <div style={{
                padding: '12px 16px',
                background: 'rgba(255,255,255,0.03)',
                borderLeft: `2px solid ${COLORS.silver}`,
                borderRadius: '0 4px 4px 0',
                marginBottom: '10px',
              }}>
                <div style={{
                  color: COLORS.silver, fontSize: '0.68rem',
                  letterSpacing: '0.18em', textTransform: 'uppercase',
                  marginBottom: '6px', opacity: 0.8,
                }}>{language === 'tr' ? 'Modern İzler' : 'Modern Traces'}</div>
                <p style={{
                  color: COLORS.offWhite, fontSize: '0.87rem',
                  lineHeight: 1.75, margin: 0, fontStyle: 'italic',
                }}>{language === 'tr' ? k.modernIzlerTr : (k.modernIzlerEn ?? k.modernIzlerTr)}</p>
              </div>
            )}
            {k.kaynak && (
              <div style={{ color: COLORS.silver, fontSize: '0.75rem', fontStyle: 'italic' }}>
                — {k.kaynak}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
