'use client';

import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { CLOSE_BTN, OVERLAY_TITLE, FONTS, COLORS, TRANSITION, BREAKPOINT_TABLET, RADIUS } from '../tokens';

// ── Category color system ─────────────────────────────────────────────────────
const CAT = {
  vahiy:    { accent: '#B8860B', bg: 'rgba(184,134,11,0.10)',  border: 'rgba(184,134,11,0.28)',  labelTr: 'Vahiy Meleği',    labelEn: 'Revelation' },
  yardim:   { accent: '#3B82F6', bg: 'rgba(59,130,246,0.10)', border: 'rgba(59,130,246,0.28)',  labelTr: 'Yardım Meleği',   labelEn: 'Helper' },
  azap:     { accent: '#D85A30', bg: 'rgba(216,90,48,0.10)',  border: 'rgba(216,90,48,0.28)',   labelTr: 'Azap Meleği',     labelEn: 'Punishment' },
  koruyucu: { accent: '#1D9E75', bg: 'rgba(29,158,117,0.10)', border: 'rgba(29,158,117,0.28)',  labelTr: 'Koruyucu Melek',  labelEn: 'Guardian' },
  kayit:    { accent: '#534AB7', bg: 'rgba(83,74,183,0.10)',  border: 'rgba(83,74,183,0.28)',   labelTr: 'Kayıt Meleği',    labelEn: 'Recorder' },
  yuceltme: { accent: COLORS.softGold, bg: COLORS.softGoldAlpha10, border: COLORS.softGoldAlpha28, labelTr: 'Yüceltme Meleği', labelEn: 'Glorification' },
  gizemlI:  { accent: '#6B7280', bg: 'rgba(107,114,128,0.08)',border: 'rgba(107,114,128,0.22)', labelTr: 'Gizemli',         labelEn: 'Mysterious' },
  hadis:    { accent: '#6B7280', bg: 'rgba(107,114,128,0.06)',border: 'rgba(107,114,128,0.15)', labelTr: 'Hadis Kaynağı',   labelEn: 'Hadith Source' },
};

const HAPAX_COLOR = '#534AB7';
const GOLD = COLORS.softGold;

// ── Reusable micro-components ────────────────────────────────────────────────
function HadisBadge({ language }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '3px',
      fontSize: '0.62rem', fontWeight: 600,
      color: COLORS.softGoldAlpha75,
      background: COLORS.softGoldAlpha08,
      border: `1px solid ${COLORS.softGoldAlpha20}`,
      borderRadius: RADIUS.pillSm, padding: '1px 7px', whiteSpace: 'nowrap',
    }}>
      ℹ {language === 'tr' ? 'Hadis' : 'Hadith'}
    </span>
  );
}

function HapaxBadge({ language }) {
  const [tip, setTip] = useState(false);
  const tipText = language === 'tr'
    ? "Hapax legomenon — Kur'an'da yalnızca 1 kez geçen kelime"
    : "Hapax legomenon — a word that appears only once in the Quran";

  return (
    <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
      <span style={{
        display: 'inline-flex', alignItems: 'center',
        fontSize: '0.62rem', fontWeight: 600,
        color: HAPAX_COLOR,
        background: 'rgba(83,74,183,0.10)',
        border: '1px solid rgba(83,74,183,0.25)',
        borderRadius: RADIUS.pillSm, padding: '1px 7px', whiteSpace: 'nowrap',
      }}>
        Hapax
      </span>
      <span
        onMouseEnter={() => setTip(true)}
        onMouseLeave={() => setTip(false)}
        style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: '14px', height: '14px', borderRadius: RADIUS.full,
          background: 'rgba(83,74,183,0.15)', border: '1px solid rgba(83,74,183,0.35)',
          color: HAPAX_COLOR, fontSize: '0.6rem', fontWeight: 700,
          cursor: 'help', flexShrink: 0,
        }}
      >
        ?
      </span>
      {tip && (
        <span style={{
          position: 'absolute', bottom: '22px', left: 0,
          background: 'rgba(8,10,26,0.97)',
          border: '1px solid rgba(83,74,183,0.4)',
          borderRadius: RADIUS.md, padding: '6px 10px',
          fontSize: '0.72rem', color: '#c8cdd8',
          whiteSpace: 'nowrap', zIndex: 50,
          pointerEvents: 'none',
          boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
        }}>
          {tipText}
        </span>
      )}
    </span>
  );
}

function QuranicBadge({ language }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '3px',
      fontSize: '0.62rem', fontWeight: 700,
      color: '#1D9E75',
      background: 'rgba(29,158,117,0.10)',
      border: '1px solid rgba(29,158,117,0.25)',
      borderRadius: RADIUS.pillSm, padding: '1px 8px', whiteSpace: 'nowrap',
    }}>
      ✓ {language === 'tr' ? "Kur'an'da Geçiyor" : 'In the Quran'}
    </span>
  );
}

function HadithOnlyBadge({ language }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '3px',
      fontSize: '0.62rem', fontWeight: 600,
      color: '#6B7280',
      background: 'rgba(107,114,128,0.08)',
      border: '1px solid rgba(107,114,128,0.2)',
      borderRadius: RADIUS.pillSm, padding: '1px 8px', whiteSpace: 'nowrap',
    }}>
      ⚠ {language === 'tr' ? 'Hadis Kaynağı' : 'Hadith Only'}
    </span>
  );
}

// Hadith grade sub-badge (Münâfık Profili 'mütefekkun aleyh' standartının melek sayfasına uygulanması)
const HADITH_GRADE_META = {
  'mutefekkun-aleyh': { color: '#1D9E75', tr: 'Mütefekkun Aleyh', en: 'Muttafaqun Alayh', noteTr: 'Buhârî + Müslim ortak', noteEn: 'Bukhari + Muslim agreed' },
  'sahih':            { color: '#3B82F6', tr: 'Sahih',            en: 'Sahih',           noteTr: 'Sahih kaynak',       noteEn: 'Sahih source' },
  'hasen':            { color: '#B8860B', tr: 'Hasen',            en: 'Hasan',           noteTr: 'Hasen seviye',       noteEn: 'Hasan grade' },
  'tartismali':       { color: '#D85A30', tr: 'Tartışmalı',       en: 'Disputed',        noteTr: 'Sened/sıhhati tartışmalı', noteEn: 'Chain/grade disputed' },
};

function HadithGradeBadge({ grade, source, language }) {
  const [tip, setTip] = useState(false);
  const meta = HADITH_GRADE_META[grade];
  if (!meta) return null;
  const tr = language === 'tr';
  return (
    <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: '3px',
        fontSize: '0.62rem', fontWeight: 700,
        color: meta.color,
        background: `${meta.color}12`,
        border: `1px solid ${meta.color}30`,
        borderRadius: RADIUS.pillSm, padding: '1px 7px', whiteSpace: 'nowrap',
      }}>
        ◈ {tr ? meta.tr : meta.en}
      </span>
      {source && (
        <span
          onMouseEnter={() => setTip(true)}
          onMouseLeave={() => setTip(false)}
          onClick={() => setTip(v => !v)}
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '14px', height: '14px', borderRadius: RADIUS.full,
            background: `${meta.color}18`, border: `1px solid ${meta.color}40`,
            color: meta.color, fontSize: '0.6rem', fontWeight: 700,
            cursor: 'help', flexShrink: 0,
          }}
        >
          ?
        </span>
      )}
      {tip && source && (
        <span style={{
          position: 'absolute', bottom: '22px', left: 0,
          width: '260px', maxWidth: '70vw',
          background: 'rgba(8,10,26,0.97)',
          border: `1px solid ${meta.color}40`,
          borderRadius: RADIUS.md, padding: '8px 12px',
          fontSize: '0.7rem', color: '#c8cdd8', lineHeight: 1.55,
          zIndex: 50, pointerEvents: 'none',
          boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
          whiteSpace: 'normal',
        }}>
          {source}
        </span>
      )}
    </span>
  );
}

function InfoPopover({ text, language: _language }) {
  const [open, setOpen] = useState(false);
  if (!text) return null;
  return (
    <span style={{ position: 'relative', display: 'inline-flex' }}>
      <button
        onClick={e => { e.stopPropagation(); setOpen(v => !v); }}
        onBlur={() => setOpen(false)}
        style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: '18px', height: '18px', borderRadius: RADIUS.full,
          background: COLORS.softGoldAlpha08, border: `1px solid ${COLORS.softGoldAlpha20}`,
          color: COLORS.softGoldAlpha60, fontSize: '0.6rem', fontWeight: 700,
          cursor: 'pointer', flexShrink: 0,
        }}
        aria-label="Info"
      >
        ℹ
      </button>
      {open && (
        <div style={{
          position: 'absolute', bottom: '22px', left: '50%', transform: 'translateX(-50%)',
          width: '240px', padding: '10px 12px',
          background: 'rgba(8,10,26,0.97)', border: `1px solid ${COLORS.softGoldAlpha20}`,
          borderRadius: RADIUS.chip, boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
          color: 'rgba(148,163,184,0.85)', fontSize: '0.71rem', lineHeight: 1.6,
          zIndex: 30,
        }}>
          {text}
        </div>
      )}
    </span>
  );
}

function VerseBlock({ arabic, translation, verseRef, accent }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: `1px solid ${accent ? `${accent}30` : COLORS.glassBgStrong}`,
      borderLeft: `2px solid ${accent || GOLD}`,
      borderRadius: RADIUS.md, padding: '12px 14px', margin: '8px 0',
    }}>
      {arabic && (
        <p style={{ fontFamily: FONTS.quran, fontSize: '1.55rem', color: GOLD, textAlign: 'right', direction: 'rtl', lineHeight: 2.0, margin: '0 0 10px' }} lang="ar">
          {arabic}
        </p>
      )}
      {translation && (
        <p style={{ fontSize: '0.82rem', color: COLORS.silver, fontStyle: 'italic', margin: '0 0 6px', lineHeight: 1.6 }}>
          {translation}
        </p>
      )}
      {verseRef && (
        <p style={{ fontSize: '0.68rem', color: `${accent || GOLD}80`, fontWeight: 600, margin: 0 }}>
          {verseRef}
        </p>
      )}
    </div>
  );
}

function SectionTitle({ children, color }) {
  return (
    <p style={{
      fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase',
      letterSpacing: '0.15em', color: color || GOLD,
      margin: '0 0 12px', paddingBottom: '6px',
      borderBottom: `1px solid ${color ? `${color}25` : COLORS.softGoldAlpha15}`,
    }}>
      {children}
    </p>
  );
}

// ── TAB 1: MELEKLER ────────────────────────────────────────────────────────────
const FILTERS = [
  { id: 'all',     labelTr: 'Tümü',               labelEn: 'All' },
  { id: 'named',   labelTr: "Kur'an'da İsimli",   labelEn: 'Named in Quran' },
  { id: 'described', labelTr: "Kur'an'da Görevli",labelEn: 'Described in Quran' },
  { id: 'kissa',   labelTr: 'Kıssada',             labelEn: 'In Narratives' },
  { id: 'hadith-only', labelTr: 'Hadis Kaynağı',  labelEn: 'Hadith Source' },
];

const KISSA_IDS = new Set(['cebrail', 'harut-marut', 'melek-ul-mevt', 'muakkibat', 'on-dokuz-bekci']);

function AngelCard({ angel, language, isMobile: _isMobile }) {
  const tr = language === 'tr';
  const cat = CAT[angel.category] || CAT.gizemlI;
  const isHadithOnly = angel.quranicStatus === 'hadith-only';

  return (
    <div style={{
      background: isHadithOnly ? 'rgba(216,90,48,0.04)' : cat.bg,
      border: `1px solid ${isHadithOnly ? 'rgba(216,90,48,0.15)' : cat.border}`,
      borderLeft: `3px solid ${isHadithOnly ? '#D85A30' : cat.accent}`,
      borderRadius: RADIUS.lg, padding: '16px',
      display: 'flex', flexDirection: 'column', gap: '10px',
      opacity: isHadithOnly ? 0.75 : 1,
    }}>
      {/* Top row: Arabic + mention count */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
        {angel.arabicName ? (
          <p style={{ fontFamily: FONTS.quran, fontSize: '1.4rem', color: isHadithOnly ? '#4B5563' : GOLD, direction: 'rtl', margin: 0, lineHeight: 1.4, textAlign: 'right' }} lang="ar">
            {angel.arabicName}
          </p>
        ) : (
          <p style={{ fontSize: '1rem', color: '#374151', fontStyle: 'italic', margin: 0 }}>—</p>
        )}
        {angel.mentionCount > 0 && (
          <span style={{
            fontSize: '0.68rem', fontWeight: 700, flexShrink: 0,
            color: cat.accent, background: `${cat.accent}15`,
            border: `1px solid ${cat.accent}30`, borderRadius: RADIUS.pillSm,
            padding: '2px 8px', marginTop: '4px',
          }}>
            {angel.mentionCount}×
          </span>
        )}
      </div>

      {/* Names + badges */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <p style={{ fontSize: '0.95rem', fontWeight: 700, color: isHadithOnly ? '#6B7280' : COLORS.offWhite, margin: 0 }}>
          {tr ? angel.nameTr : angel.nameEn}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', alignItems: 'center' }}>
          {isHadithOnly ? <HadithOnlyBadge language={language} /> : <QuranicBadge language={language} />}
          <span style={{
            fontSize: '0.62rem', fontWeight: 600, padding: '1px 8px',
            borderRadius: RADIUS.pillSm, border: `1px solid ${cat.accent}30`,
            color: cat.accent, background: `${cat.accent}10`, whiteSpace: 'nowrap',
          }}>
            {tr ? cat.labelTr : cat.labelEn}
          </span>
          {angel.isHapax && <HapaxBadge language={language} />}
          {isHadithOnly && angel.hadithGrade && (
            <HadithGradeBadge grade={angel.hadithGrade} source={tr ? angel.hadithMainSource : angel.hadithMainSource} language={language} />
          )}
        </div>
      </div>

      {/* Key surah */}
      {angel.mainSurah && (
        <p style={{ fontSize: '0.7rem', color: `${cat.accent}80`, fontWeight: 600, margin: 0 }}>
          {angel.mainSurah}
        </p>
      )}

      {/* Summary */}
      <p style={{ fontSize: '0.80rem', color: isHadithOnly ? '#4B5563' : COLORS.silver, margin: 0, lineHeight: 1.6 }}>
        {tr ? angel.summaryTr : angel.summaryEn}
      </p>

      {/* Key verse */}
      {angel.keyVerse && (
        <VerseBlock
          arabic={angel.keyVerse.arabic}
          translation={tr ? angel.keyVerse.turkish : angel.keyVerse.english}
          verseRef={angel.keyVerse.ref}
          accent={cat.accent}
        />
      )}

      {/* ℹ️ Note */}
      {(tr ? angel.infoTr : angel.infoEn) && (
        <div style={{
          fontSize: '0.75rem', color: COLORS.softGoldAlpha65,
          background: COLORS.softGoldAlpha05, border: `1px solid ${COLORS.softGoldAlpha12}`,
          borderRadius: RADIUS.md, padding: '8px 12px', lineHeight: 1.6,
        }}>
          <span style={{ fontWeight: 700 }}>ℹ️ </span>
          {tr ? angel.infoTr : angel.infoEn}
        </div>
      )}

      {/* Alternate names */}
      {angel.alternateNames && angel.alternateNames.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {angel.alternateNames.map((n, i) => (
            <span key={i} style={{
              display: 'inline-flex', alignItems: 'center', gap: '5px',
              background: 'rgba(255,255,255,0.04)', border: `1px solid ${COLORS.glassBgStrong}`,
              borderRadius: RADIUS.md, padding: '4px 10px',
            }}>
              <span style={{ fontFamily: FONTS.quran, fontSize: '0.9rem', color: GOLD }} lang="ar">{n.arabic}</span>
              <span style={{ fontSize: '0.65rem', color: COLORS.slate500 }}>{n.ref}</span>
              {n.isHadisConnection && <InfoPopover text={tr ? 'Tefsir görüşü — Kur\'an doğrudan özdeşleştirmez' : 'Tafsir view — Quran does not equate explicitly'} language={language} />}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
/* eslint-enable react-hooks/refs */

function TabMelekler({ data, language, isMobile }) {
  const tr = language === 'tr';
  const [filter, setFilter] = useState('all');

  const filtered = (data.melekler || []).filter(a => {
    if (filter === 'all') return true;
    if (filter === 'named') return a.quranicStatus === 'named';
    if (filter === 'described') return a.quranicStatus === 'described';
    if (filter === 'kissa') return KISSA_IDS.has(a.id);
    if (filter === 'hadith-only') return a.quranicStatus === 'hadith-only';
    return true;
  });

  return (
    <div>
      {/* Filter pills */}
      <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px', marginBottom: '16px', scrollbarWidth: 'none' }}>
        {FILTERS.map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            style={{
              flexShrink: 0, padding: '5px 12px', borderRadius: RADIUS.pillSm,
              fontSize: '0.75rem', fontFamily: FONTS.body, fontWeight: 500,
              cursor: 'pointer', transition: `all ${TRANSITION.fast}`,
              background: filter === f.id ? COLORS.softGoldAlpha15 : 'rgba(255,255,255,0.04)',
              border: `1px solid ${filter === f.id ? COLORS.softGoldAlpha40 : COLORS.glassBgStrong}`,
              color: filter === f.id ? GOLD : COLORS.silver,
            }}
          >
            {tr ? f.labelTr : f.labelEn}
          </button>
        ))}
      </div>

      {/* Cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '14px' }}>
        {filtered.map(angel => (
          <AngelCard key={angel.id} angel={angel} language={language} isMobile={isMobile} />
        ))}
      </div>
    </div>
  );
}

// ── TAB 2: GÖREVLER ────────────────────────────────────────────────────────────
const GOREV_COLORS = {
  'vahiy-tasimak':   '#B8860B',
  'can-almak':       '#D85A30',
  'korunak-saglamak':'#1D9E75',
  'kayit-tutmak':    '#534AB7',
  'azap-uygulamak':  '#D85A30',
  'savasta-yardim':  '#3B82F6',
  'tesbih-ibadet':   COLORS.softGold,
};

function TabGorevler({ data, language, isMobile: _isMobile }) {
  const tr = language === 'tr';
  return (
    <div>
      <p style={{ fontSize: '0.85rem', color: COLORS.slate500, fontStyle: 'italic', margin: '0 0 20px', lineHeight: 1.6 }}>
        {tr ? "Kur'an melekleri tanım değil görev üzerinden anlatır." : 'The Quran defines angels by function, not by description.'}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {(data.gorevler || []).map((g, i) => {
          const accent = GOREV_COLORS[g.id] || GOLD;
          return (
          <div key={g.id} style={{
            background: `${accent}08`,
            border: `1px solid ${accent}22`,
            borderLeft: `3px solid ${accent}`,
            borderRadius: RADIUS.lg, padding: '18px 20px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.62rem', fontWeight: 700, color: accent, background: `${accent}15`, border: `1px solid ${accent}35`, borderRadius: RADIUS.xs, padding: '2px 7px', flexShrink: 0 }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <p style={{ fontSize: '0.85rem', fontWeight: 700, color: COLORS.offWhite, margin: 0, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {tr ? g.titleTr : g.titleEn}
              </p>
              <p style={{ fontSize: '0.72rem', color: COLORS.slate500, margin: 0, marginLeft: 'auto', whiteSpace: 'nowrap' }}>{g.melek}</p>
            </div>
            <VerseBlock arabic={g.arabic} translation={tr ? g.turkish : g.english} ref={g.ref} accent={accent} />
            <p style={{ fontSize: '0.82rem', color: COLORS.silver, margin: '10px 0 0', lineHeight: 1.65 }}>
              {tr ? g.aciklamaTr : g.aciklamaEn}
            </p>
          </div>
          );
        })}
      </div>
    </div>
  );
}

// ── TAB 3: KISSALAR ────────────────────────────────────────────────────────────
function TabKissalar({ data, language, isMobile }) {
  const tr = language === 'tr';
  const [expanded, setExpanded] = useState(null);

  return (
    <div>
      <p style={{ fontSize: '0.85rem', color: COLORS.slate500, fontStyle: 'italic', margin: '0 0 20px', lineHeight: 1.6 }}>
        {tr
          ? 'Melekler kıssalarda pasif değil — müjde taşır, şehri helak eder, peygambere yoldaş olur.'
          : 'Angels in Quranic narratives are not passive — they announce, destroy cities, accompany prophets.'}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {(data.kissalar || []).map((k, i) => {
          const isOpen = expanded === k.id;
          return (
            <div key={k.id} style={{
              background: isOpen ? COLORS.softGoldAlpha06 : 'rgba(255,255,255,0.03)',
              border: `1px solid ${isOpen ? COLORS.softGoldAlpha25 : COLORS.glassBgStrong}`,
              borderRadius: RADIUS.lg, overflow: 'hidden',
            }}>
              {/* Header row — always visible */}
              <button
                onClick={() => setExpanded(isOpen ? null : k.id)}
                style={{
                  width: '100%', padding: '14px 18px', display: 'flex', alignItems: 'flex-start',
                  justifyContent: 'space-between', gap: '12px',
                  background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', gap: '10px', flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: '0.62rem', fontWeight: 700, color: GOLD, background: COLORS.softGoldAlpha10, borderRadius: RADIUS.xs, padding: '2px 7px', flexShrink: 0, marginTop: '2px' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: '0.88rem', fontWeight: 600, color: COLORS.offWhite, margin: '0 0 3px', lineHeight: 1.3 }}>
                      {tr ? k.titleTr : k.titleEn}
                    </p>
                    {!isOpen && (
                      <p style={{ fontSize: '0.75rem', color: '#4B5563', margin: 0, lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {(tr ? k.anlatimTr : k.anlatimEn)?.split('.')[0] + '.'}
                      </p>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, paddingTop: '2px' }}>
                  <span style={{ fontSize: '0.66rem', color: `${GOLD}60`, whiteSpace: 'nowrap', display: isMobile ? 'none' : 'block' }}>{k.ayetler}</span>
                  <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2.5" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>
              </button>

              {/* Expanded content */}
              {isOpen && (
                <div style={{ padding: '0 18px 18px' }}>
                  <VerseBlock arabic={k.arabic} translation={tr ? k.turkish : k.english} ref={k.ref} />
                  <p style={{ fontSize: '0.82rem', color: COLORS.silver, margin: '10px 0', lineHeight: 1.7 }}>
                    {tr ? k.anlatimTr : k.anlatimEn}
                  </p>
                  {(tr ? k.infoTr : k.infoEn) && (
                    <div style={{
                      fontSize: '0.75rem', color: COLORS.softGoldAlpha65,
                      background: COLORS.softGoldAlpha05, border: `1px solid ${COLORS.softGoldAlpha12}`,
                      borderRadius: RADIUS.md, padding: '8px 12px', lineHeight: 1.6, marginTop: '8px',
                    }}>
                      <span style={{ fontWeight: 700 }}>ℹ️ </span>
                      {tr ? k.infoTr : k.infoEn}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── TAB 4: KUR'AN / HADİS SINIRI ──────────────────────────────────────────────
const COMPARISON_ROWS = [
  { konuTr: "Cebrail'in adı",           konuEn: "Name: Jibril",         quranTr: "✓ 3 kez",     quranEn: "✓ 3 times",     hadisTr: "600 kanat, nur detayları",       hadisEn: "600 wings, light attributes" },
  { konuTr: "Mikail'in adı",            konuEn: "Name: Mika'il",        quranTr: "✓ 1 kez",     quranEn: "✓ 1 time",      hadisTr: "Rızık/yağmur görevi",            hadisEn: "Rain and sustenance role" },
  { konuTr: "Azrail adı",               konuEn: "Name: Azra'il",        quranTr: "✗ Geçmez",    quranEn: "✗ Not in Quran",hadisTr: "İsim ve detaylar hadiste",       hadisEn: "Name and details in hadith" },
  { konuTr: "İsrafil adı",              konuEn: "Name: Israfil",        quranTr: "✗ Geçmez",    quranEn: "✗ Not in Quran",hadisTr: "İsim ve sûr görevi hadiste",     hadisEn: "Name and trumpet role in hadith" },
  { konuTr: "Sur üfleyen melek",        konuEn: "Angel of the trumpet", quranTr: "✓ Var (isimsiz)",quranEn:"✓ Mentioned (unnamed)",hadisTr: "İsrafil ismi hadiste",  hadisEn: "Name Israfil from hadith" },
  { konuTr: "Münker-Nekir",             konuEn: "Munkar & Nakir",       quranTr: "✗ Geçmez",    quranEn: "✗ Not in Quran",hadisTr: "Tamamen hadis",                  hadisEn: "Entirely from hadith" },
  { konuTr: "Rıdvan",                   konuEn: "Ridwan",               quranTr: "✗ Geçmez",    quranEn: "✗ Not in Quran",hadisTr: "Tamamen hadis",                  hadisEn: "Entirely from hadith" },
  { konuTr: "19 bekçi sayısı",          konuEn: "19 keepers",           quranTr: "✓ Müddessir 74:30",quranEn:"✓ Al-Muddaththir 74:30",hadisTr: "Detaylar hadiste",   hadisEn: "Details in hadith" },
  { konuTr: "Kabir sorgusu",            konuEn: "Grave questioning",    quranTr: "✗ Geçmez",    quranEn: "✗ Not in Quran",hadisTr: "Tamamen hadis",                  hadisEn: "Entirely from hadith" },
  { konuTr: "Melekler nurdan yaratılır",konuEn: "Angels from light",    quranTr: "✗ Geçmez",    quranEn: "✗ Not in Quran",hadisTr: "Hadis: Aişe rivayeti",           hadisEn: "Hadith: narrated by Aisha" },
  { konuTr: "Kanat sayısı",             konuEn: "Wing count",           quranTr: "✓ Fâtır 35:1 (2,3,4+)",quranEn:"✓ Fatir 35:1 (2,3,4+)",hadisTr: "600 kanat rivayeti",hadisEn:"600-wing narration in hadith" },
];

const ANALYSIS_CARDS = [
  {
    titleTr: "Neden meleklerin çoğu isimsiz?",
    titleEn: "Why are most angels unnamed?",
    bodyTr: "Kur'an melekleri işlevle tanımlar — isimle değil. 'Ölüm meleği', 'vahiy meleği', 'koruyucu melekler' — görev ön planda, kişilik değil. Klasik Sünnî kelâmında bu 'melek bağımsız bir fail değil, ilâhi bir araçtır' anlayışıyla okunur. Mu'tezile, Mâturîdî ve İslam filozofları aynı ayetleri farklı çıkarımlarla okur (bkz. ‘4 kelâmî pozisyon’ kartı).",
    bodyEn: "The Quran identifies angels by function, not name. 'Angel of death,' 'angel of revelation,' 'guardian angels' — role is primary, not personality. In classical Ash'ari Sunni kalām this is read as 'angels are instruments of divine will, not independent agents.' Mu'tazila, Maturidi and the Islamic philosophers draw different conclusions from the same verses (see ‘4 theological positions’ card below).",
  },
  {
    titleTr: "Melek mi cin mi? İblis örneği",
    titleEn: "Angel or jinn? The case of Iblis",
    bodyTr: "İblis Kur'an'da 'meleklerden' biri olarak anılır (A'raf 7:11) ama başka bir ayette 'cin'dendi' denir (Kehf 18:50). Bu iki ayet arasındaki gerilim tefsir tarihinin en uzun tartışmalarından. Her iki yorum da Kur'an'dan desteklenebilir.",
    bodyEn: "Iblis is grouped with the angels in Al-A'raf 7:11 but described as 'from the jinn' in Al-Kahf 18:50. This tension between two verses is one of the longest-running debates in tafsir history. Both interpretations can be supported from the Quran itself.",
  },
  {
    titleTr: "Melekler cinsiyetsiz mi?",
    titleEn: "Are angels genderless?",
    bodyTr: "Saffat 37:150, Zuhruf 43:19 — Kur'an Arap geleneğindeki 'melekler Allah'ın kızlarıdır' iddiasını reddeder. Meleklere cinsiyet atfetmek Kur'an'a göre delilsiz bir iddiadır.",
    bodyEn: "As-Saffat 37:150 and Az-Zukhruf 43:19 reject the Arab cultural claim that 'angels are daughters of God.' The Quran explicitly refutes this. Attributing gender to angels is presented as an unfounded claim.",
  },
  {
    titleTr: "Melekler hakkında 4 kelâmî pozisyon",
    titleEn: "Four theological positions on angels",
    bodyTr: "Aynı Kur'ânî ayetlerden klasik İslam kelâmı dört farklı sonuç çıkarır: (1) Eş'arî — melekler 'latîf cisimler', nurdan yaratılmış varlıklardır. (2) Mâturîdî — Eş'arî pozisyonuyla uyumlu, ancak meleklerin varlığının akılla da kabul edilebilir olduğunu söyler. (3) Mu'tezile — bazı temsilciler meleklerin ilâhi güçlerin yansıması olduğunu, müstakil cisimsel varlıklar olmayabileceğini öne sürer. (4) İslam filozofları (Fârâbî, İbn Sînâ) — melekleri 'mücerred akıllar' (al-uqūl al-mufāriqa) ile özdeşleştirir; aktif akıl olarak Cebrail. Atlas çoğunluk Sünnî pozisyonu birincil sunar; diğerlerini akademik dürüstlükle açık tutar.",
    bodyEn: "Classical Islamic kalām draws four distinct conclusions from the same Quranic verses: (1) Ash'ari — angels are 'subtle bodies' (latīf), beings created from light. (2) Maturidi — aligns with the Ash'ari view but adds that the existence of angels is also rationally accessible. (3) Mu'tazila — some representatives suggest angels are reflections of divine powers, not necessarily independent corporeal beings. (4) Islamic philosophers (Farabi, Ibn Sina) — identify angels with 'separate intellects' (al-ʿuqūl al-mufāriqa); Jibril as the Active Intellect. The Atlas presents the majority Sunni position as primary while keeping the others academically open.",
  },
  {
    titleTr: "Said Nursi'nin Risâle perspektifi",
    titleEn: "Said Nursi's Risale perspective",
    bodyTr: "Said Nursi, Yirmi Dokuzuncu Söz'de meleklere ve ruhanîlere en kapsamlı Risâle bölümünü ayırır. Pozisyonu klasik Sünnî inanca bağlıdır: melekler ilâhi isimlerin tecellisidir, doğa kuvvetleriyle özdeşleştirilemez. Mi'râc Risâlesi'nde (Otuz Birinci Söz) Cebrail'in vahyi taşıması ve Sidretü'l-Müntehâ ayrıntılı işlenir. Nursi modern bilim ile melek dünyası arasında felsefî bir paralellik kurar — özdeşlik değil. Bu yaklaşım, Türk Müslüman okuyucu için Atlas'ın klasik pozisyonu bağlam içinde okumasını kolaylaştırır.",
    bodyEn: "Said Nursi devotes the most comprehensive Risale-i Nur treatment of angels to the Twenty-Ninth Word. His position remains within classical Sunni doctrine: angels are manifestations of divine names, not to be identified with the forces of nature. The Mi'raj Treatise (Thirty-First Word) elaborates Jibril's bearing of revelation and Sidrat al-Muntaha. Nursi draws a philosophical parallel — not an identification — between modern science and the angelic realm. This framing helps Turkish-Muslim readers situate the Atlas's classical position within a familiar interpretive horizon.",
  },
];

function TabSinir({ language, isMobile: _isMobile }) {
  const tr = language === 'tr';
  return (
    <div>
      <p style={{ fontSize: '0.85rem', color: COLORS.slate500, fontStyle: 'italic', margin: '0 0 16px', lineHeight: 1.6 }}>
        {tr
          ? "Bu sekme sitenin en kritik akademik katkısıdır: Kur'an'da olan ile hadis geleneğinde olan ayrı gösterilir."
          : "This tab is the most critical academic contribution of this page: what is in the Quran vs. what the hadith tradition adds."}
      </p>

      {/* Comparison table */}
      <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '500px' }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${COLORS.glassBorder}` }}>
              {[tr ? 'Konu' : 'Topic', tr ? "Kur'an'da" : 'In the Quran', tr ? 'Hadis Ekler' : 'Hadith Adds'].map((h, i) => (
                <th key={i} style={{
                  padding: '8px 12px', textAlign: 'left',
                  fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase',
                  letterSpacing: '0.1em', color: i === 1 ? '#1D9E75' : i === 2 ? GOLD : COLORS.slate500,
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPARISON_ROWS.map((row, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${COLORS.glassBg}`, background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                <td style={{ padding: '9px 12px', fontSize: '0.78rem', color: COLORS.offWhite, fontWeight: 500 }}>{tr ? row.konuTr : row.konuEn}</td>
                <td style={{ padding: '9px 12px', fontSize: '0.75rem', color: (tr ? row.quranTr : row.quranEn).startsWith('✓') ? '#1D9E75' : '#D85A30' }}>
                  {tr ? row.quranTr : row.quranEn}
                </td>
                <td style={{ padding: '9px 12px', fontSize: '0.75rem', color: COLORS.silver }}>{tr ? row.hadisTr : row.hadisEn}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Analysis cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {ANALYSIS_CARDS.map((card, i) => (
          <div key={i} style={{
            background: 'rgba(255,255,255,0.03)',
            border: `1px solid ${COLORS.glassBgStrong}`,
            borderLeft: `3px solid ${COLORS.softGoldAlpha40}`,
            borderRadius: RADIUS.chip, padding: '14px 16px',
          }}>
            <p style={{ fontSize: '0.82rem', fontWeight: 700, color: GOLD, margin: '0 0 8px' }}>{tr ? card.titleTr : card.titleEn}</p>
            <p style={{ fontSize: '0.80rem', color: COLORS.silver, margin: 0, lineHeight: 1.65 }}>{tr ? card.bodyTr : card.bodyEn}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── TAB 5: DİLBİLİM ────────────────────────────────────────────────────────────
function TabDilbilim({ data, language, isMobile }) {
  const tr = language === 'tr';
  const d = data.dilbilim || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Kök analizi */}
      <div>
        <SectionTitle>{tr ? 'A. Kök Analizi' : 'A. Root Analysis'}</SectionTitle>
        <div style={{
          background: 'rgba(255,255,255,0.03)', border: `1px solid ${COLORS.glassBgStrong}`,
          borderRadius: RADIUS.lg, padding: '18px 20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '14px', flexWrap: 'wrap' }}>
            <p style={{ fontFamily: FONTS.quran, fontSize: '2rem', color: GOLD, direction: 'rtl', margin: 0, lineHeight: 1 }} lang="ar">
              م-ل-ك
            </p>
            <div>
              <p style={{ fontSize: '0.95rem', fontWeight: 700, color: COLORS.offWhite, margin: '0 0 4px' }}>
                {tr ? d.kokAnalizi?.rootMeaningTr : d.kokAnalizi?.rootMeaningEn}
              </p>
              <p style={{ fontSize: '0.75rem', color: COLORS.slate500, margin: 0 }}>
                {tr ? d.kokAnalizi?.kuranicFrequencyTr : d.kokAnalizi?.kuranicFrequencyEn}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: FONTS.quran, fontSize: '1.3rem', color: GOLD, direction: 'rtl', margin: '0 0 4px' }} lang="ar">{d.kokAnalizi?.tekil}</p>
              <p style={{ fontSize: '0.65rem', color: COLORS.slate500, margin: 0 }}>{tr ? 'tekil' : 'singular'}</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: FONTS.quran, fontSize: '1.3rem', color: GOLD, direction: 'rtl', margin: '0 0 4px' }} lang="ar">{d.kokAnalizi?.cogul}</p>
              <p style={{ fontSize: '0.65rem', color: COLORS.slate500, margin: 0 }}>{tr ? 'çoğul' : 'plural'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Benzersiz sıfatlar */}
      <div>
        <SectionTitle>{tr ? "B. Kur'an'da Benzersiz Melek Sıfatları" : 'B. Unique Angel Attributes in the Quran'}</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '10px' }}>
          {(d.benzersizSifatlar || []).map((s, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${COLORS.glassBgStrong}`,
              borderLeft: `2px solid ${COLORS.softGoldAlpha30}`,
              borderRadius: RADIUS.chip, padding: '12px 14px',
            }}>
              <p style={{ fontFamily: FONTS.quran, fontSize: '1.15rem', color: GOLD, direction: 'rtl', margin: '0 0 6px', lineHeight: 1.7 }} lang="ar">{s.arabic}</p>
              <p style={{ fontSize: '0.78rem', color: COLORS.offWhite, margin: '0 0 4px', fontWeight: 600 }}>{tr ? s.meaningTr : s.meaningEn}</p>
              <p style={{ fontSize: '0.68rem', color: `${GOLD}60`, margin: 0 }}>{s.ref}</p>
              {s.isHapax && <div style={{ marginTop: '6px' }}><HapaxBadge language={language} /></div>}
            </div>
          ))}
        </div>
      </div>

      {/* Nadir kullanım */}
      <div>
        <SectionTitle>{tr ? 'C. Nadir veya Hapax Kullanımlar' : 'C. Rare or Hapax Usages'}</SectionTitle>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {(d.nadirKullanim || []).map((n, i) => (
            <div key={i} style={{
              background: 'rgba(83,74,183,0.08)', border: '1px solid rgba(83,74,183,0.2)',
              borderRadius: RADIUS.chip, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px',
            }}>
              <p style={{ fontFamily: FONTS.quran, fontSize: '1.1rem', color: GOLD, direction: 'rtl', margin: 0 }} lang="ar">{n.arabic}</p>
              <div>
                <p style={{ fontSize: '0.75rem', color: COLORS.silver, margin: '0 0 3px' }}>{tr ? n.notTr : n.notEn}</p>
                <p style={{ fontSize: '0.65rem', color: `${GOLD}60`, margin: 0 }}>{n.ref}</p>
              </div>
              {n.isHapax && <HapaxBadge language={language} />}
            </div>
          ))}
        </div>
      </div>

      {/* Cebrail'in 4 ismi */}
      <div>
        <SectionTitle color="#B8860B">{tr ? "D. Cebrail'in Dört İsmi — Kur'an'da" : "D. Jibril's Four Names in the Quran"}</SectionTitle>
        <p style={{ fontSize: '0.75rem', color: `${GOLD}70`, fontStyle: 'italic', margin: '0 0 12px', lineHeight: 1.5 }}>
          ℹ️ {tr ? d.karsilastirmaNotTr : d.karsilastirmaNotEn}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: '10px' }}>
          {(d.cebrailIsimleri || []).map((n, i) => (
            <div key={i} style={{
              background: n.isHadisConnection ? 'rgba(255,255,255,0.02)' : 'rgba(184,134,11,0.08)',
              border: `1px solid ${n.isHadisConnection ? 'rgba(255,255,255,0.07)' : 'rgba(184,134,11,0.2)'}`,
              borderRadius: RADIUS.chip, padding: '14px',
              display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center', textAlign: 'center',
            }}>
              <p style={{ fontFamily: FONTS.quran, fontSize: '1.1rem', color: n.isHadisConnection ? '#4B5563' : GOLD, direction: 'rtl', margin: 0, lineHeight: 1.5 }} lang="ar">{n.arabic}</p>
              <p style={{ fontSize: '0.78rem', fontWeight: 600, color: n.isHadisConnection ? '#6B7280' : COLORS.offWhite, margin: 0 }}>{n.nameTr}</p>
              <p style={{ fontSize: '0.65rem', color: `${GOLD}50`, margin: 0 }}>{n.ref}</p>
              {n.isHadisConnection && (
                <span style={{ fontSize: '0.6rem', color: '#6B7280', background: 'rgba(107,114,128,0.08)', border: '1px solid rgba(107,114,128,0.15)', borderRadius: RADIUS.pillSm, padding: '1px 7px' }}>
                  {tr ? 'tefsir' : 'tafsir'}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── TAB 6: KAYNAKLAR ────────────────────────────────────────────────────────────
const RELATED_PAGES = [
  { event: 'openIblisSatan',       tr: 'İBLİS / ŞEYTAN ATLASI', en: 'IBLIS / SHAYTAN ATLAS', descTr: 'Yedi sûrede aynı sahne — kibrin başlangıcı', descEn: 'The same scene across seven suras — the origin of pride' },
  { event: 'openMunafikProfili',   tr: 'MÜNÂFIK PROFİLİ',        en: 'PROFILE OF THE MUNAFIQ', descTr: 'İnsan psikolojisi — kalbin gizli hastalığı',     descEn: 'Human psychology — the hidden disease of the heart' },
  { event: 'openKiyametSahneleri', tr: 'KIYAMET SAHNELERİ',      en: 'SCENES OF QIYAMAH',      descTr: 'Sûr üfleyen melek ve eskatolojik sahneler',       descEn: 'The angel of the trumpet and eschatological scenes' },
  { event: 'openKavimlerAtlasi',   tr: 'KAVİMLER ATLASI',        en: 'NATIONS ATLAS',          descTr: 'Lût helakının melekleri — tarihsel kıssalar',     descEn: 'The angels of Lot\'s destruction — historical narratives' },
];

function TabKaynaklar({ data, language }) {
  const tr = language === 'tr';
  const k = data.kaynaklar || {};
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Global note */}
      <div style={{
        background: COLORS.softGoldAlpha05, border: `1px solid ${COLORS.softGoldAlpha15}`,
        borderRadius: RADIUS.chip, padding: '14px 16px',
        fontSize: '0.80rem', color: COLORS.softGoldAlpha70, lineHeight: 1.7,
      }}>
        ℹ️ {tr ? k.globalNotTr : k.globalNotEn}
      </div>
      {[
        { titleTr: 'Klasik Tefsir',      titleEn: 'Classical Tafsir',      items: k.klasikTefsir || [] },
        { titleTr: 'Akademik Kaynaklar', titleEn: 'Academic Sources',      items: k.akademik || [] },
        { titleTr: 'Dijital Doğrulama',  titleEn: 'Digital Verification',  items: k.dijital || [] },
      ].map(section => (
        <div key={section.titleTr}>
          <SectionTitle>{tr ? section.titleTr : section.titleEn}</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {section.items.map((item, i) => {
              const url = item.eser && (item.eser.includes('.') && !item.eser.includes(' ')) ? `https://${item.eser}` : null;
              return (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: RADIUS.md, padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: COLORS.offWhite }}>{item.isim}</span>
                  {item.eser && (
                    url ? (
                      <a href={url} target="_blank" rel="noopener noreferrer" style={{
                        fontSize: '0.75rem', color: GOLD, textDecoration: 'none',
                        display: 'inline-flex', alignItems: 'center', gap: '3px',
                        borderBottom: `1px dashed ${COLORS.softGoldAlpha35}`,
                      }}>
                        {item.eser}
                        <svg aria-hidden="true" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                      </a>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: COLORS.slate500 }}>{item.eser}</span>
                    )
                  )}
                </div>
                {(tr ? item.notTr : item.notEn) && (
                  <span style={{ fontSize: '0.72rem', color: `${GOLD}70`, fontStyle: 'italic' }}>{tr ? item.notTr : item.notEn}</span>
                )}
              </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Cross-page CTAs — related Atlas overlays */}
      <div style={{ marginTop: '8px' }}>
        <SectionTitle>{tr ? 'İlgili Atlas Sayfaları' : 'Related Atlas Pages'}</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {RELATED_PAGES.map(cta => (
            <button
              key={cta.event}
              onClick={() => window.dispatchEvent(new CustomEvent(cta.event))}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 16px', borderRadius: RADIUS.md,
                background: COLORS.goldAlpha15,
                border: `1px solid ${COLORS.goldAlpha25}`,
                cursor: 'pointer', textAlign: 'left',
                transition: `all ${TRANSITION.fast}`,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = COLORS.goldAlpha25; e.currentTarget.style.borderColor = COLORS.goldAlpha45; }}
              onMouseLeave={e => { e.currentTarget.style.background = COLORS.goldAlpha15; e.currentTarget.style.borderColor = COLORS.goldAlpha25; }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: COLORS.gold, fontSize: '0.74rem', fontWeight: 700, letterSpacing: '0.08em', margin: '0 0 2px', fontFamily: FONTS.body }}>
                  ↗ {tr ? cta.tr : cta.en}
                </p>
                <p style={{ color: COLORS.silver, fontSize: '0.76rem', fontFamily: FONTS.body, margin: 0, lineHeight: 1.4 }}>
                  {tr ? cta.descTr : cta.descEn}
                </p>
              </div>
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.7, marginLeft: 10 }}>
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── HERO STATS BAR ─────────────────────────────────────────────────────────────
function StatCard({ value, color, labelTr, labelEn, refTr, refEn, tooltipAr, tooltipTr, tooltipEn, language }) {
  const tr = language === 'tr';
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        background: hovered ? `${color}10` : 'rgba(255,255,255,0.03)',
        border: `1px solid ${hovered ? `${color}35` : 'rgba(255,255,255,0.07)'}`,
        borderTop: `2px solid ${hovered ? color : 'transparent'}`,
        borderRadius: RADIUS.chip, padding: '14px 16px',
        cursor: 'default', transition: `all ${TRANSITION.fast}`,
      }}
    >
      {/* Value */}
      <p style={{ fontSize: '1.8rem', fontWeight: 800, color, margin: '0 0 4px', fontFamily: FONTS.body, lineHeight: 1 }}>
        {value}
      </p>
      {/* Label */}
      <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#c8cdd8', margin: '0 0 4px', lineHeight: 1.35 }}>
        {tr ? labelTr : labelEn}
      </p>
      {/* Surah ref */}
      {(refTr || refEn) && (
        <p style={{ fontSize: '0.65rem', color: `${color}70`, fontWeight: 500, margin: 0 }}>
          {tr ? refTr : refEn}
        </p>
      )}

      {/* Hover tooltip — shows Arabic verse */}
      {hovered && tooltipAr && (
        <div style={{
          position: 'absolute', bottom: 'calc(100% + 8px)', left: '50%',
          transform: 'translateX(-50%)',
          width: '280px', padding: '14px 16px',
          background: 'rgba(8,10,26,0.98)',
          border: `1px solid ${color}30`,
          borderRadius: RADIUS.lg,
          boxShadow: `0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px ${color}15`,
          zIndex: 50, pointerEvents: 'none',
        }}>
          <p style={{
            fontFamily: FONTS.quran, fontSize: '1.2rem', color: GOLD,
            textAlign: 'right', direction: 'rtl', lineHeight: 2.0,
            margin: '0 0 8px', whiteSpace: 'pre-wrap',
          }} lang="ar">
            {tooltipAr}
          </p>
          <p style={{ fontSize: '0.75rem', color: COLORS.silver, fontStyle: 'italic', margin: '0 0 6px', lineHeight: 1.55 }}>
            {tr ? tooltipTr : tooltipEn}
          </p>
          {(refTr || refEn) && (
            <p style={{ fontSize: '0.65rem', color: `${color}70`, fontWeight: 600, margin: 0 }}>
              {tr ? refTr : refEn}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function HeroStats({ language }) {
  const stats = [
    {
      value: '2',
      color: '#B8860B',
      labelTr: 'Kur\'an\'da İsimle Anılan Melek',
      labelEn: 'Angels Named in the Quran',
      refTr: 'Cebrail + Mikail — Bakara 2:97-98',
      refEn: 'Jibril + Mika\'il — Al-Baqarah 2:97-98',
      tooltipAr: 'قُلْ مَن كَانَ عَدُوًّا لِّجِبْرِيلَ فَإِنَّهُ نَزَّلَهُ عَلَىٰ قَلْبِكَ بِإِذْنِ اللَّهِ\nمَن كَانَ عَدُوًّا لِّلَّهِ وَمَلَائِكَتِهِ وَرُسُلِهِ وَجِبْرِيلَ وَمِيكَالَ فَإِنَّ اللَّهَ عَدُوٌّ لِّلْكَافِرِينَ',
      tooltipTr: '(2:97) Cebrail adı geçiyor: vahyi kalbe indiren. (2:98) Mikail adı geçiyor: her ikisi de aynı ayette. Kur\'an\'da adıyla anılan tek iki melek.',
      tooltipEn: '(2:97) Jibril named: the one who brought revelation to your heart. (2:98) Mika\'il named: both in the same verse. The only two angels named in the Quran.',
    },
    {
      value: '2',
      color: '#6B7280',
      labelTr: 'İsimli ama Kimliği Tartışmalı',
      labelEn: 'Named but Identity Debated',
      refTr: 'Harut + Marut — melek mi, değil mi?',
      refEn: 'Harut + Marut — angels or not?',
      tooltipAr: 'وَمَا أُنزِلَ عَلَى الْمَلَكَيْنِ بِبَابِلَ هَارُوتَ وَمَارُوتَ',
      tooltipTr: 'الْمَلَكَيْنِ: "iki melek" (çoğunluk okuyuşu). Tartışma iki noktada: (1) Azınlık görüş meliki "iki kral" okur. (2) Meleklerin sihir öğretmesi teolojik sorun teşkil eder — bazı alimler bu nedenle "iki insan/kral" yorumunu savunmuştur.',
      tooltipEn: 'al-malakayni: "two angels" (majority reading). Debate has two axes: (1) A minority reading parses it as "two kings." (2) Angels teaching sorcery raises theological concerns — some scholars argued for a human/king interpretation for this reason.',
    },
    {
      value: '1',
      color: '#D85A30',
      labelTr: 'Cehennemde İsmi Geçen Melek',
      labelEn: 'Angel Named in Hell',
      refTr: 'Malik — Zuhruf 43:77',
      refEn: 'Malik — Az-Zukhruf 43:77',
      tooltipAr: 'وَنَادَوْا يَا مَالِكُ لِيَقْضِ عَلَيْنَا رَبُّكَ',
      tooltipTr: '"Ey Malik! Rabbin bizim işimizi bitirsin." — Cehennem ehlinin sözü. İsim, bizzat onların ağzından geçiyor.',
      tooltipEn: '"O Malik! Let your Lord finish us off." — The name comes from Hell\'s inhabitants themselves.',
    },
    {
      value: '19',
      color: '#D85A30',
      labelTr: 'Cehennem Bekçilerinin Sayısı',
      labelEn: 'Keepers of Hell',
      refTr: 'Müddessir 74:30',
      refEn: 'Al-Muddaththir 74:30',
      tooltipAr: 'عَلَيْهَا تِسْعَةَ عَشَرَ\nوَمَا جَعَلْنَا أَصْحَابَ النَّارِ إِلَّا مَلَائِكَةً',
      tooltipTr: '(74:30) "Onun üzerinde on dokuz vardır." (74:31) "Cehennem sahiplerini yalnızca melek kıldık." — Sayı, kâfirleri sınamak, inkârcıları şüpheye düşürmek ve müminleri artırmak için verilmiştir.',
      tooltipEn: '(74:30) "Over it are nineteen." (74:31) "We have not appointed the keepers of the Fire except as angels." — The number is given to test disbelievers, disturb rejectors, and increase believers.',
    },
    {
      value: '2–4',
      color: GOLD,
      labelTr: 'Kanat Sayısı (Fâtır 35:1)',
      labelEn: 'Wing count (Fatir 35:1)',
      refTr: 'İkişer, üçer, dörder kanatlı',
      refEn: 'In pairs, threes, and fours',
      tooltipAr: 'جَاعِلِ الْمَلَائِكَةِ رُسُلًا أُولِي أَجْنِحَةٍ مَّثْنَىٰ وَثُلَاثَ وَرُبَاعَ',
      tooltipTr: 'مَّثْنَىٰ = ikişer · وَثُلَاثَ = üçer · وَرُبَاعَ = dörder. Kur\'an\'da geçen tek kanat sayısı. Hadisteki "600 kanat" ayrı bir rivayettir, bu ayetten türemez.',
      tooltipEn: 'mathnā = in twos · thulāth = in threes · rubāʿ = in fours. The only wing count in the Quran. The hadith "600 wings" is a separate narration, not derived from this verse.',
    },
    {
      value: '~90',
      color: '#1D9E75',
      labelTr: 'Melek Geçen Ayet Sayısı',
      labelEn: 'Verses Mentioning Angels',
      refTr: 'el-Melâike / Ruh / Cebrail dahil',
      refEn: 'Including al-Mala\'ika, Ruh, Jibril',
      tooltipAr: 'وَمَا يَعْلَمُ جُنُودَ رَبِّكَ إِلَّا هُوَ',
      tooltipTr: '"Rabbinin ordularını ancak O bilir." — Müddessir 74:31. Meleklerin tam sayısı Kur\'an\'a göre yalnızca Allah\'a aittir.',
      tooltipEn: '"None knows the soldiers of your Lord except Him." — Al-Muddaththir 74:31. The true number of angels belongs to Allah alone.',
    },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
      {stats.map((s, i) => (
        <StatCard key={i} {...s} language={language} />
      ))}
    </div>
  );
}

// ── MAIN COMPONENT ─────────────────────────────────────────────────────────────
const TAB_ICONS = [
  // Melekler — wing shape
  <svg aria-hidden="true" key="t0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22C6 17 2 13 2 8a5 5 0 0 1 10 0"/>
    <path d="M12 22c6-5 10-9 10-14a5 5 0 0 0-10 0"/>
  </svg>,
  // Görevler — list with arrows/tasks
  <svg aria-hidden="true" key="t1" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
    <polyline points="3 6 4 7 6 5"/><polyline points="3 12 4 13 6 11"/><polyline points="3 18 4 19 6 17"/>
  </svg>,
  // Kıssalar — open book
  <svg aria-hidden="true" key="t2" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>,
  // Kur'an / Hadis — two documents side by side (source comparison)
  <svg aria-hidden="true" key="t3" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="8" height="16" rx="1.5"/>
    <line x1="4" y1="8" x2="8" y2="8"/><line x1="4" y1="11" x2="8" y2="11"/><line x1="4" y1="14" x2="7" y2="14"/>
    <rect x="14" y="4" width="8" height="16" rx="1.5"/>
    <line x1="16" y1="8" x2="20" y2="8"/><line x1="16" y1="11" x2="20" y2="11"/><line x1="16" y1="14" x2="19" y2="14"/>
    <line x1="11" y1="12" x2="13" y2="12" strokeDasharray="1 1"/>
  </svg>,
  // Dilbilim — Arabic letter / calligraphy pen
  <svg aria-hidden="true" key="t4" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
  </svg>,
  // Kaynaklar — bookmark with lines
  <svg aria-hidden="true" key="t5" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
    <line x1="9" y1="10" x2="15" y2="10"/>
  </svg>,
];

const TABS = [
  { icon: TAB_ICONS[0], labelTr: 'Melekler',      labelEn: 'Angels'        },
  { icon: TAB_ICONS[1], labelTr: 'Görevler',       labelEn: 'Functions'     },
  { icon: TAB_ICONS[2], labelTr: 'Kıssalar',       labelEn: 'Narratives'    },
  { icon: TAB_ICONS[3], labelTr: "Kur'an / Hadis", labelEn: 'Quran vs Hadith'},
  { icon: TAB_ICONS[4], labelTr: 'Dilbilim',       labelEn: 'Linguistics'   },
  { icon: TAB_ICONS[5], labelTr: 'Kaynaklar',      labelEn: 'Sources'       },
];

// ── Page header icon ──────────────────────────────────────────────────────────
// FeatherIcon — matches exploreCategories.jsx for navbar/header consistency
const PageIcon = () => (
  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
    <line x1="16" y1="8" x2="2" y2="22" />
    <line x1="17.5" y1="15" x2="9" y2="15" />
  </svg>
);

export default function Melekler({ onClose }) {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const [activeTab, setActiveTab] = useState(0);
  const [data, setData] = useState(null);
  const [isMobile, setIsMobile] = useState(false)  // SSR-safe; useEffect h() post-mount hydrate;
  const bodyRef = useRef(null);

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < BREAKPOINT_TABLET);
    h(); // post-mount hydrate
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  // CLAUDE.md §13.16 Katman 1 — body+html scroll lock with scrollbar gutter compensation
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
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  useEffect(() => {
    fetch('/melekler.json').then(r => r.json()).then(setData);
  }, []);

  const handleTab = (i) => {
    setActiveTab(i);
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
  };

  return (
    <div style={{ position: 'fixed', inset: '54px 0 0 0', zIndex: 50, background: COLORS.cosmicBlack, overflow: 'hidden', display: 'flex', flexDirection: 'column' }} role="dialog" aria-modal="true">

      {/* ── Header ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', height: '54px', flexShrink: 0,
        background: 'rgba(8,9,26,0.95)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ color: COLORS.softGoldAlpha55, flexShrink: 0, display: 'flex' }}>
            <PageIcon />
          </span>
          <span style={OVERLAY_TITLE}>{tr ? "Kur'an'da Melekler" : 'Angels in the Quran'}</span>
          <span style={{ fontSize: '0.72rem', color: COLORS.slate600, marginLeft: '4px', display: isMobile ? 'none' : 'block' }}>
            — {tr ? 'Görünmeyenin Elçileri' : 'Messengers of the Unseen'}
          </span>
        </div>
        <button
          onClick={onClose}
          style={{ ...CLOSE_BTN, flexShrink: 0 }}
          onMouseEnter={e => { e.currentTarget.style.background = COLORS.glassBorder; e.currentTarget.style.color = COLORS.offWhite; }}
          onMouseLeave={e => { e.currentTarget.style.background = CLOSE_BTN.background; e.currentTarget.style.color = COLORS.silver; }}
          aria-label="Close"
        >
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* ── Body (scrollable) ── */}
      <div ref={bodyRef} style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>

        {/* Hero — scrolls away */}
        <div style={{ padding: isMobile ? '20px 16px 16px' : '28px 32px 20px' }}>
          <p style={{ fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.28em', color: COLORS.softGoldAlpha45, margin: '0 0 8px' }}>
            {tr ? "KUR'AN'DA MELEKLER" : 'ANGELS IN THE QURAN'}
          </p>
          <h1 style={{ fontFamily: FONTS.display, fontSize: isMobile ? '1.5rem' : '2rem', fontWeight: 700, color: COLORS.offWhite, margin: '0 0 14px', lineHeight: 1.25 }}>
            {tr ? 'Görünmeyenin Elçileri' : 'Messengers of the Unseen'}
          </h1>
          <VerseBlock
            arabic="الْحَمْدُ لِلَّهِ فَاطِرِ السَّمَاوَاتِ وَالْأَرْضِ جَاعِلِ الْمَلَائِكَةِ رُسُلًا أُولِي أَجْنِحَةٍ"
            translation={tr
              ? "Gökleri ve yeri yaratan, melekleri ikişer, üçer, dörder kanatlı elçiler kılan Allah'a hamdolsun."
              : "All praise is due to Allah, Creator of the heavens and the earth, who made the angels messengers having wings, two or three or four."}
            ref="Fâtır 35:1"
          />
          <p style={{ fontSize: '0.82rem', color: COLORS.slate500, margin: '14px 0 0', lineHeight: 1.7, maxWidth: '720px' }}>
            {tr
              ? "Kur'an melekleri tasvir etmez — işlevlerini anlatır. Cebrail ve Mikail bizzat anılır, Harut-Marut zikredilir, ötekiler görevle tanınır. Nurdan yaratıldıkları, kanat sayıları hadis geleneğine aittir. Bu sayfa yalnızca Kur'an'da ne geçtiğini gösterir; geri kalanı ℹ️ ile işaretler."
              : "The Quran defines angels by function, not description. Jibril and Mika'il are named; Harut and Marut are mentioned; the rest are known by role. Details like being created from light come from hadith. This page shows only what the Quran says; everything else is marked ℹ️."}
          </p>
          <div style={{ marginTop: '16px' }}>
            <HeroStats language={language} />
          </div>
        </div>

        {/* ── Tab bar — sticky (DogaAtlasi pattern) ── */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 10,
          display: 'flex', gap: '2px',
          padding: isMobile ? '0 8px' : '0 16px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(10,10,26,0.97)', backdropFilter: 'blur(20px)',
          overflowX: 'auto', scrollbarWidth: 'none', flexShrink: 0,
        }}>
          {TABS.map((tab, i) => (
            <button
              key={i}
              onClick={() => handleTab(i)}
              style={{
                flexShrink: 0, display: 'flex', alignItems: 'center', gap: '8px',
                padding: isMobile ? '12px 14px' : '13px 22px',
                border: 'none', borderRadius: '0',
                background: activeTab === i ? COLORS.goldAlpha15 : 'transparent',
                borderBottom: activeTab === i ? `2px solid ${COLORS.gold}` : '2px solid transparent',
                color: activeTab === i ? COLORS.gold : COLORS.silver,
                fontSize: isMobile ? '0.85rem' : '0.9rem',
                fontFamily: FONTS.body, fontWeight: activeTab === i ? 600 : 400,
                cursor: 'pointer', transition: `all ${TRANSITION.fast}`, whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => { if (activeTab !== i) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = COLORS.offWhite; } }}
              onMouseLeave={e => { if (activeTab !== i) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = COLORS.silver; } }}
            >
              <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{tab.icon}</span>
              {!isMobile && <span>{tr ? tab.labelTr : tab.labelEn}</span>}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ padding: isMobile ? '16px' : '24px 32px', flex: 1 }}>
          {!data ? (
            <div style={{ textAlign: 'center', padding: '40px', color: COLORS.slate600 }}>
              {tr ? 'Yükleniyor...' : 'Loading...'}
            </div>
          ) : (
            <>
              {activeTab === 0 && <TabMelekler  data={data} language={language} isMobile={isMobile} />}
              {activeTab === 1 && <TabGorevler  data={data} language={language} isMobile={isMobile} />}
              {activeTab === 2 && <TabKissalar  data={data} language={language} isMobile={isMobile} />}
              {activeTab === 3 && <TabSinir     language={language} isMobile={isMobile} />}
              {activeTab === 4 && <TabDilbilim  data={data} language={language} isMobile={isMobile} />}
              {activeTab === 5 && <TabKaynaklar data={data} language={language} />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
