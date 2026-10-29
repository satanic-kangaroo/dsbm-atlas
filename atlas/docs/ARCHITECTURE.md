# Architecture

```
app/(redirect)/            "/" → /en/ or /fa/ (static export has no server redirect: script + meta refresh)
app/(site)/[locale]/       layout (fonts, <html lang dir>, theme init), home, country/[slug], band/[id], method
components/atlas/          AtlasSection (layer + view state) → GlobeView (client, dynamic ssr:false) | TileMap
components/charts/         Charts.tsx (server SVG), ClimateScatter / ThemesChart / CountryBars (client, small state)
components/bands/          Explorer (fetches /data/bands.json)
lib/                       i18n helpers, messages (EN/FA), data (server-only), layers (colour bins), types
tools/                     export_atlas_data.py, countries.csv (ISO codes, Persian names, tile grid, micro-state pins)
```
Decisions
- **Static export**: ~4,700 pages, no server; data baked in at build. Client-side fetch only for the explorer list and “On this day”.
- **Server components by default**; client components only where state is needed (globe/tiles, filters, theme/lang switch).
- **Globe is progressive**: tiles render on the server (SEO, no-JS, phones); the globe loads only on wide screens with WebGL.
  Three.js needs real colours, so `lib/layers.ts` mixes hex values from the CSS variables and follows theme changes.
- **No i18n library**: two locales, route segment + a typed message object. Country names come from `tools/countries.csv`.
- **Tooltips as SVG `<title>`**: zero JS, accessible. Swap for a custom tooltip later if a richer look is needed.
- Colours/typography are tokens in `styles/globals.css` (dark first, full light theme, logical CSS properties for RTL).
