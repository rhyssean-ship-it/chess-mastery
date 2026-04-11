import { useState } from 'react';
import ChessBoard from '../components/ChessBoard';
import gamePhases from '../data/gamePhases';

export default function GamePhaseGuide() {
  const [selectedPhase, setSelectedPhase] = useState(null);
  const phase = selectedPhase ? gamePhases.find(p => p.id === selectedPhase) : null;

  if (phase) {
    return (
      <div className="page-enter max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <button onClick={() => setSelectedPhase(null)} className="inline-flex items-center gap-1.5 text-text-dim hover:text-gold text-sm mb-5 group transition-colors">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"><path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" /></svg>
          <span>Back to Phases</span>
        </button>
        <h1 className="text-2xl font-display text-gold mb-1">{phase.title}</h1>
        <p className="text-text-dim text-base mb-8">What to focus on during this phase of the game.</p>

        {/* Principles */}
        <div className="card-base p-5 mb-8 border-gold/20">
          <h3 className="text-sm text-gold font-semibold mb-3">Key Principles</h3>
          <ul className="space-y-2">
            {phase.principles.map((p, i) => (
              <li key={i} className="flex gap-2 text-text"><span className="text-gold/50 mt-0.5">◆</span><span>{p}</span></li>
            ))}
          </ul>
        </div>

        {/* Content */}
        <div className="space-y-6 leading-relaxed mb-8">
          {phase.content.map((section, i) => {
            if (section.type === 'heading') return <h3 key={i} className="text-lg font-display text-gold mt-4">{section.content}</h3>;
            if (section.type === 'text') return <p key={i} className="text-text">{section.content}</p>;
            if (section.type === 'position') return (
              <div key={i} className="my-8">
                <div className="max-w-[440px] mx-auto">
                  <ChessBoard fen={section.fen} movable={false} arrows={section.arrows || []} highlights={section.highlights || []} />
                </div>
                {section.caption && <p className="text-sm text-text-dim text-center mt-3 italic">{section.caption}</p>}
              </div>
            );
            return null;
          })}
        </div>

        {/* Do's and Don'ts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="card-base p-5">
            <h3 className="text-correct font-semibold text-sm mb-3">✓ Do</h3>
            <ul className="space-y-2 text-sm">
              {phase.dos.map((d, i) => <li key={i} className="text-text flex gap-2"><span className="text-correct">✓</span>{d}</li>)}
            </ul>
          </div>
          <div className="card-base p-5">
            <h3 className="text-incorrect font-semibold text-sm mb-3">✗ Don't</h3>
            <ul className="space-y-2 text-sm">
              {phase.donts.map((d, i) => <li key={i} className="text-text flex gap-2"><span className="text-incorrect">✗</span>{d}</li>)}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-display text-gold mb-1">Game Phases</h1>
      <p className="text-text-dim text-base mb-8">Know what to do at every stage of the game.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {gamePhases.map(p => (
          <button key={p.id} onClick={() => setSelectedPhase(p.id)} className="card-base p-6 text-left card-hover card-stagger hover:border-gold/20 btn-press">
            <div className="text-3xl mb-3">{p.id === 'opening' ? '\u2658' : p.id === 'middlegame' ? '\u2655' : '\u2656'}</div>
            <h3 className="text-lg font-semibold mb-1">{p.title}</h3>
            <p className="text-sm text-text-dim">{p.principles[0]}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
