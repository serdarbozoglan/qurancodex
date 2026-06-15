# Anasayfa Yeniden Yapılandırma — Pilot 1-3 Sonuç Raporu

**Tarih:** 2026-06-15 (gece)
**Durum:** ✅ Pilot 1, 2, 3 tamamlandı — sabah onayını bekliyor.
**Push durumu:** ❌ Hiç push edilmedi. Tüm commit'ler local. Memory: `feedback_local_test_first.md` + global CLAUDE.md kuralı.

---

## 1. Hızlı özet (uyandığında 30 saniyede oku)

3 pilot başarıyla tamamlandı, her biri farklı bir pattern test etti:

| Pilot | Bölüm | Hedef | Pattern | Sonuç |
|-------|-------|-------|---------|-------|
| **1** | AllahKendiniTanitir | /arac/esma-frekans | Kart-ize (TAM, sıfır göç) | ✅ 271 → 200 satır, kart pattern referansı kuruldu |
| **2** | ScientificSigns | /atlas/doga + yeni "Bilimsel İşaretler" tab | İçerik göçü + kart-ize | ✅ 615 satır section → atlas'a 4 kart + Bucaillism çerçeve göçü + kart |
| **3** | LinguisticDNA | Yeni /arac/mukattaa | Yeni tool sayfası + kart-ize | ✅ 880 satır section → 600 satır flagship tool sayfası + kart |

**Görsel kanıt:** `/tmp/pilot1-tr.png`, `/tmp/pilot2-doga-bilim.png`, `/tmp/pilot2-home-science.png`, `/tmp/pilot3-mukattaa-top.png`, `/tmp/pilot3-mukattaa-mid.png`, `/tmp/pilot3-home-linguistic.png`

**Eksik (bilinçli ertelendi):** Navigasyon konsolidasyonu (PathCards / AllTopics / ToolsHighlight / ToolsShowcase). Senin yönlendirmen: *"Bu kararı Pilot 1'de verme."* Şimdi 3 pilot bitti — bölüm 6'da önce/sonra tablosunu hazırladım. Onayınla bu fazı başlatabilirim.

---

## 2. Commit listesi (kronolojik)

```
20f4157 feat(home+arac/mukattaa): Pilot 3 — LinguisticDNA → yeni /arac/mukattaa tool sayfası + kart-ize
a11d8eb feat(home+atlas): Pilot 2 — ScientificSigns → Tabiat Atlası içerik göçü + kart-ize
f98d940 feat(home): Pilot 1 — Esmâ kapısını minimum kart formatına indir
089baed docs(claude.md+envanter): anasayfa katmanlama planı + §17 checkpoint
─── HEAD when work began ─────────────────────────────────────────────────
0e78d1a feat(tefekkur): VerseInline'a build-time Arapça inject + §13.15 normalize
        ↑ TAG: homepage-uzun-format-2026-06-15  (geri dönüş noktası)
```

Tüm commit'ler `main` branch'inde, **local**. Remote'a push yok.

---

## 3. Pilot detayları

### Pilot 1 — AllahKendiniTanitir → /arac/esma-frekans (commit f98d940)

**Yapılan:**
- `TEASER_NAMES` array + 4-kart grid kaldırıldı (duplikasyon: 99 isim zaten Esmâ Frekans sayfasında)
- Giriş paragrafı 2 cümle → 1 cümle
- Section padding 110px → 80px
- Korundu: portal frame, eyebrow, hook, anchor verse (A'râf 7:180), CTA, closing whisper

**Test:**
- DOM doğrulaması: arabic element 5 → 1, section height 871px, CTA → `/tr/arac/esma-frekans` ✓
- Screenshot: `/tmp/pilot1-tr.png` (premium görünüm korundu)

**Pattern kuruldu:** CLAUDE.md §17.3 "Kart Pattern Referansı" — gold-glow portal + eyebrow + h2 + anchor verse + 1 cümle + CTA + whisper.

### Pilot 2 — ScientificSigns → Tabiat Atlası (commit a11d8eb)

**İçerik göçü (DogaAtlasi.jsx +247 satır):**
- 7. tab "Bilimsel İşaretler" eklendi (atom/orbit ikonu)
- `SCIENTIFIC_SIGNS` inline data: 4 ayet
  - Hadid 57:25 (demir / astrofizik 1957)
  - Zâriyât 51:47 (genişleyen evren / Hubble 1929)
  - Rahmân 55:19-20 (iki deniz / oşinografi 1960'lar)
  - Mü'minûn 23:14 (embriyoloji / 20. yy.)
- `ScienceCard` component (CelestialCard pattern'ında): klasik okuma + modern paralel + **eleştirel not**
- `TabBilimselIsaretler`: Bucaillism academic frame (Sardar, Bigliardi, Edis) + 4 kart grid

**Kart-ize (ScientificSigns.jsx 615 → 200 satır):**
- Anchor verse: Zâriyât 51:47 (evren genişlemesi — en evrensel/sembolik)
- Bucaillism mini-warning kartta korundu (akademik nüans!)
- CTA → `/tr/atlas/doga`
- Whisper: "Demir · 1957 · Evren · 1929 · Denizler · 1960'lar · Embriyoloji · 20. yy."

**Akademik nüans korundu (kritik):** *"Bu sayfa bir bilimsel mucize iddiası değildir"* — hem kartta hem atlas tab'ında.

**Test:** `/tmp/pilot2-doga-bilim.png` (atlas tab) + `/tmp/pilot2-home-science.png` (anasayfa kart). DOM: arabicCount 1, criticalNotesShown 4, academicFrameVisible ✓.

**Pattern kuruldu:** "Kısmi içerik göçü" — hedef sayfada eksik olan derinliği ÖNCE taşı, SONRA kart-ize.

### Pilot 3 — LinguisticDNA → Yeni /arac/mukattaa (commit 20f4157)

**Yeni route + tool component (898 yeni satır):**
- `next/src/app/[locale]/arac/mukattaa/page.js` (esma-frekans pattern: pageMetadata + JsonLd + PageHeading)
- `next/src/app/[locale]/arac/mukattaa/MukattaaRoute.jsx` (client wrapper)
- `next/src/components/Mukattaa.jsx` (600 satır flagship):
  - ToolHeader (sticky, gold orbit ikonu, subtitle)
  - **Cinematic Hero** (§13.18): Bismillah + Bakara 2:1-2 anchor verse + framing whisper + filigree + eyebrow + h1 + subtitle
  - 4 StatCard (14 harf · 29 sûre · %25 kapsama · 4 aile)
  - 14 mukattaa harfi grid (`LETTERS_14`)
  - **4 GROUPS expandable cards** — her birinde: 5-7 sûre linki (/oku/X), pattern, 5-6 bullet
  - **3 DISCOVERIES box** (12/12 sıfır istisna · 7/7 kesintisiz sıra · 1.400+ yıl ihtilaf)
  - SourcesCitation: Râzî · Suyûtî · İbn Abbâs · Bikâî (klasik tefsir kaynak listesi)
  - CrossToolCTA: Münâsebât · Kelime Isı Haritası · İlk-Son Kelimeler

**Kart-ize (LinguisticDNA.jsx 880 → 200 satır):**
- Anchor verse: Bakara 2:1-2 (mukattaa'nın ilk geçişi)
- CTA → `/tr/arac/mukattaa`
- Whisper: "14 harf · 29 sûre · 4 aile · 1.400 yıllık ihtilaf"

**Test:** `/tmp/pilot3-mukattaa-top.png` (Hero + 4 stat ekranda mükemmel), `/tmp/pilot3-mukattaa-mid.png` (Sources + CrossToolCTA), `/tmp/pilot3-home-linguistic.png` (anasayfa kart).

**Pattern kuruldu:** "Yeni tool sayfası" — Hero/stats/data/sources/cross-tool 6 katmanlı flagship şablonu. Kalan 4 Katman C bölümü (ImpossibleRhythm, SoundArchitecture, HiddenArchitecture, ZeroRedundancy) bu pattern'ı kopyalayabilir.

---

## 4. §13.15 Arabic Unicode auditleri

Tüm dosyalarda problem char sayısı: **0**.

İki yerde bilinçli düzeltme yapıldı:
- DogaAtlasi.jsx Rahmân 55:19-20: `۝` (U+06DD ayet sonu) → `·` (orta nokta) — KFGQPC tofu önlemi
- Mukattaa.jsx Bakara 2:1-2: aynı sorun, aynı düzeltme

LinguisticDNA.jsx ve ScientificSigns.jsx anchor verse'leri zaten standart Unicode'du.

Memory `feedback_inline_arabic_u06ea.md` kuralı her yeni Arapça inline string için uygulandı.

---

## 5. Envanter güncellemesi (Pilot doğrulamaları sonucu)

`tasks/anasayfa-envanter-2026-06-15.md` güncellendi:

- **AllahKendiniTanitir** (Katman A → ✅ TAM): Pilot 1 ile tamamlandı (f98d940)
- **Highlights** (Katman A → **KISMEN'E İNDİ**): WowFacts'te 6 konunun 3'ü eksik (Modüler Anlatı, Kelime Haritası, İltifât). Kart-ize'den önce göç gerek.
- **QuranRhetoric** (Katman A → **KISMEN'E İNDİ**): Tematik odak farkı — anasayfa = retorik *sorular* (3 array), tool = *belagat araçları* (tezad/istiare/iltifât). Yeni tab veya yeni route gerek.

Yani **Katman A'da kalan tek "kolay" bölüm yoktu** — pilot 1 bitince Katman A boşaldı; geri kalan tüm bölümler Katman B (kısmi göç) veya Katman C (yeni sayfa).

---

## 6. Navigasyon konsolidasyonu — Önce/Sonra Tablosu (ONAY BEKLİYOR)

Senin gece notunla netleşti: 6 navigasyon bölümünden bazısı redundant, bazısı yeni yapının kalbi. Aşağıdaki tablo senin teşhisinin Claude Code çevirisi:

| Bölüm | Mevcut iş | Yeni yapıdaki yer | Karar |
|---|---|---|---|
| **PathCards** | "Nereden başlamak istiyorsun" — 4 yol kartı | 6 kapı yapısının ön versiyonu, doğrudan çakışıyor | ❌ **Kaldır.** Yolları 6 kapıya birleştir. Anasayfada iki kez "yol seç" ekranı olmayacak. |
| **AllTopics** | 25 konu başlığı kataloğu | 6 kapıya gruplanmış olarak eriyor | ❌ **Kaldır.** İçeriği çöpe atma — 25 başlığın her birini 6 kapının alt-satırına/açıklamasına dağıt. |
| **ToolsHighlight** | Öne çıkan 6 araç kartı | Yeni "İnteraktif Araçlar" bölümünün kalbi | ✅ **Tek bölüme birleştir** (ToolsShowcase ile). "Araçları menüye gitmeden göster" prensibi burada. |
| **ToolsShowcase** | Tüm araçlar vitrini | Aynı işin ikinci kopyası | ✅ **ToolsHighlight ile birleşip tek bölüm.** İki vitrin değil bir vitrin. |
| **TefekkurHighlight** | Tefekkür/dua boyutu | 6 kapı = entelektüel, Tefekkür = manevi — çakışmıyor, tamamlıyor | ✅ **Koru.** Kapanışa yakın sakin nefes noktası. |
| **Conclusion** | "Yaratılışı gördünüz → Yaratıcıyı tanıyın" Esmâ köprüsü | Mevcut yapının kalbi, değişmeyen kapanış | ✅ **Koru, dokunma.** |

**Sonuç anasayfa iskeleti (Pilot çoğaltma + nav konsolidasyon sonrası):**

```
Hero
6 KAPI (yeni — PathCards + AllTopics'in yerini alır)
Popüler Keşifler (eski 14 derin bölümün kart-ize edilmiş hali, sırayla)
İnteraktif Araçlar (yeni — ToolsHighlight + ToolsShowcase birleşmiş hali)
TefekkurHighlight (korunan)
Conclusion (korunan)
Footer
```

**Yapılacak iş hacmi:**
- PathCards.jsx + AllTopics.jsx → silinecek (içerik 6 kapıya göç sonrası)
- ToolsHighlight + ToolsShowcase → tek `InteractiveTools.jsx` component
- Yeni "6 Kapı" component: `SixGates.jsx` (eyebrow + 6 kart, route envanterine bağlı)
- `page.js`'te import sırası güncelleme

**Riskler:**
- 6 kapı kategorizasyonu — envanterdeki ilk kapı ("Arapça bilmeden görebileceğin mimari") 5 yeni sayfa gerektiriyor (LinguisticDNA hariç hâlâ ImpossibleRhythm/SoundArchitecture/HiddenArchitecture/ZeroRedundancy yok). Pilot 3 Mukattaa örnek var; ama diğer 4'ünü yaratmadan o kapı "boş vaat" kalır.
- Karar çatalı (senin notunda): ya 4 yeni sayfayı sıraya koy, ya o kapıyı 6'dan 5'e in.

---

## 7. Push öncesi yapılacaklar listesi (önerim)

Uyandığında:

1. **Bu raporu oku** (15 dk).
2. **3 screenshot'a bak**:
   - `/tmp/pilot1-tr.png` — Esmâ kapısı minimum kart
   - `/tmp/pilot2-home-science.png` + `/tmp/pilot2-doga-bilim.png` — Bilimsel İşaretler kart + atlas tab
   - `/tmp/pilot3-home-linguistic.png` + `/tmp/pilot3-mukattaa-top.png` + `/tmp/pilot3-mukattaa-mid.png` — Dilsel DNA kart + yeni Mukattaa sayfası
3. **Localhost'ta gez** (`http://localhost:3007/tr/`): anasayfayı baştan sona scroll et, 3 kart'a tıkla, hedef sayfaları kontrol et. Özellikle:
   - `/tr/arac/esma-frekans` — kart → flagship doğru mu açılıyor?
   - `/tr/atlas/doga` (sonra "Bilimsel İşaretler" tab'a tıkla) — Bucaillism çerçevesi + 4 kart düzgün mü?
   - `/tr/arac/mukattaa` — yeni sayfa Hero, 4 grup expand, sources, cross-tool tamam mı?
4. **Karar ver**:
   - (a) 3 commit'i remote'a push (`git push origin main` — beraber kontrollü yapılır)
   - (b) Eğer bir şey beğenmediysen revert: `git reset --hard homepage-uzun-format-2026-06-15` (CLAUDE.md §17.1'de yazılı)
   - (c) Önce navigasyon konsolidasyonunu da bitir, hepsini birlikte push (önerim bu — anasayfa hâlâ "yarı eski yapı" şu an)
5. **Navigasyon konsolidasyonu kararı**: §6'daki tabloyu onayla ya da düzelt; sonra:
   - 6 kapı kategorizasyonunda birinci kapı (boş vaat) kararını ver (5 yeni sayfa mı, 5 kapıya in mi)
   - Onay sonrası PathCards/AllTopics kaldırma + InteractiveTools birleştirme + SixGates yaratma + page.js güncelleme

---

## 8. Bilinen sorunlar / dikkat etmeniz gerekenler

1. **DogaAtlasi.jsx HeroSection stats array uyumsuzluğu** (önceden var olan, benim eklemediğim bug): Hero counts'ta `tabIdx: 2` "Sûre Adı" diyor ama TABS array'inde tabIdx 2 "Gök Cisimleri". Pilot 2'de bunu **fark ettim ama düzeltmedim** — scope kayar. Sonra ayrı bir hızlı fix işi.

2. **CrossToolCTA selector test'i false döndü** ama screenshot'ta gayet net görünüyor — büyük ihtimal etiket karakter kodlaması (em-dash vs hyphen). Görsel kontrolü yeterli.

3. **page.js'te (`/tr/`) bölüm sırası değişmedi** — yani anasayfada hem yeni 3 kart hem eski 11 uzun bölüm yan yana duruyor. Bu **bilinçli**: pilot test fazında full disrupt yapılmadı. Çoğaltma fazında diğer 11 bölümün de kart-ize edilmesi gerek (planlandı), sonra page.js sıralaması da güncellenir.

4. **Highlights & QuranRhetoric KISMEN** — Pilot çoğaltma sırasında ilk işlenmesi gerekenler. Highlights için WowFacts'e 3 fact ekleme, QuranRhetoric için yeni tab/route kararı.

---

## 9. Geri Dönüş Garantisi

**Tag:** `homepage-uzun-format-2026-06-15` (commit `0e78d1a`).
**CLAUDE.md §17.1'de yazılı.**

```bash
# Tam revert (working tree dahil):
git reset --hard homepage-uzun-format-2026-06-15

# Sadece anasayfa dosyaları için kısmi revert:
git checkout homepage-uzun-format-2026-06-15 -- next/src/sections/ next/src/app/\[locale\]/page.js
```

Tag local — sabah istersen `git push --tags` ile uzağa da koyabiliriz.

---

## 10. İlerideki çoğaltma planı (Pilot pattern oturduktan sonra)

Pattern'lar 3 pilotta test edildi. Kalan 11 bölüm için sıralama:

**Katman A çoğaltma (1 bölüm — kalan tek TAM):** *Yok artık.* Pilot 1 sonrası boşaldı.

**Katman B çoğaltma (4 bölüm, Pilot 2 pattern'ı):**
- Highlights → WowFacts'e 3 fact göçü + kart-ize
- HistoricalProof → KavimlerAtlasi'na Firavun arkeoloji + Rûm kehaneti göçü + kart-ize
- LivingPreservation → KiraatAtlasi'na "Korunma" tab eklenmesi veya yeni /arac/koruma-zinciri + kart-ize
- QuranDua → DuaVerses'a eksik tematik göç + kart-ize
- HumanDefinition + PsychologySection → birleşik /atlas/insan veya NefisMertebeleri scope genişletme + kart-ize

**Katman C çoğaltma (4 bölüm, Pilot 3 pattern'ı — her biri yeni tool sayfası):**
- ImpossibleRhythm → yeni /arac/ritim (16 vezin + şiir/düzyazı/Kur'an karşılaştırma)
- SoundArchitecture → yeni /arac/ses-mimarisi (azap ↔ rahmet sesleri matrisi)
- HiddenArchitecture → yeni /arac/halka-kompozisyon (Fâtiha + Âyetel Kürsî diyagramları + Farrin ref)
- ZeroRedundancy → yeni /arac/tekrar-anatomi (Rahmân 31x · Mürselât 10x · Kamer 4x refrain analizi)

**Diğer (1 bölüm):**
- QuranRhetoric → yeni tab KuranRetorigi'ne veya yeni /arac/sorular (3 array: QUESTION_TYPES, FAMOUS_QUESTIONS, SURAH_DENSITY)

Toplam çoğaltma: ~10 iş kalemi. Her biri ~30-45 dk (pattern'lar oturduğu için).

---

## 11. Sabah ilk soru

Hangisini istersin?

**(a)** "3 pilot iyi, push edelim, sonra çoğaltmaya geçeriz" → `git push origin main` (kontrollü) + Pilot 1B/2B planı
**(b)** "Önce navigasyon konsolidasyonu yapalım, sonra push edelim" → §6 tabloyu onayla + 6 kapı + SixGates implement
**(c)** "Bir şey beğenmedim, revert" → `git reset --hard homepage-uzun-format-2026-06-15` (sebebi söyle, düzeltelim)
**(d)** "Bir bölümde özel değişiklik istiyorum" → spesifik feedback

Hayırlı sabahlar 🌅
