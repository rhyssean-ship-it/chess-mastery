import { useState, useMemo } from 'react';
import ChessBoard from '../components/ChessBoard';
import commonMistakes from '../data/commonMistakes';

const levels = ['Beginner', 'Intermediate', 'Advanced'];
const diffColors = { Beginner: 'bg-correct/20 text-correct', Intermediate: 'bg-amber/20 text-amber', Advanced: 'bg-incorrect/20 text-incorrect' };

export default function CommonMistakes() {
  const [difficulty, setDifficulty] = useState('Beginner');
  const [idx, setIdx] = useState(0);
  const [answered, setAnswered] = useState(null);
  const [score, setScore] = useState(0);

  const filtered = useMemo(() => commonMistakes.filter(m => m.difficulty === difficulty), [difficulty]);
  const puzzle = filtered[idx % Math.max(filtered.length, 1)];

  function answer(safe) {
    if (answered !== null) return;
    setAnswered(safe);
    if (safe === puzzle.safe) setScore(s => s + 1);
  }

  function next() {
    setIdx(i => (i + 1) % filtered.length);
    setAnswered(null);
  }

  function changeDifficulty(level) {
    setDifficulty(level);
    setIdx(0);
    setAnswered(null);
    setScore(0);
  }

  if (!puzzle) return null;

  return (
    <div className="page-enter max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-display text-gold mb-1">Common Mistakes</h1>
      <p className="text-text-dim text-base mb-6">The obvious move is often a blunder. Learn to spot the traps.</p>

      <div className="flex gap-2 mb-6">
        {levels.map(level => (
          <button key={level} onClick={() => changeDifficulty(level)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all btn-press ${difficulty === level ? (diffColors[level] + ' border border-current/30') : 'bg-bg-card border border-bg-hover text-text-dim hover:text-text'}`}>
            {level}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] lg:grid-cols-[1fr_400px] gap-6 sm:gap-8">
        <div className="w-full max-w-[480px]">
          <ChessBoard fen={puzzle.fen} movable={false} />
        </div>
        <div className="space-y-4">
          <div className="card-base p-5">
            <p className="text-sm text-text-dim mb-1">Tempting move: <span className="text-gold font-mono">{puzzle.temptingMove}</span></p>
            <p className="font-semibold">{puzzle.question}</p>
          </div>

          {answered === null ? (
            <div className="flex gap-3">
              <button onClick={() => answer(true)} className="flex-1 py-3 rounded-lg bg-correct/15 text-correct border border-correct/20 font-semibold transition-all btn-press">✓ Safe</button>
              <button onClick={() => answer(false)} className="flex-1 py-3 rounded-lg bg-incorrect/15 text-incorrect border border-incorrect/20 font-semibold transition-all btn-press">✗ Trap!</button>
            </div>
          ) : (
            <>
              <div className={`rounded-xl p-4 border text-sm ${answered === puzzle.safe ? 'bg-correct/10 border-correct/30' : 'bg-incorrect/10 border-incorrect/30'}`}>
                <p className="font-semibold mb-1">{answered === puzzle.safe ? '✓ Correct!' : '✗ Wrong!'}</p>
                <p className="text-text leading-relaxed mb-2">{puzzle.answer}</p>
                {puzzle.consequence && <p className="text-text-dim text-xs">After {puzzle.temptingMove}: <span className="font-mono text-gold">{puzzle.consequence}</span></p>}
              </div>
              <div className="callout">
                <p className="callout-title">Lesson</p>
                <p className="text-text text-sm">{puzzle.lesson}</p>
              </div>
              <button onClick={next} className="w-full bg-gold text-bg py-2.5 rounded-lg font-semibold hover:bg-gold-dim transition-all btn-press">Next</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
