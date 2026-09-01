'use client';

// ─── TefekkurHighlight section ───────────────────────────────────────────────
// "Tefekkür — Felsufi Seçkisi" — discovery-layer showcase for the 6 essay
// categories under the new /tefekkur route. Mirror counterpart of the
// ToolsHighlight section above: 6 cards in a 3-column grid, identical
// rhythm, complementary content. Where ToolsHighlight invites the user to
// interactive exploration, TefekkurHighlight invites them to slow,
// long-form reading.
//
// Each category card deep-links to /tefekkur pre-filtered via ?cat=<id>.
// "Tüm Yazılar" CTA links to the /tefekkur index unfiltered.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import useReducedMotionSafe from '../hooks/useReducedMotionSafe';
import SectionWrapper, { fadeUpItem } from '../components/SectionWrapper';
import TefekkurCategoryCard from '../components/TefekkurCategoryCard';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS, RADIUS, SEMANTIC, CATEGORY } from '../tokens';

// ── Featured essays — the 2 articles currently published.
// Each shows the Arabic root prominently (mirroring the article's RootHero
// aesthetic) so the homepage discovery layer previews actual visual character,
// not just empty category counts. Order: most-recent first.
// Karma seçim (framework + somut hook):
// 1. Okuma Prensipleri 1 — sitenin Kur'an okuma metodolojisinin manifesto'su,
//    homepage'e site kimliği açısından en uygun "neden bu site böyle yapılıyor?"
//    sorusuna yanıt veren temel taşı.
// 2. Semantik 3 (Cennet, Cin, Mecnun) — somut etimolojik "aha" anı; framework'ün
//    pratik meyvelerinden bir örnek.
const FEATURED_ESSAYS = [
  {
    slug: 'okuma-prensipleri-1',
    categoryAccent: SEMANTIC.accentPrimary, // sure-hermenotik — §13.25 göç: #c9a227 idi
    rootAr: 'تَدَبُّر',
    rootTranslit: 'tadabbur',
    seriesNumber: 1,
    eyebrowTr: 'Sûre & Hermenötik',
    eyebrowEn: 'Surah & Hermeneutics',
    titleTr: "Kur'an Okuma Prensiplerimiz-1: Epistemik Prensipler",
    titleEn: "Our Quran Reading Principles-1: Epistemic Principles",
    tldrTr: "Kur'an okumayı sağlıklı yapabilmek için 5 epistemik prensip: Kapsayıcılık (her şeyi kapsar), Genelleme (ad hoc daraltma yanlış), Tutarlılık (tedebbür gerekir), Keskin Anlam (tam eş anlamlı yok), Modelleme (asâ-yı Mûsâ).",
    tldrEn: 'Five epistemic principles for sound Quranic reading: Inclusivity, Generality, Consistency, Precision (no full synonyms), and Modeling (the Quran provides a reading model linking inner/outer observation to God).',
    readingMinutes: 14,
  },
  {
    slug: 'cennet-cin-mecnun',
    categoryAccent: CATEGORY.violet,  // semantik — #8b5cf6 idi (kontrast)
    rootAr: 'ج ن ن',
    rootTranslit: 'j-n-n',
    seriesNumber: 3,
    eyebrowTr: 'Semantik Seri',
    eyebrowEn: 'Semantic Series',
    titleTr: 'Semantik 3: Cennet, Cin, Mecnun',
    titleEn: 'Semantic 3: Jannah, Jinn, Majnun',
    tldrTr: 'Cennet, cin, mecnun, kalkan, cenin, kalp — hepsi tek kökten. Ortak payda: gizlilik. Bahçe yapraklarıyla örter, cin görünmezdir, mecnunda akla perde iner.',
    tldrEn: 'Garden, jinn, majnun, shield, fetus, heart — all from one root. The common thread: concealment. Garden veils with leaves, jinn is invisible, the intellect has a veil over it in majnun.',
    readingMinutes: 11,
  },
];

// Kategori sayıları _index.json'DAN TÜRETİLİR — elle yazılmaz.
// 2026-08-14: burada 5/8/11/5/6/7 (toplam 42) yazılıydı; gerçek 53'tü.
// Bu sabitler her yeni makalede bayatlıyordu ve kimse fark etmiyordu.
// Aynı sınıf hata bu sitede navbar yüksekliğinde sekiz kez yaşandı.
import TEFEKKUR_INDEX from '../../public/tefekkur/_index.json';

const COUNT_BY_CAT = TEFEKKUR_INDEX.articles.reduce((m, a) => {
  m[a.category] = (m[a.category] || 0) + 1;
  return m;
}, {});

// ── 6 essay categories — mirrors public/tefekkur/_index.json categories ──────
const TEFEKKUR_CATEGORIES = [
  {
    id: 'kavramsal',
    accent: CATEGORY.blue,            // aynı hex
    count: COUNT_BY_CAT['kavramsal'] ?? 0,
    titleTr: 'Kavramsal Tahlil',
    titleEn: 'Conceptual Analysis',
    descTr: 'Psikolojik, içsel ve pratik tefekkür denemeleri',
    descEn: 'Reflections on psychology, inner life & practice',
    icon: (
      <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12" />
      </svg>
    ),
  },
  {
    id: 'terminoloji',
    accent: CATEGORY.orange,          // terminoloji — altın kategori rengi olamaz
    count: COUNT_BY_CAT['terminoloji'] ?? 0,
    titleTr: 'Terminoloji Serisi',
    titleEn: 'Terminology Series',
    descTr: "İnsan, Kâinat ve Kur'an'ı Okuma Terminolojisi",
    descEn: 'Terminology for Reading Human, Universe & Quran',
    icon: (
      <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        <line x1="8" y1="7" x2="16" y2="7" />
        <line x1="8" y1="11" x2="14" y2="11" />
      </svg>
    ),
  },
  {
    id: 'sure-hermenotik',
    accent: SEMANTIC.accentPrimary,   // sure-hermenotik — çekirdek kategori altın kalıyor
    count: COUNT_BY_CAT['sure-hermenotik'] ?? 0,
    titleTr: 'Sûre & Hermenötik',
    titleEn: 'Surah & Hermeneutics',
    descTr: 'Sûre tahlilleri ve yorum prensipleri',
    descEn: 'Surah analyses & interpretive principles',
    icon: (
      <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
  {
    id: 'semantik',
    accent: CATEGORY.violet,          // semantik
    count: COUNT_BY_CAT['semantik'] ?? 0,
    titleTr: 'Semantik Seri',
    titleEn: 'Semantic Series',
    descTr: 'Arapça kök etimolojisi ve Kur\'ani semantik haritalama',
    descEn: 'Arabic root etymology & Quranic semantic mapping',
    icon: (
      <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="2.5" />
        <circle cx="5" cy="6" r="1.6" />
        <circle cx="19" cy="6" r="1.6" />
        <circle cx="5" cy="18" r="1.6" />
        <circle cx="19" cy="18" r="1.6" />
        <path d="M6.5 7L10 11M17.5 7L14 11M6.5 17L10 13M17.5 17L14 13" />
      </svg>
    ),
  },
  {
    id: 'idrak-suur',
    accent: CATEGORY.emerald,         // aynı hex
    count: COUNT_BY_CAT['idrak-suur'] ?? 0,
    titleTr: 'İdrak & Şuur',
    titleEn: 'Cognition & Consciousness',
    descTr: 'Epistemoloji, metafizik ve recursive düşünce',
    descEn: 'Epistemology, metaphysics & recursive thought',
    icon: (
      <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 2a4 4 0 0 0-4 4v1a4 4 0 0 0 0 7v1a4 4 0 0 0 4 4 4 4 0 0 0 3-1.35V3.35A4 4 0 0 0 9 2z" />
        <path d="M15 2a4 4 0 0 1 4 4v1a4 4 0 0 1 0 7v1a4 4 0 0 1-4 4 4 4 0 0 1-3-1.35V3.35A4 4 0 0 1 15 2z" />
      </svg>
    ),
  },
  {
    id: 'kozmoloji',
    accent: CATEGORY.rose,            // kozmoloji — mor ikizi çözüldü
    count: COUNT_BY_CAT['kozmoloji'] ?? 0,
    titleTr: 'Kozmoloji & Yaratılış',
    titleEn: 'Cosmology & Creation',
    descTr: 'Yaratılış, kuantum ve evrim üzerine düşünce',
    descEn: 'Creation, quantum & evolution',
    icon: (
      <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <ellipse cx="12" cy="12" rx="10" ry="4" />
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
      </svg>
    ),
  },
];

// compact=true  → ana sayfa "daha derin oku" daveti (subtitle yok, kategori
//                grid'i yok, sadece headline + 2 essay + CTA)
// compact=false → /tefekkur rotasında full render (mevcut hali)
// Hardcoded fallback'ler — runtime fetch hata verirse kullanılır.
// PLANNED_TOTAL kaldırıldı (2026-08-13). 44'lük hedef AŞILDI (52 makale),
// dolayısıyla plannedRemaining = max(0, 44-52) = 0 oluyordu ve anasayfada
// "52 yayında, 0 planlanan" gibi anlamsız bir cümle çıkıyordu. Aynı hata
// navbar'da da vardı, orada da kaldırıldı. Yerine kategori sayısı geldi.

export default function TefekkurHighlight({ compact = false }) {
  const { language } = useLanguage();
  const router = useRouter();
  const reduced = useReducedMotionSafe();
  // SSR-safe: start with 1, hydrate post-mount (mirrors ToolsHighlight pattern)
  const [columns, setColumns] = useState(1);

  // Dinamik category sayıları — public/tefekkur/_index.json'dan fetch.
  // Hardcoded count'lar kullanıcı raporunda (2026-06-16) gerçek JSON ile sync
  // değildi (5+8+11+5+6+7=42, gerçek 23). Runtime hesaplama ile düzeltildi.
  const [dynamic, setDynamic] = useState(null);

  useEffect(() => {
    const h = () => setColumns(getColumnCount(window.innerWidth));
    h();
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  useEffect(() => {
    fetch('/tefekkur/_index.json')
      .then(r => r.json())
      .then(d => {
        const counts = {};
        for (const a of d.articles || []) {
          counts[a.category] = (counts[a.category] || 0) + 1;
        }
        setDynamic({
          counts,
          total: (d.articles || []).length,
          categories: (d.categories || []).length,
        });
      })
      .catch(() => {/* fallback: statik count'lar kullanılır */});
  }, []);

  const liveCount = dynamic?.total ?? 0;
  const categoryCount = dynamic?.categories ?? 6;   // fetch 'categories' yazıyor

  const handleViewAll = () => router.push(`/${language}/tefekkur`);

  return (
    <SectionWrapper id="tefekkur-highlight" dark>
      {/* Section label */}
      <motion.div variants={fadeUpItem}>
        <span
          style={{
            color: COLORS.gold,
            opacity: 0.75,
            fontSize: '0.75rem',
            fontFamily: FONTS.body,
            textTransform: 'uppercase',
            letterSpacing: '0.3em',
          }}
        >
          {language === 'tr' ? 'Tefekkür' : 'Tefekkür'}
        </span>
      </motion.div>

      {/* Heading — compact'ta küçük, full'da büyük */}
      <motion.h2
        variants={fadeUpItem}
        style={{
          fontFamily: FONTS.display,
          fontSize: compact ? 'clamp(1.4rem, 3vw, 2rem)' : 'clamp(1.8rem, 4vw, 2.75rem)',
          fontWeight: 700,
          color: COLORS.offWhite,
          marginTop: '12px',
          marginBottom: compact ? '24px' : '12px',
          maxWidth: '60ch',
          lineHeight: 1.15,
          letterSpacing: '-0.01em',
        }}
      >
        {language === 'tr'
          ? "Sufist'ten Seçkilerle Derin Okuma"
          : 'Curated Deep Readings from Sufist'}
      </motion.h2>

      {/* Subtitle — sadece full mode'da */}
      {!compact && (
        <motion.p
          variants={fadeUpItem}
          className="max-w-3xl mb-10"
          style={{
            fontFamily: FONTS.body,
            color: COLORS.offWhiteAlpha78,
            fontSize: 'clamp(0.95rem, 1.6vw, 1.0625rem)',
            lineHeight: 1.7,
            letterSpacing: '0.01em',
          }}
        >
          {language === 'tr'
            ? <>Felsufi&apos;nin yazılarından — <strong style={{ color: COLORS.gold, fontWeight: 700 }}>şu an {liveCount} yayında</strong>, <strong style={{ color: COLORS.softGold, fontWeight: 600 }}>{categoryCount} kategoride</strong> derinlikli denemeler. Kur&apos;an kavramlarının kök etimolojisinden modern epistemolojiye, sûre tahlillerinden tasavvufî psikolojiye uzanan bir tefekkür çağrısı.</>
            : <>Essays by Felsufi — <strong style={{ color: COLORS.gold, fontWeight: 700 }}>{liveCount} currently live</strong>, across <strong style={{ color: COLORS.softGold, fontWeight: 600 }}>{categoryCount} categories</strong>. From the root etymology of Quranic concepts to modern epistemology, from surah analyses to Sufi psychology. One invitation to reflect.</>}
        </motion.p>
      )}

      {/* Featured essays preview — 2 published articles with their root letters.
          Mirrors the in-article RootHero aesthetic so the discovery layer
          previews actual visual character, not just empty counts. */}
      <motion.div
        variants={fadeUpItem}
        style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          margin: '4px 0 14px',
        }}
      >
        <span aria-hidden="true" style={{
          width: '5px', height: '5px', borderRadius: '50%',
          background: COLORS.gold, boxShadow: `0 0 10px ${COLORS.gold}99`,
        }} />
        <span style={{
          fontSize: '0.66rem', fontWeight: 700, letterSpacing: '0.22em',
          color: COLORS.gold, textTransform: 'uppercase', fontFamily: FONTS.body,
          opacity: 0.85,
        }}>
          {language === 'tr' ? 'Öne Çıkan Yazılar' : 'Featured Essays'}
        </span>
        <div style={{
          flex: 1, height: '1px',
          background: `linear-gradient(90deg, ${COLORS.goldAlpha25}, transparent)`,
          maxWidth: '180px',
        }} />
      </motion.div>

      <motion.div
        variants={fadeUpItem}
        style={{
          display: 'grid',
          gridTemplateColumns: columns >= 2 ? 'repeat(2, 1fr)' : '1fr',
          gap: columns === 1 ? '14px' : '18px',
          marginBottom: '28px',
        }}
      >
        {FEATURED_ESSAYS.map((essay) => (
          <FeaturedEssayCard
            key={essay.slug}
            essay={essay}
            language={language}
            reduced={reduced}
            onClick={() => router.push(`/${language}/tefekkur/${essay.slug}`)}
          />
        ))}
      </motion.div>

      {/* Section sub-label — categories (sadece full mode) */}
      {!compact && (
        <motion.div
          variants={fadeUpItem}
          style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            marginBottom: '14px',
          }}
        >
          <span aria-hidden="true" style={{
            width: '5px', height: '5px', borderRadius: '50%',
            background: COLORS.softGold, boxShadow: `0 0 10px ${COLORS.softGoldAlpha60}`,
          }} />
          <span style={{
            fontSize: '0.66rem', fontWeight: 700, letterSpacing: '0.22em',
            color: COLORS.softGold, textTransform: 'uppercase', fontFamily: FONTS.body,
            opacity: 0.85,
          }}>
            {language === 'tr' ? 'Altı Kategori' : 'Six Categories'}
          </span>
          <div style={{
            flex: 1, height: '1px',
            background: `linear-gradient(90deg, ${COLORS.softGoldAlpha25}, transparent)`,
            maxWidth: '180px',
          }} />
        </motion.div>
      )}

      {/* Category grid — sadece full mode */}
      {!compact && (
        <motion.div
          variants={fadeUpItem}
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap: columns === 1 ? '14px' : '18px',
          }}
        >
          {TEFEKKUR_CATEGORIES.map((cat) => (
            <TefekkurCategoryCard
              key={cat.id}
              accent={cat.accent}
              count={dynamic?.counts?.[cat.id] ?? cat.count}
              titleTr={cat.titleTr}
              titleEn={cat.titleEn}
              descTr={cat.descTr}
              descEn={cat.descEn}
              icon={cat.icon}
              onClick={() => router.push(`/${language}/tefekkur?cat=${cat.id}`)}
            />
          ))}
        </motion.div>
      )}

      {/* "View all essays" CTA — same secondary signature as ToolsHighlight */}
      <motion.div
        variants={fadeUpItem}
        style={{
          marginTop: '24px',
          display: 'flex',
          justifyContent: 'flex-start',
        }}
      >
        <motion.button
          type="button"
          onClick={handleViewAll}
          whileHover={
            reduced
              ? undefined
              : {
                  scale: 1.02,
                  backgroundColor: COLORS.goldAlpha15,
                  borderColor: COLORS.goldAlpha45,
                  boxShadow: `0 0 28px 2px ${COLORS.goldAlpha15}`,
                }
          }
          whileTap={reduced ? undefined : { scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 320, damping: 24 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '11px 20px',
            background: 'transparent',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: COLORS.goldAlpha25,
            borderRadius: RADIUS.md,
            cursor: 'pointer',
            color: COLORS.gold,
            fontFamily: FONTS.body,
            fontSize: '0.82rem',
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            boxShadow: `0 0 16px ${COLORS.goldAlpha04}`,
          }}
        >
          {language === 'tr' ? 'Tüm Yazıları Gör' : 'View All Essays'}
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </motion.button>
      </motion.div>
    </SectionWrapper>
  );
}

function getColumnCount(width) {
  if (width >= 1024) return 3;
  if (width >= 640)  return 2;
  return 1;
}

// ─── FeaturedEssayCard ───────────────────────────────────────────────────────
// Horizontal card: Arabic root on the left (large, glowed), text content on
// the right (eyebrow + title + tldr + meta). Echoes the in-article RootHero
// at a smaller scale so the homepage previews real visual character.
function FeaturedEssayCard({ essay, language, reduced, onClick }) {
  const tr = language === 'tr';
  const accent = essay.categoryAccent;
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={
        reduced
          ? undefined
          : {
              y: -3,
              borderColor: `${accent}88`,
              boxShadow: `0 0 28px ${accent}26, 0 10px 28px rgba(0,0,0,0.30)`,
            }
      }
      whileTap={reduced ? undefined : { scale: 0.99 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      style={{
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: '110px 1fr',
        gap: '18px',
        padding: '18px 20px',
        textAlign: 'left',
        cursor: 'pointer',
        width: '100%',
        minHeight: '140px',
        borderRadius: RADIUS.lg,
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: `${accent}3a`,
        background: `linear-gradient(135deg, ${accent}14 0%, rgba(255,255,255,0.022) 55%, rgba(255,255,255,0.012) 100%)`,
        overflow: 'hidden',
        fontFamily: FONTS.body,
      }}
    >
      {/* Top accent stripe */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: '2px',
          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
          opacity: 0.7, pointerEvents: 'none',
        }}
      />
      {/* Decorative açık kitap — bottom right, faint */}
      <svg
        aria-hidden="true"
        width="100" height="100" viewBox="0 0 24 24"
        style={{
          position: 'absolute', bottom: '-22px', right: '-26px',
          opacity: 0.06, color: accent, pointerEvents: 'none',
        }}
        fill="currentColor"
      >
        <path d="M11.5 5 L3 4 L3 18 L11.5 19 Z" />
        <path d="M12.5 5 L21 4 L21 18 L12.5 19 Z" />
      </svg>

      {/* Root letters block */}
      <div
        style={{
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: '6px',
          padding: '8px 0',
          borderRight: `1px solid ${accent}1f`,
        }}
        dir="rtl"
        lang="ar"
      >
        <span style={{
          fontFamily: FONTS.quran,
          fontSize: '2rem',
          fontWeight: 400,
          color: accent,
          letterSpacing: '0.04em',
          textShadow: `0 0 18px ${accent}55`,
          lineHeight: 1,
        }}>
          {essay.rootAr}
        </span>
        <span style={{
          fontFamily: FONTS.body,
          fontSize: '0.66rem',
          fontStyle: 'italic',
          color: COLORS.silver,
          letterSpacing: '0.06em',
          opacity: 0.78,
        }} dir="ltr">
          {essay.rootTranslit}
        </span>
      </div>

      {/* Text content */}
      <div style={{
        display: 'flex', flexDirection: 'column', gap: '6px',
        minWidth: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{
            fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.2em',
            color: accent, textTransform: 'uppercase',
          }}>
            {tr ? (essay.eyebrowTr || 'Semantik Seri') : (essay.eyebrowEn || 'Semantic Series')}
          </span>
          {essay.seriesNumber != null && (
            <span style={{
              fontSize: '0.58rem', fontWeight: 600, letterSpacing: '0.06em',
              color: COLORS.silver,
              padding: '1px 7px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: RADIUS.pillSm,
            }}>
              #{essay.seriesNumber}
            </span>
          )}
        </div>

        <h3 style={{
          margin: 0,
          fontFamily: FONTS.display,
          fontSize: '1.05rem',
          color: COLORS.offWhite,
          fontWeight: 700,
          lineHeight: 1.3,
        }}>
          {tr ? essay.titleTr : essay.titleEn}
        </h3>

        <p style={{
          margin: 0,
          fontSize: '0.82rem',
          color: COLORS.offWhiteAlpha72,
          lineHeight: 1.55,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {tr ? essay.tldrTr : essay.tldrEn}
        </p>

        <div style={{
          marginTop: 'auto',
          paddingTop: '6px',
          display: 'flex', alignItems: 'center', gap: '10px',
          fontSize: '0.7rem', color: COLORS.silver,
        }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <svg aria-hidden="true" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {essay.readingMinutes} {tr ? 'dk' : 'min'}
          </span>
          <span style={{ opacity: 0.45 }}>·</span>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '3px',
            color: accent, fontWeight: 600,
          }}>
            {tr ? 'Yazıyı oku' : 'Read essay'}
            <svg aria-hidden="true" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </div>
      </div>
    </motion.button>
  );
}
