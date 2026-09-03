'use client';

// ─── Mukattaa — Tool sayfası WRAPPER ──────────────────────────────────────────
// Kullanıcı kuralı (2026-06-15 gece):
//   "Yeni sayfaya taşısan bile ANASAYFADAKİ aynı içeriği taşı — basitleştirme,
//    değiştirme. Sadece Hero section ekleyebilirsin diğer sayfalar gibi."
//
// Pattern: ToolHeader + Cinematic Hero (Bismillah + anchor verse + framing +
// filigree + eyebrow + title + subtitle) + <LinguisticDNA /> aynen.
// İçerik tek kaynak (DRY): /sections/LinguisticDNA.jsx
// ──────────────────────────────────────────────────────────────────────────────

import LinguisticDNA from '../sections/LinguisticDNA';
import ToolHeader from './ToolHeader';
import CrossToolCTA from './CrossToolCTA';
import SourcesCitation from './SourcesCitation';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS } from '../tokens';
import { useEffect, useState } from 'react';

export default function Mukattaa({ onClose }) {
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
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="1.8" strokeLinecap="round">
            <circle cx="12" cy="12" r="1.6" fill={COLORS.gold} stroke="none" />
            <ellipse cx="12" cy="12" rx="10" ry="4.5" />
            <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(60 12 12)" />
            <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(120 12 12)" />
          </svg>
        }
        titleTr="Huruf-i Mukattaâ"
        titleEn="Mukattaʿāt"
        subtitleTr="Kur'an'ın dilsel DNA'sı · 14 harf · 29 sûre"
        subtitleEn="The Quran's linguistic DNA · 14 letters · 29 suras"
        language={language}
        onClose={onClose}
      />

      {/* Cinematic Hero — sadece tool sayfası bağlamı için, içerik AYNEN aşağıda */}
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
          الٓمٓ · ذٰلِكَ الْكِتَابُ لَا رَيْبَ فِيهِ
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
          &quot;{tr
            ? 'Elif-Lâm-Mîm. İşte o Kitap — şüphesiz onda — muttakîlere bir hidayet.'
            : 'Alif-Lām-Mīm. That is the Book — no doubt in it — a guidance for the God-conscious.'}&quot;
        </p>
        <p style={{
          color: COLORS.silver,
          fontFamily: FONTS.body,
          fontSize: '0.7rem',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          opacity: 0.78,
          marginBottom: '24px',
        }}>
          — {tr ? 'Bakara 2:1-2' : 'al-Baqara 2:1-2'}
        </p>

        <div style={{ width: '120px', height: '1px', margin: '20px auto 24px', background: `linear-gradient(90deg, transparent, ${COLORS.gold}aa, transparent)` }} />

        <div style={{
          fontSize: '0.72rem',
          fontFamily: FONTS.body,
          fontWeight: 700,
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: COLORS.gold,
          opacity: 0.75,
          marginBottom: '14px',
        }}>
          {tr ? 'DİLSEL DNA · 1.400 YIL · 14 HARF' : 'LINGUISTIC DNA · 1,400 YEARS · 14 LETTERS'}
        </div>

        <h2 className="mq-fs" style={{
          fontFamily: FONTS.display,
          fontWeight: 700,
          color: COLORS.offWhite,
          '--fs-d': 'clamp(2rem, 3.6vw, 2.7rem)', '--fs-m': 'clamp(1.6rem, 7vw, 2rem)',
          lineHeight: 1.2,
          letterSpacing: '-0.015em',
          margin: '0 0 12px',
        }}>
          {tr ? "Huruf-i Mukattaâ — Kur'an'ın Dilsel DNA'sı" : "Mukattaʿāt — The Linguistic DNA of the Qur'an"}
        </h2>
        <p className="mq-fs" style={{
          fontFamily: FONTS.display,
          fontStyle: 'italic',
          color: COLORS.gold,
          '--fs-d': 'clamp(1.05rem, 1.8vw, 1.18rem)', '--fs-m': 'clamp(1rem, 4vw, 1.1rem)',
          margin: 0,
        }}>
          {tr ? '14 harf · 29 sûre · 4 aile · 1 ortak imza' : '14 letters · 29 suras · 4 families · 1 shared signature'}
        </p>
      </div>

      {/* Anasayfa LinguisticDNA section AYNEN — kısaltma yok, değişiklik yok */}
      <LinguisticDNA />

      <div className="mq-box" style={{ '--pt-d': "0", '--pt-m': "0", '--pr-d': "32px", '--pr-m': "16px", '--pb-d': "56px", '--pb-m': "40px", '--pl-d': "32px", '--pl-m': "16px", maxWidth: '1200px', margin: '0 auto' }}>
        <SourcesCitation
          language={language} isMobile={isMobile}
          sources={[
            { author: 'es-Suyûtî',    workTr: "el-İtkân fî Ulûmi'l-Kur'ân",   workEn: "al-Itqān fī ʿUlūm al-Qur'ān", period: '1445–1505 (Kahire)',    noteTr: 'Kur\'ân ilimlerinin ansiklopedik özeti — mukattaʿâta özel bölüm ve klasik yorum katalogu.', noteEn: "Encyclopedic summary of Qur'anic sciences — a dedicated section on mukattaʿāt cataloguing classical readings." },
            { author: 'er-Râzî',      workTr: "Mefâtîhu'l-Ğayb",              workEn: 'Mafātīḥ al-Ghayb',            period: '1149–1209 (Rey)',        noteTr: 'Mukattaa harfleri üzerine 20+ klasik görüşü sıralayan en kapsamlı klasik tefsir.',           noteEn: 'The most comprehensive classical commentary — enumerates 20+ scholarly opinions on mukattaʿāt letters.' },
            { author: 'ez-Zamahşerî', workTr: 'el-Keşşâf',                    workEn: 'al-Kashshāf',                 period: '1075–1144 (Hârizm)',     noteTr: 'Muʿtezilî belağî okuma — mukattaʿâtın dilsel işaret olarak yorumu.',                          noteEn: 'Muʿtazilite rhetorical reading — interpreting mukattaʿāt as a linguistic sign.' },
            { author: 'İbn Kesîr',    workTr: "Tefsîru'l-Kur'âni'l-Azîm",     workEn: "Tafsīr al-Qur'ān al-ʿAẓīm",   period: '1301–1373 (Dımaşk)',     noteTr: 'Selef görüşü — "Allah bilir" tavrı ve rivayet ağırlıklı yaklaşım.',                             noteEn: 'The salaf position — the "Allah knows best" stance and a riwāya-heavy approach.' },
          ]}
        />

        <CrossToolCTA
          language={language} isMobile={isMobile}
          links={[
            { href: `/${language}/arac/halka-kompozisyon`, titleTr: 'Halka Kompozisyon', titleEn: 'Ring Composition', descTr: 'Sûrelerin ayna simetrisi — Fatiha\'nın halka yapısı ve makro-örüntüler.', descEn: 'The mirror symmetry of suras — Fātiḥa\'s ring structure and macro-patterns.' },
            { href: `/${language}/atlas/munasebat`, titleTr: 'Münasebât Atlası', titleEn: 'Atlas of Surah Coherence', descTr: 'Sûreler arası bağ — Razi geleneği ve mukattaa dizilişi.', descEn: 'Inter-surah coherence — the Razi tradition and mukattaʿāt sequence.' },
            { href: `/${language}/arac/tekrar-anatomi`, titleTr: 'Tekrar Anatomisi', titleEn: 'Anatomy of Repetition', descTr: 'Kur\'ân\'ın tekrar mimarîsi — iltifât, refren, çekirdek kelime.', descEn: 'The Qur\'an\'s architecture of repetition — iltifāt, refrain, kernel word.' },
          ]}
        />
      </div>
    </div>
  );
}
