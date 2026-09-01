'use client';

import { motion } from 'framer-motion';
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

  // 2026-09-01 — `reduced` dallanması KALDIRILDI. Hareket tercihi artık
  // MotionPrefs'teki MotionConfig ile framer-motion'ın animasyon katmanında
  // ele alınıyor (tek nokta, bütün ağaç).
  //
  // Buradaki dallanma hidrasyon uyuşmazlığının kaynağıydı ve mekanizması
  // ince: `initial='hidden'` her zaman veriliyordu ama `variants` tercihe
  // dallanıyordu. Sunucuda useReducedMotion() false → variants var →
  // 'hidden' çözümlenip style="opacity:0.5" basılıyordu; istemcide tercih
  // açıkken variants undefined → 'hidden' çözümlenemiyor → style={} .
  // React farkı görüp "bu düzeltilmeyecek" diyordu (ölçüldü: anasayfada
  // reduce modunda 1 uyuşmazlık, normal modda 0).
  //
  // Üçü birden sabitlendi — yalnız `variants`i geri koymak yetmezdi, çünkü
  // whileInView de dallanıyordu ve tercih açıkken bölüm 'hidden'da (0.5)
  // KALIRDI. Şimdi opaklık her hâlükârda 1'e gidiyor; MotionConfig
  // vestibüler olan kısmı (stagger/kayma) zaten kapatıyor.

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
      variants={staggerContainer}
      initial={'hidden'}
      whileInView={'visible'}
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
