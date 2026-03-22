import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

// Strip footnote refs from Suat Yıldırım translation
function cleanTr(str) {
  if (!str) return str;
  return str
    .replace(/\s*\{[^}]*\}/g, '')
    .replace(/\s*\[\d[^\]]*\]/g, '')
    .trim();
}

// Sajda (secde) verses — 15 obligatory prostration points (Hanafi)
const SAJDA_VERSES = new Set([
  '7:206', '13:15', '16:49', '17:107', '19:58',
  '22:18', '22:77', '25:60', '27:25', '32:15',
  '38:24', '41:37', '53:62', '84:21', '96:19',
]);

// Starting page number for each surah (standard 604-page Medina mushaf, Hafs)
const SURAH_PAGES = [
  1,   2,  50,  77, 106, 128, 151, 177, 187, 208,
221, 235, 249, 255, 262, 267, 282, 293, 305, 312,
322, 333, 342, 350, 359, 367, 377, 385, 396, 404,
411, 415, 418, 428, 434, 440, 446, 453, 458, 467,
477, 483, 489, 496, 499, 502, 507, 511, 515, 518,
520, 523, 526, 528, 531, 534, 537, 542, 545, 549,
551, 553, 554, 556, 558, 560, 562, 564, 566, 568,
570, 572, 574, 575, 577, 578, 580, 582, 583, 585,
586, 587, 587, 589, 590, 591, 591, 592, 593, 594,
595, 595, 596, 596, 597, 597, 598, 598, 599, 599,
600, 600, 601, 601, 601, 602, 602, 602, 603, 603,
603, 604, 604, 604,
];

// Juz (cüz) number each surah starts in
const SURAH_JUZ = [
  1,  1,  3,  4,  6,  7,  8,  9, 10, 11,
 11, 12, 13, 13, 14, 14, 15, 15, 16, 16,
 17, 17, 18, 18, 19, 19, 20, 20, 21, 21,
 21, 21, 21, 22, 22, 23, 23, 23, 23, 24,
 24, 25, 25, 25, 25, 26, 26, 26, 26, 26,
 26, 27, 27, 27, 27, 27, 27, 28, 28, 28,
 28, 28, 28, 28, 28, 28, 29, 29, 29, 29,
 29, 29, 29, 29, 29, 29, 29, 29, 30, 30,
 30, 30, 30, 30, 30, 30, 30, 30, 30, 30,
 30, 30, 30, 30, 30, 30, 30, 30, 30, 30,
 30, 30, 30, 30, 30, 30, 30, 30, 30, 30,
 30, 30, 30, 30,
];

const SURAH_NAMES_TR = [
  'El-Fatiha','El-Bakara','Âl-i İmrân','En-Nisâ','El-Mâide',
  'El-En\'âm','El-A\'râf','El-Enfâl','Et-Tevbe','Yûnus',
  'Hûd','Yûsuf','Er-Ra\'d','İbrâhim','El-Hicr','En-Nahl',
  'El-İsrâ','El-Kehf','Meryem','Tâhâ','El-Enbiyâ','El-Hac',
  'El-Mü\'minûn','En-Nûr','El-Furkân','Eş-Şuarâ','En-Neml',
  'El-Kasas','El-Ankebût','Er-Rûm','Lokmân','Es-Secde','El-Ahzâb',
  'Sebe\'','Fâtır','Yâ-Sîn','Es-Sâffât','Sâd','Ez-Zümer','Ğâfir',
  'Fussilet','Eş-Şûrâ','Ez-Zuhruf','Ed-Duhân','El-Câsiye','El-Ahkâf',
  'Muhammed','El-Feth','El-Hucurât','Kâf','Ez-Zâriyât','Et-Tûr',
  'En-Necm','El-Kamer','Er-Rahmân','El-Vâkıa','El-Hadîd','El-Mücâdele',
  'El-Haşr','El-Mümtehine','Es-Saf','El-Cum\'a','El-Münâfikûn',
  'Et-Teğâbun','Et-Talâk','Et-Tahrîm','El-Mülk','El-Kalem','El-Hâkka',
  'El-Meâric','Nûh','El-Cin','El-Müzzemmil','El-Müddessir','El-Kıyâme',
  'El-İnsân','El-Mürselât','En-Nebe\'','En-Nâziât','Abese','Et-Tekvîr',
  'El-İnfitâr','El-Mutaffifîn','El-İnşikâk','El-Burûc','Et-Târık',
  'El-A\'lâ','El-Ğâşiye','El-Fecr','El-Beled','Eş-Şems','El-Leyl',
  'Ed-Duhâ','Eş-Şerh','Et-Tîn','El-Alak','El-Kadr','El-Beyyine',
  'Ez-Zelzele','El-Âdiyât','El-Kâri\'a','Et-Tekâsür','El-Asr',
  'El-Hümeze','El-Fîl','Kureyş','El-Mâûn','El-Kevser','El-Kâfirûn',
  'En-Nasr','El-Mesed','El-İhlâs','El-Felak','En-Nâs',
];

const RECITERS = [
  { id: 'Alafasy_128kbps',              labelTr: 'Meşarî', labelEn: 'Alafasy' },
  { id: 'Abdul_Basit_Murattal_192kbps', labelTr: 'Abdülbasit', labelEn: 'Abdul Basit' },
  { id: 'Husary_128kbps',               labelTr: 'Husarî', labelEn: 'Al-Husary' },
];

function audioUrl(reciterId, surah, ayah) {
  const s = String(surah).padStart(3, '0');
  const a = String(ayah).padStart(3, '0');
  return `https://everyayah.com/data/${reciterId}/${s}${a}.mp3`;
}

// ─── Inline audio bar ────────────────────────────────────────────────────────
function AudioBar({ surah, ayah, playing, onToggle, language, reciterIdx }) {
  const reciter = RECITERS[reciterIdx];
  const gold = '#d4a574';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <button onClick={onToggle} style={{
        width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
        background: playing ? 'rgba(212,165,116,0.22)' : 'rgba(212,165,116,0.08)',
        border: `1px solid ${playing ? 'rgba(212,165,116,0.5)' : 'rgba(212,165,116,0.2)'}`,
        color: gold, cursor: 'pointer', fontSize: '0.7rem',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.18s',
      }}>
        {playing ? '❙❙' : '▶'}
      </button>
      <span style={{ color: '#64748b', fontSize: '0.65rem' }}>
        {language === 'tr' ? reciter.labelTr : reciter.labelEn}
      </span>
    </div>
  );
}

// ─── Single verse row ─────────────────────────────────────────────────────────
function VerseRow({ verse, isActive, onSelect, onAudioToggle, audioPlaying, language, showTranslation, reciterIdx }) {
  const vt = language === 'tr' ? (cleanTr(verse.turkish) || verse.english) : (verse.english || cleanTr(verse.turkish));
  const gold = '#d4a574';
  const isSajda = SAJDA_VERSES.has(`${verse.surah}:${verse.ayah}`);

  return (
    <div
      onClick={() => onSelect(verse)}
      style={{
        display: 'flex', flexDirection: 'column', gap: '12px',
        padding: '20px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        background: isActive ? 'rgba(212,165,116,0.05)' : 'transparent',
        borderLeft: isActive ? `3px solid ${gold}` : '3px solid transparent',
        cursor: 'pointer', transition: 'all 0.18s',
      }}
      onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
      onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
    >
      {/* Ayah number + sajda badge + audio */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '28px', height: '28px', borderRadius: '50%',
            border: `1px solid ${isActive ? 'rgba(212,165,116,0.5)' : 'rgba(212,165,116,0.15)'}`,
            color: isActive ? gold : '#64748b', fontSize: '0.7rem', fontWeight: 600, flexShrink: 0,
          }}>{verse.ayah}</span>
          {isSajda && (
            <span style={{
              fontSize: '0.6rem', padding: '2px 6px', borderRadius: '4px',
              background: 'rgba(46,204,113,0.12)', border: '1px solid rgba(46,204,113,0.3)',
              color: '#2ecc71', fontFamily: "'Amiri', serif", letterSpacing: '0.02em',
            }}>
              {language === 'tr' ? 'Secde' : 'Sajda'} ۩
            </span>
          )}
        </div>
        <AudioBar
          surah={verse.surah} ayah={verse.ayah}
          playing={audioPlaying}
          onToggle={(e) => { e.stopPropagation(); onAudioToggle(verse); }}
          language={language}
          reciterIdx={reciterIdx}
        />
      </div>

      {/* Arabic */}
      <div style={{
        fontFamily: "'Amiri', serif", fontSize: '1.7rem', lineHeight: 2.2,
        color: isActive ? '#e8c98a' : '#d4b483',
        textAlign: 'right', direction: 'rtl',
      }}>
        {verse.arabic}
      </div>

      {/* Translation */}
      {showTranslation && (
        <div style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.8 }}>
          {vt}
        </div>
      )}
    </div>
  );
}

// ─── Main ReadingMode component ───────────────────────────────────────────────
export default function ReadingMode({ onClose, initialSurah = 1 }) {
  const { language } = useLanguage();
  const [verses, setVerses] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSurah, setSelectedSurah] = useState(initialSurah);
  const [activeVerse, setActiveVerse] = useState(null);
  const [showTranslation, setShowTranslation] = useState(true);
  const [showSurahPicker, setShowSurahPicker] = useState(false);
  const [reciterIdx, setReciterIdx] = useState(0);
  const [playingVerseId, setPlayingVerseId] = useState(null);
  const [bookMode, setBookMode] = useState(false);
  const [arabicFont, setArabicFont] = useState('Amiri'); // 'Amiri' | 'AmiriQuran' | 'KFGQPC'

  const ARABIC_FONTS = [
    { id: 'Amiri',         label: 'Amiri',             family: "'Amiri', serif" },
    { id: 'AmiriQuran',    label: 'Amiri Quran',       family: "'Amiri Quran', serif" },
    { id: 'KFGQPC',       label: 'KFGQPC',            family: "'KFGQPC', serif" },
    { id: 'Scheherazade',  label: 'Scheherazade',      family: "'Scheherazade New', serif" },
    { id: 'NotoNaskh',     label: 'Noto Naskh',        family: "'Noto Naskh Arabic', serif" },
    { id: 'Lateef',        label: 'Lateef',            family: "'Lateef', serif" },
    { id: 'ReemKufi',      label: 'Reem Kufi',         family: "'Reem Kufi', serif" },
    { id: 'ArefRuqaa',     label: 'Aref Ruqaa',        family: "'Aref Ruqaa', serif" },
    { id: 'MarkaziText',   label: 'Markazi Text',      family: "'Markazi Text', serif" },
    { id: 'Harmattan',     label: 'Harmattan',         family: "'Harmattan', serif" },
    { id: 'Alkalami',      label: 'Alkalami',          family: "'Alkalami', serif" },
    { id: 'ReemKufiInk',   label: 'Reem Kufi Ink',    family: "'Reem Kufi Ink', serif" },
    { id: 'Katibeh',       label: 'Katibeh',           family: "'Katibeh', serif" },
    { id: 'HusrevHatti',   label: 'Hüsrev Hattı',     family: "'HusrevHatti', serif" },
  ];
  const currentFont = ARABIC_FONTS.find(f => f.id === arabicFont)?.family ?? "'Amiri', serif";
  const audioRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    fetch('/verse-graph.json')
      .then(r => r.json())
      .then(data => { setVerses(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const h = (e) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (!surahVerses.length) return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        const idx = surahVerses.findIndex(v => v.id === activeVerse?.id);
        const next = surahVerses[Math.min(idx + 1, surahVerses.length - 1)];
        if (next) handleSelectVerse(next);
      }
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        const idx = surahVerses.findIndex(v => v.id === activeVerse?.id);
        const prev = surahVerses[Math.max(idx - 1, 0)];
        if (prev) handleSelectVerse(prev);
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  });

  const surahVerses = useMemo(() => {
    if (!verses) return [];
    return verses.filter(v => v.surah === selectedSurah).sort((a, b) => a.ayah - b.ayah);
  }, [verses, selectedSurah]);

  const surahGroups = useMemo(() => {
    if (!verses) return [];
    const counts = {};
    verses.forEach(v => { counts[v.surah] = (counts[v.surah] || 0) + 1; });
    return Object.entries(counts).map(([s, c]) => ({ surah: +s, count: c, name: SURAH_NAMES_TR[+s - 1] || s }));
  }, [verses]);

  const handleSelectVerse = useCallback((verse) => {
    setActiveVerse(verse);
    // Scroll into view
    const el = document.getElementById(`rm-verse-${verse.id}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);

  const handleAudioToggle = useCallback((verse) => {
    if (!audioRef.current) return;
    if (playingVerseId === verse.id) {
      audioRef.current.pause();
      setPlayingVerseId(null);
      return;
    }
    audioRef.current.pause();
    audioRef.current.src = audioUrl(RECITERS[reciterIdx].id, verse.surah, verse.ayah);
    setPlayingVerseId(verse.id);
    audioRef.current.play().catch(() => setPlayingVerseId(null));
  }, [playingVerseId, reciterIdx]);

  const changeSurah = (n) => {
    const clamped = Math.max(1, Math.min(114, n));
    setSelectedSurah(clamped);
    setActiveVerse(null);
    setPlayingVerseId(null);
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ''; }
    if (containerRef.current) containerRef.current.scrollTop = 0;
  };

  const gold = '#d4a574';
  const surahName = SURAH_NAMES_TR[selectedSurah - 1] || `Sûre ${selectedSurah}`;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#080a1e', display: 'flex', flexDirection: 'column' }}>
      <audio
        ref={audioRef}
        onEnded={() => {
          // Auto-advance to next verse
          const idx = surahVerses.findIndex(v => v.id === playingVerseId);
          if (idx >= 0 && idx < surahVerses.length - 1) {
            const next = surahVerses[idx + 1];
            audioRef.current.src = audioUrl(RECITERS[reciterIdx].id, next.surah, next.ayah);
            audioRef.current.play().catch(() => {});
            setPlayingVerseId(next.id);
            handleSelectVerse(next);
          } else {
            setPlayingVerseId(null);
          }
        }}
        onError={() => setPlayingVerseId(null)}
      />

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', height: '54px', flexShrink: 0,
        background: 'rgba(8,10,18,0.95)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(212,165,116,0.1)',
      }}>
        {/* Left: surah nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button onClick={() => changeSurah(selectedSurah - 1)} disabled={selectedSurah <= 1}
            style={{ background: 'none', border: '1px solid rgba(212,165,116,0.2)', borderRadius: '6px', color: selectedSurah <= 1 ? '#2d3748' : gold, cursor: selectedSurah <= 1 ? 'default' : 'pointer', padding: '4px 10px', fontSize: '0.8rem', transition: 'all 0.15s' }}>
            ‹
          </button>
          <button
            onClick={() => setShowSurahPicker(p => !p)}
            style={{ background: 'rgba(212,165,116,0.08)', border: '1px solid rgba(212,165,116,0.2)', borderRadius: '8px', color: gold, cursor: 'pointer', padding: '5px 14px', fontSize: '0.85rem', fontWeight: 600 }}
          >
            {selectedSurah}. {surahName}
            <span style={{ color: '#64748b', fontSize: '0.7rem', marginLeft: '8px' }}>
              ({surahVerses.length} {language === 'tr' ? 'ayet' : 'verses'})
            </span>
          </button>
          <span style={{ color: '#4a5568', fontSize: '0.68rem', whiteSpace: 'nowrap' }}>
            {language === 'tr' ? 'Sayfa' : 'Page'} {SURAH_PAGES[selectedSurah - 1]}
            <span style={{ margin: '0 4px', opacity: 0.4 }}>·</span>
            {language === 'tr' ? 'Cüz' : 'Juz'} {SURAH_JUZ[selectedSurah - 1]}
          </span>
          <button onClick={() => changeSurah(selectedSurah + 1)} disabled={selectedSurah >= 114}
            style={{ background: 'none', border: '1px solid rgba(212,165,116,0.2)', borderRadius: '6px', color: selectedSurah >= 114 ? '#2d3748' : gold, cursor: selectedSurah >= 114 ? 'default' : 'pointer', padding: '4px 10px', fontSize: '0.8rem', transition: 'all 0.15s' }}>
            ›
          </button>
        </div>

        {/* Right: controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Arabic font navigator — Fatiha only */}
          {selectedSurah === 1 && (() => {
            const idx = ARABIC_FONTS.findIndex(f => f.id === arabicFont);
            const total = ARABIC_FONTS.length;
            return (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(212,165,116,0.06)', border: '1px solid rgba(212,165,116,0.15)', borderRadius: '8px', padding: '3px 6px' }} title={language === 'tr' ? 'Arapça yazı tipi' : 'Arabic font'}>
                <span style={{ fontSize: '0.6rem', color: '#4a5568', paddingRight: '4px', borderRight: '1px solid rgba(212,165,116,0.1)', marginRight: '2px', whiteSpace: 'nowrap' }}>
                  {language === 'tr' ? 'Hat' : 'Font'} ✦
                </span>
                <button
                  onClick={() => setArabicFont(ARABIC_FONTS[(idx - 1 + total) % total].id)}
                  style={{ background: 'none', border: 'none', color: gold, cursor: 'pointer', fontSize: '0.85rem', padding: '0 4px', lineHeight: 1 }}
                >‹</button>
                <div style={{ textAlign: 'center', minWidth: '120px' }}>
                  <div style={{ fontFamily: ARABIC_FONTS[idx].family, fontSize: '1rem', color: gold, lineHeight: 1.4, direction: 'rtl' }}>
                    بِسْمِ اللَّهِ
                  </div>
                  <div style={{ fontSize: '0.55rem', color: '#4a5568', marginTop: '1px' }}>
                    {idx + 1}/{total}
                  </div>
                </div>
                <button
                  onClick={() => setArabicFont(ARABIC_FONTS[(idx + 1) % total].id)}
                  style={{ background: 'none', border: 'none', color: gold, cursor: 'pointer', fontSize: '0.85rem', padding: '0 4px', lineHeight: 1 }}
                >›</button>
              </div>

            );
          })()}

          {/* Book mode toggle — Fatiha only */}
          {selectedSurah === 1 && (
            <button onClick={() => setBookMode(v => !v)} style={{
              background: bookMode ? 'rgba(212,165,116,0.12)' : 'transparent',
              border: '1px solid rgba(212,165,116,0.2)', borderRadius: '6px',
              color: bookMode ? gold : '#64748b', cursor: 'pointer',
              padding: '4px 10px', fontSize: '0.72rem', transition: 'all 0.15s',
            }}>
              {language === 'tr' ? (bookMode ? '≡ Ayet' : '📖 Kitap') : (bookMode ? '≡ Verse' : '📖 Book')}
            </button>
          )}

          {/* Translation toggle */}
          <button onClick={() => setShowTranslation(v => !v)} style={{
            background: showTranslation ? 'rgba(212,165,116,0.12)' : 'transparent',
            border: '1px solid rgba(212,165,116,0.2)', borderRadius: '6px',
            color: showTranslation ? gold : '#64748b', cursor: 'pointer',
            padding: '4px 10px', fontSize: '0.72rem', transition: 'all 0.15s',
          }}>
            {language === 'tr' ? 'Meal' : 'Translation'}
          </button>

          {/* Reciter selector */}
          <div style={{ display: 'flex', gap: '3px' }}>
            {RECITERS.map((r, i) => (
              <button key={r.id} onClick={() => {
                setReciterIdx(i);
                if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ''; setPlayingVerseId(null); }
              }} style={{
                background: reciterIdx === i ? 'rgba(212,165,116,0.15)' : 'transparent',
                border: `1px solid ${reciterIdx === i ? 'rgba(212,165,116,0.35)' : 'rgba(212,165,116,0.1)'}`,
                borderRadius: '5px', color: reciterIdx === i ? gold : '#64748b',
                fontSize: '0.65rem', padding: '3px 7px', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s',
              }}>
                {language === 'tr' ? r.labelTr : r.labelEn}
              </button>
            ))}
          </div>

          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '6px', color: '#64748b', cursor: 'pointer', padding: '4px 10px', fontSize: '0.8rem',
          }}>✕</button>
        </div>
      </div>

      {/* Surah picker dropdown */}
      {showSurahPicker && (
        <div style={{
          position: 'absolute', top: '54px', left: '20px', zIndex: 100,
          background: 'rgba(10,12,24,0.98)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(212,165,116,0.2)', borderRadius: '10px',
          maxHeight: '360px', overflowY: 'auto', width: '240px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
        }}>
          {surahGroups.map(({ surah, name, count }) => (
            <button key={surah} onClick={() => { changeSurah(surah); setShowSurahPicker(false); }}
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                width: '100%', padding: '8px 14px', textAlign: 'left',
                background: surah === selectedSurah ? 'rgba(212,165,116,0.1)' : 'transparent',
                border: 'none', borderBottom: '1px solid rgba(255,255,255,0.03)',
                color: surah === selectedSurah ? gold : '#94a3b8', cursor: 'pointer', fontSize: '0.8rem',
                transition: 'background 0.12s',
              }}
              onMouseEnter={e => { if (surah !== selectedSurah) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
              onMouseLeave={e => { if (surah !== selectedSurah) e.currentTarget.style.background = 'transparent'; }}
            >
              <span><span style={{ color: '#64748b', marginRight: '8px', fontSize: '0.7rem' }}>{surah}.</span>{name}</span>
              <span style={{ color: '#4a5568', fontSize: '0.7rem' }}>{count}</span>
            </button>
          ))}
        </div>
      )}

      {/* Verse list */}
      <div
        ref={containerRef}
        style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: 'rgba(212,165,116,0.2) transparent' }}
        onClick={() => setShowSurahPicker(false)}
      >
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', color: '#64748b', fontSize: '0.85rem' }}>
            {language === 'tr' ? 'Yükleniyor...' : 'Loading...'}
          </div>
        )}

        {/* Bismillah header (for all surahs except 9; hide for Fatiha in book mode since verse 1 is the bismillah) */}
        {!loading && surahVerses.length > 0 && selectedSurah !== 9 && !(selectedSurah === 1 && bookMode) && (
          <div style={{ textAlign: 'center', padding: '28px 24px 8px', fontFamily: "'Amiri', serif", fontSize: '1.5rem', color: 'rgba(212,165,116,0.6)', lineHeight: 2 }}>
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>
        )}

        {selectedSurah === 1 && bookMode ? (
          /* ── Fatiha: book format ── */
          <div style={{ maxWidth: '860px', margin: '0 auto', padding: '48px 32px 100px' }}>
            {/* Bismillah centered */}
            <div style={{ textAlign: 'center', fontFamily: currentFont, fontSize: '1.8rem', color: 'rgba(212,165,116,0.65)', lineHeight: 2.2, marginBottom: '40px' }}>
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: showTranslation ? '45fr 55fr' : '1fr', gap: '0' }}>
              {/* Left: Translation — hidden when Meal is off */}
              {showTranslation && (
                <div style={{
                  paddingRight: '36px',
                  borderRight: '1px solid rgba(212,165,116,0.12)',
                  color: '#8899aa',
                  fontSize: '0.92rem',
                  lineHeight: 2.1,
                  fontStyle: 'italic',
                }}>
                  {surahVerses.map(verse => {
                    const vt = language === 'tr' ? (cleanTr(verse.turkish) || verse.english) : (verse.english || cleanTr(verse.turkish));
                    const isActive = activeVerse?.id === verse.id;
                    return (
                      <span
                        key={verse.id}
                        onClick={() => { handleSelectVerse(verse); handleAudioToggle(verse); }}
                        style={{ cursor: 'pointer' }}
                      >
                        <sup style={{ color: '#d4a574', fontSize: '0.6rem', opacity: 0.7, verticalAlign: 'super', marginRight: '2px' }}>{verse.ayah}</sup>
                        <span style={{
                          background: isActive ? 'rgba(212,165,116,0.12)' : 'transparent',
                          borderRadius: '3px', padding: '1px 3px',
                          transition: 'background 0.2s',
                          color: isActive ? '#e8c98a' : 'inherit',
                        }}>
                          {vt}
                        </span>{' '}
                      </span>
                    );
                  })}
                </div>
              )}

              {/* Right: Arabic continuous */}
              <div style={{
                paddingLeft: showTranslation ? '36px' : '0',
                direction: 'rtl',
                fontFamily: currentFont,
                fontSize: '2.1rem',
                lineHeight: 2.5,
                color: '#cca96a',
                textAlign: 'justify',
              }}>
                {surahVerses.map(verse => {
                  const isActive = activeVerse?.id === verse.id;
                  return (
                    <span
                      key={verse.id}
                      onClick={() => handleSelectVerse(verse)}
                      style={{ cursor: 'pointer' }}
                    >
                      <span style={{
                        background: isActive ? 'rgba(212,165,116,0.15)' : 'transparent',
                        borderRadius: '4px', padding: '2px 4px',
                        transition: 'background 0.2s',
                        color: isActive ? '#f0d898' : 'inherit',
                      }}>
                        {verse.arabic}
                      </span>
                      {/* Arabic verse number marker */}
                      <span style={{ color: '#d4a574', fontSize: '1.1rem', margin: '0 4px', opacity: 0.8 }}>
                        ﴿{verse.ayah}﴾
                      </span>
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Hint */}
            <p style={{ textAlign: 'center', color: '#3d4f63', fontSize: '0.7rem', marginTop: '40px', fontStyle: 'italic' }}>
              {language === 'tr' ? 'Bir ayete tıklayarak sesi çalabilirsiniz' : 'Tap a verse to play audio'}
            </p>
          </div>
        ) : selectedSurah === 1 ? (
          /* ── Fatiha: two-column layout (verse by verse) ── */
          <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {surahVerses.map(verse => {
              const vt = language === 'tr' ? (cleanTr(verse.turkish) || verse.english) : (verse.english || cleanTr(verse.turkish));
              const isActive = activeVerse?.id === verse.id;
              const isSajda = SAJDA_VERSES.has(`${verse.surah}:${verse.ayah}`);
              const gold = '#d4a574';
              return (
                <div
                  key={verse.id}
                  id={`rm-verse-${verse.id}`}
                  onClick={() => handleSelectVerse(verse)}
                  style={{
                    display: 'grid', gridTemplateColumns: '1fr 1fr',
                    gap: '16px', alignItems: 'center',
                    padding: '16px 20px',
                    borderRadius: '10px',
                    background: isActive ? 'rgba(212,165,116,0.06)' : 'transparent',
                    borderLeft: isActive ? `3px solid ${gold}` : '3px solid transparent',
                    cursor: 'pointer', transition: 'all 0.18s',
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                >
                  {/* Left: ayah number + translation */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        width: '26px', height: '26px', borderRadius: '50%', flexShrink: 0,
                        border: `1px solid ${isActive ? 'rgba(212,165,116,0.5)' : 'rgba(212,165,116,0.15)'}`,
                        color: isActive ? gold : '#64748b', fontSize: '0.68rem', fontWeight: 600,
                      }}>{verse.ayah}</span>
                      {isSajda && (
                        <span style={{
                          fontSize: '0.6rem', padding: '2px 6px', borderRadius: '4px',
                          background: 'rgba(46,204,113,0.12)', border: '1px solid rgba(46,204,113,0.3)',
                          color: '#2ecc71', fontFamily: "'Amiri', serif",
                        }}>
                          {language === 'tr' ? 'Secde' : 'Sajda'} ۩
                        </span>
                      )}
                    </div>
                    {showTranslation && (
                      <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.75, margin: 0 }}>
                        {vt}
                      </p>
                    )}
                  </div>

                  {/* Right: Arabic + audio */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                    <div style={{
                      fontFamily: currentFont, fontSize: '2.2rem', lineHeight: 2.2,
                      color: isActive ? '#e8c98a' : '#d4b483',
                      textAlign: 'right', direction: 'rtl',
                    }}>
                      {verse.arabic}
                    </div>
                    <AudioBar
                      surah={verse.surah} ayah={verse.ayah}
                      playing={playingVerseId === verse.id}
                      onToggle={(e) => { e.stopPropagation(); handleAudioToggle(verse); }}
                      language={language}
                      reciterIdx={reciterIdx}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          surahVerses.map(verse => (
            <div key={verse.id} id={`rm-verse-${verse.id}`}>
              <VerseRow
                verse={verse}
                isActive={activeVerse?.id === verse.id}
                onSelect={handleSelectVerse}
                onAudioToggle={handleAudioToggle}
                audioPlaying={playingVerseId === verse.id}
                language={language}
                showTranslation={showTranslation}
                reciterIdx={reciterIdx}
              />
            </div>
          ))
        )}

        {/* Bottom padding */}
        <div style={{ height: '80px' }} />
      </div>

      {/* Active verse footer bar */}
      {activeVerse && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          background: 'rgba(8,10,18,0.97)', backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(212,165,116,0.15)',
          padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '12px',
        }}>
          {bookMode ? (
            /* Book mode: centered player */
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
              <span style={{ color: gold, fontSize: '0.72rem', fontWeight: 700 }}>{activeVerse.id}</span>
              <AudioBar
                surah={activeVerse.surah} ayah={activeVerse.ayah}
                playing={playingVerseId === activeVerse.id}
                onToggle={() => handleAudioToggle(activeVerse)}
                language={language}
                reciterIdx={reciterIdx}
              />
              <span style={{ color: '#64748b', fontSize: '0.78rem', maxWidth: '400px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {language === 'tr' ? (cleanTr(activeVerse.turkish) || activeVerse.english) : (activeVerse.english || cleanTr(activeVerse.turkish))}
              </span>
            </div>
          ) : (
            /* Verse mode: standard left-aligned bar */
            <>
              <span style={{ color: gold, fontSize: '0.72rem', fontWeight: 700, flexShrink: 0 }}>{activeVerse.id}</span>
              <span style={{ color: '#64748b', fontSize: '0.78rem', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {language === 'tr' ? (cleanTr(activeVerse.turkish) || activeVerse.english) : (activeVerse.english || cleanTr(activeVerse.turkish))}
              </span>
              <AudioBar
                surah={activeVerse.surah} ayah={activeVerse.ayah}
                playing={playingVerseId === activeVerse.id}
                onToggle={() => handleAudioToggle(activeVerse)}
                language={language}
                reciterIdx={reciterIdx}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}
