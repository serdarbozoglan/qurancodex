# URL Şeması — Faz 0.3

**Tarih:** 2026-05-21
**Branch:** `migration-to-next.js`
**Hedef:** Next.js 15 App Router URL routing tasarımı

---

## Tasarım İlkeleri

1. **Locale prefix routing** — `/tr/...`, `/en/...` (SEO için optimal, hreflang otomatik)
2. **Lowercase kebab-case path'ler** — `bakara`, `ayetel-kursi`, `peygamber-zincir`
3. **Türkçe karakter yok URL'de** — `ı→i`, `ş→s`, `ğ→g`, ASCII-only
4. **Trailing slash yok** — `next.config.js` → `trailingSlash: false`
5. **Numeric ayet** — `/oku/2/255` (hem insan-okunabilir hem bot-friendly)
6. **Tool kategorilerine göre namespace** — `atlas/`, `graf/`, `arac/`
7. **Path uzunluğu < 80 karakter** (Google ranking factor)

---

## Route Haritası

### Ana sayfa
| URL | İçerik | Render |
|---|---|---|
| `/` | Locale detection → redirect (`/tr` veya `/en`) | Edge middleware |
| `/tr` | TR Home — Hero + tüm sections | SSG (static) |
| `/en` | EN Home — aynı | SSG |

### ReadingMode (Kur'an okuma)
| URL | İçerik | Static params | Render |
|---|---|---|---|
| `/tr/oku` | Sure listesi (114 sure index) | — | SSG |
| `/tr/oku/[surah]` | Sure okuma — number veya latin slug | 1-114 | SSG (114 × 2 locale = 228 URL) |
| `/tr/oku/[surah]/[ayah]` | Deep-link ayet (auto-scroll + highlight) | Lazy (ISR) | SSG'ye dahil edilebilir 6236 ayet için, ama büyük build → ISR önerilir |

**Sure slug stratejisi:** Numeric `1-114` veya Latin slug `fatiha`, `bakara`, vs. — kullanıcıya canonical olarak `/oku/2` veriyoruz, ama `/oku/bakara` da redirect ile destekleyebiliriz (SEO için faydalı).

**Öneri:** Canonical `/oku/{number}` (1-114). Latin slug 301 redirect. Toplam route sayısını minimize eder, ayet sayfaları için seçenek bırakır.

### Atlas tool'ları
| URL | Component | Static params | Notlar |
|---|---|---|---|
| `/tr/atlas/kissa` | KissaAtlas (index) | — | Tüm kıssalar listesi |
| `/tr/atlas/kissa/[id]` | KissaAtlas (detay) | kıssa id'leri | id sayısı: `public/kissalar.json` |
| `/tr/atlas/kavim` | KavimlerAtlasi | — | |
| `/tr/atlas/kavim/[id]` | KavimlerAtlasi (detay) | kavim id'leri | |
| `/tr/atlas/peygamber` | ProphetAtlas | — | |
| `/tr/atlas/peygamber/[id]` | ProphetAtlas (detay) | 25 peygamber | |
| `/tr/atlas/doga` | DogaAtlasi | — | |
| `/tr/atlas/doga/[topic]` | DogaAtlasi (detay) | konu id'leri | |
| `/tr/atlas/mesel` | MeselAtlasi | — | |
| `/tr/atlas/mesel/[id]` | MeselAtlasi (detay) | mesel id'leri | |
| `/tr/atlas/furuk` | FurukAtlasi | — | |
| `/tr/atlas/furuk/[id]` | FurukAtlasi (detay) | füruk id'leri | |
| `/tr/atlas/munasebat` | MunasebatAtlasi | — | Detay yok (toplu görünüm) |
| `/tr/atlas/kiraat` | KiraatAtlasi | — | Detay yok |
| `/tr/atlas/kadinlar` | KadinlarAtlasi | — | |
| `/tr/atlas/kadinlar/[id]` | KadinlarAtlasi (detay) | kadın id'leri | |
| `/tr/atlas/munafik` | MunafikProfili | — | |
| `/tr/atlas/nefs-mertebeleri` | NefisMertebeleri | — | |
| `/tr/atlas/sunnetullah` | SunnetullahAtlasi | — | |

### Graf tool'ları
| URL | Component | Query params | Notlar |
|---|---|---|---|
| `/tr/graf/ayet` | VerseGraph | `?q=2:255&from=...` | Ayet semantik grafiği |
| `/tr/graf/kavram` | ConceptGraph | `?c=rahmet` | Kavram bağlam grafiği |
| `/tr/graf/diyalog` | DiyalogAgi | — | Diyalog ağı |
| `/tr/graf/zaman` | RevelationTimeline | — | Nüzul kronolojisi |
| `/tr/graf/karsilastir` | SurahComparator | `?s1=2&s2=3` | Sure karşılaştırma |
| `/tr/graf/kelime-isi` | WordHeatmap | `?w=hidayet` | Kelime ısı haritası |
| `/tr/graf/semantik` | SemanticMap | — | Semantik haritalama |

### Arac (genel tool'lar)
| URL | Component | Notlar |
|---|---|---|
| `/tr/arac` | ToolsBrowser | Tüm tool index |
| `/tr/arac/muhataplar` | AddresseeSystem | |
| `/tr/arac/cennet-cehennem` | CennetCehennem | |
| `/tr/arac/dualar` | DuaVerses | |
| `/tr/arac/esma-frekans` | EsmaFrekans | |
| `/tr/arac/kiyamet` | KiyametSahneleri | |
| `/tr/arac/renkler` | KuranRenkleri | |
| `/tr/arac/retorik` | KuranRetorigi | |
| `/tr/arac/yeminler` | KuranYeminleri | |
| `/tr/arac/melekler` | Melekler | |
| `/tr/arac/buyruklar` | QuranCommands | |
| `/tr/arac/sebebi-nuzul` | SebebiNuzul | |
| `/tr/arac/sebebi-nuzul/[id]` | SebebiNuzul (detay) | nuzul id'leri |
| `/tr/arac/wow` | WowFacts | |
| `/tr/arac/wow/[id]` | WowFacts (detay) | fact id'leri |
| `/tr/arac/zaman-boyutlari` | ZamanBoyutlari | |
| `/tr/arac/iblis-seytan` | IblisSatan | |
| `/tr/arac/ilk-son-kelimeler` | IlkSonKelimeler | |

### Diğer
| URL | İçerik | Notlar |
|---|---|---|
| `/tr/ara` | Search overlay (full page) | Cmd+K hâlâ açar |
| `/tr/mihver` | MihverDemo (BETA) | Geçici demo |

---

## Toplam Route Sayısı

| Kategori | Adet | × 2 locale | Notlar |
|---|---|---|---|
| Home + ana sayfalar | 3 | 6 | `/`, `/tr`, `/en` |
| ReadingMode index + 114 sure | 115 | 230 | `/oku` + 114 |
| Atlas tool index'leri | 11 | 22 | |
| Atlas tool detayları | ~80 | ~160 | Kıssa (~25) + kavim (~10) + peygamber (25) + doğa (~10) + mesel (~10) + furuk (~10) + kadınlar (~10) |
| Graf tool'ları | 7 | 14 | |
| Arac tool'ları | ~17 | ~34 | |
| Arac detayları | ~30 | ~60 | sebebi-nuzul + wow detayları |
| **TOPLAM (sure-level)** | **~263** | **~526** | Build-time statik |
| Ayet-level deep-link (`/oku/[s]/[a]`) | 6236 | 12472 | **ISR önerilir, full SSG değil** |

**Build time impact:**
- Sure-level: ~526 statik route, Next.js build < 30 saniye tahmini
- Ayet-level eklenirse: 12K+ route, build 5-10 dakika sürebilir → ISR ile lazy generate

**Önerim:** Faz 4'te sure-level statik + ayet-level ISR. Popüler ayetler (Ayet'el-Kürsi, İhlas, vs.) için manual pre-build whitelist.

---

## Migration sırasında dikkat edilecek özel route'lar

### Cross-tool back navigation (eski §13.12 yerine)
Şu an: `window.dispatchEvent('openVerseGraph', {returnToConcept: true})` + state.
Next.js'te: `router.push('/tr/graf/ayet?q=2:255&from=concept')` + back tarayıcı geçmişine push.

`?from=` query param patterns:
- `?from=concept` — ConceptGraph'tan geldi, back → `/graf/kavram`
- `?from=wow` — WowFacts'tan geldi, back → `/arac/wow`
- `?from=verse` — VerseGraph'tan geldi (kelime tıklama)
- `?from=reading` — ReadingMode'dan geldi

### Modal-like UX gerekiyorsa
Next.js'in **parallel + intercepting routes** ile modal pattern:
- Ana route: `/tr/atlas/kissa/yusuf` (tam sayfa, direkt link açar)
- Intercepting: `/tr/.../@modal/(.)atlas/kissa/yusuf` (mevcut sayfa üzerinde modal)
- Soft navigation modal'a, hard navigation tam sayfaya gider — SEO için en iyi

**Karar:** Faz 4'te tool bazında — atlas/graf tool'ları için full page (SEO öncelik), search/settings için modal (UI tercihi).

---

## Açık Sorular (User onayı bekleyen)

- [ ] **Sure slug:** Sadece numeric `/oku/2` mi, yoksa Latin slug `/oku/bakara` da destekleyecek mi (redirect ile)? **Öneri: numeric canonical + latin redirect**
- [ ] **Ayet-level URL:** `/oku/2/255` statik SSG mi yoksa ISR mi? **Öneri: ISR, popüler ayetler whitelist**
- [ ] **Atlas index sayfaları:** `/atlas/kissa` standalone listing mi yoksa direkt `/atlas/kissa/yusuf` (default kıssa) mi? **Öneri: standalone listing — kullanıcı seçimi yapar**
- [ ] **Locale routing:** Cookie + URL prefix mı sadece URL prefix mi? **Öneri: sadece URL prefix (`/tr/`, `/en/`); root `/` → middleware ile locale detect → redirect**
- [ ] **Mihver demo route:** Production'da gizli mi (`/_mihver`) yoksa açık mı (`/mihver`)? **Öneri: gizli prefix; sadece `?mihver=1` query param ile keşfedilir**
- [ ] **Search route:** `/tr/ara` standalone mı yoksa modal-only mı (her sayfadan Cmd+K)? **Öneri: standalone route + intercepting modal**

---

## Sonraki Adım

User onayı sonrası **Faz 1** başlar: `next/` klasörü kurulumu, Tailwind v4 port, shared modules taşıma. Bu URL şeması Faz 4 için referans olur — her tool migrate edilirken hedef route bu listede.
