'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '../../../i18n/LanguageContext';
import { COLORS, FONTS, RADIUS, TRANSITION } from '../../../tokens';
import ToolHeader from '../../../components/ToolHeader';

export default function TefekkurIndexRoute() {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const [data, setData] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    fetch('/tefekkur/_index.json')
      .then(r => r.json())
      .then(setData)
      .catch(err => console.error('[Tefekkür] index load failed:', err));
  }, []);

  if (!data) {
    return (
      <div style={{
        background: COLORS.cosmicBlack,
        minHeight: 'calc(100vh - 62px)',
        display: 'flex', flexDirection: 'column',
        paddingTop: '62px',
      }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: COLORS.silver, fontFamily: FONTS.body, fontSize: '0.9rem' }}>
            {tr ? 'Yükleniyor…' : 'Loading…'}
          </span>
        </div>
      </div>
    );
  }

  const filteredArticles = activeCategory === 'all'
    ? data.articles
    : data.articles.filter(a => a.category === activeCategory);

  return (
    <div style={{
      background: COLORS.cosmicBlack,
      minHeight: 'calc(100vh - 62px)',
      display: 'flex', flexDirection: 'column',
      paddingTop: '62px',
    }}>
      <ToolHeader
        icon={
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2 L14.4 8.4 L21 9.3 L16 14 L17.5 21 L12 17.5 L6.5 21 L8 14 L3 9.3 L9.6 8.4 Z" />
          </svg>
        }
        titleTr="Tefekkür"
        titleEn="Tefekkür"
        subtitleTr="Felsufi · semantik · terminoloji · idrak"
        subtitleEn="Felsufi · semantics · terminology · cognition"
        language={language}
      />

      <div style={{ flex: 1, maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '32px 24px 64px', boxSizing: 'border-box' }}>

        {/* Hero callout */}
        <div style={{
          background: `linear-gradient(180deg, rgba(212,165,116,0.06) 0%, rgba(255,255,255,0.022) 100%)`,
          border: `1px solid ${COLORS.glassBorder || 'rgba(255,255,255,0.08)'}`,
          borderRadius: RADIUS.lg,
          padding: '28px 30px',
          marginBottom: '36px',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
            background: `linear-gradient(90deg, transparent, ${COLORS.gold}, transparent)`,
            opacity: 0.65, pointerEvents: 'none',
          }} />
          <div style={{
            fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.22em',
            color: COLORS.gold, textTransform: 'uppercase', fontFamily: FONTS.body,
            marginBottom: '12px',
          }}>
            {tr ? 'Tefekkür — Yazılar' : 'Tefekkür — Essays'}
          </div>
          <h1 style={{
            margin: '0 0 14px',
            fontFamily: FONTS.display,
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            color: COLORS.offWhite,
            fontWeight: 700,
            lineHeight: 1.3,
          }}>
            {tr
              ? 'Kur\'an Semantiği, Tefekkür ve Tasavvufî Düşünce'
              : 'Quranic Semantics, Reflection, and Sufi Thought'}
          </h1>
          <p style={{
            margin: 0,
            fontSize: '0.95rem',
            color: COLORS.silver,
            fontFamily: FONTS.body,
            lineHeight: 1.75,
          }}>
            {tr
              ? <>Felsufi'nin seçilmiş yazıları — Kur'an kavramlarının kök etimolojisinden modern epistemolojiye, sûre tahlillerinden tasavvufî psikolojiye uzanan derinlikli denemeler. Her makale ConceptGraph, VerseGraph ve Reading Mode ile çift yönlü bağlıdır.</>
              : <>Curated essays by Felsufi — from the root etymology of Quranic concepts to modern epistemology, from surah analyses to Sufi psychology. Each essay is bidirectionally linked to ConceptGraph, VerseGraph, and Reading Mode.</>}
          </p>
        </div>

        {/* Category filter pills */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: '8px',
          marginBottom: '28px',
        }}>
          <FilterPill
            label={tr ? 'Tümü' : 'All'}
            isActive={activeCategory === 'all'}
            onClick={() => setActiveCategory('all')}
            accent={COLORS.gold}
          />
          {data.categories.map(cat => (
            <FilterPill
              key={cat.id}
              label={tr ? cat.labelTr : cat.labelEn}
              isActive={activeCategory === cat.id}
              onClick={() => setActiveCategory(cat.id)}
              accent={cat.accent}
            />
          ))}
        </div>

        {/* Article grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 360px), 1fr))',
          gap: '18px',
        }}>
          {filteredArticles.map(article => {
            const category = data.categories.find(c => c.id === article.category);
            return (
              <ArticleCard
                key={article.slug}
                article={article}
                category={category}
                language={language}
              />
            );
          })}
          {filteredArticles.length === 0 && (
            <div style={{
              gridColumn: '1 / -1',
              padding: '40px 20px',
              textAlign: 'center',
              color: COLORS.silver,
              fontFamily: FONTS.body,
              fontSize: '0.9rem',
            }}>
              {tr ? 'Bu kategoride henüz yazı yok.' : 'No articles in this category yet.'}
            </div>
          )}
        </div>

        {/* Author footer */}
        <div style={{
          marginTop: '48px',
          padding: '20px 24px',
          background: 'rgba(255,255,255,0.022)',
          border: `1px solid ${COLORS.glassBorder || 'rgba(255,255,255,0.08)'}`,
          borderRadius: RADIUS.md,
          fontSize: '0.85rem',
          color: COLORS.silver,
          fontFamily: FONTS.body,
          lineHeight: 1.7,
        }}>
          {tr
            ? <>Yazılar <a href="https://sufist.medium.com" target="_blank" rel="noopener noreferrer" style={{ color: COLORS.gold, textDecoration: 'none', borderBottom: `1px solid ${COLORS.goldAlpha45 || 'rgba(212,165,116,0.45)'}` }}>Felsufi</a> tarafından kaleme alınmıştır; Medium'da ilk olarak yayımlanmıştır. QuranCodex'te yeniden düzenlenmiş ve site araçlarıyla çapraz bağlanmıştır.</>
            : <>Essays are authored by <a href="https://sufist.medium.com" target="_blank" rel="noopener noreferrer" style={{ color: COLORS.gold, textDecoration: 'none', borderBottom: `1px solid ${COLORS.goldAlpha45 || 'rgba(212,165,116,0.45)'}` }}>Felsufi</a>; originally published on Medium. Re-edited on QuranCodex and cross-linked with site tools.</>}
        </div>
      </div>
    </div>
  );
}

function FilterPill({ label, isActive, onClick, accent }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '6px 14px',
        borderRadius: RADIUS.pillSm,
        border: `1px solid ${isActive ? `${accent}66` : 'rgba(255,255,255,0.07)'}`,
        background: isActive ? `${accent}15` : 'transparent',
        color: isActive ? accent : (COLORS.silverAlpha70 || COLORS.silver),
        fontSize: '0.78rem',
        fontFamily: FONTS.body,
        fontWeight: isActive ? 600 : 500,
        cursor: 'pointer',
        transition: `all ${TRANSITION.fast}`,
      }}
      onMouseEnter={e => {
        if (!isActive) {
          e.currentTarget.style.background = 'rgba(255,255,255,0.035)';
          e.currentTarget.style.color = COLORS.offWhite;
        }
      }}
      onMouseLeave={e => {
        if (!isActive) {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = COLORS.silverAlpha70 || COLORS.silver;
        }
      }}
    >
      {label}
    </button>
  );
}

function ArticleCard({ article, category, language }) {
  const tr = language === 'tr';
  const accent = category?.accent || COLORS.gold;
  return (
    <Link
      href={`/${language}/tefekkur/${article.slug}`}
      style={{
        display: 'block',
        textDecoration: 'none',
        background: `linear-gradient(180deg, ${accent}10 0%, rgba(255,255,255,0.022) 60%)`,
        border: `1px solid ${accent}33`,
        borderRadius: RADIUS.lg,
        padding: '22px 24px',
        transition: 'all 0.2s',
        position: 'relative',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.borderColor = `${accent}66`;
        e.currentTarget.style.boxShadow = `0 8px 28px rgba(0,0,0,0.25), 0 0 24px ${accent}22`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = `${accent}33`;
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Category eyebrow + series */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        marginBottom: '12px', flexWrap: 'wrap',
      }}>
        <span style={{
          fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.18em',
          color: accent, textTransform: 'uppercase', fontFamily: FONTS.body,
        }}>
          {tr ? category?.labelTr : category?.labelEn}
        </span>
        {article.seriesNumber != null && (
          <span style={{
            fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.08em',
            color: COLORS.silver, fontFamily: FONTS.body,
            padding: '2px 7px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: RADIUS.pillSm,
          }}>
            #{article.seriesNumber}
          </span>
        )}
      </div>

      {/* Title */}
      <h3 style={{
        margin: '0 0 12px',
        fontFamily: FONTS.display,
        fontSize: '1.18rem',
        color: COLORS.offWhite,
        fontWeight: 700,
        lineHeight: 1.4,
      }}>
        {tr ? article.titleTr : article.titleEn}
      </h3>

      {/* tldr */}
      <p style={{
        margin: '0 0 16px',
        fontSize: '0.88rem',
        color: COLORS.silver,
        fontFamily: FONTS.body,
        lineHeight: 1.65,
      }}>
        {tr ? article.tldrTr : article.tldrEn}
      </p>

      {/* Meta footer */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '14px',
        fontSize: '0.72rem', color: COLORS.silver, fontFamily: FONTS.body,
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <svg aria-hidden="true" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          {article.readingMinutes} {tr ? 'dk' : 'min'}
        </span>
        <span>{article.publishedDate}</span>
      </div>
    </Link>
  );
}
