'use client';

import { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useQuranNav } from '../hooks/useQuranNav';
import { CLOSE_BTN, OVERLAY_TITLE, COLORS, RADIUS, TRANSITION } from '../tokens';

const CATEGORY_CONFIG = {
  sayisal:      { color: COLORS.gold,      labelTr: 'Sayısal',      labelEn: 'Numerical'   },
  yapisal:      { color: COLORS.skyBlue,   labelTr: 'Yapısal',      labelEn: 'Structural'  },
  peygamberler: { color: COLORS.amber,     labelTr: 'Peygamberler', labelEn: 'Prophets'    },
  azBilinen:    { color: COLORS.purple,    labelTr: 'Az Bilinen',   labelEn: 'Hidden Gems' },
};

const CATEGORY_ORDER = ['sayisal', 'yapisal', 'peygamberler', 'azBilinen'];

const FACTS = [
  // ── SAYISAL ──────────────────────────────────────────────────────────────────
  {
    category: 'sayisal',
    surahRef: 'Çeşitli sûreler',
    titleTr: 'Besmele 114 Kez — Sûre Sayısıyla Aynı',
    titleEn: '"Bismillah" 114 Times — Equal to the Surah Count',
    bodyTr: 'Kur\'an\'da 114 sûre vardır. Besmele 113 sûrenin başında yer alır (Tevbe istisna). Neml 27:30\'da bir ayet içinde daha — Hz. Süleyman\'ın Belkıs\'a yazdığı mektubun açılışı olarak — geçer. Yani toplam 114: sûre sayısıyla eşit. (Not: Neml 27:30 alıntı formundadır, kur\'ânî bir sûre açılışı değildir; yine de sayısal denge dikkat çekicidir.)',
    bodyEn: 'The Quran has 114 surahs. Bismillah opens 113 of them (At-Tawbah is the exception). It appears once more inside a verse in An-Naml 27:30 — as the opening of Solomon\'s letter to the Queen of Sheba. Total: 114, matching the surah count. (Note: An-Naml 27:30 is in quotation form, not a Quranic surah opening itself; yet the numerical balance is notable.)',
    wowTr: 'Besmele sayısı, sûre sayısını yansıtır.',
    wowEn: 'The count of "Bismillah" mirrors the number of surahs.',
    explore: '27:30',
  },
  {
    category: 'sayisal',
    surahRef: 'El-Mücâdele · 58',
    titleTr: 'Her Ayette Allah — Tek Sûre',
    titleEn: 'Allah in Every Verse — The Only Surah',
    bodyTr: 'El-Mücâdele sûresinin 22 ayetinin tamamında "Allah" lafzı geçer. Kur\'an\'ın 114 sûresinden yalnızca bu sûreye özgü bir özellik.',
    bodyEn: 'The name "Allah" appears in all 22 of Al-Mujadila\'s verses. A distinction belonging to only one of the Quran\'s 114 surahs.',
    wowTr: '114 sûreden sadece birinin taşıdığı imza.',
    wowEn: 'A signature carried by only one of 114 surahs.',
    explore: 'mucadele',
  },

  {
    category: 'sayisal',
    surahRef: 'Çeşitli sûreler',
    titleTr: '"Allah" Lafzı — 2.699 Kez',
    titleEn: '"Allah" — 2,699 Times',
    bodyTr: 'Kur\'an\'ın en çok geçen kelimesi, Allah lafzının kendisidir: yaklaşık 2.699 kez. 114 sûrede, 6.236 ayette — hiçbir sayfa sessiz kalmıyor.\n\nℹ️ Kesin sayı, hangi formların dahil edildiğine göre kaynaklara göre hafif farklılık gösterebilir (2.698–2.700 aralığı).',
    bodyEn: 'The most frequent word in the Quran is the name Allah itself: approximately 2,699 times. Across 114 surahs and 6,236 verses — no page is silent.\n\nℹ️ The exact count varies slightly by source depending on which forms are included (range: 2,698–2,700).',
    wowTr: 'Her 2,3 ayette bir — hiçbir sayfa susmuyor.',
    wowEn: 'Once every 2.3 verses — no page is silent.',
    explore: 'Allah',
  },
  {
    category: 'sayisal',
    surahRef: 'Çeşitli sûreler',
    titleTr: '25 Peygamber — Genel Kabule Göre',
    titleEn: '25 Prophets — According to General Consensus',
    bodyTr: 'Kur\'an, genel kabule göre 25 peygamberi ismiyle zikreder. İslam geleneğinde 124.000 peygamber gönderildiği rivayet edilir. Bu 25\'in her biri farklı bir insanlık dersini taşır: sabır, adalet, tövbe, tevekkül... ℹ Zülkifl başta olmak üzere bazı isimlerin peygamberliği klasik tefsirde tartışmalıdır.',
    bodyEn: 'The Quran names 25 prophets according to general scholarly consensus. Islamic tradition holds that 124,000 prophets were sent. Each of these 25 carries a distinct lesson: patience, justice, repentance, trust... ℹ The prophethood of some figures, notably Dhul-Kifl, is debated in classical exegesis.',
    wowTr: '124.000\'den 25 — her biri bir ders, hepsi bir sistem.',
    wowEn: '25 out of 124,000 — each a lesson, together a system.',
    explore: 'resul',
  },

  {
    category: 'sayisal',
    surahRef: 'Er-Rahmân · 55',
    titleTr: '"Febieyyi âlâi" — 31 Kez Tekrar',
    titleEn: '"Febieyyi ala\'i" — Repeated 31 Times',
    bodyTr: 'Er-Rahman sûresinde "Febieyyi âlâi Rabbikümâ tükezzibân" (Rabbinizin hangi nimetlerini yalanlıyorsunuz?) ayeti tam 31 kez tekrar eder. Kur\'an\'ın en çok tekrar eden ayetidir. Her tekrar farklı bir nimeti saydıktan sonra geliyor — retorik bir mühür gibi.',
    bodyEn: 'In Surah Ar-Rahman, the verse "Febieyyi ala\'i Rabbikuma tukadhdhibhan" (Which of your Lord\'s favors will you deny?) repeats exactly 31 times. It is the most repeated verse in the Quran. Each repetition follows the mention of a different blessing — like a rhetorical seal.',
    wowTr: '31 kez soru — her biri farklı bir nimeti mühürler.',
    wowEn: '31 repetitions — each sealing a different blessing.',
    explore: 'Rabbinizin hangi nimetlerini',
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
    bodyTr: 'Kur\'an\'ın en uzun ayeti bir borç sözleşmesini düzenler: yazılı kayıt tutulması, iki erkek ya da bir erkek iki kadın tanık, yazanın tarafsız olması. Modern hukukun temel ilkeleri, 7. yüzyılda ayet olarak inmiş.',
    bodyEn: 'The Quran\'s longest verse governs a debt contract: written documentation, two male or one male two female witnesses, an impartial scribe. The foundational principles of modern law — revealed as a verse in the 7th century.',
    wowTr: 'Kur\'an\'ın en uzun ayeti ibadet değil, sözleşme hukuku düzenler.',
    wowEn: 'The Quran\'s longest verse regulates contracts, not worship.',
    explore: '2:282',
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
    wowTr: 'Yapı tesadüf değil, tasarım.',
    wowEn: 'Structure, not coincidence — design.',
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
    bodyTr: 'Kur\'an\'ın bir "hukuk kitabı" olduğu yaygın bir yanılgıdır. 6.236 ayetin büyük çoğunluğu ibadet, muamelat ve ceza hukuku değil; ahlak, kıssa, tefekkür, dua ve evren üzerinedir.',
    bodyEn: 'A common misconception is that the Quran is a "book of law." The vast majority of its 6,236 verses are not about worship rules, civil transactions, or criminal law — they cover ethics, narrative, contemplation, prayer, and the universe.',
    wowTr: 'Hukuk Kur\'an\'ın bir bölümü — ruh, anlam ve evren geri kalanı.',
    wowEn: 'Law is one part of the Quran — soul, meaning, and universe are the rest.',
    explore: '2:282',
  },
  {
    category: 'yapisal',
    surahRef: 'Eş-Şems · 91',
    titleTr: 'Kur\'an\'ın En Yoğun Yemin Dizisi — 11 Art Arda Yemin',
    titleEn: 'The Quran\'s Most Intense Oath Sequence — 11 Consecutive Oaths',
    bodyTr: 'Şems sûresi 11 art arda yemin ile açılır: güneşe, aydınlığına, aya, gündüze, geceye, gökyüzüne, yere ve insanın ruhuna. Her yemin bir sonrakini inşa eder; kozmostan başlayıp insana iner. 8. yeminle ani bir kırılma: "Nefse ve onu şekillendirene yemin ederim." Kur\'an\'ın yemin içeren sûreleri arasında bu art arda yoğunluk nadirdir.',
    bodyEn: 'Surah Ash-Shams opens with 11 consecutive oaths: by the sun, its radiance, the moon, the day, the night, the sky, the earth, and finally the human soul. Each oath builds on the previous, descending from the cosmos to the self. At oath 8, a sudden pivot: "By the soul and by He who shaped it." Among the Quran\'s oath-bearing surahs, such an unbroken density is rare.',
    wowTr: '11 yemin — kozmosu sahne yapar, sonra insan ruhunu merkeze alır.',
    wowEn: '11 oaths — stages the entire cosmos, then places the human soul at center.',
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
    wowTr: '950 yıl — tarihin hiçbir sözlü geleneğinde görülmeyen kesin bir sayı.',
    wowEn: '950 years — a precise figure unmatched in any oral tradition of history.',
    explore: 'nuh',
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
    bodyTr: 'Kehf sûresi, mağara ashâbının 300 yıl uyuduğunu söyler, ardından "ya da 309" ekler (Kehf 18:25). 300 güneş yılı ≈ 309.017 kamer yılı (yaklaşık 6 gün fark). Kur\'an, iki takvimi aynı anda verir.',
    bodyEn: 'Surah Al-Kahf says the cave dwellers slept 300 years, then adds "or 309" (Al-Kahf 18:25). 300 solar years ≈ 309.017 lunar years (~6 days difference). The Quran gives both calendars at once.',
    wowTr: 'İki takvim, tek ayette, tam uyum.',
    wowEn: 'Two calendars. One verse. Perfect match.',
    explore: 'kehf',
  },
  {
    category: 'azBilinen',
    surahRef: 'El-Alak · 96:15-16',
    titleTr: '"Alın" — Beynin Yalan Merkezi',
    titleEn: '"Forehead" — The Brain\'s Lying Center',
    bodyTr: 'Kur\'an yalancıyı "alından" yakalar (Alak 96:15-16). Modern nörobilim: prefrontal korteks (alnın hemen arkası) yalan söyleme ve ahlaki muhakeme merkezidir. fMRI çalışmalarıyla desteklenmektedir.\n\nℹ️ Klasik tefsirde "nâsiye" rezalet ve zilletin mecazi sembolüdür — Taberi ve diğer müfessirler bu ifadeyi anatomiyle ilişkilendirmez. Nörobilim bağlantısı çağdaş bir okumadır.',
    bodyEn: 'The Quran says the liar will be seized by the "forelock" (Al-Alaq 96:15-16). Modern neuroscience: the prefrontal cortex (just behind the forehead) is the center for lying and moral reasoning. Supported by fMRI studies.\n\nℹ️ In classical commentary, "nāsiyah" is a metaphor for disgrace and humiliation — classical scholars did not connect it to brain anatomy. The neuroscience parallel is a contemporary reading.',
    wowTr: '7. yüzyılda alın, beyin nörobilimi bilmeden gösterildi.',
    wowEn: 'In the 7th century, the forehead was pointed to without knowing neuroscience.',
    explore: '96:15',
  },
  {
    category: 'azBilinen',
    surahRef: 'El-Kıyâme · 75:4',
    titleTr: '"Parmak Uçları" — Benzersiz Kimlik',
    titleEn: '"Fingertips" — Unique Identity',
    bodyTr: '"Parmak uçlarını bile yeniden düzeltmeye kadiriz" (Kıyâme 75:4). Tüm organlar arasında neden özellikle parmak uçları? 1880\'lerde belgelendi: Her insanın parmak izi eşsizdir. İkizlerde bile.\n\nℹ️ Klasik tefsirde bu ayet, kıyamette Allah\'ın yeniden yaratma gücünü anlatır — parmak uçları küçüklük ve inceliğin sembolü olarak kullanılır. Parmak izi benzersizliği bağlantısı çağdaş bir okumadır.',
    bodyEn: '"We are able to restore even his fingertips" (Al-Qiyama 75:4). Of all body parts, why specifically fingertips? Documented in the 1880s: every person\'s fingerprint is unique. Even in identical twins.\n\nℹ️ In classical commentary, this verse describes God\'s power to resurrect — fingertips are used as a symbol of intricacy and smallness. The fingerprint uniqueness connection is a contemporary reading.',
    wowTr: '1880\'lerde belgelenen, 7. yüzyılda işaret edildi.',
    wowEn: 'Documented in the 1880s. Pointed to in the 7th century.',
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
      {/* Top row: badge + reference */}
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
        <span style={{
          color: 'rgba(148,163,184,0.45)',
          fontSize: '0.68rem',
          fontFamily: "'Inter', sans-serif",
          whiteSpace: 'nowrap',
        }}>
          {fact.surahRef}
        </span>
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

      <div
        style={{
          position: 'fixed', inset: '54px 0 0 0', zIndex: 50,
          background: COLORS.cosmicBlack,
          display: 'flex', flexDirection: 'column',
          animation: 'wowFadeIn 0.18s ease',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 20px', height: '54px', flexShrink: 0,
          background: 'rgba(8,10,18,0.96)', backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(212,165,116,0.1)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: COLORS.gold, fontSize: '1.1rem', lineHeight: 1 }}>✦</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
              <span style={OVERLAY_TITLE}>
                {language === 'tr' ? "Kur'an'ı Tanı" : 'Meet the Quran'}
              </span>
              <span style={{ color: 'rgba(148,163,184,0.5)', fontSize: '0.68rem', fontFamily: "'Inter', sans-serif" }}>
                {language === 'tr' ? 'Az bilinen, şaşırtan gerçekler' : 'Hidden gems & surprising facts'}
              </span>
            </div>
            <span style={{
              background: 'rgba(212,165,116,0.1)', border: `1px solid ${COLORS.goldAlpha20}`,
              borderRadius: RADIUS.lg, color: 'rgba(212,165,116,0.8)',
              fontSize: '0.68rem', fontFamily: "'Inter', sans-serif",
              padding: '2px 10px', fontWeight: 600,
            }}>
              {filtered.length} {language === 'tr' ? 'gerçek' : 'facts'}
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Kapat"
            style={{ ...CLOSE_BTN }}
            onMouseEnter={e => { e.currentTarget.style.background = COLORS.glassBorder; e.currentTarget.style.color = COLORS.offWhite; }}
            onMouseLeave={e => { e.currentTarget.style.background = CLOSE_BTN.background; e.currentTarget.style.color = COLORS.silver; }}
          >
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search + Category filters */}
        <div style={{
          flexShrink: 0,
          padding: '12px 20px 0',
          background: 'rgba(8,10,18,0.92)',
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${COLORS.glassBg}`,
          display: 'flex', flexDirection: 'column', gap: '10px',
        }}>
          {/* Search */}
          <div style={{ position: 'relative', maxWidth: '480px' }}>
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

          {/* Category tabs */}
          <div style={{
            display: 'flex', gap: '4px',
            overflowX: 'auto', paddingBottom: '10px',
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
                    background: isActive ? tabColor + '18' : 'transparent',
                    border: `1px solid ${isActive ? tabColor + '55' : 'rgba(255,255,255,0.07)'}`,
                    borderRadius: RADIUS.md,
                    color: isActive ? tabColor : 'rgba(148,163,184,0.6)',
                    cursor: 'pointer',
                    fontSize: '0.78rem', fontWeight: isActive ? 600 : 400,
                    fontFamily: "'Inter', sans-serif",
                    padding: '5px 13px',
                    transition: `all ${TRANSITION.fast}`,
                    display: 'flex', alignItems: 'center', gap: '5px',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                      e.currentTarget.style.color = 'rgba(148,163,184,0.9)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'rgba(148,163,184,0.6)';
                    }
                  }}
                >
                  {language === 'tr' ? labelTr : labelEn}
                  <span style={{
                    background: isActive ? tabColor + '22' : 'rgba(255,255,255,0.06)',
                    borderRadius: RADIUS.sm,
                    color: isActive ? tabColor : 'rgba(148,163,184,0.5)',
                    fontSize: '0.65rem', fontWeight: 600,
                    padding: '1px 6px',
                    transition: `all ${TRANSITION.fast}`,
                  }}>
                    {categoryCounts[key] ?? 0}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Cards grid */}
        <div
          className="wow-scroll"
          style={{ flex: 1, overflowY: 'auto', padding: '20px' }}
        >
          {filtered.length === 0 ? (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              height: '200px', gap: '8px',
              color: COLORS.silverAlpha40, fontFamily: "'Inter', sans-serif", fontSize: '0.9rem',
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
        </div>
      </div>
    </>
  );
}
