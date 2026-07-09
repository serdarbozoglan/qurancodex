# QuranCodex İçerik Denetim Raporu — /atlas/ibadetler HUB
Tarih: 2026-07-09
Denetçi: qc-content-auditor
Kapsam: `next/public/ibadetler/hub.json` (280 sat.), `IbadetlerHub.jsx` render, `verse-graph-bgem3.json` cross-check.

## Özet
- Kritik: 1 · Orta: 3 · Minör: 2 · Tartışmalı: 2 · Doğrulanan: 6

---

## 🔴 Kritik

### [K1] `wowFacts[3]` — "Tövbe, Allah'ın da yaptığı **tek** 'ibadet' fiili" (hub.json:67)
**İddia:** *"Tövbe — Kur'ân'da Allah'ın da yaptığı **tek** 'ibadet' fiili"*
**Sorun:** "Tek" (only) kuvvetli bir ekskluzivite iddiası ve akademik olarak **savunulamaz**. Kur'ân'da Allah'a nispet edilen "kul-fiil paraleli" birden fazladır:
- **Zikr:** kul (2:152 *fezkurûnî*) ↔ Allah (*ezkurkum* — aynı ayet). Bu HUB'ın kendi 6. sütunu.
- **Şükr:** kul (2:152 *veşkurû lî*) ↔ Allah "şâkir/şekûr" (2:158, 4:147, 35:30).
- **Sabr / muhabbet / rahmet** benzer şekilde çift-yönlü.
- Nitekim İngilizce başlıkta da *"the only 'worship' verb"* ifadesi geçer — kaynaksız.
**Öneri:** `titleTr` → *"Tövbe — Kur'ân'da Allah'ın da özneleştiği nadir 'ibadet' fiili"*; İngilizce paralel *"a rare 'worship' verb..."*. Böylece semantik gözlem doğru, ekskluzivite iddiası düşürülmüş olur.

---

## 🟠 Orta

### [O1] `pillars[7].anchorRef` — Tövbe için Nur 24:31 seçimi (hub.json:182)
**İddia:** Tövbe sütununun ana referansı **Nur 24:31**.
**Sorun:** Nur 24:31 birincil olarak **kadınların örtünmesi / bakışın indirilmesi** ayetidir; *"ve tûbû ilâllâhi cemîan"* ifadesi ancak ayetin **son cümlesi**dir (~%90 tesettür, %10 tövbe kapanışı). Tövbe için Kur'ân'ın *lokus classicus*'u değildir.
**Kanıt:** Ayetin bütünü tesettür/mahremiyet düzenlemesidir; "tövbe kapısı" klasik tefsirlerde (Râzî, Kurtubî) **Tahrîm 66:8** (*tûbû ilâllâhi tevbeten nasûhâ*), **Nisâ 4:17-18** veya **Zümer 39:53-54** üzerinden inşâ edilir.
**Öneri:** `anchorRef: "Tahrîm 66:8"` (nasuh tövbe) veya `"Zümer 39:53"` (rahmet kapısı). Nur 24:31 ancak "toplu tövbe daveti" alt-notu olarak kalabilir.

### [O2] `wowFacts[1]` — "Namaz-zekât 32 kez yan yana" sayısı (hub.json:47)
**İddia:** *"…formülü otuzu aşkın (32) yerde tekrarlanır."*
**Sorun:** Bu sayı akademik olarak **standart bir rakam değildir**. Yaygın olarak dolaşan rakamlar 27, 28 veya "yaklaşık 30" civarındadır; farklı sayımlar farklı kriterler kullanır (yalnız *ekîmu's-salâte ve âtu'z-zekâte* formülü mü, yoksa aynı ayette geçen her salât+zekât mı? *âtu'z-zekât* dışında *fî emvâlihim hakkun* gibi zekât dolaylıları da sayılıyor mu?). "32" için birincil bir klasik kaynak (Râzî, Kurtubî, Süyûtî İtkân) referansı **verilmemiştir** — sadece 5 örnek ayet listelenmiştir.
**Kanıt:** `kaynak` alanında *"Râzî, Bakara 2:43 tefsiri (formül analizi)"* deniyor; Râzî bu tefsirde formülün sıklığına genel değinir ancak "32" spesifik sayısını klasik metinde bulmak zor. Modern Türk literatüründe (Karaman, Zuhaylî tercüme) da rakam **28** olarak geçer.
**Öneri:** "32" iddiasını **"otuza yakın yerde"** veya **"27+"** şeklinde revize et; kaynak olarak sayı veren bir modern çalışma (örn. M. Fuâd Abdulbâkî, *el-Muʿcem el-mufehres*) referanslanmalı — yoksa `confidence: "medium"` + `"doğrulanmalı"` flag'i.

### [O3] `wowFacts[0]` — "'abd' kökü 275+ türev" (hub.json:37)
**İddia:** *"'abd' kökü Kur'ân'da 275+ türev"*
**Sorun:** "Türev" kelimesi belirsiz. Îzutsu §3'te ʿ-b-d kökünün semantik alanı sistematik incelenir ama **birebir "275+" sayısı verilmez**; Îzutsu bu tür istatistiksel toplamaları genellikle vermez, kavramsal analiz yapar. Klasik sayım (M. F. Abdulbâkî) ʿ-b-d kökünün toplam **275** kez geçtiğini bildirir (kök tekrarı, türev değil). "Türev" ile "geçiş" karıştırılmış.
**Öneri:** `titleTr` → *"'abd' kökü Kur'ân'da 275 kez geçer"*; kaynak Abdulbâkî *Muʿcem*; Îzutsu semantik alan analizi için ayrı cümlede. Terminoloji: "türev" (derivative) yerine "geçiş" (occurrence).

---

## 🟡 Minör

### [M1] `abdCore.coreAyet.ar` — imlâ (hub.json:28)
`اِيَّاكَ نَعْبُدُ` — mushaf imlasında hemze-i vasl (**إِيَّاكَ** U+0625 hemze altta) tercih edilir; `اِ` (bare alef + kasra U+0650) doğru olsa da §13.15 uyarınca standart encoding zaten kabul; bu **kabul edilebilir**. Ancak Fatiha ayet numarası mezhepler arasında farklı: Kûfe sayımı **1:5**, Basra/Şâm sayımı **1:4** (Besmele bağımsız sayılırsa). HUB Kûfe'yi kullanıyor — bu Diyânet mushafıyla uyumlu, sorun yok, ancak "1:5" başka bölgelerde farklıdır (dip not eklenebilir).

### [M2] Îzutsu tarih ve yayıncı — "1966 (McGill-Queen's)" (hub.json:221)
*Ethico-Religious Concepts in the Qur'an* ilk baskısı 1959 (Keio Institute, Tokyo, *The Structure of the Ethical Terms in the Koran* adıyla); genişletilmiş baskı **1966 McGill Islamic Studies** (Montreal); mevcut yaygın baskı 2002 **McGill-Queen's University Press**. "1966 (McGill-Queen's)" karışım — 1966'da yayıncı henüz "McGill Islamic Studies", McGill-Queen's yeniden basımı 2002. `period` → **"1966 (McGill Islamic Studies)"** daha doğru.

---

## 🟣 Tartışmalı

### [T1] `framingTr` — "Klasik Ehl-i Sünnet çerçevesi ve dört mezhep" (hub.json:190)
Bu framing içerik pozisyonu olarak **meşrû** (siteni Sünnî tefsir omurgasında konumlandırıyor) ancak "Kur'ân ilke koyar, sünnet tafsil eder" cümlesi **Kur'aniyyûn / Ehl-i Kur'ân** akımını implisit dışlar. Bu iyi bir editoryal karar olabilir, ama footer/metodoloji notunda **"Bu site klasik Ehl-i Sünnet perspektifini takip eder"** şeklinde şeffaflaştırılmalı — kullanıcı beklentisi için.

### [T2] `pillars` — "8 sütun" kanonik değildir
Klasik fıkıhta "İslâm'ın şartları" **5** (kelime-i şehâdet + 4 ibadet). Bu HUB 8 sütun tanımlıyor: kelime-i şehâdet **yok**, buna karşılık zikir, dua, tövbe, kurban ekleniyor. Bu **meşrû bir semantik-teolojik çerçeve** (Îzutsu tarzı), ancak kullanıcı "İslâm'ın 5 şartı" beklentisiyle gelirse şaşırabilir. `framingTr`'ye açıkça yaz: *"Bu çerçeve fıkhî 5 şart değil, Kur'ânî ibadet semantik alanının 8 yüzüdür."*

---

## ✅ Doğrulanan

| Öge | Bulgu |
|---|---|
| `anchorVerse` Zâriyât 51:56 | Metin, çeviri, ref **doğru**. |
| `pillars` Namaz → Tâhâ 20:14 (*ekimi's-salâte li-zikrî*) | **Doğru**, kanonik referans. |
| `pillars` Zekât → Tevbe 9:103 (*huz min emvâlihim sadakah*) | **Doğru**, zekât toplama emri. |
| `pillars` Oruç → Bakara 2:183 (*kutibe ʿaleykumu's-sıyâm*) | **Doğru**, oruç farziyet ayeti. |
| `pillars` Kurban → Hac 22:37 (*len yenâlallâhe luhûmuhâ...*) | **Doğru**, kurban-takva metafiziği ayeti. |
| `pillars` Zikir 2:152, Dua 2:186, Hac 2:196 | **Doğru** (2:196 tam anlamıyla "hac emri" değil, hac ahkâmı ayeti; kabul edilebilir ancak 3:97 daha güçlü). |

---

## Öneriler (Öncelik Sırası)
1. **K1** — Tövbe "tek fiil" iddiasını yumuşat (`"nadir"`).
2. **O1** — Tövbe sütunu `anchorRef`: Nur 24:31 → **Tahrîm 66:8** (veya Zümer 39:53).
3. **O2** — Namaz-zekât "32" → **"27+"** veya **"otuza yakın"**; Abdulbâkî referansı ekle.
4. **O3** — "'abd' 275+ türev" → **"275 geçiş"** + Abdulbâkî; Îzutsu ayrı cümle.
5. **M2** — Îzutsu period: *"1966 (McGill Islamic Studies)"*.
6. **T2** — `framingTr`'de "8 sütun ≠ İslâm'ın 5 şartı" clarification.

## Genel Değerlendirme
HUB'ın **teolojik omurgası sağlam** (Zâriyât 51:56 anchor, ʿ-b-d semantik alanı, Râzî/Kurtubî/Îzutsu triadı), pillar seçimleri (namaz, zekât, oruç, hac, zikir, dua) klasik + semantik açıdan savunulabilir. Sorunlar **iki eksende**: (a) sayısal kesinlik iddiaları (32, 275+) kaynak-zayıf; (b) iki pillar için `anchorRef` seçimi optimal değil (özellikle **Tövbe → Nur 24:31**). K1 + O1 + O2 + O3 düzeltilirse HUB akademik olarak yayınlanabilir seviyeye çıkar.
