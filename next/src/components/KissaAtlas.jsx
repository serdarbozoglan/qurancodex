'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS, BREAKPOINT_MOBILE, RADIUS, TRANSITION, SEMANTIC } from '../tokens';
import { fetchMealSurah } from '../lib/mealCache';
import ToolHeader from './ToolHeader';
import CrossToolCTA from './CrossToolCTA';
import BookmarkButton from './BookmarkButton';
import SourcesCitation from './SourcesCitation';
import useFocusTrap from '../hooks/useFocusTrap';

import { cleanArabicForDisplay as cleanArabic } from '../lib/arabic';
import LoadingOverlay from './LoadingOverlay';
import useNavbarOffset from './useNavbarOffset';
// Surah names (Türkçe kısa)
const SURAH_NAMES_TR = [
  '', 'Fatiha', 'Bakara', 'Âl-i İmrân', 'Nisâ', 'Mâide',
  'En\'âm', 'A\'râf', 'Enfâl', 'Tevbe', 'Yûnus',
  'Hûd', 'Yûsuf', 'Ra\'d', 'İbrâhîm', 'Hicr',
  'Nahl', 'İsrâ', 'Kehf', 'Meryem', 'Tâ-Hâ',
  'Enbiyâ', 'Hac', 'Mü\'minûn', 'Nûr', 'Furkân',
  'Şu\'arâ', 'Neml', 'Kasas', 'Ankebût', 'Rûm',
  'Lokmân', 'Secde', 'Ahzâb', 'Sebe', 'Fâtır',
  'Yâsîn', 'Sâffât', 'Sâd', 'Zümer', 'Mü\'min',
  'Fussılet', 'Şûrâ', 'Zuhruf', 'Duhân', 'Câsiye',
  'Ahkâf', 'Muhammed', 'Fetih', 'Hucurât', 'Kâf',
  'Zâriyât', 'Tûr', 'Necm', 'Kamer', 'Rahmân',
  'Vâkıa', 'Hadîd', 'Mücâdele', 'Haşr', 'Mümtehine',
  'Saf', 'Cum\'a', 'Münâfikûn', 'Tegâbün', 'Talâk',
  'Tahrîm', 'Mülk', 'Kalem', 'Hâkka', 'Me\'âric',
  'Nûh', 'Cinn', 'Müzzemmil', 'Müddessir', 'Kıyâme',
  'İnsân', 'Mürselât', 'Nebe', 'Nâziât', 'Abese',
  'Tekvîr', 'İnfitâr', 'Mutaffifîn', 'İnşikak', 'Bürûc',
  'Târık', 'A\'lâ', 'Gâşiye', 'Fecr', 'Beled',
  'Şems', 'Leyl', 'Duhâ', 'İnşirâh', 'Tîn',
  'Alak', 'Kadr', 'Beyyine', 'Zilzâl', 'Âdiyât',
  'Kâria', 'Tekâsür', 'Asr', 'Hümeze', 'Fîl',
  'Kureyş', 'Mâûn', 'Kevser', 'Kâfirûn', 'Nasr',
  'Tebbet', 'İhlâs', 'Felak', 'Nâs',
];
const SURAH_NAMES_EN = [
  '', 'Al-Fatiha', 'Al-Baqara', 'Al-Imran', 'An-Nisa', 'Al-Ma\'ida',
  'Al-An\'am', 'Al-A\'raf', 'Al-Anfal', 'At-Tawba', 'Yunus',
  'Hud', 'Yusuf', 'Ar-Ra\'d', 'Ibrahim', 'Al-Hijr',
  'An-Nahl', 'Al-Isra', 'Al-Kahf', 'Maryam', 'Ta-Ha',
  'Al-Anbiya', 'Al-Hajj', 'Al-Mu\'minun', 'An-Nur', 'Al-Furqan',
  'Ash-Shu\'ara', 'An-Naml', 'Al-Qasas', 'Al-Ankabut', 'Ar-Rum',
  'Luqman', 'As-Sajda', 'Al-Ahzab', 'Saba', 'Fatir',
  'Ya-Sin', 'As-Saffat', 'Sad', 'Az-Zumar', 'Ghafir',
  'Fussilat', 'Ash-Shura', 'Az-Zukhruf', 'Ad-Dukhan', 'Al-Jathiya',
  'Al-Ahqaf', 'Muhammad', 'Al-Fath', 'Al-Hujurat', 'Qaf',
  'Adh-Dhariyat', 'At-Tur', 'An-Najm', 'Al-Qamar', 'Ar-Rahman',
  'Al-Waqi\'a', 'Al-Hadid', 'Al-Mujadila', 'Al-Hashr', 'Al-Mumtahana',
  'As-Saff', 'Al-Jumu\'a', 'Al-Munafiqun', 'At-Taghabun', 'At-Talaq',
  'At-Tahrim', 'Al-Mulk', 'Al-Qalam', 'Al-Haqqah', 'Al-Ma\'arij',
  'Nuh', 'Al-Jinn', 'Al-Muzzammil', 'Al-Muddaththir', 'Al-Qiyama',
  'Al-Insan', 'Al-Mursalat', 'An-Naba', 'An-Nazi\'at', 'Abasa',
  'At-Takwir', 'Al-Infitar', 'Al-Mutaffifin', 'Al-Inshiqaq', 'Al-Buruj',
  'At-Tariq', 'Al-A\'la', 'Al-Ghashiya', 'Al-Fajr', 'Al-Balad',
  'Ash-Shams', 'Al-Layl', 'Ad-Duha', 'Ash-Sharh', 'At-Tin',
  'Al-Alaq', 'Al-Qadr', 'Al-Bayyina', 'Az-Zalzala', 'Al-Adiyat',
  'Al-Qari\'a', 'At-Takathur', 'Al-Asr', 'Al-Humaza', 'Al-Fil',
  'Quraysh', 'Al-Ma\'un', 'Al-Kawthar', 'Al-Kafirun', 'An-Nasr',
  'Al-Masad', 'Al-Ikhlas', 'Al-Falaq', 'An-Nas',
];


// Parse "20:38–40" → { surah: 20, start: 38, end: 40 }
// Also handles "20:38" (single verse) and "20:38,40" (two separate)
function parseVerseRef(ref) {
  if (!ref) return null;
  const m = ref.match(/^(\d+):(\d+)[–-](\d+)$/);
  if (m) return { surah: +m[1], start: +m[2], end: +m[3] };
  const m2 = ref.match(/^(\d+):(\d+)$/);
  if (m2) return { surah: +m2[1], start: +m2[2], end: +m2[2] };
  return null;
}

export default function KissaAtlas({ onClose }) {
  // Navbar yüksekliği sabit DEĞİL — ölç. Bkz. src/components/useNavbarOffset.js
  // Bu sabit sitede yedinci kez aynı hatayı üretti (62 · 96 · 104 · 62 · 62 ·
  // 62 · 110). 2026-08-13: "450 → 0" diye raporlamıştım ama yalnız ToolHeader
  // kullanan sayfalarda ölçmüştüm; kullanmayanlarda örtüşme duruyordu.
  const navTop = useNavbarOffset(0, 62);
  const { language } = useLanguage();
  const trapRef = useFocusTrap(true);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedProphetId, setSelectedProphetId] = useState('musa');
  const [selectedSceneId, setSelectedSceneId] = useState(null);
  const [selectedSurah, setSelectedSurah] = useState(null);
  // SSR-safe: start false, useEffect hydrates after mount (prevents hydration mismatch)
  const [isMobile, setIsMobile] = useState(false);
  const [mobileTab, setMobileTab] = useState('scenes'); // 'scenes' | 'map' | 'detail'
  // Verse peek: { surah, start, end, verses: null|[...], loading: bool }
  const [versePeek, setVersePeek] = useState(null);

  useEffect(() => {
    fetch('/kissa-atlas.json')
      .then(r => r.json())
      .then(d => {
        setData(d);
        setLoading(false);
        // Auto-select first scene of default prophet
        const defaultProphet = d.prophets.find(p => p.id === 'musa');
        if (defaultProphet?.scenes?.[0]) {
          setSelectedSceneId(defaultProphet.scenes[0].id);
        }
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < BREAKPOINT_MOBILE);
    h(); // post-mount hydrate
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  // Reset selections when switching prophet, auto-select first scene
  const selectProphet = (id) => {
    setSelectedProphetId(id);
    const p = data?.prophets.find(x => x.id === id);
    setSelectedSceneId(p?.scenes?.[0]?.id ?? null);
    setSelectedSurah(null);
    setMobileTab('scenes');
    setVersePeek(null);
  };

  // Open verse peek for a given surah + range
  const openVersePeek = (surah, start, end) => {
    if (versePeek?.surah === surah && versePeek?.start === start) {
      setVersePeek(null); // toggle off
      return;
    }
    setVersePeek({ surah, start, end, verses: null, loading: true });
    // Local-first meal cache (author 105 = Erhan Aktaş); API fallback.
    fetchMealSurah(surah, 105)
      .then(d => {
        const verses = (d.data?.verses || [])
          .filter(v => v.verse_number >= start && v.verse_number <= end)
          .map(v => ({
            num: v.verse_number,
            arabic: v.verse,
            turkish: v.translation?.text || '',
          }));
        setVersePeek(prev => prev?.surah === surah ? { ...prev, verses, loading: false } : prev);
      })
      .catch(() => {
        setVersePeek(prev => prev?.surah === surah ? { ...prev, verses: [], loading: false } : prev);
      });
  };

  const KISSA_TOOL_HEADER = (
    <ToolHeader
      icon={<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>}
      titleTr="Kıssa Atlası"
      titleEn="Story Atlas"
      subtitleTr="Peygamberler · sahneler · sûreler"
      subtitleEn="Prophets · scenes · surahs"
      language={language}
    />
  );

  // #202 (2026-07-15) — CTA hem loading skeleton'da hem main return'de görünsün (SSR SEO)
  const RELATED_CTA = (
    <div style={{ maxWidth: 1080, margin: '0 auto', padding: isMobile ? '24px 16px 32px' : '32px 24px 48px', width: '100%' }}>
      <CrossToolCTA
        language={language}
        isMobile={isMobile}
        links={[
          { href: `/${language}/atlas/peygamber`, titleTr: 'Peygamberler Atlası', titleEn: 'Prophets Atlas', descTr: '25 peygamberin nüzul sırasına göre sûrelerdeki dağılımı ve karşılaştırması.', descEn: 'Distribution of 25 prophets across surahs by revelation order.' },
          { href: `/${language}/atlas/kavim`, titleTr: 'Kavimler Atlası', titleEn: 'Nations Atlas', descTr: 'Kıssalardaki kavimler — coğrafi + tarihsel arka planlarıyla.', descEn: 'The nations in prophetic narratives — with geographic and historical context.' },
          { href: `/${language}/graf/diyalog`, titleTr: 'Diyalog Ağı', titleEn: 'Dialogue Network', descTr: 'Kıssalardaki konuşma partnerleri — kim kime ne dedi.', descEn: 'Speech partners in prophetic narratives — who said what to whom.' },
        ]}
      />
    </div>
  );

  // #203 (2026-07-16) — Klasik kıssa kaynakları
  const SOURCES = (
    <SourcesCitation
      language={language}
      isMobile={isMobile}
      sources={[
        {
          author: 'İbn Kesîr',
          workTr: "Kısasü'l-Enbiyâ",
          workEn: 'Qiṣaṣ al-Anbiyāʾ',
          period: '1301–1373 (Dımaşk)',
          noteTr: 'Peygamber kıssalarının en kapsamlı klasik derlemesi; ayet + hadis + selef rivayetleri birleştirir.',
          noteEn: 'The most comprehensive classical compilation of prophet narratives; combines verses, hadith, and salaf reports.',
        },
        {
          author: 'et-Taberî',
          workTr: "Târîhu'r-Rusul ve'l-Mülûk",
          workEn: 'Tārīkh al-Rusul wa-l-Mulūk',
          period: '839–923 (Bağdat)',
          noteTr: 'Kıssaları tarih perspektifinden ele alan temel kaynak; farklı rivayetleri isnadıyla verir.',
          noteEn: 'Foundational historical source treating narratives with full chains of transmission.',
        },
        {
          author: 'es-Süyûtî',
          workTr: "el-İtkān fî Ulûmi'l-Kurʾân",
          workEn: 'al-Itqān fī ʿUlūm al-Qurʾān',
          period: '1445–1505 (Kahire)',
          noteTr: 'Kıssaların Kurʾân\'da neden dağıtılarak anlatıldığı ve bu tekniğin belağat değeri üzerine klasik değerlendirme.',
          noteEn: 'Classical assessment of why narratives are distributed across the Quran and the rhetorical value of this technique.',
        },
        {
          author: 'ez-Zemahşerî',
          workTr: "el-Keşşâf",
          workEn: 'al-Kashshāf',
          period: '1075–1144 (Harezm)',
          noteTr: 'Kıssaların belağat + lisân boyutunu detaylıca inceler; her ayetin dilsel katmanını açar.',
          noteEn: 'Detailed analysis of the rhetorical and linguistic dimensions of narratives, layer by verse layer.',
        },
      ]}
    />
  );

  if (loading) return (
    <div
      ref={trapRef}
      style={{
        background: COLORS.cosmicBlack,
        minHeight: 'calc(100vh - 62px)',
        display: 'flex', flexDirection: 'column',
        paddingTop: '62px',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {KISSA_TOOL_HEADER}
      <LoadingOverlay />
      {SOURCES}
      {RELATED_CTA}
    </div>
  );

  if (!data) return (
    <div style={{ background: COLORS.cosmicBlack, minHeight: 'calc(100vh - 62px)', paddingTop: '62px' }}>
      {KISSA_TOOL_HEADER}
      {SOURCES}
      {RELATED_CTA}
    </div>
  );

  const prophet = data.prophets.find(p => p.id === selectedProphetId);
  if (!prophet) return null;

  const selectedScene = prophet.scenes.find(s => s.id === selectedSceneId);

  // Highlighted surahs: either scene's surahs or selected surah
  const highlightedSurahs = selectedScene ? new Set(selectedScene.surahs) : new Set();

  // Active surahs for current prophet (all surahs in any scene)
  const activeSurahs = new Set(prophet.surahs);

  // Scenes containing a given surah
  const scenesForSurah = (surahNum) =>
    prophet.scenes.filter(s => s.surahs.includes(surahNum));

  return (
    <div
      ref={trapRef}
      style={{
        background: COLORS.cosmicBlack,
        minHeight: 'calc(100vh - 62px)',
        display: 'flex', flexDirection: 'column',
        paddingTop: '62px',
        fontFamily: "'Inter', sans-serif",
      }}
    >

      {KISSA_TOOL_HEADER}

      {/* ── PROPHET TAB BAR — sticky §13.19 full hygiene guards ─────────────── */}
      <div style={{
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        background: 'rgb(6, 8, 14)',
        backgroundColor: 'rgb(6, 8, 14)',
        flexShrink: 0,
        position: 'sticky',
        top: `${navTop}px`,
        zIndex: 20,
        isolation: 'isolate',
      }}>
        {/* Row 1: Prophet tabs (desktop inline / mobile scrollable) */}
        <div style={{
          display: 'flex', alignItems: 'center',
          padding: isMobile ? '10px 16px' : '0 20px',
          height: isMobile ? 'auto' : '52px',
          gap: '12px',
        }}>
          {/* Prophet tabs — inline on desktop */}
          {!isMobile && (
            <div style={{ display: 'flex', gap: '4px' }}>
              {data.prophets.map(p => (
                <button
                  key={p.id}
                  onClick={() => selectProphet(p.id)}
                  style={{
                    padding: '7px 14px', borderRadius: RADIUS.md,
                    border: `1px solid ${selectedProphetId === p.id ? `${p.color}80` : 'rgba(255,255,255,0.08)'}`,
                    background: selectedProphetId === p.id ? `${p.color}18` : 'transparent',
                    color: selectedProphetId === p.id ? p.color : SEMANTIC.textFaint,
                    fontSize: '0.82rem', fontWeight: selectedProphetId === p.id ? 700 : 500,
                    cursor: 'pointer', transition: 'all 0.18s',
                    fontFamily: "'Inter', sans-serif",
                  }}
                  onMouseEnter={e => { if (selectedProphetId !== p.id) { e.currentTarget.style.color = COLORS.silver; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; } }}
                  onMouseLeave={e => { if (selectedProphetId !== p.id) { e.currentTarget.style.color = SEMANTIC.textFaint; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; } }}
                >
                  {/* K7 (2026-08-14) — opacity:0.7 KALDIRILDI: SEMANTIC.textFaint
                      zaten dar bir marjla AA geçiyor (5.01), 0.7 ile çarpılınca
                      3.00'a düşüyordu. */}
                  <span style={{ marginRight: '6px' }}>
                    {language === 'tr' ? p.nameTr.split(' ')[1] : p.nameEn.split(' ')[1]}
                  </span>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: '18px', height: '18px', borderRadius: RADIUS.full,
                    background: selectedProphetId === p.id ? `${p.color}30` : COLORS.glassBg,
                    fontSize: '0.65rem', color: selectedProphetId === p.id ? p.color : SEMANTIC.textFaint, fontWeight: 700,
                  }}>
                    {p.surahCount}
                  </span>
                </button>
              ))}
            </div>
          )}

        </div>

        {/* Row 2 (mobile only): Prophet tabs scrollable */}
        {isMobile && (
          <div style={{
            display: 'flex', gap: '6px',
            padding: '0 16px 10px',
            overflowX: 'auto', WebkitOverflowScrolling: 'touch',
          }}>
            {data.prophets.map(p => (
              <button
                key={p.id}
                onClick={() => selectProphet(p.id)}
                style={{
                  flexShrink: 0,
                  padding: '6px 12px', borderRadius: RADIUS.md,
                  border: `1px solid ${selectedProphetId === p.id ? `${p.color}80` : 'rgba(255,255,255,0.08)'}`,
                  background: selectedProphetId === p.id ? `${p.color}18` : 'transparent',
                  color: selectedProphetId === p.id ? p.color : SEMANTIC.textFaint,
                  fontSize: '0.8rem', fontWeight: selectedProphetId === p.id ? 700 : 500,
                  cursor: 'pointer', transition: 'all 0.18s',
                  fontFamily: "'Inter', sans-serif",
                  display: 'flex', alignItems: 'center', gap: '6px',
                }}
              >
                {language === 'tr' ? p.nameTr.split(' ')[1] : p.nameEn.split(' ')[1]}
                <span style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: '16px', height: '16px', borderRadius: RADIUS.full,
                  background: selectedProphetId === p.id ? `${p.color}30` : COLORS.glassBg,
                  fontSize: '0.6rem', color: selectedProphetId === p.id ? p.color : SEMANTIC.textFaint, fontWeight: 700,
                }}>
                  {p.surahCount}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Mobile tab bar */}
        {isMobile && (
          <div style={{
            display: 'flex',
            borderTop: '1px solid rgba(255,255,255,0.06)',
          }}>
            {[
              { id: 'scenes', labelTr: 'Sahneler', labelEn: 'Scenes' },
              { id: 'map', labelTr: 'Sûre Haritası', labelEn: 'Surah Map' },
              { id: 'detail', labelTr: 'Detay', labelEn: 'Detail' },
            ].map(tab => {
              const isActive = mobileTab === tab.id;
              const hasDetail = tab.id === 'detail' && (selectedScene || selectedSurah);
              return (
                <button
                  key={tab.id}
                  onClick={() => setMobileTab(tab.id)}
                  style={{
                    flex: 1, padding: '10px 4px',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: isActive ? `2px solid ${prophet.color}` : '2px solid transparent',
                    color: isActive ? prophet.color : SEMANTIC.textFaint,
                    fontSize: '0.78rem', fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer', transition: `all ${TRANSITION.fast}`,
                    fontFamily: "'Inter', sans-serif",
                    position: 'relative',
                  }}
                >
                  {language === 'tr' ? tab.labelTr : tab.labelEn}
                  {hasDetail && (
                    <span style={{
                      position: 'absolute', top: '8px', right: 'calc(50% - 16px)',
                      width: '6px', height: '6px', borderRadius: RADIUS.full,
                      background: prophet.color, display: 'inline-block', marginLeft: '4px',
                    }} />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── MAIN CONTENT ─────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>

        {/* ── LEFT: SCENE LIST ─────────────────────────────────────── */}
        <div style={{
          width: isMobile ? '100%' : '260px', flexShrink: 0,
          borderRight: isMobile ? 'none' : '1px solid rgba(255,255,255,0.07)',
          display: isMobile ? (mobileTab === 'scenes' ? 'flex' : 'none') : 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          {/* Prophet summary */}
          <div style={{
            padding: '16px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
              <h3 style={{ color: prophet.color, fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>
                {language === 'tr' ? prophet.nameTr : prophet.nameEn}
              </h3>
              <span style={{ fontFamily: FONTS.quran, fontSize: '1.1rem', color: prophet.color }}>
                {prophet.nameAr}
              </span>
            </div>
            <p style={{ color: SEMANTIC.textFaint, fontSize: '0.78rem', margin: '4px 0 0' }}>
              {language === 'tr'
                ? `${prophet.scenes.length} ana sahne · ${prophet.surahCount} sûrede`
                : `${prophet.scenes.length} key scenes · across ${prophet.surahCount} surahs`}
            </p>
          </div>

          {/* Scene list */}
          <div
            className="[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gold/15 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gold/30"
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '8px',
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(212,165,116,0.15) transparent',
            }}
          >
            {prophet.scenes.map(scene => {
              const isActive = selectedSceneId === scene.id;
              return (
                <button
                  key={scene.id}
                  title={language === 'tr' ? scene.titleTr : scene.titleEn}
                  onClick={() => {
                    setSelectedSceneId(isActive ? null : scene.id);
                    setSelectedSurah(null);
                    setVersePeek(null);
                    if (isMobile && !isActive) setMobileTab('detail');
                  }}
                  style={{
                    width: '100%', textAlign: 'left', padding: '10px 12px',
                    borderRadius: RADIUS.chip, marginBottom: '3px',
                    background: isActive ? `${prophet.color}18` : 'transparent',
                    border: `1px solid ${isActive ? `${prophet.color}50` : 'transparent'}`,
                    cursor: 'pointer', transition: `all ${TRANSITION.fast}`,
                    display: 'flex', alignItems: 'flex-start', gap: '10px',
                    fontFamily: "'Inter', sans-serif",
                  }}
                  onMouseEnter={e => {
                    if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }
                  }}
                >
                  {/* Scene number */}
                  <span style={{
                    flexShrink: 0, width: '24px', height: '24px',
                    borderRadius: RADIUS.full, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: isActive ? prophet.color : 'rgba(255,255,255,0.06)',
                    color: isActive ? COLORS.cosmicBlack : SEMANTIC.textFaint,
                    fontSize: '0.7rem', fontWeight: 700, marginTop: '1px',
                  }}>
                    {scene.order}
                  </span>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      title={language === 'tr' ? scene.titleTr : scene.titleEn}
                      style={{
                        color: isActive ? prophet.color : '#cbd5e1',
                        fontSize: '0.84rem', fontWeight: isActive ? 700 : 500,
                        margin: '0 0 3px', lineHeight: 1.4,
                      }}>
                      {language === 'tr' ? scene.titleTr : scene.titleEn}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      <span style={{ color: SEMANTIC.textFaint, fontSize: '0.7rem' }}>
                        {scene.verseRef.replace(/^(\d+):/, (_, n) => `${language === 'tr' ? SURAH_NAMES_TR[+n] : SURAH_NAMES_EN[+n]}:`)}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── CENTER + RIGHT ─────────────────────────────────────────── */}
        <div style={{
          flex: 1, display: isMobile ? (mobileTab === 'map' || mobileTab === 'detail' ? 'flex' : 'none') : 'flex',
          flexDirection: 'column', overflow: 'hidden', minWidth: 0,
        }}>

          {/* ── SURAH GRID ─────────────────────────────────────────── */}
          <div style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '12px' : '20px', display: isMobile && mobileTab === 'detail' ? 'none' : 'block' }}>

            {/* Instructions */}
            <p style={{ color: SEMANTIC.textFaint, fontSize: '0.78rem', marginBottom: '16px', lineHeight: 1.6 }}>
              {selectedScene
                ? (language === 'tr'
                    ? `"${selectedScene.titleTr}" sahnesi şu sûrelerde anlatılıyor:`
                    : `"${selectedScene.titleEn}" is narrated in:`)
                : selectedSurah
                  ? (language === 'tr'
                      ? `Sûre ${selectedSurah} — ${SURAH_NAMES_TR[selectedSurah]} — ${language === 'tr' ? prophet.nameTr : prophet.nameEn} sahneleri:`
                      : `Surah ${selectedSurah} — ${SURAH_NAMES_EN[selectedSurah]} — scenes of ${prophet.nameEn}:`)
                  : (language === 'tr'
                      ? `Renkli sûreler ${prophet.nameTr}'nın kıssasını içeriyor. Bir sahne veya sûre seçin.`
                      : `Colored surahs contain ${prophet.nameEn}'s story. Select a scene or a surah tile.`)}
            </p>

            {/* Grid: 8 fixed columns, all equal size */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? 'repeat(7, 1fr)' : 'repeat(8, 1fr)',
              gap: isMobile ? '4px' : '5px',
            }}>
              {Array.from({ length: 114 }, (_, i) => {
                const num = i + 1;
                const isActive = activeSurahs.has(num);
                const isHighlighted = highlightedSurahs.has(num);
                const isSelectedSurah = selectedSurah === num;
                const scenesHere = isActive ? scenesForSurah(num) : [];
                // Dim active-but-not-highlighted when a scene is selected
                const isDimmed = selectedSceneId && isActive && !isHighlighted;

                let bg, border, color, shadow;
                if (isHighlighted) {
                  bg = COLORS.softGoldAlpha15;
                  border = `2px solid ${COLORS.softGold}`;
                  color = COLORS.softGold;
                  shadow = `0 0 10px ${COLORS.softGoldAlpha25}`;
                } else if (isSelectedSurah) {
                  bg = `${prophet.color}20`;
                  border = `2px solid ${prophet.color}80`;
                  color = prophet.color;
                  shadow = 'none';
                } else if (isActive) {
                  // K7 (2026-08-14) — sönükleştirme (isDimmed) ARTIK metne değil
                  // yalnız bg/border'a uygulanıyor. Önceden button'un tamamı
                  // opacity:0.35 ile çarpılıyordu; metin rengi de alfa
                  // taşıdığı için bileşik alfa çok düşüyor, bazı peygamber
                  // renklerinde (örn. mavi) 4.5:1 eşiğinin altına iniyordu.
                  // Fayans arka planı da renk-tonlu olduğundan (saf siyah
                  // değil) metin artık tam opak — yalnızca bg/border soluk.
                  bg = isDimmed ? `${prophet.color}06` : `${prophet.color}12`;
                  border = `1px solid ${prophet.color}${isDimmed ? '18' : '30'}`;
                  color = prophet.color;
                  shadow = 'none';
                } else {
                  bg = 'rgba(255,255,255,0.03)';
                  border = `1px solid ${COLORS.glassBg}`;
                  color = SEMANTIC.textFaint;
                  shadow = 'none';
                }

                const tileName = language === 'tr' ? SURAH_NAMES_TR[num] : SURAH_NAMES_EN[num];
                const tileTitle = isActive
                  ? `${num}. ${tileName} — ${scenesHere.length} ${language === 'tr' ? 'sahne' : 'scene'}${scenesHere.length !== 1 ? (language === 'tr' ? '' : 's') : ''}`
                  : `${num}. ${tileName}`;
                return (
                  <motion.button
                    key={num}
                    title={tileTitle}
                    onClick={() => {
                      if (!isActive) return;
                      setSelectedSurah(isSelectedSurah ? null : num);
                      setSelectedSceneId(null);
                      setVersePeek(null);
                      if (isMobile && !isSelectedSurah) setMobileTab('detail');
                    }}
                    style={{
                      position: 'relative',
                      padding: '6px 4px',
                      minHeight: '44px',
                      background: bg,
                      border,
                      borderRadius: '7px',
                      cursor: isActive ? 'pointer' : 'default',
                      textAlign: 'center',
                      boxShadow: shadow,
                      transition: 'background 0.2s, border-color 0.2s',
                      fontFamily: "'Inter', sans-serif",
                    }}
                    onMouseEnter={e => {
                      if (isActive && !isHighlighted) {
                        e.currentTarget.style.background = `${prophet.color}22`;
                        e.currentTarget.style.borderColor = `${prophet.color}55`;
                      }
                    }}
                    onMouseLeave={e => {
                      if (isActive && !isHighlighted) {
                        e.currentTarget.style.background = bg;
                        e.currentTarget.style.borderColor = isSelectedSurah ? `${prophet.color}80` : (isDimmed ? `${prophet.color}18` : `${prophet.color}30`);
                      }
                    }}
                  >
                    {/* Scene count badge — top-right corner */}
                    {isActive && scenesHere.length > 0 && (
                      <span style={{
                        position: 'absolute', top: '2px', right: '3px',
                        fontSize: '0.52rem',
                        color: isHighlighted ? COLORS.softGold : `${prophet.color}70`,
                        fontWeight: 700, lineHeight: 1,
                      }}>
                        {scenesHere.length}
                      </span>
                    )}
                    <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: isHighlighted ? 700 : 500, color, lineHeight: 1.2 }}>
                      {num}
                    </span>
                    <span style={{ display: 'block', fontSize: '0.58rem', color: isActive ? prophet.color : SEMANTIC.textFaint, lineHeight: 1.3, marginTop: '1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {(language === 'tr' ? SURAH_NAMES_TR[num] : SURAH_NAMES_EN[num])?.slice(0, 6)}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* ── DETAIL PANEL (bottom) ─────────────────────────────── */}
          <AnimatePresence>
            {isMobile && mobileTab === 'detail' && !selectedScene && !selectedSurah && (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '12px', padding: '40px 20px' }}>
                <p style={{ color: SEMANTIC.textFaint, fontSize: '0.85rem', textAlign: 'center' }}>
                  {language === 'tr' ? 'Bir sahne veya sûre seçin' : 'Select a scene or surah'}
                </p>
                <button
                  onClick={() => setMobileTab('scenes')}
                  style={{
                    padding: '8px 18px', borderRadius: RADIUS.md,
                    background: `${prophet.color}18`,
                    border: `1px solid ${prophet.color}40`,
                    color: prophet.color, fontSize: '0.8rem', cursor: 'pointer',
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {language === 'tr' ? 'Sahnelere git' : 'Go to scenes'}
                </button>
              </div>
            )}
            {(selectedScene || selectedSurah) && (!isMobile || mobileTab === 'detail') && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  borderTop: isMobile ? 'none' : `1px solid ${prophet.color}30`,
                  background: `${prophet.color}08`,
                  flexShrink: 0,
                  overflowY: isMobile ? 'auto' : 'visible',
                  flex: isMobile ? 1 : 'none',
                }}
              >
                <div style={{ padding: isMobile ? '12px 16px' : '16px 20px' }}>
                  {isMobile && (
                    <button
                      onClick={() => setMobileTab('scenes')}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        background: 'transparent', border: 'none',
                        color: SEMANTIC.textFaint, fontSize: '0.78rem', cursor: 'pointer',
                        padding: '0 0 12px', fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M15 18l-6-6 6-6" />
                      </svg>
                      {language === 'tr' ? 'Sahnelere dön' : 'Back to scenes'}
                    </button>
                  )}
                  {selectedScene && (() => {
                    // #197 (2026-07-16) — Bookmark scene
                    const bookmarkItem = {
                      id: `atlas-kissa-scene:${prophet.id}:${selectedScene.id}`,
                      type: 'atlas-kissa-scene',
                      title: language === 'tr' ? selectedScene.titleTr : selectedScene.titleEn,
                      subtitle: language === 'tr' ? prophet.nameTr : prophet.nameEn,
                      description: (language === 'tr' ? selectedScene.descTr : selectedScene.descEn)?.slice(0, 240) || '',
                      url: `/${language}/atlas/kissa`,
                    };
                    return (
                      <div>
                        {/* Scene header */}
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '10px' }}>
                          <span style={{
                            flexShrink: 0, width: '28px', height: '28px',
                            borderRadius: RADIUS.full, background: prophet.color,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: COLORS.cosmicBlack, fontSize: '0.75rem', fontWeight: 700,
                          }}>
                            {selectedScene.order}
                          </span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <h4 style={{ color: prophet.color, fontSize: '0.95rem', fontWeight: 700, margin: '0 0 2px' }}>
                              {language === 'tr' ? selectedScene.titleTr : selectedScene.titleEn}
                            </h4>
                            <span style={{ color: SEMANTIC.textFaint, fontSize: '0.75rem' }}>{selectedScene.verseRef}</span>
                          </div>
                          <BookmarkButton item={bookmarkItem} size="sm" language={language} />
                        </div>

                        {/* Description */}
                        <p style={{ color: COLORS.silver, fontSize: '0.84rem', lineHeight: 1.7, margin: '0 0 12px' }}>
                          {language === 'tr' ? selectedScene.descTr : selectedScene.descEn}
                        </p>

                        {/* Surah badges — clickable, show verse range for primary surah */}
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                          <span style={{ color: SEMANTIC.textFaint, fontSize: '0.72rem', alignSelf: 'center' }}>
                            {language === 'tr' ? 'Sûreler:' : 'Surahs:'}
                          </span>
                          {selectedScene.surahs.map(s => {
                            const refStr = selectedScene.surahRefs?.[String(s)];
                            const refParsed = refStr ? parseVerseRef(refStr.replace(/-/g, '–')) : null;
                            const isActive = versePeek?.surah === s && refParsed && versePeek?.start === refParsed.start;
                            const surahName = language === 'tr' ? SURAH_NAMES_TR[s] : SURAH_NAMES_EN[s];
                            const rangeLabel = refParsed
                              ? (refParsed.start === refParsed.end ? `${refParsed.start}` : `${refParsed.start}–${refParsed.end}`)
                              : null;
                            const hasRef = !!refParsed;
                            return (
                              <button
                                key={s}
                                onClick={() => {
                                  if (hasRef && refParsed) {
                                    openVersePeek(refParsed.surah, refParsed.start, refParsed.end);
                                  } else {
                                    setSelectedSurah(s === selectedSurah ? null : s);
                                    setSelectedSceneId(null);
                                    setVersePeek(null);
                                  }
                                }}
                                style={{
                                  padding: '4px 10px',
                                  background: isActive ? `${prophet.color}30` : `${prophet.color}18`,
                                  border: `1px solid ${isActive ? prophet.color : prophet.color + '50'}`,
                                  borderRadius: RADIUS.pillSm,
                                  color: prophet.color, fontSize: '0.78rem', fontWeight: 600,
                                  cursor: 'pointer', transition: `all ${TRANSITION.fast}`,
                                  fontFamily: "'Inter', sans-serif",
                                  display: 'flex', alignItems: 'center', gap: '5px',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = `${prophet.color}28`; }}
                                onMouseLeave={e => { e.currentTarget.style.background = isActive ? `${prophet.color}30` : `${prophet.color}18`; }}
                              >
                                <span>{surahName}</span>
                                {/* K7 (2026-08-14) — opacity:0.7 kaldırıldı, aynı sebep:
                                    ebeveyn rengi (prophet.color) zaten opak, 0.7 ile
                                    çarpılınca bazı peygamber renklerinde AA altına düşüyordu. */}
                                {rangeLabel && (
                                  <span style={{ fontSize: '0.7rem' }}>{rangeLabel}</span>
                                )}
                                {hasRef && (
                                  <svg aria-hidden="true" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ opacity: 0.6, transform: isActive ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                                    <path d="M6 9l6 6 6-6" />
                                  </svg>
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {/* Verse peek panel */}
                        <AnimatePresence>
                          {versePeek && selectedScene.surahs.includes(versePeek.surah) && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.25 }}
                              style={{ overflow: 'hidden' }}
                            >
                              <div style={{
                                marginTop: '8px',
                                padding: '12px 14px',
                                background: 'rgba(0,0,0,0.3)',
                                border: `1px solid ${prophet.color}25`,
                                borderRadius: RADIUS.chip,
                              }}>
                                {versePeek.loading ? (
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: SEMANTIC.textFaint, fontSize: '0.8rem' }}>
                                    <div style={{ width: '16px', height: '16px', border: `2px solid ${COLORS.goldAlpha20}`, borderTopColor: COLORS.gold, borderRadius: RADIUS.full, animation: 'spin 0.8s linear infinite', flexShrink: 0 }} />
                                    {language === 'tr' ? 'Ayetler yükleniyor…' : 'Loading verses…'}
                                  </div>
                                ) : versePeek.verses?.length === 0 ? (
                                  <p style={{ color: SEMANTIC.textFaint, fontSize: '0.8rem', margin: 0 }}>
                                    {language === 'tr' ? 'Ayet yüklenemedi.' : 'Could not load verses.'}
                                  </p>
                                ) : (
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                                    {versePeek.verses?.map((v, idx) => (
                                      <div key={v.num} style={{
                                        padding: '16px 0',
                                        borderBottom: idx < versePeek.verses.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none',
                                      }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                                          <span style={{
                                            width: '22px', height: '22px', borderRadius: RADIUS.full, flexShrink: 0,
                                            background: `${prophet.color}20`, color: prophet.color,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '0.62rem', fontWeight: 700,
                                          }}>{v.num}</span>
                                          <span style={{ color: SEMANTIC.textFaint, fontSize: '0.68rem' }}>
                                            {language === 'tr' ? SURAH_NAMES_TR[versePeek.surah] : SURAH_NAMES_EN[versePeek.surah]} {versePeek.surah}:{v.num}
                                          </span>
                                        </div>
                                        <p style={{
                                          fontFamily: FONTS.quran,
                                          fontSize: 'clamp(1.25rem, 2vw, 1.4rem)', lineHeight: 2.1, direction: 'rtl',
                                          color: COLORS.gold, margin: '0 0 8px', textAlign: 'right',
                                        }}>{cleanArabic(v.arabic)}</p>
                                        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.8rem', lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>
                                          {v.turkish}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                {/* B4: Atlas → Oku moduna köprü (GPT-5.2 review) */}
                                {!versePeek.loading && versePeek.verses?.length > 0 && (
                                  <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: `1px solid ${prophet.color}22`, display: 'flex' }}>
                                    <Link
                                      href={`/${language}/oku/${versePeek.surah}`}
                                      style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '7px',
                                        color: prophet.color, fontSize: '0.78rem', fontWeight: 600,
                                        textDecoration: 'none', fontFamily: "'Inter', sans-serif",
                                      }}
                                    >
                                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                                      </svg>
                                      {language === 'tr' ? 'Bu sûreyi Oku modunda aç (tam metin + tefsir)' : 'Open this surah in Reading Mode (full text + tafsir)'}
                                      <span style={{ fontSize: '0.9rem' }}>→</span>
                                    </Link>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })()}

                  {selectedSurah && !selectedScene && (() => {
                    const scenes = scenesForSurah(selectedSurah);
                    return (
                      <div>
                        <h4 style={{ color: prophet.color, fontSize: '0.95rem', fontWeight: 700, margin: '0 0 10px' }}>
                          {language === 'tr' ? SURAH_NAMES_TR[selectedSurah] : SURAH_NAMES_EN[selectedSurah]}
                          <span style={{ color: SEMANTIC.textFaint, fontWeight: 400, fontSize: '0.82rem', marginLeft: '8px' }}>
                            ({selectedSurah}. Sûre)
                          </span>
                        </h4>
                        {scenes.length === 0 ? (
                          <p style={{ color: SEMANTIC.textFaint, fontSize: '0.82rem', margin: 0 }}>
                            {language === 'tr' ? 'Bu sûrede bu peygambere ait sahne yok.' : 'No scenes of this prophet in this surah.'}
                          </p>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {scenes.map(s => (
                              <button
                                key={s.id}
                                onClick={() => { setSelectedSceneId(s.id); setSelectedSurah(null); }}
                                style={{
                                  textAlign: 'left', padding: '8px 12px',
                                  background: 'rgba(255,255,255,0.04)',
                                  border: `1px solid ${prophet.color}25`,
                                  borderRadius: RADIUS.md, cursor: 'pointer',
                                  display: 'flex', alignItems: 'center', gap: '10px',
                                  transition: 'background 0.15s', fontFamily: "'Inter', sans-serif",
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = `${prophet.color}14`; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                              >
                                <span style={{
                                  width: '20px', height: '20px', borderRadius: RADIUS.full,
                                  background: `${prophet.color}25`, color: prophet.color,
                                  fontSize: '0.68rem', fontWeight: 700,
                                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                }}>
                                  {s.order}
                                </span>
                                <span style={{ color: '#cbd5e1', fontSize: '0.82rem', fontWeight: 500 }}>
                                  {language === 'tr' ? s.titleTr : s.titleEn}
                                </span>
                                <span style={{ color: SEMANTIC.textFaint, fontSize: '0.72rem', marginLeft: 'auto' }}>
                                  {s.verseRef}
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── LEGEND ─────────────────────────────────────────────────── */}
      {!isMobile && <div style={{
        display: 'flex', gap: '16px', alignItems: 'center',
        padding: '8px 20px',
        borderTop: `1px solid ${COLORS.glassBg}`,
        flexShrink: 0, flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: `${prophet.color}35`, border: `1.5px solid ${prophet.color}` }} />
          <span style={{ color: SEMANTIC.textFaint, fontSize: '0.72rem' }}>{language === 'tr' ? 'Seçili sahnede' : 'In selected scene'}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: `${prophet.color}12`, border: `1px solid ${prophet.color}30` }} />
          <span style={{ color: SEMANTIC.textFaint, fontSize: '0.72rem' }}>{language === 'tr' ? 'Kıssası var' : 'Has narrative'}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'rgba(255,255,255,0.03)', border: `1px solid ${COLORS.glassBg}` }} />
          <span style={{ color: SEMANTIC.textFaint, fontSize: '0.72rem' }}>{language === 'tr' ? 'Kıssa yok' : 'No narrative'}</span>
        </div>
        <span style={{ color: SEMANTIC.textFaint, fontSize: '0.72rem', marginLeft: 'auto' }}>
          {language === 'tr' ? 'Sayı = o sûredeki sahne sayısı' : 'Number = scenes in that surah'}
        </span>
      </div>}

      {SOURCES}
      {RELATED_CTA}
    </div>
  );
}
