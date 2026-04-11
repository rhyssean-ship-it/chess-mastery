import { useState } from 'react';
import pieceValues from '../data/pieceValues';

export default function PieceValueGuide() {
  const [quizIdx, setQuizIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);

  const exercise = pieceValues.exercises[quizIdx];

  function selectAnswer(idx) {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === exercise.correctIndex) setScore(s => s + 1);
  }

  function next() {
    if (quizIdx + 1 >= pieceValues.exercises.length) {
      setQuizIdx(0);
      setSelected(null);
      setScore(0);
      return;
    }
    setQuizIdx(i => i + 1);
    setSelected(null);
  }

  return (
    <div className="page-enter max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-display text-gold mb-1">Piece Values & Trading</h1>
      <p className="text-text-dim text-base mb-8">Understanding material value is the foundation of good chess.</p>

      {/* Piece values */}
      <section className="mb-8">
        <h2 className="text-xl font-display mb-4">Piece Values</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {pieceValues.pieces.map(p => (
            <div key={p.name} className="card-base p-5 text-center">
              <div className="text-4xl mb-2">{p.symbol}</div>
              <div className="font-semibold">{p.name}</div>
              <div className="text-2xl font-bold text-gold mt-1">{p.value}</div>
              <p className="text-xs text-text-dim mt-2">{p.description}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="section-divider" />

      {/* Trading rules */}
      <section className="mb-8">
        <h2 className="text-xl font-display mb-4">When to Trade</h2>
        <div className="space-y-3">
          {pieceValues.tradingRules.map((r, i) => (
            <div key={i} className="card-base p-5">
              <p className="font-semibold text-sm mb-1">{r.rule}</p>
              <p className="text-text-dim text-sm">{r.explanation}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="section-divider" />

      {/* Quiz */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-display">Test Your Knowledge</h2>
          {showQuiz && <span className="text-sm text-text-dim tabular-nums">Score: {score}/{quizIdx + (selected !== null ? 1 : 0)}</span>}
        </div>

        {!showQuiz ? (
          <button onClick={() => setShowQuiz(true)} className="w-full bg-gold text-bg py-3 rounded-lg font-semibold hover:bg-gold-dim transition-all btn-press">
            Start Quiz
          </button>
        ) : (
          <div className="space-y-4">
            <div className="card-base p-5">
              <p className="text-sm text-text-dim mb-1">Question {quizIdx + 1}/{pieceValues.exercises.length}</p>
              <p className="font-semibold">{exercise.question}</p>
            </div>

            <div className="space-y-2">
              {exercise.options.map((opt, i) => {
                let cls = 'card-base p-4 w-full text-left text-sm btn-press transition-all';
                if (selected !== null) {
                  if (i === exercise.correctIndex) cls += ' !border-correct bg-correct/10';
                  else if (i === selected) cls += ' !border-incorrect bg-incorrect/10';
                  else cls += ' opacity-40';
                } else cls += ' hover:border-gold/30 cursor-pointer';
                return <button key={i} onClick={() => selectAnswer(i)} className={cls} disabled={selected !== null}>{opt}</button>;
              })}
            </div>

            {selected !== null && (
              <>
                <div className={`rounded-xl p-4 border text-sm ${selected === exercise.correctIndex ? 'bg-correct/10 border-correct/30' : 'bg-incorrect/10 border-incorrect/30'}`}>
                  <p className="text-text">{exercise.explanation}</p>
                </div>
                <button onClick={next} className="w-full bg-gold text-bg py-2.5 rounded-lg font-semibold hover:bg-gold-dim transition-all btn-press">
                  {quizIdx + 1 >= pieceValues.exercises.length ? 'Restart Quiz' : 'Next Question'}
                </button>
              </>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
