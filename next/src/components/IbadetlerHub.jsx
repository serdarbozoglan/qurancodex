'use client';
// İbadetler HUB — 8 pillar landing sayfası
// Cinematic hero + AbdCore radial + wowFacts + 8 pillar grid + kaynaklar
// Namaz "ready", diğer 7 pillar "coming" — click disabled.

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { COLORS, FONTS, RADIUS, TRANSITION, IBADET_CLAIM_TYPE_STYLES } from '../tokens';
import ToolHeader from './ToolHeader';
import SourcesCitation from './SourcesCitation';

export default function IbadetlerHub({ hubData, language, isMobile }) {
  const router = useRouter();
  if (!hubData) return null;

  return (
    <div style={{
      background: COLORS.cosmicBlack,
      minHeight: 'calc(100vh - 62px)',
      display: 'flex',
      flexDirection: 'column',
      paddingTop: '62px',
    }}>
      <ToolHeader
        titleTr={hubData.titleTr}
        titleEn={hubData.titleEn}
        subtitleTr={hubData.hero?.eyebrowTr}
        subtitleEn={hubData.hero?.eyebrowEn}
        language={language}
      />

      <HubHero hubData={hubData} language={language} isMobile={isMobile} />

      <div style={{
        maxWidth: '1200px', margin: '0 auto', width: '100%',
        padding: isMobile ? '20px 16px 60px' : '48px 48px 80px',
      }}>
        <AbdCoreSection abdCore={hubData.abdCore} language={language} isMobile={isMobile} />
        <YolHaritasiSection data={hubData.yolHaritasi} language={language} isMobile={isMobile} router={router} />
        <PillarsGrid pillars={hubData.pillars} language={language} isMobile={isMobile} router={router} />
        <SutunlarAgiSection data={hubData.sutunlarAgi} language={language} isMobile={isMobile} router={router} />
        <KarsilastirmaSection data={hubData.karsilastirma} language={language} isMobile={isMobile} router={router} />
        <ZamanEkseniSection data={hubData.zamanEkseni} language={language} isMobile={isMobile} />
        <PeygamberIzleriSection data={hubData.peygamberIzleri} language={language} isMobile={isMobile} router={router} />
        <OrtakFormullerSection data={hubData.ortakFormuller} language={language} isMobile={isMobile} />
        <FramingNote framingTr={hubData.framingTr} framingEn={hubData.framingEn} language={language} isMobile={isMobile} />
        <WowFactsSection wowFacts={hubData.wowFacts} language={language} isMobile={isMobile} />
        <SourcesCitation language={language} isMobile={isMobile} sources={hubData.kaynaklar} />
      </div>
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────
function HubHero({ hubData, language, isMobile }) {
  const anchor = hubData.anchorVerse;
  const hero = hubData.hero ?? {};
  if (!anchor) return null;
  return (
    <div style={{
      padding: isMobile ? '40px 16px 32px' : '56px 32px 40px',
      background: 'linear-gradient(180deg, rgba(212,165,116,0.07) 0%, transparent 100%)',
      borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
      textAlign: 'center',
    }}>
      <div style={{
        fontFamily: FONTS.arabic, fontSize: '1.7rem',
        color: COLORS.gold, opacity: 0.85, marginBottom: '28px',
      }}>﷽</div>

      <div style={{
        fontFamily: FONTS.quran,
        fontSize: isMobile ? 'clamp(1.3rem, 5.5vw, 1.75rem)' : 'clamp(1.5rem, 3.2vw, 2.15rem)',
        color: COLORS.gold, lineHeight: 2.1,
        marginBottom: '22px', direction: 'rtl',
        maxWidth: '760px', margin: '0 auto 22px',
      }} lang="ar" dir="rtl">{anchor.ar}</div>

      <p style={{
        fontFamily: FONTS.display, fontStyle: 'italic',
        color: COLORS.offWhite, maxWidth: '640px',
        margin: '0 auto 14px',
        fontSize: 'clamp(1.02rem, 1.85vw, 1.18rem)', lineHeight: 1.65,
      }}>"{language === 'tr' ? anchor.tr : anchor.en}"</p>

      <p style={{
        textTransform: 'uppercase', letterSpacing: '0.18em',
        color: COLORS.silver, opacity: 0.7,
        fontSize: '0.75rem', marginBottom: '32px',
      }}>— {language === 'tr' ? anchor.refTr : anchor.refEn}</p>

      <div style={{
        width: '140px', height: '1px',
        background: `linear-gradient(90deg, transparent, ${COLORS.gold}, transparent)`,
        margin: '0 auto 28px',
      }} />

      {(hero.eyebrowTr || hero.eyebrowEn) && (
        <p style={{
          textTransform: 'uppercase', letterSpacing: '0.32em',
          color: COLORS.gold, opacity: 0.78,
          fontSize: '0.75rem', marginBottom: '14px',
        }}>{language === 'tr' ? hero.eyebrowTr : hero.eyebrowEn}</p>
      )}

      <h1 style={{
        fontFamily: FONTS.display, color: COLORS.offWhite,
        fontSize: isMobile ? 'clamp(1.7rem, 7.5vw, 2.15rem)' : 'clamp(2.15rem, 3.8vw, 2.85rem)',
        margin: '0 0 14px', fontWeight: 700,
      }}>{language === 'tr' ? hubData.titleTr : hubData.titleEn}</h1>

      {(hero.subtitleTr || hero.subtitleEn) && (
        <p style={{
          fontFamily: FONTS.display, fontStyle: 'italic',
          color: COLORS.gold, fontSize: 'clamp(1.05rem, 1.9vw, 1.22rem)',
          margin: 0,
        }}>{language === 'tr' ? hero.subtitleTr : hero.subtitleEn}</p>
      )}
    </div>
  );
}

// ─── AbdCore radial — büyük Arapça abd + core ayet ──────────────────────
function AbdCoreSection({ abdCore, language, isMobile }) {
  if (!abdCore) return null;
  return (
    <div style={{
      margin: '20px 0 56px',
      padding: isMobile ? '32px 20px' : '48px 40px',
      background: 'linear-gradient(135deg, rgba(212,165,116,0.06) 0%, rgba(255,255,255,0.02) 100%)',
      border: `1px solid ${COLORS.goldAlpha25}`,
      borderRadius: RADIUS.md,
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '260px 1fr',
      gap: isMobile ? '28px' : '48px',
      alignItems: 'center',
    }}>
      {/* Left: Big Arabic abd + radial rings */}
      <div style={{
        position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        aspectRatio: '1', maxWidth: '260px', margin: '0 auto',
      }}>
        {/* Radial rings */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          border: `1px dashed ${COLORS.goldAlpha25}`,
          animation: 'spin-slow 40s linear infinite',
        }} />
        <div style={{
          position: 'absolute', inset: '14%', borderRadius: '50%',
          border: `1px solid ${COLORS.goldAlpha15}`,
        }} />
        <div style={{
          position: 'absolute', inset: '30%', borderRadius: '50%',
          background: `radial-gradient(circle, ${COLORS.goldAlpha15} 0%, transparent 70%)`,
        }} />
        <div style={{
          position: 'relative', zIndex: 2,
          fontFamily: FONTS.quran,
          fontSize: isMobile ? 'clamp(4rem, 22vw, 6rem)' : 'clamp(4.5rem, 8vw, 6.5rem)',
          color: COLORS.gold, lineHeight: 1,
          direction: 'rtl',
          textShadow: `0 0 40px ${COLORS.goldAlpha25}`,
        }} lang="ar" dir="rtl">{abdCore.arabicName}</div>
      </div>

      {/* Right: text + core ayet */}
      <div>
        <div style={{
          color: COLORS.gold, fontSize: '0.72rem',
          letterSpacing: '0.22em', textTransform: 'uppercase',
          opacity: 0.85, marginBottom: '8px', fontWeight: 700,
        }}>{language === 'tr' ? 'Kök Kelime' : 'Root Word'}</div>
        <h2 style={{
          fontFamily: FONTS.display, color: COLORS.offWhite,
          fontSize: isMobile ? '1.5rem' : '1.85rem',
          margin: '0 0 14px', fontWeight: 700,
        }}>{language === 'tr' ? abdCore.titleTr : abdCore.titleEn}</h2>
        <p style={{
          color: COLORS.offWhite, fontSize: '0.95rem',
          lineHeight: 1.8, margin: '0 0 20px',
        }}>{language === 'tr' ? abdCore.descTr : abdCore.descEn}</p>

        {abdCore.coreAyet && (
          <div style={{
            padding: '14px 18px',
            background: 'rgba(0,0,0,0.24)',
            borderLeft: `3px solid ${COLORS.gold}`,
            borderRadius: '0 6px 6px 0',
          }}>
            <div style={{
              fontFamily: FONTS.quran, color: COLORS.gold,
              fontSize: isMobile ? 'clamp(1.5rem, 5vw, 1.85rem)' : 'clamp(1.75rem, 2.4vw, 2.15rem)',
              lineHeight: 2.15, direction: 'rtl',
              textAlign: 'right', marginBottom: '12px',
            }} lang="ar" dir="rtl">{abdCore.coreAyet.ar}</div>
            <p style={{
              color: COLORS.offWhite, fontSize: '0.88rem',
              fontStyle: 'italic', margin: '0 0 6px', lineHeight: 1.6,
            }}>"{language === 'tr' ? abdCore.coreAyet.trShort : abdCore.coreAyet.enShort}"</p>
            <div style={{
              color: COLORS.silver, fontSize: '0.7rem',
              letterSpacing: '0.14em', textTransform: 'uppercase',
            }}>— {abdCore.coreAyet.ref}</div>
          </div>
        )}

        {abdCore.kaynak && (
          <div style={{
            color: COLORS.silver, fontSize: '0.75rem',
            fontStyle: 'italic', marginTop: '14px',
          }}>— {abdCore.kaynak}</div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// ─── Pillars Grid — 8 kart, hazır olan tıklanır ──────────────────────────
function PillarsGrid({ pillars, language, isMobile, router }) {
  if (!pillars?.length) return null;
  return (
    <div style={{ marginBottom: '56px' }}>
      <div style={{
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '10px',
        marginBottom: '22px',
      }}>
        <h2 style={{
          fontFamily: FONTS.display, color: COLORS.offWhite,
          fontSize: isMobile ? '1.4rem' : '1.75rem',
          margin: 0, fontWeight: 700,
        }}>{language === 'tr' ? 'Sekiz Sütun' : 'The Eight Pillars of Worship'}</h2>
        <div style={{
          color: COLORS.silver, fontSize: '0.78rem',
          fontStyle: 'italic', opacity: 0.75,
        }}>
          {language === 'tr'
            ? `${pillars.filter(p => p.status === 'ready').length}/${pillars.length} hazır — kalanı hazırlanıyor`
            : `${pillars.filter(p => p.status === 'ready').length}/${pillars.length} ready — others coming soon`}
        </div>
      </div>
      <div style={{
        display: 'grid', gap: isMobile ? '14px' : '18px',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))',
      }}>
        {pillars.map(p => (
          <PillarCard key={p.id} pillar={p} language={language} isMobile={isMobile} router={router} />
        ))}
      </div>
    </div>
  );
}

function PillarCard({ pillar, language, isMobile, router }) {
  const isReady = pillar.status === 'ready';
  const handleClick = () => {
    if (isReady && pillar.href) {
      router.push(`/${language}${pillar.href}`);
    }
  };
  return (
    <button
      onClick={handleClick}
      disabled={!isReady}
      aria-label={`${language === 'tr' ? pillar.titleTr : pillar.titleEn} · ${isReady ? (language === 'tr' ? 'Hazır — sayfaya git' : 'Ready — go to page') : (language === 'tr' ? 'Yakında' : 'Coming soon')}`}
      style={{
        display: 'flex', flexDirection: 'column',
        padding: isMobile ? '22px 20px' : '24px 24px',
        border: `1px solid ${isReady ? COLORS.goldAlpha25 : COLORS.glassBorderSoft}`,
        borderRadius: RADIUS.md,
        background: isReady
          ? 'linear-gradient(180deg, rgba(212,165,116,0.06) 0%, rgba(255,255,255,0.02) 100%)'
          : 'rgba(255,255,255,0.02)',
        cursor: isReady ? 'pointer' : 'not-allowed',
        textAlign: 'left',
        transition: `all ${TRANSITION.fast}`,
        opacity: isReady ? 1 : 0.62,
        fontFamily: 'inherit',
        position: 'relative',
      }}
      onMouseEnter={e => {
        if (!isReady) return;
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.background = 'linear-gradient(180deg, rgba(212,165,116,0.11) 0%, rgba(255,255,255,0.04) 100%)';
      }}
      onMouseLeave={e => {
        if (!isReady) return;
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.background = 'linear-gradient(180deg, rgba(212,165,116,0.06) 0%, rgba(255,255,255,0.02) 100%)';
      }}
    >
      {/* Status badge — sadece "Yakında" durumunda göster; hazır olanlar için işaret gereksiz */}
      {!isReady && (
        <div style={{
          position: 'absolute', top: '14px', right: '14px',
          padding: '3px 9px',
          background: 'rgba(148,163,184,0.15)',
          border: `1px solid rgba(148,163,184,0.25)`,
          borderRadius: '999px',
          color: COLORS.silver,
          fontSize: '0.6rem', fontWeight: 700,
          letterSpacing: '0.14em', textTransform: 'uppercase',
        }}>
          {language === 'tr' ? 'Yakında' : 'Soon'}
        </div>
      )}

      {/* Big Arabic name */}
      <div style={{
        fontFamily: FONTS.quran, color: COLORS.gold,
        fontSize: '2rem', lineHeight: 1.4,
        direction: 'rtl', textAlign: 'right',
        marginBottom: '12px',
      }} lang="ar" dir="rtl">{pillar.arabicName}</div>

      {/* Title */}
      <h3 style={{
        fontFamily: FONTS.display,
        color: isReady ? COLORS.offWhite : COLORS.silver,
        fontSize: '1.35rem', margin: '0 0 6px', fontWeight: 700,
      }}>{language === 'tr' ? pillar.titleTr : pillar.titleEn}</h3>

      {/* Domain */}
      {pillar.domain && (
        <div style={{
          color: COLORS.gold, fontSize: '0.68rem',
          letterSpacing: '0.16em', textTransform: 'uppercase',
          opacity: 0.75, marginBottom: '12px',
        }}>{language === 'tr' ? pillar.domain : (pillar.domainEn ?? pillar.domain)}</div>
      )}

      {/* Description */}
      <p style={{
        color: COLORS.offWhite, opacity: 0.85,
        fontSize: '0.88rem', lineHeight: 1.65,
        margin: '0 0 14px', flex: 1,
      }}>{language === 'tr' ? pillar.shortDescTr : (pillar.shortDescEn ?? pillar.shortDescTr)}</p>

      {/* Anchor ref + CTA */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: '10px', flexWrap: 'wrap',
      }}>
        {pillar.anchorRef && (
          <div style={{
            color: COLORS.silver, fontSize: '0.7rem',
            fontStyle: 'italic', opacity: 0.7,
          }}>{pillar.anchorRef}</div>
        )}
        {isReady && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            color: COLORS.gold, fontSize: '0.75rem',
            fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>{language === 'tr' ? 'Keşfet' : 'Explore'} →</div>
        )}
      </div>
    </button>
  );
}

// ─── Framing note ─────────────────────────────────────────────────────────
function FramingNote({ framingTr, framingEn, language, isMobile }) {
  if (!framingTr && !framingEn) return null;
  return (
    <div style={{
      marginBottom: '56px',
      padding: isMobile ? '20px 22px' : '26px 32px',
      background: 'rgba(212,165,116,0.06)',
      borderLeft: `3px solid ${COLORS.gold}`,
      borderRadius: '0 6px 6px 0',
    }}>
      <div style={{
        color: COLORS.gold, fontSize: '0.68rem',
        letterSpacing: '0.2em', textTransform: 'uppercase',
        marginBottom: '10px', opacity: 0.85, fontWeight: 700,
      }}>{language === 'tr' ? 'Bu HUB nedir, ne değildir?' : 'What this HUB is, and is not'}</div>
      <p style={{
        color: COLORS.offWhite, fontSize: '0.92rem',
        lineHeight: 1.8, margin: 0, fontStyle: 'italic',
      }}>{language === 'tr' ? framingTr : (framingEn ?? framingTr)}</p>
    </div>
  );
}

// ─── Sütunlar Ağı — 8 sütun frequency network ─────────────────────────────
function SutunlarAgiSection({ data, language, isMobile, router }) {
  if (!data?.nodes?.length) return null;
  const maxFreq = Math.max(...data.nodes.map(n => n.freq));
  return (
    <div style={{ marginBottom: '56px' }}>
      <h2 style={{
        fontFamily: FONTS.display, color: COLORS.offWhite,
        fontSize: isMobile ? '1.4rem' : '1.75rem',
        margin: '0 0 8px', fontWeight: 700,
      }}>{language === 'tr' ? data.titleTr : (data.titleEn ?? data.titleTr)}</h2>
      <p style={{ color: COLORS.silver, fontSize: '0.95rem', lineHeight: 1.7, margin: '0 0 24px', maxWidth: '760px' }}>
        {language === 'tr' ? data.introTr : (data.introEn ?? data.introTr)}
      </p>
      <div style={{
        display: 'grid', gap: '10px',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(320px, 1fr))',
      }}>
        {data.nodes.map((n, i) => {
          const pct = (n.freq / maxFreq) * 100;
          return (
            <button key={i}
              onClick={() => router.push(`/${language}${n.id === 'dua' ? '/arac/dualar' : `/atlas/ibadetler/${n.id}`}`)}
              style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                padding: '14px 16px',
                border: `1px solid ${COLORS.goldAlpha25}`,
                borderRadius: RADIUS.md,
                background: 'rgba(255,255,255,0.03)',
                cursor: 'pointer', fontFamily: 'inherit',
                textAlign: 'left', transition: `all ${TRANSITION.fast}`,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,165,116,0.08)'; e.currentTarget.style.transform = 'translateX(2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.transform = 'translateX(0)'; }}
            >
              <div style={{
                fontFamily: FONTS.quran, color: COLORS.gold,
                fontSize: '1.5rem', direction: 'rtl', minWidth: '80px', textAlign: 'right',
              }} lang="ar">{n.ar}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '6px' }}>
                  <span style={{ color: COLORS.offWhite, fontWeight: 700, fontSize: '0.95rem' }}>{n.labelTr}</span>
                  <span style={{ color: COLORS.silver, fontSize: '0.7rem', letterSpacing: '0.1em' }}>{n.root}</span>
                </div>
                {/* Frequency bar */}
                <div style={{ position: 'relative', height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{
                    position: 'absolute', top: 0, left: 0, bottom: 0,
                    width: `${pct}%`,
                    background: `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.gold}88)`,
                    borderRadius: '2px',
                  }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '0.7rem', color: COLORS.silver }}>
                  <span>~{n.freq} {language === 'tr' ? 'geçiş' : 'occurrences'}</span>
                  <span style={{ opacity: 0.7 }}>{n.period} · {n.anchorRef}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      {data.notTr && (
        <p style={{
          color: COLORS.silver, fontSize: '0.78rem',
          fontStyle: 'italic', marginTop: '16px', opacity: 0.75,
        }}>{language === 'tr' ? data.notTr : (data.notEn ?? data.notTr)}</p>
      )}
    </div>
  );
}

// ─── Yol Haritası — Nereden Başlamalı? 3 önerilen yolculuk ──────────────
function YolHaritasiSection({ data, language, isMobile, router }) {
  if (!data?.yollar?.length) return null;
  const tr = language === 'tr';
  const [active, setActive] = useState(0);

  return (
    <div style={{ marginBottom: '48px' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <p style={{
          color: COLORS.gold, fontSize: '0.72rem',
          letterSpacing: '0.28em', textTransform: 'uppercase',
          fontWeight: 700, opacity: 0.85, marginBottom: '10px',
        }}>{tr ? 'YOLCULUK ÖNERİLERİ' : 'SUGGESTED JOURNEYS'}</p>
        <h2 style={{
          fontFamily: FONTS.display, color: COLORS.offWhite,
          fontSize: isMobile ? '1.5rem' : '1.85rem',
          margin: '0 0 10px', fontWeight: 700,
        }}>{tr ? data.titleTr : (data.titleEn ?? data.titleTr)}</h2>
        <p style={{
          color: COLORS.silver, fontSize: '0.95rem',
          lineHeight: 1.7, margin: 0, maxWidth: '680px',
          marginLeft: 'auto', marginRight: 'auto',
        }}>{tr ? data.introTr : (data.introEn ?? data.introTr)}</p>
      </div>

      {/* Tab pills */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '10px',
        justifyContent: 'center', marginBottom: '20px',
      }}>
        {data.yollar.map((y, i) => (
          <button key={y.id}
            onClick={() => setActive(i)}
            aria-pressed={active === i}
            style={{
              padding: '10px 18px',
              background: active === i ? COLORS.goldAlpha15 : 'rgba(255,255,255,0.03)',
              border: `1px solid ${active === i ? COLORS.gold : COLORS.glassBorderSoft}`,
              borderRadius: '999px',
              color: active === i ? COLORS.gold : COLORS.silver,
              fontSize: '0.82rem', fontWeight: 700,
              letterSpacing: '0.06em', cursor: 'pointer',
              fontFamily: 'inherit', display: 'inline-flex',
              alignItems: 'center', gap: '8px', transition: 'all 0.15s',
            }}
          >
            <span aria-hidden="true" style={{ fontSize: '1.05rem' }}>{y.iconTr}</span>
            <span>{tr ? y.titleTr : (y.titleEn ?? y.titleTr)}</span>
          </button>
        ))}
      </div>

      {/* Active journey — steps */}
      {data.yollar[active] && (
        <div style={{
          padding: isMobile ? '22px 20px' : '28px 32px',
          background: 'linear-gradient(180deg, rgba(212,165,116,0.05) 0%, rgba(255,255,255,0.02) 100%)',
          border: `1px solid ${COLORS.goldAlpha25}`,
          borderRadius: RADIUS.md,
        }}>
          <p style={{
            color: COLORS.silver, fontSize: '0.9rem',
            lineHeight: 1.65, margin: '0 0 20px', fontStyle: 'italic',
            maxWidth: '760px',
          }}>{tr ? data.yollar[active].descTr : (data.yollar[active].descEn ?? data.yollar[active].descTr)}</p>

          <ol style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            {data.yollar[active].adimlar.map((s, i) => (
              <li key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: '14px',
                padding: '12px 14px',
                marginBottom: '8px',
                background: 'rgba(255,255,255,0.02)',
                border: `1px solid ${COLORS.glassBorderSoft}`,
                borderRadius: RADIUS.md,
                cursor: 'pointer', transition: 'all 0.15s',
              }}
                onClick={() => { if (s.href) router.push(`/${language}${s.href}`); }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,165,116,0.06)'; e.currentTarget.style.transform = 'translateX(3px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.transform = 'translateX(0)'; }}
              >
                <div style={{
                  flexShrink: 0,
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: COLORS.goldAlpha15,
                  border: `1px solid ${COLORS.goldAlpha25}`,
                  color: COLORS.gold,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: FONTS.display, fontWeight: 700, fontSize: '0.85rem',
                }}>{i + 1}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    color: COLORS.offWhite, fontWeight: 600,
                    fontSize: '0.9rem', marginBottom: '4px',
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                  }}>
                    {(tr ? s.labelTr : (s.labelEn ?? s.labelTr)).replace(/^\d+\.\s*/, '')}
                    <span style={{ color: COLORS.gold, fontSize: '0.85rem' }} aria-hidden="true">→</span>
                  </div>
                  {(tr ? s.hintTr : (s.hintEn ?? s.hintTr)) && (
                    <div style={{
                      color: COLORS.silver, fontSize: '0.78rem',
                      lineHeight: 1.5, fontStyle: 'italic', opacity: 0.85,
                    }}>{tr ? s.hintTr : (s.hintEn ?? s.hintTr)}</div>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

// ─── Karşılaştırma Tablosu — 8 sütun bir bakışta ──────────────────────────
function KarsilastirmaSection({ data, language, isMobile, router }) {
  if (!data?.rows?.length) return null;
  const tr = language === 'tr';
  return (
    <div style={{ marginBottom: '56px' }}>
      <h2 style={{
        fontFamily: FONTS.display, color: COLORS.offWhite,
        fontSize: isMobile ? '1.4rem' : '1.75rem',
        margin: '0 0 8px', fontWeight: 700,
      }}>{tr ? data.titleTr : (data.titleEn ?? data.titleTr)}</h2>
      <p style={{ color: COLORS.silver, fontSize: '0.95rem', lineHeight: 1.7, margin: '0 0 24px', maxWidth: '860px' }}>
        {tr ? data.introTr : (data.introEn ?? data.introTr)}
      </p>

      {/* Desktop: table, Mobile: stacked cards */}
      {isMobile ? (
        <div style={{ display: 'grid', gap: '12px' }}>
          {data.rows.map(r => (
            <div key={r.id} style={{
              padding: '16px 18px',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
              border: `1px solid ${COLORS.goldAlpha25}`,
              borderLeft: `4px solid ${r.yukumlulukColor}`,
              borderRadius: RADIUS.md,
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '10px' }}>
                <span style={{ fontFamily: FONTS.quran, color: COLORS.gold, fontSize: '1.4rem', direction: 'rtl' }} lang="ar">{r.arabic}</span>
                <span style={{ color: COLORS.offWhite, fontWeight: 700, fontSize: '1rem' }}>{tr ? r.labelTr : r.labelEn}</span>
              </div>
              <div style={{ display: 'grid', gap: '6px', fontSize: '0.82rem' }}>
                <div><span style={{ color: COLORS.silver, opacity: 0.7 }}>{tr ? 'Yükümlülük' : 'Degree'}:</span> <span style={{ color: r.yukumlulukColor, fontWeight: 700 }}>{tr ? r.yukumlulukTr : r.yukumlulukEn}</span></div>
                <div><span style={{ color: COLORS.silver, opacity: 0.7 }}>{tr ? 'Kategori' : 'Category'}:</span> <span style={{ color: COLORS.offWhite }}>{tr ? r.kategoriTr : r.kategoriEn}</span></div>
                <div><span style={{ color: COLORS.silver, opacity: 0.7 }}>{tr ? 'Sünnet Tafsili' : 'Sunnah Detail'}:</span> <span style={{ color: COLORS.offWhite }}>{tr ? r.sunnetTafsilTr : r.sunnetTafsilEn}</span></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          overflow: 'hidden',
          border: `1px solid ${COLORS.goldAlpha25}`,
          borderRadius: RADIUS.md,
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
            <thead>
              <tr style={{ background: 'rgba(212,165,116,0.08)' }}>
                <th style={{ padding: '12px 14px', textAlign: 'left', color: COLORS.gold, fontSize: '0.7rem', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700 }}>{tr ? 'Sütun' : 'Pillar'}</th>
                <th style={{ padding: '12px 14px', textAlign: 'left', color: COLORS.gold, fontSize: '0.7rem', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700 }}>{tr ? 'Yükümlülük' : 'Degree'}</th>
                <th style={{ padding: '12px 14px', textAlign: 'left', color: COLORS.gold, fontSize: '0.7rem', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700 }}>{tr ? 'Kategori' : 'Category'}</th>
                <th style={{ padding: '12px 14px', textAlign: 'left', color: COLORS.gold, fontSize: '0.7rem', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700 }}>{tr ? 'Sünnet Tafsili' : 'Sunnah Detail'}</th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((r, i) => (
                <tr key={r.id} style={{
                  background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                  borderTop: `1px solid ${COLORS.glassBorderSoft}`,
                  cursor: 'pointer', transition: 'background 0.15s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,165,116,0.06)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent'; }}
                  onClick={() => router.push(`/${language}${r.id === 'dua' ? '/arac/dualar' : `/atlas/ibadetler/${r.id}`}`)}
                >
                  <td style={{ padding: '14px', borderLeft: `4px solid ${r.yukumlulukColor}` }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                      <span style={{ fontFamily: FONTS.quran, color: COLORS.gold, fontSize: '1.25rem', direction: 'rtl' }} lang="ar">{r.arabic}</span>
                      <span style={{ color: COLORS.offWhite, fontWeight: 700 }}>{tr ? r.labelTr : r.labelEn}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px', color: r.yukumlulukColor, fontWeight: 600 }}>{tr ? r.yukumlulukTr : r.yukumlulukEn}</td>
                  <td style={{ padding: '14px', color: COLORS.offWhite, opacity: 0.9 }}>{tr ? r.kategoriTr : r.kategoriEn}</td>
                  <td style={{ padding: '14px', color: COLORS.silver, fontSize: '0.82rem' }}>{tr ? r.sunnetTafsilTr : r.sunnetTafsilEn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data.notTr && (
        <p style={{
          color: COLORS.silver, fontSize: '0.78rem',
          fontStyle: 'italic', marginTop: '14px', opacity: 0.75,
        }}>{tr ? data.notTr : (data.notEn ?? data.notTr)}</p>
      )}
    </div>
  );
}

// ─── Zaman Ekseni — Mekke & Medine ───────────────────────────────────────
function ZamanEkseniSection({ data, language, isMobile }) {
  if (!data?.phases?.length) return null;
  return (
    <div style={{ marginBottom: '56px' }}>
      <h2 style={{
        fontFamily: FONTS.display, color: COLORS.offWhite,
        fontSize: isMobile ? '1.4rem' : '1.75rem',
        margin: '0 0 8px', fontWeight: 700,
      }}>{language === 'tr' ? data.titleTr : (data.titleEn ?? data.titleTr)}</h2>
      <p style={{ color: COLORS.silver, fontSize: '0.95rem', lineHeight: 1.7, margin: '0 0 24px', maxWidth: '860px' }}>
        {language === 'tr' ? data.introTr : (data.introEn ?? data.introTr)}
      </p>
      <div style={{
        display: 'grid', gap: '18px',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
      }}>
        {data.phases.map((p, i) => {
          const isMedina = p.phase === 'Medine';
          const accent = isMedina ? '#2ecc71' : COLORS.gold;
          return (
            <div key={i} style={{
              padding: '22px 24px',
              border: `1px solid ${accent}44`,
              borderRadius: RADIUS.md,
              background: `linear-gradient(180deg, ${accent}0d 0%, rgba(255,255,255,0.02) 100%)`,
            }}>
              <div style={{
                color: accent, fontSize: '0.7rem',
                letterSpacing: '0.22em', textTransform: 'uppercase',
                marginBottom: '8px', fontWeight: 700, opacity: 0.9,
              }}>{isMedina ? (language === 'tr' ? 'Dönem 2' : 'Phase 2') : (language === 'tr' ? 'Dönem 1' : 'Phase 1')}</div>
              <h3 style={{
                fontFamily: FONTS.display, color: COLORS.offWhite,
                fontSize: '1.4rem', margin: '0 0 12px', fontWeight: 700,
              }}>{language === 'tr' ? p.phase : (p.phaseEn ?? p.phase)}</h3>
              <p style={{
                color: COLORS.offWhite, opacity: 0.9,
                fontSize: '0.93rem', lineHeight: 1.75, margin: '0 0 14px',
              }}>{language === 'tr' ? p.descTr : (p.descEn ?? p.descTr)}</p>
              {p.sutunlar?.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {p.sutunlar.map((s, j) => (
                    <span key={j} style={{
                      padding: '3px 9px',
                      background: `${accent}22`,
                      border: `1px solid ${accent}44`,
                      borderRadius: '999px',
                      color: accent, fontSize: '0.68rem',
                      fontWeight: 600, letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                    }}>{s.replace('-', ' ')}</span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Peygamber İzleri — 21 peygamber × 41 kayıt aggregation ──────────────
function PeygamberIzleriSection({ data, language, isMobile, router }) {
  if (!data?.prophets?.length) return null;
  const tr = language === 'tr';
  const [expanded, setExpanded] = useState(null);

  return (
    <div style={{ marginBottom: '56px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '18px' }}>
        <h2 style={{
          fontFamily: FONTS.display, color: COLORS.offWhite,
          fontSize: isMobile ? '1.4rem' : '1.75rem',
          margin: 0, fontWeight: 700,
        }}>{tr ? data.titleTr : (data.titleEn ?? data.titleTr)}</h2>
        <div style={{
          color: COLORS.silver, fontSize: '0.78rem',
          fontStyle: 'italic', opacity: 0.75,
        }}>
          {data.totalProphets} {tr ? 'peygamber' : 'prophets'} · {data.totalRecords} {tr ? 'kayıt' : 'records'}
        </div>
      </div>
      <p style={{ color: COLORS.silver, fontSize: '0.95rem', lineHeight: 1.7, margin: '0 0 24px', maxWidth: '860px' }}>
        {tr ? data.introTr : (data.introEn ?? data.introTr)}
      </p>

      <div style={{ display: 'grid', gap: '12px' }}>
        {data.prophets.map((p, i) => {
          const isOpen = expanded === i;
          const pillarChips = [...new Set(p.records.map(r => r.pillar))];
          return (
            <div key={p.name} style={{
              padding: isMobile ? '14px 16px' : '16px 20px',
              background: 'linear-gradient(180deg, rgba(212,165,116,0.04) 0%, rgba(255,255,255,0.02) 100%)',
              border: `1px solid ${COLORS.goldAlpha25}`,
              borderRadius: RADIUS.md,
            }}>
              <button
                onClick={() => setExpanded(isOpen ? null : i)}
                aria-expanded={isOpen}
                aria-label={`${p.name} — ${p.occurrenceCount} ${tr ? 'ibadet kaydı' : 'worship records'}`}
                style={{
                  display: 'flex', alignItems: 'center', gap: '14px',
                  width: '100%', padding: 0, background: 'transparent',
                  border: 'none', cursor: 'pointer', textAlign: 'left',
                  fontFamily: 'inherit', color: 'inherit',
                }}
              >
                {/* Count badge */}
                <div style={{
                  flexShrink: 0,
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: p.occurrenceCount >= 5 ? COLORS.goldAlpha15 : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${p.occurrenceCount >= 5 ? COLORS.gold : COLORS.goldAlpha25}`,
                  color: p.occurrenceCount >= 5 ? COLORS.gold : COLORS.silver,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: FONTS.display, fontWeight: 800, fontSize: '0.95rem',
                }}>{p.occurrenceCount}</div>

                {/* Name + pillar chips */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    color: COLORS.offWhite, fontWeight: 700,
                    fontSize: '1.02rem', marginBottom: '6px',
                  }}>{p.name}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                    {pillarChips.map(pl => {
                      const meta = p.records.find(r => r.pillar === pl);
                      return (
                        <span key={pl} style={{
                          padding: '2px 8px',
                          background: `${meta.pillarColor}22`,
                          border: `1px solid ${meta.pillarColor}55`,
                          borderRadius: '10px',
                          color: meta.pillarColor,
                          fontSize: '0.66rem', fontWeight: 700,
                          letterSpacing: '0.06em', textTransform: 'uppercase',
                        }}>{tr ? meta.pillarLabelTr : meta.pillarLabelEn}</span>
                      );
                    })}
                  </div>
                </div>

                {/* Expand arrow */}
                <div style={{
                  flexShrink: 0,
                  color: COLORS.gold, fontSize: '0.85rem',
                  transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                  transition: 'transform 0.15s',
                }} aria-hidden="true">▸</div>
              </button>

              {/* Expanded records */}
              {isOpen && (
                <div style={{
                  marginTop: '14px', paddingTop: '14px',
                  borderTop: `1px dashed ${COLORS.goldAlpha25}`,
                  display: 'grid', gap: '10px',
                }}>
                  {p.records.map((r, j) => (
                    <div key={j} style={{
                      padding: '10px 14px',
                      background: `linear-gradient(90deg, ${r.pillarColor}0d 0%, rgba(255,255,255,0.02) 100%)`,
                      borderLeft: `3px solid ${r.pillarColor}`,
                      borderRadius: '0 6px 6px 0',
                      cursor: 'pointer',
                    }}
                      onClick={(e) => { e.stopPropagation(); router.push(`/${language}/atlas/ibadetler/${r.pillar}?tab=peygamberler`); }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '5px' }}>
                        <span style={{
                          color: r.pillarColor, fontSize: '0.65rem',
                          letterSpacing: '0.14em', textTransform: 'uppercase',
                          fontWeight: 700,
                        }}>{tr ? r.pillarLabelTr : r.pillarLabelEn}</span>
                        <span style={{
                          color: COLORS.silver, fontSize: '0.7rem',
                          letterSpacing: '0.06em',
                        }}>{r.ref}</span>
                      </div>
                      {r.sceneTr && (
                        <p style={{
                          color: COLORS.offWhite, opacity: 0.85,
                          fontSize: '0.85rem', lineHeight: 1.6, margin: 0,
                        }}>{r.sceneTr}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Ortak Formüller ─────────────────────────────────────────────────────
function OrtakFormullerSection({ data, language, isMobile }) {
  if (!data?.formuller?.length) return null;
  return (
    <div style={{ marginBottom: '56px' }}>
      <h2 style={{
        fontFamily: FONTS.display, color: COLORS.offWhite,
        fontSize: isMobile ? '1.4rem' : '1.75rem',
        margin: '0 0 8px', fontWeight: 700,
      }}>{language === 'tr' ? data.titleTr : (data.titleEn ?? data.titleTr)}</h2>
      <p style={{ color: COLORS.silver, fontSize: '0.95rem', lineHeight: 1.7, margin: '0 0 24px', maxWidth: '860px' }}>
        {language === 'tr' ? data.introTr : (data.introEn ?? data.introTr)}
      </p>
      <div style={{ display: 'grid', gap: '18px' }}>
        {data.formuller.map((f, i) => (
          <div key={i} style={{
            padding: isMobile ? '20px 20px' : '26px 30px',
            border: `1px solid ${COLORS.goldAlpha25}`,
            borderRadius: RADIUS.md,
            background: 'linear-gradient(180deg, rgba(212,165,116,0.04) 0%, rgba(255,255,255,0.02) 100%)',
          }}>
            {/* Arabic formula */}
            {f.arabic && (
              <div style={{
                fontFamily: FONTS.quran, color: COLORS.gold,
                fontSize: isMobile ? 'clamp(1.3rem, 5vw, 1.65rem)' : 'clamp(1.5rem, 2.3vw, 1.85rem)',
                lineHeight: 2, direction: 'rtl', textAlign: 'right',
                marginBottom: '14px',
              }} lang="ar" dir="rtl">{f.arabic}</div>
            )}
            {/* TR/EN formula */}
            <p style={{
              fontFamily: FONTS.display, fontStyle: 'italic',
              color: COLORS.offWhite, fontSize: '1.02rem',
              margin: '0 0 10px', lineHeight: 1.6,
            }}>"{language === 'tr' ? f.formulTr : (f.formulEn ?? f.formulTr)}"</p>
            {/* Occurrence + refs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '14px' }}>
              <span style={{
                color: COLORS.gold, fontSize: '0.7rem',
                letterSpacing: '0.14em', textTransform: 'uppercase',
                fontWeight: 700, opacity: 0.85,
              }}>{language === 'tr' ? f.occurrenceTr : (f.occurrenceEn ?? f.occurrenceTr)}</span>
            </div>
            {f.sampleRefs?.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                {f.sampleRefs.map((r, j) => (
                  <span key={j} style={{
                    padding: '3px 10px',
                    background: 'rgba(212,165,116,0.10)',
                    border: `1px solid ${COLORS.goldAlpha25}`,
                    borderRadius: '10px',
                    color: COLORS.gold, fontSize: '0.68rem',
                    fontWeight: 600, letterSpacing: '0.06em',
                  }}>{r}</span>
                ))}
              </div>
            )}
            {/* Description */}
            <p style={{
              color: COLORS.offWhite, fontSize: '0.92rem',
              lineHeight: 1.75, margin: '0 0 10px',
            }}>{language === 'tr' ? f.descTr : (f.descEn ?? f.descTr)}</p>
            {f.kaynak && (
              <div style={{ color: COLORS.silver, fontSize: '0.75rem', fontStyle: 'italic' }}>— {f.kaynak}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── WowFacts ────────────────────────────────────────────────────────────
function WowFactsSection({ wowFacts, language, isMobile }) {
  if (!wowFacts?.length) return null;
  return (
    <div style={{ marginBottom: '56px' }}>
      <h2 style={{
        fontFamily: FONTS.display, color: COLORS.offWhite,
        fontSize: isMobile ? '1.4rem' : '1.75rem',
        margin: '0 0 22px', fontWeight: 700,
      }}>{language === 'tr' ? "Kur'ân'ın Açtığı Pencereler" : "Windows the Qur'an Opens"}</h2>
      <div style={{
        display: 'grid', gap: '18px',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(320px, 1fr))',
      }}>
        {wowFacts.map((w, i) => {
          const style = IBADET_CLAIM_TYPE_STYLES[w.claimType];
          return (
            <div key={i} style={{
              padding: isMobile ? '20px 22px' : '24px 26px',
              border: `1px solid ${COLORS.glassBorderSoft}`,
              borderRadius: RADIUS.md,
              background: 'linear-gradient(180deg, rgba(212,165,116,0.04) 0%, rgba(255,255,255,0.02) 100%)',
            }}>
              <h3 style={{
                fontFamily: FONTS.display, color: COLORS.gold,
                fontSize: '1.1rem', margin: '0 0 10px',
                fontWeight: 700, lineHeight: 1.4,
              }}>{language === 'tr' ? w.titleTr : (w.titleEn ?? w.titleTr)}</h3>
              <p style={{
                color: COLORS.offWhite, fontSize: '0.9rem',
                lineHeight: 1.7, margin: '0 0 12px',
              }}>{language === 'tr' ? w.descTr : (w.descEn ?? w.descTr)}</p>
              {w.kaynak && (
                <div style={{
                  color: COLORS.silver, fontSize: '0.72rem',
                  fontStyle: 'italic', opacity: 0.85,
                }}>— {w.kaynak}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
