import { useState, useEffect, useRef } from 'react';
import PuzzleSolver from '../components/PuzzleSolver';
import { pickNearRating, pickPuzzles, THEME_GROUPS, updateRating } from '../services/lichessPuzzleService';
import { progressService } from '../services/progressService';

const STORE_KEY = 'chess-mastery:puzzleRush';
const RUSH_DURATION = 300; // 5 minutes

function loadStore() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch { return {}; }
}
function saveStore(s) { localStorage.setItem(STORE_KEY, JSON.stringify(s)); }

const MODES = [
  { id: 'rush5', label: '5-minute Rush', desc: 'Solve as many as you can in 5 minutes. Three strikes and you\'re out.', timed: true, maxLives: 3 },
  { id: 'survival', label: 'Survival', desc: 'No timer — just keep solving until you make 3 mistakes.', timed: false, maxLives: 3 },
  { id: 'themed', label: 'Themed sprint', desc: 'Pick one tactical motif and drill 20 puzzles in a row.', timed: false, maxLives: 99, fixedCount: 20 },
];

export default function PuzzleRush() {
  const [phase, setPhase] = useState('setup'); // setup | playing | done
  const [mode, setMode] = useState(MODES[0]);
  const [theme, setTheme] = useState(null);
  const [puzzle, setPuzzle] = useState(null);
  const [rating, setRating] = useState(() => loadStore().rating || 1000);
  const [solved, setSolved] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(RUSH_DURATION);
  const [seenIds, setSeenIds] = useState(() => new Set());
  const [showHint, setShowHint] = useState(false);
  const timerRef = useRef(null);

  const store = loadStore();

  useEffect(() => () => clearInterval(timerRef.current), []);

  function startRush() {
    setPhase('playing');
    setSolved(0);
    setStreak(0);
    setBestStreak(0);
    setLives(mode.maxLives);
    setTimeLeft(RUSH_DURATION);
    setSeenIds(new Set());
    setShowHint(false);

    const first = theme
      ? pickPuzzles({ theme, n: 1 })[0]
      : pickNearRating(rating, new Set());
    setPuzzle(first);

    if (mode.timed) {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            finish();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
  }

  function nextPuzzle(currentRating, exclude) {
    const next = theme
      ? pickPuzzles({ theme, n: 1, exclude })[0]
      : pickNearRating(currentRating, exclude);
    setPuzzle(next);
    setShowHint(false);
  }

  function finish() {
    clearInterval(timerRef.current);
    setPhase('done');
    progressService.logActivity?.(`Puzzle Rush: ${solved} solved, best streak ${bestStreak}`);
    const s = loadStore();
    const newStore = {
      rating,
      bestSolved: Math.max(s.bestSolved || 0, solved),
      bestStreak: Math.max(s.bestStreak || 0, bestStreak),
      totalSolved: (s.totalSolved || 0) + solved,
    };
    saveStore(newStore);
  }

  function handleSolved() {
    const newRating = updateRating(rating, puzzle.rating, true);
    setRating(newRating);
    setSolved(s => s + 1);
    setStreak(s => {
      const next = s + 1;
      setBestStreak(b => Math.max(b, next));
      return next;
    });
    saveStore({ ...store, rating: newRating });

    if (mode.fixedCount && solved + 1 >= mode.fixedCount) {
      finish();
      return;
    }

    setSeenIds(prev => {
      const updated = new Set(prev);
      updated.add(puzzle.id);
      setTimeout(() => nextPuzzle(newRating, updated), 600);
      return updated;
    });
  }

  function handleFailed() {
    const newRating = updateRating(rating, puzzle.rating, false);
    setRating(newRating);
    setStreak(0);
    const newLives = lives - 1;
    setLives(newLives);
    saveStore({ ...store, rating: newRating });

    if (newLives <= 0) {
      setTimeout(finish, 1200);
      return;
    }

    setSeenIds(prev => {
      const updated = new Set(prev);
      updated.add(puzzle.id);
      setTimeout(() => nextPuzzle(newRating, updated), 1500);
      return updated;
    });
  }

  function skipPuzzle() {
    setStreak(0);
    setSeenIds(prev => {
      const updated = new Set(prev);
      updated.add(puzzle.id);
      nextPuzzle(rating, updated);
      return updated;
    });
  }

  if (phase === 'setup') {
    return (
      <div className="page-enter max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-3xl font-display text-gold mb-1">Puzzle Rush</h1>
        <p className="text-text-dim text-base mb-8">High-volume tactical training. Your rating adjusts after every puzzle.</p>

        <div className="card-base p-4 mb-6 flex flex-wrap gap-4 justify-between items-center">
          <div>
            <div className="text-xs text-text-dim uppercase tracking-wide">Current rating</div>
            <div className="text-3xl font-display text-gold tabular-nums">{rating}</div>
          </div>
          <div>
            <div className="text-xs text-text-dim uppercase tracking-wide">Best score</div>
            <div className="text-3xl font-display tabular-nums">{store.bestSolved || 0}</div>
          </div>
          <div>
            <div className="text-xs text-text-dim uppercase tracking-wide">Total solved</div>
            <div className="text-2xl font-display tabular-nums">{store.totalSolved || 0}</div>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          {MODES.map(m => (
            <button
              key={m.id}
              onClick={() => setMode(m)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${mode.id === m.id ? 'border-gold bg-gold/5' : 'border-bg-hover bg-bg-card hover:bg-bg-hover/40'}`}
            >
              <div className="font-semibold mb-1">{m.label}</div>
              <div className="text-sm text-text-dim">{m.desc}</div>
            </button>
          ))}
        </div>

        {mode.id === 'themed' && (
          <div className="mb-6">
            <label className="text-sm text-text-dim font-medium block mb-2">Choose a motif</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {THEME_GROUPS.map(g => (
                <button
                  key={g.key}
                  onClick={() => setTheme(g.key)}
                  className={`px-3 py-2 rounded-lg text-sm transition-all ${theme === g.key ? 'bg-gold text-bg' : 'bg-bg-card border border-bg-hover hover:bg-bg-hover'}`}
                >{g.label}</button>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={startRush}
          disabled={mode.id === 'themed' && !theme}
          className="w-full bg-gold text-bg py-3 rounded-lg font-semibold text-lg hover:bg-gold-dim transition-all btn-press disabled:opacity-40"
        >Start</button>
      </div>
    );
  }

  if (phase === 'done') {
    return (
      <div className="page-enter max-w-2xl mx-auto px-4 sm:px-6 py-10 text-center">
        <h1 className="text-3xl font-display text-gold mb-3">Time's up</h1>
        <div className="card-base p-6 mb-6">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <Stat label="Solved" value={solved} accent />
            <Stat label="Best streak" value={bestStreak} />
            <Stat label="Rating" value={rating} />
          </div>
          {solved > (store.bestSolved || 0) && solved > 0 && (
            <div className="text-sm text-correct font-semibold">New personal best!</div>
          )}
        </div>
        <div className="flex gap-3 justify-center">
          <button onClick={() => { setPhase('setup'); }} className="px-5 py-2.5 rounded-lg bg-bg-card border border-bg-hover hover:bg-bg-hover">Back</button>
          <button onClick={startRush} className="px-5 py-2.5 rounded-lg bg-gold text-bg font-semibold hover:bg-gold-dim">Go again</button>
        </div>
      </div>
    );
  }

  // Playing
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="page-enter max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <Stat label="Solved" value={solved} accent />
        <Stat label="Rating" value={rating} />
        <Stat label="Streak" value={streak} />
        <Stat label={mode.timed ? 'Time' : 'Lives'} value={mode.timed ? `${minutes}:${seconds.toString().padStart(2, '0')}` : '♥'.repeat(lives)} warn={mode.timed && timeLeft < 30} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
        <div className="mx-auto w-full">
          {puzzle && (
            <PuzzleSolver
              key={puzzle.id}
              puzzle={puzzle}
              onSolved={handleSolved}
              onFailed={handleFailed}
              showHint={showHint}
            />
          )}
        </div>
        <div className="space-y-3">
          <div className="card-base p-4">
            <div className="text-xs text-text-dim uppercase tracking-wide mb-1">Puzzle rating</div>
            <div className="text-2xl font-display tabular-nums">{puzzle?.rating}</div>
            {puzzle?.themes?.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {puzzle.themes.slice(0, 4).map(t => (
                  <span key={t} className="text-[10px] bg-bg-hover/50 px-2 py-0.5 rounded-full text-text-dim">{t}</span>
                ))}
              </div>
            )}
          </div>
          <button onClick={() => setShowHint(true)} className="w-full py-2 rounded-lg bg-bg-card border border-bg-hover hover:bg-bg-hover text-sm">Show hint</button>
          <button onClick={skipPuzzle} className="w-full py-2 rounded-lg bg-bg-card border border-bg-hover hover:bg-bg-hover text-sm">Skip (breaks streak)</button>
          <button onClick={finish} className="w-full py-2 rounded-lg bg-incorrect/10 border border-incorrect/30 text-incorrect hover:bg-incorrect/20 text-sm">End rush</button>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, accent = false, warn = false }) {
  return (
    <div className="card-base px-3 py-2">
      <div className="text-[10px] text-text-dim uppercase tracking-wide">{label}</div>
      <div className={`text-xl font-display tabular-nums ${warn ? 'text-incorrect' : accent ? 'text-gold' : ''}`}>{value}</div>
    </div>
  );
}
