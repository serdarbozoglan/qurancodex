'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useLanguage } from '../i18n/LanguageContext';
import { routeForToolEvent } from '../lib/toolRoutes';
import { FONTS, COLORS, TRANSITION, BREAKPOINT_TABLET, RADIUS, SEMANTIC } from '../tokens';
import { ExternalLinkIcon } from './icons';
import ToolHeader from './ToolHeader';
import CrossToolCTA from './CrossToolCTA';
import BookmarkButton from './BookmarkButton';
import useFocusTrap from '../hooks/useFocusTrap';
// 2026-08-14 (Z3f2) — fetch yerine static import: SSR "Yükleniyor" iskeleti
// döndürüyordu, JS başarısız olursa sayfa boş kalıyordu.
import cennetCehennemDataStatic from '../../public/cennet-cehennem.json';

// ── Color system ──────────────────────────────────────────────────────────────
const CENNET   = { accent: '#2BA47D', bg: 'rgba(27,110,86,0.12)',   border: 'rgba(29,158,117,0.28)' };
const CEHENNEM = { accent: '#DE734F', bg: 'rgba(153,60,29,0.12)',   border: 'rgba(216,90,48,0.28)' };
const ARAF     = { accent: COLORS.softGold, bg: COLORS.softGoldAlpha10, border: COLORS.softGoldAlpha28 };
const HAPAX    = '#a78bfa';
const GOLD     = COLORS.softGold;

// ── Reusable components ───────────────────────────────────────────────────────
function HadisBadge({ language }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '3px',
      fontSize: '0.65rem', fontWeight: 600,
      color: COLORS.softGoldAlpha75,
      background: COLORS.softGoldAlpha08,
      border: `1px solid ${COLORS.softGoldAlpha20}`,
      borderRadius: RADIUS.pillSm, padding: '1px 7px',
    }}>
      ℹ {language === 'tr' ? 'Hadis' : 'Hadith'}
    </span>
  );
}

function HapaxBadge({ language }) {
  const [show, setShow] = useState(false);
  const tip = language === 'tr'
    ? 'Hapax legomenon: Kur\'an\'da yalnızca bir kez geçen kelime. Anlam ve kök tartışmalıdır.'
    : 'Hapax legomenon: A word that appears only once in the Quran. Its meaning and root are debated.';
  return (
    <span
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: '4px',
        fontSize: '0.65rem', fontWeight: 700,
        color: HAPAX,
        background: 'rgba(139,92,246,0.1)',
        border: '1px solid rgba(139,92,246,0.3)',
        borderRadius: RADIUS.pillSm, padding: '1px 7px',
        textTransform: 'uppercase', letterSpacing: '0.05em',
        cursor: 'default',
      }}>
        Hapax
        <svg aria-hidden="true" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ opacity: 0.75, flexShrink: 0 }}>
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </span>
      {show && (
        <span style={{
          position: 'absolute', bottom: 'calc(100% + 6px)', left: '50%',
          transform: 'translateX(-50%)',
          background: '#1e1b2e',
          border: '1px solid rgba(139,92,246,0.4)',
          borderRadius: RADIUS.md,
          padding: '8px 12px',
          fontSize: '0.75rem',
          color: '#c4b5fd',
          lineHeight: 1.5,
          whiteSpace: 'normal',
          width: '220px',
          zIndex: 100,
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          pointerEvents: 'none',
        }}>
          {tip}
        </span>
      )}
    </span>
  );
}

function VerseBlock({ ar, tr, en, kaynak, language, color }) {
  const c = color || GOLD;
  return (
    <div style={{
      background: `${c}08`,
      border: `1px solid ${c}25`,
      borderRight: `3px solid ${c}`,
      borderRadius: RADIUS.md,
      padding: '14px 16px',
      marginBottom: '12px',
      direction: 'rtl',
    }}>
      <p dir="rtl" lang="ar" style={{ fontFamily: FONTS.quran, fontSize: '1.3rem', color: c, lineHeight: 2, margin: '0 0 8px', textAlign: 'right', direction: 'rtl' }}>
        {ar}
      </p>
      <p style={{ fontSize: '0.85rem', color: COLORS.silver, fontStyle: 'italic', margin: '0 0 4px', direction: 'ltr', textAlign: 'left' }}>
        {language === 'tr' ? tr : en}
      </p>
      <p style={{ fontSize: '0.72rem', color: `${c}99`, fontWeight: 600, margin: 0, direction: 'ltr', textAlign: 'left' }}>
        — {kaynak}
      </p>
    </div>
  );
}

function SectionTitle({ children, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', marginTop: '28px' }}>
      <div style={{ width: '3px', height: '18px', background: color || GOLD, borderRadius: '2px', flexShrink: 0 }} />
      <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: COLORS.offWhite, margin: 0, fontFamily: "'Inter', sans-serif" }}>
        {children}
      </h3>
    </div>
  );
}

function InfoNote({ text }) {
  return (
    <div style={{
      display: 'flex', gap: '6px', alignItems: 'flex-start',
      fontSize: '0.73rem', color: SEMANTIC.textFaint,
      background: 'rgba(148,163,184,0.05)',
      border: `1px solid ${COLORS.silverAlpha12}`,
      borderRadius: RADIUS.sm, padding: '8px 10px',
      lineHeight: 1.55,
    }}>
      <span style={{ flexShrink: 0, marginTop: '1px' }}>ℹ</span>
      <span>{text}</span>
    </div>
  );
}

// ── TABS definition ───────────────────────────────────────────────────────────
const TABS = [
  { id: 'isimler',   labelTr: 'İsimler',       labelEn: 'Names',
    icon: <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg> },
  { id: 'cennet',    labelTr: 'Cennet',         labelEn: 'Paradise',
    icon: <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22V12"/><path d="M5 3c0 0 1 11 7 9s7 9 7 9"/><path d="M5 3s4 4 7 9"/></svg> },
  { id: 'cehennem',  labelTr: 'Cehennem',       labelEn: 'Hell',
    icon: <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.5c1.6 3.2 4.8 5.4 4.8 9.4 0 3.6-2.4 6.6-4.8 6.6s-4.8-3-4.8-6.6c0-1.8 0.7-3 1.6-4.1"/><path d="M12 8c0.9 1.7 2.6 2.9 2.6 5.1 0 1.9-1.3 3.5-2.6 3.5s-2.6-1.6-2.6-3.5c0-1 0.4-1.6 0.9-2.2"/></svg> },
  { id: 'araf',      labelTr: "A'râf",          labelEn: "A'raf",
    icon: <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="12" y1="3" x2="12" y2="21"/><circle cx="12" cy="12" r="3"/></svg> },
  { id: 'rahman',    labelTr: 'Rahman Simetrisi', labelEn: 'Al-Rahman Symmetry',
    icon: <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg> },
  { id: 'kaynaklar', labelTr: 'Kaynaklar',      labelEn: 'Sources',
    icon: <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> },
];

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function CennetCehennem({ onClose }) {
  const { language } = useLanguage();
  const trapRef = useFocusTrap(true);
  const [data]           = useState(cennetCehennemDataStatic);
  const [activeTab, setActiveTab] = useState('isimler');
  const [isMobile, setIsMobile]   = useState(false)  // SSR-safe; useEffect h() post-mount hydrate;
  const bodyRef = useRef(null);

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < BREAKPOINT_TABLET);
    h(); // post-mount hydrate
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  // Scroll content to top on tab change
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
  }, [activeTab]);

  const TOOL_ICON = (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  );

  if (!data) return (
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
        icon={TOOL_ICON}
        titleTr="Cennet & Cehennem"
        titleEn="Paradise & Hell"
        subtitleTr="9 cennet · 7 cehennem · A'râf"
        subtitleEn="9 paradises · 7 hells · al-Aʿrāf"
        language={language}
      />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: COLORS.silver, fontSize: '0.9rem', fontFamily: FONTS.body }}>
          {language === 'tr' ? 'Yükleniyor…' : 'Loading…'}
        </span>
      </div>
    </div>
  );

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
        icon={TOOL_ICON}
        titleTr="Cennet & Cehennem"
        titleEn="Paradise & Hell"
        subtitleTr="9 cennet · 7 cehennem · A'râf"
        subtitleEn="9 paradises · 7 hells · al-Aʿrāf"
        language={language}
      />

      {/* ── BODY ────────────────────────────────────────────────── */}
      <div className="mq-box" ref={bodyRef} style={{ flex: 1, overflowX: 'hidden', '--pt-d': "0", '--pt-m': "0", '--pr-d': "32px", '--pr-m': "14px", '--pb-d': "48px", '--pb-m': "48px", '--pl-d': "32px", '--pl-m': "14px" }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>

          {/* ── HERO (Cinematic — Bismillah + Rahman 55:46 + framing + filigree) ─────── */}
          <div className="mq-box" style={{
            '--pt-d': "56px", '--pt-m': "40px", '--pr-d': "0", '--pr-m': "0", '--pb-d': "24px", '--pb-m': "20px", '--pl-d': "0", '--pl-m': "0",
            textAlign: 'center',
            '--mb-d': '28px', '--mb-m': '20px',
          }}>
            {/* Bismillah */}
            <div className="mq-box"
              dir="rtl" lang="ar" aria-label="Bismillāh"
              style={{
                fontFamily: FONTS.bismillah,
                fontSize: isMobile ? '1.5rem' : '1.95rem',
                color: GOLD,
                opacity: 0.82,
                lineHeight: 1,
                '--mb-d': '36px', '--mb-m': '26px',
                textShadow: `0 0 22px ${GOLD}28`,
              }}
            >
              ﷽
            </div>

            {/* Anchor verse — Rahman 55:46 */}
            <p
              dir="rtl" lang="ar"
              style={{
                fontFamily: FONTS.quran,
                fontSize: isMobile ? 'clamp(1.05rem, 4.2vw, 1.4rem)' : 'clamp(1.25rem, 2.3vw, 1.65rem)',
                color: COLORS.gold,
                lineHeight: 2.1,
                margin: '0 auto 16px',
                maxWidth: '820px',
                textShadow: `0 0 20px ${COLORS.gold}1c`,
              }}
            >
              وَلِمَنْ خَافَ مَقَامَ رَبِّهِ جَنَّتَانِ
            </p>

            <p style={{
              color: COLORS.offWhite,
              fontFamily: FONTS.display,
              fontStyle: 'italic',
              fontSize: isMobile ? '0.94rem' : 'clamp(0.95rem, 1.6vw, 1.05rem)',
              lineHeight: 1.7,
              margin: '0 auto 8px',
              maxWidth: '660px',
              opacity: 0.95,
            }}>
              &quot;{language === 'tr'
                ? 'Rabbinin makamından korkana iki cennet vardır.'
                : 'And for the one who fears the standing before his Lord — two gardens.'}&quot;
            </p>

            <p style={{
              color: COLORS.silver,
              fontFamily: FONTS.body,
              fontSize: '0.72rem',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              margin: '0 0 36px',
              opacity: 0.78,
            }}>
              — {language === 'tr' ? 'Rahmân 55:46' : 'Ar-Raḥmān 55:46'}
            </p>

            {/* Framing whisper */}
            <p style={{
              color: COLORS.silver,
              fontFamily: FONTS.display,
              fontStyle: 'italic',
              fontSize: isMobile ? '0.92rem' : 'clamp(0.95rem, 1.55vw, 1.02rem)',
              lineHeight: 1.7,
              margin: '0 auto 40px',
              maxWidth: '700px',
              opacity: 0.88,
            }}>
              {language === 'tr'
                ? <>İki son, <em style={{ fontStyle: 'normal', color: GOLD, opacity: 0.95 }}>ayrı dil</em> ile anlatılır. Cennette nehir, gölge, eş; cehennemde ateş, zincir, zakkum. Aralarındaki <em style={{ fontStyle: 'normal', color: GOLD, opacity: 0.95 }}>perde</em>, A&apos;râf&apos;tır.</>
                : <>The two endings are told in <em style={{ fontStyle: 'normal', color: GOLD, opacity: 0.95 }}>two registers</em>. Rivers, shade, companions in paradise; fire, chains, zaqqūm in hell. Between them stands <em style={{ fontStyle: 'normal', color: GOLD, opacity: 0.95 }}>al-Aʿrāf</em>, the partition.</>}
            </p>

            {/* Filigree divider */}
            <div aria-hidden="true" style={{
              width: '120px',
              height: '1px',
              background: `linear-gradient(to right, transparent, ${GOLD}66, transparent)`,
              margin: '0 auto 32px',
            }} />

            {/* Eyebrow */}
            <p style={{
              fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.3em',
              textTransform: 'uppercase', color: GOLD,
              fontFamily: FONTS.body, opacity: 0.72,
              margin: '0 0 12px',
            }}>
              {language === 'tr' ? 'CENNET · CEHENNEM · ARAF' : 'PARADISE · HELL · AL-AʿRĀF'}
            </p>

            {/* Big Title */}
            <h2 style={{
              fontFamily: FONTS.display,
              fontSize: isMobile ? 'clamp(1.6rem, 7vw, 2rem)' : 'clamp(2rem, 3.6vw, 2.7rem)',
              fontWeight: 700,
              color: COLORS.offWhite,
              margin: '0 auto 14px',
              lineHeight: 1.18,
              letterSpacing: '-0.015em',
              maxWidth: '780px',
            }}>
              {language === 'tr' ? 'İki Son, İki Dil' : 'Two Endings, Two Languages'}
            </h2>

            {/* Dramatic subtitle */}
            <p style={{
              fontFamily: FONTS.display,
              fontSize: isMobile ? '1rem' : 'clamp(1.05rem, 1.8vw, 1.18rem)',
              color: GOLD,
              margin: '0 auto 8px',
              lineHeight: 1.55,
              fontStyle: 'italic',
              maxWidth: '700px',
              opacity: 0.92,
            }}>
              {language === 'tr'
                ? '9 cennet adı · 7 cehennem adı · arada A\'râf.'
                : '9 names for paradise · 7 for hell · between them, al-Aʿrāf.'}
            </p>
          </div>

          {/* ── HERO BANNER (stat panel) ─────────────────────────── */}
          <HeroBanner data={data} language={language} isMobile={isMobile} />

          {/* Tab bar — STICKY (Melekler-reference) — sticky top:48 = ToolHeader yüksekliği */}
          <div className="mq-box" id="cennet-tab-bar" style={{
            display: 'flex', gap: '2px',
            '--pt-d': "0", '--pt-m': "0", '--pr-d': "16px", '--pr-m': "8px", '--pb-d': "0", '--pb-m': "0", '--pl-d': "16px", '--pl-m': "8px",
            '--mt-d': "0", '--mt-m': "0", '--mr-d': "-32px", '--mr-m': "-14px", '--mb-d': "28px", '--mb-m': "24px", '--ml-d': "-32px", '--ml-m': "-14px",
            borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
            background: 'rgb(6, 8, 14)',
            backgroundColor: 'rgb(6, 8, 14)',
            isolation: 'isolate',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            position: 'sticky',
            top: '110px',
            zIndex: 20,
            scrollMarginTop: '120px',
            width: 'auto',
            boxSizing: 'border-box',
          }}>
            {TABS.map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button className="mq-box"
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setTimeout(() => {
                      const tb = document.getElementById('cennet-tab-bar');
                      if (tb) tb.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 50);
                  }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    '--pt-d': "16px", '--pt-m': "14px", '--pr-d': "26px", '--pr-m': "16px", '--pb-d': "16px", '--pb-m': "14px", '--pl-d': "26px", '--pl-m': "16px",
                    border: 'none', borderRadius: '0', flexShrink: 0,
                    borderBottom: isActive ? `2px solid ${COLORS.gold}` : '2px solid transparent',
                    background: isActive ? COLORS.goldAlpha15 : 'transparent',
                    color: isActive ? COLORS.gold : COLORS.silver,
                    fontSize: isMobile ? '0.72rem' : '0.78rem',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer', transition: `all ${TRANSITION.fast}`,
                    fontFamily: FONTS.body,
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = COLORS.offWhite; } }}
                  onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = COLORS.silver; } }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{tab.icon}</span>
                  {!isMobile && <span>{language === 'tr' ? tab.labelTr : tab.labelEn}</span>}
                </button>
              );
            })}
          </div>

          {activeTab === 'isimler'   && <TabIsimler   data={data} language={language} isMobile={isMobile} />}
          {activeTab === 'cennet'    && <TabCennet    data={data} language={language} isMobile={isMobile} />}
          {activeTab === 'cehennem'  && <TabCehennem  data={data} language={language} isMobile={isMobile} />}
          {activeTab === 'araf'      && <TabAraf      data={data} language={language} isMobile={isMobile} />}
          {activeTab === 'rahman'    && <TabRahman    data={data} language={language} isMobile={isMobile} />}
          {activeTab === 'kaynaklar' && <TabKaynaklar data={data} language={language} isMobile={isMobile} />}

          {/* Cross-tool CTA — sayfa sonu */}
          <CrossToolCTA
            language={language}
            isMobile={isMobile}
            links={[
              { href: `/${language}/arac/kiyamet`,        titleTr: 'Kıyâmet Sahneleri', titleEn: 'Scenes of Judgment',  descTr: 'Cennet/Cehennem öncesi: sûr, haşr, mîzân — sahneler dizisi.',                 descEn: 'Before paradise/hell: trumpet, gathering, scale — the sequence of scenes.' },
              { href: `/${language}/arac/iblis-seytan`,   titleTr: 'İblîs & Şeytan',    titleEn: 'Iblis & Satan',       descTr: 'Cehennemin "ilk müşterisi" — kibrin başlangıcı, 7 sûrede aynı sahne.',         descEn: 'Hell\'s "first inhabitant" — the origin of pride, the same scene in 7 surahs.' },
              { href: `/${language}/arac/melekler`,       titleTr: 'Melekler',          titleEn: 'Angels',              descTr: 'Cennet/Cehennem bekçileri (Rıdvan, Mâlik, Hâzin) — kabir sorgusu (Münker-Nekir).', descEn: 'Guardians of paradise/hell (Riḍwān, Mālik, Khāzin) — grave inquiry (Munkar-Nakīr).' },
            ]}
          />

        </div>
      </div>
    </div>
  );
}

// ── TAB 1: İSİMLER ────────────────────────────────────────────────────────────
function TabIsimler({ data, language, isMobile }) {
  const tr = language === 'tr';
  const cennetIsimleri   = data.cennetIsimleri   || [];
  const cehennemIsimleri = data.cehennemIsimleri || [];

  return (
    <div>
      {/* Hero intro */}
      <div style={{ marginBottom: '28px' }}>
        <p style={{ fontSize: '0.98rem', color: COLORS.silver, lineHeight: 1.8, maxWidth: '680px' }}>
          {tr
            ? "Kur'an cenneti de cehennemi de tek isimle değil, her biri farklı bir anlam boyutu taşıyan birden fazla isimle anlatır. Her isim, öteki alemin ayrı bir yüzünü aydınlatır."
            : "The Quran describes both Paradise and Hell not with a single name, but with multiple names — each carrying a distinct dimension of meaning. Every name illuminates a different facet of the afterlife."}
        </p>
      </div>

      {/* Two-column grid */}
      <div className="g-1-2" style={{
        display: 'grid',
        gap: '24px',
      }}>
        {/* Cennet column */}
        <div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            marginBottom: '16px', paddingBottom: '10px',
            borderBottom: `2px solid ${CENNET.accent}40`,
          }}>
            <div style={{ width: '10px', height: '10px', borderRadius: RADIUS.full, background: CENNET.accent }} />
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: CENNET.accent, margin: 0 }}>
              {tr ? `Cennetin ${cennetIsimleri.length} İsmi` : `${cennetIsimleri.length} Names of Paradise`}
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {cennetIsimleri.map(item => (
              <IsimCard key={item.id} item={item} language={language} color={CENNET.accent} bg={CENNET.bg} border={CENNET.border} kind="cennet" />
            ))}
          </div>
        </div>

        {/* Cehennem column */}
        <div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            marginBottom: '16px', paddingBottom: '10px',
            borderBottom: `2px solid ${CEHENNEM.accent}40`,
          }}>
            <div style={{ width: '10px', height: '10px', borderRadius: RADIUS.full, background: CEHENNEM.accent }} />
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: CEHENNEM.accent, margin: 0 }}>
              {tr ? `Cehennemin ${cehennemIsimleri.length} İsmi` : `${cehennemIsimleri.length} Names of Hell`}
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {cehennemIsimleri.map(item => (
              <IsimCard key={item.id} item={item} language={language} color={CEHENNEM.accent} bg={CEHENNEM.bg} border={CEHENNEM.border} kind="cehennem" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function IsimCard({ item, language, color, bg, border, kind = 'cennet' }) {
  const tr = language === 'tr';
  return (
    <div style={{
      background: bg,
      border: `1px solid ${border}`,
      borderRadius: RADIUS.chip,
      padding: '14px 16px',
      position: 'relative',
    }}>
      {/* #199 (2026-07-16) — Bookmark this name */}
      <div style={{ position: 'absolute', top: 10, right: 10 }}>
        <BookmarkButton
          item={{
            id: `${kind}-name:${item.id}`,
            type: kind === 'cennet' ? 'cennet-name' : 'cehennem-name',
            title: tr ? item.nameTr : item.nameEn,
            subtitle: tr ? item.meaningTr : item.meaningEn,
            description: (tr ? item.notTr : item.notEn) || (tr ? item.kaynak : item.kaynakEn) || '',
            url: `/${language}/arac/cennet-cehennem`,
          }}
          size="sm"
          language={language}
        />
      </div>

      {/* Arabic name */}
      <p dir="rtl" lang="ar" style={{
        fontFamily: FONTS.quran,
        fontSize: '1.4rem', lineHeight: 1.8,
        color: GOLD,
        textAlign: 'right', direction: 'rtl',
        margin: '0 0 6px',
        paddingRight: '32px',
      }}>
        {item.nameAr}
      </p>

      {/* Turkish/English name + meaning */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
        <span style={{ fontSize: '0.92rem', fontWeight: 700, color: COLORS.offWhite }}>
          {tr ? item.nameTr : item.nameEn}
        </span>
        <span style={{
          fontSize: '0.7rem', fontWeight: 600, color: color,
          background: `${color}18`, border: `1px solid ${color}35`,
          borderRadius: RADIUS.pillSm, padding: '1px 8px', flexShrink: 0,
        }}>
          {tr ? item.frequency : item.frequencyEn}
        </span>
      </div>

      <p style={{ fontSize: '0.8rem', color: SEMANTIC.textFaint, margin: '0 0 8px', fontStyle: 'italic' }}>
        {tr ? item.meaningTr : item.meaningEn}
      </p>

      {/* Source */}
      <p style={{ fontSize: '0.72rem', color: `${color}EE`, margin: '0 0 8px', fontWeight: 500 }}>
        {tr ? item.kaynak : item.kaynakEn}
      </p>

      {/* Note */}
      {(tr ? item.notTr : item.notEn) && (
        <p style={{ fontSize: '0.78rem', color: 'rgba(148, 163, 184, 0.82)', lineHeight: 1.55, margin: '0 0 6px' }}>
          {tr ? item.notTr : item.notEn}
        </p>
      )}

      {/* Badges */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {item.isHadis && <HadisBadge language={language} />}
        {item.isTartismaali && (
          <span style={{
            fontSize: '0.65rem', fontWeight: 600,
            color: 'rgba(148, 163, 184, 0.82)',
            background: 'rgba(148,163,184,0.07)',
            border: '1px solid rgba(148,163,184,0.15)',
            borderRadius: RADIUS.pillSm, padding: '1px 7px',
          }}>
            {language === 'tr' ? 'Tartışmalı' : 'Disputed'}
          </span>
        )}
      </div>
    </div>
  );
}

// ── STAT PILL ────────────────────────────────────────────────────────────────
function StatPill({ value, label, color, isMobile }) {
  return (
    <div className="mq-box" style={{
      background: 'rgba(0,0,0,0.25)',
      borderRadius: RADIUS.md,
      '--pt-d': "10px", '--pt-m': "8px", '--pr-d': "14px", '--pr-m': "10px", '--pb-d': "10px", '--pb-m': "8px", '--pl-d': "14px", '--pl-m': "10px",
      textAlign: 'center',
      minWidth: '60px',
    }}>
      <div style={{ fontSize: isMobile ? '1.1rem' : '1.3rem', fontWeight: 800, color, lineHeight: 1.1 }}>{value}</div>
      <div style={{ fontSize: '0.62rem', color: SEMANTIC.textFaint, marginTop: '2px', letterSpacing: '0.04em' }}>{label}</div>
    </div>
  );
}

// ── HERO BANNER ───────────────────────────────────────────────────────────────
function HeroBanner({ data, language, isMobile }) {
  const tr = language === 'tr';
  const cennetCount  = data.cennetIsimleri?.length  ?? 9;
  const cehennemCount = data.cehennemIsimleri?.length ?? 7;

  return (
    <div className="cc-hero-banner" style={{
      marginBottom: '28px',
      borderRadius: RADIUS.xl,
      overflow: 'hidden',
      border: `1px solid ${COLORS.glassBgStrong}`,
    }}>
      {/* Left: Cennet */}
      <div className="mq-box" style={{ background: CENNET.bg, '--pt-d': "24px", '--pt-m': "16px", '--pr-d': "28px", '--pr-m': "16px", '--pb-d': "24px", '--pb-m': "16px", '--pl-d': "28px", '--pl-m': "16px", display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '14px' }}>
        <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: CENNET.accent }}>
          {tr ? 'Cennet' : 'Paradise'}
        </div>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <StatPill value={cennetCount}  label={tr ? 'İsim' : 'Names'}   color={CENNET.accent} isMobile={isMobile} />
          <StatPill value="~147"         label={tr ? 'Ayet' : 'Verses'}  color={CENNET.accent} isMobile={isMobile} />
          <StatPill value={4}            label={tr ? 'Nehir' : 'Rivers'} color={CENNET.accent} isMobile={isMobile} />
        </div>
      </div>

      {/* Center: verse + meal */}
      {!isMobile ? (
        <div style={{
          background: COLORS.softGoldAlpha04,
          borderLeft: '1px solid rgba(255,255,255,0.07)',
          borderRight: '1px solid rgba(255,255,255,0.07)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '20px 24px', gap: '10px',
        }}>
          <div dir="rtl" lang="ar" style={{
            fontFamily: FONTS.quran, fontSize: '1.55rem', color: GOLD,
            direction: 'rtl', textAlign: 'center', lineHeight: 1.9,
          }}>
            وَبَيْنَهُمَا حِجَابٌ
          </div>
          <div style={{
            fontSize: '0.78rem', color: COLORS.silver, textAlign: 'center',
            fontStyle: 'italic', lineHeight: 1.5, maxWidth: '220px',
          }}>
            {tr
              ? '"İkisi arasında bir perde vardır."'
              : '"Between them is a barrier."'}
          </div>
          <div style={{ fontSize: '0.68rem', color: `${GOLD}C7`, fontWeight: 600, letterSpacing: '0.04em' }}>
            {tr ? "A'râf 7:46" : "Al-A'raf 7:46"}
          </div>
        </div>
      ) : (
        <div style={{
          background: COLORS.softGoldAlpha04,
          borderTop: '1px solid rgba(255,255,255,0.07)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', padding: '16px 24px', gap: '8px',
        }}>
          <div dir="rtl" lang="ar" style={{ fontFamily: FONTS.quran, fontSize: '1.3rem', color: GOLD, direction: 'rtl', textAlign: 'center', lineHeight: 1.9 }}>
            وَبَيْنَهُمَا حِجَابٌ
          </div>
          <div style={{ fontSize: '0.75rem', color: COLORS.silver, fontStyle: 'italic', textAlign: 'center' }}>
            {tr ? '"İkisi arasında bir perde vardır."' : '"Between them is a barrier."'}
          </div>
          <div style={{ fontSize: '0.65rem', color: `${GOLD}C7`, fontWeight: 600 }}>
            {tr ? "A'râf 7:46" : "Al-A'raf 7:46"}
          </div>
        </div>
      )}

      {/* Right: Cehennem */}
      <div className="mq-box" style={{
        background: CEHENNEM.bg,
        '--pt-d': "24px", '--pt-m': "16px", '--pr-d': "28px", '--pr-m': "16px", '--pb-d': "24px", '--pb-m': "16px", '--pl-d': "28px", '--pl-m': "16px",
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '14px',
      }}>
        <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: CEHENNEM.accent }}>
          {tr ? 'Cehennem' : 'Hell'}
        </div>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <StatPill value={cehennemCount} label={tr ? 'İsim' : 'Names'}   color={CEHENNEM.accent} isMobile={isMobile} />
          <StatPill value="~77"           label={tr ? 'Ayet' : 'Verses'}  color={CEHENNEM.accent} isMobile={isMobile} />
          <StatPill value={19}            label={tr ? 'Melek' : 'Angels'} color={CEHENNEM.accent} isMobile={isMobile} />
        </div>
      </div>
    </div>
  );
}

// ── TAB 2: CENNET ─────────────────────────────────────────────────────────────
function TabCennet({ data, language, isMobile }) {
  const tr = language === 'tr';
  const d = data.cennetDetaylari || {};

  return (
    <div>
      {/* ═══ 9-CENNET RISING LAYERS SVG (Dalga 2.5) ═══ */}
      <NineCennetLayers language={language} isMobile={isMobile} names={data.cennetIsimleri || []} />

      {/* Section A — Nehirler */}
      <SectionTitle color={CENNET.accent}>
        {tr ? 'A. Cennetin 4 Nehri' : 'A. The 4 Rivers of Paradise'}
      </SectionTitle>
      <VerseBlock
        ar="فِيهَا أَنْهَارٌ مِّن مَّاءٍ غَيْرِ آسِنٍ وَأَنْهَارٌ مِّن لَّبَنٍ لَّمْ يَتَغَيَّرْ طَعْمُهُ وَأَنْهَارٌ مِّنْ خَمْرٍ لَّذَّةٍ لِّلشَّارِبِينَ وَأَنْهَارٌ مِّنْ عَسَلٍ مُّصَفًّى"
        tr="İçinde bozulmayan sudan ırmaklar, tadı değişmeyen sütten ırmaklar, içenlere lezzet veren şaraptan ırmaklar ve arıtılmış baldan ırmaklar bulunur."
        en="In it are rivers of water unaltered, rivers of milk of which the taste never changes, rivers of wine delicious to those who drink, and rivers of purified honey."
        kaynak="Muhammed 47:15"
        language={language}
        color={CENNET.accent}
      />
      <div className="g-2-4" style={{
        display: 'grid',
        gap: '10px',
        marginBottom: '8px',
      }}>
        {(d.nehirler || []).map(n => (
          <div key={n.id} style={{
            background: CENNET.bg,
            border: `1px solid ${CENNET.border}`,
            borderRadius: RADIUS.chip, padding: '12px 14px',
            textAlign: 'center',
          }}>
            <p dir="rtl" lang="ar" style={{ fontFamily: FONTS.quran, fontSize: '1.2rem', color: GOLD, textAlign: 'right', direction: 'rtl', margin: '0 0 6px' }}>{n.nameAr}</p>
            <p style={{ fontSize: '0.85rem', fontWeight: 700, color: COLORS.offWhite, margin: '0 0 4px' }}>{tr ? n.nameTr : n.nameEn}</p>
            <p style={{ fontSize: '0.75rem', color: SEMANTIC.textFaint, margin: '0 0 4px', lineHeight: 1.4 }}>{tr ? n.descTr : n.descEn}</p>
            {n.notTr && <p style={{ fontSize: '0.7rem', color: 'rgba(148, 163, 184, 0.82)', fontStyle: 'italic', margin: 0, lineHeight: 1.4 }}>{tr ? n.notTr : n.notEn}</p>}
          </div>
        ))}
      </div>

      {/* Section B — Bitkiler */}
      <SectionTitle color={CENNET.accent}>
        {tr ? 'B. Cennet Bitkileri & Pınarları' : 'B. Plants & Springs of Paradise'}
      </SectionTitle>
      <div className="g-1-2" style={{ display: 'grid',  gap: '10px', marginBottom: '8px' }}>
        {(d.bitkiler || []).map(b => (
          <div key={b.id} style={{
            background: 'rgba(255,255,255,0.03)',
            border: `1px solid ${b.isHapax ? 'rgba(139,92,246,0.3)' : COLORS.glassBgStrong}`,
            borderLeft: `2px solid ${b.isHapax ? HAPAX : CENNET.accent}`,
            borderRadius: RADIUS.chip, padding: '12px 14px',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '6px' }}>
              <p dir="rtl" lang="ar" style={{ fontFamily: FONTS.quran, fontSize: '1.2rem', color: GOLD, textAlign: 'right', direction: 'rtl', margin: 0 }}>{b.nameAr}</p>
              <div style={{ display: 'flex', gap: '4px', flexShrink: 0, marginTop: '4px' }}>
                {b.isHapax && <HapaxBadge language={language} />}
              </div>
            </div>
            <p style={{ fontSize: '0.88rem', fontWeight: 700, color: COLORS.offWhite, margin: '0 0 4px' }}>{tr ? b.nameTr : b.nameEn}</p>
            <p style={{ fontSize: '0.78rem', color: COLORS.silver, margin: '0 0 6px', lineHeight: 1.5 }}>{tr ? b.descTr : b.descEn}</p>
            <p style={{ fontSize: '0.7rem', color: `${CENNET.accent}80`, fontWeight: 500, margin: 0 }}>{b.kaynak}</p>
          </div>
        ))}
      </div>

      {/* Section C — Sakinler */}
      <SectionTitle color={CENNET.accent}>
        {tr ? 'C. Cennet Sakinleri' : 'C. The Inhabitants of Paradise'}
      </SectionTitle>
      <div className="g-1-3" style={{ display: 'grid',  gap: '10px', marginBottom: '8px' }}>
        {(d.sakinler || []).map(s => (
          <div key={s.id} style={{
            background: CENNET.bg,
            border: `1px solid ${CENNET.border}`,
            borderRadius: RADIUS.chip, padding: '14px 16px',
          }}>
            <p dir="rtl" lang="ar" style={{ fontFamily: FONTS.quran, fontSize: '1.15rem', color: GOLD, textAlign: 'right', direction: 'rtl', margin: '0 0 8px' }}>{s.nameAr}</p>
            <p style={{ fontSize: '0.9rem', fontWeight: 700, color: COLORS.offWhite, margin: '0 0 6px' }}>{tr ? s.nameTr : s.nameEn}</p>
            <p style={{ fontSize: '0.78rem', color: COLORS.silver, margin: '0 0 8px', lineHeight: 1.55 }}>{tr ? s.descTr : s.descEn}</p>
            <p style={{ fontSize: '0.7rem', color: `${CENNET.accent}80`, fontWeight: 500, margin: '0 0 6px' }}>{s.kaynak}</p>
            {s.notTr && <InfoNote text={tr ? s.notTr : s.notEn} />}
          </div>
        ))}
      </div>

      {/* Section D — Fiziksel Özellikler */}
      <SectionTitle color={CENNET.accent}>
        {tr ? 'D. Fiziksel Özellikler' : 'D. Physical Properties'}
      </SectionTitle>
      <div className="g-2-3" style={{ display: 'grid', gap: '10px', marginBottom: '8px' }}>
        {(d.fiziksel || []).map(f => (
          <div key={f.id} style={{
            background: f.isSessizlik ? 'rgba(255,255,255,0.02)' : CENNET.bg,
            border: `1px solid ${f.isSessizlik ? 'rgba(255,255,255,0.06)' : CENNET.border}`,
            borderRadius: RADIUS.chip, padding: '12px 14px',
          }}>
            <p style={{ fontSize: '0.72rem', color: SEMANTIC.textFaint, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 4px', fontWeight: 600 }}>
              {tr ? f.labelTr : f.labelEn}
            </p>
            <p style={{ fontSize: '0.88rem', fontWeight: 700, color: f.isSessizlik ? COLORS.slate600 : COLORS.offWhite, margin: '0 0 6px', lineHeight: 1.4 }}>
              {tr ? f.valueTr : f.valueEn}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', flexWrap: 'wrap' }}>
              <p style={{ fontSize: '0.7rem', color: `${CENNET.accent}80`, fontWeight: 500, margin: 0 }}>{f.kaynak !== '—' ? f.kaynak : '—'}</p>
              {f.isHadis && <HadisBadge language={language} />}
            </div>
          </div>
        ))}
      </div>

      {/* Section E — Vakıa Sınıflandırması */}
      <SectionTitle color={CENNET.accent}>
        {tr ? "E. Vâkıa Sûresi'nin Üçlü Sınıflandırması" : 'E. The Tripartite Classification of Al-Waqi\'a'}
      </SectionTitle>
      <div className="g-1-3" style={{ display: 'grid',  gap: '10px' }}>
        {[
          {
            nameAr: 'السَّابِقُونَ',
            nameTr: "Sâbikûn — Öne Geçenler",
            nameEn: "Al-Sabiqun — The Foremost",
            descTr: "Öne geçenler — işte onlar mukarreblerdir. En yüksek cennet tabakası.",
            descEn: "The foremost — they are the ones brought near. The highest tier of Paradise.",
            kaynak: "Vâkıa 56:10-11",
            color: CENNET.accent, bg: CENNET.bg, border: CENNET.border
          },
          {
            nameAr: 'أَصْحَابُ الْيَمِينِ',
            nameTr: "Ashâbu'l-Yemîn — Sağ Taraftakiler",
            nameEn: "Ashab al-Yamin — Companions of the Right",
            descTr: "Sağ taraftakiler — ne mutlu sağ taraftakilere! Cennet ehli.",
            descEn: "Companions of the Right — how blessed are the Companions of the Right! The people of Paradise.",
            kaynak: "Vâkıa 56:27",
            color: CENNET.accent, bg: CENNET.bg, border: CENNET.border
          },
          {
            nameAr: 'أَصْحَابُ الشِّمَالِ',
            nameTr: "Ashâbu'ş-Şimâl — Sol Taraftakiler",
            nameEn: "Ashab al-Shimal — Companions of the Left",
            descTr: "Sol taraftakiler — ne kötü sol taraftakiler! Cehennem ehli.",
            descEn: "Companions of the Left — how wretched are the Companions of the Left! The people of Hell.",
            kaynak: "Vâkıa 56:41",
            color: CEHENNEM.accent, bg: CEHENNEM.bg, border: CEHENNEM.border
          },
        ].map((g, i) => (
          <div key={i} style={{ background: g.bg, border: `1px solid ${g.border}`, borderRadius: RADIUS.chip, padding: '14px 16px' }}>
            <p dir="rtl" lang="ar" style={{ fontFamily: FONTS.quran, fontSize: '1.2rem', color: GOLD, textAlign: 'right', direction: 'rtl', margin: '0 0 8px' }}>{g.nameAr}</p>
            <p style={{ fontSize: '0.88rem', fontWeight: 700, color: g.color, margin: '0 0 6px' }}>{language === 'tr' ? g.nameTr : g.nameEn}</p>
            <p style={{ fontSize: '0.78rem', color: COLORS.silver, margin: '0 0 8px', lineHeight: 1.55 }}>{language === 'tr' ? g.descTr : g.descEn}</p>
            <p style={{ fontSize: '0.7rem', color: `${g.color}80`, fontWeight: 500, margin: 0 }}>{g.kaynak}</p>
          </div>
        ))}
      </div>
      <p style={{ fontSize: '0.78rem', color: SEMANTIC.textFaint, marginTop: '10px', lineHeight: 1.6, fontStyle: 'italic' }}>
        {language === 'tr'
          ? "Vâkıa sûresi insanlığı bu üç gruba ayırır. İlk iki grup detaylı cennet tasvirleriyle ödüllendirilir — her biri farklı nimetlerle."
          : "Surah Al-Waqi'a divides humanity into these three groups. The first two groups are rewarded with detailed descriptions of Paradise — each with distinct blessings."}
      </p>
    </div>
  );
}

// ── TAB 3: CEHENNEM ───────────────────────────────────────────────────────────
function TabCehennem({ data, language, isMobile }) {
  const tr = language === 'tr';
  const d = data.cehennemDetaylari || {};

  return (
    <div>
      {/* ═══ 7-CEHENNEM DESCENDING LAYERS SVG (Dalga 2.5) ═══ */}
      <SevenCehennemLayers language={language} isMobile={isMobile} names={data.cehennemIsimleri || []} />

      {/* Section A — Duyusal Tasvir */}
      <SectionTitle color={CEHENNEM.accent}>
        {tr ? 'A. Beş Duyuyla Cehennem' : 'A. Hell Through the Five Senses'}
      </SectionTitle>
      <div className="g-1-2" style={{ display: 'grid',  gap: '10px', marginBottom: '8px' }}>
        {(d.duyusal || []).map(item => (
          <div key={item.id} style={{
            background: item.isSessizlik ? 'rgba(255,255,255,0.03)' : CEHENNEM.bg,
            border: `1px solid ${item.isSessizlik ? COLORS.glassBorder : CEHENNEM.border}`,
            borderLeft: `2px solid ${item.isSessizlik ? COLORS.slate600 : CEHENNEM.accent}`,
            borderRadius: RADIUS.chip, padding: '14px 16px',
          }}>
            {/* Sense label */}
            <p style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: item.isSessizlik ? COLORS.slate500 : CEHENNEM.accent, margin: '0 0 10px' }}>
              {tr ? item.duyuTr : item.duyuEn}
            </p>
            {/* Arabic verse */}
            {item.verseAr ? (
              <p style={{ fontFamily: FONTS.quran, fontSize: '1.15rem', color: COLORS.offWhite, textAlign: 'right', direction: 'rtl', lineHeight: 1.9, margin: '0 0 8px' }} lang="ar">
                {item.verseAr}
              </p>
            ) : (
              /* Sessizlik placeholder */
              <p style={{ fontSize: '1.1rem', color: SEMANTIC.textFaint, textAlign: 'center', letterSpacing: '0.3em', margin: '4px 0 12px', fontStyle: 'italic' }}>— — —</p>
            )}
            {/* Translation */}
            {(tr ? item.verseTr : item.verseEn) ? (
              <p style={{ fontSize: '0.82rem', color: item.isSessizlik ? COLORS.slate500 : COLORS.silver, margin: '0 0 8px', lineHeight: 1.6, fontStyle: 'italic' }}>
                {tr ? item.verseTr : item.verseEn}
              </p>
            ) : null}
            {/* Analytical note */}
            {(tr ? item.notTr : item.notEn) && (
              <div style={{ marginBottom: '8px' }}>
                {item.isSessizlik && (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                    fontSize: '0.62rem', fontWeight: 600,
                    color: 'rgba(148, 163, 184, 0.82)',
                    background: 'rgba(148,163,184,0.07)',
                    border: '1px solid rgba(148,163,184,0.18)',
                    borderRadius: RADIUS.pillSm, padding: '1px 8px',
                    marginBottom: '6px',
                    letterSpacing: '0.04em',
                  }}>
                    <svg aria-hidden="true" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    {tr ? 'Tefsir Görüşü' : 'Scholarly Interpretation'}
                  </span>
                )}
                <p style={{ fontSize: '0.75rem', color: item.isSessizlik ? COLORS.slate500 : `${CEHENNEM.accent}EE`, margin: 0, lineHeight: 1.55, fontStyle: 'italic' }}>
                  {tr ? item.notTr : item.notEn}
                </p>
              </div>
            )}
            {/* Source */}
            {item.kaynak !== '—' && (
              <p style={{ fontSize: '0.68rem', color: `${CEHENNEM.accent}C7`, fontWeight: 600, margin: 0 }}>{item.kaynak}</p>
            )}
          </div>
        ))}
      </div>

      {/* Section B — Yiyecekler */}
      <SectionTitle color={CEHENNEM.accent}>
        {tr ? 'B. Cehennem Yiyecekleri' : 'B. Food of Hell'}
      </SectionTitle>
      <div className="g-1-3" style={{ display: 'grid',  gap: '10px', marginBottom: '8px' }}>
        {(d.yiyecekler || []).map(y => (
          <div key={y.id} style={{
            background: CEHENNEM.bg,
            border: `1px solid ${y.isHapax ? 'rgba(139,92,246,0.3)' : CEHENNEM.border}`,
            borderLeft: `2px solid ${y.isHapax ? HAPAX : CEHENNEM.accent}`,
            borderRadius: RADIUS.chip, padding: '14px 16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '6px' }}>
              <p dir="rtl" lang="ar" style={{ fontFamily: FONTS.quran, fontSize: '1.2rem', color: GOLD, textAlign: 'right', direction: 'rtl', margin: 0 }}>{y.nameAr}</p>
              {y.isHapax && <div style={{ flexShrink: 0, marginTop: '4px' }}><HapaxBadge language={language} /></div>}
            </div>
            <p style={{ fontSize: '0.9rem', fontWeight: 700, color: COLORS.offWhite, margin: '0 0 6px' }}>{tr ? y.nameTr : y.nameEn}</p>
            <p style={{ fontSize: '0.78rem', color: COLORS.silver, margin: '0 0 8px', lineHeight: 1.55 }}>{tr ? y.descTr : y.descEn}</p>
            <p style={{ fontSize: '0.7rem', color: `${CEHENNEM.accent}80`, fontWeight: 500, margin: 0 }}>{y.kaynak}</p>
          </div>
        ))}
      </div>

      {/* Section C — 19 Bekçi */}
      {d.bekciMelekler && (
        <>
          <SectionTitle color={CEHENNEM.accent}>
            {tr ? 'C. 19 Bekçi Meleği' : 'C. The 19 Guardian Angels'}
          </SectionTitle>
          <div style={{
            background: CEHENNEM.bg,
            border: `2px solid ${CEHENNEM.border}`,
            borderRadius: RADIUS.lg, padding: '20px 24px',
            marginBottom: '8px',
          }}>
            <p dir="rtl" lang="ar" style={{ fontFamily: FONTS.quran, fontSize: '1.6rem', color: GOLD, textAlign: 'right', direction: 'rtl', margin: '0 0 10px' }}>
              {d.bekciMelekler.verseAr}
            </p>
            <p style={{ fontSize: '0.88rem', color: COLORS.silver, fontStyle: 'italic', margin: '0 0 6px' }}>
              {tr ? d.bekciMelekler.verseTr : d.bekciMelekler.verseEn}
            </p>
            <p style={{ fontSize: '0.72rem', color: `${CEHENNEM.accent}80`, fontWeight: 500, margin: '0 0 14px' }}>
              — {d.bekciMelekler.kaynak}
            </p>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '14px' }}>
              <p style={{ fontSize: '0.83rem', color: COLORS.silver, lineHeight: 1.75, margin: 0 }}>
                {tr ? d.bekciMelekler.aciklamaTr : d.bekciMelekler.aciklamaEn}
              </p>
            </div>
          </div>
        </>
      )}

      {/* Section D — 7 Kapı */}
      <SectionTitle color={CEHENNEM.accent}>
        {tr ? "D. Cehennemin 7 Kapısı" : "D. The 7 Gates of Hell"}
      </SectionTitle>
      <VerseBlock
        ar="لَهَا سَبْعَةُ أَبْوَابٍ لِّكُلِّ بَابٍ مِّنْهُمْ جُزْءٌ مَّقْسُومٌ"
        tr="Onun yedi kapısı vardır. Her kapıya onlardan belirlenmiş bir grup ayrılmıştır."
        en="It has seven gates; for each gate is of them a portion designated."
        kaynak="Hicr 15:44"
        language={language}
        color={CEHENNEM.accent}
      />
      {/* 7 gates visual — names from cehennemIsimleri */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '10px' }}>
        {(data.cehennemIsimleri || []).map((item, idx) => {
          const depth = idx / 6; // 0 → 1 as we go deeper
          return (
            <div className="mq-box" key={item.id} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              background: `rgba(153,60,29,${0.05 + depth * 0.12})`,
              border: `1px solid rgba(216,90,48,${0.12 + depth * 0.18})`,
              borderRadius: RADIUS.md,
              '--pt-d': "10px", '--pt-m': "9px", '--pr-d': "16px", '--pr-m': "12px", '--pb-d': "10px", '--pb-m': "9px", '--pl-d': "16px", '--pl-m': "12px",
            }}>
              {/* Gate number badge */}
              <div style={{
                width: '26px', height: '26px', borderRadius: RADIUS.full, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: `rgba(216,90,48,${0.1 + depth * 0.15})`,
                border: `1px solid rgba(216,90,48,${0.3 + depth * 0.3})`,
                fontSize: '0.72rem', fontWeight: 800, color: CEHENNEM.accent,
              }}>{idx + 1}</div>
              {/* Arabic name */}
              <div style={{ fontFamily: FONTS.quran, fontSize: isMobile ? '1rem' : '1.15rem', color: GOLD, direction: 'rtl', flexShrink: 0, lineHeight: 1.8 }}>
                {item.nameAr}
              </div>
              {/* Name + meaning */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: COLORS.offWhite }}>
                  {tr ? item.nameTr : item.nameEn}
                </span>
                {(tr ? item.meaningTr : item.meaningEn) && (
                  <span style={{ fontSize: '0.72rem', color: SEMANTIC.textFaint, marginLeft: '8px', fontStyle: 'italic' }}>
                    {tr ? item.meaningTr : item.meaningEn}
                  </span>
                )}
              </div>
              {/* Frequency */}
              <div style={{ fontSize: '0.65rem', color: `${CEHENNEM.accent}C7`, flexShrink: 0, textAlign: 'right' }}>
                {tr ? item.frequency : item.frequencyEn}
              </div>
            </div>
          );
        })}
      </div>
      <InfoNote text={tr
        ? "Kur'an kapı sayısını 7 verir ancak hangi kapıdan kimin gireceğini belirtmez. Bu ayrıntı müfessirlere aittir."
        : "The Quran states there are 7 gates but does not specify who enters through which gate. This detail belongs to the commentators."
      } />
    </div>
  );
}

// ── TAB 4: A'RAF ──────────────────────────────────────────────────────────────
function TabAraf({ data, language, isMobile }) {
  const tr = language === 'tr';
  const araf = data.araf || {};

  return (
    <div>
      {/* Feature verse */}
      <div style={{
        background: ARAF.bg,
        border: `2px solid ${ARAF.border}`,
        borderRadius: RADIUS.lg, padding: '22px 24px',
        marginBottom: '20px',
      }}>
        <p dir="rtl" lang="ar" style={{ fontFamily: FONTS.quran, fontSize: '1.5rem', color: GOLD, textAlign: 'right', direction: 'rtl', margin: '0 0 10px', lineHeight: 2 }}>
          {araf.verseAr}
        </p>
        <p style={{ fontSize: '0.88rem', color: COLORS.silver, fontStyle: 'italic', margin: '0 0 6px' }}>
          {tr ? araf.verseTr : araf.verseEn}
        </p>
        <p style={{ fontSize: '0.72rem', color: `${ARAF.accent}EE`, fontWeight: 600, margin: 0 }}>
          — {araf.kaynak}
        </p>
      </div>

      {/* Explanation */}
      <p style={{ fontSize: '0.92rem', color: COLORS.silver, lineHeight: 1.8, maxWidth: '700px', marginBottom: '24px' }}>
        {tr ? araf.aciklamaTr : araf.aciklamaEn}
      </p>

      {/* ── KLASİK TEFSİR TARTIŞMASI — A'râf Ehli Kimdir? ─── */}
      <div className="mq-box" style={{
        background: `${ARAF.bg}`,
        border: `1px solid ${ARAF.border}`,
        borderLeft: `3px solid ${ARAF.accent}`,
        borderRadius: RADIUS.lg,
        '--pt-d': "22px", '--pt-m': "18px", '--pr-d': "26px", '--pr-m': "18px", '--pb-d': "22px", '--pb-m': "18px", '--pl-d': "26px", '--pl-m': "18px",
        marginBottom: '24px',
        maxWidth: '760px',
      }}>
        <p style={{ fontSize: '0.66rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: ARAF.accent, opacity: 0.85, margin: '0 0 12px' }}>
          {tr ? "Klasik Tefsir Tartışması" : "Classical Tafsir Debate"}
        </p>
        <p style={{ fontSize: '0.95rem', fontWeight: 700, color: COLORS.offWhite, margin: '0 0 14px', lineHeight: 1.3 }}>
          {tr ? "A'râf Ehli kimlerdir?" : "Who are the People of al-Aʿrāf?"}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <p style={{ fontSize: '0.82rem', fontWeight: 700, color: ARAF.accent, margin: '0 0 4px' }}>
              {tr ? "1. Hasan-i Basrî · İbn Abbâs" : "1. al-Ḥasan al-Baṣrī · Ibn ʿAbbās"}
            </p>
            <p style={{ fontSize: '0.84rem', color: COLORS.silver, lineHeight: 1.7, margin: 0 }}>
              {tr ? "İyilikleri ile kötülükleri eşit gelen, ne cennete ne cehenneme girebilen mukrik kişiler. Allah'ın hükmüne bırakılırlar (Tabarî 12:418-419)." : "Those whose good and evil deeds balance exactly — neither admitted to paradise nor cast into hell. Their case is reserved for divine judgment (al-Ṭabarī 12:418-419)."}
            </p>
          </div>
          <div>
            <p style={{ fontSize: '0.82rem', fontWeight: 700, color: ARAF.accent, margin: '0 0 4px' }}>
              {tr ? "2. Mücâhid · Suddî" : "2. Mujāhid · al-Suddī"}
            </p>
            <p style={{ fontSize: '0.84rem', color: COLORS.silver, lineHeight: 1.7, margin: 0 }}>
              {tr ? "Peygamberler ve şehidlerdir; Cennet ile Cehennem arasındaki yüksek mevkide oturup iki tarafa da bakarlar — sınır gözcüleri." : "Prophets and martyrs — stationed on the high vantage between paradise and hell, watching both sides — sentinels of the partition."}
            </p>
          </div>
          <div>
            <p style={{ fontSize: '0.82rem', fontWeight: 700, color: ARAF.accent, margin: '0 0 4px' }}>
              {tr ? "3. Râzî · Modern Okuma" : "3. al-Rāzī · Modern Reading"}
            </p>
            <p style={{ fontSize: '0.84rem', color: COLORS.silver, lineHeight: 1.7, margin: 0 }}>
              {tr ? "Bir ara-evre değil bir hâl: imanın berraklaşması için bekletme; nihai hüküm Allah'ındır. Klasik tefsir bu üç görüşü uzlaştırmaz, üç ayrı pencere bırakır." : "Not an intermediate place but a state: a pause for faith to clarify; the final ruling belongs to Allah. Classical tafsir does not reconcile the three — it leaves three windows."}
            </p>
          </div>
        </div>
      </div>

      {/* Questions */}
      <SectionTitle color={ARAF.accent}>
        {tr ? 'A\'râf Hakkında Üç Soru' : 'Three Questions About A\'raf'}
      </SectionTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
        {(araf.sorular || []).map(s => (
          <div key={s.id} style={{
            background: ARAF.bg,
            border: `1px solid ${ARAF.border}`,
            borderLeft: `3px solid ${ARAF.accent}`,
            borderRadius: RADIUS.chip, padding: '16px 18px',
          }}>
            <p style={{ fontSize: '0.9rem', fontWeight: 700, color: COLORS.offWhite, margin: '0 0 8px' }}>
              {tr ? s.soruTr : s.soruEn}
            </p>
            <p style={{ fontSize: '0.82rem', color: COLORS.silver, lineHeight: 1.65, margin: '0 0 8px' }}>
              {tr ? s.cevapTr : s.cevapEn}
            </p>
            {s.isHadis && <HadisBadge language={language} />}
          </div>
        ))}
      </div>

      {/* İlliyyûn vs Siccîn */}
      <SectionTitle color={ARAF.accent}>
        {tr ? "İlliyyûn & Siccîn — Öteki Alemin Kayıt Sistemi" : "Illiyyun & Sijjin — The Record System of the Hereafter"}
      </SectionTitle>
      <div className="g-1-2" style={{ display: 'grid',  gap: '12px' }}>
        {(araf.illiyyunSiccin || []).map(item => {
          const c = item.taraf === 'cennet' ? CENNET : CEHENNEM;
          return (
            <div key={item.id} style={{
              background: c.bg,
              border: `1px solid ${c.border}`,
              borderRadius: RADIUS.chip, padding: '16px 18px',
            }}>
              <p dir="rtl" lang="ar" style={{ fontFamily: FONTS.quran, fontSize: '1.3rem', color: GOLD, textAlign: 'right', direction: 'rtl', margin: '0 0 8px' }}>{item.nameAr}</p>
              <p style={{ fontSize: '0.9rem', fontWeight: 700, color: c.accent, margin: '0 0 6px' }}>{tr ? item.nameTr : item.nameEn}</p>
              <p style={{ fontSize: '0.8rem', color: COLORS.silver, margin: '0 0 8px', lineHeight: 1.55 }}>{tr ? item.descTr : item.descEn}</p>
              <p style={{ fontSize: '0.7rem', color: `${c.accent}80`, fontWeight: 500, margin: 0 }}>{item.kaynak}</p>
            </div>
          );
        })}
      </div>
      <InfoNote text={tr
        ? "İlliyyûn ve Siccîn — her iki kavramın tam anlamı da müfessirler arasında tartışmalıdır."
        : "Illiyyun and Sijjin — the precise meaning of both concepts is debated among scholars."
      } />
    </div>
  );
}

// ── TAB 5: RAHMAN SİMETRİSİ ───────────────────────────────────────────────────
function TabRahman({ data, language, isMobile }) {
  const tr = language === 'tr';
  const rs = data.rahmanSimetrisi || {};

  return (
    <div>
      {/* ═══ RAHMAN 31-REFRAIN BAR VIZ + 5-SENSE GRID (Dalga 2.5) ═══ */}
      <Rahman31Viz language={language} isMobile={isMobile} rs={rs} />
      <FiveSenseGrid language={language} isMobile={isMobile} />

      {/* Feature nakarat */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${COLORS.glassBorder}`,
        borderRadius: RADIUS.xl, padding: '24px',
        marginBottom: '20px',
        textAlign: 'center',
      }}>
        <p dir="rtl" lang="ar" style={{ fontFamily: FONTS.quran, fontSize: '1.6rem', color: GOLD, direction: 'rtl', margin: '0 0 10px', lineHeight: 2, textAlign: 'center' }}>
          {rs.nakaratAr}
        </p>
        <p style={{ fontSize: '0.92rem', color: COLORS.silver, fontStyle: 'italic', margin: '0 0 6px' }}>
          {tr ? rs.nakaratTr : rs.nakaratEn}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <span style={{
            fontSize: '1.1rem', fontWeight: 800, color: GOLD,
          }}>{rs.nakaratCount}×</span>
          <span style={{ fontSize: '0.75rem', color: SEMANTIC.textFaint }}>
            {tr ? rs.nakaratKaynak : rs.nakaratKaynakEn}
          </span>
        </div>
      </div>

      {/* Explanation */}
      <p style={{ fontSize: '0.92rem', color: COLORS.silver, lineHeight: 1.8, maxWidth: '700px', marginBottom: '24px' }}>
        {tr ? rs.aciklamaTr : rs.aciklamaEn}
      </p>

      {/* Two-column symmetry visual */}
      <SectionTitle color={GOLD}>
        {tr ? "Cennet & Cehennem: Paralel Tasvirler" : "Paradise & Hell: Parallel Descriptions"}
      </SectionTitle>
      <div className="cc-symmetry-grid" style={{
        display: 'grid',
        gap: '0',
        marginBottom: '24px',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: RADIUS.lg,
        overflow: 'hidden',
      }}>
        {/* Paradise col */}
        <div style={{ padding: '16px', background: CENNET.bg }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: CENNET.accent, margin: '0 0 12px' }}>
            {tr ? 'Cennet Tasvirleri' : 'Paradise Descriptions'}
          </p>
          {[
            { tr: 'İki bahçe — çeşit çeşit meyveler', en: 'Two gardens — fruits of every kind', ref: '55:46-53' },
            { tr: 'Uzanan gölge, çağlayan su', en: 'Extended shade, flowing water', ref: '55:54' },
            { tr: 'Uzanan kollarla meyve veren ağaçlar', en: 'Fruit trees within reach', ref: '55:54' },
            { tr: 'Yataklara yaslanmış eşler', en: 'Spouses reclining on cushions', ref: '55:54-56' },
            { tr: "Bunun ötesinde daha iki bahçe daha", en: 'Beyond these, two more gardens', ref: '55:62-76' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <span style={{ fontSize: '0.78rem', color: COLORS.silver }}>{language === 'tr' ? item.tr : item.en}</span>
              <span style={{ fontSize: '0.68rem', color: `${CENNET.accent}80`, flexShrink: 0 }}>{item.ref}</span>
            </div>
          ))}
        </div>

        {/* Center divider */}
        {!isMobile && (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(255,255,255,0.02)',
            gap: '6px', padding: '8px 0',
          }}>
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} style={{ width: '4px', height: '4px', borderRadius: RADIUS.full, background: `${GOLD}50` }} />
            ))}
          </div>
        )}

        {/* Hell col */}
        <div style={{ padding: '16px', background: CEHENNEM.bg }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: CEHENNEM.accent, margin: '0 0 12px' }}>
            {tr ? 'Cehennem Tasvirleri' : 'Hell Descriptions'}
          </p>
          {[
            { tr: 'Günahkârların yüzüyle bilinen işaretler', en: 'Marks by which sinners are known', ref: '55:41' },
            { tr: 'İşte bu, suçluların yalanladığı cehennem', en: 'This is the Hell the guilty deny', ref: '55:43' },
            { tr: 'Cehennemle kaynar su arasında dolaşırlar', en: 'They circle between it and scalding water', ref: '55:44' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <span style={{ fontSize: '0.78rem', color: COLORS.silver }}>{language === 'tr' ? item.tr : item.en}</span>
              <span style={{ fontSize: '0.68rem', color: `${CEHENNEM.accent}80`, flexShrink: 0 }}>{item.ref}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Analysis cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {(rs.kartlar || []).map(k => (
          <div key={k.id} style={{
            background: 'rgba(255,255,255,0.03)',
            border: `1px solid ${COLORS.softGoldAlpha20}`,
            borderLeft: `3px solid ${GOLD}`,
            borderRadius: RADIUS.chip, padding: '16px 18px',
          }}>
            <p style={{ fontSize: '0.9rem', fontWeight: 700, color: COLORS.offWhite, margin: '0 0 8px' }}>
              {tr ? k.titleTr : k.titleEn}
            </p>
            <p style={{ fontSize: '0.82rem', color: COLORS.silver, lineHeight: 1.7, margin: 0 }}>
              {tr ? k.bodyTr : k.bodyEn}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── TAB 6: KAYNAKLAR ──────────────────────────────────────────────────────────
const SOURCE_URLS = {
  corpus:       'https://corpus.quran.com',
  tanzil:       'https://tanzil.net',
  kuranvemeali: 'https://www.kuranvemeali.com',
  'tdv-cehennem': 'https://islamansiklopedisi.org.tr/cehennem',
  'tdv-cahim':    'https://islamansiklopedisi.org.tr/cahim',
};

const CROSS_LINKS = [
  { labelTr: 'Tabiat Atlası',       labelEn: 'Nature Atlas',         event: 'openNatureAtlas' },
  { labelTr: 'Muhatap Sistemi',      labelEn: 'Addressee System',     event: 'openAddresseeSystem' },
  { labelTr: 'İmkânsız Ritim',       labelEn: 'Impossible Rhythm',    section: '#impossible-rhythm' },
  { labelTr: 'Kavram Ağı',           labelEn: 'Concept Graph',        event: 'openConceptGraph' },
  { labelTr: 'Kur\'an\'ın Emirleri', labelEn: 'Quran Commands',       event: 'openQuranCommands' },
];

function SourceSection({ titleTr, titleEn, items, tr }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <h3 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: SEMANTIC.textFaint, margin: '0 0 10px' }}>
        {tr ? titleTr : titleEn}
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {items.map(item => {
          const url = SOURCE_URLS[item.id];
          const label = tr ? item.nameTr : item.nameEn;
          return (
            <div key={item.id} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: RADIUS.md, padding: '10px 14px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px',
            }}>
              <p style={{ fontSize: '0.85rem', color: COLORS.silver, margin: 0, flex: 1 }}>
                {label}
              </p>
              {url && (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                    fontSize: '0.72rem', fontWeight: 600,
                    color: GOLD, textDecoration: 'none', flexShrink: 0,
                    padding: '3px 8px',
                    border: `1px solid ${GOLD}30`,
                    borderRadius: RADIUS.sm,
                    background: `${GOLD}08`,
                  }}
                >
                  {tr ? 'Aç' : 'Open'}
                  <ExternalLinkIcon size={10} strokeWidth={2.5} />
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TabKaynaklar({ data, language }) {
  const tr = language === 'tr';
  const k = data.kaynaklar || {};

  return (
    <div style={{ maxWidth: '680px' }}>
      {/* Global note */}
      <div style={{
        background: COLORS.softGoldAlpha08,
        border: `1px solid ${COLORS.softGoldAlpha20}`,
        borderRadius: RADIUS.chip, padding: '16px 18px',
        marginBottom: '24px',
        display: 'flex', gap: '10px', alignItems: 'flex-start',
      }}>
        <span style={{ color: GOLD, flexShrink: 0, fontSize: '1rem', marginTop: '1px' }}>ℹ</span>
        <p style={{ fontSize: '0.82rem', color: COLORS.silver, lineHeight: 1.7, margin: 0 }}>
          {tr ? k.globalNotTr : k.globalNotEn}
        </p>
      </div>

      <SourceSection titleTr="Klasik Tefsir" titleEn="Classical Commentary" items={k.klasikTefsir || []} tr={tr} />
      <SourceSection titleTr="Akademik Kaynaklar" titleEn="Academic Sources" items={k.akademik || []} tr={tr} />
      <SourceSection titleTr="Dijital Doğrulama" titleEn="Digital Verification" items={k.dijital || []} tr={tr} />

      {/* Cross-tool links */}
      <div style={{ marginTop: '28px' }}>
        <h3 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: SEMANTIC.textFaint, margin: '0 0 10px' }}>
          {tr ? 'İlgili Araçlar' : 'Related Tools'}
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {/* 2026-08-13 (Z3b) — beş rozetin BEŞİ DE ölüydü.
              Dördü `dispatchEvent` ediyordu ama dinleyicileri Vite→Next
              göçünde (§16.5) kalkmıştı; beşincisinin (`İmkânsız Ritim`)
              `event` alanı hiç yoktu, `link.event &&` guard'ı sessizce
              yutuyordu. Tıklama → hiçbir şey, hata da yok.
              Şimdi `<Link>`: orta tık ve "yeni sekmede aç" da çalışır. */}
          {CROSS_LINKS.map((link, i) => {
            const route = link.event ? routeForToolEvent(link.event) : null;
            const href = route ? `/${language}${route}`
              : link.section ? `/${language}${link.section}`
              : null;
            if (!href) return null;   // hedefi olmayan rozeti GÖSTERME
            return (
            <Link
              key={i}
              href={href}
              style={{
                textDecoration: 'none',
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                padding: '6px 14px',
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid ${COLORS.glassBorder}`,
                borderRadius: RADIUS.pillSm,
                color: COLORS.silver,
                fontSize: '0.8rem',
                cursor: 'pointer',
                fontFamily: "'Inter', sans-serif",
                transition: `all ${TRANSITION.fast}`,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = COLORS.glassBgStrong; e.currentTarget.style.color = COLORS.offWhite; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = COLORS.silver; }}
            >
              <svg aria-hidden="true" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
              {tr ? link.labelTr : link.labelEn}
            </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ═══════════ DALGA 2.5 WIDGETS ═══════════

// 9-Cennet Rising Layers — Firdevs center, others outer rings
function NineCennetLayers({ language, isMobile, names }) {
  const tr = language === 'tr';
  // Order for the rising ladder: cennet(base) → naim → meva → adn → huld → makamul-emin → darussalam → illiyyun → firdevs(peak)
  const ORDER = ['cennet', 'naim', 'meva', 'adn', 'huld', 'makamul-emin', 'darussalam', 'illiyyun', 'firdevs'];
  const list = ORDER.map(id => names.find(n => n.id === id)).filter(Boolean);
  const rows = [...list].reverse(); // top = peak

  return (
    <div className="mq-box" style={{
      marginBottom: '28px',
      '--pt-d': "28px", '--pt-m': "20px", '--pr-d': "32px", '--pr-m': "16px", '--pb-d': "28px", '--pb-m': "20px", '--pl-d': "32px", '--pl-m': "16px",
      background: 'linear-gradient(180deg, rgba(46,204,113,0.06) 0%, rgba(212,165,116,0.04) 100%)',
      border: `1px solid ${CENNET.border}`,
      borderRadius: RADIUS.lg,
    }}>
      <div style={{
        fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase',
        color: CENNET.accent, opacity: 0.85, fontWeight: 700,
        marginBottom: '10px', fontFamily: FONTS.body, textAlign: 'center',
      }}>
        {tr ? "CENNETİN 9 KATMANI · YÜKSELEN HALKALAR" : "THE 9 STATIONS OF PARADISE · RISING RINGS"}
      </div>
      <p style={{
        color: COLORS.silver, fontSize: '0.85rem', lineHeight: 1.6,
        textAlign: 'center', maxWidth: '620px', margin: '0 auto 22px',
        fontFamily: FONTS.body,
      }}>
        {tr
          ? "Firdevs merkez ve zirvedir — 'cennet nehirleri Firdevs'ten doğar' (Buhârî 2790). Aşağıdaki 8 halka farklı bahçe/mekân imgesidir."
          : "Firdaws is the center and peak — 'the rivers of Paradise spring from al-Firdaws' (Bukhārī 2790). The 8 rings below are different garden/place images."}
      </p>

      {/* Rising layers list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxWidth: '740px', margin: '0 auto' }}>
        {rows.map((n, idx) => {
          const isPeak = idx === 0;
          const width = 100 - (idx * 8);
          return (
            <div className="mq-box" key={n.id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
              '--pt-d': "12px", '--pt-m': "10px", '--pr-d': "18px", '--pr-m': "14px", '--pb-d': "12px", '--pb-m': "10px", '--pl-d': "18px", '--pl-m': "14px",
              width: `${Math.max(width, 45)}%`,
              margin: '0 auto',
              background: isPeak
                ? `linear-gradient(90deg, ${GOLD}22 0%, ${CENNET.accent}22 100%)`
                : `${CENNET.bg}`,
              border: `1px solid ${isPeak ? GOLD : CENNET.border}`,
              borderRadius: RADIUS.md,
              transition: 'all 0.3s',
              position: 'relative',
              boxShadow: isPeak ? `0 0 24px ${GOLD}44` : 'none',
            }}>
              <div style={{
                width: '10px', height: '10px', borderRadius: '50%',
                background: isPeak ? GOLD : CENNET.accent,
                opacity: isPeak ? 1 : (0.9 - idx * 0.08),
                flexShrink: 0,
                boxShadow: isPeak ? `0 0 10px ${GOLD}` : 'none',
              }} />
              <div style={{
                fontFamily: FONTS.quran, fontSize: '1.1rem',
                color: isPeak ? GOLD : CENNET.accent, direction: 'rtl',
                flexShrink: 0,
              }} dir="rtl" lang="ar">{n.nameAr}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: '0.85rem', color: COLORS.offWhite,
                  fontWeight: isPeak ? 700 : 500, fontFamily: FONTS.body,
                }}>{tr ? n.nameTr : n.nameEn}</div>
                {!isMobile && (
                  <div style={{
                    fontSize: '0.72rem', color: COLORS.silver, opacity: 0.78,
                    fontFamily: FONTS.body, marginTop: '2px',
                  }}>{tr ? n.meaningTr : n.meaningEn}</div>
                )}
              </div>
              {isPeak && (
                <span style={{
                  padding: '3px 8px', fontSize: '0.62rem', fontWeight: 700,
                  background: `${GOLD}33`, color: GOLD,
                  borderRadius: RADIUS.chip, letterSpacing: '0.12em',
                  textTransform: 'uppercase', flexShrink: 0,
                }}>{tr ? "ZİRVE" : "PEAK"}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 7-Cehennem Descending Layers
function SevenCehennemLayers({ language, isMobile, names }) {
  const tr = language === 'tr';
  // Classical descending order (varies by source; using İbn Kesîr al-Bidāya order)
  const ORDER = ['cehennem', 'leza', 'sair', 'sakar', 'cahim', 'hutame', 'haviye'];
  const list = ORDER.map(id => names.find(n => n.id === id)).filter(Boolean);
  const shades = ['#e74c3c', '#c0392b', '#a63030', '#8B0000', '#6d0000', '#500000', '#2d0000'];

  return (
    <div className="mq-box" style={{
      marginBottom: '28px',
      '--pt-d': "28px", '--pt-m': "20px", '--pr-d': "32px", '--pr-m': "16px", '--pb-d': "28px", '--pb-m': "20px", '--pl-d': "32px", '--pl-m': "16px",
      background: 'linear-gradient(180deg, rgba(139,0,0,0.08) 0%, rgba(0,0,0,0.4) 100%)',
      border: `1px solid ${CEHENNEM.border}`,
      borderRadius: RADIUS.lg,
    }}>
      <div style={{
        fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase',
        color: '#e74c3c', opacity: 0.85, fontWeight: 700,
        marginBottom: '10px', fontFamily: FONTS.body, textAlign: 'center',
      }}>
        {tr ? "CEHENNEMİN 7 İSMİ · İNEN DAİRELER" : "THE 7 NAMES OF HELL · DESCENDING CIRCLES"}
      </div>
      <p style={{
        color: COLORS.silver, fontSize: '0.85rem', lineHeight: 1.6,
        textAlign: 'center', maxWidth: '620px', margin: '0 auto 22px',
        fontFamily: FONTS.body,
      }}>
        {tr
          ? "Kur'ân cehenneme 7 farklı isim verir — her isim ayrı bir kelime kökü ve azap sahnesi. Kur'ân, cehennemin yedi kapısı olduğunu bildirir (Hicr 15:44). Aşağıdaki inen düzen klasik tefsir (İbn Kesîr, Bidâye) sıralamasına uyar."
          : "The Qur'ān gives Hell 7 distinct names — each with its own root and scene of torment. The Qur'ān states that Hell has seven gates (al-Ḥijr 15:44). The descending order below follows the classical tafsīr (Ibn Kathīr, Bidāya)."}
      </p>

      {/* Descending circles */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxWidth: '740px', margin: '0 auto' }}>
        {list.map((n, idx) => {
          const width = 100 - (idx * 6);
          return (
            <div className="mq-box" key={n.id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
              '--pt-d': "12px", '--pt-m': "10px", '--pr-d': "18px", '--pr-m': "14px", '--pb-d': "12px", '--pb-m': "10px", '--pl-d': "18px", '--pl-m': "14px",
              width: `${Math.max(width, 55)}%`,
              margin: '0 auto',
              background: `linear-gradient(90deg, ${shades[idx]}33 0%, rgba(0,0,0,0.3) 100%)`,
              border: `1px solid ${shades[idx]}88`,
              borderLeft: `3px solid ${shades[idx]}`,
              borderRadius: RADIUS.md,
              transition: 'all 0.3s',
              position: 'relative',
              boxShadow: `0 0 14px ${shades[idx]}22`,
            }}>
              <div style={{
                width: '10px', height: '10px', borderRadius: '50%',
                background: shades[idx], flexShrink: 0,
                boxShadow: `0 0 8px ${shades[idx]}`,
              }} />
              <div style={{
                fontFamily: FONTS.quran, fontSize: '1.1rem',
                color: shades[idx], direction: 'rtl', flexShrink: 0,
                filter: 'brightness(1.4)',
              }} dir="rtl" lang="ar">{n.nameAr}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: '0.85rem', color: COLORS.offWhite,
                  fontWeight: 600, fontFamily: FONTS.body,
                }}>{tr ? n.nameTr : n.nameEn}</div>
                {!isMobile && (
                  <div style={{
                    fontSize: '0.72rem', color: COLORS.silver, opacity: 0.78,
                    fontFamily: FONTS.body, marginTop: '2px',
                  }}>{tr ? n.meaningTr : n.meaningEn}</div>
                )}
              </div>
              <span style={{
                padding: '3px 8px', fontSize: '0.62rem', fontWeight: 700,
                background: `${shades[idx]}44`, color: '#fff',
                borderRadius: RADIUS.chip, letterSpacing: '0.12em',
                textTransform: 'uppercase', flexShrink: 0,
              }}>{idx + 1}</span>
            </div>
          );
        })}
      </div>

      <p style={{
        marginTop: '18px', textAlign: 'center', fontSize: '0.75rem',
        color: COLORS.silver, opacity: 0.78, fontStyle: 'italic',
        fontFamily: FONTS.body, maxWidth: '540px', marginLeft: 'auto', marginRight: 'auto',
      }}>
        {tr
          ? "Sıralamanın kesinliği tartışmalıdır — İbn Kesîr, Kurtubî ve İmam Malik farklı düzenler nakleder. 7 sayısı Kur'ânî, sıralama tefsîrî."
          : "The exactness of the order is disputed — Ibn Kathīr, Qurṭubī, and Imām Mālik report varying arrangements. The number 7 is Qur'anic; the sequence is exegetical."}
      </p>
    </div>
  );
}

// Rahman 31-Refrain Vertical Bar
function Rahman31Viz({ language, isMobile, rs }) {
  const tr = language === 'tr';
  // Verse numbers where "Fabi-ayyi ala'i rabbikuma tukazziban" appears
  const REFRAINS = [13, 16, 18, 21, 23, 25, 28, 30, 32, 34, 36, 38, 40, 42, 45, 47, 49, 51, 53, 55, 57, 59, 61, 63, 65, 67, 69, 71, 73, 75, 77];

  return (
    <div className="mq-box" style={{
      marginBottom: '28px',
      '--pt-d': "28px", '--pt-m': "20px", '--pr-d': "32px", '--pr-m': "16px", '--pb-d': "28px", '--pb-m': "20px", '--pl-d': "32px", '--pl-m': "16px",
      background: 'linear-gradient(180deg, rgba(212,165,116,0.08) 0%, rgba(255,255,255,0.02) 100%)',
      border: `1px solid ${GOLD}44`,
      borderRadius: RADIUS.lg,
    }}>
      <div style={{
        fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase',
        color: GOLD, opacity: 0.85, fontWeight: 700,
        marginBottom: '10px', fontFamily: FONTS.body, textAlign: 'center',
      }}>
        {tr ? "RAHMAN SÛRESİ · 31 NAKARAT" : "SŪRAT AL-RAḤMĀN · 31 REFRAINS"}
      </div>
      <p style={{
        color: COLORS.silver, fontSize: '0.85rem', lineHeight: 1.6,
        textAlign: 'center', maxWidth: '620px', margin: '0 auto 22px',
        fontFamily: FONTS.body,
      }}>
        {tr
          ? "Rahman 55'te 78 ayetin 31'i tek bir soru: 'Rabbinizin hangi nimetini yalanlayabilirsiniz?' Bar chart bu tekrarların ayet konumlarını gösterir — cennet ve cehennem tasvirleri arasındaki ritmik parantez."
          : "In Sūrat al-Raḥmān 55, 31 of the 78 verses are a single question: 'Which of your Lord's favors will you deny?' The bar chart shows the verse positions of these repetitions — the rhythmic bracket between descriptions of Paradise and Hell."}
      </p>

      {/* Bar chart — vertical bars for each verse */}
      <div style={{
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        gap: '2px', height: isMobile ? '80px' : '110px',
        padding: '0 4px', marginBottom: '18px',
        maxWidth: '820px', marginLeft: 'auto', marginRight: 'auto',
      }}>
        {Array.from({ length: 78 }, (_, i) => i + 1).map(v => {
          const isRefrain = REFRAINS.includes(v);
          return (
            <div key={v} title={`Verse ${v}${isRefrain ? ' — Refrain' : ''}`} style={{
              flex: 1,
              height: isRefrain ? '100%' : '30%',
              background: isRefrain
                ? `linear-gradient(180deg, ${GOLD} 0%, ${GOLD}88 100%)`
                : 'rgba(148,163,184,0.2)',
              borderRadius: '2px 2px 0 0',
              boxShadow: isRefrain ? `0 0 6px ${GOLD}88` : 'none',
              transition: 'all 0.2s',
            }} />
          );
        })}
      </div>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        fontSize: '0.65rem', color: COLORS.silver, opacity: 0.78,
        fontFamily: FONTS.body,
        maxWidth: '820px', marginLeft: 'auto', marginRight: 'auto',
      }}>
        <span>1</span>
        <span>{tr ? "Nakarat konumları" : "Refrain positions"}</span>
        <span>78</span>
      </div>

      {/* Stats row */}
      <div className="g-2-4" style={{
        display: 'grid',
        gap: '10px', marginTop: '22px', maxWidth: '820px', marginLeft: 'auto', marginRight: 'auto',
      }}>
        {[
          { n: '31', lTr: 'Nakarat', lEn: 'Refrains' },
          { n: '78', lTr: 'Toplam Ayet', lEn: 'Total Verses' },
          { n: '39.7%', lTr: 'Nakarat Oranı', lEn: 'Refrain Ratio' },
          { n: '~2.5', lTr: 'Nakarat Aralığı', lEn: 'Avg Gap' },
        ].map((s, i) => (
          <div key={i} style={{
            padding: '10px 12px', textAlign: 'center',
            background: 'rgba(255,255,255,0.03)',
            border: `1px solid ${GOLD}33`,
            borderRadius: RADIUS.md,
          }}>
            <div style={{
              fontFamily: FONTS.display, fontSize: '1.35rem',
              color: GOLD, fontWeight: 900, lineHeight: 1,
            }}>{s.n}</div>
            <div style={{
              fontSize: '0.68rem', color: COLORS.silver,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              marginTop: '4px', fontFamily: FONTS.body,
            }}>{tr ? s.lTr : s.lEn}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 5-Sense Cennet ↔ Cehennem Comparison Grid
function FiveSenseGrid({ language, isMobile }) {
  const tr = language === 'tr';
  const SENSES = [
    {
      id: 'sight', labelTr: 'GÖRME', labelEn: 'SIGHT',
      icon: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z',
      cennetTr: "Yeşillik, akan sular, mücevherlerle bezenmiş huriler (Bakara 2:25, Tûr 52:24).",
      cennetEn: "Verdure, flowing waters, pearl-adorned companions (al-Baqara 2:25, al-Ṭūr 52:24).",
      cehennemTr: "Karanlıklar, alevlerin görüntüsü, yüzlerin siyahlığı (Al-i İmrân 3:106).",
      cehennemEn: "Darkness, sight of flames, blackness of faces (Āl ʿImrān 3:106).",
    },
    {
      id: 'sound', labelTr: 'İŞİTME', labelEn: 'HEARING',
      icon: 'M18 8h1a4 4 0 0 1 0 8h-1M11 5v14l-5-4V9z',
      cennetTr: "Selâm (barış) selâmlaşması, boş söz yok (Vâkıa 56:25-26, Mü'min 40:8).",
      cennetEn: "Greeting of peace (salām), no idle talk (al-Wāqiʿa 56:25-26, Ghāfir 40:8).",
      cehennemTr: "Uğultu, ah-vah, kaynayan sesler, birbirini kınama (Furkân 25:12, Sâffât 37:27).",
      cehennemEn: "Roaring, wailing, boiling sounds, mutual reproach (al-Furqān 25:12, al-Ṣāffāt 37:27).",
    },
    {
      id: 'taste', labelTr: 'TATMA', labelEn: 'TASTE',
      icon: 'M12 2v4M4 12H0M18 4l-3 3M4 4l3 3M18 12h4M8 21l4-4 4 4',
      cennetTr: "Bal, süt, şarap, tesnîm — 'içenlere lezzet' (Muhammed 47:15, Mutaffifîn 83:27).",
      cennetEn: "Honey, milk, wine, tasnīm — 'delicious to those who drink' (Muḥammad 47:15, al-Muṭaffifīn 83:27).",
      cehennemTr: "Kaynar su (hamîm), zakkum ağacının meyvesi, çıra (Vâkıa 56:52-53, Kehf 18:29).",
      cehennemEn: "Scalding water (ḥamīm), fruit of the zaqqūm tree, molten metal (al-Wāqiʿa 56:52-53, al-Kahf 18:29).",
    },
    {
      id: 'smell', labelTr: 'KOKU', labelEn: 'SMELL',
      icon: 'M12 2a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2M12 19v3',
      cennetTr: "Misk ile mühürlü şarap, zencefil kokusu (Mutaffifîn 83:26, İnsan 76:17).",
      cennetEn: "Wine sealed with musk, scent of ginger (al-Muṭaffifīn 83:26, al-Insān 76:17).",
      cehennemTr: "Ateşin dumanı, zakkumun kokusu, yanık kokusu (Vâkıa 56:43, Sâffât 37:62-65).",
      cehennemEn: "Smoke of fire, scent of zaqqūm, burning odor (al-Wāqiʿa 56:43, al-Ṣāffāt 37:62-65).",
    },
    {
      id: 'touch', labelTr: 'DOKUNMA', labelEn: 'TOUCH',
      icon: 'M9 11.5A2.5 2.5 0 0 1 11.5 9M14.5 9A2.5 2.5 0 0 1 17 11.5M9 14.5A2.5 2.5 0 0 0 11.5 17M14.5 17a2.5 2.5 0 0 0 2.5-2.5',
      cennetTr: "Yumuşak yastıklar, ipek, hoş serinlik, sıkıntı yok (Kehf 18:31, Vâkıa 56:15-16).",
      cennetEn: "Soft cushions, silk, pleasant coolness, no fatigue (al-Kahf 18:31, al-Wāqiʿa 56:15-16).",
      cehennemTr: "Ateş dokunuşu, zincirler, halkalar, yorgunluk (Furkân 25:13, Ğâşiye 88:5).",
      cehennemEn: "Touch of fire, chains, shackles, exhaustion (al-Furqān 25:13, al-Ghāshiya 88:5).",
    },
  ];

  return (
    <div className="mq-box" style={{
      marginBottom: '28px',
      '--pt-d': "28px", '--pt-m': "20px", '--pr-d': "32px", '--pr-m': "16px", '--pb-d': "28px", '--pb-m': "20px", '--pl-d': "32px", '--pl-m': "16px",
      background: 'rgba(255,255,255,0.02)',
      border: `1px solid ${COLORS.glassBorderSoft}`,
      borderRadius: RADIUS.lg,
    }}>
      <div style={{
        fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase',
        color: GOLD, opacity: 0.85, fontWeight: 700,
        marginBottom: '10px', fontFamily: FONTS.body, textAlign: 'center',
      }}>
        {tr ? "5 DUYU KARŞITLIĞI · CENNET ↔ CEHENNEM" : "5 SENSES CONTRAST · PARADISE ↔ HELL"}
      </div>
      <p style={{
        color: COLORS.silver, fontSize: '0.85rem', lineHeight: 1.6,
        textAlign: 'center', maxWidth: '640px', margin: '0 auto 22px',
        fontFamily: FONTS.body,
      }}>
        {tr
          ? "Kur'ân cennet ve cehennemi felsefi kavramlarla değil — beş duyu üzerinden inşa eder. Her duyu ekseninde tam karşıtlık: misk ↔ zakkum, selâm ↔ uğultu, ipek ↔ zincir."
          : "The Qur'ān builds Paradise and Hell not through philosophical concepts — but through the five senses. Each sense presents a complete inversion: musk ↔ zaqqūm, salām ↔ roaring, silk ↔ chains."}
      </p>

      {/* Grid rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {SENSES.map(s => (
          <div key={s.id} className="cc-domain-grid" style={{
            display: 'grid',
            gap: '10px', alignItems: 'stretch',
          }}>
            {/* Sense label */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '12px 14px',
              background: 'rgba(255,255,255,0.04)',
              border: `1px solid ${COLORS.glassBorderSoft}`,
              borderRadius: RADIUS.md,
            }}>
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d={s.icon} />
              </svg>
              <span style={{
                fontSize: '0.72rem', letterSpacing: '0.14em', fontWeight: 700,
                color: GOLD, fontFamily: FONTS.body,
              }}>{tr ? s.labelTr : s.labelEn}</span>
            </div>

            {/* Cennet cell */}
            <div style={{
              padding: '12px 14px',
              background: `${CENNET.bg}`,
              border: `1px solid ${CENNET.border}`,
              borderLeft: `3px solid ${CENNET.accent}`,
              borderRadius: RADIUS.md,
            }}>
              <div style={{
                fontSize: '0.62rem', letterSpacing: '0.14em', textTransform: 'uppercase',
                color: CENNET.accent, fontWeight: 700, marginBottom: '4px',
                fontFamily: FONTS.body,
              }}>{tr ? "CENNET" : "PARADISE"}</div>
              <div style={{
                fontSize: '0.82rem', color: COLORS.offWhite,
                lineHeight: 1.55, fontFamily: FONTS.body,
              }}>{tr ? s.cennetTr : s.cennetEn}</div>
            </div>

            {/* Cehennem cell */}
            <div style={{
              padding: '12px 14px',
              background: `${CEHENNEM.bg}`,
              border: `1px solid ${CEHENNEM.border}`,
              borderLeft: `3px solid ${CEHENNEM.accent}`,
              borderRadius: RADIUS.md,
            }}>
              <div style={{
                fontSize: '0.62rem', letterSpacing: '0.14em', textTransform: 'uppercase',
                color: CEHENNEM.accent, fontWeight: 700, marginBottom: '4px',
                fontFamily: FONTS.body,
              }}>{tr ? "CEHENNEM" : "HELL"}</div>
              <div style={{
                fontSize: '0.82rem', color: COLORS.offWhite,
                lineHeight: 1.55, fontFamily: FONTS.body,
              }}>{tr ? s.cehennemTr : s.cehennemEn}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
