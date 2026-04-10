export default function ProgressBar({ value, max, label, className = '' }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className={className}>
      {label && <div className="flex justify-between text-sm mb-1">
        <span className="text-text-dim">{label}</span>
        <span className="text-text">{value}/{max}</span>
      </div>}
      <div className="h-2 bg-bg-hover rounded-full overflow-hidden">
        <div
          className="h-full bg-gold rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
