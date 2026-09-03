'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import useFocusTrap from '../hooks/useFocusTrap';
import {
  COLORS, FONTS, BREAKPOINT_TABLET, TRANSITION, RADIUS, SEMANTIC } from '../tokens';
import ToolHeader from './ToolHeader';
import CrossToolCTA from './CrossToolCTA';
import HeroGeometricBackground from './HeroGeometricBackground';
import useNavbarOffset from './useNavbarOffset';
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
  const clean = name.replace(/^(El-|En-|Et-|Eş-|Es-|Ez-|Er-|Ed-)/, '');
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

// Bir grubun "baskın rengi" — kelimelerinin çoğunluk bağlamına göre.
// GroupCard ve Prensip Kitaplığı kartları arasında tutarlılık için paylaşılır.
function groupAccent(group) {
  if (!group) return COLORS.gold;
  const counts = {};
  for (const w of group.words) {
    const p = w.patternStat.dominantPattern;
    counts[p] = (counts[p] || 0) + 1;
  }
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
  return CONTEXT_COLORS[top] || COLORS.gold;
}

// ── Cinematic Hero (§13.18) ───────────────────────────────────────────────────
function Hero({ language, isMobile }) {
  const tr = language === 'tr';
  return (
    <div style={{
      position: 'relative', overflow: 'hidden',
      padding: isMobile ? '40px 16px 28px' : '56px 32px 36px',
      background: 'linear-gradient(180deg, rgba(212,165,116,0.06) 0%, transparent 100%)',
      borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
      textAlign: 'center',
    }}>
      <HeroGeometricBackground />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div aria-hidden="true" className="mq-fs" style={{
          fontFamily: FONTS.bismillah, '--fs-d': '2.3rem', '--fs-m': '1.9rem',
          color: COLORS.gold, opacity: 0.82, marginBottom: '22px', lineHeight: 1.2,
        }}>﷽</div>

        <p dir="rtl" lang="ar" className="mq-fs" style={{
          fontFamily: FONTS.quran, color: COLORS.gold,
          '--fs-d': 'clamp(1.5rem, 2.6vw, 1.85rem)', '--fs-m': '1.3rem',
          lineHeight: 2.1, margin: '0 0 14px',
        }}>
          كِتَابٌ فُصِّلَتْ آيَاتُهُ قُرْآنًا عَرَبِيًّا لِّقَوْمٍ يَعْلَمُونَ
        </p>
        <p className="mq-fs" style={{
          fontFamily: FONTS.display, fontStyle: 'italic', color: COLORS.offWhite,
          '--fs-d': '1.05rem', '--fs-m': '0.95rem', lineHeight: 1.6,
          maxWidth: '660px', margin: '0 auto 8px',
        }}>
          {tr
            ? '"Bilen bir toplum için âyetleri ayrıntılı kılınmış, Arapça okunan bir Kitap."'
            : '"A Book whose verses are detailed — an Arabic Qur’an for a people who know."'}
        </p>
        <p style={{
          fontFamily: FONTS.body, color: COLORS.silver, opacity: 0.7,
          fontSize: '0.72rem', letterSpacing: '0.16em', textTransform: 'uppercase',
          margin: '0 0 24px',
        }}>— {tr ? 'Fussilet 41:3' : 'Fussilat 41:3'}</p>

        <p className="mq-fs" style={{
          fontFamily: FONTS.display, fontStyle: 'italic', color: COLORS.silver,
          '--fs-d': '1rem', '--fs-m': '0.92rem', lineHeight: 1.75,
          maxWidth: '700px', margin: '0 auto 24px',
        }}>
          {tr
            ? <>Aynı Türkçe kelimeye çevrilen iki Arapça sözcük çoğu zaman <em style={{ color: COLORS.gold, fontStyle: 'italic' }}>aynı şey</em> değildir — Kur&apos;an&apos;ın seçimi hiçbir zaman <em style={{ color: COLORS.gold, fontStyle: 'italic' }}>rastgele</em> olmaz.</>
            : <>Two Arabic words translated by the same English word are often <em style={{ color: COLORS.gold, fontStyle: 'italic' }}>not the same thing</em> — the Qur&apos;an&apos;s choice is never <em style={{ color: COLORS.gold, fontStyle: 'italic' }}>arbitrary</em>.</>}
        </p>

        <div style={{ width: '120px', height: '1px', margin: '0 auto 24px', background: `linear-gradient(90deg, transparent, ${COLORS.gold}aa, transparent)` }} />

        <p style={{
          color: COLORS.gold, fontSize: '0.72rem', letterSpacing: '0.3em',
          textTransform: 'uppercase', opacity: 0.72, fontWeight: 700, margin: '0 0 12px',
        }}>{tr ? "İLMÜ'L-FÜRÛK · KELİME SEÇİMİNİN MİMARİSİ" : 'ʿILM AL-FURŪQ · THE ARCHITECTURE OF WORD CHOICE'}</p>
        <h1 className="mq-fs" style={{
          fontFamily: FONTS.display, color: COLORS.offWhite, fontWeight: 700,
          '--fs-d': 'clamp(2rem, 3.6vw, 2.7rem)', '--fs-m': 'clamp(1.6rem, 7vw, 2rem)',
          lineHeight: 1.2, margin: '0 0 10px',
        }}>{tr ? 'Füruk Atlası' : 'Atlas of Semantic Distinctions'}</h1>
        <p className="mq-fs" style={{
          fontFamily: FONTS.display, fontStyle: 'italic', color: COLORS.gold,
          '--fs-d': 'clamp(1.05rem, 1.8vw, 1.18rem)', '--fs-m': 'clamp(1rem, 4vw, 1.1rem)',
          margin: 0,
        }}>{tr ? 'Eş anlamlı görünen kelimeler arasındaki keskin çizgi' : 'The sharp line between apparently synonymous words'}</p>
      </div>
    </div>
  );
}

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
  const navTop = useNavbarOffset(0, 62);

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
      subtitleTr="Eş anlamlılarda ince fark · 34 aile"
      subtitleEn="Subtle distinctions · 34 word families"
      language={language}
    />
  );

  // #202 (2026-07-15) — CTA hem loading skeleton'da hem main return'de görünsün (SSR SEO)
  const RELATED_CTA = (
    <div className="mq-box" style={{ maxWidth: 1080, margin: '0 auto', '--pt-d': "40px", '--pt-m': "24px", '--pr-d': "24px", '--pr-m': "16px", '--pb-d': "48px", '--pb-m': "32px", '--pl-d': "24px", '--pl-m': "16px", width: '100%' }}>
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
          minHeight: `calc(100vh - ${navTop}px)`,
          display: 'flex', flexDirection: 'column',
          paddingTop: `${navTop}px`,
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
        minHeight: `calc(100vh - ${navTop}px)`,
        display: 'flex', flexDirection: 'column',
        paddingTop: `${navTop}px`,
      }}
    >
      {FURUK_TOOL_HEADER}

      {/* ── SCROLLABLE BODY ────────────────────────────────────────────────── */}
      <div ref={bodyRef} style={{ flex: 1 }}>

        <Hero language={language} isMobile={isMobile} />

        {/* ── MANIFESTO STRIP ─────────────────────────────────────────────── */}
        <div className="mq-box" style={{
          '--pt-d': "32px", '--pt-m': "22px", '--pr-d': "40px", '--pr-m': "16px", '--pb-d': "28px", '--pb-m': "20px", '--pl-d': "40px", '--pl-m': "16px",
          borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
        }}>
          <div style={{ fontSize: '0.62rem', letterSpacing: '0.15em', color: COLORS.gold, textTransform: 'uppercase', fontFamily: FONTS.body, fontWeight: 700, marginBottom: 8 }}>
            {tr ? 'AYNI ÇEVİRİ · FARKLI ANLAM' : 'SAME TRANSLATION · DIFFERENT MEANING'}
          </div>
          <h2 className="mq-fs" style={{
            color: COLORS.offWhite, '--fs-d': '1.6rem', '--fs-m': '1.25rem',
            fontWeight: 700, fontFamily: FONTS.display, margin: '0 0 12px',
            lineHeight: 1.3,
          }}>
            {tr ? 'İddia değil, veri göster.' : 'Show data, not claims.'}
          </h2>
          <p className="mq-fs" style={{
            color: COLORS.silver, '--fs-d': '0.95rem', '--fs-m': '0.9rem',
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
        <div style={{ position: 'sticky', top: `${navTop + 48}px`, zIndex: 20, background: 'rgb(6, 8, 14)',
          backgroundColor: 'rgb(6, 8, 14)',
          isolation: 'isolate' }}>
          <div className="mq-box" id="furuk-tab-bar" style={{
            display: 'flex', gap: 2,
            '--pt-d': "0", '--pt-m': "0", '--pr-d': "16px", '--pr-m': "8px", '--pb-d': "0", '--pb-m': "0", '--pl-d': "16px", '--pl-m': "8px",
            borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
            overflowX: 'auto', scrollbarWidth: 'none',
          }}>
            {TABS.map((t, i) => {
              const active = activeTab === i;
              return (
                <button className="mq-box"
                  key={i}
                  onClick={() => { setActiveTab(i); setTimeout(() => { const _tb = document.getElementById('furuk-tab-bar'); if (_tb) _tb.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 50); }}
                  className="mq-fs" style={{
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    flexShrink: 0,
                    display: 'flex', alignItems: 'center', gap: 8,
                    '--pt-d': "13px", '--pt-m': "12px", '--pr-d': "22px", '--pr-m': "14px", '--pb-d': "13px", '--pb-m': "12px", '--pl-d': "22px", '--pl-m': "14px",
                    border: 'none',
                    background: active ? COLORS.goldAlpha15 : 'transparent',
                    borderBottom: active ? `2px solid ${COLORS.gold}` : '2px solid transparent',
                    borderRadius: 0,
                    color: active ? COLORS.gold : COLORS.silver,
                    '--fs-d': '0.9rem', '--fs-m': '0.85rem',
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
                  <span className="qc-tab-label">{tr ? t.tr : t.en}</span>
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
        <div className="mq-box" style={{ '--pt-d': "28px", '--pt-m': "20px", '--pr-d': "32px", '--pr-m': "16px", '--pb-d': "60px", '--pb-m': "40px", '--pl-d': "32px", '--pl-m': "16px" }}>
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
              categories={data.categories}
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
            <TabSources sources={data.sources} totalGroups={data.meta.totalGroups} language={language} isMobile={isMobile} />
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
  const cardAccent = groupAccent(group);
  return (
    <button
      onClick={onClick}
      style={{
        textAlign: 'left',
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderTop: `2px solid ${cardAccent}`,
        borderRadius: 14,
        padding: '18px 20px',
        cursor: 'pointer',
        transition: `all ${TRANSITION.base}`,
        display: 'flex', flexDirection: 'column', gap: 12,
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,165,116,0.06)'; e.currentTarget.style.borderLeftColor = 'rgba(212,165,116,0.3)'; e.currentTarget.style.borderRightColor = 'rgba(212,165,116,0.3)'; e.currentTarget.style.borderBottomColor = 'rgba(212,165,116,0.3)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.025)'; e.currentTarget.style.borderLeftColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderRightColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.06)'; }}
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

      {/* Word list — dot = dominant context; alt şerit = pozitif/nötr/negatif dağılımı */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {group.words.map(w => {
          const dotColor = CONTEXT_COLORS[w.patternStat.dominantPattern] || COLORS.silver;
          const { positive = 0, neutral = 0, negative = 0 } = w.patternStat;
          const total = positive + neutral + negative;
          return (
            <div key={w.id} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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
              {total > 0 && (
                <div
                  style={{ display: 'flex', height: 3, borderRadius: RADIUS.full, overflow: 'hidden', marginLeft: 18 }}
                  title={tr
                    ? `Rahmet ${positive} · Nötr ${neutral} · Azap ${negative}`
                    : `Mercy ${positive} · Neutral ${neutral} · Punishment ${negative}`}
                >
                  {positive > 0 && <div style={{ flex: positive, background: CONTEXT_COLORS.positive }} />}
                  {neutral > 0 && <div style={{ flex: neutral, background: CONTEXT_COLORS.neutral }} />}
                  {negative > 0 && <div style={{ flex: negative, background: CONTEXT_COLORS.negative }} />}
                </div>
              )}
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
function TabGroupDetail({ group, allGroups, categories, language, isMobile, onSelectGroup }) {
  const tr = language === 'tr';
  const [expandedWordId, setExpandedWordId] = useState(null);

  if (!group) return null;

  const accent = groupAccent(group);
  const categoryMeta = categories?.find(c => c.id === group.category);

  return (
    <div>
      {/* Group selector chips — dominant-context dot per chip for scannability */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 24 }}>
        {allGroups.map(g => {
          const active = g.id === group.id;
          const chipAccent = groupAccent(g);
          return (
            <button
              key={g.id}
              onClick={() => onSelectGroup(g.id)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                padding: '6px 14px 6px 10px', borderRadius: 20,
                border: `1px solid ${active ? COLORS.gold : `${chipAccent}30`}`,
                background: active ? COLORS.goldAlpha15 : 'rgba(255,255,255,0.02)',
                color: active ? COLORS.gold : COLORS.silver,
                fontSize: '0.78rem', fontWeight: active ? 600 : 400,
                fontFamily: FONTS.body, cursor: 'pointer', transition: `all ${TRANSITION.fast}`,
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: RADIUS.full, background: chipAccent, flexShrink: 0 }} />
              {tr ? g.titleTr : g.titleEn}
            </button>
          );
        })}
      </div>

      {/* Hero — translation + word cluster, tinted to this group's dominant context */}
      <div className="mq-box" style={{
        background: `linear-gradient(135deg, ${accent}0F 0%, rgba(0,0,0,0.15) 100%)`,
        border: `1px solid ${accent}40`,
        borderTop: `2px solid ${accent}`,
        borderRadius: 14,
        '--pt-d': "32px", '--pt-m': "24px", '--pr-d': "40px", '--pr-m': "20px", '--pb-d': "32px", '--pb-m': "24px", '--pl-d': "40px", '--pl-m': "20px",
        marginBottom: 28,
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Subtle decorative glow */}
        <div style={{
          position: 'absolute', top: '-40px', right: '-40px',
          width: 180, height: 180, borderRadius: RADIUS.full,
          background: `radial-gradient(circle, ${accent}22 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />

        {categoryMeta && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: '0.6rem', color: accent, fontWeight: 700,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            fontFamily: FONTS.body, marginBottom: 18,
            padding: '3px 10px', borderRadius: 20,
            background: `${accent}14`, border: `1px solid ${accent}35`,
            position: 'relative',
          }}>
            {tr ? categoryMeta.titleTr : categoryMeta.titleEn}
          </div>
        )}

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
            <h2 className="mq-fs" style={{
              '--fs-d': '2.8rem', '--fs-m': '2.2rem', fontWeight: 800,
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
              background: `linear-gradient(180deg, transparent, ${accent}55, transparent)`,
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
      <div className="mq-box" style={{
        background: `${accent}0F`,
        border: `1px solid ${accent}35`,
        borderLeft: `4px solid ${accent}`,
        borderRadius: 10, '--pt-d': "20px", '--pt-m': "16px", '--pr-d': "24px", '--pr-m': "16px", '--pb-d': "20px", '--pb-m': "16px", '--pl-d': "24px", '--pl-m': "16px",
        marginBottom: 28, textAlign: 'center',
      }}>
        <div style={{ fontSize: '0.68rem', color: COLORS.gold, textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 700, fontFamily: FONTS.body, marginBottom: 10 }}>
          {tr ? 'Ayırt Edici Prensip' : 'Core Principle'}
        </div>
        <p className="mq-fs" style={{
          color: COLORS.offWhite, '--fs-d': '1.1rem', '--fs-m': '1rem',
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
      <SemanticMap group={group} language={language} isMobile={isMobile} accent={accent} />

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
function SemanticMap({ group, language, isMobile, accent = COLORS.gold }) {
  const tr = language === 'tr';
  const [hovered, setHovered] = useState(null);
  const size = isMobile ? 280 : 360;
  const pad = 40;
  const inner = size - pad * 2;

  return (
    <div className="fd-row" style={{
      background: 'linear-gradient(135deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.05) 100%)',
      border: `1px solid ${accent}30`,
      borderRadius: 12, padding: 20,
      display: 'flex',
      alignItems: 'center', gap: 20,
    }}>
      <div style={{ flexShrink: 0 }}>
        <svg aria-hidden="true" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Axes */}
          <line x1={pad} y1={size / 2} x2={size - pad} y2={size / 2} stroke={`${accent}30`} strokeWidth="1" strokeDasharray="3,3" />
          <line x1={size / 2} y1={pad} x2={size / 2} y2={size - pad} stroke={`${accent}30`} strokeWidth="1" strokeDasharray="3,3" />
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
      <div className="mq-box" style={{ '--pt-d': "22px", '--pt-m': "18px", '--pr-d': "24px", '--pr-m': "16px", '--pb-d': "18px", '--pb-m': "16px", '--pl-d': "24px", '--pl-m': "16px" }}>
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
            <span className="mq-fs" style={{ fontFamily: FONTS.quran, '--fs-d': '2.1rem', '--fs-m': '1.9rem', color: word.color, direction: 'rtl', lineHeight: 1 }} lang="ar" dir="rtl">
              {cleanArabic(word.ar)}
            </span>
          </div>

          {/* Name + meta */}
          <div style={{ flex: 1, minWidth: 180, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
              <span className="mq-fs" style={{ '--fs-d': '1.3rem', '--fs-m': '1.15rem', fontWeight: 700, color: COLORS.offWhite, fontFamily: FONTS.display, lineHeight: 1 }}>
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
        <div className="mq-box" style={{
          '--pt-d': "20px", '--pt-m': "16px", '--pr-d': "24px", '--pr-m': "16px", '--pb-d': "20px", '--pb-m': "16px", '--pl-d': "24px", '--pl-m': "16px",
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
        {principles.map((p, i) => {
          const group = groups.find(g => g.id === p.groupId);
          const accent = groupAccent(group);
          return (
            <div className="mq-box" key={p.id} style={{
              background: COLORS.goldAlpha04,
              border: `1px solid ${COLORS.goldAlpha15}`,
              borderTop: `2px solid ${accent}`,
              borderRadius: 12, '--pt-d': "20px", '--pt-m': "16px", '--pr-d': "22px", '--pr-m': "16px", '--pb-d': "20px", '--pb-m': "16px", '--pl-d': "22px", '--pl-m': "16px",
              display: 'flex', flexDirection: 'column',
            }}>
              <div style={{
                width: 26, height: 26, borderRadius: RADIUS.full, flexShrink: 0,
                background: `${accent}18`, border: `1.5px solid ${accent}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: FONTS.display, fontWeight: 700, color: accent, fontSize: '0.72rem',
                marginBottom: 10,
              }}>{i + 1}</div>
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
function TabSources({ sources, totalGroups, language, isMobile }) {
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
          <div className="mq-box" key={i} style={{
            background: 'rgba(255,255,255,0.025)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 12, '--pt-d': "20px", '--pt-m': "16px", '--pr-d': "24px", '--pr-m': "16px", '--pb-d': "20px", '--pb-m': "16px", '--pl-d': "24px", '--pl-m': "16px",
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
            ? `Bu sayfadaki kelime grupları klasik furûk geleneğine (Askerî, İsfahânî, İbn Kayyım) ve çağdaş incelemelere (es-Sâmerrâî, Nouman Ali Khan · Sharif Randhawa) dayanmaktadır. Ayet geçişleri Kur'an Arabic Corpus (corpus.quran.com) ile eşlenir. Şu an ${totalGroups} kelime ailesi yayında; yeni aileler doğrulandıkça eklenmeye devam eder.`
            : `The word groups on this page are based on the classical furūq tradition (al-ʿAskarī, al-Iṣfahānī, Ibn Qayyim) and contemporary studies (al-Sāmarrāʾī, Nouman Ali Khan · Sharif Randhawa). Verse occurrences are cross-referenced with Quran Arabic Corpus (corpus.quran.com). ${totalGroups} word families are published so far; more are added as they are verified.`}
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

