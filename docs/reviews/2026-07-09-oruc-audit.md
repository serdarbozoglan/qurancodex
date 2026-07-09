# QuranCodex İçerik Denetim Raporu — `/atlas/ibadetler/oruc`
Tarih: 2026-07-09
Denetçi: qc-content-auditor
Dosya: `next/public/ibadetler/oruc.json`

## Özet
- Toplam tarama: 1 JSON dosyası (917 satır)
- Kritik hata: 1 (Zekeriyya "3 gün konuşmama" savm okuması)
- Orta düzey sorun: 3
- Minör sorun: 3
- Genel değerlendirme: **YÜKSEK KALİTE**; sadece bir teolojik çerçeveleme problemi düzeltilmeli.

---

## Kritik Hatalar (Acil Düzeltme)

### [1] Zekeriyya'nın "3 gün konuşmama işareti"nin savm olarak sunulması — `peygamberVaryasyonlari[1]` & `icBoyut` bağı
**İddia** (satır 721): "Klasik tefsir bu üç günlük konuşmama halini savm semantik alanının açık bir örneği olarak okur… Elmalılı bu bağlamla Meryem'in savm-i sükût'unu (19:26) birbirine bağlar."
**Sorun:** Bu bağdaştırma **klasik tefsirin görüşü değil**. Taberi Meryem 19:10 ve Âl-i İmrân 3:41 tefsirinde İbn Abbâs, Katâde, Mücâhid, İbn İshak rivayetlerini nakleder — hepsi Zekeriyya'nın konuşmama halini bir **mucizevî dil bağlanması** (i'tikâlü'l-lisân, "hastalık olmaksızın konuşamama") olarak yorumlar. "Savm" kelimesi ne ayet metninde geçer ne tefsir bu duruma "savm" adı verir. Meryem 19:26'daki savm-i sükût ile Zekeriyya'nın işareti arasında **teolojik-lügavî bir köprü kurulmuş gibi** sunulmuş; bu, semantik alan genişletmesini klasik desteği olmadan yapmakta.
**Kanıt:** Taberi, *Câmiu'l-Beyân*, Meryem 19:10 tefsiri: "أَلَّا تُكَلِّمَ النَّاسَ… مِنْ غَيْرِ خَرَسٍ" (İbn Abbâs) — hastalık olmadan konuşamama; savm ibaresi yok. Âl-i İmrân 3:41 tefsirinde de aynı çizgi: "ramz" (işaretle iletişim), "i'tikâlü'l-lisân" — savm değil.
**Öneri:** İki seçenek:
1. Zekeriyya maddesini `peygamberVaryasyonlari`'ndan **çıkar** (savm dışı bir olay olarak); veya
2. Metni yeniden çerçevele: *"Klasik tefsir Zekeriyya'nın konuşmama halini bir işaret/mucize olarak okur, savm terimi kullanmaz. Ancak sonraki tasavvuf-tefsir geleneğinde (özellikle Elmalılı'nın Meryem 19:26 bağlamında dilin orucu okuması) bu olayla Meryem'in savm-i sükût'u arasında **tematik** bir yakınlık kurulmuştur — teknik olarak eşitleme değil, semantik alanın genişliğine örnek."*

---

## Orta Düzey Sorunlar

### [2] Elmalılı'ya atfedilen alıntı — `kuraniIsimler[Sabr]` & `insanEtkisi`
**İddia** (satır 489 ve 753): *"Elmalılı bu bağlamı 'oruç sabrın uygulamalı okuludur' cümlesiyle özetler."*
**Sorun:** Bu **tırnak-içi alıntı** Elmalılı'nın *Hak Dini Kur'ân Dili*'nin Bakara 2:153/2:183/2:45 tefsirlerinde birebir doğrulanamadı; **parafraz olma ihtimali yüksek**. Klasik tefsir alıntısı ile parafrazın karıştırılması Rule §B ihlâlidir.
**Öneri:** Tırnak işaretlerini kaldırıp "…Elmalılı bu bağlamı 'oruç sabrın uygulamalı halidir' anlamında özetler" gibi parafraz-belirtir bir dille yaz. Aynı düzeltme satır 774'teki *"'oruç Ramazan'ın kalbi, Kur'ân ise nefesi'"* ve satır 822'deki *"'oruç sınıfsal empatinin bedende doğduğu andır'"* alıntıları için de gerekli — bunlar da parafraz.

### [3] Râzî'nin oruç bağlamı okuma iddiaları — çoklu yerde tırnak
**İddia** (satır 840): *"Râzî 'oruç insanla Rabbi arasında en gizli sözleşmedir' der."* + (satır 858): *"Râzî orucun nefis terbiyesindeki asıl işlevini burada bulur…"*
**Sorun:** Râzî *Mefâtîhu'l-Ğayb* Bakara 2:183 tefsirinde bu ifadelerin **birebir** geçtiği kontrol edilemedi. Kaynağa ait bir cümle mi, editoryal özet mi belirsiz — spot-check gerekli.
**Öneri:** Tırnak yerine "Râzî'ye göre oruç…" formunu kullan; birebir alıntı yapılıyorsa Râzî'nin metninden sayfa numarası verilmeli.

### [4] "Klasik tasavvuf metinleri organların orucu kavramını sistemleştirmiştir" — icBoyut Meryem
**İddia** (satır 781): "Klasik tasavvuf metinleri bu ayetten hareketle 'organların orucu' kavramını sistemleştirmiştir."
**Sorun:** İfade doğru bir yönelim taşır (Gazâlî *İhyâ*'da "cevârih orucu" ayrımı yapar) ancak sayfa kaynakları listesinde Gazâlî veya herhangi bir sûfî kaynak yok. Klasik Ehl-i Sünnet çerçevesi + dört mezhep vurgusu ile "klasik tasavvuf sistemleştirdi" iddiası kaynaksız kalıyor.
**Öneri:** Ya `kaynaklar` listesine Gazâlî *İhyâ* Kitâbu Esrâri's-Savm ekle, ya bu cümleyi "sonraki tasavvuf geleneği bu ayetten 'organların orucu' temasını çıkardı" olarak yumuşat.

---

## Minör Sorunlar

### [5] Bakara 2:186 "yakınlık ayetinin yerleşimi manidar" iddiası — `anaPasajlar`
**Satır 524 ve 760:** Bakara 2:186'nın oruç ayetleri (2:183-187) arasında **yerleşiminin** Kur'ânî bir tercih olduğu vurgulanır. Bu klasik Râzî okumasıdır (doğru); ancak bir sahâbî rivayetinin (yakınlık sorusu üzerine indi) doğrulanabilirliği zayıf. Sorun büyük değil — "klasik rivayet" ifadesi zaten epistemik nüans taşıyor. Devam edebilir.

### [6] Sıyâm/Savm "~14" sayımı
**Satır 111:** "~14 (ص و م kökü, tüm türevler)". Corpus Quran doğrulaması: **tam 14** (yaṣum×2, ṣawm×1, ṣiyām×9, ṣāimāt×1, ṣāimīn×1). "~" işareti aslında **gereksiz** — sayı tam. `humanSpotChecked: false` ise `true` yapılıp "14" olarak sabitlenmeli.

### [7] Ahzâb 33:35 içeriği kısaltılmış — anaPasajlar
**Satır 543:** Ayet mealinden 8 vasıflı çift (kanitin/kanitat, sadıkîn/sadıkât, hâşî'în/hâşî'ât, mutasaddikîn/mutasaddikât…) atlanıp "..." ile geçilmiş. Bu OK, ancak `not` sahasında "on çift" ifadesi geçiyor — doğrulama: ayet aslında **10 çift** (müslim/müslimât + mü'min/mü'minât + kânit/kânitât + sâdık/sâdıkât + sâbir/sâbirât + hâşi'/hâşi'ât + mutasaddik/mutasaddikât + sâim/sâimât + hâfız/hâfızât + zâkir/zâkirât). **Sayım doğru.**

---

## Tartışmalı İfadeler (Not: sayfada zaten dengeli)
- **`tensionNote` (satır 710):** "Bu tab 'sadece Kur'ân, sünnete gerek yok' söylemine kapı aralamaz." — **excellent guardrail**. Kur'aniyyun sızıntısı YOK; klasik Ehl-i Sünnet çerçevesi açıkça belirtilmiş. **Övgüye değer.**
- `rakamsalMimari` bölümü Kur'ân ↔ sünnet iş bölümünü net kuruyor; 4 mezhep icması vurgusu doğru.
- Bakara 2:187 "beyaz iplik" hadîs-eşliği (yastığın altına iplik koyan sahâbî anekdotu) klasik rivayettir (Buhârî *Savm* 16, Müslim *Sıyâm* 33) — doğru nakledilmiş.

## Eksik Kaynak / Zayıf Kanıt
- **Îzutsu §X yok** — sayfada Îzutsu 3 yerde referans veriliyor ancak sayfa/§ numarası yok. Bu, denetim isteğinin özel not istediği husus. Şu haliyle "kaba referans"; **temiz** (yani sahte §X uydurulmamış), ancak bir gün akademik sağlamlık için Îzutsu *Ethico-Religious Concepts* (Montreal 1966) sayfa numaraları eklenirse mükemmel olur.
- Elmalılı ve Râzî için de aynı — kaynak eserler doğru, ancak cilt/sayfa yok.

## Genel Değerlendirme
Sayfa **methodolojik olarak çok sağlam**. `humanSpotChecked` alanları, `spotCheckNote` şeffaflığı, "Kur'ân ilkeyi koyar / sünnet tafsil eder" çerçevesi ve `tensionNote` guardrail'i sayfanın Kur'aniyyun sızıntısından uzak, Ehl-i Sünnet çerçevesinde ve akademik dürüstlükle yazıldığını gösteriyor. 14 ayet referansı (Bakara 2:183-187, Meryem 19:26, Ahzâb 33:35, Nisa 4:92, Mücâdele 58:4, Mâide 5:89, Mâide 5:95, Bakara 2:196) hepsi doğru — hiçbir ayet ref hatası yok. Semantik terim kökleri (ص و م, ر م ض, ف ط ر, ع ك ف, ق ض ي, ك ف ر, و ق ي, ر خ ص, ف د ي, ص ب ر) tümü doğru. **Tek gerçekten problematik nokta**: Zekeriyya'nın konuşmama işaretini "savm" olarak klasik tefsire atfetmek. Bu bulgunun düzeltilmesiyle sayfa yayına tam hazır olur.
