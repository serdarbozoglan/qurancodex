// ─── AllTopics section ────────────────────────────────────────────────────────
// "Tüm İçerikler" — comprehensive grid of every discovery topic, organized by
// category. Each TopicCard either scrolls to a long-form section on the page
// (kind="section") or opens an interactive module overlay (kind="overlay").
//
// Visual differentiator (decision in todo_v1.1.md, Faz 2):
//   - section items: → arrow icon
//   - overlay items: ↗ external-link icon (rendered by TopicCard automatically)
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SectionWrapper, { fadeUpItem } from '../components/SectionWrapper';
import TopicCard from '../components/TopicCard';
import { useLanguage } from '../i18n/LanguageContext';
import { useQuranNav } from '../hooks/useQuranNav';
import { COLORS, FONTS } from '../tokens';

// ── Reusable inline icons (small, 18px) ─────────────────────────────────────
const Icons = {
  wave: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12h2M6 7v10M10 4v16M14 7v10M18 10v4M22 12h-2" />
    </svg>
  ),
  pulse: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12h3l3-9 3 18 3-9h6" />
    </svg>
  ),
  speaker: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15 9a3 3 0 0 1 0 6" />
    </svg>
  ),
  layers: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  ),
  palette: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
      <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
      <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
      <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.992 6.012 17.477 2 12 2z" />
    </svg>
  ),
  scroll: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3H6a2 2 0 0 0-2 2v3a2 2 0 0 1-2 2H1m6 0h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H7M14 21h6a2 2 0 0 0 2-2v-3a2 2 0 0 1 2-2h1m-6 0h-2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h2" />
    </svg>
  ),
  hands: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 14V8a2 2 0 1 0-4 0M7 12V6a2 2 0 0 0-4 0v9c0 4 3 7 7 7h2a7 7 0 0 0 7-7V9a2 2 0 0 0-4 0M15 11V6a2 2 0 0 0-4 0" />
    </svg>
  ),
  shield: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  scroll2: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  ),
  user: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  brain: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2z" />
    </svg>
  ),
  globe: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  star: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  clock: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  leaf: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19.2 2.96a1 1 0 0 1 1.8.4 19 19 0 0 1-.5 11.4A8 8 0 0 1 13 20" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6" />
    </svg>
  ),
  flame: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  ),
  trumpet: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 6v12l10-4V10z" />
      <path d="M12 10v4M16 8v8M20 6v12" />
    </svg>
  ),
  feather: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
      <line x1="16" y1="8" x2="2" y2="22" />
      <line x1="17.5" y1="15" x2="9" y2="15" />
    </svg>
  ),
};

// ── Category structure ──────────────────────────────────────────────────────
const CATEGORIES = [
  {
    id: 'language',
    titleTr: 'DİL & YAPI',
    titleEn: 'LANGUAGE & STRUCTURE',
    items: [
      { kind: 'section', target: 'linguistic',          icon: Icons.wave,    titleTr: 'Dilsel DNA',         titleEn: 'Linguistic DNA',      descTr: '14 gizemli harf ve şifresi',         descEn: '14 mysterious letters & their code' },
      { kind: 'section', target: 'rhythm',              icon: Icons.pulse,   titleTr: 'İmkansız Ritim',     titleEn: 'Impossible Rhythm',   descTr: 'Ne şiir ne düzyazı',                  descEn: 'Neither poetry nor prose' },
      { kind: 'section', target: 'sounds',              icon: Icons.speaker, titleTr: 'Ses Mimarisi',        titleEn: 'Sound Architecture',  descTr: 'Sert ve yumuşak ünsüzler',            descEn: 'Hard and soft consonants' },
      { kind: 'section', target: 'hidden-architecture', icon: Icons.layers,  titleTr: 'Yapısal Mimari',      titleEn: 'Hidden Architecture', descTr: 'Halka kompozisyon ve simetri',        descEn: 'Ring composition & symmetry' },
      { kind: 'overlay', target: 'renkler',             icon: Icons.palette, titleTr: "Kur'an'ın Renkleri",  titleEn: 'Colors of the Quran', descTr: '~80 ayet · 11 renk evreni',           descEn: '~80 verses · 11 color domains' },
    ],
  },
  {
    id: 'rhetoric',
    titleTr: 'RETORİK & DUA',
    titleEn: 'RHETORIC & PRAYER',
    items: [
      { kind: 'section', target: 'rhetoric',     icon: Icons.scroll,   titleTr: "Kur'an'ın Retoriği", titleEn: 'Quranic Rhetoric',  descTr: 'İltifât, takdîm-tehîr, fâsıla',  descEn: 'Iltifāt, syntactic shifts, cadence' },
      { kind: 'section', target: 'dua-language', icon: Icons.hands,    titleTr: 'Dua Dili',            titleEn: 'Language of Prayer', descTr: 'Yakarışın gramatik kalıbı',      descEn: 'The grammar of supplication' },
      { kind: 'overlay', target: 'yeminler',     icon: Icons.shield,   titleTr: "Kur'an'ın Yeminleri", titleEn: 'Quranic Oaths',      descTr: 'Vâv-ı kasem · 40+ yemin',         descEn: 'Wāw al-qasam · 40+ oaths' },
    ],
  },
  {
    id: 'history',
    titleTr: 'TARİH & İNSAN',
    titleEn: 'HISTORY & THE HUMAN',
    items: [
      { kind: 'section', target: 'history',          icon: Icons.scroll2, titleTr: 'Tarihsel Kanıtlar', titleEn: 'Historical Proof',  descTr: 'Firavun, Haman, Roma',         descEn: 'Pharaoh, Haman, Rome' },
      { kind: 'section', target: 'human-definition', icon: Icons.user,    titleTr: "Kur'an'da İnsan",   titleEn: 'The Human in the Quran', descTr: 'Nefs, kalp, ruh',          descEn: 'Nafs, qalb, rūḥ' },
      { kind: 'section', target: 'psychology',       icon: Icons.brain,   titleTr: 'İnsan Psikolojisi',  titleEn: 'Human Psychology',  descTr: "Kur'an'ın iç dünya haritası",  descEn: 'The Quran on the inner world' },
      { kind: 'overlay', target: 'kavimler',         icon: Icons.globe,   titleTr: 'Kavimler Atlası',    titleEn: 'Nations Atlas',     descTr: 'Âd, Semûd, Lût · 14 kavim',    descEn: 'ʿĀd, Thamūd, Lot · 14 nations' },
    ],
  },
  {
    id: 'cosmos',
    titleTr: "KUR'AN'IN EVRENİ",
    titleEn: "THE QURAN'S COSMOS",
    items: [
      { kind: 'section', target: 'science',  icon: Icons.star,    titleTr: 'Bilimsel İşaretler',   titleEn: 'Scientific Signs',     descTr: 'Demir, embriyo, denizler',       descEn: 'Iron, embryo, oceans' },
      { kind: 'overlay', target: 'kevni',    icon: Icons.leaf,    titleTr: 'Kevni Ayetler',         titleEn: 'Cosmic Signs',         descTr: 'Tabiat atlası · ~200 ayet',       descEn: 'Nature atlas · ~200 verses' },
      { kind: 'overlay', target: 'zaman',    icon: Icons.clock,   titleTr: 'Zaman Boyutları',       titleEn: 'Dimensions of Time',   descTr: 'Yevm, dehir, hîn, asr',           descEn: 'Yawm, dahr, ḥīn, ʿaṣr' },
      { kind: 'overlay', target: 'cennet',   icon: Icons.flame,   titleTr: 'Cennet & Cehennem',     titleEn: 'Heaven & Hell',        descTr: 'İki nihai mekânın haritası',      descEn: 'Map of the two ultimate realms' },
      { kind: 'overlay', target: 'kiyamet',  icon: Icons.trumpet, titleTr: 'Kıyamet Sahneleri',     titleEn: 'Scenes of Resurrection', descTr: 'Sûr · diriliş · hesap',         descEn: 'Trumpet · resurrection · reckoning' },
      { kind: 'overlay', target: 'melekler', icon: Icons.feather, titleTr: 'Melekler',              titleEn: 'Angels',               descTr: 'Cebrail · Mikail · görevler',     descEn: 'Gabriel · Michael · their roles' },
    ],
  },
];

export default function AllTopics() {
  const { language } = useLanguage();
  const { scrollToSection, openOverlay } = useQuranNav();
  const [columns, setColumns] = useState(() => getColumnCount(window.innerWidth));

  useEffect(() => {
    const h = () => setColumns(getColumnCount(window.innerWidth));
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  const handleClick = (item) => {
    if (item.kind === 'section') {
      scrollToSection(item.target);
    } else {
      openOverlay(item.target);
    }
  };

  return (
    <SectionWrapper id="all-topics" dark={true}>
      {/* Section label */}
      <motion.div variants={fadeUpItem}>
        <span
          style={{
            color: COLORS.gold,
            opacity: 0.6,
            fontSize: '0.75rem',
            fontFamily: FONTS.body,
            textTransform: 'uppercase',
            letterSpacing: '0.3em',
          }}
        >
          {language === 'tr' ? 'İçerik Haritası' : 'Content Map'}
        </span>
      </motion.div>

      {/* Heading */}
      <motion.h2
        variants={fadeUpItem}
        style={{
          fontFamily: FONTS.display,
          fontSize: 'clamp(1.8rem, 4vw, 2.75rem)',
          fontWeight: 700,
          color: COLORS.offWhite,
          marginTop: '12px',
          marginBottom: '12px',
          maxWidth: '60ch',
          lineHeight: 1.15,
        }}
      >
        {language === 'tr' ? 'Tüm İçerikler' : 'All Topics'}
      </motion.h2>

      {/* Subtitle + legend */}
      <motion.p
        variants={fadeUpItem}
        className="text-silver text-lg leading-relaxed max-w-3xl mb-4"
      >
        {language === 'tr'
          ? 'Tüm konular tek yerde. Kategoriden bir başlık seç.'
          : 'Every topic in one place. Pick a heading from any category.'}
      </motion.p>

      {/* Legend — pill container, more prominent than original 0.78rem text */}
      <motion.div
        variants={fadeUpItem}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '14px',
          flexWrap: 'wrap',
          marginBottom: '28px',
          padding: '10px 18px',
          background: COLORS.glassBgFaint,
          border: `1px solid ${COLORS.glassBorderSoft}`,
          borderRadius: '999px',
          fontFamily: FONTS.body,
        }}
      >
        {/* Section legend item */}
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.82rem',
            color: COLORS.offWhite,
            fontWeight: 500,
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '22px',
              height: '22px',
              borderRadius: '50%',
              background: COLORS.silverAlpha12,
              color: COLORS.silver,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </span>
          {language === 'tr' ? 'Sayfaya gider' : 'Jumps to section'}
        </span>

        {/* Vertical divider */}
        <span style={{ width: '1px', height: '20px', background: COLORS.glassBorder }} />

        {/* Overlay legend item */}
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.82rem',
            color: COLORS.gold,
            fontWeight: 600,
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '22px',
              height: '22px',
              borderRadius: '50%',
              background: COLORS.goldAlpha15,
              border: `1px solid ${COLORS.goldAlpha25}`,
              color: COLORS.gold,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 4h6v6" />
              <path d="M20 4L10 14" />
              <path d="M19 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6" />
            </svg>
          </span>
          {language === 'tr' ? 'İnteraktif modülde açar' : 'Opens interactive module'}
        </span>
      </motion.div>

      {/* Categories grid */}
      <motion.div
        variants={fadeUpItem}
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: '24px',
        }}
      >
        {CATEGORIES.map((cat) => (
          <div key={cat.id}>
            {/* Category label */}
            <h3
              style={{
                fontFamily: FONTS.body,
                fontSize: '0.72rem',
                fontWeight: 700,
                color: COLORS.gold,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                marginBottom: '12px',
                paddingBottom: '8px',
                borderBottom: `1px solid ${COLORS.goldAlpha25}`,
              }}
            >
              {language === 'tr' ? cat.titleTr : cat.titleEn}
            </h3>

            {/* Topic items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {cat.items.map((item) => (
                <TopicCard
                  key={`${cat.id}-${item.target}`}
                  icon={item.icon}
                  titleTr={item.titleTr}
                  titleEn={item.titleEn}
                  descTr={item.descTr}
                  descEn={item.descEn}
                  kind={item.kind}
                  onClick={() => handleClick(item)}
                />
              ))}
            </div>
          </div>
        ))}
      </motion.div>
    </SectionWrapper>
  );
}

function getColumnCount(width) {
  if (width >= 1280) return 4;
  if (width >= 768)  return 2;
  return 1;
}
