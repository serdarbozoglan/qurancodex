'use client';

// ─── ConciergePrompt — Anasayfa hero-altı cinematic input ─────────────────────
// RAG Semantik Concierge'nin görünür kapısı. Hero'nun hemen altında büyük
// prompt input — kullanıcının doğal dil sorusunu alır, /sor sayfasına
// yönlendirir.
//
// Özellikler:
//   - Auto-focus subtle glow animation
//   - Rotating placeholder (5 örnek query 4 saniye aralıklarla)
//   - Suggested queries chips (5 örnek — hızlı erişim)
//   - Mobile-first, keyboard navigation
//   - Site theme (cosmic bg + gold accent + Playfair)
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS } from '../tokens';
import ParticleBackground from '../components/ParticleBackground';

// Rotating placeholder queries — dil ile birlikte döner
const PLACEHOLDERS_TR = [
  'Kur\'an\'a sor: "öldükten sonra ne olur?"',
  'Kur\'an\'a sor: "sabırsızlık nasıl aşılır?"',
  'Kur\'an\'a sor: "vefat sonrası"',
  'Kur\'an\'a sor: "arkadaş edinmek zor"',
  'Kur\'an\'a sor: "hayatın anlamı"',
];
const PLACEHOLDERS_EN = [
  'Ask the Quran: "what happens after death?"',
  'Ask the Quran: "how to overcome impatience"',
  'Ask the Quran: "life\'s meaning"',
  'Ask the Quran: "difficulty making friends"',
  'Ask the Quran: "purpose of suffering"',
];

// Suggested chip queries — click → direkt navigate
const SUGGESTIONS_TR = [
  'Sabır', 'Öldükten sonra', 'Rızık', 'Yalnızlık', 'Yaratılış', 'Hz. Yusuf',
];
const SUGGESTIONS_EN = [
  'Patience', 'Afterlife', 'Provision', 'Loneliness', 'Creation', 'Prophet Joseph',
];

export default function ConciergePrompt() {
  const { language } = useLanguage();
  const router = useRouter();
  const reduced = useReducedMotion();
  const tr = language === 'tr';

  const [query, setQuery] = useState('');
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [focused, setFocused] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef(null);

  const placeholders = tr ? PLACEHOLDERS_TR : PLACEHOLDERS_EN;
  const suggestions = tr ? SUGGESTIONS_TR : SUGGESTIONS_EN;

  // Rotate placeholder every 4s (unless user focused/typed)
  useEffect(() => {
    if (focused || query) return;
    const interval = setInterval(() => {
      setPlaceholderIdx((i) => (i + 1) % placeholders.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [focused, query, placeholders.length]);

  const handleSubmit = (e) => {
    e?.preventDefault?.();
    const q = query.trim();
    if (q.length < 3) return;
    setSubmitting(true);
    router.push(`/${language}/sor?q=${encodeURIComponent(q)}`);
  };

  const handleSuggestion = (s) => {
    setQuery(s);
    setSubmitting(true);
    router.push(`/${language}/sor?q=${encodeURIComponent(s)}`);
  };

  return (
    <section
      id="concierge-prompt"
      style={{
        background: `radial-gradient(ellipse at center top, ${COLORS.gold}0d 0%, transparent 60%)`,
        padding: 'clamp(48px, 8vw, 100px) 24px clamp(32px, 5vw, 64px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle background gold radial glow — dual-hotspot ambient */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: `radial-gradient(circle at 20% 30%, ${COLORS.gold}08 0%, transparent 40%), radial-gradient(circle at 80% 70%, ${COLORS.gold}06 0%, transparent 50%)`,
        }}
      />
      {/* Cinematic parçacıklar — Hero ile parity, section tam yaşayan hisse.
          60 toplam parçacık × 0.20 glyph = ~12 mukattaa harfi + 48 gold nokta
          süzülür. Hero'daki 80 parçacığın section boyutuna uygun oranı.
          reduced-motion respekt edilir (ParticleBackground kendi içinde). */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: 0.85,
        }}
      >
        <ParticleBackground particleCount={60} glyphRatio={0.20} />
      </div>

      <motion.div
        initial={reduced ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.8 }}
        style={{
          maxWidth: '760px',
          margin: '0 auto',
          position: 'relative',
        }}
      >
        {/* Eyebrow */}
        <div style={{
          textAlign: 'center',
          color: `${COLORS.gold}cc`,
          fontFamily: FONTS.body,
          fontSize: '0.72rem',
          fontWeight: 600,
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          marginBottom: '20px',
        }}>
          {tr ? 'Kur\'an Rehberi' : 'Quran Guide'}
        </div>

        {/* Hook headline */}
        <h2 style={{
          fontFamily: FONTS.display,
          fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)',
          fontWeight: 700,
          color: COLORS.offWhite,
          textAlign: 'center',
          lineHeight: 1.25,
          letterSpacing: '-0.01em',
          margin: '0 0 12px',
        }}>
          {tr
            ? 'Aklındaki soruya Kur\'an nereden yaklaşır?'
            : 'How does the Quran approach your question?'}
        </h2>

        {/* Subtitle whisper */}
        <p style={{
          fontFamily: FONTS.display,
          fontStyle: 'italic',
          fontSize: 'clamp(0.9rem, 1.6vw, 1.02rem)',
          color: COLORS.silver,
          textAlign: 'center',
          lineHeight: 1.55,
          margin: '0 auto 34px',
          maxWidth: '560px',
          opacity: 0.85,
        }}>
          {tr
            ? 'Yaşadığın bir durumu ya da merak ettiğin bir kavramı yaz — sistem 6.236 ayet ve içerik arasından sana en yakın olanları seçer.'
            : 'Write a situation you\'re living or a concept you\'re curious about — the system picks the closest matches from 6,236 verses and content.'}
        </p>

        {/* Prompt input — gold border, subtle glow, focused state animasyon */}
        <motion.form
          onSubmit={handleSubmit}
          animate={{
            boxShadow: focused
              ? `0 0 0 1px ${COLORS.gold}66, 0 0 40px 4px ${COLORS.gold}15, 0 20px 60px rgba(0,0,0,0.4)`
              : `0 0 0 1px ${COLORS.gold}33, 0 0 20px 2px ${COLORS.gold}08, 0 12px 40px rgba(0,0,0,0.3)`,
          }}
          transition={{ duration: 0.3 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'linear-gradient(180deg, rgba(10,10,26,0.85) 0%, rgba(13,27,42,0.85) 100%)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderRadius: '999px',
            padding: '6px 6px 6px 24px',
            gap: '10px',
            position: 'relative',
          }}
        >
          {/* Search icon */}
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.75 }}>
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.35-4.35" />
          </svg>

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={placeholders[placeholderIdx]}
            aria-label={tr ? 'Kur\'an\'a sor' : 'Ask the Quran'}
            disabled={submitting}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: COLORS.offWhite,
              fontFamily: FONTS.body,
              fontSize: 'clamp(0.95rem, 1.6vw, 1.05rem)',
              padding: '14px 4px',
              minWidth: 0,
            }}
          />

          {/* Submit button */}
          <motion.button
            type="submit"
            disabled={query.trim().length < 3 || submitting}
            whileHover={query.trim().length >= 3 ? { scale: 1.05 } : {}}
            whileTap={query.trim().length >= 3 ? { scale: 0.97 } : {}}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: query.trim().length >= 3
                ? `linear-gradient(135deg, ${COLORS.gold} 0%, ${COLORS.btnGoldMid} 100%)`
                : `${COLORS.gold}22`,
              color: query.trim().length >= 3 ? COLORS.btnGoldText : `${COLORS.gold}88`,
              border: 'none',
              borderRadius: '999px',
              padding: '11px 18px',
              fontFamily: FONTS.body,
              fontSize: '0.86rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              cursor: query.trim().length >= 3 && !submitting ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s',
              flexShrink: 0,
              boxShadow: query.trim().length >= 3 ? `0 4px 16px ${COLORS.gold}44` : 'none',
            }}
          >
            <span>{tr ? 'Sor' : 'Ask'}</span>
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </motion.button>
        </motion.form>

        {/* Suggested queries — label above, chips below */}
        <div style={{
          textAlign: 'center',
          marginTop: '22px',
        }}>
          <div style={{
            fontFamily: FONTS.body,
            fontSize: '0.68rem',
            color: COLORS.silver,
            opacity: 0.78,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            marginBottom: '10px',
          }}>
            {tr ? 'Örnek sorular' : 'Try one of these'}
          </div>
        </div>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          justifyContent: 'center',
        }}>
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => handleSuggestion(s)}
              disabled={submitting}
              style={{
                background: 'transparent',
                border: `1px solid ${COLORS.gold}33`,
                borderRadius: '999px',
                padding: '6px 14px',
                color: `${COLORS.gold}cc`,
                fontFamily: FONTS.body,
                fontSize: '0.78rem',
                cursor: submitting ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s',
                letterSpacing: '0.02em',
              }}
              onMouseEnter={e => {
                if (submitting) return;
                e.currentTarget.style.background = `${COLORS.gold}12`;
                e.currentTarget.style.borderColor = `${COLORS.gold}66`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = `${COLORS.gold}33`;
              }}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Trust footer */}
        <p style={{
          textAlign: 'center',
          marginTop: '28px',
          fontFamily: FONTS.body,
          fontSize: '0.74rem',
          color: COLORS.silver,
          opacity: 0.78,
          letterSpacing: '0.04em',
        }}>
          {tr
            ? 'Sistem yorum katmaz — sadece ayetleri ve içerikleri rehberler. Hiçbir kişisel veri saklanmaz.'
            : 'The system adds no commentary — it only guides you to verses and content. No personal data is stored.'}
        </p>
      </motion.div>
    </section>
  );
}
