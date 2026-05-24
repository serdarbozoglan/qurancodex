# Faz 10 — Deploy & Cutover Checklist

> **Hedef:** Vite SPA (`qurancodex.com`, production) → Next.js 16 (`next/` workspace) cutover.
> **Branch:** `migration-to-next.js`
> **Strateji:** Vercel'a yeni proje, preview validation, DNS swap, 30 gün legacy fallback.
> **Tahmini E2E süre:** ~10-12 saat aktif iş, T-7 günden T+0'a takvim.
> **Önkoşul:** Faz 9 (testing) PASS, production build PASS, lint clean.

---

## 1. Pre-Deploy (T-7 gün)

Vercel hesabı, lokal build, lint ve trafik hazırlığı.

- [ ] Vercel hesabı oluşturuldu / login OK (`https://vercel.com`)
- [ ] GitHub repo Vercel'a bağlanmaya hazır (org/team seçildi)
- [ ] Lokal production build PASS: `cd next && npm run build`
  - Beklenen: 228 sure HTML pre-render + 39 tool sayfası SSG, 0 build error
- [ ] Lint clean: `cd next && npm run lint`
- [ ] Bundle size manuel inspect:
  - `cd next && ls -lh .next/static/chunks/ | sort -k5 -h | tail -20`
  - Beklenen: en büyük chunk < 500KB gzipped, framework + atlas/3D ayrı chunk'lar
- [ ] Sayfa başına initial JS payload:
  - `cd next && grep -rn "First Load JS" .next/*.json 2>/dev/null || npx next build --no-lint | grep "First Load"`
- [ ] `.env.example` yaz (KEY listesi; mevcut `.env`'i kopyalama):
  - `NEXT_PUBLIC_SITE_URL` (örn. `https://qurancodex.com`)
  - `NEXT_PUBLIC_ACIKKURAN_BASE` (varsa)
  - Diğer custom env'ler — `next/src/` içinde `process.env.` taraması: `grep -rn "process.env\." next/src/ | grep -v node_modules`
- [ ] Mevcut DNS provider erişimi doğrula (Cloudflare / GoDaddy / vs.) — login OK
- [ ] DNS TTL'i düşür: 3600s → 60s (cutover'dan 24h önce yapılacak; ön rezervasyon)
- [ ] Faz 9.1 manuel UI test pass — referans: `docs/test-plans/manual-ui-checklist.md`
- [ ] Faz 9.2 SEO check pass (meta tags + JSON-LD + sitemap)
- [ ] Critical user paths smoke test (lokal `next dev`):
  - `/` (TR home), `/en/` (EN home)
  - `/tr/oku/1`, `/tr/oku/2/255` (reading)
  - `/tr/graf/ayet?q=2:255`, `/tr/atlas/kissa`, `/tr/arac/wow`

**Komutlar:**
```bash
cd /Users/serdar/dev/00_dev_PROJECTS/01_qurancodex/next
npm run build
npm run lint
ls -lh .next/static/chunks/ | sort -k5 -h | tail -10
grep -rn "process.env\." src/ | grep -v node_modules
```

---

## 2. Vercel Project Setup (T-3 gün)

Yeni Vercel projesi, build config, env vars.

- [ ] Vercel CLI install: `npm i -g vercel@latest`
- [ ] Login: `vercel login` (browser auth)
- [ ] Yeni proje oluştur: Vercel dashboard → "Add New" → "Project" → GitHub repo seç
  - Project name: `qurancodex-next`
  - Root directory: `next/` (önemli — repo root değil!)
  - Framework Preset: **Next.js** (otomatik algılanır)
- [ ] Build config (varsayılan, override ETME):
  - Build command: `npm run build`
  - Output dir: `.next`
  - Install command: `npm install`
- [ ] Node version: package.json'a `"engines": { "node": ">=20.x" }` ekle (henüz yoksa)
  - Vercel default Node 20.x; 22.x'e geçilebilir
- [ ] Env vars (Vercel dashboard → Settings → Environment Variables):
  - `.env.example`'daki her KEY için Production + Preview scope'lara ekle
  - **Önemli:** Secret'ları sadece Production scope'ta tut
- [ ] İlk preview deploy tetikle: `cd next && vercel` (interactive)
  - Çıktı: preview URL (örn. `qurancodex-next-xyz.vercel.app`)
- [ ] Preview URL'i bookmark et — Faz 3 validation için kullanılacak

**Komutlar:**
```bash
npm i -g vercel@latest
vercel login
cd /Users/serdar/dev/00_dev_PROJECTS/01_qurancodex/next
vercel                          # ilk preview deploy
vercel env ls                   # env vars audit
vercel env add NEXT_PUBLIC_SITE_URL production
```

---

## 3. Preview Deployment Validation (T-2 gün)

Preview URL'de full smoke test, Lighthouse, OG image, edge function logs.

- [ ] Preview URL erişilebilir (HTTP 200)
- [ ] **39 route smoke test** (her route'un TR + EN versiyonu):
  - Ana sayfa: `/tr`, `/en`
  - Okuma: `/tr/oku`, `/tr/oku/1`, `/tr/oku/2/255` (3 derinlik)
  - Graf (7): ayet, kavram, kelime-isi, diyalog, zaman, karsilastir, semantik
  - Atlas (12): kissa, peygamber, kavim, kadinlar, kiraat, doga, mesel, furuk, munafik, munasebat, sunnetullah, nefs-mertebeleri
  - Araç (16): wow, dualar, yeminler, buyruklar, kiyamet, esma-frekans, iblis-seytan, zaman-boyutlari, tum-araclar, muhataplar, renkler, sebebi-nuzul, cennet-cehennem, melekler, retorik, ilk-son-kelimeler
- [ ] Mobile test: Chrome DevTools → Toggle Device → iPhone 14 Pro + 4G throttling
  - Hero LCP < 3s, tüm navbar item'lar erişilebilir, hamburger menu OK
- [ ] **Lighthouse** (DevTools → Lighthouse → Mobile + Performance/SEO/A11y/Best Practices):
  - Hedef: Performance > 85, SEO > 95, A11y > 90, Best Practices > 90
  - 3 örnek route üzerinde: `/`, `/tr/oku/2`, `/tr/graf/ayet?q=2:255`
- [ ] Edge function log inspect:
  - `vercel logs <preview-url> --follow` ile `/api/meal/diyanet/2` request gözle
  - 200 OK, cache header `s-maxage=86400`
- [ ] OG image render test:
  - Twitter Card Validator: `https://cards-dev.twitter.com/validator` — preview URL gir
  - Facebook Sharing Debugger: `https://developers.facebook.com/tools/debug/` — preview URL gir
  - Beklenen: 1200x630 PNG, Quranic green border + gold title
- [ ] `sitemap.xml` response: `curl <preview-url>/sitemap.xml`
  - Beklenen: XML, 228+ URL (114 sure × 2 locale), tool URL'leri dahil
- [ ] `robots.txt` response: `curl <preview-url>/robots.txt`
  - Beklenen: `Sitemap: <preview-url>/sitemap.xml`, `Allow: /`
- [ ] hreflang attribute check: View source → `<link rel="alternate" hreflang="tr"...>` + `hreflang="en"` + `hreflang="x-default"`
- [ ] JSON-LD parse: 3 örnek route'ta View Source → `<script type="application/ld+json">` JSON valid

**Komutlar:**
```bash
curl -I https://qurancodex-next-xyz.vercel.app/tr
curl https://qurancodex-next-xyz.vercel.app/sitemap.xml | head -50
curl https://qurancodex-next-xyz.vercel.app/robots.txt
vercel logs https://qurancodex-next-xyz.vercel.app --follow
```

---

## 4. Production Deployment (T-1 gün)

Production deploy, staging subdomain, HTTPS cert, cache warm.

- [ ] Production deploy: `cd next && vercel --prod`
  - Çıktı: `https://qurancodex-next.vercel.app`
- [ ] Custom domain bağla (staging için): Vercel dashboard → Domains → `staging.qurancodex.com`
  - DNS provider'da CNAME ekle: `staging` → `cname.vercel-dns.com`
  - Propagation kontrol: `dig staging.qurancodex.com CNAME +short`
- [ ] HTTPS cert otomatik (Let's Encrypt via Vercel) — Vercel dashboard'ta "Valid" durumu
- [ ] Staging URL erişim testi: `curl -I https://staging.qurancodex.com/tr`
- [ ] Vercel Edge cache warm — 39 hot route × 2 locale = 78 curl:
  - Tek seferlik script ile: `for path in tr en; do for route in "" oku/1 oku/2 graf/ayet atlas/kissa arac/wow; do curl -sI "https://staging.qurancodex.com/$path/$route" -o /dev/null -w "%{http_code} %{url_effective}\n"; done; done`
  - Beklenen: hepsi 200 OK
- [ ] Cache hit ratio check (ikinci curl'da `x-vercel-cache: HIT` header'ı):
  - `curl -I https://staging.qurancodex.com/tr | grep -i vercel-cache`
- [ ] Final stakeholder review — staging URL'i ekibe paylaş, onay al

**Komutlar:**
```bash
cd /Users/serdar/dev/00_dev_PROJECTS/01_qurancodex/next
vercel --prod
dig staging.qurancodex.com CNAME +short
curl -I https://staging.qurancodex.com/tr | grep -i "vercel-cache\|content-type"
```

---

## 5. DNS Cutover (T-Day)

Apex domain swap, propagation gözlem, legacy yedek.

- [ ] **Pre-cutover** (T-30dk):
  - Mevcut Vite SPA `qurancodex.com` aktif olduğunu doğrula: `curl -I https://qurancodex.com`
  - DNS TTL 60s'e düşürülmüş olduğunu doğrula: `dig qurancodex.com SOA | grep -i "minimum\|ttl"`
- [ ] **Cutover** (T-0):
  - Vercel dashboard → Domains → `qurancodex.com` ekle (apex)
  - Vercel verify token (TXT record) DNS provider'a ekle
  - Apex için A record swap:
    - **Eski:** `qurancodex.com A <eski-host-IP>`
    - **Yeni:** `qurancodex.com A 76.76.21.21` (Vercel apex IP)
  - `www.qurancodex.com CNAME cname.vercel-dns.com` ekle / güncelle
- [ ] **Legacy backup** (yedek):
  - Vite SPA dosyalarını mevcut host'ta tut, sadece DNS yönlendirmesini değiştir
  - Subdomain ekle: `legacy.qurancodex.com A <eski-host-IP>`
  - Erişim testi: `curl -I https://legacy.qurancodex.com` (eski Vite UI dönmeli)
- [ ] **DNS propagation gözlem** (5-30dk):
  - `dig qurancodex.com A +short` → `76.76.21.21` dönene kadar bekle
  - Birden fazla resolver test: `dig @8.8.8.8 qurancodex.com A +short`, `dig @1.1.1.1 qurancodex.com A +short`
  - Global propagation: `https://www.whatsmydns.net/#A/qurancodex.com`
- [ ] **Post-cutover validation** (T+30dk):
  - `curl -I https://qurancodex.com` → 200 OK + `x-vercel-id` header
  - `curl -I https://qurancodex.com/tr/oku/1` → 200 OK
  - HTTPS cert valid: `openssl s_client -connect qurancodex.com:443 -servername qurancodex.com < /dev/null 2>&1 | grep "subject\|issuer\|verify"`

**Komutlar:**
```bash
dig qurancodex.com A +short
dig @8.8.8.8 qurancodex.com A +short
dig qurancodex.com SOA | grep -i ttl
curl -I https://qurancodex.com
curl -I https://qurancodex.com/tr/oku/2/255
openssl s_client -connect qurancodex.com:443 -servername qurancodex.com < /dev/null 2>&1 | grep -E "subject|issuer|verify|expire"
```

---

## 6. Redirects (Vite → Next URL Mapping)

`next.config.mjs` içinde `redirects()` ile 301 mapping. Vite'ın SPA pattern'ı çoğunlukla overlay state idi — query param tabanlı public link'ler azdı. Yine de SEO equity ve external link'ler için aşağıdaki redirect'ler 301 olarak eklenmeli.

### 6.1 Bilinen Vite URL pattern'ları (tarama bulgusu)

`grep -rn "URLSearchParams\|searchParams" src/` çıktısına göre Vite'ta gerçekten kullanılan query param tabanlı public URL'ler:

| Vite URL | Next.js karşılığı | Tip |
|---|---|---|
| `/?verse=2:255` | `/tr/graf/ayet?q=2:255` | 301 |
| `/?mihver=1` | `/tr` (root, mihver demo iç state) | 301 |
| `/?lang=en` | `/en` | 301 |
| `/index.html` | `/tr` | 301 |
| `/` (root) | `/tr` (middleware handles) | yok — middleware |

> Vite tool'ları (`?tool=verseGraph` gibi) **public URL olarak yayımlanmamıştı** — `Navbar.jsx` taraması (`grep "openVerseGraph\|openConceptGraph"`) tool'ların state-driven overlay olduğunu gösteriyor. External link/SEO equity riski **sadece `?verse=` param için var.**

### 6.2 Redirect implementasyonu

- [ ] `next/next.config.mjs` içine `async redirects()` ekle:
  ```js
  async redirects() {
    return [
      // Eski VerseGraph paylaşım link'leri (sadece bu pattern public'ti)
      {
        source: '/',
        has: [{ type: 'query', key: 'verse', value: '(?<v>.+)' }],
        destination: '/tr/graf/ayet?q=:v',
        permanent: true,
      },
      // Lang query param → locale prefix
      {
        source: '/',
        has: [{ type: 'query', key: 'lang', value: 'en' }],
        destination: '/en',
        permanent: true,
      },
      // index.html legacy
      { source: '/index.html', destination: '/tr', permanent: true },
    ];
  }
  ```
- [ ] Eski hash routes — Vite'ta section anchor'lar (`#section-math`) vardı; Next.js'te aynı slug'la korunduysa redirect gerekmez (anchor browser-side resolves)
  - Audit: `grep -rn 'id="[a-z-]*"' src/sections/ | head -20` → ana section ID'leri listele
  - Yeni `src/sections/` içindeki ID'leri karşılaştır — drift yoksa pass
- [ ] Locale-less root (`qurancodex.com/oku/1` gibi prefix-siz path) — middleware handles, redirect gerekmez
- [ ] Test her redirect curl ile (max 5 hop):
  - `curl -ILv "https://qurancodex.com/?verse=2:255" 2>&1 | grep -E "Location|HTTP/"`
  - Beklenen: 308/301 → `/tr/graf/ayet?q=2:255` → 200
- [ ] Tüm redirect'ler **301 permanent** (SEO equity transfer için)

**Komutlar:**
```bash
curl -ILv "https://qurancodex.com/?verse=2:255" 2>&1 | grep -E "Location|HTTP/"
curl -ILv "https://qurancodex.com/?lang=en" 2>&1 | grep -E "Location|HTTP/"
curl -ILv "https://qurancodex.com/index.html" 2>&1 | grep -E "Location|HTTP/"
```

---

## 7. Search Console & SEO (Post-Cutover)

Sitemap, URL inspection, hreflang, coverage monitoring.

- [ ] **Google Search Console**:
  - Yeni property add (aynı domain, ama Vercel deploy sonrası canonical değişti)
  - Ownership verify: HTML file upload (`public/google<hash>.html`) veya DNS TXT
  - Sitemap submit: `https://qurancodex.com/sitemap.xml`
- [ ] URL Inspection — kritik 10 URL:
  - `/tr` (home), `/en`
  - 3 sure: `/tr/oku/1`, `/tr/oku/2`, `/tr/oku/36`
  - 5 tool: `/tr/graf/ayet`, `/tr/atlas/kissa`, `/tr/arac/wow`, `/tr/arac/dualar`, `/tr/atlas/peygamber`
  - Beklenen: "URL is on Google" + Canonical URL doğru + Mobile usability OK
- [ ] **Bing Webmaster Tools**:
  - `https://www.bing.com/webmasters` → site ekle
  - Sitemap submit
- [ ] Move/Change tool: **GEREKLİ DEĞİL** (aynı domain, sadece infra değişti)
- [ ] hreflang validation:
  - Search Console → International Targeting → Languages
  - Beklenen: TR + EN tagged, `x-default = tr`, 0 errors
- [ ] Coverage report monitor (post-cutover 1 hafta):
  - Search Console → Indexing → Pages
  - Crawl errors, 404 spike, soft 404 — sıfır olmalı
  - Eski Vite URL'leri "Redirect" kategorisinde görünmeli (301 başarı)
- [ ] Analytics consistency:
  - Google Analytics (varsa) yeni domain'de tracking ID aktif
  - Vercel Analytics enable (Vercel dashboard → Analytics → Enable)

**Komutlar:**
```bash
curl https://qurancodex.com/sitemap.xml | grep -c "<url>"   # URL sayısı
curl -s https://qurancodex.com/tr | grep -oE 'hreflang="[a-z-]+"'
curl -s https://qurancodex.com/tr | grep -A1 'type="application/ld+json"' | head -20
```

---

## 8. Monitoring (Post-Cutover)

Web Vitals, error tracking, uptime, CrUX.

- [ ] **Vercel Analytics** açık:
  - Web Vitals: LCP, INP, CLS gerçek kullanıcı ölçümü
  - Hedef: LCP < 2.5s (P75), INP < 200ms (P75), CLS < 0.1 (P75)
- [ ] **Sentry** (opsiyonel, ücretsiz tier 5K event/ay):
  - `npm i @sentry/nextjs` (henüz eklenmediyse — env-check sonrası)
  - DSN env var: `NEXT_PUBLIC_SENTRY_DSN`
  - Source maps upload Vercel build hook ile
- [ ] **Uptime monitoring**:
  - UptimeRobot ücretsiz: 5dk interval, 50 monitor
  - Monitor edilecek URL'ler: `/tr`, `/en`, `/api/meal/diyanet/1`, `/sitemap.xml`
  - Alert: email + (opsiyonel) Slack
- [ ] **CrUX Dashboard**:
  - `https://crux-compare.web.app/` → `qurancodex.com` ekle
  - 28-day rolling window — gerçek kullanıcı performans trend'i
- [ ] **Vercel deploy alerts**:
  - Vercel dashboard → Settings → Notifications → Failed deploys email/Slack
- [ ] Edge function quota monitor:
  - Vercel dashboard → Usage → Function Invocations
  - Free tier: 100k/ay (api/meal proxy ~24h cache → düşük)

**Komutlar:**
```bash
curl -w "@-" -o /dev/null -s https://qurancodex.com/tr <<'EOF'
time_namelookup:  %{time_namelookup}\ntime_connect:  %{time_connect}\ntime_appconnect:  %{time_appconnect}\ntime_starttransfer:  %{time_starttransfer}\ntime_total:  %{time_total}\n
EOF
```

---

## 9. Rollback Plan

Cutover sonrası kötü çıkarsa Vite'a geri dön.

- [ ] **Vite SPA 30 gün canlı**: `legacy.qurancodex.com` subdomain'i T+30'a kadar çalışır kalır
- [ ] **DNS rollback prosedürü**:
  1. DNS provider'da apex A record geri eski IP'ye: `qurancodex.com A <eski-host-IP>`
  2. `www` CNAME geri eski host'a
  3. TTL 60s olduğu için propagation ~1 dk (T-1'de TTL düşürüldü)
  4. `dig qurancodex.com A +short` ile doğrula
- [ ] **Rollback trigger kriterleri** (cutover'dan sonra ilk 24h):
  - Error rate > 5% (Vercel function errors veya 5xx)
  - P95 LCP > 4s (Vercel Analytics / CrUX)
  - Organic traffic drop > 30% (Search Console / Analytics, 24h baseline)
  - Critical page (`/`, `/tr/oku/<N>`) 500 error
- [ ] **Rollback iletişim**:
  - Stakeholder bilgilendirme template hazır (email + Slack)
  - Decision authority: kullanıcı (proje sahibi)
- [ ] **Search Console rollback**:
  - Sitemap rollback (eski Vite sitemap submit)
  - URL Inspection ile 5 örnek URL re-index isteği
- [ ] **Post-rollback root cause analysis**:
  - Faz 10 retrospective `tasks/lessons.md`'ye yaz
  - Next.js fix → preview validation tekrar → yeni cutover tarihi

**Komutlar:**
```bash
# Rollback: DNS provider'da A record geri çevir, ardından:
dig qurancodex.com A +short    # eski IP dönmeli
curl -I https://qurancodex.com # eski Vite app dönmeli
dig qurancodex.com A +trace    # propagation path
```

---

## 10. Post-Cutover Cleanup (T+30 gün)

Stabilite onayı sonrası legacy temizliği.

- [ ] **Stabilite check** (T+30 gün):
  - 30 gün error rate < 1%, LCP P75 < 2.5s, traffic baseline'a dönmüş
  - Search Console coverage report → "Indexed" sayısı eski seviye veya üstü
- [ ] **Faz 11.1 Vite legacy archive**:
  - Referans: `docs/migration-cutover/vite-legacy-archive.md` (Faz 11'de oluşturulacak)
  - Repo'da `legacy-vite-snapshot` tag oluştur: `git tag legacy-vite-final-2026 && git push --tags`
  - `legacy.qurancodex.com` DNS kaldır (subdomain de-provision)
  - Eski host kontrat / hosting sonlandır
- [ ] **Vercel env var audit**:
  - Vercel dashboard → Settings → Environment Variables
  - Kullanılmayan / migration sürecinde eklenen test env'leri sil
  - `vercel env ls` çıktısı `.env.example`'la birebir
- [ ] **DNS TTL geri 3600s**:
  - Apex A record TTL: 60s → 3600s (stabil durumda gereksiz hızlı propagation kaynak yiyor)
  - `dig qurancodex.com SOA | grep -i ttl` ile doğrula
- [ ] **Faz 11.3 `tasks/lessons.md` update**:
  - Cutover sırasında karşılaşılan sorunlar
  - Çalışan pattern'lar
  - Bir sonraki major migration için takeaways
- [ ] **Vite repo branch cleanup**:
  - `migration-to-next.js` branch'i `main`'e merge (PR + review)
  - Stale feature branch'leri prune: `git branch --merged main | grep -v main | xargs -n1 git branch -d`
- [ ] **Monitoring dashboard final review**:
  - Vercel Analytics, Search Console, CrUX karşılaştırma snapshot al
  - Cutover öncesi vs sonrası metric tablosu (LCP, INP, CLS, organic CTR, bounce rate)

**Komutlar:**
```bash
git tag legacy-vite-final-2026
git push --tags
vercel env ls
dig qurancodex.com SOA | grep -i ttl
git branch --merged main | grep -v "main\|migration-to-next.js"
```

---

## Önemli Notlar

- **Vercel free tier:** 100GB bandwidth + ~100k function invocations/ay. QuranCodex tahminen ilk 6 ay free tier yeterli; ölçüm sonrası Pro (~$20/ay) yükseltme.
- **Edge function (api/meal):** 24h `revalidate` + Cache-Control header → invocation maliyeti düşük, çoğunlukla cache HIT.
- **KFGQPC font ~600KB:** Vercel CDN gzip ile ~300KB serve eder. `Cache-Control: s-maxage=31536000, immutable` (Vercel default).
- **Static asset cache:** Vercel `_next/static/*` için 1 yıl immutable cache otomatik.
- **Middleware bundle limit:** 1MB. Mevcut locale routing minimal (~5KB) — sorun yok.
- **Apostrophe encoding:** `generateMetadata` string'lerinde "Kur'an" → çift tırnak zorunlu (bkz. §16.3 Faz 7.2 bug).
- **SSG count:** `next build` çıktısı 228 sure HTML + 39 tool sayfası × 2 locale = ~534 static page. Build süresi ~3-5dk.

---

## Hızlı Komut Referansı

```bash
# DNS
dig qurancodex.com A +short
dig qurancodex.com SOA | grep -i ttl
dig @8.8.8.8 qurancodex.com A +short
dig @1.1.1.1 qurancodex.com A +short

# Cert
openssl s_client -connect qurancodex.com:443 -servername qurancodex.com < /dev/null 2>&1 | grep -E "subject|issuer|verify|expire"

# Vercel
vercel                      # interactive preview
vercel --prod               # production deploy
vercel logs <deployment-url>
vercel inspect <deployment-url> --logs
vercel env ls

# HTTP smoke
curl -I https://qurancodex.com
curl -ILv "https://qurancodex.com/?verse=2:255" 2>&1 | grep -E "Location|HTTP/"
curl https://qurancodex.com/sitemap.xml | grep -c "<url>"
curl -I https://qurancodex.com/tr | grep -i "vercel-cache\|content-type"

# Build / lint
cd /Users/serdar/dev/00_dev_PROJECTS/01_qurancodex/next
npm run build
npm run lint
ls -lh .next/static/chunks/ | sort -k5 -h | tail -10
```

---

**Cutover gününde her bölümün checkbox'ları işlendi mi tekrar tara. Bir adım atlanırsa rollback maliyeti artar.**
