# Zekât Sayfası İçerik Denetimi

**Tarih:** 2026-07-09
**Kapsam:** `next/public/ibadetler/zekat.json` (1114 satır) — anchor, claims, kuraniIsimler (13 terim), anaPasajlar, rakamsalMimari, peygamberVaryasyonlari (8 madde), icBoyut, insanEtkisi, kaynaklar.
**Yardımcı:** `verse-graph-bgem3.json`, `IbadetlerPillar.jsx`.

---

## Özet

| Kategori | Sayı |
|---|---|
| 🔴 Kritik | 1 |
| 🟠 Ciddi | 3 |
| 🟡 Minör | 5 |
| ✅ Doğrulandı | 12 blok |

Sayfa genelinde **ilke/tafsil ayrımı** (Kur'ân koyar, sünnet detaylandırır) titizlikle korunuyor; Kur'aniyyun sızıntısı YOK. Klasik tefsir çapaları (Râzî, Kurtubî, Elmalılı) tutarlı. Ancak bir peygamber atfı hatası ve iki büyük ayetin Arapça bloğunda eksiklik var.

---

## 🔴 Kritik

### K-1 — Enbiyâ 21:73 "Zekeriya, Yahya, İsa (topluca)" ATFI YANLIŞ
`zekat.json:871-877` `peygamberVaryasyonlari[5]`
> "prophet": "Zekeriya, Yahya, İsa (topluca)", "ref": "Enbiyâ 21:73"

**Sorun:** Enbiyâ 21:73'ün formülü ("خَيْرَاتِ وَإِقَامَ الصَّلاَةِ وَإِيتَاءَ الزَّكَاةِ") pasaj bağlamında **İbrahim → İshak → Yakub** üçlemesine (21:72-73) atıftır. Zekeriya (21:89-90), Yahya (21:90) ve İsa (21:91) aynı sûrede fakat **farklı ayetlerde** ve **zekât ifadesi olmadan** anılır. Aynı JSON zaten satır 837-841'de 21:73'ü İbrahim'e doğru şekilde bağlamış — dolayısıyla sekiz maddeden ikisi aynı ayete atıfla iki farklı peygamber grubunu bağlıyor, biri hatalı.

**Öneri:** Bu maddeyi silin veya Meryem 19:12-13 (Yahya) / Meryem 19:31 (İsa'nın zekât emri) referansıyla yeniden yazın. Zekeriya için doğrudan zekât ayeti bulunmaz; grup çıkarılmalıdır.

---

## 🟠 Ciddi

### C-1 — anaPasajlar bloklarında Arapça metin EKSİK/KESİK
- **Meâric 70:24-25** (`zekat.json:701`): `ar` alanı sadece 70:24 içeriyor ("وَالَّذِينَ فِٓي اَمْوَالِهِمْ حَقٌّ مَعْلُومٌ"). Ancak Türkçe/İngilizce çeviri **"isteyen ve mahrum için"** (70:25) ifadesini içeriyor — 25. ayet ("لِلسّٓائِلِ وَالْمَحْرُومِ") Arapça'dan düşmüş. Ref "70:24-25" olarak veriliyor; Arapça bloğu da iki ayeti kapsamalı.
- **Leyl 92:5-11** (`zekat.json:728`): `ar` sadece 92:5 ("فَاَمَّا مَنْ اَعْطٰى وَاتَّقٰى"). Çeviri 92:5-10 arasını tam olarak veriyor. 6-10 ayetleri Arapça'dan düşmüş.
- **Tevbe 9:34-35** (`zekat.json:710`): `ar` sadece 9:34 içeriyor; `not` alanı 9:35 azap sahnesine referans veriyor ama Arapça 9:35 bloktan eksik.

**Etki:** ReadingMode kapatılıp sadece bu blok gösterildiğinde kullanıcı Türkçe/İngilizce mealinde olan ifadenin Arapça karşılığını bulamaz — akademik güven zedelenir.

**Öneri:** Her üç blokta Arapça'yı ref aralığının tamamını kapsayacak şekilde tamamlayın.

### C-2 — Îzutsu §4/§5 atıfları KAYNAKÇA HATASI
`zekat.json:199` (Sadaka), `zekat.json:149` (Zekât), `zekat.json:1109` (Kaynaklar):
> "Îzutsu, Ethico-Religious Concepts §4 (ṣidq-ṣadaqa alanı)"
> "Îzutsu §5 (tazkiya semantic field)"

**Sorun:** Toshihiko Izutsu'nun *Ethico-Religious Concepts in the Qur'ān* (1966) numaralı § sistemiyle değil, **başlıklı bölümlerle** düzenlenmiştir (Chapter 1: The Basic Moral Dichotomy of Believer/Unbeliever; Chapter 4: The Believers; Chapter 7: The Concept of Kufr, vd.). Ṣidq-ṣadaqa semantik alanı Chapter 4 civarında değil, "Islamic Ethics" ve "Faith" bağlamlarında geçer; tazkiya semantik alanı da tek bir § başlığına bağlanmaz. Bu §4/§5 numaraları **uydurma referans** riski taşıyor.

**Öneri:** Ya bölüm başlıklarıyla değiştirin ("Izutsu, *Ethico-Religious Concepts*, ch. 'Faith and Truthfulness' bölümü") ya da tümüyle "Izutsu'nun genel semantic-field metodolojisi" olarak yumuşatın. Şu haliyle sahte spesifiklik yaratıyor.

### C-3 — occurrenceCount 'Sadaka ~24' spot-check gerektiriyor
`zekat.json:174-176`
> "displayLabelTr": "~24 (sadaka anlamı, ص د ق kökü)"
> "humanSpotChecked": false

**Sorun:** Ṣadaqa/ṣadaqāt (isim formu) Kur'ân'da yaklaşık 13 kez geçer (ṣadaqa: 5; ṣadaqāt: 8). Sadaka fiil/mastar türevleri (tasaddaqa, muṣṣaddiq, taṣaddaqu) katıldığında bile 24'e ulaşmak zorlar. "~24" muhtemelen `ṣ-d-q` kökünün ṣidq/ṣiddîq/muṣaddiq türevlerini de yakalayan gevşek arama sonucudur — o zaman "sadaka anlamı" iddiası düşer.

**Öneri:** searchTerms'de "الصَّدَقَة", "صَدَقَة", "الصَّدَقَات", "صَدَقَات", "بِالصَّدَقَات" var; bunlarla auto-count'u yeniden koştur; sonuç 13 civarında çıkmalı. Etiketi ~13 olarak düzelt veya `humanSpotChecked: true` sonrası doğru sayıyı yaz.

---

## 🟡 Minör

- **M-1** — `hakk-ı ma'lûm anlamKatmanlari[0].descTr` (`zekat.json:279`): "mahrumun 'hakkı' zaten oradadır" doğru ama Râzî'nin bu ayete "hak-ı ma'lûm zekât mı, yoksa nafile mi?" tartışmasını da işlediği not düşülmüyor; klasik tefsirde bu ayetin zekât mı yoksa "sünnet infak" mı olduğu tartışmalıdır (Râzî, Kurtubî; İbn Kesîr bunun **zekât dışı** ek bir hak olduğunu tercih eder). "Klasik tefsir tek yönlü okur" imasından kaçınılmalı.
- **M-2** — `zekat.json:319` Elmalılı'ya atfen "'Zekâtın en küçüğünü bile vermeyen' anlamı da katmandır" — Elmalılı bunu bir katman olarak SUNAR ama tercih etmez; nakli "bir kavl" seviyesinde kalır. "Katmandır" ifadesi bir üsttedir.
- **M-3** — `zekat.json:827` Fitır sadakası için A'lâ 87:14 delili: "klasik tefsirde bir okumada işaret aranır" ifadesi doğru; ancak "medium confidence" ile sunulmuş — Saîd b. Müseyyeb ve Ömer b. Abdülaziz'in bu görüşü olmasına rağmen cumhur bunu **kabul etmez**; "low" olabilir.
- **M-4** — `Bakara 2:83` `zekat.json:859-860`: "namazı kılacak ve zekâtı vereceksiniz" ifadesi doğru ancak dikkat: 2:83'te "الزَّكاة" kelimesi geçer ancak İsrailoğulları bağlamında bu "sadaka/vergi" mi zekât-ı şer'iyye mi tartışmalıdır. Klasik tefsir bunu "her ümmete özgü verme emri" olarak genelleştirir; "Kur'ân zekâtı tek ümmete özgü kılmaz" iddiası kuvvetli ama tefsir literatüründe daha ihtiyatlı sunulur. Framing yumuşatılabilir.
- **M-5** — `Lokman 31:19` `zekat.json:865-869`: Peygamber olmayan Lokman'ın "peygamberVaryasyonlari" listesine dahil edilmesi — Lokman'ın nübüvvet meselesi tartışmalıdır (cumhur: hakîm, peygamber değil). Bu bölüm başlığı "Peygamberler" olduğu için Lokman'ın buraya alınması içerik/başlık uyumsuzluğu yaratır. "hakîm figürler" olarak alt-etiketlenebilir veya çıkarılabilir.

---

## ✅ Doğrulandı

- **Anchor Tevbe 9:103** Arapça, meal, referans tam doğru.
- **Tevbe 9:60** 8 kategori sıralaması Kur'ân metnine birebir uyar (fukarâ, mesâkîn, âmilûn, müellefe-i kulûb, riqāb, gārimûn, fî sebîlillâh, ibnu's-sebîl).
- **Meryem 19:31 (İsa) + Meryem 19:55 (İsmail)** her ikisi de "namaz-zekât" formülüyle ayet metinlerine uyar.
- **Bakara 2:276** "yamḥaqu'llāhu'r-ribā wa yurbi'ṣ-ṣadaqāt" ↔ Türkçe/İngilizce meal doğru.
- **Rûm 30:39** riba-zekât karşıtlığı için doğru anchor.
- **Haşr 59:9** hem îsâr hem şuḥḥ an-nefs formülünü içerir — doğru.
- **Bakara 2:275-279, 2:262, 2:264, 2:267, 2:271, 2:274** hepsi doğru referans/meal.
- **Zâriyât 51:19 / Meâric 70:24-25 paralelliği** — doğru semantik iddia.
- **Nisab 200 dirhem gümüş / 20 miskal (~85g) altın** — mütevâtir sünnet + 4 mezhep icması. Doğru.
- **1/40 (%2.5) nakit/ticaret; 1/10 sulanmayan; 1/20 sulanan tarım** — 4 mezhep icması, doğru.
- **Karz-ı hasen 6 mevki** (Bakara 2:245, Mâide 5:12, Hadîd 57:11, 57:18, Teğâbun 64:17, Müzzemmil 73:20) — sayı doğru.
- **YASAK kelimeler taraması:** "Kur'an'da yok", "sonradan eklendi", "pasaj" (Türkçe), "ritüel", "pillar" (Türkçe) — hiçbiri kullanılmamış. `rakamsalMimari.tensionNote` (satır 833) Kur'aniyyun red beyanı olarak açık ve doğru konumlanmış.

---

## Genel Değerlendirme

Sayfa **akademik açıdan güçlü**: Kur'ân/sünnet iş bölümü net, tafsir zinciri (Râzî-Kurtubî-Elmalılı) tutarlı, semantik alan (zekât-sadaka-infâk-hakk-mâûn-karz-kanz-riba-israf-iktisad-îsâr-bahil-şükür) modern semantik tefsire ihtiyatlı yaklaşım gösteriyor. **Kritik düzeyde bir peygamber atfı hatası** (K-1), Arapça bloklarda üç yerde **eksik ayet metni** (C-1), Îzutsu §-numaraları **muhtemelen uydurma** (C-2). Bu üçünün düzeltilmesi sayfa güvenilirliğini yeterli akademik eşiğe taşır. Occurrence sayımları için `humanSpotChecked: false` bayrağı korunmuş — bu şeffaflık iyi; Sadaka için spot-check zorunlu (C-3).
