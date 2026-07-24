'use client';

// ─── TarihselKanitlar — Tam tool (2026-07-06 refactor: wrapper → real tool) ───
// Kaynak: tarihsel-kanitlar.json (10 kanıt, 4 kategori, 6 ulema, 18-nokta timeline).
// Denetim raporu: docs/reviews/2026-07-06-kesfet-audit.md (Dalga 1.1 sayfası).
// Pattern: SunnetullahAtlasi + MunafikProfili premium bar.

import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { cleanArabicForDisplay as cleanArabic } from '../lib/arabic';
import { COLORS, FONTS, GLASS_CARD, BREAKPOINT_TABLET, RADIUS, VERSE_BLOCK, TEXT } from '../tokens';
import ToolHeader from './ToolHeader';
import CrossToolCTA from './CrossToolCTA';
import useFocusTrap from '../hooks/useFocusTrap';

// ─── Confidence chip system ──────────────────────────────────────────────────
const CONFIDENCE_META = {
  kesin:      { tr: 'Kesin',      en: 'Certain',     color: '#1D9E75' },
  guclu:      { tr: 'Güçlü',      en: 'Strong',      color: '#c9a227' },
  muhtemel:   { tr: 'Muhtemel',   en: 'Probable',    color: '#3498db' },
  tartismali: { tr: 'Tartışmalı', en: 'Contested',   color: '#94a3b8' },
};

// ─── Category icons ─────────────────────────────────────────────────────────
const CATEGORY_ICONS = {
  'arkeoloji': (color) => (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path d="M4 18 L4 10 L11 5 L18 10 L18 18 Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" fill={`${color}18`} />
      <path d="M7 18 V13 H15 V18" stroke={color} strokeWidth="1.3" strokeLinejoin="round" fill="none" />
      <circle cx="11" cy="15" r="0.8" fill={color} />
    </svg>
  ),
  'metin-filolojisi': (color) => (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path d="M4 4 L18 4 L18 17 Q18 19 16 19 L4 19 Z" stroke={color} strokeWidth="1.4" strokeLinejoin="round" fill={`${color}18`} />
      <path d="M7 8 H15 M7 11 H15 M7 14 H12" stroke={color} strokeWidth="1.3" strokeLinecap="round" opacity="0.75" />
      <circle cx="15" cy="6.5" r="0.8" fill={color} />
    </svg>
  ),
  'kehanet': (color) => (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path d="M11 2 V4 M11 18 V20 M2 11 H4 M18 11 H20 M4.5 4.5 L6 6 M16 16 L17.5 17.5 M4.5 17.5 L6 16 M16 6 L17.5 4.5" stroke={color} strokeWidth="1.3" strokeLinecap="round" opacity="0.55" />
      <circle cx="11" cy="11" r="6" stroke={color} strokeWidth="1.4" fill={`${color}22`} />
      <path d="M11 8 V11 L13.5 12.5" stroke={color} strokeWidth="1.4" strokeLinecap="round" fill="none" />
    </svg>
  ),
  'kulturel-kesisim': (color) => (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <circle cx="8" cy="11" r="5" stroke={color} strokeWidth="1.4" fill={`${color}18`} />
      <circle cx="14" cy="11" r="5" stroke={color} strokeWidth="1.4" fill={`${color}18`} />
      <path d="M11 11 Q11 6.5 8 6.5 M11 11 Q11 15.5 8 15.5 M11 11 Q11 6.5 14 6.5 M11 11 Q11 15.5 14 15.5" stroke={color} strokeWidth="0.8" fill="none" opacity="0.6" />
    </svg>
  ),
};

function CategoryIcon({ id, color, size = 24 }) {
  const IconFn = CATEGORY_ICONS[id];
  if (!IconFn) return null;
  return (
    <span style={{
      display: 'inline-flex', width: size, height: size,
      alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>{IconFn(color)}</span>
  );
}

const TABS = [
  { tr: 'Kanıtlar', en: 'Evidences',
    icon: (
      <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12l2 2 4-4"/>
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
      </svg>
    ),
  },
  { tr: 'Keşif Timeline', en: 'Discovery Timeline',
    icon: (
      <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="3" y1="12" x2="21" y2="12" />
        <circle cx="6" cy="12" r="1.5" fill="currentColor"/>
        <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
        <circle cx="18" cy="12" r="1.5" fill="currentColor"/>
      </svg>
    ),
  },
  { tr: 'Akademik Görüşler', en: 'Academic Views',
    icon: (
      <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
      </svg>
    ),
  },
  { tr: 'Metodoloji', en: 'Methodology',
    icon: (
      <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 8v4M12 16h.01"/>
      </svg>
    ),
  },
];

export default function TarihselKanitlar({ onClose }) {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const trapRef = useFocusTrap(true);
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [expandedKanitId, setExpandedKanitId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const bodyRef = useRef(null);

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < BREAKPOINT_TABLET);
    h();
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  useEffect(() => {
    fetch('/tarihsel-kanitlar.json')
      .then(r => r.json())
      .then(d => setData(d))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
  }, [activeTab]);

  const TOOL_HEADER = (
    <ToolHeader
      icon={
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 22h20"/><path d="M6 18V8l6-4 6 4v10"/><path d="M9 22V13h6v9"/>
        </svg>
      }
      titleTr="Tarihsel Kanıtlar"
      titleEn="Historical Proofs"
      subtitleTr="10 kanıt · 4 kategori · arkeoloji · metin filolojisi · kehânet"
      subtitleEn="10 evidences · 4 categories · archaeology · text philology · prophecy"
      language={language}
    />
  );

  if (!data) {
    return (
      <div ref={trapRef} style={{ background: COLORS.cosmicBlack, minHeight: 'calc(100vh - 62px)', display: 'flex', flexDirection: 'column', paddingTop: '62px' }}>
        {TOOL_HEADER}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: COLORS.silver, fontFamily: FONTS.body }}>{tr ? 'Yükleniyor…' : 'Loading…'}</span>
        </div>
      </div>
    );
  }

  const { meta, intro, categories, kanitlar, scholars, timeline } = data;

  const filteredKanitlar = activeCategoryId
    ? kanitlar.filter(k => k.categoryId === activeCategoryId)
    : kanitlar;

  return (
    <div ref={trapRef} style={{
      background: COLORS.cosmicBlack,
      minHeight: 'calc(100vh - 62px)',
      display: 'flex', flexDirection: 'column',
      paddingTop: '62px',
    }}>
      {TOOL_HEADER}

      <div ref={bodyRef} style={{ flex: 1, overflowX: 'hidden' }}>

        {/* ── HERO ──────────────────────────────────────────────────────── */}
        <div style={{
          padding: isMobile ? '40px 20px 28px' : '56px 40px 36px',
          background: 'linear-gradient(180deg, rgba(212,165,116,0.06) 0%, transparent 100%)',
          borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
          textAlign: 'center',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Islamic geometric pattern */}
          <svg aria-hidden="true" width="100%" height="100%" style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            opacity: 0.05, mixBlendMode: 'screen',
          }}>
            <defs>
              <pattern id="tarih-geometric" x="0" y="0" width="72" height="72" patternUnits="userSpaceOnUse">
                <path d="M36 6 L54 18 L54 42 L36 54 L18 42 L18 18 Z" stroke={COLORS.gold} strokeWidth="0.6" fill="none" />
                <path d="M36 18 L45 24 L45 36 L36 42 L27 36 L27 24 Z" stroke={COLORS.gold} strokeWidth="0.4" fill="none" opacity="0.6" />
                <circle cx="36" cy="30" r="1.8" fill={COLORS.gold} opacity="0.4" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#tarih-geometric)" />
          </svg>
          <div aria-hidden="true" style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%', height: '90%', pointerEvents: 'none',
            background: `radial-gradient(ellipse at center, ${COLORS.gold}0F 0%, transparent 70%)`,
            filter: 'blur(4px)',
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Bismillah */}
            <div dir="rtl" lang="ar" aria-label="Bismillāh" style={{
              fontFamily: FONTS.bismillah,
              fontSize: isMobile ? '1.5rem' : '1.95rem',
              color: COLORS.gold, opacity: 0.82, lineHeight: 1,
              marginBottom: isMobile ? '28px' : '40px',
              textShadow: `0 0 22px ${COLORS.gold}28`,
            }}>﷽</div>

            {/* Anchor verse */}
            <p dir="rtl" lang="ar" style={{
              fontFamily: FONTS.quran,
              fontSize: isMobile ? 'clamp(1.05rem, 4.2vw, 1.4rem)' : 'clamp(1.25rem, 2.3vw, 1.7rem)',
              color: COLORS.gold,
              lineHeight: 2.1, margin: '0 auto 16px',
              maxWidth: '820px',
              textShadow: `0 0 20px ${COLORS.gold}1c`,
            }}>{cleanArabic('فَالْيَوْمَ نُنَجِّيكَ بِبَدَنِكَ لِتَكُونَ لِمَنْ خَلْفَكَ اٰيَةً')}</p>

            <p style={{
              color: COLORS.offWhite, fontFamily: FONTS.display, fontStyle: 'italic',
              fontSize: isMobile ? '0.94rem' : 'clamp(0.95rem, 1.6vw, 1.05rem)',
              lineHeight: 1.7, margin: '0 auto 8px', maxWidth: '660px', opacity: 0.95,
            }}>
              "{tr
                ? "Bugün senin bedenini kurtaracağız ki senden sonra geleceklere ibret olasın."
                : "This day We shall save you in your body, that you may be a sign for those who follow you."}"
            </p>

            <p style={{
              color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.72rem',
              letterSpacing: '0.16em', textTransform: 'uppercase',
              margin: '0 0 36px', opacity: 0.65,
            }}>— {tr ? 'Yûnus 10:92' : 'Yūnus 10:92'}</p>

            {/* Framing whisper */}
            <p style={{
              color: COLORS.silver, fontFamily: FONTS.display, fontStyle: 'italic',
              fontSize: isMobile ? '0.92rem' : 'clamp(0.95rem, 1.55vw, 1.02rem)',
              lineHeight: 1.7, margin: '0 auto 40px', maxWidth: '700px', opacity: 0.88,
            }}>
              {tr
                ? <>Kur'ân'ın 7. yüzyıl metni, modern arkeoloji ve metin filolojisinin ancak <em style={{ fontStyle: 'normal', color: COLORS.gold, opacity: 0.95 }}>19-20. yüzyılda</em> erişebildiği tarihsel gerçeklerin <em style={{ fontStyle: 'normal', color: COLORS.gold, opacity: 0.95 }}>izlerini</em> taşır.</>
                : <>The 7th-century Qur'anic text carries <em style={{ fontStyle: 'normal', color: COLORS.gold, opacity: 0.95 }}>traces</em> of historical realities that modern archaeology and text philology could only access in the <em style={{ fontStyle: 'normal', color: COLORS.gold, opacity: 0.95 }}>19th-20th centuries</em>.</>}
            </p>

            {/* Filigree divider */}
            <div aria-hidden="true" style={{
              width: '120px', height: '1px',
              background: `linear-gradient(to right, transparent, ${COLORS.gold}66, transparent)`,
              margin: '0 auto 32px',
            }} />

            {/* Eyebrow */}
            <div style={{
              fontSize: '0.68rem', letterSpacing: '0.3em',
              color: COLORS.gold, textTransform: 'uppercase',
              fontFamily: FONTS.body, fontWeight: 700, opacity: 0.72,
              marginBottom: '14px',
            }}>
              {tr ? 'ZAMANDA GÖMÜLÜ · METİNDE KAYITLI' : 'BURIED IN TIME · INSCRIBED IN TEXT'}
            </div>

            <h1 style={{
              color: COLORS.offWhite,
              fontSize: isMobile ? 'clamp(1.6rem, 7vw, 2rem)' : 'clamp(2rem, 3.6vw, 2.7rem)',
              fontWeight: 700, fontFamily: FONTS.display,
              margin: '0 auto 14px', lineHeight: 1.18,
              letterSpacing: '-0.015em', maxWidth: '760px',
            }}>{tr ? intro.titleTr : intro.titleEn}</h1>

            <p style={{
              fontFamily: FONTS.display,
              fontSize: isMobile ? '1rem' : 'clamp(1.05rem, 1.8vw, 1.18rem)',
              color: COLORS.gold, margin: '0 auto 28px',
              lineHeight: 1.55, fontStyle: 'italic',
              maxWidth: '700px', opacity: 0.92,
            }}>{tr ? intro.subtitleTr : intro.subtitleEn}</p>

            <p style={{
              color: COLORS.silver, fontSize: '0.9rem',
              fontFamily: FONTS.body, margin: '0 auto 28px',
              lineHeight: 1.75, maxWidth: '720px', opacity: 0.95,
              textAlign: 'left',
            }}>{tr ? intro.descTr : intro.descEn}</p>

            {/* Stat chips */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: isMobile ? '8px' : '12px', flexWrap: 'wrap' }}>
              {[
                { value: meta.totalKanitlar, tr: 'kanıt', en: 'evidences', color: COLORS.gold },
                { value: meta.totalCategories, tr: 'kategori', en: 'categories', color: COLORS.emerald },
                { value: meta.totalScholars, tr: 'akademisyen', en: 'scholars', color: COLORS.skyBlue },
                { value: timeline.length, tr: 'timeline', en: 'timeline', color: '#8b5cf6' },
              ].map((s, i) => (
                <div key={i} style={{
                  padding: isMobile ? '8px 14px' : '10px 18px',
                  background: `${s.color}12`, border: `1px solid ${s.color}30`,
                  borderRadius: RADIUS.pill, display: 'flex', alignItems: 'center', gap: '8px',
                }}>
                  <span style={{ color: s.color, fontSize: '1rem', fontWeight: 800, fontFamily: FONTS.body, lineHeight: 1 }}>{s.value}</span>
                  <span style={{ color: COLORS.silver, fontSize: '0.75rem', fontFamily: FONTS.body, lineHeight: 1 }}>{tr ? s.tr : s.en}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── TAB BAR ────────────────────────────────────────────────────── */}
        <div id="tarihsel-tab-bar" style={{
          display: 'flex', gap: '2px',
          padding: isMobile ? '0 8px' : '0 16px',
          borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
          background: 'rgb(6, 8, 14)',
          backgroundColor: 'rgb(6, 8, 14)',
          isolation: 'isolate',
          position: 'sticky', top: '110px', zIndex: 20,
          scrollMarginTop: '120px',
          overflowX: 'auto', scrollbarWidth: 'none', flexShrink: 0,
        }}>
          {TABS.map((t, i) => {
            const isActive = activeTab === i;
            return (
              <button
                key={i}
                onClick={() => {
                  setActiveTab(i);
                  setTimeout(() => document.getElementById('tarihsel-tab-bar')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
                }}
                style={{
                  padding: isMobile ? '14px 14px' : '16px 22px',
                  fontSize: isMobile ? '0.72rem' : '0.78rem',
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? COLORS.gold : COLORS.silver,
                  border: 'none',
                  borderBottom: isActive ? `2px solid ${COLORS.gold}` : '2px solid transparent',
                  background: isActive ? COLORS.goldAlpha15 : 'transparent',
                  cursor: 'pointer', whiteSpace: 'nowrap',
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                }}
              >
                <span style={{ opacity: isActive ? 1 : 0.6 }}>{t.icon}</span>
                {tr ? t.tr : t.en}
              </button>
            );
          })}
        </div>

        {/* ── TAB CONTENT ────────────────────────────────────────────────── */}
        <div style={{ padding: isMobile ? '20px 16px 48px' : '32px 40px 64px' }}>

          {activeTab === 0 && (
            <KanitlarTab
              kanitlar={filteredKanitlar}
              categories={categories}
              activeCategoryId={activeCategoryId}
              onCategoryToggle={id => setActiveCategoryId(activeCategoryId === id ? null : id)}
              expandedKanitId={expandedKanitId}
              onKanitToggle={id => setExpandedKanitId(expandedKanitId === id ? null : id)}
              language={language} isMobile={isMobile}
            />
          )}

          {activeTab === 1 && (
            <TimelineTab timeline={timeline} language={language} isMobile={isMobile} />
          )}

          {activeTab === 2 && (
            <ScholarsTab scholars={scholars} language={language} isMobile={isMobile} />
          )}

          {activeTab === 3 && (
            <MethodologyTab intro={intro} language={language} isMobile={isMobile} />
          )}

          <CrossToolCTA
            language={language}
            isMobile={isMobile}
            links={[
              { href: `/${language}/atlas/sunnetullah`, titleTr: 'Sünnetullah Atlası', titleEn: 'Atlas of Divine Patterns', descTr: 'Tarihin ilâhî yasaları — kavimlerin yükseliş ve çöküş örüntüleri.', descEn: 'Divine laws of history — patterns of rise and fall of nations.' },
              { href: `/${language}/atlas/kavim`, titleTr: 'Kavimler Atlası', titleEn: 'Nations Atlas', descTr: 'Ad, Semûd, Firavun ve diğerleri — arkeolojik bağlamlarıyla.', descEn: 'ʿĀd, Thamūd, Pharaoh and others — with archaeological context.' },
              { href: `/${language}/atlas/kissa`, titleTr: 'Kıssa Atlası', titleEn: 'Story Atlas', descTr: 'Peygamber kıssalarının yapısı — anlatım ve tarihsel arka plan.', descEn: 'Structure of prophetic narratives — narrative and historical background.' },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// KANITLAR TAB
// ═══════════════════════════════════════════════════════════════════════════
function KanitlarTab({ kanitlar, categories, activeCategoryId, onCategoryToggle, expandedKanitId, onKanitToggle, language, isMobile }) {
  const tr = language === 'tr';
  return (
    <div>
      <p style={{
        color: COLORS.silver, fontSize: isMobile ? '0.88rem' : '0.92rem',
        fontFamily: FONTS.body, lineHeight: 1.75, margin: '0 0 20px',
      }}>
        {tr
          ? 'Aşağıdaki 10 kanıt 4 metodoloji kategorisine ayrılmıştır. Her kanıt için iddia gücü seviyesi ve klasik + modern akademik referanslar belirtilmiştir.'
          : 'The 10 evidences below are organized under 4 methodological categories. Each carries a claim-strength level and classical + modern academic references.'}
      </p>

      {/* Category filter chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
        {categories.map(cat => {
          const isActive = cat.id === activeCategoryId;
          return (
            <button
              key={cat.id}
              onClick={() => onCategoryToggle(cat.id)}
              style={{
                padding: isMobile ? '6px 12px' : '8px 16px',
                borderRadius: RADIUS.pill,
                border: `1px solid ${isActive ? cat.color : COLORS.glassBorder}`,
                background: isActive ? `${cat.color}22` : 'transparent',
                color: isActive ? cat.color : COLORS.silver,
                fontSize: isMobile ? '0.78rem' : '0.85rem',
                fontWeight: isActive ? 600 : 400,
                fontFamily: FONTS.body,
                cursor: 'pointer', transition: 'all 0.18s',
                whiteSpace: 'nowrap',
                display: 'inline-flex', alignItems: 'center', gap: '7px',
              }}
            >
              <CategoryIcon id={cat.id} color={isActive ? cat.color : COLORS.silver} size={16} />
              <span>{tr ? cat.titleTr : cat.titleEn}</span>
              <span style={{ opacity: 0.65, fontSize: '0.72rem' }}>({kanitlar.filter(k => k.categoryId === cat.id || activeCategoryId === cat.id).length})</span>
            </button>
          );
        })}
        {activeCategoryId && (
          <button
            onClick={() => onCategoryToggle(activeCategoryId)}
            style={{
              padding: isMobile ? '6px 12px' : '8px 14px',
              borderRadius: RADIUS.pill,
              border: `1px solid ${COLORS.gold}40`,
              background: 'transparent',
              color: COLORS.gold,
              fontSize: isMobile ? '0.78rem' : '0.85rem',
              fontFamily: FONTS.body, cursor: 'pointer',
            }}
          >× {tr ? 'Filtreyi kaldır' : 'Clear filter'}</button>
        )}
      </div>

      {/* Kanıt cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {kanitlar.map((k, i) => (
          <KanitCard key={k.id} kanit={k} category={categories.find(c => c.id === k.categoryId)} index={i + 1}
            isOpen={expandedKanitId === k.id} onToggle={() => onKanitToggle(k.id)}
            language={language} isMobile={isMobile} />
        ))}
      </div>
    </div>
  );
}

function KanitCard({ kanit, category, index, isOpen, onToggle, language, isMobile }) {
  const tr = language === 'tr';
  const cat = category || { color: COLORS.gold };
  const conf = CONFIDENCE_META[kanit.confidence] || CONFIDENCE_META.muhtemel;
  return (
    <div style={{
      padding: isMobile ? '20px 18px' : '26px 30px',
      background: `linear-gradient(135deg, ${cat.color}0A 0%, rgba(255,255,255,0.02) 45%)`,
      border: `1px solid ${cat.color}35`,
      borderLeft: `3px solid ${cat.color}`,
      borderRadius: RADIUS.md,
      display: 'flex', flexDirection: 'column', gap: '14px',
      position: 'relative', overflow: 'hidden',
      transition: 'all 0.25s',
    }}>
      {/* Ambient corner glow */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: '-30px', right: '-30px',
        width: '160px', height: '160px', pointerEvents: 'none',
        background: `radial-gradient(circle at center, ${cat.color}22 0%, transparent 65%)`,
        filter: 'blur(2px)',
      }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: isMobile ? '12px' : '16px', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
        <div style={{
          flexShrink: 0,
          width: isMobile ? '46px' : '54px', height: isMobile ? '46px' : '54px',
          borderRadius: '50%',
          background: `radial-gradient(circle at center, ${cat.color}25 0%, ${cat.color}08 70%, transparent 100%)`,
          border: `1px solid ${cat.color}55`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 0 18px ${cat.color}22`,
        }}>
          <CategoryIcon id={kanit.categoryId} color={cat.color} size={isMobile ? 24 : 28} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.16em',
            color: cat.color, textTransform: 'uppercase',
            fontFamily: FONTS.body, marginBottom: '6px', opacity: 0.85,
          }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: '20px', height: '20px', borderRadius: '50%',
              background: `${cat.color}22`, border: `1px solid ${cat.color}55`,
              fontSize: '0.68rem', fontWeight: 800,
            }}>{index}</span>
            {tr ? category.titleTr : category.titleEn}
            <span style={{
              padding: '2px 8px', borderRadius: RADIUS.pill,
              background: `${conf.color}22`,
              border: `1px solid ${conf.color}55`,
              color: conf.color,
              fontSize: '0.6rem', letterSpacing: '0.12em',
            }}>
              {tr ? conf.tr : conf.en}
            </span>
          </div>
          <h3 style={{
            margin: 0, fontFamily: FONTS.display,
            fontSize: isMobile ? '1.15rem' : '1.35rem',
            fontWeight: 700, color: COLORS.offWhite, lineHeight: 1.25,
          }}>{tr ? kanit.titleTr : kanit.titleEn}</h3>
          <div style={{
            display: 'flex', gap: '12px', flexWrap: 'wrap',
            marginTop: '8px', fontSize: '0.72rem',
            color: COLORS.silver, fontFamily: FONTS.body,
          }}>
            <span>📖 <strong style={{ color: cat.color, fontWeight: 600 }}>{kanit.verseRef}</strong></span>
            <span>🗓 {tr ? kanit.dateSpanTr : kanit.dateSpanEn}</span>
            <span>🔍 {tr ? kanit.discoveryYear : kanit.discoveryYearEn}</span>
          </div>
        </div>
      </div>

      {/* Verse block — canonical VERSE_BLOCK + TEXT (§13.5) */}
      <div style={{ ...VERSE_BLOCK, padding: '14px 18px', position: 'relative', zIndex: 1 }}>
        <p dir="rtl" lang="ar" style={{
          ...TEXT.verseArabic,
          fontSize: isMobile ? '1.15rem' : '1.4rem',
          margin: '0 0 10px',
        }}>{cleanArabic(kanit.verseAr)}</p>
        <p style={{
          fontSize: '0.85rem', color: COLORS.offWhite,
          fontFamily: FONTS.body, lineHeight: 1.7, margin: 0,
          fontStyle: 'italic',
        }}>
          "{tr ? kanit.verseTr : kanit.verseEn}"
        </p>
      </div>

      {/* Summary */}
      <p style={{
        margin: 0, fontSize: '0.88rem', color: COLORS.offWhite,
        fontFamily: FONTS.body, lineHeight: 1.75,
        position: 'relative', zIndex: 1,
      }}>{tr ? kanit.summaryTr : kanit.summaryEn}</p>

      {/* Toggle for details */}
      <button
        onClick={onToggle}
        style={{
          alignSelf: 'flex-start',
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          padding: '6px 12px', borderRadius: RADIUS.pill,
          background: `${cat.color}18`, border: `1px solid ${cat.color}40`,
          color: cat.color, cursor: 'pointer',
          fontSize: '0.75rem', fontFamily: FONTS.body, fontWeight: 600,
          transition: 'all 0.18s',
          position: 'relative', zIndex: 1,
        }}
      >
        {isOpen ? (tr ? 'Detayı kapat' : 'Close details') : (tr ? 'Ayrıntı & Kaynaklar' : 'Details & Sources')}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Expanded content */}
      {isOpen && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', position: 'relative', zIndex: 1 }}>
          {/* Scholarly detail */}
          <div style={{
            padding: '14px 18px',
            background: 'rgba(52,152,219,0.06)',
            border: `1px solid rgba(52,152,219,0.22)`,
            borderLeft: `2px solid ${COLORS.skyBlue}`,
            borderRadius: RADIUS.sm,
          }}>
            <div style={{
              fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.14em',
              color: COLORS.skyBlue, textTransform: 'uppercase',
              fontFamily: FONTS.body, marginBottom: '8px', opacity: 0.9,
            }}>{tr ? 'Klasik + Akademik Analiz' : 'Classical + Academic Analysis'}</div>
            <p style={{
              fontSize: '0.82rem', color: COLORS.offWhite,
              fontFamily: FONTS.body, lineHeight: 1.7, margin: 0,
            }}>{tr ? kanit.scholarlyDetailTr : kanit.scholarlyDetailEn}</p>
          </div>

          {/* Sources */}
          <div style={{
            padding: '12px 16px',
            background: 'rgba(255,255,255,0.025)',
            border: `1px solid ${COLORS.glassBorderSoft}`,
            borderRadius: RADIUS.sm,
          }}>
            <div style={{
              fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.14em',
              color: COLORS.gold, textTransform: 'uppercase',
              fontFamily: FONTS.body, marginBottom: '6px', opacity: 0.85,
            }}>{tr ? 'Kaynaklar' : 'Sources'}</div>
            <p style={{
              fontSize: '0.78rem', color: COLORS.silver,
              fontFamily: FONTS.body, lineHeight: 1.65, margin: 0,
              fontStyle: 'italic',
            }}>{tr ? kanit.sourcesTr : kanit.sourcesEn}</p>
          </div>

          {/* Critical note */}
          <div style={{
            padding: '12px 16px',
            background: 'rgba(212,165,116,0.05)',
            border: `1px solid ${COLORS.gold}25`,
            borderLeft: `2px solid ${COLORS.gold}88`,
            borderRadius: RADIUS.sm,
            display: 'flex', gap: '10px', alignItems: 'flex-start',
          }}>
            <span style={{ color: COLORS.gold, fontSize: '0.95rem', flexShrink: 0 }}>✱</span>
            <div>
              <div style={{
                fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.14em',
                color: COLORS.gold, textTransform: 'uppercase',
                fontFamily: FONTS.body, marginBottom: '4px', opacity: 0.85,
              }}>{tr ? 'Nüans / Uyarı' : 'Nuance / Caveat'}</div>
              <p style={{
                fontSize: '0.78rem', color: COLORS.offWhite,
                fontFamily: FONTS.body, lineHeight: 1.65, margin: 0,
                fontStyle: 'italic',
              }}>{tr ? kanit.criticalNoteTr : kanit.criticalNoteEn}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TIMELINE TAB — Discovery Timeline SVG
// ═══════════════════════════════════════════════════════════════════════════
function TimelineTab({ timeline, language, isMobile }) {
  const tr = language === 'tr';
  const sorted = [...timeline].sort((a, b) => a.year - b.year);
  const minYear = Math.min(...sorted.map(t => t.year));
  const maxYear = Math.max(...sorted.map(t => t.year));
  const [hoveredIdx, setHoveredIdx] = useState(null);

  return (
    <div>
      <p style={{
        color: COLORS.silver, fontSize: isMobile ? '0.88rem' : '0.92rem',
        fontFamily: FONTS.body, lineHeight: 1.75, margin: '0 0 24px',
      }}>
        {tr
          ? '523 CE Necran katliamından 2015 Birmingham radyokarbon analizine kadar — Kur\'ân metninin tarih içindeki ilerleyişi. Gold noktalar: Kur\'ânî kaynaklar. Mor: tarihsel olaylar. Yeşil-Mavi: modern akademik keşifler.'
          : 'From the 523 CE Najrān massacre to the 2015 Birmingham radiocarbon analysis — the Qur\'an text\'s trajectory through history. Gold points: Qur\'anic sources. Purple: historical events. Green-Blue: modern academic discoveries.'}
      </p>
      <div style={{
        padding: isMobile ? '22px 14px' : '32px 28px',
        background: 'linear-gradient(180deg, rgba(212,165,116,0.04) 0%, rgba(212,165,116,0.01) 100%)',
        border: `1px solid ${COLORS.gold}25`,
        borderRadius: RADIUS.md,
      }}>
        {/* Timeline dots vertical (mobile) or horizontal (desktop) */}
        <div style={{
          display: 'flex', flexDirection: 'column', gap: '10px',
          maxHeight: '520px', overflowY: 'auto', paddingRight: '4px',
        }}>
          {sorted.map((t, i) => {
            const pct = ((t.year - minYear) / (maxYear - minYear)) * 100;
            const isHover = hoveredIdx === i;
            return (
              <div key={i}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '64px 1fr' : '80px 1fr',
                  gap: '12px', alignItems: 'center',
                  padding: '8px 10px', cursor: 'default',
                  background: isHover ? `${t.color}10` : 'transparent',
                  borderRadius: RADIUS.sm,
                  transition: 'background 0.15s',
                }}>
                <div style={{
                  fontSize: '0.78rem', fontWeight: 800,
                  color: t.color, fontFamily: FONTS.body,
                  textAlign: 'right',
                }}>{t.year}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{
                    display: 'inline-block',
                    width: isHover ? '14px' : '10px',
                    height: isHover ? '14px' : '10px',
                    borderRadius: '50%',
                    background: t.color,
                    boxShadow: isHover ? `0 0 14px ${t.color}88` : `0 0 6px ${t.color}44`,
                    transition: 'all 0.18s',
                    flexShrink: 0,
                  }} />
                  <span style={{
                    fontSize: isMobile ? '0.82rem' : '0.9rem',
                    color: COLORS.offWhite, fontFamily: FONTS.body,
                    lineHeight: 1.5,
                  }}>{tr ? t.eventTr : t.eventEn}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Legend */}
      <div style={{ marginTop: '20px', display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {[
          { color: COLORS.gold, tr: 'Kur\'ânî Kaynak', en: 'Qur\'anic Source' },
          { color: '#8b5cf6', tr: 'Tarihsel Olay', en: 'Historical Event' },
          { color: '#e74c3c', tr: 'Sabai Olayı', en: 'Sabaic Event' },
          { color: '#3498db', tr: 'Modern Keşif', en: 'Modern Discovery' },
          { color: '#1D9E75', tr: 'Elyazması', en: 'Manuscript' },
        ].map((l, i) => (
          <span key={i} style={{
            fontSize: '0.72rem', color: COLORS.silver, fontFamily: FONTS.body,
            display: 'inline-flex', alignItems: 'center', gap: '5px',
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: l.color, display: 'inline-block' }} />
            {tr ? l.tr : l.en}
          </span>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SCHOLARS TAB
// ═══════════════════════════════════════════════════════════════════════════
function ScholarsTab({ scholars, language, isMobile }) {
  const tr = language === 'tr';
  return (
    <div>
      <p style={{
        color: COLORS.silver, fontSize: isMobile ? '0.88rem' : '0.92rem',
        fontFamily: FONTS.body, lineHeight: 1.75, margin: '0 0 24px',
      }}>
        {tr
          ? 'Klasik tefsir (İbn Kesîr, Elmalılı) ve modern akademik Islamic Studies (Christian Robin, Nicolai Sinai, François Déroche) alanının önde gelen 6 referansı — Tarihsel Kanıtlar araştırmasının epistemik omurgası.'
          : 'Six leading references from classical tafsir (Ibn Kathīr, Elmalılı) and modern academic Islamic Studies (Christian Robin, Nicolai Sinai, François Déroche) — the epistemic backbone of Historical Proof research.'}
      </p>
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
        gap: '16px',
      }}>
        {scholars.map(s => (
          <div key={s.id} style={{
            padding: '20px 22px',
            background: 'linear-gradient(135deg, rgba(212,165,116,0.05) 0%, rgba(255,255,255,0.02) 60%)',
            border: `1px solid ${COLORS.gold}30`,
            borderLeft: `3px solid ${COLORS.gold}`,
            borderRadius: RADIUS.md,
            display: 'flex', flexDirection: 'column', gap: '10px',
          }}>
            <div>
              <h3 style={{
                margin: '0 0 4px', fontFamily: FONTS.display,
                fontSize: '1.15rem', fontWeight: 700, color: COLORS.gold,
                lineHeight: 1.25,
              }}>{tr ? s.scholar : s.scholarEn}</h3>
              <p style={{
                margin: 0, fontSize: '0.78rem', color: COLORS.silver,
                fontFamily: FONTS.body, fontStyle: 'italic',
              }}>{tr ? s.work : s.workEn}</p>
              <p style={{
                margin: '4px 0 0', fontSize: '0.7rem',
                color: COLORS.silver, opacity: 0.7,
                fontFamily: FONTS.body, letterSpacing: '0.06em',
              }}>{s.century}</p>
            </div>
            <p style={{
              margin: 0, fontSize: '0.84rem', color: COLORS.offWhite,
              fontFamily: FONTS.body, lineHeight: 1.7,
            }}>{tr ? s.insightTr : s.insightEn}</p>
            {s.criticalTr && (
              <div style={{
                padding: '10px 12px',
                background: `${COLORS.gold}10`,
                border: `1px solid ${COLORS.gold}30`,
                borderLeft: `2px solid ${COLORS.gold}88`,
                borderRadius: RADIUS.sm,
                fontSize: '0.76rem', color: COLORS.silver,
                fontFamily: FONTS.body, fontStyle: 'italic',
                lineHeight: 1.65,
              }}>
                <strong style={{ color: COLORS.gold, fontStyle: 'normal', fontWeight: 700 }}>{tr ? 'Nüans: ' : 'Nuance: '}</strong>
                {tr ? s.criticalTr : s.criticalEn}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// METHODOLOGY TAB
// ═══════════════════════════════════════════════════════════════════════════
function MethodologyTab({ intro, language, isMobile }) {
  const tr = language === 'tr';
  return (
    <div style={{ maxWidth: '820px' }}>
      <div style={{
        padding: '20px 24px',
        background: 'linear-gradient(135deg, rgba(212,165,116,0.06) 0%, rgba(255,255,255,0.02) 60%)',
        border: `1px solid ${COLORS.gold}30`,
        borderLeft: `3px solid ${COLORS.gold}`,
        borderRadius: RADIUS.md,
        marginBottom: '20px',
      }}>
        <div style={{
          fontSize: '0.62rem', letterSpacing: '0.16em',
          color: COLORS.gold, textTransform: 'uppercase',
          fontFamily: FONTS.body, fontWeight: 700, opacity: 0.85, marginBottom: '10px',
        }}>{tr ? 'Metodoloji Notu' : 'Methodological Note'}</div>
        <p style={{
          margin: 0, fontSize: '0.9rem', color: COLORS.offWhite,
          fontFamily: FONTS.body, lineHeight: 1.75,
        }}>{tr ? intro.methodologyNoteTr : intro.methodologyNoteEn}</p>
      </div>

      <div style={{
        padding: '18px 22px',
        background: 'rgba(52,152,219,0.06)',
        border: `1px solid rgba(52,152,219,0.22)`,
        borderLeft: `2px solid ${COLORS.skyBlue}`,
        borderRadius: RADIUS.sm,
      }}>
        <div style={{
          fontSize: '0.62rem', letterSpacing: '0.14em',
          color: COLORS.skyBlue, textTransform: 'uppercase',
          fontFamily: FONTS.body, fontWeight: 700, marginBottom: '10px', opacity: 0.9,
        }}>{tr ? 'İddia Gücü Skalası' : 'Claim-Strength Scale'}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {Object.entries(CONFIDENCE_META).map(([k, m]) => (
            <div key={k} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{
                display: 'inline-block',
                padding: '2px 10px', borderRadius: RADIUS.pill,
                background: `${m.color}22`, border: `1px solid ${m.color}55`,
                color: m.color, fontSize: '0.68rem',
                fontFamily: FONTS.body, fontWeight: 700,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                minWidth: '100px', textAlign: 'center',
              }}>{tr ? m.tr : m.en}</span>
              <span style={{ fontSize: '0.8rem', color: COLORS.silver, fontFamily: FONTS.body }}>
                {tr
                  ? (k === 'kesin' ? 'Batı akademik uzlaşısı ile doğrulanmış (örn. Kur\'ân metin korunması).'
                    : k === 'guclu' ? 'Bağımsız arkeoloji/epigrafi kanıtıyla desteklenmiş (Uhdûd, Rûm kehâneti, Firavun).'
                    : k === 'muhtemel' ? 'Akademik olarak plausible ancak kesinlik kazanmamış (Hâmân, İrem).'
                    : 'Klasik-modern tefsir arasında farklı hipotezler var (Karnayn).')
                  : (k === 'kesin' ? 'Confirmed by Western academic consensus (e.g., Qur\'anic textual preservation).'
                    : k === 'guclu' ? 'Supported by independent archaeological/epigraphic evidence (Ukhdūd, Rūm prophecy, Pharaoh).'
                    : k === 'muhtemel' ? 'Academically plausible but not conclusively confirmed (Hāmān, Iram).'
                    : 'Different hypotheses among classical-modern exegesis (Dhū al-Qarnayn).')
                }
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
