'use client';

// ─── AllahKendiniTanitir — Reflection köprüsü ─────────────────────────────────
// Site narrative arc'ının "Reflection" evresinde, Conclusion'dan hemen önce
// gelir. Mimariyi anlattıktan sonra "kim?" sorusuna geçişi yapar ve okuyucuyu
// Esmâ-i Hüsnâ flagship sayfasına yönlendirir.
// CLAUDE.md §1: Wonder → Shock → Fascination → Awe → Astonishment → Reflection
// ──────────────────────────────────────────────────────────────────────────────

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS } from '../tokens';

const TEASER_NAMES = [
  { ar: 'ٱللَّه',       trName: 'Allah',     enName: 'Allāh',      count: 2699 },
  { ar: 'ٱلرَّحْمَٰن',  trName: 'Er-Rahmân', enName: 'ar-Raḥmān',  count: 60   },
  { ar: 'ٱلْعَلِيم',    trName: 'El-Alîm',   enName: 'al-ʿAlīm',   count: 161  },
  { ar: 'ٱلْحَكِيم',    trName: 'El-Hakîm',  enName: 'al-Ḥakīm',   count: 97   },
];

export default function AllahKendiniTanitir() {
  const { language } = useLanguage();
  const reduced = useReducedMotion();
  const tr = language === 'tr';

  return (
    <section
      id="allah-kendini-tanitir"
      style={{
        background: 'linear-gradient(180deg, #0a0a1a 0%, #0d1b2a 50%, #0a0a1a 100%)',
        padding: '120px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle radial gold glow */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse at center, ${COLORS.gold}10 0%, transparent 55%)`,
      }} />

      <div style={{
        position: 'relative',
        maxWidth: '880px',
        margin: '0 auto',
        textAlign: 'center',
      }}>

        {/* Section label */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          style={{
            color: `${COLORS.gold}cc`,
            fontFamily: FONTS.body,
            fontSize: '0.72rem',
            fontWeight: 600,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            marginBottom: '24px',
          }}
        >
          {tr ? 'Reflection · Mimari → Mimar' : 'Reflection · Architecture → Architect'}
        </motion.div>

        {/* Anchor verse */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, delay: 0.1 }}
          style={{ marginBottom: '48px' }}
        >
          <p
            dir="rtl"
            lang="ar"
            style={{
              fontFamily: FONTS.quran,
              fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
              color: COLORS.gold,
              lineHeight: 2,
              margin: '0 0 16px',
              textShadow: `0 0 24px ${COLORS.gold}22`,
            }}
          >
            لَيْسَ كَمِثْلِهِۦ شَىْءٌ ۖ وَهُوَ ٱلسَّمِيعُ ٱلْبَصِيرُ
          </p>
          <p style={{
            color: COLORS.offWhite,
            fontFamily: FONTS.display,
            fontStyle: 'italic',
            fontSize: 'clamp(1rem, 2.2vw, 1.2rem)',
            lineHeight: 1.6,
            margin: '0 0 6px',
            maxWidth: '600px',
            marginLeft: 'auto', marginRight: 'auto',
          }}>
            "{tr
              ? "O'nun benzeri hiçbir şey yoktur. O hakkıyla işitendir, hakkıyla görendir."
              : "There is nothing like Him, and He is the All-Hearing, the All-Seeing."}"
          </p>
          <p style={{
            color: COLORS.silver,
            fontFamily: FONTS.body,
            fontSize: '0.76rem',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            margin: 0,
            opacity: 0.7,
          }}>
            — {tr ? 'Şûrâ 42:11' : 'Shūrā 42:11'}
          </p>
        </motion.div>

        {/* Bridge headline */}
        <motion.h2
          initial={reduced ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            fontFamily: FONTS.display,
            fontWeight: 700,
            fontSize: 'clamp(1.8rem, 4.5vw, 3rem)',
            color: COLORS.offWhite,
            lineHeight: 1.2,
            letterSpacing: '-0.01em',
            margin: '0 0 18px',
          }}
        >
          {tr ? 'Mimariyi gördünüz. Şimdi mimarı tanıyın.' : "You've seen the architecture. Now meet the architect."}
        </motion.h2>

        <motion.p
          initial={reduced ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{
            color: COLORS.silver,
            fontFamily: FONTS.body,
            fontSize: 'clamp(1rem, 2.2vw, 1.15rem)',
            lineHeight: 1.8,
            maxWidth: '680px',
            margin: '0 auto 48px',
          }}
        >
          {tr
            ? "Allah kendisini Kur'an'da 114 isim ve sıfatla, kimi zaman üçüncü şahısla kimi zaman doğrudan kendi ağzından tanıtır. Sarsılmaz kudret (Celal) ve sığınılacak şefkat (Cemal) bir denge halinde. Bu Esmâ-i Hüsnâ deneyimi o tanıtmanın haritasıdır."
            : "God describes Himself in the Quran through 114 names and attributes — sometimes in the third person, sometimes directly in His own voice. Unshakable might (Jalāl) and embracing mercy (Jamāl) held in balance. This Esmâ-i Hüsnâ experience is the map of that self-description."}
        </motion.p>

        {/* 4 isim teaser cards */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '14px',
            marginBottom: '56px',
          }}
        >
          {TEASER_NAMES.map((n, i) => (
            <motion.div
              key={n.trName}
              initial={reduced ? false : { opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: 0.5 + i * 0.08 }}
              style={{
                background: `linear-gradient(180deg, ${COLORS.gold}0c 0%, rgba(255,255,255,0.02) 100%)`,
                border: `1px solid ${COLORS.gold}26`,
                borderRadius: '14px',
                padding: '22px 16px',
                textAlign: 'center',
              }}
            >
              <p
                dir="rtl"
                lang="ar"
                style={{
                  fontFamily: FONTS.quran,
                  fontSize: 'clamp(1.4rem, 2.4vw, 1.7rem)',
                  color: COLORS.gold,
                  lineHeight: 1.4,
                  margin: '0 0 10px',
                }}
              >
                {n.ar}
              </p>
              <p style={{
                color: COLORS.offWhite,
                fontFamily: FONTS.body,
                fontSize: '0.86rem',
                fontWeight: 600,
                margin: '0 0 6px',
              }}>
                {tr ? n.trName : n.enName}
              </p>
              <p style={{
                color: `${COLORS.gold}aa`,
                fontFamily: FONTS.body,
                fontSize: '0.74rem',
                letterSpacing: '0.06em',
                margin: 0,
              }}>
                {n.count.toLocaleString(tr ? 'tr-TR' : 'en-US')} {tr ? 'geçiş' : 'occurrences'}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.7 }}
        >
          <Link
            href={`/${language}/arac/esma-frekans`}
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
            <span>{tr ? 'Esmâ-i Hüsnâ sayfasını keşfet' : 'Explore Esmâ-i Hüsnâ'}</span>
            <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>→</span>
          </Link>
        </motion.div>

        {/* Closing whisper */}
        <motion.p
          initial={reduced ? false : { opacity: 0 }}
          whileInView={{ opacity: 0.6 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1, delay: 0.9 }}
          style={{
            color: COLORS.silver,
            fontFamily: FONTS.display,
            fontStyle: 'italic',
            fontSize: '0.9rem',
            marginTop: '40px',
            lineHeight: 1.6,
          }}
        >
          {tr
            ? '114 isim ve sıfat · 14 tematik eksen · 1 mimar'
            : '114 names & attributes · 14 thematic axes · one architect'}
        </motion.p>
      </div>
    </section>
  );
}
