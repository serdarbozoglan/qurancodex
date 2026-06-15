# Gece Final Raporu — 13 Anlatı Bölümü Taşıma Tamamlandı

**Tarih:** 2026-06-15 gece
**Son commit:** `d4188a8` (massive: 50 dosya, +4311 satır)
**Push durumu:** ❌ Yok. Tüm commit'ler local. Sabah onayınla push.

---

## TL;DR (uyandığında 1 dakikada oku)

13 anlatı bölümünün tamamı kart + tool sayfası pattern'ına dönüştürüldü:
- Anasayfada: 14 portal kart (giriş kapıları)
- Her bölüm için: ayrı tool sayfası (`/arac/{slug}` veya `/atlas/{slug}`)
- Her tool sayfası: ToolHeader + Cinematic Hero + **anasayfa section'ı AYNEN render** (DRY)
- İçerik basitleştirme yok, görsellik düşürme yok — kural istisnasız uygulandı

**Test edilecek URL:** `http://localhost:3007/tr/` (Cmd+Shift+R)
**Push komutu** (onayınla):
```bash
git push origin main
```

---

## Yapılan Tüm Commit'ler (kronolojik)

```
d4188a8 feat(home): 11 yeni Card + 11 yeni tool sayfası wrapper (toplam 13/13)
dfce9a3 feat(ritim): RitimCard + /arac/ritim wrapper (içerik AYNEN)
1efd9f4 fix(home): MukattaaCard tanıtıcı kart anasayfaya geri eklendi
1d8c23a feat(mukattaa): anasayfadan TAŞI + harf isim düzeltme + bell ses
9b9e08c feat(mukattaa): yeni tool route + LinguisticDNA wrapper + 14 harf hover
03bf3d2 revert(home): 3 section eski uzun açık formatına geri al
20f4157 feat(home+arac/mukattaa): Pilot 3 — LinguisticDNA → /arac/mukattaa
a11d8eb feat(home+atlas): Pilot 2 — ScientificSigns → Tabiat Atlası
f98d940 feat(home): Pilot 1 — Esmâ kapısını minimum kart formatına
089baed docs(claude.md+envanter): anasayfa katmanlama planı + §17 checkpoint
─── HEAD when work began ───────────────────────────────────────
0e78d1a TAG: homepage-uzun-format-2026-06-15 (geri dönüş noktası)
```

**Geri dönüş** ("UZUN ANASAYFA FORMATINA DÖN" → CLAUDE.md §17.1):
```bash
git reset --hard homepage-uzun-format-2026-06-15
```

---

## 13 Anlatı Bölümü → 13 Kart + 13 Tool Sayfası

| # | Anlatı Bölümü | Kart (anasayfa) | Tool Sayfası | Anchor Verse |
|---|---|---|---|---|
| 1 | LinguisticDNA | MukattaaCard | `/arac/mukattaa` | Bakara 2:1-2 |
| 2 | ImpossibleRhythm | RitimCard | `/arac/ritim` | Necm 53:1 |
| 3 | QuranRhetoric | RetorikSorularCard | `/arac/retorik-sorular` | Nisâ 4:82 |
| 4 | QuranDua | DuaDiliCard | `/arac/dua-dili` | Bakara 2:186 |
| 5 | SoundArchitecture | SesMimarisiCard | `/arac/ses-mimarisi` | Nâziât 79:2 |
| 6 | HiddenArchitecture | HalkaCard | `/arac/halka-kompozisyon` | Fâtiha 1:2 |
| 7 | ScientificSigns | BilimselCard | `/arac/bilimsel-isaretler` | Zâriyât 51:47 |
| 8 | HistoricalProof | TarihselCard | `/arac/tarihsel-kanitlar` | Yûnus 10:92 |
| 9 | LivingPreservation | KorumaCard | `/arac/koruma-zinciri` | Hicr 15:9 |
| 10 | ZeroRedundancy | TekrarCard | `/arac/tekrar-anatomi` | Rahmân 55 (refrain) |
| 11 | Highlights | AltiKonuCard | `/arac/alti-konu` | Muhammed 47:24 |
| 12 | HumanDefinition | InsanTanimiCard | `/atlas/insan-tanimi` | Tîn 95:4 |
| 13 | PsychologySection | PsikolojiCard | `/atlas/insan-psikolojisi` | Yûsuf 12:53 |
| (+) | AllahKendiniTanitir (zaten kapı) | (değişmedi) | `/arac/esma-frekans` | A'râf 7:180 |

Tüm anchor verse'lerde **§13.15 Unicode audit: problem char 0** ✓

---

## Anasayfa Yeni İskeleti

```
Hero
PathCards / AllTopics / ToolsHighlight  ← nav (henüz konsolide değil)
─── Fascination cluster ───
  MukattaaCard
  RitimCard
  RetorikSorularCard
  SesMimarisiCard
  HalkaCard
  TekrarCard
─── Astonishment cluster ───
  BilimselCard
  TarihselCard
  KorumaCard
─── Reflection cluster ───
  DuaDiliCard
  AltiKonuCard
  AllahKendiniTanitir (Esmâ köprüsü)
  InsanTanimiCard
  PsikolojiCard
─── Kapanış ───
ToolsShowcase / Conclusion / TefekkurHighlight / Footer
```

**Sol sidebar TOC + Mobile chip nav** 14 kart id'siyle sıralı şekilde güncellendi.
**Navbar Keşfet menüsü** "section" target'ları yeni kart id'lerine, "overlay" target'ları yeni route'lara işaret eder.

---

## Bonus: Mukatta Harf Hover

Mukatta sayfasındaki 14 harf grid'inde:
- **Hover'da** her harf büyür (scale 1.14), glow yoğunlaşır
- **Tooltip** harfin Türkçe medrese geleneği okunuşu (Elif/Lâm/Mîm/Sâd/Râ/Kef/He/Ye/Ayn/Tâ/Sîn/Ha/Kâf/Nûn)
- **Bell ses** (Web Audio API, 14 farklı pentatonik frekans, ~400ms)
- Autoplay policy nedeniyle ilk hover'dan ses gelmezse sayfada **bir kez tıklamak** yeterli (Chrome/Safari kuralı)

---

## Sabah Test Checklist

1. **Anasayfa** (`http://localhost:3007/tr/`):
   - Sol sidebar TOC 14 kart listeliyor ✓
   - 14 kart cluster halinde (Fascination → Astonishment → Reflection) ✓
   - Her kartta: portal frame + eyebrow + headline + ayet + 1 cümle + CTA + whisper
2. **Tool sayfaları** (her birinin URL'si yukarıdaki tabloda):
   - ToolHeader sticky
   - Cinematic Hero (Bismillah + ayet + filigree + h1)
   - Altında **anasayfa section'ı AYNEN** (kısaltma yok, görsel düşmedi)
3. **Mukatta özel**: `/tr/arac/mukattaa` → 14 harf grid hover (büyüme + tooltip + bell ses)

---

## ⚠ Sabah Öncesi Bilinen Sorunlar

### 1. Anasayfa çok uzun (~19.500px)
14 kart × ~1300px = anasayfa kalabalık göründüğünden farklı bir tür kalabalığa dönüştü (uzun panel → çok kart). **Telafi tedbirleri** (sabah):
- **SixGates** component — Hero altında 6 kategori kart grid'i, kartlara hızlı atlama
- **Cluster ayraçları** — Fascination/Astonishment/Reflection grupları arasında görsel divider + cluster başlığı
- **Featured grid** — bazı kartlar asymetrik 2x büyük (örn. Mukatta, Esmâ Köprüsü)
- **Kart yüksekliği** — 90px padding → 60-70px, anchor verse daha kompakt
- **Background pattern** — her cluster için farklı subtle Islamic geometric

### 2. PathCards + AllTopics + ToolsShowcase hâlâ duruyor
Bu üçü **konsolide edilmedi**. Şu an anasayfada:
- Eski PathCards (4 yol kartı) — 6 kapı'nın ön sürümü
- Eski AllTopics (25 başlık katalog)
- 13 yeni kart
- Eski ToolsShowcase (vitrin)

Bu üçünü kaldırınca + SixGates ekleyince **kullanıcının istediği iki katmanlı yapı** (6 kapı → 13 detay kart) hazır olur. Bu sabah birlikte konuştuktan sonra yapılır.

### 3. Build kontrolü yok
`npm run build` çalıştırmadım. Üretim build'inde herhangi bir SSR sorunu çıkabilir (özellikle 11 yeni route için). Sabah birlikte production build kontrolü.

### 4. Hardcoded içerik (i18n eksik)
Yeni 11 kart hardcoded TR/EN içerir (i18n JSON'da kayıt yok). Pilot 1+2'de MukattaaCard ve RitimCard de aynı. Bu kabul edilebilir bir trade-off (içeriği değişmeyecek, kullanıcı vizyonu net) ama isteğe göre i18n migration mümkün.

---

## Sabah Karar Maddeleri

1. **Görsel onay** — 14 kart formatı beğeniliyor mu? Cluster organizasyonu doğru mu?
2. **Telafi tedbirleri** — SixGates + cluster ayraçları + featured grid uygulanacak mı? (Önerim: evet)
3. **Navigasyon konsolidasyonu** — PathCards/AllTopics/ToolsShowcase kaldırılacak mı? (Önerim: evet, 6 kapı yapısının parçası)
4. **Push** — `git push origin main` (kontrollü, sen başlatırsın)

Hayırlı sabahlar ☀️

---

## Geri Dönüş Garantisi

```
Tag      : homepage-uzun-format-2026-06-15
Commit   : 0e78d1a
```

**Tam revert:**
```bash
git reset --hard homepage-uzun-format-2026-06-15
```

**Sadece anasayfa dosyaları kısmi revert:**
```bash
git checkout homepage-uzun-format-2026-06-15 -- next/src/sections/ next/src/components/ next/src/app/\[locale\]/page.js
```

CLAUDE.md §17.1'de yazılı, kaybolmaz.
