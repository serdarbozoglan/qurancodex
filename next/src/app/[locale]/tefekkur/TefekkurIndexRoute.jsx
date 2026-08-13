'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '../../../i18n/LanguageContext';
import { COLORS, FONTS, RADIUS, TRANSITION } from '../../../tokens';
import ToolHeader from '../../../components/ToolHeader';

export default function TefekkurIndexRoute() {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const searchParams = useSearchParams();
  const [data, setData] = useState(null);
  // Initial category from ?cat=<id> query (homepage TefekkurHighlight deep-link),
  // fallback 'all'. Re-syncs whenever the query changes.
  const initialCat = searchParams.get('cat') || 'all';
  const [activeCategory, setActiveCategory] = useState(initialCat);

  useEffect(() => {
    const q = searchParams.get('cat');
    if (q) setActiveCategory(q);
  }, [searchParams]);

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
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            {/* Açık kitap — okuma + tefekkür */}
            <path d="M12 6 L4 5 L4 18 L12 19" />
            <path d="M12 6 L20 5 L20 18 L12 19" />
            <line x1="12" y1="6" x2="12" y2="19" />
          </svg>
        }
        titleTr="Tefekkür"
        titleEn="Tefekkür"
        subtitleTr="anlam · derinlik · hikmet"
        subtitleEn="meaning · depth · wisdom"
        language={language}
      />

      <div style={{ flex: 1, maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '32px 24px 64px', boxSizing: 'border-box' }}>

        {/* Hero callout — premium with decorative star + stat row */}
        <div style={{
          background: `linear-gradient(135deg, rgba(212,165,116,0.08) 0%, rgba(139,92,246,0.04) 50%, rgba(255,255,255,0.022) 100%)`,
          border: `1px solid ${COLORS.glassBorder || 'rgba(255,255,255,0.08)'}`,
          borderRadius: RADIUS.lg,
          padding: '32px 30px 26px',
          marginBottom: '36px',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Top accent stripe */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
            background: `linear-gradient(90deg, transparent, ${COLORS.gold}, transparent)`,
            opacity: 0.7, pointerEvents: 'none',
          }} />
          {/* Decorative açık kitap — right side */}
          <svg
            aria-hidden="true"
            width="200" height="200" viewBox="0 0 24 24"
            style={{
              position: 'absolute', top: '-20px', right: '-30px',
              opacity: 0.07, color: COLORS.gold, pointerEvents: 'none',
            }}
            fill="currentColor"
          >
            <path d="M11.5 5 L3 4 L3 18 L11.5 19 Z" />
            <path d="M12.5 5 L21 4 L21 18 L12.5 19 Z" />
          </svg>

          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            marginBottom: '14px',
          }}>
            <span aria-hidden="true" style={{
              width: '5px', height: '5px', borderRadius: '50%',
              background: COLORS.gold, boxShadow: `0 0 10px ${COLORS.gold}99`,
            }} />
            <span style={{
              fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.22em',
              color: COLORS.gold, textTransform: 'uppercase', fontFamily: FONTS.body,
            }}>
              {tr ? 'Tefekkür · Felsufi Seçkisi' : 'Tefekkür · Felsufi Selections'}
            </span>
          </div>

          <h1 style={{
            margin: '0 0 14px',
            fontFamily: FONTS.display,
            fontSize: 'clamp(1.6rem, 3.2vw, 2.15rem)',
            color: COLORS.offWhite,
            fontWeight: 700,
            lineHeight: 1.25,
            letterSpacing: '-0.01em',
            maxWidth: '60ch',
          }}>
            {tr
              ? "Kur'an Semantiği, Tefekkür ve Tasavvufî Düşünce"
              : 'Quranic Semantics, Reflection, and Sufi Thought'}
          </h1>
          <p style={{
            margin: 0,
            fontSize: '0.95rem',
            color: COLORS.silver,
            fontFamily: FONTS.body,
            lineHeight: 1.75,
            maxWidth: '70ch',
          }}>
            {tr
              ? <>Felsufi'nin seçilmiş yazıları — Kur'an kavramlarının kök etimolojisinden modern epistemolojiye, sûre tahlillerinden tasavvufî psikolojiye uzanan derinlikli denemeler. Her makale <strong style={{ color: COLORS.gold, fontWeight: 600 }}>Kavram Ağı</strong>, <strong style={{ color: COLORS.gold, fontWeight: 600 }}>Ayet Haritası</strong> ve <strong style={{ color: COLORS.gold, fontWeight: 600 }}>Okuma Modu</strong> ile çift yönlü bağlıdır.</>
              : <>Curated essays by Felsufi — from the root etymology of Quranic concepts to modern epistemology, from surah analyses to Sufi psychology. Each essay is bidirectionally linked to <strong style={{ color: COLORS.gold, fontWeight: 600 }}>Concept Graph</strong>, <strong style={{ color: COLORS.gold, fontWeight: 600 }}>Verse Map</strong>, and <strong style={{ color: COLORS.gold, fontWeight: 600 }}>Reading Mode</strong>.</>}
          </p>

          {/* Epistemic transparency callout — standalone, more prominent.
              3 etiket-chip + açıklama satırı; subtitle'a gömülü değil. */}
          <div style={{
            marginTop: '18px',
            padding: '14px 18px 16px',
            background: 'rgba(212,165,116,0.06)',
            border: '1px solid rgba(212,165,116,0.28)',
            borderLeft: `3px solid ${COLORS.gold}`,
            borderRadius: RADIUS.sm,
          }}>
            {/* Header line — author attribution */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              marginBottom: '10px',
              fontSize: '0.78rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              color: COLORS.gold,
              fontFamily: FONTS.body,
            }}>
              <span aria-hidden="true" style={{ opacity: 0.85, fontSize: '0.95rem' }}>✍︎</span>
              {tr
                ? 'Felsufi’nin kendi tefekkür denemelerinden seçmeler'
                : 'A curated selection of Felsufi’s own essays in reflection'}
            </div>
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: '8px',
              marginBottom: '10px',
            }}>
              {(tr
                ? ['Kişisel sentezler', 'Alternatif okumalar', 'Tasavvufî perspektif']
                : ['Personal syntheses', 'Alternative readings', 'Sufi perspective']
              ).map((label, i) => (
                <span key={i} style={{
                  display: 'inline-flex', alignItems: 'center', gap: '5px',
                  padding: '3px 10px',
                  background: 'rgba(212,165,116,0.12)',
                  border: '1px solid rgba(212,165,116,0.35)',
                  borderRadius: RADIUS.pillSm,
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  color: COLORS.gold,
                  fontFamily: FONTS.body,
                  textTransform: 'uppercase',
                }}>
                  <span aria-hidden="true" style={{ opacity: 0.85 }}>✱</span>
                  {label}
                </span>
              ))}
            </div>
            <p style={{
              margin: 0,
              fontSize: '0.82rem',
              color: COLORS.offWhite,
              fontFamily: FONTS.body,
              lineHeight: 1.6,
              fontStyle: 'italic',
            }}>
              {tr
                ? <>Bu metinler klasik tefsir konsensüsü değil, <strong style={{ color: COLORS.gold, fontStyle: 'normal' }}>yazarın şahsi içtihad ve okuma denemeleri</strong>dir. Alternatif klasik yorumlar mevcuttur; tartışmalı ayet grupları makale içinde <strong style={{ color: COLORS.gold, fontStyle: 'normal' }}>&quot;alternatif okuma&quot;</strong> kutularıyla nazikçe işaret edilmiştir.</>
                : <>These are not the consensus of classical tafsīr but the <strong style={{ color: COLORS.gold, fontStyle: 'normal' }}>author&apos;s personal ijtihād and reading-attempts</strong>. Alternative classical readings exist; contested passages are gently flagged within the essays with <strong style={{ color: COLORS.gold, fontStyle: 'normal' }}>&quot;alternative reading&quot;</strong> callouts.</>}
            </p>
          </div>

          {/* Stat chip row */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: '10px',
            marginTop: '20px',
          }}>
            {(() => {
              // Dinamik hesaplama — JSON'daki articles + categories ile sync.
              // Önceki sürümde 'yayında' / 'planlanan' / 'kategori' sayıları
              // hardcoded'di ve gerçek veriyle uyuşmuyordu (kullanıcı raporu).
              const published = data.articles.filter(a => a.status === 'published' || a.status === 'live').length;
              const drafts = data.articles.length - published;
              const totalCats = data.categories.length;
              return [
                { num: published || data.articles.length, label: tr ? 'yayında' : 'live', accent: COLORS.gold },
                ...(drafts > 0 ? [{ num: drafts, label: tr ? 'taslak' : 'draft' }] : []),
                { num: totalCats, label: tr ? 'kategori' : 'categories' },
                { num: '1',       label: tr ? 'yazar' : 'author' },
              ];
            })().map((s, i) => (
              <span key={i} style={{
                display: 'inline-flex', alignItems: 'baseline', gap: '5px',
                padding: '5px 12px',
                background: s.accent ? 'rgba(212,165,116,0.08)' : 'rgba(212,165,116,0.04)',
                border: `1px solid ${s.accent ? 'rgba(212,165,116,0.28)' : 'rgba(212,165,116,0.14)'}`,
                borderRadius: RADIUS.pillSm,
                fontFamily: FONTS.body,
              }}>
                <span style={{ color: s.accent || COLORS.softGold, fontWeight: 700, fontSize: '0.86rem' }}>{s.num}</span>
                <span style={{ color: COLORS.offWhiteAlpha78 || COLORS.silver, fontSize: '0.72rem' }}>{s.label}</span>
              </span>
            ))}
          </div>
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

        {/* Attribution footer — Felsufi'nin izniyle */}
        <div style={{
          marginTop: '48px',
          padding: '22px 26px',
          background: `linear-gradient(135deg, ${COLORS.goldAlpha15 || 'rgba(212,165,116,0.15)'} 0%, rgba(212,165,116,0.04) 50%, rgba(255,255,255,0.022) 100%)`,
          border: `1px solid ${COLORS.goldAlpha20 || 'rgba(212,165,116,0.20)'}`,
          borderRadius: RADIUS.md,
          fontSize: '0.92rem',
          color: COLORS.offWhite,
          fontFamily: FONTS.body,
          lineHeight: 1.75,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
            background: `linear-gradient(90deg, transparent, ${COLORS.gold}, transparent)`,
            opacity: 0.55,
          }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <span style={{ color: COLORS.gold, fontSize: '1.05rem' }}>✦</span>
            <span style={{
              fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.18em',
              color: COLORS.gold, textTransform: 'uppercase',
            }}>
              {tr ? 'Yazara Teşekkürlerimizle' : 'With Gratitude to the Author'}
            </span>
          </div>
          <p style={{ margin: 0 }}>
            {tr
              ? <>Bu seçilmiş yazıları paylaşmamıza <strong style={{ color: COLORS.gold, fontWeight: 600 }}>sıfahi izin</strong> verdiği için <a href="https://sufist.medium.com" target="_blank" rel="noopener noreferrer" style={{ color: COLORS.gold, fontWeight: 600 }}>Felsufi</a>&apos;ye minnetle teşekkür ederiz. Yazılardaki yorum ve sentezler tamamen <strong style={{ color: COLORS.gold, fontWeight: 600 }}>yazarın şahsi tefekkürünü</strong> yansıtır; QuranCodex bu metinleri bir <em style={{ color: COLORS.offWhite, fontStyle: 'italic' }}>düşünce daveti</em> olarak saygıyla aktarır. Kanonik kaynak Medium&apos;da korunmakta ve site araçlarıyla çift yönlü bağlıdır.</>
              : <>We extend our heartfelt gratitude to <a href="https://sufist.medium.com" target="_blank" rel="noopener noreferrer" style={{ color: COLORS.gold, fontWeight: 600 }}>Felsufi</a> for the <strong style={{ color: COLORS.gold, fontWeight: 600 }}>verbal permission</strong> to share these selected essays. All interpretations and syntheses reflect the <strong style={{ color: COLORS.gold, fontWeight: 600 }}>author&apos;s personal reflection</strong>; QuranCodex carries these texts respectfully as an <em style={{ color: COLORS.offWhite, fontStyle: 'italic' }}>invitation to think</em>. The canonical source remains on Medium or Substack and is bidirectionally linked with site tools.</>}
          </p>
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
