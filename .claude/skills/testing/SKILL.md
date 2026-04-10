---
name: testing
description: Use this skill PROACTIVELY after editing critical files in the QuranCodex project. Automatically triggers when modifying cleanArabic functions, applyTajweed, PathContext, overlay components (ReadingMode, VerseGraph, KiraatAtlasi, etc.), ChapterProgress, i18n JSON files (tr.json/en.json), or public/*.json data files. Also triggers when the user asks to "test", "run tests", "verify", or "check tests". Runs Vitest suite, writes new tests for changed code, and reports failures with edge cases (Arabic encoding boundaries, tecvid rules, state transitions).
---

# QuranCodex Testing Skill

## When to use
Trigger automatically in these cases:

1. **After editing** any of these files or patterns:
   - `src/components/ReadingMode.jsx` (cleanArabic, applyTajweed, wrapWaqfOnly, makeWaqfSpan, etc.)
   - `src/components/VerseGraph.jsx`, `KiraatAtlasi.jsx`, `DiyalogAgi.jsx`, `KissaAtlas.jsx`, `WordHeatmap.jsx`, `MeselAtlasi.jsx`, `ConceptGraph.jsx`, `SebebiNuzul.jsx`, `ProphetAtlas.jsx` — any cleanArabic duplication site
   - Any `PathContext.jsx` or related context providers
   - Overlay components (any file containing `OVERLAY_BASE`, `useEffect` + `Escape` key handling)
   - `ChapterProgress.jsx` or scroll detection logic
   - `src/i18n/tr.json` and `src/i18n/en.json`
   - `public/*.json` (verse-graph, sebeb-i-nuzul, esbabin-nuzul, etc.)

2. **User utterances**: "test et", "test çalıştır", "testleri koştur", "run tests", "verify", "check tests", "test this", "test edebilir misin"

3. **Before claiming work is done** — if edited a file from list (1), run tests proactively even without being asked.

## What to do

### Step 1: Run existing test suite
```bash
npm run test:run
```

- If all pass → report PASS and proceed.
- If any fail → **STOP**, report failures to user with file:line references, do NOT suggest fixes yet. Ask user before proceeding.

### Step 2: Identify what new tests are needed
For each file you edited in this session, determine test coverage:

| Change type | Test to write |
|---|---|
| cleanArabic strip list modified | Add test in `arabic-encoding.test.js` verifying preserved/stripped chars |
| applyTajweed regex modified | Add test in `tajweed.test.js` with input Arabic → expected HTML output |
| PathContext state change | Add test in `path-context.test.js` (render Provider + assert state transitions) |
| Overlay component added/modified | Add test verifying Escape key closes, aria-label present, trigger/close cycle |
| ChapterProgress logic modified | Add test with mocked scroll events |
| i18n JSON added keys | Tests auto-run — just verify they pass |
| public/*.json data added/modified | Tests auto-run — just verify they parse |

### Step 3: Write targeted tests with edge cases
For Arabic encoding, ALWAYS cover:
- **Empty string** input
- **Standard verse text** (no special chars)
- **Edge character** that triggered the edit (e.g., U+06EB, U+06EA, U+0671)
- **Boundary**: char at start / middle / end of string
- **Combination**: edge char with adjacent hareke/combining marks

For state/component:
- **Initial mount** state
- **State transition** after user action
- **Unmount cleanup** (especially for event listeners)
- **Rapid transitions** (double-click, escape spam)

### Step 4: Run tests again
```bash
npm run test:run
```

Report:
- **PASS count** (e.g., "15/15 passing")
- **New tests added** (file paths + test names)
- **Coverage gaps still remaining** (if any)

## Test file conventions

- All tests go in `src/__tests__/`
- File naming: `<topic>.test.js` (or `.test.jsx` for React component tests)
- Use `describe()` blocks per feature, `it()` per case
- Import from relative paths: `import tr from '../i18n/tr.json'`
- DO NOT mock unless testing an integration that's genuinely impossible otherwise
- DO NOT test trivial things (getter returns value it was set to)
- DO test: edge cases, regression protection, encoding rules, data integrity

## What NOT to do

- Do NOT run `npm run test` (watch mode) — always use `npm run test:run` (single run + exit)
- Do NOT modify production code just to make testing easier unless user approves the refactor
- Do NOT add test dependencies without user approval
- Do NOT write tests that assume specific Arabic fonts render correctly (visual tests belong in Playwright, not here)
- Do NOT silently skip or disable failing tests — report and ask

## Reference files
- `vitest.config.js` — test runner config (jsdom env, globals enabled)
- `src/__tests__/setup.js` — global setup (@testing-library/jest-dom matchers)
- `src/__tests__/arabic-encoding.test.js` — encoding rules (example)
- `src/__tests__/i18n-completeness.test.js` — tr/en key parity (example)
- `src/__tests__/json-data-validity.test.js` — public/*.json parse check (example)
