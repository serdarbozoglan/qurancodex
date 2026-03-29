import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import SectionWrapper, { fadeUpItem } from '../components/SectionWrapper';
import { buildFallbackUrls } from '../hooks/useAudioWithFallback';

const PlayIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21" /></svg>
);
const PauseIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="3" width="4" height="18" rx="1"/><rect x="15" y="3" width="4" height="18" rx="1"/></svg>
);

const KAWTHAR_VERSES = [
  { ar: 'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ', num: '١' },
  { ar: 'فَصَلِّ لِرَبِّكَ وَانْحَرْ', num: '٢' },
  { ar: 'إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ', num: '٣' },
];

// Necm (53) — 62 ayet, fasıla ses haritası
// 'aa' = '-â' sesiyle biten (alif maqsura / alif)
// 'ot' = ara farklı ses
// 'mq' = maqta' kapanış bölümü (ayet 57-62)
const NAJM_FASILA = [
  'aa','aa','aa','aa','aa','aa','aa','aa','aa','aa', // 1-10
  'aa','aa','aa','aa','aa','aa','aa','aa','aa','aa', // 11-20
  'aa','aa','aa','aa','aa','aa','aa','ot','aa','ot', // 21-30
  'aa','aa','aa','aa','aa','aa','aa','aa','aa','aa', // 31-40
  'aa','aa','aa','aa','aa','aa','aa','aa','aa','aa', // 41-50
  'aa','aa','aa','aa','aa','aa','mq','mq','mq','mq', // 51-60
  'mq','mq',                                          // 61-62
];

// Son kelime (fasıla) her ayet için
const NAJM_WORDS = [
  'هَوَىٰ','غَوَىٰ','الْهَوَىٰ','يُوحَىٰ','الْقُوَىٰ','فَاسْتَوَىٰ','الْأَعْلَىٰ','فَتَدَلَّىٰ','أَدْنَىٰ','أَوْحَىٰ',
  'رَأَىٰ','يَرَىٰ','أُخْرَىٰ','الْمُنتَهَىٰ','الْمَأْوَىٰ','يَغْشَىٰ','طَغَىٰ','الْكُبْرَىٰ','الْعُزَّىٰ','الْأُخْرَىٰ',
  'الْأُنثَىٰ','ضِيزَىٰ','الْهُدَىٰ','تَمَنَّىٰ','الْأُولَىٰ','وَيَرْضَىٰ','الْأُنثَىٰ','شَيْئًا','تَوَلَّىٰ','بِالْمُهْتَدِينَ',
  'بِالْحُسْنَىٰ','اتَّقَىٰ','تَوَلَّىٰ','وَأَكْدَىٰ','يَرَىٰ','مُوسَىٰ','وَفَّىٰ','أُخْرَىٰ','سَعَىٰ','يُرَىٰ',
  'الْأَوْفَىٰ','الْمُنتَهَىٰ','وَأَبْكَىٰ','وَأَحْيَا','وَالْأُنثَىٰ','تُمْنَىٰ','الْأُخْرَىٰ','وَأَقْنَىٰ','الشِّعْرَىٰ','الْأُولَىٰ',
  'أَبْقَىٰ','وَأَطْغَىٰ','أَهْوَىٰ','غَشَّىٰ','تَتَمَارَىٰ','الْأُولَىٰ','الْآزِفَةُ','كَاشِفَةٌ','تَعْجَبُونَ','تَبْكُونَ',
  'سَامِدُونَ','وَاعْبُدُوا',
];

const FASILA_SURAS = [
  {
    labelTr: "Nebe' (78)",
    labelEn: "An-Naba' (78)",
    sound: '-ûn / -ân',
    color: '#3498db',
    glow: 'rgba(52,152,219,0.15)',
    border: 'rgba(52,152,219,0.3)',
    examples: ['مُخْتَلِفُونَ', 'سَيَعْلَمُونَ', 'كَذَّابًا'],
  },
  {
    labelTr: 'Mülk (67)',
    labelEn: 'Al-Mulk (67)',
    sound: '-îr',
    color: '#2ecc71',
    glow: 'rgba(46,204,113,0.15)',
    border: 'rgba(46,204,113,0.3)',
    examples: ['قَدِيرٌ', 'خَبِيرٌ', 'بَصِيرٌ'],
  },
  {
    labelTr: 'Duhâ (93)',
    labelEn: 'Ad-Duha (93)',
    sound: '-â',
    color: '#d4a574',
    glow: 'rgba(212,165,116,0.15)',
    border: 'rgba(212,165,116,0.3)',
    examples: ['وَالضُّحَىٰ', 'سَجَىٰ', 'قَلَىٰ'],
  },
];

export default function ImpossibleRhythm() {
  const { t, language } = useLanguage();
  const examples = t('impossibleRhythm.examples') || [];
  const [openTooltip, setOpenTooltip] = useState(null);
  const [discoveryStep, setDiscoveryStep] = useState(0);
  const [suiGenerisOpen, setSuiGenerisOpen] = useState(false);
  const [playingVerse, setPlayingVerse] = useState(null);
  const [failedVerses, setFailedVerses] = useState(new Set());
  const [duhaPlaying, setDuhaPlaying] = useState(false);
  const [duhaFailed, setDuhaFailed] = useState(false);
  const [kawtharPlaying, setKawtharPlaying] = useState(false);
  const [kawtharFailed, setKawtharFailed] = useState(false);
  const [selectedNajm, setSelectedNajm] = useState(null);
  const [failedNajm, setFailedNajm] = useState(new Set());
  const [najmInfoOpen, setNajmInfoOpen] = useState(false);
  const audioRef = useRef(null);
  const najmAudioRef = useRef(null);

  // Play a single ayah with full CDN fallback chain
  const playAyah = (surah, ayah, ref, urlIdx, onEnded, onFailed) => {
    const urls = urlIdx === 0 ? buildFallbackUrls(surah, ayah) : null;
    // urls passed via closure from outer call; we re-build only at urlIdx=0
    // Use a simpler inline approach:
    const allUrls = buildFallbackUrls(surah, ayah);
    const tryUrl = (i) => {
      if (i >= allUrls.length) { onFailed(); return; }
      const audio = new Audio(allUrls[i]);
      ref.current = audio;
      audio.onended = onEnded;
      audio.onerror = () => {
        if (ref.current !== audio) return;
        audio.onerror = null;
        tryUrl(i + 1);
      };
      audio.play().catch(err => {
        if (err?.name === 'AbortError') return;
        if (ref.current !== audio) return;
        tryUrl(i + 1);
      });
    };
    tryUrl(urlIdx);
  };

  // Play sequence of ayahs (surah, ayah 1..count) with fallback per ayah
  const playSequence = (surah, count, ref, liveRef, onDone) => {
    let ayah = 1;
    const next = () => {
      if (!liveRef.current || ayah > count) { if (liveRef.current) onDone(); return; }
      const a = ayah;
      playAyah(surah, a, ref, 0,
        () => { if (liveRef.current) { ayah++; next(); } },
        () => { if (liveRef.current) { ayah++; next(); } } // skip failed ayah, continue
      );
    };
    next();
  };

  const duhaLiveRef = useRef(false);
  const kawtharLiveRef = useRef(false);

  const toggleAudio = (verseIndex) => {
    if (playingVerse === verseIndex) {
      if (audioRef.current) { audioRef.current.onerror = null; audioRef.current.pause(); audioRef.current = null; }
      setPlayingVerse(null);
    } else {
      if (audioRef.current) { audioRef.current.onerror = null; audioRef.current.pause(); }
      duhaLiveRef.current = false;
      kawtharLiveRef.current = false;
      setDuhaPlaying(false);
      setKawtharPlaying(false);
      setPlayingVerse(verseIndex);
      playAyah(108, verseIndex + 1, audioRef, 0,
        () => setPlayingVerse(null),
        () => { setFailedVerses(prev => new Set([...prev, verseIndex])); setPlayingVerse(null); }
      );
    }
  };

  const toggleDuha = () => {
    if (duhaPlaying) {
      duhaLiveRef.current = false;
      if (audioRef.current) { audioRef.current.onerror = null; audioRef.current.pause(); audioRef.current = null; }
      setDuhaPlaying(false);
      return;
    }
    if (audioRef.current) { audioRef.current.onerror = null; audioRef.current.pause(); }
    setPlayingVerse(null);
    kawtharLiveRef.current = false;
    setKawtharPlaying(false);
    setDuhaFailed(false);
    duhaLiveRef.current = true;
    setDuhaPlaying(true);
    playSequence(93, 3, audioRef, duhaLiveRef, () => setDuhaPlaying(false));
  };

  const toggleKawthar = () => {
    if (kawtharPlaying) {
      kawtharLiveRef.current = false;
      if (audioRef.current) { audioRef.current.onerror = null; audioRef.current.pause(); audioRef.current = null; }
      setKawtharPlaying(false);
      return;
    }
    if (audioRef.current) { audioRef.current.onerror = null; audioRef.current.pause(); }
    setPlayingVerse(null);
    duhaLiveRef.current = false;
    setDuhaPlaying(false);
    setKawtharFailed(false);
    kawtharLiveRef.current = true;
    setKawtharPlaying(true);
    playSequence(108, 3, audioRef, kawtharLiveRef, () => setKawtharPlaying(false));
  };

  const handleNajmClick = (index) => {
    if (audioRef.current) { audioRef.current.onerror = null; audioRef.current.pause(); }
    duhaLiveRef.current = false;
    kawtharLiveRef.current = false;
    setPlayingVerse(null);
    setDuhaPlaying(false);
    setKawtharPlaying(false);

    if (selectedNajm === index) {
      if (najmAudioRef.current) { najmAudioRef.current.onerror = null; najmAudioRef.current.pause(); najmAudioRef.current = null; }
      setSelectedNajm(null);
      return;
    }

    if (najmAudioRef.current) { najmAudioRef.current.onerror = null; najmAudioRef.current.pause(); }
    setSelectedNajm(index);

    playAyah(53, index + 1, najmAudioRef, 0,
      () => { najmAudioRef.current = null; },
      () => { setFailedNajm(prev => new Set([...prev, index])); najmAudioRef.current = null; }
    );
  };

  return (
    <SectionWrapper id="rhythm" dark={true}>

      {/* Badge */}
      <motion.div variants={fadeUpItem}>
        <span className="text-gold/60 text-xs font-body uppercase tracking-[0.3em]">
          {t('impossibleRhythm.badge')}
        </span>
      </motion.div>

      {/* Title */}
      <motion.h2
        variants={fadeUpItem}
        className="font-display text-3xl md:text-5xl font-bold text-off-white mt-4 mb-8"
      >
        {t('impossibleRhythm.title')}
      </motion.h2>

      {/* Intro */}
      <motion.p
        variants={fadeUpItem}
        className="text-silver text-lg leading-relaxed max-w-3xl mb-10"
      >
        {(() => {
          const text = t('impossibleRhythm.intro');
          const idx = text.indexOf('sui generis');
          if (idx === -1) return text;
          return (
            <>
              {text.slice(0, idx)}
              <span style={{ color: '#d4a574', fontStyle: 'italic', fontWeight: 600 }}>sui generis</span>
              {text.slice(idx + 'sui generis'.length)}
            </>
          );
        })()}
      </motion.p>

      {/* ── İ'câz Callout ── */}
      <motion.div
        variants={fadeUpItem}
        className="mb-12 rounded-xl p-6 md:p-8"
        style={{
          background: 'rgba(212,165,116,0.06)',
          border: '1px solid rgba(212,165,116,0.25)',
          borderLeft: '4px solid rgba(212,165,116,0.7)',
        }}
      >
        <span className="text-gold/50 text-xs font-body uppercase tracking-[0.25em] block mb-3">
          {t('impossibleRhythm.ijaz.label')}
        </span>
        <p className="text-off-white text-lg md:text-xl leading-relaxed font-display italic">
          {t('impossibleRhythm.ijaz.text')}
        </p>
        <p className="text-silver/50 text-xs font-body mt-4 flex items-start gap-1.5">
          <span style={{ fontSize: '0.8rem', lineHeight: 1 }}>ℹ</span>
          <span>
            {language === 'tr'
              ? 'Bu değerlendirme Arap dili ve edebiyatı kriterlerine göre yapılmaktadır.'
              : 'This assessment is based on the criteria of classical Arabic language and literature.'}
          </span>
        </p>
      </motion.div>

      {/* ── Discovery Widget ── */}
      <motion.div variants={fadeUpItem} className="mb-12">
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(212,165,116,0.15)', background: 'rgba(255,255,255,0.02)' }}>

          {/* Verse display */}
          <div className="p-6 md:p-8 border-b border-white/5 text-center">
            <p className="text-gold/50 text-xs font-body uppercase tracking-[0.25em] mb-4">
              {language === 'tr' ? 'Aşağıdaki ayetleri inceleyin' : 'Examine the verses below'}
            </p>
            <p dir="rtl" style={{ fontFamily: "'KFGQPC', 'Amiri Quran', serif", fontSize: '1.6rem', lineHeight: 2.2, color: '#e8e6e3' }}>
              وَالضُّحَىٰ ﴿١﴾ وَاللَّيْلِ إِذَا سَجَىٰ ﴿٢﴾ مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ ﴿٣﴾
            </p>
            <div className="flex items-center justify-center gap-3 mt-3">
              <p className="text-silver/50 text-xs font-body">
                {language === 'tr' ? 'Duhâ Sûresi, 93:1–3' : 'Ad-Duha, 93:1–3'}
              </p>
              <button
                onClick={!duhaFailed ? toggleDuha : undefined}
                disabled={duhaFailed}
                style={{
                  width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                  background: duhaFailed ? 'rgba(100,116,139,0.08)' : duhaPlaying ? 'rgba(212,165,116,0.22)' : 'rgba(212,165,116,0.08)',
                  border: `1px solid ${duhaFailed ? 'rgba(100,116,139,0.2)' : duhaPlaying ? 'rgba(200,185,165,0.72)' : 'rgba(212,165,116,0.2)'}`,
                  color: duhaFailed ? '#475569' : '#d4a574',
                  cursor: duhaFailed ? 'not-allowed' : 'pointer',
                  opacity: duhaFailed ? 0.5 : 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.18s',
                }}
              >
                {duhaPlaying ? <PauseIcon /> : <PlayIcon />}
              </button>
            </div>
          </div>

          {/* Steps */}
          <div className="p-6 md:p-8">

            {/* Step 0 — initial question */}
            {discoveryStep === 0 && (
              <div className="text-center">
                <p className="text-off-white/80 text-base font-body mb-6">
                  {language === 'tr' ? 'Bu metin hangi kategoriye giriyor?' : 'Which category does this text belong to?'}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => setDiscoveryStep(1)}
                    className="px-6 py-3 rounded-xl font-body text-sm font-medium transition-all"
                    style={{ border: '1px solid rgba(148,163,184,0.3)', color: '#94a3b8', background: 'rgba(148,163,184,0.05)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(148,163,184,0.12)'; e.currentTarget.style.borderColor = 'rgba(148,163,184,0.5)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(148,163,184,0.05)'; e.currentTarget.style.borderColor = 'rgba(148,163,184,0.3)'; }}
                  >
                    {language === 'tr' ? '📜 Bu şiir mi?' : '📜 Is this poetry?'}
                  </button>
                  <button
                    onClick={() => setDiscoveryStep(2)}
                    className="px-6 py-3 rounded-xl font-body text-sm font-medium transition-all"
                    style={{ border: '1px solid rgba(148,163,184,0.3)', color: '#94a3b8', background: 'rgba(148,163,184,0.05)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(148,163,184,0.12)'; e.currentTarget.style.borderColor = 'rgba(148,163,184,0.5)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(148,163,184,0.05)'; e.currentTarget.style.borderColor = 'rgba(148,163,184,0.3)'; }}
                  >
                    {language === 'tr' ? '📄 Düzyazı mı?' : '📄 Is this prose?'}
                  </button>
                </div>
              </div>
            )}

            {/* Step 1 — not poetry */}
            {discoveryStep === 1 && (
              <div>
                <div className="flex items-start gap-3 mb-5 p-4 rounded-xl" style={{ background: 'rgba(231,76,60,0.07)', border: '1px solid rgba(231,76,60,0.2)' }}>
                  <span className="text-lg mt-0.5">✗</span>
                  <div>
                    <p className="text-off-white font-body font-semibold text-sm mb-1">
                      {language === 'tr' ? 'Hayır — şiir değil.' : 'No — this is not poetry.'}
                    </p>
                    <p className="text-silver/70 text-sm font-body leading-relaxed">
                      {language === 'tr'
                        ? 'Arap şiiri 16 kesin vezne (aruz) bağlıydı — her mısranın hece sayısı ve vurgu düzeni sabit olmalıydı. Duhâ bu vezinlerin hiçbirine uymuyor.'
                        : 'Arabic poetry followed 16 fixed meters — each line required a fixed syllable count and stress pattern. Ad-Duha matches none of them.'}
                    </p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-silver/60 text-sm font-body mb-4">
                    {language === 'tr' ? 'O halde düzyazı mıdır?' : 'Could it be prose, then?'}
                  </p>
                  <button
                    onClick={() => setDiscoveryStep(3)}
                    className="px-6 py-3 rounded-xl font-body text-sm font-medium transition-all"
                    style={{ border: '1px solid rgba(148,163,184,0.3)', color: '#94a3b8', background: 'rgba(148,163,184,0.05)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(148,163,184,0.12)'; e.currentTarget.style.borderColor = 'rgba(148,163,184,0.5)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(148,163,184,0.05)'; e.currentTarget.style.borderColor = 'rgba(148,163,184,0.3)'; }}
                  >
                    {language === 'tr' ? '📄 Düzyazı mı?' : '📄 Is this prose?'}
                  </button>
                </div>
              </div>
            )}

            {/* Step 2 — not prose */}
            {discoveryStep === 2 && (
              <div>
                <div className="flex items-start gap-3 mb-5 p-4 rounded-xl" style={{ background: 'rgba(231,76,60,0.07)', border: '1px solid rgba(231,76,60,0.2)' }}>
                  <span className="text-lg mt-0.5">✗</span>
                  <div>
                    <p className="text-off-white font-body font-semibold text-sm mb-1">
                      {language === 'tr' ? 'Hayır — düzyazı da değil.' : 'No — this is not prose either.'}
                    </p>
                    <p className="text-silver/70 text-sm font-body leading-relaxed">
                      {language === 'tr'
                        ? 'Arap düzyazısı (nesir) ritimden tamamen bağımsızdır. Ama Duhâ\'da her ayet "-â" sesiyle bitiyor — وَالضُّحَىٰ، سَجَىٰ، قَلَىٰ. Ritim güçlü ve tutarlı, ama hiçbir vezin kuralını takip etmiyor.'
                        : 'Arabic prose (nathr) is completely free of rhythm. But in Ad-Duha, every verse ends with the "-ā" sound — وَالضُّحَىٰ، سَجَىٰ، قَلَىٰ. The rhythm is powerful and consistent, yet follows no metrical rule.'}
                    </p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-silver/60 text-sm font-body mb-4">
                    {language === 'tr' ? 'O halde şiir midir?' : 'Could it be poetry, then?'}
                  </p>
                  <button
                    onClick={() => setDiscoveryStep(3)}
                    className="px-6 py-3 rounded-xl font-body text-sm font-medium transition-all"
                    style={{ border: '1px solid rgba(148,163,184,0.3)', color: '#94a3b8', background: 'rgba(148,163,184,0.05)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(148,163,184,0.12)'; e.currentTarget.style.borderColor = 'rgba(148,163,184,0.5)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(148,163,184,0.05)'; e.currentTarget.style.borderColor = 'rgba(148,163,184,0.3)'; }}
                  >
                    {language === 'tr' ? '📜 Şiir mi?' : '📜 Is it poetry?'}
                  </button>
                </div>
              </div>
            )}

            {/* Step 3 — neither, reveal button */}
            {discoveryStep === 3 && (
              <div>
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <div className="flex-1 flex items-start gap-3 p-4 rounded-xl" style={{ background: 'rgba(231,76,60,0.07)', border: '1px solid rgba(231,76,60,0.2)' }}>
                    <span>✗</span>
                    <p className="text-silver/70 text-sm font-body">
                      {language === 'tr' ? 'Şiir değil — hiçbir vezne uymuyor.' : 'Not poetry — matches no meter.'}
                    </p>
                  </div>
                  <div className="flex-1 flex items-start gap-3 p-4 rounded-xl" style={{ background: 'rgba(231,76,60,0.07)', border: '1px solid rgba(231,76,60,0.2)' }}>
                    <span>✗</span>
                    <p className="text-silver/70 text-sm font-body">
                      {language === 'tr' ? 'Düzyazı değil — güçlü bir ritim var.' : 'Not prose — too rhythmically powerful.'}
                    </p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-silver/60 text-sm font-body mb-4">
                    {language === 'tr' ? 'O zaman nedir?' : 'What is it, then?'}
                  </p>
                  <button
                    onClick={() => setDiscoveryStep(4)}
                    className="px-8 py-3 rounded-xl font-body text-sm font-semibold transition-all"
                    style={{ border: '1px solid rgba(212,165,116,0.5)', color: '#d4a574', background: 'rgba(212,165,116,0.08)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,165,116,0.18)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(212,165,116,0.08)'; }}
                  >
                    {language === 'tr' ? '✦ O zaman nedir?' : '✦ What is it then?'}
                  </button>
                </div>
              </div>
            )}

            {/* Step 4 — sui generis reveal */}
            {discoveryStep === 4 && (
              <div className="text-center">
                <div className="mb-6 flex flex-col sm:flex-row gap-3 justify-center text-sm font-body">
                  <span className="px-3 py-1 rounded-full" style={{ background: 'rgba(231,76,60,0.1)', color: 'rgba(231,76,60,0.7)', border: '1px solid rgba(231,76,60,0.2)' }}>
                    ✗ {language === 'tr' ? 'Şiir değil' : 'Not poetry'}
                  </span>
                  <span className="px-3 py-1 rounded-full" style={{ background: 'rgba(231,76,60,0.1)', color: 'rgba(231,76,60,0.7)', border: '1px solid rgba(231,76,60,0.2)' }}>
                    ✗ {language === 'tr' ? 'Düzyazı değil' : 'Not prose'}
                  </span>
                </div>
                <p className="text-gold/60 text-xs uppercase tracking-[0.3em] font-body mb-3">
                  {language === 'tr' ? 'Dilbilimcilerin cevabı' : "Linguists' answer"}
                </p>
                <p className="font-display text-3xl md:text-4xl font-bold mb-4" style={{ color: '#d4a574' }}>
                  sui generis
                </p>
                <p className="text-silver/70 text-base font-body leading-relaxed max-w-xl mx-auto">
                  {language === 'tr'
                    ? 'Kendi kategorisini yaratan eser. Edebiyat tarihinde bir ilk — ne şiir ne düzyazı, ikisinin ötesinde, kendine özgü bir form. Arap dili ve edebiyatı kriterleriyle 1.400 yıldır kimse bir benzeri yazamadı.'
                    : 'A work that created its own category. Unique in the history of literature — neither poetry nor prose, beyond both, a form entirely its own. By the standards of Arabic language and literature, no one has produced its equal in 1,400 years.'}
                </p>
                {/* Accordion: Neden sui generis? */}
                <div className="mt-6 text-left" style={{ maxWidth: '520px', margin: '24px auto 0' }}>
                  <button
                    onClick={() => setSuiGenerisOpen(p => !p)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'rgba(212,165,116,0.6)', fontSize: '0.8rem',
                      fontFamily: "'Inter', sans-serif", fontWeight: 500,
                      letterSpacing: '0.02em', padding: '4px 0',
                      transition: 'color 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = 'rgba(212,165,116,1)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(212,165,116,0.6)'}
                  >
                    <span style={{ fontSize: '0.7rem', transition: 'transform 0.2s', transform: suiGenerisOpen ? 'rotate(90deg)' : 'rotate(0deg)', display: 'inline-block' }}>▶</span>
                    {language === 'tr' ? 'Neden yeterince güçlü bir iddia?' : 'Why is this claim well-founded?'}
                  </button>

                  <AnimatePresence>
                    {suiGenerisOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.22 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div className="mt-3 rounded-xl p-5 text-left" style={{ background: 'rgba(212,165,116,0.04)', border: '1px solid rgba(212,165,116,0.15)' }}>
                          {language === 'tr' ? (
                            <div className="font-body text-sm leading-relaxed" style={{ color: 'rgba(232,230,227,0.75)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                              <p>
                                <span style={{ color: '#d4a574', fontWeight: 600 }}>Sadece iki form değil, bilinen her form denendi.</span>{' '}
                                7. yüzyıl Arapça'sında şiir ve düzyazının yanı sıra üç form daha vardı: <em>sac'</em> (kâhinlerin kısa kafiyeli düzyazısı), <em>hutbe</em> (hitabet düzyazısı) ve <em>mesel</em> (veciz atasözü formu). Kur'an bunların hiçbirine de uymadı.
                              </p>
                              <p>
                                <span style={{ color: '#d4a574', fontWeight: 600 }}>Serbest şiirle farkı nedir?</span>{' '}
                                Serbest şiir (free verse) tanımlanabilir bir geleneğin içinden çıktı — 19. yüzyıl Batı edebiyatının kasıtlı bir kırılması. Kur'an ise mevcut hiçbir geleneğin kırılması değil; o geleneklerin dışında, 7. yüzyılda, referans noktasız ortaya çıktı.
                              </p>
                              <p>
                                <span style={{ color: '#d4a574', fontWeight: 600 }}>Tahaddi — meydan okuma.</span>{' '}
                                Kur'an bizzat meydan okudu: "Benzerini getirin." Bunu duyanlar hem o dili en iyi bilen hem de onu çürütmek için her nedeni olan insanlardı. 1.400 yıl boyunca kimse bu meydan okumayı karşılayamadı.
                              </p>
                            </div>
                          ) : (
                            <div className="font-body text-sm leading-relaxed" style={{ color: 'rgba(232,230,227,0.75)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                              <p>
                                <span style={{ color: '#d4a574', fontWeight: 600 }}>Not just two forms — every known form was tested.</span>{' '}
                                7th-century Arabic had more than poetry and prose: <em>saj'</em> (the rhymed cadenced prose of soothsayers), <em>khutba</em> (oratory prose), and <em>masal</em> (the concise proverb form). The Quran matched none of these either.
                              </p>
                              <p>
                                <span style={{ color: '#d4a574', fontWeight: 600 }}>How is it different from free verse?</span>{' '}
                                Free verse emerged from within a recognizable tradition — a deliberate 19th-century break from Western poetic convention. The Quran, by contrast, did not break from any tradition; it appeared in the 7th century with no predecessor to define itself against.
                              </p>
                              <p>
                                <span style={{ color: '#d4a574', fontWeight: 600 }}>The challenge — and the silence.</span>{' '}
                                The Quran itself issued a challenge: produce something like it. Those who heard it were the finest masters of the language — and had every reason to respond. They could not. For 1,400 years, no one has.
                              </p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  onClick={() => { setDiscoveryStep(0); setSuiGenerisOpen(false); }}
                  className="mt-5 text-silver/30 text-xs font-body hover:text-silver/60 transition-colors"
                >
                  {language === 'tr' ? '↺ Baştan başla' : '↺ Start over'}
                </button>
              </div>
            )}

          </div>
        </div>
      </motion.div>

      {/* ── Fasıla Sistemi ── */}
      <motion.div variants={fadeUpItem} className="mb-12">
        <h3 className="font-display text-xl font-bold text-off-white mb-3">
          {t('impossibleRhythm.fasila.title')}
        </h3>
        <p className="text-silver/75 text-sm leading-relaxed font-body max-w-2xl mb-6">
          {t('impossibleRhythm.fasila.desc')}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {FASILA_SURAS.map((sura, i) => (
            <motion.div
              key={i}
              variants={fadeUpItem}
              className="rounded-xl p-5"
              style={{
                background: sura.glow,
                border: `1px solid ${sura.border}`,
              }}
            >
              <p className="font-body font-semibold text-off-white text-sm mb-1">
                {language === 'tr' ? sura.labelTr : sura.labelEn}
              </p>
              <p className="text-xs font-body mb-3" style={{ color: sura.color }}>
                {t('impossibleRhythm.fasila.soundLabel')}: <strong>{sura.sound}</strong>
              </p>
              <div className="flex flex-col gap-0" dir="rtl">
                {sura.examples.map((ex, j) => (
                  <span
                    key={j}
                    style={{
                      fontFamily: "'KFGQPC', 'Amiri Quran', serif",
                      fontSize: '2rem',
                      lineHeight: 1.5,
                      color: sura.color,
                      opacity: 1 - j * 0.12,
                    }}
                  >
                    {ex}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── Kevser Arabic Display ── */}
      <motion.div variants={fadeUpItem} className="mb-12">
        <h3 className="font-display text-xl font-bold text-off-white mb-2">
          {language === 'tr' ? "Kevser Sûresi — '-ar' Fasılası" : "Al-Kawthar — '-ar' Fāṣila"}
        </h3>
        <p className="text-silver/65 text-sm leading-relaxed font-body max-w-2xl mb-6">
          {language === 'tr'
            ? "3 ayetin tamamı aynı '-ar' sesiyle biter. Kafiye zorunluluğu yok; ama ses örüntüsü anlamın doğal bir parçası gibi akar."
            : "All 3 verses end with the same '-ar' sound. No rhyme rule is imposed — yet the sonic pattern flows as a natural part of the meaning."}
        </p>
        <div
          className="rounded-xl p-3 md:p-4 space-y-1"
          style={{
            background: 'rgba(212,165,116,0.04)',
            border: '1px solid rgba(212,165,116,0.2)',
          }}
        >
          {KAWTHAR_VERSES.map((verse, i) => (
            <div key={i} className="flex items-center justify-between gap-4" dir="rtl">
              <div className="flex items-center gap-4 flex-1">
                <span
                  className="text-3xl md:text-4xl leading-loose"
                  style={{ fontFamily: "'KFGQPC', 'Amiri Quran', serif", color: '#e8e6e3' }}
                >
                  {verse.ar}
                </span>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0" dir="ltr">
                <span
                  className="text-xs font-body font-bold px-2 py-0.5 rounded-full"
                  style={{
                    background: 'rgba(212,165,116,0.15)',
                    color: '#d4a574',
                    border: '1px solid rgba(212,165,116,0.35)',
                  }}
                >
                  -ar
                </span>
                <span
                  style={{ fontFamily: "'KFGQPC', 'Amiri Quran', serif", fontSize: '2.2rem', color: 'rgba(212,165,116,0.75)' }}
                >
                  {verse.num}
                </span>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-center gap-3 pt-3 mt-2" style={{ borderTop: '1px solid rgba(212,165,116,0.1)' }}>
            <button
              onClick={!kawtharFailed ? toggleKawthar : undefined}
              disabled={kawtharFailed}
              style={{
                width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                background: kawtharFailed ? 'rgba(100,116,139,0.08)' : kawtharPlaying ? 'rgba(212,165,116,0.22)' : 'rgba(212,165,116,0.08)',
                border: `1px solid ${kawtharFailed ? 'rgba(100,116,139,0.2)' : kawtharPlaying ? 'rgba(200,185,165,0.72)' : 'rgba(212,165,116,0.2)'}`,
                color: kawtharFailed ? '#475569' : '#d4a574',
                cursor: kawtharFailed ? 'not-allowed' : 'pointer',
                opacity: kawtharFailed ? 0.5 : 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.18s',
              }}
            >
              {kawtharPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>
          </div>
        </div>
      </motion.div>

      {/* ── Necm Visualization ── */}
      <motion.div variants={fadeUpItem} className="mb-12">
        <h3 className="font-display text-xl font-bold text-off-white mb-2">
          {language === 'tr' ? 'Necm Sûresi: 62 Ayetin Ses Haritası' : 'Surah An-Najm: Sound Map of 62 Verses'}
        </h3>
        <p className="text-silver text-sm font-body mb-6 leading-relaxed">
          {language === 'tr'
            ? 'Her kare bir ayeti temsil eder. Tıkla: ayeti duy ve son kelimesini gör.'
            : 'Each square is one verse. Click to hear it and see the ending word.'}
        </p>

        {/* Grid */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '16px' }}>
          {NAJM_FASILA.map((type, i) => {
            const isSelected = selectedNajm === i;
            const isFailed = failedNajm.has(i);
            const bg = type === 'aa' ? '#d4a574' : type === 'mq' ? '#7c3f58' : '#1e293b';
            const border = isSelected
              ? '2px solid #fff'
              : type === 'aa'
              ? '1px solid rgba(212,165,116,0.4)'
              : type === 'mq'
              ? '1px solid rgba(180,80,120,0.4)'
              : '1px solid rgba(255,255,255,0.06)';
            const color = type === 'aa' ? 'rgba(10,10,26,0.75)' : type === 'mq' ? 'rgba(255,220,230,0.7)' : '#475569';
            return (
              <div
                key={i}
                onClick={() => handleNajmClick(i)}
                title={`${i + 1}. ayet`}
                style={{
                  width: '30px', height: '30px', borderRadius: '4px',
                  background: bg, border,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.5rem', color, fontFamily: 'Inter, sans-serif', fontWeight: 600,
                  cursor: 'pointer',
                  transform: isSelected ? 'scale(1.2)' : 'scale(1)',
                  transition: 'transform 0.12s, border 0.12s, opacity 0.2s',
                  boxShadow: isSelected ? '0 0 8px rgba(255,255,255,0.3)' : 'none',
                  opacity: isFailed ? 0.35 : 1,
                }}
                onMouseEnter={e => { if (!isSelected) e.currentTarget.style.transform = 'scale(1.12)'; }}
                onMouseLeave={e => { if (!isSelected) e.currentTarget.style.transform = 'scale(1)'; }}
              >
                {i + 1}
              </div>
            );
          })}
        </div>

        {/* Popup card */}
        {selectedNajm !== null && (
          <div
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              padding: '16px 20px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
            }}
          >
            <div>
              <p style={{ color: '#94a3b8', fontSize: '0.75rem', fontFamily: 'Inter, sans-serif', marginBottom: '6px' }}>
                Necm 53:{selectedNajm + 1}
              </p>
              <p
                dir="rtl"
                lang="ar"
                style={{
                  fontFamily: "'KFGQPC', 'Amiri Quran', serif",
                  fontSize: '2rem',
                  color: NAJM_FASILA[selectedNajm] === 'aa' ? '#d4a574' : NAJM_FASILA[selectedNajm] === 'mq' ? '#e8a0b8' : '#94a3b8',
                  lineHeight: 1.4,
                }}
              >
                {NAJM_WORDS[selectedNajm]}
              </p>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <span style={{
                fontSize: '0.7rem',
                fontFamily: 'Inter, sans-serif',
                padding: '3px 8px',
                borderRadius: '20px',
                background: NAJM_FASILA[selectedNajm] === 'aa'
                  ? 'rgba(212,165,116,0.15)'
                  : NAJM_FASILA[selectedNajm] === 'mq'
                  ? 'rgba(180,80,120,0.2)'
                  : 'rgba(255,255,255,0.06)',
                color: NAJM_FASILA[selectedNajm] === 'aa' ? '#d4a574' : NAJM_FASILA[selectedNajm] === 'mq' ? '#e8a0b8' : '#94a3b8',
                border: '1px solid currentColor',
              }}>
                {NAJM_FASILA[selectedNajm] === 'aa'
                  ? (language === 'tr' ? '‑â sesi' : '‑â sound')
                  : NAJM_FASILA[selectedNajm] === 'mq'
                  ? 'maqta\u02BF'
                  : (language === 'tr' ? 'farklı ses' : 'other sound')}
              </span>
            </div>
          </div>
        )}

        {/* Legend */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '20px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <div style={{ width: '14px', height: '14px', borderRadius: '3px', background: '#d4a574' }} />
            <span className="text-silver text-sm font-body">'-â' {language === 'tr' ? 'sesi (54 ayet)' : 'sound (54 verses)'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <div style={{ width: '14px', height: '14px', borderRadius: '3px', background: '#7c3f58' }} />
            <span className="text-silver text-sm font-body">{language === 'tr' ? "maqta\u02BF — kapanış (6 ayet)" : "maqta\u02BF — closing (6 verses)"}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <div style={{ width: '14px', height: '14px', borderRadius: '3px', background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)' }} />
            <span className="text-silver text-sm font-body">{language === 'tr' ? 'Farklı ses (2 ayet)' : 'Other sound (2 verses)'}</span>
          </div>
        </div>

        {/* Stat + ℹ */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
          <p className="text-gold font-body text-sm">
            {language === 'tr'
              ? <>62 ayetin <strong>54'ü</strong> (~%87) aynı '-â' sesiyle bitiyor.</>
              : <>54 of 62 verses (~87%) end with the same '-â' sound.</>}
          </p>
          <div className="relative" style={{ flexShrink: 0, marginTop: '1px' }}>
            <button
              onClick={() => setNajmInfoOpen(v => !v)}
              style={{ color: '#d4a574', fontSize: '1rem', lineHeight: 1, background: 'none', border: 'none', cursor: 'pointer' }}
              aria-label="Gruplama kriteri"
            >ⓘ</button>
            {najmInfoOpen && (
              <div
                className="absolute left-0 z-10 rounded-lg p-3 text-xs text-silver/80 font-body leading-relaxed"
                style={{ background: '#1a2a3a', border: '1px solid rgba(255,255,255,0.1)', width: '220px', top: '22px' }}
              >
                {language === 'tr'
                  ? "'-â' grubuna dahil sesler: alif maqsura (ى) veya uzun alif (ا) ile biten ayetler. '-nâ', '-hâ', '-râ', '-yâ' gibi uzun sesler bu gruba girmektedir."
                  : "The '-â' group includes verses ending with alif maqsura (ى) or long alif (ا): endings like '-nâ', '-hâ', '-râ', '-yâ' all qualify."}
              </div>
            )}
          </div>
        </div>

        <p className="text-silver/60 text-xs font-body leading-relaxed mt-3">
          {language === 'tr'
            ? "Son 6 ayet (57–62) birbirinden farklı seslerle biter — bu kasıtlı bir kapanış değişimidir. Klasik retorik bu bölüme maqta\u02BF (مقطع) adını verir."
            : "The final 6 verses (57–62) end with distinctly different sounds — a deliberate closing shift. Classical rhetoric calls this section the maqta\u02BF (مقطع)."}
        </p>
      </motion.div>

      {/* ── Quote ── */}
      <motion.div
        variants={fadeUpItem}
        className="glass-card-strong p-8 md:p-10 text-center"
      >
        <p className="text-gold/90 text-xl md:text-2xl italic font-display leading-relaxed">
          {t('impossibleRhythm.quote')}
        </p>
      </motion.div>

    </SectionWrapper>
  );
}
