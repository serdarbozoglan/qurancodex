'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import SectionWrapper, { fadeUpItem } from '../components/SectionWrapper';
import QuranVerse from '../components/QuranVerse';
import HeroGeometricBackground from '../components/HeroGeometricBackground';
import { COLORS, FONTS, SEMANTIC } from '../tokens';

export default function Conclusion() {
  const { t, language } = useLanguage();

  // Keşif katmanına atlar — sayfanın en başına DEĞİL.
  // 2026-08-13: hedef `#path-cards` idi ama PathCards anasayfadan kaldırılalı
  // beri o id hiç yoktu; kod her seferinde fallback'e düşüp kullanıcıyı EN
  // BAŞA götürüyordu. Sessiz bir bozulma — buton çalışıyor görünüyordu.
  // Yeni hedef, PathCards'ın yerine geçen bölüm: SixGates (`#six-gates`).
  const handleScrollToPaths = () => {
    const el = document.getElementById('six-gates');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOpenReading = () => {
    window.dispatchEvent(new CustomEvent('openReadingMode'));
  };

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Auditor #2 (2026-07-21): Conclusion arkasına geometric atmosfer.
          SectionWrapper kendi bg-cosmic-black'ini uygular; wrapper div üzerinde
          pattern render eder, section transparan olamayacağı için opacity
          düşük tutulur ki section-bg üzerinden hissedilsin (screen blend). */}
      <HeroGeometricBackground patternOpacity={0.04} glowOpacity="0C" tileSize={88} />
    <SectionWrapper id="conclusion" dark={false}>
      {/* Section badge — Hero parity (0.75rem, tracking 0.3em, gold/60) */}
      <motion.div variants={fadeUpItem}>
        <span
          style={{
            color: COLORS.gold,
            opacity: 0.75,
            fontFamily: FONTS.body,
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
          }}
        >
          {t('conclusion.badge')}
        </span>
      </motion.div>

      {/* Title — Hero baseline H2 */}
      <motion.h2
        variants={fadeUpItem}
        className="mt-4 mb-12"
        style={{
          fontFamily: FONTS.display,
          fontSize: 'clamp(1.8rem, 4vw, 2.75rem)',
          fontWeight: 700,
          color: COLORS.offWhite,
          letterSpacing: '-0.01em',
          lineHeight: 1.15,
          maxWidth: '60ch',
        }}
      >
        {t('conclusion.title')}
      </motion.h2>

      {/* Summary — Hero baseline section intro (offWhite/78, 1.7 leading).
          Display italic feels heavy here against Hero parity; keep the
          contemplative italic but drop weight to fit the new tone. */}
      <motion.p
        variants={fadeUpItem}
        className="max-w-3xl mb-14"
        style={{
          color: COLORS.offWhiteAlpha78,
          fontFamily: FONTS.display,
          fontStyle: 'italic',
          fontSize: 'clamp(1.05rem, 1.8vw, 1.25rem)',
          lineHeight: 1.7,
          letterSpacing: '0.01em',
        }}
      >
        {t('conclusion.summary')}
      </motion.p>

      {/* Question — large, dramatic */}
      <motion.p
        variants={fadeUpItem}
        className="text-off-white text-3xl md:text-5xl font-display font-bold leading-tight mb-12 max-w-4xl"
      >
        {t('conclusion.question')}
      </motion.p>

      {/* Final Verse - Nisa 4:82 — the crown jewel */}
      <motion.div
        variants={fadeUpItem}
        style={{
          borderRadius: '16px',
          border: '2px solid rgba(212,165,116,0.3)',
          boxShadow: '0 0 40px rgba(212,165,116,0.12), 0 0 80px rgba(212,165,116,0.06)',
          overflow: 'hidden',
        }}
      >
        <QuranVerse
          arabic={t('conclusion.verse.arabic')}
          translation={t('conclusion.verse.translation')}
          reference={t('conclusion.verse.reference')}
          className="gold-glow"
          surah={4} ayah={82}
        />
      </motion.div>

      {/* Linguistic loop closure: Ikra (beginning) → Fattabi'ûhu (ending) */}
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center mt-14 mb-6 gap-5"
        style={{ position: 'relative' }}
      >
        {/* 2026-08-16 — tek katmanlı radial glow: sitenin genelinde kullanılan
            restrained pattern (bkz. SesMimarisi/KavimlerAtlasi textShadow'ları).
            2026-08-13'te kaldırılan ÇİFT katmanlı glow+particle'dan farklı —
            burada tek, sabit, düşük-opaklı bir zemin ışıması; efekt yığını değil. */}
        <div aria-hidden="true" style={{
          position: 'absolute', top: '50%', left: '50%',
          width: '520px', height: '360px',
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(ellipse at center, ${COLORS.gold}14 0%, transparent 70%)`,
          pointerEvents: 'none', zIndex: 0,
        }} />
        <div style={{
          width: '88px', height: '1px', position: 'relative', zIndex: 1,
          background: `linear-gradient(90deg, transparent 0%, ${COLORS.goldAlpha45} 50%, transparent 100%)`,
        }} />
        <p dir="rtl" lang="ar" style={{
          fontFamily: FONTS.quran,
          fontSize: 'clamp(2.4rem, 7vw, 3.1rem)', color: COLORS.gold,
          textShadow: `0 0 30px ${COLORS.gold}30`,
          lineHeight: 1.3, letterSpacing: '0.02em',
          margin: 0, position: 'relative', zIndex: 1,
        }}>
          فَاتَّبِعُوهُ
        </p>
        <p style={{
          color: SEMANTIC.textFaint, fontSize: '1.1rem',
          fontFamily: FONTS.body, fontStyle: 'italic',
          letterSpacing: '0.01em',
          margin: 0, textAlign: 'center', position: 'relative', zIndex: 1,
        }}>
          {language === 'tr' ? '"Artık ona uyun."' : '"So follow it."'}
        </p>
        <p style={{
          color: COLORS.gold, fontSize: '0.75rem',
          fontFamily: FONTS.body, fontWeight: 600,
          letterSpacing: '0.2em', textTransform: 'uppercase',
          opacity: 0.8,
          margin: 0, position: 'relative', zIndex: 1,
        }}>
          {language === 'tr' ? "En'âm 6:155" : "Al-An'am 6:155"}
        </p>
        <div style={{
          width: '88px', height: '1px', position: 'relative', zIndex: 1,
          background: `linear-gradient(90deg, transparent 0%, ${COLORS.goldAlpha45} 50%, transparent 100%)`,
        }} />
      </motion.div>

      {/* CTA Buttons — matching sizes, Navbar-style "Kur'an'ı Oku" */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4"
      >
        <motion.button
          onClick={handleScrollToPaths}
          style={{
            padding: '14px 36px',
            borderRadius: '999px', // v2.0 — pill (nav ile tutarlı)
            border: `1px solid ${COLORS.goldAlpha25}`,
            background: COLORS.goldAlpha15,
            color: COLORS.gold,
            fontFamily: FONTS.body,
            fontSize: '0.9rem', fontWeight: 600,
            letterSpacing: '0.08em',
            cursor: 'pointer',
          }}
          whileHover={{ scale: 1.04, borderColor: 'rgba(212,165,116,0.6)', background: 'rgba(212,165,116,0.06)' }}
          whileTap={{ scale: 0.97 }}
        >
          {t('conclusion.ctaExplore')}
        </motion.button>
        <motion.button
          onClick={handleOpenReading}
          className="flex items-center gap-3"
          style={{
            padding: '14px 36px',
            borderRadius: '999px', // v2.0 — pill (nav ile tutarlı)
            border: 'none',
            // v2.0 — açık antika altın (nav CTA ile aynı)
            background: `linear-gradient(135deg, ${COLORS.goldBright} 0%, ${COLORS.gold} 100%)`,
            color: COLORS.btnGoldText,
            fontFamily: FONTS.body,
            fontSize: '0.9rem', fontWeight: 700,
            letterSpacing: '0.08em',
            cursor: 'pointer',
            boxShadow: '0 0 20px 4px rgba(180,130,40,0.3)',
          }}
          whileHover={{ scale: 1.04, boxShadow: '0 0 32px 6px rgba(180,130,40,0.5)' }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <span dir="rtl" lang="ar" style={{ fontFamily: FONTS.quran, fontSize: '1.2rem', color: COLORS.btnGoldText, opacity: 1, lineHeight: 1 }}>اقرأ</span>
          {language === 'tr' ? "Kur'an'ı Oku" : 'Read Quran'}
        </motion.button>
      </motion.div>

      {/* ═══ CONCLUSION SUPPORT WHISPER CTA — GEÇİCİ KALDIRILDI 2026-07-12 ═══
          Kullanıcı isteği: destek CTA'larını sitede geçici olarak kaldır,
          kod comment out kalsın. Reactivate için: bu bloğu uncomment +
          Footer callout (id="support") + Navbar (❤ Destek button) aynı
          anda uncomment.

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 1, delay: 0.9 }}
        className="flex flex-col items-center mt-16 gap-3"
      >
        <p style={{
          color: SEMANTIC.textFaint,
          fontFamily: FONTS.display,
          fontStyle: 'italic',
          fontSize: '0.95rem',
          lineHeight: 1.6,
          textAlign: 'center',
          maxWidth: '520px',
          margin: 0,
        }}>
          {language === 'tr'
            ? 'Bu yolculuk bağımsız bir çalışmadır. Beğendiysen sürdürmemize destek olabilirsin.'
            : 'This journey is an independent effort. If you find it meaningful, you can help sustain it.'}
        </p>
        <button
          onClick={() => {
            document.getElementById('support')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '9px 20px',
            background: 'transparent',
            border: `1px solid ${COLORS.goldAlpha45}`,
            borderRadius: '999px',
            color: COLORS.gold,
            fontFamily: FONTS.body,
            fontSize: '0.8rem',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = COLORS.goldAlpha15; e.currentTarget.style.borderColor = COLORS.gold; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = COLORS.goldAlpha45; }}
        >
          <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.9 }}>
            <path d="M12 21s-7-4.5-9.5-9.5C.5 7.5 3 4 6.5 4c2 0 3.5 1 5.5 3 2-2 3.5-3 5.5-3 3.5 0 6 3.5 4 7.5C19 16.5 12 21 12 21z"/>
          </svg>
          {language === 'tr' ? 'Bu Çalışmayı Destekle' : 'Support this Work'}
          <span style={{ fontSize: '0.9rem', lineHeight: 1 }}>↓</span>
        </button>
      </motion.div>
      ═══ CONCLUSION SUPPORT WHISPER END ═══ */}
    </SectionWrapper>
    </div>
  );
}
