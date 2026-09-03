'use client';

// ─── HalkaKompozisyon — Tool sayfası WRAPPER ────────────────────
// Anasayfa HiddenArchitecture section AYNEN render; ToolHeader + Hero ekstrası.
// Kural: içerik değiştirme, basitleştirme, görselliği azaltma — sadece enhance.

import { useEffect, useState } from 'react';
import HiddenArchitecture from '../sections/HiddenArchitecture';
import RingExtensions from './RingExtensions';
import ToolHeader from './ToolHeader';
import CrossToolCTA from './CrossToolCTA';
import SourcesCitation from './SourcesCitation';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS } from '../tokens';

export default function HalkaKompozisyon({ onClose }) {
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
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1" fill="currentColor"/></svg>
        }
        titleTr="Yapısal Mimari — Halka Kompozisyon"
        titleEn="Hidden Architecture — Ring Composition"
        subtitleTr="Fâtiha · Âyetel Kürsî · ayna simetrisi"
        subtitleEn="al-Fātiḥa · Āyat al-Kursī · mirror symmetry"
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
          اَلْحَمْدُ لِلّٰهِ رَبِّ الْعَالَمِينَ
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
          &quot;{tr ? "Hamd, âlemlerin Rabbi Allah'a mahsustur." : "All praise belongs to Allah, Lord of the worlds."}&quot;
        </p>
        <p style={{
          color: COLORS.silver,
          fontFamily: FONTS.body,
          fontSize: '0.7rem',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          opacity: 0.78,
          marginBottom: '24px',
        }}>— {tr ? "Fâtiha 1:2" : "al-Fātiḥa 1:2"}</p>

        <div style={{ width: '120px', height: '1px', margin: '20px auto 24px', background: `linear-gradient(90deg, transparent, ${COLORS.gold}aa, transparent)` }} />

        <h2 className="mq-fs" style={{
          fontFamily: FONTS.display, fontWeight: 700,
          color: COLORS.offWhite,
          '--fs-d': 'clamp(2rem, 3.6vw, 2.7rem)', '--fs-m': 'clamp(1.6rem, 7vw, 2rem)',
          lineHeight: 1.2, letterSpacing: '-0.015em',
          margin: '0 0 12px',
        }}>
          {tr ? "Yapısal Mimari — Halka Kompozisyon" : "Hidden Architecture — Ring Composition"}
        </h2>
        <p className="mq-fs" style={{
          fontFamily: FONTS.display, fontStyle: 'italic',
          color: COLORS.gold,
          '--fs-d': 'clamp(1.05rem, 1.8vw, 1.18rem)', '--fs-m': 'clamp(1rem, 4vw, 1.1rem)',
          margin: 0,
        }}>
          {tr ? "Fâtiha · Âyetel Kürsî · ayna simetrisi" : "al-Fātiḥa · Āyat al-Kursī · mirror symmetry"}
        </p>
      </div>

      {/* Anasayfa HiddenArchitecture section AYNEN */}
      <HiddenArchitecture />

      {/* Genişletilmiş: Fatiha SVG halka + 4 ek örnek + Cuypers/Farrin */}
      <RingExtensions language={language} isMobile={isMobile} />

      <div className="mq-box" style={{ '--pt-d': "0", '--pt-m': "0", '--pr-d': "32px", '--pr-m': "16px", '--pb-d': "56px", '--pb-m': "40px", '--pl-d': "32px", '--pl-m': "16px", maxWidth: '1200px', margin: '0 auto' }}>
        <SourcesCitation
          language={language} isMobile={isMobile}
          sources={[
            { author: 'el-Bikâî',        workTr: "Nazmü'd-Dürer fî Tenâsübi'l-Âyi ve's-Süver", workEn: "Naẓm al-Durar fī Tanāsub al-Āy wa al-Suwar", period: '1406–1480 (Şâm)',    noteTr: 'Klasik münâsebât + sûre-içi tenâsüb — halka/simetri okumasının klasik zirvesi.', noteEn: 'Classical munāsabāt + intra-sura tanāsub — the classical peak of ring/symmetry reading.' },
            { author: 'es-Suyûtî',       workTr: "Tenâsuku'd-Dürer fî Tenâsübi's-Süver",       workEn: "Tanāsuq al-Durar fī Tanāsub al-Suwar",       period: '1445–1505 (Kahire)', noteTr: "Sûreler arası ve içi tenâsüb üzerine özel monografi.",                            noteEn: 'A dedicated monograph on inter- and intra-sura tanāsub.' },
            { author: 'er-Râzî',         workTr: "Mefâtîhu'l-Ğayb",                            workEn: 'Mafātīḥ al-Ghayb',                            period: '1149–1209 (Rey)',    noteTr: 'Klasik tefsirde tenâsübün ilk sistemli işleyicilerinden — halka yaklaşımının erken izleri.', noteEn: 'One of the earliest systematic classical treatments of tanāsub — early traces of the ring approach.' },
            { author: 'Raymond Farrin',  workTr: 'Structure and Qur\'anic Interpretation',      workEn: "Structure and Qur'anic Interpretation",      period: '2014 (Kuveyt)',      noteTr: 'Halka kompozisyonun çağdaş metodolojik referansı — Fâtiha ve Bakara üzerine analiz.',        noteEn: 'The contemporary methodological reference for ring composition — analysis of al-Fātiḥa and al-Baqara.' },
            { author: 'Nouman Ali Khan · Sharif Randhawa', workTr: 'Divine Speech', workEn: 'Divine Speech', period: '2016 (Bayyinah Institute)', noteTr: 'Âyetü\'l-Kürsî, Kâria ve Yûsuf halkaları + Ferâhî/Islâhî\'nin sûre-çiftleri teorisi için ana kaynak.', noteEn: 'Primary source for the Āyat al-Kursī, al-Qāriʿah, and Yūsuf rings, plus Farahi/Islahi\'s theory of surah pairs.' },
          ]}
        />

        <CrossToolCTA
          language={language} isMobile={isMobile}
          links={[
            { href: `/${language}/atlas/munasebat`, titleTr: 'Münasebât Atlası', titleEn: 'Atlas of Surah Coherence', descTr: 'Sûreler arası bağ — halka kompozisyonunun makro karşılığı.', descEn: 'Inter-surah coherence — the macro counterpart of ring composition.' },
            { href: `/${language}/arac/tekrar-anatomi`, titleTr: 'Tekrar Anatomisi', titleEn: 'Anatomy of Repetition', descTr: 'İltifât, refren, çekirdek kelime — halkanın ritmik izleri.', descEn: 'Iltifāt, refrain, kernel word — the rhythmic traces of the ring.' },
            { href: `/${language}/arac/mukattaa`, titleTr: 'Huruf-i Mukattaâ', titleEn: 'Mukattaʿāt', descTr: '14 açılış harfi — sûre mimarîsinin dilsel imzası.', descEn: '14 opening letters — the linguistic signature of surah architecture.' },
          ]}
        />
      </div>
    </div>
  );
}
