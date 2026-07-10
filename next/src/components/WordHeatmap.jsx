'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, BREAKPOINT_MOBILE, FONTS, RADIUS, TRANSITION } from '../tokens';
import ToolHeader from './ToolHeader';
import LoadingOverlay from './LoadingOverlay';

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
// NOT: Ortak lib/arabic.js cleanArabicForDisplay'den FARKLI: (1) maddah fix yok,
// (2) U+0615 + U+06DF ek olarak strip edilir. Component-local bırakıldı.
function cleanArabic(str) {
  if (!str) return str;
  return str
    .replace(/\u06EA/g, '\u0650')
    .replace(/\u06E1/g, '\u0652')
    .replace(/\u0671/g, '\u0627')
    .replace(/\u06CC/g, '\u064A')
    .replace(/[\u0610-\u0614\u0616\u0617]/g, '')
    .replace(/[\u0600-\u0605]/g, '')
    .replace(/[\u06DD\u06DE\u06E9]/g, '')
    .replace(/\u06E6/g, ' ')
    .replace(/[\u0615\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06ED]/g, '')
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
  'Ed-Duhâ','El-İnşirah','Et-Tîn','El-Alak','El-Kadr','El-Beyyine',
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
  { label: 'Hz. Muhammed', term: 'muhammed', group: 'kavram' },
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
  { label: 'Tevbe', term: 'tevbe', group: 'kavram' },
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
  { label: 'Muhammad', term: 'muhammed', group: 'concept' },
  { label: 'Moses', term: 'moses', group: 'concept' },
  { label: 'Abraham', term: 'abraham', group: 'concept' },
  { label: 'Jesus', term: 'jesus', group: 'concept' },
  { label: 'Noah', term: 'noah', group: 'concept' },
  // Recurring patterns
  { label: 'رَبُّ الْعَالَمِينَ',                    desc: 'Lord of all worlds · ×42',                       term: 'رب العالمين',             group: 'pattern' },
  { label: 'غَفُورٌ رَّحِيمٌ',                       desc: 'Most Forgiving, Most Merciful · ×49',            term: 'غفور رحيم',               group: 'pattern' },
  { label: 'عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',           desc: 'Has power over all things · ×35',                term: 'على كل شيء قدير',         group: 'pattern' },
  { label: 'تَجْرِي مِن تَحْتِهَا الْأَنْهَارُ',    desc: 'Gardens beneath which rivers flow · ×34',        term: 'تجري من تحتها الانهار',   group: 'pattern' },
  { label: 'فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ', desc: 'Which of your Lord\'s favours will you deny? · ×31', term: 'فبأي آلاء ربكما تكذبان', group: 'pattern' },
  { label: 'أَهْلَكْنَا',                            desc: 'We destroyed · ×28',                             term: 'أهلكنا',                  group: 'pattern' },
  { label: 'سَمِيعٌ عَلِيمٌ',                        desc: 'All-Hearing, All-Knowing · ×16',                 term: 'سميع عليم',               group: 'pattern' },
  { label: 'شَدِيدُ الْعِقَابِ',                     desc: 'Severe in punishment · ×14',                     term: 'شديد العقاب',             group: 'pattern' },
  { label: 'لَعَلَّكُمْ تَشْكُرُونَ',               desc: 'So that you may be grateful · ×14',              term: 'لعلكم تشكرون',            group: 'pattern' },
  { label: 'عَلِيمٌ حَكِيمٌ',                        desc: 'All-Knowing, All-Wise · ×15',                    term: 'عليم حكيم',               group: 'pattern' },
  { label: 'عَزِيزٌ حَكِيمٌ',                        desc: 'Almighty, All-Wise · ×13',                       term: 'عزيز حكيم',               group: 'pattern' },
  { label: 'وَيْلٌ يَوْمَئِذٍ لِّلْمُكَذِّبِينَ',  desc: 'Woe that Day to the deniers! · ×12',             term: 'ويل يومئذ للمكذبين',      group: 'pattern' },
  { label: 'أَفَلَا تَعْقِلُونَ',                    desc: 'Will you not reason? · ×12',                     term: 'أفلا تعقلون',             group: 'pattern' },
  { label: 'لَعَلَّكُمْ تُفْلِحُونَ',               desc: 'So that you may succeed · ×11',                  term: 'لعلكم تفلحون',            group: 'pattern' },
  { label: 'عَالِمُ الْغَيْبِ وَالشَّهَادَةِ',      desc: 'Knower of the seen and unseen · ×10',            term: 'عالم الغيب والشهادة',     group: 'pattern' },
  { label: 'لَعَلَّكُمْ تَعْقِلُونَ',               desc: 'So that you may reason · ×8',                    term: 'لعلكم تعقلون',            group: 'pattern' },
  { label: 'فَاطِرِ السَّمَاوَاتِ وَالْأَرْضِ',     desc: 'Creator of the heavens and earth · ×6',          term: 'فاطر السموات',            group: 'pattern' },
  { label: 'فَكَيْفَ كَانَ عَذَابِي وَنُذُرِ',      desc: 'How severe was My punishment and warning! · ×4', term: 'كيف كان عذابي ونذر',      group: 'pattern' },
];

// Latin (TR/EN) input → Arabic Quranic word. When a Latin input matches a key here,
// the search is automatically redirected to the Arabic text, giving accurate counts
// instead of counting translator additions in the meal.
// Keys are normalizeTr()-output (lowercase, ASCII-folded). Values are stripHarakat-safe Arabic.
//
// IMPORTANT: The Quranic text uses Uthmani spelling with the dagger alef (U+0670)
// for the long-a sound in many proper names (e.g., اِبْرٰه۪يم, مُوسٰى, مَلٰئِكَة).
// Our stripHarakat() removes U+0670, so values here MUST match the *post-strip* form
// (e.g., 'ابرهيم' not 'ابراهيم', 'مليك' not 'ملائك'). Each value below is verified
// against verse-graph-bgem3.json — see audit script in commit history.
//
// Notes:
//   • 'melek' → 'مليك' catches all plural-angel forms (ملائكة → مليكة after strip)
//     plus the divine attribute مَلِيك (54:55), without hitting ملك (king/kingdom).
//   • 'kiyamet' → 'قيمة' (post-strip form of قيامة) catches yawm al-qiyāma.
//   • 'sehvet' → 'شهوة' is rare (2 ayet — Lūṭ); root شهو appears more broadly but
//     overlaps with شهور (months) so we use the specific noun.
const PROPER_NAMES_AR = {
  // Prophets — values use post-strip forms (dagger alef removed)
  'muhammed':  'محمد',
  'ahmed':     'احمد',
  'musa':      'موسى',
  'moses':     'موسى',
  'isa':       'عيسى',
  'jesus':     'عيسى',
  'ibrahim':   'ابرهيم',
  'abraham':   'ابرهيم',
  'noah':      'نوح',
  'nuh':       'نوح',
  'yusuf':     'يوسف',
  'joseph':    'يوسف',
  'yahya':     'يحيى',
  'zekeriya':  'زكريا',
  'zechariah': 'زكريا',
  'idris':     'ادريس',
  'adem':      'ادم',
  'adam':      'ادم',
  'davud':     'داود',
  'david':     'داود',
  'suleyman':  'سليمن',
  'solomon':   'سليمن',
  'ilyas':     'الياس',
  'elyesa':    'اليسع',
  'yunus':     'يونس',
  'jonah':     'يونس',
  'eyyub':     'ايوب',
  'job':       'ايوب',
  'ishak':     'اسحق',
  'isaac':     'اسحق',
  'ismail':    'اسمعيل',
  'ishmael':   'اسمعيل',
  'yakub':     'يعقوب',
  'jacob':     'يعقوب',
  'harun':     'هرون',
  'aaron':     'هرون',
  'salih':     'صالح',
  'hud':       'هود',
  'lut':       'لوط',
  'lot':       'لوط',
  'meryem':    'مريم',
  'mary':      'مريم',
  'lokman':    'لقمن',
  'zulkarneyn':'ذي القرنين',
  // Theological concepts (TR + EN entry points)
  'allah':     'الله',
  'rahim':     'رحيم',
  'rahman':    'رحمن',
  'rahmet':    'رحمة',
  'mercy':     'رحمة',
  'iman':      'ايمان',
  'faith':     'ايمان',
  'takva':     'تقوى',
  'piety':     'تقوى',
  'sabir':     'صبر',     // normalizeTr('sabır') → 'sabir'
  'patience':  'صبر',
  'patient':   'صبر',
  'tovbe':     'توبة',    // normalizeTr('tevbe') → 'tovbe'
  'repent':    'توبة',
  'repentance':'توبة',
  'melek':     'مليك',    // post-strip form of ملائكة — angel-plural; safe vs ملك (king)
  'angel':     'مليك',
  'seytan':    'شيطان',   // normalizeTr('şeytan') → 'seytan'
  'satan':     'شيطان',
  'cennet':    'جنة',
  'paradise':  'جنة',
  'cehennem':  'جهنم',
  'hell':      'جهنم',
  'kiyamet':   'قيمة',    // post-strip form of قيامة (yawm al-qiyāma)
  'mumin':     'مؤمن',
  'believer':  'مؤمن',
  'kafir':     'كافر',
  'disbeliever':'كافر',
  'rasul':     'رسول',
  'messenger': 'رسول',
  'nebi':      'نبي',
  'prophet':   'نبي',
  'kuran':     'قرآن',
  'kitap':     'كتاب',
  'kitab':     'كتاب',
  'book':      'كتاب',
  'sehvet':    'شهوة',
  'lust':      'شهوة',
  // Worship & ethics
  'dua':       'دعاء',
  'supplication':'دعاء',
  'secde':     'سجد',
  'prostration':'سجد',
  'oruc':      'صيام',    // normalizeTr('oruç') → 'oruc'
  'fasting':   'صيام',
  'salat':     'صلوة',    // Uthmani form الصَّلٰوة (post-strip = صلوة)
  'namaz':     'صلوة',
  'prayer':    'صلوة',
  'hac':       'حج',
  'pilgrimage':'حج',
  'cihad':     'جاهد',    // verb stem جاهد catches the active forms (28 ayet)
  'jihad':     'جاهد',
  'nimet':     'نعمة',
  'blessing':  'نعمة',
  'hidayet':   'هدى',
  'guidance':  'هدى',
  'azap':      'عذاب',
  'punishment':'عذاب',
  'munafik':   'منافق',
  'hypocrite': 'منافق',
  // Ontology — life / death / world / hereafter
  'dunya':     'دنيا',    // normalizeTr('dünya') → 'dunya'
  'world':     'دنيا',
  'ahiret':    'اخرة',
  'hereafter': 'اخرة',
  'olum':      'موت',     // normalizeTr('ölüm') → 'olum'
  'death':     'موت',
  'hayat':     'حيوة',    // Uthmani form الْحَيٰوة (post-strip = حيوة)
  'life':      'حيوة',
  // Esmâ-ül Hüsnâ — divine attributes
  'rab':       'رب',      // 1069 ayet — al-Rabb / Lord
  'lord':      'رب',
  'melik':     'الملك',   // "the King" — bare ملك too broad (king/possession)
  'king':      'الملك',
  'kuddus':    'قدوس',
  'selam':     'سلام',
  'salaam':    'سلام',
  'aziz':      'عزيز',
  'hakim':     'حكيم',
  'alim':      'عليم',
  'kadir':     'قدير',
  'semi':      'سميع',
  'basir':     'بصير',
  'vahid':     'واحد',
  'tevhid':    'واحد',    // tevhid kavramı kelime olarak geçmez; al-Wāḥid kullan
  'oneness':   'واحد',
  'ahad':      'احد',
  'samed':     'صمد',
  // İnanç esasları
  'sirk':      'شرك',
  'polytheism':'شرك',
  'kufr':      'كفر',
  'disbelief': 'كفر',
  'nifak':     'نافق',    // verb stem catches منافق, نافقوا
  'hypocrisy': 'نافق',
  'vahy':      'وحي',
  'revelation':'وحي',
  'nubuvvet':  'نبوة',
  'prophethood':'نبوة',
  'risalet':   'رسالت',
  'mucize':    'اية',     // Quran calls miracles āyāt (signs)
  'miracle':   'اية',
  'ayet':      'اية',
  'sign':      'اية',
  'gayb':      'غيب',
  'unseen':    'غيب',
  // Âhiret
  'bas':       'بعث',     // diriliş
  'resurrection':'بعث',
  'hasr':      'حشر',
  'gathering': 'حشر',
  'hisab':     'حساب',
  'reckoning': 'حساب',
  'mizan':     'ميزان',
  'scale':     'ميزان',
  'sirat':     'صراط',
  'path':      'صراط',
  'nar':       'نار',
  'fire':      'نار',
  'firdevs':   'فردوس',
  'firdaws':   'فردوس',
  'berzah':    'برزخ',
  'sur':       'الصور',   // trumpet
  'trumpet':   'الصور',
  'araf':      'اعراف',
  'aaraf':     'اعراف',
  'tuba':      'طوبى',
  // İbadet
  'ibadet':    'عبد',     // root ʿabada — worship/servitude
  'worship':   'عبد',
  'zekat':     'زكوة',    // Uthmani strip-form
  'zakah':     'زكوة',
  'umre':      'عمرة',
  'umrah':     'عمرة',
  'sadaka':    'صدقات',
  'charity':   'صدقات',
  'infak':     'ينفق',
  'spending':  'ينفق',
  'zikr':      'ذكر',
  'remembrance':'ذكر',
  'tesbih':    'سبح',     // root sabbaḥa — glorification
  'glorification':'سبح',
  'hamd':      'حمد',
  'praise':    'حمد',
  'tekbir':    'اكبر',    // includes "Allāhu akbar" forms
  'sehadet':   'شهد',     // root ş-h-d
  'witness':   'شهد',
  'tilavet':   'يتلو',    // verb form for recite
  'recitation':'يتلو',
  // Ahlâk
  'ihlas':     'مخلص',
  'sincerity': 'مخلص',
  'ihsan':     'محسن',
  'excellence':'محسن',
  'sukr':      'شكر',
  'gratitude': 'شكر',
  'tevekkul':  'توكل',
  'trust':     'توكل',
  'istigfar':  'استغفر',
  'forgiveness':'استغفر',
  'hikmet':    'حكمة',
  'wisdom':    'حكمة',
  'adl':       'عدل',
  'justice':   'عدل',
  'emanet':    'امانة',
  'trustworthiness':'امانة',
  'sidk':      'صدق',
  'truth':     'صدق',
  'yakin':     'يقين',
  'certainty': 'يقين',
  'husu':      'خاشع',
  'humility':  'خاشع',
  'riza':      'رضى',
  'pleasure':  'رضى',
  'havf':      'خاف',     // root catches خاف, يخاف, خوف
  'fear':      'خاف',
  'hasye':     'خشي',     // hasyet (awe)
  'awe':       'خشي',
  // Toplumsal
  'ummet':     'امة',
  'community': 'امة',
  'sura':      'شورى',
  'consultation':'شورى',
  'hicret':    'هاجر',
  'migration': 'هاجر',
  'nikah':     'نكاح',
  'marriage':  'نكاح',
  'talak':     'طلاق',
  'divorce':   'طلاق',
  'miras':     'ميراث',
  'inheritance':'ميراث',
  'riba':      'ربا',
  'usury':     'ربا',
  'ahd':       'عهد',
  'covenant':  'عهد',
  'misak':     'ميثاق',
  'kisas':     'قصاص',
  'retribution':'قصاص',
  'hudud':     'حدود',
  'limits':    'حدود',
  'beyyine':   'بينة',
  'evidence':  'بينة',
  // Kur'an
  'furkan':    'فرقان',
  'criterion': 'فرقان',
  'nur':       'نور',
  'light':     'نور',
  'sure':      'سورة',
  'chapter':   'سورة',
  'mesel':     'مثل',
  'parable':   'مثل',
  'tafsil':    'تفصيل',
  'detail':    'تفصيل',
  'tertil':    'ترتيل',
  // Varlık
  'halk':      'خلق',
  'creation':  'خلق',
  'fitrat':    'فطر',     // root only; noun فطرة → 0 (Uthmani anomaly)
  'nature':    'فطر',
  'ruh':       'روح',
  'spirit':    'روح',
  'soul':      'نفس',
  'nefs':      'نفس',
  'kalb':      'قلب',
  'heart':     'قلب',
  'akl':       'عقل',
  'reason':    'عقل',
  'rizk':      'رزق',
  'provision': 'رزق',
  'ecel':      'اجل',
  'term':      'اجل',
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

// Escape a string for use inside a RegExp literal.
function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Count per-surah occurrences of a search term.
// Arabic: substring match (Arabic morphology attaches prefixes/suffixes — substring is correct).
// Latin (TR/EN): word-boundary match — prevents "rahim" from matching "ibrahim", etc.
function computeFrequency(verses, term, language, isArabic) {
  if (!verses || !term || term.length < 2) return {};
  const counts = {};

  if (isArabic) {
    const normTerm = stripHarakat(term);
    for (const v of verses) {
      const text = stripHarakat(v.arabic);
      if (text.includes(normTerm)) {
        let count = 0, idx = 0;
        while ((idx = text.indexOf(normTerm, idx)) !== -1) { count++; idx += normTerm.length; }
        counts[v.surah] = (counts[v.surah] || 0) + count;
      }
    }
  } else {
    const normTerm = normalizeTr(term);
    const re = new RegExp(`\\b${escapeRegExp(normTerm)}\\b`, 'g');
    for (const v of verses) {
      const text = normalizeTr(language === 'tr' ? (cleanTr(v.turkish) || v.english) : (v.english || cleanTr(v.turkish)));
      const matches = text.match(re);
      if (matches) counts[v.surah] = (counts[v.surah] || 0) + matches.length;
    }
  }
  return counts;
}

// Highlight search term in text, returns array of strings/JSX
const HARAKAT_SET = new Set('\u0610\u0611\u0612\u0613\u0614\u0615\u0616\u0617\u0618\u0619\u061A\u064B\u064C\u064D\u064E\u064F\u0650\u0651\u0652\u0653\u0654\u0655\u0656\u0657\u0658\u0659\u065A\u065B\u065C\u065D\u065E\u065F\u0670\u06D6\u06D7\u06D8\u06D9\u06DA\u06DB\u06DC\u06DF\u06E0\u06E1\u06E2\u06E3\u06E4\u06E7\u06E8\u06EA\u06EB\u06EC\u06ED\u0640'.split(''));

function highlightText(text, term, isArabic) {
  if (!text || !term || term.length < 2) return text;
  const hlStyle = { background: 'rgba(212,165,116,0.32)', borderRadius: '3px', color: '#f5e4a8', padding: '0 2px' };

  if (isArabic) {
    const normText = stripHarakat(text);
    const normTerm = stripHarakat(term);
    if (!normText.includes(normTerm)) return text;
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
    // Latin: word-boundary regex so "rahim" does not highlight inside "ibrahim"
    const normText = normalizeTr(text);
    const normTerm = normalizeTr(term);
    const re = new RegExp(`\\b${escapeRegExp(normTerm)}\\b`, 'g');
    if (!re.test(normText)) return text;
    re.lastIndex = 0;

    const parts = [];
    let lastIdx = 0;
    let m;
    while ((m = re.exec(normText)) !== null) {
      if (m.index > lastIdx) parts.push(text.slice(lastIdx, m.index));
      parts.push(<span key={m.index} style={hlStyle}>{text.slice(m.index, m.index + m[0].length)}</span>);
      lastIdx = m.index + m[0].length;
    }
    if (lastIdx < text.length) parts.push(text.slice(lastIdx));
    return parts;
  }
}

// Matching verses for a surah
function getMatchingVerses(verses, surah, term, language, isArabic) {
  if (!verses || !term || term.length < 2) return [];
  if (isArabic) {
    const normTerm = stripHarakat(term);
    return verses.filter(v => v.surah === surah && stripHarakat(v.arabic).includes(normTerm))
      .sort((a, b) => a.ayah - b.ayah);
  }
  const normTerm = normalizeTr(term);
  const re = new RegExp(`\\b${escapeRegExp(normTerm)}\\b`);
  return verses.filter(v => {
    if (v.surah !== surah) return false;
    const text = normalizeTr(language === 'tr' ? (cleanTr(v.turkish) || v.english) : (v.english || cleanTr(v.turkish)));
    return re.test(text);
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
  const [isMobile, setIsMobile] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    setIsMobile(window.innerWidth < BREAKPOINT_MOBILE);
    const h = () => setIsMobile(window.innerWidth < BREAKPOINT_MOBILE);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  useEffect(() => {
    fetch('/verse-graph-bgem3.json').then(r => r.json()).then(d => { setVerses(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  // Body scroll lock — CLAUDE.md §13.16 Layer 1: prevent background page scrollbar leaking through fixed overlay.
  useEffect(() => {
    const prevBody = document.body.style.overflow;
    const prevHtml = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevBody;
      document.documentElement.style.overflow = prevHtml;
    };
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
      setInputValue(presetLabel);
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

    <div style={{ background: COLORS.cosmicBlack, minHeight: 'calc(100vh - 62px)', paddingTop: '62px', display: 'flex', flexDirection: 'column' }}>

      {/* Floating tooltip */}
      {tooltip && (
        <div style={{
          position: 'fixed', zIndex: 10010, pointerEvents: 'none',
          left: tooltip.x + 14, top: tooltip.y - 10,
          background: 'rgba(6,8,20,0.97)', border: '1px solid rgba(212,165,116,0.35)',
          borderRadius: RADIUS.md, padding: '8px 12px', backdropFilter: 'blur(12px)',
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

      {/* Header — ToolHeader standartı */}
      <ToolHeader
        icon={<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="14" width="3.5" height="6" rx="0.5" /><rect x="10.25" y="9" width="3.5" height="11" rx="0.5" /><rect x="16.5" y="4" width="3.5" height="16" rx="0.5" /></svg>}
        titleTr="Kelime Frekans Haritası"
        titleEn="Word Frequency Map"
        subtitleTr="Tekrârü'l-Kelimât"
        subtitleEn="Lexical Frequency"
        language={language}
        chip={totalOccurrences > 0 && searchTerm ? (
          <span style={{ background: 'rgba(212,165,116,0.1)', border: '1px solid rgba(212,165,116,0.2)', borderRadius: RADIUS.lg, color: gold, fontSize: '0.7rem', padding: '2px 10px' }}>
            {totalOccurrences} {language === 'tr' ? 'kez' : 'times'} · {Object.keys(freqMap).length} {language === 'tr' ? 'sûre' : 'surahs'}
          </span>
        ) : null}
      />

      {/* Main layout: sidebar for verses + full-height grid area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: isMobile ? 'column' : 'row', overflow: 'hidden', minHeight: 0 }}>

        {/* Left: controls + grid */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: isMobile ? '10px 12px' : '14px 16px', gap: '10px', overflow: 'hidden', minHeight: 0 }}>

          {/* Search input — max-width to avoid spanning full ultra-wide panel */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0, maxWidth: '680px' }}>
            {(() => {
              const hasArabic = /[\u0600-\u06FF]/.test(inputValue);
              return (
                <input
                  ref={inputRef}
                  className="qc-focus-ring"
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
                    borderRadius: RADIUS.md, color: '#e8e6e3',
                    padding: hasArabic ? '6px 14px' : '7px 14px',
                    fontFamily: hasArabic ? FONTS.quran : undefined,
                    fontSize: hasArabic ? '1.25rem' : '0.88rem',
                    lineHeight: hasArabic ? 1.5 : 1.4,
                    outline: 'none', flex: 1,
                  }}
                />
              );
            })()}

            <button onClick={() => handleSearch(inputValue)} style={{ background: 'rgba(212,165,116,0.12)', border: '1px solid rgba(212,165,116,0.3)', borderRadius: RADIUS.md, color: gold, cursor: 'pointer', padding: '7px 16px', fontSize: '0.82rem', fontWeight: 600, flexShrink: 0 }}>
              {language === 'tr' ? 'Ara' : 'Search'}
            </button>
            {searchTerm && (
              <button
                onClick={clearSearch}
                aria-label={language === 'tr' ? 'Aramayı temizle' : 'Clear search'}
                style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: RADIUS.md, color: '#4a5568', cursor: 'pointer', padding: '7px 10px', fontSize: '0.82rem', flexShrink: 0 }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Search-scope helper — explains whether we are searching Arabic Quranic text or the translation */}
          <div style={{ fontSize: '0.7rem', color: '#64748b', fontStyle: 'italic', maxWidth: '680px', marginTop: '-4px', flexShrink: 0 }}>
            {searchTerm && isArabicSearch && resolvedTerm !== searchTerm ? (
              <>
                {language === 'tr' ? '→ Kur\'an metninde arandı: ' : '→ Searched in Quranic text: '}
                <span style={{ fontFamily: FONTS.quran, fontSize: '1rem', color: gold, direction: 'rtl', display: 'inline-block', verticalAlign: 'middle', marginInlineStart: '4px' }}>
                  {resolvedTerm}
                </span>
              </>
            ) : searchTerm && isArabicSearch ? (
              language === 'tr' ? 'Kur\'an metninde arandı (Arapça kök eşleşmesi).' : 'Searched directly in Quranic text.'
            ) : searchTerm ? (
              language === 'tr'
                ? 'Türkçe meal\'de arandı (tam kelime). Daha hassas sonuç için Arapça yazabilirsiniz.'
                : 'Searched in translation (whole word). For Quranic accuracy, type in Arabic.'
            ) : (
              language === 'tr'
                ? 'Türkçe veya Arapça yazabilirsiniz — yaygın kavramlar otomatik Arapça\'ya yönlendirilir.'
                : 'Type in Latin or Arabic — common concepts auto-redirect to Quranic Arabic.'
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
                            cursor: 'pointer', transition: `all ${TRANSITION.fast}`,
                            padding: isKalip ? '5px 12px' : '3px 10px',
                            textAlign: isKalip ? 'right' : 'left',
                            display: 'flex', flexDirection: 'column', alignItems: isKalip ? 'flex-end' : 'center',
                          }}>
                          <span style={isKalip ? { fontFamily: FONTS.quran, fontSize: '1.1rem', lineHeight: 1.6, direction: 'rtl' } : { fontSize: '0.85rem' }}>
                            {p.label}
                          </span>
                        </button>
                      );
                    })}
                    {isKalipGroup && allGroupPresets.length > KALIP_VISIBLE && (
                      <button onClick={() => setShowAllKalip(v => !v)} style={{
                        background: 'transparent', border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: RADIUS.chip, color: '#4a5568', cursor: 'pointer',
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
          {loading && <LoadingOverlay />}

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
                      borderRadius: RADIUS.md, color: gold, cursor: 'pointer', padding: '4px 10px',
                      fontSize: '0.73rem', display: 'flex', alignItems: 'center', gap: '4px', transition: `all ${TRANSITION.fast}`,
                    }}>
                      <span style={{ color: '#64748b', fontSize: '0.65rem' }}>{surah}.</span>
                      {SURAH_NAMES_TR[+surah - 1]}
                      <span style={{ background: 'rgba(212,165,116,0.2)', borderRadius: RADIUS.sm, padding: '0 5px', fontSize: '0.65rem', fontWeight: 700 }}>{count}</span>
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
                    <div style={{ textAlign: 'center', background: 'rgba(10,10,26,0.6)', backdropFilter: 'blur(6px)', borderRadius: RADIUS.lg, padding: '16px 24px', border: '1px solid rgba(52,152,219,0.2)' }}>
                      <div style={{ fontFamily: FONTS.quran, fontSize: '1.6rem', color: 'rgba(212,165,116,0.45)', direction: 'rtl', marginBottom: '8px', lineHeight: 1.5 }}>
                        بِسْمِ اللَّهِ الرَّحْمٰنِ الرَّحِيمِ
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
              width: isMobile ? '100%' : '400px',
              flexShrink: 0,
              flexBasis: isMobile ? '50%' : 'auto',
              borderLeft: isMobile ? 'none' : '1px solid rgba(212,165,116,0.12)',
              borderTop: isMobile ? '1px solid rgba(212,165,116,0.12)' : 'none',
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
                        style={{ background: 'none', border: '1px solid rgba(212,165,116,0.2)', borderRadius: RADIUS.xs, color: versePage === 0 ? '#2a3040' : '#94a3b8', cursor: versePage === 0 ? 'default' : 'pointer', padding: '2px 8px', fontSize: '0.8rem' }}>‹</button>
                      <span style={{ color: '#4a5568', fontSize: '0.68rem', minWidth: '44px', textAlign: 'center' }}>
                        {versePage + 1} / {totalPages}
                      </span>
                      <button
                        onClick={() => setVersePage(p => Math.min(totalPages - 1, p + 1))}
                        disabled={versePage === totalPages - 1}
                        style={{ background: 'none', border: '1px solid rgba(212,165,116,0.2)', borderRadius: RADIUS.xs, color: versePage === totalPages - 1 ? '#2a3040' : '#94a3b8', cursor: versePage === totalPages - 1 ? 'default' : 'pointer', padding: '2px 8px', fontSize: '0.8rem' }}>›</button>
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
                        <div style={{ fontFamily: FONTS.quran, fontSize: '1.35rem', lineHeight: 2.0, color: 'rgba(212,165,116,0.65)', textAlign: 'right', direction: 'rtl', marginBottom: '6px' }}>
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
                    style={{ background: 'rgba(212,165,116,0.06)', border: '1px solid rgba(212,165,116,0.18)', borderRadius: RADIUS.sm, color: versePage === 0 ? '#2a3040' : gold, cursor: versePage === 0 ? 'default' : 'pointer', padding: '4px 14px', fontSize: '0.8rem' }}>
                    ‹ {language === 'tr' ? 'Önceki' : 'Prev'}
                  </button>
                  <span style={{ color: '#4a5568', fontSize: '0.72rem' }}>{versePage + 1} / {totalPages}</span>
                  <button onClick={() => setVersePage(p => Math.min(totalPages - 1, p + 1))} disabled={versePage === totalPages - 1}
                    style={{ background: 'rgba(212,165,116,0.06)', border: '1px solid rgba(212,165,116,0.18)', borderRadius: RADIUS.sm, color: versePage === totalPages - 1 ? '#2a3040' : gold, cursor: versePage === totalPages - 1 ? 'default' : 'pointer', padding: '4px 14px', fontSize: '0.8rem' }}>
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
