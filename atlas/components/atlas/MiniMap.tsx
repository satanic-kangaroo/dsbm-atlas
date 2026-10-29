import type { Country } from "@/lib/types";

/** Tiny tile-grid map with one country highlighted (server-rendered, decorative). */
export default function MiniMap({ countries, current, label }: { countries: Country[]; current: string; label: string }) {
  const t = countries.filter((c) => c.tile);
  const xs = t.map((c) => c.tile![0]), ys = t.map((c) => c.tile![1]);
  const x0 = Math.min(...xs), y0 = Math.min(...ys), W = Math.max(...xs) - x0 + 1, H = Math.max(...ys) - y0 + 1, S = 14;
  return (
    <svg className="mini-map" viewBox={`0 0 ${W * S} ${H * S}`} role="img" aria-label={label}>
      {t.map((c) => <rect key={c.name} className={c.name === current ? "on" : ""} x={(c.tile![0] - x0) * S + 1} y={(c.tile![1] - y0) * S + 1} width={S - 2} height={S - 2} rx={2}><title>{c.name}</title></rect>)}
    </svg>
  );
}
