import type { Locale } from "@/lib/i18n";
import { nf } from "@/lib/i18n";

export const TYPE_COLOR: Record<string, string> = { "Full-length": "var(--accent)", EP: "var(--c2)", Demo: "var(--c3)", Single: "var(--c4)", Split: "var(--good)", Compilation: "var(--muted)" };
export interface Rel { title: string; type: string | null; year: number | null; month: number | null }

/** One dot per release along a time axis (server-rendered SVG; each dot has a native tooltip). */
export default function Timeline({ rels, locale, months, formed }: { rels: Rel[]; locale: Locale; months: string[]; formed: number | null }) {
  const dated = rels.filter((r) => r.year != null);
  if (!dated.length) return null;
  const ys = dated.map((r) => r.year as number), now = new Date().getFullYear();
  const y0 = Math.min(...ys, formed ?? 9999), y1 = Math.max(...ys, y0 + 1, Math.min(now, Math.max(...ys) + 1));
  const W = 720, H = 120, px = 18, span = Math.max(1, y1 - y0 + 1);
  const x = (y: number, mo: number | null) => px + ((y - y0 + ((mo ?? 6.5) - 1) / 12) / span) * (W - 2 * px);
  // stack dots that fall in the same year+month so none hide another
  const seen = new Map<string, number>();
  const dots = dated.map((r) => { const k = `${r.year}-${r.month}`; const n = seen.get(k) ?? 0; seen.set(k, n + 1); return { r, n }; });
  const step = Math.max(1, Math.ceil(span / 8));
  const ticks: number[] = []; for (let y = y0; y <= y1; y += step) ticks.push(y);
  const types = [...new Set(dated.map((r) => r.type ?? "Other"))];
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Release timeline">
        <line className="ax" x1={px} x2={W - px} y1={H - 30} y2={H - 30} />
        {ticks.map((y) => <g key={y}><line className="ax" x1={x(y, 1)} x2={x(y, 1)} y1={H - 30} y2={H - 25} /><text x={x(y, 1)} y={H - 10} textAnchor="middle">{nf(locale, y, { useGrouping: false })}</text></g>)}
        {formed ? <line x1={x(formed, 1)} x2={x(formed, 1)} y1={14} y2={H - 30} stroke="var(--line2)" strokeDasharray="3 4" /> : null}
        {dots.map(({ r, n }, i) => (
          <circle key={i} cx={x(r.year as number, r.month)} cy={H - 40 - n * 12} r={5} fill={TYPE_COLOR[r.type ?? ""] ?? "var(--muted)"} fillOpacity={0.9} stroke="var(--bg)" strokeWidth={1.5}>
            <title>{`${r.title} · ${r.type ?? ""} · ${r.month ? months[r.month - 1] + " " : ""}${nf(locale, r.year as number, { useGrouping: false })}`}</title>
          </circle>
        ))}
      </svg>
      <div className="tl-types">{types.map((t) => <span key={t}><i style={{ background: TYPE_COLOR[t] ?? "var(--muted)" }} />{t}</span>)}</div>
    </div>
  );
}
