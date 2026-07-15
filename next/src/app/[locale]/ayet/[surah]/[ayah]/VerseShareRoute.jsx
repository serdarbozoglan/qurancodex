'use client';

// ─── VerseShareRoute — /ayet/[s]/[a] client wrapper ─────────────────────
// Verse metnini acikkuran API'sinden fetch eder + güzel cinematic gösterim +
// "Kur'an'ı Oku'da Aç" CTA + share button + bookmark.
// ─────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { COLORS, FONTS } from '../../../../../tokens';
import { useLanguage } from '../../../../../i18n/LanguageContext';
import { cleanArabicForDisplay } from '../../../../../lib/arabic';
import { SURAH_NAMES_TR, SURAH_NAMES_EN } from '../../../../../lib/surahNames';
import BookmarkButton from '../../../../../components/BookmarkButton';

export default function VerseShareRoute({ surah, ayah }) {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const [verse, setVerse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [shareStatus, setShareStatus] = useState(null); // 'copied' | 'shared' | null

  const nameTr = SURAH_NAMES_TR?.[surah - 1] || `Sure ${surah}`;
  const nameEn = SURAH_NAMES_EN?.[surah - 1] || `Sūrah ${surah}`;
  const surahName = tr ? nameTr : nameEn;

  useEffect(() => {
    setIsMobile(window.innerWidth < 640);
    const h = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    // Fetch verse metnini iki dil için proxy API üzerinden çek
    Promise.all([
      fetch(`/api/meal/suat_yildirim/${surah}`).then(r => r.ok ? r.json() : null).catch(() => null),
      fetch(`/api/meal/sahih_international/${surah}`).then(r => r.ok ? r.json() : null).catch(() => null),
    ]).then(([trData, enData]) => {
      if (cancelled) return;
      const trVerse = trData?.data?.verses?.find(v => v.verse_number === ayah);
      const enVerse = enData?.data?.verses?.find(v => v.verse_number === ayah);
      setVerse({
        arabic: trVerse?.verse ? cleanArabicForDisplay(trVerse.verse) : '',
        tr: trVerse?.translation?.text || '',
        en: enVerse?.translation?.text || '',
      });
      setLoading(false);
    }).catch(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, [surah, ayah]);

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/${language}/ayet/${surah}/${ayah}`
    : `https://www.qurancodex.com/${language}/ayet/${surah}/${ayah}`;
  const shareText = tr
    ? `${surahName} ${surah}:${ayah}\n\n"${verse?.tr || ''}"\n\n— QuranCodex`
    : `${surahName} ${surah}:${ayah}\n\n"${verse?.en || ''}"\n\n— QuranCodex`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${surahName} ${surah}:${ayah} — QuranCodex`,
          text: shareText,
          url: shareUrl,
        });
        setShareStatus('shared');
        setTimeout(() => setShareStatus(null), 2400);
      } catch (err) {
        // Kullanıcı iptal ettiyse sessiz geç
        if (err.name !== 'AbortError') {
          // fallback clipboard
          copyToClipboard();
        }
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareStatus('copied');
      setTimeout(() => setShareStatus(null), 2400);
    } catch {
      setShareStatus('error');
      setTimeout(() => setShareStatus(null), 2400);
    }
  };

  return (
    <div style={{
      background: COLORS.cosmicBlack,
      minHeight: '100vh',
      paddingTop: '80px',
      paddingBottom: '80px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        maxWidth: 720,
        width: '100%',
        padding: isMobile ? '32px 20px' : '48px 40px',
        background: `linear-gradient(180deg, ${COLORS.gold}0a 0%, transparent 65%)`,
        borderTop: `1px solid ${COLORS.gold}22`,
        borderBottom: `1px solid ${COLORS.gold}22`,
        textAlign: 'center',
        position: 'relative',
      }}>
        {/* Bookmark button top-right */}
        <div style={{ position: 'absolute', top: 16, right: 16 }}>
          <BookmarkButton
            item={{
              id: `verse:${surah}:${ayah}`,
              type: 'verse',
              title: `${surahName} ${surah}:${ayah}`,
              description: tr ? verse?.tr : verse?.en,
              arabic: verse?.arabic,
              url: `/${language}/ayet/${surah}/${ayah}`,
            }}
            size="md"
            language={language}
          />
        </div>

        {/* Eyebrow */}
        <div style={{
          color: COLORS.gold,
          fontSize: '0.7rem',
          letterSpacing: '0.24em',
          textTransform: 'uppercase',
          fontWeight: 700,
          opacity: 0.75,
          marginBottom: 20,
        }}>
          {tr ? 'KUR\'ÂN-I KERÎM · AYET' : 'THE HOLY QURAN · VERSE'}
        </div>

        {loading && (
          <div style={{ color: COLORS.silver, fontSize: '0.9rem', padding: '60px 0' }}>
            {tr ? 'Yükleniyor…' : 'Loading…'}
          </div>
        )}

        {!loading && verse && (
          <>
            {/* Arabic verse */}
            {verse.arabic && (
              <p dir="rtl" lang="ar" style={{
                fontFamily: FONTS.quran,
                fontSize: isMobile ? '1.5rem' : '2rem',
                color: COLORS.gold,
                lineHeight: 2.1,
                margin: '0 0 24px',
                textShadow: `0 0 32px ${COLORS.gold}22`,
              }}>
                {verse.arabic}
              </p>
            )}

            {/* Translation */}
            <p style={{
              fontFamily: FONTS.display,
              fontStyle: 'italic',
              fontSize: isMobile ? '1.05rem' : '1.2rem',
              color: COLORS.offWhite,
              lineHeight: 1.7,
              margin: '0 0 20px',
              opacity: 0.94,
            }}>
              "{tr ? verse.tr : verse.en}"
            </p>

            {/* Reference */}
            <p style={{
              color: COLORS.silver,
              fontSize: '0.85rem',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              fontWeight: 600,
              opacity: 0.72,
              marginBottom: 36,
            }}>
              — {surahName} {surah}:{ayah}
            </p>

            {/* Filigree divider */}
            <div style={{
              width: 120,
              height: 1,
              margin: '0 auto 32px',
              background: `linear-gradient(90deg, transparent, ${COLORS.gold}88, transparent)`,
            }} />

            {/* Actions */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 12,
              justifyContent: 'center',
            }}>
              <Link
                href={`/${language}/oku/${surah}?ayah=${ayah}`}
                style={{
                  padding: '10px 20px',
                  background: `${COLORS.gold}22`,
                  border: `1px solid ${COLORS.gold}66`,
                  borderRadius: 8,
                  color: COLORS.gold,
                  fontFamily: FONTS.body,
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  letterSpacing: '0.06em',
                  transition: 'all 0.18s',
                }}
              >
                {tr ? 'Kur\'an\'ı Oku\'da Aç →' : 'Open in Reader →'}
              </Link>

              <button
                onClick={handleShare}
                style={{
                  padding: '10px 20px',
                  background: 'transparent',
                  border: `1px solid ${COLORS.gold}44`,
                  borderRadius: 8,
                  color: COLORS.offWhite,
                  fontFamily: FONTS.body,
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  letterSpacing: '0.06em',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  transition: 'all 0.18s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.gold; e.currentTarget.style.background = `${COLORS.gold}12`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = `${COLORS.gold}44`; e.currentTarget.style.background = 'transparent'; }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
                {shareStatus === 'copied' ? (tr ? 'Kopyalandı ✓' : 'Copied ✓') :
                 shareStatus === 'shared' ? (tr ? 'Paylaşıldı ✓' : 'Shared ✓') :
                 shareStatus === 'error' ? (tr ? 'Hata' : 'Error') :
                 (tr ? 'Paylaş' : 'Share')}
              </button>
            </div>
          </>
        )}

        {!loading && !verse && (
          <div style={{ color: COLORS.silver, fontSize: '0.9rem' }}>
            {tr ? 'Ayet bulunamadı.' : 'Verse not found.'}
          </div>
        )}
      </div>

      {/* Brand footer */}
      <div style={{
        marginTop: 32,
        color: COLORS.gold,
        fontSize: '0.72rem',
        letterSpacing: '0.28em',
        fontWeight: 600,
        opacity: 0.6,
      }}>
        QURAN CODEX
      </div>
    </div>
  );
}
