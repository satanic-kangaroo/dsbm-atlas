/** Decorative hero graphic: a wireframe globe with a few glowing "band" points. Pure SVG, no data, aria-hidden. */
export default function Orb() {
  const dots: [number, number, number][] = [[150, 120, 5], [178, 112, 3.5], [205, 100, 3], [120, 140, 3], [260, 170, 3.5], [96, 230, 2.5], [300, 120, 2.5], [210, 260, 3], [170, 150, 6]];
  return (
    <div className="orb" aria-hidden="true">
      <svg viewBox="0 0 400 400" fill="none" stroke="currentColor">
        <defs><radialGradient id="orbg" cx="40%" cy="35%" r="70%"><stop offset="0" stopColor="currentColor" stopOpacity=".18" /><stop offset="1" stopColor="currentColor" stopOpacity="0" /></radialGradient></defs>
        <circle cx="200" cy="200" r="168" fill="url(#orbg)" strokeOpacity=".5" />
        <g className="spin" strokeOpacity=".28" strokeWidth="1">
          <ellipse cx="200" cy="200" rx="168" ry="60" /><ellipse cx="200" cy="200" rx="168" ry="120" /><ellipse cx="200" cy="200" rx="60" ry="168" /><ellipse cx="200" cy="200" rx="120" ry="168" /><path d="M32 200h336M200 32v336" />
        </g>
        <g fill="currentColor" stroke="none" className="sweep">{dots.map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} opacity={0.5 + (i % 3) * 0.2} />)}</g>
        <circle cx="200" cy="200" r="190" strokeOpacity=".15" strokeDasharray="2 8" />
      </svg>
    </div>
  );
}
