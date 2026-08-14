'use client';

// ─── Yakın Anlamlı Nüanslar (Near-Synonymous Nuances) ─────────────────────
// 10 nüans seti: kalb/fu'âd/sadr, insan/beşer/nâs, ilm/hikmet/fıkh vd.
// Her set: intro + 3-5 terim (root + meaning + verse + usage note) + nuance summary.
//
// Pattern: sticky sol chip strip (10 set) + right full detail
// (Ahiret Yolculuğu tab pattern'ı, ama sıralı değil kategori-bazlı)
// §13.17 ToolHeader + §13.18 hero + §13.19 sticky (mobile).
// ─────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from 'react';
import ToolHeader from './ToolHeader';
import CrossToolCTA from './CrossToolCTA';
import SourcesCitation from './SourcesCitation';
import BookmarkButton from './BookmarkButton';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS, RADIUS, VERSE_BLOCK, TEXT, GLASS_CARD } from '../tokens';

const CATEGORY_COLORS = {
  'iç-dünya':      '#e84a7c',
  'insan-tanımı':  '#3498db',
  'bilgi':         '#c9a96e',
  'duygu':         '#f472b6',
  'ilahi-lütuf':   '#4ade80',
  'yönlenme':      '#a78bfa',
  'ilahi-isim':    '#d4a574',
  'duruş':         '#22d3ee',
  'erdem':         '#fdba74',
  'ahiret':        '#e74c3c',
};

export default function YakinAnlamliNuanslar({ onClose }) {
  const { language } = useLanguage();
  const [data, setData] = useState(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const detailRef = useRef(null);

  useEffect(() => {
    fetch('/yakin-anlamli-nuanslar.json')
      .then(r => r.json())
      .then(setData)
      .catch(err => console.error('yakin-anlamli-nuanslar load failed', err));
  }, []);

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 900);
    h();
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape' && onClose) onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  useEffect(() => {
    if (detailRef.current) detailRef.current.scrollTop = 0;
  }, [activeIdx]);

  const isEn = language === 'en';
  const sets = data?.sets || [];
  const active = sets[activeIdx];

  return (
    <div style={{
      background: COLORS.cosmicBlack,
      minHeight: 'calc(100vh - 62px)',
      display: 'flex', flexDirection: 'column',
      paddingTop: '62px',
    }}>
      <ToolHeader
        icon={<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="12" r="4" /><circle cx="16" cy="12" r="4" /><path d="M8 12h8" /></svg>}
        titleTr="Yakın Anlamlı Nüanslar"
        titleEn="Near-Synonymous Nuances"
        subtitleTr="Eş anlamlı gibi görünen kelimelerin ayırıcı yükleri"
        subtitleEn="Distinctive loads of seemingly synonymous words"
        language={language}
      />

      {!data && (
        <div style={{ padding: '80px 24px', textAlign: 'center', color: COLORS.silver }}>
          {isEn ? 'Loading…' : 'Yükleniyor…'}
        </div>
      )}

      {data && (
        <>
          {/* ─── Hero — §13.18 Premium ─────────────────────────────── */}
          <div style={{
            padding: isMobile ? '32px 16px 24px' : '48px 32px 32px',
            background: `linear-gradient(180deg, ${COLORS.goldAlpha06} 0%, transparent 100%)`,
            borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
            textAlign: 'center',
          }}>
            <div style={{
              fontFamily: "'Amiri Quran', serif",
              color: COLORS.gold, opacity: 0.82,
              fontSize: isMobile ? '1.6rem' : '2rem',
              margin: '0 0 18px', lineHeight: 1,
            }} aria-hidden="true">﷽</div>

            <p dir="rtl" lang="ar" style={{
              fontFamily: FONTS.quran,
              color: COLORS.gold,
              fontSize: 'clamp(1.4rem, 3vw, 1.9rem)',
              lineHeight: 2.1,
              margin: '0 auto 12px', maxWidth: '780px',
            }}>
              وَعَلَّمَ اٰدَمَ الْاَسْمَٓاءَ كُلَّهَا
            </p>
            <p style={{
              fontFamily: FONTS.display, fontStyle: 'italic',
              color: COLORS.offWhiteAlpha78,
              fontSize: isMobile ? '0.95rem' : '1.05rem',
              lineHeight: 1.6, margin: '0 auto 6px', maxWidth: '660px',
            }}>
              {isEn
                ? '"And He taught Adam all the names."'
                : '"Ve Âdem\'e (varlıkların) bütün isimlerini öğretti."'}
            </p>
            <p style={{
              color: COLORS.silver, opacity: 0.65,
              fontSize: '0.68rem', fontWeight: 600,
              letterSpacing: '0.16em', textTransform: 'uppercase',
              margin: '0 0 22px',
            }}>— {isEn ? 'al-Baqara 2:31' : 'Bakara 2:31'}</p>

            <div style={{
              width: '120px', height: '1px', margin: '0 auto 22px',
              background: `linear-gradient(90deg, transparent 0%, ${COLORS.goldAlpha45} 50%, transparent 100%)`,
            }} />

            <p style={{
              color: COLORS.gold, opacity: 0.72,
              fontSize: '0.68rem', fontWeight: 700,
              letterSpacing: '0.24em', textTransform: 'uppercase',
              margin: '0 0 12px',
            }}>
              {isEn ? "NUANCES · WORDS THAT DIFFER" : 'NÜANSLAR · KELİMELER AYRIŞIYOR'}
            </p>
            <h2 style={{
              fontFamily: FONTS.display,
              fontSize: isMobile ? 'clamp(1.6rem, 7vw, 2rem)' : 'clamp(2rem, 3.6vw, 2.7rem)',
              color: COLORS.offWhite,
              margin: '0 0 10px', fontWeight: 700,
            }}>
              {isEn ? data.intro.titleEn : data.intro.titleTr}
            </h2>
            <p style={{
              fontFamily: FONTS.display, fontStyle: 'italic',
              color: COLORS.gold,
              fontSize: isMobile ? '1.05rem' : '1.15rem',
              margin: '0 auto 20px', maxWidth: '680px',
              lineHeight: 1.5,
            }}>
              {isEn ? data.intro.subtitleEn : data.intro.subtitleTr}
            </p>
            <p style={{
              color: COLORS.silver,
              fontSize: isMobile ? '0.92rem' : '1rem',
              lineHeight: 1.7, margin: '0 auto', maxWidth: '740px',
            }}>
              {isEn ? data.intro.descEn : data.intro.descTr}
            </p>

            <div style={{
              display: 'inline-flex', alignItems: 'center',
              gap: isMobile ? '10px' : '18px',
              padding: '8px 18px', marginTop: '22px',
              background: COLORS.goldAlpha04,
              border: `1px solid ${COLORS.goldAlpha15}`,
              borderRadius: RADIUS.pill,
              fontSize: isMobile ? '0.68rem' : '0.72rem',
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: COLORS.silver, fontWeight: 600,
              flexWrap: 'wrap', justifyContent: 'center',
            }}>
              <span><span style={{ color: COLORS.gold, fontWeight: 700 }}>{data.meta.totalSets}</span> {isEn ? 'SETS' : 'SET'}</span>
              <span style={{ opacity: 0.35 }}>·</span>
              <span><span style={{ color: COLORS.gold, fontWeight: 700 }}>{data.meta.totalTerms}</span> {isEn ? 'TERMS' : 'TERİM'}</span>
              <span style={{ opacity: 0.35 }}>·</span>
              <span>{isEn ? 'CLASSICAL + IZUTSU' : 'KLASİK + İZUTSU'}</span>
            </div>
          </div>

          {/* ─── Sticky chip strip (§13.19) — hem mobile hem desktop ─── */}
          <div id="yn-set-bar" style={{
            display: 'flex', gap: '6px',
            padding: isMobile ? '10px 12px' : '12px 24px',
            overflowX: 'auto', scrollbarWidth: 'none',
            borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
            background: 'rgb(6, 8, 14)',
            backgroundColor: 'rgb(6, 8, 14)',
            isolation: 'isolate',
            position: 'sticky', top: '110px', zIndex: 20,
            scrollMarginTop: '120px',
            flexShrink: 0,
          }}>
            {sets.map((s, i) => {
              const color = CATEGORY_COLORS[s.category] || COLORS.gold;
              const isActive = activeIdx === i;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    setActiveIdx(i);
                    setTimeout(() => document.getElementById('yn-set-bar')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
                  }}
                  style={{
                    flexShrink: 0,
                    padding: isMobile ? '8px 12px' : '10px 16px',
                    fontSize: isMobile ? '0.7rem' : '0.76rem',
                    letterSpacing: '0.06em',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? color : COLORS.silver,
                    background: isActive ? `${color}20` : 'transparent',
                    border: `1px solid ${isActive ? `${color}66` : COLORS.glassBorderSoft}`,
                    borderRadius: RADIUS.pill,
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                  }}
                >
                  <span style={{
                    width: '6px', height: '6px', borderRadius: '50%',
                    background: color, opacity: isActive ? 1 : 0.5,
                    boxShadow: isActive ? `0 0 6px ${color}` : 'none',
                  }} />
                  <span>{isEn ? (s.titleEn.split(' — ')[0]) : (s.titleTr.split(' — ')[0])}</span>
                </button>
              );
            })}
          </div>

          {/* ─── Detail panel ────────────────────────────────────── */}
          <main ref={detailRef} style={{
            flex: 1,
            padding: isMobile ? '20px 16px 40px' : '32px 40px 60px',
            maxWidth: '1080px', width: '100%',
            margin: '0 auto',
            minHeight: 0,
          }}>
            {active && <SetDetail nset={active} isEn={isEn} isMobile={isMobile} />}
          </main>

          {/* SourcesCitation */}
          {data.sources?.length > 0 && (
            <SourcesCitation
              language={language}
              isMobile={isMobile}
              sources={data.sources}
            />
          )}

          {/* CrossToolCTA */}
          <CrossToolCTA
            language={language}
            isMobile={isMobile}
            links={[
              { href: `/${language}/graf/kavram`, titleTr: 'Kavram Ağı', titleEn: 'Concept Network', descTr: '100+ Kur\'ânî kavramın birbirine bağlandığı ağ.', descEn: 'The network of 100+ Quranic concepts.' },
              { href: `/${language}/atlas/furuk`, titleTr: 'Fürûk Atlası', titleEn: 'Furūq Atlas', descTr: 'Yakın anlamlı kelimeler — klasik fürûk geleneği.', descEn: 'Near-synonymous words — the classical furūq tradition.' },
              { href: `/${language}/atlas/insan-yolculugu`, titleTr: 'İnsan Yolculuğu', titleEn: 'The Human Journey', descTr: "Fıtrattan Cemâlullah'a — kavramların hayattaki karşılığı.", descEn: 'From Fiṭra to Jamāl Allāh — the concepts embodied in life.' },
            ]}
          />
        </>
      )}
    </div>
  );
}

// ── Set Detail Panel ────────────────────────────────────────────────
function SetDetail({ nset, isEn, isMobile }) {
  const color = CATEGORY_COLORS[nset.category] || COLORS.gold;

  return (
    <article>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '18px' }}>
        <div style={{ flex: 1 }}>
          <p style={{
            color: color, opacity: 0.75,
            fontSize: '0.65rem', fontWeight: 700,
            letterSpacing: '0.24em', textTransform: 'uppercase',
            margin: 0,
          }}>
            {nset.category?.toUpperCase()}
          </p>
          <h2 style={{
            fontFamily: FONTS.display,
            fontSize: isMobile ? '1.4rem' : '1.7rem',
            color: COLORS.offWhite,
            margin: '6px 0 0', fontWeight: 700,
            letterSpacing: '-0.01em',
            lineHeight: 1.25,
          }}>
            {isEn ? nset.titleEn : nset.titleTr}
          </h2>
        </div>
        <BookmarkButton
          item={{
            type: 'nuance-set',
            id: `yakin-anlamli:${nset.id}`,
            titleTr: nset.titleTr,
            titleEn: nset.titleEn,
            href: `/${isEn ? 'en' : 'tr'}/arac/yakin-anlamli-nuanslar`,
          }}
        />
      </div>

      {/* Intro */}
      <p style={{
        color: COLORS.offWhiteAlpha78,
        fontSize: isMobile ? '0.98rem' : '1.04rem',
        lineHeight: 1.75,
        margin: '0 0 32px',
        fontStyle: 'italic',
      }}>
        {isEn ? nset.introEn : nset.introTr}
      </p>

      {/* Terms — vertical stack */}
      <div style={{ display: 'grid', gap: '18px', marginBottom: '32px' }}>
        {nset.terms.map((t, i) => (
          <div key={i} style={{
            ...GLASS_CARD,
            padding: isMobile ? '18px' : '22px',
            borderLeft: `3px solid ${color}`,
          }}>
            {/* Term header — Arabic + transliteration + root */}
            <div style={{
              display: 'flex', alignItems: 'baseline',
              justifyContent: 'space-between', gap: '12px',
              flexWrap: 'wrap',
              marginBottom: '14px',
            }}>
              <div>
                <p dir="rtl" lang="ar" style={{
                  fontFamily: FONTS.quran,
                  color: color,
                  fontSize: isMobile ? '1.5rem' : '1.75rem',
                  margin: '0 0 4px', lineHeight: 1.2,
                }}>{t.termAr}</p>
                <p style={{
                  fontFamily: FONTS.display,
                  color: COLORS.offWhite,
                  fontSize: '1.05rem', fontWeight: 700,
                  margin: 0,
                  letterSpacing: '0.02em',
                }}>{isEn ? t.termEn : t.termTr}</p>
              </div>
              <p style={{
                color: COLORS.silver, opacity: 0.65,
                fontSize: '0.72rem',
                letterSpacing: '0.06em',
                fontFamily: FONTS.body,
                fontStyle: 'italic',
                margin: 0,
              }}>
                {isEn ? t.rootEn : t.rootTr}
              </p>
            </div>

            {/* Meaning */}
            <p style={{
              color: COLORS.offWhite,
              fontSize: '0.94rem',
              lineHeight: 1.7,
              margin: '0 0 14px',
            }}>
              {isEn ? t.meaningEn : t.meaningTr}
            </p>

            {/* Verse */}
            {t.verse && (
              <div style={{ ...VERSE_BLOCK, marginTop: '12px' }}>
                <p dir="rtl" lang="ar" style={{ ...TEXT.verseArabic, margin: '0 0 8px' }}>
                  {t.verse.arabic}
                </p>
                <p style={{ fontSize: '0.82rem', color: COLORS.offWhite, fontStyle: 'italic', lineHeight: 1.65 }}>
                  {isEn ? t.verse.english : t.verse.turkish}
                </p>
                <p style={{ ...TEXT.verseRef, margin: '6px 0 0' }}>— {t.verse.verseRef}</p>
              </div>
            )}

            {/* Usage note */}
            {(t.usageNoteTr || t.usageNoteEn) && (
              <p style={{
                color: COLORS.silver,
                fontSize: '0.85rem',
                lineHeight: 1.7,
                margin: '14px 0 0',
                paddingTop: '12px',
                borderTop: `1px solid ${COLORS.glassBorderSoft}`,
                fontStyle: 'italic',
              }}>
                <span style={{
                  color: color, opacity: 0.8,
                  fontSize: '0.62rem', fontWeight: 700,
                  letterSpacing: '0.2em', textTransform: 'uppercase',
                  marginRight: '8px',
                }}>{isEn ? 'USAGE' : 'KULLANIM'}</span>
                {isEn ? t.usageNoteEn : t.usageNoteTr}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Nuance summary — callout */}
      <div style={{
        padding: isMobile ? '18px' : '22px 26px',
        background: `linear-gradient(135deg, ${color}12 0%, ${color}04 100%)`,
        border: `1px solid ${color}33`,
        borderRadius: RADIUS.md,
        borderLeft: `3px solid ${color}`,
      }}>
        <p style={{
          color: color, opacity: 0.85,
          fontSize: '0.65rem', fontWeight: 700,
          letterSpacing: '0.24em', textTransform: 'uppercase',
          margin: '0 0 10px',
        }}>{isEn ? 'THE NUANCE' : 'NÜANS'}</p>
        <p style={{
          fontFamily: FONTS.display, fontStyle: 'italic',
          color: COLORS.offWhite,
          fontSize: isMobile ? '0.98rem' : '1.08rem',
          lineHeight: 1.7,
          margin: 0,
        }}>
          {isEn ? nset.nuanceEn : nset.nuanceTr}
        </p>
      </div>

      {/* Source citation */}
      {(nset.sourceTr || nset.sourceEn) && (
        <p style={{
          color: COLORS.silver, opacity: 0.55,
          fontSize: '0.75rem',
          lineHeight: 1.6,
          margin: '24px 0 0',
          fontStyle: 'italic',
        }}>
          <span style={{ opacity: 0.8, fontWeight: 600 }}>{isEn ? 'Source: ' : 'Kaynak: '}</span>
          {isEn ? nset.sourceEn : nset.sourceTr}
        </p>
      )}
    </article>
  );
}
