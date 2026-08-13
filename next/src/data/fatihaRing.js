// ─── Fâtiha halka kompozisyonu — VERİ ────────────────────────────────────────
//
// Yapı (A-B-C-D-C'-B'-A', D ekseni 1:5): Raymond Farrin,
// "Structure and Qur'anic Interpretation", 2014. Bu dosya YALNIZ eşleme
// bilgisini taşır — hangi âyet hangisiyle tematik olarak eşleşiyor.
//
// §13.15 — Arapça metin HAFIZADAN YAZILMADI. `public/verse-graph-bgem3.json`
// içinden mekanik olarak çekildi (scratchpad/gen-fatiha.mjs).
// 1:7 tek âyettir ama iki cümlecikten oluşur; Farrin'in eşlemesinde B' ve A'
// bu iki cümleciktir. Ayrım mushaf durak işaretinden (U+0659) yapıldı.
//
// ⚠ Bu bir OKUMA ÖNERİSİDİR, metnin zorunlu tek bölümlemesi değildir.
// Bunu söyleyen cümle arayüzde de görünür (ProofSection → "sınır" adımı).
// ────────────────────────────────────────────────────────────────────────────

export const FATIHA_RING = [
  { pos: 'A', ayah: 1, pair: 'A\'',
    ar: 'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ',
    theme: { tr: 'Rahmet ile açılış', en: 'Opening in mercy' } },
  { pos: 'B', ayah: 2, pair: 'B\'',
    ar: 'اَلْحَمْدُ لِلّٰهِ رَبِّ الْعَالَمِينَ',
    theme: { tr: 'Rabbin övgüsü', en: 'Praise of the Lord' } },
  { pos: 'C', ayah: 3, pair: 'C\'',
    ar: 'اَلرَّحْمٰنِ الرَّحِيمِ',
    theme: { tr: 'Rahmân ve Rahîm', en: 'The Merciful' } },
  { pos: 'D', ayah: 5, pair: null,
    ar: 'اِيَّاكَ نَعْبُدُ وَاِيَّاكَ نَسْتَعِينُ',
    theme: { tr: 'Eksen — "Sana"', en: 'Pivot — "You"' } },
  { pos: 'C\'', ayah: 6, pair: 'C',
    ar: 'اِهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
    theme: { tr: 'Doğru yola iletme', en: 'Guidance to the path' } },
  { pos: 'B\'', ayah: 7, pair: 'B',
    ar: 'صِرَاطَ الَّذِينَ اَنْعَمْتَ عَلَيْهِمْ',
    theme: { tr: 'Nimet verilenlerin yolu', en: 'Path of the favoured' } },
  { pos: 'A\'', ayah: 7, pair: 'A',
    ar: 'غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضّٓالِّينَ',
    theme: { tr: 'Gazaptan uzak kapanış', en: 'Closing away from wrath' } },
];
