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
//
// ── Blok dikişi (2026-08-07) ────────────────────────────────────────────────
// Blok sınırı pencereyi sınırlıyordu ama blokları BİRBİRİNE bağlamıyordu:
// [1-5] ve [6-10] çalışılıyor, 5→6 geçişi hiç çalışılmıyordu. Klasik hıfzda
// en çok unutulan yer tam bu dikiştir ("beşinciye kadar akıcıyım, sonra
// takılıyorum"). Her blok bitince biten blok bir öncekiyle birleştirilir:
//
//   … [6-10] → [1-10] → … [11-15] → [6-15] → … [16-20] → [11-20] …
//
// Pencere iki blokta SABİT kalır (kayan zincir), sınırsız büyümez.
// Dikiş adımının amacı ezberlemek değil bağı kurmak; bu yüzden tekrar
// sayısı oturumunkinden bağımsız ve sabittir (SEAM_REPEAT). Aksi halde
// tekrar 5'te tek bir dikiş 50 ayet okuması eder ve oturum şişer.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useRef, useCallback } from 'react';

// Tekrarlar arası nefes payı. 0 olursa tekrarlar birbirine yapışır.
// 400 → 350 (kullanıcı 2026-08-07). Dosyanın kendi son sessizliği (85-425 ms)
// bunun üstüne bindiği için algılanan duraklama zaten daha uzun.
export const DEFAULT_BREATH_MS = 350;

// Adımlar arası (yeni ayete / birleştirmeye geçiş) duraklama. Nefes payından
// (400 ms) belirgin uzun olmalı — kulak "yeni bir şey başlıyor" sinyalini
// almalı. Bu pencere aynı zamanda "Tekrarla" kaçışının aktif olduğu süredir.
// 2000 → 1500 (2026-08-02) → 1200 (2026-08-07) — kullanıcı geri bildirimi.
// ⚠ Bu aynı zamanda "Tekrarla" kaçışının açık kaldığı süre; daha da
// düşürülürse butona yetişmek zorlaşır.
export const DEFAULT_GAP_MS = 1200;

// Birleştirme adımında ayetler arası kısa soluk. Dosyaların kendi son
// sessizliği zaten var (85-425 ms), bu yüzden küçük tutulur.
export const DEFAULT_JOIN_GAP_MS = 250;

// Dikiş adımının tekrar sayısı — oturumun tekrar ayarından BAĞIMSIZ, sabit.
// Kullanıcı kararı 2026-08-07: "dikişte 2 olsun her zaman."
export const SEAM_REPEAT = 2;

export const REPEAT_PRESETS = [3, 5, 7, 10];
export const DEFAULT_REPEAT = 5;
export const DEFAULT_BLOCK = 5;

/**
 * Kartopu programını üret.
 * Blok içinde: her ayet tek tek, ardından blok başından o ayete birleştirme.
 * Blok sonunda: bir önceki blokla dikiş (sabit SEAM_REPEAT tekrar).
 * @returns {{kind:'single'|'join'|'seam', from:number, to:number, repeat?:number}[]}
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
    // Dikiş: biten bloğu bir öncekiyle bağla. İlk blokta önceki yok.
    const prevB0 = b0 - k;
    if (prevB0 >= fromAyah) steps.push({ kind: 'seam', from: prevB0, to: b1, repeat: SEAM_REPEAT });
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

  // G4: her oturuma artan bir kimlik. Ses elementi artık oturum boyunca
  // YENİDEN KULLANILDIĞI için (otomatik-çalma kilidi), ReadingMode'daki
  // zamanlayıcıların `ref === element` kontrolü eski/yeni oturumu ayırt
  // edemiyor. Aksiyonlar `sid` taşır, callback'ler onu doğrular.
  const live = useRef({
    sid: 0,
    active: false, surah: 0,
    steps: [], idx: 0, autoAdvance: true,
    ayahs: [], pos: 0,
    // `repeat` = oturumun ayarı; `target` = YÜRÜRLÜKTEKİ adımın hedefi.
    // Dikiş adımları kendi sabit tekrarını taşıdığı için ikisi ayrı.
    repeat: 0, target: 0, count: 0, phase: 'idle',
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
      phase: s.phase,                       // 'idle' | 'playing' | 'gap' | 'paused'
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
    // Adım kendi tekrarını dayatabilir (dikiş); yoksa oturumun ayarı.
    s.target = Math.max(1, Math.floor(step.repeat) || s.repeat);
    s.phase = 'playing';
    return true;
  }, []);

  /**
   * Oturumu başlat.
   * @returns {{ayah:number}|null} ilk çalınacak ayet
   */
  const start = useCallback((verse, repeat, opts = {}) => {
    // G3: `!verse` truthy kontrolü yetmiyordu — {surah:87, ayah:0} veya
    // ayah:NaN geçip plana 0. ayeti sokuyor, `087000.mp3` gibi olmayan
    // dosyaya gidiyordu.
    if (!verse
      || !Number.isFinite(verse.surah) || verse.surah < 1
      || !Number.isFinite(verse.ayah) || verse.ayah < 1) return null;
    const lastAyah = Number.isFinite(opts.lastAyah) ? opts.lastAyah : verse.ayah;
    const steps = buildSnowballPlan(verse.ayah, lastAyah, opts.blockSize);
    if (steps.length === 0) return null;

    // G5: spread YOK — tam reset. `...live.current` eski oturumun alanlarını
    // (pos/ayahs/count/phase) taşıyordu; loadStep(0) çoğunu düzeltiyordu ama
    // ileride alan eklendiğinde sessizce sızardı. Alanları burada açıkça
    // saymak, hook'un durum yüzeyini de tek yerde görünür kılar.
    live.current = {
      sid: live.current.sid + 1,
      active: true,
      surah: verse.surah,
      steps,
      idx: 0,
      autoAdvance: opts.autoAdvance !== false,
      ayahs: [],
      pos: 0,
      repeat: Math.max(1, Math.floor(repeat) || DEFAULT_REPEAT),
      target: 0,          // loadStep(0) adımın hedefini kurar
      count: 0,
      phase: 'idle',
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
   * Duraklat — oturum KORUNUR, sadece ses durur. Ezber uzun bir iş; araya
   * giren bir kesinti (kapı, telefon) programı sıfırlamamalı.
   */
  const pause = useCallback(() => {
    const s = live.current;
    if (!s.active || s.phase !== 'playing') return false;
    s.phase = 'paused';
    setSession(snapshot());
    return true;
  }, [snapshot]);

  /** Devam et — duraklatılan ayeti BAŞTAN çalar (yarısından değil). */
  const resume = useCallback(() => {
    const s = live.current;
    if (!s.active || s.phase !== 'paused') return null;
    s.phase = 'playing';
    setSession(snapshot());
    return { ayah: s.ayahs[s.pos] };
  }, [snapshot]);

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
      return { type: 'next-verse', ayah: s.ayahs[s.pos], pauseMs: joinGapMs, sid: s.sid };
    }

    // Adımın bir turu tamamlandı.
    s.count += 1;

    if (s.count < s.target) {
      s.pos = 0;
      setSession(snapshot());
      return { type: 'repeat', ayah: s.ayahs[0], pauseMs: breathMs, sid: s.sid };
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
    return { type: 'gap', gapMs, sid: s.sid };
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
    // G1: yalnız geçiş penceresinde veya duraklatılmışken. 'playing' iken
    // çağrılırsa hook başa sarar ama ses ortada devam eder → UI/ses
    // senkronu bozulur.
    if (!s.active || (s.phase !== 'gap' && s.phase !== 'paused')) return null;
    if (!loadStep(s.idx)) return null;
    setSession(snapshot());
    return { ayah: s.ayahs[0] };
  }, [loadStep, snapshot]);

  /** G4: bu aksiyon hâlâ geçerli oturuma mı ait? */
  const isStale = useCallback((sid) => sid !== live.current.sid || !live.current.active, []);

  return {
    session,
    isRunning: !!session,
    isStale,
    start,
    stop,
    pause,
    resume,
    onVerseEnded,
    commitAdvance,
    restartStep,
  };
}
