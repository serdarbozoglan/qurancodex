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
function VerseRow({ verse, isActive, onSelect, onAudioToggle, audioPlaying, language, showTranslation }) {
  const vt = language === 'tr' ? (cleanTr(verse.turkish) || verse.english) : (verse.english || cleanTr(verse.turkish));
  const gold = '#d4a574';

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
      {/* Ayah number + audio */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: '28px', height: '28px', borderRadius: '50%',
          border: `1px solid ${isActive ? 'rgba(212,165,116,0.5)' : 'rgba(212,165,116,0.15)'}`,
          color: isActive ? gold : '#64748b', fontSize: '0.7rem', fontWeight: 600, flexShrink: 0,
        }}>{verse.ayah}</span>
        <AudioBar
          surah={verse.surah} ayah={verse.ayah}
          playing={audioPlaying}
          onToggle={(e) => { e.stopPropagation(); onAudioToggle(verse); }}
          language={language}
          reciterIdx={0}
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
          <button onClick={() => changeSurah(selectedSurah + 1)} disabled={selectedSurah >= 114}
            style={{ background: 'none', border: '1px solid rgba(212,165,116,0.2)', borderRadius: '6px', color: selectedSurah >= 114 ? '#2d3748' : gold, cursor: selectedSurah >= 114 ? 'default' : 'pointer', padding: '4px 10px', fontSize: '0.8rem', transition: 'all 0.15s' }}>
            ›
          </button>
        </div>

        {/* Right: controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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

        {/* Bismillah header (for all surahs except 9 and 1 which already starts with it) */}
        {!loading && surahVerses.length > 0 && selectedSurah !== 9 && (
          <div style={{ textAlign: 'center', padding: '28px 24px 8px', fontFamily: "'Amiri', serif", fontSize: '1.5rem', color: 'rgba(212,165,116,0.6)', lineHeight: 2 }}>
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>
        )}

        {surahVerses.map(verse => (
          <div key={verse.id} id={`rm-verse-${verse.id}`}>
            <VerseRow
              verse={verse}
              isActive={activeVerse?.id === verse.id}
              onSelect={handleSelectVerse}
              onAudioToggle={handleAudioToggle}
              audioPlaying={playingVerseId === verse.id}
              language={language}
              showTranslation={showTranslation}
            />
          </div>
        ))}

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
        </div>
      )}
    </div>
  );
}
