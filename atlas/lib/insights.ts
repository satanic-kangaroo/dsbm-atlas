import "server-only";
import { atlas, bandsOf } from "./data";
import type { Band, Country } from "./types";

const pearson = (xs: number[], ys: number[]) => {
  const n = xs.length, mx = xs.reduce((a, b) => a + b, 0) / n, my = ys.reduce((a, b) => a + b, 0) / n;
  let sxy = 0, sxx = 0, syy = 0;
  for (let i = 0; i < n; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) ** 2; syy += (ys[i] - my) ** 2; }
  return sxy / Math.sqrt(sxx * syy);
};

/** The six headline numbers shown under the hero. Everything is read from the data, nothing is typed in by hand. */
export function headline() {
  const s = atlas.stats;
  const [topC, top] = Object.entries(s.topPerCapita)[0];
  // JS orders integer-like keys numerically, so [0] would be the earliest year: pick the largest count explicitly
  const [peakY, peakN] = Object.entries(atlas.meta.peakYears).sort((a, b) => b[1] - a[1])[0];
  const demo = (i: number) => Number(s.releaseTypes[i].Demo);
  const pure = s.survival.find((x) => x.group === "pure DSBM")!, hyb = s.survival.find((x) => x.group === "hybrid")!;
  return {
    perCapita: { country: topC, value: top.per_million },
    friday: s.fridayPct,
    demoFrom: demo(0), demoTo: demo(s.releaseTypes.length - 1),
    lifeHybrid: Math.round(hyb.survival_10y * 100), lifePure: Math.round(pure.survival_10y * 100),
    r: pearson(s.scatter.map((p) => p.t), s.scatter.map((p) => p.rate)),
    peakYear: Number(peakY), peakN,
  };
}

export interface RecordRow { id: number; name: string; country: string; year: number | null; releases: number; status: string }
const row = (b: Band): RecordRow => ({ id: b.id, name: b.n, country: b.c, year: b.y, releases: b.rel.length, status: b.s });
export function records() {
  const all = atlas.bands;
  const withYear = all.filter((b) => b.y);
  return {
    oldest: [...withYear].sort((a, b) => a.y! - b.y! || b.rel.length - a.rel.length).slice(0, 5).map(row),
    most: [...all].sort((a, b) => b.rel.length - a.rel.length || a.n.localeCompare(b.n)).slice(0, 5).map(row),
    running: withYear.filter((b) => b.s === "active").sort((a, b) => a.y! - b.y! || b.rel.length - a.rel.length).slice(0, 5).map(row),
    newest: [...withYear].sort((a, b) => b.y! - a.y! || b.id - a.id).slice(0, 5).map(row),
  };
}

const norm = (t: string) => t.trim().toLowerCase();
const themeSets = new Map<number, Set<string>>();
const setOf = (b: Band) => themeSets.get(b.id) ?? themeSets.set(b.id, new Set(b.t.map(norm))).get(b.id)!;
/** Bands sharing the most themes (at least two), same country as a tie-break. */
export function similarBands(b: Band, limit = 6): { band: Band; shared: number }[] {
  const mine = setOf(b);
  if (mine.size < 2) return [];
  const out: { band: Band; shared: number; score: number }[] = [];
  for (const o of atlas.bands) {
    if (o.id === b.id) continue;
    const theirs = setOf(o); let shared = 0;
    for (const t of mine) if (theirs.has(t)) shared++;
    if (shared >= 2) out.push({ band: o, shared, score: shared * 10 + (o.c === b.c ? 3 : 0) + (o.p === b.p ? 1 : 0) + Math.min(o.rel.length, 20) / 100 });
  }
  return out.sort((a, c) => c.score - a.score).slice(0, limit).map(({ band, shared }) => ({ band, shared }));
}

const withThemes = atlas.bands.filter((b) => b.t.length);
const globalShare = new Map<string, number>();
for (const b of withThemes) for (const t of new Set(b.t.map(norm))) globalShare.set(t, (globalShare.get(t) ?? 0) + 1);

export function countryContext(c: Country) {
  const byN = [...atlas.countries].sort((a, b) => b.n - a.n || a.name.localeCompare(b.name));
  const rankBands = byN.findIndex((x) => x.name === c.name) + 1;
  const eligible = atlas.countries.filter((x) => x.n >= 5 && x.rate != null).sort((a, b) => (b.rate as number) - (a.rate as number));
  const r = eligible.findIndex((x) => x.name === c.name);
  const rates = eligible.map((x) => x.rate as number).sort((a, b) => a - b);
  const median = rates[Math.floor(rates.length / 2)];
  // themes that are more common in this country than worldwide
  const mine = bandsOf(c).filter((b) => b.t.length), share = new Map<string, number>();
  for (const b of mine) for (const t of new Set(b.t.map(norm))) share.set(t, (share.get(t) ?? 0) + 1);
  const standout = mine.length >= 12
    ? [...share.entries()].filter(([, k]) => k >= 4)
        .map(([t, k]) => ({ theme: t, count: k, ratio: (k / mine.length) / ((globalShare.get(t) ?? 1) / withThemes.length) }))
        .filter((x) => x.ratio >= 1.35).sort((a, b) => b.ratio - a.ratio).slice(0, 4)
    : [];
  return { rankBands, countries: atlas.countries.length, rankRate: r >= 0 ? r + 1 : null, rateCountries: eligible.length, median, standout };
}
