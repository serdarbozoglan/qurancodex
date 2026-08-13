---
name: pre-merge-review
description: Use this skill PROACTIVELY before merging any branch to main in the QuranCodex project. Automatically triggers when the user says "merge", "main'e al", "push to main", "main'e geç", "merge edelim", "review et", "kontrol et", "hazır mı", or when about to run `git merge main`, `git push origin main`, `gh pr merge`. Performs comprehensive review against CLAUDE.md rules, checks Arabic encoding violations, design token usage, i18n key parity, dead code, console.log remnants, hardcoded strings, missing React keys, accessibility gaps, and unverifiable absolute claims in content files. Produces PASS/FAIL report.
---

# QuranCodex Pre-Merge Review Skill

## When to use
Trigger automatically in these cases:

1. **User utterances** (Turkish + English):
   - "merge", "merge edelim", "merge etmeye hazır mı"
   - "main'e al", "main'e geç", "main'e göndermek istiyorum"
   - "push to main", "push edelim main'e"
   - "review et", "kontrol et", "gözden geçir"
   - "hazır mı", "bitti mi", "bir sorun var mı"
   - "PR aç", "pull request"

2. **Before running** these git commands:
   - `git merge main` (when on feature branch)
   - `git push origin main` (direct to main)
   - `gh pr merge` or `gh pr create`

3. **Before claiming a branch is ready** even without explicit ask — if user is about to wrap up a session and hasn't reviewed.

## What to do

Run checks in this order. Report **PASS/FAIL** for each. If ANY check fails, **STOP** and report; do NOT proceed with merge.

---

### Check 1: Build succeeds
```bash
npm run build 2>&1 | tail -30
```
**PASS** if exit 0 and no errors. **FAIL** if build errors.

---

### Check 2: Tests pass
```bash
npm run test:run 2>&1 | tail -40
```
**PASS** if all tests green. **FAIL** if any test fails or tests are missing for changed files (in which case trigger `testing` skill first).

---

### Check 3: Lint clean
```bash
npm run lint 2>&1 | tail -40
```
**PASS** if no errors. Warnings OK. **FAIL** if errors.

---

### Check 4: CLAUDE.md rule compliance

Scan all edited files in this branch against CLAUDE.md rules:

#### 4a. Arabic font (§2, §13.2)
```bash
# Check: Kur'an metni için ShaykhHamdullah/Amiri/Scheherazade kullanımı?
grep -rn "ShaykhHamdullah\|Scheherazade\|Amiri" src/components/ReadingMode.jsx src/components/InterlinearView.jsx 2>/dev/null
```
- Reading mode'da `'ShaykhHamdullah', 'KFGQPC', 'Amiri Quran', serif` zinciri OK (§13.15)
- Diğer bileşenlerde yalnızca `FONTS.quran` OK

#### 4b. Design tokens (§13.1, §13.25) — **script ile ölç, grep ile değil**
```bash
node scripts/audit-colors.mjs --ci
```
**FAIL** (exit 1) iki durumda:
1. Token dışı renk sayısı veya ham hex kullanımı **tabanı aşarsa**
   (taban 2026-08-13: 184 farklı / 1.176 kullanım — bu sayılar yalnız AZALIR).
2. **CLAUDE.md §4 palet tablosu `tokens.js`ten sapmışsa.**

Ayrıntı için `node scripts/audit-colors.mjs --list`.

> Grep kullanma: eski talimat satır sayıyordu, script eşleşme sayıyor.
> "1.080 ihlal" ile "186 farklı renk" bir noktada birbirine karıştı ve rapor
> yanlış çıktı — ölçüm tek yerden gelmeli.

#### 4c. Arabic encoding violations (§13.15)
```bash
# Uthmani-özel karakterler JSON'larda olmamalı
grep -l $'\u06E1' public/*.json 2>/dev/null
grep -l $'\u0671' public/*.json 2>/dev/null
grep -l $'\u06CC' public/*.json 2>/dev/null
```
**FAIL** if U+06E1, U+0671, U+06CC found in JSON data files.

#### 4d. Overlay pattern (§13.3, §13.10, §13.11)
For any NEW overlay component, verify:
- Uses `OVERLAY_BASE` from tokens
- Header uses `OVERLAY_TITLE`
- Close button uses `CLOSE_BTN`
- Escape key handler present
- `zIndex: 9999`

#### 4e. Sûre/sure yazımı
```bash
# Türkçe metinlerde "sure" yerine "sûre" olmalı
grep -rn "Sure\b\|sure\b" src/components src/sections src/i18n/tr.json 2>/dev/null | grep -v "Suresi\|surename\|surahRef\|// \|en.json\|Sunnah" | head -20
```

#### 4f. Tanrı vs Allah tutarlılığı
```bash
grep -rn "Tanrı" src/components src/sections src/i18n/tr.json 2>/dev/null
```
**FAIL** if "Tanrı" used in site copy (expect only "Allah").

---

### Check 5: i18n key parity (also covered by tests)
```bash
npm run test:run -- i18n-completeness 2>&1 | tail -15
```

---

### Check 6: Dead code (unused i18n keys)
```bash
# For each key in tr.json, check if referenced in .jsx files
# Too expensive to run exhaustively — sample 10 random keys and verify.
```
Or inspect manually with grep for suspicious keys.

---

### Check 7: Console.log remnants
```bash
grep -rn "console\.\(log\|warn\|error\|debug\)" src/components src/sections 2>/dev/null | grep -v "// \|/\*" | head -20
```
**WARN** (not FAIL) — some console.error is legitimate. Report findings for user judgment.

---

### Check 8: Hardcoded strings outside i18n
```bash
# Turkish/English strings in JSX literals outside t() calls
grep -rn "^\s*\(tr:\|en:\|titleTr:\|labelTr:\|descTr:\)" src/components src/sections 2>/dev/null | head -20
```
**WARN** — any content in *.jsx that should live in tr.json/en.json instead (except WowFacts.jsx which is allowed hardcoded).

---

### Check 9: Missing React key props
```bash
grep -rn "\.map(.*=>.*<[A-Z]" src/components src/sections 2>/dev/null | grep -v "key=" | head -20
```
**FAIL** if a `.map()` renders components without `key={...}`.

---

### Check 10: Accessibility — aria-label on Arabic elements
```bash
# Arabic-containing elements (dir="rtl" or lang="ar") should have aria-label
grep -rn 'dir="rtl"\|lang="ar"' src/components src/sections 2>/dev/null | grep -v "aria-label" | head -20
```
**WARN** — report for user judgment.

---

### Check 11: Unverifiable absolute claims in content
For edited content files (`src/i18n/tr.json`, `src/i18n/en.json`, `src/components/WowFacts.jsx`, `src/sections/*.jsx`):

Search for these patterns that often accompany unverifiable claims:
```
"%[0-9]+"           - hardcoded percentages
"tek "              - "the only" claims
"ilk "              - "the first" claims
"her zaman"         - "always" claims
"hiçbir"            - "no other" claims
"başka hiçbir"      - "no other" claims
"tam "              - "exactly N" claims
"kesin"             - "certainly" claims
"kanıt"             - "proof" claims
"mucize"            - "miracle" claims
```

```bash
grep -rn "%[0-9]\+\|tek \|ilk \|her zaman\|hiçbir\|başka hiçbir\|tam [0-9]\|kesin\|kanıt\|mucize" src/components/WowFacts.jsx src/i18n/tr.json 2>/dev/null | head -30
```
**REPORT** findings — user decides if any are problematic.

---

## Final Report Format

```
# Pre-Merge Review Report
Branch: <branch-name>
Target: main
Date: <today>

## Summary
- ✅ PASS: N checks
- ❌ FAIL: N checks
- ⚠️ WARN: N findings

## Details

### ✅ Build
[output]

### ✅ Tests
15/15 passing

### ❌ CLAUDE.md § 13.2 — Arabic font
FOUND: `src/components/Foo.jsx:42` uses `'Amiri'` directly. MUST use `FONTS.quran`.

### ⚠️ Console.log remnants (non-blocking)
- `src/components/Bar.jsx:123` — console.log('debug')

...

## Recommendation
- [x] Safe to merge — fix WARN items in follow-up commit
- [ ] Do NOT merge — N blocking failures above
```

## What NOT to do

- Do NOT auto-fix failures — report only, wait for user decision
- Do NOT run `git push` or `git merge` even if all checks pass — user must manually trigger
- Do NOT skip checks even if previous branch was approved — each merge is independent
- Do NOT create commits without user approval
- Do NOT assume previous PR review applies to current branch

## Reference files
- `CLAUDE.md` — all enforced rules
- `src/tokens.js` — approved color/font/style tokens
- `.claude/skills/testing/SKILL.md` — sister skill, runs tests
