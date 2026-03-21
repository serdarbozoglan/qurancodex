import { useRef, useEffect, useState, useCallback, useMemo, useReducer } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import * as THREE from 'three';
import { useLanguage } from '../i18n/LanguageContext';

// ─── Strip footnotes from Suat Yıldırım translation ──────────────────────────
// Removes {KM, Tesniye 4,35; İşaya 43,10-11} style cross-reference notes.
function cleanTr(str) {
  if (!str) return str;
  return str
    .replace(/\s*\{[^}]*\}/g, '')          // {KM, Tesniye 4,35} curly-brace refs
    .replace(/\s*\[\d[^\]]*\]/g, '')        // [36,56; 40,47; 7,53] square-bracket refs
    .trim();
}

// ─── Arabic normalization ──────────────────────────────────────────────────────
// Strips harakat + tatweel + normalizes alef/yeh variants for robust matching.
function stripHarakat(str) {
  if (!str) return '';
  return str
    .normalize('NFC')
    .replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED]/g, '')
    .replace(/\u0640/g, '')           // tatweel/kashida
    .replace(/[أإآٱ]/g, 'ا')         // alef variants → plain alef
    .replace(/[ىئ]/g, 'ي')           // yeh variants
    .trim();
}

// Word-overlap matching for Arabic: returns true if ≥60% of query words appear in verse.
function arabicWordMatch(queryStripped, verseStripped) {
  const words = queryStripped.split(/\s+/).filter(w => w.length > 2);
  if (words.length === 0) return false;
  const matches = words.filter(w => verseStripped.includes(w)).length;
  return matches >= Math.max(1, Math.ceil(words.length * 0.6));
}

// ─── Turkish normalization ────────────────────────────────────────────────────
function normalizeTr(str) {
  if (!str) return '';
  return str.toLowerCase()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/â/g, 'a').replace(/î/g, 'i').replace(/û/g, 'u');
}
// For surah name matching: also strip hyphens, spaces, apostrophes
function normalizeForSearch(str) {
  return normalizeTr(str).replace(/[-\s'''ʿ]/g, '');
}

// ─── Direct verse lookup: "2:5", "bakara 5", "bakara suresi 5. ayet" ─────────
function parseDirectVerseQuery(query, verses) {
  const q = query.trim();

  // "2:5" or "2 5"
  const numericMatch = q.match(/^(\d{1,3})[:\s](\d{1,3})$/);
  if (numericMatch) {
    const id = `${parseInt(numericMatch[1])}:${parseInt(numericMatch[2])}`;
    return verses.find(v => v.id === id) || null;
  }

  // "surename [suresi] [N.] [ayet]"  e.g. "bakara 5", "bakara suresi 5. ayet"
  const nameMatch = q
    .replace(/\.\s*ayet\b/gi, '')   // strip ". ayet"
    .replace(/\bsuresi\b/gi, '')    // strip "suresi"
    .trim()
    .match(/^(.+?)\s+(\d+)$/);

  if (nameMatch) {
    const namePart = nameMatch[1].trim();
    const ayah = parseInt(nameMatch[2]);
    const qName = normalizeForSearch(namePart);
    const surahIdx = SURAH_NAMES_TR.findIndex(n => normalizeForSearch(n).includes(qName));
    if (surahIdx >= 0) {
      const id = `${surahIdx + 1}:${ayah}`;
      return verses.find(v => v.id === id) || null;
    }
  }

  return null;
}

// ─── Surah names ──────────────────────────────────────────────────────────────
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
function surahNameTr(n) { return SURAH_NAMES_TR[n - 1] || ''; }

// ─── Transliteration → Arabic text ───────────────────────────────────────────
// Allows Latin-alphabet searches like "bismillah" to find Arabic verses.
const ARABIC_SEARCH_MAP = {
  'bismillah': 'بسم', 'besmele': 'بسم', 'besmeli': 'بسم',
  'elhamdulillah': 'الحمد', 'hamd': 'الحمد', 'elhamd': 'الحمد',
  'rahman': 'الرحمن', 'rahim': 'الرحيم',
  'allah': 'الله', 'illallah': 'إلا الله',
  'subhanallah': 'سبحان', 'subhan': 'سبحان',
  'allahu ekber': 'الله أكبر', 'ekber': 'أكبر',
  'la ilahe': 'لا إله',
  'elif lam mim': 'الم', 'eliflammim': 'الم', 'elif-lam-mim': 'الم',
  'elif lam ra': 'الر', 'eliflamra': 'الر',
  'elif lam mim sad': 'المص', 'eliflammimsad': 'المص',
  'ha mim': 'حم', 'hamim': 'حم',
  'ta sin': 'طس', 'tasin': 'طس', 'ta-sin': 'طس',
  'ta sin mim': 'طسم', 'tasinmim': 'طسم',
  'ya sin': 'يس', 'ya-sin': 'يس',
  'kaf ha ya ayn sad': 'كهيعص',
  'cennet': 'الجنة', 'cennete': 'الجنة',
  'cehennem': 'النار', 'nar': 'النار',
  'musa': 'موسى', 'hz musa': 'موسى',
  'isa': 'عيسى', 'hz isa': 'عيسى',
  'ibrahim': 'إبراهيم', 'hz ibrahim': 'إبراهيم',
  'firavun': 'فرعون',
  'meryem': 'مريم',
  'muhammed': 'محمد', 'hz muhammed': 'محمد',
  'nuh': 'نوح', 'hz nuh': 'نوح',
  'adem': 'آدم', 'hz adem': 'آدم',
  'tevbe': 'تُوبُوا',
  'sabir': 'الصَّابِرِينَ', 'sabr': 'الصَّابِرِينَ',
  'takva': 'تقوى',
  'zikir': 'ذكر', 'zikr': 'ذكر',
  'salat': 'الصَّلَاة', 'namaz': 'الصَّلَاة',
  'zekat': 'الزَّكَاة',
  'oruç': 'الصِّيَامَ', 'oruc': 'الصِّيَامَ', 'siyam': 'الصِّيَامَ',
  'hac': 'الْحَجُّ',
  'kuran': 'الْقُرْآنَ', 'quran': 'الْقُرْآنَ',
};

// ─── Word-level Turkish phonetic → Arabic lookup ──────────────────────────────
// Enables "elhamdülillahi rabbil alemin" → finds Fatiha 1:2
const LATIN_QURAN_WORDS = {
  // Bismillah (tüm yaygın varyantlar)
  'bismillah':'بسم','bismillahi':'بسم','bismillahir':'بسم','bismi':'بسم','bism':'بسم',
  'besmele':'بسم','besmelei':'بسم',
  // Hamd / Fatiha — Türkçe varyantlar
  'elhamdu':'الحمد','elhamd':'الحمد','elhamdü':'الحمد',
  'elhamdulillah':'الحمد لله','elhamdülillah':'الحمد لله',
  'elhamdulillahi':'الحمد لله','elhamdülillahi':'الحمد لله',
  'elhamdullilah':'الحمد لله','elhamdullilahi':'الحمد لله',
  'elhamdullah':'الحمد لله','elhamdullahi':'الحمد لله',
  // Hamd / Fatiha — İngilizce/Arapça varyantlar (al- prefix)
  'alhamdu':'الحمد','alhamd':'الحمد',
  'alhamdulillah':'الحمد لله','alhamdulillahi':'الحمد لله',
  'alhamdullilah':'الحمد لله','alhamdullilahi':'الحمد لله',
  'alhamdullah':'الحمد لله','alhamdullahi':'الحمد لله',
  'alhamdulah':'الحمد لله','alhamdulelah':'الحمد لله',
  'hamd':'حمد','hamdu':'حمد','hamden':'حمد',
  'lillah':'لله','lillahi':'لله','lillâhi':'لله',
  'rabb':'رب','rabbi':'رب','rabbil':'رب','rabbim':'ربي','rabbina':'ربنا','rabbiküm':'ربكم',
  'alemin':'العالمين','âlemin':'العالمين','alamin':'العالمين','alemine':'العالمين',
  'rahman':'رحمن','errahman':'الرحمن','rahmen':'رحمن',
  'rahim':'رحيم','errahim':'الرحيم',
  'malik':'ملك','maliki':'ملك','melik':'ملك',
  'yevm':'يوم','yevmi':'يوم','yevme':'يوم','yevmed':'يوم',
  'yevmeddin':'يوم الدين','yevmiddin':'يوم الدين',
  'din':'دين','dini':'دين',
  'nabudu':'نعبد','ibadet':'عبادة',
  'nestaîn':'نستعين','nestein':'نستعين','nestain':'نستعين','nesteîn':'نستعين',
  'ihdina':'اهدنا','ihdinessiratal':'اهدنا الصراط',
  'sirat':'صراط','sırat':'صراط','siratal':'صراط','sıratal':'صراط',
  'müstakim':'مستقيم','mustakim':'مستقيم','müstakîm':'مستقيم',
  'enamt':'أنعمت','nimet':'نعمة',
  'gayr':'غير','gayrı':'غير','gayri':'غير','gayrıl':'غير',
  'magdub':'مغضوب','mağdub':'مغضوب','magdubi':'مغضوب',
  'dallin':'ضالين','dâllin':'ضالين',
  // İhlas
  'kul':'قل','kull':'قل',
  'huv':'هو','hüv':'هو','huve':'هو','hüve':'هو','huvallah':'الله',
  'ahad':'أحد','ehed':'أحد',
  'samed':'الصمد','essamed':'الصمد',
  'yeled':'يلد','veled':'ولد','lem':'لم',
  'kefuv':'كفؤ','küfüv':'كفؤ','küfüven':'كفؤ',
  // Ayetel Kürsî
  'ilahe':'إله','ilah':'إله','ilaheillallah':'لا إله إلا الله',
  'illa':'إلا','illâ':'إلا','illallah':'إلا الله',
  'hayy':'حي','hayyul':'الحي','hayyun':'حي',
  'kayyum':'القيوم','kayyüm':'القيوم','kayyümü':'القيوم',
  'sene':'سنة','nevim':'نوم',
  'kursi':'كرسي','kürsiyy':'كرسي','kürsî':'كرسي',
  // Allah + sıfatlar
  'allah':'الله','allahu':'الله','allahi':'الله','allahü':'الله',
  'subhan':'سبحان','subhanallah':'سبحان الله','subhanallahi':'سبحان الله',
  'ekber':'أكبر','allahüekber':'الله أكبر',
  'aziz':'عزيز','azîz':'عزيز',
  'hakim':'حكيم','hakîm':'حكيم',
  'alim':'عليم','âlim':'عليم','alîm':'عليم',
  'kadir':'قدير','kâdir':'قدير','kadîr':'قدير',
  'semi':'سميع','semî':'سميع','semiun':'سميع',
  'basir':'بصير','basîr':'بصير',
  'tevvab':'تواب',
  'gafur':'غفور','gafûr':'غفور',
  'gaffar':'غفار',
  'latif':'لطيف','latîf':'لطيف',
  'habir':'خبير','habîr':'خبير',
  'kerim':'كريم','kerîm':'كريم',
  'rauf':'رؤوف',
  'vedud':'ودود',
  'vasi':'واسع','vâsi':'واسع',
  'muhit':'محيط',
  'kahhar':'قهار',
  'cebbar':'جبار',
  'kuddüs':'قدوس','kuddus':'قدوس',
  'selam':'سلام',
  'muheymin':'مهيمن',
  'bari':'باري',
  'musavvir':'مصور',
  // Peygamberler
  'ibrahim':'إبراهيم',
  'musa':'موسى','hz musa':'موسى',
  'isa':'عيسى','hz isa':'عيسى',
  'muhammed':'محمد','hz muhammed':'محمد','muhammedin':'محمد',
  'ahmed':'أحمد',
  'nuh':'نوح','hz nuh':'نوح',
  'adem':'آدم','hz adem':'آدم',
  'yunus':'يونس',
  'davud':'داود',
  'süleyman':'سليمان',
  'yusuf':'يوسف',
  'yahya':'يحيى',
  'zekeriyya':'زكريا','zekeriyye':'زكريا',
  'idris':'إدريس',
  'hud':'هود',
  'salih':'صالح',
  'lut':'لوط',
  'meryem':'مريم',
  'firavun':'فرعون',
  'haman':'هامان',
  // Dinî kavramlar
  'salat':'الصلاة','namaz':'الصلاة',
  'zekat':'الزكاة',
  'oruç':'الصيام','oruc':'الصيام','siyam':'الصيام',
  'hac':'الحج',
  'kuran':'القرآن','quran':'القرآن',
  'kitab':'الكتاب','kitabı':'الكتاب',
  'ayet':'آية',
  'tevbe':'توبة','tövbe':'توبة',
  'iman':'إيمان',
  'islam':'إسلام',
  'cihat':'جهاد','cihad':'جهاد',
  'zikir':'ذكر','zikr':'ذكر',
  'dua':'دعاء',
  'şükür':'شكر','şukr':'شكر','şükr':'شكر',
  'sabır':'صبر','sabr':'صبر','sabrı':'صبر',
  'takva':'التقوى','takvanın':'التقوى',
  'ihsan':'إحسان',
  'adalet':'عدل',
  // Tabiat / evren
  'semavat':'السماوات','sema':'سماء','gökyüzü':'سماء',
  'arz':'الأرض',
  'nur':'نور',
  'nar':'نار',
  'cennet':'الجنة','cennete':'الجنة','cennette':'الجنة',
  'cehennem':'جهنم','cehenneme':'جهنم',
  'şems':'شمس',
  'kamer':'قمر',
  'necm':'نجم','yıldız':'نجم',
  'bahr':'بحر',
  'rüzgar':'الريح','rüzgâr':'الريح',
  // İnsanlar
  'nas':'الناس','nâs':'الناس',
  'insan':'إنسان',
  'mümin':'مؤمن','muminun':'مؤمنون',
  'müslim':'مسلم',
  'kafir':'كافر','kâfir':'كافر','kafirun':'كافرون',
  'fasik':'فاسق',
  'münafik':'منافق','münafıkun':'منافقون',
  'zalim':'ظالم','zalimun':'ظالمون',
  'abd':'عبد','ibaad':'عباد',
  // Mukatta'at harfler
  'elif lam mim':'الم','eliflammim':'الم','elif-lam-mim':'الم',
  'elif lam ra':'الر','eliflamra':'الر',
  'ya sin':'يس','ya-sin':'يس','yasin':'يس',
  'ha mim':'حم','hamim':'حم',
  'ta sin':'طس','tasin':'طس',
  'kaf':'كٓ','nun':'نٓ',
  // Felak & Nas
  'felak':'الفلق','euzü':'أعوذ','euzu':'أعوذ',
  'birabbilfeleq':'برب الفلق','birabbin':'برب الناس',
};

// Normalize Latin query word for lookup
function normLatin(w) {
  return w.toLowerCase()
    .replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ş/g,'s')
    .replace(/ı/g,'i').replace(/ö/g,'o').replace(/ç/g,'c')
    .replace(/â/g,'a').replace(/î/g,'i').replace(/û/g,'u')
    .replace(/[^a-z\s]/g,'');
}

// Lookup a single normalized Latin word against LATIN_QURAN_WORDS with suffix stripping.
function lookupLatinWord(w) {
  if (LATIN_QURAN_WORDS[w]) return LATIN_QURAN_WORDS[w];
  // Strip common Turkish grammatical suffixes to get stem
  const suffixes = ['lerin','larin','leri','lari','nın','nin','nun','nün',
    'dan','den','tan','ten','nda','nde','ndan','nden','ya','ye','da','de',
    'ta','te','yi','yı','yu','yü','i','ı','u','ü','a','e'];
  for (const s of suffixes) {
    if (w.endsWith(s) && w.length > s.length + 2) {
      const stem = w.slice(0, w.length - s.length);
      if (LATIN_QURAN_WORDS[stem]) return LATIN_QURAN_WORDS[stem];
    }
  }
  // Strip trailing 'n' (izafet/tamlama)
  if (w.endsWith('n') && w.length > 3 && LATIN_QURAN_WORDS[w.slice(0,-1)]) {
    return LATIN_QURAN_WORDS[w.slice(0,-1)];
  }
  // Fuzzy: try collapsing double consonants (rabbil→rabil, illah→ilah)
  const deduped = w.replace(/(.)\1+/g, '$1');
  if (deduped !== w && LATIN_QURAN_WORDS[deduped]) return LATIN_QURAN_WORDS[deduped];
  // Prefix match: "elham" → "elhamdulillah", "rabb" → "rabbil"
  if (w.length >= 4) {
    for (const [key, ar] of Object.entries(LATIN_QURAN_WORDS)) {
      if (key.startsWith(w)) return ar;
    }
  }
  return null;
}

// Convert a multi-word Latin transliteration query to Arabic words for AND-matching.
// Only activates for 2+ word queries; single words go through findArabicMatch.
// Returns array of Arabic strings (all must appear in verse) or null.
function latinToArabicWords(query) {
  if (/[\u0600-\u06FF]/.test(query)) return null; // already Arabic

  const words = normLatin(query).split(/\s+/).filter(Boolean);
  if (words.length < 2) return null; // single word → findArabicMatch handles it

  const arWords = [];
  for (const w of words) {
    const ar = lookupLatinWord(w);
    if (ar) arWords.push(ar);
  }
  // Require at least half the words to map (minimum 1 for 2-word queries)
  return arWords.length >= Math.max(1, Math.ceil(words.length / 2)) ? arWords : null;
}

function findArabicMatch(query) {
  const q = normalizeForSearch(query);
  // 1. Exact match or query starts with a known key (e.g. "bismillahirrahman" → "bismillah")
  for (const [key, arabic] of Object.entries(ARABIC_SEARCH_MAP)) {
    const k = normalizeForSearch(key);
    if (k === q || q.startsWith(k)) return arabic;
  }
  // 2. Prefix match: query is a prefix of a known key (e.g. "elham" → "elhamdulillah")
  if (q.length >= 4) {
    for (const [key, arabic] of Object.entries(ARABIC_SEARCH_MAP)) {
      if (normalizeForSearch(key).startsWith(q)) return arabic;
    }
    // Also check LATIN_QURAN_WORDS keys
    for (const [key, arabic] of Object.entries(LATIN_QURAN_WORDS)) {
      if (key.startsWith(q)) return arabic;
    }
  }
  return null;
}

// Standart Medine mushafı sayfa aralıkları [başlangıç, bitiş] — 114 sure
const SURAH_PAGES = [
  [1,1],[2,49],[50,76],[77,105],[106,127],[128,150],[151,176],[177,186],[187,207],[208,220],
  [221,234],[235,248],[249,254],[255,261],[262,266],[267,281],[282,292],[293,304],[305,311],[312,321],
  [322,331],[332,341],[342,349],[350,358],[359,366],[367,376],[377,384],[385,395],[396,403],[404,410],
  [411,414],[415,417],[418,427],[428,433],[434,439],[440,445],[446,451],[452,457],[458,466],[467,476],
  [477,482],[483,488],[489,495],[496,498],[499,501],[502,506],[507,510],[511,514],[515,517],[518,519],
  [520,522],[523,525],[526,527],[528,530],[531,533],[534,536],[537,541],[542,544],[545,548],[549,550],
  [551,552],[553,553],[554,555],[556,557],[558,559],[560,561],[562,563],[564,565],[566,567],[568,569],
  [570,571],[572,573],[574,574],[575,576],[577,577],[578,579],[580,581],[582,582],[583,584],[585,585],
  [586,586],[587,587],[587,589],[589,589],[590,590],[590,590],[591,591],[592,592],[593,594],[594,595],
  [595,595],[595,596],[596,596],[596,596],[597,597],[597,598],[598,598],[598,599],[599,599],[599,600],
  [600,600],[600,600],[601,601],[601,601],[601,601],[602,602],[602,602],[602,602],[603,603],[603,603],
  [603,603],[604,604],[604,604],[604,604],
];

// Mekkî sûreler altın, Medenî sûreler zümrüt yeşili
const MEKKI_COLOR  = '#c9a227';  // royal gold  (Mekke — çöl, kökler)
const MEDENI_COLOR = '#1a7a4c';  // quranic green (Medine — medeniyet, büyüme)
const MEDANI_SURAHS = new Set([
  2,3,4,5,8,9,13,22,24,33,47,48,49,55,57,58,59,60,61,62,63,64,65,66,76,98,99,110
]);
function surahColor(n) { return MEDANI_SURAHS.has(n) ? MEDENI_COLOR : MEKKI_COLOR; }
function isMedeni(n)   { return MEDANI_SURAHS.has(n); }

function hex(s) { return new THREE.Color(s); }

// ─── Glowing node object (Three.js) ──────────────────────────────────────────
function makeNodeObject(node, isSelected, isHovered, isDimmed) {
  const group = new THREE.Group();

  // Dimmed: warm amber micro-dot, barely visible
  if (isDimmed) {
    group.add(new THREE.Mesh(
      new THREE.SphereGeometry(0.8, 6, 6),
      new THREE.MeshLambertMaterial({ color: hex('#d4a574'), transparent: true, opacity: 0.11 })
    ));
    return group;
  }

  const color = isSelected ? '#f0c860' : (isHovered ? '#fff8ee' : node.color);
  const base = node.ghost ? 1.2 : (1.6 + Math.sqrt(node.degree || 1) * 0.65);
  const size = isSelected ? base * 2.0 : (isHovered ? base * 1.5 : base);

  // Core sphere
  group.add(new THREE.Mesh(
    new THREE.SphereGeometry(size, 16, 16),
    new THREE.MeshLambertMaterial({
      color: hex(color), emissive: hex(color),
      emissiveIntensity: isSelected ? 1.0 : (isHovered ? 0.6 : (node.ghost ? 0.12 : 0.4)),
      transparent: node.ghost, opacity: node.ghost ? 0.3 : 1,
    })
  ));
  // Outer glow halo
  if (!node.ghost) {
    group.add(new THREE.Mesh(
      new THREE.SphereGeometry(size * (isSelected ? 2.8 : 2.0), 12, 12),
      new THREE.MeshLambertMaterial({ color: hex(color), transparent: true, opacity: isSelected ? 0.14 : (isHovered ? 0.1 : 0.05), depthWrite: false })
    ));
  }
  // Selected: golden ring
  if (isSelected) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(size * 3.2, 0.35, 8, 48),
      new THREE.MeshLambertMaterial({ color: hex('#f0c860'), emissive: hex('#d4a574'), emissiveIntensity: 1.0, transparent: true, opacity: 0.75 })
    );
    ring.rotation.x = Math.PI / 2;
    group.add(ring);
    // Second ring at 45°
    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(size * 3.2, 0.2, 6, 48),
      new THREE.MeshLambertMaterial({ color: hex('#d4a574'), transparent: true, opacity: 0.35, depthWrite: false })
    );
    ring2.rotation.x = Math.PI / 4;
    group.add(ring2);
  }
  return group;
}

// ─── Build graph data ─────────────────────────────────────────────────────────
// mode='all': tüm ayetler, score >= 0.55
// mode='surah': odak sure + bağlı dış ayetler (ghost), score >= 0.45
function buildGraphData(verses, filterSurah, mode = 'all') {
  const verseMap = Object.fromEntries(verses.map(v => [v.id, v]));
  const THRESHOLD = mode === 'surah' ? 0.50 : 0.58;
  const LINK_LIMIT = mode === 'surah' ? 8 : 5; // max links rendered per verse

  let primary, primarySet;
  if (filterSurah && mode === 'surah') {
    primary = verses.filter(v => v.surah === filterSurah);
    primarySet = new Set(primary.map(v => v.id));
  } else {
    primary = filterSurah ? verses.filter(v => v.surah === filterSurah) : verses;
    primarySet = new Set(primary.map(v => v.id));
  }

  const degree = {};
  const links = [];
  const seen = new Set();
  const ghostIds = new Set(); // cross-surah nodes to include

  for (const v of primary) {
    let linkCount = 0;
    for (const conn of (v.connections || [])) {
      if (conn.score < THRESHOLD) break; // connections are sorted desc
      if (linkCount >= LINK_LIMIT) break;
      const key = [v.id, conn.id].sort().join('|');
      if (seen.has(key)) { continue; }
      seen.add(key);

      // In surah mode, include cross-surah connections
      if (mode === 'surah' && !primarySet.has(conn.id) && verseMap[conn.id]) {
        ghostIds.add(conn.id);
      }
      if (!primarySet.has(conn.id) && !ghostIds.has(conn.id) && mode !== 'surah') continue;

      links.push({ source: v.id, target: conn.id, score: conn.score });
      degree[v.id] = (degree[v.id] || 0) + 1;
      degree[conn.id] = (degree[conn.id] || 0) + 1;
      linkCount++;
    }
  }

  const allIds = mode === 'surah' ? [...primarySet, ...ghostIds] : [...primarySet];
  const rawNodes = allIds
    .map(id => verseMap[id])
    .filter(Boolean)
    .map(v => ({
      id: v.id, surah: v.surah, ayah: v.ayah,
      surahName: v.surahName, arabic: v.arabic,
      english: v.english, turkish: v.turkish,
      x: v.x * 80, y: v.y * 80, z: v.z * 80,
      color: surahColor(v.surah),
      connections: v.connections,
      degree: degree[v.id] || 0,
      ghost: mode === 'surah' && !primarySet.has(v.id),
    }));

  // Clamp outlier positions: nodes beyond 3σ from mean are pulled to 3σ boundary
  const n = rawNodes.length;
  if (n > 1) {
    for (const axis of ['x', 'y', 'z']) {
      const vals = rawNodes.map(nd => nd[axis]);
      const mean = vals.reduce((a, b) => a + b, 0) / n;
      const std = Math.sqrt(vals.reduce((a, b) => a + (b - mean) ** 2, 0) / n);
      const lo = mean - 3 * std, hi = mean + 3 * std;
      rawNodes.forEach(nd => { nd[axis] = Math.max(lo, Math.min(hi, nd[axis])); });
    }
  }
  const nodes = rawNodes;

  return { nodes, links };
}

// ─── Compute surah cluster centroids from UMAP positions ──────────────────────
function computeClusters(verses) {
  const map = {};
  for (const v of verses) {
    if (!map[v.surah]) map[v.surah] = { surah: v.surah, xs: [], ys: [], count: 0, connections: 0 };
    map[v.surah].xs.push(v.x);
    map[v.surah].ys.push(v.y);
    map[v.surah].count++;
  }
  // Count cross-surah connections per cluster
  for (const v of verses) {
    for (const c of (v.connections || [])) {
      if (c.score >= 0.65) map[v.surah].connections++;
    }
  }
  return Object.values(map).map(s => ({
    surah: s.surah,
    cx: s.xs.reduce((a, b) => a + b, 0) / s.xs.length,
    cy: s.ys.reduce((a, b) => a + b, 0) / s.ys.length,
    count: s.count,
    connections: s.connections,
  }));
}

// ─── Classical surah groupings (Islamic scholarship) ─────────────────────────
const CLASSICAL_GROUPS = [
  { id: 'fatiha',      tr: 'El-Fâtiha',           en: 'The Opening',            nx: 0.05, ny: 0.50, surahs: [1] },
  { id: 'tival',       tr: 'Tıval — Uzun Sûreler', en: 'Tiwāl — Long Surahs',   nx: 0.14, ny: 0.18, surahs: [2,3,4,5,6,7] },
  { id: 'medeni_b',    tr: 'Büyük Medenî',         en: 'Major Medinan',          nx: 0.16, ny: 0.60, surahs: [8,9,22,24,33,47,48,49] },
  { id: 'medeni_i',    tr: 'Medenî İdare',         en: 'Medinan Governance',     nx: 0.30, ny: 0.82, surahs: [57,58,59,60,61,62,63,64,65,66] },
  { id: 'kissas',      tr: 'Kıssas-ı Enbiyâ',      en: 'Prophet Narratives',     nx: 0.40, ny: 0.17, surahs: [10,11,12,14,15,17,18,19,20,21,26,27,28] },
  { id: 'kelam',       tr: 'Kelam & Yaratılış',    en: 'Theology & Creation',    nx: 0.53, ny: 0.50, surahs: [13,16,29,30,31,32,34,35,36,38,39,50,51,52,53] },
  { id: 'hamim',       tr: 'Hâmim Sûreleri',       en: 'Hā-Mīm Surahs',         nx: 0.40, ny: 0.78, surahs: [40,41,42,43,44,45,46] },
  { id: 'orta_mekki',  tr: 'Orta Mekkî',           en: 'Mid-Meccan',             nx: 0.66, ny: 0.22, surahs: [23,25,37,54,55,56,67,68,69,70,71,72] },
  { id: 'kiyamet',     tr: 'Kıyamet & Haberler',   en: 'Eschatology',            nx: 0.77, ny: 0.63, surahs: [73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91] },
  { id: 'kisa_mekki',  tr: 'Kısa Mekkî & Ahlak',  en: 'Short Meccan & Ethics',  nx: 0.88, ny: 0.22, surahs: [92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108] },
  { id: 'muavvizat',   tr: 'Muavvizât & Tevhid',   en: 'Protection & Tawḥīd',   nx: 0.93, ny: 0.80, surahs: [109,110,111,112,113,114] },
];
const SURAH_TO_GROUP = {};
CLASSICAL_GROUPS.forEach(g => g.surahs.forEach(s => { SURAH_TO_GROUP[s] = g; }));

// ─── Custom surah dropdown (replaces native <select>) ─────────────────────────
function SurahDropdown({ value, onChange, language, allowAll = false }) {
  const [open, setOpen] = useState(false);
  const [typeahead, setTypeahead] = useState('');
  const [highlightIdx, setHighlightIdx] = useState(-1);
  const taTimeout = useRef(null);
  const listRef = useRef(null);
  const containerRef = useRef(null);

  const placeholder = allowAll
    ? (language === 'tr' ? 'Tüm Sûreler' : 'All Surahs')
    : (language === 'tr' ? 'Sûreye git…' : 'Go to surah…');
  const currentLabel = value ? `${value}. ${surahNameTr(value)}` : placeholder;

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const h = (e) => { if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);

  // Scroll highlighted row into view
  useEffect(() => {
    if (!open || highlightIdx < 0 || !listRef.current) return;
    const offset = allowAll ? 1 : 0;
    listRef.current.children[highlightIdx + offset]?.scrollIntoView({ block: 'nearest' });
  }, [highlightIdx, open, allowAll]);

  const handleKey = (e) => {
    if (!open) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); }
      return;
    }
    if (e.key === 'Escape') { e.preventDefault(); setOpen(false); setHighlightIdx(-1); return; }
    if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightIdx >= 0) { onChange(highlightIdx + 1); setOpen(false); setHighlightIdx(-1); }
      return;
    }
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlightIdx(i => Math.min(i + 1, 113)); return; }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setHighlightIdx(i => Math.max(i - 1, 0)); return; }
    if (e.key.length === 1 && e.key !== ' ') {
      e.preventDefault();
      const next = typeahead + e.key;
      setTypeahead(next);
      clearTimeout(taTimeout.current);
      taTimeout.current = setTimeout(() => setTypeahead(''), 1200);
      const q = normalizeForSearch(next);
      const idx = Array.from({ length: 114 }, (_, i) => i)
        .find(i => normalizeForSearch(surahNameTr(i + 1)).includes(q));
      if (idx !== undefined) setHighlightIdx(idx);
    }
  };

  const itemStyle = (idx, s) => ({
    display: 'block', width: '100%', textAlign: 'left',
    padding: '7px 12px', border: 'none', cursor: 'pointer',
    borderBottom: '1px solid rgba(255,255,255,0.03)',
    background: (idx === highlightIdx || s === value) ? 'rgba(212,165,116,0.12)' : 'transparent',
    color: s === value ? '#d4a574' : (idx === highlightIdx ? '#e8e6e3' : '#94a3b8'),
    fontSize: '0.78rem', boxSizing: 'border-box',
  });

  return (
    <div ref={containerRef} style={{ position: 'relative' }} tabIndex={0} onKeyDown={handleKey}>
      <button tabIndex={-1}
        onClick={() => { setOpen(o => !o); setHighlightIdx(-1); }}
        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,165,116,0.2)', borderRadius: '8px', color: value ? '#e8e6e3' : '#64748b', padding: '0 26px 0 10px', fontSize: '0.82rem', outline: 'none', cursor: 'pointer', height: '32px', minWidth: '155px', maxWidth: '195px', textAlign: 'left', position: 'relative', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', boxSizing: 'border-box' }}>
        {currentLabel}
        <span style={{ position: 'absolute', right: '8px', top: '50%', transform: `translateY(-50%) rotate(${open ? 180 : 0}deg)`, transition: 'transform 0.15s', color: '#64748b', fontSize: '0.62rem', pointerEvents: 'none' }}>▾</span>
      </button>
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, background: '#0d1128', border: '1px solid rgba(212,165,116,0.2)', borderRadius: '10px', zIndex: 200, boxShadow: '0 12px 40px rgba(0,0,0,0.85)', overflow: 'hidden', width: '220px' }}>
          <div ref={listRef} style={{ maxHeight: '288px', overflowY: 'auto' }}>
            {allowAll && (
              <button onClick={() => { onChange(null); setOpen(false); }}
                style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 12px', background: !value ? 'rgba(212,165,116,0.1)' : 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.07)', color: !value ? '#d4a574' : '#94a3b8', fontSize: '0.78rem', cursor: 'pointer', boxSizing: 'border-box' }}>
                {language === 'tr' ? 'Tüm Sûreler' : 'All Surahs'}
              </button>
            )}
            {Array.from({ length: 114 }, (_, i) => i + 1).map((s, idx) => (
              <button key={s} style={itemStyle(idx, s)}
                onClick={() => { onChange(s); setOpen(false); setHighlightIdx(-1); }}
                onMouseEnter={() => setHighlightIdx(idx)}
              >
                <span style={{ color: '#4a5568', fontSize: '0.68rem', marginRight: '6px', display: 'inline-block', minWidth: '20px' }}>{s}.</span>
                {surahNameTr(s)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ClusterView — SVG bubble map ────────────────────────────────────────────
function ClusterView({ verses, surahClusters, onSelectSurah, onSelectVerse, language, onClose }) {
  const svgRef = useRef(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [hovered, setHovered] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const drag = useRef(null);
  const hasInitFit = useRef(false);
  const [viewMode, setViewMode] = useState('semantic'); // 'semantic' | 'classical'

  const clusterSearchResults = useMemo(() => {
    if (!verses || searchQuery.length < 2) return { direct: null, surahs: [], verses: [] };
    const qClean = normalizeForSearch(searchQuery);
    const q = normalizeTr(searchQuery);
    const direct = parseDirectVerseQuery(searchQuery, verses);
    const surahs = direct ? [] : SURAH_NAMES_TR
      .map((name, i) => ({ surah: i + 1, name }))
      .filter(s => normalizeForSearch(s.name).includes(qClean));
    const arabicMatch = findArabicMatch(searchQuery);
    const latinArWords = latinToArabicWords(searchQuery);
    const strippedQuery = stripHarakat(searchQuery);
    const isArabicInput = /[\u0600-\u06FF]/.test(searchQuery);
    const hasArabicRef = !!arabicMatch || !!latinArWords;
    const verseList = direct ? [] : verses.filter(v => {
      const strippedArabic = stripHarakat(v.arabic);
      return v.arabic.includes(searchQuery) || strippedArabic.includes(stripHarakat(searchQuery)) ||
      (isArabicInput && strippedQuery.length > 1 && (
        strippedArabic.includes(strippedQuery) ||
        arabicWordMatch(strippedQuery, strippedArabic)
      )) ||
      (latinArWords && latinArWords.length > 0 && latinArWords.every(w => strippedArabic.includes(stripHarakat(w)))) ||
      (arabicMatch && strippedArabic.includes(stripHarakat(arabicMatch))) ||
      normalizeTr(v.turkish).includes(q) ||
      normalizeTr(v.english).includes(q);
    }).slice(0, 6);
    return { direct, surahs, verses: verseList };
  }, [verses, searchQuery]);

  // Use pre-computed surah-level UMAP (from verse-graph connections) if available,
  // otherwise fall back to centroid of verse UMAP coordinates.
  const clusters = useMemo(() => {
    if (surahClusters && surahClusters.length > 0) {
      return surahClusters.map(c => ({ surah: c.surah, cx: c.x, cy: c.y, count: c.count }));
    }
    return computeClusters(verses);
  }, [surahClusters, verses]);

  // Normalize cluster positions to fit viewport
  const W = window.innerWidth;
  const H = window.innerHeight;
  const padding = 80;

  const { minX, maxX, minY, maxY } = useMemo(() => {
    const xs = clusters.map(c => c.cx), ys = clusters.map(c => c.cy);
    return { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) };
  }, [clusters]);

  const project = useCallback((cx, cy) => {
    const x = padding + ((cx - minX) / (maxX - minX)) * (W - padding * 2);
    const y = padding + ((cy - minY) / (maxY - minY)) * (H - padding * 2);
    return { x, y };
  }, [minX, maxX, minY, maxY, W, H]);

  const radius = useCallback((count) => Math.max(18, Math.min(48, 10 + Math.sqrt(count) * 2.8)), []);

  // Force-separate overlapping bubbles in screen space so no two circles overlap
  const separatedPositions = useMemo(() => {
    const pos = clusters.map(c => ({ surah: c.surah, count: c.count, ...project(c.cx, c.cy) }));
    const MARGIN = 5;
    for (let iter = 0; iter < 80; iter++) {
      let moved = false;
      for (let i = 0; i < pos.length; i++) {
        for (let j = i + 1; j < pos.length; j++) {
          const ri = radius(pos[i].count), rj = radius(pos[j].count);
          const minDist = ri + rj + MARGIN;
          const dx = pos[i].x - pos[j].x, dy = pos[i].y - pos[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < minDist && dist > 0.001) {
            const push = (minDist - dist) / 2;
            const nx = (dx / dist) * push, ny = (dy / dist) * push;
            pos[i].x += nx; pos[i].y += ny;
            pos[j].x -= nx; pos[j].y -= ny;
            moved = true;
          }
        }
      }
      if (!moved) break;
    }
    return Object.fromEntries(pos.map(p => [p.surah, { x: p.x, y: p.y }]));
  }, [clusters, project, radius]);

  // Classical view: position surahs near their scholarly group centers, then force-separate
  const classicalSeparatedPositions = useMemo(() => {
    if (!clusters.length) return {};
    const pos = clusters.map(c => {
      const g = SURAH_TO_GROUP[c.surah] || CLASSICAL_GROUPS[0];
      const gx = g.nx * W, gy = g.ny * H;
      const idx = g.surahs.indexOf(c.surah);
      const n = g.surahs.length;
      const angle = n > 1 ? (idx / n) * 2 * Math.PI : 0;
      const initR = Math.max(20, n * 14);
      return { surah: c.surah, count: c.count, gx, gy,
        x: gx + Math.cos(angle) * initR, y: gy + Math.sin(angle) * initR };
    });
    const MARGIN = 5, SPRING_K = 0.06;
    for (let iter = 0; iter < 350; iter++) {
      // Soft spring toward group center
      for (let i = 0; i < pos.length; i++) {
        pos[i].x += (pos[i].gx - pos[i].x) * SPRING_K;
        pos[i].y += (pos[i].gy - pos[i].y) * SPRING_K;
      }
      // Push apart overlapping bubbles
      let moved = false;
      for (let i = 0; i < pos.length; i++) {
        for (let j = i + 1; j < pos.length; j++) {
          const ri = radius(pos[i].count), rj = radius(pos[j].count);
          const minDist = ri + rj + MARGIN;
          const dx = pos[i].x - pos[j].x, dy = pos[i].y - pos[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < minDist && dist > 0.001) {
            const push = (minDist - dist) / 2;
            pos[i].x += (dx/dist)*push; pos[i].y += (dy/dist)*push;
            pos[j].x -= (dx/dist)*push; pos[j].y -= (dy/dist)*push;
            moved = true;
          }
        }
      }
      if (!moved) break;
    }
    return Object.fromEntries(pos.map(p => [p.surah, { x: p.x, y: p.y }]));
  }, [clusters, radius, W, H]);

  const activePositions = viewMode === 'classical' ? classicalSeparatedPositions : separatedPositions;

  // Compute a transform that fits all bubbles into the viewport (works for both modes)
  const fitTransform = useMemo(() => {
    const positions = viewMode === 'classical' ? classicalSeparatedPositions : separatedPositions;
    if (!clusters.length || !Object.keys(positions).length) return { x: 0, y: 0, scale: 1 };
    let minBX = Infinity, maxBX = -Infinity, minBY = Infinity, maxBY = -Infinity;
    clusters.forEach(c => {
      const pos = positions[c.surah];
      if (!pos) return;
      const r = radius(c.count);
      minBX = Math.min(minBX, pos.x - r);
      maxBX = Math.max(maxBX, pos.x + r);
      minBY = Math.min(minBY, pos.y - r);
      maxBY = Math.max(maxBY, pos.y + r);
    });
    const bboxW = maxBX - minBX;
    const bboxH = maxBY - minBY;
    const MARGIN = 48;
    const scale = Math.min((W - 2 * MARGIN) / bboxW, (H - 2 * MARGIN) / bboxH, 1.0);
    const x = W / 2 - scale * (minBX + bboxW / 2);
    const y = H / 2 - scale * (minBY + bboxH / 2);
    return { x, y, scale };
  }, [viewMode, classicalSeparatedPositions, separatedPositions, clusters, radius, W, H]);

  // Fit on initial mount; re-fit when mode changes
  useEffect(() => {
    if (!hasInitFit.current && Object.keys(activePositions).length > 0) {
      hasInitFit.current = true;
      setTransform(fitTransform);
    }
  }, [fitTransform, activePositions]);

  useEffect(() => {
    setTransform(fitTransform);
  }, [viewMode]); // eslint-disable-line react-hooks/exhaustive-deps

  // Pan
  const onMouseDown = useCallback((e) => {
    if (e.target.closest('.cluster-node')) return;
    drag.current = { startX: e.clientX - transform.x, startY: e.clientY - transform.y };
  }, [transform]);

  const onMouseMove = useCallback((e) => {
    if (!drag.current) return;
    setTransform(t => ({ ...t, x: e.clientX - drag.current.startX, y: e.clientY - drag.current.startY }));
  }, []);

  const onMouseUp = useCallback(() => { drag.current = null; }, []);

  // Zoom
  const onWheel = useCallback((e) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.12 : 0.89;
    const rect = svgRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    setTransform(t => {
      const newScale = Math.max(0.3, Math.min(6, t.scale * factor));
      const ratio = newScale / t.scale;
      return {
        scale: newScale,
        x: mx - ratio * (mx - t.x),
        y: my - ratio * (my - t.y),
      };
    });
  }, []);

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [onWheel]);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#080a1e', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20,
        display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 18px',
        background: 'linear-gradient(to bottom, rgba(6,8,14,0.98) 60%, transparent)',
      }}>
        <div style={{ flex: 1 }}>
          <span style={{ fontFamily: 'Playfair Display, serif', color: '#d4a574', fontSize: '1.05rem', fontWeight: 700 }}>
            {language === 'tr' ? 'Sûre Haritası' : 'Surah Map'}
          </span>
        </div>

        {/* Search */}
        <div style={{ position: 'relative' }}>
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={language === 'tr' ? 'Sûre, ayet veya kelime ara...' : 'Search surah, verse or keyword...'}
            dir="auto"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,165,116,0.2)', borderRadius: '8px', color: '#e8e6e3', padding: '6px 12px 6px 30px', fontSize: '0.82rem', width: '260px', outline: 'none', height: '32px', boxSizing: 'border-box' }}
          />
          <svg style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }}
            width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#d4a574" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          {/* Hint */}
          {!searchQuery && (
            <div style={{ position: 'absolute', top: '100%', left: '1px', marginTop: '5px', fontSize: '0.65rem', color: '#6b5a40', whiteSpace: 'nowrap', pointerEvents: 'none' }}>
              {language === 'tr' ? 'örn: Bismillah · Bakara 5 · 2:286 · Fatiha · iman' : 'e.g. Bismillah · Bakara 5 · 2:286 · Fatiha · faith'}
            </div>
          )}
          {(clusterSearchResults.direct || clusterSearchResults.surahs.length > 0 || clusterSearchResults.verses.length > 0) && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '4px',
              background: '#0d1128', border: '1px solid rgba(212,165,116,0.15)',
              borderRadius: '8px', overflow: 'hidden', zIndex: 30,
              boxShadow: '0 8px 32px rgba(0,0,0,0.6)', minWidth: '280px',
            }}>
              {clusterSearchResults.direct && (() => {
                const v = clusterSearchResults.direct;
                const vt = language === 'tr' ? (cleanTr(v.turkish) || v.english) : (v.english || cleanTr(v.turkish));
                return (
                  <button key={`cd-${v.id}`}
                    onClick={() => { onSelectVerse(v); setSearchQuery(''); }}
                    style={{ display: 'flex', flexDirection: 'column', gap: '3px', width: '100%', textAlign: 'left', padding: '10px 12px', background: 'rgba(212,165,116,0.1)', border: 'none', borderBottom: '1px solid rgba(212,165,116,0.12)', cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,165,116,0.18)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(212,165,116,0.1)'}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#d4a574', fontSize: '0.68rem', fontWeight: 700 }}>→ AYET</span>
                      <span style={{ color: '#d4a574', fontWeight: 700 }}>{v.id}</span>
                      <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{surahNameTr(v.surah)}</span>
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '0.72rem', lineHeight: 1.4 }}>{vt?.slice(0, 80)}...</div>
                  </button>
                );
              })()}
              {clusterSearchResults.surahs.map(s => (
                <button key={`cs-${s.surah}`}
                  onClick={() => { onSelectSurah(s.surah); setSearchQuery(''); }}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', textAlign: 'left', padding: '8px 12px', background: 'rgba(212,165,116,0.06)', border: 'none', borderBottom: '1px solid rgba(212,165,116,0.08)', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,165,116,0.14)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(212,165,116,0.06)'}>
                  <span style={{ color: '#d4a574', fontSize: '0.68rem', fontWeight: 700 }}>◈ SÛRE</span>
                  <span style={{ color: '#d4a574', fontWeight: 700 }}>{s.surah}. {s.name}</span>
                </button>
              ))}
              {clusterSearchResults.verses.map(v => {
                const vt = language === 'tr' ? (cleanTr(v.turkish) || v.english) : (v.english || cleanTr(v.turkish));
                return (
                  <button key={`cv-${v.id}`}
                    onClick={() => { onSelectVerse(v); setSearchQuery(''); }}
                    style={{ display: 'flex', flexDirection: 'column', gap: '2px', width: '100%', textAlign: 'left', padding: '8px 12px', background: 'none', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,165,116,0.08)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ color: '#d4a574', fontWeight: 700, fontSize: '0.78rem' }}>{v.id}</span>
                      <span style={{ color: '#64748b', fontSize: '0.7rem' }}>{surahNameTr(v.surah)}</span>
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '0.71rem', lineHeight: 1.4 }}>{vt?.slice(0, 70)}...</div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <SurahDropdown value={null} onChange={onSelectSurah} language={language} allowAll={false} />

        {/* Semantic / Classical toggle */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', overflow: 'hidden', height: '32px', boxSizing: 'border-box', flexShrink: 0 }}>
          {['semantic', 'classical'].map(mode => (
            <button key={mode} onClick={() => setViewMode(mode)}
              style={{ padding: '0 12px', fontSize: '0.75rem', cursor: 'pointer', border: 'none', height: '100%',
                background: viewMode === mode ? 'rgba(212,165,116,0.25)' : 'transparent',
                color: viewMode === mode ? '#d4a574' : '#64748b',
                fontWeight: viewMode === mode ? 600 : 400,
                transition: 'all 0.15s', borderRight: mode === 'semantic' ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
              {mode === 'semantic'
                ? (language === 'tr' ? 'Anlamsal' : 'Semantic')
                : (language === 'tr' ? 'Klasik' : 'Classical')}
            </button>
          ))}
        </div>

        <button onClick={onClose}
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#64748b', padding: '0 14px', fontSize: '0.78rem', cursor: 'pointer', height: '32px', boxSizing: 'border-box' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#e8e6e3'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#64748b'; }}>
          {language === 'tr' ? 'Kapat' : 'Close'}
        </button>
      </div>

      {/* SVG canvas */}
      <svg ref={svgRef} width={W} height={H}
        style={{ cursor: drag.current ? 'grabbing' : 'grab', display: 'block' }}
        onMouseDown={onMouseDown} onMouseMove={onMouseMove}
        onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
      >
        <defs>
          {[MEKKI_COLOR, MEDENI_COLOR].map((color, i) => (
            <radialGradient key={i} id={`glow-${i}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={color} stopOpacity="0.6" />
              <stop offset="60%" stopColor={color} stopOpacity="0.2" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </radialGradient>
          ))}
        </defs>

        <g transform={`translate(${transform.x},${transform.y}) scale(${transform.scale})`}>
          {/* Classical mode: group label watermarks */}
          {viewMode === 'classical' && CLASSICAL_GROUPS.map(g => (
            <text key={g.id} x={g.nx * W} y={g.ny * H}
              textAnchor="middle" dominantBaseline="middle"
              fontSize={13} fontWeight="700" letterSpacing="0.08em"
              fill="#d4a574" fillOpacity={0.22}
              style={{ pointerEvents: 'none', userSelect: 'none', textTransform: 'uppercase' }}>
              {language === 'tr' ? g.tr : g.en}
            </text>
          ))}

          {/* Connection lines between semantically close surahs (semantic mode only) */}
          {viewMode === 'semantic' && clusters.map(a => {
            const posA = activePositions[a.surah];
            return clusters
              .filter(b => b.surah > a.surah)
              .map(b => {
                const dist = Math.hypot(a.cx - b.cx, a.cy - b.cy);
                if (dist > 0.8) return null;
                const posB = activePositions[b.surah];
                const opacity = Math.max(0, 0.06 * (1 - dist / 0.8));
                return (
                  <line key={`${a.surah}-${b.surah}`}
                    x1={posA.x} y1={posA.y} x2={posB.x} y2={posB.y}
                    stroke="#d4a574" strokeWidth={0.5} opacity={opacity} />
                );
              });
          })}

          {/* Cluster bubbles */}
          {clusters.map(c => {
            const { x, y } = activePositions[c.surah] || { x: 0, y: 0 };
            const r = radius(c.count);
            const color = surahColor(c.surah);
            const colorIdx = isMedeni(c.surah) ? 1 : 0;
            const isHov = hovered === c.surah;

            return (
              <g key={c.surah} className="cluster-node"
                style={{ cursor: 'pointer' }}
                onClick={() => onSelectSurah(c.surah)}
                onMouseEnter={() => setHovered(c.surah)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Outer glow */}
                <circle cx={x} cy={y} r={r * (isHov ? 2.2 : 1.8)}
                  fill={`url(#glow-${colorIdx})`} opacity={isHov ? 0.28 : 0.12} />
                {/* Main circle */}
                <circle cx={x} cy={y} r={r}
                  fill={color} fillOpacity={isHov ? 0.9 : 0.7}
                  stroke={color} strokeWidth={isHov ? 2 : 1}
                  strokeOpacity={0.8}
                  style={{ filter: isHov ? `drop-shadow(0 0 8px ${color})` : 'none', transition: 'all 0.15s' }}
                />
                {/* Surah number — shift up slightly when name fits inside */}
                {(() => {
                  const showInside = r >= 22;
                  const numY = showInside ? y - r * 0.18 : y + 1;
                  return (
                    <text x={x} y={numY} textAnchor="middle" dominantBaseline="middle"
                      fontSize={Math.max(8, Math.min(13, r * 0.55))} fontWeight="700"
                      fill="#fff" fillOpacity={0.95} style={{ pointerEvents: 'none', userSelect: 'none' }}>
                      {c.surah}
                    </text>
                  );
                })()}
                {/* Name inside circle for large bubbles */}
                {r >= 22 && (
                  <text x={x} y={y + r * 0.35} textAnchor="middle" dominantBaseline="middle"
                    fontSize={Math.max(6, Math.min(9, r * 0.3))} fontWeight="400"
                    fill="#fff" fillOpacity={isHov ? 0.95 : 0.65}
                    style={{ pointerEvents: 'none', userSelect: 'none', transition: 'opacity 0.15s' }}>
                    {surahNameTr(c.surah)}
                  </text>
                )}
                {/* External label — only for small bubbles (always) or hover state */}
                {(() => {
                  const showInside = r >= 22;
                  if (showInside && !isHov) return null;
                  const nearBottom = y + r + 30 > H - 55;
                  const labelY = nearBottom ? y - r - 13 : y + r + 13;
                  const countY = nearBottom ? y - r - 25 : y + r + 25;
                  return (
                    <>
                      <text x={x} y={labelY} textAnchor="middle"
                        fontSize={isHov ? 11 : 9} fontWeight={isHov ? '600' : '400'}
                        fill={isHov ? color : '#94a3b8'} fillOpacity={isHov ? 1 : 0.7}
                        style={{ pointerEvents: 'none', userSelect: 'none', transition: 'all 0.15s' }}>
                        {surahNameTr(c.surah)}
                      </text>
                      {isHov && (
                        <text x={x} y={countY} textAnchor="middle"
                          fontSize={8} fill="#64748b" style={{ pointerEvents: 'none', userSelect: 'none' }}>
                          {c.count} {language === 'tr' ? 'ayet' : 'verses'}
                        </text>
                      )}
                    </>
                  );
                })()}
              </g>
            );
          })}
        </g>
      </svg>

      {/* Legend */}
      <div style={{ position: 'absolute', bottom: '20px', right: '20px', display: 'flex', gap: '14px', alignItems: 'center', pointerEvents: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: '#94a3b8' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: MEKKI_COLOR, flexShrink: 0 }} />
          {language === 'tr' ? 'Mekkî' : 'Meccan'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: '#94a3b8' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: MEDENI_COLOR, flexShrink: 0 }} />
          {language === 'tr' ? 'Medenî' : 'Medinan'}
        </div>
      </div>

      {/* Classical mode: cluster group panel on hover */}
      {viewMode === 'classical' && hovered && (() => {
        const group = SURAH_TO_GROUP[hovered];
        if (!group) return null;
        const hovPos = activePositions[hovered];
        if (!hovPos) return null;
        const screenX = transform.x + hovPos.x * transform.scale;
        const screenY = transform.y + hovPos.y * transform.scale;
        const PANEL_W = 210;
        const panelX = screenX + 40 + PANEL_W > W - 16 ? screenX - PANEL_W - 16 : screenX + 40;
        const panelY = Math.max(60, Math.min(screenY - 60, H - 320));
        return (
          <div style={{
            position: 'absolute', left: panelX, top: panelY, width: PANEL_W,
            background: 'rgba(10,10,26,0.93)', border: '1px solid rgba(212,165,116,0.22)',
            borderRadius: '10px', padding: '12px 14px',
            backdropFilter: 'blur(14px)', pointerEvents: 'none', zIndex: 10,
            boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
          }}>
            <div style={{ color: '#d4a574', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px', opacity: 0.85 }}>
              {language === 'tr' ? group.tr : group.en}
            </div>
            {group.surahs.map(s => {
              const cl = clusters.find(c => c.surah === s);
              const isActive = s === hovered;
              return (
                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ color: isActive ? '#d4a574' : '#64748b', fontSize: '0.68rem', fontWeight: 700, minWidth: '22px' }}>{s}.</span>
                  <span style={{ color: isActive ? '#e8e6e3' : '#94a3b8', fontSize: '0.75rem', flex: 1, fontWeight: isActive ? 600 : 400 }}>{surahNameTr(s)}</span>
                  {cl && <span style={{ color: '#4a5568', fontSize: '0.63rem' }}>{cl.count}</span>}
                </div>
              );
            })}
          </div>
        );
      })()}

      {/* Hint */}
      <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', color: '#64748b', fontSize: '0.7rem', textAlign: 'center', pointerEvents: 'none', maxWidth: '600px' }}>
        {viewMode === 'semantic'
          ? (language === 'tr'
            ? <>Anlamsal görünüm: Yerleşim, ayet-ayet bağlantı skorlarından hesaplanmış metinsel benzerliğe dayanır.<br />Geleneksel gruplamalardan farklılık gösterebilir.</>
            : <>Semantic view: Positions are based on textual similarity computed from verse-verse connection scores.<br />May differ from traditional groupings.</>)
          : (language === 'tr'
            ? <>Klasik görünüm: Sûreler, İslam ilmi geleneğindeki sınıflandırmaya göre gruplandırılmıştır.<br />Tıval · Kıssas-ı Enbiyâ · Hâmim · Mufassal vb.</>
            : <>Classical view: Surahs grouped by traditional Islamic scholarly classification.<br />Tiwāl · Prophet Narratives · Hā-Mīm · Mufassal etc.</>)}
      </div>
    </div>
  );
}

// ─── Zoom controls overlay ────────────────────────────────────────────────────
function ZoomControls({ graphRef, language }) {
  const zoomBy = useCallback((factor) => {
    if (!graphRef.current) return;
    const cam = graphRef.current.camera();
    const ctrl = graphRef.current.controls?.();
    if (!cam || !ctrl) return;
    const target = ctrl.target.clone();
    const dir = cam.position.clone().sub(target);
    const newPos = target.clone().add(dir.multiplyScalar(factor));
    graphRef.current.cameraPosition(
      { x: newPos.x, y: newPos.y, z: newPos.z },
      { x: target.x, y: target.y, z: target.z },
      300
    );
  }, [graphRef]);

  const btnStyle = {
    width: '36px', height: '36px', border: '1px solid rgba(212,165,116,0.2)',
    borderRadius: '8px', background: 'rgba(5,5,16,0.88)', color: '#94a3b8',
    fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center',
    justifyContent: 'center', transition: 'all 0.15s', userSelect: 'none',
  };

  return (
    <div style={{
      position: 'absolute', bottom: '24px', right: '24px', zIndex: 25,
      display: 'flex', flexDirection: 'column', gap: '6px',
    }}>
      <button style={btnStyle} title="Yakınlaştır"
        onMouseEnter={e => { e.currentTarget.style.color = '#d4a574'; e.currentTarget.style.borderColor = 'rgba(212,165,116,0.5)'; }}
        onMouseLeave={e => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.borderColor = 'rgba(212,165,116,0.2)'; }}
        onClick={() => zoomBy(0.65)}>+</button>
      <button style={btnStyle} title="Uzaklaştır"
        onMouseEnter={e => { e.currentTarget.style.color = '#d4a574'; e.currentTarget.style.borderColor = 'rgba(212,165,116,0.5)'; }}
        onMouseLeave={e => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.borderColor = 'rgba(212,165,116,0.2)'; }}
        onClick={() => zoomBy(1.54)}>−</button>
      <button style={{ ...btnStyle, fontSize: '0.7rem', color: '#64748b' }} title={language === 'tr' ? 'Tümünü göster' : 'Fit all'}
        onMouseEnter={e => { e.currentTarget.style.color = '#d4a574'; e.currentTarget.style.borderColor = 'rgba(212,165,116,0.5)'; }}
        onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.borderColor = 'rgba(212,165,116,0.2)'; }}
        onClick={() => graphRef.current?.zoomToFit(600, 60)}>⊡</button>
    </div>
  );
}

// ─── VerseView — top-down 2D-like graph for one surah ────────────────────────
// Helper: resolve link endpoint to id string (after force-sim, source/target become objects)
function linkEndId(endpoint) {
  return typeof endpoint === 'object' ? endpoint.id : endpoint;
}

function SurahInfoPanel({ surah, language, graphData, showName = false, onNavigate = null }) {
  const [info, setInfo] = useState(null);
  const [notes, setNotes] = useState(null);
  useEffect(() => {
    fetch('/surah-info.json').then(r => r.json()).then(d => setInfo(d[String(surah)] || null)).catch(() => {});
    fetch('/surah-notes.json').then(r => r.json()).then(d => setNotes(d[String(surah)] || null)).catch(() => {});
  }, [surah]);

  // Top 3 connections from graph data
  const topLinks = useMemo(() => {
    if (!graphData) return [];
    const counts = {};
    graphData.links.forEach(l => {
      const src = typeof l.source === 'object' ? l.source.id : l.source;
      const tgt = typeof l.target === 'object' ? l.target.id : l.target;
      const srcSurah = parseInt(src.split(':')[0]);
      const tgtSurah = parseInt(tgt.split(':')[0]);
      if (srcSurah !== surah && !isNaN(srcSurah)) counts[srcSurah] = (counts[srcSurah] || 0) + 1;
      if (tgtSurah !== surah && !isNaN(tgtSurah)) counts[tgtSurah] = (counts[tgtSurah] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([s, c]) => ({ surah: +s, count: c }));
  }, [graphData, surah]);

  const gold = '#d4a574', muted = '#94a3b8', dim = '#64748b';
  const label = (tr, en) => language === 'tr' ? tr : en;

  return (
    <div style={{
      position: 'absolute', left: 0, top: 0, bottom: 0, width: '260px', zIndex: 15,
      background: 'linear-gradient(to right, rgba(6,8,18,0.97) 80%, transparent)',
      padding: '72px 20px 24px 20px', overflowY: 'auto', pointerEvents: 'auto',
      display: 'flex', flexDirection: 'column', gap: '20px',
    }}>
      {/* Sure ismi + nav okları — sadece FullGraph'ta göster */}
      {showName && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {onNavigate && (
            <button
              onClick={() => onNavigate(-1)}
              disabled={surah <= 1}
              title={language === 'tr' ? 'Önceki sure' : 'Previous surah'}
              style={{
                flexShrink: 0, width: '28px', height: '28px', borderRadius: '50%',
                background: 'transparent',
                border: `1px solid ${surah <= 1 ? 'rgba(212,165,116,0.1)' : 'rgba(212,165,116,0.35)'}`,
                color: surah <= 1 ? 'rgba(212,165,116,0.2)' : gold,
                cursor: surah <= 1 ? 'default' : 'pointer',
                fontSize: '1rem', lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.2s, border-color 0.2s',
              }}
              onMouseEnter={e => { if (surah > 1) e.currentTarget.style.background = 'rgba(212,165,116,0.12)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >‹</button>
          )}
          <div style={{ fontFamily: "'Playfair Display', serif", color: gold, fontSize: '1.2rem', fontWeight: 700, lineHeight: 1.2, flex: 1, minWidth: 0, textAlign: 'center' }}>
            {surah}. {SURAH_NAMES_TR[surah - 1]}
          </div>
          {onNavigate && (
            <button
              onClick={() => onNavigate(1)}
              disabled={surah >= 114}
              title={language === 'tr' ? 'Sonraki sure' : 'Next surah'}
              style={{
                flexShrink: 0, width: '28px', height: '28px', borderRadius: '50%',
                background: 'transparent',
                border: `1px solid ${surah >= 114 ? 'rgba(212,165,116,0.1)' : 'rgba(212,165,116,0.35)'}`,
                color: surah >= 114 ? 'rgba(212,165,116,0.2)' : gold,
                cursor: surah >= 114 ? 'default' : 'pointer',
                fontSize: '1rem', lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.2s, border-color 0.2s',
              }}
              onMouseEnter={e => { if (surah < 114) e.currentTarget.style.background = 'rgba(212,165,116,0.12)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >›</button>
          )}
        </div>
      )}

      {/* Anlamı */}
      {info && (
        <div style={{ color: muted, fontSize: '0.78rem', marginTop: showName ? 0 : '4px' }}>
          <span style={{ color: '#64748b', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginRight: '6px' }}>
            {label('Anlamı', 'Meaning')}
          </span>
          <span style={{ fontStyle: 'italic' }}>{label(info.meaning.tr, info.meaning.en)}</span>
        </div>
      )}

      {/* Dönem + Sayfa */}
      {info && (() => {
        const pages = SURAH_PAGES[surah - 1];
        const [p1, p2] = pages || [null, null];
        const pageCount = p1 && p2 ? p2 - p1 + 1 : null;
        const pageLabel = p1 === null ? null
          : p1 === p2
            ? (language === 'tr' ? `${p1}. sayfa` : `Page ${p1}`)
            : (language === 'tr' ? `${p1}–${p2}. sayfalar` : `Pages ${p1}–${p2}`);
        const pageCountLabel = pageCount && pageCount > 1
          ? (language === 'tr' ? ` · ${pageCount} sayfa` : ` · ${pageCount} pages`)
          : '';
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {(() => {
                const isMedeni = info.period.tr === 'Medenî' || info.period.en === 'Medinan';
                const bg = isMedeni ? 'rgba(26,122,76,0.15)' : 'rgba(212,165,116,0.12)';
                const border = isMedeni ? '1px solid rgba(26,122,76,0.45)' : '1px solid rgba(212,165,116,0.25)';
                const color = isMedeni ? '#2ecc71' : gold;
                return (
                  <span style={{ background: bg, border, borderRadius: '20px', color, fontSize: '0.7rem', padding: '3px 10px', fontWeight: 600 }}>
                    {label(info.period.tr, info.period.en)}
                  </span>
                );
              })()}
              <span style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', color: muted, fontSize: '0.7rem', padding: '3px 10px' }}>
                {language === 'tr' ? `M.S. ${info.period.approx}` : `${info.period.approx} CE`}
              </span>
            </div>
            {pageLabel && (
              <div style={{ color: '#64748b', fontSize: '0.7rem' }}>
                <span style={{ marginRight: '4px' }}>📖</span>
                {pageLabel}{pageCountLabel}
              </div>
            )}
            {/* Ayet sayısı ve bağlantılar — stat grid */}
            {(() => {
              const primaryCount = graphData.nodes.filter(n => !n.ghost).length;
              const ghostCount = graphData.nodes.filter(n => n.ghost).length;
              const linkCount = graphData.links.length;
              const statStyle = {
                flex: 1, background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)', borderRadius: '8px',
                padding: '6px 4px', textAlign: 'center',
              };
              return (
                <div style={{ display: 'flex', gap: '5px' }}>
                  <div style={statStyle}>
                    <div style={{ color: gold, fontSize: '0.85rem', fontWeight: 700, lineHeight: 1 }}>{primaryCount}</div>
                    <div style={{ color: dim, fontSize: '0.6rem', marginTop: '3px' }}>{language === 'tr' ? 'ayet' : 'verses'}</div>
                  </div>
                  {ghostCount > 0 && (
                    <div style={statStyle}>
                      <div style={{ color: muted, fontSize: '0.85rem', fontWeight: 700, lineHeight: 1 }}>{ghostCount}</div>
                      <div style={{ color: dim, fontSize: '0.6rem', marginTop: '3px' }}>{language === 'tr' ? 'dış ayet' : 'ext. verses'}</div>
                    </div>
                  )}
                  <div style={statStyle}>
                    <div style={{ color: gold, fontSize: '0.85rem', fontWeight: 700, lineHeight: 1 }}>{linkCount}</div>
                    <div style={{ color: dim, fontSize: '0.6rem', marginTop: '3px' }}>{language === 'tr' ? 'bağlantı' : 'connections'}</div>
                  </div>
                </div>
              );
            })()}
          </div>
        );
      })()}

      {/* Ana Temalar */}
      {info && (
        <div>
          <div style={{ color: gold, fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px', opacity: 0.7 }}>
            {label('Ana Temalar', 'Main Themes')}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {(language === 'tr' ? info.themes.tr : info.themes.en).map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '7px', color: muted, fontSize: '0.75rem', lineHeight: 1.4 }}>
                <span style={{ color: gold, opacity: 0.5, flexShrink: 0, marginTop: '1px' }}>◆</span>
                {t}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Güçlü Bağlantılar */}
      {topLinks.length > 0 && (
        <div>
          <div style={{ color: gold, fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px', opacity: 0.7 }}>
            {label('Güçlü Bağlantılar', 'Strong Connections')}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {topLinks.map(({ surah: s, count }) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', borderRadius: '4px', height: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: gold, opacity: 0.6, width: `${Math.min(100, (count / (topLinks[0]?.count || 1)) * 100)}%` }} />
                </div>
                <span style={{ color: muted, fontSize: '0.7rem', whiteSpace: 'nowrap' }}>{s}. {surahNameTr(s)}</span>
                <span style={{ color: dim, fontSize: '0.65rem' }}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Öne Çıkan Özellikler — notes + fadail birleşik */}
      {(notes || info?.fadail) && (() => {
        const noteItems = notes ? (language === 'tr' ? notes.tr : notes.en) : [];
        const fadailText = info?.fadail ? label(info.fadail.tr, info.fadail.en) : null;
        return (
          <div>
            <div style={{ color: gold, fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px', opacity: 0.7 }}>
              {label('Öne Çıkan Özellikler', 'Notable Facts')}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {fadailText && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '7px', color: muted, fontSize: '0.73rem', lineHeight: 1.5, borderLeft: '2px solid rgba(212,165,116,0.2)', paddingLeft: '8px', fontStyle: 'italic', marginBottom: '2px' }}>
                  {fadailText}
                </div>
              )}
              {noteItems.map((note, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '7px', color: muted, fontSize: '0.73rem', lineHeight: 1.5 }}>
                  <span style={{ color: gold, opacity: 0.45, flexShrink: 0, marginTop: '2px', fontSize: '0.6rem' }}>★</span>
                  {note}
                </div>
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  );
}

function VerseView({ verses, surah, onBack, onOpenFull3D, language, autoFocusVerseId, onSurahChange }) {
  const graphRef = useRef(null);
  const initialFitDone = useRef(false);
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [focusedNodeId, setFocusedNodeId] = useState(null);
  const [dim, setDim] = useState({ w: window.innerWidth, h: window.innerHeight });
  const [showHint, setShowHint] = useState(true);
  useEffect(() => { const t = setTimeout(() => setShowHint(false), 3000); return () => clearTimeout(t); }, []);

  const graphData = useMemo(() => buildGraphData(verses, surah, 'surah'), [verses, surah]);

  // Focus set: selected node + its direct neighbors
  const focusedSet = useMemo(() => {
    if (!focusedNodeId) return null;
    const set = new Set([focusedNodeId]);
    graphData.links.forEach(link => {
      const src = linkEndId(link.source);
      const tgt = linkEndId(link.target);
      if (src === focusedNodeId) set.add(tgt);
      if (tgt === focusedNodeId) set.add(src);
    });
    return set;
  }, [focusedNodeId, graphData.links]);

  useEffect(() => {
    const h = () => setDim({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  // Lighting + controls after graph mounts
  useEffect(() => {
    if (!graphRef.current) return;

    const scene = graphRef.current.scene?.();
    if (scene) {
      const existing = scene.children.find(c => c.isAmbientLight);
      if (!existing) {
        scene.add(new THREE.AmbientLight(0xffffff, 0.7));
        const dir = new THREE.DirectionalLight(0xffd4a0, 1.0);
        dir.position.set(0, 200, 0);
        scene.add(dir);
      }
    }

    const controls = graphRef.current.controls?.();
    if (controls) {
      controls.enableDamping = true;
      controls.dampingFactor = 0.12;
      controls.rotateSpeed = 0.25;
      controls.zoomSpeed = 0.2;
      controls.panSpeed = 0.6;
      controls.minDistance = 10;
      controls.maxDistance = 1200;
    }

    // Fit camera only on first load of this surah, then auto-focus verse if requested
    if (!initialFitDone.current) {
      initialFitDone.current = true;
      setTimeout(() => {
        if (autoFocusVerseId) {
          const node = graphData.nodes.find(n => n.id === autoFocusVerseId);
          if (node && graphRef.current) {
            setSelected(node);
            setFocusedNodeId(node.id);
            // zoomToFit fires via focusedSet useEffect below
            return;
          }
        }
        graphRef.current?.zoomToFit(800, 60);
      }, 300);
    }
  }, [graphData, autoFocusVerseId]);

  // Odak değişince kamerayı sadece odak nodelarına sığdır
  useEffect(() => {
    if (!graphRef.current || !focusedSet) return;
    const timer = setTimeout(() => {
      graphRef.current.zoomToFit(800, 100, node => focusedSet.has(node.id));
    }, 80);
    return () => clearTimeout(timer);
  }, [focusedSet]);

  const nodeThreeObject = useCallback((node) => {
    const isDimmed = focusedSet !== null && !focusedSet.has(node.id);
    return makeNodeObject(node, node === selected, node === hovered, isDimmed);
  }, [selected, hovered, focusedSet]);

  const handleNodeClick = useCallback((node) => {
    setSelected(prev => prev === node ? null : node);
    setFocusedNodeId(prev => prev === node.id ? null : node.id);
  }, []);

  const focusVerse = useCallback((verseId) => {
    const node = graphData.nodes.find(n => n.id === verseId);
    if (!node || !graphRef.current) return;
    setSelected(node);
    setFocusedNodeId(node.id);
    graphRef.current.cameraPosition(
      { x: node.x + 40, y: node.y + 80, z: node.z + 40 },
      { x: node.x, y: node.y, z: node.z }, 800
    );
  }, [graphData.nodes]);

  const linkColor = useCallback((link) => {
    if (focusedSet !== null) {
      const src = linkEndId(link.source);
      const tgt = linkEndId(link.target);
      if (!focusedSet.has(src) && !focusedSet.has(tgt)) return 'rgba(212,165,116,0.025)';
      return 'rgba(240,200,96,0.85)';
    }
    const a = 0.10 + (link.score - 0.55) * 0.45;
    return `rgba(212,165,116,${Math.min(0.55, a).toFixed(2)})`;
  }, [focusedSet]);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#080a1e' }}>
      {/* Sure info panel — left side */}
      <SurahInfoPanel
        surah={surah} language={language} graphData={graphData} showName={true}
        onNavigate={onSurahChange ? (dir) => onSurahChange(Math.max(1, Math.min(114, surah + dir))) : null}
      />

      {/* Header */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20,
        display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 18px',
        background: 'linear-gradient(to bottom, rgba(6,8,14,0.98) 60%, transparent)',
      }}>
        <button onClick={onBack}
          style={{ background: 'rgba(212,165,116,0.06)', border: '1px solid rgba(212,165,116,0.15)', borderRadius: '8px', color: '#94a3b8', padding: '6px 12px', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
          ← {language === 'tr' ? 'Sûre Haritası' : 'Surahs'}
        </button>

        <div style={{ flex: 1 }} />

        <button onClick={onOpenFull3D}
          style={{ background: 'rgba(212,165,116,0.08)', border: '1px solid rgba(212,165,116,0.2)', borderRadius: '8px', color: '#d4a574', padding: '6px 12px', fontSize: '0.78rem', cursor: 'pointer' }}>
          {language === 'tr' ? '🌐 Tam Harita' : '🌐 Full Map'}
        </button>
      </div>

      {/* Auto-dismissing hint badge */}
      <div style={{
        position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
        zIndex: 20, background: 'rgba(10,10,26,0.85)', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '20px', padding: '6px 16px', color: '#64748b', fontSize: '0.7rem',
        whiteSpace: 'nowrap', pointerEvents: 'none', backdropFilter: 'blur(8px)',
        opacity: showHint ? 1 : 0, transition: 'opacity 0.8s ease',
      }}>
        {language === 'tr' ? 'Sürükle: döndür  ·  Sağ tık: kaydır  ·  Tekerlek: yakınlaştır' : 'Drag: rotate  ·  Right-drag: pan  ·  Scroll: zoom'}
      </div>

      {/* Focus mode badge */}
      {focusedNodeId && (
        <div style={{
          position: 'absolute', top: '56px', left: '50%', transform: 'translateX(-50%)',
          zIndex: 20, background: 'rgba(6,8,14,0.90)', border: '1px solid rgba(212,165,116,0.25)',
          borderRadius: '24px', padding: '6px 16px', display: 'flex', alignItems: 'center', gap: '12px',
          backdropFilter: 'blur(12px)', boxShadow: '0 4px 24px rgba(0,0,0,0.5), 0 0 0 1px rgba(212,165,116,0.08)',
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '7px', color: '#d4a574', fontSize: '0.74rem' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#d4a574', boxShadow: '0 0 6px #d4a574', flexShrink: 0 }} />
            <b style={{ color: '#e8c98a', letterSpacing: '0.02em' }}>{focusedNodeId}</b>
          </span>
          <button onClick={() => { setFocusedNodeId(null); setSelected(null); }}
            style={{ background: 'none', border: 'none', color: '#5a5040', cursor: 'pointer', fontSize: '0.72rem', padding: '0', lineHeight: 1 }}>
            ✕
          </button>
        </div>
      )}

      <ForceGraph3D
        ref={graphRef}
        graphData={graphData}
        width={dim.w} height={dim.h}
        backgroundColor="#080a1e"
        d3AlphaDecay={1} d3VelocityDecay={1}
        nodeThreeObject={nodeThreeObject}
        nodeThreeObjectExtend={false}
        nodeLabel={node => `<div style="background:rgba(10,8,4,0.97);border:1px solid rgba(212,165,116,0.3);padding:6px 10px;border-radius:6px;font-size:12px;color:#d4a574;max-width:220px"><b>${node.id}</b><br/><span style="color:#94a3b8;font-size:11px">${(language === 'tr' ? (cleanTr(node.turkish) || node.english) : (node.english || cleanTr(node.turkish)))?.slice(0, 80)}...</span></div>`}
        linkColor={linkColor}
        linkOpacity={1}
        linkWidth={link => 0.25 + (link.score - 0.55) * 2.0}
        linkDirectionalParticles={link => link.score > 0.80 ? 2 : 0}
        linkDirectionalParticleWidth={1.2}
        linkDirectionalParticleColor={() => '#d4a574'}
        linkDirectionalParticleSpeed={0.005}
        onNodeClick={handleNodeClick}
        onNodeHover={node => setHovered(node || null)}
        onBackgroundClick={() => { setFocusedNodeId(null); setSelected(null); }}
        enableNodeDrag={false}
        showNavInfo={false}
      />

      <ZoomControls graphRef={graphRef} language={language} />

      {selected && (
        <VersePanel node={selected} verses={verses} language={language}
          onClose={() => { setSelected(null); setFocusedNodeId(null); }} onNavigate={focusVerse} />
      )}
    </div>
  );
}

// ─── Full 3D view (all verses) ────────────────────────────────────────────────
function FullGraph({ verses, onBack, language }) {
  const graphRef = useRef(null);
  const initialFitDone = useRef(false);
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [focusedNodeId, setFocusedNodeId] = useState(null);
  const [filterSurah, setFilterSurah] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dim, setDim] = useState({ w: window.innerWidth, h: window.innerHeight });

  const graphData = useMemo(() => {
    initialFitDone.current = false;
    return buildGraphData(verses, filterSurah, filterSurah ? 'surah' : 'all');
  }, [verses, filterSurah]);

  // Focus set: selected node + its direct neighbors
  const focusedSet = useMemo(() => {
    if (!focusedNodeId) return null;
    const set = new Set([focusedNodeId]);
    graphData.links.forEach(link => {
      const src = linkEndId(link.source);
      const tgt = linkEndId(link.target);
      if (src === focusedNodeId) set.add(tgt);
      if (tgt === focusedNodeId) set.add(src);
    });
    return set;
  }, [focusedNodeId, graphData.links]);

  useEffect(() => {
    const h = () => setDim({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  useEffect(() => {
    if (!graphRef.current) return;
    const scene = graphRef.current.scene?.();
    if (scene) {
      scene.add(new THREE.AmbientLight(0xffffff, 0.6));
      const dir = new THREE.DirectionalLight(0xffd4a0, 1.2);
      dir.position.set(100, 200, 100);
      scene.add(dir);
    }
    const controls = graphRef.current.controls?.();
    if (controls) {
      controls.enableDamping = true;
      controls.dampingFactor = 0.10;
      controls.rotateSpeed = 0.25;
      controls.zoomSpeed = 0.2;
      controls.panSpeed = 0.5;
      controls.minDistance = 20;
      controls.maxDistance = 2000;
    }
  }, [verses]);

  // filterSurah değişince selected/focused'ı temizle ve kamerayı node verilerinden hesapla
  useEffect(() => {
    setSelected(null);
    setFocusedNodeId(null);
    if (!graphRef.current || !graphData.nodes.length) return;

    // Use zoomToFit with node filter (primary only) after nodes are definitely rendered
    // padding=30 → tighter zoom so embedding clusters are more visible
    setTimeout(() => {
      graphRef.current?.zoomToFit(900, 30, node => !node.ghost);
    }, 1200);
  }, [filterSurah, graphData]);

  const searchResults = useMemo(() => {
    if (!verses || searchQuery.length < 2) return { direct: null, surahs: [], verses: [] };
    const q = normalizeTr(searchQuery);
    const qClean = normalizeForSearch(searchQuery);

    const direct = parseDirectVerseQuery(searchQuery, verses);

    const surahs = direct ? [] : SURAH_NAMES_TR
      .map((name, i) => ({ surah: i + 1, name }))
      .filter(s => normalizeForSearch(s.name).includes(qClean));

    const arabicMatch = findArabicMatch(searchQuery);
    const latinArWords = latinToArabicWords(searchQuery);
    const strippedQuery = stripHarakat(searchQuery);
    const isArabicInput = /[\u0600-\u06FF]/.test(searchQuery);
    const hasArabicRef = !!arabicMatch || !!latinArWords;
    const verseList = direct ? [] : verses.filter(v => {
      const strippedArabic = stripHarakat(v.arabic);
      return v.arabic.includes(searchQuery) || strippedArabic.includes(stripHarakat(searchQuery)) ||
      (isArabicInput && strippedQuery.length > 1 && (
        strippedArabic.includes(strippedQuery) ||
        arabicWordMatch(strippedQuery, strippedArabic)
      )) ||
      (latinArWords && latinArWords.length > 0 && latinArWords.every(w => strippedArabic.includes(stripHarakat(w)))) ||
      (arabicMatch && strippedArabic.includes(stripHarakat(arabicMatch))) ||
      normalizeTr(v.turkish).includes(q) ||
      normalizeTr(v.english).includes(q) ||
      v.id.includes(searchQuery);
    }).slice(0, surahs.length > 0 ? 4 : 8);

    return { direct, surahs, verses: verseList };
  }, [verses, searchQuery]);

  const nodeThreeObject = useCallback((node) => {
    const isDimmed = focusedSet !== null && !focusedSet.has(node.id);
    return makeNodeObject(node, node === selected, node === hovered, isDimmed);
  }, [selected, hovered, focusedSet]);

  const handleNodeClick = useCallback((node) => {
    setSelected(prev => prev === node ? null : node);
    setFocusedNodeId(prev => prev === node.id ? null : node.id);
    if (graphRef.current) {
      const d = 60 + Math.sqrt(node.degree || 1) * 8;
      graphRef.current.cameraPosition(
        { x: node.x + d, y: node.y + d * 0.5, z: node.z + d },
        { x: node.x, y: node.y, z: node.z }, 1000
      );
    }
  }, []);

  const focusVerse = useCallback((verseId) => {
    const node = graphData.nodes.find(n => n.id === verseId);
    if (!node) return;
    setSelected(node);
    setFocusedNodeId(node.id);
    setSearchQuery('');
    if (graphRef.current) {
      graphRef.current.cameraPosition(
        { x: node.x + 60, y: node.y + 30, z: node.z + 60 },
        { x: node.x, y: node.y, z: node.z }, 1000
      );
    }
  }, [graphData.nodes]);

  const linkColor = useCallback((link) => {
    if (focusedSet !== null) {
      const src = linkEndId(link.source);
      const tgt = linkEndId(link.target);
      if (!focusedSet.has(src) && !focusedSet.has(tgt)) return 'rgba(0,0,0,0)';
      return 'rgba(240,200,96,0.50)';
    }
    // Ghost links (cross-surah when surah filter active): very dim so primary cluster stands out
    if (link.source?.ghost || link.target?.ghost) return 'rgba(212,165,116,0.05)';
    const a = 0.06 + (link.score - 0.55) * 0.30;
    return `rgba(212,165,116,${Math.min(0.45, a).toFixed(2)})`;
  }, [focusedSet]);

  const linkWidth = useCallback((link) => {
    if (focusedSet !== null) {
      const src = linkEndId(link.source);
      const tgt = linkEndId(link.target);
      if (!focusedSet.has(src) && !focusedSet.has(tgt)) return 0;
      return 0.2;
    }
    if (link.source?.ghost || link.target?.ghost) return 0.05;
    return 0.12 + (link.score - 0.55) * 0.9;
  }, [focusedSet]);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#080a1e' }}>
      {/* Sure bilgi paneli — sadece sure filtresi aktifken */}
      {filterSurah && (
        <SurahInfoPanel
          surah={filterSurah} language={language} graphData={graphData} showName={true}
          onNavigate={(dir) => setFilterSurah(s => Math.max(1, Math.min(114, s + dir)))}
        />
      )}

      {/* Header */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20,
        display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 18px',
        background: 'linear-gradient(to bottom, rgba(6,8,14,0.98) 60%, transparent)',
      }}>
        <button onClick={onBack}
          style={{ background: 'rgba(212,165,116,0.06)', border: '1px solid rgba(212,165,116,0.15)', borderRadius: '8px', color: '#94a3b8', padding: '6px 12px', fontSize: '0.8rem', cursor: 'pointer' }}>
          ← {language === 'tr' ? 'Sûre Haritası' : 'Surahs'}
        </button>

        <span style={{ fontFamily: 'Playfair Display, serif', color: '#d4a574', fontSize: '1.05rem', fontWeight: 700 }}>
          {language === 'tr' ? 'Tam Ayet Haritası' : 'Full Verse Map'}
        </span>
        {verses && !filterSurah && (
          <span style={{ color: '#94a3b8', fontSize: '0.72rem' }}>
            {`${graphData.nodes.length} ${language === 'tr' ? 'ayet' : 'verses'} · ${graphData.links.length} ${language === 'tr' ? 'bağlantı' : 'connections'}`}
          </span>
        )}

        <div style={{ flex: 1 }} />

        {/* Search + controls row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>

        {/* Search input with hint below */}
        <div style={{ position: 'relative' }}>
          <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            placeholder={language === 'tr' ? 'Sûre, ayet veya kelime ara...' : 'Search surah, verse or keyword...'}
            dir="auto"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,165,116,0.2)', borderRadius: '8px', color: '#e8e6e3', padding: '6px 12px 6px 30px', fontSize: '0.82rem', width: '260px', outline: 'none', height: '32px', boxSizing: 'border-box' }}
          />
          <svg style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#d4a574" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          {/* Hint text below search bar */}
          {!searchQuery && !selected && (
            <div style={{ position: 'absolute', top: '100%', left: '1px', marginTop: '5px', fontSize: '0.65rem', color: '#6b5a40', whiteSpace: 'nowrap', pointerEvents: 'none' }}>
              {language === 'tr' ? 'örn: Bismillah · Bakara 5 · 2:286 · Fatiha · iman' : 'e.g. Bismillah · Bakara 5 · 2:286 · Fatiha · faith'}
            </div>
          )}
          {(searchResults.direct || searchResults.surahs.length > 0 || searchResults.verses.length > 0) && (
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '4px', background: '#0d1128', border: '1px solid rgba(212,165,116,0.15)', borderRadius: '8px', overflow: 'hidden', zIndex: 30, boxShadow: '0 8px 32px rgba(0,0,0,0.5)', minWidth: '280px' }}>
              {/* Direct verse match */}
              {searchResults.direct && (() => {
                const v = searchResults.direct;
                const vt = language === 'tr' ? (cleanTr(v.turkish) || v.english) : (v.english || cleanTr(v.turkish));
                return (
                  <button key={`direct-${v.id}`} onClick={() => { focusVerse(v.id); setSearchQuery(''); }}
                    style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%', textAlign: 'left', padding: '10px 12px', background: 'rgba(212,165,116,0.1)', border: 'none', borderBottom: '1px solid rgba(212,165,116,0.15)', cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,165,116,0.17)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(212,165,116,0.1)'}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#d4a574', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.05em' }}>→ AYET</span>
                      <span style={{ color: '#d4a574', fontWeight: 700, fontSize: '0.82rem' }}>{v.id}</span>
                      <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{surahNameTr(v.surah)}</span>
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '0.73rem', lineHeight: 1.4 }}>{vt?.slice(0, 80)}...</div>
                  </button>
                );
              })()}
              {/* Surah name matches */}
              {searchResults.surahs.map(s => (
                <button key={`surah-${s.surah}`}
                  onClick={() => { setFilterSurah(s.surah); setSearchQuery(''); }}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', textAlign: 'left', padding: '8px 12px', background: 'rgba(212,165,116,0.06)', border: 'none', borderBottom: '1px solid rgba(212,165,116,0.1)', color: '#e8e6e3', cursor: 'pointer', fontSize: '0.76rem' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,165,116,0.12)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(212,165,116,0.06)'}>
                  <span style={{ color: '#d4a574', fontSize: '0.7rem' }}>◈ Sure</span>
                  <span style={{ color: '#d4a574', fontWeight: 700 }}>{s.surah}. {s.name}</span>
                </button>
              ))}
              {/* Verse content matches */}
              {searchResults.verses.map(v => (
                <button key={v.id} onClick={() => { focusVerse(v.id); setSearchQuery(''); }}
                  style={{ display: 'block', width: '100%', textAlign: 'left', padding: '7px 12px', background: 'none', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#e8e6e3', cursor: 'pointer', fontSize: '0.76rem' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,165,116,0.08)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                  <span style={{ color: '#d4a574', marginRight: '6px', fontWeight: 600 }}>{v.id}</span>
                  <span style={{ color: '#94a3b8' }}>{(language === 'tr' ? (cleanTr(v.turkish) || v.english) : (v.english || cleanTr(v.turkish)))?.slice(0, 50)}...</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Surah filter */}
        <SurahDropdown value={filterSurah} onChange={setFilterSurah} language={language} allowAll={true} />

        <button onClick={() => { setSearchQuery(''); setFilterSurah(null); setSelected(null); setFocusedNodeId(null); graphRef.current?.zoomToFit(800); }}
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#64748b', padding: '0 14px', fontSize: '0.78rem', cursor: 'pointer', height: '32px', boxSizing: 'border-box' }}>
          {language === 'tr' ? 'Temizle' : 'Clear'}
        </button>
        </div>
      </div>

      {/* Small surah: show verse list instead of graph */}
      {filterSurah && graphData.nodes.filter(n => !n.ghost).length < 30 && !selected && (
        <div style={{
          position: 'absolute', top: '54px', left: 0, bottom: 0,
          width: dim.w - 560, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: '8px',
          padding: '24px', overflowY: 'auto',
        }}>
          <div style={{ color: '#d4a574', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '8px', opacity: 0.7 }}>
            {surahNameTr(filterSurah)} — {graphData.nodes.filter(n => !n.ghost).length} {language === 'tr' ? 'ayet' : 'verses'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', maxWidth: '480px' }}>
            {graphData.nodes.filter(n => !n.ghost).map(node => (
              <button key={node.id} onClick={() => handleNodeClick(node)}
                style={{ background: 'rgba(212,165,116,0.04)', border: '1px solid rgba(212,165,116,0.12)', borderRadius: '10px', padding: '12px 16px', textAlign: 'right', cursor: 'pointer', transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,165,116,0.1)'; e.currentTarget.style.borderColor = 'rgba(212,165,116,0.3)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(212,165,116,0.04)'; e.currentTarget.style.borderColor = 'rgba(212,165,116,0.12)'; }}>
                <div style={{ fontFamily: "'Amiri', serif", fontSize: '1.4rem', lineHeight: 2, color: '#d4b483', direction: 'rtl' }}>{node.arabic}</div>
                <div style={{ color: '#7a6a50', fontSize: '0.72rem', marginTop: '4px', textAlign: 'left' }}>{node.id}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      <ForceGraph3D
        ref={graphRef}
        graphData={graphData}
        width={selected ? dim.w - 560 : dim.w} height={dim.h}
        backgroundColor="#080a1e"
        d3AlphaDecay={1} d3VelocityDecay={1}
        warmupTicks={0} cooldownTicks={10}
        nodeThreeObject={nodeThreeObject}
        nodeThreeObjectExtend={false}
        nodeLabel={node => `<div style="background:rgba(10,8,4,0.97);border:1px solid rgba(212,165,116,0.3);padding:6px 10px;border-radius:6px;font-size:12px;color:#d4a574;max-width:220px"><b>${node.id}</b> — ${surahNameTr(node.surah)}<br/><span style="color:#94a3b8;font-size:11px">${(language === 'tr' ? (cleanTr(node.turkish) || node.english) : (node.english || cleanTr(node.turkish)))?.slice(0, 80)}...</span></div>`}
        linkColor={linkColor}
        linkOpacity={1}
        linkWidth={linkWidth}
        linkDirectionalParticles={link => (!focusedSet && link.score > 0.80) ? 2 : 0}
        linkDirectionalParticleWidth={1.2}
        linkDirectionalParticleColor={() => '#d4a574'}
        linkDirectionalParticleSpeed={0.004}
        onNodeClick={handleNodeClick}
        onNodeHover={node => setHovered(node || null)}
        onBackgroundClick={() => { setFocusedNodeId(null); setSelected(null); }}
        enableNodeDrag={false}
        showNavInfo={false}
        onEngineStop={() => {
          if (!initialFitDone.current && !filterSurah) {
            initialFitDone.current = true;
            setTimeout(() => graphRef.current?.zoomToFit(700, 60), 150);
          }
        }}
      />

      <ZoomControls graphRef={graphRef} language={language} />

      {/* Focus mode badge */}
      {focusedNodeId && (
        <div style={{
          position: 'absolute', bottom: '72px', left: '50%', transform: 'translateX(-50%)',
          zIndex: 20, background: 'rgba(6,8,14,0.90)', border: '1px solid rgba(212,165,116,0.25)',
          borderRadius: '24px', padding: '6px 16px', display: 'flex', alignItems: 'center', gap: '12px',
          backdropFilter: 'blur(12px)', boxShadow: '0 4px 24px rgba(0,0,0,0.5), 0 0 0 1px rgba(212,165,116,0.08)',
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '7px', color: '#d4a574', fontSize: '0.74rem' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#d4a574', boxShadow: '0 0 6px #d4a574', flexShrink: 0 }} />
            <b style={{ color: '#e8c98a', letterSpacing: '0.02em' }}>{focusedNodeId}</b>
            {focusedSet && <span style={{ color: '#5a5040' }}>·&nbsp;{focusedSet.size - 1} {language === 'tr' ? 'bağlantı' : 'connections'}</span>}
          </span>
          <button onClick={() => { setFocusedNodeId(null); setSelected(null); }}
            style={{ background: 'none', border: 'none', color: '#5a5040', cursor: 'pointer', fontSize: '0.72rem', padding: '0', lineHeight: 1 }}>
            ✕
          </button>
        </div>
      )}

{selected && (
        <VersePanel node={selected} verses={verses} language={language}
          onClose={() => { setSelected(null); setFocusedNodeId(null); }} onNavigate={focusVerse} />
      )}
    </div>
  );
}

// ─── Root: view state machine ─────────────────────────────────────────────────
export default function VerseGraph({ onClose }) {
  const { language } = useLanguage();
  const [view, setView] = useState('clusters'); // 'clusters' | 'verses' | '3d'
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [autoFocusVerseId, setAutoFocusVerseId] = useState(null);
  const [verses, setVerses] = useState(null);
  const [surahClusters, setSurahClusters] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch('/verse-graph.json').then(r => { if (!r.ok) throw new Error('verse-graph.json not found.'); return r.json(); }),
      fetch('/surah-clusters.json').then(r => r.ok ? r.json() : null).catch(() => null),
    ])
      .then(([verseData, clusterData]) => {
        setVerses(verseData);
        setSurahClusters(clusterData);
        setLoading(false);
      })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  useEffect(() => {
    const h = (e) => {
      if (e.key !== 'Escape') return;
      if (view === 'clusters') onClose();
      else setView('clusters');
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose, view]);

  if (loading) return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#080a1e', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
      <div style={{ width: '44px', height: '44px', border: '2px solid rgba(212,165,116,0.15)', borderTopColor: '#d4a574', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{language === 'tr' ? 'Harita yükleniyor...' : 'Loading map...'}</span>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (error) return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#080a1e', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '12px', padding: '40px' }}>
      <span style={{ color: '#e74c3c', fontSize: '1rem', fontWeight: 600 }}>Veri Bulunamadı</span>
      <span style={{ color: '#64748b', fontSize: '0.82rem', textAlign: 'center', maxWidth: '480px' }}>{error}</span>
    </div>
  );

  if (view === 'clusters') return (
    <ClusterView
      verses={verses} surahClusters={surahClusters} language={language}
      onSelectSurah={(surah) => { setSelectedSurah(surah); setAutoFocusVerseId(null); setView('verses'); }}
      onSelectVerse={(verse) => { setSelectedSurah(verse.surah); setAutoFocusVerseId(verse.id); setView('verses'); }}
      onClose={onClose}
    />
  );

  if (view === 'verses') return (
    <VerseView
      verses={verses} surah={selectedSurah} language={language}
      autoFocusVerseId={autoFocusVerseId}
      onBack={() => { setAutoFocusVerseId(null); setView('clusters'); }}
      onOpenFull3D={() => setView('3d')}
      onSurahChange={(n) => setSelectedSurah(n)}
    />
  );

  return (
    <FullGraph
      verses={verses} language={language}
      onBack={() => setView('clusters')}
    />
  );
}

// ─── Verse detail panel ───────────────────────────────────────────────────────
function VersePanel({ node, verses, language, onClose, onNavigate }) {
  const [expandedId, setExpandedId] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const PREVIEW_COUNT = 5;

  const connections = useMemo(() => {
    if (!verses || !node.connections) return [];
    return node.connections
      .map(c => ({ ...c, verse: verses.find(v => v.id === c.id) }))
      .filter(c => c.verse)
      .sort((a, b) => b.score - a.score);
  }, [node, verses]);

  const visibleConnections = showAll ? connections : connections.slice(0, PREVIEW_COUNT);

  const vt = (v) => language === 'tr' ? (cleanTr(v.turkish) || v.english) : (v.english || cleanTr(v.turkish));

  return (
    <div style={{
      position: 'absolute', top: '54px', right: '0', bottom: '0',
      width: '560px', zIndex: 20,
      background: 'rgba(8,10,18,0.97)', backdropFilter: 'blur(28px)',
      borderLeft: '1px solid rgba(212,165,116,0.18)', borderTop: '1px solid rgba(212,165,116,0.12)',
      borderRadius: '14px 0 0 0',
      overflowY: 'auto', padding: '18px 20px',
      display: 'flex', flexDirection: 'column', gap: '14px',
      boxShadow: '-8px 0 40px rgba(0,0,0,0.6), inset 1px 0 0 rgba(212,165,116,0.06)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ color: '#d4a574', fontWeight: 700, fontSize: '1rem' }}>{surahNameTr(node.surah)}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
            <span style={{ color: '#64748b', fontSize: '0.75rem' }}>{node.id}</span>
            <span style={{ color: '#94a3b8', fontSize: '0.68rem' }}>{node.surahName}</span>
            {connections.length > 0 && <span style={{ background: 'rgba(212,165,116,0.1)', border: '1px solid rgba(212,165,116,0.25)', borderRadius: '10px', color: '#d4a574', fontSize: '0.65rem', padding: '1px 7px' }}>{connections.length} {language === 'tr' ? 'benzer ayet' : 'similar verses'}</span>}
          </div>
        </div>
        <button onClick={onClose}
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', color: '#64748b', cursor: 'pointer', fontSize: '0.8rem', padding: '3px 8px' }}>✕</button>
      </div>

      <div style={{ fontFamily: "'Amiri', serif", fontSize: '2.1rem', lineHeight: 2.4, color: '#d4b483', textAlign: 'right', direction: 'rtl', padding: '18px 20px', background: 'linear-gradient(135deg, rgba(212,165,116,0.08), rgba(180,130,70,0.03))', borderRadius: '10px', border: '1px solid rgba(212,165,116,0.15)' }}>
        {node.arabic}
      </div>

      <div style={{ color: '#c8c5c0', fontSize: '0.92rem', lineHeight: 1.85, borderLeft: '2px solid rgba(212,165,116,0.3)', paddingLeft: '14px' }}>
        {vt(node)}
      </div>

      <div style={{ height: '1px', background: 'linear-gradient(to right, rgba(212,165,116,0.15), transparent)' }} />

      {connections.length > 0 && (
        <div>
          <div style={{ color: '#d4a574', fontSize: '0.7rem', fontWeight: 700, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.8 }}>
            {language === 'tr' ? `En Benzer ${connections.length} Ayet` : `Top ${connections.length} Similar Verses`}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {visibleConnections.map(c => (
              <button key={c.id}
                onClick={() => onNavigate(c.id)}
                onMouseEnter={() => setExpandedId(c.id)}
                onMouseLeave={() => setExpandedId(null)}
                style={{
                  background: expandedId === c.id ? 'rgba(212,165,116,0.09)' : 'rgba(255,240,200,0.025)',
                  border: `1px solid ${expandedId === c.id ? 'rgba(212,165,116,0.3)' : 'rgba(212,165,116,0.08)'}`,
                  borderRadius: '8px', padding: '10px 12px', textAlign: 'left', cursor: 'pointer',
                  transition: 'all 0.2s', width: '100%',
                }}>
                {/* Header row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: surahColor(c.verse.surah), boxShadow: `0 0 5px ${surahColor(c.verse.surah)}`, flexShrink: 0 }} />
                    <span style={{ color: '#d4a574', fontSize: '0.76rem', fontWeight: 600 }}>{surahNameTr(c.verse.surah)}</span>
                    <span style={{ color: '#94a3b8', fontSize: '0.7rem' }}>{c.id}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <div style={{ width: `${Math.round((c.score - 0.45) / 0.55 * 24)}px`, height: '2px', background: 'linear-gradient(to right, rgba(180,130,60,0.5), #d4a574)', borderRadius: '1px', minWidth: '4px' }} />
                    <span style={{ color: '#c9a227', fontSize: '0.68rem', fontWeight: 600 }}>{Math.round(c.score * 100)}%</span>
                  </div>
                </div>

                {/* Collapsed: truncated text */}
                {expandedId !== c.id && (
                  <div style={{ color: '#94a3b8', fontSize: '0.78rem', lineHeight: 1.55 }}>
                    {vt(c.verse)?.slice(0, 110)}...
                  </div>
                )}

                {/* Expanded: Arabic + full text */}
                {expandedId === c.id && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                    <div style={{
                      fontFamily: "'Amiri', serif", fontSize: '1.35rem', lineHeight: 2.1,
                      color: '#d4a574', textAlign: 'right', direction: 'rtl',
                      padding: '8px 10px',
                      background: 'rgba(212,165,116,0.05)',
                      borderRadius: '6px', border: '1px solid rgba(212,165,116,0.08)',
                    }}>
                      {c.verse.arabic}
                    </div>
                    <div style={{ color: '#c8c5c0', fontSize: '0.78rem', lineHeight: 1.65 }}>
                      {vt(c.verse)}
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
          {connections.length > PREVIEW_COUNT && (
            <button
              onClick={() => setShowAll(v => !v)}
              style={{ marginTop: '8px', width: '100%', background: 'none', border: '1px solid rgba(212,165,116,0.15)', borderRadius: '7px', color: '#64748b', fontSize: '0.73rem', padding: '7px', cursor: 'pointer' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(212,165,116,0.35)'; e.currentTarget.style.color = '#d4a574'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(212,165,116,0.15)'; e.currentTarget.style.color = '#64748b'; }}>
              {showAll
                ? (language === 'tr' ? '↑ Daha az göster' : '↑ Show less')
                : (language === 'tr' ? `↓ ${connections.length - PREVIEW_COUNT} ayet daha` : `↓ ${connections.length - PREVIEW_COUNT} more`)}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
