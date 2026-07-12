'use client';

// ─── ScientificSigns — Astonishment kartı ─────────────────────────────────────
// Pilot 2 (2026-07-12) — CLAUDE.md §17 uyarınca eski 4-tab scroll story
// (Hadid/Zariyat/Rahman/Mu'minun) minimal kart formatına indirildi. Derinlik
// artık iki tool sayfasına havale edilir:
//   • /atlas/doga (Tabiat Atlası) — 8 tab: hayvan, bitki, gök, hapax, sûre, bağlam, tefsir, bilim
//   • /arac/bilimsel-isaretler   — 4 iyet-bilim çifti derinlemesine
// Anasayfa kartı Fussilet 41:53 üzerinden kevnî ayet doktrinini açar.
// ──────────────────────────────────────────────────────────────────────────────

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS } from '../tokens';

const TEASER_SIGNS = [
  {
    ar: 'الْحَدِيد',
    trName: 'Demir',
    enName: 'Iron',
    refTr: 'Hadîd 57:25',
    refEn: 'Al-Ḥadīd 57:25',
    themeTr: 'Astrofizik · 1957',
    themeEn: 'Astrophysics · 1957',
  },
  {
    ar: 'مُوسِعُون',
    trName: 'Genişleyen Evren',
    enName: 'Expanding Universe',
    refTr: 'Zâriyât 51:47',
    refEn: 'Adh-Dhāriyāt 51:47',
    themeTr: 'Hubble · 1929',
    themeEn: 'Hubble · 1929',
  },
  {
    ar: 'بَرْزَخ',
    trName: 'Deniz Duvarı',
    enName: 'Ocean Barrier',
    refTr: 'Rahmân 55:19',
    refEn: 'Ar-Raḥmān 55:19',
    themeTr: "Oşinografi · 1960'lar",
    themeEn: 'Oceanography · 1960s',
  },
  {
    ar: 'عَلَقَة',
    trName: 'Alaka (Embriyo)',
    enName: 'ʿAlaqah (Embryo)',
    refTr: "Mü'minûn 23:14",
    refEn: "Al-Muʾminūn 23:14",
    themeTr: 'Embriyoloji · 20. yy.',
    themeEn: 'Embryology · 20th c.',
  },
];

export default function ScientificSigns() {
  const { language } = useLanguage();
  const reduced = useReducedMotion();
  const tr = language === 'tr';

  return (
    <section
      id="science"
      style={{
        background: 'linear-gradient(180deg, #0a0a1a 0%, #0d1b2a 50%, #0a0a1a 100%)',
        padding: '110px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle radial cyan glow — kevnî ayet mavisi */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse at center, ${COLORS.cyan}10 0%, transparent 55%)`,
      }} />

      {/* Portal container */}
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

        {/* Section label */}
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
          {tr ? 'Ayet · Ufuk · Nefis' : 'Sign · Horizon · Self'}
        </div>

        {/* Bridge headline */}
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
          {tr
            ? 'Kur\'an size ufka bakmayı emreder.'
            : 'The Quran commands you to look at the horizon.'}
        </h2>

        {/* Anchor verse — Fussilet 41:53 (kevnî ayet doktrin ayeti) */}
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
            سَنُرِيهِمْ اٰيَاتِنَا فِي الْاٰفَاقِ وَفِٓي اَنْفُسِهِمْ
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
            &ldquo;{tr
              ? 'Ufuklarda ve kendi nefislerinde ayetlerimizi onlara göstereceğiz.'
              : 'We shall show them Our signs on the horizons and within themselves.'}&rdquo;
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
            — {tr ? 'Fussilet 41:53' : 'Fuṣṣilat 41:53'}
          </p>
        </div>

        <p
          style={{
            color: COLORS.silver,
            fontFamily: FONTS.body,
            fontSize: 'clamp(0.95rem, 2vw, 1.05rem)',
            lineHeight: 1.75,
            maxWidth: '600px',
            margin: '0 auto 40px',
          }}
        >
          {tr
            ? 'Kur\'an\'ın 500\'den fazla ayeti tabiata bakışa çağırır. Bu ayetler bilimsel beyan değil, tefekkür daveti — düşünmeye, ölçmeye, ders çıkarmaya. Bulgular değişse de davet sabittir.'
            : 'Over 500 Quranic verses call the reader to observe nature. These are not scientific declarations but invitations to reflect — to think, measure, and draw lessons. Findings shift; the call is constant.'}
        </p>

        {/* 4 iyet-bilim teaser cards */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '14px',
            marginBottom: '48px',
          }}
        >
          {TEASER_SIGNS.map((n, i) => (
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
                  fontSize: 'clamp(1.3rem, 2.4vw, 1.6rem)',
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
                fontSize: '0.9rem',
                fontWeight: 600,
                margin: '0 0 6px',
              }}>
                {tr ? n.trName : n.enName}
              </p>
              <p style={{
                color: `${COLORS.gold}aa`,
                fontFamily: FONTS.body,
                fontSize: '0.68rem',
                letterSpacing: '0.06em',
                margin: '0 0 3px',
              }}>
                {tr ? n.refTr : n.refEn}
              </p>
              <p style={{
                color: COLORS.silver,
                fontFamily: FONTS.body,
                fontSize: '0.66rem',
                letterSpacing: '0.05em',
                margin: 0,
                opacity: 0.75,
              }}>
                {tr ? n.themeTr : n.themeEn}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA — primary: Tabiat Atlası (kapsamlı) */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.7 }}
          style={{
            display: 'flex', flexWrap: 'wrap', gap: '12px',
            justifyContent: 'center',
          }}
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
            <span>{tr ? 'Tabiat Atlası\'nı keşfet' : 'Explore the Atlas of Nature'}</span>
            <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>→</span>
          </Link>

          {/* Secondary CTA — Bilimsel İşaretler (iyet-bilim odak) */}
          <Link
            href={`/${language}/arac/bilimsel-isaretler`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              background: 'transparent',
              border: `1px solid ${COLORS.gold}33`,
              borderRadius: '999px',
              padding: '14px 24px',
              color: `${COLORS.gold}cc`,
              fontFamily: FONTS.body,
              fontSize: '0.86rem',
              fontWeight: 500,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = `${COLORS.gold}11`; e.currentTarget.style.borderColor = `${COLORS.gold}66`; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = `${COLORS.gold}33`; }}
          >
            <span>{tr ? '4 İyet-Bilim çifti' : '4 Sign-Science Pairs'}</span>
            <span style={{ fontSize: '0.95rem', lineHeight: 1 }}>→</span>
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
            ? 'Demir · Genişleyen evren · Deniz duvarı · Alaka · 500+ kevnî işaret'
            : 'Iron · Expanding cosmos · Ocean barrier · ʿAlaqah · 500+ cosmic signs'}
        </motion.p>
      </motion.div>
    </section>
  );
}
