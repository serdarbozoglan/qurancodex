import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import { CLOSE_BTN, OVERLAY_TITLE, COLORS, FONTS, BREAKPOINT_MOBILE } from '../tokens';

// ── MODULE-LEVEL CACHES ───────────────────────────────────────────────────────
let cachedVerses = null;
let cachedSurahInfo = null;
let cachedRevOrder = null;

// ── SURAH NAMES ───────────────────────────────────────────────────────────────
const SURAH_NAMES_TR = [
  '', 'Fâtiha', 'Bakara', 'Âl-i İmrân', 'Nisâ', 'Mâide',
  'En\'âm', 'A\'râf', 'Enfâl', 'Tevbe', 'Yûnus',
  'Hûd', 'Yûsuf', 'Ra\'d', 'İbrâhîm', 'Hicr',
  'Nahl', 'İsrâ', 'Kehf', 'Meryem', 'Tâ-Hâ',
  'Enbiyâ', 'Hac', 'Mü\'minûn', 'Nûr', 'Furkân',
  'Şu\'arâ', 'Neml', 'Kasas', 'Ankebût', 'Rûm',
  'Lokmân', 'Secde', 'Ahzâb', 'Sebe', 'Fâtır',
  'Yâsîn', 'Sâffât', 'Sâd', 'Zümer', 'Mü\'min',
  'Fussılet', 'Şûrâ', 'Zuhruf', 'Duhân', 'Câsiye',
  'Ahkâf', 'Muhammed', 'Fetih', 'Hucurât', 'Kâf',
  'Zâriyât', 'Tûr', 'Necm', 'Kamer', 'Rahmân',
  'Vâkıa', 'Hadîd', 'Mücâdele', 'Haşr', 'Mümtehine',
  'Saf', 'Cum\'a', 'Münâfikûn', 'Tegâbün', 'Talâk',
  'Tahrîm', 'Mülk', 'Kalem', 'Hâkka', 'Me\'âric',
  'Nûh', 'Cinn', 'Müzzemmil', 'Müddessir', 'Kıyâme',
  'İnsân', 'Mürselât', 'Nebe', 'Nâziât', 'Abese',
  'Tekvîr', 'İnfitâr', 'Mutaffifîn', 'İnşikak', 'Bürûc',
  'Târık', 'A\'lâ', 'Gâşiye', 'Fecr', 'Beled',
  'Şems', 'Leyl', 'Duhâ', 'İnşirâh', 'Tîn',
  'Alak', 'Kadr', 'Beyyine', 'Zilzâl', 'Âdiyât',
  'Kâria', 'Tekâsür', 'Asr', 'Hümeze', 'Fîl',
  'Kureyş', 'Mâûn', 'Kevser', 'Kâfirûn', 'Nasr',
  'Tebbet', 'İhlâs', 'Felak', 'Nâs',
];
const SURAH_NAMES_AR = [
  '', 'الفاتحة', 'البقرة', 'آل عمران', 'النساء', 'المائدة',
  'الأنعام', 'الأعراف', 'الأنفال', 'التوبة', 'يونس',
  'هود', 'يوسف', 'الرعد', 'إبراهيم', 'الحجر',
  'النحل', 'الإسراء', 'الكهف', 'مريم', 'طه',
  'الأنبياء', 'الحج', 'المؤمنون', 'النور', 'الفرقان',
  'الشعراء', 'النمل', 'القصص', 'العنكبوت', 'الروم',
  'لقمان', 'السجدة', 'الأحزاب', 'سبأ', 'فاطر',
  'يس', 'الصافات', 'ص', 'الزمر', 'غافر',
  'فصلت', 'الشورى', 'الزخرف', 'الدخان', 'الجاثية',
  'الأحقاف', 'محمد', 'الفتح', 'الحجرات', 'ق',
  'الذاريات', 'الطور', 'النجم', 'القمر', 'الرحمن',
  'الواقعة', 'الحديد', 'المجادلة', 'الحشر', 'الممتحنة',
  'الصف', 'الجمعة', 'المنافقون', 'التغابن', 'الطلاق',
  'التحريم', 'الملك', 'القلم', 'الحاقة', 'المعارج',
  'نوح', 'الجن', 'المزمل', 'المدثر', 'القيامة',
  'الإنسان', 'المرسلات', 'النبأ', 'النازعات', 'عبس',
  'التكوير', 'الانفطار', 'المطففين', 'الانشقاق', 'البروج',
  'الطارق', 'الأعلى', 'الغاشية', 'الفجر', 'البلد',
  'الشمس', 'الليل', 'الضحى', 'الشرح', 'التين',
  'العلق', 'القدر', 'البينة', 'الزلزلة', 'العاديات',
  'القارعة', 'التكاثر', 'العصر', 'الهمزة', 'الفيل',
  'قريش', 'الماعون', 'الكوثر', 'الكافرون', 'النصر',
  'المسد', 'الإخلاص', 'الفلق', 'الناس',
];

// ── STOP WORDS (Turkish) ───────────────────────────────────────────────────────
const STOP_TR = new Set([
  've','bir','bu','da','de','ki','ile','için','olan','olan','her','ama',
  'ne','en','ya','ise','çok','daha','hem','veya','gibi','kadar','beri',
  'onu','ona','onun','onlar','ben','sen','o','biz','siz','bana','sana',
  'beni','seni','benim','senin','onları','onlara','bizim','sizin',
  'sizin','onların','kendi','kendisi','kendini','hep','hiç','zaten',
  'bile','sadece','ancak','fakat','lakin','yani','şey','şeyi','şeyin',
  'dir','dır','dur','dür','tir','tır','tur','tür','mı','mi','mu','mü',
  'olur','oldu','olmuş','olarak','olmak','olsun','oluyor','olup',
  'böyle','böylece','bunun','bunlar','bunları','bunlara','bunu',
  'şunlar','şunu','şunları','şu','şunda','şundan','orada','oraya',
  'buraya','bura','burada','ora','şura','şurada','hem','artık','hala',
  'nasıl','neden','niçin','niye','nerede','nereden','nereye','nereye',
  'hangi','hangisi','birçok','bazı','tüm','bütün','diğer','diğerleri',
  'ayrıca','üzere','göre','karşı','başka','başkası','başkaları',
  'doğru','yönünde','taraf','tarafından','üzerinde','altında',
  'içinde','dışında','yanında','önünde','arkasında','hakkında',
  'arasında','arasındaki','çünkü','eğer','acaba','gerçekten','henüz',
  'hemen','tam','tamamen','sadece','yalnız','yalnızca','belki',
  'mutlaka','kesinlikle','elbette','tabii','yoksa','aksine','üstelik',
  'demek','dedi','der','diyor','diyerek','söyledi','söyler',
  'edilir','edilmiş','edilmez','edilecek','edilmeli',
  'etmek','ettiği','ettikten','etmeden','etmiş','etti','eder',
]);

// ── FIGURE DETECTION LIST ─────────────────────────────────────────────────────
const FIGURES_TR = [
  { key: 'musa',      label: 'Hz. Musa',     match: ['musa'] },
  { key: 'ibrahim',   label: 'Hz. İbrahim',  match: ['ibrahim'] },
  { key: 'isa',       label: 'Hz. İsa',      match: [' isa ', 'meryem oğlu'] },
  { key: 'yusuf',     label: 'Hz. Yusuf',    match: ['yusuf'] },
  { key: 'nuh',       label: 'Hz. Nuh',      match: [' nuh '] },
  { key: 'adem',      label: 'Hz. Âdem',     match: ['âdem', 'adem'] },
  { key: 'davud',     label: 'Hz. Dâvud',    match: ['dâvud', 'davud'] },
  { key: 'suleyman',  label: 'Hz. Süleyman', match: ['süleyman'] },
  { key: 'yunus',     label: 'Hz. Yunus',    match: [' yunus '] },
  { key: 'eyyub',     label: 'Hz. Eyyub',    match: ['eyyub', 'eyüb'] },
  { key: 'ishak',     label: 'Hz. İshak',    match: ['ishak'] },
  { key: 'ismail',    label: 'Hz. İsmail',   match: ['ismail'] },
  { key: 'yahya',     label: 'Hz. Yahya',    match: ['yahya'] },
  { key: 'zekeriyya', label: 'Hz. Zekeriyyâ', match: ['zekeriyyâ', 'zekeriyya'] },
  { key: 'meryem',    label: 'Hz. Meryem',   match: ['meryem'] },
  { key: 'lut',       label: 'Hz. Lût',      match: ['lût ', 'lut '] },
  { key: 'haroon',    label: 'Hz. Hârun',    match: ['hârun', 'harun'] },
  { key: 'ilyas',     label: 'Hz. İlyâs',    match: ['ilyâs', 'ilyas'] },
  { key: 'firavun',   label: 'Firavun',      match: ['firavun'] },
  { key: 'iblis',     label: 'İblis',        match: ['iblis', 'şeytan'] },
];

// ── HELPERS ───────────────────────────────────────────────────────────────────
function normalizeTr(str) {
  return (str || '').toLowerCase()
    .replace(/â/g, 'a').replace(/î/g, 'i').replace(/û/g, 'u').replace(/ô/g, 'o')
    .replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g')
    .replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ç/g, 'c');
}

// Search-optimized normalization: also strip apostrophes, hyphens and combining marks
function normalizeSearch(str) {
  return normalizeTr(str)
    .replace(/\u0307/g, '')          // remove combining dot above (from İ.toLowerCase())
    .replace(/['''\u2018\u2019\u02bc-]/g, '');
}

// Extract meaningful keywords from a theme label for fuzzy matching
function themeKeywords(theme) {
  return normalizeSearch(theme).split(/[\s.]+/).filter(w => w.length >= 3);
}

// Two themes match if they share at least one keyword (prefix/substring match)
function themesOverlap(a, b) {
  const kA = themeKeywords(a);
  const kB = themeKeywords(b);
  return kA.some(wa => kB.some(wb => wa.includes(wb) || wb.includes(wa)));
}

function tokenize(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[^a-zâîûğşüöçı ]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length >= 4 && !STOP_TR.has(w) && !STOP_TR.has(normalizeTr(w)));
}

function wordFreq(verses) {
  const freq = {};
  for (const v of verses) {
    for (const w of tokenize(v.turkish || '')) {
      freq[w] = (freq[w] || 0) + 1;
    }
  }
  return freq;
}

function detectFigures(verses) {
  const combined = verses.map(v => ' ' + (v.turkish || '').toLowerCase() + ' ').join(' ');
  return FIGURES_TR.filter(f => f.match.some(m => combined.includes(m)));
}

function computeSimilarity(versesA, versesB) {
  const surahBIds = new Set(versesB.map(v => v.id));
  let crossLinks = 0;
  let totalScore = 0;

  for (const v of versesA) {
    for (const conn of (v.connections || [])) {
      if (surahBIds.has(conn.id)) {
        crossLinks++;
        totalScore += conn.score || 0;
      }
    }
  }
  if (crossLinks === 0) return { score: 0, links: 0, avgScore: 0 };
  const coverage = crossLinks / (versesA.length * 20); // 20 max connections per verse
  const avgScore = totalScore / crossLinks;
  const score = Math.round(Math.min(100, coverage * avgScore * 200));
  return { score, links: crossLinks, avgScore: Math.round(avgScore * 100) };
}

// ── SURAH SELECTOR ─────────────────────────────────────────────────────────────
function SurahSelector({ value, onChange, placeholder, color, surahInfo, revOrderMap: _revOrderMap, language, excludeNum }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  const filtered = useMemo(() => {
    const q = normalizeSearch(query.trim());
    return Array.from({ length: 114 }, (_, i) => i + 1).filter(n => {
      if (n === excludeNum) return false;
      if (!q) return true;
      const nameN = normalizeSearch(SURAH_NAMES_TR[n]);
      const numStr = String(n);
      return nameN.includes(q) || numStr.startsWith(q);
    });
  }, [query, excludeNum]);

  const selected = value ? (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
      <span style={{
        width: '32px', height: '32px', borderRadius: '50%',
        background: color + '25', border: `1.5px solid ${color}60`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color, fontSize: '0.75rem', fontWeight: 700, flexShrink: 0,
      }}>{value}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <span style={{ color: '#e8e6e3', fontWeight: 700, fontSize: '0.95rem', display: 'block' }}>
          {SURAH_NAMES_TR[value]}
        </span>
        <span style={{ color: color + '80', fontSize: '0.68rem', display: 'block', fontFamily: "'Amiri', serif", direction: 'rtl' }}>
          {SURAH_NAMES_AR[value]}
        </span>
      </div>
      {surahInfo?.[value] && (
        <span style={{
          fontSize: '0.7rem', color: COLORS.slate600, padding: '2px 8px',
          background: 'rgba(255,255,255,0.05)', borderRadius: '20px', flexShrink: 0,
        }}>
          {typeof surahInfo[value].period === 'string' ? surahInfo[value].period : (language === 'tr' ? surahInfo[value].period?.tr : surahInfo[value].period?.en)}
        </span>
      )}
    </div>
  ) : null;

  return (
    <div
      style={{ position: 'relative' }}
      onKeyDown={(e) => { if (e.key === 'Escape' && open) { e.stopPropagation(); setOpen(false); } }}
    >
      <button
        onClick={() => { setOpen(p => !p); setQuery(''); setTimeout(() => inputRef.current?.focus(), 50); }}
        style={{
          width: '100%', padding: '12px 16px',
          background: value ? `${color}0e` : 'rgba(255,255,255,0.04)',
          border: `1.5px solid ${value ? color + '40' : 'rgba(255,255,255,0.1)'}`,
          borderRadius: '12px', cursor: 'pointer', textAlign: 'left',
          display: 'flex', alignItems: 'center', gap: '10px',
          transition: 'all 0.18s', minHeight: '62px',
          fontFamily: "'Inter', sans-serif",
        }}
        onMouseEnter={e => { if (!value) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
        onMouseLeave={e => { if (!value) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
      >
        {selected || (
          <span style={{ color: COLORS.slate700, fontSize: '0.88rem', fontStyle: 'italic' }}>{placeholder}</span>
        )}
        <svg style={{ marginLeft: 'auto', flexShrink: 0, opacity: 0.4, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
              background: 'rgba(6,8,20,0.97)', backdropFilter: 'blur(24px)',
              border: `1px solid ${color}30`,
              borderRadius: '12px', zIndex: 200, overflow: 'hidden',
              boxShadow: `0 16px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)`,
            }}
          >
            {/* Search input */}
            <div style={{ padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={language === 'tr' ? 'Sûre ara… (Bakara, 2…)' : 'Search surah…'}
                style={{
                  width: '100%', padding: '7px 12px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px', color: '#e8e6e3',
                  fontSize: '0.85rem', fontFamily: "'Inter', sans-serif",
                  outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>
            {/* List */}
            <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
              {filtered.map(n => (
                <button
                  key={n}
                  onClick={() => { onChange(n); setOpen(false); setQuery(''); }}
                  style={{
                    width: '100%', padding: '8px 14px',
                    background: value === n ? `${color}15` : 'transparent',
                    border: 'none', cursor: 'pointer', textAlign: 'left',
                    display: 'flex', alignItems: 'center', gap: '10px',
                    transition: 'background 0.1s', fontFamily: "'Inter', sans-serif",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = `${color}0f`; }}
                  onMouseLeave={e => { e.currentTarget.style.background = value === n ? `${color}15` : 'transparent'; }}
                >
                  <span style={{
                    width: '26px', height: '26px', borderRadius: '50%', flexShrink: 0,
                    background: value === n ? color + '30' : 'rgba(255,255,255,0.06)',
                    color: value === n ? color : COLORS.slate600,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.7rem', fontWeight: 700,
                  }}>{n}</span>
                  <span style={{ color: value === n ? color : COLORS.slate300, fontSize: '0.84rem', fontWeight: value === n ? 700 : 400, flex: 1 }}>
                    {SURAH_NAMES_TR[n]}
                  </span>
                  <span style={{ color: COLORS.slate700, fontSize: '0.65rem', fontFamily: "'Amiri', serif", direction: 'rtl' }}>
                    {SURAH_NAMES_AR[n]}
                  </span>
                  {surahInfo?.[n] && (
                    <span style={{ color: COLORS.slate700, fontSize: '0.68rem', flexShrink: 0 }}>
                      {(typeof surahInfo[n].period === 'string' ? surahInfo[n].period : (language === 'tr' ? surahInfo[n].period?.tr : surahInfo[n].period?.en))?.slice(0, 3)}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── SIMILARITY GAUGE (SVG arc) ─────────────────────────────────────────────────
function SimilarityGauge({ score }) {
  const r = 44;
  const circ = 2 * Math.PI * r;
  const arc = (score / 100) * circ * 0.75; // 270° arc
  const offset = circ * 0.125; // start from 135°

  const color = score >= 65 ? '#34d399' : score >= 35 ? '#d4a574' : '#60a5fa';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
      <svg width="110" height="90" viewBox="-10 -10 120 95" style={{ overflow: 'visible' }}>
        {/* Background arc */}
        <circle
          cx="55" cy="55" r={r}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="8"
          strokeDasharray={`${circ * 0.75} ${circ * 0.25}`}
          strokeDashoffset={-offset * circ * 0.75 / (circ * 0.75)}
          strokeLinecap="round"
          transform="rotate(135 55 55)"
        />
        {/* Score arc */}
        <motion.circle
          cx="55" cy="55" r={r}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${arc} ${circ}`}
          strokeDashoffset={0}
          transform="rotate(135 55 55)"
          initial={{ strokeDasharray: `0 ${circ}` }}
          animate={{ strokeDasharray: `${arc} ${circ}` }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
          style={{ filter: `drop-shadow(0 0 6px ${color}80)` }}
        />
        {/* Score text */}
        <text x="55" y="58" textAnchor="middle" fontSize="22" fontWeight="800"
          fontFamily="'Inter', sans-serif" fill={color}
        >{score}%</text>
      </svg>
      <p style={{ color: COLORS.slate600, fontSize: '0.7rem', textAlign: 'center', margin: 0 }}>
        {score >= 65 ? 'Yüksek benzerlik' : score >= 35 ? 'Orta benzerlik' : score >= 15 ? 'Düşük benzerlik' : 'Minimal benzerlik'}
      </p>
    </div>
  );
}

// ── WORD VENN ─────────────────────────────────────────────────────────────────
function WordVenn({ wordsA, wordsB, colorA, colorB, nameA, nameB, language }) {
  const setA = new Set(Object.keys(wordsA));
  const setB = new Set(Object.keys(wordsB));

  const onlyA = [...setA].filter(w => !setB.has(w))
    .sort((a, b) => (wordsB[b] || 0) - (wordsA[a] || 0) || wordsA[b] - wordsA[a])
    .slice(0, 12);
  const onlyB = [...setB].filter(w => !setA.has(w))
    .sort((a, b) => wordsB[b] - wordsB[a])
    .slice(0, 12);
  const shared = [...setA].filter(w => setB.has(w))
    .sort((a, b) => (wordsA[b] + wordsB[b]) - (wordsA[a] + wordsB[a]))
    .slice(0, 12);

  const col = (items, color, freqMap) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {items.map(w => (
        <div key={w} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            flex: 1, color: '#94a3b8', fontSize: '0.82rem',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>{w}</span>
          <span style={{
            flexShrink: 0, fontSize: '0.68rem', color: color, fontWeight: 600,
            background: color + '18', padding: '1px 6px', borderRadius: '10px',
          }}>{freqMap[w]}</span>
        </div>
      ))}
      {items.length === 0 && (
        <p style={{ color: COLORS.slate800, fontSize: '0.78rem', margin: 0 }}>—</p>
      )}
    </div>
  );

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr auto 1fr',
      gap: '0', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden',
    }}>
      {/* Only A */}
      <div style={{ padding: '16px', background: `${colorA}08` }}>
        <p style={{ color: colorA, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px', margin: '0 0 10px' }}>
          {nameA} {language === 'tr' ? 'özgü' : 'only'}
        </p>
        {col(onlyA, colorA, wordsA)}
      </div>
      {/* Divider */}
      <div style={{ width: '1px', background: 'rgba(255,255,255,0.07)' }} />
      {/* Shared */}
      <div style={{
        padding: '16px', background: 'rgba(212,165,116,0.05)',
        borderLeft: '1px solid rgba(255,255,255,0.07)',
        borderRight: '1px solid rgba(255,255,255,0.07)',
        minWidth: '130px',
      }}>
        <p style={{ color: '#d4a574', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px', margin: '0 0 10px', textAlign: 'center' }}>
          {language === 'tr' ? 'Ortak' : 'Shared'}
        </p>
        {shared.map(w => (
          <div key={w} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', justifyContent: 'center' }}>
            <span style={{ fontSize: '0.68rem', color: colorA + '99', fontWeight: 600 }}>{wordsA[w]}</span>
            <span style={{ color: '#d4a574', fontSize: '0.82rem', fontWeight: 600 }}>{w}</span>
            <span style={{ fontSize: '0.68rem', color: colorB + '99', fontWeight: 600 }}>{wordsB[w]}</span>
          </div>
        ))}
        {shared.length === 0 && (
          <p style={{ color: COLORS.slate800, fontSize: '0.78rem', margin: 0, textAlign: 'center' }}>—</p>
        )}
      </div>
      {/* Only B */}
      <div style={{ padding: '16px', background: `${colorB}08` }}>
        <p style={{ color: colorB, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px', margin: '0 0 10px', textAlign: 'right' }}>
          {nameB} {language === 'tr' ? 'özgü' : 'only'}
        </p>
        {col(onlyB, colorB, wordsB)}
      </div>
    </div>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
const COLOR_A = '#60a5fa';
const COLOR_B = '#a78bfa';

export default function SurahComparator({ onClose }) {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [loadKey, setLoadKey] = useState(0); // increment to force data reload
  const [surahA, setSurahA] = useState(null);
  const [surahB, setSurahB] = useState(null);
  const [view, setView] = useState('landing'); // 'landing' | 'result'
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < BREAKPOINT_MOBILE);

  // Load all data — re-runs when loadKey changes (manual retry)
  useEffect(() => {
    const promises = [];
    if (!cachedVerses) promises.push(fetch('/verse-graph-bgem3.json').then(r => r.json()).then(d => { cachedVerses = d; }));
    if (!cachedSurahInfo) promises.push(fetch('/surah-info.json').then(r => r.json()).then(d => { cachedSurahInfo = d; }));
    if (!cachedRevOrder) promises.push(fetch('/revelation-order.json').then(r => r.json()).then(d => { cachedRevOrder = d; }));
    if (promises.length === 0) { setLoading(false); return; }
    setLoading(true);
    Promise.all(promises).then(() => setLoading(false)).catch(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadKey]);

  useEffect(() => {
    const h = (e) => {
      if (e.key === 'Escape') {
        if (view === 'result') { setView('landing'); }
        else onClose();
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [view, onClose]);

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < BREAKPOINT_MOBILE);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  // Build revolution order map: surah -> rank
  const revRankMap = useMemo(() => {
    if (!cachedRevOrder) return {};
    const m = {};
    (cachedRevOrder.order || []).forEach(item => { m[item.surah] = item.rank; });
    return m;
  }, [loading]);

  // Quick preset pairs — ranked by actual cross-link count, diverse topics
  const PRESETS = [
    { a: 2,  b: 3,  labelTr: 'Bakara & Âl-i İmrân',  labelEn: 'Al-Baqara & Al-Imran',   reasonTr: '854 bağ · Ehl-i Kitap diyalogu, Medenî kardeş sûreler',      reasonEn: '854 links · People of the Book, sister Medinan surahs' },
    { a: 26, b: 37, labelTr: "Şu'arâ & Sâffât",       labelEn: 'Ash-Shuara & As-Saffat', reasonTr: '491 bağ · Aynı peygamber kıssaları iki farklı anlatıyla',    reasonEn: '491 links · Same prophet stories in two different styles' },
    { a: 2,  b: 5,  labelTr: 'Bakara & Mâide',        labelEn: 'Al-Baqara & Al-Maida',   reasonTr: '462 bağ · Yahudi-Hristiyan diyalogu, helal-haram hükümleri', reasonEn: '462 links · Jewish-Christian dialogue, food laws' },
    { a: 3,  b: 5,  labelTr: 'Âl-i İmrân & Mâide',   labelEn: 'Al-Imran & Al-Maida',    reasonTr: '368 bağ · Hz. İsa teması, Ehl-i Kitap ile ortak zemin',      reasonEn: '368 links · Jesus theme, common ground with Scripture' },
    { a: 4,  b: 33, labelTr: 'Nisâ & Ahzâb',          labelEn: 'An-Nisa & Al-Ahzab',     reasonTr: '341 bağ · Aile hukuku, münafıklar, kadın hakları',           reasonEn: '341 links · Family law, hypocrites, women\'s rights' },
    { a: 7,  b: 26, labelTr: "A'râf & Şu'arâ",        labelEn: "Al-A'raf & Ash-Shuara",  reasonTr: '333 bağ · Helak edilen kavimler paralel anlatıyla',          reasonEn: '333 links · Destroyed nations told in parallel' },
    { a: 6,  b: 10, labelTr: "En'âm & Yûnus",         labelEn: 'Al-Anam & Yunus',        reasonTr: '308 bağ · Tevhid delilleri, tabiat ayetleri, Mekkî inanç',  reasonEn: '308 links · Proofs of monotheism, nature signs' },
    { a: 2,  b: 24, labelTr: 'Bakara & Nûr',          labelEn: 'Al-Baqara & An-Nur',     reasonTr: '267 bağ · İslam hukuku: aile ve toplum iki farklı açıdan',  reasonEn: '267 links · Islamic law: family & social dimensions' },
  ];

  // Analysis result (computed when view === 'result')
  const analysis = useMemo(() => {
    if (view !== 'result' || !surahA || !surahB || !cachedVerses) return null;
    try {
      const vA = cachedVerses.filter(v => v.surah === surahA);
      const vB = cachedVerses.filter(v => v.surah === surahB);

      const sim = computeSimilarity(vA, vB);
      const simReverse = computeSimilarity(vB, vA);
      const finalScore = Math.round((sim.score + simReverse.score) / 2);

      const figA = detectFigures(vA);
      const figB = detectFigures(vB);
      const figShared = figA.filter(f => figB.some(g => g.key === f.key));
      const figOnlyA = figA.filter(f => !figB.some(g => g.key === f.key));
      const figOnlyB = figB.filter(f => !figA.some(g => g.key === f.key));

      const freqA = wordFreq(vA);
      const freqB = wordFreq(vB);

      const infoA = cachedSurahInfo?.[surahA] || {};
      const infoB = cachedSurahInfo?.[surahB] || {};

      const themesA = (language === 'tr' ? infoA.themes?.tr : infoA.themes?.en) || [];
      const themesB = (language === 'tr' ? infoB.themes?.tr : infoB.themes?.en) || [];
      const themesShared = themesA.filter(t => themesB.some(tb => themesOverlap(t, tb)));
      const themesOnlyA = themesA.filter(t => !themesB.some(tb => themesOverlap(t, tb)));
      const themesOnlyB = themesB.filter(t => !themesA.some(ta => themesOverlap(t, ta)));
      const unionSize = themesOnlyA.length + themesShared.length + themesOnlyB.length;
      const themeJaccard = unionSize > 0 ? Math.round((themesShared.length / unionSize) * 100) : 0;

      return {
        vA, vB, finalScore, sim, simReverse,
        figA, figB, figShared, figOnlyA, figOnlyB,
        freqA, freqB,
        infoA, infoB, themesA, themesB, themesShared, themesOnlyA, themesOnlyB, themeJaccard,
      };
    } catch (err) {
      console.error('[SurahComparator] analysis error:', err);
      return null;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, surahA, surahB, language, loading, loadKey]);

  const canCompare = surahA && surahB;

  const startComparison = () => {
    if (canCompare) setView('result');
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: '#06080e',
      display: 'flex', flexDirection: 'column',
      fontFamily: "'Inter', sans-serif",
    }}>

      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '14px',
        padding: '0 20px', height: '60px',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        background: 'rgba(6,8,14,0.96)', backdropFilter: 'blur(16px)',
        flexShrink: 0,
      }}>
        {view === 'result' ? (
          <button
            onClick={() => setView('landing')}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px', padding: '6px 12px', cursor: 'pointer',
              color: '#94a3b8', fontSize: '0.82rem', fontWeight: 500,
              transition: 'all 0.15s', fontFamily: "'Inter', sans-serif",
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#e8e6e3'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#94a3b8'; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            {language === 'tr' ? 'Yeni Karşılaştırma' : 'New Comparison'}
          </button>
        ) : (
          <div>
            <span style={OVERLAY_TITLE}>
              {language === 'tr' ? 'Sûre DNA Karşılaştırıcı' : 'Surah DNA Comparator'}
            </span>
          </div>
        )}

        {view === 'result' && surahA && surahB && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
            <span style={{ color: COLOR_A, fontWeight: 700, fontSize: '0.95rem', flexShrink: 0 }}>
              {SURAH_NAMES_TR[surahA]}
            </span>
            <span style={{ color: COLORS.slate700, fontSize: '0.8rem' }}>vs</span>
            <span style={{ color: COLOR_B, fontWeight: 700, fontSize: '0.95rem', flexShrink: 0 }}>
              {SURAH_NAMES_TR[surahB]}
            </span>
          </div>
        )}

        <div style={{ marginLeft: 'auto' }}>
          <button
            onClick={onClose}
            style={{ ...CLOSE_BTN }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#e8e6e3'; }}
            onMouseLeave={e => { e.currentTarget.style.background = CLOSE_BTN.background; e.currentTarget.style.color = '#94a3b8'; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── LOADING ───────────────────────────────────────────────────── */}
      {loading && (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
          <div style={{ width: '36px', height: '36px', border: '2px solid rgba(212,165,116,0.15)', borderTopColor: '#d4a574', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <p style={{ color: '#64748b', fontSize: '0.85rem' }}>{language === 'tr' ? 'Ayet verileri yükleniyor…' : 'Loading verse data…'}</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* ── LANDING ───────────────────────────────────────────────────── */}
      {!loading && view === 'landing' && (
        <div style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '20px 16px' : '32px 28px', maxWidth: '800px', width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>

          <p style={{ color: '#94a3b8', fontSize: '0.98rem', lineHeight: 1.8, marginBottom: '36px', maxWidth: '620px' }}>
            {language === 'tr'
              ? 'İki sûre seç. Ortak kelimeler, temalar, peygamberler ve anlamsal benzerlik görsel olarak karşılaştırılır.'
              : 'Select two surahs. Shared words, themes, figures, and semantic similarity are compared visually.'}
          </p>

          {/* Two selectors */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr auto 1fr', gap: isMobile ? '12px' : '0', alignItems: 'center', marginBottom: '32px' }}>
            <div>
              <p style={{ color: COLOR_A, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '8px' }}>
                {language === 'tr' ? 'Birinci Sûre' : 'First Surah'}
              </p>
              <SurahSelector
                value={surahA}
                onChange={setSurahA}
                placeholder={language === 'tr' ? 'Bir sûre seç…' : 'Select a surah…'}
                color={COLOR_A}
                surahInfo={cachedSurahInfo}
                revOrderMap={revRankMap}
                language={language}
                excludeNum={surahB}
              />
            </div>

            {/* VS divider */}
            {isMobile && null}
            <div style={{ padding: '0 20px', textAlign: 'center', paddingTop: '24px', display: isMobile ? 'none' : 'block' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: COLORS.slate700, fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.05em',
              }}>vs</div>
            </div>

            <div>
              <p style={{ color: COLOR_B, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '8px' }}>
                {language === 'tr' ? 'İkinci Sûre' : 'Second Surah'}
              </p>
              <SurahSelector
                value={surahB}
                onChange={setSurahB}
                placeholder={language === 'tr' ? 'Bir sûre seç…' : 'Select a surah…'}
                color={COLOR_B}
                surahInfo={cachedSurahInfo}
                revOrderMap={revRankMap}
                language={language}
                excludeNum={surahA}
              />
            </div>
          </div>

          {/* Compare button */}
          <div style={{ marginBottom: '40px' }}>
            <button
              onClick={startComparison}
              disabled={!canCompare}
              style={{
                width: '100%', padding: '14px',
                background: canCompare
                  ? 'linear-gradient(135deg, #60a5fa22 0%, #a78bfa22 100%)'
                  : 'rgba(255,255,255,0.04)',
                border: `1.5px solid ${canCompare ? 'rgba(150,170,255,0.3)' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: '12px', cursor: canCompare ? 'pointer' : 'not-allowed',
                color: canCompare ? '#e8e6e3' : COLORS.slate700,
                fontSize: '0.92rem', fontWeight: canCompare ? 700 : 400,
                transition: 'all 0.2s', letterSpacing: '0.04em',
                fontFamily: "'Inter', sans-serif",
              }}
              onMouseEnter={e => { if (canCompare) { e.currentTarget.style.background = 'linear-gradient(135deg, #60a5fa30 0%, #a78bfa30 100%)'; e.currentTarget.style.borderColor = 'rgba(150,170,255,0.5)'; }}}
              onMouseLeave={e => { if (canCompare) { e.currentTarget.style.background = 'linear-gradient(135deg, #60a5fa22 0%, #a78bfa22 100%)'; e.currentTarget.style.borderColor = 'rgba(150,170,255,0.3)'; }}}
            >
              {canCompare
                ? (language === 'tr' ? `${SURAH_NAMES_TR[surahA]} ile ${SURAH_NAMES_TR[surahB]}'ı Karşılaştır →` : `Compare ${SURAH_NAMES_TR[surahA]} and ${SURAH_NAMES_TR[surahB]} →`)
                : (language === 'tr' ? 'İki sûre seçin' : 'Select two surahs')}
            </button>
          </div>

          {/* Presets */}
          <div>
            <p style={{ color: COLORS.slate700, fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '12px' }}>
              {language === 'tr' ? 'Önerilen Karşılaştırmalar' : 'Suggested Pairs'}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {PRESETS.map(p => (
                <button
                  key={`${p.a}-${p.b}`}
                  onClick={() => { setSurahA(p.a); setSurahB(p.b); }}
                  style={{
                    padding: '8px 14px', textAlign: 'left',
                    background: (surahA === p.a && surahB === p.b) ? 'rgba(150,170,255,0.12)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${(surahA === p.a && surahB === p.b) ? 'rgba(150,170,255,0.35)' : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: '12px', cursor: 'pointer',
                    color: (surahA === p.a && surahB === p.b) ? '#a78bfa' : '#64748b',
                    fontSize: '0.82rem', fontWeight: 500, transition: 'all 0.15s',
                    fontFamily: "'Inter', sans-serif",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'; e.currentTarget.style.color = '#94a3b8'; }}
                  onMouseLeave={e => {
                    const isSelected = surahA === p.a && surahB === p.b;
                    e.currentTarget.style.borderColor = isSelected ? 'rgba(150,170,255,0.35)' : 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.color = isSelected ? '#a78bfa' : '#64748b';
                  }}
                >
                  <span style={{ display: 'block' }}>{language === 'tr' ? p.labelTr : p.labelEn}</span>
                  {(language === 'tr' ? p.reasonTr : p.reasonEn) && (
                    <span style={{ display: 'block', fontSize: '0.68rem', opacity: 0.6, marginTop: '1px' }}>
                      {language === 'tr' ? p.reasonTr : p.reasonEn}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── RESULT ERROR FALLBACK ─────────────────────────────────────── */}
      {!loading && view === 'result' && !analysis && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          <p style={{ color: COLORS.slate600, fontSize: '0.9rem', margin: 0 }}>
            {language === 'tr' ? 'Analiz hesaplanamadı. Veriler yüklenirken sorun oluştu.' : 'Analysis failed. Data could not be loaded.'}
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => {
                cachedVerses = null;
                cachedSurahInfo = null;
                cachedRevOrder = null;
                setLoadKey(k => k + 1);
              }}
              style={{
                padding: '8px 20px', background: 'rgba(212,165,116,0.1)',
                border: '1px solid rgba(212,165,116,0.3)', borderRadius: '8px',
                color: '#d4a574', fontSize: '0.85rem', cursor: 'pointer',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {language === 'tr' ? 'Tekrar Dene' : 'Retry'}
            </button>
            <button
              onClick={() => setView('landing')}
              style={{
                padding: '8px 20px', background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px',
                color: '#94a3b8', fontSize: '0.85rem', cursor: 'pointer',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {language === 'tr' ? '← Geri' : '← Back'}
            </button>
          </div>
        </div>
      )}

      {/* ── RESULT ────────────────────────────────────────────────────── */}
      {!loading && view === 'result' && analysis && (
        <div style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '16px 16px 40px' : '24px 24px 40px' }}>
          <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* ── ROW 1: Stats cards + Similarity gauge ── */}
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr auto 1fr', gap: '16px', alignItems: 'stretch' }}>

              {/* Surah A card */}
              <div style={{
                padding: '20px', borderRadius: '14px',
                background: `${COLOR_A}0c`, border: `1px solid ${COLOR_A}25`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <span style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: COLOR_A + '25', color: COLOR_A,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.82rem', fontWeight: 800, flexShrink: 0,
                  }}>{surahA}</span>
                  <div>
                    <h3 style={{ color: COLOR_A, fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>{SURAH_NAMES_TR[surahA]}</h3>
                    <span style={{ color: COLOR_A + '70', fontSize: '0.75rem', fontFamily: "'Amiri', serif", direction: 'rtl' }}>{SURAH_NAMES_AR[surahA]}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <StatRow label={language === 'tr' ? 'Ayet sayısı' : 'Verses'} value={analysis.vA.length} color={COLOR_A} />
                  <StatRow label={language === 'tr' ? 'Dönem' : 'Period'} value={typeof analysis.infoA.period === 'string' ? analysis.infoA.period : (language === 'tr' ? analysis.infoA.period?.tr : analysis.infoA.period?.en)} color={COLOR_A} />
                  <StatRow label={language === 'tr' ? 'Nüzul sırası' : 'Rev. rank'} value={revRankMap[surahA] ? `#${revRankMap[surahA]}` : '—'} color={COLOR_A} />
                  {analysis.infoA.meaning && (
                    <StatRow label={language === 'tr' ? 'Anlam' : 'Meaning'} value={language === 'tr' ? analysis.infoA.meaning.tr : analysis.infoA.meaning.en} color={COLOR_A} />
                  )}
                </div>
              </div>

              {/* Similarity gauge */}
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                padding: '16px 10px', minWidth: '130px',
              }}>
                <p style={{ color: COLORS.slate700, fontSize: '0.68rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '8px', textAlign: 'center' }}>
                  {language === 'tr' ? 'Benzerlik' : 'Similarity'}
                </p>
                <SimilarityGauge score={analysis.finalScore} />
                <p style={{ color: COLORS.slate700, fontSize: '0.68rem', marginTop: '4px', textAlign: 'center' }}>
                  {analysis.sim.links + analysis.simReverse.links}{' '}
                  {language === 'tr' ? 'çapraz bağ' : 'cross-links'}
                </p>
                <p style={{ color: COLORS.slate800, fontSize: '0.62rem', marginTop: '6px', textAlign: 'center', lineHeight: 1.5, maxWidth: '120px' }}>
                  {language === 'tr'
                    ? 'Sûredeki her ayet, tüm Kur\'an\'daki en yakın 20 ayete bağlı. Skor bu bağların yoğunluğunu ölçer.'
                    : "Each verse links to its 20 closest verses in the Quran. Score measures link density."}
                </p>
              </div>

              {/* Surah B card */}
              <div style={{
                padding: '20px', borderRadius: '14px',
                background: `${COLOR_B}0c`, border: `1px solid ${COLOR_B}25`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <span style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: COLOR_B + '25', color: COLOR_B,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.82rem', fontWeight: 800, flexShrink: 0,
                  }}>{surahB}</span>
                  <div>
                    <h3 style={{ color: COLOR_B, fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>{SURAH_NAMES_TR[surahB]}</h3>
                    <span style={{ color: COLOR_B + '70', fontSize: '0.75rem', fontFamily: "'Amiri', serif", direction: 'rtl' }}>{SURAH_NAMES_AR[surahB]}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <StatRow label={language === 'tr' ? 'Ayet sayısı' : 'Verses'} value={analysis.vB.length} color={COLOR_B} />
                  <StatRow label={language === 'tr' ? 'Dönem' : 'Period'} value={typeof analysis.infoB.period === 'string' ? analysis.infoB.period : (language === 'tr' ? analysis.infoB.period?.tr : analysis.infoB.period?.en)} color={COLOR_B} />
                  <StatRow label={language === 'tr' ? 'Nüzul sırası' : 'Rev. rank'} value={revRankMap[surahB] ? `#${revRankMap[surahB]}` : '—'} color={COLOR_B} />
                  {analysis.infoB.meaning && (
                    <StatRow label={language === 'tr' ? 'Anlam' : 'Meaning'} value={language === 'tr' ? analysis.infoB.meaning.tr : analysis.infoB.meaning.en} color={COLOR_B} />
                  )}
                </div>
              </div>
            </div>

            {/* ── ROW 2: Themes ── */}
            {(analysis.themesA.length > 0 || analysis.themesB.length > 0) && (
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px' }}>
                <ThemeBlock themes={analysis.themesA} sharedThemes={analysis.themesShared} color={COLOR_A} title={SURAH_NAMES_TR[surahA]} language={language} />
                <ThemeBlock themes={analysis.themesB} sharedThemes={analysis.themesShared} color={COLOR_B} title={SURAH_NAMES_TR[surahB]} language={language} />
              </div>
            )}

            {/* ── ROW 3: Shared themes callout ── */}
            {analysis.themesShared.length > 0 && (
              <div style={{
                padding: '14px 18px', borderRadius: '12px',
                background: 'rgba(212,165,116,0.07)', border: '1px solid rgba(212,165,116,0.2)',
              }}>
                <p style={{ color: '#d4a574', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '10px' }}>
                  {language === 'tr' ? 'Ortak Temalar' : 'Shared Themes'}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {analysis.themesShared.map((t, i) => (
                    <span key={i} style={{
                      padding: '5px 12px',
                      background: 'rgba(212,165,116,0.12)',
                      border: '1px solid rgba(212,165,116,0.3)',
                      borderRadius: '20px', color: '#d4a574',
                      fontSize: '0.82rem', fontWeight: 600,
                    }}>{t}</span>
                  ))}
                </div>
              </div>
            )}

            {/* ── ROW 4: Figures ── */}
            {(analysis.figShared.length > 0 || analysis.figOnlyA.length > 0 || analysis.figOnlyB.length > 0) && (
              <div style={{ padding: '18px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
                <p style={{ color: COLORS.slate600, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '14px' }}>
                  {language === 'tr' ? 'Şahsiyetler ve Figürler' : 'Figures & Prophets'}
                </p>
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                  {analysis.figShared.length > 0 && (
                    <div>
                      <p style={{ color: '#d4a574', fontSize: '0.7rem', marginBottom: '8px' }}>
                        {language === 'tr' ? 'Her ikisinde' : 'Both'}
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {analysis.figShared.map(f => <FigurePill key={f.key} label={f.label} color="#d4a574" />)}
                      </div>
                    </div>
                  )}
                  {analysis.figOnlyA.length > 0 && (
                    <div>
                      <p style={{ color: COLOR_A, fontSize: '0.7rem', marginBottom: '8px' }}>
                        {SURAH_NAMES_TR[surahA]} {language === 'tr' ? 'özelinde' : 'only'}
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {analysis.figOnlyA.map(f => <FigurePill key={f.key} label={f.label} color={COLOR_A} />)}
                      </div>
                    </div>
                  )}
                  {analysis.figOnlyB.length > 0 && (
                    <div>
                      <p style={{ color: COLOR_B, fontSize: '0.7rem', marginBottom: '8px' }}>
                        {SURAH_NAMES_TR[surahB]} {language === 'tr' ? 'özelinde' : 'only'}
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {analysis.figOnlyB.map(f => <FigurePill key={f.key} label={f.label} color={COLOR_B} />)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── ROW 5: Thematic Comparison ── */}
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                <p style={{ color: COLORS.slate700, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', margin: 0 }}>
                  {language === 'tr' ? 'Tematik Karşılaştırma' : 'Thematic Comparison'}
                </p>
                {analysis.themeJaccard > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{
                      fontSize: '1.1rem', fontWeight: 800,
                      color: analysis.themeJaccard >= 50 ? '#4caf7d' : analysis.themeJaccard >= 25 ? '#d4a574' : '#94a3b8',
                    }}>
                      %{analysis.themeJaccard}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: COLORS.slate700 }}>
                      {language === 'tr' ? 'tema örtüşmesi' : 'theme overlap'}
                    </span>
                  </div>
                )}
              </div>

              {/* Jaccard explanation */}
              <p style={{ fontSize: '0.72rem', color: COLORS.slate600, marginBottom: '14px', lineHeight: 1.5 }}>
                {language === 'tr'
                  ? `Benzerlik skoru: ${analysis.themesShared.length} ortak tema ÷ ${analysis.themesOnlyA.length + analysis.themesShared.length + analysis.themesOnlyB.length} toplam farklı tema (Jaccard katsayısı)`
                  : `Similarity score: ${analysis.themesShared.length} shared themes ÷ ${analysis.themesOnlyA.length + analysis.themesShared.length + analysis.themesOnlyB.length} total unique themes (Jaccard coefficient)`}
              </p>

              {/* Theme Venn: A (left) | B (right) top row; Shared (centered) bottom row */}
              <div style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden' }}>
                {/* Top row: Only A | Only B */}
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', borderBottom: analysis.themesShared.length > 0 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}>
                  {/* Only A */}
                  <div style={{ padding: '16px', background: `${COLOR_A}08`, borderRight: '1px solid rgba(255,255,255,0.07)' }}>
                    <p style={{ color: COLOR_A, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>
                      {SURAH_NAMES_TR[surahA]} {language === 'tr' ? 'özgü' : 'only'}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {analysis.themesOnlyA.length === 0 ? (
                        <span style={{ color: COLORS.slate800, fontSize: '0.78rem' }}>—</span>
                      ) : analysis.themesOnlyA.map((t, i) => (
                        <span key={i} style={{
                          padding: '4px 10px', borderRadius: '20px', fontSize: '0.78rem',
                          background: `${COLOR_A}12`, border: `1px solid ${COLOR_A}30`, color: COLOR_A,
                          display: 'inline-block',
                        }}>{t}</span>
                      ))}
                    </div>
                  </div>
                  {/* Only B */}
                  <div style={{ padding: '16px', background: `${COLOR_B}08` }}>
                    <p style={{ color: COLOR_B, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px', textAlign: 'right' }}>
                      {SURAH_NAMES_TR[surahB]} {language === 'tr' ? 'özgü' : 'only'}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'flex-end' }}>
                      {analysis.themesOnlyB.length === 0 ? (
                        <span style={{ color: COLORS.slate800, fontSize: '0.78rem' }}>—</span>
                      ) : analysis.themesOnlyB.map((t, i) => (
                        <span key={i} style={{
                          padding: '4px 10px', borderRadius: '20px', fontSize: '0.78rem',
                          background: `${COLOR_B}12`, border: `1px solid ${COLOR_B}30`, color: COLOR_B,
                          display: 'inline-block',
                        }}>{t}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom row: Shared (centered, only if any) */}
                {analysis.themesShared.length > 0 && (
                  <div style={{ padding: '16px', background: 'rgba(76,175,125,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                    <p style={{ color: '#4caf7d', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>
                      {language === 'tr' ? '✓ Ortak Temalar' : '✓ Shared Themes'}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center' }}>
                      {analysis.themesShared.map((t, i) => (
                        <span key={i} style={{
                          padding: '4px 10px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 600,
                          background: 'rgba(76,175,125,0.12)', border: '1px solid rgba(76,175,125,0.3)', color: '#4caf7d',
                          display: 'inline-block',
                        }}>{t}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── ROW 6: Fadail / Description ── */}
            {(analysis.infoA.fadail || analysis.infoB.fadail) && (
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px' }}>
                {[{ info: analysis.infoA, num: surahA, color: COLOR_A }, { info: analysis.infoB, num: surahB, color: COLOR_B }].map(({ info, num, color }) =>
                  info.fadail ? (
                    <div key={num} style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <p style={{ color, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
                        {SURAH_NAMES_TR[num]} — {language === 'tr' ? 'Fazileti' : 'Virtue'}
                      </p>
                      <p style={{ color: '#64748b', fontSize: '0.8rem', lineHeight: 1.7, margin: 0 }}>
                        {language === 'tr' ? info.fadail.tr : info.fadail.en}
                      </p>
                    </div>
                  ) : null
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function StatRow({ label, value, color }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px' }}>
      <span style={{ color: COLORS.slate700, fontSize: '0.75rem' }}>{label}</span>
      <span style={{ color: color || '#94a3b8', fontSize: '0.82rem', fontWeight: 600, textAlign: 'right' }}>{value || '—'}</span>
    </div>
  );
}

function ThemeBlock({ themes, sharedThemes, color, title, language }) {
  const sharedSet = new Set(sharedThemes.map(t => normalizeTr(t)));
  return (
    <div style={{ padding: '16px', borderRadius: '12px', background: `${color}07`, border: `1px solid ${color}20` }}>
      <p style={{ color, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>
        {title} — {language === 'tr' ? 'Temalar' : 'Themes'}
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {themes.map((t, i) => {
          const isShared = sharedSet.has(normalizeTr(t));
          return (
            <span key={i} style={{
              padding: '4px 10px', borderRadius: '20px', fontSize: '0.78rem',
              background: isShared ? 'rgba(212,165,116,0.12)' : `${color}12`,
              border: `1px solid ${isShared ? 'rgba(212,165,116,0.3)' : color + '30'}`,
              color: isShared ? '#d4a574' : color,
              fontWeight: isShared ? 700 : 400,
            }}>{t}</span>
          );
        })}
      </div>
    </div>
  );
}

function FigurePill({ label, color }) {
  return (
    <span style={{
      padding: '4px 10px', borderRadius: '20px',
      background: color + '15', border: `1px solid ${color}35`,
      color, fontSize: '0.78rem', fontWeight: 600,
    }}>{label}</span>
  );
}
