import { useState, useCallback } from 'react';
import { Chess } from 'chess.js';
import ChessBoard from '../components/ChessBoard';
import checkmatePatterns from '../data/checkmatePatterns';
import { progressService } from '../services/progressService';

const diffColors = { Beginner: 'bg-correct/20 text-correct', Intermediate: 'bg-amber/20 text-amber', Advanced: 'bg-incorrect/20 text-incorrect' };

export default function CheckmatePatterns() {
  const [selected, setSelected] = useState(null);
  const [state, setState] = useState('playing');
  const [showHint, setShowHint] = useState(false);
  const [game, setGame] = useState(null);
  const [fen, setFen] = useState('');

  const pattern = selected !== null ? checkmatePatterns[selected] : null;

  function start(idx) {
    const p = checkmatePatterns[idx];
    setSelected(idx);
    setGame(new Chess(p.fen));
    setFen(p.fen);
    setState('playing');
    setShowHint(false);
  }

  function getLegalDests() {
    if (!game) return new Map();
    const dests = new Map();
    for (const m of game.moves({ verbose: true })) {
      if (!dests.has(m.from)) dests.set(m.from, []);
      dests.get(m.from).push(m.to);
    }
    return dests;
  }

  function handleMove(from, to) {
    if (!game || !pattern || state !== 'playing') return;
    const uci = from + to;
    if (uci === pattern.solution[0].slice(0, 4)) {
      const g = new Chess(game.fen());
      g.move({ from, to, promotion: 'q' });
      setGame(g);
      setFen(g.fen());
      setState('correct');
      progressService.recordPuzzleAttempt(`cp-${pattern.id}`, 'Checkmate Pattern', true);
      progressService.logActivity(`Solved checkmate pattern: ${pattern.name}`);
    } else {
      setState('wrong');
      progressService.recordPuzzleAttempt(`cp-${pattern.id}`, 'Checkmate Pattern', false);
    }
  }

  const turnColor = pattern?.sideToMove === 'white' ? 'white' : 'black';

  if (pattern) {
    return (
      <div className="page-enter max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <button onClick={() => setSelected(null)} className="inline-flex items-center gap-1.5 text-text-dim hover:text-gold text-sm mb-5 group transition-colors">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"><path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" /></svg>
          <span>Back to Patterns</span>
        </button>
        <h1 className="text-2xl font-display text-gold mb-1">{pattern.name}</h1>
        <p className="text-text-dim text-sm mb-8">{pattern.difficulty}</p>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] lg:grid-cols-[1fr_360px] gap-6 sm:gap-8">
          <div className="w-full max-w-[480px]">
            <ChessBoard fen={fen} orientation={turnColor} movable={state === 'playing'} dests={state === 'playing' ? getLegalDests() : new Map()} turnColor={turnColor} onMove={handleMove} />
          </div>
          <div className="space-y-4">
            <div className="card-base p-5">
              <p className="text-sm font-semibold mb-1">{turnColor === 'white' ? 'White' : 'Black'} to move — find the checkmate!</p>
              <p className="text-text-dim text-sm">{pattern.pattern}</p>
            </div>

            {state === 'playing' && (
              <button onClick={() => setShowHint(true)} className="w-full py-2 rounded-lg bg-bg-card border border-bg-hover text-base text-text-dim hover:text-text hover:bg-bg-hover transition-all btn-press">
                {showHint ? pattern.hint : 'Show Hint'}
              </button>
            )}

            {state === 'correct' && (
              <div className="space-y-3">
                <div className="bg-correct/10 border border-correct/30 rounded-xl p-4">
                  <p className="text-sm font-semibold text-correct mb-1">✓ Checkmate!</p>
                  <p className="text-text text-sm">{pattern.description}</p>
                </div>
                {selected < checkmatePatterns.length - 1 && (
                  <button onClick={() => start(selected + 1)} className="w-full bg-gold text-bg py-2.5 rounded-lg font-semibold hover:bg-gold-dim transition-all btn-press">Next Pattern</button>
                )}
              </div>
            )}

            {state === 'wrong' && (
              <div className="space-y-3">
                <div className="bg-incorrect/10 border border-incorrect/30 rounded-xl p-4">
                  <p className="text-sm font-semibold text-incorrect mb-1">✗ Not quite</p>
                  <p className="text-text-dim text-sm">That's not the mating move.</p>
                </div>
                <button onClick={() => start(selected)} className="w-full py-2 rounded-lg bg-bg-card border border-bg-hover text-base hover:bg-bg-hover transition-all btn-press">Try Again</button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-display text-gold mb-1">Checkmate Patterns</h1>
      <p className="text-text-dim text-base mb-8">Learn the essential mating patterns every player must know.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {checkmatePatterns.map((p, i) => (
          <button key={p.id} onClick={() => start(i)} className="card-base p-5 text-left card-hover card-stagger hover:border-gold/20 btn-press">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${diffColors[p.difficulty]}`}>{p.difficulty}</span>
            <h3 className="text-base font-semibold mt-2 mb-1">{p.name}</h3>
            <p className="text-sm text-text-dim line-clamp-2">{p.pattern}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
