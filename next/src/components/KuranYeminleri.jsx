'use client';

import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS, CLOSE_BTN, VERSE_DISPLAY_CARD, BREAKPOINT_TABLET, RADIUS, TRANSITION } from '../tokens';
import ToolHeader from './ToolHeader';
import useFocusTrap from '../hooks/useFocusTrap';

// Tab definitions with mini SVG icons for visual affordance
const TABS = [
  {
    tr: 'Kategoriler', en: 'Categories',
    icon: <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
  },
  {
    tr: 'Derinlik Analizi', en: 'Depth Analysis',
    icon: <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>,
  },
  {
    tr: 'Sûre Dağılımı', en: 'Surah Distribution',
    icon: <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>,
  },
  {
    tr: 'İbn Kayyim', en: 'Ibn Qayyim',
    icon: <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>,
  },
  {
    tr: 'Kaynaklar', en: 'Sources',
    icon: <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>,
  },
];

export default function KuranYeminleri({ onClose }) {
  const { language } = useLanguage();
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [isMobile, setIsMobile] = useState(false)  // SSR-safe; useEffect h() post-mount hydrate;
  const [expandedAccordion, setExpandedAccordion] = useState(null);
  const bodyRef = useRef(null);
  const trapRef = useFocusTrap(true);

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  // Body scroll lock kaldırıldı — WowFacts/IlkSon pattern: normal-flow document scroll.

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < BREAKPOINT_TABLET);
    h(); // post-mount hydrate
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  useEffect(() => {
    fetch('/yeminler.json')
      .then(r => r.json())
      .then(d => { setData(d); setActiveCategoryId(d.categories[0]?.id ?? null); })
      .catch(() => {});
  }, []);

  // scroll body to top on tab change
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
  }, [activeTab]);

  if (!data) {
    return (
      <div
        ref={trapRef}
        style={{
          background: COLORS.cosmicBlack,
          minHeight: 'calc(100vh - 62px)',
          display: 'flex', flexDirection: 'column',
          paddingTop: '62px',
        }}
      >
        <ToolHeader
          icon={<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>}
          titleTr="Kur'an'ın Yeminleri"
          titleEn="Oaths of the Quran"
          subtitleTr="Aksâmü'l-Kur'an · 25+ yemin"
          subtitleEn="Aqsam al-Quran · 25+ oaths"
          language={language}
        />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: COLORS.silver, fontSize: '0.9rem', fontFamily: FONTS.body }}>
            {language === 'tr' ? 'Yükleniyor...' : 'Loading...'}
          </span>
        </div>
      </div>
    );
  }

  const { meta, categories, depthAnalysis, ibnQayyim, sources } = data;
  return (
    <div
      ref={trapRef}
      style={{
        background: COLORS.cosmicBlack,
        minHeight: 'calc(100vh - 62px)',
        display: 'flex', flexDirection: 'column',
        paddingTop: '62px',
      }}
    >
      <ToolHeader
        icon={<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>}
        titleTr="Kur'an'ın Yeminleri"
        titleEn="Oaths of the Quran"
        subtitleTr="Aksâmü'l-Kur'an · 25+ yemin"
        subtitleEn="Aqsam al-Quran · 25+ oaths"
        language={language}
      />

      {/* ── SCROLLABLE BODY ─────────────────────────────────────────────── */}
      <div ref={bodyRef} style={{ flex: 1 }}>

        {/* ════ CINEMATIC HERO — Premium Template (İlk-Son + Renkler parity) */}
        <div style={{
          padding: isMobile ? '40px 16px 28px' : '60px 32px 36px',
          background: 'linear-gradient(180deg, rgba(212,162,36,0.06) 0%, transparent 100%)',
          borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
          textAlign: 'center',
        }}>
          {/* Bismillah ornament — Amiri Quran ligature (§13.2 exception) */}
          <div
            dir="rtl"
            lang="ar"
            aria-label="Bismillāh"
            style={{
              fontFamily: "'Amiri Quran', 'Amiri', serif",
              fontSize: isMobile ? '1.6rem' : '2rem',
              color: COLORS.gold,
              opacity: 0.85,
              lineHeight: 1,
              marginBottom: isMobile ? '28px' : '40px',
              textShadow: `0 0 22px ${COLORS.gold}28`,
            }}
          >
            ﷽
          </div>

          {/* Anchor verse — Şems 91:1-2 (KFGQPC, large, gold) */}
          <p
            dir="rtl"
            lang="ar"
            style={{
              fontFamily: FONTS.quran,
              fontSize: isMobile ? 'clamp(1.05rem, 4.2vw, 1.4rem)' : 'clamp(1.3rem, 2.4vw, 1.75rem)',
              color: COLORS.gold,
              lineHeight: 2.1,
              margin: '0 auto 18px',
              maxWidth: '800px',
              textShadow: `0 0 22px ${COLORS.gold}1c`,
            }}
          >
            وَالشَّمْسِ وَضُحٰيهَاۙ وَالْقَمَرِ اِذَا تَلٰيهَاۙ
          </p>

          <p style={{
            color: COLORS.offWhite,
            fontFamily: FONTS.display,
            fontStyle: 'italic',
            fontSize: isMobile ? '0.94rem' : 'clamp(0.95rem, 1.6vw, 1.05rem)',
            lineHeight: 1.7,
            margin: '0 auto 8px',
            maxWidth: '620px',
            opacity: 0.95,
          }}>
            "{language === 'tr'
              ? 'Andolsun Güneşe ve onun kuşluk vaktindeki aydınlığına; ardından gelen Ay\'a…'
              : 'By the sun and its morning brightness; by the moon when it follows it…'}"
          </p>

          <p style={{
            color: COLORS.silver,
            fontFamily: FONTS.body,
            fontSize: '0.72rem',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            margin: '0 0 36px',
            opacity: 0.65,
          }}>
            — {language === 'tr' ? 'Şems 91:1-2' : 'al-Shams 91:1-2'}
          </p>

          {/* Framing whisper */}
          <p style={{
            color: COLORS.silver,
            fontFamily: FONTS.display,
            fontStyle: 'italic',
            fontSize: isMobile ? '0.92rem' : 'clamp(0.95rem, 1.55vw, 1.02rem)',
            lineHeight: 1.7,
            margin: '0 auto 40px',
            maxWidth: '660px',
            opacity: 0.88,
          }}>
            {language === 'tr'
              ? <>Allah <em style={{ fontStyle: 'normal', color: COLORS.gold, opacity: 0.95 }}>yarattıklarına yemin eder</em> — güneşe, aya, zamana, ruha, Kur'an'ın kendisine. Yemin <em style={{ fontStyle: 'normal', color: COLORS.gold, opacity: 0.95 }}>bir vurgu sanatı</em>; ardından gelen mesaja en güçlü işaret.</>
              : <>Allah <em style={{ fontStyle: 'normal', color: COLORS.gold, opacity: 0.95 }}>swears by His creation</em> — by the sun, the moon, time, the soul, the Quran itself. The oath is <em style={{ fontStyle: 'normal', color: COLORS.gold, opacity: 0.95 }}>an art of emphasis</em>; the strongest signal for what follows.</>}
          </p>

          {/* Filigree divider */}
          <div aria-hidden="true" style={{
            width: '120px',
            height: '1px',
            background: `linear-gradient(to right, transparent, ${COLORS.gold}66, transparent)`,
            margin: '0 auto 32px',
          }} />

          {/* Eyebrow */}
          <div style={{
            fontSize: '0.68rem', letterSpacing: '0.3em',
            color: COLORS.gold, textTransform: 'uppercase',
            fontFamily: FONTS.body, fontWeight: 700,
            opacity: 0.7,
            marginBottom: '14px',
          }}>
            {language === 'tr' ? `AKSÂMÜ'L-KUR'ÂN · ${meta.totalOaths} BİLEŞİK YEMİN` : `AQSĀM AL-QUR'ĀN · ${meta.totalOaths} COMPOUND OATHS`}
          </div>

          {/* Big Title */}
          <h1 style={{
            color: COLORS.offWhite,
            fontSize: isMobile ? 'clamp(1.6rem, 7vw, 2rem)' : 'clamp(2rem, 3.6vw, 2.8rem)',
            fontWeight: 700,
            fontFamily: FONTS.display,
            margin: '0 auto 16px',
            lineHeight: 1.15,
            letterSpacing: '-0.015em',
            maxWidth: '760px',
          }}>
            {language === 'tr' ? "Kur'an'ın Yeminleri" : "The Oaths of the Quran"}
          </h1>

          {/* Dramatic subtitle */}
          <p style={{
            fontFamily: FONTS.display,
            fontSize: isMobile ? '1rem' : 'clamp(1.05rem, 1.8vw, 1.2rem)',
            color: COLORS.gold,
            margin: '0 auto 32px',
            lineHeight: 1.5,
            fontStyle: 'italic',
            maxWidth: '680px',
            opacity: 0.92,
          }}>
            {language === 'tr'
              ? 'Allah neye yemin ederse, ardından gelen söz mutlak bir vurgu kazanır.'
              : 'Whatever Allah swears by, the word that follows acquires absolute emphasis.'}
          </p>

          {/* Original descriptive intro (compact, left-aligned, max-w'lı) */}
          <p style={{
            color: COLORS.silver,
            fontSize: '0.88rem',
            fontFamily: FONTS.body,
            margin: '0 auto 28px',
            lineHeight: 1.7,
            maxWidth: '720px',
            textAlign: 'left',
          }}>
            {language === 'tr'
              ? `Allah Kur'an'da ${meta.totalOaths} farklı şeye yemin eder: güneş, ay, zaman, şehirler, ruh, hatta Kur'an'ın kendisi. Bu yeminler tesadüfi değil — her biri, ardından gelen mesajın en güçlü delilidir.`
              : `God swears by ${meta.totalOaths} different things in the Quran: the sun, moon, time, cities, the soul, and even the Quran itself. These oaths are not random — each is the strongest evidence for the message that follows.`
            }
          </p>

          {/* Stat cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
            gap: '12px',
          }}>
            {[
              { value: meta.totalOaths, labelTr: 'Bileşik Yemin', labelEn: 'Compound Oaths', color: COLORS.gold },
              { value: meta.surahsWithOaths, labelTr: 'Yemin İçeren Sûre', labelEn: 'Surahs with Oaths', color: '#2ecc71' },
              { value: meta.maxOathsInSurah, labelTr: `${meta.maxOathsSurahName} Sûresi`, labelEn: `Surah ${meta.maxOathsSurahName}`, color: '#e74c3c' },
              { value: `${meta.meccanCount}/${meta.surahsWithOaths}`, labelTr: 'Mekkî Sûre', labelEn: 'Meccan Surahs', color: '#3498db' },
            ].map((s, i) => (
              <div key={i} style={{
                background: `${s.color}10`,
                border: `1px solid ${s.color}25`,
                borderRadius: '10px',
                padding: '14px 16px',
                textAlign: 'center',
              }}>
                <div style={{ color: s.color, fontSize: '1.8rem', fontWeight: 700, fontFamily: FONTS.body, lineHeight: 1 }}>
                  {s.value}
                </div>
                <div style={{ color: COLORS.slate500, fontSize: '0.72rem', fontFamily: FONTS.body, marginTop: '5px' }}>
                  {language === 'tr' ? s.labelTr : s.labelEn}
                </div>
              </div>
            ))}
          </div>

          {/* Methodology note — clarifies classical İbn Kayyim count */}
          {meta.methodologyTr && (
            <div style={{
              marginTop: '18px',
              padding: '12px 14px',
              background: COLORS.goldAlpha04,
              border: `1px solid ${COLORS.goldAlpha15}`,
              borderLeft: `2px solid ${COLORS.goldAlpha45}`,
              borderRadius: '8px',
              display: 'flex',
              gap: '10px',
              alignItems: 'flex-start',
              maxWidth: '900px',
              marginLeft: 'auto',
              marginRight: 'auto',
              textAlign: 'left',
            }}>
              <span style={{ color: COLORS.gold, fontSize: '0.78rem', flexShrink: 0, lineHeight: 1.5, fontWeight: 700, letterSpacing: '0.04em' }}>
                {language === 'tr' ? 'METOD' : 'METHOD'}
              </span>
              <p style={{ color: COLORS.silver, fontSize: '0.76rem', fontFamily: FONTS.body, lineHeight: 1.65, margin: 0 }}>
                {language === 'tr' ? meta.methodologyTr : meta.methodologyEn}
              </p>
            </div>
          )}
        </div>

        {/* ════ VÂKIA 56:75-76 SPOTLIGHT — Premium Tier B ════════════════════
            Kur'an'ın KENDİ yeminini tefsir ettiği eşsiz ayet.
            Hero ile tab arasında dramatic banner. */}
        <VakiaSpotlight language={language} isMobile={isMobile} />

        {/* ════ YEMİN → CEVAP INTERACTIVE REVEAL — Premium Tier B ════════════
            Visitor bir yemin'e tıklar, ardından gelen cevap cümlesi reveal
            olur. Yeminlerin asıl gücü buradadır: ne'ye yemin edildiği değil,
            yeminin ardından ne'nin geldiği. */}
        <YeminCevapReveal language={language} isMobile={isMobile} />

        {/* ── TAB BAR — directly above tab content (sticky, Melekler-reference) ─ */}
        <div id="yemin-tab-bar" style={{
          display: 'flex',
          gap: '2px',
          padding: isMobile ? '0 8px' : '0 16px',
          borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
          background: '#06080e',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          flexShrink: 0,
          position: 'sticky',
          top: 0,
          zIndex: 10,
          scrollMarginTop: '72px',
        }}>
          {TABS.map((tab, i) => {
            const isActive = activeTab === i;
            return (
              <button
                key={i}
                onClick={() => {
                  setActiveTab(i);
                  // Visitor 'değişiklik göremedim' hissi yaşamasın — tab
                  // bar viewport tepesine kaysın.
                  setTimeout(() => {
                    const tb = document.getElementById('yemin-tab-bar');
                    if (tb) tb.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 50);
                }}
                style={{
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: isMobile ? '14px 16px' : '15px 22px',
                  border: 'none',
                  background: isActive ? COLORS.goldAlpha15 : 'transparent',
                  borderBottom: isActive ? `2px solid ${COLORS.gold}` : '2px solid transparent',
                  borderRadius: '0',
                  color: isActive ? COLORS.gold : (COLORS.silverAlpha70 || COLORS.silver),
                  fontSize: isMobile ? '0.78rem' : '0.82rem',
                  fontWeight: isActive ? 700 : 500,
                  letterSpacing: isActive ? '0.14em' : '0.12em',
                  textTransform: 'uppercase',
                  fontFamily: FONTS.body,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = COLORS.offWhite; } }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = COLORS.silver; } }}
              >
                <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{tab.icon}</span>
                {!isMobile && <span>{language === 'tr' ? tab.tr : tab.en}</span>}
              </button>
            );
          })}
        </div>

        {/* ── TAB CONTENT ───────────────────────────────────────────────── */}
        <div style={{ padding: isMobile ? '20px 16px 40px' : '28px 32px 60px' }}>

          {/* Tab 0: Kategoriler — includes RadialViz/Accordion */}
          {activeTab === 0 && (
            <>
              {!isMobile ? (
                <RadialViz
                  categories={categories}
                  activeCategoryId={activeCategoryId}
                  onSelect={(id) => { setActiveCategoryId(id); }}
                  language={language}
                />
              ) : (
                <MobileAccordion
                  categories={categories}
                  expanded={expandedAccordion}
                  onToggle={(id) => setExpandedAccordion(expandedAccordion === id ? null : id)}
                  language={language}
                />
              )}
              <div style={{ marginTop: '24px' }}>
                <TabKategoriler
                  categories={categories}
                  activeCategoryId={activeCategoryId}
                  onSelect={setActiveCategoryId}
                  language={language}
                  isMobile={isMobile}
                />
              </div>
            </>
          )}

          {/* Tab 1: Derinlik Analizi */}
          {activeTab === 1 && (
            <TabDerinlik depthAnalysis={depthAnalysis} language={language} isMobile={isMobile} />
          )}

          {/* Tab 2: Sûre Dağılımı */}
          {activeTab === 2 && (
            <TabSureDagilimi categories={categories} meta={meta} language={language} isMobile={isMobile} />
          )}

          {/* Tab 3: İbn Kayyim */}
          {activeTab === 3 && (
            <TabIbnKayyim ibnQayyim={ibnQayyim} ibnKayyimPatterns={data.ibnKayyimPatterns} language={language} isMobile={isMobile} />
          )}

          {/* Tab 4: Kaynaklar */}
          {activeTab === 4 && (
            <TabKaynaklar sources={sources} language={language} isMobile={isMobile} />
          )}
        </div>

        {/* ════ CLOSING — Paradox Synthesis + Cross-tool CTA Strip ════════ */}
        <YeminlerClosing language={language} isMobile={isMobile} totalOaths={meta.totalOaths} />

        {/* ── MOBILE BOTTOM LINKS ───────────────────────────────────────── */}
        {isMobile && (
          <div style={{
            padding: '12px 16px',
            borderTop: `1px solid ${COLORS.glassBorderSoft}`,
            display: 'flex',
            gap: '8px',
          }}>
            <a href="https://corpus.quran.com" target="_blank" rel="noopener noreferrer"
              style={{ flex: 1, textAlign: 'center', padding: '8px', background: COLORS.glassBg, border: `1px solid ${COLORS.glassBorder}`, borderRadius: '8px', color: COLORS.silver, fontSize: '0.75rem', fontFamily: FONTS.body, textDecoration: 'none' }}>
              Corpus Quran
            </a>
            <a href="https://tanzil.net" target="_blank" rel="noopener noreferrer"
              style={{ flex: 1, textAlign: 'center', padding: '8px', background: COLORS.glassBg, border: `1px solid ${COLORS.glassBorder}`, borderRadius: '8px', color: COLORS.silver, fontSize: '0.75rem', fontFamily: FONTS.body, textDecoration: 'none' }}>
              Tanzil.net
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Radial Visualization ───────────────────────────────────────────────────────

function RadialViz({ categories, activeCategoryId, onSelect, language }) {
  const [hovered, setHovered] = useState(null);
  const cx = 200, cy = 200, r = 150, innerR = 80;
  const total = categories.reduce((s, c) => s + c.items.length, 0);

  const segments = categories.reduce((acc, cat) => {
    const prevEnd = acc.length > 0 ? acc[acc.length - 1].endAngle : -Math.PI / 2;
    const angle = (cat.items.length / total) * 2 * Math.PI;
    const endAngle = prevEnd + angle;
    acc.push({ cat, startAngle: prevEnd, endAngle, midAngle: prevEnd + angle / 2 });
    return acc;
  }, []);

  function arcPath(sa, ea, rOuter, rInner, cxp, cyp, gap = 0.02) {
    const sa2 = sa + gap, ea2 = ea - gap;
    const x1 = cxp + rOuter * Math.cos(sa2), y1 = cyp + rOuter * Math.sin(sa2);
    const x2 = cxp + rOuter * Math.cos(ea2), y2 = cyp + rOuter * Math.sin(ea2);
    const x3 = cxp + rInner * Math.cos(ea2), y3 = cyp + rInner * Math.sin(ea2);
    const x4 = cxp + rInner * Math.cos(sa2), y4 = cyp + rInner * Math.sin(sa2);
    const lg = ea2 - sa2 > Math.PI ? 1 : 0;
    return `M ${x1} ${y1} A ${rOuter} ${rOuter} 0 ${lg} 1 ${x2} ${y2} L ${x3} ${y3} A ${rInner} ${rInner} 0 ${lg} 0 ${x4} ${y4} Z`;
  }

  function labelPos(midAngle, rLabel) {
    return { x: cx + rLabel * Math.cos(midAngle), y: cy + rLabel * Math.sin(midAngle) };
  }

  const highlighted = hovered || activeCategoryId;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '48px',
      padding: '32px 40px',
      background: 'linear-gradient(135deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.08) 100%)',
      borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
      borderRadius: '16px',
      margin: '0 0 2px',
    }}>
      {/* SVG donut */}
      <div style={{ flexShrink: 0, position: 'relative' }}>
        <svg width="400" height="400" viewBox="0 0 400 400">
          <defs>
            {categories.map(cat => (
              <filter key={`glow-${cat.id}`} id={`glow-${cat.id}`}>
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            ))}
            <filter id="innerShadow">
              <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
              <feOffset dx="0" dy="2" />
              <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" />
              <feFlood floodColor="rgba(0,0,0,0.4)" />
              <feComposite in2="SourceGraphic" operator="in" />
              <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {segments.map(({ cat, startAngle: sa, endAngle: ea, midAngle }) => {
            const isActive = cat.id === highlighted;
            const isHov = cat.id === hovered;
            const ro = isActive ? r + 8 : r;
            const ri = isActive ? innerR - 4 : innerR;
            const path = arcPath(sa, ea, ro, ri, cx, cy);
            const lp = labelPos(midAngle, (ro + ri) / 2 + 2);
            const opacity = highlighted && !isActive ? 0.35 : isActive ? 1 : 0.65;
            return (
              <g key={cat.id}
                onClick={() => onSelect(cat.id)}
                onMouseEnter={() => setHovered(cat.id)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: 'pointer' }}
              >
                <path
                  d={path}
                  fill={cat.accent}
                  opacity={opacity}
                  filter={isActive ? `url(#glow-${cat.id})` : undefined}
                  style={{ transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)' }}
                />
                {isActive && (
                  <path
                    d={path}
                    fill="none"
                    stroke={cat.accent}
                    strokeWidth="1.5"
                    opacity="0.6"
                    style={{ transition: 'all 0.3s' }}
                  />
                )}
                <text
                  x={lp.x} y={lp.y}
                  textAnchor="middle" dominantBaseline="middle"
                  fill={isActive ? '#fff' : 'rgba(255,255,255,0.85)'}
                  fontSize={isActive ? '13' : '11'}
                  fontWeight="700"
                  fontFamily={FONTS.body}
                  opacity={opacity}
                  style={{ pointerEvents: 'none', transition: 'all 0.3s', textShadow: isActive ? '0 1px 4px rgba(0,0,0,0.5)' : 'none' }}
                >
                  {cat.items.length}
                </text>
                {isHov && !activeCategoryId && (
                  <text
                    x={cx} y={cy + 28}
                    textAnchor="middle" dominantBaseline="middle"
                    fill={cat.accent}
                    fontSize="10"
                    fontWeight="600"
                    fontFamily={FONTS.body}
                    style={{ pointerEvents: 'none' }}
                  >
                    {language === 'tr' ? cat.tr : cat.en}
                  </text>
                )}
              </g>
            );
          })}

          {/* Center circle with subtle depth */}
          <circle cx={cx} cy={cy} r={innerR - 8} fill="#0a0a1a" />
          <circle cx={cx} cy={cy} r={innerR - 8} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          <text x={cx} y={cy - 8} textAnchor="middle" fill={COLORS.gold} fontSize="32" fontWeight="800" fontFamily={FONTS.body}
            style={{ textShadow: '0 0 20px rgba(212,165,116,0.3)' }}>
            {total}
          </text>
          <text x={cx} y={cy + 16} textAnchor="middle" fill="rgba(148,163,184,0.6)" fontSize="11" fontWeight="500" fontFamily={FONTS.body} letterSpacing="0.1em">
            {language === 'tr' ? 'YEMİN' : 'OATHS'}
          </text>
        </svg>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '220px' }}>
        <div style={{
          color: 'rgba(148,163,184,0.5)', fontSize: '0.6rem', fontWeight: 700,
          letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: FONTS.body,
          marginBottom: '8px', paddingLeft: '12px',
        }}>
          {language === 'tr' ? 'Kategoriler' : 'Categories'}
        </div>
        {categories.map(cat => {
          const isActive = cat.id === highlighted;
          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              onMouseEnter={() => setHovered(cat.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '10px 14px', borderRadius: '10px', border: 'none',
                background: isActive ? `${cat.accent}14` : 'transparent',
                cursor: 'pointer', transition: 'all 0.2s ease', textAlign: 'left',
                outline: isActive ? `1px solid ${cat.accent}30` : '1px solid transparent',
              }}
            >
              <span style={{
                width: '10px', height: '10px', borderRadius: RADIUS.full,
                background: cat.accent, flexShrink: 0,
                boxShadow: isActive ? `0 0 8px ${cat.accent}60` : 'none',
                transition: 'box-shadow 0.2s',
              }} />
              <span style={{
                color: isActive ? COLORS.offWhite : 'rgba(232,230,227,0.65)',
                fontSize: '0.85rem', fontFamily: FONTS.body,
                fontWeight: isActive ? 600 : 400,
                flex: 1,
                transition: 'color 0.2s',
              }}>
                {language === 'tr' ? cat.tr : cat.en}
              </span>
              <span style={{
                color: isActive ? cat.accent : 'rgba(148,163,184,0.5)',
                fontSize: '0.78rem', fontFamily: FONTS.body, fontWeight: 700,
                minWidth: '24px', textAlign: 'right',
                transition: 'color 0.2s',
              }}>
                {cat.items.length}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Mobile Accordion ──────────────────────────────────────────────────────────

function MobileAccordion({ categories, expanded, onToggle, language }) {
  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', borderBottom: `1px solid ${COLORS.glassBorderSoft}` }}>
      <div style={{ color: COLORS.slate500, fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: FONTS.body, marginBottom: '4px' }}>
        {language === 'tr' ? 'Kategorilere göz at' : 'Browse categories'}
      </div>
      {categories.map(cat => {
        const isOpen = expanded === cat.id;
        return (
          <div key={cat.id} style={{
            background: isOpen ? `${cat.accent}10` : COLORS.glassBg,
            border: `1px solid ${isOpen ? cat.accent + '40' : COLORS.glassBorder}`,
            borderRadius: '10px', overflow: 'hidden',
          }}>
            <button
              onClick={() => onToggle(cat.id)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                padding: '12px 14px', border: 'none', background: 'transparent', cursor: 'pointer',
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: RADIUS.full, background: cat.accent, flexShrink: 0 }} />
              <span style={{ flex: 1, color: isOpen ? cat.accent : COLORS.offWhite, fontSize: '0.85rem', fontFamily: FONTS.body, fontWeight: isOpen ? 600 : 400, textAlign: 'left' }}>
                {language === 'tr' ? cat.tr : cat.en}
              </span>
              <span style={{ color: COLORS.slate500, fontSize: '0.75rem', fontFamily: FONTS.body }}>{cat.items.length}</span>
              <span style={{ color: COLORS.silver, fontSize: '0.8rem', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▾</span>
            </button>
            {isOpen && (
              <div style={{ padding: '0 14px 14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <p style={{ color: COLORS.silver, fontSize: '0.8rem', fontFamily: FONTS.body, margin: '0 0 8px' }}>
                  {language === 'tr' ? cat.descTr : cat.descEn}
                </p>
                {cat.items.map(item => (
                  <OathCard key={item.id} item={item} accent={cat.accent} language={language} compact />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Tab: Kategoriler ──────────────────────────────────────────────────────────

function TabKategoriler({ categories, activeCategoryId, onSelect, language, isMobile }) {
  const active = categories.find(c => c.id === activeCategoryId) ?? categories[0];

  return (
    <div>
      {/* Category chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '24px' }}>
        {categories.map(cat => {
          const isActive = cat.id === activeCategoryId;
          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              style={{
                padding: '5px 14px', borderRadius: '20px',
                border: `1px solid ${isActive ? cat.accent : COLORS.glassBorder}`,
                background: isActive ? `${cat.accent}22` : 'transparent',
                color: isActive ? cat.accent : COLORS.silver,
                fontSize: '0.8rem', fontWeight: isActive ? 600 : 400,
                fontFamily: FONTS.body, cursor: 'pointer', transition: 'all 0.15s',
              }}
            >
              {language === 'tr' ? cat.tr : cat.en} <span style={{ opacity: 0.7 }}>({cat.items.length})</span>
            </button>
          );
        })}
      </div>

      {/* Category description */}
      {active && (
        <>
          <p style={{ color: COLORS.silver, fontSize: '0.85rem', fontFamily: FONTS.body, marginBottom: '20px', lineHeight: 1.7 }}>
            {language === 'tr' ? active.descTr : active.descEn}
          </p>
          {/* Oath cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(380px, 1fr))',
            gap: '14px',
          }}>
            {active.items.map(item => (
              <OathCard key={item.id} item={item} accent={active.accent} language={language} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── Oath Card ─────────────────────────────────────────────────────────────────

function OathCard({ item, accent, language, compact = false }) {
  const [open, setOpen] = useState(false);
  const isCompound = item.isCompound && Array.isArray(item.compoundParts) && item.compoundParts.length > 0;
  const depth = language === 'tr' ? item.depthTr : item.depthEn;
  return (
    <div style={{
      background: COLORS.glassBg,
      border: `1px solid ${COLORS.glassBorder}`,
      borderRadius: '10px',
      overflow: 'hidden',
    }}>
      {/* Top accent band — category-colored */}
      <div style={{ height: '3px', background: `linear-gradient(90deg, ${accent} 0%, ${accent}55 80%, transparent 100%)` }} />

      <div style={{ padding: compact ? '12px 14px 14px' : '16px 18px 16px' }}>
        {/* Arabic */}
        <div style={{
          fontFamily: FONTS.quran, fontSize: compact ? '1.1rem' : '1.4rem',
          color: accent, direction: 'rtl', textAlign: 'right',
          lineHeight: 1.9, marginBottom: '8px',
        }} dir="rtl" lang="ar">
          {item.arabic}
        </div>
        {/* Translation + ref */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
          <span style={{ color: COLORS.offWhite, fontSize: '0.82rem', fontFamily: FONTS.body, fontStyle: 'italic', lineHeight: 1.5, flex: 1 }}>
            {language === 'tr' ? item.tr : item.en}
          </span>
          <span style={{ color: COLORS.slate500, fontSize: '0.72rem', fontFamily: FONTS.body, flexShrink: 0, paddingTop: '2px' }}>
            {item.ref}
          </span>
        </div>

        {!compact && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
            <span style={{ padding: '2px 8px', background: `${accent}18`, border: `1px solid ${accent}30`, borderRadius: '12px', color: accent, fontSize: '0.72rem', fontFamily: FONTS.body }}>
              {language === 'tr' ? item.subjectTr : item.subjectEn}
            </span>
            {isCompound && (
              <span style={{ padding: '2px 8px', background: 'rgba(167,139,250,0.12)', border: `1px solid rgba(167,139,250,0.35)`, borderRadius: '12px', color: '#a78bfa', fontSize: '0.7rem', fontFamily: FONTS.body, fontWeight: 600 }}>
                {language === 'tr' ? `🔗 Bileşik · ${item.compoundParts.length} öğe` : `🔗 Compound · ${item.compoundParts.length} parts`}
              </span>
            )}
            <span style={{ color: COLORS.slate500, fontSize: '0.72rem', fontFamily: FONTS.body, flex: 1, minWidth: 0 }}>
              {language === 'tr' ? item.purposeTr : item.purposeEn}
            </span>
          </div>
        )}

        {/* Default-visible depth preview (2 lines) — only on non-compact */}
        {!compact && depth && !open && (
          <p style={{
            color: COLORS.silver, fontSize: '0.8rem', fontFamily: FONTS.body,
            lineHeight: 1.65, margin: '12px 0 0',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {depth}
          </p>
        )}

        {/* Expand toggle button */}
        {!compact && (depth || isCompound) && (
          <button
            onClick={() => setOpen(o => !o)}
            style={{
              marginTop: '10px',
              padding: '4px 10px',
              background: 'transparent',
              border: `1px solid ${COLORS.glassBorder}`,
              borderRadius: '6px',
              color: accent,
              fontSize: '0.7rem',
              fontFamily: FONTS.body,
              fontWeight: 600,
              letterSpacing: '0.04em',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = `${accent}10`; e.currentTarget.style.borderColor = `${accent}45`; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = COLORS.glassBorder; }}
          >
            <span>{open
              ? (language === 'tr' ? 'Daralt' : 'Collapse')
              : (language === 'tr' ? (isCompound ? 'Bileşik parçalar + Detay' : 'Detayı göster') : (isCompound ? 'Compound parts + Detail' : 'Show detail'))
            }</span>
            <span style={{ fontSize: '0.7rem', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▾</span>
          </button>
        )}
      </div>

      {!compact && open && (
        <div style={{ padding: '0 18px 16px', borderTop: `1px solid ${COLORS.glassBorderSoft}` }}>
          {/* Compound parts breakdown */}
          {isCompound && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '14px 0 0' }}>
              <div style={{
                fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.14em', color: accent, fontFamily: FONTS.body, opacity: 0.85,
              }}>
                {language === 'tr' ? 'Bileşik Parçalar' : 'Compound Parts'}
              </div>
              {item.compoundParts.map((part, i) => (
                <div key={i} style={{
                  background: 'rgba(255,255,255,0.025)',
                  border: `1px solid ${COLORS.glassBorder}`,
                  borderLeft: `2px solid ${accent}`,
                  borderRadius: '8px',
                  padding: '10px 12px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '8px', marginBottom: '6px' }}>
                    <span style={{
                      fontFamily: FONTS.quran, fontSize: '1.1rem',
                      color: accent, direction: 'rtl',
                      lineHeight: 1.6,
                    }} dir="rtl" lang="ar">
                      {part.arabic}
                    </span>
                    <span style={{ color: COLORS.silver, fontSize: '0.72rem', fontFamily: FONTS.body, fontStyle: 'italic', textAlign: 'right' }}>
                      {language === 'tr' ? part.labelTr : part.labelEn}
                    </span>
                  </div>
                  <p style={{ color: COLORS.silver, fontSize: '0.78rem', fontFamily: FONTS.body, lineHeight: 1.65, margin: 0 }}>
                    {language === 'tr' ? part.noteTr : part.noteEn}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Full depth */}
          {depth && (
            <p style={{ color: COLORS.silver, fontSize: '0.82rem', fontFamily: FONTS.body, lineHeight: 1.7, margin: isCompound ? '14px 0 0' : '12px 0 0' }}>
              {depth}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ── Tab: Derinlik Analizi ─────────────────────────────────────────────────────

function TabDerinlik({ depthAnalysis, language, isMobile }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <p style={{ color: COLORS.silver, fontSize: '0.88rem', fontFamily: FONTS.body, lineHeight: 1.7, margin: 0 }}>
        {language === 'tr'
          ? "Kur'an'daki yemin yapıları üç farklı retorik form sergiler. Her form, mesajın pekiştirilmesinde farklı bir güç taşır."
          : "Oath structures in the Quran exhibit three distinct rhetorical forms. Each form carries a different power in reinforcing the message."
        }
      </p>
      {depthAnalysis.map((item, i) => (
        <div key={i} style={{
          background: 'rgba(255,255,255,0.025)',
          border: `1px solid ${COLORS.glassBorder}`,
          borderRadius: '14px',
          overflow: 'hidden',
          position: 'relative',
        }}>
          {/* Top accent line */}
          <div style={{ height: '2px', background: `linear-gradient(90deg, ${COLORS.gold} 0%, rgba(212,165,116,0.15) 60%, transparent 100%)` }} />

          {/* Header: numbered badge + title */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: isMobile ? '12px' : '16px',
            padding: isMobile ? '18px 16px 14px' : '22px 28px 16px',
          }}>
            <div style={{
              width: '34px', height: '34px', borderRadius: RADIUS.full,
              background: 'rgba(212,165,116,0.08)',
              border: `1px solid ${COLORS.goldAlpha25}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.78rem', fontWeight: 800, color: COLORS.gold,
              fontFamily: FONTS.body, flexShrink: 0, letterSpacing: '0.02em',
            }}>
              {String(i + 1).padStart(2, '0')}
            </div>
            <h3 style={{
              color: COLORS.gold, fontSize: isMobile ? '1rem' : '1.08rem',
              fontWeight: 700, fontFamily: FONTS.body, margin: 0, lineHeight: 1.35,
            }}>
              {language === 'tr' ? item.titleTr : item.titleEn}
            </h3>
          </div>

          {/* Body */}
          <div style={{ padding: isMobile ? '0 16px 20px' : '0 28px 26px' }}>
            {/* Verse with gold left accent — pure dark bg for Quran readability */}
            <div style={{
              ...VERSE_DISPLAY_CARD,
              padding: '14px 18px', marginBottom: '18px',
            }}>
              <div style={{
                fontFamily: FONTS.quran, fontSize: isMobile ? '1.4rem' : '1.55rem',
                color: COLORS.gold, direction: 'rtl', textAlign: 'right',
                lineHeight: 1.9, marginBottom: '10px',
              }} dir="rtl" lang="ar">
                {item.arabic}
              </div>
              <p style={{
                color: COLORS.offWhite, fontSize: '0.85rem',
                fontFamily: FONTS.body, fontStyle: 'italic',
                margin: 0, lineHeight: 1.6,
              }}>
                {language === 'tr' ? item.mealTr : item.mealEn}
              </p>
            </div>

            {/* Explanation label */}
            <div style={{
              fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '0.14em', color: COLORS.gold,
              fontFamily: FONTS.body, marginBottom: '10px', opacity: 0.75,
            }}>
              {language === 'tr' ? 'Açıklama' : 'Explanation'}
            </div>
            <p style={{
              color: COLORS.silver, fontSize: '0.9rem',
              fontFamily: FONTS.body, lineHeight: 1.8, margin: 0,
            }}>
              {language === 'tr' ? item.bodyTr : item.bodyEn}
            </p>

            {/* Structured examples: subject → purpose */}
            {item.examples && item.examples.length > 0 && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : `repeat(${item.examples.length}, 1fr)`,
                gap: '10px', marginTop: '16px',
              }}>
                {item.examples.map((ex, j) => (
                  <div key={j} style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: `1px solid ${COLORS.glassBorder}`,
                    borderRadius: '10px',
                    padding: '14px 14px 12px',
                    display: 'flex', flexDirection: 'column', gap: '8px',
                    position: 'relative', overflow: 'hidden',
                  }}>
                    {/* Arabic word — large, gold */}
                    <div style={{
                      fontFamily: FONTS.quran, fontSize: '1.4rem',
                      color: COLORS.gold, direction: 'rtl', textAlign: 'right',
                      lineHeight: 1.4, margin: 0,
                    }} dir="rtl" lang="ar">
                      {ex.subjectAr}
                    </div>
                    {/* Subject label */}
                    <div style={{
                      fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase',
                      letterSpacing: '0.1em', color: COLORS.silver,
                      fontFamily: FONTS.body,
                    }}>
                      {language === 'tr' ? ex.subjectTr : ex.subjectEn}
                    </div>
                    {/* Arrow */}
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      paddingTop: '4px', borderTop: `1px dashed ${COLORS.goldAlpha15}`,
                      marginTop: '2px',
                    }}>
                      <span style={{
                        color: COLORS.gold, fontSize: '0.95rem',
                        fontFamily: FONTS.body, flexShrink: 0,
                      }}>→</span>
                      <span style={{
                        color: COLORS.offWhite, fontSize: '0.82rem',
                        fontFamily: FONTS.body, lineHeight: 1.45, fontWeight: 500,
                      }}>
                        {language === 'tr' ? ex.purposeTr : ex.purposeEn}
                      </span>
                    </div>
                    {/* Why this link? context (semantic bond) */}
                    {(ex.contextTr || ex.contextEn) && (
                      <div style={{
                        fontSize: '0.75rem', color: COLORS.silver,
                        fontFamily: FONTS.body, lineHeight: 1.55,
                        fontStyle: 'italic', marginTop: '2px',
                        paddingTop: '8px', borderTop: `1px solid ${COLORS.glassBorder}`,
                      }}>
                        {language === 'tr' ? ex.contextTr : ex.contextEn}
                      </div>
                    )}

                    {/* Textual link: jawāb al-qasam (how the sura makes it explicit) */}
                    {ex.linkAr && (
                      <div style={{
                        marginTop: '6px', padding: '10px 12px',
                        background: 'transparent',
                        border: `1px solid ${COLORS.glassBorder}`,
                        borderLeft: `2px solid ${COLORS.gold}`,
                        borderRadius: '8px',
                        display: 'flex', flexDirection: 'column', gap: '6px',
                      }}>
                        {(ex.linkIntroTr || ex.linkIntroEn) && (
                          <div style={{
                            fontSize: '0.68rem', color: COLORS.silver,
                            fontFamily: FONTS.body, lineHeight: 1.5,
                          }}>
                            {language === 'tr' ? ex.linkIntroTr : ex.linkIntroEn}
                          </div>
                        )}
                        <div style={{
                          fontFamily: FONTS.quran, fontSize: '1.15rem',
                          color: COLORS.gold, direction: 'rtl', textAlign: 'right',
                          lineHeight: 1.7,
                        }} dir="rtl" lang="ar">
                          {ex.linkAr}
                        </div>
                        <div style={{
                          display: 'flex', justifyContent: 'space-between',
                          alignItems: 'baseline', gap: '8px', flexWrap: 'wrap',
                        }}>
                          <span style={{
                            fontSize: '0.72rem', color: COLORS.offWhite,
                            fontFamily: FONTS.body, fontStyle: 'italic',
                            lineHeight: 1.45, flex: 1,
                          }}>
                            {language === 'tr' ? ex.linkTr : ex.linkEn}
                          </span>
                          {ex.linkVerse && (
                            <span style={{
                              fontSize: '0.65rem', color: COLORS.goldAlpha45,
                              fontFamily: FONTS.body, fontWeight: 700,
                              flexShrink: 0,
                            }}>
                              {ex.linkVerse}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Reference (full pericope) */}
                    {ex.refShort && (
                      <div style={{
                        fontSize: '0.65rem', color: COLORS.silver,
                        fontFamily: FONTS.body, fontWeight: 600,
                        marginTop: '2px', opacity: 0.7,
                      }}>
                        {ex.refShort}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Structured functions: 3 distinct roles of the oath */}
            {item.functions && item.functions.length > 0 && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : `repeat(${item.functions.length}, 1fr)`,
                gap: '10px', marginTop: '16px',
              }}>
                {item.functions.map((fn, j) => (
                  <div key={j} style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: `1px solid ${COLORS.glassBorder}`,
                    borderRadius: '10px',
                    padding: '16px 16px 14px',
                    display: 'flex', flexDirection: 'column', gap: '10px',
                    position: 'relative',
                  }}>
                    {/* Number + title row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '26px', height: '26px', borderRadius: RADIUS.full,
                        background: 'rgba(212,165,116,0.08)',
                        border: `1px solid ${COLORS.goldAlpha25}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.68rem', fontWeight: 800, color: COLORS.gold,
                        fontFamily: FONTS.body, flexShrink: 0, letterSpacing: '0.02em',
                      }}>
                        {String(j + 1).padStart(2, '0')}
                      </div>
                      <div style={{
                        fontSize: '0.88rem', fontWeight: 700, color: COLORS.gold,
                        fontFamily: FONTS.body, lineHeight: 1.3,
                      }}>
                        {language === 'tr' ? fn.titleTr : fn.titleEn}
                      </div>
                    </div>
                    {/* Description */}
                    <div style={{
                      fontSize: '0.8rem', color: COLORS.silver,
                      fontFamily: FONTS.body, lineHeight: 1.6,
                      paddingTop: '2px', borderTop: `1px dashed ${COLORS.goldAlpha15}`,
                    }}>
                      {language === 'tr' ? fn.descTr : fn.descEn}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Closing line after functions */}
            {(item.closingTr || item.closingEn) && (
              <p style={{
                color: COLORS.silver, fontSize: '0.88rem',
                fontFamily: FONTS.body, lineHeight: 1.75,
                margin: '16px 0 0', fontStyle: 'italic',
              }}>
                {language === 'tr' ? item.closingTr : item.closingEn}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Tab: Sûre Dağılımı ────────────────────────────────────────────────────────

function TabSureDagilimi({ categories, meta, language, isMobile }) {
  // Build surah distribution from all items
  const surahMap = {};
  categories.forEach(cat => {
    cat.items.forEach(item => {
      const key = item.ref.split(' ')[0]; // e.g. "Şems"
      if (!surahMap[key]) surahMap[key] = { count: 0, accent: cat.accent };
      surahMap[key].count++;
    });
  });

  const sorted = Object.entries(surahMap).sort((a, b) => b[1].count - a[1].count);
  const maxCount = sorted[0]?.[1].count ?? 1;
  const total = sorted.reduce((s, [, v]) => s + v.count, 0);

  return (
    <div>
      <p style={{ color: COLORS.silver, fontSize: '0.88rem', fontFamily: FONTS.body, lineHeight: 1.7, margin: '0 0 24px' }}>
        {language === 'tr'
          ? `${sorted.length} farklı sûrede toplam ${total} yemin ifadesi bulunuyor. ${sorted[0]?.[0]} en fazla yemin içeren sûredir.`
          : `${total} oath expressions are found across ${sorted.length} different surahs. ${sorted[0]?.[0]} contains the most oaths.`
        }
      </p>

      {/* Stat callouts */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
        {[
          { value: sorted.length, labelTr: 'Sûre', labelEn: 'Surahs', color: COLORS.gold },
          { value: total, labelTr: 'Bileşik Yemin', labelEn: 'Compound Oaths', color: '#3498db' },
          { value: sorted[0]?.[0], labelTr: 'En Çok Yemin', labelEn: 'Most Oaths', color: '#2ecc71', small: true },
          { value: sorted[0]?.[1].count, labelTr: `${sorted[0]?.[0]} Yemini`, labelEn: `${sorted[0]?.[0]} Oaths`, color: '#e74c3c' },
        ].map((s, i) => (
          <div key={i} style={{
            background: `${s.color}10`, border: `1px solid ${s.color}25`,
            borderRadius: '10px', padding: '14px', textAlign: 'center',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ color: s.color, fontSize: s.small ? '1rem' : '1.6rem', fontWeight: 700, fontFamily: FONTS.body, lineHeight: 1 }}>
              {s.value}
            </div>
            <div style={{ color: COLORS.slate500, fontSize: '0.7rem', fontFamily: FONTS.body, marginTop: '5px' }}>
              {language === 'tr' ? s.labelTr : s.labelEn}
            </div>
          </div>
        ))}
      </div>

      {/* Meccan/Medinan finding — strongest single insight */}
      {meta && typeof meta.meccanCount === 'number' && (
        <div style={{
          padding: isMobile ? '14px 16px' : '18px 22px',
          background: 'linear-gradient(90deg, rgba(212,165,116,0.08) 0%, rgba(212,165,116,0.02) 100%)',
          border: `1px solid ${COLORS.goldAlpha25}`,
          borderRadius: '12px',
          marginBottom: '28px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '220px' }}>
              <div style={{ color: COLORS.gold, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: FONTS.body, marginBottom: '4px' }}>
                {language === 'tr' ? 'Mekkî / Medenî Dağılımı' : 'Meccan / Medinan Distribution'}
              </div>
              <div style={{ color: COLORS.offWhite, fontSize: isMobile ? '1rem' : '1.1rem', fontWeight: 700, fontFamily: FONTS.body, lineHeight: 1.4 }}>
                {language === 'tr'
                  ? `Yemin içeren ${meta.surahsWithOaths} sûrenin tamamı Mekkî dönem ağırlıklı`
                  : `All ${meta.surahsWithOaths} oath-containing surahs are predominantly Meccan`
                }
              </div>
            </div>
            {/* Visual ratio bar */}
            <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: isMobile ? '100px' : '160px', height: '24px', background: COLORS.glassBg, borderRadius: '6px', overflow: 'hidden', display: 'flex' }}>
                <div style={{
                  width: `${(meta.meccanCount / meta.surahsWithOaths) * 100}%`,
                  background: 'linear-gradient(90deg, #c9a227, #d4a574)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: COLORS.cosmicBlack, fontSize: '0.72rem', fontWeight: 800, fontFamily: FONTS.body,
                }}>
                  {meta.meccanCount}
                </div>
                {meta.medinanCount > 0 && (
                  <div style={{
                    flex: 1, background: '#2ecc71',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: COLORS.cosmicBlack, fontSize: '0.72rem', fontWeight: 800, fontFamily: FONTS.body,
                  }}>
                    {meta.medinanCount}
                  </div>
                )}
              </div>
              <span style={{ color: COLORS.silver, fontSize: '0.78rem', fontFamily: FONTS.body, fontWeight: 600 }}>
                {meta.meccanCount}/{meta.surahsWithOaths}
              </span>
            </div>
          </div>
          {meta.meccanNoteTr && (
            <p style={{ color: COLORS.silver, fontSize: '0.78rem', fontFamily: FONTS.body, lineHeight: 1.65, margin: '10px 0 0', fontStyle: 'italic' }}>
              {language === 'tr' ? meta.meccanNoteTr : meta.meccanNoteEn}
            </p>
          )}
        </div>
      )}

      {/* Bar chart */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {sorted.map(([surah, { count }]) => (
          <div key={surah} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ width: isMobile ? '70px' : '100px', color: COLORS.offWhite, fontSize: '0.8rem', fontFamily: FONTS.body, flexShrink: 0, textAlign: 'right' }}>
              {surah}
            </span>
            <div style={{ flex: 1, height: '20px', background: COLORS.glassBg, borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{
                width: `${(count / maxCount) * 100}%`,
                height: '100%',
                background: 'linear-gradient(90deg, rgba(212,165,116,0.8), rgba(212,165,116,0.5))',
                borderRadius: '4px',
                transition: 'width 0.5s ease',
                display: 'flex', alignItems: 'center', paddingLeft: '8px',
              }}>
                <span style={{ color: COLORS.cosmicBlack, fontSize: '0.72rem', fontWeight: 700, fontFamily: FONTS.body }}>
                  {count}
                </span>
              </div>
            </div>
            <span style={{ width: '24px', color: COLORS.slate500, fontSize: '0.75rem', fontFamily: FONTS.body, textAlign: 'right' }}>
              {count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Tab: İbn Kayyim ───────────────────────────────────────────────────────────

function TabIbnKayyim({ ibnQayyim, ibnKayyimPatterns, language, isMobile }) {
  return (
    <div>
      {/* Thesis intro */}
      <div style={{
        background: 'rgba(212,165,116,0.06)',
        border: `1px solid ${COLORS.goldAlpha25}`,
        borderLeft: `4px solid ${COLORS.gold}`,
        borderRadius: '10px',
        padding: isMobile ? '18px 16px' : '24px 28px',
        marginBottom: '24px',
      }}>
        <div style={{ color: COLORS.slate500, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: FONTS.body, marginBottom: '12px' }}>
          {language === 'tr' ? 'İbn Kayyim el-Cevziyye — Temel Tez' : 'Ibn Qayyim al-Jawziyya — Core Thesis'}
        </div>
        <p style={{ color: COLORS.offWhite, fontSize: isMobile ? '0.95rem' : '1.05rem', fontFamily: FONTS.body, lineHeight: 1.75, margin: '0 0 16px', fontStyle: 'italic' }}>
          {language === 'tr' ? ibnQayyim.thesisTr : ibnQayyim.thesisEn}
        </p>
        {/* Book name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: COLORS.slate500, fontSize: '0.75rem', fontFamily: FONTS.body }}>
            {language === 'tr' ? 'Kaynak:' : 'Source:'}
          </span>
          <span style={{ color: COLORS.gold, fontSize: '0.8rem', fontFamily: FONTS.body, fontWeight: 600 }}>
            {language === 'tr' ? ibnQayyim.bookTr : ibnQayyim.bookEn}
          </span>
        </div>
      </div>

      {/* Pull quote — a 3-clause logical chain */}
      {(() => {
        const raw = language === 'tr' ? ibnQayyim.pullQuoteTr : ibnQayyim.pullQuoteEn;
        const clauses = (raw || '').replace(/^["""]/u, '').replace(/["""]$/u, '')
          .split(/\.\s+/).map(s => s.trim()).filter(Boolean);
        return (
          <div style={{
            position: 'relative',
            padding: isMobile ? '28px 20px 24px' : '36px 48px 32px',
            marginBottom: '28px',
            borderTop: `1px solid ${COLORS.goldAlpha15}`,
            borderBottom: `1px solid ${COLORS.goldAlpha15}`,
            background: 'linear-gradient(180deg, rgba(212,165,116,0.02) 0%, transparent 60%, rgba(212,165,116,0.02) 100%)',
          }}>
            {/* Clause chain */}
            <div style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: '10px',
              textAlign: 'center',
            }}>
              {clauses.map((clause, i) => (
                <div key={i} style={{ display: 'contents' }}>
                  <p style={{
                    color: COLORS.offWhite,
                    fontSize: isMobile ? '0.95rem' : '1.15rem',
                    fontFamily: FONTS.display, fontStyle: 'italic',
                    lineHeight: 1.55, margin: 0, maxWidth: '640px',
                  }}>
                    {clause}.
                  </p>
                  {i < clauses.length - 1 && (
                    <div style={{
                      color: COLORS.gold, fontSize: '0.9rem',
                      opacity: 0.55, lineHeight: 1,
                    }}>
                      ↓
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Attribution */}
            <div style={{
              textAlign: 'center', marginTop: '20px',
              fontSize: '0.72rem', fontWeight: 600,
              color: COLORS.silver, fontFamily: FONTS.body,
              letterSpacing: '0.06em',
            }}>
              — {language === 'tr' ? 'İbn Kayyim el-Cevziyye' : 'Ibn Qayyim al-Jawziyya'}
            </div>
          </div>
        );
      })()}

      {/* Explanation cards — match Derinlik Analizi card style */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {ibnQayyim.cards.map((card, i) => (
          <div key={i} style={{
            background: 'rgba(255,255,255,0.025)',
            border: `1px solid ${COLORS.glassBorder}`,
            borderRadius: '12px',
            overflow: 'hidden',
            position: 'relative',
          }}>
            {/* Top accent line */}
            <div style={{
              height: '2px',
              background: `linear-gradient(90deg, ${COLORS.gold} 0%, rgba(212,165,116,0.15) 60%, transparent 100%)`,
            }} />

            {/* Header with number badge + title */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: isMobile ? '12px' : '14px',
              padding: isMobile ? '16px 16px 10px' : '20px 24px 12px',
            }}>
              <div style={{
                width: '30px', height: '30px', borderRadius: RADIUS.full,
                background: 'rgba(212,165,116,0.08)',
                border: `1px solid ${COLORS.goldAlpha25}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.72rem', fontWeight: 800, color: COLORS.gold,
                fontFamily: FONTS.body, flexShrink: 0, letterSpacing: '0.02em',
              }}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <h4 style={{
                color: COLORS.gold, fontSize: '0.95rem',
                fontWeight: 700, fontFamily: FONTS.body,
                margin: 0, lineHeight: 1.35,
              }}>
                {language === 'tr' ? card.titleTr : card.titleEn}
              </h4>
            </div>

            {/* Body */}
            <div style={{ padding: isMobile ? '0 16px 16px' : '0 24px 20px' }}>
              <p style={{
                color: COLORS.silver, fontSize: '0.88rem',
                fontFamily: FONTS.body, lineHeight: 1.75, margin: 0,
              }}>
                {language === 'tr' ? card.bodyTr : card.bodyEn}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── İbn Kayyim'in Tasnifleri — Zıt Çiftler ─────────────────────────── */}
      {ibnKayyimPatterns && Array.isArray(ibnKayyimPatterns.patterns) && ibnKayyimPatterns.patterns.length > 0 && (
        <div style={{ marginTop: '32px' }}>
          {/* Section heading */}
          <div style={{
            paddingBottom: '12px',
            borderBottom: `1px solid ${COLORS.goldAlpha25}`,
            marginBottom: '20px',
          }}>
            <div style={{ color: COLORS.slate500, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: FONTS.body, marginBottom: '6px' }}>
              {language === 'tr' ? "İbn Kayyim'in Tasnifleri" : "Ibn Qayyim's Classifications"}
            </div>
            <h3 style={{ color: COLORS.gold, fontSize: isMobile ? '1.05rem' : '1.2rem', fontWeight: 700, fontFamily: FONTS.body, margin: '0 0 8px', lineHeight: 1.35 }}>
              {language === 'tr' ? ibnKayyimPatterns.titleTr : ibnKayyimPatterns.titleEn}
            </h3>
            <p style={{ color: COLORS.silver, fontSize: '0.85rem', fontFamily: FONTS.body, lineHeight: 1.7, margin: 0 }}>
              {language === 'tr' ? ibnKayyimPatterns.descTr : ibnKayyimPatterns.descEn}
            </p>
          </div>

          {/* Pattern blocks */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {ibnKayyimPatterns.patterns.map((pattern, pi) => (
              <div key={pattern.id || pi} style={{
                background: 'rgba(255,255,255,0.025)',
                border: `1px solid ${COLORS.glassBorder}`,
                borderRadius: '12px',
                overflow: 'hidden',
              }}>
                <div style={{ height: '2px', background: `linear-gradient(90deg, ${COLORS.gold} 0%, rgba(212,165,116,0.15) 60%, transparent 100%)` }} />

                <div style={{ padding: isMobile ? '16px 16px 10px' : '22px 26px 14px' }}>
                  <div style={{ fontFamily: FONTS.quran, fontSize: '1.4rem', color: COLORS.gold, direction: 'rtl', textAlign: 'right', lineHeight: 1.6, marginBottom: '8px' }} dir="rtl" lang="ar">
                    {pattern.arabicName}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: COLORS.slate500, fontFamily: FONTS.body, fontStyle: 'italic', marginBottom: '10px', letterSpacing: '0.04em' }}>
                    {pattern.transliteration}
                  </div>
                  <h4 style={{ color: COLORS.gold, fontSize: '1rem', fontWeight: 700, fontFamily: FONTS.body, margin: '0 0 10px' }}>
                    {language === 'tr' ? pattern.nameTr : pattern.nameEn}
                  </h4>
                  <p style={{ color: COLORS.silver, fontSize: '0.85rem', fontFamily: FONTS.body, lineHeight: 1.7, margin: 0 }}>
                    {language === 'tr' ? pattern.descTr : pattern.descEn}
                  </p>
                </div>

                {/* Pairs */}
                {Array.isArray(pattern.pairs) && pattern.pairs.length > 0 && (
                  <div style={{ padding: isMobile ? '0 16px 16px' : '0 26px 22px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {pattern.pairs.map((pair, pj) => (
                      <div key={pair.id || pj} style={{
                        background: 'rgba(0,0,0,0.18)',
                        border: `1px solid ${COLORS.glassBorder}`,
                        borderRadius: '10px',
                        padding: '14px 16px',
                      }}>
                        {/* Pair header — two opposing items */}
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: isMobile ? '1fr' : '1fr auto 1fr',
                          gap: isMobile ? '10px' : '14px',
                          alignItems: 'center',
                          marginBottom: '12px',
                        }}>
                          <div style={{ textAlign: isMobile ? 'left' : 'right' }}>
                            <div style={{ color: COLORS.gold, fontSize: '0.88rem', fontWeight: 700, fontFamily: FONTS.body, lineHeight: 1.3 }}>
                              {language === 'tr' ? pair.firstLabelTr : pair.firstLabelEn}
                            </div>
                            <div style={{ color: COLORS.slate500, fontSize: '0.7rem', fontFamily: FONTS.body, marginTop: '2px' }}>
                              {pair.firstVerseRef}
                            </div>
                          </div>
                          <div style={{
                            color: COLORS.gold, fontSize: '0.95rem', opacity: 0.6,
                            fontFamily: FONTS.body, textAlign: 'center',
                            transform: isMobile ? 'rotate(90deg)' : 'none',
                          }}>
                            ⇋
                          </div>
                          <div style={{ textAlign: 'left' }}>
                            <div style={{ color: COLORS.gold, fontSize: '0.88rem', fontWeight: 700, fontFamily: FONTS.body, lineHeight: 1.3 }}>
                              {language === 'tr' ? pair.secondLabelTr : pair.secondLabelEn}
                            </div>
                            <div style={{ color: COLORS.slate500, fontSize: '0.7rem', fontFamily: FONTS.body, marginTop: '2px' }}>
                              {pair.secondVerseRef}
                            </div>
                          </div>
                        </div>

                        {/* Thematic */}
                        <div style={{
                          fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase',
                          letterSpacing: '0.14em', color: COLORS.gold, fontFamily: FONTS.body,
                          opacity: 0.75, marginBottom: '6px',
                        }}>
                          {language === 'tr' ? 'Tema' : 'Theme'}
                        </div>
                        <div style={{ color: COLORS.offWhite, fontSize: '0.82rem', fontFamily: FONTS.body, fontStyle: 'italic', marginBottom: '10px' }}>
                          {language === 'tr' ? pair.thematicTr : pair.thematicEn}
                        </div>

                        {pair.sameVerseNote && (
                          <div style={{
                            fontSize: '0.72rem', color: COLORS.silver, fontFamily: FONTS.body,
                            fontStyle: 'italic', lineHeight: 1.55,
                            background: COLORS.goldAlpha04,
                            border: `1px dashed ${COLORS.goldAlpha25}`,
                            borderRadius: '6px', padding: '8px 10px', marginBottom: '10px',
                          }}>
                            {language === 'tr' ? pair.sameVerseNote : pair.sameVerseNoteEn}
                          </div>
                        )}

                        <p style={{ color: COLORS.silver, fontSize: '0.8rem', fontFamily: FONTS.body, lineHeight: 1.7, margin: 0 }}>
                          {language === 'tr' ? pair.depthTr : pair.depthEn}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Scholar note */}
                {pattern.scholarNote && (
                  <div style={{
                    margin: isMobile ? '0 16px 16px' : '0 26px 22px',
                    padding: '12px 14px',
                    background: 'rgba(212,165,116,0.05)',
                    border: `1px solid ${COLORS.goldAlpha25}`,
                    borderLeft: `2px solid ${COLORS.gold}`,
                    borderRadius: '8px',
                  }}>
                    <div style={{ color: COLORS.gold, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px', fontFamily: FONTS.body }}>
                      {language === 'tr' ? 'Klasik Kaynak' : 'Classical Source'}
                    </div>
                    <div style={{ color: COLORS.silver, fontSize: '0.75rem', fontFamily: FONTS.body, fontStyle: 'italic', marginBottom: '8px' }}>
                      {language === 'tr' ? pattern.scholarNote.sourceTr : pattern.scholarNote.sourceEn}
                    </div>
                    <p style={{ color: COLORS.offWhite, fontSize: '0.8rem', fontFamily: FONTS.body, lineHeight: 1.65, margin: 0 }}>
                      {language === 'tr' ? pattern.scholarNote.commentaryTr : pattern.scholarNote.commentaryEn}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── YÖNTEM UYGULAMADA — 3 Ünlü Yemin Sûresi ──────────────────── */}
      <div style={{ marginTop: '36px' }}>
        <div style={{
          paddingBottom: '12px',
          borderBottom: `1px solid ${COLORS.goldAlpha25}`,
          marginBottom: '20px',
        }}>
          <div style={{ color: COLORS.slate500, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: FONTS.body, marginBottom: '6px' }}>
            {language === 'tr' ? "Yöntem Uygulamada" : "The Method in Action"}
          </div>
          <h3 style={{ color: COLORS.gold, fontSize: isMobile ? '1.05rem' : '1.2rem', fontWeight: 700, fontFamily: FONTS.body, margin: '0 0 8px', lineHeight: 1.35 }}>
            {language === 'tr' ? "Üç Ünlü Yemin Sûresi — İbn Kayyim'in Merceğinden" : "Three Famous Oath Surahs — Through Ibn Qayyim's Lens"}
          </h3>
          <p style={{ color: COLORS.silver, fontSize: '0.85rem', fontFamily: FONTS.body, lineHeight: 1.7, margin: 0 }}>
            {language === 'tr'
              ? "Her yeminin üç boyutu: yemin objesi (muksam bihi), yemin cevabı (muksam aleyhi) ve aralarındaki örtük ilişki (münâsebe). İbn Kayyim'in tezi: yemin objesi, cevabın doğruluğunu içkin olarak gösterir."
              : "Three dimensions of every oath: the object sworn by (muqsam bihi), the matter sworn upon (muqsam ʿalayhi), and the implicit relationship (munāsaba). Ibn Qayyim's thesis: the oath-object inherently demonstrates the truth of the oath-subject."}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            {
              ar: "وَالشَّمْسِ وَضُحَاهَا · قَدْ اَفْلَحَ مَنْ زَكَّاهَا",
              ref: language === 'tr' ? "Şems 91:1-10" : "Al-Shams 91:1-10",
              objectTr: "7'li yemin zinciri: güneş + ay + gündüz + gece + gök + yer + nefs",
              objectEn: "Sevenfold oath chain: sun + moon + day + night + sky + earth + soul",
              answerTr: "\"Nefsini arındıran kurtulmuştur, kötülüklere gömen ise zarar etmiştir.\"",
              answerEn: "\"He who purifies his soul has succeeded; he who corrupts it has lost.\"",
              relationTr: "Tüm yemin objeleri 'tezatlar arası denge' örneği: gündüz ↔ gece, gök ↔ yer, güneş ↔ ay. Nefs de aynı tezat ekseninde — fücur ↔ takvâ. Yedi kozmik tanık, bir psikolojik gerçeği teyit eder.",
              relationEn: "Every oath-object exemplifies 'balance amid opposites': day ↔ night, sky ↔ earth, sun ↔ moon. The soul moves along the same axis — fujūr ↔ taqwā. Seven cosmic witnesses confirm one psychological truth.",
            },
            {
              ar: "وَالْعَصْرِ · اِنَّ الْاِنْسَانَ لَفِي خُسْرٍ",
              ref: language === 'tr' ? "Asr 103:1-3" : "Al-ʿAṣr 103:1-3",
              objectTr: "Asr — zaman (gündüz vakti? mutlak süre? Resul'ün asrı?)",
              objectEn: "Al-ʿAṣr — time (the afternoon? absolute duration? the age of the Messenger?)",
              answerTr: "\"İnsan gerçekten ziyandadır.\"",
              answerEn: "\"Humankind is truly in loss.\"",
              relationTr: "İmam Şafiî'nin ünlü sözü: \"Bu sûreden başka inmeseydi yeterdi.\" Yemin objesi (akıp giden zaman) cevabı (insanın ziyanı) içinde taşır — zaman geçtikçe sermaye eksilir, ancak iman+amel+tavsiye-i hak+sabr bu denklemi tersine çevirir. İbn Kayyim'in 'objesi cevabı kanıtlar' tezinin en saf örneği.",
              relationEn: "Imam al-Shāfiʿī's famous line: 'Had only this sura been revealed, it would suffice.' The oath-object (flowing time) carries the answer (humankind's loss) within itself — as time passes, capital depletes; only iman + ʿamal + counsel to truth + patience reverses the equation. The purest example of Ibn Qayyim's 'the object proves the subject' thesis.",
            },
            {
              ar: "فَلَا اُقْسِمُ بِمَوَاقِعِ النُّجُومِ · اِنَّهُ لَقُرْاٰنٌ كَرِيمٌ",
              ref: language === 'tr' ? "Vâkıa 56:75-77" : "Al-Wāqiʿa 56:75-77",
              objectTr: "Yıldızların \"konumları\" (mevâkiʿu'n-nucûm) — sadece yıldızlar değil yörüngeleri",
              objectEn: "The 'locations of the stars' (mawāqiʿ al-nujūm) — not the stars themselves but their positions",
              answerTr: "\"Bu, gerçekten değerli bir Kur'an'dır.\"",
              answerEn: "\"Indeed, it is a noble Quran.\"",
              relationTr: "Kur'an, kendi ininin \"yıldızların konumları\" gibi olduğunu söyler — parça parça, hesaplı, evrensel düzene yerleşmiş. Modern astronomi açısından da dikkat çekici: yıldızı değil 'konumunu' anar — ışığın geliş süresi nedeniyle gördüğümüz, yıldızın geçmiş konumudur. İbn Kayyim'in 'gizli ilişki' (münâsebe hafiyye) örneği: yemin objesi bir kozmoloji, cevap o kozmolojiye dair bir metin.",
              relationEn: "The Quran says its own descent resembles 'the locations of the stars' — in stages, by calculation, placed within universal order. Notably for modern astronomy: not the star but its 'location' — what we see, due to light travel, is the star's past position. Ibn Qayyim's 'hidden relationship' (munāsaba khafiyya) at work: the oath-object is a cosmology, the answer is a text about that cosmology.",
            },
          ].map((ex, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.025)',
              border: `1px solid ${COLORS.glassBorder}`,
              borderRadius: '12px',
              overflow: 'hidden',
            }}>
              <div style={{ height: '2px', background: `linear-gradient(90deg, ${COLORS.gold} 0%, rgba(212,165,116,0.15) 60%, transparent 100%)` }} />
              <div style={{ padding: isMobile ? '18px 16px' : '22px 26px' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '12px', marginBottom: '14px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: COLORS.gold, opacity: 0.85, letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: FONTS.body }}>
                    {String(i + 1).padStart(2, '0')} · {ex.ref}
                  </span>
                </div>
                <p dir="rtl" lang="ar" style={{ fontFamily: FONTS.quran, fontSize: isMobile ? '1.2rem' : '1.4rem', color: COLORS.gold, lineHeight: 2.0, margin: '0 0 18px', textAlign: 'right', textShadow: `0 0 14px ${COLORS.gold}1a` }}>
                  {ex.ar}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ background: 'rgba(212,165,116,0.05)', border: `1px solid ${COLORS.goldAlpha25}`, borderRadius: '8px', padding: '12px 14px' }}>
                    <div style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: COLORS.gold, opacity: 0.75, marginBottom: '6px', fontFamily: FONTS.body }}>
                      {language === 'tr' ? "Muksam Bihi · Yemin Objesi" : "Muqsam Bihi · The Oath-Object"}
                    </div>
                    <p style={{ color: COLORS.offWhite, fontSize: '0.82rem', fontFamily: FONTS.body, lineHeight: 1.6, margin: 0 }}>
                      {language === 'tr' ? ex.objectTr : ex.objectEn}
                    </p>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${COLORS.glassBorder}`, borderRadius: '8px', padding: '12px 14px' }}>
                    <div style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: COLORS.silver, opacity: 0.75, marginBottom: '6px', fontFamily: FONTS.body }}>
                      {language === 'tr' ? "Muksam Aleyhi · Yemin Cevabı" : "Muqsam ʿAlayhi · The Oath-Subject"}
                    </div>
                    <p style={{ color: COLORS.offWhite, fontSize: '0.82rem', fontFamily: FONTS.body, fontStyle: 'italic', lineHeight: 1.6, margin: 0 }}>
                      {language === 'tr' ? ex.answerTr : ex.answerEn}
                    </p>
                  </div>
                </div>
                <div style={{ background: 'rgba(212,165,116,0.03)', borderLeft: `2px solid ${COLORS.gold}`, padding: '10px 14px', borderRadius: '4px' }}>
                  <div style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: COLORS.gold, opacity: 0.75, marginBottom: '6px', fontFamily: FONTS.body }}>
                    {language === 'tr' ? "Münâsebe · İbn Kayyim'in Çözümlemesi" : "Munāsaba · Ibn Qayyim's Reading"}
                  </div>
                  <p style={{ color: COLORS.silver, fontSize: '0.82rem', fontFamily: FONTS.body, lineHeight: 1.7, margin: 0 }}>
                    {language === 'tr' ? ex.relationTr : ex.relationEn}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Tab: Kaynaklar ────────────────────────────────────────────────────────────

function TabKaynaklar({ sources, language, isMobile }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {sources.map((section, i) => (
        <div key={i} style={{
          background: COLORS.glassBg,
          border: `1px solid ${COLORS.glassBorder}`,
          borderRadius: '10px',
          padding: isMobile ? '16px' : '20px 24px',
        }}>
          <h4 style={{ color: COLORS.gold, fontSize: '0.85rem', fontWeight: 700, fontFamily: FONTS.body, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px' }}>
            {language === 'tr' ? section.categoryTr : section.categoryEn}
          </h4>
          <ul style={{ margin: 0, padding: '0 0 0 16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {section.items.map((item, j) => (
              <li key={j} style={{ color: COLORS.silver, fontSize: '0.83rem', fontFamily: FONTS.body, lineHeight: 1.6 }}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}

      {/* Methodology note */}
      <div style={{
        background: 'rgba(148,163,184,0.06)',
        border: `1px solid rgba(148,163,184,0.14)`,
        borderRadius: '8px',
        padding: '14px 16px',
        display: 'flex',
        gap: '10px',
      }}>
        <span style={{ color: COLORS.slate500, fontSize: '0.85rem', flexShrink: 0 }}>ℹ</span>
        <p style={{ color: COLORS.slate500, fontSize: '0.78rem', fontFamily: FONTS.body, lineHeight: 1.65, margin: 0 }}>
          {language === 'tr'
            ? 'Bu sayfadaki yemin listesi temel kaynaklara dayanan küratörlü bir seçkidir. Tam bir akademik corpus çalışması için İbn Kayyim\'in et-Tibyân ve Suyûtî\'nin el-İtkân (bâb 60) eserlerine başvurulmalıdır.'
            : 'The oath list on this page is a curated selection based on primary sources. For a complete academic corpus study, refer to Ibn Qayyim\'s al-Tibyan and Suyuti\'s al-Itqan (chapter 60).'
          }
        </p>
      </div>
    </div>
  );
}

// ── Closing Synthesis — Premium Template Kapanışı ─────────────────────────────
// Hero'daki "yemin bir vurgu sanatı" framing whisper'ını paradox synthesis ile
// kapatır + 3 cross-tool CTA (relevant yemin-yoğun sûreler).

function YeminlerClosing({ language, isMobile, totalOaths }) {
  const tr = language === 'tr';
  return (
    <div style={{
      marginTop: isMobile ? '40px' : '60px',
      padding: isMobile ? '50px 20px 60px' : '80px 32px 80px',
      borderTop: `1px solid ${COLORS.glassBorderSoft || 'rgba(255,255,255,0.06)'}`,
      maxWidth: '900px',
      marginLeft: 'auto',
      marginRight: 'auto',
    }}>
      <div style={{
        fontSize: '0.68rem', fontFamily: FONTS.body, fontWeight: 700,
        letterSpacing: '0.3em', textTransform: 'uppercase',
        color: COLORS.gold, opacity: 0.7,
        marginBottom: '20px', textAlign: 'center',
      }}>
        {tr ? 'Tefekkür' : 'Reflection'}
      </div>

      <h3 style={{
        fontFamily: FONTS.display, fontWeight: 700,
        fontSize: isMobile ? 'clamp(1.45rem, 5.5vw, 1.8rem)' : 'clamp(1.7rem, 2.8vw, 2.15rem)',
        color: COLORS.offWhite,
        textAlign: 'center',
        lineHeight: 1.3,
        letterSpacing: '-0.01em',
        margin: '0 auto 28px',
        maxWidth: '780px',
      }}>
        {tr
          ? <>{totalOaths} yemin — <em style={{ fontStyle: 'normal', color: COLORS.gold }}>Yaratanın yarattığını şahit tutması</em>.</>
          : <>{totalOaths} oaths — <em style={{ fontStyle: 'normal', color: COLORS.gold }}>The Creator calling His creation to witness</em>.</>}
      </h3>

      <p style={{
        fontFamily: FONTS.display, fontStyle: 'italic',
        color: COLORS.silver,
        fontSize: isMobile ? '1rem' : 'clamp(1rem, 1.7vw, 1.12rem)',
        lineHeight: 1.75,
        textAlign: 'center',
        margin: '0 auto 50px',
        maxWidth: '740px',
        opacity: 0.92,
      }}>
        {tr
          ? <>Bir insan yemin ederken kendinden yüce bir şeye atıfta bulunur. Allah ise <strong style={{ color: COLORS.gold, fontStyle: 'normal', fontWeight: 600 }}>kendi yarattığına</strong> yemin eder. Çünkü O'nun katında güneş, kalem, asır, ruh — hepsi <strong style={{ color: COLORS.gold, fontStyle: 'normal', fontWeight: 600 }}>O'nun ayetidir</strong>. Yemin, yaratılana verilen değerin en yüksek beyanıdır.</>
          : <>When a human swears, they refer to something greater than themselves. Allah swears by <strong style={{ color: COLORS.gold, fontStyle: 'normal', fontWeight: 600 }}>His own creation</strong>. Because before Him, the sun, the pen, time, the soul — all are <strong style={{ color: COLORS.gold, fontStyle: 'normal', fontWeight: 600 }}>His signs</strong>. The oath is the highest declaration of the value given to the created.</>}
      </p>

      <div style={{ marginBottom: '20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <span style={{
            fontSize: '0.68rem', fontFamily: FONTS.body, fontWeight: 700,
            letterSpacing: '0.24em', textTransform: 'uppercase',
            color: COLORS.gold, opacity: 0.7,
          }}>
            {tr ? 'Daha Derine — Yemin-Yoğun Sûreler' : 'Go Deeper — Oath-Rich Suras'}
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: '12px',
        }}>
          {[
            { href: `/${language}/oku/91`, titleTr: 'Şems Sûresi (91)', titleEn: 'Sura al-Shams (91)', descTr: '7 ayet · 7 yemin — Güneş, ay, gündüz, gece, gök, yer, ruh. Kur\'an\'ın en yoğun yemin zinciri.', descEn: '7 verses · 7 oaths — sun, moon, day, night, sky, earth, soul. The Quran\'s densest oath chain.' },
            { href: `/${language}/oku/56`, titleTr: 'Vâkıa Sûresi (56)', titleEn: 'Sura al-Wāqiʿa (56)', descTr: '"Yıldızların yerlerine yemin ederim — bilseniz bu büyük bir yemindir" (56:75-76) — Kur\'an\'ın kendi yeminini tefsir ettiği ayet.', descEn: '"I swear by the positions of the stars — and indeed it is a tremendous oath if you only knew" (56:75-76) — the Quran interpreting its own oath.' },
            { href: `/${language}/oku/103`, titleTr: 'Asr Sûresi (103)', titleEn: 'Sura al-ʿAṣr (103)', descTr: '"Asra yemin olsun ki insan ziyandadır" — 3 ayetlik en kısa yemin sûresi; tüm tarihin tezi.', descEn: '"By time — indeed humanity is in loss" — the shortest oath sura (3 verses); the thesis of all history.' },
          ].map((tt, i) => (
            <a
              key={i}
              href={tt.href}
              style={{
                display: 'block',
                background: `linear-gradient(180deg, ${COLORS.goldAlpha04} 0%, rgba(255,255,255,0.02) 100%)`,
                border: `1px solid ${COLORS.goldAlpha25}`,
                borderRadius: RADIUS.lg,
                padding: isMobile ? '20px 18px' : '22px 22px',
                textDecoration: 'none',
                transition: `all ${TRANSITION.base}`,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = `linear-gradient(180deg, ${COLORS.goldAlpha04} 0%, rgba(255,255,255,0.05) 100%)`;
                e.currentTarget.style.borderColor = COLORS.goldAlpha45 || 'rgba(212,165,116,0.45)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = `linear-gradient(180deg, ${COLORS.goldAlpha04} 0%, rgba(255,255,255,0.02) 100%)`;
                e.currentTarget.style.borderColor = COLORS.goldAlpha25;
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: '8px',
              }}>
                <h4 style={{
                  fontFamily: FONTS.body, fontWeight: 700,
                  fontSize: '0.95rem',
                  color: COLORS.gold, margin: 0,
                }}>
                  {tr ? tt.titleTr : tt.titleEn}
                </h4>
                <span style={{ color: COLORS.gold, opacity: 0.65, fontSize: '1rem' }}>→</span>
              </div>
              <p style={{
                fontFamily: FONTS.body,
                fontSize: '0.85rem',
                color: COLORS.silver,
                lineHeight: 1.6,
                margin: 0, opacity: 0.85,
              }}>
                {tr ? tt.descTr : tt.descEn}
              </p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── VakiaSpotlight — Vâkıa 56:75-76 dramatic banner ─────────────────────────
// "Şayet bilirseniz bu büyük bir yemindir" — Kur'an'ın KENDİ yeminini
// büyük olarak nitelediği unique meta-ayet. Visitor'a "yeminin önemi"ni
// dramatic biçimde sunar.
function VakiaSpotlight({ language, isMobile }) {
  const tr = language === 'tr';
  return (
    <div style={{
      margin: isMobile ? '20px 16px 0' : '32px auto 0',
      maxWidth: '900px',
      padding: isMobile ? '24px 20px' : '36px 40px',
      background: 'linear-gradient(135deg, rgba(212,165,116,0.10) 0%, rgba(201,162,39,0.05) 50%, rgba(212,165,116,0.10) 100%)',
      border: `1px solid ${COLORS.goldAlpha25}`,
      borderRadius: RADIUS.lg,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Subtle radial glow */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse at center, ${COLORS.gold}11 0%, transparent 60%)`,
      }} />

      <div style={{ position: 'relative', textAlign: 'center' }}>
        <div style={{
          fontSize: '0.62rem', fontFamily: FONTS.body, fontWeight: 700,
          letterSpacing: '0.3em', textTransform: 'uppercase',
          color: COLORS.gold, opacity: 0.75,
          marginBottom: '14px',
        }}>
          {tr ? "Kur'an Kendi Yeminini Tefsir Ediyor" : "The Quran Interprets Its Own Oath"}
        </div>

        <p
          dir="rtl"
          lang="ar"
          style={{
            fontFamily: FONTS.quran,
            fontSize: isMobile ? 'clamp(1.05rem, 4vw, 1.35rem)' : 'clamp(1.3rem, 2.2vw, 1.7rem)',
            color: COLORS.gold,
            lineHeight: 2.1,
            margin: '0 auto 18px',
            maxWidth: '780px',
            textShadow: `0 0 20px ${COLORS.gold}28`,
          }}
        >
          فَلَا اُقْسِمُ بِمَوَاقِعِ النُّجُومِ ۙ وَاِنَّهُ لَقَسَمٌ لَوْ تَعْلَمُونَ عَظِيمٌ
        </p>

        <p style={{
          color: COLORS.offWhite,
          fontFamily: FONTS.display,
          fontStyle: 'italic',
          fontSize: isMobile ? '0.95rem' : 'clamp(1rem, 1.6vw, 1.1rem)',
          lineHeight: 1.7,
          margin: '0 auto 12px',
          maxWidth: '640px',
          opacity: 0.95,
        }}>
          "{tr
            ? 'Yıldızların yerlerine yemin ederim — ve bu, bilseydiniz, gerçekten çok büyük bir yemindir.'
            : 'I swear by the positions of the stars — and indeed, if you only knew, it is a tremendous oath.'}"
        </p>

        <p style={{
          color: COLORS.silver,
          fontFamily: FONTS.body,
          fontSize: '0.72rem',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          margin: '0 0 20px',
          opacity: 0.7,
        }}>
          — {tr ? 'Vâkıa 56:75-76' : 'al-Wāqiʿa 56:75-76'}
        </p>

        <p style={{
          color: COLORS.silver,
          fontFamily: FONTS.body,
          fontSize: '0.84rem',
          lineHeight: 1.7,
          margin: '0 auto',
          maxWidth: '640px',
          opacity: 0.85,
        }}>
          {tr
            ? <>Bu nadir bir andır: <strong style={{ color: COLORS.gold, fontWeight: 600 }}>Allah</strong>, ettiği yeminin <strong style={{ color: COLORS.gold, fontWeight: 600 }}>büyüklüğünü</strong> insana açıkça söylüyor. Yeminin önemini ifade eden meta-ayet — Kur'an'da yalnızca burada geçer.</>
            : <>This is a rare moment: <strong style={{ color: COLORS.gold, fontWeight: 600 }}>Allah</strong> explicitly tells humanity the <strong style={{ color: COLORS.gold, fontWeight: 600 }}>greatness</strong> of His own oath. A meta-verse on the weight of swearing — found only here in the Quran.</>}
        </p>
      </div>
    </div>
  );
}

// ─── YeminCevapReveal — Yemin'in ardından gelen mesajı reveal ────────────────
// Yeminin asıl gücü: ardından gelen söz. Visitor "Yemini gör" → "Cevabı gör"
// reveal pattern ile yeminin işlevini somut hisseder.
const YEMIN_CEVAP_DATA = [
  {
    id: 'sems',
    oathRefTr: 'Şems 91:1-7',
    oathRefEn: 'al-Shams 91:1-7',
    oathAr: 'وَالشَّمْسِ وَضُحٰيهَاۙ وَالْقَمَرِ اِذَا تَلٰيهَاۙ وَالنَّهَارِ اِذَا جَلّٰيهَاۙ وَالَّيْلِ اِذَا يَغْشٰيهَاۙ وَالسَّمَٓاءِ وَمَا بَنٰيهَاۙ وَالْاَرْضِ وَمَا طَحٰيهَاۙ وَنَفْسٍ وَمَا سَوّٰيهَا',
    oathTr: 'Güneşe ve onun aydınlığına; ay\'a — onu takip ettiğinde; gündüze — onu açığa çıkardığında; geceye — onu örttüğünde; göğe ve onu yapana; yere ve onu döşeyene; nefse ve onu düzenleyene.',
    oathEn: 'By the sun and its morning brightness; the moon when it follows; the day when it reveals it; the night when it veils it; the sky and Who built it; the earth and Who spread it; the soul and Who shaped it.',
    answerRefTr: 'Şems 91:9-10',
    answerRefEn: 'al-Shams 91:9-10',
    answerAr: 'قَدْ اَفْلَحَ مَنْ زَكّٰيهَاۖ وَقَدْ خَابَ مَنْ دَسّٰيهَاۜ',
    answerTr: 'Nefsini arındıran kurtuluşa ermiştir. Onu (kötülüğe) gömen ise mahvolmuştur.',
    answerEn: 'Successful is the one who purifies the soul; failed is the one who corrupts it.',
    insightTr: '7 büyük yemin → 1 hüküm. Kâinatın tüm tanıkları: insanın iç temizliği üzerine.',
    insightEn: 'Seven mighty oaths → one verdict. All cosmic witnesses converge on the soul\'s purity.',
  },
  {
    id: 'asr',
    oathRefTr: 'Asr 103:1',
    oathRefEn: 'al-ʿAṣr 103:1',
    oathAr: 'وَالْعَصْرِۙ',
    oathTr: 'Asra (zamana) andolsun.',
    oathEn: 'By the passage of time.',
    answerRefTr: 'Asr 103:2-3',
    answerRefEn: 'al-ʿAṣr 103:2-3',
    answerAr: 'اِنَّ الْاِنْسَانَ لَفِي خُسْرٍۙ اِلَّا الَّذِينَ اٰمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ ەۙ وَتَوَاصَوْا بِالصَّبْرِ',
    answerTr: 'İnsan kesinlikle ziyandadır — iman edip salih amel işleyenler, birbirine hakkı ve sabrı tavsiye edenler hariç.',
    answerEn: 'Indeed, humanity is in loss — except those who believe, do righteous deeds, and counsel each other in truth and patience.',
    insightTr: '3 ayetin tezi: zaman karşısında insanın yapısal hâli. Şâfiî: "Sadece bu sûre inseydi yeterdi" demiştir.',
    insightEn: 'Three verses, one thesis: humanity\'s structural state against time. Al-Shafiʿi: "If only this sura were revealed, it would suffice."',
  },
  {
    id: 'buruc',
    oathRefTr: 'Burûc 85:1-3',
    oathRefEn: 'al-Burūj 85:1-3',
    oathAr: 'وَالسَّمَٓاءِ ذَاتِ الْبُرُوجِۙ وَالْيَوْمِ الْمَوْعُودِۙ وَشَاهِدٍ وَمَشْهُودٍۜ',
    oathTr: 'Burçlarla dolu göğe; vaad edilen güne; tanık olana ve tanık olunana andolsun.',
    oathEn: 'By the sky full of constellations; by the promised day; by the witness and the witnessed.',
    answerRefTr: 'Burûc 85:4-7',
    answerRefEn: 'al-Burūj 85:4-7',
    answerAr: 'قُتِلَ اَصْحَابُ الْاُخْدُودِۙ اَلنَّارِ ذَاتِ الْوَقُودِۙ اِذْ هُمْ عَلَيْهَا قُعُودٌۙ وَهُمْ عَلٰى مَا يَفْعَلُونَ بِالْمُؤْمِنِينَ شُهُودٌۜ',
    answerTr: 'Hendek halkı (Ashâb-ı Uhdûd) kahrolsun — yakacaklı ateşin sahipleri; ateşin başında oturmuş, müminlere yaptıklarını seyrediyorlardı.',
    answerEn: 'Cursed be the people of the trench — those of the fueled fire; sitting beside it, watching what they did to the believers.',
    insightTr: 'Kozmik yemin → tarihsel zulüm. Gök tanık; zalimler de tanık. Aynı kelime: "şahid".',
    insightEn: 'Cosmic oath → historical injustice. The sky witnesses; the oppressors also witness. Same word: "shāhid".',
  },
];

function YeminCevapReveal({ language, isMobile }) {
  const tr = language === 'tr';
  const [revealed, setRevealed] = useState({});

  return (
    <div style={{
      margin: isMobile ? '32px 16px 0' : '48px auto 0',
      maxWidth: '900px',
      padding: isMobile ? '0' : '0 8px',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div style={{
          fontSize: '0.62rem', fontFamily: FONTS.body, fontWeight: 700,
          letterSpacing: '0.3em', textTransform: 'uppercase',
          color: COLORS.gold, opacity: 0.7,
          marginBottom: '12px',
        }}>
          {tr ? 'Yeminin Ardındaki Mesaj' : 'The Message Behind the Oath'}
        </div>
        <h2 style={{
          fontFamily: FONTS.display,
          fontSize: isMobile ? 'clamp(1.45rem, 5.5vw, 1.8rem)' : 'clamp(1.6rem, 2.6vw, 2rem)',
          fontWeight: 700,
          color: COLORS.offWhite,
          margin: '0 auto 12px',
          lineHeight: 1.25,
          letterSpacing: '-0.01em',
          maxWidth: '700px',
        }}>
          {tr ? 'Yemin → Cevap' : 'Oath → Answer'}
        </h2>
        <p style={{
          fontFamily: FONTS.display,
          fontStyle: 'italic',
          color: COLORS.silver,
          fontSize: isMobile ? '0.9rem' : '0.95rem',
          lineHeight: 1.7,
          margin: '0 auto',
          maxWidth: '640px',
          opacity: 0.88,
        }}>
          {tr
            ? "Yeminin gerçek gücü 'neye' yemin edildiğinde değil — ardından gelen sözdedir. Aşağıdaki 3 örnekte yemini okuyun, ardından cevabı açın."
            : "The oath's true power is not in 'what' is sworn by — but in what follows. Read each oath below, then reveal the answer."}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {YEMIN_CEVAP_DATA.map(item => {
          const isRevealed = !!revealed[item.id];
          return (
            <div
              key={item.id}
              style={{
                background: 'rgba(255,255,255,0.025)',
                border: `1px solid ${COLORS.glassBorderSoft || COLORS.glassBgStrong}`,
                borderRadius: RADIUS.lg,
                overflow: 'hidden',
              }}
            >
              {/* Oath section */}
              <div style={{ padding: isMobile ? '20px 18px' : '24px 28px' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  marginBottom: '14px',
                }}>
                  <span style={{
                    fontSize: '0.6rem', fontFamily: FONTS.body, fontWeight: 700,
                    letterSpacing: '0.2em', textTransform: 'uppercase',
                    color: COLORS.gold, opacity: 0.8,
                    padding: '3px 8px',
                    background: COLORS.goldAlpha04,
                    border: `1px solid ${COLORS.goldAlpha25}`,
                    borderRadius: RADIUS.pillSm,
                  }}>
                    {tr ? 'Yemin' : 'Oath'}
                  </span>
                  <span style={{
                    fontSize: '0.74rem', color: COLORS.silver, opacity: 0.75,
                    fontFamily: FONTS.body,
                  }}>
                    {tr ? item.oathRefTr : item.oathRefEn}
                  </span>
                </div>

                <p
                  dir="rtl"
                  lang="ar"
                  style={{
                    fontFamily: FONTS.quran,
                    fontSize: isMobile ? 'clamp(0.95rem, 3.8vw, 1.2rem)' : 'clamp(1.05rem, 1.85vw, 1.4rem)',
                    color: COLORS.gold,
                    lineHeight: 2.1,
                    margin: '0 0 14px',
                    textShadow: `0 0 16px ${COLORS.gold}1a`,
                  }}
                >
                  {item.oathAr}
                </p>

                <p style={{
                  color: COLORS.silver,
                  fontFamily: FONTS.body,
                  fontStyle: 'italic',
                  fontSize: '0.86rem',
                  lineHeight: 1.7,
                  margin: 0,
                  opacity: 0.88,
                }}>
                  "{tr ? item.oathTr : item.oathEn}"
                </p>
              </div>

              {/* Reveal toggle button — DRAMATIC */}
              <button
                onClick={() => setRevealed(r => ({ ...r, [item.id]: !r[item.id] }))}
                style={{
                  width: '100%',
                  padding: '12px 20px',
                  background: isRevealed ? COLORS.goldAlpha04 : 'transparent',
                  border: 'none',
                  borderTop: `1px solid ${COLORS.glassBorderSoft || COLORS.glassBgStrong}`,
                  borderBottom: isRevealed ? `1px solid ${COLORS.glassBorderSoft || COLORS.glassBgStrong}` : 'none',
                  color: COLORS.gold,
                  fontFamily: FONTS.body,
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => { if (!isRevealed) e.currentTarget.style.background = COLORS.goldAlpha04; }}
                onMouseLeave={e => { if (!isRevealed) e.currentTarget.style.background = 'transparent'; }}
              >
                <span>{isRevealed ? (tr ? '▴ Cevabı Kapat' : '▴ Hide the Answer') : (tr ? '▾ Cevabı Aç' : '▾ Reveal the Answer')}</span>
              </button>

              {/* Answer section — reveal */}
              {isRevealed && (
                <div style={{
                  padding: isMobile ? '20px 18px 24px' : '24px 28px 28px',
                  background: 'rgba(212,165,116,0.04)',
                }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    marginBottom: '14px',
                  }}>
                    <span style={{
                      fontSize: '0.6rem', fontFamily: FONTS.body, fontWeight: 700,
                      letterSpacing: '0.2em', textTransform: 'uppercase',
                      color: '#2ecc71',
                      padding: '3px 8px',
                      background: 'rgba(46,204,113,0.08)',
                      border: '1px solid rgba(46,204,113,0.25)',
                      borderRadius: RADIUS.pillSm,
                    }}>
                      {tr ? 'Cevap' : 'Answer'}
                    </span>
                    <span style={{
                      fontSize: '0.74rem', color: COLORS.silver, opacity: 0.75,
                      fontFamily: FONTS.body,
                    }}>
                      {tr ? item.answerRefTr : item.answerRefEn}
                    </span>
                  </div>

                  <p
                    dir="rtl"
                    lang="ar"
                    style={{
                      fontFamily: FONTS.quran,
                      fontSize: isMobile ? 'clamp(0.95rem, 3.8vw, 1.2rem)' : 'clamp(1.05rem, 1.85vw, 1.4rem)',
                      color: '#2ecc71',
                      lineHeight: 2.1,
                      margin: '0 0 14px',
                      textShadow: '0 0 16px rgba(46,204,113,0.18)',
                    }}
                  >
                    {item.answerAr}
                  </p>

                  <p style={{
                    color: COLORS.offWhite,
                    fontFamily: FONTS.body,
                    fontStyle: 'italic',
                    fontSize: '0.9rem',
                    lineHeight: 1.7,
                    margin: '0 0 14px',
                    opacity: 0.95,
                  }}>
                    "{tr ? item.answerTr : item.answerEn}"
                  </p>

                  {/* Insight micro-paragraph */}
                  <div style={{
                    padding: '10px 14px',
                    background: COLORS.goldAlpha04,
                    borderLeft: `2px solid ${COLORS.gold}99`,
                    borderRadius: '0 6px 6px 0',
                    marginTop: '8px',
                  }}>
                    <span style={{
                      color: COLORS.gold,
                      fontFamily: FONTS.body,
                      fontSize: '0.6rem',
                      fontWeight: 700,
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      display: 'block',
                      marginBottom: '4px',
                      opacity: 0.85,
                    }}>
                      ✦ {tr ? 'İçgörü' : 'Insight'}
                    </span>
                    <p style={{
                      color: COLORS.silver,
                      fontFamily: FONTS.body,
                      fontSize: '0.82rem',
                      lineHeight: 1.6,
                      margin: 0,
                      opacity: 0.92,
                    }}>
                      {tr ? item.insightTr : item.insightEn}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Close Button ──────────────────────────────────────────────────────────────

function CloseBtn({ onClose }) {
  return (
    <button
      onClick={onClose}
      style={{ ...CLOSE_BTN }}
      onMouseEnter={e => { e.currentTarget.style.background = COLORS.glassBorder; e.currentTarget.style.color = COLORS.offWhite; }}
      onMouseLeave={e => { e.currentTarget.style.background = CLOSE_BTN.background; e.currentTarget.style.color = COLORS.silver; }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M18 6L6 18M6 6l12 12" />
      </svg>
    </button>
  );
}
