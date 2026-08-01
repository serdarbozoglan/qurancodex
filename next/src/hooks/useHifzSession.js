'use client';

// ─── useHifzSession — Ezber modu zamanlayıcısı (Faz 1: tek ayet tekrarı) ─────
//
// Karaoke altyapısının üstüne oturan bir A–B loop state machine'i. Ses
// elementinin sahibi ReadingMode'dur; bu hook SADECE "şu an hangi pencerede
// olmalıyız ve sınıra gelince ne yapılmalı" sorusunu yanıtlar. Böylece
// zamanlayıcı mantığı ReadingMode'un 10K satırlık gövdesinden bağımsız kalır.
//
// Çalışma prensibi — karaoke modu tek bir sûre mp3'ünü stream eder ve
// useWordTimings her ayet için { from, to } ms damgası verir. Bir ayeti N kez
// tekrarlamak = `to` sınırına gelince `from`'a geri sarmak. Ayet aralığı
// (Faz 2 kartopu) için de aynı primitif: from = ilk ayetin from'u,
// to = son ayetin to'su.
//
// Sözleşme:
//   tick(tMs)      → her rAF karesinde çağrılır. null | HifzAction döner.
//   forceBoundary()→ audio.onended'den çağrılır (sûrenin son ayetinde `to`
//                    sınırı duration'ı aşabilir; tick asla tetiklenmez).
//
// HifzAction:
//   { type: 'repeat', seekTo: <saniye>, pauseMs: <nefes payı> }
//   { type: 'done' }
//
// Tekrar sayacı ref'te tutulur — rAF her karede tick çağırır, her karede
// setState edilirse 60fps re-render olur. State yalnızca sayaç GERÇEKTEN
// değiştiğinde güncellenir (oturum başına N kez).
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useRef, useCallback, useEffect } from 'react';

// Ayetin son hecesi kırpılmasın diye `to` damgasından sonra bırakılan pay.
// Ayetler arası sessizlikten çalınır; boşluk yoksa 0'a iner (aşağıda clamp).
const TAIL_MS = 260;

// Tekrarlar arası nefes payı. Sıfır olursa tekrarlar birbirine yapışır ve
// ezber için yorucu olur; 400ms doğal bir "tekrar ediyorum" ritmi verir.
export const DEFAULT_BREATH_MS = 400;

export const REPEAT_PRESETS = [3, 5, 7, 10];
export const DEFAULT_REPEAT = 5;

/**
 * @param {object}  opts
 * @param {object|null} opts.timings  useWordTimings çıktısı — { "87:1": {from,to,segments} }
 * @param {boolean} opts.enabled      karaoke aktif mi (kârî destekliyor + timing yüklü)
 * @param {number}  opts.breathMs     tekrarlar arası duraklama
 */
export default function useHifzSession({ timings, enabled, breathMs = DEFAULT_BREATH_MS }) {
  // Görünür durum — panel/HUD bunu okur.
  const [session, setSession] = useState(null);

  // rAF-sıcak durum. tick her karede buraya bakar, React'e dokunmaz.
  //   armed:  sınır aksiyonu ateşlenmeye hazır mı (çift tetikleme guard'ı)
  //   count:  tamamlanan tekrar sayısı
  const live = useRef({ active: false, from: 0, to: 0, boundary: 0, target: 0, count: 0, armed: true });

  // Karaoke kapanır/kârî değişirse oturum geçersizdir — A–B penceresi artık
  // ölçülemez. Guard'lı: zaten oturum yoksa setState hiç çağrılmaz.
  useEffect(() => {
    if (enabled) return;
    live.current.active = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- harici yetenek kaybına (kârî/karaoke kapandı) senkron tepki; başka sinyal yolu yok.
    setSession(prev => (prev === null ? prev : null));
  }, [enabled]);

  /**
   * Bir ayet aralığı için A–B penceresi hesapla.
   * Faz 1'de fromVerse === toVerse; Faz 2 kartopu aynı fonksiyonu aralıkla çağırır.
   * @returns {{from:number,to:number,boundary:number}|null}
   */
  const buildWindow = useCallback((surah, fromAyah, toAyah) => {
    if (!timings) return null;
    const first = timings[`${surah}:${fromAyah}`];
    const last = timings[`${surah}:${toAyah}`];
    if (!first || !last) return null;

    // Kuyruk payı, bir sonraki ayete taşmayacak kadar. Ayetler arası boşluk
    // yoksa (to === nextFrom) pay 0 olur — taşma yerine kırpmayı tercih ederiz,
    // çünkü sonraki ayetin ilk hecesini duymak ezberde kafa karıştırır.
    const next = timings[`${surah}:${toAyah + 1}`];
    const gap = next ? Math.max(0, next.from - last.to) : TAIL_MS;
    const tail = Math.min(TAIL_MS, gap);

    return { from: first.from, to: last.to, boundary: last.to + tail };
  }, [timings]);

  /** Ezber oturumunu başlat. Pencere kurulamazsa false döner. */
  const start = useCallback((verse, repeat) => {
    if (!enabled || !verse) return false;
    const win = buildWindow(verse.surah, verse.ayah, verse.ayah);
    if (!win) return false;

    const target = Math.max(1, Math.floor(repeat) || DEFAULT_REPEAT);
    live.current = { active: true, ...win, target, count: 0, armed: true };
    setSession({
      surah: verse.surah,
      fromAyah: verse.ayah,
      toAyah: verse.ayah,
      verseId: verse.id,
      target,
      count: 0,
      from: win.from,
    });
    return true;
  }, [enabled, buildWindow]);

  const stop = useCallback(() => {
    live.current.active = false;
    setSession(null);
  }, []);

  // Sınıra varıldı — tekrar sayacını ilerlet ve aksiyonu belirle.
  const advance = useCallback(() => {
    const s = live.current;
    if (!s.active) return null;

    s.count += 1;
    s.armed = false;

    if (s.count >= s.target) {
      s.active = false;
      setSession(null);
      return { type: 'done' };
    }

    setSession(prev => (prev ? { ...prev, count: s.count } : prev));
    return { type: 'repeat', seekTo: s.from / 1000, pauseMs: breathMs };
  }, [breathMs]);

  /**
   * Her rAF karesinde çağrılır.
   * @param {number} tMs audio.currentTime * 1000
   */
  const tick = useCallback((tMs) => {
    const s = live.current;
    if (!s.active) return null;

    // Geri sarma sonrası yeniden kur: pencerenin içine döndüysek sınır aksiyonu
    // tekrar ateşlenebilir. `armed` olmadan tek bir sınır geçişi, seek
    // tamamlanana kadar geçen karelerde defalarca sayaç artırırdı.
    if (!s.armed) {
      if (tMs < s.boundary - 100) s.armed = true;
      return null;
    }

    if (tMs >= s.boundary) return advance();
    return null;
  }, [advance]);

  /**
   * Ses dosyası bitti — sûrenin son ayetinde `boundary` duration'ı aşabileceği
   * için tick sınırı hiç görmez. onended bu boşluğu kapatır.
   */
  const forceBoundary = useCallback(() => {
    const s = live.current;
    if (!s.active || !s.armed) return null;
    return advance();
  }, [advance]);

  return {
    session,
    isRunning: !!session,
    start,
    stop,
    tick,
    forceBoundary,
  };
}
