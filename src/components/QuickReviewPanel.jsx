import ChessBoard from './ChessBoard';
import { STEP_META } from '../services/spyScanSafe';

const CLASS_LABEL = { blunder: 'Blunder', mistake: 'Mistake', miss: 'Missed chance', inaccuracy: 'Inaccuracy' };

function moveLabel(a) {
  const n = Math.floor(a.ply / 2) + 1; // plies count from the standard start for rated games
  return `${n}${a.color === 'white' ? '.' : '…'} ${a.san}`;
}

// The two or three moves that cost the most in the last rated game, each with a "Try again"
// that replays the position against the same opponent.
export default function QuickReviewPanel({ review, onRetry, retrying = null, className = '' }) {
  if (!review) return null;

  if (review.status === 'running') {
    return (
      <div className={`card-base p-4 ${className}`}>
        <div className="text-sm font-semibold">Quick review</div>
        <p className="text-xs text-text-dim mt-1">Finding the moments that cost you most…</p>
        <div className="h-1.5 rounded-full bg-bg-hover mt-3 overflow-hidden">
          <div className="h-full bg-gold transition-all" style={{ width: `${Math.round((review.progress || 0) * 100)}%` }} />
        </div>
      </div>
    );
  }

  if (review.status === 'error') {
    return (
      <div className={`card-base p-4 ${className}`}>
        <div className="text-sm font-semibold">Quick review</div>
        <p className="text-xs text-text-dim mt-1">The review couldn't run. Tap Analyse for the full review instead.</p>
      </div>
    );
  }

  const { moments, minor, mistakesSaved } = review;
  return (
    <div className={`card-base p-4 ${className}`}>
      <div className="flex items-baseline justify-between gap-2">
        <div className="text-sm font-semibold">Quick review</div>
        {mistakesSaved > 0 && <div className="text-xs text-text-dim">{mistakesSaved} saved to My Mistakes</div>}
      </div>
      {moments.length === 0 ? (
        <p className="text-sm text-text-dim mt-1">A clean game: no real mistakes from you. Nice.</p>
      ) : (
        <p className="text-xs text-text-dim mt-1">
          {minor ? 'No big mistakes. These were your weakest moves:' : `The ${moments.length === 1 ? 'move' : `${moments.length} moves`} that cost you most. Try each one again.`}
        </p>
      )}
      <div className="space-y-3 mt-3">
        {moments.map(m => {
          const step = m.failedStep ? STEP_META[m.failedStep] : null;
          const active = retrying?.ply === m.ply;
          return (
            <div key={m.ply} className={`flex gap-3 rounded-lg p-2 ${active ? 'bg-gold/10' : 'bg-bg-hover/40'}`}>
              <div className="w-20 h-20 shrink-0">
                <ChessBoard fen={m.fenBefore} orientation={m.color} movable={false} coordinates={false} className="pointer-events-none" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm">
                  <span className="font-semibold">{moveLabel(m)}</span>
                  <span className={`text-xs ml-1.5 ${m.classification === 'blunder' ? 'text-incorrect' : 'text-amber'}`}>{CLASS_LABEL[m.classification] || ''}</span>
                </div>
                {step && <div className="text-xs text-text-dim mt-0.5 leading-snug"><span className={step.color}>{step.label}:</span> {step.blurb.toLowerCase()}.</div>}
                <button onClick={() => onRetry(m)}
                  className="text-xs text-gold mt-1.5 hover:underline">
                  {active ? 'Try again from here ↺' : 'Try again →'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
