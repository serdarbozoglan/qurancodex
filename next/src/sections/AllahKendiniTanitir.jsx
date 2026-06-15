'use client';

// ─── AllahKendiniTanitir — Reflection köprüsü (KART PATTERN) ───────────────────
// CLAUDE.md §17.3 referans pattern. Anasayfanın "minimum kart" formunun
// kanonik örneği — Wonder/Awe arc'ından "Reflection" köprüsüne geçiş.
// Pilot 1 sonucu: TEASER_NAMES + 4-kart grid + 2-cümle paragraf çıkarıldı;
// derinlik hedef sayfada (/arac/esma-frekans, 99 isim) zaten var → duplikasyon
// kaldırıldı, kart sade-portal formuna indi.
// ──────────────────────────────────────────────────────────────────────────────

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS } from '../tokens';

export default function AllahKendiniTanitir() {
  const { language } = useLanguage();
  const reduced = useReducedMotion();
  const tr = language === 'tr';

  return (
    <section
      id="allah-kendini-tanitir"
      style={{
        background: 'linear-gradient(180deg, #0a0a1a 0%, #0d1b2a 50%, #0a0a1a 100%)',
        padding: '80px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle radial gold glow */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse at center, ${COLORS.gold}10 0%, transparent 55%)`,
      }} />

      {/* Portal container — glass-card frame "kapı/davet" hissi */}
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

        {/* Section label — pure Türkçe, no 'Reflection' */}
        <div
          style={{
            color: `${COLORS.gold}cc`,
            fontFamily: FONTS.body,
            fontSize: '0.72rem',
            fontWeight: 600,
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            marginBottom: '22px',
          }}
        >
          {tr ? 'Yaratılış → Yaratıcı' : 'Creation → Creator'}
        </div>

        {/* Bridge headline FIRST — sayfanın tezi en üstte */}
        <h2
          style={{
            fontFamily: FONTS.display,
            fontWeight: 700,
            fontSize: 'clamp(1.7rem, 4vw, 2.6rem)',
            color: COLORS.offWhite,
            lineHeight: 1.2,
            letterSpacing: '-0.015em',
            margin: '0 0 40px',
          }}
        >
          {tr ? 'Yaratılışı gördünüz. Şimdi Yaratıcıyı tanıyın.' : "You've seen the creation. Now meet the Creator."}
        </h2>

        {/* Anchor verse — A'râf 7:180 (Esmâ-i Hüsnâ kavramının kuruluş ayeti) */}
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
            وَلِلّٰهِ الْاَسْمَٓاءُ الْحُسْنٰى فَادْعُوهُ بِهَا
          </p>
          <p style={{
            color: COLORS.offWhite,
            fontFamily: FONTS.display,
            fontStyle: 'italic',
            fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
            lineHeight: 1.65,
            margin: '0 0 6px',
            maxWidth: '560px',
            marginLeft: 'auto', marginRight: 'auto',
          }}>
            "{tr
              ? "En güzel isimler Allah'ındır; O'na o güzel isimlerle dua edin."
              : "To Allah belong the best names, so invoke Him by them."}"
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
            — {tr ? "A'râf 7:180" : "A'rāf 7:180"}
          </p>
        </div>

        <p
          style={{
            color: COLORS.silver,
            fontFamily: FONTS.body,
            fontSize: 'clamp(0.95rem, 2vw, 1.05rem)',
            lineHeight: 1.75,
            maxWidth: '600px',
            margin: '0 auto 48px',
          }}
        >
          {tr
            ? "Allah Kur'an'da kendisini 114 isim ve sıfatla tanıtır — sarsılmaz kudret (Celâl) ve sığınılacak şefkat (Cemâl) bir denge halinde."
            : "God describes Himself in the Quran through 114 names and attributes — unshakable might (Jalāl) and embracing mercy (Jamāl) in balance."}
        </p>

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
            ? '114 isim ve sıfat · 19 tematik eksen · 1 Yaratıcı'
            : '114 names & attributes · 19 thematic axes · one Creator'}
        </motion.p>
      </motion.div>
    </section>
  );
}
