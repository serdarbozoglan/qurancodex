'use client';

// ─── useHifzSession — Ezber zamanlayıcısı ───────────────────────────────────
//
// AYET AYET ses dosyaları üzerinde çalışır (everyayah: `087001.mp3`).
// Bu bileşen SADECE "sıradaki hangi ayet, kaçıncı tekrar, ne zaman geçiş"
// sorusunu yanıtlar; ses elementinin sahibi ReadingMode'dur.
//
// ── Neden ayet ayet dosya (2026-08-02 mimari değişikliği) ───────────────────
// Önceki sürüm tek sûre mp3'ünü kullanıyor ve ayet sınırlarını `currentTime`
// ile kesiyordu. Bu yaklaşım üç turda da başarısız oldu, çünkü kesme noktası
// ne kadar iyi seçilirse seçilsin şu üç etken üst üste biniyordu:
//
//   1. rAF granülerliği + setSession'ın tetiklediği React render'ı →
//      duraklama sınırdan ~60 ms geç gerçekleşiyor
//   2. Ses donanım kuyruğu → `pause()` anında ~100-200 ms içerik zaten
//      kuyruğa alınmış ve çalınmaya devam ediyor
//   3. qdc damgaları BİTİŞİK (to === sonraki from), ayetler arası sessiz
//      pencere en dar yerde ~140 ms — çıkış gecikmesinden dar
//
// Ölçüm (A'lâ 87, Alafasy): everyayah ayet dosyaları 5-50 ms baş, 85-425 ms
// son sessizliğiyle geliyor. Yani dosyanın kendisi zaten temiz kesilmiş;
// `onended` doğal olarak tetikleniyor, kesme diye bir işlem YOK. Sızma
// imkânsız (dosyada sonraki ayet yok), çıkış gecikmesi önemsiz, iOS'un
// salt-okunur `volume`'u önemsiz, React jank'i önemsiz.
//
// Bedeli: everyayah kayıtları qdc sûre kaydıyla AYNI DEĞİL (ölçüm: konuşma
// süresi farkı %97-114 arası, 87:19'da 668 ms). Bu yüzden kelime düzeyi
// vurgu ezber modunda kullanılamaz — ayet düzeyi vurgu kalır. Normal
// karaoke modu sûre dosyasında devam ettiği için oradaki kelime vurgusu
// etkilenmez. (Kullanıcı onayı 2026-08-02.)
//
// ── Program (kartopu / snowball) ────────────────────────────────────────────
// Klasik hıfz yöntemi: ayeti öğren, sonra öncekilerle BİRLEŞTİR. Zor olan
// ezberlemek değil, ayetleri birbirine bağlamaktır (ribât).
//
//   Ayet 1 ×N → Ayet 2 ×N → [1-2] ×N → Ayet 3 ×N → [1-3] ×N → …
//
// Kümülatif pencere sınırsız büyüyemez (Bakara'da imkânsız), o yüzden
// BLOK bazlı: blok içinde kartopu, blok dolunca sonraki bloğa geçilir.
// Blok son birleştirmesi (`[b0-b1]`) aynı zamanda blok pekiştirmesidir.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useRef, useCallback } from 'react';

// Tekrarlar arası nefes payı. 0 olursa tekrarlar birbirine yapışır.
export const DEFAULT_BREATH_MS = 400;

// Adımlar arası (yeni ayete / birleştirmeye geçiş) duraklama. Nefes payından
// belirgin uzun olmalı — kulak "yeni bir şey başlıyor" sinyalini almalı.
// Bu pencere aynı zamanda "Tekrarla" kaçışının aktif olduğu süredir.
export const DEFAULT_GAP_MS = 2000;

// Birleştirme adımında ayetler arası kısa soluk. Dosyaların kendi son
// sessizliği zaten var (85-425 ms), bu yüzden küçük tutulur.
export const DEFAULT_JOIN_GAP_MS = 250;

export const REPEAT_PRESETS = [3, 5, 7, 10];
export const DEFAULT_REPEAT = 5;
export const DEFAULT_BLOCK = 5;

/**
 * Kartopu programını üret.
 * Blok içinde: her ayet tek tek, ardından blok başından o ayete birleştirme.
 * @returns {{kind:'single'|'join', from:number, to:number}[]}
 */
export function buildSnowballPlan(fromAyah, lastAyah, blockSize = DEFAULT_BLOCK) {
  const steps = [];
  if (!Number.isFinite(fromAyah) || !Number.isFinite(lastAyah) || lastAyah < fromAyah) return steps;
  const k = Math.max(1, Math.floor(blockSize) || DEFAULT_BLOCK);
  for (let b0 = fromAyah; b0 <= lastAyah; b0 += k) {
    const b1 = Math.min(b0 + k - 1, lastAyah);
    for (let v = b0; v <= b1; v++) {
      steps.push({ kind: 'single', from: v, to: v });
      // Blok başındaki ayette birleştirilecek bir önceki yok.
      if (v > b0) steps.push({ kind: 'join', from: b0, to: v });
    }
  }
  return steps;
}

const ayahsOf = (step) => {
  const out = [];
  for (let a = step.from; a <= step.to; a++) out.push(a);
  return out;
};

export default function useHifzSession({
  breathMs = DEFAULT_BREATH_MS,
  gapMs = DEFAULT_GAP_MS,
  joinGapMs = DEFAULT_JOIN_GAP_MS,
} = {}) {
  const [session, setSession] = useState(null);

  const live = useRef({
    active: false, surah: 0,
    steps: [], idx: 0, autoAdvance: true,
    ayahs: [], pos: 0,
    target: 0, count: 0, phase: 'idle',
  });

  const snapshot = useCallback(() => {
    const s = live.current;
    return {
      surah: s.surah,
      fromAyah: s.steps[s.idx]?.from ?? 0,
      toAyah: s.steps[s.idx]?.to ?? 0,
      kind: s.steps[s.idx]?.kind ?? 'single',
      playingAyah: s.ayahs[s.pos] ?? null,
      target: s.target,
      count: s.count,
      stepIndex: s.idx,
      stepCount: s.steps.length,
      phase: s.phase,                       // 'playing' | 'gap'
      autoAdvance: s.autoAdvance,
      next: s.steps[s.idx + 1] || null,
    };
  }, []);

  // idx'inci adımı yükle ve baştan kur.
  const loadStep = useCallback((i) => {
    const s = live.current;
    const step = s.steps[i];
    if (!step) return false;
    s.idx = i;
    s.ayahs = ayahsOf(step);
    s.pos = 0;
    s.count = 0;
    s.phase = 'playing';
    return true;
  }, []);

  /**
   * Oturumu başlat.
   * @returns {{ayah:number}|null} ilk çalınacak ayet
   */
  const start = useCallback((verse, repeat, opts = {}) => {
    if (!verse) return null;
    const lastAyah = Number.isFinite(opts.lastAyah) ? opts.lastAyah : verse.ayah;
    const steps = buildSnowballPlan(verse.ayah, lastAyah, opts.blockSize);
    if (steps.length === 0) return null;

    live.current = {
      ...live.current,
      active: true,
      surah: verse.surah,
      steps,
      autoAdvance: opts.autoAdvance !== false,
      target: Math.max(1, Math.floor(repeat) || DEFAULT_REPEAT),
    };
    if (!loadStep(0)) { live.current.active = false; return null; }
    setSession(snapshot());
    return { ayah: live.current.ayahs[0] };
  }, [loadStep, snapshot]);

  const stop = useCallback(() => {
    live.current.active = false;
    live.current.phase = 'idle';
    setSession(null);
  }, []);

  /**
   * Çalan ayet dosyası bitti — sırada ne var?
   *
   * Zamanlama matematiği YOK: dosya kendi doğal sonunda bitiyor, kesme
   * yapılmıyor. Tek karar "sıradaki ne".
   *
   * @returns {null
   *   | {type:'next-verse', ayah:number, pauseMs:number}   birleştirmede sıradaki ayet
   *   | {type:'repeat',     ayah:number, pauseMs:number}   adımı baştan tekrarla
   *   | {type:'gap',        gapMs:number}                  adım bitti, geçiş penceresi
   *   | {type:'done'}}                                     program bitti
   */
  const onVerseEnded = useCallback(() => {
    const s = live.current;
    if (!s.active || s.phase !== 'playing') return null;

    // Birleştirme adımının ortasındayız — sıradaki ayete geç.
    if (s.pos + 1 < s.ayahs.length) {
      s.pos += 1;
      setSession(snapshot());
      return { type: 'next-verse', ayah: s.ayahs[s.pos], pauseMs: joinGapMs };
    }

    // Adımın bir turu tamamlandı.
    s.count += 1;

    if (s.count < s.target) {
      s.pos = 0;
      setSession(snapshot());
      return { type: 'repeat', ayah: s.ayahs[0], pauseMs: breathMs };
    }

    const hasNext = s.idx + 1 < s.steps.length;
    if (!hasNext || !s.autoAdvance) {
      s.active = false;
      s.phase = 'idle';
      setSession(null);
      return { type: 'done' };
    }

    // Geçiş penceresi — idx HENÜZ ilerletilmez. Kullanıcı bu pencerede
    // "Tekrarla"ya basabilir; commitAdvance/restartStep kararı verir.
    s.phase = 'gap';
    setSession(snapshot());
    return { type: 'gap', gapMs };
  }, [breathMs, gapMs, joinGapMs, snapshot]);

  /** Geçiş penceresi doldu — sıradaki adıma geç. null ise program bitti. */
  const commitAdvance = useCallback(() => {
    const s = live.current;
    if (!s.active || s.phase !== 'gap') return null;
    if (!loadStep(s.idx + 1)) {
      s.active = false;
      s.phase = 'idle';
      setSession(null);
      return null;
    }
    setSession(snapshot());
    return { ayah: s.ayahs[0] };
  }, [loadStep, snapshot]);

  /**
   * "Bu ayeti tekrarla" — geçiş penceresindeki kaçış. Ezber hızı ayete göre
   * değişir; katı bir "N bitti, sıradaki" kullanıcıyı oturmamış bir ayetten
   * koparır.
   */
  const restartStep = useCallback(() => {
    const s = live.current;
    if (!s.active) return null;
    if (!loadStep(s.idx)) return null;
    setSession(snapshot());
    return { ayah: s.ayahs[0] };
  }, [loadStep, snapshot]);

  return {
    session,
    isRunning: !!session,
    start,
    stop,
    onVerseEnded,
    commitAdvance,
    restartStep,
  };
}
