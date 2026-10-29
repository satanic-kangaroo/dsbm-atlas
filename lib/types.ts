export type Release = [title: string, type: string | null, year: number | null, month: number | null, day: number | null, albumId: string | null, url: string | null];
export interface Band {
  id: number; n: string; c: string; y: number | null; s: string; t: string[]; g: string; l: string | null; p: boolean;
  loc: string | null; ya: string | null; logo: string | null; photo: string | null; rel: Release[];
}
export interface Country {
  name: string; iso2: string; iso3: string; num: string; fa: string; tile: [number, number]; micro: [number, number] | null;
  n: number; pop: number | null; rate: number | null; temp: number | null; tflag: string; gdp: number | null; net: number | null;
}
export interface ThemePoint { period: string; pct: number; lo: number; hi: number; n: number }
export interface Atlas {
  schema: number; generated: string;
  meta: { bands: number; countries: number; releases: number; datedAlbums: number; firstYear: number; peakYears: Record<string, number> };
  years: Record<string, number>; countries: Country[]; unplaced: { International: number; Unknown: number }; bands: Band[];
  stats: {
    scatter: { c: string; n: number; t: number; rate: number }[];
    robustness: { spec: string; coef: number; p: number; n: number; model: string }[];
    themes: Record<string, ThemePoint[]>; themeTests: Record<string, unknown>[];
    releaseTypes: Record<string, number | string>[];
    weekday: Record<"Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun", number>; fridayPct: number; monthCounts: number[];
    season: { interpretation: string; winter: string };
    survival: { group: string; bands: number; survival_5y: number; survival_10y: number }[];
    topPerCapita: Record<string, { bands: number; per_million: number }>;
  };
  calendar: [month: number, day: number, year: number, album: string, band: string | null, bandId: number, type: string][];
}
/** Slim record the client-side explorer downloads (public/data/bands.json). */
export interface SlimBand { id: number; n: string; c: string; y: number | null; s: string; t: string[]; p: boolean; r: number; logo: string | null }
