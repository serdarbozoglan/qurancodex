# QuranCodex — Premium Denetim & Düzeltme Changelog (2026-07-24)

## ▶ RESUME — BURADAN DEVAM ET (limit sonrası / taze ajan)

**Protokol:** yalnızca %100 doğrulanmış değişiklik; asla uydurma; commit YAP, push YAPMA; mobil (390px) overflow kontrol et.

**Sıradaki iş — görsel MEDIUM `arapca-font-kucuk` (aşağıdaki liste).** Her biri: mevcut değeri dosyada DOĞRULA (satır no kaymış olabilir → grep ile bul), sonra fontu büyüt. Kur'an AYET metni ideal 1.3-1.6rem; kompakt terim/chip ≥1.1rem. `...TEXT.verseArabic` + `fontSize` override varsa override'ı KALDIR (token clamp 1.4-1.9rem kullansın).

Düzeltilecekler (dosya · konum · hedef):
- KavimlerAtlasi ~1044-1051 `...TEXT.verseArabic` + `'1.1rem'` override → override kaldır
- KissaAtlas ~833-837 ayet `'1.2rem'` → `isMobile ? '1.25rem' : '1.4rem'`
- SunnetullahAtlasi ~775-786 highlightPhraseAr `'1.1rem'` → `isMobile ? '1.05rem' : '1.25rem'`
- YakinAnlamliNuanslar SetDetail ~380 VERSE_BLOCK — (Batch1'de zaten override kaldırıldı, TEKRAR KONTROL et)
- YakinAnlamliNuanslar hero ~106-114 anchor `1.35rem` sabit → `clamp(1.4rem, 3vw, 1.9rem)` (kardeş tool'larla eşit)
- KiyametSahneleri tablo ~1147 `'0.95rem'` → ≥`1.1rem` + renk gold
- Melekler alternateNames chip ~532 `'0.9rem'` → `1.05-1.1rem` + lineHeight 1.6
- KuranRenkleri ~496 (1rem), 620 (1.05rem), 2845 (0.95rem) → ≥1.1rem
- DogaAtlasi ~1164 ayet `'1.2rem'` → ≥`1.3rem`
- ZamanBoyutlari ~1281 expandedRow `'1.2rem'` → `1.4rem` (collapsed 1227 ile eşit)
- DiyalogAgi ~1055 keyPhrase `'1rem'` → `isMobile ? '1.15rem' : '1.3rem'`; ~899 non-confession → ≥`1.3rem`
- MunafikProfili ~1068 mirror verse `'1.15rem'` → `isMobile ? '1.2rem' : '1.4rem'`
- EsmaFrekans ~1918 ayet `'1.05rem'` → `clamp(1.15rem, 2vw, 1.4rem)`
- ConceptGraph ~637 kavram chip `'1rem'` opacity 0.68 → `1.1rem` opacity 0.8
- InsanTanimi ~242 ayet `'1rem'` → `isMobile ? '1.1rem' : '1.25rem'`
- InsanYolculugu ~544 `...TEXT.verseArabic` + `'1.1rem'` override → override kaldır
- QuranCommands ~602 ayet `'1.15rem'` → `clamp(1.2rem,1.8vw,1.45rem)` + `dir="rtl" lang="ar"` HTML attr ekle (~600-609)
- DuaVerses ~406 hero clamp min `1.05rem` → `1.2rem`
- VerseGraph ~804 sûre-adı dropdown chip `0.9rem` → `0.95rem` (kompakt, bilinçli küçük — düşük öncelik)

**FONTS.arabic (Kur'an-olmayan) düzeltmeleri** (§13.2 — isim/eser etiketleri FONTS.quran YERİNE FONTS.arabic):
- MunasebatAtlasi ~224/436; SebebiNuzul ~1122/1160 → FONTS.arabic + ≥1.05rem

**RTL erişilebilirlik (`dir="rtl"` HTML attr eksik, §9/§13.2):**
- QuranCommands ~600-609; IbadetlerHub ~451/656/695; IbadetlerPillar ~494/660 → `dir="rtl"` ekle

**Sonra:** görsel `renk-tutarsizlik` (5 — sadece net olanlar: CennetCehennem Hero anchor GOLD→COLORS.gold), sonra görsel LOW net olanlar. **token-hardcode-hex (25) ERTELENDİ** (aşağı bak).

**İçerik audit workflow** (`wf_c9754a28-30a`) bittiğinde bulguları işle: her CONFIRMED'i KENDİN kanonik `verse-graph-bgem3.json` + `surah-info.json`'a karşı tekrar doğrula, sonra düzelt. Doğrulayamadığın skolastik bulguyu DEĞİŞTİRME → "⚠ kullanıcı incelemesi" bölümüne yaz. Bulguları todo_2026-07-14 BAŞINA yaz.

**Doğrulama helper'ları hazır:** `scratchpad/verify-addressees.mjs` (kod-noktası norm + kanonik yükleme pattern'ı). Kanonik Arapça karşılaştırmada hareke/waqf'i norm ile sök.

**Embedding rebuild EN SONDA** (bkz. memory `project_pending_embedding_rebuild`).

---


> Otonom mod. Kullanıcı istirahatte. Kural: **yalnızca %100 doğrulanmış değişiklik; asla uydurma; içerik hassas.**
> Commit yapılır, **push YAPILMAZ** (kullanıcı dönünce onaylar). Embedding rebuild en sonda.

## Protokol (kendime bağlayıcı)

1. **İçerik değişikliği** ancak şu durumda yapılır:
   - Kanonik veriye (`verse-graph-bgem3.json` Arapça/ref, `surah-info.json` Mekkî/Medenî) karşı **fiilen doğrulandıysa**, VEYA
   - Deterministik gerçekse (yasak kelime "pasaj"/"ritüel", render karakteri U+06D5/06DA/06DD, duplikat, kanonikten sayılan istatistik).
2. **Skolastik/yorum gerektiren** ve %100 doğrulayamadığım bulgu → **DEĞİŞTİRİLMEZ.** todo'ya "⚠ kullanıcı incelemesi gerek" olarak yazılır.
3. Her değişiklik: dosya · ne değişti · **doğrulama kanıtı** · commit hash — aşağıya yazılır.
4. Görsel değişiklik: ekran görüntüsü veya kanonik ölçümle doğrulanır.
5. Refuted/uncertain bulgular değiştirilmez.

## Workflow'lar
- İçerik audit+verify: `wf_c9754a28-30a` (12 shard)
- Görsel audit: `wf_5930bb72-9a0` (10 shard)

---

## Uygulanan Değişiklikler

> **Durum (devamlılık için):** Görsel audit BİTTİ (136 bulgu: high 3 / medium 47 / low 86). İçerik audit HÂLÂ ÇALIŞIYOR (`wf_c9754a28-30a`). Görsel bulgular işleniyor. Kaldığım yer: MEDIUM görsel bulgular — scroll-ofset bitti, sırada **arapca-font-kucuk (7)** + **renk-tutarsizlik (5, sadece anchor-gold gibi net olanlar)**. Sonra LOW'ların net olanları. token-hardcode-hex (25) = görsel-etkisiz kod hijyeni → ERTELENDİ (aşağıda "sonra" listesi).

### Batch 1 — `dde3503` (görsel HIGH)
- **CrossToolCTA locale-prefix bug** (14 href / 5 dosya: AltiKonu, AddresseeSystem, KorumaZinciri, SesMimarisi, Ritim). `href: '/arac/X'` → `` `/${language}/arac/X` ``. **Kanıt:** CrossToolCTA href'i olduğu gibi `<Link>`'e veriyor (satır 50); prefix'siz href EN kullanıcıyı TR'ye düşürüyordu. HTTP 200 tr+en; mobil+desktop overflow yok.
- **YakinAnlamliNuanslar** ayet fontu: `...TEXT.verseArabic` + `fontSize:'1.05rem'` override kaldırıldı → token varsayılanı (clamp 1.4-1.9rem). Mobil 390px overflow yok.

### Batch 2 — `4069ba5` (responsive)
- **Melekler HeroStats:** `repeat(3,1fr)` → `repeat(auto-fit, minmax(200px,1fr))` (HeroStats isMobile almıyor; auto-fit ile mobilde 1-kolon). **Mobil ekran görüntüsüyle doğrulandı** (stat tam-genişlik).
- **MeselAtlasi tab bar:** transparan `rgba(8,9,26,0.8)` → opak `rgb(6,8,14)` (§13.19).
- **NOT (değiştirilmedi):** SurahComparator `WordVenn` responsive bulgusu → fonksiyon tanımlı ama **hiç çağrılmıyor (ölü kod)**. Doğrulandı, dokunulmadı.

### Batch 3 — `7b41387` (scroll-ofset)
- IblisSatan passage 20px→80px (navbar); IlkSonKelimeler grid header 12px→120px; SunnetullahAtlasi + BilimselIsaretler tab bar'a `scrollMarginTop:'120px'` (§13.19). HTTP 200 (4 route).

### ⏳ SONRA — token-hardcode-hex (25 bulgu) ERTELENDİ
Görsel-etkisiz §13.1 kod hijyeni (hex→token, renk aynı görünür). Bir kısmı "yakın ama farklı" renk (yanlış swap görünümü değiştirir → risk). Kullanıcı-görünür değeri yok; content + net görsel bittikten sonra ele alınacak. Dosyalar: CennetCehennem, VerseGraph, ZamanBoyutlari, DogaAtlasi, DuaVerses, SebebiNuzul, IbadetlerPillar, KiraatAtlasi, MeselAtlasi, SurahComparator, InsanPsikolojisi, NefisMertebeleri, TarihselKanitlar, RevelationTimeline, FurukAtlasi, WordHeatmap, SunnetullahAtlasi, QuranCommands, MunafikProfili, DiyalogAgi, KuranYeminleri, KuranRetorigi, WowFacts, ElestirelCerceve.

---

## Değiştirilmeyen — Kullanıcı İncelemesi Gerek (⚠ %100 doğrulanamadı)

_(doğrulayamadığım skolastik bulgular buraya)_
