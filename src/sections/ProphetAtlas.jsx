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
  '21:69': { ref: 'Enbiyâ 21:69', ar: 'قُلْنَا يَا نَارُ كُونِي بَرْدًا وَسَلَامًا عَلَىٰ إِبْرَاهِيمَ', tr: 'Dedik ki: Ey ateş! İbrahim\'e karşı serin ve selamet ol!', en: 'We said: O fire, be coolness and safety upon Abraham.' },
  '11:71': { ref: 'Hûd 11:71', ar: 'وَامْرَأَتُهُ قَائِمَةٌ فَضَحِكَتْ فَبَشَّرْنَاهَا بِإِسْحَاقَ وَمِن وَرَاءِ إِسْحَاقَ يَعْقُوبَ', tr: 'Hanımı ayaktaydı, güldü. Onu İshak ile, İshak\'ın ardından da Yakûb ile müjdeledik.', en: 'And his wife was standing and she smiled. Then We gave her good tidings of Isaac and after Isaac, of Jacob.' },
  // ── Hz. Lût ────────────────────────────────────────────────────────
  '21:74': { ref: 'Enbiyâ 21:74', ar: 'وَلُوطًا آتَيْنَاهُ حُكْمًا وَعِلْمًا', tr: 'Lût\'a da hüküm ve ilim verdik.', en: 'And Lot — We gave him judgement and knowledge.' },
  '15:66': { ref: 'Hicr 15:66', ar: 'وَقَضَيْنَا إِلَيْهِ ذَٰلِكَ الْأَمْرَ أَنَّ دَابِرَ هَٰؤُلَاءِ مَقْطُوعٌ مُّصْبِحِينَ', tr: 'Şunu da ona kesin olarak bildirdik: Sabaha karşı onların kökü kazınacaktır.', en: 'And We conveyed to him the decree that the roots of those people would be cut off when morning came.' },
  '11:81': { ref: 'Hûd 11:81', ar: 'قَالُوا يَا لُوطُ إِنَّا رُسُلُ رَبِّكَ لَن يَصِلُوا إِلَيْكَ', tr: 'Dediler: Ey Lût! Biz Rabbinin elçileriyiz; sana ulaşamayacaklar.', en: 'They said: O Lot, indeed we are messengers of your Lord; they will never reach you.' },
  // ── Hz. İsmâil ─────────────────────────────────────────────────────
  '19:54': { ref: 'Meryem 19:54', ar: 'وَاذْكُرْ فِي الْكِتَابِ إِسْمَاعِيلَ ۚ إِنَّهُ كَانَ صَادِقَ الْوَعْدِ وَكَانَ رَسُولًا نَّبِيًّا', tr: 'Kitapta İsmail\'i de zikret. O vaadine sadık, bir resul ve nebiydi.', en: 'And mention in the Book Ishmael. Indeed, he was true to his promise and was a messenger and prophet.' },
  '19:55': { ref: 'Meryem 19:55', ar: 'وَكَانَ يَأْمُرُ أَهْلَهُ بِالصَّلَاةِ وَالزَّكَاةِ وَكَانَ عِندَ رَبِّهِ مَرْضِيًّا', tr: 'Ailesine namazı ve zekâtı emrederdi; Rabbi katında razı olunan biriydi.', en: 'And he used to enjoin on his family prayer and zakah and was well-pleasing to his Lord.' },
  '37:107': { ref: 'Sâffât 37:107', ar: 'وَفَدَيْنَاهُ بِذِبْحٍ عَظِيمٍ', tr: 'Onu büyük bir kurbanla fidye verdik.', en: 'And We ransomed him with a great sacrifice.' },
  // ── Hz. İshâk ──────────────────────────────────────────────────────
  '21:72': { ref: 'Enbiyâ 21:72', ar: 'وَوَهَبْنَا لَهُ إِسْحَاقَ وَيَعْقُوبَ نَافِلَةً ۖ وَكُلًّا جَعَلْنَا صَالِحِينَ', tr: 'Ona İshak\'ı, üstelik Yakûb\'u da hediye ettik; hepsini salih kıldık.', en: 'And We gave him Isaac and Jacob as a gift, and each of them We made righteous.' },
  '29:27': { ref: 'Ankebût 29:27', ar: 'وَوَهَبْنَا لَهُ إِسْحَاقَ وَيَعْقُوبَ وَجَعَلْنَا فِي ذُرِّيَّتِهِ النُّبُوَّةَ وَالْكِتَابَ', tr: 'Ona İshak ve Yakûb\'u bağışladık; nübüvveti ve kitabı onun soyuna koyduk.', en: 'And We gave him Isaac and Jacob and placed in his descendants prophethood and scripture.' },
  // ── Hz. Yakûb ──────────────────────────────────────────────────────
  '12:18': { ref: 'Yûsuf 12:18', ar: 'فَصَبْرٌ جَمِيلٌ ۖ وَاللَّهُ الْمُسْتَعَانُ عَلَىٰ مَا تَصِفُونَ', tr: 'Güzel bir sabır gerek. Anlattıklarınıza karşı yardım yalnızca Allah\'tandır.', en: 'So patience is most fitting. And Allah is the one sought for help against what you describe.' },
  '12:68': { ref: 'Yûsuf 12:68', ar: 'وَإِنَّهُ لَذُو عِلْمٍ لِّمَا عَلَّمْنَاهُ وَلَٰكِنَّ أَكْثَرَ النَّاسِ لَا يَعْلَمُونَ', tr: 'O, öğrettiğimizden ötürü gerçekten ilim sahibiydi; ama insanların çoğu bilmez.', en: 'Indeed, he was a possessor of knowledge because of what We had taught him, but most people do not know.' },
  '12:96': { ref: 'Yûsuf 12:96', ar: 'فَلَمَّا أَن جَاءَ الْبَشِيرُ أَلْقَاهُ عَلَىٰ وَجْهِهِ فَارْتَدَّ بَصِيرًا', tr: 'Müjdeci gelince gömleği onun yüzüne koydu; gözleri açılıverdi.', en: 'And when the bearer of good tidings arrived, he cast it over his face, and he returned once again able to see.' },
  // ── Hz. Yûsuf ──────────────────────────────────────────────────────
  '12:6': { ref: 'Yûsuf 12:6', ar: 'وَكَذَٰلِكَ يَجْتَبِيكَ رَبُّكَ وَيُعَلِّمُكَ مِن تَأْوِيلِ الْأَحَادِيثِ', tr: 'Rabbin seni böylece seçecek ve sana rüya tabirini öğretecektir.', en: 'And thus will your Lord choose you and teach you the interpretation of narratives.' },
  '12:22': { ref: 'Yûsuf 12:22', ar: 'وَلَمَّا بَلَغَ أَشُدَّهُ آتَيْنَاهُ حُكْمًا وَعِلْمًا ۚ وَكَذَٰلِكَ نَجْزِي الْمُحْسِنِينَ', tr: 'Gençlik çağına ulaşınca ona hüküm ve ilim verdik. İyilik edenleri böyle mükâfatlandırırız.', en: 'And when he reached maturity, We gave him judgement and knowledge. And thus We reward the doers of good.' },
  '12:55': { ref: 'Yûsuf 12:55', ar: 'قَالَ اجْعَلْنِي عَلَىٰ خَزَائِنِ الْأَرْضِ ۖ إِنِّي حَفِيظٌ عَلِيمٌ', tr: 'Dedi: Beni ülkenin hazinelerine vekil et; ben iyi koruyan ve iyi bilenem.', en: 'He said: Appoint me over the storehouses of the land. Indeed, I am a knowing guardian.' },
  // ── Hz. Şuayb ──────────────────────────────────────────────────────
  '7:85': { ref: 'A\'râf 7:85', ar: 'وَإِلَىٰ مَدْيَنَ أَخَاهُمْ شُعَيْبًا ۗ قَالَ يَا قَوْمِ اعْبُدُوا اللَّهَ مَا لَكُم مِّنْ إِلَٰهٍ غَيْرُهُ ۖ فَأَوْفُوا الْكَيْلَ وَالْمِيزَانَ', tr: 'Medyen halkına da kardeşleri Şuayb\'ı gönderdik. Dedi: Ey kavmim! Allah\'a kulluk edin; ölçüyü ve tartıyı tam yapın.', en: 'And to Madyan — their brother Shu\'ayb. He said: O my people, worship Allah; fulfill the measure and weight.' },
  '11:94': { ref: 'Hûd 11:94', ar: 'وَلَمَّا جَاءَ أَمْرُنَا نَجَّيْنَا شُعَيْبًا وَالَّذِينَ آمَنُوا مَعَهُ بِرَحْمَةٍ مِّنَّا', tr: 'Emrimiz gelince Şuayb\'ı ve onunla iman edenleri rahmetimizle kurtardık.', en: 'And when Our command came, We saved Shu\'ayb and those who believed with him, by mercy from Us.' },
  // ── Hz. Eyyûb ──────────────────────────────────────────────────────
  '21:83': { ref: 'Enbiyâ 21:83', ar: 'وَأَيُّوبَ إِذْ نَادَىٰ رَبَّهُ أَنِّي مَسَّنِيَ الضُّرُّ وَأَنتَ أَرْحَمُ الرَّاحِمِينَ', tr: 'Eyyûb\'u da hatırla; Rabbine: "Bana dert dokundu, sen merhametlilerin en merhametlisisin" diye yalvarmıştı.', en: 'And mention Job, when he called to his Lord: Indeed adversity has touched me, and You are the Most Merciful of the merciful.' },
  '21:84': { ref: 'Enbiyâ 21:84', ar: 'فَاسْتَجَبْنَا لَهُ فَكَشَفْنَا مَا بِهِ مِن ضُرٍّ ۖ وَآتَيْنَاهُ أَهْلَهُ وَمِثْلَهُم مَّعَهُمْ رَحْمَةً مِّنْ عِندِنَا', tr: 'Duasını kabul ettik, derdini giderdik, ona ailesini ve bir o kadarını daha verdik.', en: 'So We responded to him and removed what afflicted him of adversity. And We gave back his family and the like thereof with them.' },
  '38:43': { ref: 'Sâd 38:43', ar: 'وَوَهَبْنَا لَهُ أَهْلَهُ وَمِثْلَهُم مَّعَهُمْ رَحْمَةً مِّنَّا وَذِكْرَىٰ لِأُولِي الْأَلْبَابِ', tr: 'Katımızdan bir rahmet olarak ailesini ve bir o kadarını daha bağışladık; akıl sahiplerine bir öğüttür bu.', en: 'And We gave back his family and doubled their number as mercy from Us and a reminder for those of understanding.' },
  // ── Hz. Mûsâ ───────────────────────────────────────────────────────
  '4:164': { ref: 'Nisâ 4:164', ar: 'وَكَلَّمَ اللَّهُ مُوسَىٰ تَكْلِيمًا', tr: 'Allah, Musa ile bizzat konuştu.', en: 'And to Moses, Allah spoke directly.' },
  '7:107': { ref: 'A\'râf 7:107–108', ar: 'فَأَلْقَىٰ عَصَاهُ فَإِذَا هِيَ ثُعْبَانٌ مُّبِينٌ ۝ وَنَزَعَ يَدَهُ فَإِذَا هِيَ بَيْضَاءُ لِلنَّاظِرِينَ', tr: 'Asasını fırlattı; hemen apaçık bir ejderha oldu. Elini çıkardı; bakanlara bembeyaz göründü.', en: 'He threw his staff and it became a manifest serpent. And he drew out his hand; it appeared white to the observers.' },
  '2:87': { ref: 'Bakara 2:87', ar: 'وَلَقَدْ آتَيْنَا مُوسَى الْكِتَابَ وَقَفَّيْنَا مِن بَعْدِهِ بِالرُّسُلِ', tr: 'Andolsun, Mûsâ\'ya Kitab\'ı verdik ve ardından peygamberler gönderdik.', en: 'And We certainly gave Moses the Scripture and followed up after him with messengers.' },
  // ── Hz. Hârûn ──────────────────────────────────────────────────────
  '20:29': { ref: 'Tâhâ 20:29–32', ar: 'وَاجْعَل لِّي وَزِيرًا مِّنْ أَهْلِي ۝ هَارُونَ أَخِي ۝ اشْدُدْ بِهِ أَزْرِي ۝ وَأَشْرِكْهُ فِي أَمْرِي', tr: 'Ailemden bana bir yardımcı ver: Kardeşim Hârûn\'u. Onunla sırtımı güçlendir, onu işime ortak et.', en: 'Appoint for me a minister from my family: Aaron, my brother. Strengthen me with him and make him associate in my task.' },
  '19:53': { ref: 'Meryem 19:53', ar: 'وَوَهَبْنَا لَهُ مِن رَّحْمَتِنَا أَخَاهُ هَارُونَ نَبِيًّا', tr: 'Rahmetimizden ona, kardeşi Hârûn\'u peygamber olarak bağışladık.', en: 'And We gave him out of Our mercy his brother Aaron as a prophet.' },
  '28:34': { ref: 'Kasas 28:34', ar: 'وَأَخِي هَارُونُ هُوَ أَفْصَحُ مِنِّي لِسَانًا فَأَرْسِلْهُ مَعِيَ رِدْءًا يُصَدِّقُنِي', tr: 'Kardeşim Hârûn dil bakımından benden daha fasih; beni doğrulaması için onu da benimle gönder.', en: 'And my brother Aaron is more eloquent than me in tongue, so send him with me as a helper to support me.' },
  // ── Hz. Yûnus ──────────────────────────────────────────────────────
  '21:87': { ref: 'Enbiyâ 21:87–88', ar: 'فَنَادَىٰ فِي الظُّلُمَاتِ أَن لَّا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ ۝ فَاسْتَجَبْنَا لَهُ وَنَجَّيْنَاهُ مِنَ الْغَمِّ', tr: 'Karanlıklar içinde: "Senden başka ilah yoktur, seni tenzih ederim; ben zalimlerden oldum" diye seslendi. Duasını kabul ettik ve onu sıkıntıdan kurtardık.', en: 'He called out within the darknesses: There is no deity except You; exalted are You. Indeed I have been of the wrongdoers. So We responded to him and saved him from distress.' },
  '10:98': { ref: 'Yûnus 10:98', ar: 'فَلَوْلَا كَانَتْ قَرْيَةٌ آمَنَتْ فَنَفَعَهَا إِيمَانُهَا إِلَّا قَوْمَ يُونُسَ لَمَّا آمَنُوا كَشَفْنَا عَنْهُمْ عَذَابَ الْخِزْيِ', tr: 'Yûnus kavmi dışında, iman edip de imanı kendisine fayda veren hiçbir şehir olmadı; onlar iman edince aşağılık azabı üzerlerinden kaldırıldı.', en: 'There has not been a city that believed and its faith benefited it except the people of Jonah — when they believed, We removed from them the punishment of disgrace.' },
  '37:145': { ref: 'Sâffât 37:145–146', ar: 'فَنَبَذْنَاهُ بِالْعَرَاءِ وَهُوَ سَقِيمٌ ۝ وَأَنبَتْنَا عَلَيْهِ شَجَرَةً مِّن يَقْطِينٍ', tr: 'Onu hasta halde açık araziye fırlattık; üzerine kabak cinsi bir ağaç bitirdik.', en: 'Then We threw him onto the open shore while he was ill. And We caused to grow over him a gourd vine.' },
  // ── Hz. İlyâs ──────────────────────────────────────────────────────
  '6:85': { ref: 'En\'âm 6:85', ar: 'وَزَكَرِيَّا وَيَحْيَىٰ وَعِيسَىٰ وَإِلْيَاسَ ۖ كُلٌّ مِّنَ الصَّالِحِينَ', tr: 'Zekeriyya, Yahya, İsa ve İlyas\'ı da — hepsi salihlerden.', en: 'And Zechariah and John and Jesus and Elias — and all were of the righteous.' },
  '37:123': { ref: 'Sâffât 37:123', ar: 'وَإِنَّ إِلْيَاسَ لَمِنَ الْمُرْسَلِينَ', tr: 'Şüphesiz İlyas, gönderilen peygamberlerdendir.', en: 'And indeed, Elias was of the messengers.' },
  '37:125': { ref: 'Sâffât 37:125', ar: 'أَتَدْعُونَ بَعْلًا وَتَذَرُونَ أَحْسَنَ الْخَالِقِينَ', tr: 'Yaratıcıların en güzelini bırakıp da Baal\'a mı tapıyorsunuz?', en: 'Do you call upon Baal and leave the best of creators?' },
  // ── Hz. Elyesâ ─────────────────────────────────────────────────────
  '6:86': { ref: 'En\'âm 6:86', ar: 'وَإِسْمَاعِيلَ وَالْيَسَعَ وَيُونُسَ وَلُوطًا ۚ وَكُلًّا فَضَّلْنَا عَلَى الْعَالَمِينَ', tr: 'İsmail, Elyesâ, Yûnus ve Lût\'u da; hepsini âlemlere üstün kıldık.', en: 'And Ishmael and Elisha and Jonah and Lot — and all of them We preferred over the worlds.' },
  // ── Hz. Zülkifl ────────────────────────────────────────────────────
  '38:48': { ref: 'Sâd 38:48', ar: 'وَاذْكُرْ إِسْمَاعِيلَ وَالْيَسَعَ وَذَا الْكِفْلِ ۖ وَكُلٌّ مِّنَ الْأَخْيَارِ', tr: 'İsmail\'i, Elyesâ\'yı ve Zülkifl\'i de zikret; hepsi hayırlılardandı.', en: 'And remember Ishmael and Elisha and Dhul-Kifl, and all are among the outstanding.' },
  // ── Hz. Dâvûd ──────────────────────────────────────────────────────
  '17:55': { ref: 'İsrâ 17:55', ar: 'وَلَقَدْ فَضَّلْنَا بَعْضَ النَّبِيِّينَ عَلَىٰ بَعْضٍ ۖ وَآتَيْنَا دَاوُودَ زَبُورًا', tr: 'Peygamberlerin bir kısmını diğerlerinden üstün kıldık; Dâvûd\'a Zebur\'u verdik.', en: 'And We have made some prophets exceed others, and to David We gave the Psalms.' },
  '34:10': { ref: 'Sebe 34:10', ar: 'وَلَقَدْ آتَيْنَا دَاوُودَ مِنَّا فَضْلًا ۖ يَا جِبَالُ أَوِّبِي مَعَهُ وَالطَّيْرَ ۖ وَأَلَنَّا لَهُ الْحَدِيدَ', tr: 'Andolsun, Dâvûd\'a katımızdan lütuf verdik: Ey dağlar, onunla tesbih edin, ey kuşlar! Demiri de onun için yumuşattık.', en: 'And We certainly gave David from Us bounty. O mountains, repeat with him, and the birds. And We softened iron for him.' },
  // ── Hz. Süleymân ───────────────────────────────────────────────────
  '27:16': { ref: 'Neml 27:16', ar: 'وَوَرِثَ سُلَيْمَانُ دَاوُودَ ۖ وَقَالَ يَا أَيُّهَا النَّاسُ عُلِّمْنَا مَنطِقَ الطَّيْرِ', tr: 'Süleymân, Dâvûd\'a vâris oldu ve dedi: Ey insanlar! Bize kuş dili öğretildi.', en: 'And Solomon inherited David. He said: O people, we have been taught the language of birds.' },
  '27:17': { ref: 'Neml 27:17', ar: 'وَحُشِرَ لِسُلَيْمَانَ جُنُودُهُ مِنَ الْجِنِّ وَالْإِنسِ وَالطَّيْرِ فَهُمْ يُوزَعُونَ', tr: 'Süleymân\'ın cin, insan ve kuş ordularından oluşan birlikleri toplandı, sıra halinde yürütüldüler.', en: 'And gathered for Solomon were his soldiers of jinn, men and birds, and they were marching in rows.' },
  '34:12': { ref: 'Sebe 34:12', ar: 'وَلِسُلَيْمَانَ الرِّيحَ غُدُوُّهَا شَهْرٌ وَرَوَاحُهَا شَهْرٌ ۖ وَأَسَلْنَا لَهُ عَيْنَ الْقِطْرِ', tr: 'Süleymân\'a da rüzgarı verdik: sabah esişi bir aylık, akşam esişi bir aylık yoldu. Erimiş bakır kaynağını da onun için akıttık.', en: 'And to Solomon We subjected the wind: its morning was a month\'s journey and its evening a month\'s journey, and We caused a spring of molten copper to flow for him.' },
  // ── Hz. Zekeriyyâ ──────────────────────────────────────────────────
  '3:40': { ref: 'Âl-i İmrân 3:40', ar: 'قَالَ رَبِّ أَنَّىٰ يَكُونُ لِي غُلَامٌ وَقَدْ بَلَغَنِيَ الْكِبَرُ وَامْرَأَتِي عَاقِرٌ ۖ قَالَ كَذَٰلِكَ اللَّهُ يَفْعَلُ مَا يَشَاءُ', tr: 'Dedi: Rabbim! İhtiyarlık beni sardı, karım kısır; benim nasıl oğlum olabilir? Cevap: Allah dilediğini böyle yapar.', en: 'He said: My Lord, how will there be for me a boy when old age has overtaken me and my wife is barren? He said: Such is Allah; He does what He wills.' },
  '19:3': { ref: 'Meryem 19:3–4', ar: 'إِذْ نَادَىٰ رَبَّهُ نِدَاءً خَفِيًّا ۝ قَالَ رَبِّ إِنِّي وَهَنَ الْعَظْمُ مِنِّي وَاشْتَعَلَ الرَّأْسُ شَيْبًا', tr: 'Rabbine sessizce yalvardığı zaman, dedi: Rabbim! Kemiklerim zayıfladı, başım ağarmakla tutuştu.', en: 'When he called to his Lord with a private supplication, saying: My Lord, my bones have weakened and my head has filled with white.' },
  // ── Hz. Yahyâ ──────────────────────────────────────────────────────
  '19:12': { ref: 'Meryem 19:12', ar: 'يَا يَحْيَىٰ خُذِ الْكِتَابَ بِقُوَّةٍ ۖ وَآتَيْنَاهُ الْحُكْمَ صَبِيًّا', tr: 'Ey Yahya! Kitaba kuvvetle sarıl. Ona daha çocukken hüküm verdik.', en: 'O John, take the Scripture with determination. And We gave him judgement as a child.' },
  '19:13': { ref: 'Meryem 19:13', ar: 'وَحَنَانًا مِّن لَّدُنَّا وَزَكَاةً ۖ وَكَانَ تَقِيًّا', tr: 'Katımızdan kalp yumuşaklığı ve temizlik verdik. O, çok takvalı biriydi.', en: 'And affection from Us and purity, and he was fearing of Allah.' },
  '19:15': { ref: 'Meryem 19:15', ar: 'وَسَلَامٌ عَلَيْهِ يَوْمَ وُلِدَ وَيَوْمَ يَمُوتُ وَيَوْمَ يُبْعَثُ حَيًّا', tr: 'Doğduğu gün, öleceği gün ve diri olarak dirileceği gün ona selam olsun.', en: 'And peace upon him the day he was born and the day he dies and the day he is raised alive.' },
  // ── Hz. İsa ────────────────────────────────────────────────────────
  '3:49': { ref: 'Âl-i İmrân 3:49', ar: 'أَنِّي أَخْلُقُ لَكُم مِّنَ الطِّينِ كَهَيْئَةِ الطَّيْرِ فَأَنفُخُ فِيهِ فَيَكُونُ طَيْرًا بِإِذْنِ اللَّهِ ۖ وَأُبْرِئُ الْأَكْمَهَ وَالْأَبْرَصَ وَأُحْيِي الْمَوْتَىٰ بِإِذْنِ اللَّهِ', tr: 'Çamurdan kuş şeklinde bir şey yapar, içine üflerim ve Allah\'ın izniyle kuş olur; körü ve alacalıyı iyileştirir, Allah\'ın izniyle ölüleri diriltirim.', en: 'I will make for you from clay the form of a bird and breathe into it, and it will be a bird by Allah\'s permission. I will cure the blind and the leper and bring the dead to life by Allah\'s permission.' },
  '4:171': { ref: 'Nisâ 4:171', ar: 'إِنَّمَا الْمَسِيحُ عِيسَى ابْنُ مَرْيَمَ رَسُولُ اللَّهِ وَكَلِمَتُهُ أَلْقَاهَا إِلَىٰ مَرْيَمَ وَرُوحٌ مِّنْهُ', tr: 'Mesih İsa b. Meryem; yalnızca Allah\'ın elçisi, Meryem\'e ilkâ ettiği kelimesi ve O\'ndan bir ruhtur.', en: 'The Messiah, Jesus son of Mary, was but a messenger of Allah and His word which He directed to Mary and a soul from Him.' },
  '5:114': { ref: 'Mâide 5:114', ar: 'اللَّهُمَّ رَبَّنَا أَنزِلْ عَلَيْنَا مَائِدَةً مِّنَ السَّمَاءِ تَكُونُ لَنَا عِيدًا لِّأَوَّلِنَا وَآخِرِنَا وَآيَةً مِّنكَ', tr: 'Allah\'ım, Rabbimiz! Bize gökten bir sofra indir; ilkimize ve sonuncumuza bayram, senden bir ayet olsun.', en: 'O Allah, our Lord, send down to us a table from heaven to be for us a festival and a sign from You.' },
  // ── Hz. Muhammed ﷺ ─────────────────────────────────────────────────
  '21:107': { ref: 'Enbiyâ 21:107', ar: 'وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً لِّلْعَالَمِينَ', tr: 'Seni âlemlere yalnızca rahmet olarak gönderdik.', en: 'And We have not sent you except as a mercy to the worlds.' },
  '33:40': { ref: 'Ahzâb 33:40', ar: 'مَّا كَانَ مُحَمَّدٌ أَبَا أَحَدٍ مِّن رِّجَالِكُمْ وَلَٰكِن رَّسُولَ اللَّهِ وَخَاتَمَ النَّبِيِّينَ', tr: 'Muhammed, erkeklerinizden hiçbirinin babası değildir; fakat o Allah\'ın elçisi ve peygamberlerin sonuncusudur.', en: 'Muhammad is not the father of any one of your men, but he is the Messenger of Allah and the seal of the prophets.' },
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
    giftsTr:["Halîlullah — Allah'ın dostu (4:125)","Ateş soğutuldu ve selamet oldu (21:69)","İsmail ve İshak ile müjdelendi (11:71)"],
    giftsEn:["Khalilullah — Allah's intimate friend (4:125)","Fire became cool and safe (21:69)","Blessed with Ishmael and Isaac (11:71)"],
    duaAr:'رَبَّنَا تَقَبَّلۡ مِنَّآ إِنَّكَ أَنتَ ٱلسَّمِيعُ ٱلۡعَلِيمُ',
    duaTr:'Rabbimiz! Bizden kabul et. Şüphesiz sen Semi\'sin, Alîm\'sin.',
    duaEn:'Our Lord! Accept this from us. You are the All-Hearing, All-Knowing.',
    duaRef:'2:127',
  },
  {
    id:'lut', nameTr:'Hz. Lût', nameEn:'Lot', mentions:27,
    surahs:[7,11,15,21,26,29,37],
    giftsTr:["Hikmet ve ilim verildi (21:74)","Kavmin azabından kurtarıldı (15:66)","Melekler onu uyardı (11:81)"],
    giftsEn:["Given wisdom and knowledge (21:74)","Saved from the punishment of his people (15:66)","Angels warned him (11:81)"],
    duaAr:'رَبِّ نَجِّنِي وَأَهۡلِي مِمَّا يَعۡمَلُونَ',
    duaTr:'Rabbim! Beni ve ailemi onların yaptıklarından kurtar.',
    duaEn:'My Lord! Save me and my family from what they do.',
    duaRef:'26:169',
  },
  {
    id:'ismail', nameTr:'Hz. İsmâil', nameEn:'Ishmael', mentions:12,
    surahs:[2,3,6,14,19,21,38],
    giftsTr:["Sabreden ve sözünü tutan (19:54)","Ailesine namazı emretti (19:55)","Kurban yerine koç gönderildi (37:107)"],
    giftsEn:["Patient and kept his promise (19:54)","Commanded his family to prayer (19:55)","Ransomed with a great sacrifice (37:107)"],
    duaAr:'رَبَّنَا وَٱجۡعَلۡنَا مُسۡلِمَيۡنِ لَكَ وَمِن ذُرِّيَّتِنَآ أُمَّةٗ مُّسۡلِمَةٗ لَّكَ',
    duaTr:'Rabbimiz! İkimizi de sana teslim olanlardan kıl, soyumuzdan da sana teslim olan bir ümmet çıkar.',
    duaEn:'Our Lord! Make us both submissive to You and from our descendants a submissive community.',
    duaRef:'2:128',
  },
  {
    id:'ishak', nameTr:'Hz. İshâk', nameEn:'Isaac', mentions:17,
    surahs:[2,6,11,14,19,21,37],
    giftsTr:["Salih bir peygamber olarak müjdelendi (11:71)","İbrahim'e bereketle verildi (21:72)","Nübüvvet ve kitap ihsan edildi (29:27)"],
    giftsEn:["Foretold as a righteous prophet (11:71)","Given as a blessing alongside his father (21:72)","Given prophethood and scripture (29:27)"],
    duaAr:null,duaTr:null,duaEn:null,duaRef:null,
  },
  {
    id:'yakub', nameTr:'Hz. Yakûb', nameEn:'Jacob', mentions:16,
    surahs:[2,6,11,12,19,21],
    giftsTr:["Güzel sabır örneği (12:18)","İlim verildi (12:68)","Yusuf'un gömleğiyle gözleri açıldı (12:96)"],
    giftsEn:["Model of beautiful patience (12:18)","Given knowledge (12:68)","Sight restored by Joseph's garment (12:96)"],
    duaAr:'فَصَبۡرٞ جَمِيلٞۖ وَٱللَّهُ ٱلۡمُسۡتَعَانُ عَلَىٰ مَا تَصِفُونَ',
    duaTr:"Güzel bir sabır gerek. Anlattıklarınıza karşı yardım yalnızca Allah'tandır.",
    duaEn:'So patience is most fitting. And Allah is the one sought for help against what you describe.',
    duaRef:'12:18',
  },
  {
    id:'yusuf', nameTr:'Hz. Yusuf', nameEn:'Joseph', mentions:27, detailed:true,
    surahs:[6,12,40],
    giftsTr:["Rüya tabiri ilmi verildi (12:6)","Hüküm ve ilim ihsan edildi (12:22)","Mısır hazinelerine vekil kılındı (12:55)"],
    giftsEn:["Given the interpretation of dreams (12:6)","Given wisdom and knowledge (12:22)","Placed in charge of Egypt's storehouses (12:55)"],
    duaAr:'رَبِّ قَدۡ ءَاتَيۡتَنِي مِنَ ٱلۡمُلۡكِ وَعَلَّمۡتَنِي مِن تَأۡوِيلِ ٱلۡأَحَادِيثِ ۚ تَوَفَّنِي مُسۡلِمٗا وَأَلۡحِقۡنِي بِٱلصَّٰلِحِينَ',
    duaTr:'Rabbim! Mülkten nasip verdin, rüya tabirini öğrettin. Beni müslüman olarak öldür ve salihler arasına kat.',
    duaEn:'My Lord! You gave me sovereignty and taught me interpretation of dreams. Let me die as a Muslim and join me with the righteous.',
    duaRef:'12:101',
  },
  {
    id:'suayb', nameTr:'Hz. Şuayb', nameEn:"Shu'ayb", mentions:11,
    surahs:[7,11,26,29],
    giftsTr:["Medyen halkına gönderildi (7:85)","Ölçü ve tartıyı doğru yapmayı emretti (7:85)","Kavminden kurtarıldı (11:94)"],
    giftsEn:["Sent to the people of Madyan (7:85)","Commanded just weights and measures (7:85)","Saved while his people were destroyed (11:94)"],
    duaAr:'رَبَّنَا ٱفۡتَحۡ بَيۡنَنَا وَبَيۡنَ قَوۡمِنَا بِٱلۡحَقِّ وَأَنتَ خَيۡرُ ٱلۡفَٰتِحِينَ',
    duaTr:'Rabbimiz! Bizimle kavmimiz arasında hak ile hükmet. Sen hükmedenlerin en hayırlısısın.',
    duaEn:'Our Lord! Decide between us and our people with truth. You are the best of those who decide.',
    duaRef:'7:89',
  },
  {
    id:'eyyub', nameTr:'Hz. Eyyûb', nameEn:'Job', mentions:4,
    surahs:[4,6,21,38],
    giftsTr:["Sabrın en büyük örneği (21:83)","Şifa ve afiyet ihsan edildi (21:84)","İki kat nimet ve rahmet verildi (38:43)"],
    giftsEn:["Greatest example of patience (21:83)","Restored to health and bounty (21:84)","Given double mercy and blessings (38:43)"],
    duaAr:'رَّبِّ إِنِّي مَسَّنِيَ ٱلضُّرُّ وَأَنتَ أَرۡحَمُ ٱلرَّٰحِمِينَ',
    duaTr:'Rabbim! Bana dert dokundu, sen merhametlilerin en merhametlisisin.',
    duaEn:'My Lord! Adversity has touched me, and You are the Most Merciful of the merciful.',
    duaRef:'21:83',
  },
  {
    id:'musa', nameTr:'Hz. Musa', nameEn:'Moses', mentions:136, detailed:true,
    surahs:[2,7,10,18,20,26,28,37,40,54,61,79],
    giftsTr:["Kelîmullah — Allah'la doğrudan konuştu (4:164)","Asa ve el mucizesi verildi (7:107-108)","Tevrat indirildi (2:87)"],
    giftsEn:["Kalimullah — spoke directly to Allah (4:164)","Given the staff and white hand miracles (7:107-108)","Given the Torah (2:87)"],
    duaAr:'رَبِّ ٱشۡرَحۡ لِي صَدۡرِي ۝ وَيَسِّرۡ لِيٓ أَمۡرِي',
    duaTr:'Rabbim! Göğsümü genişlet, işimi kolaylaştır.',
    duaEn:'My Lord! Expand my chest for me and ease my task for me.',
    duaRef:'20:25-26',
  },
  {
    id:'harun', nameTr:'Hz. Hârûn', nameEn:'Aaron', mentions:20,
    surahs:[7,10,19,20,21,26,28,37],
    giftsTr:["Musa'ya yardımcı olarak verildi (20:29-32)","Nübüvvet ihsan edildi (19:53)","Güçlü belagat sahibi (28:34)"],
    giftsEn:["Given as helper to Moses (20:29-32)","Granted prophethood (19:53)","More eloquent in speech (28:34)"],
    duaAr:null,duaTr:null,duaEn:null,duaRef:null,
  },
  {
    id:'yunus', nameTr:'Hz. Yûnus', nameEn:'Jonah', mentions:4,
    surahs:[4,6,10,21,37],
    giftsTr:["Balığın karnında dua etti, kurtarıldı (21:87-88)","100.000 kişilik kavmi iman etti (10:98)","Kıyıya çıktı, gölge yapıldı (37:145-146)"],
    giftsEn:["Prayed in the whale's belly, was saved (21:87-88)","His nation of 100,000 believed (10:98)","Cast ashore, sheltered by a gourd tree (37:145-146)"],
    duaAr:'لَّآ إِلَٰهَ إِلَّآ أَنتَ سُبۡحَٰنَكَ إِنِّي كُنتُ مِنَ ٱلظَّٰلِمِينَ',
    duaTr:'Senden başka ilah yoktur. Seni tenzih ederim. Ben zalimlerden oldum.',
    duaEn:'There is no deity except You; exalted are You. Indeed I have been of the wrongdoers.',
    duaRef:'21:87',
  },
  {
    id:'ilyas', nameTr:'Hz. İlyâs', nameEn:'Elijah', mentions:2,
    surahs:[6,37],
    giftsTr:["Salihlerden (6:85)","Kavmini Baal'a tapınmaktan vazgeçirmeye çalıştı (37:125)","Mürselin safında anılır (37:123)"],
    giftsEn:["Among the righteous (6:85)","Called his people away from the idol Baal (37:125)","Counted among the messengers (37:123)"],
    duaAr:null,duaTr:null,duaEn:null,duaRef:null,
  },
  {
    id:'elyesa', nameTr:'Hz. Elyesâ', nameEn:'Elisha', mentions:2,
    surahs:[6,38],
    giftsTr:["İyilerden (6:86)","Âlemlere üstün kılınanlardan (6:86)","İlyas'ın halefi olarak anılır"],
    giftsEn:["Among the good (6:86)","Preferred above the worlds (6:86)","Mentioned as successor to Elijah"],
    duaAr:null,duaTr:null,duaEn:null,duaRef:null,
  },
  {
    id:'zulkifl', nameTr:'Hz. Zülkifl', nameEn:'Dhul-Kifl', mentions:2,
    surahs:[21,38],
    giftsTr:["Sabredenlerden (21:85)","Hayırlılardan (38:48)","İsmail ve İdris ile birlikte anılır (21:85)"],
    giftsEn:["Among the patient (21:85)","Among the good (38:48)","Mentioned alongside Ishmael and Idris (21:85)"],
    duaAr:null,duaTr:null,duaEn:null,duaRef:null,
  },
  {
    id:'davud', nameTr:'Hz. Dâvûd', nameEn:'David', mentions:16,
    surahs:[2,4,17,21,27,34,38],
    giftsTr:["Zebur indirildi (17:55)","Dağlar ve kuşlar onunla tesbih etti (34:10)","Demir yumuşatıldı, zırh yapımı öğretildi (34:10-11)"],
    giftsEn:["Given the Psalms (17:55)","Mountains and birds glorified with him (34:10)","Iron softened, taught to make armor (34:10-11)"],
    duaAr:'فَٱسۡتَغۡفَرَ رَبَّهُۥ وَخَرَّ رَاكِعٗا وَأَنَابَ',
    duaTr:"Rabbinden bağışlama diledi, eğilerek secdeye kapandı ve O'na döndü.",
    duaEn:'He sought forgiveness of his Lord and fell down bowing and turned in repentance.',
    duaRef:'38:24',
  },
  {
    id:'suleyman', nameTr:'Hz. Süleymân', nameEn:'Solomon', mentions:17,
    surahs:[2,4,21,27,34,38],
    giftsTr:["Kuş ve hayvan dili öğretildi (27:16)","Cin, insan ve kuş ordusu verildi (27:17)","Rüzgar ve erimiş bakır kaynağı emrine verildi (34:12)"],
    giftsEn:["Taught the language of birds and animals (27:16)","Commanded an army of jinn, humans and birds (27:17)","Wind and a spring of molten copper subjected to him (34:12)"],
    duaAr:'رَبِّ أَوۡزِعۡنِيٓ أَنۡ أَشۡكُرَ نِعۡمَتَكَ ٱلَّتِيٓ أَنۡعَمۡتَ عَلَيَّ وَعَلَىٰ وَٰلِدَيَّ وَأَنۡ أَعۡمَلَ صَٰلِحٗا تَرۡضَىٰهُ وَأَدۡخِلۡنِي بِرَحۡمَتِكَ فِي عِبَادِكَ ٱلصَّٰلِحِينَ',
    duaTr:'Rabbim! Bana ve anne-babama verdiğin nimete şükretmemi, razı olacağın salih amel işlememi nasip et; rahmetinle beni salih kulların arasına kat.',
    duaEn:'My Lord! Enable me to be grateful for Your favor upon me and upon my parents, and to do righteousness of which You approve, and admit me by Your mercy into the ranks of Your righteous servants.',
    duaRef:'27:19',
  },
  {
    id:'zekeriyya', nameTr:'Hz. Zekeriyyâ', nameEn:'Zechariah', mentions:7,
    surahs:[3,6,19,21],
    giftsTr:["Yaşlılıkta Yahya ile müjdelendi (3:40)","Yahya'ya benzersiz bir isim verildi (19:7)","Gizli duasına icabet edildi (19:3-4)"],
    giftsEn:["Given glad tidings of John in old age (3:40)","John given an unprecedented name (19:7)","His secret prayer was answered (19:3-4)"],
    duaAr:'رَبِّ لَا تَذَرۡنِي فَرۡدٗا وَأَنتَ خَيۡرُ ٱلۡوَٰرِثِينَ',
    duaTr:'Rabbim! Beni yalnız bırakma. Sen varislerin en hayırlısısın.',
    duaEn:'My Lord! Do not leave me alone, and You are the best of inheritors.',
    duaRef:'21:89',
  },
  {
    id:'yahya', nameTr:'Hz. Yahyâ', nameEn:'John', mentions:5,
    surahs:[3,6,19,21],
    giftsTr:["Hikmeti daha çocukken verildi (19:12)","Hanân (şefkat) ve zekât sahibi kılındı (19:13)","Doğduğu, öldüğü ve dirileceği gün selamet verildi (19:15)"],
    giftsEn:["Given wisdom as a child (19:12)","Endowed with compassion and purity (19:13)","Blessed with peace at birth, death, and resurrection (19:15)"],
    duaAr:null,duaTr:null,duaEn:null,duaRef:null,
  },
  {
    id:'isa', nameTr:'Hz. İsa', nameEn:'Jesus', mentions:25, detailed:true,
    surahs:[3,4,5,19,43,61],
    giftsTr:["Ölü diriltti, körleri iyileştirdi (3:49)","Rûhullah ve Kelimetullah (4:171)","Maide mucizesi gerçekleşti (5:114)"],
    giftsEn:["Raised the dead, healed the blind (3:49)","Spirit of Allah and Word of Allah (4:171)","The miracle of the Table was granted (5:114)"],
    duaAr:'ٱللَّهُمَّ رَبَّنَآ أَنزِلۡ عَلَيۡنَا مَآئِدَةٗ مِّنَ ٱلسَّمَآءِ تَكُونُ لَنَا عِيدٗا لِّأَوَّلِنَا وَءَاخِرِنَا وَءَايَةٗ مِّنكَ',
    duaTr:"Allah'ım, Rabbimiz! Bize gökten bir sofra indir; o bizim için bir bayram, senden bir ayet olsun.",
    duaEn:'O Allah, our Lord! Send down to us a table from heaven to be a festival for us and a sign from You.',
    duaRef:'5:114',
  },
  {
    id:'muhammed', nameTr:'Hz. Muhammed ﷺ', nameEn:'Muhammad ﷺ', mentions:4,
    surahs:[3,33,47,48,61],
    giftsTr:["Âlemlere rahmet olarak gönderildi (21:107)","Hâtemü'n-Nebiyyîn — son peygamber (33:40)","İsrâ ve Miraç ile yükseltildi (17:1)"],
    giftsEn:["Sent as mercy to all the worlds (21:107)","Seal of the Prophets (33:40)","Elevated by the Night Journey and Ascension (17:1)"],
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
      padding: '100px 0 80px',
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
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
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
                          {tr('Duası', 'Prayer')}
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
