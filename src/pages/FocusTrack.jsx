import { Link } from 'react-router-dom';
import BlunderTrendCard from '../components/BlunderTrendCard';
import { listGames } from '../services/gameLog';
import { drillDays } from '../services/thinkingDrillStore';
import { dueCount } from '../services/mistakeStore';
import { useFocusMode, setFocusMode } from '../services/focusMode';
import masterGames from '../data/masterGames';
import endgameDrills from '../data/endgameDrills';
import { localDateKey } from '../utils/dateKey';

const ENDGAME_BASICS = ['kqk', 'krk', 'kpk-1'];

function loadJson(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}
const dateKey = localDateKey;

// Monday-to-Sunday of the current week, as YYYY-MM-DD strings.
function thisWeek() {
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  monday.setHours(0, 0, 0, 0);
  // build each day from calendar parts, not +86400000ms, so DST weeks stay Monday to Sunday
  return { start: monday.getTime(), days: new Set(Array.from({ length: 7 }, (_, i) => dateKey(new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i)))) };
}

function Habit({ title, why, done, target, unit, to, cta, complete }) {
  const met = complete ?? done >= target;
  return (
    <div className={`card-base p-4 ${met ? 'bg-correct/5' : ''}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-semibold">{title}</div>
          <p className="text-sm text-text-dim mt-0.5 leading-snug">{why}</p>
        </div>
        {target != null && (
          <div className={`shrink-0 text-right tabular-nums ${met ? 'text-correct' : 'text-text'}`}>
            <div className="text-lg font-bold">{done}/{target}</div>
            <div className="text-[11px] text-text-dim">{unit}</div>
          </div>
        )}
      </div>
      {target != null && (
        <div className="h-1 bg-bg-hover rounded-full overflow-hidden mt-3">
          <div className={`h-full ${met ? 'bg-correct' : 'bg-gold'}`} style={{ width: `${Math.min(100, (done / target) * 100)}%` }} />
        </div>
      )}
      <Link to={to} className="btn btn-secondary btn-sm mt-3">{cta}</Link>
    </div>
  );
}

export default function FocusTrack() {
  const focus = useFocusMode();
  const week = thisWeek();

  const gamesThisWeek = listGames().filter(r => r.at >= week.start).length;
  const easyDays = (loadJson('chess-mastery:puzzleRush', {}).easyDays || []).filter(d => week.days.has(d)).length;
  const drillDaysThisWeek = drillDays().filter(d => week.days.has(d)).length;
  const due = dueCount();
  const egStore = loadJson('chess-mastery:endgameDrills', {});
  const egDrills = endgameDrills.filter(d => ENDGAME_BASICS.includes(d.id) && (egStore[d.id]?.consecutive || 0) >= d.wins).length;
  const beginnerGames = masterGames.filter(g => g.level === 'Beginner');
  const guessStats = loadJson('chess-mastery:guessTheMove', {});
  const guessed = beginnerGames.filter(g => guessStats[g.id]).length;

  return (
    <div className="page-enter page page-narrow">
      <h1 className="text-2xl sm:text-3xl font-display mb-1">Your 500 → 900 track</h1>
      <p className="text-text-dim text-sm mb-5">
        At this level most games are lost to hung pieces and missed one-move tactics. These habits fix that. Everything else in the app can wait.
      </p>

      <BlunderTrendCard className="mb-5" />

      <div className="text-sm font-semibold text-text-dim/80 mb-2">This week</div>
      <div className="space-y-3 mb-6">
        <Habit
          title="Play slow, coached games, then review them"
          why="Spy, Scan, Safe needs time on the clock to become automatic. Every game you analyse feeds the trend above."
          done={gamesThisWeek} target={3} unit="analysed"
          to="/practice-play?coach=sharp" cta="Play a coached game"
        />
        <Habit
          title="Easy tactics, most days"
          why="Twenty short puzzles you can solve in seconds. At this level, pattern speed comes from volume, not hard puzzles."
          done={easyDays} target={5} unit="days"
          to="/puzzle-rush?mode=easy" cta="Start an easy sprint"
        />
        <Habit
          title="Drill the routine"
          why="A few minutes on the step your games break at most."
          done={drillDaysThisWeek} target={3} unit="days"
          to="/thinking-drills" cta="Spy, Scan, Safe drills"
        />
        <Habit
          title="Re-solve your own mistakes"
          why="The positions that cost you points, on a spaced schedule so they stick."
          complete={due === 0}
          to="/my-mistakes" cta={due > 0 ? `Review ${due} due` : 'All caught up'}
        />
      </div>

      <div className="text-sm font-semibold text-text-dim/80 mb-2">Foundations</div>
      <div className="space-y-3 mb-6">
        <Habit
          title="Three endgames you must win"
          why="King and queen vs king, king and rook vs king, and king and pawn opposition. Win each three times in a row against the engine."
          done={egDrills} target={3} unit="mastered"
          to={`/endgame-drills?focus=${ENDGAME_BASICS.join(',')}`} cta="Endgame drills"
        />
        <Habit
          title="Learn from the classics"
          why="Play through the Beginner games with Guess the move: pick a side and try to find each move before it’s shown."
          done={guessed} target={beginnerGames.length} unit="games"
          to="/master-games" cta="Annotated games"
        />
        <div className="card-base p-4">
          <div className="font-semibold">One opening each, played on principles</div>
          <p className="text-sm text-text-dim mt-0.5 leading-snug">
            Don’t memorise lines yet. Control the centre, develop knights before bishops, castle early, and don’t move the queen out early. A small repertoire is plenty:
          </p>
          <ul className="text-sm mt-2 space-y-1">
            <li><span className="text-text-dim">As White:</span> <Link to="/openings/italian-game" className="text-gold">Italian Game</Link></li>
            <li><span className="text-text-dim">Against 1.e4:</span> 1…e5, the same <Link to="/openings/italian-game" className="text-gold">Italian</Link> ideas from Black’s side</li>
            <li><span className="text-text-dim">Against 1.d4:</span> <Link to="/openings/slav-defence" className="text-gold">Slav Defence</Link></li>
          </ul>
        </div>
      </div>

      <div className="card-base p-4 text-sm">
        {focus ? (
          <>
            <span className="font-semibold">Focus mode is on.</span>{' '}
            <span className="text-text-dim">Menus only show what’s on this track.</span>{' '}
            <button onClick={() => setFocusMode(false)} className="text-gold">Show everything</button>
          </>
        ) : (
          <>
            <span className="font-semibold">Focus mode is off.</span>{' '}
            <span className="text-text-dim">Menus show every feature.</span>{' '}
            <button onClick={() => setFocusMode(true)} className="text-gold">Only show what’s on this track</button>
          </>
        )}
      </div>
    </div>
  );
}
