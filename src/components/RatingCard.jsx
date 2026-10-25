import { Link } from 'react-router-dom';
import { ratingSummary, PROVISIONAL_GAMES, START_RATING } from '../services/ratingHistory';
import RatingChart from './RatingChart';

// Your enPassant rating, the week's movement and a sparkline of the last 30 rated games.
export default function RatingCard({ className = '' }) {
  const { rows, rating, games, provisional, weekDelta } = ratingSummary();

  if (games === 0) {
    return (
      <Link to="/play" className={`card-base p-4 block hover:bg-bg-hover/30 transition-all ${className}`}>
        <div className="flex items-baseline justify-between gap-3">
          <div>
            <div className="text-sm font-semibold">Your rating</div>
            <p className="text-sm text-text-dim mt-1 leading-snug">You start at {START_RATING}. Turn on Rated when you play the computer and every game moves it.</p>
          </div>
          <div className="text-2xl font-bold tabular-nums text-text-dim">{START_RATING}</div>
        </div>
        <div className="text-sm text-gold mt-2">Play a rated game →</div>
      </Link>
    );
  }

  return (
    <Link to="/profile/rating" className={`card-base p-4 block hover:bg-bg-hover/30 transition-all ${className}`}>
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <div className="text-sm font-semibold">Your rating</div>
          <div className="text-xs text-text-dim">
            {provisional ? `Provisional · ${games} of ${PROVISIONAL_GAMES} games` : `${games} rated games`}
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold tabular-nums text-gold">{rating}{provisional && <span className="text-lg text-text-dim">?</span>}</div>
          {weekDelta != null && (
            <div className={`text-xs tabular-nums ${weekDelta > 0 ? 'text-correct' : weekDelta < 0 ? 'text-incorrect' : 'text-text-dim'}`}>
              {weekDelta > 0 ? '+' : ''}{weekDelta} this week
            </div>
          )}
        </div>
      </div>
      <RatingChart rows={rows.slice(-30)} compact className="mt-3" />
      <div className="text-sm text-gold mt-2">See history →</div>
    </Link>
  );
}
