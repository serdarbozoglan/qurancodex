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

// ─── Sûre adı takma adları ──────────────────────────────────────────────────
// Halk arasında yaygın alternatif okunuşlar → resmî ad. Anahtar ve değer
// NORMALİZE edilmiş biçimde (küçük harf, kesme/tire yok) tutulur; arama
// tarafı sorguyu normalize ettikten sonra buradan geçirir.
//
// Yalnız EMİN olunan eşlemeler eklenir — yanlış bir takma ad kullanıcıyı
// sessizce başka sûreye götürür. Yeni madde eklerken kaynağı doğrula.
// Kullanıcı isteği 2026-08-02: "Kadir" yazınca Kadr bulunsun.
export const SURAH_NAME_ALIASES = {
  kadir: 'kadr',
};

/** Normalize edilmiş sorguyu resmî ada çevirir; eşleşme yoksa aynen döner. */
export function resolveSurahAlias(qNorm) {
  return SURAH_NAME_ALIASES[qNorm] || qNorm;
}
