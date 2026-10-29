"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { SlimBand } from "@/lib/types";
import type { Locale } from "@/lib/i18n";
import { fill, nf, year as yf } from "@/lib/i18n";
import { getMessages, themeName } from "@/lib/messages";
import Logo from "../Logo";
import { IconDice, IconGrid, IconList } from "../Icons";

const PAGE = 24;
const DECADES: [number, number][] = [[0, 2004], [2005, 2009], [2010, 2014], [2015, 2019], [2020, 9999]];
type Sort = "name" | "new" | "rel";
const fold = (s: string) => s.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** Band browser. Filters live in the URL query (?q=&country=&status=&theme=&dec=&sort=&pure=1) so any view can be shared. */
export default function Explorer({ locale, countryNames, initialCountry = "", syncUrl = true }: { locale: Locale; countryNames: Record<string, string>; initialCountry?: string; syncUrl?: boolean }) {
  const m = getMessages(locale), X = m.explorer;
  const router = useRouter();
  const [all, setAll] = useState<SlimBand[] | null>(null);
  const [q, setQ] = useState(""), [country, setCountry] = useState(initialCountry), [status, setStatus] = useState("");
  const [theme, setTheme] = useState(""), [dec, setDec] = useState(-1), [pure, setPure] = useState(false);
  const [sort, setSort] = useState<Sort>("name"), [limit, setLimit] = useState(PAGE), [view, setView] = useState<"grid" | "list">("grid");
  const [ready, setReady] = useState(false);

  // read filters from the URL once, in the browser
  useEffect(() => {
    if (syncUrl) {
      const u = new URLSearchParams(location.search);
      setQ(u.get("q") ?? ""); setCountry(u.get("country") ?? initialCountry); setStatus(u.get("status") ?? ""); setTheme(u.get("theme") ?? "");
      setDec(Number(u.get("dec") ?? -1)); setPure(u.get("pure") === "1"); setSort((u.get("sort") as Sort) || "name");
    }
    try { const v = localStorage.getItem("dsbm-view"); if (v === "list" || v === "grid") setView(v); } catch {}
    setReady(true);
  }, [syncUrl, initialCountry]);
  // write them back (replace, so Back still leaves the page)
  useEffect(() => {
    if (!ready || !syncUrl) return;
    const u = new URLSearchParams();
    if (q) u.set("q", q); if (country) u.set("country", country); if (status) u.set("status", status); if (theme) u.set("theme", theme);
    if (dec >= 0) u.set("dec", String(dec)); if (pure) u.set("pure", "1"); if (sort !== "name") u.set("sort", sort);
    const qs = u.toString();
    history.replaceState(null, "", `${location.pathname}${qs ? `?${qs}` : ""}${location.hash}`);
  }, [ready, syncUrl, q, country, status, theme, dec, pure, sort]);
  useEffect(() => {
    let live = true;
    fetch("/data/bands.json").then((r) => r.json()).then((d: SlimBand[]) => { if (live) setAll(d); }).catch(() => { if (live) setAll([]); });
    return () => { live = false; };
  }, []);
  useEffect(() => { setLimit(PAGE); }, [q, country, status, theme, dec, pure, sort]);

  const countries = useMemo(() => [...new Set((all ?? []).map((b) => b.c))].sort((a, b) => (countryNames[a] ?? a).localeCompare(countryNames[b] ?? b, locale)), [all, countryNames, locale]);
  const topThemes = useMemo(() => {
    const c = new Map<string, number>(); for (const b of all ?? []) for (const t of b.t) c.set(t, (c.get(t) ?? 0) + 1);
    return [...c.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12).map(([t]) => t);
  }, [all]);
  const rows = useMemo(() => {
    const ql = fold(q.trim());
    const r = (all ?? []).filter((b) =>
      (!ql || fold(b.n).includes(ql) || b.t.some((x) => fold(x).includes(ql) || fold(themeName(locale, x)).includes(ql)) || fold(countryNames[b.c] ?? b.c).includes(ql)) &&
      (!country || b.c === country) && (!status || b.s === status) && (!pure || b.p) && (!theme || b.t.includes(theme)) &&
      (dec < 0 || (b.y != null && b.y >= DECADES[dec][0] && b.y <= DECADES[dec][1])));
    r.sort(sort === "name" ? (a, b) => a.n.localeCompare(b.n) : sort === "new" ? (a, b) => (b.y ?? 0) - (a.y ?? 0) || a.n.localeCompare(b.n) : (a, b) => b.r - a.r || a.n.localeCompare(b.n));
    return r;
  }, [all, q, country, status, pure, theme, dec, sort, locale, countryNames]);

  const chips: { k: string; label: string; clear: () => void }[] = [];
  if (q) chips.push({ k: "q", label: `“${q}”`, clear: () => setQ("") });
  if (country && country !== initialCountry) chips.push({ k: "c", label: countryNames[country] ?? country, clear: () => setCountry("") });
  if (status) chips.push({ k: "s", label: m.status[status] ?? status, clear: () => setStatus("") });
  if (theme) chips.push({ k: "t", label: themeName(locale, theme), clear: () => setTheme("") });
  if (dec >= 0) chips.push({ k: "d", label: `${X.decades} ${X.decadeLabels[dec]}`, clear: () => setDec(-1) });
  if (pure) chips.push({ k: "p", label: m.bands.pure, clear: () => setPure(false) });
  const clearAll = () => { setQ(""); setCountry(initialCountry); setStatus(""); setTheme(""); setDec(-1); setPure(false); };
  const setV = (v: "grid" | "list") => { setView(v); try { localStorage.setItem("dsbm-view", v); } catch {} };
  const random = () => { if (rows.length) router.push(`/${locale}/band/${rows[Math.floor(Math.random() * rows.length)].id}/`); };

  return (
    <div>
      <div className="fbar">
        <div className="frow">
          <input type="search" aria-label={m.bands.search} placeholder={m.bands.search} value={q} onChange={(e) => setQ(e.target.value)} />
          {!initialCountry ? (
            <select aria-label={m.bands.allCountries} value={country} onChange={(e) => setCountry(e.target.value)}>
              <option value="">{m.bands.allCountries}</option>
              {countries.map((c) => <option key={c} value={c}>{countryNames[c] ?? c}</option>)}
            </select>
          ) : null}
          <select aria-label={m.bands.allStatuses} value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">{m.bands.allStatuses}</option>
            {Object.keys(m.status).map((k) => <option key={k} value={k}>{m.status[k]}</option>)}
          </select>
          <select aria-label="sort" value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
            <option value="name">{m.bands.sortName}</option><option value="new">{m.bands.sortNew}</option><option value="rel">{m.bands.sortRel}</option>
          </select>
        </div>
        <div className="frow"><span className="lbl">{X.themes}</span>
          {topThemes.map((t) => <button key={t} className="chip" aria-pressed={theme === t} onClick={() => setTheme(theme === t ? "" : t)}>{themeName(locale, t)}</button>)}
        </div>
        <div className="frow"><span className="lbl">{X.decades}</span>
          {X.decadeLabels.map((l, i) => <button key={l} className="chip" aria-pressed={dec === i} onClick={() => setDec(dec === i ? -1 : i)}>{l}</button>)}
          <button className="chip" aria-pressed={pure} onClick={() => setPure(!pure)}>{m.bands.pure}</button>
        </div>
        {chips.length ? (
          <div className="active-f" aria-label={X.activeFilters}>
            {chips.map((c) => <button key={c.k} className="fchip" onClick={c.clear} aria-label={`✕ ${c.label}`}>{c.label} <span>✕</span></button>)}
            <button className="btn ghost" onClick={clearAll}>{X.clear}</button>
          </div>
        ) : null}
      </div>
      <div className="frow" style={{ justifyContent: "space-between", marginBlockEnd: 12 }}>
        <div className="meta" aria-live="polite">{all ? fill(X.shown, { a: nf(locale, Math.min(limit, rows.length)), b: nf(locale, rows.length) }) : m.bands.loading}</div>
        <div className="frow">
          <button className="btn" onClick={random} disabled={!rows.length}><IconDice />{X.random}</button>
          <button className="btn icon" aria-pressed={view === "grid"} aria-label={X.grid} onClick={() => setV("grid")}><IconGrid /></button>
          <button className="btn icon" aria-pressed={view === "list"} aria-label={X.list} onClick={() => setV("list")}><IconList /></button>
        </div>
      </div>
      {!all ? <div className="cards">{Array.from({ length: 6 }, (_, i) => <div className="skel" key={i} />)}</div>
        : rows.length === 0 ? <div className="emptybox"><b>{X.empty}</b><span>{X.emptyHint}</span><button className="btn" onClick={clearAll}>{X.clear}</button></div>
        : (
          <div className={`cards${view === "list" ? " list" : ""}`}>
            {rows.slice(0, limit).map((b) => (
              <article className="card" key={b.id}>
                {view === "grid" ? <Logo src={b.logo} name={b.n} /> : null}
                <div className="body">
                  <h3><Link href={`/${locale}/band/${b.id}/`}>{b.n}</Link></h3>
                  <div className="meta">{`${countryNames[b.c] ?? b.c} · ${m.bands.formed} ${b.y ? yf(locale, b.y) : "—"} · ${nf(locale, b.r)} ${m.bands.releases}`}</div>
                  <span className={`pill ${b.s.replace(/\s+/g, "-")}`}>{m.status[b.s] ?? b.s}</span>
                  <div className="tags">{b.t.slice(0, view === "grid" ? 4 : 3).map((x) => <span className="tag" key={x}>{themeName(locale, x)}</span>)}</div>
                </div>
              </article>
            ))}
          </div>
        )}
      {rows.length > limit ? <div className="more"><button className="btn" onClick={() => setLimit((l) => l + PAGE)}>{m.bands.more}</button><span className="meta">{fill(X.shown, { a: nf(locale, limit), b: nf(locale, rows.length) })}</span></div> : null}
    </div>
  );
}
