# QuranCodex Son 10 Batch (2026-07-10/11) İçerik Denetim Raporu

**Denetçi:** qc-content-auditor
**Tarih:** 2026-07-11
**Kapsam:** 4 batch grubu — Renkler +4 yeni, Kavim EN, Esma-i Hüsna EN, Tevbe standardizasyonu
**Uygulama commit:** `36a796b` (3 kritik + 5 orta bulgu uygulandı)

## Genel Özet

- **Kritik hata:** 3 adet → ✅ 3'ü uygulandı
- **Orta düzey sorun:** 6 adet → ✅ 5'i uygulandı, ⏸ 1'i ertelendi
- **Minör sorun:** 8 adet → ⏸ ertelendi
- **Tartışmalı ifade:** 2 adet → ⏸ ertelendi
- Halisination (uydurma cilt/sayfa citation) tespit edilmedi ✓
- Yasak terim (pasaj, ritüel, pillar) tespit edilmedi ✓

---

## BATCH 1 — Renkler +4 Yeni (Şafak, Kâfûr, Yakut-Mercân, Berk)

**Dosya:** `next/public/kuranin-renkleri.json`

### ✅ Kabul Edilen
- Ayet referansları (Fecr 89:1, İnşikak 84:16, İnsan 76:5, Rahman 55:22/55:58, Bakara 2:19-20, Ra'd 13:12, Nûr 24:43, Rum 30:24) doğru
- `isHapax` sınıflaması (kâfûr İnsan 76:5, yakut Rahman 55:58) doğru
- Şafak/fecr köken analizi (`f-c-r` ve `ş-f-q`) sağlam
- `keyVerseAr` metinleri standart Unicode (U+0650 kasra) — §13.15 uyumu OK
- Tefsir atıfları (Râzî `Mefâtîhu'l-Ğayb`, Kurtubî, Zemahşerî, İbn Kesîr, Elmalılı) — cilt/sayfa citation eklenmemiş; doğru davranış

### ⏸ Ertelenen Uyarılar

- **[O1]** Şafak `linguisticNoteTr` — *"Elmalılı Hak Dini bu iki kelimenin farkını 'fecrin ışığı yayılan, şafağın ışığı çekilen' olarak açıklar."* Elmalılı'nın **birebir cümlesi mi, parafraz mı** ayırt edilmiyor. Öneri: tırnaktan çıkar veya "olarak yorumlar" parafraz.

- **[O2]** Berk `linguisticNoteTr` — *"Elmalılı Hak Dini... modern meteorolojiye açık bir ima olarak okur — bu okuma bir yorum, kesin bir eşleşme değildir."* İkinci yarı disclaimer var ama "modern meteoroloji açık ima" atfının kaynağı zayıf. Öneri: daha ölçülü ifade.

- **[T2] (Tartışmalı)** Yakut etimolojisi Sogdca-Yunanca — klasik Arap lügatinde tartışmalı, ama "İran dilleri üzerinden" ifadesi iyi bir nüans veriyor. Kabul.

---

## BATCH 2 — Kavim EN Transliteration (16 kavim)

**Dosya:** `next/public/kavimler.json`

### ✅ Kabul Edilen
- 16 kavimin tümü `mainSurahEn` + `verseRefEn` alanları eklenmiş
- Sun letter asimilasyonu tutarlı: Ash-Shuara, Ash-Shams, Adh-Dhariyat, An-Naml, As-Saffat, Ad-Dukhan
- IJMES-Lite standardında tutarlı: Al-Baqarah, Al-Ahqaf, Al-Haqqah, Al-Furqan, Al-Fajr, Al-Buruj, Al-Anbiya, Al-Qasas, An-Nisa, Ta-Ha
- TR ile eşleşme intact — semantik kayma yok

### ✅ Uygulanan Orta Düzey

- **[O3]** ✅ **Uygulandı** — `Al-Araf` → `Al-A'raf` (4 kavim field'ında: Semud, Medyen mainSurah + verseRef, Sebt). IJMES kesme işareti korundu.

### ⏸ Ertelenen Minör
- **[M1]** `sebe.mainSurahEn: "Saba 34:15-19"` — Diyanet "Saba", Quran.com "Sabaʾ" — küçük stil farkı, kabul edilebilir.

---

## BATCH 3 — Esma-i Hüsna EN Transliteration

**Dosyalar:** `esma-frekans.json`, `esma-surah-heatmap.json`, `esma-kokler.json`, `esma-pairs-ayetler.json`, `esma-triples.json`

### ✅ Kabul Edilen
- Sun letter asimilasyonu tutarlı: Ar-Rahman, Ar-Rahim, As-Sami, As-Salam, As-Sabur, Az-Zahir, An-Nur, At-Tawwab, Adh-Dhariyat, Ash-Shakur, Ash-Shahid, As-Samad
- IJMES-Lite: emphatic dot'lar drop, macron drop — tutarlı
- 114 esma'ya `isim_en`, `okunus_en`, `anlam_en`, `kategori_etiket_en` eklenmiş — coverage tam
- Kompozit isimler (Rabb al-Alamin, Shadid al-Iqab, Arham ar-Rahimin, Khayr al-Ghafirin, Khayr ar-Raziqin) — Diyanet/Saheeh canonical
- Ek 4 esma (As-Sabur, An-Nasir, Al-Khallaq, Al-Mawla) canonical kaynak uyumlu

### ✅ Uygulanan Kritik

- **[K1]** ✅ **Uygulandı** — `metodoloji_en.kalibrasyon` TR/EN drift düzeltildi. TR "Zü'l-Fadli'l-Azîm 6", EN artık "Dhū al-Faḍl al-ʿAẓīm 6" (eski: "Dhū al-Jalāl 2" farklı esma).

- **[K2]** ✅ **Uygulandı** — `esma-triples.json` 4 ayette copy-paste `matchedForm` hatası:
  - 2:255 → "Âyetü'l-Kürsî isim mührü" (Bakara — doğru)
  - 3:2 → "Hayy-Kayyûm açılış zinciri" (Âl-i İmrân — Âyetü'l-Kürsî DEĞİL)
  - 59:24 → "Haşr yaratış üçlüsü" (Haşr — Âyetü'l-Kürsî DEĞİL)
  - 59:23 → "Haşr sekiz-isim mührü" (Haşr — Âyetü'l-Kürsî DEĞİL)

- **[K3]** ✅ **Uygulandı** — `esma-surah-heatmap.json` Rahman `arabic` field:
  - Yanlış: `الرحمان` (orta konumda tam elif, modern Farsî/Urdu)
  - Doğru: `الرحمن` (Kur'anî imla)

### ✅ Uygulanan Orta

- **[O5]** ✅ Bedîu's-Semâvât EN eksik `wa'l-Ard`:
  - Eski: "Badi as-Samawat" / "Originator of the Heavens"
  - Yeni: "Badi as-Samawati wa'l-Ard" / "Originator of the Heavens and the Earth"

- **[O6]** ✅ Zü'l-Fadli'l-Azîm grammatical case:
  - Eski: "Dhu al-Fadli al-Azim" (genitive kalıntısı)
  - Yeni: "Dhu al-Fadl al-Azim" (nominative)

- **[O7]** ✅ Mâlikü'l-Mülk anlam:
  - Eski: "Master of the Dominion, true and absolute Owner of all sovereignty"
  - Yeni: "Owner of the Sovereignty, absolute possessor of all dominion"

- **[O8]** ✅ §13.15 build-time normalize eksikliği:
  - 115 problem char (U+0671 alef wasla) → 0
  - 113 esma `arapca` field'ında `ٱللَّه → اللَّه` benzeri normalize

### ⏸ Ertelenen Minör

- **[M4]** ✓ Doğrulandı — `toplam_isim_sayisi: 114` (99 Al-Ghazali + 15 Kur'anî sıfat)
- **[M5]** ✓ Doğrulandı — `esma-kokler.json` "proxy" metodoloji dispose iyi
- **[M6]** ⏸ Ertelendi — أ م ن kökü `corpusGecis: 2816` şüpheli yüksek (proxy `_min` substring karışıyor olabilir)
- **[M7]** ✓ Doğrulandı — halik-bari-musavvir trGloss klasik tefsir sırasına uygun
- **[M8]** ⏸ Ertelendi — `esma-pairs-ayetler.json` Arapça metin §13.15 audit
- **[M9]** ✓ Doğrulandı — sun letter asimilasyonu doğru
- **[M10]** ⏸ Ertelendi — Rahman heatmap `total: 46` vs frekans `kuranda_gecis_sayisi: 57` tutarsızlığı (metodolojik netleştirme gerek)

---

## BATCH 4 — Tevbe Standardizasyonu (378 replacement, 45 dosya)

### ✅ Kabul Edilen
- Sure adı olarak "Tevbe" Diyanet standardı (Diyanet İşleri Kur'an-ı Kerim Meali "Tevbe suresi")
- Semantik kayıp yok — kelime anlamı korunur
- Klasik alıntılarda Arapça kelime geçtiği için değişiklik alıntı yapısını bozmaz

### ⏸ Ertelenen Orta

- **[O9]** URL slug `/tovbe` korunmuş — TR metinde "tevbe" ama URL'de "tovbe" tutarsızlığı. Bilinçli tercih (backlink koruma) ise OK — ama not düşülmeli. Öneri: `/tovbe → /tevbe` 301 redirect + migration.

- **[O10]** Osmanlıca sözlüklerde madde "Tövbe" olarak geçer — batch replacement bunu da değiştirmiş olabilir, ancak site verisinde kaynak alıntısı olmadığı için kritik değil.

---

## Ertelenen Aksiyon Listesi (Sonraki Batch)

| Öncelik | ID | Bulgu | Dosya |
|---|---|---|---|
| Orta | O1 | Şafak Elmalılı alıntı parafraz | `kuranin-renkleri.json:471` |
| Orta | O2 | Berk "modern meteoroloji" ifade yumuşat | `kuranin-renkleri.json:620` |
| Orta | O9 | URL slug tovbe → tevbe migration | route + redirect |
| Minör | M6 | أ م ن corpusGecis proxy audit | `esma-kokler.json` |
| Minör | M8 | esma-pairs-ayetler §13.15 audit | `esma-pairs-ayetler.json` |
| Minör | M10 | Rahman heatmap 46 vs frekans 57 tutarsızlığı | 2 dosya |
| Tartışmalı | T1 | Elmalılı atıflarında "yorum" vs "birebir" ayrımı | `kuranin-renkleri.json` |

---

## Genel Değerlendirme

**Güçlü Alanlar:**
- Halisination yasağı çok iyi uygulanmış — hiçbir sahte cilt/sayfa citation yok
- EN transliterasyon genel olarak IJMES-Lite standardında tutarlı
- Sun letter asimilasyonu 100'ün üzerinde esma isminde doğru
- Ek 4 esmanın canonical kaynak uyumu doğru
- Metodolojik nüanslar (İrem, Uhdud, Firavun `hasArchaeology: true` + "yorum tartışmalı") sağlam

**Kritik Zayıflıklardan Kurtulundu (bu batch):**
- ✅ Copy-paste editorial hatası (K2) — Haşr'i Âyetü'l-Kürsî sanmak ciddi teolojik hataydı
- ✅ Kur'anî imla ihlali (K3) — الرحمان → الرحمن standartlaştırıldı
- ✅ i18n drift (K1) — TR/EN metodoloji artık senkron
- ✅ §13.15 sistematik açığı (O8) — 115 → 0 problem char

**Öncelik özet:** Kritikler + kritik orta bulgular bu batch'te temizlendi. Kalan orta+minör bulgular sonraki iyileştirme batch'lerinde ele alınabilir.
