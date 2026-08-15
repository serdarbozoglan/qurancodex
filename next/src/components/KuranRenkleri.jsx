'use client';

import { useState, useEffect, useId } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import {
  FONTS, COLORS, TRANSITION, BREAKPOINT_MOBILE, RADIUS, SEMANTIC,
} from '../tokens';
import ToolHeader from './ToolHeader';
import CrossToolCTA from './CrossToolCTA';
import SourcesCitation from './SourcesCitation';
import HeroGeometricBackground from './HeroGeometricBackground';
import { cleanArabicForDisplay } from '../lib/arabic';

// ─── KURANI_COLORS — Kur'ani semantik renk paleti ─────────────────────────────
// Bu paleti tokens.js'e katmadık çünkü sadece bu tool'da semantik anlam
// taşır (Kur'an'da geçen fiziksel/metafizik renkler). Diğer tool'larda kullanıma
// açık değil. Repetition matrix (2026-07-12): 8x #C8D6E5, 7x #1D9E75, 6x
// #B91C1C, 5x #1E1B4B, 4x #CA8A04, 4x #0F4C35, 3x #F0F0F0, 3x #64748B, 3x
// #2563EB — refactor ile 43 raw hex tekil semantik atıf noktasına indirildi.
const KURANI_COLORS = {
  // Cennet / kurtuluş
  beyazFildisi:   '#C8D6E5',  // Kurtulanların yüzü, dağ şeritleri, Hz. Musa'nın eli
  yesilYaprak:    '#1D9E75',  // Cennet giysileri, koyu yeşil ağaç (accent + hex)
  yesilKoyu:      '#0F4C35',  // Cennet bahçeleri (Rahmân 55:64)
  altin:          '#B8860B',  // Bilezikler (İnsan 76:21)
  gumusGri:       '#64748B',  // Gümüş kaplar (İnsan 76:15)

  // Kıyâmet / cehennem
  kirmiziKan:     '#B91C1C',  // Gökyüzü kızıllığı, dağ şeritleri, Cehennem
  siyahKaranlik:  '#1E1B4B',  // Duman, azap görenler, karanlık dağ şeritleri
  sariKivilcim:   '#CA8A04',  // Kıvılcımlar, İnek (Bakara)
  maviDonuk:      '#2563EB',  // Gözlerin donuk mavisi (Tâ-Hâ 20:102)
  beyazSaf:       '#F0F0F0',  // Şafak çizgisi, saf beyaz kar
};

const TABS = {
  RENKLER:   'renkler',
  PALET:     'palet',
  BAGLAM:    'baglam',
  CENNET:    'cennet',
  KIYAMET:   'kiyamet',
  DILBILIM:  'dilbilim',
  KAYNAKLAR: 'kaynaklar',
};

const TAB_LABELS = {
  renkler:   { tr: 'RENKLER',         en: 'COLORS' },
  palet:     { tr: 'PALET',           en: 'PALETTE' },
  baglam:    { tr: 'BAĞLAM HARİTASI', en: 'CONTEXT MAP' },
  cennet:    { tr: 'CENNET PALETİ',   en: 'PARADISE PALETTE' },
  kiyamet:   { tr: 'KIYAMETİN RENKLERİ', en: "JUDGMENT'S COLORS" },
  dilbilim:  { tr: 'DİLBİLİM',        en: 'LINGUISTICS' },
  kaynaklar: { tr: 'KAYNAKLAR',       en: 'SOURCES' },
};

// ── Shared micro-components ──────────────────────────────────────────────────

function HapaxBadge() {
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:'4px', fontSize:'0.72rem', fontWeight:700, color:COLORS.purple, background:'rgba(83,74,183,0.14)', border:'1px solid rgba(83,74,183,0.32)', borderRadius: RADIUS.pillSm, padding:'3px 10px', whiteSpace:'nowrap', letterSpacing:'0.02em' }}>
      ✦ Hapax: 1
    </span>
  );
}

function InfoPopover({ text }) {
  const [open, setOpen] = useState(false);
  const tooltipId = useId();
  if (!text) return null;
  return (
    <span style={{ position:'relative', display:'inline-flex' }}>
      <button
        onClick={e => { e.stopPropagation(); setOpen(v => !v); }}
        onBlur={() => setOpen(false)}
        aria-label="Bilgi"
        aria-describedby={open ? tooltipId : undefined}
        style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:'22px', height:'22px', borderRadius:'50%', background:'rgba(59,130,246,0.09)', border:'1px solid rgba(59,130,246,0.22)', color:'rgba(59,130,246,0.78)', fontSize:'0.72rem', fontWeight:700, cursor:'pointer', flexShrink:0 }}
      >ℹ</button>
      {open && (
        <div
          id={tooltipId}
          role="tooltip"
          style={{ position:'absolute', bottom:'22px', left:'50%', transform:'translateX(-50%)', width:'240px', padding:'10px 12px', background:'rgba(8,10,26,0.97)', border:'1px solid rgba(59,130,246,0.2)', borderRadius: RADIUS.chip, boxShadow:'0 8px 24px rgba(0,0,0,0.5)', color:'rgba(148,163,184,0.9)', fontSize:'0.71rem', lineHeight:1.6, zIndex:30 }}
        >
          {text}
        </div>
      )}
    </span>
  );
}

const CONTEXT_BADGES = {
  // Rozet metni olarak KURANI_COLORS.yesilYaprak (#1D9E75, ratio 4.2) AA'yı
  // geçmiyordu — bu yalnızca UI kategori rozeti, sayfanın "âyetten
  // yeniden inşa edilen renk" içeriği değil, o yüzden ayrı bir metin-güvenli
  // token (emeraldBright) kullanılıyor; KURANI_COLORS.yesilYaprak'ın kendisi
  // (swatch/hex gösterimi) dokunulmadan kalıyor.
  cennet:   { labelTr: 'Cennet',   labelEn: 'Paradise',  bg: 'rgba(29,158,117,0.06)',  color: COLORS.emeraldBright },
  kiyamet:  { labelTr: 'Kıyamet',  labelEn: 'Judgment',  bg: 'rgba(200,50,50,0.12)',   color: COLORS.softRed },
  doga:     { labelTr: 'Tabiat',     labelEn: 'Nature',    bg: 'rgba(59,130,246,0.10)',  color: '#60a5fa' },
  kissa:    { labelTr: 'Kıssa',    labelEn: 'Narrative', bg: 'rgba(212,165,116,0.12)', color: COLORS.gold },
  mucize:   { labelTr: 'Mucize',   labelEn: 'Miracle',   bg: COLORS.softGoldAlpha12,   color: COLORS.softGold },
  kozmik:   { labelTr: 'Kozmik',   labelEn: 'Cosmic',    bg: 'rgba(139,92,246,0.12)',  color: COLORS.purple },
  cehennem: { labelTr: 'Cehennem', labelEn: 'Hell',      bg: 'rgba(239,68,68,0.12)',   color: '#f87171' },
};

const FILTERS_CONFIG = [
  { id: 'tumu',    labelTr: 'Tümü',     labelEn: 'All' },
  { id: 'cennet',  labelTr: 'Cennet',   labelEn: 'Paradise' },
  { id: 'kiyamet', labelTr: 'Kıyamet',  labelEn: 'Judgment' },
  { id: 'doga',    labelTr: 'Tabiat',     labelEn: 'Nature' },
  { id: 'kissa',   labelTr: 'Kıssa',    labelEn: 'Narrative' },
  { id: 'hapax',   labelTr: 'Hapax',    labelEn: 'Hapax' },
];

function ColorCard({ renk, language, isMobile, expanded, onToggle }) {
  const tr = language === 'tr';
  const hasHapax = renk.arabicTerms.some(t => t.isHapax);
  const primaryTerm = renk.arabicTerms[0];

  return (
    <div
      id={`color-${renk.id}`}
      role="button"
      tabIndex={0}
      aria-expanded={expanded}
      onClick={onToggle}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(); } }}
      style={{ background: renk.tintBg, border: `1px solid ${renk.tintBorder}`, borderRadius: RADIUS.chip, overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.15s', userSelect: 'none', height: '100%', display: 'flex', flexDirection: 'column', scrollMarginTop: '140px' }}
      onMouseEnter={e => { if (!isMobile) e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      {/* Color swatch */}
      <div style={{ height: '60px', background: renk.hexColor, flexShrink: 0 }} />

      {/* Card body */}
      <div style={{ padding: '14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Primary Arabic term — offWhite for contrast across all tinted bgs */}
        <p style={{ fontFamily: FONTS.quran, fontSize: '1.7rem', color: COLORS.offWhite, textAlign: 'right', direction: 'rtl', margin: '0 0 6px', lineHeight: 1.6 }} lang="ar" dir="rtl">
          {cleanArabicForDisplay(primaryTerm.arabic)}
        </p>

        {/* Name + transliteration */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontSize: '0.95rem', fontWeight: 700, color: COLORS.offWhite, fontFamily: FONTS.body }}>
            {tr ? renk.colorNameTr : renk.colorNameEn}
          </span>
          <span style={{ fontSize: '0.75rem', color: COLORS.silver, fontFamily: FONTS.body, fontStyle: 'italic' }}>
            {primaryTerm.transliteration}
          </span>
        </div>

        {/* Badges + mention count row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '7px' }}>
          <span style={{ fontSize: '0.82rem', color: COLORS.silver, fontFamily: FONTS.body, marginRight: '3px', fontWeight: 500 }}>
            ~{renk.totalMentions}{tr ? ' ayet' : ' v.'}
          </span>
          {renk.contexts.map(ctx => {
            const b = CONTEXT_BADGES[ctx];
            if (!b) return null;
            return (
              <span key={ctx} style={{ fontSize: '0.76rem', padding: '4px 11px', background: b.bg, color: b.color, borderRadius: RADIUS.pillSm, fontFamily: FONTS.body, fontWeight: 600, letterSpacing: '0.01em', border: `1px solid ${b.color}33` }}>
                {tr ? b.labelTr : b.labelEn}
              </span>
            );
          })}
          {hasHapax && <HapaxBadge />}
          {(renk.infoTr || renk.infoEn) && (
            <InfoPopover text={tr ? renk.infoTr : renk.infoEn} />
          )}
        </div>

        {/* Expand: all arabicTerms + keyVerse + allRefs + summary */}
        {expanded && (
          <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: `1px solid ${renk.tintBorder}` }}>
            {/* All Arabic terms */}
            {renk.arabicTerms.length > 1 && (
              <div style={{ marginBottom: '14px' }}>
                <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: COLORS.gold, fontFamily: FONTS.body, margin: '0 0 10px' }}>
                  {tr ? 'Kelime Formları' : 'Word Forms'}
                </p>
                {renk.arabicTerms.map(t => (
                  <div key={t.arabic} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${COLORS.glassBg}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontFamily: FONTS.quran, fontSize: '1.55rem', color: COLORS.gold, direction: 'rtl', lineHeight: 1.4 }} lang="ar" dir="rtl">{cleanArabicForDisplay(t.arabic)}</span>
                      <span style={{ fontSize: '0.78rem', color: COLORS.silver, fontFamily: FONTS.body, fontStyle: 'italic' }}>{t.transliteration}</span>
                      {t.isHapax && <HapaxBadge />}
                    </div>
                    <span style={{ fontSize: '0.74rem', color: COLORS.silver, fontFamily: FONTS.body, fontWeight: 600 }}>{t.mentionCount}×</span>
                  </div>
                ))}
              </div>
            )}

            {/* Key verse — premium elevated card */}
            <div style={{
              background: 'rgba(0,0,0,0.32)',
              border: `1px solid ${COLORS.goldAlpha20 || 'rgba(212,165,116,0.2)'}`,
              borderLeft: `3px solid ${renk.hexColor}`,
              borderRadius: RADIUS.md,
              padding: '16px 18px',
              marginBottom: '14px',
              boxShadow: `inset 0 0 20px ${renk.hexColor}10`,
            }}>
              <p style={{ fontSize: '0.66rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.16em', color: COLORS.gold, fontFamily: FONTS.body, margin: '0 0 12px', opacity: 0.78 }}>
                {tr ? 'Örnek Ayet' : 'Key Verse'}
              </p>
              <p style={{ fontFamily: FONTS.quran, fontSize: '1.75rem', color: COLORS.gold, textAlign: 'right', direction: 'rtl', lineHeight: 2, margin: '0 0 12px' }} lang="ar" dir="rtl">
                {renk.keyVerseAr}
              </p>
              <p style={{ fontSize: '0.9rem', color: COLORS.offWhite, fontStyle: 'italic', margin: '0 0 10px', fontFamily: FONTS.body, lineHeight: 1.7 }}>
                "{tr ? renk.keyVerseTr : renk.keyVerseEn}"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: renk.hexColor }} />
                <span style={{ fontSize: '0.76rem', color: `${renk.hexColor}cc`, fontWeight: 600, fontFamily: FONTS.body, letterSpacing: '0.03em' }}>
                  {renk.keyVerseRef}
                </span>
              </div>
            </div>

            {/* Summary */}
            <p style={{ fontSize: '0.85rem', color: COLORS.silver, lineHeight: 1.7, fontFamily: FONTS.body, margin: '0 0 12px' }}>
              {tr ? renk.summaryTr : renk.summaryEn}
            </p>

            {/* All refs */}
            {renk.allRefs && renk.allRefs.length > 1 && (
              <div style={{ marginBottom: '10px' }}>
                <p style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: COLORS.silver, fontFamily: FONTS.body, margin: '0 0 8px', opacity: 0.78 }}>
                  {tr ? 'Diğer Ayetler' : 'Other Verses'}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {renk.allRefs.filter(r => r !== renk.keyVerseRef).map(ref => (
                    <span key={ref} style={{ fontSize: '0.72rem', padding: '3px 10px', background: `${renk.hexColor}18`, border: `1px solid ${renk.hexColor}40`, color: renk.hexColor, borderRadius: RADIUS.pillSm, fontFamily: FONTS.body, fontWeight: 600 }}>
                      {ref}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Linguistic note */}
            {(renk.linguisticNoteTr || renk.linguisticNoteEn) && (
              <p style={{ fontSize: '0.78rem', color: `${COLORS.silver}99`, lineHeight: 1.6, fontFamily: FONTS.body, fontStyle: 'italic', margin: 0, paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                {tr ? renk.linguisticNoteTr : renk.linguisticNoteEn}
              </p>
            )}
          </div>
        )}

        {/* Expand indicator */}
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={`${COLORS.gold}80`} strokeWidth="2.5" strokeLinecap="round"
            style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function TabRenkler({ data, language, activeFilter, setActiveFilter, isMobile, expandedVerse, setExpandedVerse }) {
  const tr = language === 'tr';
  const [expandedCard, setExpandedCard] = useState(null);
  if (!data) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '40vh' }}>
      <p style={{ color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.85rem', margin: 0 }}>{tr ? 'Yükleniyor…' : 'Loading…'}</p>
    </div>
  );

  const filtered = data.renkler.filter(r => {
    if (activeFilter === 'tumu') return true;
    if (activeFilter === 'hapax') return r.arabicTerms.some(t => t.isHapax);
    return r.contexts.includes(activeFilter);
  });

  return (
    <div>
      {/* Filter pills */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {FILTERS_CONFIG.map(f => {
          const isActive = activeFilter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              style={{
                padding: '5px 14px',
                borderRadius: RADIUS.pillSm,
                border: `1px solid ${isActive ? (COLORS.goldAlpha45 || 'rgba(212,165,116,0.45)') : 'rgba(255,255,255,0.07)'}`,
                background: isActive ? COLORS.goldAlpha15 : 'transparent',
                color: isActive ? COLORS.gold : SEMANTIC.textFaint,
                fontFamily: FONTS.body,
                fontSize: '0.72rem',
                fontWeight: isActive ? 600 : 500,
                cursor: 'pointer',
                transition: `all ${TRANSITION.fast}`,
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                  e.currentTarget.style.color = COLORS.offWhite;
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = SEMANTIC.textFaint || COLORS.silver;
                }
              }}
            >
              {tr ? f.labelTr : f.labelEn}
            </button>
          );
        })}
      </div>

      {/* Card grid */}
      <div className="g-1-3" style={{ display: 'grid', gap: '12px', marginBottom: '32px', alignItems: 'stretch' }}>
        {filtered.map(renk => (
          <ColorCard
            key={renk.id}
            renk={renk}
            language={language}
            isMobile={isMobile}
            expanded={expandedCard === renk.id}
            onToggle={() => setExpandedCard(expandedCard === renk.id ? null : renk.id)}
          />
        ))}
      </div>

      {/* Renk Sekans feature */}
      {data.renkSekans && (
        <div className="mq-box" style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${COLORS.glassBorder}`, borderRadius: RADIUS.lg, '--pt-d': "20px", '--pt-m': "16px", '--pr-d': "20px", '--pr-m': "16px", '--pb-d': "20px", '--pb-m': "16px", '--pl-d': "20px", '--pl-m': "16px" }}>
          {/* Header */}
          <p style={{ fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.13em', color: COLORS.gold, fontFamily: FONTS.body, margin: '0 0 8px' }}>
            {tr ? "Kur'an'ın Renk Sekansı" : "The Quran's Color Sequence"}
          </p>
          <p style={{ fontFamily: FONTS.body, fontSize: '1rem', fontWeight: 700, color: COLORS.offWhite, margin: '0 0 10px' }}>
            {tr ? data.renkSekans.titleTr : data.renkSekans.titleEn}
          </p>
          <p style={{ fontFamily: FONTS.body, fontSize: '0.85rem', color: COLORS.silver, lineHeight: 1.65, margin: '0 0 16px' }}>
            {tr ? data.renkSekans.descTr : data.renkSekans.descEn}
          </p>

          {/* 3-stage timeline — gradient-blended narrative bar (Gemini polish) */}
          {(() => {
            const stageHexes = data.renkSekans.stages.map(s => s.hexColor);
            const gradient = `linear-gradient(${isMobile ? '180deg' : '90deg'}, ${stageHexes[0]} 0%, ${stageHexes[1]} 50%, ${stageHexes[2]} 100%)`;
            return (
              <div className="mq-box" style={{
                position: 'relative',
                marginBottom: '24px',
                '--pt-d': "28px", '--pt-m': "8px", '--pr-d': "24px", '--pr-m': "12px", '--pb-d': "20px", '--pb-m': "16px", '--pl-d': "24px", '--pl-m': "12px",
                background: 'rgba(0,0,0,0.18)',
                border: `1px solid ${COLORS.glassBorder}`,
                borderRadius: RADIUS.lg,
                overflow: 'hidden',
              }}>
                {/* Gradient backbone — horizontal (desktop) / vertical (mobile) */}
                <motion.div
                  initial={{ scaleX: isMobile ? 1 : 0, scaleY: isMobile ? 0 : 1, opacity: 0 }}
                  animate={{ scaleX: 1, scaleY: 1, opacity: 1 }}
                  transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
                  style={{
                    position: 'absolute',
                    ...(isMobile
                      ? { left: '38px', top: '40px', bottom: '40px', width: '4px', transformOrigin: 'top center' }
                      : { left: '12%', right: '12%', top: '54px', height: '4px', transformOrigin: 'left center' }),
                    background: gradient,
                    borderRadius: '4px',
                    boxShadow: `0 0 18px ${stageHexes[0]}66, 0 0 32px ${stageHexes[1]}33`,
                    zIndex: 1,
                  }}
                />

                {/* Stage markers — circular dots positioned along the gradient bar */}
                <div className="fd-row" style={{
                  position: 'relative', zIndex: 2,
                  display: 'flex',
                  alignItems: isMobile ? 'stretch' : 'flex-start',
                  justifyContent: isMobile ? 'flex-start' : 'space-around',
                  gap: isMobile ? '20px' : '16px',
                }}>
                  {data.renkSekans.stages.map((s, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, delay: 0.25 + i * 0.18, ease: [0.4, 0, 0.2, 1] }}
                      className="fd-col-reverse"
                      style={{
                        display: 'flex',
                        alignItems: isMobile ? 'flex-start' : 'center',
                        gap: isMobile ? '14px' : '10px',
                        maxWidth: isMobile ? 'none' : '180px',
                        textAlign: isMobile ? 'left' : 'center',
                      }}
                    >
                      {/* Color marker dot */}
                      <div style={{
                        width: '40px', height: '40px',
                        borderRadius: RADIUS.full,
                        background: s.hexColor,
                        border: '2px solid rgba(255,255,255,0.18)',
                        boxShadow: `0 0 0 4px rgba(0,0,0,0.4), 0 0 22px ${s.hexColor}88`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: FONTS.display, fontSize: '0.92rem', fontWeight: 800,
                        color: i < 2 ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,0.92)',
                        flexShrink: 0,
                      }}>
                        {i + 1}
                      </div>
                      {/* Label + note */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: isMobile ? 1 : 'unset' }}>
                        <span style={{
                          fontSize: '0.82rem', fontWeight: 700,
                          color: COLORS.offWhite, fontFamily: FONTS.body,
                        }}>
                          {tr ? s.labelTr : s.labelEn}
                        </span>
                        <span style={{
                          fontSize: '0.7rem', color: COLORS.silver,
                          fontFamily: FONTS.body, lineHeight: 1.45,
                        }}>
                          {tr ? s.noteTr : s.noteEn}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Verse buttons */}
          <p style={{ fontSize: '0.72rem', fontWeight: 600, color: COLORS.gold, fontFamily: FONTS.body, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>
            {tr ? '4 Sûrede Tekrar — Ayetleri Gör' : 'Repeated in 4 Suras — View Verses'}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
            {data.renkSekans.verses.map(v => (
              <button
                key={v.ref}
                onClick={() => setExpandedVerse(expandedVerse === v.ref ? null : v.ref)}
                style={{
                  padding: '4px 12px', borderRadius: RADIUS.pillSm, cursor: 'pointer',
                  border: `1px solid ${expandedVerse === v.ref ? COLORS.gold : 'rgba(212,165,116,0.35)'}`,
                  background: expandedVerse === v.ref ? COLORS.goldAlpha15 : 'transparent',
                  color: expandedVerse === v.ref ? COLORS.gold : COLORS.silver,
                  fontSize: '0.75rem', fontFamily: FONTS.body, fontWeight: 600,
                  transition: `all ${TRANSITION.fast}`,
                }}
              >
                {v.ref} {expandedVerse === v.ref ? '▲' : '▼'}
              </button>
            ))}
          </div>

          {/* Expanded verse panel */}
          {expandedVerse && (() => {
            const v = data.renkSekans.verses.find(x => x.ref === expandedVerse);
            if (!v) return null;
            const stageColors = { green: KURANI_COLORS.yesilYaprak, yellow: KURANI_COLORS.sariKivilcim, dry: '#78624A' };
            const stageLabels = {
              green:  { tr: 'Yeşil aşama',  en: 'Green stage' },
              yellow: { tr: 'Sarı aşama',   en: 'Yellow stage' },
              dry:    { tr: 'Kuru aşama',   en: 'Dry stage' },
            };
            return (
              <div style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${COLORS.goldAlpha20}`, borderRadius: RADIUS.chip, overflow: 'hidden', marginBottom: '12px' }}>
                {/* Full Arabic */}
                <div style={{ padding: '16px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <p style={{ fontFamily: FONTS.quran, fontSize: '1.35rem', color: COLORS.gold, textAlign: 'right', direction: 'rtl', lineHeight: 2, margin: '0 0 10px' }} lang="ar" dir="rtl">
                    {v.arFull}
                  </p>
                  <p style={{ fontFamily: FONTS.body, fontSize: '0.88rem', color: COLORS.silver, fontStyle: 'italic', margin: '0 0 6px', lineHeight: 1.65 }}>
                    "{tr ? v.trFull : v.enFull}"
                  </p>
                  <span style={{ fontSize: '0.72rem', color: 'rgba(212,165,116,0.6)', fontFamily: FONTS.body, fontWeight: 600 }}>— {v.ref}</span>
                </div>

                {/* Stage keyword breakdown */}
                <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <p style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: COLORS.silver, fontFamily: FONTS.body, margin: 0 }}>
                    {tr ? 'Hangi kelime hangi aşama?' : 'Which word maps to which stage?'}
                  </p>
                  {v.stages.map((s, i) => (
                    <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      {/* Color dot + label */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0, minWidth: isMobile ? '70px' : '90px' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: RADIUS.full, background: stageColors[s.stage], flexShrink: 0 }} />
                        <span style={{ fontSize: '0.68rem', fontWeight: 700, color: stageColors[s.stage], fontFamily: FONTS.body }}>
                          {tr ? stageLabels[s.stage].tr : stageLabels[s.stage].en}
                        </span>
                      </div>
                      {/* Keyword + note */}
                      <div style={{ flex: 1 }}>
                        <span style={{ fontFamily: FONTS.quran, fontSize: '1.1rem', color: stageColors[s.stage], direction: 'rtl', marginRight: '8px' }} lang="ar" dir="rtl">
                          {s.keywordAr}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: COLORS.offWhite, fontFamily: FONTS.body, fontWeight: 600 }}>
                          ({tr ? s.keywordTr : s.keywordEn})
                        </span>
                        <p style={{ fontSize: '0.72rem', color: COLORS.silver, fontFamily: FONTS.body, margin: '3px 0 0', lineHeight: 1.4 }}>
                          {tr ? s.noteTr : s.noteEn}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}

// ═══ TabPalet — interaktif renk paleti (2026-07-10 Dalga 3 · Madde 3.2) ═══════
// data.renkler'in tamamını dairesel/grid layout'ta gösterir. Her swatch:
// (a) Rengin hex çemberi (kartın accent'i), (b) Türkçe adı, (c) hover'da
// canlanan Arapça terim + 1-satır semantik. Click → RENKLER tab'ına atlar,
// ilgili karta scroll + filter. Mobile'da linear grid, desktop'ta 4-kolonlu
// hexagonal grid.
function TabPalet({ data, language, isMobile, onColorClick }) {
  const tr = language === 'tr';
  const [hoveredId, setHoveredId] = useState(null);
  const colors = data?.renkler || [];

  if (!colors.length) return null;

  return (
    <div className="mq-box" style={{ '--pt-d': "32px", '--pt-m': "20px", '--pr-d': "24px", '--pr-m': "12px", '--pb-d': "48px", '--pb-m': "32px", '--pl-d': "24px", '--pl-m': "12px", maxWidth: '1080px', margin: '0 auto' }}>
      {/* Section header */}
      <div className="mq-box" style={{ textAlign: 'center', '--mb-d': '36px', '--mb-m': '24px' }}>
        <div style={{ fontSize: '0.7rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: COLORS.gold, fontWeight: 700, opacity: 0.75, marginBottom: '10px' }}>
          {tr ? "Kur'ân'ın Renk Paleti" : "The Qur'anic Color Palette"}
        </div>
        <h2 style={{ fontFamily: FONTS.display, fontSize: isMobile ? 'clamp(1.4rem, 5vw, 1.7rem)' : 'clamp(1.8rem, 3vw, 2.2rem)', color: COLORS.offWhite, margin: '0 0 12px', lineHeight: 1.15 }}>
          {tr ? (
            <>Bir bakışta <span style={{ color: COLORS.gold }}>tüm renkler</span></>
          ) : (
            <>All colors <span style={{ color: COLORS.gold }}>at a glance</span></>
          )}
        </h2>
        <p style={{ color: COLORS.silver, fontSize: '0.9rem', maxWidth: '540px', margin: '0 auto', lineHeight: 1.55, opacity: 0.85 }}>
          {tr
            ? `${colors.length} renk · her biri Kur'ân'ın kendine has semantik alanıyla. Bir swatch üstüne gelin, tıklayınca ilgili rengin ayet listesine atlarsınız.`
            : `${colors.length} colors · each with its distinct Qur'anic semantic domain. Hover to preview, click to jump to that color's verse list.`}
        </p>
      </div>

      {/* Swatch grid — mobile 2-col, desktop 4-col */}
      <div className="g-2-4" style={{
        display: 'grid',
        gap: isMobile ? '14px' : '20px',
      }}>
        {colors.map(c => {
          const isHover = hoveredId === c.id;
          const name = language === 'tr' ? c.colorNameTr : c.colorNameEn;
          const summary = language === 'tr' ? c.summaryTr : c.summaryEn;
          const arTerm = (c.arabicTerms && c.arabicTerms[0] && c.arabicTerms[0].arabic) || '';
          const refCount = (c.allRefs && c.allRefs.length) || 0;

          return (
            <button className="mq-box"
              key={c.id}
              onClick={() => onColorClick && onColorClick(c.id)}
              onMouseEnter={() => setHoveredId(c.id)}
              onMouseLeave={() => setHoveredId(null)}
              onFocus={() => setHoveredId(c.id)}
              onBlur={() => setHoveredId(null)}
              aria-label={`${name} — ${refCount} ${tr ? 'ayet' : 'verses'}`}
              style={{
                position: 'relative',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center',
                '--pt-d': "28px", '--pt-m': "20px", '--pr-d': "16px", '--pr-m': "12px", '--pb-d': "22px", '--pb-m': "16px", '--pl-d': "16px", '--pl-m': "12px",
                background: isHover ? `${c.hexColor}12` : 'rgba(255,255,255,0.02)',
                border: `1px solid ${isHover ? `${c.hexColor}55` : COLORS.glassBorderSoft}`,
                borderRadius: RADIUS.lg,
                cursor: 'pointer',
                transition: 'all 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
                textAlign: 'center',
                transform: isHover ? 'translateY(-4px)' : 'translateY(0)',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              {/* Color disc */}
              <div className="mq-box" style={{
                width: isMobile ? '54px' : '72px',
                height: isMobile ? '54px' : '72px',
                borderRadius: '50%',
                background: c.hexColor,
                border: '2px solid rgba(255,255,255,0.08)',
                boxShadow: isHover
                  ? `0 0 32px ${c.hexColor}66, 0 0 0 4px ${c.hexColor}18`
                  : `0 4px 14px ${c.hexColor}22`,
                transition: 'box-shadow 0.28s ease',
                '--mb-d': '16px', '--mb-m': '12px',
              }} />

              {/* Turkish name */}
              <div style={{
                fontFamily: FONTS.display,
                fontSize: isMobile ? '1.05rem' : '1.18rem',
                fontWeight: 600,
                color: isHover ? c.hexColor : COLORS.offWhite,
                lineHeight: 1.15,
                marginBottom: '6px',
                transition: 'color 0.2s ease',
              }}>
                {name}
              </div>

              {/* Arabic term */}
              {arTerm && (
                <div style={{
                  fontFamily: FONTS.quran,
                  fontSize: isMobile ? '0.95rem' : '1.05rem',
                  color: COLORS.gold,
                  opacity: isHover ? 0.95 : 0.72,
                  direction: 'rtl',
                  lineHeight: 1.4,
                  marginBottom: '8px',
                  transition: 'opacity 0.2s ease',
                }} dir="rtl" lang="ar">
                  {arTerm}
                </div>
              )}

              {/* Ref count chip */}
              <div style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                color: c.hexColor,
                background: `${c.hexColor}18`,
                border: `1px solid ${c.hexColor}30`,
                borderRadius: RADIUS.pillSm,
                padding: '2px 8px',
                marginBottom: '10px',
              }}>
                {refCount} {tr ? 'ayet' : 'verses'}
              </div>

              {/* Hex code */}
              <div style={{
                fontFamily: 'ui-monospace, SFMono-Regular, monospace',
                fontSize: '0.66rem',
                color: COLORS.silver,
                opacity: 0.78,
                letterSpacing: '0.04em',
                marginBottom: '10px',
              }}>
                {c.hexColor.toUpperCase()}
              </div>

              {/* Summary — hover-only expand */}
              {summary && (
                <div style={{
                  fontSize: '0.72rem',
                  color: COLORS.silver,
                  opacity: isHover ? 0.95 : 0,
                  maxHeight: isHover ? '80px' : '0',
                  overflow: 'hidden',
                  lineHeight: 1.5,
                  transition: 'opacity 0.25s ease, max-height 0.28s ease',
                }}>
                  {summary}
                </div>
              )}

              {/* Click affordance */}
              <div style={{
                marginTop: '10px',
                fontSize: '0.66rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: isHover ? c.hexColor : COLORS.silver,
                opacity: isHover ? 1 : 0.4,
                fontWeight: 700,
                transition: 'all 0.2s ease',
              }}>
                {tr ? 'Detay →' : 'Details →'}
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer note */}
      <p className="mq-box" style={{
        textAlign: 'center',
        color: COLORS.silver,
        fontSize: '0.75rem',
        opacity: 0.78,
        '--mt-d': '40px', '--mt-m': '28px',
        fontStyle: 'italic',
      }}>
        {tr
          ? "Renkler Kur'ân'da sadece görsel değil, semantik alanlardır — beyaz iyilik, siyah utanç, yeşil vaad."
          : "In the Qur'an colors are not merely visual — they are semantic domains: white for grace, black for shame, green for the promise."}
      </p>
    </div>
  );
}

function TabBaglam({ language, isMobile }) {
  const tr = language === 'tr';
  const [expandedItem, setExpandedItem] = useState(null); // "sectionIdx-colorIdx"

  const sections = [
    {
      titleTr: 'Cennet Paleti',
      titleEn: 'Paradise Palette',
      accentColor: KURANI_COLORS.yesilYaprak,
      descTr: "Kur'an cennetin renklerini doğrudan adlandırmaz — nesneler aracılığıyla verir. Dikkat çekici olan: cennet tasvirinde kırmızı, turuncu ve sarı yoktur. Serin, sakin tonlar hâkim.",
      descEn: "The Quran names paradise colors through objects, not directly. Notably: no red, orange or yellow in paradise imagery. Cool, serene tones dominate.",
      colors: [
        {
          hex: KURANI_COLORS.yesilYaprak, nameTr: 'Yeşil — Elbiseler', nameEn: 'Green — Garments',
          verseAr: 'يَلْبَسُونَ ثِيَابًا خُضْرًا مِّن سُندُسٍ وَإِسْتَبْرَقٍ',
          verseTr: 'İnce ipek ve kalın ipekten yeşil elbiseler giyerler.',
          verseEn: 'They wear green garments of fine silk and brocade.',
          ref: 'Kehf 18:31',
          noteTr: "Yeşil giysi ile altın bilezik Kehf 18:31'de bir arada anılır — cennet ehlinin giysisi ve süsü. (İnsan 76:21'de yeşil giysiye gümüş bilezik eşlik eder.)",
          noteEn: "Green garment and gold bracelet appear together in Al-Kahf 18:31 — the dress and adornment of Paradise's people. (In Al-Insan 76:21, silver bracelets accompany the green garments.)",
        },
        {
          hex: KURANI_COLORS.altin, nameTr: 'Altın — Bilezikler', nameEn: 'Gold — Bracelets',
          verseAr: 'يُحَلَّوْنَ فِيهَا مِنْ أَسَاوِرَ مِن ذَهَبٍ وَلُؤْلُؤًا',
          verseTr: 'Orada altın bilezikler ve incilerle süslenirler.',
          verseEn: 'They are adorned therein with bracelets of gold and pearl.',
          ref: 'Hac 22:23',
          noteTr: "Altın bilezik motifi 3 sûrede tekrarlanır: Hac, Kehf, Fatır. Altın cennetin metalik rengidir — dünyada yasak olan erkeklere cennetin hediyesi.",
          noteEn: "Gold bracelet motif repeats in 3 suras: Al-Hajj, Al-Kahf, Fatir. Gold is paradise's metallic color — the gift of paradise to men forbidden it in the world.",
        },
        {
          hex: KURANI_COLORS.gumusGri, nameTr: 'Gümüş — Kaplar', nameEn: 'Silver — Vessels',
          verseAr: 'وَيُطَافُ عَلَيْهِم بِآنِيَةٍ مِّن فِضَّةٍ وَأَكْوَابٍ كَانَتْ قَوَارِيرَا ۝ قَوَارِيرَ مِن فِضَّةٍ',
          verseTr: 'Gümüşten kaplar ve billur kadehlerle dolaşılır — gümüşten billur.',
          verseEn: 'Silver vessels and crystal cups circulate — crystal of silver.',
          ref: 'İnsan 76:15-16',
          noteTr: "'Gümüşten billur' — billurın şeffaflığında gümüş parlaklığı. İki malzemenin özelliği tek nesnede. Kur'an'ın en özgün malzeme tasviri.",
          noteEn: "'Crystal of silver' — silver's sheen with crystal's transparency. Two material properties in one object.",
        },
        {
          hex: KURANI_COLORS.yesilKoyu, nameTr: 'Koyu Yeşil — Bahçeler', nameEn: 'Dark Green — Gardens',
          verseAr: 'مُدْهَامَّتَانِ',
          verseTr: 'İkisi de koyu yemyeşil.',
          verseEn: 'Both of them are intensely dark green.',
          ref: 'Rahman 55:64',
          noteTr: "Hapax legomenon — tüm Kur'an'da yalnızca bir kez geçer. Yeşilin o kadar yoğun olduğu ton ki neredeyse siyaha döner. İki cennet bahçesini tanımlar.",
          noteEn: "Hapax legomenon — appears only once in the entire Quran. Green so intense it borders on black. Describes the two paradise gardens.",
          isHapax: true,
        },
      ],
    },
    {
      titleTr: 'Cehennem Paleti',
      titleEn: 'Hell Palette',
      accentColor: KURANI_COLORS.kirmiziKan,
      descTr: "Cehennem renkleri cennetin tam zıttı: yeşil ve altın yok. Siyah, sarı ve kırmızı — ısı, yanma ve ceza tonları. Zıtlık kasıtlı ve sistematik.",
      descEn: "Hell's colors are the exact opposite of paradise: no green, no gold. Black, yellow and red — heat, burning and punishment tones. The contrast is deliberate and systematic.",
      colors: [
        {
          hex: KURANI_COLORS.siyahKaranlik, nameTr: 'Siyah — Duman', nameEn: 'Black — Smoke',
          verseAr: 'وَظِلٍّ مِّن يَحْمُومٍ ۝ لَّا بَارِدٍ وَلَا كَرِيمٍ',
          verseTr: 'Simsiyah bir duman gölgesinde — ne serin ne de hoş.',
          verseEn: 'In the shade of black smoke — neither cool nor pleasant.',
          ref: 'Vâkıa 56:43-44',
          noteTr: "يَحْمُوم (yahmûm) — kuzgun/kömür siyahı. Cennetin 'serinliğine' karşı bu gölge ne serindir ne de güzel. Her şey cennetle tezat.",
          noteEn: "يَحْمُوم (yahmûm) — raven/coal black. Contrasting paradise's 'coolness,' this shade is neither cool nor good. Everything is opposite to paradise.",
        },
        {
          hex: KURANI_COLORS.sariKivilcim, nameTr: 'Sarı — Kıvılcımlar', nameEn: 'Yellow — Sparks',
          verseAr: 'إِنَّهَا تَرْمِي بِشَرَرٍ كَالْقَصْرِ ۝ كَأَنَّهُ جِمَالَتٌ صُفْرٌ',
          verseTr: 'Saraylar büyüklüğünde kıvılcımlar fırlatıyor — sanki sarı develer gibi.',
          verseEn: 'It throws sparks as large as a palace — as if they were yellow camels.',
          ref: 'Mürselat 77:32-33',
          noteTr: "Sarının tek olumlu kullanımı Bakara'daki inek. Burada sarı: cehennem kıvılcımı, sarı deve — büyük, ürkütücü, yakıcı.",
          noteEn: "Yellow's only positive use is Al-Baqarah's cow. Here yellow: hellfire spark, yellow camel — large, terrifying, burning.",
        },
        {
          hex: KURANI_COLORS.kirmiziKan, nameTr: 'Kırmızı — Gökyüzü', nameEn: 'Red — The Sky',
          verseAr: 'فَإِذَا انشَقَّتِ السَّمَاءُ فَكَانَتْ وَرْدَةً كَالدِّهَانِ',
          verseTr: 'Gökyüzü yarılıp kırmızı yağ gibi olduğunda.',
          verseEn: 'When the sky is split open and turns red like oil.',
          ref: 'Rahman 55:37',
          noteTr: "وَرْدَة (verdeh) — gül/kırmızı. كَالدِّهَان (kad-dihan) — eritilmiş yağ kıvamında. Gökyüzünün kıyamette tamamen dönüşümü. Cennetin sakin mavisine karşı kırmızı kaos.",
          noteEn: "وَرْدَة (wardah) — rose/red. كَالدِّهَان (kad-dihan) — like molten oil in consistency. The complete transformation of the sky on the Day. Red chaos against paradise's serene blue.",
        },
      ],
    },
    {
      titleTr: 'Kıyamet Paleti',
      titleEn: 'Judgment Day Palette',
      accentColor: KURANI_COLORS.beyazFildisi,
      descTr: "Kıyamet sahnesi Kur'an'da en yoğun renk bağlamıdır. Renk burada sembolik sınıflandırıcıdır: beyaz yüz = kurtuluş, siyah yüz = azap. Tek ayette iki kutup.",
      descEn: "The judgment scene is the most color-dense context in the Quran. Color here is a symbolic classifier: white face = salvation, black face = punishment. Two poles in one verse.",
      colors: [
        {
          hex: KURANI_COLORS.beyazFildisi, nameTr: 'Beyaz — Kurtulanların Yüzü', nameEn: "White — The Saved's Faces",
          verseAr: 'يَوْمَ تَبْيَضُّ وُجُوهٌ وَتَسْوَدُّ وُجُوهٌ',
          verseTr: 'Yüzlerin beyazlayacağı ve yüzlerin kararacağı gün.',
          verseEn: 'The day when faces will turn white and faces will turn black.',
          ref: 'Âl-i İmrân 3:106',
          noteTr: "Tek ayette iki zıt renk. تَبْيَضُّ (beyazlaşmak) ve تَسْوَدُّ (kararışmak) fiilleri birlikte — renk burada ahlaki durumu gösterir.",
          noteEn: "Two opposing colors in one verse. تَبْيَضُّ (to whiten) and تَسْوَدُّ (to blacken) together — color here indicates moral state.",
        },
        {
          hex: KURANI_COLORS.maviDonuk, nameTr: 'Mavi/Donuk — Gözler', nameEn: 'Blue/Glazed — Eyes',
          verseAr: 'وَنَحْشُرُ الْمُجْرِمِينَ يَوْمَئِذٍ زُرْقًا',
          verseTr: 'O gün suçluları gözleri donuk/mavimsi olarak haşredeceğiz.',
          verseEn: 'That day We will gather the criminals with blue/glazed eyes.',
          ref: 'Tâhâ 20:102',
          noteTr: "زُرْق (zurk) — Arapça'da hem 'mavi' hem 'donuk, kör gibi' anlamına gelir. Korku ve dehşetten donup kalan göz. Müfessirler ikisi üzerinde ayrılır.",
          noteEn: "زُرْق (zurq) — means both 'blue' and 'glazed, blind-like' in Arabic. Eyes frozen in terror and horror. Commentators are divided between both meanings.",
        },
        {
          hex: KURANI_COLORS.kirmiziKan, nameTr: 'Kırmızı — Gökyüzü', nameEn: 'Red — The Sky',
          verseAr: 'فَإِذَا انشَقَّتِ السَّمَاءُ فَكَانَتْ وَرْدَةً كَالدِّهَانِ',
          verseTr: 'Gökyüzü yarılıp kırmızı yağ gibi olduğunda.',
          verseEn: 'When the sky is split open and turns red like oil.',
          ref: 'Rahman 55:37',
          noteTr: "Kıyametin kozmik işareti: gökyüzünün rengi kırmızıya dönüşüyor. Gündelik mavi gökyüzünün tam zıttı.",
          noteEn: "The cosmic sign of judgment: the sky's color transforms to red. The exact opposite of the everyday blue sky.",
        },
        {
          hex: KURANI_COLORS.siyahKaranlik, nameTr: 'Siyah — Azap Görenler', nameEn: 'Black — The Punished',
          verseAr: 'فَأَمَّا الَّذِينَ اسْوَدَّتْ وُجُوهُهُمْ أَكَفَرْتُمْ بَعْدَ إِيمَانِكُمْ',
          verseTr: 'Yüzleri kararan kimseler ise: "İman ettikten sonra mı inkâr ettiniz?"',
          verseEn: 'As for those whose faces turn black: "Did you disbelieve after your faith?"',
          ref: 'Âl-i İmrân 3:106',
          noteTr: "Aynı ayette beyazla zıtlık. Kararma burada inanç dönüşümünün simgesi — sadece fiziksel değil, manevi durum.",
          noteEn: "Contrast with white in the same verse. Blackening here symbolizes a reversal of faith — not just physical but moral state.",
        },
      ],
    },
    {
      titleTr: 'Tabiat Paleti',
      titleEn: 'Nature Palette',
      accentColor: COLORS.gold,
      descTr: "Tabiat tasvirinde renk hem gerçekçi hem sembolik. Fâtır 35:27 jeolojik bir gözlem — dağlardaki mineral şeritleri. Bakara 2:187 rengi pratik bir zaman ölçütü olarak kullanır.",
      descEn: "In nature descriptions, color is both realistic and symbolic. Fatir 35:27 is a geological observation — mineral streaks in mountains. Al-Baqarah 2:187 uses color as a practical time measure.",
      colors: [
        {
          hex: KURANI_COLORS.beyazFildisi, nameTr: 'Beyaz — Dağ Şeritleri', nameEn: 'White — Mountain Streaks',
          verseAr: 'وَمِنَ الْجِبَالِ جُدَدٌ بِيضٌ وَحُمْرٌ مُّخْتَلِفٌ أَلْوَانُهَا وَغَرَابِيبُ سُودٌ',
          verseTr: 'Dağlarda beyaz, kırmızı — renkleri birbirinden farklı — ve simsiyah şeritler vardır.',
          verseEn: 'And among the mountains are streaks of white and red of varying shades, and some intensely black.',
          ref: 'Fâtır 35:27',
          noteTr: "جُدَد (cüded) — mineral şeritler. Tek ayette 3 renk: beyaz (kalsit/kireçtaşı), kırmızı (demir oksit), siyah (bazalt/mika). Modern jeoloji bu şeritleri tanır.",
          noteEn: "جُدَد (judad) — mineral streaks. Three colors in one verse: white (calcite/limestone), red (iron oxide), black (basalt/mica). Modern geology recognizes these streaks.",
        },
        {
          hex: KURANI_COLORS.kirmiziKan, nameTr: 'Kırmızı — Dağ Şeritleri', nameEn: 'Red — Mountain Streaks',
          verseAr: 'وَمِنَ الْجِبَالِ جُدَدٌ بِيضٌ وَحُمْرٌ مُّخْتَلِفٌ أَلْوَانُهَا وَغَرَابِيبُ سُودٌ',
          verseTr: 'Dağlarda beyaz, kırmızı — renkleri birbirinden farklı — ve simsiyah şeritler vardır.',
          verseEn: 'And among the mountains are streaks of white and red of varying shades, and some intensely black.',
          ref: 'Fâtır 35:27',
          noteTr: "مُّخْتَلِفٌ أَلْوَانُهَا (muhteli­fun elvânuhâ) — renkleri birbirinden farklı. Kırmızı için özellikle bu çokluk nitelemesi var — demir oksitin farklı yoğunluklarına işaret.",
          noteEn: "مُّخْتَلِفٌ أَلْوَانُهَا — 'of varying shades' applies specifically to red — pointing to the different concentrations of iron oxide.",
        },
        {
          hex: KURANI_COLORS.siyahKaranlik, nameTr: 'Siyah — Dağ Şeritleri', nameEn: 'Black — Mountain Streaks',
          verseAr: 'وَغَرَابِيبُ سُودٌ',
          verseTr: 'Ve simsiyah.',
          verseEn: 'And intensely black.',
          ref: 'Fâtır 35:27',
          noteTr: "غَرَابِيب (garâbîb) — kuzgun/karga kökünden. Siyahın en yoğun tonu için özel kelime. 'Siyah siyah' anlamında pekiştirme — Türkçe'deki 'simsiyah' gibi.",
          noteEn: "غَرَابِيب (gharabib) — from ghurab (raven/crow). A special word for the most intense shade of black. Intensifying 'black black' — like English 'pitch black.'",
        },
        {
          hex: KURANI_COLORS.beyazSaf, nameTr: 'Beyaz — Şafak Çizgisi', nameEn: 'White — Dawn Line',
          verseAr: 'حَتَّىٰ يَتَبَيَّنَ لَكُمُ الْخَيْطُ الْأَبْيَضُ مِنَ الْخَيْطِ الْأَسْوَدِ مِنَ الْفَجْرِ',
          verseTr: 'Şafağın beyaz ipliği siyah iplikten sizin için ayrılıncaya kadar.',
          verseEn: 'Until the white thread of dawn becomes distinct to you from the black thread.',
          ref: 'Bakara 2:187',
          noteTr: "Renk burada pratik bir zaman ölçütü: oruç ve sabah namazı için şafağın tanımı. الْخَيْطُ الْأَبْيَضُ (beyaz iplik) = ufukta beliren ilk ışık şeridi.",
          noteEn: "Color here is a practical time measure: the definition of dawn for fasting and morning prayer. الْخَيْطُ الْأَبْيَضُ (white thread) = first light streak on the horizon.",
        },
      ],
    },
    {
      titleTr: 'Kıssa ve Mucize Paleti',
      titleEn: 'Narrative & Miracle Palette',
      accentColor: KURANI_COLORS.beyazFildisi,
      descTr: "Mucizelerin rengi Kur'an'da tutarlı biçimde beyazdır. Sarı yalnızca bir kez olumlu bağlamda — Bakara'nın ineği. Bu tutarlılık tesadüf değil.",
      descEn: "The color of miracles in the Quran is consistently white. Yellow appears positively only once — Al-Baqarah's cow. This consistency is not coincidental.",
      colors: [
        {
          hex: KURANI_COLORS.beyazFildisi, nameTr: "Beyaz — Hz. Musa'nın Eli", nameEn: "White — Moses' Hand",
          verseAr: 'وَأَدْخِلْ يَدَكَ فِي جَيْبِكَ تَخْرُجْ بَيْضَاءَ مِنْ غَيْرِ سُوءٍ',
          verseTr: 'Elini koynuna sok; hastalıksız beyaz olarak çıksın.',
          verseEn: 'Put your hand into your garment; it will come out white without disease.',
          ref: 'Neml 27:12',
          noteTr: "Hz. Musa'nın eli 5 sûrede beyaz mucize olarak geçer: Araf, Taha, Şuarâ, Neml, Kasas. 'Hastalıksız beyaz' — hastalık (alacalık/lepra) beyazından ayrımak için özel vurgu.",
          noteEn: "Moses' hand appears as a white miracle in 5 suras: Al-A'raf, Ta-Ha, Ash-Shu'ara, An-Naml, Al-Qasas. 'White without disease' — special emphasis to distinguish from disease (vitiligo/leprosy).",
        },
        {
          hex: KURANI_COLORS.sariKivilcim, nameTr: "Sarı — Bakara'nın İneği", nameEn: "Yellow — Al-Baqarah's Cow",
          verseAr: 'إِنَّهَا بَقَرَةٌ صَفْرَاءُ فَاقِعٌ لَّوْنُهَا تَسُرُّ النَّاظِرِينَ',
          verseTr: 'O, rengi pırıl pırıl olan sarı bir inektir; bakanlara sevinç veriyor.',
          verseEn: 'It is a yellow cow, bright in color, pleasing to those who see it.',
          ref: 'Bakara 2:69',
          noteTr: "صَفْرَاءُ فَاقِعٌ (safrâ fâkı') — fâkı' sarının en parlak, en saf tonudur. Kur'an'da sarının tek mutlu bağlamı. Tüm diğer sarı kullanımları olumsuz veya nötr.",
          noteEn: "صَفْرَاءُ فَاقِعٌ (safrâ fâqi') — fâqi' is the brightest, purest shade of yellow. The only joyful use of yellow in the Quran. All other yellow uses are negative or neutral.",
        },
        {
          hex: KURANI_COLORS.beyazFildisi, nameTr: "Beyaz — Hz. İsa'nın Mucizesi", nameEn: "White — Jesus' Miracle",
          verseAr: 'وَتُبْرِئُ الْأَكْمَهَ وَالْأَبْرَصَ بِإِذْنِي',
          verseTr: 'Doğuştan körü ve alacalıyı iznimle iyileştiriyordun.',
          verseEn: 'You healed the blind and the leper by My permission.',
          ref: 'Mâide 5:110',
          noteTr: "الْأَبْرَص (ebrâs) — alacalı, vitiligo. Hz. İsa'nın mucizesi rengi iyileştirmek — beyazı geri getirmek veya normalleştirmek. Renk burada sağlığın simgesi.",
          noteEn: "الْأَبْرَص (abras) — vitiligo, leukoderma. Jesus' miracle is restoring color — bringing back or normalizing white. Color here symbolizes health.",
        },
      ],
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {sections.map((section, si) => {
        const accent = section.accentColor;
        const hapaxCount = section.colors.filter(c => c.isHapax).length;
        return (
          <div
            key={si}
            style={{
              background: `linear-gradient(180deg, ${accent}0F 0%, rgba(255,255,255,0.022) 30%, rgba(255,255,255,0.022) 100%)`,
              border: `1px solid ${COLORS.glassBorder}`,
              borderRadius: RADIUS.lg,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {/* Decorative accent glow — top edge */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
              background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
              opacity: 0.65, pointerEvents: 'none',
            }} />

            {/* ── Section header — premium upgrade ── */}
            <div className="mq-box" style={{
              '--pt-d': "22px", '--pt-m': "18px", '--pr-d': "24px", '--pr-m': "16px", '--pb-d': "18px", '--pb-m': "16px", '--pl-d': "24px", '--pl-m': "16px",
              borderBottom: `1px solid ${COLORS.glassBg}`,
              position: 'relative',
            }}>
              {/* Top row: eyebrow label + meta count */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '4px', height: '18px', borderRadius: '2px',
                    background: accent,
                    boxShadow: `0 0 12px ${accent}88, 0 0 24px ${accent}44`,
                    flexShrink: 0,
                  }} />
                  <span style={{
                    fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.18em',
                    color: accent, textTransform: 'uppercase', fontFamily: FONTS.body,
                  }}>
                    {tr ? section.titleTr : section.titleEn}
                  </span>
                </div>
                <span style={{
                  fontSize: '0.66rem', fontWeight: 600, letterSpacing: '0.08em',
                  color: SEMANTIC.textFaint || COLORS.silver,
                  fontFamily: FONTS.body, textTransform: 'uppercase',
                  padding: '3px 9px', background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: RADIUS.pillSm,
                }}>
                  {section.colors.length} {tr ? 'renk' : 'colors'}{hapaxCount > 0 && (tr ? ` · ${hapaxCount} hapax` : ` · ${hapaxCount} hapax`)}
                </span>
              </div>

              {/* Palette signature stripe — all colors at a glance */}
              <div style={{ display: 'flex', gap: '4px', marginBottom: '14px', flexWrap: 'wrap' }}>
                {section.colors.map((c, idx) => (
                  <div
                    key={idx}
                    title={tr ? c.nameTr : c.nameEn}
                    style={{
                      flex: '1 1 auto', minWidth: '40px', maxWidth: '90px',
                      height: '8px', borderRadius: '4px',
                      background: c.hex,
                      boxShadow: `0 0 8px ${c.hex}55`,
                    }}
                  />
                ))}
              </div>

              {/* Description */}
              <p style={{
                fontSize: isMobile ? '0.88rem' : '0.93rem',
                color: COLORS.silver, lineHeight: 1.7,
                fontFamily: FONTS.body, margin: 0,
              }}>
                {tr ? section.descTr : section.descEn}
              </p>
            </div>

            {/* ── Color items — premium accordion rows ── */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {section.colors.map((c, ci) => {
                const key = `${si}-${ci}`;
                const isOpen = expandedItem === key;
                return (
                  <div
                    key={ci}
                    style={{
                      borderBottom: ci < section.colors.length - 1 ? `1px solid rgba(255,255,255,0.04)` : 'none',
                      borderLeft: `3px solid ${isOpen ? c.hex : 'transparent'}`,
                      transition: 'border-left-color 0.2s',
                    }}
                  >
                    {/* Row */}
                    <button className="mq-box"
                      onClick={() => setExpandedItem(isOpen ? null : key)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '14px',
                        width: '100%', '--pt-d': "14px", '--pt-m': "12px", '--pr-d': "20px", '--pr-m': "14px", '--pb-d': "14px", '--pb-m': "12px", '--pl-d': "20px", '--pl-m': "14px",
                        background: isOpen ? `${c.hex}0F` : 'transparent',
                        border: 'none', cursor: 'pointer', textAlign: 'left',
                        transition: 'background 0.18s, transform 0.18s',
                        fontFamily: FONTS.body,
                      }}
                      onMouseEnter={e => {
                        if (!isOpen && !isMobile) {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.025)';
                        }
                      }}
                      onMouseLeave={e => {
                        if (!isOpen) e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      {/* Larger color swatch — premium feel */}
                      <div style={{
                        width: '24px', height: '24px', borderRadius: RADIUS.full,
                        background: c.hex,
                        border: c.hex === '#FFFFFF' || c.hex === KURANI_COLORS.beyazSaf ? '1px solid rgba(0,0,0,0.25)' : '1px solid rgba(255,255,255,0.12)',
                        boxShadow: `0 0 0 3px rgba(0,0,0,0.35), 0 0 14px ${c.hex}77`,
                        flexShrink: 0,
                      }} />

                      {/* Name */}
                      <span style={{
                        flex: 1,
                        fontSize: isMobile ? '0.85rem' : '0.92rem',
                        color: COLORS.offWhite, fontWeight: 600,
                      }}>
                        {tr ? c.nameTr : c.nameEn}
                      </span>

                      {/* Hapax chip — moved inline next to name */}
                      {c.isHapax && (
                        <span style={{
                          fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.06em',
                          color: COLORS.purple, fontFamily: FONTS.body,
                          background: 'rgba(139,92,246,0.13)',
                          padding: '2px 8px', borderRadius: RADIUS.pillSm,
                          border: '1px solid rgba(139,92,246,0.3)',
                          flexShrink: 0,
                        }}>
                          {tr ? 'HAPAX' : 'HAPAX'}
                        </span>
                      )}

                      {/* Verse ref */}
                      <span style={{
                        fontSize: '0.72rem', color: COLORS.gold,
                        opacity: 0.78, flexShrink: 0, fontWeight: 500,
                      }}>
                        {c.ref}
                      </span>

                      {/* Chevron */}
                      <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={isOpen ? c.hex : COLORS.silver} strokeWidth="2.5" strokeLinecap="round"
                        style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s, stroke 0.2s', flexShrink: 0 }}>
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>

                    {/* Expanded verse panel — gold-accented card-within-card */}
                    {isOpen && (
                      <div className="mq-box" style={{
                        '--pt-d': "18px", '--pt-m': "14px", '--pr-d': "24px", '--pr-m': "14px", '--pb-d': "22px", '--pb-m': "18px", '--pl-d': "24px", '--pl-m': "14px",
                        background: `linear-gradient(180deg, ${c.hex}10 0%, rgba(0,0,0,0.28) 60%, rgba(0,0,0,0.28) 100%)`,
                        borderTop: `1px solid ${COLORS.glassBg}`,
                      }}>
                        {/* Arabic verse — elevated card */}
                        <div className="mq-box" style={{
                          '--pt-d': "18px", '--pt-m': "14px", '--pr-d': "22px", '--pr-m': "14px", '--pb-d': "18px", '--pb-m': "14px", '--pl-d': "22px", '--pl-m': "14px",
                          background: 'rgba(0,0,0,0.35)',
                          border: `1px solid ${COLORS.goldAlpha20 || 'rgba(212,165,116,0.2)'}`,
                          borderRadius: RADIUS.md,
                          marginBottom: '14px',
                          boxShadow: `inset 0 0 24px ${c.hex}10`,
                        }}>
                          <p style={{
                            fontFamily: FONTS.quran,
                            fontSize: isMobile ? '1.55rem' : '1.85rem',
                            color: COLORS.gold,
                            textAlign: 'right', direction: 'rtl',
                            lineHeight: 2, margin: 0,
                          }} lang="ar" dir="rtl">
                            {cleanArabicForDisplay(c.verseAr)}
                          </p>
                        </div>

                        {/* Translation */}
                        <p style={{
                          fontFamily: FONTS.body,
                          fontSize: isMobile ? '0.92rem' : '0.95rem',
                          color: COLORS.offWhite, fontStyle: 'italic',
                          margin: '0 0 12px', lineHeight: 1.75,
                        }}>
                          "{tr ? c.verseTr : c.verseEn}"
                        </p>

                        {/* Verse ref — small badge */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                          <div style={{
                            width: '6px', height: '6px', borderRadius: '50%',
                            background: COLORS.gold, opacity: 0.6,
                          }} />
                          <span style={{
                            fontSize: '0.78rem', fontWeight: 600,
                            color: COLORS.gold, opacity: 0.85,
                            letterSpacing: '0.04em',
                          }}>
                            {c.ref}
                          </span>
                        </div>

                        {/* Linguistic note */}
                        <p style={{
                          fontFamily: FONTS.body,
                          fontSize: isMobile ? '0.88rem' : '0.92rem',
                          color: COLORS.silver, margin: 0,
                          lineHeight: 1.75,
                          paddingLeft: '14px',
                          borderLeft: `2px solid ${c.hex}55`,
                        }}>
                          {tr ? c.noteTr : c.noteEn}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TabCennet({ language, isMobile }) {
  const tr = language === 'tr';

  const swatches = [
    { hex: KURANI_COLORS.yesilYaprak, labelTr: 'Yeşil',      labelEn: 'Green',      noteTr: 'Elbiseler',   noteEn: 'Garments' },
    { hex: KURANI_COLORS.altin, labelTr: 'Altın',       labelEn: 'Gold',       noteTr: 'Bilezikler',  noteEn: 'Bracelets' },
    { hex: KURANI_COLORS.gumusGri, labelTr: 'Gümüş',       labelEn: 'Silver',     noteTr: 'Kaplar',      noteEn: 'Vessels' },
    { hex: KURANI_COLORS.yesilKoyu, labelTr: 'Koyu Yeşil',  labelEn: 'Dark Green', noteTr: 'Bahçeler',    noteEn: 'Gardens' },
    { hex: KURANI_COLORS.beyazSaf, labelTr: 'Beyaz',       labelEn: 'White',      noteTr: 'Süt nehri',   noteEn: 'Milk river', implied: true },
    { hex: '#C8A832', labelTr: 'Bal/Krem',    labelEn: 'Honey/Cream',noteTr: 'Bal nehri',   noteEn: 'Honey river', implied: true },
  ];

  const analyses = [
    {
      ref: 'Kehf 18:31',
      themeColor: KURANI_COLORS.yesilYaprak,  // emerald — yeşil elbise teması
      themeTr: 'Yeşil elbise',
      themeEn: 'Green garments',
      verseAr: 'يَلْبَسُونَ ثِيَابًا خُضْرًا مِّن سُندُسٍ وَإِسْتَبْرَقٍ',
      verseTr: 'İnce ipekten yeşil elbiseler giyerler.',
      verseEn: 'They wear green garments of fine silk and brocade.',
      noteTr: "Cennetin 3 unsuru bir ayette: yeşil elbise + altın bilezik + taht (Kehf 18:31). Altın bilezik cennet tasvirinde üç sûrede geçer: Kehf, Hac, Fâtır.",
      noteEn: "Three elements of paradise in one verse: green garment + gold bracelet + throne (Al-Kahf 18:31). Gold bracelets recur in three suras' paradise imagery: Al-Kahf, Al-Hajj, Fatir.",
    },
    {
      ref: 'Rahman 55:64',
      themeColor: KURANI_COLORS.yesilKoyu,  // koyu yeşil — mudhammatân
      themeTr: 'Koyu yoğun yeşil',
      themeEn: 'Intensely dark green',
      verseAr: 'مُدْهَامَّتَانِ',
      verseTr: 'İkisi de koyu yemyeşil.',
      verseEn: 'Both of them are intensely dark green.',
      noteTr: "'Mudhammatân' — bu formda Kur'an'da yalnızca bu ayette. İkili form, iki cennet bahçesini tanımlar. Yeşilin o kadar yoğun olduğu ki neredeyse siyaha döndüğü ton — cennette 'extra yeşil.'",
      noteEn: "'Mudhammatân' — appears only in this verse in this form. Dual, describing the two paradise gardens. Green so intense it borders on black — paradise's 'extra green.'",
      isHapax: true,
    },
    {
      ref: 'İnsan 76:15-16',
      themeColor: KURANI_COLORS.gumusGri,  // gümüş
      themeTr: 'Gümüşten billur',
      themeEn: 'Crystal of silver',
      verseAr: 'وَيُطَافُ عَلَيْهِم بِآنِيَةٍ مِّن فِضَّةٍ وَأَكْوَابٍ كَانَتْ قَوَارِيرَا ۝ قَوَارِيرَ مِن فِضَّةٍ',
      verseTr: 'Gümüşten kaplar ve billur kadehlerle dolaşılır — gümüşten billur.',
      verseEn: 'Silver vessels and crystal cups circulate among them — crystal of silver.',
      noteTr: "'Gümüşten billur' — billurın şeffaflığında gümüş. İki malzemenin özelliği tek nesnede. Kur'an'ın cennet dilinin en özgün malzeme tasviri.",
      noteEn: "'Crystal of silver' — silver's sheen with crystal's transparency. Two material properties in one object. The Quran's most distinctive material description in paradise language.",
    },
  ];

  const ACCENT = KURANI_COLORS.yesilYaprak; // emerald — paradise accent
  const directCount = swatches.filter(s => !s.implied).length;
  const impliedCount = swatches.filter(s => s.implied).length;

  return (
    <div>
      {/* ── Hero callout ── */}
      <div className="mq-box" style={{
        background: `linear-gradient(135deg, ${ACCENT}10 0%, rgba(184,134,11,0.06) 50%, transparent 100%)`,
        border: `1px solid ${ACCENT}33`,
        borderRadius: RADIUS.lg,
        '--pt-d': "24px", '--pt-m': "18px", '--pr-d': "28px", '--pr-m': "16px", '--pb-d': "24px", '--pb-m': "18px", '--pl-d': "28px", '--pl-m': "16px",
        marginBottom: '28px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Top accent glow */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
          background: `linear-gradient(90deg, transparent, ${ACCENT}, transparent)`,
          opacity: 0.7,
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <span style={{
            fontSize: '0.66rem', fontWeight: 700, letterSpacing: '0.22em',
            color: ACCENT, textTransform: 'uppercase', fontFamily: FONTS.body,
          }}>
            {tr ? 'Cennet Paleti' : 'Paradise Palette'}
          </span>
          <div style={{ flex: 1, height: '1px', background: `linear-gradient(90deg, ${ACCENT}55, transparent)` }} />
        </div>

        <h3 style={{
          fontFamily: FONTS.display,
          fontSize: isMobile ? '1.3rem' : '1.6rem',
          color: COLORS.offWhite, fontWeight: 700,
          margin: '0 0 12px', lineHeight: 1.3,
        }}>
          {tr ? 'Serin, Sakin, Sade — Cennetin Üslubu' : 'Cool, Calm, Spare — The Aesthetic of Paradise'}
        </h3>

        <p style={{
          fontSize: isMobile ? '0.92rem' : '0.96rem',
          color: COLORS.silver, lineHeight: 1.75,
          fontFamily: FONTS.body, margin: 0,
        }}>
          {tr
            ? "Kur'an cennetin renklerini doğrudan adlandırmaz — nesneler aracılığıyla verir. Cennet tasvirinde ısınma tonları (kırmızı, turuncu) yoktur; serin ve sakin tonlar (yeşil, gümüş) ağırlıkta."
            : "The Quran doesn't name paradise colors directly — it gives color through objects. Warm tones (red, orange) are absent; cool, calm tones (green, silver) dominate."}
        </p>

        {/* Stat strip */}
        <div style={{ display: 'flex', gap: '20px', marginTop: '18px', flexWrap: 'wrap' }}>
          {[
            { value: directCount, labelTr: 'Doğrudan renk', labelEn: 'Direct colors' },
            { value: impliedCount, labelTr: 'İma edilen', labelEn: 'Implied' },
            { value: '0', labelTr: 'Sıcak ton', labelEn: 'Warm tones' },
          ].map((stat, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{
                fontSize: '1.4rem', fontFamily: FONTS.display, fontWeight: 800,
                color: ACCENT, lineHeight: 1,
              }}>
                {stat.value}
              </span>
              <span style={{
                fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.1em',
                color: COLORS.silver, textTransform: 'uppercase', fontFamily: FONTS.body,
              }}>
                {tr ? stat.labelTr : stat.labelEn}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Premium swatch grid ── */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          marginBottom: '14px',
        }}>
          <div style={{ flex: 1, height: '1px', background: `linear-gradient(90deg, transparent, ${ACCENT}55, transparent)` }} />
          <span style={{
            fontSize: '0.66rem', fontWeight: 700, letterSpacing: '0.22em',
            color: ACCENT, textTransform: 'uppercase', fontFamily: FONTS.body, opacity: 0.9,
          }}>
            {tr ? 'Palet' : 'Palette'}
          </span>
          <div style={{ flex: 1, height: '1px', background: `linear-gradient(90deg, transparent, ${ACCENT}55, transparent)` }} />
        </div>

        <div className="g-2-3" style={{ display: 'grid', gap: '12px' }}>
          {swatches.map((s, i) => (
            <div
              key={i}
              style={{
                background: 'rgba(255,255,255,0.025)',
                border: `1px solid ${s.implied ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.09)'}`,
                borderRadius: RADIUS.md,
                overflow: 'hidden',
                transition: `all ${TRANSITION.normal}`,
                cursor: 'default',
              }}
              onMouseEnter={e => { if (!isMobile) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = `${s.hex}55`; } }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = s.implied ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.09)'; }}
            >
              {/* Color block — taller, with subtle glow */}
              <div style={{
                height: '52px',
                background: s.hex,
                opacity: s.implied ? 0.75 : 1,
                position: 'relative',
                boxShadow: `inset 0 -1px 0 rgba(0,0,0,0.2)`,
              }}>
                {s.implied && (
                  <div style={{
                    position: 'absolute', top: '6px', right: '8px',
                    fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.08em',
                    color: 'rgba(0,0,0,0.6)', background: 'rgba(255,255,255,0.85)',
                    padding: '2px 7px', borderRadius: RADIUS.pillSm, textTransform: 'uppercase',
                  }}>
                    {tr ? 'İma' : 'Implied'}
                  </div>
                )}
              </div>
              {/* Card body */}
              <div style={{ padding: '12px 14px' }}>
                <p style={{
                  fontSize: '0.92rem', fontWeight: 700,
                  color: COLORS.offWhite, fontFamily: FONTS.body,
                  margin: '0 0 4px',
                }}>
                  {tr ? s.labelTr : s.labelEn}
                </p>
                <p style={{
                  fontSize: '0.78rem', color: COLORS.silver,
                  fontFamily: FONTS.body, margin: 0, lineHeight: 1.5,
                }}>
                  {tr ? s.noteTr : s.noteEn}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Verse analyses — premium card-within-card ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          marginBottom: '4px',
        }}>
          <div style={{ flex: 1, height: '1px', background: `linear-gradient(90deg, transparent, ${ACCENT}55, transparent)` }} />
          <span style={{
            fontSize: '0.66rem', fontWeight: 700, letterSpacing: '0.22em',
            color: ACCENT, textTransform: 'uppercase', fontFamily: FONTS.body, opacity: 0.9,
          }}>
            {tr ? 'Ayet Analizleri' : 'Verse Analyses'}
          </span>
          <div style={{ flex: 1, height: '1px', background: `linear-gradient(90deg, transparent, ${ACCENT}55, transparent)` }} />
        </div>

        {analyses.map((a, i) => {
          const theme = a.themeColor || ACCENT;
          return (
            <div className="mq-box"
              key={i}
              style={{
                background: `linear-gradient(180deg, ${theme}10 0%, ${ACCENT}06 50%, rgba(255,255,255,0.022) 100%)`,
                border: `1px solid ${theme}33`,
                borderRadius: RADIUS.lg,
                '--pt-d': "20px", '--pt-m': "16px", '--pr-d': "22px", '--pr-m': "16px", '--pb-d': "20px", '--pb-m': "16px", '--pl-d': "22px", '--pl-m': "16px",
                position: 'relative', overflow: 'hidden',
                transition: 'transform 0.2s, border-color 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={e => {
                if (!isMobile) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.borderColor = `${theme}66`;
                  e.currentTarget.style.boxShadow = `0 8px 28px rgba(0,0,0,0.25), 0 0 24px ${theme}22`;
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = `${theme}33`;
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Left accent strip — theme color */}
              <div style={{
                position: 'absolute', top: 0, left: 0, bottom: 0, width: '3px',
                background: `linear-gradient(180deg, ${theme}, ${theme}44)`,
                boxShadow: `0 0 14px ${theme}88`,
              }} />

              {/* Header: theme swatch + ref + hapax + theme label */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
                {/* Themed color swatch */}
                <div style={{
                  width: '14px', height: '14px', borderRadius: '50%',
                  background: theme,
                  boxShadow: `0 0 14px ${theme}aa, 0 0 0 3px rgba(0,0,0,0.35)`,
                  flexShrink: 0,
                }} />
                <span style={{
                  fontSize: '0.8rem', fontWeight: 700, color: COLORS.gold,
                  fontFamily: FONTS.body, letterSpacing: '0.04em',
                }}>
                  {a.ref}
                </span>
                {(a.themeTr || a.themeEn) && (
                  <span style={{
                    fontSize: '0.72rem', color: theme, fontFamily: FONTS.body,
                    fontStyle: 'italic', fontWeight: 600,
                    padding: '2px 9px',
                    background: `${theme}15`,
                    border: `1px solid ${theme}33`,
                    borderRadius: RADIUS.pillSm,
                  }}>
                    {tr ? a.themeTr : a.themeEn}
                  </span>
                )}
                {a.isHapax && <HapaxBadge />}
              </div>

              {/* Arabic — elevated card */}
              <div className="mq-box" style={{
                '--pt-d': "18px", '--pt-m': "14px", '--pr-d': "22px", '--pr-m': "14px", '--pb-d': "18px", '--pb-m': "14px", '--pl-d': "22px", '--pl-m': "14px",
                background: 'rgba(0,0,0,0.32)',
                border: `1px solid ${COLORS.goldAlpha20 || 'rgba(212,165,116,0.2)'}`,
                borderRadius: RADIUS.md,
                marginBottom: '14px',
                boxShadow: `inset 0 0 24px ${theme}14`,
              }}>
                <p style={{
                  fontFamily: FONTS.quran,
                  fontSize: isMobile ? '1.6rem' : '1.9rem',
                  color: COLORS.gold,
                  textAlign: 'right', direction: 'rtl',
                  lineHeight: 2, margin: 0,
                }} lang="ar" dir="rtl">
                  {cleanArabicForDisplay(a.verseAr)}
                </p>
              </div>

              {/* Translation — bumped to 1rem desktop */}
              <p style={{
                fontFamily: FONTS.body,
                fontSize: isMobile ? '0.94rem' : '1rem',
                color: COLORS.offWhite, fontStyle: 'italic',
                margin: '0 0 14px', lineHeight: 1.75,
              }}>
                "{tr ? a.verseTr : a.verseEn}"
              </p>

              {/* Linguistic note — themed left border */}
              <p style={{
                fontFamily: FONTS.body,
                fontSize: isMobile ? '0.88rem' : '0.92rem',
                color: COLORS.silver, margin: 0,
                lineHeight: 1.75,
                paddingLeft: '14px',
                borderLeft: `2px solid ${theme}66`,
              }}>
                {tr ? a.noteTr : a.noteEn}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TabKiyamet({ language, isMobile }) {
  const tr = language === 'tr';
  const WHITE_FACE = KURANI_COLORS.beyazFildisi;

  const scenes = [
    {
      titleTr: 'Gökyüzünün Kırmızıya Dönmesi',
      titleEn: "The Sky's Transformation to Red",
      verseAr: 'فَإِذَا انشَقَّتِ السَّمَاءُ فَكَانَتْ وَرْدَةً كَالدِّهَانِ',
      verseTr: 'Gök yarıldığında kırmızı deri gibi, erimiş yağ gibi olacak.',
      verseEn: 'And when the sky breaks apart and becomes rose-red like oil.',
      ref: 'Rahman 55:37',
      hex: KURANI_COLORS.kirmiziKan,
      noteTr: "Kıyametin sinematik açılış sahnesi. 'Dihân' — erimiş yağ veya kırmızı deri. Gökyüzünün hem eriyip hem kızarması: iki algı bir imgede.",
      noteEn: "The cinematic opening of judgment. 'Dihan' — molten oil or red leather. The sky simultaneously melting and reddening: two perceptions in one image.",
      infoTr: "'Dihân' kelimesinin tam anlamı tartışmalı: kırmızı yağ mı, kırmızı deri mi, kırmızı boya mı?",
      infoEn: "The exact meaning of 'dihan' is debated: red oil? Red leather? Red dye?",
    },
    {
      titleTr: 'Yüzlerin Ağarması ve Kararmasi',
      titleEn: 'Faces Whitening and Blackening',
      verseAr: 'يَوْمَ تَبْيَضُّ وُجُوهٌ وَتَسْوَدُّ وُجُوهٌ',
      verseTr: 'Yüzlerin ağardığı ve yüzlerin karardığı gün…',
      verseEn: 'The Day when faces will turn white and faces will turn black…',
      ref: 'Al-i İmran 3:106',
      hex: KURANI_COLORS.beyazFildisi,
      noteTr: "Beyaz-siyah yüz zıtlığı tek ayette (3:106-107). İç halin dışa renk olarak yansıması. Müfessirlerin büyük çoğunluğu fiziksel değil, metaforik okur.",
      noteEn: "White-black face contrast in one verse (3:106-107). The inner state manifested outwardly as color. Most commentators read it metaphorically, not literally.",
      infoTr: "Yüzlerin 'ağarması' ve 'kararması' fiziksel mi, ruhsal hal mi? Müfessirler arasında görüş ayrılığı.",
      infoEn: "Are the whitening/blackening of faces physical or a manifestation of spiritual state? Commentators disagree.",
    },
    {
      titleTr: "Gözlerin Donuklaşması / Mavileşmesi",
      titleEn: 'Eyes Glazing / Turning Blue',
      verseAr: 'وَنَحْشُرُ الْمُجْرِمِينَ يَوْمَئِذٍ زُرْقًا',
      verseTr: 'O gün suçluları gözleri donuk/mavimsi olarak haşrederiz.',
      verseEn: 'We will gather the criminals that Day, blue-eyed / glazed.',
      ref: 'Taha 20:102',
      hex: KURANI_COLORS.maviDonuk,
      noteTr: "'Zurk' — hem mavi hem donuk/bulanık anlamına gelir. Kıyamette suçluların gözleri mi mavileşiyor, yoksa korkudan donup mu kalıyor? İki yorum da dilbilimsel olarak mümkün.",
      noteEn: "'Zurq' — means both blue and glazed/dull. Are criminals' eyes turning blue, or freezing with terror? Both interpretations are linguistically valid.",
      infoTr: "'Zurk' kelimesinin anlamı tartışmalı: mavi gözlü mü, donuk gözlü mü, körlük mu? Müfessirler arasında görüş ayrılığı mevcuttur.",
      infoEn: "'Zurq' meaning disputed: blue-eyed? Glazed? Blind? There is scholarly disagreement.",
    },
    {
      titleTr: 'Toz ve Karanlık',
      titleEn: 'Dust and Darkness',
      verseAr: 'وَوُجُوهٌ يَوْمَئِذٍ عَلَيْهَا غَبَرَةٌ ۝ تَرْهَقُهَا قَتَرَةٌ',
      verseTr: "O gün kimi yüzler tozlanmış, kararma bürümüş.",
      verseEn: 'And some faces that Day will be covered with dust — darkness overwhelming them.',
      ref: 'Abese 80:40-41',
      hex: '#374151',
      noteTr: "Abese 80:38-41 dört sıfatla iki grubu karşılaştırır: parlak + gülen (kurtulanlar) vs tozlanmış + karartan (kayıp). Renk ve ışık Kur'an'ın kıyamet dilinde simetrik kullanılır.",
      noteEn: "Al-Abasa 80:38-41 contrasts two groups with four attributes: bright + laughing (saved) vs dusty + darkened (lost). Color and light are used symmetrically in the Quran's judgment language.",
    },
  ];

  const BLACK_FACE = KURANI_COLORS.siyahKaranlik;

  return (
    <div>
      {/* ── Bipolar contrast hero ── */}
      <div className="mq-box" style={{
        background: `linear-gradient(135deg, ${WHITE_FACE}10 0%, transparent 45%, ${BLACK_FACE}30 100%)`,
        border: `1px solid ${COLORS.glassBorder}`,
        borderRadius: RADIUS.lg,
        '--pt-d': "24px", '--pt-m': "18px", '--pr-d': "28px", '--pr-m': "16px", '--pb-d': "24px", '--pb-m': "18px", '--pl-d': "28px", '--pl-m': "16px",
        marginBottom: '28px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Top accent strip — bipolar gradient */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
          background: `linear-gradient(90deg, ${WHITE_FACE}, transparent 50%, ${BLACK_FACE})`,
          opacity: 0.75,
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <span style={{
            fontSize: '0.66rem', fontWeight: 700, letterSpacing: '0.22em',
            color: COLORS.gold, textTransform: 'uppercase', fontFamily: FONTS.body, opacity: 0.85,
          }}>
            {tr ? 'Beyaz vs Siyah' : 'White vs Black'}
          </span>
          <div style={{ flex: 1, height: '1px', background: `linear-gradient(90deg, ${COLORS.goldAlpha25 || 'rgba(212,165,116,0.25)'}, transparent)` }} />
        </div>

        <h3 style={{
          fontFamily: FONTS.display,
          fontSize: isMobile ? '1.3rem' : '1.6rem',
          color: COLORS.offWhite, fontWeight: 700,
          margin: '0 0 16px', lineHeight: 1.3,
        }}>
          {tr ? 'Yüzlerin İki Kutbu — Renk Sınıflandırması' : 'The Two Poles of Faces — Color as Classifier'}
        </h3>

        {/* Two-pole comparison */}
        <div className="tri-col-vs" style={{
          alignItems: 'stretch',
          gap: isMobile ? '14px' : '24px',
        }}>
          {/* WHITE — saved */}
          <div style={{
            background: `linear-gradient(180deg, ${WHITE_FACE}18, ${WHITE_FACE}06)`,
            border: `1px solid ${WHITE_FACE}40`,
            borderRadius: RADIUS.md,
            padding: '18px 20px',
            textAlign: 'center',
            boxShadow: `0 0 24px ${WHITE_FACE}15`,
          }}>
            <div style={{
              width: '46px', height: '46px', margin: '0 auto 12px',
              borderRadius: '50%',
              background: WHITE_FACE,
              boxShadow: `0 0 24px ${WHITE_FACE}aa, 0 0 0 4px rgba(0,0,0,0.3)`,
            }} />
            <div style={{
              fontSize: '0.66rem', fontWeight: 700, letterSpacing: '0.16em',
              color: WHITE_FACE, fontFamily: FONTS.body, marginBottom: '6px',
              textTransform: 'uppercase',
            }}>
              {tr ? 'Kurtulanlar' : 'The Saved'}
            </div>
            <div style={{
              fontSize: '1.05rem', fontWeight: 700,
              color: COLORS.offWhite, fontFamily: FONTS.body, marginBottom: '8px',
            }}>
              {tr ? 'Yüzleri Ağarır' : 'Faces Turn White'}
            </div>
            <span style={{
              fontSize: '0.75rem', color: COLORS.gold, opacity: 0.75,
              fontFamily: FONTS.body, fontWeight: 500, letterSpacing: '0.03em',
            }}>
              Âl-i İmrân 3:107
            </span>
          </div>

          {/* VS divider */}
          {!isMobile && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <div style={{ width: '1px', flex: 1, background: `linear-gradient(180deg, transparent, ${COLORS.goldAlpha25 || 'rgba(212,165,116,0.25)'}, transparent)` }} />
              <span style={{
                fontSize: '0.7rem', fontWeight: 700, color: COLORS.gold,
                fontFamily: FONTS.display, fontStyle: 'italic', letterSpacing: '0.1em',
              }}>
                ✦
              </span>
              <div style={{ width: '1px', flex: 1, background: `linear-gradient(180deg, transparent, ${COLORS.goldAlpha25 || 'rgba(212,165,116,0.25)'}, transparent)` }} />
            </div>
          )}

          {/* BLACK — lost (Option A: saturated indigo + inset burn shadow) */}
          <div style={{
            background: `linear-gradient(180deg, ${BLACK_FACE}E0 0%, ${BLACK_FACE}90 45%, rgba(0,0,0,0.55) 100%)`,
            border: `1px solid ${BLACK_FACE}AA`,
            borderRadius: RADIUS.md,
            padding: '18px 20px',
            textAlign: 'center',
            boxShadow: `0 0 28px rgba(0,0,0,0.55), inset 0 0 36px rgba(0,0,0,0.55)`,
          }}>
            <div style={{
              width: '46px', height: '46px', margin: '0 auto 12px',
              borderRadius: '50%',
              background: '#000000',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: `0 0 22px rgba(40,40,60,0.7), 0 0 0 4px rgba(0,0,0,0.4)`,
            }} />
            <div style={{
              fontSize: '0.66rem', fontWeight: 700, letterSpacing: '0.16em',
              color: COLORS.silver, fontFamily: FONTS.body, marginBottom: '6px',
              textTransform: 'uppercase',
            }}>
              {tr ? 'Kaybedenler' : 'The Lost'}
            </div>
            <div style={{
              fontSize: '1.05rem', fontWeight: 700,
              color: COLORS.offWhite, fontFamily: FONTS.body, marginBottom: '8px',
            }}>
              {tr ? 'Yüzleri Kararır' : 'Faces Turn Black'}
            </div>
            <span style={{
              fontSize: '0.75rem', color: COLORS.gold, opacity: 0.75,
              fontFamily: FONTS.body, fontWeight: 500, letterSpacing: '0.03em',
            }}>
              Zümer 39:60
            </span>
          </div>
        </div>
      </div>

      {/* ── Narrative timeline — cinematic sequence of 4 scenes ── */}
      <div className="mq-box" style={{
        background: 'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(255,255,255,0.018) 100%)',
        border: `1px solid ${COLORS.glassBorder}`,
        borderRadius: RADIUS.lg,
        '--pt-d': "22px", '--pt-m': "14px", '--pr-d': "28px", '--pr-m': "14px", '--pb-d': "18px", '--pb-m': "16px", '--pl-d': "28px", '--pl-m': "14px",
        marginBottom: '20px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Top accent */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
          background: `linear-gradient(90deg, transparent, ${COLORS.goldAlpha25 || 'rgba(212,165,116,0.25)'}, transparent)`,
          opacity: 0.6,
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <span style={{
            fontSize: '0.66rem', fontWeight: 700, letterSpacing: '0.22em',
            color: COLORS.gold, textTransform: 'uppercase', fontFamily: FONTS.body, opacity: 0.85,
          }}>
            {tr ? 'Sinematik Sıra' : 'Cinematic Sequence'}
          </span>
          <div style={{ flex: 1, height: '1px', background: `linear-gradient(90deg, ${COLORS.goldAlpha25 || 'rgba(212,165,116,0.25)'}, transparent)` }} />
        </div>

        {/* Timeline backbone + markers */}
        <div className="mq-box" style={{ position: 'relative', '--pt-d': "18px", '--pt-m': "6px", '--pr-d': "0", '--pr-m': "0", '--pb-d': "8px", '--pb-m': "6px", '--pl-d': "0", '--pl-m': "0" }}>
          {/* Gradient backbone — horizontal desktop / vertical mobile */}
          <motion.div
            initial={{ scaleX: isMobile ? 1 : 0, scaleY: isMobile ? 0 : 1, opacity: 0 }}
            animate={{ scaleX: 1, scaleY: 1, opacity: 1 }}
            transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
            style={{
              position: 'absolute',
              ...(isMobile
                ? { left: '20px', top: '20px', bottom: '20px', width: '3px', transformOrigin: 'top center' }
                : { left: '4%', right: '4%', top: '38px', height: '3px', transformOrigin: 'left center' }),
              background: `linear-gradient(${isMobile ? '180deg' : '90deg'}, ${scenes[0].hex} 0%, ${scenes[1].hex} 35%, ${scenes[2].hex} 70%, ${scenes[3].hex} 100%)`,
              borderRadius: '3px',
              boxShadow: `0 0 14px ${scenes[0].hex}55, 0 0 26px ${scenes[3].hex}33`,
              zIndex: 1,
            }}
          />

          {/* Markers — color dots + labels */}
          <div className="fd-row" style={{
            position: 'relative', zIndex: 2,
            display: 'flex',
            alignItems: isMobile ? 'stretch' : 'flex-start',
            justifyContent: isMobile ? 'flex-start' : 'space-between',
            gap: isMobile ? '20px' : '10px',
          }}>
            {scenes.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.25 + i * 0.18, ease: [0.4, 0, 0.2, 1] }}
                className="fd-col-reverse"
                style={{
                  display: 'flex',
                  alignItems: isMobile ? 'flex-start' : 'center',
                  gap: isMobile ? '14px' : '8px',
                  flex: isMobile ? 'unset' : 1,
                  maxWidth: isMobile ? 'none' : '180px',
                  textAlign: isMobile ? 'left' : 'center',
                }}
              >
                {/* Color marker */}
                <div style={{
                  width: '34px', height: '34px',
                  borderRadius: RADIUS.full,
                  background: s.hex,
                  border: '2px solid rgba(255,255,255,0.16)',
                  boxShadow: `0 0 0 4px rgba(0,0,0,0.45), 0 0 22px ${s.hex}99`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: FONTS.display, fontSize: '0.78rem', fontWeight: 800,
                  color: 'rgba(255,255,255,0.92)',
                  flexShrink: 0,
                }}>
                  {i + 1}
                </div>
                {/* Label */}
                <div style={{
                  display: 'flex', flexDirection: 'column', gap: '2px',
                  flex: isMobile ? 1 : 'unset',
                }}>
                  <span style={{
                    fontSize: '0.72rem', fontWeight: 700,
                    color: COLORS.offWhite, fontFamily: FONTS.body,
                    letterSpacing: '0.02em', lineHeight: 1.35,
                  }}>
                    {tr ? s.titleTr : s.titleEn}
                  </span>
                  <span style={{
                    fontSize: '0.66rem', color: COLORS.silver,
                    fontFamily: FONTS.body, opacity: 0.78,
                  }}>
                    {s.ref}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Scene cards — premium ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
          <div style={{ flex: 1, height: '1px', background: `linear-gradient(90deg, transparent, ${COLORS.goldAlpha25 || 'rgba(212,165,116,0.25)'}, transparent)` }} />
          <span style={{
            fontSize: '0.66rem', fontWeight: 700, letterSpacing: '0.22em',
            color: COLORS.gold, textTransform: 'uppercase', fontFamily: FONTS.body, opacity: 0.9,
          }}>
            {tr ? '4 Sahne — Detay' : '4 Scenes — Detail'}
          </span>
          <div style={{ flex: 1, height: '1px', background: `linear-gradient(90deg, transparent, ${COLORS.goldAlpha25 || 'rgba(212,165,116,0.25)'}, transparent)` }} />
        </div>

        {scenes.map((s, i) => (
          <div className="mq-box"
            key={i}
            style={{
              background: `linear-gradient(180deg, ${s.hex}10 0%, rgba(255,255,255,0.022) 65%)`,
              border: `1px solid ${s.hex}33`,
              borderRadius: RADIUS.lg,
              '--pt-d': "20px", '--pt-m': "16px", '--pr-d': "22px", '--pr-m': "16px", '--pb-d': "20px", '--pb-m': "16px", '--pl-d': "22px", '--pl-m': "16px",
              position: 'relative', overflow: 'hidden',
            }}
          >
            {/* Left accent strip */}
            <div style={{
              position: 'absolute', top: 0, left: 0, bottom: 0, width: '3px',
              background: `linear-gradient(180deg, ${s.hex}, ${s.hex}44)`,
              boxShadow: `0 0 12px ${s.hex}88`,
            }} />

            {/* Title row: dot + title + info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
              <div style={{
                width: '12px', height: '12px', borderRadius: '50%',
                background: s.hex,
                boxShadow: `0 0 12px ${s.hex}aa, 0 0 0 3px rgba(0,0,0,0.35)`,
                flexShrink: 0,
              }} />
              <span style={{
                fontSize: isMobile ? '0.96rem' : '1.04rem',
                fontWeight: 700, color: COLORS.offWhite, fontFamily: FONTS.body,
                letterSpacing: '0.01em', lineHeight: 1.4, flex: 1,
              }}>
                {tr ? s.titleTr : s.titleEn}
              </span>
              {(s.infoTr || s.infoEn) && <InfoPopover text={tr ? s.infoTr : s.infoEn} />}
            </div>

            {/* Arabic — elevated card */}
            <div className="mq-box" style={{
              '--pt-d': "18px", '--pt-m': "14px", '--pr-d': "22px", '--pr-m': "14px", '--pb-d': "18px", '--pb-m': "14px", '--pl-d': "22px", '--pl-m': "14px",
              background: 'rgba(0,0,0,0.32)',
              border: `1px solid ${COLORS.goldAlpha20 || 'rgba(212,165,116,0.2)'}`,
              borderRadius: RADIUS.md,
              marginBottom: '14px',
              boxShadow: `inset 0 0 24px ${s.hex}12`,
            }}>
              <p style={{
                fontFamily: FONTS.quran,
                fontSize: isMobile ? '1.6rem' : '1.9rem',
                color: COLORS.gold,
                textAlign: 'right', direction: 'rtl',
                lineHeight: 2, margin: 0,
              }} lang="ar" dir="rtl">
                {cleanArabicForDisplay(s.verseAr)}
              </p>
            </div>

            {/* Translation + ref */}
            <p style={{
              fontFamily: FONTS.body,
              fontSize: isMobile ? '0.92rem' : '0.95rem',
              color: COLORS.offWhite, fontStyle: 'italic',
              margin: '0 0 10px', lineHeight: 1.75,
            }}>
              "{tr ? s.verseTr : s.verseEn}"
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: s.hex, opacity: 0.8 }} />
              <span style={{
                fontSize: '0.78rem', fontWeight: 600,
                color: COLORS.gold, opacity: 0.82,
                letterSpacing: '0.04em',
              }}>
                {s.ref}
              </span>
            </div>

            {/* Linguistic note */}
            <p style={{
              fontFamily: FONTS.body,
              fontSize: isMobile ? '0.88rem' : '0.92rem',
              color: COLORS.silver, margin: 0,
              lineHeight: 1.75,
              paddingLeft: '14px',
              borderLeft: `2px solid ${s.hex}66`,
            }}>
              {tr ? s.noteTr : s.noteEn}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function TabDilbilim({ language, isMobile }) {
  const tr = language === 'tr';

  // Premium section wrapper — reusable across all 5 sections
  const SectionShell = ({ letter, accent, eyebrowTr, eyebrowEn, titleTr, titleEn, descTr, descEn, children }) => (
    <div style={{
      background: `linear-gradient(180deg, ${accent}0E 0%, rgba(255,255,255,0.022) 30%, rgba(255,255,255,0.022) 100%)`,
      border: `1px solid ${COLORS.glassBorder}`,
      borderRadius: RADIUS.lg,
      overflow: 'hidden',
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
        background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
        opacity: 0.65, pointerEvents: 'none',
      }} />
      {/* Header */}
      <div className="mq-box" style={{
        '--pt-d': "22px", '--pt-m': "18px", '--pr-d': "24px", '--pr-m': "16px", '--pb-d': "16px", '--pb-m': "14px", '--pl-d': "24px", '--pl-m': "16px",
        borderBottom: `1px solid ${COLORS.glassBg}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
          {/* Letter badge */}
          <div style={{
            width: '32px', height: '32px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${accent}30, ${accent}10)`,
            border: `1px solid ${accent}55`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: FONTS.display, fontSize: '0.92rem', fontWeight: 800,
            color: accent,
            boxShadow: `0 0 14px ${accent}33`,
            flexShrink: 0,
          }}>
            {letter}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: 0 }}>
            <span style={{
              fontSize: '0.66rem', fontWeight: 700, letterSpacing: '0.2em',
              color: accent, textTransform: 'uppercase', fontFamily: FONTS.body,
            }}>
              {tr ? eyebrowTr : eyebrowEn}
            </span>
            <h3 style={{
              fontFamily: FONTS.display,
              fontSize: isMobile ? '1.05rem' : '1.18rem',
              color: COLORS.offWhite, fontWeight: 700,
              margin: 0, lineHeight: 1.35,
            }}>
              {tr ? titleTr : titleEn}
            </h3>
          </div>
        </div>
        {(descTr || descEn) && (
          <p style={{
            fontSize: isMobile ? '0.88rem' : '0.92rem',
            color: COLORS.silver, lineHeight: 1.7,
            fontFamily: FONTS.body, margin: '8px 0 0',
          }}>
            {tr ? descTr : descEn}
          </p>
        )}
      </div>
      {/* Body */}
      <div className="mq-box" style={{ '--pt-d': "18px", '--pt-m': "14px", '--pr-d': "24px", '--pr-m': "14px", '--pb-d': "22px", '--pb-m': "18px", '--pl-d': "24px", '--pl-m': "14px" }}>
        {children}
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>

      {/* ── Section A: Renk Yoğunluğu Kelimeleri ── */}
      <SectionShell
        letter="A"
        accent={COLORS.purple}
        eyebrowTr="Renk Yoğunluğu" eyebrowEn="Color Intensity"
        titleTr="Normal vs Yoğun — Kur'an'ın İki Renk Sicili"
        titleEn="Normal vs Intense — The Quran's Two Color Registers"
        descTr="Kur'an normal ve yoğun renk için farklı kelimeler kullanır. Bu dilbilimsel hassasiyet, Sami dilleri arasında Kur'an Arapçasının özgünlüğünü gösterir."
        descEn="The Quran uses distinct words for normal vs intense color. This linguistic precision shows the uniqueness of Quranic Arabic among Semitic languages."
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { normalAr: 'أَخْضَر', normalTrans: 'ahdar', intenseAr: 'مُدْهَامَّتَانِ', intenseTrans: 'mudhammatân', meaningTr: 'Yeşil → Koyu Yoğun Yeşil', meaningEn: 'Green → Intensely Dark Green', hex: KURANI_COLORS.yesilKoyu },
            { normalAr: 'أَسْوَد', normalTrans: 'esvad',  intenseAr: 'غَرَابِيبُ سُودٌ', intenseTrans: 'garâbîb sûd', meaningTr: 'Siyah → Kuzgun Siyahı', meaningEn: 'Black → Raven Black', hex: KURANI_COLORS.siyahKaranlik },
          ].map((row, i) => (
            <div key={i} className="tri-col-vs mq-box" style={{
              gap: isMobile ? '10px' : '18px',
              alignItems: 'center',
              '--pt-d': "16px", '--pt-m': "14px", '--pr-d': "18px", '--pr-m': "14px", '--pb-d': "16px", '--pb-m': "14px", '--pl-d': "18px", '--pl-m': "14px",
              background: 'rgba(255,255,255,0.025)',
              border: `1px solid ${COLORS.glassBgStrong}`,
              borderLeft: `3px solid ${row.hex}`,
              borderRadius: RADIUS.md,
            }}>
              {/* Normal */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.18em', color: COLORS.silver, textTransform: 'uppercase', fontFamily: FONTS.body }}>
                  {tr ? 'Normal' : 'Normal'}
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span style={{ fontFamily: FONTS.quran, fontSize: '1.55rem', color: COLORS.offWhite, direction: 'rtl', lineHeight: 1.3 }} lang="ar" dir="rtl">{row.normalAr}</span>
                  <span style={{ fontSize: '0.78rem', color: COLORS.silver, fontStyle: 'italic', fontFamily: FONTS.body }}>{row.normalTrans}</span>
                </div>
              </div>
              {/* Arrow */}
              {!isMobile && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: COLORS.gold, opacity: 0.75 }}>
                  <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M5 12h14M13 6l6 6-6 6"/>
                  </svg>
                </div>
              )}
              {/* Intense */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.18em', color: COLORS.purple, textTransform: 'uppercase', fontFamily: FONTS.body }}>
                    {tr ? 'Yoğun' : 'Intense'}
                  </span>
                  <HapaxBadge />
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span style={{ fontFamily: FONTS.quran, fontSize: '1.55rem', color: COLORS.gold, direction: 'rtl', lineHeight: 1.3 }} lang="ar" dir="rtl">{row.intenseAr}</span>
                  <span style={{ fontSize: '0.78rem', color: COLORS.silver, fontStyle: 'italic', fontFamily: FONTS.body }}>{row.intenseTrans}</span>
                </div>
              </div>
              {/* Meaning row spans on mobile */}
              <div className="mq-box" style={{
                gridColumn: isMobile ? '1' : '1 / -1',
                '--pt-d': '6px', '--pt-m': '8px',
                '--mt-d': '4px', '--mt-m': '4px',
                borderTop: `1px solid ${COLORS.glassBg}`,
                fontSize: '0.85rem',
                color: COLORS.silver, fontFamily: FONTS.body,
                fontStyle: 'italic',
              }}>
                {tr ? row.meaningTr : row.meaningEn}
              </div>
            </div>
          ))}
        </div>
      </SectionShell>

      {/* ── Section B: Hapax Renk Kelimeleri ── */}
      <SectionShell
        letter="B"
        accent={COLORS.purple}
        eyebrowTr="Hapax Legomena" eyebrowEn="Hapax Legomena"
        titleTr="Bir Kez Geçen Kelimeler — Kur'an'da İz"
        titleEn="Once-Spoken Words — Traces in the Quran"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            {
              arabic: 'مُدْهَامَّتَانِ', transliteration: 'mudhammatân',
              ref: 'Rahman 55:64',
              formTr: 'İkili, sıfat', formEn: 'Dual adjective',
              noteTr: "Bu formda Kur'an'da yalnızca bir kez — gerçek bir hapax legomenon. İki cennet bahçesini tanımlar, kökü 'd-h-m' (siyaha çalan koyu ton).",
              noteEn: "Appears only once in the Quran in this form — a true hapax legomenon. Describes two paradise gardens, root 'd-h-m' (dark shade tending to black).",
            },
            {
              arabic: 'كَالدِّهَانِ', transliteration: 'ka-d-dihân',
              ref: 'Rahman 55:37',
              formTr: 'Teşbih (benzetme)', formEn: 'Simile',
              noteTr: "Kıyamette gökyüzünün rengi — erimiş kırmızı yağa benzetme. Bu formda nadir.",
              noteEn: "The color of the sky at judgment — compared to melted red oil. Rare in this form.",
            },
          ].map((h, i) => (
            <div className="mq-box" key={i} style={{
              background: `linear-gradient(180deg, rgba(139,92,246,0.10) 0%, rgba(139,92,246,0.04) 60%)`,
              border: '1px solid rgba(139,92,246,0.28)',
              borderRadius: RADIUS.md,
              '--pt-d': "18px", '--pt-m': "14px", '--pr-d': "20px", '--pr-m': "14px", '--pb-d': "18px", '--pb-m': "14px", '--pl-d': "20px", '--pl-m': "14px",
              position: 'relative', overflow: 'hidden',
            }}>
              {/* Left accent */}
              <div style={{
                position: 'absolute', top: 0, left: 0, bottom: 0, width: '3px',
                background: `linear-gradient(180deg, ${COLORS.purple}, ${COLORS.purple}44)`,
                boxShadow: `0 0 10px ${COLORS.purple}88`,
              }} />

              {/* Arabic — elevated */}
              <div className="mq-box" style={{
                '--pt-d': "14px", '--pt-m': "12px", '--pr-d': "20px", '--pr-m': "14px", '--pb-d': "14px", '--pb-m': "12px", '--pl-d': "20px", '--pl-m': "14px",
                background: 'rgba(0,0,0,0.3)',
                border: `1px solid ${COLORS.goldAlpha20 || 'rgba(212,165,116,0.2)'}`,
                borderRadius: RADIUS.md,
                marginBottom: '12px',
                display: 'flex', flexDirection: 'column', gap: '6px',
                boxShadow: 'inset 0 0 16px rgba(139,92,246,0.10)',
              }}>
                <p style={{
                  fontFamily: FONTS.quran,
                  fontSize: isMobile ? '1.65rem' : '1.85rem',
                  color: COLORS.gold,
                  textAlign: 'right', direction: 'rtl', lineHeight: 1.8,
                  margin: 0,
                }} lang="ar" dir="rtl">
                  {cleanArabicForDisplay(h.arabic)}
                </p>
                <span style={{
                  fontSize: '0.78rem', color: COLORS.silver,
                  fontStyle: 'italic', fontFamily: FONTS.body,
                  textAlign: 'right', direction: 'ltr',
                }}>
                  {h.transliteration}
                </span>
              </div>

              {/* Meta row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
                <HapaxBadge />
                <span style={{
                  fontSize: '0.74rem', color: COLORS.gold, opacity: 0.82,
                  fontFamily: FONTS.body, fontWeight: 600, letterSpacing: '0.04em',
                }}>
                  {h.ref}
                </span>
                <span style={{
                  fontSize: '0.7rem', color: COLORS.silver,
                  fontFamily: FONTS.body, fontStyle: 'italic',
                  padding: '2px 8px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: RADIUS.pillSm,
                }}>
                  {tr ? h.formTr : h.formEn}
                </span>
              </div>

              {/* Linguistic note */}
              <p style={{
                fontFamily: FONTS.body,
                fontSize: isMobile ? '0.88rem' : '0.92rem',
                color: COLORS.silver, margin: 0,
                lineHeight: 1.75,
                paddingLeft: '14px',
                borderLeft: `2px solid rgba(139,92,246,0.4)`,
              }}>
                {tr ? h.noteTr : h.noteEn}
              </p>
            </div>
          ))}
        </div>
      </SectionShell>

      {/* ── Section C: 'Zurk' Tartışması ── */}
      <SectionShell
        letter="C"
        accent="#2563EB"
        eyebrowTr="Üç Yorum · Taha 20:102" eyebrowEn="Three Interpretations · Ta-Ha 20:102"
        titleTr="'Zurk' Tartışması — Mavi mi, Donuk mu, Kör mü?"
        titleEn="The 'Zurq' Debate — Blue, Glazed, or Blind?"
        descTr="'Zurk' kelimesi Arapça'da hem mavi hem donuk/bulanık anlamına gelir. Taha 20:102 bağlamında üç klasik yorum:"
        descEn="'Zurq' in Arabic means both blue and glazed/cloudy. Three classical interpretations in the context of Ta-Ha 20:102:"
      >
        <div className="g-1-3" style={{
          display: 'grid',
          gap: '12px',
        }}>
          {[
            {
              numTr: '1', titleTr: 'Mavi Gözlü', titleEn: 'Blue-eyed',
              descTr: 'Gerçek mavi göz. Arap kültüründe yabancı veya hastalık çağrışımı taşıyabilir.',
              descEn: 'Literally blue eyes. May carry connotations of foreignness or illness in Arab culture.',
              color: KURANI_COLORS.maviDonuk,
            },
            {
              numTr: '2', titleTr: 'Donuk / Bulanık Gözlü', titleEn: 'Glazed / Dull-eyed',
              descTr: 'Korkudan veya ölüm korkusundan gözler donup kalır — görme engeli.',
              descEn: "Eyes frozen from terror or fear of death — impairment of sight.",
              color: '#6B7280',
            },
            {
              numTr: '3', titleTr: 'Körlük — Perde', titleEn: 'Blindness — Veil',
              descTr: "Göz üzerinde perde — kıyamette inkârcıların dünyada kör olduğunun somutlaşması.",
              descEn: "A veil over the eyes — the disbelievers' spiritual blindness made physical at judgment.",
              color: '#374151',
            },
          ].map((v, i) => (
            <div key={i} style={{
              background: `linear-gradient(180deg, ${v.color}12 0%, rgba(255,255,255,0.022) 65%)`,
              border: `1px solid ${v.color}40`,
              borderRadius: RADIUS.md,
              padding: '16px 18px',
              position: 'relative', overflow: 'hidden',
            }}>
              {/* Number circle */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px',
              }}>
                <div style={{
                  width: '34px', height: '34px',
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${v.color}, ${v.color}88)`,
                  border: `1px solid ${v.color}`,
                  boxShadow: `0 0 16px ${v.color}66, 0 0 0 3px rgba(0,0,0,0.35)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: FONTS.display, fontSize: '0.95rem', fontWeight: 800,
                  color: COLORS.offWhite,
                  flexShrink: 0,
                }}>
                  {v.numTr}
                </div>
                <InfoPopover text={tr ? "Tefsir geleneğinde bu yorum için farklı alimler farklı gerekçeler sunar." : "Different scholars in the tafsir tradition offer different justifications for this interpretation."} />
              </div>
              <h4 style={{
                fontSize: '0.96rem', fontWeight: 700,
                color: COLORS.offWhite, fontFamily: FONTS.body,
                margin: '0 0 8px', lineHeight: 1.4,
              }}>
                {tr ? v.titleTr : v.titleEn}
              </h4>
              <p style={{
                fontSize: '0.85rem', color: COLORS.silver,
                lineHeight: 1.7, fontFamily: FONTS.body, margin: 0,
              }}>
                {tr ? v.descTr : v.descEn}
              </p>
            </div>
          ))}
        </div>
      </SectionShell>

      {/* ── Section D: Nesne Üzerinden İma Edilen Renkler ── */}
      <SectionShell
        letter="D"
        accent={COLORS.gold}
        eyebrowTr="Söylemeden Anlatmak" eyebrowEn="Showing Without Telling"
        titleTr="Nesne Üzerinden İma Edilen Renkler"
        titleEn="Colors Implied Through Objects"
        descTr="Kur'an bazen rengi doğrudan söylemez — nesneyi vererek rengi ima eder. Bu 'söylemeden anlatmak' Kur'an'ın dil ekonomisinin özelliğidir."
        descEn="The Quran sometimes doesn't state the color directly — it implies the color by naming the object. This 'showing without telling' is characteristic of Quranic language economy."
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {[
            {
              hex: '#F1F5F9',
              objectTr: 'Süt', objectEn: 'Milk',
              colorTr: 'Beyaz', colorEn: 'White',
              verseAr: 'أَنْهَارٌ مِّن لَّبَنٍ لَّمْ يَتَغَيَّرْ طَعْمُهُ',
              verseTr: '…tadı değişmeyen süt nehirleri…',
              verseEn: '…rivers of milk whose taste does not change…',
              ref: 'Muhammed 47:15',
              noteTr: "Süt beyazdır — ama Kur'an rengi söylemez. Renk, nesnenin zihinde çağrışımıyla gelir.",
              noteEn: "Milk is white — but the Quran doesn't say so. The color arrives through the object's mental association.",
            },
            {
              hex: KURANI_COLORS.sariKivilcim,
              objectTr: 'Bal', objectEn: 'Honey',
              colorTr: 'Amber / Sarı', colorEn: 'Amber / Yellow',
              verseAr: 'وَأَنْهَارٌ مِّنْ عَسَلٍ مُّصَفًّى',
              verseTr: '…ve saf baldan nehirler…',
              verseEn: '…and rivers of purified honey…',
              ref: 'Muhammed 47:15',
              noteTr: "'Musaffâ' — arındırılmış, süzülmüş. Renk adı yok; amber ton nesnenin kendisinde gizli.",
              noteEn: "'Musaffâ' — purified, filtered. No color named; the amber hue is concealed in the object itself.",
            },
            {
              hex: KURANI_COLORS.kirmiziKan,
              objectTr: 'Ateş / Alev', objectEn: 'Fire / Flame',
              colorTr: 'Kırmızı / Turuncu', colorEn: 'Red / Orange',
              verseAr: 'لَوَّاحَةٌ لِّلْبَشَرِ',
              verseTr: 'İnsanı kavuran (rengi değiştiren).',
              verseEn: 'Scorching to the skin (altering its color).',
              ref: 'Müddessir 74:29',
              noteTr: "'Levvâha' kökü renk değişikliği anlamını içerir — ateş insanın tenini kızartır ve karartır. Kırmızı/siyah ama söylenmez.",
              noteEn: "The root 'lavvâha' implies color change — fire reddens and blackens the skin. Red/black, but left unstated.",
            },
          ].map((row, i) => (
            <div className="mq-box" key={i} style={{
              background: `linear-gradient(180deg, ${row.hex}10 0%, rgba(255,255,255,0.022) 65%)`,
              border: `1px solid ${row.hex}33`,
              borderRadius: RADIUS.md,
              '--pt-d': "18px", '--pt-m': "14px", '--pr-d': "20px", '--pr-m': "14px", '--pb-d': "18px", '--pb-m': "14px", '--pl-d': "20px", '--pl-m': "14px",
              position: 'relative', overflow: 'hidden',
            }}>
              {/* Left accent */}
              <div style={{
                position: 'absolute', top: 0, left: 0, bottom: 0, width: '3px',
                background: `linear-gradient(180deg, ${row.hex}, ${row.hex}44)`,
                boxShadow: `0 0 12px ${row.hex}88`,
              }} />

              {/* Object → Color header */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: '12px', flexWrap: 'wrap', gap: '8px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '14px', height: '14px', borderRadius: '50%',
                    background: row.hex,
                    border: row.hex === '#F1F5F9' ? '1px solid rgba(0,0,0,0.2)' : 'none',
                    boxShadow: `0 0 12px ${row.hex}88, 0 0 0 3px rgba(0,0,0,0.3)`,
                    flexShrink: 0,
                  }} />
                  <span style={{
                    fontSize: isMobile ? '0.96rem' : '1.02rem',
                    fontWeight: 700, color: COLORS.offWhite, fontFamily: FONTS.body,
                  }}>
                    {tr ? row.objectTr : row.objectEn}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="2" strokeLinecap="round" style={{ opacity: 0.6 }}>
                    <path d="M5 12h14M13 6l6 6-6 6"/>
                  </svg>
                  <span style={{
                    fontSize: '0.85rem', color: COLORS.gold,
                    fontFamily: FONTS.body, fontStyle: 'italic', fontWeight: 600,
                  }}>
                    {tr ? row.colorTr : row.colorEn}
                  </span>
                </div>
              </div>

              {/* Arabic — elevated card */}
              <div className="mq-box" style={{
                '--pt-d': "16px", '--pt-m': "12px", '--pr-d': "22px", '--pr-m': "14px", '--pb-d': "16px", '--pb-m': "12px", '--pl-d': "22px", '--pl-m': "14px",
                background: 'rgba(0,0,0,0.32)',
                border: `1px solid ${COLORS.goldAlpha20 || 'rgba(212,165,116,0.2)'}`,
                borderRadius: RADIUS.md,
                marginBottom: '12px',
                boxShadow: `inset 0 0 22px ${row.hex}12`,
              }}>
                <p style={{
                  fontFamily: FONTS.quran,
                  fontSize: isMobile ? '1.55rem' : '1.8rem',
                  color: COLORS.gold,
                  textAlign: 'right', direction: 'rtl',
                  lineHeight: 1.95, margin: 0,
                }} lang="ar" dir="rtl">
                  {cleanArabicForDisplay(row.verseAr)}
                </p>
              </div>

              {/* Translation */}
              <p style={{
                fontSize: isMobile ? '0.88rem' : '0.92rem',
                color: COLORS.offWhite, fontStyle: 'italic',
                fontFamily: FONTS.body, margin: '0 0 8px', lineHeight: 1.7,
              }}>
                "{tr ? row.verseTr : row.verseEn}"
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: row.hex, opacity: 0.8 }} />
                <span style={{
                  fontSize: '0.74rem', fontWeight: 600,
                  color: COLORS.gold, opacity: 0.82,
                  letterSpacing: '0.04em',
                }}>
                  {row.ref}
                </span>
              </div>

              {/* Note */}
              <p style={{
                fontSize: isMobile ? '0.86rem' : '0.9rem',
                color: COLORS.silver, lineHeight: 1.75,
                fontFamily: FONTS.body, margin: 0,
                paddingLeft: '14px',
                borderLeft: `2px solid ${row.hex}55`,
              }}>
                {tr ? row.noteTr : row.noteEn}
              </p>
            </div>
          ))}
        </div>
      </SectionShell>

      {/* ── Section E: Beyazın Kök Genişlemesi ── */}
      <SectionShell
        letter="E"
        accent={COLORS.gold}
        eyebrowTr="بيض — Aynı Kökten Anlam Ailesi" eyebrowEn="بيض — Word Family of One Root"
        titleTr="Beyaz'ın Kök Genişlemesi — بيض → Yumurta"
        titleEn="White's Root Expansion — بيض → Egg"
      >
        <div className="g-2-4" style={{
          display: 'grid',
          gap: '10px',
          marginBottom: '16px',
        }}>
          {[
            { ar: 'أَبْيَض',    note: tr ? 'tekil, eril' : 'singular, masc.',                  trans: 'abyad' },
            { ar: 'بَيْضَاء',   note: tr ? 'tekil, dişil / parlak' : 'singular, fem. / radiant', trans: 'baydâ\'' },
            { ar: 'بِيضٌ',       note: tr ? 'çoğul' : 'plural',                                  trans: 'bîd' },
            { ar: 'بَيْضَة',     note: tr ? 'yumurta — aynı kök!' : 'egg — same root!',           trans: 'bayda', highlight: true },
          ].map((w, i) => (
            <div key={i} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
              padding: '16px 12px',
              background: w.highlight ? `linear-gradient(180deg, ${COLORS.goldAlpha15} 0%, rgba(212,165,116,0.04) 100%)` : 'rgba(255,255,255,0.025)',
              border: w.highlight ? `1px solid ${COLORS.goldAlpha45 || 'rgba(212,165,116,0.45)'}` : `1px solid ${COLORS.glassBgStrong}`,
              borderRadius: RADIUS.md,
              boxShadow: w.highlight ? `0 0 18px rgba(212,165,116,0.12)` : 'none',
              transition: 'transform 0.18s',
            }}>
              <span style={{
                fontFamily: FONTS.quran, fontSize: '1.85rem',
                color: w.highlight ? COLORS.gold : COLORS.offWhite,
                direction: 'rtl', lineHeight: 1.3,
              }} lang="ar" dir="rtl">
                {w.ar}
              </span>
              <span style={{ fontSize: '0.72rem', color: COLORS.silver, fontStyle: 'italic', fontFamily: FONTS.body }}>
                {w.trans}
              </span>
              <span style={{
                fontSize: '0.78rem', color: w.highlight ? COLORS.gold : COLORS.silver,
                fontFamily: FONTS.body, textAlign: 'center', lineHeight: 1.45,
                fontWeight: w.highlight ? 600 : 400,
              }}>
                {w.note}
              </span>
            </div>
          ))}
        </div>
        <p style={{
          fontSize: isMobile ? '0.88rem' : '0.92rem',
          color: COLORS.silver, lineHeight: 1.75, fontFamily: FONTS.body, margin: 0,
          paddingLeft: '14px',
          borderLeft: `2px solid ${COLORS.goldAlpha45 || 'rgba(212,165,116,0.45)'}`,
        }}>
          {tr
            ? "'Beyza' yumurta anlamına da gelir — beyazlık ve yumurta aynı kökten. Sâffât 37:49'da cennet ehlinin eşleri 'saklı yumurta gibi' (كَأَنَّهُنَّ بَيْضٌ مَكْنُونٌ) tarif edilir. Renk kelimesi anlam genişlemesiyle imge üretiyor."
            : "'Bayda' also means egg — whiteness and egg share the same root. In As-Sâffât 37:49, the companions of Paradise are described as 'like hidden eggs' (kaʾannahunna bayḍun maknūn). The color word generates imagery through semantic extension."}
        </p>
      </SectionShell>

    </div>
  );
}

function TabKaynaklar({ language }) {
  const tr = language === 'tr';

  const sections = [
    {
      titleTr: 'Klasik Tefsir',
      titleEn: 'Classical Tafsir',
      items: [
        { name: 'İbn Kesir', detail: "Tefsîru'l-Kur'âni'l-Azîm" },
        { name: 'Taberî', detail: "Câmiu'l-Beyân" },
        { name: 'Zemahşerî', detail: "el-Keşşâf — dilbilim ve renk kelimeleri analizi" },
        { name: 'Râzî', detail: "Mefâtîhu'l-Gayb — Fâtır 35:27 analizi" },
      ],
    },
    {
      titleTr: 'Akademik Kaynaklar',
      titleEn: 'Academic Sources',
      items: [
        { name: 'TDV İslam Ansiklopedisi', detail: tr ? '"Renk" maddesi' : '"Color" entry' },
        { name: 'Corpus Quran', detail: 'corpus.quran.com — kelime frekansları' },
        { name: "Lane's Arabic-English Lexicon", detail: tr ? 'Renk köklerinin etimolojik analizi' : 'Etymological analysis of color roots' },
      ],
    },
    {
      titleTr: 'Dijital Doğrulama',
      titleEn: 'Digital Verification',
      items: [
        { name: 'tanzil.net', detail: tr ? 'Ayet araması ve referans doğrulama' : 'Verse search and reference verification' },
        { name: 'kuranvemeali.com', detail: tr ? 'Karşılaştırmalı meal' : 'Comparative translations' },
      ],
    },
  ];

  const INFO_BLUE = 'rgba(59,130,246,0.7)';

  return (
    <div>
      {/* ── Methodological callout — premium ── */}
      <div style={{
        background: `linear-gradient(135deg, rgba(59,130,246,0.10) 0%, rgba(59,130,246,0.04) 50%, rgba(255,255,255,0.022) 100%)`,
        border: '1px solid rgba(59,130,246,0.22)',
        borderRadius: RADIUS.lg,
        padding: '18px 22px',
        marginBottom: '28px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Top accent */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
          background: `linear-gradient(90deg, transparent, ${INFO_BLUE}, transparent)`,
          opacity: 0.75,
        }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <div style={{
            width: '26px', height: '26px', borderRadius: '50%',
            background: 'rgba(59,130,246,0.18)',
            border: '1px solid rgba(59,130,246,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.85rem', color: INFO_BLUE, fontWeight: 700,
            flexShrink: 0,
          }}>ℹ</div>
          <span style={{
            fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.2em',
            color: INFO_BLUE, textTransform: 'uppercase', fontFamily: FONTS.body,
          }}>
            {tr ? 'Metodolojik Not' : 'Methodological Note'}
          </span>
        </div>
        <p style={{
          fontSize: '0.88rem', color: COLORS.offWhite, lineHeight: 1.75,
          fontFamily: FONTS.body, margin: 0,
        }}>
          {tr
            ? "Bu sayfada Kur'an'ın renk kelimelerinin taşıdığı sembolik anlamlar tefsir geleneğine dayanmaktadır. Kur'an renk sembolizmini açıkça tanımlamaz — bu yorumlar ℹ ile işaretlenmiştir. Renk kelimelerinin dilbilimsel analizleri Arapça sözlük ve tefsir kaynaklarına dayanmaktadır."
            : "The symbolic meanings attributed to the Quran's color words on this page are based on the classical tafsir tradition. The Quran does not explicitly define color symbolism — such interpretations are marked with ℹ. Linguistic analyses of color words are based on Arabic lexicography and tafsir sources."}
        </p>
      </div>

      {/* ── Source sections — premium cards ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {sections.map((sec, i) => (
          <div
            key={i}
            style={{
              background: 'rgba(255,255,255,0.022)',
              border: `1px solid ${COLORS.glassBorder}`,
              borderRadius: RADIUS.lg,
              overflow: 'hidden',
            }}
          >
            {/* Section header */}
            <div style={{
              padding: '14px 20px',
              borderBottom: `1px solid ${COLORS.glassBg}`,
              background: `linear-gradient(90deg, rgba(212,165,116,0.06), transparent 60%)`,
              display: 'flex', alignItems: 'center', gap: '12px',
            }}>
              <div style={{
                width: '4px', height: '16px', borderRadius: '2px',
                background: COLORS.gold,
                boxShadow: `0 0 10px ${COLORS.gold}88`,
                flexShrink: 0,
              }} />
              <span style={{
                fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.16em',
                color: COLORS.gold, textTransform: 'uppercase', fontFamily: FONTS.body,
              }}>
                {tr ? sec.titleTr : sec.titleEn}
              </span>
              <span style={{
                marginLeft: 'auto',
                fontSize: '0.66rem', fontWeight: 600, letterSpacing: '0.08em',
                color: SEMANTIC.textFaint || COLORS.silver,
                fontFamily: FONTS.body,
                padding: '3px 9px', background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: RADIUS.pillSm,
              }}>
                {sec.items.length} {tr ? 'kaynak' : 'sources'}
              </span>
            </div>

            {/* Items */}
            <div style={{ padding: '8px 0' }}>
              {sec.items.map((item, j) => (
                <div
                  key={j}
                  style={{
                    display: 'flex', alignItems: 'baseline',
                    gap: '14px',
                    padding: '12px 20px',
                    borderBottom: j < sec.items.length - 1 ? '1px solid rgba(255,255,255,0.035)' : 'none',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.022)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <div style={{
                    width: '4px', height: '4px', borderRadius: '50%',
                    background: COLORS.gold, opacity: 0.55, flexShrink: 0,
                    alignSelf: 'center',
                  }} />
                  <span style={{
                    fontSize: '0.88rem', fontWeight: 700,
                    color: COLORS.offWhite, fontFamily: FONTS.body,
                    minWidth: '160px', flexShrink: 0,
                  }}>
                    {item.name}
                  </span>
                  <span style={{
                    fontSize: '0.8rem', color: COLORS.silver,
                    fontFamily: FONTS.body, fontStyle: 'italic',
                    lineHeight: 1.55,
                  }}>
                    {item.detail}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function KuranRenkleri({ onClose }) {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const [data, setData]               = useState(null);
  const [activeTab, setActiveTab]     = useState(TABS.RENKLER);
  const [activeFilter, setActiveFilter] = useState('tumu');
  const [isMobile, setIsMobile]       = useState(false)  // SSR-safe; useEffect h() post-mount hydrate;
  const [expandedVerse, setExpandedVerse] = useState(null);

  // Fetch data
  useEffect(() => {
    fetch('/kuranin-renkleri.json')
      .then(r => r.json())
      .then(setData)
      .catch(console.error);
  }, []);

  // isMobile listener
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < BREAKPOINT_MOBILE);
    h(); // post-mount hydrate
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  // Escape key
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  // Body scroll lock kaldırıldı — WowFacts/IlkSon pattern: normal-flow document scroll.

  const tabStyle = (id) => {
    const active = activeTab === id;
    return {
      position: 'relative',
      padding: isMobile ? '14px 16px' : '15px 22px',
      borderRadius: 0,
      border: 'none',
      background: active
        ? `linear-gradient(180deg, ${COLORS.goldAlpha15} 0%, rgba(212,165,116,0.04) 100%)`
        : 'transparent',
      color: active ? COLORS.gold : SEMANTIC.textFaint,
      fontSize: isMobile ? '0.78rem' : '0.82rem',
      fontWeight: active ? 700 : 500,
      letterSpacing: active ? '0.14em' : '0.12em',
      textTransform: 'uppercase',
      fontFamily: FONTS.body,
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      transition: `all ${TRANSITION.fast}`,
      flexShrink: 0,
    };
  };

  return (
    <div style={{
      background: COLORS.cosmicBlack,
      minHeight: 'calc(100vh - 62px)',
      display: 'flex', flexDirection: 'column',
      paddingTop: '62px',
    }}>
      <ToolHeader
        icon={<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill={COLORS.gold} /><circle cx="17.5" cy="10.5" r=".5" fill={COLORS.gold} /><circle cx="8.5" cy="7.5" r=".5" fill={COLORS.gold} /><circle cx="6.5" cy="12.5" r=".5" fill={COLORS.gold} /><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.992 6.012 17.477 2 12 2z" /></svg>}
        titleTr="Kur'an'da Renkler"
        titleEn="Colors in the Quran"
        subtitleTr="Beyaz · Siyah · Yeşil · Sembolik dil"
        subtitleEn="White · Black · Green · Symbolic language"
        language={language}
      />

      {/* ── Body ── */}
      <div style={{ flex: 1 }}>

        {/* ════ CINEMATIC HERO — Premium Template (Bismillah + Fâtır 35:27 +
            framing whisper + dramatic title + stat strip) ══════════════════ */}
        <div className="mq-box" style={{
          '--pt-d': "60px", '--pt-m': "40px", '--pr-d': "32px", '--pr-m': "16px", '--pb-d': "36px", '--pb-m': "28px", '--pl-d': "32px", '--pl-m': "16px",
          background: `linear-gradient(180deg,${COLORS.deepNavy} 0%,${COLORS.cosmicBlack} 100%)`,
          borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <HeroGeometricBackground />
          <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Bismillah ornament — Amiri Quran ligature (§13.2 documented exception) */}
          <div className="mq-box"
            dir="rtl"
            lang="ar"
            aria-label="Bismillāh"
            style={{
              fontFamily: FONTS.bismillah,
              fontSize: isMobile ? '1.6rem' : '2rem',
              color: COLORS.gold,
              opacity: 0.82,
              lineHeight: 1,
              '--mb-d': '40px', '--mb-m': '28px',
              textShadow: `0 0 20px ${COLORS.gold}22`,
            }}
          >
            ﷽
          </div>

          {/* Anchor verse — Fâtır 35:27 */}
          <p
            dir="rtl"
            lang="ar"
            style={{
              fontFamily: FONTS.quran,
              fontSize: isMobile ? 'clamp(1.05rem, 4.2vw, 1.4rem)' : 'clamp(1.3rem, 2.4vw, 1.75rem)',
              color: COLORS.gold,
              lineHeight: 2.1,
              margin: '0 auto 18px',
              maxWidth: '800px',
              textShadow: `0 0 22px ${COLORS.gold}1c`,
            }}
          >
            اَلَمْ تَرَ اَنَّ اللّٰهَ اَنْزَلَ مِنَ السَّمَٓاءِ مَٓاءً فَاَخْرَجْنَا بِهٖ ثَمَرَاتٍ مُخْتَلِفًا اَلْوَانُهَا
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
              ? 'Allah\'ın gökten su indirdiğini ve onunla renkleri birbirinden farklı meyveler çıkardığımızı görmüyor musun?'
              : 'Do you not see that Allah sends down rain from the sky, and We produce thereby fruits of varying colors?'}"
          </p>

          <p style={{
            color: COLORS.silver,
            fontFamily: FONTS.body,
            fontSize: '0.72rem',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            margin: '0 0 36px',
            opacity: 0.78,
          }}>
            — {tr ? 'Fâtır 35:27' : 'Fāṭir 35:27'}
          </p>

          {/* Framing whisper — page thesis */}
          <p style={{
            color: COLORS.silver,
            fontFamily: FONTS.display,
            fontStyle: 'italic',
            fontSize: isMobile ? '0.92rem' : 'clamp(0.95rem, 1.5vw, 1.02rem)',
            lineHeight: 1.7,
            margin: '0 auto 40px',
            maxWidth: '660px',
            opacity: 0.88,
          }}>
            {tr
              ? <>Renk, Allah'ın yarattığı dilin <em style={{ fontStyle: 'normal', color: COLORS.gold, opacity: 0.95 }}>sessiz alfabesidir</em>. 14 kelime, 8 ton — her biri başka bir hakikatin işareti.</>
              : <>Color is the <em style={{ fontStyle: 'normal', color: COLORS.gold, opacity: 0.95 }}>silent alphabet</em> of the language Allah created. 14 words, 8 tones — each pointing to a different truth.</>}
          </p>

          {/* Filigree divider */}
          <div aria-hidden="true" style={{
            width: '120px',
            height: '1px',
            background: `linear-gradient(to right, transparent, ${COLORS.gold}66, transparent)`,
            margin: '0 auto 32px',
          }} />

          {/* Eyebrow */}
          <div style={{
            fontSize: '0.68rem', letterSpacing: '0.3em',
            color: COLORS.gold, textTransform: 'uppercase',
            fontFamily: FONTS.body, fontWeight: 700,
            opacity: 0.75,
            marginBottom: '14px',
          }}>
            {tr ? "KUR'AN'IN RENK PALETİ · 14 KELİME, 8 TON" : "THE QURAN'S COLOR PALETTE · 14 WORDS, 8 TONES"}
          </div>

          {/* Big Title */}
          <h2 style={{
            fontSize: isMobile ? 'clamp(1.6rem, 7vw, 2rem)' : 'clamp(2rem, 3.6vw, 2.8rem)',
            fontWeight: 700, fontFamily: FONTS.display,
            color: COLORS.offWhite,
            margin: '0 auto 16px',
            lineHeight: 1.15,
            letterSpacing: '-0.015em',
            maxWidth: '760px',
          }}>
            {tr ? "Allah'ın Seçtiği Renkler" : 'The Colors Allah Chose'}
          </h2>

          {/* Dramatic subtitle */}
          <p style={{
            fontFamily: FONTS.display,
            fontSize: isMobile ? '1rem' : 'clamp(1.05rem, 1.8vw, 1.2rem)',
            color: COLORS.gold,
            margin: '0 auto 32px',
            lineHeight: 1.5,
            fontStyle: 'italic',
            maxWidth: '680px',
            opacity: 0.92,
          }}>
            {tr
              ? 'Dünya hayatı bir renk geçişidir — sonunda hepsi tek bir tona, koyu yeşile çağrılır.'
              : 'Worldly life is a transition of colors — at the end, all are called to a single tone: deep green.'}
          </p>

          {/* Stat strip — refined: centered, wrap, less cramped */}
          <div style={{
            display: 'flex', gap: '8px',
            flexWrap: 'wrap',
            justifyContent: 'center',
            maxWidth: '720px',
            margin: '0 auto',
          }}>
            {[
              { num: '8',   labelTr: 'Temel Renk',   labelEn: 'Core Colors' },
              { num: '14',  labelTr: 'Renk Kelimesi', labelEn: 'Color Words' },
              { num: '~18', labelTr: 'Beyaz Ayet',    labelEn: 'White Verses' },
              { num: tr ? 'Yeşil' : 'Green', labelTr: 'Cennet Rengi', labelEn: 'Paradise Color' },
              { arabic: 'مُدْهَامَّتَانِ', labelTr: 'Hapax', labelEn: 'Hapax' },
            ].map((s, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '8px 14px', borderRadius: RADIUS.pillSm, flexShrink: 0,
                background: s.arabic ? 'rgba(83,74,183,0.12)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${s.arabic ? 'rgba(83,74,183,0.25)' : 'rgba(255,255,255,0.08)'}`,
              }}>
                {s.arabic ? (
                  <span style={{ fontFamily: FONTS.quran, fontSize: '0.95rem', color: COLORS.purple, direction: 'rtl' }} lang="ar" dir="rtl">{cleanArabicForDisplay(s.arabic)}</span>
                ) : (
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: COLORS.gold, fontFamily: FONTS.body, lineHeight: 1 }}>{s.num}</span>
                )}
                <span style={{ fontSize: '0.72rem', color: s.arabic ? COLORS.purple : COLORS.silver, fontFamily: FONTS.body, fontWeight: 600, whiteSpace: 'nowrap' }}>
                  {tr ? s.labelTr : s.labelEn}
                </span>
              </div>
            ))}
          </div>
          </div>
        </div>

        {/* ── Fâtır 35:27 Feature Card ── */}
        <div className="mq-box" style={{ '--mt-d': "0", '--mt-m': "0", '--mr-d': "32px", '--mr-m': "16px", '--mb-d': "20px", '--mb-m': "16px", '--ml-d': "32px", '--ml-m': "16px", '--pt-d': "20px", '--pt-m': "16px", '--pr-d': "20px", '--pr-m': "16px", '--pb-d': "20px", '--pb-m': "16px", '--pl-d': "20px", '--pl-m': "16px", background: 'linear-gradient(135deg,rgba(29,158,117,0.08),rgba(200,50,50,0.08),rgba(30,30,50,0.15))', border: `1px solid ${COLORS.glassBorder}`, borderRadius: RADIUS.lg }}>
          <div style={{ fontSize: '0.75rem', letterSpacing: '0.12em', color: COLORS.gold, textTransform: 'uppercase', fontFamily: FONTS.body, fontWeight: 700, marginBottom: '12px' }}>
            {tr ? 'Tek Ayette 3 Renk — Fâtır 35:27' : 'Three Colors in One Verse — Fatir 35:27'}
          </div>
          <p style={{ fontFamily: FONTS.quran, fontSize: isMobile ? '1.7rem' : '2.1rem', color: COLORS.gold, textAlign: 'center', direction: 'rtl', lineHeight: 2, margin: '0 0 14px' }} lang="ar" dir="rtl">
            وَمِنَ الْجِبَالِ جُدَدٌ بِيضٌ وَحُمْرٌ مُّخْتَلِفٌ أَلْوَانُهَا وَغَرَابِيبُ سُودٌ
          </p>
          <p style={{ fontSize: isMobile ? '0.9rem' : '1rem', color: COLORS.silver, fontFamily: FONTS.body, textAlign: 'center', fontStyle: 'italic', margin: '0 0 16px', lineHeight: 1.7 }}>
            {tr
              ? '"Dağlarda da beyaz, kırmızı — renkleri birbirinden farklı — ve simsiyah yollar/şeritler vardır."'
              : '"And among the mountains are streaks of white and red of varying shades, and some intensely black."'}
          </p>
          {/* Dynamic color indicators — uniform dark base, color expressed via swatch + glow (Gemini polish) */}
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { ar: 'بِيضٌ',          label: tr ? 'Beyaz'    : 'White',     swatch: '#FFFFFF', borderRgba: 'rgba(255,255,255,0.30)', glow: 'rgba(255,255,255,0.22)', dotBorder: '1px solid rgba(255,255,255,0.40)' },
              { ar: 'حُمْرٌ',         label: tr ? 'Kırmızı'  : 'Red',       swatch: '#7F1D1D', borderRgba: 'rgba(185,28,28,0.40)',   glow: 'rgba(185,28,28,0.32)',   dotBorder: 'none' },
              { ar: 'غَرَابِيبُ سُودٌ', label: tr ? 'Simsiyah' : 'Jet Black', swatch: '#000000', borderRgba: 'rgba(100,100,110,0.35)', glow: 'rgba(40,40,60,0.55)',     dotBorder: '1px solid rgba(255,255,255,0.10)' },
            ].map(p => (
              <div
                key={p.ar}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
                  padding: '14px 22px', minWidth: '128px',
                  background: 'rgba(255,255,255,0.035)',
                  border: `1px solid ${p.borderRgba}`,
                  borderRadius: RADIUS.lg,
                  boxShadow: `0 0 22px ${p.glow}`,
                  transition: `all ${TRANSITION.normal}`,
                }}
              >
                {/* Color swatch dot — the actual color expression */}
                <div style={{
                  width: '32px', height: '32px', borderRadius: RADIUS.full,
                  background: p.swatch, border: p.dotBorder,
                  boxShadow: `0 0 14px ${p.glow}`,
                }} />
                <span style={{ fontFamily: FONTS.quran, fontSize: '1.4rem', color: COLORS.offWhite, direction: 'rtl', lineHeight: 1 }} lang="ar" dir="rtl">{p.ar}</span>
                <span style={{ fontSize: '0.85rem', color: COLORS.silver, fontFamily: FONTS.body, fontWeight: 700, letterSpacing: '0.02em' }}>{p.label}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: '0.92rem', color: COLORS.silver, fontFamily: FONTS.body, margin: '14px 0 0', lineHeight: 1.7 }}>
            {tr
              ? "'Garâbîb' kuzgun/karga (ghurab) kökünden — siyahın en yoğun tonu için özel kelime. 'Mudhammatân' (koyu yeşil) ile paralel: Kur'an renk yoğunluğunu ifade etmek için kök değiştirerek yeni kelime üretir."
              : "'Gharabib' derives from ghurab (raven/crow) — a special word for the most intense shade of black. Parallel to 'mudhammatân' (intense green): the Quran creates new words by changing roots to express color intensity."}
          </p>
        </div>

        {/* ── Tab bar — §13.19 compliant (opaque bg, top:110, isolation) ── */}
        <div style={{
          position: 'sticky', top: '110px', zIndex: 20,
          background: 'rgb(6, 8, 14)',
          backgroundColor: 'rgb(6, 8, 14)',
          isolation: 'isolate',
        }}>
          {/* Top hairline gold accent */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
            background: `linear-gradient(90deg, transparent 5%, ${COLORS.goldAlpha25 || 'rgba(212,165,116,0.25)'} 50%, transparent 95%)`,
            pointerEvents: 'none',
          }} />
          <div className="mq-box" id="renkler-tab-bar" style={{
            display: 'flex',
            gap: isMobile ? '0' : '6px',
            '--pt-d': "0", '--pt-m': "0", '--pr-d': "14px", '--pr-m': "6px", '--pb-d': "0", '--pb-m': "0", '--pl-d': "14px", '--pl-m': "6px",
            borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
            overflowX: 'auto', scrollbarWidth: 'none',
            flexShrink: 0,
            position: 'relative',
            scrollMarginTop: '120px',
          }}>
            {Object.values(TABS).map(id => {
              const active = activeTab === id;
              return (
                <button
                  key={id}
                  style={tabStyle(id)}
                  onClick={() => {
                    setActiveTab(id);
                    setExpandedVerse(null);
                    setTimeout(() => {
                      const tb = document.getElementById('renkler-tab-bar');
                      if (tb) tb.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 50);
                  }}
                  onMouseEnter={e => {
                    if (!active) {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.035)';
                      e.currentTarget.style.color = COLORS.offWhite;
                    }
                  }}
                  onMouseLeave={e => {
                    if (!active) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = SEMANTIC.textFaint || COLORS.silver;
                    }
                  }}
                >
                  {TAB_LABELS[id][language] ?? TAB_LABELS[id].tr}
                  {/* Active indicator — gold bottom bar with glow */}
                  {active && (
                    <span
                      aria-hidden="true"
                      style={{
                        position: 'absolute',
                        bottom: '-1px',
                        left: '14%',
                        right: '14%',
                        height: '2px',
                        background: `linear-gradient(90deg, transparent, ${COLORS.gold}, transparent)`,
                        boxShadow: `0 0 12px ${COLORS.gold}99, 0 0 4px ${COLORS.gold}`,
                        borderRadius: '2px',
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
          {/* Fade indicator — right edge hint for scrollable tabs on mobile */}
          {isMobile && (
            <div style={{
              position: 'absolute', top: 0, right: 0, bottom: 1,
              width: '48px', pointerEvents: 'none',
              background: 'linear-gradient(to right, transparent, rgba(10,10,26,0.97))',
            }} />
          )}
        </div>

        {/* ── Tab content ── */}
        <div className="mq-box" style={{ '--pt-d': "24px", '--pt-m': "16px", '--pr-d': "32px", '--pr-m': "16px", '--pb-d': "24px", '--pb-m': "16px", '--pl-d': "32px", '--pl-m': "16px", minHeight: '400px' }}>
          {activeTab === TABS.RENKLER && (
            <TabRenkler data={data} language={language} activeFilter={activeFilter} setActiveFilter={setActiveFilter} isMobile={isMobile} expandedVerse={expandedVerse} setExpandedVerse={setExpandedVerse} />
          )}
          {activeTab === TABS.PALET && (
            <TabPalet
              data={data} language={language} isMobile={isMobile}
              onColorClick={(id) => {
                setActiveTab(TABS.RENKLER);
                // BUG FIX (UX audit K-02, 2026-07-12): activeFilter renk id'si DEĞİL context id'si
                // ('tumu' | 'cennet' | 'kiyamet' | 'doga' | 'kissa' | 'hapax'). Renk id'sini set etmek
                // filtered array'i boşaltıp tüm kartları unmount ediyordu. 'tumu' → tüm renkler görünür.
                setActiveFilter('tumu');
                setExpandedVerse(id);
                setTimeout(() => {
                  const el = document.getElementById(`color-${id}`);
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 200);
              }}
            />
          )}
          {activeTab === TABS.BAGLAM && (
            <TabBaglam language={language} isMobile={isMobile} />
          )}
          {activeTab === TABS.CENNET && (
            <TabCennet language={language} isMobile={isMobile} />
          )}
          {activeTab === TABS.KIYAMET && (
            <TabKiyamet language={language} isMobile={isMobile} />
          )}
          {activeTab === TABS.DILBILIM && (
            <TabDilbilim language={language} isMobile={isMobile} />
          )}
          {activeTab === TABS.KAYNAKLAR && (
            <TabKaynaklar language={language} />
          )}
        </div>

        {/* ════ CLOSING — Paradox Synthesis + Cross-tool CTA Strip ════════ */}
        <ColorsClosing language={language} isMobile={isMobile} />

        <CrossToolCTA
          language={language}
          isMobile={isMobile}
          links={[
            { href: `/${language}/arac/yeminler`, titleTr: "Kur'an'ın Yeminleri", titleEn: 'Quranic Oaths', descTr: 'Renkler tabiat sözlüğüdür; yeminler onu vurgular.', descEn: "Colors are nature's lexicon; oaths emphasize them." },
            { href: `/${language}/atlas/doga`, titleTr: 'Kevni Ayetler', titleEn: 'Cosmic Signs', descTr: 'Renklerin doğduğu kâinatın atlası.', descEn: 'Atlas of the universe where colors are born.' },
            { href: `/${language}/arac/ilk-son-kelimeler`, titleTr: 'İlk ve Son Kelimeler', titleEn: 'First and Last Words', descTr: 'Renklerin sûre-içi konumu — açılış-kapanış deseni.', descEn: "Colors' surah-position — opening-closing pattern." },
          ]}
        />

        {/* #205 (2026-07-16) — Renk-anlam-sanat kaynakları */}
        <SourcesCitation
          language={language}
          isMobile={isMobile}
          sources={[
            {
              author: 'er-Râzî',
              workTr: "Mefâtîhu'l-Ğayb",
              workEn: 'Mafātīḥ al-Ghayb',
              period: '1149–1209 (Rey)',
              noteTr: "Cennet renkleri (yeşil, altın), cehennem renkleri (siyah, sarı) ve Kur'ân'da renk sembolizmi üzerine kapsamlı analiz.",
              noteEn: 'Comprehensive analysis of paradise colors (green, gold), hell colors (black, yellow), and color symbolism in the Quran.',
            },
            {
              author: 'ez-Zemahşerî',
              workTr: "el-Keşşâf",
              workEn: 'al-Kashshāf',
              period: '1075–1144 (Harezm)',
              noteTr: "Bakara 2:69 (buzağı sarısı) gibi renk-özgü ayetlerin belâgat + dilsel çözümlemesi; renk kelimelerinin nüansı.",
              noteEn: 'Rhetorical + linguistic analysis of color-specific verses like Baqara 2:69 (yellow of the cow); nuances of color words.',
            },
            {
              author: 'er-Râgıb el-İsfahânî',
              workTr: "Müfredâtü Elfâzi\'l-Kurʾân",
              workEn: 'al-Mufradāt fī Gharīb al-Qurʾān',
              period: '?–1108 (İsfahan)',
              noteTr: "Kur'ân\'daki her renk isminin (ahdar, esved, ebyad, ahmer, asfar, azrak) kök + türev + tam anlam yelpazesi.",
              noteEn: "Root, derivation, and full meaning-spectrum of every color name in the Quran (akhḍar, aswad, abyaḍ, aḥmar, aṣfar, azraq).",
            },
            {
              author: 'Seyyid Hüseyin Nasr',
              workTr: 'İslam Sanatı ve Maneviyatı',
              workEn: 'Islamic Art and Spirituality',
              period: '1987 (SUNY Press)',
              noteTr: "İslamî geleneğin renk teorisini (mavi kubbe, altın hat, yeşil işaret) sembolik-manevi çerçevede ele alan çağdaş klasik.",
              noteEn: "Contemporary classic on Islamic tradition's color theory (blue dome, gold calligraphy, green marker) in symbolic-spiritual frame.",
            },
          ]}
        />

      </div>
    </div>
  );
}

// ─── Closing Synthesis — Premium Template Kapanışı ───────────────────────────
// Renkler sayfasının tezi: renk anlatıdır, renksizlik vaattir.
// Hero'da açtığımız "sessiz alfabe" framing whisper'ını sentez olarak kapatır.
function ColorsClosing({ language, isMobile }) {
  const tr = language === 'tr';
  return (
    <div className="mq-box" style={{
      '--mt-d': '60px', '--mt-m': '40px',
      '--pt-d': "80px", '--pt-m': "50px", '--pr-d': "32px", '--pr-m': "20px", '--pb-d': "80px", '--pb-m': "60px", '--pl-d': "32px", '--pl-m': "20px",
      borderTop: `1px solid ${COLORS.glassBorderSoft || 'rgba(255,255,255,0.06)'}`,
      maxWidth: '900px',
      marginLeft: 'auto',
      marginRight: 'auto',
    }}>
      {/* ── KELÂMÎ TARTIŞMA — "Cennet Tek Ton mu?" ─────────────────── */}
      <div className="mq-box" style={{
        background: 'rgba(46,204,113,0.05)',
        border: '1px solid rgba(46,204,113,0.25)',
        borderLeft: '3px solid #2ecc71',
        borderRadius: RADIUS.lg,
        '--pt-d': "24px", '--pt-m': "20px", '--pr-d': "28px", '--pr-m': "22px", '--pb-d': "24px", '--pb-m': "20px", '--pl-d': "28px", '--pl-m': "22px",
        '--mb-d': '60px', '--mb-m': '40px',
        maxWidth: '780px',
        marginInline: 'auto',
      }}>
        <p style={{ fontSize: '0.66rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: COLORS.softEmerald, opacity: 0.9, margin: '0 0 12px', fontFamily: FONTS.body }}>
          {tr ? "Kelâmî Tartışma · Sıkça Sorulan" : "Theological Q · Frequently Asked"}
        </p>
        <p style={{ fontSize: '0.95rem', fontWeight: 700, color: COLORS.offWhite, margin: '0 0 14px', lineHeight: 1.3, fontFamily: FONTS.body }}>
          {tr ? "Cennet \"tek ton yeşil\" midir? Dünya renksiz mi kalır?" : "Is Paradise \"a single shade of green\"? Is the world the colorful one?"}
        </p>
        <p style={{ fontSize: '0.86rem', color: COLORS.silver, lineHeight: 1.75, margin: '0 0 14px', fontFamily: FONTS.body }}>
          {tr
            ? <><strong style={{ color: COLORS.softEmerald, fontWeight: 600 }}>Yanlış anlaşılma.</strong> Kur'an cennetin <em style={{ color: COLORS.gold, fontStyle: 'normal' }}>monokrom</em> olmadığını açıkça gösterir. مُدْهَامَّتَانِ (Rahmân 55:64) hapax &ldquo;koyu yeşil&rdquo; iki bahçe — ama bu sadece <em style={{ color: COLORS.gold, fontStyle: 'normal' }}>vaadin baş harfi</em>dir.</>
            : <><strong style={{ color: COLORS.softEmerald, fontWeight: 600 }}>A misreading.</strong> The Quran clearly shows Paradise is not <em style={{ color: COLORS.gold, fontStyle: 'normal' }}>monochrome</em>. مُدْهَامَّتَانِ (Raḥmān 55:64) — the hapax "deep green" two gardens — is merely <em style={{ color: COLORS.gold, fontStyle: 'normal' }}>the opening letter</em> of the promise.</>}
        </p>
        <p style={{ fontSize: '0.84rem', fontWeight: 700, color: COLORS.gold, margin: '0 0 8px', fontFamily: FONTS.body }}>
          {tr ? "Kur'an'da cennette geçen diğer renkler ve dokular:" : "Other colors and textures of Paradise in the Quran:"}
        </p>
        <ul style={{ fontSize: '0.84rem', color: COLORS.silver, lineHeight: 1.85, margin: '0 0 14px', paddingLeft: '20px', fontFamily: FONTS.body }}>
          <li>{tr ? <><strong style={{ color: COLORS.offWhite, fontWeight: 600 }}>Yeşil sündüs ve istebrak</strong> (yeşil ince ve kalın ipek) — Kehf 18:31, Dehr 76:21</> : <><strong style={{ color: COLORS.offWhite, fontWeight: 600 }}>Green sundus and istabraq</strong> (fine green silk + brocade) — Kahf 18:31, Insān 76:21</>}</li>
          <li>{tr ? <><strong style={{ color: COLORS.offWhite, fontWeight: 600 }}>Yeşil rafraf</strong> (yeşil yastıklar/tahtlar) — Rahmân 55:76</> : <><strong style={{ color: COLORS.offWhite, fontWeight: 600 }}>Green rafraf</strong> (green cushions/thrones) — Raḥmān 55:76</>}</li>
          <li>{tr ? <><strong style={{ color: COLORS.offWhite, fontWeight: 600 }}>Beyaz inci, kırmızı yâkut, zümrüt</strong> — süs ve takı — Hac 22:23, Fâtır 35:33, Rahmân 55:58</> : <><strong style={{ color: COLORS.offWhite, fontWeight: 600 }}>White pearls, red rubies, emerald</strong> — adornments — Ḥajj 22:23, Fāṭir 35:33, Raḥmān 55:58</>}</li>
          <li>{tr ? <><strong style={{ color: COLORS.offWhite, fontWeight: 600 }}>Altın bilezikler ve süsler</strong> (zîneten) — Hac 22:23, Fâtır 35:33, Kehf 18:31</> : <><strong style={{ color: COLORS.offWhite, fontWeight: 600 }}>Gold bracelets and ornaments</strong> (zīnatan) — Ḥajj 22:23, Fāṭir 35:33, Kahf 18:31</>}</li>
          <li>{tr ? <><strong style={{ color: COLORS.offWhite, fontWeight: 600 }}>4 nehir: su, süt, şarab, bal</strong> — her biri ayrı renk-doku-tat — Muhammed 47:15</> : <><strong style={{ color: COLORS.offWhite, fontWeight: 600 }}>4 rivers: water, milk, wine, honey</strong> — each its own color-texture-taste — Muḥammad 47:15</>}</li>
        </ul>
        <p style={{ fontSize: '0.82rem', color: COLORS.silver, lineHeight: 1.75, margin: '0 0 8px', fontFamily: FONTS.body, fontStyle: 'italic' }}>
          {tr
            ? <>Klasik tefsir bu çoğulluğu sembolik okur (İbn Kayyim, Hâdi'l-Ervâh): yeşil <em style={{ color: COLORS.softEmerald, fontStyle: 'normal' }}>baş işaret</em> — gözün önce karşılaştığı vaad rengi; diğer renkler ise vaadin <em style={{ color: COLORS.gold, fontStyle: 'normal' }}>iç katmanları</em>. &ldquo;Monokrom cennet&rdquo; okuması hem tefsire hem ayetlere aykırıdır.</>
            : <>Classical tafsir reads this plurality symbolically (Ibn Qayyim, Ḥādī al-Arwāḥ): green is the <em style={{ color: COLORS.softEmerald, fontStyle: 'normal' }}>headline sign</em> — the color the eye meets first; the other colors are the promise's <em style={{ color: COLORS.gold, fontStyle: 'normal' }}>inner layers</em>. The "monochrome Paradise" reading contradicts both tafsir and the text.</>}
        </p>
        <p style={{ fontSize: '0.78rem', color: COLORS.silver, opacity: 0.78, margin: 0, fontFamily: FONTS.body, lineHeight: 1.6 }}>
          {tr
            ? <>Bu sayfa <strong style={{ color: COLORS.softEmerald, fontWeight: 600 }}>yeşil</strong>e &ldquo;vaadin baş işareti&rdquo; olarak odaklanır — diğer cennet renklerini dışlamak değil, yapısal bir vurgu.</>
            : <>This page focuses on <strong style={{ color: COLORS.softEmerald, fontWeight: 600 }}>green</strong> as the "headline sign of the promise" — a structural emphasis, not exclusion of other paradise colors.</>}
        </p>
      </div>

      {/* Eyebrow */}
      <div style={{
        fontSize: '0.68rem', fontFamily: FONTS.body, fontWeight: 700,
        letterSpacing: '0.3em', textTransform: 'uppercase',
        color: COLORS.gold, opacity: 0.75,
        marginBottom: '20px', textAlign: 'center',
      }}>
        {tr ? 'Tefekkür' : 'Reflection'}
      </div>

      {/* Paradox synthesis — Hero'daki "sessiz alfabe" tezi burada
          cennetin tek tonuna (مُدْهَامَّتَانِ) bağlanır */}
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
          ? <>Renk <em style={{ fontStyle: 'normal', color: COLORS.gold }}>dünyayı anlatır</em>. <em style={{ fontStyle: 'normal', color: COLORS.softEmerald }}>Yeşil</em> cenneti <em style={{ fontStyle: 'normal', color: COLORS.softEmerald }}>vaad eder</em>.</>
          : <><em style={{ fontStyle: 'normal', color: COLORS.gold }}>Color narrates</em> the world. <em style={{ fontStyle: 'normal', color: COLORS.softEmerald }}>Green promises</em> the Paradise.</>}
      </h3>

      {/* Synthesis paragraph */}
      <p style={{
        fontFamily: FONTS.display, fontStyle: 'italic',
        color: COLORS.silver,
        fontSize: isMobile ? '1rem' : 'clamp(1rem, 1.7vw, 1.12rem)',
        lineHeight: 1.75,
        textAlign: 'center',
        margin: '0 auto 50px',
        maxWidth: '740px',
        opacity: 0.92,
      }}>
        {tr
          ? <>Allah dünyayı renklerle yazdı — yeşil, sarı, beyaz, siyah. Renk bu dünyada bir <strong style={{ color: COLORS.gold, fontStyle: 'normal', fontWeight: 600 }}>alfabe</strong>, bir <strong style={{ color: COLORS.gold, fontStyle: 'normal', fontWeight: 600 }}>anlatım</strong>. Cennet ise söze sığmaz: <strong style={{ color: COLORS.softEmerald, fontStyle: 'normal', fontWeight: 600 }}>مُدْهَامَّتَانِ</strong> (koyu yeşil iki bahçe, 55:64), yeşil sündüs ve istebrak (18:31, 76:21), yeşil rafraf (55:76), inci, yâkut, dört nehir. Bütün bunların habercisi tek renkten gelir — <strong style={{ color: COLORS.softEmerald, fontStyle: 'normal', fontWeight: 600 }}>yeşilden</strong>.</>
          : <>Allah wrote the world with colors — green, yellow, white, black. In this world, color is an <strong style={{ color: COLORS.gold, fontStyle: 'normal', fontWeight: 600 }}>alphabet</strong>, a <strong style={{ color: COLORS.gold, fontStyle: 'normal', fontWeight: 600 }}>narrative</strong>. Paradise exceeds words: <strong style={{ color: COLORS.softEmerald, fontStyle: 'normal', fontWeight: 600 }}>مُدْهَامَّتَانِ</strong> (two deep-green gardens, 55:64), green sundus and istabraq silk (18:31, 76:21), green rafraf (55:76), pearls, rubies, four rivers. Yet the herald of all these comes from one color — <strong style={{ color: COLORS.softEmerald, fontStyle: 'normal', fontWeight: 600 }}>green</strong>.</>}
      </p>

      {/* Cross-tool CTA strip — 3 derin link */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{
          textAlign: 'center', marginBottom: '20px',
        }}>
          <span style={{
            fontSize: '0.68rem', fontFamily: FONTS.body, fontWeight: 700,
            letterSpacing: '0.24em', textTransform: 'uppercase',
            color: COLORS.gold, opacity: 0.75,
          }}>
            {tr ? 'Daha Derine — İlgili Sûreler' : 'Go Deeper — Related Suras'}
          </span>
        </div>

        <div className="g-1-3" style={{
          display: 'grid',
          gap: '12px',
        }}>
          {[
            { href: `/${language}/oku/35`, titleTr: 'Fâtır Sûresi (35)', titleEn: 'Sura Fāṭir (35)', descTr: 'Anchor verse 35:27 — yağmurdan farklı renklerde meyveler, dağlardan farklı renklerde yollar.', descEn: 'Anchor verse 35:27 — fruits of varying colors from rain, paths of varying colors in mountains.' },
            { href: `/${language}/oku/55`, titleTr: 'Rahmân Sûresi (55)', titleEn: 'Sura ar-Raḥmān (55)', descTr: 'Hapax مُدْهَامَّتَانِ (55:64) — Kur\'an\'da bir kez geçen "koyu yeşil" kelimesinin cennet bağlamı.', descEn: 'Hapax مُدْهَامَّتَانِ (55:64) — the once-occurring word "deep green" in its paradise context.' },
            { href: `/${language}/oku/2`, titleTr: 'Bakara 2:187', titleEn: 'al-Baqara 2:187', descTr: 'Beyaz iplik / siyah iplik — oruç ayetindeki renklerin işlevsel kullanımı.', descEn: 'The white thread / black thread — the functional use of colors in the fasting verse.' },
          ].map((tt, i) => (
            <a className="mq-box"
              key={i}
              href={tt.href}
              style={{
                display: 'block',
                background: `linear-gradient(180deg, ${COLORS.goldAlpha04} 0%, rgba(255,255,255,0.02) 100%)`,
                border: `1px solid ${COLORS.goldAlpha25}`,
                borderRadius: RADIUS.lg,
                '--pt-d': "22px", '--pt-m': "20px", '--pr-d': "22px", '--pr-m': "18px", '--pb-d': "22px", '--pb-m': "20px", '--pl-d': "22px", '--pl-m': "18px",
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
                  {tr ? tt.titleTr : tt.titleEn}
                </h4>
                <span style={{ color: COLORS.gold, opacity: 0.75, fontSize: '1rem' }}>→</span>
              </div>
              <p style={{
                fontFamily: FONTS.body,
                fontSize: '0.85rem',
                color: COLORS.silver,
                lineHeight: 1.6,
                margin: 0, opacity: 0.85,
              }}>
                {tr ? tt.descTr : tt.descEn}
              </p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
