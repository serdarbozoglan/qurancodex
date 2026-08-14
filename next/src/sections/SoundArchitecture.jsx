'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import SectionWrapper, { fadeUpItem } from '../components/SectionWrapper';
import { buildFallbackUrls } from '../hooks/useAudioWithFallback';
import { PlayIcon, PauseIcon } from '../components/icons';
import { FONTS, COLORS, RADIUS, TRANSITION, SEMANTIC } from '../tokens';

// Splits text at Arabic character sequences and wraps them with styled spans.
// Keeps spaces between Arabic letters/punctuation so "ق، ك، ط" stays one span.
function withArabic(text, { color = COLORS.gold, size = '1.15em', weight = 700 } = {}) {
  const parts = text.split(/((?:[\u0600-\u06FF،؛؟]+\s*)+)/g);
  return parts.map((part, i) =>
    /[\u0600-\u06FF]/.test(part)
      ? (
        <span key={i} dir="rtl" lang="ar" style={{
          fontFamily: FONTS.quran,
          fontSize: size, color, fontWeight: weight,
          display: 'inline', lineHeight: 1.4,
        }}>{part.trim().replace(/[،؛]/g, m => ` ${m} `).replace(/\s+/g, ' ').trim()}</span>
      )
      : part
  );
}

// Sert ünsüzler — patlayıcı, vurgulu, boğumlu sesler
const HARD_CONSONANTS = new Set('قكطتدضصبخغجظ'.split(''));

// Ayetteki sert harf oranını hesapla (0-100)
function calcHardnessScore(verse) {
  const letters = [...verse].filter(c => /[\u0621-\u064A]/.test(c)); // sadece Arapça harfler (harekesiz)
  if (letters.length === 0) return 50;
  const hardCount = letters.filter(c => HARD_CONSONANTS.has(c)).length;
  return Math.round((hardCount / letters.length) * 100);
}


// ── Sound visualization bar patterns (aesthetic — restored from earlier version) ──
const JAGGED_PATTERN = [8, 22, 12, 30, 6, 26, 14, 32, 10, 24, 8, 28, 16, 34, 12, 22, 8, 30, 14, 26];
const SMOOTH_PATTERN = [10, 14, 16, 18, 20, 22, 20, 18, 20, 22, 20, 18, 16, 18, 20, 22, 20, 18, 16, 14];

const SURAS = [
  {
    id: 'muddaththir',
    labelTr: 'Müddessir', labelEn: 'Al-Muddaththir',
    numTr: '74. Sûre', numEn: 'Surah 74',
    themeTr: 'Azap · Uyarı', themeEn: 'Punishment · Warning',
    color: '#e74c3c', glow: 'rgba(231,76,60,0.12)', border: 'rgba(231,76,60,0.35)',
    verse: 'سَأُصْلِيهِ سَقَرَ',
    verseRef: '74:26',
    harshLetters: ['ص', 'ق'],
    softLetters: ['ل', 'ي', 'ه', 'ر'],
    descTr: 'Kısa bir cümlede iki patlayıcı ünsüz (ص، ق) — azabın sertliği sese yansır.',
    descEn: 'Two explosive consonants (ص، ق) in a single short phrase — the harshness of punishment echoes in the sound.',
    audioKey: '074026',
  },
  {
    id: 'maryam',
    labelTr: 'Meryem', labelEn: 'Maryam',
    numTr: '19. Sûre', numEn: 'Surah 19',
    themeTr: 'Rahmet · Huzur', themeEn: 'Mercy · Peace',
    color: '#3498db', glow: 'rgba(52,152,219,0.12)', border: 'rgba(52,152,219,0.35)',
    verse: 'وَحَنَانًا مِن لَّدُنَّا وَزَكَاةً وَكَانَ تَقِيًّا',
    verseRef: '19:13',
    harshLetters: ['د', 'ت', 'ق'],
    softLetters: ['و', 'ح', 'ن', 'م', 'ل'],
    descTr: 'ح، ن، م، ل — nazal ve akıcı sesler rahmetin yumuşaklığını taşır; kapanış "takıyyâ" da bu yumuşaklıkla uyum içinde.',
    descEn: 'ح، ن، م، ل — nasal and liquid consonants carry the tenderness of mercy; even the closing "taqiyyā" flows in that same softness.',
    audioKey: '019013',
  },
  {
    id: 'qaria',
    labelTr: 'Kâria', labelEn: "Al-Qari'a",
    numTr: '101. Sûre', numEn: 'Surah 101',
    themeTr: 'Kıyamet · Çarpış', themeEn: 'Apocalypse · Strike',
    color: '#e67e22', glow: 'rgba(230,126,34,0.12)', border: 'rgba(230,126,34,0.35)',
    verse: 'الْقَارِعَةُ',
    verseRef: '101:1',
    harshLetters: ['ق', 'ر'],
    softLetters: ['ع'],
    descTr: 'Sûre adı tek başına: patlayıcı ق ve tınlayan ر kıyametin sesini taşır.',
    descEn: 'The name alone: explosive ق and rolling ر enact the cosmic strike.',
    audioKey: '101001',
  },
  {
    id: 'rahman',
    labelTr: 'Rahmân', labelEn: 'Ar-Rahman',
    numTr: '55. Sûre', numEn: 'Surah 55',
    themeTr: 'Nimet · Güzellik', themeEn: 'Blessing · Beauty',
    color: '#2ecc71', glow: 'rgba(46,204,113,0.12)', border: 'rgba(46,204,113,0.35)',
    verse: 'الرَّحْمَٰنُ عَلَّمَ الْقُرْآنَ',
    verseRef: '55:1-2',
    harshLetters: ['ق'],
    softLetters: ['ر', 'ح', 'م', 'ن', 'ل'],
    descTr: 'ر، ح، م، ن — dört yumuşak ses, dört nimetin müziği.',
    descEn: 'ر، ح، م، ن — four flowing sounds for four opening blessings.',
    // #197 (2026-07-19) — Ekranda 55:1-2 iki ayet gösteriliyor; audio da her ikisini
    // sırayla çalar (55:1 tek başına yalnız "er-Rahmân"; ekran-audio parity gerekli).
    audioKey: ['055001', '055002'],
  },
];

// Parse audioKey (e.g. '074026') → { surah: 74, ayah: 26 }
function parseAudioKey(key) {
  return { surah: parseInt(key.slice(0, 3), 10), ayah: parseInt(key.slice(3), 10) };
}

// ─────────────────────────────────────────────────────────────
//  Comparison Card: Azap (jagged) vs Rahmet (smooth)
// ─────────────────────────────────────────────────────────────
// Audio keys for the multi-ayah passages (101:1-3, 55:1-4)
const COMPARISON_AUDIO = {
  punishment: ['101001', '101002', '101003'],
  mercy: ['055001', '055002', '055003', '055004'],
};

function ComparisonCard({ t, language }) {
  const data = t('soundArchitecture.comparison');
  const punishment = data.punishment;
  const mercy = data.mercy;

  // Audio state — only one side plays at a time
  const [activeSide, setActiveSide] = useState(null); // 'punishment' | 'mercy' | null
  const [audioFailed, setAudioFailed] = useState(null);
  const audioRef = useRef(null);
  const liveTokenRef = useRef(null);

  useEffect(() => () => {
    liveTokenRef.current = null;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  }, []);

  const stopAudio = () => {
    liveTokenRef.current = null;
    if (audioRef.current) {
      audioRef.current.onerror = null;
      audioRef.current.onended = null;
      audioRef.current.pause();
      audioRef.current = null;
    }
    setActiveSide(null);
  };

  const playUrlList = (urls, urlIdx, token, onDone) => {
    if (liveTokenRef.current !== token) return;
    if (urlIdx >= urls.length) {
      setAudioFailed(token.split('-')[0]);
      onDone();
      return;
    }
    const audio = new Audio(urls[urlIdx]);
    audioRef.current = audio;
    audio.onended = () => {
      if (liveTokenRef.current === token) onDone();
    };
    audio.onerror = () => {
      if (audioRef.current !== audio) return;
      audio.onerror = null;
      playUrlList(urls, urlIdx + 1, token, onDone);
    };
    audio.play().catch(err => {
      if (err?.name === 'AbortError') return;
      if (audioRef.current !== audio) return;
      playUrlList(urls, urlIdx + 1, token, onDone);
    });
  };

  // Plays a sequence of ayahs (each ayah may have multiple fallback URLs)
  const playAyahChain = (audioKeys, sideName) => {
    // eslint-disable-next-line react-hooks/purity -- called from event handler, not during render; token uniqueness is the intent.
    const token = `${sideName}-${Date.now()}`;
    liveTokenRef.current = token;
    setActiveSide(sideName);
    setAudioFailed(null);

    let ayahIdx = 0;
    const playNextAyah = () => {
      if (liveTokenRef.current !== token) return;
      if (ayahIdx >= audioKeys.length) {
        if (liveTokenRef.current === token) setActiveSide(null);
        return;
      }
      const { surah, ayah } = parseAudioKey(audioKeys[ayahIdx]);
      const urls = buildFallbackUrls(surah, ayah);
      ayahIdx += 1;
      playUrlList(urls, 0, token, playNextAyah);
    };
    playNextAyah();
  };

  const togglePlay = (sideName) => {
    if (activeSide === sideName) {
      stopAudio();
      return;
    }
    stopAudio();
    playAyahChain(COMPARISON_AUDIO[sideName], sideName);
  };

  const Side = ({ side, sideName, color, glow, border, pattern, accent }) => {
    const isPlaying = activeSide === sideName;
    const isFailed = audioFailed === sideName;
    const labels = (t('soundArchitecture.discovery') || {}).labels || {};

    return (
    <div
      style={{
        background: glow,
        border: `1px solid ${border}`,
        borderRadius: RADIUS.xl,
        padding: '22px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top accent strip */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
        background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
      }} />

      {/* Label + Play button row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          color, fontSize: '0.65rem', fontFamily: 'Inter, sans-serif',
          fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase',
          marginBottom: '6px',
        }}>{side.label}</p>
        <p style={{
          color: COLORS.offWhite, fontSize: '0.95rem',
          fontFamily: FONTS.display, fontWeight: 700,
        }}>{side.sura}</p>
        </div>

        {/* Play button */}
        <button
          onClick={() => !isFailed && togglePlay(sideName)}
          disabled={isFailed}
          aria-label={isPlaying ? labels.stopLabel : labels.listenLabel}
          title={isFailed ? (language === 'tr' ? 'Ses yüklenemedi' : 'Audio unavailable') : undefined}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            background: isPlaying ? `${color}26` : COLORS.glassBg,
            border: `1px solid ${isPlaying ? border : 'rgba(255,255,255,0.12)'}`,
            borderRadius: RADIUS.pillSm, padding: '6px 12px',
            color: isFailed ? COLORS.silver : color,
            fontSize: '0.72rem', fontFamily: 'Inter, sans-serif', fontWeight: 600,
            cursor: isFailed ? 'not-allowed' : 'pointer',
            opacity: isFailed ? 0.5 : 1,
            transition: 'all 0.18s', flexShrink: 0,
          }}
        >
          {isPlaying ? <PauseIcon size={12} /> : <PlayIcon size={12} />}
          <span>{isPlaying ? (labels.stopLabel || (language === 'tr' ? 'Durdur' : 'Stop')) : (labels.listenLabel || (language === 'tr' ? 'Dinle' : 'Listen'))}</span>
        </button>
      </div>

      {/* Arabic verse */}
      <div dir="rtl" lang="ar" style={{
        fontFamily: FONTS.quran,
        fontSize: 'clamp(1.15rem, 2.5vw, 1.5rem)',
        lineHeight: 1.9,
        color,
        textAlign: 'right',
        wordBreak: 'keep-all',
        background: 'rgba(0,0,0,0.18)',
        borderRadius: RADIUS.md,
        padding: '10px 14px',
        minHeight: '76px',
      }}>{side.arabic}</div>

      {/* Dominant letters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <span style={{ color: COLORS.silver, fontSize: '0.7rem', fontFamily: 'Inter, sans-serif' }}>
          {language === 'tr' ? 'Baskın sesler:' : 'Dominant sounds:'}
        </span>
        {side.dominant.split(' ').map(l => (
          <span key={l} style={{
            fontFamily: FONTS.quran, fontSize: '1.2rem',
            color, lineHeight: 1,
            background: `${color}1f`, border: `1px solid ${border}`,
            borderRadius: RADIUS.sm, padding: '2px 10px',
          }}>{l}</span>
        ))}
      </div>

      {/* Feature line */}
      <p style={{
        color: accent, fontSize: '0.85rem', fontFamily: 'Inter, sans-serif',
        fontStyle: 'italic', lineHeight: 1.5,
      }}>"{side.feature}"</p>

      {/* Sound visualization */}
      <div>
        <p style={{
          color: COLORS.silver, fontSize: '0.6rem', fontFamily: 'Inter, sans-serif',
          letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '6px',
        }}>{language === 'tr' ? 'Ses Dokusu' : 'Sound Texture'}</p>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '2px', height: '40px' }}>
          {pattern.map((h, i) => (
            <motion.div
              key={i}
              initial={{ height: 0, opacity: 0 }}
              whileInView={{ height: `${h}px`, opacity: 0.75 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.025, ease: 'easeOut' }}
              style={{
                flex: 1, maxWidth: '6px',
                background: color, borderRadius: '2px',
              }}
            />
          ))}
        </div>
      </div>

      {/* Note */}
      <p style={{
        color: COLORS.silver, fontSize: '0.78rem', fontFamily: 'Inter, sans-serif',
        lineHeight: 1.6, marginTop: '4px',
      }}>{language === 'tr' ? side.noteTr : side.noteEn}</p>
    </div>
    );
  };

  return (
    <motion.div variants={fadeUpItem} className="mb-12">
      <div style={{ marginBottom: '14px' }}>
        <p style={{
          color: COLORS.gold, fontSize: '0.7rem', fontFamily: 'Inter, sans-serif',
          fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase',
          marginBottom: '4px',
        }}>{data.title}</p>
        <p style={{ color: COLORS.silver, fontSize: '0.9rem', fontFamily: 'Inter, sans-serif' }}>
          {data.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Side
          side={punishment}
          sideName="punishment"
          color="#e74c3c"
          glow="rgba(231,76,60,0.08)"
          border="rgba(231,76,60,0.30)"
          pattern={JAGGED_PATTERN}
          accent="#ff8b80"
        />
        <Side
          side={mercy}
          sideName="mercy"
          color="#2ecc71"
          glow="rgba(46,204,113,0.08)"
          border="rgba(46,204,113,0.30)"
          pattern={SMOOTH_PATTERN}
          accent="#69db7c"
        />
      </div>

      {/* Methodology pill */}
      <div style={{
        marginTop: '14px',
        background: 'rgba(212,165,116,0.06)',
        border: '1px solid rgba(212,165,116,0.20)',
        borderRadius: RADIUS.chip,
        padding: '10px 14px',
        display: 'flex', alignItems: 'flex-start', gap: '10px',
      }}>
        <span style={{ color: COLORS.gold, fontSize: '0.7rem', flexShrink: 0, marginTop: '1px' }}>ⓘ</span>
        <p style={{ color: COLORS.silver, fontSize: '0.78rem', fontFamily: 'Inter, sans-serif', lineHeight: 1.6 }}>
          {language === 'tr' ? data.methodologyTr : data.methodologyEn}
        </p>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
//  Tajwid Panel: Tafhīm / Tarqīq / Qalqala
// ─────────────────────────────────────────────────────────────
function TajwidPanel({ t, language }) {
  const data = t('soundArchitecture.tajwid');
  const palette = [
    { color: COLORS.gold, border: 'rgba(212,165,116,0.35)', glow: 'rgba(212,165,116,0.06)' }, // tafhim — gold
    { color: '#3498db', border: 'rgba(52,152,219,0.35)',  glow: 'rgba(52,152,219,0.06)'  }, // tarqiq — blue
    { color: '#e67e22', border: 'rgba(230,126,34,0.35)',  glow: 'rgba(230,126,34,0.06)'  }, // qalqala — orange
  ];

  return (
    <motion.div variants={fadeUpItem} className="mb-12">
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{
          color: COLORS.offWhite, fontSize: 'clamp(1.3rem, 2.5vw, 1.7rem)',
          fontFamily: FONTS.display, fontWeight: 700,
          marginBottom: '6px',
        }}>{data.title}</h3>
        <p style={{ color: COLORS.silver, fontSize: '0.9rem', fontFamily: 'Inter, sans-serif', maxWidth: '52rem' }}>
          {data.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.categories.map((cat, idx) => {
          const p = palette[idx];
          return (
            <div key={cat.name} style={{
              background: p.glow,
              border: `1px solid ${p.border}`,
              borderRadius: RADIUS.xl,
              padding: '20px',
              display: 'flex', flexDirection: 'column', gap: '12px',
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                background: `linear-gradient(90deg, transparent, ${p.color}, transparent)`,
              }} />

              {/* Name */}
              <p style={{
                color: p.color, fontSize: '1rem',
                fontFamily: FONTS.display, fontWeight: 700,
              }}>{cat.name}</p>

              {/* Letters row */}
              <div dir="rtl" lang="ar" style={{
                fontFamily: FONTS.quran,
                fontSize: '1.6rem',
                color: p.color,
                textAlign: 'right',
                lineHeight: 1.7,
                background: 'rgba(0,0,0,0.18)',
                borderRadius: RADIUS.md,
                padding: '8px 14px',
                letterSpacing: '0.05em',
              }}>{cat.letters}</div>

              {/* Mnemonic */}
              <div>
                <p style={{
                  color: COLORS.silver, fontSize: '0.6rem', fontFamily: 'Inter, sans-serif',
                  letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '4px',
                }}>{language === 'tr' ? 'Hatırlatma' : 'Mnemonic'}</p>
                <p style={{
                  color: COLORS.offWhite, fontSize: '0.85rem',
                  fontFamily: 'Inter, sans-serif', fontStyle: 'italic',
                }}>{cat.mnemonic}</p>
              </div>

              {/* Trait */}
              <div>
                <p style={{
                  color: COLORS.silver, fontSize: '0.6rem', fontFamily: 'Inter, sans-serif',
                  letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '4px',
                }}>{language === 'tr' ? 'Özellik' : 'Trait'}</p>
                <p style={{
                  color: COLORS.silver, fontSize: '0.82rem', fontFamily: 'Inter, sans-serif',
                  lineHeight: 1.5,
                }}>{cat.trait}</p>
              </div>

              {/* Function */}
              <div style={{ marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <p style={{
                  color: COLORS.silver, fontSize: '0.6rem', fontFamily: 'Inter, sans-serif',
                  letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '4px',
                }}>{language === 'tr' ? 'İşlev' : 'Function'}</p>
                <p style={{
                  color: COLORS.offWhite, fontSize: '0.82rem', fontFamily: 'Inter, sans-serif',
                  lineHeight: 1.5,
                }}>{cat.function}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <div style={{
        marginTop: '14px',
        background: 'rgba(212,165,116,0.06)',
        border: '1px solid rgba(212,165,116,0.20)',
        borderRadius: RADIUS.chip,
        padding: '12px 16px',
      }}>
        <p style={{ color: COLORS.silver, fontSize: '0.82rem', fontFamily: 'Inter, sans-serif', lineHeight: 1.65 }}>
          {language === 'tr' ? data.noteTr : data.noteEn}
        </p>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
//  Discovery Widget: Tahmin Et — 3 ayet
// ─────────────────────────────────────────────────────────────
function DiscoveryWidget({ t, language }) {
  const data = t('soundArchitecture.discovery');
  const items = data.items;
  const labels = data.labels;

  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null); // 'punishment' | 'mercy' | null
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [audioFailed, setAudioFailed] = useState(false);
  const audioRef = useRef(null);
  const liveIdRef = useRef(null);

  const item = items[idx];
  const isLast = idx === items.length - 1;
  const allDone = revealed && isLast;

  // Cleanup audio on unmount or item change
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const stopAudio = () => {
    liveIdRef.current = null;
    if (audioRef.current) {
      audioRef.current.onerror = null;
      audioRef.current.onended = null;
      audioRef.current.pause();
      audioRef.current = null;
    }
    setPlaying(false);
  };

  const playWithFallback = (urls, urlIdx, token) => {
    if (liveIdRef.current !== token) return;
    if (urlIdx >= urls.length) {
      setAudioFailed(true);
      setPlaying(false);
      return;
    }
    const audio = new Audio(urls[urlIdx]);
    audioRef.current = audio;
    audio.onended = () => {
      if (liveIdRef.current === token) setPlaying(false);
    };
    audio.onerror = () => {
      if (audioRef.current !== audio) return;
      audio.onerror = null;
      playWithFallback(urls, urlIdx + 1, token);
    };
    audio.play()
      .then(() => { if (liveIdRef.current === token) setPlaying(true); })
      .catch(err => {
        if (err?.name === 'AbortError') return;
        if (audioRef.current !== audio) return;
        playWithFallback(urls, urlIdx + 1, token);
      });
  };

  const togglePlay = () => {
    if (playing) {
      stopAudio();
      return;
    }
    setAudioFailed(false);
    // #197 (2026-07-19) — audioKey string veya array olabilir; array durumunda
    // ayet-ayet zincir çalınır (69:1-2 gibi çift-ayet item'ların tümü duyulur).
    const keys = Array.isArray(item.audioKey) ? item.audioKey : [item.audioKey];
    // eslint-disable-next-line react-hooks/purity -- called from event handler, not during render; token uniqueness is the intent.
    const token = `${item.id}-${Date.now()}`;
    liveIdRef.current = token;
    setPlaying(true);

    let keyIdx = 0;
    const playNextKey = () => {
      if (liveIdRef.current !== token) return;
      if (keyIdx >= keys.length) {
        if (liveIdRef.current === token) setPlaying(false);
        return;
      }
      const { surah, ayah } = parseAudioKey(keys[keyIdx]);
      const urls = buildFallbackUrls(surah, ayah);
      keyIdx += 1;
      // playWithFallback ilk imzasında token + urlIdx alıyor; ancak "onEnd"
      // callback'i içeride setPlaying(false) yapıyor — chain için özel
      // playWithFallbackChained versiyonu yazmalıyız. Inline:
      const playChainStep = (urlIdx) => {
        if (liveIdRef.current !== token) return;
        if (urlIdx >= urls.length) {
          setAudioFailed(true);
          setPlaying(false);
          return;
        }
        const audio = new Audio(urls[urlIdx]);
        audioRef.current = audio;
        audio.onended = () => {
          if (liveIdRef.current === token) playNextKey();
        };
        audio.onerror = () => {
          if (audioRef.current !== audio) return;
          audio.onerror = null;
          playChainStep(urlIdx + 1);
        };
        audio.play().catch(err => {
          if (err?.name === 'AbortError') return;
          if (audioRef.current !== audio) return;
          playChainStep(urlIdx + 1);
        });
      };
      playChainStep(0);
    };
    playNextKey();
  };

  const pickAnswer = (answer) => {
    if (revealed) return;
    setPicked(answer);
    setRevealed(true);
    if (answer === item.answer) setScore(s => s + 1);
  };

  const nextQuestion = () => {
    stopAudio();
    if (isLast) return;
    setIdx(i => i + 1);
    setPicked(null);
    setRevealed(false);
    setAudioFailed(false);
  };

  const reset = () => {
    stopAudio();
    setIdx(0);
    setPicked(null);
    setRevealed(false);
    setScore(0);
    setAudioFailed(false);
  };

  const isCorrect = revealed && picked === item.answer;

  return (
    <motion.div variants={fadeUpItem} className="mb-12">
      <div style={{ marginBottom: '14px' }}>
        <h3 style={{
          color: COLORS.offWhite, fontSize: 'clamp(1.3rem, 2.5vw, 1.7rem)',
          fontFamily: FONTS.display, fontWeight: 700,
          marginBottom: '6px',
        }}>{data.title}</h3>
        <p style={{ color: COLORS.silver, fontSize: '0.9rem', fontFamily: 'Inter, sans-serif', maxWidth: '52rem' }}>
          {data.subtitle}
        </p>
      </div>

      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${revealed ? (isCorrect ? 'rgba(46,204,113,0.40)' : 'rgba(231,76,60,0.40)') : 'rgba(255,255,255,0.10)'}`,
        borderRadius: '16px',
        padding: 'clamp(14px, 2.4vw, 20px)',
        transition: 'border-color 0.3s',
      }}>
        {/* Progress + score */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            {items.map((_, i) => (
              <div key={i} style={{
                width: '24px', height: '4px', borderRadius: '2px',
                background: i < idx || (i === idx && revealed)
                  ? (i < idx || picked === items[i].answer || (i === idx && picked === item.answer) ? '#2ecc71' : '#e74c3c')
                  : i === idx ? COLORS.gold : 'rgba(255,255,255,0.15)',
                transition: 'background 0.3s',
              }} />
            ))}
          </div>
          <p style={{ color: COLORS.silver, fontSize: '0.75rem', fontFamily: 'Inter, sans-serif' }}>
            {labels.scoreLabel}: <span style={{ color: COLORS.gold, fontWeight: 700 }}>{score}/{items.length}</span>
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!allDone ? (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {/* Instruction */}
              {!revealed && (
                <p style={{
                  color: COLORS.silver, fontSize: '0.85rem', fontFamily: 'Inter, sans-serif',
                  fontStyle: 'italic', marginBottom: '10px',
                }}>{language === 'tr' ? data.instructionTr : data.instructionEn}</p>
              )}

              {/* Arabic verse */}
              <div dir="rtl" lang="ar" style={{
                fontFamily: FONTS.quran,
                fontSize: 'clamp(1.3rem, 3vw, 1.9rem)',
                lineHeight: 1.5,
                color: revealed ? (isCorrect ? '#2ecc71' : '#e74c3c') : COLORS.gold,
                textAlign: 'right',
                wordBreak: 'keep-all',
                marginBottom: '6px',
                transition: 'color 0.4s',
                textShadow: revealed ? `0 0 16px ${isCorrect ? 'rgba(46,204,113,0.30)' : 'rgba(231,76,60,0.30)'}` : 'none',
              }}>{item.arabic}</div>

              <p style={{
                color: COLORS.silver, fontSize: '0.78rem', fontFamily: 'Inter, sans-serif',
                textAlign: 'right', direction: 'ltr', marginBottom: '12px',
              }}>{item.verseRef}</p>

              {/* Listen + answer buttons */}
              {!revealed ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {/* Listen button */}
                  <button
                    onClick={togglePlay}
                    disabled={audioFailed}
                    style={{
                      alignSelf: 'flex-start',
                      display: 'flex', alignItems: 'center', gap: '8px',
                      background: playing ? 'rgba(212,165,116,0.18)' : COLORS.glassBg,
                      border: `1px solid ${playing ? 'rgba(212,165,116,0.5)' : 'rgba(255,255,255,0.12)'}`,
                      borderRadius: RADIUS.pillSm, padding: '8px 16px',
                      color: audioFailed ? COLORS.silver : COLORS.gold,
                      fontSize: '0.8rem', fontFamily: 'Inter, sans-serif',
                      cursor: audioFailed ? 'not-allowed' : 'pointer',
                      opacity: audioFailed ? 0.5 : 1,
                      transition: 'all 0.18s',
                    }}
                    title={audioFailed ? (language === 'tr' ? 'Ses yüklenemedi' : 'Audio unavailable') : undefined}
                  >
                    {playing ? <PauseIcon size={12} /> : <PlayIcon size={12} />}
                    <span>{playing ? labels.stopLabel : labels.listenLabel}</span>
                  </button>

                  {/* Two answer buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => pickAnswer('punishment')}
                      style={{
                        background: 'rgba(231,76,60,0.08)',
                        border: '1px solid rgba(231,76,60,0.35)',
                        borderRadius: RADIUS.lg,
                        padding: '11px 12px',
                        color: '#e74c3c',
                        fontSize: '0.95rem', fontFamily: FONTS.display,
                        fontWeight: 700, cursor: 'pointer',
                        transition: 'all 0.18s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(231,76,60,0.16)'; e.currentTarget.style.borderColor = 'rgba(231,76,60,0.6)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(231,76,60,0.08)'; e.currentTarget.style.borderColor = 'rgba(231,76,60,0.35)'; }}
                    >{labels.punishment}</button>
                    <button
                      onClick={() => pickAnswer('mercy')}
                      style={{
                        background: 'rgba(46,204,113,0.08)',
                        border: '1px solid rgba(46,204,113,0.35)',
                        borderRadius: RADIUS.lg,
                        padding: '11px 12px',
                        color: '#2ecc71',
                        fontSize: '0.95rem', fontFamily: FONTS.display,
                        fontWeight: 700, cursor: 'pointer',
                        transition: 'all 0.18s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(46,204,113,0.16)'; e.currentTarget.style.borderColor = 'rgba(46,204,113,0.6)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(46,204,113,0.08)'; e.currentTarget.style.borderColor = 'rgba(46,204,113,0.35)'; }}
                    >{labels.mercy}</button>
                  </div>
                </div>
              ) : (
                <div>
                  {/* Reveal */}
                  <div style={{
                    background: isCorrect ? 'rgba(46,204,113,0.08)' : 'rgba(231,76,60,0.08)',
                    border: `1px solid ${isCorrect ? 'rgba(46,204,113,0.30)' : 'rgba(231,76,60,0.30)'}`,
                    borderRadius: RADIUS.lg,
                    padding: '14px 16px',
                    marginBottom: '14px',
                  }}>
                    <p style={{
                      color: isCorrect ? '#2ecc71' : '#e74c3c',
                      fontSize: '0.75rem', fontFamily: 'Inter, sans-serif',
                      fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase',
                      marginBottom: '8px',
                    }}>{isCorrect ? labels.correct : labels.wrong}</p>
                    <p style={{ color: COLORS.offWhite, fontSize: '0.9rem', fontFamily: 'Inter, sans-serif', lineHeight: 1.6 }}>
                      {language === 'tr' ? item.revealTr : item.revealEn}
                    </p>
                  </div>

                  {/* Next */}
                  {!isLast && (
                    <button
                      onClick={nextQuestion}
                      style={{
                        background: 'rgba(212,165,116,0.10)',
                        border: '1px solid rgba(212,165,116,0.35)',
                        borderRadius: RADIUS.pillSm, padding: '8px 18px',
                        color: COLORS.gold,
                        fontSize: '0.82rem', fontFamily: 'Inter, sans-serif', fontWeight: 600,
                        cursor: 'pointer', transition: 'all 0.18s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = COLORS.goldAlpha20; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(212,165,116,0.10)'; }}
                    >
                      {idx + 1} / {items.length} →
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          ) : (
            // Completion screen
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              style={{ textAlign: 'center', padding: '20px 0' }}
            >
              {(() => {
                const perfect = score === items.length;
                const accent = perfect ? COLORS.softEmerald : COLORS.gold;
                const closingText = perfect
                  ? (language === 'tr' ? labels.perfectClosingTr : labels.perfectClosingEn)
                  : (language === 'tr' ? labels.partialClosingTr : labels.partialClosingEn);
                return (
                  <>
                    <p style={{
                      color: accent, fontSize: '0.7rem', fontFamily: 'Inter, sans-serif',
                      fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase',
                      marginBottom: '10px',
                    }}>{labels.completeLabel}</p>

                    {/* Score number with spring scale + glow on perfect */}
                    <motion.p
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 220, damping: 14, delay: 0.1 }}
                      style={{
                        color: COLORS.offWhite,
                        fontSize: 'clamp(2rem, 5vw, 3rem)',
                        fontFamily: FONTS.display,
                        fontWeight: 800,
                        marginBottom: '14px',
                        textShadow: perfect
                          ? `0 0 24px ${COLORS.softEmerald}55, 0 0 48px ${COLORS.softEmerald}33`
                          : 'none',
                        transition: 'text-shadow 0.4s',
                      }}
                    >
                      <span style={{ color: accent }}>{score}</span>{' '}
                      <span style={{ color: COLORS.silver, fontSize: '0.5em' }}>/ {items.length}</span>
                    </motion.p>

                    {/* Closing celebration / partial message */}
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, delay: 0.35 }}
                      style={{
                        margin: '0 auto 18px',
                        maxWidth: '36rem',
                        background: perfect
                          ? `linear-gradient(135deg, ${COLORS.softEmerald}14, ${COLORS.softEmerald}06)`
                          : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${perfect ? COLORS.softEmerald + '40' : 'rgba(255,255,255,0.10)'}`,
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        borderRadius: RADIUS.lg,
                        padding: 'clamp(14px, 2.4vw, 18px) clamp(16px, 3vw, 22px)',
                        boxShadow: perfect ? `0 0 32px ${COLORS.softEmerald}1a` : 'none',
                      }}
                    >
                      <p style={{
                        color: perfect ? COLORS.gold : COLORS.silver,
                        fontSize: 'clamp(0.92rem, 1.6vw, 1.02rem)',
                        fontFamily: FONTS.body,
                        fontStyle: 'italic',
                        lineHeight: 1.65,
                        margin: 0,
                      }}>
                        {closingText}
                      </p>
                    </motion.div>

                    <button
                      onClick={reset}
                      style={{
                        background: 'rgba(212,165,116,0.10)',
                        border: '1px solid rgba(212,165,116,0.35)',
                        borderRadius: RADIUS.pillSm, padding: '8px 18px',
                        color: COLORS.gold,
                        fontSize: '0.82rem', fontFamily: 'Inter, sans-serif', fontWeight: 600,
                        cursor: 'pointer', transition: 'all 0.18s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = COLORS.goldAlpha20; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(212,165,116,0.10)'; }}
                    >↻ {labels.resetLabel}</button>
                  </>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
//  Classical Source: Bâkıllânî alıntı
// ─────────────────────────────────────────────────────────────
function ClassicalSource({ t, language }) {
  const data = t('soundArchitecture.classicalSource');
  return (
    <motion.div variants={fadeUpItem} className="mb-10">
      <div style={{
        background: 'linear-gradient(135deg, rgba(212,165,116,0.06), rgba(212,165,116,0.02))',
        border: '1px solid rgba(212,165,116,0.30)',
        borderRadius: RADIUS.xl,
        padding: 'clamp(20px, 3vw, 28px)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative quote mark */}
        <div style={{
          position: 'absolute', top: '8px', right: '20px',
          fontSize: '5rem', fontFamily: FONTS.display,
          color: COLORS.goldAlpha15, lineHeight: 1, fontWeight: 900,
          pointerEvents: 'none',
        }}>"</div>

        <p style={{
          color: COLORS.gold, fontSize: '0.65rem', fontFamily: 'Inter, sans-serif',
          fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase',
          marginBottom: '14px', position: 'relative',
        }}>{data.title}</p>

        <p style={{
          color: COLORS.offWhite, fontSize: 'clamp(1.05rem, 2vw, 1.2rem)',
          fontFamily: FONTS.display, fontStyle: 'italic',
          lineHeight: 1.65, marginBottom: '16px',
          position: 'relative',
        }}>{language === 'tr' ? data.quoteTr : data.quoteEn}</p>

        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          paddingTop: '12px',
          borderTop: '1px solid rgba(212,165,116,0.18)',
          flexWrap: 'wrap',
        }}>
          <span style={{
            color: COLORS.gold, fontSize: '0.85rem', fontFamily: 'Inter, sans-serif',
            fontWeight: 700,
          }}>{language === 'tr' ? data.authorTr : data.authorEn}</span>
          <span style={{ color: COLORS.silver, fontSize: '0.7rem' }}>·</span>
          <span style={{
            color: COLORS.silver, fontSize: '0.85rem', fontFamily: 'Inter, sans-serif',
            fontStyle: 'italic',
          }}>{language === 'tr' ? data.workTr : data.workEn}</span>
        </div>

        <p style={{
          color: COLORS.silver, fontSize: '0.78rem', fontFamily: 'Inter, sans-serif',
          lineHeight: 1.65, marginTop: '12px',
        }}>{language === 'tr' ? data.noteTr : data.noteEn}</p>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
//  Main Section
// ─────────────────────────────────────────────────────────────
export default function SoundArchitecture() {
  const { t, language } = useLanguage();
  const [activeSura, setActiveSura] = useState(null);
  const [playing, setPlaying] = useState(null);
  const [failedSura, setFailedSura] = useState(null);
  const [infoOpen, setInfoOpen] = useState(false);
  const [hoveredLetter, setHoveredLetter] = useState(null);
  const audioRef = useRef(null);
  const liveIdRef = useRef(null);

  const stopAudio = () => {
    liveIdRef.current = null;
    if (audioRef.current) {
      audioRef.current.onerror = null;
      audioRef.current.onended = null;
      audioRef.current.pause();
      audioRef.current = null;
    }
    setPlaying(null);
  };

  const playWithFallback = (sura, urlIdx, urls) => {
    if (liveIdRef.current !== sura.id) return;
    if (urlIdx >= urls.length) {
      setFailedSura(sura.id);
      setPlaying(null);
      return;
    }
    const audio = new Audio(urls[urlIdx]);
    audioRef.current = audio;
    audio.onended = () => {
      if (liveIdRef.current === sura.id) setPlaying(null);
    };
    audio.onerror = () => {
      if (audioRef.current !== audio) return;
      audio.onerror = null;
      playWithFallback(sura, urlIdx + 1, urls);
    };
    audio.play()
      .then(() => { if (liveIdRef.current === sura.id) setPlaying(sura.id); })
      .catch(err => {
        if (err?.name === 'AbortError') return;
        if (audioRef.current !== audio) return;
        playWithFallback(sura, urlIdx + 1, urls);
      });
  };

  // #197 (2026-07-19) — audioKey artık string veya string[] olabilir.
  // Array durumunda ayet-ayet zincirleme çalınır (55:1-2 gibi çift-ayet
  // kartlarda ekranda gösterilen tüm metin duyulsun).
  const startPlay = (sura) => {
    stopAudio();
    setFailedSura(null);
    liveIdRef.current = sura.id;
    setPlaying(sura.id);
    const keys = Array.isArray(sura.audioKey) ? sura.audioKey : [sura.audioKey];
    let keyIdx = 0;
    const playNextKey = () => {
      if (liveIdRef.current !== sura.id) return;
      if (keyIdx >= keys.length) {
        if (liveIdRef.current === sura.id) setPlaying(null);
        return;
      }
      const { surah, ayah } = parseAudioKey(keys[keyIdx]);
      const urls = buildFallbackUrls(surah, ayah);
      keyIdx += 1;
      playWithFallbackChained(sura, 0, urls, playNextKey);
    };
    playNextKey();
  };

  // Fallback URL zinciri boyunca dener; audio bittiğinde onDone çağırır
  // (klasik playWithFallback zincir sonunda direkt setPlaying(null) yapar;
  // chained versiyon bunun yerine sonraki ayete geçmek için onDone kullanır).
  const playWithFallbackChained = (sura, urlIdx, urls, onDone) => {
    if (liveIdRef.current !== sura.id) return;
    if (urlIdx >= urls.length) {
      setFailedSura(sura.id);
      setPlaying(null);
      return;
    }
    const audio = new Audio(urls[urlIdx]);
    audioRef.current = audio;
    audio.onended = () => {
      if (liveIdRef.current === sura.id) onDone();
    };
    audio.onerror = () => {
      if (audioRef.current !== audio) return;
      audio.onerror = null;
      playWithFallbackChained(sura, urlIdx + 1, urls, onDone);
    };
    audio.play().catch(err => {
      if (err?.name === 'AbortError') return;
      if (audioRef.current !== audio) return;
      playWithFallbackChained(sura, urlIdx + 1, urls, onDone);
    });
  };

  const selectSura = (sura) => {
    if (activeSura?.id === sura.id) {
      stopAudio();
      setActiveSura(null);
      setFailedSura(null);
      return;
    }
    stopAudio();
    setActiveSura(sura);
    setFailedSura(null);
    startPlay(sura);
  };

  const togglePlay = (sura) => {
    if (playing === sura.id) {
      stopAudio();
    } else {
      startPlay(sura);
    }
  };

  return (
    <SectionWrapper id="sounds" dark={false}>
      {/* Badge */}
      <motion.div variants={fadeUpItem}>
        <span className="text-gold/60 text-xs font-body uppercase tracking-[0.3em]">
          {t('soundArchitecture.badge')}
        </span>
      </motion.div>

      {/* Title — Hero/Discovery parity. */}
      <motion.h2
        variants={fadeUpItem}
        style={{
          fontFamily: FONTS.display,
          fontSize: 'clamp(1.8rem, 4vw, 2.75rem)',
          fontWeight: 700,
          color: COLORS.offWhite,
          marginTop: '12px',
          marginBottom: '12px',
          maxWidth: '60ch',
          lineHeight: 1.15,
          letterSpacing: '-0.01em',
        }}
      >
        {t('soundArchitecture.title')}
      </motion.h2>

      {/* Intro — Hero baseline imzası. */}
      <motion.p
        variants={fadeUpItem}
        className="max-w-3xl mb-10"
        style={{
          fontFamily: FONTS.body,
          color: COLORS.offWhiteAlpha78,
          fontSize: 'clamp(0.95rem, 1.6vw, 1.0625rem)',
          lineHeight: 1.7,
          letterSpacing: '0.01em',
        }}
      >
        {withArabic(t('soundArchitecture.intro'), { color: COLORS.gold, size: '1.25em' })}
      </motion.p>

      {/* ── 1. Comparison Card (Azap vs Rahmet) ── */}
      <ComparisonCard t={t} language={language} />

      {/* ── 2. Four Sura Tabs ── */}
      <motion.div variants={fadeUpItem} className="mb-4">
        <p className="text-silver/60 text-xs font-body mb-4 uppercase tracking-widest">
          {language === 'tr' ? 'Bir sûre seçin — ayeti duyun' : 'Select a surah — hear the verse'}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {SURAS.map(sura => {
            const isActive = activeSura?.id === sura.id;
            return (
              <button
                key={sura.id}
                onClick={() => selectSura(sura)}
                style={{
                  background: isActive ? sura.glow : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${isActive ? sura.border : COLORS.glassBgStrong}`,
                  borderRadius: RADIUS.chip,
                  padding: '14px 12px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: `all ${TRANSITION.base}`,
                  outline: 'none',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.borderColor = sura.border; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.borderColor = COLORS.glassBgStrong; }}
              >
                <p style={{ color: sura.color, fontSize: '0.65rem', fontFamily: 'Inter, sans-serif', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>
                  {language === 'tr' ? sura.numTr : sura.numEn}
                </p>
                <p style={{ color: isActive ? COLORS.offWhite : COLORS.silver, fontSize: '0.95rem', fontFamily: FONTS.display, fontWeight: 700, marginBottom: '4px' }}>
                  {language === 'tr' ? sura.labelTr : sura.labelEn}
                </p>
                <p style={{ color: isActive ? sura.color : COLORS.slate500, fontSize: '0.7rem', fontFamily: 'Inter, sans-serif' }}>
                  {language === 'tr' ? sura.themeTr : sura.themeEn}
                </p>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* ── Active Sura Panel ── */}
      {activeSura && (
        <motion.div
          key={activeSura.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          style={{
            background: activeSura.glow,
            border: `1px solid ${activeSura.border}`,
            borderRadius: RADIUS.xl,
            padding: '24px',
            marginBottom: '28px',
          }}
        >
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {/* Verse display */}
            <div className="flex-1" style={{ minWidth: 0, width: '100%' }}>
              <div lang="ar" dir="rtl" style={{ width: '100%', textAlign: 'right' }}>
                <p
                  lang="ar" dir="rtl"
                  style={{
                    fontFamily: FONTS.quran,
                    fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
                    lineHeight: 1.6,
                    marginBottom: '6px',
                    textAlign: 'right',
                    direction: 'rtl',
                    wordBreak: 'keep-all',
                  }}
                >
                  {[...activeSura.verse].map((ch, ci) => {
                    const baseChar = ch.replace(/[\u064B-\u065F\u0670]/g, '');
                    const isHarsh = activeSura.harshLetters.includes(baseChar);
                    const isSoft = activeSura.softLetters.includes(baseChar);
                    const isHighlighted = hoveredLetter && baseChar === hoveredLetter;
                    const color = isHighlighted
                      ? (isHarsh ? '#ff6b6b' : isSoft ? '#69db7c' : activeSura.color)
                      : activeSura.color;
                    return (
                      <span key={ci} style={{
                        color,
                        textShadow: isHighlighted ? `0 0 12px ${color}` : 'none',
                        transition: 'color 0.15s, text-shadow 0.15s',
                      }}>{ch}</span>
                    );
                  })}
                </p>
                <p style={{ color: SEMANTIC.textFaint, fontSize: '0.75rem', fontFamily: 'Inter, sans-serif', textAlign: 'right', direction: 'ltr' }}>
                  {language === 'tr' ? activeSura.numTr : activeSura.numEn} · {activeSura.verseRef}
                </p>
              </div>
            </div>

            {/* Consonant breakdown + bar */}
            <div style={{ minWidth: '200px' }}>
              {/* Harsh letters */}
              <div style={{ marginBottom: '10px' }}>
                <p style={{ color: '#e74c3c', fontSize: '0.65rem', fontFamily: 'Inter, sans-serif', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>
                  {language === 'tr' ? 'Sert ünsüzler' : 'Hard consonants'}
                </p>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {activeSura.harshLetters.map(l => (
                    <span key={l}
                      onMouseEnter={() => setHoveredLetter(l)}
                      onMouseLeave={() => setHoveredLetter(null)}
                      style={{
                        background: hoveredLetter === l ? 'rgba(231,76,60,0.3)' : 'rgba(231,76,60,0.15)',
                        border: `1px solid ${hoveredLetter === l ? 'rgba(255,107,107,0.7)' : 'rgba(231,76,60,0.4)'}`,
                        borderRadius: RADIUS.sm,
                        padding: '2px 10px',
                        fontFamily: FONTS.quran,
                        fontSize: '1.2rem',
                        color: hoveredLetter === l ? '#ff6b6b' : '#e74c3c',
                        lineHeight: 1.8,
                        cursor: 'pointer',
                        transition: `all ${TRANSITION.fast}`,
                        boxShadow: hoveredLetter === l ? '0 0 10px rgba(231,76,60,0.3)' : 'none',
                      }}>{l}</span>
                  ))}
                </div>
              </div>

              {/* Soft letters */}
              <div style={{ marginBottom: '14px' }}>
                <p style={{ color: '#2ecc71', fontSize: '0.65rem', fontFamily: 'Inter, sans-serif', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>
                  {language === 'tr' ? 'Yumuşak sesler' : 'Soft sounds'}
                </p>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {activeSura.softLetters.map(l => (
                    <span key={l}
                      onMouseEnter={() => setHoveredLetter(l)}
                      onMouseLeave={() => setHoveredLetter(null)}
                      style={{
                        background: hoveredLetter === l ? 'rgba(46,204,113,0.25)' : 'rgba(46,204,113,0.12)',
                        border: `1px solid ${hoveredLetter === l ? 'rgba(105,219,124,0.7)' : 'rgba(46,204,113,0.35)'}`,
                        borderRadius: RADIUS.sm,
                        padding: '2px 10px',
                        fontFamily: FONTS.quran,
                        fontSize: '1.2rem',
                        color: hoveredLetter === l ? '#69db7c' : '#2ecc71',
                        lineHeight: 1.8,
                        cursor: 'pointer',
                        transition: `all ${TRANSITION.fast}`,
                        boxShadow: hoveredLetter === l ? '0 0 10px rgba(46,204,113,0.3)' : 'none',
                      }}>{l}</span>
                  ))}
                </div>
              </div>

              {/* Qualitative bar + ℹ */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                  <span style={{ color: COLORS.silver, fontSize: '0.65rem', fontFamily: 'Inter, sans-serif' }}>
                    {language === 'tr' ? 'Fonetik ağırlık' : 'Phonetic weight'}
                  </span>
                  <div className="relative">
                    <button
                      onClick={() => setInfoOpen(v => !v)}
                      style={{ color: COLORS.gold, fontSize: '0.9rem', background: 'none', border: 'none', cursor: 'pointer', lineHeight: 1 }}
                      aria-label="Metodoloji"
                    >ⓘ</button>
                    {infoOpen && (
                      <div style={{
                        position: 'absolute', right: 0, top: '20px', zIndex: 20,
                        background: '#1a2a3a', border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: RADIUS.md, padding: '10px', width: '210px',
                        fontSize: '0.7rem', color: COLORS.silver, fontFamily: 'Inter, sans-serif', lineHeight: 1.6,
                      }}>
                        {language === 'tr'
                          ? 'Bu gösterim sûrenin fonetik dokusunu sezgisel olarak temsil eder; kesin bir dilbilimsel ölçüm değil, işitsel bir rehberdir. Sert: ق ك ط ت د ض ص ب خ غ — Yumuşak: م ن ل ر و ي ه ح ف'
                          : 'This bar illustrates the phonetic texture intuitively — not a precise linguistic measurement, but an auditory guide. Hard: ق ك ط ت د ض ص ب خ غ — Soft: م ن ل ر و ي ه ح ف'}
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.07)', borderRadius: '3px', overflow: 'hidden' }}>
                  <motion.div
                    style={{ height: '100%', background: activeSura.color, borderRadius: '3px' }}
                    initial={{ width: 0 }}
                    animate={{ width: `${calcHardnessScore(activeSura.verse)}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                  <span style={{ color: SEMANTIC.textFaint, fontSize: '0.6rem', fontFamily: 'Inter, sans-serif' }}>
                    {language === 'tr' ? 'Hafif' : 'Light'}
                  </span>
                  <span style={{ color: SEMANTIC.textFaint, fontSize: '0.6rem', fontFamily: 'Inter, sans-serif' }}>
                    {language === 'tr' ? 'Ağır' : 'Heavy'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Description + play */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', marginTop: '18px', paddingTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <p style={{ color: COLORS.silver, fontSize: '0.85rem', fontFamily: 'Inter, sans-serif', lineHeight: 1.6, flex: 1 }}>
              {language === 'tr' ? activeSura.descTr : activeSura.descEn}
            </p>
            {(() => {
              const isFailed = failedSura === activeSura.id;
              const isPlaying = playing === activeSura.id;
              return (
                <button
                  onClick={() => !isFailed && togglePlay(activeSura)}
                  disabled={isFailed}
                  title={isFailed ? (language === 'tr' ? 'Ses yüklenemedi' : 'Audio unavailable') : undefined}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    background: isFailed ? 'rgba(100,116,139,0.08)' : isPlaying ? `${activeSura.color}22` : COLORS.glassBg,
                    border: `1px solid ${isFailed ? 'rgba(100,116,139,0.2)' : isPlaying ? activeSura.border : COLORS.glassBorder}`,
                    borderRadius: RADIUS.pillSm, padding: '6px 14px',
                    color: isFailed ? COLORS.slate600 : activeSura.color,
                    fontSize: '0.75rem', fontFamily: 'Inter, sans-serif',
                    cursor: isFailed ? 'not-allowed' : 'pointer',
                    opacity: isFailed ? 0.5 : 1,
                    transition: 'all 0.18s', flexShrink: 0,
                  }}
                >
                  {isPlaying ? <PauseIcon size={12} /> : <PlayIcon size={12} />}
                  <span>{language === 'tr' ? 'Dinle' : 'Listen'}</span>
                </button>
              );
            })()}
          </div>

          {/* Read full sura link — under description, subtle */}
          {(() => {
            const firstKey = Array.isArray(activeSura.audioKey) ? activeSura.audioKey[0] : activeSura.audioKey;
            const surahNum = parseAudioKey(firstKey).surah;
            const sName = language === 'tr' ? activeSura.labelTr : activeSura.labelEn;
            return (
              <div style={{ marginTop: '12px', textAlign: 'right' }}>
                <Link
                  href={`/${language}/oku/${surahNum}`}
                  style={{
                    fontSize: '0.72rem',
                    color: activeSura.color,
                    opacity: 0.75,
                    textDecoration: 'none',
                    fontFamily: 'Inter, sans-serif',
                    letterSpacing: '0.04em',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = 1; }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = 0.75; }}
                >
                  {language === 'tr' ? `${sName} sûresinin tamamını oku` : `Read the full ${sName} sura`} →
                </Link>
              </div>
            );
          })()}
        </motion.div>
      )}

      {/* ── 3. Phonetics Bridge Card ── */}
      <motion.div
        variants={fadeUpItem}
        className="glass-card-strong p-6 md:p-8 mb-12 border-l-4 border-gold"
      >
        <h3 className="font-display text-lg font-bold text-gold mb-3">
          {t('soundArchitecture.phonetics.title')}
        </h3>
        <p className="text-silver text-base leading-relaxed font-body">
          {withArabic(t('soundArchitecture.phonetics.description'), { color: COLORS.gold, size: '1.2em' })}
        </p>
      </motion.div>

      {/* ── 4. Tajwid Panel ── */}
      <TajwidPanel t={t} language={language} />

      {/* ── 5. Discovery Widget — Tahmin Et ── */}
      <DiscoveryWidget t={t} language={language} />

      {/* ── 6. Classical Source — Bâkıllânî ── */}
      <ClassicalSource t={t} language={language} />

      {/* Closing */}
      <motion.div
        variants={fadeUpItem}
        className="glass-card p-8 md:p-10 text-center"
        style={{ borderTop: '2px solid rgba(212,165,116,0.25)', borderBottom: '2px solid rgba(212,165,116,0.25)', borderLeft: 'none', borderRight: 'none', borderRadius: 0, background: COLORS.goldAlpha04 }}
      >
        <p className="text-2xl md:text-4xl font-display font-bold leading-snug" style={{ color: COLORS.gold }}>
          {t('soundArchitecture.closing')}
        </p>
      </motion.div>

      {/* ── Cross-tool CTA strip ─────────────────────────────────────────── */}
      <motion.div variants={fadeUpItem} className="mt-12">
        <div className="text-center mb-5">
          <span
            className="font-body uppercase tracking-[0.24em] text-xs"
            style={{ color: COLORS.gold, opacity: 0.75 }}
          >
            {language === 'tr' ? 'Daha Derine — İlgili Sûreler' : 'Go Deeper — Related Suras'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              href: `/${language}/oku/55`,
              titleTr: 'Rahmân Sûresi (55)',
              titleEn: 'Sura Ar-Raḥmān (55)',
              descTr: 'ر، ح، م، ن seslerinin nimet ritmini tüm sûrede izleyin.',
              descEn: 'Follow the merciful rhythm of ر، ح، م، ن sounds through the entire sura.',
            },
            {
              href: `/${language}/oku/101`,
              titleTr: 'Kâria Sûresi (101)',
              titleEn: "Sura Al-Qāriʿa (101)",
              descTr: 'Kıyametin patlayıcı ق ve tınlayan ر sesini tam metinde dinleyin.',
              descEn: 'Hear the apocalyptic explosive ق and rolling ر in full context.',
            },
            {
              href: `/${language}/oku/19`,
              titleTr: 'Meryem Sûresi (19)',
              titleEn: 'Sura Maryam (19)',
              descTr: 'Nazal ح، ن، م rahmet seslerinin uzun anlatımdaki örgüsü.',
              descEn: 'The weave of nasal ح، ن، م mercy-sounds across the long narrative.',
            },
          ].map((tt, i) => (
            <motion.div
              key={tt.href}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link
                href={tt.href}
                className="block rounded-xl p-5 h-full transition-all hover:-translate-y-0.5"
                style={{
                  background: `linear-gradient(180deg, ${COLORS.gold}0c 0%, rgba(255,255,255,0.02) 100%)`,
                  border: `1px solid ${COLORS.gold}33`,
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `linear-gradient(180deg, ${COLORS.gold}1a 0%, rgba(255,255,255,0.04) 100%)`;
                  e.currentTarget.style.borderColor = `${COLORS.gold}66`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = `linear-gradient(180deg, ${COLORS.gold}0c 0%, rgba(255,255,255,0.02) 100%)`;
                  e.currentTarget.style.borderColor = `${COLORS.gold}33`;
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-body font-bold text-base" style={{ color: COLORS.gold, margin: 0 }}>
                    {language === 'tr' ? tt.titleTr : tt.titleEn}
                  </h4>
                  <span style={{ color: COLORS.gold, opacity: 0.75 }}>→</span>
                </div>
                <p className="font-body text-sm leading-relaxed" style={{ color: COLORS.silver, margin: 0 }}>
                  {language === 'tr' ? tt.descTr : tt.descEn}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
