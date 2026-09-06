'use client';

// ─── SesMimarisi — Tool sayfası WRAPPER ────────────────────
// Anasayfa SoundArchitecture section AYNEN render; ToolHeader + Hero ekstrası.
// Kural: içerik değiştirme, basitleştirme, görselliği azaltma — sadece enhance.

import { useEffect, useState } from 'react';
import SoundArchitecture from '../sections/SoundArchitecture';
import SoundExtensions from './SoundExtensions';
import ToolHeader from './ToolHeader';
import CrossToolCTA from './CrossToolCTA';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS } from '../tokens';

export default function SesMimarisi({ onClose }) {
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
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15 9a3 3 0 0 1 0 6"/><path d="M18 6a7 7 0 0 1 0 12"/></svg>
        }
        titleTr="Ses Mimarisi — Sesin Anlamla Paralelliği"
        titleEn="Sound Architecture — Where Sound Parallels Meaning"
        subtitleTr="Azap ↔ rahmet sesleri · amigdala ve korteks"
        subtitleEn="Wrath ↔ mercy sounds · amygdala and cortex"
        language={language}
        onClose={onClose}
      />

      {/* Cinematic Hero */}
      <div className="mq-box" style={{
        '--pt-d': "56px", '--pt-m': "40px", '--pr-d': "32px", '--pr-m': "16px", '--pb-d': "36px", '--pb-m': "28px", '--pl-d': "32px", '--pl-m': "16px",
        background: 'linear-gradient(180deg, rgba(212,165,116,0.06) 0%, transparent 100%)',
        borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
        textAlign: 'center',
      }}>
        <div className="mq-fs" style={{
          '--fs-d': '2.6rem', '--fs-m': '2.2rem',
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
          وَالنَّازِعَاتِ غَرْقاً
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
          &quot;{tr ? "Andolsun, şiddetle söküp çıkaranlara..." : "By those who pluck out violently..."}&quot;
        </p>
        <p style={{
          color: COLORS.silver,
          fontFamily: FONTS.body,
          fontSize: '0.7rem',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          opacity: 0.78,
          marginBottom: '24px',
        }}>— {tr ? "Nâziât 79:1" : "an-Nāziʿāt 79:1"}</p>

        <div style={{ width: '120px', height: '1px', margin: '20px auto 24px', background: `linear-gradient(90deg, transparent, ${COLORS.gold}aa, transparent)` }} />

        <h2 className="mq-fs" style={{
          fontFamily: FONTS.display, fontWeight: 700,
          color: COLORS.offWhite,
          '--fs-d': 'clamp(2rem, 3.6vw, 2.7rem)', '--fs-m': 'clamp(1.6rem, 7vw, 2rem)',
          lineHeight: 1.2, letterSpacing: '-0.015em',
          margin: '0 0 12px',
        }}>
          {tr ? "Ses Mimarisi — Sesin Anlamla Paralelliği" : "Sound Architecture — Where Sound Parallels Meaning"}
        </h2>
        <p className="mq-fs" style={{
          fontFamily: FONTS.display, fontStyle: 'italic',
          color: COLORS.gold,
          '--fs-d': 'clamp(1.05rem, 1.8vw, 1.18rem)', '--fs-m': 'clamp(1rem, 4vw, 1.1rem)',
          margin: 0,
        }}>
          {tr ? "Azap ↔ rahmet sesleri · amigdala ve korteks" : "Wrath ↔ mercy sounds · amygdala and cortex"}
        </p>
      </div>

      {/* Anasayfa SoundArchitecture section AYNEN */}
      <SoundArchitecture />

      {/* Genişletilmiş: 4 ek karşıtlık + fonetik spektrum */}
      <SoundExtensions language={language} isMobile={isMobile} />

      {/* CrossToolCTA — sesin retorik, yemin ve renk boyutlarına köprü */}
      <div className="mq-box" style={{ maxWidth: 1080, margin: '0 auto', '--pt-d': "0", '--pt-m': "0", '--pr-d': "32px", '--pr-m': "16px", '--pb-d': "100px", '--pb-m': "80px", '--pl-d': "32px", '--pl-m': "16px" }}>
        <CrossToolCTA
          language={language}
          isMobile={isMobile}
          links={[
            {
              href: `/${language}/arac/retorik`,
              titleTr: "Kur'an Belâgatı",
              titleEn: 'Quranic Rhetoric',
              descTr: 'Tezat, istiare, teşbih, iltifât: sesle taşınan retorik güç.',
              descEn: 'Antithesis, metaphor, simile, iltifāt: the rhetorical power carried by sound.',
            },
            {
              href: `/${language}/arac/yeminler`,
              titleTr: "Kur'an'ın Yeminleri",
              titleEn: 'Quranic Oaths',
              descTr: 'Vâv-ı kasem: 40\'tan fazla yeminin ses ve ritim mimarisi.',
              descEn: 'Wāw al-qasam: the sound and rhythm architecture of more than 40 oaths.',
            },
            {
              href: `/${language}/arac/ritim`,
              titleTr: 'İmkansız Ritim',
              titleEn: 'Impossible Rhythm',
              descTr: 'Ne şiir ne düzyazı: Kur\'ânî fasıla ve prozodinin analizi.',
              descEn: 'Neither poetry nor prose: analysis of Quranic cadence and prosody.',
            },
          ]}
        />
      </div>
    </div>
  );
}
