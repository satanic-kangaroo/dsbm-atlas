# Changelog

## 1.1.1
- Globe: memoised accessors (no polygon rebuild on every state change), 3D code loaded only when the atlas is near the viewport, drawing paused off-screen / in background tabs, capped pixel ratio, no transition, lower cap resolution; renders only once the box has a real size.
- Globe errors are no longer swallowed: the tile map is shown with a visible reason (console + "info"), a retry button, and a "taking a while" hint after 7 s.
- Tile map: cropped to the used area (bigger tiles), region filter (Europe, North America, …), hover card, bigger labels, and a wrapping sorted list on phones instead of sideways scrolling.

## 1.1.0
Redesign and usability pass.
- New header: scroll-spy, reading-progress bar, mobile menu, SVG theme icons, skip link; search palette (Ctrl+K or "/") over bands, countries, themes and sections, plus "random band".
- Home: new hero (globe graphic, CTAs), "Key findings" cards computed from the data (`lib/insights.ts`), one-line takeaway under each section, "Hall of records".
- Atlas: selection card, top-10 ranking per layer, fly-to regions, pause/rotate, click selects (page opens from the card), error boundary falling back to the tile map.
- Band explorer: filters stored in the URL (shareable), theme and decade chips, active-filter chips, grid/list view, skeleton, empty state, random band.
- Band page: stats ribbon, release timeline, similar bands (shared themes), share/copy link. Country page: ranks, comparison with the median country, standout themes, mini map, explorer, plain list.
- Slim band data now carries up to 8 themes per band. Fixed: "busiest year" picked the earliest year (object key order).
- Still not verified with a real `next build` (see README "Status"); tested in the offline harness (EN/FA, dark/light, desktop/phone).

## 1.0.0
First version of DSBM Atlas as its own project (separate from the Metal Archives crawl and analysis).
- Next.js 15 static site, EN/FA (RTL), light/dark, ≈4,700 pages (home, 91 countries, 2,186 bands, method).
- 3D globe (react-globe.gl) with three layers (bands, per million, temperature) + tile-map fallback; country pages; band pages with discography.
- Server-rendered SVG charts: growth, climate scatter with robustness table, themes, lifespan, release formats, weekday/month, “On this day”.
- Data contract + exporter (`tools/export_atlas_data.py`), docs in `docs/`.
- Not yet built or type-checked (no package registry access while writing); see README “Status”.
