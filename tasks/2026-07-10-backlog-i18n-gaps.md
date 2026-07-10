# i18n / İçerik Backlog — 2026-07-10

> Hero i18n bug fix (commit `e284fa2`) sırasında Playwright taramasında tespit edilen ek eksiklikler. LanguageContext seviyesinde t() consumer'ları düzeltildi; aşağıdakiler **content-veri seviyesinde** ayrı düzeltme gerektiriyor.

## Görev 1 — Kavimler Atlası sûre adı transliteration (EN)

**Sayfa:** `/en/atlas/kavim`
**Sorun:** Sûre referansları Türkçe transliteration olarak render oluyor:

- "Şuara" → EN: **"al-Shu'ara"** olmalı
- "Şems" → EN: **"al-Shams"** olmalı
- "Hud" (nokta noksan olabilir; EN'de "Hūd")
- "A'raf" → EN'de "al-A'raf"
- "Sad" → EN'de "Sād"

**Kaynak dosya:** `next/public/kavimler.json` veya `KavimlerAtlasi.jsx` içindeki inline verse listesi.

**Çözüm önerisi:** Sûre isimlerini i18n dictionary'de tutmak (`SURAH_NAMES_TR` + `SURAH_NAMES_EN` — zaten `ReadingMode.jsx`'te var). Kavim verisinde sûre numarası+ayet aralığı tut, render sırasında dile göre map'le.

**Etki:** 7 metin öğesi tespit edildi.

---

## Görev 2 — Esmâ-i Hüsnâ transliteration (EN)

**Sayfa:** `/en/arac/esma-frekans`
**Sorun:** 37 esma Türkçe transliteration ile render oluyor:

| TR (mevcut EN'de de görünen) | EN Standardı |
|---|---|
| Rabbü'l-Âlemîn | Rabb al-'Alamīn |
| Eş-Şehîd | Al-Shahīd |
| El-Mütekebbir | Al-Mutakabbir |
| Mâlikü'l-Mülk | Mālik al-Mulk |
| … (37 hit) | … |

**Kaynak dosya:** `next/public/esma-*.json` (birden fazla dosya olabilir) veya `EsmaFrekans.jsx` inline veri.

**Çözüm önerisi:** Her esma için `nameEn` + `nameTr` alanı. EN sayfada `nameEn` gösterilir. Klasik EN transliteration standardı: ALA-LC veya IJMES (International Journal of Middle East Studies).

**Etki:** 37 esma. Görünüm hem `/en/arac/esma-frekans` hem anasayfada AllahKendiniTanitir preview'da.

---

## Görev 3 — `/en/arac/dua-verses` route 404 (FALSE ALARM — 2026-07-10)

**Sonuç:** Bug değil. `dua-verses` tool ID'sidir, gerçek route değil. Doğru URL: `/en/arac/dualar`. Navbar.jsx:596 mapping'i (`openDuaVerses: '/arac/dualar'`) doğru çalışıyor. Playwright taramamda tool ID'yi URL slug olarak kullanmıştım, bu hataydı. **Kapatıldı.**

---

## Görev 4 — Genel EN transliteration standardı kararı

Şu an anasayfada bilinçli olarak kalan İslami terimler:
- "Tefekkür"
- "Esmâ-i Hüsnâ"

**Karar gerekli:** EN sayfada bu terimler
- (a) Türkçe transliteration olarak mı kalsın (site kimliği + reader familiarity — Muslim audience çoğunlukla Türkçe transliteration'a alışkın)
- (b) Standart Arabic transliteration'a mı geçilsin ("Tafakkur", "Al-Asma al-Husna")

Görev 2 ile birlikte tek bir standart benimsenmeli.

---

## Öncelik

| Görev | Öncelik | Effort | Etki |
|---|---|---|---|
| 3 (dua-verses 404) | Yüksek | Düşük (1-2 dk) | Broken link |
| 4 (standart kararı) | Orta | Konuşma (5 dk) | Diğer görevlerin blocker'ı |
| 2 (Esma 37 transliteration) | Orta | Yüksek (data + verify) | Görünürlük yüksek |
| 1 (Kavim 7 sûre adı) | Düşük | Düşük | Sınırlı kapsam |
