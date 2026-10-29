"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Country } from "@/lib/types";
import type { Locale } from "@/lib/i18n";
import { fill, nf } from "@/lib/i18n";
import { countryName, getMessages } from "@/lib/messages";
import { countrySlug } from "@/lib/slug";
import { LAYERS, type LayerKey } from "@/lib/layers";
import TileMap, { Legend } from "./TileMap";
import ErrorBoundary from "./ErrorBoundary";
import type { FlyTarget } from "./GlobeView";
import { IconPause, IconPlay } from "../Icons";

// three.js is heavy and needs `window`: load it only in the browser, only when the globe is shown.
const GlobeView = dynamic(() => import("./GlobeView"), { ssr: false, loading: () => <div className="globe-box" aria-busy="true" /> });

const hasWebGL = () => { try { const c = document.createElement("canvas"); return !!(c.getContext("webgl2") || c.getContext("webgl")); } catch { return false; } };
const REGIONS: { lat: number; lng: number; alt: number }[] = [
  { lat: 52, lng: 15, alt: 1.6 }, { lat: 42, lng: -100, alt: 2 }, { lat: -15, lng: -60, alt: 2 }, { lat: 35, lng: 95, alt: 2.2 }, { lat: -25, lng: 140, alt: 2 },
];

export default function AtlasSection({ countries, unplaced, locale }: { countries: Country[]; unplaced: number; locale: Locale }) {
  const m = getMessages(locale), U = m.atlasUi;
  const [layer, setLayer] = useState<LayerKey>("bands");
  const [view, setView] = useState<"globe" | "tiles">("tiles");   // tiles first: server-rendered, works everywhere
  const [webgl, setWebgl] = useState(false);
  const [sel, setSel] = useState<string | null>(null);
  const [rotate, setRotate] = useState(true);
  const [fly, setFly] = useState<FlyTarget | null>(null);
  const [k, setK] = useState(0);
  const [near, setNear] = useState(false), [ready, setReady] = useState(false), [slow, setSlow] = useState(false);
  const anchor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ok = hasWebGL(); setWebgl(ok);
    // enhance to the globe on wide screens (touch-dragging a globe would otherwise trap page scrolling on phones)
    if (ok && matchMedia("(min-width: 760px)").matches) setView("globe");
  }, []);

  // PERFORMANCE: the 3D code (~1 MB) is only fetched when the atlas is about to scroll into view, so it never delays the first paint
  useEffect(() => {
    const el = anchor.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setNear(true); io.disconnect(); } }, { rootMargin: "600px" });
    io.observe(el); return () => io.disconnect();
  }, []);
  useEffect(() => { if (!near || ready || view !== "globe") return; const t = setTimeout(() => setSlow(true), 7000); return () => clearTimeout(t); }, [near, ready, view]);

  const L = LAYERS[layer];
  const rank = useMemo(() => [...countries].filter((c) => L.get(c) != null).sort((a, b) => (L.get(b) as number) - (L.get(a) as number)).slice(0, 10), [countries, L]);
  const top = rank.length ? (L.get(rank[0]) as number) : 1;
  const cur = countries.find((c) => c.name === sel) ?? null;
  const pick = (c: Country) => setSel(c.name);
  const globe = view === "globe" && webgl;
  const T = locale === "fa"
    ? { fail: "نمای سه‌بعدی اجرا نشد؛ نقشه‌ی کاشی‌ای نمایش داده می‌شود.", retry: "تلاش دوباره", loading: "در حال بارگذاری کره‌ی زمین…", slow: "بارگذاری طول کشیده است. می‌توانید از نمای کاشی استفاده کنید.", tiles: "نمای کاشی" }
    : { fail: "The 3D view could not start; showing the tile map instead.", retry: "Try again", loading: "Loading the globe…", slow: "This is taking a while. You can use the tile view meanwhile.", tiles: "Tile view" };
  const tiles = <TileMap countries={countries} layer={layer} locale={locale} selected={sel} onSelect={pick} />;

  return (
    <div className="atlas-grid" ref={anchor}>
      <div className="atlas-main">
        <div className="atlas-bar">
          <div className="seg" role="group" aria-label={m.atlas.cap}>{(["bands", "rate", "temp"] as LayerKey[]).map((key, i) => <button key={key} className="chip" aria-pressed={layer === key} onClick={() => setLayer(key)}>{m.atlas.layers[i]}</button>)}</div>
          <div className="seg">{(["globe", "tiles"] as const).map((v, i) => <button key={v} className="chip" aria-pressed={view === v} disabled={v === "globe" && !webgl} onClick={() => setView(v)}>{m.atlas.views[i]}</button>)}</div>
        </div>
        {globe ? (
          <div style={{ position: "relative" }}>
            <ErrorBoundary fallback={(msg, retry) => (<><div className="notice" role="alert">{T.fail} <button className="btn" onClick={retry}>{T.retry}</button><details><summary>info</summary><code>{msg}</code></details></div>{tiles}</>)}>
              {near ? <GlobeView countries={countries} layer={layer} locale={locale} selected={sel} onSelect={pick} rotate={rotate} fly={fly} onReady={() => setReady(true)} /> : <div className="globe-box" aria-busy="true" />}
            </ErrorBoundary>
            {!ready ? <div className="globe-wait" role="status">{slow ? <>{T.slow} <button className="btn" onClick={() => setView("tiles")}>{T.tiles}</button></> : T.loading}</div> : null}
            <div className="globe-ov">
              <button className="btn" onClick={() => setRotate((r) => !r)} aria-pressed={rotate}>{rotate ? <IconPause /> : <IconPlay />}{rotate ? U.pause : U.play}</button>
            </div>
          </div>
        ) : tiles}
        <Legend layer={layer} locale={locale} />
        <p className="meta">{globe ? `${m.atlas.hint} ${m.atlas.micro}` : m.atlas.tilesHint} {fill(m.atlas.unplaced, { a: nf(locale, unplaced) })}</p>
      </div>
      <aside className="atlas-side">
        <div className="panel selcard" aria-live="polite">
          <h3>{U.selected}</h3>
          {cur ? (
            <>
              <div className="name">{countryName(locale, cur)}</div>
              <div className="mini">
                <div><b>{nf(locale, cur.n)}</b><span>{m.atlas.bands}</span></div>
                <div><b>{cur.rate != null ? nf(locale, cur.rate, { maximumFractionDigits: 1 }) : "—"}</b><span>{m.atlas.perMillion}</span></div>
                <div><b>{cur.temp != null ? `${nf(locale, cur.temp, { maximumFractionDigits: 1 })}°` : "—"}</b><span>°C</span></div>
              </div>
              <Link className="btn primary" href={`/${locale}/country/${countrySlug(cur.name)}/`}>{U.open} <span className="arrow">→</span></Link>
            </>
          ) : <p className="meta">{globe ? U.hover : U.clickHint}</p>}
        </div>
        {globe ? (
          <div className="panel fly">
            <h3>{U.fly}</h3>
            <select aria-label={U.fly} value="" onChange={(e) => { const r = REGIONS[Number(e.target.value)]; if (r) { setFly({ ...r, k: k + 1 }); setK(k + 1); } }}>
              <option value="">{U.fly}</option>
              {U.regions.map((r, i) => <option key={r} value={i}>{r}</option>)}
            </select>
          </div>
        ) : null}
        <div className="panel">
          <h3>{U.ranking} · {m.atlas.layers[(["bands", "rate", "temp"] as LayerKey[]).indexOf(layer)]}</h3>
          <ol className="rank">
            {rank.map((c, i) => (
              <li key={c.name}>
                <button aria-pressed={sel === c.name} onClick={() => pick(c)}>
                  <span className="n">{nf(locale, i + 1)}</span><span>{countryName(locale, c)}</span><span className="v">{L.fmt(locale, L.get(c) as number)}</span>
                  <span className="bar"><i style={{ width: `${Math.max(3, ((L.get(c) as number) / top) * 100)}%` }} /></span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </aside>
    </div>
  );
}
