"use client";
import Link from "next/link";
import type { Country } from "@/lib/types";
import type { Locale } from "@/lib/i18n";
import { nf } from "@/lib/i18n";
import { countryName, getMessages } from "@/lib/messages";
import { countrySlug } from "@/lib/slug";
import { LAYERS, binOf, cssColor, darkText, type LayerKey } from "@/lib/layers";

/** Tile-grid map: one square per country (equal visual weight). Works without WebGL and without JS for links. */
export default function TileMap({ countries, layer, locale, selected, onSelect }: { countries: Country[]; layer: LayerKey; locale: Locale; selected?: string | null; onSelect?: (c: Country) => void }) {
  const m = getMessages(locale), L = LAYERS[layer];
  const W = 27 * 44 + 4, H = 15 * 44 + 4;
  return (
    <div className="mapwrap">
      <svg viewBox={`0 0 ${W} ${H}`} role="group" aria-label={m.atlas.title}>
        {countries.map((c) => {
          const v = L.get(c), has = v != null, i = has ? binOf(L, v as number) : -1;
          const txt = has ? (darkText(L, i) ? "var(--bg)" : "var(--fg)") : "var(--muted)";
          return (
            <Link key={c.iso3} href={`/${locale}/country/${countrySlug(c.name)}/`} onClick={onSelect ? (e) => { e.preventDefault(); onSelect(c); } : undefined} aria-label={`${countryName(locale, c)}: ${nf(locale, c.n)} ${m.atlas.bands}`}>
              <g className={`tile${selected === c.name ? " sel" : ""}`} transform={`translate(${c.tile[0] * 44 + 2},${c.tile[1] * 44 + 2})`}>
                <title>{`${countryName(locale, c)}: ${nf(locale, c.n)} ${m.atlas.bands}${c.rate != null ? ` · ${nf(locale, c.rate, { maximumFractionDigits: 2 })} ${m.atlas.perMillion}` : ""}${c.temp != null ? ` · ${nf(locale, c.temp, { maximumFractionDigits: 1 })}°C` : ""}`}</title>
                <rect width={42} height={42} rx={4} style={{ fill: has ? cssColor(L, i) : "var(--surface)" }} />
                <text x={21} y={18} style={{ fill: txt }}>{c.iso3}</text>
                <text x={21} y={33} className="v" style={{ fill: txt }}>{has ? L.fmt(locale, v as number) : "–"}</text>
              </g>
            </Link>
          );
        })}
      </svg>
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
