'use client';

// ─── DuaDili — Tool sayfası WRAPPER ────────────────────
// Anasayfa QuranDua section AYNEN render; ToolHeader + Hero ekstrası.
// Kural: içerik değiştirme, basitleştirme, görselliği azaltma — sadece enhance.

import { useEffect, useState } from 'react';
import QuranDua from '../sections/QuranDua';
import ToolHeader from './ToolHeader';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS } from '../tokens';

export default function DuaDili({ onClose }) {
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
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v8M8 6l4-4 4 4M12 22V12M16 18l-4 4-4-4"/></svg>
        }
        titleTr="Dua Dili — Yakarışın Gramatik Kalıbı"
        titleEn="Language of Prayer — The Grammar of Supplication"
        subtitleTr="Fâtiha · Bakara 2:186 · 11 tematik dua"
        subtitleEn="al-Fātiḥa · al-Baqara 2:186 · 11 thematic duʿās"
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
          fontFamily: 'Amiri Quran, serif',
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
          وَاِذَا سَاَلَكَ عِبَادِي عَنِّي فَاِنِّي قَرِيبٌ
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
          "{tr ? "Kullarım Beni sorarsa — Ben yakınım. Bana dua edenin duasına icabet ederim." : "When My servants ask about Me — I am near; I respond to the call of the caller."}"
        </p>
        <p style={{
          color: COLORS.silver,
          fontFamily: FONTS.body,
          fontSize: '0.7rem',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          opacity: 0.65,
          marginBottom: '24px',
        }}>— {tr ? "Bakara 2:186" : "al-Baqara 2:186"}</p>

        <div style={{ width: '120px', height: '1px', margin: '20px auto 24px', background: `linear-gradient(90deg, transparent, ${COLORS.gold}aa, transparent)` }} />

        <h1 style={{
          fontFamily: FONTS.display, fontWeight: 700,
          color: COLORS.offWhite,
          fontSize: isMobile ? 'clamp(1.6rem, 7vw, 2rem)' : 'clamp(2rem, 3.6vw, 2.7rem)',
          lineHeight: 1.2, letterSpacing: '-0.015em',
          margin: '0 0 12px',
        }}>
          {tr ? "Dua Dili — Yakarışın Gramatik Kalıbı" : "Language of Prayer — The Grammar of Supplication"}
        </h1>
        <p style={{
          fontFamily: FONTS.display, fontStyle: 'italic',
          color: COLORS.gold,
          fontSize: isMobile ? 'clamp(1rem, 4vw, 1.1rem)' : 'clamp(1.05rem, 1.8vw, 1.18rem)',
          margin: 0,
        }}>
          {tr ? "Fâtiha · Bakara 2:186 · 11 tematik dua" : "al-Fātiḥa · al-Baqara 2:186 · 11 thematic duʿās"}
        </p>
      </div>

      {/* Anasayfa QuranDua section AYNEN */}
      <QuranDua />
    </div>
  );
}
