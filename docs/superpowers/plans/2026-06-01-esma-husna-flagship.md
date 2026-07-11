# Esmâ-i Hüsnâ Flagship Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `/arac/esma-frekans/` rotasını "frekans aracı"ndan QuranCodex'in vitrin parçası olan "Esmâ-i Hüsnâ — Allah'ın Kendini Tanıtması" cinematic anlatı sayfasına dönüştürmek.

**Architecture:** Tek-sayfa scroll-driven, 7 section (Hero · Manifesto · Flagship Pasajlar · Frekans · Vahyin Sesi · Atlas · Metodoloji). Veri: 2 JSON dosyası (114 isim + 14 tematik eksen). URL korunur, 7 mevcut dosya etiket güncellenir, 4 dosya değişmez (WowFacts, ReadingMode, Navbar lazy import, useQuranNav).

**Tech Stack:** Next.js 16 App Router, React 19, framer-motion, mevcut design tokens (`src/tokens.js`), KFGQPC font, Tailwind 4. Test framework yok — Node validation script + dev server visual verification.

**Spec referansı:** `docs/superpowers/specs/2026-05-31-esma-husna-flagship-design.md`

---

## File Structure

### Yeni dosyalar

| Path | Sorumluluğu |
|---|---|
| `next/public/esma-frekans.json` | 114 isim verisi (kullanıcının sağladığı JSON, replace) |
| `next/public/esma-frekans.legacy.json` | Eski JSON yedeği (silinmez, audit için) |
| `next/public/esma-beyanlari.json` | Doküman 3'ün 14 tematik ekseni × ayetler |
| `scripts/validate-esma-data.mjs` | JSON şema + içerik doğruluk validator (Node) |
| `scripts/build-esma-beyanlari.mjs` | verse-graph-bgem3.json'dan Arapça+TR+EN çekip esma-beyanlari.json oluşturur |

### Yeniden yazılan dosyalar

| Path | Mevcut Satır | Sorumluluğu |
|---|---|---|
| `next/src/components/EsmaFrekans.jsx` | 677 | 7 section'lı cinematic page; tek dosya, internal section component'ları |

### Etiket güncellemesi

| Path | Satır | Değişiklik |
|---|---|---|
| `next/src/app/[locale]/arac/esma-frekans/page.js` | 8-11 | TITLE/DESC yenilenir |
| `next/src/data/tools.jsx` | 297-305 | tools.jsx card etiketleri |
| `next/src/lib/jsonld.js` | 23, 41 | breadcrumb label'ları |
| `next/src/components/tefekkur/RelatedToolCard.jsx` | 9 | esma-frekans label'ı |
| `next/src/sections/ToolsHighlight.jsx` | 14 | yorum güncellemesi |

### Değişmeyen (kritik tutarlılık için)

| Path | Sebep |
|---|---|
| `next/src/components/WowFacts.jsx:71` | Allah=2699 tutarlılığı |
| `next/src/components/ReadingMode.jsx` | Bağımsız feature |
| `next/src/components/Navbar.jsx` | Lazy import kod adı `EsmaFrekans` korunur |
| `next/src/hooks/useQuranNav.js:60` | URL stabil |

---

## Phase 0: Data Setup

### Task 1: Eski JSON'u yedekle, yeni JSON'u yerleştir

**Files:**
- Create: `next/public/esma-frekans.legacy.json` (mevcut esma-frekans.json'un kopyası)
- Modify: `next/public/esma-frekans.json` (yeni 114-isim JSON ile değişir)

- [ ] **Step 1: Mevcut JSON'u legacy olarak kopyala**

Run:
```bash
cp /Users/serdar/dev/00_dev_PROJECTS/01_qurancodex/next/public/esma-frekans.json /Users/serdar/dev/00_dev_PROJECTS/01_qurancodex/next/public/esma-frekans.legacy.json
```

Expected: Kopya oluşturulur, eski içerik korunur.

- [ ] **Step 2: Yeni JSON'u yerleştir**

Kullanıcının sağladığı tam JSON içeriğini (114 isim, `baslik`, `alt_baslik`, `aciklama`, `metodoloji`, `temel_ayetler`, `kategoriler`, `toplam_isim_sayisi: 114`, `isimler[]`) `next/public/esma-frekans.json` dosyasına yaz.

**ÖNEMLI:** İçerik kullanıcının "son dokuman" mesajında verdiği JSON birebir. Hiçbir değişiklik yapılmaz. Allah'ın `kuranda_gecis_sayisi: 1813` JSON'da olduğu gibi kalır — UI tarafında component-level override ile 2699 gösterilecek (Task 11'de).

- [ ] **Step 3: JSON valid olduğunu doğrula**

Run:
```bash
node -e "const d = require('/Users/serdar/dev/00_dev_PROJECTS/01_qurancodex/next/public/esma-frekans.json'); console.log('isimler:', d.isimler.length, 'beklenen:', d.toplam_isim_sayisi); console.log('kategoriler:', d.kategoriler.length); console.log('Allah count:', d.isimler[0].kuranda_gecis_sayisi);"
```

Expected output:
```
isimler: 114 beklenen: 114
kategoriler: 3
Allah count: 1813
```

- [ ] **Step 4: Commit**

Show diff, await user approval, then:
```bash
cd /Users/serdar/dev/00_dev_PROJECTS/01_qurancodex
git add next/public/esma-frekans.json next/public/esma-frekans.legacy.json
git commit -m "feat(esma): replace data with 114-name dataset, keep legacy as backup"
```

---

### Task 2: Validation script oluştur

**Files:**
- Create: `scripts/validate-esma-data.mjs`

- [ ] **Step 1: Script'i yaz**

Path: `/Users/serdar/dev/00_dev_PROJECTS/01_qurancodex/scripts/validate-esma-data.mjs`

```js
#!/usr/bin/env node
// Esmâ-i Hüsnâ JSON şema + içerik doğruluk validator.
// Run: node scripts/validate-esma-data.mjs

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const isimler = JSON.parse(readFileSync(join(root, 'next/public/esma-frekans.json'), 'utf8'));

const errors = [];
const warnings = [];

// 1. Top-level şema
if (!Array.isArray(isimler.isimler)) errors.push('isimler[] array değil');
if (!Array.isArray(isimler.kategoriler)) errors.push('kategoriler[] array değil');
if (!Array.isArray(isimler.temel_ayetler)) errors.push('temel_ayetler[] array değil');
if (!isimler.metodoloji) errors.push('metodoloji objesi yok');

// 2. İsim sayısı
if (isimler.isimler.length !== isimler.toplam_isim_sayisi) {
  errors.push(`isim sayısı uyumsuz: ${isimler.isimler.length} vs ${isimler.toplam_isim_sayisi}`);
}

// 3. Her ismin zorunlu alanları
const required = ['isim', 'arapca', 'okunus', 'anlam', 'kategori', 'kuranda_gecis_sayisi'];
const validCats = new Set(['isim', 'esma', 'kurani_sifat']);

isimler.isimler.forEach((n, i) => {
  required.forEach(f => {
    if (n[f] === undefined || n[f] === null) {
      errors.push(`[${i}] ${n.isim || '???'}: eksik alan '${f}'`);
    }
  });
  if (!validCats.has(n.kategori)) {
    errors.push(`[${i}] ${n.isim}: geçersiz kategori '${n.kategori}'`);
  }
  // Ayet listesi: yuksek_frekansli ise ornek_ayetler + tum_ayetler, değilse ayetler
  if (n.yuksek_frekansli) {
    if (!Array.isArray(n.ornek_ayetler)) errors.push(`[${i}] ${n.isim}: ornek_ayetler[] eksik`);
    if (!Array.isArray(n.tum_ayetler)) errors.push(`[${i}] ${n.isim}: tum_ayetler[] eksik`);
  } else {
    if (!Array.isArray(n.ayetler)) errors.push(`[${i}] ${n.isim}: ayetler[] eksik`);
  }
});

// 4. Allah özel kontrol
const allah = isimler.isimler.find(n => n.isim === 'Allah');
if (!allah) errors.push('Allah ismi bulunamadı');
else {
  if (allah.kategori !== 'isim') errors.push(`Allah kategori 'isim' olmalı, '${allah.kategori}' bulundu`);
  if (allah.kuranda_gecis_sayisi !== 1813) {
    warnings.push(`Allah JSON'da ${allah.kuranda_gecis_sayisi}; UI'da 2699 (klasik) gösterilecek (override OK)`);
  }
}

// 5. Arapça encoding — problem karakterler
const PROBLEM_CHARS = ['۪', 'ٱ', 'ی', 'ۜ', 'ۙ', 'ۚ', 'ۛ', '۝', '۞', '۟', '۠', '۩', 'ۭ'];
isimler.isimler.forEach(n => {
  if (!n.arapca) return;
  for (const c of PROBLEM_CHARS) {
    if (n.arapca.includes(c)) {
      warnings.push(`${n.isim}: arapca alanında problem karakter '${c}' (U+${c.charCodeAt(0).toString(16).padStart(4,'0').toUpperCase()})`);
    }
  }
});

// 6. Kategori dağılımı (özet)
const dist = isimler.isimler.reduce((acc, n) => { acc[n.kategori] = (acc[n.kategori] || 0) + 1; return acc; }, {});
console.log('\n=== Kategori Dağılımı ===');
Object.entries(dist).forEach(([k, v]) => console.log(`  ${k}: ${v}`));

// 7. Yüksek frekanslı isim sayısı
const hf = isimler.isimler.filter(n => n.yuksek_frekansli).length;
console.log(`\nyuksek_frekansli: ${hf}`);
console.log(`Toplam: ${isimler.isimler.length}`);

if (warnings.length) {
  console.log('\n=== Uyarılar ===');
  warnings.forEach(w => console.log('  ⚠', w));
}

if (errors.length) {
  console.log('\n=== Hatalar ===');
  errors.forEach(e => console.log('  ✗', e));
  process.exit(1);
}

console.log('\n✓ Tüm doğrulamalar geçti.');
```

- [ ] **Step 2: Script'i çalıştır, çıktıyı kontrol et**

Run:
```bash
cd /Users/serdar/dev/00_dev_PROJECTS/01_qurancodex
node scripts/validate-esma-data.mjs
```

Expected: "✓ Tüm doğrulamalar geçti." + kategori dağılımı (isim: 1, esma: ~99, kurani_sifat: ~14). Hata varsa Task 1'e dön; JSON'da eksik alan var demektir.

- [ ] **Step 3: Commit**

Show diff, await user approval, then:
```bash
cd /Users/serdar/dev/00_dev_PROJECTS/01_qurancodex
git add scripts/validate-esma-data.mjs
git commit -m "chore(esma): add JSON schema + content validator script"
```

---

### Task 3: esma-beyanlari.json builder script (verse-graph'tan çek)

**Files:**
- Create: `scripts/build-esma-beyanlari.mjs`
- Create: `next/public/esma-beyanlari.json` (script çıktısı)

Doküman 3'teki 14 tematik eksen × ayetler. Arapça + TR + EN canonical kaynak: `next/public/verse-graph-bgem3.json` (6236 ayet, KFGQPC-uyumlu encoding, Sahih International EN, mevcut TR çevirisi).

- [ ] **Step 1: Builder script'i yaz**

Path: `/Users/serdar/dev/00_dev_PROJECTS/01_qurancodex/scripts/build-esma-beyanlari.mjs`

```js
#!/usr/bin/env node
// Doküman 3'ün 14 tematik ekseni × ayetler veri yapısını oluşturur.
// verse-graph-bgem3.json'dan Arapça (standard encoding) + EN (Sahih International) + TR çekilir.
// Run: node scripts/build-esma-beyanlari.mjs

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const verses = JSON.parse(readFileSync(join(root, 'next/public/verse-graph-bgem3.json'), 'utf8'));
const byId = new Map(verses.map(v => [v.id, v]));

// 14 tematik eksen — Doküman 3'ten birebir
const eksenler = [
  {
    id: 'varlik-teklik',
    baslikTr: "Allah'ın Varlığı ve Tekliği",
    baslikEn: "God's Existence and Oneness",
    ayetRefs: ['20:14', '21:25', '2:163', '112:1', '112:2', '112:3', '112:4'],
    notTr: "Allah kendini her şeyden önce eşi, benzeri, dengi ve ortağı olmayan mutlak tek varlık olarak tanıtır.",
    notEn: "God first describes Himself as the absolute One — no equal, no peer, no partner.",
  },
  {
    id: 'yakinlik',
    baslikTr: "Allah'ın Yakınlığı",
    baslikEn: "God's Nearness",
    ayetRefs: ['2:186', '50:16', '57:4'],
    notTr: "Allah kendini insandan uzak değil; ona kendisinden bile yakın bir merci olarak tanımlar.",
    notEn: "God describes Himself not as distant but as nearer to humans than their jugular vein.",
  },
  {
    id: 'rahmet-af',
    baslikTr: "Allah'ın Rahmeti ve Affı",
    baslikEn: "God's Mercy and Forgiveness",
    ayetRefs: ['15:49', '39:53', '20:82', '7:156'],
    notTr: "Allah'ın rahmeti her şeyi kuşatmıştır; tövbe kapısı daima açıktır.",
    notEn: "God's mercy encompasses all things; the door of repentance is always open.",
  },
  {
    id: 'yaraticilik',
    baslikTr: "Allah'ın Yaratıcılığı",
    baslikEn: "God's Creative Power",
    ayetRefs: ['51:56', '23:12', '23:13', '23:14', '21:30', '36:82'],
    notTr: "Allah evreni ham maddesiz, örneksiz ve kusursuz bir geometriyle inşa eder.",
    notEn: "God creates the universe without raw material, without precedent, with flawless geometry.",
  },
  {
    id: 'bilgi',
    baslikTr: "Allah'ın Bilgisi",
    baslikEn: "God's Knowledge",
    ayetRefs: ['2:29', '6:59', '58:7', '3:29'],
    notTr: "Gaybın anahtarları O'nun katındadır; içsel düşünceler dahil her şeyi bilir.",
    notEn: "The keys of the unseen are with Him; He knows all, including inner thoughts.",
  },
  {
    id: 'kudret',
    baslikTr: "Allah'ın Kudreti",
    baslikEn: "God's Power",
    ayetRefs: ['2:20', '67:1', '36:83'],
    notTr: "Her şeyin hükümranlığı O'nun elindedir; O her şeye kadirdir.",
    notEn: "Sovereignty over all things is in His hand; He has power over everything.",
  },
  {
    id: 'adalet',
    baslikTr: "Allah'ın Adaleti",
    baslikEn: "God's Justice",
    ayetRefs: ['4:40', '18:49', '41:46'],
    notTr: "Allah zerre kadar haksızlık etmez; Rabbin kullara zulmedici değildir.",
    notEn: "God does not wrong by even an atom's weight; the Lord is not unjust to His servants.",
  },
  {
    id: 'isit-gor',
    baslikTr: "Allah'ın İşitmesi ve Görmesi",
    baslikEn: "God's Hearing and Sight",
    ayetRefs: ['42:11', '58:1'],
    notTr: "O'nun benzeri hiçbir şey yoktur; O hakkıyla işiten, hakkıyla görendir.",
    notEn: "There is nothing like Him; He is the All-Hearing, the All-Seeing.",
  },
  {
    id: 'hayat-sureklilik',
    baslikTr: "Allah'ın Hayatı ve Sürekliliği",
    baslikEn: "God's Life and Eternal Sustaining",
    ayetRefs: ['2:255', '57:3'],
    notTr: "Hayy ve Kayyûm — kendisini ne bir uyuklama tutar ne uyku. Evvel'dir, Âhir'dir, Zâhir'dir, Bâtın'dır.",
    notEn: "The Living, the Self-Sustaining — neither slumber nor sleep overtake Him. He is the First, the Last, the Outward, the Inward.",
  },
  {
    id: 'nur',
    baslikTr: "Allah'ın Nur Oluşu",
    baslikEn: "God as Light",
    ayetRefs: ['24:35'],
    notTr: "Allah göklerin ve yerin nurudur.",
    notEn: "God is the Light of the heavens and the earth.",
  },
  {
    id: 'koruyuculuk',
    baslikTr: "Allah'ın Koruyuculuğu",
    baslikEn: "God's Protection",
    ayetRefs: ['11:57', '2:257'],
    notTr: "Rabbim her şeyi koruyandır; Allah iman edenlerin velisidir.",
    notEn: "My Lord is the Guardian of all things; God is the protector of those who believe.",
  },
  {
    id: 'hukum',
    baslikTr: "Allah'ın Hükmü",
    baslikEn: "God's Sovereignty",
    ayetRefs: ['12:40', '3:26'],
    notTr: "Hüküm yalnız Allah'ındır. Mülkün gerçek sahibi O'dur.",
    notEn: "Judgment belongs to God alone. He is the true Owner of dominion.",
  },
  {
    id: 'insan-iliski',
    baslikTr: "Allah'ın İnsanla İlişkisi",
    baslikEn: "God's Relationship with Humans",
    ayetRefs: ['55:29', '2:152'],
    notTr: "Göklerde ve yerde bulunan herkes O'ndan ister. 'Siz beni anın ki ben de sizi anayım.'",
    notEn: "Everyone in the heavens and earth asks of Him. 'Remember Me; I will remember you.'",
  },
  {
    id: 'flagship-pasajlar',
    baslikTr: "Kapsamlı Pasajlar",
    baslikEn: "Comprehensive Passages",
    ayetRefs: ['2:255', '59:22', '59:23', '59:24'],
    notTr: "Âyetü'l-Kürsî ve Haşr 22-24 — ilâhî isimlerin en yoğun kümelendiği pasajlar.",
    notEn: "Āyat al-Kursī and Ḥashr 22-24 — passages with the highest density of divine names.",
  },
];

// Standart encoding kontrol — verse-graph'tan gelen Arapça zaten KFGQPC-uyumludur
function check(id) {
  const v = byId.get(id);
  if (!v) throw new Error(`Ayet bulunamadı: ${id}`);
  return v;
}

const out = {
  baslik: "Vahyin Sesi",
  baslikEn: "The Voice of Revelation",
  altBaslik: "Allah'ın Kur'an'da Doğrudan Beyanları",
  altBaslikEn: "God's Direct Self-Statements in the Quran",
  not: "İçerik Doküman 3'ten alınmış; ayet metinleri verse-graph-bgem3.json kaynağındandır (Arapça: KFGQPC-uyumlu standart encoding; EN: Sahih International; TR: mevcut çeviri).",
  enKaynak: "Sahih International (via verse-graph-bgem3.json)",
  trKaynak: "QuranCodex internal Turkish meal",
  eksenler: eksenler.map(eks => ({
    id: eks.id,
    baslikTr: eks.baslikTr,
    baslikEn: eks.baslikEn,
    notTr: eks.notTr,
    notEn: eks.notEn,
    ayetler: eks.ayetRefs.map(ref => {
      const v = check(ref);
      return {
        id: v.id,
        sure: v.surah,
        ayet: v.ayah,
        sureAdTr: v.surahNameEn, // verse-graph TR sure adı yok, EN tarafı kullanılır; component'ta surahNames.js eşlenir
        arapca: v.arabic,
        tr: v.turkish,
        en: v.english,
      };
    }),
  })),
};

writeFileSync(join(root, 'next/public/esma-beyanlari.json'), JSON.stringify(out, null, 2), 'utf8');
console.log(`✓ esma-beyanlari.json oluşturuldu: ${out.eksenler.length} eksen, ${out.eksenler.reduce((s, e) => s + e.ayetler.length, 0)} ayet`);
```

- [ ] **Step 2: Script'i çalıştır**

Run:
```bash
cd /Users/serdar/dev/00_dev_PROJECTS/01_qurancodex
node scripts/build-esma-beyanlari.mjs
```

Expected output:
```
✓ esma-beyanlari.json oluşturuldu: 14 eksen, 42 ayet
```

- [ ] **Step 3: Oluşan JSON'u kontrol et**

Run:
```bash
cd /Users/serdar/dev/00_dev_PROJECTS/01_qurancodex
node -e "const d = require('./next/public/esma-beyanlari.json'); console.log('eksenler:', d.eksenler.length); console.log('ilk eksen:', d.eksenler[0].baslikTr); console.log('ilk ayet:', d.eksenler[0].ayetler[0].sure + ':' + d.eksenler[0].ayetler[0].ayet, '-', d.eksenler[0].ayetler[0].tr.slice(0, 60));"
```

Expected:
```
eksenler: 14
ilk eksen: Allah'ın Varlığı ve Tekliği
ilk ayet: 20:14 - <Tâhâ 20:14 Türkçe çevirisinin ilk 60 karakteri>
```

- [ ] **Step 4: Commit**

Show diff, await user approval, then:
```bash
cd /Users/serdar/dev/00_dev_PROJECTS/01_qurancodex
git add scripts/build-esma-beyanlari.mjs next/public/esma-beyanlari.json
git commit -m "feat(esma): add Vahyin Sesi data (14 axes × 42 verses from verse-graph)"
```

---

## Phase 1: Metadata + Etiket Güncellemeleri

### Task 4: page.js metadata güncelle

**Files:**
- Modify: `next/src/app/[locale]/arac/esma-frekans/page.js:8-11`

- [ ] **Step 1: Mevcut metadata'yı değiştir**

Read full file: `/Users/serdar/dev/00_dev_PROJECTS/01_qurancodex/next/src/app/[locale]/arac/esma-frekans/page.js`

Find:
```js
const PATH = '/arac/esma-frekans';
const TITLE_TR = "Esmâ'ül-Hüsnâ Frekansı";
const TITLE_EN = "Frequency of the Divine Names";
const DESC_TR = "Allah'ın 99 ismi (Esmâ'ül-Hüsnâ) — Kur'an'daki frekans analizi ve tematik dağılımı.";
const DESC_EN = "The 99 Beautiful Names of God (al-Asmāʾ al-Ḥusnā) — frequency analysis across the Quran and their thematic distribution.";
```

Replace with:
```js
const PATH = '/arac/esma-frekans';
const TITLE_TR = "Esmâ-i Hüsnâ — Allah'ın Kendini Tanıtması";
const TITLE_EN = "The Beautiful Names — How God Describes Himself";
const DESC_TR = "Kur'an'da Allah'ın kendini tanıttığı 114 isim, sıfat ve doğrudan beyan. Celal ↔ Cemal dengesi, frekans haritası, Âyetü'l-Kürsî ve Haşr 22-24 anatomileri.";
const DESC_EN = "The 114 names, attributes, and direct statements by which God describes Himself in the Quran. Jalāl ↔ Jamāl balance, frequency landscape, and anatomies of Āyat al-Kursī and Ḥashr 22-24.";
```

Apostrof dikkati (§16.3): Çift tırnak içinde tek tırnak kullanımı string truncation tetiklemez — yukarıdaki format §16.3'e uygundur.

- [ ] **Step 2: Build doğruluk kontrolü**

Run:
```bash
cd /Users/serdar/dev/00_dev_PROJECTS/01_qurancodex/next
npm run lint 2>&1 | head -20
```

Expected: Lint hatası yok (en azından page.js için yeni hata yok).

- [ ] **Step 3: Commit**

Show diff, await approval:
```bash
cd /Users/serdar/dev/00_dev_PROJECTS/01_qurancodex
git add next/src/app/\[locale\]/arac/esma-frekans/page.js
git commit -m "feat(esma): update page metadata to new title and description"
```

---

### Task 5: tools.jsx card etiketleri güncelle

**Files:**
- Modify: `next/src/data/tools.jsx:297-305`

- [ ] **Step 1: Mevcut card'ı değiştir**

Read: `/Users/serdar/dev/00_dev_PROJECTS/01_qurancodex/next/src/data/tools.jsx` (satır 290-310 arası)

Find:
```js
  {
    id:          'esma-frekans',
    event:       'openEsmaFrekans',
    titleTr:     'Esmaül Hüsna',
    titleEn:     'Divine Names',
    descTr:      "99 ismin Kur'an'daki frekans analizi",
    descEn:      'Frequency analysis of the 99 divine names',
    descLongTr:  "Allah'ın 99 ismi Kur'an'da kaç kez geçer ve hangi bağlamda? Frekans grafiği ve bağlamsal analiz: Rahman ile Kahhar'ın geçtiği ayetler nasıl farklılaşıyor?",
    descLongEn:  "How often does each of God's 99 names appear in the Quran, and in what context? Frequency chart plus contextual analysis: how do verses with Ar-Rahman differ from those with Al-Qahhar?",
    icon:        EsmaIcon,
  },
```

Replace with:
```js
  {
    id:          'esma-frekans',
    event:       'openEsmaFrekans',
    titleTr:     'Esmâ-i Hüsnâ',
    titleEn:     'The Beautiful Names',
    descTr:      "Allah'ın Kur'an'da kendini tanıtması · 114 isim",
    descEn:      "How God describes Himself in the Quran · 114 names",
    descLongTr:  "Kur'an'da Allah kendisini hangi isim, sıfat ve doğrudan beyanlarla tanıtır? 114 isim · Celal ↔ Cemal dengesi · Âyetü'l-Kürsî ve Haşr 22-24 anatomileri · frekans manzarası · doğrudan ilahi beyanlar.",
    descLongEn:  "How does God describe Himself in the Quran — through which names, attributes, and direct statements? 114 names · Jalāl ↔ Jamāl balance · anatomies of Āyat al-Kursī and Ḥashr 22-24 · frequency landscape · direct divine self-statements.",
    icon:        EsmaIcon,
  },
```

- [ ] **Step 2: Lint kontrol**

Run:
```bash
cd /Users/serdar/dev/00_dev_PROJECTS/01_qurancodex/next
npm run lint 2>&1 | grep -i "tools.jsx" || echo "tools.jsx lint clean"
```

Expected: `tools.jsx lint clean`

- [ ] **Step 3: Commit**

```bash
cd /Users/serdar/dev/00_dev_PROJECTS/01_qurancodex
git add next/src/data/tools.jsx
git commit -m "feat(esma): update tools.jsx card to new title and 114-name positioning"
```

---

### Task 6: jsonld.js breadcrumb label güncelle

**Files:**
- Modify: `next/src/lib/jsonld.js:23, 41`

- [ ] **Step 1: Etiketleri değiştir**

Read: `/Users/serdar/dev/00_dev_PROJECTS/01_qurancodex/next/src/lib/jsonld.js`

Find satır 23:
```js
    dualar: "Dualar", 'esma-frekans': "Esma'ül-Hüsna Frekansı",
```

Replace with:
```js
    dualar: "Dualar", 'esma-frekans': "Esmâ-i Hüsnâ",
```

Find satır 41:
```js
    dualar: 'Prayers', 'esma-frekans': 'Names of Allah Frequency',
```

Replace with:
```js
    dualar: 'Prayers', 'esma-frekans': 'The Beautiful Names',
```

- [ ] **Step 2: Commit**

```bash
cd /Users/serdar/dev/00_dev_PROJECTS/01_qurancodex
git add next/src/lib/jsonld.js
git commit -m "feat(esma): update breadcrumb labels in jsonld"
```

---

### Task 7: RelatedToolCard + ToolsHighlight yorum güncelle

**Files:**
- Modify: `next/src/components/tefekkur/RelatedToolCard.jsx:9`
- Modify: `next/src/sections/ToolsHighlight.jsx:14`

- [ ] **Step 1: RelatedToolCard güncelle**

Read: `/Users/serdar/dev/00_dev_PROJECTS/01_qurancodex/next/src/components/tefekkur/RelatedToolCard.jsx`

Find satır 9:
```js
  'esma-frekans':   { labelTr: 'Esmâ Frekansı',  labelEn: 'Divine Names',  path: '/arac/esma-frekans', accent: '#1D9E75', descTr: 'Esma istatistik', descEn: 'Names frequency' },
```

Replace with:
```js
  'esma-frekans':   { labelTr: 'Esmâ-i Hüsnâ',  labelEn: 'The Beautiful Names',  path: '/arac/esma-frekans', accent: '#1D9E75', descTr: 'Allah\'ın kendini tanıtması', descEn: 'How God describes Himself' },
```

- [ ] **Step 2: ToolsHighlight yorum güncelle**

Read: `/Users/serdar/dev/00_dev_PROJECTS/01_qurancodex/next/src/sections/ToolsHighlight.jsx`

Find satır 14:
```js
//   3. Esmaül Hüsna         — EsmaFrekans, divine names frequency
```

Replace with:
```js
//   3. Esmâ-i Hüsnâ         — EsmaFrekans, divine names & self-description (114 names)
```

- [ ] **Step 3: Commit**

```bash
cd /Users/serdar/dev/00_dev_PROJECTS/01_qurancodex
git add next/src/components/tefekkur/RelatedToolCard.jsx next/src/sections/ToolsHighlight.jsx
git commit -m "feat(esma): update related tool card and ToolsHighlight comment"
```

---

## Phase 2: Component Sections

EsmaFrekans.jsx tamamen yeniden yazılır. Aşağıdaki tasklar component'ı **section-by-section** kurar. Her task bir section ekler, dev server'da görsel doğrulama yapılır, commit edilir.

### Task 8: EsmaFrekans skeleton + Section 1 (Hero)

**Files:**
- Rewrite: `next/src/components/EsmaFrekans.jsx`

- [ ] **Step 1: Mevcut dosyayı boşalt, skeleton + Hero yaz**

Tam dosya içeriği:

```jsx
'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import { COLORS, FONTS, GLASS_CARD, TEXT, TRANSITION } from '../tokens';

// ── Sabit veriler ────────────────────────────────────────────────────────────

// Şûrâ 42:11 — hero anchor ayeti (sabit, JSON'da gereksiz)
const HERO_VERSE = {
  arabic: 'لَيْسَ كَمِثْلِهِۦ شَىْءٌ ۖ وَهُوَ ٱلسَّمِيعُ ٱلْبَصِيرُ',
  tr: "O'nun benzeri hiçbir şey yoktur. O hakkıyla işitendir, hakkıyla görendir.",
  en: "There is nothing like Him, and He is the All-Hearing, the All-Seeing.",
  ref: 'Şûrâ 42:11',
  refEn: 'Shūrā 42:11',
};

// Allah lemma şeffaflık sabitleri (Spec §6)
const ALLAH_CLASSIC_COUNT = 2699;   // M. Fuâd Abdülbâkî, lemma sayımı
const ALLAH_SURFACE_COUNT = 1813;   // JSON'daki yüzey lafz sayımı

// ── Styles ────────────────────────────────────────────────────────────────────

const sectionLabel = {
  color: `${COLORS.gold}99`,
  fontSize: '0.7rem',
  fontFamily: FONTS.body,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.18em',
  marginBottom: '20px',
};

// ── Main component ─────────────────────────────────────────────────────────────

export default function EsmaFrekans({ onClose }) {
  const { language } = useLanguage();
  const tr = language === 'tr';

  const [data, setData] = useState(null);
  const [beyanlari, setBeyanlari] = useState(null);

  // Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape' && onClose) onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Load data
  useEffect(() => {
    fetch('/esma-frekans.json').then(r => r.json()).then(setData).catch(e => console.error('[EsmaFrekans]', e));
    fetch('/esma-beyanlari.json').then(r => r.json()).then(setBeyanlari).catch(e => console.error('[EsmaBeyanlari]', e));
  }, []);

  return (
    <div style={{
      background: COLORS.cosmicBlack,
      minHeight: 'calc(100vh - 62px)',
      paddingTop: '62px',
    }}>
      {/* ═══ SECTION 1: HERO ═══ */}
      <Hero tr={tr} />

      {/* Diğer section'lar sonraki task'larda eklenecek */}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SECTION 1: HERO — Şûrâ 42:11 + Çift-katman başlık + 4 temel ayet
// ═════════════════════════════════════════════════════════════════════════════
function Hero({ tr }) {
  return (
    <section style={{
      minHeight: 'calc(100vh - 62px)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '40px 24px 60px',
      position: 'relative',
    }}>
      {/* Bismillah ornamenti */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 0.6, scale: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        style={{
          fontFamily: FONTS.quran,
          fontSize: '1.4rem',
          color: COLORS.gold,
          marginBottom: '60px',
          textAlign: 'center',
        }}
        dir="rtl"
        lang="ar"
      >
        ﷽
      </motion.div>

      {/* Şûrâ 42:11 — hero verse */}
      <motion.blockquote
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.2 }}
        cite="https://quran.com/42/11"
        style={{
          margin: '0 0 50px',
          textAlign: 'center',
          maxWidth: '780px',
        }}
      >
        <p
          dir="rtl"
          lang="ar"
          style={{
            fontFamily: FONTS.quran,
            fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
            color: COLORS.gold,
            lineHeight: 2.2,
            margin: '0 0 18px',
          }}
        >
          {HERO_VERSE.arabic}
        </p>
        <p style={{
          color: COLORS.offWhite,
          fontFamily: FONTS.display,
          fontStyle: 'italic',
          fontSize: 'clamp(1rem, 2.4vw, 1.25rem)',
          lineHeight: 1.6,
          margin: '0 0 8px',
        }}>
          "{tr ? HERO_VERSE.tr : HERO_VERSE.en}"
        </p>
        <p style={{
          color: COLORS.silver,
          fontFamily: FONTS.body,
          fontSize: '0.85rem',
          letterSpacing: '0.08em',
          margin: 0,
        }}>
          — {tr ? HERO_VERSE.ref : HERO_VERSE.refEn}
        </p>
      </motion.blockquote>

      {/* Çift-katman başlık */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.5 }}
        style={{ textAlign: 'center', marginBottom: '40px' }}
      >
        <h1 style={{
          fontFamily: FONTS.display,
          fontWeight: 900,
          fontSize: 'clamp(2.4rem, 7vw, 5rem)',
          color: COLORS.offWhite,
          letterSpacing: '-0.02em',
          lineHeight: 1,
          margin: '0 0 14px',
        }}>
          {tr ? 'ESMÂ-İ HÜSNÂ' : 'THE BEAUTIFUL NAMES'}
        </h1>
        <p style={{
          fontFamily: FONTS.display,
          fontStyle: 'italic',
          fontSize: 'clamp(1.05rem, 2.4vw, 1.5rem)',
          color: COLORS.silver,
          fontWeight: 400,
          margin: 0,
        }}>
          {tr ? "Allah'ın Kur'an'da Kendini Tanıtması" : 'How God Describes Himself in the Quran'}
        </p>
      </motion.div>

      {/* 4 temel ayet — placeholder; veri Task 8.2'de bağlanacak */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.8 }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '12px',
          maxWidth: '780px',
          width: '100%',
          marginBottom: '40px',
        }}
      >
        {['A\'râf 7:180', 'İsrâ 17:110', 'Tâhâ 20:8', 'Haşr 59:24'].map((ref) => (
          <div key={ref} style={{
            ...GLASS_CARD,
            padding: '14px 12px',
            textAlign: 'center',
          }}>
            <div style={{ ...sectionLabel, marginBottom: '6px', fontSize: '0.62rem' }}>
              {ref}
            </div>
            <div style={{ color: COLORS.silver, fontSize: '0.78rem', fontFamily: FONTS.body, lineHeight: 1.4 }}>
              {tr ? '"En güzel isimler O\'nundur"' : '"The most beautiful names belong to Him"'}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Sayaç şeridi */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ duration: 0.9, delay: 1.1 }}
        style={{
          color: COLORS.silver,
          fontFamily: FONTS.body,
          fontSize: '0.85rem',
          letterSpacing: '0.12em',
          textAlign: 'center',
        }}
      >
        {tr ? '114 isim · 6.236 âyet · 1 mimar' : '114 names · 6,236 verses · one architect'}
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 2: Dev server'da görsel doğrulama**

Run:
```bash
cd /Users/serdar/dev/00_dev_PROJECTS/01_qurancodex/next
npm run dev
```

Open: `http://localhost:3000/tr/arac/esma-frekans/`

**Checklist:**
- [ ] Bismillah ornamenti üstte, gold
- [ ] Şûrâ 42:11 ayeti Arapça + TR + ref görünür
- [ ] "ESMÂ-İ HÜSNÂ" başlığı büyük, beyaz
- [ ] "Allah'ın Kur'an'da Kendini Tanıtması" alt başlık italic, silver
- [ ] 4 temel ayet kartı responsive (mobilde 2x2 veya 1x4)
- [ ] "114 isim · 6.236 âyet · 1 mimar" şeridi en altta
- [ ] Console hatası yok

EN için: `http://localhost:3000/en/arac/esma-frekans/`
- [ ] Tüm metinler İngilizce'ye dönmüş

Mobil emülatörde (DevTools 390px):
- [ ] Tüm metin sığar, taşma yok
- [ ] Şûrâ 42:11 ayeti satırlara taşar ama okunabilir

- [ ] **Step 3: Commit**

```bash
cd /Users/serdar/dev/00_dev_PROJECTS/01_qurancodex
git add next/src/components/EsmaFrekans.jsx
git commit -m "feat(esma): rewrite EsmaFrekans — section 1 Hero (Şûrâ 42:11 + 4 temel ayet)"
```

---

### Task 9: Section 2 — Manifesto (Celal ↔ Cemal)

**Files:**
- Modify: `next/src/components/EsmaFrekans.jsx` — `<Hero />` altına `<Manifesto />` ekle ve component'ı yaz

- [ ] **Step 1: Manifesto component'ını ekle**

Main component'ta `<Hero tr={tr} />` satırının altına ekle:
```jsx
      <Manifesto tr={tr} />
```

Dosyanın en altına Manifesto component'ını ekle:

```jsx
// ═════════════════════════════════════════════════════════════════════════════
// SECTION 2: MANIFESTO — Celal ↔ Cemal dengesi
// ═════════════════════════════════════════════════════════════════════════════

// Editoryal sınıflandırma — temsili 5-6 isim her sütunda
const CELAL_NAMES = [
  { ar: 'ٱلْجَبَّار',   tr: 'El-Cebbâr',     en: 'al-Jabbār'     },
  { ar: 'ٱلْقَهَّار',   tr: 'El-Kahhâr',     en: 'al-Qahhār'     },
  { ar: 'ٱلْعَزِيز',    tr: 'El-Azîz',       en: 'al-ʿAzīz'      },
  { ar: 'ٱلْمُتَكَبِّر', tr: 'El-Mütekebbir', en: 'al-Mutakabbir' },
  { ar: 'ٱلْمُنْتَقِم',  tr: 'El-Müntekim',   en: 'al-Muntaqim'   },
  { ar: 'ذُو ٱلْجَلَال', tr: "Zü'l-Celâl",    en: "Dhū'l-Jalāl"   },
];

const CEMAL_NAMES = [
  { ar: 'ٱلرَّحْمَٰن',  tr: 'Er-Rahmân',     en: 'ar-Raḥmān'     },
  { ar: 'ٱلرَّحِيم',    tr: 'Er-Rahîm',      en: 'ar-Raḥīm'      },
  { ar: 'ٱلْوَدُود',    tr: 'El-Vedûd',      en: 'al-Wadūd'      },
  { ar: 'ٱللَّطِيف',    tr: 'El-Latîf',      en: 'al-Laṭīf'      },
  { ar: 'ٱلرَّؤُوف',    tr: 'Er-Raûf',       en: 'ar-Raʾūf'      },
  { ar: 'ٱلْغَفُور',    tr: 'El-Gafûr',      en: 'al-Ghafūr'     },
];

function Manifesto({ tr }) {
  return (
    <section style={{
      padding: '80px 24px',
      background: 'linear-gradient(180deg, ' + COLORS.cosmicBlack + ' 0%, #0d1b2a 50%, ' + COLORS.cosmicBlack + ' 100%)',
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={sectionLabel}>{tr ? 'Manifesto' : 'Manifesto'}</div>
        <h2 style={{
          fontFamily: FONTS.display,
          fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
          color: COLORS.offWhite,
          fontWeight: 700,
          margin: '0 0 16px',
          maxWidth: '600px',
        }}>
          {tr ? 'Celal ↔ Cemal' : 'Jalāl ↔ Jamāl'}
        </h2>
        <p style={{
          color: COLORS.silver,
          fontFamily: FONTS.body,
          fontSize: '1.1rem',
          lineHeight: 1.8,
          maxWidth: '720px',
          marginBottom: '50px',
        }}>
          {tr
            ? 'Allah kendini ne uzak ve korkulan bir güç, ne de tek başına bir sığınak olarak tanıtır. Kur\'an\'ın ilah tasavvuru bir dengedir — sarsılmaz kudret (Celal) ve sığınılacak şefkat (Cemal) bir arada.'
            : "God describes Himself neither as a distant feared power nor as a sole refuge. The Quran's vision of divinity is a balance — unshakable might (Jalāl) and embracing mercy (Jamāl) together."}
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
        }}>
          <ColumnCelal tr={tr} />
          <ColumnCemal tr={tr} />
        </div>

        <p style={{
          marginTop: '40px',
          color: COLORS.silver,
          fontFamily: FONTS.body,
          fontSize: '0.78rem',
          fontStyle: 'italic',
          lineHeight: 1.6,
          opacity: 0.7,
        }}>
          {tr
            ? 'Bu sınıflandırma anlatısal bir denge gösterimi için yapılmıştır; bir isim hem celâl hem cemal boyutuna sahip olabilir.'
            : 'This classification is for narrative balance only; a single name can carry both Jalāl and Jamāl dimensions.'}
        </p>
      </div>
    </section>
  );
}

function ColumnCelal({ tr }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.7 }}
      style={{
        ...GLASS_CARD,
        background: 'linear-gradient(135deg, rgba(45,52,80,0.4), rgba(255,255,255,0.04))',
        border: '1px solid rgba(150,160,200,0.18)',
        padding: '28px 24px',
      }}
    >
      <div style={{
        color: '#a8b5d4',
        fontFamily: FONTS.body,
        fontSize: '0.72rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.18em',
        marginBottom: '8px',
      }}>
        {tr ? 'Celal' : 'Jalāl'}
      </div>
      <div style={{
        color: COLORS.silver,
        fontFamily: FONTS.body,
        fontSize: '0.78rem',
        fontStyle: 'italic',
        marginBottom: '24px',
      }}>
        {tr ? 'Sarsılmaz yücelik ve kudret' : 'Unshakable might and majesty'}
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {CELAL_NAMES.map(n => (
          <li key={n.tr} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <span dir="rtl" lang="ar" style={{ fontFamily: FONTS.quran, fontSize: '1.2rem', color: '#c4d0ea' }}>
              {n.ar}
            </span>
            <span style={{ fontFamily: FONTS.body, fontSize: '0.85rem', color: COLORS.silver }}>
              {tr ? n.tr : n.en}
            </span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

function ColumnCemal({ tr }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.7 }}
      style={{
        ...GLASS_CARD,
        background: 'linear-gradient(135deg, rgba(26,122,76,0.18), rgba(212,165,116,0.06))',
        border: `1px solid ${COLORS.softGoldAlpha30}`,
        padding: '28px 24px',
      }}
    >
      <div style={{
        color: COLORS.gold,
        fontFamily: FONTS.body,
        fontSize: '0.72rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.18em',
        marginBottom: '8px',
      }}>
        {tr ? 'Cemal' : 'Jamāl'}
      </div>
      <div style={{
        color: COLORS.silver,
        fontFamily: FONTS.body,
        fontSize: '0.78rem',
        fontStyle: 'italic',
        marginBottom: '24px',
      }}>
        {tr ? 'Sığınılacak şefkat ve sevgi' : 'Embracing mercy and love'}
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {CEMAL_NAMES.map(n => (
          <li key={n.tr} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <span dir="rtl" lang="ar" style={{ fontFamily: FONTS.quran, fontSize: '1.2rem', color: COLORS.gold }}>
              {n.ar}
            </span>
            <span style={{ fontFamily: FONTS.body, fontSize: '0.85rem', color: COLORS.silver }}>
              {tr ? n.tr : n.en}
            </span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
```

`tokens.js`'te `COLORS.softGoldAlpha30` mevcut mu kontrol et — yoksa `'rgba(212,165,116,0.3)'` literal kullan.

- [ ] **Step 2: Görsel doğrulama**

Dev server hâlâ açık. Refresh.

**Checklist:**
- [ ] "Celal ↔ Cemal" başlığı görünür
- [ ] Sol sütun: Celal (mavi-gri ton) — 6 isim, Arapça sağda
- [ ] Sağ sütun: Cemal (gold-emerald ton) — 6 isim
- [ ] Scroll ile sütunlar zıt yönlerden slide-in
- [ ] Mobilde 390px: sütunlar üst-üste stack (Celal üstte, Cemal altta)
- [ ] Editoryal dipnot italik, opacity düşük

- [ ] **Step 3: Commit**

```bash
cd /Users/serdar/dev/00_dev_PROJECTS/01_qurancodex
git add next/src/components/EsmaFrekans.jsx
git commit -m "feat(esma): add section 2 Manifesto (Celal ↔ Cemal balance)"
```

---

### Task 10: Section 3 — Üç Flagship Pasaj

**Files:**
- Modify: `next/src/components/EsmaFrekans.jsx`

- [ ] **Step 1: FlagshipVerses component'ını ekle**

Main return'da `<Manifesto />` altına:
```jsx
      <FlagshipVerses tr={tr} />
```

Dosyanın altına:

```jsx
// ═════════════════════════════════════════════════════════════════════════════
// SECTION 3: FLAGSHIP PASAJLAR — Âyetü'l-Kürsî · Haşr 59:22-24 · İhlâs 112
// ═════════════════════════════════════════════════════════════════════════════

const AYET_KURSI = {
  ref: 'Bakara 2:255',
  refEn: 'Baqara 2:255',
  title: 'Âyetü\'l-Kürsî',
  titleEn: 'Āyat al-Kursī',
  intro: 'Allah\'ın zatını uyuklamayan, tüm evreni canlı tutan sarsılmaz bir güç olarak tanımlayan en meşhur ayet.',
  introEn: 'The most famous verse describing God as the unsleeping, ever-sustaining power who holds all existence.',
  arabic: 'ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ ۚ لَا تَأْخُذُهُۥ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُۥ مَا فِى ٱلسَّمَٰوَٰتِ وَمَا فِى ٱلْأَرْضِ ۗ مَن ذَا ٱلَّذِى يَشْفَعُ عِندَهُۥٓ إِلَّا بِإِذْنِهِۦ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَىْءٍ مِّنْ عِلْمِهِۦٓ إِلَّا بِمَا شَآءَ ۚ وَسِعَ كُرْسِيُّهُ ٱلسَّمَٰوَٰتِ وَٱلْأَرْضَ ۖ وَلَا يَـُٔودُهُۥ حِفْظُهُمَا ۚ وَهُوَ ٱلْعَلِىُّ ٱلْعَظِيمُ',
  highlighted: [
    { ar: 'ٱللَّهُ',     tr: 'Allah',     en: 'Allah'        },
    { ar: 'ٱلْحَىُّ',     tr: 'El-Hayy',    en: 'al-Ḥayy'     },
    { ar: 'ٱلْقَيُّومُ',  tr: 'El-Kayyûm',  en: 'al-Qayyūm'   },
    { ar: 'ٱلْعَلِىُّ',   tr: 'El-Aliyy',   en: 'al-ʿAlī'     },
    { ar: 'ٱلْعَظِيمُ',   tr: 'El-Azîm',    en: 'al-ʿAẓīm'    },
  ],
};

const HASR_VERSE = {
  ref: 'Haşr 59:22-24',
  refEn: 'Ḥashr 59:22-24',
  title: 'Haşr 59:22-24',
  titleEn: 'Ḥashr 59:22-24',
  intro: "Kur'an'daki en yoğun ilahi isim pasajı — 13 isim peş peşe.",
  introEn: "The densest passage of divine names in the Quran — 13 names in succession.",
  arabic: 'هُوَ ٱللَّهُ ٱلَّذِى لَآ إِلَٰهَ إِلَّا هُوَ ۖ عَٰلِمُ ٱلْغَيْبِ وَٱلشَّهَٰدَةِ ۖ هُوَ ٱلرَّحْمَٰنُ ٱلرَّحِيمُ ۝ هُوَ ٱللَّهُ ٱلَّذِى لَآ إِلَٰهَ إِلَّا هُوَ ٱلْمَلِكُ ٱلْقُدُّوسُ ٱلسَّلَٰمُ ٱلْمُؤْمِنُ ٱلْمُهَيْمِنُ ٱلْعَزِيزُ ٱلْجَبَّارُ ٱلْمُتَكَبِّرُ ۚ سُبْحَٰنَ ٱللَّهِ عَمَّا يُشْرِكُونَ ۝ هُوَ ٱللَّهُ ٱلْخَٰلِقُ ٱلْبَارِئُ ٱلْمُصَوِّرُ ۖ لَهُ ٱلْأَسْمَآءُ ٱلْحُسْنَىٰ',
  highlighted: [
    { ar: 'ٱلرَّحْمَٰنُ', tr: 'Er-Rahmân',     en: 'ar-Raḥmān'     },
    { ar: 'ٱلرَّحِيمُ',   tr: 'Er-Rahîm',      en: 'ar-Raḥīm'      },
    { ar: 'ٱلْمَلِكُ',    tr: 'El-Melik',      en: 'al-Malik'      },
    { ar: 'ٱلْقُدُّوسُ',  tr: 'El-Kuddûs',     en: 'al-Quddūs'     },
    { ar: 'ٱلسَّلَٰمُ',   tr: 'Es-Selâm',      en: 'as-Salām'      },
    { ar: 'ٱلْمُؤْمِنُ',  tr: "El-Mü'min",     en: "al-Muʾmin"     },
    { ar: 'ٱلْمُهَيْمِنُ',tr: 'El-Müheymin',   en: 'al-Muhaymin'   },
    { ar: 'ٱلْعَزِيزُ',   tr: 'El-Azîz',       en: 'al-ʿAzīz'      },
    { ar: 'ٱلْجَبَّارُ',  tr: 'El-Cebbâr',     en: 'al-Jabbār'     },
    { ar: 'ٱلْمُتَكَبِّرُ',tr: 'El-Mütekebbir', en: 'al-Mutakabbir' },
    { ar: 'ٱلْخَٰلِقُ',   tr: 'El-Hâlık',      en: 'al-Khāliq'     },
    { ar: 'ٱلْبَارِئُ',   tr: "El-Bâri'",      en: "al-Bāriʾ"      },
    { ar: 'ٱلْمُصَوِّرُ', tr: 'El-Musavvir',   en: 'al-Muṣawwir'   },
  ],
};

const IHLAS_VERSE = {
  ref: 'İhlâs 112:1-4',
  refEn: 'Ikhlāṣ 112:1-4',
  title: 'İhlâs Suresi',
  titleEn: 'Sūrat al-Ikhlāṣ',
  intro: "Mutlak teklik — negatif tanım ile eşsizlik (Ehad + Samed + 'kimseden doğmamış, kimseyi doğurmamış').",
  introEn: "Absolute oneness — uniqueness through negative description (al-Aḥad + aṣ-Ṣamad + 'neither begotten nor begetting').",
  arabic: 'قُلْ هُوَ ٱللَّهُ أَحَدٌ ۝ ٱللَّهُ ٱلصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌۢ',
  highlighted: [
    { ar: 'أَحَدٌ',   tr: 'El-Ehad',  en: 'al-Aḥad'   },
    { ar: 'ٱلصَّمَدُ', tr: 'Es-Samed', en: 'aṣ-Ṣamad'  },
  ],
};

const FLAGSHIPS = [AYET_KURSI, HASR_VERSE, IHLAS_VERSE];

function FlagshipVerses({ tr }) {
  return (
    <section style={{ padding: '80px 24px', background: COLORS.cosmicBlack }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={sectionLabel}>{tr ? 'Üç Flagship Pasaj' : 'Three Flagship Passages'}</div>
        <h2 style={{
          fontFamily: FONTS.display,
          fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
          color: COLORS.offWhite,
          fontWeight: 700,
          margin: '0 0 50px',
          maxWidth: '720px',
        }}>
          {tr ? 'İsimlerin En Yoğun Kümelendiği Üç Pasaj' : 'Three Passages with the Densest Divine Names'}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '50px' }}>
          {FLAGSHIPS.map((v, i) => (
            <FlagshipCard key={v.ref} verse={v} index={i + 1} tr={tr} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FlagshipCard({ verse, index, tr }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.7 }}
      style={{
        ...GLASS_CARD,
        padding: '36px 28px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', marginBottom: '14px' }}>
        <span style={{
          color: COLORS.gold,
          fontFamily: FONTS.display,
          fontSize: '1.8rem',
          fontWeight: 700,
          lineHeight: 1,
        }}>
          {String(index).padStart(2, '0')}
        </span>
        <h3 style={{
          fontFamily: FONTS.display,
          fontSize: '1.4rem',
          color: COLORS.offWhite,
          fontWeight: 700,
          margin: 0,
        }}>
          {tr ? verse.title : verse.titleEn}
        </h3>
        <span style={{ color: COLORS.silver, fontSize: '0.78rem', fontFamily: FONTS.body, letterSpacing: '0.08em', marginLeft: 'auto' }}>
          {tr ? verse.ref : verse.refEn}
        </span>
      </div>

      <p style={{
        color: COLORS.silver,
        fontFamily: FONTS.body,
        fontSize: '0.95rem',
        lineHeight: 1.7,
        margin: '0 0 24px',
        maxWidth: '720px',
      }}>
        {tr ? verse.intro : verse.introEn}
      </p>

      <div
        dir="rtl"
        lang="ar"
        style={{
          fontFamily: FONTS.quran,
          fontSize: 'clamp(1.4rem, 3vw, 1.8rem)',
          color: COLORS.offWhite,
          lineHeight: 2.4,
          padding: '20px 0',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          textAlign: 'right',
        }}
      >
        {highlightNames(verse.arabic, verse.highlighted)}
      </div>

      <div style={{
        marginTop: '20px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
      }}>
        {verse.highlighted.map(n => (
          <span key={n.tr} style={{
            background: COLORS.softGoldAlpha12 || 'rgba(212,165,116,0.12)',
            border: `1px solid ${COLORS.softGoldAlpha25 || 'rgba(212,165,116,0.25)'}`,
            borderRadius: '14px',
            padding: '4px 12px',
            fontSize: '0.78rem',
            color: COLORS.gold,
            fontFamily: FONTS.body,
          }}>
            {tr ? n.tr : n.en}
          </span>
        ))}
      </div>
    </motion.article>
  );
}

// Belirtilen isimleri Arapça metinde altı çizili olarak işaretle
function highlightNames(arabic, names) {
  let parts = [{ text: arabic, plain: true }];
  names.forEach(n => {
    const newParts = [];
    parts.forEach(p => {
      if (!p.plain) { newParts.push(p); return; }
      const idx = p.text.indexOf(n.ar);
      if (idx === -1) { newParts.push(p); return; }
      const before = p.text.slice(0, idx);
      const after = p.text.slice(idx + n.ar.length);
      if (before) newParts.push({ text: before, plain: true });
      newParts.push({ text: n.ar, plain: false });
      if (after) newParts.push({ text: after, plain: true });
    });
    parts = newParts;
  });

  return parts.map((p, i) =>
    p.plain
      ? <span key={i}>{p.text}</span>
      : <span key={i} style={{
          color: COLORS.gold,
          borderBottom: `2px solid ${COLORS.gold}`,
          paddingBottom: '2px',
        }}>{p.text}</span>
  );
}
```

- [ ] **Step 2: Görsel doğrulama**

Refresh dev server.

**Checklist:**
- [ ] 3 flagship kart sırayla aşağıya akıyor (01, 02, 03)
- [ ] Âyetü'l-Kürsî: Allah, Hayy, Kayyûm, Aliyy, Azîm gold altı çizili
- [ ] Haşr 59:22-24: 13 isim peş peşe altı çizili
- [ ] İhlâs: Ehad ve Samed altı çizili
- [ ] Her kart altında isim chip'leri (gold)
- [ ] Mobilde 390px: kart genişliği uyumlu, Arapça okunabilir
- [ ] Arapça encoding renderı temiz — yarım daireli sukun yok, tofu yok

⚠ Eğer Arapça render bozuksa: bu Tasarım dokümanı §6 + spec §13.15 problemidir. Arapça metinleri verse-graph-bgem3.json'dan çek (Task 3'teki gibi). Hardcoded yerine `data.beyanlari` üzerinden bağla.

- [ ] **Step 3: Commit**

```bash
cd /Users/serdar/dev/00_dev_PROJECTS/01_qurancodex
git add next/src/components/EsmaFrekans.jsx
git commit -m "feat(esma): add section 3 flagship verses (Kursi, Hashr, Ikhlas) with name highlighting"
```

---

### Task 11: Section 4 — Frekans Manzarası (Allah 2699 lemma notu ile)

**Files:**
- Modify: `next/src/components/EsmaFrekans.jsx`

- [ ] **Step 1: FrequencyLandscape component'ını ekle**

Main return'da:
```jsx
      <FrequencyLandscape data={data} tr={tr} />
```

`data` prop'u Hero parametresinde de kullanılabilir; ama EsmaFrekans state'i: değiştir:

```jsx
      <FlagshipVerses tr={tr} />
      <FrequencyLandscape data={data} tr={tr} />
```

Dosyanın altına component:

```jsx
// ═════════════════════════════════════════════════════════════════════════════
// SECTION 4: FREKANS MANZARASI — Top 20 bar chart + Allah lemma notu
// ═════════════════════════════════════════════════════════════════════════════

function FrequencyLandscape({ data, tr }) {
  const [showAllahNote, setShowAllahNote] = useState(false);

  const top20 = useMemo(() => {
    if (!data?.isimler) return [];
    // Allah için displayCount override (klasik 2699)
    const isimler = data.isimler.map(n => ({
      ...n,
      displayCount: n.isim === 'Allah' ? ALLAH_CLASSIC_COUNT : n.kuranda_gecis_sayisi,
    }));
    return [...isimler].sort((a, b) => b.displayCount - a.displayCount).slice(0, 20);
  }, [data]);

  if (!data) return null;
  const maxCount = top20[0]?.displayCount || 1;

  return (
    <section style={{ padding: '80px 24px', background: '#06080e' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={sectionLabel}>{tr ? 'Frekans Manzarası' : 'Frequency Landscape'}</div>
        <h2 style={{
          fontFamily: FONTS.display,
          fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
          color: COLORS.offWhite,
          fontWeight: 700,
          margin: '0 0 16px',
          maxWidth: '720px',
        }}>
          {tr ? 'En Sık Geçen 20 İsim' : 'Top 20 Most Frequent Names'}
        </h2>
        <p style={{ color: COLORS.silver, fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '40px', maxWidth: '720px' }}>
          {tr
            ? 'Allah lafzası 2.699 geçişle uzak ara önde — yaklaşık her 2,3 ayette bir. Sonra El-Hakk, El-Alîm, Er-Rahîm gibi sıfat-isimler gelir.'
            : 'The name Allah leads by far with 2,699 occurrences — roughly every 2.3 verses. Then come attribute-names like al-Ḥaqq, al-ʿAlīm, ar-Raḥīm.'}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {top20.map((n, i) => (
            <FreqBar key={n.isim} item={n} max={maxCount} tr={tr} rank={i + 1} onAllahNoteClick={() => setShowAllahNote(true)} />
          ))}
        </div>

        {showAllahNote && (
          <AllahLemmaNote tr={tr} onClose={() => setShowAllahNote(false)} />
        )}
      </div>
    </section>
  );
}

function FreqBar({ item, max, tr, rank, onAllahNoteClick }) {
  const isAllah = item.isim === 'Allah';
  const pct = (item.displayCount / max) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: rank * 0.02 }}
      style={{ display: 'grid', gridTemplateColumns: '24px 110px 1fr 70px', gap: '12px', alignItems: 'center' }}
    >
      <span style={{ color: COLORS.slate500 || 'rgba(148,163,184,0.5)', fontSize: '0.7rem', fontFamily: FONTS.body, textAlign: 'right' }}>
        {rank}
      </span>
      <span style={{ color: COLORS.offWhite, fontSize: '0.85rem', fontFamily: FONTS.body, fontWeight: 600 }}>
        {item.isim}
      </span>
      <div style={{ position: 'relative', height: '24px', background: 'rgba(255,255,255,0.04)', borderRadius: '4px' }}>
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          style={{
            height: '100%',
            background: `linear-gradient(90deg, ${COLORS.gold}cc, ${COLORS.gold}66)`,
            borderRadius: '4px',
          }}
        />
      </div>
      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
        <span style={{ color: COLORS.offWhite, fontSize: '0.85rem', fontFamily: FONTS.body, fontWeight: 700 }}>
          {item.displayCount.toLocaleString(tr ? 'tr-TR' : 'en-US')}
        </span>
        {isAllah && (
          <button
            onClick={onAllahNoteClick}
            aria-label={tr ? 'Sayım metodolojisi' : 'Counting methodology'}
            style={{
              background: 'none',
              border: 'none',
              color: COLORS.gold,
              cursor: 'pointer',
              fontSize: '0.85rem',
              padding: 0,
            }}
          >
            ⓘ
          </button>
        )}
      </span>
    </motion.div>
  );
}

function AllahLemmaNote({ tr, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        marginTop: '32px',
        ...GLASS_CARD,
        padding: '24px 28px',
        position: 'relative',
      }}
    >
      <button
        onClick={onClose}
        aria-label={tr ? 'Kapat' : 'Close'}
        style={{ position: 'absolute', top: '12px', right: '12px', background: 'none', border: 'none', color: COLORS.silver, cursor: 'pointer', fontSize: '1.2rem' }}
      >
        ×
      </button>
      <div style={{ ...sectionLabel, marginBottom: '12px' }}>{tr ? 'Metodolojik Nüans' : 'Methodological Nuance'}</div>
      <p style={{ color: COLORS.offWhite, fontSize: '0.95rem', lineHeight: 1.8, margin: '0 0 12px' }}>
        {tr
          ? <>Klasik konkordans (M. Fuâd Abdülbâkî, el-Mu'cemü'l-Müfehres) <strong>lemma sayımı</strong> esas alır: bir ismin tüm morfolojik formları (<code>Allāhu</code>, <code>Allāhi</code>, <code>Allāha</code>) ve önek'li türevleri (<code>lillāh</code>, <code>billāh</code>, <code>wallāh</code>, <code>fallāh</code>) tek bir isim sayılır.</>
          : <>The classical concordance (M. Fuʾād ʿAbd al-Bāqī, al-Muʿjam al-Mufahras) uses <strong>lemma counting</strong>: all morphological forms of a name (<code>Allāhu</code>, <code>Allāhi</code>, <code>Allāha</code>) and prefixed forms (<code>lillāh</code>, <code>billāh</code>, <code>wallāh</code>, <code>fallāh</code>) count as one name.</>}
      </p>
      <p style={{ color: COLORS.silver, fontSize: '0.88rem', lineHeight: 1.7, margin: 0 }}>
        {tr
          ? <>Bu nedenle klasik rakamlar (Allah=2.699), yalın yüzey lafzı sayımına (~{ALLAH_SURFACE_COUNT.toLocaleString('tr-TR')}) göre daha yüksek görünür. Bu metodolojik bir tercihtir, sayım hatası değildir.</>
          : <>This is why classical figures (Allah=2,699) appear higher than strict surface counts (~{ALLAH_SURFACE_COUNT.toLocaleString('en-US')}). It is a methodological choice, not a counting error.</>}
      </p>
    </motion.div>
  );
}
```

- [ ] **Step 2: Görsel doğrulama**

Refresh.

**Checklist:**
- [ ] Top 20 bar chart görünür
- [ ] Allah satırı en üstte, 2,699 sayısı + ⓘ ikonu
- [ ] El-Hakk 176, El-Alîm 161, Er-Rahîm 115, El-Azîm 107 sıralaması doğru
- [ ] ⓘ tıklayınca lemma açıklaması açılır
- [ ] Lemma notunda Allāhu, lillāh, wallāh örnekleri görünür
- [ ] × ile kapanır

- [ ] **Step 3: Commit**

```bash
cd /Users/serdar/dev/00_dev_PROJECTS/01_qurancodex
git add next/src/components/EsmaFrekans.jsx
git commit -m "feat(esma): add section 4 frequency landscape with Allah lemma transparency"
```

---

### Task 12: Section 5 — Vahyin Sesi (Progressive Disclosure 6+8)

**Files:**
- Modify: `next/src/components/EsmaFrekans.jsx`

- [ ] **Step 1: DivineVoice component'ını ekle**

Main return'da:
```jsx
      <DivineVoice beyanlari={beyanlari} tr={tr} />
```

Component:

```jsx
// ═════════════════════════════════════════════════════════════════════════════
// SECTION 5: VAHYIN SESI — 14 tematik eksen, 6 görünür + 8 expand
// ═════════════════════════════════════════════════════════════════════════════

const FOREGROUND_AXES = ['varlik-teklik', 'yakinlik', 'rahmet-af', 'yaraticilik', 'kudret', 'nur'];

function DivineVoice({ beyanlari, tr }) {
  const [expanded, setExpanded] = useState(false);

  if (!beyanlari) return null;

  const fg = beyanlari.eksenler.filter(e => FOREGROUND_AXES.includes(e.id));
  const bg = beyanlari.eksenler.filter(e => !FOREGROUND_AXES.includes(e.id));

  return (
    <section style={{ padding: '80px 24px', background: COLORS.cosmicBlack }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={sectionLabel}>{tr ? 'Vahyin Sesi' : 'The Voice of Revelation'}</div>
        <h2 style={{
          fontFamily: FONTS.display,
          fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
          color: COLORS.offWhite,
          fontWeight: 700,
          margin: '0 0 16px',
          maxWidth: '720px',
        }}>
          {tr ? "Allah'ın Doğrudan Beyanları" : "God's Direct Self-Statements"}
        </h2>
        <p style={{ color: COLORS.silver, fontSize: '1.05rem', lineHeight: 1.8, margin: '0 0 50px', maxWidth: '720px' }}>
          {tr
            ? "Allah kendisini bazen üçüncü şahıs üzerinden, bazen doğrudan birinci şahıs üzerinden (\"Ben\", \"Biz\") tanıtır. Bu pasajlar onun kendi ağzından tanımıdır."
            : "God describes Himself sometimes in the third person, sometimes directly in the first person (\"I\", \"We\"). These passages are His self-description in His own voice."}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {fg.map(eks => <AxisCard key={eks.id} eks={eks} tr={tr} />)}
        </div>

        {!expanded && (
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <button
              onClick={() => setExpanded(true)}
              style={{
                background: 'transparent',
                border: `1px solid ${COLORS.softGoldAlpha40 || 'rgba(212,165,116,0.4)'}`,
                borderRadius: '10px',
                color: COLORS.gold,
                padding: '12px 28px',
                fontSize: '0.92rem',
                fontFamily: FONTS.body,
                cursor: 'pointer',
                transition: `all ${TRANSITION?.fast || '0.15s'}`,
              }}
            >
              {tr ? `Diğer ${bg.length} ekseni göster →` : `Show ${bg.length} more axes →`}
            </button>
          </div>
        )}

        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.5 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '20px' }}
          >
            {bg.map(eks => <AxisCard key={eks.id} eks={eks} tr={tr} />)}
          </motion.div>
        )}
      </div>
    </section>
  );
}

function AxisCard({ eks, tr }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5 }}
      style={{ ...GLASS_CARD, padding: '24px 22px', display: 'flex', flexDirection: 'column' }}
    >
      <h3 style={{
        fontFamily: FONTS.display,
        fontSize: '1.15rem',
        color: COLORS.gold,
        fontWeight: 700,
        margin: '0 0 8px',
      }}>
        {tr ? eks.baslikTr : eks.baslikEn}
      </h3>
      <p style={{
        color: COLORS.silver,
        fontSize: '0.82rem',
        fontStyle: 'italic',
        lineHeight: 1.6,
        margin: '0 0 18px',
      }}>
        {tr ? eks.notTr : eks.notEn}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
        {eks.ayetler.slice(0, 2).map(a => (
          <div key={a.id} style={{
            paddingTop: '14px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
          }}>
            <p
              dir="rtl"
              lang="ar"
              style={{
                fontFamily: FONTS.quran,
                fontSize: '1rem',
                color: COLORS.offWhite,
                lineHeight: 2.2,
                margin: '0 0 8px',
                textAlign: 'right',
              }}
            >
              {a.arapca}
            </p>
            <p style={{ color: COLORS.silver, fontSize: '0.78rem', lineHeight: 1.6, margin: '0 0 4px', fontStyle: 'italic' }}>
              "{tr ? a.tr : a.en}"
            </p>
            <p style={{ color: `${COLORS.gold}99`, fontSize: '0.72rem', fontFamily: FONTS.body, margin: 0, letterSpacing: '0.06em' }}>
              — {a.sure}:{a.ayet}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 2: Görsel doğrulama**

Refresh.

**Checklist:**
- [ ] 6 ön plan eksen kartı görünür (Varlığı, Yakınlığı, Rahmeti, Yaratıcılığı, Kudreti, Nur)
- [ ] Her kartta ilk 2 ayet (Arapça + TR + ref)
- [ ] "Diğer 8 ekseni göster →" butonu altta
- [ ] Tıklayınca 8 ek eksen aşağıda açılır (animasyon)
- [ ] Mobilde 1 sütun, tablette 2, desktop'ta 3-4 sütun
- [ ] Arapça encoding temiz

- [ ] **Step 3: Commit**

```bash
cd /Users/serdar/dev/00_dev_PROJECTS/01_qurancodex
git add next/src/components/EsmaFrekans.jsx
git commit -m "feat(esma): add section 5 Vahyin Sesi (14 axes with progressive disclosure)"
```

---

### Task 13: Section 6 — 114 İsim Atlası (search + filter + inline detay)

**Files:**
- Modify: `next/src/components/EsmaFrekans.jsx`

- [ ] **Step 1: NamesAtlas component'ını ekle**

Main return'da:
```jsx
      <NamesAtlas data={data} tr={tr} />
```

Component:

```jsx
// ═════════════════════════════════════════════════════════════════════════════
// SECTION 6: 114 İSIM ATLASI — search + 3'lü filter + inline detay
// ═════════════════════════════════════════════════════════════════════════════

// 8 isim için kök DNA (Doküman 5)
const KOK_ANALIZ = {
  'Er-Rahmân':  { kok: 'ر ح م', anlamTr: 'Rahmet · şefkat · koruyuculuk', anlamEn: 'mercy · compassion · protection', notTr: '"Rahim" (anne rahmi) ile aynı köktendir.', notEn: 'Same root as "raḥim" (mother\'s womb).' },
  'Er-Rahîm':   { kok: 'ر ح م', anlamTr: 'Rahmet · şefkat · koruyuculuk', anlamEn: 'mercy · compassion · protection', notTr: '"Rahim" (anne rahmi) ile aynı köktendir.', notEn: 'Same root as "raḥim" (mother\'s womb).' },
  'El-Hâlık':   { kok: 'خ ل ق', anlamTr: 'Ölçüyle yaratmak · tasarlamak · biçim vermek', anlamEn: 'create with measure · design · shape', notTr: null, notEn: null },
  'El-Alîm':    { kok: 'ع ل م', anlamTr: 'Bilmek · fark etmek · kesin bilgi sahibi olmak', anlamEn: 'to know · perceive · possess certain knowledge', notTr: null, notEn: null },
  'El-Hakîm':   { kok: 'ح ك م', anlamTr: 'Hükmetmek · hikmet · düzen kurmak', anlamEn: 'to judge · wisdom · order', notTr: null, notEn: null },
  'En-Nûr':     { kok: 'ن و ر', anlamTr: 'Işık · aydınlık · görünür kılma', anlamEn: 'light · brightness · revelation', notTr: null, notEn: null },
  'El-Vedûd':   { kok: 'و د د', anlamTr: 'Sevgi · içten bağlılık', anlamEn: 'love · sincere attachment', notTr: null, notEn: null },
  'El-Azîz':    { kok: 'ع ز ز', anlamTr: 'Güç · üstünlük · yenilmezlik', anlamEn: 'might · superiority · invincibility', notTr: null, notEn: null },
  'El-Kayyûm':  { kok: 'ق و م', anlamTr: 'Ayakta tutmak · süreklilik sağlamak · varlığı devam ettirmek', anlamEn: 'sustain · maintain continuity · uphold existence', notTr: null, notEn: null },
};

const CATEGORY_FILTERS = [
  { key: 'all',         labelTr: 'Tümü',           labelEn: 'All'          },
  { key: 'isim',        labelTr: 'Lafza-i Celâl',  labelEn: 'Divine Name'  },
  { key: 'esma',        labelTr: 'Esmâ-i Hüsnâ',   labelEn: 'Esmā-i Ḥusnā' },
  { key: 'kurani_sifat',labelTr: 'Kur\'ânî Sıfat', labelEn: 'Quranic Attr.' },
];

const SORT_OPTIONS = [
  { value: 'no',         labelTr: 'Sıra',       labelEn: 'Order'    },
  { value: 'count_desc', labelTr: 'Frekans ↓',  labelEn: 'Freq ↓'   },
  { value: 'count_asc',  labelTr: 'Frekans ↑',  labelEn: 'Freq ↑'   },
];

const PAGE_SIZE = 30;

function NamesAtlas({ data, tr }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('no');
  const [openId, setOpenId] = useState(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    if (!data?.isimler) return [];
    let rows = data.isimler.map(n => ({
      ...n,
      displayCount: n.isim === 'Allah' ? ALLAH_CLASSIC_COUNT : n.kuranda_gecis_sayisi,
    }));
    if (filter !== 'all') rows = rows.filter(n => n.kategori === filter);
    const q = search.trim().toLowerCase();
    if (q) {
      rows = rows.filter(n =>
        (n.isim || '').toLowerCase().includes(q) ||
        (n.okunus || '').toLowerCase().includes(q) ||
        (n.anlam || '').toLowerCase().includes(q) ||
        (n.arapca || '').includes(q)
      );
    }
    if (sort === 'count_desc') rows.sort((a, b) => b.displayCount - a.displayCount);
    else if (sort === 'count_asc') rows.sort((a, b) => a.displayCount - b.displayCount);
    return rows;
  }, [data, filter, search, sort]);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => { setVisibleCount(PAGE_SIZE); }, [filter, search, sort]);
  /* eslint-enable react-hooks/set-state-in-effect */

  if (!data) return null;

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <section style={{ padding: '80px 24px', background: '#06080e' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={sectionLabel}>{tr ? '114 İsim Atlası' : '114 Names Atlas'}</div>
        <h2 style={{
          fontFamily: FONTS.display,
          fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
          color: COLORS.offWhite,
          fontWeight: 700,
          margin: '0 0 16px',
        }}>
          {tr ? 'Tüm İsimleri Keşfet' : 'Explore All Names'}
        </h2>
        <p style={{ color: COLORS.silver, fontSize: '0.95rem', lineHeight: 1.7, margin: '0 0 32px', maxWidth: '720px' }}>
          {tr
            ? `${data.toplam_isim_sayisi} isim · Lafza-i Celâl + 99 Esmâ-i Hüsnâ + Kur'ânî sıfat ve tamlamalar. Arama, kategori filtresi veya frekans sıralaması ile keşfet; bir isme tıklayarak detayı aç.`
            : `${data.toplam_isim_sayisi} names · the Divine Name + 99 Esmā-i Ḥusnā + Quranic attributes and compound phrases. Search, filter, or sort by frequency; tap a name to open the detail.`}
        </p>

        {/* Controls */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
          <input
            type="text"
            placeholder={tr ? 'İsim, anlam veya Arapça ara…' : 'Search name, meaning, or Arabic…'}
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              flex: '1 1 200px',
              minWidth: 0,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: COLORS.offWhite,
              padding: '10px 14px',
              fontSize: '0.9rem',
              fontFamily: FONTS.body,
              outline: 'none',
            }}
          />
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: COLORS.offWhite,
              padding: '10px 14px',
              fontSize: '0.88rem',
              fontFamily: FONTS.body,
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value} style={{ background: COLORS.cosmicBlack }}>
                {tr ? o.labelTr : o.labelEn}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px', overflowX: 'auto' }}>
          {CATEGORY_FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              aria-pressed={filter === f.key}
              style={{
                background: filter === f.key ? `${COLORS.gold}22` : 'transparent',
                border: filter === f.key ? `1px solid ${COLORS.gold}55` : '1px solid rgba(255,255,255,0.1)',
                color: filter === f.key ? COLORS.gold : COLORS.silver,
                borderRadius: '20px',
                padding: '6px 14px',
                fontSize: '0.82rem',
                fontFamily: FONTS.body,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {tr ? f.labelTr : f.labelEn}
            </button>
          ))}
        </div>

        {/* Liste */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {visible.map(n => (
            <NameRow
              key={n.isim}
              item={n}
              tr={tr}
              isOpen={openId === n.isim}
              onToggle={() => setOpenId(openId === n.isim ? null : n.isim)}
            />
          ))}
        </div>

        {hasMore && (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button
              onClick={() => setVisibleCount(v => v + PAGE_SIZE)}
              style={{
                background: 'transparent',
                border: `1px solid ${COLORS.softGoldAlpha40 || 'rgba(212,165,116,0.4)'}`,
                borderRadius: '8px',
                color: COLORS.gold,
                padding: '10px 22px',
                fontSize: '0.88rem',
                fontFamily: FONTS.body,
                cursor: 'pointer',
              }}
            >
              {tr ? `${filtered.length - visibleCount} isim daha göster` : `Show ${filtered.length - visibleCount} more`}
            </button>
          </div>
        )}

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: COLORS.silver, fontSize: '0.92rem' }}>
            {tr ? 'Sonuç bulunamadı.' : 'No results found.'}
          </div>
        )}
      </div>
    </section>
  );
}

function NameRow({ item, tr, isOpen, onToggle }) {
  const isAllah = item.isim === 'Allah';
  return (
    <>
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: '14px',
          alignItems: 'center',
          background: isOpen ? 'rgba(212,165,116,0.06)' : 'rgba(255,255,255,0.02)',
          border: isOpen ? `1px solid ${COLORS.gold}44` : '1px solid rgba(255,255,255,0.06)',
          borderRadius: '10px',
          padding: '14px 18px',
          color: COLORS.offWhite,
          fontFamily: FONTS.body,
          cursor: 'pointer',
          textAlign: 'left',
          transition: 'all 0.18s',
          width: '100%',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', minWidth: 0 }}>
          <span dir="rtl" lang="ar" style={{
            fontFamily: FONTS.quran,
            fontSize: '1.3rem',
            color: COLORS.gold,
            minWidth: '110px',
            textAlign: 'right',
            whiteSpace: 'nowrap',
          }}>
            {item.arapca}
          </span>
          <span style={{ fontWeight: 600, fontSize: '0.92rem' }}>{item.isim}</span>
          <span style={{
            color: COLORS.silver,
            fontSize: '0.78rem',
            fontStyle: 'italic',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            display: 'none',
          }} className="esma-meaning-inline">
            {item.anlam}
          </span>
        </div>
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: COLORS.silver, fontSize: '0.7rem', fontFamily: FONTS.body }}>
            {item.kategori_etiket}
          </span>
          <span style={{ color: COLORS.offWhite, fontSize: '0.88rem', fontWeight: 700 }}>
            {item.displayCount.toLocaleString(tr ? 'tr-TR' : 'en-US')}
          </span>
        </span>
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          style={{ overflow: 'hidden' }}
        >
          <NameDetail item={item} tr={tr} isAllah={isAllah} />
        </motion.div>
      )}
    </>
  );
}

function NameDetail({ item, tr, isAllah }) {
  const [showAllAyets, setShowAllAyets] = useState(false);
  const kok = KOK_ANALIZ[item.isim];

  const ayetler = item.yuksek_frekansli
    ? (showAllAyets ? item.tum_ayetler : item.ornek_ayetler)
    : item.ayetler;

  return (
    <div style={{
      ...GLASS_CARD,
      background: 'rgba(212,165,116,0.04)',
      border: `1px solid ${COLORS.gold}22`,
      padding: '28px 28px',
      marginTop: '4px',
      marginBottom: '8px',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
        <span dir="rtl" lang="ar" style={{
          fontFamily: FONTS.quran,
          fontSize: '2.6rem',
          color: COLORS.gold,
          lineHeight: 1.4,
        }}>
          {item.arapca}
        </span>
        <span style={{ color: COLORS.silver, fontSize: '0.85rem', fontStyle: 'italic', marginTop: '4px' }}>
          {item.okunus} · {item.isim}
        </span>
      </div>

      <p style={{
        color: COLORS.offWhite,
        fontSize: '1.05rem',
        lineHeight: 1.7,
        margin: '0 0 8px',
        textAlign: 'center',
      }}>
        "{item.anlam}"
      </p>
      {item.aciklama && (
        <p style={{ color: COLORS.silver, fontSize: '0.85rem', lineHeight: 1.6, margin: '0 0 20px', textAlign: 'center', fontStyle: 'italic' }}>
          {item.aciklama}
        </p>
      )}

      {kok && (
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '8px',
          padding: '14px 18px',
          margin: '0 0 20px',
        }}>
          <div style={{ ...sectionLabel, marginBottom: '8px', fontSize: '0.65rem' }}>{tr ? 'Kök Analizi' : 'Root'}</div>
          <p style={{ color: COLORS.gold, fontFamily: FONTS.quran, fontSize: '1.4rem', margin: '0 0 6px', textAlign: 'center', letterSpacing: '0.4em' }}>
            {kok.kok}
          </p>
          <p style={{ color: COLORS.offWhite, fontSize: '0.85rem', lineHeight: 1.6, margin: 0, textAlign: 'center' }}>
            {tr ? kok.anlamTr : kok.anlamEn}
          </p>
          {(tr ? kok.notTr : kok.notEn) && (
            <p style={{ color: COLORS.silver, fontSize: '0.78rem', lineHeight: 1.6, margin: '8px 0 0', textAlign: 'center', fontStyle: 'italic' }}>
              {tr ? kok.notTr : kok.notEn}
            </p>
          )}
        </div>
      )}

      {isAllah && (
        <div style={{
          background: 'rgba(212,165,116,0.08)',
          border: `1px solid ${COLORS.gold}33`,
          borderRadius: '8px',
          padding: '16px 20px',
          marginBottom: '20px',
        }}>
          <div style={{ ...sectionLabel, marginBottom: '8px', fontSize: '0.65rem' }}>{tr ? 'Metodolojik Nüans' : 'Methodological Nuance'}</div>
          <p style={{ color: COLORS.offWhite, fontSize: '0.92rem', margin: '0 0 8px' }}>
            <strong>{tr ? 'Klasik konkordans: ' : 'Classical concordance: '}</strong>
            {ALLAH_CLASSIC_COUNT.toLocaleString(tr ? 'tr-TR' : 'en-US')}
            <span style={{ color: COLORS.silver, fontSize: '0.78rem', marginLeft: '6px' }}>
              ({tr ? 'lemma — tüm morfolojik formlar dahil' : 'lemma — all morphological forms included'})
            </span>
          </p>
          <p style={{ color: COLORS.silver, fontSize: '0.82rem', lineHeight: 1.6, margin: '0 0 8px' }}>
            {tr
              ? <>Fark, <code>li- + Allah = lillāh</code>, <code>wa- + Allah = wallāh</code>, <code>bi- + Allah = billāh</code> gibi prefiks'li formların lemma sayımında dahil, yüzey sayımında dahil olmamasındandır.</>
              : <>The difference comes from prefixed forms like <code>li- + Allah = lillāh</code>, <code>wa- + Allah = wallāh</code>, <code>bi- + Allah = billāh</code> being counted in the lemma but not in surface counting.</>}
          </p>
          <p style={{ color: COLORS.silver, fontSize: '0.82rem', margin: 0 }}>
            <strong>{tr ? 'Yalın yüzey lafzı: ' : 'Surface form only: '}</strong>
            ~{ALLAH_SURFACE_COUNT.toLocaleString(tr ? 'tr-TR' : 'en-US')}
          </p>
        </div>
      )}

      <div style={{ ...sectionLabel, marginBottom: '12px', fontSize: '0.65rem' }}>
        {tr
          ? `${item.kuranda_gecis_sayisi} âyette geçer`
          : `Appears in ${item.kuranda_gecis_sayisi} verses`}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {(ayetler || []).slice(0, 30).map(a => (
          <a
            key={`${a.sure}-${a.ayet}`}
            href={`/${tr ? 'tr' : 'en'}/oku/${a.sure}`}
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              padding: '4px 10px',
              fontSize: '0.78rem',
              color: COLORS.silver,
              fontFamily: FONTS.body,
              textDecoration: 'none',
            }}
          >
            {a.sure_adi || a.sure}:{a.ayet}
          </a>
        ))}
      </div>

      {item.yuksek_frekansli && !showAllAyets && (ayetler || []).length === 15 && (
        <button
          onClick={() => setShowAllAyets(true)}
          style={{
            marginTop: '14px',
            background: 'transparent',
            border: 'none',
            color: COLORS.gold,
            fontSize: '0.82rem',
            cursor: 'pointer',
            fontFamily: FONTS.body,
          }}
        >
          {tr
            ? `Tüm ${item.kuranda_gecis_sayisi} ayeti göster →`
            : `Show all ${item.kuranda_gecis_sayisi} verses →`}
        </button>
      )}
      {item.yuksek_frekansli && showAllAyets && (
        <p style={{ color: COLORS.silver, fontSize: '0.76rem', marginTop: '10px' }}>
          {tr ? 'İlk 30 referans gösterilmiştir.' : 'First 30 references shown.'}
        </p>
      )}

      <div style={{ marginTop: '20px', textAlign: 'right' }}>
        <a
          href={`https://corpus.quran.com/search.jsp?q=${encodeURIComponent(item.arapca)}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: COLORS.gold, fontSize: '0.82rem', fontFamily: FONTS.body, textDecoration: 'none' }}
        >
          {tr ? 'Corpus Quran\'da ara →' : 'Search on Corpus Quran →'}
        </a>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Görsel doğrulama**

Refresh.

**Checklist:**
- [ ] Atlas başlığı, arama kutusu, 4 filtre chip'i, sort dropdown
- [ ] 30 isim ilk seferde görünür
- [ ] Allah satırı en başta (sıra: no)
- [ ] Tıklayınca detay paneli açılır
- [ ] Allah detay: 2699 + lemma nüansı + prefiks örnekleri
- [ ] Er-Rahmân detay: kök ر ح م + "Rahim ile aynı köktendir" notu
- [ ] El-Alîm: kök ع ل م
- [ ] Filter chip: "Kur'ânî Sıfat" tıklayınca Rabbü'l-Âlemîn, En-Nasîr vs. çıkar
- [ ] Arama "Hakk" → El-Hakk + Zü'l-Celâl gibi
- [ ] "30 isim daha göster" çalışır
- [ ] Mobilde 1 sütun, tıklama-açma akıcı

- [ ] **Step 3: Commit**

```bash
cd /Users/serdar/dev/00_dev_PROJECTS/01_qurancodex
git add next/src/components/EsmaFrekans.jsx
git commit -m "feat(esma): add section 6 names atlas with search, filter, and inline detail"
```

---

### Task 14: Section 7 — Metodoloji ve Kaynak

**Files:**
- Modify: `next/src/components/EsmaFrekans.jsx`

- [ ] **Step 1: Methodology component'ını ekle**

Main return'da, sonuncu section olarak:
```jsx
      <Methodology data={data} tr={tr} />
```

Component:

```jsx
// ═════════════════════════════════════════════════════════════════════════════
// SECTION 7: METODOLOJI ve KAYNAK
// ═════════════════════════════════════════════════════════════════════════════

function Methodology({ data, tr }) {
  const [open, setOpen] = useState(false);
  if (!data?.metodoloji) return null;

  return (
    <section style={{ padding: '60px 24px 100px', background: COLORS.cosmicBlack }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={sectionLabel}>{tr ? 'Metodoloji ve Kaynak' : 'Methodology & Sources'}</div>

        <button
          onClick={() => setOpen(v => !v)}
          aria-expanded={open}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '10px',
            padding: '16px 22px',
            color: COLORS.offWhite,
            fontFamily: FONTS.body,
            cursor: 'pointer',
            width: '100%',
            textAlign: 'left',
          }}
        >
          <span style={{ flex: 1, fontWeight: 600 }}>
            {tr ? 'Bu sayfa nasıl hesaplandı?' : 'How was this page calculated?'}
          </span>
          <span style={{ color: COLORS.gold, transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</span>
        </button>

        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderTop: 'none',
              borderRadius: '0 0 10px 10px',
              padding: '24px 28px',
              fontFamily: FONTS.body,
            }}
          >
            <h3 style={{ color: COLORS.gold, fontSize: '0.95rem', margin: '0 0 8px', fontFamily: FONTS.display }}>
              {tr ? 'Kaynak metin' : 'Source text'}
            </h3>
            <p style={{ color: COLORS.silver, fontSize: '0.88rem', lineHeight: 1.7, margin: '0 0 18px' }}>
              {data.metodoloji.kaynak_metin}
            </p>

            <h3 style={{ color: COLORS.gold, fontSize: '0.95rem', margin: '0 0 8px', fontFamily: FONTS.display }}>
              {tr ? 'Kalibrasyon' : 'Calibration'}
            </h3>
            <p style={{ color: COLORS.silver, fontSize: '0.88rem', lineHeight: 1.7, margin: '0 0 18px' }}>
              {data.metodoloji.kalibrasyon}
            </p>

            <h3 style={{ color: COLORS.gold, fontSize: '0.95rem', margin: '0 0 8px', fontFamily: FONTS.display }}>
              {tr ? 'Lemma vs Yüzey-Lafız Nüansı' : 'Lemma vs Surface-Form Nuance'}
            </h3>
            <p style={{ color: COLORS.silver, fontSize: '0.88rem', lineHeight: 1.7, margin: '0 0 8px' }}>
              {tr
                ? <>Bu sayfa <strong>klasik konkordansa</strong> (M. Fuâd Abdülbâkî, el-Mu'cemü'l-Müfehres) dayanır. <strong>Lemma sayımı:</strong> bir ismin tüm morfolojik formları (<code>Allāhu</code>, <code>Allāhi</code>, <code>Allāha</code>) ve önek'li türevleri (<code>lillāh</code>, <code>billāh</code>, <code>wallāh</code>, <code>fallāh</code>) tek bir isim olarak sayılır.</>
                : <>This page is based on the <strong>classical concordance</strong> (M. Fuʾād ʿAbd al-Bāqī, al-Muʿjam al-Mufahras). <strong>Lemma counting:</strong> all morphological forms of a name (<code>Allāhu</code>, <code>Allāhi</code>, <code>Allāha</code>) and prefixed forms (<code>lillāh</code>, <code>billāh</code>, <code>wallāh</code>, <code>fallāh</code>) count as one name.</>}
            </p>
            <p style={{ color: COLORS.silver, fontSize: '0.88rem', lineHeight: 1.7, margin: '0 0 18px' }}>
              {tr
                ? <>Bu nedenle klasik rakamlar (Allah=2.699), yalın yüzey lafzı sayımına (~{ALLAH_SURFACE_COUNT.toLocaleString('tr-TR')}) göre daha yüksek görünür. Bu metodolojik bir tercihtir, sayım hatası değildir.</>
                : <>This is why classical figures (Allah=2,699) appear higher than strict surface counts (~{ALLAH_SURFACE_COUNT.toLocaleString('en-US')}). It is a methodological choice, not a counting error.</>}
            </p>

            <h3 style={{ color: COLORS.gold, fontSize: '0.95rem', margin: '0 0 8px', fontFamily: FONTS.display }}>
              {tr ? 'Hadis kaynaklı isimler' : 'Hadith-sourced names'}
            </h3>
            <p style={{ color: COLORS.silver, fontSize: '0.88rem', lineHeight: 1.7, margin: '0 0 18px' }}>
              {data.metodoloji.onemli_not}
            </p>

            <h3 style={{ color: COLORS.gold, fontSize: '0.95rem', margin: '0 0 8px', fontFamily: FONTS.display }}>
              {tr ? 'Uyarı' : 'Caveat'}
            </h3>
            <p style={{ color: COLORS.silver, fontSize: '0.88rem', lineHeight: 1.7, margin: '0 0 24px' }}>
              {data.metodoloji.uyari}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              <a
                href="https://corpus.quran.com/search.jsp"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: 'transparent',
                  border: `1px solid ${COLORS.softGoldAlpha40 || 'rgba(212,165,116,0.4)'}`,
                  borderRadius: '8px',
                  color: COLORS.gold,
                  padding: '8px 16px',
                  fontSize: '0.85rem',
                  textDecoration: 'none',
                }}
              >
                {tr ? 'Corpus Quran →' : 'Corpus Quran →'}
              </a>
              <a
                href="https://tanzil.net/#search/ar"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: 'transparent',
                  border: `1px solid ${COLORS.softGoldAlpha40 || 'rgba(212,165,116,0.4)'}`,
                  borderRadius: '8px',
                  color: COLORS.gold,
                  padding: '8px 16px',
                  fontSize: '0.85rem',
                  textDecoration: 'none',
                }}
              >
                {tr ? 'Tanzil →' : 'Tanzil →'}
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Görsel doğrulama**

Refresh.

**Checklist:**
- [ ] "Bu sayfa nasıl hesaplandı?" butonu görünür
- [ ] Tıklayınca panel açılır
- [ ] 5 alt başlık: Kaynak metin · Kalibrasyon · Lemma nüansı · Hadis isimleri · Uyarı
- [ ] Lemma açıklaması Allāhu/lillāh örnekleri içerir
- [ ] Corpus Quran + Tanzil link'leri çalışır
- [ ] EN versiyonu çalışır

- [ ] **Step 3: Commit**

```bash
cd /Users/serdar/dev/00_dev_PROJECTS/01_qurancodex
git add next/src/components/EsmaFrekans.jsx
git commit -m "feat(esma): add section 7 methodology and sources"
```

---

## Phase 3: Verification & Polish

### Task 15: Mobil + responsive denetimi (3 viewport)

**Files:** Düzeltme gerekirse `next/src/components/EsmaFrekans.jsx`

- [ ] **Step 1: 390px viewport check**

Dev server: `npm run dev`
DevTools mobile mode → iPhone SE (375x667) veya 390x844.

Tüm 7 section'da çalış:
- [ ] Hero: Şûrâ ayeti taşmıyor, başlık satırlara sığıyor, 4 temel ayet 2x2 grid
- [ ] Manifesto: Sütunlar üst-alt (Celal üst, Cemal alt)
- [ ] Flagship: 3 kart dikey, Arapça pasajlar kaydırmadan okunur
- [ ] Frekans: bar chart sıkışmıyor, ⓘ ikonu erişilebilir
- [ ] Vahyin Sesi: 1 sütun grid, kartlar tam genişlik
- [ ] Atlas: search + filter row scrollable, isim satırları tam genişlik
- [ ] Metodoloji: açılır panel sığar

Düzeltme gerekiyorsa min 390px için `clamp()` veya media query ekle.

- [ ] **Step 2: 768px tablet viewport check**

DevTools tablet mode (iPad).

Tüm section'lar tablet'te düzgün görünmeli — Manifesto sütunları yatay olabilir, Vahyin Sesi 2 sütun, Atlas isim satırlarında anlam görünebilir (`display: 'inline'` toggle ile esma-meaning-inline class).

- [ ] **Step 3: 1440px+ desktop check**

Tüm container'lar `maxWidth` ile sınırlı, içerik ortalanmış.

- [ ] **Step 4: Reduced motion check**

DevTools → Rendering → Emulate CSS prefers-reduced-motion. Animasyonların disable olduğunu veya azaldığını doğrula.

framer-motion `useReducedMotion()` hook'unu Hero ve diğer animasyonlu component'lara ekle (gerekirse).

- [ ] **Step 5: Commit (varsa düzeltme)**

```bash
cd /Users/serdar/dev/00_dev_PROJECTS/01_qurancodex
git add next/src/components/EsmaFrekans.jsx
git commit -m "fix(esma): responsive polish for 390px, 768px and reduced-motion"
```

(Düzeltme yoksa commit atla.)

---

### Task 16: İçerik doğruluk denetimi

**Files:** Sadece okuma — düzeltme gerekirse spec'e dönülür.

- [ ] **Step 1: 114 ismin sayım toplamı doğrulama**

Run:
```bash
cd /Users/serdar/dev/00_dev_PROJECTS/01_qurancodex
node -e "
const d = require('./next/public/esma-frekans.json');
const total = d.isimler.reduce((s, n) => s + n.kuranda_gecis_sayisi, 0);
console.log('114 ismin toplam geçiş sayısı (JSON):', total);
console.log('Allah hariç toplam:', total - d.isimler.find(n => n.isim === 'Allah').kuranda_gecis_sayisi);
console.log('En sık 5:');
[...d.isimler].sort((a,b) => b.kuranda_gecis_sayisi - a.kuranda_gecis_sayisi).slice(0, 5).forEach(n => console.log('  ' + n.isim + ': ' + n.kuranda_gecis_sayisi));
"
```

Expected: Allah=1813, El-Hakk=176, El-Alîm=161, Er-Rahîm=115, El-Azîm=107.

- [ ] **Step 2: 14 eksen × ayetler kontrol**

Run:
```bash
cd /Users/serdar/dev/00_dev_PROJECTS/01_qurancodex
node -e "
const d = require('./next/public/esma-beyanlari.json');
console.log('Eksen sayısı:', d.eksenler.length);
d.eksenler.forEach(e => console.log(' - ' + e.id + ': ' + e.baslikTr + ' (' + e.ayetler.length + ' ayet)'));
"
```

Expected: 14 eksen listelenir, her birinde 1-7 ayet.

- [ ] **Step 3: Browser'da spot check**

Open: `http://localhost:3000/tr/arac/esma-frekans/`

**Manual checklist:**
- [ ] Hero Şûrâ 42:11 = "O'nun benzeri hiçbir şey yoktur..." ✓
- [ ] Manifesto Celal sütunu: Cebbâr, Kahhâr, Azîz, Mütekebbir, Müntekim
- [ ] Manifesto Cemal sütunu: Rahmân, Rahîm, Vedûd, Latîf, Raûf, Gafûr
- [ ] Âyetü'l-Kürsî Arabic doğru render, Hayy + Kayyûm + Aliyy + Azîm underline
- [ ] Haşr 22-24 Arabic doğru render, 13 isim underline
- [ ] İhlâs 1-4 Arabic doğru render, Ehad + Samed underline
- [ ] Top 20 frekans: Allah 2,699 + ⓘ
- [ ] Vahyin Sesi 6 ön plan ekseni: Varlığı, Yakınlığı, Rahmeti, Yaratıcılığı, Kudreti, Nur
- [ ] "Diğer 8 ekseni göster" → 8 ek eksen açılır (Bilgisi, Adaleti, İşitme/Görme, Hayat/Süreklilik, Koruyuculuk, Hükmü, İnsanla İlişkisi, Kapsamlı)
- [ ] Atlas Allah detay: Klasik 2,699 + Lemma not + Yalın 1,813

- [ ] **Step 4: EN doğrulama**

`http://localhost:3000/en/arac/esma-frekans/`

Hızlı sweep: tüm metin İngilizce, hiçbir TR sızıntısı yok.

- [ ] **Step 5: Sorun yoksa hiçbir commit yok**

Bu task validation step'idir. Yalnızca düzeltme gerekirse Task 8-14'te ilgili task'a dön.

---

### Task 17: Performance + lint final check

**Files:** Düzeltme gerekirse `EsmaFrekans.jsx`

- [ ] **Step 1: Lint**

Run:
```bash
cd /Users/serdar/dev/00_dev_PROJECTS/01_qurancodex/next
npm run lint 2>&1 | tee /tmp/lint-esma.txt
grep -i "esma\|EsmaFrekans" /tmp/lint-esma.txt || echo "Lint clean for EsmaFrekans"
```

Expected: "Lint clean for EsmaFrekans" veya kritik olmayan uyarılar.

- [ ] **Step 2: Build check**

Run:
```bash
cd /Users/serdar/dev/00_dev_PROJECTS/01_qurancodex/next
npm run build 2>&1 | tail -40
```

Expected: Build başarılı; esma-frekans route'u prerender oluyor.

- [ ] **Step 3: Lighthouse (manuel)**

Production build'i çalıştır:
```bash
cd /Users/serdar/dev/00_dev_PROJECTS/01_qurancodex/next
npm run start &
sleep 5
```

Chrome DevTools → Lighthouse → Mobile, Performance audit.

Hedefler (CLAUDE.md §8):
- [ ] LCP < 2.5s
- [ ] CLS < 0.1
- [ ] INP < 200ms
- [ ] Performance score ≥ 85

Yetmiyorsa:
- esma-frekans.json (yaklaşık 220KB) — `loading="lazy"` ile Section 5-7 için defer et
- IntersectionObserver ile data fetch'i bölümlere bölme

```bash
kill %1
```

- [ ] **Step 4: Düzeltme commit (varsa)**

```bash
cd /Users/serdar/dev/00_dev_PROJECTS/01_qurancodex
git add next/src/components/EsmaFrekans.jsx
git commit -m "perf(esma): performance tuning and lint clean"
```

---

### Task 18: WowFacts + ReadingMode tutarlılık doğrulama (değişmeyenler)

**Files:** Sadece kontrol — DEĞİŞMEZ.

- [ ] **Step 1: WowFacts.jsx satır 71 hâlâ 2699**

Run:
```bash
grep -n "2699" /Users/serdar/dev/00_dev_PROJECTS/01_qurancodex/next/src/components/WowFacts.jsx
```

Expected: Satır 71'de `value: 2699` GÖRÜNÜYOR. Eğer kaybolduysa: regresyon, kontrol et.

- [ ] **Step 2: ReadingMode.jsx Allah lafzı yorumu hâlâ var**

Run:
```bash
grep -n "Allah lafz" /Users/serdar/dev/00_dev_PROJECTS/01_qurancodex/next/src/components/ReadingMode.jsx
```

Expected: 3 yorum satırı görünüyor (95, 100, 103).

- [ ] **Step 3: Navbar lazy import korunmuş**

Run:
```bash
grep -n "EsmaFrekans" /Users/serdar/dev/00_dev_PROJECTS/01_qurancodex/next/src/components/Navbar.jsx
```

Expected: Satır 31'de `const EsmaFrekans = lazy(...)` görünüyor.

- [ ] **Step 4: Bu task'ta hiçbir commit yok**

Tüm kontroller GEÇTİYSE: regression yok, plan başarılı.
GEÇMEDİYSE: hangi commit'i kırdığı bulunup geri alınır.

---

### Task 19: Final tutar + push prep

**Files:** None — özet.

- [ ] **Step 1: Toplam değişiklikleri özetle**

Run:
```bash
cd /Users/serdar/dev/00_dev_PROJECTS/01_qurancodex
git log --oneline main..HEAD | head -20
echo "---"
git diff --stat main..HEAD
```

Expected output:
- 10-15 commit (her task)
- Etkilenen dosyalar: ~12 dosya

- [ ] **Step 2: Dev'de full smoke test**

Run `npm run dev`, `http://localhost:3000/tr/arac/esma-frekans/`:

Final manual sweep (5 dakika):
- [ ] Hero → Manifesto → Flagship → Frekans → Vahyin Sesi → Atlas → Metodoloji — hepsi akıyor
- [ ] Şûrâ 42:11, Âyetü'l-Kürsî, Haşr 22-24, İhlâs Arabic temiz render
- [ ] Allah 2,699 + ⓘ + lemma açıklaması her 3 yerde (Frekans bar, Atlas detay, Metodoloji)
- [ ] 6+8 progressive disclosure çalışıyor
- [ ] Arama, filter, sort, detay açma — atlas'ta çalışıyor
- [ ] WowFacts ana sayfa'da hâlâ Allah=2,699 gösteriyor
- [ ] Console temiz, hata yok

- [ ] **Step 3: Sonuç raporu (commit'siz)**

Kullanıcıya özet:
- "Implementasyon tamamlandı. X commit, Y dosya etkilendi. [link verilecekse local URL]"
- "Push talimatı bekleniyor"

⚠ **PUSH YOK**: CLAUDE.md gereği her push ayrı approval gerektirir. Kullanıcı talimatı bekle.

---

## Specs Coverage Self-Review

Spec bölümleri ↔ task eşleştirmesi:

| Spec § | Task(lar) |
|---|---|
| §1 Vizyon | (planın amacı) |
| §2 Section 1 Hero | Task 8 |
| §2 Section 2 Manifesto | Task 9 |
| §2 Section 3 Flagship | Task 10 |
| §2 Section 4 Frekans | Task 11 |
| §2 Section 5 Vahyin Sesi | Task 12 |
| §2 Section 6 Atlas | Task 13 |
| §2 Section 7 Metodoloji | Task 14 |
| §3 Veri (esma-frekans.json) | Task 1 |
| §3 Veri (esma-beyanlari.json) | Task 3 |
| §3.3 Allah=2699 displayCount | Task 11, 13 |
| §4.2 Etkilenen 7 dosya | Task 4, 5, 6, 7 |
| §4.3 Etkilenmeyen dosyalar | Task 18 (regression check) |
| §5 Görsel tasarım (renkler/tipografi) | Task 8-14 (inline) |
| §5.4 Mobil ≥390px | Task 15 |
| §6 Allah lemma şeffaflık (3 yer) | Task 11 (Frekans), Task 13 (Atlas), Task 14 (Metodoloji) |
| §7 SEO metadata | Task 4 (page.js) |
| §8 Accessibility | Task 8-14 (aria-* inline) + Task 15 (reduced-motion) |
| §9 Performance | Task 17 |
| §11.1 EN çevirileri (Sahih Int.) | Task 3 (verse-graph extract) |
| §11.3 Progressive disclosure | Task 12 |

**Gap kalmadı.**

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-06-01-esma-husna-flagship.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?
