---
name: content-accuracy-review
description: >
  qurancodex.com için içerik doğruluk denetimi yapar. Yeni bir bölüm, ayet referansı,
  istatistiksel iddia veya hadis/tefsir içeriği eklendiğinde MUTLAKA bu skill kullanılmalıdır.
  Tetikleyiciler: "yeni bölüm ekledim", "içerik doğru mu", "ayet referansı kontrol et",
  "hadis mi Kur'an mı", "istatistik doğru mu", "bilimsel iddia", "wow facts güncelle".
  Akademik doğruluk sitenin temel differentiator'ı olduğu için bu kontrol atlanamaz.
---

# Content Accuracy Review Skill

qurancodex.com içeriklerinin akademik doğruluğunu denetler. Site, İslami içeriklerde
akademik titizliği temel differentiator olarak benimsiyor — bu skill o standardı korur.

---

## Kontrol Listesi

### 1. Ayet Referansları

```
[ ] Sure numarası doğru mu? (örn. Bakara 2:255, Yunus 10:92)
[ ] Ayet numarası doğru mu?
[ ] Ayet metni orijinal Arapça ile eşleşiyor mu?
[ ] Türkçe meali doğru mu — anlam bozulmuş mu?
[ ] Transliterasyon varsa tutarlı mı? (Kur'an/Quran/kuran tutarsızlığı)
```

### 2. Hadis / Tefsir / Kur'an Ayrımı

```
[ ] Hadis kaynaklı bilgiler ℹ️ ikonu ile işaretlenmiş mi?
[ ] Tefsir kaynaklı yorumlar ℹ️ ikonu ile işaretlenmiş mi?
[ ] "Kur'an diyor ki" ile "müfessirler yorumluyor ki" ayrımı net mi?
[ ] Kaynak gösterilmiş mi? (Sahih-i Müslim, Tirmizî, Zemahşeri vb.)
[ ] Zayıf veya mevzu hadis var mı?
```

### 3. İstatistiksel İddialar

```
[ ] Kelime/ayet sayıları doğru kaynaklara mı dayandırılıyor?
[ ] "Kur'an'da X kelimesi Y kez geçer" iddiaları Corpus Coranicum veya
    Quranic Arabic Corpus ile doğrulanmış mı?
[ ] Yüzde değerleri (örn. "harflerin %70'i") kaynaklı mı?
[ ] "Tek", "ilk", "hiçbir zaman", "her zaman" gibi mutlak ifadeler
    gerçekten doğrulanabilir mi?
[ ] Bilimsel iddialar (demir, embriyoloji vb.) peer-reviewed kaynaklara
    mı dayandırılıyor?
```

### 4. Daha Önce Düzeltilen Hatalar (Regresyon Kontrolü)

```
[ ] Hapax legomenon sayısı: Kesin sayı verilmemeli, "~455 form" gibi
    yaklaşık ifade kullanılmalı
[ ] Fe-57 iddiası: "Fe-57 demirin stabil izotoplarından biridir —
    ilgi çekici bir örtüşme. Ancak bilimsel doğrulama olarak sunulamaz"
    notu mevcut mu?
[ ] "Tanrısal Zaman" ifadesi: Kullanılmamalı, "ilahi zaman" veya
    "Kur'an'da zaman kavramı" tercih edilmeli
[ ] Jacques Cousteau efsanesi: İçeriklerde kesinlikle yer almamalı
[ ] Moore embriyoloji yorumları: ℹ️ ile işaretlenmeli ve akademik
    tartışma notu eklenmiş olmalı
```

### 5. Kaynak Gösterimi

```
[ ] Footer'daki Kaynaklar bölümü güncellenmiş mi?
[ ] Her iddia için en az bir kaynak var mı?
[ ] Kaynaklar birincil (ayet, hadis, akademik makale) mi,
    ikincil mi (blog, Wikipedia)?
[ ] ⚠️ işareti tartışmalı kaynaklar için kullanılmış mı?
    (Moore, Bucaille vb.)
```

---

## Özel Uyarı Alanları

### WowFacts (Kur'an'ı Tanı) İçerikleri
- Her fact kaynağa bağlı olmalı
- "Şaşırtıcı ama doğrulanamaz" iddiaları kaldırılmalı
- Sayısal veriler (10 milyon hafız, 1.400 yıl vb.) kabul edilebilir
  aralıklarda mı?

### Bilimsel İşaretler Bölümü
- Eleştirel not her örnekte mevcut mu?
- "Kur'an bir bilim kitabı değildir" çerçevesi korunuyor mu?
- Modern yorum ile klasik tefsir ayrımı yapılıyor mu?

---

## Rapor Formatı

Her kontrol için şu formatı kullan:

```
✅ PASS — [Kontrol adı]: [Kısa açıklama]
❌ FAIL — [Kontrol adı]: [Sorun] → [Önerilen düzeltme]
⚠️  UYARI — [Kontrol adı]: [Risk] → [İncelenmeli]
```

Sonunda özet:
```
TOPLAM: X PASS / Y FAIL / Z UYARI
ÖNCELİKLİ DÜZELTMELERx: [Fail listesi]
```

---

## Referans Kaynaklar

- Corpus Coranicum (corpus.coranicum.de) — metin analizi
- Quranic Arabic Corpus (corpus.quran.com) — kelime frekansları
- Raymond Farrin — Structure and Qur'anic Interpretation (2014)
- Zerkeşî — el-Burhân fî Ulûmi'l-Kur'ân
- Sahîh-i Müslim, Tirmizî — hadis referansları
