'use client';

// ─── İnsan Yolculuğu Atlası ─────────────────────────────────────────────────
// Kur'ân'ın çizdiği manevî olgunlaşma silsilesi: Fıtrat → Uyanış → İman →
// Sâlih Amel → Takvâ → İhsan → Kalb-i Selîm → Hüsn-i Hâtime → Rızâ → Cemâlullah.
//
// Pattern: sticky sol vertical timeline + right detail panel (desktop);
// tab-lı stage selector + full detail (mobile).
// §13.17 ToolHeader + §13.18 premium hero + §13.19 sticky tab (mobile).
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useMemo, useRef } from 'react';
import ToolHeader from './ToolHeader';
import CrossToolCTA from './CrossToolCTA';
import SourcesCitation from './SourcesCitation';
import BookmarkButton from './BookmarkButton';
import useNavbarOffset from './useNavbarOffset';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS, RADIUS, VERSE_BLOCK, TEXT, GLASS_CARD } from '../tokens';
// 2026-08-14 (Z3f2) — fetch yerine static import: SSR "Yükleniyor" iskeleti
// döndürüyordu, JS başarısız olursa sayfa boş kalıyordu.
import insanYolculuguDataStatic from '../../public/insan-yolculugu.json';

// ── Icons keyed by stage.iconMode
const ICONS = {
  seed:    <path d="M12 2v20M6 8c0-3 3-4 6-4s6 1 6 4c0 4-6 5-6 12" strokeLinecap="round" />,
  sunrise: <><circle cx="12" cy="14" r="4" /><path d="M12 4v3M4 12h3M20 12h-3M6 6l2 2M18 6l-2 2M2 20h20" strokeLinecap="round" /></>,
  flame:   <path d="M12 2s5 4 5 10a5 5 0 0 1-10 0c0-3 2-4 2-6s3-4 3-4z" strokeLinejoin="round" />,
  hands:   <path d="M6 12v-2a2 2 0 1 1 4 0v2M14 12v-2a2 2 0 1 1 4 0v2M4 12h16v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />,
  shield:  <path d="M12 2l8 3v6c0 5-4 9-8 11-4-2-8-6-8-11V5l8-3z" strokeLinejoin="round" />,
  eye:     <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></>,
  heart:   <path d="M12 21s-7-4.5-9-9c-1-2.5.5-6 3.5-6 2 0 3.5 1 4.5 2.5C12 7 13.5 6 15.5 6c3 0 4.5 3.5 3.5 6-2 4.5-9 9-9 9z" strokeLinejoin="round" />,
  sunset:  <><circle cx="12" cy="14" r="4" /><path d="M2 20h20M6 14l-2-2M20 12l-2 2M12 6v3M4 18l3-2M17 16l3 2" strokeLinecap="round" /></>,
  moon:    <path d="M20 14a8 8 0 1 1-8-11c0 4 4 8 8 8v3z" strokeLinejoin="round" />,
  sun:     <><circle cx="12" cy="12" r="4" /><path d="M12 2v3M12 19v3M4.2 4.2l2 2M17.8 17.8l2 2M2 12h3M19 12h3M4.2 19.8l2-2M17.8 6.2l2-2" strokeLinecap="round" /></>,
};

function StageIcon({ mode, color, size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || COLORS.gold} strokeWidth="1.6" aria-hidden="true">
      {ICONS[mode] || ICONS.seed}
    </svg>
  );
}

export default function InsanYolculugu({ onClose }) {
  const { language } = useLanguage();
  const [data] = useState(insanYolculuguDataStatic);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const detailRef = useRef(null);
  // Navbar yüksekliği sabit değil (§13.13/§13.31 Mekanizma 2) — ölçülür.
  const navTop = useNavbarOffset(0, 62);

  // SSR-safe mobile detection
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 768);
    h();
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  // Escape key close
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape' && onClose) onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  const isEn = language === 'en';
  const stages = data?.stages || [];
  const active = stages[activeIdx];

  // On active change, scroll detail panel to top
  useEffect(() => {
    if (detailRef.current) detailRef.current.scrollTop = 0;
  }, [activeIdx]);

  const totalStages = data?.meta?.totalStages ?? stages.length;

  return (
    <div style={{
      background: COLORS.cosmicBlack,
      minHeight: 'calc(100vh - 62px)',
      display: 'flex', flexDirection: 'column',
      paddingTop: '62px',
    }}>
      <ToolHeader
        icon={<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 3v18M3 12h18" /></svg>}
        titleTr="İnsan Yolculuğu"
        titleEn="The Human Journey"
        subtitleTr="Fıtrattan Cemâlullah'a — 10 aşama"
        subtitleEn="From Fiṭra to Jamāl Allāh — 10 stages"
        language={language}
      />

      {!data && (
        <div style={{ padding: '80px 24px', textAlign: 'center', color: COLORS.silver }}>
          {isEn ? 'Loading…' : 'Yükleniyor…'}
        </div>
      )}

      {data && (
        <>
          {/* ─── Hero — §13.18 Premium ────────────────────────────── */}
          <div className="mq-box" style={{
            '--pt-d': "48px", '--pt-m': "32px", '--pr-d': "32px", '--pr-m': "16px", '--pb-d': "32px", '--pb-m': "24px", '--pl-d': "32px", '--pl-m': "16px",
            background: `linear-gradient(180deg, ${COLORS.goldAlpha06} 0%, transparent 100%)`,
            borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
            textAlign: 'center',
          }}>
            <div className="mq-fs" style={{
              fontFamily: "'Amiri Quran', serif",
              color: COLORS.gold, opacity: 0.82,
              '--fs-d': '2rem', '--fs-m': '1.6rem',
              margin: '0 0 18px', lineHeight: 1,
            }} aria-hidden="true">﷽</div>

            <p dir="rtl" lang="ar" className="mq-fs" style={{
              fontFamily: FONTS.quran,
              color: COLORS.gold,
              '--fs-d': '1.35rem', '--fs-m': '1.1rem',
              lineHeight: 2.1,
              margin: '0 auto 12px', maxWidth: '780px',
            }}>
              يَٓا اَيَّتُهَا النَّفْسُ الْمُطْمَئِنَّةُ ارْجِع۪ٓي اِلٰى رَبِّكِ رَاضِيَةً مَرْضِيَّةً
            </p>
            <p className="mq-fs" style={{
              fontFamily: FONTS.display, fontStyle: 'italic',
              color: COLORS.offWhiteAlpha78,
              '--fs-d': '1.05rem', '--fs-m': '0.95rem',
              lineHeight: 1.6, margin: '0 auto 6px', maxWidth: '660px',
            }}>
              {isEn
                ? '"O tranquil soul! Return to your Lord, well-pleased and pleasing to Him."'
                : '"Ey mutmain nefis! Sen Rabbinden razı, O da senden razı olarak Rabbine dön."'}
            </p>
            <p style={{
              color: COLORS.silver, opacity: 0.78,
              fontSize: '0.68rem', fontWeight: 600,
              letterSpacing: '0.16em', textTransform: 'uppercase',
              margin: '0 0 22px',
            }}>— {isEn ? 'al-Fajr 89:27-28' : 'Fecr 89:27-28'}</p>

            <div style={{
              width: '120px', height: '1px', margin: '0 auto 22px',
              background: `linear-gradient(90deg, transparent 0%, ${COLORS.goldAlpha45} 50%, transparent 100%)`,
            }} />

            <p style={{
              color: COLORS.gold, opacity: 0.75,
              fontSize: '0.68rem', fontWeight: 700,
              letterSpacing: '0.24em', textTransform: 'uppercase',
              margin: '0 0 12px',
            }}>
              {isEn ? 'HUMAN JOURNEY · 10-STAGE SPIRITUAL MATURATION' : 'İNSAN YOLCULUĞU · 10 AŞAMALI MANEVÎ OLGUNLAŞMA'}
            </p>
            <h2 className="mq-fs" style={{
              fontFamily: FONTS.display,
              '--fs-d': 'clamp(2rem, 3.6vw, 2.7rem)', '--fs-m': 'clamp(1.6rem, 7vw, 2rem)',
              color: COLORS.offWhite,
              margin: '0 0 10px', fontWeight: 700,
            }}>
              {isEn ? data.intro.titleEn : data.intro.titleTr}
            </h2>
            <p className="mq-fs" style={{
              fontFamily: FONTS.display, fontStyle: 'italic',
              color: COLORS.gold,
              '--fs-d': '1.15rem', '--fs-m': '1.05rem',
              margin: '0 auto 20px', maxWidth: '680px',
              lineHeight: 1.5,
            }}>
              {isEn ? data.intro.subtitleEn : data.intro.subtitleTr}
            </p>
            <p className="mq-fs" style={{
              color: COLORS.silver,
              '--fs-d': '1rem', '--fs-m': '0.92rem',
              lineHeight: 1.7, margin: '0 auto', maxWidth: '740px',
            }}>
              {isEn ? data.intro.descEn : data.intro.descTr}
            </p>

            {/* Micro-stat */}
            <div className="mq-fs" style={{
              display: 'inline-flex', alignItems: 'center',
              gap: isMobile ? '10px' : '18px',
              padding: '8px 18px', marginTop: '22px',
              background: COLORS.goldAlpha04,
              border: `1px solid ${COLORS.goldAlpha15}`,
              borderRadius: RADIUS.pill,
              '--fs-d': '0.72rem', '--fs-m': '0.68rem',
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: COLORS.silver, fontWeight: 600,
              flexWrap: 'wrap', justifyContent: 'center',
            }}>
              <span><span style={{ color: COLORS.gold, fontWeight: 700 }}>{totalStages}</span> {isEn ? 'STAGES' : 'AŞAMA'}</span>
              <span style={{ opacity: 0.35 }}>·</span>
              <span><span style={{ color: COLORS.gold, fontWeight: 700 }}>{stages.reduce((n, s) => n + 1 + (s.supportingVerses?.length || 0), 0)}</span> {isEn ? 'VERSES' : 'AYET'}</span>
              <span style={{ opacity: 0.35 }}>·</span>
              <span>{isEn ? 'FIṬRAT → JAMĀL ALLĀH' : 'FIṬRAT → CEMÂLULLAH'}</span>
            </div>
          </div>

          {/* ─── Mobile: Stage chip strip (§13.19 sticky) ──────────── */}
          {isMobile && (
            <div id="iy-stage-bar" style={{
              display: 'flex', gap: '6px',
              padding: '10px 12px',
              overflowX: 'auto', scrollbarWidth: 'none',
              borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
              background: 'rgb(6, 8, 14)',
              backgroundColor: 'rgb(6, 8, 14)',
              isolation: 'isolate',
              position: 'sticky', top: `${navTop + 48}px`, zIndex: 20,
              scrollMarginTop: '120px',
              flexShrink: 0,
            }}>
              {stages.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setActiveIdx(i);
                    setTimeout(() => document.getElementById('iy-stage-bar')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
                  }}
                  style={{
                    flexShrink: 0,
                    padding: '8px 12px',
                    fontSize: '0.7rem',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    fontWeight: activeIdx === i ? 700 : 500,
                    color: activeIdx === i ? COLORS.gold : COLORS.silver,
                    background: activeIdx === i ? COLORS.goldAlpha15 : 'transparent',
                    border: `1px solid ${activeIdx === i ? COLORS.goldAlpha45 : COLORS.glassBorderSoft}`,
                    borderRadius: RADIUS.pill,
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                  }}
                >
                  <span style={{ opacity: 0.85 }}>{s.order}.</span>
                  <span>{isEn ? s.titleEn.split(' (')[0] : s.titleTr.split(' (')[0]}</span>
                </button>
              ))}
            </div>
          )}

          {/* ─── Body: sticky timeline (desktop) + detail panel ─────── */}
          <div className="fd-row" style={{
            flex: 1,
            display: 'flex',
            minHeight: 0,
            maxWidth: '1280px',
            width: '100%',
            margin: '0 auto',
          }}>
            {/* LEFT — sticky vertical timeline (desktop only) */}
            {!isMobile && (
              <aside style={{
                width: '280px',
                flexShrink: 0,
                padding: '32px 0 32px 32px',
                borderRight: `1px solid ${COLORS.glassBorderSoft}`,
              }}>
                <div style={{ position: 'sticky', top: `${navTop + 68}px` }}>
                  <p style={{
                    color: COLORS.gold, opacity: 0.85,
                    fontSize: '0.65rem', fontWeight: 700,
                    letterSpacing: '0.24em', textTransform: 'uppercase',
                    margin: '0 0 18px',
                  }}>
                    {isEn ? '10 STAGES' : '10 AŞAMA'}
                  </p>
                  <div style={{ position: 'relative' }}>
                    {/* Vertical line */}
                    <div style={{
                      position: 'absolute',
                      left: '13px', top: '10px', bottom: '10px',
                      width: '1px',
                      background: `linear-gradient(180deg, ${COLORS.goldAlpha25} 0%, ${COLORS.goldAlpha15} 100%)`,
                    }} />

                    {stages.map((s, i) => {
                      const isActive = activeIdx === i;
                      const isPast = i < activeIdx;
                      return (
                        <button
                          key={s.id}
                          onClick={() => setActiveIdx(i)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '14px',
                            padding: '10px 0',
                            width: '100%',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            textAlign: 'left',
                            position: 'relative',
                          }}
                        >
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            width: '28px', height: '28px',
                            borderRadius: RADIUS.full,
                            background: isActive ? s.color : (isPast ? COLORS.goldAlpha25 : COLORS.cosmicBlack),
                            border: `1.5px solid ${isActive ? s.color : (isPast ? COLORS.goldAlpha45 : COLORS.glassBorderSoft)}`,
                            color: isActive ? COLORS.cosmicBlack : (isPast ? COLORS.gold : COLORS.silver),
                            fontSize: '0.72rem', fontWeight: 700,
                            zIndex: 1,
                            transition: 'all 0.2s',
                            boxShadow: isActive ? `0 0 16px ${s.color}66` : 'none',
                          }}>
                            {s.order}
                          </span>
                          <span style={{
                            fontFamily: FONTS.body,
                            fontSize: '0.85rem',
                            fontWeight: isActive ? 700 : 500,
                            color: isActive ? COLORS.offWhite : COLORS.silver,
                            transition: 'color 0.15s',
                          }}>
                            {isEn ? s.titleEn.split(' (')[0] : s.titleTr.split(' (')[0]}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </aside>
            )}

            {/* RIGHT — active stage detail */}
            <main className="mq-box" ref={detailRef} style={{
              flex: 1,
              '--pt-d': "32px", '--pt-m': "20px", '--pr-d': "40px", '--pr-m': "16px", '--pb-d': "60px", '--pb-m': "40px", '--pl-d': "40px", '--pl-m': "16px",
              overflowY: 'auto',
              minHeight: 0,
            }}>
              {active && <StageDetail stage={active} isEn={isEn} isMobile={isMobile} />}

              {/* Prev / Next navigation */}
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                marginTop: '40px', paddingTop: '24px',
                borderTop: `1px solid ${COLORS.glassBorderSoft}`,
                gap: '12px',
              }}>
                <button
                  onClick={() => setActiveIdx(Math.max(0, activeIdx - 1))}
                  disabled={activeIdx === 0}
                  style={{
                    padding: '10px 16px',
                    background: 'transparent',
                    border: `1px solid ${COLORS.glassBorderSoft}`,
                    borderRadius: RADIUS.md,
                    color: activeIdx === 0 ? COLORS.silver : COLORS.gold,
                    fontSize: '0.78rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    cursor: activeIdx === 0 ? 'not-allowed' : 'pointer',
                    opacity: activeIdx === 0 ? 0.4 : 1,
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                  }}
                >← {isEn ? 'Previous' : 'Önceki'}</button>
                <button
                  onClick={() => setActiveIdx(Math.min(stages.length - 1, activeIdx + 1))}
                  disabled={activeIdx === stages.length - 1}
                  style={{
                    padding: '10px 16px',
                    background: 'transparent',
                    border: `1px solid ${COLORS.glassBorderSoft}`,
                    borderRadius: RADIUS.md,
                    color: activeIdx === stages.length - 1 ? COLORS.silver : COLORS.gold,
                    fontSize: '0.78rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    cursor: activeIdx === stages.length - 1 ? 'not-allowed' : 'pointer',
                    opacity: activeIdx === stages.length - 1 ? 0.4 : 1,
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                  }}
                >{isEn ? 'Next' : 'Sonraki'} →</button>
              </div>
            </main>
          </div>

          {/* Closing verse — Fecr 89:27-30 full */}
          {data.closingVerse && (
            <section className="mq-box" style={{
              '--pt-d': "56px", '--pt-m': "40px", '--pr-d': "40px", '--pr-m': "16px", '--pb-d': "56px", '--pb-m': "40px", '--pl-d': "40px", '--pl-m': "16px",
              maxWidth: '900px', margin: '0 auto', textAlign: 'center',
            }}>
              <p style={{
                color: COLORS.gold, opacity: 0.75,
                fontSize: '0.65rem', fontWeight: 700,
                letterSpacing: '0.28em', textTransform: 'uppercase',
                margin: '0 0 20px',
              }}>{isEn ? 'THE CLOSING CALL' : 'KAPANIŞ SESLENİŞİ'}</p>

              <div style={VERSE_BLOCK}>
                <p dir="rtl" lang="ar" style={{ ...TEXT.verseArabic, margin: '0 0 14px' }}>
                  {data.closingVerse.verseAr}
                </p>
                <p style={{ fontSize: '0.9rem', color: COLORS.offWhite, fontStyle: 'italic', lineHeight: 1.7 }}>
                  {isEn ? data.closingVerse.verseEn : data.closingVerse.verseTr}
                </p>
                <p style={{ ...TEXT.verseRef, margin: '10px 0 0' }}>— {data.closingVerse.verseRef}</p>
              </div>
            </section>
          )}

          {/* SourcesCitation */}
          {data.sources?.length > 0 && (
            <SourcesCitation
              language={language}
              isMobile={isMobile}
              sources={data.sources}
            />
          )}

          {/* CrossToolCTA */}
          <CrossToolCTA
            language={language}
            isMobile={isMobile}
            links={[
              { href: `/${language}/atlas/ahiret-yolculugu`, titleTr: 'Âhiret Yolculuğu', titleEn: 'Afterlife Journey', descTr: 'Yolculuğun ötesi — sekerâttan rü\'yetullâha 11 aşama.', descEn: 'Beyond the journey — 11 stages from death throes to the vision of God.' },
              { href: `/${language}/atlas/nefs-mertebeleri`, titleTr: 'Nefs Mertebeleri', titleEn: 'Levels of the Self', descTr: 'Emmâre → Levvâme → Mülhime → Mutmainne → Râzıye → Marzıyye → Kâmile.', descEn: 'Ammāra → Lawwāma → Mulhima → Muṭmaʾinna → Rāḍiya → Marḍiyya → Kāmila.' },
              { href: `/${language}/arac/esma-frekans`, titleTr: 'Esmâ-i Hüsnâ', titleEn: 'The Beautiful Names', descTr: 'Yolculuğun her aşamasında farklı bir isim çağrılır.', descEn: 'Each stage of the journey calls a different Divine Name.' },
            ]}
          />
        </>
      )}
    </div>
  );
}

// ── Stage Detail Panel ──────────────────────────────────────────────
function StageDetail({ stage, isEn, isMobile }) {
  const [showSupporting, setShowSupporting] = useState(false);
  return (
    <article>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '10px' }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: '44px', height: '44px',
          borderRadius: RADIUS.full,
          background: `${stage.color}20`,
          border: `1.5px solid ${stage.color}66`,
          boxShadow: `0 0 20px ${stage.color}33`,
          flexShrink: 0,
        }}>
          <StageIcon mode={stage.iconMode} color={stage.color} size={22} />
        </span>
        <div style={{ flex: 1 }}>
          <p style={{
            color: stage.color, opacity: 0.75,
            fontSize: '0.65rem', fontWeight: 700,
            letterSpacing: '0.24em', textTransform: 'uppercase',
            margin: 0,
          }}>
            {isEn ? `STAGE ${stage.order} · ${stage.arabicTerm}` : `AŞAMA ${stage.order} · ${stage.arabicTerm}`}
          </p>
          <h2 style={{
            fontFamily: FONTS.display,
            fontSize: isMobile ? '1.5rem' : '1.75rem',
            color: COLORS.offWhite,
            margin: '4px 0 0', fontWeight: 700,
            letterSpacing: '-0.01em',
          }}>
            {isEn ? stage.titleEn : stage.titleTr}
          </h2>
        </div>
        <BookmarkButton
          item={{
            type: 'insan-yolculugu-stage',
            id: `insan-yolculugu:${stage.id}`,
            titleTr: `${stage.titleTr} — İnsan Yolculuğu`,
            titleEn: `${stage.titleEn} — Human Journey`,
            href: `/${isEn ? 'en' : 'tr'}/atlas/insan-yolculugu`,
          }}
        />
      </div>

      {/* Essence */}
      <p style={{
        color: COLORS.offWhite,
        fontSize: isMobile ? '1rem' : '1.05rem',
        lineHeight: 1.75,
        margin: '18px 0 24px',
      }}>
        {isEn ? stage.essenceEn : stage.essenceTr}
      </p>

      {/* Anchor verse */}
      {stage.anchor && (
        <div style={{ ...GLASS_CARD, padding: '20px', marginBottom: '20px', borderLeft: `3px solid ${stage.color}` }}>
          <p style={{
            color: stage.color, opacity: 0.75,
            fontSize: '0.62rem', fontWeight: 700,
            letterSpacing: '0.24em', textTransform: 'uppercase',
            margin: '0 0 12px',
          }}>{isEn ? 'ANCHOR VERSE' : 'ANA AYET'}</p>
          <p dir="rtl" lang="ar" style={{ ...TEXT.verseArabic, margin: '0 0 12px', color: COLORS.gold }}>
            {stage.anchor.arabic}
          </p>
          <p style={{ fontSize: '0.9rem', color: COLORS.offWhite, fontStyle: 'italic', lineHeight: 1.7, margin: '0 0 8px' }}>
            {isEn ? stage.anchor.english : stage.anchor.turkish}
          </p>
          <p style={{ ...TEXT.verseRef, margin: 0 }}>— {stage.anchor.verseRef}</p>
        </div>
      )}

      {/* Supporting verses — collapsible */}
      {stage.supportingVerses?.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <button
            onClick={() => setShowSupporting(v => !v)}
            style={{
              padding: '8px 14px',
              background: 'transparent',
              border: `1px solid ${COLORS.glassBorderSoft}`,
              borderRadius: RADIUS.pill,
              color: COLORS.silver,
              fontSize: '0.72rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: '8px',
            }}
          >
            {showSupporting ? (isEn ? '− Hide' : '− Gizle') : (isEn ? `+ ${stage.supportingVerses.length} more verse${stage.supportingVerses.length > 1 ? 's' : ''}` : `+ ${stage.supportingVerses.length} destek ayet`)}
          </button>

          {showSupporting && (
            <div style={{ marginTop: '14px', display: 'grid', gap: '12px' }}>
              {stage.supportingVerses.map((v, i) => (
                <div key={i} style={VERSE_BLOCK}>
                  <p dir="rtl" lang="ar" style={{ ...TEXT.verseArabic, margin: '0 0 8px' }}>{v.arabic}</p>
                  <p style={{ fontSize: '0.85rem', color: COLORS.offWhite, fontStyle: 'italic', lineHeight: 1.65 }}>
                    {isEn ? v.english : v.turkish}
                  </p>
                  <p style={{ ...TEXT.verseRef, margin: '6px 0 0' }}>— {v.verseRef}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Practice + Obstacle 2-col grid */}
      <div className="g-1-2" style={{
        display: 'grid',
        gap: '16px', marginBottom: '20px',
      }}>
        <div style={{ ...GLASS_CARD, padding: '18px' }}>
          <p style={{
            color: COLORS.emerald,
            fontSize: '0.62rem', fontWeight: 700,
            letterSpacing: '0.22em', textTransform: 'uppercase',
            margin: '0 0 10px',
          }}>{isEn ? 'PRACTICE' : 'PRATİK'}</p>
          <p style={{ color: COLORS.offWhite, fontSize: '0.9rem', lineHeight: 1.7, margin: 0 }}>
            {isEn ? stage.practiceEn : stage.practiceTr}
          </p>
        </div>
        <div style={{ ...GLASS_CARD, padding: '18px' }}>
          <p style={{
            color: COLORS.softRed,
            fontSize: '0.62rem', fontWeight: 700,
            letterSpacing: '0.22em', textTransform: 'uppercase',
            margin: '0 0 10px',
          }}>{isEn ? 'OBSTACLE' : 'ENGEL'}</p>
          <p style={{ color: COLORS.offWhite, fontSize: '0.9rem', lineHeight: 1.7, margin: 0 }}>
            {isEn ? stage.obstacleEn : stage.obstacleTr}
          </p>
        </div>
      </div>

      {/* Next stage teaser */}
      {stage.nextTr && (
        <div style={{
          padding: '14px 18px',
          background: `linear-gradient(90deg, ${stage.color}12 0%, transparent 100%)`,
          borderLeft: `2px solid ${stage.color}`,
          borderRadius: `0 ${RADIUS.md} ${RADIUS.md} 0`,
        }}>
          <p style={{
            color: stage.color, opacity: 0.75,
            fontSize: '0.62rem', fontWeight: 700,
            letterSpacing: '0.2em', textTransform: 'uppercase',
            margin: '0 0 4px',
          }}>{isEn ? 'NEXT' : 'SIRADAKİ'}</p>
          <p style={{ color: COLORS.offWhite, fontSize: '0.88rem', fontStyle: 'italic', margin: 0, opacity: 0.9 }}>
            {isEn ? stage.nextEn : stage.nextTr}
          </p>
        </div>
      )}
    </article>
  );
}
