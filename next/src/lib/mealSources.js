// ─── mealSources — meal kaynaklarının TEK doğru listesi ─────────────────────
//
// Üç proxy rotası (/api/meal, /api/meal-fallback, /api/meal-fallback2)
// parametreyi yalnız BİÇİM olarak doğruluyordu: "sayı mı", "xx.yyy kalıbına
// uyuyor mu". Biçim doğru ama kimlik yanlış olan her değer upstream'e GİDİYOR
// ve ayrı bir önbellek anahtarı açıyordu. İki somut sonucu ölçüldü (canlı,
// 2026-10-10):
//
//   /api/meal/99999/1              → 424, 0.67 s  (gerçek upstream çağrısı)
//   /api/meal-fallback/tr.zzzzqqqwx/1 → 200, Türkçe meal yerine Arapça metin
//
// Birincisi bizi üçüncü taraf API'lere karşı yükseltici (amplifier) yapıyor:
// saldırgan sayıyı artırarak sınırsız sayıda gerçek upstream isteği
// tetikleyebiliyor, fatura ve itibar bize yazılıyor. İkincisi daha kötü —
// alquran.cloud bilinmeyen edition'da sessizce varsayılana düşüyor, bizim
// normalizer onu geçerli bir meal gibi paketleyip 200 döndürüyor.
//
// Çözüm hız sınırı değil ÜYELİK DENETİMİ: anahtar kümesi sonlu olunca hem
// önbellek anahtarı uzayı kapanıyor hem bilinmeyen değer upstream'e hiç
// gitmiyor. Liste burada tek yerde duruyor; hem istemci (mealCache.js) hem
// üç rota buradan okuyor ki ikisi birbirinden sürüklenmesin.
// ────────────────────────────────────────────────────────────────────────────

// acikkuran yazar kimlikleri. ReadingMode.jsx'teki MEAL_AUTHORS listesinin
// `apiId` alanlarıyla birebir aynı olmalı — `apiId: null` olan iki yerel meal
// (Suat Yıldırım, Sahih International) API'ye hiç gitmediği için burada yok.
// Drift'i scripts/audit-counts.mjs yakalar (§13.28: türetilir, elle yazılmaz).
export const MEAL_AUTHOR_IDS = new Set([
  11,  // Diyanet İşleri
  6,   // Ali Bulaç
  38,  // Mustafa İslamoğlu
  14,  // Elmalılı Hamdi Yazır
  27,  // Süleyman Ateş
  8,   // Bayraktar Bayraklı
  30,  // Yaşar Nuri Öztürk
  107, // Mehmet Okuyan
  2,   // Abdullah Yusuf Ali
  109, // Marmaduke Pickthall
  9,   // Muhammad Asad
  113, // Abdul Haleem
  105, // Erhan Aktaş — ön-önbelleğe alınan atlas yazarı (prefetch-meal.mjs)
]);

// acikkuran yazar kimliği → alquran.cloud edition kimliği. Yalnız canlı
// istekle karşılığı DOĞRULANMIŞ yazarlar (2026-08-19). Karşılığı olmayanlar
// (İslamoğlu, Bayraktar, Okuyan, Haleem) burada bilerek yok.
export const ALQURAN_CLOUD_FALLBACK = {
  11: 'tr.diyanet',
  14: 'tr.yazir',
  6: 'tr.bulac',
  27: 'tr.ates',
  30: 'tr.ozturk',
  2: 'en.yusufali',
  109: 'en.pickthall',
  9: 'en.asad',
};

// acikkuran yazar kimliği → fawazahmed0/quran-api slug'ı (jsdelivr CDN).
// Slug'lar canlı istekle doğrulandı (2026-08-19).
export const JSDELIVR_QURAN_API_FALLBACK = {
  11: 'tur-diyanetisleri',
  14: 'tur-elmalilihamdiya',
  6: 'tur-alibulac',
  27: 'tur-suleymanates',
  30: 'tur-yasarnuriozturk',
  2: 'eng-abdullahyusufal',
  109: 'eng-mohammedmarmadu',
  9: 'eng-muhammadasad',
  113: 'eng-abdelhaleem',
};

// Rotaların üyelik denetimi için ters yöndeki kümeler.
export const ALQURAN_CLOUD_EDITIONS = new Set(Object.values(ALQURAN_CLOUD_FALLBACK));
export const JSDELIVR_EDITIONS = new Set(Object.values(JSDELIVR_QURAN_API_FALLBACK));
