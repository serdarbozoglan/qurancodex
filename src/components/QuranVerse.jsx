import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { fadeUpItem } from './SectionWrapper';
import { useAudioWithFallback, buildFallbackUrls } from '../hooks/useAudioWithFallback';

const PlayIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="6,3 20,12 6,21" />
  </svg>
);
const PauseIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <rect x="6" y="4" width="4" height="16" rx="1" />
    <rect x="14" y="4" width="4" height="16" rx="1" />
  </svg>
);

/**
 * QuranVerse — displays Arabic + translation + optional audio.
 *
 * Audio modes (pick one):
 *   surah + ayah   → single verse, full CDN/reciter fallback chain
 *   verses         → [{surah, ayah}] array, sequential playback with fallback
 *   audioSrc       → legacy raw URL or URL[], no fallback (backward compat)
 */
export default function QuranVerse({
  arabic,
  translation,
  reference,
  className = '',
  surah = null,
  ayah = null,
  verses = null,
  audioSrc = null,
}) {
  const isSingle = surah !== null && ayah !== null;
  const isMulti  = Array.isArray(verses) && verses.length > 0;
  const isLegacy = !isSingle && !isMulti && audioSrc !== null;

  // ── Single-verse fallback hook (always called; ignored when not isSingle) ──
  const sv = useAudioWithFallback(isSingle ? surah : 0, isSingle ? ayah : 0);

  // ── Multi-verse sequential player ──────────────────────────────────────────
  const [mvPlaying, setMvPlaying] = useState(false);
  const mvRef  = useRef(null);   // current Audio object
  const mvLive = useRef(false);  // true while a sequence is active

  const mvStop = useCallback(() => {
    mvLive.current = false;
    if (mvRef.current) {
      mvRef.current.onerror  = null;
      mvRef.current.onended  = null;
      mvRef.current.pause();
      mvRef.current = null;
    }
    setMvPlaying(false);
  }, []);

  useEffect(() => () => mvStop(), [mvStop]);

  // Defined outside useCallback so it can reference itself
  const playMvRef = useRef(null);
  playMvRef.current = (verseIdx, urlIdx, list) => {
    if (!mvLive.current) return;
    if (verseIdx >= list.length) { mvStop(); return; }
    const v    = list[verseIdx];
    const urls = buildFallbackUrls(v.surah, v.ayah);
    if (urlIdx >= urls.length) {
      // This ayah exhausted all URLs → skip to next ayah
      playMvRef.current(verseIdx + 1, 0, list);
      return;
    }
    const audio = new Audio(urls[urlIdx]);
    mvRef.current = audio;

    audio.onended = () => {
      if (mvRef.current !== audio) return;
      playMvRef.current(verseIdx + 1, 0, list);
    };
    audio.onerror = () => {
      if (mvRef.current !== audio) return;
      audio.onerror = null;
      playMvRef.current(verseIdx, urlIdx + 1, list);
    };
    audio.play()
      .then(() => { if (mvRef.current === audio) setMvPlaying(true); })
      .catch(err => {
        if (err?.name === 'AbortError') return;
        if (mvRef.current !== audio) return;
        playMvRef.current(verseIdx, urlIdx + 1, list);
      });
  };

  const mvToggle = useCallback(() => {
    if (mvLive.current || mvPlaying) { mvStop(); return; }
    mvStop();
    mvLive.current = true;
    playMvRef.current(0, 0, verses || []);
  }, [mvPlaying, mvStop, verses]);

  // ── Legacy player (raw audioSrc URL / URL[]) ───────────────────────────────
  const legacySrcs    = audioSrc ? (Array.isArray(audioSrc) ? audioSrc : [audioSrc]) : [];
  const [legPlaying, setLegPlaying] = useState(false);
  const legAudioRef   = useRef(null);
  const legIdxRef     = useRef(0);
  const legSrcsRef    = useRef(legacySrcs);
  legSrcsRef.current  = legacySrcs;

  useEffect(() => {
    const audio = legAudioRef.current;
    if (!audio) return;
    const onEnded = () => {
      const next = legIdxRef.current + 1;
      if (next < legSrcsRef.current.length) {
        legIdxRef.current = next;
        audio.src = legSrcsRef.current[next];
        audio.play().catch(() => {});
      } else {
        legIdxRef.current = 0;
        setLegPlaying(false);
      }
    };
    audio.addEventListener('ended', onEnded);
    return () => audio.removeEventListener('ended', onEnded);
  }, []);

  useEffect(() => {
    if (legAudioRef.current) { legAudioRef.current.pause(); legAudioRef.current.currentTime = 0; }
    legIdxRef.current = 0;
    setLegPlaying(false);
  }, [audioSrc]);

  const legToggle = (e) => {
    e.stopPropagation();
    const audio = legAudioRef.current;
    if (!audio || legSrcsRef.current.length === 0) return;
    if (legPlaying) {
      audio.pause(); audio.currentTime = 0; legIdxRef.current = 0; setLegPlaying(false);
    } else {
      legIdxRef.current = 0;
      audio.src = legSrcsRef.current[0];
      audio.play().catch(() => {});
      setLegPlaying(true);
    }
  };

  // ── Unified button state ───────────────────────────────────────────────────
  const hasAudio = isSingle || isMulti || (isLegacy && legacySrcs.length > 0);
  const isPlaying = isSingle ? sv.playing  : isMulti ? mvPlaying  : legPlaying;
  const isLoading = isSingle ? sv.loading  : false;
  const hasFailed = isSingle ? sv.failed   : false;

  const handleToggle = (e) => {
    e.stopPropagation();
    if (isSingle)     sv.toggle();
    else if (isMulti) mvToggle();
    else              legToggle(e);
  };

  return (
    <motion.blockquote
      className={`glass-card p-8 md:p-10 my-8 border-l-4 border-gold ${className}`}
      style={{ position: 'relative' }}
      variants={fadeUpItem}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
    >
      {hasAudio && (
        <>
          {isLegacy && <audio ref={legAudioRef} />}
          <button
            onClick={handleToggle}
            disabled={hasFailed}
            title={hasFailed ? 'Ses yüklenemedi' : isPlaying ? 'Durdur' : 'Dinle'}
            style={{
              position: 'absolute', bottom: '14px', right: '14px',
              width: '36px', height: '36px', borderRadius: '50%',
              background: isPlaying
                ? 'rgba(212,165,116,0.18)'
                : hasFailed ? 'rgba(100,116,139,0.08)' : 'rgba(255,255,255,0.06)',
              border: `1px solid ${isPlaying
                ? 'rgba(212,165,116,0.55)'
                : hasFailed ? 'rgba(100,116,139,0.2)' : 'rgba(255,255,255,0.12)'}`,
              boxShadow: isPlaying ? '0 0 16px rgba(212,165,116,0.25)' : 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: hasFailed ? 'not-allowed' : 'pointer',
              transition: 'all 0.25s',
              color: isPlaying ? '#d4a574' : hasFailed ? '#475569' : '#94a3b8',
              opacity: hasFailed ? 0.5 : 1,
            }}
          >
            {isLoading
              ? <span style={{ fontSize: '0.55rem', letterSpacing: '-0.02em', color: '#94a3b8' }}>···</span>
              : isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
        </>
      )}

      <p
        className="font-arabic text-2xl md:text-3xl leading-relaxed text-gold mb-6"
        dir="rtl" lang="ar"
        style={{ textAlign: 'right', lineHeight: 2.2 }}
      >
        {arabic}
      </p>
      <p className="text-off-white/90 text-lg italic leading-relaxed mb-4">
        &ldquo;{translation}&rdquo;
      </p>
      <cite className="text-silver text-sm not-italic block">— {reference}</cite>
    </motion.blockquote>
  );
}
