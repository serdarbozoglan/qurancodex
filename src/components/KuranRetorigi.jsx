import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import {
  COLORS, FONTS,
  OVERLAY_BASE, OVERLAY_HEADER, OVERLAY_TITLE, CLOSE_BTN,
} from '../tokens';

const TABS_TR = ['Kategoriler & Kalıplar', 'Muhatap Analizi', '30 Soru', 'Sure Haritası'];
const TABS_EN = ['Categories & Patterns', 'Addressee Analysis', '30 Questions', 'Surah Map'];

const CloseBtn = ({ onClose }) => (
  <button
    onClick={onClose}
    style={{ ...CLOSE_BTN }}
    onMouseEnter={e => {
      e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
      e.currentTarget.style.color = COLORS.offWhite;
    }}
    onMouseLeave={e => {
      e.currentTarget.style.background = CLOSE_BTN.background;
      e.currentTarget.style.color = COLORS.silver;
    }}
  >
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  </button>
);

export default function KuranRetorigi({ onClose }) {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640);
  const bodyRef = useRef(null);

  // Escape key
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  // isMobile resize
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  // Fetch data
  useEffect(() => {
    fetch('/kuran-retorigi.json')
      .then(r => r.json())
      .then(d => setData(d))
      .catch(() => {});
  }, []);

  // Scroll to top on tab change
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
  }, [activeTab]);

  const TABS = tr ? TABS_TR : TABS_EN;

  if (!data) {
    return (
      <div style={{ ...OVERLAY_BASE, display: 'flex', flexDirection: 'column' }}>
        <div style={OVERLAY_HEADER}>
          <span style={OVERLAY_TITLE}>
            {tr ? "Kur'an'ın Retoriği" : "The Quran's Rhetoric"}
          </span>
          <CloseBtn onClose={onClose} />
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: COLORS.silver, fontSize: '0.9rem', fontFamily: FONTS.body }}>
            {tr ? 'Yükleniyor...' : 'Loading...'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ ...OVERLAY_BASE, display: 'flex', flexDirection: 'column' }}>

      {/* ── HEADER ─────────────────────────────────────────────── */}
      <div style={OVERLAY_HEADER}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          <span style={OVERLAY_TITLE}>
            {tr ? "Kur'an'ın Retoriği" : "The Quran's Rhetoric"}
          </span>
          <span style={{ color: COLORS.slate500, fontSize: '0.8rem', flexShrink: 0 }}>·</span>
          <span style={{ color: COLORS.slate500, fontSize: '0.78rem', fontFamily: FONTS.body }}>
            {tr ? '~1.000 soru · 4 tür · 3 kalıp' : '~1,000 questions · 4 types · 3 patterns'}
          </span>
        </div>
        <CloseBtn onClose={onClose} />
      </div>

      {/* ── TAB BAR ────────────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
        background: 'rgba(8,9,26,0.6)',
        flexShrink: 0,
        overflowX: 'auto',
        scrollbarWidth: 'none',
      }}>
        {TABS.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            style={{
              padding: isMobile ? '10px 14px' : '12px 20px',
              fontSize: '0.82rem',
              fontFamily: FONTS.body,
              fontWeight: activeTab === i ? 600 : 400,
              color: activeTab === i ? COLORS.gold : COLORS.silver,
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === i ? `2px solid ${COLORS.gold}` : '2px solid transparent',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'color 0.15s',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── BODY ───────────────────────────────────────────────── */}
      <div ref={bodyRef} style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        {activeTab === 0 && <TabKategoriler data={data} tr={tr} isMobile={isMobile} />}
        {activeTab === 1 && <TabMuhatap data={data} tr={tr} isMobile={isMobile} />}
        {activeTab === 2 && <TabSorular data={data} tr={tr} isMobile={isMobile} />}
        {activeTab === 3 && <TabSureHaritasi data={data} tr={tr} isMobile={isMobile} />}
      </div>

    </div>
  );
}

// ── MODULE-LEVEL CONSTANTS ──────────────────────────────────────
const DENSITY_LABEL_TR = ['', 'Az', 'Orta', 'Yüksek', 'Çok yüksek', 'En yoğun'];
const DENSITY_LABEL_EN = ['', 'Low', 'Medium', 'High', 'Very high', 'Highest'];

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

const SPECIAL_PATTERN_IDS = ['ve-ma-edrake', 'efela-takılun-ozel', 'eleyse'];

function TabKategoriler({ data, tr, isMobile }) {
  // activeItem: category id (erotema/irsad/tevbih/taaccub) veya special pattern id
  const [activeItem, setActiveItem] = useState(data.categories[0].id);

  const activeCategory = data.categories.find(c => c.id === activeItem);
  const activeSpecial  = data.specialPatterns.find(p => p.id === activeItem);

  // Sidebar item stili
  const sidebarItem = (id, color, label, isActive) => (
    <button
      key={id}
      onClick={() => setActiveItem(id)}
      style={{
        width: '100%',
        textAlign: 'left',
        padding: '9px 16px',
        background: isActive ? `${color}18` : 'transparent',
        borderLeft: isActive ? `3px solid ${color}` : '3px solid transparent',
        border: 'none',
        cursor: 'pointer',
        color: isActive ? color : `${color}70`,
        fontSize: '0.82rem',
        fontFamily: FONTS.body,
        fontWeight: isActive ? 600 : 400,
        transition: 'all 0.15s',
        lineHeight: 1.3,
      }}
      onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = `${color}99`; }}
      onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = `${color}70`; }}
    >
      {label}
    </button>
  );

  // Ayet kartı (VERSE_BLOCK benzeri, inline)
  const verseCard = (v, i) => (
    <div
      key={i}
      style={{
        padding: '14px 16px',
        marginBottom: 10,
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${COLORS.glassBorderSoft}`,
        borderRadius: 8,
      }}
    >
      <p
        dir="rtl"
        style={{
          fontFamily: FONTS.quran,
          fontSize: isMobile ? '1.3rem' : '1.6rem',
          color: COLORS.offWhite,
          textAlign: 'right',
          lineHeight: 2,
          margin: '0 0 8px',
        }}
      >
        {v.ar}
      </p>
      <p style={{ color: COLORS.silver, fontSize: '0.88rem', fontStyle: 'italic', margin: '0 0 4px', fontFamily: FONTS.body, lineHeight: 1.6 }}>
        {tr ? v.tr : v.en}
      </p>
      <p style={{ color: `${COLORS.gold}70`, fontSize: '0.75rem', fontFamily: FONTS.body, margin: 0 }}>
        — {v.ref}
      </p>
    </div>
  );

  // Alt kalıp kartı
  const subPatternCard = (sp, catColor, i) => (
    <div
      key={i}
      style={{
        padding: '12px 16px',
        marginBottom: 10,
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid rgba(255,255,255,0.06)`,
        borderLeft: `3px solid ${catColor}`,
        borderRadius: 8,
      }}
    >
      <p
        dir="rtl"
        style={{ fontFamily: FONTS.quran, fontSize: '1.2rem', color: COLORS.offWhite, textAlign: 'right', lineHeight: 1.9, margin: '0 0 6px' }}
      >
        {sp.arabicForm}
      </p>
      <p style={{ color: catColor, fontSize: '0.82rem', fontWeight: 600, margin: '0 0 4px', fontFamily: FONTS.body }}>
        {tr ? sp.nameTr : sp.nameEn}
        <span style={{ color: COLORS.slate500, fontWeight: 400, marginLeft: 8 }}>{tr ? sp.countTr : sp.countEn}</span>
      </p>
      <p style={{ color: COLORS.silver, fontSize: '0.8rem', margin: '0 0 6px', fontFamily: FONTS.body, lineHeight: 1.5 }}>
        {tr ? sp.noteTr : sp.noteEn}
      </p>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {sp.surahs.map((s, si) => (
          <span key={si} style={{ background: `${catColor}18`, color: catColor, fontSize: '0.7rem', padding: '2px 8px', borderRadius: 10, fontFamily: FONTS.body }}>
            {s}
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', height: '100%' }}>

      {/* ── SOL SIDEBAR ──────────────────────────────── */}
      {!isMobile && (
        <div style={{
          width: 200,
          minWidth: 200,
          background: 'rgba(8,9,26,0.6)',
          borderRight: `1px solid ${COLORS.glassBorderSoft}`,
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          flexShrink: 0,
        }}>
          {/* Kategoriler */}
          <div style={{ padding: '12px 16px 6px', color: COLORS.slate500, fontSize: '0.62rem', fontFamily: FONTS.body, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            {tr ? 'Soru Türleri' : 'Question Types'}
          </div>
          {data.categories.map(c =>
            sidebarItem(c.id, c.color, `${tr ? c.nameTr : c.nameEn} ~${c.pct}%`, activeItem === c.id)
          )}

          {/* Özel Kalıplar */}
          <div style={{ padding: '16px 16px 6px', color: COLORS.slate500, fontSize: '0.62rem', fontFamily: FONTS.body, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 4, borderTop: `1px solid ${COLORS.glassBorderSoft}` }}>
            {tr ? 'Özel Kalıplar' : 'Special Patterns'}
          </div>
          {data.specialPatterns.map(p =>
            sidebarItem(p.id, p.color, tr ? p.nameTr : p.nameEn, activeItem === p.id)
          )}
        </div>
      )}

      {/* ── MOBİL CHIP ROW ───────────────────────────── */}
      {isMobile && (
        <div style={{
          position: 'absolute',
          top: 54 + 42,
          left: 0, right: 0,
          zIndex: 10,
          background: 'rgba(8,9,26,0.95)',
          borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
          padding: '8px 12px',
          display: 'flex',
          gap: 6,
          overflowX: 'auto',
          scrollbarWidth: 'none',
          flexShrink: 0,
        }}>
          {[...data.categories, ...data.specialPatterns].map(item => {
            const isActive = activeItem === item.id;
            const label = tr ? (item.nameTr || item.nameTr) : (item.nameEn || item.nameEn);
            return (
              <button
                key={item.id}
                onClick={() => setActiveItem(item.id)}
                style={{
                  whiteSpace: 'nowrap',
                  padding: '4px 12px',
                  borderRadius: 20,
                  border: `1px solid ${isActive ? item.color : 'rgba(255,255,255,0.1)'}`,
                  background: isActive ? `${item.color}20` : 'transparent',
                  color: isActive ? item.color : COLORS.silver,
                  fontSize: '0.75rem',
                  fontFamily: FONTS.body,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}

      {/* ── SAĞ PANEL ────────────────────────────────── */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: isMobile ? '56px 16px 24px' : '24px 32px',
      }}>

        {/* KATEGORİ PANELİ */}
        {activeCategory && (
          <>
            {/* Başlık + badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
              <h2 style={{ color: activeCategory.color, fontFamily: FONTS.display, fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>
                {tr ? activeCategory.nameTr : activeCategory.nameEn}
              </h2>
              <span style={{ background: `${activeCategory.color}25`, color: activeCategory.color, fontSize: '0.78rem', padding: '3px 12px', borderRadius: 20, fontFamily: FONTS.body, fontWeight: 600 }}>
                ~{activeCategory.pct}%
              </span>
            </div>

            {/* Tanım */}
            <p style={{ color: COLORS.silver, fontSize: '0.92rem', lineHeight: 1.75, fontFamily: FONTS.body, maxWidth: 680, marginBottom: 24 }}>
              {tr ? activeCategory.descTr : activeCategory.descEn}
            </p>

            {/* Alt Kalıplar */}
            <h3 style={{ color: COLORS.offWhite, fontFamily: FONTS.body, fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
              {tr ? 'Alt Kalıplar' : 'Sub-Patterns'}
            </h3>
            {activeCategory.subPatterns.map((sp, i) => subPatternCard(sp, activeCategory.color, i))}

            {/* Örnek Ayetler */}
            <h3 style={{ color: COLORS.offWhite, fontFamily: FONTS.body, fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '24px 0 12px' }}>
              {tr ? 'Seçilmiş Örnek Ayetler' : 'Selected Example Verses'}
            </h3>
            {activeCategory.exampleVerses.map((v, i) => verseCard(v, i))}
          </>
        )}

        {/* VE MÂ EDRÂKE PANELİ */}
        {activeSpecial && activeSpecial.id === 've-ma-edrake' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
              <h2 style={{ color: activeSpecial.color, fontFamily: FONTS.display, fontSize: '1.4rem', fontWeight: 700, margin: 0 }}>
                {tr ? activeSpecial.nameTr : activeSpecial.nameEn}
              </h2>
              <span style={{ background: `${activeSpecial.color}25`, color: activeSpecial.color, fontSize: '0.78rem', padding: '3px 12px', borderRadius: 20, fontFamily: FONTS.body }}>
                {activeSpecial.count} {tr ? 'kullanım' : 'uses'}
              </span>
            </div>
            <p
              dir="rtl"
              style={{ fontFamily: FONTS.quran, fontSize: '1.4rem', color: COLORS.offWhite, textAlign: 'right', lineHeight: 2, marginBottom: 8 }}
            >
              {activeSpecial.arabicForm}
            </p>
            <p style={{ color: COLORS.silver, fontSize: '0.9rem', lineHeight: 1.75, fontFamily: FONTS.body, maxWidth: 680, marginBottom: 20 }}>
              {tr ? activeSpecial.descTr : activeSpecial.descEn}
            </p>
            {/* Tefsir notu */}
            <div style={{ background: 'rgba(52,152,219,0.08)', borderLeft: `3px solid #3498db`, padding: '10px 14px', borderRadius: 6, marginBottom: 24, fontSize: '0.82rem', color: COLORS.silver, fontFamily: FONTS.body, lineHeight: 1.6 }}>
              {tr ? activeSpecial.tefsirNoteTr : activeSpecial.tefsirNoteEn}
            </div>
            {/* 13 kullanım listesi */}
            <h3 style={{ color: COLORS.offWhite, fontFamily: FONTS.body, fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
              {tr ? 'Tüm Kullanımlar (13)' : 'All Uses (13)'}
            </h3>
            {activeSpecial.usages.map((u, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, padding: '10px 14px', marginBottom: 8, background: 'rgba(255,255,255,0.03)', border: `1px solid ${COLORS.glassBorderSoft}`, borderRadius: 8, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <span style={{ color: COLORS.slate500, fontSize: '0.75rem', fontFamily: FONTS.body, minWidth: 24, paddingTop: 2 }}>{i + 1}.</span>
                <div style={{ flex: 1 }}>
                  <p dir="rtl" style={{ fontFamily: FONTS.quran, fontSize: '1.1rem', color: COLORS.gold, textAlign: 'right', lineHeight: 1.9, margin: '0 0 4px' }}>
                    {u.conceptAr}
                  </p>
                  <p style={{ color: COLORS.offWhite, fontSize: '0.82rem', fontFamily: FONTS.body, margin: '0 0 2px', fontWeight: 600 }}>
                    {tr ? u.conceptTr : u.conceptEn}
                    <span style={{ color: `${activeSpecial.color}90`, fontWeight: 400, marginLeft: 8 }}>— {u.ref}</span>
                  </p>
                  <p style={{ color: COLORS.silver, fontSize: '0.8rem', fontFamily: FONTS.body, margin: 0, fontStyle: 'italic' }}>
                    {tr ? u.answerTr : u.answerEn}
                  </p>
                </div>
              </div>
            ))}
          </>
        )}

        {/* EFELA TA'KILÛN PANELİ */}
        {activeSpecial && activeSpecial.id === 'efela-takılun-ozel' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
              <h2 style={{ color: activeSpecial.color, fontFamily: FONTS.display, fontSize: '1.4rem', fontWeight: 700, margin: 0 }}>
                {tr ? activeSpecial.nameTr : activeSpecial.nameEn}
              </h2>
            </div>
            <p style={{ color: COLORS.silver, fontSize: '0.9rem', lineHeight: 1.75, fontFamily: FONTS.body, maxWidth: 680, marginBottom: 24 }}>
              {tr ? activeSpecial.descTr : activeSpecial.descEn}
            </p>
            {activeSpecial.faculties.map((f, i) => (
              <div key={i} style={{ padding: '14px 16px', marginBottom: 12, background: 'rgba(255,255,255,0.03)', borderLeft: `3px solid ${activeSpecial.color}`, border: `1px solid ${COLORS.glassBorderSoft}`, borderRadius: 8 }}>
                <p dir="rtl" style={{ fontFamily: FONTS.quran, fontSize: '1.2rem', color: COLORS.offWhite, textAlign: 'right', lineHeight: 1.9, margin: '0 0 6px' }}>
                  {f.arabicForm}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <p style={{ color: activeSpecial.color, fontSize: '0.85rem', fontWeight: 600, margin: '0 0 3px', fontFamily: FONTS.body }}>
                      {tr ? f.nameTr : f.nameEn}
                      <span style={{ color: COLORS.slate500, fontWeight: 400, marginLeft: 8 }}>{tr ? f.countTr : f.countEn}</span>
                    </p>
                    <p style={{ color: COLORS.silver, fontSize: '0.8rem', margin: '0 0 6px', fontFamily: FONTS.body, lineHeight: 1.5, maxWidth: 480 }}>
                      {tr ? f.roleTr : f.roleEn}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p dir="rtl" style={{ fontFamily: FONTS.quran, fontSize: '0.95rem', color: COLORS.gold, margin: '0 0 2px', lineHeight: 1.8 }}>
                      {f.bestVerseAr}
                    </p>
                    <p style={{ color: `${COLORS.gold}70`, fontSize: '0.72rem', fontFamily: FONTS.body, margin: 0 }}>— {f.bestVerseRef}</p>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {/* ELEYSE PANELİ */}
        {activeSpecial && activeSpecial.id === 'eleyse' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
              <h2 style={{ color: activeSpecial.color, fontFamily: FONTS.display, fontSize: '1.4rem', fontWeight: 700, margin: 0 }}>
                {tr ? activeSpecial.nameTr : activeSpecial.nameEn}
              </h2>
              <span style={{ background: `${activeSpecial.color}25`, color: activeSpecial.color, fontSize: '0.78rem', padding: '3px 12px', borderRadius: 20, fontFamily: FONTS.body }}>
                {activeSpecial.count} {tr ? 'örnek' : 'examples'}
              </span>
            </div>
            <p dir="rtl" style={{ fontFamily: FONTS.quran, fontSize: '1.3rem', color: COLORS.offWhite, textAlign: 'right', lineHeight: 2, marginBottom: 8 }}>
              {activeSpecial.arabicForm}
            </p>
            <p style={{ color: COLORS.silver, fontSize: '0.9rem', lineHeight: 1.75, fontFamily: FONTS.body, maxWidth: 680, marginBottom: 24 }}>
              {tr ? activeSpecial.descTr : activeSpecial.descEn}
            </p>
            {activeSpecial.examples.map((ex, i) => (
              <div key={i} style={{ padding: '14px 16px', marginBottom: 10, background: 'rgba(255,255,255,0.03)', borderLeft: `3px solid ${activeSpecial.color}`, border: `1px solid ${COLORS.glassBorderSoft}`, borderRadius: 8 }}>
                <p dir="rtl" style={{ fontFamily: FONTS.quran, fontSize: '1.3rem', color: COLORS.offWhite, textAlign: 'right', lineHeight: 2, margin: '0 0 6px' }}>
                  {ex.ar}
                </p>
                <p style={{ color: COLORS.silver, fontSize: '0.88rem', fontStyle: 'italic', margin: '0 0 4px', fontFamily: FONTS.body }}>
                  {tr ? ex.tr : ex.en}
                </p>
                <p style={{ color: `${activeSpecial.color}80`, fontSize: '0.75rem', fontFamily: FONTS.body, margin: 0 }}>— {ex.ref}</p>
              </div>
            ))}
          </>
        )}

      </div>
    </div>
  );
}

// ── PLACEHOLDER TABS (Task 5-7'de doldurulacak) ────────────────
function TabMuhatap({ data, tr, isMobile }) {
  const [activeGroup, setActiveGroup] = useState('all');

  const groups = data.addresseeGroups;
  const filtered = activeGroup === 'all'
    ? groups
    : groups.filter(g => g.id === activeGroup);

  const pillStyle = (id, color) => {
    const isActive = activeGroup === id;
    return {
      padding: '5px 14px',
      borderRadius: 20,
      border: `1px solid ${isActive ? color : 'rgba(255,255,255,0.1)'}`,
      background: isActive ? `${color}22` : 'transparent',
      color: isActive ? color : COLORS.silver,
      fontSize: '0.78rem',
      fontFamily: FONTS.body,
      cursor: 'pointer',
      transition: 'all 0.15s',
      whiteSpace: 'nowrap',
    };
  };

  return (
    <div style={{ padding: isMobile ? '16px' : '28px 32px' }}>

      {/* Başlık */}
      <h2 style={{ color: COLORS.offWhite, fontFamily: FONTS.display, fontSize: isMobile ? '1.3rem' : '1.6rem', fontWeight: 700, margin: '0 0 6px' }}>
        {tr ? 'Sorular Kime Soruluyor?' : 'Who Is Being Asked?'}
      </h2>
      <p style={{ color: COLORS.silver, fontSize: '0.88rem', fontFamily: FONTS.body, marginBottom: 20, lineHeight: 1.6 }}>
        {tr
          ? "Kur'an soruları herkese aynı şekilde sormaz. 5 farklı muhatap grubuna farklı işlevlerle yönlendirilir."
          : "The Quran does not ask everyone the same way. Questions are directed to 5 different addressee groups with distinct functions."}
      </p>

      {/* Filter pills */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, overflowX: 'auto', scrollbarWidth: 'none', flexWrap: isMobile ? 'nowrap' : 'wrap' }}>
        <button style={pillStyle('all', COLORS.gold)} onClick={() => setActiveGroup('all')}>
          {tr ? 'Tümü' : 'All'} ({groups.length})
        </button>
        {groups.map(g => (
          <button key={g.id} style={pillStyle(g.id, g.color)} onClick={() => setActiveGroup(g.id)}>
            {tr ? g.nameTr : g.nameEn}
          </button>
        ))}
      </div>

      {/* Group cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {filtered.map(group => (
          <div key={group.id}>
            {/* Group header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: group.color, flexShrink: 0, display: 'inline-block' }} />
              <h3 style={{ color: group.color, fontFamily: FONTS.body, fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>
                {tr ? group.nameTr : group.nameEn}
              </h3>
            </div>
            <p style={{ color: COLORS.silver, fontSize: '0.85rem', fontFamily: FONTS.body, lineHeight: 1.65, marginBottom: 14, maxWidth: 600 }}>
              {tr ? group.descTr : group.descEn}
            </p>

            {/* Verse cards */}
            <div style={{ display: isMobile ? 'flex' : 'grid', flexDirection: isMobile ? 'column' : undefined, gridTemplateColumns: isMobile ? undefined : 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
              {group.verses.map((v, vi) => (
                <div
                  key={vi}
                  style={{
                    padding: '14px 16px',
                    background: 'rgba(255,255,255,0.03)',
                    border: `1px solid ${COLORS.glassBorderSoft}`,
                    borderLeft: `3px solid ${group.color}`,
                    borderRadius: 8,
                  }}
                >
                  {/* Grup badge */}
                  <span style={{
                    display: 'inline-block',
                    background: `${group.color}20`,
                    color: group.color,
                    fontSize: '0.68rem',
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: 4,
                    marginBottom: 8,
                    fontFamily: FONTS.body,
                    letterSpacing: '0.05em',
                  }}>
                    {tr ? group.nameTr : group.nameEn}
                  </span>
                  {/* Arapça */}
                  <p dir="rtl" style={{ fontFamily: FONTS.quran, fontSize: '1.4rem', color: COLORS.offWhite, textAlign: 'right', lineHeight: 2, margin: '0 0 6px' }}>
                    {v.ar}
                  </p>
                  {/* Çeviri */}
                  <p style={{ color: COLORS.silver, fontSize: '0.87rem', fontStyle: 'italic', margin: '0 0 4px', fontFamily: FONTS.body, lineHeight: 1.6 }}>
                    {tr ? v.tr : v.en}
                  </p>
                  {/* Ref */}
                  <p style={{ color: `${COLORS.gold}60`, fontSize: '0.75rem', fontFamily: FONTS.body, margin: '0 0 8px' }}>— {v.ref}</p>
                  {/* Not */}
                  <p style={{ color: `${COLORS.silver}80`, fontSize: '0.78rem', fontFamily: FONTS.body, margin: 0, lineHeight: 1.5, fontStyle: 'italic' }}>
                    {tr ? v.noteTr : v.noteEn}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
function TabSorular({ data, tr, isMobile }) {
  const [typeFilter,    setTypeFilter]    = useState('all');
  const [patternFilter, setPatternFilter] = useState('all');
  const [addressFilter, setAddressFilter] = useState('all');

  const TYPE_COLORS = {
    erotema: '#d4a574',
    irsad:   '#3498db',
    tevbih:  '#2ecc71',
    taaccub: '#a78bfa',
  };
  const TYPE_LABELS_TR = { erotema: 'Erotema', irsad: 'İrşad', tevbih: 'Tevbih', taaccub: 'Taaccüb' };
  const TYPE_LABELS_EN = { erotema: 'Erotema', irsad: 'Guidance', tevbih: 'Reproach', taaccub: 'Wonder' };

  const PATTERN_COLORS = { 've-ma-edrake': '#D85A30', 'efela-takılun': '#14b8a6', eleyse: '#8b5cf6' };
  const PATTERN_LABELS_TR = { 've-ma-edrake': 'Ve Mâ Edrâke', 'efela-takılun': "Efela Ta'kılûn", eleyse: 'Eleyse' };
  const PATTERN_LABELS_EN = { 've-ma-edrake': 'Wa Ma Adraka', 'efela-takılun': 'Afala Taʿqilun', eleyse: 'Alaysa' };

  const ADDRESS_COLORS = { humanity: '#d4a574', mushrikeen: '#e74c3c', prophet: '#a78bfa', 'ehl-i-kitap': '#14b8a6', munafikun: '#64748b' };
  const ADDRESS_LABELS_TR = { humanity: 'İnsanlık', mushrikeen: 'Müşrik', prophet: 'Peygamber', 'ehl-i-kitap': 'Ehli Kitap', munafikun: 'Münafık' };
  const ADDRESS_LABELS_EN = { humanity: 'Humanity', mushrikeen: 'Polytheist', prophet: 'Prophet', 'ehl-i-kitap': 'People of Book', munafikun: 'Hypocrite' };

  const filtered = data.questions.filter(q => {
    if (typeFilter    !== 'all' && q.type      !== typeFilter)    return false;
    if (patternFilter !== 'all' && q.pattern   !== patternFilter) return false;
    if (addressFilter !== 'all' && q.addressee !== addressFilter) return false;
    return true;
  });

  const pill = (label, value, activeValue, setFn, color) => {
    const isActive = activeValue === value;
    return (
      <button
        key={value}
        onClick={() => setFn(value)}
        style={{
          padding: '4px 12px',
          borderRadius: 20,
          border: `1px solid ${isActive ? color : 'rgba(255,255,255,0.1)'}`,
          background: isActive ? `${color}22` : 'transparent',
          color: isActive ? color : COLORS.silver,
          fontSize: '0.75rem',
          fontFamily: FONTS.body,
          cursor: 'pointer',
          transition: 'all 0.15s',
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </button>
    );
  };

  return (
    <div style={{ padding: isMobile ? '16px' : '24px 32px' }}>

      {/* Başlık */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ color: COLORS.offWhite, fontFamily: FONTS.display, fontSize: isMobile ? '1.2rem' : '1.5rem', fontWeight: 700, margin: '0 0 4px' }}>
          {tr ? '30 Seçilmiş Soru' : '30 Selected Questions'}
        </h2>
        <p style={{ color: COLORS.silver, fontSize: '0.82rem', fontFamily: FONTS.body, margin: 0 }}>
          {tr ? `${filtered.length} soru gösteriliyor` : `Showing ${filtered.length} questions`}
        </p>
      </div>

      {/* Filter satırları */}
      <div style={{ marginBottom: 20 }}>
        {/* Tür filtresi */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 8, overflowX: 'auto', scrollbarWidth: 'none', flexWrap: 'nowrap' }}>
          {pill(tr ? 'Tümü' : 'All', 'all', typeFilter, setTypeFilter, COLORS.gold)}
          {Object.entries(TYPE_LABELS_TR).map(([id, labelTr]) =>
            pill(tr ? labelTr : TYPE_LABELS_EN[id], id, typeFilter, setTypeFilter, TYPE_COLORS[id])
          )}
        </div>
        {/* Kalıp + Muhatap filtresi */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', scrollbarWidth: 'none', flexWrap: 'nowrap' }}>
          {pill(tr ? 'Tüm Kalıplar' : 'All Patterns', 'all', patternFilter, setPatternFilter, COLORS.silver)}
          {Object.entries(PATTERN_LABELS_TR).map(([id, labelTr]) =>
            pill(tr ? labelTr : PATTERN_LABELS_EN[id], id, patternFilter, setPatternFilter, PATTERN_COLORS[id])
          )}
          <span style={{ color: COLORS.slate500, padding: '4px 4px', fontSize: '0.75rem', alignSelf: 'center' }}>|</span>
          {pill(tr ? 'Tüm Muhatap' : 'All Addressees', 'all', addressFilter, setAddressFilter, COLORS.silver)}
          {['humanity', 'mushrikeen', 'prophet'].map(id =>
            pill(tr ? ADDRESS_LABELS_TR[id] : ADDRESS_LABELS_EN[id], id, addressFilter, setAddressFilter, ADDRESS_COLORS[id])
          )}
        </div>
      </div>

      {/* Soru kartları grid */}
      {filtered.length === 0 ? (
        <p style={{ color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.9rem' }}>
          {tr ? 'Filtre sonucu bulunamadı.' : 'No results for this filter.'}
        </p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 14,
        }}>
          {filtered.map(q => {
            const typeColor   = TYPE_COLORS[q.type]   || COLORS.silver;
            const typeLabelTr = TYPE_LABELS_TR[q.type] || q.type;
            const typeLabelEn = TYPE_LABELS_EN[q.type] || q.type;
            const patColor = q.pattern ? (PATTERN_COLORS[q.pattern] || COLORS.silver) : null;
            const patLabelTr = q.pattern ? (PATTERN_LABELS_TR[q.pattern] || q.pattern) : null;
            const patLabelEn = q.pattern ? (PATTERN_LABELS_EN[q.pattern] || q.pattern) : null;
            const addrColor  = ADDRESS_COLORS[q.addressee]  || COLORS.silver;
            const addrLabelTr = ADDRESS_LABELS_TR[q.addressee] || q.addressee;
            const addrLabelEn = ADDRESS_LABELS_EN[q.addressee] || q.addressee;
            return (
              <div
                key={q.id}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: 10,
                  padding: '14px 16px',
                  border: `1px solid ${COLORS.glassBorderSoft}`,
                  borderLeftColor: typeColor,
                  borderLeftWidth: 3,
                }}
              >
                {/* Badges */}
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 8 }}>
                  <span style={{ background: `${typeColor}22`, color: typeColor, fontSize: '0.67rem', fontWeight: 600, padding: '2px 7px', borderRadius: 4, fontFamily: FONTS.body, letterSpacing: '0.04em' }}>
                    {tr ? typeLabelTr : typeLabelEn}
                  </span>
                  {patColor && (
                    <span style={{ background: `${patColor}22`, color: patColor, fontSize: '0.67rem', fontWeight: 600, padding: '2px 7px', borderRadius: 4, fontFamily: FONTS.body }}>
                      {tr ? patLabelTr : patLabelEn}
                    </span>
                  )}
                  <span style={{ background: `${addrColor}15`, color: `${addrColor}cc`, fontSize: '0.67rem', padding: '2px 7px', borderRadius: 4, fontFamily: FONTS.body }}>
                    {tr ? addrLabelTr : addrLabelEn}
                  </span>
                </div>
                {/* Arapça */}
                <p dir="rtl" style={{ fontFamily: FONTS.quran, fontSize: '1.4rem', color: COLORS.offWhite, textAlign: 'right', lineHeight: 2, margin: '0 0 6px' }}>
                  {q.ar}
                </p>
                {/* Türkçe */}
                <p style={{ color: COLORS.silver, fontSize: '0.88rem', fontStyle: 'italic', margin: '0 0 4px', fontFamily: FONTS.body, lineHeight: 1.6 }}>
                  {q.tr}
                </p>
                {/* İngilizce */}
                <p style={{ color: `${COLORS.silver}80`, fontSize: '0.8rem', margin: '0 0 6px', fontFamily: FONTS.body, lineHeight: 1.5 }}>
                  {q.en}
                </p>
                {/* Ref */}
                <p style={{ color: `${COLORS.gold}60`, fontSize: '0.72rem', fontFamily: FONTS.body, margin: 0 }}>— {q.ref}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
function TabSureHaritasi({ data, tr, isMobile }) {
  const [hoveredSurah, setHoveredSurah] = useState(null);
  const TYPE_COLORS = { erotema: '#d4a574', irsad: '#3498db', tevbih: '#2ecc71', taaccub: '#a78bfa' };

  return (
    <div style={{ padding: isMobile ? '16px' : '28px 32px' }}>

      {/* ── BÖLÜM 1: HEATMAP ────────────────────────────── */}
      <h2 style={{ color: COLORS.offWhite, fontFamily: FONTS.display, fontSize: isMobile ? '1.2rem' : '1.5rem', fontWeight: 700, margin: '0 0 6px' }}>
        {tr ? 'Sure Başına Soru Yoğunluğu' : 'Question Density by Surah'}
      </h2>
      <p style={{ color: `${COLORS.silver}80`, fontSize: '0.82rem', fontFamily: FONTS.body, marginBottom: 16, lineHeight: 1.5 }}>
        {tr ? '114 sure — altın ton yoğunluğu gösterir. Üzerine gel veya dokun.' : '114 surahs — gold intensity indicates density. Hover or tap for details.'}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
        {data.surahDensity.map((d, i) => (
          <div
            key={i}
            onMouseEnter={() => setHoveredSurah(i)}
            onMouseLeave={() => setHoveredSurah(null)}
            style={{
              position: 'relative',
              width: 24, height: 24,
              borderRadius: 4,
              background: d === 0 ? 'rgba(255,255,255,0.03)' : `rgba(212,165,116,${d * 0.18})`,
              border: hoveredSurah === i ? '1px solid rgba(212,165,116,0.6)' : '1px solid rgba(255,255,255,0.05)',
              cursor: 'default',
              flexShrink: 0,
              transition: 'border-color 0.1s',
            }}
          >
            {hoveredSurah === i && (
              <div style={{
                position: 'absolute',
                bottom: 'calc(100% + 6px)',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(6,8,20,0.97)',
                border: `1px solid rgba(212,165,116,0.3)`,
                borderRadius: 8,
                padding: '8px 12px',
                whiteSpace: 'nowrap',
                zIndex: 50,
                pointerEvents: 'none',
                minWidth: 180,
              }}>
                {/* Sure adı + numara */}
                <p style={{ color: COLORS.offWhite, fontSize: '0.78rem', fontFamily: FONTS.body, fontWeight: 600, margin: '0 0 3px' }}>
                  {i + 1}. {SURAH_NAMES_TR[i]}
                </p>
                {/* Yoğunluk */}
                <p style={{ color: `${COLORS.gold}90`, fontSize: '0.72rem', fontFamily: FONTS.body, margin: '0 0 4px' }}>
                  {tr ? (DENSITY_LABEL_TR[d] || '—') : (DENSITY_LABEL_EN[d] || '—')}
                </p>
                {/* Top 5 sure için ek detay */}
                {(() => {
                  const topSurah = data.topSurahs.find(s => s.number === i + 1);
                  if (!topSurah) return null;
                  return (
                    <>
                      <p style={{ color: COLORS.silver, fontSize: '0.72rem', fontFamily: FONTS.body, margin: '0 0 4px' }}>
                        ~{topSurah.estimatedCount} {tr ? 'soru' : 'questions'}
                      </p>
                      <p dir="rtl" style={{ fontFamily: FONTS.quran, fontSize: '0.85rem', color: COLORS.gold, textAlign: 'right', lineHeight: 1.8, margin: '2px 0 0' }}>
                        {topSurah.iconicQuestionAr}
                      </p>
                    </>
                  );
                })()}
                {/* Arrow */}
                <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '5px solid rgba(212,165,116,0.3)' }} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 40 }}>
        {[1, 2, 3, 4, 5].map(v => (
          <div key={v} style={{ width: 18, height: 18, borderRadius: 3, background: `rgba(212,165,116,${v * 0.18})`, border: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }} />
        ))}
        <span style={{ color: COLORS.silver, fontSize: '0.72rem', marginLeft: 4, fontFamily: FONTS.body }}>
          {tr ? 'Az → Çok' : 'Few → Many'}
        </span>
      </div>

      {/* ── BÖLÜM 2: EN YOĞUN 5 SURE ───────────────────── */}
      <h3 style={{ color: COLORS.offWhite, fontFamily: FONTS.body, fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>
        {tr ? 'En Yoğun 5 Sure' : 'Top 5 Most Dense Surahs'}
      </h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: 12,
        marginBottom: 48,
      }}>
        {data.topSurahs.map((s, i) => {
          const domColor = TYPE_COLORS[s.dominantType] || COLORS.silver;
          return (
            <div
              key={i}
              style={{
                padding: '14px 16px',
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid ${COLORS.glassBorderSoft}`,
                borderRadius: 10,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <span style={{ color: COLORS.slate500, fontSize: '0.75rem', fontFamily: FONTS.body }}>{s.number}. </span>
                  <span style={{ color: COLORS.offWhite, fontSize: '0.9rem', fontFamily: FONTS.body, fontWeight: 600 }}>
                    {tr ? s.nameTr : s.nameEn}
                  </span>
                </div>
                <span style={{ background: `${domColor}20`, color: domColor, fontSize: '0.68rem', padding: '2px 7px', borderRadius: 4, fontFamily: FONTS.body }}>
                  ~{s.estimatedCount}
                </span>
              </div>
              <p dir="rtl" style={{ fontFamily: FONTS.quran, fontSize: '1.05rem', color: COLORS.gold, textAlign: 'right', lineHeight: 1.8, margin: '0 0 6px' }}>
                {s.iconicQuestionAr}
              </p>
              <p style={{ color: `${COLORS.silver}80`, fontSize: '0.78rem', fontFamily: FONTS.body, margin: 0, lineHeight: 1.5 }}>
                {tr ? s.noteTr : s.noteEn}
              </p>
            </div>
          );
        })}
      </div>

      {/* ── BÖLÜM 3: KARŞILAŞTIRMALI ANALİZ ────────────── */}
      <div style={{ borderTop: `1px solid ${COLORS.glassBorderSoft}`, paddingTop: 36 }}>
        <h3 style={{ color: COLORS.offWhite, fontFamily: FONTS.display, fontSize: isMobile ? '1.1rem' : '1.3rem', fontWeight: 700, margin: '0 0 6px' }}>
          {tr ? 'Bir Soru — Dört Farklı Kullanım' : 'One Question — Four Different Uses'}
        </h3>
        <p style={{ color: COLORS.silver, fontSize: '0.85rem', fontFamily: FONTS.body, marginBottom: 20, lineHeight: 1.6 }}>
          {tr ? 'Aynı soru farklı bağlamlarda farklı bir retorik işlev üstlenebilir.' : 'The same question can serve a different rhetorical function in different contexts.'}
        </p>
        {/* Merkez soru */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <p dir="rtl" style={{ fontFamily: FONTS.quran, fontSize: isMobile ? '1.4rem' : '1.8rem', color: COLORS.gold, lineHeight: 2, margin: '0 0 4px', textAlign: 'center' }}>
            {data.comparativeAnalysis.questionAr}
          </p>
          <p style={{ color: COLORS.silver, fontSize: '0.88rem', fontStyle: 'italic', fontFamily: FONTS.body, margin: 0 }}>
            {tr ? data.comparativeAnalysis.questionTr : data.comparativeAnalysis.questionEn}
          </p>
        </div>
        {/* 3 analiz kartı */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 14, marginBottom: 20 }}>
          {data.comparativeAnalysis.cards.map((card, ci) => {
            const color = TYPE_COLORS[card.type] || COLORS.silver;
            return (
              <div key={ci} style={{ padding: '14px 16px', background: 'rgba(255,255,255,0.03)', borderLeft: `3px solid ${color}`, border: `1px solid ${COLORS.glassBorderSoft}`, borderRadius: 8 }}>
                <p style={{ color, fontSize: '0.78rem', fontWeight: 600, fontFamily: FONTS.body, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 6px' }}>
                  {tr ? card.labelTr : card.labelEn}
                </p>
                <p style={{ color: `${COLORS.gold}70`, fontSize: '0.75rem', fontFamily: FONTS.body, margin: '0 0 8px' }}>
                  {tr ? card.refTr : card.refEn}
                </p>
                <p style={{ color: COLORS.silver, fontSize: '0.85rem', fontFamily: FONTS.body, lineHeight: 1.6, margin: 0 }}>
                  {tr ? card.analysisTr : card.analysisEn}
                </p>
              </div>
            );
          })}
        </div>
        {/* Taaccüb analiz notu */}
        <div style={{ background: 'rgba(167,139,250,0.08)', borderLeft: `3px solid #a78bfa`, padding: '10px 14px', borderRadius: 6, fontSize: '0.82rem', color: COLORS.silver, fontFamily: FONTS.body, lineHeight: 1.65 }}>
          <span style={{ color: '#a78bfa', fontWeight: 600, marginRight: 6 }}>Taaccüb:</span>
          {tr ? data.comparativeAnalysis.taaccubNoteTr : data.comparativeAnalysis.taaccubNoteEn}
        </div>
      </div>

    </div>
  );
}
