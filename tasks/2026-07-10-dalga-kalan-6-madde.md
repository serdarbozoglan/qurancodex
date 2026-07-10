# Dalga 3+4 — Kalan 6 Madde Uygulama Planı

> **Tarih:** 2026-07-10
> **Kapsam:** Bugüne kadar bug fix + hero pattern + CTA + audit fixes tamamlandı.
> Kalan 6 madde SADECE **içerik derinliği + widget engineering** — her biri bir sayfayı 8-9/10'dan 10/10'a taşır.
> **Yöntem:** Her madde için (1) content-producer draft → (2) qc-content-auditor → (3) implement + smoke test → (4) commit + push.
> **Kural referansı:** CLAUDE.md §13 (design tokens), §13.15 (Arabic), §13.17-13.21 (patterns), §14 (mobile).

---

## Sıralama Mantığı

Öncelik: **impact × tractability**.

| Sıra | Madde | Complexity | Content vs Code | Neden bu sıra |
|---|---|---|---|---|
| **1** | Melekler mode-icons + kanat SVG | Düşük-Orta | %60 code, %40 içerik | Görsel etki büyük, veri zaten mevcut, süratli teslim |
| **2** | Kavimler mode-icon set + comparison grid parity | Düşük | %70 code, %30 veri | Aynı pattern Melekler'den taşınır |
| **3** | Renkler interaktif palet + ek 4 renk | Orta | %50-%50 | Widget flagship page için, ek renk veri işi |
| **4** | Yeminler tahaddi tab + kozmoloji widget | Orta-Yüksek | %40 code, %60 içerik | Yeni sekme, yeni JSON alanı, sourcing zorunlu |
| **5** | İlkSon eşleşme viz + kök heatmap | Orta-Yüksek | %70 code, %30 veri | Canvas/SVG viz, mevcut 114-sûre datası hazır |
| **6** | İblis inline data → JSON + vesvese tab + 12 hile widget | Yüksek | %30 code, %70 içerik | En büyük refaktör; içerik daha uzun soluk |

---

## 1. Melekler — 7 Kategori Mode-Icon + Kanat SVG

**Dosya:**
- Modify: `next/src/components/Melekler.jsx` (~1400 satır)
- Modify: `next/public/melekler.json` (veya inline data — kontrol et)
- Test: `/tr/arac/melekler`

### Task 1.1: 7 melek kategorisi için tutarlı line-art SVG icon seti
- [ ] Kategoriler + icon konsepti belirle (Cebrail=vahiy tüyü, Mîkâîl=yağmur/rahmet dalgası, İsrâfîl=sûr trompet, Melek al-Mevt=eğik çizgi, Kirâmen Kâtibîn=iki kalem, Hafaza=çift halka koruyucu, Rıdvan/Mâlik=kapı/anahtar)
- [ ] `MELEK_ICONS` map ekle: her biri 24x24 viewBox, `stroke={COLORS.gold}` gold accent, `strokeWidth={1.8}`, `fill=none`
- [ ] Icon component'ler `Melekler.jsx` içinde inline component olarak yer alsın (KissaAtlas / KavimlerAtlasi pattern'ına uygun)

### Task 1.2: Kanat SVG hero motifi
- [ ] Hero'nun altına yatay yayılan, kanat açılışı (spread wing) SVG motifi ekle — 6 primary feather + 3 secondary
- [ ] Konum: Hero'nun bir alt katmanına, `HeroGeometricBackground` üstünde ama içerik altında (z-index 1 katmanı)
- [ ] Opacity 0.06-0.08, `mixBlendMode: 'screen'` — subtle
- [ ] `<KanatMotif isMobile={...} />` reusable içindeki component olarak yaz

### Task 1.3: Hadis breakdown callout
- [ ] Sayfa içinde "Bu bilgi Kur'ân'da mı, hadiste mi?" 5-satırlık netleştirme callout: Melek isimleri (Kur'ân: 2 açık — Cibril+Mîkâl, Sünnet: İsrâfîl, Azrâîl vd.); Sûr üfleyicisi (Kur'ân: isimsiz, Sünnet: İsrâfîl); vd.
- [ ] Konum: mevcut "Melek isimleri" tabının başına (veya kaynaklar sekmesi altına)

**Kabul kriteri:** Her ayet-doğrulaması (Bakara 2:97-98, Nahl 16:2, Zümer 39:68, Mü'min 40:19, Zâriyât 51:23-30, İnfitâr 82:10-12, Kaf 50:17-18, Ra'd 13:11, Tahrîm 66:6-7) mevcut sayfada zaten atıflanmış; sadece hadis vs Kur'ân ayrımı görsel olarak netleşecek.

---

## 2. Kavimler Atlası — Mode-Icon Set + Comparison Grid Parity

**Dosya:**
- Modify: `next/src/components/KavimlerAtlasi.jsx`
- Reference: `next/src/components/KissaAtlas.jsx` (comparison-grid parity kaynağı)

### Task 2.1: 14 kavim için mode-icon set
- [ ] Her kavim için tek karakteristik icon (Âd=deve/rüzgâr, Semûd=dağ oyulmuş ev, Lût=çevrik şehir, Nûh=gemi, Fir'avn=piramit-taç, Medyen=terazi, Sebe'=baraj, Ashâbü'l-Uhdûd=hendek, Ashâbü'l-Fîl=fil, Ashâbü'l-Kehf=mağara, İsrâîloğulları=çadır sütunu, vd.)
- [ ] Tutarlı stroke 1.8, gold accent, 24x24
- [ ] Kartlarda kullan + mobile chip'lerde kullan

### Task 2.2: Comparison grid parity
- [ ] KissaAtlas'ın "5 sahne — 4 peygamber" grid pattern'ını Kavimler için uyarla
- [ ] Grid eksenleri: kavim × [1. peygamber, 2. mesaj, 3. red/kabul, 4. azap türü, 5. bugünkü iz]
- [ ] Filter/sort iptaline hazır; tab bar'a "Karşılaştırma" tab'ı ekle

**Kabul kriteri:** Mevcut "Kavimler" tabındaki içerik korunur; yeni bir "Karşılaştırma" tab'ı 14 satırlı grid ile eklenir; her kavim icon ile görsel olarak ayırt edilir.

---

## 3. Kur'an'ın Renkleri — İnteraktif Palet + Ek 4 Renk

**Dosya:**
- Modify: `next/public/kuranin-renkleri.json` (mevcut 8 renk → 12)
- Modify: `next/src/components/KuranRenkleri.jsx`

### Task 3.1: Content-producer ile 4 yeni renk drafle
Öneriler (aday alanlar):
- **Kâfûr** (İnsan 76:5) — beyaz-buz — Cennet içeceklerinden karma
- **Zencebîl-Selsebîl** (İnsan 76:17-18) — parfüm/tat, renk metaforu
- **Bakış rengi (ezreq)** (Tâhâ 20:102) — "gökmâvi mahşer bakışı" — daha bugüne kadar ayrı ele alınmamış (existing "mavi" ile birleşebilir; skip)
- **Şafak** (İnşikâk 84:16) — kırmızı-turuncu twilight (mevcut "kırmızı" ile ayrı, çünkü zaman-anahtar)
- **Muddhâmmatân** (Rahmân 55:64) — koyu yeşil hapax (mevcut "yeşil"e alt-tema olarak; ayrı entry mi yeşile embed mi?)
- **Berk / Şu'â** (Bakara 2:20, Rûm 30:24) — şimşek/ışık gradyanları
- **Yakut / Mercân** (Rahmân 55:22, 55:58) — kırmızı taş renkleri
- **Işık spektrumu ordinal** — "yeşil→sarı→ihtiyar" (12:84 "abyeddat aynâhu" — Yakub'un gözlerinin bembeyaz oluşu) hidayet-hüzün semantik hattı

Producer önerileri: **Şafak**, **Yakut/Mercân**, **Kâfûr**, **Berk** — 4 gerçekten ayrı renk-anlam alanı.

### Task 3.2: İnteraktif palet widget
- [ ] Yeni tab: "Palet" — 12 rengin dairesel palette layout (renk çemberi konsepti)
- [ ] Hover: rengin hex + anlam alanı popover
- [ ] Click: renk sayfası scroll to
- [ ] Renk-renk arasında geçiş animasyonu (0.3s ease)

**Kabul kriteri:** 8→12 renk, palet widget ile navigasyon çalışıyor, mobil'de linear grid'e düşüyor.

---

## 4. Kur'an'ın Yeminleri — Tahaddi Tab + Kozmoloji Widget

**Dosya:**
- Modify: `next/public/kuran-yeminleri.json` (yeni alan: `tahaddi`, `kozmoloji`)
- Modify: `next/src/components/KuranYeminleri.jsx`

### Task 4.1: Tahaddi ayetlerini content-producer'a draft ettir
6 ana tahaddi (challenge) ayeti:
- Bakara 2:23-24 — "bir sûre getirin"
- Yunus 10:38 — "bir sûre uydurun"
- Hûd 11:13 — "on sûre uydurun"
- İsrâ 17:88 — "insanlar ve cinler bir araya gelse..."
- Tûr 52:33-34 — "onun benzeri bir söz getirsinler"
- Vâkı'a 56:81-82 — "bu sözü mü küçümsüyorsunuz?"

Her entry: ref, ar (§13.15), tr, en, tahaddi type (structural / rhetorical / miraculous), tefsir source.

### Task 4.2: Yeni tab "Tahaddi"
- [ ] Tab bar'a chip: "TAHADDİ" (uppercase, gold)
- [ ] İçerik: 6 tahaddi ayeti kart grid (2-col desktop, 1-col mobile)
- [ ] Üst callout: "Yemin kur'ânî tahaddinin dilbilimsel karşıtıdır. Yemin ederken kâinatı, tahaddi ederken metni işaret eder." (auditor-doğrulamalı framing)

### Task 4.3: Kozmoloji widget
- [ ] Content: 12 kozmik referans (fecr, leyl, duhâ, mesâbîh, necm, güneş, ay, felek, yaratılış 6 gün, semâ 7 kat, kürsî, arş)
- [ ] Widget: dairesel/dikey timeline — yemin edilen kâinat objelerinin listesi + Kur'ânî referans + 1-satır bilimsel değini (nötr dille, "işaret" değil "isim geçişi")
- [ ] Konum: mevcut tab bar'a "KOZMOLOJİ" tab'ı ekle

**Kabul kriteri:** Yeminler tab bar 4 (mevcut) → 6 tab'a çıkar (+ Tahaddi + Kozmoloji); yeni JSON alanları content-audit-clean; §13.15 compliant.

---

## 5. İlk ve Son Kelimeler — Eşleşme Viz + Kök Heatmap

**Dosya:**
- Modify: `next/src/components/IlkSonKelimeler.jsx`
- Reference data: `next/public/ilk-son-kelimeler.json` (114 sûre, ilk + son kelime + kök)

### Task 5.1: 114-sûre kök heatmap
- [ ] Yeni widget: sûre-numarası × kök-frekansı grid
- [ ] Renk yoğunluğu: sık geçen kökler daha gold, hapax kökler daha silver
- [ ] Hover: hangi kök, hangi sûre, hangi anlam alanı
- [ ] Konum: yeni tab "KÖK YOĞUNLUĞU"

### Task 5.2: İlk↔Son eşleşme viz
- [ ] SVG: dairesel 114-nokta düzenek — her sûre için ilk kelime bir renk, son kelime başka bir renk
- [ ] Her sûrenin ilk-son arası "chord" bağlantısı (kavram akrabası varsa gold, yoksa gri)
- [ ] Konum: yeni tab "EŞLEŞME HARİTASI"
- [ ] Mobile'da fallback: dikey list + spark line

**Kabul kriteri:** 2 yeni tab, mevcut içerik korunur; canvas/SVG render smooth; mobile'da usable.

---

## 6. İblis / Şeytan — Inline Data → JSON + Vesvese Tab + 12 Hile Widget

**Dosya:**
- Modify: `next/src/components/IblisSatan.jsx` (~1300 satır)
- Create: `next/public/iblis-seytan.json` (mevcut inline data'yı extract)
- Test: `/tr/arac/iblis-seytan`

### Task 6.1: Inline data → JSON extraction
- [ ] Component içindeki hard-coded arrays'i (7 sûrede aynı sahne, 12 hile, vesvese kanallar, vs.) `iblis-seytan.json`'a taşı
- [ ] Component fetch pattern'ına geç (`useEffect` + `fetch('/iblis-seytan.json')`)
- [ ] Loading state ekle

### Task 6.2: Vesvese Tab
- [ ] Yeni tab "VESVESE" — Nâs sûresi 114 anchor
- [ ] İçerik: 6 vesvese kanalı (kalp, göz, kulak, dil, el, ayak — İbn Kayyim'in klasik taksimi)
- [ ] Her kanal: 1 ayet referansı + 1 klasik tefsir açıklaması + 1-satır günümüz karşılığı
- [ ] Content-producer draft edecek + auditor doğrulayacak

### Task 6.3: 12 Hile Widget
- [ ] Content: İblis'in 12 klasik hilesi (İbn Kayyim, Medâricu's-Sâlikîn'den)
- [ ] Grid: 3-col desktop, 1-col mobile; her kart: hile adı + 1-satır tanım + ayet referansı
- [ ] Content-producer draft + auditor doğrulama

**Kabul kriteri:** JSON'a extraction bug-free; 2 yeni tab (Vesvese + 12 Hile) route 200 dönüyor; content-audit clean; §13.15 clean.

---

## İşleyiş Kuralları

1. **Her madde sonrası:** commit + push (auto-approved) + qc-content-auditor sweep (memory rule)
2. **JSON değişikliklerinde:** her build'de §13.15 Arabic normalize sweep zorunlu
3. **Widget commit sırası:** önce JSON commit (test edilebilir), sonra component commit
4. **Yeni tab'lar:** §13.19 sticky tab bar pattern (opaque `rgb(6,8,14)`, `isolation:isolate`, `top:110px`)
5. **Yeni içerik:** "pasaj" / "ritüel" / "pillar (Türkçe)" yasak (memory rules)
6. **Kaynak citation:** Îzutsu §X YASAK — sadece "God and Man" bölüm adı; cilt/sayfa yasak; ayet-referanslı format zorunlu
7. **Rollback tag:** Her madde başlangıcında lokal tag `dalga-M[N]-start-2026-07-10` — sorun çıkarsa geri dönüş noktası

## Tahmini Süre

| Madde | Tahmini iş |
|---|---|
| 1. Melekler | ~1 saat |
| 2. Kavimler | ~1 saat |
| 3. Renkler | ~1.5 saat (içerik-ağır) |
| 4. Yeminler | ~2 saat (2 yeni tab) |
| 5. İlkSon | ~1.5 saat (viz work) |
| 6. İblis | ~2.5 saat (refaktör + 2 tab) |
| **Toplam** | **~9.5 saat** |

Autonomous mode + parallel content-producer delegations ile ~50-60% kısaltılabilir. Realist: gecede 3-4 madde tamamlanabilir; kalanı devam eden turlarda.

---

---

## Madde 0 — ARAÇLAR KATALOG / KEŞFEDİLEBİLİRLİK

**Kaynak:** `docs/reviews/2026-07-07-araclar-audit.md` — kısmen artık geçersiz.
**Denetim sonucu (2026-07-10):** Audit'teki 4 iddiadan 3'ü DOĞRULANMADI:
- ~~KissaAtlas "4 peygamber" iddiası yanlış~~ → DOĞRU (Musa, Yusuf, İbrahim, İsa)
- ~~Emirler "88 emir" sayı belirsiz~~ → DOĞRU (88 emir, 8 kategori)
- ~~`/arac/wow` vs `/arac/kurani-tani` duplicate~~ → wow → kurani-tani'ye 308 permanent redirect
- ~~`/arac/retorik` vs `/arac/retorik-sorular` duplicate~~ → 2 farklı tool (retoriği = iltifât; sorular = ~1200 soru)

**Gerçek kalan sorunlar:**

### 0.1 DuaVerses catalog description update (5 dk)
- `data/tools.jsx:428` DuaVerses `descLongTr/En` şu anda muğlak; 77 dua + 11 kategori sayısı eklenmeli.

### 0.2 28 gizli tool kategorizasyon değerlendirmesi (~30 dk)
28 sayfa (Renkler, Yeminler, Kavimler, Doğa Atlası, Melekler, Kıyâmet, Cennet, Sünnetullah, Münâfık, Nefis, İblis, Kadınlar, İlkSon, Mukattaa, Ritim, Retorik Sorular, Dua Dili, Ses Mimarisi, Halka Kompozisyon, Bilimsel İşaretler, Tarihsel Kanıtlar, Koruma Zinciri, Tekrar Anatomi, Altı Konu, İnsan Tanımı, İnsan Psikolojisi, İbadetler, Semantik Arama) EXPLORE_CATEGORIES kataloğunda mevcut ama tools.jsx kataloğunda yok.
- **Karar:** Bu ayrım tasarım seçimi (content topics vs interactive tools). Kullanıcı Keşfet mega-menüsü ile erişebiliyor — bug değil.
- **Aksiyon:** Bir subset (5-6 en tool-like olan: Renkler palet, İlkSon 114-viz, Halka SVG, Yeminler tab-heavy, Nefis mertebeler viz) `tools.jsx`'e alınabilir. Ancak bu her sayfayı Keşfet + Araçlar İKİ menüde gösterir; UX kalabalıklaşır. **Şimdilik ertelendi**, Dalga 1-6 sonrasında gündeme.

### 0.3 ToolsBrowser modal iyileştirmesi (~30 dk)
`/arac/tum-araclar` modal'ında "Kategori filtreleri + arama" pattern'ı zaten var. Denetim sonrası:
- Aramada Türkçe karakter varyantları (ı/i, ş/s) fuzzy match desteği kontrol
- Modal içi arama focus mgmt (Cmd+K veya `/` shortcut var mı?)
- Ertelendi (kritik değil).

### 0.4 exploreCategories.jsx → tools.jsx cross-reference cleanup (~15 dk)
İki kataloğ arasında `id` çakışmaları veya truncation risk kontrol.
- Ertelendi (bilinen sorun yok).

## Madde 0 Aksiyonu: SADECE 0.1 (küçük, hızlı)

DuaVerses açıklamasını 77 dua + 11 kategori olarak güncelle. Kalan 0.2/0.3/0.4 Dalga 1-6 tamamlanana kadar bekler.

---

## Uygulama Başlıyor

Sırayla ilerleyeceğim: Madde 0.1 → 1 → 2 → ... → 6. Her madde tamamlanınca commit hash + smoke test sonucu bildireceğim.
