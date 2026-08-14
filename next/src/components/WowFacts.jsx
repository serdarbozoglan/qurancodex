'use client';

import { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useQuranNav } from '../hooks/useQuranNav';
import { CLOSE_BTN, OVERLAY_TITLE, COLORS, FONTS, RADIUS, TRANSITION, SEMANTIC } from '../tokens';
import ToolHeader from './ToolHeader';
import CrossToolCTA from './CrossToolCTA';
import SourcesCitation from './SourcesCitation';
import BookmarkButton from './BookmarkButton';

const CATEGORY_CONFIG = {
  sayisal:      { color: COLORS.gold,      labelTr: 'Sayısal',      labelEn: 'Numerical'   },
  yapisal:      { color: COLORS.skyBlue,   labelTr: 'Yapısal',      labelEn: 'Structural'  },
  peygamberler: { color: COLORS.amber,     labelTr: 'Peygamberler', labelEn: 'Prophets'    },
  azBilinen:    { color: COLORS.purple,    labelTr: 'Az Bilinen',   labelEn: 'Hidden Gems' },
};

const CATEGORY_ORDER = ['sayisal', 'yapisal', 'peygamberler', 'azBilinen'];

// ─── surahRef dil yerelleştirmesi (2026-08-14, Z3e2) ────────────────────────
// `surahRef` tek dilli tutulmuş ve İngilizce sayfada da Türkçe basılıyordu:
// `/en/arac/kurani-tani` ve `/en/arac/wow`'da "Çeşitli sûreler" görünüyordu
// (ölçüldü, iki rotada da doğrulandı).
// Yalnız JENERİK ifadeler çevrilir — sûre adlarının Türkçe transliterasyonu
// (El-Fâtiha, Er-Rahmân…) ayrı bir adlandırma kararıdır, buradan değiştirmem
// tutarsızlık üretirdi (bkz. todo: sûre adı konvansiyonu).
const SURAHREF_EN = [
  [/Çeşitli sûreler/g, 'Various surahs'],
  [/(\d+)\.\s*sûre/g, 'surah $1'],
];
function localizeSurahRef(ref, language) {
  if (language !== 'en' || !ref) return ref;
  return SURAHREF_EN.reduce((acc, [re, to]) => acc.replace(re, to), ref);
}

const FACTS = [
  // ── SAYISAL ──────────────────────────────────────────────────────────────────
  {
    category: 'sayisal',
    surahRef: 'Çeşitli sûreler',
    titleTr: 'Besmele\'nin Sayısal İmzası',
    titleEn: 'The Numerical Signature of Bismillah',
    bodyTr: 'Sûrelerin neredeyse tamamı besmele ile açılır — yalnız Tevbe sûresi istisnadır. Bir kez daha Neml 27:30\'da, Hz. Süleyman\'ın Belkıs\'a yazdığı mektubun açılışı olarak geçer. Mushaf geleneğinde besmelenin sûre başlarında yer alması belirgin bir düzen oluşturur; ancak toplam sayım, besmelenin ayet sayımı ve istisnalar gibi usûl tercihlerine bağlıdır. (Not: Neml 27:30\'da besmele bir mektup alıntısı içinde geçer; bu tür ayrıntılar "sayısal mucize" iddialarında yöntem tartışmasını doğurur.)',
    bodyEn: 'Bismillah opens nearly every surah — At-Tawbah is the only exception. It appears once more inside An-Naml 27:30, as the opening of Solomon\'s letter to the Queen of Sheba. In the mushaf tradition, placing the Basmala at surah headings forms a clear order; but any total count depends on methodological choices such as whether the Basmala is counted as a verse and how exceptions are treated. (Note: In An-Naml 27:30 the Basmala occurs inside a quoted letter; such details raise methodological debate in "numerical miracle" claims.)',
    wowTr: 'Besmele, mushaf düzeninde güçlü bir başlangıç/eşik işareti olarak öne çıkar.',
    wowEn: 'The Basmala stands out as a strong opening/threshold marker in the mushaf arrangement.',
    explore: '27:30',
    visualType: 'counter',
    visualData: {
      value: 114,
      suffixTr: 'besmele',
      suffixEn: 'bismillahs',
      labelTr: 'Sûre başlarında yer alır',
      labelEn: 'Placed at surah openings',
    },
  },
  {
    category: 'sayisal',
    surahRef: 'El-Mücâdele · 58',
    titleTr: 'Her Ayette Allah — Tek Sûre',
    titleEn: 'Allah in Every Verse — The Only Surah',
    bodyTr: 'El-Mücâdele sûresinin tamamında "Allah" lafzı geçer. Kur\'an\'ın sûrelerinden yalnızca bu sûreye özgü bir özellik.',
    bodyEn: 'The name "Allah" appears in every verse of Al-Mujadila. A distinction belonging to only one of the Quran\'s surahs.',
    wowTr: '114 sûreden sadece birinin taşıdığı imza.',
    wowEn: 'A signature carried by only one of 114 surahs.',
    explore: 'mucadele',
    visualType: 'counter',
    visualData: {
      value: 22,
      suffixTr: 'ayet',
      suffixEn: 'verses',
      labelTr: 'Hepsinde "Allah" lafzı geçer',
      labelEn: 'Each contains the name "Allah"',
    },
  },

  {
    category: 'sayisal',
    surahRef: 'Çeşitli sûreler',
    titleTr: 'En Sık Geçen Kelime',
    titleEn: 'The Most Frequent Word',
    bodyTr: 'Kur\'an\'ın en çok geçen kelimesi, Allah lafzıdır. Sûrelerin tamamına, ayetlerin geneline yayılmış — hiçbir sayfa sessiz kalmıyor.\n\nℹ️ Kesin sayı, hangi formların dahil edildiğine göre kaynaklara göre hafif farklılık gösterebilir.',
    bodyEn: 'The most frequent word in the Quran is the name Allah itself. Spread across every surah, throughout the verses — no page is silent.\n\nℹ️ The exact count varies slightly by source depending on which forms are included.',
    wowTr: 'Her 2,3 ayette bir — hiçbir sayfa susmuyor.',
    wowEn: 'Once every 2.3 verses — no page is silent.',
    explore: 'Allah',
    visualType: 'counter',
    visualData: {
      value: 2699,
      suffixTr: 'kez',
      suffixEn: 'times',
      labelTr: '"Allah" lafzı — en sık geçen kelime',
      labelEn: '"Allah" — the most frequent word',
    },
  },
  {
    category: 'sayisal',
    surahRef: 'Çeşitli sûreler · 55. sûre',
    titleTr: 'Allah\'tan Sonra En Çok Geçen Esma: Er-Rahman',
    titleEn: 'The Second Most-Frequent Divine Name: Ar-Rahman',
    bodyTr: 'Allah lafzından sonra Kur\'an\'da en çok geçen Allah\'ın güzel ismi "Rahman" (Çok Merhametli) — yaklaşık 57 kez. Bir sûre adını Rahman\'dan alır (Er-Rahman, 55. sûre) ve onun açılışında üst üste "Rabbinizin hangi nimetlerini yalanlıyorsunuz" sorusu tekrarlanır. Rabbinin merhamet sıfatı anlatı atmosferinde sürekli yankılanır.\n\nℹ Sayım Esma-ül Hüsna\'dan Allah\'ın özel isimleri arasındaki tek tek geçişleri kapsar; "Rab" (الرَّبّ) gibi sıfat-isimler ayrı sayılmaktadır.',
    bodyEn: 'After "Allah", the most-frequent of God\'s beautiful names is "Ar-Rahman" (The All-Merciful) — approximately 57 times. One surah is named after Him (Ar-Rahman, the 55th), opening with the recurring refrain "Which of your Lord\'s favors will you deny?". The attribute of mercy echoes continuously through the narrative.\n\nℹ The count covers occurrences of the personal divine name; attribute-names like "Rab" (Lord) are tallied separately.',
    wowTr: 'Merhamet, Kur\'an\'ın atmosferinde sürekli yankılanır.',
    wowEn: 'Mercy echoes continuously throughout the Quran\'s atmosphere.',
    explore: 'Rahman',
    visualType: 'counter',
    visualData: {
      value: 57,
      suffixTr: 'kez',
      suffixEn: 'times',
      labelTr: 'Esma içinde Allah\'tan sonra en sık geçen isim',
      labelEn: 'After "Allah", the most-frequent divine name',
    },
  },
  {
    category: 'sayisal',
    surahRef: 'Çeşitli sûreler',
    titleTr: 'İsimle Anılan Peygamberler',
    titleEn: 'Prophets Named in the Quran',
    bodyTr: 'Kur\'an, peygamberlerin bir kısmını ismiyle zikreder. İslam geleneğinde toplamda 124.000 peygamber gönderildiği rivayet edilir. İsimle anılanların her biri farklı bir insanlık dersini taşır: sabır, adalet, tevbe, tevekkül... ℹ Zülkifl başta olmak üzere bazı isimlerin peygamberliği klasik tefsirde tartışmalıdır.',
    bodyEn: 'The Quran names a select group of prophets according to general scholarly consensus. Islamic tradition holds that 124,000 prophets were sent in total. Each named prophet carries a distinct lesson: patience, justice, repentance, trust... ℹ The prophethood of some figures, notably Dhul-Kifl, is debated in classical exegesis.',
    wowTr: '124.000\'den 25 — her biri bir ders, hepsi bir sistem.',
    wowEn: '25 out of 124,000 — each a lesson, together a system.',
    explore: 'resul',
    visualType: 'counter',
    visualData: {
      value: 25,
      suffixTr: 'peygamber',
      suffixEn: 'prophets',
      labelTr: 'İsimle anılan — her biri bir ders',
      labelEn: 'Named in the Quran — each a lesson',
    },
  },

  {
    category: 'sayisal',
    surahRef: 'Er-Rahmân · 55',
    titleTr: '"Febieyyi âlâi" — Kur\'an\'ın En Çok Tekrar Eden Ayeti',
    titleEn: '"Febieyyi ala\'i" — The Most Repeated Verse',
    bodyTr: 'Er-Rahman sûresinde "Febieyyi âlâi Rabbikümâ tükezzibân" (Rabbinizin hangi nimetlerini yalanlıyorsunuz?) ayeti bir refrain gibi yinelenir. Kur\'an\'ın en çok tekrar eden ayetidir. Her tekrar farklı bir nimeti saydıktan sonra geliyor — retorik bir mühür gibi.',
    bodyEn: 'In Surah Ar-Rahman, the verse "Febieyyi ala\'i Rabbikuma tukadhdhibhan" (Which of your Lord\'s favors will you deny?) returns like a refrain. It is the most repeated verse in the Quran. Each repetition follows the mention of a different blessing — like a rhetorical seal.',
    wowTr: 'Her biri farklı bir nimeti mühürler.',
    wowEn: 'Each one sealing a different blessing.',
    explore: 'Rabbinizin hangi nimetlerini',
    visualType: 'counter',
    visualData: {
      value: 31,
      suffixTr: 'kez',
      suffixEn: 'times',
      labelTr: 'Aynı ayet — retorik bir mühür',
      labelEn: 'The same verse — a rhetorical seal',
    },
  },
  {
    category: 'sayisal',
    surahRef: 'Çeşitli sûreler',
    titleTr: '14 Secde Ayeti — Okuyucuya Doğrudan Emir',
    titleEn: '14 Prostration Verses — A Direct Command to the Reader',
    bodyTr: 'Kur\'an\'da 14 ayet secde emri içerir; bu ayetleri okuyan ya da duyan kişinin secde etmesi beklenir. Fıkıh sınıflandırması mezheplere göre değişir: Hanefî mezhebinde 14 secde vaciptir; Şâfi\'î, Mâlikî ve Hanbelî mezheplerinde ise genellikle sünnet kabul edilir. Sûre Hac\'da iki adet secde ayeti bulunur — bu onu diğer tüm sûrelerden ayıran tek özelliktir.',
    bodyEn: 'The Quran contains 14 prostration verses; whoever recites or hears them is expected to prostrate. The fiqh classification varies by madhhab: in the Hanafi school all 14 are wajib (obligatory); in the Shafi\'i, Maliki and Hanbali schools they are generally held as sunnah (recommended). Surah Al-Hajj uniquely contains two — the only surah with a double prostration.',
    wowTr: '14 noktada metin durur ve okuyucuya doğrudan seslenir: "Şimdi secde et."',
    wowEn: '14 points where the text pauses and speaks directly to the reader: "Now prostrate."',
    visualType: 'counter',
    visualData: {
      value: 14,
      suffixTr: 'secde ayeti',
      suffixEn: 'verses',
      labelTr: 'Metin durur, okuyucuya doğrudan seslenir',
      labelEn: 'Text pauses, addresses the reader directly',
    },
  },

  // ── YAPISAL ──────────────────────────────────────────────────────────────────
  {
    category: 'yapisal',
    surahRef: 'Et-Tevbe · 9 / En-Neml · 27',
    titleTr: 'Bir Eksik, Bir Fazla — Denge Bozulmaz',
    titleEn: 'One Missing, One Extra — Balance Unbroken',
    bodyTr: 'Et-Tevbe, Kur\'an\'ın tek besmelesiz sûresidir. En-Neml ise hem kendi sûre başında bir besmeleye sahiptir hem de 27:30\'da Hz. Süleyman\'ın Belkıs\'a yazdığı mektubun açılışı olarak ayet içinde bir besmele daha taşır. Toplam besmele sayısı yine 114 eder.',
    bodyEn: 'At-Tawbah is the only surah without an opening Bismillah. An-Naml has a Bismillah both at its own chapter opening and again inside verse 27:30 — as the opening of Solomon\'s letter to the Queen of Sheba. The total still comes to 114.',
    wowTr: 'Eksiklik fazlalıkla dengelendi. Hiçbir şey bozulmadı.',
    wowEn: 'The deficit was offset by surplus. Nothing was broken.',
    explore: '27:30',
  },
  {
    category: 'yapisal',
    surahRef: 'El-Fâtiha · 1',
    titleTr: 'Fatiha\'da "Allah" Lafzı Geçmez',
    titleEn: 'Al-Fatiha Never Uses the Name "Allah"',
    bodyTr: 'Kur\'an\'ın açılış sûresinde "Allah" lafzı hiç geçmez. Allah, güzel isimlerinden dördüyle anılır: Rabb (terbiye eden ve rızık veren), Rahman (çok merhametli), Rahim (daima merhametli), Malik (hüküm ve mülk sahibi).\n\nℹ️ Hafs kıraatinde "Mâlik", bazı diğer kıraatlerde "Melik" okunur.',
    bodyEn: 'The opening surah of the Quran never uses the name "Allah". Allah is mentioned through four of His beautiful names: Rabb (the Sustainer and Provider), Rahman (the All-Merciful), Rahim (the Ever-Merciful), Malik (the Master of all sovereignty).\n\nℹ️ The Hafs recitation reads "Mālik"; some other qira\'at traditions read "Malik" as "Melik" (King).',
    wowTr: 'Fatiha\'da "Allah" lafzı geçmez — Allah, güzel isimleriyle konuşur.',
    wowEn: 'Al-Fatiha never says "Allah" — He speaks through His beautiful names.',
    explore: 'fatiha',
  },
  {
    category: 'yapisal',
    surahRef: 'El-Fâtiha · 1',
    titleTr: 'Fatiha: 7 Ayet, Merkez Tam Ortada',
    titleEn: 'Al-Fatiha: 7 Verses, Center Perfectly Placed',
    bodyTr: 'Fatiha 7 ayettir. Tam ortadaki 4. ayet: "Yalnız sana ibadet eder, yalnız senden yardım dileriz." İnsan-Allah ilişkisinin özü, geometrik merkezde.',
    bodyEn: 'Al-Fatiha has 7 verses. The exact middle (4th) verse: "You alone we worship, You alone we ask for help." The essence of the human-God relationship — at the geometric center.',
    wowTr: 'Anlam, sûrenin tam kalbinde durur.',
    wowEn: 'Meaning stands at the exact heart of the surah.',
    explore: 'Ancak sana kulluk',
    visualType: 'counter',
    visualData: {
      value: 7,
      suffixTr: 'ayet',
      suffixEn: 'verses',
      labelTr: 'Merkez tam ortada — yapısal denge',
      labelEn: 'Center at the exact middle — structural balance',
    },
  },
  {
    category: 'yapisal',
    surahRef: 'El-Kevser · 108',
    titleTr: 'En Kısa Sûre — En Yoğun Teselli',
    titleEn: 'The Shortest Surah — The Most Intense Consolation',
    bodyTr: 'El-Kevser, Kur\'an\'ın en kısa sûresidir: 3 ayet, yaklaşık 10 kelime. Hz. Peygamber\'in oğlunun vefatıyla derin üzüntüye düştüğü dönemde indi.',
    bodyEn: 'Al-Kawthar is the shortest surah in the Quran: 3 verses, approximately 10 words. It was revealed when the Prophet was in deep grief after the death of his son.',
    wowTr: 'En az kelimeyle en derin yara sarılır.',
    wowEn: 'The deepest wound is healed with the fewest words.',
    explore: 'kevser',
  },
  {
    category: 'yapisal',
    surahRef: 'El-Bakara · 2:282',
    titleTr: 'En Uzun Ayet — Bir Borç Sözleşmesi',
    titleEn: 'The Longest Verse — A Debt Contract',
    bodyTr: 'Kur\'an\'ın en uzun ayeti bir borç sözleşmesini düzenler: yazılı kayıt tutulması, iki erkek ya da bir erkek iki kadın tanık, yazanın tarafsız olması. Bu muâmelât ve adalet ilkeleri, tek bir ayet içinde ayrıntılı biçimde düzenlenmiştir.',
    bodyEn: 'The Quran\'s longest verse governs a debt contract: written documentation, two male or one male two female witnesses, an impartial scribe. These principles of transactions and justice are set out in detail within a single verse.',
    wowTr: 'Kur\'an\'ın en uzun ayeti ibadet değil, sözleşme hukuku düzenler.',
    wowEn: 'The Quran\'s longest verse regulates contracts, not worship.',
    explore: '2:282',
    visualType: 'counter',
    visualData: {
      value: 282,
      suffixTr: 'Bakara ayeti',
      suffixEn: 'Al-Baqarah verse',
      labelTr: 'Kur\'an\'ın en uzun ayeti — bir tam sayfa',
      labelEn: "The Quran's longest verse — a full page",
    },
  },
  {
    category: 'yapisal',
    surahRef: '29 sûre',
    titleTr: 'Huruf-i Mukattaâ — 1.400 Yıllık Şifre',
    titleEn: 'Muqatta\'at Letters — A 1,400-Year Cipher',
    bodyTr: '29 sûre gizemli harflerle başlar: Elif-Lâm-Mîm, Hâ-Mîm, Yâ-Sîn... Bu harflerin ne anlama geldiğini kesin olarak kimse bilmiyor. 1.400 yıldır çözülemeyen tek şifre.',
    bodyEn: '29 surahs open with mysterious letters: Alif-Lam-Mim, Ha-Mim, Ya-Sin... No one knows with certainty what they mean. A cipher unsolved for 1,400 years.',
    wowTr: 'Allah\'ın kitabının başında, insanın anlayamadığı harfler durur.',
    wowEn: 'At the start of God\'s book stand letters that humanity cannot decode.',
    explore: '2:1',
  },
  {
    category: 'yapisal',
    surahRef: 'Çeşitli sûreler',
    titleTr: 'Halka Yapısı — Ring Composition',
    titleEn: 'Ring Composition — A Structure Within the Structure',
    bodyTr: 'Raymond Farrin\'in araştırması pek çok sûrenin ring composition (halka) yapısına sahip olduğunu göstermektedir: A-B-C-Merkez-C\'-B\'-A\'. Fatiha bunun en yalın örneğidir. Bu yapı antik edebiyatta biliniyor olsa da Kur\'an\'daki yoğunluğu ve tutarlılığı dikkat çekicidir.',
    bodyEn: 'Raymond Farrin\'s research shows that many surahs follow a ring composition structure: A-B-C-Center-C\'-B\'-A\'. Al-Fatiha is its simplest example. While this structure exists in ancient literature, its density and consistency in the Quran is remarkable.',
    wowTr: 'Dikkat çekici bir yapısal örüntü.',
    wowEn: 'A striking structural pattern.',
    explore: '1:1',
  },

  {
    category: 'yapisal',
    surahRef: 'El-Fâtiha · 1',
    titleTr: 'Fatiha — Her Gün 40 Kez',
    titleEn: 'Al-Fatiha — 40 Times Every Day',
    bodyTr: 'Günde 5 vakit namaz, her rekatta Fatiha okunur. Dünyada her gün milyarlarca kez okunan tek metin. Saat dilimleri nedeniyle dünyanın her saatinde bir yerde namaz vakti girer — Fatiha\'nın okunmadığı bir an yoktur.',
    bodyEn: 'Five daily prayers, Al-Fatiha recited in every rakat. The only text read billions of times every single day. Because of time zones, prayer time is always entering somewhere in the world — there is no moment when Al-Fatiha is not being recited.',
    wowTr: 'En çok okunan metin — tartışmasız, her gün, her kıtada.',
    wowEn: 'The most recited text — undisputed, every day, on every continent.',
    explore: '1:1',
    visualType: 'counter',
    visualData: {
      value: 40,
      suffixTr: 'kez/gün',
      suffixEn: 'times/day',
      labelTr: 'Bir Müslüman ortalama günde okur',
      labelEn: 'Average daily recitation per Muslim',
    },
  },
  {
    category: 'yapisal',
    surahRef: 'Çeşitli sûreler',
    titleTr: 'Kur\'an Kendi Okunuşunu Emreder',
    titleEn: 'The Quran Commands Its Own Recitation',
    bodyTr: 'Müzzemmil sûresi (73:4): "Kur\'an\'ı tertil üzere oku." Kur\'an, nasıl okunacağını bizzat emreden tek kutsal kitaptır. Bu ayet, tecvid ilminin Kur\'anî temelidir.',
    bodyEn: 'Al-Muzzammil (73:4): "Recite the Quran with measured recitation." The Quran is the only scripture that commands how it must be read. This verse is the Quranic foundation of the science of tajweed.',
    wowTr: 'Okunuş kuralları sonradan icat edilmedi — metnin içinde emredildi.',
    wowEn: 'Recitation rules were not invented later — they were commanded within the text itself.',
    explore: '73:4',
  },
  {
    category: 'yapisal',
    surahRef: 'Et-Tevbe · 9',
    titleTr: 'Et-Tevbe\'nin Sırrı — Neden Besmelesiz?',
    titleEn: 'The Mystery of At-Tawbah — Why No Bismillah?',
    bodyTr: 'Et-Tevbe, Kur\'an\'ın 114 sûresinden besmelesiz başlayan tek sûredir. Klasik alimler üç farklı görüş öne sürmüştür: münafıklara hitap ettiği için, azap hükümlerini içerdiği için ya da Enfal ile tek sûre sayılması gerektiği için. 1.400 yıldır kesin cevap yok.',
    bodyEn: 'At-Tawbah is the only one of the Quran\'s 114 surahs that begins without Bismillah. Classical scholars have proposed three explanations: it addresses hypocrites, contains punishment rulings, or should be counted as one surah with Al-Anfal. No definitive answer in 1,400 years.',
    wowTr: '1.400 yıllık soru, 3 cevap, kesin bilgi yalnızca Allah\'ta.',
    wowEn: 'A 1,400-year question, 3 answers, certain knowledge with God alone.',
    explore: '9:1',
  },
  {
    category: 'yapisal',
    surahRef: 'Çeşitli sûreler',
    titleTr: 'Kur\'an\'da Sıra Ne Uzunluk Ne Kronoloji',
    titleEn: 'The Quran\'s Order: Neither Length Nor Chronology',
    bodyTr: 'Sûreler ne uzundan kısaya (genel eğilim var ama istisnalar çok), ne kronolojik (ilk inen Alak, mushafta 96. sırada), ne alfabetik. İslam alimleri bu sıralamanın vahiyle belirlendiğini (tevkifî) kabul eder. Modern araştırmacılar ise tematik gruplamalar ve sûreler arası bağlantılar keşfetmeye devam ediyor.',
    bodyEn: 'Surahs are not ordered by length (general trend, many exceptions), chronology (Al-Alaq — first revealed — is 96th in the mushaf), or alphabet. Islamic scholars hold that the order was divinely determined (tawqifi). Modern researchers continue to uncover thematic groupings and inter-surah connections.',
    wowTr: 'Sıralama insan mantığına uymayan bir düzene sahip — ama her inceleme yeni bir bağlantı ortaya çıkarıyor.',
    wowEn: 'The ordering defies human logic — yet every closer look reveals a new connection.',
    explore: '96:1',
  },
  {
    category: 'yapisal',
    surahRef: 'El-Bakara · 2 / El-Kevser · 108',
    titleTr: 'En Uzun Sûre, En Kısa Sûre — 95\'e 1',
    titleEn: 'Longest Surah, Shortest Surah — 95 to 1',
    bodyTr: 'Bakara 286 ayet, Kevser 3 ayet. Oran 95\'e 1. Biri eksik, diğeri fazla hissettirmiyor. Her ikisi de tam.',
    bodyEn: 'Al-Baqara has 286 verses; Al-Kawthar has 3. Ratio: 95 to 1. Neither feels lacking, neither feels excessive. Both are complete.',
    wowTr: '3 ayetle teselli, 286 ayetle şeriat — ikisi de eksiksiz.',
    wowEn: '3 verses of consolation, 286 verses of law — both complete.',
    explore: '108:1',
  },
  {
    category: 'yapisal',
    surahRef: 'El-Bakara · 2:281, El-Mâide · 5:3',
    titleTr: 'Son İnen Ayet — Tartışma Hâlâ Sürüyor',
    titleEn: 'Last Verse Revealed — Debate Still Open',
    bodyTr: 'Kur\'an\'ın ilk inen ayeti belli: Alak 96:1. Ama son ayet tartışmalı. Bazı sahabi rivayetleri Bakara 2:281\'i, bazıları Mâide 5:3\'ü, bazıları Bakara 2:278\'i işaret ediyor. 1.400 yıldır kesin bir konsensüs yok.',
    bodyEn: 'The first verse revealed is known: Al-Alaq 96:1. But the last verse is disputed. Some companion narrations point to Al-Baqara 2:281, others to Al-Ma\'idah 5:3, others to Al-Baqara 2:278. No definitive consensus in 1,400 years.',
    wowTr: 'İlk ayet belli, son ayet tartışmalı — bu da bir dürüstlük.',
    wowEn: 'The first is certain, the last is debated — that too is a form of honesty.',
    explore: '2:281',
  },

  {
    category: 'yapisal',
    surahRef: 'Çeşitli sûreler',
    titleTr: 'Kur\'an Bir Hukuk Kitabı Değil',
    titleEn: 'The Quran Is Not a Book of Law',
    bodyTr: 'Kur\'an\'ın bir "hukuk kitabı" olduğu yaygın bir yanılgıdır. Ayetlerin büyük çoğunluğu ibadet, muamelat ve ceza hukuku değil; ahlak, kıssa, tefekkür, dua ve evren üzerinedir.',
    bodyEn: 'A common misconception is that the Quran is a "book of law." The vast majority of its verses are not about worship rules, civil transactions, or criminal law — they cover ethics, narrative, contemplation, prayer, and the universe.',
    wowTr: 'Hukuk Kur\'an\'ın bir bölümü — ruh, anlam ve evren geri kalanı.',
    wowEn: 'Law is one part of the Quran — soul, meaning, and universe are the rest.',
    explore: '2:282',
    visualType: 'counter',
    visualData: {
      value: 6236,
      suffixTr: 'ayet',
      suffixEn: 'verses',
      labelTr: 'Çoğu ahlak, kıssa, tefekkür, dua',
      labelEn: 'Mostly ethics, narrative, reflection, prayer',
    },
  },
  {
    category: 'yapisal',
    surahRef: 'Eş-Şems · 91',
    titleTr: 'Kur\'an\'ın En Yoğun Yemin Dizisi — Art Arda 7 Yemin',
    titleEn: 'The Quran\'s Most Intense Oath Sequence — 7 Consecutive Oaths',
    bodyTr: 'Şems sûresi art arda 7 yemin ile açılır: güneşe, aydınlığına, aya, gündüze, geceye, gökyüzüne ve yere. Her yemin bir sonrakini inşa eder; kozmosu sahne yapar. Hemen ardından insanın ruhuna yemin gelir — kozmik dekor "nefs"e (kendi öz benliğe) iner. Kur\'an\'ın yemin içeren sûreleri arasında bu art arda yoğunluk nadirdir.\n\nℹ Diyanet / klasik tefsir konvansiyonu: 7 ana zarf yemini. Bazı kompozisyon analizleri bağlı zarfları ayrı sayıp 11\'e kadar çıkarır; bu okuma tartışmalıdır.',
    bodyEn: 'Surah Ash-Shams opens with 7 consecutive oaths: by the sun, its radiance, the moon, the day, the night, the sky, and the earth. Each oath builds on the previous, staging the cosmos. Immediately after, an oath by the human soul follows — the cosmic stage descends to the "nafs" (inner self). Among the Quran\'s oath-bearing surahs, such density is rare.\n\nℹ Diyanet / classical tafsir convention: 7 primary adverbial oaths. Some compositional analyses count bound adverbs separately, reaching up to 11 — this reading is debated.',
    wowTr: 'Kozmosu sahne yapar, sonra insan ruhunu merkeze alır.',
    wowEn: 'Stages the cosmos, then centers the human soul.',
    visualType: 'counter',
    visualData: {
      value: 7,
      suffixTr: 'art arda yemin',
      suffixEn: 'consecutive oaths',
      labelTr: 'Kozmosu sahne yapar, sonra nefse iner',
      labelEn: 'Stages the cosmos, then descends to the self',
    },
  },

  // ── PEYGAMBERLER ─────────────────────────────────────────────────────────────
  {
    category: 'peygamberler',
    surahRef: 'Meryem · 19',
    titleTr: 'Kur\'an\'da Adıyla Anılan Tek Kadın',
    titleEn: 'The Only Woman Named in the Quran',
    bodyTr: 'Hz. Meryem, Kur\'an\'da adıyla anılan tek kadındır. Adına ayrılmış bir sûre vardır: Meryem Sûresi (19. sûre).',
    bodyEn: 'Mary (Maryam) is the only woman mentioned by name in the Quran. An entire surah bears her name: Surah Maryam (19th surah).',
    wowTr: 'Bir kadın, Kur\'an\'da adıyla ölümsüzleşti.',
    wowEn: 'One woman was immortalized by name in the Quran.',
    explore: 'meryem',
  },
  {
    category: 'peygamberler',
    surahRef: 'Çeşitli sûreler',
    titleTr: 'Hz. Musa — En Çok Anılan Peygamber: 136',
    titleEn: 'Prophet Moses — Most Mentioned: 136 Times',
    bodyTr: 'Hz. Musa, Kur\'an\'da 136 kez adıyla geçen en çok anılan peygamberdir. Hz. Muhammed ise 5 kez (4 kez "Muhammed", 1 kez "Ahmed").\n\nℹ️ Bu sayı "Musa" isminin doğrudan geçtiği yerleri kapsar; zamir ve dolaylı atıflar dahil değildir. Kaynak: Leeds Üniversitesi Kur\'ân Korpusu (corpus.quran.com).',
    bodyEn: 'Prophet Moses (Musa) is the most mentioned prophet by name — 136 times. Prophet Muhammad appears 5 times (4 as "Muhammad", once as "Ahmad" in Al-Saff 61:6).\n\nℹ️ This count covers direct occurrences of the name "Musa" only; pronouns and indirect references are not included. Source: University of Leeds Quranic Arabic Corpus (corpus.quran.com).',
    wowTr: 'Kur\'an\'da en uzun hikâye, Kur\'an\'ı getiren peygamberin hikâyesi değildir.',
    wowEn: 'The longest story in the Quran is not the story of the prophet who brought it.',
    explore: 'musa',
    visualType: 'counter',
    visualData: {
      value: 136,
      suffixTr: 'kez',
      suffixEn: 'times',
      labelTr: 'Kur\'an\'da en çok anılan peygamber',
      labelEn: 'The most-mentioned prophet in the Quran',
    },
  },
  {
    category: 'peygamberler',
    surahRef: 'Çeşitli sûreler',
    titleTr: 'Hz. İsa, Hz. Muhammed\'den Daha Fazla Anılır',
    titleEn: 'Jesus Is Mentioned More Than Muhammad',
    bodyTr: 'Hz. İsa Kur\'an\'da 25 kez adıyla geçer; Hz. Muhammed ise "Muhammed" olarak 4 kez, "Ahmed" olarak 1 kez (Saff 61:6). İslam tefsirine göre "Ahmed" ismi Hz. Muhammed\'in bir diğer adıdır — bu okuma klasik tefsir görüşüdür.',
    bodyEn: 'Jesus (Isa) is mentioned by name 25 times in the Quran; Muhammad appears 4 times as "Muhammad" and once as "Ahmad" (As-Saff 61:6). In Islamic exegesis, "Ahmad" is understood as another name of Prophet Muhammad — this reading is the classical tafsir position.',
    wowTr: 'İslam\'ın kitabı, İsa\'yı Muhammed\'den daha sık anar.',
    wowEn: 'The book of Islam mentions Jesus more often than Muhammad.',
    explore: 'isa',
    visualType: 'counter',
    visualData: {
      value: 25,
      suffixTr: 'kez',
      suffixEn: 'times',
      labelTr: '"Hz. İsa" — "Muhammed" 4 kez ile karşılaştırın',
      labelEn: '"Jesus" — compare with "Muhammad" 4 times',
    },
  },
  {
    category: 'peygamberler',
    surahRef: 'Yûsuf · 12',
    titleTr: 'Yûsuf: "En Güzel Kıssa" Tek Sûrede',
    titleEn: 'Joseph: "The Best of Stories" in One Surah',
    bodyTr: 'Hz. Yûsuf\'un hikâyesi, Kur\'an\'da tamamen tek bir sûrede anlatılır — 111 ayet boyunca kesintisiz. Kur\'an bu hikâyeye "ahsenü\'l-kasas" (kıssaların en güzeli) adını verir.',
    bodyEn: 'The story of Prophet Joseph is told in a single, unbroken surah — 111 consecutive verses. The Quran itself names it "ahsan al-qasas" — the best of all stories.',
    wowTr: 'Tek nefeste söylenen, tek sûrede tamamlanan kıssa.',
    wowEn: 'A story told in a single breath, completed in a single surah.',
    explore: 'yusuf',
  },
  {
    category: 'peygamberler',
    surahRef: 'El-Ankebût · 29:14',
    titleTr: 'Hz. Nuh\'un 950 Yılı — Ankebût 29:14',
    titleEn: 'Noah\'s 950 Years — Al-Ankabut 29:14',
    bodyTr: 'Ankebût 29:14 şöyle der: "Nûh\'u kavmine gönderdik; aralarında bin yıldan elli yıl eksik kaldı." Ayet lafzen kavmi arasında kalma süresini verir; klasik tefsirin çoğunluğu bunu tebliğ süresi olarak yorumlar.',
    bodyEn: 'Al-Ankabut 29:14 states: "We sent Noah to his people, and he remained among them a thousand years less fifty." The verse literally gives the duration he remained with his people; most classical commentators interpret this as his preaching duration.',
    wowTr: '950 yıl — ayetin, kavmi arasında kalma süresi olarak verdiği belirgin bir rakam.',
    wowEn: '950 years — a striking figure the verse gives for his time among his people.',
    explore: 'nuh',
    visualType: 'counter',
    visualData: {
      value: 950,
      suffixTr: 'yıl',
      suffixEn: 'years',
      labelTr: 'Halkı arasında geçirdiği süre',
      labelEn: 'Duration spent among his people',
    },
  },
  {
    category: 'peygamberler',
    surahRef: 'El-Ahzâb · 33:40',
    titleTr: 'Hz. Muhammed\'in Adı: 5 Kez',
    titleEn: 'Muhammad\'s Name: 5 Times',
    bodyTr: 'Hz. Muhammed\'in adı Kur\'an\'da toplamda 5 kez geçer: 4 kez "Muhammed" (Al-i İmran 3:144, Ahzab 33:40, Muhammed 47:2, Fetih 48:29), 1 kez "Ahmed" (Saf 61:6). Geri kalan ayetlerde ise doğrudan isim yerine "Ey Peygamber" veya "Ey Resul" hitabı kullanılır (~15 kez).',
    bodyEn: 'The name of the Prophet appears 5 times in the Quran: 4 times as "Muhammad" (3:144, 33:40, 47:2, 48:29) and once as "Ahmad" (61:6). In the remaining verses, direct address takes the form "O Prophet" or "O Messenger" (~15 times).',
    wowTr: 'İsim 5, ses binlerce. Ağırlık seste.',
    wowEn: 'Name: 5. Voice: thousands. The weight is in the voice.',
    explore: 'muhammed',
  },

  {
    category: 'peygamberler',
    surahRef: 'El-A\'râf · 7:22',
    titleTr: 'Hz. Âdem — Günahta İkisi de Eşit',
    titleEn: 'Adam — Both Equally Responsible',
    bodyTr: 'Tevrat\'ta Hz. Âdem\'in suçu büyük ölçüde Hz. Havva\'ya yüklenir (Tekvin 3). Kur\'an\'da ise her ikisi birlikte yanılır, her ikisi birlikte pişman olur, her ikisi birlikte af diler. A\'raf 7:22\'de fiiller ikildir: "aldattı", "tattılar", "utandılar", "dediler ki: Rabbimiz, kendimize zulmettik."',
    bodyEn: 'In the Torah, the blame falls largely on Eve (Genesis 3). In the Quran, both err together, both repent together, both seek forgiveness together. In A\'raf 7:22, every verb is dual: "deceived them both," "they tasted," "they felt ashamed," "they said: Our Lord, we have wronged ourselves."',
    wowTr: 'Tevrat bir suçlu arar — Kur\'an ikisini de eşit tutar.',
    wowEn: 'The Torah seeks one culprit — the Quran holds both equally.',
    explore: 'adem',
  },
  {
    category: 'peygamberler',
    surahRef: 'El-Enbiyâ · 21:87',
    titleTr: 'Hz. Yunus — Hatası Anlatılan Peygamber',
    titleEn: 'Jonah — The Prophet Whose Error Is Told',
    bodyTr: 'Kur\'an peygamberleri idealize etmez. Hz. Yunus, iznini almadan kavmini terk eder ve balığın karnında "Seni tenzih ederim, ben zalimlerden oldum" diye niyaz eder (Enbiyâ 21:87). İzinsiz ayrılış, pişmanlık, dua, kurtuluş — hepsi açıkça anlatılır. Bu, kitabın insani dürüstlüğünün belgesidir.',
    bodyEn: 'The Quran does not idealize its prophets. Jonah leaves his people without permission and calls out from inside the whale: "Glory be to You, I have been among the wrongdoers" (Al-Anbiya 21:87). Unauthorized departure, remorse, prayer, salvation — all told plainly. This is the book\'s human honesty on record.',
    wowTr: 'Kur\'an peygamberini yüceltmek için değil, doğruyu anlatmak için var.',
    wowEn: 'The Quran exists not to glorify its prophet, but to tell the truth.',
    explore: 'yunus',
  },
  {
    category: 'peygamberler',
    surahRef: 'Meryem · 19 / İncil',
    titleTr: 'Hz. Meryem — Bazı Havarilerden Daha Çok Anılıyor',
    titleEn: 'Mary — More Mentioned Than Some Apostles',
    bodyTr: 'Hz. Meryem Kur\'an\'da 34 ayette geçer ve adını taşıyan bir sûre vardır. İncil\'deki bazı havariler (Bartholomew, Thaddaeus) neredeyse hiç anılmıyor. İslam\'ın kutsal kitabında bir kadın, Hristiyan geleneğin bazı erkek azizlerinden daha fazla yer buluyor.',
    bodyEn: 'Mary appears in 34 verses of the Quran and has an entire surah named after her. Some apostles in the Bible (Bartholomew, Thaddaeus) are barely mentioned. In Islam\'s scripture, a woman holds more space than some male saints of Christian tradition.',
    wowTr: 'En büyük erkek dinlerin kitabında, bir kadın tarihin en onurlu yerinde.',
    wowEn: 'In the book of the world\'s largest faith, a woman holds one of history\'s most honored places.',
    explore: 'meryem',
  },
  {
    category: 'peygamberler',
    surahRef: 'El-Ahzâb · 33:37',
    titleTr: 'Zeyd ibn Hârise — Adıyla Anılan Tek Sahabe',
    titleEn: 'Zayd ibn Harithah — The Only Companion Named by Name',
    bodyTr: 'Kur\'an\'da adıyla zikredilen tek sahabe Zeyd ibn Hârise\'dir (Ahzâb 33:37). Hz. Peygamber\'in azatlı kölesi ve evlatlığıydı. O ayet, evlatlık kurumuna dair cahiliye geleneğini kökten değiştiren bir hüküm taşıyordu — tarihsel olayı tescillemek için isim zorunluydu. ℹ Genel kanıya göre diğer sahabeler isimleriyle geçmez; ancak bazı rivayetlerde dolaylı atıflar tartışılmaktadır.',
    bodyEn: 'The only companion named by name in the Quran is Zayd ibn Harithah (Al-Ahzab 33:37). He was the Prophet\'s freed slave and adopted son. That verse carried a ruling that fundamentally reformed the pre-Islamic institution of adoption — the historical event required the name. ℹ The scholarly consensus holds no other companion is named; some indirect references remain debated.',
    wowTr: 'Kur\'an, binlerce sahabe arasından yalnızca birinin adını zikretmeyi seçti.',
    wowEn: 'Among thousands of companions, the Quran chose to name only one.',
    explore: 'zeyd',
  },
  {
    category: 'peygamberler',
    surahRef: 'Çeşitli sûreler',
    titleTr: 'Hz. İbrahim — Duaları Öne Çıkan Peygamberlerden',
    titleEn: 'Abraham — Among the Prophets Whose Prayers Stand Out',
    bodyTr: 'Kur\'an\'da Hz. İbrahim\'in ağzından 10\'dan fazla farklı dua aktarılır. Duaları sayı ve çeşitlilik bakımından Kur\'an\'da en belirgin biçimde aktarılan peygamberler arasındadır (Hz. Musa\'nın da birçok farklı duası zikredilir). Her biri farklı bir insani ihtiyacı seslendiriyor: çocuk, barış, hidayet, rızık, af...',
    bodyEn: 'More than 10 distinct supplications of Prophet Abraham are recorded in the Quran. His prayers stand out in number and variety — he is among the prophets whose supplications the Quran preserves most prominently (alongside Moses, who is also given multiple distinct prayers). Each voices a different human need: offspring, peace, guidance, provision, forgiveness...',
    wowTr: 'Kur\'an\'da duaları en belirgin biçimde aktarılan peygamberlerden biri.',
    wowEn: 'Among the prophets whose prayers the Quran records most prominently.',
    explore: 'ibrahim',
  },

  // ── AZ BİLİNEN ───────────────────────────────────────────────────────────────
  {
    category: 'azBilinen',
    surahRef: 'El-Alak · 96:1',
    titleTr: 'İlk Ayet Okumayı Emreder',
    titleEn: 'First Verse Commands Reading',
    bodyTr: 'Kur\'an\'ın ilk inen ayeti "İkra" (Oku) emriyle başlar. 7. yüzyıl Arabistan\'ında okuryazarlık oranı son derece düşüktü — vahyin ilk emri okumaktı.',
    bodyEn: 'The first verse ever revealed begins with "Iqra" (Read). Literacy rates in 7th-century Arabia were extremely low — and the very first command of revelation was to read.',
    wowTr: 'Bir ümmi topluma gelen ilk emir: Oku.',
    wowEn: 'The first command to an illiterate society: Read.',
    explore: '96:1',
  },
  {
    category: 'azBilinen',
    surahRef: 'El-Kehf · 18:25',
    titleTr: 'Ashab-ı Kehf: 300 = 309',
    titleEn: 'People of the Cave: 300 = 309',
    bodyTr: 'Kehf sûresi, mağara ashâbının "üç yüz yıl kaldığını, buna dokuz eklediklerini" söyler (18:25). Yaygın bir okuma: 300 güneş yılı, kamer takvimine göre yaklaşık 309 yıla denk gelir (300 güneş yılı ≈ 309 kamer yılı) — ayet "üç yüz"e "dokuz" ekleyerek bu farka işaret eder. Kimi müfessirler ise ifadeyi süre hakkındaki farklı görüşlerin aktarımı olarak okur; ayet "Allah ne kadar kaldıklarını en iyi bilendir" (18:26) ile sürer.',
    bodyEn: 'Surah Al-Kahf says the cave dwellers "stayed three hundred years and added nine" (18:25). A common reading: 300 solar years correspond to about 309 lunar years (300 solar ≈ 309 lunar) — the verse adds "nine" to "three hundred," pointing to this difference. Some exegetes instead read it as reporting differing views on the duration; the verse continues, "Say: Allah knows best how long they stayed" (18:26).',
    wowTr: '300 güneş yılı, kamerî takvimde ~309 yıla denk gelir — ayetteki "üç yüz ve dokuz"un bir okuması.',
    wowEn: '300 solar years ≈ 309 lunar years — one reading of "three hundred and nine."',
    explore: 'kehf',
    visualType: 'counter',
    visualData: {
      value: 309,
      suffixTr: 'yıl',
      suffixEn: 'years',
      labelTr: 'Mağarada uyudukları süre',
      labelEn: 'Duration they slept in the cave',
    },
  },
  {
    category: 'azBilinen',
    surahRef: 'El-Alak · 96:15-16',
    titleTr: '"Alın" — Beynin Yalan Merkezi',
    titleEn: '"Forehead" — The Brain\'s Lying Center',
    bodyTr: 'Kur\'an yalancıyı "alından" yakalar (Alak 96:15-16). Bazı çağdaş yorumlar bunu prefrontal korteksle (alnın hemen arkası) ilişkilendirir; ancak \'beynin yalan merkezi\' olduğu ve fMRI ile kesin tespit edildiği iddiası nörobilimde tartışmalıdır.\n\nℹ️ Klasik tefsirde "nâsiye" rezalet ve zilletin mecazi sembolüdür — Taberi ve diğer müfessirler bu ifadeyi anatomiyle ilişkilendirmez. Nörobilim bağlantısı çağdaş bir okumadır.',
    bodyEn: 'The Quran says the liar will be seized by the "forelock" (Al-Alaq 96:15-16). Some contemporary readings associate this with the prefrontal cortex (just behind the forehead); but the claim that it is the brain\'s \'lying center,\' definitively identified by fMRI, is contested in neuroscience.\n\nℹ️ In classical commentary, "nāsiyah" is a metaphor for disgrace and humiliation — classical scholars did not connect it to brain anatomy. The neuroscience parallel is a contemporary reading.',
    wowTr: 'Klasik tefsir nâsiyeyi rezalet mecazı okur; alın-beyin bağlantısı çağdaş bir tefekkür okumasıdır.',
    wowEn: 'Classical commentary reads nāsiyah as a metaphor for disgrace; the forehead–brain link is a contemporary reflection.',
    explore: '96:15',
  },
  {
    category: 'azBilinen',
    surahRef: 'El-Kıyâme · 75:4',
    titleTr: '"Parmak Uçları" — Benzersiz Kimlik',
    titleEn: '"Fingertips" — Unique Identity',
    bodyTr: '"Parmak uçlarını bile yeniden düzeltmeye kadiriz" (Kıyâme 75:4). Tüm organlar arasında neden özellikle parmak uçları? 1880\'lerde belgelendi: Her insanın parmak izi eşsizdir. İkizlerde bile.\n\nℹ️ Klasik tefsirde bu ayet, kıyamette Allah\'ın yeniden yaratma gücünü anlatır — parmak uçları küçüklük ve inceliğin sembolü olarak kullanılır. Parmak izi benzersizliği bağlantısı çağdaş bir okumadır.',
    bodyEn: '"We are able to restore even his fingertips" (Al-Qiyama 75:4). Of all body parts, why specifically fingertips? Documented in the 1880s: every person\'s fingerprint is unique. Even in identical twins.\n\nℹ️ In classical commentary, this verse describes God\'s power to resurrect — fingertips are used as a symbol of intricacy and smallness. The fingerprint uniqueness connection is a contemporary reading.',
    wowTr: 'Klasik tefsir bunu yeniden-yaratma gücünün sembolü okur; parmak izi benzersizliği çağdaş bir okumadır.',
    wowEn: 'Classical commentary reads this as a symbol of resurrection power; fingerprint uniqueness is a contemporary reading.',
    explore: '75:4',
  },
  {
    category: 'azBilinen',
    surahRef: 'Er-Rahmân · 55',
    titleTr: '"Rahman" — Kur\'an\'ın Merkeze Aldığı İsim',
    titleEn: '"Rahman" — A Name the Quran Placed at the Center',
    bodyTr: 'Kur\'an, "Rahman" ismini öyle bir merkeze aldı ki bu isim hem dile hem teolojiye kalıcı biçimde yerleşti. Her sûrenin başında, Fatiha\'da, Rahman sûresinin tamamında — bu isim Kur\'an\'ın dokusuna işlendi.',
    bodyEn: 'The Quran placed "Rahman" so centrally that it became permanently embedded in both language and theology. At the start of every surah, in Al-Fatiha, throughout Surah Ar-Rahman — this name was woven into the very fabric of the Quran.',
    wowTr: 'Kur\'an\'ın en çok tekrar eden isimlerinden biri — her sûrenin açılışında.',
    wowEn: 'One of the most repeated names in the Quran — at the opening of every surah.',
    explore: 'rahman',
  },
  {
    category: 'azBilinen',
    surahRef: 'El-Fâtiha · 1',
    titleTr: 'Fatiha: Allah Kuluna Nasıl Döneceğini Öğretti',
    titleEn: 'Al-Fatiha: God Taught His Servant How to Return to Him',
    bodyTr: 'Fatiha, Kur\'an\'ın ilk sûresi ve namazın ayrılmaz parçasıdır. İnsan her rekatta bu sûreyi okur — ama okuduğu kelimeler Allah\'ın vahyidir. Kul, Rabbi\'nin kendisine öğrettiği sözlerle Rabbine seslenir. Hadis-i kudsîde Allah şöyle buyurur: "Namazı kulumla aramda paylaştırdım; yarısı benim, yarısı kulumun..." (Müslim).',
    bodyEn: 'Al-Fatiha is the opening surah of the Quran and the pillar of every prayer. A person recites it in every unit of prayer — yet the words they speak are God\'s own revelation. The servant calls upon his Lord using the words his Lord taught him. In a hadith qudsi, God says: "I have divided the prayer between Myself and My servant into two halves..." (Muslim).',
    wowTr: 'Allah, kuluna O\'na nasıl döneceğini bizzat öğretti.',
    wowEn: 'God taught His servant how to turn back to Him — in His own words.',
    explore: '1:5',
  },
  {
    category: 'azBilinen',
    surahRef: 'El-Hucurât · 49',
    titleTr: 'Hucurât: Toplumsal Ahlâkın 18 Ayetlik Çerçevesi',
    titleEn: 'Hujurat: A Social-Ethical Framework in 18 Verses',
    bodyTr: 'Hucurât sûresi 18 ayette şunları ele alır: ırkçılığın yasaklanması, dedikodu, lakap takma, zan, kardeşlik. Klasik tefsirde (Râzî, Kurtubî) ahlâkî bir çerçeve olarak okunmuştur; modern sosyoloji terminolojisiyle paralellik kurmak çağdaş bir okumadır.',
    bodyEn: 'Surah Al-Hujurat addresses in 18 verses: prohibition of racism, gossip, labeling, suspicion, and commands of brotherhood. Classical commentators (Razi, Qurtubi) read it as a moral-ethical framework; the parallel with modern sociological terminology is a contemporary reading.',
    wowTr: 'Klasik bir ahlâk çerçevesi — 18 ayette.',
    wowEn: 'A classical moral framework — in 18 verses.',
    explore: 'hucurat',
  },
  {
    category: 'azBilinen',
    surahRef: 'Fussilet · 41:11, Çeşitli sûreler',
    titleTr: 'Kur\'an\'da Modern Bilim Terimleriyle Paralel Okunan Kelimeler',
    titleEn: 'Quranic Words Read in Parallel With Modern Science',
    bodyTr: '"Duhân" (duman/gaz, Fussilet 41:11) modern kozmolojinin nebula kavramıyla paralel okunmuştur. "Zerre" klasik tefsirde "küçük tanecik / karınca" anlamındadır; "atom" paraleli çağdaş bir okumadır. "Ufuk" kavramı için de modern fiziğe paraleller kurulmuştur. Bu paralellikler felsefî gözlemdir; Kur\'an\'ın bilimsel teori öngördüğü iddiası taşımaz.',
    bodyEn: '"Dukhan" (smoke/gaseous matter, Fussilet 41:11) is read in parallel with modern cosmology\'s nebular concept. In classical tafsir "dharra" means "small particle / ant"; the "atom" parallel is a contemporary reading. Similar parallels have been drawn for "ufuq" and modern physics. These are philosophical observations, not claims that the Quran predicted scientific theory.',
    wowTr: 'Klasik kelimeler — modern paraleller (felsefî gözlem).',
    wowEn: 'Classical words — modern parallels (philosophical observation).',
    explore: '41:11',
  },
  {
    category: 'azBilinen',
    surahRef: 'Çeşitli sûreler',
    titleTr: 'Kur\'an Coğrafyayı Değil Mesajı Konuşur',
    titleEn: 'The Quran Speaks Message, Not Geography',
    bodyTr: 'Arabistan\'da inen bir kitap olmasına rağmen Kur\'an coğrafi detaylara odaklanmaz. "Deve" Arapçada 6 farklı sözcükle ifade edilebilir — Kur\'an bunları çok sınırlı kullanır. Kum, çöl, oasis gibi dönem Arabistanı\'nın olmazsa olmazları arka planda kalır; evrensel kavramlar öne çıkar.',
    bodyEn: 'Despite being revealed in Arabia, the Quran does not dwell on geographical detail. "Camel" can be expressed in 6 Arabic words — the Quran uses them sparingly. Sand, oasis, and other Arabian staples fade into the background; universal concepts take center stage.',
    wowTr: 'Evrensel bir kitap, yerel bir coğrafyada indi — ve coğrafyayı aşmayı seçti.',
    wowEn: 'A universal book descended in a local geography — and chose to transcend it.',
    explore: '21:107',
  },
  {
    category: 'azBilinen',
    surahRef: 'Çeşitli sûreler',
    titleTr: 'Kur\'an\'ın Sesi — Hiçbir Dile Tam Çevrilemiyor',
    titleEn: 'The Quran\'s Voice — Untranslatable Into Any Language',
    bodyTr: '"Rahman" Türkçe\'ye tam geçmiyor. "Takva" tek kelimeyle karşılanamıyor. "Sabr" yalnızca sabır değil. Dilbilimciler Kur\'an Arapçasının yüzlerce kavramının başka dillerde tam karşılığı olmadığını söylüyor. Bu yüzden Kur\'an\'ın "çevirisi" değil, "meali" var.',
    bodyEn: '"Rahman" has no exact English equivalent. "Taqwa" cannot be captured in one word. "Sabr" is not simply patience. Linguists note that hundreds of Quranic Arabic concepts have no full equivalent in other languages. This is why the Quran has "translations of meaning," not translations.',
    wowTr: 'Her dile tercüme edildi, hiçbirine tam sığmadı.',
    wowEn: 'Translated into every language. Fully contained by none.',
    explore: 'rahman',
  },
  {
    category: 'azBilinen',
    surahRef: 'El-Asr · 103',
    titleTr: 'El-Asr — 14 Kelime, Tüm Rehber',
    titleEn: 'Al-Asr — 14 Words, Complete Guide',
    bodyTr: 'El-Asr: 3 ayet, yaklaşık 14 kelime. İmam Şafii şöyle buyurdu: "İnsanlar bu sûreyi iyice düşünseydi, bu onlara yeterdi." (Beyhaki, Şuabu\'l-İman) Zaman yemini, insanın hüsranı, kurtuluşun 4 şartı (iman, amel, hak, sabır) — hepsi 3 ayette.',
    bodyEn: 'Al-Asr: 3 verses, approximately 14 words. Imam al-Shafi\'i said: "If people pondered this surah, it would be sufficient for them." (Al-Bayhaqi, Shu\'ab al-Iman) An oath by time, humanity\'s loss, and the 4 conditions of salvation (faith, deeds, truth, patience) — all in 3 verses.',
    wowTr: '14 kelime, tüm insanlık rehberi.',
    wowEn: '14 words, a complete guide for all humanity.',
    explore: 'asr',
  },
  {
    category: 'azBilinen',
    surahRef: 'Çeşitli sûreler',
    titleTr: 'Kur\'an\'ın Kendine Verdiği Onlarca İsim',
    titleEn: 'The Many Names the Quran Gives Itself',
    bodyTr: 'Kur\'an kendini onlarca farklı isimle tanımlar: Furkan (ayırt eden), Zikir (hatırlatıcı), Hüda (rehber), Şifa (iyileştirici), Nur (ışık), Kerim (cömert), Mübîn (açıklayan)... Her isim farklı bir işlev, farklı bir perspektif.',
    bodyEn: 'The Quran uses dozens of different names for itself: Furqan (the criterion), Dhikr (the reminder), Huda (the guide), Shifa (the healer), Nur (the light), Karim (the generous), Mubin (the clarifier)... Each name is a different function, a different perspective.',
    wowTr: 'Allah\'ın kitabı kendini onlarca farklı isimle tanımlıyor.',
    wowEn: 'God\'s book defines itself — in dozens of different names.',
    explore: 'furkan',
  },
  // ── KUR'ÂN'IN KENDİ İSİMLERİ (her biri için derinlik kartı) ─────────────────
  {
    category: 'azBilinen',
    surahRef: 'Bakara · 2:2, Âl-i İmrân · 3:138',
    titleTr: '"Hüden li\'l-Müttakîn" — Kur\'ân\'ın İlk Adı: Hidâyet',
    titleEn: '"Hudan li\'l-Muttaqīn" — The Qur\'an\'s First Name: Guidance',
    bodyTr: 'Bakara 2:2\'de Kur\'ân kendini tanımlarken seçtiği ilk kelime: "hüden" (hidâyet/rehberlik). Âl-i İmrân 3:138\'de de aynı isim: "bu Kur\'ân insanlık için bir açıklamadır; takva sahipleri için de bir hidâyet ve bir öğüttür." Kur\'ân kendisini 114 sûre boyunca onlarca kez "hudâ" olarak anar — kimine göre 90 yerden fazla. İlk işaret ettiği işlev bilgi değil, yön.',
    bodyEn: 'In Q 2:2, the first word the Qur\'an chooses to describe itself is *hudan* (guidance). In Q 3:138 the same term: "This is an exposition for mankind — and a guidance and an admonition for the God-conscious." The Qur\'an refers to itself as *hudā* dozens of times across 114 surahs — by some counts over 90 occurrences. The first function it points to is not information but direction.',
    wowTr: 'Kur\'ân\'ın kendine verdiği ilk isim bilgi değil — "yol".',
    wowEn: 'The Qur\'an\'s first self-name is not "knowledge" — it is "way."',
    explore: 'hüden',
  },
  {
    category: 'azBilinen',
    surahRef: 'El-Furkân · 25:1',
    titleTr: 'Furkân — "Hakkı Bâtıldan Ayıran"',
    titleEn: 'Furqān — "That Which Separates Truth from Falsehood"',
    bodyTr: 'Furkân sûresinin ilk ayeti Kur\'ân\'a bu ismi adeta bir nişan gibi takar: "Âlemlere uyarıcı olsun diye kulu Muhammed\'e Furkân\'ı indiren Allah yüceler yücesidir." (25:1). "Furkân" kelimesi "ayıran, sınırı çeken" anlamına gelir — hak ile bâtıl arasındaki çizgiyi. Klasik belâgatta bu isim Kur\'ân\'ın fonksiyonunu tarif eden en keskin adlandırmalardan biridir: bilgi vermek değil, karar verebilmeyi sağlamak.',
    bodyEn: 'The opening verse of Sūrat al-Furqān places this name on the Qur\'an like a blazon: "Blessed is He who has sent down the Furqān upon His servant, that he may be a warner to the worlds." (Q 25:1). The word *furqān* means "that which separates, draws the boundary" — between truth and falsehood. In classical *balāgha* this name is among the sharpest descriptions of the Qur\'an\'s function: not to inform, but to enable judgment.',
    wowTr: 'İsim, işleve atıfta: Kur\'ân bilgi değil, karar.',
    wowEn: 'A name pointing to function: the Qur\'an is not information, but decision.',
    explore: 'furkan',
  },
  {
    category: 'azBilinen',
    surahRef: 'El-Hicr · 15:9',
    titleTr: '"ez-Zikr" — Allah\'ın Koruduğunu Bildirdiği İsim',
    titleEn: '"al-Dhikr" — The Name Allah Promises to Preserve',
    bodyTr: 'Kur\'ân\'ın en ünlü koruma ayeti Hicr 15:9\'dur: "Kur\'ân\'ı kesinlikle biz indirdik; elbette onu yine biz koruyacağız." Ama ayetin orijinalinde "Kur\'ân" kelimesi geçmez — kullanılan isim "ez-Zikr"dir ("innâ nahnu nezzelne\'z-zikre ve innâ lehû le-hâfizûn"). Yani Allah\'ın "koruma" vaadi, özellikle "hatırlatma" işlevine verilmiştir. Klasik tefsir bu kelime seçimini dikkatli yorumlar: Kur\'ân hatırlatma olduğu için korunur — unutulma riskine karşı, insanlığın unutmamak için ihtiyacı olan metin.',
    bodyEn: 'The Qur\'an\'s most famous preservation verse is Q 15:9: "Indeed, We have sent down the reminder, and indeed We will be its guardians." But the original Arabic does not use the word "Qur\'an" — the name is *al-dhikr* (the reminder). Allah\'s promise of preservation is given specifically to the *function* of reminding. Classical exegesis interprets this word-choice carefully: the Qur\'an is preserved *because* it is a reminder — the text humanity needs in order to not forget.',
    wowTr: 'Korunan ismin seçimi: "Kur\'ân" değil, "zikr" — unutulmaya karşı.',
    wowEn: 'The chosen name of the preserved: not "Qur\'an" but "the reminder" — against forgetting.',
    explore: '15:9',
  },
  {
    category: 'azBilinen',
    surahRef: 'En-Nisâ · 4:174, Mâide · 5:15, Teğâbün · 64:8',
    titleTr: '"Nûr" — Kur\'ân Bir Işık Olarak Tanımlanır',
    titleEn: '"Nūr" — The Qur\'an Described as Light',
    bodyTr: 'Kur\'ân kendisini en az üç ayette doğrudan "nûr" (ışık) olarak tanımlar. Nisâ 4:174: "size apaçık bir nûr indirdik". Mâide 5:15: "Allah\'tan bir nûr ve apaçık bir kitap geldi". Teğâbün 64:8: "Allah\'a, Peygamberine ve indirdiğimiz o nura (Kur\'ân\'a) inanın." Şûrâ 42:52: "Biz onu kullarımızdan dilediğimizi kendisiyle doğru yola eriştirdiğimiz bir nûr kıldık." Bu isim metaforik değil, ontolojik bir iddiadır: Kur\'ân, karanlıkta görünen bir aydınlatıcıdır. Klasik ekolde bu kavram "Nûr Ayeti"ne (24:35) bağlanır.',
    bodyEn: 'The Qur\'an describes itself directly as *nūr* (light) in at least three verses. Q 4:174: "We have sent down to you a manifest light." Q 5:15: "There has come to you from Allah a light, and a clear Book." Q 64:8: "Believe in Allah, His Messenger, and the light We have sent down." Q 42:52: "We made it a light by which We guide whomever We will." This name is not metaphorical but an ontological claim: the Qur\'an is an illuminator in the dark. In classical exegesis this concept connects to the Verse of Light (Q 24:35).',
    wowTr: 'Kur\'ân kendi adıyla: "ışık". Metafor değil, ontolojik iddia.',
    wowEn: 'The Qur\'an by its own name: "light." Not metaphor — an ontological claim.',
    explore: '24:35',
  },
  {
    category: 'azBilinen',
    surahRef: 'El-İsrâ · 17:82',
    titleTr: '"Şifâ" — Kur\'ân İç Hastalıkların İlacı Olarak Anılır',
    titleEn: '"Shifāʾ" — The Qur\'an Named as Cure for Inner Ailments',
    bodyTr: 'İsrâ 17:82: "Biz, Kur\'ân\'dan öyle bir şey indiriyoruz ki o, müminler için şifa ve rahmettir; zalimlerin ise yalnızca ziyanını artırır." Klasik tefsir (Kurtubî, Râzî) bu şifayı iki katmanda okur: (1) ruhî-ahlâkî — şüphe, gurur, kibir, cimrilik gibi iç hastalıkların iyileşmesi, (2) bedensel — rukye bağlamında bazı hastalıklarda şifa vesilesi olma. Ama dikkat: klasik ulema "Kur\'ân her derde ilaçtır" genelleştirmesine mesafelidir; birinci katman kesin, ikincisi özel bağlamlıdır. Ayetin devamı sınırı çizer: "zâlimler için zararını artırır" — aynı metin, aynı anda şifa ve artırıcı olabilir.',
    bodyEn: 'Q 17:82: "And We send down from the Qur\'an that which is healing and a mercy for the believers; but it increases the wrongdoers in nothing but loss." Classical exegesis (al-Qurṭubī, al-Rāzī) reads this healing at two levels: (1) spiritual-ethical — the cure for inner diseases like doubt, arrogance, miserliness, (2) physical — through *ruqya* (recitation-based remedy) as a cause of healing in certain contexts. But caution: classical scholars resist generalizing this into "the Qur\'an is a cure for every ailment" — the first level is firm, the second context-specific. The verse itself draws the limit: "for the wrongdoers, it increases only loss" — the same text can be healing and amplification at once.',
    wowTr: 'Aynı ayet — iman için şifa, zulüm için kayıp. Metin aynı, etki zıt.',
    wowEn: 'Same verse — healing for faith, loss for wrongdoing. Same text, opposite effects.',
    explore: '17:82',
  },
];

// ── WowCard ──────────────────────────────────────────────────────────────────

// ─── Visual Atomları (Phase 1 + 2) ───────────────────────────────────────────
// CounterVisual: Framer Motion'a ihtiyaç yok, raw rAF ile animated count-up.
// RingVisual: SVG concentric arcs — yapısal fact'lar için (Fâtiha halka, ring composition).
// TimelineVisual: horizontal connected dots — peygamberler için.
// CalligraphyVisual: KFGQPC büyük display — dilsel/Arapça fact'lar için.
// Card içine title'dan sonra body'den önce yerleşir; kategori rengiyle tinted.
function CounterVisual({ value, suffixTr, suffixEn, labelTr, labelEn, language, cardColor }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let raf;
    const start = performance.now();
    const duration = 1400;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      setDisplay(Math.round(value * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  const suffix = language === 'tr' ? suffixTr : suffixEn;
  const label = language === 'tr' ? labelTr : labelEn;
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
      padding: '12px 14px', margin: '4px 0',
      background: cardColor + '0d',
      borderRadius: RADIUS.md,
      border: `1px solid ${cardColor + '22'}`,
    }}>
      <span style={{
        fontSize: '2.4rem', fontWeight: 700, color: cardColor,
        fontFamily: FONTS.display,
        lineHeight: 1, letterSpacing: '-0.02em',
        fontVariantNumeric: 'tabular-nums',
        display: 'inline-flex', alignItems: 'baseline', gap: '8px',
      }}>
        {display.toLocaleString(language === 'tr' ? 'tr-TR' : 'en-US')}
        {suffix && (
          <span style={{
            fontSize: '0.82rem', fontWeight: 500, color: COLORS.silver,
            fontFamily: "'Inter', sans-serif", letterSpacing: '0.01em',
          }}>{suffix}</span>
        )}
      </span>
      {label && (
        <span style={{
          fontSize: '0.66rem', color: 'rgba(148, 163, 184, 0.78)',
          fontFamily: "'Inter', sans-serif",
          letterSpacing: '0.05em', textTransform: 'uppercase',
          marginTop: '6px', fontWeight: 600,
        }}>
          {label}
        </span>
      )}
    </div>
  );
}

// ── RingVisual — yapısal kategori için concentric arc SVG ──────────────────
function RingVisual({ segments, highlight, labelTr, labelEn, language, cardColor }) {
  // segments: toplam halka segment sayısı (örn. 7 = Fâtiha ayet)
  // highlight: vurgulu segment index (örn. 4 = orta ayet)
  const size = 110;
  const center = size / 2;
  const radius = 38;
  const stroke = 8;
  const gap = 0.05; // radian — segmentler arası açı
  const total = Math.PI * 2;
  const segAngle = (total / segments) - gap;

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
      padding: '12px 14px', margin: '4px 0',
      background: cardColor + '0d',
      borderRadius: RADIUS.md,
      border: `1px solid ${cardColor + '22'}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <svg aria-hidden="true" width={size} height={size} style={{ flexShrink: 0 }}>
          <g transform={`translate(${center} ${center}) rotate(-90)`}>
            {Array.from({ length: segments }).map((_, i) => {
              const isHi = i === highlight - 1;
              const startAngle = i * (total / segments);
              const endAngle = startAngle + segAngle;
              const x1 = Math.cos(startAngle) * radius;
              const y1 = Math.sin(startAngle) * radius;
              const x2 = Math.cos(endAngle) * radius;
              const y2 = Math.sin(endAngle) * radius;
              const large = segAngle > Math.PI ? 1 : 0;
              const path = `M ${x1} ${y1} A ${radius} ${radius} 0 ${large} 1 ${x2} ${y2}`;
              return (
                <path
                  key={i}
                  d={path}
                  stroke={isHi ? cardColor : cardColor + '55'}
                  strokeWidth={isHi ? stroke + 2 : stroke}
                  strokeLinecap="round"
                  fill="none"
                  style={{
                    transition: 'all 0.4s ease',
                    transitionDelay: `${i * 60}ms`,
                  }}
                />
              );
            })}
          </g>
          <text x={center} y={center + 5} textAnchor="middle" style={{
            fill: cardColor,
            fontSize: '1.4rem',
            fontWeight: 700,
            fontFamily: FONTS.display,
          }}>{highlight}</text>
        </svg>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: 0 }}>
          <span style={{
            fontSize: '0.66rem', color: 'rgba(148, 163, 184, 0.78)',
            fontFamily: "'Inter', sans-serif",
            letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 600,
          }}>
            {language === 'tr' ? `${segments} ayet halka` : `${segments}-ayah ring`}
          </span>
          <span style={{
            fontSize: '0.82rem', color: COLORS.offWhite,
            fontFamily: FONTS.body, lineHeight: 1.4,
          }}>
            {language === 'tr' ? labelTr : labelEn}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── TimelineVisual — peygamberler için bağlı dot zinciri ────────────────────
function TimelineVisual({ events, highlightIndex, labelTr, labelEn, language, cardColor }) {
  // events: ['Nûh', 'İbrâhîm', 'Mûsâ', 'Îsâ', 'Muhammed'] vb.
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
      padding: '14px', margin: '4px 0',
      background: cardColor + '0d',
      borderRadius: RADIUS.md,
      border: `1px solid ${cardColor + '22'}`,
    }}>
      <span style={{
        fontSize: '0.66rem', color: 'rgba(148, 163, 184, 0.78)',
        fontFamily: "'Inter', sans-serif",
        letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 600,
        marginBottom: '10px',
      }}>
        {language === 'tr' ? labelTr : labelEn}
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '100%', overflowX: 'auto' }}>
        {events.map((ev, i) => {
          const isHi = i === highlightIndex;
          return (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: isHi ? 30 : 22, height: isHi ? 30 : 22,
                borderRadius: '50%',
                background: isHi ? cardColor + '33' : cardColor + '15',
                border: `1.5px solid ${isHi ? cardColor : cardColor + '55'}`,
                color: isHi ? cardColor : cardColor + 'bb',
                fontSize: isHi ? '0.74rem' : '0.62rem',
                fontWeight: 700,
                fontFamily: "'Inter', sans-serif",
                transition: 'all 0.3s',
              }}>{i + 1}</span>
              <span style={{
                fontSize: isHi ? '0.78rem' : '0.7rem',
                color: isHi ? COLORS.offWhite : 'rgba(148,163,184,0.75)',
                fontWeight: isHi ? 600 : 400,
                fontFamily: FONTS.body,
                whiteSpace: 'nowrap',
              }}>{ev}</span>
              {i < events.length - 1 && (
                <span style={{
                  width: 16, height: 1,
                  background: cardColor + '44',
                  marginLeft: 2, marginRight: 2,
                }} />
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}

// ── CalligraphyVisual — dilsel kategori için büyük Arapça display ───────────
function CalligraphyVisual({ text, transliteration, labelTr, labelEn, language, cardColor }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '20px 16px', margin: '4px 0',
      background: cardColor + '0d',
      borderRadius: RADIUS.md,
      border: `1px solid ${cardColor + '22'}`,
      gap: '8px',
    }}>
      <span
        dir="rtl"
        lang="ar"
        style={{
          fontFamily: FONTS.quran,
          fontSize: '2.2rem',
          color: cardColor,
          lineHeight: 1.4,
          textAlign: 'center',
          letterSpacing: '0.02em',
        }}
      >
        {text}
      </span>
      {transliteration && (
        <span style={{
          fontSize: '0.78rem',
          color: 'rgba(200,210,224,0.75)',
          fontFamily: "'Lora', Georgia, serif",
          fontStyle: 'italic',
          letterSpacing: '0.04em',
        }}>
          {transliteration}
        </span>
      )}
      <span style={{
        fontSize: '0.66rem', color: 'rgba(148, 163, 184, 0.78)',
        fontFamily: "'Inter', sans-serif",
        letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 600,
        marginTop: '4px',
      }}>
        {language === 'tr' ? labelTr : labelEn}
      </span>
    </div>
  );
}

function WowCard({ fact, language, onClose }) {
  const cfg = CATEGORY_CONFIG[fact.category];
  const [hovered, setHovered] = useState(false);
  const { openOverlay } = useQuranNav();

  const handleExplore = () => {
    if (fact.explore) {
      // W22-U2: dispatchEvent → openOverlay. `returnToWow` artık route-based
      // (history.back ile geri dön); detail.search bgem3 ayet referansı.
      onClose();
      openOverlay('graph', { search: fact.explore });
    } else if (fact.scrollTo) {
      document.getElementById(fact.scrollTo)?.scrollIntoView({ behavior: 'smooth' });
      onClose();
    }
  };

  const hasAction = fact.explore || fact.scrollTo;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'rgba(255,255,255,0.055)' : 'rgba(255,255,255,0.03)',
        borderTop: `1px solid ${hovered ? cfg.color + '33' : COLORS.glassBgStrong}`,
        borderRight: `1px solid ${hovered ? cfg.color + '33' : COLORS.glassBgStrong}`,
        borderBottom: `1px solid ${hovered ? cfg.color + '33' : COLORS.glassBgStrong}`,
        borderLeft: `3px solid ${cfg.color}`,
        borderRadius: RADIUS.lg,
        padding: '18px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        transition: 'background 0.2s, border-color 0.2s',
      }}
    >
      {/* Top row: badge + reference + bookmark */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
        <span style={{
          background: cfg.color + '22',
          border: `1px solid ${cfg.color + '55'}`,
          color: cfg.color,
          borderRadius: RADIUS.chip,
          fontSize: '0.68rem',
          fontWeight: 600,
          padding: '2px 9px',
          letterSpacing: '0.03em',
          fontFamily: "'Inter', sans-serif",
          flexShrink: 0,
        }}>
          {language === 'tr' ? cfg.labelTr : cfg.labelEn}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
          <span style={{
            color: 'rgba(148, 163, 184, 0.78)',
            fontSize: '0.68rem',
            fontFamily: "'Inter', sans-serif",
            whiteSpace: 'nowrap',
          }}>
            {localizeSurahRef(fact.surahRef, language)}
          </span>
          {/* #197 (2026-07-16) — Bookmark this wow fact */}
          <BookmarkButton
            item={{
              id: `wowfact:${fact.titleTr?.slice(0, 40) || fact.titleEn?.slice(0, 40) || fact.surahRef}`,
              type: 'wowfact',
              title: language === 'tr' ? fact.titleTr : fact.titleEn,
              subtitle: localizeSurahRef(fact.surahRef, language),
              description: (language === 'tr' ? fact.wowTr : fact.wowEn) || (language === 'tr' ? fact.bodyTr : fact.bodyEn) || '',
              url: `/${language}/arac/kurani-tani`,
            }}
            size="sm"
            language={language}
          />
        </div>
      </div>

      {/* Title */}
      <div style={{
        color: COLORS.gold,
        fontSize: '0.95rem',
        fontWeight: 600,
        fontFamily: "'Inter', sans-serif",
        lineHeight: 1.4,
      }}>
        {language === 'tr' ? fact.titleTr : fact.titleEn}
      </div>

      {/* Phase 1+2 Visual Atom dispatch — counter / ring / timeline / calligraphy */}
      {fact.visualType === 'counter' && fact.visualData && (
        <CounterVisual {...fact.visualData} language={language} cardColor={cfg.color} />
      )}
      {fact.visualType === 'ring' && fact.visualData && (
        <RingVisual {...fact.visualData} language={language} cardColor={cfg.color} />
      )}
      {fact.visualType === 'timeline' && fact.visualData && (
        <TimelineVisual {...fact.visualData} language={language} cardColor={cfg.color} />
      )}
      {fact.visualType === 'calligraphy' && fact.visualData && (
        <CalligraphyVisual {...fact.visualData} language={language} cardColor={cfg.color} />
      )}

      {/* Body */}
      <div style={{
        color: COLORS.silver,
        fontSize: '0.85rem',
        fontFamily: "'Inter', sans-serif",
        lineHeight: 1.7,
        flex: 1,
      }}>
        {language === 'tr' ? fact.bodyTr : fact.bodyEn}
      </div>

      {/* Wow line */}
      <div style={{
        color: cfg.color,
        fontSize: '0.78rem',
        fontStyle: 'italic',
        borderTop: `1px solid ${COLORS.glassBg}`,
        paddingTop: '10px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '6px',
        fontFamily: "'Inter', sans-serif",
      }}>
        <span style={{ opacity: 0.6, flexShrink: 0, marginTop: '1px' }}>✦</span>
        <span>{language === 'tr' ? fact.wowTr : fact.wowEn}</span>
      </div>

      {/* Explore button */}
      {hasAction && (
        <button
          onClick={handleExplore}
          style={{
            alignSelf: 'flex-start',
            background: 'transparent',
            border: `1px solid ${cfg.color + '44'}`,
            borderRadius: RADIUS.sm,
            color: cfg.color,
            cursor: 'pointer',
            fontSize: '0.72rem',
            fontWeight: 600,
            padding: '4px 12px',
            letterSpacing: '0.04em',
            fontFamily: "'Inter', sans-serif",
            transition: 'background 0.15s, border-color 0.15s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = cfg.color + '1a';
            e.currentTarget.style.borderColor = cfg.color + '77';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.borderColor = cfg.color + '44';
          }}
        >
          {language === 'tr' ? 'Keşfet →' : 'Explore →'}
        </button>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function WowFacts({ onClose }) {
  const { language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchValue, setSearchValue]       = useState('');
  const [isMobile, setIsMobile] = useState(false); // SSR-safe

  // isMobile hydrate (§16.6)
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 640);
    h();
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  // Escape key
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts = { all: FACTS.length };
    CATEGORY_ORDER.forEach(cat => {
      counts[cat] = FACTS.filter(f => f.category === cat).length;
    });
    return counts;
  }, []);

  // Filtered facts
  const filtered = useMemo(() => {
    let result = FACTS;
    if (activeCategory !== 'all') {
      result = result.filter(f => f.category === activeCategory);
    }
    const q = searchValue.trim().toLowerCase();
    if (q.length >= 2) {
      result = result.filter(f => {
        const haystack = [
          f.titleTr, f.titleEn,
          f.bodyTr,  f.bodyEn,
          f.wowTr,   f.wowEn,
          f.surahRef,
        ].join(' ').toLowerCase();
        return haystack.includes(q);
      });
    }
    return result;
  }, [activeCategory, searchValue]);

  const allCategories = [
    { key: 'all', labelTr: 'Tümü', labelEn: 'All' },
    ...CATEGORY_ORDER.map(k => ({ key: k, labelTr: CATEGORY_CONFIG[k].labelTr, labelEn: CATEGORY_CONFIG[k].labelEn, color: CATEGORY_CONFIG[k].color })),
  ];

  return (
    <>
      <style>{`
        @keyframes wowFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
        .wow-scroll::-webkit-scrollbar { width: 5px; }
        .wow-scroll::-webkit-scrollbar-track { background: transparent; }
        .wow-scroll::-webkit-scrollbar-thumb { background: ${COLORS.goldAlpha20}; border-radius: 3px; }
        .wow-scroll::-webkit-scrollbar-thumb:hover { background: rgba(212,165,116,0.35); }
        .wow-tab-active { position: relative; }
        .wow-tab-active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0; right: 0;
          height: 2px;
          border-radius: 2px;
        }
        @media (max-width: 640px) {
          .wow-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* A planı Phase 0 (revize): Tool sayfaları için STANDART ALT-HEADER pattern.
          Global Navbar üstte (62px sticky). Hemen altına SECOND-HEADER sticky
          yerleşir (top:62 → Navbar'a yapışır, çakışma YOK). IlkSon parity:
          icon · title · gri subtitle · chip. Bu pattern tüm 21 tool'a uygulanacak. */}
      <div
        style={{
          background: COLORS.cosmicBlack,
          minHeight: 'calc(100vh - 62px)',
          display: 'flex', flexDirection: 'column',
          paddingTop: '62px', // global Navbar yüksekliği için boşluk
          animation: 'wowFadeIn 0.18s ease',
        }}
      >
        {/* Standart ToolHeader component (tüm tool sayfalarında ortak). */}
        <ToolHeader
          icon={<span style={{ color: COLORS.gold, fontSize: '1.05rem', lineHeight: 1 }}>✦</span>}
          titleTr="Kur'an'ı Tanı"
          titleEn="Meet the Quran"
          subtitleTr="Sayılar, yapılar ve gizli kalmış bağlantılar"
          subtitleEn="Numbers, structures, and hidden connections"
          language={language}
        />

        {/* ── HERO (Cinematic) — Nisâ 4:82 ────────────────────────── */}
        <section style={{
          padding: '40px 24px 32px',
          textAlign: 'center',
          flexShrink: 0,
          background: 'linear-gradient(180deg, rgba(212,165,116,0.06) 0%, transparent 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          maxWidth: '900px', width: '100%', margin: '0 auto', boxSizing: 'border-box',
        }}>
          <div dir="rtl" lang="ar" aria-label="Bismillāh" style={{ fontFamily: FONTS.bismillah, fontSize: '1.85rem', color: COLORS.gold, opacity: 0.82, lineHeight: 1, marginBottom: '32px', textShadow: `0 0 22px ${COLORS.gold}28` }}>﷽</div>
          <p dir="rtl" lang="ar" style={{ fontFamily: FONTS.quran, fontSize: 'clamp(1.15rem, 2.2vw, 1.6rem)', color: COLORS.gold, lineHeight: 2.1, margin: '0 auto 14px', maxWidth: '780px', textShadow: `0 0 20px ${COLORS.gold}1c` }}>
            اَفَلَا يَتَدَبَّرُونَ الْقُرْاٰنَ وَلَوْ كَانَ مِنْ عِنْدِ غَيْرِ اللّٰهِ لَوَجَدُوا فِيهِ اخْتِلَافاً كَثِيراً
          </p>
          <p style={{ color: COLORS.offWhite, fontFamily: FONTS.display, fontStyle: 'italic', fontSize: 'clamp(0.95rem, 1.6vw, 1.05rem)', lineHeight: 1.7, margin: '0 auto 6px', maxWidth: '640px', opacity: 0.95 }}>
            "{language === 'tr' ? "Hâlâ Kur'an'ı düşünüp anlamaya çalışmıyorlar mı? Eğer Allah'tan başkasından gelseydi onda birçok tutarsızlık bulurlardı." : "Then do they not reflect upon the Quran? Had it been from any other than Allah, they would have found in it many discrepancies."}"
          </p>
          <p style={{ color: COLORS.silver, fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', letterSpacing: '0.16em', textTransform: 'uppercase', margin: '0 0 30px', opacity: 0.78 }}>
            — {language === 'tr' ? 'Nisâ 4:82' : 'An-Nisāʾ 4:82'}
          </p>
          <p style={{ color: COLORS.silver, fontFamily: FONTS.display, fontStyle: 'italic', fontSize: 'clamp(0.95rem, 1.55vw, 1.02rem)', lineHeight: 1.7, margin: '0 auto 36px', maxWidth: '700px', opacity: 0.88 }}>
            {language === 'tr' ? <>İlk bakışta görünmeyen <em style={{ fontStyle: 'normal', color: COLORS.gold }}>örüntüler</em>, asla rastlantı olamayacak <em style={{ fontStyle: 'normal', color: COLORS.gold }}>denklikler</em>, 1.400 yıldır içinde duran <em style={{ fontStyle: 'normal', color: COLORS.gold }}>sırlar</em> — tedebbürün açtığı kapılar.</> : <>Patterns invisible at first glance, equivalences too precise to be coincidence, secrets sitting in the text for 1,400 years — the doors that <em style={{ fontStyle: 'normal', color: COLORS.gold }}>tadabbur</em> opens.</>}
          </p>
          <div aria-hidden="true" style={{ width: '120px', height: '1px', background: `linear-gradient(to right, transparent, ${COLORS.gold}66, transparent)`, margin: '0 auto' }} />
        </section>

        {/* Search + Category filters — hero ile aynı 760 container, ortalanmış */}
        <section style={{
          flexShrink: 0,
          maxWidth: '760px', width: '100%', margin: '0 auto',
          padding: '0 24px 28px',
          boxSizing: 'border-box',
          display: 'flex', flexDirection: 'column', gap: '14px',
        }}>
          {/* Search — full width inside 760 container */}
          <div style={{ position: 'relative', width: '100%' }}>
            <svg
              aria-hidden="true"
              width="14" height="14" viewBox="0 0 24 24"
              fill="none" stroke={COLORS.silverAlpha40} strokeWidth="2" strokeLinecap="round"
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
            >
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder={language === 'tr' ? 'Gerçeklerde ara...' : 'Search facts...'}
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              style={{
                width: '100%', boxSizing: 'border-box',
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid ${COLORS.glassBgStrong}`,
                borderRadius: RADIUS.md,
                color: COLORS.offWhite, fontFamily: "'Inter', sans-serif", fontSize: '0.85rem',
                padding: '8px 12px 8px 36px',
                outline: 'none',
                transition: 'border-color 0.15s',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = 'rgba(212,165,116,0.35)'; }}
              onBlur={e => { e.currentTarget.style.borderColor = COLORS.glassBgStrong; }}
            />
          </div>

          {/* Category tabs — glass-dark + gold accent + hover glow (premium chips) */}
          <div style={{
            display: 'flex', gap: '6px',
            overflowX: 'auto', paddingBottom: '4px',
            scrollbarWidth: 'none',
            justifyContent: 'center', flexWrap: 'wrap',
          }}>
            {allCategories.map(({ key, labelTr, labelEn, color }) => {
              const isActive = activeCategory === key;
              const tabColor = key === 'all' ? COLORS.gold : color;
              return (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  style={{
                    flexShrink: 0,
                    background: isActive
                      ? `linear-gradient(135deg, ${tabColor}22 0%, ${tabColor}10 100%)`
                      : 'rgba(255,255,255,0.035)',
                    border: `1px solid ${isActive ? tabColor + '66' : 'rgba(255,255,255,0.10)'}`,
                    borderRadius: RADIUS.lg,
                    color: isActive ? tabColor : 'rgba(200,210,224,0.75)',
                    cursor: 'pointer',
                    fontSize: '0.78rem', fontWeight: isActive ? 600 : 500,
                    fontFamily: "'Inter', sans-serif",
                    padding: '7px 14px',
                    transition: `all ${TRANSITION.fast}`,
                    display: 'flex', alignItems: 'center', gap: '7px',
                    boxShadow: isActive ? `0 0 0 1px ${tabColor}22, 0 2px 12px ${tabColor}1a` : 'none',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                      e.currentTarget.style.borderColor = `${tabColor}44`;
                      e.currentTarget.style.color = 'rgba(232,230,227,0.95)';
                      e.currentTarget.style.boxShadow = `0 0 0 1px ${tabColor}18, 0 2px 8px ${tabColor}10`;
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.035)';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)';
                      e.currentTarget.style.color = 'rgba(200,210,224,0.75)';
                      e.currentTarget.style.boxShadow = 'none';
                    }
                  }}
                >
                  {language === 'tr' ? labelTr : labelEn}
                  <span style={{
                    background: isActive ? tabColor + '30' : 'rgba(255,255,255,0.08)',
                    borderRadius: RADIUS.sm,
                    color: isActive ? tabColor : SEMANTIC.textFaint,
                    fontSize: '0.66rem', fontWeight: 700,
                    padding: '1px 7px',
                    transition: `all ${TRANSITION.fast}`,
                  }}>
                    {categoryCounts[key] ?? 0}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Cards grid — window-level scroll (no inner overflow) → ToolHeader
            sticky:top:62 gerçekten çalışsın. .wow-scroll classı sadece scrollbar
            stilini WebKit'te override etmek için kaldı (body scrollbar). */}
        <div
          className="wow-scroll"
          style={{ padding: '20px' }}
        >
          {filtered.length === 0 ? (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              height: '200px', gap: '8px',
              color: SEMANTIC.textFaint, fontFamily: "'Inter', sans-serif", fontSize: '0.9rem',
            }}>
              <span style={{ fontSize: '1.5rem', opacity: 0.3 }}>✦</span>
              {language === 'tr' ? 'Sonuç bulunamadı.' : 'No results found.'}
            </div>
          ) : (
            <div
              className="wow-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))',
                gap: '14px',
                maxWidth: '1200px',
                margin: '0 auto',
              }}
            >
              {filtered.map((fact, i) => (
                <WowCard
                  key={i}
                  fact={fact}
                  language={language}
                  onClose={onClose}
                />
              ))}
            </div>
          )}

          {/* Cross-tool CTA — #202 (2026-07-16) */}
          <div style={{ maxWidth: 1200, margin: '48px auto 0', padding: '0 4px' }}>
            <CrossToolCTA
              language={language}
              isMobile={isMobile}
              links={[
                { href: `/${language}/arac/kurani-tani`, titleTr: 'Kur\'an\'ı Tanı', titleEn: 'Discover the Quran', descTr: 'Wow-Facts\'in kapsamlı hâli — Kur\'an\'ın yapısı, mimarisi, dili ve içeriği.', descEn: 'The comprehensive version of Wow-Facts — Quran\'s structure, architecture, language and content.' },
                { href: `/${language}/arac/bilimsel-isaretler`, titleTr: 'Bilimsel İşaretler', titleEn: 'Scientific Signs', descTr: 'Modern bilimsel okumalarla örtüşen Kur\'ânî işaretler — nüanslarıyla.', descEn: 'Quranic signs that align with modern scientific readings — with all their nuances.' },
                // §13.24 (2026-08-14): "arkeolojinin ONAYLADIĞI" / "confirmed by
                // archaeology" tasdikin öznesini arkeoloji yapıyordu — kural bu
                // kalıbı ismen yasaklıyor. Hedef sayfanın içeriği 26 Temmuz'da
                // yeniden çerçevelenmiş, ama ona giden KARTIN metni atlanmış.
                // Doğru çerçeve: "Kur'ân haber verir, biz tasdik ederiz;
                // bulgular tefekküre vesiledir" → örtüşme/temas dili.
                { href: `/${language}/arac/tarihsel-kanitlar`, titleTr: 'Tarihsel İzler', titleEn: 'Historical Traces', descTr: 'Kur\'ânî anlatılarla tarihsel bulguların temas noktaları — Firavun\'un bedeni, Hâmân.', descEn: 'Where Quranic narratives and historical findings touch — Pharaoh\'s body, Hāmān.' },
              ]}
            />

            {/* #205 (2026-07-16) — Karma sayı, dilbilim, tarih odaklı kaynaklar */}
            <SourcesCitation
              language={language}
              isMobile={isMobile}
              sources={[
                {
                  author: 'es-Süyûtî',
                  workTr: "el-İtkān fî Ulûmi\'l-Kurʾân",
                  workEn: 'al-Itqān fī ʿUlūm al-Qurʾān',
                  period: '1445–1505 (Kahire)',
                  noteTr: "Kur'ân ilimlerinin klasik ansiklopedisi — sayısal örüntüler, dil özellikleri, retorik incelikler için temel başvuru.",
                  noteEn: 'Classical encyclopedia of Quranic sciences — foundational reference for numerical patterns, linguistic features, rhetorical subtleties.',
                },
                {
                  author: 'ez-Zerkeşî',
                  workTr: "el-Burhân fî Ulûmi\'l-Kurʾân",
                  workEn: 'al-Burhān fī ʿUlūm al-Qurʾān',
                  period: '1344–1392 (Kahire)',
                  noteTr: "Kur'ân ilimlerinin bir diğer klasik kompendyumu — mucize (iʿcâz), tenâsüb, münâsebet ve dilsel örüntüler.",
                  noteEn: 'Another classical compendium of Quranic sciences — miraculousness (iʿjāz), munāsaba, and linguistic patterns.',
                },
                {
                  author: 'Angelika Neuwirth',
                  workTr: "Kur\'ân Geç Antikitede Metin",
                  workEn: 'The Qur\'an and Late Antiquity',
                  period: '2019 (Oxford UP)',
                  noteTr: "Kur\'ân\'ın geç antikite bağlamında tarihsel-edebi yapısını inceleyen çağdaş akademik referans; Wow-fact tarihi arka planı.",
                  noteEn: 'Contemporary academic reference examining the Quran\'s historical-literary structure in late antique context; historical background for wow-facts.',
                },
                {
                  author: 'Michel Cuypers',
                  workTr: 'Kur\'ân\'ın Yapıları',
                  workEn: 'The Composition of the Quran',
                  period: '2015 (Bloomsbury)',
                  noteTr: "Kur\'ân\'ın halka-yapılı (ring) kompozisyonu, simetri ve chiasmus örüntüleri üzerine modern strukturel analiz.",
                  noteEn: "Modern structural analysis of the Quran's ring composition, symmetry, and chiasmus patterns.",
                },
              ]}
            />
          </div>
        </div>
      </div>
    </>
  );
}
