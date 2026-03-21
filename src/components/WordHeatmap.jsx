import { useState, useEffect, useMemo, useRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

// Strip footnote refs
function cleanTr(str) {
  if (!str) return '';
  return str.replace(/\s*\{[^}]*\}/g, '').replace(/\s*\[\d[^\]]*\]/g, '').trim();
}

// Basic Arabic diacritic strip
function stripHarakat(str) {
  if (!str) return '';
  return str
    .normalize('NFC')
    .replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED]/g, '')
    .replace(/\u0640/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/[ىئ]/g, 'ي')
    .trim();
}

function normalizeTr(str) {
  if (!str) return '';
  return str.toLowerCase()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/â/g, 'a').replace(/î/g, 'i').replace(/û/g, 'u');
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
  'Ez-Zilzâl','El-Âdiyât','El-Kâria','Et-Tekâsür','El-Asr','El-Hümeze',
  'El-Fîl','Kureyş','El-Mâûn','El-Kevser','El-Kâfirûn','En-Nasr',
  'El-Mesed','El-İhlâs','El-Felak','En-Nâs',
];

// Preset interesting searches
const PRESETS_TR = [
  { label: 'Allah', term: 'الله', lang: 'ar' },
  { label: 'Rahmet', term: 'rahmet', lang: 'tr' },
  { label: 'Cennet', term: 'cennet', lang: 'tr' },
  { label: 'Cehennem', term: 'cehennem', lang: 'tr' },
  { label: 'Sabır', term: 'sabr', lang: 'tr' },
  { label: 'Hayat', term: 'hayat', lang: 'tr' },
  { label: 'Ölüm', term: 'ölüm', lang: 'tr' },
  { label: 'Musa', term: 'musa', lang: 'tr' },
  { label: 'İsa', term: 'isa', lang: 'tr' },
  { label: 'İbrahim', term: 'ibrahim', lang: 'tr' },
];

const PRESETS_EN = [
  { label: 'Allah', term: 'الله', lang: 'ar' },
  { label: 'Mercy', term: 'mercy', lang: 'en' },
  { label: 'Paradise', term: 'paradise', lang: 'en' },
  { label: 'Fire', term: 'fire', lang: 'en' },
  { label: 'Life', term: 'life', lang: 'en' },
  { label: 'Death', term: 'death', lang: 'en' },
  { label: 'Moses', term: 'moses', lang: 'en' },
  { label: 'Jesus', term: 'jesus', lang: 'en' },
  { label: 'Abraham', term: 'abraham', lang: 'en' },
  { label: 'Prayer', term: 'prayer', lang: 'en' },
];

// Count per-surah occurrences of a search term
function computeFrequency(verses, term, language) {
  if (!verses || !term || term.length < 2) return {};
  const isArabic = /[\u0600-\u06FF]/.test(term);
  const normTerm = isArabic ? stripHarakat(term) : normalizeTr(term);
  const counts = {};
  for (const v of verses) {
    let text;
    if (isArabic) {
      text = stripHarakat(v.arabic);
    } else {
      text = normalizeTr(language === 'tr' ? (cleanTr(v.turkish) || v.english) : (v.english || cleanTr(v.turkish)));
    }
    if (text.includes(normTerm)) {
      // Count occurrences within this verse
      let count = 0, idx = 0;
      while ((idx = text.indexOf(normTerm, idx)) !== -1) { count++; idx += normTerm.length; }
      counts[v.surah] = (counts[v.surah] || 0) + count;
    }
  }
  return counts;
}

// Matching verses for a surah
function getMatchingVerses(verses, surah, term, language) {
  if (!verses || !term || term.length < 2) return [];
  const isArabic = /[\u0600-\u06FF]/.test(term);
  const normTerm = isArabic ? stripHarakat(term) : normalizeTr(term);
  return verses.filter(v => {
    if (v.surah !== surah) return false;
    const text = isArabic
      ? stripHarakat(v.arabic)
      : normalizeTr(language === 'tr' ? (cleanTr(v.turkish) || v.english) : (v.english || cleanTr(v.turkish)));
    return text.includes(normTerm);
  }).sort((a, b) => a.ayah - b.ayah);
}

export default function WordHeatmap({ onClose }) {
  const { language } = useLanguage();
  const [verses, setVerses] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [selectedSurah, setSelectedSurah] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    fetch('/verse-graph.json').then(r => r.json()).then(d => { setVerses(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  const presets = language === 'tr' ? PRESETS_TR : PRESETS_EN;

  const freqMap = useMemo(() => computeFrequency(verses, searchTerm, language), [verses, searchTerm, language]);

  const maxFreq = useMemo(() => Math.max(...Object.values(freqMap), 1), [freqMap]);
  const totalOccurrences = useMemo(() => Object.values(freqMap).reduce((a, b) => a + b, 0), [freqMap]);
  const topSurahs = useMemo(() => Object.entries(freqMap).sort((a, b) => b[1] - a[1]).slice(0, 5), [freqMap]);

  const matchingVerses = useMemo(() => {
    if (!selectedSurah) return [];
    return getMatchingVerses(verses, selectedSurah, searchTerm, language);
  }, [verses, selectedSurah, searchTerm, language]);

  const gold = '#d4a574';

  const handleSearch = (term) => {
    setInputValue(term);
    setSearchTerm(term);
    setSelectedSurah(null);
  };

  // Color: transparent → gold based on normalized frequency
  const cellColor = (surah) => {
    const count = freqMap[surah] || 0;
    if (count === 0) return 'rgba(255,255,255,0.03)';
    const intensity = count / maxFreq;
    const r = Math.round(180 + intensity * 32);
    const g = Math.round(120 + intensity * 45);
    const b = Math.round(60 + intensity * 16);
    return `rgba(${r},${g},${b},${0.15 + intensity * 0.7})`;
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#080a1e', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', height: '54px', flexShrink: 0,
        background: 'rgba(8,10,18,0.95)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(212,165,116,0.1)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ color: gold, fontWeight: 700, fontSize: '0.9rem' }}>
            {language === 'tr' ? 'Kelime Frekans Haritası' : 'Word Frequency Map'}
          </span>
          {totalOccurrences > 0 && searchTerm && (
            <span style={{ background: 'rgba(212,165,116,0.1)', border: '1px solid rgba(212,165,116,0.2)', borderRadius: '12px', color: gold, fontSize: '0.7rem', padding: '2px 10px' }}>
              {totalOccurrences} {language === 'tr' ? 'kez' : 'times'} · {Object.keys(freqMap).length} {language === 'tr' ? 'sûre' : 'surahs'}
            </span>
          )}
        </div>
        <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', color: '#64748b', cursor: 'pointer', padding: '4px 10px', fontSize: '0.8rem' }}>✕</button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Search input */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            ref={inputRef}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSearch(inputValue); }}
            dir="auto"
            placeholder={language === 'tr' ? 'Kelime veya Arapça ara... (Enter)' : 'Search word or Arabic... (Enter)'}
            style={{
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,165,116,0.25)',
              borderRadius: '8px', color: '#e8e6e3', padding: '8px 14px',
              fontSize: '0.88rem', outline: 'none', minWidth: '220px', flex: 1,
            }}
          />
          <button onClick={() => handleSearch(inputValue)} style={{
            background: 'rgba(212,165,116,0.12)', border: '1px solid rgba(212,165,116,0.3)',
            borderRadius: '8px', color: gold, cursor: 'pointer', padding: '8px 16px', fontSize: '0.82rem', fontWeight: 600,
          }}>
            {language === 'tr' ? 'Ara' : 'Search'}
          </button>
        </div>

        {/* Presets */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {presets.map(p => (
            <button key={p.term} onClick={() => handleSearch(p.term)} style={{
              background: searchTerm === p.term ? 'rgba(212,165,116,0.2)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${searchTerm === p.term ? 'rgba(212,165,116,0.4)' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: '16px', color: searchTerm === p.term ? gold : '#94a3b8',
              cursor: 'pointer', padding: '4px 12px', fontSize: '0.75rem', transition: 'all 0.15s',
            }}>
              {p.label}
            </button>
          ))}
        </div>

        {loading && <div style={{ color: '#64748b', fontSize: '0.85rem', textAlign: 'center', padding: '40px' }}>{language === 'tr' ? 'Yükleniyor...' : 'Loading...'}</div>}

        {!loading && !searchTerm && (
          <div style={{ color: '#4a5568', fontSize: '0.85rem', textAlign: 'center', padding: '40px' }}>
            {language === 'tr' ? 'Bir kelime arayın veya yukarıdan seçin' : 'Search for a word or pick one above'}
          </div>
        )}

        {!loading && searchTerm && totalOccurrences === 0 && (
          <div style={{ color: '#64748b', fontSize: '0.85rem', textAlign: 'center', padding: '40px' }}>
            {language === 'tr' ? `"${searchTerm}" bulunamadı` : `"${searchTerm}" not found`}
          </div>
        )}

        {!loading && searchTerm && totalOccurrences > 0 && (
          <>
            {/* Top 5 surahs */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {topSurahs.map(([surah, count]) => (
                <button key={surah} onClick={() => setSelectedSurah(selectedSurah === +surah ? null : +surah)} style={{
                  background: selectedSurah === +surah ? 'rgba(212,165,116,0.18)' : 'rgba(212,165,116,0.07)',
                  border: `1px solid ${selectedSurah === +surah ? 'rgba(212,165,116,0.4)' : 'rgba(212,165,116,0.18)'}`,
                  borderRadius: '8px', color: gold, cursor: 'pointer', padding: '5px 12px',
                  fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '5px', transition: 'all 0.15s',
                }}>
                  <span style={{ color: '#64748b', fontSize: '0.68rem' }}>{surah}.</span>
                  {SURAH_NAMES_TR[+surah - 1]}
                  <span style={{ background: 'rgba(212,165,116,0.2)', borderRadius: '8px', padding: '0 5px', fontSize: '0.68rem', fontWeight: 700 }}>{count}</span>
                </button>
              ))}
            </div>

            {/* Heatmap grid: 10 columns */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '3px' }}>
              {Array.from({ length: 114 }, (_, i) => i + 1).map(surah => {
                const count = freqMap[surah] || 0;
                const isSelected = selectedSurah === surah;
                const name = SURAH_NAMES_TR[surah - 1];
                return (
                  <button
                    key={surah}
                    onClick={() => setSelectedSurah(isSelected ? null : surah)}
                    title={`${surah}. ${name} — ${count} ${language === 'tr' ? 'kez' : 'times'}`}
                    style={{
                      background: isSelected ? 'rgba(212,165,116,0.35)' : cellColor(surah),
                      border: `1px solid ${isSelected ? 'rgba(212,165,116,0.6)' : count > 0 ? 'rgba(212,165,116,0.25)' : 'rgba(255,255,255,0.04)'}`,
                      borderRadius: '4px', aspectRatio: '1', cursor: 'pointer',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.15s', padding: '2px',
                    }}
                    onMouseEnter={e => { if (!isSelected) e.currentTarget.style.border = '1px solid rgba(212,165,116,0.4)'; }}
                    onMouseLeave={e => { if (!isSelected) e.currentTarget.style.border = `1px solid ${count > 0 ? 'rgba(212,165,116,0.25)' : 'rgba(255,255,255,0.04)'}`; }}
                  >
                    <span style={{ color: count > 0 ? '#e8c98a' : '#2d3748', fontSize: '0.58rem', lineHeight: 1 }}>{surah}</span>
                    {count > 0 && <span style={{ color: gold, fontSize: '0.55rem', fontWeight: 700, lineHeight: 1 }}>{count}</span>}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
              <span style={{ color: '#4a5568', fontSize: '0.65rem' }}>{language === 'tr' ? 'Az' : 'Fewer'}</span>
              <div style={{ display: 'flex', gap: '2px' }}>
                {[0.1, 0.3, 0.5, 0.7, 1.0].map((v, i) => (
                  <div key={i} style={{ width: '16px', height: '8px', borderRadius: '2px', background: `rgba(${Math.round(180 + v*32)},${Math.round(120 + v*45)},${Math.round(60 + v*16)},${0.15 + v * 0.7})` }} />
                ))}
              </div>
              <span style={{ color: '#4a5568', fontSize: '0.65rem' }}>{language === 'tr' ? 'Çok' : 'More'}</span>
            </div>
          </>
        )}

        {/* Selected surah verse list */}
        {selectedSurah && matchingVerses.length > 0 && (
          <div style={{ marginTop: '8px' }}>
            <div style={{ color: gold, fontSize: '0.75rem', fontWeight: 700, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {selectedSurah}. {SURAH_NAMES_TR[selectedSurah - 1]} — {matchingVerses.length} {language === 'tr' ? 'ayet' : 'verses'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {matchingVerses.map(v => {
                const vt = language === 'tr' ? (cleanTr(v.turkish) || v.english) : (v.english || cleanTr(v.turkish));
                return (
                  <div key={v.id} style={{
                    background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(212,165,116,0.1)',
                    borderRadius: '8px', padding: '12px 14px',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ color: '#64748b', fontSize: '0.68rem' }}>{v.id}</span>
                    </div>
                    <div style={{ fontFamily: "'Amiri', serif", fontSize: '1.3rem', lineHeight: 1.9, color: '#d4b483', textAlign: 'right', direction: 'rtl', marginBottom: '8px' }}>
                      {v.arabic}
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '0.82rem', lineHeight: 1.7 }}>{vt}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
