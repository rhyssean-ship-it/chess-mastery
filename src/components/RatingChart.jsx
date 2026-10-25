// Rating over rated games, oldest left. The first point is the rating before game one.
// compact: a sparkline for the Home card; otherwise gridlines with rating labels.
export default function RatingChart({ rows, compact = false, className = '' }) {
  if (!rows || rows.length === 0) return null;

  const values = [rows[0].before, ...rows.map(r => r.after)];
  const W = 320;
  const H = compact ? 56 : 160;
  const left = compact ? 2 : 30;
  const right = 4;
  const pad = 6;

  // Snap the range to 50s, and keep it at least 100 wide so small moves don't look dramatic.
  let lo = Math.floor(Math.min(...values) / 50) * 50;
  let hi = Math.ceil(Math.max(...values) / 50) * 50;
  if (hi - lo < 100) { const mid = (lo + hi) / 2; lo = Math.floor((mid - 50) / 50) * 50; hi = lo + 100; }

  const x = (i) => left + (i / Math.max(1, values.length - 1)) * (W - left - right);
  const y = (v) => pad + (1 - (v - lo) / (hi - lo)) * (H - pad * 2);
  const line = values.map((v, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');
  const area = `${line} L ${x(values.length - 1).toFixed(1)} ${H - pad} L ${x(0).toFixed(1)} ${H - pad} Z`;

  const step = hi - lo > 400 ? 200 : hi - lo > 200 ? 100 : 50;
  const grid = [];
  for (let v = lo; v <= hi; v += step) grid.push(v);

  const last = values.length - 1;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={`w-full h-auto ${className}`} role="img"
      aria-label={`Rating chart: ${values[0]} to ${values[last]} over ${rows.length} rated games`}>
      {!compact && grid.map(v => (
        <g key={v}>
          <line x1={left} x2={W - right} y1={y(v)} y2={y(v)} className="stroke-bg-hover" strokeWidth="1" />
          <text x={left - 4} y={y(v) + 3} textAnchor="end" className="fill-text-dim" fontSize="9">{v}</text>
        </g>
      ))}
      <path d={area} className="fill-gold/10" />
      <path d={line} fill="none" className="stroke-gold" strokeWidth={compact ? 1.75 : 2} strokeLinejoin="round" strokeLinecap="round" />
      {!compact && values.length <= 60 && values.slice(1).map((v, i) => (
        <circle key={i} cx={x(i + 1)} cy={y(v)} r="2.25"
          className={rows[i].score === 1 ? 'fill-correct' : rows[i].score === 0 ? 'fill-incorrect' : 'fill-text-dim'} />
      ))}
      <circle cx={x(last)} cy={y(values[last])} r={compact ? 2.5 : 3.5} className="fill-gold" />
    </svg>
  );
}
