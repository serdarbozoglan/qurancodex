// ─── audio-fade — ses seviyesi yardımcıları ─────────────────────────────────
//
// ⚠ Burada RAMPA YOK — ve bu bilinçli bir karar. Kısa tarihçe:
//
// 1) İlk sürüm: pause/play sert kesince "teyp kapanışı" tık sesi çıkıyordu.
//    Çözüm olarak setInterval tabanlı 70 ms'lik ses rampası yazıldı.
//
// 2) Rampa ANA İŞ PARÇACIĞINDA çalışıyor ve orada güvenilir değil. Ölçüm
//    (2026-08-01): sınır anında useHifzSession'ın setSession'ı ReadingMode'un
//    ~10K satırlık ağacını yeniden render ediyor, main thread ~70 ms bloke
//    oluyor, interval callback'i hiç ateşlenemiyor. Zaman serisi:
//        ct=11000 v=1   ← sınır
//        ct=11069 v=1   ← 69 ms sonra HÂLÂ tam ses; rampa başlamamış
//        pause ct=11098 v=0  ← tek hamlede 1→0 (= tık) ve `to`yu 48 ms aşmış
//
// 3) Asıl çözüm rampa değil, DOĞRU KESME NOKTASI. qdc damgalarında her ayet
//    sınırında sessiz bir pencere var (ölçüm: ses kuyruğunun bitişi ile
//    sonraki ayetin ses başlangıcı arası, en dar durumda ~90 ms). Orada
//    kesilirse genlik zaten sıfırdır: tık yok, kırpma yok — üstelik iOS'ta
//    `volume` salt-okunur olduğu için rampanın hiç çalışmadığı yerde de
//    doğru davranış elde edilir. Kesme noktası useHifzSession.LEAD_MS.
//
// Buradaki fonksiyonlar yalnızca SENKRON seviye ayarı yapar — zamanlamaya
// bağımlı hiçbir şey yok, dolayısıyla jank'ten etkilenmez.
// ─────────────────────────────────────────────────────────────────────────────

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** Seviyeyi anında ayarla. iOS'ta `volume` salt-okunurdur — sessizce yok sayılır. */
export function setVolumeNow(audio, v) {
  if (!audio) return;
  try { audio.volume = clamp01(v); } catch { /* iOS: salt-okunur */ }
}

/** Seviyeyi tam sese döndür. Durdurma yollarında çağrılır. */
export function restoreVolume(audio) {
  setVolumeNow(audio, 1);
}
