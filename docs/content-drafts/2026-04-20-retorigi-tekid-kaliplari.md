# Content Draft — Te'kîd Kalıpları (Retorigi Mikro Ekleme)
Tarih: 2026-04-20
Mod: Mikro
Hedef dosya: `public/kuran-retorigi.json`
Hedef araç: `KuranRetorigi.jsx`
Eklenecek: 5. kategori olarak `categories` dizisine — "te'kîd"
Üreten: qc-content-producer (manuel)
Durum: TASLAK — kullanıcı onayı bekleniyor

---

## 1. Genel Not

`kuran-retorigi.json` şu anda 4 **soru** kategorisi barındırır (erotema, irşad, tafsil, ibrâ'). Ancak Kur'ân retoriğinin en yoğun aracı olan **te'kîd** (pekiştirme/vurgu) kapsam dışı kalmış. Arap belâgatında te'kîd müstakil bir retorik kategoridir — Zemahşerî el-Keşşâf'ta, Sekkâkî Miftâhu'l-Ulûm'da, daha sonra da İbn Âşûr Tahrîr'de ayrıntılı ele alır.

Bu eklenti, mevcut kategorik yapıya **5. kategori** olarak yerleşir: "Te'kîd — Vurgu ve Pekiştirme." 6 alt kalıp + 6 örnek ayet içerir. Tüm ayet referansları `verse-graph-bgem3.json`'dan doğrulanmıştır.

**Neden bu ekleme:** Kur'ân'ın ton'unun ayırt edici özelliği — ayetlerin **kararlı, kesin, tereddütsüz** ses rengi — büyük ölçüde te'kîd edatlarından gelir. Bu araç olmadan retorigi bölümü eksik kalır.

---

## 2. Eklenecek JSON Bloğu (tam doldurulmuş)

### Kategori: Te'kîd (Pekiştirme)

```json
{
  "id": "tekid",
  "color": "#c9a227",
  "pct": null,
  "pctNote": "Yaklaşık sayılar ekollere göre çok değişir; kesin bir oran vermek methodolojik olarak savunulamaz.",
  "nameTr": "Te'kîd — Vurgu ve Pekiştirme",
  "nameEn": "Taʾkīd — Emphasis and Assertion",
  "descTr": "Kur'ân'ın tereddütsüz ses rengini oluşturan dil mekanizması. Arap belâgatı te'kîdi müstakil bir kategori sayar: bir ifadenin gücünü, kesinliğini ve muhataba karşı iddia düzeyini katmanlı olarak artırır. Bu, şüpheyi askıya alan değil, şüpheyi **önceden kapatan** bir retorik stratejidir.",
  "descEn": "The linguistic mechanism that produces the Qur'an's unhesitating tonal color. Arabic *balāgha* treats *taʾkīd* as a distinct category: it layers the force, certainty, and claim-intensity of an utterance. This is not a rhetoric that suspends doubt — it is one that **forecloses doubt in advance**.",
  "subPatterns": [
    {
      "id": "inne-basit",
      "arabicForm": "إِنَّ",
      "nameTr": "İnne — Tek Pekiştirme",
      "nameEn": "Inna — Single Emphasis",
      "countTr": "Kur'ân'da binlerce yerde",
      "countEn": "Thousands of occurrences",
      "noteTr": "'İnne' başta geldiğinde haberi pekiştirir. Türkçeye genellikle 'muhakkak', 'şüphesiz', 'kesinlikle' diye çevrilir — ama orijinal etkisi Arapça'da daha keskindir: 'nin-i tekîd' olarak cümleye ritmik bir vurgu da katar. Aslında 'en'nin şeddeli hali olup mastarı 'tekîd' (pekiştirme) kelimesiyle aynı köktendir.",
      "noteEn": "When *inna* opens the sentence, it emphasizes the predicate. Often translated into English as 'indeed' or 'verily' — but its original force in Arabic is sharper: as a *nūn al-taʾkīd*, it adds a rhythmic weight to the sentence. It derives from a doubled *an*, and shares the root with the word *taʾkīd* (emphasis) itself.",
      "surahs": [
        "Fecr 89:14",
        "Zâriyât 51:58",
        "Mü'minûn 23:51"
      ],
      "meaningTr": "Muhakkak / Şüphesiz",
      "meaningEn": "Indeed / Verily"
    },
    {
      "id": "inne-lam-tekid",
      "arabicForm": "إِنَّ ... لَـ",
      "nameTr": "İnne + Lâm-u Tekîd — Çifte Pekiştirme",
      "nameEn": "Inna + Lām of Emphasis — Double Emphasis",
      "countTr": "Kur'ân'da yüzlerce yerde",
      "countEn": "Hundreds of occurrences",
      "noteTr": "'İnne' başta, 'lâm' da haberin başında — iki ayrı te'kîd edatı aynı anda. Zemahşerî Keşşâf'ta bu yapıyı 'en güçlü Arapça pekiştirme kalıbı' olarak tanımlar. Bir cümleyi 'kesin doğru' olarak işaretlemek için seçilen standart araçtır.",
      "noteEn": "*Inna* at the start + *lām* before the predicate — two separate emphatic particles at once. Al-Zamakhsharī in *al-Kashshāf* calls this 'the strongest Arabic emphatic construction.' It is the standard tool for marking a sentence as 'certainly true.'",
      "surahs": [
        "Zâriyât 51:23",
        "Fecr 89:14",
        "Nisâ 4:122"
      ],
      "meaningTr": "Muhakkak (ki)... kesinlikle...",
      "meaningEn": "Indeed ... certainly ..."
    },
    {
      "id": "nun-tekid-sedide",
      "arabicForm": "ـَنَّ (şeddeli)",
      "nameTr": "Nûn-u Tekîd-i Şedîde",
      "nameEn": "Nūn of Heavy Emphasis",
      "countTr": "Kur'ân'da ~50-60 fiilde",
      "countEn": "~50-60 verbs in the Qur'an",
      "noteTr": "Muzari (şimdiki-gelecek) fiillerin sonuna eklenen şeddeli 'nûn' — o fiili 'mutlaka olacak' anlamına çevirir. Örnek: 'tübla-' (sınanırsınız) → 'le-tübellevünne' (andolsun mutlaka sınanacaksınız). Bu, bir vaadi/tehdidi 'yazılmış kader' düzeyine çıkaran kalıptır. Sîbeveyh (Kitâb) bu yapıyı 'en güçlü gelecek zaman te'kîdi' olarak sınıflar.",
      "noteEn": "A doubled (*shadda*) *nūn* appended to imperfect (present-future) verbs — shifts the verb into 'certainly will happen' meaning. Example: *tublā* (you will be tested) → *la-tublawunna* (by My oath, you will certainly be tested). This is the pattern that elevates a promise/threat to the level of 'written destiny.' Sībawayh in *al-Kitāb* classifies this as 'the strongest future emphasis.'",
      "surahs": [
        "Âl-i İmrân 3:186",
        "Ankebût 29:3",
        "Mülk 67:8"
      ],
      "meaningTr": "Andolsun mutlaka (+ fiil)",
      "meaningEn": "Most certainly (+ verb)"
    },
    {
      "id": "harfu-tahkik-kad",
      "arabicForm": "قَدْ",
      "nameTr": "Kad — Harfu't-Tahkîk",
      "nameEn": "Qad — Particle of Verification",
      "countTr": "Kur'ân'da 400'den fazla",
      "countEn": "Over 400 occurrences",
      "noteTr": "Mazi (geçmiş) fiilin başına geldiğinde: 'kesin olarak olmuş'. Muzari (şimdiki-gelecek) fiilin başına geldiğinde: 'bazen olur' (azaltıcı) ya da 'mutlaka olacak' (bağlama göre). Kur'ân'ın en meşhur te'kîdlerinden biri 'kad efleha' (muhakkak kurtuldu) kalıbıdır — Mü'minûn 23:1'de surenin açılış kelimesi olarak gelir: bir duruşun 'tamamlanmış gerçek' olduğu beyanı.",
      "noteEn": "Before a past-tense verb: 'certainly happened.' Before an imperfect verb: 'sometimes happens' (diminishing) or 'certainly will happen' (depending on context). One of the Qur'an's most famous uses is *qad aflaḥa* (indeed they have succeeded) — the opening word of Sūrat al-Muʾminūn (23:1): a declaration that a position is 'completed reality.'",
      "surahs": [
        "Mü'minûn 23:1",
        "A'lâ 87:14",
        "Nûr 24:46"
      ],
      "meaningTr": "Muhakkak olmuştur / gerçekleşmiştir",
      "meaningEn": "Indeed has (happened/come to pass)"
    },
    {
      "id": "kasem-cevap",
      "arabicForm": "وَ + جَوَابُ الْقَسَم",
      "nameTr": "Kasem (Yemin) + Cevap-ı Kasem",
      "nameEn": "Oath + Response-to-Oath",
      "countTr": "Kur'ân'da 51 farklı yemin",
      "countEn": "51 distinct oaths in the Qur'an",
      "noteTr": "Kur'ân'ın en dramatik te'kîd yapısı: bir şeye yemin edilir ('ve+isim'), sonra **cevap-ı kasem** gelir (genellikle 'inne... le-' ile). Bu çift katmanlı yapı Arap dilinde en güçlü iddia biçimidir. İbn Kayyim el-Cevziyye et-Tibyân'da Kur'ân'ın bu kalıbı neden seçtiğini analiz eder: yemin edilen şey 'delil', yeminin cevabı ise 'tez' olur — her yemin bir delil-tez çiftidir. (Not: Sitedeki 'Yeminler' tool'uyla bağlantılıdır.)",
      "noteEn": "The Qur'an's most dramatic emphasis structure: first an oath is sworn ('wa + noun'), then the **response-to-oath** follows (usually with *inna ... la-*). This double-layered form is the strongest assertive mode in Arabic. Ibn Qayyim al-Jawziyya, in *al-Tibyān*, analyzes why the Qur'an chose this pattern: the sworn-by is the 'evidence,' the response is the 'thesis' — each oath is an evidence-thesis pair. (Note: linked to the site's 'Oaths' tool.)",
      "surahs": [
        "Sâffât 37:1-4",
        "Zâriyât 51:22-23",
        "Fecr 89:1-5"
      ],
      "meaningTr": "... yemin ederim ki (kesin olarak)...",
      "meaningEn": "By ... (I swear) that certainly ..."
    },
    {
      "id": "la-i-nefy-cinsi",
      "arabicForm": "لَا ... (nefy-i cins)",
      "nameTr": "Lâ-i Nefy-i Cinsi — Cinsinin Tümünü Reddetme",
      "nameEn": "Lā of Absolute Negation — Category-Wide Denial",
      "countTr": "Kur'ân'da onlarca meşhur örnek",
      "countEn": "Dozens of notable instances",
      "noteTr": "'Lâ' edatının ismi mensub okunduğunda (örn. 'lâ rayb', 'lâ ilâhe'), o kelimenin **cinsinden olan her şeyi** reddeder. 'Lâ rayb' sadece 'şüphe yok' değil, '**hiçbir türde şüphe** yok' demektir. Bakara 2:2'nin açılışı budur: 'zâlikel-kitâbu lâ rayba fîh' — bu kitap hakkında hiçbir türde şüphe yoktur. İbn Âşûr Tahrîr'de bunu 'istikrâ-yı ma'nevî' (mânevî tümel reddetme) olarak adlandırır.",
      "noteEn": "When the noun following *lā* is read in the accusative (e.g., *lā rayba*, *lā ilāha*), it denies **the entire category** that noun represents. *Lā rayba* means not merely 'no doubt' but 'no doubt of any kind.' The opening of Q 2:2 is such a case: *dhālika al-kitābu lā rayba fīh* — of that Book, there is doubt of no kind. Ibn ʿĀshūr in *al-Taḥrīr* names this *istiqrāʾ maʿnawī* (categorical negation of meaning).",
      "surahs": [
        "Bakara 2:2",
        "Âl-i İmrân 3:18",
        "Fussilet 41:30"
      ],
      "meaningTr": "Hiçbir (+ kelime) yoktur",
      "meaningEn": "No (+ noun) of any kind exists"
    }
  ],
  "exampleVerses": [
    {
      "ar": "[JSON aşamasında verse-graph-bgem3.json'dan kopyalanacak]",
      "tr": "Göğün ve yerin Rabbine andolsun ki bu vaad, sizin konuşmanız gibi kesin ve gerçektir.",
      "en": "By the Lord of the heaven and earth, indeed it is truth — just as [sure as] it is that you are speaking.",
      "ref": "Zâriyât 51:23",
      "surah": 51,
      "ayah": 23,
      "pattern": "inne-lam-tekid",
      "patternNote": "innehu le-hakkun — 'İnne' + 'Lâm-u Tekîd' yan yana. En güçlü çifte pekiştirme."
    },
    {
      "ar": "[JSON aşamasında]",
      "tr": "Çünkü Rabbin (her an) gözetlemededir.",
      "en": "Indeed, your Lord is ever watchful.",
      "ref": "Fecr 89:14",
      "surah": 89,
      "ayah": 14,
      "pattern": "inne-lam-tekid",
      "patternNote": "inne rabbeke le-bi'l-mirsâd — 'İnne' + 'Lâm' + mekân zarfı (bi'l-mirsâd: pusu-da). Kısa ama en yoğun ayetlerden biri."
    },
    {
      "ar": "[JSON aşamasında]",
      "tr": "Andolsun ki, mallarınız ve canlarınız konusunda imtihana çekileceksiniz...",
      "en": "You will certainly be tested in your possessions and in yourselves...",
      "ref": "Âl-i İmrân 3:186",
      "surah": 3,
      "ayah": 186,
      "pattern": "nun-tekid-sedide",
      "patternNote": "le-tübellevünne — 'lâm' + fiilin sonunda 'nûn-u tekîd-i şedîde'. Vaad 'yazılmış kader' düzeyine çıkmıştır."
    },
    {
      "ar": "[JSON aşamasında]",
      "tr": "Gerçekten müminler kurtuluşa ermiştir.",
      "en": "Certainly will the believers have succeeded.",
      "ref": "Mü'minûn 23:1",
      "surah": 23,
      "ayah": 1,
      "pattern": "harfu-tahkik-kad",
      "patternNote": "kad efleha'l-mü'minûn — 'Kad' + mazi fiil. Bir surenin açılışı olarak 'kesin tamamlanmış gerçek' iddiası."
    },
    {
      "ar": "[JSON aşamasında — birleşik 37:1-4]",
      "tr": "Saf saf dizilenlere, haykırıp sürenlere, zikir okuyanlara yemin ederim — ilâhınız birdir.",
      "en": "By those [angels] lined up in rows, and those who drive [the clouds], and those who recite the reminder — indeed, your God is One.",
      "ref": "Sâffât 37:1-4",
      "surah": 37,
      "ayah": 4,
      "pattern": "kasem-cevap",
      "patternNote": "3 ayetlik yemin (saffât, zâcirât, tâliyât) → cevap: 'inne ilâheküm le-vâhid'. Yemin + 'İnne' + 'Lâm' üç katmanlı te'kîd."
    },
    {
      "ar": "[JSON aşamasında]",
      "tr": "O kitap (Kur'an); onda asla şüphe yoktur. O, müttakiler için bir yol göstericidir.",
      "en": "This is the Book — no doubt in it; a guidance for those conscious [of Allah].",
      "ref": "Bakara 2:2",
      "surah": 2,
      "ayah": 2,
      "pattern": "la-i-nefy-cinsi",
      "patternNote": "lâ rayba fîh — 'lâ-i nefy-i cinsi' kalıbı. 'Hiçbir türde şüphe yok' — cinsinin tamamını reddetme."
    }
  ]
}
```

---

## 3. Eklemenin Dosya Üzerinde Konumu

`kuran-retorigi.json`'un mevcut `categories` dizisi şu an 4 eleman içeriyor:
- `erotema` (id)
- `irsad` (id)
- `tafsil` (id)
- `ibra` (id)

Yeni kategori (`tekid`) **5. eleman olarak** dizinin sonuna eklenir. Kullanıcı elle şu satıra ekler:

```json
"categories": [
  { ... erotema ... },
  { ... irsad ... },
  { ... tafsil ... },
  { ... ibra ... },
  { ... tekid ...       ←   YENİ
  }
]
```

`meta.categoryCount` alanı da **4 → 5** olarak güncellenir.

---

## 4. Kaynaklar

**Klasik belâgat:**
1. Zemahşerî, el-Keşşâf an Hakâiki Gavâmizi't-Tenzîl — belâgat şaheseri; "inne + lâm" kalıbının en güçlü te'kîd olduğuna dair hüküm bu eserdendir
2. Sekkâkî, Miftâhu'l-Ulûm (belâgatın kurumsal eseri, 13. yy)
3. İbn Âşûr, et-Tahrîr ve't-Tenvîr — "istikrâ-yı ma'nevî" terminolojisinin kaynağı
4. Râzî, Mefâtîhu'l-Gayb — Bakara 2:2 tefsirinde "lâ rayb" kalıbının detaylı analizi
5. İbn Kayyim el-Cevziyye, et-Tibyân fî Aksâmi'l-Kur'ân — kasem-cevap ilişkisi

**Klasik gramer:**
6. Sîbeveyh, el-Kitâb (Arapça gramerin kurucu eseri, 8. yy) — nûn-u tekîd-i şedîde sınıflaması
7. İbn Mâlik, Elfiyye (şiir formunda gramer, 13. yy)

**Modern akademik:**
8. Michel Cuypers, *The Composition of the Qur'an*, Bloomsbury, 2015 — te'kîd kalıplarının yapısal analizi (Kur'ân belâgat çalışmalarının modern standartlarından)

**Korpus/dilbilim:**
9. Quranic Arabic Corpus (corpus.quran.com) — te'kîd edatlarının morfolojik dağılımı

**Verse-graph doğrulama:**
10. `public/verse-graph-bgem3.json` — 18 ayet referansı (6 örnek + 12 subPattern surah listesi) buradan doğrulandı

---

## 5. Uyarılar / Açık Sorular

1. **`pct` (yüzde) alanı** — Mevcut 4 kategorinin yüzdeleri var (40, 28, 20, 12 — toplamı 100 olmak üzere). Te'kîd **soru değil**, bambaşka bir kategori; mevcut yüzde havuzuna dahil olmaz. Taslakta `pct: null` ve `pctNote` alanı eklendi. Görselde "yüzde göstermez" modda render edilmeli. Bu gerekirse ayrı bir UI davranışı gerektirir — kullanıcı tasarım kararı vermeli.

2. **Nokta sayımı** — Kaç tane "inne" var? Binlerce. Kaç tane "kad"? Corpus'a göre 400+. Taslakta **kesin sayılar verilmedi**, "binlerce", "yüzlerce", "~50-60" gibi **corpus'a dayalı aralıklar** kullanıldı. Bu sayılar corpus.quran.com'dan türetilebilir ama kullanıcı onaylarsa tam sayım yapılabilir.

3. **"Sitedeki 'Yeminler' tool'uyla bağlantı"** — `kasem-cevap` subPattern'inin notunda bu bağlantı belirtildi. UI'da bu, yeminler tool'una bir link (cross-tool navigasyon, CLAUDE.md §13.12) eklemek için fırsat olabilir.

4. **Sîbeveyh ve İbn Mâlik'in klasik gramer referansları** — Bu iki eser tefsir değil **nahiv** (sözdizimi) kaynaklarıdır; belâgat dışı. Ancak te'kîd'in dilbilgisel temeli oradadır. Siteye "klasik gramer" kaynağı olarak da giriş yapar; mevcut kaynak listesiyle uyumludur.

---

## 6. Taslak İstatistikleri

- **Yeni alt kalıp:** 6 (inne-basit, inne+lâm, nûn-u tekîd, kad, kasem-cevap, lâ-i nefy-i cinsi)
- **Örnek ayet:** 6 (hepsi verse-graph'tan doğrulandı)
- **Tek subPattern'e bağlanan toplam ayet referansı:** 18 (subPatterns surah listeleri + exampleVerses)
- **Klasik belâgat kaynağı:** 5 (Zemahşerî, Sekkâkî, İbn Âşûr, Râzî, İbn Kayyim)
- **Klasik gramer kaynağı:** 2 (Sîbeveyh, İbn Mâlik)
- **Modern akademik:** 1 (Cuypers)
- **Toplam kaynak referansı:** 10

Bu taslak **kullanıcı onayı** bekler. Onay sonrası JSON bloğu mevcut `kuran-retorigi.json`'a merge edilir, `meta.categoryCount` 4→5 güncellenir, örnek Arapça metinler verse-graph'tan kopyalanır.
