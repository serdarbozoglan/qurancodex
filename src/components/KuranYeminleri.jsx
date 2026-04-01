import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS, OVERLAY_BASE, OVERLAY_HEADER, OVERLAY_TITLE, CLOSE_BTN } from '../tokens';

const TABS_TR = ['Kategoriler', 'Derinlik Analizi', 'Sure Dağılımı', 'İbn Kayyim', 'Kaynaklar'];
const TABS_EN = ['Categories', 'Depth Analysis', 'Surah Distribution', 'Ibn Qayyim', 'Sources'];

export default function KuranYeminleri({ onClose }) {
  const { language } = useLanguage();
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [expandedAccordion, setExpandedAccordion] = useState(null);
  const bodyRef = useRef(null);

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  useEffect(() => {
    fetch('/yeminler.json')
      .then(r => r.json())
      .then(d => { setData(d); setActiveCategoryId(d.categories[0]?.id ?? null); })
      .catch(() => {});
  }, []);

  // scroll body to top on tab change
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
  }, [activeTab]);

  if (!data) {
    return (
      <div style={{ ...OVERLAY_BASE, display: 'flex', flexDirection: 'column' }}>
        <div style={OVERLAY_HEADER}>
          <span style={OVERLAY_TITLE}>{language === 'tr' ? "Kur'an'ın Yeminleri" : "Oaths of the Quran"}</span>
          <CloseBtn onClose={onClose} />
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: COLORS.silver, fontSize: '0.9rem', fontFamily: FONTS.body }}>
            {language === 'tr' ? 'Yükleniyor...' : 'Loading...'}
          </span>
        </div>
      </div>
    );
  }

  const { meta, categories, depthAnalysis, ibnQayyim, sources } = data;
  const TABS = language === 'tr' ? TABS_TR : TABS_EN;

  const activeCategory = categories.find(c => c.id === activeCategoryId) ?? categories[0];

  return (
    <div style={{ ...OVERLAY_BASE, display: 'flex', flexDirection: 'column' }}>

      {/* ── HEADER ─────────────────────────────────────────────────────── */}
      <div style={OVERLAY_HEADER}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          <span style={OVERLAY_TITLE}>
            {language === 'tr' ? "Kur'an'ın Yeminleri" : "Oaths of the Quran"}
          </span>
          <span style={{ color: COLORS.slate500, fontSize: '0.8rem', flexShrink: 0 }}>·</span>
          <span style={{ color: COLORS.slate500, fontSize: '0.78rem', fontFamily: FONTS.body }}>
            {language === 'tr' ? 'Aksâmü\'l-Kur\'an' : 'Aqsam al-Quran'}
          </span>
        </div>
        <CloseBtn onClose={onClose} />
      </div>

      {/* ── SCROLLABLE BODY ─────────────────────────────────────────────── */}
      <div ref={bodyRef} style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>

        {/* ── HERO ──────────────────────────────────────────────────────── */}
        <div style={{
          padding: isMobile ? '28px 20px 24px' : '40px 40px 32px',
          background: 'linear-gradient(180deg, rgba(212,162,36,0.06) 0%, transparent 100%)',
          borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
        }}>
          {/* Arabic subtitle */}
          <div style={{
            fontFamily: FONTS.quran,
            fontSize: isMobile ? '1.6rem' : '2rem',
            color: COLORS.gold,
            direction: 'rtl',
            textAlign: 'right',
            lineHeight: 1.8,
            marginBottom: '16px',
          }} dir="rtl" lang="ar">
            وَالشَّمْسِ وَضُحَاهَا ۝ وَالْقَمَرِ إِذَا تَلَاهَا
          </div>

          {/* Title */}
          <h1 style={{
            color: COLORS.offWhite,
            fontSize: isMobile ? '1.4rem' : '1.9rem',
            fontWeight: 700,
            fontFamily: FONTS.body,
            margin: '0 0 8px 0',
            lineHeight: 1.3,
          }}>
            {language === 'tr' ? "Kur'an'ın Yeminleri" : "The Oaths of the Quran"}
          </h1>
          <p style={{
            color: COLORS.silver,
            fontSize: '0.88rem',
            fontFamily: FONTS.body,
            margin: '0 0 28px 0',
            lineHeight: 1.7,
            maxWidth: '620px',
          }}>
            {language === 'tr'
              ? `Allah Kur'an'da ${meta.totalOaths} farklı şeye yemin eder: güneş, ay, zaman, şehirler, ruh, hatta Kur'an'ın kendisi. Bu yeminler tesadüfi değil — her biri, ardından gelen mesajın en güçlü delilidir.`
              : `God swears by ${meta.totalOaths} different things in the Quran: the sun, moon, time, cities, the soul, and even the Quran itself. These oaths are not random — each is the strongest evidence for the message that follows.`
            }
          </p>

          {/* Stat cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
            gap: '12px',
          }}>
            {[
              { value: meta.totalOaths, labelTr: 'Yemin İfadesi', labelEn: 'Oath Expressions', color: COLORS.gold },
              { value: meta.categoriesCount, labelTr: 'Kategori', labelEn: 'Categories', color: '#3498db' },
              { value: meta.surahsWithOaths, labelTr: 'Yemin İçeren Sure', labelEn: 'Surahs with Oaths', color: '#2ecc71' },
              { value: meta.maxOathsInSurah, labelTr: `${meta.maxOathsSurahName} Suresi`, labelEn: `Surah ${meta.maxOathsSurahName}`, color: '#e74c3c' },
            ].map((s, i) => (
              <div key={i} style={{
                background: `${s.color}10`,
                border: `1px solid ${s.color}25`,
                borderRadius: '10px',
                padding: '14px 16px',
                textAlign: 'center',
              }}>
                <div style={{ color: s.color, fontSize: '1.8rem', fontWeight: 700, fontFamily: FONTS.body, lineHeight: 1 }}>
                  {s.value}
                </div>
                <div style={{ color: COLORS.slate500, fontSize: '0.72rem', fontFamily: FONTS.body, marginTop: '5px' }}>
                  {language === 'tr' ? s.labelTr : s.labelEn}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RADIAL VIZ ────────────────────────────────────────────────── */}
        {!isMobile ? (
          <RadialViz
            categories={categories}
            activeCategoryId={activeCategoryId}
            onSelect={(id) => { setActiveCategoryId(id); setActiveTab(0); }}
            language={language}
          />
        ) : (
          <MobileAccordion
            categories={categories}
            expanded={expandedAccordion}
            onToggle={(id) => setExpandedAccordion(expandedAccordion === id ? null : id)}
            language={language}
          />
        )}

        {/* ── TAB BAR ───────────────────────────────────────────────────── */}
        <div style={{
          display: 'flex',
          gap: '4px',
          padding: '12px 16px 0',
          borderTop: `1px solid ${COLORS.glassBorderSoft}`,
          background: 'rgba(0,0,0,0.2)',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          flexShrink: 0,
        }}>
          {TABS.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              style={{
                flexShrink: 0,
                padding: '8px 16px',
                borderRadius: '8px 8px 0 0',
                border: 'none',
                background: activeTab === i ? 'rgba(212,165,116,0.12)' : 'transparent',
                borderBottom: activeTab === i ? `2px solid ${COLORS.gold}` : '2px solid transparent',
                color: activeTab === i ? COLORS.gold : COLORS.silver,
                fontSize: '0.82rem',
                fontWeight: activeTab === i ? 600 : 400,
                fontFamily: FONTS.body,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── TAB CONTENT ───────────────────────────────────────────────── */}
        <div style={{ padding: isMobile ? '20px 16px 40px' : '28px 32px 60px' }}>

          {/* Tab 0: Kategoriler */}
          {activeTab === 0 && (
            <TabKategoriler
              categories={categories}
              activeCategoryId={activeCategoryId}
              onSelect={setActiveCategoryId}
              language={language}
              isMobile={isMobile}
            />
          )}

          {/* Tab 1: Derinlik Analizi */}
          {activeTab === 1 && (
            <TabDerinlik depthAnalysis={depthAnalysis} language={language} isMobile={isMobile} />
          )}

          {/* Tab 2: Sure Dağılımı */}
          {activeTab === 2 && (
            <TabSureDagilimi categories={categories} language={language} isMobile={isMobile} />
          )}

          {/* Tab 3: İbn Kayyim */}
          {activeTab === 3 && (
            <TabIbnKayyim ibnQayyim={ibnQayyim} language={language} isMobile={isMobile} />
          )}

          {/* Tab 4: Kaynaklar */}
          {activeTab === 4 && (
            <TabKaynaklar sources={sources} language={language} isMobile={isMobile} />
          )}
        </div>

        {/* ── MOBILE BOTTOM LINKS ───────────────────────────────────────── */}
        {isMobile && (
          <div style={{
            padding: '12px 16px',
            borderTop: `1px solid ${COLORS.glassBorderSoft}`,
            display: 'flex',
            gap: '8px',
          }}>
            <a href="https://corpus.quran.com" target="_blank" rel="noopener noreferrer"
              style={{ flex: 1, textAlign: 'center', padding: '8px', background: COLORS.glassBg, border: `1px solid ${COLORS.glassBorder}`, borderRadius: '8px', color: COLORS.silver, fontSize: '0.75rem', fontFamily: FONTS.body, textDecoration: 'none' }}>
              Corpus Quran
            </a>
            <a href="https://tanzil.net" target="_blank" rel="noopener noreferrer"
              style={{ flex: 1, textAlign: 'center', padding: '8px', background: COLORS.glassBg, border: `1px solid ${COLORS.glassBorder}`, borderRadius: '8px', color: COLORS.silver, fontSize: '0.75rem', fontFamily: FONTS.body, textDecoration: 'none' }}>
              Tanzil.net
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Radial Visualization ───────────────────────────────────────────────────────

function RadialViz({ categories, activeCategoryId, onSelect, language }) {
  const cx = 220, cy = 220, r = 160, innerR = 70;
  const total = categories.reduce((s, c) => s + c.items.length, 0);
  let startAngle = -Math.PI / 2;

  const segments = categories.map((cat) => {
    const angle = (cat.items.length / total) * 2 * Math.PI;
    const endAngle = startAngle + angle;
    const seg = { cat, startAngle, endAngle, midAngle: startAngle + angle / 2 };
    startAngle = endAngle;
    return seg;
  });

  function arcPath(sa, ea, rOuter, rInner, cx, cy, gap = 0.025) {
    const sa2 = sa + gap, ea2 = ea - gap;
    const x1 = cx + rOuter * Math.cos(sa2), y1 = cy + rOuter * Math.sin(sa2);
    const x2 = cx + rOuter * Math.cos(ea2), y2 = cy + rOuter * Math.sin(ea2);
    const x3 = cx + rInner * Math.cos(ea2), y3 = cy + rInner * Math.sin(ea2);
    const x4 = cx + rInner * Math.cos(sa2), y4 = cy + rInner * Math.sin(sa2);
    const lg = ea2 - sa2 > Math.PI ? 1 : 0;
    return `M ${x1} ${y1} A ${rOuter} ${rOuter} 0 ${lg} 1 ${x2} ${y2} L ${x3} ${y3} A ${rInner} ${rInner} 0 ${lg} 0 ${x4} ${y4} Z`;
  }

  function labelPos(midAngle, rLabel) {
    return { x: cx + rLabel * Math.cos(midAngle), y: cy + rLabel * Math.sin(midAngle) };
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '32px',
      padding: '24px 32px',
      background: 'rgba(0,0,0,0.15)',
      borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
    }}>
      {/* SVG donut */}
      <div style={{ flexShrink: 0 }}>
        <svg width="440" height="440" viewBox="0 0 440 440">
          {segments.map(({ cat, startAngle: sa, endAngle: ea, midAngle }) => {
            const isActive = cat.id === activeCategoryId;
            const ro = isActive ? r + 12 : r;
            const path = arcPath(sa, ea, ro, innerR, cx, cy);
            const lp = labelPos(midAngle, (ro + innerR) / 2 + 4);
            return (
              <g key={cat.id} onClick={() => onSelect(cat.id)} style={{ cursor: 'pointer' }}>
                <path
                  d={path}
                  fill={isActive ? cat.accent : `${cat.accent}55`}
                  stroke={isActive ? cat.accent : 'transparent'}
                  strokeWidth={isActive ? 1.5 : 0}
                  style={{ transition: 'all 0.25s' }}
                />
                <text
                  x={lp.x} y={lp.y}
                  textAnchor="middle" dominantBaseline="middle"
                  fill={isActive ? '#0a0a1a' : COLORS.offWhite}
                  fontSize={isActive ? '11' : '10'}
                  fontWeight={isActive ? '700' : '500'}
                  fontFamily={FONTS.body}
                  style={{ pointerEvents: 'none', transition: 'all 0.25s' }}
                >
                  {cat.items.length}
                </text>
              </g>
            );
          })}
          {/* Center */}
          <circle cx={cx} cy={cy} r={innerR - 6} fill="rgba(10,10,26,0.9)" />
          <text x={cx} y={cy - 10} textAnchor="middle" fill={COLORS.gold} fontSize="28" fontWeight="700" fontFamily={FONTS.body}>
            {categories.reduce((s, c) => s + c.items.length, 0)}
          </text>
          <text x={cx} y={cy + 14} textAnchor="middle" fill={COLORS.slate500} fontSize="10" fontFamily={FONTS.body}>
            {language === 'tr' ? 'yemin' : 'oaths'}
          </text>
        </svg>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '200px' }}>
        <div style={{ color: COLORS.slate500, fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: FONTS.body, marginBottom: '4px' }}>
          {language === 'tr' ? 'Kategoriler' : 'Categories'}
        </div>
        {categories.map(cat => {
          const isActive = cat.id === activeCategoryId;
          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '8px 12px', borderRadius: '8px', border: 'none',
                background: isActive ? `${cat.accent}18` : 'transparent',
                cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left',
                borderLeft: `3px solid ${isActive ? cat.accent : 'transparent'}`,
              }}
            >
              <span style={{
                width: '8px', height: '8px', borderRadius: '50%',
                background: cat.accent, flexShrink: 0,
              }} />
              <span style={{
                color: isActive ? cat.accent : COLORS.offWhite,
                fontSize: '0.83rem', fontFamily: FONTS.body,
                fontWeight: isActive ? 600 : 400,
                flex: 1,
              }}>
                {language === 'tr' ? cat.tr : cat.en}
              </span>
              <span style={{ color: isActive ? cat.accent : COLORS.slate500, fontSize: '0.75rem', fontFamily: FONTS.body, fontWeight: 600 }}>
                {cat.items.length}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Mobile Accordion ──────────────────────────────────────────────────────────

function MobileAccordion({ categories, expanded, onToggle, language }) {
  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', borderBottom: `1px solid ${COLORS.glassBorderSoft}` }}>
      <div style={{ color: COLORS.slate500, fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: FONTS.body, marginBottom: '4px' }}>
        {language === 'tr' ? 'Kategorilere göz at' : 'Browse categories'}
      </div>
      {categories.map(cat => {
        const isOpen = expanded === cat.id;
        return (
          <div key={cat.id} style={{
            background: isOpen ? `${cat.accent}10` : COLORS.glassBg,
            border: `1px solid ${isOpen ? cat.accent + '40' : COLORS.glassBorder}`,
            borderRadius: '10px', overflow: 'hidden',
          }}>
            <button
              onClick={() => onToggle(cat.id)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                padding: '12px 14px', border: 'none', background: 'transparent', cursor: 'pointer',
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: cat.accent, flexShrink: 0 }} />
              <span style={{ flex: 1, color: isOpen ? cat.accent : COLORS.offWhite, fontSize: '0.85rem', fontFamily: FONTS.body, fontWeight: isOpen ? 600 : 400, textAlign: 'left' }}>
                {language === 'tr' ? cat.tr : cat.en}
              </span>
              <span style={{ color: COLORS.slate500, fontSize: '0.75rem', fontFamily: FONTS.body }}>{cat.items.length}</span>
              <span style={{ color: COLORS.silver, fontSize: '0.8rem', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▾</span>
            </button>
            {isOpen && (
              <div style={{ padding: '0 14px 14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <p style={{ color: COLORS.silver, fontSize: '0.8rem', fontFamily: FONTS.body, margin: '0 0 8px' }}>
                  {language === 'tr' ? cat.descTr : cat.descEn}
                </p>
                {cat.items.map(item => (
                  <OathCard key={item.id} item={item} accent={cat.accent} language={language} compact />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Tab: Kategoriler ──────────────────────────────────────────────────────────

function TabKategoriler({ categories, activeCategoryId, onSelect, language, isMobile }) {
  const active = categories.find(c => c.id === activeCategoryId) ?? categories[0];

  return (
    <div>
      {/* Category chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '24px' }}>
        {categories.map(cat => {
          const isActive = cat.id === activeCategoryId;
          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              style={{
                padding: '5px 14px', borderRadius: '20px',
                border: `1px solid ${isActive ? cat.accent : COLORS.glassBorder}`,
                background: isActive ? `${cat.accent}22` : 'transparent',
                color: isActive ? cat.accent : COLORS.silver,
                fontSize: '0.8rem', fontWeight: isActive ? 600 : 400,
                fontFamily: FONTS.body, cursor: 'pointer', transition: 'all 0.15s',
              }}
            >
              {language === 'tr' ? cat.tr : cat.en} <span style={{ opacity: 0.7 }}>({cat.items.length})</span>
            </button>
          );
        })}
      </div>

      {/* Category description */}
      {active && (
        <>
          <p style={{ color: COLORS.silver, fontSize: '0.85rem', fontFamily: FONTS.body, marginBottom: '20px', lineHeight: 1.7 }}>
            {language === 'tr' ? active.descTr : active.descEn}
          </p>
          {/* Oath cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(380px, 1fr))',
            gap: '14px',
          }}>
            {active.items.map(item => (
              <OathCard key={item.id} item={item} accent={active.accent} language={language} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── Oath Card ─────────────────────────────────────────────────────────────────

function OathCard({ item, accent, language, compact = false }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      background: COLORS.glassBg,
      border: `1px solid ${COLORS.glassBorder}`,
      borderLeft: `3px solid ${accent}`,
      borderRadius: '10px',
      overflow: 'hidden',
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width: '100%', padding: compact ? '10px 14px' : '14px 18px', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left' }}
      >
        {/* Arabic */}
        <div style={{
          fontFamily: FONTS.quran, fontSize: compact ? '1.1rem' : '1.4rem',
          color: accent, direction: 'rtl', textAlign: 'right',
          lineHeight: 1.9, marginBottom: '6px',
        }} dir="rtl" lang="ar">
          {item.arabic}
        </div>
        {/* Translation + ref */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
          <span style={{ color: COLORS.offWhite, fontSize: '0.82rem', fontFamily: FONTS.body, fontStyle: 'italic', lineHeight: 1.5, flex: 1 }}>
            {language === 'tr' ? item.tr : item.en}
          </span>
          <span style={{ color: COLORS.slate500, fontSize: '0.72rem', fontFamily: FONTS.body, flexShrink: 0, paddingTop: '2px' }}>
            {item.ref}
          </span>
        </div>
        {!compact && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
            <span style={{ padding: '2px 8px', background: `${accent}18`, border: `1px solid ${accent}30`, borderRadius: '12px', color: accent, fontSize: '0.72rem', fontFamily: FONTS.body }}>
              {language === 'tr' ? item.subjectTr : item.subjectEn}
            </span>
            <span style={{ color: COLORS.slate500, fontSize: '0.72rem', fontFamily: FONTS.body, flex: 1 }}>
              {language === 'tr' ? item.purposeTr : item.purposeEn}
            </span>
            <span style={{ color: COLORS.slate500, fontSize: '0.75rem', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▾</span>
          </div>
        )}
      </button>

      {!compact && open && (
        <div style={{ padding: '0 18px 16px', borderTop: `1px solid ${COLORS.glassBorderSoft}` }}>
          <p style={{ color: COLORS.silver, fontSize: '0.82rem', fontFamily: FONTS.body, lineHeight: 1.7, margin: '12px 0 0' }}>
            {language === 'tr' ? item.depthTr : item.depthEn}
          </p>
        </div>
      )}
    </div>
  );
}

// ── Tab: Derinlik Analizi ─────────────────────────────────────────────────────

function TabDerinlik({ depthAnalysis, language, isMobile }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <p style={{ color: COLORS.silver, fontSize: '0.88rem', fontFamily: FONTS.body, lineHeight: 1.7, margin: 0 }}>
        {language === 'tr'
          ? "Kur'an'daki yemin yapıları üç farklı retorik form sergiler. Her form, mesajın pekiştirilmesinde farklı bir güç taşır."
          : "Oath structures in the Quran exhibit three distinct rhetorical forms. Each form carries a different power in reinforcing the message."
        }
      </p>
      {depthAnalysis.map((item, i) => (
        <div key={i} style={{
          background: COLORS.glassBg,
          border: `1px solid ${COLORS.glassBorder}`,
          borderRadius: '12px',
          padding: isMobile ? '18px 16px' : '24px 28px',
        }}>
          <h3 style={{ color: COLORS.gold, fontSize: '1rem', fontWeight: 700, fontFamily: FONTS.body, margin: '0 0 14px' }}>
            {language === 'tr' ? item.titleTr : item.titleEn}
          </h3>
          {/* Verse */}
          <div style={{
            background: 'rgba(212,165,116,0.06)', border: `1px solid ${COLORS.goldAlpha15}`,
            borderRadius: '8px', padding: '12px 16px', marginBottom: '14px',
          }}>
            <div style={{ fontFamily: FONTS.quran, fontSize: '1.4rem', color: COLORS.gold, direction: 'rtl', textAlign: 'right', lineHeight: 1.9, marginBottom: '6px' }} dir="rtl" lang="ar">
              {item.arabic}
            </div>
            <p style={{ color: COLORS.offWhite, fontSize: '0.82rem', fontFamily: FONTS.body, fontStyle: 'italic', margin: 0, lineHeight: 1.6 }}>
              {language === 'tr' ? item.mealTr : item.mealEn}
            </p>
          </div>
          <p style={{ color: COLORS.silver, fontSize: '0.85rem', fontFamily: FONTS.body, lineHeight: 1.75, margin: 0 }}>
            {language === 'tr' ? item.bodyTr : item.bodyEn}
          </p>
        </div>
      ))}
    </div>
  );
}

// ── Tab: Sure Dağılımı ────────────────────────────────────────────────────────

function TabSureDagilimi({ categories, language, isMobile }) {
  // Build surah distribution from all items
  const surahMap = {};
  categories.forEach(cat => {
    cat.items.forEach(item => {
      const key = item.ref.split(' ')[0]; // e.g. "Şems"
      if (!surahMap[key]) surahMap[key] = { count: 0, accent: cat.accent };
      surahMap[key].count++;
    });
  });

  const sorted = Object.entries(surahMap).sort((a, b) => b[1].count - a[1].count);
  const maxCount = sorted[0]?.[1].count ?? 1;
  const total = sorted.reduce((s, [, v]) => s + v.count, 0);

  return (
    <div>
      <p style={{ color: COLORS.silver, fontSize: '0.88rem', fontFamily: FONTS.body, lineHeight: 1.7, margin: '0 0 24px' }}>
        {language === 'tr'
          ? `${sorted.length} farklı surede toplam ${total} yemin ifadesi bulunuyor. ${sorted[0]?.[0]} en fazla yemin içeren suredir.`
          : `${total} oath expressions are found across ${sorted.length} different surahs. ${sorted[0]?.[0]} contains the most oaths.`
        }
      </p>

      {/* Stat callouts */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: '12px', marginBottom: '28px' }}>
        {[
          { value: sorted.length, labelTr: 'Sure', labelEn: 'Surahs', color: COLORS.gold },
          { value: total, labelTr: 'Toplam Yemin', labelEn: 'Total Oaths', color: '#3498db' },
          { value: sorted[0]?.[0], labelTr: 'En Çok Yemin', labelEn: 'Most Oaths', color: '#2ecc71', small: true },
          { value: sorted[0]?.[1].count, labelTr: `${sorted[0]?.[0]} Yemini`, labelEn: `${sorted[0]?.[0]} Oaths`, color: '#e74c3c' },
        ].map((s, i) => (
          <div key={i} style={{
            background: `${s.color}10`, border: `1px solid ${s.color}25`,
            borderRadius: '10px', padding: '14px', textAlign: 'center',
          }}>
            <div style={{ color: s.color, fontSize: s.small ? '1rem' : '1.6rem', fontWeight: 700, fontFamily: FONTS.body, lineHeight: 1 }}>
              {s.value}
            </div>
            <div style={{ color: COLORS.slate500, fontSize: '0.7rem', fontFamily: FONTS.body, marginTop: '5px' }}>
              {language === 'tr' ? s.labelTr : s.labelEn}
            </div>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {sorted.map(([surah, { count, accent }]) => (
          <div key={surah} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ width: isMobile ? '70px' : '100px', color: COLORS.offWhite, fontSize: '0.8rem', fontFamily: FONTS.body, flexShrink: 0, textAlign: 'right' }}>
              {surah}
            </span>
            <div style={{ flex: 1, height: '20px', background: COLORS.glassBg, borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{
                width: `${(count / maxCount) * 100}%`,
                height: '100%',
                background: `linear-gradient(90deg, ${accent}cc, ${accent}77)`,
                borderRadius: '4px',
                transition: 'width 0.5s ease',
                display: 'flex', alignItems: 'center', paddingLeft: '8px',
              }}>
                <span style={{ color: '#0a0a1a', fontSize: '0.72rem', fontWeight: 700, fontFamily: FONTS.body }}>
                  {count > 1 ? count : ''}
                </span>
              </div>
            </div>
            <span style={{ width: '24px', color: COLORS.slate500, fontSize: '0.75rem', fontFamily: FONTS.body, textAlign: 'right' }}>
              {count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Tab: İbn Kayyim ───────────────────────────────────────────────────────────

function TabIbnKayyim({ ibnQayyim, language, isMobile }) {
  return (
    <div>
      {/* Thesis intro */}
      <div style={{
        background: 'rgba(212,165,116,0.06)',
        border: `1px solid ${COLORS.goldAlpha25}`,
        borderLeft: `4px solid ${COLORS.gold}`,
        borderRadius: '10px',
        padding: isMobile ? '18px 16px' : '24px 28px',
        marginBottom: '24px',
      }}>
        <div style={{ color: COLORS.slate500, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: FONTS.body, marginBottom: '12px' }}>
          {language === 'tr' ? 'İbn Kayyim el-Cevziyye — Temel Tez' : 'Ibn Qayyim al-Jawziyya — Core Thesis'}
        </div>
        <p style={{ color: COLORS.offWhite, fontSize: isMobile ? '0.95rem' : '1.05rem', fontFamily: FONTS.body, lineHeight: 1.75, margin: '0 0 16px', fontStyle: 'italic' }}>
          {language === 'tr' ? ibnQayyim.thesisTr : ibnQayyim.thesisEn}
        </p>
        {/* Book name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: COLORS.slate500, fontSize: '0.75rem', fontFamily: FONTS.body }}>
            {language === 'tr' ? 'Kaynak:' : 'Source:'}
          </span>
          <span style={{ color: COLORS.gold, fontSize: '0.8rem', fontFamily: FONTS.body, fontWeight: 600 }}>
            {language === 'tr' ? ibnQayyim.bookTr : ibnQayyim.bookEn}
          </span>
        </div>
      </div>

      {/* Pull quote */}
      <div style={{
        textAlign: 'center',
        padding: isMobile ? '20px 12px' : '28px 48px',
        marginBottom: '24px',
      }}>
        <p style={{
          color: COLORS.offWhite,
          fontSize: isMobile ? '1rem' : '1.2rem',
          fontFamily: FONTS.display,
          fontStyle: 'italic',
          lineHeight: 1.8,
          margin: 0,
        }}>
          {language === 'tr' ? ibnQayyim.pullQuoteTr : ibnQayyim.pullQuoteEn}
        </p>
      </div>

      {/* Explanation cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {ibnQayyim.cards.map((card, i) => (
          <div key={i} style={{
            background: COLORS.glassBg,
            border: `1px solid ${COLORS.glassBorder}`,
            borderRadius: '10px',
            padding: isMobile ? '16px' : '20px 24px',
          }}>
            <h4 style={{ color: COLORS.gold, fontSize: '0.9rem', fontWeight: 700, fontFamily: FONTS.body, margin: '0 0 10px' }}>
              {language === 'tr' ? card.titleTr : card.titleEn}
            </h4>
            <p style={{ color: COLORS.silver, fontSize: '0.85rem', fontFamily: FONTS.body, lineHeight: 1.7, margin: 0 }}>
              {language === 'tr' ? card.bodyTr : card.bodyEn}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Tab: Kaynaklar ────────────────────────────────────────────────────────────

function TabKaynaklar({ sources, language, isMobile }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {sources.map((section, i) => (
        <div key={i} style={{
          background: COLORS.glassBg,
          border: `1px solid ${COLORS.glassBorder}`,
          borderRadius: '10px',
          padding: isMobile ? '16px' : '20px 24px',
        }}>
          <h4 style={{ color: COLORS.gold, fontSize: '0.85rem', fontWeight: 700, fontFamily: FONTS.body, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px' }}>
            {language === 'tr' ? section.categoryTr : section.categoryEn}
          </h4>
          <ul style={{ margin: 0, padding: '0 0 0 16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {section.items.map((item, j) => (
              <li key={j} style={{ color: COLORS.silver, fontSize: '0.83rem', fontFamily: FONTS.body, lineHeight: 1.6 }}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}

      {/* Methodology note */}
      <div style={{
        background: 'rgba(148,163,184,0.06)',
        border: `1px solid rgba(148,163,184,0.14)`,
        borderRadius: '8px',
        padding: '14px 16px',
        display: 'flex',
        gap: '10px',
      }}>
        <span style={{ color: COLORS.slate500, fontSize: '0.85rem', flexShrink: 0 }}>ℹ</span>
        <p style={{ color: COLORS.slate500, fontSize: '0.78rem', fontFamily: FONTS.body, lineHeight: 1.65, margin: 0 }}>
          {language === 'tr'
            ? 'Bu sayfadaki yemin listesi temel kaynaklara dayanan küratörlü bir seçkidir. Tam bir akademik corpus çalışması için İbn Kayyim\'in et-Tibyân ve Suyûtî\'nin el-İtkân (bâb 60) eserlerine başvurulmalıdır.'
            : 'The oath list on this page is a curated selection based on primary sources. For a complete academic corpus study, refer to Ibn Qayyim\'s al-Tibyan and Suyuti\'s al-Itqan (chapter 60).'
          }
        </p>
      </div>
    </div>
  );
}

// ── Close Button ──────────────────────────────────────────────────────────────

function CloseBtn({ onClose }) {
  return (
    <button
      onClick={onClose}
      style={{ ...CLOSE_BTN }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = COLORS.offWhite; }}
      onMouseLeave={e => { e.currentTarget.style.background = CLOSE_BTN.background; e.currentTarget.style.color = COLORS.silver; }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M18 6L6 18M6 6l12 12" />
      </svg>
    </button>
  );
}
