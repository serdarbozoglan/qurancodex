# Ses Mimarisi (SoundArchitecture) — Tam Restorasyon + Genişletme

**Tarih:** 2026-04-25
**Branch:** qc_v1.5_fix
**Brief kaynağı:** Akademik kritik + cd072bb commit'inde silinen içerik

## A — i18n İçerik Düzeltmesi

- [ ] `tr.json` + `en.json` `soundArchitecture` bloğu yenile
  - [ ] Intro: "ص" sınıflandırması düzelt (fricative, plosive değil)
  - [ ] Phonetics: "nazal ve sürtünmeli" hatası → "nazal ve likit"
  - [ ] Closing güçlendir: "anlamdan ÖNCE ses" → "ses ve anlam tek doku"
  - [ ] Yeni bloklar:
    - [ ] `comparison` (Azap vs Rahmet kartı için)
    - [ ] `tajwid` (Tafhīm/Tarqīq/Qalqala paneli için)
    - [ ] `discovery` ("Tahmin Et" widget için)
    - [ ] `classicalSource` (Bâkıllânî/Cürcânî alıntı kartı)
    - [ ] `methodology` (akademik dürüstlük notu)

## B — JSX Görsel Restorasyon + Genişletme

- [ ] Hero/Intro: hardness band'i mevcut korunur
- [ ] **Azap vs Rahmet karşılaştırma kartı (yeniden)**
  - [ ] Sol: jagged bar (kırmızı, azap)
  - [ ] Sağ: smooth bar (yeşil, rahmet)
  - [ ] Frekans yüzdesi (dürüst kaynak: Quranic Arabic Corpus tahmin)
  - [ ] Methodology pill — kesin değil, sezgisel
- [ ] **Klasik Tecvid Paneli** (3 kart)
  - [ ] Tafhīm (kalın): خ ص ض ط ظ غ ق
  - [ ] Tarqīq (ince): geri kalanlar
  - [ ] Qalqala (titreyen): ق ط ب ج د (kutb-i cedd lafzı mnemonic)
- [ ] **"Tahmin Et" widget**
  - [ ] 3 ayet (audio key + Arapça + cevap)
  - [ ] Kullanıcı seçer → reveal
  - [ ] Skor göstergesi
- [ ] **Klasik kaynak alıntısı kartı**
  - [ ] El-Bâkıllânî veya İbn Sînâ — 1 alıntı
- [ ] Closing güçlendir

## C — Audio (mevcut sistem yeterli)

- [ ] Mevcut `buildFallbackUrls` CDN sistemi korunur
- [ ] "Tahmin Et" widget için 3 ayet audioKey tanımlanır

## Doğrulama

- [ ] `npm run build` hatasız
- [ ] Mobil + masaüstü kontrol (sözlü)
- [ ] CLAUDE.md kuralları: FONTS.quran, COLORS, OVERLAY pattern uyumu

## Commit

- [ ] Tek commit, conventional format
- [ ] Push onayı bekle (kullanıcı per-action onaylıyor)

---

# Karaoke Modu — Kelime-Bazlı Ayet Highlight

**Tarih:** 2026-05-18
**Branch:** TBD (main üstünde yeni feature branch — `feat/karaoke-word-highlight`)
**Kapsam:** ReadingMode'da çalan ayetin kelimesini real-time highlight et. Quran.com qdc audio timing API'sı + Quran.com native mp3 + EveryAyah fallback.

## Onaylanan Kararlar — Revize (2026-05-18, A.1 sonrası)

1. **Audio source:** Karaoke kârileri için **per-surah mp3** (`download.quranicaudio.com/qdc/{slug}/murattal/{N}.mp3` — 114 dosya). Verse navigasyonu `audio.currentTime` seek ile yapılır (timing verisinden `timestamp_from`). Mevcut per-ayet EveryAyah/qurancdn audio chain'i karaoke kârileri için yalnızca **fail durumunda fallback**.
2. **Timing data:** Runtime fetch + cache (in-memory + localStorage LRU 20 surah). Endpoint: `api.qurancdn.com/api/qdc/audio/reciters/{id}/audio_files?chapter={s}&segments=true`. Response per-surah tek mp3 URL'si + ayet boundary'leri + word segments (hepsi surah-relative ms).
3. **UX scope:** Default ON. Çalan ayet auto-scroll merkez; aktif kelime altın + parlak, diğerleri `opacity: 0.5`. Toggle header'da; desteksiz kâri seçilirse switch disabled + tooltip.
4. **Segment normalization:** `segments.filter(s => s.length === 3)` — Quran.com tek-elemanlı marker array'ler döndürebiliyor (1:3, 2:255 gibi); bunlar drop edilir. Filtered count !== corpus word count → o ayette karaoke disabled (verse-level fallback).
5. **A.2 alignment doğrulandı:** 1:1, 1:2, 1:4–1:7, 2:1, 2:255 → filtered segment count === corpus word count. Bismillah word indexing 1-based, corpus ile eşleşiyor.

## Desteklenen Kâriler (4/6)

| RECITERS[idx] | Quran.com id | mp3 base |
|---|---|---|
| 0 — Alafasy | 7 | verify (muhtemelen `Alafasy`) |
| 2 — Abdul Basit Murattal | 2 | verify |
| 3 — Husary | 6 | verify |
| 4 — Minshawy Murattal | 9 | verify |

Desteksiz: idx 1 (Ğâmidî), idx 5 (Cibrîl) — karaoke disabled, ses zaten EveryAyah'tan çalmaya devam.

## A — Hazırlık & Doğrulama (kod yazmadan önce)

- [ ] **A.1** Her 4 kâri için `verses.quran.com` URL pattern'ini doğrula
  - [ ] `api.qurancdn.com/api/qdc/audio/reciters/{2,6,7,9}/audio_files?chapter=1&segments=true` çağır
  - [ ] `audio_files[0].url` field'ından base path'i çıkar (örn. `Alafasy/mp3/001001.mp3`)
  - [ ] Tam URL'yi tarayıcıda dene; 200 + audio/mpeg geliyor mu?
  - [ ] CORS preflight gerekiyor mu? (`<audio src>` için gerekmemeli, doğrula)
- [ ] **A.2** Word index alignment doğrula
  - [ ] Fatiha 1:1 için Quran.com segments → 4 word (bismillah ı ar-raḥmāni r-raḥīm)
  - [ ] Bizim `corpusBySurah[1].verses[0].words.length` aynı mı? Aynıysa wordIdx (1-based) → corpus index (0-based) basit `-1` map.
  - [ ] Farklıysa hangi sure'larda divergence var? (Bismillah'ı ayet sayan sure 1 vs saymayan diğerleri; basmala/bismillah word splitting farkları)

## B — Data Layer

- [ ] **B.1** `src/hooks/useWordTimings.js` — YENİ dosya
  - [ ] `fetchSurahTimings(quranComReciterId, surahNum)` → `Promise<Map<verseKey, segments>>`
  - [ ] In-memory cache: `Map<"reciter:surah", timings>`
  - [ ] localStorage persistence: anahtar `qurancodex_timings_{reciterId}_{surah}`, max 20 girdi LRU
  - [ ] Endpoint: `https://api.qurancdn.com/api/qdc/audio/reciters/{id}/audio_files?chapter={s}&segments=true`
  - [ ] Hata yönetimi: network/timeout → throw, caller karaoke'yi disable etsin
  - [ ] Segments normalize: hem `[1,0,580]` integer hem `[1,0.0,1040.0]` float gelebilir → ms integer'a çevir
- [ ] **B.2** `src/hooks/useAudioWithFallback` güncelle
  - [ ] 4 karaoke kârisi için fallback chain'in **en başına** `verses.quran.com/{folder}/mp3/{file}.mp3` URL'sini ekle
  - [ ] Audio yüklendiğinde "hangi URL succeed etti" bilgisini callback ile yukarı bildir (`onSourceLoaded(url)`)
  - [ ] `RECITER_QURAN_COM_BASE` map'i ekle (A.1'de doğrulanan base path'ler)
- [ ] **B.3** `src/components/ReadingMode.jsx` RECITERS metadata
  - [ ] Her objeye `quranComId` (number | null) ve `audioBasePath` (string | null) alanları ekle
  - [ ] Helper: `function hasKaraoke(reciterIdx) { return RECITERS[reciterIdx].quranComId != null }`

## C — Highlight State Machine

- [ ] **C.1** ReadingMode component-level state
  - [ ] `karaokeEnabled` (toggle, default `true`, localStorage'da kalıcı: `qurancodex_karaoke_on`)
  - [ ] `currentSegments` — çalan ayetin segments array'i (yoksa `null`)
  - [ ] `activeWordIdx` — şu an parlayan kelime (1-based, segments ile uyumlu)
  - [ ] `karaokeReadyForVerse` — bool (audio Quran.com'dan yüklendi + timing var + reciter destekli)
- [ ] **C.2** Audio event entegrasyonu
  - [ ] `audio.addEventListener('timeupdate', updateActiveWord)` — yetersiz olabilir (~250ms granularity); `requestAnimationFrame` loop'u tercih et
  - [ ] `updateActiveWord(currentTimeMs)`: segments içinde `start <= t < end` olan word'ü bul, `activeWordIdx` set et
  - [ ] Audio durunca rAF loop'unu kapat, ama `activeWordIdx`'i sıfırlama (pause'da freeze)
  - [ ] Audio seek (scrub) → rAF zaten doğru segment'i bulur, ekstra iş yok
- [ ] **C.3** Ayet değişimi
  - [ ] Yeni ayet çalmaya başlayınca `currentSegments`'i o ayetin timing'iyle güncelle
  - [ ] Eski ayetin `activeWordIdx` sıfırla
  - [ ] Auto-advance varsa: sonraki ayetin segments'i de hazır olmalı (sure timing'i tek seferde çekildi zaten)

## D — UI Rendering

- [ ] **D.1** VerseRow word rendering
  - [ ] Mevcut word rendering loop'unda her `<span>` için: `data-word-idx={i+1}`
  - [ ] Active kelime: `style={{ color: COLORS.gold, opacity: 1, transition: 'all 80ms' }}`
  - [ ] Inactive kelimeler (karaoke aktif çalan ayette): `style={{ opacity: 0.5, transition: 'opacity 80ms' }}`
  - [ ] Karaoke kapalı veya bu ayet çalmıyor: mevcut stil korunur (regresyon yok)
- [ ] **D.2** Auto-scroll
  - [ ] Yeni ayet çalmaya başlayınca `verseRowRef.scrollIntoView({ behavior: 'smooth', block: 'center' })`
  - [ ] `prefers-reduced-motion` kontrolü → `block: 'nearest'` veya hiç scroll yapma
- [ ] **D.3** Header toggle
  - [ ] ReadingMode header'a (reciter selector yanına) "🎤 Karaoke" toggle ekle
  - [ ] i18n: `tr.json` `readingMode.karaoke.toggle = "Karaoke"`, `en.json` aynı
  - [ ] Desteksiz kâri seçiliyse: toggle disabled, tooltip "Bu kâri için kelime takibi yok" / "Word highlighting not available for this reciter"
- [ ] **D.4** Fallback badge
  - [ ] Audio Quran.com'dan değil de EveryAyah'tan yüklendiyse, çalan ayetin yanında küçük gri badge: "fallback" — kullanıcıya neden highlight olmadığını açıklar
  - [ ] i18n: `readingMode.karaoke.fallbackBadge` (TR: "yedek kaynak", EN: "fallback source")

## E — Edge Case Handling

- [ ] **E.1** Reciter mid-playback değişimi
  - [ ] Çalan ayeti durdur, `activeWordIdx`'i sıfırla, yeni kârinin timing'ini fetch et (gerekirse)
- [ ] **E.2** Quran.com qdc API down
  - [ ] Timing fetch fail → catch, console.warn, `karaokeReadyForVerse = false`, ses çalmaya devam eder
  - [ ] Toast/badge zorunlu değil — sessiz degradation
- [ ] **E.3** Sure değişimi
  - [ ] Yeni sure açılınca `useWordTimings`'i prefetch et (background, bekleme yok)
- [ ] **E.4** Mobile
  - [ ] Auto-scroll mobile'da rahatsız edici olabilir — `prefers-reduced-motion` + mobile için `block: 'nearest'` tercih
  - [ ] Toggle mobile header'a sığar mı? Reciter selector + meal selector + dil + close butonu zaten dolu — gerekirse "Karaoke" toggle'ı ayarlar menüsüne (ChapterProgress içine?) taşı
- [ ] **E.5** Word index mismatch (A.2'de tespit edilirse)
  - [ ] Sure özelinde offset map yaz (örn. "sure 1 dışında: corpusIdx = wordIdx - 1")
  - [ ] Eğer divergence sistematikse, mismatch case'inde karaoke o ayet için disable

## F — Test & Doğrulama

- [ ] **F.1** Fatiha 1:1 manuel test — Alafasy seçili, play; her kelime sırayla parlıyor mu?
- [ ] **F.2** Reciter switch testi — Alafasy → Ğâmidî; toggle disabled olduğunu doğrula, audio yine çalsın
- [ ] **F.3** Quran.com network kesintisi simulasyonu — DevTools Network throttle → "Offline" yapıp Quran.com mp3 fail ettir, EveryAyah'tan ses çalmaya devam ettiğini, karaoke'nin sessizce kapandığını doğrula
- [ ] **F.4** Uzun sure (Bakara) timing fetch performansı — ilk fetch süresi, localStorage cache hit performansı
- [ ] **F.5** Reduced motion testi — system pref açıkken auto-scroll smooth değil instant
- [ ] **F.6** Mobile (390px) — toggle ulaşılabilir mi, highlight kelime görsel olarak görünür mü
- [ ] **F.7** `npm run build` — bundle size delta, type/lint pass
- [ ] **F.8** Regression check — karaoke kapalı + Ğâmidî seçili → eski davranışın birebir korunduğunu doğrula

## G — i18n & Commit

- [ ] **G.1** `tr.json` + `en.json` yeni anahtarlar:
  - `readingMode.karaoke.toggle`
  - `readingMode.karaoke.tooltip.unsupported`
  - `readingMode.karaoke.fallbackBadge`
- [ ] **G.2** CLAUDE.md güncelleme — §13.x altında "Karaoke Word Timing Kuralı" notu (audio source eşleştirmesi zorunlu)
- [ ] **G.3** Feature branch: `feat/karaoke-word-highlight`
- [ ] **G.4** Atomik commit'ler:
  - `feat(reading): add Quran.com word timing fetch hook`
  - `feat(reading): wire Quran.com mp3 as primary audio for 4 reciters`
  - `feat(reading): word-level karaoke highlight with rAF loop`
  - `feat(i18n): karaoke toggle + fallback badge strings`
- [ ] **G.5** Push onayı bekle (kullanıcı per-action onaylar — CLAUDE.md kuralı)

## Bilinen Riskler

- **Quran.com qdc API stability:** Çok kullanılıyor (Quran.com kendisi bağlı), düşmesi düşük ihtimal ama mümkün. Sessiz degradation onu absorbe ediyor.
- **mp3 master farkı:** Quran.com vs EveryAyah master'lar normalize edilmiş mi? A.1'de aynı reciter aynı ayet için iki dosyayı dinleyip drift'i ölçeceğiz. Eğer Quran.com mp3'ü EveryAyah'a göre belirgin biçimde farklı tonlama/hız ise, kullanıcı reciter değiştirdiğinde ses karakteri değişebilir — bu kötü olabilir.
- **localStorage quota:** 4 kâri × 114 sure × ~10KB JSON = ~4.5MB. LRU 20 surah cap'i bunu ~800KB'a düşürür. localStorage limiti tarayıcıda 5-10MB, sorun yok.
- **Word boundary alignment:** Bismillah'ı bağımsız ayet sayan sure 1 vs diğer surelerin başındaki bismillah'ı saymayan corpus konvansiyonu — Quran.com word indexing ile bizimki bu noktada eşleşmeyebilir. A.2 buna bakacak.

