'use client';

// ─── DuaDiliCard — Anasayfa tanıtıcı kart (kapı/portal) ─────
// /arac/dua-dili sayfasının anasayfadaki giriş kapısı.
// Derin içerik AYNI — /sections/QuranDua.jsx (DuaDili.jsx wrapper)
// Pattern: MukattaaCard ile birebir uyumlu.

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS } from '../tokens';

export default function DuaDiliCard() {
  const { language } = useLanguage();
  const reduced = useReducedMotion();
  const tr = language === 'tr';

  return (
    <section
      id="dua-card"
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
          borderRadius: '12px',
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
          {tr ? "Dua Dili" : "Language of Prayer"}
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
          {tr ? "Kul ile Rabbin Doğrudan Diyaloğu" : "The Direct Dialogue Between Servant and Lord"}
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
            وَاِذَا سَاَلَكَ عِبَادِي عَنِّي فَاِنِّي قَرِيبٌ
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
            "{tr ? "Kullarım Beni sorarsa — Ben yakınım. Bana dua edenin duasına icabet ederim." : "When My servants ask about Me — I am near; I respond to the call of the caller."}"
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
            — {tr ? "Bakara 2:186" : "al-Baqara 2:186"}
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
          {tr ? "Kur'an'da dua bir tek edebi formül değil, birden çok gramatik kalıba dağılır — Fâtiha'nın \"iyyâke na'budu\" (yalnızca Sana ibadet ederiz), Mü'min 40:60'ın \"Bana dua edin\" emri, Bakara 2:186'nın \"icabet ederim\" vaadi. Yakarış metin değil, yapı." : "Prayer in the Quran is not a single literary formula — it is dispersed across multiple grammatical templates: al-Fātiḥa's \"iyyāka na'budu\" (You alone we worship), the imperative in al-Muʾmin 40:60 \"Call upon Me\", and the promise in al-Baqara 2:186 \"I respond\". Supplication is not text — it is structure."}
        </p>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <Link
            href={`/${language}/arac/dua-dili`}
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
            <span>{tr ? "Dua Dili Sayfasını Keşfet" : "Explore the Language of Prayer"}</span>
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
          {tr ? "10 tematik dua · 1 ortak gramatik DNA · sınırsız diyalog" : "10 thematic duʿās · 1 shared grammatical DNA · limitless dialogue"}
        </motion.p>
      </motion.div>
    </section>
  );
}
