'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS, GLASS_CARD, TEXT, TRANSITION } from '../tokens';

// ── Sabit veriler ────────────────────────────────────────────────────────────

// Şûrâ 42:11 — hero anchor ayeti (sabit, JSON'da gereksiz)
const HERO_VERSE = {
  arabic: 'لَيْسَ كَمِثْلِهِۦ شَىْءٌ ۖ وَهُوَ ٱلسَّمِيعُ ٱلْبَصِيرُ',
  tr: "O'nun benzeri hiçbir şey yoktur. O hakkıyla işitendir, hakkıyla görendir.",
  en: "There is nothing like Him, and He is the All-Hearing, the All-Seeing.",
  ref: 'Şûrâ 42:11',
  refEn: 'Shūrā 42:11',
};

// Allah lemma şeffaflık sabitleri (Spec §6)
const ALLAH_CLASSIC_COUNT = 2699;   // M. Fuâd Abdülbâkî, lemma sayımı
const ALLAH_SURFACE_COUNT = 1813;   // JSON'daki yüzey lafz sayımı

// ── Styles ────────────────────────────────────────────────────────────────────

const sectionLabel = {
  color: `${COLORS.gold}99`,
  fontSize: '0.7rem',
  fontFamily: FONTS.body,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.18em',
  marginBottom: '20px',
};

// ── Main component ─────────────────────────────────────────────────────────────

export default function EsmaFrekans({ onClose }) {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const [data, setData] = useState(null);
  const [beyanlari, setBeyanlari] = useState(null);

  // Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape' && onClose) onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Load data
  useEffect(() => {
    fetch('/esma-frekans.json').then(r => r.json()).then(setData).catch(e => console.error('[EsmaFrekans]', e));
    fetch('/esma-beyanlari.json').then(r => r.json()).then(setBeyanlari).catch(e => console.error('[EsmaBeyanlari]', e));
  }, []);

  return (
    <div style={{
      background: COLORS.cosmicBlack,
      minHeight: 'calc(100vh - 62px)',
      paddingTop: '62px',
    }}>
      {/* ═══ SECTION 1: HERO ═══ */}
      <Hero tr={tr} />

      {/* ═══ SECTION 2: MANIFESTO ═══ */}
      <Manifesto tr={tr} />

      {/* ═══ SECTION 3: FLAGSHIP PASAJLAR ═══ */}
      <FlagshipVerses tr={tr} />

      {/* ═══ SECTION 4: FREKANS MANZARASI ═══ */}
      <FrequencyLandscape data={data} tr={tr} />

      {/* ═══ SECTION 5: VAHYİN SESİ ═══ */}
      <DivineVoice beyanlari={beyanlari} tr={tr} />

      {/* ═══ SECTION 6: 114 İSİM ATLASI ═══ */}
      <NamesAtlas data={data} tr={tr} />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SECTION 1: HERO — Şûrâ 42:11 + Çift-katman başlık + 4 temel ayet
// ═════════════════════════════════════════════════════════════════════════════

function Hero({ tr }) {
  return (
    <section style={{
      minHeight: 'calc(100vh - 62px)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '40px 24px 60px',
      position: 'relative',
    }}>
      {/* Bismillah ornamenti */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 0.6, scale: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        style={{
          fontFamily: FONTS.quran,
          fontSize: '1.4rem',
          color: COLORS.gold,
          marginBottom: '60px',
          textAlign: 'center',
        }}
        dir="rtl"
        lang="ar"
      >
        ﷽
      </motion.div>

      {/* Şûrâ 42:11 — hero verse */}
      <motion.blockquote
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.2 }}
        cite="https://quran.com/42/11"
        style={{
          margin: '0 0 50px',
          textAlign: 'center',
          maxWidth: '780px',
        }}
      >
        <p
          dir="rtl"
          lang="ar"
          style={{
            fontFamily: FONTS.quran,
            fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
            color: COLORS.gold,
            lineHeight: 2.2,
            margin: '0 0 18px',
          }}
        >
          {HERO_VERSE.arabic}
        </p>
        <p style={{
          color: COLORS.offWhite,
          fontFamily: FONTS.display,
          fontStyle: 'italic',
          fontSize: 'clamp(1rem, 2.4vw, 1.25rem)',
          lineHeight: 1.6,
          margin: '0 0 8px',
        }}>
          "{tr ? HERO_VERSE.tr : HERO_VERSE.en}"
        </p>
        <p style={{
          color: COLORS.silver,
          fontFamily: FONTS.body,
          fontSize: '0.85rem',
          letterSpacing: '0.08em',
          margin: 0,
        }}>
          — {tr ? HERO_VERSE.ref : HERO_VERSE.refEn}
        </p>
      </motion.blockquote>

      {/* Çift-katman başlık */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.5 }}
        style={{ textAlign: 'center', marginBottom: '40px' }}
      >
        <h1 style={{
          fontFamily: FONTS.display,
          fontWeight: 900,
          fontSize: 'clamp(2.4rem, 7vw, 5rem)',
          color: COLORS.offWhite,
          letterSpacing: '-0.02em',
          lineHeight: 1,
          margin: '0 0 14px',
        }}>
          {tr ? 'ESMÂ-İ HÜSNÂ' : 'THE BEAUTIFUL NAMES'}
        </h1>
        <p style={{
          fontFamily: FONTS.display,
          fontStyle: 'italic',
          fontSize: 'clamp(1.05rem, 2.4vw, 1.5rem)',
          color: COLORS.silver,
          fontWeight: 400,
          margin: 0,
        }}>
          {tr ? "Allah'ın Kur'an'da Kendini Tanıtması" : 'How God Describes Himself in the Quran'}
        </p>
      </motion.div>

      {/* 4 temel ayet — placeholder; veri Task 8.2'de bağlanacak */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.8 }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '12px',
          maxWidth: '780px',
          width: '100%',
          marginBottom: '40px',
        }}
      >
        {['A\'râf 7:180', 'İsrâ 17:110', 'Tâhâ 20:8', 'Haşr 59:24'].map((ref) => (
          <div key={ref} style={{
            ...GLASS_CARD,
            padding: '14px 12px',
            textAlign: 'center',
          }}>
            <div style={{ ...sectionLabel, marginBottom: '6px', fontSize: '0.62rem' }}>
              {ref}
            </div>
            <div style={{ color: COLORS.silver, fontSize: '0.78rem', fontFamily: FONTS.body, lineHeight: 1.4 }}>
              {tr ? '"En güzel isimler O\'nundur"' : '"The most beautiful names belong to Him"'}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Sayaç şeridi */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ duration: 0.9, delay: 1.1 }}
        style={{
          color: COLORS.silver,
          fontFamily: FONTS.body,
          fontSize: '0.85rem',
          letterSpacing: '0.12em',
          textAlign: 'center',
        }}
      >
        {tr ? '114 isim · 6.236 âyet · 1 mimar' : '114 names · 6,236 verses · one architect'}
      </motion.div>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SECTION 2: MANIFESTO — Celal ↔ Cemal dengesi
// ═════════════════════════════════════════════════════════════════════════════

// Editoryal sınıflandırma — temsili 5-6 isim her sütunda
const CELAL_NAMES = [
  { ar: 'ٱلْجَبَّار',   tr: 'El-Cebbâr',     en: 'al-Jabbār'     },
  { ar: 'ٱلْقَهَّار',   tr: 'El-Kahhâr',     en: 'al-Qahhār'     },
  { ar: 'ٱلْعَزِيز',    tr: 'El-Azîz',       en: 'al-ʿAzīz'      },
  { ar: 'ٱلْمُتَكَبِّر', tr: 'El-Mütekebbir', en: 'al-Mutakabbir' },
  { ar: 'ٱلْمُنْتَقِم',  tr: 'El-Müntekim',   en: 'al-Muntaqim'   },
  { ar: 'ذُو ٱلْجَلَال', tr: "Zü'l-Celâl",    en: "Dhū'l-Jalāl"   },
];

const CEMAL_NAMES = [
  { ar: 'ٱلرَّحْمَٰن',  tr: 'Er-Rahmân',     en: 'ar-Raḥmān'     },
  { ar: 'ٱلرَّحِيم',    tr: 'Er-Rahîm',      en: 'ar-Raḥīm'      },
  { ar: 'ٱلْوَدُود',    tr: 'El-Vedûd',      en: 'al-Wadūd'      },
  { ar: 'ٱللَّطِيف',    tr: 'El-Latîf',      en: 'al-Laṭīf'      },
  { ar: 'ٱلرَّؤُوف',    tr: 'Er-Raûf',       en: 'ar-Raʾūf'      },
  { ar: 'ٱلْغَفُور',    tr: 'El-Gafûr',      en: 'al-Ghafūr'     },
];

function Manifesto({ tr }) {
  return (
    <section style={{
      padding: '80px 24px',
      background: 'linear-gradient(180deg, ' + COLORS.cosmicBlack + ' 0%, #0d1b2a 50%, ' + COLORS.cosmicBlack + ' 100%)',
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={sectionLabel}>{tr ? 'Manifesto' : 'Manifesto'}</div>
        <h2 style={{
          fontFamily: FONTS.display,
          fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
          color: COLORS.offWhite,
          fontWeight: 700,
          margin: '0 0 16px',
          maxWidth: '600px',
        }}>
          {tr ? 'Celal ↔ Cemal' : 'Jalāl ↔ Jamāl'}
        </h2>
        <p style={{
          color: COLORS.silver,
          fontFamily: FONTS.body,
          fontSize: '1.1rem',
          lineHeight: 1.8,
          maxWidth: '720px',
          marginBottom: '50px',
        }}>
          {tr
            ? "Allah kendini ne uzak ve korkulan bir güç, ne de tek başına bir sığınak olarak tanıtır. Kur'an'ın ilah tasavvuru bir dengedir — sarsılmaz kudret (Celal) ve sığınılacak şefkat (Cemal) bir arada."
            : "God describes Himself neither as a distant feared power nor as a sole refuge. The Quran's vision of divinity is a balance — unshakable might (Jalāl) and embracing mercy (Jamāl) together."}
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
        }}>
          <ColumnCelal tr={tr} />
          <ColumnCemal tr={tr} />
        </div>

        <p style={{
          marginTop: '40px',
          color: COLORS.silver,
          fontFamily: FONTS.body,
          fontSize: '0.78rem',
          fontStyle: 'italic',
          lineHeight: 1.6,
          opacity: 0.7,
        }}>
          {tr
            ? 'Bu sınıflandırma anlatısal bir denge gösterimi için yapılmıştır; bir isim hem celâl hem cemal boyutuna sahip olabilir.'
            : 'This classification is for narrative balance only; a single name can carry both Jalāl and Jamāl dimensions.'}
        </p>
      </div>
    </section>
  );
}

function ColumnCelal({ tr }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.7 }}
      style={{
        ...GLASS_CARD,
        background: 'linear-gradient(135deg, rgba(45,52,80,0.4), rgba(255,255,255,0.04))',
        border: '1px solid rgba(150,160,200,0.18)',
        padding: '28px 24px',
      }}
    >
      <div style={{
        color: '#a8b5d4',
        fontFamily: FONTS.body,
        fontSize: '0.72rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.18em',
        marginBottom: '8px',
      }}>
        {tr ? 'Celal' : 'Jalāl'}
      </div>
      <div style={{
        color: COLORS.silver,
        fontFamily: FONTS.body,
        fontSize: '0.78rem',
        fontStyle: 'italic',
        marginBottom: '24px',
      }}>
        {tr ? 'Sarsılmaz yücelik ve kudret' : 'Unshakable might and majesty'}
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {CELAL_NAMES.map(n => (
          <li key={n.tr} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <span dir="rtl" lang="ar" style={{ fontFamily: FONTS.quran, fontSize: '1.2rem', color: '#c4d0ea' }}>
              {n.ar}
            </span>
            <span style={{ fontFamily: FONTS.body, fontSize: '0.85rem', color: COLORS.silver }}>
              {tr ? n.tr : n.en}
            </span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

function ColumnCemal({ tr }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.7 }}
      style={{
        ...GLASS_CARD,
        background: 'linear-gradient(135deg, rgba(26,122,76,0.18), rgba(212,165,116,0.06))',
        border: `1px solid ${COLORS.softGoldAlpha30}`,
        padding: '28px 24px',
      }}
    >
      <div style={{
        color: COLORS.gold,
        fontFamily: FONTS.body,
        fontSize: '0.72rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.18em',
        marginBottom: '8px',
      }}>
        {tr ? 'Cemal' : 'Jamāl'}
      </div>
      <div style={{
        color: COLORS.silver,
        fontFamily: FONTS.body,
        fontSize: '0.78rem',
        fontStyle: 'italic',
        marginBottom: '24px',
      }}>
        {tr ? 'Sığınılacak şefkat ve sevgi' : 'Embracing mercy and love'}
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {CEMAL_NAMES.map(n => (
          <li key={n.tr} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <span dir="rtl" lang="ar" style={{ fontFamily: FONTS.quran, fontSize: '1.2rem', color: COLORS.gold }}>
              {n.ar}
            </span>
            <span style={{ fontFamily: FONTS.body, fontSize: '0.85rem', color: COLORS.silver }}>
              {tr ? n.tr : n.en}
            </span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SECTION 3: FLAGSHIP PASAJLAR — Âyetü'l-Kürsî · Haşr 59:22-24 · İhlâs 112
// ═════════════════════════════════════════════════════════════════════════════

const AYET_KURSI = {
  ref: 'Bakara 2:255',
  refEn: 'Baqara 2:255',
  title: 'Âyetü\'l-Kürsî',
  titleEn: 'Āyat al-Kursī',
  intro: 'Allah\'ın zatını uyuklamayan, tüm evreni canlı tutan sarsılmaz bir güç olarak tanımlayan en meşhur ayet.',
  introEn: 'The most famous verse describing God as the unsleeping, ever-sustaining power who holds all existence.',
  arabic: 'ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ ۚ لَا تَأْخُذُهُۥ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُۥ مَا فِى ٱلسَّمَٰوَٰتِ وَمَا فِى ٱلْأَرْضِ ۗ مَن ذَا ٱلَّذِى يَشْفَعُ عِندَهُۥٓ إِلَّا بِإِذْنِهِۦ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَىْءٍ مِّنْ عِلْمِهِۦٓ إِلَّا بِمَا شَآءَ ۚ وَسِعَ كُرْسِيُّهُ ٱلسَّمَٰوَٰتِ وَٱلْأَرْضَ ۖ وَلَا يَـُٔودُهُۥ حِفْظُهُمَا ۚ وَهُوَ ٱلْعَلِىُّ ٱلْعَظِيمُ',
  highlighted: [
    { ar: 'ٱللَّهُ',     tr: 'Allah',     en: 'Allah'        },
    { ar: 'ٱلْحَىُّ',     tr: 'El-Hayy',    en: 'al-Ḥayy'     },
    { ar: 'ٱلْقَيُّومُ',  tr: 'El-Kayyûm',  en: 'al-Qayyūm'   },
    { ar: 'ٱلْعَلِىُّ',   tr: 'El-Aliyy',   en: 'al-ʿAlī'     },
    { ar: 'ٱلْعَظِيمُ',   tr: 'El-Azîm',    en: 'al-ʿAẓīm'    },
  ],
};

const HASR_VERSE = {
  ref: 'Haşr 59:22-24',
  refEn: 'Ḥashr 59:22-24',
  title: 'Haşr 59:22-24',
  titleEn: 'Ḥashr 59:22-24',
  intro: "Kur'an'daki en yoğun ilahi isim pasajı — 13 isim peş peşe.",
  introEn: "The densest passage of divine names in the Quran — 13 names in succession.",
  arabic: 'هُوَ ٱللَّهُ ٱلَّذِى لَآ إِلَٰهَ إِلَّا هُوَ ۖ عَٰلِمُ ٱلْغَيْبِ وَٱلشَّهَٰدَةِ ۖ هُوَ ٱلرَّحْمَٰنُ ٱلرَّحِيمُ ۝ هُوَ ٱللَّهُ ٱلَّذِى لَآ إِلَٰهَ إِلَّا هُوَ ٱلْمَلِكُ ٱلْقُدُّوسُ ٱلسَّلَٰمُ ٱلْمُؤْمِنُ ٱلْمُهَيْمِنُ ٱلْعَزِيزُ ٱلْجَبَّارُ ٱلْمُتَكَبِّرُ ۚ سُبْحَٰنَ ٱللَّهِ عَمَّا يُشْرِكُونَ ۝ هُوَ ٱللَّهُ ٱلْخَٰلِقُ ٱلْبَارِئُ ٱلْمُصَوِّرُ ۖ لَهُ ٱلْأَسْمَآءُ ٱلْحُسْنَىٰ',
  highlighted: [
    { ar: 'ٱلرَّحْمَٰنُ', tr: 'Er-Rahmân',     en: 'ar-Raḥmān'     },
    { ar: 'ٱلرَّحِيمُ',   tr: 'Er-Rahîm',      en: 'ar-Raḥīm'      },
    { ar: 'ٱلْمَلِكُ',    tr: 'El-Melik',      en: 'al-Malik'      },
    { ar: 'ٱلْقُدُّوسُ',  tr: 'El-Kuddûs',     en: 'al-Quddūs'     },
    { ar: 'ٱلسَّلَٰمُ',   tr: 'Es-Selâm',      en: 'as-Salām'      },
    { ar: 'ٱلْمُؤْمِنُ',  tr: "El-Mü'min",     en: "al-Muʾmin"     },
    { ar: 'ٱلْمُهَيْمِنُ',tr: 'El-Müheymin',   en: 'al-Muhaymin'   },
    { ar: 'ٱلْعَزِيزُ',   tr: 'El-Azîz',       en: 'al-ʿAzīz'      },
    { ar: 'ٱلْجَبَّارُ',  tr: 'El-Cebbâr',     en: 'al-Jabbār'     },
    { ar: 'ٱلْمُتَكَبِّرُ',tr: 'El-Mütekebbir', en: 'al-Mutakabbir' },
    { ar: 'ٱلْخَٰلِقُ',   tr: 'El-Hâlık',      en: 'al-Khāliq'     },
    { ar: 'ٱلْبَارِئُ',   tr: "El-Bâri'",      en: "al-Bāriʾ"      },
    { ar: 'ٱلْمُصَوِّرُ', tr: 'El-Musavvir',   en: 'al-Muṣawwir'   },
  ],
};

const IHLAS_VERSE = {
  ref: 'İhlâs 112:1-4',
  refEn: 'Ikhlāṣ 112:1-4',
  title: 'İhlâs Suresi',
  titleEn: 'Sūrat al-Ikhlāṣ',
  intro: "Mutlak teklik — negatif tanım ile eşsizlik (Ehad + Samed + 'kimseden doğmamış, kimseyi doğurmamış').",
  introEn: "Absolute oneness — uniqueness through negative description (al-Aḥad + aṣ-Ṣamad + 'neither begotten nor begetting').",
  arabic: 'قُلْ هُوَ ٱللَّهُ أَحَدٌ ۝ ٱللَّهُ ٱلصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌۢ',
  highlighted: [
    { ar: 'أَحَدٌ',   tr: 'El-Ehad',  en: 'al-Aḥad'   },
    { ar: 'ٱلصَّمَدُ', tr: 'Es-Samed', en: 'aṣ-Ṣamad'  },
  ],
};

const FLAGSHIPS = [AYET_KURSI, HASR_VERSE, IHLAS_VERSE];

function FlagshipVerses({ tr }) {
  return (
    <section style={{ padding: '80px 24px', background: COLORS.cosmicBlack }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={sectionLabel}>{tr ? 'Üç Flagship Pasaj' : 'Three Flagship Passages'}</div>
        <h2 style={{
          fontFamily: FONTS.display,
          fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
          color: COLORS.offWhite,
          fontWeight: 700,
          margin: '0 0 50px',
          maxWidth: '720px',
        }}>
          {tr ? 'İsimlerin En Yoğun Kümelendiği Üç Pasaj' : 'Three Passages with the Densest Divine Names'}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '50px' }}>
          {FLAGSHIPS.map((v, i) => (
            <FlagshipCard key={v.ref} verse={v} index={i + 1} tr={tr} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FlagshipCard({ verse, index, tr }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.7 }}
      style={{
        ...GLASS_CARD,
        padding: '36px 28px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', marginBottom: '14px' }}>
        <span style={{
          color: COLORS.gold,
          fontFamily: FONTS.display,
          fontSize: '1.8rem',
          fontWeight: 700,
          lineHeight: 1,
        }}>
          {String(index).padStart(2, '0')}
        </span>
        <h3 style={{
          fontFamily: FONTS.display,
          fontSize: '1.4rem',
          color: COLORS.offWhite,
          fontWeight: 700,
          margin: 0,
        }}>
          {tr ? verse.title : verse.titleEn}
        </h3>
        <span style={{ color: COLORS.silver, fontSize: '0.78rem', fontFamily: FONTS.body, letterSpacing: '0.08em', marginLeft: 'auto' }}>
          {tr ? verse.ref : verse.refEn}
        </span>
      </div>

      <p style={{
        color: COLORS.silver,
        fontFamily: FONTS.body,
        fontSize: '0.95rem',
        lineHeight: 1.7,
        margin: '0 0 24px',
        maxWidth: '720px',
      }}>
        {tr ? verse.intro : verse.introEn}
      </p>

      <div
        dir="rtl"
        lang="ar"
        style={{
          fontFamily: FONTS.quran,
          fontSize: 'clamp(1.4rem, 3vw, 1.8rem)',
          color: COLORS.offWhite,
          lineHeight: 2.4,
          padding: '20px 0',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          textAlign: 'right',
        }}
      >
        {highlightNames(verse.arabic, verse.highlighted)}
      </div>

      <div style={{
        marginTop: '20px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
      }}>
        {verse.highlighted.map(n => (
          <span key={n.tr} style={{
            background: COLORS.softGoldAlpha12 || 'rgba(212,165,116,0.12)',
            border: `1px solid ${COLORS.softGoldAlpha25 || 'rgba(212,165,116,0.25)'}`,
            borderRadius: '14px',
            padding: '4px 12px',
            fontSize: '0.78rem',
            color: COLORS.gold,
            fontFamily: FONTS.body,
          }}>
            {tr ? n.tr : n.en}
          </span>
        ))}
      </div>
    </motion.article>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SECTION 4: FREKANS MANZARASI — Top 20 bar chart + Allah lemma notu
// ═════════════════════════════════════════════════════════════════════════════

function FrequencyLandscape({ data, tr }) {
  const [showAllahNote, setShowAllahNote] = useState(false);

  const top20 = useMemo(() => {
    if (!data?.isimler) return [];
    // Allah için displayCount override (klasik 2699)
    const isimler = data.isimler.map(n => ({
      ...n,
      displayCount: n.isim === 'Allah' ? ALLAH_CLASSIC_COUNT : n.kuranda_gecis_sayisi,
    }));
    return [...isimler].sort((a, b) => b.displayCount - a.displayCount).slice(0, 20);
  }, [data]);

  if (!data) return null;
  const maxCount = top20[0]?.displayCount || 1;

  return (
    <section style={{ padding: '80px 24px', background: '#06080e' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={sectionLabel}>{tr ? 'Frekans Manzarası' : 'Frequency Landscape'}</div>
        <h2 style={{
          fontFamily: FONTS.display,
          fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
          color: COLORS.offWhite,
          fontWeight: 700,
          margin: '0 0 16px',
          maxWidth: '720px',
        }}>
          {tr ? 'En Sık Geçen 20 İsim' : 'Top 20 Most Frequent Names'}
        </h2>
        <p style={{ color: COLORS.silver, fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '40px', maxWidth: '720px' }}>
          {tr
            ? 'Allah lafzası 2.699 geçişle uzak ara önde — yaklaşık her 2,3 ayette bir. Sonra El-Hakk, El-Alîm, Er-Rahîm gibi sıfat-isimler gelir.'
            : 'The name Allah leads by far with 2,699 occurrences — roughly every 2.3 verses. Then come attribute-names like al-Ḥaqq, al-ʿAlīm, ar-Raḥīm.'}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {top20.map((n, i) => (
            <FreqBar key={n.isim} item={n} max={maxCount} tr={tr} rank={i + 1} onAllahNoteClick={() => setShowAllahNote(true)} />
          ))}
        </div>

        {showAllahNote && (
          <AllahLemmaNote tr={tr} onClose={() => setShowAllahNote(false)} />
        )}
      </div>
    </section>
  );
}

function FreqBar({ item, max, tr, rank, onAllahNoteClick }) {
  const isAllah = item.isim === 'Allah';
  const pct = (item.displayCount / max) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: rank * 0.02 }}
      style={{ display: 'grid', gridTemplateColumns: '24px 110px 1fr 70px', gap: '12px', alignItems: 'center' }}
    >
      <span style={{ color: COLORS.slate500 || 'rgba(148,163,184,0.5)', fontSize: '0.7rem', fontFamily: FONTS.body, textAlign: 'right' }}>
        {rank}
      </span>
      <span style={{ color: COLORS.offWhite, fontSize: '0.85rem', fontFamily: FONTS.body, fontWeight: 600 }}>
        {item.isim}
      </span>
      <div style={{ position: 'relative', height: '24px', background: 'rgba(255,255,255,0.04)', borderRadius: '4px' }}>
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          style={{
            height: '100%',
            background: `linear-gradient(90deg, ${COLORS.gold}cc, ${COLORS.gold}66)`,
            borderRadius: '4px',
          }}
        />
      </div>
      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
        <span style={{ color: COLORS.offWhite, fontSize: '0.85rem', fontFamily: FONTS.body, fontWeight: 700 }}>
          {item.displayCount.toLocaleString(tr ? 'tr-TR' : 'en-US')}
        </span>
        {isAllah && (
          <button
            onClick={onAllahNoteClick}
            aria-label={tr ? 'Sayım metodolojisi' : 'Counting methodology'}
            style={{
              background: 'none',
              border: 'none',
              color: COLORS.gold,
              cursor: 'pointer',
              fontSize: '0.85rem',
              padding: 0,
            }}
          >
            ⓘ
          </button>
        )}
      </span>
    </motion.div>
  );
}

function AllahLemmaNote({ tr, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        marginTop: '32px',
        ...GLASS_CARD,
        padding: '24px 28px',
        position: 'relative',
      }}
    >
      <button
        onClick={onClose}
        aria-label={tr ? 'Kapat' : 'Close'}
        style={{ position: 'absolute', top: '12px', right: '12px', background: 'none', border: 'none', color: COLORS.silver, cursor: 'pointer', fontSize: '1.2rem' }}
      >
        ×
      </button>
      <div style={{ ...sectionLabel, marginBottom: '12px' }}>{tr ? 'Metodolojik Nüans' : 'Methodological Nuance'}</div>
      <p style={{ color: COLORS.offWhite, fontSize: '0.95rem', lineHeight: 1.8, margin: '0 0 12px' }}>
        {tr
          ? <>Klasik konkordans (M. Fuâd Abdülbâkî, el-Mu'cemü'l-Müfehres) <strong>lemma sayımı</strong> esas alır: bir ismin tüm morfolojik formları (<code>Allāhu</code>, <code>Allāhi</code>, <code>Allāha</code>) ve önek'li türevleri (<code>lillāh</code>, <code>billāh</code>, <code>wallāh</code>, <code>fallāh</code>) tek bir isim sayılır.</>
          : <>The classical concordance (M. Fuʾād ʿAbd al-Bāqī, al-Muʿjam al-Mufahras) uses <strong>lemma counting</strong>: all morphological forms of a name (<code>Allāhu</code>, <code>Allāhi</code>, <code>Allāha</code>) and prefixed forms (<code>lillāh</code>, <code>billāh</code>, <code>wallāh</code>, <code>fallāh</code>) count as one name.</>}
      </p>
      <p style={{ color: COLORS.silver, fontSize: '0.88rem', lineHeight: 1.7, margin: 0 }}>
        {tr
          ? <>Bu nedenle klasik rakamlar (Allah=2.699), yalın yüzey lafzı sayımına (~{ALLAH_SURFACE_COUNT.toLocaleString('tr-TR')}) göre daha yüksek görünür. Bu metodolojik bir tercihtir, sayım hatası değildir.</>
          : <>This is why classical figures (Allah=2,699) appear higher than strict surface counts (~{ALLAH_SURFACE_COUNT.toLocaleString('en-US')}). It is a methodological choice, not a counting error.</>}
      </p>
    </motion.div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SECTION 5: VAHYIN SESI — 14 tematik eksen, 6 görünür + 8 expand
// ═════════════════════════════════════════════════════════════════════════════

const FOREGROUND_AXES = ['varlik-teklik', 'yakinlik', 'rahmet-af', 'yaraticilik', 'kudret', 'nur'];

function DivineVoice({ beyanlari, tr }) {
  const [expanded, setExpanded] = useState(false);

  if (!beyanlari) return null;

  const fg = beyanlari.eksenler.filter(e => FOREGROUND_AXES.includes(e.id));
  const bg = beyanlari.eksenler.filter(e => !FOREGROUND_AXES.includes(e.id));

  return (
    <section style={{ padding: '80px 24px', background: COLORS.cosmicBlack }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={sectionLabel}>{tr ? 'Vahyin Sesi' : 'The Voice of Revelation'}</div>
        <h2 style={{
          fontFamily: FONTS.display,
          fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
          color: COLORS.offWhite,
          fontWeight: 700,
          margin: '0 0 16px',
          maxWidth: '720px',
        }}>
          {tr ? "Allah'ın Doğrudan Beyanları" : "God's Direct Self-Statements"}
        </h2>
        <p style={{ color: COLORS.silver, fontSize: '1.05rem', lineHeight: 1.8, margin: '0 0 50px', maxWidth: '720px' }}>
          {tr
            ? "Allah kendisini bazen üçüncü şahıs üzerinden, bazen doğrudan birinci şahıs üzerinden (\"Ben\", \"Biz\") tanıtır. Bu pasajlar onun kendi ağzından tanımıdır."
            : "God describes Himself sometimes in the third person, sometimes directly in the first person (\"I\", \"We\"). These passages are His self-description in His own voice."}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {fg.map(eks => <AxisCard key={eks.id} eks={eks} tr={tr} />)}
        </div>

        {!expanded && (
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <button
              onClick={() => setExpanded(true)}
              style={{
                background: 'transparent',
                border: `1px solid ${COLORS.softGoldAlpha40 || 'rgba(212,165,116,0.4)'}`,
                borderRadius: '10px',
                color: COLORS.gold,
                padding: '12px 28px',
                fontSize: '0.92rem',
                fontFamily: FONTS.body,
                cursor: 'pointer',
                transition: `all ${TRANSITION?.fast || '0.15s'}`,
              }}
            >
              {tr ? `Diğer ${bg.length} ekseni göster →` : `Show ${bg.length} more axes →`}
            </button>
          </div>
        )}

        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.5 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '20px' }}
          >
            {bg.map(eks => <AxisCard key={eks.id} eks={eks} tr={tr} />)}
          </motion.div>
        )}
      </div>
    </section>
  );
}

function AxisCard({ eks, tr }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5 }}
      style={{ ...GLASS_CARD, padding: '24px 22px', display: 'flex', flexDirection: 'column' }}
    >
      <h3 style={{
        fontFamily: FONTS.display,
        fontSize: '1.15rem',
        color: COLORS.gold,
        fontWeight: 700,
        margin: '0 0 8px',
      }}>
        {tr ? eks.baslikTr : eks.baslikEn}
      </h3>
      <p style={{
        color: COLORS.silver,
        fontSize: '0.82rem',
        fontStyle: 'italic',
        lineHeight: 1.6,
        margin: '0 0 18px',
      }}>
        {tr ? eks.notTr : eks.notEn}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
        {eks.ayetler.slice(0, 2).map(a => (
          <div key={a.id} style={{
            paddingTop: '14px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
          }}>
            <p
              dir="rtl"
              lang="ar"
              style={{
                fontFamily: FONTS.quran,
                fontSize: '1rem',
                color: COLORS.offWhite,
                lineHeight: 2.2,
                margin: '0 0 8px',
                textAlign: 'right',
              }}
            >
              {a.arapca}
            </p>
            <p style={{ color: COLORS.silver, fontSize: '0.78rem', lineHeight: 1.6, margin: '0 0 4px', fontStyle: 'italic' }}>
              "{tr ? a.tr : a.en}"
            </p>
            <p style={{ color: `${COLORS.gold}99`, fontSize: '0.72rem', fontFamily: FONTS.body, margin: 0, letterSpacing: '0.06em' }}>
              — {a.sure}:{a.ayet}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SECTION 6: 114 İSIM ATLASI — search + 3'lü filter + inline detay
// ═════════════════════════════════════════════════════════════════════════════

// 9 isim için kök DNA (Doküman 5)
const KOK_ANALIZ = {
  'Er-Rahmân':  { kok: 'ر ح م', anlamTr: 'Rahmet · şefkat · koruyuculuk', anlamEn: 'mercy · compassion · protection', notTr: '"Rahim" (anne rahmi) ile aynı köktendir.', notEn: "Same root as \"raḥim\" (mother's womb)." },
  'Er-Rahîm':   { kok: 'ر ح م', anlamTr: 'Rahmet · şefkat · koruyuculuk', anlamEn: 'mercy · compassion · protection', notTr: '"Rahim" (anne rahmi) ile aynı köktendir.', notEn: "Same root as \"raḥim\" (mother's womb)." },
  'El-Hâlık':   { kok: 'خ ل ق', anlamTr: 'Ölçüyle yaratmak · tasarlamak · biçim vermek', anlamEn: 'create with measure · design · shape', notTr: null, notEn: null },
  'El-Alîm':    { kok: 'ع ل م', anlamTr: 'Bilmek · fark etmek · kesin bilgi sahibi olmak', anlamEn: 'to know · perceive · possess certain knowledge', notTr: null, notEn: null },
  'El-Hakîm':   { kok: 'ح ك م', anlamTr: 'Hükmetmek · hikmet · düzen kurmak', anlamEn: 'to judge · wisdom · order', notTr: null, notEn: null },
  'En-Nûr':     { kok: 'ن و ر', anlamTr: 'Işık · aydınlık · görünür kılma', anlamEn: 'light · brightness · revelation', notTr: null, notEn: null },
  'El-Vedûd':   { kok: 'و د د', anlamTr: 'Sevgi · içten bağlılık', anlamEn: 'love · sincere attachment', notTr: null, notEn: null },
  'El-Azîz':    { kok: 'ع ز ز', anlamTr: 'Güç · üstünlük · yenilmezlik', anlamEn: 'might · superiority · invincibility', notTr: null, notEn: null },
  'El-Kayyûm':  { kok: 'ق و م', anlamTr: 'Ayakta tutmak · süreklilik sağlamak · varlığı devam ettirmek', anlamEn: 'sustain · maintain continuity · uphold existence', notTr: null, notEn: null },
};

const CATEGORY_FILTERS = [
  { key: 'all',          labelTr: 'Tümü',           labelEn: 'All'           },
  { key: 'isim',         labelTr: 'Lafza-i Celâl',  labelEn: 'Divine Name'   },
  { key: 'esma',         labelTr: 'Esmâ-i Hüsnâ',  labelEn: 'Esmā-i Ḥusnā' },
  { key: 'kurani_sifat', labelTr: "Kur'ânî Sıfat",  labelEn: 'Quranic Attr.' },
];

const SORT_OPTIONS = [
  { value: 'no',         labelTr: 'Sıra',       labelEn: 'Order'  },
  { value: 'count_desc', labelTr: 'Frekans ↓',  labelEn: 'Freq ↓' },
  { value: 'count_asc',  labelTr: 'Frekans ↑',  labelEn: 'Freq ↑' },
];

const PAGE_SIZE = 30;

function NamesAtlas({ data, tr }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('no');
  const [openId, setOpenId] = useState(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    if (!data?.isimler) return [];
    let rows = data.isimler.map(n => ({
      ...n,
      displayCount: n.isim === 'Allah' ? ALLAH_CLASSIC_COUNT : n.kuranda_gecis_sayisi,
    }));
    if (filter !== 'all') rows = rows.filter(n => n.kategori === filter);
    const q = search.trim().toLowerCase();
    if (q) {
      rows = rows.filter(n =>
        (n.isim || '').toLowerCase().includes(q) ||
        (n.okunus || '').toLowerCase().includes(q) ||
        (n.anlam || '').toLowerCase().includes(q) ||
        (n.arapca || '').includes(q)
      );
    }
    if (sort === 'count_desc') rows.sort((a, b) => b.displayCount - a.displayCount);
    else if (sort === 'count_asc') rows.sort((a, b) => a.displayCount - b.displayCount);
    return rows;
  }, [data, filter, search, sort]);

  useEffect(() => { setVisibleCount(PAGE_SIZE); }, [filter, search, sort]);

  if (!data) return null;

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <section style={{ padding: '80px 24px', background: '#06080e' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={sectionLabel}>{tr ? '114 İsim Atlası' : '114 Names Atlas'}</div>
        <h2 style={{
          fontFamily: FONTS.display,
          fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
          color: COLORS.offWhite,
          fontWeight: 700,
          margin: '0 0 16px',
        }}>
          {tr ? 'Tüm İsimleri Keşfet' : 'Explore All Names'}
        </h2>
        <p style={{ color: COLORS.silver, fontSize: '0.95rem', lineHeight: 1.7, margin: '0 0 32px', maxWidth: '720px' }}>
          {tr
            ? `${data.toplam_isim_sayisi} isim · Lafza-i Celâl + 99 Esmâ-i Hüsnâ + Kur'ânî sıfat ve tamlamalar. Arama, kategori filtresi veya frekans sıralaması ile keşfet; bir isme tıklayarak detayı aç.`
            : `${data.toplam_isim_sayisi} names · the Divine Name + 99 Esmā-i Ḥusnā + Quranic attributes and compound phrases. Search, filter, or sort by frequency; tap a name to open the detail.`}
        </p>

        {/* Controls */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
          <input
            type="text"
            placeholder={tr ? 'İsim, anlam veya Arapça ara…' : 'Search name, meaning, or Arabic…'}
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              flex: '1 1 200px',
              minWidth: 0,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: COLORS.offWhite,
              padding: '10px 14px',
              fontSize: '0.9rem',
              fontFamily: FONTS.body,
              outline: 'none',
            }}
          />
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: COLORS.offWhite,
              padding: '10px 14px',
              fontSize: '0.88rem',
              fontFamily: FONTS.body,
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value} style={{ background: COLORS.cosmicBlack }}>
                {tr ? o.labelTr : o.labelEn}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px', overflowX: 'auto' }}>
          {CATEGORY_FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              aria-pressed={filter === f.key}
              style={{
                background: filter === f.key ? `${COLORS.gold}22` : 'transparent',
                border: filter === f.key ? `1px solid ${COLORS.gold}55` : '1px solid rgba(255,255,255,0.1)',
                color: filter === f.key ? COLORS.gold : COLORS.silver,
                borderRadius: '20px',
                padding: '6px 14px',
                fontSize: '0.82rem',
                fontFamily: FONTS.body,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {tr ? f.labelTr : f.labelEn}
            </button>
          ))}
        </div>

        {/* Liste */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {visible.map(n => (
            <NameRow
              key={n.isim}
              item={n}
              tr={tr}
              isOpen={openId === n.isim}
              onToggle={() => setOpenId(openId === n.isim ? null : n.isim)}
            />
          ))}
        </div>

        {hasMore && (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button
              onClick={() => setVisibleCount(v => v + PAGE_SIZE)}
              style={{
                background: 'transparent',
                border: '1px solid rgba(212,165,116,0.4)',
                borderRadius: '8px',
                color: COLORS.gold,
                padding: '10px 22px',
                fontSize: '0.88rem',
                fontFamily: FONTS.body,
                cursor: 'pointer',
              }}
            >
              {tr ? `${filtered.length - visibleCount} isim daha göster` : `Show ${filtered.length - visibleCount} more`}
            </button>
          </div>
        )}

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: COLORS.silver, fontSize: '0.92rem' }}>
            {tr ? 'Sonuç bulunamadı.' : 'No results found.'}
          </div>
        )}
      </div>
    </section>
  );
}

function NameRow({ item, tr, isOpen, onToggle }) {
  const isAllah = item.isim === 'Allah';
  return (
    <>
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: '14px',
          alignItems: 'center',
          background: isOpen ? 'rgba(212,165,116,0.06)' : 'rgba(255,255,255,0.02)',
          border: isOpen ? `1px solid ${COLORS.gold}44` : '1px solid rgba(255,255,255,0.06)',
          borderRadius: '10px',
          padding: '14px 18px',
          color: COLORS.offWhite,
          fontFamily: FONTS.body,
          cursor: 'pointer',
          textAlign: 'left',
          transition: 'all 0.18s',
          width: '100%',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', minWidth: 0 }}>
          <span dir="rtl" lang="ar" style={{
            fontFamily: FONTS.quran,
            fontSize: '1.3rem',
            color: COLORS.gold,
            minWidth: '110px',
            textAlign: 'right',
            whiteSpace: 'nowrap',
          }}>
            {item.arapca}
          </span>
          <span style={{ fontWeight: 600, fontSize: '0.92rem' }}>{item.isim}</span>
          <span style={{
            color: COLORS.silver,
            fontSize: '0.78rem',
            fontStyle: 'italic',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            display: 'none',
          }} className="esma-meaning-inline">
            {item.anlam}
          </span>
        </div>
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: COLORS.silver, fontSize: '0.7rem', fontFamily: FONTS.body }}>
            {item.kategori_etiket}
          </span>
          <span style={{ color: COLORS.offWhite, fontSize: '0.88rem', fontWeight: 700 }}>
            {(isAllah ? ALLAH_CLASSIC_COUNT : item.kuranda_gecis_sayisi).toLocaleString(tr ? 'tr-TR' : 'en-US')}
          </span>
        </span>
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          style={{ overflow: 'hidden' }}
        >
          <NameDetail item={item} tr={tr} isAllah={isAllah} />
        </motion.div>
      )}
    </>
  );
}

function NameDetail({ item, tr, isAllah }) {
  const [showAllAyets, setShowAllAyets] = useState(false);
  const kok = KOK_ANALIZ[item.isim];

  const ayetler = item.yuksek_frekansli
    ? (showAllAyets ? item.tum_ayetler : item.ornek_ayetler)
    : item.ayetler;

  return (
    <div style={{
      ...GLASS_CARD,
      background: 'rgba(212,165,116,0.04)',
      border: `1px solid ${COLORS.gold}22`,
      padding: '28px 28px',
      marginTop: '4px',
      marginBottom: '8px',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
        <span dir="rtl" lang="ar" style={{
          fontFamily: FONTS.quran,
          fontSize: '2.6rem',
          color: COLORS.gold,
          lineHeight: 1.4,
        }}>
          {item.arapca}
        </span>
        <span style={{ color: COLORS.silver, fontSize: '0.85rem', fontStyle: 'italic', marginTop: '4px' }}>
          {item.okunus} · {item.isim}
        </span>
      </div>

      <p style={{
        color: COLORS.offWhite,
        fontSize: '1.05rem',
        lineHeight: 1.7,
        margin: '0 0 8px',
        textAlign: 'center',
      }}>
        "{item.anlam}"
      </p>
      {item.aciklama && (
        <p style={{ color: COLORS.silver, fontSize: '0.85rem', lineHeight: 1.6, margin: '0 0 20px', textAlign: 'center', fontStyle: 'italic' }}>
          {item.aciklama}
        </p>
      )}

      {kok && (
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '8px',
          padding: '14px 18px',
          margin: '0 0 20px',
        }}>
          <div style={{ ...sectionLabel, marginBottom: '8px', fontSize: '0.65rem' }}>{tr ? 'Kök Analizi' : 'Root'}</div>
          <p style={{ color: COLORS.gold, fontFamily: FONTS.quran, fontSize: '1.4rem', margin: '0 0 6px', textAlign: 'center', letterSpacing: '0.4em' }}>
            {kok.kok}
          </p>
          <p style={{ color: COLORS.offWhite, fontSize: '0.85rem', lineHeight: 1.6, margin: 0, textAlign: 'center' }}>
            {tr ? kok.anlamTr : kok.anlamEn}
          </p>
          {(tr ? kok.notTr : kok.notEn) && (
            <p style={{ color: COLORS.silver, fontSize: '0.78rem', lineHeight: 1.6, margin: '8px 0 0', textAlign: 'center', fontStyle: 'italic' }}>
              {tr ? kok.notTr : kok.notEn}
            </p>
          )}
        </div>
      )}

      {isAllah && (
        <div style={{
          background: 'rgba(212,165,116,0.08)',
          border: `1px solid ${COLORS.gold}33`,
          borderRadius: '8px',
          padding: '16px 20px',
          marginBottom: '20px',
        }}>
          <div style={{ ...sectionLabel, marginBottom: '8px', fontSize: '0.65rem' }}>{tr ? 'Metodolojik Nüans' : 'Methodological Nuance'}</div>
          <p style={{ color: COLORS.offWhite, fontSize: '0.92rem', margin: '0 0 8px' }}>
            <strong>{tr ? 'Klasik konkordans: ' : 'Classical concordance: '}</strong>
            {ALLAH_CLASSIC_COUNT.toLocaleString(tr ? 'tr-TR' : 'en-US')}
            <span style={{ color: COLORS.silver, fontSize: '0.78rem', marginLeft: '6px' }}>
              ({tr ? 'lemma — tüm morfolojik formlar dahil' : 'lemma — all morphological forms included'})
            </span>
          </p>
          <p style={{ color: COLORS.silver, fontSize: '0.82rem', lineHeight: 1.6, margin: '0 0 8px' }}>
            {tr
              ? <>Fark, <code>li- + Allah = lillāh</code>, <code>wa- + Allah = wallāh</code>, <code>bi- + Allah = billāh</code> gibi prefiks'li formların lemma sayımında dahil, yüzey sayımında dahil olmamasındandır.</>
              : <>The difference comes from prefixed forms like <code>li- + Allah = lillāh</code>, <code>wa- + Allah = wallāh</code>, <code>bi- + Allah = billāh</code> being counted in the lemma but not in surface counting.</>}
          </p>
          <p style={{ color: COLORS.silver, fontSize: '0.82rem', margin: 0 }}>
            <strong>{tr ? 'Yalın yüzey lafzı: ' : 'Surface form only: '}</strong>
            ~{ALLAH_SURFACE_COUNT.toLocaleString(tr ? 'tr-TR' : 'en-US')}
          </p>
        </div>
      )}

      <div style={{ ...sectionLabel, marginBottom: '12px', fontSize: '0.65rem' }}>
        {tr
          ? `${item.kuranda_gecis_sayisi} âyette geçer`
          : `Appears in ${item.kuranda_gecis_sayisi} verses`}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {(ayetler || []).slice(0, 30).map(a => (
          <a
            key={`${a.sure}-${a.ayet}`}
            href={`/${tr ? 'tr' : 'en'}/oku/${a.sure}`}
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              padding: '4px 10px',
              fontSize: '0.78rem',
              color: COLORS.silver,
              fontFamily: FONTS.body,
              textDecoration: 'none',
            }}
          >
            {a.sure_adi || a.sure}:{a.ayet}
          </a>
        ))}
      </div>

      {item.yuksek_frekansli && !showAllAyets && (ayetler || []).length === 15 && (
        <button
          onClick={() => setShowAllAyets(true)}
          style={{
            marginTop: '14px',
            background: 'transparent',
            border: 'none',
            color: COLORS.gold,
            fontSize: '0.82rem',
            cursor: 'pointer',
            fontFamily: FONTS.body,
          }}
        >
          {tr
            ? `Tüm ${item.kuranda_gecis_sayisi} ayeti göster →`
            : `Show all ${item.kuranda_gecis_sayisi} verses →`}
        </button>
      )}
      {item.yuksek_frekansli && showAllAyets && (
        <p style={{ color: COLORS.silver, fontSize: '0.76rem', marginTop: '10px' }}>
          {tr ? 'İlk 30 referans gösterilmiştir.' : 'First 30 references shown.'}
        </p>
      )}

      <div style={{ marginTop: '20px', textAlign: 'right' }}>
        <a
          href={`https://corpus.quran.com/search.jsp?q=${encodeURIComponent(item.arapca)}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: COLORS.gold, fontSize: '0.82rem', fontFamily: FONTS.body, textDecoration: 'none' }}
        >
          {tr ? "Corpus Quran'da ara →" : 'Search on Corpus Quran →'}
        </a>
      </div>
    </div>
  );
}

// Belirtilen isimleri Arapça metinde altı çizili olarak işaretle
function highlightNames(arabic, names) {
  let parts = [{ text: arabic, plain: true }];
  names.forEach(n => {
    const newParts = [];
    parts.forEach(p => {
      if (!p.plain) { newParts.push(p); return; }
      const idx = p.text.indexOf(n.ar);
      if (idx === -1) { newParts.push(p); return; }
      const before = p.text.slice(0, idx);
      const after = p.text.slice(idx + n.ar.length);
      if (before) newParts.push({ text: before, plain: true });
      newParts.push({ text: n.ar, plain: false });
      if (after) newParts.push({ text: after, plain: true });
    });
    parts = newParts;
  });

  return parts.map((p, i) =>
    p.plain
      ? <span key={i}>{p.text}</span>
      : <span key={i} style={{
          color: COLORS.gold,
          borderBottom: `2px solid ${COLORS.gold}`,
          paddingBottom: '2px',
        }}>{p.text}</span>
  );
}
