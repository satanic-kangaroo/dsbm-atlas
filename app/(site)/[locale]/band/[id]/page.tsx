import type { Metadata } from "next";
import { Fragment, type ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { bandIds, countrySlug, getBand } from "@/lib/data";
import { fill, isLocale, locales, nf, year as yf, type Locale } from "@/lib/i18n";
import { countryNames } from "@/lib/names";
import { getMessages, themeName } from "@/lib/messages";
import Logo from "@/components/Logo";
import Timeline from "@/components/bands/Timeline";
import ShareButtons from "@/components/ShareButtons";
import { similarBands } from "@/lib/insights";

export const dynamicParams = false;
export function generateStaticParams() { return locales.flatMap((locale) => bandIds().map((id) => ({ locale, id }))); }

export async function generateMetadata({ params }: { params: Promise<{ locale: string; id: string }> }): Promise<Metadata> {
  const { locale, id } = await params; const b = getBand(Number(id));
  if (!b || !isLocale(locale)) return {};
  const names = countryNames(locale);
  return { title: b.n, description: `${b.n} · ${names[b.c] ?? b.c}${b.y ? ` · ${b.y}` : ""} · ${b.g}`, alternates: { languages: { en: `/en/band/${id}/`, fa: `/fa/band/${id}/` } } };
}

const dateLabel = (L: Locale, months: string[], y: number | null, mo: number | null, d: number | null) =>
  y == null ? "—" : mo == null ? yf(L, y) : d == null ? `${months[mo - 1]} ${yf(L, y)}` : `${nf(L, d)} ${months[mo - 1]} ${yf(L, y)}`;

export default async function BandPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  const b = getBand(Number(id));
  if (!b || !isLocale(locale)) notFound();
  const L = locale as Locale, m = getMessages(L), t = m.band, names = countryNames(L);
  const facts: [string, ReactNode][] = [
    [t.country, names[b.c] ? (b.c === "International" || b.c === "Unknown" ? names[b.c] : <Link href={`/${L}/country/${countrySlug(b.c)}/`}>{names[b.c]}</Link>) : b.c],
    [t.status, m.status[b.s] ?? b.s], [t.formed, b.y ? yf(L, b.y) : "—"],
  ];
  if (b.ya) facts.push([t.activeYears, b.ya]);
  if (b.loc) facts.push([t.location, b.loc]);
  if (b.l) facts.push([t.label, b.l]);
  facts.push([t.genres, b.g]);
  const sim = similarBands(b, 6);
  const dated = b.rel.filter((r) => r[2] != null);
  const lastY = dated.length ? Math.max(...dated.map((r) => r[2] as number)) : null;
  const firstY = dated.length ? Math.min(...dated.map((r) => r[2] as number)) : null;
  const byType = new Map<string, number>(); for (const r of b.rel) byType.set(r[1] ?? "Other", (byType.get(r[1] ?? "Other") ?? 0) + 1);
  return (
    <main id="main">
      <div className="pagehead">
        <div className="crumbs"><Link href={`/${L}/#bands`}>← {m.nav.bands}</Link></div>
        <div className="eyebrow">{b.p ? m.country.pure : m.life.hybrid}</div>
        <h1 style={{ fontSize: "clamp(38px,6.5vw,72px)", overflowWrap: "anywhere" }}>{b.n}</h1>
      </div>
      <div className="band-hero">
        <div className="stack">
          <Logo src={b.logo} name={b.n} className="band-art" />
          {b.photo ? <Logo src={b.photo} name={b.n} className="band-art" /> : null}
        </div>
        <div>
          <dl className="dl">{facts.map(([k, v]) => <Fragment key={k}><dt>{k}</dt><dd>{v}</dd></Fragment>)}</dl>
          {b.t.length ? <><h3 style={{ marginBlockStart: 22 }}>{t.themes}</h3><div className="tags">{b.t.map((x) => <span className="tag" key={x}>{themeName(L, x)}</span>)}</div></> : null}
          <div className="actions"><a className="btn primary" href={`https://www.metal-archives.com/bands/_/${b.id}`} target="_blank" rel="noopener noreferrer">{t.ma} ↗</a><ShareButtons locale={L} title={b.n} /></div>
        </div>
      </div>
      <div className="kpis">
        <div className="kpi"><b>{nf(L, b.rel.length)}</b><span>{m.band2.releases}</span></div>
        {firstY ? <div className="kpi"><b>{yf(L, firstY)}</b><span>{m.band2.firstRel}</span></div> : null}
        {lastY ? <div className="kpi"><b>{yf(L, lastY)}</b><span>{m.band2.lastRel}</span></div> : null}
        {b.y ? <div className="kpi"><b>{nf(L, (lastY && b.s !== "active" ? lastY : new Date().getFullYear()) - b.y)}</b><span>{m.band2.activeSpan}</span></div> : null}
      </div>
      {dated.length ? (
        <section className="block">
          <h2>{m.tl.title}</h2><p className="take">{m.tl.lead}</p>
          <div className="chart" style={{ marginBlockStart: 18 }}><Timeline rels={dated.map((r) => ({ title: r[0], type: r[1], year: r[2], month: r[3] }))} locale={L} months={m.months} formed={b.y} /></div>
        </section>
      ) : null}
      <section className="block">
        <h2>{t.discography}</h2>
        <p className="meta">{fill(t.releasesTotal, { n: nf(L, b.rel.length) })}</p>
        {b.rel.length ? b.rel.map((r, i) => (
          <div className="rel" key={`${r[5] ?? i}-${i}`} style={{ gridTemplateColumns: "150px minmax(0,1fr) auto" }}>
            <b>{dateLabel(L, m.months, r[2], r[3], r[4])}</b>
            <div>{r[6] ? <a href={r[6]} target="_blank" rel="noopener noreferrer">{r[0]}</a> : r[0]}</div>
            <span className="meta">{r[1] ?? ""}</span>
          </div>
        )) : <p className="meta">{t.noReleases}</p>}
      </section>
      {sim.length ? (
        <section className="block">
          <h2>{m.similar.title}</h2><p className="take">{m.similar.lead}</p>
          <div className="similar">
            {sim.map(({ band: o, shared }) => (
              <Link className="sim" key={o.id} href={`/${L}/band/${o.id}/`}><b>{o.n}</b><small>{names[o.c] ?? o.c}{o.y ? ` · ${yf(L, o.y)}` : ""}</small><small>{fill(m.similar.shared, { n: nf(L, shared) })}</small></Link>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
