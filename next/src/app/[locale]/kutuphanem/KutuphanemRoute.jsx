'use client';

// ─── /kutuphanem — Global Bookmark Library ─────────────────────────────────
// Kullanıcı /sor + atlas + reading + tefsir + article sayfalarından
// BookmarkButton ile kaydettiği item'ların merkezi listesi.
// ────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { COLORS, FONTS } from '../../../tokens';
import { useLanguage } from '../../../i18n/LanguageContext';
import { listBookmarks, removeBookmark, libraryStats } from '../../../lib/bookmarks';

// Kütüphane tip etiketleri — RecentBookmarksStrip.jsx TYPE_LABELS ile senkron.
// Yeni bir bookmark tipi eklendiğinde her iki dosyada da label ekle.
// Session 2026-07-16: 22 tip artık desteklenir.
const TYPE_LABELS_TR = {
  verse: 'Ayet',
  tefsir: 'Tefsir',
  article: 'Makale',
  'article-section': 'Makale bölümü',
  'atlas-kissa': 'Kıssa',
  'atlas-kissa-scene': 'Kıssa sahnesi',
  'atlas-ahiret-yolculugu-stage': 'Ahiret aşaması',
  'atlas-kavim': 'Kavim',
  'atlas-esma': 'Esma',
  'atlas-dua': 'Dua',
  'atlas-kavram': 'Kavram',
  'atlas-kadin': 'Kadın figürü',
  'atlas-mesel': 'Mesel',
  'surah-summary': 'Sure özet',
  pericope: 'Ayet grubu',
  tool: 'Araç',
  'sebeb-nuzul': 'Sebeb-i Nüzûl',
  wowfact: 'Wow bilgisi',
  angel: 'Melek',
  'cennet-name': 'Cennet ismi',
  'cehennem-name': 'Cehennem ismi',
  yemin: 'Yemin',
  'kiyamet-scene': 'Kıyâmet sahnesi',
  sunnetullah: 'Sünnetullah örüntüsü',
  'doga-item': 'Tabiat ögesi',
  'ilk-son': 'İlk-Son kelime',
  'iblis-item': 'İblis pasajı',
  retorik: 'Belâgat',
  prophet: 'Peygamber',
};
const TYPE_LABELS_EN = {
  verse: 'Verse',
  tefsir: 'Tafsir',
  article: 'Article',
  'article-section': 'Article section',
  'atlas-kissa': 'Story',
  'atlas-kissa-scene': 'Story scene',
  'atlas-ahiret-yolculugu-stage': 'Afterlife stage',
  'atlas-kavim': 'Nation',
  'atlas-esma': 'Divine name',
  'atlas-dua': 'Prayer',
  'atlas-kavram': 'Concept',
  'atlas-kadin': 'Female figure',
  'atlas-mesel': 'Parable',
  'surah-summary': 'Surah',
  pericope: 'Pericope',
  tool: 'Tool',
  'sebeb-nuzul': 'Occasion of Revelation',
  wowfact: 'Wow fact',
  angel: 'Angel',
  'cennet-name': 'Paradise name',
  'cehennem-name': 'Hell name',
  yemin: 'Oath',
  'kiyamet-scene': 'Doomsday scene',
  sunnetullah: 'Divine pattern',
  'doga-item': 'Nature item',
  'ilk-son': 'First-Last word',
  'iblis-item': 'Iblīs passage',
  retorik: 'Rhetoric',
  prophet: 'Prophet',
};

export default function KutuphanemRoute() {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState({ total: 0, byType: {}, max: 100 });
  const [mounted, setMounted] = useState(false);

  const load = () => {
    setItems(listBookmarks({ sort: 'newest' }));
    setStats(libraryStats());
  };

  useEffect(() => {
    load();
    setMounted(true);
    const onChange = () => load();
    window.addEventListener('library-changed', onChange);
    return () => window.removeEventListener('library-changed', onChange);
  }, []);

  const filtered = filter === 'all' ? items : items.filter(i => i.type === filter);
  const labels = tr ? TYPE_LABELS_TR : TYPE_LABELS_EN;
  const types = Object.keys(stats.byType).sort((a, b) => stats.byType[b] - stats.byType[a]);

  const remove = (id) => {
    removeBookmark(id);
    // library-changed event handles reload
  };

  return (
    <div style={{
      background: COLORS.cosmicBlack,
      minHeight: 'calc(100vh - 62px)',
      paddingTop: '62px',
      color: COLORS.offWhite,
    }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px 80px' }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{
            fontSize: '0.72rem',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: COLORS.gold,
            fontWeight: 700,
            opacity: 0.85,
            marginBottom: 8,
          }}>
            {tr ? 'Kişisel' : 'Personal'}
          </div>
          <h1 style={{
            fontFamily: FONTS.display,
            fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
            fontWeight: 700,
            margin: '0 0 8px',
            color: COLORS.offWhite,
          }}>
            {tr ? 'Kütüphanem' : 'My Library'}
          </h1>
          <p style={{
            fontFamily: FONTS.body,
            fontSize: '0.95rem',
            color: COLORS.silver,
            margin: 0,
            maxWidth: 600,
          }}>
            {tr
              ? 'Kaydettiğin ayet, tefsir, makale ve atlas item\'ları burada. Her yerde 🔖 button ile ekle/çıkar.'
              : 'Verses, tafsirs, articles, and atlas items you saved. Add/remove with the 🔖 button anywhere.'}
          </p>
        </div>

        {/* Stats + filter chips */}
        {mounted && stats.total === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            color: COLORS.silver,
            background: 'rgba(255,255,255,0.02)',
            border: `1px solid ${COLORS.glassBorderSoft || 'rgba(255,255,255,0.06)'}`,
            borderRadius: 12,
          }}>
            <div style={{ fontSize: '2.5rem', opacity: 0.4, marginBottom: 12 }}>🔖</div>
            <p style={{ fontSize: '0.9rem', margin: 0 }}>
              {tr
                ? 'Henüz kayıt yok. /sor veya atlas sayfalarında 🔖 butonuyla ekle.'
                : 'No bookmarks yet. Add via the 🔖 button on /sor or atlas pages.'}
            </p>
          </div>
        )}

        {mounted && stats.total > 0 && (
          <>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 16,
              flexWrap: 'wrap',
              gap: 8,
            }}>
              <div style={{ fontSize: '0.85rem', color: COLORS.silver }}>
                <strong style={{ color: COLORS.gold }}>{stats.total}</strong> / {stats.max} {tr ? 'kayıt' : 'items'}
              </div>
            </div>

            {/* Type filter chips */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 6,
              marginBottom: 24,
            }}>
              <FilterChip active={filter === 'all'} onClick={() => setFilter('all')}>
                {tr ? 'Tümü' : 'All'} · {stats.total}
              </FilterChip>
              {types.map(t => (
                <FilterChip key={t} active={filter === t} onClick={() => setFilter(t)}>
                  {labels[t] || t} · {stats.byType[t]}
                </FilterChip>
              ))}
            </div>

            {/* Items list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filtered.map(item => (
                <BookmarkRow key={item.id} item={item} tr={tr} labels={labels} onRemove={() => remove(item.id)} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function FilterChip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '6px 12px',
        borderRadius: 999,
        border: `1px solid ${active ? `${COLORS.gold}88` : 'rgba(255,255,255,0.1)'}`,
        background: active ? `${COLORS.gold}22` : 'rgba(255,255,255,0.03)',
        color: active ? COLORS.gold : COLORS.silver,
        fontFamily: FONTS.body,
        fontSize: '0.78rem',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.15s',
      }}
    >
      {children}
    </button>
  );
}

function BookmarkRow({ item, tr, labels, onRemove }) {
  const label = labels[item.type] || item.type;
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12,
      padding: '14px 16px',
      background: 'rgba(255,255,255,0.03)',
      border: `1px solid ${COLORS.gold}22`,
      borderRadius: 10,
      transition: 'border-color 0.15s',
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{
            padding: '2px 8px',
            borderRadius: 4,
            background: `${COLORS.gold}18`,
            color: COLORS.gold,
            fontSize: '0.68rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}>
            {label}
          </span>
          {item.subtitle && (
            <span style={{ fontSize: '0.72rem', color: COLORS.silver }}>{item.subtitle}</span>
          )}
        </div>
        <Link href={item.url || '#'} style={{
          fontFamily: FONTS.body,
          fontSize: '0.95rem',
          color: COLORS.offWhite,
          textDecoration: 'none',
          fontWeight: 500,
          display: 'block',
          marginBottom: 4,
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = COLORS.gold; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = COLORS.offWhite; }}>
          {item.title}
        </Link>
        {item.description && (
          <div style={{
            fontSize: '0.82rem',
            color: COLORS.silver,
            lineHeight: 1.5,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}>
            {item.description}
          </div>
        )}
        {item.arabic && (
          <div dir="rtl" lang="ar" style={{
            fontFamily: FONTS.quran,
            fontSize: '1.05rem',
            color: `${COLORS.gold}dd`,
            lineHeight: 1.9,
            marginTop: 8,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {item.arabic}
          </div>
        )}
      </div>
      <button
        onClick={onRemove}
        aria-label={tr ? 'Kaldır' : 'Remove'}
        title={tr ? 'Kaldır' : 'Remove'}
        style={{
          width: 30,
          height: 30,
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(255,255,255,0.03)',
          color: COLORS.silver,
          cursor: 'pointer',
          flexShrink: 0,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1rem',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(231,76,60,0.15)';
          e.currentTarget.style.borderColor = 'rgba(231,76,60,0.6)';
          e.currentTarget.style.color = '#e74c3c';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
          e.currentTarget.style.color = COLORS.silver;
        }}
      >
        ×
      </button>
    </div>
  );
}
