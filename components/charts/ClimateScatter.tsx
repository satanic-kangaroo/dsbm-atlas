"use client";
import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import { nf } from "@/lib/i18n";
import { countryName, getMessages } from "@/lib/messages";

interface Pt { c: string; fa: string; n: number; t: number; rate: number }

export default function ClimateScatter({ points, locale }: { points: Pt[]; locale: Locale }) {
  const m = getMessages(locale);
  const [minb, setMinb] = useState(5);
  const pts = points.filter((p) => p.n >= minb);
  const W = 640, H = 340, ml = 44, mr = 12, mt = 22, mb = 40;
  const xs = points.map((p) => p.t), x0 = Math.floor(Math.min(...xs)), x1 = Math.ceil(Math.max(...xs));
  const y0 = -1.5, y1 = 1.6;
  const X = (v: number) => ml + ((v - x0) / (x1 - x0)) * (W - ml - mr);
  const Y = (v: number) => H - mb - ((Math.log10(Math.max(v, 0.03)) - y0) / (y1 - y0)) * (H - mt - mb);
  const yt = [0.03, 0.1, 0.3, 1, 3, 10, 30].filter((v) => Math.log10(v) >= y0 && Math.log10(v) <= y1);
  const xt: number[] = []; for (let t = x0; t <= x1; t += 5) xt.push(t);
  return (
    <div>
      <div className="seg">
        {[1, 5, 10].map((v) => <button key={v} className="chip" aria-pressed={minb === v} onClick={() => setMinb(v)}>{m.climate.minLabel.replace("{n}", nf(locale, v))}</button>)}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={m.climate.cap}>
        {yt.map((v) => <g key={v}><line x1={ml} x2={W - mr} y1={Y(v)} y2={Y(v)} className="ax" /><text x={ml - 5} y={Y(v) + 4} textAnchor="end">{nf(locale, v)}</text></g>)}
        {xt.map((t) => <text key={t} x={X(t)} y={H - mb + 16} textAnchor="middle">{nf(locale, t)}</text>)}
        <text x={(W + ml) / 2} y={H - 4} textAnchor="middle">{m.climate.x}</text>
        <text x={ml} y={mt - 6} textAnchor="start">{m.climate.y}</text>
        {pts.map((p) => (
          <circle key={p.c} cx={X(p.t)} cy={Y(p.rate)} r={Math.max(3, Math.min(13, Math.sqrt(p.n) * 0.9))} fill="var(--accent)" fillOpacity={0.45} stroke="var(--accent)">
            <title>{`${countryName(locale, { name: p.c, fa: p.fa })}: ${nf(locale, p.n)} · ${nf(locale, p.rate, { maximumFractionDigits: 2 })} / M · ${nf(locale, p.t, { maximumFractionDigits: 1 })}°C`}</title>
          </circle>
        ))}
      </svg>
      <div className="caveat">{m.climate.caution}</div>
    </div>
  );
}
