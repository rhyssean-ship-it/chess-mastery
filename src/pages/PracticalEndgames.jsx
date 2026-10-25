import { useState, useCallback, useMemo } from 'react';
import { Chess } from 'chess.js';
import ChessBoard from '../components/ChessBoard';
import RatingButtons from '../components/RatingButtons';
import practicalEndgames from '../data/practicalEndgames';
import { progressService } from '../services/progressService';

export default function PracticalEndgames() {
  const shuffled = useMemo(() => [...practicalEndgames].sort(() => Math.random() - 0.5), []);
  const [idx, setIdx] = useState(0);
  const [game, setGame] = useState(() => new Chess(shuffled[0].fen));
  const [fen, setFen] = useState(shuffled[0].fen);
  const [state, setState] = useState('playing'); // playing | correct | wrong | revealed
  const [finished, setFinished] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);

  const puzzle = shuffled[idx];
  const turnColor = puzzle.sideToMove === 'white' ? 'white' : 'black';

  const getLegalDests = useCallback(() => {
    const dests = new Map();
    for (const m of game.moves({ verbose: true })) {
      if (!dests.has(m.from)) dests.set(m.from, []);
      dests.get(m.from).push(m.to);
    }
    return dests;
  }, [game]);

  const handleMove = useCallback((from, to) => {
    if (state !== 'playing') return;
    const uci = from + to;
    if (uci === puzzle.solution[0].slice(0, 4)) {
      const g = new Chess(game.fen());
      g.move({ from, to, promotion: puzzle.solution[0][4] || 'q' });
      setGame(g); setFen(g.fen());
      setState('correct');
      setScore(s => s + 1);
      progressService.recordPuzzleAttempt(`pe-${puzzle.id}`, 'Practical Endgame', true);
    } else {
      setState('wrong');
      progressService.recordPuzzleAttempt(`pe-${puzzle.id}`, 'Practical Endgame', false);
    }
  }, [state, puzzle, game]);

  function next() {
    if (idx + 1 >= shuffled.length) { setFinished(true); return; }
    const nextP = shuffled[idx + 1];
    setIdx(idx + 1);
    setGame(new Chess(nextP.fen));
    setFen(nextP.fen);
    setState('playing');
    setShowHint(false);
  }

  // Play the solution move on the board so the user can see it.
  function reveal() {
    const uci = puzzle.solution[0];
    const g = new Chess(puzzle.fen);
    try { g.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] || 'q' }); } catch { /* bad data */ }
    setGame(g); setFen(g.fen());
    setState('revealed');
  }

  function restart() {
    setIdx(0);
    setGame(new Chess(shuffled[0].fen));
    setFen(shuffled[0].fen);
    setState('playing');
    setShowHint(false);
    setScore(0);
    setFinished(false);
  }

  function retry() {
    setGame(new Chess(puzzle.fen));
    setFen(puzzle.fen);
    setState('playing');
    setShowHint(false);
  }

  return (
    <div className="page-enter max-w-5xl mx-auto px-4 sm:px-6 py-6 lg:py-10">
      <h1 className="text-2xl sm:text-3xl font-display mb-1">Practical Endgames</h1>
      <p className="text-text-dim text-sm mb-5">Find the winning or drawing move from real endgame positions.</p>

      {finished ? (
        <div className="max-w-md mx-auto card-base p-6 text-center">
          <p className="text-lg font-semibold mb-1">Set complete</p>
          <p className="text-3xl font-bold tabular-nums mb-2">{score}/{shuffled.length}</p>
          <p className="text-text-dim text-base mb-5">
            {score === shuffled.length ? 'Perfect — every endgame solved first time.' : 'Revisit the ones you missed to lock in the technique.'}
          </p>
          <button onClick={restart} className="bg-gold text-bg px-5 py-2.5 rounded-lg font-semibold hover:bg-gold-dim transition-all btn-press">Play Again</button>
        </div>
      ) : (<>
      <div className="text-sm text-text-dim mb-6">Puzzle {idx + 1}/{shuffled.length} &middot; Score: {score}</div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] lg:grid-cols-[1fr_320px] gap-8">
        <div className="w-full max-w-[480px]">
          <ChessBoard fen={fen} orientation={turnColor} movable={state === 'playing'} dests={state === 'playing' ? getLegalDests() : new Map()} turnColor={turnColor} onMove={handleMove} />
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-0.5 rounded-full bg-bg-hover text-text-dim">{puzzle.theme}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber/20 text-amber">{puzzle.difficulty}</span>
          </div>
          <div className="card-base p-5">
            <p className="text-sm font-semibold mb-1">{turnColor === 'white' ? 'White' : 'Black'} to move</p>
            <p className="text-text-dim text-base">Find the best move.</p>
          </div>

          {state === 'playing' && (
            <button onClick={() => setShowHint(true)} className="w-full py-2 rounded-lg bg-bg-card border border-bg-hover text-base text-text-dim hover:text-text hover:bg-bg-hover transition-all btn-press">
              {showHint ? puzzle.hint : 'Show Hint'}
            </button>
          )}

          {state === 'correct' && (
            <div className="space-y-3">
              <div className="bg-correct/10 border border-correct/30 rounded-xl p-4">
                <p className="text-sm font-semibold text-correct mb-1">✓ Correct!</p>
                <p className="text-base text-text leading-relaxed">{puzzle.explanation}</p>
              </div>
              <button onClick={next} className="w-full bg-gold text-bg py-2.5 rounded-lg font-semibold hover:bg-gold-dim transition-all btn-press">{idx + 1 < shuffled.length ? 'Next Puzzle' : 'See Results'}</button>
            </div>
          )}

          {state === 'revealed' && (
            <div className="space-y-3">
              <div className="bg-bg-card border border-bg-hover rounded-xl p-4">
                <p className="text-sm font-semibold mb-1">Solution</p>
                <p className="text-base text-text leading-relaxed">{puzzle.explanation}</p>
              </div>
              <button onClick={next} className="w-full bg-gold text-bg py-2.5 rounded-lg font-semibold hover:bg-gold-dim transition-all btn-press">{idx + 1 < shuffled.length ? 'Next Puzzle' : 'See Results'}</button>
            </div>
          )}

          {state === 'wrong' && (
            <div className="space-y-3">
              <div className="bg-incorrect/10 border border-incorrect/30 rounded-xl p-4">
                <p className="text-sm font-semibold text-incorrect mb-1">✗ Incorrect</p>
                <p className="text-base text-text leading-relaxed">That's not the best move. Try again, or reveal the solution.</p>
              </div>
              <button onClick={retry} className="w-full py-2 rounded-lg bg-bg-card border border-bg-hover text-base hover:bg-bg-hover transition-all btn-press">Try Again</button>
              <div className="flex gap-2">
                <button onClick={reveal} className="flex-1 py-2 rounded-lg bg-bg-card border border-bg-hover text-base text-text-dim hover:text-text hover:bg-bg-hover transition-all btn-press">Show Solution</button>
                <button onClick={next} className="flex-1 py-2 rounded-lg bg-bg-card border border-bg-hover text-base text-text-dim hover:text-text hover:bg-bg-hover transition-all btn-press">{idx + 1 < shuffled.length ? 'Skip' : 'Finish'}</button>
              </div>
            </div>
          )}
        </div>
      </div>
      </>)}
    </div>
  );
}
