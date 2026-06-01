'use client';

import { useState, useEffect, useMemo, useRef, Fragment } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS, GLASS_CARD, TEXT, TRANSITION } from '../tokens';
import { buildFallbackUrls } from '../hooks/useAudioWithFallback';

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

// 4 temel ayet — Hero kartlarında her birinin GERÇEK quote'u (sloppy
// tekrarlamayı engelle). Tek bir metin = "En güzel isimler O'nundur" 4x değil.
const TEMEL_AYETLER_TR = [
  { ref: "A'RÂF 7:180",  quote: "En güzel isimler Allah'ındır; O'na o isimlerle dua edin." },
  { ref: "İSRÂ 17:110",  quote: "İster Allah deyin, ister Rahmân; hangisini deseniz en güzel isimler O'nundur." },
  { ref: "TÂHÂ 20:8",    quote: "Allah — O'ndan başka ilah yoktur; en güzel isimler O'nundur." },
  { ref: "HAŞR 59:24",   quote: "O, yaratan, kusursuzca var eden, şekil veren Allah'tır. En güzel isimler O'nundur." },
];
const TEMEL_AYETLER_EN = [
  { ref: "A'RĀF 7:180",  quote: "To Allah belong the best names; so invoke Him by them." },
  { ref: "ISRĀ 17:110",  quote: "Say Allah or say Ar-Raḥmān — by whichever you call, the best names are His." },
  { ref: "ṬĀHĀ 20:8",    quote: "Allah — there is no deity except Him; to Him belong the best names." },
  { ref: "ḤASHR 59:24",  quote: "He is Allah, the Creator, the Inventor, the Fashioner. To Him belong the best names." },
];

// ──────────────────────────────────────────────────────────────────────────────
// FiligreeDivider — gold ornamental separator (Islamic motif style)
// ──────────────────────────────────────────────────────────────────────────────
function FiligreeDivider({ delay = 0, mt = 0, mb = 0 }) {
  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0, scaleX: 0.6 }}
      animate={{ opacity: 0.7, scaleX: 1 }}
      transition={{ duration: 1.1, delay, ease: 'easeOut' }}
      style={{
        marginTop: `${mt}px`,
        marginBottom: `${mb}px`,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        color: COLORS.gold,
      }}
    >
      <span style={{
        display: 'inline-block',
        width: '80px',
        height: '1px',
        background: `linear-gradient(90deg, transparent, ${COLORS.gold}99)`,
      }} />
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" style={{ flexShrink: 0, opacity: 0.85 }}>
        <path d="M12 3 L14 10 L21 12 L14 14 L12 21 L10 14 L3 12 L10 10 Z" />
      </svg>
      <span style={{
        display: 'inline-block',
        width: '80px',
        height: '1px',
        background: `linear-gradient(90deg, ${COLORS.gold}99, transparent)`,
      }} />
    </motion.div>
  );
}

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
  const [pairsData, setPairsData] = useState(null);
  const [koklerData, setKoklerData] = useState(null);
  const [triplesData, setTriplesData] = useState(null);
  const [heatmapData, setHeatmapData] = useState(null);

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
    fetch('/esma-pairs-ayetler.json').then(r => r.json()).then(setPairsData).catch(e => console.error('[EsmaPairs]', e));
    fetch('/esma-kokler.json').then(r => r.json()).then(setKoklerData).catch(e => console.error('[EsmaKokler]', e));
    fetch('/esma-triples.json').then(r => r.json()).then(setTriplesData).catch(e => console.error('[EsmaTriples]', e));
    fetch('/esma-surah-heatmap.json').then(r => r.json()).then(setHeatmapData).catch(e => console.error('[EsmaHeatmap]', e));
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
      <Manifesto tr={tr} data={data} />

      {/* ═══ SECTION 3: ÜÇ TOPLAYICI BEYAN (Âyetü'l-Kürsî · Haşr 59:22-24 · İhlâs 112) ═══ */}
      <FlagshipVerses tr={tr} />

      {/* ═══ SECTION 4: FREKANS MANZARASI ═══ */}
      <FrequencyLandscape data={data} tr={tr} />

      {/* ═══ SECTION 5: İSİM ÇİFTLERİ ═══ */}
      <NamePairs tr={tr} pairsData={pairsData} triplesData={triplesData} />

      {/* ═══ SECTION 6: VAHYİN SESİ ═══ */}
      <DivineVoice beyanlari={beyanlari} tr={tr} />

      {/* ═══ SECTION 7: KÖK AİLELERİ ═══ */}
      <KokAileleri tr={tr} koklerData={koklerData} />

      {/* ═══ SECTION 8: SURE MANZARASI (HEATMAP) ═══ */}
      <SurahNameHeatmap tr={tr} heatmapData={heatmapData} />

      {/* ═══ SECTION 9: 114 İSİM ATLASI ═══ */}
      <NamesAtlas data={data} tr={tr} />

      {/* ═══ SECTION 10: METODOLOJİ ve KAYNAK ═══ */}
      <Methodology data={data} tr={tr} />
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
      {/* Radial gradient backdrop — subtle gold glow center */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse at center, ${COLORS.gold}0a 0%, transparent 60%)`,
      }} />

      <div style={{ position: 'relative', maxWidth: '900px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        {/* Bismillah ornamenti */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 0.85, scale: 1 }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
          style={{
            fontFamily: FONTS.quran,
            fontSize: 'clamp(1.8rem, 3.8vw, 2.6rem)',
            color: COLORS.gold,
            marginBottom: '64px',
            textAlign: 'center',
            lineHeight: 1,
          }}
          dir="rtl"
          lang="ar"
        >
          ﷽
        </motion.div>

        {/* Şûrâ 42:11 — hero anchor verse */}
        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          cite="https://quran.com/42/11"
          style={{
            margin: 0,
            textAlign: 'center',
            maxWidth: '820px',
          }}
        >
          <p
            dir="rtl"
            lang="ar"
            style={{
              fontFamily: FONTS.quran,
              fontSize: 'clamp(1.7rem, 4.2vw, 2.6rem)',
              color: COLORS.gold,
              lineHeight: 2.1,
              margin: '0 0 22px',
              textShadow: `0 0 28px ${COLORS.gold}26`,
            }}
          >
            {HERO_VERSE.arabic}
          </p>
          <p style={{
            color: COLORS.offWhite,
            fontFamily: FONTS.display,
            fontStyle: 'italic',
            fontSize: 'clamp(1.02rem, 2.4vw, 1.3rem)',
            lineHeight: 1.65,
            margin: '0 0 10px',
            maxWidth: '680px',
            marginLeft: 'auto', marginRight: 'auto',
          }}>
            "{tr ? HERO_VERSE.tr : HERO_VERSE.en}"
          </p>
          <p style={{
            color: COLORS.silver,
            fontFamily: FONTS.body,
            fontSize: '0.82rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            margin: 0,
            opacity: 0.7,
          }}>
            — {tr ? HERO_VERSE.ref : HERO_VERSE.refEn}
          </p>
        </motion.blockquote>

        {/* Filigree divider 2 */}
        <FiligreeDivider delay={0.8} mt={56} mb={48} />

        {/* Çift-katman başlık */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.9 }}
          style={{ textAlign: 'center', marginBottom: '56px', position: 'relative' }}
        >
          {/* Calligraphic Arabic accent above the title.
              Boyut H1'in 1/3'ü oranında — görsel denge için clamp genişletildi
              (önce çok küçüktü: 1rem mobile, 1.4rem desktop). */}
          <p
            dir="rtl"
            lang="ar"
            style={{
              fontFamily: FONTS.quran,
              fontSize: 'clamp(1.7rem, 4vw, 2.7rem)',
              color: `${COLORS.gold}cc`,
              margin: '0 0 16px',
              lineHeight: 1.5,
              letterSpacing: '0.02em',
              textShadow: `0 0 24px ${COLORS.gold}1c`,
            }}
          >
            ٱلْأَسْمَآءُ ٱلْحُسْنَىٰ
          </p>
          <h1 style={{
            fontFamily: FONTS.display,
            fontWeight: 900,
            fontSize: 'clamp(2.6rem, 7.5vw, 5.5rem)',
            background: `linear-gradient(180deg, ${COLORS.offWhite} 0%, ${COLORS.offWhite}cc 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.025em',
            lineHeight: 1,
            margin: '0 0 18px',
            display: 'inline-block',
          }}>
            {tr ? 'ESMÂ-İ HÜSNÂ' : 'THE BEAUTIFUL NAMES'}
          </h1>
          {/* Subtle gold underline glow */}
          <div aria-hidden style={{
            width: '120px',
            height: '1px',
            background: `linear-gradient(90deg, transparent, ${COLORS.gold}99, transparent)`,
            margin: '0 auto 18px',
          }} />
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

        {/* 4 temel ayet — actual unique quotes from each verse */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.1 }}
          style={{ width: '100%', maxWidth: '900px', marginBottom: '40px' }}
        >
          <p style={{
            ...sectionLabel,
            marginBottom: '20px',
            textAlign: 'center',
            color: `${COLORS.gold}aa`,
          }}>
            {tr ? "Allah'ın kendi beyanı" : "In His own words"}
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '14px',
          }}>
            {(tr ? TEMEL_AYETLER_TR : TEMEL_AYETLER_EN).map((ayet, i) => (
              <motion.div
                key={ayet.ref}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 1.25 + i * 0.1 }}
                style={{
                  background: `linear-gradient(180deg, ${COLORS.gold}0d 0%, rgba(255,255,255,0.02) 100%)`,
                  border: `1px solid ${COLORS.gold}26`,
                  borderRadius: '12px',
                  padding: '18px 16px',
                  textAlign: 'center',
                  position: 'relative',
                }}
              >
                <div style={{
                  color: COLORS.gold,
                  fontFamily: FONTS.body,
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  letterSpacing: '0.16em',
                  marginBottom: '10px',
                }}>
                  {ayet.ref}
                </div>
                <div style={{
                  color: COLORS.offWhite,
                  fontFamily: FONTS.display,
                  fontStyle: 'italic',
                  fontSize: '0.86rem',
                  lineHeight: 1.55,
                }}>
                  "{ayet.quote}"
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Filigree divider 3 */}
        <FiligreeDivider delay={1.6} mt={20} mb={32} />

        {/* Sayaç şeridi — premium chip treatment */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 1.7 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '14px 24px',
            fontFamily: FONTS.body,
            color: COLORS.silver,
            fontSize: '0.86rem',
            letterSpacing: '0.1em',
          }}
        >
          <span style={{
            background: `${COLORS.gold}18`,
            border: `1px solid ${COLORS.gold}44`,
            borderRadius: '999px',
            padding: '5px 14px',
            color: COLORS.gold,
            fontWeight: 600,
          }}>
            {tr ? '114 isim ve sıfat' : '114 names & attributes'}
          </span>
          <span style={{ opacity: 0.5 }}>·</span>
          <span>{tr ? '6.236 âyet' : '6,236 verses'}</span>
          <span style={{ opacity: 0.5 }}>·</span>
          <span style={{ fontStyle: 'italic' }}>{tr ? '1 mimar' : 'one architect'}</span>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5, y: [0, 6, 0] }}
          transition={{ opacity: { duration: 0.9, delay: 2 }, y: { duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 2.4 } }}
          style={{
            marginTop: '48px',
            color: COLORS.silver,
            fontFamily: FONTS.body,
            fontSize: '0.74rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            textAlign: 'center',
          }}
        >
          {tr ? '↓ keşfetmeye başla' : '↓ start exploring'}
        </motion.div>

      </div>
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

function Manifesto({ tr, data }) {
  // CELAL ve CEMAL listelerindeki isimlerin Kuran'da toplam geçiş sayısı.
  // Veri yüklendikten sonra hesaplanır. Bir ismin frequency'si JSON'da
  // bulunamazsa 0 sayılır (skip — hata değil, sessiz).
  const balance = useMemo(() => {
    if (!data?.isimler) return null;
    const lookup = new Map(data.isimler.map(n => [n.isim, n.kuranda_gecis_sayisi || 0]));
    const sum = (list) => list.reduce((acc, n) => acc + (lookup.get(n.tr) || 0), 0);
    const celal = sum(CELAL_NAMES);
    const cemal = sum(CEMAL_NAMES);
    const total = celal + cemal;
    if (total === 0) return null;
    return {
      celal,
      cemal,
      total,
      cemalPct: (cemal / total) * 100,
      celalPct: (celal / total) * 100,
    };
  }, [data]);

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
            ? "Allah kendisini hem sarsılmaz kudretiyle (Celal: Cebbâr, Kahhâr, Azîz), hem de sığınılacak şefkatiyle (Cemal: Vedûd, Latîf, Gafûr) birlikte tanıtır. O yegane sığınaktır — fakat sığınak olmasıyla birlikte mutlak hâkim ve kahir olduğunu da gizlemez. Kur'an'ın ilah tasavvuru bu iki yüzün kopmaz dengesidir."
            : "God describes Himself with both unshakable might (Jalāl: al-Jabbār, al-Qahhār, al-ʿAzīz) and embracing mercy (Jamāl: al-Wadūd, al-Laṭīf, al-Ghafūr) at once. He is the sole refuge — yet alongside being a refuge, He never veils that He is the absolute Sovereign and Subduer. The Quran's vision of divinity is the inseparable balance of these two faces."}
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
        }}>
          <ColumnCelal tr={tr} />
          <ColumnCemal tr={tr} />
        </div>

        {/* Terazi/balance — sayısal denge görsel olarak */}
        {balance && <CelalCemalBalance tr={tr} balance={balance} />}

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
            ? 'Bu sınıflandırma anlatısal bir denge gösterimi için yapılmıştır; bir isim hem celâl hem cemal boyutuna sahip olabilir. Üstteki sayım yalnız 6 + 6 örnek isimle sınırlıdır.'
            : 'This classification is for narrative balance only; a single name can carry both Jalāl and Jamāl dimensions. The count above is limited to the 6 + 6 sample names.'}
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
            <span dir="rtl" lang="ar" style={{ fontFamily: FONTS.quran, fontSize: 'clamp(1.35rem, 1.8vw, 1.6rem)', color: '#c4d0ea', lineHeight: 1.8 }}>
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
            <span dir="rtl" lang="ar" style={{ fontFamily: FONTS.quran, fontSize: 'clamp(1.35rem, 1.8vw, 1.6rem)', color: COLORS.gold, lineHeight: 1.8 }}>
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

// ── CelalCemalBalance ─────────────────────────────────────────────────────────
// 6 Celal + 6 Cemal isminin Kuran'daki TOPLAM geçiş sayılarını yatay bar olarak
// gösterir. İki rengin oranı veri-tabanlı (data.isimler.kuranda_gecis_sayisi
// üzerinden). Sol = mavi-gri (Celal palette), Sağ = altın (Cemal palette).
function CelalCemalBalance({ tr, balance }) {
  const cemalDominant = balance.cemal > balance.celal;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7 }}
      style={{
        marginTop: '36px',
        padding: '22px 24px',
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '12px',
      }}
    >
      <div className="esma-balance-header" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        flexWrap: 'wrap',
        gap: '8px 16px',
        marginBottom: '12px',
        fontSize: '0.74rem',
        fontFamily: FONTS.body,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
      }}>
        <span style={{ color: '#a8b5d4', whiteSpace: 'nowrap' }}>
          {tr ? 'Celal' : 'Jalāl'} · {balance.celal.toLocaleString(tr ? 'tr-TR' : 'en-US')}
        </span>
        <span style={{
          color: COLORS.silver,
          fontStyle: 'italic',
          fontSize: '0.7rem',
          textTransform: 'none',
          letterSpacing: '0.02em',
          whiteSpace: 'nowrap',
          flex: '0 1 auto',
        }}>
          {tr
            ? `${cemalDominant ? 'Cemal' : 'Celal'} ağırlığı: % ${Math.round(cemalDominant ? balance.cemalPct : balance.celalPct)}`
            : `${cemalDominant ? 'Jamāl' : 'Jalāl'} share: ${Math.round(cemalDominant ? balance.cemalPct : balance.celalPct)}%`}
        </span>
        <span style={{ color: COLORS.gold, whiteSpace: 'nowrap' }}>
          {balance.cemal.toLocaleString(tr ? 'tr-TR' : 'en-US')} · {tr ? 'Cemal' : 'Jamāl'}
        </span>
      </div>

      {/* Bar — animasyon ile büyür */}
      <div style={{
        position: 'relative',
        height: '14px',
        borderRadius: '999px',
        overflow: 'hidden',
        background: 'rgba(255,255,255,0.05)',
        display: 'flex',
      }}>
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${balance.celalPct}%` }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
          style={{
            background: 'linear-gradient(90deg, rgba(150,160,200,0.25) 0%, rgba(150,160,200,0.55) 100%)',
            borderRight: '1px solid rgba(255,255,255,0.1)',
            height: '100%',
          }}
        />
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${balance.cemalPct}%` }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 1.1, ease: 'easeOut', delay: 0.15 }}
          style={{
            background: `linear-gradient(90deg, ${COLORS.gold}55 0%, ${COLORS.gold}cc 100%)`,
            height: '100%',
          }}
        />
      </div>

      <p style={{
        marginTop: '14px',
        color: COLORS.silver,
        fontSize: '0.82rem',
        fontStyle: 'italic',
        lineHeight: 1.6,
        margin: '14px 0 0',
      }}>
        {tr
          ? `Bu 12 örnek isimden Cemal grubu Kur'an'da yaklaşık ${Math.round(balance.cemal / balance.celal * 10) / 10}× daha sık geçer — Allah kendisini şefkat ve mağfiretle daha sık tanıtır.`
          : `Among these 12 sample names, the Jamāl group appears about ${Math.round(balance.cemal / balance.celal * 10) / 10}× more often in the Quran — God describes Himself through mercy and forgiveness more frequently.`}
      </p>
    </motion.div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SECTION 3: ÜÇ TOPLAYICI BEYAN — Âyetü'l-Kürsî · Haşr 59:22-24 · İhlâs 112
// ═════════════════════════════════════════════════════════════════════════════

const AYET_KURSI = {
  ref: 'Bakara 2:255',
  refEn: 'Baqara 2:255',
  title: 'Âyetü\'l-Kürsî',
  titleEn: 'Āyat al-Kursī',
  playRange: { surah: 2, from: 255, to: 255 },
  intro: 'Allah\'ın zatını uyuklamayan, tüm evreni canlı tutan sarsılmaz bir güç olarak tanımlayan en meşhur ayet.',
  introEn: 'The most famous verse describing God as the unsleeping, ever-sustaining power who holds all existence.',
  arabic: 'ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ ۚ لَا تَأْخُذُهُۥ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُۥ مَا فِى ٱلسَّمَٰوَٰتِ وَمَا فِى ٱلْأَرْضِ ۗ مَن ذَا ٱلَّذِى يَشْفَعُ عِندَهُۥٓ إِلَّا بِإِذْنِهِۦ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَىْءٍ مِّنْ عِلْمِهِۦٓ إِلَّا بِمَا شَآءَ ۚ وَسِعَ كُرْسِيُّهُ ٱلسَّمَٰوَٰتِ وَٱلْأَرْضَ ۖ وَلَا يَـُٔودُهُۥ حِفْظُهُمَا ۚ وَهُوَ ٱلْعَلِىُّ ٱلْعَظِيمُ',
  mealTr: "Allah, O'ndan başka tanrı yoktur; O, Hayy'dır, Kayyûm'dur. Kendisine ne uyku gelir ne de uyuklama. Göklerde ve yerdekilerin hepsi O'nundur. İzni olmadan O'nun katında kim şefaat edebilir? O, kullarının yaptıklarını ve yapacaklarını bilir. (O'na hiçbir şey gizli kalmaz.) O'nun bildirdiklerinin dışında insanlar O'nun ilminden hiçbir şeyi tam olarak bilemezler. O'nun kürsüsü gökleri ve yeri içine alır, onları koruyup gözetmek kendisine zor gelmez. O, yücedir, büyüktür.",
  mealEn: "Allah — there is no deity except Him, the Ever-Living, the Sustainer of all existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is before them and what will be after them, and they encompass not a thing of His knowledge except for what He wills. His Kursī extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great.",
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
  playRange: { surah: 59, from: 22, to: 24 },
  intro: "Kur'an'da ilahî isimlerin en yoğun kümelendiği beyan — 14 isim peş peşe.",
  introEn: "The densest gathering of divine names in the Quran — 14 names in succession.",
  arabic: 'هُوَ ٱللَّهُ ٱلَّذِى لَآ إِلَٰهَ إِلَّا هُوَ ۖ عَٰلِمُ ٱلْغَيْبِ وَٱلشَّهَٰدَةِ ۖ هُوَ ٱلرَّحْمَٰنُ ٱلرَّحِيمُ ۝ هُوَ ٱللَّهُ ٱلَّذِى لَآ إِلَٰهَ إِلَّا هُوَ ٱلْمَلِكُ ٱلْقُدُّوسُ ٱلسَّلَٰمُ ٱلْمُؤْمِنُ ٱلْمُهَيْمِنُ ٱلْعَزِيزُ ٱلْجَبَّارُ ٱلْمُتَكَبِّرُ ۚ سُبْحَٰنَ ٱللَّهِ عَمَّا يُشْرِكُونَ ۝ هُوَ ٱللَّهُ ٱلْخَٰلِقُ ٱلْبَارِئُ ٱلْمُصَوِّرُ ۖ لَهُ ٱلْأَسْمَآءُ ٱلْحُسْنَىٰ ۚ يُسَبِّحُ لَهُۥ مَا فِى ٱلسَّمَٰوَٰتِ وَٱلْأَرْضِ ۖ وَهُوَ ٱلْعَزِيزُ ٱلْحَكِيمُ',
  mealTr: "(22) O, öyle Allah'tır ki, O'ndan başka tanrı yoktur. Görülmeyeni ve görüleni bilendir. O, esirgeyendir, bağışlayandır. ۝(23) O, öyle Allah'tır ki, kendisinden başka hiçbir tanrı yoktur. O, mülkün sahibidir, eksiklikten münezzehtir, selamet verendir, emniyete kavuşturandır, gözetip koruyandır, üstündür, istediğini zorla yaptırandır, büyüklükte eşi olmayandır. Allah, müşriklerin ortak koştukları şeylerden münezzehtir. ۝(24) O, yaratan, var eden, şekil veren Allah'tır. En güzel isimler O'nundur. Göklerde ve yerde olanlar O'nun şanını yüceltmektedirler. O, galiptir, hikmet sahibidir.",
  mealEn: "(22) He is Allah, other than whom there is no deity, Knower of the unseen and the witnessed. He is the Entirely Merciful, the Especially Merciful. ۝(23) He is Allah, other than whom there is no deity, the Sovereign, the Pure, the Perfection, the Bestower of Faith, the Overseer, the Exalted in Might, the Compeller, the Superior. Exalted is Allah above whatever they associate with Him. ۝(24) He is Allah, the Creator, the Inventor, the Fashioner; to Him belong the best names. Whatever is in the heavens and earth is exalting Him. And He is the Exalted in Might, the Wise.",
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
    { ar: 'ٱلْحَكِيمُ',   tr: 'El-Hakîm',      en: 'al-Ḥakīm'      },
  ],
};

const IHLAS_VERSE = {
  ref: 'İhlâs 112:1-4',
  refEn: 'Ikhlāṣ 112:1-4',
  title: 'İhlâs Suresi',
  titleEn: 'Sūrat al-Ikhlāṣ',
  playRange: { surah: 112, from: 1, to: 4 },
  intro: "Mutlak teklik — negatif tanım ile eşsizlik (Ehad + Samed + 'kimseden doğmamış, kimseyi doğurmamış').",
  introEn: "Absolute oneness — uniqueness through negative description (al-Aḥad + aṣ-Ṣamad + 'neither begotten nor begetting').",
  arabic: 'قُلْ هُوَ ٱللَّهُ أَحَدٌ ۝ ٱللَّهُ ٱلصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌۢ',
  mealTr: "(1) De ki: O, Allah birdir. ۝(2) Allah sameddir. ۝(3) O, doğurmamış ve doğmamıştır. ۝(4) Onun hiçbir dengi yoktur.",
  mealEn: "(1) Say: He is Allah, the One. ۝(2) Allah, the Eternal Refuge. ۝(3) He neither begets nor is born. ۝(4) Nor is there to Him any equivalent.",
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
        <div style={sectionLabel}>{tr ? 'Üç Toplayıcı Beyan' : 'Three Comprehensive Statements'}</div>
        <h2 style={{
          fontFamily: FONTS.display,
          fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
          color: COLORS.offWhite,
          fontWeight: 700,
          margin: '0 0 50px',
          maxWidth: '720px',
        }}>
          {tr ? "Allah'ın Kendini En Yoğun Tanıttığı Üç Beyan" : "The Three Statements Where Divine Names Cluster Most Densely"}
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
  // Audio playback state — her FlagshipCard kendi sequence'ını yönetir.
  // liveRef: unmount/stop'ta in-flight playback'i iptal etmek için.
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);
  const liveRef = useRef(false);

  // Cleanup on unmount — eğer card unmount olurken audio çalıyorsa durdur.
  useEffect(() => () => {
    liveRef.current = false;
    if (audioRef.current) { audioRef.current.onerror = null; audioRef.current.pause(); }
  }, []);

  const stopAudio = () => {
    liveRef.current = false;
    if (audioRef.current) { audioRef.current.onerror = null; audioRef.current.pause(); audioRef.current = null; }
    setPlaying(false);
  };

  const playOne = (surah, ayah, onEnded, onFailed) => {
    const urls = buildFallbackUrls(surah, ayah);
    const tryUrl = (i) => {
      if (i >= urls.length) { onFailed(); return; }
      const a = new Audio(urls[i]);
      audioRef.current = a;
      a.onended = onEnded;
      a.onerror = () => {
        if (audioRef.current !== a) return;
        a.onerror = null;
        tryUrl(i + 1);
      };
      a.play().catch(err => {
        if (err?.name === 'AbortError') return;
        if (audioRef.current !== a) return;
        tryUrl(i + 1);
      });
    };
    tryUrl(0);
  };

  const togglePlay = () => {
    if (playing) { stopAudio(); return; }
    if (!verse.playRange) return;
    const { surah, from, to } = verse.playRange;
    liveRef.current = true;
    setPlaying(true);
    let ayah = from;
    const next = () => {
      if (!liveRef.current || ayah > to) {
        if (liveRef.current) { liveRef.current = false; setPlaying(false); }
        return;
      }
      const a = ayah;
      playOne(surah, a,
        () => { if (liveRef.current) { ayah++; next(); } },
        () => { if (liveRef.current) { ayah++; next(); } } // skip failed, continue
      );
    };
    next();
  };

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
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
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

        {/* Play / Stop button */}
        {verse.playRange && (
          <button
            type="button"
            onClick={togglePlay}
            aria-label={playing
              ? (tr ? 'Tilaveti durdur' : 'Stop recitation')
              : (tr ? 'Tilaveti dinle' : 'Listen to recitation')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: playing ? `${COLORS.gold}22` : `${COLORS.gold}10`,
              border: `1px solid ${COLORS.gold}55`,
              color: COLORS.gold,
              cursor: 'pointer',
              transition: 'all 0.2s',
              marginLeft: '6px',
              flexShrink: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = `${COLORS.gold}33`; }}
            onMouseLeave={e => { e.currentTarget.style.background = playing ? `${COLORS.gold}22` : `${COLORS.gold}10`; }}
          >
            {playing ? (
              // Stop icon (square)
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <rect x="5" y="5" width="14" height="14" rx="1.5" />
              </svg>
            ) : (
              // Play icon (triangle)
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 4.5v15l13-7.5z" />
              </svg>
            )}
          </button>
        )}

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
          textAlign: 'right',
        }}
      >
        {highlightNames(verse.arabic, verse.highlighted)}
      </div>

      {(verse.mealTr || verse.mealEn) && (
        <div style={{
          padding: '20px 0',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}>
          <p style={{
            color: COLORS.offWhite,
            fontFamily: FONTS.body,
            fontSize: '0.95rem',
            lineHeight: 1.9,
            margin: '0 0 8px',
            fontStyle: 'italic',
          }}>
            "{tr ? verse.mealTr : verse.mealEn}"
          </p>
          <p style={{
            color: COLORS.silver,
            fontFamily: FONTS.body,
            fontSize: '0.72rem',
            margin: 0,
            letterSpacing: '0.06em',
            opacity: 0.7,
          }}>
            {tr ? '— Diyanet meali' : '— Sahih International'}
          </p>
        </div>
      )}

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
            <FreqBar key={n.isim} item={n} max={maxCount} tr={tr} rank={i + 1} />
          ))}
        </div>

        {/* Allah lemma vs surface count — daima görünür, click-toggle değil. */}
        <AllahLemmaNote tr={tr} />
      </div>
    </section>
  );
}

function FreqBar({ item, max, tr, rank }) {
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
      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
        <span style={{ color: COLORS.offWhite, fontSize: '0.85rem', fontFamily: FONTS.body, fontWeight: 700 }}>
          {item.displayCount.toLocaleString(tr ? 'tr-TR' : 'en-US')}
        </span>
        {isAllah && (
          // ⓘ — sadece görsel ipucu, sayım hakkında açıklamanın altta
          // olduğunu işaret eder. Tıklanmaz; bilgi zaten kalıcı görünür.
          <span
            aria-hidden="true"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              background: `${COLORS.gold}22`,
              border: `1px solid ${COLORS.gold}55`,
              color: COLORS.gold,
              fontSize: '0.78rem',
              lineHeight: 1,
              flexShrink: 0,
            }}
          >
            ⓘ
          </span>
        )}
      </span>
    </motion.div>
  );
}

function AllahLemmaNote({ tr }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6 }}
      style={{
        marginTop: '32px',
        ...GLASS_CARD,
        background: `linear-gradient(135deg, ${COLORS.gold}11, rgba(255,255,255,0.04))`,
        border: `1px solid ${COLORS.gold}44`,
        padding: '24px 28px',
        position: 'relative',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '22px',
          height: '22px',
          borderRadius: '50%',
          background: `${COLORS.gold}22`,
          border: `1px solid ${COLORS.gold}55`,
          color: COLORS.gold,
          fontSize: '0.95rem',
          lineHeight: 1,
          flexShrink: 0,
        }}>ⓘ</span>
        <span style={{ ...sectionLabel, marginBottom: 0 }}>{tr ? 'Bu sayı nereden geliyor?' : 'Where does this number come from?'}</span>
        <span dir="rtl" lang="ar" style={{ fontFamily: FONTS.quran, fontSize: '1.4rem', color: COLORS.gold, lineHeight: 1, marginLeft: 'auto' }}>
          ٱللَّه
        </span>
      </div>
      <p style={{ color: COLORS.silver, fontSize: '0.85rem', lineHeight: 1.6, margin: '0 0 16px', fontStyle: 'italic' }}>
        {tr
          ? "Yukarıdaki Allah satırında 2.699 yazıyor. Bu sayı klasik konkordansa dayanır ve metodolojik bir tercih içerir:"
          : "The Allah row above shows 2,699. This figure is based on the classical concordance and reflects a methodological choice:"}
      </p>
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
// SECTION 5: İSİM ÇİFTLERİ — Kur'an'da birlikte geçen klasik isim/sıfat
// pair'leri. Sayılar: M. Fuâd Abdülbâkî, el-Mu'cemu'l-Müfehres (klasik
// konkordans). Her pair, mushafta tek seferlik ardışık (ardarda gelen iki sıfat)
// olarak geçen ayetler sayılır.
//
// TODO (v2): Her pair için doğrulanmış ayet referansları listesi. Build script:
// scripts/build-name-pairs.mjs — verse-graph-bgem3.json üzerinden surface-form
// regex match'i + manual annotation. Şu an sadece klasik konkordans sayıları.
// ═════════════════════════════════════════════════════════════════════════════

// 114 sure Türkçe ad listesi — pair expand görünümünde sure adlarını TR/EN
// dile göre doğru göstermek için. (QuranRhetoric.jsx ile aynı liste; refactor
// için shared lib'e taşınabilir — şimdilik inline tutuldu.)
const SURAH_NAMES_TR = [
  'Fatiha','Bakara','Âl-i İmrân','Nisâ','Mâide','En\'âm','A\'râf','Enfâl','Tevbe','Yûnus',
  'Hûd','Yûsuf','Ra\'d','İbrâhim','Hicr','Nahl','İsrâ','Kehf','Meryem','Tâ-Hâ',
  'Enbiyâ','Hac','Mü\'minûn','Nûr','Furkân','Şuarâ','Neml','Kasas','Ankebût','Rûm',
  'Lokman','Secde','Ahzâb','Sebe\'','Fâtır','Yâsîn','Sâffât','Sâd','Zümer','Mü\'min',
  'Fussilet','Şûrâ','Zuhruf','Duhân','Câsiye','Ahkâf','Muhammed','Fetih','Hucurât','Kâf',
  'Zâriyât','Tûr','Necm','Kamer','Rahmân','Vâkıa','Hadîd','Mücâdele','Haşr','Mümtehine',
  'Saf','Cuma','Münafikun','Teğâbün','Talâk','Tahrîm','Mülk','Kalem','Hâkka','Meâric',
  'Nûh','Cin','Müzzemmil','Müddessir','Kıyâme','İnsan','Mürselât','Nebe\'','Nâziât','Abese',
  'Tekvir','İnfitâr','Mutaffifin','İnşikâk','Bürûc','Târık','A\'lâ','Gâşiye','Fecr','Beled',
  'Şems','Leyl','Duhâ','İnşirâh','Tîn','Alak','Kadr','Beyyine','Zilzâl','Âdiyât',
  'Kâria','Tekâsür','Asr','Hümeze','Fîl','Kureyş','Mâûn','Kevser','Kâfirûn','Nasr',
  'Tebbet','İhlâs','Felak','Nâs',
];

// count field'i KALDIRILDI — artık esma-pairs-ayetler.json'daki foundCount
// kullanılır (substring tarama sonucu, tüm i'rab varyantları + ters sıra dahil).
// Klasik konkordans değerleri farklı kaynaklarda çelişkili çıktığı için tek
// kanonik kaynak: QuranCodex korpusu.
const NAME_PAIRS = [
  {
    id: 'gafur-rahim',
    arabic: 'الْغَفُورُ الرَّحِيمُ',
    trName: 'El-Gafûr · Er-Rahîm',
    enName: 'al-Ghafūr · ar-Raḥīm',
    trMeaning: 'Bağışlayan + Merhametli',
    enMeaning: 'The Forgiving + The Merciful',
    trGloss: 'Hatadan dönüş, soğuk bir affedilme değil; kucaklanmadır.',
    enGloss: 'Return from error is not met with cold pardon, but with embrace.',
  },
  {
    id: 'semi-basir',
    arabic: 'السَّمِيعُ الْبَصِيرُ',
    trName: "Es-Semî' · El-Basîr",
    enName: 'as-Samīʿ · al-Baṣīr',
    trMeaning: 'İşiten + Gören',
    enMeaning: 'The All-Hearing + The All-Seeing',
    trGloss: 'Algı bölünmez — duyu organına bağlı değil, kuşatıcıdır.',
    enGloss: 'Perception is undivided — not bound by organs, but all-encompassing.',
  },
  {
    id: 'aziz-hakim',
    arabic: 'الْعَزِيزُ الْحَكِيمُ',
    trName: 'El-Azîz · El-Hakîm',
    enName: 'al-ʿAzīz · al-Ḥakīm',
    trMeaning: 'Üstün + Hikmet sahibi',
    enMeaning: 'The Almighty + The Wise',
    trGloss: 'Kudret keyfî değil — daima hikmetle dengelidir.',
    enGloss: 'Might is never arbitrary — always paired with wisdom.',
  },
  {
    id: 'alim-hakim',
    arabic: 'الْعَلِيمُ الْحَكِيمُ',
    trName: 'El-Alîm · El-Hakîm',
    enName: 'al-ʿAlīm · al-Ḥakīm',
    trMeaning: 'Bilen + Hikmet sahibi',
    enMeaning: 'The Knowing + The Wise',
    trGloss: 'Bilgi yığın değil — anlam ve hüküm üreten bir hikmettir.',
    enGloss: 'Knowledge is not accumulation — it yields meaning and judgment.',
  },
  {
    id: 'tevvab-rahim',
    arabic: 'التَّوَّابُ الرَّحِيمُ',
    trName: 'Et-Tevvâb · Er-Rahîm',
    enName: 'at-Tawwāb · ar-Raḥīm',
    trMeaning: 'Tövbeleri kabul eden + Merhametli',
    enMeaning: 'Accepting of repentance + The Merciful',
    trGloss: 'Tövbe kapısı kapanmaz — açan ve karşılayan aynı şefkattir.',
    enGloss: 'The door of repentance never closes — the One who opens and receives is the same mercy.',
  },
  // ── v2 ek pair'ler (build-name-pairs.mjs ile doğrulanmış) ──────────────────
  {
    id: 'rauf-rahim',
    arabic: 'الرَّؤُوفُ الرَّحِيمُ',
    trName: 'Er-Raûf · Er-Rahîm',
    enName: 'ar-Raʾūf · ar-Raḥīm',
    trMeaning: 'Çok şefkatli + Çok merhametli',
    enMeaning: 'Most kind + Most merciful',
    // Râzî & Râgıb el-İsfahanî: Râfet = acıyı uzaklaştırma; Rahmet = iyiliği
    // verme. Önce acı kalkar, sonra iyilik gelir.
    trGloss: 'Râfet acıyı uzaklaştırır, rahmet iyiliği verir — önce yara dindirilir, sonra hediye.',
    enGloss: 'Raʾfa removes pain, raḥma bestows kindness — the wound is soothed first, then the gift arrives.',
  },
  {
    id: 'vasi-alim',
    arabic: 'الْوَاسِعُ الْعَلِيمُ',
    trName: "El-Vâsi' · El-Alîm",
    enName: 'al-Wāsiʿ · al-ʿAlīm',
    trMeaning: 'Genişliği sınırsız + Bilgisi kuşatıcı',
    enMeaning: 'Boundlessly vast + All-encompassing in knowledge',
    // Râgıb el-İsfahanî: vüsʿat hem rahmet/rızık hem ilim genişliği. Sınırsız
    // genişlik + ihmali olmayan dikkat.
    trGloss: 'Sınırsız genişlik ve ihmali olmayan dikkat — rahmet kuşatıcıdır, gözden kaçan yoktur.',
    enGloss: 'Boundless expanse with attention that misses nothing — mercy encompasses, nothing escapes notice.',
  },
  {
    id: 'latif-habir',
    arabic: 'اللَّطِيفُ الْخَبِيرُ',
    trName: 'El-Latîf · El-Habîr',
    enName: 'al-Laṭīf · al-Khabīr',
    trMeaning: 'En ince ayrıntıya nüfuz eden + Her şeyden haberdar',
    enMeaning: 'Penetrating subtlety + Aware of all',
    // Mülk 67:14, En'âm 6:103. Latîf hem "iyilik eden" hem "ince/gözden kaçan".
    // İnce + haberdar = görünmeyene erişen lütuf.
    trGloss: 'Görünmeyenin içine sızar, bilinmeyene erişir — lütuf ve bilgi birleşir.',
    enGloss: 'Penetrates the unseen, reaches the unknown — gentleness and awareness merged.',
  },
  {
    id: 'gafur-sekur',
    arabic: 'الْغَفُورُ الشَّكُورُ',
    trName: 'El-Gafûr · Eş-Şekûr',
    enName: 'al-Ghafūr · ash-Shakūr',
    trMeaning: 'Büyük hatayı affeden + Küçük iyiliği takdir eden',
    enMeaning: 'Forgives great error + Appreciates small good',
    // Fâtır 35:30, Şûrâ 42:23, Teğâbun 64:17. Klasik tefsirde dikkat çekilen
    // tezat: hata silinir, hayır kat kat artırılır.
    trGloss: 'Hata silinir, küçük hayır kat kat artırılır — hesaplama Allah\'a göre asimetriktir.',
    enGloss: 'Errors are erased, small acts of good are multiplied — His accounting is asymmetric in our favor.',
  },
];

function NamePairs({ tr, pairsData, triplesData }) {
  // pairsData JSON'undan ref→ayet listesi map'i kur
  const ayetlerById = useMemo(() => {
    if (!pairsData?.pairs) return {};
    return Object.fromEntries(pairsData.pairs.map(p => [p.id, p]));
  }, [pairsData]);

  // foundCount'a göre azalan sırada — JSON yüklenmemişse NAME_PAIRS sırası
  // (hardcoded yedek). Yüklendikten sonra otomatik yeniden sıralanır.
  const sortedPairs = useMemo(() => {
    if (!pairsData?.pairs) return NAME_PAIRS;
    return [...NAME_PAIRS].sort((a, b) => {
      const ca = ayetlerById[a.id]?.foundCount ?? 0;
      const cb = ayetlerById[b.id]?.foundCount ?? 0;
      return cb - ca;
    });
  }, [pairsData, ayetlerById]);

  return (
    <section style={{
      padding: '90px 24px',
      background: 'linear-gradient(180deg, #06080e 0%, #0a0a1a 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Subtle gold radial backdrop */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse at 50% 30%, ${COLORS.gold}0a 0%, transparent 60%)`,
      }} />

      <div style={{ position: 'relative', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={sectionLabel}>{tr ? 'İsim Çiftleri' : 'Name Pairs'}</div>
        <h2 style={{
          fontFamily: FONTS.display,
          fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
          color: COLORS.offWhite,
          fontWeight: 700,
          margin: '0 0 16px',
          maxWidth: '780px',
          letterSpacing: '-0.01em',
        }}>
          {tr ? 'İkili Geçen İsimler — Birlikte Üretilen Anlam' : 'Names That Travel Together'}
        </h2>
        <p style={{
          color: COLORS.silver,
          fontSize: '1.02rem',
          lineHeight: 1.75,
          margin: '0 0 12px',
          maxWidth: '760px',
        }}>
          {tr
            ? "Kur'an'da bazı isimler ayet sonunda ardı ardına geçer. Bu yan yana geliş tesadüfi değildir: her çift, tek bir ismin söyleyemediği bir anlamı birlikte taşır. Aşağıda klasik konkordansın işaret ettiği en sık beş ikili."
            : 'Some names appear back-to-back at verse endings throughout the Quran. This pairing is not accidental: each pair carries a meaning neither name could carry alone. Below are the five most frequent pairs from classical concordance.'}
        </p>
        <p style={{
          color: `${COLORS.gold}99`,
          fontSize: '0.78rem',
          fontFamily: FONTS.body,
          letterSpacing: '0.08em',
          margin: '0 0 28px',
          maxWidth: '760px',
        }}>
          {tr
            ? "Sayım: QuranCodex korpusu — tüm i'rab varyantları (nominative · accusative tanvin · definite · lām emphasis) ve gerekli yerde ters sıra dahil substring tarama."
            : 'Counting: QuranCodex corpus — substring scan covering all iʿrāb variants (nominative · accusative tanwīn · definite · lām emphasis) with reverse order where applicable.'}
        </p>

        {/* Fâsıla bulgusu — siyak-sibak veri kanıtı */}
        {pairsData?.positionStats?.total > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6 }}
            style={{
              background: `linear-gradient(135deg, ${COLORS.gold}14 0%, ${COLORS.gold}08 100%)`,
              border: `1px solid ${COLORS.gold}38`,
              borderRadius: '12px',
              padding: '18px 22px',
              margin: '0 0 44px',
              maxWidth: '780px',
              display: 'flex',
              alignItems: 'center',
              gap: '18px',
            }}
          >
            {/* Mini şerit: ayet ekseni, son %25 vurgulu */}
            <div style={{
              position: 'relative',
              flexShrink: 0,
              width: '110px',
              height: '6px',
              borderRadius: '999px',
              background: 'rgba(255,255,255,0.08)',
              overflow: 'hidden',
            }}
              aria-hidden="true"
            >
              <div style={{
                position: 'absolute',
                top: 0, right: 0, bottom: 0,
                width: '25%',
                background: `linear-gradient(90deg, ${COLORS.gold}66 0%, ${COLORS.gold} 100%)`,
                boxShadow: `0 0 12px ${COLORS.gold}44`,
              }} />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                color: COLORS.gold,
                fontFamily: FONTS.body,
                fontSize: '0.95rem',
                fontWeight: 700,
                letterSpacing: '0.01em',
                marginBottom: '4px',
              }}>
                {tr
                  ? `% ${pairsData.positionStats.endPercent} ayet sonu (fâsıla)`
                  : `${pairsData.positionStats.endPercent}% at verse end (fāṣila)`}
              </div>
              <div style={{
                color: COLORS.silver,
                fontFamily: FONTS.body,
                fontSize: '0.84rem',
                lineHeight: 1.55,
              }}>
                {tr
                  ? <>İncelenen <strong style={{ color: COLORS.offWhite }}>{pairsData.positionStats.total}</strong> geçişin tamamı ayetin son çeyreğinde — çiftler ayet metnine değil, kapanış mührüne yerleşir.</>
                  : <>All <strong style={{ color: COLORS.offWhite }}>{pairsData.positionStats.total}</strong> occurrences scanned land in the final quarter of the verse — pairs sit not in the body but on the closing seal.</>}
              </div>
            </div>
          </motion.div>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
        }}>
          {sortedPairs.map((p, i) => (
            <PairCard
              key={p.id}
              pair={p}
              tr={tr}
              index={i}
              verseData={ayetlerById[p.id]}
            />
          ))}
        </div>

        {/* Üçlüden Ötesi — Âyetü'l-Kürsî dört-isim mührü vurgusu */}
        {triplesData?.triples?.[0] && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7 }}
            style={{
              marginTop: '40px',
              background: `linear-gradient(135deg, ${COLORS.gold}18 0%, ${COLORS.gold}06 100%)`,
              border: `1px solid ${COLORS.gold}3a`,
              borderRadius: '14px',
              padding: 'clamp(22px, 3vw, 30px) clamp(22px, 3vw, 32px)',
              maxWidth: '900px',
            }}
          >
            <div style={{
              color: `${COLORS.gold}aa`,
              fontFamily: FONTS.body,
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginBottom: '10px',
            }}>
              {tr ? 'Üçlüden Ötesi' : 'Beyond the Pair'}
            </div>
            <p
              dir="rtl"
              lang="ar"
              style={{
                fontFamily: FONTS.quran,
                fontSize: 'clamp(1.35rem, 2.4vw, 1.75rem)',
                color: COLORS.gold,
                lineHeight: 2,
                margin: '0 0 16px',
                textAlign: 'right',
                textShadow: `0 0 24px ${COLORS.gold}22`,
              }}
            >
              {triplesData.triples[0].arabic}
            </p>
            <p style={{
              color: COLORS.offWhite,
              fontFamily: FONTS.body,
              fontSize: 'clamp(0.95rem, 1.4vw, 1.05rem)',
              fontWeight: 600,
              margin: '0 0 6px',
            }}>
              {tr ? triplesData.triples[0].trName : triplesData.triples[0].enName}
            </p>
            <p style={{
              color: `${COLORS.gold}cc`,
              fontFamily: FONTS.body,
              fontSize: '0.86rem',
              letterSpacing: '0.02em',
              margin: '0 0 14px',
            }}>
              {tr ? triplesData.triples[0].trMeaning : triplesData.triples[0].enMeaning}
            </p>
            <p style={{
              color: COLORS.silver,
              fontFamily: FONTS.body,
              fontSize: '0.92rem',
              lineHeight: 1.7,
              fontStyle: 'italic',
              margin: 0,
            }}>
              {tr ? triplesData.triples[0].trGloss : triplesData.triples[0].enGloss}
            </p>
            {triplesData.triples[0].ayetler?.length > 0 && (
              <div style={{
                marginTop: '14px',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
              }}>
                {triplesData.triples[0].ayetler.map(a => (
                  <span key={a.ref} style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '5px 11px',
                    borderRadius: '999px',
                    background: `${COLORS.gold}14`,
                    border: `1px solid ${COLORS.gold}3a`,
                    color: COLORS.gold,
                    fontFamily: FONTS.body,
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                  }}>
                    {tr ? (SURAH_NAMES_TR[a.surah - 1] || a.surahName) : a.surahNameEn} {a.ref}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Metodolojik nüans — pattern detayları */}
        {pairsData && (
          <p style={{
            marginTop: '40px',
            color: COLORS.silver,
            fontSize: '0.82rem',
            fontStyle: 'italic',
            opacity: 0.75,
            maxWidth: '780px',
            lineHeight: 1.75,
          }}>
            {tr
              ? "Yöntem: Her ayet, harekeleri çıkarılmış surface form üzerinde regex pattern ile taranır. Pattern; lām al-tawkīd prefix'i (لـ), definite article (ال), ve accusative tanvin sonunu opsiyonel kabul eder — böylece 'لغفور رحيم' (Tâhâ 20:82), 'غفورا رحيما' (Nisâ 4:96) ve 'الغفور الرحيم' (Sebe 34:2) formlarının hepsi yakalanır. Gafûr-Rahîm ve Alîm-Hakîm gibi çiftlerde ters sıra ('الرحيم الغفور') da sayılır. Semî'-Basîr için ters sıra dahil edilmedi: Hûd 11:24'teki 'الْبَصِيرُ وَالسَّمِيعُ' zıtlık karşılaştırmasıdır, Esmâ çifti değildir."
              : "Method: Each verse is scanned on a diacritic-stripped surface form using regex patterns. The pattern allows optional lām al-tawkīd prefix (li-), definite article (al-), and accusative tanwīn ending — so 'la-ghafūr raḥīm' (Ṭāhā 20:82), 'ghafūran raḥīman' (Nisāʾ 4:96), and 'al-ghafūr al-raḥīm' (Sabaʾ 34:2) are all captured. For pairs like Ghafūr-Raḥīm and ʿAlīm-Ḥakīm, reverse order is also counted. Reverse not included for Samīʿ-Baṣīr: Hūd 11:24's 'al-baṣīr wa-l-samīʿ' is a contrast comparison, not a name pair."}
          </p>
        )}
      </div>
    </section>
  );
}

function PairCard({ pair, tr, index, verseData }) {
  const [expanded, setExpanded] = useState(false);
  const ayetler = verseData?.ayetler || [];
  const foundCount = verseData?.foundCount ?? null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: index * 0.06 }}
      style={{
        ...GLASS_CARD,
        padding: '28px 24px 24px',
        borderRadius: '14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Count badge — top right. Sayı esma-pairs-ayetler.json'dan gelir
          (korpus tarama). JSON yüklenmediyse badge gizlenir — yanıltıcı
          "0 ayet" göstermek yerine sessiz ol. */}
      {foundCount !== null && (
        <div style={{
          position: 'absolute',
          top: '14px',
          right: '14px',
          display: 'flex',
          alignItems: 'baseline',
          gap: '6px',
          background: `${COLORS.gold}14`,
          border: `1px solid ${COLORS.gold}33`,
          borderRadius: '999px',
          padding: '5px 11px',
        }}>
          <span style={{
            color: COLORS.gold,
            fontFamily: FONTS.body,
            fontSize: '0.95rem',
            fontWeight: 700,
            letterSpacing: '0.02em',
          }}>
            {foundCount}
          </span>
          <span style={{
            color: `${COLORS.gold}aa`,
            fontFamily: FONTS.body,
            fontSize: '0.66rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}>
            {tr ? 'ayet' : 'verses'}
          </span>
        </div>
      )}

      {/* Arabic combined */}
      <p
        dir="rtl"
        lang="ar"
        style={{
          fontFamily: FONTS.quran,
          fontSize: 'clamp(1.55rem, 2.6vw, 1.85rem)',
          color: COLORS.gold,
          lineHeight: 2,
          margin: '6px 0 0',
          textShadow: `0 0 22px ${COLORS.gold}1c`,
          paddingRight: '52px', // count badge'e yer
        }}
      >
        {pair.arabic}
      </p>

      {/* Transliterated name */}
      <p style={{
        color: COLORS.offWhite,
        fontFamily: FONTS.body,
        fontSize: '1rem',
        fontWeight: 600,
        letterSpacing: '0.01em',
        margin: 0,
      }}>
        {tr ? pair.trName : pair.enName}
      </p>

      {/* Meaning */}
      <p style={{
        color: `${COLORS.gold}cc`,
        fontFamily: FONTS.body,
        fontSize: '0.85rem',
        letterSpacing: '0.04em',
        margin: 0,
      }}>
        {tr ? pair.trMeaning : pair.enMeaning}
      </p>

      {/* Divider */}
      <div style={{
        height: '1px',
        background: `linear-gradient(90deg, ${COLORS.gold}22 0%, transparent 100%)`,
        margin: '4px 0 2px',
      }} />

      {/* Gloss — kısa teolojik yorum */}
      <p style={{
        color: COLORS.silver,
        fontFamily: FONTS.body,
        fontSize: '0.88rem',
        lineHeight: 1.6,
        fontStyle: 'italic',
        margin: 0,
      }}>
        {tr ? pair.trGloss : pair.enGloss}
      </p>

      {/* Expand toggle — sadece verse data yüklü ise */}
      {ayetler.length > 0 && (
        <>
          <button
            type="button"
            onClick={() => setExpanded(p => !p)}
            style={{
              marginTop: '6px',
              alignSelf: 'flex-start',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: expanded ? `${COLORS.gold}1f` : `${COLORS.gold}10`,
              border: `1px solid ${COLORS.gold}3a`,
              borderRadius: '999px',
              padding: '6px 13px',
              color: COLORS.gold,
              fontFamily: FONTS.body,
              fontSize: '0.74rem',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = `${COLORS.gold}24`; }}
            onMouseLeave={e => { e.currentTarget.style.background = expanded ? `${COLORS.gold}1f` : `${COLORS.gold}10`; }}
            aria-expanded={expanded}
          >
            <span>
              {expanded
                ? (tr ? 'Listeyi gizle' : 'Hide list')
                : (tr ? `Tüm ${foundCount} ayeti göster` : `Show all ${foundCount} verses`)}
            </span>
            <span style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', lineHeight: 1, fontSize: '0.7rem' }}>▾</span>
          </button>

          {expanded && (
            <div style={{
              marginTop: '12px',
              maxHeight: '380px',
              overflowY: 'auto',
              paddingRight: '6px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              borderTop: `1px solid ${COLORS.gold}22`,
              paddingTop: '14px',
            }}>
              {ayetler.map(a => (
                <div key={a.ref} style={{
                  background: 'rgba(255,255,255,0.025)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '8px',
                  padding: '12px 14px',
                }}>
                  <div style={{
                    color: COLORS.gold,
                    fontFamily: FONTS.body,
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    marginBottom: '8px',
                  }}>
                    {tr ? (SURAH_NAMES_TR[a.surah - 1] || a.surahName) : a.surahNameEn} {a.ref}
                  </div>
                  {a.arabic && (
                    <p
                      dir="rtl"
                      lang="ar"
                      style={{
                        fontFamily: FONTS.quran,
                        fontSize: '1.05rem',
                        color: COLORS.offWhite,
                        lineHeight: 2,
                        margin: '0 0 8px',
                        opacity: 0.95,
                      }}
                    >
                      {a.arabic}
                    </p>
                  )}
                  <p style={{
                    color: COLORS.offWhite,
                    fontFamily: FONTS.body,
                    fontSize: '0.82rem',
                    lineHeight: 1.6,
                    margin: 0,
                    opacity: 0.88,
                  }}>
                    {tr ? a.turkish : a.english}
                  </p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SECTION 6: VAHYIN SESI — 14 tematik eksen, 6 görünür + 8 expand
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
            ? "Allah kendisini bazen üçüncü şahıs üzerinden, bazen doğrudan birinci şahıs üzerinden (\"Ben\", \"Biz\") tanıtır. Bu beyanlar onun kendi ağzından tanımıdır."
            : "God describes Himself sometimes in the third person, sometimes directly in the first person (\"I\", \"We\"). These statements are His self-description in His own voice."}
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
        fontSize: 'clamp(1.15rem, 1.6vw, 1.3rem)',
        color: COLORS.gold,
        fontWeight: 700,
        margin: '0 0 10px',
      }}>
        {tr ? eks.baslikTr : eks.baslikEn}
      </h3>
      <p style={{
        color: COLORS.silver,
        fontSize: 'clamp(0.86rem, 1.2vw, 0.94rem)',
        fontStyle: 'italic',
        lineHeight: 1.65,
        margin: '0 0 20px',
      }}>
        {tr ? eks.notTr : eks.notEn}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
        {eks.ayetler.slice(0, 3).map(a => (
          <div key={a.id} style={{
            paddingTop: '16px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
          }}>
            <p
              dir="rtl"
              lang="ar"
              style={{
                fontFamily: FONTS.quran,
                fontSize: 'clamp(1.1rem, 1.6vw, 1.35rem)',
                color: COLORS.offWhite,
                lineHeight: 2.35,
                margin: '0 0 12px',
                textAlign: 'right',
              }}
            >
              {a.arapca}
            </p>
            <p style={{ color: COLORS.silver, fontSize: 'clamp(0.84rem, 1.2vw, 0.92rem)', lineHeight: 1.7, margin: '0 0 6px', fontStyle: 'italic' }}>
              "{tr ? a.tr : a.en}"
            </p>
            <p style={{ color: `${COLORS.gold}99`, fontSize: '0.76rem', fontFamily: FONTS.body, margin: 0, letterSpacing: '0.06em' }}>
              — {tr ? (a.sureAdTr || a.sure) : (a.sureAdEn || a.sure)} {a.sure}:{a.ayet}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SECTION 7: KÖK AİLELERİ — 25 kanonik 3-harf kök, türeyen isimler kümelenmiş
// Data: esma-kokler.json (build-name-roots.mjs ile üretilir)
// Klasik kaynaklar: Gazali (el-Maksâdü'l-Esnâ), Râgıb el-İsfahanî (Müfredât)
// ═════════════════════════════════════════════════════════════════════════════

function KokAileleri({ tr, koklerData }) {
  if (!koklerData?.kokler?.length) return null;

  return (
    <section style={{ padding: '80px 24px', background: COLORS.cosmicBlack }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={sectionLabel}>{tr ? 'Kök Aileleri' : 'Root Families'}</div>
        <h2 style={{
          fontFamily: FONTS.display,
          fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
          color: COLORS.offWhite,
          fontWeight: 700,
          margin: '0 0 16px',
          maxWidth: '780px',
          letterSpacing: '-0.01em',
        }}>
          {tr ? 'Bir İsim Tek Başına Anlam Üretmez' : 'A Name Does Not Stand Alone'}
        </h2>
        <p style={{
          color: COLORS.silver,
          fontSize: '1.02rem',
          lineHeight: 1.75,
          margin: '0 0 12px',
          maxWidth: '760px',
        }}>
          {tr
            ? "Arapça'da her isim bir 3-harf köke bağlıdır. Aynı kökten farklı isimler türer, ama hepsi tek bir anlam ailesinin farklı yüzleridir. Aşağıda 25 kanonik kök ve onlardan türeyen Esmâ-i Hüsnâ isimleri."
            : "Every Arabic name traces back to a 3-letter root. Different names emerge from the same root, but all are faces of a single semantic family. Below: 25 canonical roots and the Beautiful Names that derive from them."}
        </p>
        <p style={{
          color: `${COLORS.gold}99`,
          fontSize: '0.78rem',
          fontFamily: FONTS.body,
          letterSpacing: '0.08em',
          margin: '0 0 44px',
          maxWidth: '760px',
        }}>
          {tr
            ? 'Kaynak: Gazali (el-Maksâdü\'l-Esnâ) ve Râgıb el-İsfahanî (Müfredât).'
            : 'Source: al-Ghazālī (al-Maqṣad al-Asnā) and al-Rāghib al-Iṣfahānī (Mufradāt).'}
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '18px',
        }}>
          {koklerData.kokler.map((k, i) => <KokCard key={k.kok} kok={k} tr={tr} index={i} />)}
        </div>

        <p style={{
          marginTop: '40px',
          color: COLORS.silver,
          fontSize: '0.78rem',
          fontStyle: 'italic',
          opacity: 0.75,
          maxWidth: '760px',
          lineHeight: 1.6,
        }}>
          {tr
            ? "Korpus geçiş sayıları (kök ailesinin Kur'an'da yaklaşık toplam görünümü): 3 kök harfinin 0-2 harflik aralıkla ardarda göründüğü tüm geçişler — kesin morfolojik root extraction değil, üst-sınır proxy'sidir."
            : "Corpus occurrence counts (the root family's approximate total in the Quran): all instances where the 3 root letters appear consecutively within a small gap — a proxy upper-bound, not strict morphological extraction."}
        </p>
      </div>
    </section>
  );
}

function KokCard({ kok, tr, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.03 }}
      style={{
        ...GLASS_CARD,
        padding: '22px 22px 20px',
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Üst: kök (spaced) Arapça + sağda corpus sayım */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '12px' }}>
        <span
          dir="rtl"
          lang="ar"
          style={{
            fontFamily: FONTS.quran,
            fontSize: 'clamp(1.6rem, 2.2vw, 1.9rem)',
            color: COLORS.gold,
            letterSpacing: '0.18em',
            lineHeight: 1.3,
            textShadow: `0 0 18px ${COLORS.gold}1c`,
          }}
        >
          {kok.kok}
        </span>
        {kok.corpusGecis > 0 && (
          <span style={{
            display: 'inline-flex',
            alignItems: 'baseline',
            gap: '5px',
            color: `${COLORS.gold}aa`,
            fontFamily: FONTS.body,
            fontSize: '0.72rem',
            letterSpacing: '0.06em',
          }}>
            <strong style={{ color: COLORS.gold, fontWeight: 700, fontSize: '0.85rem' }}>
              ~{kok.corpusGecis.toLocaleString(tr ? 'tr-TR' : 'en-US')}
            </strong>
            {tr ? 'korpus' : 'corpus'}
          </span>
        )}
      </div>

      {/* Anlam tek satır */}
      <p style={{
        color: COLORS.offWhite,
        fontFamily: FONTS.body,
        fontSize: '0.92rem',
        fontWeight: 600,
        lineHeight: 1.5,
        margin: 0,
        letterSpacing: '0.01em',
      }}>
        {tr ? kok.anlamTr : kok.anlamEn}
      </p>

      {/* İsim chip'leri */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {kok.isimler.map(n => (
          <span
            key={n}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '5px 11px',
              borderRadius: '999px',
              background: `${COLORS.gold}14`,
              border: `1px solid ${COLORS.gold}40`,
              color: COLORS.gold,
              fontFamily: FONTS.body,
              fontSize: '0.78rem',
              fontWeight: 600,
              letterSpacing: '0.01em',
            }}
          >
            {n}
          </span>
        ))}
      </div>

      {/* Note */}
      {(tr ? kok.noteTr : kok.noteEn) && (
        <p style={{
          color: COLORS.silver,
          fontFamily: FONTS.body,
          fontSize: '0.82rem',
          lineHeight: 1.6,
          fontStyle: 'italic',
          margin: '4px 0 0',
          opacity: 0.85,
        }}>
          {tr ? kok.noteTr : kok.noteEn}
        </p>
      )}
    </motion.div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SECTION 8: SURE MANZARASI (HEATMAP) — hangi sure hangi isimleri kümeliyor
// Data: esma-surah-heatmap.json (build-surah-name-heatmap.mjs)
// ═════════════════════════════════════════════════════════════════════════════

function SurahNameHeatmap({ tr, heatmapData }) {
  // §14.1 SSR-safe isMobile (initial false, useEffect post-mount hydrate)
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (!heatmapData?.matrix) return null;
  const { names: allNames, surahs, matrix, topSurahIndices } = heatmapData;

  // Mobile: top 8 isim × top 12 sure. Desktop: full top 14 isim × top 20 sure.
  // names listesi zaten frekansa göre desc sıralı (build script).
  // topSurahIndices zaten desc total'a göre seçilmiş 20'lik, mushaf order'lı.
  const NAME_LIMIT = isMobile ? 8 : allNames.length;
  const SURAH_LIMIT = isMobile ? 12 : topSurahIndices.length;
  const names = allNames.slice(0, NAME_LIMIT);

  // Sure subset: top 12 sureleri toplam'a göre seçer, mushaf order'a geri sıralar
  const surahSubsetIndices = isMobile
    ? [...topSurahIndices]
        .map(i => ({ idx: i, total: surahs[i].total }))
        .sort((a, b) => b.total - a.total)
        .slice(0, SURAH_LIMIT)
        .map(x => x.idx)
        .sort((a, b) => a - b)
    : topSurahIndices;

  // Sadece seçili sure × isim subset'i
  const rows = surahSubsetIndices.map(i => ({
    surah: surahs[i],
    counts: matrix[i].slice(0, NAME_LIMIT),
  }));

  // Renk skalası: max'i log-scale yumuşat, küçük değerler de görünür kalsın
  const allCounts = rows.flatMap(r => r.counts);
  const maxCount = Math.max(...allCounts);

  return (
    <section style={{ padding: '80px 24px', background: '#06080e' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={sectionLabel}>{tr ? 'Sure Manzarası' : 'Surah Landscape'}</div>
        <h2 style={{
          fontFamily: FONTS.display,
          fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
          color: COLORS.offWhite,
          fontWeight: 700,
          margin: '0 0 16px',
          maxWidth: '780px',
          letterSpacing: '-0.01em',
        }}>
          {tr ? 'Hangi Sure Hangi İsimleri Kümeliyor?' : 'Which Surah Clusters Which Names?'}
        </h2>
        <p style={{
          color: COLORS.silver,
          fontSize: '1.02rem',
          lineHeight: 1.75,
          margin: '0 0 12px',
          maxWidth: '760px',
        }}>
          {tr
            ? 'En sık görünen isimlerin, en isim-yoğun 20 sure üzerindeki dağılımı. İsim sütunları soldan sağa azalan frekans sırasında (top 20 sure içi toplama göre). Koyu altın hücreler kümelendiği yeri gösterir — Bakara hukuk ekseninde, Şûrâ rahmet, Hadîd kudret diline kayar.'
            : "Distribution of the most frequent names across the 20 most name-dense surahs. Name columns are ordered by descending frequency (within top-20 surahs). Deeper gold cells mark clustering — Bakara leans on jurisprudence, Shūrā on mercy, Ḥadīd on power."}
        </p>
        <p style={{
          color: `${COLORS.gold}99`,
          fontSize: '0.78rem',
          fontFamily: FONTS.body,
          letterSpacing: '0.08em',
          margin: '0 0 30px',
          maxWidth: '760px',
        }}>
          {tr
            ? 'Sayım: QuranCodex korpusu, surface form regex match (lām, ال, accusative tanvin esnek).'
            : 'Counting: QuranCodex corpus, surface form regex match (flexible lām, al-, accusative tanwīn).'}
        </p>

        {/* Heatmap — sticky pattern Grid içinde browser flicker üretiyor.
            Pragmatik karar: maxHeight + sticky kaldırıldı. Heatmap full-height
            doğal şekilde gösterilir, mobile yatay scroll için overflow-x var.
            20 sure × 14 isim toplam ~600px yükseklik, sayfa scroll'una rahatça
            sığar. */}
        <div style={{
          overflowX: 'auto',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '12px',
          padding: '20px',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: `120px repeat(${names.length}, minmax(40px, 1fr))`,
            gap: '3px',
            minWidth: `${120 + names.length * 44 + 32}px`,
          }}>
            <div style={{ height: '88px' }} />
            {names.map(n => (
              <div
                key={n.isim}
                title={`${n.isim} · ${tr ? 'top 20 sure içi' : 'within top 20'}: ${n.top20Total ?? '—'}`}
                style={{
                  color: COLORS.silver,
                  fontFamily: FONTS.body,
                  fontSize: '0.66rem',
                  fontWeight: 600,
                  textAlign: 'center',
                  padding: '6px 2px',
                  writingMode: 'vertical-rl',
                  transform: 'rotate(180deg)',
                  letterSpacing: '0.02em',
                  whiteSpace: 'nowrap',
                  height: '88px',
                }}
              >
                {n.isim}
              </div>
            ))}

            {rows.map(({ surah, counts }, ri) => (
              <Fragment key={surah.surah}>
                <div style={{
                  color: COLORS.offWhite,
                  fontFamily: FONTS.body,
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  padding: '0 8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  textAlign: 'right',
                  whiteSpace: 'nowrap',
                }}>
                  {tr ? (SURAH_NAMES_TR[surah.surah - 1] || surah.surahName) : surah.surahNameEn}
                </div>
                {counts.map((c, ci) => {
                  const intensity = c === 0 ? 0 : Math.min(1, Math.log(1 + c) / Math.log(1 + maxCount));
                  return (
                    <div
                      key={ci}
                      title={`${tr ? (SURAH_NAMES_TR[surah.surah - 1] || surah.surahName) : surah.surahNameEn} · ${names[ci].isim}: ${c}`}
                      style={{
                        background: c === 0
                          ? 'rgba(255,255,255,0.03)'
                          : `rgba(212,165,116,${0.1 + intensity * 0.7})`,
                        border: c === 0
                          ? '1px solid rgba(255,255,255,0.04)'
                          : `1px solid rgba(212,165,116,${0.2 + intensity * 0.3})`,
                        borderRadius: '4px',
                        aspectRatio: '1',
                        minHeight: '28px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: intensity > 0.5 ? '#0a0a1a' : (c === 0 ? 'transparent' : COLORS.gold),
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        fontFamily: FONTS.body,
                      }}
                    >
                      {c > 0 ? c : ''}
                    </div>
                  );
                })}
              </Fragment>
            ))}
          </div>
        </div>

        {/* Top 3 satır özet — "Bakara'da en yoğun..." */}
        <p style={{
          marginTop: '20px',
          color: COLORS.silver,
          fontSize: '0.82rem',
          fontStyle: 'italic',
          opacity: 0.85,
          maxWidth: '780px',
          lineHeight: 1.7,
        }}>
          {tr
            ? "İpucu: Her hücre o ismin o suredeki tekil görünüm sayısıdır. Mobilde yatay kaydırılır. Heatmap top 20 sureyi (en isim-yoğun) içerir — atlama eksikse altta tam atlas'tan ulaşılır."
            : "Tip: Each cell is the name's distinct occurrences in that surah. Scrolls horizontally on mobile. Heatmap includes the top 20 name-dense surahs — for any name, use the full atlas below."}
        </p>

        {/* Şeffaflık notu — fiil/türev vs isim ayrımı */}
        <div style={{
          marginTop: '14px',
          padding: '14px 18px',
          background: `${COLORS.gold}0a`,
          border: `1px solid ${COLORS.gold}28`,
          borderRadius: '10px',
          maxWidth: '780px',
        }}>
          <div style={{
            color: `${COLORS.gold}cc`,
            fontFamily: FONTS.body,
            fontSize: '0.68rem',
            fontWeight: 700,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            marginBottom: '6px',
          }}>
            {tr ? 'Sayma kuralı' : 'Counting rule'}
          </div>
          <p style={{
            color: COLORS.silver,
            fontFamily: FONTS.body,
            fontSize: '0.82rem',
            lineHeight: 1.7,
            margin: 0,
          }}>
            {tr
              ? <>Sadece <strong style={{ color: COLORS.offWhite }}>isim formları</strong> sayılır — fiil çekimleri ve kök türevleri sayılmaz. Örnek: Bakara 2:163'teki <span dir="rtl" lang="ar" style={{ fontFamily: FONTS.quran }}>الرَّحْمٰن</span> Er-Rahmân ismidir <em>(sayılır)</em>; 2:286'daki <span dir="rtl" lang="ar" style={{ fontFamily: FONTS.quran }}>وَارْحَمْنَا</span> "bize rahmet et" fiilidir <em>(sayılmaz)</em>. Regex pattern'ında kelime sınırı (boşluk veya satır başı/sonu) zorunlu — gömülü kök sequence'ları atlanır.</>
              : <>Only <strong style={{ color: COLORS.offWhite }}>name forms</strong> are counted — verb conjugations and root derivatives are excluded. Example: <span dir="rtl" lang="ar" style={{ fontFamily: FONTS.quran }}>الرَّحْمٰن</span> at Baqara 2:163 is the name ar-Raḥmān <em>(counted)</em>; <span dir="rtl" lang="ar" style={{ fontFamily: FONTS.quran }}>وَارْحَمْنَا</span> at 2:286 is the verb "have mercy on us" <em>(skipped)</em>. The regex enforces word boundaries — embedded root sequences are ignored.</>}
          </p>
        </div>
      </div>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SECTION 9: 114 İSIM ATLASI — search + 3'lü filter + inline detay
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
  { key: 'all',          labelTr: 'Tümü',              labelEn: 'All'              },
  { key: 'favorites',    labelTr: 'Tefekkür Listem',   labelEn: 'My List'          },
  { key: 'isim',         labelTr: 'Lafza-i Celâl',     labelEn: 'Divine Name'      },
  { key: 'esma',         labelTr: 'Esmâ-i Hüsnâ',     labelEn: 'Esmā-i Ḥusnā'    },
  { key: 'kurani_sifat', labelTr: "Kur'ânî Sıfat",     labelEn: 'Quranic Attr.'    },
];

// ── useFavorites — localStorage'da Set olarak tutulan favori isim listesi
// SSR-safe: initial state false/empty, useEffect'te hydrate.
// Storage key versioned (v1) ki ileride şema değişikliği yönetilebilsin.
const FAV_STORAGE_KEY = 'esma-favorites-v1';
function useFavorites() {
  const [favorites, setFavorites] = useState(() => new Set());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(FAV_STORAGE_KEY);
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) setFavorites(new Set(arr));
      }
    } catch { /* corrupted JSON → start fresh */ }
    setHydrated(true);
  }, []);

  const persist = (next) => {
    try { localStorage.setItem(FAV_STORAGE_KEY, JSON.stringify([...next])); }
    catch { /* quota or private mode — silently fail */ }
  };

  const toggle = (isim) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(isim)) next.delete(isim);
      else next.add(isim);
      persist(next);
      return next;
    });
  };

  return { favorites, toggle, hydrated };
}

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
  const { favorites, toggle: toggleFavorite, hydrated: favHydrated } = useFavorites();

  const filtered = useMemo(() => {
    if (!data?.isimler) return [];
    let rows = data.isimler.map(n => ({
      ...n,
      displayCount: n.isim === 'Allah' ? ALLAH_CLASSIC_COUNT : n.kuranda_gecis_sayisi,
    }));
    if (filter === 'favorites') rows = rows.filter(n => favorites.has(n.isim));
    else if (filter !== 'all') rows = rows.filter(n => n.kategori === filter);
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
  }, [data, filter, search, sort, favorites]);

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
          {CATEGORY_FILTERS.map(f => {
            // Favori chip'inde sayım göster — kullanıcı listesinin boyutunu görür
            const isFav = f.key === 'favorites';
            const showCount = isFav && favHydrated && favorites.size > 0;
            return (
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
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                {isFav && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.77 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                )}
                {tr ? f.labelTr : f.labelEn}
                {showCount && (
                  <span style={{
                    background: `${COLORS.gold}33`,
                    color: COLORS.gold,
                    borderRadius: '999px',
                    padding: '1px 7px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    lineHeight: 1.5,
                  }}>
                    {favorites.size}
                  </span>
                )}
              </button>
            );
          })}
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
              isFavorite={favorites.has(n.isim)}
              onToggleFavorite={() => toggleFavorite(n.isim)}
              favHydrated={favHydrated}
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
            {filter === 'favorites' && favorites.size === 0
              ? (tr
                  ? 'Listeniz boş. İsimlerin yanındaki yıldıza tıklayarak Tefekkür Listenizi oluşturun.'
                  : 'Your list is empty. Tap the star next to any name to build your list.')
              : (tr ? 'Sonuç bulunamadı.' : 'No results found.')}
          </div>
        )}
      </div>
    </section>
  );
}

function NameRow({ item, tr, isOpen, onToggle, isFavorite, onToggleFavorite, favHydrated }) {
  const isAllah = item.isim === 'Allah';
  return (
    <div style={{ position: 'relative' }}>
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
          padding: '14px 18px 14px 54px', // sol padding 54px — yıldız butonu (32px + 12px) için
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
        <span style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
          {/* Kategori label mobile'de gizli — narrow viewport'ta uzun isimle
              çakışıyordu (örn. 'El-Hakk' + 'Esmâ-i Hüsnâ' aynı satıra sığmıyor).
              Filter chip'leri zaten aktif kategoriyi gösteriyor → redundant. */}
          <span
            className="esma-category-label"
            style={{
              color: COLORS.silver,
              fontSize: 'clamp(0.78rem, 1vw, 0.85rem)',
              fontFamily: FONTS.body,
              letterSpacing: '0.02em',
              whiteSpace: 'nowrap',
            }}
          >
            {item.kategori_etiket}
          </span>
          <span style={{
            color: COLORS.offWhite,
            fontSize: 'clamp(0.95rem, 1.2vw, 1.05rem)',
            fontWeight: 700,
            fontVariantNumeric: 'tabular-nums',
            minWidth: '52px',
            textAlign: 'right',
          }}>
            {(isAllah ? ALLAH_CLASSIC_COUNT : item.kuranda_gecis_sayisi).toLocaleString(tr ? 'tr-TR' : 'en-US')}
          </span>
        </span>
      </button>

      {/* Favori (yıldız) butonu — row'un sol başında, absolutely positioned.
          Tıklama row toggle'ı tetiklemesin diye stopPropagation. */}
      {favHydrated && (
        <button
          type="button"
          onClick={e => { e.stopPropagation(); onToggleFavorite(); }}
          aria-label={isFavorite
            ? (tr ? 'Tefekkür listemden çıkar' : 'Remove from my list')
            : (tr ? 'Tefekkür listeme ekle' : 'Add to my list')}
          aria-pressed={isFavorite}
          style={{
            position: 'absolute',
            left: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: isFavorite ? `${COLORS.gold}26` : 'rgba(255,255,255,0.04)',
            border: `1px solid ${isFavorite ? COLORS.gold + '88' : 'rgba(255,255,255,0.18)'}`,
            color: isFavorite ? COLORS.gold : 'rgba(180,195,215,0.75)',
            cursor: 'pointer',
            transition: 'all 0.18s',
            padding: 0,
            zIndex: 2,
          }}
          onMouseEnter={e => { if (!isFavorite) { e.currentTarget.style.color = COLORS.gold; e.currentTarget.style.borderColor = `${COLORS.gold}66`; e.currentTarget.style.background = `${COLORS.gold}10`; } }}
          onMouseLeave={e => { if (!isFavorite) { e.currentTarget.style.color = 'rgba(180,195,215,0.75)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; } }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.77 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </button>
      )}

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          style={{ overflow: 'hidden' }}
        >
          <NameDetail item={item} tr={tr} isAllah={isAllah} />
        </motion.div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// VerseChipGrid — ayet chip'leri tıklanınca aşağıda inline expansion
// Arapça + TR/EN meal verse-graph-bgem3.json'dan lazy load. Sayfa terk edilmez.
// ──────────────────────────────────────────────────────────────────────────────
function VerseChipGrid({ ayetler, tr }) {
  const [expandedId, setExpandedId] = useState(null); // 'sure:ayet' formatında
  const [verseGraph, setVerseGraph] = useState(null);
  const [loadingId, setLoadingId] = useState(null);
  const [error, setError] = useState(null);

  const handleClick = async (a) => {
    const id = `${a.sure}:${a.ayet}`;
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }
    if (verseGraph) {
      setExpandedId(id);
      return;
    }
    setLoadingId(id);
    setError(null);
    try {
      const map = await loadVerseGraph();
      setVerseGraph(map);
      setExpandedId(id);
    } catch (e) {
      setError(tr ? 'Ayet verisi yüklenemedi.' : 'Could not load verse data.');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
      {ayetler.map(a => {
        const id = `${a.sure}:${a.ayet}`;
        const isExpanded = expandedId === id;
        const isLoading = loadingId === id;
        const verse = verseGraph?.get(id);
        return (
          <div key={id} style={{ flex: '0 0 auto', minWidth: 'fit-content' }}>
            <button
              onClick={() => handleClick(a)}
              aria-expanded={isExpanded}
              style={{
                background: isExpanded ? `${COLORS.gold}22` : 'rgba(255,255,255,0.04)',
                border: isExpanded ? `1px solid ${COLORS.gold}66` : '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                padding: '4px 10px',
                fontSize: '0.78rem',
                color: isExpanded ? COLORS.gold : COLORS.silver,
                fontFamily: FONTS.body,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {a.sure_adi || a.sure}:{a.ayet}
              {isLoading && <span style={{ marginLeft: '6px', opacity: 0.6 }}>…</span>}
            </button>
            {isExpanded && verse && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                style={{
                  overflow: 'hidden',
                  flexBasis: '100%',
                  width: '100%',
                  marginTop: '10px',
                  marginBottom: '6px',
                }}
              >
                <div style={{
                  background: `linear-gradient(180deg, ${COLORS.gold}0c, rgba(255,255,255,0.03))`,
                  border: `1px solid ${COLORS.gold}33`,
                  borderRadius: '12px',
                  padding: '18px 22px',
                }}>
                  <p
                    dir="rtl"
                    lang="ar"
                    style={{
                      fontFamily: FONTS.quran,
                      fontSize: 'clamp(1.15rem, 2vw, 1.45rem)',
                      color: COLORS.offWhite,
                      lineHeight: 2.2,
                      margin: '0 0 14px',
                      textAlign: 'right',
                    }}
                  >
                    {normalizeArabicForCard(verse.arabic)}
                  </p>
                  <p style={{
                    color: COLORS.silver,
                    fontFamily: FONTS.body,
                    fontSize: '0.92rem',
                    fontStyle: 'italic',
                    lineHeight: 1.7,
                    margin: '0 0 8px',
                  }}>
                    "{tr ? verse.turkish : verse.english}"
                  </p>
                  <p style={{
                    color: `${COLORS.gold}99`,
                    fontFamily: FONTS.body,
                    fontSize: '0.72rem',
                    letterSpacing: '0.1em',
                    margin: 0,
                    textTransform: 'uppercase',
                  }}>
                    — {a.sure_adi || a.sure} {a.sure}:{a.ayet}
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        );
      })}
      {error && (
        <p style={{ flexBasis: '100%', color: '#e74c3c', fontSize: '0.78rem', margin: '8px 0 0', fontStyle: 'italic' }}>
          {error}
        </p>
      )}
    </div>
  );
}

// Şared cache: tek bir verse-graph fetch tüm NameDetail'lar arası
let _verseGraphPromise = null;
function loadVerseGraph() {
  if (!_verseGraphPromise) {
    _verseGraphPromise = fetch('/verse-graph-bgem3.json')
      .then(r => r.json())
      .then(arr => {
        const map = new Map();
        arr.forEach(v => map.set(v.id, v));
        return map;
      })
      .catch(e => {
        _verseGraphPromise = null; // re-try on next call if failed
        throw e;
      });
  }
  return _verseGraphPromise;
}

// Display-only Arabic normalization (mirror of next/src/lib/arabic.js cleanArabicForDisplay)
function normalizeArabicForCard(str) {
  if (!str) return str;
  return str
    .replace(/۪/g, 'ِ')
    .replace(/ۡ/g, 'ْ')
    .replace(/[ً-ْ]ٓ/gu, 'ٓ')
    .replace(/ٱ/g, 'ا')
    .replace(/ی/g, 'ي')
    .replace(/[ؐ-ؔؖؗ]/g, '')
    .replace(/[؀-؅]/g, '')
    .replace(/[۝۞۩]/g, '')
    .replace(/ۦ/g, ' ')
    .replace(/[ۖ-۟ۢۨ۫۬]/g, '')
    .replace(/[﴾﴿]/g, '');
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
      <VerseChipGrid ayetler={(ayetler || []).slice(0, 30)} tr={tr} />

      {/* Buton sadece tum_ayetler içeriği varsa gösterilir. Aksi halde
          aldatıcı olur (kullanıcı tıklar, hiç ek ayet gelmez). */}
      {item.yuksek_frekansli && !showAllAyets && (item.tum_ayetler || []).length > 15 && (
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
      {/* tum_ayetler boşsa: dürüst alt-not. */}
      {item.yuksek_frekansli && !showAllAyets && (!item.tum_ayetler || item.tum_ayetler.length <= 15) && (ayetler || []).length === 15 && (
        <p style={{ color: COLORS.silver, fontSize: '0.76rem', marginTop: '14px', fontStyle: 'italic', opacity: 0.7, lineHeight: 1.6 }}>
          {tr
            ? `İlk 15 referans gösterilmiştir. Toplam ${item.kuranda_gecis_sayisi} geçiş için aşağıdaki Corpus Quran linkini kullanın.`
            : `First 15 references shown. For all ${item.kuranda_gecis_sayisi} occurrences, use the Corpus Quran link below.`}
        </p>
      )}

      <div style={{ marginTop: '20px', textAlign: 'right' }}>
        <a
          href={corpusUrl(item.arapca, item)}
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

// ═════════════════════════════════════════════════════════════════════════════
// SECTION 8: METODOLOJI ve KAYNAK
// ═════════════════════════════════════════════════════════════════════════════

function Methodology({ data, tr }) {
  // Default açık: akademik şeffaflığı vurgu — Gemini önerisi 2.1
  // ('Veri odaklı okuyucunun güvenini kazanmak için bu şart').
  const [open, setOpen] = useState(true);
  if (!data?.metodoloji) return null;

  return (
    <section style={{ padding: '60px 24px 100px', background: COLORS.cosmicBlack }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={sectionLabel}>{tr ? 'Metodoloji ve Kaynak' : 'Methodology & Sources'}</div>

        <button
          onClick={() => setOpen(v => !v)}
          aria-expanded={open}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '10px',
            padding: '16px 22px',
            color: COLORS.offWhite,
            fontFamily: FONTS.body,
            cursor: 'pointer',
            width: '100%',
            textAlign: 'left',
          }}
        >
          <span style={{ flex: 1, fontWeight: 600 }}>
            {tr ? 'Bu sayfa nasıl hesaplandı?' : 'How was this page calculated?'}
          </span>
          <span style={{ color: COLORS.gold, transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</span>
        </button>

        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderTop: 'none',
              borderRadius: '0 0 10px 10px',
              padding: '24px 28px',
              fontFamily: FONTS.body,
            }}
          >
            <h3 style={{ color: COLORS.gold, fontSize: '0.95rem', margin: '0 0 8px', fontFamily: FONTS.display }}>
              {tr ? 'Kaynak metin' : 'Source text'}
            </h3>
            <p style={{ color: COLORS.silver, fontSize: '0.88rem', lineHeight: 1.7, margin: '0 0 18px' }}>
              {data.metodoloji.kaynak_metin}
            </p>

            <h3 style={{ color: COLORS.gold, fontSize: '0.95rem', margin: '0 0 8px', fontFamily: FONTS.display }}>
              {tr ? 'Kalibrasyon' : 'Calibration'}
            </h3>
            <p style={{ color: COLORS.silver, fontSize: '0.88rem', lineHeight: 1.7, margin: '0 0 18px' }}>
              {data.metodoloji.kalibrasyon}
            </p>

            <h3 style={{ color: COLORS.gold, fontSize: '0.95rem', margin: '0 0 8px', fontFamily: FONTS.display }}>
              {tr ? 'Lemma vs Yüzey-Lafız Nüansı' : 'Lemma vs Surface-Form Nuance'}
            </h3>
            <p style={{ color: COLORS.silver, fontSize: '0.88rem', lineHeight: 1.7, margin: '0 0 8px' }}>
              {tr
                ? <>Bu sayfa <strong>klasik konkordansa</strong> (M. Fuâd Abdülbâkî, el-Mu'cemü'l-Müfehres) dayanır. <strong>Lemma sayımı:</strong> bir ismin tüm morfolojik formları (<code>Allāhu</code>, <code>Allāhi</code>, <code>Allāha</code>) ve önek'li türevleri (<code>lillāh</code>, <code>billāh</code>, <code>wallāh</code>, <code>fallāh</code>) tek bir isim olarak sayılır.</>
                : <>This page is based on the <strong>classical concordance</strong> (M. Fuʾād ʿAbd al-Bāqī, al-Muʿjam al-Mufahras). <strong>Lemma counting:</strong> all morphological forms of a name (<code>Allāhu</code>, <code>Allāhi</code>, <code>Allāha</code>) and prefixed forms (<code>lillāh</code>, <code>billāh</code>, <code>wallāh</code>, <code>fallāh</code>) count as one name.</>}
            </p>
            <p style={{ color: COLORS.silver, fontSize: '0.88rem', lineHeight: 1.7, margin: '0 0 18px' }}>
              {tr
                ? <>Bu nedenle klasik rakamlar (Allah=2.699), yalın yüzey lafzı sayımına (~{ALLAH_SURFACE_COUNT.toLocaleString('tr-TR')}) göre daha yüksek görünür. Bu metodolojik bir tercihtir, sayım hatası değildir.</>
                : <>This is why classical figures (Allah=2,699) appear higher than strict surface counts (~{ALLAH_SURFACE_COUNT.toLocaleString('en-US')}). It is a methodological choice, not a counting error.</>}
            </p>

            <h3 style={{ color: COLORS.gold, fontSize: '0.95rem', margin: '0 0 8px', fontFamily: FONTS.display }}>
              {tr ? 'Hadis kaynaklı isimler' : 'Hadith-sourced names'}
            </h3>
            <p style={{ color: COLORS.silver, fontSize: '0.88rem', lineHeight: 1.7, margin: '0 0 18px' }}>
              {data.metodoloji.onemli_not}
            </p>

            <h3 style={{ color: COLORS.gold, fontSize: '0.95rem', margin: '0 0 8px', fontFamily: FONTS.display }}>
              {tr ? 'Uyarı' : 'Caveat'}
            </h3>
            <p style={{ color: COLORS.silver, fontSize: '0.88rem', lineHeight: 1.7, margin: '0 0 24px' }}>
              {data.metodoloji.uyari}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              <a
                href="https://corpus.quran.com/search.jsp"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: 'transparent',
                  border: `1px solid ${COLORS.softGoldAlpha40 || 'rgba(212,165,116,0.4)'}`,
                  borderRadius: '8px',
                  color: COLORS.gold,
                  padding: '8px 16px',
                  fontSize: '0.85rem',
                  textDecoration: 'none',
                }}
              >
                {tr ? 'Corpus Quran →' : 'Corpus Quran →'}
              </a>
              <a
                href="https://tanzil.net/#search/ar"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: 'transparent',
                  border: `1px solid ${COLORS.softGoldAlpha40 || 'rgba(212,165,116,0.4)'}`,
                  borderRadius: '8px',
                  color: COLORS.gold,
                  padding: '8px 16px',
                  fontSize: '0.85rem',
                  textDecoration: 'none',
                }}
              >
                {tr ? 'Tanzil →' : 'Tanzil →'}
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

// Corpus Quran (corpus.quran.com) ham Uthmânî diakritiklerle 500 hatası verir.
// Search query'yi yalın forma indir: harekeler, alef wasla, tashkeel, dekoratifler temizlenir.
// Sadece temel harfler kalır — Corpus'un index'i bu form üzerinde çalışır.
function corpusSearchQuery(arabic) {
  if (!arabic) return '';
  return arabic
    .replace(/ٱ/g, 'ا')                         // alef wasla → düz alef
    .replace(/ی/g, 'ي')                         // Farsi yeh → Arabic yeh
    .replace(/[ً-ٰٟۖ-ۭ۪]/g, '')  // tüm harekeler, tashkeel, waqf, sukunlar, decorative marks
    .replace(/[ؐ-ؚ]/g, '')           // honorifics
    .trim();
}

// Corpus URL'i üret. corpus.quran.com search.jsp belirli formlarla NullPointer
// fırlatır (gözlemler):
//   - 'القادر' (al- prefix + 4 harf) -> 500
//   - 'الله' -> 500
//   - 'قادر' (al- yok) -> 200
// Çözüm: definite article al- prefix'i strip et — eğer kalan kelime >=3 harf
// ise. Allah ismi (الله -> له, 2 harf < 3) için özel: search.jsp yerine
// qurandictionary.jsp endpoint'ine yönlendir (200 dönüyor).
function corpusUrl(arabic, item) {
  const cleaned = corpusSearchQuery(arabic);
  if (item?.isim === 'Allah') {
    return `https://corpus.quran.com/qurandictionary.jsp?q=${encodeURIComponent(cleaned)}`;
  }
  const stripped = cleaned.replace(/^ال/, '');
  const finalQ = stripped.length >= 3 ? stripped : cleaned;
  return `https://corpus.quran.com/search.jsp?q=${encodeURIComponent(finalQ)}`;
}

// Belirtilen isimleri Arapça metinde altı çizili olarak işaretle
function highlightNames(arabic, names) {
  let parts = [{ text: arabic, plain: true }];
  names.forEach(n => {
    const newParts = [];
    parts.forEach(p => {
      if (!p.plain) { newParts.push(p); return; }
      // Tüm geçişleri yakala — ilk match'le durmayalım. Bu olmadan
      // Haşr 59:24'teki ikinci 'ٱلْعَزِيزُ' veya İhlâs 112:4'teki
      // ikinci 'أَحَدٌ' işaretlenmeden geçiyordu.
      let rest = p.text;
      let safety = 0;
      while (safety++ < 100) {
        const idx = rest.indexOf(n.ar);
        if (idx === -1) {
          if (rest) newParts.push({ text: rest, plain: true });
          break;
        }
        const before = rest.slice(0, idx);
        if (before) newParts.push({ text: before, plain: true });
        newParts.push({ text: n.ar, plain: false });
        rest = rest.slice(idx + n.ar.length);
      }
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
