import { useState, useEffect, useRef } from 'react';
import PuzzleSolver from '../components/PuzzleSolver';
import puzzles from '../data/lichessPuzzles';
import { progressService } from '../services/progressService';
import { localDateKey, localDateKeyDaysAgo } from '../utils/dateKey';

const STORE_KEY = 'chess-mastery:dailyCalculation';
const TIME_LIMIT = 300; // 5 minutes

function loadStore() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY)) || { streak: 0, history: [], lastSolved: null }; }
  catch { return { streak: 0, history: [], lastSolved: null }; }
}
function saveStore(s) { localStorage.setItem(STORE_KEY, JSON.stringify(s)); }

// Pick a deterministic puzzle for today: a stretch for an improving player, not a wall.
function getTodaysPuzzle() {
  const today = new Date();
  const epoch = Math.floor(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) / 86400000); // local calendar day
  const pool = puzzles.filter(p => p.rating >= 900 && p.rating <= 1300);
  if (pool.length === 0) return puzzles[0];
  return pool[epoch % pool.length];
}

function dateKey(d = new Date()) {
  return localDateKey(d);
}

export default function DailyCalculation() {
  const [puzzle] = useState(getTodaysPuzzle);
  const [store, setStore] = useState(loadStore);
  // One real attempt per day: solved or failed, today is done (replays are practice only).
  const attemptedToday = store.lastSolved === dateKey() || (store.history || []).some(h => h.date === dateKey());
  const [phase, setPhase] = useState(() => attemptedToday ? 'already' : 'ready');
  const [replay, setReplay] = useState(false); // re-trying after today's solve: practice only, no streak changes
  // A streak only counts if the last solve was today or yesterday.
  const liveStreak = [dateKey(), localDateKeyDaysAgo(1)].includes(store.lastSolved) ? store.streak : 0;
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [showHint, setShowHint] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => () => clearInterval(timerRef.current), []);

  function start() {
    setPhase('solving');
    setTimeLeft(TIME_LIMIT);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleTimeout();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }

  function handleTimeout() {
    setPhase('failed');
    if (replay) return;
    const next = { ...store, streak: 0, history: [...store.history, { date: dateKey(), result: 'timeout' }].slice(-30) };
    setStore(next);
    saveStore(next);
  }

  function handleSolved() {
    clearInterval(timerRef.current);
    setPhase('solved');
    if (replay) return;
    // The hint button says it forfeits the streak, so it does.
    const streak = showHint ? 0
      : store.lastSolved === localDateKeyDaysAgo(1) ? store.streak + 1 : store.lastSolved === dateKey() ? store.streak : 1;
    const next = {
      ...store,
      streak,
      history: [...store.history, { date: dateKey(), result: 'solved', timeUsed: TIME_LIMIT - timeLeft }].slice(-30),
      lastSolved: dateKey(),
    };
    setStore(next);
    saveStore(next);
    progressService.recordPuzzleAttempt?.(`daily-calc-${puzzle.id}`, 'Daily Calculation', true);
  }

  function handleFailed() {
    clearInterval(timerRef.current);
    setPhase('failed');
    if (replay) return;
    const next = { ...store, streak: 0, history: [...store.history, { date: dateKey(), result: 'failed' }].slice(-30) };
    setStore(next);
    saveStore(next);
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="page-enter max-w-4xl mx-auto px-4 sm:px-6 py-6 lg:py-10">
      <div className="flex flex-wrap items-baseline justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display">Daily Calculation</h1>
          <p className="text-text-dim text-sm">One curated position per day · 5-minute clock</p>
        </div>
        <div className="flex gap-4">
          <div>
            <div className="text-xs text-text-dim">Streak</div>
            <div className="text-2xl font-display text-gold tabular-nums">{liveStreak} 🔥</div>
          </div>
        </div>
      </div>

      {phase === 'ready' && (
        <div className="card-base p-6 text-center max-w-md mx-auto">
          <p className="mb-2 text-sm text-text-dim">Today's puzzle is rated</p>
          <p className="text-4xl font-display text-gold mb-3 tabular-nums">{puzzle.rating}</p>
          <p className="text-sm text-text-dim mb-6">You have 5 minutes to find the solution. The clock starts when you begin.</p>
          <button onClick={start} className="bg-gold text-bg px-6 py-3 rounded-lg font-semibold hover:bg-gold-dim btn-press">Begin</button>
        </div>
      )}

      {phase === 'already' && (
        <div className="card-base p-6 text-center max-w-md mx-auto">
          <p className="mb-4 text-text-dim">{store.lastSolved === dateKey() ? 'You’ve solved today’s puzzle.' : 'You’ve had your attempt at today’s puzzle.'} Come back tomorrow.</p>
          <button onClick={() => { setReplay(true); setPhase('ready'); }} className="text-xs px-3 py-1.5 rounded bg-bg-card border border-bg-hover hover:bg-bg-hover">Replay anyway</button>
        </div>
      )}

      {(phase === 'solving' || phase === 'solved' || phase === 'failed') && (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
          <div className="mx-auto w-full max-w-[480px]">
            <div className="flex justify-between items-center mb-2">
              <div className="text-xs text-text-dim">Find the strongest continuation</div>
              <div className={`tabular-nums font-display text-xl ${timeLeft < 30 && phase === 'solving' ? 'text-incorrect' : 'text-gold'}`}>
                {minutes}:{seconds.toString().padStart(2, '0')}
              </div>
            </div>
            <PuzzleSolver
              key={puzzle.id}
              puzzle={puzzle}
              onSolved={handleSolved}
              onFailed={handleFailed}
              showHint={showHint && phase === 'solving'}
            />
            {phase === 'solving' && (
              <div className="mt-3 flex gap-2">
                <button onClick={() => setShowHint(true)} className="flex-1 py-2 rounded-lg bg-bg-card border border-bg-hover hover:bg-bg-hover text-sm">Hint (forfeits streak)</button>
              </div>
            )}
          </div>
          <div className="space-y-3">
            {phase === 'solved' && (
              <div className="card-base p-4 bg-correct/5">
                <div className="text-correct font-semibold mb-1">Solved in {Math.floor((TIME_LIMIT - timeLeft) / 60)}:{((TIME_LIMIT - timeLeft) % 60).toString().padStart(2, '0')}</div>
                <div className="text-xs text-text-dim">Streak now {replay ? liveStreak : store.streak}.{replay ? ' (Practice replay, streak unchanged.)' : ''} Come back tomorrow.</div>
              </div>
            )}
            {phase === 'failed' && (
              <div className="card-base p-4 bg-incorrect/5">
                <div className="text-incorrect font-semibold mb-1">{timeLeft === 0 ? 'Time\'s up.' : 'Wrong move.'}</div>
                <div className="text-xs text-text-dim">Streak reset.</div>
              </div>
            )}
            <div className="card-base p-4">
              <div className="text-xs text-text-dim mb-2 uppercase tracking-wide">Last 30 days</div>
              <div className="flex flex-wrap gap-1">
                {store.history.slice(-30).map((h, i) => (
                  <div
                    key={i}
                    title={`${h.date}: ${h.result}`}
                    className={`w-3 h-3 rounded-sm ${h.result === 'solved' ? 'bg-correct/70' : 'bg-incorrect/40'}`}
                  />
                ))}
                {store.history.length === 0 && <div className="text-xs text-text-dim">No attempts yet</div>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
