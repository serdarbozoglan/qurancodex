'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS, BREAKPOINT_MOBILE, RADIUS, TRANSITION, SEMANTIC } from '../tokens';
import ToolHeader from './ToolHeader';
import CrossToolCTA from './CrossToolCTA';
import SourcesCitation from './SourcesCitation';

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

// tokenize() lowercases everything so "Allah" and "allah" count as the same
// word (needed for frequency matching) — but that means the lowercase key
// was also being used as the ON-SCREEN label, rendering "Allah" as "allah".
// This walks the SAME words without lowercasing first, and for each key
// keeps whichever original casing occurred most often — proper nouns like
// "Allah" are capitalized in virtually every occurrence so the mode picks
// the capitalized form automatically, while ordinary words (mostly
// lowercase mid-sentence, only occasionally capitalized at a sentence
// start) still resolve to lowercase.
function wordDisplayForms(verses) {
  const counts = {}; // key -> { variant: count }
  for (const v of verses) {
    const raw = (v.turkish || '')
      .replace(/[^a-zA-ZâîûğşüöçıÂÎÛĞŞÜÖÇİ ]/g, ' ')
      .split(/\s+/)
      .filter(Boolean);
    for (const rw of raw) {
      const key = rw.toLowerCase();
      if (key.length < 4 || STOP_TR.has(key) || STOP_TR.has(normalizeTr(key))) continue;
      (counts[key] ||= {})[rw] = (counts[key][rw] || 0) + 1;
    }
  }
  const display = {};
  for (const key of Object.keys(counts)) {
    const variants = counts[key];
    display[key] = Object.keys(variants).sort((a, b) => variants[b] - variants[a])[0];
  }
  return display;
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

// ── VERSE-LEVEL LINK PAIRS — the actual cross-links behind the aggregate
// score, kept individually so they can be drawn as a genome-alignment-style
// arc diagram (which verse in A links to which verse in B, and how strongly)
// instead of only ever being shown as a single percentage. ────────────────
function computeLinkPairs(versesA, versesB, limit = 32) {
  const indexB = new Map(versesB.map((v, i) => [v.id, i]));
  const seen = new Set(); // avoid drawing both A→B and B→A for the same pair
  const pairs = [];
  versesA.forEach((va, ai) => {
    for (const conn of (va.connections || [])) {
      const bi = indexB.get(conn.id);
      if (bi === undefined) continue;
      const key = `${ai}:${bi}`;
      if (seen.has(key)) continue;
      seen.add(key);
      pairs.push({ ai, bi, score: conn.score || 0, ayahA: va.ayah, ayahB: versesB[bi].ayah });
    }
  });
  pairs.sort((a, b) => b.score - a.score);
  return pairs.slice(0, limit);
}

// ── STRUCTURAL PROFILE (verse rhythm, not translation-dependent) ─────────────
// Arapça metin üzerinden kelime sayımı — çeviri uzunluğuna bağlı olmayan,
// sûrenin kendi ayet ritmini yansıtan tek ölçüt. Render edilmediği için
// cleanArabicForDisplay gerekmez (§13.15 yalnız EKRANA yazılan metin için).
function arabicWordCount(str) {
  return (str || '').trim().split(/\s+/).filter(Boolean).length;
}

function structuralProfile(verses) {
  const verseCount = verses.length;
  const wordCounts = verses.map(v => arabicWordCount(v.arabic));
  const totalWords = wordCounts.reduce((a, b) => a + b, 0);
  const avgWords = verseCount > 0 ? totalWords / verseCount : 0;
  const vocab = new Set();
  for (const v of verses) for (const w of tokenize(v.turkish || '')) vocab.add(w);
  return { verseCount, totalWords, avgWords, vocabSize: vocab.size };
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
        width: '32px', height: '32px', borderRadius: RADIUS.full,
        background: color + '25', border: `1.5px solid ${color}60`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color, fontSize: '0.75rem', fontWeight: 700, flexShrink: 0,
      }}>{value}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <span style={{ color: COLORS.offWhite, fontWeight: 700, fontSize: '0.95rem', display: 'block' }}>
          {SURAH_NAMES_TR[value]}
        </span>
        <span style={{ color: color + '80', fontSize: '0.68rem', display: 'block', fontFamily: "'Amiri', serif", direction: 'rtl' }}>
          {SURAH_NAMES_AR[value]}
        </span>
      </div>
      {surahInfo?.[value] && (
        <span style={{
          fontSize: '0.7rem', color: SEMANTIC.textFaint, padding: '2px 8px',
          background: COLORS.glassBg, borderRadius: RADIUS.pillSm, flexShrink: 0,
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
          border: `1.5px solid ${value ? color + '40' : COLORS.glassBorder}`,
          borderRadius: RADIUS.lg, cursor: 'pointer', textAlign: 'left',
          display: 'flex', alignItems: 'center', gap: '10px',
          transition: 'all 0.18s', minHeight: '62px',
          fontFamily: "'Inter', sans-serif",
        }}
        onMouseEnter={e => { if (!value) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
        onMouseLeave={e => { if (!value) e.currentTarget.style.borderColor = COLORS.glassBorder; }}
      >
        {selected || (
          <span style={{ color: SEMANTIC.textFaint, fontSize: '0.88rem', fontStyle: 'italic' }}>{placeholder}</span>
        )}
        <svg aria-hidden="true" style={{ marginLeft: 'auto', flexShrink: 0, opacity: 0.4, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={COLORS.silver} strokeWidth="2.5" strokeLinecap="round">
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
              borderRadius: RADIUS.lg, zIndex: 200, overflow: 'hidden',
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
                  border: `1px solid ${COLORS.glassBorder}`,
                  borderRadius: RADIUS.md, color: COLORS.offWhite,
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
                    width: '26px', height: '26px', borderRadius: RADIUS.full, flexShrink: 0,
                    background: value === n ? color + '30' : 'rgba(255,255,255,0.06)',
                    color: value === n ? color : COLORS.slate600,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.7rem', fontWeight: 700,
                  }}>{n}</span>
                  <span style={{ color: value === n ? color : COLORS.slate300, fontSize: '0.84rem', fontWeight: value === n ? 700 : 400, flex: 1 }}>
                    {SURAH_NAMES_TR[n]}
                  </span>
                  <span style={{ color: SEMANTIC.textFaint, fontSize: '0.65rem', fontFamily: "'Amiri', serif", direction: 'rtl' }}>
                    {SURAH_NAMES_AR[n]}
                  </span>
                  {surahInfo?.[n] && (
                    <span style={{ color: SEMANTIC.textFaint, fontSize: '0.68rem', flexShrink: 0 }}>
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

  const color = score >= 65 ? '#34d399' : score >= 35 ? COLORS.gold : '#60a5fa';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
      {/* GİZLENMEZ — bu bir veri görselleştirmesi, dekoratif ikon değil.
          İçindeki <text> gerçek veri taşıyor (yüzde). `aria-hidden` verseydik
          ekran okuyucudan SKORU almış olurduk; alttaki <p> yalnız niteliksel
          bandı söylüyor ("Yüksek benzerlik"), sayıyı değil.
          Doğru kalıp: role="img" + sayıyı içeren aria-label. */}
      <svg
        role="img"
        aria-label={`${score}% ${score >= 65 ? 'benzerlik — yüksek' : score >= 35 ? 'benzerlik — orta' : score >= 15 ? 'benzerlik — düşük' : 'benzerlik — minimal'}`}
        width="110" height="90" viewBox="-10 -10 120 95" style={{ overflow: 'visible' }}>
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
      <p style={{ color: SEMANTIC.textFaint, fontSize: '0.7rem', textAlign: 'center', margin: 0 }}>
        {score >= 65 ? 'Yüksek benzerlik' : score >= 35 ? 'Orta benzerlik' : score >= 15 ? 'Düşük benzerlik' : 'Minimal benzerlik'}
      </p>
    </div>
  );
}

// ── GENOME ALIGNMENT — the actual verse-to-verse connections, drawn as a
// two-track diagram (borrowed from how genome/sequence alignment browsers
// show where two sequences match). Each arc is one real link between a
// specific verse in A and a specific verse in B — this is the tool's answer
// to "which parts of the two sûres relate, not just how much overall." ────
function GenomeAlignment({ vA, vB, pairs, nameA, nameB, colorA, colorB, gradId, language }) {
  const W = 900, H = 230, PAD = 26;
  const trackAY = 46, trackBY = H - 46;
  const usable = W - PAD * 2;
  const xOf = (i, len) => PAD + (len > 1 ? (i / (len - 1)) * usable : usable / 2);

  const scores = pairs.map(p => p.score);
  const minS = scores.length ? Math.min(...scores) : 0;
  const maxS = scores.length ? Math.max(...scores) : 1;
  const norm = (s) => (maxS > minS ? (s - minS) / (maxS - minS) : 0.5);

  const [hovered, setHovered] = useState(null);

  return (
    <div style={{ padding: '22px 20px 18px', borderRadius: RADIUS.xl, border: '1px solid rgba(255,255,255,0.09)', background: 'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '4px' }}>
        <p style={{ color: SEMANTIC.textFaint, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', margin: 0 }}>
          {language === 'tr' ? 'Bağlantı Haritası' : 'Connection Map'}
        </p>
        <span style={{ fontSize: '0.7rem', color: SEMANTIC.textFaint }}>
          {language === 'tr' ? `en güçlü ${pairs.length} bağ gösteriliyor` : `showing the ${pairs.length} strongest links`}
        </span>
      </div>
      <p style={{ color: SEMANTIC.textFaint, fontSize: '0.72rem', marginBottom: '14px', opacity: 0.85, maxWidth: '640px' }}>
        {language === 'tr'
          ? 'Her ayet kendi sûresindeki sırasına göre hatta yerleşir; her kavis, iki ayet arasındaki gerçek anlamsal bağı temsil eder — parlaklık bağın gücünü gösterir.'
          : 'Each verse sits on its line by position in its own sûrah; every arc is one real semantic link between two specific verses — brightness shows link strength.'}
      </p>

      {pairs.length === 0 ? (
        <p style={{ color: SEMANTIC.textFaint, fontSize: '0.85rem', textAlign: 'center', padding: '30px 0' }}>
          {language === 'tr' ? 'Bu iki sûre arasında doğrudan ayet bağı bulunamadı.' : 'No direct verse-level links found between these two sûrahs.'}
        </p>
      ) : (
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block', height: 'auto', overflow: 'visible' }} role="img"
          aria-label={language === 'tr' ? `${nameA} ve ${nameB} arasındaki ${pairs.length} en güçlü ayet bağının kavis diyagramı` : `Arc diagram of the ${pairs.length} strongest verse links between ${nameA} and ${nameB}`}
        >
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colorA} />
              <stop offset="100%" stopColor={colorB} />
            </linearGradient>
          </defs>

          {/* Base tracks */}
          <rect x={PAD} y={trackAY - 3} width={usable} height="6" rx="3" fill={colorA} opacity="0.16" />
          <rect x={PAD} y={trackBY - 3} width={usable} height="6" rx="3" fill={colorB} opacity="0.16" />

          {/* Track labels */}
          <text x={PAD} y={trackAY - 14} fontSize="13" fontWeight="800" fill={colorA} fontFamily="'Inter', sans-serif">{nameA}</text>
          <text x={PAD} y={trackBY + 26} fontSize="13" fontWeight="800" fill={colorB} fontFamily="'Inter', sans-serif">{nameB}</text>
          <text x={PAD + usable} y={trackAY - 14} textAnchor="end" fontSize="10" fill={SEMANTIC.textFaint} fontFamily="'Inter', sans-serif">{vA.length} {language === 'tr' ? 'ayet' : 'verses'}</text>
          <text x={PAD + usable} y={trackBY + 26} textAnchor="end" fontSize="10" fill={SEMANTIC.textFaint} fontFamily="'Inter', sans-serif">{vB.length} {language === 'tr' ? 'ayet' : 'verses'}</text>

          {/* Links, weakest first so strongest render on top */}
          {[...pairs].sort((a, b) => a.score - b.score).map((p, idx) => {
            const x1 = xOf(p.ai, vA.length), x2 = xOf(p.bi, vB.length);
            const isHovered = hovered === idx;
            const t = norm(p.score);
            const opacity = isHovered ? 0.95 : 0.16 + t * 0.5;
            const width = isHovered ? 3 : 1 + t * 1.6;
            const midY = (trackAY + trackBY) / 2;
            const d = `M ${x1} ${trackAY + 4} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${trackBY - 4}`;
            return (
              <path
                key={`${p.ai}-${p.bi}`}
                d={d}
                fill="none"
                stroke={isHovered ? COLORS.gold : `url(#${gradId})`}
                strokeWidth={width}
                strokeOpacity={opacity}
                style={{ transition: 'stroke-opacity 0.15s, stroke-width 0.15s', cursor: 'pointer' }}
                onMouseEnter={() => setHovered(idx)}
                onMouseLeave={() => setHovered(h => h === idx ? null : h)}
              >
                <title>{`${nameA} ${p.ayahA} ↔ ${nameB} ${p.ayahB} · ${Math.round(p.score * 100)}%`}</title>
              </path>
            );
          })}

          {/* Endpoint dots */}
          {pairs.map((p, idx) => (
            <g key={`dots-${p.ai}-${p.bi}`}>
              <circle cx={xOf(p.ai, vA.length)} cy={trackAY} r={hovered === idx ? 4 : 2.5} fill={colorA} />
              <circle cx={xOf(p.bi, vB.length)} cy={trackBY} r={hovered === idx ? 4 : 2.5} fill={colorB} />
            </g>
          ))}
        </svg>
      )}
      {hovered !== null && pairs[hovered] && (
        <p style={{ textAlign: 'center', fontSize: '0.76rem', color: COLORS.gold, marginTop: '10px', fontWeight: 600 }}>
          {nameA} {pairs[hovered].ayahA} ↔ {nameB} {pairs[hovered].ayahB} · {Math.round(pairs[hovered].score * 100)}% {language === 'tr' ? 'benzerlik' : 'similarity'}
        </p>
      )}
    </div>
  );
}

// ── WORD VENN ─────────────────────────────────────────────────────────────────
function WordVenn({ wordsA, wordsB, display, colorA, colorB, nameA, nameB, language }) {
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

  // Kelime bulutu — satır listesi yerine sıklığa göre puntolanmış, sarıp
  // kendi içeriği kadar yer kaplayan chip'ler. Geniş ekranda liste satırları
  // kelime ile rakam arasında büyük boş aralık bırakıyordu (1fr sütun,
  // içerik sabit genişlik) — bulut deseni bu sorunu yapısal olarak ortadan
  // kaldırır: chip'ler ne kadar yer olursa olsun kendi genişliğinde kalır.
  const cloud = (items, color, freqMap, align) => {
    if (items.length === 0) {
      return <p style={{ color: SEMANTIC.textFaint, fontSize: '0.78rem', margin: 0 }}>—</p>;
    }
    const freqs = items.map(w => freqMap[w]);
    const min = Math.min(...freqs), max = Math.max(...freqs);
    const size = (f) => {
      const t = max > min ? (f - min) / (max - min) : 0.5;
      return 0.74 + t * 0.56; // 0.74rem .. 1.30rem
    };
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 8px', justifyContent: align }}>
        {items.map(w => (
          <span key={w} title={`${display?.[w] || w} — ${freqMap[w]}×`} style={{
            color, fontSize: `${size(freqMap[w])}rem`, fontWeight: 600, lineHeight: 1.3,
            background: `${color}14`, border: `1px solid ${color}30`,
            padding: '3px 9px', borderRadius: RADIUS.pillSm, whiteSpace: 'nowrap',
          }}>{display?.[w] || w}</span>
        ))}
      </div>
    );
  };

  return (
    <div
      className="sc-word-venn"
      style={{
        /* 4 gerçek grid item'ı var (Only A, ayraç, Shared, Only B) — kolon
           sayısı .sc-word-venn'de (globals.css, §14.2) — mobilde tek sütuna
           çöker. */
        display: 'grid',
        gap: '0', border: '1px solid rgba(255,255,255,0.07)', borderRadius: RADIUS.xl, overflow: 'hidden',
      }}
    >
      {/* Only A */}
      <div style={{ padding: '16px' }}>
        <p style={{ color: colorA, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px', margin: '0 0 10px' }}>
          {nameA} {language === 'tr' ? 'özgü' : 'only'}
        </p>
        {cloud(onlyA, colorA, wordsA, 'flex-start')}
      </div>
      {/* Divider */}
      <div style={{ width: '1px', background: 'rgba(255,255,255,0.07)' }} />
      {/* Shared */}
      <div style={{
        padding: '16px', background: 'rgba(212,165,116,0.05)',
        borderLeft: '1px solid rgba(255,255,255,0.07)',
        borderRight: '1px solid rgba(255,255,255,0.07)',
        minWidth: '160px',
      }}>
        <p style={{ color: COLORS.gold, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px', margin: '0 0 10px', textAlign: 'center' }}>
          {language === 'tr' ? 'Ortak' : 'Shared'}
        </p>
        {shared.length === 0 ? (
          <p style={{ color: SEMANTIC.textFaint, fontSize: '0.78rem', margin: 0, textAlign: 'center' }}>—</p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 10px', justifyContent: 'center' }}>
            {shared.map(w => (
              <span key={w} title={`${nameA}: ${wordsA[w]}× · ${nameB}: ${wordsB[w]}×`} style={{
                display: 'inline-flex', alignItems: 'baseline', gap: '4px',
                background: 'rgba(212,165,116,0.1)', border: '1px solid rgba(212,165,116,0.28)',
                padding: '3px 9px', borderRadius: RADIUS.pillSm,
              }}>
                <span style={{ fontSize: '0.62rem', color: colorA, fontWeight: 700 }}>{wordsA[w]}</span>
                <span style={{ color: COLORS.gold, fontSize: '0.84rem', fontWeight: 700 }}>{display?.[w] || w}</span>
                <span style={{ fontSize: '0.62rem', color: colorB, fontWeight: 700 }}>{wordsB[w]}</span>
              </span>
            ))}
          </div>
        )}
      </div>
      {/* Only B */}
      <div style={{ padding: '16px' }}>
        <p style={{ color: colorB, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px', margin: '0 0 10px', textAlign: 'right' }}>
          {nameB} {language === 'tr' ? 'özgü' : 'only'}
        </p>
        {cloud(onlyB, colorB, wordsB, 'flex-end')}
      </div>
    </div>
  );
}

// ── STRUCTURAL PROFILE BARS ────────────────────────────────────────────────────
function ProfileBarRow({ label, valueA, valueB, displayA, displayB, colorA, colorB, unit }) {
  const max = Math.max(valueA, valueB, 1);
  const pctA = Math.max(4, Math.round((valueA / max) * 100));
  const pctB = Math.max(4, Math.round((valueB / max) * 100));
  return (
    <div style={{ marginBottom: '16px' }}>
      <p style={{ color: SEMANTIC.textFaint, fontSize: '0.74rem', marginBottom: '8px', textAlign: 'center' }}>
        {label}{unit ? ` (${unit})` : ''}
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', alignItems: 'center' }}>
        {/* A bar — grows from right, aligned to center divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'flex-end' }}>
          <span style={{ color: colorA, fontSize: '0.85rem', fontWeight: 700, flexShrink: 0, minWidth: '48px', textAlign: 'right' }}>{displayA}</span>
          <div style={{ flex: 1, maxWidth: '160px', height: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: RADIUS.pillSm, overflow: 'hidden', display: 'flex', justifyContent: 'flex-end' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pctA}%` }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              style={{ height: '100%', background: colorA, borderRadius: RADIUS.pillSm }}
            />
          </div>
        </div>
        {/* B bar — grows from left */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ flex: 1, maxWidth: '160px', height: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: RADIUS.pillSm, overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pctB}%` }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              style={{ height: '100%', background: colorB, borderRadius: RADIUS.pillSm }}
            />
          </div>
          <span style={{ color: colorB, fontSize: '0.85rem', fontWeight: 700, flexShrink: 0, minWidth: '48px' }}>{displayB}</span>
        </div>
      </div>
    </div>
  );
}

function StructuralProfile({ profA, profB, colorA, colorB, language }) {
  const fmt = (n) => Math.round(n).toLocaleString(language === 'tr' ? 'tr-TR' : 'en-US');
  return (
    <div style={{ padding: '20px', borderRadius: RADIUS.xl, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
      <p style={{ color: SEMANTIC.textFaint, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '4px' }}>
        {language === 'tr' ? 'Yapısal Profil' : 'Structural Profile'}
      </p>
      <p style={{ color: SEMANTIC.textFaint, fontSize: '0.72rem', marginBottom: '18px', opacity: 0.85 }}>
        {language === 'tr'
          ? 'Arapça metne dayalı ölçümler — çeviriden bağımsız.'
          : 'Measured from the Arabic text — independent of translation.'}
      </p>
      <ProfileBarRow
        label={language === 'tr' ? 'Ayet sayısı' : 'Verse count'}
        valueA={profA.verseCount} valueB={profB.verseCount}
        displayA={fmt(profA.verseCount)} displayB={fmt(profB.verseCount)}
        colorA={colorA} colorB={colorB}
      />
      <ProfileBarRow
        label={language === 'tr' ? 'Ortalama ayet uzunluğu' : 'Average verse length'}
        valueA={profA.avgWords} valueB={profB.avgWords}
        displayA={profA.avgWords.toFixed(1)} displayB={profB.avgWords.toFixed(1)}
        unit={language === 'tr' ? 'kelime' : 'words'}
        colorA={colorA} colorB={colorB}
      />
      <ProfileBarRow
        label={language === 'tr' ? 'Toplam kelime' : 'Total word count'}
        valueA={profA.totalWords} valueB={profB.totalWords}
        displayA={fmt(profA.totalWords)} displayB={fmt(profB.totalWords)}
        colorA={colorA} colorB={colorB}
      />
      <ProfileBarRow
        label={language === 'tr' ? 'Kelime çeşitliliği' : 'Vocabulary richness'}
        valueA={profA.vocabSize} valueB={profB.vocabSize}
        displayA={fmt(profA.vocabSize)} displayB={fmt(profB.vocabSize)}
        unit={language === 'tr' ? 'benzersiz kök' : 'distinct terms'}
        colorA={colorA} colorB={colorB}
      />
    </div>
  );
}

// ── REVELATION-ORDER STRIP ─────────────────────────────────────────────────────
function RevelationStrip({ order, rankA, rankB, nameA, nameB, colorA, colorB, language }) {
  if (!order || order.length === 0 || !rankA || !rankB) return null;
  const total = order.length;
  const pos = (rank) => `${((rank - 1) / (total - 1)) * 100}%`;
  // İki sûrenin nüzul sırası çok yakınsa (ör. #87/#89) iki etiket üst üste
  // biner — bu durumda B'nin etiketini noktanın ALTINA taşı.
  const closeMarkers = Math.abs(rankA - rankB) / total < 0.06;

  return (
    <div style={{ padding: '20px', borderRadius: RADIUS.xl, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
      <p style={{ color: SEMANTIC.textFaint, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '4px' }}>
        {language === 'tr' ? 'Nüzul Sırasındaki Konum' : 'Position in Revelation Order'}
      </p>
      <p style={{ color: SEMANTIC.textFaint, fontSize: '0.72rem', marginBottom: '22px', opacity: 0.85 }}>
        {language === 'tr'
          ? `114 sûre, vahiy sırasına göre — 1 (${language === 'tr' ? 'ilk' : 'first'}) → ${total} (${language === 'tr' ? 'son' : 'last'}).`
          : `All 114 surahs by revelation order — 1 (first) → ${total} (last).`}
      </p>
      <div style={{ position: 'relative', height: closeMarkers ? '56px' : '38px' }}>
        {/* Base track — Mekkî/Medenî shading */}
        <div style={{ position: 'absolute', top: closeMarkers ? '24px' : '16px', left: 0, right: 0, height: '6px', borderRadius: RADIUS.pillSm, overflow: 'hidden', display: 'flex' }}>
          {order.map((o, i) => (
            <div key={i} style={{
              flex: 1, height: '100%',
              background: o.period === 'mekki' ? 'rgba(212,165,116,0.18)' : 'rgba(96,165,250,0.14)',
            }} />
          ))}
        </div>
        {/* Marker A — always above the dot */}
        <div title={`${nameA} — #${rankA}`} style={{
          position: 'absolute', top: closeMarkers ? '8px' : 0, left: pos(rankA), transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px',
        }}>
          <span style={{ fontSize: '0.62rem', fontWeight: 700, color: colorA, whiteSpace: 'nowrap' }}>{nameA}</span>
          <span style={{ width: '10px', height: '10px', borderRadius: RADIUS.full, background: colorA, border: '2px solid rgba(6,8,20,0.9)', boxShadow: `0 0 8px ${colorA}` }} />
        </div>
        {/* Marker B — flips below the dot when markers sit close together */}
        <div title={`${nameB} — #${rankB}`} style={{
          position: 'absolute', top: closeMarkers ? '30px' : 0, left: pos(rankB), transform: 'translateX(-50%)',
          display: 'flex', flexDirection: closeMarkers ? 'column-reverse' : 'column', alignItems: 'center', gap: '2px',
        }}>
          <span style={{ fontSize: '0.62rem', fontWeight: 700, color: colorB, whiteSpace: 'nowrap' }}>{nameB}</span>
          <span style={{ width: '10px', height: '10px', borderRadius: RADIUS.full, background: colorB, border: '2px solid rgba(6,8,20,0.9)', boxShadow: `0 0 8px ${colorB}` }} />
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.68rem', color: SEMANTIC.textFaint }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'rgba(212,165,116,0.5)' }} />
          {language === 'tr' ? 'Mekkî' : 'Meccan'}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.68rem', color: SEMANTIC.textFaint }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'rgba(96,165,250,0.4)' }} />
          {language === 'tr' ? 'Medenî' : 'Medinan'}
        </span>
      </div>
    </div>
  );
}

// ── THEME VENN (proportional overlap circles) ──────────────────────────────────
function ThemeVennDiagram({ onlyA, onlyB, shared, colorA, colorB }) {
  const totalA = onlyA + shared;
  const totalB = onlyB + shared;
  if (totalA === 0 && totalB === 0) return null;
  const rA = 26 + Math.sqrt(totalA) * 11;
  const rB = 26 + Math.sqrt(totalB) * 11;
  const maxOverlap = Math.min(rA, rB) * 1.7;
  const overlapFrac = shared > 0 ? Math.min(1, shared / Math.max(totalA, totalB, 1)) : 0;
  const d = rA + rB - overlapFrac * maxOverlap;
  const cx = 110, cy = 78;
  const xA = cx - d / 2, xB = cx + d / 2;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0 14px' }}>
      <svg width="220" height="150" viewBox="0 0 220 150" aria-hidden="true">
        <circle cx={xA} cy={cy} r={rA} fill={`${colorA}22`} stroke={`${colorA}70`} strokeWidth="1.5" />
        <circle cx={xB} cy={cy} r={rB} fill={`${colorB}22`} stroke={`${colorB}70`} strokeWidth="1.5" />
        <text x={xA - rA * 0.42} y={cy} textAnchor="middle" fontSize="15" fontWeight="800" fill={colorA} fontFamily="'Inter', sans-serif">{onlyA}</text>
        <text x={xB + rB * 0.42} y={cy} textAnchor="middle" fontSize="15" fontWeight="800" fill={colorB} fontFamily="'Inter', sans-serif">{onlyB}</text>
        {shared > 0 && (
          <text x={cx} y={cy + 4} textAnchor="middle" fontSize="15" fontWeight="800" fill={COLORS.gold} fontFamily="'Inter', sans-serif">{shared}</text>
        )}
      </svg>
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
  const [isMobile, setIsMobile] = useState(false)  // SSR-safe; useEffect h() post-mount hydrate;

  // Load all data — re-runs when loadKey changes (manual retry)
  useEffect(() => {
    const promises = [];
    if (!cachedVerses) promises.push(fetch('/verse-graph-bgem3.json').then(r => r.json()).then(d => { cachedVerses = d; }));
    if (!cachedSurahInfo) promises.push(fetch('/surah-info.json').then(r => r.json()).then(d => { cachedSurahInfo = d; }));
    if (!cachedRevOrder) promises.push(fetch('/revelation-order.json').then(r => r.json()).then(d => { cachedRevOrder = d; }));
    if (promises.length === 0) { setLoading(false); return; }
    setLoading(true);
    Promise.all(promises).then(() => setLoading(false)).catch(() => setLoading(false));
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
    h(); // post-mount hydrate
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  // Build revolution order map: surah -> rank
  // `loading` gövdede okunmuyor ama kasıtlı — cachedRevOrder modül seviyeli
  // mutable bir cache (React state değil), fetch tamamlanıp `loading` false
  // olduğunda dolduruluyor (satır ~496); bu memo'yu YENİDEN hesaplamanın tek
  // sinyali bu. Kaldırılırsa revRankMap ilk (boş) haliyle donar.
  const revRankMap = useMemo(() => {
    if (!cachedRevOrder) return {};
    const m = {};
    (cachedRevOrder.order || []).forEach(item => { m[item.surah] = item.rank; });
    return m;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  // Quick preset pairs — ranked by actual cross-link count, diverse topics
  // Bu 8 çift, `verse-graph-bgem3.json`'daki TÜM 4993 bağlantılı sûre
  // çiftinden gerçek ayet-ayet bağ sayısına göre sıralanıp, konu çeşitliliği
  // için elle seçilmiştir (ör. hepsi en tepede kümelenmiş "Ehl-i Kitap"
  // temalı olmasın diye). `links` sayıları tek seferlik bir betikle
  // gerçek veriden ölçülmüştür (§13.30) — 15 Ağustos'ta önceki sürümdeki
  // 8 sayının 8'i de gerçek değerle uyuşmuyordu (ör. Bakara-Âl-i İmrân
  // "854" yazıyordu, gerçeği 732), düzeltildi.
  const PRESETS = [
    { a: 2,  b: 3,  links: 732, labelTr: 'Bakara & Âl-i İmrân',  labelEn: 'Al-Baqara & Al-Imran',   reasonTr: 'Ehl-i Kitap diyalogu, Medenî kardeş sûreler',      reasonEn: 'People of the Book, sister Medinan surahs' },
    { a: 26, b: 37, links: 589, labelTr: "Şu'arâ & Sâffât",       labelEn: 'Ash-Shuara & As-Saffat', reasonTr: 'Aynı peygamber kıssaları iki farklı anlatıyla',    reasonEn: 'Same prophet stories in two different styles' },
    { a: 2,  b: 5,  links: 451, labelTr: 'Bakara & Mâide',        labelEn: 'Al-Baqara & Al-Maida',   reasonTr: 'Yahudi-Hristiyan diyalogu, helal-haram hükümleri', reasonEn: 'Jewish-Christian dialogue, food laws' },
    { a: 4,  b: 33, links: 370, labelTr: 'Nisâ & Ahzâb',          labelEn: 'An-Nisa & Al-Ahzab',     reasonTr: 'Aile hukuku, münafıklar, kadın hakları',           reasonEn: "Family law, hypocrites, women's rights" },
    { a: 7,  b: 26, links: 312, labelTr: "A'râf & Şu'arâ",        labelEn: "Al-A'raf & Ash-Shuara",  reasonTr: 'Helak edilen kavimler paralel anlatıyla',          reasonEn: 'Destroyed nations told in parallel' },
    { a: 3,  b: 5,  links: 290, labelTr: 'Âl-i İmrân & Mâide',   labelEn: 'Al-Imran & Al-Maida',    reasonTr: 'Hz. İsa teması, Ehl-i Kitap ile ortak zemin',      reasonEn: 'Jesus theme, common ground with Scripture' },
    { a: 2,  b: 24, links: 277, labelTr: 'Bakara & Nûr',          labelEn: 'Al-Baqara & An-Nur',     reasonTr: 'İslam hukuku: aile ve toplum iki farklı açıdan',   reasonEn: 'Islamic law: family & social dimensions' },
    { a: 6,  b: 10, links: 245, labelTr: "En'âm & Yûnus",         labelEn: 'Al-Anam & Yunus',        reasonTr: 'Tevhid delilleri, tabiat ayetleri, Mekkî inanç',   reasonEn: 'Proofs of monotheism, nature signs' },
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
      // A'nın hakim casing'i öncelikli, B yalnız A'da bulunmayan anahtarlar için.
      const wordDisplay = { ...wordDisplayForms(vB), ...wordDisplayForms(vA) };

      const profA = structuralProfile(vA);
      const profB = structuralProfile(vB);

      const linkPairs = computeLinkPairs(vA, vB, 32);

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
        freqA, freqB, wordDisplay, profA, profB, linkPairs,
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
      background: COLORS.cosmicBlack,
      minHeight: 'calc(100vh - 62px)',
      paddingTop: '62px',
      display: 'flex', flexDirection: 'column',
      fontFamily: "'Inter', sans-serif",
    }}>

      <ToolHeader
        icon={<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>}
        titleTr="Sûre DNA Karşılaştırıcı"
        titleEn="Surah DNA Comparator"
        subtitleTr="İki sûrenin yapısal parmak izi"
        subtitleEn="Two surahs, side by side"
        language={language}
        chip={view === 'result' && surahA && surahB ? (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: COLOR_A, fontWeight: 700, fontSize: '0.78rem' }}>{SURAH_NAMES_TR[surahA]}</span>
            <span style={{ color: SEMANTIC.textFaint, fontSize: '0.7rem' }}>vs</span>
            <span style={{ color: COLOR_B, fontWeight: 700, fontSize: '0.78rem' }}>{SURAH_NAMES_TR[surahB]}</span>
          </span>
        ) : null}
      />

      {/* "Yeni Karşılaştırma" geri tuşu — sadece result view'da */}
      {view === 'result' && (
        <div className="sc-toolbar" style={{ flexShrink: 0 }}>
          <button
            onClick={() => setView('landing')}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: 'rgba(255,255,255,0.06)', border: `1px solid ${COLORS.glassBorder}`,
              borderRadius: RADIUS.md, padding: '6px 12px', cursor: 'pointer',
              color: COLORS.silver, fontSize: '0.82rem', fontWeight: 500,
              transition: `all ${TRANSITION.fast}`, fontFamily: "'Inter', sans-serif",
            }}
            onMouseEnter={e => { e.currentTarget.style.color = COLORS.offWhite; }}
            onMouseLeave={e => { e.currentTarget.style.color = COLORS.silver; }}
          >
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            {language === 'tr' ? 'Yeni Karşılaştırma' : 'New Comparison'}
          </button>
        </div>
      )}

      {/* ── LOADING ───────────────────────────────────────────────────── */}
      {loading && (
        // minHeight ~gerçek "landing" içeriğinin yüksekliğine (ölçülen ~1070px
        // mobilde) yaklaştırılmış — CrossToolCTA bu bloğun KARDEŞİ (aşağıda,
        // koşulsuz render ediliyor); üstteki kardeş küçükken CTA'nın Y konumu
        // ~1000px yukarıda oluyor, veri gelip bu blok "landing" içeriğiyle
        // değişince CTA aşağı fırlıyor — büyük CLS (Z3-V kök #2 ile aynı
        // aile, farklı mekanizma: boyut değil KONUM sıçraması).
        <div style={{ flex: 1, minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
          <div style={{ width: '36px', height: '36px', border: `2px solid ${COLORS.goldAlpha15}`, borderTopColor: COLORS.gold, borderRadius: RADIUS.full, animation: 'spin 0.8s linear infinite' }} />
          <p style={{ color: SEMANTIC.textFaint, fontSize: '0.85rem' }}>{language === 'tr' ? 'Ayet verileri yükleniyor…' : 'Loading verse data…'}</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* ── LANDING ───────────────────────────────────────────────────── */}
      {!loading && view === 'landing' && (
        <div className="sc-landing-wrap" style={{ flex: 1, overflowY: 'auto', maxWidth: '800px', width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>

          <p style={{ color: COLORS.silver, fontSize: '0.98rem', lineHeight: 1.8, marginBottom: '36px', maxWidth: '620px' }}>
            {language === 'tr'
              ? 'İki sûre seç. Ortak kelimeler, temalar, peygamberler ve anlamsal benzerlik görsel olarak karşılaştırılır.'
              : 'Select two surahs. Shared words, themes, figures, and semantic similarity are compared visually.'}
          </p>

          {/* Two selectors */}
          <div className="sc-selector-grid" style={{ display: 'grid', alignItems: 'center', marginBottom: '32px' }}>
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
            <div className="sc-vs-divider" style={{ padding: '0 20px', textAlign: 'center', paddingTop: '24px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: RADIUS.full,
                background: 'rgba(255,255,255,0.04)', border: `1px solid ${COLORS.glassBorder}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: SEMANTIC.textFaint, fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.05em',
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
                borderRadius: RADIUS.lg, cursor: canCompare ? 'pointer' : 'not-allowed',
                color: canCompare ? COLORS.offWhite : COLORS.slate700,
                fontSize: '0.92rem', fontWeight: canCompare ? 700 : 400,
                transition: `all ${TRANSITION.base}`, letterSpacing: '0.04em',
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
            <p style={{ color: SEMANTIC.textFaint, fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '4px' }}>
              {language === 'tr' ? 'Önerilen Karşılaştırmalar' : 'Suggested Pairs'}
            </p>
            <p style={{ color: SEMANTIC.textFaint, fontSize: '0.72rem', marginBottom: '14px', opacity: 0.85, maxWidth: '560px' }}>
              {language === 'tr'
                ? "114 sûre arasındaki tüm ayet-ayet bağları tarandı; en güçlü bağlı çiftlerden konu çeşitliliği gözetilerek seçildi. Çubuk, bu 8 çift arasındaki göreli bağ yoğunluğunu gösterir."
                : 'Scanned across every verse-level link among all 114 sûrahs; these are the most strongly linked pairs, picked for topical diversity. The bar shows relative link density among these 8.'}
            </p>
            <div className="sc-preset-grid" style={{ display: 'grid', gap: '10px' }}>
              {PRESETS.map(p => {
                const isSelected = surahA === p.a && surahB === p.b;
                const barPct = Math.round((p.links / PRESETS[0].links) * 100);
                return (
                  <button
                    key={`${p.a}-${p.b}`}
                    onClick={() => { setSurahA(p.a); setSurahB(p.b); }}
                    style={{
                      padding: '14px 16px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '8px',
                      background: isSelected ? 'rgba(212,165,116,0.08)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${isSelected ? COLORS.goldAlpha30 : 'rgba(255,255,255,0.08)'}`,
                      borderRadius: RADIUS.lg, cursor: 'pointer',
                      transition: `all ${TRANSITION.fast}`, fontFamily: "'Inter', sans-serif",
                    }}
                    onMouseEnter={e => { if (!isSelected) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
                    onMouseLeave={e => { if (!isSelected) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                  >
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '10px' }}>
                      <span style={{ fontSize: '0.86rem', fontWeight: 700 }}>
                        <span style={{ color: COLOR_A }}>{language === 'tr' ? p.labelTr.split(' & ')[0] : p.labelEn.split(' & ')[0]}</span>
                        <span style={{ color: SEMANTIC.textFaint, fontWeight: 400 }}> & </span>
                        <span style={{ color: COLOR_B }}>{language === 'tr' ? p.labelTr.split(' & ')[1] : p.labelEn.split(' & ')[1]}</span>
                      </span>
                      <span style={{ fontSize: '0.68rem', color: SEMANTIC.textFaint, flexShrink: 0, whiteSpace: 'nowrap' }}>
                        {p.links} {language === 'tr' ? 'bağ' : 'links'}
                      </span>
                    </div>
                    <div style={{ height: '4px', borderRadius: RADIUS.pillSm, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${barPct}%`, borderRadius: RADIUS.pillSm, background: `linear-gradient(90deg, ${COLOR_A}, ${COLOR_B})` }} />
                    </div>
                    <span style={{ fontSize: '0.76rem', color: COLORS.silver, lineHeight: 1.4 }}>
                      {language === 'tr' ? p.reasonTr : p.reasonEn}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── RESULT ERROR FALLBACK ─────────────────────────────────────── */}
      {!loading && view === 'result' && !analysis && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          <p style={{ color: SEMANTIC.textFaint, fontSize: '0.9rem', margin: 0 }}>
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
                border: '1px solid rgba(212,165,116,0.3)', borderRadius: RADIUS.md,
                color: COLORS.gold, fontSize: '0.85rem', cursor: 'pointer',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {language === 'tr' ? 'Tekrar Dene' : 'Retry'}
            </button>
            <button
              onClick={() => setView('landing')}
              style={{
                padding: '8px 20px', background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)', borderRadius: RADIUS.md,
                color: COLORS.silver, fontSize: '0.85rem', cursor: 'pointer',
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
        <div className="sc-result-wrap" style={{ flex: 1, overflowY: 'auto' }}>
          <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* ── ROW 1: Stats cards + Similarity gauge ── */}
            <div className="sc-selector-grid" style={{ display: 'grid', gap: '16px', alignItems: 'stretch' }}>

              {/* Surah A card */}
              <div style={{
                padding: '20px', borderRadius: RADIUS.xl,
                background: `${COLOR_A}0c`, border: `1px solid ${COLOR_A}25`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <span style={{
                    width: '36px', height: '36px', borderRadius: RADIUS.full,
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
                <p style={{ color: SEMANTIC.textFaint, fontSize: '0.68rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '8px', textAlign: 'center' }}>
                  {language === 'tr' ? 'Benzerlik' : 'Similarity'}
                </p>
                <SimilarityGauge score={analysis.finalScore} />
                <p style={{ color: SEMANTIC.textFaint, fontSize: '0.68rem', marginTop: '4px', textAlign: 'center' }}>
                  {analysis.sim.links + analysis.simReverse.links}{' '}
                  {language === 'tr' ? 'çapraz bağ' : 'cross-links'}
                </p>
                <p style={{ color: SEMANTIC.textFaint, fontSize: '0.62rem', marginTop: '6px', textAlign: 'center', lineHeight: 1.5, maxWidth: '120px' }}>
                  {language === 'tr'
                    ? 'Sûredeki her ayet, tüm Kur\'an\'daki en yakın 20 ayete bağlı. Skor bu bağların yoğunluğunu ölçer.'
                    : "Each verse links to its 20 closest verses in the Quran. Score measures link density."}
                </p>
              </div>

              {/* Surah B card */}
              <div style={{
                padding: '20px', borderRadius: RADIUS.xl,
                background: `${COLOR_B}0c`, border: `1px solid ${COLOR_B}25`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <span style={{
                    width: '36px', height: '36px', borderRadius: RADIUS.full,
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

            {/* ── ROW 1.5: Genome Alignment — the centerpiece ── */}
            <GenomeAlignment
              vA={analysis.vA} vB={analysis.vB} pairs={analysis.linkPairs}
              nameA={SURAH_NAMES_TR[surahA]} nameB={SURAH_NAMES_TR[surahB]}
              colorA={COLOR_A} colorB={COLOR_B} gradId="sc-dna-grad"
              language={language}
            />

            {/* ── ROW 2: Structural profile + revelation-order position ── */}
            <div className="sc-compare-grid-2" style={{ display: 'grid', gap: '16px' }}>
              <StructuralProfile profA={analysis.profA} profB={analysis.profB} colorA={COLOR_A} colorB={COLOR_B} language={language} />
              <RevelationStrip
                order={cachedRevOrder?.order}
                rankA={revRankMap[surahA]} rankB={revRankMap[surahB]}
                nameA={SURAH_NAMES_TR[surahA]} nameB={SURAH_NAMES_TR[surahB]}
                colorA={COLOR_A} colorB={COLOR_B} language={language}
              />
            </div>

            {/* ── ROW 3: Word DNA — shared/unique vocabulary ── */}
            <div>
              <p style={{ color: SEMANTIC.textFaint, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '4px' }}>
                {language === 'tr' ? 'Kelime DNA\'sı' : 'Word DNA'}
              </p>
              <p style={{ color: SEMANTIC.textFaint, fontSize: '0.72rem', marginBottom: '14px', opacity: 0.85 }}>
                {language === 'tr'
                  ? 'Çeviri metninde en sık geçen anlamlı kelimeler — hangileri özgü, hangileri paylaşılıyor.'
                  : 'Most frequent significant words in the translated text — which are unique, which are shared.'}
              </p>
              <WordVenn
                wordsA={analysis.freqA} wordsB={analysis.freqB} display={analysis.wordDisplay}
                colorA={COLOR_A} colorB={COLOR_B}
                nameA={SURAH_NAMES_TR[surahA]} nameB={SURAH_NAMES_TR[surahB]}
                language={language}
              />
            </div>

            {/* ── ROW 4: Figures ── */}
            {(analysis.figShared.length > 0 || analysis.figOnlyA.length > 0 || analysis.figOnlyB.length > 0) && (
              <div style={{ padding: '18px', borderRadius: RADIUS.xl, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
                <p style={{ color: SEMANTIC.textFaint, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '14px' }}>
                  {language === 'tr' ? 'Şahsiyetler ve Figürler' : 'Figures & Prophets'}
                </p>
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                  {analysis.figShared.length > 0 && (
                    <div>
                      <p style={{ color: COLORS.gold, fontSize: '0.7rem', marginBottom: '8px' }}>
                        {language === 'tr' ? 'Her ikisinde' : 'Both'}
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {analysis.figShared.map(f => <FigurePill key={f.key} label={f.label} color={COLORS.gold} />)}
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
                <p style={{ color: SEMANTIC.textFaint, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', margin: 0 }}>
                  {language === 'tr' ? 'Tematik Karşılaştırma' : 'Thematic Comparison'}
                </p>
                {analysis.themeJaccard > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{
                      fontSize: '1.1rem', fontWeight: 800,
                      color: analysis.themeJaccard >= 50 ? '#4caf7d' : analysis.themeJaccard >= 25 ? COLORS.gold : COLORS.silver,
                    }}>
                      %{analysis.themeJaccard}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: SEMANTIC.textFaint }}>
                      {language === 'tr' ? 'tema örtüşmesi' : 'theme overlap'}
                    </span>
                  </div>
                )}
              </div>

              {/* Jaccard explanation */}
              <p style={{ fontSize: '0.72rem', color: SEMANTIC.textFaint, marginBottom: '4px', lineHeight: 1.5 }}>
                {language === 'tr'
                  ? `Benzerlik skoru: ${analysis.themesShared.length} ortak tema ÷ ${analysis.themesOnlyA.length + analysis.themesShared.length + analysis.themesOnlyB.length} toplam farklı tema (Jaccard katsayısı)`
                  : `Similarity score: ${analysis.themesShared.length} shared themes ÷ ${analysis.themesOnlyA.length + analysis.themesShared.length + analysis.themesOnlyB.length} total unique themes (Jaccard coefficient)`}
              </p>

              <ThemeVennDiagram
                onlyA={analysis.themesOnlyA.length} onlyB={analysis.themesOnlyB.length}
                shared={analysis.themesShared.length} colorA={COLOR_A} colorB={COLOR_B}
              />

              {/* Theme Venn: A (left) | B (right) top row; Shared (centered) bottom row */}
              <div style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: RADIUS.xl, overflow: 'hidden' }}>
                {/* Top row: Only A | Only B */}
                <div className="sc-compare-grid-2" style={{ display: 'grid', borderBottom: analysis.themesShared.length > 0 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}>
                  {/* Only A */}
                  <div style={{ padding: '16px', background: `${COLOR_A}08`, borderRight: '1px solid rgba(255,255,255,0.07)' }}>
                    <p style={{ color: COLOR_A, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>
                      {SURAH_NAMES_TR[surahA]} {language === 'tr' ? 'özgü' : 'only'}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {analysis.themesOnlyA.length === 0 ? (
                        <span style={{ color: SEMANTIC.textFaint, fontSize: '0.78rem' }}>—</span>
                      ) : analysis.themesOnlyA.map((t, i) => (
                        <span key={i} style={{
                          padding: '4px 10px', borderRadius: RADIUS.pillSm, fontSize: '0.78rem',
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
                        <span style={{ color: SEMANTIC.textFaint, fontSize: '0.78rem' }}>—</span>
                      ) : analysis.themesOnlyB.map((t, i) => (
                        <span key={i} style={{
                          padding: '4px 10px', borderRadius: RADIUS.pillSm, fontSize: '0.78rem',
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
                          padding: '4px 10px', borderRadius: RADIUS.pillSm, fontSize: '0.78rem', fontWeight: 600,
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
              <div className="sc-compare-grid-2" style={{ display: 'grid', gap: '16px' }}>
                {[{ info: analysis.infoA, num: surahA, color: COLOR_A }, { info: analysis.infoB, num: surahB, color: COLOR_B }].map(({ info, num, color }) =>
                  info.fadail ? (
                    <div key={num} style={{ padding: '16px', borderRadius: RADIUS.lg, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <p style={{ color, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
                        {SURAH_NAMES_TR[num]} — {language === 'tr' ? 'Fazileti' : 'Virtue'}
                      </p>
                      <p style={{ color: SEMANTIC.textFaint, fontSize: '0.8rem', lineHeight: 1.7, margin: 0 }}>
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

      {/* Cross-tool CTA — #202 (2026-07-16) */}
      <div className="zf2-tool-cta-wrap" style={{ maxWidth: 1080, margin: '0 auto', width: '100%' }}>
        <CrossToolCTA
          language={language}
          isMobile={isMobile}
          links={[
            { href: `/${language}/atlas/munasebat`, titleTr: 'Münâsebât Atlası', titleEn: 'Munāsabāt Atlas', descTr: 'Sureler arası anlamsal bağlar — klasik tefsir gelenekleriyle.', descEn: 'Semantic ties between surahs — from the classical tafsir tradition.' },
            { href: `/${language}/graf/zaman`, titleTr: 'Nüzul Zaman Çizgisi', titleEn: 'Revelation Timeline', descTr: 'Sûrelerin nüzul dönemleri (Mekki/Medeni) — kronolojik akış.', descEn: 'Revelation periods of surahs (Meccan/Medinan) — chronological flow.' },
            { href: `/${language}/graf/kelime-isi`, titleTr: 'Kelime Isı Haritası', titleEn: 'Word Heatmap', descTr: 'Bir kelimenin 114 sure boyunca yoğunluk dağılımı.', descEn: 'Distribution density of a word across all 114 surahs.' },
          ]}
        />

        {/* #181 (2026-07-17) — Sûreler arası karşılaştırma / münâsebât klasik literatürü */}
        <SourcesCitation
          language={language}
          isMobile={isMobile}
          sources={[
            {
              author: 'el-Bikâî',
              workTr: "Nazmü\'d-Dürer fî Tenâsübi\'l-Âyi ve\'s-Süver",
              workEn: 'Naẓm al-Durar fī Tanāsub al-Āy wa al-Suwar',
              period: '1406–1480 (Kahire)',
              noteTr: "Sûreler-arası münâsebât ilminin temel eseri — her sûrenin bir öncekiyle bağını sistematik ayet-ayet inceler. Sûre DNA karşılaştırmasının klasik zemini.",
              noteEn: "The foundational work of inter-sūrah munāsabāt studies — systematically examines each sūrah's link with the previous one verse by verse. The classical grounding for inter-sūrah comparison.",
            },
            {
              author: 'es-Süyûtî',
              workTr: "el-İtkān fî Ulûmi\'l-Kurʾân",
              workEn: 'al-Itqān fī ʿUlūm al-Qurʾān',
              period: '1445–1505 (Kahire)',
              noteTr: 'Kur\'ân ilimleri ansiklopedisi; sûrelerin başlangıç-son münâsebeti (ibtidâ-hâtime), fâsıla ilişkisi, mü\'menun aleyh gibi başlıkları buradan gelir.',
              noteEn: 'Encyclopedia of Quranic sciences; topics like the beginning-ending correspondence of sūrahs (ibtidāʾ-khātima), fāsila relations, and shared themes come from here.',
            },
            {
              author: 'ez-Zerkeşî',
              workTr: "el-Burhân fî Ulûmi\'l-Kurʾân",
              workEn: 'al-Burhān fī ʿUlūm al-Qurʾān',
              period: '1344–1392 (Kahire)',
              noteTr: 'Tenâsüb (koherens) bahsi (bölüm 2) — sûrelerin nüzul sırasında değil mushaf tertibinde neden bu düzende olduğunu belağat perspektifinden savunur.',
              noteEn: 'On tanāsub / coherence (§2) — argues from a rhetorical perspective why sūrahs are arranged in mushaf order rather than revelation order.',
            },
            {
              author: 'Neal Robinson',
              workTr: 'Kurʾân\'ı Keşfetmek',
              workEn: 'Discovering the Qurʾan',
              period: '1996 (SCM Press)',
              noteTr: 'Modern akademik münâsebât çalışması — Michel Cuypers ve Neuwirth\'in yanında sûre iç-yapısı + sûreler-arası bağların çağdaş sistematik analizini yapar.',
              noteEn: 'Modern academic study of munāsabāt — alongside Cuypers and Neuwirth, offers a contemporary systematic analysis of intra-sūrah structure + inter-sūrah ties.',
            },
          ]}
        />
      </div>
    </div>
  );
}

function StatRow({ label, value, color }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px' }}>
      <span style={{ color: SEMANTIC.textFaint, fontSize: '0.75rem' }}>{label}</span>
      <span style={{ color: color || COLORS.silver, fontSize: '0.82rem', fontWeight: 600, textAlign: 'right' }}>{value || '—'}</span>
    </div>
  );
}

function FigurePill({ label, color }) {
  return (
    <span style={{
      padding: '4px 10px', borderRadius: RADIUS.pillSm,
      background: color + '15', border: `1px solid ${color}35`,
      color, fontSize: '0.78rem', fontWeight: 600,
    }}>{label}</span>
  );
}
