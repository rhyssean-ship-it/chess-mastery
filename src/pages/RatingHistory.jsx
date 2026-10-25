import { Link } from 'react-router-dom';
import { ratingSummary, beatenPersonaIds, PROVISIONAL_GAMES, START_RATING } from '../services/ratingHistory';
import { PERSONAS, PERSONA_LEVELS, nearestLevel } from '../services/humanBot';
import RatingChart from '../components/RatingChart';
import WeeklySummary from '../components/WeeklySummary';

function fmtDate(ts) {
  return new Date(ts).toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
}

export default function RatingHistory() {
  const { rows, rating, games, provisional, weekDelta, best, record } = ratingSummary();

  return (
    <div className="page-enter max-w-2xl mx-auto px-4 sm:px-6 py-6 lg:py-10">
      <h1 className="text-2xl sm:text-3xl font-display mb-1">Your Rating</h1>
      <p className="text-text-dim text-sm mb-5">
        From rated games vs the computer, starting at {START_RATING}. It's measured against the bots' labelled strengths, so treat it as your enPassant rating rather than an exact online rating.
      </p>

      {games === 0 ? (
        <div className="card-base p-5">
          <p className="text-sm text-text-dim">No rated games yet. On the Play screen, turn on <span className="text-text">Rated</span>: hints, takebacks and blunder warnings switch off, and the result moves your rating.</p>
          <Link to="/play" className="text-sm text-gold mt-3 inline-block">Play a rated game →</Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {[
              { value: <>{rating}{provisional && <span className="text-text-dim">?</span>}</>, label: provisional ? `Provisional (${games}/${PROVISIONAL_GAMES})` : 'Current', accent: true },
              { value: weekDelta == null ? '—' : `${weekDelta > 0 ? '+' : ''}${weekDelta}`, label: 'This week' },
              { value: best, label: 'Best' },
              { value: `${record.wins}–${record.draws}–${record.losses}`, label: 'Won–drawn–lost' },
            ].map((s, i) => (
              <div key={i} className="card-base p-4 text-center">
                <div className={`text-2xl font-bold tabular-nums ${s.accent ? 'text-gold' : ''}`}>{s.value}</div>
                <div className="text-xs text-text-dim mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          <WeeklySummary className="mb-4" />

          <div className="card-base p-4 mb-4">
            <RatingChart rows={rows} />
            <p className="text-xs text-text-dim mt-2">Dots: green win, red loss, grey draw.</p>
          </div>

          <Ladder rating={rating} />

          <div className="card-base divide-y divide-bg-hover">
            {[...rows].reverse().map((r, i) => {
              const delta = r.after - r.before;
              return (
                <div key={rows.length - i} className="flex items-center gap-3 px-4 py-2.5 text-sm">
                  <span className="text-text-dim tabular-nums w-14 shrink-0">{fmtDate(r.at)}</span>
                  <span className="flex-1 min-w-0 truncate">
                    <span className={r.score === 1 ? 'text-correct' : r.score === 0 ? 'text-incorrect' : 'text-text-dim'}>
                      {r.score === 1 ? 'Won' : r.score === 0 ? 'Lost' : 'Drew'}
                    </span>
                    <span className="text-text-dim"> vs {r.botLabel} ({r.botElo})</span>
                  </span>
                  <span className={`tabular-nums w-10 text-right ${delta > 0 ? 'text-correct' : delta < 0 ? 'text-incorrect' : 'text-text-dim'}`}>
                    {delta > 0 ? '+' : ''}{delta}
                  </span>
                  <span className="tabular-nums w-10 text-right font-semibold">{r.after}</span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// Every persona, by rating: ticks for the ones you've beaten, your current level marked.
function Ladder({ rating }) {
  const beaten = beatenPersonaIds();
  const level = nearestLevel(rating);
  return (
    <div className="card-base p-4 mb-4">
      <div className="flex items-baseline justify-between gap-2">
        <div className="text-sm font-semibold">Ladder</div>
        <div className="text-xs text-text-dim">{beaten.size} of {PERSONAS.length} beaten</div>
      </div>
      <p className="text-xs text-text-dim mt-1">Beat all three at your level, then move up.</p>
      <div className="space-y-1.5 mt-3">
        {[...PERSONA_LEVELS].reverse().map(l => (
          <div key={l} className={`flex items-center gap-2 rounded-lg px-2 py-1 ${l === level ? 'bg-gold/10' : ''}`}>
            <span className={`w-12 text-xs tabular-nums ${l === level ? 'text-gold' : 'text-text-dim'}`}>{l}</span>
            <div className="flex-1 grid grid-cols-3 gap-2">
              {PERSONAS.filter(p => p.elo === l).map(p => (
                <span key={p.id} className={`text-sm ${beaten.has(p.id) ? 'text-correct' : 'text-text-dim'}`}>
                  {beaten.has(p.id) ? '✓ ' : ''}{p.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
