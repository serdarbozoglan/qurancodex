'use client';
// İbadetler HUB — 8 pillar landing sayfası
// Cinematic hero + AbdCore radial + wowFacts + 8 pillar grid + kaynaklar
// Namaz "ready", diğer 7 pillar "coming" — click disabled.

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
        <PillarsGrid pillars={hubData.pillars} language={language} isMobile={isMobile} router={router} />
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
