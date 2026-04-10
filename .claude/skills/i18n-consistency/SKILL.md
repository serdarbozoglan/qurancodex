---
name: i18n-consistency
description: >
  qurancodex.com için Türkçe/İngilizce çeviri bütünlüğünü ve tutarlılığını denetler.
  Yeni bir bölüm, araç, bileşen veya metin eklendiğinde MUTLAKA kullanılmalıdır.
  Tetikleyiciler: "yeni section ekledim", "çeviri eksik mi", "en.json güncelle",
  "tr.json", "i18n", "dil desteği", "İngilizce çeviri", "transliterasyon tutarlı mı",
  "Arapça terim nasıl yazılır". İki dilli site için kritik — atlanamaz.
---

# i18n Consistency Skill

qurancodex.com'un Türkçe (tr) ve İngilizce (en) dil desteğinin
bütünlüğünü ve kalitesini denetler.

---

## Kontrol Adımları

### Adım 1: Key Eşleşmesi

```bash
# tr.json ve en.json key'lerini karşılaştır
# Her iki dosyayı oku ve diff al
```

```
[ ] tr.json'da olan her key en.json'da da var mı?
[ ] en.json'da olan her key tr.json'da da var mı?
[ ] Nested key'ler tam eşleşiyor mu?
[ ] Yeni eklenen component'ların key'leri her iki dosyaya da eklenmiş mi?
```

### Adım 2: Hardcoded String Tespiti

Kaynak dosyalarda i18n sistemi dışında kalan Türkçe/İngilizce metin ara:

```
[ ] JSX içinde tırnak içi Türkçe metin var mı?
    → Örn: <p>Kur'an'ı keşfet</p> — i18n key olmalı
[ ] Component prop'larında hardcoded string var mı?
    → Örn: placeholder="Ara..." — i18n key olmalı
[ ] Hata mesajları i18n sistemiyle mi yönetiliyor?
[ ] title, alt, aria-label attribute'ları i18n'de mi?
```

### Adım 3: Arapça Terim Tutarlılığı

Kritik terimlerin her iki dilde tutarlı yazıldığını kontrol et:

| Türkçe | İngilizce | Kabul Edilebilir | Kabul Edilemez |
|--------|-----------|------------------|----------------|
| Kur'an | Quran | Qur'an | kuran, Kuran |
| sure | surah | sura | Sure (büyük) |
| ayet | verse / ayah | — | Ayet (İngilizce'de) |
| hafız | hafiz | — | hâfız (İngilizce'de) |
| tefsir | tafsir | — | Tefsir (İngilizce'de) |
| hadis | hadith | — | Hadis (İngilizce'de) |

```
[ ] "Kur'an" tutarlı mı? (Kuran, kuran, Quran karışımı var mı?)
[ ] Sure numarası formatı tutarlı mı? (Bakara 2:255 vs 2:255 Bakara)
[ ] Alimler için transliterasyon tutarlı mı?
    (Zemahşeri / Zamakhshari, Zerkeşî / Zarkashi)
```

### Adım 4: Çeviri Kalitesi

```
[ ] Anlam korunuyor mu? (Kelime kelime değil, anlam çevirisi)
[ ] Arapça terimlerin İngilizce açıklaması doğru mu?
[ ] Türkçe'ye özgü kavramlar İngilizce'de açıklanmış mı?
[ ] Uzunluk uyumu: Çok uzun/kısa çeviriler UI'ı bozuyor mu?
    (Özellikle buton metinleri ve kısa etiketler)
```

### Adım 5: Dinamik İçerik

```
[ ] Sayı formatları: Türkçe'de "1.400" mü "1400" mü?
    İngilizce'de "1,400" olmalı
[ ] Tarih formatları tutarlı mı?
[ ] Çoğul kuralları doğru mu? (İngilizce'de "1 verse" vs "2 verses")
[ ] RTL (sağdan sola) Arapça metin LTR layout içinde doğru render mı?
```

---

## Rapor Formatı

```
=== i18n CONSISTENCY REPORT ===

EKSIK KEYLER:
  TR'de var, EN'de yok:
    - sections.linguistic.subtitle
    - tools.ayetMap.description
  EN'de var, TR'de yok:
    - (yok)

HARDCODED STRİNGLER:
  src/components/PathCard.jsx:47 → "Bu Yola Başla" hardcoded
  src/components/Navbar.jsx:23 → "Keşfet" hardcoded

TERİM TUTARSIZLIKLARI:
  "Kuran" (3 yerde) → "Kur'an" olmalı
  "surah" / "sure" karışımı (en.json) → "surah" standardize et

ÖZET: X eksik key / Y hardcoded / Z tutarsızlık
ÖNCELİK: [Kritik olanlar]
```

---

## Sık Yapılan Hatalar

1. **Yeni component eklenince i18n atlanıyor** — en çok bu
2. **Tooltip ve aria-label'lar i18n dışı kalıyor**
3. **"Kur'an" vs "Quran" karışımı** — İngilizce içinde bile tutarsız
4. **Sayı formatı** — Türkçe'de nokta, İngilizce'de virgül binlik ayracı
5. **Sure isimlerinin çevirisi** — "Bakara" mı "Al-Baqarah" mı? Tutarlı ol
