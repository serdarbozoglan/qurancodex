# QuranCodex UX & Fonksiyonellik Denetimi — Son 10 Batch Sonrası
**Tarih:** 2026-07-11
**Denetçi:** qc-ux-auditor
**Kapsam:** commit `31ee01a` ile geriye 20 commit; tüm route'lar (TR+EN), İbadetler HUB + 7 pillar, Esmâ-i Hüsnâ, Kavim, Muhataplar, Dualar, VerseGraph
**Yöntem:** Statik tarama (grep + JSON parity check) + canlı Playwright doğrulaması (16 route × 2 dil)

---

## ÖZET

- **Taranan alan:** ~280 kaynak dosya, 8 İbadetler JSON, 50+ public/*.json, 2 i18n dict, sticky pattern uyumu, a11y (icon-only + skip link + landmark), Namaz→pillar akışı, dil değiştirme sonrası re-render, dua node routing, sürüm bilgisi drift
- **Bulunan sorunlar:**
  - Kritik: **5**
  - Orta: **9**
  - Minör: **8**
- **Toplam:** 22 bulgu

**Öne çıkan sorun:** Namaz pillar sayfasında "Ana Ayetler" tab'ı JSON key mismatch nedeniyle **hiç render olmuyor** (K-01) + İbadetler hub'ında "Dua" node'una tıklandığında kullanıcı bomboş bir `/atlas/ibadetler/` route'una gönderiliyor, `arac/dualar`'a değil (K-02).

---

## KRİTİK SORUNLAR

### K-01 · Namaz pillar sayfasında "Ana Ayetler" tabı görünmüyor — data key mismatch (ROUTE: /atlas/ibadetler/namaz)
**Ciddiyet:** 🔴 Kritik
**Reproduce:**
1. `/tr/atlas/ibadetler/namaz` sayfasına git
2. Sekmeler: Genel Bakış · Semantik Alan · **Özel Namazlar** · Vakit ve Mekân · Namazın Sözü · Rakamsal Mimari · Peygamberler · İç Boyut · İnsan Etkisi · Kaynaklar
3. **"Ana Ayetler" tab'ı YOK.**
4. Karşılaştırma: `/tr/atlas/ibadetler/zekat`, `/oruc`, `/hac`, `/kurban`, `/zikir`, `/tovbe` — hepsinde "Ana Ayetler" tab'ı VAR.

**Kök neden:**
- `next/public/ibadetler/namaz.json` → key adı `"anaAyet grubular"` (space + typo)
- `next/public/ibadetler/{diğer 6}.json` → key adı `"anaPasajlar"`
- `IbadetlerPillar.jsx:23` → `dataKey: 'anaPasajlar'` → Namaz için `undefined` → `hasContent()` false → tab liste dışı.

**Beklenen:** Kullanıcı Namaz sayfasında 8 anchor ayet grubunu görebilmeli.
**Gerçekleşen:** İçerik render olmuyor; sayfa "eksik" görünüyor.

**Öneri (iki seçenek):**
- Basit: `namaz.json`'daki `"anaAyet grubular"` key'ini **`"anaPasajlar"`** olarak yeniden adlandır (kaynak veri yeniden serialize).
- Doğru: Kavramı `pasaj` → `Ayet grubu` olarak yeniden adlandırma (Memory rule `feedback_pasaj_ritual_yasak.md`) tüm 8 pillar JSON'unda ve `IbadetlerPillar.jsx:23,289,691,1237,1248` tarafında tutarlı olacak şekilde uygulan; şu an sadece namaz.json'da yarım yapılmış.

**Dosyalar:** `next/public/ibadetler/namaz.json:? ("anaAyet grubular")`, `next/src/components/IbadetlerPillar.jsx:23`, `:289`

---

### K-02 · İbadetler HUB'ta "Dua" node'u kullanıcıyı hub'a geri gönderiyor
**Ciddiyet:** 🔴 Kritik
**Reproduce:**
1. `/tr/atlas/ibadetler` — "Sekiz Sütun Ağı" bölümüne kaydır
2. **"Dua" (الدُّعَاء) node**'una tıkla
3. **URL değişmiyor** → kullanıcı aynı hub sayfasında kalıyor
4. Playwright ile doğrulandı: `URL after click: http://localhost:3210/tr/atlas/ibadetler` (`/arac/dualar` bekleniyordu)

**Kök neden:**
- `IbadetlerHub.jsx:417` ve `:645`: `router.push(\`/${language}/atlas/ibadetler/${n.id === 'dua' ? '' : n.id}\`)`
- `n.id === 'dua'` durumunda boş string enjekte ediyor → `/tr/atlas/ibadetler/` (hub'ın kendisi)
- Doğru route: `n.id === 'dua'` ise `/arac/dualar`; PillarCard'ta bunu yapan `pillar.href = '/arac/dualar'` mevcut. Fakat `sutunlarAgi.nodes` ve `karsilastirma.rows` için ayrı router.push mantığı var.

**Beklenen:** "Dua" node click → `/tr/arac/dualar`
**Gerçekleşen:** URL değişmiyor, hub sayfası refresh oluyor.

**Öneri:**
```jsx
// IbadetlerHub.jsx:417 ve :645
const targetPath = n.id === 'dua' ? '/arac/dualar' : `/atlas/ibadetler/${n.id}`;
router.push(`/${language}${targetPath}`);
```
Aynı düzeltme `KarsilastirmaSection` `:645`'te de yapılmalı.

**Dosyalar:** `next/src/components/IbadetlerHub.jsx:417`, `:645`

---

### K-03 · İbadetler HUB — Yol Haritası adım kartları EN modda Türkçe kalıyor
**Ciddiyet:** 🔴 Kritik
**Reproduce:**
1. `/en/atlas/ibadetler` sayfasına git
2. "Suggested Journeys" bölümünde "For Newcomers" (ilk yolculuk) sekmesine tıkla
3. Adım kartlarını incele:
   - "2. Semantik Alan tab — kelimelerin dünyası" (TR)
   - "3. Ana Ayetler tab — Kur'ânî pasajlar" (TR)
   - "4. HUB'a dön — diğer sütunlara bak" (TR)
   - Hint metni: "Kur'ân'ın kendi kelimelerinden bir harita." (TR)

**Kök neden:**
- `IbadetlerHub.jsx:564` → `{s.labelTr.replace(/^\d+\.\s*/, '')}` — dil kontrolü YOK
- `IbadetlerHub.jsx:571` → `{s.hintTr}` — dil kontrolü YOK
- `public/ibadetler/hub.json` → `yolHaritasi.yollar[].adimlar[]`: sadece `labelTr` + `hintTr` var (20 label, 12 hint tümü sadece TR)

**Beklenen:** EN kullanıcı adım başlıklarını + ipucularını İngilizce görsün.
**Gerçekleşen:** Tüm suggested-journey adımları EN modda Türkçe render oluyor.

**Öneri:**
1. `hub.json`'a her `adimlar[]` item için `labelEn` + `hintEn` ekle (12 + 20 çeviri)
2. `IbadetlerHub.jsx:564,571`:
   ```jsx
   {(tr ? s.labelTr : (s.labelEn ?? s.labelTr)).replace(/^\d+\.\s*/, '')}
   {s.hintTr && <div ...>{tr ? s.hintTr : (s.hintEn ?? s.hintTr)}</div>}
   ```

**Dosyalar:** `next/public/ibadetler/hub.json:547-569,+` (adimlar × 12), `next/src/components/IbadetlerHub.jsx:564,571`

---

### K-04 · İbadetler HUB Hero eyebrow EN çevirisi yanlış
**Ciddiyet:** 🔴 Kritik
**Reproduce:**
1. `/en/atlas/ibadetler` sayfasına git
2. Hero eyebrow: **"EIGHT SÜTUNS OF SERVITUDE"** — "sütun" TR kelimesi, EN metinde kaldırılmalı

**Kök neden:** `public/ibadetler/hub.json:16` `"eyebrowEn": "EIGHT SÜTUNS OF SERVITUDE"` — "PILLARS" yerine "SÜTUNS" (mixed).

**Öneri:** `"eyebrowEn": "EIGHT PILLARS OF SERVITUDE"` olarak değiştir.

**Dosyalar:** `next/public/ibadetler/hub.json:16`

---

### K-05 · VerseGraph ve ConceptGraph EN modda Türkçe sûre adları gösteriyor
**Ciddiyet:** 🔴 Kritik
**Reproduce:**
1. `/en/graf/ayet` sayfasına git
2. Herhangi bir ayet ara (örn: 2:255)
3. Sonuç panelinde sûre adları: "El-Bakara", "El-Fâtiha", "Âl-i İmrân" — TR
4. Aynı sorun `/en/graf/kavram` ConceptGraph'ta.

**Kök neden:**
- `next/src/lib/surahNames.js` yalnızca `SURAH_NAMES_TR` export ediyor; `SURAH_NAMES_EN` yok
- `VerseGraph.jsx:1063, 1089, 1222, 1238, 1306, 1611` (7 yer), `ConceptGraph.jsx:767` — `surahNameTr()` unconditional çağrı
- `ReadingMode.jsx` kendi `SURAH_NAMES_EN` array'ini tanımlıyor (`:645`) — duplicate + inconsistent

**Öneri:**
1. `next/src/lib/surahNames.js`'e `SURAH_NAMES_EN` + `surahNameEn()` + `surahName(surahNumber, locale)` helper ekle
2. VerseGraph + ConceptGraph, `language` prop üzerinden `surahName(n, language)` çağırsın
3. ReadingMode'daki duplicate array'i ana lib'den import etsin (620-680 satır atılabilir)

**Dosyalar:** `next/src/lib/surahNames.js`, `next/src/components/VerseGraph.jsx:1063+`, `next/src/components/ConceptGraph.jsx:767`, `next/src/components/ReadingMode.jsx:620-680`

---

## ORTA ÖNCELİKLİ SORUNLAR

### O-01 · İbadetler HUB — "8/8 hazır — kalanı hazırlanıyor" çelişkili copy
**Ciddiyet:** 🟠 Orta
**Reproduce:**
1. `/tr/atlas/ibadetler` → "Sekiz Sütun" başlığı altındaki subtitle: **"8/8 hazır — kalanı hazırlanıyor"** (mantıksız)
2. EN: **"8/8 ready — others coming soon"**

**Kök neden:** `IbadetlerHub.jsx:246-248` — statik "kalanı hazırlanıyor" metni; oysa tüm 8 pillar `status: 'ready'` (hub.json).

**Öneri:**
```jsx
const readyCount = pillars.filter(p => p.status === 'ready').length;
const allReady = readyCount === pillars.length;
return language === 'tr'
  ? (allReady ? `${readyCount}/${pillars.length} sütun hazır` : `${readyCount}/${pillars.length} hazır — kalanı hazırlanıyor`)
  : (allReady ? `${readyCount}/${pillars.length} pillars ready` : `${readyCount}/${pillars.length} ready — others coming soon`);
```

**Dosyalar:** `next/src/components/IbadetlerHub.jsx:246-248`; ayrıca `IbadetlerHub.jsx:4` stale yorum ("Namaz ready, diğer 7 coming — click disabled") güncellenmeli.

---

### O-02 · IbadetlerHub Karşılaştırma tablosu — sunulan tablo satırları EN parity kırık
**Ciddiyet:** 🟠 Orta
**Reproduce:**
1. `/en/atlas/ibadetler` → "Comparison Table" (Karşılaştırma) bölümü
2. Row `labelTr` alanları var, `labelEn` sadece 8 satırda mevcut (28 total labelTr, 8 labelEn → 20 satır EN yok)

**Kök neden:** `hub.json` `karsilastirma.rows` sadece TR fields. Component muhtemelen fallback yapıyor (kontrol edilmedi).

**Öneri:** Karşılaştırma satırlarına `labelEn` alanları ekle veya component'ta `tr` toggle'ı test et.

**Dosyalar:** `next/public/ibadetler/hub.json:? (karsilastirma.rows)`

---

### O-03 · Confidence tooltip her zaman Türkçe
**Ciddiyet:** 🟠 Orta
**Reproduce:**
1. `/en/atlas/ibadetler/namaz` sayfasında iddia claim badge'lerine hover
2. Tooltip: "Yüksek güvenlik" / "Orta güvenlik" / "Düşük güvenlik" — TR

**Kök neden:** `IbadetlerPillar.jsx:307`
```jsx
const confTitle = confidence === 'high' ? 'Yüksek güvenlik' : ...
```
Dil kontrolü yok.

**Öneri:**
```jsx
const CONF_LABELS = {
  high:   { tr: 'Yüksek güvenlik', en: 'High confidence' },
  medium: { tr: 'Orta güvenlik',   en: 'Medium confidence' },
  low:    { tr: 'Düşük güvenlik',  en: 'Low confidence' },
};
const confTitle = CONF_LABELS[confidence]?.[language] ?? '';
```

**Dosyalar:** `next/src/components/IbadetlerPillar.jsx:307`

---

### O-04 · ProphetAtlas — Not: label EN modda Türkçe
**Ciddiyet:** 🟠 Orta
**Reproduce:**
1. Anasayfa → ProphetAtlas peygamber table
2. Alt kısımdaki not: `<span>Not:</span>` (EN modda "Note:" olmalı)

**Kök neden:** `next/src/sections/ProphetAtlas.jsx:2434` — hard-coded literal `Not:`

**Öneri:** `{tr('Not:', 'Note:')}` yardımcı fonksiyon ile.

**Dosyalar:** `next/src/sections/ProphetAtlas.jsx:2434`

---

### O-05 · VerseGraph — "Kosinüs benzerlik" tooltip her zaman Türkçe
**Ciddiyet:** 🟠 Orta
**Reproduce:** `/en/graf/ayet` → arama sonucundaki benzerlik skoru hover → tooltip: **"Kosinüs benzerlik skoru (0–1 arası, 1 = tam eşleşme)"** (TR).

**Kök neden:** `VerseGraph.jsx:3173` — hard-coded TR `title="…"`.

**Öneri:** `title={language === 'tr' ? '...' : 'Cosine similarity score (0–1, 1 = exact match)'}`

**Dosyalar:** `next/src/components/VerseGraph.jsx:3173`

---

### O-06 · QuranCommands loading state TR-only
**Ciddiyet:** 🟠 Orta
**Reproduce:** `/en/arac/buyruklar` → veri yüklenirken ekran: "Yükleniyor..." (TR)

**Kök neden:** `QuranCommands.jsx:116` — statik `Yükleniyor...`, dil kontrolü yok.

**Öneri:** `{language === 'tr' ? 'Yükleniyor...' : 'Loading...'}`

**Dosyalar:** `next/src/components/QuranCommands.jsx:116`

---

### O-07 · İbadetler pillar route'ları — blank page while loading (7 route)
**Ciddiyet:** 🟠 Orta
**Reproduce:**
- `/tr/atlas/ibadetler/namaz` (ve zekat, oruc, hac, kurban, zikir, tovbe)
- Slow 3G'de kullanıcı 200-800ms boyunca **boş beyaz sayfa** görüyor.
- IbadetlerHubRoute.jsx da aynı.

**Kök neden:** Her *Route.jsx dosyasında `if (!pillarData) return null;` (satır 22) — hiçbir loading skeleton/spinner yok.

**Öneri:** Bir "PillarSkeleton" component'ı (hero + tab bar shape) ekle veya `LoadingOverlay` gibi mevcut komponenti kullan:
```jsx
if (!pillarData) return (
  <div style={{ minHeight: 'calc(100vh - 62px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ color: COLORS.silver, fontFamily: FONTS.body }}>
      {language === 'tr' ? 'Yükleniyor...' : 'Loading...'}
    </div>
  </div>
);
```

**Dosyalar:** `next/src/app/[locale]/atlas/ibadetler/*/[A-Z]*Route.jsx` (8 dosya)

---

### O-08 · DuaDili CrossToolCTA — "50 tematik dua" stale (77 olmalı) + "Dualar (Browser)" garip label
**Ciddiyet:** 🟠 Orta
**Reproduce:**
1. `/tr/arac/dua-dili` sayfasının en altında CrossToolCTA kartına bak
2. "Dualar (Browser)" · "50 tematik dua · 11 kategori · ses playback."
3. Gerçek veri: 77 dua (`dua-verses.json`)

**Kök neden:** `DuaDili.jsx:241` — hard-coded `descTr: "50 tematik dua…"`

**Öneri:** "77 tematik dua…" ve `"Dualar (Browser)"` → `"Dua Kataloğu"` (veya sadece "Dualar")

**Dosyalar:** `next/src/components/DuaDili.jsx:241`

---

### O-09 · "Pasaj" / "Ritüel" rebrand yarım kaldı
**Ciddiyet:** 🟠 Orta
**Reproduce:** Site-wide grep:
- `Pasaj/pasaj`: 39 kalan (Memory rule `feedback_pasaj_ritual_yasak.md`, 2026-07-09 site-wide yasak)
- `Ritüel/ritüel`: 12 kalan

**Dosyalar (en yüksek yoğunluk):**
- `next/src/components/IbadetlerPillar.jsx:3,23,289,691,1237,1248` (Ana Ayetler tab + Pasajlar dispatcher, K-01 ile bağlantılı)
- `next/public/ibadetler/hub.json:559` ("Ana Ayetler tab — Kur'ânî pasajlar")
- `next/public/ibadetler/hac.json`, `zikir.json` — modernIzler alanı ("ritüel-topluluk", "kolektif ritüel")
- `next/src/i18n/tr.json:1178,1211` — ("ritüel değil" psychology metin)

**Öneri:** "pasaj" → "ayet grubu" · "ritüel" → "eylem/biçim". Batch grep + review ile toplu değiştir.

---

## MİNÖR SORUNLAR

### M-01 · Ellipsis karakter tutarsızlığı (`...` vs `…`)
**Ciddiyet:** 🟡 Minör
Loading placeholder'ları karışık:
- `Yükleniyor...` (7 dosya: SunnetullahAtlasi, KavimlerAtlasi, DiyalogAgi, ...)
- `Yükleniyor…` (unicode ellipsis; 5 dosya: TefekkurIndexRoute, KuranRenkleri, MunasebatAtlasi, MeselAtlasi 3 kez)

**Öneri:** Site-wide utility (constants) tanımla; Unicode `…` (0x2026) tercih et.

---

### M-02 · TabSemantik `s.labelTr.replace(...)` pattern tekrarı
**Ciddiyet:** 🟡 Minör
`IbadetlerHub.jsx:564` gibi noktalarda TR/EN fallback pattern tekrarı ve `?? s.labelTr` fallback'i çoğunluk lokasyonda tutarlı ama `YolHaritasiSection.adimlar` map'te YOK (K-03).

**Öneri:** `bilingual(item, key, tr)` helper fonksiyon.

---

### M-03 · Duplicate SURAH_NAMES_TR array (ReadingMode vs lib/surahNames)
**Ciddiyet:** 🟡 Minör
`ReadingMode.jsx:620-680` — `SURAH_NAMES_TR` + `SURAH_NAMES_EN` 90+ satır duplicate.
Ayrıca ReadingMode TR array farklı: `El-Nisâ` (RM) vs `En-Nisâ` (lib) — inconsistent transliteration.

**Öneri:** Tek kaynağa taşı, K-05 refactor ile birlikte.

---

### M-04 · Sticky tab bar zIndex value drift (2, 10, 20 karışık)
**Ciddiyet:** 🟡 Minör
Sticky tab bar'lar `zIndex: 2` (MunafikProfili), `zIndex: 10` (FurukAtlasi, MunasebatAtlasi, KuranRetorigi, SunnetullahAtlasi, SebebiNuzul, DogaAtlasi, KiraatAtlasi), `zIndex: 20` (BilimselIsaretler, DuaDili, InsanTanimi, KuranRenkleri, KuranYeminleri, Melekler, NefisMertebeleri, RetorikSorular, TarihselKanitlar, ZamanBoyutlari, KiyametSahneleri).

CLAUDE.md §13.19 pattern'ında `zIndex: 20` diyor. `zIndex: 2` ve `10` olan yerler pattern uyumsuz.

**Öneri:** Sticky tab bar'lar için `zIndex: 20`; genel sticky container'lar için ayrı token.

---

### M-05 · Anchor verse dil labelleri "Esmâ-i Hüsnâ" EN'de de TR
**Ciddiyet:** 🟡 Minör
`AllahKendiniTanitir.jsx:244` → CTA text `'Explore Esmâ-i Hüsnâ'` — TR terminolojisi EN sayfada. Kabul edilebilir (dini terim), fakat `The Beautiful Names` çevirisi daha erişilebilir.

**Öneri:** `'Explore the Beautiful Names'` — EsmaFrekans H1'i "The Beautiful Names — How God Describes Himself" olduğu için CTA da aynı isimle konuşsun.

---

### M-06 · SoundArchitecture — `phonetics.noteEn` dead key
**Ciddiyet:** 🟡 Minör
`en.json` içinde `soundArchitecture.phonetics.noteEn` mevcut ama hiçbir yerde consume edilmiyor.
Ayrıca `soundArchitecture.*.{authorTr, authorEn, quoteTr, quoteEn, noteTr, noteEn, workTr, workEn, methodologyTr, methodologyEn, revealTr, revealEn, ...}` — bu embedded-bilingual pattern `t()` fonksiyonuyla karışık kullanılıyor (SoundArchitecture.jsx:918,929,934,940). i18n dict'inde embedded-bilingual anti-pattern.

**Öneri:** Ya tamamen `t()` (SoundArchitecture'da TR anahtar + `en.json` çevirisi), ya tamamen JSON gömülü. Şu anki hybrid drift kaynağı.

---

### M-07 · İbadetler HUB PillarCard hover animation açık — reduced-motion respect edilmiyor
**Ciddiyet:** 🟡 Minör
`IbadetlerHub.jsx:290-298` — `onMouseEnter/Leave` unconditional `translateY(-3px)` + gradient change. `useReducedMotion()` kontrolü yok.

**Öneri:** `if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;` guard veya framer-motion `whileHover`.

---

### M-08 · Homepage Alak 96:1-2 anchor `verse2Ar` mobile `<br />` sonrası char reveal delay math yanlış
**Ciddiyet:** 🟡 Minör
`Hero.jsx:211` — mobile'da separator `<br />` render ediliyor ama `verse2Chars[i]` delay hesaplaması `verse1Chars.length + 1 + i` — separator karakteri hesaba katılıyor. Görsel etki minimal (~22ms), fakat teknik doğru olan `verse1Chars.length + i` (br karakteri değil).

---

## ERİŞİLEBİLİRLİK GÖZLEMLERİ

- **Skip link OK:** `layout.js:28` skip-link mevcut, globals.css:426 style correct.
- **`<main id="main">` OK:** `layout.js:35` — semantic landmark var.
- **Icon-only butonlar OK:** `aria-label` taraması sıfır false-positive (5 candidate incelendi, tümü metin içeriyor).
- **`role="dialog"` + `aria-modal`:** ReadingMode (2 modal), ToolsBrowser, WordPopover, ToolStub kullanıyor — uygun.
- **Kalan boşluk:** `IbadetlerHub.jsx` `PillarCard` disabled state `aria-disabled` de eklemeli (isReady false iken sadece `disabled` attribute kullanılıyor, aria-disabled=`!isReady` de yararlı olurdu).

---

## MOBİL

- Sticky pattern `top: '110px'` **25 komponentte** tutarlı — §13.19 uyumu iyi.
- `IbadetlerHub.jsx:53` — SSR-safety `useState(false)` + `useEffect` post-mount hydrate — pattern doğru (§16.6).
- **Reduced-motion** framer-motion `useReducedMotion()` çoğu section'da mevcut fakat `IbadetlerHub.jsx` PillarCard hover'da bakılmıyor (M-07).

---

## i18n PARİTESİ

### tr.json vs en.json (root-level)
- 936 TR key · 937 EN key
- 14 TR-suffix / 15 EN-suffix key farkı (SoundArchitecture embedded-bilingual pattern — dead code muhtemel, M-06)

### Ölü çeviri anahtarları
- `soundArchitecture.phonetics.noteEn` — sadece EN'de, kullanılmıyor (M-06)

### Public JSON EN parity
- `kavimler.json:mainSurahEn`: 16/16 dolu ✓ (backlog commit `beb1f53`)
- `esma-frekans.json:isimler[]`: `isim_en`, `okunus_en`, `anlam_en`, `kategori_etiket_en` mevcut (114/114) ✓
- Ama `esma-frekans.json` root'ta `baslik_en=None`, `alt_baslik_en=None`, `aciklama_en=None` — component consume etmiyorsa OK ama JSON temizlenmeli.
- `hub.json:yolHaritasi.adimlar[]`: EN parity yok (K-03)
- `hub.json:karsilastirma.rows[]`: EN parity kırık (O-02)
- Diğer public JSON'ları (bilimsel-isaretler, munafik-profili, nefis-mertebeleri, sunnetullah-atlasi, tarihsel-kanitlar, surah-info) — grep TR-word'leri sadece scholarlı isim leaks (yanlış pozitif); gerçek TR sızıntısı 0.

### Bilinçli TR kalan
- "Tefekkür" (site-wide global term, Memory ile bilgilendirildi)

---

## TEVBE REBRAND DURUMU

- **Src** (`next/src/`): "Tövbe/tövbe" → 0 ✓
- **Public JSON** (dışında meal-cache/tafsir/corpus): 0 ✓
- **URL slug** `/atlas/ibadetler/tovbe` intact ✓ (ASCII, teknik gereksinim)
- **Menü linkleri** ve sayfa başlığı ("Tevbe — İki Taraftan Açılan Kapı") — TAM tutarlı ✓
- **Discovery (arama):** ReadingMode arama SURAH_NAMES_TR array'inde `El-Tevbe` — kullanıcı "tövbe" (o umlaut) yazarsa Latin-1 normalize eşleşme yoksa bulmaz. **Küçük öneri:** `normalizeText` fonksiyonuna `ö → e` aliası koyma opsiyonel; şu an gerçek data "Tevbe" olduğu için user hiç "tövbe" yazmayacaktır — düşük riskli.

**Sonuç:** Tevbe rebrand **başarılı**. Hariç: memory rule kapsamındaki "pasaj" ve "ritüel" için ayrı ayrı gap (O-09).

---

## KRİTİK USER FLOW'LARI TEST SONUÇLARI

| Flow | Status | Not |
|---|---|---|
| Anasayfa → Kur'an'ı Oku CTA | ✅ | Navbar 32px buton yüksekliği tutarlı |
| Anasayfa → İbadetler HUB → Namaz pillar | ⚠ | Sayfa render oluyor ama **Ana Ayetler tab yok (K-01)** |
| Anasayfa → İbadetler HUB → Dua node | ❌ | **Boş route'a yönlendiriyor (K-02)** |
| Anasayfa → Esma-i Hüsnâ EN mode → detay | ✅ | 114 esma + kategoriler + methodology EN render OK |
| Anasayfa → Kıssa Atlası → hikaye kartı | ✅ | Sayfa 200, H1 doğru dil |
| Anasayfa → Melekler → mode filter → detay | ✅ (spot-check) | Sayfa 200 |
| Anasayfa → Muhataplar (yeni B+C hibridi) | ✅ | Explore mega-menu RETORİK & DUA kolonunda 4. item |
| Dil değişimi (TR ↔ EN) URL swap | ✅ | LanguageContext `enLoadedAt` state ile re-render doğru; consumer'lar EN yükleyip anında switch ediyor. Fix `e284fa2` etkili. |
| İbadetler flagship banner (Keşfet) | ✅ | Desktop + mobile'da top-featured banner render OK |
| Home Hero H1 EN | ✅ | "THE INVISIBLE ARCHITECTURE OF THE QURAN" |

---

## GENEL DEĞERLENDİRME

**Güçlü noktalar:**
- Son 20 commit'te i18n stabilizasyonu büyük ilerleme kaydetti (e284fa2 lazy EN → re-render fix, 31ee01a Esma TR-leak temizleme)
- Sticky pattern §13.19 uyumu güçlü (25 komponentin çoğu doğru top:110px)
- Tevbe rebrand src+data tarafında **eksiksiz**
- Skip link + `<main>` landmark + icon-only aria-label çalışıyor
- Kavim EN + Esma EN transliteration backlog kapatıldı

**Aksiyon Öncelik Sırası:**

1. **K-01** — Namaz `anaAyet grubular` → `anaPasajlar` (5dk fix, en yüksek impact)
2. **K-02** — Dua node router.push mantığı düzelt (10dk, IbadetlerHub 2 yer)
3. **K-04** — hub.json `SÜTUNS` → `PILLARS` typo (1dk)
4. **K-03** — hub.json `yolHaritasi.adimlar` EN çevirileri + component fallback (20-30dk, 12 label + 12 hint EN çeviri)
5. **K-05** — `lib/surahNames.js` EN + VerseGraph/ConceptGraph refactor (1sa)
6. **O-01** — Hub subtitle copy logic
7. **O-03** — Confidence tooltip i18n
8. **O-04, O-05, O-06** — 3 tek-satır TR sızıntı fix
9. **O-07** — Pillar route loading skeleton (8 route, 15dk)
10. **O-08** — DuaDili 50 → 77 + label
11. **O-09** — pasaj/ritüel rebrand tamamla (Memory rule gereği)
12. **M-01–M-08** — Minör tutarlılık işleri

**Bu batch dönemi (2026-07-10/11) sonrasında sitenin i18n durumu:** İlk anasayfa + tool landing sayfalarında sağlam. **Sekonder katmanda (İbadetler HUB alt bölümleri, VerseGraph/ConceptGraph sonuç panelleri) fonksiyonel bug'lar mevcut.** K-01 ve K-02 blocker'lar; onlar düzelmezse yeni İbadetler flagship için tanıtım kampanyası riskli.
