import { useState, useEffect } from 'react';
import PuzzleSolver from '../components/PuzzleSolver';
import { pickNearRating } from '../services/lichessPuzzleService';

const STORE_KEY = 'chess-mastery:ratingEstimator';
const BATTERY_SIZE = 16;

function loadStore() { try { return JSON.parse(localStorage.getItem(STORE_KEY)) || { history: [] }; } catch { return { history: [] }; } }
function saveStore(s) { localStorage.setItem(STORE_KEY, JSON.stringify(s)); }

export default function RatingEstimator() {
  const [store, setStore] = useState(loadStore);
  const [phase, setPhase] = useState('idle'); // idle | testing | done
  const [target, setTarget] = useState(1200);
  const [results, setResults] = useState([]);   // [{ rating, success }]
  const [puzzle, setPuzzle] = useState(null);
  const [seenIds, setSeenIds] = useState(new Set());

  function start() {
    setResults([]);
    setSeenIds(new Set());
    setTarget(1200);
    setPhase('testing');
    setPuzzle(pickNearRating(1200, new Set()));
  }

  function record(success) {
    const r = puzzle.rating;
    const newResults = [...results, { rating: r, success }];
    setResults(newResults);
    const seen = new Set(seenIds);
    seen.add(puzzle.id);
    setSeenIds(seen);

    if (newResults.length >= BATTERY_SIZE) {
      finish(newResults);
      return;
    }

    // Adaptive: success → +120 cp, failure → -120 cp. K-factor shrinks late in the battery.
    const step = Math.max(50, Math.round(150 - newResults.length * 6));
    const nextTarget = success ? Math.min(2400, r + step) : Math.max(600, r - step);
    setTarget(nextTarget);
    setTimeout(() => setPuzzle(pickNearRating(nextTarget, seen)), 800);
  }

  function finish(allResults) {
    setPhase('done');
    // Estimated rating: weighted average of the puzzle ratings we attempted, weighted by recency
    // and corrected for success rate. Simple model: estimated = mean(rating) + (successRate - 0.5) * 400.
    const ratings = allResults.map(r => r.rating);
    const meanR = ratings.reduce((a, b) => a + b, 0) / ratings.length;
    const successRate = allResults.filter(r => r.success).length / allResults.length;
    const estimated = Math.round(meanR + (successRate - 0.5) * 400);
    const ci = Math.round(200 / Math.sqrt(allResults.length)); // crude confidence interval
    const result = { date: Date.now(), estimated, low: estimated - ci, high: estimated + ci, successRate };
    const next = { history: [...store.history, result].slice(-10) };
    setStore(next);
    saveStore(next);
  }

  const latest = store.history[store.history.length - 1];

  if (phase === 'idle') {
    return (
      <div className="page-enter max-w-2xl mx-auto px-4 sm:px-6 py-10 text-center">
        <h1 className="text-3xl font-display text-gold mb-1">Rating Estimator</h1>
        <p className="text-text-dim mb-6">An adaptive battery of {BATTERY_SIZE} puzzles. Difficulty rises and falls to home in on your level.</p>
        {latest && (
          <div className="card-base p-5 mb-6">
            <div className="text-xs text-text-dim mb-1">Last estimate</div>
            <div className="text-5xl font-display text-gold tabular-nums">{latest.estimated}</div>
            <div className="text-xs text-text-dim mt-1">±{Math.round((latest.high - latest.low) / 2)} confidence range · {new Date(latest.date).toLocaleDateString()}</div>
          </div>
        )}
        <button onClick={start} className="bg-gold text-bg px-6 py-3 rounded-lg font-semibold hover:bg-gold-dim btn-press">{latest ? 'Re-estimate' : 'Begin assessment'}</button>
      </div>
    );
  }

  if (phase === 'done') {
    return (
      <div className="page-enter max-w-2xl mx-auto px-4 sm:px-6 py-10 text-center">
        <h1 className="text-3xl font-display text-gold mb-1">Assessment complete</h1>
        <p className="text-text-dim mb-6">Based on {BATTERY_SIZE} puzzles your estimated tactical rating is:</p>
        <div className="card-base p-6 mb-6">
          <div className="text-6xl font-display text-gold tabular-nums">{latest.estimated}</div>
          <div className="text-sm text-text-dim mt-2">Range: {latest.low} – {latest.high}</div>
          <div className="text-xs text-text-dim mt-1">Solved {Math.round(latest.successRate * 100)}% · Tactical strength only — over-the-board play also depends on time management and strategy.</div>
        </div>
        <div className="flex gap-3 justify-center">
          <button onClick={() => setPhase('idle')} className="px-5 py-2.5 rounded-lg bg-bg-card border border-bg-hover hover:bg-bg-hover">Back</button>
          <button onClick={start} className="px-5 py-2.5 rounded-lg bg-gold text-bg font-semibold hover:bg-gold-dim">Run again</button>
        </div>
      </div>
    );
  }

  // testing
  const progress = (results.length / BATTERY_SIZE) * 100;
  return (
    <div className="page-enter max-w-4xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-4">
        <div className="flex justify-between text-xs text-text-dim mb-1">
          <span>Puzzle {results.length + 1} / {BATTERY_SIZE}</span>
          <span>Target rating ~{target}</span>
        </div>
        <div className="h-1.5 bg-bg-hover rounded-full overflow-hidden">
          <div className="h-full bg-gold transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-6">
        <div className="mx-auto w-full max-w-[480px]">
          {puzzle && (
            <PuzzleSolver
              key={puzzle.id}
              puzzle={puzzle}
              onSolved={() => record(true)}
              onFailed={() => record(false)}
            />
          )}
        </div>
        <div className="space-y-2">
          {results.slice(-8).reverse().map((r, i) => (
            <div key={i} className={`px-3 py-2 rounded-lg text-xs flex justify-between ${r.success ? 'bg-correct/10 border border-correct/20' : 'bg-incorrect/10 border border-incorrect/20'}`}>
              <span>{r.success ? '✓ Solved' : '✗ Missed'}</span>
              <span className="tabular-nums text-text-dim">{r.rating}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
