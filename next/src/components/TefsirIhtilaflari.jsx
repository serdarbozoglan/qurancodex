'use client';

// ─── TefsirIhtilaflari — Klasik Tefsirde Mesel İhtilafları ──────────────────
// 2026-08-15 — Yedi klasik/modern müfessirin Kur'ân mesellerindeki (benzetme
// ayetleri) yorum ayrılıklarını, isimli alıntılarla karşılaştırır. Her alıntı
// yayına girmeden önce birincil kaynaktan (tafsir.app, sunnah.com) bağımsız
// doğrulandı; doğrulanamayan iddialar kapsam dışı bırakıldı (§13.30).
//
// 2026-09-14 — Sayfa İngilizceye açıldı: 190 Türkçe alana karşı yalnız 33
// İngilizce alan vardı, yani İngilizce okur sekme değiştirdikçe Türkçe klasik
// tefsir nesriyle karşılaşıyordu. Eksik 157 alan yazıldı ve gpt-6-astra hakem
// turundan geçirildi; 19 bulgunun 18'i uygulandı, çoğu Türkçe asılda da
// düzeltildi (muzâf hazfi terimi, Buhârî 4698'de susma gerekçesi, Buhârî 4538
// isnad kolunun tekilliği, Tirmizî-Enes'in ayrı rivayet olması, "üzerine
// gitmek" = إن تحمل عليه, Râzî'nin Zemahşerî'yi alıntılamasının bağımsız teyit
// sayılamayacağı).
//
// UYGULANMAYAN TEK BULGU ve gerekçesi: hakem, Zemahşerî'nin muzâf hazfi
// okumasını Mu'tezilî tenzih kaygısıyla ilişkilendiren bir açıklama istedi.
// O gerekçe elde DOĞRULANMIŞ bir kaynakla desteklenmiyor ve önceki turlarda
// tam bu tür kaynaksız saik atıfları eleştirilmişti. Not artık yalnız gramer
// hamlesini betimliyor (düşürülmüş muzâf takdiri); saik iddiası UYDURULMADI.
// Eklenecekse el-Keşşâf'ın ilgili pasajından birincil doğrulamayla girer.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import { tabIcon } from './tabIcons';
import { COLORS, FONTS, BREAKPOINT_MOBILE, CATEGORY, SEMANTIC } from '../tokens';
import ToolHeader from './ToolHeader';
import { ToolTabGlow } from './ToolTabGlow';
import CollapsibleHero from './CollapsibleHero';
import useNavbarOffset from './useNavbarOffset';
import useTabParam from '../hooks/useTabParam';
import CrossToolCTA from './CrossToolCTA';
import BookmarkButton from './BookmarkButton';
import tefsirDataStatic from '../../public/tefsir-ihtilaf.json';
import { cleanArabicForDisplay } from '../lib/arabic';

// Hero anchor — Âl-i İmrân 3:7 (muhkem/müteşabih), verse-graph-bgem3.json'dan
// birebir alınmıştır (site denetimi, 16 Ağustos 2026 — hero eklenirken elle
// yazılan ilk taslak kaynak metinle birebir eşleşmiyordu, düzeltildi).
const ANCHOR_3_7_ARABIC_RAW = 'هُوَ الَّـذ۪ٓي اَنْزَلَ عَلَيْكَ الْكِتَابَ مِنْهُ اٰيَاتٌ مُحْكَمَاتٌ هُنَّ اُمُّ الْكِتَابِ وَاُخَرُ مُتَشَابِهَاتٌۜ فَاَمَّا الَّذ۪ينَ ف۪ي قُلُوبِهِمْ زَيْغٌ فَيَتَّبِعُونَ مَا تَشَابَهَ مِنْهُ ابْتِغَٓاءَ الْفِتْنَةِ وَابْتِغَٓاءَ تَأْو۪يلِه۪ۚ وَمَا يَعْلَمُ تَأْو۪يلَهُٓ اِلَّا اللّٰهُۢ وَالرَّاسِخُونَ فِي الْعِلْمِ يَقُولُونَ اٰمَنَّا بِه۪ۙ   كُلٌّ مِنْ عِنْدِ رَبِّنَاۚ وَمَا يَذَّكَّرُ اِلَّٓا اُو۬لُوا الْاَلْبَابِ';

const SCHOLAR_COLORS = {
  'taberi':     CATEGORY.blue,
  'zemahseri':  CATEGORY.violet,
  'razi':       COLORS.gold,
  'kurtubi':    CATEGORY.orange,
  'ibn-kesir':  CATEGORY.emerald,
  'ibn-kayyim': CATEGORY.rose,
  'ibn-asur':   CATEGORY.red,
};

// Rozet artık "doğrulandı" (öz-sertifika) demez; alıntının hangi kaynakta
// bulunduğunu söyler ve altındaki künye satırı o kaynağa link verir (§13.35).
const CONFIDENCE_LABELS_TR = { confirmed: 'Kaynakta', partial: 'Kısmen naklen' };
const CONFIDENCE_LABELS_EN = { confirmed: 'In source', partial: 'Partial' };

// ── SURAH NAMES — ayet referansları "24:35" değil "Nûr 24:35" gösterir
// (§13.32 site-wide kural; SebebiNuzul.jsx/KissaAtlas.jsx'teki kısa-ad
// listesiyle aynı). ─────────────────────────────────────────────────────────
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
// Bu sayfanın verisi 2026-09-14'e kadar 190 Türkçe alana karşı yalnız 33
// İngilizce alan taşıyordu: İngilizce okur, sekme değiştirdikçe Türkçe
// klasik tefsir nesriyle karşılaşıyordu. Eksik 157 alan yazıldı; burada
// yalnız SEÇİM yapılır. Arapça alıntılar (quoteAr) dile göre değişmez.
const pick = (obj, base, tr) => (tr ? obj[base + 'Tr'] : (obj[base + 'En'] || obj[base + 'Tr']));

function surahShortName(num) {
  return SURAH_NAMES_TR[num] || String(num);
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setIsMobile(window.innerWidth < BREAKPOINT_MOBILE);
    const h = () => setIsMobile(window.innerWidth < BREAKPOINT_MOBILE);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);
  return isMobile;
}

function ScholarTag({ scholarId, scholars, size = 'md', tr = true }) {
  const s = scholars.find(x => x.id === scholarId);
  if (!s) return null;
  const color = SCHOLAR_COLORS[scholarId] || COLORS.silver;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: size === 'sm' ? '2px 8px' : '3px 10px',
      borderRadius: 99,
      background: `${color}1a`, border: `1px solid ${color}40`,
      color, fontSize: size === 'sm' ? '0.68rem' : '0.74rem',
      fontFamily: FONTS.body, fontWeight: 700, whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0 }} />
      {pick(s, 'name', tr)}
    </span>
  );
}

function PositionBlock({ pos, scholars, tr, isMobile }) {
  const color = SCHOLAR_COLORS[pos.scholarId] || COLORS.silver;
  const confLabel = tr ? CONFIDENCE_LABELS_TR[pos.confidence] : CONFIDENCE_LABELS_EN[pos.confidence];
  return (
    <div className="mq-box" style={{
      '--pt-d': "16px", '--pt-m': "14px", '--pr-d': "18px", '--pr-m': "14px", '--pb-d': "16px", '--pb-m': "14px", '--pl-d': "18px", '--pl-m': "14px",
      background: 'rgba(255,255,255,0.025)',
      border: `1px solid ${color}25`,
      borderLeft: `3px solid ${color}`,
      borderRadius: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
        <ScholarTag scholarId={pos.scholarId} scholars={scholars} tr={tr} />
        {pos.confidence && (
          <span style={{
            fontSize: '0.64rem', fontFamily: FONTS.body, color: COLORS.textFaint || COLORS.silver,  letterSpacing: '0.06em', textTransform: 'uppercase',
          }}>
            {confLabel}
          </span>
        )}
      </div>
      {pos.quoteAr && (
        <p dir="rtl" lang="ar" className="mq-fs" style={{
          fontFamily: FONTS.quran, color: COLORS.gold, '--fs-d': '1.3rem', '--fs-m': '1.15rem',
          textAlign: 'right', lineHeight: 1.9, margin: '0 0 10px',
        }}>
          {pos.quoteAr}
        </p>
      )}
      {pick(pos, 'quote', tr) && (
        <p className="mq-fs" style={{
          fontFamily: FONTS.body, fontStyle: 'italic', color: COLORS.offWhite,
          '--fs-d': '0.9rem', '--fs-m': '0.86rem', lineHeight: 1.7, margin: '0 0 8px',
        }}>
          {pick(pos, 'quote', tr)}
        </p>
      )}
      {(tr ? pos.refTr : pos.refEn) && (
        <p style={{ fontFamily: FONTS.body, fontSize: '0.72rem', color: COLORS.silver, margin: '0 0 6px' }}>
          {pos.refUrl ? (
            <a href={pos.refUrl} target="_blank" rel="noopener noreferrer"
              style={{ color: COLORS.silver, textDecoration: 'none', borderBottom: `1px dotted ${COLORS.silver}66` }}>
              {tr ? pos.refTr : pos.refEn}
              <span aria-hidden="true" style={{ marginInlineStart: 4, opacity: 0.7 }}>↗</span>
            </a>
          ) : (tr ? pos.refTr : pos.refEn)}
        </p>
      )}
      {pick(pos, 'note', tr) && (
        <p className="mq-fs" style={{ fontFamily: FONTS.body, '--fs-d': '0.83rem', '--fs-m': '0.8rem', color: COLORS.silver, lineHeight: 1.6, margin: 0 }}>
          {pick(pos, 'note', tr)}
        </p>
      )}
    </div>
  );
}

function CaseCard({ c, scholars, tr, isMobile, expanded, onToggle, language }) {
  return (
    <motion.div layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
      style={{
        position: 'relative',
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${expanded ? `${COLORS.gold}55` : 'rgba(255,255,255,0.08)'}`,
        borderRadius: 14,
        transition: 'border-color 0.2s',
      }}>
      <div style={{ position: 'absolute', top: 14, right: 14 }} onClick={e => e.stopPropagation()}>
        <BookmarkButton
          item={{
            id: `tefsir-ihtilaf:${c.id}`,
            type: 'tefsir-ihtilaf',
            title: pick(c, 'title', tr),
            subtitle: `${surahShortName(parseInt(c.verseRef.split(':')[0], 10))} ${c.verseRef}`,
            description: (pick(c, 'intro', tr) || '').slice(0, 240),
            url: `/${language}/arac/tefsir-ihtilaflari#${c.id}`,
          }}
          size="sm"
          language={language}
        />
      </div>

      <button onClick={onToggle} aria-expanded={expanded}
        style={{ all: 'unset', boxSizing: 'border-box', cursor: 'pointer', display: 'block', width: '100%', '--pt-d': "20px", '--pt-m': "16px", '--pr-d': "24px", '--pr-m': "16px", '--pb-d': "20px", '--pb-m': "16px", '--pl-d': "24px", '--pl-m': "16px", paddingRight: 44 }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '3px 10px', borderRadius: 99,
          background: COLORS.goldAlpha15, border: `1px solid ${COLORS.goldAlpha25}`,
          color: COLORS.gold, fontSize: '0.72rem', fontFamily: FONTS.body, fontWeight: 700,
          marginBottom: 10,
        }}>
          {surahShortName(parseInt(c.verseRef.split(':')[0], 10))} {c.verseRef}
        </span>
        <h3 className="mq-box mq-fs" style={{
          fontFamily: FONTS.display, '--fs-d': '1.2rem', '--fs-m': '1.05rem', fontWeight: 700,
          color: COLORS.offWhite, margin: '0 0 8px', lineHeight: 1.35,
        }}>
          {pick(c, 'title', tr)}
        </h3>
        {pick(c, 'intro', tr) && (
          <p className="mq-fs" style={{ fontFamily: FONTS.body, '--fs-d': '0.9rem', '--fs-m': '0.86rem', lineHeight: 1.65, color: COLORS.silver, margin: 0 }}>
            {pick(c, 'intro', tr)}
          </p>
        )}
        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 6, color: COLORS.gold, fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          <span>{expanded ? (tr ? 'Kapat' : 'Close') : (tr ? 'Müfessirleri Karşılaştır' : 'Compare Exegetes')}</span>
          <span style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▾</span>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }} style={{ overflow: 'hidden' }}>
            <div className="mq-box" style={{ '--pt-d': "0", '--pt-m': "0", '--pr-d': "24px", '--pr-m': "16px", '--pb-d': "24px", '--pb-m': "16px", '--pl-d': "24px", '--pl-m': "16px", display: 'flex', flexDirection: 'column', gap: 20 }}>
              {(c.axes || []).map((axis, i) => (
                <div key={i} style={{ borderTop: `1px solid ${COLORS.glassBorderSoft}`, paddingTop: 16 }}>
                  <div style={{ fontFamily: FONTS.body, fontSize: '0.8rem', fontWeight: 700, color: COLORS.silver, marginBottom: 12 }}>
                    {pick(axis, 'title', tr)}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {axis.positions.map((pos, j) => (
                      <PositionBlock key={j} pos={pos} scholars={scholars} tr={tr} isMobile={isMobile} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ScholarProfileCard({ s, isMobile, tr }) {
  const color = SCHOLAR_COLORS[s.id] || COLORS.silver;
  return (
    <div className="mq-box" style={{
      '--pt-d': "18px", '--pt-m': "16px", '--pr-d': "20px", '--pr-m': "16px", '--pb-d': "18px", '--pb-m': "16px", '--pl-d': "20px", '--pl-m': "16px",
      background: 'rgba(255,255,255,0.03)', border: `1px solid ${color}30`,
      borderTop: `3px solid ${color}`, borderRadius: 12,
    }}>
      <div style={{ fontFamily: FONTS.display, fontSize: '1rem', fontWeight: 700, color: COLORS.offWhite, marginBottom: 2 }}>
        {pick(s, 'name', tr)}
      </div>
      <div style={{ fontFamily: FONTS.body, fontSize: '0.72rem', color, marginBottom: 10 }}>
        {s.deathH}/{s.deathM} · {pick(s, 'ekol', tr)}
      </div>
      <div style={{ fontFamily: FONTS.body, fontSize: '0.78rem', color: COLORS.silver, fontStyle: 'italic', marginBottom: 12 }}>
        {pick(s, 'eser', tr)}
      </div>
      <div style={{ fontFamily: FONTS.body, fontSize: '0.8rem', color: COLORS.offWhite, lineHeight: 1.6, marginBottom: 10 }}>
        {pick(s, 'hamle', tr)}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: '0.74rem', fontFamily: FONTS.body, lineHeight: 1.5 }}>
        <div style={{ color: CATEGORY.emerald }}>+ {pick(s, 'guc', tr)}</div>
        <div style={{ color: COLORS.silver }}>− {pick(s, 'zayif', tr)}</div>
      </div>
    </div>
  );
}

export default function TefsirIhtilaflari() {
  const { language } = useLanguage();
  const navTop = useNavbarOffset(0, 62);
  const tr = language === 'tr';
  const isMobile = useIsMobile();
  const [data] = useState(tefsirDataStatic);
  const [expandedId, setExpandedId] = useState(null);
  const [activeTab, setActiveTab] = useTabParam(3);

  const TABS_TR = ['Yöntem', 'Vakalar', 'Müfessirler'];
  const TABS_EN = ['Method', 'Cases', 'Exegetes'];
  const tabs = tr ? TABS_TR : TABS_EN;
  const TAB_ICON_NAMES = ['route', 'folder', 'users'];

  const TOOL_HEADER = (
    <ToolHeader
      icon={
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 3v4M16 3v4M3 9h18M5 6h14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1z" />
          <path d="M9 13l1.5 1.5L15 10" />
        </svg>
      }
      titleTr="Tefsir İhtilafları"
      titleEn="Exegetical Disagreements"
      subtitleTr={`${data.cases.length} vaka · 7 müfessir`}
      subtitleEn={`${data.cases.length} cases · 7 exegetes`}
      language={language}
    />
  );

  const RELATED_CTA = (
    <div className="mq-box" style={{ maxWidth: 1080, margin: '0 auto', width: '100%', '--pt-d': "0", '--pt-m': "0", '--pr-d': "24px", '--pr-m': "16px", '--pb-d': "48px", '--pb-m': "32px", '--pl-d': "24px", '--pl-m': "16px" }}>
      <CrossToolCTA
        language={language}
        isMobile={isMobile}
        links={[
          { href: `/${language}/atlas/mesel`, titleTr: 'Meseller Atlası', titleEn: 'Parables Atlas', descTr: 'Kur\'ân\'daki 73 mesel: motif ağı, çift meseller, belâgat yapısı.', descEn: '73 Quranic parables: motif network, paired parables, rhetorical structure.' },
          { href: `/${language}/arac/retorik`, titleTr: 'Kur\'ân Belâgatı', titleEn: 'Quranic Rhetoric', descTr: 'Teşbih, istiâre, temsil: beş büyük belâgat ailesi.', descEn: 'Simile, metaphor, analogy: the five major rhetorical families.' },
          { href: `/${language}/arac/elestirel-cerceve`, titleTr: 'Eleştirel Çerçeve', titleEn: 'Critical Frame', descTr: 'Zorlu sorular ve ulemânın cevabı: itiraz, cevap, netice.', descEn: "Hard questions and the scholars' answers: objection, answer, verdict." },
        ]}
      />
    </div>
  );

  return (
    <div style={{ background: COLORS.cosmicBlack, minHeight: `calc(100vh - ${navTop}px)`, display: 'flex', flexDirection: 'column', paddingTop: `${navTop}px` }}>
      {TOOL_HEADER}

      {/* Hero — kardeş /arac sayfalarıyla görsel eşitlik için eklendi (site denetimi,
          16 Ağustos 2026: bu sayfa tek başına breadcrumb+tab'tan gövdeye atlıyordu).
          Anchor: Âl-i İmrân 3:7 — muhkem/müteşabih ayeti, tefsir metodolojisi ve
          müfessirler arası yorum farkının klasik referans noktası. */}
      <CollapsibleHero id="tefsir-ihtilaflari" language={language}
        labelTr="Tefsir İhtilafları" labelEn="Exegetical Disagreements">
      <div className="mq-box qc-hero-bg" style={{
        textAlign: 'center',
        '--pt-d': "56px", '--pt-m': "40px", '--pr-d': "32px", '--pr-m': "16px", '--pb-d': "36px", '--pb-m': "28px", '--pl-d': "32px", '--pl-m': "16px",
      }}>
        <div aria-hidden="true" style={{
          position: 'absolute', top: '-40px', left: '50%', transform: 'translateX(-50%)',
          width: 320, height: 200,
          background: `radial-gradient(ellipse at center, ${COLORS.gold}0e 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', maxWidth: 720, margin: '0 auto' }}>
          <div className="mq-fs" style={{
            fontFamily: FONTS.bismillah, '--fs-d': '2.6rem', '--fs-m': '2.2rem',
            color: COLORS.gold, opacity: 0.82, marginBottom: '24px', direction: 'rtl',
            textShadow: `0 0 24px ${COLORS.gold}44`,
            lineHeight: 1.2,
          }}>﷽</div>
          <p dir="rtl" lang="ar" className="mq-fs qc-verse-breathe" style={{
            fontFamily: FONTS.quran, '--fs-d': 'clamp(1.7rem, 4.2vw, 2.6rem)', '--fs-m': 'clamp(1.7rem, 4.2vw, 2.6rem)',
            color: COLORS.gold, lineHeight: 2.1, margin: '0 0 12px',
            }}>{cleanArabicForDisplay(ANCHOR_3_7_ARABIC_RAW)}</p>
          <p className="mq-fs" style={{
            fontFamily: FONTS.display, fontStyle: 'italic',
            '--fs-d': '1.02rem', '--fs-m': '0.92rem', color: COLORS.offWhite,
            maxWidth: 620, margin: '0 auto 10px', lineHeight: 1.7,
          }}>
            {tr
              ? '"Sana Kitab\'ı indiren O\'dur. Onun bazı ayetleri muhkemdir ki bunlar Kitab\'ın esasıdır. Diğerleri de müteşabihtir... Onun tevilini ancak Allah bilir. İlimde yüksek payeye erişenler ise: \'Ona inandık; hepsi Rabbimiz tarafındandır\' derler."'
              : '"It is He who sent down to you the Book; in it are verses precise in meaning — they are the foundation of the Book — and others unspecific... none knows its true interpretation except Allah. But those firm in knowledge say, \'We believe in it; all of it is from our Lord.\'"'}
          </p>
          <p className="mq-fs" style={{
            fontFamily: FONTS.body, '--fs-d': '0.72rem', '--fs-m': '0.68rem',
            color: SEMANTIC.textMuted, letterSpacing: '0.18em',
            textTransform: 'uppercase', margin: '0 0 24px',
          }}>— {tr ? 'Âl-i İmrân 3:7' : 'Āl-i \'Imrān 3:7'}</p>
          <p className="mq-fs" style={{
            fontFamily: FONTS.display, fontStyle: 'italic',
            '--fs-d': '0.98rem', '--fs-m': '0.88rem', color: COLORS.silver,
            maxWidth: 640, margin: '0 auto', lineHeight: 1.75,
          }}>
            {tr
              ? 'Bu ayet, müfessirlerin neden aynı ayeti farklı okuduğunu açıklayan klasik referans noktasıdır. Anlaşmazlık burada bir kusur sayılmaz; metnin katmanlı yapısından doğar.'
              : 'This verse is the classical reference point for why exegetes read the same verse differently. Disagreement here is not treated as a flaw; it arises from the text\'s layered nature.'}
          </p>
          {/* İKİNCİ DERECE ÇEVİRİ UYARISI (gpt-6-astra, 2026-09-14).
              Bu sayfadaki alıntıların aslı ARAPÇADIR; sayfa onları Türkçeye
              çevirmiş, İngilizce sürüm o Türkçeden üretilmiştir. İngilizce
              okurun doğrudan Arapçadan alıntı okuduğunu sanmaması için bunu
              sayfanın kendisi söylemeli. Türkçe sayfada gerekmez. */}
          {!tr && (
            <p className="mq-fs" style={{
              fontFamily: FONTS.body, '--fs-d': '0.74rem', '--fs-m': '0.7rem',
              color: SEMANTIC.textMuted, maxWidth: 640,
              margin: '14px auto 0', lineHeight: 1.6,
            }}>
              A note on the quotations: their originals are in Arabic. This page
              renders them in Turkish, and the English is translated from that
              Turkish rendering. Where a quotation is decisive, check it against
              the Arabic source given with it.
            </p>
          )}
        </div>
      </div>
      </CollapsibleHero>

      <div style={{ position: 'relative', flexShrink: 0 }}>
        <div style={{
          display: 'flex', gap: 0, overflowX: 'auto', scrollbarWidth: 'none',
          background: 'rgb(6, 8, 14)', backgroundColor: 'rgb(6, 8, 14)',
          borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
        }}>
          {tabs.map((label, i) => (
            <button key={i} onClick={() => setActiveTab(i)} className="mq-fs mq-box" style={{
              '--pt-d': "12px", '--pt-m': "12px", '--pr-d': "20px", '--pr-m': "14px", '--pb-d': "12px", '--pb-m': "12px", '--pl-d': "20px", '--pl-m': "14px",
              '--fs-d': '0.85rem', '--fs-m': '0.78rem',
              fontFamily: FONTS.body, fontWeight: activeTab === i ? 700 : 500,
              color: activeTab === i ? COLORS.gold : COLORS.silver,
              background: 'none', border: 'none', cursor: 'pointer',
              borderBottom: 'none', position: 'relative',
              whiteSpace: 'nowrap', transition: 'color 0.15s',
              textTransform: 'uppercase', letterSpacing: '0.06em',
            }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>{tabIcon(TAB_ICON_NAMES[i])}{label}</span>
            {activeTab === i && <ToolTabGlow />}
            </button>
          ))}
        </div>
        <div aria-hidden="true" style={{
          position: 'absolute', top: 0, right: 0, bottom: '1px', width: '28px',
          background: 'linear-gradient(90deg, transparent, rgb(6, 8, 14))', pointerEvents: 'none',
        }} />
      </div>

      <div style={{ flex: 1 }}>
        {activeTab === 0 && (
          <div className="mq-box" style={{ maxWidth: 780, margin: '0 auto', '--pt-d': "32px", '--pt-m': "20px", '--pr-d': "24px", '--pr-m': "16px", '--pb-d': "32px", '--pb-m': "20px", '--pl-d': "24px", '--pl-m': "16px" }}>
            <div style={{ textAlign: 'center', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.24em', fontSize: '0.7rem', color: COLORS.gold,  fontFamily: FONTS.body }}>
              {tr ? 'ANA METODOLOJİK İHTİLAF' : 'THE CORE METHODOLOGICAL DISAGREEMENT'}
            </div>
            <h2 className="mq-fs" style={{ textAlign: 'center', fontFamily: FONTS.display, '--fs-d': '1.7rem', '--fs-m': '1.4rem', color: COLORS.offWhite, margin: '0 0 16px' }}>
              {pick(data.methodology, 'title', tr)}
            </h2>
            <p className="mq-fs" style={{ fontFamily: FONTS.body, '--fs-d': '0.95rem', '--fs-m': '0.9rem', lineHeight: 1.75, color: COLORS.silver, marginBottom: 28 }}>
              {pick(data.methodology, 'intro', tr)}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
              {data.methodology.positions.map((pos, i) => (
                <PositionBlock key={i} pos={pos} scholars={data.scholars} tr={tr} isMobile={isMobile} />
              ))}
            </div>
            <p className="mq-fs" style={{ fontFamily: FONTS.body, fontStyle: 'italic', '--fs-d': '0.88rem', '--fs-m': '0.85rem', lineHeight: 1.7, color: COLORS.silver }}>
              {pick(data.methodology, 'closing', tr)}
            </p>
          </div>
        )}

        {activeTab === 1 && (
          <div className="mq-box" style={{ maxWidth: 900, margin: '0 auto', '--pt-d': "24px", '--pt-m': "16px", '--pr-d': "24px", '--pr-m': "16px", '--pb-d': "24px", '--pb-m': "16px", '--pl-d': "24px", '--pl-m': "16px", display: 'flex', flexDirection: 'column', gap: 14 }}>
            {data.cases.map(c => (
              <CaseCard key={c.id} c={c} scholars={data.scholars} tr={tr} isMobile={isMobile} language={language}
                expanded={expandedId === c.id} onToggle={() => setExpandedId(expandedId === c.id ? null : c.id)} />
            ))}
          </div>
        )}

        {activeTab === 2 && (
          <div className="mq-box" style={{ maxWidth: 1000, margin: '0 auto', '--pt-d': "24px", '--pt-m': "16px", '--pr-d': "24px", '--pr-m': "16px", '--pb-d': "24px", '--pb-m': "16px", '--pl-d': "24px", '--pl-m': "16px" }}>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(min(260px, 100%), 1fr))', gap: 14, marginBottom: 32 }}>
              {data.scholars.map(s => <ScholarProfileCard key={s.id} s={s} isMobile={isMobile} tr={tr} />)}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, borderTop: `1px solid ${COLORS.glassBorderSoft}`, paddingTop: 24 }}>
              {data.observations.map((o, i) => (
                <div key={i}>
                  <div style={{ fontFamily: FONTS.display, fontSize: '0.95rem', fontWeight: 700, color: COLORS.gold, marginBottom: 6 }}>
                    {pick(o, 'title', tr)}
                  </div>
                  <p className="mq-fs" style={{ fontFamily: FONTS.body, '--fs-d': '0.9rem', '--fs-m': '0.86rem', lineHeight: 1.7, color: COLORS.silver, margin: 0 }}>
                    {pick(o, 'text', tr)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {RELATED_CTA}
      </div>
    </div>
  );
}
