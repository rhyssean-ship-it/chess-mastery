import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { lastActivity, dayStreak, recentRoutes } from '../services/activityTracker';
import { dueCount as mistakesDueCount, listMistakes } from '../services/mistakeStore';
import { listSavedGames } from '../services/savedGames';
import { listDue as repertoireDue } from '../services/repertoireSRS';

function loadJson(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}
function dateKey(d = new Date()) { return d.toISOString().slice(0, 10); }

function timeGreeting() {
  const h = new Date().getHours();
  if (h < 5) return 'Late night';
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  if (h < 22) return 'Good evening';
  return 'Late evening';
}

function timeSince(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export default function Home() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick(x => x + 1), 30000);
    return () => clearInterval(t);
  }, []);

  const activity = lastActivity();
  const streak = dayStreak();
  const recent = recentRoutes();
  const mistakes = mistakesDueCount();
  const totalMistakes = listMistakes().length;
  const savedGames = listSavedGames();
  const repDue = repertoireDue().length;

  // Daily challenge status (from existing progressService logging)
  const dailyChallenge = loadJson('chess-mastery:daily', {});
  const dailyChallengeDone = dailyChallenge?.lastCompleted === dateKey();

  // Daily Calculation status
  const dailyCalc = loadJson('chess-mastery:dailyCalculation', { streak: 0, history: [] });
  const dailyCalcDone = dailyCalc?.lastSolved === dateKey();

  // Puzzle Rush stats
  const rush = loadJson('chess-mastery:puzzleRush', { rating: 1000, bestSolved: 0 });

  // Rating estimator latest
  const rater = loadJson('chess-mastery:ratingEstimator', { history: [] });
  const lastRating = rater.history?.[rater.history.length - 1];

  return (
    <div className="page-enter page page-wide">
      <div className="mb-5">
        <h1 className="text-2xl sm:text-3xl font-display">{timeGreeting()}.</h1>
        <p className="text-text-dim text-sm mt-1">
          {streak > 0 ? <>Day <span className="text-gold font-semibold">{streak}</span> streak · </> : null}
          {totalMistakes > 0 && <>{totalMistakes} saved mistakes</>}
          {totalMistakes > 0 && lastRating ? ' · ' : ''}
          {lastRating && <>Est. rating <span className="text-gold font-semibold">{lastRating.estimated}</span></>}
        </p>
      </div>

      {/* Hero: continue */}
      {activity && (
        <Link to={activity.path} className="block mb-5 group">
          <div className="card-base p-5 hover:bg-bg-hover/30 transition-all border-l-4 border-gold">
            <div className="text-xs text-text-dim mb-1 uppercase tracking-wide">Continue where you left off</div>
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-xl font-display truncate">{activity.label}</div>
                <div className="text-xs text-text-dim mt-0.5">{timeSince(activity.at)}</div>
              </div>
              <span className="text-gold text-2xl group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>
        </Link>
      )}

      {/* Today cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        <Link to="/daily" className="card-base p-4 hover:bg-bg-hover/30 transition-all flex flex-col justify-between min-h-[100px]">
          <div>
            <div className="text-xs text-text-dim uppercase tracking-wide mb-1">Daily Challenge</div>
            <div className="text-base font-semibold">{dailyChallengeDone ? 'Solved today' : 'Today\'s tactical puzzle'}</div>
          </div>
          <div className={`text-sm mt-2 ${dailyChallengeDone ? 'text-correct' : 'text-gold'}`}>
            {dailyChallengeDone ? '✓ Done' : 'Start →'}
          </div>
        </Link>

        <Link to="/daily-calculation" className="card-base p-4 hover:bg-bg-hover/30 transition-all flex flex-col justify-between min-h-[100px]">
          <div>
            <div className="text-xs text-text-dim uppercase tracking-wide mb-1">Daily Calculation</div>
            <div className="text-base font-semibold">{dailyCalcDone ? 'Solved today' : '5-min clock starts now'}</div>
            {dailyCalc.streak > 0 && <div className="text-xs text-text-dim mt-1">🔥 {dailyCalc.streak} day streak</div>}
          </div>
          <div className={`text-sm mt-2 ${dailyCalcDone ? 'text-correct' : 'text-gold'}`}>
            {dailyCalcDone ? '✓ Done' : 'Start →'}
          </div>
        </Link>

        <Link to="/puzzle-rush" className="card-base p-4 hover:bg-bg-hover/30 transition-all flex flex-col justify-between min-h-[100px]">
          <div>
            <div className="text-xs text-text-dim uppercase tracking-wide mb-1">Puzzle Rush</div>
            <div className="text-base font-semibold">Rating <span className="text-gold tabular-nums">{rush.rating}</span></div>
            <div className="text-xs text-text-dim mt-1">Best score {rush.bestSolved || 0}</div>
          </div>
          <div className="text-sm mt-2 text-gold">Train →</div>
        </Link>

        <Link to="/my-mistakes" className="card-base p-4 hover:bg-bg-hover/30 transition-all flex flex-col justify-between min-h-[100px]">
          <div>
            <div className="text-xs text-text-dim uppercase tracking-wide mb-1">Your Mistakes</div>
            <div className="text-base font-semibold">
              {mistakes > 0 ? <><span className="text-gold tabular-nums">{mistakes}</span> due for review</> : totalMistakes > 0 ? 'All reviewed' : 'No mistakes yet'}
            </div>
            <div className="text-xs text-text-dim mt-1">{totalMistakes} saved overall</div>
          </div>
          <div className="text-sm mt-2 text-gold">{totalMistakes > 0 ? 'Review →' : 'Play a game →'}</div>
        </Link>
      </div>

      {/* Secondary row: repertoire + saved games */}
      {(repDue > 0 || savedGames.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          {repDue > 0 && (
            <Link to="/repertoire" className="card-base p-4 hover:bg-bg-hover/30 transition-all">
              <div className="text-xs text-text-dim uppercase tracking-wide mb-1">Repertoire</div>
              <div className="text-base font-semibold"><span className="text-gold tabular-nums">{repDue}</span> line{repDue === 1 ? '' : 's'} due for drill</div>
              <div className="text-sm mt-2 text-gold">Drill →</div>
            </Link>
          )}
          {savedGames.length > 0 && (
            <Link to="/profile" className="card-base p-4 hover:bg-bg-hover/30 transition-all">
              <div className="text-xs text-text-dim uppercase tracking-wide mb-1">Reviewed games</div>
              <div className="text-base font-semibold">{savedGames.length} on file</div>
              <div className="text-xs text-text-dim mt-1">Latest: {savedGames[0].label}</div>
            </Link>
          )}
        </div>
      )}

      {/* Quick start */}
      <div className="mb-5">
        <div className="text-xs text-text-dim uppercase tracking-wide mb-2">Quick start</div>
        <div className="flex flex-wrap gap-2">
          <Link to="/play" className="btn btn-primary">▶ Play a game</Link>
          <Link to="/tactics" className="btn btn-secondary">10 tactics</Link>
          <Link to="/pattern-dojo" className="btn btn-secondary">Pattern flash</Link>
          <Link to="/learning-path" className="btn btn-secondary">Learning path</Link>
        </div>
      </div>

      {/* Recent activity — dividers, no card */}
      {recent.length > 1 && (
        <div>
          <div className="text-xs text-text-dim uppercase tracking-wide mb-2">Recent activity</div>
          <div className="list-dividers">
            {recent.slice(0, 5).map((r, i) => (
              <Link key={i} to={r.path} className="flex justify-between items-center px-1 py-2.5 hover:bg-bg-hover/30 rounded transition-all -mx-1">
                <span className="text-sm">{r.label}</span>
                <span className="text-xs text-text-dim">{timeSince(r.at)}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
