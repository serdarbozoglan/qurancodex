# qc-content-producer Agent — Design Spec

**Tarih:** 2026-04-19
**Durum:** Onaylandı (brainstorm aşaması tamam)
**İlgili kod:** `.claude/agents/qc-content-producer.md` (henüz yazılmadı)

---

## 1. Problem & Motivasyon

QuranCodex (qurancodex.com) 22 section + 44 overlay tool + ~40 JSON veri dosyası barındıran, tefsir/dilbilim/matematik/tarih alanlarında iddialı içerik sunan bir platform. 2026-04-19 tarihli içerik denetimi (qc-content-auditor raporu) 7 kritik, 11 orta, 9 minör sorun tespit etti — çoğunluğu halisinasyon tipinde (kaynaksız istatistik, yuvarlanmış sayı, tartışmalı tefsir iddiasının kesinmiş gibi sunulması).

Mevcut denetim tarafında üç agent var (`qc-content-auditor`, `qc-visual-auditor`, `qc-ux-auditor`) ama **üretim tarafı boş** — kullanıcı yeni içerik eklemek istediğinde elle çalışıyor veya genel amaçlı AI kullanıyor. Bu hem yavaş, hem de denetim tarafının yakaladığı hata tipleri üretim tarafında tekrar tekrar oluşuyor.

**İhtiyaç:** Halisinasyon üretmeyen, klasik tefsir + kelâm geleneğine vakıf, projenin dil ve veri şemalarıyla uyumlu içerik üretebilen özel bir agent.

---

## 2. Amaç (Scope)

`qc-content-producer` agent'ı şunları yapar:

- **Mikro mod:** Mevcut araçlara (WowFacts, Yeminler, KissaAtlas, Retorigi vb.) eklenecek tekil item'lar üretir
- **Makro mod:** Yeni bir section/tool için komple konsept + veri seti + section iskeleti üretir
- Her üretim önce **markdown taslak** olarak çıkar, kullanıcı onayından sonra JSON'a dönüştürülür
- Her iddia kaynaklandırılır; kaynak bulunamıyorsa iddia yazılmaz veya "bu yorum tartışmalıdır" şeklinde hedge edilir
- Arapça ayet metni **asla generate edilmez**; sadece referans verilir, JSON aşamasında `public/verse-graph-bgem3.json`'dan kopyalanır

**Scope dışı:**
- Yeni React section/overlay kodunu yazmak (sadece iskelet/wireframe önerir — kod yazımı kullanıcıya kalır)
- Tasarım/stil kararları (token değeri, renk, font — agent tokens.js'ten referans alır)
- Build/test operasyonları

---

## 3. Workflow

### 3.1 Çağırma

```
Agent(
  subagent_type: "qc-content-producer",
  prompt: "WowFacts'e 3 yeni kart ekle — tema: Kur'an'daki zaman kavramı"
  // veya
  prompt: "Kur'an'da hicret temalı yeni bir section tasarla"
)
```

Kullanıcı modu belirtebilir ("mikro", "makro") veya belirtmezse agent prompt'tan çıkarır / sorar.

### 3.2 Aşama 1 — Konu Başlığı Önerileri

Agent 5–8 konu başlığı önerir. Her başlık için:

| Alan | İçerik |
|---|---|
| `title` | Başlık (TR + EN) |
| `targetTool` | Hangi mevcut araca ekleneceği (mikro) veya yeni tool önerisi (makro) |
| `rationale` | Neden bu başlık site-fit? |
| `sourceLoad` | Tahminî kaynak yoğunluğu: düşük / orta / yüksek |
| `hallucinationRisk` | Spekülatif alana kayma riski: düşük / orta / yüksek |

Kullanıcı bir başlık seçer veya kendi başlığını verir.

### 3.3 Aşama 2 — Markdown Taslak

Agent taslağı `docs/content-drafts/YYYY-MM-DD-<slug>.md` altına yazar. Yapı:

**Mikro mod:**
- Her item için: verseRef (doğrulanmış), titleTr/titleEn, descTr/descEn, depthTr/depthEn (150–250 kelime), sourceTr/sourceEn (her iddia için kaynak), infoTr/infoEn (belirsizlik/uyarı notu), ekolEtiketi

**Makro mod:**
- Section/tool konsepti (1 sayfa): ne gösterir, hangi veri tipini barındırır, hangi görselleştirme önerilir
- Veri şeması (JSON schema taslağı)
- 10–15 örnek item (tam dolu, diğer ~35 item için "benzer kalıp" notu)
- i18n anahtar listesi (navbar, başlık, kategori isimleri)
- Section iskeleti (JSX wireframe — sadece yapı, stil token referanslı)

### 3.4 Aşama 3 — Kullanıcı İncelemesi

Kullanıcı taslağı inceler. Üç karar:
- ✅ **Onayla** → Aşama 4'e geç
- ✏️ **Düzeltme iste** → Agent belirtilen düzeltmeleri yapar, tekrar sunar
- ❌ **Reddet** → Başa dön (Aşama 1 veya farklı başlık)

### 3.5 Aşama 4 — JSON Dönüşümü

Onay sonrası agent:

**Mikro:** Hedef JSON'a eklenecek blok'u üretir (full dosyayı yazmaz, sadece eklenecek kısmı + nereye ekleneceğine dair talimat). Kullanıcı elle merge eder.

**Makro:** `public/<yeni-slug>.json` tam dosyasını yazar. Arapça ayet metni için her item'da `verse-graph-bgem3.json`'dan `surah:ayah` ile lookup yapıp kopyalar — encoding'e dokunmaz.

---

## 4. Halisinasyon Koruması — Kademeli Disiplin

| İddia Tipi | Disiplin |
|---|---|
| Ayet metni (Arapça) | ASLA generate edilmez. Referans → verse-graph-bgem3.json'dan kopyalanır |
| Ayet referansı | verse-graph-bgem3.json'dan doğrulanır. Doğrulanamazsa iddia atlanır |
| Korpus istatistiği | Kaynak yoksa yazılmaz. `~yaklaşık`, `%70 civarı` gibi hedge ifadelerle bile yazılamaz |
| Klasik tefsir görüşü | Müfessir + eser zorunlu. Doğrulanamazsa "X ekolünde benzer görüş var" genellemesi |
| Hadis atfı | SADECE Kütüb-i Sitte + Muvatta. Kitap + bab + hadis no zorunlu |
| Bilimsel iddia | Hakemli yayın veya Wikipedia-seviyesi genel kabul. "Kur'an X'i bildi" → "tarihsel bağlamda ilginç paralellik" tonuyla |
| Edebi/retorik gözlem | Serbest — ama "bu gözlem şunu destekler" tonuyla, "kesin hakikat" değil |
| Tasavvufî/işârî yorum | "Bâtınî okumadır, zâhirî tefsirle tamamlayıcıdır" notu mecburi |
| Çağdaş tartışmalı isim | "Klasik ulema eleştirmiştir" notu mecburi |

---

## 5. Kaynak Çemberi (Geniş)

**Klasik tefsir:** İbn Kayyim, Râzî (Mefâtîhu'l-Gayb), Zemahşerî (Keşşâf), İbn Âşûr (Tahrîr ve Tenvîr), Taberî, Kurtubî, İbn Kesîr, Beydâvî, Nesefî, Âlûsî, Mevdûdî, Elmalılı Hamdi Yazır

**Tasavvufî:** İbn Arabî (Fütûhât), Gazâlî (İhyâ), Konevî — ekol notuyla

**Modern akademi:** Raymond Farrin, Angelika Neuwirth, Michel Cuypers, Toshihiko Izutsu, Keith Moore, Maurice Bucaille, Gabriel Said Reynolds

**Çağdaş reformist (tartışmalı):** Fazlur Rahman, Nasr Ebu Zeyd — mecburi uyarı notuyla

**Korpus/dilbilim:** corpus.quran.com (Quranic Arabic Corpus), Tanzil, Lane's Lexicon

**Hadis (sadece):** Buhârî, Müslim, Tirmizî, Ebu Dâvûd, Nesâî, İbn Mâce, Muvatta

---

## 6. Verification Mekanizması (Hibrit)

**Offline-first veri kaynakları (repo içi):**
- `public/verse-graph-bgem3.json` — 6.236 ayet, Arapça + TR meal, embed, graph
- `docs/tefsir-kaynak-analizi.md` — proje-onaylı tefsir kaynakları
- `public/*.json` — mevcut içerik (duplicate check, stil referansı)
- `docs/reviews/*.md` — önceki denetim raporları (hata tipleri, hedging dili)

**WebFetch (kullanıcı onayı ile) izinli domain'ler:**
- `kuran.diyanet.gov.tr`, `kuranmeali.com` — meal doğrulama
- `corpus.quran.com` — morfoloji/kök analizi
- `sunnah.com` — hadis doğrulama (sadece 7 kaynak)
- `al-islam.org`, `islamweb.net`, `altafsir.com` — tefsir fetch (dikkatli)

**Her fetch'in taslakta kaydı:** `Kaynak: <URL> (erişim: 2026-04-19)`

**WebSearch:** modern akademik referans bulmak için son çare (arXiv, Google Scholar)

---

## 7. Agent Tools & Permissions

| Tool | İzin | Gerekçe |
|---|---|---|
| Read | ✅ | JSON + section + i18n + docs okumak |
| Glob | ✅ | İlgili dosyaları bulmak |
| Grep | ✅ | Duplicate check, isim/kavram taraması |
| Write | ✅ (sınırlı) | Sadece `docs/content-drafts/` ve `public/*.json` — başka yere yazamaz |
| Edit | ✅ (sınırlı) | Sadece `public/*.json` mikro patch — kod dosyalarına dokunamaz |
| WebFetch | ✅ (onaylı) | Yukarıdaki domain listesinden fetch |
| WebSearch | ✅ (son çare) | Modern akademik kaynak arama |
| Bash | ❌ | Gereksiz + güvenlik yüzeyi |
| NotebookEdit | ❌ | İlgisiz |
| Task (Agent) | ❌ | Alt-agent spawn etmeye gerek yok |

---

## 8. Site-Fit Kuralları (CLAUDE.md Türetilmiş)

- **Ton:** Şiirsel + akademik karışımı. Davetkâr rhetorik sorular. Keşif hissi. Didaktik değil.
- **Yapı her item için:** Yüzey "wow" → derinlik → kaynak → uyarı/belirsizlik notu
- **i18n:** TR + EN paired; Arapça ayet her iki dilde de Arapça kalır (çevrilmez)
- **JSON şeması ortak alanlar:** `id` (kebab-case), `titleTr/titleEn`, `descTr/descEn`, `verseAr`, `verseTr`, `verseEn`, `verseRef`, `surah` (int), `ayah` (int), `sourceTr/sourceEn`, `infoTr/infoEn`
- **Renk/stil:** tokens.js referansları (agent kendi hex üretmez)
- **Font:** KFGQPC — agent sadece referans verir, font'a dokunmaz
- **Arapça encoding:** standart Unicode; U+06E1, U+0671, U+06CC gibi Uthmani karakterler YASAK (CLAUDE.md §13.15)

---

## 9. Örnek Taslak (Mikro — WowFacts)

`docs/content-drafts/2026-04-19-wowfacts-zaman.md`:

```markdown
# Content Draft — WowFacts Eklemeleri (Zaman Teması)
Tarih: 2026-04-19
Mod: Mikro
Hedef dosya: public/wow-facts.json

## Kart 1: "Günün Hayretli Bir Anı"

verseRef: Kaf 50:38
surah: 50, ayah: 38
Doğrulama: verse-graph-bgem3.json'dan ayet metni mevcut ✓

titleTr: "Altı Günde Yaratılış ve Yorgunluk Yok"
titleEn: "Six Days of Creation — And No Fatigue"

descTr: [150 kelime]
descEn: [150 kelime]

depthTr: [250 kelime — klasik tefsir + modern paralel]
- Râzî, Mefâtîhu'l-Gayb: "gün" kelimesinin göreceli kullanımı...
- Elmalılı: "luğûb" kelimesi yorgunluk + bitkinlik...
- Modern paralel: termodinamik 2. yasa bağlamında... (not: dikkatli hedge)

sourceTr:
1. Râzî, Mefâtîhu'l-Gayb, Kaf sûresi tefsiri
2. Elmalılı Hamdi Yazır, Hak Dini Kur'an Dili, c.7
3. corpus.quran.com — lemma "luğûb" (erişim: 2026-04-19)

infoTr: ℹ️ "Altı gün" ifadesinin kozmolojik yorumu ekollere göre farklıdır — klasik tefsirde "gün" zâhirî anlamını korur, modern kelâm bazı kollarında "çağ/evre" olarak yorumlanır.

ekolEtiketi: klasik tefsir + modern dilbilim
```

---

## 10. Beklenen Başarı Kriterleri

- **Kaynaksız iddia oranı:** 0% (agent ya kaynak bulur ya iddiayı atar)
- **Ayet referansı hatası:** 0 (her ref verse-graph'tan doğrulanır)
- **Arapça encoding hatası:** 0 (agent Arapça generate etmez)
- **Ton uyumu:** Mevcut JSON dosyalarındaki depthTr/descTr ile aynı seviye akademik + şiirsel
- **Re-work oranı:** Kullanıcı taslakların %80+'ini ilk sunumda onaylayabilmeli (düzeltme talebi %20'nin altında)

---

## 11. Açık Sorular / İlerideki Kararlar

- **Otomatik audit tetikleme:** JSON dönüşümü sonrası `qc-content-auditor` otomatik çağrılsın mı? (Faz 2 — şimdilik manuel)
- **Memory sistemi:** Agent önceki üretimlerinden "hangi başlıklar üretildi" hafızası tutsun mu? (Faz 2)
- **Multi-agent pipeline:** Üret → denetle → düzelt otomatik döngüsü? (Faz 2 — şu an kullanıcı onay kapısı şart)

---

## 12. Uygulama Dosyası

Agent: `.claude/agents/qc-content-producer.md` — frontmatter (name, description, tools) + Türkçe sistem prompt'u.

Prompt yaklaşık 350–500 satır; yukarıdaki bölüm 4–9 kuralları mecburi direktif olarak içerecek.
