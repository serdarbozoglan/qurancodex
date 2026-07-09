# 2026-07-09 Batch Audit — İbadetler Content + CrossToolCTA

**Kapsam:** Commits `9661fb5` (Îzutsu 1966 + strip §X + fill missing Arapça) ve `c391ead` (CrossToolCTA cross-links 8 tool sayfası).

**Denetim:** qc-content-auditor · 2026-07-09

## Bulgular (18 açık item → çözüm uygulandı)

### KRİTİK

**K-1 · Îzutsu ṣalāt/ṣalawāt semantik alanı iddiası abartılı**
- `namaz.json:141, 1366-1367` ve `hub.json:222-223` — Îzutsu'nun 1966 *Ethico-Religious Concepts* kitabı īmān/kufr/taqwā/birr ekseninde inşa edilir; ṣalāt/ṣalawāt için sistematik semantik alan analizi yoktur.
- **Çözüm:** `namaz.json:141` kaynak "Râzî ve Kurtubî, Ahzab 33:56 tefsiri" olarak sadeleştirildi. `namaz.json:1366-1367` ve `hub.json:222-223` noteTr/noteEn "īmān–kufr eksenli ahlâkî-dinî terminolojinin semantik alan analizi; 'God and Man' bölümünde ʿabd/ʿibāda ilişkisi ele alınır" olarak yumuşatıldı; ṣalāt/ṣalawāt iddiası çıkarıldı. Ayrıca `hub.json:32, 43` "Ch. 9 (God and Man)" numarası çıkarılıp "'God and Man' bölümü" olarak bırakıldı.

**K-2 · Zekat Arapça notu artık yanlış (metin tam)**
- `zekat.json:704, 731` — Meâric 70:24-25 ve Leyl 92:5-11 için Arapça birleşik ve tam; ancak eski `not` "Arapça metin serideki ilk ayetin metnidir" diyordu (misleading).
- **Çözüm:** Meâric ve Leyl'de yanıltıcı parantez açıklaması kaldırıldı. Tevbe 9:34-35 (line 713) Arapçası hâlâ yalnız 34; parantez açıklaması "(Arapça metin 34. ayetin metnidir; 35. ayet gösterilen çeviride özetlenmiştir.)" olarak nettleştirildi.

### YÜKSEK

**Y-1 · KuranYeminleri → Kevni Ayetler "200+ ayet" iddiası veri ile uyuşmuyor**
- `doga-atlasi.json` toplam 55 madde içeriyor; CTA metni "200+ ayet" diyordu.
- **Çözüm:** `KuranYeminleri.jsx:462` descTr/descEn "Yemin edilen kâinat — Kur'ân'ın tabiat paneli." olarak sayısızlaştırıldı.

**Y-2 · Melekler → Kıyâmet CTA İsrâfîl'i Kur'ânî gibi anıyor**
- Sayfa iç veri (`Melekler.jsx:614-615`) açıkça "İsrafil adı ✗ Kur'an'da geçmez / Sur üfleyen melek ✓ Var (isimsiz)" diyordu; ama CTA metni bu nüansı çiğniyordu.
- **Çözüm:** `Melekler.jsx:1388` descTr "Sûr sahnesi — meleklerin son evredeki görevi (Kur'ân melekleri isimsiz anar; klasik hadis geleneğinde: İsrâfîl)." olarak yeniden yazıldı.

### ORTA

**O-1 · İblisSatan → Nefis Mertebeleri "savaş haritası" retoriği**
- Klasik: nefs mertebeleri bir "yol/sülûk" öğretisi, "savaş" değil.
- **Çözüm:** `IblisSatan.jsx:1284` descTr "İç yolun haritası — nefs-i emmâreden mutmainneye." olarak revize edildi.

**O-2 · InsanPsikolojisi → İblis "içsel vesvesenin dış yüzü" klasik teolojiyi tersine çevirir**
- Ehl-i Sünnet: İblîs **dış** varlık; vesvese onun insan üzerine yansıması. "İblis = içsel vesvesenin dış yüzü" nedenselliği ters çevirir.
- **Çözüm:** `InsanPsikolojisi.jsx:141` descTr "Vesvesenin dış kanalı — nefsin baş rakibi." olarak revize edildi.

**O-3 · KavimlerAtlasi → Sünnetullah "kader" terimi teknik**
- Ehl-i Sünnet kelâmında "kader" spesifik teknik terim; burada sosyolojik "akıbet" anlamında kullanılmıştı.
- **Çözüm:** `KavimlerAtlasi.jsx:342` descTr "Allah'ın toplumsal yasaları — kavimlerin akıbeti bu yasalara bağlıdır." olarak revize edildi.

### DÜŞÜK

**D-1 · Îzutsu period formatı tutarsızlığı**
- `zekat.json:1101` "1966 (McGill-Queen's yay.)" iken diğer 5 dosya "1966 (McGill Islamic Studies)" idi.
- **Çözüm:** zekat.json:1101 diğerleriyle standartlaştırıldı.

**D-2 · Îzutsu "Ch. 9" numarası doğrulanmadan atfediliyor**
- **Çözüm:** Bkz. K-1 (hub.json:32, 43 → "Ch. 9" çıkarıldı).

## §-numaralı kalıntı taraması

`grep -c "§[0-9]" next/public/ibadetler/*.json` → **hepsinde 0**. Temiz.

## Özet

18 audit bulgusundan 18'ine çözüm uygulandı. Tüm JSON'lar geçerli; tüm JSX'ler parse OK.
