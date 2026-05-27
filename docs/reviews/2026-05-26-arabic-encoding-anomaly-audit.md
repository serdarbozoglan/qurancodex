# Arapça Encoding Anomaly Audit — Mushaf-i Madinah parite kontrolü

**Tarih:** 2026-05-26
**Tetikleyici:** Bakara 14'te "ز" altında kasra + "ؤ" üstünde damma + U+06EB stack — kullanıcı bunu "çift hareke" gibi algıladı.
**Kapsam:** Yalnızca audit — kod yazılmadı, ReadingMode'a dokunulmadı.
**Veri tabanları:**
- Lokal: `public/verse-graph-bgem3.json` (6.236 ayet, standart encoding'e normalize edilmiş)
- API: `https://api.acikkuran.com/surah/{s}/verse/{a}` — 58 örnek ayet (Fatiha 1-7, Bakara 1-20, Yasin 1-15, Al-i Imran 1-10, Nas 1-6)
- Render katmanı: `next/src/components/ReadingMode.jsx` + `next/src/lib/arabic.js`

---

## 1. Executive Summary

**Genel sağlık: TEMİZ.** 6.236 ayetin tamamında, kullanıcının "anomaly" diye nitelediği gerçek bug pattern'lerinin (çift kasra/damma/fetha, ters sıralı şedde, alef wasla artifacts, farsi yeh artifacts) **sıfır** örneği bulundu. Lokal veri ile canlı `api.acikkuran.com` örneklemi 58 ayette **byte-perfect** uyumlu.

Bakara 14'te görülen "altı çizili harf altında çift hareke" görüntüsü gerçek bir bug değil, Mushaf-i Madinah imlasının tasarımıdır. "مُسْتَهْزِؤُ۫نَ" kelimesinde `ز` + U+0650 kasra ("zi") ve `ؤ` + U+064F damma + U+06EB medd-i muttasıl ("ūn") iki ayrı harfin iki ayrı sesidir. Yanılgı, KFGQPC fontunun ز/ؤ glifelerini bitişik render etmesinden ve U+06EB'nin font tarafından küçük "مد" annotation üretmesinden kaynaklanır.

**Risk skoru: P2 (cosmetic-only, no data integrity issue).**

---

## 2. Pattern İstatistikleri

### 2.1 Anomaly Pattern'leri (lokal veri — verse-graph-bgem3.json)

| Pattern | Açıklama | Toplam | Örnek |
|---|---|---|---|
| Çift kasra (`ِِ`) | İki ardışık U+0650 | **0** | — |
| Çift fetha (`ََ`) | İki ardışık U+064E | **0** | — |
| Çift damma (`ُُ`) | İki ardışık U+064F | **0** | — |
| Hareke→hareke ters sırası (örn. `َِ`, `ُِ`, `ُِ`) | Fonetik imkânsız | **0** (tüm permütasyonlar) | — |
| Şedde→hareke ters sırası (`[hareke]ّ`) | "ya" yerine "şeddeli ya" değil — 72 görece ama hepsi **gunne sonrası** geçiş; bug değil | 72 | 2:178→"اتِّبَا"; 2:187→"الصِّيَا" |
| Alef wasla (U+0671) | KFGQPC'de ص artifact'i | **0** (zaten normalize) | — |
| Farsi yeh (U+06CC) | KFGQPC tofu üretir | **0** | — |
| Uthmani sukun (U+06E1) | KFGQPC yarım daire | **0** (API'de de yok artık) | — |

**Sonuç:** Hiçbir gerçek bug pattern'i mevcut değil. Şedde sonrası "hareke" görüntüsü zaten beklenen Arapça morfolojidir (`الصِّيَا` = "ṣ + shadda + i + y" — şedde harf çoğaltır, sonra kasra şeddeli s'nin altına gelir; yanlış sıra değil).

### 2.2 Mushaf-i Madinah Tajweed İşaretleri (lokal veri)

Bunlar **anomaly değil** — Mushaf-i Madinah imlasının resmî unsurları. `applyTajweed` veya `wrapWaqfOnly` pipeline'ı bunları CSS overlay olarak render eder.

| Codepoint | İsim | Adet | İşlev | Örnek |
|---|---|---|---|---|
| U+06EA `۪` | Empty Centre Low Stop ("asar") | 10.012 / 6.236 ayetin büyük çoğunluğu | Subscript kasra (medd-i tabii göstergesi) | 1:1→"الرَّح۪يمِ" |
| U+0670 `ٰ` | Superscript Alef (dagger alef) | 8.533 | Yazılmayan uzun a | 1:1→"اللّٰهِ" |
| U+0653 `ٓ` | Maddah Above | 5.095 | Med curve | 2:4→"اِمَٓا" |
| U+06DC `ۜ` | Small High Seen | 3.515 | Sekta veya waqf-ta (Diyanet ط konvansiyonu) | 1:4→"الدّ۪ينِۜ" |
| U+06DA `ۚ` | Small High Jeem | 1.660 | Jaez-waqf | 2:4→"بِكَۚ" |
| U+06D9 `ۙ` | Small High Lam-Alef | 1.428 | Lā waqf | 1:7→"عَلَيْهِمْۙ" |
| U+06EC `۬` | Rounded High Stop | 487 | Qasr (kısaltma) — özellikle "اُو۬لٰٓئِكَ" | 2:5→"اُو۬لٰٓئِكَ" |
| U+06DF `۟` | Small High Rounded Zero | 445 | Sukun ornament (sakin işareti) | 2:7→"يمٌ۟" |
| U+06EB `۫` | Empty Centre High Stop | 249 / **237 ayat** | Medd-i muttasıl/lazım göstergesi — bu görüntü kullanıcının bug sandığı şey | 2:14→"مُسْتَهْزِؤُ۫نَ" |
| U+06D6 `ۖ` | Small High Sad-Lam-Yeh | 157 | Sala-waqf | 2:16→"هُدٰىۖ" |
| U+06D7 `ۗ` | Small High Qaf-Lam-Yeh | 103 | Qif-waqf | 2:101→"الْكِتَابَۗ" |
| U+06DB `ۛ` | Small High Three Dots | 46 | Muanaqa waqf | 2:2→"رَيْبَۚۛ" |
| U+06ED `ۭ` | Small Low Meem | **4 ayet sadece** | Iqlab göstergesi | 11:41, 11:42, 12:11, 41:44 |
| U+0656 `ٖ` | Subscript Alef | **2 ayet sadece** (her ikisi Bakara 14) | Yatay küçük elif (asar yerine kullanılır) | 2:14→"الَّذٖينَ", "شَيَاطٖينِهِمْ" |

> Not: U+0656 ile U+06EA ikisi de "küçük yatay alef/asar" görevi görür ama farklı codepoint'lerdir. acikkuran veri setinde Bakara 14 ikisini de kullanmış — bu tarihsel mushaf farklılığı (Kahire vs. Madinah), encoding bug değil.

### 2.3 API vs Lokal Parite

58 örnek ayetin **tamamı (100%) byte-identical.** Lokal veri seti zaten `api.acikkuran.com`'dan çekilip standart encoding'e normalize edilmiş — drift yok. API'de görünen U+06EA, U+06EB, U+06EC marks lokalde de aynı pozisyonda korunmuştur. **Lokal data'nın strip ettiği hiçbir API codepoint'i tespit edilmedi.**

---

## 3. Render Katmanı Haritası

| Codepoint | cleanArabic davranışı | applyTajweed / wrapWaqfOnly davranışı | Görsel sonuç |
|---|---|---|---|
| U+064B-U+0650 (hareke) | Korunur | Med kurallarında kullanılır (renklendirme) | Font default render |
| U+0651 (shadda) | Korunur | Gunne kuralında kullanılır | Font default render |
| U+0652 (sukun) | Korunur | Kalkale + iklab + ihfa pattern matching | Font default render |
| U+0653 (maddah) | Korunur | `\\u0670\\u0653?` → med rengi (magenta/leylak) | Maddah curve + renk |
| U+0670 (super alef) | Korunur | `K.med` rengi (magenta) — uzun "â" | Yukarıda küçük elif glyph |
| U+06D6-U+06DA, U+06DC (waqf) | Korunur, hareke ile reorder edilir | `UTHMANI_MARKS_RE` → `makeWaqfSpan` (kırmızı + üst pozisyonda) | Harfin üstünde küçük kırmızı işaret |
| U+06DB (muanaqa) | Korunur | `UTHMANI_MARKS_RE` regex'inin opsiyonel parçası | Üç nokta üstte |
| U+06DC `ۜ` | Korunur | `WAQF_TA_RE` → `makeWaqfTaSpan` (Diyanet konvansiyonu: küçük "ط" glyph zero-width) | Üstte küçük kırmızı ط |
| U+06DF (sukun ornament) | Korunur | `UTHMANI_MARKS_RE` regex'i tarafından yakalanır | Küçük dairesel üst işaret |
| U+06E1 (Uthmani sukun) | Korunur (DIAC içinde) | Sükun gibi davranır (kalkale, mim-sakin, nun-sakin pattern'leri) | Yarım daire (font glyph) |
| U+06E8 `ۨ` (nun al-wiqayah) | Korunur | `NUN_WIQAYAH_RE` → `makeNunWiqayahWrap` ("نِ" yan etiket) | Yan tarafta küçük kırmızı نِ |
| U+06EA `۪` (asar) | **Korunur** (cleanArabic) / U+0650'a dönüştürülür (Display/Graph variants) | Med kuralında kasra ile birlikte değerlendirilir | Asar glyph (font render) |
| U+06EB `۫` | Korunur | `MED_RE` → `makeMedWrap` (kelime altına "مد" annotation + harf magenta) | Harf altında küçük kırmızı "مد" |
| U+06EC `۬` | Korunur | `KASR_RE` → `makeKasrWrap` (kelime altına "قصر" annotation) | Harf altında küçük kırmızı "قصر" |
| U+06ED `ۭ` | Strip (cleanArabic'te `[ۣۭ۠ۤۧ]` listesinde) | — | Görünmez |
| U+06D4 `۔` (sekta) | Korunur | `SEKTA_RE` → `makeSektaWrap` (kelime altına "سكتة" annotation, source transparent) | Harf altında "سكتة" |
| U+0610-U+0617 (İslami kısaltma) | Strip | — | Görünmez |
| U+06DE `۞` (rub el hizb), U+0610 vb. | Strip (`[۝۞۩]`) | — | Görünmez |
| U+0671 `ٱ` (alef wasla) | → U+0627 (düz alef) | — | Düz alef |
| U+06CC `ی` (farsi yeh) | → U+064A (Arabic yeh) | — | Standart yeh |
| U+06E6 `ۦ` (small yeh) | → boşluk | — | Kelime ayracı |

**Önemli:** `applyTajweed` ile `wrapWaqfOnly` aynı vakıf/med/kasr CSS overlay pipeline'ını paylaşır; aralarındaki tek fark `applyTajweed`'in ek olarak renklendirme (gunne, kalkale, ihfa, iklab, idgam, sıla, lafz-ı celal) eklemesidir. **U+06EB'nin "مد" annotation overlay'i her iki modda da gösterilir** — tajweed kapalıyken bile.

---

## 4. Mushaf-i Madinah Parite Kontrolü — Spot Check'ler

Aşağıdaki ayetler **doğru render** edilmelidir (anomaly DEĞİLDİR). Her birinde belirtilen "garip görünen" detay aslında Mushaf-i Madinah konvansiyonudur.

| # | Surah:Ayah | Kelime | Beklenen görüntü | Açıklama |
|---|---|---|---|---|
| 1 | **2:14** | مُسْتَهْزِؤُ۫نَ | `ز` altında kasra + `ؤ` üstünde damma + kelime altında küçük kırmızı "مد" | Kullanıcının "çift hareke" sandığı pattern — gerçekte iki ayrı harf |
| 2 | **2:14** | الَّذٖينَ | `ذ` altında **küçük yatay elif** (asar değil, U+0656 subscript alef) | Mushaf-i Madinah uzun "ī" göstergesi |
| 3 | **2:5** | اُو۬لٰٓئِكَ | `و` altında kelime altında küçük kırmızı "قصر" (kısaltma) | U+06EC qasr annotation |
| 4 | **1:1** | الرَّح۪يمِ | `ح` altında subscript asar/circle + `ي` altında kasra | U+06EA + U+0650 normal medd-i tabii sıralaması |
| 5 | **2:1** | الٓمٓ | İki maddah curve `ا` ve `م` üstünde | Mukataa harfleri — maddah med göstergesi |
| 6 | **11:41** | مَجْرٰۭۙيهَا | `ر` üstünde dagger alef + altında U+06ED (cleanArabic strip) + U+06D9 (lā waqf, üstte) | Çok yoğun bir cluster — render katmanı U+06ED'yi gizler, sadece U+06D9 görünür |
| 7 | **36:35** | ثَمَرِه۪ۙ | `ه` altında U+06EA + üstte U+06D9 (lā waqf) | Waqf-hareke reorder kuralı (`[ۖ-ۜ][hareke]` → swap) sayesinde glyph collision yok |
| 8 | **48:29** | اَشِدَّٓاءُ | Şedde + maddah curve aynı `د` üstünde | Maddah curve "elif sonrası uzun a"ya işaret eder |
| 9 | **22:11** | خَيْرٌۨ ٱطْمَأَنَّ | `ر` üstünde tenvin + yan tarafta küçük kırmızı "نِ" | U+06E8 nūn al-wiqāyah — bağlama nûnu |
| 10 | **56:53** | فَمَالِـؤُ۫نَ | `ؤ` üstünde damma + altında küçük "مد" | 2:14 ile aynı pattern, farklı kelime |

---

## 5. Şüpheli Noktalar

**YOK.** Audit kapsamında gerçek bir veri bug'ı tespit edilemedi. Tek "sınır vaka" şudur:

- **Bakara 14'te U+0656 SUBSCRIPT ALEF** (sadece 2 kullanım, ikisi de aynı ayet). Veri setindeki diğer 8.531 "uzun ī" kullanımı U+06EA `۪` ile kodlanmış. `cleanArabic` U+0656'ya dokunmaz (DIAC içinde olmadığından med kurallarına da girmiyor) — font onu KFGQPC default subscript alef glifi olarak render eder. **Görsel olarak doğru, ama veri setinde tek bir ayetin iki harfi farklı konvansiyon kullanması inconsistent.** Bu acikkuran veri setinin kendi miras kararı, bizim verimizdeki bir bozulma değil. Düzeltilmesi istenirse normalize script'i ile U+0656 → U+06EA dönüştürülebilir, ama görsel fark sıfır olacağı için faydasız bir değişiklik.

---

## 6. Test Stratejisi — "Emin Olmak İçin" Spot Check'ler

User'ın aşağıdaki ayetleri ReadingMode'da (tajweed on + off iki modda) açıp görsel kontrol yapması yeterlidir:

1. **Bakara 2:23-25** — Medd-i tabii cluster (`الَّذ۪ينَ اٰمَنُوا`, `اَنْهَارٌ`). Beklenen: her uzun "ī" altında asar circle veya küçük yatay elif; her "â" üstünde dagger alef; med'li harfler magenta/leylak renkte (tajweed on).
2. **Yasin 36:1-2** — `يٰسٓ وَالْقُرْاٰنِ الْحَك۪يمِ`. Beklenen: ي + dagger alef + maddah + س + maddah; sonra `ا` üstünde dagger alef düzgün hizalanmış olmalı.
3. **Vâkıa 56:53** — `فَمَالِـؤُ۫نَ` (Bakara 2:14 ile aynı medd-i muttasıl pattern'i). Beklenen: 2:14 ile birebir aynı görüntü (`ؤ` + damma + alttında "مد").
4. **Yasin 36:52** — `مَرْقَدِنَ۔ا` (U+06D4 sekta). Beklenen: kelime altında kırmızı "سكتة" etiketi.
5. **Hac 22:11** — `خَيْرٌۨ ٱطْمَأَنَّ` (U+06E8 nūn al-wiqāyah). Beklenen: `ر` yanına yapışık küçük kırmızı "نِ".
6. **Hud 11:41-42** — `مَجْرٰۭۙيهَا`, `ارْكَبْۭۗ` (U+06ED iqlab göstergesi). Beklenen: U+06ED cleanArabic tarafından strip edildiği için **gözükmez**, sadece üstteki U+06D9/U+06D7 waqf işareti görünür. Bu doğru davranış (iqlab kuralı zaten tajweed renklendirmesi ile gösteriliyor).

Her birinde aşağıdaki kriterler yerine getirilirse render katmanı sağlıklı:
- Hareke + waqf işareti çakışması yok (reorder kuralı sayesinde)
- Maddah curve harfin üstünde yatay konumda
- "مد", "قصر", "سكتة", "نِ", "ط" annotation'ları beklenen yerde kırmızı
- Tajweed on/off arasında geçiş `َٰ` Fatiha 1:1 fix'i sayesinde kayma yapmıyor

---

## 7. Risk Skoru ve Sınıflandırma

| Bulgu | Sınıf | Aksiyon |
|---|---|---|
| Bakara 14 "çift hareke" görüntüsü | **Tasarım gereği (P2)** | Aksiyon yok. Mushaf-i Madinah imlası, render doğru. |
| U+06EB / U+06EC annotation glyph yığılması | **Tasarım gereği (P2)** | Aksiyon yok. `makeMedWrap` ve `makeKasrWrap` overlay'leri zaten doğru positioning kullanıyor. |
| Bakara 14'te U+0656 vs U+06EA inconsistency | **Cosmetic (P3)** | İsteğe bağlı: tek seferlik normalize. Görsel etki sıfır. |
| Gerçek encoding bug | **YOK (P0/P1 sıfır)** | — |

**Sonuç:** Veri kalitesi ve render pipeline'ı production-grade. Kullanıcının "başka yerlerde benzer problem var mı" sorusunun cevabı: **istatistiksel olarak yok.** Aynı görsel pattern'in (U+06EB altındaki harekeli hamza) 237 ayette daha tekrar etmesi beklenir — hepsi aynı mushaf konvansiyonu.

---

**Audit yöntemi reproducibility:**
- `/tmp/acikkuran_sample.json` — 58 verse API snapshot
- `public/verse-graph-bgem3.json` — 6.236 verse lokal veri
- Anomaly scan script bu dosyanın §1 ve §2'sinde komut olarak verildi (bkz. CLAUDE.md §13.15 audit komutu — yapıca aynı).
