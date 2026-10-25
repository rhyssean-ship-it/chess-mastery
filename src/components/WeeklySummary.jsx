import { weeklySummary, CAUSE_TEXT } from '../services/ratingHistory';
import { STEP_META } from '../services/spyScanSafe';

export default function WeeklySummary({ className = '' }) {
  const w = weeklySummary();
  if (!w.games) return null;
  const steps = ['spy', 'scan', 'safe'].filter(k => w.causes[k]);
  return (
    <div className={`card-base p-4 ${className}`}>
      <div className="text-sm font-semibold">This week</div>
      <p className="text-sm text-text-dim mt-1">
        {w.games} rated game{w.games === 1 ? '' : 's'}: {w.wins} won, {w.losses} lost.
        Rating <span className={w.delta > 0 ? 'text-correct' : w.delta < 0 ? 'text-incorrect' : ''}>{w.delta >= 0 ? '+' : ''}{w.delta}</span>.
      </p>
      {w.mainCause && (
        <p className="text-sm mt-2">
          Most losses came because {CAUSE_TEXT[w.mainCause]}
          <span className="text-text-dim"> ({w.causes[w.mainCause]} of {w.reviewedLosses}).</span>
        </p>
      )}
      {steps.length > 1 && (
        <p className="text-xs text-text-dim mt-1">
          {steps.map(k => `${STEP_META[k].label} ${w.causes[k]}`).join(' · ')}{w.causes.mistakes ? ` · Other mistakes ${w.causes.mistakes}` : ''}{w.causes.outplayed ? ` · Outplayed ${w.causes.outplayed}` : ''}
        </p>
      )}
    </div>
  );
}
