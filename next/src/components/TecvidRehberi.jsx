'use client';

// ─── Tecvid Rehberi — /arac/tecvid-rehberi ──────────────────────────────────
// Kur'an okuma kurallarını renk + gerçek kārî sesiyle öğreten görsel rehber.
// Kurallar/örnekler: public/tecvid-rehberi.json (9 aile · 42 kural · 126 örnek).
// Ses: public/tecvid-audio/*.mp3 (Alafasy, Husary, Minshawy kısa âyet kesitleri).
// Renkler okuma modundaki tecvid motorunun (applyTajweed) paletiyle AYNI
// (tokens.js TAJWEED) — öğrenci burada öğrendiği rengi mushafta tanır.

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import ToolHeader from './ToolHeader';
import CrossToolCTA from './CrossToolCTA';
import useNavbarOffset from './useNavbarOffset';
import { COLORS, FONTS, SEMANTIC, TAJWEED, RADIUS, TRANSITION, BREAKPOINT_MOBILE } from '../tokens';
import tecvidData from '../../public/tecvid-rehberi.json';

// Sitenin display Kur'an fontu (KFGQPC, §13.15) — atlas/araç sayfalarının
// hepsinde kullanılan "bizim font". Örnekler site verisinden (Türk imlâsı) +
// cleanArabicForDisplay ile alındığından KFGQPC'de tofu'suz render olur.
const QFONT = FONTS.quran;

const LEGEND = [
  ['Gunne', TAJWEED.gunne], ['Kalkale', TAJWEED.kalkale], ['Med', TAJWEED.med],
  ['İdgâm', TAJWEED.idgam], ['İklâb', TAJWEED.iklab], ['İhfâ', TAJWEED.ihfa],
  ['Dudak ihfâsı', TAJWEED.ihfasef], ['Sıla', TAJWEED.sila],
];

const PLAY = 'M8 5v14l11-7z';
const STOP_RECT = true;

export default function TecvidRehberi() {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const navTop = useNavbarOffset(0, 62);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < BREAKPOINT_MOBILE);
    h(); window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  // Shared audio player
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(null); // currently-playing audio url
  const [npLabel, setNpLabel] = useState(null); // {ar, meta}
  useEffect(() => {
    const a = new Audio();
    audioRef.current = a;
    const done = () => { setPlaying(null); };
    a.addEventListener('ended', done);
    a.addEventListener('error', done);
    return () => { a.pause(); a.removeEventListener('ended', done); a.removeEventListener('error', done); };
  }, []);
  function play(url, ar, meta) {
    const a = audioRef.current; if (!a) return;
    if (playing === url) { a.pause(); setPlaying(null); return; }
    a.src = url; setPlaying(url); setNpLabel({ ar, meta });
    a.play().catch(() => setPlaying(null));
  }
  function stop() { const a = audioRef.current; if (a) a.pause(); setPlaying(null); }

  const data = tecvidData;
  const gold = COLORS.gold;

  // ── shared sub-render: play button ──
  const PlayBtn = ({ url, ar, meta, accent }) => {
    const on = playing === url;
    return (
      <button
        type="button"
        onClick={() => play(url, ar, meta)}
        aria-label={isEn ? 'Play' : 'Dinle'}
        style={{
          width: 34, height: 34, borderRadius: RADIUS.full, flexShrink: 0, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0,
          border: `1px solid ${on ? (accent || gold) : COLORS.glassBorderSoft}`,
          background: on ? COLORS.goldAlpha15 : 'transparent',
          color: on ? (accent || gold) : SEMANTIC.textMuted,
          transition: `all ${TRANSITION.fast}`,
        }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          {on ? <rect x="6" y="6" width="12" height="12" rx="2" /> : <path d={PLAY} />}
        </svg>
      </button>
    );
  };

  return (
    <div style={{
      background: COLORS.cosmicBlack,
      minHeight: `calc(100vh - ${navTop}px)`,
      paddingTop: `${navTop}px`,
      display: 'flex', flexDirection: 'column',
    }}>
      <ToolHeader
        icon={<span style={{ fontFamily: FONTS.quran, color: gold, fontSize: '1rem', lineHeight: 1 }}>تج</span>}
        titleTr="Tecvid Rehberi"
        titleEn="Tajweed Guide"
        subtitleTr="Kuralları gör, gerçek kārîden dinle"
        subtitleEn="See the rules, hear a real reciter"
        language={language}
        homeHref={`/${language}/oku`}
        homeLabelTr="Kur'an'ı Oku"
        homeLabelEn="Read Quran"
      />

      <div style={{
        width: '100%', maxWidth: 1120, margin: '0 auto',
        padding: isMobile ? '0 16px 90px' : '0 24px 100px',
      }}>
        {/* ─── HERO ─── */}
        <header style={{ textAlign: 'center', padding: isMobile ? '40px 0 26px' : '56px 0 34px' }}>
          <div style={{ fontSize: '0.72rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: gold, fontWeight: 600, opacity: 0.85 }}>
            {isEn ? 'Tajweed Guide · see it, hear it' : 'Tecvid Rehberi · gör ve dinle'}
          </div>
          <h1 style={{
            fontFamily: FONTS.display, fontWeight: 900, color: SEMANTIC.textPrimary,
            fontSize: 'clamp(1.9rem, 5vw, 3rem)', lineHeight: 1.08, margin: '16px 0 0', textWrap: 'balance',
          }}>
            {isEn ? 'Reading is one thing.\nSeeing the rule is another.' : 'Okumak başka,\nkuralı görmek başka.'}
          </h1>
          <p style={{
            color: SEMANTIC.textMuted, fontSize: 'clamp(1rem, 2.3vw, 1.14rem)',
            maxWidth: '56ch', margin: '16px auto 0', lineHeight: 1.6,
          }}>
            {isEn
              ? 'The Quran encodes how each letter is read as a system of colors. This guide teaches those colors and plays every example in a real reciter’s voice.'
              : 'Kur’an her harfin nasıl okunacağını bir renk sistemine döker. Bu rehber o renkleri öğretir ve her örneği gerçek kārî sesiyle dinletir.'}
          </p>

          {/* hero example */}
          <div style={{
            margin: '30px auto 0', maxWidth: 680,
            background: `linear-gradient(180deg, ${COLORS.goldAlpha15}, transparent 70%), ${SEMANTIC.surfaceRaised}`,
            border: `1px solid ${COLORS.glassBorderSoft}`, borderRadius: RADIUS.lg || 20,
            padding: isMobile ? '22px 16px' : '28px 24px',
          }}>
            <div style={{ fontFamily: QFONT, direction: 'rtl', color: SEMANTIC.scriptureText, fontSize: 'clamp(2rem, 7vw, 2.9rem)', lineHeight: 1.9 }}>
              {data.hero.ar}
            </div>
            <div style={{ fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: gold, opacity: 0.7, marginTop: 10 }}>
              {isEn ? 'Bismillah · al-Fātiḥa 1:1' : 'Besmele · Fâtiha 1:1'}
            </div>
          </div>

          {/* legend */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 8,
            maxWidth: 680, margin: '22px auto 0',
          }}>
            {LEGEND.map(([name, color]) => (
              <div key={name} style={{
                display: 'flex', alignItems: 'center', gap: 9, padding: '9px 12px',
                background: SEMANTIC.surfaceRaised, border: `1px solid ${COLORS.glassBorderSoft}`,
                borderRadius: RADIUS.md, fontSize: '0.82rem', fontWeight: 500, color: SEMANTIC.textPrimary,
              }}>
                <span style={{ width: 12, height: 12, borderRadius: '50%', flexShrink: 0, background: color, boxShadow: `0 0 10px 1px ${color}` }} />
                {name}
              </div>
            ))}
          </div>
        </header>

        {/* ─── FAMILY NAV (sticky) ─── */}
        <nav style={{
          position: 'sticky', top: `${navTop + 48}px`, zIndex: 20,
          display: 'flex', gap: 4, overflowX: 'auto', padding: '10px 0',
          background: COLORS.cosmicBlack, borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
        }}>
          {data.families.map((f, i) => (
            <button key={i} type="button"
              onClick={() => { const el = document.getElementById('fam-' + i); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 7, whiteSpace: 'nowrap', flexShrink: 0,
                padding: '7px 12px', borderRadius: RADIUS.full, cursor: 'pointer',
                border: `1px solid ${COLORS.glassBorderSoft}`, background: 'transparent',
                color: SEMANTIC.textMuted, fontSize: '0.78rem', fontWeight: 500,
                fontFamily: FONTS.body, transition: `all ${TRANSITION.fast}`,
              }}>
              <span style={{ fontFamily: FONTS.quran, fontSize: '1rem', color: f.color }}>{f.glyph}</span>
              {f.tr}
              <span style={{ fontSize: '0.68rem', color: SEMANTIC.textFaint, fontVariantNumeric: 'tabular-nums' }}>{f.rules.length}</span>
            </button>
          ))}
        </nav>

        {/* ─── FAMILIES ─── */}
        {data.families.map((f, i) => (
          <section key={i} id={'fam-' + i} style={{ padding: '40px 0 8px', scrollMarginTop: `${navTop + 100}px` }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 22 }}>
              <div style={{
                fontFamily: FONTS.quran, fontSize: '2.4rem', lineHeight: 1, color: f.color, flexShrink: 0,
                width: 64, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: COLORS.goldAlpha15, border: `1px solid ${COLORS.glassBorderSoft}`, borderRadius: RADIUS.lg || 16,
              }}>{f.glyph}</div>
              <div>
                <div style={{ fontSize: '0.7rem', letterSpacing: '0.2em', color: f.color, fontWeight: 700, opacity: 0.9 }}>
                  {String(i + 1).padStart(2, '0')} · {isEn ? 'FAMILY' : 'AİLE'}
                </div>
                <h2 style={{ fontFamily: FONTS.display, fontWeight: 700, color: SEMANTIC.textPrimary, fontSize: 'clamp(1.4rem, 3.4vw, 1.9rem)', margin: '4px 0 0' }}>{f.tr}</h2>
                <p style={{ color: SEMANTIC.textMuted, fontSize: '0.94rem', margin: '6px 0 0', maxWidth: '62ch' }}>{f.desc}</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))', gap: 16 }}>
              {f.rules.map((r, ri) => (
                <div key={ri} style={{
                  position: 'relative', overflow: 'hidden',
                  background: SEMANTIC.surfaceRaised, border: `1px solid ${COLORS.glassBorderSoft}`,
                  borderRadius: RADIUS.lg || 16, padding: '18px 18px 8px',
                }}>
                  <span style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: 4, background: r.color }} />
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                    <h3 style={{ fontFamily: FONTS.body, fontSize: '1.06rem', fontWeight: 700, color: r.color, margin: 0 }}>{r.tr}</h3>
                    <span style={{ fontFamily: FONTS.quran, fontSize: '1.2rem', color: SEMANTIC.textMuted }}>{r.ar}</span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: SEMANTIC.textFaint, marginTop: 1 }}>{r.short}</div>
                  <p style={{ fontSize: '0.9rem', color: SEMANTIC.textMuted, margin: '9px 0 6px' }}>{r.def}</p>
                  {r.key && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.78rem', color: SEMANTIC.textFaint, marginBottom: 4 }}>
                      <span>{isEn ? 'Letters / cue' : 'Harf / ipucu'}</span>
                      {/[؀-ۿ]/.test(r.key)
                        ? <span style={{ fontFamily: FONTS.quran, direction: 'rtl', fontSize: '1.15rem', color: r.color }}>{r.key}</span>
                        : <span style={{ color: SEMANTIC.textMuted }}>{r.key}</span>}
                    </div>
                  )}
                  <div style={{ marginTop: 6, borderTop: `1px solid ${COLORS.glassBorderSoft}` }}>
                    {r.examples.map((e, ei) => (
                      <div key={ei} style={{
                        display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0',
                        borderBottom: ei < r.examples.length - 1 ? `1px solid ${COLORS.glassBorderSoft}` : 'none',
                      }}>
                        <PlayBtn url={e.audio} ar={e.text} meta={e.verse + ' · ' + e.reciter} accent={r.color} />
                        <div style={{ fontFamily: QFONT, direction: 'rtl', fontSize: '1.65rem', color: SEMANTIC.textPrimary, flex: 1, minWidth: 0, textAlign: 'right' }} dangerouslySetInnerHTML={{ __html: e.html }} />
                        <div style={{ fontSize: '0.72rem', color: SEMANTIC.textFaint, fontVariantNumeric: 'tabular-nums', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{e.verse}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* sources note */}
        <p style={{ color: SEMANTIC.textFaint, fontSize: '0.82rem', maxWidth: '74ch', margin: '30px auto 0', textAlign: 'center', lineHeight: 1.6 }}>
          {isEn
            ? 'Rules and examples from a curated tajweed dataset (9 families · 42 rules · 126 examples). Audio: short verse excerpts by Alafasy, Husary and Minshawy.'
            : 'Kurallar ve örnekler seçili bir tecvid veri setinden (9 aile · 42 kural · 126 örnek). Ses: Alafasy, Husary ve Minshawy’den kısa âyet kesitleri.'}
        </p>

        <div style={{ marginTop: 40 }}>
          <CrossToolCTA
            language={language}
            isMobile={isMobile}
            links={[
              { href: `/${language}/oku`, titleTr: 'Kur’an’ı Oku', titleEn: 'Read the Quran', descTr: 'Tecvid renklerini açıp öğrendiğin kuralları mushafta gör.', descEn: 'Turn on tajweed colors and see these rules in the mushaf.' },
              { href: `/${language}/atlas/kiraat`, titleTr: 'Kıraat Atlası', titleEn: 'Recitation Atlas', descTr: 'On kanonik kıraat, ravileri ve farklılıkları.', descEn: 'The ten canonical recitations, transmitters and variants.' },
            ]}
          />
        </div>
      </div>

      {/* ─── now-playing bar ─── */}
      {playing && npLabel && (
        <div style={{
          position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 60,
          background: 'rgba(8,10,18,0.94)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
          borderTop: `1px solid ${COLORS.glassBorder}`,
        }}>
          <div style={{ maxWidth: 1120, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 14, height: 64, padding: isMobile ? '0 16px' : '0 24px' }}>
            <button type="button" onClick={stop} aria-label={isEn ? 'Stop' : 'Durdur'} style={{
              width: 42, height: 42, borderRadius: RADIUS.full, flexShrink: 0, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${COLORS.gold}`,
              background: COLORS.gold, color: COLORS.cosmicBlack,
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="2" /></svg>
            </button>
            <div style={{ fontFamily: QFONT, direction: 'rtl', fontSize: '1.5rem', color: SEMANTIC.textPrimary, flex: 1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{npLabel.ar}</div>
            <div style={{ fontSize: '0.74rem', color: SEMANTIC.textFaint, whiteSpace: 'nowrap' }}>{npLabel.meta}</div>
          </div>
        </div>
      )}
    </div>
  );
}
