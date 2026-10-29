"use client";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import type { SlimBand } from "@/lib/types";
import type { Locale } from "@/lib/i18n";
import { fill, nf } from "@/lib/i18n";
import { getMessages, themeName } from "@/lib/messages";

export interface CountryOpt { name: string; label: string; slug: string; n: number }
type Item = { key: string; group: string; label: string; sub?: string; href: string };

const fold = (s: string) => s.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase();
let cache: SlimBand[] | null = null;

/** Ctrl+K / "/" search over bands, countries, themes and page sections. Keyboard friendly, works on touch too. */
export default function CommandPalette({ locale, countries, onClose }: { locale: Locale; countries: CountryOpt[]; onClose: () => void }) {
  const m = getMessages(locale);
  const router = useRouter();
  const [q, setQ] = useState(""), [sel, setSel] = useState(0), [bands, setBands] = useState<SlimBand[] | null>(cache);
  const input = useRef<HTMLInputElement>(null), list = useRef<HTMLDivElement>(null);

  useEffect(() => { input.current?.focus(); const o = document.body.style.overflow; document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = o; }; }, []);
  useEffect(() => {
    if (cache) return; let live = true;
    fetch("/data/bands.json").then((r) => r.json()).then((d: SlimBand[]) => { cache = d; if (live) setBands(d); }).catch(() => { if (live) setBands([]); });
    return () => { live = false; };
  }, []);

  const sections = useMemo<Item[]>(() => (["growth", "places", "climate", "themes", "lifespan", "formats", "calendar", "bands"] as const)
    .map((id) => ({ key: `s-${id}`, group: m.ui.sectionsGroup, label: m.nav[id], href: `/${locale}/#${id}` }))
    .concat([{ key: "s-method", group: m.ui.sectionsGroup, label: m.nav.method, href: `/${locale}/method/` }]), [m, locale]);

  const items = useMemo<Item[]>(() => {
    const ql = fold(q.trim());
    const act: Item[] = [{ key: "a-random", group: m.ui.actions, label: m.ui.randomBand, href: "#random" }];
    if (!ql) return [...act, ...sections.slice(0, 5)];
    const out: Item[] = [];
    const cs = countries.filter((c) => fold(c.label).includes(ql) || fold(c.name).includes(ql)).slice(0, 4)
      .map((c) => ({ key: `c-${c.slug}`, group: m.ui.countriesGroup, label: c.label, sub: `${nf(locale, c.n)} ${m.atlas.bands}`, href: `/${locale}/country/${c.slug}/` }));
    const secs = sections.filter((s) => fold(s.label).includes(ql));
    const bs: Item[] = [];
    for (const b of bands ?? []) {
      const n = fold(b.n);
      const rank = n === ql ? 0 : n.startsWith(ql) ? 1 : n.includes(ql) ? 2 : b.t.some((t) => fold(t).includes(ql) || fold(themeName(locale, t)).includes(ql)) ? 4 : 9;
      if (rank < 9) bs.push({ key: `b-${b.id}`, group: m.ui.bandsGroup, label: b.n, sub: `${countries.find((c) => c.name === b.c)?.label ?? b.c}${b.y ? ` · ${b.y}` : ""}`, href: `/${locale}/band/${b.id}/`, rank } as Item & { rank: number });
    }
    bs.sort((a, b) => (a as unknown as { rank: number }).rank - (b as unknown as { rank: number }).rank || a.label.localeCompare(b.label));
    return out.concat(cs, bs.slice(0, 8), secs);
  }, [q, bands, countries, sections, m, locale]);

  useEffect(() => { setSel(0); }, [q]);
  useEffect(() => { list.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: "nearest" }); }, [sel]);

  const go = (it: Item) => {
    onClose();
    if (it.href === "#random") { const pool = bands ?? []; if (pool.length) router.push(`/${locale}/band/${pool[Math.floor(Math.random() * pool.length)].id}/`); return; }
    router.push(it.href);
  };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") { e.preventDefault(); onClose(); }
    else if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(items.length - 1, s + 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(0, s - 1)); }
    else if (e.key === "Enter" && items[sel]) { e.preventDefault(); go(items[sel]); }
  };

  let last = "";
  return (
    <div className="cmdk" role="dialog" aria-modal="true" aria-label={m.ui.search} onClick={onClose} onKeyDown={onKey}>
      <div className="box" onClick={(e) => e.stopPropagation()}>
        <input ref={input} value={q} onChange={(e) => setQ(e.target.value)} placeholder={m.ui.searchPlaceholder} aria-label={m.ui.search} role="combobox" aria-expanded="true" aria-controls="cmdk-list" autoComplete="off" spellCheck={false} />
        <div className="res" id="cmdk-list" role="listbox" ref={list}>
          {items.length === 0 ? <div className="empty">{m.ui.noResults} “{q}”</div> : items.map((it, i) => {
            const head = it.group !== last ? <div className="grp" key={`g-${it.group}`}>{it.group}</div> : null; last = it.group;
            return [head, <div key={it.key} className="it" role="option" aria-selected={i === sel} onMouseMove={() => setSel(i)} onClick={() => go(it)}><span>{it.label}</span>{it.sub ? <small>{it.sub}</small> : null}</div>];
          })}
        </div>
        <div className="foot"><span>{m.ui.searchHint}</span>{bands ? <span>{fill(m.bands.count, { n: nf(locale, bands.length) })}</span> : <span>{m.bands.loading}</span>}</div>
      </div>
    </div>
  );
}
