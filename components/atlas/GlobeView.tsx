"use client";
/**
 * Interactive 3D globe (react-globe.gl = three-globe on Three.js).
 * - Country outlines: Natural Earth 110m via the `world-atlas` package (public domain), converted with topojson-client.
 * - Colour + height of each country come from the selected layer.
 * - Places missing from the 110m outline (Gibraltar, Hong Kong, Singapore, Puerto Rico) are drawn as pins.
 * This file is loaded only in the browser (next/dynamic, ssr:false) because WebGL needs `window`.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import Globe from "react-globe.gl";
import { feature } from "topojson-client";
import worldData from "world-atlas/countries-110m.json";
import type { Country } from "@/lib/types";
import type { Locale } from "@/lib/i18n";
import { nf } from "@/lib/i18n";
import { countryName, getMessages } from "@/lib/messages";
import { LAYERS, binOf, hexColor, readPalette, type LayerKey, type Palette } from "@/lib/layers";

/* eslint-disable @typescript-eslint/no-explicit-any */
const features: any[] = (feature(worldData as any, (worldData as any).objects.countries) as any).features;
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const idOf = (f: any) => String(f.id ?? "").padStart(3, "0");

export interface FlyTarget { lat: number; lng: number; alt?: number; k: number }
const centroid = (f: any): { lat: number; lng: number } => {
  const pts: number[][] = []; const walk = (a: any) => { if (typeof a[0] === "number") pts.push(a); else a.forEach(walk); };
  if (f?.geometry?.coordinates) walk(f.geometry.coordinates);
  if (!pts.length) return { lat: 20, lng: 0 };
  // circular mean for longitude so Russia / Fiji (which cross +-180) do not land mid-ocean
  let sx = 0, sy = 0, lat = 0; for (const [lo, la] of pts) { sx += Math.cos((lo * Math.PI) / 180); sy += Math.sin((lo * Math.PI) / 180); lat += la; }
  return { lat: lat / pts.length, lng: (Math.atan2(sy, sx) * 180) / Math.PI };
};

export default function GlobeView({ countries, layer, locale, selected, onSelect, rotate, fly }: { countries: Country[]; layer: LayerKey; locale: Locale; selected: string | null; onSelect: (c: Country) => void; rotate: boolean; fly: FlyTarget | null }) {
  const m = getMessages(locale);
  const ref = useRef<any>(null);
  const box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 800, h: 520 });
  const [pal, setPal] = useState<Palette | null>(null);
  const L = LAYERS[layer];

  const byNum = useMemo(() => new Map(countries.map((c) => [c.num, c])), [countries]);
  const micro = useMemo(() => countries.filter((c) => c.micro).map((c) => ({ lat: c.micro![0], lng: c.micro![1], c })), [countries]);
  const maxN = useMemo(() => Math.max(...countries.map((c) => c.n)), [countries]);
  const maxRate = useMemo(() => Math.max(...countries.map((c) => c.rate ?? 0)), [countries]);

  // palette follows the theme (data-theme attribute or OS setting)
  useEffect(() => {
    const upd = () => setPal(readPalette());
    upd();
    const mo = new MutationObserver(upd); mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const mq = matchMedia("(prefers-color-scheme: dark)"); mq.addEventListener("change", upd);
    return () => { mo.disconnect(); mq.removeEventListener("change", upd); };
  }, []);

  // responsive canvas
  useEffect(() => {
    if (!box.current) return;
    const ro = new ResizeObserver(([e]) => setSize({ w: Math.floor(e.contentRect.width), h: Math.floor(e.contentRect.height) }));
    ro.observe(box.current);
    return () => ro.disconnect();
  }, []);

  const valueOf = (c?: Country) => (c ? LAYERS[layer].get(c) : null);
  const colorOf = (c?: Country) => {
    if (!pal) return "#444";
    const v = valueOf(c);
    return v == null ? pal.surface2 : hexColor(L, binOf(L, v), pal);
  };
  const altOf = (c?: Country) => {
    const v = valueOf(c);
    if (c && c.name === selected) return 0.05 + (v == null ? 0 : 0.16 * (layer === "bands" ? Math.sqrt(v / maxN) : layer === "rate" ? Math.log10(1 + v * 10) / Math.log10(1 + maxRate * 10) : 0));
    if (v == null) return 0.004;
    if (layer === "bands") return 0.006 + 0.16 * Math.sqrt(v / maxN);
    if (layer === "rate") return 0.006 + 0.16 * (Math.log10(1 + v * 10) / Math.log10(1 + maxRate * 10));
    return 0.012; // temperature: colour only
  };
  const label = (c: Country | undefined, fallback: string) => {
    if (!c) return `<div class="globe-tip"><b>${esc(fallback)}</b><br/>${esc(m.atlas.noBands)}</div>`;
    const bits = [`${nf(locale, c.n)} ${m.atlas.bands}`];
    if (c.rate != null) bits.push(`${nf(locale, c.rate, { maximumFractionDigits: 2 })} ${m.atlas.perMillion}`);
    if (c.temp != null) bits.push(`${nf(locale, c.temp, { maximumFractionDigits: 1 })}°C`);
    return `<div class="globe-tip"><b>${esc(countryName(locale, c))}</b><br/>${esc(bits.join(" · "))}</div>`;
  };
  const go = (c?: Country) => { if (c) onSelect(c); };
  const spin = rotate && !reduced();
  // keep rotation in sync with the toggle, and fly to a country / region on request
  useEffect(() => { const c = ref.current?.controls?.(); if (c) c.autoRotate = spin; }, [spin]);
  useEffect(() => { if (fly && ref.current) { ref.current.pointOfView({ lat: fly.lat, lng: fly.lng, altitude: fly.alt ?? 1.5 }, 900); } }, [fly]);
  useEffect(() => {
    if (!selected) return;
    const c = countries.find((x) => x.name === selected); if (!c) return;
    if (c.micro) { ref.current?.pointOfView({ lat: c.micro[0], lng: c.micro[1], altitude: 1.3 }, 900); return; }
    const f = features.find((x) => idOf(x) === c.num); if (f) { const p = centroid(f); ref.current?.pointOfView({ lat: p.lat, lng: p.lng, altitude: 1.4 }, 900); }
  }, [selected, countries]);

  const onReady = () => {
    const g = ref.current; if (!g) return;
    g.pointOfView({ lat: 48, lng: 14, altitude: 2.1 }, 0);   // Europe: the genre's centre of gravity
    const ctl = g.controls();
    ctl.autoRotate = spin; ctl.autoRotateSpeed = 0.35;
    ctl.enableDamping = true; ctl.minDistance = 130; ctl.maxDistance = 420;
  };
  // tint the sphere itself (no image texture is downloaded)
  useEffect(() => {
    const g = ref.current; if (!g || !pal) return;
    try { g.globeMaterial().color.set(pal.globe); } catch { /* material not ready yet */ }
  }, [pal]);

  return (
    <div className="globe-box" ref={box} role="img" aria-label={m.atlas.title}>
      {pal ? (
        <Globe
          ref={ref} width={size.w} height={size.h} backgroundColor="rgba(0,0,0,0)" onGlobeReady={onReady}
          showAtmosphere atmosphereColor={pal.accent} atmosphereAltitude={0.16}
          polygonsData={features}
          polygonCapColor={(f: any) => colorOf(byNum.get(idOf(f)))}
          polygonSideColor={() => pal.line}
          polygonStrokeColor={(f: any) => (byNum.get(idOf(f))?.name === selected ? pal.fg : pal.bg)}
          polygonAltitude={(f: any) => altOf(byNum.get(idOf(f)))}
          polygonsTransitionDuration={350}
          polygonLabel={(f: any) => label(byNum.get(idOf(f)), String(f.properties?.name ?? ""))}
          onPolygonClick={(f: any) => go(byNum.get(idOf(f)))}
          onPolygonHover={(f: any) => { const c = ref.current?.controls(); if (c) c.autoRotate = !f && spin; }}
          pointsData={micro} pointLat="lat" pointLng="lng"
          pointColor={(p: any) => colorOf(p.c)} pointAltitude={(p: any) => altOf(p.c) + 0.02} pointRadius={0.55}
          pointLabel={(p: any) => label(p.c, p.c.name)} onPointClick={(p: any) => go(p.c)}
        />
      ) : null}
    </div>
  );
}
