'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '../../../../i18n/LanguageContext';
import { COLORS, FONTS, RADIUS, TRANSITION } from '../../../../tokens';
import ToolHeader from '../../../../components/ToolHeader';
import RootHero from '../../../../components/tefekkur/RootHero';
import ArticleRenderer, { extractToc } from '../../../../components/tefekkur/ArticleRenderer';
import RelatedToolCard from '../../../../components/tefekkur/RelatedToolCard';
import SeriesTimeline from '../../../../components/tefekkur/SeriesTimeline';
import { renderInlineMarkdown } from '../../../../components/tefekkur/inlineMarkdown';

const CATEGORY_LABELS = {
  kavramsal:        { tr: 'Kavramsal Tahlil',         en: 'Conceptual Analysis',  accent: '#3498db' },
  terminoloji:      { tr: 'Terminoloji Serisi',       en: 'Terminology Series',   accent: '#d4a574' },
  'sure-hermenotik':{ tr: 'Sûre & Hermenötik',        en: 'Surah & Hermeneutics', accent: '#c9a227' },
  semantik:         { tr: 'Semantik Seri',            en: 'Semantic Series',      accent: '#8b5cf6' },
  'idrak-suur':     { tr: 'İdrak & Şuur',             en: 'Cognition & Consciousness', accent: '#1D9E75' },
  kozmoloji:        { tr: 'Kozmoloji & Yaratılış',    en: 'Cosmology & Creation', accent: '#9b59b6' },
};

// Yayın platformunun adını canonicalUrl'den türetir (2026-08-13).
// Önceden metinde sabit "Medium" yazıyordu; sitedeki 51 yazının 49'u Medium
// ama `iki-nedensellik` Substack'te — o yazının altında yanlış platform
// gösteriliyordu. Yeni platform eklenirse buraya bir satır yeter.
function platformName(url) {
  try {
    const h = new URL(url).hostname;
    if (h.includes('substack.com')) return 'Substack';
    if (h.includes('medium.com')) return 'Medium';
    return h.replace(/^www\./, '');
  } catch {
    return null;
  }
}

export default function TefekkurArticleRoute({ article }) {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const title = tr ? article.titleTr : article.titleEn;
  const tldr = tr ? article.tldrTr : article.tldrEn;
  const categoryMeta = CATEGORY_LABELS[article.category] || CATEGORY_LABELS.semantik;
  const accent = categoryMeta.accent;
  const toc = extractToc(article.blocks, language);

  // Reading progress bar — local, scoped to article
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    let raf = null;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const doc = document.documentElement;
        const total = doc.scrollHeight - doc.clientHeight;
        const pct = total > 0 ? (window.scrollY / total) * 100 : 0;
        setProgress(Math.min(100, Math.max(0, pct)));

        // Track active section for TOC highlight
        const sections = toc.map(t => document.getElementById(t.id)).filter(Boolean);
        let current = null;
        for (const s of sections) {
          const rect = s.getBoundingClientRect();
          if (rect.top <= 140) current = s.id;
        }
        setActiveSection(current);

        raf = null;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => { window.removeEventListener('scroll', onScroll); if (raf) cancelAnimationFrame(raf); };
  }, [toc]);

  return (
    <div style={{
      background: COLORS.cosmicBlack,
      minHeight: 'calc(100vh - 62px)',
      display: 'flex', flexDirection: 'column',
      paddingTop: '62px',
      position: 'relative',
    }}>
      {/* Reading progress bar — fixed at top of viewport below navbar */}
      <div style={{
        position: 'fixed', top: '62px', left: 0, right: 0, height: '2px',
        background: 'rgba(255,255,255,0.04)', zIndex: 49,
        pointerEvents: 'none',
      }}>
        <div style={{
          height: '100%',
          width: `${progress}%`,
          background: `linear-gradient(90deg, ${accent}, ${COLORS.gold})`,
          boxShadow: `0 0 12px ${accent}88, 0 0 24px ${COLORS.gold}55`,
          transition: 'width 0.1s linear',
        }} />
      </div>

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
        subtitleTr={article.titleTr}
        subtitleEn={article.titleEn}
        language={language}
      />

      <div style={{
        flex: 1,
        padding: '28px 24px 80px',
        maxWidth: '1280px',
        width: '100%',
        margin: '0 auto',
        boxSizing: 'border-box',
        position: 'relative',
      }}>
        {/* Decorative Islamic geometric background pattern */}
        <svg
          aria-hidden="true"
          style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '380px',
            opacity: 0.025, pointerEvents: 'none',
          }}
          viewBox="0 0 200 200" preserveAspectRatio="xMidYMin slice"
        >
          <defs>
            <pattern id="tefekkurBgPattern" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M24 0 L29 19 L48 24 L29 29 L24 48 L19 29 L0 24 L19 19 Z" fill={COLORS.gold} />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#tefekkurBgPattern)" />
        </svg>

        {/* Layout: TOC sidebar | article body */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr)',
          gap: '40px',
          position: 'relative', zIndex: 1,
        }}
        className="tefekkur-layout">

          {/* Back link */}
          <Link
            href={`/${language}/tefekkur`}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              fontSize: '0.78rem', color: COLORS.silver,
              fontFamily: FONTS.body, textDecoration: 'none',
              marginBottom: '12px',
              opacity: 0.78, transition: 'opacity 0.15s, color 0.15s',
              justifySelf: 'start',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = COLORS.gold; e.currentTarget.style.opacity = '1'; }}
            onMouseLeave={e => { e.currentTarget.style.color = COLORS.silver; e.currentTarget.style.opacity = '0.75'; }}
          >
            <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            {tr ? 'Tüm Yazılar' : 'All Essays'}
          </Link>

          {/* Body region with optional sidebar */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: toc.length > 0 ? 'minmax(0, 1fr) 240px' : '1fr',
            gap: '40px',
            alignItems: 'start',
          }}
          className="tefekkur-body-grid">

            <main style={{ minWidth: 0, maxWidth: '760px' }}>

              {/* Series timeline (varsa) */}
              {article.seriesNumber && article.seriesTotal && (
                <SeriesTimeline
                  seriesLabel={article.seriesId === 'semantik-analizi' ? (tr ? 'Semantik Serisi' : 'Semantic Series') : (tr ? 'Seri' : 'Series')}
                  currentNumber={article.seriesNumber}
                  total={article.seriesTotal}
                  language={language}
                />
              )}

              {/* Hero — title block */}
              <motion.header
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
                style={{ marginBottom: '24px' }}
              >
                {/* Category eyebrow */}
                <div style={{
                  fontSize: '0.66rem', fontWeight: 700, letterSpacing: '0.22em',
                  color: accent, textTransform: 'uppercase', fontFamily: FONTS.body,
                  marginBottom: '14px',
                }}>
                  {tr ? categoryMeta.tr : categoryMeta.en}
                </div>

                {/* Title */}
                <h1 style={{
                  margin: '0 0 18px',
                  fontFamily: FONTS.display,
                  fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
                  color: COLORS.offWhite,
                  fontWeight: 700,
                  lineHeight: 1.22,
                }}>
                  {title}
                </h1>

                {/* tldr */}
                <p style={{
                  margin: '0 0 18px',
                  fontSize: '1.05rem',
                  fontStyle: 'italic',
                  color: COLORS.silver,
                  fontFamily: FONTS.body,
                  lineHeight: 1.7,
                }}>
                  {renderInlineMarkdown(tldr)}
                </p>

                {/* Meta row */}
                <div style={{
                  display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '14px',
                  fontSize: '0.78rem', color: COLORS.silver,
                  fontFamily: FONTS.body,
                  paddingTop: '14px',
                  borderTop: `1px solid ${COLORS.glassBorder || 'rgba(255,255,255,0.08)'}`,
                }}>
                  <span style={{ color: COLORS.gold, fontWeight: 600 }}>
                    {article.author?.name}
                  </span>
                  <span>·</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <svg aria-hidden="true" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                    </svg>
                    {article.readingMinutes} {tr ? 'dk okuma' : 'min read'}
                  </span>
                  <span>·</span>
                  <span>{article.publishedDate}</span>
                  {article.canonicalUrl && (
                    <>
                      <span>·</span>
                      <a
                        href={article.canonicalUrl}
                        target="_blank"
                        rel="noopener noreferrer canonical"
                        style={{
                          color: COLORS.silver, opacity: 0.85,
                          textDecoration: 'none',
                          borderBottom: '1px dashed rgba(148,163,184,0.3)',
                        }}
                      >
                        {tr
                          ? `${platformName(article.canonicalUrl) || 'Kaynağında'}'da görüntüle ↗`
                          : `View on ${platformName(article.canonicalUrl) || 'source'} ↗`}
                      </a>
                    </>
                  )}
                </div>
              </motion.header>

              {/* Template-specific hero — root tree for semantic articles */}
              {article.template === 'root-tree' && article.root && (
                <RootHero
                  root={article.root.letters}
                  transliteration={article.root.transliteration}
                  coreMeaning={tr ? article.root.coreMeaningTr : article.root.coreMeaningEn}
                  derivatives={article.root.derivatives}
                  language={language}
                />
              )}

              {/* Epistemic disclaimer — every Tefekkür article shows this.
                  Felsufi'nin özgün okumalarını klasik tefsir konsensüsü ile
                  karıştırmayalım diye site-genelinde uniform şeffaflık notu. */}
              <div style={{
                margin: '20px 0 28px',
                padding: '12px 16px 12px 18px',
                background: 'rgba(148,163,184,0.04)',
                border: '1px solid rgba(148,163,184,0.14)',
                borderLeft: `2px solid ${COLORS.silverAlpha70 || COLORS.silver}`,
                borderRadius: RADIUS.sm,
                display: 'flex', gap: '11px', alignItems: 'flex-start',
              }}>
                <span aria-hidden="true" style={{
                  color: COLORS.gold, fontSize: '0.95rem',
                  lineHeight: 1.5, flexShrink: 0, marginTop: '1px', opacity: 0.75,
                }}>✍︎</span>
                <p style={{
                  margin: 0,
                  fontSize: '0.78rem', color: COLORS.silver,
                  fontFamily: FONTS.body, lineHeight: 1.65,
                  fontStyle: 'italic',
                }}>
                  {tr
                    ? <>Aşağıdaki metin, <strong style={{ color: COLORS.offWhite, fontStyle: 'normal', fontWeight: 600 }}>Felsufi&apos;nin kendi okuma ve tefekkür denemesi</strong>dir. Klasik tefsir geleneğinden farklı yaklaşımlar — tasavvuf, modern bilimle sentez, Risale-i Nur perspektifi — içerebilir. Yazarın <strong style={{ color: COLORS.offWhite, fontStyle: 'normal', fontWeight: 600 }}>şahsi içtihadı</strong> olduğu için alternatif klasik yorumlar mevcuttur; bu metin tek doğru okuma iddiası taşımaz, bir <em style={{ color: COLORS.offWhite, fontStyle: 'italic' }}>bakış açısı</em> sunar.</>
                    : <>The text below is <strong style={{ color: COLORS.offWhite, fontStyle: 'normal', fontWeight: 600 }}>Felsufi&apos;s own essay in reading and reflection</strong>. It may carry approaches that differ from classical tafsīr — Sufi interpretation, synthesis with modern science, the Risale-i Nur perspective. Because it is the author&apos;s <strong style={{ color: COLORS.offWhite, fontStyle: 'normal', fontWeight: 600 }}>personal ijtihād</strong>, alternative classical readings exist; this text makes no claim to a single correct reading — it offers a <em style={{ color: COLORS.offWhite, fontStyle: 'italic' }}>perspective</em>.</>}
                </p>
              </div>

              {/* Block-based article body */}
              <ArticleRenderer blocks={article.blocks} language={language} />

              {/* Related tools — site içi çapraz bağlantılar */}
              {article.relatedTools?.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.5 }}
                  style={{ marginTop: '48px' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
                    <div style={{ flex: 1, height: '1px', background: `linear-gradient(90deg, transparent, ${accent}55, transparent)` }} />
                    <span style={{
                      fontSize: '0.66rem', fontWeight: 700, letterSpacing: '0.22em',
                      color: accent, textTransform: 'uppercase', fontFamily: FONTS.body,
                    }}>
                      {tr ? 'Bu Yazıyla İlgili Araçlar' : 'Related Tools'}
                    </span>
                    <div style={{ flex: 1, height: '1px', background: `linear-gradient(90deg, transparent, ${accent}55, transparent)` }} />
                  </div>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
                    gap: '14px',
                  }}>
                    {article.relatedTools.map(tool => (
                      <RelatedToolCard key={tool} tool={tool} language={language} />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Series navigation */}
              {(article.previousArticle || article.nextArticle) && (
                <div style={{
                  marginTop: '48px',
                  paddingTop: '32px',
                  borderTop: `1px solid ${COLORS.glassBorder || 'rgba(255,255,255,0.08)'}`,
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px, 100%), 1fr))',
                  gap: '14px',
                }}>
                  {article.previousArticle && (
                    <Link href={`/${language}/tefekkur/${article.previousArticle.slug}`} style={{
                      display: 'block',
                      padding: '14px 18px',
                      background: 'rgba(255,255,255,0.025)',
                      border: `1px solid ${COLORS.glassBorder || 'rgba(255,255,255,0.08)'}`,
                      borderRadius: RADIUS.md,
                      textDecoration: 'none',
                      transition: 'all 0.15s',
                    }}>
                      <div style={{
                        fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.16em',
                        color: COLORS.silver, textTransform: 'uppercase', fontFamily: FONTS.body,
                        marginBottom: '6px', opacity: 0.78,
                      }}>
                        ← {tr ? 'Önceki' : 'Previous'}
                      </div>
                      <div style={{
                        fontSize: '0.88rem', color: COLORS.offWhite,
                        fontFamily: FONTS.body, fontWeight: 600, lineHeight: 1.45,
                      }}>
                        {article.previousArticle.titleTr}
                      </div>
                    </Link>
                  )}
                  {article.nextArticle && (
                    <Link href={`/${language}/tefekkur/${article.nextArticle.slug}`} style={{
                      display: 'block',
                      padding: '14px 18px',
                      background: 'rgba(255,255,255,0.025)',
                      border: `1px solid ${COLORS.glassBorder || 'rgba(255,255,255,0.08)'}`,
                      borderRadius: RADIUS.md,
                      textDecoration: 'none',
                      textAlign: 'right',
                    }}>
                      <div style={{
                        fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.16em',
                        color: COLORS.silver, textTransform: 'uppercase', fontFamily: FONTS.body,
                        marginBottom: '6px', opacity: 0.78,
                      }}>
                        {tr ? 'Sonraki' : 'Next'} →
                      </div>
                      <div style={{
                        fontSize: '0.88rem', color: COLORS.offWhite,
                        fontFamily: FONTS.body, fontWeight: 600, lineHeight: 1.45,
                      }}>
                        {article.nextArticle.titleTr}
                      </div>
                    </Link>
                  )}
                </div>
              )}

              {/* Attribution footer — Felsufi'nin izniyle + teşekkür */}
              {article.canonicalUrl && (
                <div style={{
                  marginTop: '40px',
                  padding: '20px 24px',
                  background: `linear-gradient(135deg, ${COLORS.goldAlpha15 || 'rgba(212,165,116,0.15)'} 0%, rgba(212,165,116,0.04) 50%, rgba(255,255,255,0.022) 100%)`,
                  border: `1px solid ${COLORS.goldAlpha20 || 'rgba(212,165,116,0.20)'}`,
                  borderRadius: RADIUS.md,
                  fontSize: '0.86rem',
                  color: COLORS.offWhite,
                  fontFamily: FONTS.body,
                  lineHeight: 1.75,
                  position: 'relative', overflow: 'hidden',
                }}>
                  <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                    background: `linear-gradient(90deg, transparent, ${COLORS.gold}, transparent)`,
                    opacity: 0.5,
                  }} />
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px',
                  }}>
                    <span style={{ color: COLORS.gold, fontSize: '1rem' }}>✦</span>
                    <span style={{
                      fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.18em',
                      color: COLORS.gold, textTransform: 'uppercase',
                    }}>
                      {tr ? 'Yazara Teşekkürlerimizle' : 'With Gratitude to the Author'}
                    </span>
                  </div>
                  <p style={{ margin: 0 }}>
                    {tr
                      ? <>Bu yazı, <a href={article.author?.url} target="_blank" rel="noopener noreferrer" style={{ color: COLORS.gold, fontWeight: 600 }}>{article.author?.name}</a>&apos;nin <strong style={{ color: COLORS.gold, fontWeight: 600 }}>sıfahi izni</strong> ve cömertliğiyle QuranCodex&apos;te yer alıyor. Yazıdaki yorum ve sentezler tamamen <strong style={{ color: COLORS.gold, fontWeight: 600 }}>yazarın şahsi tefekkürünü</strong> yansıtır; QuranCodex bu metinleri bir <em style={{ color: COLORS.offWhite, fontStyle: 'italic' }}>düşünce daveti</em> olarak saygıyla aktarır. Orijinal metin <a href={article.canonicalUrl} target="_blank" rel="noopener noreferrer canonical" style={{ color: COLORS.gold }}>{platformName(article.canonicalUrl) || 'kaynağında'}</a>&apos;da yayımlanmıştır.</>
                      : <>This essay appears on QuranCodex with the <strong style={{ color: COLORS.gold, fontWeight: 600 }}>verbal permission</strong> and generosity of <a href={article.author?.url} target="_blank" rel="noopener noreferrer" style={{ color: COLORS.gold, fontWeight: 600 }}>{article.author?.name}</a>. All interpretations and syntheses reflect the <strong style={{ color: COLORS.gold, fontWeight: 600 }}>author&apos;s personal reflection</strong>; QuranCodex carries these texts respectfully as an <em style={{ color: COLORS.offWhite, fontStyle: 'italic' }}>invitation to think</em>. The original text is published on <a href={article.canonicalUrl} target="_blank" rel="noopener noreferrer canonical" style={{ color: COLORS.gold }}>{platformName(article.canonicalUrl) || 'the original source'}</a>.</>}
                  </p>
                </div>
              )}
            </main>

            {/* Sticky TOC sidebar — desktop only */}
            {toc.length > 0 && (
              <aside
                className="tefekkur-toc"
                style={{
                  position: 'sticky',
                  top: '128px',
                  alignSelf: 'start',
                  maxHeight: 'calc(100vh - 160px)',
                  overflowY: 'auto',
                  padding: '16px 18px',
                  background: 'rgba(255,255,255,0.022)',
                  border: `1px solid ${COLORS.glassBorder || 'rgba(255,255,255,0.08)'}`,
                  borderRadius: RADIUS.md,
                  scrollbarWidth: 'thin',
                }}
              >
                <div style={{
                  fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.16em',
                  color: COLORS.silver, textTransform: 'uppercase', fontFamily: FONTS.body,
                  marginBottom: '12px', opacity: 0.78,
                }}>
                  {tr ? 'İçindekiler' : 'Contents'}
                </div>
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {toc.map(item => {
                    const isActive = activeSection === item.id;
                    return (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        onClick={e => {
                          e.preventDefault();
                          document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }}
                        style={{
                          fontSize: '0.82rem',
                          color: isActive ? accent : COLORS.silver,
                          fontFamily: FONTS.body,
                          fontWeight: isActive ? 600 : 400,
                          textDecoration: 'none',
                          padding: '6px 10px',
                          borderRadius: RADIUS.sm,
                          borderLeft: `2px solid ${isActive ? accent : 'transparent'}`,
                          paddingLeft: '12px',
                          background: isActive ? `${accent}10` : 'transparent',
                          transition: 'all 0.15s',
                          lineHeight: 1.4,
                        }}
                        onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = COLORS.offWhite; }}
                        onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = COLORS.silver; }}
                      >
                        {item.title}
                      </a>
                    );
                  })}
                </nav>
              </aside>
            )}
          </div>
        </div>
      </div>

      {/* Mobile: hide TOC sidebar */}
      <style jsx>{`
        @media (max-width: 1024px) {
          .tefekkur-body-grid {
            grid-template-columns: 1fr !important;
          }
          .tefekkur-toc {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
