'use client';

import Link from 'next/link';
import { useLanguage } from '../../../../i18n/LanguageContext';
import { COLORS, FONTS, RADIUS } from '../../../../tokens';
import ToolHeader from '../../../../components/ToolHeader';
import RootHero from '../../../../components/tefekkur/RootHero';
import ArticleRenderer from '../../../../components/tefekkur/ArticleRenderer';

export default function TefekkurArticleRoute({ article }) {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const title = tr ? article.titleTr : article.titleEn;
  const tldr = tr ? article.tldrTr : article.tldrEn;

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
        subtitleTr={article.titleTr}
        subtitleEn={article.titleEn}
        language={language}
      />

      <div style={{ flex: 1, padding: '32px 24px 80px', maxWidth: '900px', width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>

        {/* Back link */}
        <Link
          href={`/${language}/tefekkur`}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            fontSize: '0.78rem', color: COLORS.silver,
            fontFamily: FONTS.body, textDecoration: 'none',
            marginBottom: '20px',
            opacity: 0.75, transition: 'opacity 0.15s, color 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = COLORS.gold; e.currentTarget.style.opacity = '1'; }}
          onMouseLeave={e => { e.currentTarget.style.color = COLORS.silver; e.currentTarget.style.opacity = '0.75'; }}
        >
          <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          {tr ? 'Tüm Yazılar' : 'All Essays'}
        </Link>

        {/* Hero — title block */}
        <header style={{ marginBottom: '24px' }}>
          {/* Series indicator */}
          {article.seriesNumber != null && (
            <div style={{
              fontSize: '0.66rem', fontWeight: 700, letterSpacing: '0.22em',
              color: COLORS.purple, textTransform: 'uppercase', fontFamily: FONTS.body,
              marginBottom: '12px',
            }}>
              {tr ? 'Semantik Serisi' : 'Semantic Series'} · #{article.seriesNumber}{article.seriesTotal ? ` / ${article.seriesTotal}` : ''}
            </div>
          )}

          {/* Title */}
          <h1 style={{
            margin: '0 0 18px',
            fontFamily: FONTS.display,
            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
            color: COLORS.offWhite,
            fontWeight: 700,
            lineHeight: 1.25,
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
            {tldr}
          </p>

          {/* Meta row */}
          <div style={{
            display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '14px',
            fontSize: '0.76rem', color: COLORS.silver,
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
                  {tr ? 'Medium\'da görüntüle ↗' : 'View on Medium ↗'}
                </a>
              </>
            )}
          </div>
        </header>

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

        {/* Block-based article body */}
        <ArticleRenderer blocks={article.blocks} language={language} />

        {/* Series navigation */}
        {(article.previousArticle || article.nextArticle) && (
          <div style={{
            marginTop: '48px',
            paddingTop: '32px',
            borderTop: `1px solid ${COLORS.glassBorder || 'rgba(255,255,255,0.08)'}`,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
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
                  marginBottom: '6px', opacity: 0.7,
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
                  marginBottom: '6px', opacity: 0.7,
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

        {/* Canonical footer */}
        {article.canonicalUrl && (
          <div style={{
            marginTop: '36px',
            padding: '16px 20px',
            background: 'rgba(255,255,255,0.022)',
            border: `1px dashed rgba(255,255,255,0.10)`,
            borderRadius: RADIUS.md,
            fontSize: '0.82rem', color: COLORS.silver, fontFamily: FONTS.body,
            lineHeight: 1.7,
          }}>
            {tr
              ? <>Bu yazı ilk olarak <a href={article.canonicalUrl} target="_blank" rel="noopener noreferrer canonical" style={{ color: COLORS.gold }}>Medium</a>'da, <a href={article.author?.url} target="_blank" rel="noopener noreferrer" style={{ color: COLORS.gold }}>{article.author?.name}</a> tarafından yayımlanmıştır. QuranCodex'te yeniden düzenlenmiş ve site araçlarıyla çapraz bağlanmıştır.</>
              : <>This essay was originally published on <a href={article.canonicalUrl} target="_blank" rel="noopener noreferrer canonical" style={{ color: COLORS.gold }}>Medium</a> by <a href={article.author?.url} target="_blank" rel="noopener noreferrer" style={{ color: COLORS.gold }}>{article.author?.name}</a>. Re-edited on QuranCodex and cross-linked with site tools.</>}
          </div>
        )}
      </div>
    </div>
  );
}
