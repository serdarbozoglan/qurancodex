import { useState, useRef, useCallback, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import ProphetMap from './ProphetMap';

// Revelation order — rank 1-86 Mekki, 87-114 Medeni
const REVELATION = [
  {s:96,r:1},{s:68,r:2},{s:73,r:3},{s:74,r:4},{s:1,r:5},{s:111,r:6},{s:81,r:7},{s:87,r:8},{s:92,r:9},{s:89,r:10},
  {s:93,r:11},{s:94,r:12},{s:103,r:13},{s:100,r:14},{s:108,r:15},{s:102,r:16},{s:107,r:17},{s:109,r:18},{s:105,r:19},{s:113,r:20},
  {s:114,r:21},{s:112,r:22},{s:53,r:23},{s:80,r:24},{s:97,r:25},{s:91,r:26},{s:85,r:27},{s:95,r:28},{s:106,r:29},{s:101,r:30},
  {s:75,r:31},{s:104,r:32},{s:77,r:33},{s:50,r:34},{s:90,r:35},{s:86,r:36},{s:54,r:37},{s:38,r:38},{s:7,r:39},{s:72,r:40},
  {s:36,r:41},{s:25,r:42},{s:35,r:43},{s:19,r:44},{s:20,r:45},{s:56,r:46},{s:26,r:47},{s:27,r:48},{s:28,r:49},{s:17,r:50},
  {s:10,r:51},{s:11,r:52},{s:12,r:53},{s:15,r:54},{s:6,r:55},{s:37,r:56},{s:31,r:57},{s:34,r:58},{s:39,r:59},{s:40,r:60},
  {s:41,r:61},{s:42,r:62},{s:43,r:63},{s:44,r:64},{s:45,r:65},{s:46,r:66},{s:51,r:67},{s:88,r:68},{s:18,r:69},{s:16,r:70},
  {s:71,r:71},{s:14,r:72},{s:21,r:73},{s:23,r:74},{s:32,r:75},{s:52,r:76},{s:67,r:77},{s:69,r:78},{s:70,r:79},{s:78,r:80},
  {s:79,r:81},{s:82,r:82},{s:84,r:83},{s:30,r:84},{s:29,r:85},{s:83,r:86},
  {s:2,r:87},{s:8,r:88},{s:3,r:89},{s:33,r:90},{s:60,r:91},{s:4,r:92},{s:99,r:93},{s:57,r:94},{s:47,r:95},{s:13,r:96},
  {s:55,r:97},{s:76,r:98},{s:65,r:99},{s:98,r:100},{s:59,r:101},{s:110,r:102},{s:24,r:103},{s:22,r:104},{s:63,r:105},{s:58,r:106},
  {s:49,r:107},{s:66,r:108},{s:64,r:109},{s:61,r:110},{s:62,r:111},{s:48,r:112},{s:5,r:113},{s:9,r:114},
];
const RANK_BY_SURAH = {};
REVELATION.forEach(x => { RANK_BY_SURAH[x.s] = x.r; });

// "7:23" veya "20:25-26" → "A'râf 23" / "Tâhâ 25-26"
function fmtDuaRef(ref, lang = 'tr') {
  if (!ref) return ref;
  const [surahPart, versePart] = ref.split(':');
  const name = SURAH_NAMES[+surahPart];
  const label = name ? (lang === 'tr' ? name.tr : name.en) : `Sure ${surahPart}`;
  return `${label} ${versePart}`;
}

// "(2:31)" → "(Bakara 31)" dönüşümü
function fmtRef(text, lang = 'tr') {
  return text.replace(/\((\d+):(\d+)\)/g, (_, s, v) => {
    const name = SURAH_NAMES[+s];
    const label = name ? (lang === 'tr' ? name.tr : name.en) : `Sure ${s}`;
    return `(${label} ${v})`;
  });
}

// Dua Arapçası normalizasyonu — ReadingMode'daki cleanArabic ile birebir aynı pipeline.
// KFGQPC, api.acikkuran.com encoding'i için tasarlanmıştır; bu fonksiyon o metni hazırlar.
function cleanDuaAr(str) {
  if (!str) return str;
  return str
    .replace(/\u06EA/g, '\u0650')                                   // Uthmani subscript kasra → standart kasra
    .replace(/\u0671/g, '\u0627')                                   // alef wasla → düz alef (KFGQPC'de ص gösterir)
    .replace(/\u06CC/g, '\u064A')                                   // Farsça ye → Arapça ye
    .replace(/[\u0610-\u0614\u0616\u0617]/g, '')                    // İslami kısaltma işaretleri
    .replace(/[\u0600-\u0605]/g, '')                                // Kur'an numara/dipnot işaretleri
    .replace(/[\u06DD\u06DE\u06E9]/g, '')                           // ayet sonu, rub el hizb, secde işareti
    .replace(/[\u06D6-\u06DC\u06DF\u0615]/g, '')                    // vakıf işaretleri (CSS overlay yok)
    .replace(/\u06E6/g, ' ')                                        // small yeh → boşluk (kelime ayracı)
    .replace(/[\u06E0\u06E2-\u06E4\u06E7\u06E8\u06EB\u06ED]/g, '') // Uthmani dekoratif işaretler
    .replace(/[\uFD3E\uFD3F]/g, '');                                // süslü parantezler
}

// Vasıf listesindeki (NN:NN) referanslar için tooltip verisi.
// Key: "sure:ayet" (ör. "38:75"). Popup bu objeden okur.
const GIFT_VERSE_REFS = {
  '2:30': {
    ref: 'Bakara 2:30',
    ar: 'وَإِذْ قَالَ رَبُّكَ لِلْمَلَائِكَةِ إِنِّي جَاعِلٌ فِي الْأَرْضِ خَلِيفَةً',
    tr: 'Rabbin meleklere: "Ben yeryüzünde bir halife yaratacağım" demişti.',
    en: 'When your Lord said to the angels: "I will place a vicegerent on earth."',
  },
  '2:31': {
    ref: 'Bakara 2:31–33',
    ar: 'وَعَلَّمَ آدَمَ الْأَسْمَاءَ كُلَّهَا ثُمَّ عَرَضَهُمْ عَلَى الْمَلَائِكَةِ فَقَالَ أَنبِئُونِي بِأَسْمَاءِ هَٰؤُلَاءِ إِن كُنتُمْ صَادِقِينَ',
    tr: 'Allah Âdem\'e isimlerin hepsini öğretti. Sonra onları meleklere göstererek: "Haydi bunların isimlerini bana bildirin, doğru sözlüyseniz" dedi.',
    en: 'He taught Adam the names of all things, then showed them to the angels and said: "Tell Me their names, if you are truthful."',
  },
  '2:34': {
    ref: 'Bakara 2:34',
    ar: 'وَإِذْ قُلْنَا لِلْمَلَائِكَةِ اسْجُدُوا لِآدَمَ فَسَجَدُوا إِلَّا إِبْلِيسَ أَبَىٰ وَاسْتَكْبَرَ وَكَانَ مِنَ الْكَافِرِينَ',
    tr: 'Meleklere "Âdem\'e secde edin" dedik. İblis hariç hepsi secde etti; o ise reddetti, büyüklük tasladı ve kâfirlerden oldu.',
    en: 'We said to the angels: "Bow down to Adam." They all bowed except Iblis — he refused, was arrogant and became of the disbelievers.',
  },
  '3:59': {
    ref: 'Âl-i İmrân 3:59',
    ar: 'إِنَّ مَثَلَ عِيسَىٰ عِندَ اللَّهِ كَمَثَلِ آدَمَ ۖ خَلَقَهُ مِن تُرَابٍ ثُمَّ قَالَ لَهُ كُن فَيَكُونُ',
    tr: 'Allah katında İsa\'nın durumu Âdem\'in durumu gibidir: onu topraktan yarattı, sonra "Ol!" dedi ve oluverdi.',
    en: 'The likeness of Jesus before Allah is as that of Adam — He created him from dust, then said "Be" and he was.',
  },
  '2:37': {
    ref: 'Bakara 2:37',
    ar: 'فَتَلَقَّىٰ آدَمُ مِن رَّبِّهِ كَلِمَاتٍ فَتَابَ عَلَيْهِ ۚ إِنَّهُ هُوَ التَّوَّابُ الرَّحِيمُ',
    tr: 'Âdem Rabbinden kelimeler aldı (öğrendi); Allah da tövbesini kabul etti. O, tövbeleri çok kabul eden ve çok merhamet edendir.',
    en: 'Then Adam received from his Lord some words, and He accepted his repentance. Indeed, He is the Accepting of repentance, the Merciful.',
  },
  '7:12': {
    ref: 'A\'râf 7:12',
    ar: 'قَالَ مَا مَنَعَكَ أَلَّا تَسْجُدَ إِذْ أَمَرْتُكَ ۖ قَالَ أَنَا خَيْرٌ مِّنْهُ خَلَقْتَنِي مِن نَّارٍ وَخَلَقْتَهُ مِن طِينٍ',
    tr: 'Allah: "Emrettiğimde secde etmeni ne engelledi?" dedi. İblis: "Ben ondan üstünüm; beni ateşten, onu çamurdan yarattın" dedi.',
    en: 'He said: "What prevented you from prostrating when I commanded you?" Iblis said: "I am better — You created me from fire, him from clay."',
  },
  '20:122': {
    ref: 'Tâhâ 20:122',
    ar: 'ثُمَّ اجْتَبَاهُ رَبُّهُ فَتَابَ عَلَيْهِ وَهَدَىٰ',
    tr: 'Sonra Rabbi onu seçti, tövbesini kabul etti ve doğru yola iletti.',
    en: 'Then his Lord chose him, accepted his repentance and guided him.',
  },
  '32:9': {
    ref: 'Secde 32:9',
    ar: 'ثُمَّ سَوَّاهُ وَنَفَخَ فِيهِ مِن رُّوحِهِ ۖ وَجَعَلَ لَكُمُ السَّمْعَ وَالْأَبْصَارَ وَالْأَفْئِدَةَ ۚ قَلِيلًا مَّا تَشْكُرُونَ',
    tr: 'Sonra onu şekillendirdi ve ona ruhundan üfledi; sizin için işitme, görme ve kalpler yarattı. Ne kadar az şükrediyorsunuz!',
    en: 'Then He proportioned him and breathed into him of His spirit, and He made for you hearing, vision and hearts. Little are you grateful.',
  },
  '38:75': {
    ref: 'Sâd 38:75',
    ar: 'قَالَ يَا إِبْلِيسُ مَا مَنَعَكَ أَن تَسْجُدَ لِمَا خَلَقْتُ بِيَدَيَّ ۖ أَسْتَكْبَرْتَ أَمْ كُنتَ مِنَ الْعَالِينَ',
    tr: 'Allah: "Ey İblis! İki elimle yarattığıma secde etmekten seni alıkoyan nedir? Büyüklük mü tasladın, yoksa yücelerden mi oldun?" dedi.',
    en: 'He said: "O Iblis! What prevented you from prostrating to what I created with My own hands? Were you arrogant, or were you among the exalted?"',
  },
  '29:14': {
    ref: 'Ankebût 29:14',
    ar: 'وَلَقَدْ أَرْسَلْنَا نُوحًا إِلَىٰ قَوْمِهِ فَلَبِثَ فِيهِمْ أَلْفَ سَنَةٍ إِلَّا خَمْسِينَ عَامًا',
    tr: 'Andolsun, Nuh\'u kavmine gönderdik; aralarında elli yıl eksik bin yıl kaldı.',
    en: 'And We certainly sent Noah to his people, and he remained among them a thousand years minus fifty years.',
  },
  '11:37': {
    ref: 'Hûd 11:37',
    ar: 'وَاصْنَعِ الْفُلْكَ بِأَعْيُنِنَا وَوَحْيِنَا',
    tr: 'Gemiyi gözetimimiz altında ve vahyimiz doğrultusunda yap.',
    en: 'And construct the ship under Our observation and Our inspiration.',
  },
  '7:73': {
    ref: 'A\'râf 7:73–74',
    ar: 'وَإِلَىٰ ثَمُودَ أَخَاهُمْ صَالِحًا ۗ قَالَ يَا قَوْمِ اعْبُدُوا اللَّهَ مَا لَكُم مِّنْ إِلَٰهٍ غَيْرُهُ',
    tr: 'Semud\'a da kardeşleri Sâlih\'i gönderdik. "Ey kavmim! Allah\'a kulluk edin, O\'ndan başka ilâhınız yoktur" dedi.',
    en: 'And to the Thamud We sent their brother Salih. He said: "O my people! Worship Allah; you have no deity other than Him."',
  },
  '7:74': {
    ref: 'A\'râf 7:74',
    ar: 'وَاذْكُرُوا إِذْ جَعَلَكُمْ خُلَفَاءَ مِن بَعْدِ عَادٍ وَبَوَّأَكُمْ فِي الْأَرْضِ تَتَّخِذُونَ مِن سُهُولِهَا قُصُورًا وَتَنْحِتُونَ الْجِبَالَ بُيُوتًا',
    tr: 'Sizi Âd\'dan sonra halifeler kıldığını ve ovalarında saraylar, dağlarında evler yaptığınız yeryüzüne yerleştirdiğini hatırlayın.',
    en: 'Remember when He made you successors after Aad and settled you in the land — you take castles from its plains and carve the mountains into homes.',
  },
  '7:79': {
    ref: 'A\'râf 7:79',
    ar: 'فَتَوَلَّىٰ عَنْهُمْ وَقَالَ يَا قَوْمِ لَقَدْ أَبْلَغْتُكُمْ رِسَالَةَ رَبِّي وَنَصَحْتُ لَكُمْ وَلَٰكِن لَّا تُحِبُّونَ النَّاصِحِينَ',
    tr: 'Onlardan yüz çevirdi ve dedi ki: "Ey kavmim! Rabbimin mesajını size ilettim ve öğüt verdim; ama siz öğüt verenleri sevmiyorsunuz."',
    en: 'He turned away from them and said: "O my people! I had conveyed to you the message of my Lord and advised you, but you do not like advisers."',
  },
  '26:145': {
    ref: 'Şuarâ 26:145',
    ar: 'وَمَا أَسْأَلُكُمْ عَلَيْهِ مِنْ أَجْرٍ ۖ إِنْ أَجْرِيَ إِلَّا عَلَىٰ رَبِّ الْعَالَمِينَ',
    tr: 'Buna karşılık sizden hiçbir ücret istemiyorum. Ücretim ancak âlemlerin Rabbine aittir.',
    en: 'And I do not ask you for it any payment. My payment is only from the Lord of the worlds.',
  },
  '26:153': {
    ref: 'Şuarâ 26:153',
    ar: 'قَالُوا إِنَّمَا أَنتَ مِنَ الْمُسَحَّرِينَ',
    tr: '"Sen sadece büyülenmiş birisin" dediler.',
    en: 'They said: "You are only of those affected by magic."',
  },
  '27:48': {
    ref: 'Neml 27:48–49',
    ar: 'وَكَانَ فِي الْمَدِينَةِ تِسْعَةُ رَهْطٍ يُفْسِدُونَ فِي الْأَرْضِ وَلَا يُصْلِحُونَ',
    tr: 'Şehirde, yeryüzünde bozgunculuk yapan ve ıslah etmeyen dokuz kişilik bir topluluk vardı.',
    en: 'And there were in the city nine clans causing corruption in the land and not amending.',
  },
  '11:65': {
    ref: 'Hûd 11:65',
    ar: 'فَعَقَرُوهَا فَقَالَ تَمَتَّعُوا فِي دَارِكُمْ ثَلَاثَةَ أَيَّامٍ ۖ ذَٰلِكَ وَعْدٌ غَيْرُ مَكْذُوبٍ',
    tr: 'Deveyi kestiler. Sâlih: "Yurdunuzda üç gün daha yararlanın; bu, yalan olmayan bir vaattir" dedi.',
    en: 'They hamstrung her. He said: "Enjoy yourselves in your homes for three days — that is a promise not to be denied."',
  },
  '11:67': {
    ref: 'Hûd 11:67',
    ar: 'وَأَخَذَ الَّذِينَ ظَلَمُوا الصَّيْحَةُ فَأَصْبَحُوا فِي دِيَارِهِمْ جَاثِمِينَ',
    tr: 'Zulmedenleri korkunç bir ses yakaladı; yurtlarında diz üstü çökmüş halde kaldılar.',
    en: 'And the wrongdoers were seized by the thunderous blast, and they lay dead in their homes.',
  },
  '26:125': {
    ref: 'Şuarâ 26:125–127',
    ar: 'إِنِّي لَكُمْ رَسُولٌ أَمِينٌ ﴿١٢٥﴾ فَاتَّقُوا اللَّهَ وَأَطِيعُونِ ﴿١٢٦﴾ وَمَا أَسْأَلُكُمْ عَلَيْهِ مِنْ أَجْرٍ',
    tr: '"Ben size gönderilmiş güvenilir bir elçiyim. Allah\'tan korkun ve bana itaat edin. Buna karşılık sizden hiçbir ücret istemiyorum."',
    en: '"Indeed, I am to you a trustworthy messenger. So fear Allah and obey me. And I do not ask you for it any payment."',
  },
  '7:65': {
    ref: 'A\'râf 7:65',
    ar: 'وَإِلَىٰ عَادٍ أَخَاهُمْ هُودًا ۗ قَالَ يَا قَوْمِ اعْبُدُوا اللَّهَ مَا لَكُم مِّنْ إِلَٰهٍ غَيْرُهُ',
    tr: 'Âd kavmine de kardeşleri Hûd\'u gönderdik. "Ey kavmim! Allah\'a kulluk edin, O\'ndan başka ilâhınız yoktur" dedi.',
    en: 'And to the Aad We sent their brother Hud. He said: "O my people, worship Allah; you have no deity other than Him."',
  },
  '7:66': {
    ref: 'A\'râf 7:66',
    ar: 'قَالَ الْمَلَأُ الَّذِينَ كَفَرُوا مِن قَوْمِهِ إِنَّا لَنَرَاكَ فِي سَفَاهَةٍ وَإِنَّا لَنَظُنُّكَ مِنَ الْكَاذِبِينَ',
    tr: 'Kavminden inkâr eden ileri gelenler: "Biz seni beyinsizlikte görüyoruz ve seni yalancılardan sanıyoruz" dediler.',
    en: 'The eminent ones who disbelieved among his people said: "Indeed, we see you in foolishness, and indeed, we think you are of the liars."',
  },
  '11:52': {
    ref: 'Hûd 11:52',
    ar: 'وَيَا قَوْمِ اسْتَغْفِرُوا رَبَّكُمْ ثُمَّ تُوبُوا إِلَيْهِ يُرْسِلِ السَّمَاءَ عَلَيْكُم مِّدْرَارًا وَيَزِدْكُمْ قُوَّةً إِلَىٰ قُوَّتِكُمْ',
    tr: '"Ey kavmim! Rabbinizden bağışlanma dileyin, sonra O\'na tövbe edin ki üzerinize bol bol yağmur göndersin ve gücünüze güç katsın."',
    en: '"O my people, seek forgiveness of your Lord and then repent to Him. He will send rain upon you in abundance and add strength to your strength."',
  },
  '11:56': {
    ref: 'Hûd 11:56',
    ar: 'إِنِّي تَوَكَّلْتُ عَلَى اللَّهِ رَبِّي وَرَبِّكُمْ',
    tr: 'Ben, benim de Rabbim sizin de Rabbiniz olan Allah\'a tevekkül ettim.',
    en: 'I have relied upon Allah, my Lord and your Lord.',
  },
  '11:60': {
    ref: 'Hûd 11:60',
    ar: 'وَأُتْبِعُوا فِي هَٰذِهِ الدُّنْيَا لَعْنَةً وَيَوْمَ الْقِيَامَةِ ۗ أَلَا إِنَّ عَادًا كَفَرُوا رَبَّهُمْ ۗ أَلَا بُعْدًا لِّعَادٍ قَوْمِ هُودٍ',
    tr: 'Bu dünyada da kıyamet gününde de onların ardı sıra lanet gönderildi. Bilin ki Âd, Rabbini inkâr etti. Bilin ki, uzak olsun Hûd\'un kavmi Âd!',
    en: 'And they were followed in this world with a curse, and on the Day of Resurrection. Unquestionably, Aad denied their Lord — so away with Aad, the people of Hud.',
  },
  '46:25': {
    ref: 'Ahkâf 46:25',
    ar: 'تُدَمِّرُ كُلَّ شَيْءٍ بِأَمْرِ رَبِّهَا فَأَصْبَحُوا لَا يُرَىٰ إِلَّا مَسَاكِنُهُمْ',
    tr: 'Rabbinin emriyle her şeyi yerle bir eder. Derken, sadece yurtları görünür hale geldiler.',
    en: 'Destroying everything by the command of its Lord. And they became so that nothing was seen except their dwellings.',
  },
  '17:3': {
    ref: 'İsrâ 17:3',
    ar: 'ذُرِّيَّةَ مَنْ حَمَلْنَا مَعَ نُوحٍ ۚ إِنَّهُ كَانَ عَبْدًا شَكُورًا',
    tr: 'Nuh ile birlikte (gemiye) taşıdıklarımızın nesli! Şüphesiz o, çok şükreden bir kuldu.',
    en: 'O descendants of those We carried with Noah. Indeed, he was a grateful servant.',
  },
  '11:45': {
    ref: 'Hûd 11:45–46',
    ar: 'وَنَادَىٰ نُوحٌ رَّبَّهُ فَقَالَ رَبِّ إِنَّ ابْنِي مِنْ أَهْلِي وَإِنَّ وَعْدَكَ الْحَقُّ وَأَنتَ أَحْكَمُ الْحَاكِمِينَ',
    tr: 'Nuh Rabbine yalvardı: "Rabbim! Oğlum benim ehlimdendir, vaadin elbette haktır ve sen hâkimlerin en hâkimisin."',
    en: 'Noah called to his Lord and said: "My Lord, indeed my son is of my family, and Your promise is true, and You are the most just of judges."',
  },
  // ── Hz. Nuh ────────────────────────────────────────────────────────
  '29:14': { ref: 'Ankebût 29:14', ar: 'وَلَقَدْ أَرْسَلْنَا نُوحًا إِلَىٰ قَوْمِهِ فَلَبِثَ فِيهِمْ أَلْفَ سَنَةٍ إِلَّا خَمْسِينَ عَامًا', tr: 'Andolsun Nuh\'u kavmine gönderdik; onların arasında elli yıl eksik bin yıl kaldı.', en: 'And We sent Noah to his people, and he remained among them a thousand years minus fifty years.' },
  '11:37': { ref: 'Hûd 11:37', ar: 'وَاصْنَعِ الْفُلْكَ بِأَعْيُنِنَا وَوَحْيِنَا', tr: 'Gemiyi gözetimimiz altında ve vahyimizle yap.', en: 'And construct the ship under Our observation and Our inspiration.' },
  '37:77': { ref: 'Sâffât 37:77', ar: 'وَجَعَلْنَا ذُرِّيَّتَهُ هُمُ الْبَاقِينَ', tr: 'Onun soyunu bâki kalanlar kıldık.', en: 'And We made his descendants the ones remaining.' },
  // ── Hz. Hûd ────────────────────────────────────────────────────────
  '7:65': { ref: 'A\'râf 7:65', ar: 'وَإِلَىٰ عَادٍ أَخَاهُمْ هُودًا ۗ قَالَ يَا قَوْمِ اعْبُدُوا اللَّهَ مَا لَكُم مِّنْ إِلَٰهٍ غَيْرُهُ', tr: 'Âd kavmine de kardeşleri Hûd\'u gönderdik. Dedi: Ey kavmim! Allah\'a kulluk edin, O\'ndan başka ilahınız yoktur.', en: 'And to the Aad We sent their brother Hud. He said: O my people, worship Allah; you have no deity other than Him.' },
  '11:50': { ref: 'Hûd 11:50', ar: 'وَإِلَىٰ عَادٍ أَخَاهُمْ هُودًا ۚ قَالَ يَا قَوْمِ اعْبُدُوا اللَّهَ مَا لَكُم مِّنْ إِلَٰهٍ غَيْرُهُ ۖ إِنْ أَنتُمْ إِلَّا مُفْتَرُونَ', tr: 'Âd kavmine kardeşleri Hûd\'u gönderdik. Dedi: Ey kavmim! Allah\'a kulluk edin; O\'ndan başka ilahınız yoktur, siz yalnızca iftira ediyorsunuz.', en: 'And to Aad — their brother Hud. He said: O my people, worship Allah; you are not but inventors of lies.' },
  '11:58': { ref: 'Hûd 11:58', ar: 'وَلَمَّا جَاءَ أَمْرُنَا نَجَّيْنَا هُودًا وَالَّذِينَ آمَنُوا مَعَهُ بِرَحْمَةٍ مِّنَّا', tr: 'Emrimiz gelince Hûd\'u ve onunla birlikte iman edenleri rahmetimizle kurtardık.', en: 'And when Our command came, We saved Hud and those who believed with him, by mercy from Us.' },
  // ── Hz. Sâlih ──────────────────────────────────────────────────────
  '7:73': { ref: 'A\'râf 7:73', ar: 'وَإِلَىٰ ثَمُودَ أَخَاهُمْ صَالِحًا ۚ قَالَ يَا قَوْمِ اعْبُدُوا اللَّهَ مَا لَكُم مِّنْ إِلَٰهٍ غَيْرُهُ ۖ هَٰذِهِ نَاقَةُ اللَّهِ لَكُمْ آيَةً', tr: 'Semud kavmine kardeşleri Sâlih\'i gönderdik. Dedi: Ey kavmim! Allah\'a kulluk edin; işte size mucize olarak Allah\'ın devesi.', en: 'And to Thamud — their brother Salih. He said: O my people, worship Allah; this is the she-camel of Allah for you — a sign.' },
  '7:79': { ref: 'A\'râf 7:79', ar: 'فَتَوَلَّىٰ عَنْهُمْ وَقَالَ يَا قَوْمِ لَقَدْ أَبْلَغْتُكُمْ رِسَالَةَ رَبِّي وَنَصَحْتُ لَكُمْ', tr: 'Onlardan yüz çevirdi: Ey kavmim! Rabbimin mesajını ilettim ve öğüt verdim.', en: 'So he turned away from them and said: O my people, I had certainly conveyed to you the message of my Lord and advised you.' },
  // ── Hz. İbrahim ────────────────────────────────────────────────────
  '4:125': { ref: 'Nisâ 4:125', ar: 'وَاتَّخَذَ اللَّهُ إِبْرَاهِيمَ خَلِيلًا', tr: 'Allah, İbrahim\'i dost (halîl) edinmiştir.', en: 'And Allah took Abraham as an intimate friend.' },
  '3:67': { ref: 'Âl-i İmrân 3:67', ar: 'مَا كَانَ إِبْرَاهِيمُ يَهُودِيًّا وَلَا نَصْرَانِيًّا وَلَٰكِن كَانَ حَنِيفًا مُّسْلِمًا', tr: 'İbrahim ne Yahudi ne de Hristiyandı; o hanîf bir Müslümandı ve müşriklerden değildi.', en: 'Abraham was neither a Jew nor a Christian, but he was a hanif — a Muslim. And he was not of the polytheists.' },
  '19:47': { ref: 'Meryem 19:47', ar: 'قَالَ سَلَامٌ عَلَيْكَ ۖ سَأَسْتَغْفِرُ لَكَ رَبِّي ۖ إِنَّهُ كَانَ بِي حَفِيًّا', tr: '"Sana selam olsun; Rabbimden senin için bağışlanma dileyeceğim. O bana karşı çok lütufkârdır" dedi.', en: '"Peace be upon you. I will ask forgiveness for you of my Lord. Indeed, He is ever gracious to me."' },
  '21:58': { ref: 'Enbiyâ 21:58–63', ar: 'فَجَعَلَهُمْ جُذَاذًا إِلَّا كَبِيرًا لَّهُمْ لَعَلَّهُمْ إِلَيْهِ يَرْجِعُونَ', tr: 'En büyükleri hariç hepsini parçalara böldü; belki ona başvururlar diye.', en: 'So he broke them into fragments, except the largest of them, that perhaps they would return to it.' },
  '2:129': { ref: 'Bakara 2:129', ar: 'رَبَّنَا وَابْعَثْ فِيهِمْ رَسُولًا مِّنْهُمْ يَتْلُو عَلَيْهِمْ آيَاتِكَ', tr: 'Rabbimiz! İçlerinden onlara senin ayetlerini okuyacak bir elçi gönder.', en: 'Our Lord, and send among them a messenger from themselves who will recite to them Your verses.' },
  '2:127': { ref: 'Bakara 2:127', ar: 'وَإِذْ يَرْفَعُ إِبْرَاهِيمُ الْقَوَاعِدَ مِنَ الْبَيْتِ وَإِسْمَاعِيلُ رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنتَ السَّمِيعُ الْعَلِيمُ', tr: 'İbrahim ve İsmail Kâbe\'nin temellerini yükseltirken: "Rabbimiz! Bizden kabul et; Sen Semi\'sin, Alîm\'sin" dediler.', en: 'As Abraham raised the foundations of the House, and Ishmael, saying: "Our Lord, accept from us. You are the Hearing, the Knowing."' },
  '37:103': { ref: 'Sâffât 37:103–107', ar: 'فَلَمَّا أَسْلَمَا وَتَلَّهُ لِلْجَبِينِ ﴿١٠٣﴾ وَنَادَيْنَاهُ أَن يَا إِبْرَاهِيمُ ﴿١٠٤﴾ قَدْ صَدَّقْتَ الرُّؤْيَا', tr: 'İkisi de teslim olup onu alnı üzerine yatırınca, "Ey İbrahim! Rüyayı gerçekleştirdin" diye nida ettik.', en: 'And when they had both submitted and he put him down upon his forehead, We called to him: "O Abraham! You have fulfilled the vision."' },
  '16:123': { ref: 'Nahl 16:123', ar: 'ثُمَّ أَوْحَيْنَا إِلَيْكَ أَنِ اتَّبِعْ مِلَّةَ إِبْرَاهِيمَ حَنِيفًا', tr: 'Sonra sana: "Hanîf olan İbrahim\'in milletine uy" diye vahyettik.', en: 'Then We revealed to you: "Follow the religion of Abraham, inclining toward truth."' },
  '21:69': { ref: 'Enbiyâ 21:69', ar: 'قُلْنَا يَا نَارُ كُونِي بَرْدًا وَسَلَامًا عَلَىٰ إِبْرَاهِيمَ', tr: 'Dedik ki: Ey ateş! İbrahim\'e karşı serin ve selametli ol!', en: 'We said: O fire, be coolness and safety upon Abraham.' },
  '11:71': { ref: 'Hûd 11:71', ar: 'وَامْرَأَتُهُ قَائِمَةٌ فَضَحِكَتْ فَبَشَّرْنَاهَا بِإِسْحَاقَ وَمِن وَرَاءِ إِسْحَاقَ يَعْقُوبَ', tr: 'Hanımı ayaktaydı, güldü. Onu İshak ile, İshak\'ın ardından da Yakûb ile müjdeledik.', en: 'And his wife was standing and she smiled. Then We gave her good tidings of Isaac and after Isaac, of Jacob.' },
  // ── Hz. Lût ────────────────────────────────────────────────────────
  '21:71': { ref: 'Enbiyâ 21:71', ar: 'وَنَجَّيْنَاهُ وَلُوطًا إِلَى الْأَرْضِ الَّتِي بَارَكْنَا فِيهَا لِلْعَالَمِينَ', tr: 'Onu ve Lût\'u, âlemler için bereketli kıldığımız topraklara kurtardık.', en: 'And We saved him and Lot to the land which We had blessed for the worlds.' },
  '21:74': { ref: 'Enbiyâ 21:74–75', ar: 'وَلُوطًا آتَيْنَاهُ حُكْمًا وَعِلْمًا ۗ وَأَدْخَلْنَاهُ فِي رَحْمَتِنَا ۚ إِنَّهُ مِنَ الصَّالِحِينَ', tr: 'Lût\'a hüküm ve ilim verdik; onu rahmetimize kattık. O salihlerden biridir.', en: 'And Lot — We gave him judgement and knowledge, and admitted him into Our mercy. Indeed, he was of the righteous.' },
  '27:56': { ref: 'Neml 27:56', ar: 'فَمَا كَانَ جَوَابَ قَوْمِهِ إِلَّا أَن قَالُوا أَخْرِجُوا آلَ لُوطٍ مِّن قَرْيَتِكُمْ', tr: 'Kavminin cevabı yalnızca şu oldu: "Lût ailesi yurdunuzdan çıkarılsın."', en: 'But the answer of his people was only that they said: "Expel the family of Lot from your city."' },
  '11:81': { ref: 'Hûd 11:81', ar: 'قَالُوا يَا لُوطُ إِنَّا رُسُلُ رَبِّكَ ۖ إِنَّهُمْ لَن يَصِلُوا إِلَيْكَ ۖ فَأَسْرِ بِأَهْلِكَ بِقِطْعٍ مِّنَ اللَّيْلِ وَلَا يَلْتَفِتْ مِنكُمْ أَحَدٌ إِلَّا امْرَأَتَكَ', tr: '"Ey Lût! Biz Rabbinin elçileriyiz. Gecenin bir bölümünde ailenle yola çık; kimse arkasına bakmasın — eşin hariç."', en: '"O Lot! We are messengers of your Lord. Travel by night with your family; let none of you look back — except your wife."' },
  '11:82': { ref: 'Hûd 11:82', ar: 'فَلَمَّا جَاءَ أَمْرُنَا جَعَلْنَا عَالِيَهَا سَافِلَهَا وَأَمْطَرْنَا عَلَيْهَا حِجَارَةً مِّن سِجِّيلٍ مَّنضُودٍ', tr: 'Emrimiz gelince şehri alt üst ettik; üzerine üst üste sicîl taşları yağdırdık.', en: 'So when Our command came, We made the highest part of it the lowest and rained upon it stones of hard clay, layered.' },
  '7:83': { ref: 'A\'râf 7:83', ar: 'فَأَنجَيْنَاهُ وَأَهْلَهُ إِلَّا امْرَأَتَهُ كَانَتْ مِنَ الْغَابِرِينَ', tr: 'Onu ve ailesini kurtardık; karısı hariç — o geride kalanlardan oldu.', en: 'So We saved him and his family, except his wife — she was of those who remained behind.' },
  '66:10': { ref: 'Tahrîm 66:10', ar: 'ضَرَبَ اللَّهُ مَثَلًا لِّلَّذِينَ كَفَرُوا امْرَأَتَ نُوحٍ وَامْرَأَتَ لُوطٍ ۖ كَانَتَا تَحْتَ عَبْدَيْنِ مِنْ عِبَادِنَا صَالِحَيْنِ فَخَانَتَاهُمَا فَلَمْ يُغْنِيَا عَنْهُمَا مِنَ اللَّهِ شَيْئًا وَقِيلَ ادْخُلَا النَّارَ مَعَ الدَّاخِلِينَ', tr: 'Allah inkâr edenlere Nuh\'un karısını ve Lût\'un karısını örnek verdi. İkisi de sâlih kullarımızdan iki peygamberin nikâhı altındaydı; onlara ihanet ettiler. O iki peygamber Allah\'tan gelen hiçbir şeyi onlardan savamadı. "Girenlerle birlikte ateşe girin" denildi.', en: 'Allah presents as an example for those who disbelieved the wife of Noah and the wife of Lot. They were under two of Our righteous servants but betrayed them, so those prophets did not avail them from Allah at all, and it was said: "Enter the Fire with those who enter."' },
  // ── Hz. İsmâil ─────────────────────────────────────────────────────
  '19:54': { ref: 'Meryem 19:54', ar: 'وَاذْكُرْ فِي الْكِتَابِ إِسْمَاعِيلَ ۚ إِنَّهُ كَانَ صَادِقَ الْوَعْدِ وَكَانَ رَسُولًا نَّبِيًّا', tr: 'Kitapta İsmail\'i de zikret. O vaadine sadık, bir resul ve nebiydi.', en: 'And mention in the Book Ishmael. Indeed, he was true to his promise and was a messenger and prophet.' },
  '19:55': { ref: 'Meryem 19:55', ar: 'وَكَانَ يَأْمُرُ أَهْلَهُ بِالصَّلَاةِ وَالزَّكَاةِ وَكَانَ عِندَ رَبِّهِ مَرْضِيًّا', tr: 'Ailesine namazı ve zekâtı emrederdi; Rabbi katında razı olunan biriydi.', en: 'And he used to enjoin on his family prayer and zakah and was well-pleasing to his Lord.' },
  '37:102': { ref: 'Sâffât 37:102–103', ar: 'فَلَمَّا بَلَغَ مَعَهُ السَّعْيَ قَالَ يَا بُنَيَّ إِنِّي أَرَىٰ فِي الْمَنَامِ أَنِّي أَذْبَحُكَ فَانظُرْ مَاذَا تَرَىٰ ۚ قَالَ يَا أَبَتِ افْعَلْ مَا تُؤْمَرُ ۖ سَتَجِدُنِي إِن شَاءَ اللَّهُ مِنَ الصَّابِرِينَ ﴿١٠٢﴾ فَلَمَّا أَسْلَمَا وَتَلَّهُ لِلْجَبِينِ', tr: '"Ey oğlum! Rüyamda seni boğazladığımı görüyorum, ne düşünüyorsun?" Dedi: "Babacığım, emrolunduğunu yap; inşallah sabredenlerden olduğumu göreceksin." İkisi de teslim olunca onu alnı üzere yatırdı.', en: '"O my son, I see in a dream that I am slaughtering you, so see what you think." He said: "O my father, do what you are commanded; you will find me, if Allah wills, of the steadfast." When they had both submitted, and he put him down upon his forehead.' },
  '37:107': { ref: 'Sâffât 37:107', ar: 'وَفَدَيْنَاهُ بِذِبْحٍ عَظِيمٍ', tr: 'Onu büyük bir kurbanla fidye verdik.', en: 'And We ransomed him with a great sacrifice.' },
  '6:86': { ref: 'En\'âm 6:86', ar: 'وَإِسْمَاعِيلَ وَالْيَسَعَ وَيُونُسَ وَلُوطًا ۚ وَكُلًّا فَضَّلْنَا عَلَى الْعَالَمِينَ', tr: 'İsmail\'i, Elyesa\'yı, Yûnus\'u ve Lût\'u da (hidayete erdirdik); hepsini âlemlere üstün kıldık.', en: 'And Ishmael and Elisha and Jonah and Lot — all of them We preferred above the worlds.' },
  // ── Hz. İshâk ──────────────────────────────────────────────────────
  '11:72': { ref: 'Hûd 11:72', ar: 'قَالَتْ يَا وَيْلَتَىٰ أَأَلِدُ وَأَنَا عَجُوزٌ وَهَٰذَا بَعْلِي شَيْخًا ۖ إِنَّ هَٰذَا لَشَيْءٌ عَجِيبٌ', tr: '(Sâre) "Vay başıma gelene! Ben mi doğuracağım? Hem ben kocayım, hem kocam ihtiyar. Bu gerçekten şaşılacak bir şey!" dedi.', en: 'She said, "Woe to me! Shall I give birth while I am an old woman and this is my husband, an old man? Indeed, this is a strange thing!"' },
  '21:72': { ref: 'Enbiyâ 21:72', ar: 'وَوَهَبْنَا لَهُ إِسْحَاقَ وَيَعْقُوبَ نَافِلَةً ۖ وَكُلًّا جَعَلْنَا صَالِحِينَ', tr: 'Ona İshak\'ı, üstelik Yakûb\'u da hediye ettik; hepsini salih kıldık.', en: 'And We gave him Isaac and Jacob as a gift, and each of them We made righteous.' },
  '29:27': { ref: 'Ankebût 29:27', ar: 'وَوَهَبْنَا لَهُ إِسْحَاقَ وَيَعْقُوبَ وَجَعَلْنَا فِي ذُرِّيَّتِهِ النُّبُوَّةَ وَالْكِتَابَ', tr: 'Ona İshak ve Yakûb\'u bağışladık; nübüvveti ve kitabı onun soyuna koyduk.', en: 'And We gave him Isaac and Jacob and placed in his descendants prophethood and scripture.' },
  '37:112': { ref: 'Saffât 37:112', ar: 'وَبَشَّرْنَاهُ بِإِسْحَاقَ نَبِيًّا مِّنَ الصَّالِحِينَ', tr: 'Ona, salihlerden bir peygamber olarak İshak\'ı müjdeledik.', en: 'And We gave him good tidings of Isaac — a prophet from among the righteous.' },
  '37:113': { ref: 'Saffât 37:113', ar: 'وَبَارَكْنَا عَلَيْهِ وَعَلَىٰ إِسْحَاقَ ۚ وَمِن ذُرِّيَّتِهِمَا مُحْسِنٌ وَظَالِمٌ لِّنَفْسِهِ مُبِينٌ', tr: 'İbrahim\'e ve İshak\'a bereket verdik. Her ikisinin soyundan iyiler de kendi nefsine açıkça zulmedenler de geldi.', en: 'And We blessed him and Isaac. But among their descendants is the doer of good and the one who is clearly unjust to himself.' },
  '14:39': { ref: 'İbrâhîm 14:39', ar: 'الْحَمْدُ لِلَّهِ الَّذِي وَهَبَ لِي عَلَى الْكِبَرِ إِسْمَاعِيلَ وَإِسْحَاقَ', tr: 'İhtiyarlığımda bana İsmâil\'i ve İshak\'ı bağışlayan Allah\'a hamdolsun.', en: 'Praise to Allah, who has granted to me in old age Ishmael and Isaac.' },
  '38:45': { ref: 'Sâd 38:45', ar: 'وَاذْكُرْ عِبَادَنَا إِبْرَاهِيمَ وَإِسْحَاقَ وَيَعْقُوبَ أُولِي الْأَيْدِي وَالْأَبْصَارِ', tr: 'Kullarımız İbrahim\'i, İshak\'ı ve Yakûb\'u an; hepsi güç ve basiret sahibiydi.', en: 'And remember Our servants Abraham, Isaac and Jacob — those of strength and vision.' },
  // ── Hz. Yakûb ──────────────────────────────────────────────────────
  '12:83': { ref: 'Yûsuf 12:83', ar: 'فَصَبْرٌ جَمِيلٌ ۖ عَسَى اللَّهُ أَن يَأْتِيَنِي بِهِمْ جَمِيعًا', tr: 'Güzel bir sabır gerek. Umarım Allah onların hepsini bana geri getirir.', en: 'So patience is most fitting. Perhaps Allah will bring them to me all together.' },
  '12:18': { ref: 'Yûsuf 12:18', ar: 'فَصَبْرٌ جَمِيلٌ ۖ وَاللَّهُ الْمُسْتَعَانُ عَلَىٰ مَا تَصِفُونَ', tr: 'Güzel bir sabır gerek. Anlattıklarınıza karşı yardım yalnızca Allah\'tandır.', en: 'So patience is most fitting. And Allah is the one sought for help against what you describe.' },
  '12:68': { ref: 'Yûsuf 12:68', ar: 'وَإِنَّهُ لَذُو عِلْمٍ لِّمَا عَلَّمْنَاهُ وَلَٰكِنَّ أَكْثَرَ النَّاسِ لَا يَعْلَمُونَ', tr: 'O, öğrettiğimizden ötürü gerçekten ilim sahibiydi; ama insanların çoğu bilmez.', en: 'Indeed, he was a possessor of knowledge because of what We had taught him, but most people do not know.' },
  '12:84': { ref: 'Yûsuf 12:84–86', ar: 'وَتَوَلَّىٰ عَنْهُمْ وَقَالَ يَا أَسَفَىٰ عَلَىٰ يُوسُفَ وَابْيَضَّتْ عَيْنَاهُ مِنَ الْحُزْنِ فَهُوَ كَظِيمٌ ﴿٨٤﴾ ... قَالَ إِنَّمَا أَشْكُو بَثِّي وَحُزْنِي إِلَى اللَّهِ وَأَعْلَمُ مِنَ اللَّهِ مَا لَا تَعْلَمُونَ', tr: '"Ah Yûsuf\'um!" diyerek onlardan yüz çevirdi; gözleri üzüntüden aktı, içi burku burnuydu. "Ben derdimi ve üzüntümü ancak Allah\'a arz ediyorum; Allah\'tan sizin bilmediğinizi biliyorum."', en: 'He turned away from them and said, "Oh, my grief for Joseph!" And his eyes became white from grief, for he was suppressing it. He said, "I only complain of my suffering and my grief to Allah, and I know from Allah what you do not know."' },
  '12:87': { ref: 'Yûsuf 12:87', ar: 'وَلَا تَيْأَسُوا مِن رَّوْحِ اللَّهِ ۖ إِنَّهُ لَا يَيْأَسُ مِن رَّوْحِ اللَّهِ إِلَّا الْقَوْمُ الْكَافِرُونَ', tr: 'Allah\'ın rahmetinden umut kesmeyiniz; zira Allah\'ın rahmetinden ancak kâfir topluluk ümidini keser.', en: 'Do not despair of relief from Allah. Indeed, no one despairs of relief from Allah except the disbelieving people.' },
  '12:94': { ref: 'Yûsuf 12:94', ar: 'إِنِّي لَأَجِدُ رِيحَ يُوسُفَ ۖ لَوْلَا أَن تُفَنِّدُونِ', tr: 'Siz bana bunak demeseydiniz, Yûsuf\'un kokusunu alıyorum doğrusu.', en: 'Indeed, I find the smell of Joseph — if you would not think me weakened in judgment.' },
  '12:96': { ref: 'Yûsuf 12:96', ar: 'فَلَمَّا أَن جَاءَ الْبَشِيرُ أَلْقَاهُ عَلَىٰ وَجْهِهِ فَارْتَدَّ بَصِيرًا', tr: 'Müjdeci gelince gömleği onun yüzüne koydu; gözleri açılıverdi.', en: 'And when the bearer of good tidings arrived, he cast it over his face, and he returned once again able to see.' },
  // ── Hz. Yûsuf ──────────────────────────────────────────────────────
  '12:3': { ref: 'Yûsuf 12:3', ar: 'نَحْنُ نَقُصُّ عَلَيْكَ أَحْسَنَ الْقَصَصِ بِمَا أَوْحَيْنَا إِلَيْكَ هَٰذَا الْقُرْآنَ', tr: 'Bu Kur\'an\'ı sana vahyetmekle kıssaların en güzelini anlatıyoruz.', en: 'We relate to you the best of stories through what We have revealed to you of this Quran.' },
  '12:6': { ref: 'Yûsuf 12:6', ar: 'وَكَذَٰلِكَ يَجْتَبِيكَ رَبُّكَ وَيُعَلِّمُكَ مِن تَأْوِيلِ الْأَحَادِيثِ', tr: 'Rabbin seni böylece seçecek ve sana hadislerin tevilini öğretecektir.', en: 'And thus will your Lord choose you and teach you the interpretation of narratives.' },
  '12:22': { ref: 'Yûsuf 12:22', ar: 'وَلَمَّا بَلَغَ أَشُدَّهُ آتَيْنَاهُ حُكْمًا وَعِلْمًا ۚ وَكَذَٰلِكَ نَجْزِي الْمُحْسِنِينَ', tr: 'Gençlik çağına ulaşınca ona hüküm ve ilim verdik. İyilik edenleri böyle mükâfatlandırırız.', en: 'And when he reached maturity, We gave him judgement and knowledge. And thus We reward the doers of good.' },
  '12:24': { ref: 'Yûsuf 12:24', ar: 'كَذَٰلِكَ لِنَصْرِفَ عَنْهُ السُّوءَ وَالْفَحْشَاءَ ۚ إِنَّهُ مِنْ عِبَادِنَا الْمُخْلَصِينَ', tr: 'İşte böylece ondan kötülüğü ve fahşayı uzaklaştırdık. O, ihlâslı kullarımızdandır.', en: 'Thus We diverted from him evil and immorality. Indeed, he was of Our chosen servants.' },
  '12:33': { ref: 'Yûsuf 12:33', ar: 'رَبِّ السِّجْنُ أَحَبُّ إِلَيَّ مِمَّا يَدْعُونَنِي إِلَيْهِ', tr: 'Rabbim! Zindan bana bunların davet ettiği şeyden daha sevimlidir.', en: 'My Lord! Prison is more dear to me than what they invite me to.' },
  '12:37': { ref: 'Yûsuf 12:37', ar: 'لَا يَأْتِيكُمَا طَعَامٌ تُرْزَقَانِهِ إِلَّا نَبَّأْتُكُمَا بِتَأْوِيلِهِ قَبْلَ أَن يَأْتِيَكُمَا', tr: 'Size verilecek yemek gelmeden önce onun tabirini size haber vereceğim.', en: 'No food will come to you as provision but that I will inform you of its interpretation before it comes.' },
  '12:55': { ref: 'Yûsuf 12:55', ar: 'قَالَ اجْعَلْنِي عَلَىٰ خَزَائِنِ الْأَرْضِ ۖ إِنِّي حَفِيظٌ عَلِيمٌ', tr: 'Dedi: Beni ülkenin hazinelerine vekil et; ben iyi koruyan ve iyi bilenem.', en: 'He said: Appoint me over the storehouses of the land. Indeed, I am a knowing guardian.' },
  '12:92': { ref: 'Yûsuf 12:92', ar: 'قَالَ لَا تَثْرِيبَ عَلَيْكُمُ الْيَوْمَ ۖ يَغْفِرُ اللَّهُ لَكُمْ ۖ وَهُوَ أَرْحَمُ الرَّاحِمِينَ', tr: 'Dedi: Bugün size kınama yok. Allah sizi bağışlasın; O merhametlilerin en merhametlisidir.', en: 'He said: No blame upon you today. May Allah forgive you; He is the most merciful of the merciful.' },
  '12:100': { ref: 'Yûsuf 12:100', ar: 'وَرَفَعَ أَبَوَيْهِ عَلَى الْعَرْشِ وَخَرُّوا لَهُ سُجَّدًا', tr: 'Anne ve babasını tahtın üzerine oturttu; hepsi onun için secdeye kapandı.', en: 'He raised his parents upon the throne and they all fell down before him in prostration.' },
  // ── Hz. Şuayb ──────────────────────────────────────────────────────
  '7:85': { ref: 'A\'râf 7:85', ar: 'وَإِلَىٰ مَدْيَنَ أَخَاهُمْ شُعَيْبًا ۗ قَالَ يَا قَوْمِ اعْبُدُوا اللَّهَ مَا لَكُم مِّنْ إِلَٰهٍ غَيْرُهُ ۖ فَأَوْفُوا الْكَيْلَ وَالْمِيزَانَ', tr: 'Medyen halkına da kardeşleri Şuayb\'ı gönderdik. Dedi: Ey kavmim! Allah\'a kulluk edin; ölçüyü ve tartıyı tam yapın.', en: 'And to Madyan — their brother Shu\'ayb. He said: O my people, worship Allah; fulfill the measure and weight.' },
  '26:180': { ref: 'Şuarâ 26:180', ar: 'وَمَا أَسْأَلُكُمْ عَلَيْهِ مِنْ أَجْرٍ ۖ إِنْ أَجْرِيَ إِلَّا عَلَىٰ رَبِّ الْعَالَمِينَ', tr: 'Buna karşılık sizden bir ücret istemiyorum; ecrım yalnızca âlemlerin Rabbine aittir.', en: 'And I do not ask you for it any payment; my payment is only from the Lord of the worlds.' },
  '11:87': { ref: 'Hûd 11:87', ar: 'قَالُوا يَا شُعَيْبُ أَصَلَاتُكَ تَأْمُرُكَ أَن نَّتْرُكَ مَا يَعْبُدُ آبَاؤُنَا', tr: 'Dediler: Ey Şuayb! Namazın mı seni, atalarımızın taptığını terk etmemizi emrediyor?', en: 'They said: O Shu\'ayb, does your prayer command you that we should leave what our fathers worship?' },
  '11:88': { ref: 'Hûd 11:88', ar: 'إِنْ أُرِيدُ إِلَّا الْإِصْلَاحَ مَا اسْتَطَعْتُ ۚ وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ', tr: 'Ben gücüm yettiğince yalnızca ıslah etmek istiyorum; başarım ancak Allah\'ladır.', en: 'I only intend reform as much as I am able. And my success is not but through Allah.' },
  '11:91': { ref: 'Hûd 11:91', ar: 'قَالُوا يَا شُعَيْبُ مَا نَفْقَهُ كَثِيرًا مِّمَّا تَقُولُ وَإِنَّا لَنَرَاكَ فِينَا ضَعِيفًا ۖ وَلَوْلَا رَهْطُكَ لَرَجَمْنَاكَ', tr: 'Dediler: Ey Şuayb! Söylediklerinin çoğunu anlamıyoruz. Seni aramızda zayıf görüyoruz. Kabilenin hatırı olmasaydı seni taşlardık.', en: 'They said: O Shu\'ayb, we do not understand much of what you say, and indeed we see you as weak among us. Were it not for your family, we would have stoned you.' },
  '7:91': { ref: 'A\'râf 7:91', ar: 'فَأَخَذَتْهُمُ الرَّجْفَةُ فَأَصْبَحُوا فِي دَارِهِمْ جَاثِمِينَ', tr: 'Onları sarsıntı yakaladı; yurtlarında diz çökmüş halde sabahladılar.', en: 'So the earthquake seized them, and they became within their home corpses fallen prone.' },
  '11:94': { ref: 'Hûd 11:94', ar: 'وَلَمَّا جَاءَ أَمْرُنَا نَجَّيْنَا شُعَيْبًا وَالَّذِينَ آمَنُوا مَعَهُ بِرَحْمَةٍ مِّنَّا', tr: 'Emrimiz gelince Şuayb\'ı ve onunla iman edenleri rahmetimizle kurtardık.', en: 'And when Our command came, We saved Shu\'ayb and those who believed with him, by mercy from Us.' },
  // ── Hz. Eyyûb ──────────────────────────────────────────────────────
  '21:83': { ref: 'Enbiyâ 21:83', ar: 'وَأَيُّوبَ إِذْ نَادَىٰ رَبَّهُ أَنِّي مَسَّنِيَ الضُّرُّ وَأَنتَ أَرْحَمُ الرَّاحِمِينَ', tr: 'Eyyûb\'u da hatırla; Rabbine: "Bana dert dokundu, sen merhametlilerin en merhametlisisin" diye yalvarmıştı.', en: 'And mention Job, when he called to his Lord: Indeed adversity has touched me, and You are the Most Merciful of the merciful.' },
  '21:84': { ref: 'Enbiyâ 21:84', ar: 'فَاسْتَجَبْنَا لَهُ فَكَشَفْنَا مَا بِهِ مِن ضُرٍّ ۖ وَآتَيْنَاهُ أَهْلَهُ وَمِثْلَهُم مَّعَهُمْ رَحْمَةً مِّنْ عِندِنَا', tr: 'Duasını kabul ettik, derdini giderdik, ona ailesini ve bir o kadarını daha verdik.', en: 'So We responded to him and removed what afflicted him of adversity. And We gave back his family and the like thereof with them.' },
  '38:42': { ref: 'Sâd 38:42', ar: 'ارْكُضْ بِرِجْلِكَ ۖ هَٰذَا مُغْتَسَلٌ بَارِدٌ وَشَرَابٌ', tr: 'Ayağını yere vur; işte yıkanacak serin bir su ve içecek bir su.', en: 'Strike the ground with your foot; here is a cool spring for washing and drinking.' },
  '38:43': { ref: 'Sâd 38:43', ar: 'وَوَهَبْنَا لَهُ أَهْلَهُ وَمِثْلَهُم مَّعَهُمْ رَحْمَةً مِّنَّا وَذِكْرَىٰ لِأُولِي الْأَلْبَابِ', tr: 'Katımızdan bir rahmet olarak ailesini ve bir o kadarını daha bağışladık; akıl sahiplerine bir öğüttür bu.', en: 'And We gave back his family and doubled their number as mercy from Us and a reminder for those of understanding.' },
  '38:44': { ref: 'Sâd 38:44', ar: 'إِنَّا وَجَدْنَاهُ صَابِرًا ۚ نِّعْمَ الْعَبْدُ ۖ إِنَّهُ أَوَّابٌ', tr: 'Biz onu sabreden biri olarak bulduk. Ne güzel kul! O daima bize yönelirdi.', en: 'Indeed, We found him patient — an excellent servant. Indeed, he was one repeatedly turning back to Us.' },
  // ── Hz. Mûsâ ───────────────────────────────────────────────────────
  '4:164': { ref: 'Nisâ 4:164', ar: 'وَكَلَّمَ اللَّهُ مُوسَىٰ تَكْلِيمًا', tr: 'Allah, Musa ile bizzat konuştu.', en: 'And to Moses, Allah spoke directly.' },
  '7:107': { ref: 'A\'râf 7:107–108', ar: 'فَأَلْقَىٰ عَصَاهُ فَإِذَا هِيَ ثُعْبَانٌ مُّبِينٌ ۝ وَنَزَعَ يَدَهُ فَإِذَا هِيَ بَيْضَاءُ لِلنَّاظِرِينَ', tr: 'Asasını fırlattı; hemen apaçık bir ejderha oldu. Elini çıkardı; bakanlara bembeyaz göründü.', en: 'He threw his staff and it became a manifest serpent. And he drew out his hand; it appeared white to the observers.' },
  '7:145': { ref: 'A\'râf 7:145', ar: 'وَكَتَبْنَا لَهُ فِي الْأَلْوَاحِ مِن كُلِّ شَيْءٍ مَّوْعِظَةً وَتَفْصِيلًا لِّكُلِّ شَيْءٍ', tr: 'Levhalara her şeyden öğüt ve her şeyin ayrıntılı açıklamasını yazdık.', en: 'And We wrote for him on the Tablets the instruction and explanation of all things.' },
  '20:38': { ref: 'Tâhâ 20:38–40', ar: 'إِذْ أَوْحَيْنَا إِلَىٰ أُمِّكَ مَا يُوحَىٰ', tr: 'Annesine vahyedilmesi gerekeni vahyettiğimiz zamanı hatırla.', en: 'When We inspired to your mother what We inspired.' },
  '20:11': { ref: 'Tâhâ 20:11–14', ar: 'فَلَمَّا أَتَاهَا نُودِيَ يَا مُوسَىٰ ۝ إِنِّي أَنَا رَبُّكَ فَاخْلَعْ نَعْلَيْكَ', tr: 'Ona yaklaştığında şöyle seslenildi: Ey Mûsâ! Ben senin Rabbiniyim; pabuçlarını çıkar.', en: 'When he came to it, he was called: O Moses! Indeed, I am your Lord, so remove your sandals.' },
  '20:44': { ref: 'Tâhâ 20:44', ar: 'فَقُولَا لَهُ قَوْلًا لَّيِّنًا لَّعَلَّهُ يَتَذَكَّرُ أَوْ يَخْشَىٰ', tr: 'Ona yumuşak söz söyleyin; belki öğüt alır ya da korkar.', en: 'And speak to him with gentle speech that perhaps he may be reminded or fear.' },
  '26:63': { ref: 'Şuarâ 26:63', ar: 'فَأَوْحَيْنَا إِلَىٰ مُوسَىٰ أَنِ اضْرِب بِّعَصَاكَ الْبَحْرَ ۖ فَانفَلَقَ', tr: 'Mûsâ\'ya asasıyla denize vurmasını vahyettik; deniz hemen yarıldı.', en: 'We revealed to Moses: Strike the sea with your staff — and it parted.' },
  '10:90': { ref: 'Yûnus 10:90–91', ar: 'وَجَاوَزْنَا بِبَنِي إِسْرَائِيلَ الْبَحْرَ فَأَتْبَعَهُمْ فِرْعَوْنُ وَجُنُودُهُ', tr: 'İsrailoğullarını denizden geçirdik; Firavun ve ordusu zulüm ve düşmanlıkla peşlerine düştü.', en: 'And We took the Children of Israel across the sea, and Pharaoh and his soldiers pursued them.' },
  '18:60': { ref: 'Kehf 18:60–82', ar: 'وَإِذْ قَالَ مُوسَىٰ لِفَتَاهُ لَا أَبْرَحُ حَتَّىٰ أَبْلُغَ مَجْمَعَ الْبَحْرَيْنِ', tr: 'Mûsâ genç yardımcısına: "İki denizin birleştiği yere ulaşıncaya kadar durmam" demişti.', en: 'Moses said to his boy: I will not stop until I reach the junction of the two seas.' },
  '33:7': { ref: 'Ahzâb 33:7', ar: 'وَإِذْ أَخَذْنَا مِنَ النَّبِيِّينَ مِيثَاقَهُمْ وَمِنكَ وَمِن نُّوحٍ وَإِبْرَاهِيمَ وَمُوسَىٰ وَعِيسَى ابْنِ مَرْيَمَ', tr: 'Peygamberlerden misaklarını aldığımızda — senden, Hz. Nuh\'tan, Hz. İbrahim\'den, Hz. Mûsâ\'dan ve Meryem oğlu Hz. İsa\'dan.', en: 'And when We took from the prophets their covenant — and from you, and from Noah, Abraham, Moses and Jesus son of Mary.' },
  // ── Hz. Hârûn ──────────────────────────────────────────────────────
  '20:25': { ref: 'Tâhâ 20:25–32', ar: 'رَبِّ اشْرَحْ لِي صَدْرِي ۝ وَيَسِّرْ لِي أَمْرِي ۝ وَاحْلُلْ عُقْدَةً مِّن لِّسَانِي ۝ يَفْقَهُوا قَوْلِي ۝ وَاجْعَل لِّي وَزِيرًا مِّنْ أَهْلِي ۝ هَارُونَ أَخِي', tr: 'Rabbim! Göğsümü genişlet, işimi kolaylaştır, dilimin düğümünü çöz ki sözümü anlasınlar. Ailemden bana bir yardımcı ver: kardeşim Hârûn.', en: 'My Lord, expand for me my breast, ease for me my task, untie the knot from my tongue that they may understand my speech, and appoint for me a minister from my family: Aaron, my brother.' },
  '20:29': { ref: 'Tâhâ 20:29–32', ar: 'وَاجْعَل لِّي وَزِيرًا مِّنْ أَهْلِي ۝ هَارُونَ أَخِي ۝ اشْدُدْ بِهِ أَزْرِي ۝ وَأَشْرِكْهُ فِي أَمْرِي', tr: 'Ailemden bana bir yardımcı ver: Kardeşim Hârûn\'u. Onunla sırtımı güçlendir, onu işime ortak et.', en: 'Appoint for me a minister from my family: Aaron, my brother. Strengthen me with him and make him associate in my task.' },
  '19:53': { ref: 'Meryem 19:53', ar: 'وَوَهَبْنَا لَهُ مِن رَّحْمَتِنَا أَخَاهُ هَارُونَ نَبِيًّا', tr: 'Rahmetimizden ona, kardeşi Hârûn\'u peygamber olarak bağışladık.', en: 'And We gave him out of Our mercy his brother Aaron as a prophet.' },
  '28:34': { ref: 'Kasas 28:34', ar: 'وَأَخِي هَارُونُ هُوَ أَفْصَحُ مِنِّي لِسَانًا فَأَرْسِلْهُ مَعِيَ رِدْءًا يُصَدِّقُنِي', tr: 'Kardeşim Hârûn dil bakımından benden daha fasih; beni doğrulaması için onu da benimle gönder.', en: 'And my brother Aaron is more eloquent than me in tongue, so send him with me as a helper to support me.' },
  '7:142': { ref: 'A\'râf 7:142', ar: 'وَقَالَ مُوسَىٰ لِأَخِيهِ هَارُونَ اخْلُفْنِي فِي قَوْمِي وَأَصْلِحْ وَلَا تَتَّبِعْ سَبِيلَ الْمُفْسِدِينَ', tr: 'Mûsâ kardeşi Hârûn\'a dedi: Kavmimde benim yerime geç; ıslah et, bozguncuların yoluna uyma.', en: 'Moses said to his brother Aaron: Take my place among my people, do right, and do not follow the way of the corrupters.' },
  '7:150': { ref: 'A\'râf 7:150', ar: 'وَلَمَّا رَجَعَ مُوسَىٰ إِلَىٰ قَوْمِهِ غَضْبَانَ أَسِفًا ... قَالَ ابْنَ أُمَّ إِنَّ الْقَوْمَ اسْتَضْعَفُونِي وَكَادُوا يَقْتُلُونَنِي', tr: 'Mûsâ öfkeli ve üzgün olarak kavmine döndü. Hârûn: "Ey annemin oğlu! Bu kavim beni zayıf gördü ve neredeyse beni öldürüyordu."', en: 'When Moses returned to his people, angry and grieved, Aaron said: O son of my mother! The people overpowered me and nearly killed me.' },
  '37:114': { ref: 'Sâffât 37:114–120', ar: 'وَلَقَدْ مَنَنَّا عَلَىٰ مُوسَىٰ وَهَارُونَ ۝ وَنَجَّيْنَاهُمَا وَقَوْمَهُمَا مِنَ الْكَرْبِ الْعَظِيمِ ۝ وَنَصَرْنَاهُمْ فَكَانُوا هُمُ الْغَالِبِينَ', tr: 'Andolsun, Mûsâ ve Hârûn\'a lütufta bulunduk; ikisini ve kavimlerini büyük sıkıntıdan kurtardık, onlara yardım ettik ve onlar galip geldiler.', en: 'And We certainly conferred favor upon Moses and Aaron. And We saved them and their people from the great affliction, and We aided them so they were the victors.' },
  // ── Hz. Yûnus ──────────────────────────────────────────────────────
  '21:87': { ref: 'Enbiyâ 21:87–88', ar: 'فَنَادَىٰ فِي الظُّلُمَاتِ أَن لَّا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ ۝ فَاسْتَجَبْنَا لَهُ وَنَجَّيْنَاهُ مِنَ الْغَمِّ', tr: 'Karanlıklar içinde: "Senden başka ilah yoktur, seni tenzih ederim; ben zalimlerden oldum" diye seslendi. Duasını kabul ettik ve onu sıkıntıdan kurtardık.', en: 'He called out within the darknesses: There is no deity except You; exalted are You. Indeed I have been of the wrongdoers. So We responded to him and saved him from distress.' },
  '10:98': { ref: 'Yûnus 10:98', ar: 'فَلَوْلَا كَانَتْ قَرْيَةٌ آمَنَتْ فَنَفَعَهَا إِيمَانُهَا إِلَّا قَوْمَ يُونُسَ لَمَّا آمَنُوا كَشَفْنَا عَنْهُمْ عَذَابَ الْخِزْيِ', tr: 'Yûnus kavmi dışında, iman edip de imanı kendisine fayda veren hiçbir şehir olmadı; onlar iman edince aşağılık azabı üzerlerinden kaldırıldı.', en: 'There has not been a city that believed and its faith benefited it except the people of Jonah — when they believed, We removed from them the punishment of disgrace.' },
  '37:141': { ref: 'Sâffât 37:141–142', ar: 'فَسَاهَمَ فَكَانَ مِنَ الْمُدْحَضِينَ ۝ فَالْتَقَمَهُ الْحُوتُ وَهُوَ مُلِيمٌ', tr: 'Kura çekişine katıldı ve kaybedenlerden oldu. Balık onu kendini kınayan biri olarak yuttu.', en: 'Then he drew lots and was among the losers. Then the fish swallowed him while he was blameworthy.' },
  '37:145': { ref: 'Sâffât 37:145–146', ar: 'فَنَبَذْنَاهُ بِالْعَرَاءِ وَهُوَ سَقِيمٌ ۝ وَأَنبَتْنَا عَلَيْهِ شَجَرَةً مِّن يَقْطِينٍ', tr: 'Onu hasta halde açık araziye fırlattık; üzerine kabak cinsi bir ağaç bitirdik.', en: 'Then We threw him onto the open shore while he was ill. And We caused to grow over him a gourd vine.' },
  '37:147': { ref: 'Sâffât 37:147', ar: 'وَأَرْسَلْنَاهُ إِلَىٰ مِائَةِ أَلْفٍ أَوْ يَزِيدُونَ', tr: 'Onu yüz bin, hatta daha fazla kişiye peygamber olarak gönderdik.', en: 'And We sent him to a hundred thousand or more.' },
  // ── Hz. İlyâs ──────────────────────────────────────────────────────
  '6:85': { ref: 'En\'âm 6:85', ar: 'وَزَكَرِيَّا وَيَحْيَىٰ وَعِيسَىٰ وَإِلْيَاسَ ۖ كُلٌّ مِّنَ الصَّالِحِينَ', tr: 'Zekeriyya, Yahya, İsa ve İlyas\'ı da — hepsi salihlerden.', en: 'And Zechariah and John and Jesus and Elias — and all were of the righteous.' },
  '37:123': { ref: 'Sâffât 37:123', ar: 'وَإِنَّ إِلْيَاسَ لَمِنَ الْمُرْسَلِينَ', tr: 'Şüphesiz İlyas, gönderilen peygamberlerdendir.', en: 'And indeed, Elias was of the messengers.' },
  '37:125': { ref: 'Sâffât 37:125', ar: 'أَتَدْعُونَ بَعْلًا وَتَذَرُونَ أَحْسَنَ الْخَالِقِينَ', tr: 'Yaratıcıların en güzelini bırakıp da Baal\'a mı tapıyorsunuz?', en: 'Do you call upon Baal and leave the best of creators?' },
  // ── Hz. Elyesâ ─────────────────────────────────────────────────────
  '6:86': { ref: 'En\'âm 6:86', ar: 'وَإِسْمَاعِيلَ وَالْيَسَعَ وَيُونُسَ وَلُوطًا ۚ وَكُلًّا فَضَّلْنَا عَلَى الْعَالَمِينَ', tr: 'İsmail, Elyesâ, Yûnus ve Lût\'u da; hepsini âlemlere üstün kıldık.', en: 'And Ishmael and Elisha and Jonah and Lot — and all of them We preferred over the worlds.' },
  // ── Hz. Zülkifl ────────────────────────────────────────────────────
  '38:48': { ref: 'Sâd 38:48', ar: 'وَاذْكُرْ إِسْمَاعِيلَ وَالْيَسَعَ وَذَا الْكِفْلِ ۖ وَكُلٌّ مِّنَ الْأَخْيَارِ', tr: 'İsmail\'i, Elyesâ\'yı ve Zülkifl\'i de zikret; hepsi hayırlılardandı.', en: 'And remember Ishmael and Elisha and Dhul-Kifl, and all are among the outstanding.' },
  // ── Hz. Dâvûd ──────────────────────────────────────────────────────
  '2:251': { ref: 'Bakara 2:251', ar: 'وَقَتَلَ دَاوُودُ جَالُوتَ وَآتَاهُ اللَّهُ الْمُلْكَ وَالْحِكْمَةَ وَعَلَّمَهُ مِمَّا يَشَاءُ', tr: 'Dâvûd Câlût\'u öldürdü; Allah ona mülk ve hikmet verdi ve dilediği şeyleri öğretti.', en: 'And David killed Goliath, and Allah gave him kingship and wisdom and taught him from that which He willed.' },
  '17:55': { ref: 'İsrâ 17:55', ar: 'وَلَقَدْ فَضَّلْنَا بَعْضَ النَّبِيِّينَ عَلَىٰ بَعْضٍ ۖ وَآتَيْنَا دَاوُودَ زَبُورًا', tr: 'Peygamberlerin bir kısmını diğerlerinden üstün kıldık; Dâvûd\'a Zebur\'u verdik.', en: 'And We have made some prophets exceed others, and to David We gave the Psalms.' },
  '34:10': { ref: 'Sebe 34:10', ar: 'وَلَقَدْ آتَيْنَا دَاوُودَ مِنَّا فَضْلًا ۖ يَا جِبَالُ أَوِّبِي مَعَهُ وَالطَّيْرَ ۖ وَأَلَنَّا لَهُ الْحَدِيدَ', tr: 'Andolsun, Dâvûd\'a katımızdan lütuf verdik: Ey dağlar, onunla tesbih edin, ey kuşlar! Demiri de onun için yumuşattık.', en: 'And We certainly gave David from Us bounty. O mountains, repeat with him, and the birds. And We softened iron for him.' },
  '34:11': { ref: 'Sebe 34:11', ar: 'أَنِ اعْمَلْ سَابِغَاتٍ وَقَدِّرْ فِي السَّرْدِ ۖ وَاعْمَلُوا صَالِحًا ۖ إِنِّي بِمَا تَعْمَلُونَ بَصِيرٌ', tr: 'Bol zırh yap ve halkaları dengeli ört; salih amel işleyin, şüphesiz yaptıklarınızı görüyorum.', en: 'Make full coats of armor and calculate carefully the links. And work righteousness; indeed I am seeing of what you do.' },
  '38:17': { ref: 'Sâd 38:17', ar: 'اصْبِرْ عَلَىٰ مَا يَقُولُونَ وَاذْكُرْ عَبْدَنَا دَاوُودَ ذَا الْأَيْدِ ۖ إِنَّهُ أَوَّابٌ', tr: 'Onların söylediklerine sabret; güç sahibi kulumuz Dâvûd\'u an; O gerçekten çok dönendi.', en: 'Be patient over what they say and remember Our servant David, the possessor of strength; indeed, he was one who repeatedly turned back to Allah.' },
  '38:20': { ref: 'Sâd 38:20', ar: 'وَشَدَدْنَا مُلْكَهُ وَآتَيْنَاهُ الْحِكْمَةَ وَفَصْلَ الْخِطَابِ', tr: 'Mülkünü sağlamlaştırdık; ona hikmet ve faslu\'l-hitab verdik.', en: 'And We strengthened his kingdom and gave him wisdom and discernment in speech.' },
  '38:26': { ref: 'Sâd 38:26', ar: 'يَا دَاوُودُ إِنَّا جَعَلْنَاكَ خَلِيفَةً فِي الْأَرْضِ فَاحْكُم بَيْنَ النَّاسِ بِالْحَقِّ وَلَا تَتَّبِعِ الْهَوَىٰ', tr: 'Ey Dâvûd! Seni yeryüzünde halife yaptık; insanlar arasında hak ile hükmet ve hevana uyma.', en: 'O David, indeed We have made you a successor upon the earth, so judge between the people in truth and do not follow desire.' },
  // ── Hz. Süleymân ───────────────────────────────────────────────────
  '27:16': { ref: 'Neml 27:16', ar: 'وَوَرِثَ سُلَيْمَانُ دَاوُودَ ۖ وَقَالَ يَا أَيُّهَا النَّاسُ عُلِّمْنَا مَنطِقَ الطَّيْرِ', tr: 'Süleymân, Dâvûd\'a vâris oldu ve dedi: Ey insanlar! Bize kuş dili öğretildi.', en: 'And Solomon inherited David. He said: O people, we have been taught the language of birds.' },
  '27:17': { ref: 'Neml 27:17', ar: 'وَحُشِرَ لِسُلَيْمَانَ جُنُودُهُ مِنَ الْجِنِّ وَالْإِنسِ وَالطَّيْرِ فَهُمْ يُوزَعُونَ', tr: 'Süleymân\'ın cin, insan ve kuş ordularından oluşan birlikleri toplandı, sıra halinde yürütüldüler.', en: 'And gathered for Solomon were his soldiers of jinn, men and birds, and they were marching in rows.' },
  '27:18': { ref: 'Neml 27:18–19', ar: 'حَتَّىٰ إِذَا أَتَوْا عَلَىٰ وَادِ النَّمْلِ قَالَتْ نَمْلَةٌ يَا أَيُّهَا النَّمْلُ ادْخُلُوا مَسَاكِنَكُمْ', tr: 'Karınca vadisine geldiklerinde bir karınca: Ey karıncalar! Yuvalarınıza girin, Süleymân ve ordusu farkında olmadan sizi ezmesin, dedi.', en: 'Until when they came to the valley of the ants, an ant said: O ants, enter your dwellings, lest Solomon and his soldiers crush you while they do not perceive.' },
  '27:38': { ref: 'Neml 27:38–40', ar: 'قَالَ يَا أَيُّهَا الْمَلَأُ أَيُّكُمْ يَأْتِينِي بِعَرْشِهَا قَبْلَ أَن يَأْتُونِي مُسْلِمِينَ', tr: 'Dedi: Ey ileri gelenler! Onlar müslüman olarak bana gelmeden önce hanginiz tahtını getirebilir?', en: 'He said: O chiefs, which of you will bring me her throne before they come to me in submission?' },
  '27:40': { ref: 'Neml 27:40', ar: 'قَالَ الَّذِي عِندَهُ عِلْمٌ مِّنَ الْكِتَابِ أَنَا آتِيكَ بِهِ قَبْلَ أَن يَرْتَدَّ إِلَيْكَ طَرْفُكَ', tr: 'Yanında Kitab\'dan ilim olan biri: Gözünü kırpmadan önce onu sana getiririm, dedi.', en: 'Said one who had knowledge from the Scripture: I will bring it to you before your glance returns to you.' },
  '34:12': { ref: 'Sebe 34:12', ar: 'وَلِسُلَيْمَانَ الرِّيحَ غُدُوُّهَا شَهْرٌ وَرَوَاحُهَا شَهْرٌ ۖ وَأَسَلْنَا لَهُ عَيْنَ الْقِطْرِ', tr: 'Süleymân\'a da rüzgarı verdik: sabah esişi bir aylık, akşam esişi bir aylık yoldu. Erimiş bakır kaynağını da onun için akıttık.', en: 'And to Solomon We subjected the wind: its morning was a month\'s journey and its evening a month\'s journey, and We caused a spring of molten copper to flow for him.' },
  '34:13': { ref: 'Sebe 34:13', ar: 'يَعْمَلُونَ لَهُ مَا يَشَاءُ مِن مَّحَارِيبَ وَتَمَاثِيلَ وَجِفَانٍ كَالْجَوَابِ وَقُدُورٍ رَّاسِيَاتٍ', tr: 'Cinler ona dilediğini yapıyordu: mihraplar, heykeller, havuz büyüklüğünde çanaklar, sabit kazanlar.', en: 'They made for him what he willed of elevated chambers, statues, bowls like reservoirs, and immovable cooking pots.' },
  '38:30': { ref: 'Sâd 38:30', ar: 'وَوَهَبْنَا لِدَاوُودَ سُلَيْمَانَ ۚ نِعْمَ الْعَبْدُ ۖ إِنَّهُ أَوَّابٌ', tr: 'Dâvûd\'a Süleymân\'ı bağışladık. Ne güzel kul! O daima Allah\'a yönelirdi.', en: 'And to David We gave Solomon — what an excellent servant! Indeed, he was one repeatedly turning back in devotion.' },
  '38:35': { ref: 'Sâd 38:35', ar: 'قَالَ رَبِّ اغْفِرْ لِي وَهَبْ لِي مُلْكًا لَّا يَنبَغِي لِأَحَدٍ مِّن بَعْدِي ۖ إِنَّكَ أَنتَ الْوَهَّابُ', tr: 'Dedi: Rabbim! Beni bağışla ve benden sonra kimseye nasip olmayacak bir mülk bağışla; sen çok bağışlayansın.', en: 'He said: My Lord, forgive me and grant me a kingdom such as will not belong to anyone after me. Indeed, You are the Bestower.' },
  // ── Hz. İlyâs ──────────────────────────────────────────────────────
  '37:123': { ref: 'Sâffât 37:123', ar: 'وَإِنَّ إِلْيَاسَ لَمِنَ الْمُرْسَلِينَ', tr: 'İlyâs şüphesiz gönderilen peygamberlerdendir.', en: 'And indeed, Elias was of the messengers.' },
  '37:124': { ref: 'Sâffât 37:124–125', ar: 'إِذْ قَالَ لِقَوْمِهِ أَلَا تَتَّقُونَ ۝ أَتَدْعُونَ بَعْلًا وَتَذَرُونَ أَحْسَنَ الْخَالِقِينَ', tr: 'Kavmine demişti: Siz Allah\'tan korkmaz mısınız? Yaratıcıların en güzelini bırakıp Baal\'a mı tapıyorsunuz?', en: 'When he said to his people: Will you not fear Allah? Do you call upon Baal and leave the best of creators?' },
  '37:127': { ref: 'Sâffât 37:127', ar: 'فَكَذَّبُوهُ فَإِنَّهُمْ لَمُحْضَرُونَ ۝ إِلَّا عِبَادَ اللَّهِ الْمُخْلَصِينَ', tr: 'Onu yalanladılar; şüphesiz azaba getirilecekler — ancak Allah\'ın ihlâslı kulları hariç.', en: 'But they denied him, so indeed they will be brought to punishment — except the chosen servants of Allah.' },
  '37:130': { ref: 'Sâffât 37:130', ar: 'سَلَامٌ عَلَىٰ إِلْ يَاسِينَ', tr: 'İl-Yâsîn\'e selam olsun.', en: 'Peace be upon Il-Yasin.' },
  '37:132': { ref: 'Sâffât 37:132', ar: 'إِنَّهُ مِنْ عِبَادِنَا الْمُؤْمِنِينَ', tr: 'O şüphesiz bizim mü\'min kullarımızdandır.', en: 'Indeed, he was of Our believing servants.' },
  // ── Hz. Zekeriyyâ ──────────────────────────────────────────────────
  '3:37': { ref: 'Âl-i İmrân 3:37', ar: 'كُلَّمَا دَخَلَ عَلَيْهَا زَكَرِيَّا الْمِحْرَابَ وَجَدَ عِندَهَا رِزْقًا', tr: 'Zekeriyyâ, mihraba her girişinde onun yanında bir rızık buldu.', en: 'Every time Zechariah entered upon her in the prayer chamber, he found with her provision.' },
  '3:38': { ref: 'Âl-i İmrân 3:38', ar: 'هُنَالِكَ دَعَا زَكَرِيَّا رَبَّهُ ۖ قَالَ رَبِّ هَبْ لِي مِن لَّدُنكَ ذُرِّيَّةً طَيِّبَةً', tr: 'Orada Zekeriyyâ Rabbine yalvardı: Rabbim! Bana katından temiz bir nesil bağışla.', en: 'At that moment Zechariah called upon his Lord, saying: My Lord, grant me from Yourself a good offspring.' },
  '3:39': { ref: 'Âl-i İmrân 3:39', ar: 'فَنَادَتْهُ الْمَلَائِكَةُ وَهُوَ قَائِمٌ يُصَلِّي فِي الْمِحْرَابِ أَنَّ اللَّهَ يُبَشِّرُكَ بِيَحْيَىٰ', tr: 'Melekler, o mihrapta namaz kılarken seslendi: Allah sana Yahya\'yı müjdeliyor.', en: 'So the angels called him while he was standing in prayer in the chamber: Indeed, Allah gives you good tidings of John.' },
  '3:40': { ref: 'Âl-i İmrân 3:40', ar: 'قَالَ رَبِّ أَنَّىٰ يَكُونُ لِي غُلَامٌ وَقَدْ بَلَغَنِيَ الْكِبَرُ وَامْرَأَتِي عَاقِرٌ', tr: 'Dedi: Rabbim! İhtiyarlık beni sardı, karım kısır; benim nasıl oğlum olabilir?', en: 'He said: My Lord, how will there be for me a boy when old age has overtaken me and my wife is barren?' },
  '19:3': { ref: 'Meryem 19:3–4', ar: 'إِذْ نَادَىٰ رَبَّهُ نِدَاءً خَفِيًّا ۝ قَالَ رَبِّ إِنِّي وَهَنَ الْعَظْمُ مِنِّي وَاشْتَعَلَ الرَّأْسُ شَيْبًا', tr: 'Rabbine sessizce yalvardığı zaman, dedi: Rabbim! Kemiklerim zayıfladı, başım ağarmakla tutuştu.', en: 'When he called to his Lord with a private supplication, saying: My Lord, my bones have weakened and my head has filled with white.' },
  '19:7': { ref: 'Meryem 19:7', ar: 'يَا زَكَرِيَّا إِنَّا نُبَشِّرُكَ بِغُلَامٍ اسْمُهُ يَحْيَىٰ لَمْ نَجْعَل لَّهُ مِن قَبْلُ سَمِيًّا', tr: 'Ey Zekeriyyâ! Sana Yahya adında bir oğlan müjdeliyoruz; daha önce ona bu isimde hiç kimse koymadık.', en: 'O Zechariah, indeed We give you good tidings of a boy whose name will be John — We have not assigned to any before this name.' },
  '19:8': { ref: 'Meryem 19:8', ar: 'قَالَ رَبِّ أَنَّىٰ يَكُونُ لِي غُلَامٌ وَكَانَتِ امْرَأَتِي عَاقِرًا وَقَدْ بَلَغْتُ مِنَ الْكِبَرِ عِتِيًّا', tr: 'Dedi: Rabbim! Karım kısır olduğu ve ben ihtiyarlıkta son noktaya ulaştığım hâlde benim nasıl oğlum olabilir?', en: 'He said: My Lord, how will there be for me a boy when my wife is barren and I have reached extreme old age?' },
  '19:10': { ref: 'Meryem 19:10', ar: 'قَالَ رَبِّ اجْعَل لِّي آيَةً ۚ قَالَ آيَتُكَ أَلَّا تُكَلِّمَ النَّاسَ ثَلَاثَ لَيَالٍ سَوِيًّا', tr: 'Dedi: Rabbim! Bana bir alâmet ver. Buyurdu: Alâmetin, sağlıklı olduğun hâlde üç gece insanlarla konuşamamandır.', en: 'He said: My Lord, make for me a sign. He said: Your sign is that you will not speak to the people for three nights, being sound.' },
  '21:90': { ref: 'Enbiyâ 21:90', ar: 'فَاسْتَجَبْنَا لَهُ وَوَهَبْنَا لَهُ يَحْيَىٰ وَأَصْلَحْنَا لَهُ زَوْجَهُ ۚ إِنَّهُمْ كَانُوا يُسَارِعُونَ فِي الْخَيْرَاتِ', tr: 'Duasını kabul ettik; ona Yahya\'yı bağışladık ve eşini de ıslah ettik. Onlar hayır işlerde yarışırlardı.', en: 'So We responded to him and gave him John, and amended for him his wife. Indeed, they used to hasten to good deeds.' },
  // ── Hz. Yahyâ ──────────────────────────────────────────────────────
  '19:12': { ref: 'Meryem 19:12', ar: 'يَا يَحْيَىٰ خُذِ الْكِتَابَ بِقُوَّةٍ ۖ وَآتَيْنَاهُ الْحُكْمَ صَبِيًّا', tr: 'Ey Yahya! Kitaba kuvvetle sarıl. Ona daha çocukken hüküm verdik.', en: 'O John, take the Scripture with determination. And We gave him judgement as a child.' },
  '19:13': { ref: 'Meryem 19:13', ar: 'وَحَنَانًا مِّن لَّدُنَّا وَزَكَاةً ۖ وَكَانَ تَقِيًّا', tr: 'Katımızdan kalp yumuşaklığı ve temizlik verdik. O, çok takvalı biriydi.', en: 'And affection from Us and purity, and he was fearing of Allah.' },
  '19:14': { ref: 'Meryem 19:14', ar: 'وَبَرًّا بِوَالِدَيْهِ وَلَمْ يَكُن جَبَّارًا عَصِيًّا', tr: 'Anne-babasına iyilik ederdi; zorba ve isyankâr değildi.', en: 'And dutiful to his parents, and he was not arrogant or disobedient.' },
  '19:15': { ref: 'Meryem 19:15', ar: 'وَسَلَامٌ عَلَيْهِ يَوْمَ وُلِدَ وَيَوْمَ يَمُوتُ وَيَوْمَ يُبْعَثُ حَيًّا', tr: 'Doğduğu gün, öleceği gün ve diri olarak dirileceği gün ona selam olsun.', en: 'And peace upon him the day he was born and the day he dies and the day he is raised alive.' },
  // ── Hz. İsa ────────────────────────────────────────────────────────
  '3:45': { ref: 'Âl-i İmrân 3:45', ar: 'إِذْ قَالَتِ الْمَلَائِكَةُ يَا مَرْيَمُ إِنَّ اللَّهَ يُبَشِّرُكِ بِكَلِمَةٍ مِّنْهُ اسْمُهُ الْمَسِيحُ عِيسَى ابْنُ مَرْيَمَ', tr: 'Melekler demişti: Ey Meryem! Allah sana kendinden bir kelimeyi müjdeliyor; adı Mesih İsa b. Meryem.', en: 'The angels said: O Mary, indeed Allah gives you good tidings of a word from Him, whose name will be the Messiah, Jesus son of Mary.' },
  '3:59': { ref: 'Âl-i İmrân 3:59', ar: 'إِنَّ مَثَلَ عِيسَىٰ عِندَ اللَّهِ كَمَثَلِ آدَمَ ۖ خَلَقَهُ مِن تُرَابٍ ثُمَّ قَالَ لَهُ كُن فَيَكُونُ', tr: 'Allah katında İsa\'nın durumu Âdem gibidir; onu topraktan yarattı, sonra "ol" dedi ve oldu.', en: 'The likeness of Jesus before Allah is that of Adam — He created him from dust, then said to him: Be, and he was.' },
  '4:158': { ref: 'Nisâ 4:158', ar: 'بَل رَّفَعَهُ اللَّهُ إِلَيْهِ ۚ وَكَانَ اللَّهُ عَزِيزًا حَكِيمًا', tr: 'Bilakis Allah onu kendi katına yükseltti. Allah güçlüdür, hikmet sahibidir.', en: 'Rather, Allah raised him to Himself. And ever is Allah Exalted in Might and Wise.' },
  '5:46': { ref: 'Mâide 5:46', ar: 'وَقَفَّيْنَا عَلَىٰ آثَارِهِم بِعِيسَى ابْنِ مَرْيَمَ مُصَدِّقًا لِّمَا بَيْنَ يَدَيْهِ مِنَ التَّوْرَاةِ ۖ وَآتَيْنَاهُ الْإِنجِيلَ', tr: 'Peygamberlerin izinden Meryem oğlu İsa\'yı gönderdik; İncil\'i ona verdik.', en: 'And We sent Jesus son of Mary, confirming what came before him of the Torah; and We gave him the Gospel.' },
  '19:29': { ref: 'Meryem 19:29–33', ar: 'فَأَشَارَتْ إِلَيْهِ ۖ قَالُوا كَيْفَ نُكَلِّمُ مَن كَانَ فِي الْمَهْدِ صَبِيًّا ۝ قَالَ إِنِّي عَبْدُ اللَّهِ آتَانِيَ الْكِتَابَ وَجَعَلَنِي نَبِيًّا', tr: 'Meryem ona (bebeğe) işaret etti. "Beşikteki çocukla nasıl konuşuruz?" dediler. (Bebek) dedi: Ben Allah\'ın kuluyum; bana Kitab\'ı verdi ve beni peygamber kıldı.', en: 'She pointed to him. They said: How can we speak to one who is in the cradle as a child? He said: Indeed, I am the servant of Allah. He has given me the Scripture and made me a prophet.' },
  '61:6': { ref: 'Saf 61:6', ar: 'وَمُبَشِّرًا بِرَسُولٍ يَأْتِي مِن بَعْدِي اسْمُهُ أَحْمَدُ', tr: 'Benden sonra gelecek Ahmed adında bir peygamberi müjdeleyici olarak gönderildim.', en: 'And bringing good tidings of a messenger to come after me, whose name is Ahmad.' },
  '3:49': { ref: 'Âl-i İmrân 3:49', ar: 'أَنِّي أَخْلُقُ لَكُم مِّنَ الطِّينِ كَهَيْئَةِ الطَّيْرِ فَأَنفُخُ فِيهِ فَيَكُونُ طَيْرًا بِإِذْنِ اللَّهِ ۖ وَأُبْرِئُ الْأَكْمَهَ وَالْأَبْرَصَ وَأُحْيِي الْمَوْتَىٰ بِإِذْنِ اللَّهِ', tr: 'Çamurdan kuş şeklinde bir şey yapar, içine üflerim ve Allah\'ın izniyle kuş olur; körü ve alacalıyı iyileştirir, Allah\'ın izniyle ölüleri diriltirim.', en: 'I will make for you from clay the form of a bird and breathe into it, and it will be a bird by Allah\'s permission. I will cure the blind and the leper and bring the dead to life by Allah\'s permission.' },
  '4:171': { ref: 'Nisâ 4:171', ar: 'إِنَّمَا الْمَسِيحُ عِيسَى ابْنُ مَرْيَمَ رَسُولُ اللَّهِ وَكَلِمَتُهُ أَلْقَاهَا إِلَىٰ مَرْيَمَ وَرُوحٌ مِّنْهُ', tr: 'Mesih İsa b. Meryem; yalnızca Allah\'ın elçisi, Meryem\'e ilkâ ettiği kelimesi ve O\'ndan bir ruhtur.', en: 'The Messiah, Jesus son of Mary, was but a messenger of Allah and His word which He directed to Mary and a soul from Him.' },
  '5:114': { ref: 'Mâide 5:114', ar: 'اللَّهُمَّ رَبَّنَا أَنزِلْ عَلَيْنَا مَائِدَةً مِّنَ السَّمَاءِ تَكُونُ لَنَا عِيدًا لِّأَوَّلِنَا وَآخِرِنَا وَآيَةً مِّنكَ', tr: 'Allah\'ım, Rabbimiz! Bize gökten bir sofra indir; ilkimize ve sonuncumuza bayram, senden bir ayet olsun.', en: 'O Allah, our Lord, send down to us a table from heaven to be for us a festival and a sign from You.' },
  // ── Hz. Muhammed ﷺ ─────────────────────────────────────────────────
  '21:107': { ref: 'Enbiyâ 21:107', ar: 'وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً لِّلْعَالَمِينَ', tr: 'Seni âlemlere yalnızca rahmet olarak gönderdik.', en: 'And We have not sent you except as a mercy to the worlds.' },
  '33:21': { ref: 'Ahzâb 33:21', ar: 'لَّقَدْ كَانَ لَكُمْ فِي رَسُولِ اللَّهِ أُسْوَةٌ حَسَنَةٌ', tr: 'Allah\'ın Resûlü\'nde sizin için güzel bir örnek vardır.', en: 'There has certainly been for you in the Messenger of Allah an excellent model of conduct.' },
  '33:40': { ref: 'Ahzâb 33:40', ar: 'مَّا كَانَ مُحَمَّدٌ أَبَا أَحَدٍ مِّن رِّجَالِكُمْ وَلَٰكِن رَّسُولَ اللَّهِ وَخَاتَمَ النَّبِيِّينَ', tr: 'Muhammed, erkeklerinizden hiçbirinin babası değildir; fakat o Allah\'ın elçisi ve peygamberlerin sonuncusudur.', en: 'Muhammad is not the father of any one of your men, but he is the Messenger of Allah and the seal of the prophets.' },
  '33:45': { ref: 'Ahzâb 33:45', ar: 'يَا أَيُّهَا النَّبِيُّ إِنَّا أَرْسَلْنَاكَ شَاهِدًا وَمُبَشِّرًا وَنَذِيرًا', tr: 'Ey Peygamber! Biz seni şahit, müjdeci ve uyarıcı olarak gönderdik.', en: 'O Prophet, indeed We have sent you as a witness and a bringer of glad tidings and a warner.' },
  '68:4': { ref: 'Kalem 68:4', ar: 'وَإِنَّكَ لَعَلَىٰ خُلُقٍ عَظِيمٍ', tr: 'Sen gerçekten yüce bir ahlak üzeresin.', en: 'And indeed, you are of a great moral character.' },
  '53:13': { ref: 'Necm 53:13–18', ar: 'وَلَقَدْ رَآهُ نَزْلَةً أُخْرَىٰ ۝ عِندَ سِدْرَةِ الْمُنتَهَىٰ', tr: 'Andolsun ki onu bir kez daha gördü; Sidretü\'l-Müntehâ\'nın yanında.', en: 'And he certainly saw him in another descent, at the Lote Tree of the Utmost Boundary.' },
  '17:1': { ref: 'İsrâ 17:1', ar: 'سُبْحَانَ الَّذِي أَسْرَىٰ بِعَبْدِهِ لَيْلًا مِّنَ الْمَسْجِدِ الْحَرَامِ إِلَى الْمَسْجِدِ الْأَقْصَى الَّذِي بَارَكْنَا حَوْلَهُ', tr: 'Kulunu bir gece Mescid-i Haram\'dan çevresini bereketli kıldığımız Mescid-i Aksa\'ya götüren Allah münezzehtir.', en: 'Exalted is He who took His Servant by night from al-Masjid al-Haram to al-Masjid al-Aqsa, whose surroundings We have blessed.' },

  '37:79': {
    ref: 'Sâffât 37:79',
    ar: 'سَلَامٌ عَلَىٰ نُوحٍ فِي الْعَالَمِينَ',
    tr: 'Âlemlerde Nuh\'a selam olsun.',
    en: 'Peace be upon Noah among all the worlds.',
  },
  '6:84': {
    ref: 'En\'âm 6:84',
    ar: 'وَوَهَبْنَا لَهُ إِسْحَاقَ وَيَعْقُوبَ ۚ كُلًّا هَدَيْنَا ۚ وَنُوحًا هَدَيْنَا مِن قَبْلُ',
    tr: 'Ona İshak\'ı ve Yakub\'u bağışladık; hepsini doğru yola ilettik. Daha önce Nuh\'u da doğru yola iletmiştik.',
    en: 'And We gave him Isaac and Jacob — all of them We guided. And Noah We had guided before.',
  },
  '19:56': {
    ref: 'Meryem 19:56',
    ar: 'وَاذْكُرْ فِي الْكِتَابِ إِدْرِيسَ ۚ إِنَّهُ كَانَ صِدِّيقًا نَّبِيًّا',
    tr: 'Kitap\'ta İdris\'i de an. O, doğru sözlü bir peygamberdi.',
    en: 'And mention in the Book, Idris. Indeed, he was a man of truth and a prophet.',
  },
  '19:57': {
    ref: 'Meryem 19:57',
    ar: 'وَرَفَعْنَاهُ مَكَانًا عَلِيًّا',
    tr: 'Onu yüce bir mevkiye yükselttik.',
    en: 'And We raised him to a high station.',
  },
  '21:85': {
    ref: 'Enbiyâ 21:85',
    ar: 'وَإِسْمَاعِيلَ وَإِدْرِيسَ وَذَا الْكِفْلِ ۖ كُلٌّ مِّنَ الصَّابِرِينَ',
    tr: 'İsmail\'i, İdris\'i ve Zülkifl\'i de (an). Hepsi sabırlı kimselerdendi.',
    en: 'And Ishmael, and Idris, and Dhul-Kifl — all were of the patient.',
  },
  '21:86': {
    ref: 'Enbiyâ 21:86',
    ar: 'وَأَدْخَلْنَاهُمْ فِي رَحْمَتِنَا ۖ إِنَّهُم مِّنَ الصَّالِحِينَ',
    tr: 'Onları rahmetimize kattık. Gerçekten onlar salih kimselerdi.',
    en: 'And We admitted them into Our mercy. Indeed, they were of the righteous.',
  },
};

// Vasıf metinlerindeki (NN:NN) referansları tıklanabilir span'lara dönüştürür.
// GIFT_VERSE_REFS'te biliniyorsa altın + dotted underline; bilinmiyorsa sade sure adı.
function renderGiftText(text, lang, onRefClick) {
  const parts = text.split(/(\(\d+:\d+(?:[–\u2013-]\d+)?\))/g);
  return parts.map((part, i) => {
    const m = part.match(/^\((\d+):(\d+)(?:[–\u2013-]\d+)?\)$/);
    if (!m) return part ? <span key={i}>{part}</span> : null;
    const surahNum = +m[1];
    const verseNum = m[2];
    const key = `${surahNum}:${verseNum}`;
    const name = SURAH_NAMES[surahNum];
    const label = name ? (lang === 'tr' ? name.tr : name.en) : `Sure ${surahNum}`;
    // Aralık varsa (ör. 2:31–33) verse bölümünü koruyalım
    const verseDisplay = part.replace(/^\(\d+:/, '').replace(/\)$/, '');
    const isKnown = !!GIFT_VERSE_REFS[key];
    const isMekki = (RANK_BY_SURAH[surahNum] ?? 0) <= 86;
    const refColor = isMekki ? '#d4a574' : 'rgba(52,211,153,0.9)';
    const borderColor = isMekki ? 'rgba(212,165,116,0.55)' : 'rgba(52,211,153,0.5)';
    return (
      <span
        key={i}
        onClick={isKnown ? ev => onRefClick(key, ev) : undefined}
        style={{
          color: refColor,
          cursor: isKnown ? 'pointer' : 'default',
          borderBottom: isKnown ? `1px dotted ${borderColor}` : 'none',
          fontWeight: 600,
        }}
      >
        ({label} {verseDisplay}{isKnown ? ' ↗' : ''})
      </span>
    );
  });
}

// "Bakara 2:37" → "Bakara 37",  "Sâd 38:75" → "Sâd 75"
function fmtPopupRef(ref) {
  if (!ref) return ref;
  return ref.replace(/\s\d+:/, ' ');
}

// Peygamberler Silsilesi diyagramındaki ayet referansları için tooltip verisi.
// Her giriş: ar (Arapça metin), tr (Türkçe meal), en (İngilizce meal).
const TREE_REFS = {
  'Sâffât 102': {
    ref: 'Sâffât 37:102',
    ar: 'فَلَمَّا بَلَغَ مَعَهُ السَّعْيَ قَالَ يَا بُنَيَّ إِنِّي أَرَىٰ فِي الْمَنَامِ أَنِّي أَذْبَحُكَ فَانظُرْ مَاذَا تَرَىٰ',
    tr: 'Oğlu onunla birlikte koşup yürüyecek yaşa erişince: "Yavrucuğum, rüyamda seni boğazladığımı görüyorum; bir düşün, ne dersin?" dedi.',
    en: 'When he reached with him the age of exertion, he said: "O my son, I have seen in a dream that I must sacrifice you — so see what you think."',
  },
  'Sâffât 112': {
    ref: 'Sâffât 37:112',
    ar: 'وَبَشَّرْنَاهُ بِإِسْحَاقَ نَبِيًّا مِّنَ الصَّالِحِينَ',
    tr: 'Ona, salihlerden bir peygamber olarak İshak\'ı müjdeledik.',
    en: 'And We gave him good tidings of Isaac, a prophet from among the righteous.',
  },
  'Hûd 71': {
    ref: 'Hûd 11:71',
    ar: 'فَبَشَّرْنَاهَا بِإِسْحَاقَ وَمِن وَرَاءِ إِسْحَاقَ يَعْقُوبَ',
    tr: 'Ona İshak\'ı, İshak\'ın ardından da Yakûb\'u müjdeledik.',
    en: 'So We gave her good tidings of Isaac and, after Isaac, Jacob.',
  },
  'Yûsuf 5': {
    ref: 'Yûsuf 12:5',
    ar: 'قَالَ يَا بُنَيَّ لَا تَقْصُصْ رُؤْيَاكَ عَلَىٰ إِخْوَتِكَ فَيَكِيدُوا لَكَ كَيْدًا',
    tr: 'Babası: "Yavrucuğum, rüyanı kardeşlerine anlatma; yoksa sana tuzak kurarlar" dedi.',
    en: 'He said: "O my son, do not relate your vision to your brothers, or they will contrive against you a plan."',
  },
  'Tâhâ 30': {
    ref: 'Tâhâ 20:29–30',
    ar: 'وَاجْعَل لِّي وَزِيرًا مِّنْ أَهْلِي هَارُونَ أَخِي',
    tr: '"Ailemden bana bir yardımcı ver; kardeşim Hârûn\'u." — Mûsâ\'nın duasından.',
    en: '"And appoint for me a minister from my family — Aaron, my brother." — From Moses\' prayer.',
  },
  'Sâd 30': {
    ref: 'Sâd 38:30',
    ar: 'وَوَهَبْنَا لِدَاوُودَ سُلَيْمَانَ ۚ نِعْمَ الْعَبْدُ ۖ إِنَّهُ أَوَّابٌ',
    tr: 'Dâvûd\'a Süleymân\'ı bağışladık. Ne güzel kul! Daima Allah\'a yönelirdi.',
    en: 'And We gave to David, Solomon. What an excellent servant! Indeed, he was ever returning [to Allah].',
  },
  'Meryem 7': {
    ref: 'Meryem 19:7',
    ar: 'يَا زَكَرِيَّا إِنَّا نُبَشِّرُكَ بِغُلَامٍ اسْمُهُ يَحْيَىٰ لَمْ نَجْعَل لَّهُ مِن قَبْلُ سَمِيًّا',
    tr: '"Ey Zekeriyyâ! Sana Yahyâ adında bir oğul müjdeliyoruz; daha önce ona adaş kimse yaratmamıştık."',
    en: '"O Zechariah, indeed We give you good tidings of a boy whose name will be Yahya. We have not assigned to any before this name."',
  },
};

// duaRef ("7:23" veya "20:25-26") → dua-arabic.json'dan API-encoding Arabic metni
// Çoklu ayet (20:25-26) için versetler arası boşlukla birleştirir.
function getDuaApiAr(ref, apiMap) {
  if (!ref || !Object.keys(apiMap).length) return null;
  // Çoklu ayet: "20:25-26" → ["20:25", "20:26"]
  const rangeMatch = ref.match(/^(\d+):(\d+)-(\d+)$/);
  if (rangeMatch) {
    const [, s, start, end] = rangeMatch;
    const parts = [];
    for (let a = +start; a <= +end; a++) {
      const v = apiMap[`${s}:${a}`];
      if (v) parts.push(v);
    }
    return parts.length ? parts.join(' ') : null;
  }
  return apiMap[ref] || null;
}

const SURAH_NAMES = {
  1:{tr:'Fâtiha',en:'Al-Fatiha'}, 2:{tr:'Bakara',en:'Al-Baqarah'}, 3:{tr:'Âl-i İmrân',en:'Al-Imran'},
  4:{tr:'Nisâ',en:'An-Nisa'}, 5:{tr:'Mâide',en:'Al-Maidah'}, 6:{tr:'En\'âm',en:'Al-Anam'},
  7:{tr:'A\'râf',en:'Al-Araf'}, 10:{tr:'Yûnus',en:'Yunus'}, 11:{tr:'Hûd',en:'Hud'},
  12:{tr:'Yûsuf',en:'Yusuf'}, 14:{tr:'İbrâhîm',en:'Ibrahim'}, 17:{tr:'İsrâ',en:'Al-Isra'},
  18:{tr:'Kehf',en:'Al-Kahf'}, 19:{tr:'Meryem',en:'Maryam'}, 20:{tr:'Tâhâ',en:'Taha'},
  21:{tr:'Enbiyâ',en:'Al-Anbiya'}, 22:{tr:'Hac',en:'Al-Hajj'}, 23:{tr:'Mü\'minûn',en:'Al-Muminun'},
  26:{tr:'Şuarâ',en:'Ash-Shuara'}, 27:{tr:'Neml',en:'An-Naml'}, 28:{tr:'Kasas',en:'Al-Qasas'},
  29:{tr:'Ankebût',en:'Al-Ankabut'}, 32:{tr:'Secde',en:'As-Sajda'}, 33:{tr:'Ahzâb',en:'Al-Ahzab'}, 34:{tr:'Sebe',en:'Saba'},
  36:{tr:'Yâsîn',en:'Ya-Sin'}, 37:{tr:'Sâffât',en:'As-Saffat'}, 38:{tr:'Sâd',en:'Sad'}, 40:{tr:'Mü\'min',en:"Al-Mu'min"},
  43:{tr:'Zuhruf',en:'Az-Zukhruf'}, 46:{tr:'Ahkâf',en:'Al-Ahqaf'}, 47:{tr:'Muhammed',en:'Muhammad'},
  48:{tr:'Feth',en:'Al-Fath'}, 51:{tr:'Zâriyât',en:'Adh-Dhariyat'}, 54:{tr:'Kamer',en:'Al-Qamar'},
  57:{tr:'Hadîd',en:'Al-Hadid'}, 61:{tr:'Saf',en:'As-Saff'}, 71:{tr:'Nûh',en:'Nuh'},
  79:{tr:'Nâziât',en:'An-Naziat'}, 87:{tr:'A\'lâ',en:"Al-A'la"},
  15:{tr:'Hicr',en:'Al-Hijr'},
  16:{tr:'Nahl',en:'An-Nahl'},
  9:{tr:'Tevbe',en:'At-Tawbah'},
  53:{tr:'Necm',en:'An-Najm'},
  68:{tr:'Kalem',en:'Al-Qalam'},
};

// 25 peygamberin tamamı — kronolojik sıra
// Kur'an nassıyla sabit bilgiler: zikir sayısı, sûreler, vasıflar, dualar
// Soy bağları sadece Kur'an'da açıkça geçenler için gösterilir
const PROPHETS_REF = [
  {
    id:'adem', nameTr:'Hz. Âdem', nameEn:'Adam', mentions:25,
    surahs:[2,3,5,7,17,18,19,20,36,38],
    giftsTr:[
      "Allah (C.C.)'ın iki eliyle yarattığı açıkça belirtilen varlık (38:75)",
      "Allah ona kendi ruhundan üfledi (32:9)",
      "Yeryüzünde halife olarak atandı (2:30)",
      "Tüm isimleri öğrendi; meleklerin bilmediği ilim ona verildi (2:31–33)",
      "Melekler ona secde etti — insanlık tarihinde ilk ve tek secde şerefi (2:34)",
      "İblis'in kibrinin nedeni: 'Ben ateşten, o çamurdan' — Kur'an'ın anlattığı ilk büyüklenme (7:12)",
      "Pişmanlığını ifade etmek için Allah'tan kelimeler aldı; tövbesi kabul edildi (2:37)",
      "Tövbenin ardından Allah onu nebî olarak seçti ve doğru yola iletti (20:122)",
      "Hz. İsa ile mukayese edildi: 'Allah katında İsa'nın durumu Âdem gibidir' (3:59)",
    ],
    giftsEn:[
      "The being Allah explicitly created with His own two hands (38:75)",
      "Allah breathed His own spirit into him (32:9)",
      "Appointed as vicegerent (khalifa) on earth (2:30)",
      "Taught all names — knowledge the angels did not possess (2:31–33)",
      "Angels prostrated to him — the first and only prostration in human history (2:34)",
      "Iblis's pride: 'I am of fire, he of clay' — the Quran's first recorded arrogance (7:12)",
      "Sought forgiveness with words received from his Lord; his repentance was accepted (2:37)",
      "After his repentance, Allah chose him as prophet and guided him aright (20:122)",
      "Compared to Jesus: 'The likeness of Jesus before Allah is as that of Adam' (3:59)",
    ],
    duaAr:'رَبَّنَا ظَلَمۡنَآ أَنفُسَنَا وَإِن لَّمۡ تَغۡفِرۡ لَنَا وَتَرۡحَمۡنَا لَنَكُونَنَّ مِنَ ٱلۡخَٰسِرِينَ',
    duaTr:'Rabbimiz! Biz kendimize zulmettik. Bağışlamaz ve merhamet etmezsen kaybedenlerden oluruz.',
    duaEn:'Our Lord! We have wronged ourselves. If You do not forgive us and have mercy on us, we will surely be losers.',
    duaRef:'7:23',
    giftsTooltipsTr: { 4: 'Kur\'an bu ifadeyi doğrudan kullanmaz; Bakara 2:34\'ten İbn Kesîr, Taberî gibi klasik müfessirlerin çıkardığı bağlamsal sonuçtur.' },
    giftsTooltipsEn: { 4: 'The Quran does not state this explicitly; it is a contextual inference drawn by classical scholars (Ibn Kathir, Tabari) from Al-Baqarah 2:34.' },
  },
  {
    id:'idris', nameTr:'Hz. İdris', nameEn:'Idris', mentions:2,
    surahs:[19,21],
    giftsTr:[
      "Sıddık ve nebilerden (19:56)",
      "Yüksek bir mevkiye yükseltildi (19:57)",
      "Sabredenlerden; Hz. İsmail ve Zülkifl ile aynı grupta anıldı (21:85)",
      "Allah'ın rahmetine dahil edildi; salihlerden (21:86)",
    ],
    giftsEn:[
      "Among the truthful (siddiq) and prophets (19:56)",
      "Raised to a high station (19:57)",
      "Among the patient; mentioned alongside Ishmael and Dhul-Kifl (21:85)",
      "Included in Allah's mercy; among the righteous (21:86)",
    ],
    giftsTooltipsTr:{
      0: "Kur'an'da yalnızca iki kişiye 'sıddık' unvanı verilmiştir: Hz. İdris (Meryem 56) ve Hz. Yusuf (Yusuf 46). Nadir bir ayrıcalık.",
      1: "Müfessirler arasında tartışmalıdır: bir görüşe göre diri olarak göklere yükseltildi (Hz. İsa ile benzer); diğer görüşe göre makam ve derece yüksekliği kastedilmektedir.",
    },
    giftsTooltipsEn:{
      0: "Only two people are given the title 'siddiq' in the Quran: Idris (Maryam 56) and Yusuf (Yusuf 46). A rare distinction.",
      1: "Debated among scholars: one view holds he was raised alive to the heavens (similar to Jesus); another holds it refers to exalted rank and station.",
    },
    noteTr: "Kur'an'ın en az söz ettiği peygamberlerden biri — sadece 2 kez geçer. Her kelimesi özenle seçilmiş.",
    noteEn: "Among the least-mentioned prophets in the Quran — named only twice. Every word is precisely chosen.",
    duaAr:null,duaTr:null,duaEn:null,duaRef:null,
  },
  {
    id:'nuh', nameTr:'Hz. Nuh', nameEn:'Noah', mentions:43, detailed:true,
    surahs:[7,10,11,21,23,26,29,37,54,71],
    giftsTr:[
      "Kavmi arasında 950 yıl kaldı (29:14)",
      "Gemi yapımı vahiyle öğretildi (11:37)",
      "'Şükredici kul' unvanıyla anıldı — Kur'an'da çok az kişiye verilmiş özel bir lakap (17:3)",
      "Öz oğlu tufanda boğuldu; Allah bu ayrılığı 'senin ehlinden değil' diyerek açıkladı (11:45–46)",
      "Allah'ın tüm âlemlere Nuh'a selam gönderdiği bildirildi (37:79)",
      "Neslinden İbrahim, İshak, Yakub ve daha birçok peygamber geldi (6:84)",
    ],
    giftsEn:[
      "Remained among his people for 950 years (29:14)",
      "Taught to build the ark by revelation (11:37)",
      "Called 'a grateful servant' — a rare title given to very few in the Quran (17:3)",
      "His own son drowned in the flood; Allah told him: 'He is not of your family' (11:45–46)",
      "Allah sent salutations upon Noah before all the worlds (37:79)",
      "His descendants include Ibrahim, Ishaq, Yaqub and many other prophets (6:84)",
    ],
    giftsTooltipsTr:{
      2: "İsrâ 17:3'te Hz. Nuh 'şükredici bir kul' (abdün şekûr) olarak nitelendiriliyor. Kur'an'da bir peygambere bu şekilde doğrudan 'kul' sıfatıyla övgüde bulunmak çok nadirdir.",
      3: "Hûd 11:45-46 — Hz. Nuh oğlunu ailesi olarak sayarak onun da gemiye binmesini istedi. Allah, 'O senin ehlinden değil; o salih olmayan bir iş işledi' diye cevap verdi.",
      4: "Sâffât 37:79 — 'Selâmun alâ Nûhin fi'l-âlemîn.' Bu formülasyonla âlemlere selam gönderilmesi Kur'an'da son derece nadir bir şereftir.",
    },
    giftsTooltipsEn:{
      2: "In Al-Isra 17:3, Noah is described as 'a grateful servant' (abdun shakur). Being praised directly as a 'servant' (abd) in this manner is very rare for a prophet in the Quran.",
      3: "Hud 11:45-46 — Noah asked Allah to save his son, counting him as family. Allah replied: 'He is not of your family; indeed, he is one whose work was other than righteous.'",
      4: "As-Saffat 37:79 — 'Peace be upon Noah among all the worlds.' This formulaic greeting sent across all worlds is an extremely rare honour in the Quran.",
    },
    duaAr:'رَّبِّ إِنِّي مَغۡلُوبٞ فَٱنتَصِرۡ',
    duaTr:'Rabbim! Ben yenildim, sen yardım et.',
    duaEn:'My Lord! I am overpowered, so help me.',
    duaRef:'54:10',
  },
  {
    id:'hud', nameTr:'Hz. Hûd', nameEn:'Hud', mentions:7,
    surahs:[7,11,26,46],
    giftsTr:[
      "Âd kavmine gönderildi (7:65)",
      "Şirki bırakmalarını ve istiğfar etmelerini istedi; karşılığında yağmur ve güç vaat etti (11:52)",
      "Kavmi ona 'beyinsiz' ve 'yalancı' dedi — Hz. Muhammed'e yapılan ithamlarla aynı (7:66)",
      "'Ben size güvenilir bir elçiyim' dedi; tebliğ için ücret istemedi (26:125–127)",
      "Âd kavmi 'her şeyi yerle bir eden, hiçbir şey bırakmayan bir rüzgarla' helak edildi (46:25)",
      "Kıyamete dek Âd'ın ardından lanet sürdü — 'uzak olsun Âd kavmi!' (11:60)",
    ],
    giftsEn:[
      "Sent to the people of Aad (7:65)",
      "Commanded them to abandon shirk and seek forgiveness; promised rain and strength in return (11:52)",
      "His people called him 'foolish' and 'liar' — the exact same slanders directed at the Prophet (7:66)",
      "'I am a trustworthy messenger to you' — and asked for no payment for his message (26:125–127)",
      "The Aad were destroyed by 'a wind that leaves nothing, sparing nothing' (46:25)",
      "A curse was made to follow Aad until the Day of Judgment — 'Away with Aad!' (11:60)",
    ],
    giftsTooltipsTr:{
      2: "A'râf 7:66 — Kavminin ileri gelenleri 'Biz seni beyinsizlikte görüyoruz ve seni yalancılardan sanıyoruz' dedi. Kur'an bu ifadeyi bilinçli tekrar eder — Hz. Muhammed'e yapılan suçlamalarla örtüşmesi tesadüf değildir.",
      4: "Ahkâf 46:24-25 — Azap rüzgarını önce bulut sanan kavim, yaklaştığında gerçeği anladı. 'Her şeyi Rabbinin emriyle yerle bir eder' ifadesi Kur'an'ın en çarpıcı azap tasvirlerinden biridir.",
    },
    giftsTooltipsEn:{
      2: "Al-Araf 7:66 — Their leaders said: 'We see you in foolishness and think you among the liars.' The Quran deliberately echoes this — its parallel with accusations against the Prophet is not coincidental.",
      4: "Al-Ahqaf 46:24-25 — The people first mistook the punishment for rain clouds. 'Destroying everything by the command of its Lord' is among the most vivid punishment descriptions in the Quran.",
    },
    duaAr:'رَبِّيَ اللَّهُ',
    duaTr:'Rabbim Allah\'tır.',
    duaEn:'My Lord is Allah.',
    duaRef:'11:56',
  },
  {
    id:'salih', nameTr:'Hz. Sâlih', nameEn:'Salih', mentions:9,
    surahs:[7,11,26,27],
    giftsTr:[
      "Semud kavmine gönderildi; taş kayalara ev oyan bu kavme mucize deve (nâka) ile çıktı (7:73–74)",
      "Tebliğ için ücret istemedi (26:145); kavmi ona 'büyülenmiş biri' dedi (26:153)",
      "9 kişilik bozguncu grup mucize deveyi kesti (27:48)",
      "Devenin kesilmesinin ardından '3 gün daha yararlanın, sonra azap gelecek' dedi (11:65)",
      "Semud, gök gürültüsüyle helak edildi — her kavmin azabı farklı (11:67)",
      "Semud'un izi silindi; sadece yurtları kaldı — bugün Mada'in Sâlih (Hegra) adıyla bilinen UNESCO alanı (7:74)",
    ],
    giftsEn:[
      "Sent to the Thamud; came with a miraculous she-camel to a people who carved homes into rock (7:73–74)",
      "Asked no payment for his message (26:145); his people called him 'bewitched' (26:153)",
      "A gang of nine men slaughtered the miraculous she-camel (27:48)",
      "After the camel was killed, he declared: 'Enjoy yourselves for three more days, then the punishment will come' (11:65)",
      "The Thamud were destroyed by a thunderbolt — each people's punishment differs (11:67)",
      "The Thamud were wiped out; only their dwellings remained — today known as Mada'in Salih (Hegra), a UNESCO World Heritage Site (7:74)",
    ],
    giftsTooltipsTr:{
      0: "A'râf 7:74 — 'Sizi Âd'dan sonra halifeler kıldı ve sizi yeryüzünde yerleştirdi; orada ovalarında saraylar, dağlarında evler yapıyorsunuz.' Semud'un kaya evleri bugün Suudi Arabistan'daki Mada'in Sâlih (Hegra) alanıyla örtüşmektedir — UNESCO Dünya Mirası.",
      2: "Neml 27:48-49 — Bu 9 kişi aynı zamanda Hz. Sâlih'i öldürmeyi de planlıyordu. Kur'an onların planından haberdar olduğunu bildiriyor.",
      3: "Hûd 11:65 — Kur'an'ın geri sayım ultimatumu. Bu format — 'X gün sonra azap' — peygamber kıssaları içinde eşsizdir. Üç günün her biri için farklı alamet aktarılır (klasik tefsirlerde).",
    },
    giftsTooltipsEn:{
      0: "Al-Araf 7:74 — 'He made you successors after Aad and settled you in the land; you take castles from its plains and carve houses from the mountains.' Thamud's rock-cut dwellings correspond to Mada'in Salih (Hegra) in Saudi Arabia — a UNESCO World Heritage Site.",
      2: "An-Naml 27:48-49 — These nine men also conspired to assassinate Salih. The Quran reveals their plot was known before they acted.",
      3: "Hud 11:65 — The Quran's countdown ultimatum. This format — 'punishment in X days' — is unique among the prophet narratives. Classical tafsir records a different sign for each of the three days.",
    },
    duaAr:'يَا قَوْمِ لَقَدْ أَبْلَغْتُكُمْ رِسَالَةَ رَبِّي',
    duaTr:'Ey kavmim! Rabbimin mesajını size eksiksiz ilettim.',
    duaEn:'O my people! I have conveyed to you the message of my Lord.',
    duaRef:'7:79',
  },
  {
    id:'ibrahim', nameTr:'Hz. İbrahim', nameEn:'Abraham', mentions:69, detailed:true,
    surahs:[2,3,4,6,11,14,19,21,22,26,29,37,51,87],
    giftsTr:[
      "Halîlullah — Allah'ın dostu unvanı; Kur'an'da yalnızca ona verilmiştir (4:125)",
      "Hanîf — ne Yahudi ne Hristiyan; saf tevhidin öncüsü (3:67)",
      "Babasına verdiği söz nedeniyle onun için istiğfar etti; hakikat açıkça ortaya çıkınca ondan uzaklaştı (19:47)",
      "Putları kırdı, tek büyüğünü bıraktı: 'Bunu büyükleri yaptı, ona sorun' (21:58–63)",
      "Ateşe atıldı; Allah ateşi serin ve selametli kıldı (21:69)",
      "İleri yaşta Hz. İsmail ile Kâbe'yi inşa etti ve tevhid duasıyla bitirdi (2:127)",
      "Hz. İshak ile müjdelendi; ardından Hz. Yakub da bildirildi (11:71)",
      "Oğlunu kurban etmeye razı oldu — Allah bunu büyük bir sınav olarak nitelendirdi (37:103–107)",
      "İbrahimî millet: Hz. Muhammed'e 'İbrahim'in milletine uy' emri verildi (16:123)",
    ],
    giftsEn:[
      "Khalilullah — Allah's intimate friend; a title given to no one else in the Quran (4:125)",
      "Hanif — neither Jewish nor Christian; the father of pure monotheism (3:67)",
      "Sought forgiveness for his father because of a promise he had made; when the truth became clear, he disassociated (19:47)",
      "Smashed the idols but left the largest; then said: 'Ask the big one, he did it' (21:58–63)",
      "Thrown into fire; Allah commanded the fire to be cool and safe upon him (21:69)",
      "At an advanced age, built the Kaaba with Ishmael and sealed it with a prayer of tawhid (2:127)",
      "Given the glad tidings of Isaac, and after him, of Jacob (11:71)",
      "Consented to sacrifice his son — Allah declared this a 'manifest trial' (37:103–107)",
      "The Abrahamic nation: the Prophet was commanded to 'follow the religion of Abraham' (16:123)",
    ],
    giftsTooltipsTr:{
      0: "Nisâ 4:125 — 'Allah İbrahim'i dost (halîl) edindi.' Halîl, dostlukta en yüksek mertebe. Kur'an bu unvanı başka hiçbir peygambere vermez.",
      2: "Tevbe 9:114 — 'İbrahim'in babası için istiğfar etmesi, yalnızca ona verdiği bir söz yüzündendi. Onun Allah'ın düşmanı olduğu açıkça belli olunca ondan uzaklaştı.' İstiğfar bir keşfin değil, vefanın ifadesidir.",
      3: "Enbiyâ 21:62-63 — 'Bunu kim yaptı?' diye sorduklarında İbrahim: 'Belki şunu yaptı, ona sorun, eğer konuşabiliyorsa.' Kendisi yaparken gördüklerine rağmen cevap veremediler. Kur'an'ın en keskin hiciv sahnesi.",
      7: "Sâffât 37:103-107 — Oğlu 'emrolunduğun şeyi yap' dedi, ikisi de teslim oldu. Allah son anda fidye gönderdi. 'İşte biz iyileri böyle mükâfatlandırırız.'",
    },
    giftsTooltipsEn:{
      0: "An-Nisa 4:125 — 'Allah took Abraham as a khalil (intimate friend).' Khalil is the highest rank of friendship. The Quran grants this title to no other prophet.",
      2: "At-Tawbah 9:114 — 'Abraham's seeking forgiveness for his father was only because of a promise he had made. When it became clear that he was an enemy of Allah, he disassociated himself.' The intercession was loyalty, not ignorance.",
      3: "Al-Anbiya 21:62-63 — When asked who destroyed the idols, Ibrahim said: 'Perhaps the big one did it — ask him, if he can speak.' They had seen him do it but couldn't answer. The Quran's sharpest scene of wit.",
      7: "As-Saffat 37:103-107 — His son said: 'Do what you are commanded.' Both submitted. Allah sent a ransom at the last moment. 'Indeed, this was a clear trial.'",
    },
    duaAr:'رَبَّنَا تَقَبَّلۡ مِنَّآ إِنَّكَ أَنتَ ٱلسَّمِيعُ ٱلۡعَلِيمُ',
    duaTr:'Rabbimiz! Bizden kabul et. Şüphesiz sen Semi\'sin, Alîm\'sin.',
    duaEn:'Our Lord! Accept this from us. You are the All-Hearing, All-Knowing.',
    duaRef:'2:127',
  },
  {
    id:'lut', nameTr:'Hz. Lût', nameEn:'Lot', mentions:27,
    surahs:[7,11,15,21,26,29,37],
    giftsTr:[
      "Hz. İbrahim ile birlikte bereketli topraklara hicret etti (21:71)",
      "Hikmet ve ilim verildi; salihlerden sayıldı (21:74–75)",
      "Kavmi onu ve ailesini yurttan sürmekle tehdit etti (27:56)",
      "Melekler misafir geldi; şehrin helak edileceğini, sabaha kadar ayrılmasını bildirdi — eşi geride kalacaktı (11:81)",
      "Eşi inanmayanlarla birlikte helak oldu (7:83)(66:10)",
      "Şehir alt üst edildi; üzerlerine sicîl taşları yağdırıldı (11:82)",
    ],
    giftsEn:[
      "Emigrated together with Ibrahim to the blessed land (21:71)",
      "Given wisdom and knowledge; counted among the righteous (21:74–75)",
      "His people threatened to expel him and his family from their town (27:56)",
      "Angels came as guests; informed him the city would be destroyed and he must leave before dawn — his wife would remain behind (11:81)",
      "His wife was destroyed alongside the disbelievers (7:83)(66:10)",
      "The city was overturned; rained upon with stones of sijjil (11:82)",
    ],
    giftsTooltipsTr:{
      0: "Enbiyâ 21:71 — Kur'an'da başka bir peygamberle birlikte hicret ettiği açıkça zikredilen nadir peygamberlerden. Ankebût 26'da Hz. İbrahim 'Ben Rabbime hicret ediyorum' derken Hz. Lût da onunla beraberdir.",
      4: "A'râf 7:83 — 'Onu ve ailesini kurtardık; karısı hariç — o geride kalanlardan oldu.' Tahrîm 66:10'da ise Lût'un karısı ihanet örneği olarak anılır. Kur'an'da eşi helak olan tek peygamber.",
      5: "Hûd 11:82 — 'Sicîl' kelimesi Arapça'da sert pişmiş kil anlamına gelir. Kur'an azabı bu somutluktaki detayıyla aktarır; her taşın belirli biri için işaretlendiği rivayet edilir.",
    },
    giftsTooltipsEn:{
      4: "At-Tahrim 66:10 — 'Allah presents as an example the wife of Noah and the wife of Lot. They were under two of Our righteous servants but betrayed them.' The Quran explicitly records this tragic separation.",
      5: "Hud 11:82 — 'Sijjil' means hard baked clay in Arabic. The Quran conveys the punishment with this level of physical detail; classical tafsir records that each stone was marked for a specific person.",
    },
    duaAr:'رَبِّ نَجِّنِي وَأَهۡلِي مِمَّا يَعۡمَلُونَ',
    duaTr:'Rabbim! Beni ve ailemi onların yaptıklarından kurtar.',
    duaEn:'My Lord! Save me and my family from what they do.',
    duaRef:'26:169',
  },
  {
    id:'ismail', nameTr:'Hz. İsmâil', nameEn:'Ishmael', mentions:12,
    surahs:[2,3,6,14,19,21,38],
    giftsTr:[
      "Sâdıku'l-va'd — 'sözüne sadık' unvanı; Kur'an'da yalnızca Hz. İsmâil'e verilmiştir (19:54)",
      "Hem 'resul' hem 'nebî' unvanı aynı anda verilen az sayıda peygamberden biri (19:54)",
      "Ailesine namazı ve zekâtı emretti; Rabbinin katında makbuldü (19:55)",
      "Hz. İbrahim ile Kâbe'nin temellerini yükseltti (2:127)",
      "Babasının kurban etme emrine 'sabreden' olarak boyun eğdi; ikisi de teslim oldu (37:102–103)",
      "Kurban yerine büyük bir fidye — koç gönderildi (37:107)",
      "Hz. İbrahim soyu içinde peygamberler arasında zikredildi (6:86)",
    ],
    giftsEn:[
      "Sâdiq al-wa'd — 'true to his promise'; a title given exclusively to Ishmael in the Quran (19:54)",
      "One of the few prophets given both 'messenger' and 'prophet' titles simultaneously (19:54)",
      "Commanded his family to prayer and zakah; was well-pleasing to his Lord (19:55)",
      "Raised the foundations of the Ka'bah together with Ibrahim (2:127)",
      "Submitted to his father's command to be sacrificed — 'both submitted' (37:102–103)",
      "Ransomed with a great sacrifice — a ram sent in his place (37:107)",
      "Counted among the prophets in the lineage of Ibrahim (6:86)",
    ],
    giftsTooltipsTr:{
      0: "Meryem 19:54 — 'sâdıku'l-va'd' ifadesi Kur'an'da bir peygamber için kullanılan benzersiz bir unvandır. Hz. İsmâil'in babasına verdiği söze sadakati ve kurban anındaki teslimiyeti bu unvanın somut yansımasıdır.",
      4: "Saffât 37:102 — 'Beraber teslim olduklarında...' (فَلَمَّا أَسْلَمَا). İki peygamberin aynı anda tam teslimiyeti — Kur'an'ın en dramatik sahnelerinden biri.",
    },
    giftsTooltipsEn:{
      0: "Maryam 19:54 — 'sâdiq al-wa'd' is a unique title in the Quran applied to a prophet. Ishmael's faithfulness to his word to his father, and his submission at the moment of sacrifice, embody this title.",
      4: "As-Saffat 37:102 — 'When they had both submitted...' (فَلَمَّا أَسْلَمَا). Two prophets in complete submission simultaneously — one of the Quran's most dramatic scenes.",
    },
    duaAr:'رَبَّنَا وَٱجۡعَلۡنَا مُسۡلِمَيۡنِ لَكَ وَمِن ذُرِّيَّتِنَآ أُمَّةٗ مُّسۡلِمَةٗ لَّكَ',
    duaTr:'Rabbimiz! İkimizi de sana teslim olanlardan kıl, soyumuzdan da sana teslim olan bir ümmet çıkar.',
    duaEn:'Our Lord! Make us both submissive to You and from our descendants a submissive community.',
    duaRef:'2:128',
    duaNoteTr:'Hz. İbrahim ile birlikte — Kâbe inşası sırasında',
    duaNoteEn:'Together with Ibrahim — during the construction of the Ka\'bah',
  },
  {
    id:'ishak', nameTr:'Hz. İshâk', nameEn:'Isaac', mentions:17,
    surahs:[2,6,11,14,19,21,29,37,38],
    giftsTr:[
      "İhtiyar yaşta, kısır annesinden mucizevi doğumu müjdelendi (11:71)",
      "Annesi Sâre'nin şaşkınlığı: 'Ben mi doğuracağım, hem kocayım hem kocam ihtiyar!' (11:72)",
      "Salihlerden bir peygamber olarak Hz. İbrahim'e müjdelendi (37:112)",
      "Soyu bereketli kılındı — peygamberler silsilesinin kaynağı oldu (37:113)",
      "Hz. İbrahim'in duasında ismiyle anıldı: 'İhtiyarlığımda bana İsmâil'i ve İshâk'ı bağışladın' (14:39)",
      "Hz. İbrahim, Hz. İshâk ve Hz. Yakûb; 'güç ve basiret sahipleri' olarak anıldı (38:45)",
      "Nübüvvet ve kitap onun soyuna yerleştirildi (29:27)",
    ],
    giftsEn:[
      "Miraculous birth announced in old age to a barren mother (11:71)",
      "Mother Sarah's astonishment: 'Shall I give birth, being old while my husband is aged!' (11:72)",
      "Foretold to Hz. Abraham as a righteous prophet (37:112)",
      "His progeny was blessed — he became the source of the chain of prophets (37:113)",
      "Named in Hz. Abraham's prayer of gratitude: 'You granted me Ishmael and Isaac in my old age' (14:39)",
      "Hz. Abraham, Hz. Isaac and Hz. Jacob called 'possessors of strength and vision' (38:45)",
      "Prophethood and scripture placed in his progeny (29:27)",
    ],
    giftsTooltipsTr: { 6: 'Bu ayet İshâk\'a değil, onun soyuna (İbrahim\'in nesline) nübüvvet ve kitap verildiğini belirtir. İshâk bu zincirin halkası olarak zikredilmektedir.' },
    giftsTooltipsEn: { 6: 'This verse refers to prophethood and scripture given to the progeny of Abraham, not directly to Isaac. Isaac is mentioned as a link in that chain.' },
    duaAr:'وَبَشَّرْنَاهُ بِإِسْحَاقَ نَبِيًّا مِّنَ الصَّالِحِينَ',
    duaTr:'Ona, salihlerden bir peygamber olarak İshak\'ı müjdeledik.',
    duaEn:'And We gave him good tidings of Isaac — a prophet from among the righteous.',
    duaRef:'37:112',
  },
  {
    id:'yakub', nameTr:'Hz. Yakûb', nameEn:'Jacob', mentions:16,
    surahs:[2,6,11,12,19,21],
    giftsTr:[
      "Yûsuf'u kaybedince gözleri ağlamaktan aktı; yine de şikâyetini yalnızca Allah'a taşıdı (12:84–86)",
      "Oğullarına Allah'ın rahmetinden umut kesmemelerini emretti; 'Allah'tan yalnız kâfirler ümit keser' (12:87)",
      "İlim sahibiydi; Allah'ın öğrettikleriyle kavrayışı derin ve kesindi (12:68)",
      "'Güzel sabır' ifadesini iki ayrı acıda tekrarladı: Yûsuf'u kaybedince (12:18) ve Bünyâmin tutulunca (12:83)",
      "Yûsuf'un kokusunu uzaktan hissetti; kervan henüz gelmeden 'Yûsuf'un kokusunu alıyorum' dedi (12:94)",
      "Yûsuf'un gömleği yüzüne sürülünce gözleri açıldı (12:96)",
    ],
    giftsEn:[
      "His eyes went white from grief over Joseph; yet he carried his complaint only to Allah (12:84–86)",
      "Commanded his sons never to despair of Allah's mercy — 'only disbelievers despair of Allah' (12:87)",
      "Was a man of knowledge — his understanding, given by Allah, was deep and precise (12:68)",
      "Repeated the phrase 'beautiful patience' at two separate trials: when Joseph was lost (12:18) and when Benjamin was detained (12:83)",
      "Sensed Joseph's scent from afar — said 'I can smell Joseph' before the caravan arrived (12:94)",
      "His sight was restored when Joseph's shirt was placed over his face (12:96)",
    ],
    giftsTooltipsTr:{
      0: "Yûsuf 12:86 — 'Ben derdimi ve üzüntümü ancak Allah'a arz ediyorum; Allah'tan sizin bilmediğinizi biliyorum.' Yıllar süren ayrılık ve körleşme — ama hiç şikâyet etmedi.",
      2: "Yûsuf 12:68 — Ayet 'öğrettiğimizden ötürü ilim sahibiydi' diyor. Bu, ona verilmiş ilâhî bir kavrayış; gaybı bilmek değil, olayların arkasındaki hikmeti görebilmek.",
      4: "Yûsuf 12:94 — 'Eğer bana bunak demeseydiniz Yûsuf'un kokusunu alıyorum.' Peygamber sezgisi: kervan Mısır'dan yola çıkmıştı, haberi henüz Kenan'a ulaşmamıştı.",
    },
    giftsTooltipsEn:{
      0: "Yusuf 12:86 — 'I only complain of my suffering and my grief to Allah, and I know from Allah what you do not know.' Years of separation and blindness — yet never complained to others.",
      2: "Yusuf 12:68 — The verse says 'a possessor of knowledge because of what We taught him.' This is divinely-gifted understanding, not knowledge of the unseen — the ability to perceive the wisdom behind events.",
      4: "Yusuf 12:94 — 'If you did not think me weakened in judgement, I would say I sense the smell of Joseph.' Prophetic perception: the caravan had just departed Egypt, the news had not yet reached Canaan.",
    },
    duaAr:'فَصَبۡرٞ جَمِيلٞۖ وَٱللَّهُ ٱلۡمُسۡتَعَانُ عَلَىٰ مَا تَصِفُونَ',
    duaTr:"Güzel bir sabır gerek. Anlattıklarınıza karşı yardım yalnızca Allah'tandır.",
    duaEn:'So patience is most fitting. And Allah is the one sought for help against what you describe.',
    duaRef:'12:18',
    duaLabelTr:'Sözü',
    duaLabelEn:'His Words',
  },
  {
    id:'yusuf', nameTr:'Hz. Yusuf', nameEn:'Joseph', mentions:27, detailed:true,
    surahs:[6,12,40],
    giftsTr:[
      "Kur'an kendi içinde bu kıssayı 'kıssaların en güzeli' olarak nitelendiriyor (12:3)",
      "Hadislerin tevilini (olayların anlamını çözme ilmini) öğreneceği müjdelendi (12:6)",
      "Hüküm ve ilim ihsan edildi; 'muhsinleri böyle mükâfatlandırırız' denildi (12:22)",
      "Züleyha fitnesine karşı ismet gösterdi; Allah kötülüğü ondan uzaklaştırdı (12:24)",
      "Zindan tercih etti: 'Rabbim! Zindan bana onların davetinden daha sevimlidir' (12:33)",
      "Zindanda bile tebliğ etti — rüya tabirini orada iki mahkuma gösterdi (12:37)",
      "Mısır hazinelerini kendisi talep etti: 'Ben iyi koruyan ve iyi bilenem' (12:55)",
      "Kardeşlerini affetti: 'Bugün size kınama yok; Allah sizi bağışlasın' (12:92)",
      "Yıllar önce gördüğü rüya babası ve kardeşleriyle kavuştuğunda gerçekleşti (12:100)",
    ],
    giftsEn:[
      "The Quran itself calls this story 'the best of stories' — a unique self-reference (12:3)",
      "Foretold that he would be taught the interpretation of events and narratives (12:6)",
      "Given wisdom and knowledge; 'thus We reward the doers of good' (12:22)",
      "Showed chastity against temptation; Allah diverted evil from him (12:24)",
      "Chose prison: 'My Lord! Prison is more dear to me than what they invite me to' (12:33)",
      "Even in prison he taught — demonstrated dream interpretation to two fellow inmates (12:37)",
      "Himself requested stewardship: 'Appoint me; I am a knowing guardian' (12:55)",
      "Forgave his brothers: 'No blame upon you today; may Allah forgive you' (12:92)",
      "The dream he saw years earlier came true when reunited with his parents and brothers (12:100)",
    ],
    giftsTooltipsTr:{
      3: "Yûsuf 12:24 — 'Eğer Rabbinin burhanını görmeseydi...' Buradaki 'burhan' (açık delil/işaret) müfessirler arasında en çok tartışılan ifadelerden biri. Bunun ne olduğu kesin bilinmiyor — ilâhî bir ikaz mı, aklî bir uyarı mı, vahiy mi? Ayet kesin bir tanım vermiyor.",
    },
    giftsTooltipsEn:{
      3: "Yusuf 12:24 — 'Had he not seen the burhan of his Lord...' This 'burhan' (clear sign/proof) is one of the most debated terms in tafsir literature. What it was exactly is not specified in the Quran — a divine warning, rational restraint, or revelation? The verse leaves it open.",
    },
    duaAr:'رَبِّ قَدۡ ءَاتَيۡتَنِي مِنَ ٱلۡمُلۡكِ وَعَلَّمۡتَنِي مِن تَأۡوِيلِ ٱلۡأَحَادِيثِ ۚ تَوَفَّنِي مُسۡلِمٗا وَأَلۡحِقۡنِي بِٱلصَّٰلِحِينَ',
    duaTr:'Rabbim! Mülkten nasip verdin, rüya tabirini öğrettin. Beni müslüman olarak öldür ve salihler arasına kat.',
    duaEn:'My Lord! You gave me sovereignty and taught me interpretation of dreams. Let me die as a Muslim and join me with the righteous.',
    duaRef:'12:101',
  },
  {
    id:'suayb', nameTr:'Hz. Şuayb', nameEn:"Shu'ayb", mentions:11,
    surahs:[7,11,26,29],
    giftsTr:[
      "Medyen halkına gönderildi; ölçü ve tartıda adaleti emretti (7:85)",
      "Tebliğ için ücret istemedi (26:180)",
      "Kavmi ona 'namazın mı seni bunları yasaklıyor?' diye sordu — dini baskının açık ifadesi (11:87)",
      "Kavmi onu zayıf gördü: 'Kabilenin hatırı olmasaydı seni taşlardık' — gücünü imanından değil kabilesinden sandılar (11:91)",
      "'Gücüm yettiği kadar sizi ıslah etmek istiyorum; başarım yalnızca Allah'ladır' dedi (11:88)",
      "Kavmi sarsıntıyla helak edildi; yurtlarında diz çökmüş halde kaldılar (7:91)",
      "Şuayb ve beraberindeki mü'minler rahmetle kurtarıldı (11:94)",
    ],
    giftsEn:[
      "Sent to the people of Madyan; commanded justice in weights and measures (7:85)",
      "Asked no reward for his message (26:180)",
      "His people said 'Does your prayer command you to abandon what our fathers worshipped?' — open religious coercion (11:87)",
      "His people saw him as weak: 'Were it not for your clan, we would stone you' — they mistook his strength for tribal loyalty, not faith (11:91)",
      "'I only want to reform you as much as I am able; my success is only through Allah' (11:88)",
      "His people were destroyed by a tremor and lay felled in their homes (7:91)",
      "Shu'ayb and those who believed with him were saved by mercy (11:94)",
    ],
    giftsTooltipsTr:{
      3: "Hûd 11:91 — 'Ey Şuayb! Söylediklerinin çoğunu anlamıyoruz. Seni aramızda zayıf görüyoruz. Kabilenin hatırı olmasaydı seni taşlardık.' Kur'an'da kabile baskısını bu kadar açık anlatan ender sahnelerden biri.",
    },
    giftsTooltipsEn:{
      3: "Hud 11:91 — 'O Shu'ayb! We do not understand much of what you say, and indeed we consider you weak among us. Were it not for your family, we would stone you.' One of the Quran's most explicit depictions of tribal coercion overriding faith.",
    },
    duaAr:'رَبَّنَا ٱفۡتَحۡ بَيۡنَنَا وَبَيۡنَ قَوۡمِنَا بِٱلۡحَقِّ وَأَنتَ خَيۡرُ ٱلۡفَٰتِحِينَ',
    duaTr:'Rabbimiz! Bizimle kavmimiz arasında hak ile hükmet. Sen hükmedenlerin en hayırlısısın.',
    duaEn:'Our Lord! Decide between us and our people with truth. You are the best of those who decide.',
    duaRef:'7:89',
    duaNoteTr:'Mü\'minlerle birlikte — toplu niyaz',
    duaNoteEn:'Spoken together with the believers',
  },
  {
    id:'eyyub', nameTr:'Hz. Eyyûb', nameEn:'Job', mentions:4,
    surahs:[4,6,21,38],
    giftsTr:[
      "Şikâyetini değil duasını söyledi: 'Dert bana dokundu, sen en merhametlisin' (21:83)",
      "Duası kabul edildi; derdinden kurtarıldı ve ailesi kat kat geri verildi (21:84)",
      "Allah'ın emriyle ayağını yere vurdu, şifa suyunu mucizevi biçimde çıkardı (38:42)",
      "Ailesi katımızdan rahmet olarak iki kat bağışlandı; akıl sahiplerine öğüttür (38:43)",
      "Allah onu bizzat övdü: 'Ne güzel kul! O daima bize yönelirdi' (38:44)",
    ],
    giftsEn:[
      "Spoke a prayer, not a complaint: 'Adversity touched me, and You are the Most Merciful' (21:83)",
      "His prayer was answered; affliction removed and his family restored and multiplied (21:84)",
      "By Allah's command struck the ground with his foot, miraculously bringing forth healing water (38:42)",
      "His family was given back doubled as mercy from Allah — a lesson for those of understanding (38:43)",
      "Allah Himself praised him: 'What an excellent servant! He was one constantly turning to Us' (38:44)",
    ],
    giftsTooltipsTr: {
      0: 'Sabır örneği olduğu müfessirler tarafından vurgulanmaktadır. Kur\'an bu ayetin bağlamında sabrı doğrudan zikretmez; ancak Sâd 44\'te "sabreden biri olarak bulduk" ifadesi geçer.',
      3: '"Akıl sahiplerine öğüttür" ifadesi Hz. Eyyûb\'un kişisel vasfı değil, Allah\'ın bu kıssanın tamamına yaptığı bir yorumdur.',
    },
    giftsTooltipsEn: {
      0: 'He is consistently cited by scholars as the model of patience. The Quran does not use the word patience in this verse, but Sad 44 confirms: "We found him patient."',
      3: '"A lesson for those of understanding" is not a personal attribute of Job, but Allah\'s closing commentary on the story as a whole.',
    },
    duaAr:'رَّبِّ إِنِّي مَسَّنِيَ ٱلضُّرُّ وَأَنتَ أَرۡحَمُ ٱلرَّٰحِمِينَ',
    duaTr:'Rabbim! Bana dert dokundu, sen merhametlilerin en merhametlisisin.',
    duaEn:'My Lord! Adversity has touched me, and You are the Most Merciful of the merciful.',
    duaRef:'21:83',
  },
  {
    id:'musa', nameTr:'Hz. Musa', nameEn:'Moses', mentions:136, detailed:true,
    surahs:[2,7,10,18,20,26,28,37,40,54,61,79],
    giftsTr:[
      "Kelîmullah — Allah onunla bizzat, doğrudan konuştu (4:164)",
      "Annesine vahiy gönderildi: 'Onu sandığa koy, nehre bırak' — peygamber olmayan birine vahiy (20:38)",
      "Tur dağında ilk vahyi aldı: 'Ben senin Rabbiniyim, pabuçlarını çıkar' (20:11)",
      "Asa ve beyaz el mucizesi verildi (7:107-108)",
      "Firavuna 'yumuşak söz söyleyin' emri — Hz. Hârûn ile birlikte gönderilmesinin hikmeti (20:44)",
      "Asasıyla denizi yardı; İsrailoğullarını geçirdi (26:63)",
      "Firavun boğulurken iman etti; Allah kabul etmedi: 'Şimdi mi?' (10:90)",
      "Tur'da 40 gece kaldı; levhalar üzerine Tevrat yazıldı (7:145)",
      "Hz. Hızır'la yolculukta kendi bilgisinin sınırını gördü (18:60)",
      "Ülü'l-azm — beş büyük peygamberin arasında Hz. Nuh, Hz. İbrahim, Hz. İsa ile anıldı (33:7)",
    ],
    giftsEn:[
      "Kalimullah — Allah spoke to him directly and without intermediary (4:164)",
      "His mother received inspiration: 'Place him in a chest and cast it into the river' — revelation to a non-prophet (20:38)",
      "Received first revelation at Mount Tur: 'I am your Lord; remove your sandals' (20:11)",
      "Given the miracles of the staff and the white hand (7:107-108)",
      "Commanded to speak to Pharaoh with 'gentle speech' — the wisdom behind sending Hz. Aaron too (20:44)",
      "Struck the sea with his staff; it parted and the Children of Israel crossed (26:63)",
      "Pharaoh declared faith while drowning; Allah rejected it: 'Now? When you disobeyed before?' (10:90)",
      "Stayed 40 nights at Mount Tur; the Torah was written on the Tablets (7:145)",
      "Journeyed with Hz. Khidr and witnessed the limits of his own knowledge (18:60)",
      "Ulu'l-azm — one of the five greatest prophets, named alongside Hz. Noah, Hz. Abraham and Hz. Jesus (33:7)",
    ],
    duaAr:'رَبِّ ٱشۡرَحۡ لِي صَدۡرِي ۝ وَيَسِّرۡ لِيٓ أَمۡرِي ۝ وَٱحۡلُلۡ عُقۡدَةٗ مِّن لِّسَانِي ۝ يَفۡقَهُواْ قَوۡلِي ۝ وَٱجۡعَل لِّي وَزِيرٗا مِّنۡ أَهۡلِي ۝ هَٰرُونَ أَخِي',
    duaTr:'Rabbim! Göğsümü genişlet, işimi kolaylaştır, dilimin düğümünü çöz ki sözümü anlasınlar. Ailemden bana bir yardımcı ver: kardeşim Hârûn.',
    duaEn:'My Lord! Expand my chest for me, ease my task, and untie the knot from my tongue so they may understand my speech. And appoint for me a minister from my family — Aaron, my brother.',
    duaRef:'20:25-30',
  },
  {
    id:'harun', nameTr:'Hz. Hârûn', nameEn:'Aaron', mentions:20,
    surahs:[7,10,19,20,21,26,28,37],
    giftsTr:[
      "Hz. Musa'nın bizzat duasıyla peygamber yapıldı — başka bir peygamberin niyazıyla görevlendirilen nadir örnek (20:29-36)",
      "Nübüvvet ihsan edildi; kardeşiyle birlikte İsrailoğulları'na gönderildi (19:53)",
      "Hz. Musa'nın değerlendirmesiyle belagatli konuşandı; sözü daha açık ve akıcıydı (28:34)",
      "Hz. Musa Tur'a giderken kavminde yerine vekil bırakıldı (7:142)",
      "Buzağı krizinde kavmi uyardı ama dinlemediler; dönen Hz. Musa saçından tutunca 'Düşmanları sevindirmekten korktum' dedi (7:150)",
      "Hz. Musa ile birlikte İsrailoğulları'na verilen nimetler ve zaferler içinde övüldü (37:114-120)",
    ],
    giftsEn:[
      "Made a prophet through Moses' own prayer — a rare case of prophethood granted through another prophet's supplication (20:29-36)",
      "Granted prophethood; sent together with his brother to the Children of Israel (19:53)",
      "By Moses' own assessment, more fluent and articulate in speech (28:34)",
      "Left as deputy over the people when Moses departed for Mount Tur (7:142)",
      "Warned his people during the golden calf crisis but was ignored; when Moses returned and grabbed his hair, he said 'I feared you would say I divided the Children of Israel' (7:150)",
      "Praised together with Moses among the blessings and victories granted to the Children of Israel (37:114-120)",
    ],
    giftsTooltipsTr:{
      2: "Kasas 28:34 — 'Kardeşim Hârûn, benden daha fasih konuşur.' Bu, Allah'ın Hârûn'u nitelendirdiği bir ayet değil; Hz. Musa'nın kendisi için 'dilim tutulur' diye Allah'a yaptığı başvurudaki ifadesidir.",
      4: "A'râf 7:150 — Hz. Musa döndüğünde levhaları fırlattı ve Hârûn'u saçından tuttu. Hârûn: 'Ey annemin oğlu! Beni saçımdan ve sakalımdan tutma. Ben senin düşmanlarını sevindirmekten korktum.' Kur'an'daki en insani kardeş diyaloğu.",
    },
    giftsTooltipsEn:{
      2: "Al-Qasas 28:34 — 'My brother Aaron is more eloquent in speech than I.' This is not Allah's description of Aaron — it is Moses' own plea to Allah, citing his own speech difficulty as the reason he needs support.",
      4: "Al-A'raf 7:150 — Moses threw down the tablets and seized Aaron by the hair. Aaron said: 'O son of my mother, do not seize me by my beard or head. I feared you would say: you have caused division among the Children of Israel.' One of the Quran's most human sibling exchanges.",
    },
    duaAr:'رَبِّ اشْرَحْ لِي صَدْرِي ۝ وَيَسِّرْ لِي أَمْرِي ۝ وَاحْلُلْ عُقْدَةً مِّن لِّسَانِي ۝ يَفْقَهُوا قَوْلِي ۝ وَاجْعَل لِّي وَزِيرًا مِّنْ أَهْلِي ۝ هَارُونَ أَخِي',
    duaTr:'Rabbim! Göğsümü genişlet, işimi kolaylaştır, dilimin düğümünü çöz ki sözümü anlasınlar. Ailemden bana bir yardımcı ver: kardeşim Hârûn.',
    duaEn:'My Lord, expand for me my breast, ease for me my task, untie the knot from my tongue that they may understand my speech, and appoint for me a minister from my family: Aaron, my brother.',
    duaRef:'20:25',
    duaLabelTr:"Hz. Musa'nın Hârûn İçin Duası",
    duaLabelEn:"Moses' Prayer for Aaron",
  },
  {
    id:'yunus', nameTr:'Hz. Yûnus', nameEn:'Jonah', mentions:4,
    surahs:[4,6,10,21,37],
    giftsTr:[
      "Kavminden izinsiz ayrıldı; gemide kura çekişine girdi ve kaybetti (37:141)",
      "Balık onu yuttu; karanlıklar içinde tesbih ve dua etti, kurtarıldı (21:87-88)",
      "'Eğer tesbih edenlerden olmasaydı kıyamete kadar kalırdı' — geçmiş ibadetinin meyvesi (21:87)",
      "Hasta halde kıyıya çıkarıldı; üzerine gölge yapan bir ağaç bitirildi (37:145-146)",
      "100.000, hatta daha fazla kişiye peygamber olarak gönderildi (37:147)",
      "Kavmi azap gelmeden iman etti ve kurtuldu — Kur'an'da buna tek örnek (10:98)",
    ],
    giftsEn:[
      "Left his people without permission; drew lots on the ship and lost (37:141)",
      "The whale swallowed him; he prayed in layers of darkness and was saved (21:87-88)",
      "'Had he not been of those who glorify Allah, he would have remained until Resurrection Day' (21:87)",
      "Cast ashore ill; a gourd vine was grown over him for shelter (37:145-146)",
      "Sent as a prophet to a hundred thousand or more (37:147)",
      "His people believed before the punishment arrived and were spared — the only such case in the Quran (10:98)",
    ],
    giftsTooltipsTr: { 2: 'Enbiyâ 87\'deki bu ifade, Hz. Yûnus\'un önceki tesbihlerinin balığın karnında duasının kabulüne vesile olduğuna işaret eder — müfessirlerin büyük çoğunluğunun benimsediği yorum.' },
    giftsTooltipsEn: { 2: 'This clause in Anbiya 87 indicates that his prior glorifications were the means by which his prayer was answered in the whale — the interpretation held by the majority of classical scholars.' },
    duaAr:'لَّآ إِلَٰهَ إِلَّآ أَنتَ سُبۡحَٰنَكَ إِنِّي كُنتُ مِنَ ٱلظَّٰلِمِينَ',
    duaTr:'Senden başka ilah yoktur. Seni tenzih ederim. Ben zalimlerden oldum.',
    duaEn:'There is no deity except You; exalted are You. Indeed I have been of the wrongdoers.',
    duaRef:'21:87',
  },
  {
    id:'ilyas', nameTr:'Hz. İlyâs', nameEn:'Elijah', mentions:2,
    surahs:[6,37],
    giftsTr:[
      "Mürselîn — gönderilen peygamberler arasında tescillendi (37:123)",
      "Kavmine 'Allah'tan korkun' diyerek tebliğ etti; Baal'a değil, âlemlerin en güzel yaratıcısına çağırdı (37:124-125)",
      "Kavmi onu yalanladı; yalnızca seçilmiş kulları iman etti (37:127)",
      "'İl-Yâsîn'e selam olsun' — âlemlerde selamla anıldı; Hz. Nuh'a verilen selamla aynı formülasyon (37:130)",
      "Salih kullar arasında; Allah'ın tesciliyle (37:132)(6:85)",
    ],
    giftsEn:[
      "Among the Mursal — registered among the sent messengers (37:123)",
      "Called his people: 'Will you not fear Allah?' — inviting them to the finest of creators, not Baal (37:124-125)",
      "His people denied him; only Allah's chosen servants believed (37:127)",
      "'Peace upon Il-Yasin' — greeted across all the worlds; same formula as the greeting given to Noah (37:130)",
      "Among the righteous servants; by Allah's own testimony (37:132)(6:85)",
    ],
    giftsTooltipsTr:{
      3: "Saffât 37:130 — 'İl-Yâsîn'e selam olsun' ifadesi klasik tefsirde tartışmalıdır. Büyük çoğunluk bunun Hz. İlyâs'ın başka bir adı veya kavminin adı olduğunu söyler. Bazı müfessirler Hz. İdrîs'i, bazıları Hz. Muhammed (a.s.) soyunu kasteder. Kur'an kesin bir açıklama yapmıyor; bu belirsizlik bilinçli olabilir.",
    },
    giftsTooltipsEn:{
      3: "As-Saffat 37:130 — The phrase 'Peace upon Il-Yasin' is debated in classical tafsir. Most commentators say it is another name for Elijah or refers to his community. Some cite Idris; others link it to the Prophet's lineage. The Quran does not clarify — this ambiguity may itself be intentional.",
    },
    duaAr:'وَإِنَّ إِلْيَاسَ لَمِنَ الْمُرْسَلِينَ',
    duaTr:'İlyâs şüphesiz gönderilen peygamberlerdendir.',
    duaEn:'And indeed, Elias was of the messengers.',
    duaRef:'37:123',
    duaLabelTr:"Allah'ın Hükmü",
    duaLabelEn:"Allah's Declaration",
  },
  {
    id:'elyesa', nameTr:'Hz. Elyesâ', nameEn:'Elisha', mentions:2,
    surahs:[6,38],
    giftsTr:[
      "İyilerden; âlemlere üstün kılınanlardan (6:86)",
      "Hz. İsmâil ve Hz. Zülkifl ile birlikte 'iyilerden' diye anıldı (38:48)",
      "Hz. İlyâs'ın ardından gelen peygamber olduğu kabul edilir — Kur'an ikisini aynı listede zikreder, halef ilişkisini açıkça belirtmez (38:48)",
    ],
    giftsEn:[
      "Among the good; preferred above the worlds (6:86)",
      "Counted among 'the outstanding' alongside Ishmael and Dhul-Kifl (38:48)",
      "Traditionally regarded as the prophet who came after Elijah — the Quran places them in the same list but does not explicitly state succession (38:48)",
    ],
    giftsTooltipsTr:{
      2: "Sâd 38:48 — Kur'an Hz. İlyâs ve Hz. Elyesâ'yı birlikte zikretse de aralarındaki halef ilişkisi doğrudan Kur'an metniyle değil, İsrailiyyât ve tefsir geleneğiyle aktarılır.",
    },
    giftsTooltipsEn:{
      2: "Sad 38:48 — While the Quran mentions Elijah and Elisha together, the succession relationship between them comes from tafsir tradition and Isra'iliyyat, not directly from the Quranic text.",
    },
    duaAr:'وَاذْكُرْ إِسْمَاعِيلَ وَالْيَسَعَ وَذَا الْكِفْلِ ۖ وَكُلٌّ مِّنَ الْأَخْيَارِ',
    duaTr:'İsmail\'i, Elyesâ\'yı ve Zülkifl\'i de zikret — hepsi hayırlılardandır.',
    duaEn:'And remember Ishmael and Elisha and Dhul-Kifl — all are among the outstanding.',
    duaRef:'38:48',
    duaLabelTr:"Allah'ın Hükmü",
    duaLabelEn:"Allah's Declaration",
  },
  {
    id:'zulkifl', nameTr:'Hz. Zülkifl', nameEn:'Dhul-Kifl', mentions:2,
    surahs:[21,38],
    giftsTr:[
      "Hz. İsmâil ve Hz. İdrîs ile birlikte sabredenlerden; üç isim aynı ayette sabırla öne çıkarıldı (21:85)",
      "Rahmet-i ilahiye dahil edildi; salihlerden olduğu tescillendi (21:86)",
      "Hz. İsmâil ve Hz. Elyesâ ile aynı ayette hayırlılar arasında zikredildi (38:48)",
      "İki ayrı surede, iki ayrı seçkin liste içinde anılması — Kur'an'ın ona verdiği çifte tescil (21:85)(38:48)",
      "'Zülkifl' ismi 'kefalet üstlenen' anlamı taşır; Kur'an'ın ona verdiği bu vasıf başlı başına bir nitelendirmedir (21:85)",
    ],
    giftsEn:[
      "Counted among the patient alongside Ishmael and Idris — all three distinguished by patience in a single verse (21:85)",
      "Admitted into Allah's mercy; confirmed among the righteous (21:86)",
      "Named among the outstanding alongside Ishmael and Elisha (38:48)",
      "Mentioned in two separate suras in two different elite lists — a double attestation by the Quran (21:85)(38:48)",
      "The name 'Dhul-Kifl' means 'the one who undertakes a pledge' — itself a characterization (21:85)",
    ],
    giftsTooltipsTr:{
      0: "Kur'an, Hz. Zülkifl'e 'nebî' veya 'resul' unvanını açıkça vermez; yalnızca sabredenlerden olduğunu belirtir. Peygamber olup olmadığı müfessirler arasında tartışmalıdır: İbn Kesîr ve Taberî peygamber olduğunu savunurken, bir kısım âlim salih bir kul olduğunu söyler.",
      4: "Enbiyâ 21:85 — 'Zülkifl' isminin kime atıfta bulunduğu klasik tefsirde tartışmalıdır; Hz. Hizkil (Hezekiel), Hz. Elyesâ veya başka bir peygamber önerilmiştir. Kimliği Kur'an metninden net biçimde çıkarılamaz.",
    },
    giftsTooltipsEn:{
      0: "The Quran does not explicitly give Dhul-Kifl the title of 'prophet' or 'messenger' — only that he was among the patient. His prophetic status is debated: Ibn Kathir and Tabari held he was a prophet, while others considered him a righteous servant.",
      4: "Anbiya 21:85 — The identity of 'Dhul-Kifl' is debated in classical tafsir; Ezekiel, Elisha, and others have been proposed. His exact identity cannot be determined from the Quranic text alone.",
    },
    duaAr:'وَأَدْخَلْنَاهُمْ فِي رَحْمَتِنَا ۖ إِنَّهُم مِّنَ الصَّالِحِينَ',
    duaTr:"Onları rahmetimize kattık. Gerçekten onlar salih kimselerdi.",
    duaEn:"We admitted them into Our mercy. Indeed, they were of the righteous.",
    duaRef:'21:86',
    duaNoteTr:'Hz. İsmâil ve Hz. İdrîs ile birlikte',
    duaNoteEn:'Together with Ishmael and Idris',
    duaLabelTr:"Allah'ın Hükmü",
    duaLabelEn:"Allah's Declaration",
  },
  {
    id:'davud', nameTr:'Hz. Dâvûd', nameEn:'David', mentions:16,
    surahs:[2,4,17,21,27,34,38],
    giftsTr:[
      "Câlût'u öldürdü; Allah mülk ve hikmet verdi, dilediğini öğretti (2:251)",
      "Peygamberler arasında fazıllandırıldı; Zebur indirildi (17:55)",
      "Dağlar ve kuşlar onunla tesbih etti; demir yumuşatıldı (34:10)",
      "Ölçülü zırh halkaları yapmayı öğrendi; demir sanatı ile salih ameli birleştirdi (34:11)",
      "'Faslu'l-hitab' — söz güzelliği ve yargıda keskinlik verildi; mülkü sağlamlaştırıldı (38:20)",
      "Yeryüzünde halife kılındı; insanlar arasında hak ile hükmet, hevana uyma emri (38:26)",
      "Allah'ın bizzat 'kulumuz Dâvûd' diye andığı peygamber; 'evvâb' sıfatıyla gücü ve mülküyle birlikte övüldü (38:17)",
    ],
    giftsEn:[
      "Killed Goliath; given kingship and wisdom, taught what Allah willed (2:251)",
      "Elevated above other prophets; given the Psalms (17:55)",
      "Mountains and birds glorified with him; iron was softened for him (34:10)",
      "Taught to make measured coats of armor — craftsmanship linked to righteous deeds (34:11)",
      "Given 'faslu'l-hitab' — wisdom and discernment in speech; his kingdom strengthened (38:20)",
      "Made a successor on earth; commanded to judge with truth and not follow desire (38:26)",
      "Directly named 'Our servant David' by Allah — the 'awwab' attribute praised alongside strength and kingship (38:17)",
    ],
    giftsTooltipsTr:{
      6: "Sâd 38:17 — Allah'ın 'عَبْدَنَا دَاوُودَ' (kulumuz Dâvûd) ifadesi, doğrudan ilahî nitelendirmedir. 'نِعْمَ الْعَبْدُ' (ne güzel kul) formülasyonu ise aynı surede Hz. Süleymân (38:30) ve Hz. Eyyûb (38:44) için kullanılır. İkisi de yüksek övgü, ancak farklı Arapça formülleridir.",
    },
    giftsTooltipsEn:{
      6: "Sad 38:17 — Allah's phrase 'Our servant David' (عَبْدَنَا دَاوُودَ) is a direct divine attribution. The formula 'ni'ma'l-abd' (what an excellent servant) is used in the same sura for Solomon (38:30) and Job (38:44) — both are high praise, but distinct Arabic formulations.",
    },
    duaAr:'فَاسْتَغْفَرَ رَبَّهُ وَخَرَّ رَاكِعًا وَأَنَابَ',
    duaTr:"Rabbinden bağışlama diledi, eğilerek rükûya kapandı ve O'na döndü.",
    duaEn:'He sought forgiveness of his Lord and fell down bowing and turned in repentance.',
    duaRef:'38:24',
    duaLabelTr:'Tövbesi',
    duaLabelEn:'His Repentance',
  },
  {
    id:'suleyman', nameTr:'Hz. Süleymân', nameEn:'Solomon', mentions:17,
    surahs:[2,4,21,27,34,38],
    giftsTr:[
      "Hz. Dâvûd'a varis oldu; 'Ey insanlar! Bize kuş dili öğretildi' dedi (27:16)",
      "Cin, insan ve kuş ordularından oluşan birlikler sıra halinde emrine verildi (27:17)",
      "Karınca vadisinde bir karıncanın sözünü duydu; şükür ve dua etti (27:18)",
      "Sebe Melikesi'nin tahtını gözünü kırpmadan önce getirtti — Kitab'dan ilim (27:38)",
      "Rüzgar emrine verildi: sabah esişi bir aylık, akşam esişi bir aylık yol (34:12)",
      "Cinler ona mihraplar, heykeller, havuz büyüklüğünde çanaklar inşa etti (34:13)",
      "Allah onu bizzat övdü: 'Ne güzel kul! O daima Allah'a yönelirdi' (38:30)",
      "'Rabbim! Benden sonra kimseye nasip olmayacak bir mülk bağışla' — eşsiz mülk duası (38:35)",
    ],
    giftsEn:[
      "Inherited Hz. David; declared: 'O people, we have been taught the language of birds' (27:16)",
      "An army of jinn, humans and birds was gathered under his command, marching in rows (27:17)",
      "Heard the speech of an ant in the valley of ants; bowed in gratitude and prayed (27:18)",
      "Had the throne of the Queen of Sheba brought before his gaze could return — knowledge from the Scripture (27:38)",
      "The wind was subjected to him: its morning journey was a month, its evening journey a month (34:12)",
      "The jinn built for him chambers, statues, and basins large as reservoirs (34:13)",
      "Allah Himself praised him: 'What an excellent servant! He was one constantly turning to Us' (38:30)",
      "'My Lord! Grant me a kingdom that shall not belong to anyone after me' — the prayer for a unique kingdom (38:35)",
    ],
    giftsTooltipsTr:{
      7: "Sâd 38:35-38 — Bu dua hemen kabul edildi: ardından rüzgar (38:36), şeytanlar/dalgıçlar (38:37) ve bağlı diğer güçler (38:38) emrine verildi. Kur'an bu duayı kibir olarak değil, Allah'ın ona özgü bir lütuf olarak sunar.",
    },
    giftsTooltipsEn:{
      7: "Sad 38:35-38 — This prayer was immediately granted: the wind (38:36), every devil and diver (38:37), and others bound in chains (38:38) were all subjected to him. The Quran presents this not as arrogance but as a unique divine gift.",
    },
    duaAr:'رَبِّ أَوۡزِعۡنِيٓ أَنۡ أَشۡكُرَ نِعۡمَتَكَ ٱلَّتِيٓ أَنۡعَمۡتَ عَلَيَّ وَعَلَىٰ وَٰلِدَيَّ وَأَنۡ أَعۡمَلَ صَٰلِحٗا تَرۡضَىٰهُ وَأَدۡخِلۡنِي بِرَحۡمَتِكَ فِي عِبَادِكَ ٱلصَّٰلِحِينَ',
    duaTr:'Rabbim! Bana ve anne-babama verdiğin nimete şükretmemi, razı olacağın salih amel işlememi nasip et; rahmetinle beni salih kulların arasına kat.',
    duaEn:'My Lord! Enable me to be grateful for Your favor upon me and upon my parents, and to do righteousness of which You approve, and admit me by Your mercy into the ranks of Your righteous servants.',
    duaRef:'27:19',
  },
  {
    id:'zekeriyya', nameTr:'Hz. Zekeriyyâ', nameEn:'Zechariah', mentions:7,
    surahs:[3,6,19,21],
    giftsTr:[
      "Hz. Meryem'e bakıyordu; onun yanında mucizevi rızık görünce orada dua etti (3:37)(3:38)",
      "Namaz kılarken melekler seslendi: 'Allah seni Yahya ile müjdeliyor' (3:39)",
      "İhtiyar ve karısı kısır iken müjdelendi; şaşkınlığını dile getirdi (3:40)(19:8)",
      "Yahya'ya daha önce kimseye verilmemiş eşsiz bir isim konuldu (19:7)",
      "Gizlice seslenerek dua etti; kemikler zayıflamış, baş ağarmış — yine de Allah'a yöneldi (19:3-4)",
      "Alâmet olarak 3 gece sağlıklıyken insanlarla konuşamama verildi — Kur'an'da eşsiz bir ilahi işaret (19:10)",
      "Duası kabul edildi; eşi de ıslah edildi; hayır işlerde yarışanlardan sayıldı (21:90)",
    ],
    giftsEn:[
      "Was guardian of Mary; upon seeing her miraculous provision, he prayed right there (3:37)(3:38)",
      "While standing in prayer, the angels called to him: 'Allah gives you glad tidings of John' (3:39)",
      "Given glad tidings despite his old age and his wife's barrenness; expressed his amazement (3:40)(19:8)",
      "John was given a name unprecedented — no one had ever been called by it before (19:7)",
      "Called to his Lord in a secret voice; bones weakened, head filled with white — yet he turned to Allah (19:3-4)",
      "Given the sign of three nights of speechlessness while physically sound — a uniquely specific divine sign (19:10)",
      "His prayer was answered; his wife was also amended; they were among those who race toward good deeds (21:90)",
    ],
    duaAr:'رَبِّ لَا تَذَرۡنِي فَرۡدٗا وَأَنتَ خَيۡرُ ٱلۡوَٰرِثِينَ',
    duaTr:'Rabbim! Beni yalnız bırakma. Sen varislerin en hayırlısısın.',
    duaEn:'My Lord! Do not leave me alone, and You are the best of inheritors.',
    duaRef:'21:89',
  },
  {
    id:'yahya', nameTr:'Hz. Yahyâ', nameEn:'John', mentions:5,
    surahs:[3,6,19,21],
    giftsTr:[
      "Bu isimde daha önce hiç kimse adlandırılmamıştı — eşsiz bir isim (19:7)",
      "Hz. İsa'yı tasdik etmek üzere gönderildi — iki peygamber arasındaki nadir ilişki (3:39)",
      "Hikmeti daha çocukken verildi: 'Kitaba kuvvetle sarıl' (19:12)",
      "Katımızdan hanân (şefkat) ve zekât verildi; takvalı biriydi (19:13)",
      "Anne-babasına iyilik ederdi; zorba ve isyankâr değildi (19:14)",
      "Doğduğu gün, öldüğü gün ve dirileceği gün Allah'ın selamı üzerine oldu (19:15)",
    ],
    giftsEn:[
      "No one had ever been given this name before — a uniquely unprecedented name (19:7)",
      "Sent to confirm Hz. Jesus — a rare direct relationship between two prophets (3:39)",
      "Given wisdom as a child: 'Take the Scripture with determination' (19:12)",
      "Endowed from Allah with compassion and purity; he was deeply God-fearing (19:13)",
      "Dutiful to his parents; not arrogant or disobedient (19:14)",
      "Allah's peace upon him at birth, at death, and at the day he will be raised alive (19:15)",
    ],
    duaAr:'وَسَلَامٌ عَلَيْهِ يَوْمَ وُلِدَ وَيَوْمَ يَمُوتُ وَيَوْمَ يُبْعَثُ حَيًّا',
    duaTr:'Doğduğu gün, öleceği gün ve diri olarak dirileceği gün ona selam olsun.',
    duaEn:'And peace be upon him the day he was born and the day he dies and the day he is raised alive.',
    duaRef:'19:15',
    duaNoteTr:"Allah'ın Selamı",
    duaNoteEn:"Allah's Peace",
  },
  {
    id:'isa', nameTr:'Hz. İsa', nameEn:'Jesus', mentions:25, detailed:true,
    surahs:[3,4,5,19,43,61],
    giftsTr:[
      "Melekler tarafından Meryem'e müjdelendi: 'Allah'tan bir kelime' (3:45)",
      "Babasız, yalnızca anneden doğdu — Kur'an'ın açıkça anlattığı mucizevi doğum (19:20-21)",
      "Beşikte daha bebek iken konuştu: 'Ben Allah'ın kuluyum, beni peygamber kıldı' (19:29)",
      "Allah katındaki durumu Hz. Âdem gibidir — ikisi de babasız, 'Ol' emriyle (3:59)",
      "Çamurdan kuş yaptı, ölü diriltti, körleri iyileştirdi — Allah'ın izniyle (3:49)",
      "Rûhullah ve Kelimetullah — Kur'an'ın ona verdiği iki eşsiz unvan (4:171)",
      "Allah onu kendi katına yükseltti — çarmıha gerilmedi (4:158)",
      "Hz. Muhammed'i müjdeledi: 'Ahmed adında bir peygamber gelecek' (61:6)",
      "İncil indirildi; Tevrat'ı tasdik etti (5:46)",
    ],
    giftsEn:[
      "Announced by angels to Mary: 'A word from Allah' — before his creation (3:45)",
      "Born without a father, from his mother alone — the Quran's explicitly narrated miraculous birth (19:20-21)",
      "Spoke while still in the cradle: 'I am the servant of Allah; He made me a prophet' (19:29)",
      "His likeness before Allah is that of Hz. Adam — both fatherless, created by 'Be' (3:59)",
      "Made a bird from clay, raised the dead, healed the blind — all by Allah's permission (3:49)",
      "Ruhullah and Kalimullah — two unique titles given to him by the Quran (4:171)",
      "Allah raised him to Himself — he was not crucified (4:158)",
      "Gave glad tidings of Hz. Muhammad: 'A messenger to come after me named Ahmad' (61:6)",
      "Given the Gospel; came confirming the Torah before him (5:46)",
    ],
    duaAr:'ٱللَّهُمَّ رَبَّنَآ أَنزِلۡ عَلَيۡنَا مَآئِدَةٗ مِّنَ ٱلسَّمَآءِ تَكُونُ لَنَا عِيدٗا لِّأَوَّلِنَا وَءَاخِرِنَا وَءَايَةٗ مِّنكَ',
    duaTr:"Allah'ım, Rabbimiz! Bize gökten bir sofra indir; o bizim için bir bayram, senden bir ayet olsun.",
    duaEn:'O Allah, our Lord! Send down to us a table from heaven to be a festival for us and a sign from You.',
    duaRef:'5:114',
  },
  {
    id:'muhammed', nameTr:'Hz. Muhammed ﷺ', nameEn:'Muhammad ﷺ', mentions:4,
    surahs:[3,17,21,33,47,48,53,61,68],
    giftsTr:[
      "Âlemlere yalnızca rahmet olarak gönderildi (21:107)",
      "Allah onu doğrudan övdü: 'Sen gerçekten yüce bir ahlak üzeresin' (68:4)",
      "Üsve-i hasene — 'Allah'ın Resûlü'nde güzel bir örnek' (33:21)",
      "Şahit, müjdeci ve uyarıcı olarak üçlü görevle gönderildi (33:45)",
      "Hâtemü'n-Nebiyyîn — peygamberlerin sonuncusu (33:40)",
      "İsrâ: Bir gecede Mescid-i Haram'dan Mescid-i Aksâ'ya götürüldü (17:1)",
      "Miraç: Sidretü'l-Müntehâ'ya yükseldi, vahyi bizzat gördü (53:13)",
      "Hz. İbrahim'in duasında (2:129) ve Hz. İsa'nın müjdesinde (61:6) ismiyle yer aldı",
    ],
    giftsEn:[
      "Sent as nothing but mercy to all the worlds (21:107)",
      "Allah directly praised him: 'You are truly of a great moral character' (68:4)",
      "Uswa hasana — 'In the Messenger of Allah there is an excellent model' (33:21)",
      "Sent with a threefold mission: witness, bearer of glad tidings, and warner (33:45)",
      "Khatam al-Nabiyyin — the seal and last of all prophets (33:40)",
      "Isra: Taken in a single night from al-Masjid al-Haram to al-Masjid al-Aqsa (17:1)",
      "Miraj: Rose to the Lote Tree of the Utmost Boundary; witnessed the revelation directly (53:13)",
      "Named in Hz. Abraham's prayer (2:129) and foretold by Hz. Jesus by name: 'Ahmad' (61:6)",
    ],
    giftsTooltipsTr: {
      5: 'İsrâ 1 yalnızca Kudüs yolculuğunu (Mescid-i Aksâ) anlatır. Göğe yükseliş (Miraç) Necm 13-18\'de geçer. İkisi birlikte "İsrâ ve Miraç" olarak bilinse de farklı ayetlere dayanır.',
    },
    giftsTooltipsEn: {
      5: 'Isra 17:1 describes only the journey to Jerusalem (al-Aqsa). The ascent to the heavens (Miraj) is in Najm 53:13-18. Both are known together as the Night Journey but rest on different verses.',
    },
    duaAr:'رَّبِّ زِدۡنِي عِلۡمٗا',
    duaTr:'Rabbim! İlmimi artır.',
    duaEn:'My Lord! Increase me in knowledge.',
    duaRef:'20:114',
  },
];

const PROPHETS = [
  // Kronolojik sıra: Nuh → İbrahim → Yusuf → Musa → İsa
  {
    id: 'nuh',
    nameTr: 'Hz. Nuh', nameEn: 'Noah',
    subtitleTr: '950 yıllık davet — bir gemi, bir tufan, yeniden başlangıç',
    subtitleEn: '950 years of calling — one ark, one flood, a new beginning',
    mentions: 43,
    color: '#f472b6', glow: 'rgba(244,114,182,0.65)',
    surahs: [
      { s:54, phaseTr:'Nuh\'un kavminin inkârı', phaseEn:"Noah's People Deny" },
      { s:7,  phaseTr:'Kavmiyle tartışma', phaseEn:'Debate with His People' },
      { s:26, phaseTr:'İnkâr & gemi yapımı', phaseEn:'Denial & Building the Ark' },
      { s:11, phaseTr:'Tufanın detayları & oğlu', phaseEn:"Flood Details & Son's Fate" },
      { s:23, phaseTr:'Gemi ve tufan', phaseEn:'The Ark and the Flood' },
      { s:71, phaseTr:'Tam hikaye: 950 yıllık davet', phaseEn:'Full Story: 950 Years of Calling' },
      { s:37, phaseTr:'Kurtarılanlar', phaseEn:'Those Who Were Saved' },
      { s:29, phaseTr:'Sabır örneği', phaseEn:'Example of Patience' },
    ],
  },
  {
    id: 'ibrahim',
    nameTr: 'Hz. İbrahim', nameEn: 'Abraham',
    subtitleTr: 'Tevhidin atası — Kâbe\'nin mimarı',
    subtitleEn: 'Father of monotheism — Architect of the Kaaba',
    mentions: 69,
    color: '#fbbf24', glow: 'rgba(251,191,36,0.65)',
    surahs: [
      { s:87, phaseTr:'İbrahim\'in sahifeleri', phaseEn:"Scrolls of Abraham" },
      { s:19, phaseTr:'Babası Azar ile tartışma', phaseEn:'Debate with Father Azar' },
      { s:26, phaseTr:'Puta tapınmaya başkaldırı', phaseEn:'Revolt Against Idolatry' },
      { s:6,  phaseTr:'Yıldız → ay → güneş → Tevhid', phaseEn:'Star → Moon → Sun → Monotheism' },
      { s:37, phaseTr:'İsmail\'i kurban edecek', phaseEn:"Sacrifice of Ismail" },
      { s:11, phaseTr:'Meleklerin ziyareti & Lut kavmi', phaseEn:"Angels' Visit & Lot's People" },
      { s:51, phaseTr:'Müjde: İshak doğacak', phaseEn:'Glad Tidings: Isaac to Come' },
      { s:21, phaseTr:'Ateşe atılma', phaseEn:'Cast into Fire' },
      { s:14, phaseTr:'Rabbine dua', phaseEn:'Prayer to His Lord' },
      { s:2,  phaseTr:'Kâbe\'nin inşası', phaseEn:'Building the Kaaba' },
      { s:22, phaseTr:'Hac ibadetinin emri', phaseEn:'Command of Pilgrimage' },
    ],
  },
  {
    id: 'yusuf',
    nameTr: 'Hz. Yusuf', nameEn: 'Joseph',
    subtitleTr: 'Kur\'an\'ın en güzel kıssası — başından sonuna tek sûreli eksiksiz anlatı',
    subtitleEn: "The Quran's most beautiful story — a complete narrative from beginning to end in one surah",
    mentions: 27,
    color: '#34d399', glow: 'rgba(52,211,153,0.65)',
    surahs: [
      { s:6,  phaseTr:'İshak soyundan', phaseEn:'Of the Lineage of Isaac' },
      { s:12, phaseTr:'Rüya → Kuyu → Saray → Hapishane → Mısır Veziri', phaseEn:'Dream → Well → Palace → Prison → Viceroy of Egypt' },
      { s:40, phaseTr:'Mısır\'daki Yusuf\'a atıf', phaseEn:'Reference to Joseph of Egypt' },
    ],
  },
  {
    id: 'musa',
    nameTr: 'Hz. Musa', nameEn: 'Moses',
    subtitleTr: '30\'dan fazla sûrede — Kur\'an\'ın en geniş kapsamlı peygamber kıssası',
    subtitleEn: 'Across 30+ surahs — the most expansive prophet narrative in the Quran',
    mentions: 136,
    color: '#60a5fa', glow: 'rgba(96,165,250,0.65)',
    surahs: [
      { s:54, phaseTr:'İlk uyarı', phaseEn:'First Warning' },
      { s:7,  phaseTr:'9 mucize — Mısır\'da', phaseEn:'9 Miracles in Egypt' },
      { s:20, phaseTr:'Sinai\'da vahiy & altın buzağı', phaseEn:'Sinai Revelation & Golden Calf' },
      { s:26, phaseTr:'Mısır\'dan kurtuluş', phaseEn:'Exodus from Egypt' },
      { s:28, phaseTr:'Doğum → kaçış → dönüş', phaseEn:'Birth → Flight → Return' },
      { s:10, phaseTr:'Firavun\'un boğulması', phaseEn:"Pharaoh's Drowning" },
      { s:37, phaseTr:'Sinai\'da çağrı', phaseEn:'Call at Sinai' },
      { s:40, phaseTr:'Saraydaki gizli mümin', phaseEn:'Secret Believer in Court' },
      { s:18, phaseTr:'Hızır ile sır yolculuğu', phaseEn:'Mystery Journey with Khidr' },
      { s:79, phaseTr:'Firavun\'a son uyarı', phaseEn:"Final Warning to Pharaoh" },
      { s:2,  phaseTr:'İsrailoğulları paktı', phaseEn:'Covenant with Israel' },
      { s:61, phaseTr:'Ümmetine son çağrı', phaseEn:'Final Call to His People' },
    ],
  },
  {
    id: 'isa',
    nameTr: 'Hz. İsa', nameEn: 'Jesus',
    subtitleTr: 'Babasız doğum, mucizeler ve iki dinin kesişimi',
    subtitleEn: 'Virgin birth, miracles, and the intersection of two faiths',
    mentions: 25,
    color: '#a78bfa', glow: 'rgba(167,139,250,0.65)',
    surahs: [
      { s:19, phaseTr:'Doğum: Meryem\'e vahiy & beşikte konuşma', phaseEn:"Birth: Mary's Revelation & Speech in Cradle" },
      { s:43, phaseTr:'İsa\'ya karşı argümanlar & dönüşü', phaseEn:"Arguments Against Jesus & His Return" },
      { s:3,  phaseTr:'Mucizeler & Havariler', phaseEn:'Miracles & Disciples' },
      { s:4,  phaseTr:'Çarmıha gerilmedi', phaseEn:'Was Not Crucified' },
      { s:61, phaseTr:'Ahmed\'i müjdeledi', phaseEn:'Foretold Ahmad' },
      { s:5,  phaseTr:'Maide mucizesi & son yemek', phaseEn:"Miracle of the Table & Last Supper" },
    ],
  },
];

// SVG geometry constants
const W = 1120;
const H = 320;
const PAD = 40;
const TOTAL_W = W + PAD * 2;
const NODE_Y = 248;
const MEKKI_RANKS = 86;

function rankToX(rank) {
  return PAD + ((rank - 1) / 113) * W;
}

function buildArcPath(x1, x2, heightFactor) {
  const mx = (x1 + x2) / 2;
  const gap = Math.abs(x2 - x1);
  const h = Math.min(190, gap * heightFactor + 20);
  const cy = NODE_Y - h;
  return `M ${x1},${NODE_Y} Q ${mx},${cy} ${x2},${NODE_Y}`;
}

export default function ProphetAtlas() {
  const { language } = useLanguage();
  // Multi-prophet selection: Set of prophet IDs
  const [selectedProphets, setSelectedProphets] = useState(new Set(['nuh']));
  // focusedProphet drives the map and is the last-clicked prophet
  const [focusedProphet, setFocusedProphet] = useState('nuh');
  const [hoveredNode, setHoveredNode] = useState(null);
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);
  const [expandedRef, setExpandedRef] = useState(null);
  const [duaApiAr, setDuaApiAr] = useState({});
  const [treePopup, setTreePopup] = useState(null);   // { key, x, y } — silsile ayet tooltip
  const [giftPopup, setGiftPopup] = useState(null);   // { key, x, y } — vasıf ayet tooltip
  const svgRef = useRef(null);

  useEffect(() => {
    fetch('/dua-arabic.json')
      .then(r => r.json())
      .then(setDuaApiAr)
      .catch(() => {}); // silently fall back to hardcoded duaAr
  }, []);

  // Popup dışına tıklayınca kapat
  useEffect(() => {
    if (!treePopup) return;
    const close = () => setTreePopup(null);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, [treePopup]);

  useEffect(() => {
    if (!giftPopup) return;
    const close = () => setGiftPopup(null);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, [giftPopup]);

  const handleTreeRef = useCallback((e, key) => {
    e.stopPropagation();
    setTreePopup(prev => prev?.key === key ? null : { key, x: e.clientX, y: e.clientY });
  }, []);

  const handleGiftRefClick = useCallback((key, e) => {
    e.stopPropagation();
    setGiftPopup(prev => prev?.key === key ? null : { key, x: e.clientX, y: e.clientY });
  }, []);

  const focusedProphetObj = PROPHETS.find(p => p.id === focusedProphet);
  // Render focused prophet last (on top) in the SVG
  const selectedProphetObjs = PROPHETS.filter(p => selectedProphets.has(p.id) && p.id !== focusedProphet)
    .concat(PROPHETS.filter(p => p.id === focusedProphet && selectedProphets.has(p.id)));

  const toggleProphet = useCallback((id) => {
    setHoveredNode(null);
    setSelectedProphets(prev => {
      const next = new Set(prev);
      if (next.has(id) && next.size > 1) {
        next.delete(id);
        // If removing the focused prophet, shift focus to first remaining
        setFocusedProphet(fp => fp === id ? [...next][0] : fp);
      } else {
        next.add(id);
        setFocusedProphet(id);
      }
      return next;
    });
  }, []);

  // Build combined highlight map: surah → [{prophet, phaseTr, phaseEn}]
  const highlightMap = {};
  selectedProphetObjs.forEach(p => {
    p.surahs.forEach(item => {
      if (!highlightMap[item.s]) highlightMap[item.s] = [];
      highlightMap[item.s].push({ prophet: p, phaseTr: item.phaseTr, phaseEn: item.phaseEn });
    });
  });

  // Arc height factor per lane — each prophet gets a distinct vertical level
  const LANE_FACTORS = [0.32, 0.58, 0.84, 1.1, 1.36];

  // Build arcs per selected prophet
  const allProphetArcs = selectedProphetObjs.map((prophet, laneIdx) => {
    const sorted = [...prophet.surahs].sort((a, b) => RANK_BY_SURAH[a.s] - RANK_BY_SURAH[b.s]);
    const arcs = [];
    for (let i = 0; i < sorted.length - 1; i++) {
      const from = sorted[i];
      const to = sorted[i + 1];
      arcs.push({
        x1: rankToX(RANK_BY_SURAH[from.s]),
        x2: rankToX(RANK_BY_SURAH[to.s]),
        key: `${prophet.id}-${from.s}-${to.s}`,
        idx: i,
      });
    }
    return { prophet, arcs, laneIdx };
  });

  const handleNodeEnter = useCallback((surah) => {
    setHoveredNode({ surah, x: rankToX(RANK_BY_SURAH[surah]) });
  }, []);
  const handleNodeLeave = useCallback(() => setHoveredNode(null), []);

  const tr = (t, e) => language === 'tr' ? t : e;

  const animKey = [...selectedProphets].sort().join('-');
  const multiSelect = selectedProphets.size > 1;

  return (
    <section id="math" style={{
      background: 'linear-gradient(180deg, #0a0a1a 0%, #0d1b2a 50%, #0a0a1a 100%)',
      padding: '100px 0 24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background pattern */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.03,
        backgroundImage: 'radial-gradient(circle, #d4a574 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div style={{
            display: 'inline-block', color: '#d4a574', fontSize: '0.75rem',
            fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase',
            marginBottom: '16px', opacity: 0.85,
          }}>
            {tr('Anlatı Haritası', 'Narrative Map')}
          </div>
          <h2 style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: 'clamp(2rem, 5vw, 3.2rem)',
            fontWeight: 900, color: '#e8e6e3',
            margin: '0 0 20px', lineHeight: 1.15,
          }}>
            {tr('Peygamberler Atlası', 'Prophets Atlas')}
          </h2>
          <p style={{
            color: '#94a3b8', fontSize: '1.1rem', lineHeight: 1.7,
            maxWidth: '640px', margin: '0 auto',
          }}>
            {tr(
              'Kur\'an\'da her peygamberin anlatısı, vahyin belirli dönemlerine ve sûrelerine dağıtılmıştır. Birden fazla peygamberi seçerek anlatıların nerede örtüştüğünü karşılaştırabilirsiniz.',
              'In the Quran, each prophet\'s narrative is distributed across specific surahs and periods. Select multiple prophets to compare where their narratives overlap.',
            )}
          </p>
        </div>

        {/* Prophet selector */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: '10px',
          flexWrap: 'wrap', marginBottom: '32px',
        }}>
          {PROPHETS.map(p => {
            const isSelected = selectedProphets.has(p.id);
            const isFocused = focusedProphet === p.id && isSelected;
            return (
              <button
                key={p.id}
                onClick={() => toggleProphet(p.id)}
                style={{
                  padding: '10px 22px',
                  background: isSelected ? `${p.color}22` : 'rgba(255,255,255,0.04)',
                  border: `1.5px solid ${isSelected ? p.color : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: '999px',
                  color: isSelected ? p.color : '#94a3b8',
                  fontSize: '0.88rem', fontWeight: isSelected ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  boxShadow: isFocused ? `0 0 18px ${p.glow}` : 'none',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {tr(p.nameTr, p.nameEn)}
              </button>
            );
          })}
        </div>

        {/* Multi-select hint */}
        <div style={{ textAlign: 'center', marginBottom: '32px', minHeight: '24px' }}>
          {multiSelect ? (
            <p style={{ color: 'rgba(148,163,184,0.5)', fontSize: '0.8rem', margin: 0 }}>
              {tr(
                'Harita için seçili peygamber: ' + tr(focusedProphetObj.nameTr, focusedProphetObj.nameEn),
                'Map shows: ' + tr(focusedProphetObj.nameTr, focusedProphetObj.nameEn),
              )}
            </p>
          ) : (
            <p style={{ color: focusedProphetObj.color, fontSize: '0.92rem', fontStyle: 'italic', margin: 0 }}>
              {tr(focusedProphetObj.subtitleTr, focusedProphetObj.subtitleEn)}
            </p>
          )}
        </div>

        {/* SVG Visualization */}
        <div style={{ position: 'relative', width: '100%' }}>
          <svg
            ref={svgRef}
            viewBox={`0 0 ${TOTAL_W} ${H}`}
            width="100%"
            style={{ display: 'block', overflow: 'visible' }}
            aria-label={tr('Nüzul sırası haritası', 'Revelation order map')}
          >
            <defs>
              {PROPHETS.map(p => (
                <linearGradient key={p.id} id={`arcGrad-${p.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={p.color} stopOpacity="0.3" />
                  <stop offset="50%" stopColor={p.color} stopOpacity="0.8" />
                  <stop offset="100%" stopColor={p.color} stopOpacity="0.3" />
                </linearGradient>
              ))}
              <filter id="nodeGlow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="arcGlow" x="-5%" y="-50%" width="110%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <style>{`
                @keyframes arcDraw {
                  from { stroke-dashoffset: 2000; opacity: 0; }
                  to   { stroke-dashoffset: 0;    opacity: 1; }
                }
                @keyframes nodeAppear {
                  from { opacity: 0; transform: scale(0); }
                  to   { opacity: 1; transform: scale(1); }
                }
              `}</style>
            </defs>

            {/* Period background bands + separator */}
            {(() => {
              const sepX = rankToX(86) + (rankToX(87) - rankToX(86)) / 2;
              const bandTop = 24;
              const bandH = NODE_Y - bandTop + 14;
              return (
                <>
                  {/* Meccan band */}
                  <rect
                    x={PAD} y={bandTop} width={sepX - PAD} height={bandH}
                    fill="rgba(212,165,116,0.045)" rx="6"
                  />
                  {/* Medinan band */}
                  <rect
                    x={sepX} y={bandTop} width={TOTAL_W - PAD - sepX} height={bandH}
                    fill="rgba(52,211,153,0.04)" rx="6"
                  />
                  {/* Separator line */}
                  <line
                    x1={sepX} y1={bandTop} x2={sepX} y2={NODE_Y + 32}
                    stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="4,4"
                  />
                  {/* Period labels — top center of each band */}
                  <text
                    x={(PAD + sepX) / 2} y={bandTop + 14}
                    fill="rgba(212,165,116,0.5)"
                    fontSize="8" textAnchor="middle" fontFamily="Inter,sans-serif"
                    letterSpacing="0.12em" fontWeight="700"
                  >
                    {tr('MEKKİ DÖNEM', 'MECCAN PERIOD')}
                  </text>
                  <text
                    x={(sepX + TOTAL_W - PAD) / 2} y={bandTop + 14}
                    fill="rgba(52,211,153,0.5)"
                    fontSize="8" textAnchor="middle" fontFamily="Inter,sans-serif"
                    letterSpacing="0.12em" fontWeight="700"
                  >
                    {tr('MEDENİ DÖNEM', 'MEDINAN PERIOD')}
                  </text>
                </>
              );
            })()}

            {/* Multi-prophet inline legend */}
            {multiSelect && (
              <g>
                {selectedProphetObjs.map((p, i) => {
                  const lx = PAD + 8 + i * 100;
                  return (
                    <g key={p.id}>
                      <line x1={lx} y1={46} x2={lx + 16} y2={46}
                        stroke={p.color} strokeWidth="2.5" strokeLinecap="round" />
                      <circle cx={lx + 8} cy={46} r={3.5} fill={p.color} />
                      <text x={lx + 22} y={49.5}
                        fill={p.color} fontSize="8.5"
                        fontFamily="Inter,sans-serif" fontWeight="600"
                      >
                        {tr(p.nameTr, p.nameEn)}
                      </text>
                    </g>
                  );
                })}
              </g>
            )}

            {/* Timeline baseline */}
            <line
              x1={PAD} y1={NODE_Y} x2={TOTAL_W - PAD} y2={NODE_Y}
              stroke="rgba(255,255,255,0.08)" strokeWidth="1"
            />

            {/* Year markers */}
            {[1, 20, 40, 60, 80, 87, 100, 114].map(rank => {
              const x = rankToX(rank);
              const labels = {
                1:  {tr:'610', en:'610 CE'},
                20: {tr:'613', en:'613 CE'},
                40: {tr:'616', en:'616 CE'},
                60: {tr:'619', en:'619 CE'},
                80: {tr:'621', en:'621 CE'},
                87: {tr:'Hicret 622', en:'Hijra 622'},
                100:{tr:'628', en:'628 CE'},
                114:{tr:'632', en:'632 CE'},
              };
              if (!labels[rank]) return null;
              return (
                <g key={rank}>
                  <line x1={x} y1={NODE_Y - 5} x2={x} y2={NODE_Y + 5}
                    stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
                  <text x={x} y={NODE_Y + 20} fill="rgba(148,163,184,0.7)"
                    fontSize="9.5" textAnchor="middle" fontFamily="Inter,sans-serif" fontWeight="500">
                    {language === 'tr' ? labels[rank].tr : labels[rank].en}
                  </text>
                </g>
              );
            })}


            {/* Animated arcs — one group per selected prophet, staggered by lane */}
            <g key={`arcs-${animKey}`}>
              {allProphetArcs.map(({ prophet, arcs, laneIdx }) => {
                const isRelated = !hoveredNode || prophet.surahs.some(s => s.s === hoveredNode.surah);
                return (
                  <g key={`arcgroup-${prophet.id}`} style={{ opacity: isRelated ? 1 : 0.15, transition: 'opacity 0.25s' }}>
                    {arcs.map((arc, i) => {
                      const path = buildArcPath(arc.x1, arc.x2, LANE_FACTORS[laneIdx] ?? 0.65);
                      const delay = i * 0.12;
                      return (
                        <path
                          key={arc.key}
                          d={path}
                          fill="none"
                          stroke={`url(#arcGrad-${prophet.id})`}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeDasharray="2000"
                          strokeDashoffset="2000"
                          filter="url(#arcGlow)"
                          style={{
                            animation: `arcDraw 0.7s ease-out ${delay}s forwards`,
                          }}
                        />
                      );
                    })}
                  </g>
                );
              })}
            </g>

            {/* Background nodes — all 114 surahs, Mekki=amber / Medeni=emerald */}
            {REVELATION.map(({ s, r }) => {
              if (highlightMap[s]) return null;
              const isMekki = r <= MEKKI_RANKS;
              return (
                <circle
                  key={s}
                  cx={rankToX(r)} cy={NODE_Y} r={3}
                  fill={isMekki ? 'rgba(212,165,116,0.35)' : 'rgba(52,211,153,0.35)'}
                />
              );
            })}

            {/* Highlighted nodes — one group per selected prophet */}
            <g key={`nodes-${animKey}`}>
              {allProphetArcs.map(({ prophet }) => {
                const sorted = [...prophet.surahs].sort((a, b) => RANK_BY_SURAH[a.s] - RANK_BY_SURAH[b.s]);
                const isFocused = prophet.id === focusedProphet;
                // How many selected prophets share each surah, for ring radius spacing
                return sorted.map((item, i) => {
                  const rank = RANK_BY_SURAH[item.s];
                  const x = rankToX(rank);
                  const delay = i * 0.08;
                  const isHovered = hoveredNode?.surah === item.s;
                  const nodeR = isFocused ? (isHovered ? 9 : 7) : (isHovered ? 7 : 5);
                  const ringR = isFocused ? (isHovered ? 16 : 13) : (isHovered ? 13 : 10);
                  return (
                    <g
                      key={`${prophet.id}-${item.s}`}
                      onMouseEnter={() => handleNodeEnter(item.s)}
                      onMouseLeave={handleNodeLeave}
                      style={{ cursor: 'pointer' }}
                    >
                      <circle
                        cx={x} cy={NODE_Y} r={ringR}
                        fill="none"
                        stroke={prophet.color}
                        strokeWidth="1"
                        strokeOpacity={isHovered ? 0.5 : 0.25}
                        style={{ transition: 'r 0.2s, stroke-opacity 0.2s' }}
                      />
                      <circle
                        cx={x} cy={NODE_Y} r={nodeR}
                        fill={prophet.color}
                        filter="url(#nodeGlow)"
                        style={{
                          transition: 'r 0.2s',
                          animation: `nodeAppear 0.4s ease-out ${delay}s both`,
                          transformOrigin: `${x}px ${NODE_Y}px`,
                        }}
                      />
                      {isFocused && (
                        <text
                          x={x} y={NODE_Y - 18}
                          fill={prophet.color}
                          fontSize="8" textAnchor="middle"
                          fontFamily="Inter, sans-serif" fontWeight="700"
                          opacity="0.9"
                          style={{ pointerEvents: 'none' }}
                        >
                          {`S.${item.s}`}
                        </text>
                      )}
                    </g>
                  );
                });
              })}
            </g>

            {/* Tooltip */}
            {hoveredNode && (() => {
              const surahName = SURAH_NAMES[hoveredNode.surah];
              const x = hoveredNode.x;
              const phases = highlightMap[hoveredNode.surah] || [];
              const tooltipW = 220;
              const tooltipH = 32 + phases.length * 28 + 18;
              const tooltipX = Math.max(PAD + tooltipW / 2, Math.min(TOTAL_W - PAD - tooltipW / 2, x));
              const tooltipY = NODE_Y - tooltipH - 20;
              return (
                <g>
                  <rect
                    x={tooltipX - tooltipW / 2} y={tooltipY}
                    width={tooltipW} height={tooltipH}
                    rx="8" ry="8"
                    fill="#0d1b2a" stroke="rgba(255,255,255,0.15)"
                    strokeWidth="1"
                    opacity="0.97"
                  />
                  {/* Surah name header */}
                  <text
                    x={tooltipX} y={tooltipY + 17}
                    fill="#e8e6e3" fontSize="10.5" fontWeight="700"
                    textAnchor="middle" fontFamily="Inter, sans-serif"
                  >
                    {surahName ? (language === 'tr' ? surahName.tr : surahName.en) : `Sure ${hoveredNode.surah}`}
                    {' '}
                    <tspan fill="rgba(148,163,184,0.5)" fontSize="9" fontWeight="400">
                      {tr(`(${hoveredNode.surah}. sûre · nüzulde ${RANK_BY_SURAH[hoveredNode.surah]}.)`,
                          `(surah ${hoveredNode.surah} · revealed ${RANK_BY_SURAH[hoveredNode.surah]})`)}
                    </tspan>
                  </text>
                  {/* Per-prophet phases */}
                  {phases.map(({ prophet, phaseTr, phaseEn }, idx) => (
                    <g key={prophet.id}>
                      <circle
                        cx={tooltipX - tooltipW / 2 + 14}
                        cy={tooltipY + 34 + idx * 28}
                        r={4} fill={prophet.color}
                      />
                      <text
                        x={tooltipX - tooltipW / 2 + 24}
                        y={tooltipY + 30 + idx * 28}
                        fill={prophet.color} fontSize="8.5" fontWeight="700"
                        textAnchor="start" fontFamily="Inter, sans-serif"
                      >
                        {tr(prophet.nameTr, prophet.nameEn)}
                      </text>
                      <text
                        x={tooltipX - tooltipW / 2 + 24}
                        y={tooltipY + 43 + idx * 28}
                        fill="#94a3b8" fontSize="8.5"
                        textAnchor="start" fontFamily="Inter, sans-serif"
                      >
                        {language === 'tr' ? phaseTr : phaseEn}
                      </text>
                    </g>
                  ))}
                  {/* Connector */}
                  <line
                    x1={x} y1={NODE_Y - 16}
                    x2={x} y2={tooltipY + tooltipH}
                    stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="3,2"
                  />
                </g>
              );
            })()}
          </svg>
        </div>

        {/* ── Prophet Stats Panel ── */}
        {(() => {
          const isSingle = !multiSelect;

          if (isSingle) {
            const p = focusedProphetObj;
            const mekkiSurahs = p.surahs.filter(s => RANK_BY_SURAH[s.s] <= MEKKI_RANKS);
            const medeniSurahs = p.surahs.filter(s => RANK_BY_SURAH[s.s] > MEKKI_RANKS);
            const total = p.surahs.length;
            const mekkiPct = Math.round((mekkiSurahs.length / total) * 100);

            return (
              <div style={{ marginTop: '28px' }}>
                {/* 3 stat counters */}
                <div style={{
                  display: 'flex', justifyContent: 'center', gap: '12px',
                  flexWrap: 'wrap', marginBottom: '20px',
                }}>
                  {[
                    { value: p.mentions, labelTr: 'kez ismiyle geçiyor', labelEn: 'times mentioned by name' },
                    { value: total, labelTr: 'sûrede kıssası anlatılır', labelEn: 'surahs contain the narrative' },
                    { value: `${mekkiSurahs.length}/${medeniSurahs.length}`, labelTr: 'Mekkî / Medenî sûre', labelEn: 'Meccan / Medinan surahs' },
                  ].map(({ value, labelTr, labelEn }) => (
                    <div key={labelTr} style={{
                      background: `${p.color}0d`,
                      border: `1px solid ${p.color}2a`,
                      borderRadius: '12px',
                      padding: '14px 22px',
                      textAlign: 'center',
                      minWidth: '140px',
                    }}>
                      <div style={{
                        color: p.color, fontSize: '1.6rem', fontWeight: 800,
                        fontFamily: 'Inter, sans-serif', lineHeight: 1.1,
                      }}>{value}</div>
                      <div style={{
                        color: 'rgba(148,163,184,0.65)', fontSize: '0.75rem',
                        marginTop: '5px', fontFamily: 'Inter, sans-serif',
                      }}>{tr(labelTr, labelEn)}</div>
                    </div>
                  ))}
                </div>

                {/* Mekki/Medeni progress bar */}
                <div style={{ maxWidth: '480px', margin: '0 auto 20px' }}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    fontSize: '0.72rem', color: 'rgba(148,163,184,0.55)',
                    marginBottom: '6px', fontFamily: 'Inter, sans-serif',
                  }}>
                    <span style={{ color: 'rgba(212,165,116,0.8)' }}>
                      {tr(`Mekkî: ${mekkiSurahs.length} sûre`, `Meccan: ${mekkiSurahs.length} surahs`)}
                    </span>
                    <span style={{ color: 'rgba(52,211,153,0.8)' }}>
                      {tr(`Medenî: ${medeniSurahs.length} sûre`, `Medinan: ${medeniSurahs.length} surahs`)}
                    </span>
                  </div>
                  <div style={{
                    height: '6px', borderRadius: '3px',
                    background: `linear-gradient(90deg,
                      rgba(212,165,116,0.75) 0%,
                      rgba(212,165,116,0.55) ${mekkiPct}%,
                      rgba(52,211,153,0.45) ${mekkiPct}%,
                      rgba(52,211,153,0.65) 100%)`,
                  }} />
                </div>

                {/* Surah pills */}
                <div style={{
                  display: 'flex', flexWrap: 'wrap', gap: '8px',
                  justifyContent: 'center',
                }}>
                  {[...p.surahs]
                    .sort((a, b) => RANK_BY_SURAH[a.s] - RANK_BY_SURAH[b.s])
                    .map(item => {
                      const isMekki = RANK_BY_SURAH[item.s] <= MEKKI_RANKS;
                      const name = SURAH_NAMES[item.s];
                      const label = name ? (language === 'tr' ? name.tr : name.en) : `${item.s}`;
                      return (
                        <div
                          key={item.s}
                          title={`${language === 'tr' ? item.phaseTr : item.phaseEn} · ${language === 'tr' ? `Sure no: ${item.s}` : `Surah no: ${item.s}`}`}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '5px',
                            padding: '4px 10px 4px 7px',
                            borderRadius: '999px',
                            background: isMekki ? 'rgba(212,165,116,0.1)' : 'rgba(52,211,153,0.1)',
                            border: `1px solid ${isMekki ? 'rgba(212,165,116,0.3)' : 'rgba(52,211,153,0.3)'}`,
                            cursor: 'default',
                          }}
                        >
                          <span style={{
                            width: '6px', height: '6px', borderRadius: '50%', flexShrink: 0,
                            background: isMekki ? 'rgba(212,165,116,0.9)' : 'rgba(52,211,153,0.9)',
                          }} />
                          <span style={{
                            fontSize: '0.75rem', fontFamily: 'Inter, sans-serif',
                            color: isMekki ? 'rgba(212,165,116,0.85)' : 'rgba(52,211,153,0.85)',
                            fontWeight: 500,
                          }}>
                            {label}
                          </span>
                          <span style={{
                            fontSize: '0.68rem', fontFamily: 'Inter, sans-serif',
                            color: 'rgba(148,163,184,0.4)', fontWeight: 400,
                          }}>
                            {item.s}
                          </span>
                        </div>
                      );
                    })}
                </div>
                <div style={{
                  textAlign: 'center', marginTop: '10px',
                  fontSize: '0.82rem', color: 'rgba(148,163,184,0.75)',
                  fontFamily: 'Inter, sans-serif',
                }}>
                  {tr(
                    '● Altın = Mekkî sûre  ● Yeşil = Medenî sûre  · Yanındaki rakam sûre numarasıdır  · Arc boyutu iki sûre arası nüzul mesafesini yansıtır',
                    '● Gold = Meccan surah  ● Green = Medinan surah  · The number is the surah number  · Arc size reflects revelation distance between surahs',
                  )}
                </div>
              </div>
            );
          }

          // Multi-prophet: side-by-side comparison cards
          return (
            <div style={{
              marginTop: '28px',
              display: 'grid',
              gridTemplateColumns: `repeat(${Math.min(selectedProphetObjs.length, 3)}, 1fr)`,
              gap: '12px',
            }}>
              {selectedProphetObjs.map(p => {
                const mekkiCount = p.surahs.filter(s => RANK_BY_SURAH[s.s] <= MEKKI_RANKS).length;
                const medeniCount = p.surahs.filter(s => RANK_BY_SURAH[s.s] > MEKKI_RANKS).length;
                const total = p.surahs.length;
                const mekkiPct = Math.round((mekkiCount / total) * 100);
                const isFocused = p.id === focusedProphet;
                return (
                  <div
                    key={p.id}
                    onClick={() => toggleProphet(p.id)}
                    style={{
                      background: `${p.color}0d`,
                      border: `1px solid ${isFocused ? p.color + '55' : p.color + '22'}`,
                      borderRadius: '12px',
                      padding: '16px',
                      cursor: 'pointer',
                      transition: 'border-color 0.2s',
                      boxShadow: isFocused ? `0 0 16px ${p.glow}33` : 'none',
                    }}
                  >
                    <div style={{
                      color: p.color, fontWeight: 700, fontSize: '0.9rem',
                      fontFamily: 'Inter, sans-serif', marginBottom: '12px',
                    }}>
                      {tr(p.nameTr, p.nameEn)}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'rgba(148,163,184,0.55)', fontSize: '0.72rem', fontFamily: 'Inter, sans-serif' }}>
                          {tr('Zikir sayısı', 'Mentions')}
                        </span>
                        <span style={{ color: p.color, fontWeight: 700, fontSize: '0.85rem', fontFamily: 'Inter, sans-serif' }}>
                          {p.mentions}×
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'rgba(148,163,184,0.55)', fontSize: '0.72rem', fontFamily: 'Inter, sans-serif' }}>
                          {tr('Sûre sayısı', 'Surahs')}
                        </span>
                        <span style={{ color: '#e8e6e3', fontWeight: 600, fontSize: '0.85rem', fontFamily: 'Inter, sans-serif' }}>
                          {total}
                        </span>
                      </div>
                      {/* Mekki/Medeni mini bar */}
                      <div>
                        <div style={{
                          display: 'flex', justifyContent: 'space-between',
                          fontSize: '0.68rem', color: 'rgba(148,163,184,0.45)',
                          marginBottom: '4px', fontFamily: 'Inter, sans-serif',
                        }}>
                          <span style={{ color: 'rgba(212,165,116,0.75)' }}>
                            {tr(`Mek. ${mekkiCount}`, `Mec. ${mekkiCount}`)}
                          </span>
                          <span style={{ color: 'rgba(52,211,153,0.75)' }}>
                            {tr(`Med. ${medeniCount}`, `Med. ${medeniCount}`)}
                          </span>
                        </div>
                        <div style={{
                          height: '4px', borderRadius: '2px',
                          background: `linear-gradient(90deg,
                            rgba(212,165,116,0.7) 0%,
                            rgba(212,165,116,0.5) ${mekkiPct}%,
                            rgba(52,211,153,0.4) ${mekkiPct}%,
                            rgba(52,211,153,0.6) 100%)`,
                        }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })()}

        {/* Methodology disclaimer — collapsible */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button
            onClick={() => setDisclaimerOpen(o => !o)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'rgba(148,163,184,0.75)', fontSize: '0.85rem',
              fontFamily: 'Inter, sans-serif',
              display: 'inline-flex', alignItems: 'center', gap: '5px',
              padding: '4px 0',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'rgba(212,165,116,0.85)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(148,163,184,0.75)'}
          >
            <span style={{ fontSize: '0.85rem' }}>ℹ</span>
            {tr('Metodoloji notu', 'Methodology note')}
            <span style={{
              display: 'inline-block',
              transform: disclaimerOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s',
              fontSize: '0.7rem',
            }}>▾</span>
          </button>
          {disclaimerOpen && (
            <div style={{
              maxWidth: '680px', margin: '10px auto 0',
              padding: '14px 20px',
              background: 'rgba(255,255,255,0.02)',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.06)',
              textAlign: 'left',
            }}>
              <p style={{ color: 'rgba(148,163,184,0.55)', fontSize: '0.82rem', lineHeight: 1.65, margin: 0 }}>
                {tr(
                  'Bu görsel, Kur\'an âyetlerinin değil sûrelerin geleneksel nüzul sıralamasını esas alır (İbn Abbas rivayeti temel alınmıştır). Her sûrenin ilk nüzul sırasındaki konumu gösterilmektedir; bireysel âyetlerin nüzul sırası klasik kaynaklarda büyük ölçüde bilinmemektedir. Sûre bazlı kapsama verisi, peygamber anlatısının yoğunluğunu değil hangi sûrelerde geçtiğini gösterir.',
                  'This visualization is based on the traditional surah-level revelation order (following the Ibn Abbas tradition), not individual verse order. Each surah is placed at its position in the revelation sequence; individual verse timing is largely unknown in classical sources. Surah-level coverage data shows which surahs contain a prophet\'s narrative, not narrative intensity.',
                )}
              </p>
            </div>
          )}
        </div>

        {/* Insight section */}
        <div style={{ marginTop: '64px', maxWidth: '920px', margin: '64px auto 0' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{
              color: '#d4a574', fontSize: '0.72rem', fontWeight: 700,
              letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '14px',
            }}>
              {tr('Vahyin Pedagojik Tasarımı', 'The Pedagogical Design of Revelation')}
            </div>
            <h3 style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: 700, color: '#e8e6e3', margin: '0 0 16px',
            }}>
              {tr('Her Kıssa Bir Ayna', 'Every Story Was a Mirror')}
            </h3>
            <p style={{
              color: '#94a3b8', fontSize: '1rem', lineHeight: 1.75,
              maxWidth: '680px', margin: '0 auto',
            }}>
              {tr(
                'Kur\'an\'daki peygamber kıssaları rastlantısal değil; her biri Hz. Muhammed\'in (s.a.v.) o anda yaşadığı duruma birebir denk gelecek şekilde nazil olmuştur. Vahiy, 23 yıl boyunca hedeflenmiş bir destek ve eğitim programı gibi işlemiştir.',
                "The prophet narratives in the Quran are not incidental — each was revealed to mirror precisely what Prophet Muhammad ﷺ was facing at that moment. Over 23 years, revelation functioned as a targeted program of guidance and support.",
              )}
            </p>
          </div>

          {/* Parallel table */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {[
              {
                prophet: PROPHETS.find(p => p.id === 'ibrahim'),
                narrativeTr: 'Putlara başkaldırı — babasının ve kavminin baskısına rağmen Tevhid. Ateşe atılma.',
                narrativeEn: 'Revolt against idols — monotheism despite rejection by father and people. Cast into fire.',
                contextTr: 'Mekke\'nin ilk yılları: Kureyş baskısı, mal ve makam teklifleri, sosyal boykot. Medine döneminde ise Hz. İbrahim\'in Kâbe inşası ve Haniflik vurgusu — Yahudi ve Hristiyanlara karşı tevhidin savunusu olarak yeniden devreye girdi.',
                contextEn: 'Early Mecca: Quraysh pressure, offers of wealth and status, social boycott. In Medina, the Kaaba-building and Hanifiyya narrative returned — as a defense of monotheism against Jewish and Christian claims.',
                periodTr: 'Mekke · Erken + Medine Dönemi',
                periodEn: 'Mecca · Early + Medinan Period',
              },
              {
                prophet: PROPHETS.find(p => p.id === 'nuh'),
                narrativeTr: '950 yıl alay ve inkâr — hatta öz oğlu gemiyi reddetti. Yine de inşa etti, yine de davet etti. Kavmine de "mecnun" dediler (Kamer 54:9).',
                narrativeEn: '950 years of mockery and denial — even his own son refused the ark. He built anyway, he called anyway. His people called him "majnun" too (Qamar 54:9).',
                contextTr: 'Hz. Ebu Talib yıllarca Hz. Muhammed ﷺ\'i korudu — ama iman etmeden vefat etti. En sevilen insanın imansız ölümü, Hz. Nuh\'un oğlunun dalgalarda yok olmasıyla bire bir örtüşüyordu. "Mecnun" iftirası da ortaktı.',
                contextEn: "Abu Talib protected the Prophet for years — yet died without accepting Islam. The death of the most beloved person without faith mirrored Noah's son vanishing beneath the waves. The 'madman' slander was shared too.",
                periodTr: 'Mekke · Orta Dönem · Ebu Talib Yılları',
                periodEn: 'Mecca · Middle Period · Abu Talib Years',
              },
              {
                prophet: PROPHETS.find(p => p.id === 'yusuf'),
                narrativeTr: 'Kuyudan hapishaneye, hapishâneden vezirliğe — her çile bir sonraki adımın kapısıydı.',
                narrativeEn: 'From well to prison, from prison to viceroy — triumph born from the deepest darkness.',
                contextTr: 'Hüzün Yılı (619): Hz. Hatice ve Hz. Ebu Talib aynı yıl vefat etti. Kur\'an\'ın en tesellî edici sûresi tam bu dönemde nazil oldu.',
                contextEn: "Year of Sorrow (619): Khadijah and Abu Talib died the same year. The Quran's most consoling surah was revealed precisely then.",
                periodTr: 'Mekke · Hüzün Yılı 619',
                periodEn: 'Mecca · Year of Sorrow 619',
              },
              {
                prophet: PROPHETS.find(p => p.id === 'musa'),
                narrativeTr: 'Firavun karşısında yılmayan sabır — mucizeler gösterildi, yine de reddedildi. Nihayet zafer.',
                narrativeEn: 'Unshaken patience before Pharaoh — miracles shown, still rejected. Ultimately victorious.',
                contextTr: 'Baskı dorukta, Medine\'ye Büyük Hicret yaklaşıyor. Kur\'an, Hz. Musa\'nın Firavun\'dan çıkışını anlatarak Müslümanlara zımnen şunu söylüyordu: "Siz de hicret edeceksiniz — ve arkanızdan gelen Mekkeli müşrikler, Firavun\'un ordusu gibi helak olacak."',
                contextEn: "Oppression at its peak, the Great Hijra imminent. By narrating Moses' Exodus, the Quran was implicitly telling Muslims: 'You too will migrate — and the Meccan pursuers, like Pharaoh's army, will be destroyed.'",
                periodTr: 'Mekke · Son Dönem · Hicret Arifesi',
                periodEn: 'Mecca · Late Period · Eve of Hijra',
              },
              {
                prophet: PROPHETS.find(p => p.id === 'isa'),
                narrativeTr: 'Mucizeler de yetmedi, hüccet de — kavmi yine de böldü. Ama Allah onu ref\' ile yükseltip şereflendirdi; o da gidinceye dek Hz. Muhammed ﷺ\'i müjdeledi (Saf 61:6). Her zahiri son, ilahi bir yeniden başlangıçtı.',
                narrativeEn: "Miracles weren't enough, argument wasn't enough — his people divided anyway. Yet God honored him with the rafa'; and before departing, he foretold Prophet Muhammad (As-Saff 61:6). Every apparent ending was a divine new beginning.",
                contextTr: '631: Necran\'dan gelen Hristiyan heyeti Medine\'ye ulaştı; Âl-i İmrân\'ın büyük bölümü bu müzakereye cevap olarak indi. Mübahele ayeti (3:61) — hakikatin ilan edildiği o tarihi an. Hz. Muhammed ﷺ\'in zahiri "yalnızlığı" da Hz. İsa\'nın ref\'i gibi geçici bir görüntüydü.',
                contextEn: "631: The Najran Christian delegation arrived in Medina; most of Âl-i Imrân was revealed in response. The Mubahala verse (3:61) — that historic moment of declaring truth. The Prophet's apparent 'isolation' was, like Jesus' ascension, only a surface appearance.",
                periodTr: 'Medine · Necran Heyeti 631',
                periodEn: 'Medina · Najran Delegation 631',
              },
            ].map((row, i) => {
              const p = row.prophet;
              if (!p) return null;
              return (
                <div key={p.id} style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto 1fr',
                  gap: '0',
                  background: i % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'transparent',
                  borderRadius: '12px',
                  overflow: 'hidden',
                }}>
                  {/* Left: Prophet narrative */}
                  <div style={{ padding: '20px 24px' }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px',
                    }}>
                      <div style={{
                        width: '10px', height: '10px', borderRadius: '50%',
                        background: p.color,
                        boxShadow: `0 0 8px ${p.glow}`,
                        flexShrink: 0,
                      }} />
                      <span style={{
                        color: p.color, fontSize: '0.82rem', fontWeight: 700,
                        fontFamily: 'Inter, sans-serif',
                      }}>
                        {tr(p.nameTr, p.nameEn)}
                      </span>
                      <span style={{
                        color: 'rgba(148,163,184,0.4)', fontSize: '0.72rem',
                        fontFamily: 'Inter, sans-serif',
                        marginLeft: 'auto',
                      }}>
                        {tr(row.periodTr, row.periodEn)}
                      </span>
                    </div>
                    <p style={{
                      color: '#e8e6e3', fontSize: '0.88rem', lineHeight: 1.65,
                      margin: 0, opacity: 0.85,
                    }}>
                      {tr(row.narrativeTr, row.narrativeEn)}
                    </p>
                  </div>

                  {/* Center arrow */}
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '0 8px',
                    color: 'rgba(212,165,116,0.4)',
                    fontSize: '1.1rem',
                  }}>
                    ↔
                  </div>

                  {/* Right: Hz. Muhammad's context */}
                  <div style={{
                    padding: '20px 24px',
                    borderLeft: '1px solid rgba(255,255,255,0.05)',
                  }}>
                    <div style={{
                      color: '#d4a574', fontSize: '0.72rem', fontWeight: 700,
                      letterSpacing: '0.04em',
                      marginBottom: '8px', opacity: 0.7,
                    }}>
                      {tr('Hz. Muhammed ﷺ\'in durumu', 'Prophet Muhammad\'s ﷺ situation')}
                    </div>
                    <p style={{
                      color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.65, margin: 0,
                    }}>
                      {tr(row.contextTr, row.contextEn)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Closing line */}
          <p style={{
            textAlign: 'center', color: 'rgba(148,163,184,0.5)',
            fontSize: '0.9rem', lineHeight: 1.7,
            marginTop: '36px', fontStyle: 'italic',
          }}>
            {tr(
              'Her kıssa kendi döneminde bir teselliydi, bir rehberdi, bir kanıttı. 23 yılın her anında doğru ses, doğru zamanda geldi.',
              'Each story was, in its time, a consolation, a guide, and a proof. The right voice arrived at the right moment across 23 years.',
            )}
          </p>

          {/* Table note */}
          <div style={{
            marginTop: '24px',
            padding: '14px 18px',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '8px',
          }}>
            <p style={{ color: 'rgba(148,163,184,0.75)', fontSize: '0.85rem', lineHeight: 1.7, margin: 0 }}>
              <span style={{ color: 'rgba(212,165,116,0.85)', fontWeight: 700, marginRight: '6px' }}>Not:</span>
              {tr(
                'Peygamber kıssaları Kur\'an\'da tek bir döneme sınırlı değildir; bir peygamber hem Mekkî hem Medenî sûrelerde yer alabilir. Bu tablo, her kıssanın en yoğun işlendiği nüzul ortamını ve Siyer\'deki psikolojik karşılığını esas almaktadır.',
                "Prophet narratives in the Quran are not confined to a single period; a prophet may appear in both Meccan and Medinan surahs. This table focuses on the revelation context in which each narrative was most intensively developed, and its psychological parallel in the Sira.",
              )}
            </p>
          </div>
        </div>

        {/* Transition — bridge between revelation data and geography */}
        <div style={{ textAlign: 'center', margin: '64px 0 0' }}>
          <p style={{
            color: 'rgba(148,163,184,0.5)', fontSize: '0.95rem',
            lineHeight: 1.75, maxWidth: '560px', margin: '0 auto',
            fontStyle: 'italic',
          }}>
            {tr(
              'Kıssalar bitti. Coğrafya değişmedi.',
              'The stories ended. The geography did not.',
            )}
          </p>
        </div>

        {/* Compact prophet picker — just above the map */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: '8px',
          flexWrap: 'wrap', margin: '28px 0 16px',
        }}>
          {PROPHETS.map(p => {
            const isActive = focusedProphet === p.id;
            return (
              <button
                key={p.id}
                onClick={() => {
                  setFocusedProphet(p.id);
                  setSelectedProphets(prev => new Set([...prev, p.id]));
                }}
                style={{
                  padding: '6px 16px',
                  background: isActive ? `${p.color}22` : 'rgba(255,255,255,0.04)',
                  border: `1.5px solid ${isActive ? p.color : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: '999px',
                  color: isActive ? p.color : '#64748b',
                  fontSize: '0.8rem', fontWeight: isActive ? 700 : 400,
                  cursor: 'pointer', transition: 'all 0.2s',
                  boxShadow: isActive ? `0 0 12px ${p.glow}` : 'none',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {tr(p.nameTr, p.nameEn)}
              </button>
            );
          })}
        </div>

        {/* Geographic map */}
        <ProphetMap activeProphet={focusedProphet} prophet={focusedProphetObj} />

        {/* ── 25 Quranic Prophets Reference Panel ── */}
        <div style={{ marginTop: '80px' }}>
          {/* Section header */}
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <div style={{
              color: '#d4a574', fontSize: '0.72rem', fontWeight: 700,
              letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '14px',
            }}>
              {tr("Kur'an'da İsmi Geçen 25 Peygamber", '25 Prophets Named in the Quran')}
            </div>
            <h3 style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)',
              fontWeight: 700, color: '#e8e6e3', margin: '0 0 12px',
            }}>
              {tr('Vasıflar ve Dualar', 'Attributes and Prayers')}
            </h3>
            <p style={{
              color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.7,
              maxWidth: '600px', margin: '0 auto',
            }}>
              {tr(
                "Her kart yalnızca Kur'an âyetlerine dayanmaktadır. Hadis veya siyer kaynakları kullanılmamıştır.",
                'Every card is based solely on Quranic verses. No hadith or sira sources have been used.',
              )}
            </p>
          </div>

          {/* Prophet cards grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
            gap: '12px',
          }}>
            {PROPHETS_REF.map(p => {
              const isOpen = expandedRef === p.id;
              const isMekkiSurah = (s) => RANK_BY_SURAH[s] <= 86;
              return (
                <div
                  key={p.id}
                  style={{
                    background: isOpen
                      ? 'rgba(212,165,116,0.10)'
                      : p.detailed ? 'rgba(212,165,116,0.06)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${isOpen ? 'rgba(212,165,116,0.55)' : p.detailed ? 'rgba(212,165,116,0.25)' : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: '12px',
                    overflow: 'hidden',
                    transition: 'border-color 0.2s, background 0.2s',
                    boxShadow: isOpen ? '0 0 18px rgba(212,165,116,0.12)' : 'none',
                  }}
                >
                  {/* Card header — always visible, clickable */}
                  <button
                    onClick={() => setExpandedRef(isOpen ? null : p.id)}
                    style={{
                      width: '100%', background: 'none', border: 'none',
                      cursor: 'pointer', padding: '14px 16px',
                      textAlign: 'left', display: 'flex',
                      alignItems: 'flex-start', justifyContent: 'space-between',
                      gap: '8px',
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      {/* Name row */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <span style={{
                          color: p.detailed ? '#d4a574' : '#e8e6e3',
                          fontSize: '0.88rem', fontWeight: 700,
                          fontFamily: 'Inter, sans-serif',
                        }}>
                          {tr(p.nameTr, p.nameEn)}
                        </span>
                        {p.detailed && (
                          <span style={{
                            fontSize: '0.6rem', fontWeight: 700,
                            color: 'rgba(212,165,116,0.7)',
                            background: 'rgba(212,165,116,0.12)',
                            border: '1px solid rgba(212,165,116,0.25)',
                            borderRadius: '4px', padding: '1px 5px',
                            letterSpacing: '0.08em', textTransform: 'uppercase',
                            fontFamily: 'Inter, sans-serif',
                          }}>
                            {tr('Atlas', 'Atlas')}
                          </span>
                        )}
                      </div>
                      {/* Mentions count + surah pills */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', alignItems: 'center' }}>
                        <span style={{
                          fontSize: '0.7rem', color: 'rgba(212,165,116,0.8)',
                          fontWeight: 700, fontFamily: 'Inter, sans-serif',
                          marginRight: '2px',
                        }}>
                          {p.mentions}×
                        </span>
                        {p.surahs.slice(0, 6).map(s => {
                          const isMekki = isMekkiSurah(s);
                          const name = SURAH_NAMES[s];
                          return (
                            <span key={s} style={{
                              fontSize: '0.62rem', fontFamily: 'Inter, sans-serif',
                              color: isMekki ? 'rgba(212,165,116,0.8)' : 'rgba(52,211,153,0.8)',
                              background: isMekki ? 'rgba(212,165,116,0.1)' : 'rgba(52,211,153,0.1)',
                              border: `1px solid ${isMekki ? 'rgba(212,165,116,0.2)' : 'rgba(52,211,153,0.2)'}`,
                              borderRadius: '4px', padding: '1px 5px', fontWeight: 500,
                            }}>
                              {name ? (language === 'tr' ? name.tr : name.en) : s}
                            </span>
                          );
                        })}
                        {p.surahs.length > 6 && (
                          <span style={{
                            fontSize: '0.62rem', color: 'rgba(148,163,184,0.45)',
                            fontFamily: 'Inter, sans-serif',
                          }}>
                            +{p.surahs.length - 6}
                          </span>
                        )}
                      </div>
                    </div>
                    {/* Chevron */}
                    <span style={{
                      color: 'rgba(148,163,184,0.4)', fontSize: '0.7rem',
                      transition: 'transform 0.2s',
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      flexShrink: 0, marginTop: '2px',
                    }}>▾</span>
                  </button>

                </div>
              );
            })}
          </div>


          {/* Legend */}
          <div style={{
            marginTop: '16px',
            display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
            gap: '6px 20px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.78rem',
          }}>
            <span style={{ color: 'rgba(212,165,116,0.75)' }}>
              ◻ {tr('Altın çerçeve = Atlas\'ta detaylı anlatı mevcut', 'Gold border = detailed narrative in Atlas')}
            </span>
            <span style={{ color: 'rgba(212,165,116,0.75)' }}>
              ● {tr('Altın hap = Mekkî sûre', 'Gold pill = Meccan surah')}
            </span>
            <span style={{ color: 'rgba(52,211,153,0.75)' }}>
              ● {tr('Yeşil hap = Medenî sûre', 'Green pill = Medinan surah')}
            </span>
          </div>
        </div>

        {/* ── Silsile — Quran-confirmed lineage ── */}
        <div style={{ marginTop: '64px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{
              color: '#d4a574', fontSize: '0.72rem', fontWeight: 700,
              letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '14px',
            }}>
              {tr("Kur'an'da Geçen Soy Bağları", 'Lineage Confirmed by the Quran')}
            </div>
            <h3 style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)',
              fontWeight: 700, color: '#e8e6e3', margin: '0 0 12px',
            }}>
              {tr('Peygamberler Silsilesi', 'The Chain of Prophets')}
            </h3>
            <p style={{
              color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.7,
              maxWidth: '600px', margin: '0 auto',
            }}>
              {tr(
                "Yalnızca Kur'an âyetlerinde açıkça zikredilen aile bağları gösterilmektedir.",
                'Only family connections explicitly mentioned in Quranic verses are shown.',
              )}
            </p>
          </div>

          {/* SVG silsile tree — V-shape layout
              viewBox 1200 × 450
              R1 cy=74  R2 cy=184  R3 cy=300  R4 cy=410
              Era 1: Ibrahim(R1,cx=200) ↙ Ismail(R2,cx=100)  ↘ Ishak(R2,cx=310)
                     → Yakub(R3,cx=310) → Yusuf(R4,cx=310)
              Era 2: Musa(R1,cx=500) ↔ Harun(R1,cx=650)  (brothers)
              Era 3: Davud(R1,cx=840) → Suleyman(R2,cx=840)
              Era 4: Zekariyya(R1,cx=1075) → Yahya(R2,cx=1075)
              Chips: pill badges on diagonal/vertical arrows, tıklanabilir           */}
          <div style={{ position: 'relative' }}>
          <div style={{
            overflowX: 'auto',
            background: 'linear-gradient(135deg, rgba(212,165,116,0.04) 0%, rgba(10,10,30,0.6) 50%, rgba(52,211,153,0.03) 100%)',
            border: '1px solid rgba(212,165,116,0.14)',
            borderRadius: '20px',
            padding: '28px 20px 20px',
          }}>
            <svg
              viewBox="0 0 1200 450"
              style={{ width: '100%', minWidth: '820px', maxWidth: '1200px', display: 'block', margin: '0 auto' }}
              aria-label={tr('Peygamberler silsilesi diyagramı', 'Prophet lineage diagram')}
            >
              <defs>
                {/* Single glow filter — all nodes equal */}
                <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="b"/>
                  <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
                {/* Node fill gradients — one per era color */}
                <linearGradient id="gAm" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(251,191,36,0.26)"/><stop offset="100%" stopColor="rgba(251,191,36,0.11)"/>
                </linearGradient>
                <linearGradient id="gEm" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(52,211,153,0.28)"/><stop offset="100%" stopColor="rgba(52,211,153,0.11)"/>
                </linearGradient>
                <linearGradient id="gBl" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(96,165,250,0.26)"/><stop offset="100%" stopColor="rgba(96,165,250,0.11)"/>
                </linearGradient>
                <linearGradient id="gOr" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(244,114,182,0.26)"/><stop offset="100%" stopColor="rgba(244,114,182,0.11)"/>
                </linearGradient>
                <linearGradient id="gLa" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(192,132,252,0.26)"/><stop offset="100%" stopColor="rgba(192,132,252,0.11)"/>
                </linearGradient>
                {/* Arrow markers */}
                <marker id="mAm" markerWidth="10" markerHeight="8" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3z" fill="rgba(251,191,36,0.85)"/></marker>
                <marker id="mEm" markerWidth="10" markerHeight="8" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3z" fill="rgba(52,211,153,0.85)"/></marker>
                <marker id="mOr" markerWidth="10" markerHeight="8" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3z" fill="rgba(244,114,182,0.85)"/></marker>
                <marker id="mLa" markerWidth="10" markerHeight="8" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3z" fill="rgba(192,132,252,0.85)"/></marker>
              </defs>

              {/* Era separator lines */}
              <line x1="415" y1="0" x2="415" y2="450" stroke="rgba(255,255,255,0.07)" strokeWidth="1" strokeDasharray="4,6"/>
              <line x1="740" y1="0" x2="740" y2="450" stroke="rgba(255,255,255,0.07)" strokeWidth="1" strokeDasharray="4,6"/>
              <line x1="945" y1="0" x2="945" y2="450" stroke="rgba(255,255,255,0.07)" strokeWidth="1" strokeDasharray="4,6"/>

              {/* Era labels — y=28, visible above R1 */}
              <text x="208" y="28" textAnchor="middle" fill="rgba(251,191,36,0.72)"  fontSize="11" fontFamily="Inter,sans-serif" letterSpacing="0.05em">{tr('~MÖ 2000–1700','~2000–1700 BCE')}</text>
              <text x="577" y="28" textAnchor="middle" fill="rgba(96,165,250,0.68)"  fontSize="11" fontFamily="Inter,sans-serif" letterSpacing="0.05em">{tr('~MÖ 1300','~1300 BCE')}</text>
              <text x="842" y="28" textAnchor="middle" fill="rgba(244,114,182,0.75)"  fontSize="11" fontFamily="Inter,sans-serif" letterSpacing="0.05em">{tr('~MÖ 1000','~1000 BCE')}</text>
              <text x="1072" y="28" textAnchor="middle" fill="rgba(192,132,252,0.72)" fontSize="11" fontFamily="Inter,sans-serif" letterSpacing="0.05em">{tr('~MÖ 1. yy','~1st c. BCE')}</text>

              {/* ══════ ARROWS — drawn first, nodes on top ══════ */}

              {/* İbrahim(200,96) → İsmâil(100,162) diagonal — Sâffât 102 */}
              <line x1="200" y1="96" x2="100" y2="162" stroke="rgba(251,191,36,0.60)" strokeWidth="1.8" markerEnd="url(#mAm)"/>
              {/* İbrahim(200,96) → İshak(310,162) diagonal — Sâffât 112 */}
              <line x1="200" y1="96" x2="310" y2="162" stroke="rgba(251,191,36,0.60)" strokeWidth="1.8" markerEnd="url(#mAm)"/>
              {/* İshak(310,206) → Yakûb(310,278) vertical — Hûd 71 */}
              <line x1="310" y1="206" x2="310" y2="278" stroke="rgba(251,191,36,0.55)" strokeWidth="1.8" markerEnd="url(#mAm)"/>
              {/* Yakûb(310,322) → Yûsuf(310,388) vertical gold — Yûsuf 5 */}
              <line x1="310" y1="322" x2="310" y2="388" stroke="rgba(251,191,36,0.55)" strokeWidth="1.8" markerEnd="url(#mAm)"/>
              {/* Mûsâ ↔ Hârûn dashed — Tâhâ 30 */}
              <line x1="566" y1="74" x2="584" y2="74" stroke="rgba(96,165,250,0.55)" strokeWidth="1.8" strokeDasharray="5,4"/>
              {/* Dâvûd(840,96) → Süleymân(840,162) vertical — Sâd 30 */}
              <line x1="840" y1="96" x2="840" y2="162" stroke="rgba(244,114,182,0.60)" strokeWidth="1.8" markerEnd="url(#mOr)"/>
              {/* Zekeriyyâ(1075,96) → Yahyâ(1075,162) vertical — Meryem 7 */}
              <line x1="1075" y1="96" x2="1075" y2="162" stroke="rgba(192,132,252,0.60)" strokeWidth="1.8" markerEnd="url(#mLa)"/>

              {/* ══════ VERSE REF CHIPS — tıklanabilir pill badges ══════ */}

              {/* Chip: Sâffât 102  LEFT of İbrahim→İsmâil diagonal — center x=84, 116px left of İbrahim(200) */}
              <g style={{ cursor: 'pointer' }} onClick={e => handleTreeRef(e, 'Sâffât 102')}>
                <rect x="43" y="112" width="82" height="18" rx="6" fill="rgba(251,191,36,0.13)" stroke="rgba(251,191,36,0.42)" strokeWidth="0.9"/>
                <text x="84" y="125" textAnchor="middle" fontSize="9.5" fill="rgba(251,191,36,0.92)" fontFamily="Inter,sans-serif" fontWeight="500">{tr('Sâffât 102','As-Saffat 102')}</text>
              </g>

              {/* Chip: Sâffât 112  RIGHT of İbrahim→İshak diagonal — center x=316, 116px right of İbrahim(200) */}
              <g style={{ cursor: 'pointer' }} onClick={e => handleTreeRef(e, 'Sâffât 112')}>
                <rect x="275" y="112" width="82" height="18" rx="6" fill="rgba(251,191,36,0.13)" stroke="rgba(251,191,36,0.42)" strokeWidth="0.9"/>
                <text x="316" y="125" textAnchor="middle" fontSize="9.5" fill="rgba(251,191,36,0.92)" fontFamily="Inter,sans-serif" fontWeight="500">{tr('Sâffât 112','As-Saffat 112')}</text>
              </g>

              {/* Chip: Hûd 71  left of İshak→Yakûb vertical at x=310, midY=242 */}
              <g style={{ cursor: 'pointer' }} onClick={e => handleTreeRef(e, 'Hûd 71')}>
                <rect x="248" y="233" width="60" height="18" rx="6" fill="rgba(251,191,36,0.13)" stroke="rgba(251,191,36,0.42)" strokeWidth="0.9"/>
                <text x="278" y="246" textAnchor="middle" fontSize="9.5" fill="rgba(251,191,36,0.92)" fontFamily="Inter,sans-serif" fontWeight="500">{tr('Hûd 71','Hud 71')}</text>
              </g>

              {/* Chip: Yûsuf 5  left of Yakûb→Yûsuf vertical at x=310, midY=355 */}
              <g style={{ cursor: 'pointer' }} onClick={e => handleTreeRef(e, 'Yûsuf 5')}>
                <rect x="248" y="346" width="60" height="18" rx="6" fill="rgba(251,191,36,0.13)" stroke="rgba(251,191,36,0.42)" strokeWidth="0.9"/>
                <text x="278" y="359" textAnchor="middle" fontSize="9.5" fill="rgba(251,191,36,0.92)" fontFamily="Inter,sans-serif" fontWeight="500">{tr('Yûsuf 5','Yusuf 5')}</text>
              </g>

              {/* Chip: Tâhâ 30  below Mûsâ↔Hârûn dashed, centered at x=575 */}
              <g style={{ cursor: 'pointer' }} onClick={e => handleTreeRef(e, 'Tâhâ 30')}>
                <rect x="541" y="112" width="68" height="18" rx="6" fill="rgba(96,165,250,0.13)" stroke="rgba(96,165,250,0.42)" strokeWidth="0.9"/>
                <text x="575" y="125" textAnchor="middle" fontSize="9.5" fill="rgba(96,165,250,0.90)" fontFamily="Inter,sans-serif" fontWeight="500">{tr('Tâhâ 30','Ta-Ha 30')}</text>
              </g>
              <text x="575" y="146" textAnchor="middle" fontSize="12" fill="rgba(96,165,250,0.72)" fontFamily="Inter,sans-serif" fontStyle="italic">{tr('kardeşler','brothers')}</text>

              {/* Chip: Sâd 30  left of Dâvûd→Süleymân vertical at x=840, midY=129 */}
              <g style={{ cursor: 'pointer' }} onClick={e => handleTreeRef(e, 'Sâd 30')}>
                <rect x="778" y="120" width="60" height="18" rx="6" fill="rgba(244,114,182,0.13)" stroke="rgba(244,114,182,0.42)" strokeWidth="0.9"/>
                <text x="808" y="133" textAnchor="middle" fontSize="9.5" fill="rgba(244,114,182,0.92)" fontFamily="Inter,sans-serif" fontWeight="500">{tr('Sâd 30','Sad 30')}</text>
              </g>

              {/* Chip: Meryem 7  left of Zekeriyyâ→Yahyâ vertical at x=1075, midY=129 */}
              <g style={{ cursor: 'pointer' }} onClick={e => handleTreeRef(e, 'Meryem 7')}>
                <rect x="1007" y="120" width="68" height="18" rx="6" fill="rgba(192,132,252,0.13)" stroke="rgba(192,132,252,0.42)" strokeWidth="0.9"/>
                <text x="1041" y="133" textAnchor="middle" fontSize="9.5" fill="rgba(192,132,252,0.90)" fontFamily="Inter,sans-serif" fontWeight="500">{tr('Meryem 7','Maryam 7')}</text>
              </g>

              {/* ══════ NODES — all equal glow, same stroke weight per era ══════ */}

              {/* ── Era 1: İbrahim silsilesi (gold) ──
                  Ibrahim: R1 cx=200 x=118..282
                  Ismail:  R2 cx=100 x=20..180  (diag left from Ibrahim)
                  Ishak:   R2 cx=310 x=230..390  (diag right from Ibrahim)
                  Yakub:   R3 cx=310 x=230..390
                  Yusuf:   R4 cx=310 x=230..390  (emerald)                    */}
              <g filter="url(#glow)">
                <rect x="118" y="52" width="164" height="44" rx="10" fill="url(#gAm)" stroke="rgba(251,191,36,0.85)" strokeWidth="1.7"/>
                <text x="200" y="79" textAnchor="middle" fill="#FBBF24" fontSize="13" fontWeight="700" fontFamily="Inter,sans-serif">{tr('Hz. İbrahim','Abraham')}</text>
              </g>
              <g filter="url(#glow)">
                <rect x="20" y="162" width="160" height="44" rx="10" fill="url(#gAm)" stroke="rgba(251,191,36,0.80)" strokeWidth="1.7"/>
                <text x="100" y="189" textAnchor="middle" fill="#FBBF24" fontSize="13" fontWeight="600" fontFamily="Inter,sans-serif">{tr('Hz. İsmâil','Ishmael')}</text>
              </g>
              <g filter="url(#glow)">
                <rect x="230" y="162" width="160" height="44" rx="10" fill="url(#gAm)" stroke="rgba(251,191,36,0.80)" strokeWidth="1.7"/>
                <text x="310" y="189" textAnchor="middle" fill="#FBBF24" fontSize="13" fontWeight="600" fontFamily="Inter,sans-serif">{tr('Hz. İshâk','Isaac')}</text>
              </g>
              <g filter="url(#glow)">
                <rect x="230" y="278" width="160" height="44" rx="10" fill="url(#gAm)" stroke="rgba(251,191,36,0.78)" strokeWidth="1.7"/>
                <text x="310" y="305" textAnchor="middle" fill="#FBBF24" fontSize="13" fontWeight="600" fontFamily="Inter,sans-serif">{tr('Hz. Yakûb','Jacob')}</text>
              </g>
              <g filter="url(#glow)">
                <rect x="230" y="388" width="160" height="44" rx="10" fill="url(#gAm)" stroke="rgba(251,191,36,0.78)" strokeWidth="1.7"/>
                <text x="310" y="415" textAnchor="middle" fill="#FBBF24" fontSize="13" fontWeight="700" fontFamily="Inter,sans-serif">{tr('Hz. Yûsuf','Joseph')}</text>
              </g>

              {/* ── Era 2: Mûsâ + Hârûn (blue) — brothers, same row R1
                  Musa: cx=500 x=434..566   Harun: cx=650 x=584..716
                  Era sep x=740  →  716 < 740  gap 24px ✓                    */}
              <g filter="url(#glow)">
                <rect x="434" y="52" width="132" height="44" rx="10" fill="url(#gBl)" stroke="rgba(96,165,250,0.85)" strokeWidth="1.7"/>
                <text x="500" y="79" textAnchor="middle" fill="#60A5FA" fontSize="13" fontWeight="700" fontFamily="Inter,sans-serif">{tr('Hz. Mûsâ','Moses')}</text>
              </g>
              <g filter="url(#glow)">
                <rect x="584" y="52" width="132" height="44" rx="10" fill="url(#gBl)" stroke="rgba(96,165,250,0.80)" strokeWidth="1.7"/>
                <text x="650" y="79" textAnchor="middle" fill="#60A5FA" fontSize="13" fontWeight="600" fontFamily="Inter,sans-serif">{tr('Hz. Hârûn','Aaron')}</text>
              </g>

              {/* ── Era 3: Dâvûd → Süleymân (rose)
                  cx=840  x=760..920   Era sep x=740  →  760 > 740  gap 20px ✓ */}
              <g filter="url(#glow)">
                <rect x="760" y="52" width="160" height="44" rx="10" fill="url(#gOr)" stroke="rgba(244,114,182,0.85)" strokeWidth="1.7"/>
                <text x="840" y="79" textAnchor="middle" fill="#F472B6" fontSize="13" fontWeight="700" fontFamily="Inter,sans-serif">{tr('Hz. Dâvûd','David')}</text>
              </g>
              <g filter="url(#glow)">
                <rect x="760" y="162" width="160" height="44" rx="10" fill="url(#gOr)" stroke="rgba(244,114,182,0.80)" strokeWidth="1.7"/>
                <text x="840" y="189" textAnchor="middle" fill="#F472B6" fontSize="13" fontWeight="600" fontFamily="Inter,sans-serif">{tr('Hz. Süleymân','Solomon')}</text>
              </g>

              {/* ── Era 4: Zekeriyyâ → Yahyâ (lavender)
                  Zekeriyya: cx=1075 x=989..1161   Era sep x=945  →  989 > 945  gap 44px ✓
                  Yahya: cx=1075 x=1008..1142                                  */}
              <g filter="url(#glow)">
                <rect x="989" y="52" width="172" height="44" rx="10" fill="url(#gLa)" stroke="rgba(192,132,252,0.85)" strokeWidth="1.7"/>
                <text x="1075" y="79" textAnchor="middle" fill="#C084FC" fontSize="13" fontWeight="700" fontFamily="Inter,sans-serif">{tr('Hz. Zekeriyyâ','Zechariah')}</text>
              </g>
              <g filter="url(#glow)">
                <rect x="1008" y="162" width="134" height="44" rx="10" fill="url(#gLa)" stroke="rgba(192,132,252,0.80)" strokeWidth="1.7"/>
                <text x="1075" y="189" textAnchor="middle" fill="#C084FC" fontSize="13" fontWeight="600" fontFamily="Inter,sans-serif">{tr('Hz. Yahyâ','John')}</text>
              </g>
            </svg>
          </div>

          {/* Legend */}
          <div style={{
            display: 'flex', justifyContent: 'center', gap: '24px',
            marginTop: '16px', flexWrap: 'wrap',
          }}>
            {[
              { label: tr('baba → oğul', 'father → son'), color: 'rgba(212,165,116,0.7)', dashed: false },
              { label: tr('kardeşler', 'brothers'), color: 'rgba(148,163,184,0.6)', dashed: true },
            ].map(({ label, color, dashed }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="28" height="10">
                  <line x1="0" y1="5" x2="28" y2="5"
                    stroke={color} strokeWidth="1.5"
                    strokeDasharray={dashed ? '4,3' : undefined}/>
                </svg>
                <span style={{ fontSize: '0.72rem', color: 'rgba(148,163,184,0.7)', fontFamily: 'Inter, sans-serif' }}>
                  {label}
                </span>
              </div>
            ))}
            <span style={{ fontSize: '0.72rem', color: 'rgba(148,163,184,0.45)', fontFamily: 'Inter, sans-serif', fontStyle: 'italic' }}>
              {tr("Yalnızca Kur'an'da açıkça geçen bağlar", "Only Quranically confirmed connections")}
            </span>
            <span style={{ fontSize: '0.72rem', color: 'rgba(148,163,184,0.45)', fontFamily: 'Inter, sans-serif', fontStyle: 'italic' }}>
              {tr('· Ayet referanslarına dokunun', '· Tap verse references')}
            </span>
          </div>

          {/* ── Prophet detail modal — position:fixed, ekran ortasında ── */}
          {expandedRef && (() => {
            const p = PROPHETS_REF.find(x => x.id === expandedRef);
            if (!p) return null;
            const isMekkiSurah = (s) => RANK_BY_SURAH[s] <= 86;
            return (
              <>
                {/* Backdrop */}
                <div
                  onClick={() => setExpandedRef(null)}
                  style={{
                    position: 'fixed', inset: 0, zIndex: 300,
                    background: 'rgba(4,5,16,0.75)',
                    backdropFilter: 'blur(6px)',
                  }}
                />
                {/* Modal */}
                <div style={{
                  position: 'fixed',
                  top: '50%', left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 301,
                  width: 'min(1020px, 96vw)',
                  maxHeight: '82vh',
                  overflowY: 'auto',
                  background: 'rgba(8,10,28,0.97)',
                  border: '1px solid rgba(212,165,116,0.28)',
                  borderRadius: '18px',
                  padding: '32px 36px 28px',
                  boxShadow: '0 24px 80px rgba(0,0,0,0.7), 0 0 40px rgba(212,165,116,0.07)',
                }}>
                  {/* Header row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                    <div>
                      <div style={{
                        fontSize: '1.5rem', fontWeight: 700,
                        color: '#d4a574', fontFamily: 'Inter, sans-serif', marginBottom: '4px',
                      }}>
                        {tr(p.nameTr, p.nameEn)}
                      </div>
                      <div style={{
                        fontSize: '0.75rem', color: 'rgba(148,163,184,0.50)',
                        fontFamily: 'Inter, sans-serif',
                      }}>
                        {tr(`Kur'an'da ismi ${p.mentions} kez geçiyor`, `Named ${p.mentions} times in the Quran`)}
                      </div>
                      {(p.noteTr || p.noteEn) && (
                        <div style={{
                          marginTop: '8px',
                          fontSize: '0.78rem', fontStyle: 'italic',
                          color: 'rgba(212,165,116,0.6)',
                          fontFamily: 'Inter, sans-serif',
                        }}>
                          {tr(p.noteTr, p.noteEn)}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => setExpandedRef(null)}
                      style={{
                        background: 'none', border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px', cursor: 'pointer',
                        color: 'rgba(148,163,184,0.55)', fontSize: '0.85rem',
                        padding: '5px 10px', fontFamily: 'Inter, sans-serif',
                        flexShrink: 0, marginLeft: '16px',
                      }}
                    >✕</button>
                  </div>

                  {/* Surah pills + inline legend */}
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '8px' }}>
                      {p.surahs.map(s => {
                        const isMekki = isMekkiSurah(s);
                        const name = SURAH_NAMES[s];
                        return (
                          <span key={s} style={{
                            fontSize: '0.67rem', fontFamily: 'Inter, sans-serif',
                            color: isMekki ? 'rgba(212,165,116,0.88)' : 'rgba(52,211,153,0.88)',
                            background: isMekki ? 'rgba(212,165,116,0.10)' : 'rgba(52,211,153,0.10)',
                            border: `1px solid ${isMekki ? 'rgba(212,165,116,0.25)' : 'rgba(52,211,153,0.25)'}`,
                            borderRadius: '5px', padding: '2px 8px', fontWeight: 500,
                          }}>
                            {name ? (language === 'tr' ? name.tr : name.en) : s}
                          </span>
                        );
                      })}
                    </div>
                    <div style={{ display: 'flex', gap: '14px' }}>
                      <span style={{ fontSize: '0.6rem', fontFamily: 'Inter, sans-serif', color: 'rgba(212,165,116,0.45)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%', background: 'rgba(212,165,116,0.45)' }} />
                        {tr('Mekkî sure', 'Meccan surah')}
                      </span>
                      <span style={{ fontSize: '0.6rem', fontFamily: 'Inter, sans-serif', color: 'rgba(52,211,153,0.45)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%', background: 'rgba(52,211,153,0.45)' }} />
                        {tr('Medenî sure', 'Medinan surah')}
                      </span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', marginBottom: '24px' }} />

                  {/* Two-column: attributes + dua */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: p.duaAr ? '3fr 2fr' : '1fr',
                    gap: '32px',
                    alignItems: 'center',
                  }}>
                    {/* Attributes */}
                    <div>
                      <div style={{
                        fontSize: '0.65rem', fontWeight: 700,
                        color: 'rgba(212,165,116,0.55)',
                        letterSpacing: '0.12em', textTransform: 'uppercase',
                        fontFamily: 'Inter, sans-serif', marginBottom: '12px',
                      }}>
                        {tr("Kur'an'dan Vasıflar", 'Attributes from Quran')}
                      </div>
                      <div style={{
                        display: 'flex', flexDirection: 'column', gap: '2px',
                        maxHeight: '320px', overflowY: 'auto',
                        paddingRight: '4px',
                        scrollbarWidth: 'thin',
                        scrollbarColor: 'rgba(212,165,116,0.25) transparent',
                      }}>
                        {(language === 'tr' ? p.giftsTr : p.giftsEn).map((g, i) => {
                          const tooltips = language === 'tr' ? p.giftsTooltipsTr : p.giftsTooltipsEn;
                          const note = tooltips?.[i];
                          return (
                            <div key={i} style={{
                              fontSize: '0.85rem', color: 'rgba(232,230,227,0.85)',
                              lineHeight: 1.75, fontFamily: 'Inter, sans-serif',
                              padding: '7px 12px 7px 14px',
                              borderLeft: '2px solid rgba(212,165,116,0.35)',
                              background: i % 2 === 0
                                ? 'rgba(212,165,116,0.04)'
                                : 'transparent',
                              borderRadius: '0 6px 6px 0',
                            }}>
                              {renderGiftText(g, language, handleGiftRefClick)}
                              {note && (
                                <span title={note} style={{
                                  marginLeft: '5px', cursor: 'help',
                                  fontSize: '0.72rem', color: 'rgba(212,165,116,0.45)',
                                  borderBottom: '1px dotted rgba(212,165,116,0.3)',
                                  verticalAlign: 'middle',
                                }}>ⓘ</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Dua */}
                    {p.duaAr && (
                      <div style={{
                        background: 'rgba(212,165,116,0.05)',
                        border: '1px solid rgba(212,165,116,0.14)',
                        borderRadius: '12px',
                        padding: '14px 18px 16px',
                      }}>
                        <div style={{
                          fontSize: '0.65rem', fontWeight: 700,
                          color: 'rgba(212,165,116,0.55)',
                          letterSpacing: '0.12em', textTransform: 'uppercase',
                          fontFamily: 'Inter, sans-serif', marginBottom: '10px',
                        }}>
                          {language === 'tr' ? (p.duaLabelTr || 'Duası') : (p.duaLabelEn || 'Prayer')}
                        </div>
                        <div
                          dir="rtl"
                          dangerouslySetInnerHTML={{
                            __html: cleanDuaAr(getDuaApiAr(p.duaRef, duaApiAr) || p.duaAr || '')
                          }}
                          style={{
                            direction: 'rtl', textAlign: 'right',
                            fontFamily: "'KFGQPC', 'Amiri Quran', serif",
                            fontFeatureSettings: '"calt" 1, "liga" 1',
                            fontSize: '1.5rem', lineHeight: 2.0,
                            color: '#d4a574', marginBottom: '10px',
                          }}
                        />
                        <div style={{
                          fontSize: '0.83rem', color: 'rgba(148,163,184,0.75)',
                          lineHeight: 1.7, fontFamily: 'Inter, sans-serif',
                          fontStyle: 'italic', marginBottom: '8px',
                          borderTop: '1px solid rgba(212,165,116,0.10)',
                          paddingTop: '10px',
                        }}>
                          {language === 'tr' ? p.duaTr : p.duaEn}
                        </div>
                        <div style={{
                          fontSize: '0.72rem', color: 'rgba(212,165,116,0.45)',
                          fontFamily: 'Inter, sans-serif', textAlign: 'right',
                        }}>
                          {fmtDuaRef(p.duaRef, language)}
                          {(language === 'tr' ? p.duaNoteTr : p.duaNoteEn) && (
                            <span style={{ display: 'block', marginTop: '3px', fontStyle: 'italic' }}>
                              {language === 'tr' ? p.duaNoteTr : p.duaNoteEn}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            );
          })()}

          {/* Vasıf ayet popup — position:fixed, modal'ın üzerinde (zIndex 400) */}
          {giftPopup && GIFT_VERSE_REFS[giftPopup.key] && (() => {
            const d = GIFT_VERSE_REFS[giftPopup.key];
            const left = Math.max(8, Math.min(giftPopup.x - 140, (typeof window !== 'undefined' ? window.innerWidth : 800) - 296));
            const showAbove = giftPopup.y > (typeof window !== 'undefined' ? window.innerHeight * 0.62 : 400);
            const top = showAbove ? giftPopup.y - 210 : giftPopup.y + 14;
            return (
              <div
                onClick={e => e.stopPropagation()}
                style={{
                  position: 'fixed', left, top, zIndex: 400, width: '280px',
                  background: 'rgba(6,8,24,0.97)',
                  backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
                  border: '1px solid rgba(212,165,116,0.28)',
                  borderRadius: '14px', padding: '14px 16px 12px',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.7), 0 0 24px rgba(212,165,116,0.07)',
                  pointerEvents: 'auto',
                }}
              >
                <div style={{
                  fontFamily: "'KFGQPC', 'Amiri Quran', serif",
                  fontFeatureSettings: '"calt" 1, "liga" 1',
                  direction: 'rtl', textAlign: 'right',
                  fontSize: '1.05rem', lineHeight: 1.95,
                  color: '#d4a574', marginBottom: '10px',
                }}>
                  {d.ar}
                </div>
                <div style={{
                  fontFamily: 'Inter, sans-serif', fontSize: '0.76rem', lineHeight: 1.65,
                  color: 'rgba(232,230,227,0.82)',
                  borderTop: '1px solid rgba(212,165,116,0.12)', paddingTop: '8px',
                }}>
                  {language === 'tr' ? d.tr : d.en}
                </div>
                <div style={{
                  fontFamily: 'Inter, sans-serif', fontSize: '0.68rem',
                  color: 'rgba(212,165,116,0.55)', marginTop: '7px', textAlign: 'right',
                }}>
                  {fmtPopupRef(d.ref)}
                </div>
              </div>
            );
          })()}

          {/* Ayet tooltip — position:fixed viewport koordinatlarıyla */}
          {treePopup && TREE_REFS[treePopup.key] && (() => {
            const d = TREE_REFS[treePopup.key];
            const left = Math.max(8, Math.min(treePopup.x - 130, (typeof window !== 'undefined' ? window.innerWidth : 800) - 276));
            const showAbove = treePopup.y > (typeof window !== 'undefined' ? window.innerHeight * 0.62 : 400);
            const top = showAbove ? treePopup.y - 190 : treePopup.y + 14;
            return (
              <div
                style={{
                  position: 'fixed', left, top, zIndex: 200, width: '260px',
                  background: 'rgba(6,8,24,0.97)',
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)',
                  border: '1px solid rgba(212,165,116,0.28)',
                  borderRadius: '14px',
                  padding: '14px 16px 12px',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.7), 0 0 24px rgba(212,165,116,0.07)',
                  pointerEvents: 'auto',
                }}
                onClick={e => e.stopPropagation()}
              >
                {/* Arapça metin */}
                <div style={{
                  fontFamily: "'KFGQPC', 'Amiri Quran', serif",
                  fontFeatureSettings: '"calt" 1, "liga" 1',
                  direction: 'rtl', textAlign: 'right',
                  fontSize: '1.05rem', lineHeight: 1.95,
                  color: '#d4a574', marginBottom: '10px',
                }}>
                  {d.ar}
                </div>
                {/* Meal */}
                <div style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.76rem', lineHeight: 1.65,
                  color: 'rgba(232,230,227,0.82)',
                  borderTop: '1px solid rgba(212,165,116,0.12)',
                  paddingTop: '8px',
                }}>
                  {language === 'tr' ? d.tr : d.en}
                </div>
                {/* Referans etiketi */}
                <div style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.68rem', color: 'rgba(212,165,116,0.55)',
                  marginTop: '7px', textAlign: 'right',
                }}>
                  {fmtPopupRef(d.ref)}
                </div>
              </div>
            );
          })()}
          </div>{/* position:relative wrapper sonu */}
        </div>


      </div>

      <style>{`
        @keyframes arcDraw {
          from { stroke-dashoffset: 2000; opacity: 0; }
          to   { stroke-dashoffset: 0;    opacity: 1; }
        }
        @keyframes nodeAppear {
          from { opacity: 0; transform: scale(0); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </section>
  );
}
