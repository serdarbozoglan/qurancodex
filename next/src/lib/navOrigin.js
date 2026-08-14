// ─── "Bu sayfaya site içinden mi gelindi?" — TAHMİN DEĞİL, İŞARET ──────────
//
// 2026-08-14, kullanıcı raporu: `/arac/tum-araclar` kapatılınca sayfa en başa
// gidiyordu. Kapatma mantığı "site içinden mi gelindi" sorusunu tahmin etmeye
// çalışıyordu ve iki yol da yanlıştı — ikisi de ÖLÇÜLDÜ:
//
//   · `document.referrer` → SPA geçişinde GÜNCELLENMEZ. Belge yeniden
//     yüklenmediği için ilk yüklemedeki değerde kalır; anasayfadan tıklayınca
//     ölçülen değer: `""`. Yani "dışarıdan geldi" sanılıyordu.
//   · `history.length > 1` → yeni sekmede bile 2 olabiliyor (about:blank).
//     Bunu denedim, doğrudan giriş `about:blank`e düştü.
//   · `history.state` → Next iç ağacı; iki durumda da AYNI, ayırt etmiyor.
//
// Çözüm: tahmin etmeyi bırak, gerçeği kaydet. `InAppNavMarker` layout'ta
// oturur ve istemci tarafı her rota değişiminde bu bayrağı kaldırır.
// İlk yükleme (fresh load) bayrağı KALDIRMAZ — aradaki fark tam olarak budur.
const KEY = 'qc_in_app_nav';

export function markInAppNav() {
  try { sessionStorage.setItem(KEY, '1'); } catch { /* private mode */ }
}

/** Site içinden gelindiyse true. Yeni sekme / paylaşılan link / adres çubuğu → false. */
export function cameFromInApp() {
  try { return sessionStorage.getItem(KEY) === '1'; } catch { return false; }
}

/**
 * Kapatma/geri davranışının TEK doğru kalıbı.
 * Site içinden gelindiyse `back()` — tarayıcı kaydırma konumunu kendi geri
 * yükler, bu yüzden `push(home)` ile taklit edilemez.
 */
export function closeToPrevious(router, homePath) {
  if (typeof window === 'undefined') return;
  if (cameFromInApp() && window.history.length > 1) router.back();
  else router.push(homePath);
}
