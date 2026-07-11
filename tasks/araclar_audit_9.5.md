# Araçlar Sayfaları — 9.5+ Hedefi Audit Raporu

**Tarih:** 2026-06-14
**Kapsam:** `/arac/*` altındaki 17 tool sayfası
**Boyutlar:** **Görsel** (Hero, Cinematic pattern, tab tutarlılığı, mobil) + **İçerik** (anchor verse, çapraz okuma, klasik tefsir derinliği, kaynak)

---

## Skorlama Skalası (her sayfa)

| Skor | Anlam |
|---|---|
| **10** | A+: Pilot kalitesinde (İlk-Son Kelimeler seviyesinde) |
| **9-9.5** | A: Premium — Bismillah + anchor + framing whisper + filigree + dramatic title + closing synthesis + cross-tool CTA |
| **8** | B: Cinematic Hero var ama closing/cross-tool CTA eksik |
| **7** | C: Hero var ama yarı-yarıya (bismillah yok veya anchor yok) |
| **5-6** | D: Sadece ToolHeader + basit h1, scroll-story var |
| **<5** | E: Hero yok, içerik dağınık, tab tutarsızlığı |

---

## A. ZATEN PREMIUM (9+)

Bu oturumda Cinematic Hero pattern uygulandı, render bug fix edildi, tab tutarlılığı sağlandı.

| # | Sayfa | Route | Görsel | İçerik | Anchor Verse |
|---|---|---|---|---|---|
| 1 | **İlk-Son Kelimeler** | `/arac/ilk-son-kelimeler` | **9.5** | **9.5** | Bakara 2:186 (Closing) |
| 2 | **Yeminler** | `/arac/yeminler` | **9.5** | **9.0** | Şems 91 + Vâkıa 56:75-76 |
| 3 | **Renkler** | `/arac/renkler` | **9.0** | **9.0** | (tema bazlı, doğa) |
| 4 | **Kıyâmet Sahneleri** | `/arac/kiyamet` | **9.0** | **8.5** | İbrâhîm 14:48 |
| 5 | **Cennet & Cehennem** | `/arac/cennet-cehennem` | **9.0** | **8.5** | Rahmân 55:46 |
| 6 | **Münâfık Profili** | `/arac/munafik` (atlas/munafik) | **9.0** | **9.0** | Bakara 2:8 |
| 7 | **Melekler** | `/arac/melekler` | **9.0** | **8.0** | Fâtır 35:1 |
| 8 | **Zaman Boyutları** | `/arac/zaman-boyutlari` | **9.0** | **8.5** | Hac 22:47 |
| 9 | **İblîs & Şeytan** | `/arac/iblis-seytan` | **9.0** | **9.5** | Bakara 2:34 + 7 sûre |
| 10 | **Esmâ-i Hüsnâ Frekans** | `/arac/esma-frekans` | **9.0** | **9.5** | Şûrâ 42:11 (kendi flagship) |
| 11 | **Wow Facts** | `/arac/wow` | **8.5** | **9.5** | Cinematic Hero zayıf, içerik güçlü |

**9.5'e taşımak için 1-3 saatlik ince işler** (her biri için ayrı bölüm aşağıda).

---

## B. CİDDİ EKSİK — ZAYIF GÖRSEL + KARMA İÇERİK

Bu sayfalar **Hero, anchor verse, framing whisper** içermiyor. Öncelik 1.

### B1. Buyruklar (`/arac/buyruklar`) — `QuranCommands`

| | Mevcut | 9.5 hedefi |
|---|---|---|
| **Görsel** | **5/10** — Sade header (eyebrow + h1 + subtitle + 3 stat box) | Cinematic Hero (Bismillah + anchor + framing + filigree + UPPERCASE eyebrow) |
| **İçerik** | **6.5/10** — emir/nehiy/kategori sayıları var, ayet listesi var, ama klasik fıkıh çerçevesi (vâcip/mendub/mubah/mekrûh/harâm) yok | (a) Klasik fıkıh çerçeve açıklaması (b) Emir-nehiy ayrımı dilbilim notu (c) İltifât/iltimas örneği (d) Cross-tool CTA → Retorik |

**9.5 için yapılacaklar:**
1. **Cinematic Hero ekle**: ﷽ + **Nahl 16:90** (`اِنَّ اللّٰهَ يَأْمُرُ بِالْعَدْلِ وَالْاِحْسَانِ`) anchor + framing whisper + filigree
2. **Klasik çerçeve callout**: Fıkhî 5 hüküm (vâcip · mendub · mubah · mekrûh · harâm) ve Kur'an'da hangi fiil kalıplarıyla geldiği (`if'al`, `lā taf'al`, `kutiba 'alaykum`...)
3. **Cross-tool CTA**: "Bu emirlerin retorik açıdan analizi → **Kur'an Belâgatı**"
4. **Tab bar UPPERCASE** (mevcut tab varsa)

**Tahmini süre:** 2 saat
**Risk:** Düşük — pattern uygulaması, yeni veri yok

---

### B2. Muhataplar Sistemi (`/arac/muhataplar`) — `AddresseeSystem`

| | Mevcut | 9.5 hedefi |
|---|---|---|
| **Görsel** | **5/10** — Sadece ToolHeader + chip row + içerik | Cinematic Hero + dramatic title |
| **İçerik** | **7/10** — Muhatap kategorileri (yâ eyyuhâl-lezîne âmenû, yâ eyyuhâ'n-nâs, vb.) var ama klasik hitap teorisi (uslûb-i hitâb), Kufî/Basrî tartışmalar, dağılım istatistikleri yok | (a) Klasik hitap çerçevesi (b) Sûre türüne göre dağılım grafiği (c) Klasik tefsir notu: "yâ eyyuhâ'l-lezîne âmenû" Mekkî mi Medenî mi? |

**9.5 için yapılacaklar:**
1. **Cinematic Hero**: ﷽ + **Bakara 2:21** (`يَٓا اَيُّهَا النَّاسُ اعْبُدُوا رَبَّكُمُ`) anchor + framing whisper + filigree
2. **Klasik hitap teorisi callout**: `uslûb-i hitâb` (direkt), `uslûb-i gaybet` (3. tekil), `iltifât` (geçiş) — Suyûtî İtkân çerçevesinden
3. **Dağılım grafiği**: Mekkî/Medenî bölünmesi (Yâ eyyuhâ'l-lezîne âmenû → ezici çoğunluk Medenî)
4. **Cross-tool CTA**: "Hitap geçişleri → **Kur'an Belâgatı / İltifât** sekmesi"

**Tahmini süre:** 2.5 saat
**Risk:** Düşük

---

### B3. Sebeb-i Nüzul (`/arac/sebebi-nuzul`) — `SebebiNuzul`

| | Mevcut | 9.5 hedefi |
|---|---|---|
| **Görsel** | **5.5/10** — ToolHeader + tab bar (lowercase!) | Cinematic Hero + UPPERCASE tabs + scroll-to-bar |
| **İçerik** | **8/10** — Esbabu'n-nüzul rivayetleri var, Suyûtî kaynağı dolu | (a) Klasik metodoloji notu: "lâ yûsenu illâ bi-nass" (b) Vâhidî/Suyûtî karşılaştırması (c) Sünnî/Şîî varyasyon notları (varsa) (d) Cross-tool CTA |

**9.5 için yapılacaklar:**
1. **Cinematic Hero**: ﷽ + **Furkân 25:32** (`وَقَالَ الَّذِينَ كَفَرُوا لَوْلَا نُزِّلَ عَلَيْهِ الْقُرْآنُ جُمْلَةً وَاحِدَةً`) anchor (parça parça inişin gerekçesi) + framing whisper + filigree
2. **Tab bar UPPERCASE** + scroll-to-bar + id="sebebi-tab-bar"
3. **Klasik metodoloji callout**: Vâhidî (Esbâbu'n-Nüzûl) vs Suyûtî (Lübâb), `lâ yûsenu illâ bi-nass`, "umûm-i lafz ya da husûs-i sebeb" tartışması
4. **Cross-tool CTA**: "Konu bazlı tematik bakış → **Kavram Grafiği**"

**Tahmini süre:** 2.5 saat
**Risk:** Orta — tab restructure dikkat ister

---

### B4. Dualar (`/arac/dualar`) — `DuaVerses`

| | Mevcut | 9.5 hedefi |
|---|---|---|
| **Görsel** | **5/10** — Kart liste + kategori filtre + audio player. Hero yok. | Cinematic Hero |
| **İçerik** | **8/10** — 11 kategori, Kur'ânî dua koleksiyonu, peygamber atıfları, audio | (a) Klasik dua âdâbı çerçevesi (Mevlânâ-Câmî-İbn Atâ tasnif) (b) "İcâbe" şartları (c) Peygamber duâları katmanı (Eyyûb · Yûnus · Mûsâ · Süleymân · Zekeriyyâ · Adam vb.) — interaktif |

**9.5 için yapılacaklar:**
1. **Cinematic Hero**: ﷽ + **Bakara 2:186** (`وَاِذَا سَاَلَكَ عِبَاد۪ي عَنّ۪ي فَاِنّ۪ي قَر۪يبٌ`) anchor + framing whisper + filigree (NOT: U+06EA → U+0650!)
2. **Klasik dua âdâbı callout**: hamd → salât → istemek (klasik 3 evre); `du'â`, `nidâ`, `tazarru`, `münâcât` farkları
3. **Peygamber Duâları katmanı**: 7-8 peygamber duâsı (Eyyûb 21:83, Yûnus 21:87, Mûsâ 28:24, Süleymân 27:19, Zekeriyyâ 19:4-6, Âdem 7:23, İbrâhîm 14:35-41) — accent renklerle, tıklanır
4. **Cross-tool CTA**: "Dua dilinin retoriği → **Kur'an Belâgatı**"

**Tahmini süre:** 3 saat (peygamber dua katmanı yeni veri/UI)
**Risk:** Orta

---

## C. ZATEN İYİ AMA 9.5'E EKSİKLİ ÖGE VAR (8 ↔ 9.5)

### C1. Wow Facts (`/arac/wow`) — `WowFacts`

| | Mevcut | 9.5 hedefi |
|---|---|---|
| **Görsel** | **8/10** — ToolHeader + card grid sağlam; Cinematic Hero yok | Cinematic Hero (Bismillah + anchor) |
| **İçerik** | **9.5/10** — Bismillah 114 sayı şifresi, Tevbe Bismillah, modüler anlatı vs. — flagship kalite |

**9.5 için yapılacaklar:**
1. **Cinematic Hero ekle**: ﷽ + **Nisâ 4:82** (`اَفَلَا يَتَدَبَّرُونَ الْقُرْاٰنَ`) anchor + framing whisper + filigree

**Tahmini süre:** 45 dk
**Risk:** Düşük

---

### C2. Kur'an Belâgatı / Retorik (`/arac/retorik`) — `KuranRetorigi`

| | Mevcut | 9.5 hedefi |
|---|---|---|
| **Görsel** | **8/10** — UPPERCASE tabs var, ama Hero zayıf (yalnız ToolHeader + tab bar — Hero yok) | Cinematic Hero ekle |
| **İçerik** | **9/10** — Tezad, istiare, teşbih, iltifât örnekleri sağlam |

**9.5 için yapılacaklar:**
1. **Cinematic Hero ekle**: ﷽ + **Yûsuf 12:111** (`لَقَدْ كَانَ ف۪ي قَصَصِهِمْ عِبْرَةٌ لِاُولِي الْاَلْبَابِ`) anchor + framing whisper + filigree (DİKKAT: U+06EA → U+0650!)
2. **Cross-tool CTA**: "Müteşâbih ayetlerdeki retorik → **Kavram Grafiği** veya **Diyalog Ağı**"

**Tahmini süre:** 1 saat
**Risk:** Düşük

---

### C3. Cennet & Cehennem — Sadece içerik boyutu

Görsel ✅ tamam (bu oturum). İçerik için **8.5 → 9.5:**
1. **A'râf detayı**: A'râf ehli (kimler? Hasan-Basrî vs İbn Abbâs) — şu an minimal
2. **7 cehennem ismi karşılaştırması**: Sebebi (cehennem · hâviye · nâr · saîr · sakar · cahîm · lazâ) net olarak hangi günah tipi (Râzî tefsiri)
3. **9 cennet ismi karşılaştırması**: Eden · Firdevs · Naîm · Me'vâ · Dâru'l-mukâme · Dâru's-selâm · Adn · İlliyyîn — derece sıralaması
4. **Modern okuma callout**: "Cennet tarif edilebilir mi?" — İbn Arabî / Râzî / Suyûtî üç pozisyon

**Tahmini süre:** 2 saat

---

### C4. Kıyâmet Sahneleri — İçerik boyutu

Görsel ✅. İçerik için **8.5 → 9.5:**
1. **Sahne-sûre haritası** zenginleştir: Hangi sahne hangi sûrede vurgulanır (örn. dağların dağılımı → Tâ-Hâ 105-107 vs Nebe 78:20)
2. **Hadis katmanı**: Sahih hadislerdeki Kıyamet alameti tasvirleri (Müslim, Buhârî) — Kur'an ile karşılaştırmalı
3. **Klasik 3 dönem**: Eşrât-ı sâat (küçük-büyük-Mahşer sonrası)

**Tahmini süre:** 2.5 saat

---

### C5. Melekler — İçerik boyutu

Görsel ✅. İçerik için **8 → 9.5:**
1. **Vahy-i tabîî (Nahl 16:68 + Fussilet 41:12) bölümü**: arıya inen vahiy + gökyüzüne vahyolunması — vahyin 4 katmanı
2. **Bilinmeyen melekler**: Hârût-Mârût (Bakara 2:102), Mâlik (Zuhruf 43:77), Hâzin (Zümer 39:71)
3. **Mübaşeret tartışması**: Melek vahyi nasıl getirir? — Sa'd 38:69-70 + Cibrîl rivayeti
4. **Modern okuma**: Tabiî yasalar = melek tasarrufu mu? (klasik Eşârî/Mâturîdî pozisyon)

**Tahmini süre:** 2.5 saat

---

### C6. Zaman Boyutları — İçerik boyutu

Görsel ✅. İçerik için **8.5 → 9.5:**
1. **Mîlâd-İslâm karşılaştırması**: Modern fizik (göreceli zaman, Einstein) callout — sadece "ilginç" değil, akademik referansla
2. **Vakıf âlimleri**: İmam Gazâlî "an" kavramı, İbn Sînâ "zaman dehri", Eflâkî kıraatleri — kısa ama gerçek

**Tahmini süre:** 2 saat

---

### C7. İlk-Son Kelimeler — Zaten 9.5

Mevcut Spotlights + Closing Synthesis + Cross-tool zenginleştirme örneği. Audit referansı olarak kullanılır.

---

### C8. Yeminler — İçerik boyutu

Görsel ✅. İçerik için **9 → 9.5:**
1. **İbn Kayyim 7-evre scrollytelling** — Et-Tibyân fî aksâmi'l-Kur'ân'dan 7 aşama interaktif anlatım (önceki plan)
2. **Radial chart hover enhancements** — yemin objesi → cevap ilişkisi görsel

**Tahmini süre:** 4 saat (büyük iş — opsiyonel)

---

### C9. Renkler — Zaten 9 — Ufak ince işler

1. **Mîzâr ile bağ**: Cennet "yeşil" = Rahmân 55:64 (مُدْهَامَّتَانِ) — şu an sadece dünya/cennet karşıtlığı, daha derin
2. **Kelâmî tartışma**: "Cennet rengâ değil tek ton" sorusu — daha önce user feedback'i ile düzeltildiği gibi açıklama callout

**Tahmini süre:** 1 saat

---

### C10. İblîs & Şeytan — Zaten 9.5

Bismillah + anchor verse + Anahtar Fiiller + framing whisper + filigree + 7-marker preview + 7 passage kartı + Stats + Çapraz okuma. Audit referansı.

---

### C11. Münâfık Profili — Zaten 9

Görsel ✅. Tier B (Vâkıa Spotlight + Yemin↔Cevap Reveal) bitmedi (Yeminler için yapılan içerik — Münâfık için ayrı plan değil). Mevcut hâliyle 9.

---

### C12. Esmâ-i Hüsnâ Frekans — Zaten 9.5

Kendi flagship refactor planında dokümante (`tasks/wowfacts_flagship_refactor.md` benzeri). Audit referansı.

---

## D. LİSTE / NAVİGASYON SAYFALARI (Farklı kriter)

Bu sayfalar tool değil, **tool kataloğu**. Premium Hero gerekmez ama tutarlı tasarım gerekir.

| Sayfa | Mevcut | Hedef |
|---|---|---|
| **Tüm Araçlar** (`/arac/tum-araclar`) — `ToolsBrowser` | İyi (card grid) | 9 (zaten) |
| **Kur'an'ı Tanı** (`/arac/kurani-tani`) — Hub sayfası | Bilinmiyor | Audit gerekir |

---

## E. ÖNCELİK SIRASI (toplam ~22 saat)

### Faz 1 — Kritik (Hero yok olan sayfalar) — 10 saat
1. Buyruklar (2 saat)
2. Muhataplar (2.5 saat)
3. Sebeb-i Nüzul (2.5 saat)
4. Dualar (3 saat)

### Faz 2 — Ufak Hero ekleme — 1.75 saat
5. Wow Facts (45 dk)
6. Retorik (1 saat)

### Faz 3 — İçerik derinlikleri — 9 saat
7. Cennet & Cehennem içerik (2 saat)
8. Kıyâmet içerik (2.5 saat)
9. Melekler içerik (2.5 saat)
10. Zaman Boyutları içerik (2 saat)

### Faz 4 — Opsiyonel premium upgrade — 5 saat
11. Yeminler İbn Kayyim scrollytelling (4 saat)
12. Renkler kelâmî nüans (1 saat)

---

## F. METODOLOJİ — Her sayfa için kontrol listesi

- [ ] ﷽ Bismillah ornament (Amiri Quran, gold, opacity 0.82)
- [ ] Anchor verse (KFGQPC, U+0650 kasra — **§13.15 ihlali yok!**)
- [ ] İtalik Türkçe çeviri + reference label
- [ ] Framing whisper (italic Playfair Display)
- [ ] Filigree divider (gradient gold/transparent)
- [ ] UPPERCASE eyebrow tag
- [ ] Dramatic h1 + italic subtitle
- [ ] UPPERCASE tab labels (varsa) + scroll-to-bar + id="X-tab-bar" + scrollMarginTop:72
- [ ] Cross-tool CTA (uygun yerde)
- [ ] Klasik tefsir callout (sayfaya özel: Suyûtî / Râzî / İbn Kayyim / Gazâlî)
- [ ] Mobil (≥390px) test
- [ ] U+06EA tarama — grep -P "\x{06EA}" → 0 olmalı

---

## G. Sonraki Adım

**Onay beklenir:** Faz 1'den başlayalım mı? Sırayla `buyruklar → muhataplar → sebebi-nuzul → dualar`. Her sayfa bittiğinde commit + push (kullanıcı production'da görür).
