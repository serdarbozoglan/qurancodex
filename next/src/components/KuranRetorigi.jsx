'use client';

import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { cleanArabicForDisplay as cleanArabic } from '../lib/arabic';
import {
  COLORS, FONTS,
  BREAKPOINT_MOBILE, RADIUS,
  VERSE_BLOCK, TEXT,
} from '../tokens';
import ToolHeader from './ToolHeader';
import CrossToolCTA from './CrossToolCTA';
import BookmarkButton from './BookmarkButton';


const TABS_TR = ['Kategoriler & Kalıplar', 'Muhatap Analizi', 'Seçilmiş Sorular', 'Sûre Haritası'];
const TABS_EN = ['Categories & Patterns', 'Addressee Analysis', 'Selected Questions', 'Surah Map'];

export default function KuranRetorigi({ onClose }) {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [isMobile, setIsMobile] = useState(false)  // SSR-safe; useEffect h() post-mount hydrate;
  const bodyRef = useRef(null);

  // Escape key
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  // Body scroll lock kaldırıldı — WowFacts/IlkSon pattern: normal-flow document scroll.

  // isMobile resize
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < BREAKPOINT_MOBILE);
    h(); // post-mount hydrate
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
      <div style={{
        background: COLORS.cosmicBlack,
        minHeight: 'calc(100vh - 62px)',
        display: 'flex', flexDirection: 'column',
        paddingTop: '62px',
      }}>
        <ToolHeader
          icon={<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>}
          titleTr="Kur'an Belâgatı"
          titleEn="Quranic Rhetoric"
          subtitleTr="Tezad · İstiare · İltifât"
          subtitleEn="Antithesis · Metaphor · Iltifāt"
          language={language}
        />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: COLORS.silver, fontSize: '0.9rem', fontFamily: FONTS.body }}>
            {tr ? 'Yükleniyor…' : 'Loading…'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: COLORS.cosmicBlack,
      minHeight: 'calc(100vh - 62px)',
      display: 'flex', flexDirection: 'column',
      paddingTop: '62px',
    }}>
      <ToolHeader
        icon={<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>}
        titleTr="Kur'an Belâgatı"
        titleEn="Quranic Rhetoric"
        subtitleTr="Tezad · İstiare · İltifât · Mecaz"
        subtitleEn="Antithesis · Metaphor · Iltifāt · Tropes"
        language={language}
      />

      {/* ── HERO (Cinematic) — Yûsuf 12:111 ─────────────────────── */}
      <div style={{
        padding: isMobile ? '40px 16px 28px' : '56px 32px 36px',
        background: 'linear-gradient(180deg, rgba(212,165,116,0.06) 0%, transparent 100%)',
        borderBottom: `1px solid ${COLORS.glassBorderSoft || 'rgba(255,255,255,0.06)'}`,
        textAlign: 'center',
        flexShrink: 0,
      }}>
        <div dir="rtl" lang="ar" aria-label="Bismillāh" style={{ fontFamily: FONTS.bismillah, fontSize: isMobile ? '1.5rem' : '1.95rem', color: COLORS.gold, opacity: 0.82, lineHeight: 1, marginBottom: isMobile ? '26px' : '36px', textShadow: `0 0 22px ${COLORS.gold}28` }}>﷽</div>
        <p dir="rtl" lang="ar" style={{ fontFamily: FONTS.quran, fontSize: isMobile ? 'clamp(1.05rem, 4.2vw, 1.4rem)' : 'clamp(1.25rem, 2.3vw, 1.65rem)', color: COLORS.gold, lineHeight: 2.1, margin: '0 auto 16px', maxWidth: '820px', textShadow: `0 0 20px ${COLORS.gold}1c` }}>
          لَقَدْ كَانَ فِي قَصَصِهِمْ عِبْرَةٌ لِاُولِي الْاَلْبَابِ مَا كَانَ حَدِيثاً يُفْتَرٰى
        </p>
        <p style={{ color: COLORS.offWhite, fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: isMobile ? '0.94rem' : 'clamp(0.95rem, 1.6vw, 1.05rem)', lineHeight: 1.7, margin: '0 auto 8px', maxWidth: '680px', opacity: 0.95 }}>
          "{tr ? "Andolsun, onların kıssalarında akıl sahipleri için bir ibret vardır. Bu (Kur'an), uydurulmuş bir söz değildir." : "Indeed, in their stories is a lesson for those of understanding. This is not a fabricated tale."}"
        </p>
        <p style={{ color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.72rem', letterSpacing: '0.16em', textTransform: 'uppercase', margin: '0 0 32px', opacity: 0.65 }}>
          — {tr ? 'Yûsuf 12:111' : 'Yūsuf 12:111'}
        </p>
        <p style={{ color: COLORS.silver, fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: isMobile ? '0.92rem' : 'clamp(0.95rem, 1.55vw, 1.02rem)', lineHeight: 1.7, margin: '0 auto 36px', maxWidth: '700px', opacity: 0.88 }}>
          {tr ? <>Kur'an düzyazı değildir, şiir değildir. <em style={{ fontStyle: 'normal', color: COLORS.gold }}>Kendine has bir lisan</em>: tezat ile dengesi, istiare ile yoğunluğu, iltifât ile gerilimi — klasik belâgat bu sanatları <em style={{ fontStyle: 'normal', color: COLORS.gold }}>i'câz</em>ın delili sayar.</> : <>The Quran is neither prose nor poetry. It is <em style={{ fontStyle: 'normal', color: COLORS.gold }}>a register of its own</em>: balance through antithesis, density through metaphor, tension through iltifāt — classical balāgha treats these as proofs of <em style={{ fontStyle: 'normal', color: COLORS.gold }}>iʿjāz</em>.</>}
        </p>
        <div aria-hidden="true" style={{ width: '120px', height: '1px', background: `linear-gradient(to right, transparent, ${COLORS.gold}66, transparent)`, margin: '0 auto 28px' }} />
        <div style={{ fontSize: '0.68rem', letterSpacing: '0.3em', color: COLORS.gold, textTransform: 'uppercase', fontFamily: FONTS.body, fontWeight: 700, opacity: 0.72, marginBottom: '14px' }}>
          {tr ? "BELÂGAT · İ'CÂZ · DÖRT SANAT" : "BALĀGHA · IʿJĀZ · FOUR ARTS"}
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: isMobile ? 'clamp(1.6rem, 7vw, 2rem)' : 'clamp(2rem, 3.6vw, 2.7rem)', fontWeight: 700, color: COLORS.offWhite, margin: '0 auto 14px', lineHeight: 1.18, letterSpacing: '-0.015em', maxWidth: '780px' }}>
          {tr ? "Kur'an'ın Kendine Has Dili" : "The Quran's Register of Its Own"}
        </h1>
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: isMobile ? '1rem' : 'clamp(1.05rem, 1.8vw, 1.18rem)', color: COLORS.gold, margin: '0 auto 12px', lineHeight: 1.55, fontStyle: 'italic', maxWidth: '700px', opacity: 0.92 }}>
          {tr ? 'Tezat denge kurar, istiare yoğunlaştırır, iltifât canlandırır.' : 'Antithesis balances, metaphor condenses, iltifāt enlivens.'}
        </p>
      </div>

      {/* ── TAB BAR (sticky, §13.19 pattern — full hygiene guards) ────────── */}
      <div id="retorik-tab-bar" style={{
        display: 'flex',
        borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
        background: 'rgb(6, 8, 14)',
        backgroundColor: 'rgb(6, 8, 14)',
        isolation: 'isolate',
        flexShrink: 0,
        overflowX: 'auto',
        scrollbarWidth: 'none',
        position: 'sticky',
        top: '110px',
        zIndex: 20,
        scrollMarginTop: '120px',
      }}>
        {TABS.map((tab, i) => (
          <button
            key={i}
            onClick={() => {
              setActiveTab(i);
              setTimeout(() => {
                const tb = document.getElementById('retorik-tab-bar');
                if (tb) tb.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }, 50);
            }}
            style={{
              padding: isMobile ? '14px 14px' : '15px 20px',
              fontSize: isMobile ? '0.74rem' : '0.82rem',
              fontFamily: FONTS.body,
              fontWeight: activeTab === i ? 700 : 500,
              color: activeTab === i ? COLORS.gold : (COLORS.silverAlpha70 || COLORS.silver),
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === i ? `2px solid ${COLORS.gold}` : '2px solid transparent',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'color 0.15s',
              textTransform: 'uppercase',
              letterSpacing: activeTab === i ? '0.14em' : '0.12em',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── BODY ───────────────────────────────────────────────── */}
      <div ref={bodyRef} style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        {activeTab === 0 && <TabKategoriler data={data} tr={tr} isMobile={isMobile} />}
        {activeTab === 1 && <TabMuhatap data={data} tr={tr} isMobile={isMobile} />}
        {activeTab === 2 && <TabSorular data={data} tr={tr} isMobile={isMobile} />}
        {activeTab === 3 && <TabSureHaritasi data={data} tr={tr} isMobile={isMobile} />}
        <div style={{ padding: isMobile ? '0 16px' : '0 32px', maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
          <CrossToolCTA
            language={language} isMobile={isMobile}
            links={[
              { href: `/${language}/arac/retorik-sorular`, titleTr: 'Retorik Sorular', titleEn: 'Rhetorical Questions', descTr: 'Kur\'ân\'ın soru sorma sanatı — belağatın en canlı motoru.', descEn: 'The Qur\'an\'s art of questioning — belaghah\'s liveliest engine.' },
              { href: `/${language}/atlas/dua-dili`, titleTr: 'Dua Dili', titleEn: 'Language of Prayer', descTr: 'Kur\'ân dualarının belağî örüntüsü — çağrı, isteme, hitap.', descEn: 'The rhetorical patterning of Qur\'anic prayers — call, request, address.' },
              { href: `/${language}/arac/muhatap`, titleTr: 'Muhatap Sistemi', titleEn: 'Addressee System', descTr: 'Kur\'ân kime hitap ediyor? — 30+ muhatap kalıbı ile belağatın altyapısı.', descEn: 'Whom does the Qur\'an address? — 30+ addressee patterns undergirding the rhetoric.' },
            ]}
          />
        </div>
      </div>

    </div>
  );
}

// ── MODULE-LEVEL CONSTANTS ──────────────────────────────────────
const DENSITY_LABEL_TR = ['Yok', 'Az', 'Orta', 'Yüksek', 'Çok yüksek', 'En yoğun'];
const DENSITY_LABEL_EN = ['None', 'Low', 'Medium', 'High', 'Very high', 'Highest'];

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
  const sidebarItem = (id, color, name, secondary, isActive) => (
    <button
      key={id}
      onClick={() => setActiveItem(id)}
      style={{
        width: '100%',
        textAlign: 'left',
        padding: '11px 14px 11px 11px',
        background: isActive ? `${color}14` : 'transparent',
        borderLeft: `3px solid ${isActive ? color : 'transparent'}`,
        borderTop: 'none',
        borderRight: 'none',
        borderBottom: 'none',
        cursor: 'pointer',
        transition: 'background 0.15s',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}
      onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
      onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
    >
      {/* Color dot indicator */}
      <span
        aria-hidden="true"
        style={{
          width: 6, height: 6, borderRadius: RADIUS.full,
          background: color,
          flexShrink: 0,
          opacity: isActive ? 1 : 0.55,
          boxShadow: isActive ? `0 0 6px ${color}90` : 'none',
          transition: 'opacity 0.15s, box-shadow 0.15s',
        }}
      />
      {/* Name */}
      <span style={{
        flex: 1,
        minWidth: 0,
        color: isActive ? color : `${color}c0`,
        fontSize: '0.82rem',
        fontFamily: FONTS.body,
        fontWeight: isActive ? 600 : 500,
        lineHeight: 1.35,
        wordBreak: 'normal',
      }}>
        {name}
      </span>
      {/* Secondary (pct) */}
      {secondary && (
        <span style={{
          color: isActive ? color : COLORS.slate500,
          fontSize: '0.72rem',
          fontFamily: FONTS.body,
          fontWeight: 500,
          flexShrink: 0,
          fontVariantNumeric: 'tabular-nums',
          letterSpacing: '0.01em',
        }}>
          {secondary}
        </span>
      )}
    </button>
  );

  // Ayet kartı — canonical VERSE_BLOCK + TEXT tokens (§13.5)
  const verseCard = (v, i) => (
    <div
      key={i}
      style={{ ...VERSE_BLOCK, padding: '14px 16px', marginBottom: 10 }}
    >
      <p
        dir="rtl"
        lang="ar"
        style={{
          ...TEXT.verseArabic,
          fontSize: isMobile ? '1.3rem' : '1.6rem',
          margin: '0 0 8px',
        }}
      >
        {cleanArabic(v.ar)}
      </p>
      <p style={{ color: COLORS.silver, fontSize: '0.88rem', fontStyle: 'italic', margin: '0 0 4px', fontFamily: FONTS.body, lineHeight: 1.6 }}>
        {tr ? v.tr : v.en}
      </p>
      <p style={{ ...TEXT.verseRef, margin: 0 }}>
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
        background: 'transparent',
        border: `1px solid ${COLORS.glassBorder}`,
        borderLeft: `3px solid ${catColor}`,
        borderRadius: 8,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 6 }}>
        <div style={{ flex: 1 }}>
          {(sp.meaningTr || sp.meaningEn) && (
            <p style={{ fontFamily: FONTS.body, fontSize: '0.78rem', color: COLORS.silver, fontStyle: 'italic', margin: '0 0 2px', lineHeight: 1.5 }}>
              {tr ? sp.meaningTr : sp.meaningEn}
            </p>
          )}
        </div>
        <p
          dir="rtl"
          style={{ fontFamily: FONTS.quran, fontSize: isMobile ? '1.3rem' : '1.6rem', color: COLORS.gold, textAlign: 'right', lineHeight: 1.9, margin: 0, flexShrink: 0 }}
        >
          {cleanArabic(sp.arabicForm)}
        </p>
      </div>
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
    <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>

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
          {data.categories.map(c => {
            const name = tr ? c.nameTr : c.nameEn;
            const secondary = c.pct != null ? `~${c.pct}%` : null;
            return sidebarItem(c.id, c.color, name, secondary, activeItem === c.id);
          })}

          {/* Özel Kalıplar */}
          <div style={{ padding: '16px 16px 6px', color: COLORS.slate500, fontSize: '0.62rem', fontFamily: FONTS.body, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 4, borderTop: `1px solid ${COLORS.glassBorderSoft}` }}>
            {tr ? 'Özel Kalıplar' : 'Special Patterns'}
          </div>
          {data.specialPatterns.map(p =>
            sidebarItem(p.id, p.color, tr ? p.nameTr : p.nameEn, null, activeItem === p.id)
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
                  border: `1px solid ${isActive ? item.color : COLORS.glassBorder}`,
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
            {/* Başlık + badge + bookmark */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6, flexWrap: 'wrap' }}>
              <h2 style={{ color: activeCategory.color, fontFamily: FONTS.display, fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>
                {tr ? activeCategory.nameTr : activeCategory.nameEn}
              </h2>
              {activeCategory.pct != null && (
                <span style={{ background: `${activeCategory.color}25`, color: activeCategory.color, fontSize: '0.78rem', padding: '3px 12px', borderRadius: 20, fontFamily: FONTS.body, fontWeight: 600 }}>
                  ~{activeCategory.pct}%
                </span>
              )}
              {/* #201 (2026-07-16) — Bookmark this rhetorical category */}
              <div style={{ marginLeft: 'auto' }}>
                <BookmarkButton
                  item={{
                    id: `retorik:${activeCategory.id}`,
                    type: 'retorik',
                    title: tr ? activeCategory.nameTr : activeCategory.nameEn,
                    subtitle: tr ? (activeCategory.aliasTr || '') : (activeCategory.aliasEn || ''),
                    description: (tr ? activeCategory.descTr : activeCategory.descEn || '').slice(0, 240),
                    url: `/${language}/arac/retorik`,
                  }}
                  size="sm"
                  language={language}
                />
              </div>
            </div>
            {(activeCategory.aliasTr || activeCategory.aliasEn) && (
              <p style={{ color: COLORS.slate500, fontSize: '0.78rem', fontFamily: FONTS.body, margin: '0 0 16px' }}>
                {tr ? activeCategory.aliasTr : activeCategory.aliasEn}
              </p>
            )}

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
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
              <h2 style={{ color: activeSpecial.color, fontFamily: FONTS.display, fontSize: '1.4rem', fontWeight: 700, margin: 0 }}>
                {tr ? activeSpecial.nameTr : activeSpecial.nameEn}
              </h2>
              <span style={{ background: `${activeSpecial.color}25`, color: activeSpecial.color, fontSize: '0.78rem', padding: '3px 12px', borderRadius: 20, fontFamily: FONTS.body }}>
                {activeSpecial.count} {tr ? 'kullanım' : 'occurrences'}
              </span>
            </div>
            {(activeSpecial.countSourceTr || activeSpecial.countSourceEn) && (
              <p style={{ color: COLORS.slate500, fontSize: '0.74rem', fontFamily: FONTS.body, fontStyle: 'italic', margin: '0 0 16px', lineHeight: 1.5 }}>
                {tr ? activeSpecial.countSourceTr : activeSpecial.countSourceEn}
              </p>
            )}
            <div style={{ marginBottom: 12 }}>
              <p
                dir="rtl"
                style={{ fontFamily: FONTS.quran, fontSize: isMobile ? '1.3rem' : '1.6rem', color: COLORS.gold, textAlign: 'right', lineHeight: 2, margin: '0 0 4px' }}
              >
                {cleanArabic(activeSpecial.arabicForm)}
              </p>
              {(activeSpecial.meaningTr || activeSpecial.meaningEn) && (
                <p style={{ fontFamily: FONTS.body, fontSize: '0.82rem', color: COLORS.silver, fontStyle: 'italic', margin: 0, textAlign: 'right' }}>
                  {tr ? activeSpecial.meaningTr : activeSpecial.meaningEn}
                </p>
              )}
            </div>
            <p style={{ color: COLORS.silver, fontSize: '0.9rem', lineHeight: 1.75, fontFamily: FONTS.body, maxWidth: 680, marginBottom: 20 }}>
              {tr ? activeSpecial.descTr : activeSpecial.descEn}
            </p>
            {/* Tefsir notu */}
            <div style={{ background: 'rgba(52,152,219,0.08)', borderLeft: `3px solid #3498db`, padding: '10px 14px', borderRadius: 6, marginBottom: 24, fontSize: '0.82rem', color: COLORS.silver, fontFamily: FONTS.body, lineHeight: 1.6 }}>
              {tr ? activeSpecial.tefsirNoteTr : activeSpecial.tefsirNoteEn}
            </div>
            {/* 13 kullanım listesi */}
            <h3 style={{ color: COLORS.offWhite, fontFamily: FONTS.body, fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
              {tr ? `Tüm Kullanımlar (${activeSpecial.count})` : `All Occurrences (${activeSpecial.count})`}
            </h3>
            {activeSpecial.usages.map((u, i) => (
              <div key={i} style={{ padding: '10px 14px', marginBottom: 8, background: 'rgba(255,255,255,0.03)', border: `1px solid ${COLORS.glassBorderSoft}`, borderRadius: 8 }}>
                <div>
                  <p dir="rtl" style={{ fontFamily: FONTS.quran, fontSize: isMobile ? '1.3rem' : '1.6rem', color: COLORS.gold, textAlign: 'right', lineHeight: 1.9, margin: '0 0 4px' }}>
                    {cleanArabic(u.conceptAr)}
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
              <span style={{ background: `${activeSpecial.color}25`, color: activeSpecial.color, fontSize: '0.78rem', padding: '3px 12px', borderRadius: 20, fontFamily: FONTS.body }}>
                {tr ? `5 yetide toplam ~${activeSpecial.count} kullanım` : `~${activeSpecial.count} occurrences across 5 faculties`}
              </span>
            </div>
            <p style={{ color: COLORS.silver, fontSize: '0.9rem', lineHeight: 1.75, fontFamily: FONTS.body, maxWidth: 680, marginBottom: 16 }}>
              {tr ? activeSpecial.descTr : activeSpecial.descEn}
            </p>
            {/* Compact 5-faculty summary grid */}
            {activeSpecial.summaryGrid && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(5, 1fr)',
                gap: 8,
                marginBottom: 24,
              }}>
                {activeSpecial.summaryGrid.map((s, i) => (
                  <div key={i} style={{
                    padding: '10px 12px',
                    borderRadius: 8,
                    background: `${activeSpecial.color}10`,
                    border: `1px solid ${activeSpecial.color}35`,
                    display: 'flex', flexDirection: 'column', gap: 4,
                  }}>
                    <span style={{
                      fontSize: '0.78rem', fontWeight: 700, color: activeSpecial.color,
                      fontFamily: FONTS.body, letterSpacing: '0.02em',
                    }}>
                      {tr ? s.labelTr : s.labelEn}
                    </span>
                    <span style={{
                      fontSize: '0.72rem', color: COLORS.silver,
                      fontFamily: FONTS.body, lineHeight: 1.4,
                    }}>
                      {tr ? s.shortTr : s.shortEn}
                    </span>
                  </div>
                ))}
              </div>
            )}
            {activeSpecial.faculties.map((f, i) => (
              <div key={i} style={{ padding: '14px 16px', marginBottom: 12, background: 'rgba(255,255,255,0.03)', borderLeft: `3px solid ${activeSpecial.color}`, border: `1px solid ${COLORS.glassBorderSoft}`, borderRadius: 8 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 6 }}>
                  {(f.meaningTr || f.meaningEn) && (
                    <p style={{ fontFamily: FONTS.body, fontSize: '0.78rem', color: COLORS.silver, fontStyle: 'italic', margin: 0, lineHeight: 1.5, alignSelf: 'center', flex: 1 }}>
                      {tr ? f.meaningTr : f.meaningEn}
                    </p>
                  )}
                  <p dir="rtl" style={{ fontFamily: FONTS.quran, fontSize: isMobile ? '1.3rem' : '1.6rem', color: COLORS.gold, textAlign: 'right', lineHeight: 1.9, margin: 0, marginLeft: 'auto' }}>
                    {cleanArabic(f.arabicForm)}
                  </p>
                </div>
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
                    <span style={{
                      display: 'inline-block',
                      fontSize: '0.7rem', fontWeight: 600,
                      color: activeSpecial.color,
                      background: `${activeSpecial.color}18`,
                      border: `1px solid ${activeSpecial.color}40`,
                      padding: '3px 10px', borderRadius: 20,
                      fontFamily: FONTS.body, letterSpacing: '0.02em',
                    }}>
                      {tr ? 'En iyi örnek' : 'Best example'}: {f.bestVerseRef}
                    </span>
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
                {activeSpecial.count} {tr ? 'kullanım' : 'occurrences'}
              </span>
            </div>
            <p dir="rtl" style={{ fontFamily: FONTS.quran, fontSize: isMobile ? '1.3rem' : '1.6rem', color: COLORS.gold, textAlign: 'right', lineHeight: 2, marginBottom: 8 }}>
              {cleanArabic(activeSpecial.arabicForm)}
            </p>
            <p style={{ color: COLORS.silver, fontSize: '0.9rem', lineHeight: 1.75, fontFamily: FONTS.body, maxWidth: 680, marginBottom: 24 }}>
              {tr ? activeSpecial.descTr : activeSpecial.descEn}
            </p>
            {activeSpecial.examples.map((ex, i) => (
              <div key={i} style={{ padding: '14px 16px', marginBottom: 10, background: 'rgba(255,255,255,0.03)', borderLeft: `3px solid ${activeSpecial.color}`, border: `1px solid ${COLORS.glassBorderSoft}`, borderRadius: 8 }}>
                <p dir="rtl" style={{ fontFamily: FONTS.quran, fontSize: isMobile ? '1.3rem' : '1.6rem', color: COLORS.gold, textAlign: 'right', lineHeight: 2, margin: '0 0 6px' }}>
                  {cleanArabic(ex.ar)}
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

  const SCROLL_WRAP = { flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'hidden' };

  const pillStyle = (id, color) => {
    const isActive = activeGroup === id;
    return {
      padding: '5px 14px',
      borderRadius: 20,
      border: `1px solid ${isActive ? color : COLORS.glassBorder}`,
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
    <div style={{ ...SCROLL_WRAP, padding: isMobile ? '16px' : '28px 32px' }}>

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
                  <p dir="rtl" style={{ fontFamily: FONTS.quran, fontSize: isMobile ? '1.3rem' : '1.6rem', color: COLORS.gold, textAlign: 'right', lineHeight: 2, margin: '0 0 6px' }}>
                    {cleanArabic(v.ar)}
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
    erotema: COLORS.gold,
    irsad:   '#3498db',
    tevbih:  '#2ecc71',
    taaccub: '#c084fc',
  };
  const TYPE_LABELS_TR = { erotema: 'İstifhâm-ı İnkârî', irsad: 'İstifhâm-ı İrşâdî', tevbih: 'İstifhâm-ı Tevbîhî', taaccub: 'İstifhâm-ı Taaccübî' };
  const TYPE_LABELS_EN = { erotema: 'Istifhām Inkārī', irsad: 'Istifhām Irshādī', tevbih: 'Istifhām Tawbīkhī', taaccub: 'Istifhām Taʿajjubī' };

  const PATTERN_COLORS = { 've-ma-edrake': '#D85A30', 'efela-takılun': '#14b8a6', eleyse: '#8b5cf6' };
  const PATTERN_LABELS_TR = { 've-ma-edrake': 'Ve Mâ Edrâke', 'efela-takılun': "Efela Ta'kılûn", eleyse: 'Eleyse / E-lem' };
  const PATTERN_LABELS_EN = { 've-ma-edrake': 'Wa Ma Adraka', 'efela-takılun': 'Afala Taʿqilun', eleyse: 'Alaysa / A-lam' };

  const ADDRESS_COLORS = { humanity: COLORS.gold, mushrikeen: '#e74c3c', prophet: '#c084fc', 'ehl-i-kitap': '#14b8a6', munafikun: COLORS.slate500 };
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
          border: `1px solid ${isActive ? color : COLORS.glassBorder}`,
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
    <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'hidden', padding: isMobile ? '16px' : '24px 32px' }}>

      {/* Başlık */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ color: COLORS.offWhite, fontFamily: FONTS.display, fontSize: isMobile ? '1.2rem' : '1.5rem', fontWeight: 700, margin: '0 0 4px' }}>
          {tr ? 'Seçilmiş Sorular' : 'Selected Questions'}
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
                <p dir="rtl" style={{ fontFamily: FONTS.quran, fontSize: isMobile ? '1.3rem' : '1.6rem', color: COLORS.gold, textAlign: 'right', lineHeight: 2, margin: '0 0 6px' }}>
                  {cleanArabic(q.ar)}
                </p>
                {/* Çeviri */}
                <p style={{ color: COLORS.silver, fontSize: '0.88rem', fontStyle: 'italic', margin: '0 0 6px', fontFamily: FONTS.body, lineHeight: 1.6 }}>
                  {tr ? q.tr : q.en}
                </p>
                {/* Ref */}
                <p style={{ color: `${COLORS.gold}60`, fontSize: '0.72rem', fontFamily: FONTS.body, margin: 0 }}>— {q.ref}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Seçim kriteri footnote */}
      <div style={{
        marginTop: 32,
        padding: '14px 18px',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderLeft: `3px solid ${COLORS.gold}40`,
        borderRadius: 8,
      }}>
        <p style={{ color: `${COLORS.silver}80`, fontSize: '0.75rem', fontFamily: FONTS.body, margin: 0, lineHeight: 1.7 }}>
          <span style={{ color: COLORS.gold, fontWeight: 600 }}>
            {tr ? 'Seçim kriteri:' : 'Selection criteria:'}
          </span>
          {tr
            ? ' Bu sorular; dört retorik işlevi (İstifhâm-ı İnkârî, İrşâdî, Tevbîhî, Taaccübî), beş muhatap grubunu (tüm insanlık, müşrikler, ehli kitap, münafıklar, Hz. Peygamber) ve üç tekrar kalıbını (Ve Mâ Edrâke, Efela Ta\'kılûn, Eleyse / E-lem) temsil edecek biçimde seçilmiştir. Her kategoriden en az iki örnek alınmış; kısa, ezberlenebilir ve Türkçe tefsirlerde en sık alıntılanan ayetler tercih edilmiştir.'
            : ' These questions were selected to represent four rhetorical functions (Istifhām Inkārī, Irshādī, Tawbīkhī, Taʿajjubī), five addressee groups (all humanity, polytheists, People of the Book, hypocrites, the Prophet), and three recurring patterns (Wa Ma Adraka, Afala Taʿqilun, Alaysa / A-lam). At least two examples were drawn from each category; preference was given to short, memorable verses most frequently cited in classical and modern Turkish tafsir.'}
        </p>
      </div>

    </div>
  );
}
function TabSureHaritasi({ data, tr, isMobile }) {
  const [_hoveredSurah, _setHoveredSurah] = useState(null);
  const TYPE_COLORS = { erotema: COLORS.gold, irsad: '#3498db', tevbih: '#2ecc71', taaccub: '#c084fc' };

  return (
    <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'hidden', padding: isMobile ? '16px' : '28px 32px' }}>

      {/* ── BÖLÜM 1: MUHATAP × TİP MATRİSİ ─────────────── */}
      {(() => {
        const TYPE_COLORS = { erotema: COLORS.gold, irsad: '#3498db', tevbih: '#2ecc71', taaccub: '#c084fc' };
        const TYPE_LABELS_TR = { erotema: 'İstifhâm-ı İnkârî', irsad: 'İstifhâm-ı İrşâdî', tevbih: 'İstifhâm-ı Tevbîhî', taaccub: 'İstifhâm-ı Taaccübî' };
        const TYPE_LABELS_EN = { erotema: 'Istifhām Inkārī', irsad: 'Istifhām Irshādī', tevbih: 'Istifhām Tawbīkhī', taaccub: 'Istifhām Taʿajjubī' };
        const ADDR_COLORS = { humanity: COLORS.gold, mushrikeen: '#e74c3c', 'ehl-i-kitap': '#14b8a6', munafikun: COLORS.slate500, prophet: '#a78bfa' };
        const ADDR_LABELS_TR = { humanity: 'Tüm İnsanlık', mushrikeen: 'Müşrikler', 'ehl-i-kitap': 'Ehli Kitap', munafikun: 'Münafıklar', prophet: 'Hz. Peygamber' };
        const ADDR_LABELS_EN = { humanity: 'All Humanity', mushrikeen: 'Polytheists', 'ehl-i-kitap': 'People of Book', munafikun: 'Hypocrites', prophet: 'The Prophet' };
        const types = ['erotema', 'irsad', 'tevbih', 'taaccub'];
        const addrs = ['humanity', 'mushrikeen', 'ehl-i-kitap', 'munafikun', 'prophet'];

        // Build matrix from questions
        const matrix = {};
        addrs.forEach(a => { matrix[a] = {}; types.forEach(t => { matrix[a][t] = 0; }); });
        data.questions.forEach(q => {
          if (matrix[q.addressee]) matrix[q.addressee][q.type] = (matrix[q.addressee][q.type] || 0) + 1;
        });

        return (
          <>
            <h2 style={{ color: COLORS.offWhite, fontFamily: FONTS.display, fontSize: isMobile ? '1.2rem' : '1.5rem', fontWeight: 700, margin: '0 0 6px' }}>
              {tr ? 'Muhataba Göre Retorik Dağılım' : 'Rhetorical Style by Addressee'}
            </h2>
            <p style={{ color: `${COLORS.silver}80`, fontSize: '0.82rem', fontFamily: FONTS.body, marginBottom: 20, lineHeight: 1.5 }}>
              {tr
                ? 'Seçilen soruların muhatap × tip dağılımı — her grupta hangi soru biçimi öne çıkıyor?'
                : 'Distribution of the selected questions by addressee × type — which form dominates each group?'}
            </p>

            {/* Tür legend */}
            <div style={{ display: 'flex', gap: 14, marginBottom: 16, flexWrap: 'wrap' }}>
              {types.map(t => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: TYPE_COLORS[t], flexShrink: 0 }} />
                  <span style={{ color: COLORS.silver, fontSize: '0.72rem', fontFamily: FONTS.body }}>
                    {tr ? TYPE_LABELS_TR[t] : TYPE_LABELS_EN[t]}
                  </span>
                </div>
              ))}
            </div>

            {/* Matrix rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
              {addrs.map(addr => {
                const row = matrix[addr];
                const total = types.reduce((s, t) => s + row[t], 0);
                if (total === 0) return null;
                return (
                  <div key={addr} style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 14 }}>
                    {/* Muhatap etiketi */}
                    <div style={{
                      width: isMobile ? 80 : 130, flexShrink: 0,
                      display: 'flex', alignItems: 'center', gap: 6,
                    }}>
                      <div style={{ width: 8, height: 8, borderRadius: RADIUS.full, background: ADDR_COLORS[addr], flexShrink: 0 }} />
                      <span style={{ color: COLORS.silver, fontSize: isMobile ? '0.68rem' : '0.75rem', fontFamily: FONTS.body, lineHeight: 1.3 }}>
                        {tr ? ADDR_LABELS_TR[addr] : ADDR_LABELS_EN[addr]}
                      </span>
                    </div>
                    {/* Stacked bar */}
                    <div style={{ flex: 1, display: 'flex', height: 22, borderRadius: 4, overflow: 'hidden', gap: 2 }}>
                      {types.map(t => {
                        const count = row[t];
                        if (count === 0) return null;
                        const pct = (count / total) * 100;
                        return (
                          <div
                            key={t}
                            title={`${tr ? TYPE_LABELS_TR[t] : TYPE_LABELS_EN[t]}: ${count}`}
                            style={{
                              width: `${pct}%`,
                              background: TYPE_COLORS[t],
                              opacity: 0.8,
                              borderRadius: 3,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              minWidth: count > 0 ? 18 : 0,
                            }}
                          >
                            <span style={{ color: 'rgba(0,0,0,0.7)', fontSize: '0.65rem', fontWeight: 700, fontFamily: FONTS.body }}>
                              {count}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    {/* Toplam */}
                    <span style={{ color: `${COLORS.silver}60`, fontSize: '0.7rem', fontFamily: FONTS.body, flexShrink: 0, width: 28, textAlign: 'right' }}>
                      {total}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Hz. Peygamber notu */}
            <div style={{
              marginBottom: 40,
              padding: '10px 14px',
              background: 'rgba(167,139,250,0.06)',
              borderLeft: '3px solid rgba(167,139,250,0.4)',
              borderRadius: '0 6px 6px 0',
            }}>
              <p style={{ color: `${COLORS.silver}90`, fontSize: '0.75rem', fontFamily: FONTS.body, margin: 0, lineHeight: 1.7 }}>
                <span style={{ color: '#a78bfa', fontWeight: 600 }}>
                  {tr ? 'Hz. Peygamber\'e yönelen sorular:' : 'Questions to the Prophet:'}
                </span>
                {tr
                  ? ' Yüzeyde soru biçiminde olsalar da bilgi sormaz; Peygamber\'i teselli etmek ve aşırı üzüntüden alıkoymak için gelmiştir. Klasik tefsir bunları İstifhâm-ı İnkârî değil — ayrı bir alt sınıf olan "İstifhâm-ı Takrirî" (tescil sorusu) olarak sayar: cevabı zaten bilinen, "evet, öyledir" diye hatırlatmak için sorulan soru.'
                  : ' Though they appear in question form, they do not seek information; they come to console the Prophet and restrain his excessive grief. Classical tafsir does not group them under Istifhām Inkārī but under a distinct subcategory — "Istifhām Taqrīrī" (confirmatory questions): asked not for information but to remind, expecting the answer "yes, it is so."'}
              </p>
            </div>

          </>
        );
      })()}

      {/* ── BÖLÜM 2: EN YOĞUN 5 SURE ───────────────────── */}
      <h3 style={{ color: COLORS.offWhite, fontFamily: FONTS.body, fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>
        {tr ? 'En Yoğun 5 Sure' : 'Top 5 Most Dense Surahs'}
      </h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(5, 1fr)',
        gap: 12,
        marginBottom: 48,
      }}>
        {data.topSurahs.map((s, i) => {
          const domColor = TYPE_COLORS[s.dominantType] || COLORS.silver;
          return (
            <div
              key={i}
              style={{
                padding: '18px 20px',
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid ${COLORS.glassBorderSoft}`,
                borderRadius: 10,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                  <span style={{ color: COLORS.slate500, fontSize: '0.78rem', fontFamily: FONTS.body }}>{s.number}. </span>
                  <span style={{ color: COLORS.offWhite, fontSize: '0.95rem', fontFamily: FONTS.body, fontWeight: 600 }}>
                    {tr ? s.nameTr : s.nameEn}
                  </span>
                </div>
                <span style={{ background: `${domColor}20`, color: domColor, fontSize: '0.7rem', padding: '2px 8px', borderRadius: 4, fontFamily: FONTS.body }}>
                  ~{s.estimatedCount}
                </span>
              </div>
              <p dir="rtl" style={{ fontFamily: FONTS.quran, fontSize: '1.35rem', color: COLORS.gold, textAlign: 'right', lineHeight: 2.0, margin: '0 0 10px' }}>
                {cleanArabic(s.iconicQuestionAr)}
              </p>
              <p style={{ color: `${COLORS.silver}80`, fontSize: '0.82rem', fontFamily: FONTS.body, margin: 0, lineHeight: 1.6 }}>
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
            {cleanArabic(data.comparativeAnalysis.questionAr)}
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
        <div style={{ background: 'rgba(167,139,250,0.08)', borderLeft: `3px solid #c084fc`, padding: '10px 14px', borderRadius: 6, fontSize: '0.82rem', color: COLORS.silver, fontFamily: FONTS.body, lineHeight: 1.65 }}>
          <span style={{ color: '#c084fc', fontWeight: 600, marginRight: 6 }}>
            {tr ? 'İstifhâm-ı Taaccübî:' : 'Istifhām Taʿajjubī:'}
          </span>
          {tr ? data.comparativeAnalysis.taaccubNoteTr : data.comparativeAnalysis.taaccubNoteEn}
        </div>
      </div>

    </div>
  );
}
