'use client';

// ─── Ritim — Tool sayfası WRAPPER ─────────────────────────────────────────────
// Anasayfa ImpossibleRhythm section AYNEN render; ToolHeader + Hero ekstrası.
// Kural: içerik değiştirme, basitleştirme, görselliği azaltma — sadece enhance.
// ──────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from 'react';
import ImpossibleRhythm from '../sections/ImpossibleRhythm';
import RhythmExtensions from './RhythmExtensions';
import ToolHeader from './ToolHeader';
import CrossToolCTA from './CrossToolCTA';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS } from '../tokens';

export default function Ritim({ onClose }) {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 640);
    h();
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  return (
    <div style={{
      background: COLORS.cosmicBlack,
      minHeight: 'calc(100vh - 62px)',
      paddingTop: '62px',
    }}>
      <ToolHeader
        icon={
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12h3l3-9 3 18 3-9h6" />
          </svg>
        }
        titleTr="İmkânsız Ritim"
        titleEn="Impossible Rhythm"
        subtitleTr="Ne şiir ne düzyazı · 16 vezin · sui generis"
        subtitleEn="Neither poetry nor prose · 16 meters · sui generis"
        language={language}
        onClose={onClose}
      />

      {/* Cinematic Hero */}
      <div style={{
        padding: isMobile ? '40px 16px 28px' : '56px 32px 36px',
        background: 'linear-gradient(180deg, rgba(212,165,116,0.06) 0%, transparent 100%)',
        borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: isMobile ? '2.2rem' : '2.6rem',
          color: COLORS.gold,
          opacity: 0.82,
          fontFamily: FONTS.bismillah,
          marginBottom: '24px',
          lineHeight: 1.2,
        }} dir="rtl" lang="ar" aria-label="Bismillāh">﷽</div>

        <p
          dir="rtl" lang="ar"
          style={{
            fontFamily: FONTS.quran,
            fontSize: 'clamp(1.4rem, 3vw, 2rem)',
            color: COLORS.gold,
            lineHeight: 2.1,
            margin: '0 0 12px',
            textShadow: `0 0 22px ${COLORS.gold}1f`,
          }}
        >
          وَالنَّجْمِ اِذَا هَوٰى
        </p>
        <p style={{
          fontFamily: FONTS.display,
          fontStyle: 'italic',
          color: COLORS.offWhite,
          fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
          lineHeight: 1.65,
          maxWidth: '660px',
          margin: '0 auto 6px',
        }}>
          "{tr ? 'Andolsun yıldıza, kayıp düştüğü zaman.' : 'By the star when it falls.'}"
        </p>
        <p style={{
          color: COLORS.silver,
          fontFamily: FONTS.body,
          fontSize: '0.7rem',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          opacity: 0.65,
          marginBottom: '24px',
        }}>— {tr ? 'Necm 53:1' : 'an-Najm 53:1'}</p>

        <div style={{ width: '120px', height: '1px', margin: '20px auto 24px', background: `linear-gradient(90deg, transparent, ${COLORS.gold}aa, transparent)` }} />

        <div style={{
          fontSize: '0.72rem', fontFamily: FONTS.body, fontWeight: 700,
          letterSpacing: '0.3em', textTransform: 'uppercase',
          color: COLORS.gold, opacity: 0.72, marginBottom: '14px',
        }}>
          {tr ? 'İMKÂNSIZ RİTİM · 16 VEZİN · SUİ GENERİS' : 'IMPOSSIBLE RHYTHM · 16 METERS · SUI GENERIS'}
        </div>

        <h2 style={{
          fontFamily: FONTS.display, fontWeight: 700,
          color: COLORS.offWhite,
          fontSize: isMobile ? 'clamp(1.6rem, 7vw, 2rem)' : 'clamp(2rem, 3.6vw, 2.7rem)',
          lineHeight: 1.2, letterSpacing: '-0.015em',
          margin: '0 0 12px',
        }}>
          {tr ? 'İmkânsız Ritim — Ne Şiir, Ne Düzyazı' : 'Impossible Rhythm — Neither Poetry, Nor Prose'}
        </h2>
        <p style={{
          fontFamily: FONTS.display, fontStyle: 'italic',
          color: COLORS.gold,
          fontSize: isMobile ? 'clamp(1rem, 4vw, 1.1rem)' : 'clamp(1.05rem, 1.8vw, 1.18rem)',
          margin: 0,
        }}>
          {tr ? 'Edebiyat tarihinde kendi kategorisini yaratan dil' : 'A language that created its own category in literary history'}
        </p>
      </div>

      {/* Anasayfa ImpossibleRhythm section AYNEN */}
      <ImpossibleRhythm />

      {/* Genişletilmiş: 16 vezin widget + Rahmân 31 refrain */}
      <RhythmExtensions language={language} isMobile={isMobile} />

      {/* CrossToolCTA — ritim ↔ ses ↔ yemin ↔ retorik hattı */}
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: isMobile ? '0 16px 80px' : '0 32px 100px' }}>
        <CrossToolCTA
          language={language}
          isMobile={isMobile}
          links={[
            {
              href: `/${language}/arac/ses-mimarisi`,
              titleTr: 'Ses Mimarisi',
              titleEn: 'Sound Architecture',
              descTr: 'Sert ve yumuşak ünsüzler — ritmin fonetik alt-yapısı.',
              descEn: 'Hard and soft consonants — the phonetic infrastructure of rhythm.',
            },
            {
              href: `/${language}/arac/yeminler`,
              titleTr: "Kur'an'ın Yeminleri",
              titleEn: 'Quranic Oaths',
              descTr: '40+ yeminin ritim ve fasıla ekseninde okunması.',
              descEn: 'Reading 40+ oaths along the axis of rhythm and cadence.',
            },
            {
              href: `/${language}/arac/retorik`,
              titleTr: "Kur'an Belâgatı",
              titleEn: 'Quranic Rhetoric',
              descTr: 'Fâsıla, iltifât, takdîm-tehîr — ritmi anlama dönüştüren sanatlar.',
              descEn: 'Cadence, iltifāt, syntactic shifts — arts that turn rhythm into meaning.',
            },
          ]}
        />
      </div>
    </div>
  );
}
