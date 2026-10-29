# Data contract (schema 1)

`data/atlas.json` is the only input. Produced by `tools/export_atlas_data.py` from the DSBM analysis project; consumed by `lib/data.ts`
(server only). Types: `lib/types.ts`. Bump `schema` for breaking changes.

| key | content |
|---|---|
| `meta` | counts (bands, countries, releases, datedAlbums), firstYear, peakYears |
| `years` | formation year → band count |
| `countries[]` | `name` (English key), `iso2/iso3/num` (num = ISO 3166-1 numeric, matches world-atlas ids), `fa`, `tile` [x,y], `micro` [lat,lng] for places missing from the 110m outline, `n`, `pop` (millions), `rate` (bands per million), `temp` (°C, 1991–2013; null if flagged bad), `tflag`, `gdp`, `net` |
| `bands[]` | `id` (Metal Archives id), `n`, `c` (country name), `y`, `s` (status), `t` themes, `g` genres, `l` label, `p` pure DSBM, `loc`, `ya` years active, `logo`/`photo` URLs, `rel` = [title, type, year, month, day, albumId, url] |
| `stats` | scatter, robustness (9 model variants), themes by period (+Wilson CI), theme tests, release types by period, weekday counts, `fridayPct`, month counts (complete years), season interpretation, survival (5/10 years), top per capita |
| `calendar[]` | [month, day, year, album, band, bandId, type] for exact-date releases |
| `unplaced` | bands with country International / Unknown (not mappable) |

Also written: `public/data/bands.json` (slim list for the explorer) and `public/data/calendar.json` (for “On this day”).
Pitfall: a band literally named “None” becomes NaN in pandas; the exporter reads with `keep_default_na=False`.
