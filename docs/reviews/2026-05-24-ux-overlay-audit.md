# UX Overlay Audit (2026-05-24) — W22-U4 + W22-U10

**Kapsam:** Next.js migration sonrası tool overlay'lerinde Escape tuşu davranışı (W22-U4) ve route'lara özgü `document.title` üretimi (W22-U10).
**Yöntem:** `next/src/components/` ve `next/src/sections/` dizinleri statik grep ile taranmıştır. `document.title` testleri canlı production fetch (`https://www.qurancodex.com`) üzerinden yapılmıştır.

---

## Özet

- Esc handler kapsama: **35/37 audit edilen tool** Esc'i destekliyor.
- 2 component'te Esc handler eksik: `sections/ProphetAtlas.jsx` ve `components/TafsirPanel.jsx`.
- 1 component (`ReadingMode.jsx`) Esc'i bilinçli olarak modal-kapatma için kullanmıyor (tasarım kararı, line 1487-1488 yorum ile belgelenmiş — okuma modu yalnızca ✕ butonu ile kapatılır, alt-overlay'leri Esc kapatır).
- `document.title` kapsama: **10/10 sample route** kendine özgü, lokalize edilmiş title üretiyor (`pageMetadata` helper'ı + module-level TITLE const pattern doğru çalışıyor).

---

## W22-U4 — Escape Key Audit

### Esc Handler Mevcut (35 component)

Tüm aşağıdaki tool component'leri `useEffect` içinde `window.addEventListener('keydown', ...)` ile `e.key === 'Escape'` yakalayıp `onClose()` veya bir alt-state geri-alma fonksiyonu çağırıyor:

| Component | Dosya | Esc handler line | Davranış |
|---|---|---|---|
| AddresseeSystem | `next/src/components/AddresseeSystem.jsx` | 32 | `onClose()` |
| CennetCehennem | `next/src/components/CennetCehennem.jsx` | 158 | `onClose()` |
| ConceptGraph | `next/src/components/ConceptGraph.jsx` | 199-204 | `view === 'graph' → backToLanding(); else onClose()` |
| DiyalogAgi | `next/src/components/DiyalogAgi.jsx` | 140 | `onClose()` |
| DogaAtlasi | `next/src/components/DogaAtlasi.jsx` | 993 | `onClose()` |
| DuaVerses | `next/src/components/DuaVerses.jsx` | 249 | `onClose()` |
| EsmaFrekans | `next/src/components/EsmaFrekans.jsx` | 163 | `onClose()` |
| FurukAtlasi | `next/src/components/FurukAtlasi.jsx` | 93 | `onClose()` |
| IblisSatan | `next/src/components/IblisSatan.jsx` | 445 | `onClose()` (CLAUDE.md §13.3 not eklenmiş) |
| IlkSonKelimeler | `next/src/components/IlkSonKelimeler.jsx` | 83 | Alt-seçim varsa onu kapatır; yoksa `onClose()` |
| KadinlarAtlasi | `next/src/components/KadinlarAtlasi.jsx` | 107 | `onClose()` |
| KavimlerAtlasi | `next/src/components/KavimlerAtlasi.jsx` | 96 | `onClose()` |
| KiraatAtlasi | `next/src/components/KiraatAtlasi.jsx` | 1551 | `onClose()` |
| KissaAtlas | `next/src/components/KissaAtlas.jsx` | 103 | `onClose()` |
| KiyametSahneleri | `next/src/components/KiyametSahneleri.jsx` | 451 | `onClose()` |
| KuranRenkleri | `next/src/components/KuranRenkleri.jsx` | 1228 | `onClose()` |
| KuranRetorigi | `next/src/components/KuranRetorigi.jsx` | 45 | `onClose()` |
| KuranYeminleri | `next/src/components/KuranYeminleri.jsx` | 41 | `onClose()` |
| Melekler | `next/src/components/Melekler.jsx` | 1099 | `onClose()` |
| MeselAtlasi | `next/src/components/MeselAtlasi.jsx` | 1340-1356 | Sub-nav back; yoksa close butonu beklenir (bilinçli) |
| MunafikProfili | `next/src/components/MunafikProfili.jsx` | 65 | `onClose()` |
| MunasebatAtlasi | `next/src/components/MunasebatAtlasi.jsx` | 556 | `onClose()` |
| NefisMertebeleri | `next/src/components/NefisMertebeleri.jsx` | 55 | `onClose()` |
| QuranCommands (Buyruklar) | `next/src/components/QuranCommands.jsx` | 95 | `onClose()` |
| ReadingMode | `next/src/components/ReadingMode.jsx` | 1475-1492 | **Bilinçli istisna**: Sadece alt-overlay'leri kapatır (search/picker'lar); reading mode'u kapatmaz. Line 1487 yorum ile belgelenmiş. |
| RevelationTimeline | `next/src/components/RevelationTimeline.jsx` | 56 | `onClose()` |
| SebebiNuzul | `next/src/components/SebebiNuzul.jsx` | 1669 | `onClose()` |
| SemanticMap | `next/src/components/SemanticMap.jsx` | 50 | Alt-seçim varsa onu kapatır; yoksa `onClose()` |
| SunnetullahAtlasi | `next/src/components/SunnetullahAtlasi.jsx` | 63 | `onClose()` |
| SurahComparator (Karsilastir) | `next/src/components/SurahComparator.jsx` | 488-497 | `view === 'result' → setView('landing'); else onClose()` |
| ToolsBrowser | `next/src/components/ToolsBrowser.jsx` | 81 | `setOpen(false)` |
| VerseGraph | `next/src/components/VerseGraph.jsx` | 2613-2622 | `view === 'clusters' || initialSearch → onClose(); else setView('clusters')` |
| WordHeatmap | `next/src/components/WordHeatmap.jsx` | 607 | `onClose()` |
| WowFacts | `next/src/components/WowFacts.jsx` | 712 | `onClose()` |
| ZamanBoyutlari | `next/src/components/ZamanBoyutlari.jsx` | 428 | `onClose()` |

### Esc Handler EKSİK (2 component)

| Component | Dosya | Sorun | Fix önerisi |
|---|---|---|---|
| **ProphetAtlas** | `next/src/sections/ProphetAtlas.jsx` | `onClose` prop kabul ediyor (line 1470), ✕ butonu var (line 1595-1597), ancak `useEffect` içinde `keydown` listener tanımlanmamış. `grep -n "Escape\|keydown" ProphetAtlas.jsx` → eşleşme yok. | Component'ın hook bloğuna ekle: `useEffect(() => { const h = (e) => { if (e.key === 'Escape' && onClose) onClose(); }; window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h); }, [onClose]);` — `/atlas/peygamber` route'unun ESC ile kapanması için. |
| **TafsirPanel** | `next/src/components/TafsirPanel.jsx` | `open` + `onClose` prop kabul eden modal pattern (line 141), ✕ butonu `onClick={onClose}` (line 435), ama ESC dinlemiyor. | `useEffect(() => { if (!open) return; const h = (e) => { if (e.key === 'Escape') onClose(); }; window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h); }, [open, onClose]);` |

### Notlar — Bilinçli Tasarım Kararları

- **ReadingMode** (line 1487-1488 yorum): "Intentionally no fallthrough: Escape should not close reading mode. Only the explicit Kapat (✕) button closes it." Bu okuma deneyimini koruyan bir karar — kullanıcı klavye ile etkileşim sırasında yanlışlıkla okuma modundan çıkmasın diye. **Aksiyon gerekmez.**
- **MeselAtlasi** (line 1352 yorum): "ESC with no sub-navigation open: do nothing — close button or browser back handles exit." History sentinel pattern ile çakışmaması için bilinçli karar. **Aksiyon gerekmez.**

---

## W22-U10 — Document Title Audit

Canlı production'a `curl -s -L | grep -oE '<title>...'` ile 10 sample route üzerinden test edildi:

| Route | Title (production'da gelen) | Status |
|---|---|---|
| `/tr` | `QuranCodex — Kur'an-ı Kerim'in Görünmeyen Mimarisi \| QuranCodex` | OK — unique homepage title |
| `/tr/oku/1` | `El-Fatiha — Sure 1 \| QuranCodex` | OK — surah-aware title (dynamic) |
| `/tr/atlas/kissa` | `Kıssa Atlası \| QuranCodex` | OK |
| `/tr/atlas/peygamber` | `Peygamberler Atlası \| QuranCodex` | OK |
| `/tr/graf/ayet` | `Ayet Grafiği \| QuranCodex` | OK |
| `/tr/graf/kavram` | `Kavram Grafiği \| QuranCodex` | OK |
| `/tr/arac/wow` | `Şaşırtıcı Olgular \| QuranCodex` | OK |
| `/tr/arac/dualar` | `Kur'an'dan Dualar \| QuranCodex` | OK |
| `/tr/arac/yeminler` | `Kur'an'ın Yeminleri \| QuranCodex` | OK |
| `/tr/kaynakca` | `Kaynakça — Tefsir, Akademik ve Dilbilim Kaynakları \| QuranCodex` | OK |

**Ek doğrulama — EN locale (5 sample):**

| Route | Title | Status |
|---|---|---|
| `/en` | `QuranCodex — The Invisible Architecture of the Quran \| QuranCodex` | OK |
| `/en/atlas/kissa` | `Atlas of Quranic Narratives \| QuranCodex` | OK — TR/EN tam paralellik |
| `/en/arac/wow` | `Astonishing Facts \| QuranCodex` | OK |
| `/en/arac/dualar` | `Prayers from the Quran \| QuranCodex` | OK |
| `/en/arac/yeminler` | `The Oaths of the Quran \| QuranCodex` | OK |

**Bulgu:** Tüm sample route'larda `document.title` Next.js metadata API (`generateMetadata` + `pageMetadata` helper, CLAUDE.md §16.3 pattern) ile lokalize ve unique olarak üretiliyor. Generic "QuranCodex" başlığı hiçbir tool route'unda gözlenmedi. `\| QuranCodex` suffix tutarlı — `next/src/lib/seo.js` template'ten geliyor.

---

## Fix Önerileri (sonraki tur)

### Kritik (kullanıcı erişilebilirlik)

1. **`next/src/sections/ProphetAtlas.jsx` line ~1480 civarı (hook bloğunda)** — Escape key handler ekle:
   ```jsx
   useEffect(() => {
     if (!onClose) return;
     const h = (e) => { if (e.key === 'Escape') onClose(); };
     window.addEventListener('keydown', h);
     return () => window.removeEventListener('keydown', h);
   }, [onClose]);
   ```
   Diğer tüm atlas component'leri ile davranış paritesi sağlanır. `/atlas/peygamber` route'u şu an ESC ile kapanmıyor.

2. **`next/src/components/TafsirPanel.jsx` line ~145 civarı** — Escape key handler ekle (yukarıdaki snippet `open` guard ile):
   ```jsx
   useEffect(() => {
     if (!open) return;
     const h = (e) => { if (e.key === 'Escape') onClose(); };
     window.addEventListener('keydown', h);
     return () => window.removeEventListener('keydown', h);
   }, [open, onClose]);
   ```

### Audit edilmeyen / bulunamayan

Task list'te belirtilen ancak `next/src/components/` altında bulunmayan veya audit dışı tutulan dosyalar (referans için):

- **Esmaul.jsx** → mevcut adı `EsmaFrekans.jsx` (audit edildi, OK)
- **Muhataplar.jsx** → mevcut adı `AddresseeSystem.jsx` (audit edildi, OK)
- **Kiyamet.jsx** → mevcut adı `KiyametSahneleri.jsx` (audit edildi, OK)
- **Renkler.jsx** → mevcut adı `KuranRenkleri.jsx` (audit edildi, OK)
- **Kiraat.jsx** → mevcut adı `KiraatAtlasi.jsx` (audit edildi, OK)
- **Sunnetullah.jsx** → `SunnetullahAtlasi.jsx` (audit edildi, OK)
- **Buyruklar.jsx** → `QuranCommands.jsx` (audit edildi, OK)
- **Munafik.jsx** → `MunafikProfili.jsx` (audit edildi, OK)
- **Munasebat.jsx** → `MunasebatAtlasi.jsx` (audit edildi, OK)
- **Furuk.jsx** → `FurukAtlasi.jsx` (audit edildi, OK)
- **Kavim.jsx** → `KavimlerAtlasi.jsx` (audit edildi, OK)
- **Kadinlar.jsx** → `KadinlarAtlasi.jsx` (audit edildi, OK)
- **Karsilastir.jsx** → `SurahComparator.jsx` (audit edildi, OK)
- **Yeminler.jsx** → `KuranYeminleri.jsx` (audit edildi, OK)
- **NefsMertebeleri.jsx** → `NefisMertebeleri.jsx` (audit edildi, OK)
- **Diyalog** → `DiyalogAgi.jsx` (audit edildi, OK)
- **Semantik** → `SemanticMap.jsx` (audit edildi, OK)
- **ProphetAtlas.jsx** → `next/src/sections/ProphetAtlas.jsx` (audit edildi, **EKSİK**)

### Düşük Öncelik / Bilinçli Tasarım (aksiyon gerekmez)

- ReadingMode.jsx → Esc okuma modunu kapatmıyor (line 1487-1488 yorumla belgelenmiş tasarım kararı).
- MeselAtlasi.jsx → Esc yalnızca history sentinel'i geri-alır (line 1352 yorum). Modal kapatma ✕ butonu üzerinden.

### W22-U10 Aksiyon

Hiçbir aksiyon gerekmiyor — sample 10+5 route hepsinde unique lokalize title üretiliyor. `pageMetadata` + module-level `TITLE`/`DESC` const pattern (CLAUDE.md §16.3) production'da doğru çalışıyor.

---

## Test Yöntemi (sonraki tur için doğrulama)

Fix uygulandıktan sonra manuel test:

1. `/tr/atlas/peygamber` route'unu aç → Esc bas → ana sayfaya dönmeli (router.back).
2. `/tr/oku/1` route'unda Tefsir paneli (TafsirPanel) aç → Esc bas → panel kapanmalı, okuma modu açık kalmalı.
3. Regresyon testi: Esc key handler eklenmiş tüm tool'lar (`KissaAtlas`, `CennetCehennem`, vb.) hâlâ doğru kapanmalı.

---

**Audit tamamlandı: 2026-05-24** | 37 tool component tarandı, 35'i geçti, 2 fix önerildi. Production title denetimi (15 route): tamamı OK.
