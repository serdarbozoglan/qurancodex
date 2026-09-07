'use client';

// Intro video modal — click-to-play, session-independent, fully skippable.
// The <video> mounts only while open, so the 9.9MB file is never fetched until
// the user clicks the hero "QuranCodex'i tanı" button (lazy, zero LCP cost).
// Opened by a user gesture, so playback with sound is allowed; if the browser
// still blocks sound-on-autoplay, it retries muted and offers an unmute button.

import { useEffect, useRef, useState, useCallback } from 'react';
import { COLORS, FONTS } from '../tokens';
import { useLanguage } from '../i18n/LanguageContext';

const PILL = {
  display: 'inline-flex', alignItems: 'center', gap: '8px',
  minHeight: '40px', padding: '10px 20px',
  background: COLORS.cosmicBlackAlpha85,
  border: `1px solid ${COLORS.gold}44`,
  borderRadius: '999px',
  color: COLORS.offWhite,
  fontFamily: FONTS.body, fontSize: '0.85rem', fontWeight: 600,
  letterSpacing: '0.03em', cursor: 'pointer',
  backdropFilter: 'blur(12px)',
};

export default function IntroVideoModal({ src, poster, onClose }) {
  const { language } = useLanguage();
  const tr = language === 'tr';
  const videoRef = useRef(null);
  const closeRef = useRef(null);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [failed, setFailed] = useState(false);

  // Single scrollbar hygiene (§13.16): lock body + html while open.
  useEffect(() => {
    const prevB = document.body.style.overflow;
    const prevH = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevB;
      document.documentElement.style.overflow = prevH;
    };
  }, []);

  // Attempt play on open. The opening click is a user gesture, so sound is
  // allowed; fall back to muted playback if the browser refuses.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    setMuted(false);
    try { v.currentTime = 0; } catch (e) { /* not ready yet */ }
    v.play().catch(() => {
      v.muted = true;
      setMuted(true);
      v.play().catch(() => setFailed(true));
    });
    closeRef.current?.focus();
  }, []);

  // Escape closes.
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const toggleSound = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (v.paused) v.play().catch(() => {});
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={tr ? 'QuranCodex açılış videosu' : 'QuranCodex intro video'}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: COLORS.cosmicBlack,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        playsInline
        preload="auto"
        onClick={(e) => e.stopPropagation()}
        onEnded={onClose}
        onError={() => setFailed(true)}
        onTimeUpdate={(e) => {
          const v = e.currentTarget;
          if (v.duration) setProgress((v.currentTime / v.duration) * 100);
        }}
        style={{ width: '100%', height: '100%', objectFit: 'contain', background: COLORS.cosmicBlack }}
      />

      {/* Controls: sound toggle + skip/close */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'absolute',
          bottom: 'max(28px, env(safe-area-inset-bottom, 0px))',
          left: '6vw', right: '6vw',
          display: 'flex', justifyContent: 'space-between', gap: '16px',
        }}
      >
        <button onClick={toggleSound} style={PILL} aria-pressed={!muted}>
          {muted
            ? (tr ? '♫ Sesi aç' : '♫ Sound on')
            : (tr ? '♫ Sesi kapat' : '♫ Sound off')}
        </button>
        <button ref={closeRef} onClick={onClose} style={PILL}>
          {tr ? 'Atla →' : 'Skip →'}
        </button>
      </div>

      {/* Progress timeline */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', bottom: 0, left: 0, height: '2px',
          width: `${progress}%`, background: COLORS.gold,
          boxShadow: `0 0 15px ${COLORS.gold}70`,
          transition: 'width 0.15s linear',
        }}
      />

      {failed && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'absolute', top: '50%', left: 0, right: 0,
            transform: 'translateY(-50%)', textAlign: 'center',
            color: COLORS.offWhite, fontFamily: FONTS.body, padding: '0 24px',
          }}
        >
          <p style={{ marginBottom: '16px' }}>
            {tr ? 'Video açılamadı.' : 'The video could not be played.'}
          </p>
          <button onClick={onClose} style={{ ...PILL, margin: '0 auto' }}>
            {tr ? 'Kapat' : 'Close'}
          </button>
        </div>
      )}
    </div>
  );
}
