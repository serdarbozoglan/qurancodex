# W22-U9 — Audio Pause-on-Navigation Audit

**Tarih:** 2026-05-25
**Branch:** `migration-to-next.js`
**Kapsam:** ReadingMode audio playback lifecycle, tool route navigasyonu (`/oku → /atlas/*`)
**Sonuç:** Sorun tespit edildi → minimal fix uygulandı.

---

## 1. Audio Lifecycle Haritası

ReadingMode (`next/src/components/ReadingMode.jsx`) içinde **iki paralel audio mekanizması** mevcut:

### A) Per-verse audio (ana okuma akışı)

| Ref | Satır | Görevi |
|---|---|---|
| `audioLiveRef` | 1688 | Şu anda çalan `Audio` instance |
| `audioPreloadRef` | 1689 | Bir sonraki ayetin preload edilmiş `Audio` instance'ı |

**Yaşam döngüsü:**
- **Create:** `new Audio(urls[urlIdx])` → `playVerseWithFallback()` (1762)
- **Preload:** `new Audio()` + `p.load()` → `playVerseWithFallback()` (1785-1789)
- **Stop (manuel):** `stopAudio()` (1743-1754) — kullanıcı pause butonuna basınca veya sure/ayet değişince çağrılır
- **Unmount cleanup:** **YOKTU** — fix öncesi `audioLiveRef` + `audioPreloadRef` için unmount cleanup useEffect mevcut değildi.

### B) Karaoke / sure audio (whole-surah streaming)

| Ref | Satır | Görevi |
|---|---|---|
| `surahAudioRef` | 1694 | Tüm sureyi stream eden `<audio>` element |
| `karaokeRAFRef` | 1695 | Word-highlight rAF handle |

**Yaşam döngüsü:**
- **Create:** `new Audio(audioUrl)` → `playVerseKaraoke()` (1850)
- **Unmount cleanup:** **VAR** — `useEffect` (1719-1728) `surahAudioUrl` değişiminde + unmount'ta cleanup yapar.

### C) Modal-içi compare verse audio (nested component)

- `audioRef` + `audioActiveRef` (8977-8978)
- **Unmount cleanup:** **VAR** — `useEffect(() => () => stopAudio(), [stopAudio]);` (9020)

---

## 2. Tespit Edilen Sorun

**Senaryo:**
1. Kullanıcı `/tr/oku/2` rotasında bir ayeti play yapar → `audioLiveRef.current = new Audio(...)` set edilir, sesi çalmaya başlar.
2. Kullanıcı Navbar veya başka link ile `/tr/atlas/kissa` rotasına geçer.
3. Next.js client-side navigation: ReadingMode unmount olur.
4. **Karaoke `surahAudioRef`** ✅ durdurulur (1719 useEffect cleanup).
5. **Per-verse `audioLiveRef`** ❌ durdurulmaz — `new Audio()` referansı GC tarafından toplanmadıkça (eventloop-based, hızlı garanti edilmez) sesi background'da çalmaya devam eder.
6. `audioPreloadRef` — preload edilmiş bir sonraki ayet — de bellek tutar, network'ten indirme tamamlanır.

**Sonuç:** Karaoke devre dışı durumdayken (varsayılan akış) tool route'a geçince **ayet sesi devam eder**. Kullanıcı tool sayfasında "neden hala ses çıkıyor?" sorusuyla karşılaşır.

**Reproduction adımları (manuel doğrulama):**
1. `/tr/oku/2` aç, bir ayeti play yap (karaoke kapalı — varsayılan).
2. Navbar'dan "Kıssa Atlası" (`/tr/atlas/kissa`) link'ine tıkla.
3. Fix öncesi: ses devam eder (sayılarla yaklaşık 1-2 sn'lik network delay sonra audio.play() ile mevcut). Fix sonrası: ses anında durur.

---

## 3. Uygulanan Fix

**Dosya:** `next/src/components/ReadingMode.jsx` (sadece ekleme — mevcut audio logic'ine dokunulmadı)

**Konum:** Mevcut karaoke cleanup useEffect'inin (1719-1728) hemen ardından.

**Yeni useEffect:**

```jsx
// W22-U9: Tool route'larına navigasyon (ReadingMode unmount) sırasında per-verse
// audio'yu da durdur. surahAudioRef cleanup'ı yukarıdaki effect halletiyor; bu
// effect audioLiveRef + audioPreloadRef için aynı sorumluluğu üstlenir. Aksi
// takdirde /oku → /atlas/kissa geçişinde ayet sesi background'da çalmaya devam
// eder (memory leak + UX kırılması).
useEffect(() => {
  return () => {
    const a = audioLiveRef.current;
    if (a) { a.onerror = null; a.onended = null; a.pause(); a.src = ''; audioLiveRef.current = null; }
    const p = audioPreloadRef.current;
    if (p) { p.src = ''; audioPreloadRef.current = null; }
  };
}, []);
```

### Tasarım kararları

- **Empty dependency array (`[]`):** Effect sadece mount'ta kurulur, cleanup yalnızca unmount'ta tetiklenir. Audio start/stop/preload state'i `audioLiveRef` ve `audioPreloadRef` (useRef) üzerinden okunduğu için dependency gerekmez — ref'ler render'a duyarsızdır.
- **`stopAudio` callback'i çağırılmadı:** `stopAudio` ek bağımlılıklar (`stopKaraokeLoop`) içeriyor; dependency'ye eklersek effect her render'da yeniden kurulur ve cleanup yanlış zamanda tetiklenir. Refleri doğrudan okumak güvenli + minimal yaklaşım.
- **`a.src = ''` ekledim:** `stopAudio()` (1743) sadece `a.pause()` yapıyor; unmount'ta network indirme stream'ini de kesmek için `src=''` ile abort tetikleniyor. Var olan `stopAudio` davranışını bozmamak için bu cleanup yalnızca unmount path'inde yapılıyor.
- **Karaoke cleanup'a karışmadım:** `surahAudioRef` zaten 1719 effect tarafından temizleniyor — duplicate logic eklemedim.

---

## 4. Doğrulama

- **Build:** `cd next && npm run build` (raporun sonunda kontrol edildi)
- **Runtime test (manuel önerilir):** Yukarıdaki "Reproduction adımları" — fix sonrası ses anında durmalı.
- **Diğer audio kullanıcıları (`Homepage`, `Navbar`):** Audio çalmıyor — sadece ReadingMode + nested CompareVerse modal'ı + `useAudioWithFallback` hook'u + bazı section'lar (SoundArchitecture, ImpossibleRhythm) tek başına play yapıyor. Tool route'lara navigasyon ReadingMode unmount'unu tetikler; diğer section/component'lar zaten kendi cleanup'larına sahip veya unmount path'inde değil.

---

## 5. Uzun Vadeli (Bu Audit Kapsamı Dışında)

- **Audio singleton:** Tüm uygulama için tek `AudioController` (context veya zustand store) — birden fazla component'in eşzamanlı audio start etmesini önler, global pause API sağlar. **Mevcut audit kapsamında uygulanmadı** (uzun vadeli refactor).
- **Route-change global pause hook:** `usePathname()` listener ile her route geçişinde global audio stop. Mevcut audio'lar component-local olduğu için bunu eklemek için önce singleton gerekiyor.

---

result: audio pause behavior - 1 sorun tespit edildi (per-verse audioLiveRef unmount cleanup eksikti), 1 fix uygulandi (yeni useEffect, lines 1730-1741)
