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
  const [state, setState] = useState('playing'); // playing | correct | wrong
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
    if (uci === puzzle.solution[0]) {
      const g = new Chess(game.fen());
      g.move({ from, to, promotion: 'q' });
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
    if (idx + 1 >= shuffled.length) return;
    const nextP = shuffled[idx + 1];
    setIdx(idx + 1);
    setGame(new Chess(nextP.fen));
    setFen(nextP.fen);
    setState('playing');
    setShowHint(false);
  }

  function retry() {
    setGame(new Chess(puzzle.fen));
    setFen(puzzle.fen);
    setState('playing');
    setShowHint(false);
  }

  return (
    <div className="page-enter max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-display text-gold mb-1">Practical Endgames</h1>
      <p className="text-text-dim text-sm mb-8">Find the winning or drawing move from real endgame positions.</p>

      <div className="text-sm text-text-dim mb-6">Puzzle {idx + 1}/{shuffled.length} &middot; Score: {score}</div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        <div className="w-full max-w-[480px]">
          <ChessBoard fen={fen} orientation={turnColor} movable={state === 'playing'} dests={state === 'playing' ? getLegalDests() : new Map()} turnColor={turnColor} onMove={handleMove} />
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-bg-hover text-text-dim">{puzzle.theme}</span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber/20 text-amber">{puzzle.difficulty}</span>
          </div>
          <div className="card-base p-5">
            <p className="text-sm font-semibold mb-1">{turnColor === 'white' ? 'White' : 'Black'} to move</p>
            <p className="text-text-dim text-sm">Find the best move.</p>
          </div>

          {state === 'playing' && (
            <button onClick={() => setShowHint(true)} className="w-full py-2 rounded-lg bg-bg-card border border-bg-hover text-sm text-text-dim hover:text-text hover:bg-bg-hover transition-all btn-press">
              {showHint ? puzzle.hint : 'Show Hint'}
            </button>
          )}

          {state === 'correct' && (
            <div className="space-y-3">
              <div className="bg-correct/10 border border-correct/30 rounded-xl p-4">
                <p className="text-sm font-semibold text-correct mb-1">&#10003; Correct!</p>
                <p className="text-sm text-text-dim">{puzzle.explanation}</p>
              </div>
              {idx + 1 < shuffled.length && (
                <button onClick={next} className="w-full bg-gold text-bg py-2.5 rounded-lg font-semibold hover:bg-gold-dim transition-all btn-press">Next Puzzle</button>
              )}
            </div>
          )}

          {state === 'wrong' && (
            <div className="space-y-3">
              <div className="bg-incorrect/10 border border-incorrect/30 rounded-xl p-4">
                <p className="text-sm font-semibold text-incorrect mb-1">&#10007; Incorrect</p>
                <p className="text-sm text-text-dim">{puzzle.explanation}</p>
              </div>
              <button onClick={retry} className="w-full py-2 rounded-lg bg-bg-card border border-bg-hover text-sm hover:bg-bg-hover transition-all btn-press">Try Again</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
