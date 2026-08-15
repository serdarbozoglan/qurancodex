'use client';

// ─── AhiretYolculugu.jsx — /atlas/ahiret-yolculugu ─────────────────────────
// Meta-timeline eskatolojik atlas hub — 11 aşama kronolojik akış:
//   Sekerât → Berzah → Sûr → Ba's → Mahşer → Amel Defteri → Mîzân →
//   Havz-Şefâat → Sırât → Cennet & Cehennem → Rü'yetullâh
//
// Yapı:
//   - Cinematic Hero (§13.18)
//   - Sticky index rail (desktop) — 11 aşamaya jump
//   - Dikey scroll-triggered timeline
//   - Expandable stage card: anchor verse + narration + additional refs +
//     classical tafsir + CriticalNote + visualMotif + crossLinks
//   - SourcesCitation footer
//
// Content: /public/ahiret-yolculugu.json (build script §13.15 normalized)
// ────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { COLORS, FONTS } from '../tokens';
import { surahName } from '../lib/surahNames';
import { useLanguage } from '../i18n/LanguageContext';
import ToolHeader from './ToolHeader';
import SourcesCitation from './SourcesCitation';
import CrossToolCTA from './CrossToolCTA';
import useNavbarOffset from './useNavbarOffset';
// SSR-safe: JSON'u module-level import et. Fetch pattern SSR'da null döndürüyordu
// → SourcesCitation + CTA'lar SEO HTML'de görünmüyordu (2026-07-15 audit bug).
// Bundle'a ~90KB static content ekler; ancak initial render tam olur.
import ahiretDataStatic from '../data/ahiret-yolculugu.json';

// ─── Stage icons — her aşama için custom minimal SVG ─────────────────────────
const StageIcons = {
  sekerat: ({ size = 20 }) => (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v8" />
      <path d="M8 7l4 4l4 -4" opacity="0.5" />
      <circle cx="12" cy="16" r="4" strokeDasharray="2 2" />
      <path d="M12 20v2" opacity="0.4" />
    </svg>
  ),
  berzah: ({ size = 20 }) => (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="16" rx="1" opacity="0.35" />
      <line x1="12" y1="4" x2="12" y2="20" strokeWidth="1.8" />
      <line x1="5" y1="8" x2="10" y2="8" opacity="0.5" />
      <line x1="5" y1="12" x2="10" y2="12" opacity="0.5" />
      <line x1="14" y1="12" x2="19" y2="12" opacity="0.5" />
      <line x1="14" y1="16" x2="19" y2="16" opacity="0.5" />
    </svg>
  ),
  sur: ({ size = 20 }) => (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10v4l9 -3v-2l-9 1z" />
      <path d="M12 11v2l4 -1v0l-4 -1z" opacity="0.7" />
      <path d="M18 7c1.5 1.5 1.5 8.5 0 10" opacity="0.4" />
      <path d="M20 4c3 3 3 13 0 16" opacity="0.2" />
    </svg>
  ),
  dirilis: ({ size = 20 }) => (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20h16" />
      <path d="M8 20v-5" />
      <path d="M12 20v-8" />
      <path d="M16 20v-5" />
      <path d="M6 12c2 -3 4 -3 6 -3s4 0 6 3" opacity="0.4" />
      <circle cx="12" cy="6" r="2" opacity="0.6" />
    </svg>
  ),
  mahser: ({ size = 20 }) => (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <line x1="2" y1="18" x2="22" y2="18" opacity="0.5" />
      <circle cx="6" cy="15" r="1" fill="currentColor" />
      <circle cx="10" cy="15" r="1" fill="currentColor" />
      <circle cx="14" cy="15" r="1" fill="currentColor" />
      <circle cx="18" cy="15" r="1" fill="currentColor" />
      <circle cx="8" cy="12" r="1" fill="currentColor" opacity="0.7" />
      <circle cx="12" cy="12" r="1" fill="currentColor" opacity="0.7" />
      <circle cx="16" cy="12" r="1" fill="currentColor" opacity="0.7" />
      <circle cx="10" cy="9" r="1" fill="currentColor" opacity="0.5" />
      <circle cx="14" cy="9" r="1" fill="currentColor" opacity="0.5" />
    </svg>
  ),
  kitap: ({ size = 20 }) => (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5a2 2 0 0 1 2 -2h11v16h-11a2 2 0 0 1 -2 -2v-12z" />
      <line x1="8" y1="7" x2="14" y2="7" opacity="0.5" />
      <line x1="8" y1="11" x2="14" y2="11" opacity="0.5" />
      <line x1="8" y1="15" x2="12" y2="15" opacity="0.5" />
      <path d="M17 3v16l3 -2v-14z" opacity="0.3" />
    </svg>
  ),
  mizan: ({ size = 20 }) => (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="3" x2="12" y2="20" />
      <line x1="4" y1="7" x2="20" y2="7" />
      <path d="M4 7l-2 5a3 3 0 0 0 4 0z" />
      <path d="M20 7l2 5a3 3 0 0 1 -4 0z" opacity="0.7" />
      <line x1="8" y1="20" x2="16" y2="20" />
    </svg>
  ),
  havz: ({ size = 20 }) => (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="15" rx="9" ry="3" />
      <path d="M3 15v3a9 3 0 0 0 18 0v-3" opacity="0.5" />
      <path d="M6 10l1 3" opacity="0.6" />
      <path d="M12 8l0 4" opacity="0.6" />
      <path d="M18 10l-1 3" opacity="0.6" />
    </svg>
  ),
  sirat: ({ size = 20 }) => (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8l18 0" strokeWidth="2" />
      <path d="M3 8v10" opacity="0.4" />
      <path d="M21 8v10" opacity="0.4" />
      <path d="M5 20l2 -3M9 20l2 -3M13 20l2 -3M17 20l2 -3" opacity="0.35" strokeDasharray="1 2" />
    </svg>
  ),
  'cennet-cehennem': ({ size = 20 }) => (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20v-12a2 2 0 0 1 2 -2h4v14" />
      <path d="M20 20v-12a2 2 0 0 0 -2 -2h-4v14" opacity="0.6" />
      <circle cx="7" cy="12" r="0.8" fill="currentColor" opacity="0.6" />
      <circle cx="17" cy="12" r="0.8" fill="currentColor" opacity="0.4" />
    </svg>
  ),
  ruyet: ({ size = 20 }) => (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <circle cx="12" cy="12" r="7" opacity="0.4" strokeDasharray="2 3" />
      <circle cx="12" cy="12" r="10" opacity="0.2" strokeDasharray="1 4" />
      <path d="M12 5v-2M12 21v-2M5 12h-2M21 12h-2" opacity="0.4" />
    </svg>
  ),
};

// ─── Tool header icon ────────────────────────────────────────────────────────
const AtlasIcon = ({ size = 18 }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="4" x2="12" y2="20" />
    <circle cx="12" cy="5" r="1.6" fill="currentColor" />
    <circle cx="12" cy="12" r="1.6" fill="currentColor" />
    <circle cx="12" cy="19" r="1.6" fill="currentColor" />
    <path d="M9 8l3 -3l3 3" opacity="0.5" />
    <path d="M9 16l3 3l3 -3" opacity="0.5" />
  </svg>
);

// ─── Main component ──────────────────────────────────────────────────────────
export default function AhiretYolculugu({ onClose }) {
  const { language } = useLanguage();
  const router = useRouter();
  const [data, setData] = useState(ahiretDataStatic);
  const [isMobile, setIsMobile] = useState(false);
  // 2026-08-14 (Z3d4) — navbar sabit 62 varsayımı "dördüncü kardeş" hatasıydı
  // (bkz. useNavbarOffset.js). toolheader (48) + hero comfort (70) sabit
  // kalıyor, yalnız navbar kısmı artık ölçülüyor.
  const navTop = useNavbarOffset(0, 62);
  const [openStage, setOpenStage] = useState(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const stageRefs = useRef({});
  const tr = language === 'tr';

  // Global scroll progress (top bar)
  const { scrollYProgress } = useScroll();
  const progressX = useSpring(scrollYProgress, { stiffness: 130, damping: 26, mass: 0.4 });

  useEffect(() => {
    // Fetch kaldırıldı — data module-level import ile SSR-safe (2026-07-15 fix).
    // Eğer public/ dosyası src/ ile drift ederse: rebuild script src/data/'ya kopyalar.
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    // Respect prefers-reduced-motion
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onMotion = (e) => setReducedMotion(e.matches);
    mq.addEventListener?.('change', onMotion);
    return () => {
      window.removeEventListener('resize', check);
      mq.removeEventListener?.('change', onMotion);
    };
  }, []);

  // Escape → close
  useEffect(() => {
    if (!onClose) return;
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  // Scroll spy for index rail (desktop) — "en yakın viewport üstü" mantığı.
  // Önceki IntersectionObserver -40%/-50% pencere ile aşamalar atlanıyor +
  // jumpTo sonrası yanlış idx set edilebiliyordu (2026-07-15 kullanıcı bug).
  // Yeni yaklaşım: scroll event + her aşamanın bounding rect top pozisyonu →
  // viewport threshold'una (140px navbar+header offset) en yakın stage aktif.
  // Programmatic scroll sırasında (jumpTo) 800ms lock ile observer override.
  const programmaticScrollLock = useRef(false);
  useEffect(() => {
    if (!data || isMobile) return;
    const HEADER_OFFSET = navTop + 48 + 70; // navbar (ölçülen) + toolheader 48 + hero comfort 70
    const compute = () => {
      if (programmaticScrollLock.current) return;
      let closestIdx = 0;
      let closestDelta = Infinity;
      data.stages.forEach((s, i) => {
        const el = stageRefs.current[s.id];
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const top = rect.top - HEADER_OFFSET;
        // Viewport'un üst 1/3'ünden geçenler öncelikli
        if (top <= 0 && Math.abs(top) < closestDelta) {
          closestDelta = Math.abs(top);
          closestIdx = i;
        } else if (top > 0 && closestDelta === Infinity) {
          // Hiçbir stage geçmediyse en üstteki
          closestIdx = 0;
        }
      });
      setActiveIdx(closestIdx);
    };
    let rafId = null;
    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => { compute(); rafId = null; });
    };
    compute();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [data, isMobile, navTop]);

  const jumpTo = (id) => {
    const el = stageRefs.current[id];
    if (!el) return;
    // Programmatic scroll: activeIdx manuel set + 800ms observer lock
    // (smooth scroll ~600-700ms sürer, observer overshoot etmesin)
    const idx = data.stages.findIndex(s => s.id === id);
    if (idx !== -1) setActiveIdx(idx);
    programmaticScrollLock.current = true;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => { programmaticScrollLock.current = false; }, 800);
  };

  if (!data) {
    return (
      <div style={{ minHeight: '100vh', background: COLORS.cosmicBlack, display: 'grid', placeItems: 'center', color: COLORS.silver }}>
        <div style={{ fontFamily: FONTS.body, fontSize: '0.9rem', opacity: 0.6 }}>{tr ? 'Yükleniyor…' : 'Loading…'}</div>
      </div>
    );
  }

  return (
    <div style={{
      background: COLORS.cosmicBlack,
      minHeight: '100vh',
      color: COLORS.offWhite,
      paddingTop: '62px',
      position: 'relative',
    }}>
      {/* Top scroll progress bar */}
      <motion.div
        style={{
          position: 'fixed',
          top: 62,
          left: 0,
          right: 0,
          height: 2,
          background: `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.gold}cc)`,
          transformOrigin: '0% 50%',
          scaleX: progressX,
          zIndex: 50,
          boxShadow: reducedMotion ? 'none' : `0 0 12px ${COLORS.gold}66`,
          pointerEvents: 'none',
        }}
      />

      <ToolHeader
        icon={<AtlasIcon />}
        titleTr={data.meta.titleTr}
        titleEn={data.meta.titleEn}
        subtitleTr={tr ? 'Eskatolojik akış hub\'ı' : undefined}
        subtitleEn={tr ? undefined : 'Eschatological flow hub'}
        language={language}
        chip={
          <span style={{
            padding: '3px 10px',
            borderRadius: 999,
            background: `${COLORS.gold}15`,
            color: COLORS.gold,
            fontSize: '0.66rem',
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
          }}>
            11 {tr ? 'aşama' : 'stages'}
          </span>
        }
      />

      {/* ── Cinematic Hero (§13.18) ─────────────────────────────────────── */}
      <Hero
        meta={data.meta}
        firstStage={data.stages[0]}
        isMobile={isMobile}
        tr={tr}
        reducedMotion={reducedMotion}
      />

      {/* ── Body: timeline + sticky index rail ──────────────────────────── */}
      <div className="mq-box" style={{
        display: 'flex',
        maxWidth: 1240,
        margin: '0 auto',
        '--pt-d': "56px", '--pt-m': "32px", '--pr-d': "32px", '--pr-m': "16px", '--pb-d': "100px", '--pb-m': "80px", '--pl-d': "32px", '--pl-m': "16px",
        gap: 48,
        alignItems: 'flex-start',
      }}>
        {/* Sticky index rail — desktop only */}
        {!isMobile && (
          <IndexRail
            stages={data.stages}
            activeIdx={activeIdx}
            onJump={jumpTo}
            tr={tr}
          />
        )}

        {/* Main timeline */}
        <div style={{ flex: 1, minWidth: 0, position: 'relative' }}>
          {/* Vertical accent line */}
          <div style={{
            position: 'absolute',
            left: isMobile ? 14 : 20,
            top: 20,
            bottom: 20,
            width: 1,
            background: `linear-gradient(180deg, transparent 0%, ${COLORS.gold}55 8%, ${COLORS.gold}22 50%, ${COLORS.gold}55 92%, transparent 100%)`,
          }} />

          {data.stages.map((stage, i) => (
            <div
              key={stage.id}
              ref={el => stageRefs.current[stage.id] = el}
              data-idx={i}
              style={{
                marginBottom: i === data.stages.length - 1 ? 0 : (isMobile ? 32 : 44),
                // Menüden atlayınca aşama sabit Navbar (62) + ToolHeader (48)
                // arkasına yapışmasın diye nefes payı (2026-07-23 kullanıcı bug).
                scrollMarginTop: isMobile ? '96px' : '130px',
              }}
            >
              <StageCard
                stage={stage}
                isOpen={openStage === stage.id}
                onToggle={() => setOpenStage(openStage === stage.id ? null : stage.id)}
                isActive={i === activeIdx}
                isMobile={isMobile}
                tr={tr}
                language={language}
                router={router}
                reducedMotion={reducedMotion}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Sources ─────────────────────────────────────────────────────── */}
      <div className="mq-box" style={{ maxWidth: 1080, margin: '0 auto', '--pt-d': "0", '--pt-m': "0", '--pr-d': "32px", '--pr-m': "16px", '--pb-d': "40px", '--pb-m': "40px", '--pl-d': "32px", '--pl-m': "16px" }}>
        <SourcesCitation
          language={language}
          isMobile={isMobile}
          labelTr="KLASİK ESKATOLOJI KAYNAKLARI"
          labelEn="CLASSICAL ESCHATOLOGY SOURCES"
          sources={data.sources.map(s => ({
            author: s.author,
            workTr: s.workTr,
            workEn: s.workEn,
            period: s.period,
            noteTr: s.noteTr,
            noteEn: s.noteEn,
          }))}
        />
      </div>

      {/* Cross-tool CTA — #202 (2026-07-16) */}
      <div className="mq-box" style={{ maxWidth: 1080, margin: '0 auto', '--pt-d': "0", '--pt-m': "0", '--pr-d': "32px", '--pr-m': "16px", '--pb-d': "100px", '--pb-m': "80px", '--pl-d': "32px", '--pl-m': "16px" }}>
        <CrossToolCTA
          language={language}
          isMobile={isMobile}
          links={[
            { href: `/${language}/arac/cennet-cehennem`, titleTr: 'Cennet & Cehennem', titleEn: 'Paradise & Hell', descTr: 'Yolculuğun iki nihai varış noktası — Kur\'an\'daki tasvirlerle.', descEn: 'The journey\'s two final destinations — with Quranic descriptions.' },
            { href: `/${language}/arac/kiyamet`, titleTr: 'Kıyâmet Sahneleri', titleEn: 'Doomsday Scenes', descTr: 'Yolculuğun başlangıcı — sûr\'un üflenişi ve kozmik son.', descEn: 'The journey\'s beginning — the trumpet blast and cosmic end.' },
            { href: `/${language}/arac/melekler`, titleTr: 'Melekler Atlası', titleEn: 'Angels Atlas', descTr: 'Ölüm meleği, sûr meleği, sırât meleği — yolculuğun rehberleri.', descEn: 'Angel of death, trumpet angel, ṣirāṭ angel — guides of the journey.' },
          ]}
        />
      </div>
    </div>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────────────
// Deterministic particle positions (avoids SSR/CSR hydration mismatch)
const PARTICLES = Array.from({ length: 22 }, (_, i) => {
  const seed = (i * 9301 + 49297) % 233280;
  const rand = seed / 233280;
  const rand2 = ((i * 37 + 11) * 9301 + 49297) % 233280 / 233280;
  const rand3 = ((i * 71 + 23) * 9301 + 49297) % 233280 / 233280;
  return {
    x: Math.round(rand * 100),          // %
    y: Math.round(rand2 * 100),         // %
    size: 1.5 + rand3 * 2.5,             // px
    delay: rand * 6,                     // s
    duration: 4 + rand2 * 5,             // s
    opacity: 0.15 + rand3 * 0.35,        // final opacity
  };
});

function Hero({ meta, firstStage, isMobile, tr, reducedMotion }) {
  const stagger = reducedMotion ? 0 : 0.12;
  // Hero anchor: firstStage'in anchor verse'i (Kâf 50:19) — JSON'dan çekilir
  // (build script §13.15 normalized). Hardcoded string YASAK (§13.15 + audit).
  const anchor = firstStage?.anchorVerseRef || {};
  const anchorArabic = anchor.arabic || '';
  const anchorTr = firstStage?.anchorVerseTr || '';
  const anchorEn = firstStage?.anchorVerseEn || '';
  // Sûre adı her zaman numaranın önünde — bkz. MiniRef notu.
  const anchorRef = anchor.surah && anchor.ayah
    ? `${surahName(anchor.surah, tr ? 'tr' : 'en')} ${anchor.surah}:${anchor.ayah}`
    : '';

  const revealVariants = {
    hidden: { opacity: 0, y: reducedMotion ? 0 : 24, filter: reducedMotion ? 'none' : 'blur(6px)' },
    show:   { opacity: 1, y: 0, filter: 'blur(0px)' },
  };

  return (
    <section className="mq-box" style={{
      '--pt-d': "86px", '--pt-m': "56px", '--pr-d': "40px", '--pr-m': "20px", '--pb-d': "62px", '--pb-m': "44px", '--pl-d': "40px", '--pl-m': "20px",
      background: `linear-gradient(180deg, ${COLORS.gold}0f 0%, transparent 65%)`,
      borderBottom: `1px solid ${COLORS.gold}18`,
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ambient starfield */}
      {!reducedMotion && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.85 }}>
          {PARTICLES.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: [0, p.opacity, 0], scale: [0.6, 1, 0.6] }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                delay: p.delay,
                ease: 'easeInOut',
              }}
              style={{
                position: 'absolute',
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.size,
                height: p.size,
                borderRadius: '50%',
                background: COLORS.gold,
                boxShadow: `0 0 ${p.size * 4}px ${COLORS.gold}66`,
              }}
            />
          ))}
        </div>
      )}

      {/* Layered radial glows */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 760,
        height: 380,
        background: `radial-gradient(ellipse at center, ${COLORS.gold}18 0%, ${COLORS.gold}00 70%)`,
        pointerEvents: 'none',
        filter: 'blur(4px)',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-140px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 900,
        height: 240,
        background: `radial-gradient(ellipse at center, ${COLORS.gold}0e 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      <motion.div
        style={{ position: 'relative', maxWidth: 780, margin: '0 auto' }}
        initial="hidden"
        animate="show"
        transition={{ staggerChildren: stagger, delayChildren: 0.05 }}
      >
        {/* Bismillah ornament */}
        <motion.div
          variants={revealVariants}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: FONTS.bismillah,
            fontSize: isMobile ? '1.5rem' : '1.8rem',
            color: COLORS.gold,
            opacity: 0.85,
            marginBottom: 28,
            direction: 'rtl',
            textShadow: `0 0 24px ${COLORS.gold}44`,
          }}>﷽</motion.div>

        {/* Anchor verse — Kâf 50:19 (JSON'dan çekilir, §13.15 normalized) */}
        {anchorArabic && (
          <motion.p
            variants={revealVariants}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            dir="rtl" lang="ar"
            style={{
              fontFamily: FONTS.quran,
              fontSize: isMobile ? '1.35rem' : '1.75rem',
              color: COLORS.gold,
              lineHeight: 2.15,
              margin: '0 0 20px',
              textShadow: `0 0 32px ${COLORS.gold}22`,
            }}>{anchorArabic}</motion.p>
        )}

        <motion.p
          variants={revealVariants}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: FONTS.display,
            fontStyle: 'italic',
            fontSize: isMobile ? '0.98rem' : '1.08rem',
            color: COLORS.offWhite,
            maxWidth: 660,
            margin: '0 auto 12px',
            lineHeight: 1.7,
            opacity: 0.92,
          }}>
          {tr ? `“${anchorTr}”` : `“${anchorEn}”`}
        </motion.p>

        <motion.p
          variants={revealVariants}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: FONTS.body,
            fontSize: isMobile ? '0.7rem' : '0.75rem',
            color: COLORS.silver,
            opacity: 0.78,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            margin: '0 0 40px',
          }}>— {anchorRef}</motion.p>

        {/* Framing whisper */}
        <motion.p
          variants={revealVariants}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: FONTS.display,
            fontStyle: 'italic',
            fontSize: isMobile ? '1rem' : '1.12rem',
            color: COLORS.silver,
            maxWidth: 700,
            margin: '0 auto 34px',
            lineHeight: 1.8,
            opacity: 0.9,
          }}>{tr ? meta.framingTr : meta.framingEn}</motion.p>

        {/* Filigree divider — grow-in */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1, delay: reducedMotion ? 0 : 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            width: 120,
            height: 1,
            margin: '0 auto 32px',
            background: `linear-gradient(90deg, transparent, ${COLORS.gold}aa, transparent)`,
            transformOrigin: 'center',
            boxShadow: `0 0 12px ${COLORS.gold}44`,
          }}
        />

        {/* Eyebrow */}
        <motion.p
          variants={revealVariants}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: FONTS.body,
            fontSize: isMobile ? '0.65rem' : '0.72rem',
            color: COLORS.gold,
            opacity: 0.78,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            fontWeight: 700,
            margin: '0 0 18px',
          }}>{tr ? meta.eyebrowTr : meta.eyebrowEn}</motion.p>

        {/* H1 */}
        <motion.h1
          variants={revealVariants}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: FONTS.display,
            color: COLORS.offWhite,
            fontSize: isMobile ? 'clamp(1.7rem, 7.5vw, 2.1rem)' : 'clamp(2.1rem, 3.8vw, 2.85rem)',
            fontWeight: 700,
            margin: '0 0 16px',
            lineHeight: 1.12,
            letterSpacing: '-0.01em',
          }}>{tr ? meta.titleTr : meta.titleEn}</motion.h1>

        {/* Dramatic subtitle */}
        <motion.p
          variants={revealVariants}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: FONTS.display,
            fontStyle: 'italic',
            color: COLORS.gold,
            fontSize: isMobile ? 'clamp(0.95rem, 3.2vw, 1.08rem)' : 'clamp(1.08rem, 1.85vw, 1.22rem)',
            opacity: 0.95,
            margin: 0,
            lineHeight: 1.55,
            letterSpacing: '0.005em',
          }}>{tr ? meta.subtitleTr : meta.subtitleEn}</motion.p>
      </motion.div>
    </section>
  );
}

// ─── Sticky Index Rail (desktop) ─────────────────────────────────────────────
function IndexRail({ stages, activeIdx, onJump, tr }) {
  const itemH = 34; // approx button height
  return (
    <nav style={{
      width: 240,
      flexShrink: 0,
      position: 'sticky',
      top: 130,
      alignSelf: 'flex-start',
      paddingRight: 8,
    }}>
      <div style={{
        fontFamily: FONTS.body,
        fontSize: '0.62rem',
        letterSpacing: '0.28em',
        textTransform: 'uppercase',
        color: COLORS.gold,
        opacity: 0.75,
        marginBottom: 18,
        fontWeight: 700,
      }}>{tr ? 'YOLCULUK' : 'THE JOURNEY'}</div>

      <div style={{ position: 'relative' }}>
        {/* Vertical rail line */}
        <div style={{
          position: 'absolute',
          left: 0,
          top: 6,
          bottom: 6,
          width: 1,
          background: COLORS.goldAlpha15,
        }} />
        {/* Smooth active indicator */}
        <motion.div
          animate={{ top: 6 + activeIdx * itemH }}
          transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          style={{
            position: 'absolute',
            left: -1,
            width: 3,
            height: itemH - 6,
            background: `linear-gradient(180deg, ${COLORS.gold}, ${COLORS.gold}bb)`,
            borderRadius: 2,
            boxShadow: `0 0 12px ${COLORS.gold}88`,
          }}
        />

        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column' }}>
          {stages.map((s, i) => {
            const active = i === activeIdx;
            return (
              <li key={s.id} style={{ height: itemH }}>
                <button
                  onClick={() => onJump(s.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    width: '100%',
                    height: '100%',
                    padding: '0 8px 0 14px',
                    background: 'transparent',
                    border: 'none',
                    color: active ? COLORS.gold : COLORS.silver,
                    fontFamily: FONTS.body,
                    fontSize: '0.78rem',
                    fontWeight: active ? 600 : 400,
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'color 0.2s ease, opacity 0.2s ease',
                    opacity: active ? 1 : 0.85,
                  }}
                  onMouseEnter={(e) => { if (!active) { e.currentTarget.style.opacity = '1'; e.currentTarget.style.color = COLORS.offWhite; } }}
                  onMouseLeave={(e) => { if (!active) { e.currentTarget.style.opacity = '0.85'; e.currentTarget.style.color = COLORS.silver; } }}
                >
                  <span style={{
                    fontFamily: FONTS.body,
                    fontSize: '0.6rem',
                    fontWeight: 700,
                    color: active ? COLORS.gold : COLORS.silver,
                    minWidth: 18,
                    letterSpacing: '0.06em',
                  }}>{String(i + 1).padStart(2, '0')}</span>
                  <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {tr ? s.titleTr.split(' — ')[0] : s.titleEn.split(' — ')[0]}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

// ─── StageCard ───────────────────────────────────────────────────────────────
function StageCard({ stage, isOpen, onToggle, isActive, isMobile, tr, language, router, reducedMotion }) {
  const Icon = StageIcons[stage.iconKey] || StageIcons.sekerat;
  const [hover, setHover] = useState(false);

  return (
    <motion.article className="mq-box"
      initial={reducedMotion ? {} : { opacity: 0, y: 32, filter: 'blur(6px)' }}
      whileInView={reducedMotion ? {} : { opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'relative',
        '--pl-d': 66, '--pl-m': 46,
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Timeline node marker + pulse glow */}
      <div style={{
        position: 'absolute',
        left: isMobile ? 4 : 10,
        top: 8,
        width: isMobile ? 24 : 26,
        height: isMobile ? 24 : 26,
        zIndex: 2,
      }}>
        {/* Pulse ring — active state only */}
        {isActive && !reducedMotion && (
          <motion.div
            initial={{ scale: 1, opacity: 0.55 }}
            animate={{ scale: [1, 2.2, 1], opacity: [0.55, 0, 0.55] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${COLORS.gold}55 0%, transparent 70%)`,
              pointerEvents: 'none',
            }}
          />
        )}
        <div style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          background: isActive ? COLORS.gold : COLORS.cosmicBlack,
          border: `1.5px solid ${COLORS.gold}`,
          display: 'grid',
          placeItems: 'center',
          color: isActive ? COLORS.cosmicBlack : COLORS.gold,
          boxShadow: isActive
            ? `0 0 0 4px ${COLORS.cosmicBlack}, 0 0 28px ${COLORS.gold}99, 0 0 60px ${COLORS.gold}44`
            : `0 0 0 4px ${COLORS.cosmicBlack}, 0 0 16px ${COLORS.gold}33`,
          transition: 'all 0.35s ease',
          position: 'relative',
          zIndex: 1,
        }}>
          <span style={{ fontFamily: FONTS.body, fontSize: '0.62rem', fontWeight: 700 }}>{stage.index}</span>
        </div>
      </div>

      {/* Large decorative chapter number (background) — desktop only */}
      {!isMobile && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            right: 20,
            top: 4,
            fontFamily: FONTS.display,
            fontSize: '4.2rem',
            fontWeight: 900,
            color: COLORS.gold,
            opacity: hover || isOpen ? 0.09 : 0.045,
            lineHeight: 1,
            pointerEvents: 'none',
            transition: 'opacity 0.35s ease',
            letterSpacing: '-0.02em',
            userSelect: 'none',
          }}
        >
          {String(stage.index).padStart(2, '0')}
        </div>
      )}

      {/* Card */}
      <div className="mq-box" style={{
        background: isOpen
          ? `linear-gradient(135deg, ${COLORS.glassBg}, ${COLORS.goldAlpha04})`
          : (hover ? COLORS.glassBg : COLORS.glassBgFaint),
        backdropFilter: 'blur(14px)',
        border: `1px solid ${isOpen ? `${COLORS.gold}55` : (hover ? `${COLORS.gold}30` : COLORS.glassBorderSoft)}`,
        borderRadius: 14,
        '--pt-d': "24px", '--pt-m': "18px", '--pr-d': "28px", '--pr-m': "18px", '--pb-d': "24px", '--pb-m': "18px", '--pl-d': "28px", '--pl-m': "18px",
        transition: 'border-color 0.25s ease, background 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease',
        transform: hover && !isOpen ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: isOpen
          ? `0 8px 40px -12px ${COLORS.gold}33`
          : (hover ? `0 6px 22px -10px ${COLORS.gold}22` : 'none'),
        position: 'relative',
      }}>
        {/* Header */}
        <button
          onClick={onToggle}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 14,
            width: '100%',
            background: 'transparent',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            textAlign: 'left',
            color: 'inherit',
          }}
        >
          <div style={{
            flexShrink: 0,
            width: isMobile ? 32 : 36,
            height: isMobile ? 32 : 36,
            borderRadius: 8,
            background: `${COLORS.gold}12`,
            border: `1px solid ${COLORS.gold}22`,
            display: 'grid',
            placeItems: 'center',
            color: COLORS.gold,
            marginTop: 2,
          }}>
            <Icon size={isMobile ? 18 : 20} />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
              <span dir="rtl" lang="ar" style={{
                fontFamily: FONTS.quran,
                color: COLORS.gold,
                fontSize: isMobile ? '1.15rem' : '1.3rem',
                lineHeight: 1.6,
                opacity: 0.9,
              }}>{stage.arabicTerm}</span>
            </div>
            <h2 style={{
              fontFamily: FONTS.display,
              fontSize: isMobile ? '1.15rem' : '1.32rem',
              fontWeight: 700,
              color: COLORS.offWhite,
              margin: '0 0 6px',
              lineHeight: 1.25,
            }}>{tr ? stage.titleTr : stage.titleEn}</h2>
            <p style={{
              fontFamily: FONTS.body,
              fontSize: isMobile ? '0.88rem' : '0.94rem',
              color: COLORS.silver,
              margin: 0,
              lineHeight: 1.55,
            }}>{tr ? stage.descTr : stage.descEn}</p>
          </div>

          <div style={{
            flexShrink: 0,
            color: COLORS.silver,
            transition: 'transform 0.25s ease, color 0.25s ease',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
            marginTop: 4,
          }}>
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </button>

        {/* Expanded content */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              style={{ overflow: 'hidden' }}
            >
              <StageBody stage={stage} isMobile={isMobile} tr={tr} language={language} router={router} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  );
}

// ─── StageBody — expanded detail ─────────────────────────────────────────────
function StageBody({ stage, isMobile, tr, language, router }) {
  const anchor = stage.anchorVerseRef;
  const anchorText = tr ? stage.anchorVerseTr : stage.anchorVerseEn;
  const narration = tr ? stage.narrationTr : stage.narrationEn;

  return (
    <div style={{ paddingTop: 20, borderTop: `1px solid ${COLORS.gold}18`, marginTop: 18 }}>
      {/* Anchor verse — sûre adı locale'e göre (data'daki surahName Arapça
          tutuyordu, TR/EN görünmüyordu). surahName helper ile 2026-07-23. */}
      {anchor && (
        <VerseBlock
          arabic={anchor.arabic}
          translation={anchorText}
          reference={`${surahName(anchor.surah, tr ? 'tr' : 'en')} ${anchor.surah}:${anchor.ayah}`}
          isMobile={isMobile}
          isAnchor
        />
      )}

      {/* Narration */}
      {narration && (
        <div style={{ marginTop: 24, marginBottom: 24 }}>
          {narration.split('\n\n').map((para, i) => (
            <p key={i} style={{
              fontFamily: FONTS.body,
              fontSize: isMobile ? '0.92rem' : '0.98rem',
              color: COLORS.offWhite,
              lineHeight: 1.75,
              margin: i === 0 ? '0 0 14px' : '0 0 14px',
              opacity: 0.94,
            }}>{formatItalic(para)}</p>
          ))}
        </div>
      )}

      {/* Additional refs */}
      {stage.additionalRefs && stage.additionalRefs.length > 0 && (
        <details style={{ marginBottom: 22 }}>
          <summary style={{
            cursor: 'pointer',
            fontFamily: FONTS.body,
            fontSize: '0.72rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: COLORS.gold,
            fontWeight: 700,
            opacity: 0.8,
            marginBottom: 12,
            padding: '6px 0',
            userSelect: 'none',
          }}>{tr ? `İlave Kur'ânî referanslar (${stage.additionalRefs.length})` : `Additional Qur'anic references (${stage.additionalRefs.length})`}</summary>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
            {stage.additionalRefs.map((r, i) => (
              <MiniRef key={i} ref_={r} isMobile={isMobile} tr={tr} />
            ))}
          </div>
        </details>
      )}

      {/* Classical tafsir */}
      {stage.classicalTafsir && stage.classicalTafsir.length > 0 && (
        <div style={{ marginBottom: 22 }}>
          <div style={{
            fontFamily: FONTS.body,
            fontSize: '0.72rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: COLORS.gold,
            fontWeight: 700,
            opacity: 0.8,
            marginBottom: 12,
          }}>{tr ? 'Klasik Tefsir Çeşitliliği' : 'Classical Tafsir Plurality'}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {stage.classicalTafsir.map((t, i) => (
              <div key={i} style={{
                padding: '12px 14px',
                background: COLORS.glassBgFaint,
                borderLeft: `2px solid ${COLORS.gold}55`,
                borderRadius: '0 6px 6px 0',
              }}>
                <div style={{ marginBottom: 4 }}>
                  <span style={{ fontFamily: FONTS.body, fontSize: '0.82rem', color: COLORS.gold, fontWeight: 600 }}>{t.source}</span>
                  <span style={{ fontFamily: FONTS.body, fontSize: '0.72rem', color: COLORS.silver, opacity: 0.78, marginLeft: 8, fontStyle: 'italic' }}>{t.workRef}</span>
                </div>
                <p style={{
                  fontFamily: FONTS.body,
                  fontSize: isMobile ? '0.86rem' : '0.9rem',
                  color: COLORS.offWhite,
                  margin: 0,
                  lineHeight: 1.65,
                  opacity: 0.9,
                }}>{formatItalic(tr ? t.noteTr : t.noteEn)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CriticalNote */}
      {stage.criticalNote && (
        <CriticalNoteBlock note={stage.criticalNote} isMobile={isMobile} tr={tr} />
      )}

      {/* NOT: visualMotif alanı prompt/agent seviyesinde art direction ipucudur —
          kullanıcıya render EDİLMEZ (2026-07-15 kullanıcı feedback). JSON'da
          documentation olarak kalır, gelecek SVG illüstrasyon üretimi için. */}

      {/* Cross-links */}
      {stage.crossLinks && stage.crossLinks.length > 0 && (
        <div style={{ marginTop: 4 }}>
          <div style={{
            fontFamily: FONTS.body,
            fontSize: '0.72rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: COLORS.gold,
            fontWeight: 700,
            opacity: 0.8,
            marginBottom: 12,
          }}>{tr ? 'Devamı için' : 'Continue with'}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {stage.crossLinks.map((cl, i) => (
              <button
                key={i}
                onClick={() => router.push(`/${language}${cl.href}`)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 10,
                  padding: '11px 14px',
                  background: cl.primary ? `${COLORS.gold}1f` : COLORS.glassBgFaint,
                  border: cl.primary ? `1px solid ${COLORS.gold}55` : `1px solid ${COLORS.glassBorderSoft}`,
                  borderRadius: 8,
                  color: cl.primary ? COLORS.gold : COLORS.offWhite,
                  fontFamily: FONTS.body,
                  fontSize: isMobile ? '0.84rem' : '0.88rem',
                  fontWeight: cl.primary ? 600 : 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.18s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = cl.primary ? `${COLORS.gold}33` : COLORS.glassBg;
                  e.currentTarget.style.transform = 'translateX(2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = cl.primary ? `${COLORS.gold}1f` : COLORS.glassBgFaint;
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <span>{tr ? cl.labelTr : cl.labelEn}</span>
                <span style={{ opacity: 0.7, fontSize: '1rem' }}>→</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── VerseBlock ──────────────────────────────────────────────────────────────
function VerseBlock({ arabic, translation, reference, isMobile, isAnchor }) {
  return (
    <div className="mq-box" style={{
      '--pt-d': "22px", '--pt-m': "18px", '--pr-d': "24px", '--pr-m': "16px", '--pb-d': "22px", '--pb-m': "18px", '--pl-d': "24px", '--pl-m': "16px",
      background: isAnchor ? `linear-gradient(135deg, ${COLORS.gold}10, ${COLORS.gold}04)` : COLORS.glassBgFaint,
      border: `1px solid ${isAnchor ? COLORS.gold + '44' : COLORS.glassBorderSoft}`,
      borderRadius: 10,
      textAlign: 'center',
    }}>
      {arabic && (
        <p dir="rtl" lang="ar" style={{
          fontFamily: FONTS.quran,
          fontSize: isMobile ? '1.2rem' : '1.45rem',
          color: COLORS.gold,
          lineHeight: 2.1,
          margin: '0 0 14px',
        }}>{arabic}</p>
      )}
      {translation && (
        <p style={{
          fontFamily: FONTS.display,
          fontStyle: 'italic',
          fontSize: isMobile ? '0.92rem' : '0.98rem',
          color: COLORS.offWhite,
          margin: '0 0 10px',
          lineHeight: 1.6,
          opacity: 0.92,
        }}>{translation}</p>
      )}
      {reference && (
        <p style={{
          fontFamily: FONTS.body,
          fontSize: '0.68rem',
          color: COLORS.silver,
          opacity: 0.78,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          margin: 0,
          fontWeight: 600,
        }}>— {reference}</p>
      )}
    </div>
  );
}

// ─── MiniRef ─────────────────────────────────────────────────────────────────
function MiniRef({ ref_, isMobile, tr }) {
  // Referans yalnızca sûre NUMARASI ile gösterilmez — okuyucu "56:83" ifadesinden
  // hangi sûre olduğunu çıkaramıyor. Sûre adı her zaman önde (2026-07-23).
  const ayahPart = ref_.range ? ref_.range : ref_.ayah;
  const refLabel = `${surahName(ref_.surah, tr ? 'tr' : 'en')} ${ref_.surah}:${ayahPart}`;
  return (
    <div className="mq-box" style={{
      '--pt-d': "14px", '--pt-m': "12px", '--pr-d': "16px", '--pr-m': "14px", '--pb-d': "14px", '--pb-m': "12px", '--pl-d': "16px", '--pl-m': "14px",
      background: COLORS.glassBgFaint,
      border: `1px solid ${COLORS.glassBorderSoft}`,
      borderRadius: 8,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
        <span style={{
          padding: '2px 8px',
          borderRadius: 4,
          background: `${COLORS.gold}15`,
          color: COLORS.gold,
          fontFamily: FONTS.body,
          fontSize: '0.7rem',
          fontWeight: 700,
          letterSpacing: '0.06em',
        }}>{refLabel}</span>
        {ref_.surahName && (
          <span dir="rtl" lang="ar" style={{
            fontFamily: FONTS.quran,
            fontSize: '1rem',
            color: COLORS.silver,
            opacity: 0.78,
          }}>{ref_.surahName}</span>
        )}
      </div>
      {ref_.arabic && (
        <p dir="rtl" lang="ar" style={{
          fontFamily: FONTS.quran,
          fontSize: isMobile ? '1.15rem' : '1.3rem',
          color: COLORS.gold,
          opacity: 0.9,
          lineHeight: 2.05,
          margin: '0 0 10px',
        }}>{ref_.arabic}</p>
      )}
      <p style={{
        fontFamily: FONTS.body,
        fontSize: isMobile ? '0.85rem' : '0.88rem',
        color: COLORS.offWhite,
        margin: 0,
        lineHeight: 1.6,
        opacity: 0.88,
      }}>{formatItalic(tr ? ref_.noteTr : ref_.noteEn)}</p>
    </div>
  );
}

// ─── CriticalNoteBlock ───────────────────────────────────────────────────────
function CriticalNoteBlock({ note, isMobile, tr }) {
  return (
    <div className="mq-box" style={{
      marginBottom: 22,
      '--pt-d': "20px", '--pt-m': "16px", '--pr-d': "22px", '--pr-m': "18px", '--pb-d': "20px", '--pb-m': "16px", '--pl-d': "22px", '--pl-m': "18px",
      background: COLORS.skyBlueAlpha06,
      border: `1px solid ${COLORS.skyBlueAlpha30}`,
      borderLeft: `3px solid ${COLORS.skyBlue}`,
      borderRadius: 8,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 10,
      }}>
        <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={COLORS.skyBlue} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <span style={{
          fontFamily: FONTS.body,
          fontSize: '0.72rem',
          fontWeight: 700,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: COLORS.skyBlue,
        }}>{tr ? note.titleTr : note.titleEn}</span>
      </div>
      <div style={{
        fontFamily: FONTS.body,
        fontSize: isMobile ? '0.88rem' : '0.92rem',
        color: COLORS.offWhite,
        lineHeight: 1.7,
        opacity: 0.92,
      }}>
        {(tr ? note.bodyTr : note.bodyEn).split('\n\n').map((p, i) => (
          <p key={i} style={{ margin: i === 0 ? '0 0 10px' : '0 0 10px' }}>{formatItalic(p)}</p>
        ))}
      </div>
    </div>
  );
}

// ─── Utility: *italic* → <em> ────────────────────────────────────────────────
function formatItalic(text) {
  if (!text || !text.includes('*')) return text;
  const parts = text.split(/(\*[^*]+\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith('*') && p.endsWith('*') && p.length > 2) {
      return <em key={i} style={{ color: COLORS.gold, fontStyle: 'italic', opacity: 0.95 }}>{p.slice(1, -1)}</em>;
    }
    return p;
  });
}
