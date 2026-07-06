// Ortak Arapça metin temizleme modülü.
// CLAUDE.md §13.14 + §13.15 normalizasyon kuralları + KFGQPC glyph eksikliği fix'leri.
//
// İki temel varyant export edilir:
//
//   cleanArabic(str)            — ReadingMode canonical. Waqf işaretleri ve U+06EA
//                                 KORUNUR; bunlar wrapWaqfOnly/applyTajweed CSS overlay
//                                 pipeline'ı tarafından absolute konumlandırma ile
//                                 görselleştirilir. Yalnızca CSS overlay pipeline'ı
//                                 ÇALIŞAN bileşenlerde kullan (ReadingMode, InterlinearView).
//
//   cleanArabicForDisplay(str)  — CSS overlay olmayan bileşenler için. Waqf işaretleri,
//                                 secde, rub el hizb, dekoratif tajwid işaretleri
//                                 STRIPLENİR; U+06EA → U+0650 (standart kasra) ve
//                                 U+06E1 → U+0652 (standart sukun) dönüşümü yapılır.
//                                 Maddah fix dahil. 9 bileşen tarafından kullanılır.
//
//   cleanArabicForGraph(str)    — Yukarıdaki ile neredeyse aynı; U+0615 (waqf-tā) ek
//                                 olarak strip listesinde. VerseGraph, ConceptGraph.
//
//   cleanArabicMinimal(str)     — Sadece kritik dönüşümler (asar, alef-wasla, yeh, maddah).
//                                 Veri zaten standart encoding'liyse safety net.
//                                 IlkSonKelimeler kullanır.
//
// Davranış değişikliği YASAK — her fonksiyon migration öncesi component-local
// kopyalarıyla birebir aynı sonuç üretmek zorunda. Yeni regex eklemeden önce
// `git diff` ile karşılaştır. Strip regex'lerinde Unicode codepoint'leri için
// güvenilirlik adına \uXXXX escape'leri tercih edildi (vizüel Arapça
// karakterler karakter sınıfı içinde yanlış aralık üretebilir).

// ──────────────────────────────────────────────────────────────────────────────
// Canonical (pipeline-aware) version — ReadingMode.jsx satır 24-122 ile birebir.
// Waqf / vakıf işaretleri ve U+06EA KORUNUR. CSS overlay layer'ı yoksa kullanma —
// kullanıcı '@', '◯' veya tofu görür. Bu durumda cleanArabicForDisplay() çağır.
// ──────────────────────────────────────────────────────────────────────────────
// Clean Arabic text: remove decorative/annotation markers with no phonetic value.
// Keep: core letters (U+0621–U+063A, U+0641–U+064A), standard harakat (U+064B–U+0655),
//        superscript alef (U+0670), subscript alef (U+0656), extended letters.
// Remove: waqf markers, Islamic phrase abbreviations, annotation marks, sajda sign, etc.
// U+06E1 (Uthmani open-circle sukun) is kept — it is phonetic.
// U+06EA (ARABIC EMPTY CENTRE LOW STOP) is used in the acikkuran dataset as a subscript
// kasra diacritic. It renders as a circle in fallback fonts so ReadingMode keeps it as-is
// and the font handles it. (cleanArabicForDisplay normalizes it to U+0650 since
// downstream display has no font escape hatch.)
export function cleanArabic(str) {
  if (!str) return str;
  return str
    // Decomposed hamza: ي+ٔ → ئ (precomposed ya-hamza)
    .replace(/ئ/g, 'ئ')
    // U+0656 (ARABIC SUBSCRIPT ALEF / dagger alef below) — primary font'umuz
    // ShaykhHamdullah Mushaf bu karakteri DESTEKLEMİYOR (glyph=None). API'den
    // (acikkuran) verisinde U+0656 olarak gelen "uzun ı sesi" diakritiği,
    // U+06EA'ya normalize edilir — ShaykhHamdullah ve KFGQPC her ikisi de
    // U+06EA'yı `subscriptalef` glyph'i ile dikey küçük çizgi olarak render
    // eder; klasik Mushaf imlasındaki "uzun hareke" görünümü budur. Bu,
    // acikkuran web sitesinin uyguladığı normalizasyonla birebir aynıdır.
    .replace(/ٖ/g, '۪')
    // U+06EA (Uthmani subscript kasra / asar) — olduğu gibi korunur, font asar şeklinde render eder
    // U+0653 (maddah above): tüm durumlar wrapWaqfOnly/applyTajweed pipeline'ında CSS overlay ile
    // işlenir (makeShaddaMaddaWrap / makeHarakaMaddaWrap / makeBareHarakaMaddaWrap).
    // cleanArabic'te herhangi bir stripping yapılmıyor — hareke+maddah kombinasyonu korunur.
    // U+0671 (Arabic Letter Alef Wasla / ٱ) — KFGQPC üstünde ص işareti render ediyor
    // Düz alef (U+0627) ile normalize et; wasl harekesi zaten hareke ile gösterilir
    .replace(/ٱ/g, 'ا')
    // U+06CC (Arabic Letter Farsi Yeh / ی) — KFGQPC desteklemiyor, siyah tofu üretiyor
    // Standart Arabic Yeh (U+064A) ile normalize et
    .replace(/ی/g, 'ي')
    // Islamic phrase abbreviations (U+0610–U+0614, U+0616–U+0617)
    // U+0615 (ARABIC SMALL HIGH TAH = ط waqf işareti) hariç tutuldu — wrapWaqfOnly'de render edilecek
    .replace(/[ؐ-ؔؖؗ]/g, '')
    // Quranic number / footnote prefix marks (U+0600–U+0605)
    .replace(/[؀-؅]/g, '')
    // Waqf / pause markers (U+06D6–U+06DB) — applyTajweed/wrapWaqfOnly'de
    // absolute konumlandırma ile gösterilir; cleanArabic'te kaldırılmıyor.
    // U+06DC (ARABIC SMALL HIGH SEEN, sekta waqf) — ShaykhHamdullah/KFGQPC
    // chain'inde glif eksikliği yüzünden '@' tofu olarak render oluyor.
    // End-of-ayah (U+06DD), rub el hizb (U+06DE), sajda sign (U+06E9) strip.
    .replace(/[۝۞۩]/g, '')
    // Leeds Quranic Arabic Corpus encoding artifacts — literal ASCII
    // markers (@, #, _) embedded in word strings for morphological
    // boundaries / sajda hints. Strip so words render cleanly.
    .replace(/[@#_]/g, '')
    // Decomposed alef-with-maddah / dagger-alef-with-maddah / lam-shamsiyah
    // missing-sukun fix VARYANTLARI: çeşitli denemeler yapıldı, hepsi
    // typografi açısından yanlış sonuç ürettiği için kaldırıldı. Detay
    // ReadingMode.jsx satır 56-93 yorumları (NOTE blokları).
    //
    // Reorder [waqf-marker][harakah] → [harakah][waqf-marker] so the
    // kasratan/fathatan/dammatan/sukun glyph renders below/above the host
    // letter without colliding with the small high waqf glyph above it.
    // Waqf range U+06D6-U+06DC, harakah range U+064B-U+0650 + U+0652
    // (shadda U+0651 intentionally excluded — it's a doubling marker).
    .replace(/([ۖ-ۜ])([ً-ِْ])/g, '$2$1')
    // U+06E6 (ARABIC SMALL YEH ۦ) → boşluk ile değiştir.
    // API verisinde ۦ kelimeler arası tek ayraç olarak kullanılıyor.
    // Kaldırılırsa veya ZWNJ konulursa harfler görsel olarak birleşiyor; boşluk gerekli.
    .replace(/ۦ/g, ' ')
    // U+06DF (صفر مستدير/Ayn) + U+06EC (kasr) applyTajweed'e bırakılıyor — diğerleri siliniyor
    // U+06EB (EMPTY CENTRE HIGH STOP) = med işareti — korunur
    // U+06E8 (ARABIC SMALL HIGH NOON / nūn al-wiqāyah) — korunur
    // U+06E3 (ARABIC SMALL LOW SEEN) korunur. Hafs Mushaf'inda sad altinda kucuk
    // seen olarak yer alir (orn. Bakara 2:245 wa-yebsutu): kiraat ihtilaf isareti.
    // KFGQPC + ShaykhHamdullah subscript-seen glyph ile render eder.
    // U+06E0 (UPRIGHT RECTANGULAR ZERO), U+06E4 (SMALL HIGH MADDA),
    // U+06E7 (SMALL HIGH YEH), U+06ED (SMALL LOW MEEM) — KORUNUR.
    // Mushaf kira'at isaretleri. KFGQPC font'unda hepsi mevcut.
    // Overlay pipeline bunlari yakalamiyor, cift render riski yok.
    // Ornate parentheses
    .replace(/[﴾﴿]/g, '');
}

// ──────────────────────────────────────────────────────────────────────────────
// Display variant (no CSS overlay pipeline) — waqf işaretleri ve U+06EA dahil
// dekoratif/tajwid işaretleri STRIPLENİR ya da standart hareke ile değiştirilir.
// Vite migration öncesi 9+ bileşendeki ortak "standart" kopyaya birebir denk:
//   KissaAtlas, SunnetullahAtlasi, DiyalogAgi, KiraatAtlasi, KuranRetorigi,
//   NefisMertebeleri, MunafikProfili, SebebiNuzul, FurukAtlasi, WordTooltip
// CLAUDE.md §13.14 + §13.15.
// ──────────────────────────────────────────────────────────────────────────────
export function cleanArabicForDisplay(str) {
  if (!str) return str;
  return str
    .replace(/۪/g, 'ِ')                              // Uthmani subscript kasra → standart kasra
    .replace(/ۡ/g, 'ْ')                              // Uthmani sukun → standart sukun
    .replace(/[ً-ْ]ٓ/gu, 'ٓ')              // CLAUDE.md §13.14 maddah render fix
    .replace(/ٱ/g, 'ا')                              // alef wasla → düz alef (KFGQPC ص artifact'i)
    .replace(/ی/g, 'ي')                              // Farsi yeh → Arabic yeh
    .replace(/[ؐ-ؔؖؗ]/g, '')               // İslami kısaltma işaretleri
    .replace(/[؀-؅]/g, '')                           // Kur'an numara/dipnot işaretleri
    .replace(/[۝۞۩]/g, '')                      // ayet sonu, rub el hizb, secde işareti
    .replace(/ۦ/g, ' ')                                   // small yeh → boşluk (kelime ayracı)
    .replace(/[ؕۖ-ۜ۟-ۭۤۧۨ]/g, '') // CLAUDE.md §13.15 canonical: waqf + tajwid range (U+0615 + U+06D6-U+06DC + U+06DF-U+06ED). Eski regex U+06E0'ı (small high upright rectangular zero) kaçırıyordu — kaynak-yuzey 3:19'da tofu render'a yol açtı (2026-07 fix).
    .replace(/[﴾﴿]/g, '');                           // süslü parantezler
}

// ──────────────────────────────────────────────────────────────────────────────
// Graph variant — VerseGraph / ConceptGraph için. cleanArabicForDisplay ile
// neredeyse aynı, farklılıklar:
//   - U+0615 (waqf-tā) ek olarak strip listesinde
//   - Maddah fix YOK (graph verisi zaten standart encoding)
// Pre-migration component-local kopyalarıyla davranışsal parite.
// ──────────────────────────────────────────────────────────────────────────────
export function cleanArabicForGraph(str) {
  if (!str) return str;
  return str
    .replace(/۪/g, 'ِ')                                          // Uthmani subscript kasra → standard kasra
    .replace(/ۡ/g, 'ْ')                                          // Uthmani dotless head of khah → standard sukun
    .replace(/ٱ/g, 'ا')                                          // Alef wasla → plain alef
    .replace(/ی/g, 'ي')                                          // Farsi yeh → Arabic yeh
    .replace(/[ؐ-ؔؖؗ]/g, '')                           // Islamic phrase abbreviations
    .replace(/[؀-؅]/g, '')                                       // Quranic number/footnote marks
    .replace(/[۝۞۩]/g, '')                                  // End-of-ayah, rub el hizb, sajda sign
    .replace(/ۦ/g, ' ')                                               // Arabic small yeh → space (word separator)
    .replace(/[ؕۖ-ۜ۟ۢۨ]/g, '')  // waqf markers + tajweed signs (incl. U+0615)
    .replace(/[﴾﴿]/g, '');                                       // Ornate parentheses
}

// ──────────────────────────────────────────────────────────────────────────────
// Minimal variant — verse-graph-bgem3 gibi zaten temiz encoding'li veri için
// safety net. IlkSonKelimeler kullanır.
// ──────────────────────────────────────────────────────────────────────────────
export function cleanArabicMinimal(str) {
  if (!str) return str;
  return str
    .replace(/۪/g, 'ِ')
    .replace(/ٱ/g, 'ا')
    .replace(/ی/g, 'ي')
    .replace(/[ً-ْ]ٓ/gu, 'ٓ');
}
