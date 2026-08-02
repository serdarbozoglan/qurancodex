
---

# 🟣 GPT-5.2 REVIEW — ACTION ITEMS (2026-07-25) — AKTİF, ADIM ADIM

> **Kaynak:** GPT-5.2 (`gpt-5.2`), 5 ekran görüntüsü + site brief ile içerik+görsel review (~$0.04 · 9.370 token). Epistemik kısıta tam uyumlu — **karşı-argüman YOK, Kur'an üstünlüğü korunur.**
>
> **🎨 RENK-FREEZE KURALI (2026-07-25 kullanıcı kararı):** Palet/tema **DONUK.** Koyu kozmik (#0a0a1a) + antika altın (#d4a574) kimliği değişmez. Yeni bileşenler **mevcut token'ları** kullanır, yeni renk üretmez. Palete dokunan 2 madde parklandı (aşağıda ⛔). Açık/light tema YASAK (denendi, reddedildi).
>
> **Çalışma ritmi:** Her madde → uygula → localhost test (desktop + mobil 390px) → commit → **push için ayrı onay.**

## 🟠 P2 — Daha büyük / sonraya (renk-nötr)
- [ ] **C1. İddia kartlarına 3'lü kaynak rozeti** (Ayet · Tefsir · Akademik) — SourcesCitation'ı genişlet; tam citation drawer sonra. [GPT #2]
- [ ] **C2. Anasayfa "Keşif Rotası" progress UI** + bölüm sonu tek CTA. [GPT #5]
- [ ] **C3. "Araçlar" menüsü: editoryal Top 5** + kartlara "kime uygun?" etiketi (Yeni başlayan/Araştırmacı/Hafız). [GPT #7]
- [ ] **C4. Kaynakça'yı filtrelenebilir yap** (Tefsir/Ulûmü'l-Kur'ân/Dilbilim/Tarih). [GPT #12b]

## 🔵 D — Senin editoryal kararın (otomatik YAPMA, onay bekler)
- [ ] **D1. Başlık yumuşatma** — "İmkansız Ritim"→"Ritmin İncelikleri", "Sıfır Gereksizlik"→**"Metinsel Ekonomi (İcâz)"**. `no-downgrade` ile gerilim (bu *çerçeveleme*, içerik zayıflatma değil). [GPT #1 titles]

## ⛔ PARKLANDI (renk-freeze)
- **B3. Metin kontrastı (griyi açma)** — ERTELE. Yalnız ölçülmüş bir WCAG hatası bulunursa, tek token'da izole + geri-alınabilir tık. Site-geneli tarama YAPMA. Reading Mode + mobil font sistemine **DOKUNMA** (memory kuralı). [GPT #6]
- **C5. Chip/ikon paleti konsolidasyonu** — SKIP. Daha önce de "atla" denmişti; kritik değil, çok bileşene dokunur, renk-freeze kapsamında. [GPT #11]

## 🎨 RENK DEĞERLENDİRMESİ (Claude — kendi analizim, 2026-07-25)
**Genel yargı:** Koyu kozmik (#0a0a1a) + antika altın (#d4a574) palet **güçlü, tutarlı, premium** — kimlik doğru, DEĞİŞTİRME. Estetik renk/tema **donuk** kalır.
- Altın accent tek ve tutarlı → iyi. Glassmorphism + gold-glow "wow" üretiyor → koru.
- Chip çok-renkliliği (mor/mavi/altın): GPT tutarsız buldu; bence **kategorik anlam taşıyor** (kabul edilebilir) → konsolidasyon kozmetik, SKIP.
- **Estetik hiçbir renk değişikliği önermiyorum.** Açık tema fiyaskosu (bu oturum) bunu doğruladı: renk = regresyon riski + öznel anlaşmazlık.

**TEK meşru renk action item'ı — estetik DEĞİL, ERİŞİLEBİLİRLİK (correctness):**

**Sonuç:** Estetik renk = **donuk**. Dokunulabilir tek renk konusu = ölçülmüş WCAG kontrast (E1) — o da yalnız ölçüm gerçekten fail verirse; aksi halde renk işi YOK.

**Önerilen sıra:** A1 → A2 → A3 → B1 → B2 → B4 → (P2). E1 istenirse önce ölçüm. GPT-5.2 tam feedback + maliyet: bu oturum kaydı.

---

---

---

# 🔒 KARAR — İçerik dili meale bağlıdır (2026-08-02, HATA DEĞİL)

**Davranış:** Okuma modunda sûre başlığı, nüzul/mekkî bilgisi ve besmele
çevirisi site diline DEĞİL, seçili **meal yazarının diline** göre görüntülenir.
Kaynak: `ReadingMode.jsx` → `contentLang` (satır ~1160):

```js
const contentLang = MEAL_AUTHORS.find(a => a.id === selectedMealId)?.lang || language;
```

**Gözlenen sonuç:** Kullanıcı EN'e geçer ama meal TR (ör. Suat Yıldırım)
kalırsa navbar İngilizce, sûre başlığı bloğu Türkçe görünür.

**Bu bilinçli bir tercihtir — kullanıcı kararı 2026-08-02: "tam kalsın o
şekilde meale bağlı olarak."** Mantığı: içerik dili = okuduğun metnin dili.
TR meal okurken başlığın da Türkçe olması tutarlıdır.

⚠ **DÜZELTMEYE ÇALIŞMA.** İlgili yerler zaten `contentLang === 'tr' ? … : …`
ile doğru dallanıyor (8297/8319/8329 sûre başlığı, 8680/8702 kitap modu sol
sayfa, 6688 arama paleti); mantık doğru, girdi bilinçli.

Değiştirilmek istenirse asıl soru şudur ve önce ONA karar verilmelidir:
*dil değişince kullanıcının meal seçimi ezilmeli mi?* (Örn. Elmalılı seçmiş
biri EN'e gidip dönünce seçimini kaybetmemeli → dil başına ayrı meal
tercihi saklamak gerekir.) `contentLang`'i tek başına `language`'a bağlamak
yanlış çözümdür.

# 🤖 CHATGPT BULGULARI — Ezber Modülü Kod İncelemesi (2026-08-02)

> **Kaynak:** `gpt-5.2-2025-12-11`, ~12.9K girdi / 2.5K çıktı token.
> **Kapsam:** `useHifzSession.js` + `HifzPanel.jsx` + `ReadingMode.jsx`'in yalnız ezber bölgesi (dosya 10K satır, tamamı gönderilmedi).
> **Durum:** Bulgular **kodla karşılaştırılıp doğrulandı**; ham liste değil. Hiçbiri henüz UYGULANMADI.

## ❌ Yanlış alarm (doğrulandı, iş yok)
- **Durdur'a basınca timer temizlenmiyor** — ChatGPT `onStop`'un neye bağlı olduğunu göremediği için varsaydı. Gerçek: `onStop={stopAudio}` (ReadingMode:9520) ve `stopAudio` → `stopHifzAudio()` → `clearHifzTimers()`. Zincir sağlam.

## 🔴 Gerçek — doğrulandı, yapılmalı
- [ ] **G1. `restartStep()` faz kontrolü yok** — `useHifzSession.js:249`; yalnız `if (!s.active)` bakıyor. "Tekrarla" UI'da sadece gap'te görünüyor ama API açık; `phase === 'playing'` iken çağrılırsa hook başa sarar, ses ortada kalır → UI/ses senkronu bozulur. Fix: `phase` `'gap' | 'paused'` değilse reddet.
- [ ] **G2. `phase` union'ı eksik belgelenmiş** — kod 3 yerde `phase='idle'` atıyor (satır 158, 218, 236) ama `snapshot()` yorumu `'playing' | 'gap' | 'paused'` diyor. Şu an zararsız; TS'ye geçişte veya runtime assert eklenince gerçek hataya döner. Fix: yorumu `'idle' | 'playing' | 'gap' | 'paused'` yap.
- [ ] **G3. `start()` ayet doğrulaması zayıf** — `if (!verse)` truthy kontrolü; `{surah:87, ayah:0}` veya `ayah:NaN` geçer, plan 0. ayeti içerir, `087000.mp3` gibi olmayan dosyaya gider. Fix: `Number.isFinite(verse.ayah) && verse.ayah >= 1`.
- [ ] **G4. Oturum kimliği yok (race)** — `audio.onended` → `setTimeout` kurulur; callback yalnız `hifzAudioRef.current === audio` kontrol eder. Element artık YENİDEN KULLANILDIĞI için (otomatik-çalma kilidi gerekçesi) bu kontrol yeni oturumu eski oturumdan ayırt edemez. Kullanıcı gap sırasında yeni oturum başlatırsa eski `action` yeni oturuma uygulanabilir. Fix: artan `hifzSessionIdRef`, action ile birlikte kapat, callback'te karşılaştır. *(Şu an `stopAudio` timer'ı temizlediği için pratikte tetiklenmesi zor — ama gerçek bir açık.)*

## 🟡 İyileştirme — geçerli ama acil değil
- [ ] **G5. `start()` tam reset yapmıyor** — `live.current = { ...live.current, ... }` eski alanları taşıyor; `loadStep(0)` çoğunu düzeltiyor ama yeni alan eklenirse sızabilir. Fix: spread'siz tam obje.
- [ ] **G6. `hifzPlayAyah` her ayette O(n) arama** — `surahVersesRef.current.find(...)`; Bakara'da yüzlerce adım × lineer arama, üstüne 2 state update. Fix: `ayah → verse` map'i.
- [ ] **G7. Progressbar ARIA fazı** — `aria-valuenow={count}` ancak adım bitince `valuemax`a eşit oluyor; ekran okuyucu "5/5" derken oturum geçişe hazırlanıyor. Fix: `aria-valuetext` ekle.
- [ ] **G8. "Tekrarla" butonunda `aria-label` yok** — ekran okuyucu "↺ Tekrarla" der, neyi tekrarladığı belirsiz. Fix: `aria-label="Bu adımı tekrar çal"`.
- [ ] **G9. `stopHifzAudio` `load()` çağırmıyor** *(ChatGPT "düşük güven" dedi, ben de doğrulamadım)* — `src=''` bazı tarayıcılarda decoder/ağ kaynağını hemen bırakmayabilir. Fix: `removeAttribute('src'); load()`.

# 🎯 YAPILMASI GEREKENLER — SIRADAKI (2026-07-24 güncel değerlendirme)

> **DURUM: Kritik ve yüksek-değer işlerin TAMAMI bitti + push edildi (`500d232`).**
> P0 içerik (14) + P0 SEO (duplicate H1, SSR) + inline-JSX audit (38 fix) + Arabic-fidelity audit (1883 field → 3 fix) + editoryal (retorik/kanıt/jargon hafif dokunuş) + Hakkında/Metodoloji sayfası + Kur'an-üstünlüğü ilkesi (memory) + embedding rebuild — **hepsi done.** İçerik bütünlüğü **3 bağımsız audit turuyla** sağlamlaştırıldı; ref-varlığı + vokatif hitaplar + uydurma-metin taraması TEMİZ.
>
> **✅ OTURUM 2 (2026-07-24 devam) — ChatGPT canlı-site denetimi (8.5/10) triyaj + fix, hepsi PUSH edildi:**
> - **SSR-0 sayaç (#1)** `4d5b901`: AnimatedCounter `useState(0)→useState(target)` — server HTML gerçek değeri içeriyor (SEO/crawler/no-JS); count-up yalnız below-fold scroll'da. Verify: /tr+/en 200, lone-zero=0.
> - **Kırık route/link (#4)** `5786f48`: 74 route'a karşı 85 iç link tarandı → **8 kırık CrossToolCTA** (404) düzeltildi (`/atlas/`↔`/arac/` prefix + tekil/çoğul). 13 route 200.
> - **Renk / "dark discovery + light reading" (#6/#7) — ❌ İPTAL, TAMAMEN GERİ ALINDI (`0c30f2a`):** `/oku` day-mode varsayılanı gündüz yapıldı (`309264a`) + `/hakkinda` açık okuma pilotu (cream/bronz) + navbar solid-koyu denendi. Kullanıcı beğenmedi ("çok açık, menüler okunmuyor") → **hepsi revert.** `/hakkinda`+navbar commit edilmemişti (git checkout); `/oku` push edilmişti → `git revert 309264a` + push (`0c30f2a`). **KARAR: site TAMAMEN KOYU kalır; açık tema yönü kapandı.** (/oku'daki mevcut Sun/Moon toggle dokunulmadı — kullanıcı isterse elle geçebilir; varsayılan gece.)
> - **Kararlar:** Anasayfa uzun formatta KALIYOR (§17 kısaltma rafta). Karşı-argüman ekleme YASAK (Kur'an üstünlüğü). **Açık/light tema YASAK — site koyu kalır (2026-07-24 kullanıcı kararı).**
> - **KALAN geçerli işler:** ChatGPT triyaj (kullanıcı onayı bekliyor): psikoloji sayfası çerçeve, Kaynakça Wikipedia→akademik kaynak. Puan-sıralı liste (aşağıda) hâlâ geçerli.

**KALAN TÜM AÇIK İŞLER — PUAN SIRALI (yüksek→düşük). Puan = Değer + ROI(düşük efor) + Düşük-risk + Hazırlık/aciliyet (0-100). TÜM 389 satır tarandı.**

| Puan | İş (efor) | Değer | Risk | Not (neden bu puan) |
|---|---|---|---|---|
| **58** | **#202 CrossToolCTA kalanı** (~5h) | ⭐⭐⭐ | Düşük | Keşif/çapraz-navigasyon → oturum derinliği. Zaten 18/34 done; ~16 tool verify+kapat. Değer orta (yarısı bitmiş), efor orta. |
| **52** | **Morfoloji tooltip** (P2, ~8-12h) | ⭐⭐⭐⭐ | Orta | Eğitsel derinlik (kelime→kök/fiil/şahıs, Leeds corpus). Kullanıcı-değeri yüksek ama efor+entegrasyon orta → puan orta. |
| **48** | **Güven kutusu** (P2, ~15-20h) | ⭐⭐⭐⭐ | Orta | Epistemik şeffaflık iddia-düzeyinde. Hakkında sayfası site-düzeyinde yaptı → marj azaldı. Değerli ama büyük sistem işi. |
| **38** | **Periyodik kalite audit** (değişken) | ⭐⭐⭐ | — | qc-content/visual/mobil full pass. Bakım; içerik bu oturum **zaten 3 tur** denetlendi → aciliyet düşük. |
| **33** | **#179 Tecvid mic input** (1-2 hafta) | ⭐⭐⭐⭐ | Yüksek | Novel feature (mikrofonla tecvid pratiği) ama tek başına sprint, yüksek efor/risk → puan düşer. |
| **32** | **#180 Root explorer** (1-2 hafta) | ⭐⭐⭐⭐ | Yüksek | Kök-tabanlı kelime keşfi. Aynı: değerli ama uzun-vade sprint. |
| **28** | **RAG v2** (veri biriktikçe) | ⭐⭐⭐ | Orta | Reranker/multi-turn/prompt-evolution/external-vector. Şu an Concierge yeterli; data biriktikçe anlamlı. |
| **22** | **#204 Tab refactor** (25-30h) | ⭐⭐ | Yüksek | Sadece 3 tool gerçekten aday (KissaAtlas/Kadinlar/DuaVerses); çoğunda tab yapay katman. Toplu ÖNERİLMİYOR. |
| **18** | **Sensitive/uzun-vade** | ⭐⭐ | Yüksek | Yorum sistemi, personalization, çok-dil (Arapça RTL UI). Büyük ürün kararları. |

**❌ SKIP (puan yok — değerlendirildi=gereksiz):** Six Gates hover · Kontrast (AAA geçiyor) · İkincil accent · Thumbnail (atla) · Konumlandırma tutarlılığı (kaldırıldı) · token-hardcode-hex (görsel-etkisiz) · **Karşı-argümanlar (YASAK — Kur'an üstünlüğü ilkesi)**.

**Öneri:** #206 zaten yapılmış (todo eskiydi) → yeni ilk 2: **#205 EsmaFrekans hero (80)** + **#203 SourcesCitation 4-tool (78)** (~5h) somut, düşük-risk, yüksek-getiri; sitenin son 2 çerçevesiz büyük aracını premium yapar + kaynak boşluğunu kapatır. + 15 dk'lık atmosfer madde 4 (puan 65) hızlı kazanç.

> **NOT (2026-07-24):** İlk 🎯 taslağımda yalnızca premium-denetim (P0-P3) bölümünü değerlendirmiş, alttaki Araçlar-Audit yol haritasını (Kat. F/G) atlamıştım. Kullanıcı uyardı → tüm 389 satır okundu; liste puan-sıralı tamamlandı.

**Kural (her yeni içerik/kod için):** §13.22 embedding rebuild + §13.23 regresyon verify zorunlu; içerik değişikliği kanonik'e karşı %100 doğrulanır (uydurma YASAK).

---

# 🔴 2026-07-24 — DÖRT DENETİM KONSOLİDE YOL HARİTASI (EN ÖNCELİKLİ)

> **Kaynak:** 4 bağımsız denetim birleştirildi — (A) benim 24-ajanlı **kanonik workflow'um: 204 CONFIRMED** hata [`tasks/wtnjzwhs2.output`], (B) benim **görsel audit: 136 bulgu** [`tasks/w4dd32sfp.output`], (C) **ChatGPT PDF** (61 madde), (D) **Claude** raporu (strateji/anasayfa), (E) **Gemini** raporu (UI/UX/SEO). Detay + kanıt: `tasks/2026-07-24-premium-audit-changelog.md`.
>
> **Güven kuralı:** İçerik değişikliği YALNIZCA kanonik `verse-graph-bgem3.json` + `surah-info.json`'a karşı %100 doğrulanınca yapılır. Skolastik/ton bulguları → "⚠ kullanıcı incelemesi" (uydurma riski).
>
> **✅ PUSH EDİLDİ (2026-07-24, `c3a7844..bb31c80`):** P0 içerik (13 fix) + görsel font/RTL/anchor (`3b8b272`) + a11y lang (`3d65a8c`) + kalan 3 madde (U+06EA doc `4c21293`, tefsir-per-verse `ea37022`, Sıfır Varyasyon rasm `b391f17`) — 21 commit prod'da.
>
> **✅ İNLİNE-JSX İÇERİK AUDIT (META task) — TAMAM:** İlk audit'in kaçırdığı 47 dosya (26 section + 21 hardcoded component) çok-ajanlı tarandı (`wf_2d908475-652`, 87 ajan) → **38 CONFIRMED_ERROR**, hepsi kanonik'e karşı benim tarafımdan re-verify edildi → **38'i de uygulandı** (`f1310ce`,`662f491`,`1b536b2`,`a5c789d` + 8'i kullanıcı onayıyla). SesMimarisi/Nâziât sınıfı inline hatalar artık kapsandı. Detay: changelog "İçerik Audit Workflow (inline-JSX)".
>
> **Konverjans = en güçlü sinyal:** birden çok denetimin aynı bulguyu vermesi öncelik yükseltir.

## P0 — KRİTİK: Faktüel içerik hataları (kanonik-doğrulandı → DÜZELT)

| # | Durum | Dosya · konum | Hata | Doğru | Kaynak |
|---|---|---|---|---|---|
| 1 | ✅ `2c51826` | `SesMimarisi.jsx:71-92` | **Nâziât 79:2 ters meal** | 79:1'e hizalandı (sayfa nâziât temalı) | ChatGPT C01 + kanonik |
| 2 | ✅ `c794236` | `DuaDili.jsx:243`, `InsanTanimi.jsx:173` | **404 link** `/atlas/psikoloji` | `/atlas/insan-psikolojisi` | ChatGPT C02 + me |
| 3 | ✅ `dd0a6e6` | `kiyamet-sahneleri.json` gruplar-ayrilma | Arapça 6:22 değil **10:28** | primaryRef: Yûnus 10:28 | benim wf |
| 4 | ✅ `eea8a90` | `quran-commands.json` kin-gutme | **Hadis (lâ tehâsedû) sahte 49:12 ayet olarak** | verified:false + 'Hadis · Buhârî · Müslim' | benim wf |
| 5 | ✅ `5ed700c` | `CennetCehennem.jsx:1290` | **55:54 cennet ayeti cehennem sütununda**; zakkum yok | yanlış satır kaldırıldı, 55:41/43/44 kanonik | benim wf |
| 6 | ✅ `f2b1e65` | `cennet-cehennem.json` rahmanSimetrisi | **Uydurma "19 cennet + 12 cehennem"** stat | niteliksel-doğru ifadeyle değiştirildi | benim wf |
| 7 | ✅ `3fe8513` | `kuran-retorigi.json` q31 | **Bakara 2:9 uydurma soru formu** (أَيَحْسَبُونَ mushafta yok; 2:9 haber) | uydurma girdi kaldırıldı | benim wf |
| 8 | ✅ `c794236` | `nefis-mertebeleri(-ext).json` emmare | **Kök عمر yanlış → أمر** (ammâra) 2 yerde | kök أ-م-ر | benim wf |
| 9 | ✅ `c794236` | `tr.json` psychology.modern | **"spibiçimite" bozuk kelime** (ritual→biçim replace bug) | "spiritüalite" | benim wf |
| 10 | 🔸 `7205b46` + çelişki çözüldü | Çok sayıda `*.json` verseAr/keyVerseAr | **§13.15 encoding** (۝ ۚ ۗ → tofu) | cennet-cehennem + kiyamet ✅. U+06EA çelişkisi ÇÖZÜLDÜ (`4c21293` — display'de U+0650'ye dönüşür). **Kalan (ayrı, düşük öncelik → DOĞRULA):** ilk-son 1150 / semantic-map 498 U+06EA — ama IlkSonKelimeler runtime'da `cleanArabicMinimal` ile zaten dönüştürüyor (tofu yok); build-time normalize opsiyonel. Diğer bileşenler runtime-clean mi kontrol et, değilse normalize et. | benim wf |
| 11 | ✅ `a137971`,`7c109ef`,`2ec5fa8` | İstatistik tutarsızlıkları | Sunnetullah 4→12/6→10; sebeb-i-nuzul mecciCount 5→7; yâ eyyuhâ 2→10 (+Hac tag); sıddîk 2→4 (İbrahim+Meryem) | kanonik sayı | benim wf |
| 12 | ✅ tam done | Diğer ayet-ref/atıf | ✅ Tâhâ اهْتَدٰى `306b4eb`; ✅ koyun→Dâvûd `306b4eb`; ✅ diyalog 27:40 `6ba8be9`; ✅ Kemâl hadisi 2-hadis `0a87c57`; ✅ Rum 30:3 gelecek kip `21692ee`. ✅ **tefsir-per-verse `ea37022`:** kök-neden fix (split-tefsir.mjs — sûre başlığı strip + ayet-sayısı cap); 66 hayalî anahtar silindi + 39 N:N kirliliği temizlendi, 0 gerçek kayıp. Embedding rebuild'e dahil. | benim wf |
| 13 | ✅ done `b391f17` | "Sıfır Varyasyon" (Koruma) | Başlık korundu + **rasm framing whisper** eklendi: sıfır varyasyon tek konsonantal iskelette (rasm); mütevâtir kıraat ayrı belgeli sözlü katman (çelişki değil kanıt). Araç zaten kıraat-farkındalıklı (Kıraat Atlası linki). | ChatGPT C04 + Claude + Gemini |
| 14 | ✅ `be423b2` | `layout.js`, `page.js` meta | **"sayısal mucize"** (Reşad Halife çağrışımı) | → 'sayısal örüntü' (EN'le tutarlı) | Claude |

> **İlerleme (2026-07-24 final):** ✅ **P0 tablosu TAM** (1-14 done). Eski "kullanıcı incelemesi (3)" maddeleri kullanıcı onayıyla çözüldü: **#10** U+06EA → CLAUDE.md §13.15 bağlam-bağımlı düzeltildi (`4c21293`; kod otorite = ReadingMode korur, display dönüştürür — çelişki yoktu). **#12** tefsir-per-verse → kök-neden fix + regen (`ea37022`). **#13** "Sıfır Varyasyon" → rasm framing whisper (`b391f17`). Detay+kanıt: changelog. **NOT:** tefsir-per-verse.json değişti → §13.22 embedding rebuild'e dahil (EN SONDA).

## P1 — YÜKSEK: Görsel (ÜÇ denetim birleşiyor → en güçlü)

- ⏭ **Tool kartlarına thumbnail/mockup preview** — ATLANDI (kullanıcı: "şu anda atla", 2026-07-24). Tasarım/build işi; sonraya bırakıldı.
- ⏭ **Six Gates hover chip** — DEĞERLENDİRİLDİ: minör UX polish, gerekli değil (kullanıcı yargı bıraktı 2026-07-24). Geç.
- CrossToolCTA locale-prefix (✅ done `dde3503`), scroll-ofset (✅ `7b41387`), responsive (kısmen `4069ba5`)

## P1 — YÜKSEK: Epistemik / editoryal

> **⚠ İLKE (memory `quran-supremacy-framing`, 2026-07-24):** Kur'an Allah kelamı, HARFİ HARFİNE doğru. Örtüşmezlik = bilim/yorum eksikliği, ASLA Kur'an metni değil. Yumuşatma sadece "bilim-hakem" çerçevesini kaldırır, Kur'an'a şüphe düşürmez.

- ❌ **Bilimsel İşaretler karşı-argümanları — YAPILMAYACAK (YASAK).** İlke gereği: karşı-argüman bilimsel görüşü Kur'an'a denk/üstün gösterir. Kullanıcı reddetti. Mevcut criticalNote'lar zaten yorumu/apolojetik aşırılığı sınırlar (Kur'an'ı korur).
- **Konumlandırma tutarlılığı** — kısmen (bilim-hakem çerçevesi kaldırıldı). Kalan: genel akademik↔apolojetik ses tutarlılığı.

## P2 — ORTA  (opsiyonel polish — içerik bütünlüğü yanında kritik değil, sonraya ertelendi)

- ⏳ Her iddiada güven kutusu (kaynak+tür+güven+tarih). Büyük sistem işi.
- ⏳ Morfoloji tooltip (Leeds corpus). Feature.
- SEO H1/H2 (duplicate H1 ✅ `822d634` düzeltildi); hreflang/canonical/schema mevcut.
- ⏭ Kontrast WCAG — DEĞERLENDİRİLDİ: temel renkler AAA geçiyor (offWhite 15.7/silver 7.65/gold 8.81); sistemik sorun yok, geç. ⏭ İkincil accent — öznel estetik, geç.

## P3 — DÜŞÜK (ertelendi)

- ⏳ Veri araçları şeffaflığı: model card, "neden bu ayet?", no-answer/confidence.
- ⏭ token-hardcode-hex (25 — görsel-etkisiz §13.1 kod hijyeni). Düşük değer, ertelendi.

## 🔥 Sıradaki İş Sırası — user belirledi (2026-07-14)

### Kategori A — Kişisel/UX feature'ları (küçük efor, hızlı kazanç)

| # | İş | Efor | Durum |
|---|---|---|---|
| **#173** | Global bookmark — `/kutuphanem` + BookmarkButton | 2-3 saat | ✅ done (fe849bd) |
| **#174** | Verse share cards — OG image gen (WhatsApp/Twitter) | 2-3 saat | ✅ done (d0cce18) |
| **#175** | Reading progress tracker — kaldığın yerden devam | 2-3 saat | ✅ done (3f50517) |
| **#170** | User query history — /sor localStorage chip'leri | ✅ done | already merged |

**Kategori A tamamen bitti (2026-07-15).**

### Kategori B — İçerik ağırlıklı büyütme

| # | İş | Efor | Öncelik |
|---|---|---|---|
| **#176** | ✅ **Kissa Atlas genişletme** — 4 → 12 peygamber + 68 → 104 sahne (45a1b66) | done | 2026-07-15 |
| **#187** | ✅ **Peygamber Atlası** — 5 → 12 peygamber + coğrafi harita (509c70d) | done | 2026-07-17 |
| **#189** | ✅ **Ahiret Yolculuğu Atlası** — `/atlas/ahiret-yolculugu` live, 11 aşama | done | 2026-07-15 |
| **#177** | ✅ **Sebebi-Nüzul tool** — 20 → 30 vaka + RAG corpus (d810547) | done | 2026-07-17 |
| **#185** | ✅ **Muhatap sistemi** — 11 → 14 kategori, 36 → 55 ayet (96ab266) | done | 2026-07-17 |

**Kategori B tamamen bitti (2026-07-17).**

### Kategori C — Mevcut zayıf sayfaların iyileştirilmesi

| # | İş | Efor | Not |
|---|---|---|---|
| **#188** | ✅ Araçlar audit tamamlandı | ✅ done | 46 tool → `docs/reviews/2026-07-14-araclar-audit.md` |
| **#181** | ✅ Sure DNA — SurahComparator sources (4174130) | done | 2026-07-17 |
| **#183** | ✅ Kavram Ağı — 65→78 kavram + görsel wow katmanı + §13.18 premium hero (06b1a1c, fbddcca, 7e404b2) | done | 2026-07-17/21 |
| **#184** | ✅ Münâsebât Atlası — 10 → 16 (4174130) | done | 2026-07-17 |
| **#186** | ✅ Diyalog ağı — 15 → 23 dialogue + 6 axis + 6 speaker (c1a354f) | done | 2026-07-17 |

**Kategori C tamamen bitti (2026-07-17).**

### Kategori D — Teknik büyük iş (uzun vade)

| # | İş | Efor |
|---|---|---|
| **#178** | ✅ Search modu 2 — klasik keyword full-text (624a165, 2026-07-17) | done |
| **#179** | Tecvid interaktif dersler — mic input + Web Speech API | 1-2 hafta |
| **#180** | Root word explorer — Semitic root analysis + türev graph | 1-2 hafta |

**Kalan:** #179 + #180 — her biri tek başına sprint. Kısa işlerle karıştırılmamalı.

### Kategori E — Meta / Denetim

| # | İş | Efor |
|---|---|---|
| **#182** | ✅ Ayet Haritası "Güçlü Bağlantılar" verify — **2026-07-23 Playwright ile doğrulandı**. En-Nisâ: Bakara 118 · Ahzâb 112 · Feth 52 · Âl-i İmrân 49 (toplam 1399 bağ ile tutarlı). Eski "Şuarâ 1117" şişkinliği yok. | done |
| **#171** | Anasayfa /sor CTA — Concierge'in varlığı daha güçlü sinyal | ⚠ **ConciergePrompt zaten hero altında güçlü form (input + rotating placeholder + 6 chip + trust footer); pratikte done** — belki: Hero'ya küçük CTA button eklemek? kararsız |
| **#172** | ✅ SEO polish — sitemap 302→416 URL (+114); 32 tefekkur + 25 tool + 5 üst route + hreflang; /arac/wow legacy dışı (e30e18f, 2026-07-15) | done |

### Kategori F — Araçlar Audit Follow-up (2026-07-14)

> Kaynak: `docs/reviews/2026-07-14-araclar-audit.md` — 46 tool audit, 21 zayıf, sistemsel eksikler (CTA %74, Src %89, Tab %44)

#### Phase 1 — Quick Wins (12 zayıf tool → 3-4/5, toplam ~18 saat)

Her tool: Hero pattern (§13.18) + 1 tab + CrossToolCTA. Component dosyaları: `next/src/components/*.jsx`

| # | Tool (rating) | Component satır | Aksiyon | Efor |
|---|---|---|---|---|
| **#190** | ✅ AltiKonu (1/5 → 3/5) | 117 | Hero var + Highlights ✅ + **CrossToolCTA eklendi** (2026-07-15) | done |
| **#191** | ✅ KorumaZinciri (1/5 → 4/5) | 118 | Hero var + LivingPreservation ✅ + **SourcesCitation** (Suyûtî İtkān, Zerkeşî Burhân, İbnü'l-Cezerî Neşr, Zehebî) + **CrossToolCTA** (Oku, Kıraat, Sebeb-i Nüzul) (2026-07-15) | done |
| **#192** | ✅ Ritim (1/5 → 3/5) | 133 | Hero var + ImpossibleRhythm + RhythmExtensions ✅ + **CrossToolCTA** (Ses, Yeminler, Retorik) (2026-07-15) | done |
| **#193** | ✅ SesMimarisi (1/5 → 3/5) | 122 | Hero var + SoundArchitecture + SoundExtensions ✅ + **CrossToolCTA** (Retorik, Yeminler, Ritim) (2026-07-15) | done |
| **#194** | ✅ RevelationTimeline (1/5 → 3/5) | 375 | **CrossToolCTA** eklendi (Sebeb-i Nüzûl, Münâsebât, Kıssa Atlası) + mevcut Suyûtî inline korundu (2026-07-15). Audit "verse enrich" Phase 2'ye ötelendi. | done (part) |
| **#195** | ✅ TekrarAnatomi (2/5) | 140 | CrossToolCTA + SourcesCitation zaten var (önceki iterasyon) — audit önerileri karşılandı | already done |
| **#196** | ✅ HalkaKompozisyon (2/5) | 144 | CrossToolCTA + SourcesCitation zaten var (önceki iterasyon) — audit önerileri karşılandı | already done |
| **#197** | ✅ RetorikSorular (2/5 → 3/5) | 487 | CrossToolCTA zaten var (önceki iterasyon). Tab yapısı Phase 2'ye ötelendi | partial done |
| **#198** | ✅ AddresseeSystem (2/5 → 3/5) | 463 | **CrossToolCTA eklendi** (Diyalog Ağı, Belâgat, Dua Dili) (2026-07-15). Tab yapısı Phase 2'ye | done (CTA) |
| **#199** | ✅ InsanPsikolojisi (2/5 → 4/5) | 450 | Mevcut CrossToolCTA korundu + **SourcesCitation eklendi** — Gazâlî İhyā, İbn Kayyim Medâricü's-Sâlikîn, Râgıb el-Isfahânî ez-Zerî'a, İbn Miskeveyh Tehzîbü'l-Ahlâk (2026-07-15) | done |
| **#200** | ✅ DuaVerses (2/5 → 3/5) | 566 | Mevcut inline "Nevevî el-Ezkâr, İbn Sünnî, İbn Kayyim el-Vâbilü's-Sayyib" + CrossToolCTA yeterli — audit "Src" bulgusu inline paragrafla karşılandı | audit OK |
| **#201** | Mukattaa (2/5) | ? | CrossToolCTA + SourcesCitation zaten var — audit önerileri karşılandı | already done |

#### Phase 2 — CrossToolCTA Batch (34 tool, ~10 saat)

| # | İş | Efor |
|---|---|---|
| **#202** | CrossToolCTA template + 34 tool'a batch add — 12/34 done (2026-07-16, 3 commit) | ~5h kaldı |

Kalan CTA-eksik tool'lar (verify pending): VerseGraph (Phase 5 target #206), MunafikProfili + diğer 2-CTA olanlar audit'ten geçecek.

**Done batch 1 (4):** KissaAtlas, KadinlarAtlasi, FurukAtlasi, SebebiNuzul (1e03e39)
**Done batch 2 (4):** SemanticMap, ConceptGraph, QuranCommands, DiyalogAgi (b7d37e5)
**Done batch 3 (4):** SurahComparator, WordHeatmap, ZamanBoyutlari, MeselAtlasi (7056b55)
**Skip (1):** EsmaFrekans (custom ClosingReflection zaten var)

**Not:** Bu batch'lerde yeni content JSON eklenmedi — CTA link component değişikliği. §13.22 embedding rebuild gerek YOK.

#### Phase 3 — SourcesCitation Curation ⚠ YENİDEN ÖLÇÜLDÜ (2026-07-23): 41 tool / 30h → **4 tool / ~3h**

| # | İş | Efor |
|---|---|---|
| **#203** | ✅ 3/4 done — QuranCommands+AddresseeSystem+DiyalogAgi SourcesCitation eklendi; WordHeatmap istisna (immersive) | ~done |

**2026-07-23 taraması:** `SourcesCitation` import etmeyen 22 tool tarandı; çoğunda **inline kaynak atfı zaten var** (Râzî/Suyûtî/Zerkeşî/Kurtubî/İbn Kesîr geçen satır sayısı). Gerçek boşluk sadece şunlarda:

| Tool | Inline kaynak bahsi | Durum |
|---|---|---|
| `AddresseeSystem.jsx` | **0** | 🔴 gerçek boşluk |
| `DiyalogAgi.jsx` | **0** | 🔴 gerçek boşluk |
| `WordHeatmap.jsx` | **0** | 🔴 gerçek boşluk |
| `QuranCommands.jsx` | 2 | 🟡 zayıf, eklenebilir |

Yeterli inline kaynağı olanlar (SourcesCitation gereksiz): KuranYeminleri (41), CennetCehennem (37), KavimlerAtlasi (35), ZamanBoyutlari (21), Melekler (17), DogaAtlasi (10), KiyametSahneleri (10), SebebiNuzul (10), TarihselKanitlar (9), FurukAtlasi (8), MunasebatAtlasi (7), IlkSonKelimeler (5), KiraatAtlasi (5), ConceptGraph (4), RetorikSorular (4), SemanticMap (4), DuaVerses (2), RevelationTimeline (2).

Kaynak curation: Râzî *Mefâtîh*, Kurtubî *Câmi'*, Zamahşerî *Keşşâf*, Bikâî *Nazm'ud-Durer*, İbn Kesîr *Tefsîr*, Zerkeşî *Burhân*, Suyûtî *Itkân*.

**İstisna:** İçsel "Kaynaklar" tab'ı olan sayfalar (KavimlerAtlasi, KiyametSahneleri, Melekler, CennetCehennem, ZamanBoyutlari, KuranYeminleri, SebebiNuzul) — SourcesCitation eklenmez (duplicate). Ayrıca memory `feedback_sources_citation_exceptions`.

#### Phase 4 — Tab Refactor (11 flat tool, ~25-30 saat) ⚠ ÖNCE GEREKLİLİK SORGULA

| # | İş | Efor |
|---|---|---|
| **#204** | Tab yapısı — flat single-view'dan multi-tab'a taşı | 25-30h |

**2026-07-23 taraması** (`activeTab` referansı olmayan tool'lar): KissaAtlas, KadinlarAtlasi, ConceptGraph, SemanticMap, SurahComparator, WordHeatmap, RetorikSorular, AddresseeSystem, RevelationTimeline, QuranCommands, DuaVerses. Tab'ı **zaten olanlar**: DiyalogAgi (9), MunasebatAtlasi (8), FurukAtlasi (7), TarihselKanitlar (7).

⚠ **Toplu refactor önerilmiyor.** SemanticMap / WordHeatmap gibi tek-görselleştirme araçlarında tab yapay katman olur. Tool-tool karar verilmeli; sadece gerçekten çok-boyutlu içeriği olanlar (KissaAtlas, KadinlarAtlasi, DuaVerses) aday.

#### Phase 5 — EsmaFrekans + VerseGraph Polish (~5 saat) — 🔴 KALAN EN YÜKSEK GETİRİLİ İŞ

| # | İş | Kod durumu (2026-07-23) | Efor |
|---|---|---|---|
| **#206** | ✅ DONE (40763af) VerseGraph → Hero + CTA + metodoloji intro | 3287 satır; ToolHeader ❌ CTA ❌ hero ❌; hâlâ `position:fixed; top:62px` (`VerseGraph.jsx:1054`) | 2-3h |
| **#205** | EsmaFrekans → ToolHeader + Hero + CTA + metodoloji intro | 3797 satır (sitedeki en büyük tool); ToolHeader ❌ CTA ❌ tab ❌; CTA kısmen `ClosingReflection` içinde karşılanmış | 2-3h |

**#206 neden önce:** Pattern kanıtlanmış — ConceptGraph 3 gün önce (7e404b2) tam bu işlemden geçti: anchor verse + italik çeviri + UPPERCASE ref label + filigree divider + eyebrow + micro-stat ribbon. Aynı şablon tek dosyaya uygulanır.

**Not:** 3D/heatmap logic dokunulmayacak — sadece page-UX çerçevesi eklenecek. §13.17 modal istisnası VerseGraph'i kapsıyor, `position:fixed` yapısına dokunulmaz → düşük risk.

### Kategori G — Dış AI Görüşlerinden Süzülen Yeni Fikirler (2026-07-14)

> Kaynak: 3 farklı AI (Claude başka instance, ChatGPT, Gemini) siteyi değerlendirdi. Duplikat öneriler filtrelendi (çoğu mevcut ekosistemi tam görmedi). Aşağıdaki 5 fikir **gerçekten yeni** ve site DNA'sıyla ("hidden architecture") uyumlu.

| # | İş | Kaynak | Değer | Efor |
|---|---|---|---|---|
| **#207** | ✅ **Eleştirel Çerçeve** — `/arac/elestirel-cerceve` (f012a1d) | Claude#3 | ⭐⭐⭐⭐⭐ | done 07-19 |
| **#208** | ✅ **Cause→Effect Atlas** — `/arac/neden-sonuc`, 10 zincir (c86e8ab) | GPT#4 | ⭐⭐⭐⭐⭐ | done 07-19 |
| **#209** | ✅ **İnsan Yolculuğu Atlası** — `/atlas/insan-yolculugu`, 10 aşama (a50aad2) | GPT#10 | ⭐⭐⭐⭐ | done 07-21 |
| **#210** | ✅ **Yakın Anlamlı Nüanslar** — `/arac/yakin-anlamli-nuanslar`, 10 set / 32 terim (2ccfb08) | Gemini#1 | ⭐⭐⭐⭐ | done 07-21 |
| **#211** | ✅ **Kitap Kavramı** — `/arac/kitap-kavrami`, 10 self-name (9ce6b82) | Claude#4 | ⭐⭐⭐⭐ | done 07-19 |

**Kategori G tamamen bitti (2026-07-19 → 07-21).** 5 fikir de tool'a dönüştü; hepsi ToolHeader + CTA + SourcesCitation + BookmarkButton ile tam pattern uyumlu (2026-07-23 taraması).

**Reddedilenler (düşük ROI veya duplikat):**
- Mushaf karşılaştırması — akademik değerli ama yatırım yüksek, marj düşük
- Sayısal Yapılar — MathMiracle anasayfada zaten var
- Semantik Katmanlar (Gemini#2) — çok geniş, konkret değil; mevcut kategori sistemi yeterli
- Münâsebât / Nüzûl / Kavram Ağı / Diyaloglar / Karakterler / Kavram Sözlüğü / Sorular → Kategori C'de zaten var (#177, #181, #183-187, #197) — extend et, yeni yaratma

---

## 🎯 Önerilen Sprint Sırası (2026-07-23 revizyonu)

Kategori A, B, C, G ve F/Phase-1 kapandı. Kalan **7 iş** şu sırayla:

**Sıradaki (bu hafta):**
1. **#206 VerseGraph Hero** (2-3h) — kalan en yüksek getirili tek iş. ConceptGraph pattern'ı (7e404b2) hazır şablon; sitenin amiral gemisi aracı §13.18 hero'su olmayan tek büyük tool.
2. **#205 EsmaFrekans Hero + ToolHeader** (2-3h) — aynı iş, 3797 satır olduğu için daha dikkatli.
3. **#203 SourcesCitation — 4 gerçek boşluk** (~3h): AddresseeSystem, DiyalogAgi, WordHeatmap, QuranCommands.

**Sonra:**
4. **#202 CrossToolCTA kalanı** — 18/34 done; kalanlar tek tek verify edilip kapatılır.
5. **Atmosfer raporu madde 4** (15 dk) — anasayfa section'larında `borderRadius: '20px'` hâlâ 5 yerde; rapor 12px öneriyor. Görsel karar user'ın.

**Sorgulanacak (otomatik başlama):**
6. **#204 Tab refactor** — 11 flat tool, ama toplu refactor önerilmiyor (yukarıdaki nota bak). Tool-tool karar.

**Uzun vade (her biri tek başına sprint):**
7. #179 Tecvid mic input, #180 Root explorer — 1-2 hafta each.

---

## 📋 Uzun Vadeli / Sonra Değerlendirilir

### RAG v2 (data biriktikçe)
- Cross-encoder reranker (BGE-reranker-v2-m3)
- Multi-turn conversation memory
- Prompt evolution (feedback-driven monthly batch)
- External vector DB (Upstash Vector / Pinecone → 0 cold start)

### Kalite audit'leri
- **qc-content-auditor** full pass — hadis atıfları, bilimsel iddialar
- **qc-visual-auditor** + director — belirli sayfa/tool premium look
- **Mobil UX** full walkthrough

### Sensitive
- Comment sistem
- Personalization
- Multi-lang expansion (Arapça UI RTL)

---

## ⚠ Bilinen Constraint'ler

- **Vercel function size:** 250 MB uncompressed. Şu an corpus 195 MB, marj ~55 MB.
- **Upstash KV free tier:** 500K komut/gün. Query başına ~10 komut → ~50K query/gün max.
- **Git LFS:** 1 GB/ay free bandwidth → ~5 deploy/ay.
- **Anthropic prompt cache:** 5 dk TTL.

---

## 📁 Referans Dosyalar

- **RAG mimari doc:** `docs/rag-architecture.html` (bilingual TR/EN)
- **Memory (Claude notları):** `~/.claude/projects/-Users-serdar-dev-00-dev-PROJECTS-01-qurancodex/memory/`
- **Audit raporları:** `next/docs/reviews/`
