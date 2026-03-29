import { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

const CATEGORY_CONFIG = {
  sayisal:      { color: '#d4a574', labelTr: 'Sayısal',      labelEn: 'Numerical'   },
  yapisal:      { color: '#3498db', labelTr: 'Yapısal',      labelEn: 'Structural'  },
  peygamberler: { color: '#2ecc71', labelTr: 'Peygamberler', labelEn: 'Prophets'    },
  azBilinen:    { color: '#a78bfa', labelTr: 'Az Bilinen',   labelEn: 'Hidden Gems' },
};

const CATEGORY_ORDER = ['sayisal', 'yapisal', 'peygamberler', 'azBilinen'];

const FACTS = [
  // ── SAYISAL ──────────────────────────────────────────────────────────────────
  {
    category: 'sayisal',
    surahRef: 'El-Bakara · 2',
    titleTr: '"Dünya" ve "Ahiret" — Tam Denge',
    titleEn: '"World" and "Hereafter" — Perfect Balance',
    bodyTr: '"Dünya" kelimesi Kur\'an\'da tam 115 kez, "ahiret" kelimesi de tam 115 kez geçer. 23 yılda, yüzlerce farklı ayette, ikisi de eşit ağırlıktadır.',
    bodyEn: 'The word "world" (dunya) appears exactly 115 times and "hereafter" (akhira) also 115 times. Across 23 years and hundreds of different verses — both carry equal weight.',
    wowTr: 'İki zıt kavram, sıfır hata payıyla dengelenmiştir.',
    wowEn: 'Two opposite concepts, balanced with zero margin of error.',
    explore: 'dünya',
  },
  {
    category: 'sayisal',
    surahRef: 'Çeşitli sureler',
    titleTr: 'Melekler ve Şeytanlar — 88 = 88',
    titleEn: 'Angels and Devils — 88 = 88',
    bodyTr: '"Melek" kelimesi 88 kez, "şeytan" kelimesi de 88 kez geçer. İyi ve kötü, sayısal olarak tam dengede.',
    bodyEn: '"Angel" appears 88 times; "devil" (shaytan) also 88 times. Good and evil are numerically equal.',
    wowTr: 'Zıtların kusursuz simetrisi: 88 = 88.',
    wowEn: 'The perfect symmetry of opposites: 88 = 88.',
    explore: 'melek',
  },
  {
    category: 'sayisal',
    surahRef: 'Çeşitli sureler',
    titleTr: 'Hayat ve Ölüm — 145 = 145',
    titleEn: 'Life and Death — 145 = 145',
    bodyTr: '"Hayat" kelimesi 145 kez, "ölüm" kelimesi de 145 kez geçer. Kur\'an\'ın en büyük zıt çifti, 23 yıllık vahyin ardından mükemmel dengede.',
    bodyEn: '"Life" (hayat) appears 145 times, "death" (mawt) also 145 times. The greatest opposing pair in the Quran — perfectly balanced after 23 years of revelation.',
    wowTr: 'Hayat ve ölüm, eşit ağırlıkta taşınır.',
    wowEn: 'Life and death are carried with equal weight.',
    explore: 'hayat',
  },
  {
    category: 'sayisal',
    surahRef: 'Çeşitli sureler',
    titleTr: 'Gün ve Ay — Takvim Kur\'an\'da',
    titleEn: 'Day and Month — The Calendar in the Quran',
    bodyTr: '"Gün" kelimesi 365 kez geçer — bir güneş yılındaki gün sayısı. "Ay" kelimesi ise 12 kez geçer — bir yıldaki ay sayısı.',
    bodyEn: '"Day" (yawm) appears 365 times — the days in a solar year. "Month" (shahr) appears 12 times — the months in a year.',
    wowTr: 'Takvim başlamadan, Kur\'an sayıyordu.',
    wowEn: 'Before the calendar existed, the Quran was already counting.',
    explore: null,
  },
  {
    category: 'sayisal',
    surahRef: 'Çeşitli sureler',
    titleTr: 'Deniz ve Kara — Dünya\'nın Gerçek Oranı',
    titleEn: 'Sea and Land — Earth\'s Real Ratio',
    bodyTr: '"Deniz" Kur\'an\'da 32 kez, "kara" 13 kez geçer. Oran: %71,1 / %28,9. Dünya yüzeyinin gerçek dağılımı: Deniz %71,1, Kara %28,9.',
    bodyEn: '"Sea" appears 32 times, "land" 13 times in the Quran. Ratio: 71.1% / 28.9%. Earth\'s actual surface distribution: Sea 71.1%, Land 28.9%.',
    wowTr: 'Kur\'an, haritadan önce yüzdeyi biliyordu.',
    wowEn: 'The Quran knew the percentage before maps existed.',
    explore: 'deniz',
  },
  {
    category: 'sayisal',
    surahRef: 'Çeşitli sureler',
    titleTr: '"Bismillah" 114 Kez — Sure Sayısıyla Aynı',
    titleEn: '"Bismillah" 114 Times — Equal to the Surah Count',
    bodyTr: 'Kur\'an\'da 114 sure vardır. Bismillah 113 surenin başında geçer, bir kez de Neml 27:30\'da ayet içinde. Toplam: tam 114.',
    bodyEn: 'The Quran has 114 surahs. Bismillah opens 113 of them, and appears once more in An-Naml 27:30 inside a verse. Total: exactly 114.',
    wowTr: '"Bismillah" sayısı, sure sayısını yansıtır.',
    wowEn: 'The count of "Bismillah" mirrors the number of surahs.',
    explore: null,
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
    scrollTo: null,
    explore: null,
  },
  {
    category: 'sayisal',
    surahRef: 'El-Kadr · 97',
    titleTr: 'Kadir Suresi — Tam 30 Kelime',
    titleEn: 'Surah Al-Qadr — Exactly 30 Words',
    bodyTr: 'Kadir suresinin tamamı tam 30 kelimeden oluşur. Bir ay 30 gün, Kadir gecesi Ramazan ayının en kutsal gecesidir.',
    bodyEn: 'Surah Al-Qadr contains exactly 30 words. A month has 30 days; Laylat al-Qadr is the holiest night of the month of Ramadan.',
    wowTr: 'Sure, kutsal geceyi takvime gömdü.',
    wowEn: 'The surah embedded the sacred night into the calendar.',
    explore: null,
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
    explore: null,
  },
  {
    category: 'yapisal',
    surahRef: 'El-Fâtiha · 1',
    titleTr: 'Fatiha\'da "Allah" Lafzı Geçmez',
    titleEn: 'No "Allah" in Al-Fatiha',
    bodyTr: 'Kur\'an\'ın açılış suresi Fatiha\'da "Allah" ismi hiç geçmez. Yalnızca sıfat isimleri kullanılır: Rabb, Rahman, Rahim, Malik. İsim değil, vasıf tanıtır.',
    bodyEn: 'The opening surah Al-Fatiha never uses the name "Allah". Only attribute-names appear: Rabb, Rahman, Rahim, Malik. It introduces through qualities, not names.',
    wowTr: 'En büyük isim, sureye sığmaz — vasfıyla tanıtılır.',
    wowEn: 'The greatest name transcends the surah — it is introduced through its attributes.',
    explore: null,
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
    explore: null,
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
    explore: null,
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
    titleTr: 'Halka Yapısı — Surelerin %70\'i',
    titleEn: 'Ring Composition — 70% of All Surahs',
    bodyTr: 'Raymond Farrin\'in araştırmasına göre surelerin %70\'i chiastic (halka) yapıya sahiptir: A-B-C-Merkez-C\'B\'A\'. Fatiha bunun en yalın örneğidir. Bu yapı Kur\'an öncesi Arapça edebiyatta bilinmiyordu.',
    bodyEn: 'According to Raymond Farrin\'s research, 70% of surahs follow a chiastic (ring) structure: A-B-C-Center-C\'B\'A\'. Al-Fatiha is its simplest example. This structure was unknown in pre-Quranic Arabic literature.',
    wowTr: 'Kur\'an, edebiyatın bilmediği bir formu icad etti.',
    wowEn: 'The Quran invented a literary form that literature didn\'t know.',
    scrollTo: 'hidden-architecture',
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
    explore: null,
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
    bodyTr: 'Kur\'an yalancıyı "alından" yakalar (96:15-16). Modern nörobilim: prefrontal korteks (alnın hemen arkası) yalan söyleme ve ahlaki muhakeme merkezidir. fMRI çalışmalarıyla doğrulandı.',
    bodyEn: 'The Quran says the liar will be seized by the "forelock" (96:15-16). Modern neuroscience: the prefrontal cortex (just behind the forehead) is the center for lying and moral reasoning. Confirmed by fMRI studies.',
    wowTr: '7. yüzyılda alın, beyin nörobilimi bilmeden gösterildi.',
    wowEn: 'In the 7th century, the forehead was pointed to without knowing neuroscience.',
    scrollTo: 'science',
  },
  {
    category: 'azBilinen',
    surahRef: 'El-Kıyâme · 75:4',
    titleTr: '"Parmak Uçları" — Benzersiz Kimlik',
    titleEn: '"Fingertips" — Unique Identity',
    bodyTr: '"Parmak uçlarını bile yeniden düzeltmeye kadiriz" (75:4). Tüm organlar arasında neden özellikle parmak uçları? 1892\'de keşfedildi: Her insanın parmak izi eşsizdir. İkizlerde bile.',
    bodyEn: '"We are able to restore even his fingertips" (75:4). Of all body parts, why specifically fingertips? Discovered in 1892: every person\'s fingerprint is unique. Even in identical twins.',
    wowTr: '1892\'de keşfedilen, 7. yüzyılda işaret edildi.',
    wowEn: 'Discovered in 1892. Pointed to in the 7th century.',
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
    bodyTr: 'Fatiha, insanın her namazda Allah\'a söylediği duadır. Ama aynı zamanda Allah\'ın sözüdür — Kur\'an\'ın bir parçası. Her okuyuşta, insanın duası aynı zamanda ilahi kelam olur.',
    bodyEn: 'Al-Fatiha is the prayer a human recites to God in every prayer. Yet it is simultaneously God\'s word — part of the Quran. In every recitation, human prayer and divine word become one.',
    wowTr: 'Dua eden insanın sözü, aynı anda Tanrı\'nın sözüdür.',
    wowEn: 'The prayer of the human is simultaneously the word of God.',
    explore: null,
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
    explore: null,
  },
];

// ── WowCard ──────────────────────────────────────────────────────────────────

function WowCard({ fact, language, onClose }) {
  const cfg = CATEGORY_CONFIG[fact.category];
  const [hovered, setHovered] = useState(false);

  const handleExplore = () => {
    if (fact.explore) {
      window.dispatchEvent(new CustomEvent('openVerseGraph', { detail: { search: fact.explore } }));
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
