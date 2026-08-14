'use client';

import React from 'react';

// ─── ToolsBrowser ─────────────────────────────────────────────────────────────
// Centered modal that lists all 16 interactive tools in a browse-friendly
// layout. Triggered by the "Tüm Araçları Gör" CTA on ToolsHighlight and the
// "Araçlar" CTA in the closing layer (ToolsShowcase).
//
// What makes this different from the Navbar Tools dropdown:
//   - The dropdown is a navigation tool ("go somewhere") — compact, fast.
//   - This modal is a discovery experience ("scan, compare, decide") —
//     bigger cards, multi-line descriptions, category filters.
//
// Layout:
//   - Header with title + close button
//   - Filter bar: Tümü / Görselleştirme / Analiz & Veri / Araştırma & Keşif
//   - "Tümü" view: featured "Kur'an'ı Tanı" banner on top + 2-col grid of all 15
//   - Category view: just the cards from that category, no featured banner
//   - Each card: icon + title + 2-3 sentence descLong from src/data/tools.jsx
//
// Architecture:
//   - Self-managed open state via custom event ('openToolsBrowser')
//   - ESC + backdrop click both close
//   - Body scroll locked while open (with scrollbar-width compensation
//     so the centered modal doesn't visually shift left)
//   - Clicking a card dispatches its overlay event AND closes the modal
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS, RADIUS, CLOSE_BTN, OVERLAY_TITLE, BREAKPOINT_TABLET, SEMANTIC } from '../tokens';
import {
  FEATURED_TOOLS,
  VIZ_TOOLS,
  ANALYSIS_TOOLS,
  RESEARCH_TOOLS,
} from '../data/tools';
import Link from 'next/link';
import { routeForToolEvent } from '../lib/toolRoutes';
import { TOOL_CATALOG } from '../data/toolCatalog';
import { useRouter } from 'next/navigation';

// ── Popular search suggestions (W20-Ö10) ────────────────────────────────────
// Empty-state hints shown beneath the search input when query is blank.
// Clicking a chip sets the query, giving discoverability for users who
// don't know what terms work. Kept inline (no i18n key) — locale-aware
// terms, 6 each.
const POPULAR_TR = ['dua', 'esma', 'kıssa', 'peygamber', 'ayet', 'mucize'];
const POPULAR_EN = ['prayer', 'names of god', 'story', 'prophet', 'verse', 'miracle'];

// ── Filter definitions ──────────────────────────────────────────────────────
// Each filter knows which tools to show. 'all' renders the featured banner
// + every category combined; the others render only their own category.
const FILTERS = [
  { id: 'all',      labelTr: 'Tümü',                labelEn: 'All',                 tools: null },
  { id: 'viz',      labelTr: 'Görselleştirme',      labelEn: 'Visualization',       tools: VIZ_TOOLS },
  { id: 'analysis', labelTr: 'Analiz & Veri',       labelEn: 'Analysis & Data',     tools: ANALYSIS_TOOLS },
  { id: 'research', labelTr: 'Araştırma & Keşif',   labelEn: 'Research & Explore',  tools: RESEARCH_TOOLS },
];

const ALL_TOOLS = [...VIZ_TOOLS, ...ANALYSIS_TOOLS, ...RESEARCH_TOOLS];

// ── Katalogdaki AMA yukarıdaki 21 kartta yer almayan araçlar (2026-08-13) ────
// Sayfanın adı "Tüm Araçlar" ve açıklaması "kapsamlı katalog" ama yalnız 21
// aracı gösteriyordu; diskte 56 rota var. Mevcut 21 kart ikonlu + gruplu ve
// zengin — onlar KALDIRILMADI (kayıp olurdu). Kalan araçlar altta ayrı, daha
// sade bir bölümde listeleniyor.
//
// Kaynak: src/data/toolCatalog.js (corpus ile paylaşılan tek otorite).
//
// ⚠ 14 Ağustos: `Object.values(TOOL_ROUTES)` YANLIŞTI — o harita 27 rota
// taşıyor (PsychologySection/CennetCehennem/iblis gibi başka yerlerdeki
// butonlar için de kayıt var), ama üstteki 21 kartın kapsadığı rota sayısı
// yalnızca 23. Fazladan kapsanan rotalar EXTRA_TOOLS'tan yanlışlıkla
// filtrelenip 4 araç (Tabiat Atlası, Nefs Mertebeleri, İblis & Şeytan,
// İlk-Son Kelimeler) sayfada hiç görünmüyordu. Doğrusu: yalnız üstteki
// kartların GERÇEKTEN kullandığı event'lerin rotaları.
const COVERED_ROUTES = new Set(
  [...FEATURED_TOOLS, ...ALL_TOOLS]
    .map((t) => routeForToolEvent(t.event))
    .filter(Boolean)
);
const EXTRA_TOOLS = TOOL_CATALOG
  .filter((t) => !COVERED_ROUTES.has(t.route) && t.route !== '/tefekkur')
  .map((t) => ({
    id: `cat:${t.route}`,
    route: t.route,
    titleTr: t.titleTr, titleEn: t.titleEn,
    descTr: t.descTr,   descEn: t.descEn,
    keywords: t.keywords || [],
  }));

// Aile bazında gruplama (2026-08-13, kullanıcı raporu: "sıralama bir mantık
// çerçevesinde mi, random mı?"). Sıra gerçekten rastgeleydi — TOOL_CATALOG'un
// ham dizi sırasıydı: atlaslar iki ayrı bloğa bölünmüş, araya arac girişleri
// girmiş, sonradan eklenen 13 kayıt da sona iliştirilmişti.
// Artık: aile (atlas / arac / graf) + her grup içinde Türkçe alfabetik.
// Aile ikonları (2026-08-13). Katalogda ikon alanı yok; 29 araca tek tek ikon
// çizmek yerine aile başına bir sembol kullanılıyor — üstteki kartlarla görsel
// eşitliği sağlar, sahte çeşitlilik üretmez.
const FAMILY_ICON = {
  atlas: (
    <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18" />
    </svg>
  ),
  arac: (
    <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 5.5a4 4 0 0 0 5 5L21 9l-6-6-1.5 1.5zM12 8l-8 8v4h4l8-8" />
    </svg>
  ),
  graf: (
    <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="7" r="2" /><circle cx="18" cy="7" r="2" /><circle cx="12" cy="18" r="2" />
      <path d="M7.7 8.4 10.5 16M16.3 8.4 13.5 16M8 7h8" />
    </svg>
  ),
};

const EXTRA_GROUPS = [
  { key: 'atlas', labelTr: 'Atlaslar',  labelEn: 'Atlases' },
  { key: 'arac',  labelTr: 'Araçlar',   labelEn: 'Tools' },
  { key: 'graf',  labelTr: 'Graflar',   labelEn: 'Graphs' },
].map((g) => ({
  ...g,
  tools: EXTRA_TOOLS
    .filter((t) => t.route.startsWith(`/${g.key}/`))
    .sort((a, b) => a.titleTr.localeCompare(b.titleTr, 'tr')),
})).filter((g) => g.tools.length > 0);

// Başlıktaki sayı. Dizileri toplamak yanlış sonuç veriyordu (DOM'da 50 kart
// varken 52 yazıyordu); id üzerinden tekilleştirilmiş sayım tek doğru yol.
const TOTAL_TOOL_COUNT = new Set(
  [...FEATURED_TOOLS, ...ALL_TOOLS, ...EXTRA_TOOLS].map((t) => t.id)
).size;

// ── Component ────────────────────────────────────────────────────────────────
export default function ToolsBrowser({ onClose, defaultOpen = false }) {
  const { language } = useLanguage();
  const router = useRouter();
  const [open, setOpen] = useState(defaultOpen);
  const [activeFilter, setActiveFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false)  // SSR-safe; useEffect h() post-mount hydrate;

  // Listen for the open event (dispatched by useQuranNav.openOverlay('allTools'))
  useEffect(() => {
    const handler = () => {
      setActiveFilter('all'); // reset filter on every open
      setQuery('');           // reset query on every open
      setOpen(true);
    };
    window.addEventListener('openToolsBrowser', handler);
    return () => window.removeEventListener('openToolsBrowser', handler);
  }, []);

  // ESC closes
  useEffect(() => {
    if (!open) return;
    const h = (e) => { if (e.key === 'Escape') { setOpen(false); onClose?.(); } };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open]);

  // Lock body scroll while open. Compensate for the disappearing scrollbar
  // (~15px) by adding equal paddingRight on body so page content doesn't
  // shift right and make the centered modal look off-center.
  useEffect(() => {
    if (!open) return;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow     = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    return () => {
      document.body.style.overflow     = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
    };
  }, [open]);

  // Responsive: 1 column on mobile
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < BREAKPOINT_TABLET);
    h(); // post-mount hydrate
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  // Kapanış (2026-08-13, kullanıcı raporu: "kapatınca arkada boş sayfa kalıyor").
  // Önceden yalnız setOpen(false) yapıyordu; ToolsBrowser bir ROTA'nın
  // (/arac/tum-araclar) tek içeriği olduğu için modal gizlenince geriye
  // bomboş bir sayfa kalıyordu. onClose artık her kapanışta çağrılıyor.
  const close = () => { setOpen(false); onClose?.(); };

  // Araç tıklaması → route navigasyonu (2026-08-13).
  //
  // ÖNCEDEN: window.dispatchEvent(new CustomEvent(eventName)) — Vite döneminde
  // overlay'leri açıyordu. §16.5 ile araçlar tam sayfa route'a dönüşünce o
  // dinleyiciler kalktı; 23 event'ten 17'sinin karşılığı kalmamıştı. Sonuç:
  // bu sayfada araç kartına tıklamak SESSİZCE hiçbir şey yapmıyordu.
  //
  // ŞİMDİ: Navbar'ın zaten kullandığı event→route haritası paylaşılıyor
  // (lib/toolRoutes.js). Haritada karşılığı olmayan bir event kalırsa eski
  // davranışa düşülür — geriye dönük güvenli.
  // Navbar'ın gerçek yüksekliği + nefes payı. Navbar dile ve genişliğe göre
  // yükseklik değiştiriyor; sabit sayı tutmuyor.
  const [navPad, setNavPad] = useState(96);
  useEffect(() => {
    const measure = () => {
      const nav = document.querySelector('nav[aria-label="Main navigation"]');
      const b = nav ? Math.round(nav.getBoundingClientRect().bottom) : 0;
      setNavPad(Math.max(96, b + 24));
    };
    measure();
    window.addEventListener('resize', measure);
    // Navbar scroll'da kompaktlaşıyor; geçiş bittikten sonra da ölç.
    const t = setTimeout(measure, 450);
    return () => { window.removeEventListener('resize', measure); clearTimeout(t); };
  }, []);

  // Araç kartlarının <Link> hedefi. Rota bulunamazsa null döner ve kart
  // eski <button> davranışına düşer (geriye dönük güvenli).
  const hrefForTool = (t) => {
    const route = t.route || routeForToolEvent(t.event);
    return route ? `/${language}${route}` : null;
  };

  const triggerTool = (eventName) => {
    const route = routeForToolEvent(eventName);
    if (route) {
      router.push(`/${language}${route}`);
    } else {
      console.warn('[ToolsBrowser] route eşleşmesi yok, event fallback:', eventName);
      window.dispatchEvent(new CustomEvent(eventName));
    }
    setOpen(false);
  };

  // Active tool list driven by filter, then narrowed by search query.
  const filteredByCategory = activeFilter === 'all'
    ? ALL_TOOLS
    : FILTERS.find((f) => f.id === activeFilter)?.tools ?? [];

  const visibleTools = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return filteredByCategory;
    return filteredByCategory.filter((tool) => {
      const haystack = [
        tool.titleTr, tool.titleEn,
        tool.descLongTr, tool.descLongEn,
        tool.descTr, tool.descEn,
      ].filter(Boolean).join(' ').toLowerCase();
      return haystack.includes(q);
    });
  }, [filteredByCategory, query]);

  // Ek araçlar aynı sorguyla süzülür; kategori filtresi seçiliyse gizlenir
  // (bu araçların grup bilgisi yok, yanlış gruba düşmesin).
  const visibleExtras = useMemo(() => {
    if (activeFilter !== 'all') return [];
    const q = query.trim().toLowerCase();
    if (!q) return EXTRA_TOOLS;
    return EXTRA_TOOLS.filter((t) =>
      `${t.titleTr} ${t.titleEn} ${t.descTr} ${t.descEn} ${(t.keywords || []).join(' ')}`
        .toLowerCase()
        .includes(q)
    );
  }, [activeFilter, query]);

  return (
    <AnimatePresence>
      {open && (
        // Backdrop is a flex centering container — avoids the framer-motion
        // gotcha where animate={{ scale, y }} overwrites a CSS translate.
        <motion.div
          key="tools-browser-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={close}
          style={{
            position: 'fixed',
            inset: 0,
            background: COLORS.backdropDim,
            backdropFilter: 'blur(2px)',
            zIndex: 9998,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            // Navbar payı (2026-08-13, kullanıcı raporu: "bu kısımda overlap var").
            // inset:0 + dikey ortalama + maxHeight:88vh kombinasyonu 900px'lik
            // ekranda modalin üst kenarını 54px'e koyuyordu; navbar 62px, yani
            // 8px örtüşme oluşuyordu. Üst padding navbar yüksekliği + nefes payı.
            // Üst dolgu ÖLÇÜLÜR, sabit değil. 2026-08-13 denetimi: sabit 96px
            // idi ve 1024px'te İNGİLİZCE navbar (menü öğeleri daha uzun →
            // iki satıra sarıyor, alt kenar 134px) "All Tools" başlığını
            // 21px örtüyordu. Türkçede sorun görünmüyordu; tek dilde test
            // etmek bu hatayı kaçırırdı.
            padding: `${navPad}px 24px 24px`,
            boxSizing: 'border-box',
          }}
        >
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="tools-browser-title"
            style={{
              width: 'min(1080px, 92vw)',
              maxHeight: 'calc(100vh - 120px)',   // 96 üst + 24 alt padding
              background: COLORS.cosmicBlack,
              border: `1px solid ${COLORS.goldAlpha25}`,
              borderRadius: '16px',
              boxShadow: `0 20px 60px ${COLORS.backdropDim}`,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 24px',
                borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
                flexShrink: 0,
              }}
            >
              {/* Başlık (2026-08-13). Önceki: "Tüm İnteraktif Araçlar".
                  Üç sorunu vardı: (a) sayfanın metadata başlığı zaten
                  "Tüm Araçlar" — sekme ile ekran farklı şey söylüyordu;
                  (b) "interaktif" fazla iddiaydı — listedeki Tabiat Atlası,
                  Tarihsel İzler gibi girişler okuma yüzeyi, interaktif araç
                  değil; (c) sayfa 21'den 50 öğeye çıkınca araç+atlas+graf
                  karışımı oldu. "Araçlar" sitenin kendi kapsayıcı terimi —
                  navbar menüsünün adı da bu ve atlasları da içeriyor. */}
              <span style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
                <span id="tools-browser-title" style={OVERLAY_TITLE}>
                  {language === 'tr' ? 'Tüm Araçlar' : 'All Tools'}
                </span>
                <span style={{
                  color: COLORS.silver, fontFamily: FONTS.body,
                  fontSize: '0.7rem', letterSpacing: '0.04em', opacity: 0.78,
                }}>
                  {language === 'tr'
                    ? `${TOTAL_TOOL_COUNT} araç · atlas · graf`
                    : `${TOTAL_TOOL_COUNT} tools · atlases · graphs`}
                </span>
              </span>
              <button
                onClick={close}
                aria-label={language === 'tr' ? 'Kapat' : 'Close'}
                style={{ ...CLOSE_BTN }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = COLORS.glassBorder;
                  e.currentTarget.style.color = COLORS.offWhite;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = CLOSE_BTN.background;
                  e.currentTarget.style.color = COLORS.silver;
                }}
              >
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Search input + popular-search empty-state suggestions */}
            <div
              style={{
                padding: isMobile ? '12px 16px 0' : '14px 24px 0',
                flexShrink: 0,
              }}
            >
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={language === 'tr' ? 'Araçlarda ara...' : 'Search tools...'}
                aria-label={language === 'tr' ? 'Araçlarda ara' : 'Search tools'}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  background: COLORS.glassBg,
                  border: `1px solid ${COLORS.glassBorder}`,
                  borderRadius: RADIUS.sm,
                  color: COLORS.offWhite,
                  fontFamily: FONTS.body,
                  fontSize: '0.88rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.15s',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = COLORS.goldAlpha45; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = COLORS.glassBorder; }}
              />
              {/* Empty-state popular searches — visible only when query is blank */}
              {!query && (
                <div
                  style={{
                    marginTop: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    flexWrap: 'wrap',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.75rem',
                      color: COLORS.silver,
                      fontFamily: FONTS.body,
                    }}
                  >
                    {language === 'tr' ? 'Popüler aramalar:' : 'Popular searches:'}
                  </span>
                  {(language === 'tr' ? POPULAR_TR : POPULAR_EN).map((term) => (
                    <PopularChip key={term} term={term} onClick={() => setQuery(term)} />
                  ))}
                </div>
              )}
            </div>

            {/* Filter bar */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                padding: isMobile ? '12px 16px' : '14px 24px',
                borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
                flexShrink: 0,
              }}
            >
              {FILTERS.map((f) => (
                <FilterButton
                  key={f.id}
                  active={activeFilter === f.id}
                  label={language === 'tr' ? f.labelTr : f.labelEn}
                  onClick={() => setActiveFilter(f.id)}
                />
              ))}
            </div>

            {/* Body — scrollable */}
            <div style={{ overflow: 'auto', flex: 1 }}>
              {/* Featured banners (vitrin tier) — only on "Tümü" view */}
              {activeFilter === 'all' && FEATURED_TOOLS.map(ft => (
                <FeaturedBanner
                  key={ft.id}
                  tool={ft}
                  href={hrefForTool(ft)}
                  onClick={() => triggerTool(ft.event)}
                  language={language}
                />
              ))}

              {/* Card grid
                - Filtered view: a single flat grid of that category's cards
                - "Tümü" view: each category gets its own header row spanning
                  all columns, then its cards. Headers use grid-column: 1/-1
                  so they stretch across the full grid width even on desktop.
              */}
              <div
                className="g-1-2"
                style={{
                  display: 'grid',
                  alignItems: 'stretch',
                  gap: '14px',
                  padding: '20px 24px 24px',
                }}
              >
                {activeFilter === 'all'
                  ? FILTERS.filter((f) => f.id !== 'all').flatMap((cat, catIndex) => {
                      const odd = !isMobile && cat.tools.length % 2 === 1;
                      return [
                        <CategoryHeader
                          key={`hdr-${cat.id}`}
                          label={language === 'tr' ? cat.labelTr : cat.labelEn}
                          first={catIndex === 0}
                        />,
                        ...cat.tools.map((tool, i) => (
                          <BigToolCard
                            key={tool.id}
                            tool={tool}
                            href={hrefForTool(tool)}
                            onClick={() => triggerTool(tool.event)}
                            language={language}
                            // Last card in an odd-sized category spans both
                            // columns so it doesn't sit alone in a half-row.
                            fullWidth={odd && i === cat.tools.length - 1}
                          />
                        )),
                      ];
                    })
                  : (() => {
                      // Filtered view: same orphan handling for the last card
                      const odd = !isMobile && visibleTools.length % 2 === 1;
                      return visibleTools.map((tool, i) => (
                        <BigToolCard
                          key={tool.id}
                          tool={tool}
                          href={hrefForTool(tool)}
                          onClick={() => triggerTool(tool.event)}
                          language={language}
                          fullWidth={odd && i === visibleTools.length - 1}
                        />
                      ));
                    })()}

                {/* ── Diğer Araçlar (2026-08-13) ─────────────────────────────
                    Sayfanın adı "Tüm Araçlar" ama yalnız 21 aracı gösteriyordu;
                    katalogda 55, diskte 56 rota var. Yukarıdaki 21 kart ikonlu
                    ve gruplu olduğu için korundu; kalan araçlar burada daha
                    sade satırlarla listeleniyor. Kaynak: data/toolCatalog.js */}
                {visibleExtras.length > 0 && EXTRA_GROUPS.map((g) => {
                  const shown = g.tools.filter((t) => visibleExtras.includes(t));
                  if (!shown.length) return null;
                  return (
                  <React.Fragment key={g.key}>
                    <CategoryHeader
                      label={`${language === 'tr' ? g.labelTr : g.labelEn} · ${shown.length}`}
                    />
                    {shown.map((t) => (
                      <Link
                        key={t.id}
                        href={`/${language}${t.route}`}
                        onClick={() => setOpen(false)}
                        style={{
                          display: 'flex', alignItems: 'flex-start', gap: '12px',
                          textAlign: 'left', width: '100%',
                          padding: '15px 16px',
                          borderRadius: RADIUS.md,
                          background: 'rgba(255,255,255,0.025)',
                          border: `1px solid ${COLORS.glassBorderSoft}`,
                          cursor: 'pointer',
                          transition: 'background 0.45s cubic-bezier(0.32,0.72,0,1), border-color 0.45s cubic-bezier(0.32,0.72,0,1), transform 0.35s cubic-bezier(0.32,0.72,0,1)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = `${COLORS.gold}12`;
                          e.currentTarget.style.borderColor = `${COLORS.gold}44`;
                          const ic = e.currentTarget.querySelector('.famicon');
                          if (ic) { ic.style.background = `${COLORS.gold}22`; ic.style.borderColor = `${COLORS.gold}55`; }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.025)';
                          e.currentTarget.style.borderColor = COLORS.glassBorderSoft;
                          const ic = e.currentTarget.querySelector('.famicon');
                          if (ic) { ic.style.background = `${COLORS.gold}10`; ic.style.borderColor = `${COLORS.gold}26`; }
                        }}
                      >
                        <span className="famicon" style={{
                          flexShrink: 0, width: '30px', height: '30px',
                          borderRadius: '9px',
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                          background: `${COLORS.gold}10`,
                          border: `1px solid ${COLORS.gold}26`,
                          color: COLORS.gold,
                          transition: 'background 0.45s cubic-bezier(0.32,0.72,0,1), border-color 0.45s cubic-bezier(0.32,0.72,0,1)',
                        }}>
                          {FAMILY_ICON[g.key]}
                        </span>
                        <span style={{ display: 'flex', flexDirection: 'column', gap: '3px', minWidth: 0 }}>
                          <span style={{
                            color: COLORS.offWhite, fontFamily: FONTS.body,
                            fontSize: '0.88rem', fontWeight: 600, lineHeight: 1.35,
                            letterSpacing: '-0.005em',
                          }}>
                            {language === 'tr' ? t.titleTr : t.titleEn}
                          </span>
                          <span style={{
                            color: COLORS.silver, fontFamily: FONTS.body,
                            fontSize: '0.75rem', lineHeight: 1.55, opacity: 0.85,
                            display: '-webkit-box', WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical', overflow: 'hidden',
                          }}>
                            {language === 'tr' ? t.descTr : t.descEn}
                          </span>
                        </span>
                      </Link>
                    ))}
                  </React.Fragment>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Sub-components ───────────────────────────────────────────────────────────

// Category header rendered between groups in the "Tümü" view. Spans the
// full grid width via grid-column: 1 / -1 so it sits cleanly between rows
// of cards. The first header has no top divider; later ones get one.
function CategoryHeader({ label, first }) {
  return (
    <div
      style={{
        gridColumn: '1 / -1',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginTop: first ? '0' : '14px',
        paddingTop: first ? '0' : '14px',
        borderTop: first ? 'none' : `1px solid ${COLORS.glassBorderSoft}`,
      }}
    >
      <span
        style={{
          color: COLORS.gold,
          fontFamily: FONTS.body,
          fontSize: '0.7rem',
          fontWeight: 700,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </span>
      <span
        style={{
          flex: 1,
          height: '1px',
          background: `linear-gradient(to right, ${COLORS.goldAlpha25}, transparent)`,
        }}
      />
    </div>
  );
}

// Empty-state popular-search chip. Tiny pill button that injects its term
// into the search query when clicked. Hover lifts color to gold.
function PopularChip({ term, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '4px 10px',
        borderRadius: RADIUS.pill,
        border: `1px solid ${COLORS.glassBorder}`,
        background: 'transparent',
        color: COLORS.silver,
        fontFamily: FONTS.body,
        fontSize: '0.78rem',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        transition: 'all 0.15s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = COLORS.gold;
        e.currentTarget.style.color = COLORS.gold;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = COLORS.glassBorder;
        e.currentTarget.style.color = COLORS.silver;
      }}
    >
      {term}
    </button>
  );
}

function FilterButton({ active, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '8px 16px',
        borderRadius: '999px',
        border: `1px solid ${active ? COLORS.goldAlpha45 : COLORS.glassBorderSoft}`,
        background: active ? COLORS.goldAlpha15 : 'transparent',
        color: active ? COLORS.gold : COLORS.silver,
        fontFamily: FONTS.body,
        fontSize: '0.78rem',
        fontWeight: active ? 700 : 500,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        transition: 'all 0.15s',
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        if (active) return;
        e.currentTarget.style.background = COLORS.goldAlpha04;
        e.currentTarget.style.color = COLORS.offWhite;
      }}
      onMouseLeave={(e) => {
        if (active) return;
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.color = COLORS.silver;
      }}
    >
      {label}
    </button>
  );
}

function FeaturedBanner({ tool, onClick, href, language }) {
  // tools.jsx exposes icon as a React component (takes `size` prop)
  const Icon = tool.icon;
  const As = href ? Link : 'button';
  const navProps = href ? { href } : { type: 'button', onClick };
  return (
    <As
      {...navProps}
      style={{
        textDecoration: 'none',
        width: 'calc(100% - 48px)',
        margin: '20px 24px 4px',
        padding: '18px 22px',
        background: COLORS.goldAlpha04,
        border: `1px solid ${COLORS.goldAlpha25}`,
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
        transition: 'all 0.2s',
        textAlign: 'left',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = COLORS.goldAlpha15;
        e.currentTarget.style.borderColor = COLORS.goldAlpha45;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = COLORS.goldAlpha04;
        e.currentTarget.style.borderColor = COLORS.goldAlpha25;
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span
          style={{
            color: COLORS.gold,
            flexShrink: 0,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            background: COLORS.goldAlpha15,
            border: `1px solid ${COLORS.goldAlpha25}`,
          }}
        >
          <Icon size={22} />
        </span>
        <span style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ color: COLORS.offWhite, fontSize: '1rem', fontFamily: FONTS.body, fontWeight: 700 }}>
            {language === 'tr' ? tool.titleTr : tool.titleEn}
          </span>
          <span style={{ color: SEMANTIC.textFaint, fontSize: '0.8rem', fontFamily: FONTS.body, lineHeight: 1.4 }}>
            {language === 'tr' ? tool.descLongTr : tool.descLongEn}
          </span>
        </span>
      </span>
      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginLeft: '12px' }}>
        <path d="M9 18l6-6-6-6" />
      </svg>
    </As>
  );
}

// ─── Gezinme <button> ile DEĞİL <Link> ile ──────────────────────────────────
// 2026-08-13 denetimi: bu sayfada 73 <button>, 2 <a> vardı. Tıklama
// `router.push` ile çalışıyordu ama semantik yanlıştı ve şunlar KAYIPTI:
//   · orta tık / cmd+tık ile yeni sekmede açma
//   · tarayıcının durum çubuğunda hedef URL önizlemesi
//   · bağlantıyı kopyala / yeni pencerede aç bağlam menüsü
//   · tarayıcı ve tarama motorları için sayfanın bağ grafiği
// `href` verilirse <Link>, verilmezse eski <button> davranışı korunur —
// rotası olmayan bir araç kalırsa kırılmasın diye.
// ────────────────────────────────────────────────────────────────────────────
function BigToolCard({ tool, onClick, href, language, fullWidth = false }) {
  // tools.jsx exposes icon as a React component
  const Icon = tool.icon;
  const As = href ? Link : 'button';
  const navProps = href ? { href } : { type: 'button', onClick };
  return (
    <As
      {...navProps}
      style={{
        textDecoration: 'none',
        // When this card is the orphan last item of an odd-sized category,
        // span both grid columns so it doesn't sit alone in a half-row.
        gridColumn: fullWidth ? '1 / -1' : 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '12px',
        padding: '20px 20px',
        background: COLORS.glassBgFaint,
        border: `1px solid ${COLORS.glassBorderSoft}`,
        borderRadius: '12px',
        cursor: 'pointer',
        textAlign: 'left',
        width: '100%',
        height: '100%', // fill the grid cell so siblings in the same row match heights
        minHeight: '170px',
        // Baseline: no lift, no shadow. Hover handler adds both for a subtle
        // modern card-lift effect. Explicit transform/box-shadow in the
        // transition list (instead of 'all') keeps the hover transition
        // crisp without animating color jumps on background/border swap.
        transform: 'translateY(0)',
        boxShadow: 'none',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, background 0.2s, border-color 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = COLORS.goldAlpha04;
        e.currentTarget.style.borderColor = COLORS.goldAlpha45;
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = `0 8px 24px ${COLORS.shadowCardHover}`;
        e.currentTarget.querySelector('.bti').style.color = COLORS.gold;
        e.currentTarget.querySelector('.btl').style.color = COLORS.gold;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = COLORS.glassBgFaint;
        e.currentTarget.style.borderColor = COLORS.glassBorderSoft;
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.querySelector('.bti').style.color = COLORS.gold;
        e.currentTarget.querySelector('.btl').style.color = COLORS.offWhite;
      }}
    >
      {/* Icon badge */}
      <span
        className="bti"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          background: COLORS.goldAlpha15,
          border: `1px solid ${COLORS.goldAlpha25}`,
          color: COLORS.gold,
          flexShrink: 0,
          transition: 'color 0.2s',
        }}
      >
        <Icon size={20} />
      </span>

      {/* Title + long description */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <span
          className="btl"
          style={{
            color: COLORS.offWhite,
            fontSize: '0.98rem',
            fontFamily: FONTS.body,
            fontWeight: 700,
            lineHeight: 1.25,
            transition: 'color 0.2s',
          }}
        >
          {language === 'tr' ? tool.titleTr : tool.titleEn}
        </span>
        <span
          style={{
            color: SEMANTIC.textFaint,
            fontSize: '0.78rem',
            fontFamily: FONTS.body,
            fontWeight: 400,
            lineHeight: 1.5,
          }}
        >
          {language === 'tr' ? tool.descLongTr : tool.descLongEn}
        </span>
      </div>
    </As>
  );
}
