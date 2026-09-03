'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS, GLASS_CARD, RADIUS, CATEGORY_SCALE, BREAKPOINT_MOBILE } from '../tokens';
import ToolHeader from './ToolHeader';
import HeroGeometricBackground from './HeroGeometricBackground';
import useNavbarOffset from './useNavbarOffset';
import CrossToolCTA from './CrossToolCTA';
import { cleanArabicForDisplay as cleanArabic } from '../lib/arabic';
import fatihaDataStatic from '../../public/fatiha-atlasi.json';

// ── Reveal — scroll-triggered fade-up, IntersectionObserver via framer-motion ──
function Reveal({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ── Cinematic Hero (§13.18) ───────────────────────────────────────────────────
function Hero({ language, isMobile }) {
  const tr = language === 'tr';
  return (
    <div style={{
      position: 'relative', overflow: 'hidden',
      padding: isMobile ? '40px 16px 28px' : '64px 32px 44px',
      background: 'linear-gradient(180deg, rgba(212,165,116,0.08) 0%, transparent 100%)',
      borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
      textAlign: 'center',
    }}>
      <HeroGeometricBackground />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div aria-hidden="true" className="mq-fs" style={{
          fontFamily: FONTS.bismillah, '--fs-d': '2.6rem', '--fs-m': '2.1rem',
          color: COLORS.gold, opacity: 0.85, marginBottom: '26px', lineHeight: 1.2,
        }}>﷽</div>

        <p dir="rtl" lang="ar" className="mq-fs" style={{
          fontFamily: FONTS.quran, color: COLORS.gold,
          '--fs-d': 'clamp(1.7rem, 3vw, 2.15rem)', '--fs-m': '1.5rem',
          lineHeight: 2.15, margin: '0 0 16px',
        }}>
          {cleanArabic('اِيَّاكَ نَعْبُدُ وَاِيَّاكَ نَسْتَع۪ينُ')}
        </p>
        <p className="mq-fs" style={{
          fontFamily: FONTS.display, fontStyle: 'italic', color: COLORS.offWhite,
          '--fs-d': '1.1rem', '--fs-m': '1rem', lineHeight: 1.6,
          maxWidth: '660px', margin: '0 auto 8px',
        }}>
          {tr
            ? '"Yalnız Sana kulluk eder, yalnız Senden yardım dileriz."'
            : '"You alone we worship, and You alone we ask for help."'}
        </p>
        <p style={{
          fontFamily: FONTS.body, color: COLORS.silver, opacity: 0.7,
          fontSize: '0.72rem', letterSpacing: '0.16em', textTransform: 'uppercase',
          margin: '0 0 26px',
        }}>— {tr ? 'Fâtiha 1:5' : 'Al-Fātiḥa 1:5'}</p>

        <p className="mq-fs" style={{
          fontFamily: FONTS.display, fontStyle: 'italic', color: COLORS.silver,
          '--fs-d': '1.05rem', '--fs-m': '0.95rem', lineHeight: 1.8,
          maxWidth: '720px', margin: '0 auto 26px',
        }}>
          {tr
            ? <>Yedi âyet, iki yarım, tek bir eksen. Fâtiha&apos;nın her kelimesi <em style={{ color: COLORS.gold, fontStyle: 'italic' }}>tartılarak</em> seçilmiş — ve on asırlık bir tefsir geleneği hâlâ onun katmanlarını <em style={{ color: COLORS.gold, fontStyle: 'italic' }}>açmaya</em> devam ediyor.</>
            : <>Seven verses, two halves, one axis. Every word of the Fātiḥa was <em style={{ color: COLORS.gold, fontStyle: 'italic' }}>weighed</em> in its choosing — and ten centuries of exegesis are still <em style={{ color: COLORS.gold, fontStyle: 'italic' }}>unfolding</em> its layers.</>}
        </p>

        <div style={{ width: '120px', height: '1px', margin: '0 auto 26px', background: `linear-gradient(90deg, transparent, ${COLORS.gold}aa, transparent)` }} />

        <p style={{
          color: COLORS.gold, fontSize: '0.72rem', letterSpacing: '0.3em',
          textTransform: 'uppercase', opacity: 0.75, fontWeight: 700, margin: '0 0 14px',
        }}>{tr ? "ÜMMÜ'L-KİTÂB · KUR'ÂN'IN ÖZÜ" : "UMM AL-KITĀB · THE ESSENCE OF THE SCRIPTURE"}</p>
        <h1 className="mq-fs" style={{
          fontFamily: FONTS.display, color: COLORS.offWhite, fontWeight: 700,
          '--fs-d': 'clamp(2.4rem, 4.2vw, 3.4rem)', '--fs-m': 'clamp(1.9rem, 8vw, 2.4rem)',
          lineHeight: 1.15, margin: '0 0 12px', letterSpacing: '0.01em',
        }}>{tr ? 'Fâtiha Atlası' : 'Atlas of the Opening'}</h1>
        <p className="mq-fs" style={{
          fontFamily: FONTS.display, fontStyle: 'italic', color: COLORS.gold,
          '--fs-d': 'clamp(1.1rem, 1.9vw, 1.25rem)', '--fs-m': 'clamp(1.05rem, 4.2vw, 1.15rem)',
          margin: 0,
        }}>{tr ? 'Klasikten çağdaşa — tek sûrenin yedi katmanı' : 'From classical to contemporary — seven layers of a single surah'}</p>
      </div>
    </div>
  );
}

// ── Stat strip ────────────────────────────────────────────────────────────────
function StatStrip({ data, language }) {
  const tr = language === 'tr';
  const stats = [
    { num: 7, labelTr: 'Âyet', labelEn: 'Verses' },
    { num: data.wordChoice.groups.length, labelTr: 'Kelime Ailesi', labelEn: 'Word Families' },
    { num: data.grammar.cases.length, labelTr: 'Gramer İnceliği', labelEn: 'Grammar Points' },
    { num: data.bakaraAnchors.anchors.length, labelTr: "Bakara Çapası", labelEn: 'Anchors in Al-Baqara' },
    { num: data.scholars.length, labelTr: 'Kaynak', labelEn: 'Sources' },
  ];
  return (
    <div style={{ display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none', padding: '18px 16px', justifyContent: 'center', flexWrap: 'wrap' }}>
      {stats.map((s, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '8px 16px', borderRadius: 20, flexShrink: 0,
          background: 'rgba(255,255,255,0.04)',
          border: `1px solid ${COLORS.glassBgStrong}`,
        }}>
          <span style={{ fontSize: '1.15rem', fontWeight: 800, color: COLORS.gold, fontFamily: FONTS.body, lineHeight: 1 }}>{s.num}</span>
          <span style={{ fontSize: '0.72rem', color: COLORS.silver, fontFamily: FONTS.body, fontWeight: 600, whiteSpace: 'nowrap' }}>
            {tr ? s.labelTr : s.labelEn}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Perspective card — reused across word choice / grammar / identity notes ───
function PerspectiveCard({ p, accent, language, isMobile }) {
  const tr = language === 'tr';
  const scholarLabel = (!tr && p.scholarEn) ? p.scholarEn : p.scholar;
  const initial = (scholarLabel || '?').replace(/[İI]/g, 'I').charAt(0).toUpperCase();
  return (
    <div style={{
      display: 'flex', gap: isMobile ? 12 : 18,
      padding: isMobile ? '16px' : '20px 24px',
      background: `linear-gradient(135deg, ${accent}0D 0%, rgba(255,255,255,0.02) 100%)`,
      border: `1px solid ${accent}30`,
      borderRadius: 14,
      marginBottom: 14,
      transition: 'transform 0.2s ease, border-color 0.2s ease',
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = `${accent}60`; }}
    onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = `${accent}30`; }}
    >
      <span className="mq-fs" style={{
        flexShrink: 0, width: isMobile ? 34 : 42, height: isMobile ? 34 : 42, borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: FONTS.display, fontWeight: 800, '--fs-d': '1.1rem', '--fs-m': '0.95rem',
        color: accent, background: `${accent}1c`, border: `1.5px solid ${accent}50`,
      }}>{initial}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
          <span className="mq-fs" style={{ color: accent, '--fs-d': '1.08rem', '--fs-m': '1rem', fontFamily: FONTS.display, fontWeight: 700 }}>{scholarLabel}</span>
          {p.scholarSub && (
            <span style={{ color: COLORS.silver, fontSize: '0.74rem', fontFamily: FONTS.body, fontStyle: 'italic', opacity: 0.8 }}>{p.scholarSub}</span>
          )}
        </div>
        <p className="mq-fs" style={{ color: COLORS.silver, '--fs-d': '0.89rem', '--fs-m': '0.85rem', lineHeight: 1.8, fontFamily: FONTS.body, margin: p.points?.length ? '0 0 14px' : '0 0 10px' }}>
          {tr ? p.viewTr : p.viewEn}
        </p>
        {p.points?.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
            {p.points.map((pt, pi) => (
              <div key={pi} style={{ display: 'flex', gap: 10, padding: isMobile ? '10px 12px' : '12px 14px', background: 'rgba(255,255,255,0.03)', border: `1px solid ${accent}22`, borderRadius: 10 }}>
                <span style={{ flexShrink: 0, width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.62rem', fontWeight: 800, color: accent, background: `${accent}1c`, marginTop: 1 }}>{pi + 1}</span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ color: accent, fontSize: '0.78rem', fontWeight: 700, fontFamily: FONTS.body, marginBottom: 4 }}>
                    {tr ? pt.labelTr : pt.labelEn}
                  </div>
                  <p className="mq-fs" style={{ color: COLORS.silver, '--fs-d': '0.86rem', '--fs-m': '0.82rem', lineHeight: 1.75, fontFamily: FONTS.body, margin: 0 }}>
                    {tr ? pt.bodyTr : pt.bodyEn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        <p style={{
          color: `${accent}95`, fontSize: '0.7rem', fontFamily: FONTS.body, margin: 0, lineHeight: 1.5,
          borderTop: `1px dashed ${accent}30`, paddingTop: 8,
        }}>
          {p.citation}
        </p>
      </div>
    </div>
  );
}

// ── Tab 0: Besmele ────────────────────────────────────────────────────────────
function TabBesmele({ data, language, isMobile }) {
  const tr = language === 'tr';
  const bs = data.besmele;
  if (!bs) return null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 720, margin: '0 auto' }}>
      <Reveal>
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <p dir="rtl" className="mq-fs" style={{ fontFamily: FONTS.quran, '--fs-d': '1.9rem', '--fs-m': '1.5rem', color: COLORS.gold, margin: '0 0 10px', lineHeight: 2 }}>{cleanArabic(bs.ar)}</p>
          <p className="mq-fs" style={{ color: COLORS.silver, '--fs-d': '0.95rem', '--fs-m': '0.88rem', lineHeight: 1.8, fontFamily: FONTS.body, margin: 0 }}>
            {tr ? bs.introTr : bs.introEn}
          </p>
        </div>
      </Reveal>

      {bs.facts && (
        <Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12 }}>
            {bs.facts.map((f, i) => {
              const accent = CATEGORY_SCALE[i % CATEGORY_SCALE.length];
              return (
                <div key={i} style={{ padding: '16px 18px', background: `${accent}0A`, border: `1px solid ${accent}30`, borderRadius: 12 }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: accent, marginBottom: 8 }}>
                    {tr ? f.labelTr : f.labelEn}
                  </div>
                  <p style={{ color: COLORS.silver, fontSize: '0.82rem', lineHeight: 1.7, fontFamily: FONTS.body, margin: 0 }}>
                    {tr ? f.bodyTr : f.bodyEn}
                  </p>
                </div>
              );
            })}
          </div>
        </Reveal>
      )}

      {bs.perspectives.map((p, i) => (
        <Reveal key={i} delay={i * 0.05}>
          <PerspectiveCard p={p} accent={CATEGORY_SCALE[i % CATEGORY_SCALE.length]} language={language} isMobile={isMobile} />
        </Reveal>
      ))}
    </div>
  );
}

// ── Ring structure helpers (module scope — must not be redeclared per render) ──
function NodeRow({ n, accent, tr, isMobile }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: isMobile ? '12px 14px' : '14px 20px',
    }}>
      <span style={{
        flexShrink: 0, width: 30, height: 30, borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.7rem', fontWeight: 800, color: accent,
        background: `${accent}1c`, border: `1px solid ${accent}45`,
      }}>{n.pos}</span>
      <p dir="rtl" className="mq-fs" style={{ fontFamily: FONTS.quran, '--fs-d': '1.2rem', '--fs-m': '1.05rem', color: accent, margin: 0, lineHeight: 1.7, flexShrink: 0 }}>{cleanArabic(n.ar)}</p>
      <div style={{ flex: 1, minWidth: 0, textAlign: isMobile ? 'right' : 'left' }}>
        <p className="mq-fs" style={{ color: COLORS.offWhite, '--fs-d': '0.8rem', '--fs-m': '0.74rem', fontFamily: FONTS.body, fontWeight: 600, margin: 0 }}>{tr ? n.labelTr : n.labelEn}</p>
        <p style={{ color: COLORS.silver, fontSize: '0.66rem', fontFamily: FONTS.body, opacity: 0.65, margin: 0 }}>{n.ref}</p>
      </div>
    </div>
  );
}

// A half = [outer, inner1, inner2, outer'] → concentric nesting: outer box
// holds first+last node text as its own "frame," inner box holds the middle pair.
function HalfBox({ half, accent, labelTr, labelEn, tr, isMobile }) {
  const [outerA, innerB, innerBp, outerAp] = half;
  return (
    <div style={{
      border: `1.5px solid ${accent}40`, borderRadius: 18,
      background: `${accent}08`, overflow: 'hidden',
    }}>
      <div style={{ padding: isMobile ? '10px 14px' : '10px 20px', borderBottom: `1px solid ${accent}25`, fontSize: '0.64rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: accent }}>
        {tr ? labelTr : labelEn}
      </div>
      <div style={{ borderBottom: `1px dashed ${accent}25` }}><NodeRow n={outerA} accent={accent} tr={tr} isMobile={isMobile} /></div>
      <div style={{ margin: isMobile ? '10px' : '10px 24px', border: `1px dashed ${accent}35`, borderRadius: 12, background: `${accent}0A` }}>
        <div style={{ borderBottom: `1px dashed ${accent}25` }}><NodeRow n={innerB} accent={accent} tr={tr} isMobile={isMobile} /></div>
        <NodeRow n={innerBp} accent={accent} tr={tr} isMobile={isMobile} />
      </div>
      <div style={{ borderTop: `1px dashed ${accent}25` }}><NodeRow n={outerAp} accent={accent} tr={tr} isMobile={isMobile} /></div>
    </div>
  );
}

// ── Tab 1: Ring Structure ──────────────────────────────────────────────────────
// Nested-box chiasm: each half's OUTER pair (A/A', D/D') frames an INNER pair
// (B/B', E/E') — concentric borders make the mirror structure visible without
// needing measured SVG curves.
function TabRing({ data, language, isMobile }) {
  const tr = language === 'tr';
  const rs = data.ringStructure;
  const firstHalf = rs.nodes.filter(n => n.half === 1);
  const center = rs.nodes.filter(n => n.center);
  const secondHalf = rs.nodes.filter(n => n.half === 2);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28, maxWidth: 720, margin: '0 auto' }}>
      <Reveal>
        <div>
          <p className="mq-fs" style={{ color: COLORS.silver, '--fs-d': '0.95rem', '--fs-m': '0.88rem', lineHeight: 1.8, fontFamily: FONTS.body, marginBottom: 6 }}>
            {tr ? rs.introTr : rs.introEn}
          </p>
          <p style={{ color: `${COLORS.gold}90`, fontSize: '0.74rem', fontFamily: FONTS.body, lineHeight: 1.5 }}>
            {tr ? rs.citationTr : rs.citationEn}
          </p>
        </div>
      </Reveal>

      <Reveal>
        <HalfBox half={firstHalf} accent={CATEGORY_SCALE[0]} labelTr={rs.firstHalfLabelTr} labelEn={rs.firstHalfLabelEn} tr={tr} isMobile={isMobile} />
      </Reveal>

      {/* Center hub — connecting stem top & bottom */}
      <Reveal>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: 2, height: 20, background: `linear-gradient(180deg, ${CATEGORY_SCALE[0]}60, ${COLORS.gold}60)` }} />
          <div style={{ position: 'relative', padding: isMobile ? '22px 18px' : '26px 36px', background: `${COLORS.gold}14`, border: `1.5px solid ${COLORS.gold}55`, borderRadius: 20, textAlign: 'center', boxShadow: `0 0 40px -12px ${COLORS.gold}80`, width: '100%' }}>
            <div style={{ fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: COLORS.gold, marginBottom: 14 }}>
              {tr ? 'Merkez — Eksen' : 'Center — the Axis'}
            </div>
            <div style={{ display: 'flex', gap: isMobile ? 12 : 24, justifyContent: 'center', flexWrap: 'wrap' }}>
              {center.map(n => (
                <div key={n.pos}>
                  <p dir="rtl" className="mq-fs" style={{ fontFamily: FONTS.quran, '--fs-d': '1.6rem', '--fs-m': '1.35rem', color: COLORS.gold, margin: '0 0 6px' }}>{cleanArabic(n.ar)}</p>
                  <p style={{ color: COLORS.offWhite, fontSize: '0.82rem', fontFamily: FONTS.body, fontStyle: 'italic', margin: 0 }}>{tr ? n.labelTr : n.labelEn}</p>
                </div>
              ))}
            </div>
            <p className="mq-fs" style={{ color: COLORS.silver, '--fs-d': '0.88rem', '--fs-m': '0.84rem', lineHeight: 1.75, fontFamily: FONTS.body, margin: '18px 0 0' }}>
              {tr ? rs.centerNoteTr : rs.centerNoteEn}
            </p>
          </div>
          <div style={{ width: 2, height: 20, background: `linear-gradient(180deg, ${COLORS.gold}60, ${CATEGORY_SCALE[1]}60)` }} />
        </div>
      </Reveal>

      <Reveal>
        <HalfBox half={secondHalf} accent={CATEGORY_SCALE[1]} labelTr={rs.secondHalfLabelTr} labelEn={rs.secondHalfLabelEn} tr={tr} isMobile={isMobile} />
      </Reveal>

      {/* Identity note (mağdûbi aleyhim / dâllîn) */}
      {rs.identityNote && (
        <Reveal>
          <div>
            <h3 className="mq-fs" style={{ color: COLORS.offWhite, fontFamily: FONTS.display, '--fs-d': '1.2rem', '--fs-m': '1.05rem', fontWeight: 700, margin: '0 0 12px' }}>
              {tr ? rs.identityNote.titleTr : rs.identityNote.titleEn}
            </h3>
            {rs.identityNote.perspectives.map((p, i) => (
              <PerspectiveCard key={i} p={p} accent={CATEGORY_SCALE[2]} language={language} isMobile={isMobile} />
            ))}
          </div>
        </Reveal>
      )}

      {/* Umm al-Kitab */}
      <Reveal>
        <div style={{ padding: isMobile ? '18px' : '24px 28px', background: 'rgba(212,165,116,0.05)', border: `1px solid ${COLORS.goldAlpha25}`, borderRadius: 14 }}>
          <h3 className="mq-fs" style={{ color: COLORS.gold, fontFamily: FONTS.display, '--fs-d': '1.2rem', '--fs-m': '1.05rem', fontWeight: 700, margin: '0 0 10px' }}>
            {tr ? rs.ummulKitab.titleTr : rs.ummulKitab.titleEn}
          </h3>
          <p className="mq-fs" style={{ color: COLORS.silver, '--fs-d': '0.9rem', '--fs-m': '0.86rem', lineHeight: 1.8, fontFamily: FONTS.body, margin: '0 0 10px' }}>
            {tr ? rs.ummulKitab.bodyTr : rs.ummulKitab.bodyEn}
          </p>
          <p style={{ color: `${COLORS.gold}90`, fontSize: '0.72rem', fontFamily: FONTS.body, margin: 0 }}>
            {tr ? rs.ummulKitab.citationTr : rs.ummulKitab.citationEn}
          </p>
        </div>
      </Reveal>

      {/* Konevi sufi reading */}
      <Reveal>
        <div style={{ padding: isMobile ? '18px' : '24px 28px', background: `${CATEGORY_SCALE[3]}0A`, border: `1px solid ${CATEGORY_SCALE[3]}35`, borderRadius: 14 }}>
          <h3 className="mq-fs" style={{ color: CATEGORY_SCALE[3], fontFamily: FONTS.display, '--fs-d': '1.2rem', '--fs-m': '1.05rem', fontWeight: 700, margin: '0 0 10px' }}>
            {tr ? rs.konevi.titleTr : rs.konevi.titleEn}
          </h3>
          <p className="mq-fs" style={{ color: COLORS.silver, '--fs-d': '0.9rem', '--fs-m': '0.86rem', lineHeight: 1.8, fontFamily: FONTS.body, margin: '0 0 10px' }}>
            {tr ? rs.konevi.bodyTr : rs.konevi.bodyEn}
          </p>
          <p style={{ color: `${CATEGORY_SCALE[3]}90`, fontSize: '0.72rem', fontFamily: FONTS.body, margin: 0 }}>
            {tr ? rs.konevi.citationTr : rs.konevi.citationEn}
          </p>
        </div>
      </Reveal>

      {/* Somuncu Baba's seven readings */}
      {data.sevenReadings && (
        <Reveal>
          <div style={{ padding: isMobile ? '18px' : '24px 28px', background: `${CATEGORY_SCALE[4]}0A`, border: `1px solid ${CATEGORY_SCALE[4]}35`, borderRadius: 14 }}>
            <h3 className="mq-fs" style={{ color: CATEGORY_SCALE[4], fontFamily: FONTS.display, '--fs-d': '1.2rem', '--fs-m': '1.05rem', fontWeight: 700, margin: '0 0 10px' }}>
              {tr ? data.sevenReadings.titleTr : data.sevenReadings.titleEn}
            </h3>
            {(data.sevenReadings.contextTr || data.sevenReadings.contextEn) && (
              <p className="mq-fs" style={{ color: COLORS.silver, '--fs-d': '0.88rem', '--fs-m': '0.84rem', lineHeight: 1.8, fontFamily: FONTS.body, margin: '0 0 12px', opacity: 0.9 }}>
                {tr ? data.sevenReadings.contextTr : data.sevenReadings.contextEn}
              </p>
            )}
            <p className="mq-fs" style={{ color: COLORS.silver, '--fs-d': '0.9rem', '--fs-m': '0.86rem', lineHeight: 1.8, fontFamily: FONTS.body, fontStyle: 'italic', margin: '0 0 10px' }}>
              {tr ? data.sevenReadings.bodyTr : data.sevenReadings.bodyEn}
            </p>
            <p style={{ color: `${CATEGORY_SCALE[4]}90`, fontSize: '0.72rem', fontFamily: FONTS.body, margin: 0 }}>
              {tr ? data.sevenReadings.citationTr : data.sevenReadings.citationEn}
            </p>
          </div>
        </Reveal>
      )}
    </div>
  );
}

// ── Tab 1: Word Choice ──────────────────────────────────────────────────────────
function TabWordChoice({ data, language, isMobile }) {
  const tr = language === 'tr';
  const wc = data.wordChoice;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, maxWidth: 880, margin: '0 auto' }}>
      <p className="mq-fs" style={{ color: COLORS.silver, '--fs-d': '0.95rem', '--fs-m': '0.88rem', lineHeight: 1.8, fontFamily: FONTS.body }}>
        {tr ? wc.introTr : wc.introEn}
      </p>
      {wc.groups.map((g, gi) => {
        const accent = CATEGORY_SCALE[gi % CATEGORY_SCALE.length];
        return (
          <div key={g.id} style={{ ...GLASS_CARD, padding: isMobile ? '18px' : '26px', borderTop: `2px solid ${accent}` }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 6, flexWrap: 'wrap' }}>
              <h3 className="mq-fs" style={{ color: COLORS.offWhite, fontFamily: FONTS.display, '--fs-d': '1.35rem', '--fs-m': '1.15rem', fontWeight: 700, margin: 0 }}>
                {tr ? g.titleTr : g.titleEn}
              </h3>
              <span style={{ color: accent, fontSize: '0.72rem', fontFamily: FONTS.body, fontWeight: 700 }}>{g.ref}</span>
            </div>
            <p dir="rtl" className="mq-fs" style={{ fontFamily: FONTS.quran, '--fs-d': '1.5rem', '--fs-m': '1.3rem', color: accent, margin: '8px 0 18px', lineHeight: 2 }}>{cleanArabic(g.ar)}</p>
            {g.perspectives.map((p, i) => <PerspectiveCard key={i} p={p} accent={accent} language={language} isMobile={isMobile} />)}
            {g.examples && (
              <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ fontSize: '0.64rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: accent, opacity: 0.85, marginBottom: 2 }}>
                  {tr ? 'Somut Örnekler' : 'Worked Examples'}
                </div>
                {g.examples.map((ex, ei) => (
                  <div key={ei} style={{ padding: '10px 14px', background: `${accent}0A`, border: `1px solid ${accent}25`, borderRadius: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                      <span style={{ color: COLORS.offWhite, fontSize: '0.8rem', fontFamily: FONTS.body, fontWeight: 700 }}>{tr ? ex.labelTr : ex.labelEn}</span>
                      {ex.ref && <span style={{ color: accent, fontSize: '0.68rem', fontFamily: FONTS.body, fontWeight: 600 }}>{ex.ref}</span>}
                    </div>
                    <p style={{ color: COLORS.silver, fontSize: '0.8rem', lineHeight: 1.65, fontFamily: FONTS.body, margin: 0 }}>{tr ? ex.noteTr : ex.noteEn}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Tab 3: Grammar ──────────────────────────────────────────────────────────────
function TabGrammar({ data, language, isMobile }) {
  const tr = language === 'tr';
  const gr = data.grammar;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, maxWidth: 880, margin: '0 auto' }}>
      <p className="mq-fs" style={{ color: COLORS.silver, '--fs-d': '0.95rem', '--fs-m': '0.88rem', lineHeight: 1.8, fontFamily: FONTS.body }}>
        {tr ? gr.introTr : gr.introEn}
      </p>
      {gr.cases.map((c, ci) => {
        const accent = CATEGORY_SCALE[(ci + 2) % CATEGORY_SCALE.length];
        return (
          <div key={c.id} style={{ ...GLASS_CARD, padding: isMobile ? '18px' : '26px', borderTop: `2px solid ${accent}` }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 6, flexWrap: 'wrap' }}>
              <h3 className="mq-fs" style={{ color: COLORS.offWhite, fontFamily: FONTS.display, '--fs-d': '1.35rem', '--fs-m': '1.15rem', fontWeight: 700, margin: 0 }}>
                {tr ? c.titleTr : c.titleEn}
              </h3>
              <span style={{ color: accent, fontSize: '0.72rem', fontFamily: FONTS.body, fontWeight: 700 }}>{c.ref}</span>
            </div>
            <p dir="rtl" className="mq-fs" style={{ fontFamily: FONTS.quran, '--fs-d': '1.5rem', '--fs-m': '1.3rem', color: accent, margin: '8px 0 18px', lineHeight: 2 }}>{cleanArabic(c.ar)}</p>
            {c.perspectives.map((p, i) => <PerspectiveCard key={i} p={p} accent={accent} language={language} isMobile={isMobile} />)}
            {(c.detailsTr || c.detailsEn) && (
              <div style={{ marginTop: 8, padding: '14px 18px', background: `${accent}0A`, border: `1px dashed ${accent}35`, borderRadius: 10 }}>
                <div style={{ fontSize: '0.64rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: accent, opacity: 0.85, marginBottom: 8 }}>
                  {tr ? 'Klasik Görüşlerin Ayrıntısı' : 'Detail of the Classical Opinions'}
                </div>
                <p style={{ color: COLORS.silver, fontSize: '0.84rem', lineHeight: 1.75, fontFamily: FONTS.body, margin: '0 0 8px' }}>
                  {tr ? c.detailsTr : c.detailsEn}
                </p>
                {c.detailsCitation && (
                  <p style={{ color: `${accent}90`, fontSize: '0.7rem', fontFamily: FONTS.body, margin: 0 }}>{c.detailsCitation}</p>
                )}
              </div>
            )}
            {(c.storyTr || c.storyEn) && (
              <div style={{ marginTop: 8, padding: '14px 18px', background: 'rgba(255,255,255,0.03)', borderLeft: `3px solid ${accent}`, borderRadius: 10 }}>
                <div style={{ fontSize: '0.64rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: accent, opacity: 0.85, marginBottom: 8 }}>
                  {tr ? 'Bir Kıssa' : 'A Story'}
                </div>
                <p style={{ color: COLORS.silver, fontSize: '0.84rem', lineHeight: 1.75, fontFamily: FONTS.body, fontStyle: 'italic', margin: '0 0 8px' }}>
                  {tr ? c.storyTr : c.storyEn}
                </p>
                {c.storyCitation && (
                  <p style={{ color: `${accent}90`, fontSize: '0.7rem', fontFamily: FONTS.body, margin: 0 }}>{c.storyCitation}</p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Tab 3: Bakara Anchors ────────────────────────────────────────────────────────
function TabBakaraAnchors({ data, language, isMobile }) {
  const tr = language === 'tr';
  const ba = data.bakaraAnchors;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 880, margin: '0 auto' }}>
      <div>
        <p className="mq-fs" style={{ color: COLORS.silver, '--fs-d': '0.95rem', '--fs-m': '0.88rem', lineHeight: 1.8, fontFamily: FONTS.body, marginBottom: 8 }}>
          {tr ? ba.introTr : ba.introEn}
        </p>
        <p style={{ color: `${COLORS.gold}90`, fontSize: '0.74rem', fontFamily: FONTS.body, lineHeight: 1.5 }}>
          {tr ? ba.citationTr : ba.citationEn}
        </p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {ba.anchors.map((a, i) => {
          const accent = CATEGORY_SCALE[i % CATEGORY_SCALE.length];
          return (
            <div key={i} style={{
              padding: '16px 20px', background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${COLORS.glassBorderSoft}`, borderLeft: `3px solid ${accent}`,
              borderRadius: 10,
            }}>
              <div style={{
                display: 'flex', alignItems: isMobile ? 'flex-start' : 'center',
                flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 10 : 18,
                marginBottom: a.noteTr ? 10 : 0,
              }}>
                <div style={{ minWidth: isMobile ? 'auto' : 200 }}>
                  <div style={{ color: COLORS.offWhite, fontSize: '0.9rem', fontFamily: FONTS.body, fontWeight: 700 }}>
                    {tr ? a.termTr : a.termEn}
                  </div>
                  <div style={{ color: accent, fontSize: '0.72rem', fontFamily: FONTS.body, fontWeight: 600 }}>
                    {tr ? 'Fâtiha' : 'Al-Fātiḥa'} {a.fatihaRef}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ color: COLORS.silver, fontSize: '0.78rem', fontFamily: FONTS.body, flexShrink: 0 }}>→ {tr ? 'Bakara' : 'Al-Baqarah'}</span>
                  {a.bakaraRefs.map(ref => (
                    <span key={ref} style={{
                      fontSize: '0.72rem', color: accent, fontFamily: FONTS.body, fontWeight: 600,
                      padding: '2px 10px', borderRadius: 20, background: `${accent}15`, border: `1px solid ${accent}35`,
                    }}>{ref}</span>
                  ))}
                </div>
              </div>
              {(a.noteTr || a.noteEn) && (
                <p style={{ color: COLORS.silver, fontSize: '0.82rem', lineHeight: 1.7, fontFamily: FONTS.body, margin: 0, paddingTop: 10, borderTop: `1px dashed ${accent}25` }}>
                  {tr ? a.noteTr : a.noteEn}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Tab 4: Scholars & Sources ──────────────────────────────────────────────────
function TabScholars({ data, language, isMobile }) {
  const tr = language === 'tr';
  return (
    <div style={{ maxWidth: 960, margin: '0 auto' }}>
      <div className="g-1-2" style={{ display: 'grid', gap: 16 }}>
        {data.scholars.map((s, i) => {
          const accent = CATEGORY_SCALE[i % CATEGORY_SCALE.length];
          return (
            <div key={i} style={{ ...GLASS_CARD, padding: '18px 20px', borderLeft: `3px solid ${accent}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 6 }}>
                <span style={{ color: COLORS.offWhite, fontFamily: FONTS.body, fontWeight: 700, fontSize: '0.94rem' }}>
                  {tr ? s.nameTr : s.nameEn}
                </span>
                <span style={{ color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.7rem', flexShrink: 0, opacity: 0.75 }}>
                  {s.died === 'çağdaş / contemporary' ? (tr ? 'çağdaş' : 'contemporary') : `ö. ${s.died}`}
                </span>
              </div>
              <div style={{ color: accent, fontFamily: FONTS.body, fontStyle: 'italic', fontSize: '0.82rem', marginBottom: 4 }}>
                {tr ? s.workTr : s.workEn}
              </div>
              <div style={{ color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.7rem', opacity: 0.7, marginBottom: 10 }}>
                {tr ? s.roleTr : s.roleEn} · {s.city}
              </div>
              <p style={{ color: COLORS.silver, fontSize: '0.82rem', lineHeight: 1.65, fontFamily: FONTS.body, margin: 0 }}>
                {tr ? s.descTr : s.descEn}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Tab definitions ──────────────────────────────────────────────────────────
const TABS_TR = ['Besmele', 'Halka Yapısı', 'Kelime Seçimi', 'Gramer İncelikleri', "Bakara'ya Çapalar", 'Âlimler & Kaynaklar'];
const TABS_EN = ['The Basmala', 'Ring Structure', 'Word Choice', 'Grammatical Subtleties', 'Anchors in Al-Baqarah', 'Scholars & Sources'];

// ── Main component ───────────────────────────────────────────────────────────
export default function FatihaAtlasi({ onClose }) {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const [data] = useState(fatihaDataStatic);
  const [activeTab, setActiveTab] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const navTop = useNavbarOffset(0, 62);
  const tabBarTop = navTop + 48;

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < BREAKPOINT_MOBILE);
    h();
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape' && onClose) onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const TABS = tr ? TABS_TR : TABS_EN;

  const TOOL_HEADER = (
    <ToolHeader
      icon={<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18M5 8c2-2 5-2 7 0s5 2 7 0M5 16c2-2 5-2 7 0s5 2 7 0" /></svg>}
      titleTr="Fâtiha Atlası"
      titleEn="Atlas of the Opening"
      subtitleTr="7 âyet · klasikten çağdaşa"
      subtitleEn="7 verses · classical to contemporary"
      language={language}
    />
  );

  const RELATED_CTA = (
    <div className="mq-box" style={{ maxWidth: 1080, margin: '0 auto', '--pt-d': "40px", '--pt-m': "24px", '--pr-d': "24px", '--pr-m': "16px", '--pb-d': "48px", '--pb-m': "32px", '--pl-d': "24px", '--pl-m': "16px", width: '100%' }}>
      <CrossToolCTA
        language={language}
        isMobile={isMobile}
        links={[
          { href: `/${language}/atlas/furuk`, titleTr: 'Fürûk Atlası', titleEn: 'Distinctions Atlas', descTr: 'Fâtiha\'nın hamd/Rahmân-Rahîm ayrımı gibi daha onlarca yakın-anlamlı kelime çifti.', descEn: 'Dozens more near-synonym word pairs, like Al-Fātiḥa\'s ḥamd and Raḥmān/Raḥīm.' },
          { href: `/${language}/atlas/munasebat`, titleTr: 'Münâsebât Atlası', titleEn: 'Coherence Atlas', descTr: 'Sûre içi tutarlılık ve sûreler arası bağlantıların daha geniş haritası.', descEn: 'The wider map of intra-surah coherence and inter-surah connections.' },
          { href: `/${language}/arac/retorik`, titleTr: 'Kur\'ân Belâgatı', titleEn: 'Quranic Rhetoric', descTr: 'İyyâke\'nin kelime sırası gibi gramer inceliklerinin daha geniş ailesi.', descEn: 'The wider family of grammatical subtleties like Iyyāka\'s word order.' },
        ]}
      />
    </div>
  );

  return (
    <div style={{
      background: COLORS.cosmicBlack,
      minHeight: `calc(100vh - ${navTop}px)`,
      display: 'flex', flexDirection: 'column',
      paddingTop: `${navTop}px`,
    }}>
      {TOOL_HEADER}

      <Hero language={language} isMobile={isMobile} />
      <StatStrip data={data} language={language} />

      {/* Tab bar */}
      <div style={{ position: 'sticky', top: `${tabBarTop}px`, zIndex: 30, isolation: 'isolate', flexShrink: 0 }}>
        <div style={{
          display: 'flex', gap: 0, overflowX: 'auto', scrollbarWidth: 'none',
          background: 'rgb(6, 8, 14)', backgroundColor: 'rgb(6, 8, 14)',
          borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
        }}>
          {TABS.map((label, i) => (
            <button
              key={i}
              onClick={() => { setActiveTab(i); setTimeout(() => { document.getElementById('fatiha-tab-anchor')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 50); }}
              className="mq-fs" style={{
                padding: isMobile ? '13px 16px' : '15px 24px',
                '--fs-d': '0.78rem', '--fs-m': '0.72rem',
                fontFamily: FONTS.body, fontWeight: activeTab === i ? 700 : 500,
                textTransform: 'uppercase', letterSpacing: '0.08em',
                color: activeTab === i ? COLORS.gold : COLORS.silver,
                background: activeTab === i ? COLORS.goldAlpha15 : 'transparent',
                border: 'none', cursor: 'pointer',
                borderBottom: activeTab === i ? `2px solid ${COLORS.gold}` : '2px solid transparent',
                whiteSpace: 'nowrap', transition: 'all 0.15s',
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <div aria-hidden="true" style={{
          position: 'absolute', top: 0, right: 0, bottom: 0, width: 28,
          background: 'linear-gradient(90deg, transparent, rgb(6, 8, 14))',
          pointerEvents: 'none',
        }} />
      </div>

      <span id="fatiha-tab-anchor" />

      <div className="mq-box" style={{ flex: 1, '--pt-d': "32px", '--pt-m': "22px", '--pr-d': "32px", '--pr-m': "16px", '--pb-d': "60px", '--pb-m': "40px", '--pl-d': "32px", '--pl-m': "16px" }}>
        {activeTab === 0 && <TabBesmele data={data} language={language} isMobile={isMobile} />}
        {activeTab === 1 && <TabRing data={data} language={language} isMobile={isMobile} />}
        {activeTab === 2 && <TabWordChoice data={data} language={language} isMobile={isMobile} />}
        {activeTab === 3 && <TabGrammar data={data} language={language} isMobile={isMobile} />}
        {activeTab === 4 && <TabBakaraAnchors data={data} language={language} isMobile={isMobile} />}
        {activeTab === 5 && <TabScholars data={data} language={language} isMobile={isMobile} />}

        {RELATED_CTA}
      </div>
    </div>
  );
}
