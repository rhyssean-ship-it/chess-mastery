import { useState, useCallback, useMemo } from 'react';
import { Chess } from 'chess.js';
import ChessBoard from '../components/ChessBoard';
import RatingButtons from '../components/RatingButtons';
import ProgressBar from '../components/ProgressBar';
import { useSpacedRepetition } from '../hooks/useSpacedRepetition';
import { progressService } from '../services/progressService';
import puzzles from '../data/puzzles';

const diffColors = {
  Beginner: 'bg-correct/20 text-correct',
  Intermediate: 'bg-amber/20 text-amber',
  Advanced: 'bg-incorrect/20 text-incorrect',
};

export default function TacticsQueue() {
  const { isDue, updateAfterReview, srData } = useSpacedRepetition();

  const queue = useMemo(() => {
    const due = puzzles.filter(p => isDue(p.id));
    // Add one unseen if none are due
    if (due.length === 0) {
      const unseen = puzzles.find(p => !srData[p.id]);
      if (unseen) return [unseen];
    }
    // Limit initial unlock to 5 for new users
    const seen = Object.keys(srData).length;
    if (seen === 0) return due.slice(0, 5);
    return due;
  }, [isDue, srData]);

  const [queueIndex, setQueueIndex] = useState(0);
  const [solveState, setSolveState] = useState('playing'); // playing | correct | wrong
  const [solutionStep, setSolutionStep] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [flash, setFlash] = useState(null);

  const puzzle = queue[queueIndex];

  const [game, setGame] = useState(() => puzzle ? new Chess(puzzle.fen) : null);
  const [fen, setFen] = useState(puzzle?.fen || '');

  function resetToPuzzle(p) {
    const g = new Chess(p.fen);
    setGame(g);
    setFen(p.fen);
    setSolveState('playing');
    setSolutionStep(0);
    setShowHint(false);
    setFlash(null);
  }

  const getLegalDests = useCallback(() => {
    if (!game) return new Map();
    const dests = new Map();
    for (const m of game.moves({ verbose: true })) {
      if (!dests.has(m.from)) dests.set(m.from, []);
      dests.get(m.from).push(m.to);
    }
    return dests;
  }, [game]);

  const handleMove = useCallback((from, to) => {
    if (!puzzle || solveState !== 'playing') return;
    const solution = puzzle.solution;
    const expectedUci = solution[solutionStep];
    const uci = from + to;

    if (uci === expectedUci) {
      const g = new Chess(game.fen());
      g.move({ from, to, promotion: 'q' });
      setGame(g);
      setFen(g.fen());

      const nextStep = solutionStep + 1;
      if (nextStep >= solution.length) {
        setSolveState('correct');
        setFlash('correct');
        progressService.recordPuzzleAttempt(puzzle.id, puzzle.category, true);
      } else {
        // Play opponent's response
        const oppMove = solution[nextStep];
        const oppFrom = oppMove.slice(0, 2);
        const oppTo = oppMove.slice(2, 4);
        setTimeout(() => {
          const g2 = new Chess(g.fen());
          g2.move({ from: oppFrom, to: oppTo, promotion: 'q' });
          setGame(g2);
          setFen(g2.fen());
          setSolutionStep(nextStep + 1);
        }, 300);
        setSolutionStep(nextStep);
      }
    } else {
      setSolveState('wrong');
      setFlash('incorrect');
      progressService.recordPuzzleAttempt(puzzle.id, puzzle.category, false);
    }
  }, [puzzle, solveState, solutionStep, game]);

  function showSolution() {
    if (!puzzle) return;
    const g = new Chess(puzzle.fen);
    for (const uci of puzzle.solution) {
      g.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] || 'q' });
    }
    setGame(g);
    setFen(g.fen());
    setSolveState('correct');
  }

  function handleRate(quality) {
    updateAfterReview(puzzle.id, quality);
    const nextIdx = queueIndex + 1;
    if (nextIdx < queue.length) {
      setQueueIndex(nextIdx);
      resetToPuzzle(queue[nextIdx]);
    } else {
      setQueueIndex(nextIdx); // past end = done
    }
  }

  function tryAgain() {
    resetToPuzzle(puzzle);
  }

  if (queue.length === 0) {
    return (
      <div className="page-enter max-w-3xl mx-auto px-6 py-16 text-center">
        <h1 className="text-3xl font-display text-gold mb-1">Tactics</h1>
        <p className="text-text-dim text-base mb-8">Sharpen your tactical eye with daily puzzles.</p>
        <p className="text-text-dim text-lg">♟️ You're all caught up! No puzzles due right now — take a well-earned rest and come back tomorrow for a fresh set of challenges.</p>
      </div>
    );
  }

  if (queueIndex >= queue.length) {
    return (
      <div className="page-enter max-w-3xl mx-auto px-6 py-16 text-center">
        <h1 className="text-3xl font-display text-gold mb-1">Session Complete</h1>
        <p className="text-text-dim text-base mb-8">You've finished all due puzzles for today. Great work!</p>
        <button onClick={() => { setQueueIndex(0); resetToPuzzle(queue[0]); }} className="bg-gold text-bg px-6 py-2.5 rounded-lg font-semibold hover:bg-gold-dim transition-all btn-press">
          Restart Session
        </button>
      </div>
    );
  }

  const turnColor = puzzle.sideToMove === 'white' ? 'white' : 'black';

  return (
    <div className="page-enter max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-display text-gold mb-1">Tactics</h1>
      <p className="text-text-dim text-base mb-8">Sharpen your tactical eye with daily puzzles.</p>

      <ProgressBar value={queueIndex} max={queue.length} label="Today's Queue" className="mb-6" />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Board */}
        <div className="w-full max-w-[560px]">
          <div className={`rounded-xl transition-shadow duration-300 ${flash === 'correct' ? 'shadow-[0_0_30px_rgba(76,175,80,0.4)]' : flash === 'incorrect' ? 'shadow-[0_0_30px_rgba(229,115,115,0.4)]' : ''}`}>
            <ChessBoard
              fen={fen}
              orientation={turnColor}
              movable={solveState === 'playing'}
              dests={solveState === 'playing' ? getLegalDests() : new Map()}
              turnColor={turnColor}
              onMove={handleMove}
            />
          </div>
        </div>

        {/* Info panel */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-0.5 rounded-full ${diffColors[puzzle.difficulty] || ''}`}>{puzzle.difficulty}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-bg-hover text-text-dim">{puzzle.category}</span>
          </div>

          <div className="bg-bg-card border border-bg-hover rounded-xl p-4">
            <p className="text-sm font-semibold mb-1">{turnColor === 'white' ? 'White' : 'Black'} to move</p>
            <p className="text-text-dim text-base">Find the best continuation.</p>
          </div>

          {solveState === 'playing' && (
            <button
              onClick={() => setShowHint(true)}
              className="w-full py-2 rounded-lg bg-bg-card border border-bg-hover text-base text-text-dim hover:text-text hover:bg-bg-hover transition-all btn-press"
            >
              {showHint ? puzzle.hint : 'Show Hint'}
            </button>
          )}

          {solveState === 'correct' && (
            <div className="space-y-3">
              <div className="bg-correct/10 border border-correct/30 rounded-xl p-4">
                <p className="text-sm font-semibold text-correct mb-1">&#10003; Correct!</p>
                <p className="text-base text-text leading-relaxed">{puzzle.explanation}</p>
              </div>
              <RatingButtons onRate={handleRate} />
            </div>
          )}

          {solveState === 'wrong' && (
            <div className="space-y-3">
              <div className="bg-incorrect/10 border border-incorrect/30 rounded-xl p-4">
                <p className="text-sm font-semibold text-incorrect mb-1">&#10007; Incorrect</p>
                <p className="text-base text-text-dim">That's not the best move.</p>
              </div>
              <div className="flex gap-3">
                <button onClick={tryAgain} className="flex-1 py-2 rounded-lg bg-bg-card border border-bg-hover text-base hover:bg-bg-hover transition-all btn-press">
                  Try Again
                </button>
                <button onClick={showSolution} className="flex-1 py-2 rounded-lg bg-gold/20 text-gold text-base hover:bg-gold/30 transition-all btn-press">
                  Show Solution
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
