import { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

const CATEGORY_CONFIG = {
  sayisal:      { color: '#d4a574', labelTr: 'Sayısal',      labelEn: 'Numerical'   },
  yapisal:      { color: '#3498db', labelTr: 'Yapısal',      labelEn: 'Structural'  },
  peygamberler: { color: '#f0b429', labelTr: 'Peygamberler', labelEn: 'Prophets'    },
  azBilinen:    { color: '#a78bfa', labelTr: 'Az Bilinen',   labelEn: 'Hidden Gems' },
};

const CATEGORY_ORDER = ['sayisal', 'yapisal', 'peygamberler', 'azBilinen'];

const FACTS = [
  // ── SAYISAL ──────────────────────────────────────────────────────────────────
  {
    category: 'sayisal',
    surahRef: 'Çeşitli sureler',
    titleTr: 'Besmele 114 Kez — Sure Sayısıyla Aynı',
    titleEn: '"Bismillah" 114 Times — Equal to the Surah Count',
    bodyTr: 'Kur\'an\'da 114 sure vardır. Besmele 113 surenin başında geçer, bir kez de Neml 27:30\'da ayet içinde. Toplam: tam 114.',
    bodyEn: 'The Quran has 114 surahs. Bismillah opens 113 of them, and appears once more in An-Naml 27:30 inside a verse. Total: exactly 114.',
    wowTr: 'Besmele sayısı, sure sayısını yansıtır.',
    wowEn: 'The count of "Bismillah" mirrors the number of surahs.',
    scrollTo: 'linguistic',
  },
  {
    category: 'sayisal',
    surahRef: 'El-Mücâdele · 58',
    titleTr: 'Her Ayette Allah — Tek Sure',
    titleEn: 'Allah in Every Verse — The Only Surah',
    bodyTr: 'El-Mücâdele suresinin 22 ayetinin tamamında "Allah" lafzı geçer. Kur\'an\'ın 114 suresinden yalnızca bu sureye özgü bir özellik.',
    bodyEn: 'The name "Allah" appears in all 22 of Al-Mujadila\'s verses. A distinction belonging to only one of the Quran\'s 114 surahs.',
    wowTr: '114 sureden sadece birinin taşıdığı imza.',
    wowEn: 'A signature carried by only one of 114 surahs.',
    explore: 'allah',
  },

  {
    category: 'sayisal',
    surahRef: 'Çeşitli sureler',
    titleTr: '"Allah" Lafzı — 2.699 Kez',
    titleEn: '"Allah" — 2,699 Times',
    bodyTr: 'Kur\'an\'ın en çok geçen kelimesi, Allah lafzının kendisidir: 2.699 kez. 114 surede, 6.236 ayette — hiçbir sayfa sessiz kalmıyor.',
    bodyEn: 'The most frequent word in the Quran is the name Allah itself: 2,699 times. Across 114 surahs and 6,236 verses — no page is silent.',
    wowTr: 'Her 2,3 ayette bir — hiçbir sayfa susmuyor.',
    wowEn: 'Once every 2.3 verses — no page is silent.',
    explore: 'allah',
  },
  {
    category: 'sayisal',
    surahRef: 'Çeşitli sureler',
    titleTr: '25 Peygamber — Genel Kabule Göre',
    titleEn: '25 Prophets — According to General Consensus',
    bodyTr: 'Kur\'an, genel kabule göre 25 peygamberi ismiyle zikreder. İslam geleneğinde 124.000 peygamber gönderildiği rivayet edilir. Bu 25\'in her biri farklı bir insanlık dersini taşır: sabır, adalet, tövbe, tevekkül... ℹ Zülkifl başta olmak üzere bazı isimlerin peygamberliği klasik tefsirde tartışmalıdır.',
    bodyEn: 'The Quran names 25 prophets according to general scholarly consensus. Islamic tradition holds that 124,000 prophets were sent. Each of these 25 carries a distinct lesson: patience, justice, repentance, trust... ℹ The prophethood of some figures, notably Dhul-Kifl, is debated in classical exegesis.',
    wowTr: '124.000\'den 25 — her biri bir ders, hepsi bir sistem.',
    wowEn: '25 out of 124,000 — each a lesson, together a system.',
    explore: 'musa',
  },

  {
    category: 'sayisal',
    surahRef: 'Er-Rahmân · 55',
    titleTr: '"Febieyyi âlâi" — 31 Kez Tekrar',
    titleEn: '"Febieyyi ala\'i" — Repeated 31 Times',
    bodyTr: 'Er-Rahman suresinde "Febieyyi âlâi Rabbikümâ tükezzibân" (Rabbinizin hangi nimetlerini yalanlıyorsunuz?) ayeti tam 31 kez tekrar eder. Kur\'an\'ın en çok tekrar eden ayetidir. Her tekrar farklı bir nimeti saydıktan sonra geliyor — retorik bir mühür gibi.',
    bodyEn: 'In Surah Ar-Rahman, the verse "Febieyyi ala\'i Rabbikuma tukadhdhibhan" (Which of your Lord\'s favors will you deny?) repeats exactly 31 times. It is the most repeated verse in the Quran. Each repetition follows the mention of a different blessing — like a rhetorical seal.',
    wowTr: '31 kez soru — her biri farklı bir nimeti mühürler.',
    wowEn: '31 repetitions — each sealing a different blessing.',
    explore: 'rahman',
  },
  {
    category: 'sayisal',
    surahRef: 'Çeşitli sureler',
    titleTr: '14 Secde Ayeti — Okuyucuya Doğrudan Emir',
    titleEn: '14 Prostration Verses — A Direct Command to the Reader',
    bodyTr: 'Kur\'an\'da 14 ayet secde emri içerir; bu ayetleri okuyan ya da duyan kişinin secde etmesi sünnet ya da vacibtir. Bunların 4\'ü vacip, 10\'u sünnet secde olarak değerlendirilir. Sure Hac\'da iki adet secde ayeti bulunur — bu onu diğer tüm surelerden ayıran tek özelliktir.',
    bodyEn: 'The Quran contains 14 prostration verses; whoever recites or hears them is expected to prostrate. 4 are considered obligatory (wajib) and 10 are recommended (sunnah). Surah Al-Hajj uniquely contains two — making it the only surah with a double prostration.',
    wowTr: '14 noktada metin durur ve okuyucuya doğrudan seslenir: "Şimdi secde et."',
    wowEn: '14 points where the text pauses and speaks directly to the reader: "Now prostrate."',
  },

  // ── YAPISAL ──────────────────────────────────────────────────────────────────
  {
    category: 'yapisal',
    surahRef: 'Et-Tevbe · 9 / En-Neml · 27',
    titleTr: 'Bir Eksik, Bir Fazla — Denge Bozulmaz',
    titleEn: 'One Missing, One Extra — Balance Unbroken',
    bodyTr: 'Et-Tevbe, Kur\'an\'ın tek bismillahsız suresidir. Bunun yerine En-Neml\'de (27:30) iki bismillah geçer. Toplam bismillah sayısı yine 114 eder.',
    bodyEn: 'At-Tawbah is the only surah without an opening Bismillah. In its place, An-Naml has two Bismillahs (27:30). The total remains exactly 114.',
    wowTr: 'Eksiklik fazlalıkla dengelendi. Hiçbir şey bozulmadı.',
    wowEn: 'The deficit was offset by surplus. Nothing was broken.',
    scrollTo: 'linguistic',
  },
  {
    category: 'yapisal',
    surahRef: 'El-Fâtiha · 1',
    titleTr: 'Fatiha Allah\'ı İsmiyle Değil Sıfatlarıyla Tanıtır',
    titleEn: 'Al-Fatiha Introduces God Through Attributes, Not Name',
    bodyTr: 'Kur\'an\'ın açılış suresinde "Allah" ismi hiç geçmez. Yalnızca sıfat isimleri kullanılır: Rabb (Terbiye eden), Rahman (Çok merhametli), Rahim (Daima merhametli), Malik (Hüküm sahibi). Kur\'an, okuyucuyu Allah\'a isimden önce niteliklerle tanıştırıyor.',
    bodyEn: 'The opening surah of the Quran never uses the name "Allah". Only attribute-names appear: Rabb (the Sustainer), Rahman (the All-Merciful), Rahim (the Ever-Merciful), Malik (the Master). The Quran introduces God through qualities before the name.',
    wowTr: 'Açılış suresi ismi değil, vasfı öne çıkarır — bu bir tercih, bir davet.',
    wowEn: 'The opening surah leads with attributes, not name — a choice, an invitation.',
    explore: 'allah',
  },
  {
    category: 'yapisal',
    surahRef: 'El-Fâtiha · 1',
    titleTr: 'Fatiha: 7 Ayet, Merkez Tam Ortada',
    titleEn: 'Al-Fatiha: 7 Verses, Center Perfectly Placed',
    bodyTr: 'Fatiha 7 ayettir. Tam ortadaki 4. ayet: "Yalnız sana ibadet eder, yalnız senden yardım dileriz." İnsan-Tanrı ilişkisinin özü, geometrik merkezde.',
    bodyEn: 'Al-Fatiha has 7 verses. The exact middle (4th) verse: "You alone we worship, You alone we ask for help." The essence of the human-God relationship — at the geometric center.',
    wowTr: 'Anlam, surenin tam kalbinde durur.',
    wowEn: 'Meaning stands at the exact heart of the surah.',
    scrollTo: 'hidden-architecture',
  },
  {
    category: 'yapisal',
    surahRef: 'El-Kevser · 108',
    titleTr: 'En Kısa Sure — En Yoğun Teselli',
    titleEn: 'The Shortest Surah — The Most Intense Consolation',
    bodyTr: 'El-Kevser, Kur\'an\'ın en kısa suresidir: 3 ayet, yaklaşık 10 kelime. Hz. Peygamber\'in oğlunun vefatıyla derin üzüntüye düştüğü dönemde indi.',
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
    bodyTr: 'Kur\'an\'ın en uzun ayeti, bir borç sözleşmesini düzenler: yazılı belge, iki erkek ya da bir erkek iki kadın tanık, yazanın adil olması... Modern hukuk ilkelerinin 7. yüzyıl versiyonu.',
    bodyEn: 'The Quran\'s longest verse governs a debt contract: written documentation, two male or one male two female witnesses, a fair scribe... A 7th-century version of modern legal principles.',
    wowTr: 'İman sayfasının en uzun ayeti, hukuk ayrıntısı içerir.',
    wowEn: 'The longest verse in a book of faith contains legal detail.',
    explore: 'bakara',
  },
  {
    category: 'yapisal',
    surahRef: '29 sure',
    titleTr: 'Huruf-i Mukattaâ — 1.400 Yıllık Şifre',
    titleEn: 'Muqatta\'at Letters — A 1,400-Year Cipher',
    bodyTr: '29 sure gizemli harflerle başlar: Elif-Lâm-Mîm, Hâ-Mîm, Yâ-Sîn... Bu harflerin ne anlama geldiğini kesin olarak kimse bilmiyor. 1.400 yıldır çözülemeyen tek şifre.',
    bodyEn: '29 surahs open with mysterious letters: Alif-Lam-Mim, Ha-Mim, Ya-Sin... No one knows with certainty what they mean. A cipher unsolved for 1,400 years.',
    wowTr: 'Tanrı\'nın kitabının başında, insanın anlayamadığı harfler durur.',
    wowEn: 'At the start of God\'s book stand letters that humanity cannot decode.',
    scrollTo: 'linguistic',
  },
  {
    category: 'yapisal',
    surahRef: 'Çeşitli sureler',
    titleTr: 'Halka Yapısı — Surelerin Büyük Çoğunluğu',
    titleEn: 'Ring Composition — The Majority of All Surahs',
    bodyTr: 'Raymond Farrin\'in araştırması surelerin önemli bir çoğunluğunun chiastic (halka) yapıya sahip olduğunu göstermektedir: A-B-C-Merkez-C\'B\'A\'. Fatiha bunun en yalın örneğidir. Bu yapı Kur\'an öncesi Arapça edebiyatta bilinmiyordu.',
    bodyEn: 'Raymond Farrin\'s research shows that a significant majority of surahs follow a chiastic (ring) structure: A-B-C-Center-C\'B\'A\'. Al-Fatiha is its simplest example. This structure was unknown in pre-Quranic Arabic literature.',
    wowTr: 'Kur\'an, edebiyatın bilmediği bir formu icad etti.',
    wowEn: 'The Quran invented a literary form that literature didn\'t know.',
    scrollTo: 'hidden-architecture',
  },

  {
    category: 'yapisal',
    surahRef: 'El-Fâtiha · 1',
    titleTr: 'Fatiha — Her Gün 40 Kez',
    titleEn: 'Al-Fatiha — 40 Times Every Day',
    bodyTr: 'Günde 5 vakit namaz, toplam 40 rekat (farz + sünnet). Her rekatta Fatiha okunur. Bir yılda 14.600 kez. 70 yıllık bir ömürde yaklaşık 1.022.000 kez. Dünyadaki 1,8 milyar Müslüman her gün birlikte yaklaşık 65 milyar kez okur.',
    bodyEn: '5 daily prayers, 40 total rakats (obligatory + sunnah). Al-Fatiha is recited in each. 14,600 times a year. Approximately 1,022,000 times in a 70-year life. The world\'s 1.8 billion Muslims recite it together approximately 65 billion times every day.',
    wowTr: 'En çok okunan metin — tartışmasız, her gün, her kıtada.',
    wowEn: 'The most recited text — undisputed, every day, on every continent.',
    scrollTo: 'linguistic',
  },
  {
    category: 'yapisal',
    surahRef: 'Çeşitli sureler',
    titleTr: 'Kur\'an Kendini 114 Kez "Kur\'an" Diye Anar',
    titleEn: 'The Quran Names Itself "Quran" 114 Times',
    bodyTr: 'Kur\'an kelimesi, Kur\'an\'ın kendi içinde tam 114 kez geçer — sure sayısıyla birebir aynı. Bismillah 114 kez, sure sayısı 114, Kur\'an kelimesi 114... Yapısal simetri tesadüf ötesine geçiyor.',
    bodyEn: 'The word "Quran" appears exactly 114 times within the Quran itself — identical to the number of surahs. Bismillah 114 times, surahs 114, the word Quran 114... Structural symmetry that goes beyond coincidence.',
    wowTr: 'İsmi, sayısıyla konuşuyor.',
    wowEn: 'Its name speaks through its count.',
    scrollTo: 'linguistic',
  },
  {
    category: 'yapisal',
    surahRef: 'Et-Tevbe · 9',
    titleTr: 'Et-Tevbe\'nin Sırrı — Neden Besmelesiz?',
    titleEn: 'The Mystery of At-Tawbah — Why No Bismillah?',
    bodyTr: 'Et-Tevbe, Kur\'an\'ın 114 suresinden besmelesiz başlayan tek suredir. Klasik alimler üç farklı görüş öne sürmüştür: münafıklara hitap ettiği için, azap hükümlerini içerdiği için ya da Enfal ile tek sure sayılması gerektiği için. 1.400 yıldır kesin cevap yok.',
    bodyEn: 'At-Tawbah is the only one of the Quran\'s 114 surahs that begins without Bismillah. Classical scholars have proposed three explanations: it addresses hypocrites, contains punishment rulings, or should be counted as one surah with Al-Anfal. No definitive answer in 1,400 years.',
    wowTr: '1.400 yıllık soru, 3 cevap, kesin bilgi yalnızca Allah\'ta.',
    wowEn: 'A 1,400-year question, 3 answers, certain knowledge with God alone.',
    scrollTo: 'linguistic',
  },
  {
    category: 'yapisal',
    surahRef: 'Çeşitli sureler',
    titleTr: 'Kur\'an\'da Sıra Ne Uzunluk Ne Kronoloji',
    titleEn: 'The Quran\'s Order: Neither Length Nor Chronology',
    bodyTr: 'Sureler ne uzundan kısaya (Bakara\'dan sonra Âl-i İmrân değil Nisâ geliyor), ne kronolojik (ilk inen Alak 96. sırada), ne alfabetik sıralanmış. Ama araştırmacılar tematik ve halka kompozisyon düzeni keşfetti. Gizli bir düzen var.',
    bodyEn: 'Surahs are not ordered by length (An-Nisa follows Al-Imran, not Al-Baqara\'s closest match), nor chronologically (Al-Alaq — the first revealed — is 96th), nor alphabetically. Yet researchers have found thematic and chiastic patterns. A hidden order exists.',
    wowTr: 'Rastgele görünüyor — ama her denenen düzen çalışıyor.',
    wowEn: 'It looks random — but every tested ordering works.',
    scrollTo: 'hidden-architecture',
  },
  {
    category: 'yapisal',
    surahRef: 'El-Bakara · 2 / El-Kevser · 108',
    titleTr: 'En Uzun Sure, En Kısa Sure — 95\'e 1',
    titleEn: 'Longest Surah, Shortest Surah — 95 to 1',
    bodyTr: 'Bakara 286 ayet, Kevser 3 ayet. Oran 95\'e 1. Ama ikisi de aynı kitapta, aynı dilde, aynı üslupla yazılmış. Bakara bir şeriat kuruyor; Kevser üç kelimeyle bir kalbi sarıyor. Başka hiçbir kutsal metinde bu uç denge yok.',
    bodyEn: 'Al-Baqara has 286 verses; Al-Kawthar has 3. Ratio: 95 to 1. Yet both are in the same book, the same language, the same style. Al-Baqara establishes law; Al-Kawthar heals a heart in three lines. No other scripture holds this extreme balance.',
    wowTr: '3 kelimeyle teselli, 286 ayetle şeriat — ikisi de eksiksiz.',
    wowEn: '3 words of consolation, 286 verses of law — both complete.',
    scrollTo: 'linguistic',
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
    scrollTo: 'history',
  },

  {
    category: 'yapisal',
    surahRef: 'Çeşitli sureler',
    titleTr: '6.236 Ayetin Sadece ~500\'ü Hukuki',
    titleEn: 'Only ~500 of 6,236 Verses Are Legal',
    bodyTr: 'Kur\'an\'ın bir "hukuk kitabı" olduğu yaygın bir yanılgıdır. 6.236 ayetin yalnızca yaklaşık 500\'ü ibadet, muamelat ve ceza hukuku içerir. Geri kalan 5.700\'den fazla ayet ahlak, kıssa, tefekkür, dua ve evren üzerine.',
    bodyEn: 'A common misconception is that the Quran is a "book of law." Of its 6,236 verses, only approximately 500 deal with worship, civil transactions, and criminal law. The remaining 5,700+ verses cover ethics, narrative, contemplation, prayer, and the universe.',
    wowTr: 'Hukuk %8 — geri kalan %92 ruh, anlam ve evren.',
    wowEn: 'Law is 8% — the remaining 92% is soul, meaning, and universe.',
    scrollTo: 'linguistic',
  },
  {
    category: 'yapisal',
    surahRef: 'Eş-Şems · 91',
    titleTr: 'Kur\'an\'ın En Yoğun Yemin Dizisi — 11 Art Arda Yemin',
    titleEn: 'The Quran\'s Most Intense Oath Sequence — 11 Consecutive Oaths',
    bodyTr: 'Şems suresi 11 art arda yemin ile açılır: güneşe, aydınlığına, aya, gündüze, geceye, gökyüzüne, yere ve insanın ruhuna. Her yemin bir sonrakini inşa eder; kozmostan başlayıp insana iner. 8. yeminle ani bir kırılma: "Nefse ve onu şekillendirene yemin ederim." Kur\'an\'ın başka hiçbir suresinde bu yoğunlukta art arda yemin yoktur.',
    bodyEn: 'Surah Ash-Shams opens with 11 consecutive oaths: by the sun, its radiance, the moon, the day, the night, the sky, the earth, and finally the human soul. Each oath builds on the previous, descending from the cosmos to the self. At oath 8, a sudden pivot: "By the soul and by He who shaped it." No other surah in the Quran contains such a dense unbroken oath sequence.',
    wowTr: '11 yemin — kozmosu sahne yapar, sonra insan ruhunu merkeze alır.',
    wowEn: '11 oaths — stages the entire cosmos, then places the human soul at center.',
  },

  // ── PEYGAMBERLER ─────────────────────────────────────────────────────────────
  {
    category: 'peygamberler',
    surahRef: 'Meryem · 19',
    titleTr: 'Kur\'an\'da Adıyla Anılan Tek Kadın',
    titleEn: 'The Only Woman Named in the Quran',
    bodyTr: 'Hz. Meryem, Kur\'an\'da adıyla anılan tek kadındır. Adına ayrılmış bir sure vardır (19. sure). İncil\'de bile bu ayrım bu kadar belirgin değildir.',
    bodyEn: 'Mary (Maryam) is the only woman mentioned by name in the Quran. An entire surah bears her name (19th surah). Even in the Bible, this distinction is not as pronounced.',
    wowTr: 'Bir kadın, Kur\'an\'da adıyla ölümsüzleşti.',
    wowEn: 'One woman was immortalized by name in the Quran.',
    explore: 'meryem',
  },
  {
    category: 'peygamberler',
    surahRef: 'Çeşitli sureler',
    titleTr: 'Hz. Musa — En Çok Anılan Peygamber: 136',
    titleEn: 'Prophet Moses — Most Mentioned: 136 Times',
    bodyTr: 'Hz. Musa, Kur\'an\'da 136 kez adıyla geçen en çok anılan peygamberdir. Hz. Muhammed ise 4 kez. Mesajın sahibi değil, mesajın kendisi ağır basar.',
    bodyEn: 'Prophet Moses (Musa) is the most mentioned prophet by name — 136 times. Prophet Muhammad appears only 4 times. It is not the messenger but the message that carries weight.',
    wowTr: 'En çok anılan, en son gelen değildir.',
    wowEn: 'The most mentioned is not the last to come.',
    explore: 'musa',
  },
  {
    category: 'peygamberler',
    surahRef: 'Çeşitli sureler',
    titleTr: 'Hz. İsa, Hz. Muhammed\'den Daha Fazla Anılır',
    titleEn: 'Jesus Is Mentioned More Than Muhammad',
    bodyTr: 'Hz. İsa Kur\'an\'da 25 kez adıyla geçer, Hz. Muhammed ise 4 kez. Kur\'an, peygamberleri arasında hiyerarşi değil, eşit onur gözetir.',
    bodyEn: 'Jesus (Isa) is mentioned by name 25 times in the Quran; Muhammad only 4 times. The Quran maintains equal honor among its prophets, not hierarchy.',
    wowTr: 'İslam\'ın kitabı, İsa\'yı Muhammed\'den daha sık anar.',
    wowEn: 'The book of Islam mentions Jesus more often than Muhammad.',
    explore: 'isa',
  },
  {
    category: 'peygamberler',
    surahRef: 'Yûsuf · 12',
    titleTr: 'Yûsuf: "En Güzel Kıssa" Tek Surede',
    titleEn: 'Joseph: "The Best of Stories" in One Surah',
    bodyTr: 'Hz. Yûsuf\'un hikâyesi, Kur\'an\'da tamamen tek bir surede anlatılır — 111 ayet boyunca kesintisiz. Kur\'an bu hikâyeye "ahsenü\'l-kasas" (kıssaların en güzeli) adını verir.',
    bodyEn: 'The story of Prophet Joseph is told in a single, unbroken surah — 111 consecutive verses. The Quran itself names it "ahsan al-qasas" — the best of all stories.',
    wowTr: 'Tek nefeste söylenen, tek surede tamamlanan kıssa.',
    wowEn: 'A story told in a single breath, completed in a single surah.',
    explore: 'yusuf',
  },
  {
    category: 'peygamberler',
    surahRef: 'El-Ankebût · 29:14',
    titleTr: 'Hz. Nuh\'un 950 Yılı — Kur\'an\'da Açıkça',
    titleEn: 'Noah\'s 950 Years — Stated Explicitly',
    bodyTr: 'Kur\'an, Hz. Nuh\'un kavmine 950 yıl tebliğ ettiğini açıkça belirtir (29:14). Başka hiçbir kutsal metin bu süreyi bu kadar net vermez.',
    bodyEn: 'The Quran explicitly states that Noah preached to his people for 950 years (29:14). No other scripture gives this duration so precisely.',
    wowTr: '950 yıl. Rakam bulanık değil, kesin.',
    wowEn: '950 years. The number is not vague — it is exact.',
    explore: 'nuh',
  },
  {
    category: 'peygamberler',
    surahRef: 'El-Ahzâb · 33:40',
    titleTr: 'Hz. Muhammed\'in Adı: Yalnızca 4 Kez',
    titleEn: 'Muhammad\'s Name: Only 4 Times',
    bodyTr: 'Hz. Muhammed\'in adı Kur\'an\'da yalnızca 4 kez geçer (3 kez "Muhammed", 1 kez "Ahmed"). Geri kalan 6.232 ayette "Ey Peygamber" veya "Ey Resul" hitabı kullanılır.',
    bodyEn: 'The name Muhammad appears only 4 times in the Quran (3 times "Muhammad", once "Ahmad"). In the remaining 6,232 verses the address is "O Prophet" or "O Messenger".',
    wowTr: 'İsim 4, ses 6.236. Ağırlık seste.',
    wowEn: 'Name: 4. Voice: 6,236. The weight is in the voice.',
    explore: 'muhammed',
  },

  {
    category: 'peygamberler',
    surahRef: 'El-A\'râf · 7:22',
    titleTr: 'Hz. Âdem — Günahta İkisi de Eşit',
    titleEn: 'Adam — Both Equally Responsible',
    bodyTr: 'Tevrat\'ta Âdem\'in suçu büyük ölçüde Havva\'ya yüklenir (Tekvin 3). Kur\'an\'da ise her ikisi birlikte yanılır, her ikisi birlikte pişman olur, her ikisi birlikte af diler. A\'raf 7:22\'de fiiller ikildir: "aldattı", "tattılar", "utandılar", "dediler ki: Rabbimiz, kendimize zulmettik."',
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
    bodyTr: 'Kur\'an peygamberleri idealize etmez. Hz. Yunus, iznini almadan kavmini terk eder ve balığın karnında "Seni tenzih ederim, ben zalimlerden oldum" diye feryat eder (21:87). Hata, pişmanlık, dua, kurtuluş — hepsi açıkça anlatılır. Bu, kitabın insani dürüstlüğünün belgesidir.',
    bodyEn: 'The Quran does not idealize its prophets. Jonah leaves his people without permission and cries from inside the whale: "Glory be to You, I have been among the wrongdoers" (21:87). Error, regret, prayer, salvation — all told plainly. This is the book\'s human honesty on record.',
    wowTr: 'Tanrı\'nın elçisi hata etti — ve Kur\'an bunu saklamadı.',
    wowEn: 'God\'s messenger erred — and the Quran did not hide it.',
    explore: 'yunus',
  },
  {
    category: 'peygamberler',
    surahRef: 'Meryem · 19 / İncil',
    titleTr: 'Hz. Meryem — Bazı Havarilerden Daha Çok Anılıyor',
    titleEn: 'Mary — More Mentioned Than Some Apostles',
    bodyTr: 'Hz. Meryem Kur\'an\'da 34 ayette geçer ve adını taşıyan bir sure vardır. İncil\'deki bazı havariler (Bartholomew, Thaddaeus) neredeyse hiç anılmıyor. İslam\'ın kutsal kitabında bir kadın, Hristiyan geleneğin bazı erkek azizlerinden daha fazla yer buluyor.',
    bodyEn: 'Mary appears in 34 verses of the Quran and has an entire surah named after her. Some apostles in the Bible (Bartholomew, Thaddaeus) are barely mentioned. In Islam\'s scripture, a woman holds more space than some male saints of Christian tradition.',
    wowTr: 'En büyük erkek dinlerin kitabında, bir kadın tarihin en onurlu yerinde.',
    wowEn: 'In the book of the world\'s largest faith, a woman holds one of history\'s most honored places.',
    explore: 'meryem',
  },
  {
    category: 'peygamberler',
    surahRef: 'El-Ahzâb · 33:37',
    titleTr: 'Zeyd ibn Hârise — Adı Geçen Tek Sahabe',
    titleEn: 'Zayd ibn Harithah — The Only Companion Named',
    bodyTr: '124.000 sahabenin arasından yalnızca Zeyd ibn Hârise adıyla Kur\'an\'da geçer (33:37). Hz. Peygamber\'in azatlı kölesi ve evlatlığıydı. O ayet, evlatlık kurumuna dair cahiliye geleneğini kökten değiştiren bir hüküm taşıyordu — tarihi olayı tescillemek için isim zorunluydu.',
    bodyEn: 'Of 124,000 companions, only Zayd ibn Harithah is named by name in the Quran (33:37). He was the Prophet\'s freed slave and adopted son. That verse carried a ruling that fundamentally abolished the pre-Islamic institution of adoption — the historical event required the name.',
    wowTr: '124.000 sahabe, Kur\'an yalnızca birinin adını söyledi.',
    wowEn: '124,000 companions — the Quran named only one.',
    explore: 'zeyd',
  },
  {
    category: 'peygamberler',
    surahRef: 'Çeşitli sureler',
    titleTr: 'Hz. İbrahim — Duaları En Çok Aktarılan Peygamber',
    titleEn: 'Abraham — The Prophet Whose Prayers Are Most Recorded',
    bodyTr: 'Kur\'an\'da Hz. İbrahim\'in ağzından 10\'dan fazla farklı dua aktarılır. Başka hiçbir peygamberin bu kadar çeşitli ve ayrıntılı duaları yer almaz. Her biri farklı bir insani ihtiyacı seslendiriyor: çocuk, barış, hidayet, rızık, af...',
    bodyEn: 'More than 10 distinct supplications of Prophet Abraham are recorded in the Quran. No other prophet has as many diverse and detailed prayers preserved. Each voices a different human need: offspring, peace, guidance, provision, forgiveness...',
    wowTr: 'Dua dilini Kur\'an\'a o öğretti.',
    wowEn: 'He taught the Quran the language of prayer.',
    explore: 'ibrahim',
  },

  // ── AZ BİLİNEN ───────────────────────────────────────────────────────────────
  {
    category: 'azBilinen',
    surahRef: 'El-Alak · 96:1',
    titleTr: 'İlk Ayet Okumayı Emreder',
    titleEn: 'First Verse Commands Reading',
    bodyTr: 'Kur\'an\'ın ilk inen ayeti "İkra" (Oku) emriyle başlar. 7. yüzyıl Arabistan\'ında okuma oranı %5\'in altındaydı. Kitap, önce okuyucusunu icat etti.',
    bodyEn: 'The first verse ever revealed begins with "Iqra" (Read). In 7th-century Arabia, literacy was below 5%. The book first invented its reader.',
    wowTr: 'Kitap, okuyucusundan önce geldi.',
    wowEn: 'The book arrived before the reader.',
    scrollTo: 'science',
  },
  {
    category: 'azBilinen',
    surahRef: 'El-Kehf · 18:25',
    titleTr: 'Ashab-ı Kehf: 300 = 309',
    titleEn: 'People of the Cave: 300 = 309',
    bodyTr: 'Kehf suresi, mağara ashâbının 300 yıl uyuduğunu söyler, ardından "ya da 309" ekler (18:25). 300 güneş yılı = tam 309 ay yılı. Kur\'an, iki takvimi aynı anda hesaplar.',
    bodyEn: 'Surah Al-Kahf says the cave dwellers slept 300 years, then adds "or 309" (18:25). 300 solar years = exactly 309 lunar years. The Quran calculates both calendars simultaneously.',
    wowTr: 'İki takvim, tek ayette, tam uyum.',
    wowEn: 'Two calendars. One verse. Perfect match.',
    explore: 'kehf',
  },
  {
    category: 'azBilinen',
    surahRef: 'El-Alak · 96:15-16',
    titleTr: '"Alın" — Beynin Yalan Merkezi',
    titleEn: '"Forehead" — The Brain\'s Lying Center',
    bodyTr: 'Kur\'an yalancıyı "alından" yakalar (96:15-16). Modern nörobilim: prefrontal korteks (alnın hemen arkası) yalan söyleme ve ahlaki muhakeme merkezidir. fMRI çalışmalarıyla desteklenmektedir.',
    bodyEn: 'The Quran says the liar will be seized by the "forelock" (96:15-16). Modern neuroscience: the prefrontal cortex (just behind the forehead) is the center for lying and moral reasoning. Supported by fMRI studies.',
    wowTr: '7. yüzyılda alın, beyin nörobilimi bilmeden gösterildi.',
    wowEn: 'In the 7th century, the forehead was pointed to without knowing neuroscience.',
    scrollTo: 'science',
  },
  {
    category: 'azBilinen',
    surahRef: 'El-Kıyâme · 75:4',
    titleTr: '"Parmak Uçları" — Benzersiz Kimlik',
    titleEn: '"Fingertips" — Unique Identity',
    bodyTr: '"Parmak uçlarını bile yeniden düzeltmeye kadiriz" (75:4). Tüm organlar arasında neden özellikle parmak uçları? 1880\'lerde belgelendi: Her insanın parmak izi eşsizdir. İkizlerde bile.',
    bodyEn: '"We are able to restore even his fingertips" (75:4). Of all body parts, why specifically fingertips? Documented in the 1880s: every person\'s fingerprint is unique. Even in identical twins.',
    wowTr: '1880\'lerde belgelenen, 7. yüzyılda işaret edildi.',
    wowEn: 'Documented in the 1880s. Pointed to in the 7th century.',
    scrollTo: 'science',
  },
  {
    category: 'azBilinen',
    surahRef: 'Er-Rahmân · 55',
    titleTr: '"Rahman" — Kur\'an\'ın Hediye Ettiği İsim',
    titleEn: '"Rahman" — A Name the Quran Gifted to Arabic',
    bodyTr: '"Rahman" ismi, Kur\'an öncesi Arap şiirinde neredeyse hiç kullanılmıyordu. Kur\'an ile birlikte hem dile hem teolojiye yerleşti. Bir kelime, 1.400 yılda ölmedi.',
    bodyEn: 'The name "Rahman" was virtually absent from pre-Quranic Arabic poetry. The Quran embedded it into both the language and theology. A word that has not died in 1,400 years.',
    wowTr: 'Kur\'an, kelimeleri de var etti.',
    wowEn: 'The Quran also created words.',
    explore: 'rahman',
  },
  {
    category: 'azBilinen',
    surahRef: 'El-Fâtiha · 1',
    titleTr: 'Fatiha: İnsan Konuşur, Allah Söyler',
    titleEn: 'Al-Fatiha: Human Speaks, God Says',
    bodyTr: 'Fatiha, insanın her namazda Allah\'a yöneldiği duadır. Ama aynı zamanda Allah\'ın vahiy olarak indirdiği sözdür — Kur\'an\'ın bir parçası. Her okuyuşta, insanın duası ve ilahi kelam tek bir anda buluşur.',
    bodyEn: 'Al-Fatiha is the supplication a person directs to God in every prayer. Yet it is simultaneously God\'s revealed word — a part of the Quran. In every recitation, human supplication and divine word meet in a single moment.',
    wowTr: 'Dua eden insanın sözü, aynı anda Tanrı\'nın sözüdür.',
    wowEn: 'The prayer of the human is simultaneously the word of God.',
    scrollTo: 'linguistic',
  },
  {
    category: 'azBilinen',
    surahRef: 'El-Hucurât · 49',
    titleTr: 'Modern Sosyoloji — 18 Ayette',
    titleEn: 'Modern Sociology — In 18 Verses',
    bodyTr: 'Hucurât suresi 18 ayette şunları ele alır: ırkçılığın yasaklanması, dedikodu, lakap takma, zan, kardeşlik. 7. yüzyılda yazılan, 21. yüzyılda okunması gereken bir medeniyet programı.',
    bodyEn: 'Surah Al-Hujurat addresses in 18 verses: prohibition of racism, gossip, labeling, suspicion, and commands of brotherhood. A civilization program written in the 7th century, needed in the 21st.',
    wowTr: '18 ayette bir medeniyet programı.',
    wowEn: 'A civilization program in 18 verses.',
    explore: 'hucurat',
  },
  {
    category: 'azBilinen',
    surahRef: 'Fussilet · 41:11, Çeşitli sureler',
    titleTr: 'Kur\'an\'da Modern Bilim Terimleriyle Örtüşen Kelimeler',
    titleEn: 'Quranic Words That Overlap With Modern Science',
    bodyTr: '"Duhân" (duman/gaz bulutu, Fussilet 41:11) modern kozmolojide nebula ile örtüşüyor. "Zerre" (atom boyutunda birim) modern fizik terminolojisini önceden işaret ediyor. "Ufuk" kavramı, görelilik teorisinin sınır tanımıyla uyumlu. ℹ Bu örtüşmeler ilgi çekici, ama "mucize" nitelendirmesi aşırıya kaçmadan yapılmalı.',
    bodyEn: '"Dukhan" (smoke/gaseous matter, Fussilet 41:11) overlaps with modern cosmology\'s nebular concept. "Dharra" (atom-scale unit) anticipates modern physics terminology. "Ufuq" (horizon) aligns with relativity\'s boundary concepts. ℹ These overlaps are intriguing, but calling them "miracle" requires careful framing.',
    wowTr: '7. yüzyıl metni, 21. yüzyıl terimleriyle konuşuyor.',
    wowEn: 'A 7th-century text speaking in 21st-century terms.',
    scrollTo: 'science',
  },
  {
    category: 'azBilinen',
    surahRef: 'Çeşitli sureler',
    titleTr: 'Kur\'an\'da "Çöl" Kelimesi Geçmez',
    titleEn: '"Desert" Does Not Appear in the Quran',
    bodyTr: 'Arabistan\'da inen bir kitapta "çöl" kelimesi Kur\'an\'da yer almaz. "Deve" ise Arapçada 6 farklı sözcükle ifade edilebilir — Kur\'an bunları çok sınırlı kullanır. Bir metnin neyi söylemediği de anlam taşır.',
    bodyEn: 'A book revealed in Arabia contains no word for "desert." "Camel" can be expressed in 6 different Arabic words — the Quran uses them sparingly. What a text chooses not to say also carries meaning.',
    wowTr: 'Söylediği kadar söylemediği de bir mimari.',
    wowEn: 'What it omits is as deliberate as what it includes.',
    scrollTo: 'linguistic',
  },
  {
    category: 'azBilinen',
    surahRef: 'Çeşitli sureler',
    titleTr: 'Kur\'an\'ın Sesi — Hiçbir Dile Tam Çevrilemiyor',
    titleEn: 'The Quran\'s Voice — Untranslatable Into Any Language',
    bodyTr: '"Rahman" Türkçe\'ye tam geçmiyor. "Takva" tek kelimeyle karşılanamıyor. "Sabr" yalnızca sabır değil. Dilbilimciler Kur\'an Arapçasının yaklaşık 300 kavramının başka dillerde tam karşılığı olmadığını söylüyor. Bu yüzden Kur\'an\'ın "çevirisi" değil, "meali" var.',
    bodyEn: '"Rahman" has no exact English equivalent. "Taqwa" cannot be captured in one word. "Sabr" is not simply patience. Linguists estimate around 300 Quranic Arabic concepts have no full equivalent in other languages. This is why the Quran has "translations of meaning," not translations.',
    wowTr: 'Çevirilen değil, yaşanan bir dil.',
    wowEn: 'A language not to be translated, but to be lived.',
    scrollTo: 'linguistic',
  },
  {
    category: 'azBilinen',
    surahRef: 'El-Asr · 103',
    titleTr: 'El-Asr — 14 Kelime, Tüm Rehber',
    titleEn: 'Al-Asr — 14 Words, Complete Guide',
    bodyTr: 'El-Asr: 3 ayet, yaklaşık 14 kelime. İmam Şafii şöyle dedi: "Bu sure Kur\'an\'ın tamamını özetliyor." Zaman yemini, insanın hüsranı, kurtuluşun 4 şartı (iman, amel, hak, sabır) — hepsi 3 ayette.',
    bodyEn: 'Al-Asr: 3 verses, approximately 14 words. Imam al-Shafi\'i said: "This surah alone summarizes the entire Quran." An oath by time, humanity\'s loss, and the 4 conditions of salvation (faith, deeds, truth, patience) — all in 3 verses.',
    wowTr: '14 kelime, tüm insanlık rehberi.',
    wowEn: '14 words, a complete guide for all humanity.',
    explore: 'asr',
  },
  {
    category: 'azBilinen',
    surahRef: 'Çeşitli sureler',
    titleTr: 'Kur\'an\'ın Kendine Verdiği 70+ İsim',
    titleEn: 'The Quran\'s 70+ Names for Itself',
    bodyTr: 'Kur\'an kendini 70\'ten fazla farklı isimle tanımlar: Furkan (ayırt eden), Zikir (hatırlatıcı), Hüda (rehber), Şifa (iyileştirici), Nur (ışık), Kerim (cömert), Mübîn (açıklayan)... Her isim farklı bir işlev, farklı bir perspektif.',
    bodyEn: 'The Quran uses over 70 different names for itself: Furqan (the criterion), Dhikr (the reminder), Huda (the guide), Shifa (the healer), Nur (the light), Karim (the generous), Mubin (the clarifier)... Each name is a different function, a different perspective.',
    wowTr: 'Tanrı\'nın kitabı kendini tanımlıyor — 70 farklı şekilde.',
    wowEn: 'God\'s book defines itself — in 70 different ways.',
    scrollTo: 'linguistic',
  },
];

// ── WowCard ──────────────────────────────────────────────────────────────────

function WowCard({ fact, language, onClose }) {
  const cfg = CATEGORY_CONFIG[fact.category];
  const [hovered, setHovered] = useState(false);

  const handleExplore = () => {
    if (fact.explore) {
      window.dispatchEvent(new CustomEvent('openVerseGraph', { detail: { search: fact.explore, returnToWow: true } }));
      onClose();
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
        borderTop: `1px solid ${hovered ? cfg.color + '33' : 'rgba(255,255,255,0.08)'}`,
        borderRight: `1px solid ${hovered ? cfg.color + '33' : 'rgba(255,255,255,0.08)'}`,
        borderBottom: `1px solid ${hovered ? cfg.color + '33' : 'rgba(255,255,255,0.08)'}`,
        borderLeft: `3px solid ${cfg.color}`,
        borderRadius: '12px',
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
          borderRadius: '10px',
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
        color: '#d4a574',
        fontSize: '0.95rem',
        fontWeight: 600,
        fontFamily: "'Inter', sans-serif",
        lineHeight: 1.4,
      }}>
        {language === 'tr' ? fact.titleTr : fact.titleEn}
      </div>

      {/* Body */}
      <div style={{
        color: '#94a3b8',
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
        borderTop: '1px solid rgba(255,255,255,0.05)',
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
            borderRadius: '6px',
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
        .wow-scroll::-webkit-scrollbar-thumb { background: rgba(212,165,116,0.2); border-radius: 3px; }
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
          position: 'fixed', inset: 0, zIndex: 9999,
          background: '#080a1e',
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
            <span style={{ color: '#d4a574', fontSize: '1.1rem', lineHeight: 1 }}>✦</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
              <span style={{
                color: '#d4a574', fontWeight: 700, fontSize: '0.9rem',
                fontFamily: "'Inter', sans-serif", letterSpacing: '0.01em',
              }}>
                {language === 'tr' ? "Kur'an'ı Tanı" : 'Meet the Quran'}
              </span>
              <span style={{ color: 'rgba(148,163,184,0.5)', fontSize: '0.68rem', fontFamily: "'Inter', sans-serif" }}>
                {language === 'tr' ? 'Az bilinen, şaşırtan gerçekler' : 'Hidden gems & surprising facts'}
              </span>
            </div>
            <span style={{
              background: 'rgba(212,165,116,0.1)', border: '1px solid rgba(212,165,116,0.2)',
              borderRadius: '12px', color: 'rgba(212,165,116,0.8)',
              fontSize: '0.68rem', fontFamily: "'Inter', sans-serif",
              padding: '2px 10px', fontWeight: 600,
            }}>
              {filtered.length} {language === 'tr' ? 'gerçek' : 'facts'}
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Kapat"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '6px', color: '#64748b',
              cursor: 'pointer', padding: '5px 12px',
              fontSize: '0.8rem', fontFamily: "'Inter', sans-serif",
              transition: 'background 0.15s, color 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; e.currentTarget.style.color = '#94a3b8'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#64748b'; }}
          >
            ✕
          </button>
        </div>

        {/* Search + Category filters */}
        <div style={{
          flexShrink: 0,
          padding: '12px 20px 0',
          background: 'rgba(8,10,18,0.92)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          display: 'flex', flexDirection: 'column', gap: '10px',
        }}>
          {/* Search */}
          <div style={{ position: 'relative', maxWidth: '480px' }}>
            <svg
              width="14" height="14" viewBox="0 0 24 24"
              fill="none" stroke="rgba(148,163,184,0.4)" strokeWidth="2" strokeLinecap="round"
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
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '8px',
                color: '#e8e6e3', fontFamily: "'Inter', sans-serif", fontSize: '0.85rem',
                padding: '8px 12px 8px 36px',
                outline: 'none',
                transition: 'border-color 0.15s',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = 'rgba(212,165,116,0.35)'; }}
              onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
            />
          </div>

          {/* Category tabs */}
          <div style={{
            display: 'flex', gap: '4px',
            overflowX: 'auto', paddingBottom: '10px',
          }}>
            {allCategories.map(({ key, labelTr, labelEn, color }) => {
              const isActive = activeCategory === key;
              const tabColor = key === 'all' ? '#d4a574' : color;
              return (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  style={{
                    flexShrink: 0,
                    background: isActive ? tabColor + '18' : 'transparent',
                    border: `1px solid ${isActive ? tabColor + '55' : 'rgba(255,255,255,0.07)'}`,
                    borderRadius: '8px',
                    color: isActive ? tabColor : 'rgba(148,163,184,0.6)',
                    cursor: 'pointer',
                    fontSize: '0.78rem', fontWeight: isActive ? 600 : 400,
                    fontFamily: "'Inter', sans-serif",
                    padding: '5px 13px',
                    transition: 'all 0.15s',
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
                    borderRadius: '6px',
                    color: isActive ? tabColor : 'rgba(148,163,184,0.5)',
                    fontSize: '0.65rem', fontWeight: 600,
                    padding: '1px 6px',
                    transition: 'all 0.15s',
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
              color: 'rgba(148,163,184,0.4)', fontFamily: "'Inter', sans-serif", fontSize: '0.9rem',
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
