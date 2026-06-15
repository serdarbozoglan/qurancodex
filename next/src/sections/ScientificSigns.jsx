'use client';

// ─── ScientificSigns — Wonder/Astonishment kart (PILOT 2 — kart-ize) ──────────
// CLAUDE.md §17.3 pattern. Tüm derinlik (4 ayet × klasik+modern+eleştirel)
// /atlas/doga "Bilimsel İşaretler" tab'ına göç ettirildi (Pilot 2 göçü).
// Burada özet kart: anchor verse + Bucaillism nüansı + CTA.
// ──────────────────────────────────────────────────────────────────────────────

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS } from '../tokens';

export default function ScientificSigns() {
  const { language } = useLanguage();
  const reduced = useReducedMotion();
  const tr = language === 'tr';

  return (
    <section
      id="science"
      style={{
        background: 'linear-gradient(180deg, #0a0a1a 0%, #0d1b2a 50%, #0a0a1a 100%)',
        padding: '80px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse at center, ${COLORS.gold}0d 0%, transparent 55%)`,
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
          {tr ? 'Bilimsel İşaretler' : 'Scientific Signs'}
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
          {tr ? "Bilimin 1.400 Yıl Sonra Keşfettikleri" : 'What Science Discovered 1,400 Years Later'}
        </h2>

        {/* Anchor verse — Zâriyât 51:47 (evren genişlemesi — en evrensel ayet) */}
        <div style={{ marginBottom: '32px' }}>
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
            وَالسَّمَاءَ بَنَيْنَاهَا بِأَيْدٍ وَإِنَّا لَمُوسِعُونَ
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
            "{tr
              ? 'Göğü de kudretimizle Biz bina ettik; muhakkak Biz onu genişletmekteyiz.'
              : 'And the sky We built with might, and indeed We are [its] expander.'}"
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
            — {tr ? 'Zâriyât 51:47' : 'aẓ-Ẓāriyāt 51:47'}
          </p>
        </div>

        <p style={{
          color: COLORS.silver,
          fontFamily: FONTS.body,
          fontSize: 'clamp(0.95rem, 2vw, 1.05rem)',
          lineHeight: 1.75,
          maxWidth: '620px',
          margin: '0 auto 28px',
        }}>
          {tr
            ? "Demir · genişleyen evren · iki deniz · embriyoloji — dört ayet, modern bilimsel keşiflerle düşündürücü paralellikler taşır. Bu sayfa kesin bir \"bilimsel mucize\" iddiası sunmaz — klasik tefsir okumalarını modern paralellerle birlikte ve eleştirel notlarla sunar."
            : 'Iron · expanding universe · two seas · embryology — four verses bear striking parallels with modern discoveries. This page makes no definitive "scientific miracle" claim — it presents classical exegesis alongside modern parallels with critical notes.'}
        </p>

        {/* Bucaillism micro-warning */}
        <div style={{
          borderLeft: `2px solid ${COLORS.gold}66`,
          background: 'rgba(212,165,116,0.04)',
          borderRadius: '0 6px 6px 0',
          padding: '10px 14px',
          margin: '0 auto 36px',
          maxWidth: '560px',
          textAlign: 'left',
        }}>
          <p style={{
            margin: 0,
            color: COLORS.silver,
            fontSize: '0.78rem',
            fontFamily: FONTS.body,
            fontStyle: 'italic',
            lineHeight: 1.6,
          }}>
            {tr
              ? '✦ Akademik nüans: Modern bilimsel okumalar "Bucaillism" eleştirisine açıktır (Sardar, Bigliardi, Edis). Atlas her ayet için klasik tefsir + modern paralellik + eleştirel notu yan yana sunar.'
              : '✦ Academic nuance: Modern scientific readings face the "Bucaillism" critique (Sardar, Bigliardi, Edis). The atlas presents classical exegesis + modern parallel + critical note side by side for each verse.'}
          </p>
        </div>

        {/* CTA */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <Link
            href={`/${language}/atlas/doga`}
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
            <span>{tr ? '4 Ayeti Tabiat Atlası\'nda İncele' : "Explore 4 Verses in the Tabiat Atlas"}</span>
            <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>→</span>
          </Link>
        </motion.div>

        <motion.p
          initial={reduced ? false : { opacity: 0 }}
          whileInView={{ opacity: 0.6 }}
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
          {tr
            ? "Demir · 1957 · Evren · 1929 · Denizler · 1960'lar · Embriyoloji · 20. yy."
            : "Iron · 1957 · Universe · 1929 · Oceans · 1960s · Embryology · 20th c."}
        </motion.p>
      </motion.div>
    </section>
  );
}
