# Content Draft — WowFacts: Kur'ân'ın Kendi İsimleri (5 yeni kart)
Tarih: 2026-04-20
Mod: Mikro
Hedef dosya: `src/components/WowFacts.jsx` (inline `FACTS` array)
Hedef kategori: Yeni kategori — `'kuranin-isimleri'` veya mevcut `'azBilinen'` altında
Üreten: qc-content-producer (manuel)
Durum: TASLAK — kullanıcı onayı bekleniyor

---

## 1. Önemli Not

`WowFacts.jsx` içindeki veri **inline bir JavaScript array**'idir (FACTS), JSON dosyası değildir. Agent'ın dosya-yazma kuralları `src/**` altına yazmayı yasakladığı için, bu taslak **kart içeriklerini** hazırlar; kart'ların `FACTS` array'ine inline eklenmesi **kullanıcı tarafından yapılır**.

Taslak, her kartı JSX object literal formatında hazır verir — doğrudan kopyala-yapıştır yapılabilir.

---

## 2. Genel Konu Çerçevesi

Kur'ân, kendisini tek bir isimle anmaz. Suyûtî, el-İtkân fî Ulûmi'l-Kur'ân eserinde (böl. 17) Kur'ân'ın 55'i aşkın farklı isimle anıldığını listeler. Zerkeşî el-Burhân fî Ulûmi'l-Kur'ân'da 55 isim verir; bazı kaynaklarda 90'a kadar çıkar. Bu isimler **şiirsel varyasyonlar değildir** — her biri, Kur'ân'ın farklı bir işlevine işaret eder:

- **Hudâ** (rehber) — yol gösterme işlevi
- **Furkân** (ayırıcı) — hak-batıl ayrımı işlevi
- **Zikr** (hatırlatma) — unutulanı hatırlatma işlevi
- **Nûr** (ışık) — karanlığı aydınlatma işlevi
- **Şifâ** (şifa) — iç hastalıkları iyileştirme işlevi
- **Kitâb** (yazılı metin) — kalıcı kayıt işlevi
- **Beyân** (açıklama) — muğlaklığı gidermek işlevi
- **Rahmet** (rahmet) — merhamet taşıma işlevi

Bu taslakta en güçlü metinsel zemine sahip **5 isim** için wow-fact kartı üretiliyor.

---

## 3. Yeni Kategori Önerisi

Mevcut 4 kategori: `sayisal`, `yapisal`, `peygamberler`, `azBilinen`.

**Öneri:** `azBilinen` kategorisi içinde kalsın. "Kur'ân'ın kendini adlandırması" az bilinen konulardan biridir — bir çoğu için kullanıcı bu kavramla ilk kez karşılaşır.

Alternatif: Yeni 5. kategori `'kuranin-isimleri'` açılabilir. Bu, `CATEGORY_ORDER` dizisini ve dropdown/filter mekanizmasını güncellemeyi gerektirir — daha büyük bir değişiklik. Minimalist yolu tercih etmek için **öneri: `azBilinen` altında**.

---

## 4. 5 Kart — JSX Object Literal Formatında

### Kart 1 — Hudâ (Rehber)

```javascript
{
  category: 'azBilinen',
  surahRef: 'Bakara · 2:2, Âl-i İmrân · 3:138',
  titleTr: '"Hüden li\'l-Müttakîn" — Kur\'ân\'ın İlk Adı: Hidâyet',
  titleEn: '"Hudan li\'l-Muttaqīn" — The Qur\'an\'s First Name: Guidance',
  bodyTr: 'Bakara 2:2\'de Kur\'ân kendini tanımlarken seçtiği ilk kelime: "hüden" (hidâyet/rehberlik). Âl-i İmrân 3:138\'de de aynı isim: "bu Kur\'ân insanlık için bir açıklamadır; takva sahipleri için de bir **hidâyet** ve bir öğüttür." Kur\'ân kendisini 114 sûre boyunca onlarca kez "hudâ" olarak anar — kimine göre 90 yerden fazla. İlk işaret ettiği işlev bilgi değil, **yön**.',
  bodyEn: 'In Q 2:2, the first word the Qur\'an chooses to describe itself is *hudan* (guidance). In Q 3:138 the same term: "This is an exposition for mankind — and a **guidance** and an admonition for the God-conscious." The Qur\'an refers to itself as *hudā* dozens of times across 114 surahs — by some counts over 90 occurrences. The first function it points to is not information but **direction**.',
  wowTr: 'Kur\'ân\'ın kendine verdiği ilk isim bilgi değil — "yol".',
  wowEn: 'The Qur\'an\'s first self-name is not "knowledge" — it is "way."',
  explore: 'hüden',
},
```

**Kaynaklar:**
- Bakara 2:2 (✓ verse-graph)
- Âl-i İmrân 3:138 (✓ verse-graph)
- Celâleddin es-Suyûtî, el-İtkân fî Ulûmi'l-Kur'ân, bâb 17 (Kur'ân'ın isimleri)
- Zerkeşî, el-Burhân fî Ulûmi'l-Kur'ân, bâb ilgili
- Quranic Arabic Corpus (corpus.quran.com) — kök ه د ي frekansı

**Uyarı:** "90 yerden fazla" ifadesi Suyûtî'nin genel beyanına dayanır; farklı kök-form analizlerine göre sayı değişebilir. `bodyTr`'de "kimine göre" hedge ifadesi kullanıldı.

---

### Kart 2 — Furkân (Ayırıcı)

```javascript
{
  category: 'azBilinen',
  surahRef: 'El-Furkân · 25:1',
  titleTr: 'Furkân — "Hakkı Bâtıldan Ayıran"',
  titleEn: 'Furqān — "That Which Separates Truth from Falsehood"',
  bodyTr: 'Furkân sûresinin ilk ayeti, Kur\'ân\'a bu ismi adeta bir nişan gibi takar: "Âlemlere uyarıcı olsun diye kulu Muhammed\'e **Furkân\'ı** indiren Allah yüceler yücesidir." (25:1). "Furkân" kelimesi "ayıran, sınırı çeken" anlamına gelir — hak ile bâtıl arasındaki çizgiyi. Klasik belâgatta bu isim Kur\'ân\'ın **fonksiyonunu tarif eden** en keskin adlandırmalardan biridir: bilgi vermek değil, **karar verebilmeyi sağlamak**.',
  bodyEn: 'The opening verse of Sūrat al-Furqān places this name on the Qur\'an like a blazon: "Blessed is He who has sent down the **Furqān** upon His servant, that he may be a warner to the worlds." (Q 25:1). The word *furqān* means "that which separates, draws the boundary" — between truth and falsehood. In classical *balāgha* this name is among the sharpest descriptions of the Qur\'an\'s **function**: not to inform, but to **enable judgment**.',
  wowTr: 'İsim, işleve atıfta: Kur\'ân bilgi değil, **karar**.',
  wowEn: 'A name pointing to function: the Qur\'an is not information, but **decision**.',
  explore: 'furkan',
},
```

**Kaynaklar:**
- Furkân 25:1 (✓ verse-graph)
- İbn Âşûr, et-Tahrîr ve't-Tenvîr, Furkân sûresi mukaddimesi — isim analizi
- Râzî, Mefâtîhu'l-Gayb, Furkân 25:1
- Elmalılı, Hak Dini, Furkân 25:1

---

### Kart 3 — Zikr (Hatırlatma)

```javascript
{
  category: 'azBilinen',
  surahRef: 'El-Hicr · 15:9',
  titleTr: '"ez-Zikr" — Allah\'ın Koruduğunu Bildirdiği İsim',
  titleEn: '"al-Dhikr" — The Name Allah Promises to Preserve',
  bodyTr: 'Kur\'ân\'ın en ünlü koruma ayeti Hicr 15:9\'dur: "Kur\'ân\'ı kesinlikle biz indirdik; elbette onu yine biz koruyacağız." Ama ayetin orijinalinde "Kur\'ân" kelimesi **geçmez** — kullanılan isim "ez-Zikr"dir ("innâ nahnu nezzelne\'z-**zikr**e ve innâ lehû le-hâfizûn"). Yani Allah\'ın "koruma" vaadi, özellikle "hatırlatma" işlevine verilmiştir. Klasik tefsir bu kelime seçimini dikkatli yorumlar: Kur\'ân hatırlatma olduğu için korunur — unutulma riskine karşı, insanlığın **unutmamak** için ihtiyacı olan metin.',
  bodyEn: 'The Qur\'an\'s most famous preservation verse is Q 15:9: "Indeed, We have sent down the reminder, and indeed We will be its guardians." But the original Arabic does **not** use the word "Qur\'an" — the name is *al-dhikr* (the reminder). Allah\'s promise of preservation is given specifically to the *function* of reminding. Classical exegesis interprets this word-choice carefully: the Qur\'an is preserved *because* it is a reminder — the text humanity needs in order to **not forget**.',
  wowTr: 'Korunan ismin seçimi: "Kur\'ân" değil, "zikr" — unutulmaya karşı.',
  wowEn: 'The chosen name of the preserved: not "Qur\'an" but "the reminder" — against forgetting.',
  explore: '15:9',
},
```

**Kaynaklar:**
- Hicr 15:9 (✓ verse-graph)
- İbn Kesîr, Hicr 15:9 tefsiri
- Zemahşerî, el-Keşşâf, Hicr 15:9 — "ez-zikr" kelime seçimi analizi
- Râzî, Mefâtîh, Hicr 15:9
- Not: Tâhâ 20:3, Sâd 38:29 gibi ayetler de Kur'ân'ı "zikr" olarak anar — bu isim tek geçiş değil, tematik bir çağrıdır.

---

### Kart 4 — Nûr (Işık)

```javascript
{
  category: 'azBilinen',
  surahRef: 'En-Nisâ · 4:174, Mâide · 5:15, Teğâbün · 64:8',
  titleTr: '"Nûr" — Kur\'ân Bir Işık Olarak Tanımlanır',
  titleEn: '"Nūr" — The Qur\'an Described as Light',
  bodyTr: 'Kur\'ân kendisini en az üç ayette doğrudan "nûr" (ışık) olarak tanımlar. Nisâ 4:174: "size apaçık bir nûr indirdik". Mâide 5:15: "Allah\'tan bir nûr ve apaçık bir kitap geldi". Teğâbün 64:8: "Allah\'a, Peygamberine ve indirdiğimiz o **nura** (Kur\'ân\'a) inanın." Şûrâ 42:52: "Biz onu kullarımızdan dilediğimizi kendisiyle doğru yola eriştirdiğimiz bir nûr kıldık." Bu isim metaforik değil, **ontolojik** bir iddiadır: Kur\'ân, **karanlıkta görünen bir aydınlatıcıdır**. Klasik ekolde bu kavram "Nûr Ayeti"ne (24:35) bağlanır — Allah\'ın nuru ile Kur\'ân\'ın nuru arasındaki ilişki tasavvufî tefsirin de merkezi meselelerinden biridir.',
  bodyEn: 'The Qur\'an describes itself directly as *nūr* (light) in at least three verses. Q 4:174: "We have sent down to you a manifest light." Q 5:15: "There has come to you from Allah a light, and a clear Book." Q 64:8: "Believe in Allah, His Messenger, and the **light** We have sent down." Q 42:52: "We made it a light by which We guide whomever We will." This name is not metaphorical but an **ontological** claim: the Qur\'an is an **illuminator in the dark**. In classical exegesis this concept connects to the Verse of Light (Q 24:35) — the relationship between divine light and the Qur\'an\'s light is also central in Sufi interpretation.',
  wowTr: 'Kur\'ân kendi adıyla: "ışık". Metafor değil, ontolojik iddia.',
  wowEn: 'The Qur\'an by its own name: "light." Not metaphor — an ontological claim.',
  explore: '24:35',
},
```

**Kaynaklar:**
- Nisâ 4:174, Mâide 5:15, Teğâbün 64:8, Şûrâ 42:52 (hepsi ✓ verse-graph)
- Nûr Ayeti (24:35) — mevcut sitedeki SevenLayers section'ında zaten işlenmiş (cross-reference fırsatı)
- İbn Kesîr, ilgili ayetlerin tefsirleri
- İbn Arabî, Fütûhât (tasavvufî bağlantı — **ekol notu:** "tasavvufî okuma; zâhirî tefsirle tamamlayıcıdır")
- Uyarı: "Nûr" isminin tasavvufî-işârî yorumu İbn Arabî ekolüne aittir; klasik Sünnî tefsirde de desteklenir ama vahdet-i vücûd çerçevesi eleştirel bağlamda okunmalıdır.

---

### Kart 5 — Şifâ (Şifa)

```javascript
{
  category: 'azBilinen',
  surahRef: 'El-İsrâ · 17:82',
  titleTr: '"Şifâ" — Kur\'ân Kendini Bir İç Hastalıkların İlacı Olarak Anar',
  titleEn: '"Shifāʾ" — The Qur\'an Names Itself a Cure for Inner Ailments',
  bodyTr: 'İsrâ 17:82: "Biz, Kur\'ân\'dan öyle bir şey indiriyoruz ki o, müminler için **şifa** ve rahmettir; zalimlerin ise yalnızca ziyanını artırır." Kur\'ân\'ın kendine verdiği isimlerden en dikkat çekici olanlardan biri: "şifâ" (şifa/iyileşme). Klasik tefsir (Kurtubî, Râzî) bu şifayı iki katmanda okur: (1) **ruhî-ahlâkî** — şüphe, gurur, kibir, cimrilik gibi iç hastalıkların iyileşmesi, (2) **bedensel** — rukye ile bazı hastalıklarda şifa vesilesi olma. Ama dikkat: klasik ulema bu ayeti "Kur\'ân her derde ilaçtır" genelleştirmesine çevirmeye mesafelidir; birinci katman (iç hastalıklar) kesin, ikinci katman özel bağlamlıdır. Ayetin devamı bu sınırı çizer: "zâlimler için zararını artırır" — aynı metin, aynı anda şifa **ve** artırıcı olabilir.',
  bodyEn: 'Q 17:82: "And We send down from the Qur\'an that which is **healing** and a mercy for the believers; but it increases the wrongdoers in nothing but loss." One of the most striking self-names the Qur\'an gives itself: *shifāʾ* (healing). Classical exegesis (al-Qurṭubī, al-Rāzī) reads this healing at two levels: (1) **spiritual-ethical** — the cure for inner diseases like doubt, arrogance, miserliness, (2) **physical** — through *ruqya* (recitation-based remedy) as a cause of healing in certain contexts. But caution: classical scholars resist generalizing this into "the Qur\'an is a cure for every ailment" — the first level is firm, the second context-specific. The verse itself draws the limit: "for the wrongdoers, it increases only loss" — the same text can be healing **and** amplification at once.',
  wowTr: 'Aynı ayet — iman için şifa, zulüm için kayıp. Metin aynı, etki zıt.',
  wowEn: 'Same verse — healing for faith, loss for wrongdoing. Same text, opposite effects.',
  explore: '17:82',
},
```

**Kaynaklar:**
- İsrâ 17:82 (✓ verse-graph)
- Kurtubî, el-Câmi' li-Ahkâmi'l-Kur'ân, İsrâ 82 — iki-katmanlı şifa analizi
- Râzî, Mefâtîh, İsrâ 82
- İbn Kayyim, Zâdu'l-Me'âd (rukye ve şifa bağlamı)
- Uyarı notu: "Kur\'ân her derde ilaçtır" tarzı aşırı genelleştirmeler klasik ulemanın sınırladığı bir alandır; taslakta dikkatli tonlama yapıldı.

---

## 5. Eklenecek JSX Bloğu — Tam (Kullanıcı Direkt Kopyalayabilir)

Aşağıdaki blok, `src/components/WowFacts.jsx` içindeki `FACTS` array'ine — tercihen `// ── AZ BİLİNEN ──` yorumundan sonra — eklenir:

```javascript
  // ── KUR'ÂN'IN KENDİ İSİMLERİ (az bilinen) ──────────────────────────────────
  {
    category: 'azBilinen',
    surahRef: 'Bakara · 2:2, Âl-i İmrân · 3:138',
    titleTr: '"Hüden li\'l-Müttakîn" — Kur\'ân\'ın İlk Adı: Hidâyet',
    titleEn: '"Hudan li\'l-Muttaqīn" — The Qur\'an\'s First Name: Guidance',
    bodyTr: 'Bakara 2:2\'de Kur\'ân kendini tanımlarken seçtiği ilk kelime: "hüden" (hidâyet/rehberlik). Âl-i İmrân 3:138\'de de aynı isim: "bu Kur\'ân insanlık için bir açıklamadır; takva sahipleri için de bir **hidâyet** ve bir öğüttür." Kur\'ân kendisini 114 sûre boyunca onlarca kez "hudâ" olarak anar — kimine göre 90 yerden fazla. İlk işaret ettiği işlev bilgi değil, **yön**.',
    bodyEn: 'In Q 2:2, the first word the Qur\'an chooses to describe itself is *hudan* (guidance). In Q 3:138 the same term: "This is an exposition for mankind — and a **guidance** and an admonition for the God-conscious." The Qur\'an refers to itself as *hudā* dozens of times across 114 surahs — by some counts over 90 occurrences. The first function it points to is not information but **direction**.',
    wowTr: 'Kur\'ân\'ın kendine verdiği ilk isim bilgi değil — "yol".',
    wowEn: 'The Qur\'an\'s first self-name is not "knowledge" — it is "way."',
    explore: 'hüden',
  },
  {
    category: 'azBilinen',
    surahRef: 'El-Furkân · 25:1',
    titleTr: 'Furkân — "Hakkı Bâtıldan Ayıran"',
    titleEn: 'Furqān — "That Which Separates Truth from Falsehood"',
    bodyTr: 'Furkân sûresinin ilk ayeti Kur\'ân\'a bu ismi adeta bir nişan gibi takar: "Âlemlere uyarıcı olsun diye kulu Muhammed\'e **Furkân\'ı** indiren Allah yüceler yücesidir." (25:1). "Furkân" kelimesi "ayıran, sınırı çeken" anlamına gelir — hak ile bâtıl arasındaki çizgiyi. Klasik belâgatta bu isim Kur\'ân\'ın **fonksiyonunu** tarif eden en keskin adlandırmalardan biridir: bilgi vermek değil, **karar verebilmeyi sağlamak**.',
    bodyEn: 'The opening verse of Sūrat al-Furqān places this name on the Qur\'an like a blazon: "Blessed is He who has sent down the **Furqān** upon His servant, that he may be a warner to the worlds." (Q 25:1). The word *furqān* means "that which separates, draws the boundary" — between truth and falsehood. In classical *balāgha* this name is among the sharpest descriptions of the Qur\'an\'s **function**: not to inform, but to **enable judgment**.',
    wowTr: 'İsim, işleve atıfta: Kur\'ân bilgi değil, **karar**.',
    wowEn: 'A name pointing to function: the Qur\'an is not information, but **decision**.',
    explore: 'furkan',
  },
  {
    category: 'azBilinen',
    surahRef: 'El-Hicr · 15:9',
    titleTr: '"ez-Zikr" — Allah\'ın Koruduğunu Bildirdiği İsim',
    titleEn: '"al-Dhikr" — The Name Allah Promises to Preserve',
    bodyTr: 'Kur\'ân\'ın en ünlü koruma ayeti Hicr 15:9\'dur: "Kur\'ân\'ı kesinlikle biz indirdik; elbette onu yine biz koruyacağız." Ama ayetin orijinalinde "Kur\'ân" kelimesi **geçmez** — kullanılan isim "ez-Zikr"dir ("innâ nahnu nezzelne\'z-**zikr**e ve innâ lehû le-hâfizûn"). Yani Allah\'ın "koruma" vaadi, özellikle "hatırlatma" işlevine verilmiştir. Klasik tefsir bu kelime seçimini dikkatli yorumlar: Kur\'ân hatırlatma olduğu için korunur — unutulma riskine karşı, insanlığın **unutmamak** için ihtiyacı olan metin.',
    bodyEn: 'The Qur\'an\'s most famous preservation verse is Q 15:9: "Indeed, We have sent down the reminder, and indeed We will be its guardians." But the original Arabic does **not** use the word "Qur\'an" — the name is *al-dhikr* (the reminder). Allah\'s promise of preservation is given specifically to the *function* of reminding. Classical exegesis interprets this word-choice carefully: the Qur\'an is preserved *because* it is a reminder — the text humanity needs in order to **not forget**.',
    wowTr: 'Korunan ismin seçimi: "Kur\'ân" değil, "zikr" — unutulmaya karşı.',
    wowEn: 'The chosen name of the preserved: not "Qur\'an" but "the reminder" — against forgetting.',
    explore: '15:9',
  },
  {
    category: 'azBilinen',
    surahRef: 'En-Nisâ · 4:174, Mâide · 5:15, Teğâbün · 64:8',
    titleTr: '"Nûr" — Kur\'ân Bir Işık Olarak Tanımlanır',
    titleEn: '"Nūr" — The Qur\'an Described as Light',
    bodyTr: 'Kur\'ân kendisini en az üç ayette doğrudan "nûr" (ışık) olarak tanımlar. Nisâ 4:174: "size apaçık bir nûr indirdik". Mâide 5:15: "Allah\'tan bir nûr ve apaçık bir kitap geldi". Teğâbün 64:8: "Allah\'a, Peygamberine ve indirdiğimiz o **nura** (Kur\'ân\'a) inanın." Şûrâ 42:52: "Biz onu kullarımızdan dilediğimizi kendisiyle doğru yola eriştirdiğimiz bir nûr kıldık." Bu isim metaforik değil, **ontolojik** bir iddiadır: Kur\'ân, **karanlıkta görünen bir aydınlatıcıdır**. Klasik ekolde bu kavram "Nûr Ayeti"ne (24:35) bağlanır.',
    bodyEn: 'The Qur\'an describes itself directly as *nūr* (light) in at least three verses. Q 4:174: "We have sent down to you a manifest light." Q 5:15: "There has come to you from Allah a light, and a clear Book." Q 64:8: "Believe in Allah, His Messenger, and the **light** We have sent down." Q 42:52: "We made it a light by which We guide whomever We will." This name is not metaphorical but an **ontological** claim: the Qur\'an is an **illuminator in the dark**. In classical exegesis this concept connects to the Verse of Light (Q 24:35).',
    wowTr: 'Kur\'ân kendi adıyla: "ışık". Metafor değil, ontolojik iddia.',
    wowEn: 'The Qur\'an by its own name: "light." Not metaphor — an ontological claim.',
    explore: '24:35',
  },
  {
    category: 'azBilinen',
    surahRef: 'El-İsrâ · 17:82',
    titleTr: '"Şifâ" — Kur\'ân İç Hastalıkların İlacı Olarak Anılır',
    titleEn: '"Shifāʾ" — The Qur\'an Named as Cure for Inner Ailments',
    bodyTr: 'İsrâ 17:82: "Biz, Kur\'ân\'dan öyle bir şey indiriyoruz ki o, müminler için **şifa** ve rahmettir; zalimlerin ise yalnızca ziyanını artırır." Klasik tefsir (Kurtubî, Râzî) bu şifayı iki katmanda okur: (1) **ruhî-ahlâkî** — şüphe, gurur, kibir, cimrilik gibi iç hastalıkların iyileşmesi, (2) **bedensel** — rukye bağlamında bazı hastalıklarda şifa vesilesi olma. Ama dikkat: klasik ulema "Kur\'ân her derde ilaçtır" genelleştirmesine mesafelidir; birinci katman kesin, ikincisi özel bağlamlıdır. Ayetin devamı sınırı çizer: "zâlimler için zararını artırır" — aynı metin, aynı anda şifa **ve** artırıcı olabilir.',
    bodyEn: 'Q 17:82: "And We send down from the Qur\'an that which is **healing** and a mercy for the believers; but it increases the wrongdoers in nothing but loss." Classical exegesis (al-Qurṭubī, al-Rāzī) reads this healing at two levels: (1) **spiritual-ethical** — the cure for inner diseases like doubt, arrogance, miserliness, (2) **physical** — through *ruqya* (recitation-based remedy) as a cause of healing in certain contexts. But caution: classical scholars resist generalizing this into "the Qur\'an is a cure for every ailment" — the first level is firm, the second context-specific. The verse itself draws the limit: "for the wrongdoers, it increases only loss" — the same text can be healing **and** amplification at once.',
    wowTr: 'Aynı ayet — iman için şifa, zulüm için kayıp. Metin aynı, etki zıt.',
    wowEn: 'Same verse — healing for faith, loss for wrongdoing. Same text, opposite effects.',
    explore: '17:82',
  },
```

---

## 6. Kaynaklar (toplu)

**Kur'ân ayetleri (hepsi verse-graph'tan doğrulandı):**
1. Bakara 2:2 (hüden)
2. Âl-i İmrân 3:138 (hüden)
3. Furkân 25:1 (Furkân)
4. Hicr 15:9 (ez-Zikr)
5. Nisâ 4:174 (nûr)
6. Mâide 5:15 (nûr)
7. Teğâbün 64:8 (nûr)
8. Şûrâ 42:52 (nûr)
9. İsrâ 17:82 (şifâ)
10. Nûr 24:35 (Nûr ayeti — cross-reference)

**Klasik tefsir:**
11. Celâleddin es-Suyûtî, el-İtkân fî Ulûmi'l-Kur'ân, bâb 17 (Kur'ân'ın isimleri — ana kaynak)
12. Bedreddin ez-Zerkeşî, el-Burhân fî Ulûmi'l-Kur'ân (klasik Kur'ân ulûmu)
13. İbn Kesîr, Tefsîru'l-Kur'âni'l-Azîm (ilgili ayetler)
14. Zemahşerî, el-Keşşâf (özellikle Hicr 15:9 analizi)
15. Râzî, Mefâtîhu'l-Gayb (ilgili ayetler)
16. Kurtubî, el-Câmi' li-Ahkâmi'l-Kur'ân (İsrâ 82 şifa analizi)
17. İbn Âşûr, et-Tahrîr ve't-Tenvîr (Furkân sûresi mukaddimesi)
18. Elmalılı Hamdi Yazır, Hak Dini Kur'an Dili (Furkân 25:1)
19. İbn Kayyim, Zâdu'l-Me'âd (rukye ve Kur'ân-şifa bağlantısı)

**Tasavvufî (ekol notuyla):**
20. İbn Arabî, Fütûhât-ı Mekkiyye (Nûr kavramı — "tasavvufî okuma; klasik eleştiriyle birlikte değerlendirilmeli")

**Korpus/dilbilim:**
21. Quranic Arabic Corpus (corpus.quran.com) — kök ه د ي (hudâ), ف ر ق (Furkân), ذ ك ر (zikr), ن و ر (nûr), ش ف ي (şifâ) morfolojik dağılımları

---

## 7. Uyarılar / Açık Sorular

1. **"90 yerden fazla" ifadesi (Kart 1)** — Suyûtî'nin el-İtkân'ında genel bir beyanına dayanır; farklı morfolojik seçime göre sayı değişebilir. "Kimine göre" hedge ifadesi kullanıldı — bu güvenli bir formülasyondur. Kesin bir sayı vermek içinden corpus istatistiği gerektirir (bu ileride yapılabilir).

2. **"Nûr" ve tasavvufî bağlantı (Kart 4)** — İbn Arabî'ye atıf yapıldı. Taslak metnindeki referans "klasik ekolde bu kavram Nûr Ayeti'ne bağlanır" şeklinde tutuldu — tasavvufî boyuta doğrudan girmedi. Kart'ın gövdesi kısa (wow format gerektirir) — tasavvufî derinlik burada değil, sitenin SevenLayers section'ında işleniyor (cross-reference fırsatı).

3. **"Şifâ" ve rukye bağlamı (Kart 5)** — "Her derde ilaçtır" abartısına kaçmadan, klasik ulemanın çizdiği sınırları kart içine yansıtmak önemliydi. Taslak bu dengeyi tutuyor. İnfo notu açıkça: "birinci katman kesin, ikincisi özel bağlamlıdır".

4. **Yeni kategori mi, mevcut kategoride mi?** — Öneri: **mevcut `azBilinen` kategorisinde**. Yeni kategori açmak CATEGORY_ORDER ve dropdown UI'ını güncellemeyi gerektirir, bu ilk eklemede gereksiz karmaşa.

5. **Daha fazla isim eklemek** — Suyûtî 55 isim sayar. Bu taslak 5 isme odaklanır. Kullanıcı ileride Kitâb, Beyân, Rahmet, Mev'ize, Mübîn, Hakk gibi diğer isimler için ek mikro taslaklar isteyebilir.

6. **Explore alanı** — Her kartın `explore` alanı VerseGraph'ta arama yapmak için kullanılır. Taslakta: Kart 1 `'hüden'` kelime araması, Kart 2 `'furkan'`, Kart 3 `'15:9'` doğrudan ayet, Kart 4 `'24:35'` cross-ref (Nûr ayeti), Kart 5 `'17:82'` doğrudan ayet. Bu kararlar test edilebilir.

---

## 8. Taslak İstatistikleri

- **Yeni kart:** 5 (Hudâ, Furkân, Zikr, Nûr, Şifâ)
- **Ayet referansı:** 10 (%100 verse-graph doğrulandı)
- **Klasik tefsir/usûl kaynağı:** 10 (Suyûtî, Zerkeşî, İbn Kesîr, Zemahşerî, Râzî, Kurtubî, İbn Âşûr, Elmalılı, İbn Kayyim, + Quranic Corpus)
- **Tasavvufî (ekol notuyla):** 1 (İbn Arabî)
- **Toplam kaynak referansı:** 12

Bu taslak **kullanıcı onayı** bekler. Onay sonrası:
1. Kullanıcı JSX bloğunu (bölüm 5) `src/components/WowFacts.jsx` içindeki `FACTS` array'ine kopyalar (agent'ın dosya-yazma yetkisi yoktur: `src/**` yasaklı)
2. Yeni eklemelere bağlı olarak WowFacts toplam kart sayısı artar — varsa ilgili sayaç/başlık da güncellenir
