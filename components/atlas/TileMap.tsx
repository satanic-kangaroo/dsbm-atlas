"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Country } from "@/lib/types";
import type { Locale } from "@/lib/i18n";
import { nf } from "@/lib/i18n";
import { countryName, getMessages } from "@/lib/messages";
import { countrySlug } from "@/lib/slug";
import { LAYERS, binOf, cssColor, darkText, type LayerKey } from "@/lib/layers";
import { REGION_KEYS, REGION_NAMES, regionOf, type Region } from "@/lib/regions";

const S = 50, G = 2;   // tile size in SVG units, gap

/** Tile-grid map: one square per country (equal visual weight). Cropped to the used area, region filter, hover card, and a wrapping list on phones. */
export default function TileMap({ countries, layer, locale, selected, onSelect }: { countries: Country[]; layer: LayerKey; locale: Locale; selected?: string | null; onSelect?: (c: Country) => void }) {
  const m = getMessages(locale), L = LAYERS[layer], RN = REGION_NAMES[locale];
  const [region, setRegion] = useState<Region | "">("");
  const [hover, setHover] = useState<Country | null>(null);
  const box = useMemo(() => {
    const xs = countries.map((c) => c.tile[0]), ys = countries.map((c) => c.tile[1]);
    const x0 = Math.min(...xs), y0 = Math.min(...ys);
    return { x0, y0, W: (Math.max(...xs) - x0 + 1) * S, H: (Math.max(...ys) - y0 + 1) * S };
  }, [countries]);
  const info = (c: Country) => {
    const bits = [`${nf(locale, c.n)} ${m.atlas.bands}`];
    if (c.rate != null) bits.push(`${nf(locale, c.rate, { maximumFractionDigits: 2 })} ${m.atlas.perMillion}`);
    if (c.temp != null) bits.push(`${nf(locale, c.temp, { maximumFractionDigits: 1 })}°C`);
    return bits.join(" · ");
  };
  const href = (c: Country) => `/${locale}/country/${countrySlug(c.name)}/`;
  const click = (c: Country) => onSelect ? (e: React.MouseEvent) => { e.preventDefault(); onSelect(c); } : undefined;
  const shown = hover ?? countries.find((c) => c.name === selected) ?? null;
  const dim = (c: Country) => !!region && regionOf(c.iso3) !== region;
  const listed = useMemo(() => [...countries].filter((c) => !region || regionOf(c.iso3) === region).sort((a, b) => ((L.get(b) as number | null) ?? -1e9) - ((L.get(a) as number | null) ?? -1e9)), [countries, region, L]);

  return (
    <div className="tilemap">
      <div className="seg" role="group" aria-label={locale === "fa" ? "منطقه" : "Region"}>
        <button className="chip" aria-pressed={region === ""} onClick={() => setRegion("")}>{locale === "fa" ? "همه" : "All"}</button>
        {REGION_KEYS.map((k) => <button key={k} className="chip" aria-pressed={region === k} onClick={() => setRegion(region === k ? "" : k)}>{RN[k]}</button>)}
      </div>
      <div className="tile-hover" aria-live="polite">{shown ? <><b>{countryName(locale, shown)}</b><span>{info(shown)}</span></> : <span>{locale === "fa" ? "نشانگر را روی یک کاشی ببرید" : "Hover a tile for details"}</span>}</div>

      <div className="mapwrap tile-svg">
        <svg viewBox={`0 0 ${box.W} ${box.H}`} role="group" aria-label={m.atlas.title}>
          {countries.map((c) => {
            const v = L.get(c), has = v != null, i = has ? binOf(L, v as number) : -1;
            const txt = has ? (darkText(L, i) ? "var(--bg)" : "var(--fg)") : "var(--muted)";
            return (
              <Link key={c.iso3} href={href(c)} onClick={click(c)} aria-label={`${countryName(locale, c)}: ${info(c)}`}>
                <g className={`tile${selected === c.name ? " sel" : ""}${dim(c) ? " dim" : ""}`} transform={`translate(${(c.tile[0] - box.x0) * S + G / 2},${(c.tile[1] - box.y0) * S + G / 2})`}
                  onMouseEnter={() => setHover(c)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(c)} onBlur={() => setHover(null)}>
                  <rect width={S - G} height={S - G} rx={6} style={{ fill: has ? cssColor(L, i) : "var(--surface)" }} />
                  <text x={(S - G) / 2} y={21} style={{ fill: txt }}>{c.iso3}</text>
                  <text x={(S - G) / 2} y={39} className="v" style={{ fill: txt }}>{has ? L.fmt(locale, v as number) : "–"}</text>
                </g>
              </Link>
            );
          })}
        </svg>
      </div>

      {/* phones: a wrapping, sorted list instead of a sideways-scrolling map */}
      <ul className="tile-list">
        {listed.map((c) => {
          const v = L.get(c), has = v != null, i = has ? binOf(L, v as number) : -1;
          return (
            <li key={c.iso3}>
              <Link href={href(c)} onClick={click(c)} className={selected === c.name ? "sel" : ""} style={{ background: has ? cssColor(L, i) : "var(--surface)", color: has ? (darkText(L, i) ? "var(--bg)" : "var(--fg)") : "var(--muted)" }}>
                <b>{c.iso3}</b><span>{countryName(locale, c)}</span><em>{has ? L.fmt(locale, v as number) : "–"}</em>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function Legend({ layer, locale }: { layer: LayerKey; locale: Locale }) {
  const m = getMessages(locale), L = LAYERS[layer];
  return (
    <div className="leg">
      {Array.from({ length: L.th.length + 1 }, (_, i) => {
        const lo = i === 0 ? null : L.th[i - 1], hi = i < L.th.length ? L.th[i] : null;
        const lab = lo == null ? `< ${L.fmt(locale, hi as number)}` : hi == null ? `≥ ${L.fmt(locale, lo)}` : `${L.fmt(locale, lo)}–${L.fmt(locale, hi)}`;
        return <span key={i}><i style={{ background: cssColor(L, i) }} />{lab}</span>;
      })}
      <span><i style={{ background: "var(--surface)", border: "1px solid var(--line)" }} />{m.atlas.nodata}</span>
    </div>
  );
}
