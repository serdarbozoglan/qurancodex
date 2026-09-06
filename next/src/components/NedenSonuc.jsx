'use client';

// ─── NedenSonuc — Neden → Sonuç Atlası ──────────────────────────────────────
// #208 (2026-07-19) — Kur'ânî neden-sonuç zincirleri (Sünnetullah uzantısı).
// "Kim X yaparsa Y olur" — nefsî / toplumsal / kozmik 3 katman.
// Her zincir 3-5 halka + Kur'ânî ayet ankraj.
// ────────────────────────────────────────────────────────────────────────────

import { Fragment, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS, BREAKPOINT_MOBILE } from '../tokens';
import ToolHeader from './ToolHeader';
import CrossToolCTA from './CrossToolCTA';
import SourcesCitation from './SourcesCitation';
import BookmarkButton from './BookmarkButton';
import useNavbarOffset from './useNavbarOffset';
// 2026-08-14 (Z3f2) — fetch yerine static import: SSR "Yükleniyor" iskeleti
// döndürüyordu, JS başarısız olursa sayfa boş kalıyordu.
import nedenSonucDataStatic from '../../public/neden-sonuc.json';

// ── SURAH NAMES — ayet referansları "2:153" değil "Bakara 2:153" gösterir
// (site-wide kural; KissaAtlas.jsx/SurahComparator.jsx'teki kısa-ad
// listesiyle aynı, tutarlılık için). ─────────────────────────────────────────
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

// "2:153" → "Bakara 2:153" · "26:63-68" → "Şu'arâ 26:63-68"
function formatVerseRef(ref, tr) {
  if (!ref) return ref;
  const [surahStr] = ref.split(':');
  const surahNum = parseInt(surahStr, 10);
  const name = tr ? SURAH_NAMES_TR[surahNum] : SURAH_NAMES_EN[surahNum];
  return name ? `${name} ${ref}` : ref;
}

// Kategori ikonları — kolaps hâlde bile kartlar tek bakışta ayırt edilsin.
function CategoryIcon({ id, color, size = 15 }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };
  if (id === 'nefs') return (
    <svg {...common}><path d="M12 21c-4-3.2-8-6.4-8-11a5 5 0 0 1 8-4 5 5 0 0 1 8 4c0 4.6-4 7.8-8 11z" /></svg>
  );
  if (id === 'toplum') return (
    <svg {...common}><circle cx="9" cy="8" r="3" /><circle cx="17" cy="8" r="2.6" /><path d="M3 20c0-3 2.7-5 6-5s6 2 6 5" /><path d="M15.5 15.2c2.6.4 4.5 2.1 4.5 4.8" /></svg>
  );
  return (
    <svg {...common}><circle cx="12" cy="12" r="3" /><ellipse cx="12" cy="12" rx="9" ry="3.5" /><ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(60 12 12)" /></svg>
  );
}

export default function NedenSonuc() {
  const { language } = useLanguage();
  const tr = language === 'tr';
  // paddingTop: `${navTop}px` hardcode idi — gerçek navbar yüksekliği 62'den farklı
  // olabiliyor (§13.13/§13.31 Mekanizma 2), dinamik ölçüme geçildi.
  const navTop = useNavbarOffset(0, 62);
  const [data] = useState(nedenSonucDataStatic);
  const [activeCat, setActiveCat] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < BREAKPOINT_MOBILE);
    const h = () => setIsMobile(window.innerWidth < BREAKPOINT_MOBILE);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  const TOOL_HEADER = (
    <ToolHeader
      icon={
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="6" cy="6" r="3" />
          <circle cx="18" cy="18" r="3" />
          <path d="M8.5 8.5l7 7" />
          <path d="M12 3l0 3" opacity="0.4" />
          <path d="M21 12l-3 0" opacity="0.4" />
        </svg>
      }
      titleTr="Neden → Sonuç Atlası"
      titleEn="Cause → Effect Atlas"
      subtitleTr="Kur'ânî ahlâki + kozmik zincirler"
      subtitleEn="Quranic ethical + cosmic chains"
      language={language}
    />
  );

  const RELATED_CTA = (
    <div className="zf2-tool-cta-wrap" style={{ maxWidth: 1080, margin: '0 auto', width: '100%' }}>
      <CrossToolCTA
        language={language}
        isMobile={isMobile}
        links={[
          { href: `/${language}/atlas/sunnetullah`, titleTr: 'Sünnetullah Atlası', titleEn: 'Sunnatullāh Atlas', descTr: 'Bu zincirlerin kozmik yasa katmanı: ilâhî örüntü prensibi.', descEn: 'The cosmic-law layer of these chains: the divine pattern principle.' },
          { href: `/${language}/atlas/kavim`, titleTr: 'Kavimler Atlası', titleEn: 'Nations Atlas', descTr: '"Zulüm → helâk" zincirinin somut tarihsel kayıtları.', descEn: 'Concrete historical records of the "injustice → destruction" chain.' },
          { href: `/${language}/graf/kavram`, titleTr: 'Kavram Ağı', titleEn: 'Concept Network', descTr: 'Sabır, şükür, adalet, mîzân: zincirdeki kavramların bağlantı haritası.', descEn: 'Ṣabr, shukr, ʿadl, mīzān: a connection map of the concepts in these chains.' },
        ]}
      />
    </div>
  );

  if (!data) {
    return (
      <div style={{
        background: COLORS.cosmicBlack,
        minHeight: `calc(100vh - ${navTop}px)`,
        display: 'flex', flexDirection: 'column',
        paddingTop: `${navTop}px`,
      }}>
        {TOOL_HEADER}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: COLORS.silver, fontSize: '0.9rem', fontFamily: FONTS.body }}>
            {tr ? 'Yükleniyor…' : 'Loading…'}
          </span>
        </div>
        {RELATED_CTA}
      </div>
    );
  }

  const categories = data.categories || [];
  const chains = data.chains || [];
  const filteredChains = activeCat === 'all'
    ? chains
    : chains.filter(c => c.category === activeCat);
  const catMap = Object.fromEntries(categories.map(c => [c.id, c]));

  return (
    <div style={{
      background: COLORS.cosmicBlack,
      minHeight: `calc(100vh - ${navTop}px)`,
      paddingTop: `${navTop}px`,
    }}>
      {TOOL_HEADER}

      <div className="zf2-tool-hero-wrap" style={{ maxWidth: 1080, margin: '0 auto' }}>

        {/* Framing — önceden düz bir kutuda tek paragraftı; sayfanın kendi
            teziyle ("kim X yaparsa Y olur") ve üç katmanıyla (nefsî /
            toplumsal / kozmik) görsel olarak hiç konuşmuyordu. */}
        <div className="zf2-tool-hero-card" style={{
          position: 'relative',
          overflow: 'hidden',
          background: `linear-gradient(180deg, ${COLORS.gold}0d 0%, transparent 100%)`,
          border: `1px solid ${COLORS.gold}22`,
          borderRadius: 14,
          marginBottom: 40,
        }}>
          {/* Dev, çok soluk arkaplan oku — sayfanın "akış" temasının imzası */}
          <svg aria-hidden="true" width="220" height="220" viewBox="0 0 24 24" fill="none"
            stroke={COLORS.gold} strokeWidth="1"
            style={{ position: 'absolute', top: '50%', right: -50, transform: 'translateY(-50%)', opacity: 0.06, pointerEvents: 'none' }}
          >
            <path d="M4 12h16M13 5l7 7-7 7" />
          </svg>

          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="6" cy="6" r="3" /><circle cx="18" cy="18" r="3" /><path d="M8.5 8.5l7 7" />
            </svg>
            <div style={{
              fontSize: '0.68rem',
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: COLORS.gold,
              fontWeight: 700,
              opacity: 0.8,
              fontFamily: FONTS.body,
            }}>
              {tr ? 'Kur\'ânî Prensip' : 'Quranic Principle'}
            </div>
          </div>

          {/* Tez — sayfanın tek cümlelik iddiası, büyük ve ayrı */}
          <p className="mq-fs" style={{
            position: 'relative',
            fontFamily: FONTS.display,
            '--fs-d': '1.7rem', '--fs-m': '1.3rem',
            fontWeight: 700,
            fontStyle: 'italic',
            lineHeight: 1.4,
            color: COLORS.offWhite,
            margin: '0 0 6px',
            maxWidth: 640,
          }}>
            {tr ? '“kim X yaparsa Y olur.”' : '“whoever does X, Y follows.”'}
          </p>
          <p style={{
            fontFamily: FONTS.body,
            fontSize: '0.76rem',
            letterSpacing: '0.04em',
            color: COLORS.gold,
            opacity: 0.75,
            margin: '0 0 20px',
          }}>
            {tr ? '— sünnetullah, Kur\'ân\'ın kozmik yasası' : '— sunnatullah, the Quran\'s cosmic law'}
          </p>

          <p className="mq-fs" style={{
            position: 'relative',
            fontFamily: FONTS.body,
            '--fs-d': '0.92rem', '--fs-m': '0.88rem',
            lineHeight: 1.75,
            color: COLORS.silver,
            margin: '0 0 20px',
            maxWidth: 680,
          }}>
            {tr ? data.meta.principleTr : data.meta.principleEn}
          </p>

          {/* Üç katman önizlemesi — filtre çipleriyle aynı bilgiyi
              taşımanın ötesinde, hero'yu sayfanın taksonomisine bağlar */}
          <div style={{ position: 'relative', display: 'flex', gap: isMobile ? 14 : 24, flexWrap: 'wrap', paddingTop: 16, borderTop: `1px solid ${COLORS.gold}18` }}>
            {(data.categories || []).map(cat => (
              <div key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <CategoryIcon id={cat.id} color={cat.color} size={15} />
                <span style={{ fontSize: '0.78rem', color: COLORS.silver, fontWeight: 600 }}>
                  {tr ? cat.tr : cat.en}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Category filter */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          marginBottom: 32,
        }}>
          <FilterChip
            active={activeCat === 'all'}
            onClick={() => setActiveCat('all')}
            color={COLORS.gold}
          >
            {tr ? 'Tümü' : 'All'} · {chains.length}
          </FilterChip>
          {categories.map(cat => {
            const count = chains.filter(c => c.category === cat.id).length;
            return (
              <FilterChip
                key={cat.id}
                active={activeCat === cat.id}
                onClick={() => setActiveCat(cat.id)}
                color={cat.color}
                icon={<CategoryIcon id={cat.id} color={activeCat === cat.id ? cat.color : COLORS.silver} size={13} />}
              >
                {tr ? cat.tr : cat.en} · {count}
              </FilterChip>
            );
          })}
        </div>

        {/* Chain grid — masaüstünde 2 sütun (10 kartlık tek-sütun liste çok
            uzun kaydırma + tekdüze görünüm üretiyordu); açılan kart tam
            genişliğe yayılıyor (grid-column: 1/-1). */}
        <div className="ns-chain-grid" style={{ display: 'grid', gap: 14 }}>
          {filteredChains.map(chain => (
            <ChainCard
              key={chain.id}
              chain={chain}
              tr={tr}
              language={language}
              isMobile={isMobile}
              cat={catMap[chain.category]}
              expanded={expandedId === chain.id}
              onToggle={() => setExpandedId(expandedId === chain.id ? null : chain.id)}
            />
          ))}
        </div>
      </div>

      {/* Sayfa-genel kaynak */}
      <div className="zf2-tool-body-wrap" style={{ maxWidth: 1080, margin: '0 auto' }}>
        <SourcesCitation
          language={language}
          isMobile={isMobile}
          sources={[
            {
              author: 'er-Râzî',
              workTr: "Mefâtîhu\'l-Ğayb",
              workEn: 'Mafātīḥ al-Ghayb',
              period: '1149–1209 (Rey)',
              noteTr: "Kur'ânî neden-sonuç zincirlerinin kelâmî çerçevesi; 'sünnetullah' bahsi ve ahlâki-teolojik zincirler.",
              noteEn: "The theological frame of Quranic cause-effect chains; the 'sunnatullāh' discussion and ethical-theological linkages.",
            },
            {
              author: 'İbn Kayyim el-Cevziyye',
              workTr: "Medâricü\'s-Sâlikîn",
              workEn: 'Madārij al-Sālikīn',
              period: '1292–1350',
              noteTr: "Nefsî zincirlerin (sabır, şükür, tövbe, kibir) tasavvuf perspektifinden derin analizi.",
              noteEn: 'Deep analysis of inner chains (patience, gratitude, repentance, arrogance) from the Sufi perspective.',
            },
            {
              author: 'Muhammed Bâkır es-Sadr',
              workTr: "es-Sünenü't-Târîhiyye fi'l-Kur'ân",
              workEn: 'al-Sunan al-Tarikhiyya fi\'l-Qur\'an',
              period: '1935–1980 (Necef)',
              noteTr: 'Toplumsal + tarihsel zincirlerin modern Kur\'ânî sosyoloji çerçevesinden okunması.',
              noteEn: 'Reading of social + historical chains from a modern Quranic-sociology framework.',
            },
            {
              author: 'Seyyid Hüseyin Nasr',
              workTr: 'İnsan ve Doğa',
              workEn: 'Man and Nature',
              period: '1968',
              noteTr: 'Rûm 30:41 çevresel ifsat zinciri için modern çevre-teolojik referans.',
              noteEn: 'Modern environmental-theological reference for the Rūm 30:41 corruption chain.',
            },
          ]}
        />
      </div>

      {RELATED_CTA}
    </div>
  );
}

// ─── FilterChip ─────────────────────────────────────────────────────────────
function FilterChip({ active, onClick, color, icon, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 7,
        padding: '7px 14px',
        borderRadius: 999,
        border: `1px solid ${active ? `${color}88` : 'rgba(255,255,255,0.1)'}`,
        background: active ? `${color}22` : 'rgba(255,255,255,0.03)',
        color: active ? color : COLORS.silver,
        fontFamily: FONTS.body,
        fontSize: '0.78rem',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.15s',
      }}
    >
      {icon}
      {children}
    </button>
  );
}

// ─── ChainCard — expandable chain with step-by-step visualization ───────────
function ChainCard({ chain, tr, language, isMobile, cat, expanded, onToggle }) {
  const title = tr ? chain.titleTr : chain.titleEn;
  const short = tr ? chain.shortTr : chain.shortEn;
  const catColor = cat?.color || COLORS.gold;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="zf2-tool-chain-card"
      style={{
        position: 'relative',
        gridColumn: expanded ? '1 / -1' : 'auto',
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${expanded ? `${catColor}55` : 'rgba(255,255,255,0.08)'}`,
        borderRadius: 14,
        transition: 'border-color 0.2s',
      }}
    >
      {/* Bookmark */}
      <div
        style={{ position: 'absolute', top: 14, right: 14 }}
        onClick={e => e.stopPropagation()}
      >
        <BookmarkButton
          item={{
            id: `neden-sonuc:${chain.id}`,
            type: 'neden-sonuc',
            title,
            subtitle: tr ? cat?.tr : cat?.en,
            description: short.slice(0, 240),
            url: `/${language}/arac/neden-sonuc#${chain.id}`,
          }}
          size="sm"
          language={language}
        />
      </div>

      <button
        onClick={onToggle}
        aria-expanded={expanded}
        style={{
          all: 'unset', boxSizing: 'border-box',
          cursor: 'pointer',
          display: 'block',
          width: '100%',
          paddingRight: 40,
        }}
      >
        {/* Category chip */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '3px 10px 3px 8px',
          borderRadius: 4,
          background: `${catColor}22`,
          color: catColor,
          fontSize: '0.66rem',
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          marginBottom: 10,
        }}>
          <CategoryIcon id={cat?.id} color={catColor} size={12} />
          {tr ? cat?.tr : cat?.en}
        </div>

        <h3 className="mq-fs" style={{
          fontFamily: FONTS.display,
          '--fs-d': '1.2rem', '--fs-m': '1.05rem',
          fontWeight: 700,
          color: COLORS.offWhite,
          margin: '0 0 12px',
          lineHeight: 1.35,
        }}>
          {title}
        </h3>

        {/* Kolaps hâlde bile zincirin ŞEKLİNİ göster — önceden her kart
            (kategori rengi hariç) birbirinin aynısı görünüyordu. */}
        {!expanded && (
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '4px', marginBottom: 12 }}>
            {chain.steps.map((step, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <span
                  title={(tr ? step.stepTr : step.stepEn).split(/[—(]/)[0].trim()}
                  style={{
                    padding: '3px 9px', borderRadius: 999,
                    background: `${catColor}14`, border: `1px solid ${catColor}30`,
                    color: catColor, fontSize: '0.7rem', fontWeight: 600,
                    maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                  {(tr ? step.stepTr : step.stepEn).split(/[—(]/)[0].trim()}
                </span>
                {i < chain.steps.length - 1 && (
                  <span style={{ color: catColor, opacity: 0.5, fontSize: '0.75rem' }}>→</span>
                )}
              </span>
            ))}
          </div>
        )}

        <p className="mq-fs" style={{
          fontFamily: FONTS.body,
          '--fs-d': '0.92rem', '--fs-m': '0.88rem',
          lineHeight: 1.7,
          color: COLORS.silver,
          margin: 0,
          opacity: 0.9,
        }}>
          {short}
        </p>

        <div style={{
          marginTop: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          color: catColor,
          fontSize: '0.72rem',
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}>
          <span>{expanded ? (tr ? 'Kapat' : 'Close') : (tr ? 'Zinciri Aç' : 'Open the Chain')}</span>
          <span style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▾</span>
        </div>
      </button>

      {/* Expanded — step visualization */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              marginTop: 20,
              paddingTop: 20,
              borderTop: `1px solid ${catColor}22`,
            }}>
              {/* Step chain — masaüstünde gerçek soldan-sağa akış diyagramı.
                  ÖNEMLİ FARK: her ok artık BOŞ değil — hangi adımın bir
                  sonrakine NEDEN yol açtığını açıklayan kısa bir gerekçe
                  taşıyor (chain.note'un içinde zaten vardı ama tek bir
                  paragrafa gömülüydü, hangi geçişi açıkladığı belirsizdi;
                  şimdi ait olduğu oka bağlı). Sonuç halkası ayrı bir
                  rozetle ("SONUÇ") ve daha güçlü zeminle ayrılır. Mobilde
                  tek sütun olarak kalır. */}
              <div style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: 'stretch',
                gap: isMobile ? 0 : 0,
                marginBottom: 24,
              }}>
                {chain.steps.map((step, i) => {
                  const isLast = i === chain.steps.length - 1;
                  return (
                    <Fragment key={i}>
                      <div style={{
                        flex: isMobile ? 'none' : '1 1 0',
                        minWidth: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 8,
                        padding: '14px',
                        background: isLast ? `${catColor}1c` : `${catColor}0a`,
                        border: `1px solid ${isLast ? `${catColor}60` : `${catColor}22`}`,
                        borderRadius: 10,
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            background: isLast ? catColor : `${catColor}33`,
                            color: isLast ? COLORS.cosmicBlack : catColor,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.74rem',
                            fontWeight: 800,
                            flexShrink: 0,
                          }}>
                            {isLast ? '✓' : i + 1}
                          </div>
                          {isLast && (
                            <span style={{
                              fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.12em',
                              textTransform: 'uppercase', color: catColor,
                            }}>
                              {tr ? 'Sonuç' : 'Outcome'}
                            </span>
                          )}
                        </div>
                        <p className="mq-fs" style={{
                          fontFamily: FONTS.body,
                          '--fs-d': '0.88rem', '--fs-m': '0.9rem',
                          lineHeight: 1.5,
                          fontWeight: isLast ? 700 : 400,
                          color: COLORS.offWhite,
                          margin: 0,
                        }}>
                          {tr ? step.stepTr : step.stepEn}
                        </p>
                        {step.verse && (
                          <Link
                            href={`/${language}/ayet/${step.verse.split(':')[0]}/${step.verse.split(':')[1]?.split('-')[0] || '1'}`}
                            style={{
                              alignSelf: 'flex-start',
                              padding: '2px 8px',
                              borderRadius: 4,
                              background: `${COLORS.gold}18`,
                              color: COLORS.gold,
                              fontSize: '0.7rem',
                              fontWeight: 600,
                              textDecoration: 'none',
                            }}
                          >
                            {formatVerseRef(step.verse, tr)}
                          </Link>
                        )}
                      </div>
                      {!isLast && (() => {
                        const nextStep = chain.steps[i + 1];
                        const why = nextStep && (tr ? nextStep.whyTr : nextStep.whyEn);
                        return (
                          <div className="mq-box" style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center', justifyContent: 'center',
                            gap: 4,
                            flexShrink: 0,
                            width: isMobile ? '100%' : 132,
                            '--pt-d': "10px", '--pt-m': "8px", '--pr-d': "8px", '--pr-m': "20px", '--pb-d': "10px", '--pb-m': "8px", '--pl-d': "8px", '--pl-m': "20px",
                          }}>
                            <svg aria-hidden="true" width={isMobile ? 14 : 16} height={isMobile ? 14 : 16}
                              viewBox="0 0 24 24" fill="none" stroke={catColor} strokeWidth="2.5"
                              strokeLinecap="round" strokeLinejoin="round"
                              style={{ opacity: 0.85, flexShrink: 0 }}
                            >
                              {isMobile
                                ? <path d="M12 5v14M5 12l7 7 7-7" />
                                : <path d="M5 12h14M13 5l7 7-7 7" />}
                            </svg>
                            {why && (
                              <p style={{
                                margin: 0,
                                fontFamily: FONTS.body,
                                fontSize: '0.68rem',
                                lineHeight: 1.45,
                                color: catColor,
                                opacity: 0.85,
                                textAlign: 'center',
                                fontStyle: 'italic',
                              }}>
                                {why}
                              </p>
                            )}
                          </div>
                        );
                      })()}
                    </Fragment>
                  );
                })}
              </div>

              {/* Note */}
              {chain.note && (
                <p className="mq-fs" style={{
                  fontFamily: FONTS.body,
                  '--fs-d': '0.88rem', '--fs-m': '0.85rem',
                  lineHeight: 1.75,
                  color: COLORS.silver,
                  margin: '0 0 18px',
                  opacity: 0.88,
                  fontStyle: 'italic',
                  padding: '12px 16px',
                  borderLeft: `2px solid ${catColor}44`,
                }}>
                  {chain.note}
                </p>
              )}

              {/* All verses */}
              {chain.verses && chain.verses.length > 0 && (
                <div>
                  <div style={{
                    fontSize: '0.62rem',
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: COLORS.silver,
                    opacity: 0.78,
                    fontWeight: 700,
                    marginBottom: 8,
                  }}>
                    {tr ? 'İlişkili Ayetler' : 'Related Verses'}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {chain.verses.map((v, i) => (
                      <Link
                        key={i}
                        href={`/${language}/ayet/${v.split(':')[0]}/${v.split(':')[1]?.split('-')[0] || '1'}`}
                        style={{
                          padding: '4px 10px',
                          borderRadius: 4,
                          background: `${COLORS.gold}18`,
                          color: COLORS.gold,
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          textDecoration: 'none',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = `${COLORS.gold}33`; }}
                        onMouseLeave={e => { e.currentTarget.style.background = `${COLORS.gold}18`; }}
                      >
                        {formatVerseRef(v, tr)}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
