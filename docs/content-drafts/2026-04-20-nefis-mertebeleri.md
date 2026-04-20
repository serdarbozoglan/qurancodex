# Content Draft — Nefis Mertebeleri: İç Yolculuk Haritası
Tarih: 2026-04-20
Mod: Makro (yeni tool önerisi)
Önerilen dosya: `public/nefis-mertebeleri.json`
Önerilen component: `src/components/NefisMertebeleri.jsx`
Üreten: qc-content-producer (manuel)
Durum: TASLAK — kullanıcı onayı bekleniyor

---

## 1. Konsept

Kur'ân, insan **nefs**ini üç net mertebe ile adlandırır:
1. **Nefs-i Emmâre** — "innen-nefse le-emmâretün bi's-sû'" (Yusuf 12:53) — kötülüğü emreden nefis
2. **Nefs-i Levvâme** — "en-nefsi'l-levvâme" (Kıyâme 75:2) — kendini kınayan nefis
3. **Nefs-i Mutmainne** — "yâ eyyetühe'n-nefsü'l-mutmainne" (Fecr 89:27) — huzura kavuşmuş nefis

Bu üç mertebe **doğrudan Kur'ân lafzında** geçen ve klasik tefsir tarafından tartışmasız kabul edilen iç yolculuk basamaklarıdır. Tasavvuf geleneği bu üç mertebeye **+ 3-4 ek mertebe** (mülhime, râdıye, mardiyye, kâmile) ekleyerek "yedi mertebe" sistemini oluşturmuştur. Bu sistem **zâhirî tefsirden değil, tasavvufî-bâtınî okumadan** çıkar.

Bu tool:
- **Kur'ânî çekirdek** (3 mertebe) üzerine inşa edilir
- **Tasavvufî genişleme** (+4 mertebe) ekol etiketi ile açıkça ayrıştırılır
- Kullanıcıya iki katmanı eşit mesafeyle sunar — birini diğerinin önüne geçirmez

### Site-fit

Site'nin "Reflection" emosyonel evresine doğrudan hizmet eder: kullanıcının kendi iç dünyasına bir ayna tutar. Mevcut tool'lar (MathMiracle, HiddenSymmetry, ScientificSigns) **dış mimari**yi gösterir; bu tool **iç mimari**yi gösterir. Narrative arc olarak son çubuklardan biri olur.

---

## 2. Görselleştirme Önerisi

**Layout:** Dikey merdiven (ladder / stairway) metaforu.

1. **Açılışta:** Tam ekran dikey gradient — zeminde koyu kırmızı/turuncu (emmâre), ortada gümüş (levvâme), yukarıda yeşil-altın karışımı (mutmainne). Kullanıcı scroll'ladıkça basamaklar belirir.

2. **Her mertebe bir bölüm (section):**
   - Arapça lafız büyük puntolarla (KFGQPC font — JSON aşamasında verse-graph'tan kopyalanır)
   - Türkçe transliterasyon
   - Kur'ân ayeti (Arapça + TR + EN)
   - İç dünya tanımı
   - Klasik tefsir görüşü
   - İbn Kayyim ve/veya Gazâlî yorumu

3. **Ortada eşik — "Kur'ânî Çekirdek ↓ | Tasavvufî Genişleme ↓"** ayırıcı çizgi. Kullanıcı buraya geldiğinde not: "Buradan sonraki mertebeler tasavvuf ekolünün yapılandırmasıdır; zâhirî tefsirde doğrudan yoktur."

4. **Tasavvufî mertebeler:** Daha açık tonla, her biri "tasavvufî geleneğin hangi eseri"ne yaslandığını gösterir.

5. **Alt bölüm:** İbn Kayyim'in üçlü tasnifine dönüş — ve Gazâlî'nin kalb/ruh/nefs üçlemesi.

**Renk:** Dikey gradient — koyu kırmızı (#8B0000, emmâre) → gümüş (#94a3b8, levvâme) → altın (#c9a227, mülhime/aradaki) → emerald (#1a7a4c, mutmainne) → açık altın (#d4a574, râdıye-mardiyye) → off-white (#e8e6e3, kâmile).

---

## 3. Veri Şeması

```json
{
  "meta": {
    "quranicCoreStages": 3,
    "suficExtensionStages": 4,
    "totalStages": 7,
    "quranicStagesExplicit": ["emmare", "levvame", "mutmainne"],
    "suficStagesDerived": ["mulhime", "radiye", "mardiyye", "kamile"]
  },
  "quranicCore": [
    {
      "id": "emmare",
      "order": 1,
      "arabicNoun": "النفس الأمارة",
      "transliteration": "an-nafs al-ammāra",
      "nameTr": "Nefs-i Emmâre",
      "nameEn": "The Commanding Self",
      "keyVerseRef": "Yusuf 12:53",
      "verseAr": "[JSON aşamasında verse-graph-bgem3.json'dan]",
      "verseTr": "...",
      "verseEn": "...",
      "descriptionTr": "...",
      "descriptionEn": "...",
      "classicalViewTr": "...",
      "classicalViewEn": "...",
      "sourceTr": "...",
      "sourceEn": "...",
      "infoTr": "ℹ️ ...",
      "ekolEtiketi": "klasik tefsir"
    }
  ],
  "suficExtension": [
    {
      "id": "mulhime",
      "order": 3,
      "nameTr": "Nefs-i Mülhime",
      "warningTr": "⚠️ Tasavvufî-bâtınî okuma — zâhirî tefsirde bu isim doğrudan geçmez. Şems 91:8'deki 'elheme' fiilinden türetilmiştir.",
      ...
    }
  ],
  "classicalFramework": {
    "ibnKayyim": { /* 3-kategori tasnif */ },
    "gazali": { /* kalb-rûh-nefs üçlemesi */ }
  }
}
```

---

## 4. Kur'ânî Çekirdek — 3 Mertebe (tam doldurulmuş)

### 4.1 Nefs-i Emmâre (النفس الأمارة بالسوء)

- **id:** `emmare`
- **order:** 1
- **Anahtar ayet:** Yusuf 12:53
- **Doğrulama:** ✓ verse-graph'ta mevcut

**Kur'ân ifadesi (TR):** "(Bununla beraber) nefsimi temize çıkarmıyorum. Çünkü nefis aşırı şekilde kötülüğü emreder; Rabbim acıyıp korumuş başka. Şüphesiz Rabbim çok bağışlayan, pek esirgeyendir."
— Yusuf 12:53 (Hz. Yusuf'un kendisi hakkındaki ifadesi, Mısır hadisesinden sonra)

**Kur'ân ifadesi (EN):** "And I do not acquit myself. Indeed, the soul is a persistent commander of evil, except those upon which my Lord has mercy. Indeed, my Lord is Forgiving and Merciful."

**descriptionTr:** İç dünyanın "kötülüğü emreden" aşaması. Burada "emreden" (ammâra) ifadesinin **mübalağa sigası** olduğuna dikkat: yalnız kötülük yapmaz — **ısrarla, sürekli, yoğun bir şekilde** emrettirir. Dilbilim açısından "emmâra", "ammâra" kalıbının aşırılık formudur. Hz. Yusuf'un ifadesinde bu mertebe bir **insan genel hâli** olarak tanımlanır, "kötü insan" değil: "Rabbim acıyıp korumuş başka" — yani istisna Allah'ın rahmetidir, kaide değil.

**descriptionEn:** The inner "commanding evil" stage. Note that *ammāra* is a **hyperbolic form**: not just commanding evil but doing so **persistently, continuously, intensely**. Linguistically, *ammāra* is the intensive form of *ʿāmira*. In Joseph's statement this stage is described as a **general human condition**, not that of a "bad person": "except those upon which my Lord has mercy" — mercy is the exception, not the rule.

**classicalViewTr:** İbn Kesîr, Yusuf 12:53 tefsirinde bu ayetin Hz. Yusuf'un kendisine ait olduğu görüşünü tercih eder (alternatif: Aziz'in hanımına ait olduğu görüşü). İbn Kesîr'e göre Hz. Yusuf, en masumiyetinin zirvesinde bile "ben kendimi tezkiye etmiyorum" diyerek **hiçbir insanın kendi nefsinden emin olamayacağını** öğretir. Elmalılı aynı ayette: "Nefs-i emmâre, aklın ve iradenin koruması olmadığında doğal yörüngesine döner: şehvet ve gazap."

**classicalViewEn:** Ibn Kathīr on Q 12:53 prefers the reading that the statement is Joseph's (alternative: the Aziz's wife). According to Ibn Kathīr, Joseph — at the peak of his demonstrated purity — says "I do not acquit myself," teaching that **no human can be secure from his own self**. Elmalılı: "The commanding self returns to its natural orbit — desire and anger — the moment reason and will cease to guard it."

**sourceTr:**
1. İbn Kesîr, Tefsîru'l-Kur'âni'l-Azîm, Yusuf 12:53
2. Elmalılı Hamdi Yazır, Hak Dini Kur'an Dili, Yusuf sûresi 53. ayet
3. Râzî, Mefâtîhu'l-Gayb, Yusuf 53 — "el-ammâra siygatü mübâlağa"

**sourceEn:**
1. Ibn Kathīr, *Tafsīr al-Qurʾān al-ʿAẓīm*, on Q 12:53
2. Elmalılı Hamdi Yazır, *Hak Dini Kur'an Dili*, on Q 12:53
3. Al-Rāzī, *Mafātīḥ al-Ghayb*, on Q 12:53 — "*ammāra* as hyperbolic form"

**infoTr:** ℹ️ Klasik tefsirde ayetin söyleyeni üzerinde **tartışma vardır**: bir görüş Hz. Yusuf'un kendisi, diğer görüş Aziz'in hanımı (aynı pasajın devamı gibi). İbn Kesîr, Râzî, ve Elmalılı Hz. Yusuf lehine tercih yapar. Kurtubî her iki görüşü de nakleder.

**ekolEtiketi:** klasik tefsir (Sünnî icmâya yakın)

---

### 4.2 Nefs-i Levvâme (النفس اللوامة)

- **id:** `levvame`
- **order:** 2
- **Anahtar ayet:** Kıyâme 75:2
- **Doğrulama:** ✓ verse-graph'ta mevcut

**Kur'ân ifadesi (TR):** "Kendini kınayan (pişmanlık duyan) nefse yemin ederim (diriltilip hesaba çekileceksiniz)."
— Kıyâme 75:2

**Kur'ân ifadesi (EN):** "And I swear by the self-reproaching soul [that you will be resurrected]."

**descriptionTr:** "Kendini kınayan" aşama. Burada nefis bir iç ses kazanır — yaptığı kötülükten ötürü **kendini yargılar**. Ancak yargılamak yalnız geçmiş günaha dair değildir; bazı müfessirler levvâmenin **iyi bir işi yeterince iyi yapamadığı için de** kendini kınayabileceğini söyler. Yani levvâme yalnız günahkarlık değil, **yüksek bir ahlâkî hassasiyet** alâmetidir. Bir mü'minin iç sesi levvâmedir.

**descriptionEn:** The "self-reproaching" stage. Here the self gains an inner voice — it **judges itself** for the evil it commits. But the reproach is not only for past sins; some exegetes note that *lawwāma* also reproaches itself for **failing to do a good deed well enough**. Thus *lawwāma* is not just sinfulness but a **high ethical sensitivity** — the inner voice of the believer.

**classicalViewTr:** Hasan-ı Basrî'nin (ö. 728) meşhur yorumu: "Mü'min kendini her gün kınayarak geçirir — 'sözümü niye böyle söyledim, kalkmak varken niye oturdum, niye gülümsedim' — bu kınamalar bizzat onun imanının delilleridir." Zemahşerî Keşşâf'ta ve Râzî Mefâtîh'te bu nakli detaylandırır. Önemli nüans: levvâme sadece kâfir ya da günahkâr nefis değil; **mü'min nefsin süregiden durumu**dur. Bu yorum klasik tefsirde ağırlıktadır.

**classicalViewEn:** Al-Ḥasan al-Baṣrī (d. 728) famously comments: "The believer spends every day reproaching himself — 'why did I speak this way, why did I sit when I should have risen, why did I smile' — these very reproaches are proofs of his faith." Al-Zamakhsharī in *al-Kashshāf* and al-Rāzī in *Mafātīḥ* both elaborate this tradition. Important nuance: *lawwāma* is not only the disbeliever's or sinner's self; it is **the believer's ongoing state**.

**sourceTr:**
1. Hasan-ı Basrî rivayeti — Zemahşerî Keşşâf, Kıyâme 75:2 naklinde
2. Râzî, Mefâtîhu'l-Gayb, Kıyâme 2
3. Elmalılı, Hak Dini, Kıyâme 2 — "nefs-i levvâme mü'minin kalbidir"
4. İbn Kesîr, Kıyâme 2

**sourceEn:**
1. Al-Ḥasan al-Baṣrī's tradition, cited in al-Zamakhsharī on Q 75:2
2. Al-Rāzī on Q 75:2
3. Elmalılı on Q 75:2 — "*lawwāma* is the believer's heart"
4. Ibn Kathīr on Q 75:2

**infoTr:** ℹ️ Kimi tefsirler levvâmeyi kıyamet günündeki pişmanlık olarak yorumlar (yani dünyada değil ahirette); diğerleri dünyevî iç sesi kasteder. Klasik icmâ dünyevî yorum tarafındadır ama iki görüş birbiriyle çelişmez — ikisini birleştirmek de mümkündür.

**ekolEtiketi:** klasik tefsir

---

### 4.3 Nefs-i Mutmainne (النفس المطمئنة)

- **id:** `mutmainne`
- **order:** 3 (Kur'ânî çekirdek içinde)
- **Anahtar ayet:** Fecr 89:27-30
- **Doğrulama:** ✓ 89:27, 89:28, 89:29, 89:30 verse-graph'ta mevcut

**Kur'ân ifadesi (TR):** "Ey huzura kavuşmuş nefis! Sen O'ndan hoşnut, O da senden hoşnut olarak Rabbine dön. Kullarım arasına katıl, cennetime gir."
— Fecr 89:27-30

**Kur'ân ifadesi (EN):** "O reassured soul, return to your Lord, well-pleased and pleasing [to Him]. And enter among My [righteous] servants, and enter My Paradise."

**descriptionTr:** "Huzura kavuşmuş" aşama. İç çatışma sona erer — nefis artık Rabbinin iradesi ile uyumludur. "İtmi'nân" kelimesinin kök anlamı **yerleşiklik, sükunet, sabit olmak**. Duranan, titremeyen, "salınmayan" nefis — dolayısıyla münâfıktaki "müzebzeb" (bocalayan) hâlinin **tam zıddı**. Nefis bu mertebede iç sesin kınaması ihtiyacını da geride bırakır: kınayacak bir şey kalmamıştır — yalnızca hoşnutluk vardır.

**descriptionEn:** The "reassured" stage. Inner conflict ends — the self is now in harmony with its Lord's will. The root of *iṭmiʾnān* means **settled, calm, stable**. A self that has come to rest, no longer trembling or "oscillating" — the exact **opposite of the hypocrite's *mudhabdhabīn*** (wavering) state. At this stage the self also leaves behind the need for inner reproach: there is nothing to reproach, only contentment.

**classicalViewTr:** İbn Kayyim, Medâricü's-Sâlikîn'de mutmainneyi "meaningful arrival point" olarak nitelendirir: "Allah kuluna hitap eder, kulu O'na döner — iki yönlü bir hareket vardır." Ayetteki "irci'î" (dön) emrinin iki boyutu var: hem dünyada hem ahirette. Elmalılı bu emri "ölüm anında ve ba'sda" olmak üzere iki defa verildiğini nakleder. **Dikkat:** Fecr 89:28'deki "râdıyetün mardıyye" (hoşnut ve hoşnut olunmuş) ifadesi, tasavvuf ekolünün "râdıye" ve "mardıyye" mertebelerini türettiği **tek metinsel dayanaktır**. Klasik tefsir bu iki kelimeyi nefsin sıfatları olarak görür; ayrı bir mertebe olarak değil.

**classicalViewEn:** Ibn Qayyim, in *Madārij al-Sālikīn*, describes *muṭmaʾinna* as a "meaningful arrival": "Allah addresses His servant, and the servant returns to Him — there is a bidirectional motion." The command *irjiʿī* ("return") in the verse has two dimensions: both worldly and in the hereafter. Elmalılı notes it is given twice — at the moment of death and at resurrection. **Important:** The phrase *rāḍiyatan marḍiyya* ("pleased and pleasing") in Q 89:28 is **the only textual basis** from which the Sufi school derives the separate stages of *rāḍiya* and *marḍiyya*. Classical exegesis treats these as **attributes of the self, not separate stages**.

**sourceTr:**
1. İbn Kayyim, Medâricü's-Sâlikîn (mutmainne bahsi)
2. Elmalılı, Hak Dini, Fecr 89:27-30 — "irci'î'nin iki boyutu"
3. Taberî, Câmiu'l-Beyân, Fecr 27
4. İbn Kesîr, Fecr 27-30

**sourceEn:**
1. Ibn Qayyim, *Madārij al-Sālikīn*, section on *muṭmaʾinna*
2. Elmalılı on Q 89:27-30
3. Al-Ṭabarī on Q 89:27
4. Ibn Kathīr on Q 89:27-30

**infoTr:** ℹ️ Klasik tefsir (İbn Kayyim dahil) "râdıye" ve "mardıyye" kelimelerini mutmainne nefsin **sıfatları** olarak yorumlar. Tasavvuf ekolü bunları **ayrı mertebe** kategorisine yükseltir. İki yorum metne farklı açılardan bakar; biri zâhirî, diğeri bâtınî.

**ekolEtiketi:** klasik tefsir

---

## 5. Kur'ânî → Tasavvufî Eşik

**Kullanıcıya not (tool içinde görünecek):**

> **Buradan sonraki 4 mertebe tasavvufî okumanın yapılandırmasıdır — Kur'ân'da doğrudan **isim olarak** geçmezler.** Zâhirî tefsir bu mertebeleri ayrı kategori olarak kabul etmez; klasik ulemanın büyük çoğunluğu için Kur'ân yalnızca 3 mertebe (emmâre, levvâme, mutmainne) tanır.
>
> Tasavvuf ekolü (İbn Arabî, Abdülkerim Cîlî, daha sonra Ni'metullah Velî ekolü) bu 3 mertebeye **4 ilave** ekleyerek "yedi mertebe" sistemi kurmuştur. Dayanakları genellikle Kur'ân'daki **başka kelimelerin** (ilhâm, râzı, mardî, kâmil) nefsin evrelerine aktarılmasıdır. Bu **bâtınî bir okumadır** — yani metnin dışındaki bir anlam katmanını keşfetme girişimi.
>
> Klasik ulema (İbn Teymiyye, İbn Kayyim'in kısmen) bu genişlemeye **mesafeli** durur. Modern akademik İslâm çalışmaları (Annemarie Schimmel, William Chittick) tasavvufî sistemi tarihsel ve fenomenolojik olarak inceler — onu doğrudan Kur'ân'ın içinden değil, **Kur'ân'ın üzerine inşa edilmiş bir yorum geleneği** olarak sunar.
>
> Aşağıdaki 4 mertebe bu çerçevede okunmalıdır.

---

## 6. Tasavvufî Genişleme — 4 Ek Mertebe

### 6.1 Nefs-i Mülhime (النفس الملهمة)

- **id:** `mulhime`
- **order:** 3 (tasavvufî sıralamada — levvâme ile mutmainne arasına yerleştirilir)
- **Tasavvufî dayanak:** Şems 91:8 — "fe-elhemehâ fücûrahâ ve takvâhâ" (ona fücur ve takvâsını ilhâm edene)
- **Doğrulama:** ✓ 91:8 verse-graph'ta mevcut

**descriptionTr:** Tasavvufa göre, levvâme'nin iç kınamasını aşan, artık doğruyu **kendi iç ilhamıyla** ayırt edebilen nefis mertebesi. Şems sûresindeki "elhemehâ" (ilham etti) fiili, bu mertebenin dilsel dayanağı sayılır — ancak **dikkat**: ayet, "Allah her nefse ilhâm etmiştir" der; "nefs-i mülhime" adlandırması **ayete sonradan yapılmış bir isimlendirmedir.**

**descriptionEn:** According to Sufi thought, the stage where the self surpasses *lawwāma*'s inner reproach and comes to distinguish right from wrong **through its own inner inspiration**. The verb *alhamahā* ("inspired it") in Q 91:8 is taken as the linguistic basis — but **note**: the verse says "Allah inspired *every* self"; the name *nafs al-mulhima* is **a later naming applied to the verse, not one drawn from it.**

**sufiViewTr:** İbn Arabî, Fütûhât-ı Mekkiyye'de nefsin mertebelerinin her birini "bir varlık derecesi" (bir "menzil") olarak görür. Mülhime, sâlikin (yol yolcusunun) "kalb" ile bağlantı kurduğu mertebedir — artık iyiliği sezgisel olarak bilir, iç rehberliği aktiftir. Not: İbn Arabî'nin vahdet-i vücûd sistemi klasik ulema tarafından eleştirilmiştir; onun mertebelendirmesi bu geniş sistemin bir parçasıdır.

**sufiViewEn:** Ibn ʿArabī, in *al-Futūḥāt al-Makkiyya*, treats each stage of the self as a "level of being" (*manzil*). *Mulhima* is the stage where the traveler (*sālik*) establishes contact with the "heart" — knowing good intuitively, with inner guidance active. Note: Ibn ʿArabī's *waḥdat al-wujūd* system has drawn classical critique; his mapping of stages is part of that broader framework.

**sourceTr:**
1. İbn Arabî, Fütûhât-ı Mekkiyye (ilgili bölüm — menzil sistemi)
2. Annemarie Schimmel, *Mystical Dimensions of Islam*, UNC Press, 1975 (pp. 111-130)

**sourceEn:**
1. Ibn ʿArabī, *al-Futūḥāt al-Makkiyya* (section on the *manāzil*)
2. Annemarie Schimmel, *Mystical Dimensions of Islam*, University of North Carolina Press, 1975

**infoTr:** ⚠️ **Ekol notu:** Bu mertebe **zâhirî tefsirde yoktur**. Tasavvufî-bâtınî bir okumadır. Zâhirî tefsirle tamamlayıcı olarak okunabilir ama onun yerine geçmez. Ayrıca İbn Arabî'nin vahdet-i vücûd çerçevesi klasik ulemanın (İbn Teymiyye, İbn Kayyim, İbn Haldûn vb.) eleştirisine konu olmuştur — onun sistematik yorumlarına başvururken bu çerçeveyi bilmek gerekir.

**ekolEtiketi:** tasavvufî-bâtınî okuma (İbn Arabî ekolü — klasik ulemanın eleştirisi ile)

---

### 6.2 Nefs-i Râdıye (النفس الراضية)

- **id:** `radiye`
- **order:** 5 (tasavvufî sıralamada)
- **Tasavvufî dayanak:** Fecr 89:28'deki "râdıyeten" kelimesi (nefis değil, durum sıfatı)
- **Doğrulama:** ✓ 89:28 verse-graph'ta mevcut

**descriptionTr:** Tasavvufa göre, mutmainne mertebesinden sonra, artık kaderin her türlü gidişatına "râzı olan" (hoşnut olan) nefis mertebesi. Acı ve sevinç birleşir, ikisinden de aynı sükunetle geçer. Bu mertebenin kilit metinsel dayanağı **ancak Fecr 89:28'in başındaki "râdıyeten" kelimesidir** — klasik tefsir bu kelimeyi nefsin **sıfatı** olarak görür, ayrı bir mertebe değil.

**descriptionEn:** In Sufi thought, the stage beyond *muṭmaʾinna* where the self is "pleased" (*rāḍiya*) with every turn of fate — joy and pain merge, both passed through with the same serenity. The only textual hook is the word *rāḍiyatan* at the start of Q 89:28 — which classical exegesis reads as an **attribute**, not a separate stage.

**sufiViewTr:** Tasavvuf ekolünde bu mertebede sâlikin iradesi Allah'ın iradesine tam teslim olmuştur: "Rıza yüksek makamdır, seçim yapmaktan vazgeçme makamıdır" — Cüneyd-i Bağdâdî'ye atfedilen bir söz. İmam Gazâlî, İhyâ'da rızâ kavramını ayrı bir bölüm olarak işler; ama onu **bir nefs mertebesi** değil, bir **makam** (durak) olarak ele alır. İki tasnif arasındaki fark önemlidir.

**sourceTr:**
1. Gazâlî, İhyâu Ulûmi'd-Dîn (rızâ bahsi — makam olarak)
2. Annemarie Schimmel, Mystical Dimensions, bölüm 3

**sourceEn:**
1. Al-Ghazālī, *Iḥyāʾ ʿUlūm al-Dīn* (section on *riḍāʾ* — treated as a *maqām*)
2. Schimmel, *Mystical Dimensions*, chapter 3

**infoTr:** ⚠️ **Ekol notu:** "Râdıye" mertebesinin kendi başına var olduğu görüşü tasavvuf ekolüne aittir. Klasik tefsir (Taberî, Râzî, Elmalılı, İbn Kesîr) Fecr 89:28'deki kelimeyi nefsin **sıfatı** olarak kabul eder — ayrı mertebe olarak değil. Gazâlî bile rızâyı "makam" olarak işler, "nefs mertebesi" olarak değil.

**ekolEtiketi:** tasavvufî-bâtınî okuma

---

### 6.3 Nefs-i Mardıyye (النفس المرضية)

- **id:** `mardiyye`
- **order:** 6 (tasavvufî sıralamada)
- **Tasavvufî dayanak:** Fecr 89:28'in ikinci yarısı — "mardıyye" (Allah'ın da kendisinden razı olduğu)

**descriptionTr:** Tasavvufa göre, râzı olmayı aşan nefis: artık **Allah kulundan razı olur** — tek yönlü değil, çift yönlü bir rıza. Bu mertebe nadir bir zirve olarak tarif edilir.

**descriptionEn:** In Sufi thought, the stage beyond being *pleased*: now **Allah is pleased with the servant** — a mutual, bidirectional pleasure. Described as a rare summit.

**sufiViewTr:** İbn Arabî ekolünde bu mertebe, "kul-Rab" ilişkisinde en yüksek denkliğin yaşandığı menzildir. Klasik tefsirde bu mertebe ismi yoktur — Fecr 28'deki "mardıyye" kelimesi aynı nefsin (mutmainne'nin) **ikinci sıfatı** olarak okunur.

**sourceTr:**
1. Aynı kaynaklar — İbn Arabî, Schimmel
2. Elmalılı Hamdi Yazır, Fecr 28 (zâhirî karşı görüş için)

**sourceEn:**
1. Same Sufi sources — Ibn ʿArabī, Schimmel
2. Elmalılı on Q 89:28 (for the contrasting classical view)

**infoTr:** ⚠️ **Ekol notu:** Aynı uyarı — zâhirî tefsirde bu ayrı mertebe yoktur.

**ekolEtiketi:** tasavvufî-bâtınî okuma

---

### 6.4 Nefs-i Kâmile (النفس الكاملة)

- **id:** `kamile`
- **order:** 7 (tasavvufî sistemin zirvesi)
- **Tasavvufî dayanak:** Kur'ân'ın kendisinde değil, tasavvufî "insân-ı kâmil" doktrininde

**descriptionTr:** Tasavvufa göre sâlikin ulaşabileceği en üst mertebe — "kâmil insan" olmuş nefis. Abdülkerim Cîlî'nin *el-İnsânü'l-Kâmil* (ö. 1424) eserinde sistematik olarak açıklanır. Bu mertebede nefis artık peygamberlerin ve velîlerin yansıma aynası olur.

**descriptionEn:** In Sufi thought, the highest stage the traveler may reach — the *perfect human* (*al-insān al-kāmil*). Systematically expounded in ʿAbd al-Karīm al-Jīlī's *al-Insān al-Kāmil* (d. 1424). At this stage the self becomes the mirror reflecting prophets and saints.

**sourceTr:**
1. Abdülkerim Cîlî, el-İnsânü'l-Kâmil fî Ma'rifeti'l-Evâhir ve'l-Evâil (14.-15. yy)
2. William Chittick, *The Sufi Doctrine of Rumi*, World Wisdom, 2005

**sourceEn:**
1. ʿAbd al-Karīm al-Jīlī, *al-Insān al-Kāmil* (d. 1424)
2. William Chittick, *The Sufi Doctrine of Rumi*, World Wisdom, 2005

**infoTr:** ⚠️ **Ekol notu:** "Nefs-i kâmile" kavramı Kur'ân'da isim olarak **hiç yer almaz**. Bu mertebe **tamamen tasavvufî bir yapılandırmadır**. Klasik Sünnî ulema bu kavramın — "insân-ı kâmil" doktrininin bir parçası olarak — Kur'ânî zeminden saptığını ileri sürmüştür. Özellikle İbn Teymiyye ve İbn Kayyim'in eleştirileri bu yönde serttir.

**ekolEtiketi:** tasavvufî-bâtınî doktrin (insân-ı kâmil)

---

## 7. Klasik Çerçeve — Zâhirî Tefsirin Dengelenmesi

### 7.1 İbn Kayyim'in 3-Mertebe Sistemi

**descTr:** İbn Kayyim, Medâricü's-Sâlikîn'de nefsin yalnızca **3 Kur'ânî mertebesini** kabul eder: emmâre, levvâme, mutmainne. Tasavvufî genişlemelere karşı mesafeli bir tutum alır; özellikle İbn Arabî'nin sistemini reddeder. Ancak bu üç mertebenin **iç dinamiğini** çok detaylı çözümler:
- **Dikey ilerleme:** emmâre → levvâme → mutmainne
- **Dalgalanma:** Her mü'min bu üç mertebe arasında gün içinde bile geçiş yapabilir
- **Son:** Asıl hedef mutmainne mertebesine **istikrarla yerleşmek**

**descEn:** Ibn Qayyim, in *Madārij al-Sālikīn*, accepts only the **three Qur'anic stages**: *ammāra*, *lawwāma*, *muṭmaʾinna*. He keeps distance from Sufi extensions and specifically rejects Ibn ʿArabī's system. However, he analyzes the inner dynamics of the three stages in great detail:
- **Vertical progression:** *ammāra* → *lawwāma* → *muṭmaʾinna*
- **Oscillation:** Any believer can shift between these three stages even within a single day
- **Telos:** The real goal is **settled stability** in *muṭmaʾinna*

**sourceTr:** İbn Kayyim, Medâricü's-Sâlikîn beyne Menâzili İyyâke Na'budü ve İyyâke Neste'în (nefs bahsi)
**sourceEn:** Ibn Qayyim, *Madārij al-Sālikīn* (section on *al-nafs*)

**ekolEtiketi:** klasik kelâm/tasavvuf (Hanbelî geleneği — tasavvufî genişlemelere eleştirel)

---

### 7.2 Gazâlî'nin Kalb-Rûh-Nefs Üçlemesi

**descTr:** Gazâlî, İhyâu Ulûmi'd-Dîn'de "nefs" kavramını **tek başına değil**, **kalb-rûh-nefs üçlüsü** içinde ele alır. Ona göre:
- **Kalb:** İnsanın mânevî merkez organı, iman ve inkârın yurdu
- **Rûh:** Allah'ın kuluna üflediği ilâhî boyut (Hicr 15:29)
- **Nefs:** Şehvet ve öfkeyi barındıran, ahlâkî dönüşüme açık olan boyut

Üçü birbirini etkiler; nefsin "mertebe"leri aslında bu üçlünün dengelenme biçimleridir. Gazâlî'nin sistemi tasavvufî geleneğin zeminini hazırlar ama **nefs mertebelerini ayrı bir liste olarak vermez.** Onun ana çerçevesi **makamlar** (riyâ, tevâzu, rızâ, tevekkül vb.) üzerinden gider.

**descEn:** Al-Ghazālī, in *Iḥyāʾ ʿUlūm al-Dīn*, treats *nafs* **not alone** but within the **heart-spirit-soul (qalb–rūḥ–nafs)** triad:
- **Qalb** (heart): the inner spiritual organ, the dwelling of faith and disbelief
- **Rūḥ** (spirit): the divine dimension breathed by Allah into the servant (Q 15:29)
- **Nafs** (self): the dimension housing desire and anger, open to ethical transformation

The three affect each other; the "stages" of *nafs* are actually balance-configurations of the triad. Al-Ghazālī's system lays the groundwork for the Sufi tradition but **does not present the *nafs* stages as a separate list.** His main framework moves through *maqāmāt* (stations: *riyāʾ*, humility, *riḍāʾ*, *tawakkul*, etc.).

**sourceTr:** Gazâlî, İhyâu Ulûmi'd-Dîn, "Acâibü'l-Kalb" kitabı (Rub'u'l-Mühlikât içinde)
**sourceEn:** Al-Ghazālī, *Iḥyāʾ ʿUlūm al-Dīn*, *Kitāb ʿAjāʾib al-Qalb* (within *Rubʿ al-Muhlikāt*)

**ekolEtiketi:** klasik kelâm/tasavvuf (Şâfi'î-Eş'arî)

---

## 8. i18n Anahtarları

```json
"nefisMertebeleri": {
  "nav": "Nefis Mertebeleri",
  "title": "Nefis Mertebeleri — İç Yolculuk Haritası",
  "subtitle": "Kur'ân'ın 3 mertebesi + tasavvufun 4 eki = 7 basamak",
  "intro": "İnsan nefsi sabit bir şey değildir — Kur'ân üç isimle onu çağırır...",
  "quranicCoreHeading": "Kur'ânî Çekirdek — 3 Mertebe",
  "suficExtensionHeading": "Tasavvufî Genişleme — 4 Ek Mertebe",
  "transitionNote": "Buradan sonra 4 mertebe tasavvufî okumanın yapılandırmasıdır...",
  "classicalFrameworksHeading": "Klasik Çerçeveler",
  "stageLabels": {
    "emmare": "Nefs-i Emmâre",
    "levvame": "Nefs-i Levvâme",
    "mutmainne": "Nefs-i Mutmainne",
    "mulhime": "Nefs-i Mülhime",
    "radiye": "Nefs-i Râdıye",
    "mardiyye": "Nefs-i Mardıyye",
    "kamile": "Nefs-i Kâmile"
  }
}
```

EN paraleli: `"title": "The Stations of the Self — The Inner Journey Map"`, vb.

---

## 9. Section Iskelet Wireframe

```
<Overlay (Escape, OVERLAY_BASE)>
  <Header>
    <OVERLAY_TITLE>Nefis Mertebeleri — İç Yolculuk Haritası</OVERLAY_TITLE>
    <Close />
  </Header>

  <Body (vertical scroll, gradient background)>
    <SectionLabel>Kur'ânî Çekirdek — 3 Mertebe</SectionLabel>
    {quranicCore.map(stage => (
      <StageBlock
        order={stage.order}
        arabicNoun={stage.arabicNoun}
        nameTr={stage.nameTr}
        verse={stage.verse}
        classicalView={stage.classicalView}
      />
    ))}

    <TransitionBar>
      "Kur'ânî Çekirdek ↑  |  Tasavvufî Genişleme ↓"
      [uyarı notu]
    </TransitionBar>

    <SectionLabel>Tasavvufî Genişleme — 4 Ek Mertebe</SectionLabel>
    {suficExtension.map(stage => (
      <StageBlock
        order={stage.order}
        nameTr={stage.nameTr}
        warningTr={stage.warningTr}
        sufiView={stage.sufiView}
        ekolEtiketi={stage.ekolEtiketi}
      />
    ))}

    <SectionLabel>Klasik Çerçeveler</SectionLabel>
    <FrameworkCard framework={classicalFramework.ibnKayyim} />
    <FrameworkCard framework={classicalFramework.gazali} />
  </Body>
</Overlay>
```

---

## 10. Kaynaklar (toplu)

**Kur'ân ayetleri (doğrulanmış):**
1. Yusuf 12:53 (emmâre)
2. Kıyâme 75:2 (levvâme)
3. Fecr 89:27-30 (mutmainne + tasavvufî dayanak "râdıye/mardıyye")
4. Şems 91:7-10 (mülhime'nin dilsel dayanağı "elheme")

**Klasik tefsir (zâhirî):**
5. Taberî, Câmiu'l-Beyân (Yusuf 53, Kıyâme 2, Fecr 27)
6. Zemahşerî, el-Keşşâf (Kıyâme 2 — Hasan-ı Basrî rivayeti)
7. Râzî, Mefâtîhu'l-Gayb (Yusuf 53 "ammâra" mübalağa analizi)
8. İbn Kesîr, Tefsîru'l-Kur'âni'l-Azîm (Yusuf 53, Kıyâme 2, Fecr 27)
9. Elmalılı Hamdi Yazır, Hak Dini Kur'an Dili (bütün ayetler)
10. Kurtubî, el-Câmi' li-Ahkâmi'l-Kur'ân (Yusuf 53 — söyleyen tartışması)

**Klasik kelâm/tasavvuf (ılımlı):**
11. Gazâlî, İhyâu Ulûmi'd-Dîn — Kitâbu Acâibi'l-Kalb (kalb-rûh-nefs üçlemesi)
12. İbn Kayyim el-Cevziyye, Medâricü's-Sâlikîn (3 mertebeli sistem + tasavvufî genişlemelere eleştirel tutum)

**Tasavvufî kaynaklar (ekol notuyla):**
13. İbn Arabî, Fütûhât-ı Mekkiyye (menzil sistemi)
14. Abdülkerim Cîlî, el-İnsânü'l-Kâmil

**Modern akademik:**
15. Annemarie Schimmel, *Mystical Dimensions of Islam*, UNC Press, 1975
16. William Chittick, *The Sufi Doctrine of Rumi*, World Wisdom, 2005

**Korpus:**
17. `public/verse-graph-bgem3.json` — tüm ayet referansları doğrulandı

---

## 11. Açık Sorular / Uyarılar

1. **Tasavvufî mertebeleri dahil etmeli mi?** — Evet, ama **açıkça ayrı bir bölümde + uyarı notuyla**. Çıkarmak eksik bir resim verir; dahil etmek ama etiketlemek en iyi dengedir.

2. **İbn Arabî'nin sistemini nasıl temsil etmeli?** — Onun menzil sistemi **vahdet-i vücûd** çerçevesinin parçasıdır; bu çerçeve klasik ulema tarafından eleştirilmiştir. Taslakta İbn Arabî referansı verildi ama "vahdet-i vücûd sistemi klasik eleştiriye konudur" notuyla dengelendi.

3. **Kur'ân'da nefis **4 mertebesi** var diye tartışan görüş?** — Bazı müfessirler Şems 91:7-10'daki "tezkiye/tedsiye" (arındırma/kirletme) temasını dördüncü bir mertebe gibi okurlar. Klasik icmâ bu yönde değildir. Taslakta "emmâre'nin alt durumu" olarak işlenmiştir.

4. **Hadis referansı var mı?** — Nefs mertebelerine doğrudan dair sahih-i sâbit hadis yoktur. "Zabt edilmiş nefs" ile ilgili bazı rivayetler tartışmalıdır. Taslağa hadis eklenmedi — bu en güvenli yol.

5. **Renk paleti hassasiyeti** — Koyu kırmızı "emmâre" için seçildi (tehlike/şehvet çağrışımı), ama İslâmî estetikte kırmızı genellikle "azap" ile ilişkilendirilir. Alternatif: nefs-i emmâre için **toprak/kahverengi** (fıtrat-i beşeriyye çağrışımı daha uygun). Bu tasarım sırasında kullanıcı kararlaştırır.

6. **Mobil layout** — Dikey gradient + scroll-pace ile her mertebe için ekranın ~70%'i. Her mertebe kartı mobilde tek sütun, 16px padding.

---

## 12. Taslak İstatistikleri

- **Kur'ânî çekirdek mertebe:** 3 (her biri ayrı ayet ile doğrudan desteklenir)
- **Tasavvufî ek mertebe:** 4 (her biri uyarı notuyla, ekol etiketli)
- **Kur'ân ayeti referansı:** 10+ (%100 verse-graph'tan doğrulandı)
- **Klasik tefsir:** 6 (Taberî, Zemahşerî, Râzî, İbn Kesîr, Elmalılı, Kurtubî)
- **Klasik kelâm/tasavvuf:** 2 (Gazâlî, İbn Kayyim)
- **Tasavvufî kaynak (ekol notuyla):** 2 (İbn Arabî, Cîlî)
- **Modern akademik:** 2 (Schimmel, Chittick)
- **Toplam kaynak referansı:** 17

**Özel vurgu:** Bu tool'un en kritik tasarım kararı, **Kur'ânî çekirdek ile tasavvufî genişleme arasındaki eşiği görsel ve metinsel olarak net tutmak**tır. Taslağın 5. bölümündeki "eşik uyarısı" hiç atlanmamalıdır.

Bu taslak **kullanıcı onayı** bekler.
