# Copilot Findings Report

Date: 2026-05-21
Project: qurancodex
Scope: workspace code review + `npm run lint -- --max-warnings=0`

## Summary

- Lint result: failed
- Total lint findings: 94
- Errors: 34
- Warnings: 60
- Additional manual review findings: HTML injection surface and design-token consistency drift spots

## High-Impact Findings (Manual Review)

### 1) Potential HTML injection surface
- File: `src/components/TafsirPanel.jsx`
- Location: around line 657
- Finding: `dangerouslySetInnerHTML={{ __html: entry.html }}` renders data-derived HTML directly.
- Risk: If source JSON/HTML is ever untrusted or tampered, this is an XSS vector.

### 2) Repeated direct HTML injection usage across app
- Files include:
  - `src/components/ReadingMode.jsx` (multiple locations)
  - `src/sections/ProphetAtlas.jsx` (dua block)
  - `src/components/TafsirPanel.jsx`
- Note: Some may be intentional for rich text. Sanitization boundary should be explicit and centralized.

### 3) Design-token rule drift in ProphetAtlas
- File: `src/sections/ProphetAtlas.jsx`
- Finding: hardcoded hex/rgba values with TODO tokenize comments remain.
- Risk: style inconsistency and maintainability drift from token-first design rules.

---

## Full ESLint Findings

### scripts/generate-embeddings.js
- 28:37 error `process` is not defined (no-undef)
- 89:5 error `process` is not defined (no-undef)
- 131:24 error `process` is not defined (no-undef)
- 188:8 error `process` is not defined (no-undef)
- 191:5 error `process` is not defined (no-undef)
- 213:3 error `process` is not defined (no-undef)

### scripts/update-turkish.js
- 25:5 error `process` is not defined (no-undef)
- 57:3 error `process` is not defined (no-undef)

### src/components/AnimatedCounter.jsx
- 23:7 error setState inside effect body (react-hooks/set-state-in-effect)

### src/components/ConceptGraph.jsx
- 219:6 warning missing dependency `backToLanding` (react-hooks/exhaustive-deps)
- 247:23 warning `useCallback` called with only one argument (react-hooks/exhaustive-deps)

### src/components/FurukAtlasi.jsx
- 18:13 error `a` assigned but never used (no-unused-vars)

### src/components/IblisSatan.jsx
- 24:42 error unexpected combined character in character class (no-misleading-character-class)

### src/components/IlkSonKelimeler.jsx
- 295:21 error `f` assigned but never used (no-unused-vars)

### src/components/InterlinearView.jsx
- 383:3 error `mealAuthorLabel` defined but never used (no-unused-vars)
- 440:9 error `src` assigned but never used (no-unused-vars)

### src/components/KadinlarAtlasi.jsx
- 44:42 error unexpected combined character in character class (no-misleading-character-class)
- 84:21 error setState inside effect body (react-hooks/set-state-in-effect)

### src/components/KiyametSahneleri.jsx
- 245:1 warning unused eslint-disable directive (react-hooks/refs)

### src/components/Melekler.jsx
- 261:1 warning unused eslint-disable directive (react-hooks/refs)

### src/components/MihverDemoLauncher.jsx
- 25:39 error setState inside effect body (react-hooks/set-state-in-effect)

### src/components/ReadingMode.jsx
- 1027:21 error `setLanguage` assigned but never used (no-unused-vars)
- 1515:6 warning missing dependency `makeWordRe` in `useMemo` (react-hooks/exhaustive-deps)
- 1561:9 warning `getTranslation` causes changing `useCallback` deps each render (react-hooks/exhaustive-deps)
- 1592:11 warning unused eslint-disable directive (react-hooks/exhaustive-deps)
- 1613:11 warning unused eslint-disable directive (react-hooks/exhaustive-deps)
- 6086:29 error `endName` assigned but never used (no-unused-vars)
- 6402:33 error `leading` assigned but never used (no-unused-vars)
- 6403:33 error `lastWord` assigned but never used (no-unused-vars)
- 6406:33 error `renderHtml` assigned but never used (no-unused-vars)
- 8744:10 error `tick` assigned but never used (no-unused-vars)

### src/components/SebebiNuzul.jsx
- 654:9 warning logical expression may change `useMemo` deps (`byCategory`) (react-hooks/exhaustive-deps)

### src/components/SectionWrapper.jsx
- 24:10 warning fast refresh export pattern warning (react-refresh/only-export-components)

### src/components/SurahComparator.jsx
- 484:3 warning unused eslint-disable directive (react-hooks/exhaustive-deps)
- 510:6 warning unnecessary dependency `loading` in `useMemo` (react-hooks/exhaustive-deps)

### src/components/TafsirPanel.jsx
- 69:14 error control character in regex (no-control-regex)
- 139:61 error `ayah` defined but never used (no-unused-vars)
- 147:14 error caught error `e` never used (no-unused-vars)
- 160:88 error caught error `e` never used (no-unused-vars)
- 166:33 error setState inside effect body (react-hooks/set-state-in-effect)
- 203:41 error irregular whitespace not allowed (no-irregular-whitespace)

### src/components/VerseGraph.jsx
- 2109:16 warning ref cleanup likely stale (`graphRef.current`) (react-hooks/exhaustive-deps)
- 2608:6 warning missing dependency `onClose` (react-hooks/exhaustive-deps)
- 2694:7 warning unused eslint-disable directive (no-console)

### src/components/WordTooltip.jsx
- 55:5 error setState inside effect body (react-hooks/set-state-in-effect)

### src/contexts/PathContext.jsx
- 597:17 warning fast refresh export pattern warning (react-refresh/only-export-components)

### src/data/exploreCategories.jsx
- 24:7 warning fast refresh export pattern warning (react-refresh/only-export-components)
- 30:7 warning fast refresh export pattern warning (react-refresh/only-export-components)
- 36:7 warning fast refresh export pattern warning (react-refresh/only-export-components)
- 43:7 warning fast refresh export pattern warning (react-refresh/only-export-components)
- 51:7 warning fast refresh export pattern warning (react-refresh/only-export-components)
- 61:7 warning fast refresh export pattern warning (react-refresh/only-export-components)
- 69:7 warning fast refresh export pattern warning (react-refresh/only-export-components)
- 75:7 warning fast refresh export pattern warning (react-refresh/only-export-components)
- 81:7 warning fast refresh export pattern warning (react-refresh/only-export-components)
- 88:7 warning fast refresh export pattern warning (react-refresh/only-export-components)
- 95:7 warning fast refresh export pattern warning (react-refresh/only-export-components)
- 102:7 warning fast refresh export pattern warning (react-refresh/only-export-components)
- 109:7 warning fast refresh export pattern warning (react-refresh/only-export-components)
- 115:7 warning fast refresh export pattern warning (react-refresh/only-export-components)
- 122:7 warning fast refresh export pattern warning (react-refresh/only-export-components)
- 129:7 warning fast refresh export pattern warning (react-refresh/only-export-components)
- 135:7 warning fast refresh export pattern warning (react-refresh/only-export-components)
- 142:7 warning fast refresh export pattern warning (react-refresh/only-export-components)
- 150:7 warning fast refresh export pattern warning (react-refresh/only-export-components)
- 157:7 warning fast refresh export pattern warning (react-refresh/only-export-components)
- 166:7 warning fast refresh export pattern warning (react-refresh/only-export-components)
- 182:7 warning fast refresh export pattern warning (react-refresh/only-export-components)
- 193:7 warning fast refresh export pattern warning (react-refresh/only-export-components)
- 205:7 warning fast refresh export pattern warning (react-refresh/only-export-components)

### src/data/tools.jsx
- 34:7 warning fast refresh export pattern warning (react-refresh/only-export-components)
- 40:7 warning fast refresh export pattern warning (react-refresh/only-export-components)
- 52:7 warning fast refresh export pattern warning (react-refresh/only-export-components)
- 66:7 warning fast refresh export pattern warning (react-refresh/only-export-components)
- 75:7 warning fast refresh export pattern warning (react-refresh/only-export-components)
- 84:7 warning fast refresh export pattern warning (react-refresh/only-export-components)
- 91:7 warning fast refresh export pattern warning (react-refresh/only-export-components)
- 97:7 warning fast refresh export pattern warning (react-refresh/only-export-components)
- 111:7 warning fast refresh export pattern warning (react-refresh/only-export-components)
- 117:7 warning fast refresh export pattern warning (react-refresh/only-export-components)
- 125:7 warning fast refresh export pattern warning (react-refresh/only-export-components)
- 134:7 warning fast refresh export pattern warning (react-refresh/only-export-components)
- 140:7 warning fast refresh export pattern warning (react-refresh/only-export-components)
- 148:7 warning fast refresh export pattern warning (react-refresh/only-export-components)
- 156:7 warning fast refresh export pattern warning (react-refresh/only-export-components)
- 166:7 warning fast refresh export pattern warning (react-refresh/only-export-components)
- 173:7 warning fast refresh export pattern warning (react-refresh/only-export-components)
- 185:7 warning fast refresh export pattern warning (react-refresh/only-export-components)
- 195:7 warning fast refresh export pattern warning (react-refresh/only-export-components)

### src/hooks/useAudioWithFallback.js
- 131:7 error `tryUrl` accessed before declared (react-hooks/immutability)

### src/hooks/useWordTimings.js
- 99:7 error setState inside effect body (react-hooks/set-state-in-effect)

### src/i18n/LanguageContext.jsx
- 71:17 warning fast refresh export pattern warning (react-refresh/only-export-components)

### src/sections/SoundArchitecture.jsx
- 176:34 error impure call `Date.now()` flagged by purity rule (react-hooks/purity)
- 578:33 error impure call `Date.now()` flagged by purity rule (react-hooks/purity)

---

## Suggested Prioritization

1. Fix all lint errors first (34): these are hard blockers.
2. Address HTML sanitization boundary for all `dangerouslySetInnerHTML` usage.
3. Triage warnings in batches:
   - Batch A: hooks deps and stale refs
   - Batch B: fast-refresh structural warnings in `src/data/*`
   - Batch C: unused eslint-disable cleanup

## Reproduction Command

```bash
npm run lint -- --max-warnings=0
```
