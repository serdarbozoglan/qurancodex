// ─── audio-fade — HTMLAudioElement için yumuşak ses rampası ─────────────────
//
// Neden: `audio.pause()` dalga formunun ortasında keserse çıkışta ani bir
// süreksizlik olur; kulak bunu "tık" / "teyp kapanışı" olarak duyar. Aynı
// şey mid-file `seek + play` için de geçerli (sıfır olmayan bir örnekten
// başlamak). Ezber modu saniyede değil ama her tekrarda bunu yaşıyor —
// oturum boyunca onlarca tık.
//
// Çözüm: durdurmadan hemen önce sesi ~70 ms'de 0'a indir, başlattıktan
// sonra aynı sürede geri çıkar. Rampa konuşmanın kuyruğunda kaldığı için
// (qdc damgalarında ayet sonu sessizliği penceresinin içindedir) işitsel
// olarak fark edilmez.
//
// ⚠ iOS: `HTMLMediaElement.volume` salt-okunurdur — atama sessizce yok
// sayılır. Orada rampa no-op'a düşer, davranış eski haline (tık sesi)
// döner. Faz 1 zaten masaüstü; mobil için Web Audio GainNode gerekir ama
// `createMediaElementSource` cross-origin ses için CORS başlığı ister
// (qurancdn vermiyor) — o yüzden bilinçli olarak ertelendi.
// ─────────────────────────────────────────────────────────────────────────────

export const FADE_MS = 70;

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

function setVolume(audio, v) {
  try { audio.volume = clamp01(v); } catch { /* iOS: salt-okunur */ }
}

/** Devam eden rampayı iptal et (varsa). Ses seviyesi olduğu yerde kalır. */
export function cancelRamp(audio) {
  if (audio && audio.__fadeCancel) audio.__fadeCancel();
}

/**
 * Rampayı iptal et ve sesi tam seviyeye döndür.
 * Durdurma yollarında MUTLAKA çağrılmalı — yarıda kesilen bir fade-out
 * elementi volume=0'da bırakır ve sonraki çalma sessiz olur.
 */
export function restoreVolume(audio) {
  if (!audio) return;
  cancelRamp(audio);
  setVolume(audio, 1);
}

/**
 * Sesi `target` seviyesine `ms` içinde rampala.
 * Aynı element üzerinde yeni rampa öncekini iptal eder.
 * @returns {Promise<void>} rampa bittiğinde (veya iptal edildiğinde) çözülür
 */
export function rampVolume(audio, target, ms = FADE_MS) {
  cancelRamp(audio);
  if (!audio) return Promise.resolve();

  const from = audio.volume;
  const delta = target - from;
  if (ms <= 0 || Math.abs(delta) < 0.02) {
    setVolume(audio, target);
    return Promise.resolve();
  }

  // setInterval — requestAnimationFrame DEĞİL. Rampa zaman tabanlı bir işlem;
  // kare senkronuna ihtiyacı yok. Dahası rAF, sayfa kompozisyon yapmadığında
  // (headless, arka plan sekme, düşük güç modu) ciddi şekilde kısıtlanır ve
  // rampa 1→0 sıçramasına dönüşür — tam da önlemeye çalıştığımız tık geri
  // gelir. Ölçümle doğrulandı: headless'ta rAF sürümü yalnızca 0 ve 1
  // üretiyordu, ara değer yoktu (2026-07-31).
  const STEP_MS = 10;
  return new Promise((resolve) => {
    const t0 = performance.now();
    let timer = 0;
    const finish = () => {
      clearInterval(timer);
      audio.__fadeCancel = null;
      resolve();
    };
    timer = setInterval(() => {
      const k = Math.min(1, (performance.now() - t0) / ms);
      setVolume(audio, from + delta * k);
      if (k >= 1) { setVolume(audio, target); finish(); }
    }, STEP_MS);
    audio.__fadeCancel = finish;
  });
}
