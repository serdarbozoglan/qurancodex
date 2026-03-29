import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import SectionWrapper, { fadeUpItem } from '../components/SectionWrapper';
import { buildFallbackUrls } from '../hooks/useAudioWithFallback';

// Splits text at Arabic character sequences and wraps them with styled spans.
// Keeps spaces between Arabic letters/punctuation so "ق، ك، ط" stays one span.
function withArabic(text, { color = '#d4a574', size = '1.15em', weight = 700 } = {}) {
  const parts = text.split(/((?:[\u0600-\u06FF،؛؟]+\s*)+)/g);
  return parts.map((part, i) =>
    /[\u0600-\u06FF]/.test(part)
      ? (
        <span key={i} dir="rtl" lang="ar" style={{
          fontFamily: "'KFGQPC', 'Amiri Quran', serif",
          fontSize: size, color, fontWeight: weight,
          display: 'inline', lineHeight: 1.4,
        }}>{part.trim().replace(/[،؛]/g, ' ').trim()}</span>
      )
      : part
  );
}

const PlayIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21" /></svg>
);
const PauseIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="3" width="4" height="18" rx="1"/><rect x="15" y="3" width="4" height="18" rx="1"/></svg>
);

const SURAS = [
  {
    id: 'muddaththir',
    labelTr: 'Müddessir', labelEn: 'Al-Muddaththir',
    numTr: '74. Sure', numEn: 'Surah 74',
    themeTr: 'Azap · Uyarı', themeEn: 'Punishment · Warning',
    color: '#e74c3c', glow: 'rgba(231,76,60,0.12)', border: 'rgba(231,76,60,0.35)',
    verse: 'سَأُصْلِيهِ سَقَرَ',
    verseRef: '74:26',
    harshLetters: ['ص', 'ق'],
    softLetters: ['ل', 'ي', 'ه', 'ر'],
    descTr: 'Tek cümlede iki kez ق: azabın darbesi sesin içinde yankılanır.',
    descEn: 'ق strikes twice in a single breath — the punishment is in the phonetics.',
    barValue: 62,
    audioKey: '074026',
  },
  {
    id: 'maryam',
    labelTr: 'Meryem', labelEn: 'Maryam',
    numTr: '19. Sure', numEn: 'Surah 19',
    themeTr: 'Rahmet · Huzur', themeEn: 'Mercy · Peace',
    color: '#3498db', glow: 'rgba(52,152,219,0.12)', border: 'rgba(52,152,219,0.35)',
    verse: 'وَحَنَانًا مِّن لَّدُنَّا',
    verseRef: '19:13',
    harshLetters: ['د'],
    softLetters: ['و', 'ح', 'ن', 'م', 'ل'],
    descTr: 'ح، ن، م — nazal ve sürtünmeli sesler rahmetin yumuşaklığını taşır.',
    descEn: 'ح، ن، م — nasal and fricative consonants carry the tenderness of mercy.',
    barValue: 26,
    audioKey: '019013',
  },
  {
    id: 'qaria',
    labelTr: 'Kâria', labelEn: "Al-Qari'a",
    numTr: '101. Sure', numEn: 'Surah 101',
    themeTr: 'Kıyamet · Çarpış', themeEn: 'Apocalypse · Strike',
    color: '#e67e22', glow: 'rgba(230,126,34,0.12)', border: 'rgba(230,126,34,0.35)',
    verse: 'الْقَارِعَةُ',
    verseRef: '101:1',
    harshLetters: ['ق', 'ر'],
    softLetters: ['ع'],
    descTr: 'Sure adı tek başına: patlayıcı ق ve tınlayan ر kıyametin sesini taşır.',
    descEn: 'The name alone: explosive ق and rolling ر enact the cosmic strike.',
    barValue: 60,
    audioKey: '101001',
  },
  {
    id: 'rahman',
    labelTr: 'Rahmân', labelEn: 'Ar-Rahman',
    numTr: '55. Sure', numEn: 'Surah 55',
    themeTr: 'Nimet · Güzellik', themeEn: 'Blessing · Beauty',
    color: '#2ecc71', glow: 'rgba(46,204,113,0.12)', border: 'rgba(46,204,113,0.35)',
    verse: 'الرَّحْمَٰنُ عَلَّمَ الْقُرْآنَ',
    verseRef: '55:1-2',
    harshLetters: ['ق'],
    softLetters: ['ر', 'ح', 'م', 'ن', 'ل'],
    descTr: 'ر، ح، م، ن — dört yumuşak ses, dört nimetin müziği.',
    descEn: 'ر، ح، م، ن — four flowing sounds for four opening blessings.',
    barValue: 20,
    audioKey: '055001',
  },
];

// Parse audioKey (e.g. '074026') → { surah: 74, ayah: 26 }
function parseAudioKey(key) {
  return { surah: parseInt(key.slice(0, 3), 10), ayah: parseInt(key.slice(3), 10) };
}

export default function SoundArchitecture() {
  const { t, language } = useLanguage();
  const [activeSura, setActiveSura] = useState(null);
  const [playing, setPlaying] = useState(null);
  const [failedSura, setFailedSura] = useState(null);
  const [infoOpen, setInfoOpen] = useState(false);
  const audioRef = useRef(null);
  const liveIdRef = useRef(null); // tracks which sura's playback is active

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

  const startPlay = (sura) => {
    stopAudio();
    setFailedSura(null);
    const { surah, ayah } = parseAudioKey(sura.audioKey);
    const urls = buildFallbackUrls(surah, ayah);
    liveIdRef.current = sura.id;
    setPlaying(sura.id);
    playWithFallback(sura, 0, urls);
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

      {/* Title */}
      <motion.h2
        variants={fadeUpItem}
        className="font-display text-3xl md:text-5xl font-bold text-off-white mt-4 mb-8"
      >
        {t('soundArchitecture.title')}
      </motion.h2>

      {/* Intro */}
      <motion.p
        variants={fadeUpItem}
        className="text-silver text-lg leading-relaxed max-w-3xl mb-10"
      >
        {withArabic(t('soundArchitecture.intro'), { color: '#d4a574', size: '1.25em' })}
      </motion.p>

      {/* ── Four Sura Tabs ── */}
      <motion.div variants={fadeUpItem} className="mb-4">
        <p className="text-silver/60 text-xs font-body mb-4 uppercase tracking-widest">
          {language === 'tr' ? 'Bir sure seçin — ayeti duyun' : 'Select a surah — hear the verse'}
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
                  border: `1px solid ${isActive ? sura.border : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: '10px',
                  padding: '14px 12px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  outline: 'none',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.borderColor = sura.border; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
              >
                <p style={{ color: sura.color, fontSize: '0.65rem', fontFamily: 'Inter, sans-serif', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>
                  {language === 'tr' ? sura.numTr : sura.numEn}
                </p>
                <p style={{ color: isActive ? '#e8e6e3' : '#94a3b8', fontSize: '0.95rem', fontFamily: "'Playfair Display', serif", fontWeight: 700, marginBottom: '4px' }}>
                  {language === 'tr' ? sura.labelTr : sura.labelEn}
                </p>
                <p style={{ color: isActive ? sura.color : '#64748b', fontSize: '0.7rem', fontFamily: 'Inter, sans-serif' }}>
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
            borderRadius: '14px',
            padding: '24px',
            marginBottom: '28px',
          }}
        >
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {/* Verse display */}
            <div className="flex-1">
              <p
                dir="rtl"
                lang="ar"
                style={{
                  fontFamily: "'KFGQPC', 'Amiri Quran', serif",
                  fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
                  color: activeSura.color,
                  lineHeight: 1.6,
                  marginBottom: '6px',
                  textAlign: 'right',
                }}
              >
                {activeSura.verse}
              </p>
              <p style={{ color: '#64748b', fontSize: '0.75rem', fontFamily: 'Inter, sans-serif', textAlign: 'right' }}>
                {language === 'tr' ? activeSura.numTr : activeSura.numEn} · {activeSura.verseRef}
              </p>
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
                    <span key={l} style={{
                      background: 'rgba(231,76,60,0.15)',
                      border: '1px solid rgba(231,76,60,0.4)',
                      borderRadius: '6px',
                      padding: '2px 10px',
                      fontFamily: "'KFGQPC', 'Amiri Quran', serif",
                      fontSize: '1.2rem',
                      color: '#e74c3c',
                      lineHeight: 1.8,
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
                    <span key={l} style={{
                      background: 'rgba(46,204,113,0.12)',
                      border: '1px solid rgba(46,204,113,0.35)',
                      borderRadius: '6px',
                      padding: '2px 10px',
                      fontFamily: "'KFGQPC', 'Amiri Quran', serif",
                      fontSize: '1.2rem',
                      color: '#2ecc71',
                      lineHeight: 1.8,
                    }}>{l}</span>
                  ))}
                </div>
              </div>

              {/* Qualitative bar + ℹ */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                  <span style={{ color: '#94a3b8', fontSize: '0.65rem', fontFamily: 'Inter, sans-serif' }}>
                    {language === 'tr' ? 'Fonetik ağırlık' : 'Phonetic weight'}
                  </span>
                  <div className="relative">
                    <button
                      onClick={() => setInfoOpen(v => !v)}
                      style={{ color: '#d4a574', fontSize: '0.9rem', background: 'none', border: 'none', cursor: 'pointer', lineHeight: 1 }}
                      aria-label="Metodoloji"
                    >ⓘ</button>
                    {infoOpen && (
                      <div style={{
                        position: 'absolute', right: 0, top: '20px', zIndex: 20,
                        background: '#1a2a3a', border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px', padding: '10px', width: '210px',
                        fontSize: '0.7rem', color: '#94a3b8', fontFamily: 'Inter, sans-serif', lineHeight: 1.6,
                      }}>
                        {language === 'tr'
                          ? 'Bu gösterim surenin fonetik dokusunu sezgisel olarak temsil eder; kesin bir dilbilimsel ölçüm değil, işitsel bir rehberdir. Sert: ق ك ط ت د ض ص ب خ غ — Yumuşak: م ن ل ر و ي ه ح ف'
                          : 'This bar illustrates the phonetic texture intuitively — not a precise linguistic measurement, but an auditory guide. Hard: ق ك ط ت د ض ص ب خ غ — Soft: م ن ل ر و ي ه ح ف'}
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.07)', borderRadius: '3px', overflow: 'hidden' }}>
                  <motion.div
                    style={{ height: '100%', background: activeSura.color, borderRadius: '3px' }}
                    initial={{ width: 0 }}
                    animate={{ width: `${activeSura.barValue}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Description + play */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', marginTop: '18px', paddingTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', fontFamily: 'Inter, sans-serif', lineHeight: 1.6, flex: 1 }}>
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
                    background: isFailed ? 'rgba(100,116,139,0.08)' : isPlaying ? `${activeSura.color}22` : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${isFailed ? 'rgba(100,116,139,0.2)' : isPlaying ? activeSura.border : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: '20px', padding: '6px 14px',
                    color: isFailed ? '#475569' : activeSura.color,
                    fontSize: '0.75rem', fontFamily: 'Inter, sans-serif',
                    cursor: isFailed ? 'not-allowed' : 'pointer',
                    opacity: isFailed ? 0.5 : 1,
                    transition: 'all 0.18s', flexShrink: 0,
                  }}
                >
                  {isPlaying ? <PauseIcon /> : <PlayIcon />}
                  <span>{language === 'tr' ? 'Dinle' : 'Listen'}</span>
                </button>
              );
            })()}
          </div>
        </motion.div>
      )}

      {/* ── Linguistics note (replaces neuroscience) ── */}
      <motion.div
        variants={fadeUpItem}
        className="glass-card-strong p-6 md:p-8 mb-8 border-l-4 border-gold"
      >
        <h3 className="font-display text-lg font-bold text-gold mb-3">
          {t('soundArchitecture.phonetics.title')}
        </h3>
        <p className="text-silver text-base leading-relaxed font-body">
          {withArabic(t('soundArchitecture.phonetics.description'), { color: '#d4a574', size: '1.2em' })}
        </p>
      </motion.div>

      {/* Closing */}
      <motion.p
        variants={fadeUpItem}
        className="text-off-white text-xl md:text-2xl font-display font-bold text-center leading-relaxed"
      >
        {t('soundArchitecture.closing')}
      </motion.p>
    </SectionWrapper>
  );
}
