import type { Country } from "./types";
import { nf, type Locale } from "./i18n";

export type LayerKey = "bands" | "rate" | "temp";
export interface Layer {
  get: (c: Country) => number | null;
  th: number[];            // bin thresholds
  pct: number[];           // colour strength per bin (0-100)
  cold?: boolean;          // diverging cold/warm palette
  fmt: (l: Locale, v: number) => string;
}
export const LAYERS: Record<LayerKey, Layer> = {
  bands: { get: (c) => c.n, th: [1, 3, 10, 30, 100], pct: [16, 34, 52, 70, 85, 96], fmt: (l, v) => nf(l, v) },
  rate: { get: (c) => c.rate, th: [0.05, 0.2, 0.5, 1.5, 3], pct: [16, 34, 52, 70, 85, 96], fmt: (l, v) => nf(l, v, { maximumFractionDigits: v < 1 ? 2 : 1 }) },
  temp: { get: (c) => c.temp, th: [0, 5, 10, 15, 20], pct: [90, 66, 40, 40, 66, 90], cold: true, fmt: (l, v) => nf(l, v, { maximumFractionDigits: 0 }) + "°" },
};
export const binOf = (L: Layer, v: number) => L.th.reduce((i, t) => (v >= t ? i + 1 : i), 0);
const hue = (L: Layer, i: number) => (L.cold && i >= 3 ? "c2" : "accent");
/** CSS colour (tiles). */
export const cssColor = (L: Layer, i: number) => `color-mix(in srgb, var(--${hue(L, i)}) ${L.pct[i]}%, var(--surface2))`;

export interface Palette { accent: string; c2: string; surface2: string; bg: string; fg: string; line: string; globe: string }
const mix = (a: string, b: string, t: number) => {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
  const ch = (s: number) => Math.round(((pa >> s) & 255) * t + ((pb >> s) & 255) * (1 - t));
  return "#" + ((1 << 24) | (ch(16) << 16) | (ch(8) << 8) | ch(0)).toString(16).slice(1);
};
/** Hex colour for three.js (it cannot read CSS variables or colour-mix). */
export const hexColor = (L: Layer, i: number, p: Palette) => mix(p[hue(L, i) as "accent" | "c2"], p.surface2, L.pct[i] / 100);
export const darkText = (L: Layer, i: number) => L.pct[i] >= 55;

export function readPalette(): Palette {
  const cs = getComputedStyle(document.documentElement);
  const g = (n: string, d: string) => (cs.getPropertyValue(n).trim() || d);
  const surface2 = g("--surface2", "#1a2125");
  return { accent: g("--accent", "#8fb8cf"), c2: g("--c2", "#cc8f6d"), surface2, bg: g("--bg", "#0c0f11"), fg: g("--fg", "#e1e7e9"), line: g("--line", "#27323a"), globe: mix(surface2, g("--bg", "#0c0f11"), 0.55) };
}
