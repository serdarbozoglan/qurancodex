'use client';

import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import {
  COLORS, FONTS, OVERLAY_BASE, OVERLAY_HEADER, OVERLAY_TITLE, CLOSE_BTN,
  BREAKPOINT_MOBILE, RADIUS,
} from '../tokens';

// ── Sûre isimleri (TR + EN) ──────────────────────────────────────────────────
const SURAH_NAMES_TR = {
  2: 'Bakara', 3: 'Âl-i İmrân', 7: "A'râf", 11: 'Hûd',
  19: 'Meryem', 20: 'Tâ-Hâ', 21: 'Enbiyâ', 27: 'Neml',
  28: 'Kasas', 51: 'Zâriyât', 66: 'Tahrîm',
};
const SURAH_NAMES_EN = {
  2: 'Baqarah', 3: "Al ʿImran", 7: "A'raf", 11: 'Hud',
  19: 'Maryam', 20: 'Ta-Ha', 21: 'Anbiya', 27: 'Naml',
  28: 'Qasas', 51: 'Dhariyat', 66: 'Tahrim',
};

// "3:42" → "Âl-i İmrân 3:42"  ·  "27:32-35" → "Neml 27:32-35"
function formatRef(ref, language) {
  if (!ref) return '';
  const m = String(ref).match(/^(\d+):/);
  if (!m) return ref;
  const surahNum = parseInt(m[1], 10);
  const names = language === 'tr' ? SURAH_NAMES_TR : SURAH_NAMES_EN;
  const name = names[surahNum];
  return name ? `${name} ${ref}` : ref;
}

// ── Arabic display normalizer ─────────────────────────────────────────────────
// Strips Uthmani recitation marks (waqf, end-of-ayah, asar) that fall back
// to tofu in KFGQPC outside the ReadingMode tajweed pipeline. Keeps standard
// harakat (U+064B–U+0652), maddah (U+0653), dagger alef (U+0670).
// CLAUDE.md §13.14 + §13.15 — Uthmani encoding → standard + Maddah render fix
function normalizeAr(s) {
  if (!s) return '';
  return s
    .replace(/\u06EA/g, '\u0650')                                  // asar → kasra
    .replace(/\u06E1/g, '\u0652')                                  // Uthmani sukun → standart sukun
    .replace(/[\u064B-\u0652]\u0653/gu, '\u0653')                  // CLAUDE.md §13.14 — Maddah render fix
    .replace(/[\u06D6-\u06DC]/g, '')                              // small high marks (waqf etc.)
    .replace(/[\u06DD\u06DE]/g, '')                                // end-of-ayah, rub el hizb
    // eslint-disable-next-line no-misleading-character-class -- Arabic combining marks intentionally stripped via escape sequence; see CLAUDE.md section 13.15.
    .replace(/[\u06E0\u06E2-\u06E4\u06E7-\u06E9\u06EB-\u06ED]/g, '') // misc Uthmani marks
    .replace(/\u0671/g, '\u0627')                                  // alef wasla → alef
    .replace(/\u06CC/g, '\u064A');                                 // farsi yeh → arabic yeh
}

// ── Kategori → renk eşleşmesi (semantik) ─────────────────────────────────────
const CATEGORY_COLORS = {
  secilmis:        COLORS.gold,        // seçilmiş, alemlerin kadınlarına üstün kılınanlar
  'peygamber-esi': '#a78bfa',          // peygamber eşi — purple (ortaklık)
  anne:            '#2ecc71',          // anne — emerald (yaşam)
  hukumdar:        '#e67e22',          // hükümdar — turuncu (otorite)
  'karsi-ornek':   '#D85A30',          // karşıt örnek (Lût/Nuh eşi) — coral (uyarı)
  diger:           COLORS.silver,      // diğer
};

// ── Shared CloseBtn (KavimlerAtlasi pattern) ─────────────────────────────────
function CloseBtn({ onClose }) {
  return (
    <button
      onClick={onClose}
      style={{ ...CLOSE_BTN }}
      onMouseEnter={e => { e.currentTarget.style.background = COLORS.glassBorder; e.currentTarget.style.color = COLORS.offWhite; }}
      onMouseLeave={e => { e.currentTarget.style.background = CLOSE_BTN.background; e.currentTarget.style.color = COLORS.silver; }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M18 6L6 18M6 6l12 12" />
      </svg>
    </button>
  );
}

export default function KadinlarAtlasi({ onClose, backRef }) {
  const { language } = useLanguage();
  const [data, setData] = useState(null);
  const [filter, setFilter] = useState('tumu');
  const [themeFilter, setThemeFilter] = useState(null);
  const [isMobile, setIsMobile] = useState(false)  // SSR-safe; useEffect h() post-mount hydrate;
  const bodyRef = useRef(null);

  // When category filter changes, clear theme filter (avoid stale state).
  // eslint-disable-next-line react-hooks/set-state-in-effect -- reset child state when parent filter changes; firing once per filter change is the intent.
  useEffect(() => { setThemeFilter(null); }, [filter]);

  // Browser back-button integration: when theme is active, register a back-handler
  // with the parent (Navbar's popstate handler will call it instead of closing
  // the overlay). Also push a history state so the back action has something to
  // pop. Cleanup ensures stale handlers don't linger.
  useEffect(() => {
    if (!backRef) return;
    if (themeFilter) {
      backRef.current = () => setThemeFilter(null);
      window.history.pushState({ overlay: true, kadinlarTheme: themeFilter }, '');
    } else {
      backRef.current = null;
    }
    return () => { if (backRef) backRef.current = null; };
  }, [themeFilter, backRef]);

  // Escape & resize
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  // Body scroll lock — CLAUDE.md §13.16 Katman 1 (tek scrollbar kuralı)
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;
    const prevPad  = body.style.paddingRight;
    const sbWidth = window.innerWidth - html.clientWidth;
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    if (sbWidth > 0) body.style.paddingRight = `${sbWidth}px`;
    return () => {
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
      body.style.paddingRight = prevPad;
    };
  }, []);

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < BREAKPOINT_MOBILE);
    h(); // post-mount hydrate
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  useEffect(() => {
    fetch('/kadinlar.json')
      .then(r => r.json())
      .then(d => setData(d))
      .catch(() => {});
  }, []);

  // ── Loading ────────────────────────────────────────────────────────────────
  if (!data) {
    return (
      <div style={{ ...OVERLAY_BASE, display: 'flex', flexDirection: 'column' }}>
        <div style={OVERLAY_HEADER}>
          <span style={OVERLAY_TITLE}>
            {language === 'tr' ? "Kur'an'da Kadınlar" : 'Women in the Quran'}
          </span>
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

  const meta = data.meta || {};
  const figures = data.figures || [];
  const categoryLabels = data.categories?.[language] || {};

  const filteredFigures = figures.filter(f => {
    const categoryMatch = filter === 'tumu' || f.type === filter;
    const themesArr = (language === 'tr' ? f.themesTr : f.themesEn) || [];
    const themeMatch = !themeFilter || themesArr.includes(themeFilter);
    return categoryMatch && themeMatch;
  });

  // Filter chips: tümü + her unique tip (sırayla: secilmis, peygamber-esi, anne, hukumdar, diger)
  const types = Array.from(new Set(figures.map(f => f.type)));
  const FILTERS = [
    { id: 'tumu', labelTr: 'Tümü', labelEn: 'All' },
    ...types.map(t => ({ id: t, labelTr: categoryLabels[t] || t, labelEn: data.categories?.en?.[t] || t })),
  ];

  return (
    <div style={{ ...OVERLAY_BASE, display: 'flex', flexDirection: 'column' }}>

      {/* ── HEADER ──────────────────────────────────────────────────────────── */}
      <div style={OVERLAY_HEADER}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          <span style={OVERLAY_TITLE}>
            {language === 'tr' ? "Kur'an'da Kadınlar" : 'Women in the Quran'}
          </span>
          <span style={{ color: COLORS.slate500, fontSize: '0.8rem', flexShrink: 0 }}>·</span>
          <span style={{ color: COLORS.slate500, fontSize: '0.78rem', fontFamily: FONTS.body }}>
            {language === 'tr' ? 'Anılan, seçilen, ders olarak öne çıkan' : 'Named, chosen, set forth as lessons'}
          </span>
        </div>
        <CloseBtn onClose={onClose} />
      </div>

      {/* ── SCROLLABLE BODY ────────────────────────────────────────────────── */}
      <div ref={bodyRef} style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>

        {/* Hero — narrative first, filter after */}
        <Hero meta={meta} figureCount={figures.length} language={language} isMobile={isMobile} />

        {/* Filter chips — placed AFTER hero so reader meets the content first */}
        <div style={{
          display: 'flex', gap: '6px',
          padding: isMobile ? '20px 16px 4px' : '24px 32px 4px',
          overflowX: 'auto', scrollbarWidth: 'none', flexShrink: 0,
          alignItems: 'center',
        }}>
          <span style={{
            fontSize: '0.6rem',
            color: COLORS.gold, opacity: 0.55,
            fontFamily: FONTS.body, fontWeight: 700,
            letterSpacing: '0.22em', textTransform: 'uppercase',
            marginRight: '6px', flexShrink: 0,
          }}>
            {language === 'tr' ? 'Filtre' : 'Filter'}
          </span>
          {FILTERS.map(f => {
            const active = filter === f.id;
            const color = f.id === 'tumu' ? COLORS.gold : (CATEGORY_COLORS[f.id] || COLORS.silver);
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                style={{
                  flexShrink: 0,
                  padding: '6px 12px',
                  borderRadius: RADIUS.pill,
                  border: `1px solid ${active ? color : COLORS.glassBorder}`,
                  background: active ? `${color}1f` : 'transparent',
                  color: active ? color : COLORS.silver,
                  fontSize: '0.74rem',
                  fontWeight: active ? 600 : 400,
                  fontFamily: FONTS.body,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  whiteSpace: 'nowrap',
                  letterSpacing: '0.03em',
                }}
              >
                {language === 'tr' ? f.labelTr : f.labelEn}
              </button>
            );
          })}
        </div>

        {/* Active theme filter banner */}
        {themeFilter && (
          <div style={{
            margin: isMobile ? '12px 16px 0' : '16px 32px 0',
            padding: '10px 14px',
            background: 'rgba(212,165,116,0.08)',
            border: `1px solid ${COLORS.goldAlpha25}`,
            borderRadius: RADIUS.md,
            display: 'flex', alignItems: 'center', gap: '12px',
            flexWrap: 'wrap',
          }}>
            <span style={{
              fontSize: '0.62rem',
              color: COLORS.gold, opacity: 0.7,
              fontFamily: FONTS.body, fontWeight: 700,
              letterSpacing: '0.22em', textTransform: 'uppercase',
            }}>
              {language === 'tr' ? 'Aktif tema' : 'Active theme'}
            </span>
            <span style={{
              padding: '4px 12px',
              background: COLORS.goldAlpha15,
              border: `1px solid ${COLORS.goldAlpha45}`,
              borderRadius: RADIUS.pill,
              fontSize: '0.78rem', color: COLORS.gold,
              fontFamily: FONTS.body, fontWeight: 600,
            }}>
              {themeFilter}
            </span>
            <span style={{
              fontSize: '0.78rem', color: COLORS.silver,
              fontFamily: FONTS.body,
            }}>
              {filteredFigures.length} {language === 'tr' ? 'figür' : 'figures'}
            </span>
            <button
              onClick={() => setThemeFilter(null)}
              style={{
                marginLeft: 'auto',
                padding: '4px 10px',
                background: 'transparent',
                border: `1px solid ${COLORS.glassBorder}`,
                borderRadius: RADIUS.sm,
                color: COLORS.silver,
                fontSize: '0.72rem',
                fontFamily: FONTS.body, fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = COLORS.offWhite; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = COLORS.silver; }}
            >
              × {language === 'tr' ? 'Temizle' : 'Clear'}
            </button>
          </div>
        )}

        {/* Color legend strip — explicit "color = category" mapping */}
        <div style={{
          padding: isMobile ? '8px 16px 0' : '12px 32px 0',
          display: 'flex', flexWrap: 'wrap',
          alignItems: 'center', gap: isMobile ? '10px 14px' : '12px 22px',
        }}>
          <span style={{
            fontSize: '0.6rem',
            color: COLORS.gold, opacity: 0.6,
            fontFamily: FONTS.body, fontWeight: 700,
            letterSpacing: '0.22em', textTransform: 'uppercase',
          }}>
            {language === 'tr' ? 'Renk = Kategori' : 'Color = Category'}
          </span>
          {Object.entries(CATEGORY_COLORS)
            .filter(([key]) => figures.some(f => f.type === key))
            .map(([key, color]) => (
              <div key={key} style={{
                display: 'inline-flex', alignItems: 'center', gap: '7px',
                fontSize: '0.72rem',
                color: COLORS.silver,
                fontFamily: FONTS.body,
              }}>
                <span style={{
                  width: '10px', height: '10px',
                  borderRadius: RADIUS.full,
                  background: color,
                  flexShrink: 0,
                }} />
                <span>{categoryLabels[key] || key}</span>
              </div>
            ))}
        </div>

        {/* ── Hz. Meryem spotlight (only in 'tumu' filter, no theme filter) ── */}
        {filter === 'tumu' && !themeFilter && filteredFigures.find(f => f.id === 'meryem') && (
          <div style={{ padding: isMobile ? '20px 16px 0' : '20px 32px 0' }}>
            <MeryemSpotlight
              figure={filteredFigures.find(f => f.id === 'meryem')}
              language={language}
              isMobile={isMobile}
              categoryLabel={categoryLabels['secilmis'] || ''}
              activeTheme={themeFilter}
              onThemeClick={(theme) => setThemeFilter(theme === themeFilter ? null : theme)}
            />
          </div>
        )}

        {/* Cards grid — Meryem hariç (spotlight'tayken) */}
        <div style={{
          padding: isMobile ? '20px 16px 40px' : '20px 32px 60px',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
          gap: isMobile ? '14px' : '18px',
        }}>
          {filteredFigures
            .filter(f => !(filter === 'tumu' && !themeFilter && f.id === 'meryem'))
            .map((figure, idx) => (
              <FigureCard
                key={figure.id}
                figure={figure}
                index={filter === 'tumu' && !themeFilter ? idx + 1 : idx}
                language={language}
                isMobile={isMobile}
                categoryLabel={categoryLabels[figure.type] || ''}
                activeTheme={themeFilter}
                onThemeClick={(theme) => setThemeFilter(theme === themeFilter ? null : theme)}
              />
            ))}
        </div>

        {/* Çapraz Okuma — only show when no filter active (full set) */}
        {filter === 'tumu' && (
          <CaprazOkumaSection language={language} isMobile={isMobile} />
        )}

        {/* Diğer Atıflar — only show when no filter active */}
        {filter === 'tumu' && data.additionalReferences && (
          <AdditionalReferencesSection
            data={data.additionalReferences}
            language={language}
            isMobile={isMobile}
          />
        )}
      </div>
    </div>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function Hero({ meta, figureCount, language, isMobile }) {
  const intro = meta.intro?.[language] || '';
  const tr = language === 'tr';

  // Anchor verses: Tahrîm 66:10-12 — Kur'an'ın kendi diptik/triptik mantığı
  // 66:10 karşıt örnek (Nuh + Lût eşleri), 66:11 örnek (Asiye), 66:12 taşıyıcı (Meryem)
  const v10Tr = "Allah, inkâr edenlere de Nûh'un karısı ile Lût'un karısını örnek gösterdi: iki sâlih kulun nikâhı altındayken hainlik ettiler...";
  const v10En = "Allah sets forth an example for those who disbelieved: the wife of Noah and the wife of Lot. They were under two of Our righteous servants but betrayed them...";
  const v10Ref = "Tahrîm 66:10";

  const anchorAr = "وَضَرَبَ اللّٰهُ مَثَلاً لِلَّذ۪ينَ اٰمَنُوا امْرَاَتَ فِرْعَوْنَۢ اِذْ قَالَتْ رَبِّ ابْنِ ل۪ي عِنْدَكَ بَيْتاً فِي الْجَنَّةِ";
  const anchorTr = "Allah, inananlara da Firavun'un karısını örnek gösterdi: \"Rabbim! Bana katında, cennette bir ev yap...\"";
  const anchorEn = "And Allah presents an example of those who believed: the wife of Pharaoh, when she said, \"My Lord, build for me near You a house in Paradise...\"";
  const anchorRef = "Tahrîm 66:11";

  const v12Tr = "İmrân kızı Meryem'i de (örnek gösterdi): iffetini korumuş, ruhumuzdan üflemiştik; o, Rabbinin sözlerini ve kitaplarını doğruladı, gönülden itaat edenlerdendi.";
  const v12En = "And Mary, daughter of Imran, who guarded her chastity. So We breathed into her of Our spirit, and she believed in the words of her Lord and His scriptures, and was of the devoutly obedient.";
  const v12Ref = "Tahrîm 66:12";

  return (
    <div style={{
      padding: isMobile ? '32px 20px 20px' : '48px 48px 32px',
    }}>
      {/* Badge */}
      <div style={{
        fontSize: '0.66rem', fontFamily: FONTS.body, fontWeight: 700,
        letterSpacing: '0.3em', textTransform: 'uppercase',
        color: COLORS.gold, opacity: 0.65, marginBottom: '14px',
      }}>
        {tr ? "Kur'an'da Kadınlar" : 'Women in the Quran'}
      </div>

      <h2 style={{
        fontFamily: FONTS.display, fontWeight: 700,
        fontSize: isMobile ? '1.85rem' : '2.4rem',
        color: COLORS.offWhite, margin: '0 0 12px',
        lineHeight: 1.15, maxWidth: '880px',
      }}>
        {tr ? 'Anılan, seçilen, ders olarak öne çıkan' : 'Named, chosen, set forth as lessons'}
      </h2>

      <p style={{
        color: COLORS.gold, opacity: 0.85,
        fontSize: isMobile ? '0.95rem' : '1.05rem',
        fontStyle: 'italic', fontFamily: FONTS.body,
        margin: '0 0 22px', maxWidth: '780px',
      }}>
        {tr
          ? "Yalnız bir kadın Kur'an'da adıyla anılır — geri kalanı sıfatları ve konumlarıyla."
          : "Only one woman is named in the Quran — the rest are referenced by attribute and station."}
      </p>

      <p style={{
        fontFamily: FONTS.body, fontSize: isMobile ? '0.95rem' : '1.05rem',
        color: COLORS.silver, margin: '0 0 32px', lineHeight: 1.7,
        maxWidth: '780px',
      }}>
        {intro}
      </p>

      {/* Sub-block divider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '0 0 28px' }}>
        <div style={{ flex: 1, height: '1px', background: `linear-gradient(to right, transparent, ${COLORS.goldAlpha25}, transparent)` }} />
        <span style={{
          color: COLORS.gold, opacity: 0.7,
          fontSize: '0.62rem', fontFamily: FONTS.body, fontWeight: 700,
          letterSpacing: '0.25em', textTransform: 'uppercase',
        }}>
          {tr ? 'Çekirdek Ayet' : 'Anchor Verse'}
        </span>
        <div style={{ flex: 1, height: '1px', background: `linear-gradient(to right, transparent, ${COLORS.goldAlpha25}, transparent)` }} />
      </div>

      {/* Anchor verse hero box */}
      <div style={{
        padding: isMobile ? '24px 20px' : '36px 44px',
        background: COLORS.goldAlpha04,
        border: `1px solid ${COLORS.goldAlpha25}`,
        borderRadius: RADIUS.xl,
        textAlign: 'center',
        maxWidth: '880px',
        margin: '0 auto 40px',
      }}>
        <div style={{
          fontSize: '0.62rem', fontFamily: FONTS.body, fontWeight: 700,
          letterSpacing: '0.32em', textTransform: 'uppercase',
          color: COLORS.gold, opacity: 0.6,
          marginBottom: '24px',
        }}>
          {tr ? 'Dört Kadın · Üç Ayet · Tek Çerçeve' : 'Four Women · Three Verses · One Frame'}
        </div>

        {/* 66:10 — karşıt örnek (Nuh + Lût eşleri) */}
        <div style={{ opacity: 0.7, marginBottom: '20px' }}>
          <p style={{
            color: COLORS.offWhite, fontSize: isMobile ? '0.82rem' : '0.88rem',
            fontStyle: 'italic', fontFamily: FONTS.body,
            lineHeight: 1.65, margin: '0 0 8px',
            maxWidth: '720px', marginInline: 'auto',
          }}>
            {tr ? v10Tr : v10En}
          </p>
          <p style={{
            color: COLORS.gold, fontSize: '0.7rem',
            fontFamily: FONTS.body, fontWeight: 600,
            letterSpacing: '0.08em', margin: 0, opacity: 0.85,
          }}>
            — {v10Ref}
          </p>
        </div>

        <div style={{
          height: '1px', maxWidth: '120px',
          margin: '0 auto 24px',
          background: `linear-gradient(to right, transparent, ${COLORS.goldAlpha25}, transparent)`,
        }} />

        {/* 66:11 — örnek (Asiye), ana ayet */}
        <p
          dir="rtl" lang="ar"
          style={{
            fontFamily: FONTS.quran,
            fontSize: isMobile ? '1.55rem' : '2rem',
            lineHeight: isMobile ? 2.0 : 2.2,
            color: COLORS.gold,
            margin: '0 0 22px',
          }}
        >
          {normalizeAr(anchorAr)}
        </p>
        <p style={{
          color: COLORS.offWhite, fontSize: isMobile ? '0.92rem' : '1.02rem',
          fontStyle: 'italic', fontFamily: FONTS.body,
          lineHeight: 1.7, margin: '0 0 12px',
          maxWidth: '720px', marginInline: 'auto',
        }}>
          {tr ? anchorTr : anchorEn}
        </p>
        <p style={{
          color: COLORS.gold, fontSize: '0.8rem',
          fontFamily: FONTS.body, fontWeight: 600,
          letterSpacing: '0.08em', margin: '0 0 24px',
        }}>
          — {anchorRef}
        </p>

        <div style={{
          height: '1px', maxWidth: '120px',
          margin: '0 auto 24px',
          background: `linear-gradient(to right, transparent, ${COLORS.goldAlpha25}, transparent)`,
        }} />

        {/* 66:12 — taşıyıcı (Hz. Meryem) */}
        <div style={{ opacity: 0.7 }}>
          <p style={{
            color: COLORS.offWhite, fontSize: isMobile ? '0.82rem' : '0.88rem',
            fontStyle: 'italic', fontFamily: FONTS.body,
            lineHeight: 1.65, margin: '0 0 8px',
            maxWidth: '720px', marginInline: 'auto',
          }}>
            {tr ? v12Tr : v12En}
          </p>
          <p style={{
            color: COLORS.gold, fontSize: '0.7rem',
            fontFamily: FONTS.body, fontWeight: 600,
            letterSpacing: '0.08em', margin: 0, opacity: 0.85,
          }}>
            — {v12Ref}
          </p>
        </div>
      </div>

      {/* Manifesto opener — narrative replacement for stats banner */}
      <div style={{
        marginTop: '12px', marginBottom: '8px',
        padding: isMobile ? '24px 0' : '32px 0',
        borderTop: `1px solid ${COLORS.goldAlpha25}`,
        borderBottom: `1px solid ${COLORS.goldAlpha25}`,
        textAlign: 'center',
      }}>
        <p style={{
          margin: 0,
          fontFamily: FONTS.display, fontWeight: 700,
          fontSize: isMobile ? '1.15rem' : '1.5rem',
          color: COLORS.gold,
          lineHeight: 1.5,
          letterSpacing: '0.01em',
        }}>
          {tr ? (
            <>
              <span style={{ color: COLORS.offWhite }}>{figureCount} kadın figür.</span>{' '}
              <span>Bir tek isim.</span>{' '}
              <span style={{ color: COLORS.offWhite }}>İki ilahi hitap.</span>{' '}
              <span>Bir taht.</span>
            </>
          ) : (
            <>
              <span style={{ color: COLORS.offWhite }}>{figureCount} women.</span>{' '}
              <span>Only one name.</span>{' '}
              <span style={{ color: COLORS.offWhite }}>Two divine addresses.</span>{' '}
              <span>One throne.</span>
            </>
          )}
        </p>
        <p style={{
          margin: '12px auto 0', maxWidth: '720px',
          fontSize: isMobile ? '0.78rem' : '0.85rem',
          color: COLORS.silver, opacity: 0.85,
          fontFamily: FONTS.body, lineHeight: 1.6,
          padding: '0 16px',
        }}>
          {tr
            ? "Hz. Meryem (adıyla anılan) · Hz. Mûsâ'nın annesi (vahiy) · Hz. Meryem (melekler) · Saba Melikesi (krallık)"
            : "Maryam (named) · Mother of Moses (waḥy) · Maryam (angels) · Queen of Sheba (kingdom)"}
        </p>
      </div>
    </div>
  );
}

// ── Figure Card ───────────────────────────────────────────────────────────────
function FigureCard({ figure, index, language, isMobile, categoryLabel, activeTheme, onThemeClick }) {
  const color = CATEGORY_COLORS[figure.type] || COLORS.silver;
  const tr = language === 'tr';
  const name = tr ? figure.nameTr : figure.nameEn;
  const epithet = tr ? figure.epithetTr : figure.epithetEn;
  const summary = tr ? figure.summaryTr : figure.summaryEn;
  const themes = (tr ? figure.themesTr : figure.themesEn) || [];
  const criticalNote = tr ? figure.criticalNoteTr : figure.criticalNoteEn;
  const keyVerseTr = tr ? figure.keyVerseTr : figure.keyVerseEn;
  const keyVerseRef = figure.keyVerseRef;
  const keyVerseAr = figure.keyVerseAr;

  return (
    <div style={{
      background: 'rgba(255,255,255,0.025)',
      border: `1px solid ${COLORS.glassBorder}`,
      borderLeft: `2px solid ${color}`,
      borderRadius: RADIUS.md,
      overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Header: index + category badge + name + epithet */}
      <div style={{
        padding: isMobile ? '18px 18px 14px' : '22px 22px 16px',
        borderBottom: `1px solid ${COLORS.goldAlpha15}`,
        display: 'flex', alignItems: 'flex-start', gap: '14px',
      }}>
        <span style={{
          flexShrink: 0,
          fontFamily: FONTS.body,
          fontSize: '0.7rem',
          fontWeight: 700,
          letterSpacing: '0.15em',
          color, opacity: 0.85,
          width: '22px',
          paddingTop: '4px',
        }}>
          {String(index + 1).padStart(2, '0')}
        </span>

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Category mini-badge */}
          {categoryLabel && (
            <div style={{
              display: 'inline-block',
              padding: '2px 8px',
              borderRadius: RADIUS.pill,
              background: `${color}14`,
              border: `1px solid ${color}33`,
              fontSize: '0.62rem',
              color, fontWeight: 600,
              fontFamily: FONTS.body,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              marginBottom: '8px',
            }}>
              {categoryLabel}
            </div>
          )}
          <h3 style={{
            margin: 0, fontFamily: FONTS.display, fontWeight: 700,
            fontSize: isMobile ? '1.15rem' : '1.25rem',
            color: COLORS.offWhite, lineHeight: 1.2,
          }}>
            {name}
          </h3>
          {epithet && (
            <p style={{
              margin: '6px 0 0', fontFamily: FONTS.body, fontSize: '0.8rem',
              color: COLORS.silver, opacity: 0.85, lineHeight: 1.5,
            }}>
              {epithet}
            </p>
          )}
        </div>
      </div>

      {/* Body */}
      <div style={{
        padding: isMobile ? '16px 18px 18px' : '20px 22px 22px',
        display: 'flex', flexDirection: 'column', gap: '16px',
      }}>
        {/* Key verse */}
        {keyVerseAr && (
          <div>
            <p
              dir="rtl" lang="ar"
              style={{
                margin: '0 0 12px', fontFamily: FONTS.quran,
                fontSize: isMobile ? '1.3rem' : '1.45rem',
                color: COLORS.gold, lineHeight: 1.95, textAlign: 'right',
              }}
            >
              {normalizeAr(keyVerseAr)}
            </p>
            {keyVerseTr && (
              <p style={{
                margin: '0 0 8px', fontFamily: FONTS.body,
                fontSize: '0.85rem', color: COLORS.silver, fontStyle: 'italic', lineHeight: 1.6,
              }}>
                "{keyVerseTr}"
              </p>
            )}
            {keyVerseRef && (
              <p style={{
                margin: 0, fontFamily: FONTS.body, fontSize: '0.74rem',
                color: COLORS.gold, fontWeight: 600, letterSpacing: '0.05em',
                opacity: 0.85,
              }}>
                — {keyVerseRef}
              </p>
            )}
          </div>
        )}

        {/* Summary */}
        {summary && (
          <p style={{
            margin: 0, fontFamily: FONTS.body, fontSize: '0.88rem',
            color: 'rgba(232,230,227,0.88)', lineHeight: 1.65,
          }}>
            {summary}
          </p>
        )}

        {/* Themes — clickable filter chips */}
        {themes.length > 0 && (
          <div>
            <div style={{
              fontSize: '0.6rem', color: COLORS.gold, opacity: 0.55,
              fontFamily: FONTS.body, fontWeight: 700,
              letterSpacing: '0.22em', textTransform: 'uppercase',
              marginBottom: '8px',
            }}>
              {tr ? 'Tema (tıkla → filtrele)' : 'Themes (click to filter)'}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {themes.map(t => {
                const isActive = activeTheme === t;
                return (
                  <button
                    key={t}
                    onClick={() => onThemeClick && onThemeClick(t)}
                    style={{
                      padding: '4px 10px',
                      background: isActive ? `${color}33` : `${color}14`,
                      border: `1px solid ${isActive ? color : `${color}33`}`,
                      borderRadius: RADIUS.pill,
                      fontSize: '0.7rem', color,
                      fontFamily: FONTS.body,
                      fontWeight: isActive ? 700 : 500,
                      letterSpacing: '0.02em',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = `${color}24`; }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = `${color}14`; }}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Verse refs */}
        {figure.verseRefs && figure.verseRefs.length > 0 && (
          <div>
            <div style={{
              fontSize: '0.6rem', color: COLORS.gold, opacity: 0.55,
              fontFamily: FONTS.body, fontWeight: 700,
              letterSpacing: '0.22em', textTransform: 'uppercase',
              marginBottom: '8px',
            }}>
              {tr ? 'Geçtiği Ayetler' : 'Verse References'}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
              {figure.verseRefs.map(ref => (
                <span key={ref} style={{
                  padding: '3px 9px',
                  borderRadius: RADIUS.sm,
                  fontSize: '0.7rem',
                  color: COLORS.silver,
                  fontFamily: FONTS.body, fontWeight: 500,
                  background: 'rgba(148,163,184,0.06)',
                  border: `1px solid rgba(148,163,184,0.18)`,
                }}>
                  {formatRef(ref, language)}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Critical note — softened style */}
        {criticalNote && (
          <div style={{
            marginTop: '4px',
            padding: '12px 14px',
            background: 'rgba(255,255,255,0.02)',
            border: `1px solid ${COLORS.glassBorderSoft}`,
            borderLeft: `2px solid ${COLORS.silverAlpha40}`,
            borderRadius: RADIUS.sm,
          }}>
            <div style={{
              fontSize: '0.6rem', color: COLORS.silver, opacity: 0.7,
              fontFamily: FONTS.body, fontWeight: 700,
              letterSpacing: '0.22em', textTransform: 'uppercase',
              marginBottom: '6px',
            }}>
              {tr ? 'Tarihsel Nüans' : 'Historical Note'}
            </div>
            <p style={{
              margin: 0,
              fontFamily: FONTS.body, fontSize: '0.78rem',
              color: COLORS.silver, lineHeight: 1.6, fontStyle: 'italic',
            }}>
              {criticalNote}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Çapraz Okuma — observation cards ─────────────────────────────────────────
// 14 figür üzerinden örüntüler. `cluster` alanı tematik gruplama için.
const OBSERVATIONS = [
  // ─── KÜME 1: SÖZ VE HİTAP ─────────────────────────────────────────────
  {
    id: 'naming', cluster: 'soz-hitap', isLead: true,
    statValue: '1 / 14',
    labelTr: 'Adıyla anılan',
    labelEn: 'Named',
    bodyTr: 'On dört figürden yalnız Hz. Meryem Kur\'an\'da özel adıyla anılır; bir sûre (Meryem 19) onun ismini taşır. Geriye kalan on üç kadın ya akrabalıkla ("İmran\'ın eşi", "Hz. Mûsâ\'nın annesi"), ya konumla ("Firavun\'un karısı"), ya da unvanla ("Saba Melikesi") anılır. Bu nüans atlasın merkezi akademik bulgusudur — kadın figürlerin "anonim" değil, **sıfaten tanımlı** olduğunu gösterir.',
    bodyEn: 'Of fourteen figures, only Maryam is named in the Quran; one chapter (Maryam 19) bears her name. The remaining thirteen women are referenced by kinship ("Imran\'s wife", "Mother of Moses"), station ("Pharaoh\'s wife"), or title ("Queen of Sheba"). This nuance is the atlas\'s central academic finding — female figures are not "anonymous" but **identified by attribute**.',
    groups: [
      {
        labelTr: 'ADIYLA', labelEn: 'BY NAME',
        chips: [{ name: 'Hz. Meryem', ref: 'Âl-i İmrân 3:42' }],
      },
      {
        labelTr: 'SIFATLA', labelEn: 'BY ATTRIBUTE',
        chips: [
          { name: 'Asiye', ref: 'Tahrîm 66:11', muted: true },
          { name: 'Hz. Havva', ref: "A'râf 7:19", muted: true },
          { name: 'Saba Melikesi', ref: 'Neml 27:23', muted: true },
          { name: 'Hz. Sara', ref: 'Zâriyât 51:29', muted: true },
          { name: "Mûsâ'nın annesi", ref: 'Kasas 28:7', muted: true },
          { name: "İmran'ın eşi", ref: 'Âl-i İmrân 3:35', muted: true },
          { name: "Aziz'in karısı", ref: 'Yûsuf 12:23', muted: true },
          { name: "Lût'un eşi", ref: 'Tahrîm 66:10', muted: true },
          { name: "Nuh'un eşi", ref: 'Tahrîm 66:10', muted: true },
          { name: "Yahya'nın annesi", ref: 'Meryem 19:5', muted: true },
          { name: "Şuayb'ın kızı", ref: 'Kasas 28:25', muted: true },
          { name: 'Havle', ref: 'Mücâdele 58:1', muted: true },
          { name: "Mûsâ'nın ablası", ref: 'Kasas 28:11', muted: true },
        ],
      },
    ],
  },
  {
    id: 'wahy', cluster: 'soz-hitap',
    statValue: '1 + 1',
    labelTr: 'Vahy lafzı vs melek hitabı',
    labelEn: 'Waḥy term vs angelic address',
    bodyTr: 'Kur\'an\'da kendisine doğrudan وحي (vahy) lafzıyla bildirimde bulunulan tek kadın Hz. Mûsâ\'nın annesidir (Kasas 28:7). Hz. Meryem farklı bir teolojik kategoride — meleklerin doğrudan ona hitap ettiği belirtilir. Klasik tefsir (Râzî, Kurtubî) bu ayrımı dikkatle korur. Bu hitabın "nübüvvet" mi "ilham" mı olduğu tartışmalı; Cumhûr ilham görüşündedir.',
    bodyEn: 'Only one woman in the Quran is addressed with the direct term وحي (waḥy): the Mother of Moses (Q 28:7). Maryam belongs to a distinct theological category — angels speak directly to her. Classical tafsir (Razi, Qurtubi) carefully preserves this distinction. Whether this constitutes prophetic revelation or ilham is debated; the majority hold the ilham view.',
    groups: [
      {
        labelTr: 'VAHY (وحي) LAFZIYLA', labelEn: 'WITH THE TERM WAḤY',
        chips: [{ name: "Mûsâ'nın annesi", ref: 'Kasas 28:7' }],
      },
      {
        labelTr: 'MELEKLERLE KONUŞAN', labelEn: 'ADDRESSED BY ANGELS',
        chips: [
          { name: 'Hz. Meryem', ref: 'Âl-i İmrân 3:42' },
          { name: 'Hz. Meryem', ref: 'Meryem 19:17' },
        ],
      },
    ],
  },
  {
    id: 'speech', cluster: 'soz-hitap',
    statValue: '10 / 14',
    labelTr: 'Doğrudan konuşan',
    labelEn: 'Direct speech recorded',
    bodyTr: 'On dört figürden onunun doğrudan sözü Kur\'an\'da nakledilir. Sessiz dört kadın: Hz. Havva (cennetten çıkış anlatımlarında çift fail olarak Hz. Âdem ile birlikte gösterilir), Hz. Lût ve Hz. Nuh\'un eşleri (karşıt örnek olarak yalnız zikredilir), Hz. Yahya\'nın annesi (Hz. Zekeriyya\'nın duası ön planda).',
    bodyEn: 'Ten of fourteen figures speak directly in the Quran. The four silent ones: Hawwa (joint agent with Adam in the Fall narratives), the wives of Lot and Noah (mentioned only as counter-examples), and the mother of Yahya (Zechariah\'s prayer takes the foreground).',
    groups: [
      {
        labelTr: 'KONUŞAN', labelEn: 'SPEAKING',
        chips: [
          { name: 'Hz. Meryem', ref: 'Meryem 19:18' },
          { name: 'Asiye', ref: 'Tahrîm 66:11' },
          { name: 'Saba Melikesi', ref: 'Neml 27:32' },
          { name: 'Hz. Sara', ref: 'Zâriyât 51:29' },
          { name: "Mûsâ'nın annesi", ref: 'Kasas 28:11' },
          { name: "İmran'ın eşi", ref: 'Âl-i İmrân 3:35' },
          { name: "Aziz'in karısı", ref: 'Yûsuf 12:51' },
          { name: "Şuayb'ın kızı", ref: 'Kasas 28:26' },
          { name: 'Havle', ref: 'Mücâdele 58:1' },
          { name: "Mûsâ'nın ablası", ref: 'Kasas 28:12' },
        ],
      },
      {
        labelTr: 'SESSİZ', labelEn: 'SILENT',
        chips: [
          { name: 'Hz. Havva', ref: 'Bakara 2:35', muted: true },
          { name: "Lût'un eşi", ref: 'Tahrîm 66:10', muted: true },
          { name: "Nuh'un eşi", ref: 'Tahrîm 66:10', muted: true },
          { name: "Yahya'nın annesi", ref: 'Meryem 19:5', muted: true },
        ],
      },
    ],
  },

  // ─── KÜME 2: SARAY VE İKTİDAR ─────────────────────────────────────────
  {
    id: 'palace', cluster: 'saray-iktidar',
    statValue: '3 saray',
    labelTr: 'Üç saray, üç tepki',
    labelEn: 'Three palaces, three responses',
    bodyTr: 'Saray motifi üç farklı kadında üç farklı tepkiyi karşılaştırır: Asiye (Firavun\'un sarayında iman → "müminlere örnek"), Aziz\'in karısı (Mısır sarayında tutku → ihanet → itiraf), Saba Melikesi (kendi sarayında istişâre → hidayet). Aynı mekânsal arketip, üç ayrı dramatik yay.',
    bodyEn: 'The palace motif sets three women\'s contrasting responses side by side: Asiya (faith inside Pharaoh\'s palace → "example for believers"), the Aziz\'s wife (passion → betrayal → confession in the Egyptian palace), the Queen of Sheba (consultation → conversion in her own palace). One spatial archetype, three distinct dramatic arcs.',
    groups: [
      {
        labelTr: 'ÜÇ TEPKİ', labelEn: 'THREE RESPONSES',
        chips: [
          { name: 'Asiye — iman', ref: 'Tahrîm 66:11' },
          { name: "Aziz'in karısı — tutku → tövbe", ref: 'Yûsuf 12:51' },
          { name: 'Belkıs — hidayet', ref: 'Neml 27:44' },
        ],
      },
    ],
  },
  {
    id: 'ruler', cluster: 'saray-iktidar',
    statValue: '1 / 14',
    labelTr: 'Bir krallığı yöneten',
    labelEn: 'A ruling queen',
    bodyTr: 'Kur\'an yalnız bir kadın hükümdarın anlatısını ayrıntılı verir: Saba Melikesi. Onun siyasi bilgeliği (savaş yerine elçi gönderme, 27:35), entelektüel cesareti (sarayı görünce hatasını kabul, 27:44) ve teolojik dönüşümü (27:44) Neml 22 ayet boyunca işlenir.',
    bodyEn: 'The Quran narrates only one female ruler in detail: the Queen of Sheba. Her political wisdom (sending envoys instead of going to war, 27:35), intellectual courage (acknowledging her error upon seeing the palace, 27:44), and theological transformation (27:44) unfold across 22 verses in Surah an-Naml.',
    groups: [
      {
        labelTr: 'HÜKÜMDAR', labelEn: 'RULER',
        chips: [{ name: 'Saba Melikesi', ref: 'Neml 27:23-44' }],
      },
    ],
  },

  // ─── KÜME 3: DOĞUM VE SOY ─────────────────────────────────────────────
  {
    id: 'miracle-birth', cluster: 'dogum-soy',
    statValue: '3 / 14',
    labelTr: 'Mucize doğum',
    labelEn: 'Miraculous birth',
    bodyTr: 'Üç kadın olağanüstü doğum mucizesinin merkezindedir: Hz. Sara (kısırlık + ileri yaş → Hz. İshak\'ın müjdesi), Hz. Yahya\'nın annesi (kısırlık → Hz. Yahya, 19:7) ve Hz. Meryem (babasız doğum, 19:20). Her üç anlatı yapısal olarak benzer: "imkânsız" doğumun ilahi bildirimle gerçekleşmesi.',
    bodyEn: 'Three women stand at the center of extraordinary birth miracles: Sarah (barrenness + advanced age → Isaac\'s birth tidings), the mother of Yahya (barrenness → Yahya, 19:7), and Maryam (fatherless birth, 19:20). The three accounts share a structural template: the "impossible" birth realized through divine annunciation.',
    groups: [
      {
        labelTr: 'MUCİZE DOĞUM', labelEn: 'MIRACULOUS BIRTH',
        chips: [
          { name: 'Hz. Sara', ref: 'Hûd 11:71-73' },
          { name: "Yahya'nın annesi", ref: 'Meryem 19:7' },
          { name: 'Hz. Meryem', ref: 'Meryem 19:16-22' },
        ],
      },
    ],
  },
  {
    id: 'lineage', cluster: 'dogum-soy',
    statValue: '3 nesil',
    labelTr: 'Üç nesil soy zinciri',
    labelEn: 'A three-generation thread',
    bodyTr: 'İmran\'ın eşi karnındaki çocuğu mâbede adar (3:35) → Hz. Meryem mâbedde Hz. Zekeriyya\'nın himayesinde yetişir (3:37) → Hz. İsa, babasız mucize doğumla dünyaya gelir (3:45). Tek bir adakla başlayan üç nesillik zincir, atlasta birden fazla figürün ortak çerçevede buluştuğu nadir örüntüdür.',
    bodyEn: 'Imran\'s wife pledges her unborn child to the temple (3:35) → Maryam is raised in the temple under Zechariah\'s care (3:37) → Jesus is born by fatherless miracle (3:45). A three-generation chain springing from a single vow — a rare pattern where multiple atlas figures meet within one unified frame.',
    groups: [
      {
        labelTr: 'ÜÇ NESİL', labelEn: 'THREE GENERATIONS',
        chips: [
          { name: "İmran'ın eşi (adak)", ref: 'Âl-i İmrân 3:35' },
          { name: 'Hz. Meryem (mâbedde)', ref: 'Âl-i İmrân 3:37' },
          { name: 'Hz. İsa (doğum)', ref: 'Âl-i İmrân 3:45' },
        ],
      },
    ],
  },

  // ─── KÜME 4: ÖRNEK / KARŞIT ÖRNEK / TARİHSEL TANIKLIK ─────────────────
  {
    id: 'counter-example', cluster: 'ornek-tarih',
    statValue: '2 / 14',
    labelTr: 'Karşıt örnek olarak takdim',
    labelEn: 'Presented as counter-example',
    bodyTr: 'Tahrîm 66:10\'da Allah, "inkar edenlere örnek" (mathalan li\'l-ladhīna kafarū) olarak iki figürü zikreder: Hz. Lût ve Hz. Nuh\'un eşleri. Bu ifade, sonraki ayetlerdeki "müminlere örnek" çerçevesine (Asiye 66:11, Hz. Meryem 66:12) tam paralel ama zıt bir teolojik kategoridir. Aynı sûrede, aynı yapı — biri olumlu, diğeri olumsuz arketip.',
    bodyEn: 'In Q 66:10 Allah cites two figures as "an example for those who disbelieved" (mathalan li\'l-ladhīna kafarū): the wives of Lot and Noah. This stands in exact parallel — but opposite — to the subsequent "example for believers" frame (Asiya 66:11, Maryam 66:12). The same surah, the same structure — one a positive, the other a negative archetype.',
    groups: [
      {
        labelTr: 'KARŞIT ÖRNEK', labelEn: 'COUNTER-EXAMPLE',
        chips: [
          { name: "Hz. Lût'un eşi", ref: 'Tahrîm 66:10' },
          { name: "Hz. Nuh'un eşi", ref: 'Tahrîm 66:10' },
        ],
      },
      {
        labelTr: 'PARALEL: MÜMİNLERE ÖRNEK', labelEn: 'PARALLEL: EXAMPLE FOR BELIEVERS',
        chips: [
          { name: 'Asiye', ref: 'Tahrîm 66:11', muted: true },
          { name: 'Hz. Meryem', ref: 'Tahrîm 66:12', muted: true },
        ],
      },
    ],
  },
  {
    id: 'namesake', cluster: 'ornek-tarih',
    statValue: '1',
    labelTr: 'Bir sûreye ad veren kadın',
    labelEn: 'A woman who names a surah',
    bodyTr: 'Mücâdele (58.) sûresi adını, kocasının zıharına itiraz eden Havle bint Sa\'lebe\'den alır — "el-Mücâdile" (tartışan/ısrarcı kadın) ondaki sûre başlığıdır. Bir kadının sosyal-hukuki şikâyetinin doğrudan sûre adına dönüştüğü tek olaydır. Esbâbu\'n-nüzûl literatüründe (Vâhidî, Buhârî) zıhar hükmünün bu olay üzerine indiği belgelenir.',
    bodyEn: 'Surah al-Mujadila (58) takes its name from Khawla bint Tha\'laba, who disputed her husband\'s zihar — "al-Mujadila" (the woman who pleads/disputes). It is the only instance where a woman\'s social-legal complaint becomes the very title of a surah. The asbāb an-nuzūl literature (Wahidi, Bukhari) documents that the ruling on zihar was revealed in response to this incident.',
    groups: [
      {
        labelTr: 'SÛREYE AD VEREN', labelEn: 'NAMING THE SURAH',
        chips: [{ name: 'Havle bint Sa\'lebe', ref: 'Mücâdele 58:1-4' }],
      },
    ],
  },
  {
    id: 'kemal', cluster: 'ornek-tarih',
    statValue: '4',
    labelTr: 'Hadiste "kemâle eren" dört kadın',
    labelEn: 'Four "perfected" women in hadith',
    bodyTr: 'Hadis literatüründe (Buhârî, Enbiyâ 32; Müslim, Fedâilü\'s-Sahâbe 70) Hz. Peygamber\'in "kemâl mertebesine ulaşmış" olarak isimlendirdiği dört kadın: Hz. Meryem ve Asiye (Kur\'an\'da yer alan iki figür) + Hz. Hatice ve Hz. Fâtıma (yalnızca hadis-tarih kaynaklarında). Atlasın ilk ikisi içerdiği, son ikisinin Kur\'an dışında kaldığı dikkatli bir ayrımdır.',
    bodyEn: 'In hadith literature (Bukhari, Anbiya 32; Muslim, Fada\'il as-Sahaba 70) the Prophet names four women as having reached the rank of perfection: Maryam and Asiya (two atlas figures) + Khadija and Fatima (only in hadith-historical sources). The careful distinction: the atlas includes the first two; the latter two fall outside the Quran.',
    groups: [
      {
        labelTr: "KUR'AN'DA", labelEn: 'IN THE QURAN',
        chips: [
          { name: 'Hz. Meryem', ref: 'Âl-i İmrân 3:42' },
          { name: 'Asiye', ref: 'Tahrîm 66:11' },
        ],
      },
      {
        labelTr: 'HADİS-TARİH', labelEn: 'HADITH-HISTORY',
        chips: [
          { name: 'Hz. Hatice', ref: '—', muted: true },
          { name: 'Hz. Fâtıma', ref: '—', muted: true },
        ],
      },
    ],
  },
];

// Tematik küme tanımları
const CLUSTERS = [
  { id: 'soz-hitap',     labelTr: 'Söz ve Hitap',                 labelEn: 'Speech and Address' },
  { id: 'saray-iktidar', labelTr: 'Saray ve İktidar',             labelEn: 'Palace and Power' },
  { id: 'dogum-soy',     labelTr: 'Doğum ve Soy',                 labelEn: 'Birth and Lineage' },
  { id: 'ornek-tarih',   labelTr: 'Örnek, Karşıt Örnek, Tarih',   labelEn: 'Exemplar, Counter-Example, History' },
];

// ── Hz. Meryem Spotlight (full-width) ─────────────────────────────────────────
// Kur'an'da adıyla anılan tek kadın olduğu için ayrı görsel mertebe.
function MeryemSpotlight({ figure, language, isMobile, categoryLabel, activeTheme, onThemeClick }) {
  const tr = language === 'tr';
  const color = COLORS.gold;
  const name = tr ? figure.nameTr : figure.nameEn;
  const epithet = tr ? figure.epithetTr : figure.epithetEn;
  const summary = tr ? figure.summaryTr : figure.summaryEn;
  const themes = (tr ? figure.themesTr : figure.themesEn) || [];
  const criticalNote = tr ? figure.criticalNoteTr : figure.criticalNoteEn;
  const keyVerseTr = tr ? figure.keyVerseTr : figure.keyVerseEn;
  const keyVerseRef = figure.keyVerseRef;
  const keyVerseAr = figure.keyVerseAr;

  return (
    <div style={{
      position: 'relative',
      background: 'linear-gradient(135deg, rgba(212,165,116,0.06) 0%, rgba(212,165,116,0.02) 100%)',
      border: `1px solid ${COLORS.goldAlpha25}`,
      borderLeft: `3px solid ${color}`,
      borderRadius: RADIUS.lg,
      overflow: 'hidden',
    }}>
      {/* Spotlight badge — top-right corner */}
      <div style={{
        position: 'absolute',
        top: isMobile ? '14px' : '20px',
        right: isMobile ? '16px' : '24px',
        padding: '4px 10px',
        background: 'rgba(212,165,116,0.12)',
        border: `1px solid ${COLORS.goldAlpha45}`,
        borderRadius: RADIUS.pill,
        fontSize: '0.6rem',
        color: COLORS.gold,
        fontFamily: FONTS.body, fontWeight: 700,
        letterSpacing: '0.18em', textTransform: 'uppercase',
        zIndex: 1,
      }}>
        {tr ? '★ Adıyla anılan tek kadın' : '★ The only named woman'}
      </div>

      {/* Header section */}
      <div style={{
        padding: isMobile ? '24px 20px 18px' : '32px 32px 22px',
        borderBottom: `1px solid ${COLORS.goldAlpha15}`,
        display: 'flex', alignItems: 'flex-start', gap: '16px',
      }}>
        <span style={{
          flexShrink: 0,
          fontFamily: FONTS.body,
          fontSize: '0.82rem',
          fontWeight: 700,
          letterSpacing: '0.15em',
          color, opacity: 0.9,
          width: '28px',
          paddingTop: '6px',
        }}>
          01
        </span>
        <div style={{ flex: 1, minWidth: 0, paddingRight: isMobile ? '0' : '160px' }}>
          {categoryLabel && (
            <div style={{
              display: 'inline-block',
              padding: '3px 10px',
              borderRadius: RADIUS.pill,
              background: `${color}1a`,
              border: `1px solid ${color}45`,
              fontSize: '0.66rem',
              color, fontWeight: 600,
              fontFamily: FONTS.body,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              marginBottom: '10px',
            }}>
              {categoryLabel}
            </div>
          )}
          <h3 style={{
            margin: 0, fontFamily: FONTS.display, fontWeight: 700,
            fontSize: isMobile ? '1.6rem' : '2rem',
            color: COLORS.offWhite, lineHeight: 1.15,
            letterSpacing: '0.005em',
          }}>
            {name}
          </h3>
          {epithet && (
            <p style={{
              margin: '8px 0 0', fontFamily: FONTS.body,
              fontSize: isMobile ? '0.92rem' : '1rem',
              color: COLORS.silver, opacity: 0.9, lineHeight: 1.55,
              fontStyle: 'italic',
            }}>
              {epithet}
            </p>
          )}
        </div>
      </div>

      {/* Body — two-column on desktop, stacked on mobile */}
      <div style={{
        padding: isMobile ? '20px 20px 24px' : '28px 32px 32px',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1.1fr 1fr',
        gap: isMobile ? '20px' : '36px',
      }}>
        {/* Left column: Arabic verse + meal + ref */}
        {keyVerseAr && (
          <div>
            <p
              dir="rtl" lang="ar"
              style={{
                margin: '0 0 16px', fontFamily: FONTS.quran,
                fontSize: isMobile ? '1.5rem' : '1.85rem',
                color: COLORS.gold, lineHeight: 2.1, textAlign: 'right',
              }}
            >
              {normalizeAr(keyVerseAr)}
            </p>
            {keyVerseTr && (
              <p style={{
                margin: '0 0 10px', fontFamily: FONTS.body,
                fontSize: isMobile ? '0.92rem' : '0.98rem',
                color: COLORS.offWhite, opacity: 0.9, fontStyle: 'italic', lineHeight: 1.7,
              }}>
                "{keyVerseTr}"
              </p>
            )}
            {keyVerseRef && (
              <p style={{
                margin: 0, fontFamily: FONTS.body, fontSize: '0.78rem',
                color: COLORS.gold, fontWeight: 600, letterSpacing: '0.06em',
                opacity: 0.9,
              }}>
                — {keyVerseRef}
              </p>
            )}
          </div>
        )}

        {/* Right column: summary + themes + verse refs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {summary && (
            <p style={{
              margin: 0, fontFamily: FONTS.body,
              fontSize: isMobile ? '0.9rem' : '0.95rem',
              color: 'rgba(232,230,227,0.92)', lineHeight: 1.7,
            }}>
              {summary}
            </p>
          )}

          {themes.length > 0 && (
            <div>
              <div style={{
                fontSize: '0.6rem', color: COLORS.gold, opacity: 0.6,
                fontFamily: FONTS.body, fontWeight: 700,
                letterSpacing: '0.22em', textTransform: 'uppercase',
                marginBottom: '8px',
              }}>
                {tr ? 'Tema (tıkla → filtrele)' : 'Themes (click to filter)'}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {themes.map(t => {
                  const isActive = activeTheme === t;
                  return (
                    <button
                      key={t}
                      onClick={() => onThemeClick && onThemeClick(t)}
                      style={{
                        padding: '4px 10px',
                        background: isActive ? `${color}33` : `${color}14`,
                        border: `1px solid ${isActive ? color : `${color}33`}`,
                        borderRadius: RADIUS.pill,
                        fontSize: '0.7rem', color,
                        fontFamily: FONTS.body,
                        fontWeight: isActive ? 700 : 500,
                        letterSpacing: '0.02em',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = `${color}24`; }}
                      onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = `${color}14`; }}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {figure.verseRefs && figure.verseRefs.length > 0 && (
            <div>
              <div style={{
                fontSize: '0.6rem', color: COLORS.gold, opacity: 0.6,
                fontFamily: FONTS.body, fontWeight: 700,
                letterSpacing: '0.22em', textTransform: 'uppercase',
                marginBottom: '8px',
              }}>
                {tr ? 'Geçtiği Ayetler' : 'Verse References'}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {figure.verseRefs.map(ref => (
                  <span key={ref} style={{
                    padding: '3px 9px',
                    borderRadius: RADIUS.sm,
                    fontSize: '0.7rem',
                    color: COLORS.silver,
                    fontFamily: FONTS.body, fontWeight: 500,
                    background: 'rgba(148,163,184,0.06)',
                    border: `1px solid rgba(148,163,184,0.18)`,
                  }}>
                    {formatRef(ref, language)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Critical note — full width at bottom */}
      {criticalNote && (
        <div style={{
          margin: isMobile ? '0 20px 20px' : '0 32px 28px',
          padding: '14px 18px',
          background: 'rgba(255,255,255,0.02)',
          border: `1px solid ${COLORS.glassBorderSoft}`,
          borderLeft: `2px solid ${COLORS.silverAlpha40}`,
          borderRadius: RADIUS.sm,
        }}>
          <div style={{
            fontSize: '0.6rem', color: COLORS.silver, opacity: 0.7,
            fontFamily: FONTS.body, fontWeight: 700,
            letterSpacing: '0.22em', textTransform: 'uppercase',
            marginBottom: '6px',
          }}>
            {tr ? 'Tarihsel Nüans' : 'Historical Note'}
          </div>
          <p style={{
            margin: 0,
            fontFamily: FONTS.body, fontSize: '0.8rem',
            color: COLORS.silver, lineHeight: 1.65, fontStyle: 'italic',
          }}>
            {criticalNote}
          </p>
        </div>
      )}
    </div>
  );
}

function CaprazOkumaSection({ language, isMobile }) {
  const tr = language === 'tr';
  return (
    <div style={{
      padding: isMobile ? '40px 16px 60px' : '60px 32px 80px',
      borderTop: `1px solid ${COLORS.glassBorderSoft}`,
      marginTop: '20px',
    }}>
      {/* Section header */}
      <div style={{
        fontSize: '0.66rem', fontFamily: FONTS.body, fontWeight: 700,
        letterSpacing: '0.3em', textTransform: 'uppercase',
        color: COLORS.gold, opacity: 0.7, marginBottom: '8px',
      }}>
        {tr ? 'Çapraz Okuma' : 'Cross-Reading'}
      </div>
      <h3 style={{
        fontFamily: FONTS.display, fontWeight: 700,
        fontSize: isMobile ? '1.4rem' : '1.7rem',
        color: COLORS.offWhite, margin: '0 0 12px',
        lineHeight: 1.2,
      }}>
        {tr ? 'Yedi Figürün Örüntüleri' : 'Patterns Across the Seven'}
      </h3>
      <p style={{
        fontFamily: FONTS.body,
        fontSize: isMobile ? '0.92rem' : '1rem',
        color: COLORS.silver, margin: '0 0 32px', lineHeight: 1.65,
        maxWidth: '780px',
      }}>
        {tr
          ? "Yedi kadını yan yana koyduğumuzda ortaya çıkan örüntüler: kim adıyla anılıyor, kim doğrudan vahiy alıyor, kim sarayda iman ediyor, hangi soy zinciri kuruluyor."
          : "Patterns that emerge when the seven women are placed side by side: who is named, who receives waḥy directly, who believes within a palace, what lineage chain is built."}
      </p>

      {/* Observation grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
        gap: '14px',
      }}>
        {OBSERVATIONS.map(obs => (
          <div key={obs.id} style={{
            padding: '20px 22px',
            background: 'rgba(255,255,255,0.025)',
            border: `1px solid ${COLORS.glassBorder}`,
            borderRadius: RADIUS.md,
            display: 'flex', flexDirection: 'column', gap: '14px',
          }}>
            {/* Top: stat + label + body */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{
                flexShrink: 0,
                minWidth: '78px', maxWidth: '110px',
                textAlign: 'center',
                padding: '8px 8px',
                background: COLORS.goldAlpha15,
                border: `1px solid ${COLORS.goldAlpha45}`,
                borderRadius: RADIUS.md,
              }}>
                <div style={{
                  fontFamily: FONTS.display,
                  fontSize: '0.95rem', fontWeight: 700,
                  color: COLORS.gold, lineHeight: 1.15,
                }}>
                  {obs.statValue}
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h4 style={{
                  margin: '0 0 6px',
                  color: COLORS.offWhite,
                  fontFamily: FONTS.body, fontWeight: 700,
                  fontSize: '0.95rem',
                }}>
                  {tr ? obs.labelTr : obs.labelEn}
                </h4>
                <p style={{
                  margin: 0,
                  fontFamily: FONTS.body, fontSize: '0.85rem',
                  color: COLORS.silver, lineHeight: 1.6,
                }}>
                  {tr ? obs.bodyTr : obs.bodyEn}
                </p>
              </div>
            </div>

            {/* Ref chip groups */}
            {obs.groups && obs.groups.length > 0 && (
              <div style={{
                display: 'flex', flexDirection: 'column', gap: '10px',
                paddingTop: '12px',
                borderTop: `1px solid ${COLORS.goldAlpha15}`,
              }}>
                {obs.groups.map((g, gi) => (
                  <div key={gi} style={{
                    display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: '8px',
                  }}>
                    <span style={{
                      flexShrink: 0,
                      color: COLORS.gold, opacity: 0.7,
                      fontSize: '0.6rem', fontFamily: FONTS.body, fontWeight: 700,
                      letterSpacing: '0.18em',
                      minWidth: isMobile ? 'auto' : '108px',
                      paddingTop: '4px',
                    }}>
                      {tr ? g.labelTr : g.labelEn}
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', flex: 1 }}>
                      {g.chips.map((chip, ci) => (
                        <span key={ci} style={{
                          display: 'inline-flex', alignItems: 'baseline', gap: '6px',
                          padding: '4px 10px',
                          borderRadius: RADIUS.pill,
                          fontSize: '0.7rem',
                          fontFamily: FONTS.body, fontWeight: 600,
                          background: chip.muted ? 'rgba(148,163,184,0.06)' : 'rgba(212,165,116,0.08)',
                          border: `1px solid ${chip.muted ? 'rgba(148,163,184,0.18)' : COLORS.goldAlpha25}`,
                          color: chip.muted ? COLORS.silver : COLORS.offWhite,
                          opacity: chip.muted ? 0.7 : 1,
                        }}>
                          <span style={{ color: chip.muted ? COLORS.silver : COLORS.gold }}>
                            {chip.name}
                          </span>
                          {chip.ref && chip.ref !== '—' && (
                            <span style={{
                              fontSize: '0.64rem', opacity: 0.75,
                              letterSpacing: '0.02em',
                            }}>
                              {chip.ref}
                            </span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Diğer Atıflar (Atlasta kart açılmayan figürlerin notu) ────────────────────
// Tier sistemi: items üç farklı varlık seviyesine göre gruplanır.
//   1 = Kur'an'da geçer ama bireysel kart yok (gold)
//   2 = Klasik tefsirde imâ edilen (silver)
//   3 = Kur'an'da yok, hadis ve sîret kaynaklarında (emerald)
const TIER_PALETTE = {
  1: { accent: COLORS.gold,    chipBg: COLORS.goldAlpha15,           chipBorder: COLORS.goldAlpha45 },
  2: { accent: COLORS.silver,  chipBg: COLORS.silverAlpha12,         chipBorder: COLORS.silverAlpha40 },
  3: { accent: COLORS.emerald, chipBg: 'rgba(26,122,76,0.18)',       chipBorder: 'rgba(26,122,76,0.55)' },
};

function AdditionalReferencesSection({ data, language, isMobile }) {
  const tr = language === 'tr';
  const items = data.items || [];
  const tiers = data.tiers || {};
  if (items.length === 0) return null;

  // Group items by tier (preserves source order within each tier)
  const byTier = items.reduce((acc, item) => {
    const t = item.tier || 1;
    (acc[t] = acc[t] || []).push(item);
    return acc;
  }, {});
  const tierOrder = Object.keys(byTier).sort((a, b) => Number(a) - Number(b));

  return (
    <div style={{
      padding: isMobile ? '40px 16px 80px' : '60px 32px 100px',
      borderTop: `1px solid ${COLORS.glassBorderSoft}`,
      marginTop: '20px',
    }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
      <div style={{
        fontSize: '0.66rem', fontFamily: FONTS.body, fontWeight: 700,
        letterSpacing: '0.3em', textTransform: 'uppercase',
        color: COLORS.silver, opacity: 0.7, marginBottom: '8px',
      }}>
        {tr ? data.titleTr : data.titleEn}
      </div>
      <h3 style={{
        fontFamily: FONTS.display, fontWeight: 700,
        fontSize: isMobile ? '1.4rem' : '1.7rem',
        color: COLORS.offWhite, margin: '0 0 12px',
        lineHeight: 1.2,
      }}>
        {tr
          ? "Atlasa Alınmayan Diğer Geçişler"
          : "Other Mentions Not Given Cards"}
      </h3>
      <p style={{
        fontFamily: FONTS.body,
        fontSize: isMobile ? '0.92rem' : '1rem',
        color: COLORS.silver, margin: '0 0 36px', lineHeight: 1.65,
        maxWidth: '880px',
      }}>
        {tr ? data.introTr : data.introEn}
      </p>

      {tierOrder.map((tierKey, tierIdx) => {
        const tierMeta = tiers[tierKey] || {};
        const palette = TIER_PALETTE[tierKey] || TIER_PALETTE[1];
        const tierItems = byTier[tierKey];
        const isLast = tierIdx === tierOrder.length - 1;
        return (
          <div key={tierKey} style={{ marginBottom: isLast ? 0 : '40px' }}>
            {/* Tier header */}
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: '14px',
              marginBottom: '16px', paddingLeft: '2px',
            }}>
              <span style={{
                width: '24px', height: '2px',
                background: palette.accent, opacity: 0.7,
                flexShrink: 0, marginTop: '9px',
              }} />
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '0.7rem', fontFamily: FONTS.body, fontWeight: 700,
                  letterSpacing: '0.22em', textTransform: 'uppercase',
                  color: palette.accent, opacity: 0.9,
                  marginBottom: '6px',
                }}>
                  {tr ? tierMeta.labelTr : tierMeta.labelEn}
                </div>
                {(tierMeta.descTr || tierMeta.descEn) && (
                  <div style={{
                    fontSize: '0.82rem', fontFamily: FONTS.body,
                    color: COLORS.silver, opacity: 0.78,
                    fontStyle: 'italic', lineHeight: 1.55,
                    maxWidth: '760px',
                  }}>
                    {tr ? tierMeta.descTr : tierMeta.descEn}
                  </div>
                )}
              </div>
            </div>

            {/* Cards in this tier */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {tierItems.map((item, i) => (
                <div key={i} style={{
                  padding: isMobile ? '18px 20px' : '22px 26px',
                  background: 'rgba(255,255,255,0.02)',
                  border: `1px solid ${COLORS.glassBorderSoft}`,
                  borderLeft: `2px solid ${palette.accent}`,
                  borderRadius: RADIUS.md,
                }}>
                  <div style={{
                    display: 'flex', alignItems: 'baseline', gap: '12px',
                    flexWrap: 'wrap', marginBottom: '12px',
                  }}>
                    <h4 style={{
                      margin: 0,
                      fontFamily: FONTS.display, fontWeight: 700,
                      fontSize: isMobile ? '1rem' : '1.05rem',
                      color: COLORS.offWhite,
                      lineHeight: 1.3,
                    }}>
                      {tr ? item.titleTr : item.titleEn}
                    </h4>
                    {item.ref && (
                      <span style={{
                        fontSize: '0.68rem',
                        color: palette.accent,
                        background: palette.chipBg,
                        border: `1px solid ${palette.chipBorder}`,
                        padding: '3px 10px',
                        borderRadius: '999px',
                        fontFamily: FONTS.body, fontWeight: 600,
                        letterSpacing: '0.04em',
                        whiteSpace: 'nowrap',
                      }}>
                        {item.ref}
                      </span>
                    )}
                  </div>
                  <p style={{
                    margin: 0,
                    fontFamily: FONTS.body,
                    fontSize: isMobile ? '0.86rem' : '0.9rem',
                    color: COLORS.silver, lineHeight: 1.75,
                    maxWidth: '780px',
                  }}>
                    {tr ? item.noteTr : item.noteEn}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      })}
      </div>
    </div>
  );
}
