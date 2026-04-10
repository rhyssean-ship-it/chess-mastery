export default function ProgressBar({ value, max, label, className = '' }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className={className} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max} aria-label={label}>
      {label && <div className="flex justify-between text-sm mb-1.5">
        <span className="text-text-dim">{label}</span>
        <span className="text-text font-medium">{value}/{max}</span>
      </div>}
      <div className="h-2.5 bg-bg-hover rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-gold-dim to-gold rounded-full progress-fill"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
