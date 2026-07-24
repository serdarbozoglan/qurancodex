'use client';

// ─── InsanTanimi — 4-Tab Full Tool (Dalga 2.4 · 2026-07-06) ────────────
// Tab 1: Ana Kavramlar — sections/HumanDefinition (existing, preserved)
// Tab 2: İnsan Denklemi — FormulaBox: FITRAT + AKIL + İRADE + VAHY → İSTİKÂMET
// Tab 3: Ulema Yaklaşımları — 6-scholar grid (Râgıb, İbn Kayyim, Râzî, Kurtubî, Gazâlî, İbn Âşûr)
// Tab 4: Kaynaklar — SourcesCitation

import { useEffect, useState } from 'react';
import HumanDefinition from '../sections/HumanDefinition';
import ToolHeader from './ToolHeader';
import CrossToolCTA from './CrossToolCTA';
import SourcesCitation from './SourcesCitation';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS, RADIUS } from '../tokens';
import extData from '../../public/insan-tanimi-ext.json';

const TABS = [
  { id: 'concepts', labelTr: 'Ana Kavramlar', labelEn: 'Core Concepts' },
  { id: 'equation', labelTr: 'İnsan Denklemi', labelEn: 'Human Equation' },
  { id: 'scholars', labelTr: 'Ulema Yaklaşımları', labelEn: 'Scholar Approaches' },
  { id: 'sources', labelTr: 'Kaynaklar', labelEn: 'Sources' },
];

const GEOMETRIC_PATTERN = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 72 72'>
<g fill='none' stroke='%23d4a574' stroke-width='0.4' opacity='0.5'>
<polygon points='36,8 44,20 60,20 52,32 60,44 44,44 36,56 28,44 12,44 20,32 12,20 28,20' />
<circle cx='36' cy='36' r='10'/></g></svg>`;

export default function InsanTanimi({ onClose }) {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState('concepts');

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 640);
    h();
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  return (
    <div style={{
      background: COLORS.cosmicBlack,
      minHeight: 'calc(100vh - 62px)',
      paddingTop: '62px',
    }}>
      <ToolHeader
        icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21v-2a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v2"/></svg>}
        titleTr="Kur'an'da İnsan — Sizi Nasıl Görüyor?"
        titleEn="Humanity in the Quran — How Does It See You?"
        subtitleTr="4 kavram · 7 vasıf · İnsan denklemi · 6 ulema"
        subtitleEn="4 concepts · 7 traits · Human equation · 6 scholars"
        language={language}
        onClose={onClose}
      />

      {/* Cinematic Hero */}
      <div style={{
        padding: isMobile ? '40px 16px 28px' : '56px 32px 36px',
        background: `linear-gradient(180deg, rgba(212,165,116,0.06) 0%, transparent 100%),
                     url("data:image/svg+xml;utf8,${GEOMETRIC_PATTERN}") repeat`,
        backgroundSize: 'auto, 72px 72px',
        borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: isMobile ? '2.2rem' : '2.6rem',
          color: COLORS.gold, opacity: 0.82,
          fontFamily: FONTS.bismillah,
          marginBottom: '24px', lineHeight: 1.2,
        }} dir="rtl" lang="ar" aria-label="Bismillāh">﷽</div>

        <p dir="rtl" lang="ar" style={{
          fontFamily: FONTS.quran,
          fontSize: 'clamp(1.4rem, 3vw, 2rem)',
          color: COLORS.gold, lineHeight: 2.1,
          margin: '0 0 12px',
          textShadow: `0 0 22px ${COLORS.gold}1f`,
        }}>
          لَقَدْ خَلَقْنَا الْاِنْسَانَ فِٓي اَحْسَنِ تَقْوِيمٍ
        </p>
        <p style={{
          fontFamily: FONTS.display, fontStyle: 'italic',
          color: COLORS.offWhite,
          fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
          lineHeight: 1.65, maxWidth: '660px',
          margin: '0 auto 6px',
        }}>
          "{tr ? "Andolsun, Biz insanı en güzel biçimde yarattık." : "Indeed, We created humanity in the finest of forms."}"
        </p>
        <p style={{
          color: COLORS.silver, fontFamily: FONTS.body,
          fontSize: '0.7rem', letterSpacing: '0.16em', textTransform: 'uppercase',
          opacity: 0.65, marginBottom: '24px',
        }}>— {tr ? "Tîn 95:4" : "at-Tīn 95:4"}</p>

        <div style={{ width: '120px', height: '1px', margin: '20px auto 24px', background: `linear-gradient(90deg, transparent, ${COLORS.gold}aa, transparent)` }} />

        <p style={{
          fontSize: '0.7rem', letterSpacing: '0.3em', textTransform: 'uppercase',
          color: COLORS.gold, opacity: 0.72,
          fontFamily: FONTS.body, fontWeight: 700, marginBottom: '14px',
        }}>
          {tr ? "FIṬRAT + AKIL + İRADE + VAHY = İSTİKÂMET" : "FIṬRA + ʿAQL + IRĀDA + WAḤY = ISTIQĀMA"}
        </p>
        <h1 style={{
          fontFamily: FONTS.display, fontWeight: 700, color: COLORS.offWhite,
          fontSize: isMobile ? 'clamp(1.6rem, 7vw, 2rem)' : 'clamp(2rem, 3.6vw, 2.7rem)',
          lineHeight: 1.2, letterSpacing: '-0.015em', margin: '0 0 12px',
        }}>
          {tr ? "Kur'an'da İnsan — Sizi Nasıl Görüyor?" : "Humanity in the Quran — How Does It See You?"}
        </h1>
        <p style={{
          fontFamily: FONTS.display, fontStyle: 'italic', color: COLORS.gold,
          fontSize: isMobile ? 'clamp(1rem, 4vw, 1.1rem)' : 'clamp(1.05rem, 1.8vw, 1.18rem)',
          margin: 0,
        }}>
          {tr ? "Nefs · fıtrat · halife · imtihan · hilkat" : "Nafs · fiṭra · khalīfa · trial · creation"}
        </p>
      </div>

      {/* Sticky Tab Bar §13.19 */}
      <div id="insan-tab-bar" style={{
        display: 'flex', gap: '2px',
        padding: isMobile ? '0 8px' : '0 16px',
        borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
        background: 'rgb(6, 8, 14)', backgroundColor: 'rgb(6, 8, 14)',
        isolation: 'isolate',
        position: 'sticky', top: '110px', zIndex: 20,
        scrollMarginTop: '120px',
        overflowX: 'auto', scrollbarWidth: 'none', flexShrink: 0,
      }}>
        {TABS.map(tab => {
          const active = activeTab === tab.id;
          return (
            <button key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setTimeout(() => document.getElementById('insan-tab-bar')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
              }}
              style={{
                padding: isMobile ? '14px 14px' : '16px 26px',
                fontSize: isMobile ? '0.7rem' : '0.76rem',
                letterSpacing: '0.14em', textTransform: 'uppercase',
                fontWeight: active ? 700 : 500,
                color: active ? COLORS.gold : COLORS.silver,
                border: 'none',
                borderBottom: active ? `2px solid ${COLORS.gold}` : '2px solid transparent',
                background: active ? COLORS.goldAlpha15 : 'transparent',
                cursor: 'pointer', flexShrink: 0,
                fontFamily: FONTS.body, whiteSpace: 'nowrap',
              }}>
              {tr ? tab.labelTr : tab.labelEn}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'concepts' && <HumanDefinition />}
      {activeTab === 'equation' && <EquationTab tr={tr} isMobile={isMobile} data={extData.insanEquation} />}
      {activeTab === 'scholars' && <ScholarsTab tr={tr} isMobile={isMobile} scholars={extData.scholars} />}
      {activeTab === 'sources' && <SourcesTab language={language} isMobile={isMobile} sources={extData.sources} />}

      {/* Cross-tool CTA */}
      <div style={{ padding: isMobile ? '0 16px 40px' : '0 32px 64px', maxWidth: '1180px', margin: '0 auto' }}>
        <CrossToolCTA
          language={language} isMobile={isMobile}
          links={[
            { href: `/${language}/atlas/nefs-mertebeleri`, titleTr: 'Nefs Mertebeleri', titleEn: 'Stations of the Soul', descTr: "İnsanın iç yolculuğu — emmâreden mutmainneye 7 basamak.", descEn: 'Human inner journey — 7 stations from ammāra to muṭmaʾinna.' },
            { href: `/${language}/atlas/psikoloji`, titleTr: 'İnsan Psikolojisi', titleEn: 'Human Psychology', descTr: 'Kalp, korku, savunma — Kur\'an\'ın iç haritası 9 tab.', descEn: 'Heart, fear, defense — the Qur\'an\'s inner map in 9 tabs.' },
            { href: `/${language}/atlas/kissa`, titleTr: 'Kıssa Atlası', titleEn: 'Story Atlas', descTr: "İnsan denklemi kıssalarda nasıl işler — 25 peygamber.", descEn: 'How the human equation works in stories — 25 prophets.' },
          ]}
        />
      </div>
    </div>
  );
}

// ─── Tab 2: Human Equation ──────────────────────────────────────
function EquationTab({ tr, isMobile, data }) {
  return (
    <div style={{ padding: isMobile ? '28px 16px 60px' : '48px 32px 80px', maxWidth: '1180px', margin: '0 auto' }}>
      <div style={{ maxWidth: '820px', margin: '0 auto 32px', textAlign: 'center' }}>
        <p style={{
          fontSize: '0.7rem', letterSpacing: '0.24em', textTransform: 'uppercase',
          color: COLORS.gold, opacity: 0.72,
          fontFamily: FONTS.body, fontWeight: 700, marginBottom: '14px',
        }}>
          {tr ? "İNSAN DENKLEMİ · 4 ELEMENT" : "THE HUMAN EQUATION · 4 ELEMENTS"}
        </p>
        <p style={{
          color: COLORS.offWhite, fontSize: '0.96rem', lineHeight: 1.75,
          fontFamily: FONTS.body, margin: 0,
        }}>{tr ? data.introTr : data.introEn}</p>
      </div>

      {/* Formula visual */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
        gap: isMobile ? '14px' : '14px',
        marginBottom: '28px',
      }}>
        {data.elements.map((el, i) => (
          <div key={el.id} style={{
            background: `linear-gradient(180deg, ${el.color}15 0%, rgba(255,255,255,0.03) 100%)`,
            border: `1px solid ${el.color}55`,
            borderLeft: `4px solid ${el.color}`,
            borderRadius: RADIUS.md,
            padding: isMobile ? '18px 16px' : '22px 20px',
            position: 'relative',
          }}>
            {/* Element number */}
            <div style={{
              position: 'absolute', top: '10px', right: '14px',
              fontSize: '0.7rem', fontWeight: 700,
              color: el.color, opacity: 0.5,
              fontFamily: FONTS.body,
            }}>0{i + 1}</div>

            <div style={{
              fontFamily: FONTS.display, fontSize: '1.4rem',
              color: el.color, fontWeight: 900, marginBottom: '10px',
            }}>{tr ? el.labelTr : el.labelEn}</div>

            <p style={{
              fontSize: '0.85rem', color: COLORS.offWhite,
              lineHeight: 1.55, margin: '0 0 14px',
              fontFamily: FONTS.body,
            }}>{tr ? el.meaningTr : el.meaningEn}</p>

            <div style={{
              padding: '10px 12px',
              background: 'rgba(0,0,0,0.3)',
              border: `1px solid ${el.color}33`,
              borderRadius: '4px',
              textAlign: 'right',
            }}>
              <p dir="rtl" lang="ar" style={{
                fontFamily: FONTS.quran, fontSize: '1rem',
                color: el.color, lineHeight: 1.9, margin: '0 0 6px',
              }}>{el.arabic}</p>
              <p style={{
                fontFamily: FONTS.display, fontStyle: 'italic',
                fontSize: '0.75rem', color: COLORS.offWhite,
                lineHeight: 1.5, margin: '0 0 4px', textAlign: 'left',
              }}>"{tr ? el.translationTr : el.translationEn}"</p>
              <p style={{
                fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase',
                color: COLORS.silver, opacity: 0.72, margin: 0, textAlign: 'left',
              }}>{tr ? el.refTr : el.refEn}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Arrow */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.72 }}>
          <path d="M12 5v14M5 12l7 7 7-7"/>
        </svg>
      </div>

      {/* Result */}
      <div style={{
        background: `linear-gradient(180deg, ${COLORS.gold}22 0%, ${COLORS.gold}0a 100%)`,
        border: `2px solid ${COLORS.gold}`,
        borderRadius: RADIUS.lg,
        padding: isMobile ? '26px 20px' : '36px 40px',
        textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(circle at center, ${COLORS.gold}22 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />
        <p style={{
          fontSize: '0.7rem', letterSpacing: '0.3em', textTransform: 'uppercase',
          color: COLORS.gold, opacity: 0.9, marginBottom: '10px',
          fontFamily: FONTS.body, fontWeight: 700, position: 'relative',
        }}>{tr ? "SONUÇ" : "RESULT"}</p>
        <div style={{
          fontFamily: FONTS.display, fontSize: isMobile ? '2rem' : '2.5rem',
          color: COLORS.gold, fontWeight: 900, letterSpacing: '-0.01em',
          marginBottom: '10px', position: 'relative',
          textShadow: `0 0 20px ${COLORS.gold}88`,
        }}>{tr ? data.resultTr : data.resultEn}</div>
        <p style={{
          fontFamily: FONTS.body, fontSize: '0.95rem',
          color: COLORS.offWhite, lineHeight: 1.7,
          maxWidth: '640px', margin: '0 auto 20px',
          position: 'relative',
        }}>{tr ? data.resultDescTr : data.resultDescEn}</p>

        <div style={{
          display: 'inline-block',
          padding: '14px 20px',
          background: 'rgba(0,0,0,0.4)',
          border: `1px solid ${COLORS.gold}66`,
          borderRadius: RADIUS.md,
          position: 'relative',
        }}>
          <p dir="rtl" lang="ar" style={{
            fontFamily: FONTS.quran, fontSize: '1.3rem',
            color: COLORS.gold, lineHeight: 2, margin: '0 0 6px',
          }}>{data.resultVerseAr}</p>
          <p style={{
            fontSize: '0.7rem', letterSpacing: '0.16em', textTransform: 'uppercase',
            color: COLORS.silver, opacity: 0.75, margin: 0,
          }}>— {tr ? data.resultVerseRefTr : data.resultVerseRefEn}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Tab 3: Scholars Grid ──────────────────────────────────────
function ScholarsTab({ tr, isMobile, scholars }) {
  return (
    <div style={{ padding: isMobile ? '28px 16px 60px' : '48px 32px 80px', maxWidth: '1180px', margin: '0 auto' }}>
      <div style={{ maxWidth: '820px', margin: '0 auto 32px', textAlign: 'center' }}>
        <p style={{
          fontSize: '0.7rem', letterSpacing: '0.24em', textTransform: 'uppercase',
          color: COLORS.gold, opacity: 0.72,
          fontFamily: FONTS.body, fontWeight: 700, marginBottom: '14px',
        }}>
          {tr ? "İNSAN TANIMINDA 6 SES" : "6 VOICES ON HUMAN NATURE"}
        </p>
        <p style={{
          color: COLORS.offWhite, fontSize: '0.96rem', lineHeight: 1.75,
          fontFamily: FONTS.body, margin: 0,
        }}>
          {tr
            ? "Klasik ve modern tefsir geleneği Kur'ân'ın insan tanımını farklı açılardan derinleştirir: kelime kökleri, denklem yapısı, kelâm sistematiği, fıkhî temellendirme, iç psikoloji ve çağdaş antropoloji ile diyalog."
            : "Classical and modern tafsīr tradition deepens the Qur'ān's definition of humanity from different angles: word etymology, equation structure, kalāmic systematics, juristic foundation, inner psychology, and dialogue with contemporary anthropology."}
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
        gap: isMobile ? '14px' : '18px',
      }}>
        {scholars.map((s, i) => (
          <div key={i} style={{
            background: `linear-gradient(180deg, ${s.color}0e 0%, rgba(255,255,255,0.02) 100%)`,
            border: `1px solid ${s.color}44`,
            borderLeft: `3px solid ${s.color}`,
            borderRadius: RADIUS.md,
            padding: isMobile ? '20px 18px' : '24px 24px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', gap: '8px', flexWrap: 'wrap' }}>
              <div>
                <div style={{
                  fontFamily: FONTS.display, fontSize: '1.1rem',
                  color: s.color, fontWeight: 700,
                  marginBottom: '2px',
                }}>{s.author}</div>
                <div style={{
                  fontSize: '0.82rem', color: COLORS.offWhite,
                  fontStyle: 'italic',
                  fontFamily: FONTS.body,
                }}>{tr ? s.workTr : s.workEn}</div>
              </div>
              <span style={{
                fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase',
                color: s.color, opacity: 0.7,
                fontFamily: FONTS.body, fontWeight: 700, whiteSpace: 'nowrap',
              }}>{s.period}</span>
            </div>
            <p style={{
              fontSize: '0.85rem', color: COLORS.silver,
              lineHeight: 1.65, margin: 0,
              fontFamily: FONTS.body,
            }}>{tr ? s.insightTr : s.insightEn}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Tab 4: Sources ──────────────────────────────────────
function SourcesTab({ language, isMobile, sources }) {
  return (
    <div style={{ padding: isMobile ? '28px 16px 60px' : '48px 32px 80px', maxWidth: '1180px', margin: '0 auto' }}>
      <div style={{ maxWidth: '820px', margin: '0 auto 24px', textAlign: 'center' }}>
        <p style={{
          fontSize: '0.7rem', letterSpacing: '0.24em', textTransform: 'uppercase',
          color: COLORS.gold, opacity: 0.72,
          fontFamily: FONTS.body, fontWeight: 700, marginBottom: '14px',
        }}>
          {language === 'tr' ? "KUR'ÂN'DA İNSAN LİTERATÜRÜ" : "LITERATURE ON HUMAN NATURE IN THE QUR'ĀN"}
        </p>
        <p style={{
          color: COLORS.offWhite, fontSize: '0.96rem', lineHeight: 1.75,
          fontFamily: FONTS.body, margin: 0,
        }}>
          {language === 'tr'
            ? "Kur'ân'ın insan tanımı üzerine kurulmuş klasik ve modern kaynaklar — kelime köklerinden denklem yapısına, fıkıhtan psikolojiye."
            : "Classical and modern sources on the Qur'ān's definition of humanity — from word roots to equation structure, from jurisprudence to psychology."}
        </p>
      </div>
      <SourcesCitation language={language} isMobile={isMobile} sources={sources} />
    </div>
  );
}
