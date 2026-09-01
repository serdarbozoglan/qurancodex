'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';

// hidden opacity 0.5 DEĞİL 0 — savunma amaçlı (site denetimi, 16 Ağustos
// 2026: hızlı/programatik scroll'da whileInView geç tetiklenirse bile
// section tamamen boş görünmesin, bkz. aşağıdaki viewport margin notu).
const staggerContainer = {
  hidden: { opacity: 0.5 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

// ─── ATMOSFER: P6 (2026-07-21) — Motion polish ───
// Flat translate SaaS. Manuscript-tabanlı UI'de element "önce zeminde yatar,
// sonra kalkarken hafif genişler" — subtle 3D ipucu (kağıttan yükseliyormuş
// hissi). scale 0.985 → 1 = %1.5 micro-depth. useReducedMotion() reduce-motion
// modunda zaten kapanır (staggerContainer üzerinden), okunurluğu etkilemez.
const fadeUpItem = {
  hidden: { opacity: 0.5, y: 14, scale: 0.99 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export { fadeUpItem };

export default function SectionWrapper({
  id,
  children,
  className = '',
  dark = false,
  noPadding = false,
  // When true, adds extra top padding so the first content section
  // after Hero gets a breathing gap. Mobile gets a larger lift
  // (pt-14) while desktop keeps the default (md:pt-10).
  firstAfterHero = false,
  // Section seam filigree — minimal decorative divider at section top.
  // Default true (her section'ın başında subtle ✦ + line); homepage
  // breathing room iyileştirmesi (kullanıcı feedback).
  // İlk section (firstAfterHero) için kapalı — Hero ile çakışmasın.
  seam = true,
  // `overflow-hidden` (aşağıda) section içindeki dekoratif taşan öğeleri
  // kırpmak için var — ama CSS spesine göre `overflow` != visible olan
  // HERHANGİ bir ata, `position:sticky` çocukları için "containing block"
  // haline gelir ve onları kırar (site denetimi, 16 Ağustos 2026 —
  // HiddenArchitecture.jsx'teki prizma paneli hiç sticky olmuyordu).
  // Gerçek sticky davranışı gereken section'lar `clip={false}` geçmeli;
  // varsayılan `true` diğer ~53 section'ın mevcut kırpma davranışını korur.
  clip = true,
}) {
  // lang attribute ensures CSS text-transform: uppercase uses the correct
  // locale rules for ALL child elements. Without this, html[lang="tr"]
  // causes English "i" → "İ" (Turkish dotted I) instead of "I" when the
  // site is in Turkish mode but the user switches to English. Setting lang
  // on the section root fixes every uppercase usage inside it at once.
  const { language } = useLanguage();

  // Respect prefers-reduced-motion: skip stagger/fade-up, render at final state.
  // This disables reveal animations for ALL child motion elements that use
  // fadeUpItem or inherit from staggerContainer — single-point accessibility.
  const reduced = useReducedMotion();

  // Padding sistemi — user feedback: 'çok kalabalık, breathing room az'.
  // Eski: py-10 (40px top + 40px bottom). Yeni: py-16 md:py-24 (64-96px).
  // ~2x breathing room artışı. Section'lar arası tonlanmış nefes ritmi oluşur.
  const showSeam = seam && !firstAfterHero;

  return (
    <motion.section
      id={id}
      lang={language}
      className={`relative ${clip ? 'overflow-hidden' : ''} ${
        noPadding
          ? ''
          : `py-16 md:py-24 px-6 md:px-12 lg:px-16${firstAfterHero ? ' pt-14 md:pt-10' : ''}`
      } ${dark ? 'bg-deep-navy' : 'bg-cosmic-black'} ${className}`}
      variants={reduced ? undefined : staggerContainer}
      initial={'hidden'}
      whileInView={reduced ? undefined : 'visible'}
      // margin '-80px' idi (geç tetikleme — kullanıcı önce içine 80px girmeli).
      // Site denetimi (16 Ağustos 2026): hızlı/programatik scroll'da bu section
      // hiç görünmeden atlanabiliyor veya boş görünüyordu (bkz. /arac/retorik-sorular
      // içine gömülü rhetoric section'ı, /atlas/ahiret-yolculugu'ndaki aynı desen).
      // Pozitif margin = observer section GÖRÜNMEDEN ÖNCE (400px erken) tetiklenir,
      // animasyon kullanıcı oraya ulaşana kadar çoktan bitmiş olur.
      viewport={{ once: true, margin: '400px 0px' }}
    >
      {/* Section seam — subtle filigree divider at top.
          Visitor'a "yeni bir bölüme girdim" hissi verir; cinematic rhythm. */}
      {showSeam && !noPadding && (
        <div
          aria-hidden="true"
          className="relative z-10 flex items-center justify-center gap-3 mb-10 md:mb-14"
        >
          <span
            className="block"
            style={{
              width: 'clamp(80px, 16vw, 140px)',
              height: '1px',
              background: 'linear-gradient(to right, transparent, rgba(212,165,116,0.45), transparent)',
            }}
          />
          <span
            style={{
              color: 'rgba(212,165,116,0.55)',
              fontSize: '0.65rem',
              letterSpacing: '0.2em',
              lineHeight: 1,
            }}
          >
            ✦
          </span>
          <span
            className="block"
            style={{
              width: 'clamp(80px, 16vw, 140px)',
              height: '1px',
              background: 'linear-gradient(to right, transparent, rgba(212,165,116,0.45), transparent)',
            }}
          />
        </div>
      )}

      <div className="relative z-10 max-w-6xl mx-auto">
        {children}
      </div>
    </motion.section>
  );
}
