'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import useFocusTrap from '../hooks/useFocusTrap';
import {
  COLORS, FONTS, BREAKPOINT_TABLET, TRANSITION, RADIUS, SEMANTIC } from '../tokens';
import ToolHeader from './ToolHeader';
import CrossToolCTA from './CrossToolCTA';
import { SURAH_NAMES_TR } from '../lib/surahNames';
import { fetchMealVerse } from '../lib/mealCache';

import { cleanArabicForDisplay as cleanArabic } from '../lib/arabic';
// 2026-08-14 (Z3f2) — fetch yerine static import: SSR "Yükleniyor" iskeleti
// döndürüyordu, JS başarısız olursa sayfa boş kalıyordu.
import wordGroupsDataStatic from '../../public/word-groups.json';
// Strip meal footnote markers like [1], [12] from Turkish translation text
function stripFootnotes(str) {
  if (!str) return str;
  return str.replace(/\s*\[\d+\]\s*/g, ' ').replace(/\s{2,}/g, ' ').trim();
}

// "2:38" → "Bakara 2:38" (drops leading El-/En-/Et- articles for compactness)
function surahRefLabel(ref) {
  const [s] = ref.split(':').map(Number);
  const name = SURAH_NAMES_TR[s - 1];
  if (!name) return ref;
  const clean = name.replace(/^(El-|En-|Et-|Eş-|Ez-|Er-|Ed-)/, '');
  return `${clean} ${ref}`;
}


const CONTEXT_COLORS = {
  negative: '#e74c3c',
  positive: '#2ecc71',
  neutral:  '#95a5a6',
  divine:   '#9b59b6',
  ritual:   '#c9a227',
};

const CONTEXT_LABELS = {
  negative: { tr: 'Azap',   en: 'Punishment' },
  positive: { tr: 'Rahmet', en: 'Mercy' },
  neutral:  { tr: 'Nötr',   en: 'Neutral' },
  divine:   { tr: 'İlahi',  en: 'Divine' },
  ritual:   { tr: 'İbadet', en: 'Ritual' },
};

const TABS = [
  {
    tr: 'Panorama', en: 'Panorama',
    icon: <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
  },
  {
    tr: 'Grup Detayı', en: 'Group Detail',
    icon: <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>,
  },
  {
    tr: 'Prensip Kitaplığı', en: 'Principles',
    icon: <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>,
  },
  {
    tr: 'Kaynaklar', en: 'Sources',
    icon: <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>,
  },
];

// ── API verse cache (module-level, survives re-renders) ──────────────────────
const verseCache = new Map();

async function loadVerse(surah, ayah) {
  const key = `${surah}:${ayah}`;
  if (verseCache.has(key)) return verseCache.get(key);
  try {
    // Local-first meal cache (author 105); single-verse API fallback inside.
    const data = await fetchMealVerse(surah, ayah, 105);
    const result = { arabic: data.data?.verse || '', turkish: data.data?.translation?.text || '' };
    verseCache.set(key, result);
    return result;
  } catch {
    return { arabic: '', turkish: '' };
  }
}

// ── Main component ───────────────────────────────────────────────────────────
export default function FurukAtlasi({ onClose }) {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const [data] = useState(wordGroupsDataStatic);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedGroupId, setSelectedGroupId] = useState(wordGroupsDataStatic.groups?.length ? wordGroupsDataStatic.groups[0].id : null);
  const [isMobile, setIsMobile] = useState(false)  // SSR-safe; useEffect h() post-mount hydrate eder (audit fix);
  const bodyRef = useRef(null);
  const trapRef = useFocusTrap(true);

  // Escape
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  // Body scroll lock kaldırıldı — WowFacts/IlkSon pattern: normal-flow document scroll.

  // Resize
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < BREAKPOINT_TABLET);
    h(); // post-mount hydrate
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  // Scroll to top on tab change
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
  }, [activeTab]);

  const FURUK_TOOL_HEADER = (
    <ToolHeader
      icon={<PrismIcon />}
      titleTr="Füruk Atlası"
      titleEn="Atlas of Semantic Distinctions"
      subtitleTr="Eş anlamlılarda ince fark · 50+ aile"
      subtitleEn="Subtle distinctions · 50+ word families"
      language={language}
    />
  );

  // #202 (2026-07-15) — CTA hem loading skeleton'da hem main return'de görünsün (SSR SEO)
  const RELATED_CTA = (
    <div style={{ maxWidth: 1080, margin: '0 auto', padding: isMobile ? '24px 16px 32px' : '40px 24px 48px', width: '100%' }}>
      <CrossToolCTA
        language={language}
        isMobile={isMobile}
        links={[
          { href: `/${language}/graf/semantik`, titleTr: 'Semantik Ağ', titleEn: 'Semantic Map', descTr: 'Yakın anlamlı kelimelerin Kur\'an genelindeki bağlantılarını 3B görselleştir.', descEn: 'Visualize connections of near-synonym words across the Quran in 3D.' },
          { href: `/${language}/graf/kavram`, titleTr: 'Kavram Ağı', titleEn: 'Concept Network', descTr: 'Kavramlar arası bağlantılar — furûk\'un daha geniş harita bağlamı.', descEn: 'Concept connections — the wider map context for furūq.' },
          { href: `/${language}/arac/retorik`, titleTr: 'Kur\'ân Belâgatı', titleEn: 'Quranic Rhetoric', descTr: 'Anlam nüansları belâgat tekniklerine nasıl yansır — teşbih, kinâye, tıbâk.', descEn: 'How meaning nuances reflect in rhetorical techniques — tashbīh, kināya, ṭibāq.' },
        ]}
      />
    </div>
  );

  if (!data) {
    return (
      <div
        ref={trapRef}
        style={{
          background: COLORS.cosmicBlack,
          minHeight: 'calc(100vh - 62px)',
          display: 'flex', flexDirection: 'column',
          paddingTop: '62px',
        }}
      >
        {FURUK_TOOL_HEADER}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: COLORS.silver, fontSize: '0.9rem', fontFamily: FONTS.body }}>
            {tr ? 'Yükleniyor…' : 'Loading…'}
          </span>
        </div>
        {RELATED_CTA}
      </div>
    );
  }

  const selectedGroup = data.groups.find(g => g.id === selectedGroupId) ?? data.groups[0];

  return (
    <div
      ref={trapRef}
      style={{
        background: COLORS.cosmicBlack,
        minHeight: 'calc(100vh - 62px)',
        display: 'flex', flexDirection: 'column',
        paddingTop: '62px',
      }}
    >
      {FURUK_TOOL_HEADER}

      {/* ── SCROLLABLE BODY ────────────────────────────────────────────────── */}
      <div ref={bodyRef} style={{ flex: 1, overflowX: 'hidden' }}>

        {/* ── HERO ────────────────────────────────────────────────────────── */}
        <div style={{
          padding: isMobile ? '24px 16px 20px' : '36px 40px 28px',
          background: 'linear-gradient(180deg, rgba(212,165,116,0.06) 0%, transparent 100%)',
          borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
        }}>
          <div style={{ fontSize: '0.62rem', letterSpacing: '0.15em', color: COLORS.gold, textTransform: 'uppercase', fontFamily: FONTS.body, fontWeight: 700, marginBottom: 8 }}>
            {tr ? 'AYNI ÇEVİRİ · FARKLI ANLAM' : 'SAME TRANSLATION · DIFFERENT MEANING'}
          </div>
          <h2 style={{
            color: COLORS.offWhite, fontSize: isMobile ? '1.4rem' : '1.9rem',
            fontWeight: 700, fontFamily: FONTS.display, margin: '0 0 12px',
            lineHeight: 1.3,
          }}>
            {tr ? 'İddia değil, veri göster.' : 'Show data, not claims.'}
          </h2>
          <p style={{
            color: COLORS.silver, fontSize: isMobile ? '0.9rem' : '0.95rem',
            fontFamily: FONTS.body, margin: '0 0 20px',
            lineHeight: 1.7, maxWidth: 640,
          }}>
            {tr
              ? "Türkçe çevirisi aynı — ama Arapça'da farklı anlam taşıyan kelimeler. Matar ve ğays ikisi de 'yağmur' ama biri azap, diğeri rahmet. Havf ve haşye ikisi de 'korku' ama birincisi hareket, ikincisi sakinlik. Her kelimenin tüm ayet geçişlerini göster — örüntüyü kendin gör."
              : "Same translation in English — but different meanings in Arabic. Matar and ghayth are both 'rain', but one is punishment, the other mercy. Khawf and khashya are both 'fear', but the first produces motion, the second stillness. See every verse occurrence — discover the pattern yourself."}
          </p>

          {/* Stat strip */}
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 4 }}>
            {[
              { num: data.meta.totalGroups, labelTr: 'Grup', labelEn: 'Groups' },
              { num: data.meta.totalWords, labelTr: 'Kelime', labelEn: 'Words' },
              { num: data.meta.totalOccurrences, labelTr: 'Ayet Geçişi', labelEn: 'Occurrences' },
              { num: data.principles.length, labelTr: 'Prensip', labelEn: 'Principles' },
              { num: data.sources.length, labelTr: 'Klasik Kaynak', labelEn: 'Classical Source' },
            ].map((s, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 14px', borderRadius: 20, flexShrink: 0,
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid ${COLORS.glassBgStrong}`,
              }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: COLORS.gold, fontFamily: FONTS.body, lineHeight: 1 }}>
                  {s.num}
                </span>
                <span style={{ fontSize: '0.72rem', color: COLORS.silver, fontFamily: FONTS.body, fontWeight: 600, whiteSpace: 'nowrap' }}>
                  {tr ? s.labelTr : s.labelEn}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── TAB BAR ─────────────────────────────────────────────────────── */}
        <div style={{ position: 'sticky', top: '110px', zIndex: 20, background: 'rgb(6, 8, 14)',
          backgroundColor: 'rgb(6, 8, 14)',
          isolation: 'isolate' }}>
          <div id="furuk-tab-bar" style={{
            display: 'flex', gap: 2,
            padding: isMobile ? '0 8px' : '0 16px',
            borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
            overflowX: 'auto', scrollbarWidth: 'none',
          }}>
            {TABS.map((t, i) => {
              const active = activeTab === i;
              return (
                <button
                  key={i}
                  onClick={() => { setActiveTab(i); setTimeout(() => { const _tb = document.getElementById('furuk-tab-bar'); if (_tb) _tb.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 50); }}
                  style={{
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    flexShrink: 0,
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: isMobile ? '12px 14px' : '13px 22px',
                    border: 'none',
                    background: active ? COLORS.goldAlpha15 : 'transparent',
                    borderBottom: active ? `2px solid ${COLORS.gold}` : '2px solid transparent',
                    borderRadius: 0,
                    color: active ? COLORS.gold : COLORS.silver,
                    fontSize: isMobile ? '0.85rem' : '0.9rem',
                    fontFamily: FONTS.body,
                    fontWeight: active ? 600 : 400,
                    cursor: 'pointer',
                    transition: `all ${TRANSITION.fast}`,
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = COLORS.offWhite; } }}
                  onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = COLORS.silver; } }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{t.icon}</span>
                  {!isMobile && <span>{tr ? t.tr : t.en}</span>}
                </button>
              );
            })}
          </div>
          {isMobile && (
            <div style={{
              position: 'absolute', top: 0, right: 0, bottom: 1,
              width: 40, pointerEvents: 'none',
              background: 'linear-gradient(to right, transparent, rgba(10,10,26,0.95))',
            }} />
          )}
        </div>

        {/* ── TAB CONTENT ─────────────────────────────────────────────────── */}
        <div style={{ padding: isMobile ? '20px 16px 40px' : '28px 32px 60px' }}>
          {activeTab === 0 && (
            <TabPanorama
              data={data}
              language={language}
              isMobile={isMobile}
              onSelectGroup={(id) => { setSelectedGroupId(id); setActiveTab(1); }}
            />
          )}
          {activeTab === 1 && (
            <TabGroupDetail
              group={selectedGroup}
              allGroups={data.groups}
              language={language}
              isMobile={isMobile}
              onSelectGroup={setSelectedGroupId}
            />
          )}
          {activeTab === 2 && (
            <TabPrinciples
              principles={data.principles}
              groups={data.groups}
              language={language}
              isMobile={isMobile}
              onSelectGroup={(id) => { setSelectedGroupId(id); setActiveTab(1); }}
            />
          )}
          {activeTab === 3 && (
            <TabSources sources={data.sources} language={language} isMobile={isMobile} />
          )}

          {RELATED_CTA}
        </div>
      </div>
    </div>
  );
}

// ── Tab 0: Panorama ──────────────────────────────────────────────────────────
function TabPanorama({ data, language, isMobile, onSelectGroup }) {
  const tr = language === 'tr';
  const groupedByCategory = useMemo(() => {
    const map = {};
    for (const cat of data.categories) map[cat.id] = { meta: cat, groups: [] };
    for (const g of data.groups) {
      if (map[g.category]) map[g.category].groups.push(g);
    }
    return Object.values(map).filter(c => c.groups.length > 0);
  }, [data]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Color legend — what the dots mean */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
        padding: '10px 14px', background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10,
      }}>
        <span style={{
          fontSize: '0.64rem', color: COLORS.silver,
          textTransform: 'uppercase', letterSpacing: '0.14em',
          fontWeight: 700, fontFamily: FONTS.body,
        }}>
          {tr ? 'Renk Rehberi — Baskın Bağlam' : 'Color Guide — Dominant Context'}
        </span>
        {[
          { ctx: 'negative', labelTr: 'Azap',   labelEn: 'Punishment' },
          { ctx: 'positive', labelTr: 'Rahmet', labelEn: 'Mercy' },
          { ctx: 'divine',   labelTr: 'İlahi',  labelEn: 'Divine' },
          { ctx: 'neutral',  labelTr: 'Nötr',   labelEn: 'Neutral' },
        ].map(item => (
          <span key={item.ctx} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: RADIUS.full, background: CONTEXT_COLORS[item.ctx] }} />
            <span style={{ fontSize: '0.72rem', color: COLORS.offWhite, fontFamily: FONTS.body, fontWeight: 500 }}>
              {tr ? item.labelTr : item.labelEn}
            </span>
          </span>
        ))}
      </div>

      {groupedByCategory.map(({ meta, groups }) => (
        <div key={meta.id}>
          <div style={{
            fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: COLORS.gold,
            fontFamily: FONTS.body, marginBottom: 14,
            paddingBottom: 8, borderBottom: `1px solid ${COLORS.goldAlpha15}`,
          }}>
            {tr ? meta.titleTr : meta.titleEn}
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: 14,
          }}>
            {groups.map(g => <GroupCard key={g.id} group={g} language={language} onClick={() => onSelectGroup(g.id)} />)}
          </div>
        </div>
      ))}
    </div>
  );
}

function GroupCard({ group, language, onClick }) {
  const tr = language === 'tr';
  return (
    <button
      onClick={onClick}
      style={{
        textAlign: 'left',
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 14,
        padding: '18px 20px',
        cursor: 'pointer',
        transition: `all ${TRANSITION.base}`,
        display: 'flex', flexDirection: 'column', gap: 12,
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,165,116,0.06)'; e.currentTarget.style.borderColor = 'rgba(212,165,116,0.3)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.025)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
        <div>
          <div style={{ fontSize: '0.68rem', color: COLORS.gold, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, fontFamily: FONTS.body, marginBottom: 3 }}>
            {tr ? '«' + group.turkishTranslation + '»' : '«' + group.englishTranslation + '»'}
          </div>
          <div style={{ fontSize: '1.05rem', fontWeight: 700, color: COLORS.offWhite, fontFamily: FONTS.display }}>
            {tr ? group.titleTr : group.titleEn}
          </div>
        </div>
        <span style={{
          fontSize: '0.7rem', color: COLORS.silver,
          fontFamily: FONTS.body, flexShrink: 0,
          padding: '3px 10px', background: 'rgba(255,255,255,0.06)',
          borderRadius: 20, fontWeight: 600,
        }}>
          {group.words.length} {tr ? 'kelime' : 'words'}
        </span>
      </div>

      {/* Word list — dot color = dominant context pattern */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {group.words.map(w => {
          const dotColor = CONTEXT_COLORS[w.patternStat.dominantPattern] || COLORS.silver;
          return (
            <div key={w.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span
                style={{ width: 8, height: 8, borderRadius: RADIUS.full, background: dotColor, flexShrink: 0 }}
                title={tr ? CONTEXT_LABELS[w.patternStat.dominantPattern]?.tr : CONTEXT_LABELS[w.patternStat.dominantPattern]?.en}
              />
              <span style={{ fontFamily: FONTS.quran, fontSize: '1.05rem', color: COLORS.gold, direction: 'rtl', minWidth: 70, textAlign: 'right' }} lang="ar" dir="rtl">
                {cleanArabic(w.ar)}
              </span>
              <span style={{ fontSize: '0.8rem', color: COLORS.offWhite, fontFamily: FONTS.body, fontWeight: 500, flex: 1 }}>
                {w.tr}
              </span>
              <span style={{ fontSize: '0.72rem', color: COLORS.silver, fontFamily: FONTS.body, flexShrink: 0 }}>
                {w.frequency}×
              </span>
            </div>
          );
        })}
      </div>

      {/* Principle */}
      <p style={{
        fontSize: '0.78rem', color: 'rgba(212,165,116,0.7)',
        fontStyle: 'italic', fontFamily: FONTS.body,
        margin: 0, lineHeight: 1.5,
        paddingTop: 10, borderTop: `1px solid ${COLORS.glassBg}`,
      }}>
        &ldquo;{tr ? group.principleTr : group.principleEn}&rdquo;
      </p>
    </button>
  );
}

// ── Tab 1: Group Detail ──────────────────────────────────────────────────────
function TabGroupDetail({ group, allGroups, language, isMobile, onSelectGroup }) {
  const tr = language === 'tr';
  const [expandedWordId, setExpandedWordId] = useState(null);

  if (!group) return null;

  return (
    <div>
      {/* Group selector chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 24 }}>
        {allGroups.map(g => {
          const active = g.id === group.id;
          return (
            <button
              key={g.id}
              onClick={() => onSelectGroup(g.id)}
              style={{
                padding: '5px 14px', borderRadius: 20,
                border: `1px solid ${active ? COLORS.gold : 'rgba(255,255,255,0.12)'}`,
                background: active ? COLORS.goldAlpha15 : 'transparent',
                color: active ? COLORS.gold : COLORS.silver,
                fontSize: '0.78rem', fontWeight: active ? 600 : 400,
                fontFamily: FONTS.body, cursor: 'pointer', transition: `all ${TRANSITION.fast}`,
              }}
            >
              {tr ? g.titleTr : g.titleEn}
            </button>
          );
        })}
      </div>

      {/* Hero — translation + word cluster */}
      <div style={{
        background: `linear-gradient(135deg, ${COLORS.goldAlpha04} 0%, rgba(0,0,0,0.1) 100%)`,
        border: `1px solid ${COLORS.goldAlpha15}`,
        borderRadius: 14,
        padding: isMobile ? '24px 20px' : '32px 40px',
        marginBottom: 28,
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Subtle decorative glow */}
        <div style={{
          position: 'absolute', top: '-40px', right: '-40px',
          width: 180, height: 180, borderRadius: RADIUS.full,
          background: 'radial-gradient(circle, rgba(212,165,116,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div className="fd-row" style={{
          display: 'flex',
          alignItems: isMobile ? 'flex-start' : 'center',
          gap: isMobile ? 20 : 32, position: 'relative',
        }}>
          {/* Left: Translation */}
          <div style={{ flexShrink: 0, minWidth: isMobile ? 'auto' : 180 }}>
            <div style={{
              fontSize: '0.62rem', color: COLORS.gold,
              textTransform: 'uppercase', letterSpacing: '0.18em',
              fontWeight: 700, fontFamily: FONTS.body, marginBottom: 6,
            }}>
              {tr ? "TÜRKÇE'DE TEK KELİME" : 'ONE WORD IN ENGLISH'}
            </div>
            <h2 style={{
              fontSize: isMobile ? '2.2rem' : '2.8rem', fontWeight: 800,
              color: COLORS.offWhite, fontFamily: FONTS.display,
              margin: '0 0 6px', letterSpacing: '0.02em', lineHeight: 1.05,
            }}>
              {tr ? group.turkishTranslation : group.englishTranslation}
            </h2>
            <p style={{
              fontSize: '0.78rem', color: COLORS.silver,
              fontFamily: FONTS.body, margin: 0, fontStyle: 'italic',
            }}>
              {tr
                ? `${group.words.length} farklı Arapça kelime ↓`
                : `${group.words.length} different Arabic words ↓`}
            </p>
          </div>

          {/* Visual separator */}
          {!isMobile && (
            <div style={{
              width: 1, alignSelf: 'stretch',
              background: `linear-gradient(180deg, transparent, ${COLORS.goldAlpha25}, transparent)`,
            }} />
          )}

          {/* Right: Word cluster */}
          <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {group.words.map(w => (
              <div key={w.id} style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                padding: '8px 14px', borderRadius: 24,
                background: `${w.color}10`,
                border: `1px solid ${w.color}40`,
              }}>
                <span style={{
                  width: 8, height: 8, borderRadius: RADIUS.full,
                  background: w.color, flexShrink: 0,
                  boxShadow: `0 0 8px ${w.color}80`,
                }} />
                <span style={{ fontFamily: FONTS.quran, fontSize: '1.2rem', color: w.color, direction: 'rtl' }} lang="ar" dir="rtl">
                  {cleanArabic(w.ar)}
                </span>
                <span style={{ fontSize: '0.82rem', color: COLORS.offWhite, fontWeight: 600, fontFamily: FONTS.body }}>
                  {w.tr}
                </span>
                <span style={{
                  fontSize: '0.68rem', color: COLORS.silver,
                  fontFamily: FONTS.body, fontWeight: 700,
                  padding: '1px 7px', borderRadius: 10,
                  background: COLORS.glassBg,
                }}>
                  {w.frequency}×
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Principle box */}
      <div style={{
        background: 'rgba(212,165,116,0.06)',
        border: `1px solid ${COLORS.goldAlpha25}`,
        borderLeft: `4px solid ${COLORS.gold}`,
        borderRadius: 10, padding: isMobile ? '16px' : '20px 24px',
        marginBottom: 28, textAlign: 'center',
      }}>
        <div style={{ fontSize: '0.68rem', color: COLORS.gold, textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 700, fontFamily: FONTS.body, marginBottom: 10 }}>
          {tr ? 'Ayırt Edici Prensip' : 'Core Principle'}
        </div>
        <p style={{
          color: COLORS.offWhite, fontSize: isMobile ? '1rem' : '1.1rem',
          fontFamily: FONTS.display, fontStyle: 'italic',
          margin: '0 0 10px', lineHeight: 1.6,
        }}>
          &ldquo;{tr ? group.principleTr : group.principleEn}&rdquo;
        </p>
        <div style={{ fontSize: '0.78rem', color: COLORS.silver, fontFamily: FONTS.body }}>
          — {group.principleSource}
        </div>
      </div>

      {/* 2D semantic map */}
      <SemanticMap group={group} language={language} isMobile={isMobile} />

      {/* Word detail cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 28 }}>
        {group.words.map(w => (
          <WordCard
            key={w.id}
            word={w}
            expanded={expandedWordId === w.id}
            onToggle={() => setExpandedWordId(expandedWordId === w.id ? null : w.id)}
            language={language}
            isMobile={isMobile}
          />
        ))}
      </div>
    </div>
  );
}

// ── Semantic Map (2D SVG) ────────────────────────────────────────────────────
function SemanticMap({ group, language, isMobile }) {
  const tr = language === 'tr';
  const [hovered, setHovered] = useState(null);
  const size = isMobile ? 280 : 360;
  const pad = 40;
  const inner = size - pad * 2;

  return (
    <div className="fd-row" style={{
      background: 'linear-gradient(135deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.05) 100%)',
      border: `1px solid ${COLORS.glassBorderSoft}`,
      borderRadius: 12, padding: 20,
      display: 'flex',
      alignItems: 'center', gap: 20,
    }}>
      <div style={{ flexShrink: 0 }}>
        <svg aria-hidden="true" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Axes */}
          <line x1={pad} y1={size / 2} x2={size - pad} y2={size / 2} stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="3,3" />
          <line x1={size / 2} y1={pad} x2={size / 2} y2={size - pad} stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="3,3" />
          {/* Axis labels */}
          <text x={pad - 4} y={size / 2 - 6} fill={SEMANTIC.textFaint} fontSize="10" fontFamily={FONTS.body} textAnchor="start">
            {tr ? 'Somut' : 'Concrete'}
          </text>
          <text x={size - pad + 4} y={size / 2 - 6} fill={SEMANTIC.textFaint} fontSize="10" fontFamily={FONTS.body} textAnchor="end">
            {tr ? 'Soyut' : 'Abstract'}
          </text>
          <text x={size / 2 + 6} y={pad + 4} fill={SEMANTIC.textFaint} fontSize="10" fontFamily={FONTS.body} textAnchor="start">
            {tr ? 'Yoğun' : 'Intense'}
          </text>
          <text x={size / 2 + 6} y={size - pad - 2} fill={SEMANTIC.textFaint} fontSize="10" fontFamily={FONTS.body} textAnchor="start">
            {tr ? 'Hafif' : 'Light'}
          </text>

          {/* Dots */}
          {group.words.map(w => {
            const axes = w.semanticAxes || { x: 0.5, y: 0.5 };
            const cx = pad + axes.x * inner;
            const cy = size - pad - axes.y * inner;
            const isHov = hovered === w.id;
            return (
              <g key={w.id}
                onMouseEnter={() => setHovered(w.id)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: 'pointer' }}
              >
                <circle
                  cx={cx} cy={cy}
                  r={isHov ? 11 : 8}
                  fill={w.color}
                  opacity={isHov ? 1 : 0.85}
                  style={{ transition: `all ${TRANSITION.base}`, filter: isHov ? `drop-shadow(0 0 8px ${w.color})` : 'none' }}
                />
                <text x={cx} y={cy - 14} fill="#fff" fontSize="11" fontFamily={FONTS.body} fontWeight="700" textAnchor="middle" style={{ pointerEvents: 'none' }}>
                  {w.tr}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend / hovered info */}
      <div style={{ flex: 1, minWidth: 200 }}>
        <div style={{ fontSize: '0.68rem', color: SEMANTIC.textFaint, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, fontFamily: FONTS.body, marginBottom: 10 }}>
          {tr ? 'Anlam Haritası' : 'Semantic Map'}
        </div>
        {hovered ? (() => {
          const w = group.words.find(x => x.id === hovered);
          if (!w) return null;
          return (
            <div style={{ padding: 14, background: 'rgba(0,0,0,0.25)', border: `1px solid ${w.color}40`, borderRadius: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ fontFamily: FONTS.quran, fontSize: '1.3rem', color: w.color, direction: 'rtl' }} lang="ar" dir="rtl">{cleanArabic(w.ar)}</span>
                <span style={{ fontSize: '0.9rem', color: COLORS.offWhite, fontWeight: 600, fontFamily: FONTS.body }}>{w.tr}</span>
                <span style={{ fontSize: '0.72rem', color: COLORS.silver, fontFamily: FONTS.body, marginLeft: 'auto' }}>{w.frequency}×</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: COLORS.silver, fontFamily: FONTS.body, margin: 0, lineHeight: 1.55 }}>
                {tr ? w.meaningTr : w.meaningEn}
              </p>
            </div>
          );
        })() : (
          <p style={{ fontSize: '0.8rem', color: COLORS.silver, fontFamily: FONTS.body, margin: 0, lineHeight: 1.6, fontStyle: 'italic' }}>
            {tr
              ? 'Noktaların üzerine gelin — her kelimenin bağlamdaki yerini görün.'
              : 'Hover over the dots to see each word\'s position in context.'}
          </p>
        )}
      </div>
    </div>
  );
}

// ── Word Card ────────────────────────────────────────────────────────────────
function WordCard({ word, expanded, onToggle, language, isMobile }) {
  const tr = language === 'tr';
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all'
    ? word.allOccurrences
    : word.allOccurrences.filter(o => o.context === filter);

  const patternEntries = Object.entries(word.patternStat)
    .filter(([k, v]) => typeof v === 'number' && v > 0 && k !== 'dominantPercentage')
    .filter(([k]) => k !== 'dominantPattern');
  const total = patternEntries.reduce((s, [, v]) => s + v, 0);

  const dominant = word.patternStat.dominantPattern;
  const dominantLabel = dominant ? (tr ? CONTEXT_LABELS[dominant]?.tr : CONTEXT_LABELS[dominant]?.en) : null;

  return (
    <div style={{
      background: `linear-gradient(135deg, ${word.color}0A 0%, rgba(255,255,255,0.02) 100%)`,
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 14, overflow: 'hidden',
      transition: 'border-color 0.2s',
      position: 'relative',
    }}>
      {/* Top accent stripe */}
      <div style={{ height: 3, background: `linear-gradient(90deg, ${word.color} 0%, ${word.color}40 100%)` }} />

      {/* Header */}
      <div style={{ padding: isMobile ? '18px 16px 16px' : '22px 24px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          {/* Arabic badge */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            minWidth: isMobile ? 60 : 72, height: isMobile ? 60 : 72,
            padding: '0 14px', borderRadius: 14,
            background: `${word.color}14`,
            border: `1px solid ${word.color}35`,
            flexShrink: 0,
            boxShadow: `0 0 24px ${word.color}20`,
          }}>
            <span style={{ fontFamily: FONTS.quran, fontSize: isMobile ? '1.9rem' : '2.1rem', color: word.color, direction: 'rtl', lineHeight: 1 }} lang="ar" dir="rtl">
              {cleanArabic(word.ar)}
            </span>
          </div>

          {/* Name + meta */}
          <div style={{ flex: 1, minWidth: 180, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
              <span style={{ fontSize: isMobile ? '1.15rem' : '1.3rem', fontWeight: 700, color: COLORS.offWhite, fontFamily: FONTS.display, lineHeight: 1 }}>
                {word.tr}
              </span>
              <span style={{ fontSize: '0.78rem', color: COLORS.silver, fontFamily: FONTS.body, fontStyle: 'italic' }}>
                {word.transliteration}
              </span>
            </div>
            {/* Metric pills */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                fontSize: '0.7rem', color: COLORS.gold,
                fontFamily: FONTS.body, fontWeight: 700,
                padding: '3px 10px', borderRadius: 20,
                background: 'rgba(212,165,116,0.1)',
                border: `1px solid ${COLORS.goldAlpha25}`,
              }}>
                <svg aria-hidden="true" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 20V10M12 20V4M6 20v-6" />
                </svg>
                {word.frequency}× {tr ? 'geçiş' : 'occurrences'}
              </span>
              {dominant && (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  fontSize: '0.7rem', color: CONTEXT_COLORS[dominant],
                  fontFamily: FONTS.body, fontWeight: 700,
                  padding: '3px 10px', borderRadius: 20,
                  background: `${CONTEXT_COLORS[dominant]}15`,
                  border: `1px solid ${CONTEXT_COLORS[dominant]}35`,
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: RADIUS.full, background: CONTEXT_COLORS[dominant] }} />
                  {dominantLabel} · %{word.patternStat.dominantPercentage}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Meaning */}
        <p style={{ fontSize: '0.88rem', color: 'rgba(232,230,227,0.82)', fontFamily: FONTS.body, lineHeight: 1.7, margin: '18px 0 16px' }}>
          {tr ? word.meaningTr : word.meaningEn}
        </p>

        {/* Distinction — elegant callout */}
        <div style={{
          display: 'flex', gap: 14,
          padding: '12px 16px',
          background: 'rgba(0,0,0,0.2)',
          border: `1px solid ${COLORS.glassBg}`,
          borderLeft: `2px solid ${word.color}80`,
          borderRadius: 6,
        }}>
          {/* Quote mark */}
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill={word.color} opacity="0.4" style={{ flexShrink: 0, marginTop: 2 }}>
            <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
          </svg>
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: '0.6rem', color: word.color,
              textTransform: 'uppercase', letterSpacing: '0.16em',
              fontWeight: 700, fontFamily: FONTS.body,
              marginBottom: 4, opacity: 0.85,
            }}>
              {tr ? 'Kelime İmzası' : 'Word Signature'}
            </div>
            <p style={{
              fontSize: '0.84rem', color: COLORS.offWhite,
              fontFamily: FONTS.body, margin: 0, lineHeight: 1.6,
              fontStyle: 'italic',
            }}>
              {tr ? word.distinctionTr : word.distinctionEn}
            </p>
          </div>
        </div>
      </div>

      {/* Expand toggle — footer style */}
      <button
        onClick={onToggle}
        style={{
          width: '100%', padding: '12px 20px',
          background: expanded ? 'rgba(212,165,116,0.06)' : 'rgba(0,0,0,0.15)',
          border: 'none',
          borderTop: `1px solid ${COLORS.glassBg}`,
          cursor: 'pointer',
          color: expanded ? COLORS.gold : COLORS.silver,
          fontSize: '0.75rem', fontFamily: FONTS.body, fontWeight: 600,
          letterSpacing: '0.04em',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          transition: `all ${TRANSITION.fast}`,
        }}
        onMouseEnter={e => { if (!expanded) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
        onMouseLeave={e => { if (!expanded) e.currentTarget.style.background = 'rgba(0,0,0,0.15)'; }}
      >
        <span>
          {expanded
            ? (tr ? 'Ayet listesini gizle' : 'Hide verse list')
            : (tr ? `${word.allOccurrences.length} ayet geçişini incele` : `Inspect ${word.allOccurrences.length} verse occurrences`)}
        </span>
        <svg aria-hidden="true" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
          style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Expanded */}
      {expanded && (
        <div style={{
          padding: isMobile ? '16px' : '20px 24px',
          background: 'rgba(0,0,0,0.15)',
          borderTop: `1px solid ${COLORS.glassBg}`,
        }}>
          {/* Context distribution — stacked bar visualization */}
          <div style={{ marginBottom: 18 }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: 10,
            }}>
              <span style={{
                fontSize: '0.66rem', color: COLORS.gold,
                textTransform: 'uppercase', letterSpacing: '0.14em',
                fontWeight: 700, fontFamily: FONTS.body,
              }}>
                {tr ? 'Bağlam Dağılımı' : 'Context Distribution'}
              </span>
              <span style={{ fontSize: '0.7rem', color: COLORS.silver, fontFamily: FONTS.body }}>
                {total} {tr ? 'ayet' : 'verses'}
              </span>
            </div>

            {/* Stacked segment bar */}
            <div style={{
              display: 'flex', height: 8, borderRadius: 4,
              overflow: 'hidden', marginBottom: 10,
              background: 'rgba(255,255,255,0.04)',
            }}>
              {patternEntries.map(([ctx, count]) => {
                const pct = total > 0 ? (count / total) * 100 : 0;
                return (
                  <div key={ctx} style={{
                    width: `${pct}%`,
                    background: CONTEXT_COLORS[ctx],
                    transition: 'width 0.5s ease',
                  }} />
                );
              })}
            </div>

            {/* Legend + detail */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
              {patternEntries.map(([ctx, count]) => {
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                  <div key={ctx} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <span style={{ width: 10, height: 10, borderRadius: 2, background: CONTEXT_COLORS[ctx], flexShrink: 0 }} />
                    <span style={{ fontSize: '0.75rem', color: COLORS.offWhite, fontFamily: FONTS.body, fontWeight: 600 }}>
                      {tr ? CONTEXT_LABELS[ctx]?.tr : CONTEXT_LABELS[ctx]?.en}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: COLORS.silver, fontFamily: FONTS.body }}>
                      {count} ({pct}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Filter chips */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            flexWrap: 'wrap', marginBottom: 14,
            paddingBottom: 14,
            borderBottom: `1px solid ${COLORS.glassBg}`,
          }}>
            <span style={{ fontSize: '0.65rem', color: COLORS.silver, fontFamily: FONTS.body, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginRight: 4 }}>
              {tr ? 'Filtrele:' : 'Filter:'}
            </span>
            {['all', ...Object.keys(CONTEXT_COLORS).filter(c => word.patternStat[c] > 0)].map(f => {
              const active = filter === f;
              const label = f === 'all'
                ? (tr ? 'Tümü' : 'All')
                : (tr ? CONTEXT_LABELS[f]?.tr : CONTEXT_LABELS[f]?.en);
              const count = f === 'all' ? word.allOccurrences.length : (word.patternStat[f] || 0);
              const color = f === 'all' ? COLORS.gold : CONTEXT_COLORS[f];
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    padding: '4px 12px', borderRadius: 20,
                    border: `1px solid ${active ? color : COLORS.glassBorder}`,
                    background: active ? `${color}20` : 'transparent',
                    color: active ? color : 'rgba(232,230,227,0.6)',
                    fontSize: '0.72rem', fontFamily: FONTS.body, fontWeight: active ? 700 : 500,
                    cursor: 'pointer', transition: `all ${TRANSITION.fast}`,
                  }}
                >
                  {f !== 'all' && <span style={{ width: 6, height: 6, borderRadius: RADIUS.full, background: color }} />}
                  {label}
                  <span style={{ opacity: 0.7 }}>({count})</span>
                </button>
              );
            })}
          </div>

          {/* Verse list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filtered.map((occ, i) => (
              <VerseRow key={i} occurrence={occ} language={language} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Verse Row (lazy load Arabic + highlight) ─────────────────────────────────
function VerseRow({ occurrence, language }) {
  const tr = language === 'tr';
  const [open, setOpen] = useState(false);
  const [verse, setVerse] = useState(null);
  const [loading, setLoading] = useState(false);

  const expand = () => {
    if (!open && !verse && !loading) {
      setLoading(true);
      const [s, a] = occurrence.ref.split(':').map(Number);
      loadVerse(s, a).then(v => { setVerse(v); setLoading(false); });
    }
    setOpen(!open);
  };

  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 8, overflow: 'hidden',
    }}>
      <button
        onClick={expand}
        style={{
          width: '100%', padding: '10px 14px',
          background: 'transparent', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left',
        }}
      >
        <span style={{
          width: 8, height: 8, borderRadius: RADIUS.full,
          background: CONTEXT_COLORS[occurrence.context] || COLORS.silver,
          flexShrink: 0,
        }} />
        <span style={{ fontSize: '0.78rem', color: COLORS.gold, fontFamily: FONTS.body, fontWeight: 600, flexShrink: 0, minWidth: 120 }}>
          {surahRefLabel(occurrence.ref)}
        </span>
        <span style={{ fontSize: '0.78rem', color: COLORS.silver, fontFamily: FONTS.body, flex: 1, lineHeight: 1.5 }}>
          {occurrence.note}
        </span>
        <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={COLORS.silver} strokeWidth="2.5" strokeLinecap="round"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s', flexShrink: 0 }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div style={{ padding: '0 14px 14px', borderTop: `1px solid ${COLORS.glassBg}` }}>
          {loading && (
            <p style={{ color: COLORS.silver, fontSize: '0.8rem', fontFamily: FONTS.body, margin: '12px 0 0', fontStyle: 'italic' }}>
              {tr ? 'Ayet yükleniyor…' : 'Loading verse…'}
            </p>
          )}
          {verse && (
            <>
              <HighlightedArabic arabic={verse.arabic} targetWord={occurrence.targetWord} />
              <p style={{
                marginTop: 10, fontSize: '0.82rem', color: COLORS.offWhite,
                fontFamily: FONTS.body, fontStyle: 'italic', lineHeight: 1.65,
              }}>
                &ldquo;{stripFootnotes(verse.turkish)}&rdquo;
              </p>
              <span style={{ fontSize: '0.72rem', color: 'rgba(212,165,116,0.6)', fontFamily: FONTS.body, fontWeight: 600 }}>
                — {surahRefLabel(occurrence.ref)}
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ── Arabic verse with target word highlighted ────────────────────────────────
function HighlightedArabic({ arabic, targetWord }) {
  const cleaned = cleanArabic(arabic);
  const cleanedTarget = cleanArabic(targetWord || '');
  const words = cleaned.split(/\s+/);

  // Normalize both target and each word by removing harakat for comparison
  const strip = (s) => s.replace(/[\u064B-\u0652\u0670\u0653\u0654\u0655]/g, '');
  const targetStripped = strip(cleanedTarget);

  return (
    <div
      dir="rtl" lang="ar"
      style={{
        fontFamily: FONTS.quran, fontSize: '1.4rem',
        color: COLORS.gold, textAlign: 'right',
        lineHeight: 2, marginTop: 12,
        padding: '10px 14px',
        background: COLORS.goldAlpha04,
        border: `1px solid ${COLORS.goldAlpha15}`,
        borderRadius: 8,
      }}
    >
      {words.map((w, idx) => {
        const wStripped = strip(w);
        const match = targetStripped && (wStripped === targetStripped || wStripped.includes(targetStripped) || targetStripped.includes(wStripped));
        return (
          <span
            key={idx}
            style={match ? {
              color: '#fff',
              fontWeight: 700,
              textDecoration: 'underline',
              textDecorationColor: 'rgba(212,165,116,0.6)',
              textUnderlineOffset: 4,
              padding: '0 2px',
              background: COLORS.goldAlpha20,
              borderRadius: 3,
            } : {}}
          >
            {w}{' '}
          </span>
        );
      })}
    </div>
  );
}

// ── Tab 2: Principles ────────────────────────────────────────────────────────
function TabPrinciples({ principles, groups, language, isMobile, onSelectGroup }) {
  const tr = language === 'tr';
  return (
    <div>
      <p style={{ fontSize: '0.88rem', color: COLORS.silver, fontFamily: FONTS.body, lineHeight: 1.7, margin: '0 0 24px' }}>
        {tr
          ? "Klasik furûk geleneğinden seçilmiş prensipler. Her prensip bir ayrımın özünü tek cümleyle verir — arkasındaki tüm kelime ailesi ilgili gruba bakılarak görülebilir."
          : 'Principles selected from the classical furūq tradition. Each principle captures the essence of a distinction in one sentence — the full word family behind it can be explored in the linked group.'}
      </p>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
        gap: 14,
      }}>
        {principles.map(p => {
          const group = groups.find(g => g.id === p.groupId);
          return (
            <div key={p.id} style={{
              background: COLORS.goldAlpha04,
              border: `1px solid ${COLORS.goldAlpha15}`,
              borderRadius: 12, padding: isMobile ? '16px' : '20px 22px',
              display: 'flex', flexDirection: 'column',
            }}>
              <p style={{
                fontSize: '1rem', color: COLORS.offWhite,
                fontFamily: FONTS.display, fontStyle: 'italic',
                margin: '0 0 12px', lineHeight: 1.55,
              }}>
                &ldquo;{tr ? p.quoteTr : p.quoteEn}&rdquo;
              </p>
              <p style={{ fontSize: '0.82rem', color: COLORS.silver, fontFamily: FONTS.body, margin: '0 0 12px', lineHeight: 1.65 }}>
                {tr ? p.expansionTr : p.expansionEn}
              </p>
              <div style={{ fontSize: '0.72rem', color: 'rgba(212,165,116,0.7)', fontFamily: FONTS.body, marginBottom: 12 }}>
                — {p.source}
              </div>
              {group && (
                <button
                  onClick={() => onSelectGroup(group.id)}
                  style={{
                    marginTop: 'auto',
                    padding: '8px 12px',
                    background: 'rgba(212,165,116,0.08)',
                    border: `1px solid ${COLORS.goldAlpha25}`,
                    borderRadius: 8, cursor: 'pointer',
                    color: COLORS.gold,
                    fontSize: '0.76rem', fontFamily: FONTS.body, fontWeight: 600,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    transition: `all ${TRANSITION.fast}`,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,165,116,0.16)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(212,165,116,0.08)'; }}
                >
                  <span>{tr ? 'İlgili Grup' : 'Related Group'}: {tr ? group.titleTr : group.titleEn}</span>
                  <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Tab 3: Sources ───────────────────────────────────────────────────────────
function TabSources({ sources, language, isMobile }) {
  const tr = language === 'tr';
  const ROLE_COLORS = {
    'Kurucu': '#e74c3c', 'Founder': '#e74c3c',
    'Geliştirici': '#3498db', 'Developer': '#3498db',
    'Çağdaş': '#2ecc71', 'Contemporary': '#2ecc71',
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
      gap: 14,
    }}>
      {sources.map((s, i) => {
        const role = tr ? s.roleTr : s.roleEn;
        const roleColor = ROLE_COLORS[role] || COLORS.gold;
        return (
          <div key={i} style={{
            background: 'rgba(255,255,255,0.025)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 12, padding: isMobile ? '16px' : '20px 24px',
          }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10, marginBottom: 6 }}>
              <span style={{ fontSize: '1rem', fontWeight: 700, color: COLORS.gold, fontFamily: FONTS.display }}>
                {tr ? s.nameTr : s.nameEn}
              </span>
              <span style={{
                fontSize: '0.62rem', color: roleColor,
                background: `${roleColor}18`, border: `1px solid ${roleColor}30`,
                padding: '2px 10px', borderRadius: 12,
                fontFamily: FONTS.body, fontWeight: 700, flexShrink: 0,
              }}>
                {role}
              </span>
            </div>
            <div style={{ fontSize: '0.72rem', color: COLORS.silver, fontFamily: FONTS.body, marginBottom: 10 }}>
              {s.died} · {s.city}
            </div>
            <div style={{ fontSize: '0.85rem', color: COLORS.offWhite, fontFamily: FONTS.body, fontStyle: 'italic', marginBottom: 10 }}>
              {tr ? s.workTr : s.workEn}
            </div>
            <p style={{ fontSize: '0.82rem', color: COLORS.silver, fontFamily: FONTS.body, lineHeight: 1.65, margin: 0 }}>
              {tr ? s.descTr : s.descEn}
            </p>
          </div>
        );
      })}
      <div style={{
        gridColumn: '1/-1',
        background: 'rgba(148,163,184,0.06)',
        border: `1px solid rgba(148,163,184,0.14)`,
        borderRadius: 10, padding: '14px 16px',
        display: 'flex', gap: 10, alignItems: 'flex-start',
      }}>
        <span style={{ color: COLORS.silver, fontSize: '0.85rem', flexShrink: 0 }}>ℹ</span>
        <p style={{ color: COLORS.silver, fontSize: '0.78rem', fontFamily: FONTS.body, lineHeight: 1.65, margin: 0 }}>
          {tr
            ? 'Bu sayfadaki kelime grupları klasik furûk geleneğine (Askerî, İsfahânî, İbn Kayyım) dayanmaktadır. Ayet geçişleri Kur\'an Arabic Corpus (corpus.quran.com) ile eşlenir. İlk sürümde 4 örnek grup — sonraki aşamalarda 30+ gruba çıkacaktır.'
            : 'The word groups on this page are based on the classical furūq tradition (al-ʿAskarī, al-Iṣfahānī, Ibn Qayyim). Verse occurrences are cross-referenced with Quran Arabic Corpus (corpus.quran.com). This initial release includes 4 sample groups — future phases will expand to 30+ groups.'}
        </p>
      </div>
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function PrismIcon() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 22 20 2 20" />
      <line x1="12" y1="2" x2="12" y2="20" />
      <line x1="7" y1="11" x2="17" y2="11" opacity="0.5" />
    </svg>
  );
}

