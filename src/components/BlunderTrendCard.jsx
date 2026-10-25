import { Link } from 'react-router-dom';
import { blunderTrend } from '../services/gameLog';
import { STEP_META } from '../services/spyScanSafe';

// The one number that matters at ~500: blunders per game, over the last 20 analysed games.
export default function BlunderTrendCard({ className = '' }) {
  const { rows, recent, trend, steps } = blunderTrend();
  const last = rows.slice(-20);

  if (last.length === 0) {
    return (
      <div className={`card-base p-4 ${className}`}>
        <div className="text-sm font-semibold">Blunders per game</div>
        <p className="text-sm text-text-dim mt-1">The number to watch at your level. Play a game, tap Analyse at the end, and your trend starts here.</p>
        <Link to="/practice-play?coach=sharp" className="text-sm text-gold mt-2 inline-block">Play a coached game →</Link>
      </div>
    );
  }

  const max = Math.max(3, ...last.map(r => r.blunders));
  const stepTotal = steps.spy + steps.scan + steps.safe;
  const weakest = stepTotal ? Object.keys(steps).sort((a, b) => steps[b] - steps[a])[0] : null;

  return (
    <div className={`card-base p-4 ${className}`}>
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <div className="text-sm font-semibold">Blunders per game</div>
          <div className="text-xs text-text-dim">Last {Math.min(5, rows.length)} games · aim for under 1</div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold tabular-nums text-gold">{recent.toFixed(1)}</div>
          {trend != null && (
            <div className={`text-xs tabular-nums ${trend < 0 ? 'text-correct' : trend > 0 ? 'text-incorrect' : 'text-text-dim'}`}>
              {trend < 0 ? '↓' : trend > 0 ? '↑' : '→'} {Math.abs(trend).toFixed(1)} vs previous 5
            </div>
          )}
        </div>
      </div>

      {/* one bar per game, oldest left */}
      <div className="flex items-end gap-1 h-12 mt-3" aria-label="Blunders in each of your recent games">
        {last.map((r, i) => (
          <div key={i} className="flex-1 flex flex-col justify-end h-full" title={`${r.label || 'Game'}: ${r.blunders} blunders, ${r.mistakes} mistakes`}>
            <div className={`rounded-sm ${r.blunders === 0 ? 'bg-correct/60' : 'bg-gold/70'}`} style={{ height: `${Math.max(8, (r.blunders / max) * 100)}%` }} />
          </div>
        ))}
      </div>

      {weakest && (
        <p className="text-xs text-text-dim mt-3">
          Last 10 games: Spy {steps.spy} · Scan {steps.scan} · Safe {steps.safe}. Most break at{' '}
          <Link to={`/thinking-drills?step=${weakest}`} className="text-gold">{STEP_META[weakest].label}</Link>.
        </p>
      )}
    </div>
  );
}
