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
function normalizeAr(s) {
  if (!s) return '';
  return s
    .replace(/\u06EA/g, '\u0650')                                  // asar → kasra
    .replace(/[\u06D6-\u06DC]/g, '')                              // small high marks (waqf etc.)
    .replace(/[\u06DD\u06DE]/g, '')                                // end-of-ayah, rub el hizb
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
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = COLORS.offWhite; }}
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
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < BREAKPOINT_MOBILE);
  const bodyRef = useRef(null);

  // When category filter changes, clear theme filter (avoid stale state)
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

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < BREAKPOINT_MOBILE);
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
                  border: `1px solid ${active ? color : 'rgba(255,255,255,0.1)'}`,
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
                  borderRadius: '50%',
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

  // Anchor verse: Tahrîm 66:11 — Allah'ın bizzat "inananlara örnek" olarak Asiye'yi sunduğu ayet
  const anchorAr = "وَضَرَبَ اللّٰهُ مَثَلاً لِلَّذ۪ينَ اٰمَنُوا امْرَاَتَ فِرْعَوْنَۢ اِذْ قَالَتْ رَبِّ ابْنِ ل۪ي عِنْدَكَ بَيْتاً فِي الْجَنَّةِ";
  const anchorTr = "Allah, inananlara da Firavun'un karısını örnek gösterdi: \"Rabbim! Bana katında, cennette bir ev yap...\"";
  const anchorEn = "And Allah presents an example of those who believed: the wife of Pharaoh, when she said, \"My Lord, build for me near You a house in Paradise...\"";
  const anchorRef = "Tahrîm 66:11";

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
        background: 'rgba(212,165,116,0.04)',
        border: `1px solid ${COLORS.goldAlpha25}`,
        borderRadius: RADIUS.xl,
        textAlign: 'center',
        maxWidth: '880px',
        margin: '0 auto 40px',
      }}>
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
          letterSpacing: '0.08em', margin: 0,
        }}>
          — {anchorRef}
        </p>
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
const OBSERVATIONS = [
  {
    id: 'naming',
    statValue: '1 / 7',
    labelTr: 'Adıyla anılan',
    labelEn: 'Named',
    bodyTr: 'Yalnız Hz. Meryem Kur\'an\'da özel adıyla anılır; bir sûre (Meryem 19) onun ismini taşır. Diğer altı kadın ya akrabalıkla (\"İmran\'ın eşi\", \"Mûsâ\'nın annesi\"), ya konumla (\"Firavun\'un karısı\"), ya da unvanla (\"Saba Melikesi\") anılır.',
    bodyEn: 'Only Maryam is named in the Quran; one chapter (Maryam 19) bears her name. The other six women are referenced through kinship ("Imran\'s wife", "Mother of Moses"), station ("Pharaoh\'s wife"), or title ("Queen of Sheba").',
    groups: [
      {
        labelTr: 'ADIYLA', labelEn: 'BY NAME',
        chips: [{ name: 'Hz. Meryem', ref: 'Âl-i İmrân 3:42' }],
      },
      {
        labelTr: 'SIFATLA', labelEn: 'BY ATTRIBUTE',
        chips: [
          { name: 'Asiye', ref: 'Tahrîm 66:11', muted: true },
          { name: 'Hz. Havva', ref: 'A\'râf 7:19', muted: true },
          { name: 'Saba Melikesi', ref: 'Neml 27:23', muted: true },
          { name: 'Sara', ref: 'Zâriyât 51:29', muted: true },
          { name: "Hz. Mûsâ'nın annesi", ref: 'Kasas 28:7', muted: true },
          { name: "İmran'ın eşi", ref: 'Âl-i İmrân 3:35', muted: true },
        ],
      },
    ],
  },
  {
    id: 'wahy',
    statValue: '1 + 1',
    labelTr: 'Meleklerle konuşan / vahiy alan',
    labelEn: 'Spoken to by angels / received waḥy',
    bodyTr: 'Kur\'an\'da kendisine doğrudan وحي (vahiy) lafzıyla bildirimde bulunulan **tek kadın** Hz. Mûsâ\'nın annesidir (Kasas 28:7: وَأَوْحَيْنَا إِلَىٰ أُمِّ مُوسَىٰ). Hz. Meryem ise farklı bir teolojik kategoride — meleklerin doğrudan ona hitap ettiği belirtilir (Âl-i İmrân 3:42 قَالَتِ الْمَلَائِكَةُ; Meryem 19:17 Ruh\'un kendisine "temessül" etmesi). Klasik tefsir bu ayrımı dikkatle korur (Râzî, Mefâtîh; Kurtubî). Bu vahyin/hitabın "nübüvvet" mi yoksa "ilham" mı olduğu tartışmalıdır — Cumhûr ilham görüşündedir.',
    bodyEn: 'Only **one woman** is addressed with the direct term وحي (waḥy) in the Quran: the Mother of Moses (Q 28:7: "We inspired the mother of Moses"). Maryam falls in a distinct theological category — angels speak directly to her (Q 3:42 "the angels said"; Q 19:17 the Spirit assumes form for her). Classical tafsir carefully preserves this distinction (Razi, Mafatih; Qurtubi). Whether this constitutes prophetic revelation or ilham (inspiration) is debated — the majority hold the ilham view.',
    groups: [
      {
        labelTr: 'VAHİY (وحي) LAFZIYLA', labelEn: 'WITH THE TERM WAḤY',
        chips: [
          { name: "Hz. Mûsâ'nın annesi", ref: 'Kasas 28:7' },
        ],
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
    id: 'speech',
    statValue: '6 / 7',
    labelTr: 'Doğrudan konuşan',
    labelEn: 'Direct speech recorded',
    bodyTr: 'Yedi figürden altısının doğrudan sözü Kur\'an\'da nakledilir; yalnız Hz. Havvâ\'nın bağımsız sözü yoktur — cennetten çıkarılma anlatımları onu Hz. Âdem ile çift fail olarak gösterir.',
    bodyEn: 'Six of the seven figures speak directly in the Quran; only Hawwa has no independent speech — narratives of the descent from Paradise treat her as joint agent with Adam.',
    groups: [
      {
        labelTr: 'KONUŞAN', labelEn: 'SPEAKING',
        chips: [
          { name: 'Hz. Meryem', ref: '19:18' },
          { name: 'Asiye', ref: '66:11' },
          { name: 'Saba Melikesi', ref: '27:32' },
          { name: 'Sara', ref: '51:29' },
          { name: "Mûsâ'nın annesi", ref: '28:13' },
          { name: "İmran'ın eşi", ref: '3:35' },
        ],
      },
      {
        labelTr: 'SESSİZ', labelEn: 'SILENT',
        chips: [{ name: 'Hz. Havva', ref: '2:35 / 7:19', muted: true }],
      },
    ],
  },
  {
    id: 'palace',
    statValue: 'Sarayda iman',
    labelTr: "Asiye paradoksu",
    labelEn: 'The Asiya paradox',
    bodyTr: 'Asiye, tarihin en zalim hükümdarlarından birinin sarayında iman eder ve "müminlere örnek" olarak takdim edilir (66:11). Aynı Kur\'an, başka bir sarayda (Yûsuf 12) Aziz\'in karısının ihanetini anlatır — iki saray, iki kadın, iki tepki.',
    bodyEn: 'Asiya believes within the palace of one of history\'s most tyrannical rulers and is set forth as "an example for believers" (66:11). The same Quran narrates the betrayal of the Aziz\'s wife in another palace (Surah Yusuf 12) — two palaces, two women, two responses.',
    groups: [
      {
        labelTr: 'KARŞIT TABLO', labelEn: 'CONTRASTING IMAGES',
        chips: [
          { name: 'Asiye (iman)', ref: 'Tahrîm 66:11' },
          { name: "Aziz'in karısı (ihanet)", ref: 'Yûsuf 12:23-32', muted: true },
        ],
      },
    ],
  },
  {
    id: 'miracle-birth',
    statValue: '2 / 7',
    labelTr: 'Mucize doğum',
    labelEn: 'Miraculous birth',
    bodyTr: 'İki kadın olağanüstü doğum mucizesinin merkezindedir: Sara (kısırlık + ileri yaş → İshak\'ın müjdesi, 51:29) ve Hz. Meryem (babasız doğum, 19:20). Her iki anlatıda da kadının şaşkınlığı/gülmesi açıkça kayıtlıdır.',
    bodyEn: 'Two women stand at the center of extraordinary birth miracles: Sarah (barrenness + advanced age → tidings of Isaac, 51:29) and Maryam (fatherless birth, 19:20). In both narratives the woman\'s astonishment/laughter is explicitly recorded.',
    groups: [
      {
        labelTr: 'MUCİZE', labelEn: 'MIRACLE',
        chips: [
          { name: 'Sara (yaşlılıkta)', ref: 'Hûd 11:71-73' },
          { name: 'Hz. Meryem (babasız)', ref: 'Meryem 19:16-22' },
        ],
      },
    ],
  },
  {
    id: 'lineage',
    statValue: '3 nesil',
    labelTr: 'Soy zinciri',
    labelEn: 'A lineage chain',
    bodyTr: 'İmran\'ın eşi karnındaki çocuğu mâbede adar (3:35) → Hz. Meryem mâbedde Zekeriyya\'nın himayesinde yetişir (3:37) → Hz. İsa, babasız mucize doğumla dünyaya gelir (3:45). Üç nesilde örülen, tek bir adak ile başlayan bir kıssa.',
    bodyEn: 'Imran\'s wife pledges her unborn child to the temple (3:35) → Maryam is raised in the temple under Zechariah\'s care (3:37) → Jesus is born by fatherless miracle (3:45). A three-generation thread woven from a single vow.',
    groups: [
      {
        labelTr: 'ÜÇ NESİL', labelEn: 'THREE GENERATIONS',
        chips: [
          { name: "İmran'ın eşi (adak)", ref: '3:35' },
          { name: 'Hz. Meryem (mâbedde)', ref: '3:37' },
          { name: 'Hz. İsa (doğum)', ref: '3:45' },
        ],
      },
    ],
  },
  {
    id: 'kemal',
    statValue: '4',
    labelTr: 'Hadiste "kemâle eren" dört kadın',
    labelEn: 'Four "perfected" women in hadith',
    bodyTr: 'Hadis literatüründe (Buhârî, Enbiyâ 32; Müslim, Fedâilü\'s-Sahâbe 70) Hz. Peygamber\'in "kemâl mertebesine ulaşmış" olarak isimlendirdiği dört kadın: Hz. Meryem ve Asiye (Kur\'an\'da) + Hz. Hatice ve Hz. Fâtıma (hadis-tarih kaynaklarında). İlk ikisi bu atlasta, son ikisi Kur\'an dışındadır.',
    bodyEn: 'In the hadith literature (Bukhari, Anbiya 32; Muslim, Fada\'il as-Sahaba 70) the Prophet names four women as having reached the rank of perfection: Maryam and Asiya (in the Quran) + Khadija and Fatima (in hadith-historical sources). The first two are in this atlas; the latter two are outside the Quran.',
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
function AdditionalReferencesSection({ data, language, isMobile }) {
  const tr = language === 'tr';
  const items = data.items || [];
  if (items.length === 0) return null;

  return (
    <div style={{
      padding: isMobile ? '40px 16px 80px' : '60px 32px 100px',
      borderTop: `1px solid ${COLORS.glassBorderSoft}`,
      marginTop: '20px',
    }}>
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
        color: COLORS.silver, margin: '0 0 32px', lineHeight: 1.65,
        maxWidth: '880px',
      }}>
        {tr ? data.introTr : data.introEn}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {items.map((item, i) => (
          <div key={i} style={{
            padding: '20px 24px',
            background: 'rgba(255,255,255,0.02)',
            border: `1px solid ${COLORS.glassBorderSoft}`,
            borderLeft: `2px solid ${COLORS.silverAlpha40}`,
            borderRadius: RADIUS.md,
          }}>
            <div style={{
              display: 'flex', alignItems: 'baseline', gap: '14px',
              flexWrap: 'wrap', marginBottom: '10px',
            }}>
              <h4 style={{
                margin: 0,
                fontFamily: FONTS.display, fontWeight: 700,
                fontSize: '1rem',
                color: COLORS.offWhite,
              }}>
                {tr ? item.titleTr : item.titleEn}
              </h4>
              {item.ref && (
                <span style={{
                  fontSize: '0.72rem',
                  color: COLORS.gold, opacity: 0.8,
                  fontFamily: FONTS.body, fontWeight: 600,
                  letterSpacing: '0.05em',
                }}>
                  {item.ref}
                </span>
              )}
            </div>
            <p style={{
              margin: 0,
              fontFamily: FONTS.body, fontSize: '0.86rem',
              color: COLORS.silver, lineHeight: 1.65,
            }}>
              {tr ? item.noteTr : item.noteEn}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
