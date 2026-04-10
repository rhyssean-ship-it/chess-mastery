import { useState, useMemo } from 'react';
import ChessBoard from '../components/ChessBoard';
import moveOrderQuiz from '../data/moveOrderQuiz';
import { progressService } from '../services/progressService';

export default function MoveOrderQuiz() {
  const shuffled = useMemo(() => [...moveOrderQuiz].sort(() => Math.random() - 0.5), []);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = shuffled[idx];

  function select(i) {
    if (selected !== null) return;
    setSelected(i);
    if (i === q.correctIndex) setScore(s => s + 1);
  }

  function next() {
    if (idx + 1 >= shuffled.length) {
      progressService.recordDrillScore('move-order', score, Math.round((score / shuffled.length) * 100));
      setFinished(true);
      return;
    }
    setIdx(i => i + 1);
    setSelected(null);
  }

  if (finished) {
    return (
      <div className="page-enter max-w-3xl mx-auto px-6 py-16 text-center">
        <h1 className="text-3xl font-display text-gold mb-4">Quiz Complete</h1>
        <p className="text-2xl font-bold mb-2 tabular-nums">{score}/{shuffled.length}</p>
        <p className="text-text-dim mb-6">{score === shuffled.length ? 'Perfect move order knowledge!' : 'Review the openings to improve.'}</p>
        <button onClick={() => { setIdx(0); setSelected(null); setScore(0); setFinished(false); }} className="bg-gold text-bg px-6 py-2.5 rounded-lg font-semibold hover:bg-gold-dim transition-all btn-press">Retry</button>
      </div>
    );
  }

  return (
    <div className="page-enter max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-display text-gold mb-1">Move Order Quiz</h1>
      <p className="text-text-dim text-base mb-8">Test your knowledge of opening move orders.</p>

      <div className="text-sm text-text-dim mb-6">Question {idx + 1}/{shuffled.length} &middot; Score: {score}</div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
        <div className="w-full max-w-[480px]">
          <ChessBoard fen={q.fen} movable={false} />
        </div>
        <div className="space-y-4">
          <div className="card-base p-5">
            <p className="text-text-dim text-xs mb-1">{q.position}</p>
            <p className="font-semibold text-sm">{q.question}</p>
          </div>

          <div className="space-y-2">
            {q.options.map((opt, i) => {
              let cls = 'card-base p-4 w-full text-left text-sm transition-all btn-press';
              if (selected !== null) {
                if (i === q.correctIndex) cls += ' !border-correct/50 bg-correct/10';
                else if (i === selected) cls += ' !border-incorrect/50 bg-incorrect/10';
                else cls += ' opacity-50';
              } else cls += ' hover:border-gold/30 cursor-pointer';
              return <button key={i} onClick={() => select(i)} className={cls} disabled={selected !== null}>{opt}</button>;
            })}
          </div>

          {selected !== null && (
            <>
              <div className={`rounded-xl p-4 border text-sm ${selected === q.correctIndex ? 'bg-correct/10 border-correct/30' : 'bg-incorrect/10 border-incorrect/30'}`}>
                <p className="text-text">{q.explanation}</p>
              </div>
              <button onClick={next} className="w-full bg-gold text-bg py-2.5 rounded-lg font-semibold hover:bg-gold-dim transition-all btn-press">
                {idx + 1 >= shuffled.length ? 'See Results' : 'Next'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
