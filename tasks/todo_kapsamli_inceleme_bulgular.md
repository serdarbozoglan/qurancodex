# QuranCodex — Kapsamlı İnceleme Bulguları (ToDo)

> Kaynak: `QuranCodex-Kapsamli-Inceleme.html` (ChatGPT kapsamlı site incelemesi, 28 bulgu).
> Sütunlar: **Katılım** = benim değerlendirmem · **Durum** = doğrulama/iş durumu.
> Katılım anahtarı: ✅ tam · 🟡 nüanslı/kısmen · ⚠️ ChatGPT fazla iddialı · 🔎 kodda doğrulanmalı.
>
> **NOT (kod tabanı):** Canlı site `next/` (Next.js). Kök dizindeki `src/` (Vite) app + `.next/` klasörü **eski/ölü** — tüm doğrulamalar `next/` üzerinde yapıldı.

## 🔎 Kodda doğrulama sonuçları (2026-09-07)

| Bulgu | ChatGPT iddiası | Kanıt | Sonuç |
|---|---|---|---|
| **C01** | Rahmân nakarat 78 (olması gereken 31) | `next/public/surah-connections.json:649` → "Rahman **78 kez** … tekrar edip biter" | ✅ **DOĞRU** — 78→31. (Kodun geri kalanı hep 31 diyor.) |
| **C02** | meta 50+, arayüz 34 | `app/[locale]/atlas/furuk/page.js:10` "50'den fazla" ↔ `FurukAtlasi.jsx:210` "34 aile" | ✅ **DOĞRU** |
| **C07** | 34 sûrede ayet sayısı yanlış | `RevelationTimeline.jsx` `AYAH_COUNTS` dizisi **120 eleman (114 olmalı)** — hizalama bozuk. Tekvîr 83/29, İnşirah 28/8, Alak 25/19, Asr 8/3, Kevser 5/3 | ✅ **DOĞRU, hatta daha kötü** — dizi yapısal bozuk, kuyruktaki tüm sûreler kaymış |
| **C12** | katalog 64, ana sayfa 65 | `toolCatalog.js` `TOOL_CATALOG=65` | ✅ **DOĞRU** — veri 65; iki yüzey farklı sayı gösteriyor |
| **C14** | özet "kesben terk" ↔ metin "kalben terk" | `inception-hayatlar.json` tldr: "Çare kesben terk … **değildir; kalben terk**" | ⚠️ **DESTEKLENMEDİ** — özet ve metin AYNI şeyi diyor; ChatGPT cümleyi yanlış ayrıştırmış |
| **C18** | seri 4/4 ↔ Siccin 5/5 | `_index.json`: tugyan num=4, siccin num=5 ama başlığı "Semantik Analizi-N" desenini bozuyor; `seriesTotal` boş | ✅ **DOĞRU** — seri metadatası tutarsız |

**Özet:** 6 doğrulamanın **5'i ChatGPT lehine** çıktı; sadece **C14** yanlış (ChatGPT'nin Türkçe cümle ayrıştırma hatası). En ciddi bulgu **C07** — beklenenden büyük yapısal veri bozukluğu.

---

## P0 — Güvenilirlik / hassas içerik (önce bunlar)

- [x] **C01 · Rahmân nakarat sayısı** — `/tr/atlas/munasebat` ✅ **DÜZELTİLDİ (2026-09-07)**
  - Kart 78 diyordu, ana sayfa 31. 78 = sûrenin ayet sayısı; nakarat **31**.
  - Yapıldı: `surah-connections.json:649` TR + EN "78 kez/78 times" → "31". (Kalan iş: ortak veri kaynağından üretim + test — opsiyonel sağlamlaştırma.)
  - Katılım: ✅ tam · Durum: **kesin hata → düzeltildi**

- [x] **C03 · rîh (azap) / riyâh (rahmet) mutlak genellemesi** — `/tr/atlas/furuk` ✅ **DÜZELTİLDİ (2026-09-07)**
  - Yapıldı: `word-groups.json` wind-family principle "azap/rahmet getirir" → "çoğunlukla ... bağlamında geçer"; rîh notuna Yûnus 10:22 "rîhin tayyibetin" istisnası eklendi; riyâh "her zaman"→"çoğunlukla". Kaynak es-Süyûtî el-İtkân korundu. Em-dash temizlendi.
  - Katılım: ✅ tam · Durum: **düzeltildi**

- [x] **C07 · Nüzul Kronolojisi ayet sayıları** — `/tr/graf/zaman` ✅ **DÜZELTİLDİ (2026-09-07)**
  - Kök sebep: `RevelationTimeline.jsx` `AYAH_COUNTS` dizisi **120 eleman (114 olmalı)** — hizalama bozuktu, ~sûre 78'den sonrası kaymıştı.
  - Yapıldı: Dizi doğru 114 elemanlı Kûfî/Hafs sayımıyla değiştirildi; 8 örnek sûre doğrulandı (Alak 19, Tekvîr 29, İnşirah 8, Asr 3, Kevser 3, Nâs 6…). (Kalan iş: ideali `verse-graph-bgem3.json`'dan türetmek — opsiyonel.)
  - Katılım: ✅ · Durum: **doğrulandı + düzeltildi**

- [x] **C08 · "Fâtiha'da Allah lafzı geçmez"** — `WowFacts.jsx` ✅ **DÜZELTİLDİ (2026-09-07)**
  - Yanlıştı: sitenin kendi verisinde Fâtiha 1:1 (Bismillâh) ve 1:2 (el-hamdü **lillâh**) lafza-i celâli içeriyor (doğrulandı).
  - Yapıldı: Fact "Fâtiha'da Beş İlâhî İsim" olarak yeniden yazıldı (Allah + Rabb + Rahmân + Rahîm + Mâlik). Humanizer'dan geçirildi.
  - Katılım: ✅ tam · Durum: **kesin hata → düzeltildi**

- [x] **C09 · "Allah'tan sonra en çok geçen isim Rahmân"** — `WowFacts.jsx` ✅ **DÜZELTİLDİ (2026-09-07)**
  - **Stans düzeltmesi:** Corpus'tan doğruladım → Rahmân **57**, Rahîm **116**. Yani Rahîm daha sık; eski iddia yanlıştı. **ChatGPT esasen haklı; önceki ⚠️ notum geri çekildi.**
  - Yapıldı: Fact "Rahmân ve Rahîm: Merhametin İki İsmi" olarak yeniden yazıldı; doğrulanmış karşılaştırma (116 vs 57), #1 iddiası YOK (tüm 99 isim doğrulanmadığı için Alîm vb. daha sık olabilir), kaynak Quranic Arabic Corpus. Sayaç 57→116. Humanizer'dan geçti.
  - Katılım: ✅ (düzeltilmiş stans) · Durum: **düzeltildi**

- [x] **C16 · Depresyon = "yalıtım kaybı"** — `/tr/tefekkur/ruhun-termostati` ✅ **DÜZELTİLDİ (2026-09-07)**
  - Yaklaşım (§13.29 gereği): yazarın (Felsufi) metnine dokunulmadı; sitenin editoryal katmanı olan **criticalNote** eklendi.
  - Yapıldı: Depresyon bölümü sonuna criticalNote — "metafor ≠ klinik tanı; depresyon çok etkenli (biyo-psiko-sosyal); manevî pratikler tıbbî tedavinin yerine geçmez; uzmana başvur." TR+EN, humanizer'lı.
  - Katılım: ✅ tam (sorumluluk) · Durum: **düzeltildi (criticalNote ile)**

---

## P1 — Tutarlılık, yöntem, kullanım

### İlmî / olgusal

- [x] **C04 · Hafs/Verş/Kalun/Duri "kıraat imamı" karışması** — `/tr/atlas/kiraat` ✅ **DÜZELTİLDİ (2026-09-07)**
  - Atlasın ağacı zaten doğruydu (imam→râvi); hata meta + giriş metnindeydi.
  - Yapıldı: `page.js` DESC "On kanonik kıraat (Hafs, Verş…)" → "…ve râvileri (Âsım'dan Hafs…)"; giriş "her imam bir sahabîden aldı" → "senedi sahâbeye uzanan…; râvileri (Hafs, Verş) sonraki nesillere aktardı". TR+EN.
  - Katılım: ✅ tam · Durum: **düzeltildi**

- [ ] **C10 · "Bütün nüshalarda sıfır rasm varyasyonu"** — `/tr/arac/koruma-zinciri`
  - San'a alt-metni (Sadeghi & Bergmann 2010) tam da varyant gösteriyor; kendi kaynağıyla çelişiyor.
  - Yapılacak: İtikadî koruma inancı / standart rasm / bölgesel rasm / kıraat / erken elyazması varyantlarını ayrı sun.
  - Katılım: ✅ tam · Durum: onaylı

- [x] **C11 · ه ve ح "nazal"; 109/112 komşuluk** — `/tr/arac/ses-mimarisi` ✅ **DÜZELTİLDİ (2026-09-07)**
  - Yapıldı: `SoundExtensions.jsx` "nazal ه"→"soluklu ه"/"breathy"; 109↔112 "peş peşe/adjacent" kaldırıldı (aralarında 110-111). `SoundArchitecture.jsx`'te ح,ن,م,ل grubu "nazal ve akıcı" → doğru sınıflandırma (ن,م nazal; ل akıcı; ح boğazsıl); "Nazal ح،ن،م" → "Yumuşak". TR+EN.
  - Katılım: ✅ tam · Durum: **düzeltildi**

- [x] **C13 · "7. yy = 16 vezin" sınırlaması** — `/tr/arac/ritim` ✅ **DÜZELTİLDİ (2026-09-07)**
  - Yapıldı: `RhythmExtensions.jsx` detayına anakronizm notu ("bu sistematik tasnif Kur'ân'ın inişinden sonra olgunlaştı") + **secî (kafiyeli, ritmik nesir)** yakınlığı eklendi; "hiçbirine uymaz" → "ne klasik şiire ne de alışılmış düzyazıya indirgenir". Kimlik korundu (§13.24).
  - Katılım: ✅ tam · Durum: **düzeltildi**

- [ ] **C15 · Fâtiha merkez ayeti "iyyâke na'budu" (4.)** — `/tr/arac/kurani-tani`
  - Hafs'ta bu 1:5; 7 ayetin ortası (4.) = 1:4 "mâliki yevmi'd-dîn".
  - Yapılacak: Kullanılan sayım geleneğini her şemada belirt; cümlecik düzeni ile ayet numarasını ayır.
  - Katılım: 🟡 "hata" değil, **sayım-geleneği etiketi eksik**. Belirt.

- [x] **C17 · Schubert 2005 → hipokampüs** — `/tr/tefekkur/sonsuzlugun-merdiveni` ✅ **DÜZELTİLDİ (2026-09-07)**
  - Web+PubMed 16060739 ile doğrulandı: Schubert 2005 tamamen davranışsal (Study 1-6: yargı/tepki süresi/motor tepki), hipokampüs/nöro-görüntüleme YOK.
  - Yapıldı: Gövde (block[4]) + tldr'deki "hipokampüs/Nörobilim" iddiaları çıkarıldı; Schubert'in gerçek bulgusuyla (güç↔yukarı, dikey konum güç yargısını etkiler) değiştirildi. Künye zaten doğruydu. Yazarın embodied-cognition noktası korundu. TR+EN.
  - Katılım: ✅ tam · Durum: **düzeltildi (yanlış atıf giderildi)**

- [ ] **C20 · 10 aşamalı "zorunlu, atlanamaz sıra"** — `/tr/atlas/insan-yolculugu`
  - Yapılacak: Bunun ayetlerden derlenen manevî olgunlaşma **modeli** olduğunu belirt; ayet lafzı ile yazar tasnifini ayır.
  - Katılım: ✅ tam · Durum: onaylı

- [ ] **C21 · Ahlâk ↔ deprem/kıtlık/zafer istisnasız nedensellik** — `/tr/arac/neden-sonuc`
  - Yapılacak: Ayet bağlamı + yorum sınırı belirt; doğal olayların bilimsel nedenselliği ile ahlâkî ibreti ayır.
  - Katılım: ✅ tam · Durum: onaylı

### Sayfa içi tutarsızlık / veri sayacı (🔎 kodda doğrulanacak)

- [x] **C02 · "50+ kelime ailesi" (meta) vs 34 (arayüz)** — `/tr/atlas/furuk` ✅ **DÜZELTİLDİ (2026-09-07)**
  - Gerçek sayı 34 (word-groups.json meta.totalGroups=34). UI "34" doğruydu; hatalı olan meta.
  - Yapıldı: `furuk/page.js` DESC_TR/EN "50'den fazla / more than 50" → "34". Katılım: ✅ doğru

- [x] **C05 · Fâtiha "yedi ayet" halkası** — `/tr` ✅ **DÜZELTİLDİ (2026-09-07)**
  - Component zaten dikkatliydi (subtitle "altı ayetin ayna simetrisi, Besmele hariç"; merkez 1:5 doğru; detaylı ℹ notu). Tek eksik: 1:7'nin ikiye bölündüğü.
  - Yapıldı: ℹ notuna "Son âyet (1:7) iki cümleciğe ayrılır; B' ve A' aynı âyetin iki yarısıdır (yedi konum, altı âyet)" eklendi. TR+EN.
  - Katılım: 🟡→✅ · Durum: **düzeltildi**

- [ ] **C06 · "Modern psikolojiyi öngörmez" (üst) vs "14 asır önce eş" (alt)** — `/tr/atlas/insan-psikolojisi`
  - Yapılacak: Yorum eşleştirmesi ile klinik/tarihsel eşdeğerlik ayrımını tüm sekmelerde koru. · Katılım: ✅

- [x] **C12 · Katalog 64 araç vs ana sayfa 65** — `/tr/arac/tum-araclar` ✅ **ÇÖZÜLMÜŞ (2026-09-07)**
  - `TOOL_CATALOG`=65 (benzersiz route), ToolsBrowser onu render ediyor, InventoryStrip=65 (WIP'te düzeltilmiş). Hardcoded 64 yok.
  - Sonuç: Tüm kaynaklar 65'te tutarlı; ChatGPT'nin 64'ü eski durum. Kod değişikliği gerekmedi. (Not: InventoryStrip yorum satırındaki "(62)" bayat — kozmetik, WIP'te.) Katılım: ✅ (artık geçerli değil)

- [ ] **C14 · Özet "kesben terk" vs bölüm "kalben terk"** — `/tr/tefekkur/inception-hayatlar`
  - Yapılacak: Özet ile yazarın vardığı sonuç arasındaki tersliği gider. · Katılım: 🔎 muhtemelen doğru

- [x] **C18 · Seri göstergesi 4/4 vs sonraki sayfa 5/5** — `/tr/tefekkur/tugyan` ✅ **DÜZELTİLDİ (2026-09-07)**
  - Kök sebep: semantik-analizi serisi 5 üyeli (sefer, lehv, cennet-cin-mecnun, tugyan, siccin) ama `tugyan.json` ve `cennet-cin-mecnun.json` `seriesTotal=4` diyordu (5 olmalı).
  - Yapıldı: İki makale JSON'unda seriesTotal 4→5. Artık 1/5…5/5 tutarlı. (Not: `_index.json`'da seriesId/seriesTotal latent olarak boş — görünür buga yol açmıyor, render tekil makale JSON'unu kullanıyor.) Katılım: ✅ doğru

### Yöntem / dürüstlük

- [ ] **C19 · "Doğrulandı" = iki nötr istem** — `/tr/arac/tefsir-ihtilaflari`
  - İki LLM istemi iki bağımsız **birincil kaynak** değil.
  - Yapılacak: Doğrulamayı özgün metin + baskı/cilt/sayfa + kalıcı bağlantı + kontrol eden + tarih ile belgele.
  - Katılım: ✅ **kavramsal olarak en önemli madde** · Durum: onaylı

- [ ] **C22 · "Yorum katmaz, yönlendirir" vs sentez cümleleri** — `/tr/sor`
  - Yapılacak: Ayet/meal alıntısı, kaynak özeti, sistem açıklama katmanını ayrı etiketle; ek cümlenin kaynağını göster.
  - Katılım: ✅ · Durum: onaylı

### Teknik / SEO / i18n / UX

- [ ] **SEO01 · SSR/SSG — ilk HTML yalnız başlık/"yükleniyor"** — site geneli
  - Yapılacak: Anlamlı ilk veri + açıklama + bağlantıları SSR/SSG ile sun; grafikle birlikte erişilebilir veri listesi.
  - Katılım: ✅ (`ssr-audit.md` ile örtüşür) · Durum: kısmi/koşullu

- [ ] **SEO02 · Sitemap eksik (Fâtiha Atlası + ek araçlar)** — site haritası
  - Yapılacak: Tek route/katalog kaynağından iki dilde sitemap; yayın sonrası link-kapsam testi. · Katılım: ✅ 🔎

- [ ] **SEO03 · www / çıplak host canonical çelişkisi** — site geneli
  - HTTP www'a yönlüyor; canonical + sitemap çıplak host tercih ediyor.
  - Yapılacak: Tercih edilen hostu tekleştir; redirect + canonical + sitemap + iç bağlantılar aynı 200 URL'de. · Katılım: ✅

- [ ] **UX02 · İngilizce sayfalarda Türkçe artık metin** — İngilizce atlaslar
  - Mesel Atlası motifleri, Tabiat Atlası hayvan adları, İbadetler kaynak açıklamaları.
  - Yapılacak: Yalnız arayüz sözlüğünü değil veri nesnelerinin tüm açıklayıcı alanlarını yerelleştir. · Katılım: ✅ (`backlog-i18n-gaps.md`)

- [ ] **UX03 · Meal seçiminde eski + yeni metin bir arada** — `/tr/oku/1`
  - Yapılacak: Yeni çeviri yüklenene kadar açık yükleme durumu göster. · Katılım: ✅ · Durum: yükleme UX bug'ı

- [ ] **UX01 · Hero çoğu atmosfer/animasyon** — `/tr`
  - Yapılacak: Altın-lacivert kimliği koru; ilk ekrana "Oku / Bir örüntü keşfet / Konu ara" kısa girişleri ekle.
  - Katılım: 🟡 tasarım tercihi — "sorun" değil "ekleme". Atmosferi bozmadan yapılabilir.

---

## Özet sayım

| Katılım | Sayı | Maddeler |
|---|---|---|
| ✅ tam | 18 | C01, C03, C04, C07, C08, C10, C11, C13, C16, C17, C20, C21, C06, C19, C22, SEO01–03, UX02–03 |
| 🟡 nüanslı | 3 | C05, C15, UX01 |
| ⚠️ ChatGPT fazla iddialı | 1 | C09 |
| 🔎 kodda doğrulanacak | 5 | C07, C02, C12, C14, C18 |

**Sıradaki adım:** 🔎 işaretli sayısal bug'ları (C07, C02, C12, C14, C18) repo'da açıp gösterilen/gerçek değerleri kesinleştir.
