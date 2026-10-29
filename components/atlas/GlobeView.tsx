"use client";
/**
 * Interactive 3D globe (react-globe.gl = three-globe on Three.js).
 * - Country outlines: Natural Earth 110m via the `world-atlas` package (public domain), converted with topojson-client.
 * - Colour + height of each country come from the selected layer.
 * - Places missing from the 110m outline (Gibraltar, Hong Kong, Singapore, Puerto Rico) are drawn as pins.
 * This file is loaded only in the browser (next/dynamic, ssr:false) because WebGL needs `window`.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

export default function GlobeView({ countries, layer, locale, selected, onSelect, rotate, fly, onReady: ready }: { countries: Country[]; layer: LayerKey; locale: Locale; selected: string | null; onSelect: (c: Country) => void; rotate: boolean; fly: FlyTarget | null; onReady?: () => void }) {
  const m = getMessages(locale);
  const ref = useRef<any>(null);
  const box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [pal, setPal] = useState<Palette | null>(null);
  const L = LAYERS[layer];
  const spin = rotate && !reduced();
  const spinRef = useRef(spin); spinRef.current = spin;

  const byNum = useMemo(() => new Map(countries.map((c) => [c.num, c])), [countries]);
  const micro = useMemo(() => countries.filter((c) => c.micro).map((c) => ({ lat: c.micro![0], lng: c.micro![1], c })), [countries]);
  const maxN = useMemo(() => Math.max(1, ...countries.map((c) => c.n)), [countries]);
  const maxRate = useMemo(() => Math.max(0.01, ...countries.map((c) => c.rate ?? 0)), [countries]);

  // palette follows the theme (data-theme attribute or OS setting)
  useEffect(() => {
    const upd = () => setPal(readPalette());
    upd();
    const mo = new MutationObserver(upd); mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const mq = matchMedia("(prefers-color-scheme: dark)"); mq.addEventListener("change", upd);
    return () => { mo.disconnect(); mq.removeEventListener("change", upd); };
  }, []);

  // responsive canvas; render only once the box has a real size (a 0x0 WebGL canvas is a classic "blank globe")
  useEffect(() => {
    const el = box.current; if (!el) return;
    const take = () => setSize((o) => { const w = Math.floor(el.clientWidth), h = Math.floor(el.clientHeight); return o.w === w && o.h === h ? o : { w, h }; });
    take();
    const ro = new ResizeObserver(take); ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // PERFORMANCE: stop drawing while the globe is off-screen or the tab is hidden
  useEffect(() => {
    const el = box.current; if (!el) return;
    let vis = true, tab = !document.hidden;
    const apply = () => { const g = ref.current; if (!g) return; try { vis && tab ? g.resumeAnimation() : g.pauseAnimation(); } catch { /* not ready */ } };
    const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; apply(); }, { rootMargin: "100px" });
    io.observe(el);
    const vc = () => { tab = !document.hidden; apply(); };
    document.addEventListener("visibilitychange", vc);
    return () => { io.disconnect(); document.removeEventListener("visibilitychange", vc); };
  }, []);

  // PERFORMANCE: accessors are memoised. New function identities make react-globe.gl rebuild every polygon, so they must only change
  // when the data really changes (layer, theme, selection) and never on resize / hover / rotate toggles.
  const valueOf = useCallback((c?: Country) => (c ? LAYERS[layer].get(c) : null), [layer]);
  const colorOf = useCallback((c?: Country) => {
    if (!pal) return "#444444";
    const v = valueOf(c);
    return v == null ? pal.surface2 : hexColor(L, binOf(L, v), pal);
  }, [pal, valueOf, L]);
  const altOf = useCallback((c?: Country) => {
    const v = valueOf(c);
    const base = v == null ? 0.004
      : layer === "bands" ? 0.006 + 0.16 * Math.sqrt(v / maxN)
      : layer === "rate" ? 0.006 + 0.16 * (Math.log10(1 + v * 10) / Math.log10(1 + maxRate * 10))
      : 0.012; // temperature: colour only
    return c && c.name === selected ? base + 0.04 : base;
  }, [valueOf, layer, maxN, maxRate, selected]);
  const tips = useMemo(() => {
    const out = new Map<string, string>();
    for (const c of countries) {
      const bits = [`${nf(locale, c.n)} ${m.atlas.bands}`];
      if (c.rate != null) bits.push(`${nf(locale, c.rate, { maximumFractionDigits: 2 })} ${m.atlas.perMillion}`);
      if (c.temp != null) bits.push(`${nf(locale, c.temp, { maximumFractionDigits: 1 })}°C`);
      out.set(c.name, `<div class="globe-tip"><b>${esc(countryName(locale, c))}</b><br/>${esc(bits.join(" · "))}</div>`);
    }
    return out;
  }, [countries, locale, m]);
  const noBands = (name: string) => `<div class="globe-tip"><b>${esc(name)}</b><br/>${esc(m.atlas.noBands)}</div>`;

  const capColor = useCallback((f: any) => colorOf(byNum.get(idOf(f))), [colorOf, byNum]);
  const sideColor = useCallback(() => pal?.line ?? "#27323a", [pal]);
  const strokeColor = useCallback((f: any) => (byNum.get(idOf(f))?.name === selected ? pal?.fg : pal?.bg) ?? "#000000", [byNum, selected, pal]);
  const altitude = useCallback((f: any) => altOf(byNum.get(idOf(f))), [altOf, byNum]);
  const polyLabel = useCallback((f: any) => { const c = byNum.get(idOf(f)); return c ? tips.get(c.name) ?? "" : noBands(String(f.properties?.name ?? "")); }, [byNum, tips]); // eslint-disable-line react-hooks/exhaustive-deps
  const polyClick = useCallback((f: any) => { const c = byNum.get(idOf(f)); if (c) onSelect(c); }, [byNum, onSelect]);
  const polyHover = useCallback((f: any) => { const c = ref.current?.controls?.(); if (c) c.autoRotate = !f && spinRef.current; }, []);
  const ptColor = useCallback((p: any) => colorOf(p.c), [colorOf]);
  const ptAlt = useCallback((p: any) => altOf(p.c) + 0.02, [altOf]);
  const ptLabel = useCallback((p: any) => tips.get(p.c.name) ?? "", [tips]);
  const ptClick = useCallback((p: any) => onSelect(p.c), [onSelect]);

  // rotation toggle, fly-to (regions) and fly-to-selected country
  useEffect(() => { const c = ref.current?.controls?.(); if (c) c.autoRotate = spin; }, [spin]);
  useEffect(() => { if (fly && ref.current) ref.current.pointOfView({ lat: fly.lat, lng: fly.lng, altitude: fly.alt ?? 1.5 }, 900); }, [fly]);
  useEffect(() => {
    if (!selected || !ref.current) return;
    const c = countries.find((x) => x.name === selected); if (!c) return;
    if (c.micro) { ref.current.pointOfView({ lat: c.micro[0], lng: c.micro[1], altitude: 1.3 }, 900); return; }
    const f = features.find((x) => idOf(x) === c.num); if (f) { const p = centroid(f); ref.current.pointOfView({ lat: p.lat, lng: p.lng, altitude: 1.4 }, 900); }
  }, [selected, countries]);

  const onReady = useCallback(() => {
    const g = ref.current; if (!g) return;
    try {
      g.pointOfView({ lat: 48, lng: 14, altitude: 2.1 }, 0);   // Europe: the genre's centre of gravity
      const ctl = g.controls();
      ctl.autoRotate = spinRef.current; ctl.autoRotateSpeed = 0.35; ctl.enableDamping = true; ctl.minDistance = 130; ctl.maxDistance = 420;
      g.renderer().setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));   // 4K / retina screens would draw 4x the pixels for no visible gain
    } catch (e) { console.warn("[DSBM Atlas] globe setup", e); }
    ready?.();
  }, [ready]);
  // tint the sphere itself (no image texture is downloaded)
  useEffect(() => {
    const g = ref.current; if (!g || !pal) return;
    try { g.globeMaterial().color.set(pal.globe); } catch { /* material not ready yet */ }
  }, [pal]);

  return (
    <div className="globe-box" ref={box} role="img" aria-label={m.atlas.title}>
      {pal && size.w > 0 && size.h > 0 ? (
        <Globe
          ref={ref} width={size.w} height={size.h} backgroundColor="rgba(0,0,0,0)" onGlobeReady={onReady}
          rendererConfig={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          showAtmosphere atmosphereColor={pal.accent} atmosphereAltitude={0.16}
          polygonsData={features}
          polygonCapColor={capColor} polygonSideColor={sideColor} polygonStrokeColor={strokeColor} polygonAltitude={altitude}
          polygonCapCurvatureResolution={8} polygonsTransitionDuration={0}
          polygonLabel={polyLabel} onPolygonClick={polyClick} onPolygonHover={polyHover}
          pointsData={micro} pointLat="lat" pointLng="lng" pointColor={ptColor} pointAltitude={ptAlt} pointRadius={0.55}
          pointLabel={ptLabel} onPointClick={ptClick}
        />
      ) : null}
    </div>
  );
}
