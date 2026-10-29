"use client";
import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import { nf } from "@/lib/i18n";
import { getMessages } from "@/lib/messages";

export interface BarRow { label: string; value: number }

export default function CountryBars({ counts, perMillion, locale }: { counts: BarRow[]; perMillion: BarRow[]; locale: Locale }) {
  const m = getMessages(locale), rtl = locale === "fa";
  const [mode, setMode] = useState<"count" | "pm">("count");
  const rows = mode === "count" ? counts : perMillion;
  const mx = Math.max(...rows.map((r) => r.value)), W = 640, rh = 26, H = rows.length * rh + 8;
  return (
    <div>
      <div className="seg">
        {(["count", "pm"] as const).map((k, i) => <button key={k} className="chip" aria-pressed={mode === k} onClick={() => setMode(k)}>{m.atlas.barsToggle[i]}</button>)}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={m.atlas.barsTitle}>
        {rows.map((r, i) => {
          const y = i * rh + 4, w = (r.value / mx) * (W - 210), x0 = rtl ? W - 130 - w : 130;
          return (
            <g key={r.label}>
              <text x={rtl ? W : 0} y={y + 16} textAnchor={rtl ? "end" : "start"} className="lbl">{r.label}</text>
              <rect x={x0} y={y + 3} width={Math.max(2, w)} height={16} fill="var(--accent)" rx={2} />
              <text x={rtl ? x0 - 6 : x0 + w + 6} y={y + 16} textAnchor={rtl ? "end" : "start"}>{nf(locale, r.value, { maximumFractionDigits: mode === "pm" ? 1 : 0 })}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
