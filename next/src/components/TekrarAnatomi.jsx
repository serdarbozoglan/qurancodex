'use client';

// ─── TekrarAnatomi — Tool sayfası WRAPPER ────────────────────
// Anasayfa ZeroRedundancy section AYNEN render; ToolHeader + Hero ekstrası.
// Kural: içerik değiştirme, basitleştirme, görselliği azaltma — sadece enhance.

import { useEffect, useState } from 'react';
import ZeroRedundancy from '../sections/ZeroRedundancy';
import ToolHeader from './ToolHeader';
import CrossToolCTA from './CrossToolCTA';
import SourcesCitation from './SourcesCitation';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS } from '../tokens';

export default function TekrarAnatomi({ onClose }) {
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
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
        }
        titleTr="Sıfır Gereksizlik — Her Kelime Bir Görev"
        titleEn="Zero Redundancy — Every Word Has a Task"
        subtitleTr="Rahmân 31x · Mürselât 10x · Kamer 4x"
        subtitleEn="ar-Raḥmān 31x · al-Mursalāt 10x · al-Qamar 4x"
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
          فَبِاَيِّ اٰلَٓاءِ رَبِّكُمَا تُكَذِّبَانِ
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
          "{tr ? "O halde Rabbinizin hangi nimetlerini yalanlayabilirsiniz?" : "Then which of the favors of your Lord will you deny?"}"
        </p>
        <p style={{
          color: COLORS.silver,
          fontFamily: FONTS.body,
          fontSize: '0.7rem',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          opacity: 0.78,
          marginBottom: '24px',
        }}>— {tr ? "Rahmân 55 (31 kez)" : "ar-Raḥmān 55 (31 times)"}</p>

        <div style={{ width: '120px', height: '1px', margin: '20px auto 24px', background: `linear-gradient(90deg, transparent, ${COLORS.gold}aa, transparent)` }} />

        <h2 style={{
          fontFamily: FONTS.display, fontWeight: 700,
          color: COLORS.offWhite,
          fontSize: isMobile ? 'clamp(1.6rem, 7vw, 2rem)' : 'clamp(2rem, 3.6vw, 2.7rem)',
          lineHeight: 1.2, letterSpacing: '-0.015em',
          margin: '0 0 12px',
        }}>
          {tr ? "Sıfır Gereksizlik — Her Kelime Bir Görev" : "Zero Redundancy — Every Word Has a Task"}
        </h2>
        <p style={{
          fontFamily: FONTS.display, fontStyle: 'italic',
          color: COLORS.gold,
          fontSize: isMobile ? 'clamp(1rem, 4vw, 1.1rem)' : 'clamp(1.05rem, 1.8vw, 1.18rem)',
          margin: 0,
        }}>
          {tr ? "Rahmân 31x · Mürselât 10x · Kamer 4x" : "ar-Raḥmān 31x · al-Mursalāt 10x · al-Qamar 4x"}
        </p>
      </div>

      {/* Anasayfa ZeroRedundancy section AYNEN */}
      <ZeroRedundancy />

      <div style={{ padding: isMobile ? '0 16px 40px' : '0 32px 56px', maxWidth: '1200px', margin: '0 auto' }}>
        <SourcesCitation
          language={language} isMobile={isMobile}
          sources={[
            { author: 'ez-Zerkeşî',   workTr: "el-Burhân fî Ulûmi'l-Kur'ân",   workEn: "al-Burhān fī ʿUlūm al-Qur'ān", period: '1344–1392 (Kahire)',  noteTr: 'Kur\'ân ilimlerinin klasik özeti — iltifât ve tekrarın belağî çerçevesi.',                   noteEn: "Classical summary of Qur'anic sciences — the rhetorical frame of iltifāt and repetition." },
            { author: 'es-Suyûtî',    workTr: "el-İtkân fî Ulûmi'l-Kur'ân",    workEn: "al-Itqān fī ʿUlūm al-Qur'ān",  period: '1445–1505 (Kahire)',    noteTr: 'Zerkeşî\'nin geliştirilmiş halefi — tekrarın türleri (tekrîr, iltifât, tavdih) sistemli katalog.', noteEn: "Zarkashī's developed successor — a systematic catalogue of repetition types (takrīr, iltifāt, tawḍīḥ)." },
            { author: 'ez-Zamahşerî', workTr: 'el-Keşşâf',                      workEn: 'al-Kashshāf',                  period: '1075–1144 (Hârizm)',     noteTr: 'Belağî tefsirin zirvesi — iltifâtın klasik örneklerinin analizi.',                            noteEn: 'The pinnacle of rhetorical exegesis — analysis of classical examples of iltifāt.' },
            { author: 'er-Râzî',      workTr: "Mefâtîhu'l-Ğayb",                workEn: 'Mafātīḥ al-Ghayb',             period: '1149–1209 (Rey)',        noteTr: 'Rahmân sûresindeki refrenin (31 kez) klasik yorumu — vurgu ve hitap anlamları.',              noteEn: 'Classical commentary on the refrain in Sūrat al-Raḥmān (31 times) — emphasis and address readings.' },
          ]}
        />

        <CrossToolCTA
          language={language} isMobile={isMobile}
          links={[
            { href: `/${language}/arac/halka-kompozisyon`, titleTr: 'Halka Kompozisyon', titleEn: 'Ring Composition', descTr: 'Refrenin geometrik karşılığı — sûre-içi ayna simetrisi.', descEn: 'The geometric counterpart of refrain — intra-surah mirror symmetry.' },
            { href: `/${language}/arac/retorik`, titleTr: "Kur'ân'ın Belağatı", titleEn: "Rhetoric of the Qur'an", descTr: 'İltifât ve tekrar — belağatın canlı dokusu.', descEn: 'Iltifāt and repetition — the living tissue of Qur\'anic eloquence.' },
            { href: `/${language}/arac/mukattaa`, titleTr: 'Huruf-i Mukattaâ', titleEn: 'Mukattaʿāt', descTr: '29 sûrede tekrar eden 14 harf — tekrarın dilsel çekirdeği.', descEn: '14 letters recurring in 29 suras — the linguistic kernel of repetition.' },
          ]}
        />
      </div>
    </div>
  );
}
