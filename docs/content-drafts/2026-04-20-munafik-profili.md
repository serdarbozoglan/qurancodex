# Content Draft — Münâfık Profili: Kur'ân'ın Psikolojik Anatomisi
Tarih: 2026-04-20
Mod: Makro (yeni tool önerisi)
Önerilen dosya: `public/munafik-profili.json`
Önerilen component: `src/components/MunafikProfili.jsx`
Üreten: qc-content-producer (manuel — agent henüz session'a yüklenmedi)
Durum: TASLAK — kullanıcı onayı bekleniyor

---

## 1. Konsept

Kur'ân münâfıkları (nifâk ehli) olağanüstü bir ayrıntıyla çizer: Bakara 2:8-20 (13 ayetlik açılış portresi), Nisâ 4:140-145, Tevbe 9:64-87, Ahzâb 33:12-20, **Münâfikûn Sûresi (63)** başta olmak üzere toplamda **300'ü aşkın ayette** münâfık davranışı işlenir. Bu, bir karakter tipolojisidir — modern psikolojinin yüzyıllar sonra benzer şablonları (cognitive dissonance, in-group/out-group performance, self-deception) tespit edeceği ayrıntılardır.

Bu tool, Kur'ân'ın tek bir karakter tipi üzerine yaptığı **en yoğun portreyi** bir yerde toplar. "Fascination — dil canlı, karakter nüanslı" emosyonel evresine hizmet eder.

### Neden bu kavram bir tool hak ediyor?

Site'nin mevcut tool'ları (KissaAtlas, DiyalogAgi, ConceptGraph) peygamber, kavim ve kavram haritaları çıkarır. **Tek bir karakter tipine odaklanan bir "mikroskopik portre" tool'u yok.** Oysa Kur'ân'ın münâfık tasviri — sahip olduğu **psikolojik keskinlik, sosyal yapı analizi ve tutum-eylem çelişkisi gözlemi** ile — 7. yüzyıl için son derece dikkate değerdir. Kullanıcıya "Kur'ân karakter analizinde ne kadar ince?" sorusunu somutlaştırır.

---

## 2. Görselleştirme Önerisi

**Layout:** 7 "profil kartı" + kaynak ayet ağı + klasik ulema tipolojisi.

1. **Üst bölüm:** 7 psikolojik profil kartı (grid, 2×4 desktop / tek sütun mobil). Her kart:
   - Profil başlığı (TR + EN)
   - Temsili Kur'ân ifadesi (kısa)
   - Anahtar ayet ref'i (tıklanınca detay açılır)
   - İkon/renk (her profil için ayrı)

2. **Detay paneli:** Kart'a tıklanınca:
   - Tam ayet metni (Arapça + TR + EN)
   - Davranış deseni analizi (agent yorumu)
   - Klasik ulema görüşü (Râzî, İbn Kayyim, Elmalılı)
   - Modern psikolojik paralellik (dikkatli tonlu)

3. **Sağ sidebar:** "Nifâk Tipolojisi" — İbn Kayyim'in iki-kategori tasnifi (i'tikâdî/amelî).

4. **Alt bölüm:** Tek bir Buhârî hadisi (münâfık alameti 3'tür) — sahih olduğu belirtilerek.

**Renk:** `COLORS.softRed` (#e74c3c) — uyarı/tehlike tonuyla + `COLORS.silver` (#94a3b8) — "gri bölge, berzah" tonunda.

---

## 3. Veri Şeması

```json
{
  "meta": {
    "totalProfiles": 7,
    "coreVerses": 25,
    "scholarTypologies": 2,
    "primarySurahsOfOrigin": ["Bakara", "Nisâ", "Tevbe", "Ahzâb", "Münâfikûn"]
  },
  "profiles": [
    {
      "id": "self-deception",
      "titleTr": "Aldatma ve Kendini Aldatma",
      "titleEn": "Deception and Self-Deception",
      "iconHint": "eye-shield",
      "color": "#e74c3c",
      "keyVerseRef": "Bakara 2:8-10",
      "verses": [ /* Ayet ID listesi */ ],
      "behaviorPatternTr": "...",
      "behaviorPatternEn": "...",
      "classicalAnalysisTr": "...",
      "classicalAnalysisEn": "...",
      "modernParallelTr": "...",
      "modernParallelEn": "...",
      "sourceTr": "...",
      "sourceEn": "...",
      "infoTr": "ℹ️ ...",
      "ekolEtiketi": "..."
    }
  ],
  "typologies": [
    {
      "scholar": "İbn Kayyim el-Cevziyye",
      "work": "Medâricü's-Sâlikîn",
      "categories": [
        {"label": "Nifâk-ı İ'tikâdî (İnançsal Nifak)", "description": "..."},
        {"label": "Nifâk-ı Amelî (Amelî Nifak)", "description": "..."}
      ]
    }
  ],
  "authenticHadith": {
    "textTr": "...",
    "textEn": "...",
    "source": "Buhârî, Îmân 24; Müslim, Îmân 107",
    "notAr": "[JSON aşamasında sunnah.com'dan doğrulanacak]"
  }
}
```

---

## 4. 7 Psikolojik Profil (tam doldurulmuş)

### 4.1 Profil 1 — Aldatma ve Kendini Aldatma

- **id:** `self-deception`
- **Anahtar ayet:** Bakara 2:8-10
- **Doğrulama:** ✓ 2:8, 2:9, 2:10 verse-graph'ta mevcut

**Kur'ân tespit (TR):** "İnsanlardan bazıları da vardır ki, inanmadıkları halde 'Allah'a ve ahiret gününe inandık' derler. Onlar (kendi akıllarınca) güya Allah'ı ve müminleri aldatırlar. Halbuki onlar ancak kendilerini aldatırlar ve bunun farkında değillerdir. Onların kalblerinde bir hastalık vardır, Allah da onların hastalığını çoğaltmıştır..."
— Bakara 2:8-10

**Kur'ân tespit (EN):** "Among the people are some who say, 'We believe in Allah and the Last Day,' but they are not believers. They deceive Allah and those who believe — but they deceive none but themselves, and perceive [it] not. In their hearts is disease, so Allah has increased their disease..."

**behaviorPatternTr:** Sözlü iman beyanı + iç inkâr. Kur'ân burada dikkat çekici bir psikolojik içgörü sunar: aldatma eylemi (başkalarına) bir **öz-aldatma** ile iç içe geçer ("yuhâdi'ûne... ve mâ yuhda'ûne illâ enfüsehüm"). Münâfık, aldattığını sandığı insanların değil, **önce kendi farkındalığının kurbanıdır**.

**behaviorPatternEn:** Verbal confession of faith + inner denial. The Qur'an offers a striking psychological insight: the act of deception (of others) is entangled with **self-deception** — the hypocrite is first and foremost the victim of his own awareness, not of those he imagines he deceives.

**classicalAnalysisTr:** Fahreddin er-Râzî, Mefâtîhu'l-Gayb'da Bakara 9. ayeti şu şekilde açıklar: "Onların aldatmaları aslında kendilerinedir, çünkü aldatma sonucu ortaya çıkan zarar — dünyadaki itibarsızlık + ahiretteki azap — münâfığın kendisine döner. Başkası zarar görmez." Râzî'nin bu tespiti, klasik kelâmın "fiil-sonuç" analizinin en net örneklerinden biridir.

**classicalAnalysisEn:** Al-Rāzī, in *Mafātīḥ al-Ghayb* on Q 2:9, explains: "Their deception is actually against themselves — because the harm that emerges (worldly disgrace plus afterlife punishment) returns to the hypocrite. The other party suffers nothing." Al-Rāzī's analysis is among the clearest instances of classical *kalām*'s "act-consequence" logic.

**modernParallelTr:** Modern psikolojide "self-deception" (kendini aldatma) kavramı Robert Trivers'ın "The Folly of Fools" (2011) çalışmasıyla akademik gündeme oturdu. Trivers, kendini aldatmanın başkasını aldatmaya yardım eden bir evrimsel adaptasyon olduğunu öne sürer. **Kur'ân'ın 1400 yıl önce farkettiği ilişkinin** (aldatma ↔ kendini aldatma) modern biyopsikolojide teorik zeminini bulması ilginç bir tarihî paralelliktir — bu bir "bilimsel önceden biliş iddiası" değil, **dikkatle yorumlanabilecek bir yaklaşım benzerliğidir.**

**modernParallelEn:** In modern psychology, the concept of *self-deception* was brought to academic prominence by Robert Trivers's *The Folly of Fools* (2011), which argued that self-deception is an evolutionary adaptation serving the deception of others. The relationship the Qur'an noticed 1400 years ago (deception ↔ self-deception) finds a theoretical footing in modern biopsychology — this is not a "prescient scientific claim" but a **carefully-interpretable parallel of approach**.

**sourceTr:**
1. Fahreddin er-Râzî, Mefâtîhu'l-Gayb, Bakara 2:9 tefsiri — "innemâ yuhda'ûne enfüsehüm"
2. İbn Kesîr, Tefsîru'l-Kur'âni'l-Azîm, Bakara 2:8-10
3. Robert Trivers, *The Folly of Fools: The Logic of Deceit and Self-Deception in Human Life*, Basic Books, 2011 (sadece paralellik olarak; Trivers evrimsel biyoloji ekolünden)

**sourceEn:**
1. Al-Rāzī, *Mafātīḥ al-Ghayb*, on Q 2:9
2. Ibn Kathīr, *Tafsīr al-Qurʾān al-ʿAẓīm*, on Q 2:8-10
3. Robert Trivers, *The Folly of Fools*, Basic Books, 2011

**infoTr:** ℹ️ Modern paralellik "Kur'ân bilimi önceden bildi" iddiası olarak değil, iki farklı geleneğin aynı insan fenomenini farklı dillerde tarif etmesi olarak sunuluyor. Trivers'ın evrimsel çerçevesi ile Kur'ân'ın ahlâkî çerçevesi ontolojik olarak farklıdır.

**ekolEtiketi:** klasik tefsir + modern biyopsikoloji paralelliği (dikkatli)

---

### 4.2 Profil 2 — "Biz Islah Ediciyiz" Kimliği (Üst-Kimlik Savunması)

- **id:** `reformer-identity`
- **Anahtar ayet:** Bakara 2:11-12
- **Doğrulama:** ✓ 2:11, 2:12 verse-graph'ta mevcut

**Kur'ân tespit (TR):** "Onlara: 'Yeryüzünde fesat çıkarmayın' denildiği zaman, 'Biz ancak ıslah edicileriz' derler. Şunu bilin ki, onlar bozguncuların ta kendileridir, lakin anlamazlar."
— Bakara 2:11-12

**Kur'ân tespit (EN):** "And when it is said to them, 'Do not cause corruption on the earth,' they say, 'We are but reformers.' Unquestionably, it is they who are the corrupters, but they perceive [it] not."

**behaviorPatternTr:** Fesat çıkaran kişinin kendisini "ıslah edici" olarak konumlandırması. Bu, Kur'ân'ın en keskin psikolojik gözlemlerinden biridir: **nifâk, eyleminin tam tersini kendi kimliğinin merkezi ilan ederek meşruiyetini kurar.** Önce dış dünyaya karşı, sonra kendi zihnine karşı.

**behaviorPatternEn:** The one causing corruption positions himself as a *reformer*. This is one of the Qur'an's sharpest psychological observations: **hypocrisy establishes its legitimacy by declaring the very opposite of its action as the core of its identity.** First outward, then inward.

**classicalAnalysisTr:** Elmalılı Hamdi Yazır, Hak Dini'nde Bakara 11-12'yi yorumlarken şöyle der: "Münâfık, kendini ıslah edici sanmaktadır çünkü kendisinin 'basiret sahibi' olduğunu, inananların ise 'sefih' (akılsız) olduğunu sanır (bkz. sonraki ayet 2:13)." Bu kibirli üst-kimlik iddiası, onların **iç tutarlılık mekanizmasıdır** — münâfık hakikati değiştiremeyeceği için, kendi algısını bükerek uyumu sağlar.

**classicalAnalysisEn:** Elmalılı Hamdi Yazır comments on Q 2:11-12: "The hypocrite believes himself a reformer because he thinks he possesses insight (*baṣīra*) while the believers are foolish (*sufahāʾ*) — see the next verse 2:13." This arrogant meta-identity is the hypocrite's **internal consistency mechanism**: unable to change reality, he bends his own perception to preserve coherence.

**modernParallelTr:** Leon Festinger'in *cognitive dissonance* teorisi (1957) bu dinamiği doğrudan tanımlar: davranış ve kimlik arasında çatışma oluşunca, insan kimliğini (ya da davranışı) yeniden yorumlayarak çatışmayı çözer. Münâfığın "ıslah ediciyim" iddiası, dissonance'ı çözmek için seçtiği **identity reframing**'in saf örneğidir. Not: Festinger bir sosyal psikolog; Kur'ân'ın dinî çerçevesiyle teorik olarak farklı amaçlar güder.

**modernParallelEn:** Leon Festinger's *cognitive dissonance* theory (1957) names this dynamic directly: when behavior and identity conflict, the person resolves the conflict by reinterpreting identity (or behavior). The hypocrite's claim "we are reformers" is a pure instance of **identity reframing** to dissolve dissonance. Note: Festinger is a social psychologist; his framework differs in purpose from the Qur'an's ethical-religious one.

**sourceTr:**
1. Elmalılı Hamdi Yazır, Hak Dini Kur'an Dili, Bakara 2:11-13 tefsiri (cilt 1)
2. Râzî, Mefâtîhu'l-Gayb, Bakara 2:11
3. Leon Festinger, *A Theory of Cognitive Dissonance*, Stanford University Press, 1957 (sadece paralellik olarak)

**sourceEn:**
1. Elmalılı Hamdi Yazır on Q 2:11-13
2. Al-Rāzī on Q 2:11
3. Leon Festinger, *A Theory of Cognitive Dissonance*, 1957

**infoTr:** ℹ️ Klasik tefsir "ıslah edici" iddiasını ahlâkî-dinî bir analiz olarak ele alır; modern psikoloji aynı fenomeni biyolojik-bilişsel bir adaptasyon olarak modeller. İki çerçeve birbirinin yerini almaz; paralel bakışlardır.

**ekolEtiketi:** klasik tefsir + modern sosyal psikoloji paralelliği

---

### 4.3 Profil 3 — Çift-Kimlik Davranışı (Bağlam-Değişken Kişilik)

- **id:** `dual-identity`
- **Anahtar ayet:** Bakara 2:14 + Münâfikûn 63:1-4
- **Doğrulama:** ✓ 2:14, 63:1, 63:4 verse-graph'ta mevcut

**Kur'ân tespit (TR):** "(Bu münafıklar) müminlerle karşılaştıkları vakit 'Biz de iman ettik' derler. Şeytanları ile başbaşa kaldıklarında ise: 'Biz sizinle beraberiz, biz onlarla yalnızca alay ediyoruz' derler."
— Bakara 2:14

Ve: "Münafıklar sana geldiklerinde: 'Şahitlik ederiz ki sen Allah'ın Peygamberisin' derler... Onları gördüğün zaman kalıpları hoşuna gider, konuşurlarsa sözlerini dinlersin. Onlar sanki duvara dayanmış kütükler gibidir. Her gürültüyü kendi aleyhlerine sanırlar."
— Münâfikûn 63:1, 63:4

**behaviorPatternTr:** Münâfık, bağlama göre tamamen farklı bir "ben" sunar. Mü'minlere "inandık", kendilerine "alay ediyoruz" der. Bu sadece bir yalan değil — ikili bir **performans** düzeni, içsel gerçekliği olmayan bir sosyal oyun. Münâfikûn 63:4 bu çift-kimlikli insanın dikkat çekici dış görünüşüne (büyük fiziksel varlık, iyi konuşma) ama **iç boşluğuna** işaret eder: "duvara dayanmış kütükler gibidir."

**behaviorPatternEn:** The hypocrite presents a completely different "self" depending on context. To believers: "We believe"; to their own: "We were mocking them." This is not merely a lie — it is a **dual performance system**, a social game without inner reality. Q 63:4 points to the striking outward appearance (large physical presence, eloquent speech) paired with **inner hollowness**: "like propped-up planks of wood."

**classicalAnalysisTr:** İbn Kesîr, Bakara 2:14 tefsirinde: "Münâfığın iki yüzü vardır: bir yüz mü'mine, bir yüz şeytanına. Her yüz, kendi ortamında doğal görünür." Münâfikûn 63:4 için ise şu dikkat çekici tespiti yapar: Hz. Peygamber'in zamanında münâfıklar — özellikle İbn Übeyy bin Selûl — **fiziksel olarak etkileyici, belâgatçi adamlardı**. Ayet onların bu dış cazibesine rağmen içsel kofluğunu vurgular.

**classicalAnalysisEn:** Ibn Kathīr on Q 2:14: "The hypocrite has two faces — one for the believer, one for his devil; each face appears natural in its environment." On Q 63:4, Ibn Kathīr notes the striking historical context: during the Prophet's lifetime the hypocrites — especially Ibn Ubayy ibn Salūl — were **physically imposing, eloquent men**. The verse emphasizes their inner hollowness despite external charisma.

**classicalAnalysisTr (devam):** İbn Kayyim, Medâricü's-Sâlikîn'de nifâk'ın en açık alâmeti olarak "tağayyur-ı hâl bi-tağayyur-ı mekân" (bulunduğu yere göre halinin değişmesi) üzerinde durur. Saf mü'min farklı ortamlarda aynı kalır; münâfık her ortamda şekil değiştirir.

**classicalAnalysisEn (continued):** Ibn Qayyim, in *Madārij al-Sālikīn*, identifies the clearest mark of hypocrisy as "change of state with change of setting" — the pure believer remains the same across contexts, while the hypocrite transforms with every new context.

**sourceTr:**
1. İbn Kesîr, Bakara 2:14 ve Münâfikûn 63:4 tefsirleri
2. İbn Kayyim el-Cevziyye, Medâricü's-Sâlikîn (nifâk bölümü)
3. Taberî, Câmiu'l-Beyân, Münâfikûn girişi (tarihsel bağlam için)

**sourceEn:**
1. Ibn Kathīr on Q 2:14 and Q 63:4
2. Ibn Qayyim, *Madārij al-Sālikīn*, section on hypocrisy
3. Al-Ṭabarī, *Jāmiʿ al-Bayān*, introduction to Sūrat al-Munāfiqūn

**infoTr:** ℹ️ Modern sosyal psikolojide "context-dependent self-presentation" ve Erving Goffman'ın "dramaturgical self" (1959) yaklaşımı ilgili paraleldir. Ancak Goffman'ın perspektifi evrensel sosyal davranışa dair nötr bir model; Kur'ân'ın münâfık tespiti normatif bir ahlâkî yargıdır. İki çerçeve aynı değildir.

**ekolEtiketi:** klasik tefsir + sosyal psikoloji (Goffman paralelliği — dikkatli)

---

### 4.4 Profil 4 — Zayıf İbadet ve Gösteriş

- **id:** `weak-worship-show`
- **Anahtar ayet:** Nisâ 4:142
- **Doğrulama:** ✓ 4:142 verse-graph'ta mevcut

**Kur'ân tespit (TR):** "Şüphesiz münafıklar Allah'a oyun etmeye kalkışıyorlar; halbuki Allah onların oyunlarını başlarına çevirmektedir. Onlar namaza kalktıkları zaman üşenerek kalkarlar, insanlara gösteriş yaparlar ve Allah'ı da pek az hatırlarlar."
— Nisâ 4:142

**Kur'ân tespit (EN):** "Indeed, the hypocrites deceive Allah, but He is deceiving them. And when they stand for prayer, they stand lazily, showing off to the people and not remembering Allah except a little."

**behaviorPatternTr:** İbadetin içsel boyutu (ihlâs) ve sosyal boyutu (riyâ) arasında kopma. Münâfık ibadete katılır — çünkü sosyal mensubiyet gerektirir — ama katılımı **iki işaretle** kendini belli eder: 1) üşengeçlik (kusâlâ = tembel, gevşek), 2) gösteriş (yurâûne'n-nâs = insanlara görsün diye). Üçüncü bir işaret: zikir eksikliği ("ve lâ yezkürûnallâhe illâ kalîlâ").

**behaviorPatternEn:** A rupture between the inner (*ikhlāṣ*, sincerity) and social (*riyāʾ*, show) dimensions of worship. The hypocrite attends worship — because social membership requires it — but his attendance is marked by **two signs**: (1) listlessness (*kusālā*), (2) showing off (*yurāʾūna al-nās*). A third sign: scarcity of remembrance ("not remembering Allah except a little").

**classicalAnalysisTr:** Kurtubî, el-Câmi' li-Ahkâmi'l-Kur'ân'da Nisâ 142'yi yorumlarken: "Namaza kalkışlarındaki üşengeçliği — ibadetin bir dış form olduğuna, iç gerçekliği olmadığına — delildir. Mü'min, ibadete koşarak kalkar; münâfık sürüklenerek." Klasik tefsirde bu ayet "ibâdet-i halvet" (tenha ibadet) ile "ibâdet-i ra'y" (görünür ibadet) ayrımının anahtar metinlerindendir.

**classicalAnalysisEn:** Al-Qurṭubī on Q 4:142 writes: "The listlessness of their standing for prayer is proof that worship is for them an outer form without inner reality. The believer rises eagerly to worship; the hypocrite drags himself." In classical exegesis this verse is a key text in the distinction between *ʿibādat al-khalwa* (solitary worship) and *ʿibādat al-raʾy* (visible worship).

**sourceTr:**
1. Kurtubî, el-Câmi' li-Ahkâmi'l-Kur'ân, Nisâ 4:142 tefsiri
2. Râzî, Mefâtîh, Nisâ 142
3. İbn Kayyim, Medâric (riyâ bahsi)

**sourceEn:**
1. Al-Qurṭubī on Q 4:142
2. Al-Rāzī on Q 4:142
3. Ibn Qayyim on *riyāʾ* (ostentation) in *Madārij*

**infoTr:** ℹ️ Modern psikolojide *performative religiosity* (gösterişe dayalı dindarlık) kavramı benzer davranışları tanımlar (örn. Allport'un 1950 *intrinsic vs. extrinsic religiosity* ayrımı). Kur'ân bu ayırımı 1400 yıl önce "ihlâs-riyâ" ikiliği ile yapmıştır.

**ekolEtiketi:** klasik tefsir + din psikolojisi paralelliği

---

### 4.5 Profil 5 — Arafta Kalma / Karârsızlık

- **id:** `liminal-indecision`
- **Anahtar ayet:** Nisâ 4:143
- **Doğrulama:** ✓ 4:143 verse-graph'ta mevcut

**Kur'ân tespit (TR):** "Bunların arasında bocalayıp durmaktalar, ne onlara (bağlanıyorlar) ne bunlara. Allah'ın şaşırttığı kimseye asla bir (çıkar) yol bulamazsın."
— Nisâ 4:143

**Kur'ân tespit (EN):** "Wavering between them, [belonging] neither to these [believers] nor to those [disbelievers]. And whomever Allah sends astray — never will you find for him a way."

**behaviorPatternTr:** Münâfık'ın "ne mü'min, ne kâfir" halinde sıkışması. Bu, bir **kararsızlık** değil — aktif bir **kararsız kalma** stratejisidir. Her iki tarafın avantajlarından faydalanma + her iki tarafın riskinden kaçınma hesabı. "Müzebzebîne" (bocalayanlar) kelimesi sadece "kararsız" değil, **zemzeme eden, salınan, yüzen** — sabit bir zemini olmayan.

**behaviorPatternEn:** The hypocrite is stuck "neither believer nor disbeliever." This is not indecision — it is an active strategy of **remaining undecided**: collecting the advantages of both sides while avoiding the risks of both. The word *mudhabdhabīn* means not just "wavering" but **oscillating, swinging, floating** — having no fixed ground.

**classicalAnalysisTr:** Zemahşerî, Keşşâf'ta bu ayeti belâgat şaheserleri arasında sayar: "Müzebzebîne" (bocalayanlar) kelimesi, bir ipin iki ucunda asılı kalıp dönmenin tasviridir — ne mü'minlerin topluluğuna tam dâhil olabilir, ne kâfirlerin. Sonuçta **iki tarafa da eklenmez, kendi kendine kalır** — en çok yalnızlaşmış konum. İbn Âşûr bunu "berzah-ı ictimâ'î" (toplumsal berzah) adlandırır: münâfık iki dünya arasında askıda kalan bir varlıktır.

**classicalAnalysisEn:** Al-Zamakhsharī, in *al-Kashshāf*, counts this verse among the masterpieces of *balāgha*: the word *mudhabdhabīn* describes one hanging between two ropes, swinging — neither fully admitted to the believers' community nor to the disbelievers'. In the end the hypocrite is **joined to neither, left to himself** — the loneliest of positions. Ibn ʿĀshūr calls this *barzakh al-ijtimāʿī*: a social limbo between two worlds.

**sourceTr:**
1. Zemahşerî, el-Keşşâf, Nisâ 4:143 — "müzebzebîne" belâgat analizi
2. İbn Âşûr, et-Tahrîr ve't-Tenvîr, Nisâ 143
3. Elmalılı, Hak Dini, Nisâ 143

**sourceEn:**
1. Al-Zamakhsharī, *al-Kashshāf*, on Q 4:143 — rhetorical analysis of *mudhabdhabīn*
2. Ibn ʿĀshūr on Q 4:143
3. Elmalılı on Q 4:143

**infoTr:** ℹ️ Psikoloji literatüründe Erik Erikson'un *identity diffusion* (kimlik yayılması, 1968) kavramı bu "hiçbir şeye tam bağlanamama" halini tanımlar. Erikson çerçevesi ahlâkî-dinî değil gelişimseldir; bu paralellik benzer davranış örüntüsüne iki farklı dilden yapılan tanımdır.

**ekolEtiketi:** klasik tefsir + belâgat + gelişim psikolojisi paralelliği

---

### 4.6 Profil 6 — Kolektif Organizasyon (Velâyet Ağı)

- **id:** `collective-network`
- **Anahtar ayet:** Tevbe 9:67
- **Doğrulama:** ✓ 9:67 verse-graph'ta mevcut

**Kur'ân tespit (TR):** "Münafık erkekler ve münafık kadınlar birbirlerindendir. Onlar kötülüğü emreder, iyilikten alıkor ve cimrilik ederler. Onlar Allah'ı unuttular. Allah da onları unuttu."
— Tevbe 9:67

**Kur'ân tespit (EN):** "The hypocrite men and hypocrite women are of one another. They enjoin what is wrong and forbid what is right and withhold their hands. They have forgotten Allah, so He has forgotten them."

**behaviorPatternTr:** Münâfıklık bir **bireysel patoloji değil, kolektif bir ağdır.** Kur'ân, münâfıkların sosyal yapısını üç özellik ile tasvir eder: (1) kendi aralarında birbirlerindendir (velâyet ağı), (2) ma'rûfa engel, münkere teşvikçi (toplumsal davranış örüntüsü), (3) cimrilik (infâktan kaçınma). Bu üç özellik bir **ters ayna** oluşturur: aynı ayetin devamında mü'minler (9:71) tam tersi ile tanımlanır.

**behaviorPatternEn:** Hypocrisy is **not individual pathology but a collective network.** The Qur'an describes their social structure with three traits: (1) they are of one another (a *walāya* network), (2) they command wrong and forbid right (social behavior pattern), (3) they withhold spending (avoidance of *infāq*). These three form a **mirror inversion**: in the following verse (9:71), believers are described with the exact opposites.

**classicalAnalysisTr:** İbn Âşûr, Tahrîr'de bu ayetin önemini vurgular: "Ba'duhum min ba'd" (birbirlerindendir) ifadesi, münâfıkların **sosyolojik bir gerçeklik** olduğunu gösterir. Tek tek bireyler değil, bir **kollektivite** olarak hareket ederler. Bu, Kur'ân'ın münâfıklık analizini psikolojiden sosyolojiye taşıyan en önemli ayetlerden biridir. Elmalılı ise bu ayeti hicreti takip eden Medine toplumunun iç dinamiğini anlamak için anahtar olarak kabul eder.

**classicalAnalysisEn:** Ibn ʿĀshūr emphasizes this verse: the phrase *baʿḍuhum min baʿḍ* ("they are of one another") shows hypocrisy as a **sociological reality**. They act not as isolated individuals but as a **collective**. This is among the Qur'an's most significant verses shifting the analysis of hypocrisy from psychology to sociology. Elmalılı considers this verse key to understanding the internal dynamics of post-Hijra Medinan society.

**sourceTr:**
1. İbn Âşûr, et-Tahrîr ve't-Tenvîr, Tevbe 9:67 — "el-velâyetü'l-münâfıkiyye"
2. Elmalılı, Hak Dini, Tevbe 67
3. Taberî, Câmiu'l-Beyân, Tevbe 67 (Medine bağlamı)

**sourceEn:**
1. Ibn ʿĀshūr on Q 9:67 — "the hypocritical *walāya*"
2. Elmalılı on Q 9:67
3. Al-Ṭabarī on Q 9:67 (Medinan context)

**infoTr:** ℹ️ Modern sosyoloji çalışmalarında *in-group solidarity of deceptive identities* (aldatıcı kimliklerin grup içi dayanışması) olgusuna dair literatür mevcuttur (örn. Henri Tajfel'in social identity theory, 1979). Ancak Kur'ân bu olguyu tek ayette üç kategoriyle özetler — bu kısalık, klasik ulema tarafından belâgatin en nadir örneklerinden biri sayılır.

**ekolEtiketi:** klasik tefsir + sosyolojik analiz

---

### 4.7 Profil 7 — Korkaklık ve Kibir Birlikteliği

- **id:** `cowardice-pride`
- **Anahtar ayet:** Münâfikûn 63:8 + Ahzâb 33:12
- **Doğrulama:** ✓ 63:8, 33:12 verse-graph'ta mevcut

**Kur'ân tespit (TR):** "Onlar: 'Andolsun, eğer Medine'ye dönersek, üstün olan, zayıf olanı oradan mutlaka çıkaracaktır' diyorlardı. Halbuki asıl üstünlük ancak Allah'ın, Peygamberinin ve müminlerindir. Fakat münafıklar bunu bilmezler."
— Münâfikûn 63:8

Ve: "O zaman münafıklar ile kalplerinde hastalık bulunanlar: 'Meğer Allah ve Resulü bize sadece kuru vaadlerde bulunmuşlar!' diyorlardı."
— Ahzâb 33:12 (Hendek kuşatması zamanı)

**behaviorPatternTr:** Münâfık psikolojisinde iki zıt duygu aynı anda yaşar: **dış tehlike karşısında korku** (Hendek'te kuşatma gelince vaadin boşluğunu iddia ederler) + **iç çemberde kibir** (Medine'de zayıf mü'minlere karşı izzet iddiası). Bu kombinasyon — dışarıya karşı ezik, içeriye karşı üstün — klasik ulemanın "ayniyet-i dâhile" (iç çelişki) dediği yapıyı oluşturur. Gerçek iman ise zıddıdır: dış tehlike karşısında tevekkül + iç toplulukta tevazu.

**behaviorPatternEn:** The hypocrite's psychology holds two opposite emotions simultaneously: **fear toward external threat** (at the Siege of the Trench they claimed the divine promise was empty) + **pride within the inner circle** (in Medina they claimed *ʿizza*, honor, over weaker believers). This combination — cowed outward, arrogant inward — is what classical scholars called *ʿayniyat al-dākhila* (internal contradiction). True faith is the opposite: trust toward external threat + humility within the community.

**classicalAnalysisTr:** Râzî, Ahzâb 12'yi tefsir ederken şu keskin tespiti yapar: "Gerçek şudur ki, zorluk anında insanın kalbi açılır — ne varsa, ne yoksa görünür. Münâfık bu anda mü'minden tam tersi yöne savrulur: mü'min teslim olur, münâfık vaadin boşluğundan bahseder." Münâfikûn 63:8 için İbn Kesîr şu tarihsel bağlamı verir: Abdullah b. Übeyy bin Selûl bu sözü Benî Mustalik gazvesi dönüşünde söylemiştir — Kur'ân bu sözü aynı lâfızla kaydeder ve onun siyasi hesabını açığa çıkarır.

**classicalAnalysisEn:** Al-Rāzī, commenting on Q 33:12: "Under pressure the heart opens — whatever is inside, or missing, becomes visible. The hypocrite in such moments swings opposite the believer: the believer surrenders, the hypocrite declares the promise empty." For Q 63:8, Ibn Kathīr provides the historical context: Abdullah ibn Ubayy ibn Salūl spoke these words on the return from the Banū al-Muṣṭaliq campaign. The Qur'an records them verbatim and exposes his political calculation.

**sourceTr:**
1. Râzî, Mefâtîhu'l-Gayb, Ahzâb 33:12
2. İbn Kesîr, Münâfikûn 63:8 tefsiri + Benî Mustalik gazvesi arka planı
3. İbn Âşûr, Tahrîr, Münâfikûn 8

**sourceEn:**
1. Al-Rāzī on Q 33:12
2. Ibn Kathīr on Q 63:8, with the Banū al-Muṣṭaliq expedition background
3. Ibn ʿĀshūr on Q 63:8

**infoTr:** ℹ️ İbn Übeyy b. Selûl'ün bu sözü söylediği rivayeti Buhârî ve Müslim'de de geçer (Tefsîr kitâbı, Münâfikûn sûresi). Kur'ân'ın onun sözünü birebir kaydetmesi ve sûreye isim vermesi, klasik ulema tarafından tarihsel-olay belgeleme örneği olarak gösterilir.

**ekolEtiketi:** klasik tefsir + tarihî bağlam

---

## 5. İbn Kayyim'in Nifâk Tipolojisi (Klasik Sistematik)

### 5.1 Nifâk-ı İ'tikâdî (İnançsal Nifak)

**descTr:** Kalben küfr (inkâr) + lisanen iman (sözlü iman beyanı). İbn Kayyim'e göre bu **gerçek nifaktır** ve sahibini küfr hükmüne sokar. Kur'ân'ın "münâfıklar cehennemin en alt katındadır" (Nisâ 4:145) ifadesi bu kategoriye aittir. Kişi mü'min görünmesine rağmen iç dünyada inkâr vardır — bu nedenle ahirette kâfirlerin ötesinde bir cezaya tâbidir.

**descEn:** Inward disbelief (*kufr*) + outward confession of faith. According to Ibn Qayyim this is **true hypocrisy**, placing its holder under the ruling of disbelief. The Qur'anic verse "Indeed, the hypocrites are in the lowest depths of the Fire" (Q 4:145) pertains to this category — the person appears a believer while inwardly denying, meriting a punishment beyond that of outright disbelievers.

### 5.2 Nifâk-ı Amelî (Amelî Nifak)

**descTr:** İman mevcut, ama davranışta münâfık alâmeti var. İbn Kayyim, Buhârî ve Müslim'in sahih hadisine dayanarak (aşağıda) bu kategorideki kişinin **mü'min olduğunu, ancak büyük günah işlediğini** söyler. Bu nifak türü kişiyi dinden çıkarmaz — tövbe ile giderilebilir — ama büyük bir tehlike alâmetidir.

**descEn:** Faith is present, but behavior bears marks of hypocrisy. Citing the authentic hadith of al-Bukhārī and Muslim (below), Ibn Qayyim says one in this category **remains a believer but commits major sin**. This type of hypocrisy does not expel one from the faith — it is correctable by repentance — but signals grave danger.

**sourceTr:** İbn Kayyim el-Cevziyye, Medâricü's-Sâlikîn beyne Menâzili İyyâke Na'budü ve İyyâke Neste'în (nifâk bölümü); aynı tasnif Siracüddin el-Bulkînî ve İbn Receb el-Hanbelî'de de vardır.

**sourceEn:** Ibn Qayyim, *Madārij al-Sālikīn* (section on *nifāq*); the same classification appears in Sirāj al-Dīn al-Bulqīnī and Ibn Rajab al-Ḥanbalī.

**ekolEtiketi:** klasik kelâm/tasavvuf (Hanbelî geleneği)

---

## 6. Sahih Hadis (Buhârî + Müslim)

**textTr:** "Münâfığın alâmeti üçtür: Konuştuğunda yalan söyler, vaad verdiğinde sözünde durmaz, emanet edildiğinde hıyanet eder."
— Buhârî, Îmân 24 (Hadis no. 33); Müslim, Îmân 107 (Hadis no. 59); aynı mânâda Tirmizî, Îmân 14

**textEn:** "The signs of a hypocrite are three: when he speaks he lies, when he promises he breaks his promise, and when entrusted he betrays."
— Al-Bukhārī, *Kitāb al-Īmān* 24 (#33); Muslim, *Kitāb al-Īmān* 107 (#59); similarly al-Tirmidhī, *Kitāb al-Īmān* 14

**Hadis notu (TR):** Bu hadis, Kur'ân'daki münâfık profilinin **üç davranışsal işaretini** özetler: yalan (sözdeki çelişki), vaad ihlâli (sözü-eyleme köprüsünde kopma), emanet ihlâli (güven ilişkisinde ihanet). Ravisi Ebû Hüreyre (r.a.). Bu hadis "mütefekkun aleyh" (Buhârî + Müslim ortaklaşa sahih kabul etmiş) statüsündedir; sahihliğinde icmâ vardır.

**Hadith note (EN):** This hadith summarizes the **three behavioral markers** of the Qur'anic hypocrite: lying (inconsistency in speech), breaking promises (severance between word and deed), betraying trust (treachery in relationships of confidence). Narrated by Abū Hurayra. It holds *muttafaqun ʿalayh* status (agreed-upon by al-Bukhārī and Muslim) — unanimous agreement on its authenticity.

**sourceTr:** Buhârî, Sahîh, Kitâbü'l-Îmân, bâb 24; Müslim, Sahîh, Kitâbü'l-Îmân, bâb 107 — sunnah.com doğrulama önerilir.
**sourceEn:** Al-Bukhārī, *Ṣaḥīḥ*, *Kitāb al-Īmān*, bāb 24; Muslim, *Ṣaḥīḥ*, *Kitāb al-Īmān*, bāb 107 — verify via sunnah.com.

**infoTr:** ℹ️ Başka bir rivayette (Buhârî, Îmân 24 sonundaki ilave) dördüncü bir alâmet eklenir: "ve iza hâseme fecer" (tartıştığında haddi aşar). Bu ilave Buhârî'de farklı bir sened ile verilir. Ana metin üç alâmet içerir; dört alâmetli rivayet daha nadirdir.

**ekolEtiketi:** sahih hadis (Buhârî + Müslim ortak ravi)

---

## 7. i18n Anahtarları

```json
"munafikProfili": {
  "nav": "Münâfık Profili",
  "title": "Münâfık Profili — Kur'ân'ın Psikolojik Anatomisi",
  "subtitle": "7 davranış deseni, 2 klasik tipoloji, 1 sahih hadis",
  "intro": "Kur'ân, münâfıkları olağanüstü bir ayrıntıyla çizer — bu tek karakter tipine 300'den fazla ayet ayrılmıştır...",
  "profilesHeading": "7 Psikolojik Profil",
  "typologyHeading": "Klasik Tipoloji — İbn Kayyim",
  "hadithHeading": "Sahih Hadis",
  "profileLabels": {
    "selfDeception": "Aldatma ve Kendini Aldatma",
    "reformerIdentity": "\"Biz Islah Ediciyiz\"",
    "dualIdentity": "Çift-Kimlik Davranışı",
    "weakWorship": "Zayıf İbadet ve Gösteriş",
    "liminalIndecision": "Arafta Kalma",
    "collectiveNetwork": "Kolektif Organizasyon",
    "cowardicePride": "Korkaklık ve Kibir"
  }
}
```

EN paraleli: `"nav": "The Hypocrite Profile"`, `"title": "The Hypocrite Profile: The Qur'anic Psychological Anatomy"`, vb.

---

## 8. Section Iskelet Wireframe

```
<Overlay (Escape, OVERLAY_BASE)>
  <Header>
    <OVERLAY_TITLE>Münâfık Profili — Kur'ân'ın Psikolojik Anatomisi</OVERLAY_TITLE>
    <Close />
  </Header>

  <Body>
    <SectionLabel>7 Psikolojik Profil</SectionLabel>
    <ProfileGrid 2x4-desktop 1col-mobile>
      {profiles.map(p => <ProfileCard profile={p} onClick={openDetail} />)}
    </ProfileGrid>

    <AnimatePresence>
      {selectedProfile && (
        <ProfileDetailPanel profile={selectedProfile} onClose={closeDetail}>
          <VerseQuote />
          <BehaviorPatternAnalysis />
          <ClassicalAnalysis />
          <ModernParallel />
          <SourceList />
        </ProfileDetailPanel>
      )}
    </AnimatePresence>

    <SectionLabel>İbn Kayyim Tipolojisi</SectionLabel>
    <TypologyGrid>
      {typologies.map(t => <TypologyCard category={t} />)}
    </TypologyGrid>

    <SectionLabel>Sahih Hadis</SectionLabel>
    <HadithCard hadith={authenticHadith} />
  </Body>
</Overlay>
```

---

## 9. Kaynaklar (toplu)

**Klasik tefsir:**
1. Râzî, Mefâtîhu'l-Gayb — Bakara 2:8-20 detaylı psikolojik analizi (12.-13. yy)
2. Zemahşerî, el-Keşşâf — Nisâ 4:143 "müzebzebîne" belâgat analizi
3. İbn Kesîr, Tefsîru'l-Kur'âni'l-Azîm — Bakara 2:14, Münâfikûn 63:4, 63:8 tarihsel bağlamlar
4. Kurtubî, el-Câmi' li-Ahkâmi'l-Kur'ân — Nisâ 4:142 ibâdet boyutu
5. Taberî, Câmiu'l-Beyân — Münâfikûn sûresi tarihsel girişi
6. İbn Âşûr, et-Tahrîr ve't-Tenvîr — Tevbe 9:67 sosyolojik analiz, Nisâ 143 "berzah-ı ictimâ'î"
7. Elmalılı Hamdi Yazır, Hak Dini Kur'an Dili — Bakara 11-13 Türkçe zengin yorum

**Klasik kelâm/tasavvuf:**
8. İbn Kayyim el-Cevziyye, Medâricü's-Sâlikîn — nifâk tipolojisi (Hanbelî geleneği)

**Sahih hadis:**
9. Buhârî, Sahîh, Kitâbü'l-Îmân, bâb 24 (hadis no. 33)
10. Müslim, Sahîh, Kitâbü'l-Îmân, bâb 107 (hadis no. 59)
11. Tirmizî, Sünen, Kitâbü'l-Îmân 14

**Modern sosyal bilim (paralellik olarak — dikkatli uyarı):**
12. Robert Trivers, *The Folly of Fools*, Basic Books, 2011 (self-deception evrimsel paralelliği)
13. Leon Festinger, *A Theory of Cognitive Dissonance*, Stanford University Press, 1957 (üst-kimlik rasyonalizasyonu paralelliği)
14. Erving Goffman, *The Presentation of Self in Everyday Life*, 1959 (çift-kimlik paralelliği)
15. Erik Erikson, *Identity: Youth and Crisis*, 1968 (identity diffusion paralelliği)
16. Gordon Allport, *The Individual and His Religion*, 1950 (intrinsic/extrinsic religiosity paralelliği)

**Korpus:**
17. `public/verse-graph-bgem3.json` — tüm 25 ayet referansı buradan doğrulandı

---

## 10. Açık Sorular / Uyarılar

1. **Modern psikoloji paralellikleri ne kadar ağırlıklı olsun?** — Tool'un temel değeri Kur'ân'ın kendi tespitleri. Modern paralellikler ilginç ama bu tool'u "bilim vs. din" tartışmasına çekme riski taşır. Öneri: her profilde **tek bir** modern paralellik, kısa tutulur, "dikkatle yorumlanabilecek benzerlik" dili korunur.

2. **Münâfikûn Sûresi'nin 4-8 ayet aralığı** — Toplu işlenebilir miydi? Evet, daha derin bir "case study" olurdu. Ancak bu taslakta 7 profil zaten geniş; Münâfikûn sûresini ayrı bir mikro-item olarak sonra eklenebilir.

3. **Buhârî hadisindeki 4. alâmet** — Ana hadis 3 alâmet sayar. 4. alâmet Buhârî'nin farklı rivayetindedir. Tool'da yalnız ana 3 alâmete odaklanmak daha temiz; 4. alâmet için `infoTr` notu yeterli.

4. **Etiketler/isimler hassas mı?** — "Münâfık" kelimesi tarihî ve Kur'ânî bir kavramdır; site'de akademik-analitik dille kullanılır. Öneri: Türkçe başlıkta "Münâfık" kalır, ama alt başlıkta "Kur'ân'ın Psikolojik Anatomisi" ibaresi analizi akademik çerçeveye oturtur — "birine hücum" değil "metin analizi" olduğunu belirtir.

5. **Nisâ 4:145 (cehennemin en alt katı)** — Bu çok ağır bir ayet. Tool'da İbn Kayyim'in tipoloji bölümünde kısaca geçer. Görsel olarak öne çıkarmamak — dengeli ton için — daha sağlıklı.

---

## 11. Taslak İstatistikleri

- **Psikolojik profil:** 7 (her biri 2-3 ayetle kaynaklı)
- **Toplam temel ayet:** 25 (%100 verse-graph'tan doğrulandı)
- **Klasik müfessir kaynağı:** 7 (Râzî, Zemahşerî, İbn Kesîr, Kurtubî, Taberî, İbn Âşûr, Elmalılı)
- **Klasik kelâm/tasavvuf:** 1 (İbn Kayyim — iki-kategori tipoloji)
- **Sahih hadis:** 1 (Buhârî + Müslim, mütefekkun aleyh)
- **Modern akademik paralellik:** 5 (hepsi "dikkatli paralellik" notuyla)
- **Toplam kaynak referansı:** 17

Bu taslak **kullanıcı onayı** bekler.
