'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS, BREAKPOINT_MOBILE, RADIUS, TRANSITION } from '../tokens';
import ToolHeader from './ToolHeader';
import CrossToolCTA from './CrossToolCTA';
import SourcesCitation from './SourcesCitation';

const INITIAL_SHOW = 2;

export default function AddresseeSystem({ onClose }) {
  const { language } = useLanguage();
  const [data, setData]         = useState(null);
  const [activeId, setActiveId] = useState('iman');
  const [expanded, setExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false)  // SSR-safe; useEffect h() post-mount hydrate;

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < BREAKPOINT_MOBILE);
    h(); // post-mount hydrate
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  useEffect(() => {
    fetch('/addressees.json')
      .then(r => r.json())
      .then(setData)
      .catch(err => console.error('[AddresseeSystem] fetch failed:', err));
  }, []);

  // Escape to close (§13.3)
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  // Body scroll lock kaldırıldı — WowFacts/IlkSon pattern: normal-flow document scroll.

  const categories = (data?.categories ?? []).slice().sort((a, b) => (b.stats?.count ?? 0) - (a.stats?.count ?? 0));
  const active     = categories.find(c => c.id === activeId) ?? null;
  const accent     = active?.accent ?? COLORS.gold;

  function selectCategory(id) {
    setActiveId(id);
    setExpanded(false);
  }

  const shownVerses = active
    ? expanded
      ? active.example_verses
      : active.example_verses.slice(0, INITIAL_SHOW)
    : [];

  const hiddenCount = active
    ? active.example_verses.length - INITIAL_SHOW
    : 0;

  const ADDR_TOOL_HEADER = (
    <ToolHeader
      icon={
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      }
      titleTr="Muhataplar Sistemi"
      titleEn="Quranic Addressee System"
      subtitleTr="Ey iman edenler · Ey insanlar · Ey ehl-i kitap"
      subtitleEn="O believers · O mankind · O People of the Book"
      language={language}
    />
  );

  // Related-tool CTA — data'dan bağımsız, hem loading hem main return'de aynı.
  // SSR HTML'inde CTA görünür → SEO ve first paint için kritik (2026-07-15 audit fix).
  const RELATED_CTA = (
    <div style={{ maxWidth: 1080, margin: '0 auto', padding: isMobile ? '32px 16px 80px' : '48px 32px 100px' }}>
      <CrossToolCTA
        language={language}
        isMobile={isMobile}
        links={[
          {
            href: `/${language}/graf/diyalog`,
            titleTr: 'Diyalog Ağı',
            titleEn: 'Dialogue Network',
            descTr: 'Kur\'an\'da ~300 diyalog — muhatap sistemi\'nin canlı sahneleri.',
            descEn: '~300 dialogues in the Quran — the addressee system in living scenes.',
          },
          {
            href: `/${language}/arac/retorik`,
            titleTr: "Kur'an Belâgatı",
            titleEn: 'Quranic Rhetoric',
            descTr: 'Muhatap seçimi retoriğin çekirdeğidir — iltifât, takdîm-tehîr.',
            descEn: 'Choice of addressee is the core of rhetoric — iltifāt, syntactic shifts.',
          },
          {
            href: `/${language}/arac/dua-dili`,
            titleTr: 'Dua Dili',
            titleEn: 'Language of Prayer',
            descTr: 'İnsanın Allah\'a hitabı — muhatap sisteminin özel bir alt-tipi.',
            descEn: "The human's address to God — a special subtype of the addressee system.",
          },
        ]}
      />
    </div>
  );

  // ── Loading skeleton ─────────────────────────────────────────────────────────
  if (!data) {
    return (
      <div style={{
        background: COLORS.cosmicBlack,
        minHeight: 'calc(100vh - 62px)',
        display: 'flex', flexDirection: 'column',
        paddingTop: '62px',
      }}>
        {ADDR_TOOL_HEADER}
        <div style={{ minHeight: '40vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: COLORS.silver, fontSize: '0.9rem' }}>
            {language === 'tr' ? 'Yükleniyor…' : 'Loading…'}
          </span>
        </div>
        {RELATED_CTA}
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
      {ADDR_TOOL_HEADER}

      {/* ── HERO (Cinematic) ────────────────────────────────────────────────── */}
      <div style={{
        padding: isMobile ? '40px 16px 28px' : '56px 32px 36px',
        background: 'linear-gradient(180deg, rgba(212,165,116,0.06) 0%, transparent 100%)',
        borderBottom: `1px solid ${COLORS.glassBorderSoft || 'rgba(255,255,255,0.06)'}`,
        textAlign: 'center',
        flexShrink: 0,
      }}>
        <div dir="rtl" lang="ar" aria-label="Bismillāh" style={{ fontFamily: FONTS.bismillah, fontSize: isMobile ? '1.5rem' : '1.95rem', color: COLORS.gold, opacity: 0.82, lineHeight: 1, marginBottom: isMobile ? '26px' : '36px', textShadow: `0 0 22px ${COLORS.gold}28` }}>﷽</div>
        <p dir="rtl" lang="ar" style={{ fontFamily: FONTS.quran, fontSize: isMobile ? 'clamp(1.05rem, 4.2vw, 1.4rem)' : 'clamp(1.25rem, 2.3vw, 1.65rem)', color: COLORS.gold, lineHeight: 2.1, margin: '0 auto 16px', maxWidth: '820px', textShadow: `0 0 20px ${COLORS.gold}1c` }}>
          يَٓا اَيُّهَا النَّاسُ اعْبُدُوا رَبَّكُمُ الَّذِي خَلَقَكُمْ وَالَّذِينَ مِنْ قَبْلِكُمْ لَعَلَّكُمْ تَتَّقُونَ
        </p>
        <p style={{ color: COLORS.offWhite, fontFamily: FONTS.display, fontStyle: 'italic', fontSize: isMobile ? '0.94rem' : 'clamp(0.95rem, 1.6vw, 1.05rem)', lineHeight: 1.7, margin: '0 auto 8px', maxWidth: '680px', opacity: 0.95 }}>
          "{language === 'tr' ? 'Ey insanlar! Sizi ve sizden öncekileri yaratan Rabbinize kulluk edin ki, takvâya eresiniz.' : "O mankind, worship your Lord who created you and those before you, so that you may attain piety."}"
        </p>
        <p style={{ color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.72rem', letterSpacing: '0.16em', textTransform: 'uppercase', margin: '0 0 32px', opacity: 0.78 }}>
          — {language === 'tr' ? 'Bakara 2:21' : 'Al-Baqarah 2:21'}
        </p>
        <p style={{ color: COLORS.silver, fontFamily: FONTS.display, fontStyle: 'italic', fontSize: isMobile ? '0.92rem' : 'clamp(0.95rem, 1.55vw, 1.02rem)', lineHeight: 1.7, margin: '0 auto 36px', maxWidth: '700px', opacity: 0.88 }}>
          {language === 'tr'
            ? <>Kur'an'ın en sık üç hitap ekseni <em style={{ fontStyle: 'normal', color: COLORS.gold }}>yâ eyyuhâ'n-nâs</em> (tüm insanlar), <em style={{ fontStyle: 'normal', color: COLORS.gold }}>yâ eyyuhâ'l-lezîne âmenû</em> (müminler) ve <em style={{ fontStyle: 'normal', color: COLORS.gold }}>yâ eyyuhâ'n-nebî</em> (Resul) — ama sesleniş bununla bitmez: İsrailoğulları'ndan Ehl-i Kitap'a, Âdemoğulları'ndan Peygamber'in eşlerine <em style={{ fontStyle: 'normal', color: COLORS.gold }}>11 farklı muhatap</em> vardır. Hitap değişimi anlam değişimidir.</>
            : <>The Quran's three most frequent registers are <em style={{ fontStyle: 'normal', color: COLORS.gold }}>yā ayyuhā'n-nās</em> (all mankind), <em style={{ fontStyle: 'normal', color: COLORS.gold }}>yā ayyuhā'l-ladhīna āmanū</em> (believers), and <em style={{ fontStyle: 'normal', color: COLORS.gold }}>yā ayyuhā'n-nabī</em> (the Messenger) — yet the address goes further: from the Children of Israel to the People of the Book, the children of Adam to the wives of the Prophet, there are <em style={{ fontStyle: 'normal', color: COLORS.gold }}>11 distinct addressees</em>. A shift in address is a shift in meaning.</>}
        </p>
        <div aria-hidden="true" style={{ width: '120px', height: '1px', background: `linear-gradient(to right, transparent, ${COLORS.gold}66, transparent)`, margin: '0 auto 28px' }} />
        <div style={{ fontSize: '0.68rem', letterSpacing: '0.3em', color: COLORS.gold, textTransform: 'uppercase', fontFamily: FONTS.body, fontWeight: 700, opacity: 0.75, marginBottom: '14px' }}>
          {language === 'tr' ? "USLÛB-İ HİTÂB · MUHATAPLAR" : "USLŪB AL-KHIṬĀB · ADDRESSEES"}
        </div>
        <h2 style={{ fontFamily: FONTS.display, fontSize: isMobile ? 'clamp(1.6rem, 7vw, 2rem)' : 'clamp(2rem, 3.6vw, 2.7rem)', fontWeight: 700, color: COLORS.offWhite, margin: '0 auto 14px', lineHeight: 1.18, letterSpacing: '-0.015em', maxWidth: '760px' }}>
          {language === 'tr' ? "Kur'an Kime Sesleniyor?" : 'To Whom Does the Quran Speak?'}
        </h2>
        <p style={{ fontFamily: FONTS.display, fontSize: isMobile ? '1rem' : 'clamp(1.05rem, 1.8vw, 1.18rem)', color: COLORS.gold, margin: '0 auto 12px', lineHeight: 1.55, fontStyle: 'italic', maxWidth: '700px', opacity: 0.92 }}>
          {language === 'tr' ? 'Tek bir Kitap, çoklu seslenen, farklı muhataplar.' : 'One Book, multiple voices, distinct addressees.'}
        </p>
      </div>

      {/* ── CHIP ROW — yalnızca mobil ───────────────────────────────────────────
          Masaüstünde sayılı sidebar navigasyonu üstleniyor; çip sırası da
          görününce çift navigasyon oluyordu (§14.3 sidebar kuralı: sidebar
          desktop, chip row mobil). Masaüstünde gizlendi (2026-07-24). */}
      <div style={{
        flexShrink: 0,
        display: isMobile ? 'flex' : 'none', gap: '6px', overflowX: 'auto',
        padding: '10px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(0,0,0,0.2)',
        scrollbarWidth: 'none',
      }}>
        {categories.map(cat => {
          const isActive = cat.id === activeId;
          return (
            <button
              key={cat.id}
              onClick={() => selectCategory(cat.id)}
              style={{
                flexShrink: 0,
                padding: '5px 14px',
                borderRadius: RADIUS.pillSm,
                border: `1px solid ${isActive ? cat.accent : COLORS.glassBorder}`,
                background: isActive ? `${cat.accent}22` : 'transparent',
                color: isActive ? cat.accent : COLORS.silver,
                fontSize: '0.8rem', fontWeight: isActive ? 600 : 400,
                fontFamily: FONTS.body,
                cursor: 'pointer',
                transition: `all ${TRANSITION.fast}`,
              }}
            >
              {language === 'tr' ? cat.tr : cat.en}
            </button>
          );
        })}
      </div>

      {/* ── BODY (sidebar + detail) ───────────────────────────────────────────── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Sidebar — hidden on mobile, chip row handles navigation there */}
        <div style={{
          width: '200px', flexShrink: 0,
          borderRight: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(255,255,255,0.02)',
          overflowY: 'auto',
          display: isMobile ? 'none' : 'flex', flexDirection: 'column',
          padding: '12px 0',
        }}>
          <div style={{
            padding: '0 16px 8px',
            fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: COLORS.slate500,
            fontFamily: FONTS.body,
          }}>
            {language === 'tr' ? 'Muhataplar' : 'Addressees'}
          </div>

          {categories.map(cat => {
            const isActive = cat.id === activeId;
            return (
              <button
                key={cat.id}
                onClick={() => selectCategory(cat.id)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '9px 16px',
                  background: isActive ? `${cat.accent}14` : 'transparent',
                  border: 'none',
                  borderLeft: `3px solid ${isActive ? cat.accent : 'transparent'}`,
                  color: isActive ? cat.accent : COLORS.silver,
                  fontSize: '0.83rem', fontWeight: isActive ? 600 : 400,
                  fontFamily: FONTS.body,
                  cursor: 'pointer',
                  transition: `all ${TRANSITION.fast}`,
                  textAlign: 'left',
                  width: '100%',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
              >
                <span>{language === 'tr' ? cat.tr : cat.en}</span>
                <span style={{
                  fontSize: '0.72rem',
                  color: isActive ? cat.accent : COLORS.slate500,
                  fontWeight: 700,
                }}>
                  {cat.stats.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Detail panel */}
        <div style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '16px' : '28px 32px' }}>
          {active && (
            <>
              {/* Arabic hitap */}
              <div style={{
                fontFamily: FONTS.quran,
                fontSize: isMobile ? '1.5rem' : '2rem',
                color: accent,
                direction: 'rtl',
                textAlign: 'right',
                lineHeight: 1.8,
                marginBottom: '12px',
              }}>
                {active.arabic}
              </div>

              {/* Turkish name */}
              <h2 style={{
                color: COLORS.offWhite, fontSize: '1.25rem',
                fontWeight: 700, fontFamily: FONTS.body,
                margin: '0 0 8px 0',
              }}>
                {language === 'tr' ? active.tr : active.en}
              </h2>

              {/* Description */}
              <p style={{
                color: COLORS.silver, fontSize: '0.88rem',
                lineHeight: 1.7, margin: '0 0 24px 0',
                fontFamily: FONTS.body,
                maxWidth: '680px',
              }}>
                {language === 'tr' ? active.desc.tr : active.desc.en}
              </p>

              {/* ── Stats ── */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                gap: '12px',
                marginBottom: '28px',
              }}>
                <StatBox
                  label={language === 'tr' ? 'Hitap' : 'Addresses'}
                  value={active.stats.count}
                  valueColor={accent}
                />
                <StatBox
                  label={language === 'tr' ? (active.stats.medeni_percent >= 50 ? '% Medenî' : '% Mekkî') : (active.stats.medeni_percent >= 50 ? '% Medinan' : '% Meccan')}
                  value={active.stats.medeni_percent >= 50 ? active.stats.medeni_percent : 100 - active.stats.medeni_percent}
                  valueColor="#4caf7d"
                />
                <StatBox
                  label={language === 'tr' ? 'Sûre' : 'Surahs'}
                  value={active.stats.sure_count}
                  valueColor="#4a9ee8"
                />
                <StatBox
                  label={language === 'tr' ? 'Yoğun Sûreler' : 'Top Surahs'}
                  value={active.stats.yogun_sureler.slice(0, 2).join(', ')}
                  valueColor={COLORS.gold}
                  small
                />
              </div>

              {/* ── Theme map ── */}
              <div style={{ marginBottom: '28px' }}>
                <SectionTitle language={language} tr="Tema Haritası" en="Theme Map" />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {(language === 'tr' ? active.themes.tr : active.themes.en).map(theme => (
                    <span key={theme} style={{
                      padding: '5px 12px',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: RADIUS.pillSm,
                      color: COLORS.offWhite,
                      fontSize: '0.8rem',
                      fontFamily: FONTS.body,
                    }}>
                      {theme}
                    </span>
                  ))}
                </div>
              </div>

              {/* ── Example verses ── */}
              <div>
                <SectionTitle language={language} tr="Örnek Ayetler" en="Example Verses" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {shownVerses.map((v, i) => (
                    <VerseCard key={i} verse={v} accent={accent} language={language} />
                  ))}
                </div>

                {!expanded && hiddenCount > 0 && (
                  <button
                    onClick={() => setExpanded(true)}
                    style={{
                      marginTop: '14px',
                      padding: '8px 18px',
                      background: 'transparent',
                      border: `1px solid ${accent}44`,
                      borderRadius: RADIUS.md,
                      color: accent,
                      fontSize: '0.82rem',
                      fontFamily: FONTS.body,
                      cursor: 'pointer',
                      transition: `all ${TRANSITION.fast}`,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = `${accent}11`; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    + {hiddenCount} {language === 'tr' ? 'ayet daha göster' : 'more verses'}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 1080, margin: '0 auto', padding: isMobile ? '0 16px' : '0 32px', width: '100%' }}>
        <SourcesCitation
          language={language}
          isMobile={isMobile}
          sources={[
            { author: 'Bedreddin ez-Zerkeşî', workTr: "el-Burhân fî Ulûmi'l-Kur'ân", workEn: 'al-Burhān fī ʿUlūm al-Qurʾān', period: 'ö. 1392 (Kahire)', noteTr: "Kur'ân ilimlerinde hitâb (muhâtab) türlerini sistematik işleyen klasik eser.", noteEn: 'Classical work systematically treating the types of Qur\'anic address (khiṭāb).' },
            { author: 'Celâleddin es-Süyûtî', workTr: "el-İtkân fî Ulûmi'l-Kur'ân", workEn: 'al-Itqān fī ʿUlūm al-Qurʾān', period: 'ö. 1505 (Kahire)', noteTr: 'Âmm-hâss ve muhâtab çeşitlerine dair kapsamlı Kur\'ân ilimleri ansiklopedisi.', noteEn: 'Encyclopedic Qur\'anic sciences work on general/specific and types of addressee.' },
            { author: 'Fahreddin er-Râzî', workTr: "Mefâtîhu'l-Gayb", workEn: 'Mafātīḥ al-Ghayb', period: 'ö. 1210 (Herat)', noteTr: 'Hitap çözümlemesini tefsir içinde derinleştiren büyük dirâyet tefsiri.', noteEn: 'Major analytical tafsir deepening the analysis of address within exegesis.' },
          ]}
        />
      </div>
      {/* CrossToolCTA — RELATED_CTA sabiti kullanılıyor (loading skeleton ile aynı,
          duplikasyon önlendi). */}
      {RELATED_CTA}
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatBox({ label, value, valueColor, small = false }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: RADIUS.chip,
      padding: '14px 16px',
    }}>
      <div style={{
        color: valueColor,
        fontSize: small ? '0.88rem' : '1.6rem',
        fontWeight: 700,
        fontFamily: FONTS.body,
        lineHeight: 1.1,
        marginBottom: '4px',
      }}>
        {value}
      </div>
      <div style={{
        color: COLORS.slate500,
        fontSize: '0.72rem',
        fontFamily: FONTS.body,
        letterSpacing: '0.03em',
      }}>
        {label}
      </div>
    </div>
  );
}

function SectionTitle({ language, tr, en }) {
  return (
    <div style={{
      color: COLORS.silver,
      fontSize: '0.75rem',
      fontWeight: 700,
      fontFamily: FONTS.body,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      marginBottom: '12px',
    }}>
      {language === 'tr' ? tr : en}
    </div>
  );
}

function VerseCard({ verse, accent, language }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderLeft: `3px solid ${accent}`,
      borderRadius: RADIUS.chip,
      padding: '16px 18px',
    }}>
      {/* Arabic */}
      <div style={{
        fontFamily: FONTS.quran,
        fontSize: '1.5rem',
        color: accent,
        direction: 'rtl',
        textAlign: 'right',
        lineHeight: 2,
        marginBottom: '8px',
      }} dir="rtl" lang="ar">
        {verse.arabic}
      </div>

      {/* Ref + topic */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        marginBottom: '6px',
      }}>
        <span style={{
          color: COLORS.slate500, fontSize: '0.72rem',
          fontFamily: FONTS.body,
        }}>
          {verse.surah} {verse.ref}
        </span>
        {verse.topic && (
          <>
            <span style={{ color: COLORS.slate500, fontSize: '0.7rem' }}>·</span>
            <span style={{
              color: COLORS.silver, fontSize: '0.72rem',
              fontFamily: FONTS.body,
            }}>
              {language === 'tr' ? verse.topic.tr : verse.topic.en}
            </span>
          </>
        )}
      </div>

      {/* Translation */}
      <div style={{
        color: COLORS.offWhite,
        fontSize: '0.88rem',
        fontFamily: FONTS.body,
        fontStyle: 'italic',
        lineHeight: 1.65,
      }}>
        {language === 'tr' ? verse.tr : verse.en}
      </div>
    </div>
  );
}
