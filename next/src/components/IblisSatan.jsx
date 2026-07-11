'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS, RADIUS } from '../tokens';
import ToolHeader from './ToolHeader';
import SourcesCitation from './SourcesCitation';
import CrossToolCTA from './CrossToolCTA';
import HeroGeometricBackground from './HeroGeometricBackground';
import useFocusTrap from '../hooks/useFocusTrap';

// Overlay-local fadeUp — used for individual blocks; overlay has no parent stagger container.
// PASSAGES — 7 anlatım verisi src/data/iblis-passages.js'ten import edilir.
import { PASSAGES } from '../data/iblis-passages';

const fadeUpItem = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

// ─────────────────────────────────────────────
// Arabic display normalizer
// Strips Uthmani recitation marks (waqf, end-of-ayah, asar) that fall back
// to tofu in KFGQPC outside the ReadingMode tajweed pipeline. Keeps standard
// harakat (U+064B–U+0652), maddah (U+0653), dagger alef (U+0670).
// ─────────────────────────────────────────────
function normalizeAr(s) {
  if (!s) return '';
  return s
    .replace(/\u06EA/g, '\u0650')                                  // asar → kasra
    .replace(/[\u06D6-\u06DC]/g, '')                              // small high marks (waqf etc.)
    .replace(/[\u06DD\u06DE]/g, '')                                // end-of-ayah, rub el hizb
    // eslint-disable-next-line no-misleading-character-class -- Arabic combining marks intentionally stripped via escape sequence; see CLAUDE.md section 13.15.
    .replace(/[\u06E0\u06E2-\u06E4\u06E7-\u06E9\u06EB-\u06ED]/g, '') // misc Uthmani marks
    .replace(/\u0671/g, '\u0627')                                  // alef wasla → alef
    .replace(/\u06CC/g, '\u064A');                                 // farsi yeh → arabic yeh
}

// ─────────────────────────────────────────────
// DATA — 7 anlatım, Mushaf sırasında
// Arapça metinler verse-graph-bgem3.json'dan birebir doğrulanmıştır.
// ─────────────────────────────────────────────
// ─────────────────────────────────────────────
// 7 Çapraz Anlatım Gözlemi
// Her karta `groups` eklendi — her grup başlıklı bir chip seti.
// chip.muted === true: mat / soluk render (yokluk veya nüans).
// ─────────────────────────────────────────────
const OBSERVATIONS = [
  {
    id: 'length',
    statValue: '1 → 16',
    labelTr: 'Ayet aralığı',
    labelEn: 'Verse range',
    bodyTr: 'Aynı olay 1 ayetten 16 ayete esnetilmiş; aralarında 16 katlık fark vardır.',
    bodyEn: 'The same event ranges from 1 to 16 verses — a sixteenfold spread.',
    groups: [
      {
        labelTr: 'EN KISA', labelEn: 'SHORTEST',
        chips: [
          { surah: 'Tâhâ', verse: '20:116', tag: '1 ayet', tagEn: '1 verse' },
          { surah: 'Kehf', verse: '18:50', tag: '1 ayet', tagEn: '1 verse' },
        ],
      },
      {
        labelTr: 'EN UZUN', labelEn: 'LONGEST',
        chips: [
          { surah: 'Hicr', verse: '15:28-43', tag: '16 ayet', tagEn: '16 verses' },
          { surah: 'Sâd', verse: '38:71-85', tag: '15 ayet', tagEn: '15 verses' },
        ],
      },
    ],
  },
  {
    id: 'fire-clay',
    statValue: '2 / 7',
    labelTr: 'Ateş-çamur argümanı',
    labelEn: 'Fire-clay argument',
    bodyTr: 'Üstünlük argümanı yalnız iki anlatımda öne çıkar. Diğer beş sûrede İblis üstünlük iddiasında bulunmaz.',
    bodyEn: 'The superiority argument surfaces in only two tellings. In the other five surahs Iblis never claims superiority.',
    groups: [
      {
        labelTr: 'GEÇTİĞİ YER', labelEn: 'WHERE IT APPEARS',
        chips: [
          { surah: "A'râf", verse: '7:12' },
          { surah: 'Sâd', verse: '38:76' },
        ],
      },
    ],
  },
  {
    id: 'response',
    statValue: '4 / 7',
    labelTr: 'Allah cevap verir',
    labelEn: 'Allah replies',
    bodyTr: 'İblis dört sûrede konuşur; Allah her birine doğrudan cevap verir. Üç sûrede İblis tek kelime etmez.',
    bodyEn: 'Iblis speaks in four surahs; Allah replies to each. In three surahs Iblis says nothing.',
    groups: [
      {
        labelTr: 'CEVAP VAR', labelEn: 'REPLY GIVEN',
        chips: [
          { surah: "A'râf", verse: '7:13' },
          { surah: 'Hicr', verse: '15:34' },
          { surah: 'İsrâ', verse: '17:63' },
          { surah: 'Sâd', verse: '38:77' },
        ],
      },
      {
        labelTr: 'İBLİS SESSİZ', labelEn: 'IBLIS SILENT',
        chips: [
          { surah: 'Bakara', verse: '2:34', muted: true },
          { surah: 'Tâhâ', verse: '20:116', muted: true },
          { surah: 'Kehf', verse: '18:50', muted: true },
        ],
      },
    ],
  },
  {
    id: 'speech',
    statValue: '3 + 3 + 3',
    labelTr: 'Üç diyalog turu',
    labelEn: 'Three dialogue turns',
    bodyTr: "A'râf, Hicr ve Sâd anlatımlarında İblis tam üç diyalog turunda konuşur — her tur Allah'ın bir sözüne karşılık. İsrâ'da iki tur, kalan üç sûrede İblis hiç konuşmaz.",
    bodyEn: "In Aʿrāf, Ḥijr and Ṣād, Iblis speaks across exactly three dialogue turns — each a reply to a divine address. Two turns in Isrāʾ, and silence in the remaining three.",
    groups: [
      {
        labelTr: "A'RÂF (3)", labelEn: "A'RAF (3)",
        chips: [
          { surah: "A'râf", verse: '7:12' },
          { surah: "A'râf", verse: '7:14' },
          { surah: "A'râf", verse: '7:16' },
        ],
      },
      {
        labelTr: 'HİCR (3)', labelEn: 'HIJR (3)',
        chips: [
          { surah: 'Hicr', verse: '15:33' },
          { surah: 'Hicr', verse: '15:36' },
          { surah: 'Hicr', verse: '15:39' },
        ],
      },
      {
        labelTr: 'SÂD (3)', labelEn: 'SĀD (3)',
        chips: [
          { surah: 'Sâd', verse: '38:76' },
          { surah: 'Sâd', verse: '38:79' },
          { surah: 'Sâd', verse: '38:82' },
        ],
      },
    ],
  },
  {
    id: 'material',
    statValue: '3 farklı',
    labelTr: 'Hz. Âdem\'in yaratılış maddesi',
    labelEn: 'Adam\'s creation matter',
    bodyTr: 'Yedi anlatımda Hz. Âdem\'in yaratılış maddesi üç farklı şekilde geçer; bir grupta hiç söylenmez.',
    bodyEn: 'Across the seven tellings, Adam\'s creation matter is named in three distinct ways; one group leaves it unstated.',
    groups: [
      {
        labelTr: 'ṬĪN (ÇAMUR)', labelEn: 'ṬĪN (CLAY)',
        chips: [
          { surah: "A'râf", verse: '7:12' },
          { surah: 'İsrâ', verse: '17:61' },
          { surah: 'Sâd', verse: '38:76' },
        ],
      },
      {
        labelTr: 'SALSĀL + HAMAʾ MASNŪN', labelEn: 'SALSĀL + HAMAʾ MASNŪN',
        chips: [
          { surah: 'Hicr', verse: '15:28' },
        ],
      },
      {
        labelTr: 'BELİRTİLMEMİŞ', labelEn: 'UNSTATED',
        chips: [
          { surah: 'Bakara', verse: '2:34', muted: true },
          { surah: 'Tâhâ', verse: '20:116', muted: true },
          { surah: 'Kehf', verse: '18:50', muted: true },
        ],
      },
    ],
  },
  {
    id: 'progeny',
    statValue: '1 / 7',
    labelTr: 'Soy hedefi açıkça vurgulanır',
    labelEn: 'Lineage target explicitly stated',
    bodyTr: 'Yedi anlatımdan yalnız İsrâ\'da hedef bireyden soya kayar (lā-aḥtanikanne ẕurriyyatahu). Kehf\'te de "soy" geçer fakat zamirin kime ait olduğu klasik tefsirde tartışmalıdır (Taberî hem İblis hem Hz. Âdem yorumunu kaydeder).',
    bodyEn: 'Only in Isra does the target shift from individual to lineage (lā-aḥtanikanne ẕurriyyatahu). Kahf also mentions "progeny," but its referent is contested in classical exegesis (al-Ṭabarī records both Iblis and Adam readings).',
    groups: [
      {
        labelTr: 'AÇIK İFADE', labelEn: 'EXPLICIT',
        chips: [
          { surah: 'İsrâ', verse: '17:62' },
        ],
      },
      {
        labelTr: 'TARTIŞMALI', labelEn: 'CONTESTED',
        chips: [
          { surah: 'Kehf', verse: '18:50', muted: true },
        ],
      },
    ],
  },
  {
    id: 'respite',
    statValue: '3 / 7',
    labelTr: 'Mühlet talebi',
    labelEn: 'Request for respite',
    bodyTr: 'enẓirnī ("bana süre ver") yalnız üç anlatımda doğrudan talep olarak geçer. İsrâ\'daki "kıyamete kadar yaşatırsan" şartlı bir önerme — biçimsel talep değildir.',
    bodyEn: 'enẓirnī ("grant me respite") appears as a direct request in only three tellings. Isra\'s "if You delay me until Resurrection" is a conditional clause, not a formal request.',
    groups: [
      {
        labelTr: 'DOĞRUDAN TALEP', labelEn: 'DIRECT REQUEST',
        chips: [
          { surah: "A'râf", verse: '7:14' },
          { surah: 'Hicr', verse: '15:36' },
          { surah: 'Sâd', verse: '38:79' },
        ],
      },
      {
        labelTr: 'ŞARTLI ÖNERME', labelEn: 'CONDITIONAL CLAUSE',
        chips: [
          { surah: 'İsrâ', verse: '17:62', muted: true },
        ],
      },
    ],
  },
  {
    id: 'chronology',
    statValue: '38 → 87',
    labelTr: 'Nüzul kronolojisi',
    labelEn: 'Revelation chronology',
    bodyTr: 'Mushaf sırası ile nüzul sırası farklı bir hikâye anlatır. En erken inen Sâd anlatımı en uzun ve dramatik (15 ayet, "bi-ʿizzetik" — izzete yemin). En geç inen Bakara anlatımı en kısa (1 ayet, üç fiil). Vahyin akışında **kronolojik daralma**: aynı sahne, yıllar geçtikçe daha az kelimeyle. (Sıralama Suyûtî, el-İtkān.)',
    bodyEn: 'Mushaf order and revelation order tell different stories. The earliest telling (Ṣād) is the longest and most dramatic (15 verses, "bi-ʿizzatik" — an oath on God\'s might). The latest (Baqara) is the shortest (1 verse, three verbs). A **chronological compression** across revelation: the same scene told with fewer words as years pass. (Order per al-Suyūṭī, al-Itqān.)',
    groups: [
      {
        labelTr: 'EN ERKEN', labelEn: 'EARLIEST',
        chips: [
          { surah: 'Sâd',    verse: '38:71-85', tag: 'nüzul ~38', tagEn: 'rev. ~38' },
          { surah: "A'râf",  verse: '7:11-18',  tag: 'nüzul ~39', tagEn: 'rev. ~39' },
        ],
      },
      {
        labelTr: 'ORTA', labelEn: 'MIDDLE',
        chips: [
          { surah: 'Tâhâ',  verse: '20:116',    tag: 'nüzul ~45', tagEn: 'rev. ~45' },
          { surah: 'İsrâ',  verse: '17:61-65',  tag: 'nüzul ~50', tagEn: 'rev. ~50' },
          { surah: 'Hicr',  verse: '15:28-43',  tag: 'nüzul ~54', tagEn: 'rev. ~54' },
        ],
      },
      {
        labelTr: 'EN GEÇ', labelEn: 'LATEST',
        chips: [
          { surah: 'Kehf',   verse: '18:50', tag: 'nüzul ~69', tagEn: 'rev. ~69' },
          { surah: 'Bakara', verse: '2:34',  tag: 'nüzul ~87 · Medenî', tagEn: 'rev. ~87 · Medinan' },
        ],
      },
    ],
  },
];

export default function IblisSatan({ onClose }) {
  const { t, language } = useLanguage();
  const lang = language;
  const passageRefs = useRef({});
  const [openIdx, setOpenIdx] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const trapRef = useFocusTrap(true);

  useEffect(() => {
    setIsMobile(window.innerWidth < 640);
    const h = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  // Escape closes overlay (per CLAUDE.md §13.3)
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape' && onClose) onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  // Body scroll lock kaldırıldı — WowFacts/IlkSon pattern: normal-flow document scroll.

  const stats = [
    { ...t('iblisSatan.stats.surahs'),  color: COLORS.gold },
    { ...t('iblisSatan.stats.longest'), color: COLORS.softEmerald },
    { ...t('iblisSatan.stats.shortest'), color: COLORS.silver },
    { ...t('iblisSatan.stats.fireClay'), color: COLORS.softRed },
  ];

  // Tolerant lookup so 'Tâhâ' / 'Tâ-Hâ' both match. Used by ref chips
  // to scroll-to + auto-open the relevant passage card.
  const openPassageBySurah = (surahName) => {
    const strip = (s) => (s || '').replace(/[\s\-']/g, '').toLowerCase();
    const target = strip(surahName);
    const idx = PASSAGES.findIndex(p => strip(p.surahName) === target);
    if (idx < 0) return;
    setOpenIdx(idx);
    const id = PASSAGES[idx].id;
    setTimeout(() => {
      passageRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
  };

  return (
    <div ref={trapRef} style={{
      background: COLORS.cosmicBlack,
      minHeight: 'calc(100vh - 62px)',
      display: 'flex', flexDirection: 'column',
      paddingTop: '62px',
    }}>
      <ToolHeader
        icon={
          /* Stylized flame — İblis was created from nâr (Hicr 15:27, Sâd 38:76).
             Replaces previous horned-skull motif (deemed unfitting). */
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2.5c1.6 3.2 4.8 5.4 4.8 9.4 0 3.6-2.4 6.6-4.8 6.6s-4.8-3-4.8-6.6c0-1.8 0.7-3 1.6-4.1" />
            <path d="M12 8c0.9 1.7 2.6 2.9 2.6 5.1 0 1.9-1.3 3.5-2.6 3.5s-2.6-1.6-2.6-3.5c0-1 0.4-1.6 0.9-2.2" />
          </svg>
        }
        titleTr="İblîs & Şeytan"
        titleEn="Iblis & Satan"
        subtitleTr="Yedi sûrede aynı sahne · ateşten reddediş"
        subtitleEn="Same scene in seven surahs · refusal from fire"
        language={language}
      />

      {/* ─── Scrollable Body ─────────────────────────────── */}
      <div style={{
        flex: 1,
        padding: isMobile ? '24px 16px 60px' : '40px 60px 80px',
      }}>

      {/* ─── Hero region wrapper (additive — layers HeroGeometricBackground) ── */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <HeroGeometricBackground />
        <div style={{ position: 'relative', zIndex: 1 }}>
      {/* ─── Bismillah ornament — Amiri Quran ligature ───── */}
      <motion.div
        initial="hidden" animate="visible" variants={fadeUpItem}
        dir="rtl" lang="ar" aria-label="Bismillāh"
        style={{
          textAlign: 'center',
          fontFamily: "'Amiri Quran', 'Amiri', serif",
          fontSize: isMobile ? '1.5rem' : '1.95rem',
          color: COLORS.gold,
          opacity: 0.82,
          lineHeight: 1,
          marginBottom: isMobile ? '28px' : '40px',
          textShadow: `0 0 22px ${COLORS.gold}28`,
        }}
      >
        ﷽
      </motion.div>

      {/* ─── Eyebrow: BÜYÜK REDDEDİŞ — ÇEKİRDEK ANLATIM ─── */}
      <motion.div
        initial="hidden" animate="visible" variants={fadeUpItem}
        style={{
          textAlign: 'center',
          fontSize: '0.68rem',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: COLORS.gold,
          fontFamily: FONTS.body,
          fontWeight: 700,
          opacity: 0.72,
          marginBottom: '18px',
        }}
      >
        {t('iblisSatan.subBlockLabel')} · {t('iblisSatan.anchorVerseTitle')}
      </motion.div>

      {/* ─── Anchor verse (Bakara 2:34) — Cinematic Hero pattern ───── */}
      <motion.p
        initial="hidden" animate="visible" variants={fadeUpItem}
        dir="rtl" lang="ar"
        style={{
          fontFamily: FONTS.quran,
          fontSize: isMobile ? 'clamp(1.05rem, 4.2vw, 1.4rem)' : 'clamp(1.25rem, 2.3vw, 1.65rem)',
          color: COLORS.gold,
          lineHeight: 2.1,
          margin: '0 auto 16px',
          maxWidth: '820px',
          textAlign: 'center',
          textShadow: `0 0 20px ${COLORS.gold}1c`,
        }}
      >
        {normalizeAr(t('iblisSatan.anchorVerseAr'))}
      </motion.p>

      <motion.p
        initial="hidden" animate="visible" variants={fadeUpItem}
        style={{
          color: COLORS.offWhite,
          fontFamily: FONTS.display,
          fontStyle: 'italic',
          fontSize: isMobile ? '0.94rem' : 'clamp(0.95rem, 1.6vw, 1.05rem)',
          lineHeight: 1.7,
          margin: '0 auto 8px',
          maxWidth: '680px',
          textAlign: 'center',
          opacity: 0.95,
        }}
      >
        "{t('iblisSatan.anchorVerseTr')}"
      </motion.p>

      <motion.p
        initial="hidden" animate="visible" variants={fadeUpItem}
        style={{
          color: COLORS.silver,
          fontFamily: FONTS.body,
          fontSize: '0.72rem',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          margin: '0 0 28px',
          textAlign: 'center',
          opacity: 0.65,
        }}
      >
        — {t('iblisSatan.anchorVerseRef')}
      </motion.p>

      {/* ─── Anahtar Fiiller (key verbs callout) — compact ──── */}
      <motion.div
        initial="hidden" animate="visible" variants={fadeUpItem}
        style={{
          textAlign: 'center',
          padding: isMobile ? '14px 16px' : '16px 24px',
          background: COLORS.goldAlpha04,
          border: `1px solid ${COLORS.goldAlpha15}`,
          borderRadius: RADIUS.md,
          maxWidth: '720px',
          margin: '0 auto 36px',
        }}
      >
        <div style={{
          fontSize: '0.6rem', color: COLORS.gold, opacity: 0.65,
          letterSpacing: '0.25em', textTransform: 'uppercase',
          fontFamily: FONTS.body, fontWeight: 700,
          marginBottom: '10px',
        }}>
          {language === 'tr' ? 'Anahtar Fiiller' : 'Key Verbs'}
        </div>
        <div style={{
          display: 'flex', flexWrap: 'wrap',
          justifyContent: 'center',
          gap: isMobile ? '6px 12px' : '8px 18px',
        }}>
          {[
            { ar: 'ebā',                  tr: 'yüz çevirdi',      en: 'refused' },
            { ar: 'istekbera',            tr: 'büyüklendi',       en: 'grew arrogant' },
            { ar: "kāne mine'l-kāfirīn",  tr: 'kâfirlerden oldu', en: 'became of the disbelievers' },
          ].map((v, i, arr) => (
            <span key={i} style={{
              display: 'inline-flex', alignItems: 'baseline', gap: '6px',
              fontFamily: FONTS.body, fontSize: isMobile ? '0.78rem' : '0.85rem',
            }}>
              <span style={{ color: COLORS.gold, fontWeight: 600 }}>{v.ar}</span>
              <span style={{ color: COLORS.silver, opacity: 0.85 }}>
                ({language === 'tr' ? v.tr : v.en})
              </span>
              {i < arr.length - 1 && (
                <span style={{ color: COLORS.silver, opacity: 0.4, marginLeft: '4px' }}>·</span>
              )}
            </span>
          ))}
        </div>
      </motion.div>

      {/* ─── Framing whisper ───────────────────────────── */}
      <motion.p
        initial="hidden" animate="visible" variants={fadeUpItem}
        style={{
          color: COLORS.silver,
          fontFamily: FONTS.display,
          fontStyle: 'italic',
          fontSize: isMobile ? '0.92rem' : 'clamp(0.95rem, 1.55vw, 1.02rem)',
          lineHeight: 1.7,
          margin: '0 auto 40px',
          maxWidth: '700px',
          textAlign: 'center',
          opacity: 0.88,
        }}
      >
        {language === 'tr'
          ? <>Tek bir sahne, <em style={{ fontStyle: 'normal', color: COLORS.gold, opacity: 0.95 }}>yedi farklı sûrede</em> yedi farklı kameradan anlatıldı. Her anlatımda <em style={{ fontStyle: 'normal', color: COLORS.gold, opacity: 0.95 }}>başka bir ayrıntı</em> öne çıkar.</>
          : <>One scene, retold across <em style={{ fontStyle: 'normal', color: COLORS.gold, opacity: 0.95 }}>seven surahs</em> from seven angles. Each retelling foregrounds <em style={{ fontStyle: 'normal', color: COLORS.gold, opacity: 0.95 }}>a different detail</em>.</>}
      </motion.p>

      {/* ─── Filigree divider ──────────────────────────── */}
      <motion.div
        initial="hidden" animate="visible" variants={fadeUpItem}
        aria-hidden="true"
        style={{
          width: '120px',
          height: '1px',
          background: `linear-gradient(to right, transparent, ${COLORS.gold}66, transparent)`,
          margin: '0 auto 36px',
        }}
      />
        </div>
      </div>
      {/* ─── End Hero region wrapper ─────────────────────── */}

      {/* ─── Header (in-body) ───────────────────────────── */}
      {/* 7-Marker Preview: her nokta = bir sûrenin accent rengi.
          Aşağıdaki passage kartlarında aynı renk başlık olarak görünür —
          okuyucu sûreye geldiğinde rengi tanır. Sûre adları isim-renk
          eşlemesini açıkça verir, ezbere bakılmaz. */}
      <motion.div
        initial="hidden" animate="visible" variants={fadeUpItem}
        className="mb-4"
      >
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          {[
            { name: 'Bakara', color: COLORS.silver },
            { name: "A'râf",  color: COLORS.softRed },
            { name: 'Hicr',   color: COLORS.softEmerald },
            { name: 'İsrâ',   color: COLORS.coral },
            { name: 'Kehf',   color: COLORS.violet },
            { name: 'Tâhâ',   color: COLORS.skyBlue },
            { name: 'Sâd',    color: COLORS.gold },
          ].map((s) => (
            <span
              key={s.name}
              className="inline-flex items-center gap-1.5"
              style={{ fontFamily: FONTS.body, fontSize: '0.7rem' }}
            >
              <span
                style={{
                  width: '7px', height: '7px', borderRadius: RADIUS.full,
                  background: s.color, opacity: 0.85,
                  boxShadow: `0 0 5px ${s.color}66`,
                  flexShrink: 0,
                }}
              />
              <span style={{ color: COLORS.silver, opacity: 0.7, letterSpacing: '0.04em' }}>
                {s.name}
              </span>
            </span>
          ))}
        </div>
        <div style={{
          marginTop: '6px',
          color: COLORS.silver, opacity: 0.4,
          fontSize: '0.6rem', letterSpacing: '0.18em',
          fontFamily: FONTS.body, textTransform: 'uppercase',
        }}>
          {language === 'tr'
            ? 'Her renk bir sûre · aşağıdaki kartlarda aynı renk başlık olarak görünür'
            : 'Each color = one surah · the same color reappears as the section heading below'}
        </div>
      </motion.div>

      <motion.div initial="hidden" animate="visible" variants={fadeUpItem}>
        <span className="text-gold/60 text-xs font-body uppercase tracking-[0.3em]">
          {t('iblisSatan.badge')}
        </span>
      </motion.div>

      <motion.h2
        initial="hidden" animate="visible" variants={fadeUpItem}
        className="font-display text-3xl md:text-5xl font-bold text-off-white mt-4 mb-3 max-w-4xl"
      >
        {t('iblisSatan.title')}
      </motion.h2>

      <motion.p
        initial="hidden" animate="visible" variants={fadeUpItem}
        className="text-gold/80 text-base md:text-lg italic font-body mb-8 max-w-3xl"
      >
        {t('iblisSatan.subtitle')}
      </motion.p>

      <motion.p
        initial="hidden" animate="visible" variants={fadeUpItem}
        className="text-silver text-lg leading-relaxed max-w-3xl mb-12"
      >
        {t('iblisSatan.intro')}
      </motion.p>

      {/* ─── Stats Banner ────────────────────────────────── */}
      <motion.div initial="hidden" animate="visible" variants={fadeUpItem} className="mb-5">
        <span className="text-gold/60 text-xs font-body uppercase tracking-[0.3em]">
          {t('iblisSatan.statsTitle')}
        </span>
      </motion.div>

      <motion.div
        initial="hidden" animate="visible" variants={fadeUpItem}
        className="mb-20"
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
          borderTop: `1px solid ${COLORS.goldAlpha25}`,
          borderBottom: `1px solid ${COLORS.goldAlpha25}`,
        }}
      >
        {stats.map((s, i) => {
          const isLastCol = isMobile ? (i % 2 === 1) : (i === stats.length - 1);
          const isBottomRow = isMobile ? i >= 2 : true;
          return (
            <div
              key={i}
              style={{
                padding: isMobile ? '22px 16px' : '28px 28px',
                borderRight: isLastCol ? 'none' : `1px solid ${COLORS.goldAlpha15}`,
                borderTop: isMobile && isBottomRow && i >= 2 ? `1px solid ${COLORS.goldAlpha15}` : 'none',
                textAlign: 'center',
              }}
            >
              <div style={{
                fontSize: '0.62rem',
                color: COLORS.gold, opacity: 0.65,
                fontFamily: FONTS.body, fontWeight: 700,
                letterSpacing: '0.22em', textTransform: 'uppercase',
                marginBottom: '14px',
              }}>
                {s.label}
              </div>
              <div style={{
                fontFamily: FONTS.display,
                fontSize: isMobile ? '2.2rem' : '3rem',
                fontWeight: 700, lineHeight: 1,
                color: COLORS.gold,
                letterSpacing: '-0.02em',
                marginBottom: '10px',
              }}>
                {s.value}
              </div>
              <div style={{
                fontSize: '0.78rem',
                color: COLORS.silver,
                fontFamily: FONTS.body,
                lineHeight: 1.5,
              }}>
                {s.desc}
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* ─── 7 Surah Cards ──────────────────────────────── */}
      <motion.div initial="hidden" animate="visible" variants={fadeUpItem} className="mb-2">
        <span className="text-gold/60 text-xs font-body uppercase tracking-[0.3em]">
          {t('iblisSatan.passagesTitle')}
        </span>
      </motion.div>
      <motion.p
        initial="hidden" animate="visible" variants={fadeUpItem}
        className="text-silver text-base font-body mb-6 max-w-3xl"
      >
        {t('iblisSatan.passagesIntro')}
      </motion.p>

      {/* Quick-nav chip strip — click jumps to surah card */}
      <motion.div
        initial="hidden" animate="visible" variants={fadeUpItem}
        className="flex flex-wrap gap-2 mb-10"
      >
        {PASSAGES.map((p, i) => (
          <button
            key={p.id}
            onClick={() => passageRefs.current[p.id]?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '7px 14px',
              borderRadius: RADIUS.pill,
              fontSize: '0.8rem',
              fontFamily: FONTS.body,
              fontWeight: 600,
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${COLORS.goldAlpha25}`,
              color: COLORS.offWhite,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = COLORS.goldAlpha15;
              e.currentTarget.style.borderColor = COLORS.goldAlpha45;
              e.currentTarget.style.color = COLORS.gold;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
              e.currentTarget.style.borderColor = COLORS.goldAlpha25;
              e.currentTarget.style.color = COLORS.offWhite;
            }}
          >
            <span style={{
              fontSize: '0.7rem', color: COLORS.silver, opacity: 0.7,
              fontFamily: FONTS.body, fontWeight: 700,
            }}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <span>{p.surahName}</span>
          </button>
        ))}
      </motion.div>

      <div className="space-y-3 mb-20">
        {PASSAGES.map((p, i) => {
          const isOpen = openIdx === i;
          return (
            <motion.div
              key={p.id}
              ref={(el) => { passageRefs.current[p.id] = el; }}
              initial="hidden" animate="visible" variants={fadeUpItem}
              style={{
                background: isOpen ? 'rgba(255,255,255,0.035)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${isOpen ? COLORS.goldAlpha25 : COLORS.glassBorder}`,
                borderLeft: `2px solid ${isOpen ? p.accent : `${p.accent}55`}`,
                borderRadius: RADIUS.md,
                overflow: 'hidden',
                transition: 'background 0.2s, border-color 0.2s',
                scrollMarginTop: '20px',
              }}
            >
              {/* Clickable header */}
              <button
                onClick={() => setOpenIdx(isOpen ? -1 : i)}
                aria-expanded={isOpen}
                style={{
                  width: '100%',
                  display: 'flex', alignItems: 'center', gap: isMobile ? '14px' : '20px',
                  padding: isMobile ? '16px 18px' : '20px 24px',
                  background: 'transparent', border: 'none',
                  cursor: 'pointer', textAlign: 'left',
                  fontFamily: 'inherit',
                }}
              >
                {/* Index — minimalist, no border */}
                <span style={{
                  flexShrink: 0,
                  fontFamily: FONTS.body,
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  color: isOpen ? p.accent : COLORS.silver,
                  opacity: isOpen ? 1 : 0.55,
                  width: '22px',
                  transition: 'all 0.2s',
                }}>
                  {String(i + 1).padStart(2, '0')}
                </span>

                {/* Title block */}
                <div className="flex-1 min-w-0">
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap' }}>
                    <span style={{
                      fontFamily: FONTS.display, fontWeight: 700,
                      fontSize: isMobile ? '1.05rem' : '1.2rem',
                      color: COLORS.offWhite,
                      letterSpacing: '0.005em',
                    }}>
                      {p.surahName}
                    </span>
                    <span style={{
                      color: COLORS.silver, opacity: 0.65,
                      fontSize: '0.78rem',
                      fontFamily: FONTS.body,
                      letterSpacing: '0.04em',
                    }}>
                      {p.verseRange}
                    </span>
                    <span style={{
                      color: p.accent, opacity: 0.95,
                      fontSize: '0.7rem',
                      fontFamily: FONTS.body, fontWeight: 600,
                      letterSpacing: '0.14em', textTransform: 'uppercase',
                    }}>
                      {lang === 'tr' ? p.distinctTr : p.distinctEn}
                    </span>
                  </div>
                  {!isOpen && (
                    <p style={{
                      color: COLORS.silver, opacity: 0.75,
                      fontSize: '0.84rem', fontFamily: FONTS.body,
                      lineHeight: 1.55,
                      margin: '6px 0 0',
                    }}>
                      {lang === 'tr' ? p.teaserTr : p.teaserEn}
                    </p>
                  )}
                </div>

                {/* Chevron — rotates on open */}
                <span style={{
                  flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '22px', height: '22px',
                  color: isOpen ? COLORS.gold : COLORS.silver,
                  opacity: isOpen ? 0.9 : 0.5,
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.25s ease, color 0.2s, opacity 0.2s',
                }} aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>
              </button>

              {/* Expanded body */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div
                      className="space-y-7"
                      style={{
                        padding: isMobile ? '0 18px 22px' : '4px 24px 28px',
                        marginLeft: isMobile ? '0' : '42px',
                      }}
                    >
                      {/* Teaser line at top of expanded body (since hidden in header when open) */}
                      <p style={{
                        color: COLORS.silver, opacity: 0.85,
                        fontSize: '0.92rem', fontFamily: FONTS.body,
                        lineHeight: 1.65, fontStyle: 'italic',
                        margin: 0,
                        paddingBottom: '4px',
                      }}>
                        {lang === 'tr' ? p.teaserTr : p.teaserEn}
                      </p>

                      <div style={{
                        height: '1px',
                        background: `linear-gradient(to right, ${COLORS.goldAlpha25}, transparent)`,
                      }} />

                      {/* Arabic + translation */}
                      <div className="space-y-4">
                        <p
                          dir="rtl" lang="ar"
                          style={{
                            fontFamily: FONTS.quran,
                            fontSize: isMobile ? '1.5rem' : '1.9rem',
                            lineHeight: 2,
                            color: COLORS.gold,
                            textAlign: 'right',
                            margin: 0,
                          }}>
                          {normalizeAr(p.arabic)}
                        </p>
                        {p.arabicSecondary && (
                          <p
                            dir="rtl" lang="ar"
                            style={{
                              fontFamily: FONTS.quran,
                              fontSize: isMobile ? '1.4rem' : '1.7rem',
                              lineHeight: 2,
                              color: COLORS.gold,
                              textAlign: 'right',
                              margin: 0,
                              opacity: 0.92,
                            }}>
                            {normalizeAr(p.arabicSecondary)}
                          </p>
                        )}
                        <p
                          className="font-body italic leading-relaxed whitespace-pre-wrap"
                          style={{
                            color: COLORS.silver, fontSize: '0.92rem',
                            margin: 0,
                          }}>
                          {lang === 'tr' ? p.translationTr : p.translationEn}
                        </p>
                        <p style={{
                          color: COLORS.gold, fontSize: '0.76rem',
                          fontFamily: FONTS.body, fontWeight: 600,
                          letterSpacing: '0.06em', margin: 0,
                        }}>
                          — {lang === 'tr' ? p.referenceTr : p.referenceEn}
                        </p>
                      </div>

                      {/* Nuance */}
                      <div>
                        <p style={{
                          color: COLORS.gold, opacity: 0.65,
                          fontSize: '0.68rem', fontFamily: FONTS.body, fontWeight: 600,
                          letterSpacing: '0.22em', textTransform: 'uppercase',
                          margin: '0 0 10px',
                        }}>
                          {lang === 'tr' ? 'Nüans' : 'Nuance'}
                        </p>
                        <p
                          className="font-body leading-relaxed"
                          style={{
                            color: 'rgba(232,230,227,0.88)',
                            fontSize: '0.95rem',
                            margin: 0,
                          }}>
                          {lang === 'tr' ? p.nuanceTr : p.nuanceEn}
                        </p>
                      </div>

                      {/* Distinct chips */}
                      <div>
                        <p style={{
                          color: COLORS.gold, opacity: 0.65,
                          fontSize: '0.68rem', fontFamily: FONTS.body, fontWeight: 600,
                          letterSpacing: '0.22em', textTransform: 'uppercase',
                          margin: '0 0 12px',
                        }}>
                          {lang === 'tr' ? 'Bu sûreye özgü' : 'Distinct in this surah'}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {p.chips.map((chip, ci) => (
                            <span
                              key={ci}
                              style={{
                                padding: '5px 14px',
                                borderRadius: RADIUS.pill,
                                fontSize: '0.74rem',
                                fontFamily: FONTS.body,
                                fontWeight: chip.unique ? 700 : 500,
                                background: chip.unique ? COLORS.goldAlpha15 : 'rgba(148,163,184,0.08)',
                                border: `1px solid ${chip.unique ? COLORS.goldAlpha45 : 'rgba(148,163,184,0.18)'}`,
                                color: chip.unique ? COLORS.gold : COLORS.silver,
                              }}
                            >
                              {lang === 'tr' ? chip.tr : chip.en}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* ─── Cross-tellings observations ─────────────────── */}
      <motion.div initial="hidden" animate="visible" variants={fadeUpItem} className="mb-2">
        <span className="text-gold/60 text-xs font-body uppercase tracking-[0.3em]">
          {t('iblisSatan.observationsTitle')}
        </span>
      </motion.div>
      <motion.p
        initial="hidden" animate="visible" variants={fadeUpItem}
        className="text-silver text-base font-body mb-8 max-w-3xl"
      >
        {t('iblisSatan.observationsIntro')}
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
        {OBSERVATIONS.map((obs) => (
          <motion.div
            key={obs.id}
            initial="hidden" animate="visible" variants={fadeUpItem}
            style={{
              padding: '22px 24px',
              background: 'rgba(255,255,255,0.025)',
              border: `1px solid ${COLORS.glassBorder}`,
              borderRadius: RADIUS.md,
              display: 'flex', flexDirection: 'column', gap: '16px',
            }}
          >
            {/* Top row: stat badge + label + body */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '18px' }}>
              <div style={{
                flexShrink: 0,
                minWidth: '70px', maxWidth: '90px',
                textAlign: 'center',
                padding: '10px 8px',
                background: COLORS.goldAlpha15,
                border: `1px solid ${COLORS.goldAlpha45}`,
                borderRadius: RADIUS.md,
              }}>
                <div style={{
                  fontFamily: FONTS.display,
                  fontSize: '1.05rem', fontWeight: 700,
                  color: COLORS.gold, lineHeight: 1.1,
                }}>
                  {obs.statValue}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 style={{
                  color: COLORS.offWhite,
                  fontFamily: FONTS.body, fontWeight: 700,
                  fontSize: '0.95rem', marginBottom: '6px',
                }}>
                  {lang === 'tr' ? obs.labelTr : obs.labelEn}
                </h4>
                <p className="text-silver text-sm font-body leading-relaxed">
                  {lang === 'tr' ? obs.bodyTr : obs.bodyEn}
                </p>
              </div>
            </div>

            {/* Ref chip groups */}
            {obs.groups && obs.groups.length > 0 && (
              <div style={{
                display: 'flex', flexDirection: 'column', gap: '10px',
                paddingTop: '14px',
                borderTop: `1px solid ${COLORS.goldAlpha15}`,
              }}>
                {obs.groups.map((g, gi) => (
                  <div key={gi} style={{
                    display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px',
                  }}>
                    <span style={{
                      flexShrink: 0,
                      color: COLORS.gold, opacity: 0.7,
                      fontSize: '0.62rem', fontFamily: FONTS.body, fontWeight: 700,
                      letterSpacing: '0.18em',
                      minWidth: '92px',
                    }}>
                      {lang === 'tr' ? g.labelTr : g.labelEn}
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {g.chips.map((chip, ci) => {
                        const tag = lang === 'tr' ? chip.tag : (chip.tagEn || chip.tag);
                        const baseBg = chip.muted ? 'rgba(148,163,184,0.06)' : 'rgba(212,165,116,0.08)';
                        const baseBorder = chip.muted ? 'rgba(148,163,184,0.18)' : COLORS.goldAlpha25;
                        const hoverBg = chip.muted ? 'rgba(148,163,184,0.14)' : COLORS.goldAlpha15;
                        const hoverBorder = chip.muted ? 'rgba(148,163,184,0.32)' : COLORS.goldAlpha45;
                        return (
                          <button
                            key={ci}
                            onClick={() => openPassageBySurah(chip.surah)}
                            title={lang === 'tr' ? `${chip.surah} ${chip.verse} kartını aç` : `Open ${chip.surah} ${chip.verse} card`}
                            style={{
                              display: 'inline-flex', alignItems: 'baseline', gap: '6px',
                              padding: '4px 10px',
                              borderRadius: RADIUS.pill,
                              fontSize: '0.72rem',
                              fontFamily: FONTS.body, fontWeight: 600,
                              background: baseBg,
                              border: `1px solid ${baseBorder}`,
                              color: chip.muted ? COLORS.silver : COLORS.offWhite,
                              opacity: chip.muted ? 0.65 : 1,
                              cursor: 'pointer',
                              transition: 'background 0.15s, border-color 0.15s',
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.background = hoverBg;
                              e.currentTarget.style.borderColor = hoverBorder;
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.background = baseBg;
                              e.currentTarget.style.borderColor = baseBorder;
                            }}
                          >
                            <span style={{ color: chip.muted ? COLORS.silver : COLORS.gold }}>
                              {chip.surah}
                            </span>
                            <span style={{
                              fontSize: '0.66rem', opacity: 0.75,
                              letterSpacing: '0.02em',
                            }}>
                              {chip.verse}
                            </span>
                            {tag && (
                              <span style={{
                                fontSize: '0.62rem',
                                color: COLORS.silver, opacity: 0.7,
                                marginLeft: '2px',
                              }}>
                                · {tag}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* ─── Closing ─────────────────────────────────────── */}
      <motion.p
        initial="hidden" animate="visible" variants={fadeUpItem}
        className="text-off-white/85 text-lg leading-relaxed italic max-w-3xl"
      >
        {t('iblisSatan.closing')}
      </motion.p>

      {/* ═══ VESVESE KANALI WIDGET (Dalga 3.3) ═══ */}
      <VesveseKanaliWidget language={language} isMobile={isMobile} />

      {/* ═══ 12 HİLE / VESVESE MEKANİZMASI WIDGET ═══ */}
      <OnIkiHileWidget language={language} isMobile={isMobile} />

      {/* ─── Klasik Kaynaklar ─────────────────────────────── */}
      <SourcesCitation
        language={language}
        isMobile={isMobile}
        sources={[
          { author: 'er-Râzî',                  workTr: 'Mefâtîhu\'l-Ğayb',           workEn: 'Mafātīḥ al-Ghayb',           period: '1149–1209 (Rey)',     noteTr: 'A\'râf 7:12 ateş-çamur diyaloğunun kelâmî analizi.',           noteEn: 'Kalāmic analysis of the fire-clay dialogue in Aʿrāf 7:12.' },
          { author: 'et-Taberî',                workTr: 'Câmiu\'l-Beyân',              workEn: 'Jāmiʿ al-Bayān',             period: '839–923 (Âmûl)',      noteTr: '7 sûrenin karşılaştırmalı tefsiri — İblis kıssasının ayrıntıları.', noteEn: 'Comparative commentary on the 7 surahs — details of the Iblis narrative.' },
          { author: 'el-Mâturîdî',              workTr: 'Te\'vîlâtu\'l-Kur\'ân',       workEn: 'Taʾwīlāt al-Qurʾān',         period: '853–944 (Semerkand)', noteTr: 'İblis\'in cin kimliği (Kehf 18:50) — yaratılış ve isyân ilişkisi.', noteEn: 'Iblis\'s jinn identity (Kahf 18:50) — creation and rebellion.' },
          { author: 'İbn Kayyim el-Cevziyye',   workTr: 'İğâsetü\'l-Lehfân',           workEn: 'Ighāthat al-Lahfān',         period: '1292–1350 (Şâm)',     noteTr: 'Şeytan\'ın hile yöntemleri — Kur\'an ve hadis kaynaklı tipoloji.',  noteEn: 'Satan\'s methods of deception — typology from Qurʾan and ḥadīth.' },
        ]}
      />

      <CrossToolCTA
        language={language}
        isMobile={isMobile}
        links={[
          { href: `/${language}/atlas/nefs-mertebeleri`, titleTr: 'Nefis Mertebeleri', titleEn: 'Stations of the Self', descTr: 'İç yolun haritası — nefs-i emmâreden mutmainneye.', descEn: 'Map of the inner path — from the commanding self to the tranquil.' },
          { href: `/${language}/atlas/munafik`, titleTr: 'Münâfık Profili', titleEn: 'The Hypocrite Profile', descTr: "İblis'in insan yüzü.", descEn: "Iblis's human face." },
          { href: `/${language}/atlas/insan-psikolojisi`, titleTr: 'İnsan Psikolojisi', titleEn: 'Human Psychology', descTr: 'İçsel ekosistem — kalp, nefs, kalp gözü.', descEn: "Inner ecosystem — heart, self, heart's eye." },
        ]}
      />
      </div>
    </div>
  );
}

// ═════════════ DALGA 3.3 WIDGETS ═════════════

// Vesvese Kanalı — Nâs 114:4-6 çerçevesinde İblis'in kalbe ulaşma yolları
function VesveseKanaliWidget({ language, isMobile }) {
  const tr = language === 'tr';
  const paths = [
    {
      id: 'yollari-cizmek',
      titleTr: 'Yolları Çizmek', titleEn: 'Marking Paths',
      descTr: 'Şeytan Kur\'ân\'ın dosdoğru yolu üstüne oturarak insanı önden, arkadan, sağdan, soldan yaklaşır.',
      descEn: 'Iblis sits upon the straight path, approaching humans from before, behind, right, and left.',
      verseRef: 'A\'râf 7:16-17',
      color: '#e67e22',
    },
    {
      id: 'susleyerek',
      titleTr: 'Süsleyerek Sunmak', titleEn: 'Beautifying Sin',
      descTr: 'Günahı süsler, günaha yönelten şeyi güzel gösterir. "Amellerini süsledim."',
      descEn: 'He beautifies sin and adorns whatever leads to it. "I have beautified their deeds."',
      verseRef: 'Hicr 15:39',
      color: '#a78bfa',
    },
    {
      id: 'unutturmak',
      titleTr: 'Unutturmak', titleEn: 'Making One Forget',
      descTr: 'Zikri unutturur — Allah\'ı hatırlamayı zayıflatır. Nisyân (unutuş) şeytanın bir kanalıdır.',
      descEn: 'He causes forgetfulness of remembrance — weakening the recall of God. Nisyān (forgetting) is one of his channels.',
      verseRef: 'Kehf 18:63, Mücâdele 58:19',
      color: '#3498db',
    },
    {
      id: 'kandirmak',
      titleTr: 'Aldatarak Vaad Etmek', titleEn: 'Deceiving with Promises',
      descTr: 'Yalancı vaadler verir: "Ben senin dostunum." Elde etmeyeceği şeyi vaad eder.',
      descEn: 'He gives false promises: "I am your friend." He promises what he cannot deliver.',
      verseRef: 'Nisâ 4:120, İbrâhim 14:22',
      color: '#8b0000',
    },
    {
      id: 'vesvese-icten',
      titleTr: 'İçten Fısıldamak (Vesvese)', titleEn: 'Whispering from Within (Waswasa)',
      descTr: 'İnsanların göğüslerine fısıldayan sinsi vesveseci — cin ve insanlardan olabilir. Zayıf anlarda saldırır.',
      descEn: 'The sly whisperer who whispers into human hearts — may be from jinn or humans. Attacks in moments of weakness.',
      verseRef: 'Nâs 114:4-6',
      color: '#c0392b',
    },
  ];

  const antidotes = [
    { tr: 'İstiâze (اَعوذُ باللهِ)', en: 'Isti\'ādha (I seek refuge in Allah)', descTr: 'Nahl 16:98', descEn: 'al-Nahl 16:98' },
    { tr: 'Zikir + istiğfâr', en: 'Dhikr + istighfār', descTr: 'A\'râf 7:201', descEn: 'al-A\'rāf 7:201' },
    { tr: 'Muavvizeteyn (Felak + Nâs)', en: 'Al-Muʿawwidhatān (Falaq + Nās)', descTr: 'Hz. Peygamber pratiği', descEn: 'Prophetic practice' },
    { tr: 'Kalbi Rabbe bağlı tutmak', en: 'Keeping the heart tied to the Lord', descTr: 'Furkân 25:29', descEn: 'al-Furqān 25:29' },
  ];

  return (
    <div style={{
      marginTop: isMobile ? '40px' : '56px',
      padding: isMobile ? '20px 16px' : '32px 32px',
      background: 'linear-gradient(180deg, rgba(139,0,0,0.06) 0%, rgba(255,255,255,0.02) 100%)',
      border: `1px solid ${COLORS.gold}44`,
      borderRadius: RADIUS.lg,
      maxWidth: '980px', marginLeft: 'auto', marginRight: 'auto',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <p style={{
          fontSize: '0.7rem', letterSpacing: '0.24em', textTransform: 'uppercase',
          color: COLORS.gold, opacity: 0.75, fontWeight: 700,
          marginBottom: '10px', fontFamily: FONTS.body,
        }}>
          {tr ? 'VESVESE KANALI · 5 YOL' : 'THE WHISPER CHANNEL · 5 PATHS'}
        </p>
        <h3 style={{
          fontFamily: FONTS.display, fontSize: isMobile ? '1.35rem' : '1.65rem',
          color: COLORS.offWhite, margin: '0 0 12px', lineHeight: 1.3,
        }}>
          {tr ? "Kalbe Ulaşan 5 Kanal" : "The 5 Channels Reaching the Heart"}
        </h3>
        <p style={{
          color: COLORS.silver, fontSize: '0.9rem',
          lineHeight: 1.65, maxWidth: '640px', margin: '0 auto',
          fontFamily: FONTS.body,
        }}>
          {tr
            ? "Kur'ân, İblis'in insanı hedef almak için kullandığı 5 farklı stratejik yolu detaylandırır. Her biri ayrı bir sûrede tanımlanır. Antidot: istiâze + zikir."
            : "The Qur'ān details 5 distinct strategic paths Iblis uses to target humans. Each defined in a separate sura. Antidote: isti'ādha + dhikr."}
        </p>
      </div>

      {/* 5 kanal grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '12px', marginBottom: '24px',
      }}>
        {paths.map((p, i) => (
          <div key={p.id} style={{
            padding: '14px 16px',
            background: `${p.color}0e`,
            border: `1px solid ${p.color}44`,
            borderLeft: `3px solid ${p.color}`,
            borderRadius: RADIUS.md,
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px',
            }}>
              <div style={{
                width: '22px', height: '22px', borderRadius: '50%',
                background: p.color, color: '#0a0a1a',
                fontSize: '0.7rem', fontWeight: 800,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: FONTS.body, flexShrink: 0,
              }}>{i + 1}</div>
              <div style={{
                fontFamily: FONTS.display, fontSize: '0.98rem',
                color: p.color, fontWeight: 700,
              }}>{tr ? p.titleTr : p.titleEn}</div>
            </div>
            <p style={{
              fontSize: '0.82rem', color: COLORS.offWhite,
              lineHeight: 1.55, margin: '0 0 6px',
              fontFamily: FONTS.body,
            }}>{tr ? p.descTr : p.descEn}</p>
            <p style={{
              fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase',
              color: COLORS.silver, opacity: 0.7, margin: 0,
              fontFamily: FONTS.body,
            }}>— {p.verseRef}</p>
          </div>
        ))}
      </div>

      {/* Antidot bandı */}
      <div style={{
        padding: '14px 18px',
        background: `${COLORS.gold}0e`,
        border: `1px solid ${COLORS.gold}44`,
        borderRadius: RADIUS.md,
      }}>
        <div style={{
          fontSize: '0.66rem', letterSpacing: '0.16em', textTransform: 'uppercase',
          color: COLORS.gold, fontWeight: 700, marginBottom: '10px',
          fontFamily: FONTS.body, textAlign: 'center',
        }}>{tr ? "ANTİDOT · 4 KUR'ÂNÎ SIĞINAK" : "ANTIDOTE · 4 QUR'ĀNIC REFUGES"}</div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
          gap: '8px',
        }}>
          {antidotes.map((a, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '0.85rem', color: COLORS.gold,
                fontWeight: 700, marginBottom: '2px',
                fontFamily: FONTS.body,
              }}>{tr ? a.tr : a.en}</div>
              <div style={{
                fontSize: '0.68rem', color: COLORS.silver, opacity: 0.7,
                fontFamily: FONTS.body,
              }}>{tr ? a.descTr : a.descEn}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 12 Hile / Vesvese Mekanizması — İbn Kayyim (İğâsetü'l-Lehfân) + Gazâlî (İhyâ)
function OnIkiHileWidget({ language, isMobile }) {
  const tr = language === 'tr';
  const mechanisms = [
    { n: 1,  tr: 'Küfür ve şirk', en: 'Disbelief and shirk', descTr: 'İlk hedef: kişiyi tevhidden koparmak.', descEn: 'First target: sever the person from tawḥīd.' },
    { n: 2,  tr: 'Bid\'at', en: 'Innovation (bid\'a)', descTr: 'Küfürden koparamazsa dini deforme et.', descEn: 'If disbelief fails, deform the religion.' },
    { n: 3,  tr: 'Büyük günahlar', en: 'Major sins', descTr: 'Kalpte kir bırakan cürümlere teşvik.', descEn: 'Encouraging crimes that stain the heart.' },
    { n: 4,  tr: 'Küçük günahlar', en: 'Minor sins', descTr: '"Küçük mü?" mantığıyla birikimli tahribat.', descEn: 'Cumulative damage via the "just a small thing?" logic.' },
    { n: 5,  tr: 'Mubahlarda israf', en: 'Excess in the permissible', descTr: 'Helâlde dahi aşırıya kayarak taate vakit bırakma.', descEn: 'Even in the permissible, excess to leave no time for worship.' },
    { n: 6,  tr: 'Fâzıl amelden mefdûle', en: 'From superior to inferior deeds', descTr: 'Kişiyi daha üstün amelden alt bir hayra yönlendirir.', descEn: 'Redirecting from a superior deed to a lesser one.' },
    { n: 7,  tr: 'Riya', en: 'Riyāʾ (showing off)', descTr: 'İhlâsı bozar — ameli görsün diyerek.', descEn: 'Corrupts sincerity — with the motive of being seen.' },
    { n: 8,  tr: 'Ucub (kendini beğenme)', en: 'ʿUjb (self-admiration)', descTr: 'İhlâslı ameli ucub ile silmek.', descEn: 'Erasing sincere deeds through self-admiration.' },
    { n: 9,  tr: 'Vesvese-i kalbiyye', en: 'Heart-whispering', descTr: 'Zayıf anlarda sürekli fısıltı — Nâs 114:5.', descEn: 'Constant whispering in moments of weakness — Nās 114:5.' },
    { n: 10, tr: 'Hasad ve gadab', en: 'Envy and rage', descTr: 'İki kapı: başkasının nimeti + kızgınlık.', descEn: 'Two doors: envy of others\' blessings + rage.' },
    { n: 11, tr: 'Ümitsizlik ve kavut', en: 'Despair and hopelessness', descTr: '"Allah affetmez artık" düşüncesi — tevbe kapısını kapatma.', descEn: '"God will not forgive now" — closing the door of repentance.' },
    { n: 12, tr: 'Aşırı ümit (gurur)', en: 'Excessive hope (delusion)', descTr: '"Nasılsa affeder" — ameli erteletir.', descEn: '"He will forgive anyway" — postponing action.' },
  ];

  return (
    <div style={{
      marginTop: isMobile ? '32px' : '48px',
      padding: isMobile ? '20px 16px' : '32px 32px',
      background: 'rgba(255,255,255,0.02)',
      border: `1px solid ${COLORS.glassBorderSoft}`,
      borderRadius: RADIUS.lg,
      maxWidth: '980px', marginLeft: 'auto', marginRight: 'auto',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <p style={{
          fontSize: '0.7rem', letterSpacing: '0.24em', textTransform: 'uppercase',
          color: COLORS.gold, opacity: 0.75, fontWeight: 700,
          marginBottom: '10px', fontFamily: FONTS.body,
        }}>
          {tr ? "İBN KAYYIM'IN 12 BASAMAK TİPOLOJİSİ" : "IBN AL-QAYYIM'S 12-STEP TYPOLOGY"}
        </p>
        <h3 style={{
          fontFamily: FONTS.display, fontSize: isMobile ? '1.35rem' : '1.65rem',
          color: COLORS.offWhite, margin: '0 0 10px', lineHeight: 1.3,
        }}>
          {tr ? "Şeytanın 12 Kademe Hilesi" : "Satan's 12-Rung Deception"}
        </h3>
        <p style={{
          color: COLORS.silver, fontSize: '0.88rem',
          lineHeight: 1.65, maxWidth: '660px', margin: '0 auto',
          fontFamily: FONTS.body,
        }}>
          {tr
            ? "İbn Kayyim el-Cevziyye, İğâsetü'l-Lehfân'da şeytanın insanı düşürmek için sırasıyla denediği 12 basamaklı stratejiyi tanımlar. Kişi bir kademeyi başarıyla geçerse, şeytan bir alt kademeye iner. Sıralama önemlidir: başarısızlığın küfür değil bid'at ile başlaması, tuzağın inceliğini gösterir."
            : "Ibn al-Qayyim in Ighāthat al-Lahfān identifies the 12-rung strategy Satan employs sequentially to cause a person's fall. If one rung is successfully passed, Satan descends to the next. The ordering matters: that failure starts not with disbelief but with innovation reveals the trap's subtlety."}
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
        gap: '8px',
      }}>
        {mechanisms.map(m => (
          <div key={m.n} style={{
            display: 'flex', gap: '10px', alignItems: 'flex-start',
            padding: '10px 12px',
            background: 'rgba(139,0,0,0.06)',
            border: `1px solid rgba(139,0,0,0.28)`,
            borderLeft: `3px solid ${m.n <= 4 ? '#8b0000' : m.n <= 8 ? '#c0392b' : '#e67e22'}`,
            borderRadius: RADIUS.md,
          }}>
            <div style={{
              width: '24px', height: '24px', borderRadius: '50%',
              background: m.n <= 4 ? '#8b0000' : m.n <= 8 ? '#c0392b' : '#e67e22',
              color: '#fff', fontSize: '0.7rem', fontWeight: 800,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: FONTS.body, flexShrink: 0,
            }}>{m.n}</div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: '0.86rem', color: COLORS.offWhite,
                fontWeight: 700, marginBottom: '2px',
                fontFamily: FONTS.body,
              }}>{tr ? m.tr : m.en}</div>
              <div style={{
                fontSize: '0.76rem', color: COLORS.silver,
                lineHeight: 1.55,
                fontFamily: FONTS.body,
              }}>{tr ? m.descTr : m.descEn}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: '16px', padding: '12px 14px',
        background: `${COLORS.gold}0e`,
        borderLeft: `2px solid ${COLORS.gold}`,
        borderRadius: '4px',
      }}>
        <p style={{
          fontSize: '0.78rem', color: COLORS.silver,
          lineHeight: 1.65, margin: 0, fontStyle: 'italic',
          fontFamily: FONTS.body,
        }}>
          {tr
            ? "İbnü'l-Kayyim (ö. 751/1350), İğâsetü'l-Lehfân min Mesâyidi'ş-Şeytân — 'Şeytanın Tuzaklarından Bunalan Kimseye Yardım'. Klasik tasavvuf-ahlâk sentezinde tipoloji, İhyâʾu ʿUlûmi'd-Dîn (Gazâlî) ile paralel gelişmiştir."
            : "Ibn al-Qayyim (d. 751/1350), Ighāthat al-Lahfān min Maṣāʾid al-Shayṭān — 'Relief for the One Distressed by Satan's Traps.' In the classical Sufi-ethical synthesis, this typology developed in parallel with al-Ghazālī's Iḥyāʾ ʿUlūm al-Dīn."}
        </p>
      </div>
    </div>
  );
}
