'use client';

import { useState, useEffect } from 'react';

// ─── SixGates — 6 Kapı (kategorize edici kapı navigasyonu) ─────────────────────
// Hero'nun hemen altında. 14 anlatı kartını 3 cluster'a + 3 tool kategorisi
// linkine yönlendirir. Anasayfa "katalog/giriş" karakteri buradan başlar.
// PathCards + AllTopics'in yerini alır (her ikisi de kaldırıldı).
// ──────────────────────────────────────────────────────────────────────────────

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS, SEMANTIC, CATEGORY } from '../tokens';

const GATES = [
  {
    id: 'gate-fascination',
    scrollTo: 'mukattaa-card',
    accent: SEMANTIC.accentPrimary,   // #d4a574 — aynı hex, UI aksanı rolü
    eyebrowTr: 'KAPI 01',  eyebrowEn: 'GATE 01',
    titleTr: 'Arapça Bilmeden Görebileceğin Mimari',
    titleEn: 'Architecture Visible Without Arabic',
    descTr: '14 mukattaa harfi · 16 vezin · ritim · ses-anlam · halka kompozisyon · nakarat',
    descEn: '14 mukattaʿāt letters · 16 meters · rhythm · sound-meaning · ring composition · refrain',
    chipsTr: ['Dilsel DNA', 'İmkânsız Ritim', 'Retorik', 'Ses Mimarisi', 'Halka Komp.', 'Sıfır Gereksizlik'],
    chipsEn: ['Linguistic DNA', 'Impossible Rhythm', 'Rhetoric', 'Sound', 'Ring Comp.', 'Zero Redundancy'],
    icon: (
      <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none"/>
        <ellipse cx="12" cy="12" rx="10" ry="4.5"/>
        <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(60 12 12)"/>
        <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(120 12 12)"/>
      </svg>
    ),
  },
  {
    id: 'gate-astonishment',
    scrollTo: 'bilimsel-card',
    accent: CATEGORY.violet,          // #9b59b6 → #a78bfa (§13.25: küçük metinde kontrast)
    eyebrowTr: 'KAPI 02',  eyebrowEn: 'GATE 02',
    titleTr: '1.400 Yıl Önceki Kevnî İşaretler',
    titleEn: 'Cosmic Signs 1,400 Years Earlier',
    descTr: 'Demir · genişleyen evren · iki deniz · embriyoloji · Firavun · Hâmân · hâfız zinciri',
    descEn: 'Iron · expanding universe · two seas · embryology · Pharaoh · Hāmān · ḥuffāẓ chain',
    chipsTr: ['Bilimsel İşaretler', 'Tarihsel İzler', 'Yaşayan Koruma'],
    chipsEn: ['Scientific Signs', 'Historical Traces', 'Living Preservation'],
    icon: (
      <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
  },
  {
    id: 'gate-reflection',
    scrollTo: 'dua-card',
    accent: CATEGORY.blue,            // aynı hex
    eyebrowTr: 'KAPI 03',  eyebrowEn: 'GATE 03',
    titleTr: "Kur'an Seni Nasıl Tanımlıyor?",
    titleEn: 'How Does the Quran Define You?',
    descTr: 'Dua dili · 6 sır · Esmâ köprüsü · insan tanımı · psikoloji · nefs mertebeleri',
    descEn: 'Language of prayer · 6 secrets · Names bridge · human definition · psychology · nafs',
    chipsTr: ['Dua Dili', 'Öne Çıkanlar', 'Esmâ', 'İnsan Tanımı', 'Psikoloji'],
    chipsEn: ['Prayer', 'Highlights', 'Names', 'Human Def.', 'Psychology'],
    icon: (
      <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4"/>
        <path d="M4 21v-2a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v2"/>
      </svg>
    ),
  },
  {
    id: 'gate-stories',
    href: '/atlas/kissa',
    accent: CATEGORY.emerald,         // #27ae60 → #1d9e75 (yakın-tekrar yeşil ayıklandı)
    eyebrowTr: 'KAPI 04',  eyebrowEn: 'GATE 04',
    titleTr: '23 Yıla Yayılan İnsan Hikâyeleri',
    titleEn: '23 Years of Human Stories',
    descTr: 'Peygamberler · kavimler · kadınlar · münâfık · iblîs — Kur\'an\'ın 7 büyük insan portresi',
    descEn: 'Prophets · peoples · women · hypocrites · Iblīs — the Quran\'s great human portraits',
    chipsTr: ['Kıssa Atlası', 'Peygamberler', 'Kavimler', 'Kadınlar', 'Münâfık'],
    chipsEn: ['Stories', 'Prophets', 'Peoples', 'Women', 'Hypocrites'],
    icon: (
      <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="8" y1="13" x2="16" y2="13"/>
        <line x1="8" y1="17" x2="12" y2="17"/>
      </svg>
    ),
  },
  {
    id: 'gate-data',
    href: '/graf/ayet',
    accent: CATEGORY.orange,          // aynı hex
    eyebrowTr: 'KAPI 05',  eyebrowEn: 'GATE 05',
    titleTr: 'Veriyle Keşfet, Görselle Anla',
    titleEn: 'Discover by Data, Understand by Visual',
    descTr: 'Ayet graf · kavram ağı · kelime ısı haritası · sûre DNA · semantik harita',
    descEn: 'Verse graph · concept network · word heatmap · sura DNA · semantic map',
    chipsTr: ['Ayet Grafı', 'Kavram', 'Kelime Isı', 'Sûre DNA', 'Semantik'],
    chipsEn: ['Verse Graph', 'Concept', 'Word Heat', 'Sura DNA', 'Semantic'],
    icon: (
      <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="6" cy="6" r="2"/>
        <circle cx="18" cy="6" r="2"/>
        <circle cx="6" cy="18" r="2"/>
        <circle cx="18" cy="18" r="2"/>
        <circle cx="12" cy="12" r="2"/>
        <line x1="7.4" y1="7.4" x2="10.6" y2="10.6"/>
        <line x1="16.6" y1="7.4" x2="13.4" y2="10.6"/>
        <line x1="7.4" y1="16.6" x2="10.6" y2="13.4"/>
        <line x1="16.6" y1="16.6" x2="13.4" y2="13.4"/>
      </svg>
    ),
  },
  {
    id: 'gate-tools',
    href: '/atlas/sunnetullah',
    accent: CATEGORY.red,             // aynı hex
    eyebrowTr: 'KAPI 06',  eyebrowEn: 'GATE 06',
    titleTr: 'Atlaslarda Detayda Kaybol',
    titleEn: 'Lose Yourself in Atlas Detail',
    descTr: 'Sünnetullah · tabiat · zaman boyutları · yeminler · renkler · mesel · münâsebât',
    descEn: 'Sunnatullah · nature · time · oaths · colors · parables · munāsabāt',
    chipsTr: ['Sünnetullah', 'Tabiat', 'Zaman', 'Yeminler', 'Renkler'],
    chipsEn: ['Sunnatullāh', 'Nature', 'Time', 'Oaths', 'Colors'],
    icon: (
      <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2"/>
        <polyline points="2 17 12 22 22 17"/>
        <polyline points="2 12 12 17 22 12"/>
      </svg>
    ),
  },
];

function Gate({ gate, isMobile, language }) {
  const tr = language === 'tr';
  const reduced = useReducedMotion();
  const chips = tr ? gate.chipsTr : gate.chipsEn;

  const handleClick = (e) => {
    if (gate.scrollTo) {
      e.preventDefault();
      const el = document.getElementById(gate.scrollTo);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const inner = (
    <motion.div className="mq-box"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={reduced ? undefined : { y: -4 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, type: 'spring', stiffness: 140 }}
      style={{
        position: 'relative',
        // Grid cell stretch + explicit minHeight — kısa içerikli kartların uzun kartlarla
        // balanced grid görünümünü korumak için (Visual audit O-10, 2026-07-12).
        height: '100%',
        // Mobilde 320px sabit yükseklik kartları gereksiz uzatıyordu: desc
        // gizlenince boşalan yeri chip'lerin flexGrow'u yutuyor, kart yine
        // 320px kalıyordu. Mobilde eşit yükseklik zorlamasına gerek yok —
        // kartlar tek sütunda alt alta, hizalanacak komşusu yok. (2026-08-13)
        minHeight: isMobile ? 0 : '320px',
        display: 'flex',
        flexDirection: 'column',
        '--pt-d': "26px", '--pt-m': "22px", '--pr-d': "24px", '--pr-m': "20px", '--pb-d': "26px", '--pb-m': "22px", '--pl-d': "24px", '--pl-m': "20px",
        background: `linear-gradient(180deg, ${gate.accent}10 0%, rgba(255,255,255,0.02) 100%)`,
        border: `1px solid ${gate.accent}40`,
        borderRadius: '16px',
        boxShadow: `inset 0 0 0 1px ${gate.accent}10, 0 18px 50px rgba(0,0,0,0.35)`,
        cursor: 'pointer',
        transition: 'border-color 0.25s, box-shadow 0.25s',
        overflow: 'hidden',
      }}
    >
      {/* Kapı 05 (Veriyle Keşfet) — subtle graf node/edge arka plan,
          5% opacity, sadece bu kart için. Kullanıcı tool sayfasına
          girmeden 'veri tadı' alır (Gemini önerisi 2026-06-15). */}
      {gate.id === 'gate-data' && (
        <svg
          aria-hidden="true"
          viewBox="0 0 200 200"
          preserveAspectRatio="xMidYMid slice"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            opacity: 0.07,
            pointerEvents: 'none',
          }}
        >
          {/* Nodes */}
          <circle cx="40" cy="60" r="4" fill={gate.accent} />
          <circle cx="100" cy="40" r="5" fill={gate.accent} />
          <circle cx="160" cy="70" r="4" fill={gate.accent} />
          <circle cx="60" cy="120" r="3" fill={gate.accent} />
          <circle cx="120" cy="130" r="5" fill={gate.accent} />
          <circle cx="170" cy="150" r="3" fill={gate.accent} />
          <circle cx="30" cy="170" r="4" fill={gate.accent} />
          <circle cx="100" cy="180" r="3" fill={gate.accent} />
          {/* Edges */}
          <line x1="40" y1="60"   x2="100" y2="40"  stroke={gate.accent} strokeWidth="0.8" />
          <line x1="100" y1="40"  x2="160" y2="70"  stroke={gate.accent} strokeWidth="0.8" />
          <line x1="40" y1="60"   x2="60"  y2="120" stroke={gate.accent} strokeWidth="0.8" />
          <line x1="60" y1="120"  x2="120" y2="130" stroke={gate.accent} strokeWidth="0.8" />
          <line x1="120" y1="130" x2="160" y2="70"  stroke={gate.accent} strokeWidth="0.8" />
          <line x1="120" y1="130" x2="170" y2="150" stroke={gate.accent} strokeWidth="0.8" />
          <line x1="60" y1="120"  x2="30"  y2="170" stroke={gate.accent} strokeWidth="0.8" />
          <line x1="30" y1="170"  x2="100" y2="180" stroke={gate.accent} strokeWidth="0.8" />
          <line x1="100" y1="180" x2="170" y2="150" stroke={gate.accent} strokeWidth="0.8" />
          <line x1="100" y1="40"  x2="120" y2="130" stroke={gate.accent} strokeWidth="0.6" opacity="0.7" />
        </svg>
      )}

      {/* Eyebrow + Icon row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <span style={{
          color: gate.accent,
          fontFamily: FONTS.body,
          fontSize: '0.66rem',
          fontWeight: 700,
          letterSpacing: '0.22em',
          opacity: 0.85,
        }}>
          {tr ? gate.eyebrowTr : gate.eyebrowEn}
        </span>
        <div style={{
          width: '38px', height: '38px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: '50%',
          background: `${gate.accent}18`,
          border: `1px solid ${gate.accent}55`,
          color: gate.accent,
          flexShrink: 0,
        }}>
          {gate.icon}
        </div>
      </div>

      {/* Title */}
      <h3 style={{
        fontFamily: FONTS.display,
        fontWeight: 700,
        fontSize: isMobile ? 'clamp(1.05rem, 4vw, 1.25rem)' : 'clamp(1.15rem, 1.6vw, 1.35rem)',
        color: COLORS.offWhite,
        lineHeight: 1.25,
        letterSpacing: '-0.01em',
        margin: '0 0 10px',
      }}>
        {tr ? gate.titleTr : gate.titleEn}
      </h3>

      {/* Description — mobilde gizli (2026-08-13, todo P3).
          Bu satır chip'lerle AYNI bilgiyi veriyor: desc "14 mukattaa harfi ·
          16 vezin · ritim…", chip'ler "Dilsel DNA", "İmkânsız Ritim"…
          Mobilde 6 kapı alt alta gelince bu çift gösterim bölümü 1.006px'ten
          2.395px'e çıkarıyordu. İçerik kaybı yok — chip'ler aynı araçları
          zaten adlandırıyor. Gizleme globals.css'te @media ile. */}
      {!isMobile && (
        <p style={{
          color: COLORS.silver,
          fontFamily: FONTS.body,
          fontSize: '0.82rem',
          lineHeight: 1.55,
          margin: '0 0 14px',
          opacity: 0.9,
        }}>
          {tr ? gate.descTr : gate.descEn}
        </p>
      )}

      {/* Chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '14px', flexGrow: isMobile ? 0 : 1, alignContent: 'flex-start' }}>
        {chips.map((chip, i) => (
          <span key={i} style={{
            padding: '3px 9px',
            borderRadius: '999px',
            background: `${gate.accent}14`,
            border: `1px solid ${gate.accent}33`,
            color: gate.accent,
            fontFamily: FONTS.body,
            fontSize: '0.7rem',
            fontWeight: 500,
            opacity: 0.95,
          }}>
            {chip}
          </span>
        ))}
      </div>

      {/* CTA — margin-top: auto sayesinde tüm kartlarda aynı hizada (en altta) */}
      <div style={{
        marginTop: 'auto',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        color: gate.accent,
        fontFamily: FONTS.body,
        fontSize: '0.78rem',
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        paddingTop: '6px',
      }}>
        <span>{tr ? 'Keşfet' : 'Explore'}</span>
        <span style={{ fontSize: '0.95rem', lineHeight: 1 }}>→</span>
      </div>
    </motion.div>
  );

  if (gate.scrollTo) {
    return (
      <button
        onClick={handleClick}
        style={{ all: 'unset', display: 'block', cursor: 'pointer', height: '100%' }}
        aria-label={tr ? `${gate.titleTr} bölümüne atla` : `Jump to ${gate.titleEn}`}
      >
        {inner}
      </button>
    );
  }
  return (
    <Link href={`/${language}${gate.href}`} style={{ display: 'block', height: '100%', textDecoration: 'none' }}>
      {inner}
    </Link>
  );
}

export default function SixGates() {
  const { language } = useLanguage();
  const reduced = useReducedMotion();
  const tr = language === 'tr';

  // SSR-safe mobil algılama (§16.6). 2026-08-13'e kadar Gate'e isMobile={false}
  // SABİT geçiliyordu — yani bileşenin mobil dalı hiç çalışmıyordu.
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 640);
    h();
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  return (
    <section
      id="six-gates"
      style={{
        background: `linear-gradient(180deg, ${SEMANTIC.surfaceRaised} 0%, ${SEMANTIC.surface} 100%)`,
        padding: '70px 24px 60px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: '40px' }}
        >
          <div style={{
            color: `${COLORS.gold}cc`,
            fontFamily: FONTS.body,
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            marginBottom: '14px',
          }}>
            {tr ? 'Altı Kapı · Keşif Yolları' : 'Six Gates · Paths of Discovery'}
          </div>
          <h2 style={{
            fontFamily: FONTS.display,
            fontWeight: 700,
            fontSize: 'clamp(1.7rem, 4vw, 2.4rem)',
            color: COLORS.offWhite,
            lineHeight: 1.2,
            letterSpacing: '-0.015em',
            margin: '0 auto 12px',
            maxWidth: '720px',
          }}>
            {tr ? 'Nereden Başlamak İstiyorsun?' : 'Where Would You Like to Begin?'}
          </h2>
          <p style={{
            color: COLORS.silver,
            fontFamily: FONTS.body,
            fontStyle: 'italic',
            fontSize: 'clamp(0.92rem, 1.6vw, 1.05rem)',
            lineHeight: 1.65,
            margin: '0 auto',
            maxWidth: '620px',
          }}>
            {tr
              ? 'Konuya göre bir kapı seç — ya anasayfanın derinine in, ya doğrudan bir tool sayfasına geç.'
              : 'Choose a gate by topic — go deep within this page, or jump straight to a tool page.'}
          </p>
          <div style={{
            width: '120px',
            height: '1px',
            margin: '20px auto 0',
            background: `linear-gradient(90deg, transparent, ${COLORS.gold}aa, transparent)`,
          }} />
        </motion.div>

        {/* 6 gates grid — 2 col mobile, 3 col tablet, 3 col desktop */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
          gridAutoFlow: 'row',
          maxWidth: '1200px',
          margin: '0 auto',
          gap: '18px',
        }}
        className="six-gates-grid"
        >
          {GATES.map(gate => (
            <Gate key={gate.id} gate={gate} isMobile={isMobile} language={language} />
          ))}
        </div>
      </div>
    </section>
  );
}
