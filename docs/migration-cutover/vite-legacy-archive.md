# Faz 11.1 — Vite Legacy Archive Plan

> **Durum:** Plan dokümanı (henüz uygulanmadı)
> **Kapsam:** Next.js cutover sonrası kök Vite SPA'in (`src/`, `vite.config.js`, `index.html`, vb.) repoyu kirletmeden arşivlenmesi
> **Bağlı plan:** `tasks/todo_next.js_migration.md` Faz 11.1 maddesi
> **Önerilen tarih:** Cutover (T+0) sonrası en erken **T+30 gün**

---

## 0. Bağlam

`migration-to-next.js` branch'i kök Vite SPA'i `next/` workspace içindeki Next.js 16 App Router uygulamasına taşıdı. Cutover anında her iki kod tabanı aynı repoda yan yana duruyor; `next/` aktif production, `src/` referans/freeze. Bu doküman Vite tarafını kalıcı olarak nasıl arşivleyeceğimizi, hangi sırayı izleyeceğimizi ve hangi varlıkları (özellikle ortak `public/` veri dosyaları) nasıl koruyacağımızı tanımlar.

---

## 1. Pre-Archive Audit (Gerçek Envanter)

Aşağıdaki sayılar `migration-to-next.js` branch'inde (2026-05-24) ölçüldü.

### 1.1 Vite Proje Dosya Envanteri

| Bölge | Dosya sayısı | Notlar |
|---|---|---|
| `src/` toplam (`.jsx`/`.js`/`.css`/`.json`) | **98** | `find src -type f \( -name "*.jsx" -o -name "*.js" -o -name "*.css" -o -name "*.json" \) \| wc -l` |
| `src/components/` | 55 | Tool component'ları, overlay'ler, atlas/graf/arac UI'ları |
| `src/sections/` | 20 | Scroll-story section'ları (Hero, MathMiracle, vb.) |
| `src/utils/` | 3 | `cleanArabic`, vb. yardımcılar |
| `src/contexts/` | 1 | `LanguageContext` / `PathContext` (eski) |
| `src/hooks/` | 4 | `useScrollReveal`, `useQuranNav`, vb. |
| `src/i18n/` | 3 | `tr.json`, `en.json`, index |
| `src/data/` | 4 | Statik data fixtures |
| `src/__tests__/` | 5 | `arabic-encoding`, `i18n-completeness`, `json-data-validity`, `path-context`, `setup` |
| `src/App.jsx`, `src/main.jsx`, `src/index.css`, `src/tokens.js` | 4 | Root entry + tokens |
| **Toplam disk** | **3.9M** | `du -sh src` |

### 1.2 Vite-Spesifik Root Dosyalar

| Dosya | Tür | Next ile çakışıyor mu? |
|---|---|---|
| `vite.config.js` | Vite config (proxy + manualChunks) | Hayır |
| `vitest.config.js` | Vitest test config | Hayır |
| `index.html` | Vite entry HTML | Hayır (Next kendi `app/layout.js` üretiyor) |
| `eslint.config.js` (root) | Flat ESLint, Vite plugins | Kısmen — `next/eslint.config.mjs` ayrı |
| `vercel.json` (root) | `framework: vite`, `outputDirectory: dist` | **EVET — DEĞİŞMELİ** (cutover'da Next workspace'i target göstermeli) |
| `package.json` (root) | Vite scripts + deps | **EVET — DEĞİŞMELİ** |
| `package-lock.json` (root) | Vite npm lock | EVET |
| `todo.md` (root) | Vite döneminden | Hayır (silinebilir) |
| `dist/` | Vite build output | Hayır (gitignore'da zaten) |
| `node_modules/` (root) | Vite deps | Hayır (gitignore) |

### 1.3 Vite vs Next Dependency Karşılaştırması

**Root `package.json` (Vite):** `react@^19.2.0`, `react-dom@^19.2.0`, `framer-motion@^12.34.0`, `leaflet`, `react-leaflet`, `react-force-graph-3d`, `three@^0.183.2`, `topojson-client`, `@phosphor-icons/react`, `@fontsource/*` (6 paket), `vite@^7.3.1`, `@vitejs/plugin-react@^5.1.1`, `vitest@^2.1.9`, `@tailwindcss/vite@^4.1.18`, `tailwindcss@^4.1.18`, `eslint@^9.39.1`, `@testing-library/*`, `jsdom`, `openai`, `umap-js`.

**`next/package.json`:** `next@16.2.6`, `react@19.2.4`, `react-dom@19.2.4`, `framer-motion@^12.40.0`, `leaflet`, `react-leaflet`, `react-force-graph-3d`, `three@^0.184.0`, `topojson`, `topojson-client`, `@tailwindcss/postcss@^4`, `tailwindcss@^4`, `eslint@^9`, `eslint-config-next@16.2.6`.

**Sadece root'ta olanlar (silinmeli):**
- `vite`, `@vitejs/plugin-react`, `@tailwindcss/vite`, `vitest`
- `@testing-library/jest-dom`, `@testing-library/react`, `jsdom` (Vitest test stack)
- `@phosphor-icons/react` (Next karşılığını kullanmıyor; doğrula)
- `@fontsource/*` (Next `next/font/google` + `globals.css` `@font-face` kullanıyor)
- `openai`, `umap-js` (script-only — `scripts/` taşınırsa orada referans tut)
- `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `@eslint/js`, `globals`, `@types/react`, `@types/react-dom`

**React version drift uyarısı:** Vite `react@^19.2.0` (semver range) iken Next `react@19.2.4` (pin). Cutover sonrası root package.json silindiğinde tek kaynak `next/package.json` olur — drift kaynak ortadan kalkar.

### 1.4 Shared `public/` Durumu

| Dizin | Vite root `public/` | Next `next/public/` |
|---|---|---|
| Boyut | 56M | 56M |
| Dosya farkı | Sadece `.DS_Store` ve `robots.txt` farklı | (geri kalan ikiz kopya) |
| Corpus dosyası | 114 (`public/corpus/*.json`) | 114 (`next/public/corpus/*.json`) |
| Font (`fonts/kfgqpc-hafs.otf`) | Var | Var |
| `ShaykhHamdullah.ttf` | Var | Var |

**Kritik bulgu:** Next.js `public/` dosyalarını **fiziksel kopyaladı** — symlink değil. `next/src/components/*.jsx` içinde `fetch('/foo.json')` çağrıları Next workspace'inin kendi `next/public/`'ten okur (örn. `KuranRenkleri.jsx`, `VerseGraph.jsx`). Yani Vite root `public/` Next için **referans değil**; silinebilir.

**Drift riski:** İkiz kopya artık Faz 11.1 sonrası anlamsız — tek source of truth `next/public/` olacak. Cutover'a kadar bir dosya güncellenirse iki tarafa da yansıtmak zorunda.

### 1.5 Diğer Dizinler

- `scripts/` — Python + Node data prep script'leri (Vite veya Next'e bağlı değil, repo-level utility). **KORUNUR.** Sadece `scripts/playwright-prod-benchmark.mjs` ve benzeri Vite URL'ine bağlı script'ler güncellenmeli (yeni production URL).
- `next/scripts/` — Next-spesifik: `homepage-sections.mjs`, `screenshot-audit.mjs`. **KORUNUR.**
- `docs/` — Tüm doküman korunur. `docs/legacy-vite-rules.md` zaten arşiv referansı.
- `tasks/` — Korunur.

---

## 2. Archive Stratejisi (Üç Seçenek + Karar)

### Seçenek A: Subdirectory move (`src/` → `legacy-vite/`)

**Pro:**
- `git mv` rename tracking ile tarihçe korunur (`git log --follow`)
- Eski koda hızlı erişim (`legacy-vite/components/...`)
- Tek repo, branch ihtiyacı yok

**Con:**
- Repoda iki proje yan yana — CI ve IDE araçları her ikisini de tarar
- `package.json` ve diğer root config'ler hâlâ ortada
- "Hangi taraf canlı?" karışıklığı

### Seçenek B: Branch tag + delete from main

**Pro:**
- `main` (cutover sonrası `next/` promote edilmiş haliyle) tertemiz, tek proje
- Geçmişe erişim `git checkout v1.0-vite-final` ile mümkün
- CI/IDE/agent araçları net tek hedef görür
- `package.json` ve `vite.config.js` repodan kaybolur — bilgi kirliliği bitter

**Con:**
- Tag'a checkout etmeden eski koda göz atılamaz (ama bu bir feature, bug değil — kafa karışıklığını engeller)
- Tarihçe `git log --follow` ile takip edilemez (silinmiş dosya)

### Seçenek C: Hybrid — subdirectory + partial `.gitignore`

**Pro:** `legacy-vite/` referans olarak durur ama dependency'leri taşımaz.

**Con:** En karmaşık seçenek; `.gitignore` rules yanlış kurulursa veri kaybı. CI hâlâ iki proje algılayabilir. **Reddedilen.**

### **Karar: Seçenek B** (tag + delete)

**Gerekçe:**
1. Cutover sonrası tek odak `next/` olmalı; iki proje yan yana göstermek geliştirici/agent zihinsel yükünü çift katlar.
2. `git tag -a v1.0-vite-final` + `git bundle` ile geçmiş erişimi tam korunur.
3. `next/` workspace'i `next/src/` adı altında zaten kapsüllü — root'a promote etmeye **gerek yok** (workspace pattern kalsın; sadece root'tan Vite kalıntıları temizlensin).

**Promotion vs workspace tartışması:** Cutover sırasında `next/`'i root'a promote etmek (`mv next/* .`) ekstra risk getirir — Vercel build root, deploy config, tüm CI tetikleyicileri etkilenir. Bunun yerine `next/` workspace'i kalır; **sadece root Vite kalıntıları silinir**. Repo nihai görünümü: kök `package.json` minimal (sadece workspace coordinator veya tamamen kaldırılır), `next/` ana uygulama.

---

## 3. Pre-Delete Hazırlık (T+0'dan T+30'a)

Cutover (`next/` üretime alındığı an) `T+0`. Aşağıdaki checklist `T+30` günü Faz 11.1'in başlatılabilmesi için karşılanmalıdır.

- [ ] **Prod metrics stabil** — P95 LCP < 2.5s, P95 INP < 200ms, error oranı < %1, son 14 gün regression yok
- [ ] **Search Console (4 hafta)** — Indexlenme yeni route'lara tamamlanmış, ana keyword'lerde rank ≥ Vite baseline
- [ ] **Referans deploy hâlâ canlı** — `legacy.qurancodex.com` (Vite SPA snapshot) erişilebilir; karşılaştırmalı debugging için minimum T+45'e kadar tutulur
- [ ] **Git tag oluşturulmuş** — `v1.0-vite-final` (cutover öncesi son Vite commit'ine işaretli)
- [ ] **Offline yedek (bundle)** — `git bundle create vite-archive.bundle main` üretilmiş, dış konuma kopyalanmış (G-Drive vb.)
- [ ] **Shared public ikiz kontrolü** — Son 30 günde sadece `next/public/`'e yazıldığı doğrulanmış (root `public/` git diff'i sıfır)
- [ ] **Lessons.md notları toplanmış** — Cutover gözlemleri, son 30 gündeki incident'lar (Faz 11.3 için input)

---

## 4. Shared Asset Migration

### 4.1 `public/` ikiz kopyasının çözümü

Mevcut durum: root `public/` (56M) ve `next/public/` (56M) içerik olarak özdeş (sadece `.DS_Store` + `robots.txt` farkı). Next bileşenleri `fetch('/foo.json')` ile **kendi** workspace'inden okuyor (`next/src/components/KuranRenkleri.jsx`, `VerseGraph.jsx` vb. doğrulandı).

**Karar:** Root `public/` tamamen silinir. `next/public/` tek source of truth olur.

**Uyarılar:**
- Root `public/robots.txt` Vite SPA için — Next kendi `next/public/robots.txt` (yoksa `app/robots.js`) kullanır; **`next/public/robots.txt`'in canlı production'a uyumlu olduğunu doğrula** silmeden önce.
- `.DS_Store` zaten gitignore — issue değil.
- Font dosyaları (`kfgqpc-hafs.otf`, `ShaykhHamdullah.ttf`) hem root hem next'te var; sadece next'tekiler kalır.

### 4.2 `scripts/` data prep çıktısı

`scripts/*.py` script'leri JSON üretip nereye yazıyor? Cutover öncesi mevcut script'ler genelde `public/*.json`'a yazıyordu. Faz 11.1'de tüm script çıktı yolları `next/public/*.json` olacak şekilde güncellenmeli. Liste:

- `scripts/extract-first-last-words.mjs`
- `scripts/generate-embeddings-bgem3.py`
- `scripts/enrich-semantic-map.py`
- `scripts/enrich-corpus-en.py`
- `scripts/leeds-to-json.py`
- `scripts/merge-turkish-wbw.py`
- `scripts/patch-turkish.py`
- `scripts/prefetch-meal.mjs`
- (`scripts/__pycache__/` gitignore eklenmeli — zaten ekli)

**Bunu Faz 11.1 ile birlikte yapma; ayrı bir mini-faz olarak `scripts/` path migration'ı (Faz 11.2) öner.**

### 4.3 `dist/` Vite build çıktısı

`dist/` zaten `.gitignore`'da. Faz 11.1'de fiziksel silinir; `vercel.json`'dan `outputDirectory: dist` referansı kaldırılır.

---

## 5. Delete Sırası (Phase 1 → Phase 4)

Tüm silmeler **git mv** veya **git rm** ile yapılır — manuel `rm` yasak (history kaybı).

### Phase 1 (T+30) — Vite-Only Dosyaları Sil

```bash
# Aktif branch: cutover sonrası main (veya geçici archive branch)
git checkout main
git pull --ff-only

# Yedek
git bundle create ../qurancodex-pre-archive-$(date +%Y%m%d).bundle main migration-to-next.js
git tag -a v1.0-vite-final <vite_cutover_commit_sha> -m "Son Vite SPA commit'i — cutover öncesi"
git push origin v1.0-vite-final  # tag push — kullanıcı onayı ile

# Vite source
git rm -r src/
git rm -r dist/  # eğer accidentally committed varsa
git rm index.html
git rm vite.config.js
git rm vitest.config.js

# Vite build artifacts
# (dist/ ve node_modules/ zaten gitignore'da)

git commit -m "chore(faz11.1): archive Vite source tree (src/, index.html, vite.config.js)"
```

**Smoke test (Phase 1 sonrası):**
- `cd next && npm run build` — başarılı build
- `next/` deploy preview manuel smoke test (homepage + 3 tool route + 1 sure okuma)
- `next/public/*.json` count: 49 dosya korunmuş

### Phase 2 (T+30) — Root `package.json` Temizliği

İki strateji var:

**Strateji 2a — Root package.json tamamen sil (önerilen):**

```bash
git rm package.json package-lock.json eslint.config.js
git commit -m "chore(faz11.1): remove root package.json (Vite tooling); next/ workspace is the only app"
```

Vercel ayarı: build root `next/` olarak ayarlı olmalı (cutover'da yapıldıysa OK).

**Strateji 2b — Root package.json minimal workspace coordinator olarak kalsın:**

```jsonc
{
  "name": "qurancodex-monorepo",
  "private": true,
  "workspaces": ["next"],
  "scripts": {
    "dev": "npm --workspace next run dev",
    "build": "npm --workspace next run build"
  }
}
```

**Karar:** **2a** (tamamen sil) — workspace coordinator gerçek bir yarar sağlamıyor (zaten `next/` içinde tüm script'ler var) ve yeni gelen geliştirici kafasını karıştırır.

### Phase 3 (T+45) — CI/CD ve Deploy Config Güncelle

- [ ] `vercel.json` (root) — `framework: vite` ve `outputDirectory: dist` referansları kaldırılır. Eğer root `vercel.json`'ı silmek mümkünse (Vercel proje ayarları zaten Next workspace'i bilirse), silinir. Aksi takdirde minimal `{ "rewrites": [...] }` formuna indirgenir.
- [ ] `next/vercel.json` (eğer gerekiyorsa) — `kuran-proxy` rewrite'ları taşınır
- [ ] GitHub Actions workflows (varsa `.github/workflows/`) — Vite-spesifik step'ler kaldırılır, sadece `next/` build/test pipeline kalır
- [ ] `_redirects` dosyası — root `public/_redirects` zaten silindi (Phase 1); `next/public/_redirects` korunur

### Phase 4 (T+45) — README ve Docs

- [ ] `README.md` (root) güncellenir: "Bu proje Next.js 16 App Router üzerine inşa edildi. Kaynak kod `next/` workspace'inde. Geliştirme: `cd next && npm install && npm run dev`."
- [ ] Eski `README.md` içeriği (Vite kurulum talimatları) `docs/legacy-vite-rules.md`'ye birleştirilir veya silinir
- [ ] `CLAUDE.md` (root) — Vite referansları temizlenir, §16 (Next patterns) ana referans olarak kalır
- [ ] `docs/migration-cutover/vite-legacy-archive.md` (bu doküman) durumu "Uygulandı" olarak güncellenir; sonuç notları eklenir

### Phase 5 (opsiyonel, T+60) — `scripts/` Path Migration

(Faz 11.2 olarak ayrılması önerilir — bu doc kapsamı dışı.)

---

## 6. Risk ve Rollback Matrisi

| Risk | Olasılık | Etki | Mitigation |
|---|---|---|---|
| Shared `public/` JSON kaybı (yanlış silme) | Düşük | Yüksek | Phase 1 öncesi `git bundle` + manuel `next/public/` checksum | 
| Next build'i unexpected Vite kalıntısına bağımlı | Düşük | Orta | Phase 1 sonrası `next build` + smoke test zorunlu |
| Vercel deploy root yanlış | Orta | Yüksek | Phase 3 öncesi Vercel dashboard'da "Root Directory: next" doğrula |
| Tag/bundle production'a yansır | Yok | — | Tag sadece git, deploy etkilenmez |
| `scripts/` çıktı yolu kırılır | Orta | Düşük | Faz 11.2'ye ertelendi; cutover'da etkilenmez |
| `react@19.2.0` vs `19.2.4` minor drift | Çok düşük | Düşük | Root silinince tek versiyon kalır |
| Search Console rank kaybı | Düşük | Yüksek | T+30 öncesi rank monitor; redirect map (`/oku/...` legacy → yeni) kalıcı |

### Rollback Planı

**Phase 1 sonrası prod regression:**
1. `git revert <phase1-commit>` ile dosyaları geri al
2. Vercel: bir önceki deploy'a rollback (UI'dan tek tık)
3. Bundle'dan checkout: `git clone vite-archive.bundle restored-repo` (offline yedek)

**Phase 2 sonrası build break:**
1. `git revert <phase2-commit>` — root package.json geri gelir
2. Next workspace bağımsız çalıştığı için bu phase'in production etkisi düşük

**Phase 3 sonrası deploy fail:**
1. Vercel proje ayarlarını manuel root reset
2. `vercel.json` revert

---

## 7. Lessons.md Update (Faz 11.3 Input)

Faz 11.1 tamamlandıktan sonra `tasks/lessons.md`'ye eklenecek başlıklar (Faz 11.3 ayrı bir step):

- **Migration süresi:** Faz 1 → cutover toplam gün sayısı (tasks/todo_next.js_migration.md log'undan)
- **En zor 3 problem:**
  1. Overlay state-based UI → full-page route transformation (visual parity ile)
  2. SSR-safety (hydration mismatch, `window` access, localStorage)
  3. OG image generation Turbopack quirk (`[__metadata_id__]` ENOENT)
- **CLAUDE.md §16 ile çakışmayan ek bulgular:**
  - `next/font/local` migration ertelendi (53 inline `'KFGQPC'` literal — refactor maliyeti yüksek, mevcut `@font-face` + preload yeterli)
  - Edge runtime API route cache stratejisi (`revalidate` + `Cache-Control` ikilisi)
- **Vite kalıntısı kontrolü:**
  - `[ ]` Hiç inline `import.meta.env` Vite-style env access kalmadı (Next `process.env.NEXT_PUBLIC_*` kullanıyor)
  - `[ ]` Hiç `?url` veya `?raw` Vite query asset import'u kalmadı
  - `[ ]` `tokens.js` tek kopya (next/src/tokens.js)
- **Repo footprint:** Faz 11.1 öncesi/sonrası toplam dosya sayısı + disk boyutu

---

## 8. Komutlar (Cheat Sheet)

```bash
# === AUDIT (T+0 to T+30, herhangi bir zamanda) ===

# Vite kaynak inventory
find src -type f \( -name "*.jsx" -o -name "*.js" -o -name "*.css" -o -name "*.json" \) | wc -l

# Shared public diff (ikiz kopya kontrolü)
diff -rq public/ next/public/ 2>&1 | head -20

# Public dosya sayısı kontrolü
ls public/ | wc -l
ls next/public/ | wc -l
ls public/corpus/ | wc -l   # 114 sure dosyası
ls next/public/corpus/ | wc -l

# Disk kullanımı
du -sh src/ next/src/ public/ next/public/

# Hangi Next dosyaları root public yerine next/public okuyor?
grep -rE "fetch\(['\"]/" next/src/components/ | head -10

# === HAZIRLIK (T+30) ===

# Yedek (offline arşiv)
git bundle create ../qurancodex-pre-archive-$(date +%Y%m%d).bundle main migration-to-next.js

# Tag (cutover öncesi son Vite commit'i)
git tag -a v1.0-vite-final <cutover_predecessor_sha> -m "Son Vite SPA commit'i — Faz 11.1 archive öncesi"

# Tag push (kullanıcı onayı ile)
git push origin v1.0-vite-final

# === PHASE 1 (T+30) — Vite source silme ===

git checkout main
git pull --ff-only

git rm -r src/
git rm index.html vite.config.js vitest.config.js

git commit -m "chore(faz11.1): archive Vite source tree after 30d stable cutover"

# Smoke test
cd next && npm run build && cd ..

# === PHASE 2 (T+30) — root package.json sil ===

git rm package.json package-lock.json eslint.config.js
git commit -m "chore(faz11.1): remove root Vite package.json; next/ is sole workspace"

# === PHASE 3 (T+45) — Vercel + CI config ===

# vercel.json düzenle veya sil (Vercel dashboard "Root Directory: next" doğrula)
# .github/workflows/*.yml içinde Vite-step'leri kaldır

# === PHASE 4 (T+45) — README ===

# README.md'yi Next-only kurulum talimatlarıyla yeniden yaz
# CLAUDE.md root'tan Vite §1-15 referanslarını temizle (§16 kalsın)

# === ROLLBACK (gerekirse) ===

git revert <phase1-commit-sha>
git revert <phase2-commit-sha>

# Offline bundle'dan restore
git clone qurancodex-pre-archive-YYYYMMDD.bundle restored-repo
```

---

## Özet (200 kelime)

QuranCodex Vite SPA'i Next.js 16 App Router'a tamamen taşındı; cutover sonrası repoda iki proje yan yana duruyor: kök Vite (`src/` 98 dosya, 3.9M, `vite.config.js`, `index.html`, root `package.json`) ve `next/` workspace (canlı production). Shared `public/` dizini (56M, 114 corpus dosyası dahil) Next tarafından fiziksel kopyalandı; bileşenler `fetch('/foo.json')` ile **kendi** workspace'inden okuyor — yani root `public/` referans değil, ikiz kopya. Üç archive stratejisinden (A: subdirectory move, B: tag + delete, C: hybrid) **Seçenek B önerildi**: cutover'dan T+30 gün sonra `v1.0-vite-final` tag + `git bundle` offline yedek + dört fazlı delete (Phase 1 Vite source, Phase 2 root package.json, Phase 3 CI/Vercel config, Phase 4 README + CLAUDE.md update). Risk matrisi shared `public/` kaybı, Next build dependency, Vercel root config ve search rank monitor'üne odaklanıyor; her phase için git revert + offline bundle rollback'i tanımlı. `scripts/` data prep yol güncellemesi Faz 11.2'ye ertelendi. Phase 1 öncesi prod metrics stabil (P95 LCP <2.5s), Search Console 4 haftalık rank gözlemi ve `legacy.qurancodex.com` referans deploy şartı zorunlu. Faz 11.3'te lessons.md güncellenir.
