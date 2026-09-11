# Kaynak Doğruluk Denetimi — Master Envanter (B1 / provenance)

> 5 paralel denetim agent'ı ~30 iddia-yoğun bileşeni (+ ilgili JSON) taradı.
> Amaç: her kaynak-iddiasını "kesin künye / muğlak / şüpheli" diye sınıflamak,
> sonra **allowlist + nokta-referans + link** politikasıyla düzeltmek.
> Politika: kaynak ya birincil eserin kendisi, ya da otoritesi tartışmasız
> doğrulanabilir dijital karşılığı (quran.com/tanzil · corpus.quran.com ·
> sunnah.com · altafsir.com · shamela.ws · archive.org · DOI). Rastgele
> site/wiki/blog = işaret levhası, KÜNYE DEĞİL. Doğrulanamayan → yumuşat/çıkar.

## Genel tablo
Site **çoğunlukla disiplinli**: Kur'an-hadis ayrımı, i'câz-karşıtı çerçeveleme,
"araştırmacı hipotezi"/ℹ işaretleri veri seviyesinde var. Sorunların çoğu
**MUĞLAK** (eser adı var, loci yok) — işaretsiz uydurma neredeyse yok. Ama
birkaç gerçek **ŞÜPHELİ/YANLIŞ** iddia ve bir "Doğrulandı rozeti ama loci yok"
sistemik sorunu var.

## Model dosyalar (referans standart — önce bunlara bak)
Zaten iyi kaynaklı, diğerleri buna çekilecek:
`TarihselKanitlar`, `KavimlerAtlasi`, `SunnetullahAtlasi`, `MeselAtlasi`,
`NefisMertebeleri`, `DuaDili`, `KuranYeminleri` (~19 kesin), `Melekler`
(dereceli hadis künyeleri), `KadinlarAtlasi`, `TafsirPanel` (temiz).

---

## TIER A — DOĞRULUK (önce bunlar; YANLIŞ olabilir)
1. **Bilimsel İşaretler → "iki deniz" → "Jacques Cousteau (1962+)"** — uydurma
   internet efsanesi (§13.30). → Cousteau atfını KALDIR/yeniden çerçevele.
2. **Cennet & Cehennem → "8 kapı" Zümer 39:73'e bağlı** — âyet "kapılar" der,
   "8" sayısını İÇERMEZ (8 hadis kaynaklı). → sayıyı hadis kaynağına bağla veya
   âyet-loci'yi düzelt.
3. **temsil görüşü ÇİFT ATIF:** MukattaaViews "Zemahşerî işaret eder" derken
   Mukattaa.jsx SourcesCitation aynı "14 harf = elifbânın yarısı" fikrini
   **Bâkıllânî**'ye atfeder. → biri yanlış; birincil metinden teyit et, birleştir.
4. **Tefsirİhtilafları → ibn-kayyim eseri "el-Emsâl fi'l-Kur'ân (İ'lâmü'l-
   Muvakkı'în'den)"** — İʿlâmü'l-Muvakkıîn usûl-i fıkıh eseridir, Kur'ân
   emsâli değil. → şüpheli eser-atfı, gerçek kaynağı teyit et.
5. **Doğa Atlası → Târık → pulsar (Zakir Naik üzerinden)** — §13.24 i'câz
   çerçevesi + popülist kaynak. → kaldır veya güçlü şekilde yeniden çerçevele.
6. **Melekler → "İblis A'râf 7:11'de melek olarak anılır"** — 7:11 İblis'i
   istisna eder, "melek" demez. → ifadeyi düzelt (tartışma çerçevesi kalabilir).
7. **KuranYeminleri → totalOaths=47 vs ToolHeader "25+ yemin"** — iç çelişki.
   → başlık sayısını düzelt (kolay).

## TIER B — "DOĞRULANDI" ROZETİ ama LOCİ YOK (güven mayını, yüksek görünürlük)
8. **tefsir-ihtilaf.json vaka alıntıları (~30 pozisyon, 8 vaka)** — her biri
   bir müfessire ait **doğrudan Arapça alıntı** + **"Doğrulandı/Verified" rozeti**
   taşır ama `refTr` (loci) HER birinde BOŞ. Rozet, dayanaksız öz-sertifika.
   → ya nokta-loci ekle (altafsir'den teyitli) ya "Doğrulandı" rozetini kaldır.

## TIER C — KAYNAKSIZ (kaynak ekle veya yumuşat/çıkar)
9. **esbabin-nuzul.json 20-olaylık siyer çizelgesi** (İlk Vahiy, Miraç, Bedir
   "313'e karşı 1000"…) — `source`/`reliability` alanı HİÇ YOK. → kardeş
   sebeb-i-nuzul.json gibi kaynak+derece ekle veya "geleneksel siyer nakli" işaretle.
10. **WowFacts sayıları:** "124.000 peygamber" (koleksiyon adı yok), "Allah 2699×"
    (gösterilen sayıya kaynak yok), "Fâtiha günde ~40× + milyarlarca kez" (kurgu +
    mübalağa), Meryem "34 âyet", İbrahim "10+ dua". → kaynak veya yumuşat.
11. **Kıraat Atlası kurgu sayılar:** "452 kelime = 113×besmele×4" (aritmetik
    artefakt), "77.400 kelime / %0,07" (77.400 kaynaksız), "%95 Hafs" (tahmin
    işaretli, kaynaksız). → soft/işaretle.
12. **ProphetAtlas ~780:** "her taşın belirli biri için işaretlendiği rivayet
    edilir" (Hûd 11:82) — kaynaksız İsrâiliyyât. → kaynak veya çıkar.
13. **KissaAtlas:** "*Divine Speech* (Nouman Ali Khan) Mir'i doğrudan kaynak
    gösterir" — üçüncü kitaba dair spesifik iddia. → o kitaptan teyit et.
14. **Ünlü-alıntı deseni (verbatim gibi sunulan):** Gazâlî "hayır derinlikle
    ölçülür" (ZamanBoyutları), Şâfiî "bu sûreden başka inmeseydi yeterdi"
    (KuranYeminleri/WowFacts), "en çok korktuğum küçük şirktir — Ahmed b. Hanbal,
    sahih" (Münafık, Mahmûd b. Lebîd rivayeti, loci yok). → teyit et veya "nisbet
    edilir"e çevir.
15. **İcmâ/çoğunluk iddiaları:** ZamanBoyutları "müfessirlerin büyük çoğunluğu /
    İbn Kesîr-Râzî-Elmalılı icmâıdır" — kaynaksız. → yumuşat.
16. **Companion atfı:** MukattaaViews mutesabih "Ebû Bekir/Ömer/Osman/Ali/İbn
    Mes'ûd'dan nakledilir" — isnad/kaynak yok.

## TIER D — MUĞLAK (eser adı var, loci yok) — sistemik çoğunluk
Bibliyografya seviyesinde; "hangi hadis/hangi sayfa?" sınamasını geçmez.
Nokta-loci'ye çekilecek (Tier-1 otomatik-link, Tier-2 teyitli):
- **sebeb-i-nuzul.json 30 sebep:** koleksiyon + derece var, **hadis/sayfa no yok**.
- **SourcesCitation panelleri** (ProphetAtlas, KissaAtlas, Kadinlar, Mukattaa,
  Kavimler-Nuh "klasik yorum", DuaDili hariç çoğu): eser adı, loci yok.
- **MukattaaViews atıfları:** tehaddi (7 isim, 0 loci), sure-adi (yalnız el-İtkân
  adı, bölüm yok), isimler, kasem, tenbih ("dilcilerden bir grup").
- **Çıplak müfessir adları:** AltiKonu, DogaAtlasi (Mücâhid/İbn Abbâs/Hasan Basrî
  burc/hunnes yorumları), SoundExtensions (Zemahşerî/Râzî/Sells — sayfa yok).
- **Muğlak kaynak-tipi:** Bilimsel "Bucaille 1976 / modern ders kitapları",
  Kıraat "Melchert, Oxford" (eser/yıl yok), WowFacts "Farrin research" (yıl yok),
  Kiyamet "Süyûtî" (eser adı yok) + "Buhârî yüzlerce rivayet".
- **SoundExtensions dağılım iddiası:** "vurgulular azapta kümelenir / nazaller
  rahmetle eşleşir" — ölçülmemiş istatistik olgu gibi → korpus sayımı veya "izlenim".

---

## İLERLEME (2026-09-11)
- ✅ **Politika CLAUDE.md §13.35** olarak sabitlendi (allowlist + nokta-referans + kırık link yasağı).
- ✅ **TIER A tamam** (6 düzeltme + 1 "değişiklik gerekmez"):
  Cousteau atfı kaldırıldı · 8-kapı → Buhârî 3257 · çift-atıf Bâkıllânî→Zemahşerî
  (el-Keşşâf, web-teyitli) · Târık/Naik-pulsar cümlesi kaldırıldı · İblis 7:11
  "istisna, melek denmez" · yeminler 25+→47 (veri+methodology tutarlı). ibn-kayyim:
  doğrulama mevcut metni destekledi, DEĞİŞMEDİ.
- ✅ **TIER B tamam:** tefsir-ihtilaf 33 pozisyona `refTr/refEn/refUrl` (eser+âyet
  + quran.com linki) · rozet "Doğrulandı"→"Kaynakta" · künye satırı tıklanabilir ·
  3 alıntı spot-doğrulandı (Razi 24:35, Zemahşerî 2:26 ×2 — hepsi birebir).
- ✅ **Tier A+B push edildi** (feat-mukattaa-sources dalına, main'e DEĞİL) — commit f69d3040.
- ✅ **TIER C (belirgin overclaim'ler) tamam:**
  · WowFacts: "Allah 2699×" corpus.quran.com kaynaklı · Meryem "34 ayette"→"34 kez (32 ayette)"
    · Fâtiha "tek metin/only text" mutlak ifade yumuşatıldı (~2 milyar Müslüman çerçevesi)
  · Kıraat "452 = 113×4 farklı okuma" uydurma artefakt → "113 sûre besmeleyle açılır" gerçeği
  · ZamanBoyutları "İbn Kesîr/Râzî/Elmalılı icmâıdır" → "ortak kanaati" (icmâ yanlış kullanımı)
  · ZamanBoyutları Gazâlî verbatim alıntı (doğrulanamadı) → "İhyâ vurgusuyla uyumlu okuyuş"
  · KuranYeminleri Şafiî/Asr sözü ×2 → kaynak eklendi (Beyhakî, Şuabü'l-Îmân — teyitli)
  · Münâfık küçük-şirk hadisi → râvi (Mahmûd b. Lebîd) + "hasen/sahih" derece nüansı
  · ProphetAtlas taşlar → Hûd 11:83 "müsevveme" dayanağı + EN hedge
  · SebebiNuzul timeline → "klasik siyer kaynağı (İbn İshâk/Hişâm, Taberî)" framing notu
  · KissaAtlas Divine Speech: DEĞİŞMEDİ — zaten örnek (birincil akademik makale künyeleri var)
  · Zaten hedge'li bırakılanlar: 124.000 peygamber ("rivayet edilir"), İbrahim "10+",
    Kıraat "~%95" ("~"), MukattaaViews mutesabih ("nakledilir"+Kurtubî loci).
- ⏳ Push (Tier C): build sonrası feature dalına.
- ⏳ Push→main: §17.4 kullanıcı onayı + §13.24 bilimsel/doga hakem-notu bekliyor.

## Aksiyon planı (allowlist politikasıyla)
1. ✅ **Tier A (doğruluk)** — tamam (yukarı).
2. ✅ **Tier B** — tamam (yukarı).
3. ✅ **Tier C** — tamam (yukarı).
4. 🔄 **Tier D (deterministik linkler + sebeb-i-nuzul doğrulama)** — başladı:
   - ✅ `surahNames.js`'e `quranComUrl` + `sunnahComUrl` helper (Tier-1 deterministik).
   - ✅ **sebeb-i-nuzul.json 30 girdi doğrulandı** (3 paralel agent + bağımsız WebSearch
     ile 9 numara çapraz-teyit): 17 girdiye doğrulanmış hadis loci + sunnah.com linki
     eklendi (Buhârî 3/45/334/4141/4486/4577/4721/4747/4770/4791/4900/4922/4950/4833/7420,
     Müslim 2770, Ebû Dâvûd 2214, Tirmizî 3331). 13 girdi tafsir-only (Vâhidî/Süyûtî) →
     doğru şekilde LİNKSİZ. Da'îf + çift-kullanımlı Tirmizî 3049 (item 6&19) ATLANDI.
   - ✅ SebebiNuzul.jsx: âyet çipleri → quran.com linki; kaynak → sunnah.com hadis linki.
   - ⏳ Kalan Tier D: diğer bileşenlerdeki âyet/hadis refleri (aynı helper ile yayılabilir),
     SourcesCitation panelleri, MukattaaViews âlim listeleri — süregelen, batch batch.
4. **Tier D** — sistematik loci yükseltmesi: âyet→quran.com, hadis→sunnah.com,
   dil→corpus.quran.com, bilim→DOI (Tier-1 otomatik-güvenli link); tefsir
   kitapları→altafsir/shamela (Tier-2 teyitli link). Büyük/süregelen B1 işi.
5. **Politika:** allowlist + "kırık link yayına girmez" kuralını CLAUDE.md'ye
   madde olarak sabitle; sitede kısa "kaynak yöntemi" notu.
6. **Künye yapısı:** `{ etiket, url, teyitli }` → tıklanabilir künye + dış-link
   ikonu. Mukattaa pilot, sonra yay.
