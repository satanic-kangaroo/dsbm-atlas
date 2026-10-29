import { notFound } from "next/navigation";
import { atlas } from "@/lib/data";
import { fill, isLocale, nf, pctSign } from "@/lib/i18n";
import { getMessages } from "@/lib/messages";
import { countryNames } from "@/lib/names";
import { ChartCard, Section } from "@/components/ui";
import { FormatsChart, GrowthChart, MonthChart, SurvivalChart, WeekdayChart } from "@/components/charts/Charts";
import ClimateScatter from "@/components/charts/ClimateScatter";
import CountryBars from "@/components/charts/CountryBars";
import ThemesChart from "@/components/charts/ThemesChart";
import AtlasSection from "@/components/atlas/AtlasSection";
import Explorer from "@/components/bands/Explorer";
import OnThisDay from "@/components/OnThisDay";
import Orb from "@/components/Orb";
import Link from "next/link";
import { headline, records, type RecordRow } from "@/lib/insights";
import { IconDice, IconGlobe } from "@/components/Icons";
import RandomBand from "@/components/RandomBand";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const m = getMessages(locale), names = countryNames(locale), s = atlas.stats, meta = atlas.meta;
  const cur = new Date().getFullYear();
  const noYear = atlas.bands.filter((b) => !b.y).length;

  const counts: Record<string, number> = {};
  for (const b of atlas.bands) if (b.c !== "International" && b.c !== "Unknown") counts[b.c] = (counts[b.c] ?? 0) + 1;
  const countRows = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 12).map(([c, v]) => ({ label: names[c] ?? c, value: v }));
  const pmRows = Object.entries(s.topPerCapita).slice(0, 10).map(([c, v]) => ({ label: names[c] ?? c, value: v.per_million }));
  const points = s.scatter.map((p) => ({ ...p, fa: names[p.c] ?? p.c }));
  const spec = (x: string) => x.replace(/^S\d\s+(S\d,?\s*)?/, "").replace(/\s*\(.*\)$/, "");
  const pure = s.survival.find((x) => x.group === "pure DSBM")!, hyb = s.survival.find((x) => x.group === "hybrid")!;
  const H = headline(), R = records();
  const pc = (v: number) => nf(locale, v, { maximumFractionDigits: 0 }) + (locale === "fa" ? "٪" : "%");
  const I = m.insights.items;
  const cards = [
    { to: "places", big: nf(locale, H.perCapita.value, { maximumFractionDigits: 1 }), text: fill(I.perCapita, { c: names[H.perCapita.country] ?? H.perCapita.country }) },
    { to: "calendar", big: pc(H.friday), text: I.friday },
    { to: "formats", big: `${pc(H.demoFrom)} → ${pc(H.demoTo)}`, text: I.demos },
    { to: "lifespan", big: pc(H.lifeHybrid), text: fill(I.life, { a: nf(locale, H.lifePure) }) },
    { to: "climate", big: nf(locale, H.r, { maximumFractionDigits: 2 }), text: I.climate },
    { to: "growth", big: nf(locale, H.peakN), text: fill(I.peak, { y: nf(locale, H.peakYear, { useGrouping: false }) }) },
  ];
  const placed = atlas.unplaced.International + atlas.unplaced.Unknown;

  return (
    <main id="main">
      <div className="hero">
        <div>
          <div className="eyebrow">{`${m.hero2.eyebrow} · ${nf(locale, meta.firstYear, { useGrouping: false })}–${nf(locale, cur, { useGrouping: false })}`}</div>
          <h1>{m.hero.h1}</h1>
          <p className="lead">{m.hero.lead}</p>
          <div className="cta">
            <Link className="btn primary" href={`/${locale}/#places`}><IconGlobe />{m.hero2.cta1}</Link>
            <RandomBand locale={locale} label={m.hero2.cta2} icon={<IconDice />} />
          </div>
        </div>
        <Orb />
      </div>
      <div className="stats">
        {[meta.bands, meta.countries, meta.releases, meta.datedAlbums].map((v, i) => <div className="stat" key={i}><b>{nf(locale, v)}</b><span>{m.hero.stats[i]}</span></div>)}
      </div>

      <section id="findings" className="block">
        <div className="eyebrow">{m.hero2.eyebrow}</div>
        <h2>{m.insights.title}</h2>
        <div className="insights">
          {cards.map((c) => (
            <Link className="insight" href={`/${locale}/#${c.to}`} key={c.to}>
              <b>{c.big}</b><p>{c.text}</p><span className="go">{m.insights.see} <span className="arrow">→</span></span>
            </Link>
          ))}
        </div>
        <div className="care">{m.hero.care}</div>
      </section>

      <Section id="growth" eyebrow={m.nav.growth} title={m.growth.title} take={m.take.growth}>
        <div className="grid2">
          <ChartCard cap={m.growth.cap}><GrowthChart years={atlas.years} locale={locale} current={cur} /></ChartCard>
          <div className="read"><p>{fill(m.growth.body, { n: nf(locale, noYear), yr: nf(locale, cur, { useGrouping: false }) })}</p></div>
        </div>
      </Section>

      <Section id="places" eyebrow={m.nav.places} title={m.atlas.title} take={m.take.places}>
        <div style={{ marginBlockStart: 22 }}><AtlasSection countries={atlas.countries} unplaced={placed} locale={locale} /></div>
        <div className="grid2">
          <ChartCard><CountryBars counts={countRows} perMillion={pmRows} locale={locale} /></ChartCard>
          <div className="read"><h3>{m.atlas.barsTitle}</h3><p>{m.atlas.barsBody}</p></div>
        </div>
      </Section>

      <Section id="climate" eyebrow={m.nav.climate} title={m.climate.title} take={m.take.climate}>
        <div className="grid2">
          <ChartCard cap={m.climate.cap}><ClimateScatter points={points} locale={locale} /></ChartCard>
          <div className="read">
            <p>{fill(m.climate.body, { n: nf(locale, s.scatter.length) })}</p>
            <p className="note">{fill(m.climate.tested, { k: nf(locale, s.robustness.length) })}</p>
            <table className="t">
              <thead><tr><th>{m.climate.model}</th><th className="n">{m.climate.effect}</th></tr></thead>
              <tbody>{s.robustness.map((x) => <tr key={x.spec}><td><span className={`dot${x.p < 0.05 ? " sig" : ""}`} />{spec(x.spec)}</td><td className="n">{nf(locale, x.coef, { maximumFractionDigits: 3 })}</td></tr>)}</tbody>
            </table>
          </div>
        </div>
      </Section>

      <Section id="themes" eyebrow={m.nav.themes} title={m.themes.title} take={m.take.themes}>
        <div className="grid2">
          <ChartCard cap={`${m.themes.cap} · ${m.themes.y}`}><ThemesChart themes={s.themes} locale={locale} /></ChartCard>
          <div className="read"><p>{m.themes.body}</p></div>
        </div>
      </Section>

      <Section id="lifespan" eyebrow={m.nav.lifespan} title={m.life.title} take={m.take.life}>
        <div className="grid2">
          <ChartCard cap={m.life.cap}><SurvivalChart survival={s.survival} locale={locale} /></ChartCard>
          <div className="read"><p>{fill(m.life.body, { a: nf(locale, Math.round(pure.survival_10y * 100)), b: nf(locale, Math.round(hyb.survival_10y * 100)) })}</p></div>
        </div>
      </Section>

      <Section id="formats" eyebrow={m.nav.formats} title={m.formats.title} take={m.take.formats}>
        <div className="grid2">
          <ChartCard cap={m.formats.cap}><FormatsChart rows={s.releaseTypes} locale={locale} /></ChartCard>
          <div className="read"><p>{m.formats.body}</p></div>
        </div>
      </Section>

      <Section id="calendar" eyebrow={m.nav.calendar} title={m.calendar.title} take={m.take.calendar}>
        <div className="grid2">
          <div className="stack">
            <ChartCard cap={m.calendar.weekday}><WeekdayChart weekday={s.weekday} locale={locale} /></ChartCard>
            <ChartCard cap={m.calendar.month}><MonthChart counts={s.monthCounts} locale={locale} /></ChartCard>
          </div>
          <div className="read"><p>{fill(m.calendar.body, { f: nf(locale, Math.round(s.fridayPct)) })}</p><OnThisDay locale={locale} /></div>
        </div>
      </Section>

      <section id="records" className="block">
        <div className="eyebrow">{m.nav.bands}</div>
        <h2>{m.records.title}</h2>
        <p className="take">{m.records.lead}</p>
        <div className="records">
          {([["oldest", R.oldest, (r: RecordRow) => fill(m.records.formedIn, { y: nf(locale, r.year ?? 0, { useGrouping: false }) })], ["most", R.most, (r: RecordRow) => fill(m.records.releases, { n: nf(locale, r.releases) })], ["running", R.running, (r: RecordRow) => fill(m.records.years, { n: nf(locale, cur - (r.year ?? cur)) })], ["newest", R.newest, (r: RecordRow) => fill(m.records.formedIn, { y: nf(locale, r.year ?? 0, { useGrouping: false }) })]] as const).map(([k, rows, f]) => (
            <div className="panel" key={k}>
              <h3>{m.records[k]}</h3>
              {rows.map((r) => <div className="rrow" key={r.id}><div><Link href={`/${locale}/band/${r.id}/`}>{r.name}</Link><small>{names[r.country] ?? r.country}</small></div><b>{f(r)}</b></div>)}
            </div>
          ))}
        </div>
      </section>

      <Section id="bands" eyebrow={m.nav.bands} title={m.bands.title}>
        <Explorer locale={locale} countryNames={names} />
      </Section>
    </main>
  );
}
