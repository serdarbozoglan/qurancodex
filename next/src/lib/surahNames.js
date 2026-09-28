export const SURAH_NAMES_TR = [
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

// EN: IJMES-Lite transliteration standardı — ReadingMode.jsx:645'teki listeyle
// birebir aynı. Sun letter asimilasyonu (Al-/Ar-/As-/At-...) tutarlı uygulanmış.
export const SURAH_NAMES_EN = [
  'Al-Fatihah','Al-Baqarah','Aal-Imran','An-Nisa','Al-Maidah',
  'Al-Anam','Al-Araf','Al-Anfal','At-Tawbah','Yunus',
  'Hud','Yusuf','Ar-Rad','Ibrahim','Al-Hijr','An-Nahl',
  'Al-Isra','Al-Kahf','Maryam','Ta-Ha','Al-Anbiya','Al-Hajj',
  'Al-Muminun','An-Nur','Al-Furqan','Ash-Shuara','An-Naml',
  'Al-Qasas','Al-Ankabut','Ar-Rum','Luqman','As-Sajdah','Al-Ahzab',
  'Saba','Fatir','Ya-Sin','As-Saffat','Sad','Az-Zumar','Al-Mumin',
  'Fussilat','Ash-Shura','Az-Zukhruf','Ad-Dukhan','Al-Jathiyah','Al-Ahqaf',
  'Muhammad','Al-Fath','Al-Hujurat','Qaf','Adh-Dhariyat','At-Tur',
  'An-Najm','Al-Qamar','Ar-Rahman','Al-Waqiah','Al-Hadid','Al-Mujadilah',
  'Al-Hashr','Al-Mumtahanah','As-Saff','Al-Jumuah','Al-Munafiqun',
  'At-Taghabun','At-Talaq','At-Tahrim','Al-Mulk','Al-Qalam','Al-Haqqah',
  'Al-Maarij','Nuh','Al-Jinn','Al-Muzzammil','Al-Muddaththir','Al-Qiyamah',
  'Al-Insan','Al-Mursalat','An-Naba','An-Naziat','Abasa','At-Takwir',
  'Al-Infitar','Al-Mutaffifin','Al-Inshiqaq','Al-Buruj','At-Tariq','Al-Ala',
  'Al-Ghashiyah','Al-Fajr','Al-Balad','Ash-Shams','Al-Layl','Ad-Duha',
  'Ash-Sharh','At-Tin','Al-Alaq','Al-Qadr','Al-Bayyinah','Az-Zalzalah',
  'Al-Adiyat','Al-Qariah','At-Takathur','Al-Asr','Al-Humazah','Al-Fil',
  'Quraysh','Al-Maun','Al-Kawthar','Al-Kafirun','An-Nasr','Tabbat',
  'Al-Ikhlas','Al-Falaq','An-Nas',
];

/** Returns Turkish surah name by 1-based surah number */
export function surahNameTr(surahNumber) {
  return SURAH_NAMES_TR[surahNumber - 1] || `${surahNumber}. Sûre`;
}

/** Returns English surah name by 1-based surah number */
export function surahNameEn(surahNumber) {
  return SURAH_NAMES_EN[surahNumber - 1] || `Sūra ${surahNumber}`;
}

/** Returns locale-aware surah name. locale: 'tr' | 'en'. */
export function surahName(surahNumber, locale) {
  return locale === 'en' ? surahNameEn(surahNumber) : surahNameTr(surahNumber);
}

/**
 * "Şura 42:7" gibi bir referansın SÛRE ADINI hedef dile çevirir (§13.32).
 *
 * NEDEN VAR (2026-09-14): sûre adları veri dosyalarına ve bileşenlere TÜRKÇE
 * gömülmüştü ve İngilizce sayfada da öyle basılıyordu ("Şura 42:7",
 * "Tegabün 64:9"). Elle `refEn` yazmak 34 künyede hataya açıktı; ad, SAYIDAN
 * deterministik olarak üretilir, sayı zaten referansın kendisindedir.
 *
 * Adı DEĞİŞTİRMEZ, yalnız baştaki ad parçasını dile göre yeniden yazar.
 * İçinde "S:A" bulunmayan metin aynen döner (hadis künyesi vb. bozulmasın).
 * Birden çok referans taşıyan metinlerde ("Şura 42:7 · Tegabün 64:9") her
 * parça ayrı ayrı ele alınır.
 */
export function localizeVerseRef(text, locale) {
  if (typeof text !== 'string' || locale !== 'en') return text;
  return text
    .split(/(\s+·\s+)/)
    .map((part) => {
      const m = part.match(/^(.*?)(\b\d{1,3}):(\d{1,3}(?:[-\u2013]\d{1,3})?)(.*)$/);
      if (!m) return part;
      const [, prefix, sNum, ayahPart, suffix] = m;
      const n = parseInt(sNum, 10);
      if (n < 1 || n > 114) return part;
      // Ön ek yalnız harf ve noktalamadan oluşmalı; değilse dokunma.
      if (!/^[\p{L}'\u2019\u02bf\u02be.\-\s]*$/u.test(prefix)) return part;
      // "krş.", "bkz.", "cf." gibi KISALTMALAR sûre adı değildir ve korunur;
      // ad, sayıdan hemen önceki kısaltma-olmayan sözcüklerdir.
      const words = prefix.trim().split(/\s+/).filter(Boolean);
      let cut = 0;
      while (cut < words.length && /\.$/.test(words[cut])) cut++;
      const ABBR = { 'krş.': 'cf.', 'bkz.': 'see', 'krs.': 'cf.' };
      const lead = words.slice(0, cut).map((w) => ABBR[w.toLowerCase()] || w).join(' ');
      const nameWords = words.slice(cut);
      const name = nameWords.length ? surahNameEn(n) : '';
      return (lead ? lead + ' ' : '') + (name ? name + ' ' : '') + sNum + ':' + ayahPart + suffix;
    })
    .join('');
}

// ─── Sûre adı takma adları ──────────────────────────────────────────────────
// Halk arasında yaygın alternatif adlar → SÛRE NUMARASI. Anahtar NORMALİZE
// biçimde (küçük harf, şapkasız, kesme/tire yok; boşluk KORUNUR — arama katmanı
// da boşluğu silmiyor). Arama tarafı sorguyu normalize edip buradan geçirir.
//
// Neden numara, neden ad değil: eskiden değer bir addı ("gafir" → "mumin") ve
// eşleşme alt dize karşılaştırmasıyla yapıldığı için tek sûreyi hedefleyemiyordu
// — "mumin" hem Mü'min (40) hem Mü'minûn (23) ile eşleşiyordu. Numara tek sûreye
// bağlar. Aynı sebeple "amme" ÖNEMLİ: takma ad olmadan "muhammed" kelimesinin
// içindeki "amme" dizisine takılıp kullanıcıyı 47. sûreye götürüyordu.
//
// Yalnız DOĞRULANMIŞ eşlemeler eklenir (§13.30): ya sûrenin kendi ilk âyetinden
// (bizim kanonik metnimizden okundu), ya TDV İslâm Ansiklopedisi'nin ilgili
// sûre maddesinden. Kaynağı olmayan ad eklenmez — yanlış bir takma ad
// kullanıcıyı sessizce başka sûreye götürür.
//
// ÇAKIŞANLAR BİLEREK DIŞARIDA: bir ad birden fazla sûrenin adıysa takma ad
// yapılmaz. Örnekler: "Mücâdele" (Mülk'ün alternatif adı ama 58'in kendi adı),
// "Fetih" (110 için kullanılır ama 48'in kendi adı), çıplak "Kul eûzü" (hem 113
// hem 114'ün başı), çıplak "Hâ mîm" (yedi sûre). "Elif lâm mîm secde" de
// eklenmedi: Türkiye'de yaygın ama TDV'nin Secde maddesinde geçmiyor.
export const SURAH_ALIASES = {
  // ── Daha önce eklenenler (kullanıcı istekleri 2026-08-02 / 2026-09-12)
  kadir: 97,
  tovbe: 9, tobe: 9,

  // ── Sûrenin ilk kelimeleriyle anılanlar ───────────────────────────────────
  // Her biri kendi ilk âyetinden doğrulandı (public/verse-graph-bgem3.json).
  elham: 1,                                    // 1:2 اَلْحَمْدُ لِلّٰهِ
  amme: 78, 'amme yetesaelun': 78,             // 78:1 عَمَّ يَتَسَٓاءَلُونَ
  vedduha: 93,                                 // 93:1 وَالضُّحٰى
  'inna enzelna': 97, innaenzelna: 97,         // 97:1 اِنَّٓا اَنْزَلْنَاهُ
  'iza zulzilet': 99, izazulzilet: 99,         // 99:1 اِذَا زُلْزِلَتِ
  veladiyat: 100,                              // 100:1 وَالْعَادِيَاتِ
  elhakum: 102, 'elhakumut tekasur': 102,      // 102:1 اَلْهٰيكُمُ التَّكَاثُرُ
  velasr: 103,                                 // 103:1 وَالْعَصْرِ
  'elem tera keyfe': 105, elemterakeyfe: 105,  // 105:1 اَلَمْ تَرَ كَيْفَ
  ilaf: 106, 'li ilafi kureys': 106,           // 106:1 لِا۪يلَافِ قُرَيْشٍ
  eraeyte: 107, eraeytellezi: 107,             // 107:1 اَرَاَيْتَ الَّذ۪ي
  'inna atayna': 108, innaatayna: 108,         // 108:1 اِنَّٓا اَعْطَيْنَاكَ
  'kul ya eyyuhel kafirun': 109,               // 109:1 قُلْ يَٓا اَيُّهَا الْكَافِرُونَ
  'iza cae': 110, izacae: 110,                 // 110:1 اِذَا جَٓاءَ نَصْرُ اللّٰهِ
  'kul huvallahu ehad': 112, kulhuvallah: 112, // 112:1 قُلْ هُوَ اللّٰهُ اَحَدٌ
  'kul euzu bi rabbil felak': 113,             // 113:1 قُلْ اَعُوذُ بِرَبِّ الْفَلَقِ
  'kul euzu bi rabbin nas': 114,               // 114:1 قُلْ اَعُوذُ بِرَبِّ النَّاسِ

  // El-Mülk — TDV, "Mülk sûresi": "Tebâreke, Mücâdele, Mânia, Münciye, Vâkıye
  // ve Mennâa olarak da adlandırılır." (67:1 تَبَارَكَ). Yazım varyantları ve
  // yarım yazımlar da anahtar ki kullanıcı kelimeyi bitirmeden sonuç görsün.
  tebareke: 67, teberake: 67, tebereke: 67, tebarake: 67,
  tebarek: 67, teberek: 67, tebarak: 67,

  // El-İnşirah — TDV, "İnşirâh sûresi": "Adını 'elem neşrah leke' ifadesinden
  // almıştır. Elem neşrah, Elem neşrah leke ve Şerh sûresi olarak da
  // anılmaktadır." (94:1 اَلَمْ نَشْرَحْ)
  nesrah: 94, serh: 94,
  'elem nesrah': 94, elemnesrah: 94,
  'elem nesrah leke': 94, elemnesrahleke: 94,

  // ── Gerçek alternatif adlar (TDV İslâm Ansiklopedisi maddeleri) ───────────
  // Et-Tevbe: "ilk kelimesi berâetten dolayı Berâe adıyla da anılmış"
  berae: 9,
  // El-İsrâ: "Sübhân ve İsrâiloğulları'na yer verilmesi sebebiyle Benî İsrâil
  // sûresi olarak da adlandırılmıştır."
  subhan: 17, 'beni israil': 17, beniisrail: 17,
  // Es-Secde: "Medâci'", "Tenzîlü's-Secde", "Secdetü Lokmân"
  tenzil: 32, 'tenzilus secde': 32, medaci: 32, 'secdetu lokman': 32,
  // Fâtır: "melâike kelimesinden dolayı Melâike sûresi diye de adlandırılmıştır"
  melaike: 35,
  // Mü'min: "Gāfir ve Tavl sûresi olarak da adlandırılır."
  gafir: 40, tavl: 40,
  // Fussilet: "Hâ mîmü's-secde", "Mesâbîh sûresi", "Akvât sûresi"
  'ha mim secde': 41, hamimsecde: 41, 'ha mimus secde': 41,
  mesabih: 41, akvat: 41,
  // Muhammed: "Kıtâl sûresi olarak da adlandırılır."
  kital: 47,
  // El-İnsân: "Dehr, Emşâc, Ebrâr ve Hel etâ adlarıyla da anılmaktadır."
  dehr: 76, emsac: 76, ebrar: 76, 'hel eta': 76, heleta: 76,
  // Tebbet: "sûre Mesed, Ebû Leheb ve Leheb adlarıyla da anılır."
  mesed: 111, leheb: 111, 'ebu leheb': 111, ebuleheb: 111,
  // El-İhlâs: "İhlâs ve aynı zamanda sûrenin ilk âyeti olan 'Kul hüvallāhü
  // ahad' en çok kullanılanlarıdır" · ayrıca "Tevhîd, Esâs, Tecrîd, Necât ve
  // Velâyet". Günlük kullanımda geçmeyen dördü (Esâs/Tecrîd/Necât/Velâyet)
  // eklenmedi; gerekirse aynı maddeden eklenebilir.
  tevhid: 112,
};

/** Normalize edilmiş sorgunun karşılığı sûre numarası; yoksa null. */
export function surahNumberForAlias(qNorm) {
  const n = SURAH_ALIASES[qNorm];
  return n >= 1 && n <= 114 ? n : null;
}

// Sûre adını arama tarafının kullandığı biçime indirger: küçük harf, Türkçe
// harfler sadeleşir, şapka/kesme/tire düşer, harf-i tarif ("El-", "Et-"…) atılır.
function bareName(name) {
  const norm = (name || '')
    .toLowerCase()
    .replace(/İ/g, 'i').replace(/I/g, 'i').replace(/ı/g, 'i')
    .replace(/ş/g, 's').replace(/ğ/g, 'g').replace(/ç/g, 'c')
    .replace(/ö/g, 'o').replace(/ü/g, 'u')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const m = norm.match(/^(?:el|al|er|ar|es|as|et|at|ez|az|en|an|ed|ad)-(.+)$/);
  return (m ? m[1] : norm).replace(/['\u2019\u02bc`-]/g, '');
}

/**
 * Normalize edilmiş sorguyu kanonik sûre adına çevirir; eşleşme yoksa aynen
 * döner. Numara yolunu kullanamayan çağıranlar için emniyet ağı olarak durur.
 */
export function resolveSurahAlias(qNorm) {
  const n = surahNumberForAlias(qNorm);
  return n ? bareName(SURAH_NAMES_TR[n - 1]) : qNorm;
}

// ─── Deterministik dış kaynak linkleri (§13.35) ─────────────────────────────
// quran.com âyet linki: her zaman çözülür, allowlisted (Tier-1). Fabrikasyon
// riski yok — sûre+âyet doğrudan URL'ye eşlenir. Aralık verilirse ilk âyete
// bağlanır. Geçersiz sûre numarasında null döner (link gösterilmez).
export function quranComUrl(surah, ayah) {
  const s = parseInt(surah, 10);
  if (!s || s < 1 || s > 114) return null;
  const a = parseInt(ayah, 10);
  return a >= 1 ? `https://quran.com/${s}/${a}` : `https://quran.com/${s}`;
}

// sunnah.com hadis linki: koleksiyon anahtarı + numara verilmişse çözülür.
// NUMARA DOĞRULANMADAN çağrılmaz — çağıran taraf numarayı teyit etmiş olmalı
// (§13.30/§13.35 kırık link yasağı). collectionKey ör. 'bukhari','muslim',
// 'tirmidhi'. Numara yoksa null döner.
export function sunnahComUrl(collectionKey, number) {
  const n = parseInt(number, 10);
  if (!collectionKey || !n || n < 1) return null;
  return `https://sunnah.com/${collectionKey}:${n}`;
}
