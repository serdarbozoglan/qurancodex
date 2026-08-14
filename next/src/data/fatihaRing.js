// ─── Fâtiha halka kompozisyonu — VERİ ────────────────────────────────────────
//
// 2026-08-14 — DÜZELTİLDİ. Önceki sürüm Besmele'yi (1:1) "A" pozisyonuna
// koyuyor ve 1:4'ü ("Mâliki yevmi'd-dîn") hiç göstermiyordu — bu, atfedilen
// kaynakla (Farrin) DOĞRUDAN ÇELİŞİYORDU. Hakemli bir kitap eleştirisi
// (Ersin Kabakcı, Hitit Üniv. SBE Dergisi, 2018) açıkça şunu aktarıyor:
// "Farrin does not count the invocation (basmala) as a verse for it does
// not contribute the structure of the sura" (Farrin, 2014, s. 3).
//
// Gerçek okuma daha ayrıntılı — Farrin, Besmele hariç iki AYRI ayna yapısı
// öneriyor (1:2↔1:4 + 1:3'ün kendi içinde Rahmân↔Rahîm; sonra 1:6↔1:7'nin
// üç parçası), 1:5 bu ikisi arasında menteşe. Bu, sitenin tek-V'lik sade
// diyagramına birebir oturmuyor (10 alt-pozisyon gerektirir).
//
// AŞAĞIDAKİ DİZİ Farrin'in TAM yapısının birebir kopyası DEĞİL — sitenin
// kendi erişilebilir düzenlemesi: Besmele çıkarıldı, 1:4 doğru yerine
// eklendi, eksen (1:5) doğrulanan haliyle korundu. §13.24 ruhu: bu bir
// OKUMA ÖNERİSİDİR, "Farrin'in kitabındaki şema budur" iddiası değil.
// ProofSection'daki metin bunu açıkça belirtir.
//
// §13.15 — Arapça metin HAFIZADAN YAZILMADI. `public/verse-graph-bgem3.json`
// içinden mekanik olarak çekildi (node -e ile `cleanArabicForDisplay`
// üzerinden doğrulandı, 2026-08-14).
// ────────────────────────────────────────────────────────────────────────────

export const FATIHA_RING = [
  { pos: 'A', ayah: 2, pair: 'A\'',
    ar: 'اَلْحَمْدُ لِلّٰهِ رَبِّ الْعَالَمِينَ',
    theme: { tr: 'Rab — âlemlerin sahibi', en: 'Lord of all the worlds' } },
  { pos: 'B', ayah: 3, pair: 'B\'',
    ar: 'اَلرَّحْمٰنِ الرَّحِيمِ',
    theme: { tr: 'Rahmân ve Rahîm', en: 'The Merciful' } },
  { pos: 'C', ayah: 4, pair: 'C\'',
    ar: 'مَالِكِ يَوْمِ الدِّينِ',
    theme: { tr: 'Din gününün mâliki', en: 'Master of the Day of Judgment' } },
  { pos: 'D', ayah: 5, pair: null,
    ar: 'اِيَّاكَ نَعْبُدُ وَاِيَّاكَ نَسْتَعِينُ',
    theme: { tr: 'Eksen — "Sana"', en: 'Pivot — "You"' } },
  { pos: 'C\'', ayah: 6, pair: 'C',
    ar: 'اِهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
    theme: { tr: 'Doğru yola iletme', en: 'Guidance to the path' } },
  { pos: 'B\'', ayah: 7, pair: 'B',
    ar: 'صِرَاطَ الَّذِينَ اَنْعَمْتَ عَلَيْهِمْ',
    theme: { tr: 'Nimet verilenlerin yolu', en: 'Path of the favoured' } },
  { pos: 'A\'', ayah: 7, pair: 'A',
    ar: 'غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضّٓالِّينَ',
    theme: { tr: 'Gazaptan uzak kapanış', en: 'Closing away from wrath' } },
];
