import { Link } from 'react-router-dom';
import { listMistakes } from '../services/mistakeStore';
import { drillStats } from '../services/thinkingDrillStore';
import { tallySteps, STEP_META } from '../services/spyScanSafe';

// Where the Spy, Scan, Safe routine is breaking down: mistakes from analysed games tagged by
// step, alongside drill accuracy. Renders nothing until there's data.
export default function RoutineSummary({ className = '' }) {
  const { counts, total, weakest } = tallySteps(listMistakes());
  const drills = drillStats();
  const drilled = Object.values(drills).some(d => d.played > 0);
  if (total === 0 && !drilled) return null;

  return (
    <div className={`card-base p-4 ${className}`}>
      <div className="flex items-baseline justify-between gap-2 mb-3">
        <div className="font-semibold">Spy, Scan, Safe</div>
        <Link to="/pre-move-checklist" className="text-xs text-text-dim hover:text-text">The routine →</Link>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {['spy', 'scan', 'safe'].map(step => {
          const d = drills[step];
          return (
            <Link key={step} to={`/thinking-drills?step=${step}`} className={`rounded-lg p-3 ${STEP_META[step].bg} hover:opacity-90 transition-all`}>
              <div className={`text-sm font-semibold ${STEP_META[step].color}`}>{STEP_META[step].label}</div>
              <div className="text-xl font-bold tabular-nums mt-1">{counts[step]}</div>
              <div className="text-[11px] text-text-dim leading-tight">game mistakes</div>
              {d.played > 0 && <div className="text-[11px] text-text-dim mt-1 tabular-nums">Drills {Math.round((d.correct / d.played) * 100)}%</div>}
            </Link>
          );
        })}
      </div>
      {weakest && (
        <p className="text-sm text-text-dim mt-3">
          Your games break down most at <span className="text-text font-medium">{STEP_META[weakest].label}</span>: {STEP_META[weakest].blurb.toLowerCase()}.{' '}
          <Link to={`/thinking-drills?step=${weakest}`} className="text-gold">Drill {STEP_META[weakest].label}</Link>
        </p>
      )}
    </div>
  );
}
