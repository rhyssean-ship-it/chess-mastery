import { useState } from 'react';
import ChessBoard from '../components/ChessBoard';
import pawnStructures from '../data/pawnStructures';

export default function PawnStructures() {
  const [selected, setSelected] = useState(null);
  const structure = selected ? pawnStructures.find(s => s.id === selected) : null;

  if (structure) {
    return (
      <div className="page-enter max-w-3xl mx-auto px-6 py-10">
        <button onClick={() => setSelected(null)} className="inline-flex items-center gap-1.5 text-text-dim hover:text-gold text-sm mb-5 group transition-colors">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform">
            <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
          </svg>
          <span>Back to Structures</span>
        </button>

        <h1 className="text-2xl font-display text-gold mb-1">{structure.name}</h1>
        <p className="text-text text-base mb-8">{structure.description}</p>

        {/* Typical position */}
        <div className="max-w-[400px] mx-auto mb-8">
          <ChessBoard fen={structure.typicalFen} movable={false} highlights={structure.keySquares} />
        </div>

        {/* Plans for both sides */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="card-base p-5">
            <h3 className="text-sm text-gold mb-2">&#9812; White's Plans</h3>
            <p className="text-base text-text leading-relaxed">{structure.forWhite}</p>
          </div>
          <div className="card-base p-5">
            <h3 className="text-sm mb-2">&#9818; Black's Plans</h3>
            <p className="text-base text-text leading-relaxed">{structure.forBlack}</p>
          </div>
        </div>

        {/* Key squares */}
        <div className="card-base p-5 mb-8">
          <h3 className="text-sm text-gold mb-2">Key Squares</h3>
          <div className="flex flex-wrap gap-2">
            {structure.keySquares.map(sq => (
              <span key={sq} className="bg-gold/10 text-gold text-sm px-3 py-1 rounded-lg font-mono border border-gold/20">{sq}</span>
            ))}
          </div>
        </div>

        {/* Arises from */}
        <div className="card-base p-5 mb-8">
          <h3 className="text-sm text-text-dim mb-2">Common Openings</h3>
          <div className="flex flex-wrap gap-2">
            {structure.openings.map(op => (
              <span key={op} className="bg-bg-hover text-text-dim text-xs px-3 py-1 rounded-lg">{op}</span>
            ))}
          </div>
        </div>

        {/* Additional positions */}
        {structure.positions && structure.positions.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-sm text-gold">Example Positions</h3>
            {structure.positions.map((pos, i) => (
              <div key={i}>
                <div className="max-w-[360px] mx-auto">
                  <ChessBoard fen={pos.fen} movable={false} arrows={pos.arrows || []} highlights={pos.highlights || []} />
                </div>
                {pos.caption && <p className="text-base text-text-dim text-center mt-2 italic">{pos.caption}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="page-enter max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-display text-gold mb-1">Pawn Structure Dictionary</h1>
      <p className="text-text-dim text-base mb-8">Understand the typical plans for every pawn structure.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {pawnStructures.map(s => (
          <button key={s.id} onClick={() => setSelected(s.id)} className="card-base p-5 text-left card-hover card-stagger hover:border-gold/20 btn-press">
            <h3 className="text-base font-semibold mb-1">{s.name}</h3>
            <p className="text-base text-text-dim mb-3 line-clamp-2">{s.description}</p>
            <div className="flex flex-wrap gap-1">
              {s.keySquares.slice(0, 4).map(sq => (
                <span key={sq} className="text-xs bg-gold/10 text-gold/70 px-1.5 py-0.5 rounded font-mono">{sq}</span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
