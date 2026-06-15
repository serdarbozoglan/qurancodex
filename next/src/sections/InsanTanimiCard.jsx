'use client';

// ─── InsanTanimiCard — Anasayfa tanıtıcı kart (kapı/portal) ─────
// /atlas/insan-tanimi sayfasının anasayfadaki giriş kapısı.
// Derin içerik AYNI — /sections/HumanDefinition.jsx (InsanTanimi.jsx wrapper)
// Pattern: MukattaaCard ile birebir uyumlu.

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS } from '../tokens';

export default function InsanTanimiCard() {
  const { language } = useLanguage();
  const reduced = useReducedMotion();
  const tr = language === 'tr';

  return (
    <section
      id="insan-tanimi-card"
      style={{
        background: 'linear-gradient(180deg, #0a0a1a 0%, #0d1b2a 50%, #0a0a1a 100%)',
        padding: '90px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse at center, ${COLORS.gold}10 0%, transparent 55%)`,
      }} />

      <motion.div
        initial={reduced ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.9 }}
        style={{
          position: 'relative',
          maxWidth: '760px',
          margin: '0 auto',
          textAlign: 'center',
          padding: 'clamp(40px, 6vw, 64px) clamp(28px, 5vw, 56px)',
          background: 'linear-gradient(180deg, rgba(212,165,116,0.05) 0%, rgba(255,255,255,0.02) 100%)',
          border: `1px solid ${COLORS.gold}33`,
          borderRadius: '20px',
          boxShadow: `inset 0 0 0 1px ${COLORS.gold}14, 0 30px 80px rgba(0,0,0,0.4)`,
        }}
      >
        <div style={{
          color: `${COLORS.gold}cc`,
          fontFamily: FONTS.body,
          fontSize: '0.72rem',
          fontWeight: 600,
          letterSpacing: '0.24em',
          textTransform: 'uppercase',
          marginBottom: '22px',
        }}>
          {tr ? "İnsan Tanımı" : "Human Definition"}
        </div>

        <h2 style={{
          fontFamily: FONTS.display,
          fontWeight: 700,
          fontSize: 'clamp(1.7rem, 4vw, 2.6rem)',
          color: COLORS.offWhite,
          lineHeight: 1.2,
          letterSpacing: '-0.015em',
          margin: '0 0 36px',
        }}>
          {tr ? "Yedi Mertebede İnsanın Haritası" : "The Map of the Human in Seven Stations"}
        </h2>

        <div style={{ marginBottom: '36px' }}>
          <p
            dir="rtl"
            lang="ar"
            style={{
              fontFamily: FONTS.quran,
              fontSize: 'clamp(1.4rem, 3.2vw, 1.95rem)',
              color: COLORS.gold,
              lineHeight: 2.1,
              margin: '0 0 14px',
              textShadow: `0 0 24px ${COLORS.gold}22`,
            }}
          >
            لَقَدْ خَلَقْنَا الْاِنْسَانَ فِٓي اَحْسَنِ تَقْوِيمٍ
          </p>
          <p style={{
            color: COLORS.offWhite,
            fontFamily: FONTS.display,
            fontStyle: 'italic',
            fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
            lineHeight: 1.65,
            margin: '0 0 6px',
            maxWidth: '600px',
            marginLeft: 'auto', marginRight: 'auto',
          }}>
            "{tr ? "Andolsun, Biz insanı en güzel biçimde yarattık." : "Indeed, We created humanity in the finest of forms."}"
          </p>
          <p style={{
            color: COLORS.silver,
            fontFamily: FONTS.body,
            fontSize: '0.72rem',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            margin: 0,
            opacity: 0.7,
          }}>
            — {tr ? "Tîn 95:4" : "at-Tīn 95:4"}
          </p>
        </div>

        <p style={{
          color: COLORS.silver,
          fontFamily: FONTS.body,
          fontSize: 'clamp(0.95rem, 2vw, 1.05rem)',
          lineHeight: 1.75,
          maxWidth: '620px',
          margin: '0 auto 40px',
        }}>
          {tr ? "Kur'an iki temel eksende iner: Allah'ı tanıtmak (mârifetullah) ve insanı dönüştürmek (tezkiye). İnsan tek bir kavramla değil — nefs, fıtrat, halife, imtihan, hilkat — çok boyutlu bir prizmayla tanıtılır. Her boyut başka bir açıdan aynı sırrı gösterir." : "The Quran descends on two axes: introducing God (maʿrifatullāh) and transforming the human (tazkiya). Humanity is not defined by a single term — nafs, fiṭra, khalīfa, trial, creation — but through a multi-dimensional prism. Each angle reveals the same secret from another perspective."}
        </p>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <Link
            href={`/${language}/atlas/insan-tanimi`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              background: `${COLORS.gold}1a`,
              border: `1px solid ${COLORS.gold}66`,
              borderRadius: '999px',
              padding: '14px 28px',
              color: COLORS.gold,
              fontFamily: FONTS.body,
              fontSize: '0.94rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = `${COLORS.gold}33`; e.currentTarget.style.borderColor = `${COLORS.gold}aa`; }}
            onMouseLeave={e => { e.currentTarget.style.background = `${COLORS.gold}1a`; e.currentTarget.style.borderColor = `${COLORS.gold}66`; }}
          >
            <span>{tr ? "İnsan Tanımı Sayfasını Keşfet" : "Explore the Human Definition Page"}</span>
            <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>→</span>
          </Link>
        </motion.div>

        <motion.p
          initial={reduced ? false : { opacity: 0 }}
          whileInView={{ opacity: 0.78 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1, delay: 0.7 }}
          style={{
            color: COLORS.silver,
            fontFamily: FONTS.display,
            fontStyle: 'italic',
            fontSize: '0.9rem',
            marginTop: '34px',
            lineHeight: 1.6,
          }}
        >
          {tr ? "Nefs · fıtrat · halife · imtihan · hilkat" : "Nafs · fiṭra · khalīfa · trial · creation"}
        </motion.p>
      </motion.div>
    </section>
  );
}
