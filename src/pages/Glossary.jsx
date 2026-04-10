import { useState, useMemo } from 'react';
import ChessBoard from '../components/ChessBoard';
import glossary from '../data/glossary';

const categories = ['All', 'General', 'Tactics', 'Strategy', 'Endgame', 'Structure'];

export default function Glossary() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [expanded, setExpanded] = useState(null);

  const filtered = useMemo(() => {
    let items = glossary;
    if (filter !== 'All') items = items.filter(g => g.category === filter);
    if (search) items = items.filter(g => g.term.toLowerCase().includes(search.toLowerCase()) || g.definition.toLowerCase().includes(search.toLowerCase()));
    return items;
  }, [search, filter]);

  return (
    <div className="page-enter max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-display text-gold mb-1">Chess Glossary</h1>
      <p className="text-text-dim text-base mb-6">Every chess term explained with examples.</p>

      {/* Search & filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search terms..."
          className="flex-1 bg-bg-card border border-bg-hover rounded-lg px-4 py-2.5 text-sm text-text focus:outline-none focus:border-gold/50"
        />
        <div className="flex flex-wrap gap-1.5">
          {categories.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)} className={`text-xs px-3 py-1.5 rounded-lg transition-all btn-press ${filter === cat ? 'bg-gold text-bg' : 'bg-bg-card border border-bg-hover text-text-dim hover:text-text'}`}>{cat}</button>
          ))}
        </div>
      </div>

      <p className="text-xs text-text-dim mb-4">{filtered.length} term{filtered.length !== 1 ? 's' : ''}</p>

      {/* Terms */}
      <div className="space-y-2">
        {filtered.map(term => (
          <div key={term.id} className="card-base overflow-hidden">
            <button
              onClick={() => setExpanded(expanded === term.id ? null : term.id)}
              className="w-full px-5 py-4 text-left flex items-center justify-between hover:bg-bg-hover/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <h3 className="font-display text-base font-semibold">{term.term}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-bg-hover text-text-dim">{term.category}</span>
              </div>
              <svg className={`w-4 h-4 text-text-dim transition-transform ${expanded === term.id ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </button>

            {expanded === term.id && (
              <div className="px-5 pb-5 border-t border-bg-hover/50" style={{ animation: 'cardFadeUp 200ms ease-out' }}>
                <p className="text-base text-text-dim leading-relaxed mt-4 mb-3">{term.definition}</p>

                {term.example && (
                  <div className="bg-bg-hover/30 rounded-lg p-4 mb-3">
                    <p className="text-xs text-text-dim uppercase tracking-wider mb-1 font-medium">Example</p>
                    <p className="text-base text-text-dim">{term.example}</p>
                  </div>
                )}

                {term.exampleFen && (
                  <div className="max-w-[300px] mt-3">
                    <ChessBoard fen={term.exampleFen} movable={false} coordinates={false} framed={false} />
                  </div>
                )}

                {term.relatedTerms && term.relatedTerms.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    <span className="text-xs text-text-dim/50">Related:</span>
                    {term.relatedTerms.map(rt => (
                      <button key={rt} onClick={() => { setSearch(rt); setExpanded(null); }} className="text-xs text-gold hover:underline">{rt}</button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
