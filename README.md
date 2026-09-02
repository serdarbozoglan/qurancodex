# QuranCodex

A bilingual (Turkish/English) Qur'an study platform built with Next.js. It
pairs a standard reading mode with a set of interactive "atlas" and "tool"
pages — word-frequency and rhetoric explorers, cross-surah connection maps,
prophet/story atlases, and deep-dive pages on individual surahs — each built
from cited classical tafsīr and contemporary academic sources. A
retrieval-augmented "Sor" (Ask) assistant lets readers query the site's own
corpus of verses, translations, and study content directly.

## Stack

- **Next.js 16** (App Router), React
- Locale-prefixed routing (`/tr/...`, `/en/...`)
- `framer-motion` for scroll-driven reveals on the atlas/tool pages
- A local embeddings-based RAG pipeline (`next/scripts/build-embeddings.mjs`)
  backing the `/sor` concierge

## Getting started

```bash
cd next
npm install
npm run dev
```

The app expects a few environment variables (API keys for the AI-backed
features, a KV/Redis store) — see `next/.env.local` for the variables this
project reads; you'll need your own values there before those features
work.

## License

The application code is MIT-licensed — see `LICENSE`.

The site's written content (study notes, comparative analysis, and article
text served from `next/public/`) is licensed separately and is **not**
covered by the MIT grant — see `CONTENT-LICENSE.md` for why and what terms
apply.
