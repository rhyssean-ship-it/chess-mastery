import { useState, useMemo, useCallback } from 'react';
import { Chess } from 'chess.js';
import ChessBoard from '../components/ChessBoard';
import { progressService } from '../services/progressService';
import { useLocalStorage } from '../hooks/useLocalStorage';
import puzzles from '../data/puzzles';
import criticalMoments from '../data/criticalMoments';

function getDayOfYear() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  return Math.floor((now - start) / 86400000);
}

export default function DailyChallenge() {
  const dayNum = getDayOfYear();
  const [completed, setCompleted] = useLocalStorage('daily-completed', {});
  const todayDone = completed[dayNum];

  // Pick a deterministic puzzle and critical moment for today
  const dailyPuzzle = puzzles[dayNum % puzzles.length];
  const dailyCM = criticalMoments[dayNum % criticalMoments.length];

  const [phase, setPhase] = useState(todayDone ? 'done' : 'puzzle'); // puzzle | critical | done
  const [puzzleState, setPuzzleState] = useState('playing');
  const [cmSelected, setCmSelected] = useState(null);
  const [game, setGame] = useState(() => new Chess(dailyPuzzle.fen));
  const [fen, setFen] = useState(dailyPuzzle.fen);

  const turnColor = dailyPuzzle.sideToMove === 'white' ? 'white' : 'black';

  const getLegalDests = useCallback(() => {
    const dests = new Map();
    for (const m of game.moves({ verbose: true })) {
      if (!dests.has(m.from)) dests.set(m.from, []);
      dests.get(m.from).push(m.to);
    }
    return dests;
  }, [game]);

  const handlePuzzleMove = useCallback((from, to) => {
    if (puzzleState !== 'playing') return;
    const uci = from + to;
    if (uci === dailyPuzzle.solution[0]) {
      const g = new Chess(game.fen());
      g.move({ from, to, promotion: 'q' });
      setGame(g); setFen(g.fen());
      setPuzzleState('correct');
    } else {
      setPuzzleState('wrong');
    }
  }, [puzzleState, dailyPuzzle, game]);

  function completeCM(idx) {
    if (cmSelected !== null) return;
    setCmSelected(idx);
  }

  function finishDaily() {
    setCompleted(prev => ({ ...prev, [dayNum]: true }));
    progressService.recordActivity();
    progressService.logActivity('Completed daily challenge');
    setPhase('done');
  }

  if (phase === 'done') {
    const streak = progressService.getStreak();
    return (
      <div className="page-enter max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="text-5xl mb-4">♕</div>
        <h1 className="text-3xl font-display text-gold mb-2">Daily Challenge Complete!</h1>
        <p className="text-text-dim mb-2">You've completed today's challenge.</p>
        <p className="text-gold text-lg font-bold mb-6">{streak} day streak</p>
        <p className="text-text-dim text-base">Come back tomorrow for a fresh challenge.</p>
      </div>
    );
  }

  if (phase === 'critical') {
    return (
      <div className="page-enter max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-2xl font-display text-gold mb-1">Daily Challenge 2</h1>
        <p className="text-text-dim text-base mb-8">Evaluate this position.</p>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_340px] lg:grid-cols-[1fr_400px] gap-8">
          <div className="w-full max-w-[480px]">
            <ChessBoard fen={dailyCM.fen} movable={false} />
          </div>
          <div className="space-y-4">
            <p className="font-semibold text-sm">{dailyCM.question}</p>
            <div className="space-y-2">
              {dailyCM.options.map((opt, i) => {
                let cls = 'card-base p-4 w-full text-left text-sm transition-all btn-press';
                if (cmSelected !== null) {
                  if (opt.correct) cls += ' !border-correct/50 bg-correct/10';
                  else if (i === cmSelected && !opt.correct) cls += ' !border-incorrect/50 bg-incorrect/10';
                  else cls += ' opacity-50';
                } else cls += ' hover:border-gold/30 cursor-pointer';
                return <button key={i} onClick={() => completeCM(i)} className={cls} disabled={cmSelected !== null}>{opt.text}</button>;
              })}
            </div>
            {cmSelected !== null && (
              <>
                <div className={`rounded-xl p-4 border text-sm ${dailyCM.options[cmSelected].correct ? 'bg-correct/10 border-correct/30' : 'bg-incorrect/10 border-incorrect/30'}`}>
                  <p className="text-text">{dailyCM.options[cmSelected].explanation}</p>
                </div>
                <button onClick={finishDaily} className="w-full bg-gold text-bg py-2.5 rounded-lg font-semibold hover:bg-gold-dim transition-all btn-press">Complete Challenge</button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-display text-gold mb-1">Daily Challenge 1</h1>
      <p className="text-text-dim text-base mb-8">Solve today's tactical puzzle.</p>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] lg:grid-cols-[1fr_320px] gap-8">
        <div className="w-full max-w-[480px]">
          <ChessBoard fen={fen} orientation={turnColor} movable={puzzleState === 'playing'} dests={puzzleState === 'playing' ? getLegalDests() : new Map()} turnColor={turnColor} onMove={handlePuzzleMove} />
        </div>
        <div className="space-y-4">
          <div className="card-base p-5">
            <p className="text-sm font-semibold">{turnColor === 'white' ? 'White' : 'Black'} to move</p>
            <p className="text-text-dim text-xs mt-1">{dailyPuzzle.category} &middot; {dailyPuzzle.difficulty}</p>
          </div>
          {puzzleState === 'correct' && (
            <div className="space-y-3">
              <div className="bg-correct/10 border border-correct/30 rounded-xl p-4 text-sm">
                <p className="font-semibold text-correct mb-1">✓ Correct!</p>
                <p className="text-text">{dailyPuzzle.explanation}</p>
              </div>
              <button onClick={() => setPhase('critical')} className="w-full bg-gold text-bg py-2.5 rounded-lg font-semibold hover:bg-gold-dim transition-all btn-press">Next: Positional Quiz</button>
            </div>
          )}
          {puzzleState === 'wrong' && (
            <div className="space-y-3">
              <div className="bg-incorrect/10 border border-incorrect/30 rounded-xl p-4 text-sm">
                <p className="font-semibold text-incorrect mb-1">✗ Not quite</p>
              </div>
              <button onClick={() => { setGame(new Chess(dailyPuzzle.fen)); setFen(dailyPuzzle.fen); setPuzzleState('playing'); }} className="flex-1 py-2 rounded-lg bg-bg-card border border-bg-hover text-base hover:bg-bg-hover transition-all btn-press w-full">Try Again</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
