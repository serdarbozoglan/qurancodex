'use client';

import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import {
  Color, Group, Mesh,
  SphereGeometry, TorusGeometry, MeshLambertMaterial,
  AmbientLight, DirectionalLight,
  MOUSE, TOUCH,
} from 'three';
import { useLanguage } from '../i18n/LanguageContext';
import { buildFallbackUrlsFromReciter } from '../hooks/useAudioWithFallback';
import { COLORS, FONTS, OVERLAY_TITLE, RADIUS, TRANSITION } from '../tokens';

import { cleanArabicForGraph } from '../lib/arabic';
import { VolumeOnIcon, VolumeOffIcon } from './icons';
// ─── Strip footnotes from Suat Yıldırım translation ──────────────────────────
// Removes {KM, Tesniye 4,35; İşaya 43,10-11} style cross-reference notes.
function cleanTr(str) {
  if (!str) return str;
  return str
    .replace(/\s*\{[^}]*\}/g, '')          // {KM, Tesniye 4,35} curly-brace refs
    .replace(/\s*\[\d[^\]]*\]/g, '')        // [36,56; 40,47; 7,53] square-bracket refs
    .replace(/^[""\u201C\u201D\u0022]+|[""\u201C\u201D\u0022]+$/g, '') // leading/trailing quotes
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
  'Ed-Duhâ','El-İnşirah','Et-Tîn','El-Alak','El-Kadr','El-Beyyine',
  'Ez-Zilzâl','El-Âdiyât','El-Kâria','Et-Tekâsür','El-Asr','El-Hümeze',
  'El-Fîl','Kureyş','El-Mâûn','El-Kevser','El-Kâfirûn','En-Nasr',
  'Tebbet','El-İhlâs','El-Felak','En-Nâs',
];
function surahNameTr(n) { return SURAH_NAMES_TR[n - 1] || ''; }

const SURAH_NAMES_AR = [
  'الفَاتِحَة','البَقَرَة','آل عِمْرَان','النِّسَاء','المَائِدَة','الأَنْعَام','الأَعْرَاف','الأَنْفَال','التَّوْبَة','يُونُس',
  'هُود','يُوسُف','الرَّعْد','إِبْرَاهِيم','الحِجْر','النَّحْل','الإِسْرَاء','الكَهْف','مَرْيَم','طٰهٰ',
  'الأَنْبِيَاء','الحَجّ','المُؤْمِنُون','النُّور','الفُرْقَان','الشُّعَرَاء','النَّمْل','القَصَص','العَنْكَبُوت','الرُّوم',
  'لُقْمَان','السَّجْدَة','الأَحْزَاب','سَبَأ','فَاطِر','يٰسٓ','الصَّافَّات','صٓ','الزُّمَر','غَافِر',
  'فُصِّلَت','الشُّورَى','الزُّخْرُف','الدُّخَان','الجَاثِيَة','الأَحْقَاف','مُحَمَّد','الفَتْح','الحُجُرَات','قٓ',
  'الذَّارِيَات','الطُّور','النَّجْم','القَمَر','الرَّحْمٰن','الوَاقِعَة','الحَدِيد','المُجَادَلَة','الحَشْر','المُمْتَحِنَة',
  'الصَّفّ','الجُمُعَة','المُنَافِقُون','التَّغَابُن','الطَّلَاق','التَّحْرِيم','المُلْك','القَلَم','الحَاقَّة','المَعَارِج',
  'نُوح','الجِنّ','المُزَّمِّل','المُدَّثِّر','القِيَامَة','الإِنْسَان','المُرْسَلَات','النَّبَأ','النَّازِعَات','عَبَسَ',
  'التَّكْوِير','الانفِطَار','المُطَفِّفِين','الانشِقَاق','البُرُوج','الطَّارِق','الأَعْلَى','الغَاشِيَة','الفَجْر','البَلَد',
  'الشَّمْس','اللَّيْل','الضُّحَى','الشَّرْح','التِّين','العَلَق','القَدْر','البَيِّنَة','الزَّلْزَلَة','العَادِيَات',
  'القَارِعَة','التَّكَاثُر','العَصْر','الهُمَزَة','الفِيل','قُرَيْش','المَاعُون','الكَوْثَر','الكَافِرُون','النَّصْر',
  'المَسَد','الإِخْلَاص','الفَلَق','النَّاس',
];

const MADANI_SURAHS = new Set([
  2, 3, 4, 5, 8, 9, 13, 22, 24, 33, 47, 48, 49,
  55, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 76, 98, 99, 110,
]);

const SURAH_AYAH_COUNTS = [
   7,286,200,176,120,165,206, 75,129,109,
  123,111, 43, 52, 99,128,111,110, 98,135,
  112, 78,118, 64, 77,227, 93, 88, 69, 60,
   34, 30, 73, 54, 45, 83,182, 88, 75, 85,
   54, 53, 89, 59, 37, 35, 38, 29, 18, 45,
   60, 49, 62, 55, 78, 96, 29, 22, 24, 13,
   14, 11, 11, 18, 12, 12, 30, 52, 52, 44,
   28, 28, 20, 56, 40, 31, 50, 40, 46, 42,
   29, 19, 36, 25, 22, 17, 19, 26, 30, 20,
   15, 21, 11,  8,  8, 19,  5,  8,  8, 11,
   11,  8,  3,  9,  5,  4,  7,  3,  6,  3,
    5,  4,  5,  6,
];

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

// Standart Medine mushafı sayfa aralıkları [başlangıç, bitiş] — 114 sûre
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

function hex(s) { return new Color(s); }

// ─── Glowing node object (Three.js) ──────────────────────────────────────────
function makeNodeObject(node, isSelected, isHovered, isDimmed) {
  const group = new Group();

  // Dimmed: warm amber micro-dot, barely visible
  if (isDimmed) {
    group.add(new Mesh(
      new SphereGeometry(0.8, 6, 6),
      new MeshLambertMaterial({ color: hex(COLORS.gold), transparent: true, opacity: 0.11 })
    ));
    return group;
  }

  const color = isSelected ? '#f0c860' : (isHovered ? '#fff8ee' : node.color);
  const base = node.ghost ? 1.2 : (1.6 + Math.sqrt(node.degree || 1) * 0.65);
  const size = isSelected ? base * 2.0 : (isHovered ? base * 1.5 : base);

  // Core sphere
  group.add(new Mesh(
    new SphereGeometry(size, 16, 16),
    new MeshLambertMaterial({
      color: hex(color), emissive: hex(color),
      emissiveIntensity: isSelected ? 1.0 : (isHovered ? 0.6 : (node.ghost ? 0.12 : 0.4)),
      transparent: node.ghost, opacity: node.ghost ? 0.3 : 1,
    })
  ));
  // Outer glow halo
  if (!node.ghost) {
    group.add(new Mesh(
      new SphereGeometry(size * (isSelected ? 2.8 : 2.0), 12, 12),
      new MeshLambertMaterial({ color: hex(color), transparent: true, opacity: isSelected ? 0.14 : (isHovered ? 0.1 : 0.05), depthWrite: false })
    ));
  }
  // Selected: golden ring
  if (isSelected) {
    const ring = new Mesh(
      new TorusGeometry(size * 3.2, 0.35, 8, 48),
      new MeshLambertMaterial({ color: hex('#f0c860'), emissive: hex(COLORS.gold), emissiveIntensity: 1.0, transparent: true, opacity: 0.75 })
    );
    ring.rotation.x = Math.PI / 2;
    group.add(ring);
    // Second ring at 45°
    const ring2 = new Mesh(
      new TorusGeometry(size * 3.2, 0.2, 6, 48),
      new MeshLambertMaterial({ color: hex(COLORS.gold), transparent: true, opacity: 0.35, depthWrite: false })
    );
    ring2.rotation.x = Math.PI / 4;
    group.add(ring2);
  }
  return group;
}

// ─── Build graph data ─────────────────────────────────────────────────────────
// mode='all': tüm ayetler, score >= 0.55
// mode='surah': odak sûre + bağlı dış ayetler (ghost), score >= 0.45
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

  // Center primary nodes around origin so the camera always frames them correctly
  const primaryNodes = rawNodes.filter(nd => !nd.ghost);
  const pn = primaryNodes.length;
  if (pn > 0) {
    const cx = primaryNodes.reduce((s, nd) => s + nd.x, 0) / pn;
    const cy = primaryNodes.reduce((s, nd) => s + nd.y, 0) / pn;
    const cz = primaryNodes.reduce((s, nd) => s + nd.z, 0) / pn;
    rawNodes.forEach(nd => { nd.x -= cx; nd.y -= cy; nd.z -= cz; });
  }

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
  const [search, setSearch] = useState('');
  const [highlightIdx, setHighlightIdx] = useState(0);
  const listRef = useRef(null);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  const placeholder = allowAll
    ? (language === 'tr' ? 'Tüm Sûreler' : 'All Surahs')
    : (language === 'tr' ? 'Sûreye git…' : 'Go to surah…');
  const currentLabel = value ? `${value}. ${surahNameTr(value)}` : placeholder;

  // Filter surahs by number or name
  const filteredSurahs = (() => {
    const q = search.trim();
    if (!q) return Array.from({ length: 114 }, (_, i) => i + 1);
    const num = parseInt(q, 10);
    if (!isNaN(num) && q.match(/^\d+$/)) {
      return Array.from({ length: 114 }, (_, i) => i + 1).filter(s => s === num);
    }
    const norm = normalizeForSearch(q);
    return Array.from({ length: 114 }, (_, i) => i + 1)
      .filter(s => normalizeForSearch(surahNameTr(s)).includes(norm));
  })();

  // Reset highlight when filtered list changes
  // eslint-disable-next-line react-hooks/set-state-in-effect -- resetting derived state on dep change
  useEffect(() => { setHighlightIdx(0); }, [search]);

  // Auto-focus search when opening
  /* eslint-disable react-hooks/set-state-in-effect -- resetting state when dropdown opens */
  useEffect(() => {
    if (open) { setSearch(''); setHighlightIdx(0); setTimeout(() => inputRef.current?.focus(), 0); }
  }, [open]);
  /* eslint-enable react-hooks/set-state-in-effect */

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
    listRef.current.children[highlightIdx]?.scrollIntoView({ block: 'nearest' });
  }, [highlightIdx, open]);

  const handleInputKey = (e) => {
    if (e.key === 'Escape') { setOpen(false); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlightIdx(i => Math.min(i + 1, filteredSurahs.length - 1)); return; }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setHighlightIdx(i => Math.max(i - 1, 0)); return; }
    if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredSurahs[highlightIdx]) { onChange(filteredSurahs[highlightIdx]); setOpen(false); }
    }
  };

  const itemStyle = (idx, s) => ({
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    width: '100%', textAlign: 'left', gap: '8px',
    padding: '8px 12px', border: 'none', cursor: 'pointer',
    borderBottom: '1px solid rgba(255,255,255,0.03)',
    background: (idx === highlightIdx || s === value) ? 'rgba(212,165,116,0.12)' : 'transparent',
    boxSizing: 'border-box',
  });

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <button tabIndex={-1}
        onClick={() => setOpen(o => !o)}
        style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${COLORS.goldAlpha20}`, borderRadius: RADIUS.md, color: value ? COLORS.offWhite : COLORS.slate500, padding: '0 26px 0 10px', fontSize: '0.875rem', outline: 'none', cursor: 'pointer', height: '36px', minWidth: '155px', maxWidth: '195px', textAlign: 'left', position: 'relative', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', boxSizing: 'border-box' }}>
        {currentLabel}
        <span style={{ position: 'absolute', right: '8px', top: '50%', transform: `translateY(-50%) rotate(${open ? 180 : 0}deg)`, transition: 'transform 0.15s', color: COLORS.slate500, fontSize: '0.62rem', pointerEvents: 'none' }}>▾</span>
      </button>
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 4px)', right: 0, left: 'auto', background: '#07091a', border: `1px solid ${COLORS.goldAlpha20}`, borderRadius: RADIUS.chip, zIndex: 200, boxShadow: '0 12px 40px rgba(0,0,0,0.95)', overflow: 'hidden', width: '260px', maxWidth: 'calc(100vw - 24px)', display: 'flex', flexDirection: 'column' }}>
          {/* Search input */}
          <div style={{ padding: '8px 10px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={handleInputKey}
              placeholder={language === 'tr' ? 'Sûre adı veya numarası…' : 'Surah name or number…'}
              style={{ width: '100%', padding: '5px 9px', borderRadius: RADIUS.sm, background: 'rgba(255,255,255,0.06)', border: `1px solid ${COLORS.glassBorder}`, color: '#e2e8f0', fontSize: '0.78rem', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <div ref={listRef} style={{ maxHeight: '270px', overflowY: 'auto' }}>
            {allowAll && !search && (
              <button onClick={() => { onChange(null); setOpen(false); }}
                style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 12px', background: !value ? 'rgba(212,165,116,0.1)' : 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.07)', color: !value ? COLORS.gold : COLORS.silver, fontSize: '0.78rem', cursor: 'pointer', boxSizing: 'border-box' }}>
                {language === 'tr' ? 'Tüm Sûreler' : 'All Surahs'}
              </button>
            )}
            {filteredSurahs.length === 0 && (
              <div style={{ padding: '16px 12px', color: '#4a5568', fontSize: '0.78rem', textAlign: 'center' }}>
                {language === 'tr' ? 'Sonuç bulunamadı' : 'No results'}
              </div>
            )}
            {filteredSurahs.map((s, idx) => {
              const isSelected = s === value;
              const isHighlit = idx === highlightIdx;
              const isMadani = MADANI_SURAHS.has(s);
              const nameColor = isSelected ? COLORS.gold : isHighlit ? COLORS.offWhite : COLORS.silver;
              return (
                <button key={s} style={itemStyle(idx, s)}
                  onClick={() => { onChange(s); setOpen(false); setSearch(''); }}
                  onMouseEnter={() => setHighlightIdx(idx)}
                >
                  {/* Left: number + icon + name + ayah count */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px', minWidth: 0, overflow: 'hidden' }}>
                    <span style={{ color: '#4a5568', fontSize: '0.62rem', flexShrink: 0, minWidth: '18px', textAlign: 'right' }}>{s}</span>
                    <span style={{ flexShrink: 0, lineHeight: 1, display: 'flex', alignItems: 'center' }}>
                      {isMadani
                        ? <img src="/icons/masjid-al-nabawi.png" alt="" width="18" height="18" style={{ display: 'block', objectFit: 'contain' }} />
                        : <img src="/icons/kaaba.png" alt="" width="16" height="16" style={{ display: 'block', objectFit: 'contain' }} />
                      }
                    </span>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ color: nameColor, fontSize: '0.78rem', fontWeight: isSelected ? 700 : 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {surahNameTr(s)}
                      </div>
                      <div style={{ color: '#4a5568', fontSize: '0.6rem', marginTop: '1px' }}>
                        {SURAH_AYAH_COUNTS[s - 1]} {language === 'tr' ? 'ayet' : 'verses'}
                      </div>
                    </div>
                  </div>
                  {/* Right: Arabic name */}
                  <span style={{ fontFamily: FONTS.quran, fontSize: '0.9rem', color: isSelected ? COLORS.gold : '#4a5568', flexShrink: 0, direction: 'rtl', maxWidth: '72px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {SURAH_NAMES_AR[s - 1]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ClusterView — SVG bubble map ────────────────────────────────────────────
function ClusterView({ verses, surahClusters, onSelectSurah, onSelectVerse, language, onClose, onOpenFullGraph, initialSearch = '', onSearchConsumed }) {
  const svgRef = useRef(null);
  const headerRef = useRef(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [hovered, setHovered] = useState(null);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const drag = useRef(null);
  const hasInitFit = useRef(false);
  const [viewMode, setViewMode] = useState('semantic'); // 'semantic' | 'classical'
  const [showClickHint, setShowClickHint] = useState(true);
  const [headerHeight, setHeaderHeight] = useState(0);
  useEffect(() => { const t = setTimeout(() => setShowClickHint(false), 4000); return () => clearTimeout(t); }, []);

  // Header overlay yüksekliği — fit hesabında üstteki gizli alanı dışlamak için
  useEffect(() => {
    if (!headerRef.current) return;
    const ro = new ResizeObserver(entries => {
      setHeaderHeight(Math.ceil(entries[0].contentRect.height));
    });
    ro.observe(headerRef.current);
    return () => ro.disconnect();
  }, []);

  const autoSelectedRef = useRef(false);

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

  // Auto-select direct verse when initialSearch is provided (e.g. from ConceptGraph)
  useEffect(() => {
    if (initialSearch && clusterSearchResults.direct && !autoSelectedRef.current) {
      autoSelectedRef.current = true;
      onSelectVerse(clusterSearchResults.direct);
      onSearchConsumed?.();
    }
  }, [clusterSearchResults.direct, initialSearch, onSelectVerse, onSearchConsumed]);

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
  // Header overlay (top-bar) yüksekliğini dışlayarak görünür alana fit yapar —
  // aksi takdirde üst sıradaki cluster'lar (örn. Sûre 31, 41, 33) header arkasında kalır.
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
    const availableH = Math.max(200, H - headerHeight);
    const scale = Math.min((W - 2 * MARGIN) / bboxW, (availableH - 2 * MARGIN) / bboxH, 1.0);
    const x = W / 2 - scale * (minBX + bboxW / 2);
    const y = headerHeight + availableH / 2 - scale * (minBY + bboxH / 2);
    return { x, y, scale };
  }, [viewMode, classicalSeparatedPositions, separatedPositions, clusters, radius, W, H, headerHeight]);

  // Fit on initial mount; re-fit when mode changes
  // headerHeight > 0 koşulu: ResizeObserver async tetiklendiği için ilk render'da
  // headerHeight=0 ile yanlış fit yapılmasını engeller.
  useEffect(() => {
    if (!hasInitFit.current && Object.keys(activePositions).length > 0 && headerHeight > 0) {
      hasInitFit.current = true;
      setTransform(fitTransform);
    }
  }, [fitTransform, activePositions, headerHeight]);

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
    <div style={{ position: 'fixed', top: '62px', left: 0, right: 0, bottom: 0, zIndex: 50, background: COLORS.cosmicBlack, overflow: 'hidden' }}>
      {/* Header */}
      <div ref={headerRef} style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20,
        display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px', padding: '10px 18px',
        background: 'linear-gradient(to bottom, rgba(6,8,14,0.98) 60%, transparent)',
      }}>
        {/* Row 1: title + close */}
        <div style={{ flex: '1 1 auto', minWidth: 0 }}>
          <span style={{ ...OVERLAY_TITLE, fontSize: '1.05rem' }}>
            {language === 'tr' ? 'Sûre Haritası' : 'Surah Map'}
          </span>
        </div>

        {/* Search — fixed width, stays right of title */}
        <div style={{ position: 'relative', flex: '0 0 auto', order: 3, width: '260px', maxWidth: 'calc(100vw - 160px)' }}>
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={language === 'tr' ? 'Sûre, ayet veya kelime ara...' : 'Search surah, verse or keyword...'}
            dir="auto"
            style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${COLORS.goldAlpha20}`, borderRadius: RADIUS.md, color: COLORS.offWhite, padding: '6px 12px 6px 30px', fontSize: '0.82rem', width: '100%', maxWidth: '260px', outline: 'none', height: '32px', boxSizing: 'border-box' }}
          />
          <svg aria-hidden="true" style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }}
            width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="2.5">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          {/* Hint */}
          {!searchQuery && (
            <div style={{ position: 'absolute', top: '100%', left: '1px', marginTop: '5px', fontSize: '0.78rem', color: '#8a7355', whiteSpace: 'nowrap', pointerEvents: 'none' }}>
              {language === 'tr' ? 'örn: Bismillah · Bakara 5 · 2:286 · Fatiha · iman' : 'e.g. Bismillah · Bakara 5 · 2:286 · Fatiha · faith'}
            </div>
          )}
          {(clusterSearchResults.direct || clusterSearchResults.surahs.length > 0 || clusterSearchResults.verses.length > 0) && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '4px',
              background: '#0d1128', border: `1px solid ${COLORS.goldAlpha15}`,
              borderRadius: RADIUS.md, overflow: 'hidden', zIndex: 30,
              boxShadow: '0 8px 32px rgba(0,0,0,0.6)', boxSizing: 'border-box',
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
                      <span style={{ color: COLORS.gold, fontSize: '0.68rem', fontWeight: 700 }}>→ AYET</span>
                      <span style={{ color: COLORS.gold, fontWeight: 700 }}>{v.id}</span>
                      <span style={{ color: COLORS.silver, fontSize: '0.75rem' }}>{surahNameTr(v.surah)}</span>
                    </div>
                    <div style={{ color: COLORS.silver, fontSize: '0.72rem', lineHeight: 1.4 }}>{vt?.slice(0, 80)}...</div>
                  </button>
                );
              })()}
              {clusterSearchResults.surahs.map(s => (
                <button key={`cs-${s.surah}`}
                  onClick={() => { onSelectSurah(s.surah); setSearchQuery(''); }}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', textAlign: 'left', padding: '8px 12px', background: 'rgba(212,165,116,0.06)', border: 'none', borderBottom: '1px solid rgba(212,165,116,0.08)', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,165,116,0.14)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(212,165,116,0.06)'}>
                  <span style={{ color: COLORS.gold, fontSize: '0.68rem', fontWeight: 700 }}>◈ SÛRE</span>
                  <span style={{ color: COLORS.gold, fontWeight: 700 }}>{s.surah}. {s.name}</span>
                </button>
              ))}
              {clusterSearchResults.verses.map(v => {
                const vt = language === 'tr' ? (cleanTr(v.turkish) || v.english) : (v.english || cleanTr(v.turkish));
                return (
                  <button key={`cv-${v.id}`}
                    onClick={() => { onSelectVerse(v); setSearchQuery(''); }}
                    style={{ display: 'flex', flexDirection: 'column', gap: '2px', width: '100%', textAlign: 'left', padding: '8px 12px', background: 'none', border: 'none', borderBottom: `1px solid ${COLORS.glassBg}`, cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,165,116,0.08)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ color: COLORS.gold, fontWeight: 700, fontSize: '0.78rem' }}>{v.id}</span>
                      <span style={{ color: COLORS.slate500, fontSize: '0.7rem' }}>{surahNameTr(v.surah)}</span>
                    </div>
                    <div style={{ color: COLORS.silver, fontSize: '0.71rem', lineHeight: 1.4 }}>{vt?.slice(0, 70)}...</div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Süreye git dropdown — row 2 on mobile */}
        <div style={{ order: 4, flexShrink: 0 }}>
          <SurahDropdown value={null} onChange={onSelectSurah} language={language} allowAll={false} />
        </div>

        {/* Full network button — hidden on mobile */}
        {onOpenFullGraph && (
          <button
            onClick={onOpenFullGraph}
            className="hidden sm:flex"
            style={{ background: 'rgba(212,165,116,0.08)', border: `1px solid ${COLORS.goldAlpha20}`, borderRadius: RADIUS.md, color: COLORS.gold, padding: '0 14px', fontSize: '0.78rem', cursor: 'pointer', height: '32px', boxSizing: 'border-box', whiteSpace: 'nowrap', flexShrink: 0, alignItems: 'center', order: 5 }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,165,116,0.18)'; e.currentTarget.style.borderColor = 'rgba(212,165,116,0.5)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(212,165,116,0.08)'; e.currentTarget.style.borderColor = COLORS.goldAlpha20; }}
          >
            {language === 'tr' ? '🌐 Tüm Ayet Ağı' : '🌐 Full Verse Network'}
          </button>
        )}

        {/* Close — rightmost */}
        <button
          onClick={onClose}
          aria-label={language === 'en' ? 'Close verse graph' : 'Ayet grafiğini kapat'}
          style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${COLORS.glassBorder}`, borderRadius: RADIUS.full, color: COLORS.slate500, cursor: 'pointer', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, order: 10 }}
          onMouseEnter={e => { e.currentTarget.style.background = COLORS.glassBorder; e.currentTarget.style.color = COLORS.offWhite; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = COLORS.slate500; }}
        >
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* SVG canvas */}
      {/* eslint-disable react-hooks/refs -- drag.current is read for cursor style, intentional */}
      <svg ref={svgRef} width={W} height={H}
        style={{ cursor: drag.current ? 'grabbing' : 'grab', display: 'block' }}
        onMouseDown={onMouseDown} onMouseMove={onMouseMove}
        onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
      >
      {/* eslint-enable react-hooks/refs */}
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
              fill={COLORS.gold} fillOpacity={0.22}
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
                    stroke={COLORS.gold} strokeWidth={0.5} opacity={opacity} />
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
                  style={{ filter: isHov ? `drop-shadow(0 0 8px ${color})` : 'none', transition: `all ${TRANSITION.fast}` }}
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
                        fill={isHov ? color : COLORS.silver} fillOpacity={isHov ? 1 : 0.7}
                        style={{ pointerEvents: 'none', userSelect: 'none', transition: `all ${TRANSITION.fast}` }}>
                        {surahNameTr(c.surah)}
                      </text>
                      {isHov && (
                        <text x={x} y={countY} textAnchor="middle"
                          fontSize={8} fill={COLORS.slate500} style={{ pointerEvents: 'none', userSelect: 'none' }}>
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

      {/* Click hint — auto-dismisses after 4s */}
      <div style={{
        position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
        zIndex: 20, background: 'rgba(10,10,26,0.88)', border: `1px solid ${COLORS.glassBgStrong}`,
        borderRadius: RADIUS.pillSm, padding: '6px 18px', color: 'rgba(148,163,184,0.75)', fontSize: '0.7rem',
        whiteSpace: 'nowrap', pointerEvents: 'none', backdropFilter: 'blur(8px)',
        opacity: showClickHint ? 1 : 0, transition: 'opacity 1s ease',
      }}>
        {language === 'tr' ? 'Daireye tıkla: sûreye git  ·  Sürükle: kaydır  ·  Tekerlek: yakınlaştır' : 'Click a circle: go to surah  ·  Drag: pan  ·  Scroll: zoom'}
      </div>

      {/* Legend */}
      <div style={{ position: 'absolute', bottom: '24px', left: '24px', display: 'flex', gap: '12px', alignItems: 'center', pointerEvents: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: 'rgba(148,163,184,0.6)', fontFamily: "'Inter', sans-serif" }}>
          <div style={{ width: '9px', height: '9px', borderRadius: RADIUS.full, background: MEKKI_COLOR, flexShrink: 0 }} />
          {language === 'tr' ? 'Mekkî' : 'Meccan'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: 'rgba(148,163,184,0.6)', fontFamily: "'Inter', sans-serif" }}>
          <div style={{ width: '9px', height: '9px', borderRadius: RADIUS.full, background: MEDENI_COLOR, flexShrink: 0 }} />
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
            borderRadius: RADIUS.chip, padding: '12px 14px',
            backdropFilter: 'blur(14px)', pointerEvents: 'none', zIndex: 10,
            boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
          }}>
            <div style={{ color: COLORS.gold, fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px', opacity: 0.85 }}>
              {language === 'tr' ? group.tr : group.en}
            </div>
            {group.surahs.map(s => {
              const cl = clusters.find(c => c.surah === s);
              const isActive = s === hovered;
              return (
                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ color: isActive ? COLORS.gold : COLORS.slate500, fontSize: '0.68rem', fontWeight: 700, minWidth: '22px' }}>{s}.</span>
                  <span style={{ color: isActive ? COLORS.offWhite : COLORS.silver, fontSize: '0.75rem', flex: 1, fontWeight: isActive ? 600 : 400 }}>{surahNameTr(s)}</span>
                  {cl && <span style={{ color: '#4a5568', fontSize: '0.63rem' }}>{cl.count}</span>}
                </div>
              );
            })}
          </div>
        );
      })()}

      {/* View mode toggle — bottom right */}
      <div style={{
        position: 'absolute', bottom: '24px', right: '24px', zIndex: 20,
        display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end',
      }}>
        <span style={{ color: 'rgba(148,163,184,0.45)', fontSize: '0.58rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: "'Inter', sans-serif", userSelect: 'none' }}>
          {language === 'tr' ? 'Görünüm' : 'View'}
        </span>
        <div style={{
          display: 'flex', gap: '6px',
        }}>
          {[
            {
              mode: 'semantic',
              labelTr: 'Anlam Kümeleri', labelEn: 'Semantic Clusters',
              tipTr: 'Ayetlerin anlamsal benzerliğine göre konumlandırılmış',
              tipEn: 'Positioned by semantic similarity of verses',
            },
            {
              mode: 'classical',
              labelTr: 'İlmî Gruplar', labelEn: 'Traditional Groups',
              tipTr: 'İslam ilmi geleneğine göre: Tıval, Mufassal vb.',
              tipEn: 'By Islamic scholarly tradition: Tiwāl, Mufassal etc.',
            },
          ].map(({ mode, labelTr, labelEn, tipTr, tipEn }) => {
            const active = viewMode === mode;
            return (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                title={language === 'tr' ? tipTr : tipEn}
                style={{
                  padding: '7px 14px', borderRadius: RADIUS.md, border: 'none', cursor: 'pointer',
                  background: active ? 'rgba(212,165,116,0.18)' : 'rgba(255,255,255,0.04)',
                  color: active ? COLORS.gold : 'rgba(148,163,184,0.55)',
                  fontSize: '0.75rem', fontFamily: "'Inter', sans-serif",
                  fontWeight: active ? 600 : 400,
                  outline: active ? '1px solid rgba(212,165,116,0.3)' : '1px solid rgba(255,255,255,0.07)',
                  transition: `all ${TRANSITION.fast}`,
                  backdropFilter: 'blur(12px)',
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.color = '#d4d8e0'; e.currentTarget.style.background = COLORS.glassBgStrong; }}}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.color = 'rgba(148,163,184,0.55)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}}
              >
                {language === 'tr' ? labelTr : labelEn}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Zoom controls overlay ────────────────────────────────────────────────────
function ZoomControls({ graphRef, language, rightOffset = 24 }) {
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
    width: '34px', height: '34px', border: `1px solid ${COLORS.goldAlpha25}`,
    borderRadius: RADIUS.md, background: 'rgba(5,5,16,0.88)', color: COLORS.silver,
    fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center',
    justifyContent: 'center', transition: `all ${TRANSITION.fast}`, userSelect: 'none',
    boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
  };

  return (
    <div style={{
      position: 'absolute', bottom: '24px', right: `${rightOffset}px`, zIndex: 25,
      display: 'flex', flexDirection: 'column', gap: '6px',
    }}>
      <button
        style={btnStyle}
        title={language === 'en' ? 'Zoom in' : 'Yakınlaştır'}
        aria-label={language === 'en' ? 'Zoom in' : 'Yakınlaştır'}
        onMouseEnter={e => { e.currentTarget.style.color = COLORS.gold; e.currentTarget.style.borderColor = 'rgba(212,165,116,0.5)'; }}
        onMouseLeave={e => { e.currentTarget.style.color = COLORS.silver; e.currentTarget.style.borderColor = COLORS.goldAlpha20; }}
        onClick={() => zoomBy(0.65)}
      >+</button>
      <button
        style={btnStyle}
        title={language === 'en' ? 'Zoom out' : 'Uzaklaştır'}
        aria-label={language === 'en' ? 'Zoom out' : 'Uzaklaştır'}
        onMouseEnter={e => { e.currentTarget.style.color = COLORS.gold; e.currentTarget.style.borderColor = 'rgba(212,165,116,0.5)'; }}
        onMouseLeave={e => { e.currentTarget.style.color = COLORS.silver; e.currentTarget.style.borderColor = COLORS.goldAlpha20; }}
        onClick={() => zoomBy(1.54)}
      >−</button>
      <button
        style={{ ...btnStyle, fontSize: '0.7rem', color: COLORS.slate500 }}
        title={language === 'tr' ? 'Tümünü göster' : 'Fit all'}
        aria-label={language === 'tr' ? 'Grafın tümünü göster' : 'Fit graph to view'}
        onMouseEnter={e => { e.currentTarget.style.color = COLORS.gold; e.currentTarget.style.borderColor = 'rgba(212,165,116,0.5)'; }}
        onMouseLeave={e => { e.currentTarget.style.color = COLORS.slate500; e.currentTarget.style.borderColor = COLORS.goldAlpha20; }}
        onClick={() => graphRef.current?.zoomToFit(600, 60)}
      >⊡</button>
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
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 640);
    h();
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);
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

  const gold = COLORS.gold, muted = COLORS.silver, dim = COLORS.slate500;
  const label = (tr, en) => language === 'tr' ? tr : en;

  const navBtn = (disabled) => ({
    flexShrink: 0, width: '32px', height: '32px', borderRadius: RADIUS.full,
    background: 'transparent',
    border: `1px solid ${disabled ? 'rgba(212,165,116,0.1)' : 'rgba(212,165,116,0.3)'}`,
    color: disabled ? 'rgba(212,165,116,0.18)' : gold,
    cursor: disabled ? 'default' : 'pointer',
    fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: `all ${TRANSITION.base}`,
  });

  const sectionLabel = (tr, en) => (
    <div style={{ color: COLORS.slate600, fontSize: '12px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '10px' }}>
      {label(tr, en)}
    </div>
  );

  const divider = <div style={{ borderTop: `1px solid ${COLORS.glassBg}`, margin: '0 0 4px 0' }} />;

  const arabicStyle = { fontFamily: FONTS.quran, fontSize: '1.3rem', direction: 'rtl', textAlign: 'right', color: gold, opacity: 0.9, lineHeight: 2, display: 'block', marginTop: '6px' };

  const pages = SURAH_PAGES[surah - 1];
  const [p1, p2] = pages || [null, null];
  const pageCount = p1 && p2 ? p2 - p1 + 1 : null;
  const isMedeni = info?.period?.tr === 'Medenî' || info?.period?.en === 'Medinan';

  const primaryCount = graphData.nodes.filter(n => !n.ghost).length;
  const _ghostCount = graphData.nodes.filter(n => n.ghost).length;
  const linkCount = graphData.links.length;

  return (
    <div className="surah-info-panel" style={{
      position: 'absolute', left: 0, top: 0, bottom: 0, width: isMobile ? '100vw' : '480px', zIndex: 15,
      background: 'linear-gradient(to right, rgba(6,8,18,0.98) 65%, rgba(6,8,18,0.85) 82%, transparent)',
      padding: '68px 28px 32px 28px', overflowY: 'auto', pointerEvents: 'auto',
      display: 'flex', flexDirection: 'column', gap: '0',
      scrollbarWidth: 'none', msOverflowStyle: 'none',
    }}>

      {/* ── Sûre ismi + nav ── */}
      {showName && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          {onNavigate && (
            <button onClick={() => onNavigate(-1)} disabled={surah <= 1} title={language === 'tr' ? 'Önceki sûre' : 'Previous surah'}
              style={navBtn(surah <= 1)}
              onMouseEnter={e => { if (surah > 1) { e.currentTarget.style.background = 'rgba(212,165,116,0.1)'; e.currentTarget.style.borderColor = 'rgba(212,165,116,0.5)'; }}}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(212,165,116,0.3)'; }}
            >‹</button>
          )}
          <div style={{ ...OVERLAY_TITLE, fontSize: '1.35rem', lineHeight: 1.2, flex: 1, textAlign: 'center' }}>
            {surah}. {SURAH_NAMES_TR[surah - 1]}
          </div>
          {onNavigate && (
            <button onClick={() => onNavigate(1)} disabled={surah >= 114} title={language === 'tr' ? 'Sonraki sûre' : 'Next surah'}
              style={navBtn(surah >= 114)}
              onMouseEnter={e => { if (surah < 114) { e.currentTarget.style.background = 'rgba(212,165,116,0.1)'; e.currentTarget.style.borderColor = 'rgba(212,165,116,0.5)'; }}}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(212,165,116,0.3)'; }}
            >›</button>
          )}
        </div>
      )}

      {/* ── Anlamı ── */}
      {info && (
        <div style={{ marginBottom: '16px' }}>
          <div style={{ color: COLORS.slate600, fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '4px' }}>{label('Anlamı', 'Meaning')}</div>
          <div style={{ color: '#c8c0b4', fontSize: '1.05rem', fontStyle: 'italic', lineHeight: 1.4, fontFamily: "'Playfair Display', serif" }}>
            {label(info.meaning.tr, info.meaning.en)}
          </div>
        </div>
      )}

      {/* ── Dönem + Tarih ── */}
      {info && (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
          <span style={{
            background: isMedeni ? 'rgba(26,122,76,0.15)' : 'rgba(212,165,116,0.1)',
            border: `1px solid ${isMedeni ? 'rgba(26,122,76,0.4)' : COLORS.goldAlpha25}`,
            borderRadius: RADIUS.pillSm, color: isMedeni ? '#2ecc71' : gold,
            fontSize: '0.82rem', padding: '4px 14px', fontWeight: 600,
          }}>{label(info.period.tr, info.period.en)}</span>
          <span style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: RADIUS.pillSm, color: muted, fontSize: '0.82rem', padding: '4px 14px' }}>
            {language === 'tr' ? `M.S. ${info.period.approx}` : `${info.period.approx} CE`}
          </span>
        </div>
      )}

      {/* ── Sayfa aralığı ── */}
      {p1 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <span style={{ color: '#3d4f63', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{language === 'tr' ? 'Sayfa' : 'Pages'}</span>
          <span style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${COLORS.glassBgStrong}`, borderRadius: RADIUS.sm, color: '#7a8fa6', fontSize: '0.85rem', padding: '3px 10px', fontVariantNumeric: 'tabular-nums' }}>
            {p1 - 1 === 0 ? (language === 'tr' ? 'Açılış' : 'Opening') : (p1 === p2 ? p1 - 1 : `${p1 - 1} – ${p2 - 1}`)}
          </span>
          {pageCount > 1 && (
            <span style={{ color: '#3d4f63', fontSize: '0.82rem' }}>{pageCount} {language === 'tr' ? 'sayfa' : 'pages'}</span>
          )}
        </div>
      )}

      {/* ── Stat grid ── */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {[
          { val: primaryCount, lbl: language === 'tr' ? 'ayet' : 'verses', accent: gold },
          { val: linkCount, lbl: language === 'tr' ? 'anlamsal bağ' : 'semantic links', accent: gold },
        ].map(({ val, lbl, accent }, i) => (
          <div key={i} style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: RADIUS.md, padding: '5px 6px', textAlign: 'center' }}>
            <div style={{ color: accent, fontSize: '1rem', fontWeight: 700, lineHeight: 1, letterSpacing: '-0.01em' }}>{val}</div>
            <div style={{ color: dim, fontSize: '0.68rem', marginTop: '3px', letterSpacing: '0.04em' }}>{lbl}</div>
          </div>
        ))}
      </div>

      {/* ── Ana Temalar ── */}
      {info && (
        <div style={{ marginBottom: '20px' }}>
          {divider}
          {sectionLabel('Ana Temalar', 'Main Themes')}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {(language === 'tr' ? info.themes.tr : info.themes.en).map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: '#8fa3b8', fontSize: '14px', lineHeight: 1.6 }}>
                <span style={{ color: gold, opacity: 0.4, flexShrink: 0, marginTop: '4px', fontSize: '10px' }}>◆</span>
                {t}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Güçlü Bağlantılar ── */}
      {topLinks.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          {divider}
          {sectionLabel('Güçlü Bağlantılar', 'Strong Connections')}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
            {(() => {
              const maxC = topLinks[0]?.count || 1;
              const minC = topLinks[topLinks.length - 1]?.count || 0;
              const spread = maxC - minC || 1;
              return topLinks.map(({ surah: s, count }) => {
                const pct = Math.round(15 + ((count - minC) / spread) * 85);
                return (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ flex: 1, background: COLORS.glassBg, borderRadius: RADIUS.xs, height: '5px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: `linear-gradient(to right, rgba(212,165,116,0.5), ${gold})`, width: `${pct}%`, borderRadius: RADIUS.xs }} />
                </div>
                <span style={{ color: '#8fa3b8', fontSize: '14px', whiteSpace: 'nowrap', minWidth: '80px', textAlign: 'right' }}>{s}. {surahNameTr(s)}</span>
                <span style={{ color: COLORS.slate500, fontSize: '13px', minWidth: '20px', textAlign: 'right' }}>{count}</span>
              </div>
                );
              });
            })()}
          </div>
        </div>
      )}

      {/* ── Öne Çıkan Özellikler ── */}
      {(notes || info?.fadail) && (() => {
        const noteItems = notes ? (language === 'tr' ? notes.tr : notes.en) : [];
        const fadailRaw = info?.fadail ? label(info.fadail.tr, info.fadail.en) : null;
        const [fadailText, fadailArabicInline] = fadailRaw ? fadailRaw.split('||') : [null, null];
        const fadailArabic = fadailArabicInline || info?.fadail?.arabic || null;
        const renderWithArabic = (text) => {
          const parts = text.split(/([\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]+)/g);
          return parts.map((part, j) =>
            /[\u0600-\u06FF]/.test(part)
              ? <span key={j} style={{ fontFamily: FONTS.quran, color: gold, fontWeight: 700, fontSize: '1.1rem', direction: 'rtl', unicodeBidi: 'embed' }}>{part}</span>
              : part
          );
        };
        return (
          <div>
            {divider}
            {sectionLabel('Öne Çıkan Özellikler', 'Notable Facts')}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {fadailText && (
                <div style={{ borderLeft: '2px solid rgba(212,165,116,0.25)', paddingLeft: '10px', marginBottom: '4px' }}>
                  <span style={{ color: '#b0c8de', fontSize: '14px', lineHeight: 1.6, fontStyle: 'italic' }}>{renderWithArabic(fadailText)}</span>
                  {fadailArabic && <span style={arabicStyle}>{fadailArabic}</span>}
                </div>
              )}
              {noteItems.map((note, i) => {
                const [noteText, noteArabic] = note.split('||');
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: '#b0c8de', fontSize: '14px', lineHeight: 1.6 }}>
                    <span style={{ color: gold, opacity: 0.5, flexShrink: 0, marginTop: '4px', fontSize: '0.55rem' }}>★</span>
                    <div style={{ flex: 1 }}>
                      {renderWithArabic(noteText)}
                      {noteArabic && <span style={arabicStyle}>{noteArabic}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}
    </div>
  );
}

function VerseJumpSelector({ surah, language, verses, onFocus, selectedAyah = null }) {
  const [input, setInput] = useState('');
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const total = SURAH_AYAH_COUNTS[surah - 1] || 0;

  const filteredAyahs = useMemo(() => {
    const all = Array.from({ length: total }, (_, i) => i + 1);
    if (!input) return all;
    return all.filter(n => String(n).startsWith(input));
  }, [input, total]);

  const go = (ayah) => {
    onFocus(`${surah}:${ayah}`);
    setInput('');
    setOpen(false);
  };

  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <div style={{
        display: 'flex', alignItems: 'center', height: '32px',
        background: 'rgba(255,255,255,0.04)', border: `1px solid ${COLORS.glassBorder}`,
        borderRadius: RADIUS.md, overflow: 'visible', boxSizing: 'border-box',
      }}>
        <span style={{ color: COLORS.slate600, fontSize: '0.68rem', padding: '0 6px 0 10px', whiteSpace: 'nowrap', userSelect: 'none' }}>
          {language === 'tr' ? 'Ayet' : 'Verse'}
        </span>
        <input
          ref={inputRef}
          className="qc-focus-ring"
          type="number" min={1} max={total}
          value={input}
          placeholder={selectedAyah ? `${surah}:${selectedAyah}` : `1–${total}`}
          onChange={e => { setInput(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={e => {
            if (e.key === 'Enter') { const n = parseInt(input); if (n >= 1 && n <= total) go(n); }
            if (e.key === 'Escape') { setOpen(false); inputRef.current?.blur(); }
            if (e.key === 'ArrowDown' && filteredAyahs.length > 0) { e.preventDefault(); go(filteredAyahs[0]); }
          }}
          style={{
            width: '72px', background: 'none', border: 'none', outline: 'none',
            color: COLORS.gold, fontSize: '0.82rem', padding: '0 8px 0 0',
            MozAppearance: 'textfield',
          }}
        />
      </div>

      {open && filteredAyahs.length > 0 && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', right: 0,
          background: '#07091a', border: `1px solid ${COLORS.goldAlpha15}`,
          borderRadius: RADIUS.md, overflowY: 'auto', maxHeight: '280px',
          minWidth: '220px', maxWidth: 'calc(100vw - 24px)',
          zIndex: 50, boxShadow: '0 8px 32px rgba(0,0,0,0.7)',
          scrollbarWidth: 'none',
        }}>
          {filteredAyahs.map(n => {
            const v = verses.find(vv => vv.surah === surah && vv.ayah === n);
            const text = v ? (language === 'tr' ? (cleanTr(v.turkish) || v.english) : (v.english || cleanTr(v.turkish))) : '';
            return (
              <button key={n} onClick={() => go(n)}
                style={{ display: 'flex', alignItems: 'baseline', gap: '8px', width: '100%', textAlign: 'left', padding: '7px 12px', background: 'none', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,165,116,0.08)'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                <span style={{ color: COLORS.gold, fontSize: '0.78rem', fontWeight: 700, flexShrink: 0, minWidth: '26px' }}>{n}</span>
                <span style={{ color: COLORS.slate500, fontSize: '0.7rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{text?.slice(0, 55)}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function VerseView({ verses, surah, onBack, onOpenFull3D, language, autoFocusVerseId, onSurahChange, onClose }) {
  const graphRef = useRef(null);
  const initialFitDone = useRef(false);
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [focusedNodeId, setFocusedNodeId] = useState(null);
  const [dim, setDim] = useState({ w: window.innerWidth, h: window.innerHeight - 62 });
  const [showHint, setShowHint] = useState(true);
  useEffect(() => { const t = setTimeout(() => setShowHint(false), 3000); return () => clearTimeout(t); }, []);

  const graphData = useMemo(() => buildGraphData(verses, surah, 'surah'), [verses, surah]);

  // Auto-select verse when opened from an external source (e.g. ConceptGraph).
  // Run as soon as graphData is ready — no dependency on graphRef (3D init is async).
  const autoSelectedRef = useRef(false);
  /* eslint-disable react-hooks/set-state-in-effect -- one-time auto-focus from external navigation */
  useEffect(() => {
    if (!autoFocusVerseId || autoSelectedRef.current) return;
    const node = graphData.nodes.find(n => n.id === autoFocusVerseId);
    if (!node) return;
    autoSelectedRef.current = true;
    setSelected(node);
    setFocusedNodeId(node.id);
  }, [autoFocusVerseId, graphData]);
  /* eslint-enable react-hooks/set-state-in-effect */

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
    const h = () => setDim({ w: window.innerWidth, h: window.innerHeight - 62 });
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
        scene.add(new AmbientLight(0xffffff, 0.7));
        const dir = new DirectionalLight(0xffd4a0, 1.0);
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
      controls.screenSpacePanning = true;
      controls.minDistance = 10;
      controls.maxDistance = 1200;
    }

    // Fit camera on first load (unless we have a specific verse to focus, handled separately)
    if (!initialFitDone.current) {
      initialFitDone.current = true;
      if (!autoFocusVerseId) {
        setTimeout(() => {
          graphRef.current?.zoomToFit(800, 80, node => !node.ghost);
        }, 800);
      }
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
    <div style={{ position: 'fixed', top: '62px', left: 0, right: 0, bottom: 0, zIndex: 50, background: COLORS.cosmicBlack }}>
      {/* Sûre info panel — left side; follows selected verse's surah when cross-surah */}
      <SurahInfoPanel
        surah={selected?.surah ?? surah} language={language} graphData={graphData} showName={true}
        onNavigate={onSurahChange ? (dir) => onSurahChange(Math.max(1, Math.min(114, (selected?.surah ?? surah) + dir))) : null}
      />

      {/* Header */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20,
        display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px',
        background: 'linear-gradient(to bottom, rgba(6,8,14,0.98) 60%, transparent)',
      }}>
        <button onClick={onBack}
          style={{ background: 'rgba(212,165,116,0.06)', border: `1px solid ${COLORS.goldAlpha15}`, borderRadius: RADIUS.md, color: COLORS.silver, padding: '6px 10px', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0 }}>
          ← {language === 'tr' ? 'Sûre Haritası' : 'Surahs'}
        </button>

        <div style={{ flex: 1 }} />

        <SurahDropdown value={surah} onChange={onSurahChange} language={language} allowAll={false} />

        <VerseJumpSelector surah={surah} language={language} verses={verses} onFocus={focusVerse} selectedAyah={selected?.ayah ?? null} />

        <button onClick={onOpenFull3D}
          style={{ background: 'rgba(212,165,116,0.08)', border: `1px solid ${COLORS.goldAlpha20}`, borderRadius: RADIUS.md, color: COLORS.gold, padding: '6px 12px', fontSize: '0.78rem', cursor: 'pointer' }}>
          {language === 'tr' ? '🌐 Tüm Ayet Ağı' : '🌐 Full Verse Network'}
        </button>

        {onClose && (
          <button
            onClick={onClose}
            aria-label={language === 'en' ? 'Close verse graph' : 'Ayet grafiğini kapat'}
            style={{ background: 'none', border: 'none', color: COLORS.silver, padding: '8px', cursor: 'pointer', opacity: 0.5, display: 'flex', alignItems: 'center', transition: 'opacity 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '1'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '0.5'; }}
          >
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Auto-dismissing hint badge */}
      <div style={{
        position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
        zIndex: 20, background: 'rgba(10,10,26,0.85)', border: `1px solid ${COLORS.glassBgStrong}`,
        borderRadius: RADIUS.pillSm, padding: '6px 16px', color: COLORS.slate500, fontSize: '0.7rem',
        whiteSpace: 'nowrap', pointerEvents: 'none', backdropFilter: 'blur(8px)',
        opacity: showHint ? 1 : 0, transition: 'opacity 0.8s ease',
      }}>
        {language === 'tr' ? 'Sürükle: döndür  ·  Sağ tık: kaydır  ·  Tekerlek: yakınlaştır' : 'Drag: rotate  ·  Right-drag: pan  ·  Scroll: zoom'}
      </div>

      {/* Focus mode badge */}
      {focusedNodeId && (
        <div style={{
          position: 'absolute', top: '56px', left: '50%', transform: 'translateX(-50%)',
          zIndex: 20, background: 'rgba(6,8,14,0.90)', border: `1px solid ${COLORS.goldAlpha25}`,
          borderRadius: '24px', padding: '6px 16px', display: 'flex', alignItems: 'center', gap: '12px',
          backdropFilter: 'blur(12px)', boxShadow: '0 4px 24px rgba(0,0,0,0.5), 0 0 0 1px rgba(212,165,116,0.08)',
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '7px', color: COLORS.gold, fontSize: '0.74rem' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: RADIUS.full, background: COLORS.gold, boxShadow: `0 0 6px ${COLORS.gold}`, flexShrink: 0 }} />
            <b style={{ color: COLORS.goldBright, letterSpacing: '0.02em' }}>{focusedNodeId}</b>
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
        width={selected ? Math.max(380, dim.w - 680) : dim.w} height={dim.h}
        backgroundColor={COLORS.cosmicBlack}
        d3AlphaDecay={1} d3VelocityDecay={1}
        nodeThreeObject={nodeThreeObject}
        nodeThreeObjectExtend={false}
        nodeLabel={node => `<div style="background:rgba(10,8,4,0.97);border:1px solid rgba(212,165,116,0.3);padding:6px 10px;border-radius:6px;font-size:12px;color:${COLORS.gold};max-width:220px"><b>${node.id}</b><br/><span style="color:${COLORS.silver};font-size:11px">${(language === 'tr' ? (cleanTr(node.turkish) || node.english) : (node.english || cleanTr(node.turkish)))?.slice(0, 80)}...</span></div>`}
        linkColor={linkColor}
        linkOpacity={1}
        linkWidth={link => 0.25 + (link.score - 0.55) * 2.0}
        linkDirectionalParticles={link => link.score > 0.80 ? 2 : 0}
        linkDirectionalParticleWidth={1.2}
        linkDirectionalParticleColor={() => COLORS.gold}
        linkDirectionalParticleSpeed={0.005}
        onNodeClick={handleNodeClick}
        onNodeHover={node => setHovered(node || null)}
        onBackgroundClick={() => { setFocusedNodeId(null); setSelected(null); }}
        enableNodeDrag={false}
        showNavInfo={false}
        onEngineStop={() => {
          const controls = graphRef.current?.controls?.();
          if (controls) {
            controls.screenSpacePanning = true;
            controls.zoomToCursor = true;
            controls.touches = { ONE: TOUCH.ROTATE, TWO: TOUCH.DOLLY_PAN };
            controls.mouseButtons = { LEFT: MOUSE.ROTATE, MIDDLE: MOUSE.PAN, RIGHT: MOUSE.PAN };
          }
        }}
      />

      <ZoomControls graphRef={graphRef} language={language} rightOffset={selected ? 704 : 24} />

      {selected && (
        <VersePanel node={selected} verses={verses} language={language}
          onClose={() => { setSelected(null); setFocusedNodeId(null); }} onNavigate={focusVerse} />
      )}
    </div>
  );
}

// ─── Full 3D view (all verses) ────────────────────────────────────────────────
function FullGraph({ verses, onBack, language, onClose }) {
  const graphRef = useRef(null);
  const initialFitDone = useRef(false);
  const controlsRef = useRef(null);
  const rotateTimerRef = useRef(null);
  const selectedRef = useRef(null);
  const audioRef = useRef(null);
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [focusedNodeId, setFocusedNodeId] = useState(null);
  const [filterSurah, setFilterSurah] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dim, setDim] = useState({ w: window.innerWidth, h: window.innerHeight - 62 });
  const [muted, setMuted] = useState(false);

  /* eslint-disable react-hooks/refs -- resetting fit flag when graph data recomputes is intentional */
  const graphData = useMemo(() => {
    initialFitDone.current = false;
    return buildGraphData(verses, filterSurah, filterSurah ? 'surah' : 'all');
  }, [verses, filterSurah]);
  /* eslint-enable react-hooks/refs */

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
    const h = () => setDim({ w: window.innerWidth, h: window.innerHeight - 62 });
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  useEffect(() => {
    if (!graphRef.current) return;
    const scene = graphRef.current.scene?.();
    if (scene) {
      scene.add(new AmbientLight(0xffffff, 0.6));
      const dir = new DirectionalLight(0xffd4a0, 1.2);
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
      controls.screenSpacePanning = true;
      controls.minDistance = 20;
      controls.maxDistance = 2000;
      controlsRef.current = controls;
    }
  }, [verses]);

  // Keep selectedRef in sync so rAF handler doesn't use stale closure
  useEffect(() => { selectedRef.current = selected; }, [selected]);

  // Manual auto-rotation via rAF — more reliable than OrbitControls.autoRotate
  useEffect(() => {
    let rafId;
    const SPEED = 0.005; // radians per frame (~20s per full revolution)

    const tick = () => {
      rafId = requestAnimationFrame(tick);
      if (selectedRef.current) return; // paused — node selected
      const g = graphRef.current;
      if (!g) return;
      const cam = g.camera?.();
      const ctrl = g.controls?.();
      if (!cam || !ctrl) return;
      const target = ctrl.target;
      const dx = cam.position.x - target.x;
      const dz = cam.position.z - target.z;
      const r = Math.sqrt(dx * dx + dz * dz);
      if (r < 1) return;
      const angle = Math.atan2(dz, dx) + SPEED;
      g.cameraPosition(
        { x: target.x + r * Math.cos(angle), y: cam.position.y, z: target.z + r * Math.sin(angle) },
        { x: target.x, y: target.y, z: target.z },
        0
      );
    };

    // Wait for graph to fully initialize before starting
    const initTimer = setTimeout(() => { rafId = requestAnimationFrame(tick); }, 2000);

    // Pause on pointer interaction, resume after 3s idle
    const pauseOnInteract = () => {
      cancelAnimationFrame(rafId);
      rafId = undefined;
      clearTimeout(rotateTimerRef.current);
    };
    const resumeAfterIdle = () => {
      clearTimeout(rotateTimerRef.current);
      rotateTimerRef.current = setTimeout(() => {
        if (!selectedRef.current) rafId = requestAnimationFrame(tick);
      }, 3000);
    };

    const attachListeners = () => {
      const canvas = graphRef.current?.renderer?.()?.domElement;
      if (!canvas) return;
      canvas.addEventListener('pointerdown', pauseOnInteract);
      canvas.addEventListener('pointerup', resumeAfterIdle);
      canvas._autoRotCleanup = () => {
        canvas.removeEventListener('pointerdown', pauseOnInteract);
        canvas.removeEventListener('pointerup', resumeAfterIdle);
      };
    };
    const listenerTimer = setTimeout(attachListeners, 2000);

    return () => {
      clearTimeout(initTimer);
      clearTimeout(listenerTimer);
      clearTimeout(rotateTimerRef.current);
      cancelAnimationFrame(rafId);
      graphRef.current?.renderer?.()?.domElement?._autoRotCleanup?.();
    };
  }, [verses]);

  // Audio: auto-play tilawat when rotation starts, cleanup on unmount
  useEffect(() => {
    const audio = new Audio('/audio/alak-1-5.mp3');
    audio.volume = 0.25;
    audio.preload = 'auto';
    audioRef.current = audio;

    const playTimer = setTimeout(() => {
      audio.play().catch(() => {}); // silently ignore browser autoplay block
    }, 1500);

    return () => {
      clearTimeout(playTimer);
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  // Sync mute state to audio element
  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted;
  }, [muted]);

  // filterSurah değişince selected/focused'ı temizle ve kamerayı node verilerinden hesapla
  useEffect(() => {
    setSelected(null);
    setFocusedNodeId(null);
    if (!graphRef.current || !graphData.nodes.length) return;

    // Use zoomToFit with node filter (primary only) after nodes are definitely rendered
    // padding=30 → tighter zoom so embedding clusters are more visible
    const fitTimer = setTimeout(() => {
      graphRef.current?.zoomToFit(900, 30, node => !node.ghost);
    }, 1200);

    // After zoomToFit settles, nudge the lookAt target upward so the cluster
    // drops into the visible viewport. The canvas reports full height, but
    // the fixed header overlays the top ~56px — zoomToFit centers on the raw
    // canvas so clusters with high-Y positions (e.g. Surah 31-32) end up
    // visually clipped behind the header. Offsetting the target +Y tilts the
    // camera up, which pushes content down into the usable area.
    const offsetTimer = setTimeout(() => {
      const g = graphRef.current;
      if (!g) return;
      const cam = g.camera?.();
      const ctrl = g.controls?.();
      if (!cam || !ctrl) return;
      const target = ctrl.target;
      const dist = cam.position.distanceTo(target);
      const yOffset = dist * 0.07; // ~56px at typical camera distances
      g.cameraPosition(
        { x: cam.position.x, y: cam.position.y, z: cam.position.z },
        { x: target.x, y: target.y + yOffset, z: target.z },
        400,
      );
    }, 2150); // 1200 (pre-fit) + 900 (fit duration) + 50 (settle margin)

    return () => {
      clearTimeout(fitTimer);
      clearTimeout(offsetTimer);
    };
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

  const zoomToNode = useCallback((node) => {
    if (!graphRef.current) return;
    // Build focused set: node + its direct neighbors
    const ids = new Set([node.id]);
    graphData.links.forEach(link => {
      const src = linkEndId(link.source);
      const tgt = linkEndId(link.target);
      if (src === node.id) ids.add(tgt);
      if (tgt === node.id) ids.add(src);
    });
    // zoomToFit on the focused cluster — shows node in context, not extreme closeup
    graphRef.current.zoomToFit(900, 160, n => ids.has(n.id) && !n.ghost);
  }, [graphData.links]);

  const handleNodeClick = useCallback((node) => {
    const isDeselect = node === selected;
    setSelected(isDeselect ? null : node);
    setFocusedNodeId(isDeselect ? null : node.id);
    if (!isDeselect) zoomToNode(node);
  }, [selected, zoomToNode]);

  const focusVerse = useCallback((verseId) => {
    const node = graphData.nodes.find(n => n.id === verseId);
    if (!node) return;
    setSelected(node);
    setFocusedNodeId(node.id);
    setSearchQuery('');
    zoomToNode(node);
  }, [graphData.nodes, zoomToNode]);

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
    <div style={{ position: 'fixed', top: '62px', left: 0, right: 0, bottom: 0, zIndex: 50, background: COLORS.cosmicBlack }}>
      {/* Sûre bilgi paneli — sûre filtresi aktifken veya ayet seçilince */}
      {(filterSurah || selected) && (
        <SurahInfoPanel
          surah={filterSurah ?? selected?.surah} language={language} graphData={graphData} showName={true}
          onNavigate={(dir) => setFilterSurah(s => Math.max(1, Math.min(114, (s ?? selected?.surah) + dir)))}
        />
      )}

      {/* Header */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20,
        display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 18px',
        background: 'linear-gradient(to bottom, rgba(6,8,14,0.98) 60%, transparent)',
      }}>
        <button onClick={onBack}
          style={{ background: 'rgba(212,165,116,0.06)', border: `1px solid ${COLORS.goldAlpha15}`, borderRadius: RADIUS.md, color: COLORS.silver, padding: '6px 12px', fontSize: '0.8rem', cursor: 'pointer' }}>
          ← {language === 'tr' ? 'Sûre Haritası' : 'Surahs'}
        </button>

        <span style={{ fontFamily: 'Playfair Display, serif', color: COLORS.gold, fontSize: '1.25rem', fontWeight: 700 }}>
          {language === 'tr' ? 'Ayet Haritası' : 'Verse Map'}
        </span>
        {verses && !filterSurah && (
          <span style={{ color: COLORS.silver, fontSize: '0.82rem' }}>
            {`${graphData.nodes.length} ${language === 'tr' ? 'ayet' : 'verses'} · ${graphData.links.length} ${language === 'tr' ? 'bağlantı' : 'connections'}`}
          </span>
        )}

        <div style={{ flex: 1 }} />

        {/* Search + controls row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>

        {/* Search input (only when no surah filter) or verse jump selector */}
        {filterSurah
          ? <VerseJumpSelector surah={filterSurah} language={language} verses={verses} onFocus={focusVerse} />
          : <div style={{ position: 'relative' }}>
          <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            placeholder={language === 'tr' ? 'Sûre, ayet veya kelime ara...' : 'Search surah, verse or keyword...'}
            dir="auto"
            style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${COLORS.goldAlpha20}`, borderRadius: RADIUS.md, color: COLORS.offWhite, padding: '6px 12px 6px 30px', fontSize: '0.875rem', width: '270px', outline: 'none', height: '36px', boxSizing: 'border-box' }}
          />
          <svg aria-hidden="true" style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={COLORS.gold} strokeWidth="2.5">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          {/* Hint text below search bar */}
          {!searchQuery && !selected && (
            <div style={{ position: 'absolute', top: '100%', left: '1px', marginTop: '5px', fontSize: '0.78rem', color: '#8a7355', whiteSpace: 'nowrap', pointerEvents: 'none' }}>
              {language === 'tr' ? 'örn: Bismillah · Bakara 5 · 2:286 · Fatiha · iman' : 'e.g. Bismillah · Bakara 5 · 2:286 · Fatiha · faith'}
            </div>
          )}
          {(searchResults.direct || searchResults.surahs.length > 0 || searchResults.verses.length > 0) && (
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '4px', background: '#0d1128', border: `1px solid ${COLORS.goldAlpha15}`, borderRadius: RADIUS.md, overflow: 'hidden', zIndex: 30, boxShadow: '0 8px 32px rgba(0,0,0,0.5)', minWidth: '280px' }}>
              {/* Direct verse match */}
              {searchResults.direct && (() => {
                const v = searchResults.direct;
                const vt = language === 'tr' ? (cleanTr(v.turkish) || v.english) : (v.english || cleanTr(v.turkish));
                return (
                  <button key={`direct-${v.id}`} onClick={() => { focusVerse(v.id); setSearchQuery(''); }}
                    style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%', textAlign: 'left', padding: '10px 12px', background: 'rgba(212,165,116,0.1)', border: 'none', borderBottom: `1px solid ${COLORS.goldAlpha15}`, cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,165,116,0.17)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(212,165,116,0.1)'}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: COLORS.gold, fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.05em' }}>→ AYET</span>
                      <span style={{ color: COLORS.gold, fontWeight: 700, fontSize: '0.82rem' }}>{v.id}</span>
                      <span style={{ color: COLORS.silver, fontSize: '0.75rem' }}>{surahNameTr(v.surah)}</span>
                    </div>
                    <div style={{ color: COLORS.silver, fontSize: '0.73rem', lineHeight: 1.4 }}>{vt?.slice(0, 80)}...</div>
                  </button>
                );
              })()}
              {/* Surah name matches */}
              {searchResults.surahs.map(s => (
                <button key={`surah-${s.surah}`}
                  onClick={() => { setFilterSurah(s.surah); setSearchQuery(''); }}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', textAlign: 'left', padding: '8px 12px', background: 'rgba(212,165,116,0.06)', border: 'none', borderBottom: '1px solid rgba(212,165,116,0.1)', color: COLORS.offWhite, cursor: 'pointer', fontSize: '0.76rem' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,165,116,0.12)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(212,165,116,0.06)'}>
                  <span style={{ color: COLORS.gold, fontSize: '0.7rem' }}>◈ Sûre</span>
                  <span style={{ color: COLORS.gold, fontWeight: 700 }}>{s.surah}. {s.name}</span>
                </button>
              ))}
              {/* Verse content matches */}
              {searchResults.verses.map(v => (
                <button key={v.id} onClick={() => { focusVerse(v.id); setSearchQuery(''); }}
                  style={{ display: 'block', width: '100%', textAlign: 'left', padding: '7px 12px', background: 'none', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.04)', color: COLORS.offWhite, cursor: 'pointer', fontSize: '0.76rem' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,165,116,0.08)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                  <span style={{ color: COLORS.gold, marginRight: '6px', fontWeight: 600 }}>{v.id}</span>
                  <span style={{ color: COLORS.silver }}>{(language === 'tr' ? (cleanTr(v.turkish) || v.english) : (v.english || cleanTr(v.turkish)))?.slice(0, 50)}...</span>
                </button>
              ))}
            </div>
          )}
        </div>}

        {/* Surah filter */}
        <SurahDropdown value={filterSurah} onChange={setFilterSurah} language={language} allowAll={true} />

        {(() => {
          const canClear = !!(searchQuery || filterSurah || selected || focusedNodeId);
          return (
            <button
              onClick={() => { setSearchQuery(''); setFilterSurah(null); setSelected(null); setFocusedNodeId(null); graphRef.current?.zoomToFit(800); }}
              disabled={!canClear}
              style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${COLORS.glassBorder}`, borderRadius: RADIUS.md, color: canClear ? COLORS.silver : '#3a4150', padding: '0 14px', fontSize: '0.82rem', cursor: canClear ? 'pointer' : 'default', height: '36px', boxSizing: 'border-box', opacity: canClear ? 1 : 0.4, transition: 'opacity 0.2s, color 0.2s' }}
              onMouseEnter={e => { if (canClear) { e.currentTarget.style.color = COLORS.offWhite; e.currentTarget.style.background = COLORS.glassBorder; } }}
              onMouseLeave={e => { e.currentTarget.style.color = canClear ? COLORS.silver : '#3a4150'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}>
              {language === 'tr' ? 'Temizle' : 'Clear'}
            </button>
          );
        })()}

        {onClose && (
          <button
            onClick={onClose}
            aria-label={language === 'en' ? 'Close verse graph' : 'Ayet grafiğini kapat'}
            style={{ background: 'none', border: 'none', color: COLORS.silver, padding: '8px', cursor: 'pointer', opacity: 0.5, display: 'flex', alignItems: 'center', transition: 'opacity 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '1'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '0.5'; }}
          >
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
        </div>
      </div>

      {/* Small surah: show verse list instead of graph */}
      {filterSurah && graphData.nodes.filter(n => !n.ghost).length < 30 && !selected && (
        <div style={{
          position: 'absolute', top: '54px', left: 0, bottom: 0,
          width: dim.w - 680, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: '8px',
          padding: '24px', overflowY: 'auto',
        }}>
          <div style={{ color: COLORS.gold, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '8px', opacity: 0.7 }}>
            {surahNameTr(filterSurah)} — {graphData.nodes.filter(n => !n.ghost).length} {language === 'tr' ? 'ayet' : 'verses'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', maxWidth: '480px' }}>
            {graphData.nodes.filter(n => !n.ghost).map(node => (
              <button key={node.id} onClick={() => handleNodeClick(node)}
                style={{ background: COLORS.goldAlpha04, border: '1px solid rgba(212,165,116,0.12)', borderRadius: RADIUS.chip, padding: '12px 16px', textAlign: 'right', cursor: 'pointer', transition: `all ${TRANSITION.fast}` }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,165,116,0.1)'; e.currentTarget.style.borderColor = 'rgba(212,165,116,0.3)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = COLORS.goldAlpha04; e.currentTarget.style.borderColor = 'rgba(212,165,116,0.12)'; }}>
                <div style={{ fontFamily: FONTS.quran, fontSize: '1.4rem', lineHeight: 2, color: COLORS.goldWarm, direction: 'rtl' }}>{cleanArabicForGraph(node.arabic)}</div>
                <div style={{ color: '#7a6a50', fontSize: '0.72rem', marginTop: '4px', textAlign: 'left' }}>{node.id}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      <ForceGraph3D
        ref={graphRef}
        graphData={graphData}
        width={selected ? dim.w - 680 : dim.w} height={dim.h}
        backgroundColor={COLORS.cosmicBlack}
        d3AlphaDecay={1} d3VelocityDecay={1}
        warmupTicks={0} cooldownTicks={10}
        nodeThreeObject={nodeThreeObject}
        nodeThreeObjectExtend={false}
        nodeLabel={node => `<div style="background:rgba(10,8,4,0.97);border:1px solid rgba(212,165,116,0.3);padding:6px 10px;border-radius:6px;font-size:12px;color:${COLORS.gold};max-width:220px"><b>${node.id}</b> — ${surahNameTr(node.surah)}<br/><span style="color:${COLORS.silver};font-size:11px">${(language === 'tr' ? (cleanTr(node.turkish) || node.english) : (node.english || cleanTr(node.turkish)))?.slice(0, 80)}...</span></div>`}
        linkColor={linkColor}
        linkOpacity={1}
        linkWidth={linkWidth}
        linkDirectionalParticles={link => (!focusedSet && link.score > 0.80) ? 2 : 0}
        linkDirectionalParticleWidth={1.2}
        linkDirectionalParticleColor={() => COLORS.gold}
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
          const controls = graphRef.current?.controls?.();
          if (controls) {
            controls.screenSpacePanning = true;
            controls.zoomToCursor = true;
            controls.touches = { ONE: TOUCH.ROTATE, TWO: TOUCH.DOLLY_PAN };
            controls.mouseButtons = { LEFT: MOUSE.ROTATE, MIDDLE: MOUSE.PAN, RIGHT: MOUSE.PAN };
          }
        }}
      />

      <ZoomControls graphRef={graphRef} language={language} />

      {/* Mekkî / Medenî legend + mute button */}
      <div style={{
        position: 'absolute', bottom: '24px', left: '20px', zIndex: 25,
        display: 'flex', alignItems: 'flex-end', gap: '8px',
      }}>
        <div style={{
          display: 'flex', flexDirection: 'column', gap: '5px',
          background: 'rgba(5,5,16,0.72)', backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.07)', borderRadius: RADIUS.md,
          padding: '8px 12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: RADIUS.full, background: '#c9a227', flexShrink: 0 }} />
            <span style={{ color: COLORS.silver, fontSize: '0.72rem', fontFamily: 'Inter, sans-serif' }}>
              {language === 'tr' ? 'Mekkî' : 'Meccan'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: RADIUS.full, background: '#2ecc71', flexShrink: 0 }} />
            <span style={{ color: COLORS.silver, fontSize: '0.72rem', fontFamily: 'Inter, sans-serif' }}>
              {language === 'tr' ? 'Medenî' : 'Medinan'}
            </span>
          </div>
        </div>

        {/* Mute / unmute tilawat */}
        <button
          onClick={() => setMuted(m => !m)}
          title={muted ? (language === 'tr' ? 'Sesi aç' : 'Unmute') : (language === 'tr' ? 'Sesi kapat' : 'Mute')}
          aria-label={muted ? (language === 'tr' ? 'Tilâvet sesini aç' : 'Unmute recitation') : (language === 'tr' ? 'Tilâvet sesini kapat' : 'Mute recitation')}
          style={{
            width: '34px', height: '34px',
            background: 'rgba(5,5,16,0.72)', backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.07)', borderRadius: RADIUS.md,
            color: muted ? COLORS.slate600 : '#c9a227',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: `all ${TRANSITION.fast}`, flexShrink: 0,
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,162,39,0.35)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
        >
          {muted ? (
            <VolumeOffIcon size={15} />
          ) : (
            <VolumeOnIcon size={15} />
          )}
        </button>
      </div>

      {/* Focus mode badge */}
      {focusedNodeId && (
        <div style={{
          position: 'absolute', bottom: '72px', left: '50%', transform: 'translateX(-50%)',
          zIndex: 20, background: 'rgba(6,8,14,0.90)', border: `1px solid ${COLORS.goldAlpha25}`,
          borderRadius: '24px', padding: '6px 16px', display: 'flex', alignItems: 'center', gap: '12px',
          backdropFilter: 'blur(12px)', boxShadow: '0 4px 24px rgba(0,0,0,0.5), 0 0 0 1px rgba(212,165,116,0.08)',
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '7px', color: COLORS.gold, fontSize: '0.74rem' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: RADIUS.full, background: COLORS.gold, boxShadow: `0 0 6px ${COLORS.gold}`, flexShrink: 0 }} />
            <b style={{ color: COLORS.goldBright, letterSpacing: '0.02em' }}>{focusedNodeId}</b>
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
// D-8: Mobil cihazlarda Three.js (FullGraph + VerseView) OOM crash veriyor.
// Mobile detect → 'verses' ve '3d' view'larına geçişi engelle, ReadingMode'a
// yönlendir (F-5 entegrasyonu, Tefsir paneli + tilavet zaten mobile-friendly).
const IS_MOBILE_3D_BLOCKED = typeof window !== 'undefined' && window.innerWidth < 640;

export default function VerseGraph({ onClose, initialSearch = '', onRegisterBackHandler = null }) {
  const { language } = useLanguage();
  // If opened with a specific verse to find (e.g. from ConceptGraph), always start at clusters
  // so ClusterView can parse initialSearch and call onSelectVerse → sets autoFocusVerseId.
  // Otherwise restore last view from localStorage; desktop default = '3d' (immersive
  // rotating verse network + Alaq 96:1-5 audio autoplay); mobile default = 'clusters'
  // via IS_MOBILE_3D_BLOCKED guard (3D crashes on many mobile GPUs).
  const [view, setView] = useState(() => {
    if (IS_MOBILE_3D_BLOCKED) return 'clusters';
    return initialSearch ? 'clusters' : (localStorage.getItem('qurancodex_graph_view_v2') || '3d');
  });
  const [pendingSearch, setPendingSearch] = useState(initialSearch);
  const [selectedSurah, setSelectedSurah] = useState(() => {
    const s = parseInt(localStorage.getItem('qurancodex_graph_surah'));
    return isNaN(s) ? null : s;
  });
  const [autoFocusVerseId, setAutoFocusVerseId] = useState(null);
  const [verses, setVerses] = useState(null);
  const [surahClusters, setSurahClusters] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch('/verse-graph-bgem3.json').then(r => { if (!r.ok) throw new Error('verse-graph.json not found.'); return r.json(); }),
      fetch('/surah-clusters.json').then(r => r.ok ? r.json() : null).catch(() => null),
    ])
      .then(([verseData, clusterData]) => {
        setVerses(verseData);
        setSurahClusters(clusterData);
        setLoading(false);

        // Handle ?verse=2:255 URL parameter — auto-navigate to that verse
        const urlVerse = new URLSearchParams(window.location.search).get('verse');
        if (urlVerse) {
          const [surahStr, ayahStr] = urlVerse.split(':');
          const surah = parseInt(surahStr);
          if (!isNaN(surah)) {
            // D-8: Mobil 3D crash guard — verses view yerine ReadingMode aç
            if (IS_MOBILE_3D_BLOCKED) {
              window.dispatchEvent(new CustomEvent('openReadingMode', {
                detail: { surah, ayah: ayahStr ? parseInt(ayahStr) : null },
              }));
              const url = new URL(window.location.href);
              url.searchParams.delete('verse');
              window.history.replaceState({}, '', url.toString());
              onClose();
              return;
            }
            setSelectedSurah(surah);
            setAutoFocusVerseId(urlVerse);
            setView('verses');
            // Clean up URL without reload
            const url = new URL(window.location.href);
            url.searchParams.delete('verse');
            window.history.replaceState({}, '', url);
          }
        }
      })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  // Persist view + surah to localStorage
  useEffect(() => {
    localStorage.setItem('qurancodex_graph_view_v2', view);
  }, [view]);

  useEffect(() => {
    if (selectedSurah) localStorage.setItem('qurancodex_graph_surah', String(selectedSurah));
    else localStorage.removeItem('qurancodex_graph_surah');
  }, [selectedSurah]);

  useEffect(() => {
    const h = (e) => {
      if (e.key !== 'Escape') return;
      if (view === 'clusters') onClose();
      else if (initialSearch) onClose(); // came from external: skip ClusterView, go straight back
      else setView('clusters');
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose, view, initialSearch]);

  // Register a back-button interceptor with Navbar when in surah detail view
  useEffect(() => {
    if (!onRegisterBackHandler) return;
    if (view === 'verses') {
      onRegisterBackHandler(() => {
        setAutoFocusVerseId(null);
        // If opened from external source (e.g. ConceptGraph via initialSearch),
        // go directly back to caller instead of stopping at ClusterView
        if (initialSearch) {
          onClose();
        } else {
          setView('clusters');
        }
      });
    } else {
      onRegisterBackHandler(null);
    }
    return () => { onRegisterBackHandler(null); };
  }, [view, onRegisterBackHandler, initialSearch, onClose]);

  if (loading) return (
    <div style={{ position: 'fixed', top: '62px', left: 0, right: 0, bottom: 0, zIndex: 50, background: COLORS.cosmicBlack, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
      <div style={{ width: '44px', height: '44px', border: '2px solid rgba(212,165,116,0.15)', borderTopColor: COLORS.gold, borderRadius: RADIUS.full, animation: 'spin 1s linear infinite' }} />
      <span style={{ color: COLORS.silver, fontSize: '0.85rem' }}>{language === 'tr' ? 'Harita yükleniyor...' : 'Loading map...'}</span>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (error) return (
    <div style={{ position: 'fixed', top: '62px', left: 0, right: 0, bottom: 0, zIndex: 50, background: COLORS.cosmicBlack, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '12px', padding: '40px' }}>
      <span style={{ color: '#e74c3c', fontSize: '1rem', fontWeight: 600 }}>Veri Bulunamadı</span>
      <span style={{ color: COLORS.slate500, fontSize: '0.82rem', textAlign: 'center', maxWidth: '480px' }}>{error}</span>
    </div>
  );

  // D-8: Mobil 3D crash guard — surah/verse seçimi mobile'da ReadingMode açar
  // (F-5 entegrasyonu, Tefsir paneli + tilavet zaten mobile-friendly).
  // Desktop: 3D view'ları normal çalışır.
  const handleSelectSurah = (surah) => {
    if (IS_MOBILE_3D_BLOCKED) {
      window.dispatchEvent(new CustomEvent('openReadingMode', { detail: { surah } }));
      onClose();
      return;
    }
    setSelectedSurah(surah);
    setAutoFocusVerseId(null);
    setView('verses');
  };
  const handleSelectVerse = (verse) => {
    if (IS_MOBILE_3D_BLOCKED) {
      const ayah = parseInt(String(verse.id).split(':')[1]);
      window.dispatchEvent(new CustomEvent('openReadingMode', { detail: { surah: verse.surah, ayah } }));
      onClose();
      return;
    }
    setSelectedSurah(verse.surah);
    setAutoFocusVerseId(verse.id);
    setView('verses');
  };
  const handleOpenFullGraph = () => {
    if (IS_MOBILE_3D_BLOCKED) {
      // ClusterView buton zaten `hidden sm:flex` ile gizli; bu silent guard
      // edge case için (örn. event dispatch dışarıdan).
      console.warn('[VerseGraph] FullGraph (3D) mobile cihazlarda devre dışı (Three.js OOM).');
      return;
    }
    setView('3d');
  };

  if (view === 'clusters') return (
    <ClusterView
      verses={verses} surahClusters={surahClusters} language={language}
      onSelectSurah={handleSelectSurah}
      onSelectVerse={handleSelectVerse}
      onClose={onClose}
      onOpenFullGraph={handleOpenFullGraph}
      initialSearch={pendingSearch}
      onSearchConsumed={() => setPendingSearch('')}
    />
  );

  if (view === 'verses') return (
    <VerseView
      key={selectedSurah}
      verses={verses} surah={selectedSurah} language={language}
      autoFocusVerseId={autoFocusVerseId}
      onBack={() => { setAutoFocusVerseId(null); setView('clusters'); }}
      onOpenFull3D={() => setView('3d')}
      onSurahChange={(n) => setSelectedSurah(n)}
      onClose={onClose}
    />
  );

  return (
    <FullGraph
      verses={verses} language={language}
      onBack={() => setView('clusters')}
      onClose={onClose}
    />
  );
}

// ─── Audio player for a single verse ─────────────────────────────────────────
// Tries selected reciter on everyayah + qurancdn, then falls back through
// remaining reciters in the standard chain.
function VerseAudioPlayer({ surah, ayah, language }) {
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const audioRef = useRef(null);
  const liveRef = useRef(false);

  const reciters = [
    { id: 'Alafasy_128kbps',              labelTr: 'Meşarî Raşid', labelEn: 'Mishary Alafasy' },
    { id: 'Abdul_Basit_Murattal_192kbps', labelTr: 'Abdülbasit',   labelEn: 'Abdul Basit'    },
    { id: 'Ghamadi_40kbps',               labelTr: 'Sa\'d el-Gamidi', labelEn: 'Saad Al-Ghamdi' },
  ];
  const [reciterIdx, setReciterIdx] = useState(0);

  const stopAudio = useCallback(() => {
    liveRef.current = false;
    const a = audioRef.current;
    if (a) { a.onerror = null; a.onended = null; a.pause(); audioRef.current = null; }
    setPlaying(false);
    setLoading(false);
  }, []);

  // Reset when verse changes
  useEffect(() => { stopAudio(); setError(false); }, [surah, ayah, stopAudio]);

  // Cleanup on unmount
  useEffect(() => () => stopAudio(), [stopAudio]);

  /* eslint-disable react-hooks/immutability -- recursive callback; tryUrl is defined by the time the inner callbacks execute */
  const tryUrl = useCallback((urls, urlIdx) => {
    if (!liveRef.current) return;
    if (urlIdx >= urls.length) {
      liveRef.current = false;
      setError(true); setLoading(false); setPlaying(false);
      return;
    }
    const audio = new Audio(urls[urlIdx]);
    audioRef.current = audio;
    audio.onended = () => { if (audioRef.current === audio) { liveRef.current = false; setPlaying(false); setLoading(false); } };
    audio.onerror = () => {
      if (audioRef.current !== audio) return;
      audio.onerror = null; audio.onended = null;
      tryUrl(urls, urlIdx + 1);
    };
    audio.play()
      .then(() => { if (audioRef.current === audio) { setPlaying(true); setLoading(false); } })
      .catch(err => {
        if (err?.name === 'AbortError') return;
        if (audioRef.current !== audio) return;
        tryUrl(urls, urlIdx + 1);
      });
  }, []);
  /* eslint-enable react-hooks/immutability */

  const togglePlay = () => {
    if (playing || loading) {
      stopAudio();
    } else {
      stopAudio();
      setError(false);
      setLoading(true);
      liveRef.current = true;
      const urls = buildFallbackUrlsFromReciter(reciters[reciterIdx].id, surah, ayah);
      tryUrl(urls, 0);
    }
  };

  const switchReciter = (idx) => {
    stopAudio();
    setReciterIdx(idx);
    setError(false);
  };

  const gold = COLORS.gold;
  const reciter = reciters[reciterIdx];

  return (
    <div style={{
      background: 'rgba(212,165,116,0.06)', border: '1px solid rgba(212,165,116,0.18)',
      borderRadius: RADIUS.chip, padding: '12px 14px',
      display: 'flex', flexDirection: 'column', gap: '8px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Play / pause button */}
        <button
          onClick={error ? undefined : togglePlay}
          disabled={error}
          style={{
            width: '36px', height: '36px', borderRadius: RADIUS.full, flexShrink: 0,
            background: error ? 'rgba(100,116,139,0.08)' : playing ? COLORS.goldAlpha25 : 'rgba(212,165,116,0.12)',
            border: `1px solid ${error ? 'rgba(100,116,139,0.2)' : playing ? 'rgba(212,165,116,0.6)' : 'rgba(212,165,116,0.3)'}`,
            color: error ? COLORS.slate600 : gold,
            cursor: error ? 'not-allowed' : 'pointer',
            opacity: error ? 0.5 : 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.9rem', transition: `all ${TRANSITION.base}`,
            boxShadow: playing ? '0 0 12px rgba(212,165,116,0.25)' : 'none',
          }}>
          {loading ? <span style={{ fontSize: '0.6rem', color: COLORS.silver }}>…</span>
            : playing ? '❙❙' : '▶'}
        </button>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: error ? COLORS.slate600 : gold, fontSize: '0.75rem', fontWeight: 600 }}>
            {language === 'tr' ? reciter.labelTr : reciter.labelEn}
          </div>
          <div style={{ color: '#7a90a8', fontSize: '0.68rem', marginTop: '1px' }}>
            {error
              ? (language === 'tr' ? 'Ses yüklenemedi' : 'Could not load audio')
              : (playing
                  ? (language === 'tr' ? 'Dinleniyor…' : 'Playing…')
                  : (language === 'tr' ? 'Tilaveti dinle' : 'Listen to recitation')
                )
            }
          </div>
        </div>

        {/* Reciter selector — prev/next arrows */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
          <button onClick={() => switchReciter((reciterIdx - 1 + reciters.length) % reciters.length)} style={{
            background: 'transparent', border: `1px solid ${COLORS.goldAlpha20}`, borderRadius: RADIUS.full,
            color: COLORS.silver, fontSize: '0.7rem', width: '22px', height: '22px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0,
          }}>‹</button>
          <span style={{ color: gold, fontSize: '0.65rem', fontWeight: 600, whiteSpace: 'nowrap', minWidth: '72px', textAlign: 'center' }}>
            {language === 'tr' ? reciter.labelTr : reciter.labelEn}
          </span>
          <button onClick={() => switchReciter((reciterIdx + 1) % reciters.length)} style={{
            background: 'transparent', border: `1px solid ${COLORS.goldAlpha20}`, borderRadius: RADIUS.full,
            color: COLORS.silver, fontSize: '0.7rem', width: '22px', height: '22px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0,
          }}>›</button>
        </div>
      </div>
    </div>
  );
}

// ─── Share modal ──────────────────────────────────────────────────────────────
function ShareModal({ node, language, onClose }) {
  const [copied, setCopied] = useState(false);
  const vt = language === 'tr' ? (cleanTr(node.turkish) || node.english) : (node.english || cleanTr(node.turkish));
  const surahName = surahNameTr(node.surah);
  const ref = `— ${surahName}, ${node.id}`;

  const shareText = `${node.arabic}\n\n"${vt}"\n${ref}`;
  const shareUrl = `${window.location.origin}${window.location.pathname}?verse=${node.id}`;

  const copyText = async () => {
    await navigator.clipboard.writeText(shareText + '\n\n' + shareUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const nativeShare = async () => {
    if (!navigator.share) return;
    await navigator.share({ title: `Kur'an — ${node.id}`, text: shareText, url: shareUrl }).catch(() => {});
  };

  const gold = COLORS.gold;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 10100,
      background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'rgba(8,10,22,0.99)', border: `1px solid ${COLORS.goldAlpha20}`,
        borderRadius: '16px', padding: '24px', maxWidth: '480px', width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
      }}>
        {/* Preview card */}
        <div style={{
          background: 'linear-gradient(135deg, #0a0c1e, #0d1028)',
          border: `1px solid ${COLORS.goldAlpha25}`, borderRadius: RADIUS.lg,
          padding: '24px 20px', marginBottom: '16px', position: 'relative', overflow: 'hidden',
        }}>
          {/* Decorative corner */}
          <div style={{ position: 'absolute', top: 0, right: 0, width: '80px', height: '80px', background: 'radial-gradient(circle at 100% 0%, rgba(212,165,116,0.12), transparent 70%)', pointerEvents: 'none' }} />

          <div style={{ fontFamily: FONTS.quran, fontSize: '1.6rem', lineHeight: 2.2, color: COLORS.goldBright, textAlign: 'right', direction: 'rtl', marginBottom: '16px' }}>
            {cleanArabicForGraph(node.arabic)}
          </div>
          <div style={{ color: '#c8c5c0', fontSize: '0.88rem', lineHeight: 1.8, borderLeft: '2px solid rgba(212,165,116,0.3)', paddingLeft: '12px', marginBottom: '12px' }}>
            "{vt}"
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: gold, fontSize: '0.72rem', fontWeight: 700 }}>{ref}</span>
            <span style={{ color: '#2d3748', fontSize: '0.65rem' }}>qurancodex.com</span>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button onClick={copyText} style={{
            flex: 1, background: copied ? 'rgba(46,204,113,0.15)' : 'rgba(212,165,116,0.1)',
            border: `1px solid ${copied ? 'rgba(46,204,113,0.4)' : COLORS.goldAlpha25}`,
            borderRadius: RADIUS.md, color: copied ? '#2ecc71' : gold,
            padding: '10px 16px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, transition: `all ${TRANSITION.base}`,
          }}>
            {copied ? '✓ Kopyalandı' : '⎘ Metni Kopyala'}
          </button>

          {typeof navigator !== 'undefined' && navigator.share && (
            <button onClick={nativeShare} style={{
              flex: 1, background: 'rgba(52,152,219,0.1)',
              border: '1px solid rgba(52,152,219,0.25)',
              borderRadius: RADIUS.md, color: '#3498db',
              padding: '10px 16px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600,
            }}>
              ↗ {language === 'tr' ? 'Paylaş' : 'Share'}
            </button>
          )}

          <button
            onClick={onClose}
            aria-label={language === 'en' ? 'Close panel' : 'Paneli kapat'}
            style={{
              background: 'rgba(255,255,255,0.04)', border: `1px solid ${COLORS.glassBgStrong}`,
              borderRadius: RADIUS.md, color: COLORS.slate500,
              padding: '10px 12px', cursor: 'pointer', fontSize: '0.8rem',
            }}
          >✕</button>
        </div>
      </div>
    </div>
  );
}

// ─── Verse detail panel ───────────────────────────────────────────────────────
function VersePanel({ node, verses, language, onClose, onNavigate }) {
  const [expandedId, setExpandedId] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [showContext, setShowContext] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const PREVIEW_COUNT = 5;

  const connections = useMemo(() => {
    if (!verses || !node.connections) return [];
    return node.connections
      .map(c => ({ ...c, verse: verses.find(v => v.id === c.id) }))
      .filter(c => c.verse)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  }, [node, verses]);

  // Context: previous & next 2 verses in same surah
  const contextVerses = useMemo(() => {
    if (!verses) return { prev: [], next: [] };
    const surahVerses = verses.filter(v => v.surah === node.surah).sort((a, b) => a.ayah - b.ayah);
    const idx = surahVerses.findIndex(v => v.id === node.id);
    return {
      prev: idx > 0 ? surahVerses.slice(Math.max(0, idx - 2), idx) : [],
      next: idx >= 0 ? surahVerses.slice(idx + 1, idx + 3) : [],
    };
  }, [node, verses]);

  const visibleConnections = showAll ? connections : connections.slice(0, PREVIEW_COUNT);

  const vt = (v) => language === 'tr' ? (cleanTr(v.turkish) || v.english) : (v.english || cleanTr(v.turkish));

  const totalAyahs = SURAH_AYAH_COUNTS[node.surah - 1] || 0;
  const hasPrev = node.ayah > 1;
  const hasNext = node.ayah < totalAyahs;
  const navBtnStyle = (enabled) => ({
    background: 'transparent',
    border: `1px solid ${enabled ? 'rgba(212,165,116,0.3)' : 'rgba(212,165,116,0.1)'}`,
    borderRadius: RADIUS.full, color: enabled ? COLORS.gold : 'rgba(212,165,116,0.18)',
    cursor: enabled ? 'pointer' : 'default',
    fontSize: '1.1rem', width: '32px', height: '32px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, transition: `all ${TRANSITION.base}`,
  });

  return (
    <div style={{
      position: 'absolute', top: '54px', right: '0', left: 'auto', bottom: '0',
      width: 'min(680px, 100%)', boxSizing: 'border-box', zIndex: 20,
      background: 'rgba(8,10,18,0.97)', backdropFilter: 'blur(28px)',
      borderLeft: '1px solid rgba(212,165,116,0.18)', borderTop: '1px solid rgba(212,165,116,0.12)',
      borderRadius: '14px 0 0 0',
      overflowY: 'auto', overflowX: 'hidden', padding: 'clamp(12px, 3vw, 20px) clamp(12px, 3vw, 20px)',
      display: 'flex', flexDirection: 'column', gap: '14px',
      boxShadow: '-8px 0 40px rgba(0,0,0,0.6), inset 1px 0 0 rgba(212,165,116,0.06)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Prev / Next ayah navigation */}
          <button
            disabled={!hasPrev} onClick={() => hasPrev && onNavigate(`${node.surah}:${node.ayah - 1}`)}
            style={navBtnStyle(hasPrev)}
            onMouseEnter={e => { if (hasPrev) { e.currentTarget.style.background = 'rgba(212,165,116,0.1)'; e.currentTarget.style.borderColor = 'rgba(212,165,116,0.5)'; }}}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = hasPrev ? 'rgba(212,165,116,0.3)' : 'rgba(255,255,255,0.06)'; }}
          >‹</button>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
              <span style={{ color: COLORS.gold, fontWeight: 700, fontSize: '1.1rem' }}>{surahNameTr(node.surah)}</span>
              <span style={{ color: '#c9a227', fontWeight: 800, fontSize: '1rem', letterSpacing: '0.02em' }}>{node.id}</span>
            </div>
            {connections.length > 0 && (
              <div style={{ marginTop: '5px' }}>
                <span style={{ background: 'rgba(201,162,39,0.15)', border: '1px solid rgba(201,162,39,0.5)', borderRadius: RADIUS.chip, color: '#e8c84a', fontSize: '0.75rem', fontWeight: 700, padding: '3px 11px', letterSpacing: '0.02em' }}>
                  {connections.length} {language === 'tr' ? 'benzer ayet' : 'similar verses'}
                </span>
              </div>
            )}
          </div>
          <button
            disabled={!hasNext} onClick={() => hasNext && onNavigate(`${node.surah}:${node.ayah + 1}`)}
            style={navBtnStyle(hasNext)}
            onMouseEnter={e => { if (hasNext) { e.currentTarget.style.background = 'rgba(212,165,116,0.1)'; e.currentTarget.style.borderColor = 'rgba(212,165,116,0.5)'; }}}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = hasNext ? 'rgba(212,165,116,0.3)' : 'rgba(255,255,255,0.06)'; }}
          >›</button>
        </div>
        <div style={{ display: 'flex', gap: '5px' }}>
          <button onClick={() => setShareOpen(true)}
            style={{ background: 'rgba(212,165,116,0.07)', border: `1px solid ${COLORS.goldAlpha20}`, borderRadius: RADIUS.sm, color: COLORS.gold, cursor: 'pointer', fontSize: '0.72rem', padding: '3px 9px' }}>
            ↗ {language === 'tr' ? 'Paylaş' : 'Share'}
          </button>
          <button
            onClick={onClose}
            aria-label={language === 'en' ? 'Close verse detail' : 'Ayet detayını kapat'}
            style={{ background: COLORS.glassBg, border: `1px solid ${COLORS.glassBgStrong}`, borderRadius: RADIUS.sm, color: COLORS.slate500, cursor: 'pointer', fontSize: '0.8rem', padding: '3px 8px' }}
          >✕</button>
        </div>
      </div>

      {shareOpen && <ShareModal node={node} language={language} onClose={() => setShareOpen(false)} />}

      <div style={{ fontFamily: FONTS.quran, fontSize: 'clamp(1.1rem, 4vw, 1.55rem)', lineHeight: 1.9, color: COLORS.goldWarm, textAlign: 'right', direction: 'rtl', padding: 'clamp(10px, 2.5vw, 14px) clamp(10px, 2.5vw, 18px)', background: 'linear-gradient(135deg, rgba(212,165,116,0.08), rgba(180,130,70,0.03))', borderRadius: RADIUS.chip, border: `1px solid ${COLORS.goldAlpha15}` }}>
        {cleanArabicForGraph(node.arabic)}
      </div>

      <div style={{ color: '#c8c5c0', fontSize: '0.92rem', lineHeight: 1.85, borderLeft: '2px solid rgba(212,165,116,0.3)', paddingLeft: '14px' }}>
        {vt(node)}
      </div>

      {/* Context verses */}
      {(contextVerses.prev.length > 0 || contextVerses.next.length > 0) && (
        <div>
          <button
            onClick={() => setShowContext(v => !v)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: showContext ? 'rgba(52,152,219,0.08)' : 'rgba(52,152,219,0.04)',
              border: `1px solid ${showContext ? 'rgba(52,152,219,0.4)' : 'rgba(52,152,219,0.2)'}`,
              borderRadius: RADIUS.md, padding: '7px 12px', cursor: 'pointer', width: '100%', textAlign: 'left',
              transition: `all ${TRANSITION.base}`,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(52,152,219,0.12)'; e.currentTarget.style.borderColor = 'rgba(52,152,219,0.5)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = showContext ? 'rgba(52,152,219,0.08)' : 'rgba(52,152,219,0.04)'; e.currentTarget.style.borderColor = showContext ? 'rgba(52,152,219,0.4)' : 'rgba(52,152,219,0.2)'; }}
          >
            <span style={{ color: '#3498db', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.06em' }}>
              {language === 'tr' ? 'Siyak-Sibak' : 'Context'}
            </span>
            <span style={{ color: '#3498db', opacity: 0.5, fontSize: '0.62rem', fontStyle: 'italic', fontWeight: 400 }}>
              {language === 'tr' ? '(bağlam)' : ''}
            </span>
            <span style={{ color: '#3498db', fontSize: '0.7rem', marginLeft: 'auto', opacity: 0.7 }}>{showContext ? '▲' : '▼'}</span>
          </button>
          {showContext && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '8px' }}>
              {contextVerses.prev.map(v => (
                <button key={v.id} onClick={() => onNavigate(v.id)} style={{
                  background: 'rgba(52,152,219,0.04)', border: '1px solid rgba(52,152,219,0.12)',
                  borderRadius: RADIUS.md, padding: '10px 13px', textAlign: 'left', cursor: 'pointer',
                  transition: `all ${TRANSITION.fast}`,
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(52,152,219,0.1)'; e.currentTarget.style.borderColor = 'rgba(52,152,219,0.3)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(52,152,219,0.04)'; e.currentTarget.style.borderColor = 'rgba(52,152,219,0.12)'; }}>
                  <span style={{ color: '#3498db', fontSize: '0.72rem', marginRight: '8px', opacity: 0.7 }}>{v.id}</span>
                  <span style={{ color: '#b0c4d8', fontSize: '0.84rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{vt(v)}</span>
                </button>
              ))}
              {/* Current verse marker */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '3px 12px' }}>
                <div style={{ height: '1px', flex: 1, background: COLORS.goldAlpha25 }} />
                <span style={{ color: COLORS.gold, fontSize: '0.68rem', whiteSpace: 'nowrap' }}>◈ {node.id}</span>
                <div style={{ height: '1px', flex: 1, background: COLORS.goldAlpha25 }} />
              </div>
              {contextVerses.next.map(v => (
                <button key={v.id} onClick={() => onNavigate(v.id)} style={{
                  background: 'rgba(52,152,219,0.04)', border: '1px solid rgba(52,152,219,0.12)',
                  borderRadius: RADIUS.md, padding: '10px 13px', textAlign: 'left', cursor: 'pointer',
                  transition: `all ${TRANSITION.fast}`,
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(52,152,219,0.1)'; e.currentTarget.style.borderColor = 'rgba(52,152,219,0.3)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(52,152,219,0.04)'; e.currentTarget.style.borderColor = 'rgba(52,152,219,0.12)'; }}>
                  <span style={{ color: '#3498db', fontSize: '0.72rem', marginRight: '8px', opacity: 0.7 }}>{v.id}</span>
                  <span style={{ color: '#b0c4d8', fontSize: '0.84rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{vt(v)}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div style={{ height: '1px', background: 'linear-gradient(to right, rgba(212,165,116,0.15), transparent)' }} />

      {connections.length > 0 && (
        <div>
          <div style={{ color: COLORS.gold, fontSize: '0.7rem', fontWeight: 700, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.8 }}>
            {language === 'tr' ? `En Benzer ${connections.length} Ayet` : `Top ${connections.length} Similar Verses`}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {visibleConnections.map((c, idx) => (
              <div key={c.id}>
                {idx > 0 && <div style={{ height: '1px', background: 'rgba(255,255,255,0.055)', margin: '0' }} />}
              <button
                onClick={() => onNavigate(c.id)}
                onMouseEnter={() => setExpandedId(c.id)}
                onMouseLeave={() => setExpandedId(null)}
                style={{
                  background: expandedId === c.id ? 'rgba(212,165,116,0.09)' : 'rgba(255,240,200,0.025)',
                  border: 'none',
                  borderRadius: idx === 0 ? '8px 8px 0 0' : idx === visibleConnections.length - 1 ? '0 0 8px 8px' : '0',
                  padding: '10px 12px', textAlign: 'left', cursor: 'pointer',
                  transition: `all ${TRANSITION.base}`, width: '100%',
                  outline: expandedId === c.id ? '1px solid rgba(212,165,116,0.3)' : 'none',
                  outlineOffset: '-1px',
                }}>
                {/* Header row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: COLORS.gold, fontSize: '0.85rem', fontWeight: 600 }}>{surahNameTr(c.verse.surah)}</span>
                    <span style={{ color: COLORS.silver, fontSize: '0.78rem' }}>{c.id}</span>
                  </div>
                  <span
                    title="Kosinüs benzerlik skoru (0–1 arası, 1 = tam eşleşme)"
                    style={{ color: '#c9a227', fontSize: '0.8rem', fontWeight: 700, flexShrink: 0, cursor: 'help' }}
                  >{(c.score).toFixed(2)}</span>
                </div>
                {/* Progress bar — normalized to displayed range [0.45, 1.0] */}
                <div style={{ width: '100%', height: '2px', background: 'rgba(255,255,255,0.06)', borderRadius: '1px', marginBottom: '5px' }}>
                  <div style={{ width: `${Math.max(0, Math.min(100, Math.round((c.score - 0.45) / 0.55 * 100)))}%`, height: '100%', background: `linear-gradient(to right, rgba(212,165,116,0.4), ${COLORS.gold})`, borderRadius: '1px' }} />
                </div>

                {/* Collapsed: truncated text */}
                {expandedId !== c.id && (
                  <div style={{ color: COLORS.silver, fontSize: '0.87rem', lineHeight: 1.6 }}>
                    {vt(c.verse)?.slice(0, 110)}...
                  </div>
                )}

                {/* Expanded: Arabic + full text */}
                {expandedId === c.id && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                    <div style={{
                      fontFamily: FONTS.quran, fontSize: '1.55rem', lineHeight: 2.0,
                      color: COLORS.gold, textAlign: 'right', direction: 'rtl',
                      padding: '8px 10px',
                      background: 'rgba(212,165,116,0.05)',
                      borderRadius: RADIUS.sm, border: '1px solid rgba(212,165,116,0.08)',
                    }}>
                      {cleanArabicForGraph(c.verse.arabic)}
                    </div>
                    <div style={{ color: '#c8c5c0', fontSize: '0.87rem', lineHeight: 1.65 }}>
                      {vt(c.verse)}
                    </div>
                  </div>
                )}
              </button>
              </div>
            ))}
          </div>
          {connections.length > PREVIEW_COUNT && (
            <button
              onClick={() => setShowAll(v => !v)}
              style={{ marginTop: '14px', width: '100%', background: 'none', border: 'none', borderTop: '1px solid rgba(255,255,255,0.06)', borderRadius: '0', color: 'rgba(100,160,210,0.6)', fontSize: '0.82rem', fontWeight: 600, padding: '10px 0 0 0', cursor: 'pointer', textAlign: 'center' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'rgba(100,160,210,1)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(100,160,210,0.6)'; }}>
              {showAll
                ? (language === 'tr' ? '↑ Daha az göster' : '↑ Show less')
                : (language === 'tr' ? `↓ ${connections.length - PREVIEW_COUNT} ayet daha` : `↓ ${connections.length - PREVIEW_COUNT} more`)}
            </button>
          )}
        </div>
      )}

      {/* Audio player — at bottom so content hierarchy is: Arabic → Translation → Context → Similar → Audio */}
      <VerseAudioPlayer surah={node.surah} ayah={node.ayah} language={language} />
    </div>
  );
}
