import { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import {
  OVERLAY_BASE, OVERLAY_HEADER, OVERLAY_TITLE, CLOSE_BTN,
  FONTS, COLORS,
} from '../tokens';

const TABS = {
  RENKLER:   'renkler',
  BAGLAM:    'baglam',
  CENNET:    'cennet',
  KIYAMET:   'kiyamet',
  DILBILIM:  'dilbilim',
  KAYNAKLAR: 'kaynaklar',
};

const TAB_LABELS = {
  renkler:   { tr: 'RENKLER',         en: 'COLORS' },
  baglam:    { tr: 'BAĞLAM HARİTASI', en: 'CONTEXT MAP' },
  cennet:    { tr: 'CENNET PALETİ',   en: 'PARADISE PALETTE' },
  kiyamet:   { tr: 'KIYAMETİN RENKLERİ', en: "JUDGMENT'S COLORS" },
  dilbilim:  { tr: 'DİLBİLİM',        en: 'LINGUISTICS' },
  kaynaklar: { tr: 'KAYNAKLAR',       en: 'SOURCES' },
};

export default function KuranRenkleri({ onClose }) {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const [data, setData]               = useState(null);
  const [activeTab, setActiveTab]     = useState(TABS.RENKLER);
  const [activeFilter, setActiveFilter] = useState('tumu');
  const [isMobile, setIsMobile]       = useState(() => window.innerWidth < 640);

  // Fetch data
  useEffect(() => {
    fetch('/kuranin-renkleri.json')
      .then(r => r.json())
      .then(setData)
      .catch(console.error);
  }, []);

  // isMobile listener
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  // Escape key
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  const tabStyle = (id) => ({
    padding: isMobile ? '7px 12px' : '8px 16px',
    borderRadius: '6px',
    border: 'none',
    background: activeTab === id ? COLORS.gold : 'rgba(255,255,255,0.05)',
    color: activeTab === id ? '#0a0a1a' : COLORS.silver,
    fontSize: '0.72rem',
    fontWeight: activeTab === id ? 700 : 500,
    fontFamily: FONTS.body,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'all 0.15s',
    flexShrink: 0,
  });

  return (
    <div style={{ ...OVERLAY_BASE, display: 'flex', flexDirection: 'column' }} role="dialog" aria-modal="true">
      {/* ── Header ── */}
      <div style={OVERLAY_HEADER}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="1.6" strokeLinecap="round">
            <circle cx="12" cy="12" r="4"/>
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
          </svg>
          <span style={OVERLAY_TITLE}>
            {tr ? "Kur'an'ın Renkleri" : 'Colors of the Quran'}
          </span>
        </div>
        <button
          onClick={onClose}
          style={CLOSE_BTN}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = COLORS.offWhite; }}
          onMouseLeave={e => { e.currentTarget.style.background = CLOSE_BTN.background; e.currentTarget.style.color = COLORS.silver; }}
          aria-label="Kapat"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>

      {/* ── Scrollable body ── */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>

        {/* ── Hero ── */}
        <div style={{ padding: isMobile ? '20px 16px 16px' : '28px 32px 24px', background: 'linear-gradient(180deg,#0d1b2a 0%,#0a0a1a 100%)' }}>
          {/* Page label */}
          <div style={{ fontSize: '0.62rem', letterSpacing: '0.15em', color: COLORS.gold, textTransform: 'uppercase', fontFamily: FONTS.body, fontWeight: 700, marginBottom: '8px' }}>
            {tr ? "KUR'AN'IN RENK PALETİ" : "THE QURAN'S COLOR PALETTE"}
          </div>

          {/* Title */}
          <h1 style={{ fontSize: isMobile ? '1.4rem' : '1.8rem', fontWeight: 700, fontFamily: FONTS.display, color: COLORS.offWhite, margin: '0 0 16px', lineHeight: 1.3 }}>
            {tr ? "Allah'ın Seçtiği Renkler" : 'The Colors Allah Chose'}
          </h1>

          {/* Arabic verse */}
          <div style={{ textAlign: 'center', padding: isMobile ? '12px' : '16px', background: 'rgba(212,165,116,0.06)', border: '1px solid rgba(212,165,116,0.15)', borderRadius: '10px', marginBottom: '16px' }}>
            <p style={{ fontFamily: FONTS.quran, fontSize: isMobile ? '1.1rem' : '1.25rem', color: COLORS.gold, textAlign: 'center', direction: 'rtl', lineHeight: 1.9, margin: '0 0 8px' }} lang="ar" dir="rtl">
              أَلَمْ تَرَ أَنَّ اللَّهَ أَنزَلَ مِنَ السَّمَاءِ مَاءً فَأَخْرَجْنَا بِهِ ثَمَرَاتٍ مُّخْتَلِفًا أَلْوَانُهَا
            </p>
            <p style={{ fontSize: '0.75rem', color: COLORS.silver, fontFamily: FONTS.body, fontStyle: 'italic', margin: 0 }}>
              {tr
                ? '"Allah\'ın gökten su indirdiğini ve onunla renkleri birbirinden farklı meyveler çıkardığımızı görmüyor musun?" — Fâtır 35:27'
                : '"Do you not see that Allah sends down rain from the sky, and We produce thereby fruits of varying colors?" — Fatir 35:27'}
            </p>
          </div>

          {/* Intro paragraph */}
          <p style={{ fontSize: '0.85rem', color: COLORS.silver, lineHeight: 1.7, fontFamily: FONTS.body, margin: '0 0 20px' }}>
            {tr
              ? "Kur'an renkleri tesadüfen kullanmaz. Yeşil cenneti çağrıştırır, beyaz saflığı ve mucizeyi, siyah karanlığı ve cezayı, sarı hem canlılığı hem çürümeyi, kırmızı kozmik dönüşümü, mavi belirsizlik ve donukluğu anlatır. Fâtır 35:27 tek bir ayette dağları üç renkle tasvir eder: kırmızı, beyaz, siyah."
              : "The Quran does not use colors accidentally. Green evokes paradise, white purity and miracle, black darkness and punishment, yellow both vitality and decay, red cosmic transformation, blue ambiguity and blankness. Fatir 35:27 describes mountains in a single verse with three colors: red, white, and black."}
          </p>

          {/* 6 stat cards */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(3,1fr)', gap: '8px' }}>
            {[
              { num: '8',             labelTr: 'Temel Renk',              labelEn: 'Core Colors' },
              { num: '14',            labelTr: 'Farklı Renk Kelimesi',    labelEn: 'Distinct Color Words' },
              { num: '3',             labelTr: "Fâtır 35:27'de",          labelEn: 'Colors in Fatir 35:27' },
              { num: tr ? 'Yeşil' : 'Green',   labelTr: 'Cennetle En Sık', labelEn: 'Most Linked to Paradise' },
              { num: '~18',           labelTr: 'Ayette Beyaz',            labelEn: 'Verses with White' },
              { arabic: 'مُدْهَامَّتَانِ', labelTr: 'Hapax Renk',        labelEn: 'Hapax Color Word' },
            ].map((s, i) => (
              <div key={i} style={{ background: s.arabic ? 'rgba(83,74,183,0.12)' : 'rgba(255,255,255,0.04)', border: `1px solid ${s.arabic ? 'rgba(83,74,183,0.25)' : 'rgba(255,255,255,0.08)'}`, borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
                {s.arabic
                  ? <div style={{ fontFamily: FONTS.quran, fontSize: '0.9rem', color: '#a78bfa', direction: 'rtl' }} lang="ar">{s.arabic}</div>
                  : <div style={{ fontSize: '1.3rem', fontWeight: 800, color: COLORS.gold, fontFamily: FONTS.body }}>{s.num}</div>
                }
                <div style={{ fontSize: '0.65rem', color: COLORS.silver, fontFamily: FONTS.body, marginTop: '3px', lineHeight: 1.3 }}>
                  {tr ? s.labelTr : s.labelEn}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Fâtır 35:27 Feature Card ── */}
        <div style={{ margin: isMobile ? '0 16px 16px' : '0 32px 20px', padding: isMobile ? '16px' : '20px', background: 'linear-gradient(135deg,rgba(29,158,117,0.08),rgba(200,50,50,0.08),rgba(30,30,50,0.15))', border: `1px solid ${COLORS.glassBorder}`, borderRadius: '12px' }}>
          <div style={{ fontSize: '0.6rem', letterSpacing: '0.12em', color: COLORS.gold, textTransform: 'uppercase', fontFamily: FONTS.body, fontWeight: 700, marginBottom: '10px' }}>
            {tr ? 'Tek Ayette 3 Renk — Fâtır 35:27' : 'Three Colors in One Verse — Fatir 35:27'}
          </div>
          <p style={{ fontFamily: FONTS.quran, fontSize: isMobile ? '1.0rem' : '1.15rem', color: COLORS.gold, textAlign: 'center', direction: 'rtl', lineHeight: 1.9, margin: '0 0 12px' }} lang="ar" dir="rtl">
            وَمِنَ الْجِبَالِ جُدَدٌ بِيضٌ وَحُمْرٌ مُّخْتَلِفٌ أَلْوَانُهَا وَغَرَابِيبُ سُودٌ
          </p>
          <p style={{ fontSize: '0.8rem', color: COLORS.silver, fontFamily: FONTS.body, textAlign: 'center', fontStyle: 'italic', margin: '0 0 14px' }}>
            {tr
              ? '"Dağlarda da beyaz, kırmızı — renkleri birbirinden farklı — ve simsiyah yollar/şeritler vardır."'
              : '"And among the mountains are streaks of white and red of varying shades, and some intensely black."'}
          </p>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { ar: 'بِيضٌ', label: tr ? 'Beyaz' : 'White', bg: '#C8D6E5', fg: '#0a0a1a' },
              { ar: 'حُمْرٌ', label: tr ? 'Kırmızı' : 'Red',   bg: '#B91C1C', fg: '#fff' },
              { ar: 'غَرَابِيبُ سُودٌ', label: tr ? 'Simsiyah' : 'Jet Black', bg: '#1E1B4B', fg: '#e8e6e3' },
            ].map(p => (
              <div key={p.ar} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 12px', background: p.bg, borderRadius: '20px' }}>
                <span style={{ fontFamily: FONTS.quran, fontSize: '0.85rem', color: p.fg, direction: 'rtl' }} lang="ar">{p.ar}</span>
                <span style={{ fontSize: '0.7rem', color: p.fg, fontFamily: FONTS.body, fontWeight: 600 }}>{p.label}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: '0.72rem', color: COLORS.silver, fontFamily: FONTS.body, margin: '12px 0 0', lineHeight: 1.6 }}>
            {tr
              ? "'Garâbîb' kuzgun/karga (ghurab) kökünden — siyahın en yoğun tonu için özel kelime. 'Mudhammatân' (koyu yeşil) ile paralel: Kur'an renk yoğunluğunu ifade etmek için kök değiştirerek yeni kelime üretir."
              : "'Gharabib' derives from ghurab (raven/crow) — a special word for the most intense shade of black. Parallel to 'mudhammatân' (intense green): the Quran creates new words by changing roots to express color intensity."}
          </p>
        </div>

        {/* ── Tab bar ── */}
        <div style={{
          display: 'flex', gap: '6px',
          padding: isMobile ? '10px 16px' : '12px 32px',
          borderBottom: `1px solid ${COLORS.glassBorder}`,
          overflowX: 'auto', scrollbarWidth: 'none',
          position: 'sticky', top: 0,
          background: 'rgba(10,10,26,0.97)',
          backdropFilter: 'blur(12px)',
          zIndex: 10,
        }}>
          {Object.values(TABS).map(id => (
            <button key={id} style={tabStyle(id)} onClick={() => setActiveTab(id)}>
              {TAB_LABELS[id][language] ?? TAB_LABELS[id].tr}
            </button>
          ))}
        </div>

        {/* ── Tab content placeholder ── */}
        <div style={{ padding: isMobile ? '16px' : '24px 32px', minHeight: '400px' }}>
          <p style={{ color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.85rem' }}>
            {activeTab} — {tr ? 'içerik yakında' : 'content coming soon'}
          </p>
        </div>

      </div>
    </div>
  );
}
