# Content Draft — Dua Verses Expansion (50 → 80)

Tarih: 2026-07-09
Mod: Mikro
Hedef dosya: `next/public/dua-verses.json`
Hedef araç: QuranDua tool
Üreten: qc-content-producer

## Genel Not

Mevcut 50 dua kaydına 30 yeni giriş ekleniyor. Ağırlık, kategorik olarak zayıf kalan başlıklarda (ilim, sabir, rizik, hidayet, sıkıntı, şükür) ve klasik Kur'an dua kalıplarının (Bakara 2:126 İbrahim'in Mekke duası, Âl-i İmrân 3:9 "câmi'un-nâs", 3:191-192 tefekkür duası, Yûnus 10:88 Musa'nın Fir'avn'a bedduası, Hûd 11:41 Nuh'un gemi duası, vb.) örneklendirilmesinde toplandı.

Kaynak çemberi: Elmalılı (Hak Dini Kur'an Dili), Kurtubî (el-Câmi'), Râzî (Mefâtîhu'l-Gayb), İbn Kesîr (Tefsîru'l-Kur'âni'l-Azîm), Diyanet Meali (Kur'an Yolu). Bir ayetin dua statüsü tartışmalı ise (örneğin bir vaad veya emir cümlesi olup dua kalıbında okunması) `confidence: medium` etiketi verilmiş ve rasyonel açıklanmıştır.

Arapça metin generate edilmedi — her kayıt `"arabic": "AYET_INJECT_XX"` placeholder içeriyor. Stage 2'de `verse-graph-bgem3.json`'dan §13.15 standart Unicode encoding ile kopyalanacak.

Kategori dağılımı:
- ilim: 4 yeni (18:24, 18:65, 58:11, 20:114-B alternatif düşürüldü; onun yerine 12:22)
- sabir: 3 yeni (7:126, 10:88-89, 7:189)
- rizik: 3 yeni (2:126, 29:60, 62:10)
- hidayet: 3 yeni (3:9, 50:32-33 tek ayet 50:33'e çekildi, 39:53)
- sıkıntı: 3 yeni (11:41, 21:76, 26:169)
- şükür: 3 yeni (16:78, 27:40, 34:39)
- sığınma: 2 yeni (7:200, 113:1-5)
- tövbe: 2 yeni (2:37, 12:98)
- genel: 4 yeni (3:9, 3:53 zaten var → 3:191-192, 40:60, 63:10, 55:78)
- aile: 3 yeni (26:118, 71:26-27, 12:101 zaten var → 3:38 zaten var → 20:132)

Not: Bazı ilk plan tercihleri (örn. 50:32 tek ayet olarak dua kalıbı içermiyor — vaad cümlesi; 50:33 daha uygun) düzeltildi. Nihai 30 giriş aşağıdaki tablodadır.

---

## Item 1

- **id:** `bakara-37`
- **surah:** 2
- **ayah:** 37
- **verseRef:** Bakara 2:37
- **category:** tovbe
- **prophet_tr:** Hz. Âdem
- **prophet_en:** Adam
- **confidence:** medium (ayet metni "kelimeleri Rabbinden aldı" ifadesiyle Âdem'in tövbe kelimelerini kayıt altına almaz; klasik tefsir bu "kelimeleri" 7:23 duasıyla özdeşleştirir. Buraya bir "tövbe kabulünün müjdesi" bağlamıyla eklenmiştir.)
- **Kaynak:** Kurtubî, el-Câmi', 2:37 tefsiri; İbn Kesîr aynı ayet altında Übeyy b. Ka'b rivayeti ile "kelimeler"i Âdem'in tövbe formülü olarak açıklar.
- **tr:** "Derken Âdem, Rabbinden birtakım kelimeler aldı (öğrendi de tövbe etti). Bunun üzerine Allah onun tövbesini kabul buyurdu. Şüphesiz O, tövbeleri çokça kabul edendir, çok merhametlidir."
- **en:** "Then Adam received words from his Lord, and He accepted his repentance. Indeed, He is the Accepting of Repentance, the Merciful."
- **note_tr:** Tövbenin ilk arketipi: kelime aramak, sözü aramak, mağfiret kapısını sözle çalmak.
- **note_en:** The archetype of repentance — reaching for the words, the plea, the door opened by naming one's need.

---

## Item 2

- **id:** `bakara-126`
- **surah:** 2
- **ayah:** 126
- **verseRef:** Bakara 2:126
- **category:** rizik
- **prophet_tr:** Hz. İbrâhim
- **prophet_en:** Ibrahim
- **confidence:** high
- **Kaynak:** Râzî, Mefâtîhu'l-Gayb, Bakara 2:126 tefsiri; Elmalılı Hak Dini Kur'an Dili, aynı ayet — Mekke'nin bereketi için yapılan somut dua olarak sınıflandırılır.
- **tr:** "İbrâhim: 'Rabbim! Burayı emin bir şehir yap, halkından Allah'a ve âhiret gününe iman edenleri çeşitli meyvelerle rızıklandır' demişti."
- **en:** "Ibrahim prayed: 'My Lord, make this a secure city and provide its people with fruits — those of them who believe in Allah and the Last Day.'"
- **note_tr:** Rızık duasının en somut örneği: bir şehir, bir emniyet, bir meyve — soyutu değil, gündelik bereketi ister.
- **note_en:** The most concrete supplication for provision: a city, a safety, a fruit — not abstract sustenance but daily bounty.

---

## Item 3

- **id:** `ali-imran-9`
- **surah:** 3
- **ayah:** 9
- **verseRef:** Âl-i İmrân 3:9
- **category:** genel
- **prophet_tr:** İnananlar (Ûlü'l-elbâb)
- **prophet_en:** The believers (people of insight)
- **confidence:** high
- **Kaynak:** Kurtubî, el-Câmi', 3:9 tefsiri; Elmalılı, ûlü'l-elbâbın hesap günü tasavvurundan çıkan bir yakarış olarak açıklar.
- **tr:** "Rabbimiz! Şüphesiz sen, insanları, geleceğinde şüphe olmayan bir günde toplayacaksın. Allah asla sözünden dönmez."
- **en:** "Our Lord! Surely You will gather humanity on a Day about which there is no doubt. Indeed, Allah does not break His promise."
- **note_tr:** Bir dua mı bir itiraf mı? Hem ikisi: verdiği sözü unutmayan bir kul, verdiği sözü tutan Rabbi hatırlatır.
- **note_en:** A prayer or a confession? Both: a servant who does not forget the promise reminds himself of the Lord who keeps it.

---

## Item 4

- **id:** `ali-imran-191`
- **surah:** 3
- **ayah:** 191
- **ayah_end:** 192
- **verseRef:** Âl-i İmrân 3:191-192
- **category:** genel
- **prophet_tr:** Ûlü'l-elbâb (aklıselim sahipleri)
- **prophet_en:** People of insight
- **confidence:** high
- **Kaynak:** İbn Kesîr, 3:191 tefsiri, tefekkür ehlinin klasik duası; Râzî aynı ayet — kâinâtın "abes yaratılmadığı" idraki üzerine kurulu bir mağfiret talebi olarak açıklar. (Zümerî 3:193-194 mevcut dosyada var; bu, hemen öncesi kısımdır ve "tefekkür → itiraf → talep" örüntüsünün başlangıcıdır.)
- **tr:** "Onlar ayakta, oturarak ve yanları üzere yatarken Allah'ı anarlar. Göklerin ve yerin yaratılışı üzerinde düşünürler ve şöyle derler: 'Rabbimiz! Sen bunu boş yere yaratmadın; seni tenzih ederiz. Bizi ateş azabından koru.'"
- **en:** "Those who remember Allah while standing, sitting, and lying on their sides, and reflect on the creation of the heavens and the earth: 'Our Lord! You have not created this in vain — glory be to You. Protect us from the punishment of the Fire.'"
- **note_tr:** Tefekkür sonucu doğan tek dua: "Bu boşuna değil." İdrak, secdeye dönüşür.
- **note_en:** The one prayer born from contemplation: "This is not for nothing." Realization becomes prostration.

---

## Item 5

- **id:** `araf-126`
- **surah:** 7
- **ayah:** 126
- **verseRef:** A'râf 7:126
- **category:** sabir
- **prophet_tr:** Fir'avn'ın sihirbazları (iman edenler)
- **prophet_en:** Pharaoh's magicians (after their conversion)
- **confidence:** high
- **Kaynak:** Elmalılı, 7:126 tefsiri; Kurtubî — sihirbazların iman ettikten sonra Fir'avn'ın işkence tehdidi karşısında ettiği duadır; sabır talebinin en sert bağlamlarından biri.
- **tr:** "Rabbimiz! Üzerimize sabır yağdır ve canımızı müslüman olarak al."
- **en:** "Our Lord! Pour patience upon us and take our souls as Muslims."
- **note_tr:** İmanın ilk saatinde ölümü göze alan bir kalp: sabrın son sınırı, teslimiyetin ilk cümlesi.
- **note_en:** A heart that accepts death in the first hour of its faith: the ultimate edge of patience, the first word of surrender.

---

## Item 6

- **id:** `araf-189`
- **surah:** 7
- **ayah:** 189
- **verseRef:** A'râf 7:189
- **category:** sabir
- **prophet_tr:** Hz. Âdem & Hz. Havva
- **prophet_en:** Adam & Eve
- **confidence:** medium (ayet doğrudan bir dua kalıbı ("de ki") değil, ancak Elmalılı ve Kurtubî bu ayeti eşlerin hamileliğin ağırlaşan safhasında birlikte ettiği yakarış olarak yorumlar. Şükre yakın bir sabır duası.)
- **Kaynak:** Elmalılı, 7:189 tefsiri; Kurtubî aynı ayet, hamileliğin sıkıntısında ve doğumun beklentisinde eşlerin birlikte ettiği duayı örnek verir.
- **tr:** "Karısı ağır bir yük yüklendiğinde ikisi birlikte Rableri Allah'a şöyle dua ettiler: 'Andolsun eğer bize sağlıklı bir çocuk verirsen mutlaka şükredenlerden olacağız.'"
- **en:** "When she carried a heavy burden, they both prayed to Allah, their Lord: 'If You grant us a healthy child, we will surely be among the grateful.'"
- **note_tr:** İlk ebeveynliğin duası: bekleyen sabır, adanmış şükür.
- **note_en:** The prayer of first parenthood: patience in waiting, gratitude already promised.

---

## Item 7

- **id:** `araf-200`
- **surah:** 7
- **ayah:** 200
- **verseRef:** A'râf 7:200
- **category:** siginma
- **prophet_tr:** Genel (Kur'an'ın öğrettiği isti'âze formülü)
- **prophet_en:** General (the Qur'anic isti'ādhah formula)
- **confidence:** high
- **Kaynak:** İbn Kesîr, 7:200 tefsiri; klasik ulema tarafından "isti'âze" (şeytandan Allah'a sığınma) formülünün Kur'anî kaynağı olarak zikredilir.
- **tr:** "Eğer şeytandan bir vesvese seni dürterse, hemen Allah'a sığın. Şüphesiz O, hakkıyla işitendir, hakkıyla bilendir."
- **en:** "If a suggestion from Satan touches you, seek refuge in Allah. Indeed, He is All-Hearing, All-Knowing."
- **note_tr:** Dua olarak değil emir olarak inmiş; ama her isti'âzenin kaynağı ve gerekçesi bu ayettir.
- **note_en:** Not phrased as a supplication but as a command — yet every "a'ūdhu billāh" traces back to this verse.

---

## Item 8

- **id:** `yunus-88`
- **surah:** 10
- **ayah:** 88
- **ayah_end:** 89
- **verseRef:** Yûnus 10:88-89
- **category:** sabir
- **prophet_tr:** Hz. Mûsâ
- **prophet_en:** Moses
- **confidence:** high
- **Kaynak:** Kurtubî, el-Câmi', 10:88-89 tefsiri; Râzî — Musa'nın Fir'avn ve hâşiyesinin sürekli engellemesinden sonra kalbindeki bezginliği Rabbine sunuşunun kaydı.
- **tr:** "Mûsâ dedi ki: 'Rabbimiz! Sen Fir'avn'a ve ileri gelenlerine dünya hayatında zînet ve mallar verdin. Rabbimiz! Bunlarla insanları senin yolundan saptırıyorlar. Rabbimiz! Onların mallarını yok et, kalplerini sıkı tut ki, o acı azabı görünceye kadar iman etmesinler.' (Allah:) 'İkinizin duası kabul olundu. Öyleyse dosdoğru yolda devam edin' buyurdu."
- **en:** "Moses said: 'Our Lord! You have given Pharaoh and his chiefs splendor and wealth in this life. Our Lord! With them they lead people astray from Your path. Our Lord! Obliterate their wealth and harden their hearts, so they will not believe until they see the painful punishment.' Allah said: 'Your prayer is granted. So stand firm on the straight path.'"
- **note_tr:** Sabrın kırıldığı an: peygamber bile "yeter" diyebilir. Rabbin cevabı da hazırdır: "istikamet."
- **note_en:** The moment patience breaks: even a prophet may say "enough." And the Lord's answer is ready: "stand firm."

---

## Item 9

- **id:** `hud-41`
- **surah:** 11
- **ayah:** 41
- **verseRef:** Hûd 11:41
- **category:** sikinit
- **prophet_tr:** Hz. Nûh
- **prophet_en:** Noah
- **confidence:** high
- **Kaynak:** İbn Kesîr, 11:41 tefsiri; klasik ulemâca "yolculuk / binek duası"nın kaynak metinlerinden sayılır (Zâdü'l-Meâd, İbn Kayyim).
- **tr:** "Nûh dedi ki: 'Binin ona! Onun yürümesi de durması da Allah'ın adıyladır. Şüphesiz Rabbim çok bağışlayan, çok merhamet edendir.'"
- **en:** "Noah said: 'Board it! In the name of Allah is its course and its anchorage. My Lord is truly All-Forgiving, Most Merciful.'"
- **note_tr:** Sıkıntının içinden geçmenin duası: geminin harekete geçtiği ve durduğu her an için ismini anmak.
- **note_en:** The prayer for passing through hardship: naming Him at every moment the ship moves and every moment it stops.

---

## Item 10

- **id:** `yusuf-22`
- **surah:** 12
- **ayah:** 22
- **verseRef:** Yûsuf 12:22
- **category:** ilim
- **prophet_tr:** Hz. Yûsuf (Allah'ın Yûsuf'a verdiği hüküm ve ilim)
- **prophet_en:** Joseph (Allah's grant of judgment and knowledge to Joseph)
- **confidence:** medium (dua kalıbı değil — vaad/haber cümlesi; ancak ilim tefekkürünün Kur'anî zemini olarak sıklıkla dua bağlamında zikredilir. Elmalılı bu ayeti "muhsinlerin sünnetullah'ta ilim payı" olarak yorumlar; dua olmak yerine Yûsuf'un ilimle ödüllendirilişinin ilanıdır.)
- **Kaynak:** Elmalılı, 12:22 tefsiri; ihsan-ilim ilişkisinin klasik Kur'anî delili.
- **tr:** "Yûsuf olgunluk çağına eriştiğinde, ona hüküm (hikmet) ve ilim verdik. İyilik edenleri işte böyle mükâfatlandırırız."
- **en:** "When Joseph reached full maturity, We granted him wisdom and knowledge. Thus do We reward those who do good."
- **note_tr:** İlim istemenin zemini: önce ihsan, sonra hüküm. Ödül olarak inen bir bilgi.
- **note_en:** The ground for asking knowledge: first excellence, then judgment. Knowledge that descends as reward.

---

## Item 11

- **id:** `yusuf-98`
- **surah:** 12
- **ayah:** 98
- **verseRef:** Yûsuf 12:98
- **category:** tovbe
- **prophet_tr:** Hz. Ya'kûb
- **prophet_en:** Jacob
- **confidence:** high
- **Kaynak:** Kurtubî, 12:98 tefsiri; Ya'kûb'un çocukları için "seher vaktine ertelenmiş" istiğfar vaadinin klasik yorumu.
- **tr:** "(Yakub) 'Sizin için Rabbimden af dileyeceğim. Şüphesiz O, çok bağışlayandır, çok merhamet edendir' dedi."
- **en:** "He said: 'I will ask forgiveness for you from my Lord. Indeed, He is the Forgiving, the Merciful.'"
- **note_tr:** Bir babanın oğulları için istiğfarı: kırgınlığın değil, taşınan bağın delili.
- **note_en:** A father's plea of forgiveness for his sons: not an act of grudge but the proof of a bond still carried.

---

## Item 12

- **id:** `hicr-49`
- **surah:** 16
- **ayah:** 78
- **verseRef:** Nahl 16:78
- **category:** sukur
- **prophet_tr:** Genel (insan ve şükrü)
- **prophet_en:** General (humanity and gratitude)
- **confidence:** medium (dua kalıbı değil — hatırlatma; ancak "leallekum teşkurûn" (umulur ki şükredersiniz) ifadesiyle biten ayet şükrün Kur'anî çağrısının merkezindedir. Dua statüsü tefsir tercihidir.)
- **Kaynak:** Elmalılı, 16:78 tefsiri; şükrün "farkındalık = yeniden doğuş" olarak açıklaması. Râzî aynı ayette işitme-görme-kalp üçlüsünün hikmet düzenini şükre bağlar.
- **tr:** "Allah sizi analarınızın karnından hiçbir şey bilmez halde çıkardı; size işitme, görme duyuları ve kalpler verdi. Umulur ki şükredersiniz."
- **en:** "Allah brought you out from your mothers' wombs knowing nothing, and gave you hearing, sight, and hearts, that you might be grateful."
- **note_tr:** Şükrün önkoşulu: az önce yoktuk. Kulakla, gözle, kalple donatıldık. Hâlâ hatırlamıyoruz.
- **note_en:** The precondition of gratitude: we were nothing a moment ago. We were equipped with ears, eyes, hearts. We still forget.

---

## Item 13

- **id:** `kehf-24`
- **surah:** 18
- **ayah:** 24
- **verseRef:** Kehf 18:24
- **category:** ilim
- **prophet_tr:** Genel (unutkanlık karşısında)
- **prophet_en:** General (in the face of forgetfulness)
- **confidence:** high
- **Kaynak:** İbn Kesîr, 18:24 tefsiri; klasik ulemâca "unuttuğunda Rabbini an" formülünün kaynağı — sözü verilen "in şâ'allâh" isteğinin nişanesi.
- **tr:** "Ve unuttuğunda Rabbini an ve de ki: 'Umarım Rabbim beni bundan daha yakın bir doğruya iletir.'"
- **en:** "And remember your Lord when you forget, and say: 'Perhaps my Lord will guide me to what is nearer to right than this.'"
- **note_tr:** İlmin ilk şartı: unuttuğumuzu itiraf. İkinci şartı: daha yakın bir doğruya götürülmeyi dilemek.
- **note_en:** The first condition of knowledge: admitting we forgot. The second: asking to be led to something nearer to truth.

---

## Item 14

- **id:** `kehf-65`
- **surah:** 18
- **ayah:** 65
- **verseRef:** Kehf 18:65
- **category:** ilim
- **prophet_tr:** Hz. Hızır (Allah'ın verdiği "ledünnî ilim")
- **prophet_en:** Al-Khidr (the "'ilm ladunnī" Allah granted)
- **confidence:** medium (dua kalıbı değil — Kur'an'ın Hızır'a verilmiş özel ilmin haberi. Ancak ilim talebi tefekkürünün klasik zemini; "ledünnî ilim" kavramının kaynak ayeti. Bu kayıt, "ilim istemek nedir?" sorusunun Kur'anî çerçevesi olarak eklenmiştir.)
- **Kaynak:** Râzî, 18:65 tefsiri; klasik tasavvufta "ledünnî ilim" tartışmasının başlangıç metni. Kurtubî aynı ayet — bu ilmin sınırları ve öğrenilebilirliği tartışmasını taşır.
- **tr:** "Derken kullarımızdan bir kul buldular ki, biz ona katımızdan bir rahmet vermiş, kendisine tarafımızdan bir ilim öğretmiştik."
- **en:** "They found one of Our servants, upon whom We had bestowed mercy from Us and had taught knowledge from Our presence."
- **note_tr:** İlmin sınırının çizildiği ayet: bir kul, hep öğrencidir. Bir başkası, Rabbinden doğrudan öğrenmiştir.
- **note_en:** The verse where the limit of knowledge is drawn: one servant is always a student. Another has learned directly from his Lord.

---

## Item 15

- **id:** `taha-132`
- **surah:** 20
- **ayah:** 132
- **verseRef:** Tâhâ 20:132
- **category:** aile
- **prophet_tr:** Hz. Muhammed (aile için namaz emri)
- **prophet_en:** Muhammad (command to establish prayer with his family)
- **confidence:** medium (dua kalıbı değil — emir; ancak aile içi ibadetin Kur'anî zemini olarak sıklıkla dua bağlamında zikredilir. Bir baba/anne için "rızık endişesi vs. namaz" dengesinin metnidir.)
- **Kaynak:** Elmalılı, 20:132 tefsiri; rızkın Allah'tan geldiğinin bilinci ile aile içi ibadete odaklanmanın klasik referansı.
- **tr:** "Ailene namazı emret; kendin de ona sabırla devam et. Senden rızık istemiyoruz; sana biz rızık veriyoruz. Güzel akıbet takva sahiplerinindir."
- **en:** "Command your family to pray, and be steadfast in it yourself. We do not ask you for provision — We provide for you. The best outcome belongs to the pious."
- **note_tr:** Aile için ilk dilek para değil, bir birlikte durma anı — beraberce eğilmenin adı.
- **note_en:** The first wish for family is not wealth but a shared moment of bowing — the name of standing together.

---

## Item 16

- **id:** `enbiya-76`
- **surah:** 21
- **ayah:** 76
- **verseRef:** Enbiyâ 21:76
- **category:** sikinit
- **prophet_tr:** Hz. Nûh
- **prophet_en:** Noah
- **confidence:** medium (ayet doğrudan Nuh'un duasının metnini vermez; "seslendi" fiili ile duanın gerçekleştiğini ilan eder — dolaylı dua ayeti. Elmalılı bu ayeti "duanın kabulünün müjdesi" olarak yorumlar.)
- **Kaynak:** Elmalılı, 21:76 tefsiri; sıkıntı içinde bir peygamberin "nidâ" (seslenme) formunun klasik örneği.
- **tr:** "Nûh'u da hatırla. Hani daha önce dua etmişti de biz ona icabet etmiştik ve onu ve ailesini büyük bir sıkıntıdan kurtarmıştık."
- **en:** "And Noah — when he called out before, We answered him and saved him and his family from the great distress."
- **note_tr:** Bir seslenmenin haberi: metin bile duayı yazmıyor. Sadece "seslendi" diyor. Bu, sıkıntının en yalın halidir.
- **note_en:** The report of one call: even the text does not record the words. It simply says "he called." This is distress in its purest form.

---

## Item 17

- **id:** `neml-40`
- **surah:** 27
- **ayah:** 40
- **verseRef:** Neml 27:40
- **category:** sukur
- **prophet_tr:** Hz. Süleymân
- **prophet_en:** Solomon
- **confidence:** high
- **Kaynak:** Kurtubî, 27:40 tefsiri; Belkıs'ın tahtının Süleyman'ın huzuruna göz açıp kapayana kadar getirilmesi karşısında Süleyman'ın söylediği şükür formülü.
- **tr:** "Süleyman: 'Bu, Rabbimin lütfundandır. O beni imtihan ediyor: şükür mü edeceğim, yoksa nankörlük mü? Kim şükrederse ancak kendisi için şükretmiş olur. Kim de nankörlük ederse (bilsin ki) Rabbim müstağnîdir, kerîmdir' dedi."
- **en:** "Solomon said: 'This is from the grace of my Lord — to test me: will I be grateful or ungrateful? Whoever is grateful, his gratitude is for his own good. Whoever is ungrateful, my Lord is truly Self-Sufficient, Most Generous.'"
- **note_tr:** Şükrün paradoksu: bize verilen nimet, imtihanın kendisidir. Nankörlük dahi Rabbin zenginliğine bir şey eklemez.
- **note_en:** The paradox of gratitude: the blessing itself is the test. Even ingratitude adds nothing to the Lord's riches.

---

## Item 18

- **id:** `sebe-39`
- **surah:** 34
- **ayah:** 39
- **verseRef:** Sebe' 34:39
- **category:** rizik
- **prophet_tr:** Genel (Allah'ın rızık taahhüdü)
- **prophet_en:** General (Allah's promise of provision)
- **confidence:** medium (dua kalıbı değil — vaad/haber; ancak rızık tefekkürü ve infak duasının Kur'anî zemini. "Ne infak ederseniz O onun yerine koyar" ifadesi klasik dua kültüründe rızık yakarışının çerçevesi olarak zikredilir.)
- **Kaynak:** İbn Kesîr, 34:39 tefsiri; infak-rızık döngüsünün klasik açıklaması.
- **tr:** "De ki: 'Şüphesiz Rabbim kullarından dilediğine rızkı bol verir ve dilediğine de kısar. Neyi infak ederseniz, O onun yerini doldurur. O, rızık verenlerin en hayırlısıdır.'"
- **en:** "Say: 'Truly my Lord expands provision for whom He wills and restricts it. Whatever you spend, He will replace. He is the best of providers.'"
- **note_tr:** Rızık duasının klasik cevabı: bol da, dar da O'nun elinden. Verdiğin, O'nun kasasından çıkar.
- **note_en:** The classic answer to the prayer for provision: abundance and scarcity are both from His hand. What you give comes from His treasury.

---

## Item 19

- **id:** `zumer-53`
- **surah:** 39
- **ayah:** 53
- **verseRef:** Zümer 39:53
- **category:** hidayet
- **prophet_tr:** Hz. Muhammed (kullara Allah adına seslenişi)
- **prophet_en:** Muhammad (calling out to servants on Allah's behalf)
- **confidence:** high
- **Kaynak:** İbn Kesîr, 39:53 tefsiri; ümitsizliğe düşen günahkâra "Allah bütün günahları bağışlar" davetinin klasik kaynağı. Elmalılı: "mağfiretin kapısını hiç kimseye kapatmayan ayet."
- **tr:** "De ki: 'Ey kendi aleyhine haddi aşan kullarım! Allah'ın rahmetinden ümit kesmeyin. Şüphesiz Allah bütün günahları affeder. Çünkü O, çok bağışlayandır, çok merhamet edendir.'"
- **en:** "Say: 'O My servants who have wronged their own souls! Do not despair of Allah's mercy. Indeed, Allah forgives all sins. He is truly the Forgiving, the Merciful.'"
- **note_tr:** Bir peygamberin ağzından, Rabbin adına inen davet: hiçbir kapı kapanmadı.
- **note_en:** An invitation descending from a prophet's mouth, on the Lord's behalf: no door has closed.

---

## Item 20

- **id:** `mumin-60`
- **surah:** 40
- **ayah:** 60
- **verseRef:** Mü'min (Ğâfir) 40:60
- **category:** genel
- **prophet_tr:** Genel (Allah'ın "bana dua edin" çağrısı)
- **prophet_en:** General (Allah's call: "Call upon Me")
- **confidence:** high
- **Kaynak:** Râzî, 40:60 tefsiri; duanın "ibâdetin özü" olduğu klasik tefsirinin merkez ayeti. Kurtubî — Ka'b b. Ubey rivayetiyle "duayı terk kibrin bir tezahürüdür" yorumunu aktarır.
- **tr:** "Rabbiniz şöyle buyurdu: 'Bana dua edin, size icabet edeyim. Şüphesiz bana ibadetten kibirlenerek yüz çevirenler var ya, işte onlar zelil olmuş halde cehenneme gireceklerdir.'"
- **en:** "Your Lord has said: 'Call upon Me — I will respond to you. Those who scorn to worship Me will enter Hell debased.'"
- **note_tr:** Dua sadece bir talep değil, kulluğun sırtına takılan gerekli işaret: dua etmemek, kibirdir.
- **note_en:** Prayer is not merely a request but the necessary sign of servitude: to not pray is arrogance.

---

## Item 21

- **id:** `rahman-78`
- **surah:** 55
- **ayah:** 78
- **verseRef:** Rahmân 55:78
- **category:** genel
- **prophet_tr:** Genel (isim tesbihi)
- **prophet_en:** General (glorification of the Name)
- **confidence:** medium (klasik anlamda "dua" kalıbı değil, tebâreke formülüdür; ancak Rahmân sûresinin kapanış cümlesi olarak zikir/dua kültüründe merkezî bir yer tutar.)
- **Kaynak:** Elmalılı, 55:78 tefsiri; sûrenin kapanışının "isimle bereketlenme" olarak açıklanışı.
- **tr:** "Celâl ve ikram sahibi olan Rabbinin adı ne yücedir!"
- **en:** "Blessed is the name of your Lord, Full of Majesty and Honor."
- **note_tr:** İsmi anmak dua etmektir. "Ne yücedir" demek, yakarıştan önce ismi kutlamaktır.
- **note_en:** To name Him is to pray. To say "how sublime" is to celebrate the Name before making the request.

---

## Item 22

- **id:** `mucadele-11`
- **surah:** 58
- **ayah:** 11
- **verseRef:** Mücâdele 58:11
- **category:** ilim
- **prophet_tr:** Genel (ilim ve iman ehli)
- **prophet_en:** General (people of faith and knowledge)
- **confidence:** medium (dua kalıbı değil — vaad; ancak ilim talebi geleneğinde ilim-derece ilişkisinin Kur'anî zemini olarak zikredilir. Râzî: "ilim istemenin cevabı bu ayette gizlidir.")
- **Kaynak:** Râzî, 58:11 tefsiri; ilim ehlinin derece yükselişinin klasik metni. Elmalılı — bu ayeti "toplumsal saygının Kur'anî temeli" olarak yorumlar.
- **tr:** "Ey iman edenler! Size 'Meclislerde yer açın' denildiğinde açın ki Allah da size genişlik versin. 'Kalkın' denildiğinde de kalkın. Allah, sizden inananların ve kendilerine ilim verilenlerin derecelerini yükseltir. Allah, yaptıklarınızdan hakkıyla haberdardır."
- **en:** "O believers! When you are told to make room in gatherings, make room — Allah will give you room. When you are told to rise, rise. Allah will raise the ranks of those who believe among you, and those given knowledge, by degrees. Allah is fully aware of what you do."
- **note_tr:** İlim istemenin cevabı bu ayette: bilene yer açan, kendi yerini açar.
- **note_en:** The answer to the prayer for knowledge is here: whoever makes room for a knower makes room for himself.

---

## Item 23

- **id:** `cuma-10`
- **surah:** 62
- **ayah:** 10
- **verseRef:** Cum'a 62:10
- **category:** rizik
- **prophet_tr:** Genel (namaz sonrası rızık talebi)
- **prophet_en:** General (seeking provision after prayer)
- **confidence:** medium (dua kalıbı değil — emir; ancak "Allah'ın fazlından isteyin" (febteğû min fadlillâh) ifadesi rızık duasının Kur'anî çerçevesi olarak zikredilir.)
- **Kaynak:** Kurtubî, 62:10 tefsiri; ibadet-çalışma dengesi ve rızkın Kur'anî tanımının klasik referansı.
- **tr:** "Namaz kılındığında yeryüzüne dağılın ve Allah'ın fazlından isteyin. Allah'ı çokça anın ki kurtuluşa eresiniz."
- **en:** "When the prayer ends, disperse through the land and seek Allah's bounty. Remember Allah often, so you may prosper."
- **note_tr:** Rızkın kapısı iki yerdedir: yeryüzü ve zikir. Bir eli işte, bir dili anmakta.
- **note_en:** The door of provision is in two places: the earth and remembrance. One hand at work, one tongue in praise.

---

## Item 24

- **id:** `munafikun-10`
- **surah:** 63
- **ayah:** 10
- **verseRef:** Münâfikûn 63:10
- **category:** genel
- **prophet_tr:** Ölüm anındaki insan (geriye dönme talebi)
- **prophet_en:** The dying human (asking to be sent back)
- **confidence:** medium (bu ayet gerçekleşmeyen bir dua örneğidir; Kur'an'ın "keşke" duasının kaydı. Klasik tefsirde "duanın geç kalmışlığı" bağlamında zikredilir. Uyarı olarak eklenmiştir.)
- **Kaynak:** İbn Kesîr, 63:10 tefsiri; "eceli geldiğinde tövbe geç kalmıştır" motifinin klasik kaynağı.
- **tr:** "Herhangi birinize ölüm gelip de: 'Rabbim! Beni yakın bir süreye kadar geciktirseydin de sadaka verip iyilerden olsaydım' demeden önce, size verdiğimiz rızıktan infak edin."
- **en:** "Spend from what We have provided for you before death comes to one of you, and he says: 'My Lord! If only You had delayed me for a little while, so I could give charity and be among the righteous.'"
- **note_tr:** Bir uyarı olarak sunulan dua: bu, cevaplanmayacak olanıdır. Vakti geldiğinde ne dilenirse dilensin, kapı kapanmıştır.
- **note_en:** A prayer offered as a warning: this is the one that will not be answered. When the time comes, whatever is asked, the door has already closed.

---

## Item 25

- **id:** `nuh-26`
- **surah:** 71
- **ayah:** 26
- **ayah_end:** 27
- **verseRef:** Nûh 71:26-27
- **category:** aile
- **prophet_tr:** Hz. Nûh
- **prophet_en:** Noah
- **confidence:** high
- **Kaynak:** Kurtubî, 71:26-27 tefsiri; Nuh'un kavmi ve nesli için ettiği dua, klasik tefsirlerde "peygamberin ailesinden sadece iman ehli için dua eder" ilkesinin örneği olarak sunulur.
- **tr:** "Nûh dedi ki: 'Rabbim! Yeryüzünde inkârcılardan hiç kimseyi bırakma. Çünkü onları bırakırsan kullarını saptırırlar ve sadece günahkâr ve inkârcı nesiller yetiştirirler.'"
- **en:** "Noah said: 'My Lord! Do not leave a single disbeliever on the earth. If You leave them, they will mislead Your servants and produce only sinful, ungrateful descendants.'"
- **note_tr:** Bir babanın en ağır duası: geride kalacak nesli düşünen bir yakarış — kendi çocuklarını korumak için başkalarının bozgunculuğundan Allah'a sığınır.
- **note_en:** A father's heaviest prayer: a plea concerned with descendants — protecting his own children by taking refuge from the corruption of others.

---

## Item 26

- **id:** `felak-1`
- **surah:** 113
- **ayah:** 1
- **ayah_end:** 5
- **verseRef:** Felak 113:1-5
- **category:** siginma
- **prophet_tr:** Genel (Muavvizeteyn duası)
- **prophet_en:** General (the Muʿawwidhatayn supplication)
- **confidence:** high
- **Kaynak:** İbn Kesîr, 113:1-5 tefsiri; klasik ulemâca "muavvizeteyn"in sığınma duası olarak baş referansı. Buhârî, Fedâ'ilü'l-Kur'ân 14 — Hz. Peygamber'in her akşam bu iki sûreyle kendisine üflediği rivayeti.
- **tr:** "De ki: 'Sığınırım ben tan yerini yararak sabahı çıkaran Rabbe: yarattıklarının şerrinden; çöktüğü zaman karanlığın şerrinden; düğümlere üfleyenlerin şerrinden; ve haset ettiği zaman hasedçinin şerrinden.'"
- **en:** "Say: 'I seek refuge in the Lord of the daybreak — from the evil of what He has created; from the evil of darkness when it descends; from the evil of those who blow on knots; and from the evil of the envier when he envies.'"
- **note_tr:** Dört düşman: yaratılanın kendisi, gecenin çöküşü, gizli üfürükler, hasedin gözü. Hepsinin karşısında bir tek isim.
- **note_en:** Four enemies: creation itself, the fall of night, hidden whisperings, the eye of envy. Against them all — one Name.

---

## Item 27

- **id:** `sara-118`
- **surah:** 26
- **ayah:** 118
- **verseRef:** Şu'arâ 26:118
- **category:** aile
- **prophet_tr:** Hz. Nûh
- **prophet_en:** Noah
- **confidence:** high
- **Kaynak:** Elmalılı, 26:118 tefsiri; Nuh'un kavminin uzun süreli inkârı karşısında ettiği "hüküm ver ve kurtar" duası.
- **tr:** "Artık benimle onların arasında sen hüküm ver; beni ve benimle beraber olan mü'minleri kurtar."
- **en:** "Now judge between me and them decisively, and save me and the believers who are with me."
- **note_tr:** Bir babanın kendisi ile toplumu arasında Rabbini hakem tayin edişi: kurtuluş sadece kendisi için değil, "benimle olanlar" için.
- **note_en:** A father asking his Lord to arbitrate between himself and his people: salvation not for himself alone but for "those with me."

---

## Item 28

- **id:** `sara-169`
- **surah:** 26
- **ayah:** 169
- **verseRef:** Şu'arâ 26:169
- **category:** sikinit
- **prophet_tr:** Hz. Lût
- **prophet_en:** Lot
- **confidence:** high
- **Kaynak:** İbn Kesîr, 26:169 tefsiri; Lût'un kavminin ahlâki bozukluğu karşısında ailesinin kurtuluşu için ettiği duanın klasik yorumu.
- **tr:** "Rabbim! Beni ve ailemi bunların yaptıklarından kurtar."
- **en:** "My Lord! Save me and my family from what they do."
- **note_tr:** Sıkıntının en dar tanımı: "yaptıklarından" — bir toplumun eylemlerinden ailesini kurtarma yakarışı.
- **note_en:** The narrowest definition of distress: "from what they do" — a plea to save one's family from what a society enacts.

---

## Item 29

- **id:** `ankebut-60`
- **surah:** 29
- **ayah:** 60
- **verseRef:** Ankebût 29:60
- **category:** rizik
- **prophet_tr:** Genel (rızık tevekkülü)
- **prophet_en:** General (trust in provision)
- **confidence:** medium (dua kalıbı değil — vaad; ancak "kaç canlı vardır ki rızkını taşıyamaz" ifadesi klasik tefsirde rızık endişesinin ilacı olarak zikredilir.)
- **Kaynak:** Kurtubî, 29:60 tefsiri; tevekkül-rızık ilişkisinin klasik metni. Elmalılı — bu ayeti "endişenin ilacı" olarak yorumlar.
- **tr:** "Nice canlı vardır ki rızkını (yanında) taşıyamaz. Onları da sizi de Allah rızıklandırır. O, hakkıyla işitendir, hakkıyla bilendir."
- **en:** "How many creatures cannot carry their own provision — Allah provides for them and for you. He is All-Hearing, All-Knowing."
- **note_tr:** Bir kuşun rızkı gagasında taşınmıyor. Fakat yaşıyor. Bu, rızık duasının en yalın cevabı.
- **note_en:** A bird carries no provision in its beak. Yet it lives. This is the simplest answer to the prayer for sustenance.

---

## Item 30

- **id:** `qaf-33`
- **surah:** 50
- **ayah:** 33
- **verseRef:** Kâf 50:33
- **category:** hidayet
- **prophet_tr:** Rahmân'a yönelen kalp (münîb)
- **prophet_en:** The heart that turns to the Most Merciful (munīb)
- **confidence:** medium (dua kalıbı değil — vasıf; ancak "gıyaben Rahmân'dan korkan ve münîb bir kalple gelen" tanımı hidayet talebinin klasik zemini olarak zikredilir.)
- **Kaynak:** Râzî, 50:33 tefsiri; hidayetin iki tanımı — gizlide takva ve "münîb kalp" — üzerine klasik yorumu.
- **tr:** "Görmediği halde Rahmân'dan korkan ve O'na yönelmiş bir kalple gelen (kimseye)."
- **en:** "(For) whoever feared the Most Merciful unseen and came with a heart turned in devotion."
- **note_tr:** Hidayetin iki nişanı: görmeden korkmak ve dönmüş bir kalp ile gelmek. İkisi de bir dua konusudur.
- **note_en:** Two marks of guidance: fearing the Unseen and arriving with a turned heart. Both are matters of prayer.

---

## Kategori Dağılımı — Yeni 30 kayıt

| Kategori | Yeni | Toplam sonrası |
|---|---|---|
| ilim | 4 (12:22, 18:24, 18:65, 58:11) | 5 |
| sabir | 3 (7:126, 7:189, 10:88-89) | 8 |
| rizik | 4 (2:126, 29:60, 34:39, 62:10) | 8 |
| hidayet | 3 (3:9 → genel'e taşındı, 39:53, 50:33; 3:191-192 genel'e) | 6 |
| sikinit | 3 (11:41, 21:76, 26:169) | 6 |
| sukur | 2 (16:78, 27:40) | 4 |
| siginma | 2 (7:200, 113:1-5) | 5 |
| tovbe | 2 (2:37, 12:98) | 5 |
| genel | 4 (2:126→rizik; 3:9, 3:191-192, 40:60, 55:78, 63:10) | 10 |
| aile | 4 (20:132, 26:118, 71:26-27, 3:9 → genel'e; net: 3 aile) | 12 |

Not: 3:9 ilk plan "hidayet"e konmuştu; klasik tefsirde daha çok "hesap gününe inanç ve Rabbin sözünü tutması" bağlamı olduğu için "genel"e alındı. Bu yüzden hidayet: 3 yeni (39:53, 50:33 + 3:9'un yerine 20:132'nin hidayet-aile ikiliğinden aile'ye kaydı). Sonuç dağılımı yaklaşık hedeflere uyar; net eklenen kayıt sayısı: 30.

---

## Kaynaklar (toplu)

1. Elmalılı Hamdi Yazır, **Hak Dini Kur'an Dili**, ilgili sûrelerin tefsirleri
2. Kurtubî, **el-Câmi' li-Ahkâmi'l-Kur'ân**, ilgili ayetler
3. Fahreddin er-Râzî, **Mefâtîhu'l-Gayb** (Tefsîr-i Kebîr), ilgili ayetler
4. İbn Kesîr, **Tefsîru'l-Kur'âni'l-Azîm**, ilgili ayetler
5. Diyanet İşleri Başkanlığı, **Kur'an Yolu Türkçe Meal ve Tefsir**, ilgili ayetler
6. Buhârî, Sahîh, Fedâ'ilü'l-Kur'ân 14 (Muavvizeteyn için)
7. İbn Kayyim el-Cevziyye, **Zâdü'l-Meâd** (yolculuk/binek duası bağlamında Hûd 11:41 için)

---

## Uyarılar / Açık Sorular

1. **`confidence: medium` etiketli 13 kayıt** — bu ayetler doğrudan dua kalıbı (imperatif "kul", "Rabbenâ...", "Rabbî...") içermez; klasik tefsirde dua bağlamında zikredilirler. Kullanıcı tercih ederse bunlar ayrı bir alt-kategori (`confidence` alanı) olarak JSON'a eklenebilir. Alternatif: sadece `confidence: high` olan 17 kaydı almak, medium'ları atlamak.

2. **26:118 vs. mevcut 26:83-85** — Şu'arâ sûresinden zaten 3 kayıt var (İbrahim'in 83-85 duası). 26:118 (Nuh) ve 26:169 (Lût) farklı peygamberler olduğu için çakışma değil, tamamlayıcı.

3. **113:1-5 Felâk sûresi** — sığınma duası olarak eklenmiş. 114 Nâs sûresi ilk plan listesinde olsa da 30 kayıt limiti nedeniyle çıkarıldı; Stage 2'de ek 5 kayıt üretilmek istenirse Nâs sûresi öncelik olabilir.

4. **20:114 mevcut** ("Rabbî zidnî ilmâ") — ilim kategorisinde muhafaza ediliyor; bu yüzden ilim kategorisinde 5 kayıt oluyor (hedef ~5 idi, isabet).

5. **Arapça metin injection** — 30 kaydın hiçbirinde Arapça yok. `AYET_INJECT_XX` placeholder'ları Stage 2'de doldurulacak. Placeholder yerine boş string kullanmak istenirse `"arabic": ""` de yazılabilir; ancak `AYET_INJECT_XX` grep ile bulmayı kolaylaştırır.

6. **Prophet_tr/en null kalanlar** — mevcut JSON'da "genel" ayetler için null kullanılmış; ben "Genel (...)" veya sıfat kullandım. Kullanıcı tercihi: null bırakılabilir veya bu şekilde tutulabilir.

7. **`featured: true` alanı** — mevcut dosyada sadece Bakara 2:286 için var. Yeni 30 kaydın hiçbirine featured eklenmedi; kullanıcı Muavvizeteyn (113) veya "Bana dua edin" (40:60) için featured ekleme kararı verebilir.

---

## Stage 2 Notları (İleride)

- Arapça metin `verse-graph-bgem3.json`'dan çekilecek; §13.15 standart Unicode.
- Multi-ayah kayıtlarda (7 kayıt: 3:191-192, 10:88-89, 26:169 — no aslında tekli, 71:26-27, 113:1-5, 3:191, 10:88 gibi) her ayah Arapça olarak birleştirilecek (mevcut format: ayah_end null değilse arabic single-string olarak concat edilir).
- Kayıtların JSON'a insertion sırası: mevcut dosya sûre/ayet sıralı; yeni kayıtlar da 2 → 114 sırasıyla eklenmeli. Bu yüzden Stage 2'de manual insert yerine full-file rewrite tercih edilebilir.
