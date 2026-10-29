import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { atlas, bandsOf, countrySlugs, getCountry } from "@/lib/data";
import { fill, isLocale, locales, nf, pctSign, year as yf, type Locale } from "@/lib/i18n";
import { countryName, getMessages, themeName } from "@/lib/messages";
import { ChartCard, HBars, Kpi } from "@/components/ui";
import { Sparkline } from "@/components/charts/Charts";
import MiniMap from "@/components/atlas/MiniMap";
import Explorer from "@/components/bands/Explorer";
import { countryContext } from "@/lib/insights";
import { countryNames } from "@/lib/names";

export const dynamicParams = false;
export function generateStaticParams() { return locales.flatMap((locale) => countrySlugs().map((slug) => ({ locale, slug }))); }

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params; const c = getCountry(slug);
  if (!c || !isLocale(locale)) return {};
  return { title: countryName(locale, c), description: `${countryName(locale, c)}: ${nf(locale, c.n)} DSBM bands`, alternates: { languages: { en: `/en/country/${slug}/`, fa: `/fa/country/${slug}/` } } };
}

const count = (arr: string[]) => { const m = new Map<string, number>(); arr.forEach((x) => m.set(x, (m.get(x) ?? 0) + 1)); return [...m.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])); };

export default async function CountryPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const c = getCountry(slug);
  if (!c || !isLocale(locale)) notFound();
  const L = locale as Locale, m = getMessages(L), t = m.country, bs = bandsOf(c), cur = new Date().getFullYear();
  const pc = pctSign(L), share = (k: number) => `${nf(L, Math.round((k / Math.max(bs.length, 1)) * 100))}${pc}`;
  const ys = bs.map((b) => b.y).filter((y): y is number => !!y).sort((a, b) => a - b);
  const med = ys.length ? ys[Math.floor(ys.length / 2)] : null;
  const kp: [string, string][] = [
    [nf(L, c.n), t.kp[0]], [c.rate != null ? nf(L, c.rate, { maximumFractionDigits: 2 }) : "—", t.kp[1]], [c.pop != null ? nf(L, c.pop, { maximumFractionDigits: 1 }) : "—", t.kp[2]],
    [c.temp != null ? `${nf(L, c.temp, { maximumFractionDigits: 1 })}°C` : "—", t.kp[3]], [c.gdp != null ? `$${nf(L, c.gdp)}` : "—", t.kp[4]], [c.net != null ? `${nf(L, c.net, { maximumFractionDigits: 0 })}${pc}` : "—", t.kp[5]],
    [share(bs.filter((b) => b.s === "active").length), t.active], [share(bs.filter((b) => b.p).length), t.pure],
  ];
  if (med) kp.push([yf(L, med), t.mid]);
  const status = count(bs.map((b) => b.s)).map(([k, v]) => [m.status[k] ?? k, v] as [string, number]);
  const themes = count(bs.flatMap((b) => b.t)).slice(0, 8).map(([k, v]) => [themeName(L, k), v] as [string, number]);
  const genres = count(bs.map((b) => b.g)).slice(0, 5) as [string, number][];
  const top = [...bs].sort((a, b) => b.rel.length - a.rel.length || a.n.localeCompare(b.n)).slice(0, 8);
  const ctx = countryContext(c), names = countryNames(L), X = m.country2;
  const list = [...bs].sort((a, b) => a.n.localeCompare(b.n));
  return (
    <main id="main">
      <div className="pagehead">
        <div className="crumbs"><Link href={`/${L}/#places`}>← {t.back}</Link></div>
        <div className="eyebrow">{m.atlas.title} · {c.iso3}</div>
        <h1 style={{ fontSize: "clamp(40px,7vw,76px)" }}>{countryName(L, c)}</h1>
        <div className="badges">
          <span className="badge">{X.rankBands}: {fill(X.ofN, { r: nf(L, ctx.rankBands), n: nf(L, ctx.countries) })}</span>
          {ctx.rankRate ? <span className="badge">{X.rankRate}: {fill(X.ofN, { r: nf(L, ctx.rankRate), n: nf(L, ctx.rateCountries) })}</span> : null}
        </div>
        <div className="kpis">{kp.map(([v, l]) => <Kpi key={l} value={v} label={l} />)}</div>
      </div>
      <div className="grid2">
        <div className="stack">
          <ChartCard cap={t.formed}><Sparkline years={ys} locale={L} label={t.formed} current={cur} /></ChartCard>
          <ChartCard cap={t.top}>
            {top.map((b) => (
              <div className="rel" key={b.id} style={{ gridTemplateColumns: "minmax(0,1fr) auto" }}>
                <div><Link href={`/${L}/band/${b.id}/`}>{b.n}</Link><small>{`${m.status[b.s] ?? b.s} · ${b.y ? yf(L, b.y) : "—"}`}</small></div>
                <b>{nf(L, b.rel.length)}</b>
              </div>
            ))}
          </ChartCard>
        </div>
        <div className="stack">
          <ChartCard cap={X.map}><MiniMap countries={atlas.countries} current={c.name} label={X.map} /></ChartCard>
          {c.rate != null && ctx.median ? (
            <ChartCard cap={X.compare}>
              <HBars rows={[[countryName(L, c), Math.round(c.rate * 100) / 100], [X.median, Math.round(ctx.median * 100) / 100]]} locale={L} />
            </ChartCard>
          ) : null}
          <ChartCard cap={X.standsOut}>
            {ctx.standout.length ? (<><p className="meta">{X.standsOutLead}</p><div className="standout">{ctx.standout.map((x) => <div className="hb" key={x.theme}><span>{themeName(L, x.theme)}</span><div className="tr"><i style={{ width: `${Math.min(100, (x.ratio / 3) * 100)}%` }} /></div><em>{fill(X.times, { x: nf(L, x.ratio, { maximumFractionDigits: 1 }) })}</em></div>)}</div></>) : <span className="meta">{X.noStandout}</span>}
          </ChartCard>
          <ChartCard cap={t.status}><HBars rows={status} locale={L} /></ChartCard>
          <ChartCard cap={t.themes}>{themes.length ? <HBars rows={themes} locale={L} /> : <span className="meta">—</span>}</ChartCard>
          <ChartCard cap={t.genres}><HBars rows={genres} locale={L} /></ChartCard>
        </div>
      </div>
      <p className="meta" style={{ marginBlockStart: 18 }}>{t.note}{c.temp == null ? ` ${t.noTemp}` : ""}</p>
      <section id="all" className="block">
        <h2>{t.all}</h2>
        <Explorer locale={L} countryNames={names} initialCountry={c.name} syncUrl={false} />
        <details style={{ marginBlockStart: 24 }}>
          <summary className="meta" style={{ cursor: "pointer" }}>{X.list}</summary>
          <ul>{list.map((b) => <li key={b.id}><Link href={`/${L}/band/${b.id}/`}>{b.n}</Link> <span className="meta">{b.y ? yf(L, b.y) : ""}</span></li>)}</ul>
        </details>
      </section>
    </main>
  );
}
