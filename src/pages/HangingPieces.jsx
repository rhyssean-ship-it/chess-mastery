import { useState, useMemo } from 'react';
import ChessBoard from '../components/ChessBoard';
import hangingPieces from '../data/hangingPieces';

const levels = ['Beginner', 'Intermediate', 'Advanced'];
const diffColors = { Beginner: 'bg-correct/20 text-correct', Intermediate: 'bg-amber/20 text-amber', Advanced: 'bg-incorrect/20 text-incorrect' };

export default function HangingPieces() {
  const [difficulty, setDifficulty] = useState('Beginner');
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);

  const filtered = useMemo(() => hangingPieces.filter(p => p.difficulty === difficulty), [difficulty]);
  const puzzle = filtered[idx % Math.max(filtered.length, 1)];

  function reveal() { setRevealed(true); }

  function rate(gotIt) {
    setTotal(t => t + 1);
    if (gotIt) setScore(s => s + 1);
    if (idx + 1 >= filtered.length) { setIdx(0); } else { setIdx(i => i + 1); }
    setRevealed(false);
  }

  function changeDifficulty(level) {
    setDifficulty(level);
    setIdx(0);
    setRevealed(false);
    setScore(0);
    setTotal(0);
  }

  if (!puzzle) return <div className="page-enter max-w-3xl mx-auto px-4 sm:px-6 py-10"><p className="text-text-dim">No exercises at this level.</p></div>;

  return (
    <div className="page-enter max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-display text-gold mb-1">Hanging Pieces</h1>
      <p className="text-text-dim text-base mb-6">Spot undefended pieces — the #1 skill for beginners.</p>

      <div className="flex gap-2 mb-6">
        {levels.map(level => (
          <button key={level} onClick={() => changeDifficulty(level)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all btn-press ${difficulty === level ? (diffColors[level] + ' border border-current/30') : 'bg-bg-card border border-bg-hover text-text-dim hover:text-text'}`}>
            {level}
          </button>
        ))}
      </div>

      <div className="text-sm text-text-dim mb-6">Exercise {(idx % filtered.length) + 1}/{filtered.length} &middot; Score: {score}/{total}</div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] lg:grid-cols-[1fr_360px] gap-6 sm:gap-8">
        <div className="w-full max-w-[480px]">
          <ChessBoard fen={puzzle.fen} movable={false} highlights={revealed ? [puzzle.hangingSquare] : []} />
        </div>
        <div className="space-y-4">
          <div className="card-base p-5">
            <p className="font-semibold text-sm">{puzzle.question}</p>
          </div>

          {!revealed ? (
            <button onClick={reveal} className="w-full bg-gold text-bg py-2.5 rounded-lg font-semibold hover:bg-gold-dim transition-all btn-press">
              Show Answer
            </button>
          ) : (
            <>
              <div className="card-base p-5 border-gold/20">
                <p className="text-text leading-relaxed mb-2">{puzzle.answer}</p>
                <p className="text-sm text-text-dim">Winning move: <span className="text-gold font-mono">{puzzle.winningMove}</span></p>
              </div>
              <p className="text-sm text-text-dim text-center">Did you spot it?</p>
              <div className="flex gap-3">
                <button onClick={() => rate(false)} className="flex-1 py-2.5 rounded-lg bg-incorrect/15 text-incorrect border border-incorrect/20 font-semibold text-sm transition-all btn-press">✗ No</button>
                <button onClick={() => rate(true)} className="flex-1 py-2.5 rounded-lg bg-correct/15 text-correct border border-correct/20 font-semibold text-sm transition-all btn-press">✓ Yes</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
