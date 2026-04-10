import { Link } from 'react-router-dom';
import { progressService } from '../services/progressService';

const categoryLinks = {
  Fork: '/tactics',
  Pin: '/tactics',
  Skewer: '/tactics',
  'Discovered Attack': '/tactics',
  'Back Rank Mate': '/tactics',
  Deflection: '/tactics',
  'Double Check': '/tactics',
  Zugzwang: '/endgames',
  'Critical Moment': '/critical-moments',
  Calculation: '/calculation',
  'Practical Endgame': '/endgames',
};

const studyRecommendations = {
  Fork: { lesson: '/strategy/piece-activity', tip: 'Study piece activity to understand how forks arise from active piece placement.' },
  Pin: { lesson: '/strategy/weak-squares', tip: 'Pins exploit alignment — study weak squares to spot pin opportunities.' },
  Skewer: { lesson: '/strategy/open-files-rooks', tip: 'Skewers happen on open lines. Study rook and bishop placement on open files.' },
  'Back Rank Mate': { lesson: '/strategy/king-safety', tip: 'Study king safety — back rank mates are prevented by making luft (h3/h6).' },
  Deflection: { lesson: '/strategy/piece-activity', tip: 'Deflection requires recognizing overloaded pieces. Study piece activity.' },
  Zugzwang: { lesson: '/endgames/opposition', tip: 'Zugzwang is an endgame concept. Master the opposition first.' },
};

function getBarColor(pct) {
  if (pct >= 80) return 'from-correct/80 to-correct';
  if (pct >= 50) return 'from-amber/80 to-amber';
  return 'from-incorrect/80 to-incorrect';
}

export default function WeaknessAnalyzer() {
  const stats = progressService.getPuzzleStats();
  const categories = Object.entries(stats.byCategory || {});

  if (categories.length === 0) {
    return (
      <div className="page-enter max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="text-5xl mb-4 opacity-20">♕</div>
        <h1 className="text-3xl font-display text-gold mb-4">Weakness Analyzer</h1>
        <p className="text-text-dim mb-6">Solve some puzzles first! The analyzer needs data from your puzzle attempts to identify your strengths and weaknesses.</p>
        <Link to="/tactics" className="bg-gold text-bg px-4 sm:px-6 py-2.5 rounded-lg font-semibold hover:bg-gold-dim transition-all btn-press no-underline inline-block">Start Solving Puzzles</Link>
      </div>
    );
  }

  const sorted = categories
    .map(([cat, s]) => ({ cat, accuracy: s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0, total: s.total, correct: s.correct }))
    .sort((a, b) => a.accuracy - b.accuracy);

  const weakest = sorted.filter(c => c.accuracy < 70);
  const strongest = sorted.filter(c => c.accuracy >= 70).sort((a, b) => b.accuracy - a.accuracy);

  return (
    <div className="page-enter max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-display text-gold mb-1">Weakness Analyzer</h1>
      <p className="text-text-dim text-base mb-8">Based on your puzzle performance, here's where to focus.</p>

      {/* Weaknesses */}
      {weakest.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-display mb-4 text-incorrect">Areas to Improve</h2>
          <div className="space-y-3">
            {weakest.map(c => {
              const rec = studyRecommendations[c.cat];
              return (
                <div key={c.cat} className="card-base p-5 accent-border-left" style={{ borderLeftColor: 'var(--color-incorrect)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-sm">{c.cat}</h3>
                    <span className="text-incorrect font-bold tabular-nums">{c.accuracy}%</span>
                  </div>
                  <div className="h-2 bg-bg-hover/50 rounded-full overflow-hidden mb-3">
                    <div className={`h-full bg-gradient-to-r ${getBarColor(c.accuracy)} rounded-full`} style={{ width: `${c.accuracy}%` }} />
                  </div>
                  <p className="text-xs text-text-dim mb-2">{c.correct}/{c.total} correct</p>
                  {rec && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      <p className="text-xs text-text">{rec.tip}</p>
                      <Link to={rec.lesson} className="text-xs text-gold no-underline hover:underline">Study this &rarr;</Link>
                    </div>
                  )}
                  <Link to={categoryLinks[c.cat] || '/tactics'} className="inline-block mt-2 text-xs bg-incorrect/15 text-incorrect px-3 py-1 rounded-lg no-underline hover:bg-incorrect/25 transition-all">Practice {c.cat} puzzles</Link>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {weakest.length === 0 && (
        <div className="card-base p-8 text-center mb-8">
          <div className="text-3xl mb-3">♕</div>
          <p className="text-correct font-semibold mb-1">No major weaknesses detected!</p>
          <p className="text-text text-base leading-relaxed">Your accuracy is above 70% in all categories. Keep it up!</p>
        </div>
      )}

      {/* Strengths */}
      {strongest.length > 0 && (
        <section>
          <h2 className="text-xl font-display mb-4 text-correct">Your Strengths</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {strongest.map(c => (
              <div key={c.cat} className="card-base p-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">{c.cat}</h3>
                  <p className="text-xs text-text-dim">{c.correct}/{c.total} correct</p>
                </div>
                <span className={`font-bold tabular-nums ${c.accuracy >= 80 ? 'text-correct' : 'text-amber'}`}>{c.accuracy}%</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <hr className="section-divider" />

      <div className="text-center">
        <p className="text-text text-base leading-relaxed mb-4">Want to improve? The best way is focused practice on your weakest areas.</p>
        <Link to="/tactics" className="bg-gold text-bg px-4 sm:px-6 py-2.5 rounded-lg font-semibold hover:bg-gold-dim transition-all btn-press no-underline inline-block">Practice Puzzles</Link>
      </div>
    </div>
  );
}
