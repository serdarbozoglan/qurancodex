// §13.15 Arabic normalize — build-time script kopyası (ES module).
// Runtime cleanArabic() ile birebir aynı algoritma; KFGQPC font uyumu için
// Uthmani-özel karakterleri standart Unicode'a çevirir + glyph'i olmayan
// tajwid/waqf işaretlerini strip eder.
//
// Kaynak: CLAUDE.md §13.15 + next/src/lib/arabic.js cleanArabicForDisplay.

export function cleanArabicForDisplay(str) {
  if (!str) return str;
  return str
    .replace(/۪/g, 'ِ')                       // U+06EA → U+0650 (KRİTİK — daire fix)
    .replace(/ۡ/g, 'ْ')                       // U+06E1 → U+0652 (Uthmani sukun)
    .replace(/[ً-ْ]ٓ/gu, 'ٓ')                  // §13.14 maddah fix
    .replace(/ٱ/g, 'ا')                       // U+0671 → U+0627 (alef wasla)
    .replace(/ی/g, 'ي')                       // Farsi yeh → Arabic yeh
    .replace(/[ؐ-ؔؖؗ]/g, '')                    // İslami kısaltma işaretleri
    .replace(/[؀-؅]/g, '')                       // Numara/dipnot
    .replace(/[۝۞۩]/g, '')                     // Ayet sonu, rub el hizb, secde
    .replace(/ۦ/g, ' ')                        // small yeh → boşluk
    .replace(/[ۖ-ۜۢۨ]/g, '')                  // Waqf + dekoratif tajwid
    .replace(/[﴾﴿]/g, '');                     // Süslü parantezler
}

// Doğrulama helper — problem karakter varsa true döner.
export function hasProblemChars(str) {
  if (!str) return false;
  const PROBLEM = ['۪', 'ۡ', 'ٱ', 'ی', '۝', '۞', '۩', 'ۖ', 'ۗ', 'ۘ', 'ۙ', 'ۚ', 'ۛ', 'ۜ'];
  return PROBLEM.some(c => str.includes(c));
}
