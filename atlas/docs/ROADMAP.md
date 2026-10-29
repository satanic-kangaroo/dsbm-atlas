# Roadmap
**First thing after `npm install`:** `npm run typecheck`, `npm run build`, fix what appears, then look at `/en/` and `/fa/` on desktop and phone.
1. Verify the globe (heights, colours in both themes, click-through, auto-rotate pause, reduced motion) and tune `components/atlas/GlobeView.tsx`.
2. Persian: complete theme translations (`THEME_FA`), proofread all copy with a native reader.
3. Album covers: extend the crawl to store cover URLs, then show them on band pages (still hot-linked).
4. Per-band timeline chart, related bands (same label/theme), country comparison page.
5. Share cards (OG images), per-page descriptions in Persian.
6. Real-geography choropleth for flat view (MapLibre or d3-geo with world-atlas) as a third view.
7. Search: static index (Pagefind) when the explorer list outgrows one JSON file.
8. Accessibility audit (keyboard path through the globe alternative, colour contrast of bins), performance budget for the globe chunk.
9. Deployment (Cloudflare Pages / GitHub Pages), analytics-free by default.
