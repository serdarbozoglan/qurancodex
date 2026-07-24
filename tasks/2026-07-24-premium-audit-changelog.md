# QuranCodex — Premium Denetim & Düzeltme Changelog (2026-07-24)

## ▶ RESUME — BURADAN DEVAM ET (limit sonrası / taze ajan)

**Protokol:** yalnızca %100 doğrulanmış değişiklik; asla uydurma; commit YAP, push YAPMA; mobil (390px) overflow kontrol et.

**✅ TAMAMLANDI (`3b8b272`) — görsel MEDIUM `arapca-font-kucuk` + FONTS.arabic + RTL + anchor-gold.** 22 dosya: 17 font büyütme, 4 FONTS.arabic swap (Munasebat/SebebiNuzul isim-eser), 6 dir="rtl" attr (QuranCommands lang-bug dahil), 1 renk (CennetCehennem hero anchor→COLORS.gold). Localhost 200 (21 route), mobil 390px overflow yok. **P0 içerik tablosu da tamam:** 13 done + 3 kullanıcı-incelemesi (#10 U+06EA, #12 tefsir-per-verse 66 hayalî anahtar, #13 Sıfır Varyasyon) — `85434d6`.

**Sıradaki iş — görsel LOW (sadece net olanlar), sonra P1 editoryal (⚠ çoğu kullanıcı-incelemesi).** token-hardcode-hex (25) ERTELENDİ (görsel-etkisiz). Aşağıdaki eski liste referans amaçlı korundu.

<details><summary>Tamamlanan font listesi (referans)</summary>

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

**NOT:** VerseGraph ~804 dropdown chip (0.9rem) UYGULANMADI — maxWidth:72px truncate'li kompakt chip, büyütme overflow riski; RESUME'da "düşük öncelik/bilinçli küçük" işaretliydi, dokunulmadı.
</details>

**Sonra:** görsel LOW net olanlar. **token-hardcode-hex (25) ERTELENDİ** (aşağı bak).

**✅ TAMAMLANDI — CennetCehennem `lang: 'ar'` a11y bug (15 yer).** `lang: 'ar'` style objesi İÇİNDE yazılmıştı → CSS'te no-op; element'te gerçek `lang` attr yoktu (screen-reader Arapçayı doğru seslendiremiyordu). 15 element'e `dir="rtl" lang="ar"` JSX attr eklendi + style'dan no-op `lang:'ar'` çıkarıldı (13'ü attr ekleme, 2'si zaten attr'lı → sadece style temizliği). Görsel etki sıfır (`direction:'rtl'` CSS zaten vardı). Route 200, 0 kalıntı. (Aynı bug QuranCommands'te de → `3b8b272`.)

**§13.18 anchor-renk sweep SONUCU:** Tüm component'ler tarandı — CennetCehennem tek gerçek ihlaldi (düzeltildi). Melekler `GOLD=softGold` var ama anchor verse'i zaten `COLORS.gold` (softGold sadece genel VerseBlock accent'inde = meşru). Başka ihlal yok.

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

---

## İçerik Audit Workflow (inline-JSX) — 2026-07-24

Workflow `wf_2d908475-652`: 47 dosya (26 section + 21 hardcoded component), 87 ajan, **38 CONFIRMED_ERROR**. Her biri benim tarafımdan `verse-graph-bgem3.json` + `surah-info.json`'a karşı yeniden doğrulandı.

**✅ Uygulandı (30) — `f1310ce` + `662f491` + `1b536b2`:**
Ayet-ref/atıf/Arapça: SesMimarisiCard 79:2→79:1 + ص "sert", ProphetAtlas 21:87→37:143-144, CennetCehennem 15:44 hadis→Kur'an + 37:64→37:27, HumanDefinition Muʿridûn, EsmaFrekans 20:82→16:110 + 34:2 sıra, KuranRenkleri (Musa el Bakara→Şuarâ, 56:23→37:49, 3:106 فأما, İnsan gümüş, altın 3 sûre), Melekler 42:51 vahiy, KiyametSahneleri 56:5 بُسَّتْ, IlkSonKelimeler Sebbih(A'lâ). İstatistik/dil: LinguisticDNA tilke 5/5→3/5, DuaDili 11→10, KadinlarAtlasi 7→14, SunnetullahAtlasi EN 6→10, SoundExtensions şedîde, DogaAtlasi Z.Naik "astronom" kaldırıldı, ZamanBoyutlari 309.017→309.21.

**✅ KULLANICI ONAYIYLA UYGULANDI (8) — `a5c789d`** (skolastik/harici; kullanıcı 2026-07-24 onayladı):
Risale-i Nur: Onuncu Söz 9→12 hakikat, Âyetü'l-Kübrâ Lem'alar→Şualar (TR+EN). Aruz: el-Halîl 16→"Aruzun 16 Vezni" + Ahfeş notu, Kâmil "çoğu Muallakât"→"bazı (Lebîd/Antere)". Mukattaa: "diğer 28 tek ayet" genellemesi düzeltildi + faydalı not (bağımsız ayet vs ilk ayete gömülü). ZamanBoyutlari: ~1.8×10¹⁰→~1.8×10⁷ (≈7 basamak).

<details><summary>Orijinal kullanıcı-inceleme detayı (referans)</summary>

1. **LinguisticDNA.jsx:158** — mukattaa ayet-sayımı. "Şûrâ hariç diğer 28 sûrede mukattaa tek ayet sayılır" genellemesi kısmen hatalı: الر grubu (10,11,12,14,15), المر(13), طس(27), ص(38), ق(50), ن(68) mukattaayı 1. ayete GÖMER, bağımsız ayet saymaz. Kûfî/Hafs sayımı skolastik — kesin sayı (18 vs 28) tartışmalı.

2-5. **KiyametSahneleri.jsx:1208 (TR) + :1235 (EN)** — Risale-i Nur bibliyografyası (harici eser, kanonik değil):
   - "Yedinci Şua (**Lem'alar** — Âyetü'l-Kübrâ)" → Âyetü'l-Kübrâ **Şualar**'da (The Rays), Lem'alar'da değil. ("Yedinci Şua" zaten Şualar'a ait — çelişkili.) *Değerlendirmem: yüksek güven, ama harici eser → onayınız.*
   - "Onuncu Söz'ün omurgası ... **dokuz** hakikat" → Onuncu Söz **on iki (12)** hakikat içerir. *Değerlendirmem: yüksek güven.*

6. **RhythmExtensions.jsx:114** — "el-Halîl'in 16 Vezni" → el-Halîl **15** vezni sistemleştirdi; 16. (Mütedârik) öğrencisi el-Ahfeş tarafından eklendi. Edebiyat tarihi nüansı.

7. **RhythmExtensions.jsx:19** — "Muallakât'ın çoğu Kâmil vezninde" → çoğu **Tavîl** vezninde (Imruʾu'l-Kays, Tarafe, Zuheyr); Kâmil yalnızca 2 kasidede. Edebiyat tarihi.

8. **ZamanBoyutlari.jsx:537** — "Kadr gecesi ↔ 50.000 yıllık gün farkı ~1.8×10¹⁰" → karşılaştırma tabanına göre ~1.8×10⁷ (50.000 yıl ≈ 1.8×10⁷ gün) olabilir; mertebe belirsiz, apolojetik.

**Not:** Risale-i Nur (2-5) ve edebiyat tarihi (6-7) bulguları harici kaynaklara ait — Kur'an kanonik verisiyle doğrulanamadığı için ilk turda uygulanmadı; **kullanıcı onayıyla `a5c789d`'de düzeltildi.**
</details>
