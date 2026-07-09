# İbadetler Mimarisi — V0 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** V0 kapsamında (~8 gün) deploy-edilebilir MVP: HUB + Namaz full + Zekât full + Kurban light + build script + schema + shared layout + nav entegrasyon.

**Architecture:** Next.js 16 App Router — 4 route (HUB + 3 pillar), 4 JSON data dosyası, 6-8 yeni component, 1 build script. Spec: `docs/superpowers/specs/2026-07-09-ibadetler-mimarisi-design.md`.

**Tech Stack:** Next.js 16 (App Router), React 19, framer-motion, tokens.js pattern, KFGQPC/Playfair/Inter fonts, verse-graph-bgem3.json canonical Arabic source.

**Design decision references (spec):**
- §3.2 — 7 tab yapı + visibleTabs + URL query param + Hac/Kurban Tab 4 varyantı
- §4.1 — SemanticMap SAF CSS+SVG (D3 YOK)
- §5.1 — Claim taxonomy inline + top-level `claims[]` SSoT
- §5.2 — Namaz pilot JSON şeması (birebir uygulanır)
- §6.2 — Citation ayet-bazlı, cilt/sayfa YASAK
- §6.3 — Kur'aniyyun kalkanı; yasak/zorunlu ifadeler
- §13.15 — Arapça normalize (§13.15 build script inline kopya)
- §13.17-21 — ToolHeader / Cinematic Hero / Sticky Tab Bar / CrossToolCTA / SourcesCitation

**V0 Fazlar:**
- Faz 1 (Task 1-3): Build script + schema + Namaz taslak paralel
- Faz 2 (Task 4-6): Shared pillar layout + Namaz pilot
- Faz 3 (Task 7-8): Zekât pilot
- Faz 4 (Task 9-11): HUB layout
- Faz 5 (Task 12-13): Kurban light
- Faz 6 (Task 14-15): Polish + nav entegrasyon + mobile

---

## Task 1: Build Script İskeleti

**Files:**
- Create: `next/scripts/build-ibadetler.mjs`
- Create: `next/scripts/lib/arabic-normalize.mjs` (§13.15 inline kopya, reusable)

- [ ] **Step 1.1: `arabic-normalize.mjs` — §13.15 inline kopya**

Create `next/scripts/lib/arabic-normalize.mjs`:

```js
// §13.15 Arabic normalize — build-time script kopyası (ES module).
// Runtime cleanArabic() ile birebir aynı algoritma.
export function cleanArabicForDisplay(str) {
  if (!str) return str;
  return str
    .replace(/۪/g, 'ِ')                       // U+06EA → U+0650 (KRİTİK — daire fix)
    .replace(/ۡ/g, 'ْ')                       // U+06E1 → U+0652 (Uthmani sukun)
    .replace(/[ً-ْ]ٓ/gu, 'ٓ')                  // §13.14 maddah fix
    .replace(/ٱ/g, 'ا')                       // U+0671 → U+0627 (alef wasla)
    .replace(/ی/g, 'ي')                       // Farsi yeh → Arabic yeh
    .replace(/[ؐ-ؔؖؗ]/g, '')                    // İslami kısaltma işaretleri
    .replace(/[؀-؅]/g, '')                       // Numara/dipnot
    .replace(/[۝۞۩]/g, '')                     // Ayet sonu, rub el hizb, secde
    .replace(/ۦ/g, ' ')                        // small yeh → boşluk
    .replace(/[ۖ-ۜۢۨ]/g, '')                  // Waqf + dekoratif tajwid
    .replace(/[﴾﴿]/g, '');                     // Süslü parantezler
}
```

- [ ] **Step 1.2: `build-ibadetler.mjs` iskelet — CLI + config**

Create `next/scripts/build-ibadetler.mjs`:

```js
#!/usr/bin/env node
// İbadetler build script — pillar JSON validation + Arabic normalize + occurrence count.
// Usage: node scripts/build-ibadetler.mjs [--pillar=namaz] [--strict]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { cleanArabicForDisplay } from './lib/arabic-normalize.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const IBADETLER = path.join(PUBLIC, 'ibadetler');
const VERSE_GRAPH = path.join(PUBLIC, 'verse-graph-bgem3.json');

const args = new Map(process.argv.slice(2).map(a => {
  const [k, v] = a.replace(/^--/, '').split('=');
  return [k, v ?? true];
}));
const targetPillar = args.get('pillar');
const strict = args.get('strict');

console.log(`[build-ibadetler] pillar=${targetPillar ?? 'all'} strict=${!!strict}`);

// TODO Step 1.3: load verse-graph
// TODO Step 1.4: validate + normalize pillar
// TODO Step 1.5: occurrence count
// TODO Step 1.6: content lint
// TODO Step 1.7: write output

console.log('[build-ibadetler] iskelet OK');
```

- [ ] **Step 1.3: Verse graph loader + reference resolver**

Add to `build-ibadetler.mjs`:

```js
const verseGraph = JSON.parse(fs.readFileSync(VERSE_GRAPH, 'utf-8'));
const versesById = new Map();
for (const v of (verseGraph.verses ?? verseGraph.ayetler ?? [])) {
  const id = `${v.surah ?? v.sure}:${v.ayah ?? v.ayet}`;
  versesById.set(id, v);
}
console.log(`[verse-graph] loaded ${versesById.size} verses`);

function parseRef(ref) {
  // "Bakara 2:238" → { surah: 2, ayah: 238 }
  // "İsra 17:78-80" → { surah: 17, ayahStart: 78, ayahEnd: 80 }
  const m = ref.match(/(\d+):(\d+)(?:-(\d+))?$/);
  if (!m) return null;
  return {
    surah: Number(m[1]),
    ayah: Number(m[2]),
    ayahEnd: m[3] ? Number(m[3]) : Number(m[2]),
  };
}

function resolveRef(ref) {
  const parsed = parseRef(ref);
  if (!parsed) return { ok: false, error: `parse-fail: ${ref}` };
  const key = `${parsed.surah}:${parsed.ayah}`;
  const verse = versesById.get(key);
  if (!verse) return { ok: false, error: `not-found: ${key}` };
  return { ok: true, verse, parsed };
}
```

- [ ] **Step 1.4: Test — run script, verse-graph load OK**

Run: `cd next && node scripts/build-ibadetler.mjs`

Expected output:
```
[build-ibadetler] pillar=all strict=false
[verse-graph] loaded 6236 verses
[build-ibadetler] iskelet OK
```

- [ ] **Step 1.5: Commit**

```bash
git add next/scripts/build-ibadetler.mjs next/scripts/lib/arabic-normalize.mjs
git commit -m "feat(ibadetler): build script iskeleti + Arabic normalize lib"
```

---

## Task 2: Content Lint — Yasak İfadeler

**Files:**
- Modify: `next/scripts/build-ibadetler.mjs`
- Create: `next/scripts/lib/content-lint.mjs`

- [ ] **Step 2.1: Content lint modülü**

Create `next/scripts/lib/content-lint.mjs`:

```js
// Kur'aniyyun tuzağı — build-fail yasak ifadeler.
// Spec §6.3 + §9 kabul kriteri.
const FORBIDDEN_PATTERNS = [
  /kur['ʼ]?an['ʼ]?da\s+yok\b/i,
  /sonradan\s+eklendi/i,
  /aslında\s+yok/i,
  /sadece\s+fıkıh/i,
  /fıkhî\s+ekleme/i,
];

// Allowlist — güvenli formülasyonlar
const ALLOWED_CONTEXTS = [
  /kur['ʼ]?an['ʼ]?da\s+açıkça\s+yok,\s+sünnet-i\s+mütevâtire\s+ile\s+sabit/i,
  /kur['ʼ]?an['ʼ]?da\s+doğrudan\s+geçmez,\s+.*tafsil/i,
];

export function lintContent(str, path = 'unknown') {
  if (!str || typeof str !== 'string') return [];
  const findings = [];
  for (const pattern of FORBIDDEN_PATTERNS) {
    const match = str.match(pattern);
    if (!match) continue;
    // Allowlist check — güvenli context'te ise geç
    if (ALLOWED_CONTEXTS.some(safe => safe.test(str))) continue;
    findings.push({
      path,
      pattern: pattern.toString(),
      matched: match[0],
      snippet: str.slice(Math.max(0, match.index - 20), match.index + match[0].length + 20),
    });
  }
  return findings;
}

// Recursive object walker — her string field'ı lint'ler
export function lintPillarData(data, pathPrefix = '$') {
  const all = [];
  const walk = (val, path) => {
    if (typeof val === 'string') {
      all.push(...lintContent(val, path));
    } else if (Array.isArray(val)) {
      val.forEach((item, i) => walk(item, `${path}[${i}]`));
    } else if (val && typeof val === 'object') {
      for (const [k, v] of Object.entries(val)) walk(v, `${path}.${k}`);
    }
  };
  walk(data, pathPrefix);
  return all;
}
```

- [ ] **Step 2.2: Build script'e entegre**

Add to `build-ibadetler.mjs` after loader:

```js
import { lintPillarData } from './lib/content-lint.mjs';

function validatePillar(pillarPath) {
  const raw = JSON.parse(fs.readFileSync(pillarPath, 'utf-8'));
  const findings = lintPillarData(raw, `$.${raw.id}`);
  if (findings.length) {
    console.error(`[content-lint] FAIL — ${findings.length} yasak ifade bulundu:`);
    findings.forEach(f => console.error(`  ${f.path}: "${f.matched}" — ${f.snippet}...`));
    if (strict) process.exit(1);
  } else {
    console.log(`[content-lint] ${pillarPath}: OK`);
  }
  return { raw, findings };
}
```

- [ ] **Step 2.3: Unit test — hem fail hem pass case**

Create test file inline (or use a scratch): manually create `/tmp/test-pillar.json`:

```json
{ "id": "test", "descTr": "Namaz Kur'an'da yok" }
```

Run: `cd next && node -e "
const {lintPillarData} = await import('./scripts/lib/content-lint.mjs');
const d = require('/tmp/test-pillar.json');
console.log(lintPillarData(d));
"`

Expected: 1 finding, pattern matched.

Then edit test JSON to safe formulation:
```json
{ "id": "test", "descTr": "Kur'an'da açıkça yok, sünnet-i mütevâtire ile sabittir." }
```

Re-run: expected 0 findings.

- [ ] **Step 2.4: Commit**

```bash
git add next/scripts/build-ibadetler.mjs next/scripts/lib/content-lint.mjs
git commit -m "feat(ibadetler): content-lint — Kur'aniyyun tuzağı yasak ifadeler + allowlist"
```

---

## Task 3: Occurrence Count Utility

**Files:**
- Modify: `next/scripts/build-ibadetler.mjs`
- Create: `next/scripts/lib/occurrence-count.mjs`

- [ ] **Step 3.1: Root-based + searchTerms count**

Create `next/scripts/lib/occurrence-count.mjs`:

```js
// Kök tabanlı ve searchTerms tabanlı occurrence sayımı.
// Spec §5.2 — kök vs kelime formu ayrımı şeffaf sunulur.
import { cleanArabicForDisplay } from './arabic-normalize.mjs';

export function countByRoot(verses, root) {
  // root: "ص ل و" formatında (3-4 harf, boşluk ayraç)
  // verse-graph-bgem3 root field'ı kullanır (varsa)
  const rootNorm = root.replace(/\s+/g, '');
  let count = 0;
  const hits = [];
  for (const v of verses) {
    const verseRoots = v.roots ?? []; // verse-graph her ayet için token roots taşır (varsa)
    if (verseRoots.some(r => r.replace(/\s+/g, '') === rootNorm)) {
      count++;
      hits.push({ surah: v.surah, ayah: v.ayah });
    }
  }
  return { value: count, hits };
}

export function countBySearchTerms(verses, searchTerms) {
  // searchTerms: ["الصَّلَاة", "بِالصَّلَاة", ...]
  // Her verse'in Arapça metnini normalize edip substring match.
  let count = 0;
  const hits = [];
  for (const v of verses) {
    const text = cleanArabicForDisplay(v.arabic ?? v.arapca ?? '');
    if (searchTerms.some(t => text.includes(cleanArabicForDisplay(t)))) {
      count++;
      hits.push({ surah: v.surah, ayah: v.ayah });
    }
  }
  return { value: count, hits };
}
```

- [ ] **Step 3.2: Build script'e entegre — occurrenceCount doldur**

Add to `build-ibadetler.mjs`:

```js
import { countByRoot, countBySearchTerms } from './lib/occurrence-count.mjs';

function fillOccurrenceCounts(pillarData) {
  const allVerses = [...versesById.values()];
  for (const term of (pillarData.kuraniIsimler ?? [])) {
    if (!term.occurrenceCount) continue;
    const { method, root, searchTerms } = term.occurrenceCount;
    let result;
    if (method === 'root-based' && root) {
      result = countByRoot(allVerses, root);
    } else if (method === 'search-terms' && searchTerms) {
      result = countBySearchTerms(allVerses, searchTerms);
    } else {
      console.warn(`[occurrence] ${term.term}: geçersiz method`);
      continue;
    }
    term.occurrenceCount.value = result.value;
    term.occurrenceCount.hitsSample = result.hits.slice(0, 5); // ilk 5 örnek
    console.log(`[occurrence] ${term.term} (${method}): ${result.value}`);
  }
}
```

- [ ] **Step 3.3: Commit**

```bash
git add next/scripts/build-ibadetler.mjs next/scripts/lib/occurrence-count.mjs
git commit -m "feat(ibadetler): occurrence count — root-based + searchTerms yöntemleri"
```

---

## Task 4: Namaz İlk Data Taslağı

**Files:**
- Create: `next/public/ibadetler/namaz.json`
- Create: `next/public/ibadetler/` klasörü

- [ ] **Step 4.1: Klasör + iskelet JSON**

```bash
mkdir -p next/public/ibadetler
mkdir -p next/public/ibadetler/audit-report
```

Create `next/public/ibadetler/namaz.json` — spec §5.2'deki tam iskelete göre. Bu taslak — içerik iterative yazılacak. İlk pass sadece STRUCTURAL:

```json
{
  "id": "namaz",
  "titleTr": "Namaz",
  "titleEn": "Prayer",
  "arabicName": "الصَّلَاة",
  "anchorVerse": {
    "surah": 20, "ayah": 14,
    "ar": "",
    "tr": "Şüphesiz ben Allah'ım. Benden başka ilâh yoktur. O halde bana ibadet et ve beni anmak için namaz kıl.",
    "en": "Indeed, I am Allah. There is no deity except Me, so worship Me and establish prayer for My remembrance.",
    "refTr": "Tâhâ 20:14",
    "refEn": "Ṭā-Hā 20:14"
  },
  "hero": {
    "eyebrowTr": "KULLUĞUN AYAKTA DURAN HALİ",
    "eyebrowEn": "WORSHIP IN STANDING FORM",
    "subtitleTr": "Zamana bağlı, kelimelerle şekillenen kulluk.",
    "subtitleEn": "Worship shaped by time and word."
  },
  "claims": [
    {
      "claimId": "namaz-vakit-001",
      "claimTr": "Kur'an namaz vakitlerini belirli zaman dilimleri üzerinden anar",
      "claimEn": "The Qur'an refers to prayer within specific time frames",
      "refs": ["İsra 17:78", "Bakara 2:238", "Hud 11:114"],
      "claimType": "quran_semantic",
      "confidence": "high",
      "framingTr": "Sünnet-i mütevâtire 5 vakit olarak tafsil eder."
    },
    {
      "claimId": "namaz-semantic-alan-001",
      "claimTr": "Namaz Kur'an'da tek isimli değil, 15+ terim etrafında dönen bir semantik alandır",
      "claimEn": "Prayer in the Qur'an is not a single term but a semantic field of 15+ concepts",
      "refs": ["Bakara 2:43", "Tâhâ 20:14", "Mü'minûn 23:9"],
      "claimType": "semantic_inference",
      "confidence": "high"
    }
  ],
  "genelBakis": {
    "introTr": "TODO — 3-4 paragraf",
    "keyPoints": []
  },
  "kuraniIsimler": [
    {
      "term": "Salât",
      "ar": "الصَّلَاة",
      "root": "ص ل و",
      "kategori": "core-name",
      "searchTerms": ["الصَّلَاة", "الصَّلَوَات", "بِالصَّلَاة", "صَلَاتِ", "صَلَوَاتٌ"],
      "occurrenceCount": {
        "method": "root-based",
        "root": "ص ل و",
        "source": "auto — scripts/build-ibadetler.mjs",
        "humanSpotChecked": false,
        "spotCheckNote": "Kök tabanlı sayım vuslat/silâ türevlerini de yakalar; UI'da ~ yaklaşık etiketle sun."
      },
      "anlamKatmanlari": [
        { "layer": "Namaz", "descTr": "Ritüel ibadet", "kaynak": "Râzî, Bakara 43 tefsiri", "claimType": "tafsir_tradition", "confidence": "high" }
      ]
    }
  ],
  "anaPasajlar": {
    "ayetler": [],
    "rituelBaglam": []
  },
  "rakamsalMimari": {
    "titleTr": "Kur'an İlkeyi Koyar, Sünnet Tafsil Eder",
    "framingTr": "Bu bölüm 'Kur'an eksik, fıkıh ekledi' iddiası DEĞİLDİR. Kur'an genel bir çerçeve verir; sünnet-i mütevâtire ve icma bunu detaylandırır. İkisi birbirini tamamlar.",
    "kuraniSide": { "titleTr": "Kur'ân'ın koyduğu ilkeler", "points": [] },
    "sunnetSide": { "titleTr": "Sünnet-i mütevâtirenin tafsili", "points": [] },
    "tensionNote": "Bu tab Kur'aniyyun (mezhepsizlik) söylemine kapı aralamaz. Klasik Ehl-i Sünnet çerçevesi geçerli."
  },
  "peygamberVaryasyonlari": [],
  "icBoyut": [],
  "kaynaklar": []
}
```

- [ ] **Step 4.2: Build script'i çalıştır — validasyon geçsin**

```bash
cd next && node scripts/build-ibadetler.mjs --pillar=namaz
```

Expected: no lint findings, occurrenceCount for Salât dolduruldu.

- [ ] **Step 4.3: Commit taslak**

```bash
git add next/public/ibadetler/namaz.json
git commit -m "feat(ibadetler): Namaz JSON taslak — schema iskelet + Salât seed"
```

---

## Task 5: Design Tokens Extension

**Files:**
- Modify: `next/src/tokens.js`

- [ ] **Step 5.1: İbadetler-specific token'lar**

Add to `next/src/tokens.js`:

```js
// İbadetler Mimarisi — v0 tokens
export const IBADET_CLAIM_TYPE_STYLES = {
  quran_explicit:     { color: '#22d3ee', label: 'Kur\'ân açık', labelEn: 'Qur\'an explicit' },
  quran_semantic:     { color: '#8b5cf6', label: 'Kur\'ân semantik', labelEn: 'Qur\'an semantic' },
  tafsir_tradition:   { color: '#d4a574', label: 'Tefsir/siyer', labelEn: 'Tafsir/sira' },
  fiqh_tafsil:        { color: '#2ecc71', label: 'Fıkhî tafsil', labelEn: 'Fiqh detail' },
  semantic_inference: { color: '#94a3b8', label: 'Semantik çıkarım', labelEn: 'Semantic inference' },
};

export const IBADET_CONFIDENCE_STYLES = {
  high:   { icon: '●●●', opacity: 1.0 },
  medium: { icon: '●●○', opacity: 0.7 },
  low:    { icon: '●○○', opacity: 0.5 },
};
```

- [ ] **Step 5.2: Import test**

Quick import verify:
```bash
cd next && node -e "
import('./src/tokens.js').then(t => console.log(Object.keys(t).filter(k => k.startsWith('IBADET_'))));
"
```

Expected: `['IBADET_CLAIM_TYPE_STYLES', 'IBADET_CONFIDENCE_STYLES']`.

- [ ] **Step 5.3: Commit**

```bash
git add next/src/tokens.js
git commit -m "feat(ibadetler): design tokens — claim type + confidence styles"
```

---

## Task 6: Shared Pillar Layout — IbadetlerPillar.jsx

**Files:**
- Create: `next/src/components/IbadetlerPillar.jsx`

- [ ] **Step 6.1: Tab defs + visibleTabs filter**

Create `next/src/components/IbadetlerPillar.jsx` — component iskeleti:

```jsx
'use client';
import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { COLORS, FONTS, RADIUS, TRANSITION } from '../tokens';
import ToolHeader from './ToolHeader';
import SourcesCitation from './SourcesCitation';

// Tab definitions — visibleTabs filter data'ya göre tab'ı gizler.
const TAB_DEFS = [
  { key: 'genel',       titleTr: 'Genel Bakış',      titleEn: 'Overview',        dataKey: 'genelBakis' },
  { key: 'semantik',    titleTr: 'Semantik Alan',    titleEn: 'Semantic Field',  dataKey: 'kuraniIsimler' },
  { key: 'pasajlar',    titleTr: 'Ana Pasajlar',     titleEn: 'Key Passages',    dataKey: 'anaPasajlar' },
  { key: 'mimari',      titleTr: 'Rakamsal Mimari',  titleEn: 'Numeric Design',  dataKey: 'rakamsalMimari' },
  { key: 'peygamberler', titleTr: 'Peygamberler',    titleEn: 'Prophets',        dataKey: 'peygamberVaryasyonlari' },
  { key: 'icboyut',     titleTr: 'İç Boyut',         titleEn: 'Inner Dimension', dataKey: 'icBoyut' },
  { key: 'kaynaklar',   titleTr: 'Kaynaklar',        titleEn: 'Sources',         dataKey: 'kaynaklar' },
];

function hasContent(pillarData, dataKey) {
  const val = pillarData?.[dataKey];
  if (!val) return false;
  if (Array.isArray(val)) return val.length > 0;
  if (typeof val === 'object') {
    // Nested check: anaPasajlar.ayetler[] veya rakamsalMimari.kuraniSide.points[]
    return Object.values(val).some(v =>
      (Array.isArray(v) && v.length > 0) ||
      (v && typeof v === 'object' && Object.keys(v).length > 0)
    );
  }
  return String(val).trim().length > 0;
}

export default function IbadetlerPillar({ pillarData, language, isMobile }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const visibleTabs = useMemo(
    () => TAB_DEFS.filter(t => hasContent(pillarData, t.dataKey)),
    [pillarData]
  );

  // URL tab fallback (§3.2)
  const requestedTab = searchParams.get('tab');
  const initialTab = visibleTabs.find(t => t.key === requestedTab) ?? visibleTabs[0];
  const [activeTab, setActiveTab] = useState(initialTab?.key);

  // Sync URL when tab changes
  useEffect(() => {
    if (!activeTab) return;
    const currentUrl = searchParams.get('tab');
    if (currentUrl === activeTab) return;
    const params = new URLSearchParams(searchParams);
    params.set('tab', activeTab);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [activeTab, pathname, router, searchParams]);

  // Fallback: invalid ?tab=X → silent redirect to first
  useEffect(() => {
    if (requestedTab && !visibleTabs.find(t => t.key === requestedTab)) {
      const params = new URLSearchParams(searchParams);
      params.delete('tab');
      router.replace(pathname + (params.toString() ? `?${params}` : ''), { scroll: false });
    }
  }, [requestedTab, visibleTabs, pathname, router, searchParams]);

  return (
    <div style={{ background: COLORS.cosmicBlack, minHeight: 'calc(100vh - 62px)', display: 'flex', flexDirection: 'column', paddingTop: '62px' }}>
      <ToolHeader
        titleTr={pillarData.titleTr}
        titleEn={pillarData.titleEn}
        subtitleTr={pillarData.hero?.eyebrowTr}
        subtitleEn={pillarData.hero?.eyebrowEn}
        language={language}
      />
      {/* Cinematic Hero — §13.18 */}
      <PillarHero pillarData={pillarData} language={language} isMobile={isMobile} />

      {/* Sticky Tab Bar — §13.19 */}
      <div id="ibadet-tab-bar" style={{
        display: 'flex', gap: '2px',
        padding: isMobile ? '0 8px' : '0 16px',
        borderBottom: `1px solid ${COLORS.glassBorderSoft}`,
        background: 'rgb(6, 8, 14)',
        backgroundColor: 'rgb(6, 8, 14)',
        isolation: 'isolate',
        position: 'sticky',
        top: '110px',
        zIndex: 20,
        scrollMarginTop: '120px',
        overflowX: 'auto', scrollbarWidth: 'none', flexShrink: 0,
      }}>
        {visibleTabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: isMobile ? '14px 16px' : '16px 26px',
              fontSize: isMobile ? '0.72rem' : '0.78rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              fontWeight: activeTab === tab.key ? 700 : 500,
              color: activeTab === tab.key ? COLORS.gold : COLORS.silver,
              borderBottom: activeTab === tab.key ? `2px solid ${COLORS.gold}` : '2px solid transparent',
              background: activeTab === tab.key ? COLORS.goldAlpha15 : 'transparent',
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: `all ${TRANSITION.fast}`,
            }}
          >
            {language === 'tr' ? tab.titleTr : tab.titleEn}
          </button>
        ))}
      </div>

      {/* Tab body */}
      <div style={{ flex: 1, minHeight: 0, padding: isMobile ? '20px 16px' : '32px 48px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        {activeTab && <PillarTabBody tabKey={activeTab} pillarData={pillarData} language={language} isMobile={isMobile} />}
      </div>
    </div>
  );
}

function PillarHero({ pillarData, language, isMobile }) {
  // §13.18 Cinematic Hero pattern
  return (
    <div style={{ padding: isMobile ? '40px 16px 28px' : '56px 32px 36px', background: 'linear-gradient(180deg, rgba(212,165,116,0.06) 0%, transparent 100%)', borderBottom: `1px solid ${COLORS.glassBorderSoft}`, textAlign: 'center' }}>
      {/* Bismillah */}
      <div style={{ fontFamily: FONTS.arabic ?? "'Amiri Quran', serif", fontSize: '1.6rem', color: COLORS.gold, opacity: 0.82, marginBottom: '24px' }}>﷽</div>
      {/* Anchor verse */}
      <div style={{ fontFamily: FONTS.quran, fontSize: 'clamp(1.4rem, 3vw, 2rem)', color: COLORS.gold, lineHeight: 2.1, marginBottom: '20px', direction: 'rtl' }} lang="ar" dir="rtl">
        {pillarData.anchorVerse?.ar}
      </div>
      <p style={{ fontFamily: FONTS.display, fontStyle: 'italic', color: COLORS.offWhite, maxWidth: '660px', margin: '0 auto 12px', fontSize: 'clamp(1rem, 1.8vw, 1.15rem)' }}>
        "{language === 'tr' ? pillarData.anchorVerse?.tr : pillarData.anchorVerse?.en}"
      </p>
      <p style={{ textTransform: 'uppercase', letterSpacing: '0.16em', color: COLORS.silver, opacity: 0.65, fontSize: '0.75rem', marginBottom: '32px' }}>
        — {language === 'tr' ? pillarData.anchorVerse?.refTr : pillarData.anchorVerse?.refEn}
      </p>
      {/* Filigree */}
      <div style={{ width: '120px', height: '1px', background: `linear-gradient(90deg, transparent, ${COLORS.gold}, transparent)`, margin: '0 auto 24px' }} />
      {/* Eyebrow */}
      <p style={{ textTransform: 'uppercase', letterSpacing: '0.3em', color: COLORS.gold, opacity: 0.72, fontSize: '0.72rem', marginBottom: '12px' }}>
        {language === 'tr' ? pillarData.hero?.eyebrowTr : pillarData.hero?.eyebrowEn}
      </p>
      {/* H1 */}
      <h1 style={{ fontFamily: FONTS.display, color: COLORS.offWhite, fontSize: isMobile ? 'clamp(1.6rem, 7vw, 2rem)' : 'clamp(2rem, 3.6vw, 2.7rem)', margin: '0 0 12px' }}>
        {language === 'tr' ? pillarData.titleTr : pillarData.titleEn}
      </h1>
      {/* Subtitle */}
      <p style={{ fontFamily: FONTS.display, fontStyle: 'italic', color: COLORS.gold, fontSize: 'clamp(1.05rem, 1.8vw, 1.18rem)' }}>
        {language === 'tr' ? pillarData.hero?.subtitleTr : pillarData.hero?.subtitleEn}
      </p>
    </div>
  );
}

function PillarTabBody({ tabKey, pillarData, language, isMobile }) {
  // Individual tab renderers — Task 7'de doldurulacak.
  return <div style={{ color: COLORS.silver, fontFamily: FONTS.body }}>Tab: {tabKey} (WIP)</div>;
}
```

- [ ] **Step 6.2: Commit iskelet**

```bash
git add next/src/components/IbadetlerPillar.jsx
git commit -m "feat(ibadetler): IbadetlerPillar shared layout — 7 tab + visibleTabs + URL param"
```

---

## Task 7: Tab Body Component'ları (6 tab renderer)

**Files:**
- Modify: `next/src/components/IbadetlerPillar.jsx`

- [ ] **Step 7.1: Tab 1 — Genel Bakış renderer**

Replace `PillarTabBody` in `IbadetlerPillar.jsx` with dispatcher + individual renderers:

```jsx
function PillarTabBody({ tabKey, pillarData, language, isMobile }) {
  switch (tabKey) {
    case 'genel':        return <TabGenel data={pillarData.genelBakis} language={language} isMobile={isMobile} />;
    case 'semantik':     return <TabSemantik data={pillarData.kuraniIsimler} language={language} isMobile={isMobile} />;
    case 'pasajlar':     return <TabPasajlar data={pillarData.anaPasajlar} language={language} isMobile={isMobile} />;
    case 'mimari':       return <TabMimari data={pillarData.rakamsalMimari} language={language} isMobile={isMobile} />;
    case 'peygamberler': return <TabPeygamberler data={pillarData.peygamberVaryasyonlari} language={language} isMobile={isMobile} />;
    case 'icboyut':      return <TabIcBoyut data={pillarData.icBoyut} language={language} isMobile={isMobile} />;
    case 'kaynaklar':    return <SourcesCitation language={language} isMobile={isMobile} sources={pillarData.kaynaklar} />;
    default:             return null;
  }
}

function TabGenel({ data, language, isMobile }) {
  if (!data) return null;
  return (
    <div style={{ maxWidth: '780px', margin: '0 auto' }}>
      <p style={{ fontFamily: FONTS.body, color: COLORS.offWhite, fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '32px' }}>
        {language === 'tr' ? data.introTr : data.introEn}
      </p>
      <div style={{ display: 'grid', gap: '16px' }}>
        {(data.keyPoints ?? []).map((kp, i) => (
          <div key={i} style={{ padding: '20px 24px', border: `1px solid ${COLORS.glassBorderSoft}`, borderRadius: RADIUS.md, background: 'rgba(255,255,255,0.03)' }}>
            <h3 style={{ color: COLORS.gold, fontFamily: FONTS.display, fontSize: '1.05rem', margin: '0 0 8px' }}>
              {language === 'tr' ? kp.titleTr : kp.titleEn}
            </h3>
            <p style={{ color: COLORS.silver, margin: 0, fontSize: '0.95rem', lineHeight: 1.7 }}>
              {language === 'tr' ? kp.descTr : kp.descEn}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 7.2: Tab 2 — Semantik Alan + inline SemanticMap**

Add to `IbadetlerPillar.jsx`:

```jsx
function TabSemantik({ data, language, isMobile }) {
  if (!data?.length) return null;
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        {data.map((term, i) => (
          <SemanticTermCard key={i} term={term} language={language} isMobile={isMobile} />
        ))}
      </div>
    </div>
  );
}

function SemanticTermCard({ term, language, isMobile }) {
  return (
    <div style={{ padding: '24px', border: `1px solid ${COLORS.goldAlpha25}`, borderRadius: RADIUS.md, background: 'rgba(212,165,116,0.03)' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '16px' }}>
        <h3 style={{ fontFamily: FONTS.quran, fontSize: '1.8rem', color: COLORS.gold, margin: 0, direction: 'rtl' }} lang="ar">{term.ar}</h3>
        <span style={{ fontFamily: FONTS.display, color: COLORS.offWhite, fontSize: '1.1rem' }}>{term.term}</span>
        {term.root && <span style={{ fontFamily: FONTS.body, color: COLORS.silver, fontSize: '0.75rem', letterSpacing: '0.1em' }}>({term.root})</span>}
      </div>
      {term.occurrenceCount?.value != null && (
        <p style={{ color: COLORS.silver, fontSize: '0.78rem', margin: '0 0 16px', fontStyle: 'italic' }}>
          {language === 'tr' ? term.occurrenceCount.displayLabelTr : term.occurrenceCount.displayLabelEn}
        </p>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {(term.anlamKatmanlari ?? []).map((k, i) => (
          <div key={i} style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.03)', borderLeft: `2px solid ${COLORS.gold}`, borderRadius: '4px' }}>
            <div style={{ color: COLORS.gold, fontWeight: 600, fontSize: '0.9rem', marginBottom: '2px' }}>{k.layer}</div>
            <div style={{ color: COLORS.offWhite, fontSize: '0.88rem', lineHeight: 1.6 }}>{language === 'tr' ? k.descTr : k.descEn}</div>
            {k.kaynak && <div style={{ color: COLORS.silver, fontSize: '0.72rem', fontStyle: 'italic', marginTop: '4px' }}>— {k.kaynak}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 7.3: Tab 3 — Ana Pasajlar (ayetler + rituelBaglam)**

Add to `IbadetlerPillar.jsx`:

```jsx
function TabPasajlar({ data, language, isMobile }) {
  if (!data) return null;
  const { ayetler = [], rituelBaglam = [] } = data;
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {ayetler.length > 0 && (
        <div style={{ marginBottom: rituelBaglam.length ? '48px' : 0 }}>
          <h3 style={{ textTransform: 'uppercase', letterSpacing: '0.2em', color: COLORS.gold, opacity: 0.8, fontSize: '0.72rem', marginBottom: '20px' }}>
            {language === 'tr' ? 'Ana Ayetler' : 'Key Verses'}
          </h3>
          <div style={{ display: 'grid', gap: '20px' }}>
            {ayetler.map((a, i) => <VerseCard key={i} ayah={a} language={language} isMobile={isMobile} />)}
          </div>
        </div>
      )}
      {rituelBaglam.length > 0 && (
        <div>
          <h3 style={{ textTransform: 'uppercase', letterSpacing: '0.2em', color: COLORS.gold, opacity: 0.8, fontSize: '0.72rem', marginBottom: '20px' }}>
            {language === 'tr' ? 'Ritüel Bağlam' : 'Ritual Context'}
          </h3>
          <div style={{ display: 'grid', gap: '20px' }}>
            {rituelBaglam.map((r, i) => <VerseCard key={i} ayah={r} language={language} isMobile={isMobile} />)}
          </div>
        </div>
      )}
    </div>
  );
}

function VerseCard({ ayah, language, isMobile }) {
  return (
    <div style={{ padding: '24px', border: `1px solid ${COLORS.glassBorderSoft}`, borderRadius: RADIUS.md, background: 'rgba(255,255,255,0.02)' }}>
      <div style={{ fontFamily: FONTS.quran, fontSize: '1.4rem', color: COLORS.gold, lineHeight: 2.1, marginBottom: '12px', direction: 'rtl', textAlign: 'right' }} lang="ar">
        {ayah.ar}
      </div>
      <p style={{ color: COLORS.offWhite, fontSize: '0.95rem', lineHeight: 1.7, margin: '0 0 8px', fontStyle: 'italic' }}>
        "{language === 'tr' ? ayah.tr : ayah.en}"
      </p>
      <div style={{ color: COLORS.silver, fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: ayah.not ? '12px' : 0 }}>
        — {ayah.ref}
      </div>
      {(ayah.not || ayah.sceneTr) && (
        <div style={{ padding: '10px 12px', background: 'rgba(212,165,116,0.06)', borderLeft: `2px solid ${COLORS.gold}`, marginTop: '12px' }}>
          <p style={{ color: COLORS.offWhite, fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>
            {ayah.not ?? ayah.sceneTr}
          </p>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 7.4: Tab 4-6 renderer'ları (kısa versiyon — polish sonra)**

Add to `IbadetlerPillar.jsx`:

```jsx
function TabMimari({ data, language, isMobile }) {
  if (!data) return null;
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ padding: '20px', background: 'rgba(212,165,116,0.06)', borderLeft: `3px solid ${COLORS.gold}`, borderRadius: '4px', marginBottom: '32px' }}>
        <p style={{ color: COLORS.offWhite, margin: 0, lineHeight: 1.7, fontStyle: 'italic' }}>{data.framingTr}</p>
      </div>
      <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr' }}>
        <SidePanel side={data.kuraniSide} language={language} accent={COLORS.gold} />
        <SidePanel side={data.sunnetSide} language={language} accent={COLORS.emerald ?? '#2ecc71'} />
      </div>
      {data.tensionNote && (
        <div style={{ marginTop: '32px', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: RADIUS.md, color: COLORS.silver, fontSize: '0.88rem', lineHeight: 1.7 }}>
          {data.tensionNote}
        </div>
      )}
    </div>
  );
}

function SidePanel({ side, language, accent }) {
  return (
    <div style={{ padding: '20px', border: `1px solid ${accent}44`, borderRadius: RADIUS.md, background: 'rgba(255,255,255,0.02)' }}>
      <h4 style={{ color: accent, fontFamily: FONTS.display, fontSize: '1.05rem', marginTop: 0 }}>{side.titleTr}</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {(side.points ?? []).map((p, i) => (
          <div key={i} style={{ padding: '10px 12px', background: 'rgba(0,0,0,0.15)', borderRadius: '4px' }}>
            <div style={{ color: accent, fontSize: '0.82rem', fontWeight: 600 }}>{p.label}</div>
            <div style={{ color: COLORS.offWhite, fontSize: '0.95rem', marginTop: '4px' }}>{p.value}</div>
            {p.note && <div style={{ color: COLORS.silver, fontSize: '0.8rem', marginTop: '6px', lineHeight: 1.6 }}>{p.note}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

function TabPeygamberler({ data, language, isMobile }) {
  if (!data?.length) return null;
  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ position: 'relative', paddingLeft: '32px' }}>
        <div style={{ position: 'absolute', left: '12px', top: '10px', bottom: '10px', width: '2px', background: `linear-gradient(180deg, ${COLORS.gold}, ${COLORS.gold}22)` }} />
        {data.map((p, i) => (
          <div key={i} style={{ position: 'relative', marginBottom: '24px' }}>
            <div style={{ position: 'absolute', left: '-32px', top: '2px', width: '26px', height: '26px', borderRadius: '50%', background: COLORS.gold, color: COLORS.cosmicBlack, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.72rem' }}>{i + 1}</div>
            <div style={{ padding: '14px 18px', background: 'rgba(255,255,255,0.03)', border: `1px solid ${COLORS.glassBorderSoft}`, borderRadius: RADIUS.md }}>
              <div style={{ color: COLORS.gold, fontWeight: 700, marginBottom: '4px' }}>{p.prophet}</div>
              <div style={{ color: COLORS.silver, fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>{p.ref}</div>
              <div style={{ color: COLORS.offWhite, fontSize: '0.92rem', lineHeight: 1.7 }}>{p.sceneTr}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TabIcBoyut({ data, language, isMobile }) {
  if (!data?.length) return null;
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gap: '16px', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))' }}>
      {data.map((item, i) => (
        <div key={i} style={{ padding: '20px', background: 'rgba(212,165,116,0.04)', border: `1px solid ${COLORS.goldAlpha25}`, borderRadius: RADIUS.md }}>
          <h4 style={{ color: COLORS.gold, fontFamily: FONTS.display, fontSize: '1rem', margin: '0 0 8px' }}>{item.titleTr}</h4>
          {item.refs && <div style={{ color: COLORS.silver, fontSize: '0.72rem', letterSpacing: '0.1em', marginBottom: '10px' }}>{item.refs.join(' · ')}</div>}
          <p style={{ color: COLORS.offWhite, fontSize: '0.9rem', lineHeight: 1.7, margin: 0 }}>{item.descTr}</p>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 7.5: Commit tab renderer'ları**

```bash
git add next/src/components/IbadetlerPillar.jsx
git commit -m "feat(ibadetler): 6 tab renderer (Genel/Semantik/Pasajlar/Mimari/Peygamberler/İçBoyut)"
```

---

## Task 8: Namaz Route + İlk Deploy Test

**Files:**
- Create: `next/src/app/[locale]/atlas/ibadetler/namaz/page.js`
- Create: `next/src/app/[locale]/atlas/ibadetler/namaz/NamazRoute.jsx`

- [ ] **Step 8.1: Route wrapper — NamazRoute.jsx**

Create `next/src/app/[locale]/atlas/ibadetler/namaz/NamazRoute.jsx`:

```jsx
'use client';
import { useState, useEffect } from 'react';
import IbadetlerPillar from '@/components/IbadetlerPillar';
import { useLanguage } from '@/i18n/LanguageContext';

export default function NamazRoute() {
  const { language } = useLanguage();
  const [pillarData, setPillarData] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 640);
    const h = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', h);
    fetch('/ibadetler/namaz.json').then(r => r.json()).then(setPillarData);
    return () => window.removeEventListener('resize', h);
  }, []);

  if (!pillarData) return null;
  return <IbadetlerPillar pillarData={pillarData} language={language} isMobile={isMobile} />;
}
```

- [ ] **Step 8.2: page.js — SEO + JsonLd + PageHeading**

Create `next/src/app/[locale]/atlas/ibadetler/namaz/page.js`:

```js
import { pageMetadata } from '@/lib/seo';
import { buildBreadcrumb, buildLearningResource } from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import PageHeading from '@/components/PageHeading';
import NamazRoute from './NamazRoute';

const PATH  = '/atlas/ibadetler/namaz';
const TITLE = "Namaz — Kur'ân'ın Kendi Diliyle";
const DESC  = "Namazın Kur'ânî semantik alanı, vakit mimarisi, peygamber varyasyonları ve iç boyutu. 15+ terim, 8+ ayet pasajı, klasik tefsir kaynakları.";

export async function generateMetadata({ params }) {
  return pageMetadata({ params, path: PATH, title: TITLE, description: DESC });
}

export default async function Page({ params }) {
  const { locale } = await params;
  return (
    <>
      <JsonLd schemas={[
        buildBreadcrumb(locale, PATH),
        buildLearningResource({ locale, path: PATH, title: TITLE, description: DESC }),
      ]} />
      <PageHeading title={TITLE} description={DESC} />
      <NamazRoute />
    </>
  );
}
```

- [ ] **Step 8.3: Dev'de test**

```bash
cd next && curl -sI http://localhost:3000/tr/atlas/ibadetler/namaz | head -3
```

Expected: 200 OK. Browser'da `http://localhost:3000/tr/atlas/ibadetler/namaz` — Namaz sayfası render eder (data seed'i olduğu için sadece Salât + iskelet görünür).

- [ ] **Step 8.4: Commit**

```bash
git add next/src/app/[locale]/atlas/ibadetler/namaz/
git commit -m "feat(ibadetler): Namaz route — page.js + NamazRoute.jsx"
```

---

## Task 9: Namaz Data Full — İçerik Yazımı

Bu task içerik yazımı — code yerine data.

**Files:**
- Modify: `next/public/ibadetler/namaz.json`

- [ ] **Step 9.1: `kuraniIsimler` full 15+ terim**

Elle spec §5.2 örneğinden başlayarak tam listeyi doldur. Her terim için:
- `term`, `ar`, `root`, `kategori`
- `searchTerms[]` (build script sayabilsin)
- `occurrenceCount.method`, `.root` veya `.searchTerms` seçimi
- `anlamKatmanlari[]` — her katman + `claimType` + `confidence`

Terimler: Salât, Dhikr, Tesbîh, Sücûd, Rükû', Kıyâm, Kunût, Fecr, Duhâ, Zevâl, Asr, Mağrib, İşâ, Vitir, Huşû.

- [ ] **Step 9.2: `anaPasajlar.ayetler` — 8 ana ayet**

Spec §5.2 örneğindeki 8 ayetin tam data'sını doldur. Her ayet için:
- `ref`, `not` (tefsir citation ayet-bazlı — §6.2), `claimType`, `confidence`
- `ar`/`tr`/`en` alanları BOŞ bırak — build script `verse-graph-bgem3.json`'dan enjekte edecek

- [ ] **Step 9.3: `anaPasajlar.rituelBaglam` — 2 kayıt**

- Bakara 2:142-150 kıble değişimi
- Nisa 4:101-103 havf namazı

- [ ] **Step 9.4: `rakamsalMimari` — Kur'an ↔ Sünnet 3+3 point**

Spec §5.2 örneği birebir. `kuraniSide.points[]` + `sunnetSide.points[]` her biri 3 point + framing.

- [ ] **Step 9.5: `peygamberVaryasyonlari` — 7 peygamber**

- [ ] **Step 9.6: `icBoyut` — 7 item (İsra/mi'rac arketip audit guard dahil)**

- [ ] **Step 9.7: `kaynaklar` — 4 klasik kaynak (Râzî, Kurtubî, Elmalılı, Îzutsu)**

Her biri ayet-bazlı note.

- [ ] **Step 9.8: Build script çalıştır — validation + occurrence + Arabic inject**

```bash
cd next && node scripts/build-ibadetler.mjs --pillar=namaz --strict
```

Expected: no lint failures, tüm terimler için occurrence sayıldı, tüm ayet ref'leri çözüldü.

- [ ] **Step 9.9: Browser'da doğrulama**

`http://localhost:3000/tr/atlas/ibadetler/namaz` — 7 tab dolu, her tab okunabilir.

- [ ] **Step 9.10: Commit**

```bash
git add next/public/ibadetler/namaz.json
git commit -m "feat(ibadetler): Namaz full data — 15 terim, 8 pasaj, 7 peygamber, 7 iç boyut"
```

---

## Task 10: Namaz Audit Pass

**Files:**
- Create: `next/public/ibadetler/audit-report/namaz.json`

- [ ] **Step 10.1: qc-content-auditor agent invocation**

Bu step manuel: `qc-content-auditor` agent'ini spawn et, prompt'unda:
- Target: `next/public/ibadetler/namaz.json`
- Checks: ayet ref existence, claimType tutarlılığı, "Kur'aniyyun tuzağı" ifade taraması, tefsir citation formatı, mi'rac audit guard
- Output: `next/public/ibadetler/audit-report/namaz.json` (spec §5.2.1 formatı)

- [ ] **Step 10.2: Findings'i uygula — data revizyonu**

Audit report'taki her flagged/revised item için:
- İçerik JSON'unda düzeltme yap
- Rebuild + revalidate

- [ ] **Step 10.3: Second audit pass — verified count > flagged**

Tekrar `qc-content-auditor` run.

- [ ] **Step 10.4: Commit audit + revizyon**

```bash
git add next/public/ibadetler/namaz.json next/public/ibadetler/audit-report/namaz.json
git commit -m "feat(ibadetler): Namaz audit pass — content revizyonları uygulandı"
```

---

## Task 11: Zekât Data + Route + Audit

Namaz pattern'ı takip eder — Task 8-10 mikro-kopyası.

**Files:**
- Create: `next/public/ibadetler/zekat.json`
- Create: `next/src/app/[locale]/atlas/ibadetler/zekat/page.js`
- Create: `next/src/app/[locale]/atlas/ibadetler/zekat/ZekatRoute.jsx`
- Create: `next/public/ibadetler/audit-report/zekat.json`

- [ ] **Step 11.1: `zekat.json` iskelet + Zakât/Sadaka/İnfak semantik ayrımı**

Namaz iskeletini kopyala, id/anchorVerse/hero/vs değiştir. Anchor: **Tevbe 9:103** ("Onların mallarından zekât al...").

`kuraniIsimler` odaklan: **Zakât, Sadaka, İnfak, Nafaka, Sadakât, Zekevât** — semantik farklar detaylı (§10 risk tablosu: bu pillar risk).

Her semantik ayrım için audit guard note ekle (Sadaka gönüllü vs Zakât zorunlu ayrımı).

- [ ] **Step 11.2: Diğer tab'lar — spec §5.2 pattern**

- `anaPasajlar.ayetler`: Tevbe 60, Bakara 267, Bakara 271, Bakara 274, İnsan 8, ...
- `rakamsalMimari`: nisap eşiği + 1/40 oranı Kur'ân'da açık yok, sünnet-i mütevâtire tafsili — çok temkinli framing
- `peygamberVaryasyonlari`: İbrahim, İsmail, Meryem, İsa, Muhammed s.a.v.
- `icBoyut`: eza-vermeme, gizli sadaka, riya karşıtı

- [ ] **Step 11.3: `ZekatRoute.jsx` + `page.js`** — Namaz template kopyası

- [ ] **Step 11.4: Build + audit + revizyon**

```bash
cd next && node scripts/build-ibadetler.mjs --pillar=zekat --strict
```

qc-content-auditor pass, revize, ikinci pass.

- [ ] **Step 11.5: Commit**

```bash
git add next/public/ibadetler/zekat.json next/src/app/[locale]/atlas/ibadetler/zekat/ next/public/ibadetler/audit-report/zekat.json
git commit -m "feat(ibadetler): Zekât full — Zakât/Sadaka/İnfak semantik + tam 7 tab"
```

---

## Task 12: HUB Route + Component

**Files:**
- Create: `next/public/ibadetler-index.json`
- Create: `next/src/components/IbadetlerHub.jsx`
- Create: `next/src/components/IbadetlerAbdCore.jsx`
- Create: `next/src/app/[locale]/atlas/ibadetler/page.js`
- Create: `next/src/app/[locale]/atlas/ibadetler/IbadetlerHubRoute.jsx`

- [ ] **Step 12.1: `ibadetler-index.json` — abd core + wowFacts + pillars**

Spec §5.1 birebir. 6 wow fact her biri `pillarId` + `derivedFromClaimId`. Namaz + Zekât canonical claim'lerine bağla; Kurban için TODO placeholder (Task 13 sonrası).

- [ ] **Step 12.2: `IbadetlerAbdCore.jsx` — radial diagram (SAF CSS/SVG)**

`abd` merkezi + 4 layer (ubûdiyye, ibâdet, abdiyyet, ma'bûd) radial. SAF Flexbox + SVG line — spec §4.1.

```jsx
'use client';
import { COLORS, FONTS } from '../tokens';

export default function IbadetlerAbdCore({ abdCore, language, isMobile }) {
  const layers = abdCore?.layers ?? [];
  return (
    <div style={{ position: 'relative', width: isMobile ? '260px' : '400px', height: isMobile ? '260px' : '400px', margin: '40px auto' }}>
      {/* SVG lines from center to layers */}
      <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
        {layers.map((_, i) => {
          const angle = (360 / layers.length) * i - 90;
          const cx = 50, cy = 50;
          const x2 = cx + 40 * Math.cos(angle * Math.PI / 180);
          const y2 = cy + 40 * Math.sin(angle * Math.PI / 180);
          return <line key={i} x1={`${cx}%`} y1={`${cy}%`} x2={`${x2}%`} y2={`${y2}%`} stroke={COLORS.gold} strokeOpacity="0.4" strokeWidth="1" />;
        })}
      </svg>
      {/* Center */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: isMobile ? '80px' : '120px', height: isMobile ? '80px' : '120px', borderRadius: '50%', background: `radial-gradient(circle, ${COLORS.gold}33, transparent)`, border: `2px solid ${COLORS.gold}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <div style={{ fontFamily: FONTS.quran, fontSize: isMobile ? '1.6rem' : '2rem', color: COLORS.gold }} lang="ar" dir="rtl">{abdCore?.root ?? 'ع ب د'}</div>
        <div style={{ color: COLORS.silver, fontSize: '0.65rem', letterSpacing: '0.16em', textTransform: 'uppercase' }}>a-b-d</div>
      </div>
      {/* Outer layers */}
      {layers.map((layer, i) => {
        const angle = (360 / layers.length) * i - 90;
        const radius = isMobile ? 42 : 44;
        const x = 50 + radius * Math.cos(angle * Math.PI / 180);
        const y = 50 + radius * Math.sin(angle * Math.PI / 180);
        return (
          <div key={i} style={{
            position: 'absolute', left: `${x}%`, top: `${y}%`,
            transform: 'translate(-50%, -50%)',
            padding: '8px 12px', background: 'rgba(212,165,116,0.08)',
            border: `1px solid ${COLORS.goldAlpha25}`,
            borderRadius: '20px', textAlign: 'center',
            width: isMobile ? '80px' : '100px',
          }}>
            <div style={{ color: COLORS.gold, fontWeight: 600, fontSize: '0.82rem' }}>{layer.term}</div>
            <div style={{ color: COLORS.silver, fontSize: '0.65rem', marginTop: '2px' }}>{language === 'tr' ? layer.titleTr : layer.titleEn}</div>
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 12.3: `IbadetlerHub.jsx` — Hero + AbdCore + WowFacts + Pillar Grid**

```jsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { COLORS, FONTS, RADIUS } from '../tokens';
import ToolHeader from './ToolHeader';
import IbadetlerAbdCore from './IbadetlerAbdCore';

export default function IbadetlerHub({ language }) {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 640);
    fetch('/ibadetler-index.json').then(r => r.json()).then(setData);
  }, []);

  if (!data) return null;

  return (
    <div style={{ background: COLORS.cosmicBlack, minHeight: 'calc(100vh - 62px)', paddingTop: '62px' }}>
      <ToolHeader
        titleTr="İbadetlerin Kur'ânî Mimarisi"
        titleEn="The Qur'anic Architecture of Worship"
        subtitleTr="8 pillar · Kur'an'ın kendi diliyle kulluk"
        subtitleEn="8 pillars · worship in the Qur'an's own words"
        language={language}
      />

      {/* Hero */}
      <div style={{ padding: isMobile ? '40px 16px' : '60px 32px', textAlign: 'center' }}>
        <div style={{ fontFamily: FONTS.arabic ?? "'Amiri Quran', serif", fontSize: '1.6rem', color: COLORS.gold, opacity: 0.82, marginBottom: '24px' }}>﷽</div>
        <div style={{ fontFamily: FONTS.quran, fontSize: 'clamp(1.4rem, 3vw, 2rem)', color: COLORS.gold, lineHeight: 2.1, marginBottom: '20px' }} lang="ar" dir="rtl">{data.hero.anchorVerse.ar}</div>
        <p style={{ fontFamily: FONTS.display, fontStyle: 'italic', color: COLORS.offWhite, maxWidth: '660px', margin: '0 auto 12px' }}>"{language === 'tr' ? data.hero.anchorVerse.tr : data.hero.anchorVerse.en}"</p>
        <p style={{ textTransform: 'uppercase', letterSpacing: '0.16em', color: COLORS.silver, opacity: 0.65, fontSize: '0.72rem', marginBottom: '48px' }}>— {language === 'tr' ? data.hero.anchorVerse.refTr : data.hero.anchorVerse.refEn}</p>
        <IbadetlerAbdCore abdCore={data.abdCore} language={language} isMobile={isMobile} />
      </div>

      {/* Wow Facts */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: isMobile ? '20px 16px' : '40px 32px' }}>
        <h2 style={{ textTransform: 'uppercase', letterSpacing: '0.24em', color: COLORS.gold, fontSize: '0.82rem', textAlign: 'center', marginBottom: '32px' }}>{language === 'tr' ? 'Wow Momentler' : 'Wow Moments'}</h2>
        <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          {data.wowFacts.map((f, i) => (
            <div key={i} onClick={() => router.push(`/${language}/atlas/ibadetler/${f.pillarId}`)} style={{ padding: '18px', background: 'rgba(212,165,116,0.04)', border: `1px solid ${COLORS.goldAlpha25}`, borderRadius: RADIUS.md, cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ color: COLORS.gold, fontWeight: 600, fontSize: '0.95rem', marginBottom: '6px' }}>{language === 'tr' ? f.titleTr : f.titleEn}</div>
              <div style={{ color: COLORS.silver, fontSize: '0.82rem', lineHeight: 1.6 }}>{language === 'tr' ? f.descTr : f.descEn}</div>
              <div style={{ color: COLORS.gold, fontSize: '0.72rem', marginTop: '10px', letterSpacing: '0.12em' }}>{f.refs.join(' · ')}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Pillar Grid */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: isMobile ? '20px 16px 60px' : '40px 32px 80px' }}>
        <h2 style={{ textTransform: 'uppercase', letterSpacing: '0.24em', color: COLORS.gold, fontSize: '0.82rem', textAlign: 'center', marginBottom: '32px' }}>{language === 'tr' ? '8 Kulluk Ekseni' : '8 Worship Axes'}</h2>
        <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(240px, 1fr))' }}>
          {data.pillars.map(p => (
            <button key={p.id} onClick={() => router.push(`/${language}/atlas/ibadetler/${p.id}`)} style={{ textAlign: 'left', padding: '24px', background: 'rgba(255,255,255,0.03)', border: `1px solid ${COLORS.glassBorderSoft}`, borderRadius: RADIUS.md, cursor: 'pointer', color: 'inherit', transition: 'all 0.2s' }} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,165,116,0.08)'; e.currentTarget.style.borderColor = COLORS.gold; }} onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = COLORS.glassBorderSoft; }}>
              <div style={{ fontFamily: FONTS.quran, fontSize: '1.6rem', color: COLORS.gold, marginBottom: '8px', direction: 'rtl' }} lang="ar">{p.arabicName}</div>
              <div style={{ fontFamily: FONTS.display, color: COLORS.offWhite, fontSize: '1.2rem', marginBottom: '8px' }}>{language === 'tr' ? p.titleTr : p.titleEn}</div>
              <div style={{ color: COLORS.silver, fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '12px' }}>{language === 'tr' ? p.summaryTr : p.summaryEn}</div>
              <div style={{ color: COLORS.gold, fontSize: '0.78rem', letterSpacing: '0.12em' }}>{language === 'tr' ? 'Keşfet →' : 'Explore →'}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 12.4: `IbadetlerHubRoute.jsx` + `page.js`**

Namaz `NamazRoute.jsx` template'i kopyala, isim değiştir.

- [ ] **Step 12.5: Test — /atlas/ibadetler render**

Browser: `http://localhost:3000/tr/atlas/ibadetler` — hero + abd core + wow facts + pillar grid görünür.

- [ ] **Step 12.6: Commit HUB**

```bash
git add next/public/ibadetler-index.json next/src/components/IbadetlerHub.jsx next/src/components/IbadetlerAbdCore.jsx next/src/app/[locale]/atlas/ibadetler/page.js next/src/app/[locale]/atlas/ibadetler/IbadetlerHubRoute.jsx
git commit -m "feat(ibadetler): HUB — /atlas/ibadetler + AbdCore radial + wowFacts + pillar grid"
```

---

## Task 13: Kurban Light + Route

**Files:**
- Create: `next/public/ibadetler/kurban.json` (light — 5/7 tab)
- Create: `next/src/app/[locale]/atlas/ibadetler/kurban/page.js`
- Create: `next/src/app/[locale]/atlas/ibadetler/kurban/KurbanRoute.jsx`

- [ ] **Step 13.1: `kurban.json` — light 5/7 tab**

Peygamber Varyasyonları + Rakamsal Mimari **boş bırak** (visibleTabs filter'ı bunları gizler). Diğer 5 tab dolu:
- Genel Bakış
- Kur'ânî Semantik Alan: **Nüsuk, Nahr, Kurbân, Hedy, Süküra** (Îzutsu §5.1 referansı)
- Ana Pasajlar: Sâffât 37:100-113 (İbrahim rüyası), Hac 22:34-37, Kevser 108:2, Bakara 2:196
- İç Boyut: Hac 22:37 ("kanı ve etleri Allah'a ulaşmaz, taqvâ ulaşır"), İhlâs, hafıza
- Kaynaklar: Râzî, Kurtubî, Îzutsu

Anchor: Kevser 108:2 ("Rabbin için namaz kıl ve kurban kes").

Audit guard: İbrahim-İsmail kıssasında "hangi oğul" konusu Kur'ân açıkça belirtmez — tefsir hafızasında İsmail geleneği hâkim; `claimType: tafsir_tradition` işaretle.

- [ ] **Step 13.2: `KurbanRoute.jsx` + `page.js`**

Namaz template kopyası.

- [ ] **Step 13.3: Build + audit**

```bash
cd next && node scripts/build-ibadetler.mjs --pillar=kurban --strict
```

- [ ] **Step 13.4: Commit**

```bash
git add next/public/ibadetler/kurban.json next/src/app/[locale]/atlas/ibadetler/kurban/ next/public/ibadetler/audit-report/kurban.json
git commit -m "feat(ibadetler): Kurban light — 5/7 tab (Nüsuk semantiği + İbrahim hafızası)"
```

---

## Task 14: Nav Entegrasyon — exploreCategories

**Files:**
- Modify: `next/src/data/exploreCategories.jsx`

- [ ] **Step 14.1: PrayerIcon component**

`exploreCategories.jsx` içine yeni icon ekle:

```jsx
const PrayerIcon = ({ size = 22, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M6 21V10a6 6 0 1 1 12 0v11"/>
    <path d="M4 21h16"/>
    <path d="M9 21v-4a3 3 0 0 1 6 0v4"/>
  </svg>
);
```

- [ ] **Step 14.2: `history` grubuna İbadetler ekle**

`iblisSatan`'dan sonra:

```jsx
{
  id:     'ibadetler',
  kind:   'overlay',
  target: 'ibadetler',
  icon:   PrayerIcon,
  titleTr: "İbadetlerin Kur'ânî Mimarisi",
  titleEn: 'The Qur\'anic Architecture of Worship',
  descTr: '8 pillar · Kur\'an\'ın kendi diliyle kulluk',
  descEn: '8 pillars · worship in the Qur\'an\'s own words',
},
```

- [ ] **Step 14.3: `useQuranNav` — 'ibadetler' target'ı route.push'a bağla**

`next/src/hooks/useQuranNav.js` içinde openOverlay switch'e:

```js
case 'ibadetler': router.push(`/${language}/atlas/ibadetler`); break;
```

- [ ] **Step 14.4: Anasayfa AllTopics ve Navbar Keşfet dropdown'da görün**

Browser test — anasayfa Keşfet dropdown'da "İbadetlerin Kur'ânî Mimarisi" görünür.

- [ ] **Step 14.5: Commit**

```bash
git add next/src/data/exploreCategories.jsx next/src/hooks/useQuranNav.js
git commit -m "feat(ibadetler): nav entegrasyon — exploreCategories history grubuna eklendi"
```

---

## Task 15: Mobile Test + Polish + Push

**Files:**
- Modify: variable (bulunan sorunlar)

- [ ] **Step 15.1: Mobile browser test — 390px viewport**

Test URL'ler:
- `/tr/atlas/ibadetler` — HUB
- `/tr/atlas/ibadetler/namaz` — full pillar
- `/tr/atlas/ibadetler/zekat` — full pillar
- `/tr/atlas/ibadetler/kurban` — light pillar

Sticky tab bar Row scroll OK? Sayfa taşma yok? Font'lar okunabilir?

- [ ] **Step 15.2: Erişilebilirlik quick check**

- Tab bar keyboard: Tab tuşu ile focus akışı OK?
- Arapça text `dir="rtl" lang="ar"` var mı?
- Butonlar `aria-label` alsın?

- [ ] **Step 15.3: Content lint final pass**

```bash
cd next && node scripts/build-ibadetler.mjs --strict
```

Tüm pillar'lar için exit 0.

- [ ] **Step 15.4: Vercel deploy preview**

Push öncesi kullanıcı onayı iste. Sonra push:

```bash
git push origin main
```

Vercel deploy'u bekle, prod URL'lerde smoke test:
- `https://qurancodex.com/tr/atlas/ibadetler`
- `https://qurancodex.com/tr/atlas/ibadetler/namaz`
- `https://qurancodex.com/tr/atlas/ibadetler/zekat`
- `https://qurancodex.com/tr/atlas/ibadetler/kurban`

- [ ] **Step 15.5: V0 kabul kriterleri son check**

Spec §9'daki checkbox'ları tek tek doğrula. Failed kalan varsa Task olarak issue aç.

- [ ] **Step 15.6: V0 kapanış commit'i**

Post-push polish varsa:

```bash
git add .
git commit -m "polish(ibadetler): V0 mobile + a11y + content lint pass"
git push origin main
```

---

## V0 Kabul Kriterleri (Spec §9 Referansı)

- [ ] HUB `/atlas/ibadetler` build OK
- [ ] 3 pillar route (namaz, zekat, kurban) build OK
- [ ] Ağır pillar'lar (Namaz, Zekât) full 7 tab dolu
- [ ] Hafif pillar (Kurban) 5/7 tab dolu (visibleTabs filter çalışıyor)
- [ ] Ayet ref hatası yok
- [ ] Hiçbir tefsir citation'ında cilt/sayfa numarası yok
- [ ] Rakamsal Mimari framing note her pillar'da
- [ ] HUB wowFact'lar zorunlu pillarId + derivedFromClaimId
- [ ] Occurrence count human spot-check flagli
- [ ] Arapça encoding §13.15 pass
- [ ] Mobil 390px OK
- [ ] Nav entegrasyonu görünür
- [ ] i18n TR-first (EN placeholder OK V0'da)
- [ ] SourcesCitation her pillar'da listeli
- [ ] Content lint (yasak ifadeler) build fail
- [ ] Claim taxonomy inline zorunlu (build script kontrolü)
- [ ] Audit-report ayrı dosya
- [ ] URL tab fallback çalışıyor

---

## V1 & V2 Notu

Bu plan **V0** kapsamındadır. V0 kapandıktan sonra:
- **V1 planı** ayrı yazılacak: Oruç + Hac + Zikir + Dua + Tövbe (5 pillar)
- **V2 planı** polish + EN content + anasayfa teaser + advanced viz

V0 sonu deploy edilmiş çalışan sayfa var; V1 & V2 sonrasına ertelenir.
