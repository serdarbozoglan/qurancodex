import { useState, useRef, useCallback } from 'react';
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

// "(2:31)" → "(Bakara 31)" dönüşümü
function fmtRef(text, lang = 'tr') {
  return text.replace(/\((\d+):(\d+)\)/g, (_, s, v) => {
    const name = SURAH_NAMES[+s];
    const label = name ? (lang === 'tr' ? name.tr : name.en) : `Sure ${s}`;
    return `(${label} ${v})`;
  });
}

// Dua Arapçası için temel normalizasyon (KFGQPC uyumluluğu)
function cleanDuaAr(str) {
  if (!str) return str;
  return str
    .replace(/\u0671/g, '\u0627') // alef wasla → düz alef (KFGQPC'de ص gösterir)
    .replace(/\u06CC/g, '\u064A') // Farsça ye → Arapça ye
    .replace(/\u06E6/g, ' ')      // small yeh → boşluk (kelime ayracı)
    .replace(/[\u06E0\u06E2-\u06E4\u06E7\u06E8\u06EB\u06ED]/g, '') // Uthmani işaretler
    .replace(/[\u0610-\u0614\u0616\u0617]/g, ''); // kısaltma işaretleri
}

const SURAH_NAMES = {
  1:{tr:'Fâtiha',en:'Al-Fatiha'}, 2:{tr:'Bakara',en:'Al-Baqarah'}, 3:{tr:'Âl-i İmrân',en:'Al-Imran'},
  4:{tr:'Nisâ',en:'An-Nisa'}, 5:{tr:'Mâide',en:'Al-Maidah'}, 6:{tr:'En\'âm',en:'Al-Anam'},
  7:{tr:'A\'râf',en:'Al-Araf'}, 10:{tr:'Yûnus',en:'Yunus'}, 11:{tr:'Hûd',en:'Hud'},
  12:{tr:'Yûsuf',en:'Yusuf'}, 14:{tr:'İbrâhîm',en:'Ibrahim'}, 17:{tr:'İsrâ',en:'Al-Isra'},
  18:{tr:'Kehf',en:'Al-Kahf'}, 19:{tr:'Meryem',en:'Maryam'}, 20:{tr:'Tâhâ',en:'Taha'},
  21:{tr:'Enbiyâ',en:'Al-Anbiya'}, 22:{tr:'Hac',en:'Al-Hajj'}, 23:{tr:'Mü\'minûn',en:'Al-Muminun'},
  26:{tr:'Şuarâ',en:'Ash-Shuara'}, 27:{tr:'Neml',en:'An-Naml'}, 28:{tr:'Kasas',en:'Al-Qasas'},
  29:{tr:'Ankebût',en:'Al-Ankabut'}, 33:{tr:'Ahzâb',en:'Al-Ahzab'}, 34:{tr:'Sebe',en:'Saba'},
  37:{tr:'Sâffât',en:'As-Saffat'}, 38:{tr:'Sâd',en:'Sad'}, 40:{tr:'Mü\'min',en:"Al-Mu'min"},
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
    surahs:[2,3,7,17,20,38],
    giftsTr:["Tüm isimleri öğrendi (2:31)","Melekler ona secde etti (2:34)","Tevbesi kabul edildi (2:37)"],
    giftsEn:["Taught all names (2:31)","Angels prostrated to him (2:34)","Repentance accepted (2:37)"],
    duaAr:'رَبَّنَا ظَلَمۡنَآ أَنفُسَنَا وَإِن لَّمۡ تَغۡفِرۡ لَنَا وَتَرۡحَمۡنَا لَنَكُونَنَّ مِنَ ٱلۡخَٰسِرِينَ',
    duaTr:'Rabbimiz! Biz kendimize zulmettik. Bağışlamaz ve merhamet etmezsen kaybedenlerden oluruz.',
    duaEn:'Our Lord! We have wronged ourselves. If You do not forgive us and have mercy on us, we will surely be losers.',
    duaRef:'7:23',
  },
  {
    id:'idris', nameTr:'Hz. İdris', nameEn:'Idris', mentions:2,
    surahs:[19,21],
    giftsTr:["Sıddık ve nebilerden (19:56)","Yüksek bir mevkiye yükseltildi (19:57)"],
    giftsEn:["Among the truthful and prophets (19:56)","Raised to a high station (19:57)"],
    duaAr:null,duaTr:null,duaEn:null,duaRef:null,
  },
  {
    id:'nuh', nameTr:'Hz. Nuh', nameEn:'Noah', mentions:43, detailed:true,
    surahs:[7,10,11,21,23,26,29,37,54,71],
    giftsTr:["950 yıl kavmine davet etti (29:14)","Gemi yapımı vahiyle öğretildi (11:37)","Tufandan korundu, soyu devam etti (37:77)"],
    giftsEn:["Called his people for 950 years (29:14)","Taught to build the ark by revelation (11:37)","Saved from the flood, lineage continued (37:77)"],
    duaAr:'رَّبِّ إِنِّي مَغۡلُوبٞ فَٱنتَصِرۡ',
    duaTr:'Rabbim! Ben yenildim, sen yardım et.',
    duaEn:'My Lord! I am overpowered, so help me.',
    duaRef:'54:10',
  },
  {
    id:'hud', nameTr:'Hz. Hûd', nameEn:'Hud', mentions:7,
    surahs:[7,11,26,46],
    giftsTr:["Âd kavmine gönderildi (7:65)","Allah'ın nimetlerini hatırlattı (11:50)","Kavminden kurtarıldı (11:58)"],
    giftsEn:["Sent to the people of Aad (7:65)","Reminded them of God's blessings (11:50)","Saved while his people were destroyed (11:58)"],
    duaAr:null,duaTr:null,duaEn:null,duaRef:null,
  },
  {
    id:'salih', nameTr:'Hz. Sâlih', nameEn:'Salih', mentions:9,
    surahs:[7,11,26,27],
    giftsTr:["Semud kavmine gönderildi (7:73)","Mucize deve (nâka) verildi (7:73)","Kavminden kurtarıldı (7:79)"],
    giftsEn:["Sent to the people of Thamud (7:73)","Given the miraculous she-camel (7:73)","Saved while his people perished (7:79)"],
    duaAr:null,duaTr:null,duaEn:null,duaRef:null,
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
    giftsTr:["Kuş ve hayvan dili öğretildi (27:16)","Cin, insan ve kuş ordusu verildi (27:17)","Rüzgar ve bakır kaynağı emrine verildi (21:81, 34:12)"],
    giftsEn:["Taught the language of birds and animals (27:16)","Commanded an army of jinn, humans and birds (27:17)","Wind and a spring of copper subjected to him (21:81, 34:12)"],
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
  const svgRef = useRef(null);

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
              {allProphetArcs.map(({ prophet, arcs, laneIdx }) =>
                arcs.map((arc, i) => {
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
                })
              )}
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
                          title={language === 'tr' ? item.phaseTr : item.phaseEn}
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
                  fontSize: '0.7rem', color: 'rgba(148,163,184,0.35)',
                  fontFamily: 'Inter, sans-serif',
                }}>
                  {tr(
                    '● Altın = Mekkî sûre  ● Yeşil = Medenî sûre',
                    '● Gold = Meccan surah  ● Green = Medinan surah',
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
              gridTemplateColumns: `repeat(${selectedProphetObjs.length}, 1fr)`,
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
                          <span style={{ color: 'rgba(212,165,116,0.75)' }}>{mekkiCount}M</span>
                          <span style={{ color: 'rgba(52,211,153,0.75)' }}>{medeniCount}d</span>
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
              color: 'rgba(148,163,184,0.45)', fontSize: '0.78rem',
              fontFamily: 'Inter, sans-serif',
              display: 'inline-flex', alignItems: 'center', gap: '5px',
              padding: '4px 0',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'rgba(148,163,184,0.75)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(148,163,184,0.45)'}
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
                contextTr: 'Hz. Ebu Talib yıllarca Hz. Muhammed\'i korudu — ama iman etmeden vefat etti. En sevilen insanın imansız ölümü, Hz. Nuh\'un oğlunun dalgalarda yok olmasıyla bire bir örtüşüyordu. "Mecnun" iftirası da ortaktı.',
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
                narrativeTr: 'Mucizeler de yetmedi, hüccet de — kavmi yine de böldü. Ama Allah onu ref\' ile yükseltip şereflendirdi; o da gidinceye dek Hz. Muhammed\'i müjdeledi (Saf 61:6). Her zahiri son, ilahi bir yeniden başlangıçtı.',
                narrativeEn: "Miracles weren't enough, argument wasn't enough — his people divided anyway. Yet God honored him with the rafa'; and before departing, he foretold Prophet Muhammad (As-Saff 61:6). Every apparent ending was a divine new beginning.",
                contextTr: '631: Necran\'dan gelen Hristiyan heyeti Medine\'ye ulaştı; Âl-i İmrân\'ın büyük bölümü bu müzakereye cevap olarak indi. Mübahele ayeti (3:61) — hakikatin ilan edildiği o tarihi an. Hz. Muhammed\'in zahiri "yalnızlığı" da Hz. İsa\'nın ref\'i gibi geçici bir görüntüydü.',
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
                      letterSpacing: '0.1em', textTransform: 'uppercase',
                      marginBottom: '8px', opacity: 0.7,
                    }}>
                      {tr('Hz. Muhammed\'in durumu', 'Prophet Muhammad\'s situation')}
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
            <p style={{ color: 'rgba(148,163,184,0.45)', fontSize: '0.78rem', lineHeight: 1.65, margin: 0 }}>
              <span style={{ color: 'rgba(212,165,116,0.5)', fontWeight: 700, marginRight: '6px' }}>Not:</span>
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
                    background: p.detailed
                      ? 'rgba(212,165,116,0.06)'
                      : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${p.detailed ? 'rgba(212,165,116,0.25)' : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: '12px',
                    overflow: 'hidden',
                    transition: 'border-color 0.2s',
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

                  {/* Expanded accordion body */}
                  {isOpen && (
                    <div style={{
                      borderTop: '1px solid rgba(255,255,255,0.06)',
                      padding: '14px 16px',
                    }}>
                      {/* All surah pills when expanded */}
                      {p.surahs.length > 6 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '14px' }}>
                          {p.surahs.map(s => {
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
                        </div>
                      )}

                      {/* Gifts / attributes */}
                      <div style={{ marginBottom: p.duaAr ? '14px' : 0 }}>
                        <div style={{
                          fontSize: '0.68rem', fontWeight: 700,
                          color: 'rgba(212,165,116,0.55)',
                          letterSpacing: '0.1em', textTransform: 'uppercase',
                          fontFamily: 'Inter, sans-serif', marginBottom: '8px',
                        }}>
                          {tr("Kur'an'dan Vasıflar", 'Attributes from Quran')}
                        </div>
                        <ul style={{ margin: 0, padding: '0 0 0 14px' }}>
                          {(language === 'tr' ? p.giftsTr : p.giftsEn).map((g, i) => (
                            <li key={i} style={{
                              fontSize: '0.8rem', color: 'rgba(232,230,227,0.75)',
                              lineHeight: 1.6, marginBottom: '4px',
                              fontFamily: 'Inter, sans-serif',
                            }}>
                              {fmtRef(g, language)}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Du'a box */}
                      {p.duaAr && (
                        <div style={{
                          marginTop: '14px',
                          background: 'rgba(212,165,116,0.05)',
                          border: '1px solid rgba(212,165,116,0.15)',
                          borderRadius: '8px',
                          padding: '12px 14px',
                        }}>
                          <div style={{
                            fontSize: '0.65rem', fontWeight: 700,
                            color: 'rgba(212,165,116,0.55)',
                            letterSpacing: '0.1em', textTransform: 'uppercase',
                            fontFamily: 'Inter, sans-serif', marginBottom: '8px',
                          }}>
                            {tr('Duası', 'Prayer')}
                          </div>
                          {/* Arabic */}
                          <div style={{
                            direction: 'rtl', textAlign: 'right',
                            fontFamily: "'KFGQPC', 'Amiri Quran', serif",
                            fontSize: '1.45rem', lineHeight: 2.0,
                            color: '#d4a574',
                            marginBottom: '8px',
                          }}>
                            {cleanDuaAr(p.duaAr)}
                          </div>
                          {/* Translation */}
                          <div style={{
                            fontSize: '0.78rem', color: 'rgba(148,163,184,0.75)',
                            lineHeight: 1.6, fontFamily: 'Inter, sans-serif',
                            fontStyle: 'italic', marginBottom: '6px',
                          }}>
                            {language === 'tr' ? p.duaTr : p.duaEn}
                          </div>
                          {/* Reference */}
                          <div style={{
                            fontSize: '0.65rem', color: 'rgba(212,165,116,0.4)',
                            fontFamily: 'Inter, sans-serif', textAlign: 'right',
                          }}>
                            {p.duaRef}
                          </div>
                        </div>
                      )}

                      {/* No du'a note */}
                      {!p.duaAr && (
                        <div style={{
                          marginTop: '10px',
                          fontSize: '0.72rem',
                          color: 'rgba(148,163,184,0.3)',
                          fontFamily: 'Inter, sans-serif',
                          fontStyle: 'italic',
                        }}>
                          {tr(
                            "Kur'an'da duası aktarılmamıştır.",
                            'No explicit prayer attributed in the Quran.',
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div style={{
            marginTop: '16px', textAlign: 'center',
            fontSize: '0.7rem', color: 'rgba(148,163,184,0.35)',
            fontFamily: 'Inter, sans-serif',
          }}>
            {tr(
              '● Altın çerçeve = Atlas bölümünde detaylı anlatı mevcut  ● Altın hap = Mekkî sûre  ● Yeşil hap = Medenî sûre',
              '● Gold border = detailed narrative in the Atlas section  ● Gold pill = Meccan surah  ● Green pill = Medinan surah',
            )}
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

          {/* SVG silsile tree — chronological left → right */}
          <div style={{ overflowX: 'auto' }}>
            <svg
              viewBox="0 0 980 310"
              style={{ width: '100%', minWidth: '680px', maxWidth: '980px', display: 'block', margin: '0 auto' }}
              aria-label={tr('Peygamberler silsilesi diyagramı', 'Prophet lineage diagram')}
            >
              <defs>
                <marker id="mAmber"   markerWidth="8" markerHeight="8" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="rgba(251,191,36,0.7)" /></marker>
                <marker id="mEmerald" markerWidth="8" markerHeight="8" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="rgba(52,211,153,0.7)" /></marker>
                <marker id="mOrange"  markerWidth="8" markerHeight="8" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="rgba(249,115,22,0.7)" /></marker>
                <marker id="mLavend"  markerWidth="8" markerHeight="8" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="rgba(192,132,252,0.7)" /></marker>
              </defs>

              {/* Kronoloji */}
              <text x="490" y="12" textAnchor="middle"
                fill="rgba(148,163,184,0.22)" fontSize="8" fontFamily="Inter,sans-serif" letterSpacing="0.18em">
                {tr('KRONOLOJİ →', 'CHRONOLOGY →')}
              </text>

              {/* Era separators */}
              <line x1="318" y1="8" x2="318" y2="295" stroke="rgba(255,255,255,0.07)" strokeWidth="1" strokeDasharray="4,4" />
              <line x1="640" y1="8" x2="640" y2="295" stroke="rgba(255,255,255,0.07)" strokeWidth="1" strokeDasharray="4,4" />
              <line x1="800" y1="8" x2="800" y2="295" stroke="rgba(255,255,255,0.07)" strokeWidth="1" strokeDasharray="4,4" />

              {/* Era date labels */}
              <text x="158" y="12" textAnchor="middle" fill="rgba(251,191,36,0.3)" fontSize="7.5" fontFamily="Inter,sans-serif" letterSpacing="0.07em">
                {tr('~MÖ 2000–1700', '~2000–1700 BCE')}
              </text>
              <text x="478" y="64" textAnchor="middle" fill="rgba(96,165,250,0.3)" fontSize="7.5" fontFamily="Inter,sans-serif" letterSpacing="0.07em">
                {tr('~MÖ 1300', '~1300 BCE')}
              </text>
              <text x="718" y="12" textAnchor="middle" fill="rgba(249,115,22,0.3)" fontSize="7.5" fontFamily="Inter,sans-serif" letterSpacing="0.07em">
                {tr('~MÖ 1000', '~1000 BCE')}
              </text>
              <text x="888" y="12" textAnchor="middle" fill="rgba(192,132,252,0.3)" fontSize="7.5" fontFamily="Inter,sans-serif" letterSpacing="0.07em">
                {tr('~MÖ 1. yy', '~1st c. BCE')}
              </text>

              {/* ══════════════════════════════════════
                  ERA 1 — İBRAHİM SİLSİLESİ
                  Col A x=20 (İbrahim+İsmâil)
                  Col B x=186 (İshâk+Yakûb+Yûsuf)
                  ══════════════════════════════════════ */}

              {/* İBRAHİM */}
              <g>
                <rect x="20" y="22" width="116" height="36" rx="8"
                  fill="rgba(251,191,36,0.12)" stroke="rgba(251,191,36,0.55)" strokeWidth="1.5" />
                <text x="78" y="45" textAnchor="middle"
                  fill="rgba(251,191,36,0.95)" fontSize="12" fontWeight="700" fontFamily="Inter,sans-serif">
                  {tr('Hz. İbrahim', 'Abraham')}
                </text>
              </g>

              {/* İbrahim → İsmâil  (dikey)
                  Ok: (78,58)→(78,144)  orta y=101
                  Referanslar: okun SOLUNDA, iki satır */}
              <line x1="78" y1="58" x2="78" y2="144"
                stroke="rgba(251,191,36,0.35)" strokeWidth="1.5" markerEnd="url(#mAmber)" />
              <text x="70" y="93" textAnchor="end"
                fill="rgba(251,191,36,0.32)" fontSize="8" fontFamily="Inter,sans-serif">
                {tr('Hûd 71', 'Hud 71')}
              </text>
              <text x="70" y="107" textAnchor="end"
                fill="rgba(251,191,36,0.32)" fontSize="8" fontFamily="Inter,sans-serif">
                {tr('Meryem 54', 'Maryam 54')}
              </text>

              {/* İbrahim → İshâk  (yatay)
                  Ok: (136,40)→(186,40)  orta x=161
                  Referanslar: okun ÜSTÜNDE, iki satır */}
              <line x1="136" y1="40" x2="186" y2="40"
                stroke="rgba(251,191,36,0.35)" strokeWidth="1.5" markerEnd="url(#mAmber)" />
              <text x="161" y="30" textAnchor="middle"
                fill="rgba(251,191,36,0.32)" fontSize="8" fontFamily="Inter,sans-serif">
                {tr('Hûd 71', 'Hud 71')}
              </text>
              <text x="161" y="20" textAnchor="middle"
                fill="rgba(251,191,36,0.32)" fontSize="8" fontFamily="Inter,sans-serif">
                {tr('Sâffât 112', 'As-Saffat 112')}
              </text>

              {/* İSMÂİL */}
              <g>
                <rect x="20" y="144" width="116" height="36" rx="8"
                  fill="rgba(251,191,36,0.07)" stroke="rgba(251,191,36,0.35)" strokeWidth="1.2" />
                <text x="78" y="167" textAnchor="middle"
                  fill="rgba(251,191,36,0.8)" fontSize="12" fontWeight="600" fontFamily="Inter,sans-serif">
                  {tr('Hz. İsmâil', 'Ishmael')}
                </text>
              </g>

              {/* İSHÂK */}
              <g>
                <rect x="186" y="22" width="116" height="36" rx="8"
                  fill="rgba(251,191,36,0.07)" stroke="rgba(251,191,36,0.35)" strokeWidth="1.2" />
                <text x="244" y="45" textAnchor="middle"
                  fill="rgba(251,191,36,0.8)" fontSize="12" fontWeight="600" fontFamily="Inter,sans-serif">
                  {tr('Hz. İshâk', 'Isaac')}
                </text>
              </g>

              {/* İshâk → Yakûb  (dikey)
                  Ok: (244,58)→(244,144)  orta y=101
                  Referanslar: okun SOLUNDA, iki satır */}
              <line x1="244" y1="58" x2="244" y2="144"
                stroke="rgba(251,191,36,0.35)" strokeWidth="1.5" markerEnd="url(#mAmber)" />
              <text x="236" y="93" textAnchor="end"
                fill="rgba(251,191,36,0.32)" fontSize="8" fontFamily="Inter,sans-serif">
                {tr('Hûd 71', 'Hud 71')}
              </text>
              <text x="236" y="107" textAnchor="end"
                fill="rgba(251,191,36,0.32)" fontSize="8" fontFamily="Inter,sans-serif">
                {tr('Enbiyâ 72', 'Al-Anbiya 72')}
              </text>

              {/* YAKÛB */}
              <g>
                <rect x="186" y="144" width="116" height="36" rx="8"
                  fill="rgba(251,191,36,0.07)" stroke="rgba(251,191,36,0.3)" strokeWidth="1.2" />
                <text x="244" y="167" textAnchor="middle"
                  fill="rgba(251,191,36,0.8)" fontSize="12" fontWeight="600" fontFamily="Inter,sans-serif">
                  {tr('Hz. Yakûb', 'Jacob')}
                </text>
              </g>

              {/* Yakûb → Yûsuf  (dikey)
                  Ok: (244,180)→(244,234)  orta y=207
                  Referanslar: okun SOLUNDA, iki satır */}
              <line x1="244" y1="180" x2="244" y2="234"
                stroke="rgba(52,211,153,0.4)" strokeWidth="1.5" markerEnd="url(#mEmerald)" />
              <text x="236" y="201" textAnchor="end"
                fill="rgba(52,211,153,0.32)" fontSize="8" fontFamily="Inter,sans-serif">
                {tr('Yûsuf 4', 'Yusuf 4')}
              </text>
              <text x="236" y="215" textAnchor="end"
                fill="rgba(52,211,153,0.32)" fontSize="8" fontFamily="Inter,sans-serif">
                {tr('Yûsuf 6', 'Yusuf 6')}
              </text>

              {/* YÛSUF */}
              <g>
                <rect x="186" y="234" width="116" height="36" rx="8"
                  fill="rgba(52,211,153,0.09)" stroke="rgba(52,211,153,0.45)" strokeWidth="1.5" />
                <text x="244" y="257" textAnchor="middle"
                  fill="rgba(52,211,153,0.95)" fontSize="12" fontWeight="700" fontFamily="Inter,sans-serif">
                  {tr('Hz. Yûsuf', 'Joseph')}
                </text>
              </g>

              {/* ══════════════════════════════════════
                  ERA 2 — MÛSÂ + HÂRÛN (kardeşler)
                  Mûsâ x=338, Hârûn x=494  gap=40px
                  Ok yatay (434,96)→(494,96)  orta x=464
                  Referanslar: okun ÜSTÜNDE, iki satır
                  ══════════════════════════════════════ */}

              <g>
                <rect x="338" y="80" width="116" height="36" rx="8"
                  fill="rgba(96,165,250,0.09)" stroke="rgba(96,165,250,0.5)" strokeWidth="1.5" />
                <text x="396" y="103" textAnchor="middle"
                  fill="rgba(96,165,250,0.95)" fontSize="12" fontWeight="700" fontFamily="Inter,sans-serif">
                  {tr('Hz. Mûsâ', 'Moses')}
                </text>
              </g>

              {/* Kardeş bağı */}
              <line x1="454" y1="98" x2="494" y2="98"
                stroke="rgba(96,165,250,0.3)" strokeWidth="1.2" strokeDasharray="5,4" />
              {/* "kardeşler" etiketi */}
              <text x="474" y="76" textAnchor="middle"
                fill="rgba(96,165,250,0.35)" fontSize="7.5" fontFamily="Inter,sans-serif">
                {tr('kardeşler', 'brothers')}
              </text>
              {/* Referanslar üstte, iki satır */}
              <text x="474" y="65" textAnchor="middle"
                fill="rgba(96,165,250,0.28)" fontSize="8" fontFamily="Inter,sans-serif">
                {tr('Tâhâ 30', 'Taha 30')}
              </text>
              <text x="474" y="55" textAnchor="middle"
                fill="rgba(96,165,250,0.28)" fontSize="8" fontFamily="Inter,sans-serif">
                {tr('Kasas 34', 'Al-Qasas 34')}
              </text>

              <g>
                <rect x="494" y="80" width="116" height="36" rx="8"
                  fill="rgba(96,165,250,0.07)" stroke="rgba(96,165,250,0.35)" strokeWidth="1.2" />
                <text x="552" y="103" textAnchor="middle"
                  fill="rgba(96,165,250,0.8)" fontSize="12" fontWeight="600" fontFamily="Inter,sans-serif">
                  {tr('Hz. Hârûn', 'Aaron')}
                </text>
              </g>

              {/* ══════════════════════════════════════
                  ERA 3 — DÂVÛD → SÜLEYMÂN
                  Ok dikey (718,58)→(718,144)  orta y=101
                  Referanslar: okun SOLUNDA, iki satır
                  ══════════════════════════════════════ */}

              <g>
                <rect x="658" y="22" width="120" height="36" rx="8"
                  fill="rgba(249,115,22,0.09)" stroke="rgba(249,115,22,0.5)" strokeWidth="1.5" />
                <text x="718" y="45" textAnchor="middle"
                  fill="rgba(249,115,22,0.95)" fontSize="12" fontWeight="700" fontFamily="Inter,sans-serif">
                  {tr('Hz. Dâvûd', 'David')}
                </text>
              </g>

              <line x1="718" y1="58" x2="718" y2="144"
                stroke="rgba(249,115,22,0.4)" strokeWidth="1.5" markerEnd="url(#mOrange)" />
              <text x="710" y="93" textAnchor="end"
                fill="rgba(249,115,22,0.32)" fontSize="8" fontFamily="Inter,sans-serif">
                {tr('Neml 16', 'An-Naml 16')}
              </text>
              <text x="710" y="107" textAnchor="end"
                fill="rgba(249,115,22,0.32)" fontSize="8" fontFamily="Inter,sans-serif">
                {tr('Sâd 30', 'Sad 30')}
              </text>

              <g>
                <rect x="658" y="144" width="120" height="36" rx="8"
                  fill="rgba(249,115,22,0.07)" stroke="rgba(249,115,22,0.35)" strokeWidth="1.2" />
                <text x="718" y="167" textAnchor="middle"
                  fill="rgba(249,115,22,0.8)" fontSize="12" fontWeight="600" fontFamily="Inter,sans-serif">
                  {tr('Hz. Süleymân', 'Solomon')}
                </text>
              </g>

              {/* ══════════════════════════════════════
                  ERA 4 — ZEKERİYYÂ → YAHYÂ
                  Ok dikey (888,58)→(888,144)  orta y=101
                  Referanslar: okun SOLUNDA, iki satır
                  ══════════════════════════════════════ */}

              <g>
                <rect x="818" y="22" width="144" height="36" rx="8"
                  fill="rgba(192,132,252,0.09)" stroke="rgba(192,132,252,0.5)" strokeWidth="1.5" />
                <text x="890" y="45" textAnchor="middle"
                  fill="rgba(192,132,252,0.95)" fontSize="12" fontWeight="700" fontFamily="Inter,sans-serif">
                  {tr('Hz. Zekeriyyâ', 'Zechariah')}
                </text>
              </g>

              <line x1="890" y1="58" x2="890" y2="144"
                stroke="rgba(192,132,252,0.4)" strokeWidth="1.5" markerEnd="url(#mLavend)" />
              <text x="882" y="93" textAnchor="end"
                fill="rgba(192,132,252,0.32)" fontSize="8" fontFamily="Inter,sans-serif">
                {tr('Âl-i İmrân 38', 'Al-Imran 38')}
              </text>
              <text x="882" y="107" textAnchor="end"
                fill="rgba(192,132,252,0.32)" fontSize="8" fontFamily="Inter,sans-serif">
                {tr('Meryem 7', 'Maryam 7')}
              </text>

              <g>
                <rect x="818" y="144" width="144" height="36" rx="8"
                  fill="rgba(192,132,252,0.07)" stroke="rgba(192,132,252,0.35)" strokeWidth="1.2" />
                <text x="890" y="167" textAnchor="middle"
                  fill="rgba(192,132,252,0.8)" fontSize="12" fontWeight="600" fontFamily="Inter,sans-serif">
                  {tr('Hz. Yahyâ', 'John')}
                </text>
              </g>
            </svg>
          </div>

          {/* Note */}
          <p style={{
            textAlign: 'center', marginTop: '16px',
            color: 'rgba(148,163,184,0.3)', fontSize: '0.72rem',
            fontFamily: 'Inter, sans-serif', fontStyle: 'italic',
          }}>
            {tr(
              "→ baba-oğul  ---  kardeşler  ·  Yalnızca Kur'an âyetlerinde açıkça geçen bağlar gösterilmiştir.",
              "→ father-son  ---  brothers  ·  Only connections explicitly stated in Quranic verses are shown.",
            )}
          </p>
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
