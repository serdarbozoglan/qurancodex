# i18n Key Parity Audit — tr.json ↔ en.json

**Tarih:** 2026-05-25
**Görev:** W24-T4
**Kapsam:** `next/src/i18n/tr.json` ve `next/src/i18n/en.json`
**Methodology:** Recursive flat-key collection; `*Tr`/`*En` suffix pattern filtrelendi (data-design intent — bkz. W17 false positive notları).

---

## 1. Totals

| Metric | TR | EN |
|---|---|---|
| Total flat keys (leaf paths) | **934** | **935** |
| Empty string values | **0** | **0** |

Fark: +1 EN — tek bir `noteEn` key'i tr.json'da `noteTr` muadili olmadan eklenmiş (aşağıda detay).

---

## 2. Raw vs Filtered Key Diff

| Diff dimension | Raw count | After suffix filter |
|---|---|---|
| TR-only (EN'de yok) | 12 | **0** |
| EN-only (TR'de yok) | 13 | **0** |

**Filtered parity:** 0 / 0 — **PASS** (strict path eşitliği).

Ancak suffix pattern içinde **1 gerçek asimetri** mevcut: aşağıdaki bölüm 4'e bakın.

---

## 3. Suffix Pattern İstisnası (W17 false positive doğrulaması)

Her iki dosya da `soundArchitecture` altında `*Tr` / `*En` suffix'li **content-shape** key'leri taşıyor (tasarım gereği: her dosyada o dilin değeri). Bu key'ler parity diff'inde TR-only veya EN-only görünür ama aslında **kasıtlı**.

Toplam 15 (TR file'da) + 16 (EN file'da) = 31 suffix-pattern key.

**TR-only suffix key'leri (12) — EN file'da `*En` muadili var (false positive, ignore):**
```
soundArchitecture.classicalSource.{authorTr, noteTr, quoteTr, workTr}
soundArchitecture.comparison.{mercy.noteTr, punishment.noteTr, methodologyTr}
soundArchitecture.discovery.instructionTr
soundArchitecture.discovery.items[0..2].revealTr
soundArchitecture.tajwid.noteTr
```

**EN-only suffix key'leri (12 paired + 1 unpaired):**
- 12 paired: yukarıdaki TR-only listesinin `*En` muadilleri (false positive)
- 1 unpaired: `soundArchitecture.phonetics.noteEn` → **GERÇEK PROBLEM** (bkz. §4)

---

## 4. Gerçek Missing Key (Eylem Gereken)

### MISSING — Severity: P2 (content gap, çeviri eksik)

| Path | Source | Target | Mevcut Value |
|---|---|---|---|
| `soundArchitecture.phonetics.noteEn` | exists in `en.json` | **eksik in `tr.json`** (no `noteTr`) | "This is not a numerical claim — it is a structural observation that classical Muslim grammarians and modern phoneticians independently arrived at." |

`en.json` → `soundArchitecture.phonetics` objesi `title` + `description` + `noteEn` taşıyor. `tr.json` → `soundArchitecture.phonetics` objesi sadece `title` + `description` taşıyor; aynı kategorideki diğer node'larda (`tajwid`, `comparison.mercy/punishment`, `classicalSource`) `noteTr` mevcutken `phonetics.noteTr` eksik.

**Pair convention:** Sound Architecture bölümündeki tüm `*.note` sibling'leri çift dilli pattern'i izliyor (`noteTr` + `noteEn`). Bu istisna açıkça unutulmuş bir TR ekleme.

---

## 5. Pair-Check Detay

`soundArchitecture` altındaki nominal `note` / `methodology` / `reveal` / `instruction` base'leri için içeride hangi dil suffix'inin bulunduğu:

| Base path | tr.json | en.json |
|---|---|---|
| `soundArchitecture.phonetics.note` | — (yok) | `noteEn` |
| `soundArchitecture.comparison.punishment.note` | `noteTr` | `noteEn` |
| `soundArchitecture.comparison.mercy.note` | `noteTr` | `noteEn` |
| `soundArchitecture.comparison.methodology` | `methodologyTr` | `methodologyEn` |
| `soundArchitecture.tajwid.note` | `noteTr` | `noteEn` |
| `soundArchitecture.discovery.instruction` | `instructionTr` | `instructionEn` |
| `soundArchitecture.discovery.items[0..2].reveal` | `revealTr` | `revealEn` |
| `soundArchitecture.classicalSource.author/work/quote/note` | 4× `*Tr` | 4× `*En` |
| `humanDefinition.muminHeader` | `muminHeaderTr` | `muminHeaderTr` (same key in both files; payload TR-only) |
| `humanDefinition.istikaamet` | `istikaametTr` | `istikaametTr` (same key) |
| `iblisSatan.anchorVerse` | `anchorVerseTr` | `anchorVerseTr` (same key) |

> Son 3 (`humanDefinition.*` + `iblisSatan.anchorVerse`) tasarım gereği TR-only sabit string'ler — Türkçe terimler EN tarafında da Türkçe gösterilir. Parity-safe.

---

## 6. Empty Values

Her iki dosyada **0 boş string**. Daha önce W17/W23 audit'lerinde bulunan boş `desc` / `title` placeholder'ları temizlenmiş durumda.

---

## 7. Counts Summary

| Sayım | Değer |
|---|---|
| TR toplam leaf key | 934 |
| EN toplam leaf key | 935 |
| Sadece TR'de (filtrelenmiş) | 0 |
| Sadece EN'de (filtrelenmiş) | 0 |
| Suffix false positive (TR-only `*Tr`) | 12 |
| Suffix false positive (EN-only `*En`, paired) | 12 |
| Suffix unpaired (gerçek missing) | **1** (`soundArchitecture.phonetics.noteEn` → `noteTr` eksik) |
| Empty value (her iki dilde) | 0 |

---

## 8. Eylem Önerileri

### Action 1 — `soundArchitecture.phonetics.noteTr` ekle (P2)

`next/src/i18n/tr.json` içinde `soundArchitecture.phonetics` objesine TR çeviri ekle:

```json
"soundArchitecture": {
  "phonetics": {
    "title": "Ses Sembolizmi — İki Gelenek, Tek Olgu",
    "description": "...",
    "noteTr": "Bu sayısal bir iddia değil — klasik Müslüman dilbilimcilerin ve modern fonetikçilerin birbirinden bağımsız olarak ulaştığı yapısal bir gözlemdir."
  }
}
```

Önerilen TR çevirisi (EN ile semantik eşdeğer):
> "Bu sayısal bir iddia değil — klasik Müslüman dilbilimcilerin ve modern fonetikçilerin birbirinden bağımsız olarak ulaştığı yapısal bir gözlemdir."

EN tarafa dokunma; sadece TR'ye yeni leaf ekle. Sonrası: TR total 934 → 935; parity diff strict 0.

### Action 2 — Yok

Diğer tüm filtered-only key'ler false positive (suffix data-design pattern). EN'de eksik TR key veya TR'de eksik EN key **bulunmamakta**.

---

## 9. Verification Komutu

İlerideki regression check için (CI'a eklenebilir):

```bash
python3 -c "
import json, re
with open('next/src/i18n/tr.json') as f: tr=json.load(f)
with open('next/src/i18n/en.json') as f: en=json.load(f)
def flat(o, p=''):
    s=set()
    if isinstance(o,dict):
        for k,v in o.items():
            np=f'{p}.{k}' if p else k
            if isinstance(v,(dict,list)): s|=flat(v,np)
            else: s.add(np)
    elif isinstance(o,list):
        for i,v in enumerate(o):
            np=f'{p}[{i}]'
            if isinstance(v,(dict,list)): s|=flat(v,np)
            else: s.add(np)
    return s
def is_suf(p):
    last=p.split('.')[-1].split('[')[0]
    return last.endswith('Tr') or last.endswith('En')
tk,ek=flat(tr),flat(en)
only_tr=[p for p in (tk-ek) if not is_suf(p)]
only_en=[p for p in (ek-tk) if not is_suf(p)]
assert not only_tr, f'TR-only filtered: {only_tr}'
assert not only_en, f'EN-only filtered: {only_en}'
print('OK')
"
```

Bu test mevcut state'te `OK` döndürür. Action 1 uygulandıktan sonra da `OK` döndürmeye devam eder (yeni `noteTr` suffix-pattern filter'a takılır ama gerçek bir mismatch oluşturmaz çünkü `noteEn` muadili EN'de mevcut).

**Suffix-aware sibling pair check** (daha sıkı, Action 1'i yakalayan test):

```bash
python3 -c "
import json
with open('next/src/i18n/tr.json') as f: tr=json.load(f)
with open('next/src/i18n/en.json') as f: en=json.load(f)
# (...pair_check helper from §5...)
"
```

§5'teki pair check'i CI hook olarak ekle → `phonetics.note` gibi unpaired suffix'leri yakalar.

---

result: 934 TR keys, 935 EN keys, 1 missing (1 in TR, 0 in EN), 0 empty
