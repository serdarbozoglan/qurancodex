// ─── Bilimsel işaretler — zaman çizelgesi VERİSİ ─────────────────────────────
//
// 2026-08-14. Anasayfadaki "Bilimsel İşaretler" kartı (bilimsel-card) altın
// çerçeveli tek panel yerine kronolojik bir zaman çizelgesi olarak render
// edilir — içerik zaten dört ayrı keşif tarihine bağlı (bkz. B1a mockup turu).
//
// Sıra ve etiketler `sections/ScientificSigns.jsx`'teki TAB_META/TAB_VERSE
// ile birebir aynı (tek otorite orada) — burada yalnız anasayfa kartı için
// tekrarlanıyor, değer UYDURULMADI.
//
// §13.15 — Arapça `public/verse-graph-bgem3.json`'dan surah:ayah ile mekanik
// çekildi ve `cleanArabicForDisplay()`'den geçirilip DOĞRULANDI (node -e ile
// canlı test edildi, 2026-08-14). Hafızadan yazılmadı.
// ────────────────────────────────────────────────────────────────────────────

export const SCIENCE_TIMELINE = [
  {
    surah: 51,
    ayah: 47,
    discoveryTr: 'Hubble · 1929',
    discoveryEn: 'Hubble · 1929',
    topicTr: 'Evrenin genişlemesi',
    topicEn: 'Cosmic expansion',
    ar: 'وَالسَّمَاءَ بَنَيْنَاهَا بِاَيْدٍ وَاِنَّا لَمُوسِعُونَ',
    refTr: 'Zâriyât 51:47',
    refEn: 'aẓ-Ẓāriyāt 51:47',
  },
  {
    surah: 57,
    ayah: 25,
    discoveryTr: 'Astrofizik · 1957',
    discoveryEn: 'Astrophysics · 1957',
    topicTr: 'Demirin kökeni',
    topicEn: 'The origin of iron',
    ar: 'لَقَدْ اَرْسَلْنَا رُسُلَنَا بِالْبَيِّنَاتِ وَاَنْزَلْنَا مَعَهُمُ الْكِتَابَ وَالْمِيزَانَ لِيَقُومَ النَّاسُ بِالْقِسْطِ وَاَنْزَلْنَا الْحَدِيدَ فِيهِ بَأْسٌ شَدِيدٌ وَمَنَافِعُ لِلنَّاسِ وَلِيَعْلَمَ اللّٰهُ مَنْ يَنْصُرُهُ وَرُسُلَهُ بِالْغَيْبِ اِنَّ اللّٰهَ قَوِيٌّ عَزِيزٌ',
    refTr: 'Hadîd 57:25',
    refEn: 'al-Ḥadīd 57:25',
  },
  {
    surah: 55,
    ayah: 19,
    discoveryTr: "Oşinografi · 1960'lar",
    discoveryEn: 'Oceanography · 1960s',
    topicTr: 'İki denizin berzahı',
    topicEn: 'The barrier between two seas',
    ar: 'مَرَجَ الْبَحْرَيْنِ يَلْتَقِيَانِ',
    refTr: 'Rahmân 55:19',
    refEn: 'ar-Raḥmān 55:19',
  },
  {
    surah: 23,
    ayah: 14,
    discoveryTr: 'Embriyoloji · 20. yy.',
    discoveryEn: 'Embryology · 20th c.',
    topicTr: 'Alaka → mudga → kemik',
    topicEn: 'Clinging clot → lump → bone',
    ar: 'ثُمَّ خَلَقْنَا النُّطْفَةَ عَلَقَةً فَخَلَقْنَا الْعَلَقَةَ مُضْغَةً فَخَلَقْنَا الْمُضْغَةَ عِظَاماً فَكَسَوْنَا الْعِظَامَ لَحْماً ثُمَّ اَنْشَأْنَاهُ خَلْقاً اٰخَرَ فَتَبَارَكَ اللّٰهُ اَحْسَنُ الْخَالِقِينَ',
    refTr: "Mü'minûn 23:14",
    refEn: "al-Muʾminūn 23:14",
  },
];
