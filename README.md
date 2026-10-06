# Dr. Praduman Khachar's archive

Official portfolio and digital library for Dr. Pradumankumar B. Khachar.

- Live site: https://www.praduman.com
- Repository: https://github.com/Paranjayy/praduman-khachar
- Stack: React 19, TypeScript, Vite, React Router, and Vercel.
- Visual direction: editorial typography, warm parchment, ink, and terracotta.

## Development

Use Node.js 22.22.2 or newer.

```sh
npm ci
npm run dev
npm run check
npm run build
npx playwright install chromium
npm run test:browser
```

CI checks types, lint, unit tests, and the built site in desktop/mobile browsers.
Both quality and browser checks are required before merging into main.
Vercel deploys from main. The production smoke workflow checks the live site
hourly and after successful Production deployment events.

## Research exports

Download the bibliography or a single book as a `.ris` file from `/citations`.
Book detail pages also offer **Download citation (.ris)**. In Zotero, choose
**File → Import → A file** and select the download. Exports use the existing
catalog; unknown publication details are omitted. Verify metadata against the
book before submitting a reference. [Zotero import instructions](https://www.zotero.org/support/kb/importing_standardized_formats).

## Project structure

- `src/pages/`: routes for books, media, biography, research tools, and the gallery.
- `src/components/`: navigation, contact, search, and shared interface components.
- `src/data/`: publication metadata, original writings, and curated content.
- `public/`: published assets and committed archive data.
- `scripts/`: scrapers and generators.
- `tests/`: unit regressions and browser checks.
- `docs/`: planning, research, historical notes, and operations.

## Archive maintenance

```sh
npm run scrape:channel
npm run scrape:playlists
npm run data:refresh
```

Review generated data before committing it. Production builds use committed stats;
refreshing social data is a separate operation and does not block deployments.
Do not publish copyrighted book content or add unverified identity claims.

The writing editor's client-side gate is not server authentication. Never use it
as protection for private data or administrative server operations.

## Documentation

- [Document index](docs/README.md)
- [Reliability, monitoring, and recovery](docs/operations.md)
- [Current implementation plan](docs/planning/2026-10-06-resilience.md)
- [Agent rules](AGENTS.md)
- [Visual direction](DESIGN.md)

Original root documents and assets are preserved on the
[archive branch](https://github.com/Paranjayy/praduman-khachar/tree/archive/root-docs-2026-10-06).
