import type { Locale } from "@/lib/i18n";
import { nf, year as yf, pctSign } from "@/lib/i18n";
import { getMessages } from "@/lib/messages";
import type { Atlas } from "@/lib/types";

/** Server-rendered SVG charts. Tooltips are native <title> elements (work without JS, readable by screen readers). */

export function GrowthChart({ years, locale, current }: { years: Atlas["years"]; locale: Locale; current: number }) {
  const m = getMessages(locale);
  const W = 640, H = 250, ml = 30, mr = 8, mt = 10, mb = 24;
  const ys = Object.keys(years).map(Number).filter((y) => y >= 1992);
  const mx = Math.max(...ys.map((y) => years[String(y)]));
  const bw = (W - ml - mr) / (current - 1992 + 1);
  const bars = [];
  for (let y = 1992; y <= current; y++) {
    const v = years[String(y)] ?? 0, h = (v / mx) * (H - mt - mb), x = ml + (y - 1992) * bw;
    bars.push(
      <g key={y}>
        <rect x={x + 1} y={H - mb - h} width={Math.max(1, bw - 2)} height={h} fill={y === current ? "var(--c3)" : "var(--accent)"} opacity={y === current ? 0.7 : 0.9}><title>{`${yf(locale, y)}: ${nf(locale, v)}${y === current ? " *" : ""}`}</title></rect>
        {y % 4 === 0 || y === 1992 ? <text x={x + bw / 2} y={H - 6} textAnchor="middle">{yf(locale, y)}</text> : null}
      </g>,
    );
  }
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={m.growth.cap}>
      {[0, 0.5, 1].map((g) => { const y = H - mb - g * (H - mt - mb); return <g key={g}><line x1={ml} x2={W - mr} y1={y} y2={y} className="ax" /><text x={ml - 4} y={y + 4} textAnchor="end">{nf(locale, Math.round(g * mx))}</text></g>; })}
      {bars}
    </svg>
  );
}

const TYPES = ["Full-length", "EP", "Demo", "Split", "Single", "Compilation"] as const;
const TCOL = ["var(--accent)", "var(--c4)", "var(--c2)", "var(--c3)", "var(--good)", "var(--muted)"];
const periodLabel = (locale: Locale, p: string) => p.replace("now", locale === "fa" ? "اکنون" : "now").replace(/-/g, "–").replace(/\d+/g, (d) => yf(locale, +d));

export function FormatsChart({ rows, locale }: { rows: Atlas["stats"]["releaseTypes"]; locale: Locale }) {
  const m = getMessages(locale), rtl = locale === "fa";
  const W = 640, rh = 46, H = rows.length * rh + 6;
  return (
    <>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={m.formats.cap}>
        {rows.map((r, i) => {
          const y = i * rh + 4; let x = rtl ? W - 120 : 120;
          return (
            <g key={String(r.period)}>
              <text x={rtl ? W : 0} y={y + 20} textAnchor={rtl ? "end" : "start"} className="lbl">{periodLabel(locale, String(r.period))}</text>
              <text x={rtl ? W : 0} y={y + 34} textAnchor={rtl ? "end" : "start"}>{`n=${nf(locale, Number(r.releases))}`}</text>
              {TYPES.map((t, j) => {
                const v = Number(r[t]), w = (v / 100) * (W - 130), rx = rtl ? x - w : x; x += rtl ? -w : w;
                return (
                  <g key={t}>
                    <rect x={rx} y={y + 2} width={Math.max(0, w)} height={30} fill={TCOL[j]}><title>{`${t} · ${nf(locale, v, { maximumFractionDigits: 1 })}%`}</title></rect>
                    {v >= 9 ? <text x={rx + w / 2} y={y + 22} textAnchor="middle" style={{ fill: "var(--bg)" }}>{nf(locale, Math.round(v))}</text> : null}
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>
      <div className="legend">{TYPES.map((t, j) => <span key={t}><i style={{ background: TCOL[j] }} />{t}</span>)}</div>
    </>
  );
}

export function SurvivalChart({ survival, locale }: { survival: Atlas["stats"]["survival"]; locale: Locale }) {
  const m = getMessages(locale), rtl = locale === "fa";
  const sp = survival.find((x) => x.group === "pure DSBM")!, sh = survival.find((x) => x.group === "hybrid")!;
  const W = 640, H = 190;
  const groups: [string, number, number][] = [[m.life.y5, sp.survival_5y, sh.survival_5y], [m.life.y10, sp.survival_10y, sh.survival_10y]];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={m.life.cap}>
      {groups.map(([lab, a, b], i) => {
        const y = i * 92 + 6;
        return (
          <g key={lab}>
            <text x={rtl ? W : 0} y={y + 12} textAnchor={rtl ? "end" : "start"} className="lbl">{lab}</text>
            {([[a, m.life.pure, "var(--accent)"], [b, m.life.hybrid, "var(--c2)"]] as [number, string, string][]).map(([v, nm, col], j) => {
              const w = v * (W - 150), yy = y + 20 + j * 28;
              return (
                <g key={nm}>
                  <rect x={rtl ? W - w : 0} y={yy} width={w} height={20} fill={col} rx={2} />
                  <text x={rtl ? W - w - 8 : w + 8} y={yy + 14} textAnchor={rtl ? "end" : "start"}>{`${nm} · ${nf(locale, Math.round(v * 100))}${pctSign(locale)}`}</text>
                </g>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}

export function WeekdayChart({ weekday, locale }: { weekday: Atlas["stats"]["weekday"]; locale: Locale }) {
  const m = getMessages(locale);
  const v = Object.values(weekday), mx = Math.max(...v), W = 320, H = 190, mt = 10, mb = 22, bw = W / 7, avg = v.reduce((a, b) => a + b, 0) / 7;
  const ay = H - mb - (avg / mx) * (H - mt - mb);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={m.calendar.weekday}>
      {v.map((n, i) => {
        const h = (n / mx) * (H - mt - mb);
        return (
          <g key={i}>
            <rect x={i * bw + 4} y={H - mb - h} width={bw - 8} height={h} fill={i === 4 ? "var(--c2)" : "var(--muted)"} opacity={i === 4 ? 1 : 0.55}><title>{`${m.days[i]}: ${nf(locale, n)}`}</title></rect>
            <text x={i * bw + bw / 2} y={H - 6} textAnchor="middle">{m.days[i].slice(0, locale === "fa" ? 2 : 3)}</text>
          </g>
        );
      })}
      <line x1={0} x2={W} y1={ay} y2={ay} stroke="var(--fg)" strokeDasharray="4 3" opacity={0.5} />
    </svg>
  );
}

export function MonthChart({ counts, locale }: { counts: number[]; locale: Locale }) {
  const m = getMessages(locale);
  const mx = Math.max(...counts), W = 320, H = 190, mt = 10, mb = 22, bw = W / 12, avg = counts.reduce((a, b) => a + b, 0) / 12;
  const ay = H - mb - (avg / mx) * (H - mt - mb);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={m.calendar.month}>
      {counts.map((n, i) => {
        const h = (n / mx) * (H - mt - mb);
        return (
          <g key={i}>
            <rect x={i * bw + 2} y={H - mb - h} width={bw - 4} height={h} fill="var(--accent)" opacity={0.8}><title>{`${m.months[i]}: ${nf(locale, n)}`}</title></rect>
            <text x={i * bw + bw / 2} y={H - 6} textAnchor="middle">{m.months[i].slice(0, locale === "fa" ? 2 : 1)}</text>
          </g>
        );
      })}
      <line x1={0} x2={W} y1={ay} y2={ay} stroke="var(--fg)" strokeDasharray="4 3" opacity={0.5} />
    </svg>
  );
}

/** 3-year bins of formation years for one country. */
export function Sparkline({ years, locale, label, current }: { years: number[]; locale: Locale; label: string; current: number }) {
  const bins: [number, number][] = [];
  for (let y = 1990; y <= current; y += 3) bins.push([y, years.filter((v) => v >= y && v < y + 3).length]);
  const mx = Math.max(1, ...bins.map((b) => b[1])), W = 640, H = 110, bw = W / bins.length;
  return (
    <svg viewBox={`0 0 ${W} ${H + 18}`} role="img" aria-label={label}>
      {bins.map(([y, n], i) => {
        const h = (n / mx) * H;
        return (
          <g key={y}>
            <rect x={i * bw + 2} y={H - h} width={bw - 4} height={Math.max(0, h)} fill="var(--accent)"><title>{`${yf(locale, y)}–${yf(locale, y + 2)}: ${nf(locale, n)}`}</title></rect>
            {i % 3 === 0 ? <text x={i * bw + bw / 2} y={H + 14} textAnchor="middle">{yf(locale, y)}</text> : null}
          </g>
        );
      })}
    </svg>
  );
}
