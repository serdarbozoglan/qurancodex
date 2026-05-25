# GLASS_CARD Blur Tutarlılık Denetimi — W21-P9

**Tarih:** 2026-05-25
**Kapsam:** `next/src/**/*` — `backdrop-filter` / `backdropFilter` / `backdrop-blur` kullanımları
**Kural Referansı:** `CLAUDE.md §13.7` (Glassmorphism Kart Kuralı)

---

## 1. Canonical Token Tanımları

### 1.1 `next/src/tokens.js` — GLASS_CARD ailesi

```js
// lines 233-245
export const GLASS_CARD = {
  background:     COLORS.glassBg,         // rgba(255,255,255,0.05)
  backdropFilter: 'blur(20px)',
  border:         `1px solid ${COLORS.glassBorder}`,  // rgba(255,255,255,0.1)
  borderRadius:   '12px',
};

export const GLASS_CARD_STRONG = {
  background:     COLORS.glassBgStrong,   // rgba(255,255,255,0.08)
  backdropFilter: 'blur(20px)',
  border:         `1px solid ${COLORS.glassBorder}`,
  borderRadius:   '12px',
};
```

### 1.2 `next/src/tokens.js` — BLUR ölçek (lines 299-305)

```js
export const BLUR = {
  sm: 'blur(8px)',
  md: 'blur(20px)',   // glass-card default
  lg: 'blur(24px)',
};
```

> **Tespit:** `BLUR` token export edilmiş ancak hiçbir dosyada `BLUR.sm / .md / .lg` referansı **yok**. Tüm component'lar ham `'blur(Npx)'` string'i kullanıyor. Token kullanılmadan duruyor — ya sil ya da migrate et.

### 1.3 `next/src/app/globals.css` — `.glass-card` Tailwind class'ları

```css
/* lines 150-164 */
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
}

.glass-card-strong {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
}
```

**Tokens ↔ globals.css uyumu: TAM (drift YOK).** Aynı blur, aynı bg, aynı border, aynı radius. Yorum satırı (`/* Values mirror GLASS_CARD ... */`) ilişkiyi explicit dokumante ediyor.

---

## 2. Inline `backdropFilter` Kullanım Dağılımı

Toplam **74 inline kullanım** (tokens.js + globals.css hariç), 11 farklı blur değeriyle:

| Blur değeri | Adet | Token'da var mı? | Durum |
|-------------|------|------------------|-------|
| `blur(20px)` | 36 | BLUR.md ✓, GLASS_CARD ✓ | **Standart** — büyük çoğunluk |
| `blur(24px)` | 8 | BLUR.lg ✓ | Standart |
| `blur(6px)` | 6 | — | **Drift (low)** |
| `blur(12px)` | 6 | — | **Drift (med)** |
| `blur(8px)` | 5 | BLUR.sm ✓ | Standart |
| `blur(16px)` | 4 | — | **Drift (med)** |
| `blur(28px)` | 2 | — | **Drift (low)** |
| `blur(2px)` | 1 | — | **Outlier** |
| `blur(4px)` | 1 | — | **Outlier** |
| `blur(10px)` | 1 | — | **Outlier** |
| `blur(14px)` | 1 | — | **Outlier** |

**Token-uyumlu (8/20/24):** 49 / 74 ≈ %66
**Drift / outlier:** 25 / 74 ≈ %34

**Tailwind `backdrop-blur-*` utility:** 1 kullanım (`Navbar.jsx:709 → backdrop-blur-xl` ≈ blur(24px)). Tailwind utility'si tek satırda kullanılmış, kabul edilebilir.

---

## 3. Drift Detayları

### 3.1 Outlier'lar (1 kez kullanılan eşsiz değerler)

| Dosya | Satır | Değer | Bağlam | Aksiyon |
|---|---|---|---|---|
| `sections/HumanDefinition.jsx` | 419 | `blur(4px)` | `rgba(0,0,0,0.7)` modal backdrop | → `blur(6px)` veya `BLUR.sm`'e standartlaştır |
| `components/VerseGraph.jsx` | 1290 | `blur(14px)` | tooltip içi panel | → `blur(12px)` veya `BLUR.md`'ye normalize |
| `components/ReadingMode.jsx` | 8284 | `blur(10px)` | toast pill | → `blur(8px)` (BLUR.sm) |
| `components/ToolsBrowser.jsx` | 154 | `blur(2px)` | hafif overlay | Niyet "neredeyse yok" — kabul edilebilir; opsiyonel: `blur(6px)`'ye yükselt |

### 3.2 Tekrar eden ara değerler (6/12/16/28)

**`blur(6px)` — 6 kullanım** (semi-transparent overlay arka planları):
- `sections/ProphetAtlas.jsx:2900`
- `components/ReadingMode.jsx:8535`, `:8954`
- `components/VerseGraph.jsx:2893`
- `components/WordHeatmap.jsx:968`
- `components/WordPopover.jsx:153`

> Hepsi "hafif backdrop dim" niyeti. `BLUR` token'ına `xs: 'blur(6px)'` eklenebilir VEYA hepsi `BLUR.sm` (8px)'e yuvarlanabilir.

**`blur(12px)` — 6 kullanım** (popover/tooltip iç panel):
- `components/VerseGraph.jsx:1350`, `:1920`, `:2514`
- `components/WordHeatmap.jsx:693`, `:709`
- `components/ConceptGraph.jsx:678`

> Popover-spesifik. Token'a `popover: 'blur(12px)'` eklenebilir veya `BLUR.md`'ye yükseltilebilir (20px).

**`blur(16px)` — 4 kullanım** (orta-yoğunluklu panel/sticky header):
- `components/SurahComparator.jsx:589`
- `components/KissaAtlas.jsx:191`
- `components/ConceptGraph.jsx:304`
- `components/CennetCehennem.jsx:194`

> `BLUR.md` (20px)'ye yuvarlanabilir; görsel fark minimal (≤ %5).

**`blur(28px)` — 2 kullanım** (Navbar / heavy modal):
- `components/Navbar.jsx:692`
- `components/VerseGraph.jsx:3004`

> `BLUR.lg` (24px)'ye yuvarlanabilir, ya da BLUR'a `xl: 'blur(28px)'` eklenir.

---

## 4. Drift Severity

| Kategori | Sayı | Severity | Gerekçe |
|---|---|---|---|
| Outlier blur değerleri (tek seferlik 2/4/10/14px) | 4 | **HIGH** | Tek-seferlik random değer; token'sız; estetik tutarsızlık |
| Tekrar eden ara değerler (6/12/16/28px) | 18 | **MEDIUM** | Kasıtlı görünüyor (her biri en az 2 dosyada tekrar) ama token'da yok |
| Token-uyumlu (8/20/24px) ham string olarak yazılı | 49 | **LOW** | Doğru blur değeri ama `BLUR.*` veya `GLASS_CARD` token'ı yerine string literal — değişiklik gerekirse 49 yerde manuel update gerekir |
| `BLUR` token tanımlı ama 0 kullanım | 1 | **HIGH** (mimari) | Token mevcut, ama hiçbir component import etmiyor — token sistemi eksik bağlanmış |

**Genel severity: MEDIUM.**
- Visual impact düşük (insan gözü 16↔20px farkı zor seçer).
- Mimari drift yüksek: §13.7 "Her bileşen kendi `backdrop-filter + rgba` kombinasyonunu uydurmaz" kuralı 74/74 yerde **aslında ihlal ediliyor**, çünkü hiçbiri `style={GLASS_CARD}` / `BLUR.md` import etmiyor.

---

## 5. Önerilen Aksiyon (bu PR kapsamında **uygulanmadı**)

> Sadece tokens.js + globals.css yetkili dosyalar olduğundan, component fix'leri raporda işaretli ama uygulanmadı.

### 5.1 tokens.js önerisi (opsiyonel — uygulanırsa downstream migration gerekir)

`BLUR` ölçeğini genişlet ve "kullanılmaya hazır" hale getir:

```js
export const BLUR = {
  xs: 'blur(6px)',    // YENİ — hafif backdrop dim (6 mevcut kullanım)
  sm: 'blur(8px)',    // mevcut
  md: 'blur(20px)',   // mevcut — glass-card default
  popover: 'blur(12px)', // YENİ — popover/tooltip iç panel (6 mevcut kullanım)
  panel:   'blur(16px)', // YENİ — orta-yoğunluklu panel (4 mevcut kullanım)
  lg: 'blur(24px)',   // mevcut
  xl: 'blur(28px)',   // YENİ — heavy modal/navbar (2 mevcut kullanım)
};
```

Alternatif: ara değerleri **yasakla**, hepsini sm/md/lg'ye snap et (daha sıkı denetim).

### 5.2 tokens.js + globals.css drift fix gereği

**YOK.** Bu iki dosya arasında drift tespit edilmedi — her ikisi de blur(20px) + rgba(255,255,255,0.05/0.08) + 12px radius ile bire bir uyumlu.

### 5.3 Component-seviyesi öneriler (uygulama bir sonraki PR'a)

1. **4 outlier'ı (HumanDefinition, VerseGraph:1290, ReadingMode:8284, ToolsBrowser)** standart değere snap et.
2. `GLASS_CARD` token'ını kullanmak yerine ham `backdropFilter: 'blur(20px)' + background: glassBg + border: glassBorder + borderRadius: '12px'` quartet'ini yazan yerleri tespit et (eslint custom rule veya codemod). 49 olası adres.
3. `BLUR.md` import alışkanlığını yaymak için Hero / Footer gibi yüksek-trafik dosyalarda örnek migration yap.

---

## 6. Özet Tablo

| Metrik | Değer |
|---|---|
| Toplam `backdropFilter` kullanımı (next/src) | 74 (tokens + globals hariç) |
| `GLASS_CARD` / `GLASS_CARD_STRONG` style spread kullanımı | 0 (component'larda) |
| `BLUR.*` token referansı | 0 |
| `glass-card` Tailwind class kullanımı | (ayrı audit konusu — bu raporun kapsamı dışı) |
| Token-uyumlu blur değeri (8/20/24px) | 49 / 74 (%66) |
| Drift (ara değerler 6/12/16/28px) | 18 / 74 (%24) |
| Outlier (tek-seferlik 2/4/10/14px) | 4 / 74 (%5) |
| Tokens ↔ globals.css drift | YOK (uyumlu) |

---

## 7. Sonuç

**Drift fix uygulandı mı:** Hayır — tokens.js ile globals.css zaten uyumlu, müdahale gereksiz. `BLUR` ölçek genişletmesi ve component-seviyesi snap önerileri **kasıtlı olarak bu PR dışında bırakıldı** (yetki sınırı: sadece tokens + globals + rapor).

**En kritik bulgu:** `BLUR` token'ı tanımlı ama 0 import. §13.7 kuralı yazıldığı şekilde ihlal ediliyor — her component kendi blur string'ini uyduruyor. Visual impact düşük; mimari hijyen orta-yüksek severity.

result: 49 token-compliant (66%), 22 custom inline (4 outlier + 18 drift), severity MEDIUM
