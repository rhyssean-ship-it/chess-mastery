import { Link } from 'react-router-dom';

function Section({ title, items }) {
  return (
    <div className="mb-6">
      <h2 className="text-sm text-text-dim uppercase tracking-wide font-semibold mb-2">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {items.map(it => (
          <Link
            key={it.to}
            to={it.to}
            className="card-base p-3 hover:bg-bg-hover/30 transition-all flex flex-col"
          >
            <div className="text-base font-medium">{it.label}</div>
            {it.desc && <div className="text-[11px] text-text-dim mt-0.5 leading-tight">{it.desc}</div>}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function LearnIndex() {
  return (
    <div className="page-enter page page-wide">
      <h1 className="text-2xl sm:text-3xl font-display mb-1">Learn</h1>
      <p className="text-text-dim text-sm mb-6">Absorb chess knowledge — concepts, openings, master games.</p>

      <Section title="Start here" items={[
        { to: '/learning-path', label: 'Learning Path', desc: '500 → 2000 ELO roadmap' },
      ]} />

      <Section title="Fundamentals" items={[
        { to: '/game-phases', label: 'Game Phases' },
        { to: '/piece-values', label: 'Piece Values' },
        { to: '/notation', label: 'Board Notation' },
        { to: '/checkmate-patterns', label: 'Checkmate Patterns' },
      ]} />

      <Section title="Avoid Mistakes" items={[
        { to: '/hanging-pieces', label: 'Hanging Pieces' },
        { to: '/pre-move-checklist', label: 'Pre-Move Checklist' },
        { to: '/common-mistakes', label: 'Common Mistakes' },
        { to: '/blunder-detection', label: 'Blunder Detection' },
      ]} />

      <Section title="Openings" items={[
        { to: '/openings', label: 'Library' },
        { to: '/opening-traps', label: 'Traps' },
        { to: '/move-order', label: 'Move-order Quiz' },
        { to: '/repertoire', label: 'Repertoire Builder' },
      ]} />

      <Section title="Strategy" items={[
        { to: '/strategy', label: 'Strategy Lessons' },
        { to: '/middlegame', label: 'Plans by Structure' },
        { to: '/critical-moments', label: 'Critical Moments' },
        { to: '/pattern-recognition', label: 'Pattern Recognition' },
        { to: '/pawn-structures', label: 'Pawn Structures' },
        { to: '/master-games', label: 'Master Games' },
      ]} />

      <Section title="Endgames" items={[
        { to: '/endgames', label: 'Endgame Lessons' },
        { to: '/theoretical-endgames', label: 'Key Positions' },
        { to: '/practical-endgames', label: 'Practical Puzzles' },
      ]} />

      <Section title="Reference" items={[
        { to: '/flashcards', label: 'Concept Cards' },
        { to: '/glossary', label: 'Glossary' },
      ]} />
    </div>
  );
}

export function TrainIndex() {
  return (
    <div className="page-enter page page-wide">
      <h1 className="text-2xl sm:text-3xl font-display mb-1">Train</h1>
      <p className="text-text-dim text-sm mb-6">Sharpen your edge — high-volume tactics, calculation, pattern drills.</p>

      <Section title="Daily" items={[
        { to: '/daily', label: 'Daily Challenge', desc: 'Curated tactical + positional' },
        { to: '/daily-calculation', label: 'Daily Calculation', desc: '5-min clock, one position' },
      ]} />

      <Section title="Tactics" items={[
        { to: '/tactics', label: 'Puzzle Queue', desc: 'Spaced repetition' },
        { to: '/puzzle-rush', label: 'Puzzle Rush', desc: 'Rated sprint' },
        { to: '/pattern-dojo', label: 'Pattern Dojo', desc: '5s flash → motif' },
        { to: '/my-mistakes', label: 'My Mistakes', desc: 'Your own blunders as puzzles' },
      ]} />

      <Section title="Calculation & vision" items={[
        { to: '/calculation', label: 'Calculation Trainer' },
        { to: '/visualisation', label: 'Visualisation Drills' },
        { to: '/blindfold-ladder', label: 'Blindfold Ladder' },
      ]} />

      <Section title="Endgame drills" items={[
        { to: '/endgame-drills', label: 'Convert vs Stockfish', desc: 'KQK, Lucena, BN mate…' },
      ]} />
    </div>
  );
}

export function PlayIndex() {
  return (
    <div className="page-enter max-w-3xl mx-auto px-4 sm:px-6 py-6 lg:py-10">
      <h1 className="text-2xl sm:text-3xl font-display mb-1">Play</h1>
      <p className="text-text-dim text-sm mb-6">Real games — vs Stockfish at any strength.</p>

      <Section title="Game modes" items={[
        { to: '/play', label: 'vs Computer', desc: 'Pick your level, just play' },
        { to: '/practice-play', label: 'Practice Play', desc: 'With opening coaching + tactical alerts' },
      ]} />

      <Section title="Review past games" items={[
        { to: '/game-review', label: 'Game Review', desc: 'Paste a PGN to study' },
      ]} />
    </div>
  );
}

export function ProfileIndex() {
  return (
    <div className="page-enter page page-wide">
      <h1 className="text-2xl sm:text-3xl font-display mb-1">Profile</h1>
      <p className="text-text-dim text-sm mb-6">Your progress, ratings, and saved work.</p>

      <Section title="Progress" items={[
        { to: '/progress', label: 'Dashboard', desc: 'Stats, accuracy, activity' },
        { to: '/rating-estimator', label: 'Rating Estimator', desc: 'Adaptive 16-puzzle battery' },
        { to: '/weakness', label: 'Weakness Analyzer' },
      ]} />

      <Section title="Saved" items={[
        { to: '/my-mistakes', label: 'My Mistakes', desc: 'Blunders from analysed games' },
        { to: '/profile/reviews', label: 'Reviewed Games', desc: 'Last 10 analyses' },
      ]} />

      <Section title="Account" items={[
        { to: '/settings', label: 'Settings', desc: 'Theme, board prefs, export' },
      ]} />
    </div>
  );
}
