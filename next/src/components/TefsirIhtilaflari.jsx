'use client';

// ─── TefsirIhtilaflari — Klasik Tefsirde Mesel İhtilafları ──────────────────
// 2026-08-15 — Yedi klasik/modern müfessirin Kur'ân mesellerindeki (benzetme
// ayetleri) yorum ayrılıklarını, isimli alıntılarla karşılaştırır. Her alıntı
// yayına girmeden önce birincil kaynaktan (tafsir.app, sunnah.com) bağımsız
// doğrulandı; doğrulanamayan iddialar kapsam dışı bırakıldı (§13.30).
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS, BREAKPOINT_MOBILE, CATEGORY } from '../tokens';
import ToolHeader from './ToolHeader';
import useNavbarOffset from './useNavbarOffset';
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

const CONFIDENCE_LABELS_TR = { confirmed: 'Doğrulandı', partial: 'Kısmen doğrulandı' };
const CONFIDENCE_LABELS_EN = { confirmed: 'Verified', partial: 'Partially verified' };

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

function ScholarTag({ scholarId, scholars, size = 'md' }) {
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
      {s.nameTr}
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
        <ScholarTag scholarId={pos.scholarId} scholars={scholars} />
        {pos.confidence && (
          <span style={{
            fontSize: '0.64rem', fontFamily: FONTS.body, color: COLORS.textFaint || COLORS.silver,
            opacity: 0.75, letterSpacing: '0.06em', textTransform: 'uppercase',
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
      {pos.quoteTr && (
        <p className="mq-fs" style={{
          fontFamily: FONTS.body, fontStyle: 'italic', color: COLORS.offWhite,
          '--fs-d': '0.9rem', '--fs-m': '0.86rem', lineHeight: 1.7, margin: '0 0 8px',
        }}>
          {pos.quoteTr}
        </p>
      )}
      {pos.refTr && (
        <p style={{ fontFamily: FONTS.body, fontSize: '0.72rem', color: COLORS.silver, opacity: 0.75, margin: '0 0 6px' }}>
          — {pos.refTr}
        </p>
      )}
      {pos.noteTr && (
        <p className="mq-fs" style={{ fontFamily: FONTS.body, '--fs-d': '0.83rem', '--fs-m': '0.8rem', color: COLORS.silver, lineHeight: 1.6, margin: 0 }}>
          {pos.noteTr}
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
            title: c.titleTr,
            subtitle: `${surahShortName(parseInt(c.verseRef.split(':')[0], 10))} ${c.verseRef}`,
            description: (c.introTr || '').slice(0, 240),
            url: `/${language}/arac/tefsir-ihtilaflari#${c.id}`,
          }}
          size="sm"
          language={language}
        />
      </div>

      <button className="mq-box" onClick={onToggle} aria-expanded={expanded}
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
        <h3 className="mq-fs" style={{
          fontFamily: FONTS.display, '--fs-d': '1.2rem', '--fs-m': '1.05rem', fontWeight: 700,
          color: COLORS.offWhite, margin: '0 0 8px', lineHeight: 1.35,
        }}>
          {c.titleTr}
        </h3>
        {c.introTr && (
          <p className="mq-fs" style={{ fontFamily: FONTS.body, '--fs-d': '0.9rem', '--fs-m': '0.86rem', lineHeight: 1.65, color: COLORS.silver, opacity: 0.9, margin: 0 }}>
            {c.introTr}
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
                    {axis.titleTr}
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

function ScholarProfileCard({ s, isMobile }) {
  const color = SCHOLAR_COLORS[s.id] || COLORS.silver;
  return (
    <div className="mq-box" style={{
      '--pt-d': "18px", '--pt-m': "16px", '--pr-d': "20px", '--pr-m': "16px", '--pb-d': "18px", '--pb-m': "16px", '--pl-d': "20px", '--pl-m': "16px",
      background: 'rgba(255,255,255,0.03)', border: `1px solid ${color}30`,
      borderTop: `3px solid ${color}`, borderRadius: 12,
    }}>
      <div style={{ fontFamily: FONTS.display, fontSize: '1rem', fontWeight: 700, color: COLORS.offWhite, marginBottom: 2 }}>
        {s.nameTr}
      </div>
      <div style={{ fontFamily: FONTS.body, fontSize: '0.72rem', color, opacity: 0.9, marginBottom: 10 }}>
        {s.deathH}/{s.deathM} · {s.ekolTr}
      </div>
      <div style={{ fontFamily: FONTS.body, fontSize: '0.78rem', color: COLORS.silver, fontStyle: 'italic', marginBottom: 12 }}>
        {s.eserTr}
      </div>
      <div style={{ fontFamily: FONTS.body, fontSize: '0.8rem', color: COLORS.offWhite, lineHeight: 1.6, marginBottom: 10 }}>
        {s.hamleTr}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: '0.74rem', fontFamily: FONTS.body, lineHeight: 1.5 }}>
        <div style={{ color: CATEGORY.emerald }}>+ {s.gucTr}</div>
        <div style={{ color: COLORS.silver, opacity: 0.85 }}>− {s.zayifTr}</div>
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
  const [activeTab, setActiveTab] = useState(0);

  const TABS_TR = ['Yöntem', 'Vakalar', 'Müfessirler'];
  const TABS_EN = ['Method', 'Cases', 'Exegetes'];
  const tabs = tr ? TABS_TR : TABS_EN;

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
      <div className="mq-box" style={{
        textAlign: 'center', position: 'relative', overflow: 'hidden',
        '--pt-d': "48px", '--pt-m': "32px", '--pr-d': "24px", '--pr-m': "16px", '--pb-d': "36px", '--pb-m': "28px", '--pl-d': "24px", '--pl-m': "16px",
      }}>
        <div aria-hidden="true" style={{
          position: 'absolute', top: '-40px', left: '50%', transform: 'translateX(-50%)',
          width: 320, height: 200,
          background: `radial-gradient(ellipse at center, ${COLORS.gold}0e 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', maxWidth: 720, margin: '0 auto' }}>
          <div className="mq-fs" style={{
            fontFamily: FONTS.bismillah, '--fs-d': '1.6rem', '--fs-m': '1.4rem',
            color: COLORS.gold, opacity: 0.85, marginBottom: 22, direction: 'rtl',
            textShadow: `0 0 24px ${COLORS.gold}44`,
          }}>﷽</div>
          <p dir="rtl" lang="ar" className="mq-fs" style={{
            fontFamily: FONTS.quran, '--fs-d': '1.35rem', '--fs-m': '1.1rem',
            color: COLORS.gold, lineHeight: 2.05, margin: '0 0 18px',
            textShadow: `0 0 32px ${COLORS.gold}22`,
          }}>{cleanArabicForDisplay(ANCHOR_3_7_ARABIC_RAW)}</p>
          <p className="mq-fs" style={{
            fontFamily: FONTS.display, fontStyle: 'italic',
            '--fs-d': '1.02rem', '--fs-m': '0.92rem', color: COLORS.offWhite,
            maxWidth: 620, margin: '0 auto 10px', lineHeight: 1.7, opacity: 0.92,
          }}>
            {tr
              ? '"Sana Kitab\'ı indiren O\'dur. Onun bazı ayetleri muhkemdir ki bunlar Kitab\'ın esasıdır. Diğerleri de müteşabihtir... Onun tevilini ancak Allah bilir. İlimde yüksek payeye erişenler ise: \'Ona inandık; hepsi Rabbimiz tarafındandır\' derler."'
              : '"It is He who sent down to you the Book; in it are verses precise in meaning — they are the foundation of the Book — and others unspecific... none knows its true interpretation except Allah. But those firm in knowledge say, \'We believe in it; all of it is from our Lord.\'"'}
          </p>
          <p className="mq-fs" style={{
            fontFamily: FONTS.body, '--fs-d': '0.72rem', '--fs-m': '0.68rem',
            color: COLORS.silver, opacity: 0.78, letterSpacing: '0.18em',
            textTransform: 'uppercase', margin: '0 0 24px',
          }}>— {tr ? 'Âl-i İmrân 3:7' : 'Āl-i \'Imrān 3:7'}</p>
          <p className="mq-fs" style={{
            fontFamily: FONTS.display, fontStyle: 'italic',
            '--fs-d': '0.98rem', '--fs-m': '0.88rem', color: COLORS.silver,
            maxWidth: 640, margin: '0 auto', lineHeight: 1.75, opacity: 0.9,
          }}>
            {tr
              ? 'Bu ayet, müfessirlerin neden aynı ayeti farklı okuduğunu açıklayan klasik referans noktasıdır. Anlaşmazlık burada bir kusur sayılmaz; metnin katmanlı yapısından doğar.'
              : 'This verse is the classical reference point for why exegetes read the same verse differently. Disagreement here is not treated as a flaw; it arises from the text\'s layered nature.'}
          </p>
        </div>
      </div>

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
              fontFamily: FONTS.body, fontWeight: activeTab === i ? 700 : 400,
              color: activeTab === i ? COLORS.gold : COLORS.silver,
              background: 'none', border: 'none', cursor: 'pointer',
              borderBottom: activeTab === i ? `2px solid ${COLORS.gold}` : '2px solid transparent',
              whiteSpace: 'nowrap', transition: 'color 0.15s',
              textTransform: 'uppercase', letterSpacing: '0.06em',
            }}>
              {label}
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
            <div style={{ textAlign: 'center', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.24em', fontSize: '0.7rem', color: COLORS.gold, opacity: 0.8, fontFamily: FONTS.body }}>
              {tr ? 'ANA METODOLOJİK İHTİLAF' : 'THE CORE METHODOLOGICAL DISAGREEMENT'}
            </div>
            <h2 className="mq-fs" style={{ textAlign: 'center', fontFamily: FONTS.display, '--fs-d': '1.7rem', '--fs-m': '1.4rem', color: COLORS.offWhite, margin: '0 0 16px' }}>
              {data.methodology.titleTr}
            </h2>
            <p className="mq-fs" style={{ fontFamily: FONTS.body, '--fs-d': '0.95rem', '--fs-m': '0.9rem', lineHeight: 1.75, color: COLORS.silver, marginBottom: 28 }}>
              {data.methodology.introTr}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
              {data.methodology.positions.map((pos, i) => (
                <PositionBlock key={i} pos={pos} scholars={data.scholars} tr={tr} isMobile={isMobile} />
              ))}
            </div>
            <p className="mq-fs" style={{ fontFamily: FONTS.body, fontStyle: 'italic', '--fs-d': '0.88rem', '--fs-m': '0.85rem', lineHeight: 1.7, color: COLORS.silver, opacity: 0.85 }}>
              {data.methodology.closingTr}
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
              {data.scholars.map(s => <ScholarProfileCard key={s.id} s={s} isMobile={isMobile} />)}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, borderTop: `1px solid ${COLORS.glassBorderSoft}`, paddingTop: 24 }}>
              {data.observations.map((o, i) => (
                <div key={i}>
                  <div style={{ fontFamily: FONTS.display, fontSize: '0.95rem', fontWeight: 700, color: COLORS.gold, marginBottom: 6 }}>
                    {o.titleTr}
                  </div>
                  <p className="mq-fs" style={{ fontFamily: FONTS.body, '--fs-d': '0.9rem', '--fs-m': '0.86rem', lineHeight: 1.7, color: COLORS.silver, margin: 0 }}>
                    {o.textTr}
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
