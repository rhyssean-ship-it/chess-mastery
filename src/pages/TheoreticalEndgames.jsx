import { useState } from 'react';
import ChessBoard from '../components/ChessBoard';
import theoreticalEndgames from '../data/theoreticalEndgames';

export default function TheoreticalEndgames() {
  const [selected, setSelected] = useState(null);
  const [showSolution, setShowSolution] = useState(false);
  const eg = selected !== null ? theoreticalEndgames[selected] : null;

  if (eg) {
    return (
      <div className="page-enter max-w-5xl mx-auto px-6 py-10">
        <button onClick={() => { setSelected(null); setShowSolution(false); }} className="inline-flex items-center gap-1.5 text-text-dim hover:text-gold text-sm mb-5 group transition-colors">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"><path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" /></svg>
          <span>Back to Endgames</span>
        </button>
        <h1 className="text-2xl font-display text-gold mb-1">{eg.name}</h1>
        <p className="text-text-dim text-base mb-8">{eg.difficulty} &middot; Goal: {eg.goal === 'win' ? 'Win the position' : 'Hold the draw'}</p>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          <div className="w-full max-w-[480px]">
            <ChessBoard fen={eg.fen} movable={false} />
          </div>
          <div className="space-y-4">
            <div className="card-base p-5">
              <p className="text-base text-text leading-relaxed">{eg.description}</p>
            </div>
            <div className="card-base p-5">
              <p className="text-xs text-text-dim uppercase tracking-wider mb-2 font-medium">Technique</p>
              <p className="text-base text-text leading-relaxed">{eg.technique}</p>
            </div>

            {!showSolution ? (
              <button onClick={() => setShowSolution(true)} className="w-full bg-gold text-bg py-2.5 rounded-lg font-semibold hover:bg-gold-dim transition-all btn-press">Show Key Moves</button>
            ) : (
              <div className="card-base p-5 border-gold/20">
                <p className="text-gold font-semibold text-xs uppercase tracking-wider mb-3">Key Moves</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {eg.solution.map((m, i) => (
                    <span key={i} className="px-2.5 py-1 rounded bg-gold/10 text-gold text-sm font-mono border border-gold/20">{m}</span>
                  ))}
                </div>
                <ul className="text-base text-text space-y-1">
                  {eg.keyPoints.map((p, i) => <li key={i} className="flex gap-2"><span className="text-gold/50">&#9670;</span>{p}</li>)}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-display text-gold mb-1">Theoretical Endgames</h1>
      <p className="text-text-dim text-base mb-8">Must-know endgame positions every player should master.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {theoreticalEndgames.map((eg, i) => (
          <button key={eg.id} onClick={() => setSelected(i)} className="card-base p-5 text-left card-hover card-stagger hover:border-gold/20 btn-press">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${eg.goal === 'win' ? 'bg-correct/20 text-correct' : 'bg-amber/20 text-amber'}`}>{eg.goal === 'win' ? 'Win' : 'Draw'}</span>
            <h3 className="text-base font-semibold mt-2 mb-1">{eg.name}</h3>
            <p className="text-xs text-text-dim">{eg.difficulty}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
