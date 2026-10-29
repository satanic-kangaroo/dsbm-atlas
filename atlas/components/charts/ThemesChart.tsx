"use client";
import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import { nf, pctSign, year as yf } from "@/lib/i18n";
import { getMessages, themeName } from "@/lib/messages";
import type { ThemePoint } from "@/lib/types";

const COLS = ["var(--accent)", "var(--c2)", "var(--c3)", "var(--c4)"];
const PERIODS = ["1992-2009", "2010-2014", "2015-2019", "2020-now"];

export default function ThemesChart({ themes, locale }: { themes: Record<string, ThemePoint[]>; locale: Locale }) {
  const m = getMessages(locale);
  const keys = Object.keys(themes);
  const [sel, setSel] = useState<string[]>(["suicide", "depression"].filter((k) => themes[k]));
  const toggle = (k: string) => setSel((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k].slice(-4)));
  const W = 640, H = 300, ml = 36, mr = 14, mt = 12, mb = 26;
  const mx = Math.max(20, ...sel.flatMap((k) => themes[k].map((r) => r.hi))), top = Math.ceil(mx / 10) * 10;
  const X = (i: number) => ml + ((i + 0.5) / 4) * (W - ml - mr), Y = (v: number) => H - mb - (v / top) * (H - mt - mb);
  const grid: number[] = []; for (let v = 0; v <= top; v += 10) grid.push(v);
  const plabel = (p: string) => p.replace("now", locale === "fa" ? "اکنون" : "now").replace(/-/g, "–").replace(/\d+/g, (d) => yf(locale, +d));
  return (
    <div>
      <div className="seg">{keys.map((k) => <button key={k} className="chip" aria-pressed={sel.includes(k)} onClick={() => toggle(k)}>{themeName(locale, k)}</button>)}</div>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={m.themes.cap}>
        {grid.map((v) => <g key={v}><line x1={ml} x2={W - mr} y1={Y(v)} y2={Y(v)} className="ax" /><text x={ml - 4} y={Y(v) + 4} textAnchor="end">{nf(locale, v) + pctSign(locale)}</text></g>)}
        {PERIODS.map((p, i) => <text key={p} x={X(i)} y={H - 8} textAnchor="middle">{plabel(p)}</text>)}
        {sel.map((k, j) => {
          const rows = themes[k], c = COLS[j % 4];
          return (
            <g key={k}>
              <polyline points={rows.map((r, i) => `${X(i)},${Y(r.pct)}`).join(" ")} fill="none" stroke={c} strokeWidth={2} />
              {rows.map((r, i) => (
                <g key={i}>
                  <line x1={X(i) + j * 4 - 6} x2={X(i) + j * 4 - 6} y1={Y(r.lo)} y2={Y(r.hi)} stroke={c} strokeWidth={1.2} opacity={0.6} />
                  <circle cx={X(i)} cy={Y(r.pct)} r={4.5} fill={c}><title>{`${themeName(locale, k)} · ${r.period}: ${nf(locale, r.pct, { maximumFractionDigits: 1 })}% (${nf(locale, r.lo, { maximumFractionDigits: 0 })}–${nf(locale, r.hi, { maximumFractionDigits: 0 })}) · n=${nf(locale, r.n)}`}</title></circle>
                </g>
              ))}
            </g>
          );
        })}
      </svg>
      <div className="legend">{sel.map((k, j) => <span key={k}><i style={{ background: COLS[j % 4] }} />{themeName(locale, k)}</span>)}</div>
    </div>
  );
}
