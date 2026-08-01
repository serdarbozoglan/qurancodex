'use client';

// ─── useHifzSession — Ezber zamanlayıcısı ───────────────────────────────────
//
// Karaoke altyapısının (tek sûre mp3 + qdc ms damgaları) üstüne oturan A–B
// döngüsü + kartopu programı. Ses elementinin sahibi ReadingMode'dur; bu hook
// SADECE "şu an hangi pencerede olmalıyız, sınıra gelince ne yapılmalı"
// sorusunu yanıtlar. Zamanlayıcı mantığı ReadingMode'un 10K satırlık
// gövdesinden bağımsız ve tek başına test edilebilir kalır.
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
// ── Sınır neden `to`nun GERİSİNDE? ──────────────────────────────────────────
// qdc damgaları sesi BİTİŞİK böler: her ayetin `to`su bir sonraki ayetin
// `from`una eşittir (A'lâ 87'de 19/19 ayette boşluk = 0 ms; 2026-07-31
// ölçümü). Yani `to` ayet sonu sessizliği DEĞİL, sonraki ayetin konuşma
// başlangıcıdır.
//
// rAF ~16 ms adımlarla örneklediği için `tMs >= to` ateşlendiğinde zaten
// sonraki ayetin ilk milisaniyeleri çalınmış olur — kullanıcı bunu "ikinci
// ayetin ilk harfi duyuluyor" diye raporladı. Üstüne sert `pause()` tık
// üretir ("teyp kapanışı"). Çözüm: sınırı LEAD_MS geri çek; ses rampası bu
// pencerede 0'a iner, `to`ya varmadan duraklarız.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useRef, useCallback, useEffect } from 'react';

// ── LEAD_MS — SESSİZ PENCEREYE KESME (genlik ölçümü, 2026-08-01) ───────────
// Kesme noktası, ayetin ses kuyruğu bittikten SONRA ve sonraki ayetin sesi
// başlamadan ÖNCE olmalı. Orada genlik zaten sıfırdır: ne tık çıkar, ne
// kırpma olur — ve ses rampasına hiç ihtiyaç kalmaz (bkz. lib/audio-fade.js).
//
// A'lâ 87 / Meşarî mp3'ü OfflineAudioContext ile çözülüp RMS zarfı çıkarıldı:
//   • `from` damgası HER ayette gerçek ses başlangıcının 10-60 ms ÖNCESİNDE
//     → seek noktası sessizlikte, ayet başı kırpılmıyor (0/19)
//   • Ses kuyruğunun bitişi ile `to` arası EN DAR marj: 80 ms (87:18)
//   • `to` ile sonraki ayetin ses başlangıcı arası EN DAR marj: 10 ms (87:3)
//   → sessiz pencere en kötü durumda [to-80, to+10]
//
// LEAD = 40 → kesme `to-40`'ta, pencerenin ortasına yakın; iki yönde de
// ~40 ms marj. Ölçümle doğrulandı: 19/19 ayette ne baş ne kuyruk kırpılıyor.
//
// Önceki değer 160 ms idi ve YANLIŞTI — yalnızca "`to`yu aşmayalım" kriterine
// göre seçilmişti, sesin gerçekte nerede bittiğine bakılmadan; 16/19 ayette
// kuyruğu kesiyordu (kullanıcı raporu: "başka bir harf sesi truncate edilmiş
// gibi" — duyulan şey bir ÖNCEKİ tekrarın kırpılmış kuyruğuydu).
//
// ⚠ Kalibrasyon TEK kârî (Meşarî) ve TEK sûre (87) ölçümünden. Başka
// kârîlerde marj daha dar olabilir; şikâyet gelirse aynı probe ile ölçülmeli.
const LEAD_MS = 40;

// Sınır `from`a bu kadar yaklaşamaz — aşırı kısa ayetlerde sınırın pencere
// başına düşüp anında tetiklenmesini engeller.
const MIN_WINDOW_MS = 400;

// Tekrarlar arası nefes payı. 0 olursa tekrarlar birbirine yapışır.
export const DEFAULT_BREATH_MS = 400;

// Adımlar arası (yeni ayete / birleştirmeye geçiş) duraklama. Nefes payından
// belirgin uzun olmalı — kulak "yeni bir şey başlıyor" sinyalini almalı.
// Bu pencere aynı zamanda "Tekrarla" kaçışının aktif olduğu süredir.
export const DEFAULT_GAP_MS = 2000;

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

export default function useHifzSession({ timings, enabled, breathMs = DEFAULT_BREATH_MS, gapMs = DEFAULT_GAP_MS }) {
  // Görünür durum — panel/HUD bunu okur.
  const [session, setSession] = useState(null);

  // rAF-sıcak durum. tick her karede buraya bakar, React'e dokunmaz.
  const live = useRef({
    active: false, surah: 0,
    steps: [], idx: 0, autoAdvance: true,
    from: 0, to: 0, boundary: 0, fromAyah: 0, toAyah: 0, kind: 'single',
    target: 0, count: 0, armed: true, phase: 'idle',
  });

  // Karaoke kapanır/kârî değişirse oturum geçersizdir — A–B penceresi artık
  // ölçülemez. Guard'lı: zaten oturum yoksa setState hiç çağrılmaz.
  useEffect(() => {
    if (enabled) return;
    live.current.active = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- harici yetenek kaybına (kârî/karaoke kapandı) senkron tepki; başka sinyal yolu yok.
    setSession(prev => (prev === null ? prev : null));
  }, [enabled]);

  /** Bir ayet aralığı için A–B penceresi. */
  const buildWindow = useCallback((surah, fromAyah, toAyah) => {
    if (!timings) return null;
    const first = timings[`${surah}:${fromAyah}`];
    const last = timings[`${surah}:${toAyah}`];
    if (!first || !last) return null;
    return {
      from: first.from,
      to: last.to,
      boundary: Math.max(first.from + MIN_WINDOW_MS, last.to - LEAD_MS),
    };
  }, [timings]);

  // Panel'e yansıyan anlık görüntü — live ref'ten türetilir.
  const snapshot = useCallback(() => {
    const s = live.current;
    return {
      surah: s.surah,
      fromAyah: s.fromAyah,
      toAyah: s.toAyah,
      kind: s.kind,
      target: s.target,
      count: s.count,
      stepIndex: s.idx,
      stepCount: s.steps.length,
      phase: s.phase,           // 'playing' | 'gap'
      autoAdvance: s.autoAdvance,
      // Sıradaki adım — gap sırasında "sonraki: …" göstermek için
      next: s.steps[s.idx + 1] || null,
    };
  }, []);

  // idx'inci adımı yükle. Pencere kurulamazsa false.
  const loadStep = useCallback((i) => {
    const s = live.current;
    const step = s.steps[i];
    if (!step) return false;
    const win = buildWindow(s.surah, step.from, step.to);
    if (!win) return false;
    s.idx = i;
    s.kind = step.kind;
    s.fromAyah = step.from;
    s.toAyah = step.to;
    s.from = win.from;
    s.to = win.to;
    s.boundary = win.boundary;
    s.count = 0;
    s.armed = true;
    s.phase = 'playing';
    return true;
  }, [buildWindow]);

  /**
   * Oturumu başlat.
   * @param verse   seçili ayet — programın başlangıcı
   * @param repeat  her adımın tekrar sayısı
   * @param opts    { lastAyah, blockSize, autoAdvance }
   * @returns {{seekTo:number}|null} çalmaya başlanacak nokta (saniye)
   */
  const start = useCallback((verse, repeat, opts = {}) => {
    if (!enabled || !verse) return null;
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
    return { seekTo: live.current.from / 1000 };
  }, [enabled, loadStep, snapshot]);

  const stop = useCallback(() => {
    live.current.active = false;
    live.current.phase = 'idle';
    setSession(null);
  }, []);

  // Sınıra varıldı — sayacı ilerlet ve aksiyonu belirle.
  const advance = useCallback(() => {
    const s = live.current;
    if (!s.active) return null;

    s.count += 1;
    s.armed = false;

    if (s.count < s.target) {
      setSession(snapshot());
      return { type: 'repeat', seekTo: s.from / 1000, pauseMs: breathMs };
    }

    // Adım tamamlandı.
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
  }, [breathMs, gapMs, snapshot]);

  /**
   * Geçiş penceresi doldu — sıradaki adıma geç.
   * @returns {{seekTo:number}|null} null ise program bitti
   */
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
    return { seekTo: s.from / 1000 };
  }, [loadStep, snapshot]);

  /**
   * "Bu ayeti tekrarla" — geçiş penceresinde kullanıcı henüz hazır değilse
   * aynı adımı baştan çalar. Ezber hızı ayete göre değişir; katı bir
   * "N bitti, sıradaki" kullanıcıyı oturmamış bir ayetten koparır.
   */
  const restartStep = useCallback(() => {
    const s = live.current;
    if (!s.active) return null;
    if (!loadStep(s.idx)) return null;
    setSession(snapshot());
    return { seekTo: s.from / 1000 };
  }, [loadStep, snapshot]);

  /** Her rAF karesinde çağrılır. @param tMs audio.currentTime * 1000 */
  const tick = useCallback((tMs) => {
    const s = live.current;
    if (!s.active || s.phase !== 'playing') return null;

    // Geri sarma sonrası yeniden kur: `armed` olmadan tek bir sınır geçişi,
    // seek tamamlanana kadar geçen karelerde defalarca sayaç artırırdı.
    if (!s.armed) {
      if (tMs < s.boundary - 100) s.armed = true;
      return null;
    }
    if (tMs >= s.boundary) return advance();
    return null;
  }, [advance]);

  /**
   * Ses dosyası bitti — programın son ayetinde `boundary` dosya süresini
   * aşabileceği için tick sınırı hiç görmez. onended bu boşluğu kapatır.
   */
  const forceBoundary = useCallback(() => {
    const s = live.current;
    if (!s.active || s.phase !== 'playing' || !s.armed) return null;
    return advance();
  }, [advance]);

  /**
   * Aktif pencereyi ref'ten okur — STABİL kimlik (deps'e girebilir).
   * rAF döngüsü her karede çağırır; `session` state'ini deps'e koymak sayaç
   * her arttığında karaokeFrame'i yeniden kurar ve çalışan döngü eski
   * closure'da kalırdı.
   */
  const getWindow = useCallback(() => {
    const s = live.current;
    return s.active
      ? { active: true, surah: s.surah, fromAyah: s.fromAyah, toAyah: s.toAyah }
      : { active: false };
  }, []);

  return {
    session,
    isRunning: !!session,
    start,
    stop,
    tick,
    forceBoundary,
    getWindow,
    commitAdvance,
    restartStep,
  };
}
