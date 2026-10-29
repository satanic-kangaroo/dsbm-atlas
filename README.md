# DSBM Atlas — v1.0.0

An interactive, bilingual (English / فارسی) atlas of Depressive Suicidal Black Metal: where the bands come from, what they write about,
how long they last and when they release. A **separate project** from the Metal Archives crawl: it never scrapes anything and reads one
versioned data file (`data/atlas.json`, see `docs/DATA_CONTRACT.md`).

- **Next.js 15** (App Router, TypeScript, React 19), **static export** → plain files in `out/`, host anywhere.
- **3D globe:** `react-globe.gl` (three-globe on Three.js) with Natural Earth outlines from `world-atlas`; a tile-grid map is the
  no-WebGL / phone fallback (progressive enhancement: the server renders tiles, the browser upgrades to the globe on wide screens).
- **i18n:** `/en/…` and `/fa/…` routes, RTL, Persian numerals, one message file (`lib/messages.ts`).
- **No chart library:** server-rendered SVG with native `<title>` tooltips (works without JS, screen-reader friendly).
- Pages: home (all analyses), 91 country pages, 2,186 band pages, method page, sitemap, robots. ≈ 4,700 static pages.

## Run
```bash
npm install
npm run dev            # http://localhost:3000  (redirects / → /en/ or /fa/)
npm run build          # → out/
npm run typecheck
```
Update the data: re-run the crawl/analysis project, then
`python3 tools/export_atlas_data.py ../dsbm_project` (writes `data/atlas.json`, `public/data/bands.json`, `public/data/calendar.json`).
`NEXT_PUBLIC_SITE_URL=https://your.domain npm run build` sets the sitemap URLs.

## Status — read this first
v1.0.0 and v1.1.0 were written **without running `npm install` or `next build`** (no package registry access in the authoring environment).
Plain-syntax checks passed; type-checking, build and visual checks have not been done. Expect to fix a few small things on the first
`npm run build` / `npm run typecheck`. Most likely places: `react-globe.gl` prop typings (`components/atlas/GlobeView.tsx`),
`world-atlas` JSON import (`types-shims.d.ts`), `next/font` options (`app/(site)/[locale]/layout.tsx`). See `docs/ROADMAP.md`.

## Rights and ethics
Band logos/photos are hot-linked from Metal Archives (never copied); text/data credit Metal Archives, Berkeley Earth and the World Bank.
Not affiliated with Metal Archives; read its terms of use before launching publicly. The subject is sensitive: the home page carries a
help-line note, and the copy avoids causal claims (see `docs/DESIGN.md`).
