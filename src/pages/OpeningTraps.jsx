import { useState } from 'react';
import { Chess } from 'chess.js';
import ChessBoard from '../components/ChessBoard';
import openingTraps from '../data/openingTraps';

const diffColors = { Beginner: 'bg-correct/20 text-correct', Intermediate: 'bg-amber/20 text-amber', Advanced: 'bg-incorrect/20 text-incorrect' };

export default function OpeningTraps() {
  const [selected, setSelected] = useState(null);
  const [showTrap, setShowTrap] = useState(false);
  const trap = selected !== null ? openingTraps[selected] : null;

  if (trap) {
    return (
      <div className="page-enter max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <button onClick={() => { setSelected(null); setShowTrap(false); }} className="inline-flex items-center gap-1.5 text-text-dim hover:text-gold text-sm mb-5 group transition-colors">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"><path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" /></svg>
          <span>Back to Traps</span>
        </button>
        <h1 className="text-2xl font-display text-gold mb-1">{trap.name}</h1>
        <p className="text-text-dim text-base mb-8">{trap.opening} &middot; {trap.difficulty}</p>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] lg:grid-cols-[1fr_360px] gap-8">
          <div className="w-full max-w-[480px]">
            <ChessBoard fen={showTrap ? trap.fenAfterTrap : trap.fen} movable={false} />
          </div>
          <div className="space-y-4">
            <div className="card-base p-5">
              <p className="text-base text-text leading-relaxed">{trap.description}</p>
            </div>

            {!showTrap ? (
              <button onClick={() => setShowTrap(true)} className="w-full bg-gold text-bg py-2.5 rounded-lg font-semibold hover:bg-gold-dim transition-all btn-press shadow-lg shadow-gold/10">
                Reveal the Trap
              </button>
            ) : (
              <>
                <div className="card-base p-5 border-gold/20">
                  <p className="text-gold font-semibold text-sm mb-2">The Trap: {trap.trapMove}</p>
                  <p className="text-base text-text leading-relaxed">{trap.explanation}</p>
                </div>
                <div className="card-base p-5">
                  <p className="text-xs text-text-dim uppercase tracking-wider mb-2 font-medium">How to Avoid</p>
                  <p className="text-base text-text leading-relaxed">{trap.howToAvoid}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-display text-gold mb-1">Opening Traps</h1>
      <p className="text-text-dim text-base mb-8">Learn common traps — and how to avoid falling into them.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {openingTraps.map((trap, i) => (
          <button key={trap.id} onClick={() => setSelected(i)} className="card-base p-5 text-left card-hover card-stagger hover:border-gold/20 btn-press">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${diffColors[trap.difficulty]}`}>{trap.difficulty}</span>
              <span className="text-xs text-text-dim">{trap.opening}</span>
            </div>
            <h3 className="text-base font-semibold mb-1">{trap.name}</h3>
            <p className="text-base text-text-dim line-clamp-2">{trap.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
