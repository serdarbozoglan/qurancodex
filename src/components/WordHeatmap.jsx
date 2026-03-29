import { useState, useEffect, useMemo, useRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

// Strip footnote refs and parenthetical translator additions
function cleanTr(str) {
  if (!str) return '';
  return str
    .replace(/\s*\{[^}]*\}/g, '')    // {footnote}
    .replace(/\s*\[\d[^\]]*\]/g, '')  // [1]
    .replace(/\([^)]{1,80}\)/g, ' ')  // (mütercim açıklaması) — max 80 char, Kur'an metni değil
    .replace(/\s+/g, ' ')
    .trim();
}

// Arabic display cleanup — strips waqf markers, sajda signs, rub el hizb etc.
function cleanArabic(str) {
  if (!str) return str;
  return str
    .replace(/\u06EA/g, '\u0650')
    .replace(/\u0671/g, '\u0627')
    .replace(/\u06CC/g, '\u064A')
    .replace(/[\u0610-\u0614\u0616\u0617]/g, '')
    .replace(/[\u0600-\u0605]/g, '')
    .replace(/[\u06DD\u06DE\u06E9]/g, '')
    .replace(/\u06E6/g, ' ')
    .replace(/[\u0615\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EB\u06ED]/g, '')
    .replace(/[\uFD3E\uFD3F]/g, '');
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
  'Sebe\'','Fâtır','Yâ-Sîn','Es-Sâffât','Sâd','Ez-Zümer',"Mü'min",
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
  'Tebbet','El-İhlâs','El-Felak','En-Nâs',
];

const PRESETS_TR = [
  // Kavramlar — Allah önce, geri kalanı alfabetik (en çok aranan 15)
  { label: 'Allah', term: 'allah', group: 'kavram' },
  { label: 'Cehennem', term: 'cehennem', group: 'kavram' },
  { label: 'Cennet', term: 'cennet', group: 'kavram' },
  { label: 'Hz. İbrahim', term: 'ibrahim', group: 'kavram' },
  { label: 'Hz. İsa', term: 'isa', group: 'kavram' },
  { label: 'Hz. Musa', term: 'musa', group: 'kavram' },
  { label: 'Hz. Nuh', term: 'nuh', group: 'kavram' },
  { label: 'Hz. Yusuf', term: 'yusuf', group: 'kavram' },
  { label: 'İman', term: 'iman', group: 'kavram' },
  { label: 'Kıyamet', term: 'kıyamet', group: 'kavram' },
  { label: 'Melek', term: 'melek', group: 'kavram' },
  { label: 'Rahmet', term: 'rahmet', group: 'kavram' },
  { label: 'Sabır', term: 'sabır', group: 'kavram' },
  { label: 'Şeytan', term: 'şeytan', group: 'kavram' },
  { label: 'Takva', term: 'takva', group: 'kavram' },
  { label: 'Tövbe', term: 'tövbe', group: 'kavram' },
  // Tekrarlayan Kalıplar — sıklık sırasına göre, doğrulanmış frekanslar
  { label: 'رَبُّ الْعَالَمِينَ', desc: 'Âlemlerin Rabbi · ×42', term: 'رب العالمين', group: 'kalıp' },
  { label: 'غَفُورٌ رَّحِيمٌ', desc: 'Çok Bağışlayan, Merhametli · ×49', term: 'غفور رحيم', group: 'kalıp' },
  { label: 'عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ', desc: 'Her şeye kadirdir · ×35', term: 'على كل شيء قدير', group: 'kalıp' },
  { label: 'تَجْرِي مِن تَحْتِهَا الْأَنْهَارُ', desc: 'Altından ırmaklar akan cennet · ×34', term: 'تجري من تحتها الانهار', group: 'kalıp' },
  { label: 'فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ', desc: 'Rabbinizin hangi nimetini yalanlarsınız? · ×31', term: 'فبأي آلاء ربكما تكذبان', group: 'kalıp' },
  { label: 'أَهْلَكْنَا', desc: 'Helak ettik · ×28', term: 'أهلكنا', group: 'kalıp' },
  { label: 'سَمِيعٌ عَلِيمٌ', desc: 'İşiten, Bilen · ×16', term: 'سميع عليم', group: 'kalıp' },
  { label: 'عَلِيمٌ حَكِيمٌ', desc: 'Her şeyi Bilen, Hikmet Sahibi · ×15', term: 'عليم حكيم', group: 'kalıp' },
  { label: 'عَزِيزٌ حَكِيمٌ', desc: 'Güçlü, Hikmet Sahibi · ×13', term: 'عزيز حكيم', group: 'kalıp' },
  { label: 'وَيْلٌ يَوْمَئِذٍ لِّلْمُكَذِّبِينَ', desc: 'O gün yalanlayanların vay haline! · ×12', term: 'ويل يومئذ للمكذبين', group: 'kalıp' },
  { label: 'أَفَلَا تَعْقِلُونَ', desc: 'Hâlâ akletmez misiniz? · ×12', term: 'أفلا تعقلون', group: 'kalıp' },
  { label: 'عَالِمُ الْغَيْبِ وَالشَّهَادَةِ', desc: 'Görünen-görünmeyeni bilen · ×10', term: 'عالم الغيب والشهادة', group: 'kalıp' },
  { label: 'فَاطِرِ السَّمَاوَاتِ وَالْأَرْضِ', desc: 'Göklerin ve yerin yaratıcısı · ×6', term: 'فاطر السموات', group: 'kalıp' },
  { label: 'فَكَيْفَ كَانَ عَذَابِي وَنُذُرِ', desc: 'Azabım ve uyarılarım nasıldı! · ×4', term: 'كيف كان عذابي ونذر', group: 'kalıp' },
  { label: 'شَدِيدُ الْعِقَابِ', desc: 'Azabı çok şiddetlidir · ×14', term: 'شديد العقاب', group: 'kalıp' },
  { label: 'لَعَلَّكُمْ تَشْكُرُونَ', desc: 'Belki şükredersiniz · ×14', term: 'لعلكم تشكرون', group: 'kalıp' },
  { label: 'لَعَلَّكُمْ تُفْلِحُونَ', desc: 'Belki kurtuluşa erersiniz · ×11', term: 'لعلكم تفلحون', group: 'kalıp' },
  { label: 'لَعَلَّكُمْ تَعْقِلُونَ', desc: 'Belki aklınızı kullanırsınız · ×8', term: 'لعلكم تعقلون', group: 'kalıp' },
];

const PRESETS_EN = [
  // Concepts
  { label: 'Allah', term: 'allah', group: 'concept' },
  { label: 'Mercy', term: 'mercy', group: 'concept' },
  { label: 'Paradise', term: 'paradise', group: 'concept' },
  { label: 'Fire', term: 'fire', group: 'concept' },
  { label: 'Life', term: 'life', group: 'concept' },
  { label: 'Death', term: 'death', group: 'concept' },
  { label: 'Day of Judgment', term: 'day of judgment', group: 'concept' },
  { label: 'Hereafter', term: 'hereafter', group: 'concept' },
  { label: 'Faith', term: 'faith', group: 'concept' },
  { label: 'Patience', term: 'patient', group: 'concept' },
  { label: 'Repentance', term: 'repent', group: 'concept' },
  { label: 'Angel', term: 'angel', group: 'concept' },
  { label: 'Satan', term: 'satan', group: 'concept' },
  { label: 'Moses', term: 'moses', group: 'concept' },
  { label: 'Abraham', term: 'abraham', group: 'concept' },
  { label: 'Jesus', term: 'jesus', group: 'concept' },
  { label: 'Noah', term: 'noah', group: 'concept' },
  // Recurring patterns
  { label: 'Which of your Lord\'s favours will you deny?', term: 'favours of your lord', group: 'pattern' },
  { label: 'Gardens with rivers flowing beneath', term: 'rivers flowing', group: 'pattern' },
  { label: 'Allah is capable of all things', term: 'capable of all', group: 'pattern' },
  { label: 'Wise', term: 'all-wise', group: 'pattern' },
  { label: 'The Forgiving', term: 'forgiving', group: 'pattern' },
];

// Proper name transliteration → Arabic. When a Latin input matches a key here,
// the search is automatically redirected to the Arabic text, giving accurate counts
// instead of counting translator additions in the Turkish meal.
const PROPER_NAMES_AR = {
  'muhammed':  'محمد',
  'ahmed':     'احمد',
  'musa':      'موسى',
  'isa':       'عيسى',
  'ibrahim':   'ابراهيم',
  'nuh':       'نوح',
  'yusuf':     'يوسف',
  'yahya':     'يحيى',
  'zekeriya':  'زكريا',
  'idris':     'ادريس',
  'adem':      'ادم',
  'davud':     'داود',
  'suleyman':  'سليمان',
  'ilyas':     'الياس',
  'elyesa':    'اليسع',
  'yunus':     'يونس',
  'eyyub':     'ايوب',
  'ishak':     'اسحاق',
  'ismail':    'اسماعيل',
  'yakub':     'يعقوب',
  'harun':     'هارون',
  'salih':     'صالح',
  'hud':       'هود',
  'lut':       'لوط',
  'meryem':    'مريم',
  'lokman':    'لقمان',
  'zulkarneyn':'ذو القرنين',
};

// Returns the effective search term and whether to search Arabic.
// Latin proper names are redirected to Arabic to avoid counting translator additions.
function resolveSearch(term) {
  if (!term) return { term, isArabic: false };
  if (/[\u0600-\u06FF]/.test(term)) return { term, isArabic: true };
  const key = normalizeTr(term.trim().toLowerCase());
  const arEquiv = PROPER_NAMES_AR[key];
  return arEquiv ? { term: arEquiv, isArabic: true } : { term, isArabic: false };
}

// Count per-surah occurrences of a search term
function computeFrequency(verses, term, language, isArabic) {
  if (!verses || !term || term.length < 2) return {};
  const normTerm = isArabic ? stripHarakat(term) : normalizeTr(term);
  const counts = {};
  for (const v of verses) {
    const text = isArabic
      ? stripHarakat(v.arabic)
      : normalizeTr(language === 'tr' ? (cleanTr(v.turkish) || v.english) : (v.english || cleanTr(v.turkish)));
    if (text.includes(normTerm)) {
      let count = 0, idx = 0;
      while ((idx = text.indexOf(normTerm, idx)) !== -1) { count++; idx += normTerm.length; }
      counts[v.surah] = (counts[v.surah] || 0) + count;
    }
  }
  return counts;
}

// Highlight search term in text, returns array of strings/JSX
const HARAKAT_SET = new Set('\u0610\u0611\u0612\u0613\u0614\u0615\u0616\u0617\u0618\u0619\u061A\u064B\u064C\u064D\u064E\u064F\u0650\u0651\u0652\u0653\u0654\u0655\u0656\u0657\u0658\u0659\u065A\u065B\u065C\u065D\u065E\u065F\u0670\u06D6\u06D7\u06D8\u06D9\u06DA\u06DB\u06DC\u06DF\u06E0\u06E1\u06E2\u06E3\u06E4\u06E7\u06E8\u06EA\u06EB\u06EC\u06ED\u0640'.split(''));

function highlightText(text, term, isArabic) {
  if (!text || !term || term.length < 2) return text;
  const normText = isArabic ? stripHarakat(text) : normalizeTr(text);
  const normTerm = isArabic ? stripHarakat(term) : normalizeTr(term);
  if (!normText.includes(normTerm)) return text;

  const hlStyle = { background: 'rgba(212,165,116,0.32)', borderRadius: '3px', color: '#f5e4a8', padding: '0 2px' };

  if (isArabic) {
    // Build char map: stripped index → original text index
    const charMap = [];
    for (let i = 0; i < text.length; i++) {
      if (!HARAKAT_SET.has(text[i])) charMap.push(i);
    }
    const parts = [];
    let lastOrig = 0, searchFrom = 0, mi;
    while ((mi = normText.indexOf(normTerm, searchFrom)) !== -1) {
      const origStart = charMap[mi] ?? text.length;
      const origEnd = mi + normTerm.length < charMap.length ? charMap[mi + normTerm.length] : text.length;
      if (origStart > lastOrig) parts.push(text.slice(lastOrig, origStart));
      parts.push(<span key={mi} style={hlStyle}>{text.slice(origStart, origEnd)}</span>);
      lastOrig = origEnd;
      searchFrom = mi + normTerm.length;
    }
    if (lastOrig < text.length) parts.push(text.slice(lastOrig));
    return parts;
  } else {
    const parts = [];
    let lastIdx = 0, searchFrom = 0, mi;
    while ((mi = normText.indexOf(normTerm, searchFrom)) !== -1) {
      if (mi > lastIdx) parts.push(text.slice(lastIdx, mi));
      parts.push(<span key={mi} style={hlStyle}>{text.slice(mi, mi + normTerm.length)}</span>);
      lastIdx = mi + normTerm.length;
      searchFrom = mi + normTerm.length;
    }
    if (lastIdx < text.length) parts.push(text.slice(lastIdx));
    return parts;
  }
}

// Matching verses for a surah
function getMatchingVerses(verses, surah, term, language, isArabic) {
  if (!verses || !term || term.length < 2) return [];
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
  // Default to Allah (الله) on first load
  const [searchTerm, setSearchTerm] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [activePreset, setActivePreset] = useState(null);
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [versePage, setVersePage] = useState(0);
  const [tooltip, setTooltip] = useState(null); // { surah, count, x, y }
  const [showAllKalip, setShowAllKalip] = useState(false);
  const [hoverKalip, setHoverKalip] = useState(null); // { desc, x, y }
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

  const { term: resolvedTerm, isArabic: isArabicSearch } = useMemo(
    () => resolveSearch(searchTerm),
    [searchTerm]
  );

  const freqMap = useMemo(() => computeFrequency(verses, resolvedTerm, language, isArabicSearch), [verses, resolvedTerm, language, isArabicSearch]);

  const maxFreq = useMemo(() => Math.max(...Object.values(freqMap), 1), [freqMap]);
  const totalOccurrences = useMemo(() => Object.values(freqMap).reduce((a, b) => a + b, 0), [freqMap]);
  const topSurahs = useMemo(() => Object.entries(freqMap).sort((a, b) => b[1] - a[1]).slice(0, 5), [freqMap]);

  const matchingVerses = useMemo(() => {
    if (!selectedSurah) return [];
    return getMatchingVerses(verses, selectedSurah, resolvedTerm, language, isArabicSearch);
  }, [verses, selectedSurah, resolvedTerm, language, isArabicSearch]);

  const gold = '#d4a574';

  const handleSearch = (term, presetLabel = null) => {
    // Second click on active preset → deselect (toggle off)
    if (presetLabel && activePreset?.term === term) {
      clearSearch();
      return;
    }
    setSearchTerm(term);
    setSelectedSurah(null);
    setVersePage(0);
    if (presetLabel) {
      setActivePreset({ label: presetLabel, term });
      setInputValue(term);
    } else {
      setActivePreset(null);
      setInputValue(term);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setInputValue('');
    setActivePreset(null);
    setSelectedSurah(null);
  };

  // Baseline: verse count per surah (for empty state)
  const surahVerseCounts = useMemo(() => {
    if (!verses) return {};
    const counts = {};
    for (const v of verses) counts[v.surah] = (counts[v.surah] || 0) + 1;
    return counts;
  }, [verses]);
  const maxVerseCount = useMemo(() => Math.max(...Object.values(surahVerseCounts), 1), [surahVerseCounts]);

  // Baseline cell color: sky-blue palette by verse count
  const baselineCellColor = (surah) => {
    const count = surahVerseCounts[surah] || 0;
    const intensity = count / maxVerseCount;
    return `rgba(52,152,219,${0.06 + intensity * 0.38})`;
  };

  // Color: dark-blue (zero) → gold based on normalized frequency
  const cellColor = (surah) => {
    const count = freqMap[surah] || 0;
    if (count === 0) return 'rgba(255,255,255,0.03)'; // faint — clearly empty but grid structure visible
    const intensity = count / maxFreq;
    const r = Math.round(180 + intensity * 32);
    const g = Math.round(120 + intensity * 45);
    const b = Math.round(60 + intensity * 16);
    return `rgba(${r},${g},${b},${0.15 + intensity * 0.7})`;
  };

  return (
    <>

    {/* Kalıp hover tooltip — outside overflow:hidden modal so it isn't clipped */}
    {hoverKalip && (
      <div style={{
        position: 'fixed', zIndex: 10020, pointerEvents: 'none',
        left: hoverKalip.x, top: hoverKalip.y - 38,
        background: 'rgba(6,8,20,0.97)', border: '1px solid rgba(212,165,116,0.3)',
        borderRadius: '7px', padding: '5px 11px', backdropFilter: 'blur(12px)',
        boxShadow: '0 6px 20px rgba(0,0,0,0.5)',
        whiteSpace: 'nowrap', fontSize: '0.72rem', color: '#94a3b8',
      }}>
        {hoverKalip.desc}
      </div>
    )}

    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#080a1e', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Floating tooltip */}
      {tooltip && (
        <div style={{
          position: 'fixed', zIndex: 10010, pointerEvents: 'none',
          left: tooltip.x + 14, top: tooltip.y - 10,
          background: 'rgba(6,8,20,0.97)', border: '1px solid rgba(212,165,116,0.35)',
          borderRadius: '8px', padding: '8px 12px', backdropFilter: 'blur(12px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
          maxWidth: '220px',
        }}>
          <div style={{ color: '#94a3b8', fontSize: '0.65rem', marginBottom: '2px' }}>{tooltip.surah}. {SURAH_NAMES_TR[tooltip.surah - 1]}</div>
          {tooltip.baseline
            ? <div style={{ color: 'rgba(52,152,219,0.85)', fontSize: '0.78rem', fontWeight: 600 }}>{surahVerseCounts[tooltip.surah] || 0} {language === 'tr' ? 'âyet' : 'verses'}</div>
            : tooltip.count > 0
              ? <div style={{ color: gold, fontSize: '0.82rem', fontWeight: 700 }}>{tooltip.count} {language === 'tr' ? 'kez' : 'times'}</div>
              : <div style={{ color: '#3a4a60', fontSize: '0.75rem' }}>{language === 'tr' ? 'Geçmiyor' : 'Not found'}</div>
          }
        </div>
      )}

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', height: '50px', flexShrink: 0,
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

      {/* Main layout: sidebar for verses + full-height grid area */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>

        {/* Left: controls + grid */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '14px 16px', gap: '10px', overflow: 'hidden', minHeight: 0 }}>

          {/* Search input — max-width to avoid spanning full ultra-wide panel */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0, maxWidth: '680px' }}>
            <input
              ref={inputRef}
              value={inputValue}
              onChange={e => {
                const v = e.target.value;
                setInputValue(v);
                if (activePreset) setActivePreset(null);
                if (!v) { setSearchTerm(''); setSelectedSurah(null); setVersePage(0); }
              }}
              onKeyDown={e => { if (e.key === 'Enter') handleSearch(inputValue); }}
              onFocus={e => e.target.select()}
              dir="auto"
              placeholder={language === 'tr' ? 'Kelime ara... (Enter)' : 'Search a word... (Enter)'}
              style={{
                background: activePreset ? 'rgba(212,165,116,0.08)' : 'rgba(255,255,255,0.06)',
                border: `1px solid ${activePreset ? 'rgba(212,165,116,0.4)' : 'rgba(212,165,116,0.25)'}`,
                borderRadius: '8px', color: '#e8e6e3', padding: '7px 14px',
                fontSize: '0.88rem', outline: 'none', flex: 1,
              }}
            />

            <button onClick={() => handleSearch(inputValue)} style={{ background: 'rgba(212,165,116,0.12)', border: '1px solid rgba(212,165,116,0.3)', borderRadius: '8px', color: gold, cursor: 'pointer', padding: '7px 16px', fontSize: '0.82rem', fontWeight: 600, flexShrink: 0 }}>
              {language === 'tr' ? 'Ara' : 'Search'}
            </button>
            {searchTerm && (
              <button onClick={clearSearch} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#4a5568', cursor: 'pointer', padding: '7px 10px', fontSize: '0.82rem', flexShrink: 0 }}>
                ✕
              </button>
            )}
          </div>

          {/* Presets */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flexShrink: 0 }}>
            {[
              { key: language === 'tr' ? 'kavram' : 'concept', label: language === 'tr' ? 'Örnek aramalar' : 'Example searches' },
              { key: language === 'tr' ? 'kalıp' : 'pattern', label: language === 'tr' ? 'Tekrarlayan kalıplar' : 'Recurring patterns' },
            ].map(group => {
              const isKalipGroup = group.key === 'kalıp' || group.key === 'pattern';
              const allGroupPresets = presets.filter(p => p.group === group.key);
              const KALIP_VISIBLE = 8;
              const groupPresets = isKalipGroup && !showAllKalip
                ? allGroupPresets.slice(0, KALIP_VISIBLE)
                : allGroupPresets;
              if (!allGroupPresets.length) return null;
              return (
                <div key={group.key}>
                  <div style={{ color: '#4a5568', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>{group.label}</div>
                  <div style={{
                    display: 'flex', gap: '4px',
                    flexWrap: isKalipGroup ? 'wrap' : 'nowrap',
                    overflowX: isKalipGroup ? 'visible' : 'auto',
                    paddingBottom: isKalipGroup ? 0 : '2px',
                  }}>
                    {groupPresets.map(p => {
                      const isKalip = isKalipGroup;
                      const isActive = searchTerm === p.term;
                      return (
                        <button key={p.term} onClick={() => handleSearch(p.term, p.label)}
                          onMouseEnter={isKalip && p.desc ? (e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setHoverKalip({ desc: p.desc, x: Math.max(8, rect.left), y: rect.top });
                          } : undefined}
                          onMouseLeave={isKalip && p.desc ? () => setHoverKalip(null) : undefined}
                          style={{
                            background: isActive ? 'rgba(212,165,116,0.2)' : 'rgba(255,255,255,0.04)',
                            border: `1px solid ${isActive ? 'rgba(212,165,116,0.4)' : 'rgba(255,255,255,0.08)'}`,
                            borderRadius: isKalip ? '10px' : '12px',
                            color: isActive ? gold : '#94a3b8',
                            cursor: 'pointer', transition: 'all 0.15s',
                            padding: isKalip ? '5px 12px' : '3px 10px',
                            textAlign: isKalip ? 'right' : 'left',
                            display: 'flex', flexDirection: 'column', alignItems: isKalip ? 'flex-end' : 'center',
                          }}>
                          <span style={isKalip ? { fontFamily: "'KFGQPC','Amiri Quran',serif", fontSize: '1.1rem', lineHeight: 1.6, direction: 'rtl' } : { fontSize: '0.85rem' }}>
                            {p.label}
                          </span>
                        </button>
                      );
                    })}
                    {isKalipGroup && allGroupPresets.length > KALIP_VISIBLE && (
                      <button onClick={() => setShowAllKalip(v => !v)} style={{
                        background: 'transparent', border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '10px', color: '#4a5568', cursor: 'pointer',
                        padding: '5px 12px', fontSize: '0.72rem', alignSelf: 'center',
                      }}>
                        {showAllKalip
                          ? (language === 'tr' ? '↑ Daha az' : '↑ Less')
                          : (language === 'tr' ? `+${allGroupPresets.length - KALIP_VISIBLE} daha` : `+${allGroupPresets.length - KALIP_VISIBLE} more`)}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Loading */}
          {loading && <div style={{ color: '#64748b', fontSize: '0.85rem', textAlign: 'center', padding: '40px' }}>{language === 'tr' ? 'Yükleniyor...' : 'Loading...'}</div>}

          {/* Not found */}
          {!loading && searchTerm && totalOccurrences === 0 && (
            <div style={{ color: '#64748b', fontSize: '0.85rem', textAlign: 'center', padding: '40px' }}>{language === 'tr' ? `"${searchTerm}" bulunamadı` : `"${searchTerm}" not found`}</div>
          )}

          {/* Grid — always visible when data is loaded (baseline or search mode) */}
          {!loading && verses && !(searchTerm && totalOccurrences === 0) && (
            <>
              {/* Top surahs — only when searching */}
              {searchTerm && totalOccurrences > 0 && (
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', flexShrink: 0 }}>
                  {topSurahs.map(([surah, count]) => (
                    <button key={surah} onClick={() => { setSelectedSurah(selectedSurah === +surah ? null : +surah); setVersePage(0); }} style={{
                      background: selectedSurah === +surah ? 'rgba(212,165,116,0.18)' : 'rgba(212,165,116,0.07)',
                      border: `1px solid ${selectedSurah === +surah ? 'rgba(212,165,116,0.4)' : 'rgba(212,165,116,0.18)'}`,
                      borderRadius: '8px', color: gold, cursor: 'pointer', padding: '4px 10px',
                      fontSize: '0.73rem', display: 'flex', alignItems: 'center', gap: '4px', transition: 'all 0.15s',
                    }}>
                      <span style={{ color: '#64748b', fontSize: '0.65rem' }}>{surah}.</span>
                      {SURAH_NAMES_TR[+surah - 1]}
                      <span style={{ background: 'rgba(212,165,116,0.2)', borderRadius: '6px', padding: '0 5px', fontSize: '0.65rem', fontWeight: 700 }}>{count}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Grid — fills remaining height */}
              <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
                <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gridTemplateRows: 'repeat(12, 1fr)', gap: '3px' }}>
                  {Array.from({ length: 114 }, (_, i) => i + 1).map(surah => {
                    const count = searchTerm ? (freqMap[surah] || 0) : 0;
                    const isSelected = selectedSurah === surah;
                    const isBaseline = !searchTerm;
                    const bg = isSelected
                      ? 'rgba(212,165,116,0.4)'
                      : isBaseline
                        ? baselineCellColor(surah)
                        : cellColor(surah);
                    const border = isSelected
                      ? '1px solid rgba(212,165,116,0.7)'
                      : isBaseline
                        ? '1px solid rgba(52,152,219,0.15)'
                        : `1px solid ${count > 0 ? 'rgba(212,165,116,0.2)' : 'rgba(255,255,255,0.07)'}`;
                    const hoverOutline = isBaseline ? 'rgba(52,152,219,0.5)' : 'rgba(212,165,116,0.6)';
                    return (
                      <button
                        key={surah}
                        onClick={() => {
                          if (isBaseline) return; // no selection in baseline mode
                          setSelectedSurah(isSelected ? null : surah);
                          setVersePage(0);
                        }}
                        onMouseEnter={e => {
                          setTooltip({ surah, count, x: e.clientX, y: e.clientY, baseline: isBaseline });
                          if (!isSelected) { e.currentTarget.style.filter = 'brightness(1.5)'; e.currentTarget.style.outline = `1px solid ${hoverOutline}`; }
                        }}
                        onMouseMove={e => setTooltip(t => t ? { ...t, x: e.clientX, y: e.clientY } : null)}
                        onMouseLeave={e => {
                          setTooltip(null);
                          if (!isSelected) { e.currentTarget.style.filter = 'none'; e.currentTarget.style.outline = 'none'; }
                        }}
                        style={{
                          background: bg, border, borderRadius: '3px',
                          cursor: isBaseline ? 'default' : 'pointer',
                          transition: 'filter 0.1s', padding: 0,
                          outline: isSelected ? '2px solid rgba(212,165,116,0.5)' : 'none',
                          width: '100%', height: '100%', display: 'block',
                        }}
                      />
                    );
                  })}
                </div>

                {/* Baseline overlay label */}
                {!searchTerm && (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                    <div style={{ textAlign: 'center', background: 'rgba(10,10,26,0.6)', backdropFilter: 'blur(6px)', borderRadius: '12px', padding: '16px 24px', border: '1px solid rgba(52,152,219,0.2)' }}>
                      <div style={{ fontFamily: "'KFGQPC','Amiri Quran',serif", fontSize: '1.6rem', color: 'rgba(212,165,116,0.45)', direction: 'rtl', marginBottom: '8px', lineHeight: 1.5 }}>
                        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                      </div>
                      <div style={{ color: 'rgba(52,152,219,0.7)', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '4px' }}>
                        {language === 'tr' ? '114 sûre · 6.236 âyet · her hücre = 1 sûre' : '114 surahs · 6,236 verses · each cell = 1 surah'}
                      </div>
                      <div style={{ color: '#4a5568', fontSize: '0.72rem' }}>
                        {language === 'tr' ? 'Renk yoğunluğu → âyet sayısı' : 'Color intensity → verse count'}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Legend */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end', flexShrink: 0 }}>
                {searchTerm ? (
                  <>
                    <span style={{ color: '#4a5568', fontSize: '0.62rem' }}>{language === 'tr' ? 'Frekans: Az' : 'Frequency: Less'}</span>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {[0.05, 0.2, 0.4, 0.65, 1.0].map((v, i) => (
                        <div key={i} style={{ width: '18px', height: '8px', borderRadius: '2px', background: `rgba(${Math.round(180+v*32)},${Math.round(120+v*45)},${Math.round(60+v*16)},${0.15+v*0.7})` }} />
                      ))}
                    </div>
                    <span style={{ color: '#4a5568', fontSize: '0.62rem' }}>{language === 'tr' ? 'Çok' : 'More'}</span>
                  </>
                ) : (
                  <>
                    <span style={{ color: '#4a5568', fontSize: '0.62rem' }}>{language === 'tr' ? 'Âyet sayısı: Az' : 'Verse count: Few'}</span>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {[0.1, 0.25, 0.45, 0.65, 1.0].map((v, i) => (
                        <div key={i} style={{ width: '18px', height: '8px', borderRadius: '2px', background: `rgba(52,152,219,${0.06 + v * 0.38})` }} />
                      ))}
                    </div>
                    <span style={{ color: '#4a5568', fontSize: '0.62rem' }}>{language === 'tr' ? 'Çok' : 'Many'}</span>
                  </>
                )}
              </div>
            </>
          )}
        </div>

        {/* Right: verse panel (when surah selected) */}
        {selectedSurah && matchingVerses.length > 0 && (() => {
          const PAGE_SIZE = 7;
          const totalPages = Math.ceil(matchingVerses.length / PAGE_SIZE);
          const pageVerses = matchingVerses.slice(versePage * PAGE_SIZE, (versePage + 1) * PAGE_SIZE);
          const surahOccurrences = freqMap[selectedSurah] || 0;

          return (
            <div style={{
              width: '400px', flexShrink: 0, borderLeft: '1px solid rgba(212,165,116,0.12)',
              background: 'rgba(6,8,18,0.98)', display: 'flex', flexDirection: 'column', overflow: 'hidden',
            }}>
              {/* Panel header */}
              <div style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: gold, fontSize: '0.82rem', fontWeight: 700 }}>{selectedSurah}. {SURAH_NAMES_TR[selectedSurah - 1]}</span>
                  <button onClick={() => { setSelectedSurah(null); setVersePage(0); }} style={{ background: 'none', border: 'none', color: '#4a5568', cursor: 'pointer', fontSize: '1rem', padding: '0 4px' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#94a3b8'}
                    onMouseLeave={e => e.currentTarget.style.color = '#4a5568'}>✕</button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: '#4a5568', fontSize: '0.68rem' }}>
                    {matchingVerses.length} {language === 'tr' ? 'ayet' : 'verses'}
                    {surahOccurrences !== matchingVerses.length && (
                      <span style={{ color: '#3a4555', marginLeft: '4px' }}>· {surahOccurrences} {language === 'tr' ? 'kez' : 'times'}</span>
                    )}
                  </span>
                  {/* Pagination controls */}
                  {totalPages > 1 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto' }}>
                      <button
                        onClick={() => setVersePage(p => Math.max(0, p - 1))}
                        disabled={versePage === 0}
                        style={{ background: 'none', border: '1px solid rgba(212,165,116,0.2)', borderRadius: '4px', color: versePage === 0 ? '#2a3040' : '#94a3b8', cursor: versePage === 0 ? 'default' : 'pointer', padding: '2px 8px', fontSize: '0.8rem' }}>‹</button>
                      <span style={{ color: '#4a5568', fontSize: '0.68rem', minWidth: '44px', textAlign: 'center' }}>
                        {versePage + 1} / {totalPages}
                      </span>
                      <button
                        onClick={() => setVersePage(p => Math.min(totalPages - 1, p + 1))}
                        disabled={versePage === totalPages - 1}
                        style={{ background: 'none', border: '1px solid rgba(212,165,116,0.2)', borderRadius: '4px', color: versePage === totalPages - 1 ? '#2a3040' : '#94a3b8', cursor: versePage === totalPages - 1 ? 'default' : 'pointer', padding: '2px 8px', fontSize: '0.8rem' }}>›</button>
                    </div>
                  )}
                </div>
              </div>

              {/* Verse list — current page only, meâl only (clean render) */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {pageVerses.map(v => {
                  const vt = language === 'tr' ? (cleanTr(v.turkish) || v.english) : (v.english || cleanTr(v.turkish));
                  const latinContent = vt ? highlightText(vt, isArabicSearch ? '' : resolvedTerm, false) : vt;
                  const arabicContent = isArabicSearch
                    ? highlightText(cleanArabic(v.arabic), resolvedTerm, true)
                    : cleanArabic(v.arabic);
                  return (
                    <div key={v.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px' }}>
                      {/* Verse ID */}
                      <div style={{ color: gold, fontSize: '0.7rem', fontWeight: 700, marginBottom: '5px' }}>{v.id}</div>
                      {/* Arabic — always shown */}
                      {v.arabic && (
                        <div style={{ fontFamily: "'KFGQPC','Amiri Quran',serif", fontSize: '0.95rem', lineHeight: 1.9, color: 'rgba(212,165,116,0.55)', textAlign: 'right', direction: 'rtl', marginBottom: '4px' }}>
                          {arabicContent}
                        </div>
                      )}
                      {/* Meâl */}
                      {vt && (
                        <div style={{ color: '#bbb8b2', fontSize: '0.84rem', lineHeight: 1.7 }}>
                          {latinContent}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Bottom pagination (repeat for convenience) */}
              {totalPages > 1 && (
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '8px 14px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  <button onClick={() => setVersePage(p => Math.max(0, p - 1))} disabled={versePage === 0}
                    style={{ background: 'rgba(212,165,116,0.06)', border: '1px solid rgba(212,165,116,0.18)', borderRadius: '6px', color: versePage === 0 ? '#2a3040' : gold, cursor: versePage === 0 ? 'default' : 'pointer', padding: '4px 14px', fontSize: '0.8rem' }}>
                    ‹ {language === 'tr' ? 'Önceki' : 'Prev'}
                  </button>
                  <span style={{ color: '#4a5568', fontSize: '0.72rem' }}>{versePage + 1} / {totalPages}</span>
                  <button onClick={() => setVersePage(p => Math.min(totalPages - 1, p + 1))} disabled={versePage === totalPages - 1}
                    style={{ background: 'rgba(212,165,116,0.06)', border: '1px solid rgba(212,165,116,0.18)', borderRadius: '6px', color: versePage === totalPages - 1 ? '#2a3040' : gold, cursor: versePage === totalPages - 1 ? 'default' : 'pointer', padding: '4px 14px', fontSize: '0.8rem' }}>
                    {language === 'tr' ? 'Sonraki' : 'Next'} ›
                  </button>
                </div>
              )}
            </div>
          );
        })()}
      </div>
    </div>

    </>
  );
}
