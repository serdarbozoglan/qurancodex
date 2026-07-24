'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../i18n/LanguageContext';
import { cleanArabicMinimal as cleanArabic } from '../lib/arabic';
import { CloseIcon } from './icons';
import ToolHeader from './ToolHeader';
import CrossToolCTA from './CrossToolCTA';
import BookmarkButton from './BookmarkButton';
import HeroGeometricBackground from './HeroGeometricBackground';
import {
  COLORS, FONTS,
  OVERLAY_HEADER, OVERLAY_TITLE, RADIUS, TRANSITION,
  BREAKPOINT_MOBILE,
  VERSE_BLOCK, TEXT,
} from '../tokens';

// ─── İlk ve Son Kelimeler (F-11) ──────────────────────────────────────────────
// 114 sûrenin açılış ve kapanış kelimelerini aynı ekranda gösterir.
// Veri: public/ilk-son-kelimeler.json
// Arapça metinler verse-graph-bgem3 üzerinden çekildi (standart encoding).
// Tafsir/yorum içeriği bu araçta yer almaz; "Tefsirini oku" butonu ayrı
// TafsirPanel'e (Elmalılı) yönlendirir.

const FILTERS = [
  { id: 'all',              labelTr: 'Tümü',                   labelEn: 'All',                       match: () => true },
  { id: 'mukattaaOpener',   labelTr: 'Mukattaa ile',           labelEn: 'Mukattaʿat',                match: s => s.hasMukattaa === true },
  { id: 'kulOpener',        labelTr: '"Kul" ile',              labelEn: '"Qul"',                     match: s => s.openerTags?.includes('kul-opener') },
  { id: 'oathOpener',       labelTr: 'Yemin ile',              labelEn: 'Oath',                      match: s => s.hasOath === true },
  { id: 'innaOpener',       labelTr: '"İnnâ" ile',             labelEn: '"Innā"',                    match: s => s.openerTags?.includes('inna') },
  { id: 'imperativeOpener', labelTr: 'Emir fiili ile',         labelEn: 'Imperative',                match: s => s.openerTags?.includes('imperative') && !s.openerTags?.includes('kul-opener') },
  { id: 'vocativeOpener',   labelTr: '"Yâ eyyuhâ" ile',        labelEn: 'Vocative',                  match: s => s.openerTags?.includes('vocative') },
  { id: 'divineNameCloser', labelTr: 'İlâhî sıfatla biten',    labelEn: 'Divine attribute closer',   match: s => s.closerTags?.includes('divine-name-closer') },
  { id: 'mekki',            labelTr: 'Mekkî',                  labelEn: 'Meccan',                    match: s => s.revelation === 'mekki' },
  { id: 'medeni',           labelTr: 'Medenî',                 labelEn: 'Medinan',                   match: s => s.revelation === 'medeni' },
];


export default function IlkSonKelimeler({ onClose, backRef }) {
  const { language } = useLanguage();
  const [data, setData]           = useState(null);
  const [spotlights, setSpotlights] = useState([]);
  const [activeFilter, setFilter] = useState('all');
  const [searchValue, setSearch]  = useState('');
  const [selected, setSelected]   = useState(null);
  const [isMobile, setIsMobile]   = useState(false)  // SSR-safe; useEffect h() post-mount hydrate;
  const fullListRef               = useRef(null);    // "114 Sûrenin Tamamı" başlığına anchor — filter chip'lerinden smooth scroll hedefi.

  // Back-nav: when a category filter is active, browser-back resets it AND
  // scrolls back to the category card the user originally clicked from.
  useEffect(() => {
    if (!backRef) return;
    if (activeFilter !== 'all') {
      const filterId = activeFilter; // capture for closure
      backRef.current = () => {
        setFilter('all');
        setTimeout(() => {
          document.getElementById(`category-${filterId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 80);
      };
    } else {
      backRef.current = null;
    }
    return () => { if (backRef) backRef.current = null; };
  }, [activeFilter, backRef]);

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < BREAKPOINT_MOBILE);
    h(); // post-mount hydrate
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  useEffect(() => {
    fetch('/ilk-son-kelimeler.json')
      .then(r => r.json())
      .then(setData)
      .catch(err => console.error('[IlkSonKelimeler] fetch failed:', err));
  }, []);

  useEffect(() => {
    fetch('/ilk-son-kelimeler-spotlights.json')
      .then(r => r.json())
      .then(d => setSpotlights(d.spotlights || []))
      .catch(err => console.error('[IlkSonKelimeler] spotlights fetch failed:', err));
  }, []);

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') { if (selected) setSelected(null); else onClose(); } };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose, selected]);

  // Body scroll lock KALDIRILDI — WowFacts (Kur'an'ı Tanı) pattern'ına göre
  // tool sayfaları normal-flow document scroll'a sahip olmalı. ToolHeader
  // sticky:top:62 bu sayede doğru çalışır (scrolling ancestor = document).

  const filtered = useMemo(() => {
    if (!data) return [];
    const fn = FILTERS.find(f => f.id === activeFilter)?.match ?? (() => true);
    let list = data.surahs.filter(fn);
    const q = searchValue.trim().toLowerCase();
    if (q.length >= 2) {
      list = list.filter(s => {
        const haystack = [
          s.nameTr, s.nameEn, s.nameAr,
          s.firstWord?.ar, s.firstWord?.translit, s.firstWord?.meaning,
          s.lastWord?.ar,  s.lastWord?.translit,  s.lastWord?.meaning,
          s.firstAyahArabic, s.lastAyahArabic,
          s.firstAyahTr, s.lastAyahTr,
          ...(s.openerTags || []), ...(s.closerTags || []),
          String(s.surah),
        ].filter(Boolean).join(' ').toLowerCase();
        return haystack.includes(q);
      });
    }
    return list;
  }, [data, activeFilter, searchValue]);

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (!data) {
    return (
      <div style={{
        background: COLORS.cosmicBlack,
        minHeight: 'calc(100vh - 62px)',
        display: 'flex', flexDirection: 'column',
        paddingTop: '62px',
      }}>
        <Header language={language} onClose={onClose} />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: COLORS.silver, fontSize: '0.9rem' }}>
            {language === 'tr' ? 'Yükleniyor…' : 'Loading…'}
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
      paddingTop: '62px', // global Navbar yüksekliği için boşluk (WowFacts pattern)
    }}>
      <ToolHeader
        icon={
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="5" cy="15" r="2.2" fill={COLORS.gold} stroke="none" />
            <circle cx="19" cy="15" r="2.2" fill={COLORS.gold} stroke="none" />
            <path d="M5 15 Q12 4 19 15" />
          </svg>
        }
        titleTr="İlk ve Son Kelimeler"
        titleEn="First and Last Words"
        subtitleTr="114 sûre · açılış-kapanış kelimesi"
        subtitleEn="114 surahs · opening-closing word"
        language={language}
      />

      {/* Search + Filter chip row — max-w-7xl container ile Navbar logoyla aynı hizada. */}
      <div
        className="max-w-7xl mx-auto px-4 lg:px-8"
        style={{
          flexShrink: 0,
          width: '100%', boxSizing: 'border-box',
          paddingTop: isMobile ? 12 : 14,
          borderBottom: `1px solid ${COLORS.glassBorderSoft || 'rgba(255,255,255,0.06)'}`,
          background: 'rgba(8,10,18,0.92)',
          backdropFilter: 'blur(20px)',
          display: 'flex', flexDirection: 'column', gap: '10px',
        }}
      >
        {/* Search */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxWidth: '440px' }}>
          <div style={{ position: 'relative' }}>
            <svg
              aria-hidden="true"
              width="14" height="14" viewBox="0 0 24 24"
              fill="none" stroke="rgba(148,163,184,0.4)" strokeWidth="2" strokeLinecap="round"
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder={language === 'tr' ? 'Sûre adı, Arapça/Latin kelime veya anlam…' : 'Surah name, Arabic/Latin word or meaning…'}
              value={searchValue}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', boxSizing: 'border-box',
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid ${COLORS.glassBgStrong}`,
                borderRadius: RADIUS.md,
                color: COLORS.offWhite, fontFamily: FONTS.body, fontSize: '0.85rem',
                padding: searchValue ? '8px 36px 8px 36px' : '8px 12px 8px 36px',
                outline: 'none',
                transition: `border-color ${TRANSITION.fast}`,
              }}
              onFocus={e => { e.currentTarget.style.borderColor = COLORS.goldAlpha45 || 'rgba(212,165,116,0.35)'; }}
              onBlur={e => { e.currentTarget.style.borderColor = COLORS.glassBgStrong; }}
            />
            {searchValue && (
              <button
                type="button"
                onClick={() => setSearch('')}
                aria-label={language === 'tr' ? 'Aramayı temizle' : 'Clear search'}
                style={{
                  position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '22px', height: '22px',
                  borderRadius: RADIUS.full,
                  background: 'rgba(255,255,255,0.06)',
                  border: 'none',
                  color: 'rgba(148,163,184,0.85)',
                  cursor: 'pointer',
                  transition: `background ${TRANSITION.fast}, color ${TRANSITION.fast}`,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = COLORS.offWhite; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(148,163,184,0.85)'; }}
              >
                <CloseIcon size={11} strokeWidth={2.6} />
              </button>
            )}
          </div>
          {/* Helper text — kullanıcıya örnek terimler ipucu verir + scope açıklar */}
          <p style={{
            fontSize: '0.68rem', color: 'rgba(148,163,184,0.55)',
            fontFamily: FONTS.body, margin: '0 0 0 2px',
            fontStyle: 'italic',
          }}>
            {language === 'tr'
              ? 'Örnek: "Fâtiha", "الْحَمْدُ", "ḥamd", "sapanlar" · açılış/kapanış ayetinin tamamında arar'
              : 'Examples: "Al-Fātiḥa", "الْحَمْدُ", "ḥamd", "go astray" · searches full opening/closing verses'}
          </p>
        </div>

        {/* Filter chips */}
        <div style={{
          display: 'flex', gap: '6px',
          overflowX: 'auto', flexShrink: 0, paddingBottom: '12px',
          scrollbarWidth: 'none',
        }}>
          {FILTERS.map(f => {
            const count = f.id === 'all' ? data.surahs.length : data.surahs.filter(f.match).length;
            const isActive = activeFilter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => {
                  setFilter(f.id);
                  setSelected(null);
                  // Filter aktive olunca alttaki "114 Sûrenin Tamamı" listesine smooth scroll.
                  // Gemini bulgusu: kullanıcı üstte tıklıyor ama altta neyin değiştiğini göremiyor.
                  // setTimeout ile bir tick bekle — filter state'i settle olsun, sonra scroll.
                  setTimeout(() => {
                    fullListRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 80);
                }}
                style={{
                  flexShrink: 0,
                  padding: '5px 12px', borderRadius: RADIUS.md,
                  background: isActive ? COLORS.goldAlpha15 : 'transparent',
                  border: `1px solid ${isActive ? (COLORS.goldAlpha45 || COLORS.goldAlpha45) : 'rgba(255,255,255,0.07)'}`,
                  color: isActive ? COLORS.gold : COLORS.silverAlpha70,
                  fontSize: '0.75rem', fontFamily: FONTS.body, fontWeight: isActive ? 600 : 400,
                  cursor: 'pointer', whiteSpace: 'nowrap',
                  display: 'flex', alignItems: 'center', gap: '6px',
                  transition: `all ${TRANSITION.fast}`,
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                    e.currentTarget.style.color = 'rgba(148,163,184,0.95)';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = COLORS.silverAlpha70;
                  }
                }}
              >
                {language === 'tr' ? f.labelTr : f.labelEn}
                <span style={{
                  background: isActive ? (COLORS.goldAlpha25 || COLORS.goldAlpha25) : 'rgba(255,255,255,0.06)',
                  borderRadius: RADIUS.xs,
                  color: isActive ? COLORS.gold : 'rgba(148,163,184,0.5)',
                  fontSize: '0.62rem', fontWeight: 600,
                  padding: '1px 6px',
                }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main body: grid (+ detail panel on desktop)
          WowFacts pattern: window-level scroll (no inner overflow) → ToolHeader
          sticky:top:62 gerçekten çalışır. */}
      <div style={{ flex: 1, display: 'flex' }}>
        {/* Grid */}
        <div id="ilk-son-grid-container" style={{
          flex: 1,
          padding: isMobile ? '14px' : '18px 24px 32px',
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '10px',
          alignContent: 'start',
        }}>
          {/* Açılış-Kapanış Spektrumu — 2026-07-10 Dalga 3 · Madde 5
              SpotlightSection'dan önce göster: narrative deep-dive'dan
              önce "bütün resim" geliyor, sonra 5 keşif ile aha momenti. */}
          {activeFilter === 'all' && searchValue.trim().length < 2 && (
            <div style={{ gridColumn: '1 / -1' }}>
              <AcilisKapanisSpektrum surahs={data.surahs} language={language} isMobile={isMobile} />
            </div>
          )}

          {activeFilter === 'all' && searchValue.trim().length < 2 && spotlights.length > 0 && (
            <div style={{ gridColumn: '1 / -1' }}>
              <SpotlightSection
                spotlights={spotlights}
                surahs={data.surahs}
                language={language}
                isMobile={isMobile}
                activeFilter={activeFilter}
                onFilterClick={(id) => {
                  setFilter(id);
                  // Phase 2: scroll grid header into view after filter applies
                  setTimeout(() => {
                    document.getElementById('ilk-son-grid-header')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 50);
                }}
              />
            </div>
          )}

          {/* Grid section header — always visible above the surah cards */}
          <div ref={fullListRef} id="ilk-son-grid-header" style={{
            gridColumn: '1 / -1',
            paddingTop: '20px',
            marginBottom: '4px',
            scrollMarginTop: '120px',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '14px',
              marginBottom: '12px',
            }}>
              <div style={{ flex: 1, height: '1px', background: `linear-gradient(to right, transparent, ${COLORS.goldAlpha25}, transparent)` }} />
              <span style={{
                fontSize: '0.64rem', fontFamily: FONTS.body, fontWeight: 700,
                letterSpacing: '0.3em', textTransform: 'uppercase',
                color: COLORS.gold, opacity: 0.65, whiteSpace: 'nowrap',
              }}>
                {language === 'tr' ? '114 Sûrenin Tamamı' : 'All 114 Surahs'}
              </span>
              <div style={{ flex: 1, height: '1px', background: `linear-gradient(to right, transparent, ${COLORS.goldAlpha25}, transparent)` }} />
            </div>
            {(() => {
              const isFiltered = activeFilter !== 'all' || searchValue.trim().length >= 2;
              return (
                <p style={{
                  textAlign: 'center',
                  fontFamily: FONTS.body, fontSize: '0.84rem',
                  color: COLORS.silver, opacity: 0.8,
                  margin: 0, lineHeight: 1.55,
                }}>
                  {isFiltered ? (
                    language === 'tr'
                      ? <>Filtrelenmiş <strong style={{ color: COLORS.gold }}>{filtered.length}</strong> sûre — yukarıdaki örüntüleri burada doğrulayın.</>
                      : <>Filtered to <strong style={{ color: COLORS.gold }}>{filtered.length}</strong> surahs — verify the patterns above here.</>
                  ) : (
                    language === 'tr'
                      ? 'Tüm sûrelerin ilk ve son kelimelerini tarayın. Yukarıda anlattıklarımızı burada doğrulayabilirsiniz.'
                      : 'Browse the opening and closing words of every surah. Verify the patterns we explored above.'
                  )}
                </p>
              );
            })()}
          </div>

          {filtered.map(s => (
            <Card key={s.surah} surah={s} onClick={() => setSelected(s)} selected={selected?.surah === s.surah} language={language} />
          ))}
          {filtered.length === 0 && (
            <div style={{ color: COLORS.silver, fontSize: '0.88rem', padding: '24px', gridColumn: '1 / -1', textAlign: 'center' }}>
              {language === 'tr' ? 'Bu filtre için sûre bulunamadı.' : 'No surahs for this filter.'}
            </div>
          )}
        </div>

        {/* Detail panel */}
        {selected && !isMobile && (
          <DetailPanel surah={selected} spotlights={spotlights} onClose={() => setSelected(null)} language={language} isMobile={false} />
        )}
      </div>

      {/* Mobile: detail as bottom sheet */}
      {selected && isMobile && (
        <DetailPanel surah={selected} spotlights={spotlights} onClose={() => setSelected(null)} language={language} isMobile={true} />
      )}

      {/* ════ Closing — Paradox Synthesis + Cross-tool CTA Strip ════════
          Flex parent DIŞINDA: yoksa grid ile yan yana yerleşip 2-kolon
          layout oluşturur. Burada full-width block flow olarak iner.
          Sadece varsayılan (filtresiz) görünümde çıkar; filtreli görünümde
          visitor "tarama modunda" — bekleyen closing kesintiye uğratmaz. */}
      {activeFilter === 'all' && searchValue.trim().length < 2 && (
        <ClosingSynthesis language={language} isMobile={isMobile} />
      )}

      <CrossToolCTA
        language={language}
        isMobile={isMobile}
        links={[
          { href: `/${language}/arac/renkler`, titleTr: "Kur'an'ın Renkleri", titleEn: 'Colors of the Quran', descTr: 'İlk-son gibi bir tekrar sistemi — 11 renk evreni.', descEn: 'Another recurrence system — 11 color domains.' },
          { href: `/${language}/arac/mukattaa`, titleTr: 'Mukattaa Harfleri', titleEn: 'Mukaṭṭaʿāt Letters', descTr: "Kur'an'ın en gizemli açılışları.", descEn: "The Quran's most mysterious openings." },
          { href: `/${language}/arac/halka-kompozisyon`, titleTr: 'Halka Kompozisyon', titleEn: 'Ring Composition', descTr: 'Açılış ↔ Kapanış mimarisi — büyük ölçek.', descEn: 'Opening ↔ closing architecture — macro scale.' },
        ]}
      />
    </div>
  );
}

// ─── Header — STANDART TOOL ALT-HEADER (WowFacts parity) ─────────────────────
// OVERLAY_HEADER token outer style + max-width 1200 container (Navbar hizalı).
// Close button KALDIRILDI — browser back + global Navbar bu rolü yapar.
// onClose prop tutuldu (legacy compat) ama JSX'te kullanılmıyor.
// eslint-disable-next-line no-unused-vars
function Header({ language, onClose }) {
  return (
    <div style={{ ...OVERLAY_HEADER, justifyContent: 'flex-start' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        {/* BridgeIcon — iki kelime arasındaki bağ/köprü temasını anlatır:
            iki uçta dolgu nokta + bunları birleştiren ince yay (arch). */}
        <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <circle cx="5" cy="15" r="2.2" fill={COLORS.gold} stroke="none" />
          <circle cx="19" cy="15" r="2.2" fill={COLORS.gold} stroke="none" />
          <path d="M5 15 Q12 4 19 15" />
        </svg>
        <span style={OVERLAY_TITLE}>
          {language === 'tr' ? 'İlk ve Son Kelimeler' : 'First and Last Words'}
        </span>
        <span style={{ color: COLORS.slate500, fontSize: '0.8rem', flexShrink: 0 }}>·</span>
        <span style={{ color: COLORS.slate500, fontSize: '0.78rem', fontFamily: FONTS.body, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {language === 'tr' ? '114 sûre · açılış-kapanış kelimesi' : '114 surahs · opening-closing word'}
        </span>
      </div>
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────
// Standart proje renkleri (VerseGraph + tokens.js):
//   Mekkî  → COLORS.royalGold   (#c9a227 — çöl, kökler)
//   Medenî → COLORS.emerald     (#1a7a4c — medeniyet, büyüme)
function Card({ surah, onClick, selected, language }) {
  const name = language === 'tr' ? surah.nameTr : (surah.nameEn || surah.nameTr);
  const isMedeni = surah.revelation === 'medeni';
  const revColor = isMedeni ? '#2ecc71' : COLORS.royalGold; // soft emerald for readability on dark bg
  return (
    <div
      id={`ilk-son-card-${surah.surah}`}
      style={{
        scrollMarginTop: '160px',
        position: 'relative',
      }}
    >
      <button
        onClick={onClick}
        style={{
          width: '100%',
          textAlign: 'left',
          background: selected ? COLORS.goldAlpha15 : 'rgba(255,255,255,0.035)',
          border: `1px solid ${selected ? COLORS.goldAlpha40 : 'rgba(255,255,255,0.12)'}`,
          borderRadius: RADIUS.md,
          padding: '11px 13px 14px',
          cursor: 'pointer',
          transition: `all ${TRANSITION.fast}`,
          display: 'flex', flexDirection: 'column', gap: '8px',
          fontFamily: FONTS.body,
          minHeight: '110px',
          overflow: 'hidden',
        }}
        onMouseEnter={e => { if (!selected) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)'; }}
        onMouseLeave={e => { if (!selected) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
      >
      {/* Top: surah no + name + revelation badge */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', flexWrap: 'wrap' }}>
        <span style={{ color: COLORS.gold, fontSize: '0.66rem', fontWeight: 700, letterSpacing: '0.06em' }}>
          {String(surah.surah).padStart(3, '0')}
        </span>
        <span style={{ color: COLORS.offWhite, fontSize: '0.84rem', fontWeight: 600 }}>{name}</span>
        <span style={{
          marginLeft: 'auto',
          marginRight: '28px',
          fontSize: '0.56rem', letterSpacing: '0.12em', textTransform: 'uppercase',
          color: revColor,
          opacity: 0.85,
          fontWeight: 700,
        }}>
          {isMedeni
            ? (language === 'tr' ? 'Medenî' : 'Medinan')
            : (language === 'tr' ? 'Mekkî'  : 'Meccan')}
        </span>
      </div>

      {/* Middle: first word → last word.
          Akış soldan sağa (LTR sezgi): firstWord solda, lastWord sağda, ok → sağa.
          Renk semiyotiği: ilk kelime altın (damga/açılış vurgusu), son kelime
          off-white (nötr kapanış). */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '6px' }}>
        <div style={{ textAlign: 'right', minWidth: 0, overflow: 'hidden' }}>
          <div dir="rtl" lang="ar" style={{
            fontFamily: FONTS.quran, fontSize: '1.4rem', color: COLORS.gold,
            lineHeight: 1.4, direction: 'rtl',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {cleanArabic(surah.firstWord?.ar) || '—'}
          </div>
        </div>
        <span style={{ color: COLORS.goldAlpha45 || COLORS.goldAlpha45, fontSize: '0.95rem', opacity: 0.7 }}>→</span>
        <div style={{ textAlign: 'left', minWidth: 0, overflow: 'hidden' }}>
          <div dir="rtl" lang="ar" style={{
            fontFamily: FONTS.quran, fontSize: '1.4rem', color: COLORS.offWhite,
            lineHeight: 1.4, direction: 'rtl',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {cleanArabic(surah.lastWord?.ar) || '—'}
          </div>
        </div>
      </div>

      {/* Tags — opener + closer + structural; lokalize edilmiş. mukattaa/oath ayrı flag.
          Hiç tag yoksa (Nisâ, Mâide gibi) "uncategorized" fallback — kart layout tutarlılığı için. */}
      {(() => {
        const openerTagsClean = (surah.openerTags || []).filter(t => t !== 'mukattaa' && t !== 'oath');
        const closerTagsClean = (surah.closerTags || []).filter(t => t !== 'mukattaa' && t !== 'oath');
        const isEmpty = !surah.hasMukattaa && !surah.hasOath && openerTagsClean.length === 0 && closerTagsClean.length === 0;
        return (
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: 'auto' }}>
            {surah.hasMukattaa && <Tag slug="mukattaa" language={language} />}
            {surah.hasOath && <Tag slug="oath" language={language} />}
            {openerTagsClean.map(t => <Tag key={'o-' + t} slug={t} language={language} />)}
            {closerTagsClean.map(t => <Tag key={'c-' + t} slug={t} language={language} />)}
            {isEmpty && <Tag slug="uncategorized" language={language} />}
          </div>
        );
      })()}
      </button>
      {/* #201 (2026-07-16) — Bookmark ilk-son pair */}
      <div style={{ position: 'absolute', top: 8, right: 8 }}>
        <BookmarkButton
          item={{
            id: `ilk-son:${surah.surah}`,
            type: 'ilk-son',
            title: `${name} — ${language === 'tr' ? 'İlk-Son' : 'First-Last'}`,
            subtitle: `${String(surah.surah).padStart(3, '0')} · ${isMedeni ? (language === 'tr' ? 'Medenî' : 'Medinan') : (language === 'tr' ? 'Mekkî' : 'Meccan')}`,
            description: `${surah.firstWord?.ar || ''} → ${surah.lastWord?.ar || ''}`,
            url: `/${language}/arac/ilk-son-kelimeler`,
          }}
          size="sm"
          language={language}
        />
      </div>
    </div>
  );
}

// Internal tag slug → lokalize label. Programatik etiketler (divine-praise gibi)
// karta sızıyordu; bu dictionary TR/EN'ye çevirir, slug fallback kalır.
const TAG_LABELS = {
  'mukattaa':           { tr: 'mukattaa',          en: 'muqaṭṭaʿāt' },
  'oath':               { tr: 'yemin',             en: 'oath' },
  'divine-praise':      { tr: 'ilahî övgü',        en: 'divine praise' },
  'kul-opener':         { tr: '"Kul" ile',          en: '"Qul" opener' },
  'inna':               { tr: '"İnnâ"',             en: '"Innā"' },
  'imperative':         { tr: 'emir fiili',        en: 'imperative' },
  'vocative':           { tr: '"Yâ eyyuhâ"',        en: 'vocative' },
  'negative-other':     { tr: 'olumsuz kapanış',   en: 'negative closer' },
  'divine-name-closer': { tr: 'ilahî isimle',      en: 'divine name closer' },
  'declarative':        { tr: 'bildirim açılışı',  en: 'declarative opener' },
  'tasbih':             { tr: 'tesbih ile',         en: 'tasbīḥ' },
  'interrogative':      { tr: 'soru ile',           en: 'interrogative' },
  'single-divine-name': { tr: 'tek ilahî isim',     en: 'single divine name' },
  'uncategorized':      { tr: 'sınıflandırılmamış',en: 'unclassified' },
};

function Tag({ slug, language }) {
  const entry = TAG_LABELS[slug];
  const label = entry ? (language === 'tr' ? entry.tr : entry.en) : slug;
  return (
    <span style={{
      padding: '1px 6px', borderRadius: '3px',
      background: 'rgba(212,165,116,0.10)',
      color: COLORS.gold, fontSize: '0.6rem',
      letterSpacing: '0.04em', fontWeight: 500,
      lineHeight: 1.4,
    }}>
      {label}
    </span>
  );
}

// ─── Detail panel (right drawer on desktop, bottom sheet on mobile) ───────────
function DetailPanel({ surah, spotlights, onClose, language, isMobile }) {
  const router = useRouter();
  const name = language === 'tr' ? surah.nameTr : (surah.nameEn || surah.nameTr);
  const tr = language === 'tr';

  // Find spotlights that include this surah
  const relatedSpotlights = (spotlights || []).filter(sp => {
    if (sp.leftSurah?.num === surah.surah || sp.rightSurah?.num === surah.surah) return true;
    if (sp.items?.some(it => it.num === surah.surah)) return true;
    return false;
  });

  const goToSpotlight = (id) => {
    onClose();
    // Wait for detail panel to close before scrolling, so the spotlight card is visible
    setTimeout(() => {
      document.getElementById(`spotlight-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const panelStyle = isMobile ? {
    position: 'fixed', left: 0, right: 0, bottom: 0, top: '15%',
    background: COLORS.cosmicBlack,
    borderTop: `1px solid ${COLORS.goldAlpha25 || COLORS.goldAlpha25}`,
    boxShadow: '0 -12px 40px rgba(0,0,0,0.5)',
    zIndex: 50,
    display: 'flex', flexDirection: 'column',
  } : {
    width: '420px', flexShrink: 0,
    borderLeft: `1px solid ${COLORS.goldAlpha25 || COLORS.goldAlpha25}`,
    background: 'rgba(8,9,26,0.72)',
    display: 'flex', flexDirection: 'column',
    overflow: 'hidden',
  };

  return (
    <aside style={panelStyle} aria-label={language === 'tr' ? 'Sûre detayı' : 'Surah detail'}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 18px', borderBottom: `1px solid ${COLORS.glassBorderSoft || 'rgba(255,255,255,0.06)'}`,
        flexShrink: 0,
      }}>
        <div>
          <div style={{ color: COLORS.gold, fontSize: '0.65rem', letterSpacing: '0.16em', fontWeight: 700, textTransform: 'uppercase', marginBottom: '3px' }}>
            {language === 'tr' ? 'Sûre' : 'Surah'} {surah.surah} · {surah.ayahCount} {language === 'tr' ? 'ayet' : 'verses'}
          </div>
          <div style={{ color: COLORS.offWhite, fontSize: '1.05rem', fontWeight: 700, fontFamily: FONTS.body }}>{name}</div>
        </div>
        <button
          onClick={onClose}
          aria-label={language === 'tr' ? 'Sûre detayını kapat' : 'Close surah detail'}
          style={{
            width: '30px', height: '30px', borderRadius: RADIUS.full,
            background: 'rgba(255,255,255,0.05)', border: `1px solid ${COLORS.glassBorderSoft || COLORS.glassBorder}`,
            color: COLORS.silver, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: `all ${TRANSITION.fast}`,
          }}
        >
          <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '18px', fontFamily: FONTS.body }}>
        {/* First ayah */}
        <AyahBlock
          label={language === 'tr' ? 'İlk Ayet' : 'First Verse'}
          verseRef={surah.firstAyahRef}
          word={surah.firstWord}
          ayahAr={surah.firstAyahArabic}
          ayahTr={surah.firstAyahTr}
          language={language}
        />
        {/* Last ayah */}
        <div style={{ height: '18px' }} />
        <AyahBlock
          label={language === 'tr' ? 'Son Ayet' : 'Last Verse'}
          verseRef={surah.lastAyahRef}
          word={surah.lastWord}
          ayahAr={surah.lastAyahArabic}
          ayahTr={surah.lastAyahTr}
          language={language}
        />

        {/* Note (if present) */}
        {surah.note && (
          <div style={{
            marginTop: '18px', padding: '12px 14px',
            background: 'rgba(212,165,116,0.06)', borderLeft: `2px solid ${COLORS.goldAlpha40 || 'rgba(212,165,116,0.4)'}`,
            borderRadius: RADIUS.xs, fontSize: '0.78rem', color: COLORS.silver, lineHeight: 1.6,
          }}>
            <div style={{ color: COLORS.gold, fontSize: '0.62rem', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '4px', fontWeight: 700 }}>
              {language === 'tr' ? 'Not' : 'Note'}
            </div>
            {surah.note}
          </div>
        )}

        {/* Related Spotlights — surah'nın yer aldığı spotlight kartları */}
        {relatedSpotlights.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <div style={{
              fontSize: '0.62rem', fontFamily: FONTS.body, fontWeight: 700,
              letterSpacing: '0.22em', textTransform: 'uppercase',
              color: COLORS.gold, opacity: 0.75, marginBottom: '10px',
            }}>
              {tr ? 'Bu Sûre Şu Spotlight\'larda' : 'Featured in Spotlights'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {relatedSpotlights.map(sp => (
                <button
                  key={sp.id}
                  onClick={() => goToSpotlight(sp.id)}
                  style={{
                    textAlign: 'left',
                    padding: '10px 12px',
                    background: 'rgba(212,165,116,0.05)',
                    border: `1px solid ${COLORS.goldAlpha25}`,
                    borderRadius: RADIUS.sm,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: `all ${TRANSITION.fast}`,
                    display: 'flex', flexDirection: 'column', gap: '4px',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = COLORS.goldAlpha15;
                    e.currentTarget.style.borderColor = COLORS.goldAlpha45 || COLORS.goldAlpha45;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(212,165,116,0.05)';
                    e.currentTarget.style.borderColor = COLORS.goldAlpha25;
                  }}
                >
                  <span style={{
                    fontSize: '0.58rem', fontFamily: FONTS.body, fontWeight: 700,
                    letterSpacing: '0.18em', textTransform: 'uppercase',
                    color: COLORS.gold, opacity: 0.7,
                  }}>
                    {tr ? sp.categoryLabelTr : sp.categoryLabelEn}
                  </span>
                  <span style={{
                    fontFamily: FONTS.body, fontSize: '0.84rem', fontWeight: 600,
                    color: COLORS.offWhite, lineHeight: 1.35,
                  }}>
                    {tr ? sp.titleTr : sp.titleEn}
                  </span>
                  <span style={{
                    fontSize: '0.7rem', color: COLORS.gold, opacity: 0.7,
                    fontWeight: 600, letterSpacing: '0.02em',
                  }}>
                    {tr ? 'Spotlight\'a Git →' : 'Go to Spotlight →'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tafsir link */}
        <button
          onClick={() => {
            // W22-U2: dispatchEvent → route push. openTafsirPanel listener'ı
            // mevcut değil (dead); ReadingMode route'una surah+ayet ile gidip
            // sayfa içindeki Tefsir panelini açar.
            onClose();
            router.push(`/${language}/oku/${surah.surah}?ayah=1`);
          }}
          style={{
            marginTop: '20px',
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '9px 14px',
            background: 'rgba(212,165,116,0.08)',
            border: `1px solid ${COLORS.goldAlpha25 || COLORS.goldAlpha25}`,
            borderRadius: RADIUS.md,
            color: COLORS.gold,
            fontSize: '0.78rem', fontWeight: 600,
            fontFamily: FONTS.body,
            cursor: 'pointer',
            transition: `all ${TRANSITION.fast}`,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = COLORS.goldAlpha15;
            e.currentTarget.style.borderColor = COLORS.goldAlpha45 || COLORS.goldAlpha45;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(212,165,116,0.08)';
            e.currentTarget.style.borderColor = COLORS.goldAlpha25 || COLORS.goldAlpha25;
          }}
        >
          <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
          {language === 'tr' ? 'Bu sûrenin tefsirini oku' : 'Read this surah\'s tafsir'}
        </button>
      </div>
    </aside>
  );
}

function AyahBlock({ label, verseRef, word, ayahAr, ayahTr, language }) {
  return (
    <div>
      <div style={{ color: COLORS.gold, fontSize: '0.62rem', letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px' }}>
        {label} <span style={{ opacity: 0.65 }}>· {verseRef}</span>
      </div>

      {/* Word spotlight */}
      <div style={{
        padding: '12px 14px', marginBottom: '10px',
        background: 'rgba(212,165,116,0.05)',
        border: '1px solid rgba(212,165,116,0.15)',
        borderRadius: RADIUS.md,
        display: 'flex', alignItems: 'center', gap: '14px',
      }}>
        <div dir="rtl" lang="ar" style={{
          fontFamily: FONTS.quran, fontSize: '1.65rem', color: COLORS.offWhite,
          direction: 'rtl', lineHeight: 1.2,
          minWidth: '60px',
        }}>
          {cleanArabic(word?.ar) || '—'}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          {word?.translit && <div style={{ color: COLORS.gold, fontSize: '0.82rem', fontStyle: 'italic', fontWeight: 500 }}>{word.translit}</div>}
          {word?.meaning && <div style={{ color: COLORS.offWhite, fontSize: '0.78rem', marginTop: '2px' }}>{word.meaning}</div>}
          {word?.root && <div style={{ color: COLORS.silver, fontSize: '0.7rem', marginTop: '4px', opacity: 0.75 }}>
            {language === 'tr' ? 'kök' : 'root'}: <span dir="rtl" lang="ar" style={{ fontFamily: FONTS.quran }}>{word.root}</span>
          </div>}
        </div>
      </div>

      {/* Full ayah — canonical VERSE_BLOCK (§13.5) */}
      {ayahAr && (
        <div style={{ ...VERSE_BLOCK, padding: '14px 16px' }}>
          <div dir="rtl" lang="ar" style={{
            ...TEXT.verseArabic,
            fontSize: '1.15rem',
            color: COLORS.offWhite,
            marginBottom: ayahTr ? '10px' : 0,
          }}>
            {cleanArabic(ayahAr)}
          </div>
          {ayahTr && (
            <div style={{ color: COLORS.silver, fontSize: '0.8rem', lineHeight: 1.6, fontStyle: 'italic' }}>
              {ayahTr}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Spotlight Section ────────────────────────────────────────────────────────
// Münâsebât-ı Süver çerçevesinde 7 öne çıkan kelime bağı kartı.
// Bridge / ring / family / cluster / intra-bridge / intra-ring tipleri.
function SpotlightSection({ spotlights, surahs, language, isMobile, activeFilter, onFilterClick }) {
  if (!spotlights || spotlights.length === 0) return null;
  const tr = language === 'tr';
  return (
    <div style={{
      maxWidth: '960px',
      margin: '0 auto 32px',
      padding: isMobile ? '0 4px' : 0,
    }}>
      {/* ════ CINEMATIC HERO — Premium Template Pilot ══════════════════════
          Bismillah ornament + Nisâ 4:82 (sayfanın tezi) + framing whisper.
          Premium tool page template'in ilk pilotu — Esma flagship pattern. */}
      <div style={{
        marginBottom: '36px',
        padding: isMobile ? '40px 8px 24px' : '60px 0 32px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <HeroGeometricBackground />
        <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Bismillah ornament — small decorative, KFGQPC'de U+FDFD glyph yok,
            Amiri Quran ligature kullanılır (§13.2 documented exception) */}
        <div
          dir="rtl"
          lang="ar"
          aria-label="Bismillāh"
          style={{
            fontFamily: FONTS.bismillah,
            fontSize: isMobile ? '1.6rem' : '2rem',
            color: COLORS.gold,
            opacity: 0.82,
            lineHeight: 1,
            marginBottom: isMobile ? '32px' : '44px',
            textShadow: `0 0 20px ${COLORS.gold}22`,
          }}
        >
          ﷽
        </div>

        {/* Anchor verse — Nisâ 4:82 (Kur'an'ın iç tutarlılığını argüman yapan ayet) */}
        <p
          dir="rtl"
          lang="ar"
          style={{
            fontFamily: FONTS.quran,
            fontSize: isMobile ? 'clamp(1.05rem, 4.2vw, 1.4rem)' : 'clamp(1.3rem, 2.6vw, 1.8rem)',
            color: COLORS.gold,
            lineHeight: 2.1,
            margin: '0 auto 18px',
            maxWidth: '780px',
            textShadow: `0 0 22px ${COLORS.gold}1c`,
          }}
        >
          اَفَلَا يَتَدَبَّرُونَ الْقُرْاٰنَ وَلَوْ كَانَ مِنْ عِنْدِ غَيْرِ اللّٰهِ لَوَجَدُوا فٖيهِ اخْتِلَافًا كَثٖيرًا
        </p>

        <p style={{
          color: COLORS.offWhite,
          fontFamily: FONTS.display,
          fontStyle: 'italic',
          fontSize: isMobile ? '0.94rem' : 'clamp(0.95rem, 1.6vw, 1.05rem)',
          lineHeight: 1.7,
          margin: '0 auto 8px',
          maxWidth: '620px',
          opacity: 0.95,
        }}>
          "{tr
            ? 'Hâlâ Kur\'an üzerinde gereği gibi düşünmeyecekler mi? Eğer O Allah\'tan başkasından gelseydi, içinde birçok çelişki bulurlardı.'
            : 'Will they not then ponder the Qur\'an? Had it been from any other than Allah, they would have found many contradictions in it.'}"
        </p>

        <p style={{
          color: COLORS.silver,
          fontFamily: FONTS.body,
          fontSize: '0.72rem',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          margin: '0 0 36px',
          opacity: 0.65,
        }}>
          — {tr ? 'Nisâ 4:82' : 'al-Nisāʾ 4:82'}
        </p>

        {/* Framing whisper — sayfanın tezi visitor'a önceden açar */}
        <p style={{
          color: COLORS.silver,
          fontFamily: FONTS.display,
          fontStyle: 'italic',
          fontSize: isMobile ? '0.92rem' : 'clamp(0.95rem, 1.5vw, 1.02rem)',
          lineHeight: 1.7,
          margin: '0 auto 40px',
          maxWidth: '640px',
          opacity: 0.85,
        }}>
          {tr
            ? <>Açılış ve kapanış arasındaki uyum tesadüf olabilir mi? <em style={{ fontStyle: 'normal', color: COLORS.gold, opacity: 0.95 }}>Tutarlılık iddianın değil, metnin kendi şahididir.</em></>
            : <>Could the harmony between opening and closing be coincidence? <em style={{ fontStyle: 'normal', color: COLORS.gold, opacity: 0.95 }}>Coherence is the witness of the text itself, not of any claim.</em></>}
        </p>

        {/* Filigree divider */}
        <div aria-hidden="true" style={{
          width: '120px',
          height: '1px',
          background: `linear-gradient(to right, transparent, ${COLORS.gold}66, transparent)`,
          margin: '0 auto 32px',
        }} />

        {/* Eyebrow + Title — Manifesto Statement */}
        <div style={{
          fontSize: '0.68rem', fontFamily: FONTS.body, fontWeight: 700,
          letterSpacing: '0.3em', textTransform: 'uppercase',
          color: COLORS.gold, opacity: 0.72, marginBottom: '14px',
        }}>
          {tr ? 'Münâsebât-ı Süver · 114 Mührün Şifresi' : 'Munāsabāt al-Suwar · The Cipher of 114 Seals'}
        </div>
        <h2 style={{
          fontFamily: FONTS.display, fontWeight: 700,
          fontSize: isMobile ? 'clamp(1.6rem, 7vw, 2rem)' : 'clamp(2rem, 3.6vw, 2.8rem)',
          color: COLORS.offWhite, margin: '0 0 16px',
          lineHeight: 1.15,
          letterSpacing: '-0.015em',
          maxWidth: '760px',
          marginLeft: 'auto', marginRight: 'auto',
        }}>
          {tr ? 'Sûrelerin Damgaları' : 'The Seals of the Surahs'}
        </h2>

        {/* Dramatic subtitle — page thesis in single line */}
        <p style={{
          fontFamily: FONTS.display,
          fontSize: isMobile ? '1rem' : 'clamp(1.05rem, 1.8vw, 1.2rem)',
          color: COLORS.gold,
          margin: '0 auto 28px',
          lineHeight: 1.5,
          fontStyle: 'italic',
          maxWidth: '680px',
          opacity: 0.92,
        }}>
          {tr
            ? 'Her sûre bir mektup gibi açılır, ve bir cevapla kapanır.'
            : 'Every surah opens like a letter — and closes with a reply.'}
        </p>
        </div>
      </div>

      {/* ════ Manifesto descriptive paragraphs ════════════════════════════ */}
      <div style={{ marginBottom: '32px', textAlign: isMobile ? 'left' : 'left' }}>
        <p style={{
          fontFamily: FONTS.body,
          fontSize: isMobile ? '0.9rem' : '0.95rem',
          color: COLORS.silver, margin: '0 0 14px', lineHeight: 1.75,
          maxWidth: '760px',
        }}>
          {tr
            ? 'Her sûrenin ilk ve son kelimesi tesadüf değildir. Klasik İslâm âlimliğinde bunun bir adı vardır: Münâsebât-ı Süver — sûreler arası ve sûre içi bağıntılar bilimi. Süyûtî el-İtkân\'da, Bikâî Nazmü\'d-Dürer\'de, Râzî Mefâtîhu\'l-Gayb\'da bu örüntüleri ciltler dolusu çalıştı. Modern Batı akademisinde Mustansir Mir ve Raymond Farrin bu konuyu yeniden gündeme getirdi.'
            : 'The first and last words of every surah are no accident. Classical Islamic scholarship has a name for this: Munāsabāt al-Suwar — the science of inter- and intra-surah connections. Al-Suyūṭī in al-Itqān, al-Biqāʿī in Naẓm al-Durar, and al-Rāzī in Mafātīḥ al-Ghayb devoted volumes to these patterns. In modern Western scholarship, Mustansir Mir and Raymond Farrin have revived the field.'}
        </p>
        <p style={{
          fontFamily: FONTS.body,
          fontSize: isMobile ? '0.9rem' : '0.95rem',
          color: COLORS.silver, margin: 0, lineHeight: 1.75,
          maxWidth: '760px',
        }}>
          {tr
            ? 'Aşağıdaki yedi örnek, 114 sûrenin damgalarında saklı duran bağıntıları açar — bir sûre bittiği yerden bir sonrakine köprü kurar; bazen kendi başlangıcına döner; bazen yedi sûre tek imzayla aynı kapanışı paylaşır.'
            : 'The seven examples below open the connections hidden in the seals of the 114 surahs — one surah bridges from where it ends to where the next begins; sometimes it returns to its own beginning; sometimes seven surahs share one signature with parallel endings.'}
        </p>

        {/* Çekirdek örnek pointer */}
        <div style={{
          marginTop: '20px',
          padding: '10px 14px',
          background: COLORS.goldAlpha04,
          border: `1px solid ${COLORS.goldAlpha25}`,
          borderRadius: RADIUS.sm,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          maxWidth: '100%',
        }}>
          <span style={{
            fontSize: '0.6rem', fontFamily: FONTS.body, fontWeight: 700,
            letterSpacing: '0.22em', textTransform: 'uppercase',
            color: COLORS.gold, opacity: 0.8,
            flexShrink: 0,
          }}>
            {tr ? 'Çekirdek Örnek' : 'Canonical Example'}
          </span>
          <span style={{
            fontSize: '0.82rem', fontFamily: FONTS.body,
            color: COLORS.offWhite, opacity: 0.85,
          }}>
            {tr ? 'Fâtiha 7 → Bakara 2 — duâ ve cevap köprüsü' : 'Al-Fātiḥa 7 → Al-Baqara 2 — the prayer-and-answer bridge'}
          </span>
        </div>
      </div>

      {/* Bilmediğin 5 Şey — teaser hooks */}
      <KnowYouDidNotKnow language={language} isMobile={isMobile} />

      {/* Spotlight cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {spotlights.map(sp => (
          <SpotlightCard key={sp.id} spotlight={sp} language={language} isMobile={isMobile} />
        ))}
      </div>

      {/* Çapraz Okuma — Pattern category insights */}
      <CrossReadingSection
        surahs={surahs}
        language={language}
        isMobile={isMobile}
        activeFilter={activeFilter}
        onFilterClick={onFilterClick}
      />
    </div>
  );
}

// ─── Closing Synthesis — Paradox Conclusion + Cross-tool CTA Strip ───────────
// Premium template kapanışı: Hero'da açtığımız tezi (Nisâ 4:82 + framing
// whisper) burada SENTEZ olarak bağlar; ardından 3 cross-tool kart.
function ClosingSynthesis({ language, isMobile }) {
  const tr = language === 'tr';
  return (
    <div style={{
      marginTop: isMobile ? '40px' : '60px',
      padding: isMobile ? '50px 20px 60px' : '80px 32px 80px',
      borderTop: `1px solid ${COLORS.glassBorderSoft || 'rgba(255,255,255,0.06)'}`,
      maxWidth: '900px',
      marginLeft: 'auto',
      marginRight: 'auto',
    }}>
      {/* Eyebrow */}
      <div style={{
        fontSize: '0.68rem', fontFamily: FONTS.body, fontWeight: 700,
        letterSpacing: '0.3em', textTransform: 'uppercase',
        color: COLORS.gold, opacity: 0.72,
        marginBottom: '20px', textAlign: 'center',
      }}>
        {tr ? 'Tefekkür' : 'Reflection'}
      </div>

      {/* Paradox synthesis statement — Hero'daki Nisâ 4:82'yi cevaplayan kapanış */}
      <h3 style={{
        fontFamily: FONTS.display, fontWeight: 700,
        fontSize: isMobile ? 'clamp(1.45rem, 5.5vw, 1.8rem)' : 'clamp(1.7rem, 2.8vw, 2.15rem)',
        color: COLORS.offWhite,
        textAlign: 'center',
        lineHeight: 1.3,
        letterSpacing: '-0.01em',
        margin: '0 auto 28px',
        maxWidth: '780px',
      }}>
        {tr
          ? <>İlk söz: <em style={{ fontStyle: 'normal', color: COLORS.gold }}>Bismillâh</em>. Son söz: <em style={{ fontStyle: 'normal', color: COLORS.gold }}>"Bu, insanların Rabbidir."</em></>
          : <>The first word: <em style={{ fontStyle: 'normal', color: COLORS.gold }}>Bismillāh</em>. The last word: <em style={{ fontStyle: 'normal', color: COLORS.gold }}>"This is the Lord of mankind."</em></>}
      </h3>

      {/* Synthesis paragraph */}
      <p style={{
        fontFamily: FONTS.display, fontStyle: 'italic',
        color: COLORS.silver,
        fontSize: isMobile ? '1rem' : 'clamp(1rem, 1.7vw, 1.12rem)',
        lineHeight: 1.75,
        textAlign: 'center',
        margin: '0 auto 50px',
        maxWidth: '700px',
        opacity: 0.92,
      }}>
        {tr
          ? <>114 sûre arasında, açılışta vaad edilen rahmet sonunda sığınılan koruma olur. <strong style={{ color: COLORS.gold, fontStyle: 'normal', fontWeight: 600 }}>Mushaf bir döngüdür</strong> — ama döngü her seferinde aynı yere bağlanmaz; yeni bir mühre açılır.</>
          : <>Across the 114 surahs, the mercy promised at the opening becomes the refuge sought at the end. <strong style={{ color: COLORS.gold, fontStyle: 'normal', fontWeight: 600 }}>The Mushaf is a cycle</strong> — but the cycle never returns to the same place; it opens onto a new seal.</>}
      </p>

      {/* Cross-tool CTA strip — 3 derin link */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{
          textAlign: 'center', marginBottom: '20px',
        }}>
          <span style={{
            fontSize: '0.68rem', fontFamily: FONTS.body, fontWeight: 700,
            letterSpacing: '0.24em', textTransform: 'uppercase',
            color: COLORS.gold, opacity: 0.7,
          }}>
            {tr ? 'Daha Derine — İlgili Araçlar' : 'Go Deeper — Related Tools'}
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: '12px',
        }}>
          {[
            { href: `/${language}/oku/1`, titleTr: 'Fâtiha\'dan Başla', titleEn: 'Begin with Al-Fātiḥa', descTr: 'Mushafın açılış mührü — namazın ve duanın yapı taşı.', descEn: 'The opening seal of the Mushaf — the foundation of prayer and supplication.' },
            { href: `/${language}/oku/114`, titleTr: 'Nâs ile Mührle', titleEn: 'Seal with An-Nās', descTr: 'Son sûre — "İnsanların Rabbi" sığınma mührüyle Mushafı kapat ve döngüyü yaşa.', descEn: 'The final sura — close the Mushaf with the refuge-seal of "the Lord of mankind."' },
            { href: `/${language}/graf/kavram`, titleTr: 'Sûreler Arası Ağı Gör', titleEn: 'See the Inter-Sura Network', descTr: 'Kavram Grafiği: 114 sûrenin tematik bağlantılarını ağ olarak gezin.', descEn: 'Concept Graph: explore the thematic connections between the 114 suras as a network.' },
          ].map((t, i) => (
            <a
              key={i}
              href={t.href}
              style={{
                display: 'block',
                background: `linear-gradient(180deg, ${COLORS.goldAlpha04} 0%, rgba(255,255,255,0.02) 100%)`,
                border: `1px solid ${COLORS.goldAlpha25}`,
                borderRadius: RADIUS.lg,
                padding: isMobile ? '20px 18px' : '22px 22px',
                textDecoration: 'none',
                transition: `all ${TRANSITION.base}`,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = `linear-gradient(180deg, ${COLORS.goldAlpha04} 0%, rgba(255,255,255,0.05) 100%)`;
                e.currentTarget.style.borderColor = COLORS.goldAlpha45 || 'rgba(212,165,116,0.45)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = `linear-gradient(180deg, ${COLORS.goldAlpha04} 0%, rgba(255,255,255,0.02) 100%)`;
                e.currentTarget.style.borderColor = COLORS.goldAlpha25;
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: '8px',
              }}>
                <h4 style={{
                  fontFamily: FONTS.body, fontWeight: 700,
                  fontSize: '0.95rem',
                  color: COLORS.gold, margin: 0,
                }}>
                  {tr ? t.titleTr : t.titleEn}
                </h4>
                <span style={{ color: COLORS.gold, opacity: 0.65, fontSize: '1rem' }}>→</span>
              </div>
              <p style={{
                fontFamily: FONTS.body,
                fontSize: '0.85rem',
                color: COLORS.silver,
                lineHeight: 1.6,
                margin: 0, opacity: 0.85,
              }}>
                {tr ? t.descTr : t.descEn}
              </p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Çapraz Okuma — Örüntü Kategorileri ──────────────────────────────────────
// Açılış/kapanış kalıplarının istatistiği + her örüntünün ne anlama geldiğine
// dair bir-iki cümle insight. Tıklanınca filtre uygulanır.
function CrossReadingSection({ surahs, language, isMobile, activeFilter, onFilterClick }) {
  if (!surahs || surahs.length === 0) return null;
  const tr = language === 'tr';
  const insights = [
    {
      filterId: 'mukattaaOpener',
      count: surahs.filter(s => s.hasMukattaa).length,
      labelTr: 'Mukattaa ile açılan', labelEn: 'Muqaṭṭaʿāt opener',
      insightTr: '14 farklı harf kombinasyonu, 29 sûreyi şifre ile açar — anlamı sadece Allah\'ın bildiği. Çoğu hemen vahiy/Kitap atfıyla devam eder; şifreden vaade yolculuk — ama bu mutlak bir kural değil, klasik tefsirin dikkat çektiği baskın bir edebi eğilimdir.',
      insightEn: '14 different letter combinations open 29 surahs with a cipher — meaning known only to God. Most are immediately followed by a reference to revelation/the Book; a journey from cipher to promise — though not an absolute rule, but a dominant literary pattern noted by classical tafsīr.',
    },
    {
      filterId: 'oathOpener',
      count: surahs.filter(s => s.hasOath).length,
      labelTr: 'Yemin ile açılan', labelEn: 'Oath opener',
      insightTr: 'Allah\'ın yarattığı varlıklar üzerine yemin ederek açan 17 sûre — gece, gündüz, asır, kalem, melekler. Şahit gösterilerek başlayan retorik.',
      insightEn: 'Seventeen surahs open with God swearing by something He created — night, day, the age, the pen, the angels. A rhetoric that opens by calling forth a witness.',
    },
    {
      filterId: 'divineNameCloser',
      count: surahs.filter(s => (s.closerTags || []).includes('divine-name-closer')).length,
      labelTr: 'İlâhî sıfatla biten', labelEn: 'Divine attribute closer',
      insightTr: 'Esmâ-i Hüsnâ\'dan biriyle mühürlenen 9 sûre — Hakîm, Habîr, Muhît, Tevvâb… Sûrenin son kelimesi Allah\'ın bir sıfatıyla mühürlenir.',
      insightEn: 'Nine surahs sealed with one of God\'s Beautiful Names — al-Ḥakīm, al-Khabīr, al-Muḥīṭ, al-Tawwāb… Each surah\'s closing word is one of God\'s attributes.',
    },
    {
      filterId: 'kulOpener',
      count: surahs.filter(s => (s.openerTags || []).includes('kul-opener')).length,
      labelTr: '"Kul" ile açılan', labelEn: '"Qul" opener',
      insightTr: '"Söyle!" emrinin saf hâli — Hz. Peygamber\'e doğrudan iletilen 5 sûre. Beş ufuk: ilim, akide, tevhid, dış korunma, iç korunma.',
      insightEn: 'The pure form of the command "Say!" — five surahs delivered directly to the Prophet. Five horizons: knowledge, creed, unity, external refuge, internal refuge.',
    },
    {
      filterId: 'innaOpener',
      count: surahs.filter(s => (s.openerTags || []).includes('inna')).length,
      labelTr: '"İnnâ" ile açılan', labelEn: '"Innā" opener',
      insightTr: '"Şüphesiz biz…" vurgulu ilanıyla açan 4 sûre: Feth, Nûh, Kadr, Kevser. Hepsinde ilahi bir bildirinin ağırlığı vardır.',
      insightEn: 'Four surahs that open with the emphatic declaration "Indeed, We…": al-Fatḥ, Nūḥ, al-Qadr, al-Kawthar. Each carries the weight of a divine announcement.',
    },
    {
      filterId: 'vocativeOpener',
      count: surahs.filter(s => (s.openerTags || []).includes('vocative')).length,
      labelTr: '"Yâ eyyuhâ" ile açılan', labelEn: '"Yā ayyuhā" opener',
      insightTr: 'Yalnız 2 sûre "Yâ eyyuhâ" çağrısıyla açar — Müzzemmil ve Müddessir. Her ikisi de erken Mekkî dönemde Hz. Peygamber\'e doğrudan hitap.',
      insightEn: 'Only two surahs open with "Yā ayyuhā" — al-Muzzammil and al-Muddaththir. Both are early Meccan, addressing the Prophet directly.',
    },
    {
      filterId: 'imperativeOpener',
      count: surahs.filter(s => (s.openerTags || []).includes('imperative') && !(s.openerTags || []).includes('kul-opener')).length,
      labelTr: 'Emir fiili ile açılan', labelEn: 'Imperative opener',
      insightTr: '"Kul" dışı emir fiilleriyle açan sûreler — "İqra\'" (Alak), "Kum" (Müddessir). Mutlak emir kipinde başlayan tebliğ.',
      insightEn: 'Surahs that open with imperatives other than "Qul" — "Iqraʾ" (al-ʿAlaq), "Qum" (al-Muddaththir). Proclamation that begins in pure command form.',
    },
  ].filter(ins => ins.count > 0);

  return (
    <div style={{ marginTop: '48px' }}>
      {/* Section header */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{
          fontSize: '0.66rem', fontFamily: FONTS.body, fontWeight: 700,
          letterSpacing: '0.3em', textTransform: 'uppercase',
          color: COLORS.gold, opacity: 0.65, marginBottom: '8px',
        }}>
          {tr ? 'Çapraz Okuma' : 'Cross Reading'}
        </div>
        <h3 style={{
          fontFamily: FONTS.display, fontWeight: 700,
          fontSize: isMobile ? '1.25rem' : '1.45rem',
          color: COLORS.offWhite, margin: '0 0 10px',
          lineHeight: 1.25,
        }}>
          {tr ? 'Örüntü Kategorileri' : 'Pattern Categories'}
        </h3>
        <p style={{
          fontFamily: FONTS.body, fontSize: '0.88rem',
          color: COLORS.silver, margin: 0, lineHeight: 1.65,
          maxWidth: '760px',
        }}>
          {tr
            ? '114 sûrenin damgaları rastgele dağılmaz — kalıplara göre kümelenir. Aşağıdaki istatistikler her örüntünün arkasındaki klasik mantığı gösterir; karta tıklayarak ilgili sûreleri ızgarada filtreleyebilirsin.'
            : 'The seals of the 114 surahs do not scatter at random — they cluster by pattern. The statistics below show the classical logic behind each pattern; click a card to filter the grid by that category.'}
        </p>
      </div>

      {/* Insights grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '12px',
      }}>
        {insights.map(ins => {
          const isActive = ins.filterId === activeFilter;
          return (
            <button
              key={ins.filterId}
              id={`category-${ins.filterId}`}
              onClick={() => onFilterClick && onFilterClick(ins.filterId)}
              style={{
                position: 'relative',
                textAlign: 'left',
                padding: '16px 18px',
                background: isActive ? COLORS.goldAlpha15 : 'rgba(255,255,255,0.025)',
                border: `1px solid ${isActive ? (COLORS.goldAlpha45 || COLORS.goldAlpha45) : (COLORS.glassBorderSoft || COLORS.glassBgStrong)}`,
                borderRadius: RADIUS.md,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: `all ${TRANSITION.fast}`,
                display: 'flex', flexDirection: 'column',
                scrollMarginTop: '120px',
              }}
              onMouseEnter={e => {
                if (isActive) return;
                e.currentTarget.style.background = COLORS.goldAlpha04;
                e.currentTarget.style.borderColor = COLORS.goldAlpha25;
              }}
              onMouseLeave={e => {
                if (isActive) return;
                e.currentTarget.style.background = 'rgba(255,255,255,0.025)';
                e.currentTarget.style.borderColor = COLORS.glassBorderSoft || COLORS.glassBgStrong;
              }}
            >
              {isActive && (
                <span style={{
                  position: 'absolute',
                  top: '10px', right: '12px',
                  fontSize: '0.58rem', fontFamily: FONTS.body, fontWeight: 700,
                  letterSpacing: '0.18em', textTransform: 'uppercase',
                  color: COLORS.gold,
                  background: COLORS.goldAlpha25,
                  padding: '3px 9px',
                  borderRadius: RADIUS.pill,
                  border: `1px solid ${COLORS.goldAlpha45 || COLORS.goldAlpha45}`,
                }}>
                  {tr ? 'Aktif' : 'Active'}
                </span>
              )}
              <div style={{
                display: 'flex', alignItems: 'baseline', gap: '10px',
                marginBottom: '8px',
              }}>
                <span style={{
                  fontFamily: FONTS.display, fontWeight: 800,
                  fontSize: '1.7rem',
                  color: COLORS.gold,
                  lineHeight: 1,
                }}>
                  {ins.count}
                </span>
                <span style={{
                  fontSize: '0.78rem', fontFamily: FONTS.body,
                  color: COLORS.silver, opacity: 0.7,
                }}>
                  {tr ? 'sûre' : 'surahs'}
                </span>
              </div>
              <div style={{
                fontSize: '0.82rem', fontFamily: FONTS.body, fontWeight: 700,
                color: COLORS.offWhite, marginBottom: '8px',
                letterSpacing: '0.01em',
                paddingRight: isActive ? '54px' : 0,
              }}>
                {tr ? ins.labelTr : ins.labelEn}
              </div>
              <p style={{
                fontSize: '0.8rem', fontFamily: FONTS.body,
                color: COLORS.silver, margin: 0, lineHeight: 1.6,
                opacity: 0.85,
              }}>
                {tr ? ins.insightTr : ins.insightEn}
              </p>
              <div style={{
                marginTop: '10px',
                fontSize: '0.72rem',
                color: COLORS.gold, opacity: isActive ? 0.95 : 0.7,
                fontFamily: FONTS.body, fontWeight: 600,
                letterSpacing: '0.02em',
              }}>
                {isActive
                  ? (tr ? 'Aşağıda Filtreli Görüntüleniyor ↓' : 'Filtered View Below ↓')
                  : (tr ? 'Detayını Gör →' : 'See Details →')}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Beş Keşif — Scrollytelling Chapters (Premium Template) ───────────────────
// Mevcut 2-col grid → vertical full-bleed panels. Her keşif tematik bir renk
// (semantic palette: emerald=halka, gold=imza, teal=klasik, sky=intra-zikr,
// violet=şifre) ve büyük numara ile dramatik scrollytelling sunar.
function KnowYouDidNotKnow({ language, isMobile }) {
  const tr = language === 'tr';
  const items = [
    {
      themeColor: '#2ecc71',      // emerald — eternal cycle
      themeBg: 'rgba(46,204,113,0.05)',
      themeBorder: 'rgba(46,204,113,0.25)',
      headlineTr: 'Mushaf, kendi sonundan başına dönen bir halkadır.',
      headlineEn: 'The Mushaf is a loop that returns from its own end to its beginning.',
      bodyTr: 'Nâs sûresi insanın şerlerden sığınmasıyla biter — Fâtiha hemen ardından Allah\'a hamd ile başlar. Mushaf\'ı bitiren kişi onu kapatmaz, çevirir.',
      bodyEn: 'Surah Al-Nās ends with refuge from evil — Al-Fātiḥa immediately begins with praise. Whoever finishes the Mushaf does not close it; they turn it over.',
      tagTr: 'Mushaf Halkası',
      tagEn: 'Mushaf Cycle',
    },
    {
      themeColor: '#d4a574',      // gold — family signature
      themeBg: 'rgba(212,165,116,0.05)',
      themeBorder: 'rgba(212,165,116,0.28)',
      headlineTr: 'Yedi sûre aynı iki harfle başlar — حم — ve hepsi ardışık.',
      headlineEn: 'Seven surahs begin with the same two letters — ḥā-mīm — and all are consecutive.',
      bodyTr: '40-46 arası kesintisiz bir blok. Aralarında mushaf akışı kırılmaz; her biri imanın farklı bir yüzünü gösterir.',
      bodyEn: 'Surahs 40–46 form an unbroken block. The Mushaf flow is never interrupted; each shows a different face of faith.',
      tagTr: 'Aile İmzası',
      tagEn: 'Family Signature',
    },
    {
      themeColor: '#2ab5a0',      // teal — classical scholarship
      themeBg: 'rgba(42,181,160,0.05)',
      themeBorder: 'rgba(42,181,160,0.28)',
      headlineTr: '"Sapanların yolu" Fâtiha\'da bitince, Bakara hemen "işte doğru yol" der.',
      headlineEn: '"The path of those who went astray" ends Al-Fātiḥa — Al-Baqara opens with "this is the guidance."',
      bodyTr: 'Sûrelerin biri diğerine cevap verir. Râzî der ki: kul Fâtiha\'da hidayet ister, Allah Bakara\'nın açılışında onu sunar. Burada bağ kelime sınırını aşar — Fâtiha\'nın son ayet teması ile Bakara\'nın 2. ayetinin teması arasındadır; bu sayfadaki tek ayet-düzeyi örnektir.',
      bodyEn: 'One surah answers the other. Al-Rāzī says: the servant asks for guidance in Al-Fātiḥa, and God offers it at the start of Al-Baqara. Here the bond crosses the word boundary — between the theme of Al-Fātiḥa\'s final verse and that of Al-Baqara\'s second verse; this is the only verse-level example on this page.',
      tagTr: 'Klasik Münâsebe',
      tagEn: 'Classical Munāsabah',
    },
    {
      themeColor: '#3498db',      // sky blue — tasbîh/takbîr remembrance
      themeBg: 'rgba(52,152,219,0.05)',
      themeBorder: 'rgba(52,152,219,0.28)',
      headlineTr: 'İsrâ tesbih ile açılır, tekbir ile mühürlenir — namaz sonrası tesbihâtın iki ucu.',
      headlineEn: 'Al-Isrāʾ opens with tasbīḥ and is sealed with takbīr — the two ends of post-prayer remembrance.',
      bodyTr: 'Sübhân ile başlar (subḥâne\'llezî esrâ), kebbir ile biter (ve kebbirhu tekbîrâ). Mü\'minin her namaz sonrası söylediği Sübhânallah ve Allahu Ekber zikrinin iki kelimesi, sûrenin iki ucudur.',
      bodyEn: 'It opens with subḥān (subḥāna alladhī asrā) and ends with kabbir (wa-kabbirhu takbīrā). The two words at the heart of the believer\'s post-prayer remembrance — Subḥānallāh and Allāhu Akbar — frame the surah.',
      tagTr: 'Sûre İçi Halka',
      tagEn: 'Intra-Surah Ring',
    },
    {
      themeColor: '#8b5cf6',      // violet — cipher mystery
      themeBg: 'rgba(139,92,246,0.05)',
      themeBorder: 'rgba(139,92,246,0.28)',
      headlineTr: 'Mukattaa harfleriyle açılan sûreler hemen ardından neredeyse hep Kitap/vahiy atfıyla devam eder.',
      headlineEn: 'Surahs that open with muqaṭṭaʿāt almost always follow them with a reference to the Book or revelation.',
      bodyTr: '29 sûre 14 farklı harf kombinasyonuyla açılır; çoğunda hemen ardından "ذَٰلِكَ الْكِتَابُ" / "تِلْكَ آيَاتُ الْكِتَابِ" / "تَنْزِيلُ الْكِتَابِ" gelir. Şifre çözülmez ama hemen yanı başında neye işaret ettiği söylenir: Bu Kitap.',
      bodyEn: '29 surahs open with 14 letter combinations; most are immediately followed by "this is the Book" / "these are verses of the Book" / "the revelation of the Book." The cipher is never decoded, but right beside it the referent is named: This Book.',
      tagTr: 'Açılış Kalıbı',
      tagEn: 'Opening Pattern',
    },
  ];

  return (
    <div style={{ marginBottom: '60px' }}>
      {/* Section header — centered, dramatic */}
      <div style={{ marginBottom: '40px', textAlign: 'center' }}>
        <div style={{
          fontSize: '0.7rem', fontFamily: FONTS.body, fontWeight: 700,
          letterSpacing: '0.3em', textTransform: 'uppercase',
          color: COLORS.gold, opacity: 0.72, marginBottom: '12px',
        }}>
          {tr ? "Mushaf'ın Açılış-Kapanış Mimarisinden" : "From the Mushaf's Opening-Closing Architecture"}
        </div>
        <h3 style={{
          fontFamily: FONTS.display, fontWeight: 700,
          fontSize: isMobile ? 'clamp(1.6rem, 6vw, 2rem)' : 'clamp(1.9rem, 3.4vw, 2.4rem)',
          color: COLORS.offWhite, margin: '0 auto 14px',
          lineHeight: 1.15,
          letterSpacing: '-0.015em',
        }}>
          {tr ? 'Beş Keşif' : 'Five Discoveries'}
        </h3>
        <p style={{
          fontSize: isMobile ? '0.9rem' : 'clamp(0.95rem, 1.5vw, 1.02rem)',
          fontFamily: FONTS.display,
          color: COLORS.gold, opacity: 0.85,
          margin: '0 auto', lineHeight: 1.6,
          fontStyle: 'italic',
          maxWidth: '620px',
        }}>
          {tr
            ? 'Klasik tefsirin işaret ettiği beş örüntü — sayfanın geri kalanı bunların her birini ayrı ayrı açar.'
            : 'Five patterns pointed out by classical tafsīr — the rest of the page opens each one in turn.'}
        </p>
      </div>

      {/* Vertical scrollytelling chapters — single column, full-bleed, generous spacing */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '20px' : '28px' }}>
        {items.map((it, i) => {
          const num = String(i + 1).padStart(2, '0');
          return (
            <div
              key={i}
              style={{
                position: 'relative',
                padding: isMobile ? '32px 22px 26px' : '40px 44px 32px',
                background: `linear-gradient(135deg, ${it.themeBg} 0%, rgba(255,255,255,0.015) 100%)`,
                border: `1px solid ${it.themeBorder}`,
                borderLeft: `3px solid ${it.themeColor}`,
                borderRadius: RADIUS.lg,
                overflow: 'hidden',
                transition: `all ${TRANSITION.base}`,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 18px 40px ${it.themeBorder}, 0 0 0 1px ${it.themeColor}40`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Watermark numeral — large, decorative */}
              <div aria-hidden="true" style={{
                position: 'absolute',
                top: isMobile ? '6px' : '8px',
                right: isMobile ? '12px' : '24px',
                fontFamily: FONTS.display, fontWeight: 800,
                fontSize: isMobile ? '4.2rem' : '6rem',
                color: it.themeColor, opacity: 0.12,
                lineHeight: 1,
                letterSpacing: '-0.04em',
                pointerEvents: 'none',
                userSelect: 'none',
              }}>
                {num}
              </div>

              {/* Inline chapter number — small caps eyebrow */}
              <div style={{
                position: 'relative', zIndex: 1,
                display: 'flex', alignItems: 'center', gap: '10px',
                marginBottom: '14px',
              }}>
                <span style={{
                  fontFamily: FONTS.display, fontWeight: 800,
                  fontSize: isMobile ? '1.1rem' : '1.3rem',
                  color: it.themeColor,
                  letterSpacing: '-0.01em',
                }}>{num}</span>
                <span aria-hidden="true" style={{
                  width: '24px', height: '1px',
                  background: `linear-gradient(to right, ${it.themeColor}, transparent)`,
                  flexShrink: 0,
                }} />
                <span style={{
                  fontSize: '0.62rem', fontFamily: FONTS.body, fontWeight: 700,
                  letterSpacing: '0.22em', textTransform: 'uppercase',
                  color: it.themeColor, opacity: 0.75,
                }}>
                  {tr ? it.tagTr : it.tagEn}
                </span>
              </div>

              {/* Headline — larger, dramatic */}
              <div style={{
                position: 'relative', zIndex: 1,
                fontFamily: FONTS.display, fontWeight: 700,
                fontSize: isMobile ? 'clamp(1.15rem, 4.5vw, 1.35rem)' : 'clamp(1.3rem, 1.9vw, 1.55rem)',
                color: COLORS.offWhite, lineHeight: 1.3,
                marginBottom: '16px',
                letterSpacing: '-0.008em',
                maxWidth: '760px',
              }}>
                {tr ? it.headlineTr : it.headlineEn}
              </div>

              {/* Body — explanation */}
              <p style={{
                position: 'relative', zIndex: 1,
                fontFamily: FONTS.body,
                fontSize: isMobile ? '0.92rem' : '0.96rem',
                color: COLORS.silver, lineHeight: 1.8,
                margin: 0, opacity: 0.92,
                maxWidth: '760px',
              }}>
                {tr ? it.bodyTr : it.bodyEn}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SpotlightCard({ spotlight, language, isMobile }) {
  const tr = language === 'tr';
  const isPair = ['bridge', 'ring', 'intra-bridge', 'intra-ring'].includes(spotlight.type);
  const isList = ['family', 'cluster'].includes(spotlight.type);
  const isRing = ['ring', 'intra-ring'].includes(spotlight.type);

  const hiddenText = tr ? spotlight.hiddenTr : spotlight.hiddenEn;

  return (
    <div id={`spotlight-${spotlight.id}`} style={{
      padding: isMobile ? '20px 18px' : '28px 32px',
      background: COLORS.goldAlpha04,
      border: `1px solid ${COLORS.goldAlpha25}`,
      borderRadius: RADIUS.lg,
      scrollMarginTop: '120px',
    }}>
      {/* Header: title (left) + category chip (right) */}
      <header style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: '14px',
        marginBottom: isMobile ? '20px' : '24px',
        flexDirection: isMobile ? 'column-reverse' : 'row',
      }}>
        <h3 style={{
          fontFamily: FONTS.display, fontWeight: 700,
          fontSize: isMobile ? '1.3rem' : '1.5rem',
          color: COLORS.offWhite,
          margin: 0,
          lineHeight: 1.25,
          letterSpacing: '-0.005em',
          flex: 1,
        }}>
          {tr ? spotlight.titleTr : spotlight.titleEn}
        </h3>
        <span style={{
          display: 'inline-block',
          padding: '5px 11px',
          background: COLORS.goldAlpha15,
          border: `1px solid ${COLORS.goldAlpha25}`,
          borderRadius: RADIUS.pill,
          fontSize: '0.62rem',
          fontFamily: FONTS.body,
          fontWeight: 700,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: COLORS.gold,
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}>
          {tr ? spotlight.categoryLabelTr : spotlight.categoryLabelEn}
        </span>
      </header>

      {/* Visual: pair or list */}
      {isPair && <SpotlightPair spotlight={spotlight} isRing={isRing} language={language} isMobile={isMobile} />}
      {isList && <SpotlightList spotlight={spotlight} language={language} isMobile={isMobile} />}

      {/* Thematic prose — split on \n\n to render multiple paragraphs */}
      <div style={{ marginTop: isMobile ? '20px' : '24px' }}>
        {(tr ? spotlight.thematicTr : spotlight.thematicEn)
          .split('\n\n')
          .map((para, idx, arr) => (
            <p key={idx} style={{
              fontFamily: FONTS.body,
              fontSize: isMobile ? '0.94rem' : '1rem',
              color: COLORS.offWhite,
              lineHeight: 1.75,
              margin: idx === arr.length - 1 ? 0 : '0 0 14px',
            }}>
              {para}
            </p>
          ))}
      </div>

      {/* Hidden detail — collapsible */}
      {hiddenText && (
        <details style={{
          marginTop: '18px',
          background: 'rgba(255,255,255,0.025)',
          borderLeft: `2px solid ${COLORS.goldAlpha45}`,
          borderRadius: RADIUS.sm,
          overflow: 'hidden',
        }}>
          <summary style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
            padding: '10px 14px',
            cursor: 'pointer',
            listStyle: 'none',
            userSelect: 'none',
            fontSize: '0.62rem',
            fontFamily: FONTS.body,
            fontWeight: 700,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: COLORS.gold,
            opacity: 0.85,
          }}>
            <span>{tr ? 'Saklı Detay' : 'Hidden Detail'}</span>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round"
              style={{ transition: 'transform 0.2s', flexShrink: 0 }}
              className="ilk-son-chevron"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </summary>
          <div style={{ padding: '0 14px 12px' }}>
            {hiddenText.split('\n\n').map((para, idx, arr) => (
              <p key={idx} style={{
                fontFamily: FONTS.body,
                fontSize: isMobile ? '0.86rem' : '0.9rem',
                color: COLORS.offWhite,
                lineHeight: 1.7,
                margin: idx === arr.length - 1 ? 0 : '0 0 8px',
                opacity: 0.9,
              }}>
                {para}
              </p>
            ))}
          </div>
        </details>
      )}

      {/* Sources */}
      {spotlight.sources && spotlight.sources.length > 0 && (
        <div style={{
          marginTop: '14px',
          fontSize: '0.74rem', fontFamily: FONTS.body,
          color: COLORS.silver, opacity: 0.6,
          fontStyle: 'italic', letterSpacing: '0.02em',
        }}>
          — {spotlight.sources.join(' · ')}
        </div>
      )}
    </div>
  );
}

function SpotlightPair({ spotlight, isRing, language, isMobile }) {
  const { leftSurah: L, rightSurah: R } = spotlight;

  // Mobile: vertical flow with center connector line + arrow
  if (isMobile) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        gap: 0,
      }}>
        <SpotlightSurahPanel surah={L} language={language} />
        {/* Vertical bridge connector */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '6px 0',
        }}>
          <div style={{
            width: '1px',
            height: '14px',
            background: `linear-gradient(180deg, ${COLORS.goldAlpha45}, ${COLORS.goldAlpha15})`,
          }} />
          <div style={{
            width: '26px',
            height: '26px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: RADIUS.full,
            background: COLORS.goldAlpha15,
            border: `1px solid ${COLORS.goldAlpha45}`,
            color: COLORS.gold,
            fontSize: '0.85rem',
            fontWeight: 700,
            userSelect: 'none',
          }}>
            {isRing ? '↻' : '↓'}
          </div>
          <div style={{
            width: '1px',
            height: '14px',
            background: `linear-gradient(180deg, ${COLORS.goldAlpha15}, ${COLORS.goldAlpha45})`,
          }} />
        </div>
        <SpotlightSurahPanel surah={R} language={language} />
      </div>
    );
  }

  // Desktop: two panels with SVG arc bridge overlaid in the gap.
  // arc is positioned absolutely in a relative container; the bridge gap
  // is a real flex/grid column so the arc has space to live without
  // overlapping panel content.
  return (
    <div style={{
      position: 'relative',
      display: 'grid',
      gridTemplateColumns: '1fr 96px 1fr',
      alignItems: 'stretch',
    }}>
      <SpotlightSurahPanel surah={L} language={language} side="left" />

      {/* Bridge column — SVG arc */}
      <div style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <svg
          width="100%"
          height="56"
          viewBox="0 0 96 56"
          preserveAspectRatio="none"
          aria-hidden="true"
          style={{ display: 'block', overflow: 'visible' }}
        >
          <defs>
            <linearGradient id={`arc-grad-${spotlight.id}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"  stopColor={COLORS.gold} stopOpacity="0.05" />
              <stop offset="50%" stopColor={COLORS.gold} stopOpacity="0.85" />
              <stop offset="100%" stopColor={COLORS.gold} stopOpacity="0.05" />
            </linearGradient>
          </defs>
          {isRing ? (
            // Ring: dotted return curve below the arc to suggest cyclic flow
            <>
              <path
                d="M 0 28 Q 48 -8 96 28"
                fill="none"
                stroke={`url(#arc-grad-${spotlight.id})`}
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M 0 28 Q 48 56 96 28"
                fill="none"
                stroke={COLORS.goldAlpha45}
                strokeWidth="1"
                strokeDasharray="2 3"
                strokeLinecap="round"
              />
            </>
          ) : (
            <path
              d="M 0 36 Q 48 -8 96 36"
              fill="none"
              stroke={`url(#arc-grad-${spotlight.id})`}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          )}
        </svg>
        {/* Arrow node centered on top of arc */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '28px',
          height: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: RADIUS.full,
          background: COLORS.goldAlpha15,
          border: `1px solid ${COLORS.goldAlpha45}`,
          color: COLORS.gold,
          fontSize: '0.9rem',
          fontWeight: 700,
          userSelect: 'none',
        }}>
          {isRing ? '↻' : '→'}
        </div>
      </div>

      <SpotlightSurahPanel surah={R} language={language} side="right" />
    </div>
  );
}

function SpotlightSurahPanel({ surah, language, side }) {
  const tr = language === 'tr';
  const positionLabel =
    surah.position === 'ilk'
      ? (tr ? 'İlk' : 'First')
      : (tr ? 'Son' : 'Last');

  // Asymmetric alignment for paired desktop view emphasizes left-to-right flow.
  const align = side === 'left' ? 'right' : side === 'right' ? 'left' : 'center';

  return (
    <div style={{
      padding: '18px 16px',
      background: 'rgba(255,255,255,0.03)',
      border: `1px solid ${COLORS.glassBorderSoft || COLORS.glassBgStrong}`,
      borderRadius: RADIUS.md,
      textAlign: align,
    }}>
      <div style={{
        fontSize: '0.6rem', fontFamily: FONTS.body, fontWeight: 700,
        letterSpacing: '0.2em', textTransform: 'uppercase',
        color: COLORS.silver, opacity: 0.7, marginBottom: '12px',
      }}>
        {surah.num}. {tr ? surah.nameTr : surah.nameEn} · {positionLabel}
      </div>
      <p dir="rtl" lang="ar" style={{
        fontFamily: FONTS.quran,
        fontSize: '1.65rem',
        color: COLORS.gold,
        margin: '0 0 10px',
        lineHeight: 1.55,
      }}>
        {cleanArabic(surah.wordAr)}
      </p>
      {surah.translit && (
        <div style={{
          fontSize: '0.72rem',
          color: COLORS.offWhite, opacity: 0.7,
          fontStyle: 'italic',
          marginBottom: '4px',
          letterSpacing: '0.01em',
        }}>
          {surah.translit}
        </div>
      )}
      {surah.meaning && (
        <div style={{
          fontSize: '0.8rem',
          color: COLORS.offWhite, opacity: 0.9,
          fontWeight: 500,
        }}>
          {surah.meaning}
        </div>
      )}
    </div>
  );
}

function SpotlightList({ spotlight, language, isMobile }) {
  const tr = language === 'tr';
  return (
    <div style={{
      padding: isMobile ? '10px 12px' : '14px 18px',
      background: 'rgba(255,255,255,0.02)',
      border: `1px solid ${COLORS.glassBorderSoft || COLORS.glassBgStrong}`,
      borderRadius: RADIUS.md,
    }}>
      {spotlight.items.map((item, i) => (
        <div
          key={i}
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '92px 1fr 16px 1.4fr' : '110px 1fr 24px 1.4fr',
            gap: isMobile ? '6px' : '10px',
            alignItems: 'center',
            padding: '8px 0',
            borderBottom: i < spotlight.items.length - 1
              ? '1px solid rgba(255,255,255,0.05)'
              : 'none',
          }}
        >
          {/* Surah number + name */}
          <div style={{
            display: 'flex', alignItems: 'baseline', gap: '6px',
            fontFamily: FONTS.body,
            overflow: 'hidden',
          }}>
            <span style={{
              fontSize: '0.72rem',
              color: COLORS.silver, opacity: 0.6,
              fontWeight: 600,
              flexShrink: 0,
            }}>
              {item.num}.
            </span>
            <span style={{
              fontSize: isMobile ? '0.78rem' : '0.84rem',
              color: COLORS.offWhite,
              fontWeight: 600,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {tr ? item.nameTr : (item.nameEn || item.nameTr)}
            </span>
          </div>
          {/* First word (Arabic) */}
          <div dir="rtl" lang="ar" style={{
            fontFamily: FONTS.quran,
            fontSize: isMobile ? '1.05rem' : '1.2rem',
            color: COLORS.gold,
            textAlign: 'right',
            lineHeight: 1.4,
          }}>
            {cleanArabic(item.firstAr)}
          </div>
          {/* Arrow */}
          <div style={{
            color: COLORS.gold, opacity: 0.45,
            fontSize: '0.85rem',
            textAlign: 'center',
            userSelect: 'none',
          }}>
            →
          </div>
          {/* Last word + meaning */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '8px' }}>
            <span dir="rtl" lang="ar" style={{
              fontFamily: FONTS.quran,
              fontSize: isMobile ? '1.05rem' : '1.2rem',
              color: COLORS.gold,
              lineHeight: 1.4,
            }}>
              {cleanArabic(item.lastAr)}
            </span>
            {item.lastMeaning && (
              <span style={{
                fontSize: isMobile ? '0.74rem' : '0.8rem',
                color: COLORS.offWhite, opacity: 0.8,
                fontStyle: 'italic',
              }}>
                {item.lastMeaning}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ═══ AcilisKapanisSpektrum — 114 sûre'nin açılış+kapanış kök spektrumu ═══════
// 2026-07-10 Dalga 3 · Madde 5.
// İki satırlı bar: üst satır 114 sûrenin ilk kelime kökü, alt satır son
// kelime kökü. Aynı kök alanına giren sûre'ler aynı rengi paylaşır → hangi
// kök ailelerinin (hamd, rabb, ilah, rahmân...) hangi sûre'lerde açılış/
// kapanış olarak kümelendiği bir bakışta görülür.
// Tıklama: sûre kartına scroll. Hover: sûre adı + kelime + kök.
function AcilisKapanisSpektrum({ surahs, language, isMobile }) {
  const tr = language === 'tr';
  const [hovered, setHovered] = useState(null); // {surah, side}

  // Kök → semantic family renk map. Top ~15 kök alanı için tanımlanmış;
  // geri kalanı silver/gri (default).
  const ROOT_FAMILIES = useMemo(() => [
    // Kur'ân'ın en çok tekrar eden anlam ekseni gruplamaları
    { pattern: /^ح م د$/, colorTr: 'Hamd (övgü)', colorEn: 'Ḥamd (praise)', hex: '#D4A574' },
    { pattern: /^ر ب ب$/, colorTr: 'Rabb (Rab)',  colorEn: 'Rabb (Lord)', hex: '#B8860B' },
    { pattern: /^ا ل ه|^أ ل ه$/, colorTr: 'Ilâh (İlah)', colorEn: 'Ilāh (God)', hex: '#8B5CF6' },
    { pattern: /^ن ا س$/, colorTr: 'Nâs (insan)', colorEn: 'Nās (people)', hex: '#3B82F6' },
    { pattern: /^ر ح م$/, colorTr: 'Rahm (rahmet)', colorEn: 'Raḥm (mercy)', hex: '#1D9E75' },
    { pattern: /^ذ ك ر$/, colorTr: 'Zikr (anma)', colorEn: 'Dhikr (remembrance)', hex: '#22C55E' },
    { pattern: /^ا م ن|^أ م ن$/, colorTr: 'Îmân (iman)', colorEn: 'Īmān (faith)', hex: '#14B8A6' },
    { pattern: /^ع ب د$/, colorTr: 'ʿAbd (kulluk)', colorEn: 'ʿAbd (worship)', hex: '#C9A227' },
    { pattern: /^ي و م$/, colorTr: 'Yevm (gün)', colorEn: 'Yawm (day)', hex: '#F97316' },
    { pattern: /^ك ف ر$/, colorTr: 'Kufr (inkar)', colorEn: 'Kufr (denial)', hex: '#D85A30' },
    { pattern: /^ص ل و$/, colorTr: 'Ṣalât (namaz)', colorEn: 'Ṣalāt (prayer)', hex: '#EAB308' },
    { pattern: /^ع ل م$/, colorTr: 'ʿIlm (bilgi)', colorEn: 'ʿIlm (knowledge)', hex: '#3498DB' },
    { pattern: /^س م ع|^ب ص ر$/, colorTr: 'Semī' + "'" + '-Basîr (duyu)', colorEn: 'Semīʿ-Baṣīr (senses)', hex: '#06B6D4' },
    { pattern: /^ح ك م$/, colorTr: 'Hukm (hüküm)', colorEn: 'Ḥukm (judgment)', hex: '#F59E0B' },
    { pattern: /^ه د ي$/, colorTr: 'Hidâyet', colorEn: 'Hidāya (guidance)', hex: '#10B981' },
  ], []);
  const DEFAULT = { colorTr: 'Diğer', colorEn: 'Other', hex: 'rgba(148,163,184,0.35)' };

  const familyFor = (root) => {
    if (!root) return DEFAULT;
    return ROOT_FAMILIES.find(f => f.pattern.test(root)) || DEFAULT;
  };

  const tileSize = isMobile ? 8 : 11;
  const gap = isMobile ? 1 : 2;
  const rowW = 114 * tileSize + 113 * gap;

  const renderRow = (side) => (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(114, ${tileSize}px)`,
      gap: `${gap}px`,
      justifyContent: 'center',
    }}>
      {surahs.map((s) => {
        const word = side === 'ilk' ? s.firstWord : s.lastWord;
        const fam = familyFor(word?.root);
        const isHover = hovered && hovered.surah === s.surah;
        return (
          <button
            key={s.surah}
            onMouseEnter={() => setHovered({ surah: s.surah, side })}
            onMouseLeave={() => setHovered(null)}
            onFocus={() => setHovered({ surah: s.surah, side })}
            onBlur={() => setHovered(null)}
            onClick={() => {
              const el = document.getElementById(`ilk-son-card-${s.surah}`);
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }}
            aria-label={`${s.surah}. ${tr ? s.nameTr : s.nameEn} — ${side === 'ilk' ? (tr ? 'açılış' : 'opener') : (tr ? 'kapanış' : 'closer')}: ${word?.meaning || ''}`}
            title={`${s.surah}. ${tr ? s.nameTr : s.nameEn} — ${word?.meaning || ''}`}
            style={{
              width: `${tileSize}px`,
              height: `${tileSize}px`,
              padding: 0,
              border: 'none',
              cursor: 'pointer',
              background: fam.hex,
              opacity: isHover ? 1 : 0.75,
              boxShadow: isHover ? `0 0 0 1.5px ${COLORS.gold}` : 'none',
              transition: 'opacity 0.15s ease, box-shadow 0.15s ease',
              borderRadius: '2px',
              WebkitTapHighlightColor: 'transparent',
            }}
          />
        );
      })}
    </div>
  );

  const activeHover = hovered && surahs.find(s => s.surah === hovered.surah);
  const activeWord = activeHover ? (hovered.side === 'ilk' ? activeHover.firstWord : activeHover.lastWord) : null;
  const activeFam = activeWord ? familyFor(activeWord.root) : null;

  return (
    <div style={{
      marginTop: isMobile ? '18px' : '28px',
      marginBottom: isMobile ? '12px' : '20px',
      padding: isMobile ? '18px 12px 16px' : '24px 20px 20px',
      background: 'rgba(255,255,255,0.02)',
      border: `1px solid ${COLORS.goldAlpha15}`,
      borderRadius: '14px',
    }}>
      {/* Section header */}
      <div style={{ textAlign: 'center', marginBottom: isMobile ? '14px' : '18px' }}>
        <div style={{ fontSize: '0.62rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: COLORS.gold, fontWeight: 700, opacity: 0.7, marginBottom: '6px' }}>
          {tr ? '114 Sûrenin Kök Spektrumu' : 'Root Spectrum of 114 Surahs'}
        </div>
        <p style={{ color: COLORS.silver, fontSize: '0.78rem', margin: 0, opacity: 0.8, lineHeight: 1.4 }}>
          {tr
            ? 'Her sütun bir sûre. Üst satır açılış kökü, alt satır kapanış kökü — aynı renk = aynı anlam alanı.'
            : 'Each column = one surah. Top row = opening root, bottom row = closing root — same color = same semantic domain.'}
        </p>
      </div>

      {/* Row 1 — openers */}
      <div style={{ marginBottom: `${gap * 2}px`, overflowX: 'auto', paddingBottom: '4px' }}>
        <div style={{ display: 'inline-block', minWidth: `${rowW}px` }}>
          {renderRow('ilk')}
        </div>
      </div>
      {/* Row 2 — closers */}
      <div style={{ overflowX: 'auto', paddingBottom: '4px' }}>
        <div style={{ display: 'inline-block', minWidth: `${rowW}px` }}>
          {renderRow('son')}
        </div>
      </div>

      {/* Row labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.62rem', color: COLORS.silver, opacity: 0.55, letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: '10px', padding: '0 4px' }}>
        <span>{tr ? '1. Fâtiha' : '1. Al-Fatiha'}</span>
        <span>{tr ? '↑ açılış · kapanış ↓' : '↑ opener · closer ↓'}</span>
        <span>{tr ? '114. Nâs' : '114. An-Nās'}</span>
      </div>

      {/* Hover detail */}
      {activeHover && activeWord && (
        <div style={{
          marginTop: '14px',
          padding: '12px 14px',
          background: `${activeFam.hex}12`,
          border: `1px solid ${activeFam.hex}40`,
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          flexWrap: 'wrap',
        }}>
          <div style={{
            width: '10px', height: '10px', borderRadius: '50%',
            background: activeFam.hex, flexShrink: 0,
          }} />
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap' }}>
              <span style={{ color: COLORS.offWhite, fontWeight: 700, fontSize: '0.9rem' }}>
                {activeHover.surah}. {tr ? activeHover.nameTr : activeHover.nameEn}
              </span>
              <span style={{ color: COLORS.silver, fontSize: '0.68rem', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                {hovered.side === 'ilk' ? (tr ? 'AÇILIŞ' : 'OPENER') : (tr ? 'KAPANIŞ' : 'CLOSER')}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap', marginTop: '2px' }}>
              <span dir="rtl" lang="ar" style={{ fontFamily: FONTS.quran, color: COLORS.gold, fontSize: '1rem' }}>
                {activeWord.ar}
              </span>
              <span style={{ color: COLORS.silver, fontSize: '0.78rem' }}>{activeWord.meaning}</span>
              <span style={{ color: COLORS.silver, fontSize: '0.68rem', opacity: 0.6, fontFamily: 'ui-monospace, monospace' }}>{activeWord.root}</span>
            </div>
          </div>
          <span style={{
            fontSize: '0.66rem', fontWeight: 700, padding: '3px 10px',
            color: activeFam.hex,
            background: `${activeFam.hex}18`,
            border: `1px solid ${activeFam.hex}30`,
            borderRadius: '999px',
            letterSpacing: '0.08em',
          }}>
            {tr ? activeFam.colorTr : activeFam.colorEn}
          </span>
        </div>
      )}

      {/* Legend — family colors */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '14px', justifyContent: 'center' }}>
        {ROOT_FAMILIES.map(f => (
          <span key={f.hex} style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            fontSize: '0.62rem', color: COLORS.silver, opacity: 0.72,
            padding: '2px 8px',
            border: `1px solid ${f.hex}30`,
            background: `${f.hex}0a`,
            borderRadius: '999px',
          }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: f.hex }} />
            {tr ? f.colorTr : f.colorEn}
          </span>
        ))}
      </div>
    </div>
  );
}
