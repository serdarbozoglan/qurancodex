'use client';

// ─── KorumaZinciri — Tool sayfası WRAPPER ────────────────────
// Anasayfa LivingPreservation section AYNEN render; ToolHeader + Hero ekstrası.
// Kural: içerik değiştirme, basitleştirme, görselliği azaltma — sadece enhance.

import { useEffect, useState } from 'react';
import LivingPreservation from '../sections/LivingPreservation';
import ToolHeader from './ToolHeader';
import CrossToolCTA from './CrossToolCTA';
import SourcesCitation from './SourcesCitation';
import useNavbarOffset from './useNavbarOffset';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS } from '../tokens';

export default function KorumaZinciri({ onClose }) {
  const { language } = useLanguage();
  const tr = language === 'tr';
  // paddingTop: `${navTop}px` hardcode idi — gerçek navbar yüksekliği 62'den farklı
  // olabiliyor (§13.13/§13.31 Mekanizma 2), dinamik ölçüme geçildi.
  const navTop = useNavbarOffset(0, 62);
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
      minHeight: `calc(100vh - ${navTop}px)`,
      paddingTop: `${navTop}px`,
    }}>
      <ToolHeader
        icon={
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L4 6v6c0 5 3.5 9.5 8 10 4.5-0.5 8-5 8-10V6l-8-4z"/></svg>
        }
        titleTr="Yaşayan Koruma — Sıfır Varyasyon"
        titleEn="Living Preservation — Zero Variation"
        subtitleTr="Birmingham · hâfız zinciri · isnâd"
        subtitleEn="Birmingham · ḥuffāẓ chain · isnād"
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
          اِنَّا نَحْنُ نَزَّلْنَا الذِّكْرَ وَاِنَّا لَهُ لَحَافِظُونَ
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
          &quot;{tr ? "Zikri (Kur'an'ı) Biz indirdik; koruyucusu da Biziz." : "Indeed, We sent down the Reminder, and We shall preserve it."}&quot;
        </p>
        <p style={{
          color: COLORS.silver,
          fontFamily: FONTS.body,
          fontSize: '0.7rem',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          opacity: 0.78,
          marginBottom: '24px',
        }}>— {tr ? "Hicr 15:9" : "al-Ḥijr 15:9"}</p>

        <div style={{ width: '120px', height: '1px', margin: '20px auto 24px', background: `linear-gradient(90deg, transparent, ${COLORS.gold}aa, transparent)` }} />

        <h2 style={{
          fontFamily: FONTS.display, fontWeight: 700,
          color: COLORS.offWhite,
          fontSize: isMobile ? 'clamp(1.6rem, 7vw, 2rem)' : 'clamp(2rem, 3.6vw, 2.7rem)',
          lineHeight: 1.2, letterSpacing: '-0.015em',
          margin: '0 0 12px',
        }}>
          {tr ? "Yaşayan Koruma — Sıfır Varyasyon" : "Living Preservation — Zero Variation"}
        </h2>
        <p style={{
          fontFamily: FONTS.display, fontStyle: 'italic',
          color: COLORS.gold,
          fontSize: isMobile ? 'clamp(1rem, 4vw, 1.1rem)' : 'clamp(1.05rem, 1.8vw, 1.18rem)',
          margin: 0,
        }}>
          {tr ? "Birmingham · hâfız zinciri · isnâd" : "Birmingham · ḥuffāẓ chain · isnād"}
        </p>
        {/* Framing whisper — 'sıfır varyasyon' rasm düzlemine ankrelenir; kıraat
            farklılıkları ayrı belgeli sözlü katman olarak çerçevelenir (§13 içerik hassasiyeti). */}
        <p style={{
          fontFamily: FONTS.display, fontStyle: 'italic',
          color: COLORS.silver,
          fontSize: isMobile ? 'clamp(0.9rem, 3.4vw, 0.98rem)' : 'clamp(0.95rem, 1.5vw, 1.05rem)',
          lineHeight: 1.7, maxWidth: '760px', margin: '18px auto 0',
        }}>
          {tr
            ? <>Sıfır varyasyon, tek konsonantal iskelettedir (<span style={{ color: COLORS.gold }}>rasm</span>): 1.400 yıldır her nüsha, her bölge, her nesil aynı metni taşır. <span style={{ color: COLORS.gold }}>Mütevâtir kıraat</span> farklılıkları ise bu korumanın ayrı ve belgeli sözlü katmanıdır — çelişkisi değil, kanıtı.</>
            : <>Zero variation lies in the single consonantal skeleton (<span style={{ color: COLORS.gold }}>rasm</span>): for 1,400 years every copy, region and generation carries the same text. The <span style={{ color: COLORS.gold }}>mutawātir qirāʾāt</span> differences are a separate, fully-documented oral layer of that preservation — its evidence, not its contradiction.</>}
        </p>
      </div>

      {/* Anasayfa LivingPreservation section AYNEN — memory no-downgrade */}
      <LivingPreservation />

      {/* Klasik kaynaklar — Kur'an hıfz + isnâd geleneği */}
      <div className="mq-box" style={{ maxWidth: 1080, margin: '0 auto', '--pt-d': "0", '--pt-m': "0", '--pr-d': "32px", '--pr-m': "16px", '--pb-d': "32px", '--pb-m': "24px", '--pl-d': "32px", '--pl-m': "16px" }}>
        <SourcesCitation
          language={language}
          isMobile={isMobile}
          sources={[
            {
              author: 'es-Suyûtî',
              workTr: "el-İtkān fî Ulûmi'l-Kur'an",
              workEn: 'al-Itqān fī ʿUlūm al-Qurʾān',
              period: '1445–1505 · Kahire',
              noteTr: "Kur'an ilimlerinin ansiklopedik klasiği — cem', hıfz, isnâd, yedi harf ve mütevâtir kıraatlar üzerine 80 bölüm.",
              noteEn: "Encyclopedic classic of Quranic sciences — 80 chapters on compilation, memorization, transmission, seven aḥruf, and mutawātir recitations.",
            },
            {
              author: 'ez-Zerkeşî',
              workTr: "el-Burhân fî Ulûmi'l-Kur'an",
              workEn: 'al-Burhān fī ʿUlūm al-Qurʾān',
              period: '1344–1392 · Kahire',
              noteTr: 'Suyûtî\'nin İtkān\'ına kaynaklık eden erken ansiklopedik eser — kıraat, hıfz ve resm-i mushaf disiplinleri.',
              noteEn: "Earlier encyclopedic work that fed Suyūṭī's Itqān — disciplines of qirāʾa, ḥifẓ, and mushaf orthography.",
            },
            {
              author: 'İbnü\'l-Cezerî',
              workTr: "en-Neşr fi'l-Kırâati'l-Aşr",
              workEn: 'al-Nashr fī al-Qirāʾāt al-ʿAshr',
              period: '1350–1429 · Şam/Şiraz',
              noteTr: '10 mütevâtir kıraatin cihanşümul isnâd zinciri — her kıraatın senedini Peygamber\'e (s.a.v) kadar geriye takip eder.',
              noteEn: 'Universal isnād chain for the 10 mutawātir recitations — traces each qirāʾa back to the Prophet ﷺ.',
            },
            {
              author: 'ez-Zehebî',
              workTr: "Ma'rifetu'l-Kurrâi'l-Kibâr",
              workEn: 'Maʿrifat al-Qurrāʾ al-Kibār',
              period: '1274–1348 · Şam',
              noteTr: 'Erken hâfız ve kıraat imamlarının biyografik zinciri — nesillerin isnâd köprüsünü belgeler.',
              noteEn: "Biographical chain of early ḥuffāẓ and qirāʾa imams — documents the isnād bridge across generations.",
            },
          ]}
        />
      </div>

      {/* CrossToolCTA — hâfız chain + kıraat varyantları + nüzul bağlamı */}
      <div className="mq-box" style={{ maxWidth: 1080, margin: '0 auto', '--pt-d': "0", '--pt-m': "0", '--pr-d': "32px", '--pr-m': "16px", '--pb-d': "100px", '--pb-m': "80px", '--pl-d': "32px", '--pl-m': "16px" }}>
        <CrossToolCTA
          language={language}
          isMobile={isMobile}
          links={[
            {
              href: '/oku',
              titleTr: "Kur'an'ı Oku",
              titleEn: 'Read the Quran',
              descTr: 'Hâfız zincirinin bugün de sürdüğü canlı tecrübe — 114 sûre, çoklu meal + tefsir.',
              descEn: 'The living experience carried by the huffāẓ chain today — 114 sūras, multi-meal + tafsir.',
            },
            {
              href: `/${language}/atlas/kiraat`,
              titleTr: 'Kıraat Atlası',
              titleEn: 'Qirāʾāt Atlas',
              descTr: '10 imam · 20 râvî · coğrafi dağılım — sıfır-varyasyon prensibinin canlı manzarası.',
              descEn: '10 readers · 20 transmitters · geographic spread — the living face of the zero-variation principle.',
            },
            {
              href: `/${language}/arac/sebebi-nuzul`,
              titleTr: 'Sebeb-i Nüzûl',
              titleEn: 'Occasions of Revelation',
              descTr: 'Ayetlerin ilk inişindeki bağlam — koruma zincirinin başlangıç noktası.',
              descEn: 'The context of each verse\'s first descent — the starting point of the preservation chain.',
            },
          ]}
        />
      </div>
    </div>
  );
}
