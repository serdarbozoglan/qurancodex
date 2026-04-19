import { useState, useEffect, useId } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import {
  OVERLAY_BASE, OVERLAY_HEADER, OVERLAY_TITLE, CLOSE_BTN,
  FONTS, COLORS,
} from '../tokens';

const TABS = {
  RENKLER:   'renkler',
  BAGLAM:    'baglam',
  CENNET:    'cennet',
  KIYAMET:   'kiyamet',
  DILBILIM:  'dilbilim',
  KAYNAKLAR: 'kaynaklar',
};

const TAB_LABELS = {
  renkler:   { tr: 'RENKLER',         en: 'COLORS' },
  baglam:    { tr: 'BAĞLAM HARİTASI', en: 'CONTEXT MAP' },
  cennet:    { tr: 'CENNET PALETİ',   en: 'PARADISE PALETTE' },
  kiyamet:   { tr: 'KIYAMETİN RENKLERİ', en: "JUDGMENT'S COLORS" },
  dilbilim:  { tr: 'DİLBİLİM',        en: 'LINGUISTICS' },
  kaynaklar: { tr: 'KAYNAKLAR',       en: 'SOURCES' },
};

// ── Shared micro-components ──────────────────────────────────────────────────

function HapaxBadge() {
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:'3px', fontSize:'0.6rem', fontWeight:700, color:COLORS.purple, background:'rgba(83,74,183,0.12)', border:'1px solid rgba(83,74,183,0.28)', borderRadius:'20px', padding:'1px 7px', whiteSpace:'nowrap' }}>
      ✦ Hapax · 1×
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
        style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:'18px', height:'18px', borderRadius:'50%', background:'rgba(59,130,246,0.08)', border:'1px solid rgba(59,130,246,0.2)', color:'rgba(59,130,246,0.7)', fontSize:'0.6rem', fontWeight:700, cursor:'pointer', flexShrink:0 }}
      >ℹ</button>
      {open && (
        <div
          id={tooltipId}
          role="tooltip"
          style={{ position:'absolute', bottom:'22px', left:'50%', transform:'translateX(-50%)', width:'240px', padding:'10px 12px', background:'rgba(8,10,26,0.97)', border:'1px solid rgba(59,130,246,0.2)', borderRadius:'10px', boxShadow:'0 8px 24px rgba(0,0,0,0.5)', color:'rgba(148,163,184,0.9)', fontSize:'0.71rem', lineHeight:1.6, zIndex:30 }}
        >
          {text}
        </div>
      )}
    </span>
  );
}

const CONTEXT_BADGES = {
  cennet:   { labelTr: 'Cennet',   labelEn: 'Paradise',  bg: 'rgba(29,158,117,0.15)',  color: '#1D9E75' },
  kiyamet:  { labelTr: 'Kıyamet',  labelEn: 'Judgment',  bg: 'rgba(200,50,50,0.12)',   color: COLORS.softRed },
  doga:     { labelTr: 'Doğa',     labelEn: 'Nature',    bg: 'rgba(59,130,246,0.10)',  color: '#60a5fa' },
  kissa:    { labelTr: 'Kıssa',    labelEn: 'Narrative', bg: 'rgba(212,165,116,0.12)', color: COLORS.gold },
  mucize:   { labelTr: 'Mucize',   labelEn: 'Miracle',   bg: 'rgba(201,169,110,0.12)', color: '#c9a96e' },
  kozmik:   { labelTr: 'Kozmik',   labelEn: 'Cosmic',    bg: 'rgba(139,92,246,0.12)',  color: COLORS.purple },
  cehennem: { labelTr: 'Cehennem', labelEn: 'Hell',      bg: 'rgba(239,68,68,0.12)',   color: '#f87171' },
};

const FILTERS_CONFIG = [
  { id: 'tumu',    labelTr: 'Tümü',     labelEn: 'All' },
  { id: 'cennet',  labelTr: 'Cennet',   labelEn: 'Paradise' },
  { id: 'kiyamet', labelTr: 'Kıyamet',  labelEn: 'Judgment' },
  { id: 'doga',    labelTr: 'Doğa',     labelEn: 'Nature' },
  { id: 'kissa',   labelTr: 'Kıssa',    labelEn: 'Narrative' },
  { id: 'hapax',   labelTr: 'Hapax',    labelEn: 'Hapax' },
];

function ColorCard({ renk, language, isMobile, expanded, onToggle }) {
  const tr = language === 'tr';
  const hasHapax = renk.arabicTerms.some(t => t.isHapax);
  const primaryTerm = renk.arabicTerms[0];

  return (
    <div
      role="button"
      tabIndex={0}
      aria-expanded={expanded}
      onClick={onToggle}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(); } }}
      style={{ background: renk.tintBg, border: `1px solid ${renk.tintBorder}`, borderRadius: '10px', overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.15s', userSelect: 'none' }}
      onMouseEnter={e => { if (!isMobile) e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      {/* Color swatch */}
      <div style={{ height: '60px', background: renk.hexColor }} />

      {/* Card body */}
      <div style={{ padding: '14px' }}>
        {/* Primary Arabic term */}
        <p style={{ fontFamily: FONTS.quran, fontSize: '1.7rem', color: COLORS.gold, textAlign: 'right', direction: 'rtl', margin: '0 0 6px', lineHeight: 1.6 }} lang="ar" dir="rtl">
          {primaryTerm.arabic}
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
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '5px' }}>
          <span style={{ fontSize: '0.72rem', color: COLORS.silver, fontFamily: FONTS.body, marginRight: '2px' }}>
            ~{renk.totalMentions}{tr ? ' ayet' : ' v.'}
          </span>
          {renk.contexts.map(ctx => {
            const b = CONTEXT_BADGES[ctx];
            if (!b) return null;
            return (
              <span key={ctx} style={{ fontSize: '0.68rem', padding: '3px 9px', background: b.bg, color: b.color, borderRadius: '10px', fontFamily: FONTS.body, fontWeight: 600 }}>
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
              <div style={{ marginBottom: '12px' }}>
                <p style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: COLORS.gold, fontFamily: FONTS.body, margin: '0 0 8px' }}>
                  {tr ? 'Kelime Formları' : 'Word Forms'}
                </p>
                {renk.arabicTerms.map(t => (
                  <div key={t.arabic} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontFamily: FONTS.quran, fontSize: '1.3rem', color: COLORS.gold, direction: 'rtl' }} lang="ar">{t.arabic}</span>
                      <span style={{ fontSize: '0.72rem', color: COLORS.silver, fontFamily: FONTS.body, fontStyle: 'italic' }}>{t.transliteration}</span>
                      {t.isHapax && <HapaxBadge />}
                    </div>
                    <span style={{ fontSize: '0.7rem', color: COLORS.silver, fontFamily: FONTS.body }}>{t.mentionCount}×</span>
                  </div>
                ))}
              </div>
            )}

            {/* Key verse */}
            <div style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${renk.tintBorder}`, borderLeft: `3px solid ${renk.hexColor}`, borderRadius: '8px', padding: '12px 14px', marginBottom: '12px' }}>
              <p style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: COLORS.gold, fontFamily: FONTS.body, margin: '0 0 8px', opacity: 0.7 }}>
                {tr ? 'Örnek Ayet' : 'Key Verse'}
              </p>
              <p style={{ fontFamily: FONTS.quran, fontSize: '1.4rem', color: COLORS.gold, textAlign: 'right', direction: 'rtl', lineHeight: 2, margin: '0 0 8px' }} lang="ar" dir="rtl">
                {renk.keyVerseAr}
              </p>
              <p style={{ fontSize: '0.85rem', color: COLORS.silver, fontStyle: 'italic', margin: '0 0 6px', fontFamily: FONTS.body, lineHeight: 1.6 }}>
                "{tr ? renk.keyVerseTr : renk.keyVerseEn}"
              </p>
              <span style={{ fontSize: '0.72rem', color: `${renk.hexColor}bb`, fontWeight: 600, fontFamily: FONTS.body }}>
                — {renk.keyVerseRef}
              </span>
            </div>

            {/* Summary */}
            <p style={{ fontSize: '0.85rem', color: COLORS.silver, lineHeight: 1.7, fontFamily: FONTS.body, margin: '0 0 12px' }}>
              {tr ? renk.summaryTr : renk.summaryEn}
            </p>

            {/* All refs */}
            {renk.allRefs && renk.allRefs.length > 1 && (
              <div style={{ marginBottom: '10px' }}>
                <p style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: COLORS.silver, fontFamily: FONTS.body, margin: '0 0 8px', opacity: 0.7 }}>
                  {tr ? 'Diğer Ayetler' : 'Other Verses'}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {renk.allRefs.filter(r => r !== renk.keyVerseRef).map(ref => (
                    <span key={ref} style={{ fontSize: '0.72rem', padding: '3px 10px', background: `${renk.hexColor}18`, border: `1px solid ${renk.hexColor}40`, color: renk.hexColor, borderRadius: '20px', fontFamily: FONTS.body, fontWeight: 600 }}>
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
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={`${COLORS.gold}80`} strokeWidth="2.5" strokeLinecap="round"
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
  if (!data) return <p style={{ color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.85rem' }}>{tr ? 'Yükleniyor…' : 'Loading…'}</p>;

  const filtered = data.renkler.filter(r => {
    if (activeFilter === 'tumu') return true;
    if (activeFilter === 'hapax') return r.arabicTerms.some(t => t.isHapax);
    return r.contexts.includes(activeFilter);
  });

  return (
    <div>
      {/* Filter pills */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {FILTERS_CONFIG.map(f => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            style={{ padding: '5px 14px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontFamily: FONTS.body, fontSize: '0.72rem', fontWeight: 600, transition: 'all 0.15s', background: activeFilter === f.id ? COLORS.gold : 'rgba(255,255,255,0.06)', color: activeFilter === f.id ? COLORS.cosmicBlack : COLORS.silver }}
          >
            {tr ? f.labelTr : f.labelEn}
          </button>
        ))}
      </div>

      {/* Card grid */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: '12px', marginBottom: '32px', alignItems: 'start' }}>
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
        <div style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${COLORS.glassBorder}`, borderRadius: '12px', padding: isMobile ? '16px' : '20px' }}>
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

          {/* 3-stage timeline with animated progression */}
          <div style={{ display: 'flex', alignItems: 'stretch', gap: 0, marginBottom: '20px', borderRadius: '10px', overflow: 'hidden', position: 'relative' }}>
            {data.renkSekans.stages.map((s, i) => {
              const isLight = i < 2;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ duration: 0.6, delay: i * 0.3, ease: [0.4, 0, 0.2, 1] }}
                  style={{
                    flex: 1, background: s.hexColor, padding: '14px 8px',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px',
                    borderRight: i < 2 ? '2px solid rgba(255,255,255,0.15)' : 'none',
                    transformOrigin: 'left center',
                    position: 'relative',
                  }}
                >
                  {/* Stage number */}
                  <span style={{
                    width: '20px', height: '20px', borderRadius: '50%',
                    background: isLight ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.6rem', fontWeight: 800, color: isLight ? '#0a0a1a' : COLORS.offWhite,
                    fontFamily: FONTS.body,
                  }}>
                    {i + 1}
                  </span>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: isLight ? '#0a0a1a' : COLORS.offWhite, fontFamily: FONTS.body, textAlign: 'center' }}>
                    {tr ? s.labelTr : s.labelEn}
                  </span>
                  <span style={{ fontSize: '0.6rem', color: isLight ? 'rgba(0,0,0,0.55)' : 'rgba(255,255,255,0.5)', fontFamily: FONTS.body, textAlign: 'center', lineHeight: 1.3 }}>
                    {tr ? s.noteTr : s.noteEn}
                  </span>
                  {/* Arrow connector between stages */}
                  {i < 2 && (
                    <div style={{
                      position: 'absolute', right: '-7px', top: '50%', transform: 'translateY(-50%)',
                      width: 0, height: 0, zIndex: 2,
                      borderTop: '7px solid transparent', borderBottom: '7px solid transparent',
                      borderLeft: `7px solid ${s.hexColor}`,
                    }} />
                  )}
                </motion.div>
              );
            })}
          </div>

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
                  padding: '4px 12px', borderRadius: '20px', cursor: 'pointer',
                  border: `1px solid ${expandedVerse === v.ref ? COLORS.gold : 'rgba(212,165,116,0.35)'}`,
                  background: expandedVerse === v.ref ? 'rgba(212,165,116,0.15)' : 'transparent',
                  color: expandedVerse === v.ref ? COLORS.gold : COLORS.silver,
                  fontSize: '0.75rem', fontFamily: FONTS.body, fontWeight: 600,
                  transition: 'all 0.15s',
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
            const stageColors = { green: '#1D9E75', yellow: '#CA8A04', dry: '#78624A' };
            const stageLabels = {
              green:  { tr: 'Yeşil aşama',  en: 'Green stage' },
              yellow: { tr: 'Sarı aşama',   en: 'Yellow stage' },
              dry:    { tr: 'Kuru aşama',   en: 'Dry stage' },
            };
            return (
              <div style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid rgba(212,165,116,0.2)`, borderRadius: '10px', overflow: 'hidden', marginBottom: '12px' }}>
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
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: stageColors[s.stage], flexShrink: 0 }} />
                        <span style={{ fontSize: '0.68rem', fontWeight: 700, color: stageColors[s.stage], fontFamily: FONTS.body }}>
                          {tr ? stageLabels[s.stage].tr : stageLabels[s.stage].en}
                        </span>
                      </div>
                      {/* Keyword + note */}
                      <div style={{ flex: 1 }}>
                        <span style={{ fontFamily: FONTS.quran, fontSize: '1rem', color: stageColors[s.stage], direction: 'rtl', marginRight: '8px' }} lang="ar">
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

function TabBaglam({ language, isMobile }) {
  const tr = language === 'tr';
  const [expandedItem, setExpandedItem] = useState(null); // "sectionIdx-colorIdx"

  const sections = [
    {
      titleTr: 'Cennet Paleti',
      titleEn: 'Paradise Palette',
      accentColor: '#1D9E75',
      descTr: "Kur'an cennetin renklerini doğrudan adlandırmaz — nesneler aracılığıyla verir. Dikkat çekici olan: cennet tasvirinde kırmızı, turuncu ve sarı yoktur. Serin, sakin tonlar hâkim.",
      descEn: "The Quran names paradise colors through objects, not directly. Notably: no red, orange or yellow in paradise imagery. Cool, serene tones dominate.",
      colors: [
        {
          hex: '#1D9E75', nameTr: 'Yeşil — Elbiseler', nameEn: 'Green — Garments',
          verseAr: 'يَلْبَسُونَ ثِيَابًا خُضْرًا مِّن سُندُسٍ وَإِسْتَبْرَقٍ',
          verseTr: 'İnce ipek ve kalın ipekten yeşil elbiseler giyerler.',
          verseEn: 'They wear green garments of fine silk and brocade.',
          ref: 'Kehf 18:31',
          noteTr: "Yeşil + altın ikilisi Kur'an'ın cennet renk çiftidir — Kehf, İnsan ve Dehr sûrelerinde tekrar eder.",
          noteEn: "Green + gold is the Quran's paradise color pairing — repeating in Al-Kahf, Al-Insan and Ad-Dahr.",
        },
        {
          hex: '#B8860B', nameTr: 'Altın — Bilezikler', nameEn: 'Gold — Bracelets',
          verseAr: 'يُحَلَّوْنَ فِيهَا مِنْ أَسَاوِرَ مِن ذَهَبٍ وَلُؤْلُؤًا',
          verseTr: 'Orada altın bilezikler ve incilerle süslenirler.',
          verseEn: 'They are adorned therein with bracelets of gold and pearl.',
          ref: 'Hac 22:23',
          noteTr: "Altın bilezik motifi 3 sûrede tekrarlanır: Hac, Kehf, Fatır. Altın cennetin metalik rengidir — dünyada yasak olan erkeklere cennetin hediyesi.",
          noteEn: "Gold bracelet motif repeats in 3 suras: Al-Hajj, Al-Kahf, Fatir. Gold is paradise's metallic color — the gift of paradise to men forbidden it in the world.",
        },
        {
          hex: '#64748B', nameTr: 'Gümüş — Kaplar', nameEn: 'Silver — Vessels',
          verseAr: 'وَيُطَافُ عَلَيْهِم بِآنِيَةٍ مِّن فِضَّةٍ وَأَكْوَابٍ كَانَتْ قَوَارِيرَا ۝ قَوَارِيرَ مِن فِضَّةٍ',
          verseTr: 'Gümüşten kaplar ve billur kadehlerle dolaşılır — gümüşten billur.',
          verseEn: 'Silver vessels and crystal cups circulate — crystal of silver.',
          ref: 'İnsan 76:15-16',
          noteTr: "'Gümüşten billur' — billurın şeffaflığında gümüş parlaklığı. İki malzemenin özelliği tek nesnede. Kur'an'ın en özgün malzeme tasviri.",
          noteEn: "'Crystal of silver' — silver's sheen with crystal's transparency. Two material properties in one object.",
        },
        {
          hex: '#0F4C35', nameTr: 'Koyu Yeşil — Bahçeler', nameEn: 'Dark Green — Gardens',
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
      accentColor: '#B91C1C',
      descTr: "Cehennem renkleri cennetin tam zıttı: yeşil ve altın yok. Siyah, sarı ve kırmızı — ısı, yanma ve ceza tonları. Zıtlık kasıtlı ve sistematik.",
      descEn: "Hell's colors are the exact opposite of paradise: no green, no gold. Black, yellow and red — heat, burning and punishment tones. The contrast is deliberate and systematic.",
      colors: [
        {
          hex: '#1E1B4B', nameTr: 'Siyah — Duman', nameEn: 'Black — Smoke',
          verseAr: 'وَظِلٍّ مِّن يَحْمُومٍ ۝ لَّا بَارِدٍ وَلَا كَرِيمٍ',
          verseTr: 'Simsiyah bir duman gölgesinde — ne serin ne de hoş.',
          verseEn: 'In the shade of black smoke — neither cool nor pleasant.',
          ref: 'Vâkıa 56:43-44',
          noteTr: "يَحْمُوم (yahmûm) — kuzgun/kömür siyahı. Cennetin 'serinliğine' karşı bu gölge ne serindir ne de güzel. Her şey cennetle tezat.",
          noteEn: "يَحْمُوم (yahmûm) — raven/coal black. Contrasting paradise's 'coolness,' this shade is neither cool nor good. Everything is opposite to paradise.",
        },
        {
          hex: '#CA8A04', nameTr: 'Sarı — Kıvılcımlar', nameEn: 'Yellow — Sparks',
          verseAr: 'إِنَّهَا تَرْمِي بِشَرَرٍ كَالْقَصْرِ ۝ كَأَنَّهُ جِمَالَتٌ صُفْرٌ',
          verseTr: 'Saraylar büyüklüğünde kıvılcımlar fırlatıyor — sanki sarı develer gibi.',
          verseEn: 'It throws sparks as large as a palace — as if they were yellow camels.',
          ref: 'Mürselat 77:32-33',
          noteTr: "Sarının tek olumlu kullanımı Bakara'daki inek. Burada sarı: cehennem kıvılcımı, sarı deve — büyük, ürkütücü, yakıcı.",
          noteEn: "Yellow's only positive use is Al-Baqarah's cow. Here yellow: hellfire spark, yellow camel — large, terrifying, burning.",
        },
        {
          hex: '#B91C1C', nameTr: 'Kırmızı — Gökyüzü', nameEn: 'Red — The Sky',
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
      accentColor: '#C8D6E5',
      descTr: "Kıyamet sahnesi Kur'an'da en yoğun renk bağlamıdır. Renk burada sembolik sınıflandırıcıdır: beyaz yüz = kurtuluş, siyah yüz = azap. Tek ayette iki kutup.",
      descEn: "The judgment scene is the most color-dense context in the Quran. Color here is a symbolic classifier: white face = salvation, black face = punishment. Two poles in one verse.",
      colors: [
        {
          hex: '#C8D6E5', nameTr: 'Beyaz — Kurtulanların Yüzü', nameEn: "White — The Saved's Faces",
          verseAr: 'يَوْمَ تَبْيَضُّ وُجُوهٌ وَتَسْوَدُّ وُجُوهٌ',
          verseTr: 'Yüzlerin beyazlayacağı ve yüzlerin kararacağı gün.',
          verseEn: 'The day when faces will turn white and faces will turn black.',
          ref: 'Âl-i İmrân 3:106',
          noteTr: "Tek ayette iki zıt renk. تَبْيَضُّ (beyazlaşmak) ve تَسْوَدُّ (kararışmak) fiilleri birlikte — renk burada ahlaki durumu gösterir.",
          noteEn: "Two opposing colors in one verse. تَبْيَضُّ (to whiten) and تَسْوَدُّ (to blacken) together — color here indicates moral state.",
        },
        {
          hex: '#2563EB', nameTr: 'Mavi/Donuk — Gözler', nameEn: 'Blue/Glazed — Eyes',
          verseAr: 'وَنَحْشُرُ الْمُجْرِمِينَ يَوْمَئِذٍ زُرْقًا',
          verseTr: 'O gün suçluları gözleri donuk/mavimsi olarak haşredeceğiz.',
          verseEn: 'That day We will gather the criminals with blue/glazed eyes.',
          ref: 'Tâhâ 20:102',
          noteTr: "زُرْق (zurk) — Arapça'da hem 'mavi' hem 'donuk, kör gibi' anlamına gelir. Korku ve dehşetten donup kalan göz. Müfessirler ikisi üzerinde ayrılır.",
          noteEn: "زُرْق (zurq) — means both 'blue' and 'glazed, blind-like' in Arabic. Eyes frozen in terror and horror. Commentators are divided between both meanings.",
        },
        {
          hex: '#B91C1C', nameTr: 'Kırmızı — Gökyüzü', nameEn: 'Red — The Sky',
          verseAr: 'فَإِذَا انشَقَّتِ السَّمَاءُ فَكَانَتْ وَرْدَةً كَالدِّهَانِ',
          verseTr: 'Gökyüzü yarılıp kırmızı yağ gibi olduğunda.',
          verseEn: 'When the sky is split open and turns red like oil.',
          ref: 'Rahman 55:37',
          noteTr: "Kıyametin kozmik işareti: gökyüzünün rengi kırmızıya dönüşüyor. Gündelik mavi gökyüzünün tam zıttı.",
          noteEn: "The cosmic sign of judgment: the sky's color transforms to red. The exact opposite of the everyday blue sky.",
        },
        {
          hex: '#1E1B4B', nameTr: 'Siyah — Azap Görenler', nameEn: 'Black — The Punished',
          verseAr: 'وَأَمَّا الَّذِينَ اسْوَدَّتْ وُجُوهُهُمْ أَكَفَرْتُم بَعْدَ إِيمَانِكُمْ',
          verseTr: 'Yüzleri kararan kimseler ise: "İman ettikten sonra mı inkâr ettiniz?"',
          verseEn: 'As for those whose faces turn black: "Did you disbelieve after your faith?"',
          ref: 'Âl-i İmrân 3:106',
          noteTr: "Aynı ayette beyazla zıtlık. Kararma burada inanç dönüşümünün simgesi — sadece fiziksel değil, manevi durum.",
          noteEn: "Contrast with white in the same verse. Blackening here symbolizes a reversal of faith — not just physical but moral state.",
        },
      ],
    },
    {
      titleTr: 'Doğa Paleti',
      titleEn: 'Nature Palette',
      accentColor: '#d4a574',
      descTr: "Doğa tasvirinde renk hem gerçekçi hem sembolik. Fâtır 35:27 jeolojik bir gözlem — dağlardaki mineral şeritleri. Bakara 2:187 rengi pratik bir zaman ölçütü olarak kullanır.",
      descEn: "In nature descriptions, color is both realistic and symbolic. Fatir 35:27 is a geological observation — mineral streaks in mountains. Al-Baqarah 2:187 uses color as a practical time measure.",
      colors: [
        {
          hex: '#C8D6E5', nameTr: 'Beyaz — Dağ Şeritleri', nameEn: 'White — Mountain Streaks',
          verseAr: 'وَمِنَ الْجِبَالِ جُدَدٌ بِيضٌ وَحُمْرٌ مُّخْتَلِفٌ أَلْوَانُهَا وَغَرَابِيبُ سُودٌ',
          verseTr: 'Dağlarda beyaz, kırmızı — renkleri birbirinden farklı — ve simsiyah şeritler vardır.',
          verseEn: 'And among the mountains are streaks of white and red of varying shades, and some intensely black.',
          ref: 'Fâtır 35:27',
          noteTr: "جُدَد (cüded) — mineral şeritler. Tek ayette 3 renk: beyaz (kalsit/kireçtaşı), kırmızı (demir oksit), siyah (bazalt/mika). Modern jeoloji bu şeritleri tanır.",
          noteEn: "جُدَد (judad) — mineral streaks. Three colors in one verse: white (calcite/limestone), red (iron oxide), black (basalt/mica). Modern geology recognizes these streaks.",
        },
        {
          hex: '#B91C1C', nameTr: 'Kırmızı — Dağ Şeritleri', nameEn: 'Red — Mountain Streaks',
          verseAr: 'وَمِنَ الْجِبَالِ جُدَدٌ بِيضٌ وَحُمْرٌ مُّخْتَلِفٌ أَلْوَانُهَا وَغَرَابِيبُ سُودٌ',
          verseTr: 'Dağlarda beyaz, kırmızı — renkleri birbirinden farklı — ve simsiyah şeritler vardır.',
          verseEn: 'And among the mountains are streaks of white and red of varying shades, and some intensely black.',
          ref: 'Fâtır 35:27',
          noteTr: "مُّخْتَلِفٌ أَلْوَانُهَا (muhteli­fun elvânuhâ) — renkleri birbirinden farklı. Kırmızı için özellikle bu çokluk nitelemesi var — demir oksitin farklı yoğunluklarına işaret.",
          noteEn: "مُّخْتَلِفٌ أَلْوَانُهَا — 'of varying shades' applies specifically to red — pointing to the different concentrations of iron oxide.",
        },
        {
          hex: '#1E1B4B', nameTr: 'Siyah — Dağ Şeritleri', nameEn: 'Black — Mountain Streaks',
          verseAr: 'وَغَرَابِيبُ سُودٌ',
          verseTr: 'Ve simsiyah.',
          verseEn: 'And intensely black.',
          ref: 'Fâtır 35:27',
          noteTr: "غَرَابِيب (garâbîb) — kuzgun/karga kökünden. Siyahın en yoğun tonu için özel kelime. 'Siyah siyah' anlamında pekiştirme — Türkçe'deki 'simsiyah' gibi.",
          noteEn: "غَرَابِيب (gharabib) — from ghurab (raven/crow). A special word for the most intense shade of black. Intensifying 'black black' — like English 'pitch black.'",
        },
        {
          hex: '#F0F0F0', nameTr: 'Beyaz — Şafak Çizgisi', nameEn: 'White — Dawn Line',
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
      accentColor: '#C8D6E5',
      descTr: "Mucizelerin rengi Kur'an'da tutarlı biçimde beyazdır. Sarı yalnızca bir kez olumlu bağlamda — Bakara'nın ineği. Bu tutarlılık tesadüf değil.",
      descEn: "The color of miracles in the Quran is consistently white. Yellow appears positively only once — Al-Baqarah's cow. This consistency is not coincidental.",
      colors: [
        {
          hex: '#C8D6E5', nameTr: "Beyaz — Hz. Musa'nın Eli", nameEn: "White — Moses' Hand",
          verseAr: 'وَأَدْخِلْ يَدَكَ فِي جَيْبِكَ تَخْرُجْ بَيْضَاءَ مِنْ غَيْرِ سُوءٍ',
          verseTr: 'Elini koynuna sok; hastalıksız beyaz olarak çıksın.',
          verseEn: 'Put your hand into your garment; it will come out white without disease.',
          ref: 'Neml 27:12',
          noteTr: "Hz. Musa'nın eli 5 sûrede beyaz mucize olarak geçer: Bakara, Araf, Taha, Neml, Kasas. 'Hastalıksız beyaz' — hastalık (alacalık/lepra) beyazından ayrımak için özel vurgu.",
          noteEn: "Moses' hand appears as a white miracle in 5 suras: Al-Baqarah, Al-A'raf, Ta-Ha, An-Naml, Al-Qasas. 'White without disease' — special emphasis to distinguish from disease (vitiligo/leprosy).",
        },
        {
          hex: '#CA8A04', nameTr: "Sarı — Bakara'nın İneği", nameEn: "Yellow — Al-Baqarah's Cow",
          verseAr: 'إِنَّهَا بَقَرَةٌ صَفْرَاءُ فَاقِعٌ لَّوْنُهَا تَسُرُّ النَّاظِرِينَ',
          verseTr: 'O, rengi pırıl pırıl olan sarı bir inektir; bakanlara sevinç veriyor.',
          verseEn: 'It is a yellow cow, bright in color, pleasing to those who see it.',
          ref: 'Bakara 2:69',
          noteTr: "صَفْرَاءُ فَاقِعٌ (safrâ fâkı') — fâkı' sarının en parlak, en saf tonudur. Kur'an'da sarının tek mutlu bağlamı. Tüm diğer sarı kullanımları olumsuz veya nötr.",
          noteEn: "صَفْرَاءُ فَاقِعٌ (safrâ fâqi') — fâqi' is the brightest, purest shade of yellow. The only joyful use of yellow in the Quran. All other yellow uses are negative or neutral.",
        },
        {
          hex: '#C8D6E5', nameTr: "Beyaz — Hz. İsa'nın Mucizesi", nameEn: "White — Jesus' Miracle",
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {sections.map((section, si) => (
        <div key={si} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${COLORS.glassBorder}`, borderRadius: '12px', overflow: 'hidden' }}>
          {/* Section header */}
          <div style={{ padding: isMobile ? '14px' : '16px 20px', borderBottom: `1px solid rgba(255,255,255,0.05)`, background: `linear-gradient(135deg, rgba(0,0,0,0.2), transparent)` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <div style={{ width: '3px', height: '14px', background: section.accentColor, borderRadius: '2px', flexShrink: 0 }} />
              <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: section.accentColor, fontFamily: FONTS.body }}>
                {tr ? section.titleTr : section.titleEn}
              </span>
            </div>
            <p style={{ fontSize: '0.95rem', color: COLORS.silver, lineHeight: 1.7, fontFamily: FONTS.body, margin: 0 }}>
              {tr ? section.descTr : section.descEn}
            </p>
          </div>

          {/* Color items */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {section.colors.map((c, ci) => {
              const key = `${si}-${ci}`;
              const isOpen = expandedItem === key;
              return (
                <div key={ci} style={{ borderBottom: ci < section.colors.length - 1 ? `1px solid rgba(255,255,255,0.04)` : 'none' }}>
                  {/* Row */}
                  <button
                    onClick={() => setExpandedItem(isOpen ? null : key)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      width: '100%', padding: isMobile ? '10px 14px' : '12px 20px',
                      background: isOpen ? 'rgba(255,255,255,0.04)' : 'transparent',
                      border: 'none', cursor: 'pointer', textAlign: 'left',
                      transition: 'background 0.15s',
                    }}
                  >
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: c.hex, flexShrink: 0, boxShadow: `0 0 6px ${c.hex}60` }} />
                    <span style={{ flex: 1, fontSize: '0.85rem', color: COLORS.offWhite, fontFamily: FONTS.body, fontWeight: 600 }}>
                      {tr ? c.nameTr : c.nameEn}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: COLORS.gold, fontFamily: FONTS.body, opacity: 0.8, flexShrink: 0 }}>
                      {c.ref}
                    </span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={COLORS.silver} strokeWidth="2.5" strokeLinecap="round"
                      style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', flexShrink: 0 }}>
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  {/* Expanded verse */}
                  {isOpen && (
                    <div style={{ padding: isMobile ? '12px 14px 14px' : '14px 20px 16px', background: 'rgba(0,0,0,0.2)', borderTop: `1px solid rgba(255,255,255,0.05)` }}>
                      <p style={{ fontFamily: FONTS.quran, fontSize: '1.8rem', color: COLORS.gold, textAlign: 'right', direction: 'rtl', lineHeight: 2, margin: '0 0 12px' }} lang="ar" dir="rtl">
                        {c.verseAr}
                      </p>
                      <p style={{ fontFamily: FONTS.body, fontSize: '0.95rem', color: COLORS.offWhite, fontStyle: 'italic', margin: '0 0 10px', lineHeight: 1.7 }}>
                        "{tr ? c.verseTr : c.verseEn}"
                      </p>
                      <p style={{ fontFamily: FONTS.body, fontSize: '0.9rem', color: COLORS.silver, margin: '0 0 8px', lineHeight: 1.65 }}>
                        {tr ? c.noteTr : c.noteEn}
                      </p>
                      <span style={{ fontSize: '0.85rem', color: 'rgba(212,165,116,0.6)', fontFamily: FONTS.body, fontWeight: 600 }}>— {c.ref}</span>
                      {c.isHapax && (
                        <span style={{ marginLeft: '10px', fontSize: '0.72rem', color: COLORS.purple, fontFamily: FONTS.body, fontWeight: 600, background: 'rgba(83,74,183,0.15)', padding: '2px 8px', borderRadius: '10px', border: '1px solid rgba(83,74,183,0.3)' }}>
                          Hapax
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function TabCennet({ language, isMobile }) {
  const tr = language === 'tr';

  const swatches = [
    { hex: '#1D9E75', labelTr: 'Yeşil',      labelEn: 'Green',      noteTr: 'Elbiseler',   noteEn: 'Garments' },
    { hex: '#B8860B', labelTr: 'Altın',       labelEn: 'Gold',       noteTr: 'Bilezikler',  noteEn: 'Bracelets' },
    { hex: '#64748B', labelTr: 'Gümüş',       labelEn: 'Silver',     noteTr: 'Kaplar',      noteEn: 'Vessels' },
    { hex: '#0F4C35', labelTr: 'Koyu Yeşil',  labelEn: 'Dark Green', noteTr: 'Bahçeler',    noteEn: 'Gardens' },
    { hex: '#F0F0F0', labelTr: 'Beyaz',       labelEn: 'White',      noteTr: 'Süt nehri',   noteEn: 'Milk river', implied: true },
    { hex: '#C8A832', labelTr: 'Bal/Krem',    labelEn: 'Honey/Cream',noteTr: 'Bal nehri',   noteEn: 'Honey river', implied: true },
  ];

  const analyses = [
    {
      ref: 'Kehf 18:31',
      verseAr: 'يَلْبَسُونَ ثِيَابًا خُضْرًا مِّن سُندُسٍ وَإِسْتَبْرَقٍ',
      verseTr: 'İnce ipekten yeşil elbiseler giyerler.',
      verseEn: 'They wear green garments of fine silk and brocade.',
      noteTr: "Cennetin 3 unsuru bir ayette: yeşil elbise + altın bilezik + taht. Yeşil + altın ikilisi Kur'an'ın cennet renk çiftidir — üç sûrede tekrar eder.",
      noteEn: "Three elements of paradise in one verse: green garment + gold bracelet + throne. Green + gold is the Quran's paradise color pairing — repeating across three suras.",
    },
    {
      ref: 'Rahman 55:64',
      verseAr: 'مُدْهَامَّتَانِ',
      verseTr: 'İkisi de koyu yemyeşil.',
      verseEn: 'Both of them are intensely dark green.',
      noteTr: "'Mudhammatân' — bu formda Kur'an'da yalnızca bu ayette. İkili form, iki cennet bahçesini tanımlar. Yeşilin o kadar yoğun olduğu ki neredeyse siyaha döndüğü ton — cennette 'extra yeşil.'",
      noteEn: "'Mudhammatân' — appears only in this verse in this form. Dual, describing the two paradise gardens. Green so intense it borders on black — paradise's 'extra green.'",
      isHapax: true,
    },
    {
      ref: 'İnsan 76:15-16',
      verseAr: 'وَيُطَافُ عَلَيْهِم بِآنِيَةٍ مِّن فِضَّةٍ وَأَكْوَابٍ كَانَتْ قَوَارِيرَا ۝ قَوَارِيرَ مِن فِضَّةٍ',
      verseTr: 'Gümüşten kaplar ve billur kadehlerle dolaşılır — gümüşten billur.',
      verseEn: 'Silver vessels and crystal cups circulate among them — crystal of silver.',
      noteTr: "'Gümüşten billur' — billurın şeffaflığında gümüş. İki malzemenin özelliği tek nesnede. Kur'an'ın cennet dilinin en özgün malzeme tasviri.",
      noteEn: "'Crystal of silver' — silver's sheen with crystal's transparency. Two material properties in one object. The Quran's most distinctive material description in paradise language.",
    },
  ];

  return (
    <div>
      <p style={{ fontSize: '0.85rem', color: COLORS.silver, lineHeight: 1.7, fontFamily: FONTS.body, marginBottom: '20px' }}>
        {tr
          ? "Kur'an cennetin renklerini doğrudan adlandırmaz — nesneler aracılığıyla renk verir. Cennet tasvirinde ısınma tonları (kırmızı, turuncu) yok; serin ve sakin tonlar (yeşil, gümüş) ağırlıkta."
          : "The Quran doesn't name paradise colors directly — it gives color through objects. Warm tones (red, orange) are absent; cool, calm tones (green, silver) dominate."}
      </p>

      {/* Swatch grid */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(3,1fr)', gap: '8px', marginBottom: '24px' }}>
        {swatches.map((s, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${COLORS.glassBgStrong}`, borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{ height: '36px', background: s.hex, opacity: s.implied ? 0.7 : 1, borderBottom: s.implied ? '2px dashed rgba(255,255,255,0.25)' : 'none' }} />
            <div style={{ padding: '8px' }}>
              <p style={{ fontSize: '0.88rem', fontWeight: 700, color: COLORS.offWhite, fontFamily: FONTS.body, margin: '0 0 2px' }}>
                {tr ? s.labelTr : s.labelEn}
                {s.implied && <span style={{ fontSize: '0.62rem', color: COLORS.silver, marginLeft: '4px', fontWeight: 400, fontStyle: 'italic' }}>{tr ? '(ima edilen)' : '(implied)'}</span>}
              </p>
              <p style={{ fontSize: '0.78rem', color: COLORS.silver, fontFamily: FONTS.body, margin: 0 }}>
                {tr ? s.noteTr : s.noteEn}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Verse analyses */}
      {analyses.map((a, i) => (
        <div key={i} style={{ background: 'rgba(29,158,117,0.05)', border: '1px solid rgba(29,158,117,0.15)', borderRadius: '10px', padding: isMobile ? '14px' : '18px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: COLORS.gold, fontFamily: FONTS.body }}>{a.ref}</span>
            {a.isHapax && <HapaxBadge />}
          </div>
          <p style={{ fontFamily: FONTS.quran, fontSize: '1.8rem', color: COLORS.gold, textAlign: 'right', direction: 'rtl', lineHeight: 2, margin: '0 0 6px' }} lang="ar" dir="rtl">
            {a.verseAr}
          </p>
          <p style={{ fontSize: '0.88rem', color: COLORS.silver, fontStyle: 'italic', fontFamily: FONTS.body, margin: '0 0 8px' }}>
            {tr ? a.verseTr : a.verseEn}
          </p>
          <p style={{ fontSize: '0.88rem', color: COLORS.silver, lineHeight: 1.6, fontFamily: FONTS.body, margin: 0 }}>
            {tr ? a.noteTr : a.noteEn}
          </p>
        </div>
      ))}
    </div>
  );
}

function TabKiyamet({ language, isMobile }) {
  const tr = language === 'tr';
  const WHITE_FACE = '#C8D6E5';

  const scenes = [
    {
      titleTr: 'Gökyüzünün Kırmızıya Dönmesi',
      titleEn: "The Sky's Transformation to Red",
      verseAr: 'فَإِذَا انشَقَّتِ السَّمَاءُ فَكَانَتْ وَرْدَةً كَالدِّهَانِ',
      verseTr: 'Gök yarıldığında kırmızı deri gibi, erimiş yağ gibi olacak.',
      verseEn: 'And when the sky breaks apart and becomes rose-red like oil.',
      ref: 'Rahman 55:37',
      hex: '#B91C1C',
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
      hex: '#C8D6E5',
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
      hex: '#2563EB',
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

  return (
    <div>
      {/* White/Black contrast header */}
      <div style={{ display: isMobile ? 'flex' : 'grid', flexDirection: isMobile ? 'column' : undefined, gridTemplateColumns: isMobile ? undefined : '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
        <div style={{ background: 'rgba(200,214,229,0.08)', border: '1px solid rgba(200,214,229,0.2)', borderRadius: '10px', padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: WHITE_FACE, fontFamily: FONTS.body, marginBottom: '8px' }}>
            {tr ? 'Kurtulanlar' : 'The Saved'}
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: WHITE_FACE, fontFamily: FONTS.body, marginBottom: '4px' }}>
            {tr ? 'Yüzleri Ağarır' : 'Faces Turn White'}
          </div>
          <p style={{ fontSize: '0.82rem', color: COLORS.silver, fontFamily: FONTS.body, margin: 0 }}>Al-i İmran 3:107</p>
        </div>
        <div style={{ background: 'rgba(30,27,75,0.4)', border: `1px solid ${COLORS.glassBgStrong}`, borderRadius: '10px', padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: COLORS.silver, fontFamily: FONTS.body, marginBottom: '8px' }}>
            {tr ? 'Kaybedenler' : 'The Lost'}
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: COLORS.silver, fontFamily: FONTS.body, marginBottom: '4px' }}>
            {tr ? 'Yüzleri Kararır' : 'Faces Turn Black'}
          </div>
          <p style={{ fontSize: '0.82rem', color: COLORS.silver, fontFamily: FONTS.body, margin: 0 }}>Zümer 39:60</p>
        </div>
      </div>

      {/* 4 scene cards */}
      {scenes.map((s, i) => (
        <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${COLORS.glassBgStrong}`, borderLeft: `3px solid ${s.hex}`, borderRadius: '10px', padding: isMobile ? '14px' : '18px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: s.hex, flexShrink: 0 }} />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: COLORS.offWhite, fontFamily: FONTS.body }}>{tr ? s.titleTr : s.titleEn}</span>
            {(s.infoTr || s.infoEn) && <InfoPopover text={tr ? s.infoTr : s.infoEn} />}
          </div>
          <p style={{ fontFamily: FONTS.quran, fontSize: '1.8rem', color: COLORS.gold, textAlign: 'right', direction: 'rtl', lineHeight: 2, margin: '0 0 6px' }} lang="ar" dir="rtl">
            {s.verseAr}
          </p>
          <p style={{ fontSize: '0.88rem', color: COLORS.silver, fontStyle: 'italic', fontFamily: FONTS.body, margin: '0 0 8px' }}>
            {tr ? s.verseTr : s.verseEn} — <span style={{ fontWeight: 600 }}>{s.ref}</span>
          </p>
          <p style={{ fontSize: '0.88rem', color: COLORS.silver, lineHeight: 1.6, fontFamily: FONTS.body, margin: 0 }}>
            {tr ? s.noteTr : s.noteEn}
          </p>
        </div>
      ))}
    </div>
  );
}

function TabDilbilim({ language, isMobile }) {
  const tr = language === 'tr';
  const sectionHdrStyle = { fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.13em', color: COLORS.gold, fontFamily: FONTS.body, margin: '0 0 12px', paddingBottom: '6px', borderBottom: `1px solid ${COLORS.goldAlpha15}` };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Section A: Renk yoğunluğu */}
      <div>
        <p style={sectionHdrStyle}>
          {tr ? 'A — Renk Yoğunluğu Kelimeleri' : 'A — Color Intensity Words'}
        </p>
        <p style={{ fontSize: '0.85rem', color: COLORS.silver, lineHeight: 1.6, fontFamily: FONTS.body, margin: '0 0 12px' }}>
          {tr
            ? "Kur'an normal renk + yoğun renk için farklı kelimeler kullanır. Bu dilbilimsel incelik başka Sami dillerinde karşılaştırıldığında Kur'an Arapçasının özgünlüğünü gösterir."
            : "The Quran uses distinct words for normal vs. intense color. This linguistic precision demonstrates the uniqueness of Quranic Arabic compared to other Semitic languages."}
        </p>
        {isMobile ? (
          /* Mobile: card layout */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { normal: 'أَخْضَر (ahdar)', intense: 'مُدْهَامَّتَانِ (mudhammatân)', meaningTr: 'Yeşil / Koyu Yoğun Yeşil', meaningEn: 'Green / Intensely Dark Green' },
              { normal: 'أَسْوَد (esvad)', intense: 'غَرَابِيبُ سُودٌ (garâbîb sûd)', meaningTr: 'Siyah / Kuzgun Siyahı', meaningEn: 'Black / Raven Black' },
            ].map((row, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${COLORS.glassBorder}`, borderRadius: '10px', padding: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: COLORS.silver, fontFamily: FONTS.body }}>{tr ? 'Normal' : 'Normal'}</span>
                  <span style={{ fontSize: '0.85rem', color: COLORS.offWhite, fontFamily: FONTS.body }}>{row.normal}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: COLORS.silver, fontFamily: FONTS.body }}>{tr ? 'Yoğun' : 'Intense'}</span>
                  <span style={{ fontSize: '0.85rem', color: COLORS.purple, fontWeight: 600, fontFamily: FONTS.body }}>{row.intense} <HapaxBadge /></span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: COLORS.silver, fontFamily: FONTS.body }}>{tr ? 'Anlam' : 'Meaning'}</span>
                  <span style={{ fontSize: '0.82rem', color: COLORS.silver, fontFamily: FONTS.body }}>{tr ? row.meaningTr : row.meaningEn}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Desktop: table */
          <div style={{ overflowX: 'auto', borderRadius: '8px', border: `1px solid ${COLORS.glassBorder}` }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: FONTS.body, fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <th style={{ padding: '10px 14px', textAlign: 'left', color: COLORS.gold, fontWeight: 700, borderBottom: `1px solid ${COLORS.glassBorder}` }}>{tr ? 'Normal' : 'Normal'}</th>
                  <th style={{ padding: '10px 14px', textAlign: 'left', color: COLORS.gold, fontWeight: 700, borderBottom: `1px solid ${COLORS.glassBorder}` }}>{tr ? 'Yoğun (Özel Kelime)' : 'Intense (Special Word)'}</th>
                  <th style={{ padding: '10px 14px', textAlign: 'left', color: COLORS.gold, fontWeight: 700, borderBottom: `1px solid ${COLORS.glassBorder}` }}>{tr ? 'Anlam' : 'Meaning'}</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { normal: 'أَخْضَر (ahdar)', intense: 'مُدْهَامَّتَانِ (mudhammatân)', meaningTr: 'Yeşil / Koyu Yoğun Yeşil', meaningEn: 'Green / Intensely Dark Green' },
                  { normal: 'أَسْوَد (esvad)', intense: 'غَرَابِيبُ سُودٌ (garâbîb sûd)', meaningTr: 'Siyah / Kuzgun Siyahı', meaningEn: 'Black / Raven Black' },
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '10px 14px', color: COLORS.offWhite }}>{row.normal}</td>
                    <td style={{ padding: '10px 14px', color: COLORS.purple, fontWeight: 600 }}>{row.intense} <HapaxBadge /></td>
                    <td style={{ padding: '10px 14px', color: COLORS.silver }}>{tr ? row.meaningTr : row.meaningEn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Section B: Hapax renk kelimeleri */}
      <div>
        <p style={sectionHdrStyle}>
          {tr ? 'B — Hapax Renk Kelimeleri' : 'B — Hapax Color Words'}
        </p>
        {[
          {
            arabic: 'مُدْهَامَّتَانِ',
            ref: 'Rahman 55:64',
            formTr: 'İkili, sıfat', formEn: 'Dual adjective',
            noteTr: "Bu formda Kur'an'da yalnızca bir kez — gerçek bir hapax legomenon. İki cennet bahçesini tanımlar, kökü 'd-h-m' (siyaha çalan koyu ton).",
            noteEn: "Appears only once in the Quran in this form — a true hapax legomenon. Describes two paradise gardens, root 'd-h-m' (dark shade tending to black).",
          },
          {
            arabic: 'كَالدِّهَانِ',
            ref: 'Rahman 55:37',
            formTr: 'Teşbih (benzetme)', formEn: 'Simile',
            noteTr: "Kıyamette gökyüzünün rengi — erimiş kırmızı yağa benzetme. Bu formda nadir.",
            noteEn: "The color of the sky at judgment — compared to melted red oil. Rare in this form.",
          },
        ].map((h, i) => (
          <div key={i} style={{ background: 'rgba(83,74,183,0.08)', border: '1px solid rgba(83,74,183,0.2)', borderRadius: '10px', padding: '14px', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{ fontFamily: FONTS.quran, fontSize: '1.3rem', color: COLORS.gold, direction: 'rtl' }} lang="ar">{h.arabic}</span>
              <HapaxBadge />
              <span style={{ fontSize: '0.75rem', color: COLORS.silver, fontFamily: FONTS.body }}>{h.ref}</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: COLORS.silver, fontFamily: FONTS.body, margin: '0 0 6px' }}>
              <em>{tr ? h.formTr : h.formEn}</em>
            </p>
            <p style={{ fontSize: '0.85rem', color: COLORS.silver, lineHeight: 1.6, fontFamily: FONTS.body, margin: 0 }}>
              {tr ? h.noteTr : h.noteEn}
            </p>
          </div>
        ))}
      </div>

      {/* Section C: Zurk tartışması */}
      <div>
        <p style={sectionHdrStyle}>
          {tr ? "C — 'Zurk' Tartışması (Taha 20:102)" : "C — The 'Zurq' Debate (Ta-Ha 20:102)"}
        </p>
        <p style={{ fontSize: '0.85rem', color: COLORS.silver, lineHeight: 1.6, fontFamily: FONTS.body, margin: '0 0 14px' }}>
          {tr
            ? "'Zurk' kelimesi Arapça'da hem mavi hem donuk/bulanık anlamına gelir. Taha 20:102 bağlamında üç farklı yorum:"
            : "'Zurq' in Arabic means both blue and glazed/cloudy. Three interpretations in the context of Ta-Ha 20:102:"}
        </p>
        <div style={{ display: isMobile ? 'flex' : 'grid', flexDirection: isMobile ? 'column' : undefined, gridTemplateColumns: isMobile ? undefined : 'repeat(3,1fr)', gap: '10px' }}>
          {[
            {
              numTr: '1', titleTr: 'Mavi Gözlü', titleEn: 'Blue-eyed',
              descTr: 'Gerçek mavi göz. Arap kültüründe yabancı veya hastalık çağrışımı taşıyabilir.',
              descEn: 'Literally blue eyes. May carry connotations of foreignness or illness in Arab culture.',
              color: '#2563EB',
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
            <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${COLORS.glassBgStrong}`, borderTop: `3px solid ${v.color}`, borderRadius: '8px', padding: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <span style={{ width: '18px', height: '18px', borderRadius: '50%', background: v.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', color: COLORS.offWhite, fontWeight: 700, flexShrink: 0 }}>{v.numTr}</span>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: COLORS.offWhite, fontFamily: FONTS.body }}>{tr ? v.titleTr : v.titleEn}</span>
                <InfoPopover text={tr ? "Tefsir geleneğinde bu yorum için farklı alimler farklı gerekçeler sunar." : "Different scholars in the tafsir tradition offer different justifications for this interpretation."} />
              </div>
              <p style={{ fontSize: '0.8rem', color: COLORS.silver, lineHeight: 1.5, fontFamily: FONTS.body, margin: 0 }}>
                {tr ? v.descTr : v.descEn}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Section D: İmplied colors */}
      <div>
        <p style={sectionHdrStyle}>
          {tr ? 'D — Nesne Üzerinden İma Edilen Renkler' : 'D — Colors Implied Through Objects'}
        </p>
        <p style={{ fontSize: '0.85rem', color: COLORS.silver, lineHeight: 1.6, fontFamily: FONTS.body, margin: '0 0 14px' }}>
          {tr
            ? "Kur'an bazen rengi doğrudan söylemez — nesneyi vererek rengi ima eder. Bu 'söylemeden anlatmak' Kur'an'ın dil ekonomisinin özelliğidir:"
            : "The Quran sometimes doesn't state the color directly — it implies the color by naming the object. This 'showing without telling' is characteristic of Quranic language economy:"}
        </p>
        {[
          {
            hex: '#F1F5F9',
            objectTr: 'Süt', objectEn: 'Milk',
            colorTr: '→ Beyaz', colorEn: '→ White',
            verseAr: 'أَنْهَارٌ مِّن لَّبَنٍ لَّمْ يَتَغَيَّرْ طَعْمُهُ',
            verseTr: '…tadı değişmeyen süt nehirleri…',
            verseEn: '…rivers of milk whose taste does not change…',
            ref: 'Muhammed 47:15',
            noteTr: "Süt beyazdır — ama Kur'an rengi söylemez. Renk, nesnenin zihinde çağrışımıyla gelir.",
            noteEn: "Milk is white — but the Quran doesn't say so. The color arrives through the object's mental association.",
          },
          {
            hex: '#CA8A04',
            objectTr: 'Bal', objectEn: 'Honey',
            colorTr: '→ Amber / Sarı', colorEn: '→ Amber / Yellow',
            verseAr: 'وَأَنْهَارٌ مِّنْ عَسَلٍ مُّصَفًّى',
            verseTr: '…ve saf baldan nehirler…',
            verseEn: '…and rivers of purified honey…',
            ref: 'Muhammed 47:15',
            noteTr: "'Musaffâ' — arındırılmış, süzülmüş. Renk adı yok; amber ton nesnenin kendisinde gizli.",
            noteEn: "'Musaffâ' — purified, filtered. No color named; the amber hue is concealed in the object itself.",
          },
          {
            hex: '#B91C1C',
            objectTr: 'Ateş / Alev', objectEn: 'Fire / Flame',
            colorTr: '→ Kırmızı / Turuncu', colorEn: '→ Red / Orange',
            verseAr: 'لَوَّاحَةٌ لِّلْبَشَرِ',
            verseTr: 'İnsanı kavuran (rengi değiştiren).',
            verseEn: 'Scorching to the skin (altering its color).',
            ref: 'Müddessir 74:29',
            noteTr: "'Levvâha' kökü renk değişikliği anlamını içerir — ateş insanın tenini kızartır ve karartur. Kırmızı/siyah ama söylenmez.",
            noteEn: "The root 'lavvâha' implies color change — fire reddens and blackens the skin. Red/black, but left unstated.",
          },
        ].map((row, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${COLORS.glassBgStrong}`, borderLeft: `3px solid ${row.hex}`, borderRadius: '10px', padding: isMobile ? '12px' : '16px', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: row.hex, flexShrink: 0 }} />
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: COLORS.offWhite, fontFamily: FONTS.body }}>{tr ? row.objectTr : row.objectEn}</span>
              </div>
              <span style={{ fontSize: '0.78rem', color: COLORS.gold, fontFamily: FONTS.body, fontStyle: 'italic' }}>{tr ? row.colorTr : row.colorEn}</span>
            </div>
            <p style={{ fontFamily: FONTS.quran, fontSize: '1.6rem', color: COLORS.gold, textAlign: 'right', direction: 'rtl', lineHeight: 1.9, margin: '0 0 4px' }} lang="ar" dir="rtl">
              {row.verseAr}
            </p>
            <p style={{ fontSize: '0.8rem', color: COLORS.silver, fontStyle: 'italic', fontFamily: FONTS.body, margin: '0 0 8px' }}>
              {tr ? row.verseTr : row.verseEn} — <span style={{ fontWeight: 600, color: COLORS.offWhite }}>{row.ref}</span>
            </p>
            <p style={{ fontSize: '0.82rem', color: COLORS.silver, lineHeight: 1.6, fontFamily: FONTS.body, margin: 0 }}>
              {tr ? row.noteTr : row.noteEn}
            </p>
          </div>
        ))}
      </div>

      {/* Section E: Beyazın çoğul/cinsiyet yapısı */}
      <div>
        <p style={sectionHdrStyle}>
          {tr ? "E — Beyazın Kök Genişlemesi: بيض → Yumurta" : "E — White's Root Expansion: بيض → Egg"}
        </p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
          {[
            { ar: 'أَبْيَض', note: tr ? 'tekil, eril' : 'singular masc.' },
            { ar: 'بَيْضَاء', note: tr ? 'tekil, dişil / parlak' : 'singular fem. / radiant' },
            { ar: 'بِيضٌ', note: tr ? 'çoğul' : 'plural' },
            { ar: 'بَيْضَة', note: tr ? 'yumurta — aynı kök!' : 'egg — same root!' },
          ].map((w, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '8px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', border: `1px solid ${COLORS.glassBgStrong}` }}>
              <span style={{ fontFamily: FONTS.quran, fontSize: '1.6rem', color: COLORS.gold, direction: 'rtl' }} lang="ar">{w.ar}</span>
              <span style={{ fontSize: '0.82rem', color: COLORS.silver, fontFamily: FONTS.body }}>{w.note}</span>
            </div>
          ))}
        </div>
        <p style={{ fontSize: '0.85rem', color: COLORS.silver, lineHeight: 1.6, fontFamily: FONTS.body, margin: 0 }}>
          {tr
            ? "'Beyza' yumurta anlamına da gelir — beyazlık ve yumurta aynı kökten. Vakıa 56:23'te cennet sakinleri 'saklı yumurta gibi' (beyaz). Renk kelimesi anlam genişlemesiyle imge üretiyor."
            : "'Bayda' also means egg — whiteness and egg share the same root. In Al-Waqi'a 56:23, paradise companions are 'like hidden eggs' (white). The color word generates imagery through semantic extension."}
        </p>
      </div>

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

  return (
    <div>
      {/* Global info note */}
      <div style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '10px', padding: '14px 16px', marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
        <span style={{ color: 'rgba(59,130,246,0.7)', fontSize: '0.9rem', flexShrink: 0, marginTop: '1px' }}>ℹ</span>
        <p style={{ fontSize: '0.75rem', color: COLORS.silver, lineHeight: 1.6, fontFamily: FONTS.body, margin: 0 }}>
          {tr
            ? "Bu sayfada Kur'an'ın renk kelimelerinin taşıdığı sembolik anlamlar tefsir geleneğine dayanmaktadır. Kur'an renk sembolizmini açıkça tanımlamaz — bu yorumlar ℹ️ ile işaretlenmiştir. Renk kelimelerinin dilbilimsel analizleri Arapça sözlük ve tefsir kaynaklarına dayanmaktadır."
            : "The symbolic meanings attributed to the Quran's color words on this page are based on the classical tafsir tradition. The Quran does not explicitly define color symbolism — such interpretations are marked with ℹ️. Linguistic analyses of color words are based on Arabic lexicography and tafsir sources."}
        </p>
      </div>

      {sections.map((sec, i) => (
        <div key={i} style={{ marginBottom: '20px' }}>
          <p style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.13em', color: COLORS.gold, fontFamily: FONTS.body, margin: '0 0 10px', paddingBottom: '6px', borderBottom: `1px solid ${COLORS.goldAlpha15}` }}>
            {tr ? sec.titleTr : sec.titleEn}
          </p>
          {sec.items.map((item, j) => (
            <div key={j} style={{ padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'baseline', gap: '10px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: COLORS.offWhite, fontFamily: FONTS.body, minWidth: '140px', flexShrink: 0 }}>{item.name}</span>
              <span style={{ fontSize: '0.75rem', color: COLORS.silver, fontFamily: FONTS.body, fontStyle: 'italic' }}>{item.detail}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function KuranRenkleri({ onClose }) {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const [data, setData]               = useState(null);
  const [activeTab, setActiveTab]     = useState(TABS.RENKLER);
  const [activeFilter, setActiveFilter] = useState('tumu');
  const [isMobile, setIsMobile]       = useState(() => window.innerWidth < 640);
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
    const h = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  // Escape key
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  const tabStyle = (id) => ({
    padding: isMobile ? '12px 14px' : '13px 22px',
    borderRadius: '0',
    border: 'none',
    background: activeTab === id ? COLORS.goldAlpha15 : 'transparent',
    borderBottom: activeTab === id ? `2px solid ${COLORS.gold}` : '2px solid transparent',
    color: activeTab === id ? COLORS.gold : COLORS.silver,
    fontSize: isMobile ? '0.85rem' : '0.9rem',
    fontWeight: activeTab === id ? 600 : 400,
    fontFamily: FONTS.body,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'all 0.15s',
    flexShrink: 0,
  });

  return (
    <div style={{ ...OVERLAY_BASE, display: 'flex', flexDirection: 'column' }} role="dialog" aria-modal="true">
      {/* ── Header ── */}
      <div style={OVERLAY_HEADER}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="13.5" cy="6.5" r=".5" fill={COLORS.gold} />
            <circle cx="17.5" cy="10.5" r=".5" fill={COLORS.gold} />
            <circle cx="8.5" cy="7.5" r=".5" fill={COLORS.gold} />
            <circle cx="6.5" cy="12.5" r=".5" fill={COLORS.gold} />
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.992 6.012 17.477 2 12 2z" />
          </svg>
          <span style={OVERLAY_TITLE}>
            {tr ? "Kur'an'ın Renkleri" : 'Colors of the Quran'}
          </span>
          <span style={{ color: 'rgba(148,163,184,0.5)', fontSize: '0.8rem', flexShrink: 0 }}>·</span>
          <span style={{ color: 'rgba(148,163,184,0.5)', fontSize: '0.78rem', fontFamily: FONTS.body }}>
            {tr ? 'Elvânü\'l-Kur\'ân' : 'Alwān al-Quran'}
          </span>
        </div>
        <button
          onClick={onClose}
          style={CLOSE_BTN}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = COLORS.offWhite; }}
          onMouseLeave={e => { e.currentTarget.style.background = CLOSE_BTN.background; e.currentTarget.style.color = COLORS.silver; }}
          aria-label="Kapat"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>

      {/* ── Scrollable body ── */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>

        {/* ── Hero ── */}
        <div style={{ padding: isMobile ? '20px 16px 16px' : '28px 32px 24px', background: 'linear-gradient(180deg,#0d1b2a 0%,#0a0a1a 100%)', borderBottom: `1px solid ${COLORS.glassBorderSoft}` }}>
          {/* Page label */}
          <div style={{ fontSize: '0.62rem', letterSpacing: '0.15em', color: COLORS.gold, textTransform: 'uppercase', fontFamily: FONTS.body, fontWeight: 700, marginBottom: '8px' }}>
            {tr ? "KUR'AN'IN RENK PALETİ" : "THE QURAN'S COLOR PALETTE"}
          </div>

          {/* Title */}
          <h1 style={{ fontSize: isMobile ? '1.4rem' : '1.8rem', fontWeight: 700, fontFamily: FONTS.display, color: COLORS.offWhite, margin: '0 0 16px', lineHeight: 1.3 }}>
            {tr ? "Allah'ın Seçtiği Renkler" : 'The Colors Allah Chose'}
          </h1>

          {/* Arabic verse */}
          <div style={{ textAlign: 'center', padding: isMobile ? '12px' : '16px', background: 'rgba(212,165,116,0.06)', border: `1px solid ${COLORS.goldAlpha15}`, borderRadius: '10px', marginBottom: '16px' }}>
            <p style={{ fontFamily: FONTS.quran, fontSize: isMobile ? '1.6rem' : '2rem', color: COLORS.gold, textAlign: 'center', direction: 'rtl', lineHeight: 2, margin: '0 0 12px' }} lang="ar" dir="rtl">
              أَلَمْ تَرَ أَنَّ اللَّهَ أَنزَلَ مِنَ السَّمَاءِ مَاءً فَأَخْرَجْنَا بِهِ ثَمَرَاتٍ مُّخْتَلِفًا أَلْوَانُهَا
            </p>
            <p style={{ fontSize: isMobile ? '0.85rem' : '0.95rem', color: COLORS.silver, fontFamily: FONTS.body, fontStyle: 'italic', margin: 0, lineHeight: 1.7 }}>
              {tr
                ? '"Allah\'ın gökten su indirdiğini ve onunla renkleri birbirinden farklı meyveler çıkardığımızı görmüyor musun?" — Fâtır 35:27'
                : '"Do you not see that Allah sends down rain from the sky, and We produce thereby fruits of varying colors?" — Fatir 35:27'}
            </p>
          </div>

          {/* Stat strip — horizontal scroll on mobile, single row on desktop */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: '4px', WebkitOverflowScrolling: 'touch' }}>
            {[
              { num: '8',   labelTr: 'Temel Renk',   labelEn: 'Core Colors' },
              { num: '14',  labelTr: 'Renk Kelimesi', labelEn: 'Color Words' },
              { num: '~18', labelTr: 'Beyaz Ayet',    labelEn: 'White Verses' },
              { num: tr ? 'Yeşil' : 'Green', labelTr: 'Cennet Rengi', labelEn: 'Paradise Color' },
              { arabic: 'مُدْهَامَّتَانِ', labelTr: 'Hapax', labelEn: 'Hapax' },
            ].map((s, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '8px 14px', borderRadius: '20px', flexShrink: 0,
                background: s.arabic ? 'rgba(83,74,183,0.12)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${s.arabic ? 'rgba(83,74,183,0.25)' : 'rgba(255,255,255,0.08)'}`,
              }}>
                {s.arabic ? (
                  <span style={{ fontFamily: FONTS.quran, fontSize: '0.95rem', color: COLORS.purple, direction: 'rtl' }} lang="ar">{s.arabic}</span>
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

        {/* ── Fâtır 35:27 Feature Card ── */}
        <div style={{ margin: isMobile ? '0 16px 16px' : '0 32px 20px', padding: isMobile ? '16px' : '20px', background: 'linear-gradient(135deg,rgba(29,158,117,0.08),rgba(200,50,50,0.08),rgba(30,30,50,0.15))', border: `1px solid ${COLORS.glassBorder}`, borderRadius: '12px' }}>
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
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { ar: 'بِيضٌ', label: tr ? 'Beyaz' : 'White', bg: '#C8D6E5', fg: '#0a0a1a' },
              { ar: 'حُمْرٌ', label: tr ? 'Kırmızı' : 'Red',   bg: '#B91C1C', fg: '#fff' },
              { ar: 'غَرَابِيبُ سُودٌ', label: tr ? 'Simsiyah' : 'Jet Black', bg: '#1E1B4B', fg: COLORS.offWhite },
            ].map(p => (
              <div key={p.ar} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 16px', background: p.bg, borderRadius: '24px' }}>
                <span style={{ fontFamily: FONTS.quran, fontSize: '1.4rem', color: p.fg, direction: 'rtl' }} lang="ar">{p.ar}</span>
                <span style={{ fontSize: '0.88rem', color: p.fg, fontFamily: FONTS.body, fontWeight: 700 }}>{p.label}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: '0.92rem', color: COLORS.silver, fontFamily: FONTS.body, margin: '14px 0 0', lineHeight: 1.7 }}>
            {tr
              ? "'Garâbîb' kuzgun/karga (ghurab) kökünden — siyahın en yoğun tonu için özel kelime. 'Mudhammatân' (koyu yeşil) ile paralel: Kur'an renk yoğunluğunu ifade etmek için kök değiştirerek yeni kelime üretir."
              : "'Gharabib' derives from ghurab (raven/crow) — a special word for the most intense shade of black. Parallel to 'mudhammatân' (intense green): the Quran creates new words by changing roots to express color intensity."}
          </p>
        </div>

        {/* ── Tab bar ── */}
        <div style={{ position: 'sticky', top: 0, zIndex: 10, background: 'rgba(10,10,26,0.97)', backdropFilter: 'blur(20px)' }}>
          <div style={{
            display: 'flex', gap: '2px',
            padding: isMobile ? '0 8px' : '0 16px',
            borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
            overflowX: 'auto', scrollbarWidth: 'none',
            flexShrink: 0,
          }}>
            {Object.values(TABS).map(id => (
              <button
                key={id}
                style={tabStyle(id)}
                onClick={() => { setActiveTab(id); setExpandedVerse(null); }}
                onMouseEnter={e => { if (activeTab !== id) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = COLORS.offWhite; } }}
                onMouseLeave={e => { if (activeTab !== id) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = COLORS.silver; } }}
              >
                {TAB_LABELS[id][language] ?? TAB_LABELS[id].tr}
              </button>
            ))}
          </div>
          {/* Fade indicator — right edge hint for scrollable tabs on mobile */}
          {isMobile && (
            <div style={{
              position: 'absolute', top: 0, right: 0, bottom: 1,
              width: '40px', pointerEvents: 'none',
              background: 'linear-gradient(to right, transparent, rgba(10,10,26,0.95))',
            }} />
          )}
        </div>

        {/* ── Tab content ── */}
        <div style={{ padding: isMobile ? '16px' : '24px 32px', minHeight: '400px' }}>
          {activeTab === TABS.RENKLER && (
            <TabRenkler data={data} language={language} activeFilter={activeFilter} setActiveFilter={setActiveFilter} isMobile={isMobile} expandedVerse={expandedVerse} setExpandedVerse={setExpandedVerse} />
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

      </div>
    </div>
  );
}
