# 🔍 SAYFA DENETİM KONTROL LİSTESİ

> **Kapsam:** 74 route (`next/src/app/[locale]/**/page.js`).
> **Kaynak:** `11c61b2..8c3b127` arası **37 commit**te gerçekten bulunmuş
> hataların sınıflandırılması. Bu liste teorik değil — her madde en az bir kez
> sitede **canlı olarak** yaşanmış bir hatadan türetildi ve o hatanın
> referansı yanında yazıyor.
> **Amaç:** Anasayfada bulunan hataların kardeşlerini diğer 73 sayfada
> yakalamak.

---

## 0. ÖNCE OKU — DENETİM DİSİPLİNİ

Bu yedi kural, aşağıdaki 120 maddeden daha önemlidir. Bu turda en çok
zaman kaybettiren şeyler bunların ihlaliydi.

### 0.1 · Ölçmeden iddia etme
Bu turda **"hepsi token'dan geliyor, ihlal yok"** dedim; ölçünce **184 token
dışı renk** çıktı. Bir başka sefer *"/arac/tum-araclar yok"* dedim; vardı ve
21 araç gösteriyordu — kullanıcının kararını değiştirebilecek bir yanlıştı.
**Kural:** her bulgu bir sayı, bir seçici veya bir ekran görüntüsüyle gelir.

### 0.2 · Değişiklikten ÖNCE gerçek temel çizgiyi al
`git stash` ile gerçek "önce" değerini ölç, sonra değişikliği uygula. Bu turda
`color-before` klasörünü bir kez **değişiklikten sonra** yakaladım ve gerçek
"önce" görüntüsünü kaybettim. Bir daha olmasın: **önce ölç, sonra dokun.**

### 0.3 · DOM yetmez, RENDER'a bak
`\"bilimsel mucize\"` diye ekranda **ters bölüler** görünüyordu. Baseline
testi yeşildi çünkü yalnız âyet/başlık/bağlantı tutuyordu. Hata **ekran
görüntüsüne bakınca** fark edildi. Her sayfa denetiminde en az bir tam
ekran görüntüsü **gözle** incelenir.

### 0.4 · "Görünüyor" ile "tıklanabilir" aynı şey değil
Chip rafı 1024px'te **görünüyordu** ama üst yarısı navbarın altındaydı.
`getBoundingClientRect` bunu göstermez. Kanıt aracı:
```js
document.elementFromPoint(x, y)   // gerçekte tıklanan öge kim?
```

### 0.4b · Dev sunucusu YALAN SÖYLEYEBİLİR — iki tuzak ölçüldü
**(a) Bayat CSS chunk.** `globals.css`'e eklenen kural sayfada uygulanmıyordu:
`getComputedStyle` `display: block` diyordu, `grid` değil. Kural doğruydu —
**üretim build'i içeriyordu**, dev sunucusunun `.next/dev` önbelleği içermiyordu.
Sunucuyu yeniden başlatmak yetmedi; `.next/dev` silinince düzeldi.
```bash
# Servis edilen CSS gerçekten kuralı içeriyor mu?
node -e "const h=await (await fetch('http://localhost:3000/tr')).text();
const l=[...h.matchAll(/href=\"([^\"]*\.css[^\"]*)\"/g)].map(m=>m[1])[0];
console.log((await (await fetch('http://localhost:3000'+l)).text()).includes('SENIN-SINIFIN'))" --input-type=module
```
**(b) `.env` yüklenmemiş sunucu.** Sunucuyu `set -a && . .env` olmadan
başlatınca 6 concierge testi kırmızıya döndü; sebep `DEEPINFRA_API_KEY not set`.
Kod değişikliği sanılabilirdi. Doğru başlatma:
```bash
set -a && . /Users/serdar/Developer/01_qurancodex/.env && set +a && npm run dev
```

### 0.5 · Kırmızı testin sebebini bul, değişikliğini suçlama (ve tersi)
`concierge.spec.js:240` kırmızıydı. Suçlamadan önce API'ye istek atıp
`meta.budget = {"reason":"ip"}` ve `X-Degraded: 1` görüldü → sebep benim
değişikliğim değil, kendi test koşularımın IP kotasını tüketmesiydi.
**Ama tersi de geçerli:** bu turda `SEMANTIC is not defined` ile sayfa 500
döndü ve sebep bendim.

### 0.6 · İçerik koruyan refactor'da git geçmişiyle karşılaştır
14 kart dosyası silinmeden önce metinleri veri dosyasına taşındı. Silme
sonrası **210 metin alanı** `git show 1a1cd26:...` ile tek tek karşılaştırıldı
→ 0 fark. Tahmin değil, kanıt.

### 0.7 · Emniyet ağını değişiklikten ÖNCE kur
`homepage-link-inventory` ve `homepage-card-text` baseline'ları taşımadan
önce alındı. Marka adı değişikliğinde envanter testi kaybı **yakaladı** ve
kasıtlı olduğu doğrulanıp temel çizgi güncellendi. Koruma çalıştı.

---

## 1. HER SAYFA İÇİN STANDART ÖLÇÜM TURU

Aşağıdaki tek script her sayfa için çalıştırılır. `PAGE` değişkenini değiştir.

```js
// tests/_page-audit.spec.js  (şablon)
const PAGE = '/arac/mukattaa';          // ← denetlenen route
const VIEWPORTS = [
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'laptop-1024',  width: 1024, height: 800 },   // ← EN ÇOK HATA BURADA
  { name: 'mobile-390',   width:  390, height: 844 },
];
```

**1024px'i atlama.** Bu turda bulunan iki ciddi hatanın ikisi de yalnız
1024px'te vardı (navbar 31px örtüşme, SixGates 1.334px yükseklik).

Her viewport × her dil (`/tr`, `/en`) = **6 koşu**. Toplanacaklar:

| Ölçüm | Eşik / beklenti |
|---|---|
| `document.scrollHeight` | mobilde < 20.000px hedef; aşıyorsa gerekçe |
| `scrollWidth > clientWidth` | **yatay kaydırma = 0 tolerans** |
| console `error` sayısı | **0** |
| `pageerror` | **0** |
| `h1` sayısı | **tam 1** |
| `h2`/`h3` ağacı | seviye atlaması yok, h2 sayısı içerik hiyerarşisine uygun |
| Etiketsiz `<button>` | 0 (`aria-label` veya metin) |
| Kırık iç bağlantı | 0 |
| Tam sayfa ekran görüntüsü | **gözle incelenir** |

---

## 2. HATA SINIFLARI — HER BİRİ SİTEDE GERÇEKTEN YAŞANDI

### A · ÖLÜ KOD: hiçbir zaman eşleşmemiş seçici / dinleyicisi olmayan olay

| Yaşanan | Nerede | Nasıl bulundu |
|---|---|---|
| Hover efekti **hiç çalışmamış** — CSS `div[style*="border-radius: 20px"]` arıyordu, 14 kartın 14'ü de `12px` kullanıyordu **ve** DOM derinliği yanlıştı | `globals.css` | Kartların gerçek `borderRadius` değeri grep'lendi |
| `ÖNE ÇIKAN` rozeti **iki kez** basılıyordu (CSS `::before` + inline bileşen), aynı koordinatta üst üste | `globals.css` + `FeaturedWrap` | EN ekran görüntüsünde Türkçe metin sızıyordu |
| 23 araç tıklaması **ölü** — `dispatchEvent` ediyordu, dinleyici Vite döneminde kalmıştı | `ToolsBrowser.jsx` | Tıklandı, URL değişmedi, hata da vermedi |

**Diğer sayfalarda ara:**
```bash
# 1) Inline stile göre eşleşen CSS seçicileri — kırılgan, sessizce ölür
grep -n 'style\*=' src/app/globals.css

# 2) Dinleyicisi olmayan CustomEvent
grep -rn "dispatchEvent(new CustomEvent" src --include='*.jsx' \
  | sed "s/.*CustomEvent(\['\"]\([a-zA-Z:-]*\).*/\1/" | sort -u \
  | while read e; do n=$(grep -rl "addEventListener('$e'" src | wc -l); echo "$e -> $n dinleyici"; done

# 3) CSS ::before/::after içinde METİN (i18n'e girmez!)
grep -n "content: *'[^']\{3,\}'" src/app/globals.css
```
- [ ] Her `style*=` seçicisi gerçekten eşleşiyor mu? (DevTools'ta eşleşen öge sayısı)
- [ ] Her `CustomEvent` için en az 1 dinleyici var mı?
- [ ] CSS `content:` içinde çevrilmesi gereken metin var mı?

---

### B · SABİT SAYI ≠ ÖLÇÜLEN GERÇEK

Bu turun **en verimli** hata sınıfı. Dört ayrı örnek çıktı.

| Yaşanan | Sabit | Gerçek | Sonuç |
|---|---|---|---|
| Chip rafı navbar altında | `NAVBAR_HEIGHT = 62` | 69 / **93** | 1024'te chip'ler tıklanamıyor |
| `/hakkinda` üst dolgu | `padding: 64` | navbar altı 82 | 18px örtüşme |
| `Gate` mobil dalı | `isMobile={false}` **sabit** | — | mobil kod hiç çalışmamış |
| Kart yüksekliği | `minHeight: 320px` | — | kısaltma kazancını yutuyordu |
| Tefekkür sayacı | `PLANNED_TOTAL = 44` | 52 makale | "0 planlanan" |

**Diğer sayfalarda ara:**
```bash
# Layout'a karışan sabit sayılar
grep -rn "HEIGHT *= *[0-9]\|OFFSET *= *[0-9]\|_TOTAL *= *[0-9]\|TOP *= *[0-9]" src --include='*.jsx'
# Sabit boolean prop'lar (mobil/desktop dalları öldürür)
grep -rn "isMobile={false}\|isMobile={true}\|isDesktop={false}" src --include='*.jsx'
# minHeight — kısaltma çalışmalarını sessizce iptal eder
grep -rn "minHeight" src --include='*.jsx'
```
Ölçüm reçetesi (her sabit için):
```js
// Navbar ile herhangi bir sabit öge arasındaki gerçek ilişki
const nav  = document.querySelector('nav[aria-label="Main navigation"]');
const el   = document.querySelector(SEÇİCİ);
console.log('örtüşme =', nav.getBoundingClientRect().bottom - el.getBoundingClientRect().top);
```
- [ ] Sayfada navbar altına konumlanan sabit öge var mı? Örtüşme **0** mı?
- [ ] Ölçüm 390 / 768 / **1024** / 1279 / 1440'ta ayrı ayrı yapıldı mı?
- [ ] Navbar'ın kompaktlaşma **geçişi bittikten sonra** da ölçüldü mü?
      (⚠ yalnız `scroll` olayında ölçmek yanlış değer verdi — 15px boşluk)
- [ ] Sayaç/istatistik gösteren sabit var mı? Gerçek veriyle eşleşiyor mu?

---

### C · VERİ SÜRÜKLENMESİ — aynı gerçeğin birden çok kopyası

| Yaşanan | Kopya sayısı |
|---|---|
| Araç kataloğu | **4 ayrı yer**, hiçbiri tam (21 / 31 / 43 / gerçek 56) |
| `_index.json` ↔ makale dosyaları | **75 çelişki** |
| CLAUDE.md §4 palet tablosu ↔ `tokens.js` | tablo 10 renk, kodda 100 token |
| Tefekkür kategori renkleri | `_index.json` + `TefekkurHighlight.jsx` |

**Diğer sayfalarda ara:**
- [ ] Bu sayfanın verisi kaç yerde tanımlı? Tek kaynak var mı?
- [ ] JSON ↔ bileşen sabitleri karşılaştırıldı mı? (id, sayı, etiket, renk)
- [ ] Sayfadaki her **sayı** (X makale, Y araç, Z ayet) canlı veriden mi geliyor?
```bash
# Aynı id listesinin iki yerde tanımlanması
grep -rn "id: '" src/data src/components | awk -F"id: '" '{print $2}' | cut -d"'" -f1 | sort | uniq -d
```

---

### D · KAÇIŞ / MARKDOWN / KODLAMA

| Yaşanan | Belirti |
|---|---|
| `\"` iki kez kaçırıldı | ekranda `\"bilimsel mucize\"` — **ters bölüler görünüyordu** |
| `**kalın**` render edilmiyordu | **4 ayrı yerde**: indeks kartı özeti, `contrastDuo` başlığı ve köprüsü, `criticalNote` başlığı, metadata |
| Arapça hafızadan yazılmış | §13.15 ihlali |

**Diğer sayfalarda ara:**
```bash
# Ekrana sızabilecek ters bölü
grep -rn '\\\\"' src/data src/i18n public/tefekkur 2>/dev/null | head
# Render edilmeden basılan markdown
grep -rn '\*\*' src/i18n/*.json public/tefekkur/_index.json | head
```
- [ ] Sayfada `**` veya `\` **görünüyor** mu? (ekran görüntüsünde ara, DOM'da değil)
- [ ] Markdown taşıyan her alan `renderInlineMarkdown`'dan geçiyor mu?
- [ ] Metadata/JSON-LD'ye giden metin `stripMarkdown` ile temizleniyor mu?
- [ ] Arapça metin `public/verse-graph-bgem3.json`'dan mı geliyor? (§13.15)
- [ ] U+06E1 / U+0671 / U+06CC gibi Uthmani-özel karakter sızmış mı?

---

### E · DİL SIZINTISI (i18n)

| Yaşanan |
|---|
| İngilizce `/sor` sayfasında **Türkçe** hata metni: "Bu sorguya yakın içerik bulunamadı." |
| CSS `::before { content: 'ÖNE ÇIKAN' }` — İngilizce sayfada da Türkçe |
| `Quran Codex` / `QuranCodex` karışık — 6 tutarsız kullanım |
| `Kuran` ↔ `Kur'an` |
| `sure` ↔ `sûre` (şapka) |

**Diğer sayfalarda ara:**
```bash
# EN sayfasında Türkçe'ye özgü harfler — en hızlı sızıntı dedektörü
# (Playwright ile /en/<route> açıp body innerText üzerinde çalıştır)
/[çğışöüĞİŞÖÜÇ]/.test(text)

grep -rn "Tanrı" src/components src/sections src/i18n/tr.json      # "Allah" olmalı
grep -rn "Quran Codex" src public                                   # "QuranCodex" olmalı
grep -rn "\bKuran\b" src public                                     # "Kur'an" olmalı
grep -rn "\bsure\b\|\bSure\b" src/i18n/tr.json                       # "sûre" olmalı

# GPT-5.4 eklemesi: Türkçe karakter taraması ASCII İngilizce sızıntıları
# KAÇIRIR. Tamamlayıcı kontrol — i18n dışı sabit dize envanteri:
grep -R "\"[A-Za-z][^\"]\{6,\}\"" src/components src/sections --include='*.jsx' \
  | grep -v "className\|aria-\|import\|href\|role=\|type=\|rel=" | head -40
```
- [ ] `/en/<route>` tam metni tarandı, Türkçe karakter içeren dize var mı?
- [ ] `/tr/<route>` içinde çevrilmemiş İngilizce dize var mı?
- [ ] Hata/boş durum/yükleniyor metinleri **her iki dilde** doğru mu?
      (⚠ hata durumları çoğu zaman i18n'e bağlanmayı unutuyor)
- [ ] `aria-label` ve `title` da çevrilmiş mi?
- [ ] Sayı biçimi doğru mu? (`toLocaleString('tr-TR')` → 2.699)
- [ ] Şapka kuralı: `sûre` her zaman · `A'lâ` şapkalı · **`Alak` şapkasız**

---

### F · REACT / NEXT DOĞRULUĞU

| Yaşanan | Sonuç |
|---|---|
| `useMemo` erken `return`'ün ALTINDA | "Rendered more hooks…" → sayfa **hiç açılmadı** |
| Refactor sonrası eksik import (`Link`, `SEMANTIC`) | **500** |
| JSX içinde `//` yorum, attribute'lar arasında | parse hatası |
| 14 bileşen gereksiz `'use client'` | 14 hydration adası |

**Diğer sayfalarda ara:**
```bash
# Erken return'den SONRA hook — Rules of Hooks ihlali
grep -n "if (!.*) return" -A 30 src/components/<DOSYA>.jsx | grep "use[A-Z]"
# Gereksiz 'use client' — hook/olay yoksa sunucu bileşeni olabilir
for f in src/components/*.jsx; do
  head -1 "$f" | grep -q "use client" || continue
  grep -q "use[A-Z]\|onClick\|onMouse\|window\." "$f" || echo "GEREKSİZ CLIENT: $f"
done
```
- [ ] Tüm hook'lar her `return`'den **önce** mi?
- [ ] Sayfa gerçekten 200 dönüyor mu? (`.next/dev/logs/next-development.log` oku)
- [ ] `'use client'` gerçekten gerekli mi?
- [ ] `.map()` içinde `key` var mı?
- [ ] Build **ve** dev sunucusu, ikisi de temiz mi? (biri geçip öteki kırılabilir)

---

### G · GEZİNME ÇIKMAZLARI

| Yaşanan |
|---|
| Kapat butonu → arkada **boş sayfa** (referrer yoktu) |
| `/arac/tum-araclar`'a **hiçbir yerden giriş yoktu** |
| "Metodoloji & Kaynaklar" diyordu, yalnız `/hakkinda`'ya gidiyordu; `/kaynakca`'ya geçiş yoktu |
| `/hakkinda` ve `/kaynakca`'da "← ANASAYFA" yoktu — diğer tüm sayfalarda vardı |

**Her sayfa için:**
- [ ] Bu sayfaya **nereden** girilir? En az bir keşfedilebilir yol var mı?
- [ ] Bu sayfadan **nasıl** çıkılır? (navbar dışında)
- [ ] **Site bu soruyu daha önce cevaplamış mı?** Araç sayfalarının hepsinde
      "← ANASAYFA" var. Bu sayfa o karara uyuyor mu?
      *(Evrensel kural değil — TUTARLILIK kontrolü. GPT-5.4 haklı olarak "bu bir
      ürün tercihi" dedi; ama tercih zaten verilmişken iki sayfanın dışarıda
      kalması hatadır.)*
- [ ] Kapat/geri butonu geçmiş yoksa ne yapıyor? (boş sayfa bırakmamalı)
- [ ] Başlıkta geçen her kavramın hedefi var mı? ("X & Y" diyorsa Y'ye de gidilmeli)
- [ ] Kardeş sayfalar karşılıklı bağlı mı?
- [ ] Sayfadaki **her** bağlantı 200 mü? (envanter testi)

---

### H · GÖRSEL / DÜZEN

| Yaşanan |
|---|
| `auto-fit` → 1440px'de **3+1 asimetrisi** |
| 19 düz `<h2>` — hiçbiri diğerinden önemli görünmüyordu |
| 14 kart %9 fark bandında — ritim yok |
| İki altın + iki mor kategori rengi — ayırt edilemiyordu |
| Mobil sayfa 23.704px (~28 ekran) |

- [ ] `repeat(auto-fit, ...)` var mı? Öge sayısıyla sütun sayısı **1440px'te** ne veriyor?
- [ ] Izgaradaki kartların CTA'ları hizalı mı? (`align-items: stretch` + `margin-top: auto`)
- [ ] Aynı ölçekte kaç öge var? Hiyerarşi okunuyor mu?
- [ ] Yan yana duran renkler ayırt ediliyor mu? **Ekran görüntüsüne bak**, hex'e değil
- [ ] Renk **tek sinyal** mi? (etiket/ikon desteği olmalı — §13.25 md. 8)
- [ ] `prefers-reduced-motion` karşılanıyor mu?
- [ ] JS kapalıyken içerik görünüyor mu? (reveal animasyonu içeriği gizlememeli)

---

### I · RENK SİSTEMİ (§13.1, §13.25)

```bash
node scripts/audit-colors.mjs --list     # taban + en sık token dışı renkler
node scripts/audit-colors.mjs --ci       # taban aşılırsa / §4 saparsa exit 1
```
- [ ] Sayfanın dosyalarında **ham hex** var mı? (yorumlar hariç → hedef 0)
- [ ] `rgba(...)` sayısı? Token'a taşınabilir mi?
- [ ] Kategori rengi `CATEGORY`'den mi geliyor?
- [ ] Aynı ekranda **yakın-tekrar** renk çifti var mı? (iki yeşil, iki mor, iki altın)
- [ ] Ayet rengi `scriptureText`, UI aksanı `accentPrimary` — karışmış mı?
- [ ] ⚠ **Veri görselleştirme ayrı bir mesele.** Graf/atlas sayfalarında çok
      renklilik doğrudur; oradaki palet UI paletiyle aynı kurala tabi olmamalı.
      Karar: bkz. `todo_agu13_2026.md` → "Veri paleti" maddesi.

---

### J · TEST / BASELINE SAĞLIĞI

| Yaşanan |
|---|
| `concierge.spec.js:112` sayfada **hiç olmayan** metni bekliyordu |
| `concierge.spec.js:240` degrade moda dayanıksız — kota dolunca kırmızı |
| `homepage-card-text` baseline'ı gövde metnini tutmuyordu → ters bölü hatası **kaçtı** |

- [ ] Bu sayfanın testi var mı? Yoksa önce **baseline** kur
- [ ] Testin beklediği metin sayfada **gerçekten** var mı?
      `grep -rn "<beklenen metin>" src/` → 0 dosya ise test bayat
- [ ] Test dış servise bağlıysa degrade/hata durumunda ne yapıyor?
- [ ] Baseline **yeterince geniş** mi? (bağlantı + başlık + **gövde metni**)

---

### K · İÇERİK / EDİTORYAL KURALLAR

- [ ] **§13.24** — tasdikin öznesi bilim/tarih olamaz.
      Yasak kalıp: *"Bilim … doğrular / confirms / proves"*, *"Tarih … eğilir"*
- [ ] **§13.24 muafiyeti** — tefekkür makaleleri yazarın kendi görüşü, GPT
      denetimine sokulmaz
- [ ] Doğrulanamaz mutlak iddia var mı? (`%N`, "tek", "ilk", "hiçbir", "kesin",
      "kanıt", "mucize")
- [ ] Kaynak gösterimi doğru mu? Platform adı `canonicalUrl`'den mi türüyor?
      (Medium ↔ Substack karışıklığı yaşandı)
- [ ] Sayı iddiaları canlı veriyle uyuşuyor mu?

---

### L · HYDRATION UYUŞMAZLIĞI (SSR/SSG ↔ istemci)
> **Kaynak: GPT-5.4 hakem turu.** Bizim listede yoktu — ve bu sitede risk yüksek:
> iki dil + `toLocaleString` + `Intl` + ağır görselleştirme.

Bu turda yaşadığımız hydration hatası "hook sırası" tipindeydi (`useMemo` erken
`return`'ün altında → sayfa hiç açılmadı). GPT'nin işaret ettiği **metin/sayı
uyuşmazlığı** tipi ise hiç aranmadı.

```bash
grep -rn "Math.random\|Date.now()\|new Date()\|Intl\.\|toLocaleString\|toLocaleDate" src --include='*.jsx' --include='*.js'
```
```js
page.on('console', m => { if (/Hydration|did not match/i.test(m.text())) console.log(m.text()); });
const before = await page.locator('main').innerText();
await page.waitForTimeout(1500);
const after = await page.locator('main').innerText();
console.log(before === after ? 'kararlı' : 'DEĞİŞTİ');
```
- [ ] Sunucu HTML'i ile hydrate sonrası DOM anlamlı biçimde değişiyor mu?
- [ ] Console'da `Hydration` uyarısı var mı?
- [ ] Sayı/tarih biçimi sunucu ile istemcide aynı mı? (`toLocaleString('tr-TR')`
      sunucu ICU'su ile tarayıcınınki farklı olabilir)
- [ ] ⚠ **`npm run build && npm run start` ile test et** — dev sunucusu bazı
      uyuşmazlıkları maskeliyor

---

### M · DİNAMİK ROTALARDA LOCALE-AWARE 404
> **Kaynak: GPT-5.4.** Hiç aranmadı. Sitede 5 dinamik rota var:
> `/tefekkur/[slug]` · `/atlas/peygamber/[id]` · `/oku/[surah]` ·
> `/ayet/[surah]/[ayah]` · `/api/meal/[author]/[surah]`

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/tr/tefekkur/olmayan-slug
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/en/atlas/peygamber/9999
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/tr/oku/115
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/tr/ayet/2/300
```
- [ ] Olmayan slug/id gerçekten **404** mü? (200 + boş içerik **hata**)
- [ ] Hata sayfası **doğru dilde** mi?
- [ ] `notFound()` çağrılıyor mu, yoksa sessizce boş mu render ediliyor?
- [ ] Sınır değerler: sûre 0, sûre 115, âyet 0, negatif sayı, çok uzun string

---

### N · CANONICAL / HREFLANG / ALTERNATES
> **Kaynak: GPT-5.4.** İki dilli sitede bu SEO'dan fazlası — kullanıcı yanlış
> dil sayfasına düşüyor ve o URL'yi paylaşıyor.

```js
await page.locator('head link[rel="canonical"], head link[rel="alternate"]')
  .evaluateAll(els => els.map(e => ({ rel: e.rel, href: e.href, lang: e.hreflang })));
```
- [ ] `rel="canonical"` **kendi locale'ine** mi işaret ediyor?
- [ ] `hreflang="tr"` ve `hreflang="en"` karşılıklı eşlenmiş mi?
- [ ] Dinamik sayfalarda slug **iki dilde de aynı mı**? (tefekkür slug'ları ortak)
- [ ] `x-default` var mı?
- [ ] OG/Twitter görselleri doğru dilde mi?

---

### O · BIDI — Arapça/Latin karışık satırlar
> **Kaynak: GPT-5.4.** Bizde `dir`/`lang` kontrolü vardı ama **karışık satır**
> riski yoktu. Bu sitenin en özel riski.

- [ ] `<html lang>` locale'e göre doğru mu?
- [ ] Arapça metnin **içinde** sayı/parantez/alıntı var mı? Sıralama bozuluyor mu?
      (âyet numarası, sûre adı + numara, `(2:255)`, tırnaklı Arapça)
- [ ] Latin metnin **içinde** Arapça kelime → `<bdi>` gerekiyor mu?
- [ ] Kopyala-yapıştır doğru sırada mı geliyor?
- [ ] ⚠ **Bu madde gözle bakılmadan kapatılamaz** — DOM doğru görünürken
      ekranda ters çıkabilir

---

### P · KLAVYE ODAĞI · FOCUS TRAP · SKIP LINK
> **Kaynak: GPT-5.4.** Bizde "tıklanabilir mi" vardı, "klavyeyle erişilebilir mi"
> yoktu. `globals.css`'te `.skip-link` mevcut ama **hiç test edilmedi.**

```js
await page.keyboard.press('Tab');
console.log(await page.evaluate(() => document.activeElement?.outerHTML.slice(0, 120)));
```
- [ ] İlk `Tab` "İçeriğe geç" bağlantısını getiriyor mu? Görünür oluyor mu?
- [ ] Overlay/mega-menü/çekmece açılınca **focus trap** çalışıyor mu?
- [ ] Kapanınca odak **tetikleyen ögeye** dönüyor mu?
- [ ] `Escape` her overlay'de kapatıyor mu?
- [ ] Odak halkası her etkileşimli ögede görünür mü? (`:focus-visible`)
- [ ] Tab sırası görsel sırayla aynı mı?

---

### R · URL DURUMU · GERİ/İLERİ
> **Kaynak: GPT-5.4.** Hiç aranmadı. Atlas filtreleri, graf etkileşimleri ve
> `/sor` sorguları için kritik.

- [ ] Filtre/sekme/arama seçimi URL'ye yazılıyor mu?
- [ ] Tarayıcı **geri** tuşu önceki duruma dönüyor mu?
- [ ] URL'yi kopyalayıp yeni sekmede açınca **aynı durum** geliyor mu?
- [ ] Dil değiştirince `searchParams` korunuyor mu? (⚠ `LanguageContext` bunu
      bilerek yapıyor — kırılmadığını doğrula)

---

### S · AĞ HATASI · API BAŞARISIZLIĞI
> **Kaynak: GPT-5.4.** Hiç aranmadı. "Kullanıcı cevap yok görür ama sistem
> başarı sanır" senaryosu.

```js
await page.route('**/api/**', route => route.abort());       // ağı kes
page.on('response', r => { if (r.url().includes('/api/') && r.status() >= 400) console.log(r.status(), r.url()); });
```
- [ ] API başarısız olunca kullanıcı **ne görüyor?** (boş mu, hata mı, sonsuz spinner mı)
- [ ] Hata mesajı **iki dilde** doğru mu? (⚠ bilinen açık: `/sor`'da EN sayfada
      Türkçe "Bu sorguya yakın içerik bulunamadı.")
- [ ] Yeniden dene seçeneği var mı?
- [ ] Yavaş ağda (`--throttle`) iskelet/yükleniyor durumu var mı?

---

### T · FONT GERÇEKTEN YÜKLENİYOR MU
> **Kaynak: GPT-5.4.** §13.2 font **zincirini** tanımlıyor ama zincirin ilk
> halkasının yüklendiği **hiç doğrulanmadı** — sessizce fallback'e düşüyor olabilir.

```js
page.on('response', r => { if (/\.(woff2?|ttf)$/.test(r.url())) console.log(r.status(), r.url()); });
await page.evaluate(() => document.fonts.ready.then(() =>
  [...document.fonts].map(f => `${f.family} ${f.status}`)));
```
- [ ] `KFGQPC` / `ShaykhHamdullah` / `Amiri Quran` **200** dönüyor mu?
- [ ] `document.fonts` içinde `loaded` mı, yoksa hiç yok mu?
- [ ] Fallback'e düşerse satır yüksekliği ve mushaf görünümü bozuluyor mu?

---

### U · RAG İNDEKS TAZELİĞİ
> **Kaynak: GPT-5.4.** Bizde "corpus'a giriyor mu" vardı; **bayat/ölü kayıt**
> kontrolü yoktu.

```bash
find "src/app/[locale]" -name page.js | sed 's|src/app/\[locale\]||;s|/page.js||' | sort > /tmp/routes.txt
node -e "import('./src/data/toolCatalog.js').then(m=>m.TOOL_CATALOG.forEach(t=>console.log(t.route)))" | sort > /tmp/rag.txt
comm -13 /tmp/rag.txt /tmp/routes.txt   # rotada var, corpus'ta yok
comm -23 /tmp/rag.txt /tmp/routes.txt   # corpus'ta var, ROTADA YOK → 404'e götürür
```
- [ ] Corpus'ta olup **artık var olmayan** rota var mı? (arama 404'e götürür)
- [ ] Yeni/taşınmış içerik indekste güncel mi?
- [ ] Embedding dosyası Git LFS pointer'ı mı? (`version https://git-lfs...`)

---

### V · GEREKSİZ PREFETCH
> **Kaynak: GPT-5.4.**

```js
page.on('request', r => { if (['script','fetch'].includes(r.resourceType())) console.log(r.url()); });
await page.goto('/tr'); await page.waitForTimeout(3000);
```
- [ ] Anasayfa, ağır atlas/graf route'larını tıklanmadan prefetch ediyor mu?
- [ ] Mobil veri ölçüldü mü? (ilk 3sn'de kaç KB)

---

### Y · GÖRSEL SEMANTİĞİ · TABLO/LİSTE
> **Kaynak: GPT-5.4.**
- [ ] Anlam taşıyan `img`'de `alt` var mı, **dekoratif olanda `alt=""`** mi?
      (bizim kontrol yalnız "alt var mı" diyordu — ikisi farklı hata)
- [ ] Tablo gibi görünen şey gerçekten `<table>` mi, div yığını mı?
- [ ] `await page.accessibility.snapshot()` ile ağaç anlamlı mı?

---

## 2.5 · GPT-5.4'ÜN İTİRAZLARI — hangisini kabul ettim

| İtiraz | Karar |
|---|---|
| *"`/en`'de Türkçe karakter aramak zayıf sinyal — ASCII İngilizce sızıntılar kaçar"* | **Kabul, ama madde kalıyor.** Bu sinyal gerçekten "TEFEKKÜR"ü yakaladı. Tamamlayıcı olarak **E'ye eklendi:** i18n dışı sabit dize envanteri (`grep -R "\"[A-Za-z][^\"]*\"" src/components --include='*.jsx'`). |
| *"`<20.000px` eşiği keyfî, tefekkür/atlas'ta yanlış alarm üretir"* | **Kabul.** Eşik anasayfa için konmuştu, genel kural değil. Yeniden çerçevelendi → aşağıya bak. |
| *"Başlık seviyesi atlamama kuralı fazla katı"* | **Kısmen kabul.** Katı kırmızı yerine `page.accessibility.snapshot()` ile doğrulama önerisi eklendi. Ama seviye atlaması gerçek bir okunabilirlik sorunudur, madde kalıyor. |
| *"'← ANASAYFA her sayfada olmalı' ürün tercihi, hata sınıfı değil"* | **Katılmıyorum.** Genel bir kural olarak doğru — ama bu sitede zaten **verilmiş bir karar** vardı: tüm araç sayfalarında var, iki sayfada yoktu. Bu bir *tutarlılık* kontrolü, evrensel kural değil. Madde yeniden yazıldı: *"Site bu soruyu daha önce cevaplamış mı? Cevabıysa bu sayfa ona uyuyor mu?"* |

**Sayfa uzunluğu maddesinin yeni hâli** (H bölümünün yerine geçer):
- [ ] Sayfanın **ilk anlamlı eylemi** ilk ekranda mı? (uzunluk tek başına hata değil)
- [ ] Uzun sayfada atlama aracı var mı? (raf/ToC/çapa)
- [ ] Uzunluk **artıyor mu**? (regresyon; mutlak eşik değil)

---

## 3. SAYFA TİPİNE GÖRE EK KONTROLLER

### 3.1 Araç sayfaları (`/arac/*` — 32 sayfa)
- [ ] `ToolHeader` var mı? "← ANASAYFA" çıkışı çalışıyor mu?
- [ ] `/arac/tum-araclar` kataloğunda listeleniyor mu?
- [ ] `toolCatalog.js` (55 giriş) ve `TOOL_ROUTES` (navbar) ile tutarlı mı?
- [ ] RAG corpus'una giriyor mu? (`npm run embed:corpus`)
- [ ] Anasayfada bir kapısı var mı? (`homeCards` veya `SixGates` chip'i)

### 3.2 Atlas sayfaları (`/atlas/*` — 25 sayfa)
- [ ] Çok renkli veri paleti mi, keyfi renk mi? (ayrımı belgele)
- [ ] Büyük veri kümesi mobilde yatay taşma yapıyor mu?
- [ ] `[id]` dinamik rotalarında olmayan id ne yapıyor? (404 mü, boş mu?)

### 3.3 Graf sayfaları (`/graf/*` — 7 sayfa)
- [ ] Canvas/SVG `prefers-reduced-motion` dinliyor mu?
- [ ] Etkileşim klavyeyle mümkün mü?
- [ ] Renk **tek** ayırt edici sinyal mi?
- [ ] ⚠ P8 kapsamında: `/graf/semantik`, `/graf/diyalog` detaylandırılacak

### 3.4 Tefekkür (`/tefekkur`, `/tefekkur/[slug]` — 52 makale)
- [ ] `_index.json` ↔ makale dosyası alanları uyuşuyor mu?
- [ ] Görsel blok yoğunluğu site ortancasının (11) üstünde mi?
- [ ] Arapça âyet `verse-graph`'ten mi? (§13.15)
- [ ] Kanonik platform adı `canonicalUrl`'den mi türüyor?
- [ ] `tldr`'da **vurgu** var mı? (⚠ 34 makalede yok — mekanik iş değil)
- [ ] RAG corpus'una tüm görsel bloklar giriyor mu? (`tefekkurBlockText`)

### 3.5 Okuma modu (`/oku`, `/oku/[surah]`, `/ayet/...`)
- [ ] Arapça font zinciri: `'ShaykhHamdullah', 'KFGQPC', 'Amiri Quran', serif`
- [ ] Sûre araması alâka sırasına göre mi? (harf-i tarif atılıyor mu?)
- [ ] `dir="rtl"` ögelerinde `aria-label` var mı?

### 3.6 Concierge (`/sor`)
- [ ] Bütçe/kota gerçekten çalışıyor mu? (`meta.budget`, `X-Degraded`)
- [ ] Degrade modda kullanıcı ne görüyor? Metin **iki dilde** doğru mu?
- [ ] Degrade yanıt cache'lenmiyor mu?

---

## 3.7 · ÖNCEDEN BİLİNEN AÇIKLAR (anasayfa todo'sundan taşındı)

> Bunlar diğer sayfalara ait ve **zaten ölçülmüş** açıklar. Denetime bu
> sayfalardan başlarken hazır bulgu olarak elde var.

### Beş sayfa içerik olarak yetersiz — derinleştirilecek

| Sayfa | Rota | Bileşen | Veri |
|---|---|---|---|
| Kitap Kavramı | `/arac/kitap-kavrami` | `KitapKavrami.jsx` — 382 satır | `kitap-kavrami.json` 18 KB |
| Semantik Harita | `/graf/semantik` | `SemanticMap.jsx` — 585 satır | UMAP projeksiyonu |
| Münâsebât Atlası | `/atlas/munasebat` | `MunasebatAtlasi.jsx` — 795 satır | — |
| Diyalog Ağı | `/graf/diyalog` | `DiyalogAgi.jsx` — 1.253 satır | 5 JSON · ~81 KB |
| Sûre DNA | `/graf/karsilastir` | `SurahComparator.jsx` | — |

- [ ] Her biri için önce **içerik envanteri**: şu an ne gösteriyor, ne eksik
- [ ] `KitapKavrami` (382 satır) ve `SemanticMap` (585 satır) en zayıf ikisi — önce onlar
- [ ] Detaylandırma sonrası `TOOL_CATALOG` açıklamalarını güncelle (`/sor` bunları okuyor)

### Adlandırma tutarsızlığı — aynı şey dört adla anılıyor
Menüde **"Sûre DNA"** · rota `/graf/karsilastir` · bileşen `SurahComparator`
· katalogda **"Sûre Karşılaştırıcı"**.
- [ ] Tek ada karar ver, dördünü de hizala
- [ ] Aynı hatayı diğer rotalarda da ara:
```bash
# Katalog adı ile rota adı örtüşmeyenler
node -e "import('./src/data/toolCatalog.js').then(m=>m.TOOL_CATALOG.forEach(t=>{
  const slug=t.route.split('/').pop();
  const norm=(t.titleTr||'').toLowerCase().replace(/[^a-zçğıöşü]/g,'');
  if(!norm.includes(slug.replace(/-/g,'').slice(0,5))) console.log(t.route,'|',t.titleTr);
}))"
```

### `/sor` — test sağlığı ve dil sızıntısı
- [ ] **`concierge.spec.js:240` degrade moduna dayanıksız.** Günün test koşuları
      IP kotasını (50/gün) tüketince kırmızıya dönüyor. Kanıt:
      `meta.budget = {"used":65,"limit":500,"reason":"ip"}` · `X-Degraded: 1`
      Koruma doğru çalışıyor; dayanıksız olan test.
- [ ] **`concierge.spec.js:112` bayat assertion.** Test `tarıyorum|scanning|
      matching|arıyor` bekliyor; bu kelimeler `/sor` kaynağında **hiç yok**.
- [ ] **Degrade/hata metni İngilizce sayfada Türkçe:** başlık "Something went
      wrong", altı **"Bu sorguya yakın içerik bulunamadı."** (bkz. **S** ve **E**)
- [ ] Degrade modda İngilizce anahtar kelime araması **0 sonuç** döndürüyor —
      ayrıca incelenecek

### Site genelinde 184 token dışı renk
Anasayfa temiz, gerisi değil. En sık: `#4a5568` ×34 · `#f87171` ×16 ·
`#60a5fa` ×14 · `#f39c12` ×14 · `#c084fc` ×14 → `node scripts/audit-colors.mjs --list`

⚠ **Bu bir temizlik işi değil, önce karar gerekiyor** — bkz. bölüm **I**'nin
son maddesi ve `todo_agu13_2026.md` → **C2**. Veri paleti (graf/atlas) UI
paletiyle aynı kurala tabi olmamalı.

---

## 4. DENETİM SIRASI (öneri)

Anasayfada bulunan hataların en çok tekrar edeceği yerlerden başla:

1. **`/arac/tum-araclar`, `/hakkinda`, `/kaynakca`** — navbar örtüşmesi ve
   çıkış tutarlılığı bu üçünde zaten bir kez yaşandı, kardeşleri olabilir
2. **`/arac/*` en çok trafik alan 6 tanesi** — `ToolHeader` + katalog tutarlılığı
3. **`/graf/*`** — renk/erişilebilirlik yoğun, P8 zaten burayı işaret ediyor
4. **`/atlas/*`** — en kalabalık grup, veri sürüklenmesi riski yüksek
5. **`/tefekkur/*`** — içerik kuralları (§13.24 muaf, §13.15 geçerli)
6. **`/oku`, `/sor`, `/kutuphanem`** — durum yönetimi ağır sayfalar

---

## 5. HER SAYFA İÇİN RAPOR ŞABLONU

```md
### <route>
Ölçüm: 1440 / 1024 / 390 × tr / en

| Kontrol | Sonuç |
|---|---|
| Yükseklik (mobil) | Npx |
| Yatay kaydırma | var/yok |
| console error | N |
| h1 / h2 / h3 | 1 / N / N |
| Ham hex (yorum hariç) | N |
| Etiketsiz buton | N |
| Kırık bağlantı | N |
| Navbar örtüşmesi | Npx |
| EN'de Türkçe sızıntı | N dize |

**Bulgular** (her biri sayı/seçici/ekran görüntüsü ile)
1. …

**Ekran görüntüsü gözle incelendi:** evet/hayır
```

---

## 6. DENETİM GÜNLÜĞÜ

Taranan sayfalar ve bulunanlar. Her satır `AUDIT_ROUTES=... npx playwright test
tests/page-audit.spec.js` ile tekrarlanabilir.

### Parti 1 — 2026-08-13 · `/arac/tum-araclar` · `/hakkinda` · `/kaynakca`

| Sayfa | Bulgu | Durum |
|---|---|---|
| `/arac/tum-araclar` | **Gezinme `<button>` ile yapılıyordu** — 73 buton / 2 bağlantı. Orta tık, "yeni sekmede aç", URL önizlemesi, bağ grafiği hepsi kayıptı | ✅ `<Link>`e çevrildi → 54 bağlantı / 21 buton |
| `/arac/tum-araclar` | Overlay üst dolgusu sabit `96px`; **1024px'te İNGİLİZCE navbar** (menü uzun, sarıyor) "All Tools" başlığını 21px örtüyordu. **Türkçede görünmüyordu** | ✅ `useNavbarOffset` ile ölçülüyor |
| `/arac/tum-araclar` | 52/62 `<svg>` erişilebilirlik etiketi yok | ✅ `aria-hidden` (32 kaynakta) |
| `/hakkinda`, `/kaynakca` | Üst dolgu `104px` sabit; 1024px'te EN navbar "← ANASAYFA" bağlantısını **30px örtüyordu** | ✅ `useNavbarOffset` |
| `/hakkinda`, `/kaynakca` | EN'de Türkçe karakter | ⚪ **Yanlış pozitif** — özel adlar (Elmalılı Hamdi Yazır, Zemahşerî, Beydâvî). GPT-5.4 bu sinyalin zayıflığını önceden söylemişti |

**Bu partinin dersi:** navbar yüksekliğini sabit sayıyla tahmin etme hatası
sitede **üç ayrı yerde** vardı ve üçü de farklı sabitlerle "düzeltilmişti"
(62 · 96 · 104). Hepsi `src/components/useNavbarOffset.js`'e toplandı.
**Tek dilde test etmek bu hatayı kaçırırdı** — Türkçe navbar dar, İngilizce
navbar 1024px'te sarıyor.

### Sıradaki partiler
- [ ] En çok trafik alan 6 `/arac/*`
- [ ] `/graf/*` (7 sayfa) — renk + erişilebilirlik yoğun
- [ ] `/atlas/*` (25 sayfa) — en kalabalık grup
- [ ] `/tefekkur/*`
- [ ] `/oku`, `/sor`, `/kutuphanem`
