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

- [ ] **C03 · rîh (azap) / riyâh (rahmet) mutlak genellemesi** — `/tr/atlas/furuk`
  - Yûnus 10:22 "rîhin tayyibetin" karşı örnek. Matar için Nisâ 4:102 kontrol.
  - Yapılacak: "Bağlam eğilimi" olarak sun; istisnaları + sayım yöntemini örüntünün yanında göster.
  - Katılım: ✅ tam · Durum: onaylı

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

- [ ] **C16 · Depresyon = "yalıtım kaybı"** — `/tr/tefekkur/ruhun-termostati`
  - Klinik tabloyu tek manevî/iradî mekanizmaya indirgiyor.
  - Yapılacak: Metafor ile klinik tanımı ayır; çok etkenli açıklama + uygun destek bilgisi ekle.
  - Katılım: ✅ tam (sorumluluk) · Durum: onaylı

---

## P1 — Tutarlılık, yöntem, kullanım

### İlmî / olgusal

- [ ] **C04 · Hafs/Verş/Kalun/Duri "kıraat imamı" karışması** — `/tr/atlas/kiraat`
  - Bunlar **râvi**, imam değil (Âsım→Hafs, Nâfi→Verş+Kalun, Ebû Amr→Dûrî).
  - Yapılacak: İmam → râvi → tarîk ağını ayrı düzeylerde göster; "herkes sahabiden almış" izlenimini kaldır.
  - Katılım: ✅ tam (önemli) · Durum: kesin taksonomi hatası

- [ ] **C10 · "Bütün nüshalarda sıfır rasm varyasyonu"** — `/tr/arac/koruma-zinciri`
  - San'a alt-metni (Sadeghi & Bergmann 2010) tam da varyant gösteriyor; kendi kaynağıyla çelişiyor.
  - Yapılacak: İtikadî koruma inancı / standart rasm / bölgesel rasm / kıraat / erken elyazması varyantlarını ayrı sun.
  - Katılım: ✅ tam · Durum: onaylı

- [ ] **C11 · ه ve ح "nazal"; tecvid = ses sembolizmi karışması** — `/tr/arac/ses-mimarisi`
  - Nazal olan م/ن. ه gırtlaksı, ح boğazsıl. "109 ve 112 peş peşe" iddiası da kaldırılmalı.
  - Yapılacak: Fonetik sınıflandırmayı uzman kontrolünden geçir; nazali m/n ile düzelt; mecazı sesbilim bulgusu gibi sunma.
  - Katılım: ✅ tam · Durum: fonetik hata

- [ ] **C13 · "7. yy = 16 vezin" sınırlaması** — `/tr/arac/ritim`
  - Aruzun 16 bahri Halîl b. Ahmed (8. yy) ile sistemleşti; seci eksik. Anakronizm.
  - Yapılacak: Özeti ayrıntıya uydur; 16 vezni dönemin resmî tasnifi gibi sunma.
  - Katılım: ✅ tam · Durum: onaylı

- [ ] **C15 · Fâtiha merkez ayeti "iyyâke na'budu" (4.)** — `/tr/arac/kurani-tani`
  - Hafs'ta bu 1:5; 7 ayetin ortası (4.) = 1:4 "mâliki yevmi'd-dîn".
  - Yapılacak: Kullanılan sayım geleneğini her şemada belirt; cümlecik düzeni ile ayet numarasını ayır.
  - Katılım: 🟡 "hata" değil, **sayım-geleneği etiketi eksik**. Belirt.

- [ ] **C17 · Schubert 2005 → hipokampüs** — `/tr/tefekkur/sonsuzlugun-merdiveni`
  - O çalışma dikey konum–güç algısı (davranışsal), hipokampüs değil.
  - Yapılacak: Doğrudan araştırma yoksa beyin bölgesi iddiasını çıkar; davranışsal bulguyu doğru kapsamda ver.
  - Katılım: ✅ tam · Durum: yanlış atıf

- [ ] **C20 · 10 aşamalı "zorunlu, atlanamaz sıra"** — `/tr/atlas/insan-yolculugu`
  - Yapılacak: Bunun ayetlerden derlenen manevî olgunlaşma **modeli** olduğunu belirt; ayet lafzı ile yazar tasnifini ayır.
  - Katılım: ✅ tam · Durum: onaylı

- [ ] **C21 · Ahlâk ↔ deprem/kıtlık/zafer istisnasız nedensellik** — `/tr/arac/neden-sonuc`
  - Yapılacak: Ayet bağlamı + yorum sınırı belirt; doğal olayların bilimsel nedenselliği ile ahlâkî ibreti ayır.
  - Katılım: ✅ tam · Durum: onaylı

### Sayfa içi tutarsızlık / veri sayacı (🔎 kodda doğrulanacak)

- [ ] **C02 · "50+ kelime ailesi" (meta) vs 34 (arayüz)** — `/tr/atlas/furuk`
  - Yapılacak: Başlık, meta, sayaçlar tek sayımdan üretilsin. · Katılım: 🔎 muhtemelen doğru

- [ ] **C05 · Fâtiha "yedi ayet" halkası** — `/tr`
  - Besmele hariç 1:2–1:7 = altı ayet; son ayet ikiye bölünüp yedi konum kuruluyor.
  - Yapılacak: "Yedi ayet" yerine "yedi metin birimi/konum"; her düğümü ayet/cümlecik olarak düzelt.
  - Katılım: 🟡 sayım geleneğine bağlı; etiketle

- [ ] **C06 · "Modern psikolojiyi öngörmez" (üst) vs "14 asır önce eş" (alt)** — `/tr/atlas/insan-psikolojisi`
  - Yapılacak: Yorum eşleştirmesi ile klinik/tarihsel eşdeğerlik ayrımını tüm sekmelerde koru. · Katılım: ✅

- [ ] **C12 · Katalog 64 araç vs ana sayfa 65** — `/tr/arac/tum-araclar`
  - Yapılacak: Tek liste kaynağından sayaç + arama + site haritası üret. · Katılım: 🔎 muhtemelen doğru

- [ ] **C14 · Özet "kesben terk" vs bölüm "kalben terk"** — `/tr/tefekkur/inception-hayatlar`
  - Yapılacak: Özet ile yazarın vardığı sonuç arasındaki tersliği gider. · Katılım: 🔎 muhtemelen doğru

- [ ] **C18 · Seri göstergesi 4/4 vs sonraki sayfa 5/5** — `/tr/tefekkur/tugyan`
  - Yapılacak: Seri sayacı + önceki/sonraki bağlantıları tek listeden üret. · Katılım: 🔎 muhtemelen doğru

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
