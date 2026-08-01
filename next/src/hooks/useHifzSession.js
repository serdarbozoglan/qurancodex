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
import { FADE_MS } from '../lib/audio-fade';

// ── Sınır neden `to`'nun GERİSİNDE? ─────────────────────────────────────────
// qdc damgaları sesi BİTİŞİK böler: her ayetin `to`'su bir sonraki ayetin
// `from`'una eşittir (A'lâ 87'de 19/19 ayette boşluk = 0 ms; 2026-07-31
// ölçümü). Yani `to` ayet sonu sessizliği DEĞİL, sonraki ayetin konuşma
// başlangıcıdır.
//
// rAF ~16 ms adımlarla örneklediği için `tMs >= to` koşulu ateşlendiğinde
// zaten sonraki ayetin ilk milisaniyelerini çalmış oluruz — kullanıcı bunu
// "ikinci ayetin ilk harfi duyuluyor" diye raporladı (2026-07-31). Üstüne
// sert `pause()` tık sesi üretir ("teyp kapanışı").
//
// Çözüm: sınırı `to`'dan LEAD_MS geri çek. Rampa bu pencerede sesi 0'a
// indirir, `to`'ya varmadan duraklarız. Taşma yok, tık yok.
//
// LEAD_MS rampa süresinden BÜYÜK olmalı: tetikleme ile duraklama arasında
// rampanın kendisi (FADE_MS) + timer/promise zamanlama payı geçer. Ölçüm
// (2026-07-31): LEAD = FADE = 70 iken duraklama `to`yu 24-44 ms aşıyordu.
// 45 ms pay ile duraklama `to`nun hemen altına iniyor.
const LEAD_MS = FADE_MS + 45;

// Sınır `from`'a bu kadar yaklaşamaz — aşırı kısa ayetlerde (~200 ms)
// sınırın pencere başına düşüp anında tetiklenmesini engeller.
const MIN_WINDOW_MS = 400;

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
  const live = useRef({
    active: false, from: 0, to: 0, boundary: 0, target: 0, count: 0, armed: true,
    surah: 0, fromAyah: 0, toAyah: 0,
  });

  /**
   * Aktif pencereyi ref'ten okur — STABİL kimlik (deps'e girebilir).
   * rAF döngüsü bunu her karede çağırır; `session` state'ini deps'e koymak
   * sayaç her arttığında karaokeFrame'i yeniden kurar ve çalışan döngü eski
   * closure'da kalırdı.
   */
  const getWindow = useCallback(() => {
    const s = live.current;
    return s.active
      ? { active: true, surah: s.surah, fromAyah: s.fromAyah, toAyah: s.toAyah }
      : { active: false };
  }, []);

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

    // Sınırı `to`'nun gerisine çek (yukarıdaki LEAD_MS gerekçesi). Sûrenin
    // SON ayetinde taşacak bir sonraki ayet yok — orada `to`'ya kadar
    // çalınabilir, ama tık sesi için rampa yine gerekli, o yüzden aynı
    // geri çekme uygulanır (tutarlı davranış).
    const boundary = Math.max(first.from + MIN_WINDOW_MS, last.to - LEAD_MS);

    return { from: first.from, to: last.to, boundary };
  }, [timings]);

  /** Ezber oturumunu başlat. Pencere kurulamazsa false döner. */
  const start = useCallback((verse, repeat) => {
    if (!enabled || !verse) return false;
    const win = buildWindow(verse.surah, verse.ayah, verse.ayah);
    if (!win) return false;

    const target = Math.max(1, Math.floor(repeat) || DEFAULT_REPEAT);
    live.current = {
      active: true, ...win, target, count: 0, armed: true,
      surah: verse.surah, fromAyah: verse.ayah, toAyah: verse.ayah,
    };
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
    getWindow,
  };
}
