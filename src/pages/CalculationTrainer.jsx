import { useState, useMemo } from 'react';
import ChessBoard from '../components/ChessBoard';
import calculationDrills from '../data/calculationDrills';
import { progressService } from '../services/progressService';

const diffColors = {
  Beginner: 'bg-correct/20 text-correct',
  Intermediate: 'bg-amber/20 text-amber',
  Advanced: 'bg-incorrect/20 text-incorrect',
};

export default function CalculationTrainer() {
  const shuffled = useMemo(() => [...calculationDrills].sort(() => Math.random() - 0.5), []);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [phase, setPhase] = useState('thinking'); // thinking | revealed
  const [selfScore, setSelfScore] = useState({ correct: 0, total: 0 });
  const [finished, setFinished] = useState(false);

  const drill = shuffled[currentIdx];

  function reveal() {
    setPhase('revealed');
  }

  function rate(gotIt) {
    const newTotal = selfScore.total + 1;
    const newCorrect = selfScore.correct + (gotIt ? 1 : 0);
    setSelfScore({ correct: newCorrect, total: newTotal });

    if (gotIt) progressService.recordPuzzleAttempt(`calc-${drill.id}`, 'Calculation', true);
    else progressService.recordPuzzleAttempt(`calc-${drill.id}`, 'Calculation', false);

    if (currentIdx + 1 >= shuffled.length) {
      progressService.recordDrillScore('calculation', newCorrect, Math.round((newCorrect / newTotal) * 100));
      setFinished(true);
      return;
    }
    setCurrentIdx(i => i + 1);
    setPhase('thinking');
  }

  if (finished) {
    return (
      <div className="page-enter max-w-3xl mx-auto px-6 py-16 text-center">
        <h1 className="text-3xl font-display text-gold mb-4">Session Complete</h1>
        <p className="text-2xl font-bold mb-2 tabular-nums">{selfScore.correct}/{selfScore.total}</p>
        <p className="text-text-dim mb-6">{selfScore.correct === selfScore.total ? 'Perfect calculation!' : 'Keep training to see deeper.'}</p>
        <button onClick={() => { setCurrentIdx(0); setPhase('thinking'); setSelfScore({ correct: 0, total: 0 }); setFinished(false); }} className="bg-gold text-bg px-6 py-2.5 rounded-lg font-semibold hover:bg-gold-dim transition-all btn-press">
          Train Again
        </button>
      </div>
    );
  }

  return (
    <div className="page-enter max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-display text-gold mb-1">Calculation Trainer</h1>
      <p className="text-text-dim text-base mb-8">Calculate sequences without moving pieces on the board.</p>

      <div className="flex items-center gap-3 mb-6 text-sm text-text-dim">
        <span>Exercise {currentIdx + 1}/{shuffled.length}</span>
        <span>&middot;</span>
        <span className="tabular-nums">{selfScore.correct}/{selfScore.total} correct</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
        <div className="w-full max-w-[480px]">
          <ChessBoard fen={drill.fen} movable={false} />
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${diffColors[drill.difficulty]}`}>{drill.difficulty}</span>
            <span className="text-xs text-text-dim">Depth: {drill.depth} move{drill.depth > 1 ? 's' : ''}</span>
          </div>

          <div className="card-base p-5">
            <p className="font-semibold text-sm mb-2">{drill.question}</p>
            <p className="text-text-dim text-xs">Calculate in your head before revealing the answer.</p>
          </div>

          {/* Sequence display */}
          <div className="card-base p-4">
            <p className="text-xs text-text-dim uppercase tracking-wider mb-2">Sequence to calculate</p>
            <div className="flex flex-wrap gap-1.5">
              {drill.sequence.map((move, i) => (
                <span key={i} className={`px-2.5 py-1 rounded text-sm font-mono ${
                  phase === 'revealed' ? 'bg-gold/10 text-gold border border-gold/20' : 'bg-bg-hover text-text-dim'
                }`}>
                  {phase === 'revealed' ? move : '???'}
                </span>
              ))}
            </div>
          </div>

          {phase === 'thinking' && (
            <button onClick={reveal} className="w-full bg-gold text-bg py-2.5 rounded-lg font-semibold hover:bg-gold-dim transition-all btn-press shadow-lg shadow-gold/10">
              I've Calculated — Show Answer
            </button>
          )}

          {phase === 'revealed' && (
            <>
              <div className="card-base p-5 border-gold/20">
                <p className="text-gold font-semibold text-xs uppercase tracking-wider mb-2">Answer</p>
                <p className="text-base text-text-dim leading-relaxed mb-3">{drill.answer}</p>
                <p className="text-xs text-text-dim/70 italic">{drill.sequenceExplanation}</p>
              </div>

              <p className="text-sm text-text-dim text-center">Did you calculate correctly?</p>
              <div className="flex gap-3">
                <button onClick={() => rate(false)} className="flex-1 py-2.5 rounded-lg bg-incorrect/15 text-incorrect border border-incorrect/20 font-semibold text-base transition-all btn-press">
                  &#10007; No
                </button>
                <button onClick={() => rate(true)} className="flex-1 py-2.5 rounded-lg bg-correct/15 text-correct border border-correct/20 font-semibold text-base transition-all btn-press">
                  &#10003; Yes
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
