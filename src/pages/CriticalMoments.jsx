import { useState, useMemo } from 'react';
import ChessBoard from '../components/ChessBoard';
import criticalMoments from '../data/criticalMoments';
import { progressService } from '../services/progressService';

const diffColors = {
  Beginner: 'bg-correct/20 text-correct',
  Intermediate: 'bg-amber/20 text-amber',
  Advanced: 'bg-incorrect/20 text-incorrect',
};

export default function CriticalMoments() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [finished, setFinished] = useState(false);

  const shuffled = useMemo(() => [...criticalMoments].sort(() => Math.random() - 0.5), []);
  const puzzle = shuffled[currentIndex];

  function selectOption(idx) {
    if (selected !== null) return;
    setSelected(idx);
    setTotal(t => t + 1);
    if (puzzle.options[idx].correct) {
      setScore(s => s + 1);
      progressService.recordPuzzleAttempt(`cm-${puzzle.id}`, 'Critical Moment', true);
    } else {
      progressService.recordPuzzleAttempt(`cm-${puzzle.id}`, 'Critical Moment', false);
    }
  }

  function next() {
    if (currentIndex + 1 >= shuffled.length) {
      setFinished(true);
      progressService.recordDrillScore('critical-moments', score, total > 0 ? Math.round((score / total) * 100) : 0);
      return;
    }
    setCurrentIndex(i => i + 1);
    setSelected(null);
  }

  if (finished) {
    return (
      <div className="page-enter max-w-3xl mx-auto px-6 py-16 text-center">
        <h1 className="text-3xl font-display text-gold mb-4">Session Complete</h1>
        <p className="text-2xl font-bold mb-2 tabular-nums">{score}/{total}</p>
        <p className="text-text-dim mb-6">{score === total ? 'Perfect positional judgment!' : 'Keep studying to sharpen your evaluation skills.'}</p>
        <button onClick={() => { setCurrentIndex(0); setSelected(null); setScore(0); setTotal(0); setFinished(false); }} className="bg-gold text-bg px-6 py-2.5 rounded-lg font-semibold hover:bg-gold-dim transition-all btn-press">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="page-enter max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-display text-gold mb-1">Critical Moments</h1>
      <p className="text-text-dim text-base mb-8">What's the best plan? Test your positional evaluation.</p>

      <div className="flex items-center gap-3 mb-6 text-sm text-text-dim">
        <span>Question {currentIndex + 1}/{shuffled.length}</span>
        <span>&middot;</span>
        <span className="tabular-nums">Score: {score}/{total}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
        <div className="w-full max-w-[480px]">
          <ChessBoard fen={puzzle.fen} movable={false} />
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${diffColors[puzzle.difficulty] || ''}`}>{puzzle.difficulty}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-bg-hover text-text-dim">{puzzle.theme}</span>
          </div>

          <p className="font-semibold text-sm">{puzzle.question}</p>

          <div className="space-y-2">
            {puzzle.options.map((opt, idx) => {
              let classes = 'card-base p-4 text-left w-full text-sm transition-all btn-press cursor-pointer';
              if (selected !== null) {
                if (opt.correct) classes += ' !border-correct/50 bg-correct/10';
                else if (idx === selected && !opt.correct) classes += ' !border-incorrect/50 bg-incorrect/10';
                else classes += ' opacity-50';
              } else {
                classes += ' hover:border-gold/30';
              }
              return (
                <button key={idx} onClick={() => selectOption(idx)} className={classes} disabled={selected !== null}>
                  <div className="flex gap-3">
                    <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 ${
                      selected !== null && opt.correct ? 'border-correct text-correct' :
                      selected === idx && !opt.correct ? 'border-incorrect text-incorrect' :
                      'border-bg-hover text-text-dim'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <div>
                      <p>{opt.text}</p>
                      {selected !== null && <p className="text-text text-xs mt-1">{opt.explanation}</p>}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {selected !== null && (
            <button onClick={next} className="w-full bg-gold text-bg py-2.5 rounded-lg font-semibold hover:bg-gold-dim transition-all btn-press">
              {currentIndex + 1 >= shuffled.length ? 'See Results' : 'Next Question'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
