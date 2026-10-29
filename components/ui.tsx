import type { ReactNode } from "react";
import type { Locale } from "@/lib/i18n";
import { nf } from "@/lib/i18n";

export function Section({ id, eyebrow, title, take, children }: { id: string; eyebrow: string; title: string; take?: string; children: ReactNode }) {
  return (
    <section id={id}>
      <div className="eyebrow">{eyebrow}</div>
      <h2>{title}</h2>
      {take ? <p className="take">{take}</p> : null}
      {children}
    </section>
  );
}
export function ChartCard({ cap, children }: { cap?: string; children: ReactNode }) {
  return <div className="chart">{cap ? <div className="cap">{cap}</div> : null}{children}</div>;
}
/** Horizontal bars as plain divs (no JS). rows: [label, value]. */
export function HBars({ rows, max, locale }: { rows: [string, number][]; max?: number; locale: Locale }) {
  const mx = max ?? Math.max(1, ...rows.map((r) => r[1]));
  return (
    <div>
      {rows.map(([l, v]) => (
        <div className="hb" key={l}><span>{l}</span><div className="tr"><i style={{ width: `${Math.max(2, (v / mx) * 100)}%` }} /></div><em>{nf(locale, v)}</em></div>
      ))}
    </div>
  );
}
export function Kpi({ value, label }: { value: string; label: string }) {
  return <div className="kpi"><b>{value}</b><span>{label}</span></div>;
}
