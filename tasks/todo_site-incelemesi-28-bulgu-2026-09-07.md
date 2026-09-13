# Kapsamlı Site İncelemesi — 28 Bulgu (7 Eylül 2026)

Kaynak: 476 URL taranarak üretilen inceleme raporu. Raporun tamamı (bölüm
anlatımları ve ekran görüntüleri dahil) `QuranCodex-Kapsamli-Inceleme.html`
dosyasındadır; burada yalnız eyleme dönük bulgu listesi tutulur.

**Durum sütunu boş bırakıldı: bu bulguların hangilerinin düzeltildiği tek tek
doğrulanmadı.** İlk örnekleme C01'in düzeltilmiş olduğunu gösterdi
(`surah-connections.json` artık 31 diyor). Kalanlar teyit bekliyor.

| # | Öncelik | Rota | Bulgu | Yapılacak | Durum |
|---|---|---|---|---|---|
| C01 | P0 | `/tr/atlas/munasebat` | Rahmân/Vâkıa kartında nakarat sayısı 78 yazıyor; ana sayfadaki 31 ile çelişiyor. 78 sûrenin ayet sayısı. | Nakarat sayısını 31 yap; ortak veri kaynağından üret ve veri testi ekle. | |
| C03 | P0 | `/tr/atlas/furuk` | Tekil rîh azap, çoğul riyâh rahmet genellemesi mutlak kurulmuş. Yûnus 10:22 rîhin tayyibetin karşı örnektir. Matar için Nisâ 4:102 kontrol edilmeli. | Bağlam eğilimi olarak sun; istisnaları ve sayım yöntemini örüntünün yanında göster. | |
| C07 | P0 | `/tr/graf/zaman` | Nüzul Kronolojisi’nde114 sûrenin34 ayet sayısı karşılaştırma verisiyle uyuşmuyor. Örnek:Alak25/19,Tekvîr83/29,İnşirah28/8,Asr8/3,Kevser5/3 (gösterilen/doğru). | 114 sûre metadatasını tek kaynaktan üret, ayet sayısı toplamı ve sûre bazında doğrulama ekle. | |
| C08 | P0 | `/tr/arac/kurani-tani` | Fâtiha’da Allah lafzı geçmez iddiası yanlış: elhamdülillâh ifadesinde lafza-i celâl vardır. | Kartı düzelt; besmele dahil/hariç yöntemi bunu çözmez, 1:2 metnini sözcük çözümlemesiyle göster. | |
| C09 | P0 | `/tr/arac/kurani-tani` | Allah’tan sonra en çok geçen isim Rahmân iddiası, Rahîm daha sık geçtiği için desteklenmiyor. | Rahmân/Rahîm ve diğer isimler için lemma ve ilahî referans filtresini açıkla, sıralamayı yeniden hesapla. | |
| C16 | P0 | `/tr/tefekkur/ruhun-termostati` | Depresyon yalıtım kaybı olarak açıklanıyor; klinik durumu manevî/iradî tek mekanizmaya indirgiyor. | Metafor ile klinik tanımı ayır; çok etkenli açıklamayı ve uygun destek bilgisini ekle. | |
| C02 | P1 | `/tr/atlas/furuk` | Meta açıklamada 50+ kelime ailesi; arayüzde 34 aile/34 grup. | Başlık, meta ve sayaçlar tek sayımdan üretilmeli. | |
| C04 | P1 | `/tr/atlas/kiraat` | Tanıtımda Hafs/Verş/Kalun/Duri kıraat imamı kategorisiyle karışıyor; her imam sahabiden aldığı anlatımı tarihsel zinciri kısaltıyor. | İmam → râvi → tarik ağını ayrı düzeylerde göster; doğrudan sahabiden alan herkesmiş izlenimini kaldır. | |
| C05 | P1 | `/tr` | Halka anlatımında yedi ayet deniyor ama besmele hariç 1:2–1:7 altı ayet, son ayet iki cümleciğe bölünerek yedi konum kuruluyor. Ayrıntı notu bunu açıklıyor ama üst anlatım çelişiyor. | Yedi ayet yerine yedi metin birimi/konum yaz; her düğüm gerçek ayet ifadesini ayet veya cümlecik olarak düzelt. | |
| C06 | P1 | `/tr/atlas/insan-psikolojisi` | Üstte modern psikolojiyi öngörme iddiası yok denirken aşağıda travma yaklaşımına 14 asır önce eş deniyor. | Yorum eşleştirmesi ile klinik/ tarihsel eşdeğerlik ayrımını tüm sekmelerde koru. | |
| C10 | P1 | `/tr/arac/koruma-zinciri` | Bütün nüshalarda sıfır rasm varyasyonu şeklindeki evrensel iddia, atıf yapılan San’a alt metni çalışmasının kendisiyle uyuşmuyor. | İtikadî koruma inancı, standart mushaf rasmı, bölgesel rasm farkları, kıraat ve erken elyazması varyantlarını ayrı sun. | |
| C11 | P1 | `/tr/arac/ses-mimarisi` | Üstte tecvid ile ses sembolizmi farklı deniyor; aşağıda aynı olgu olarak sunuluyor. ه ve ح nazal olarak adlandırılıyor; 109 ve112 peş peşe deniyor. | Fonetik sınıflandırmayı uzman kontrolünden geçir; nazal örneği m/n ile düzelt; komşuluk iddiasını kaldır; mecazı sesbilim bulgusu gibi sunma. | |
| C12 | P1 | `/tr/arac/tum-araclar` | Katalog64 araç, ana sayfa65 araç gösteriyor. | Katalog kayıtlarının tek listesinden sayaç, arama ve site haritası üret. | |
| C13 | P1 | `/tr/arac/ritim` | Özet 7.yy sözünü yalnız16vezin şiir/serbest düzyazı olarak sınırlıyor; ayrıntı seciyi ve daha sonraki aruz sistemleştirmesini açıklıyor. | Özeti ayrıntıdaki nüansa uydur; 16vezni dönemin resmî tasnifi gibi sunma. | |
| C14 | P1 | `/tr/tefekkur/inception-hayatlar` | Özet kesben terk diyor, bölüm başlığı ve metin kesben değil kalben terk diyor. | Özet ile yazarın savunduğu sonuç arasındaki tersliği gider. | |
| C15 | P1 | `/tr/arac/kurani-tani` | Fâtiha’nın merkez ayeti dördüncü olarak iyyake nabudu gösterilmiş; Hafs numaralandırmasında bu 1:5. | Kullanılan ayet sayımı geleneğini her şemada belirt; cümlecik düzeni ile ayet numarasını ayır. | |
| C17 | P1 | `/tr/tefekkur/sonsuzlugun-merdiveni` | Schubert2005 atfıyla hipokampüs etkinliği ileri sürülüyor; atıf verilen çalışma davranışsal güç/yükseklik deneyleri anlatıyor. | Beyin bölgesi iddiasına uygun doğrudan araştırma yoksa çıkar; davranışsal bulguyu doğru kapsamda aktar. | |
| C18 | P1 | `/tr/tefekkur/tugyan` | Semantik seri göstergesi4/4, sonraki Siccin sayfası5/5. | Seri sayacı ve önceki/sonraki bağlantıları tek listeden üret. | |
| C19 | P1 | `/tr/arac/tefsir-ihtilaflari` | Doğrulandı rozetinin altında iki bağımsız/nötr istemle doğrulama yazıyor; bu ifade kontrolün asıl kaynak kanıtını göstermiyor. | Doğrulamayı özgün metin,baskı/cilt/sayfa,kalıcı bağlantı,kontrol eden ve tarihle belgele. İki istem çıktısını iki bağımsız birincil kaynak sayma. | |
| C20 | P1 | `/tr/atlas/insan-yolculugu` | On aşamalı tasnif, Kur’an’ın zorunlu ve hiçbir aşaması atlanmayan sırası gibi anlatılıyor. | Bunun ayetlerden hareketle derlenen manevî olgunlaşma modeli olduğunu belirt; ayet lafzı ve geleneksel/yazar tasnifini ayır. | |
| C21 | P1 | `/tr/arac/neden-sonuc` | Ahlâkî davranışlarla deprem/kıtlık ve zafer arasında istisnasız neden-sonuç zinciri kuruluyor. | Ayet bağlamını ve yorum sınırını belirt; doğal olayların bilimsel nedenselliğiyle ahlâkî ibret anlatımını ayır. | |
| C22 | P1 | `/tr/sor` | “Yorum katmaz, yalnızca yönlendirir” açıklamasına rağmen arama sonuçlarında ayetlerin yanında ek değerlendirme cümleleri ve sentez bir sonuç paragrafı bulunuyor. | Yeni çeviri yüklenene kadar açık yükleme durumu göster veya eski etiket/metni birlikte koru. | |

## Kodsuz bulgular

Kaynak raporda bu altısına kod verilmemiş; sayıyı 28'e tamamlayanlar bunlar.

| Rota | Bulgu | Yapılacak | Durum |
|---|---|---|---|
| `/tr/atlas/munasebat` | Rahmân/Vâkıa kartında nakarat sayısı 78 yazıyor; ana sayfadaki 31 ile çelişiyor. 78 sûrenin ayet sayısı. | Nakarat sayısını 31 yap; ortak veri kaynağından üret ve veri testi ekle. | |
| `/tr/atlas/furuk` | Tekil rîh azap, çoğul riyâh rahmet genellemesi mutlak kurulmuş. Yûnus 10:22 rîhin tayyibetin karşı örnektir. Matar için Nisâ 4:102 kontrol edilmeli. | Bağlam eğilimi olarak sun; istisnaları ve sayım yöntemini örüntünün yanında göster. | |
| `/tr/graf/zaman` | Nüzul Kronolojisi’nde114 sûrenin34 ayet sayısı karşılaştırma verisiyle uyuşmuyor. Örnek:Alak25/19,Tekvîr83/29,İnşirah28/8,Asr8/3,Kevser5/3 (gösterilen/doğru). | 114 sûre metadatasını tek kaynaktan üret, ayet sayısı toplamı ve sûre bazında doğrulama ekle. | |
| `/tr/arac/kurani-tani` | Fâtiha’da Allah lafzı geçmez iddiası yanlış: elhamdülillâh ifadesinde lafza-i celâl vardır. | Kartı düzelt; besmele dahil/hariç yöntemi bunu çözmez, 1:2 metnini sözcük çözümlemesiyle göster. | |
| `/tr/arac/kurani-tani` | Allah’tan sonra en çok geçen isim Rahmân iddiası, Rahîm daha sık geçtiği için desteklenmiyor. | Rahmân/Rahîm ve diğer isimler için lemma ve ilahî referans filtresini açıkla, sıralamayı yeniden hesapla. | |
| `/tr/tefekkur/ruhun-termostati` | Depresyon yalıtım kaybı olarak açıklanıyor; klinik durumu manevî/iradî tek mekanizmaya indirgiyor. | Metafor ile klinik tanımı ayır; çok etkenli açıklamayı ve uygun destek bilgisini ekle. | |
| `/tr/atlas/furuk` | Meta açıklamada 50+ kelime ailesi; arayüzde 34 aile/34 grup. | Başlık, meta ve sayaçlar tek sayımdan üretilmeli. | |
| `/tr/atlas/kiraat` | Tanıtımda Hafs/Verş/Kalun/Duri kıraat imamı kategorisiyle karışıyor; her imam sahabiden aldığı anlatımı tarihsel zinciri kısaltıyor. | İmam → râvi → tarik ağını ayrı düzeylerde göster; doğrudan sahabiden alan herkesmiş izlenimini kaldır. | |
| `/tr` | Halka anlatımında yedi ayet deniyor ama besmele hariç 1:2–1:7 altı ayet, son ayet iki cümleciğe bölünerek yedi konum kuruluyor. Ayrıntı notu bunu açıklıyor ama üst anlatım çelişiyor. | Yedi ayet yerine yedi metin birimi/konum yaz; her düğüm gerçek ayet ifadesini ayet veya cümlecik olarak düzelt. | |
| `/tr/atlas/insan-psikolojisi` | Üstte modern psikolojiyi öngörme iddiası yok denirken aşağıda travma yaklaşımına 14 asır önce eş deniyor. | Yorum eşleştirmesi ile klinik/ tarihsel eşdeğerlik ayrımını tüm sekmelerde koru. | |
| `/tr/arac/koruma-zinciri` | Bütün nüshalarda sıfır rasm varyasyonu şeklindeki evrensel iddia, atıf yapılan San’a alt metni çalışmasının kendisiyle uyuşmuyor. | İtikadî koruma inancı, standart mushaf rasmı, bölgesel rasm farkları, kıraat ve erken elyazması varyantlarını ayrı sun. | |
| `/tr/arac/ses-mimarisi` | Üstte tecvid ile ses sembolizmi farklı deniyor; aşağıda aynı olgu olarak sunuluyor. ه ve ح nazal olarak adlandırılıyor; 109 ve112 peş peşe deniyor. | Fonetik sınıflandırmayı uzman kontrolünden geçir; nazal örneği m/n ile düzelt; komşuluk iddiasını kaldır; mecazı sesbilim bulgusu gibi sunma. | |
| `/tr/arac/tum-araclar` | Katalog64 araç, ana sayfa65 araç gösteriyor. | Katalog kayıtlarının tek listesinden sayaç, arama ve site haritası üret. | |
| `/tr/arac/ritim` | Özet 7.yy sözünü yalnız16vezin şiir/serbest düzyazı olarak sınırlıyor; ayrıntı seciyi ve daha sonraki aruz sistemleştirmesini açıklıyor. | Özeti ayrıntıdaki nüansa uydur; 16vezni dönemin resmî tasnifi gibi sunma. | |
| `/tr/tefekkur/inception-hayatlar` | Özet kesben terk diyor, bölüm başlığı ve metin kesben değil kalben terk diyor. | Özet ile yazarın savunduğu sonuç arasındaki tersliği gider. | |
| `/tr/arac/kurani-tani` | Fâtiha’nın merkez ayeti dördüncü olarak iyyake nabudu gösterilmiş; Hafs numaralandırmasında bu 1:5. | Kullanılan ayet sayımı geleneğini her şemada belirt; cümlecik düzeni ile ayet numarasını ayır. | |
| `/tr/tefekkur/sonsuzlugun-merdiveni` | Schubert2005 atfıyla hipokampüs etkinliği ileri sürülüyor; atıf verilen çalışma davranışsal güç/yükseklik deneyleri anlatıyor. | Beyin bölgesi iddiasına uygun doğrudan araştırma yoksa çıkar; davranışsal bulguyu doğru kapsamda aktar. | |
| `/tr/tefekkur/tugyan` | Semantik seri göstergesi4/4, sonraki Siccin sayfası5/5. | Seri sayacı ve önceki/sonraki bağlantıları tek listeden üret. | |
| `/tr/arac/tefsir-ihtilaflari` | Doğrulandı rozetinin altında iki bağımsız/nötr istemle doğrulama yazıyor; bu ifade kontrolün asıl kaynak kanıtını göstermiyor. | Doğrulamayı özgün metin,baskı/cilt/sayfa,kalıcı bağlantı,kontrol eden ve tarihle belgele. İki istem çıktısını iki bağımsız birincil kaynak sayma. | |
| `/tr/atlas/insan-yolculugu` | On aşamalı tasnif, Kur’an’ın zorunlu ve hiçbir aşaması atlanmayan sırası gibi anlatılıyor. | Bunun ayetlerden hareketle derlenen manevî olgunlaşma modeli olduğunu belirt; ayet lafzı ve geleneksel/yazar tasnifini ayır. | |
| `/tr/arac/neden-sonuc` | Ahlâkî davranışlarla deprem/kıtlık ve zafer arasında istisnasız neden-sonuç zinciri kuruluyor. | Ayet bağlamını ve yorum sınırını belirt; doğal olayların bilimsel nedenselliğiyle ahlâkî ibret anlatımını ayır. | |
| `/tr/sor` | “Yorum katmaz, yalnızca yönlendirir” açıklamasına rağmen arama sonuçlarında ayetlerin yanında ek değerlendirme cümleleri ve sentez bir sonuç paragrafı bulunuyor. | Ayet ve meal alıntısını, kaynak özetini ve sistemin açıklama katmanını ayrı etiketle. Ek cümlenin kaynağını göster; yönlendirme vaadini gerçek davranışa uydur. | |
| `site geneli` | Bazı atlaslar ve okuma sayfalarında ilk HTML yalnız başlık/özet veya yükleniyor gösteriyor; ana veri istemciye bağımlı. | Anlamlı ilk veri, açıklama ve bağlantıları SSR/SSG ile sun; grafikle birlikte erişilebilir veri listesi ver. | |
| `site geneli` | Menü ve katalogdaki Fâtiha Atlası ve ek araçlar sitemapte bulunmuyor. | Tek route/katalog kaynağından iki dilde sitemap üret; yayın sonrası link kapsam testi uygula. | |
| `site geneli` | HTTP yanıtı www alan adına yönleniyor; canonical ve sitemap ise www olmayan adresi tercih ediyor. | Tercih edilen hostu tekleştir; redirect, canonical, sitemap ve iç bağlantıları aynı200 URLde buluştur. | |
| `/tr` | İlk ekranın çoğu atmosfer/animasyon; ana keşif önerisi aşağıda. | Mevcut altın-lacivert kimliği koru; ilk ekrana Oku / Bir örüntü keşfet / Konu ara kısa girişleri ekle. | |
| `site geneli` | İngilizce Mesel Atlası motiflerinde, Tabiat Atlası hayvan adlarında ve İbadetler sayfasındaki bazı kaynak açıklamalarında Türkçe metin kalmış. | Yalnız arayüz sözlüğünü değil veri nesnelerinin tüm açıklayıcı alanlarını yerelleştir; özel isimler ile çeviri eksiklerini ayrı test et. | |
| `/tr/oku/1` | Meal seçimi sonrası yeni çevirmen adı ile önceki metin geçici olarak birlikte görünüyor; veri gelince metin güncelleniyor. | Yeni çeviri yüklenene kadar açık yükleme durumu göster veya eski etiket/metni birlikte koru. | |

## Kanıt notları

- **C01** — Kanıt: HTTP canlı metin: Rahman 78 kez
- **C03** — Kanıt: Canlı DOM ve Diyanet10:22,4:102 karşı örnekleriyle doğrulandı.
- **C07** — Kanıt: Türkçe ve İngilizce HTTP metni + canlı DOM;114 kaydın tamamı yerel Kur’an veri tablosuyla karşılaştırıldı. Alak ayrıca Diyanet ile doğrulandı.
- **C08** — Kanıt: Canlı DOM ve Diyanet Fâtiha
- **C09** — Kanıt: Quranic Arabic Corpus: rahman57, rahim116 toplam kullanım; tümü ilahî kullanım demek değildir
- **C16** — Kanıt: WHO depresyon bilgi notu; sayfanın canlı metni
- **C02** — Kanıt: HTTP ve canlı DOM
- **C04** — Kanıt: Canlı DOM
- **C05** — Kanıt: Canlı DOM halka şeması
- **C06** — Kanıt: Canlı içerik ve HTTP
- **C10** — Kanıt: Sadeghi & Bergmann2010 çalışmasının özeti Osmanî olmayan metin tipini açıkça tanımlar
- **C11** — Kanıt: Canlı DOM/HTTP
- **C12** — Kanıt: Canlı DOM
- **C13** — Kanıt: Aynı sayfada iki farklı açıklama
- **C14** — Kanıt: HTTP metin başı ve bölüm başlığı
- **C15** — Kanıt: Site Hafs esasını belirtiyor; okuyucuya referansla karşılaştırılmalı
- **C17** — Kanıt: Schubert2005 PubMed16060739
- **C18** — Kanıt: Canlı/HTTP seri başlıkları
- **C19** — Kanıt: HTTP canlı yöntem sekmesi; dış kaynak bağlantısı bulunmuyor, eser+ayet atıfları mevcut.
- **C20** — Kanıt: Canlı HTTP giriş: Her aşama bir öncekinden doğar; hiçbiri atlanmadan geçilmez.
- **C21** — Kanıt: Canlı HTTP ana açıklama ve zincir kartları.
- **C22** — Kanıt: “Sabır ile ilgili âyetler hangileri?” örnek sorusu sonuç üretti; sonuçta ek açıklamalar ve sayfa sonunda sentez cümlesi görüldü. Ekran 15.4 s süre gösterdi; bu tek deneme genel hız ölçümü değildir.
