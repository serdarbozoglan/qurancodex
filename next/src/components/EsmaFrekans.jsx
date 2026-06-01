'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS, GLASS_CARD, TEXT, TRANSITION } from '../tokens';

// ── Sabit veriler ────────────────────────────────────────────────────────────

// Şûrâ 42:11 — hero anchor ayeti (sabit, JSON'da gereksiz)
const HERO_VERSE = {
  arabic: 'لَيْسَ كَمِثْلِهِۦ شَىْءٌ ۖ وَهُوَ ٱلسَّمِيعُ ٱلْبَصِيرُ',
  tr: "O'nun benzeri hiçbir şey yoktur. O hakkıyla işitendir, hakkıyla görendir.",
  en: "There is nothing like Him, and He is the All-Hearing, the All-Seeing.",
  ref: 'Şûrâ 42:11',
  refEn: 'Shūrā 42:11',
};

// Allah lemma şeffaflık sabitleri (Spec §6)
const ALLAH_CLASSIC_COUNT = 2699;   // M. Fuâd Abdülbâkî, lemma sayımı
const ALLAH_SURFACE_COUNT = 1813;   // JSON'daki yüzey lafz sayımı

// ── Styles ────────────────────────────────────────────────────────────────────

const sectionLabel = {
  color: `${COLORS.gold}99`,
  fontSize: '0.7rem',
  fontFamily: FONTS.body,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.18em',
  marginBottom: '20px',
};

// ── Main component ─────────────────────────────────────────────────────────────

export default function EsmaFrekans({ onClose }) {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const [data, setData] = useState(null);
  const [beyanlari, setBeyanlari] = useState(null);

  // Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape' && onClose) onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Load data
  useEffect(() => {
    fetch('/esma-frekans.json').then(r => r.json()).then(setData).catch(e => console.error('[EsmaFrekans]', e));
    fetch('/esma-beyanlari.json').then(r => r.json()).then(setBeyanlari).catch(e => console.error('[EsmaBeyanlari]', e));
  }, []);

  return (
    <div style={{
      background: COLORS.cosmicBlack,
      minHeight: 'calc(100vh - 62px)',
      paddingTop: '62px',
    }}>
      {/* ═══ SECTION 1: HERO ═══ */}
      <Hero tr={tr} />

      {/* Diğer section'lar sonraki task'larda eklenecek */}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SECTION 1: HERO — Şûrâ 42:11 + Çift-katman başlık + 4 temel ayet
// ═════════════════════════════════════════════════════════════════════════════
function Hero({ tr }) {
  return (
    <section style={{
      minHeight: 'calc(100vh - 62px)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '40px 24px 60px',
      position: 'relative',
    }}>
      {/* Bismillah ornamenti */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 0.6, scale: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        style={{
          fontFamily: FONTS.quran,
          fontSize: '1.4rem',
          color: COLORS.gold,
          marginBottom: '60px',
          textAlign: 'center',
        }}
        dir="rtl"
        lang="ar"
      >
        ﷽
      </motion.div>

      {/* Şûrâ 42:11 — hero verse */}
      <motion.blockquote
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.2 }}
        cite="https://quran.com/42/11"
        style={{
          margin: '0 0 50px',
          textAlign: 'center',
          maxWidth: '780px',
        }}
      >
        <p
          dir="rtl"
          lang="ar"
          style={{
            fontFamily: FONTS.quran,
            fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
            color: COLORS.gold,
            lineHeight: 2.2,
            margin: '0 0 18px',
          }}
        >
          {HERO_VERSE.arabic}
        </p>
        <p style={{
          color: COLORS.offWhite,
          fontFamily: FONTS.display,
          fontStyle: 'italic',
          fontSize: 'clamp(1rem, 2.4vw, 1.25rem)',
          lineHeight: 1.6,
          margin: '0 0 8px',
        }}>
          "{tr ? HERO_VERSE.tr : HERO_VERSE.en}"
        </p>
        <p style={{
          color: COLORS.silver,
          fontFamily: FONTS.body,
          fontSize: '0.85rem',
          letterSpacing: '0.08em',
          margin: 0,
        }}>
          — {tr ? HERO_VERSE.ref : HERO_VERSE.refEn}
        </p>
      </motion.blockquote>

      {/* Çift-katman başlık */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.5 }}
        style={{ textAlign: 'center', marginBottom: '40px' }}
      >
        <h1 style={{
          fontFamily: FONTS.display,
          fontWeight: 900,
          fontSize: 'clamp(2.4rem, 7vw, 5rem)',
          color: COLORS.offWhite,
          letterSpacing: '-0.02em',
          lineHeight: 1,
          margin: '0 0 14px',
        }}>
          {tr ? 'ESMÂ-İ HÜSNÂ' : 'THE BEAUTIFUL NAMES'}
        </h1>
        <p style={{
          fontFamily: FONTS.display,
          fontStyle: 'italic',
          fontSize: 'clamp(1.05rem, 2.4vw, 1.5rem)',
          color: COLORS.silver,
          fontWeight: 400,
          margin: 0,
        }}>
          {tr ? "Allah'ın Kur'an'da Kendini Tanıtması" : 'How God Describes Himself in the Quran'}
        </p>
      </motion.div>

      {/* 4 temel ayet — placeholder; veri Task 8.2'de bağlanacak */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.8 }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '12px',
          maxWidth: '780px',
          width: '100%',
          marginBottom: '40px',
        }}
      >
        {['A\'râf 7:180', 'İsrâ 17:110', 'Tâhâ 20:8', 'Haşr 59:24'].map((ref) => (
          <div key={ref} style={{
            ...GLASS_CARD,
            padding: '14px 12px',
            textAlign: 'center',
          }}>
            <div style={{ ...sectionLabel, marginBottom: '6px', fontSize: '0.62rem' }}>
              {ref}
            </div>
            <div style={{ color: COLORS.silver, fontSize: '0.78rem', fontFamily: FONTS.body, lineHeight: 1.4 }}>
              {tr ? '"En güzel isimler O\'nundur"' : '"The most beautiful names belong to Him"'}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Sayaç şeridi */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ duration: 0.9, delay: 1.1 }}
        style={{
          color: COLORS.silver,
          fontFamily: FONTS.body,
          fontSize: '0.85rem',
          letterSpacing: '0.12em',
          textAlign: 'center',
        }}
      >
        {tr ? '114 isim · 6.236 âyet · 1 mimar' : '114 names · 6,236 verses · one architect'}
      </motion.div>
    </section>
  );
}
