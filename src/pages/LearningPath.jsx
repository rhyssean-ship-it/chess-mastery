import { Link } from 'react-router-dom';

const stages = [
  {
    elo: '500 → 700',
    title: 'Foundation',
    description: 'Learn piece values, stop hanging pieces, and understand basic checkmates.',
    sections: [
      { to: '/piece-values', label: 'Piece Values & Trading' },
      { to: '/hanging-pieces', label: 'Hanging Pieces Trainer' },
      { to: '/notation', label: 'Board Notation' },
      { to: '/checkmate-patterns', label: 'Checkmate Patterns' },
      { to: '/game-phases', label: 'Game Phases Guide' },
      { to: '/play?elo=500', label: 'Play at 400-600 ELO' },
    ],
    color: '#4CAF50',
  },
  {
    elo: '700 → 1000',
    title: 'Core Skills',
    description: 'Build the pre-move checklist habit, learn common mistakes, and start solving tactics.',
    sections: [
      { to: '/pre-move-checklist', label: 'Pre-Move Checklist' },
      { to: '/common-mistakes', label: 'Common Mistakes Quiz' },
      { to: '/blunder-detection', label: 'Blunder Detection' },
      { to: '/tactics', label: 'Tactics Puzzles (Beginner)' },
      { to: '/theoretical-endgames', label: 'Basic Endgames' },
      { to: '/play?elo=800', label: 'Play at 600-900 ELO' },
    ],
    color: '#66BB6A',
  },
  {
    elo: '1000 → 1200',
    title: 'Opening Knowledge',
    description: 'Learn opening principles, study 3-4 openings deeply, and drill your repertoire.',
    sections: [
      { to: '/openings', label: 'Openings Library' },
      { to: '/opening-traps', label: 'Opening Traps' },
      { to: '/move-order', label: 'Move Order Quiz' },
      { to: '/repertoire', label: 'Repertoire Builder' },
      { to: '/practice-play', label: 'Practice Play (with coaching)' },
      { to: '/play?elo=1000', label: 'Play at 900-1200 ELO' },
    ],
    color: '#A0C34E',
  },
  {
    elo: '1200 → 1350',
    title: 'Tactical Sharpness',
    description: 'Deepen tactical vision with calculation, pattern recognition, and advanced puzzles.',
    sections: [
      { to: '/tactics', label: 'Tactics Puzzles (Intermediate)' },
      { to: '/calculation', label: 'Calculation Trainer' },
      { to: '/visualisation', label: 'Visualisation Drills' },
      { to: '/critical-moments', label: 'Critical Moments' },
      { to: '/pattern-recognition', label: 'Pattern Recognition' },
      { to: '/play?elo=1200', label: 'Play at 1100-1300 ELO' },
    ],
    color: '#C9A84C',
  },
  {
    elo: '1350 → 1500',
    title: 'Strategic Understanding',
    description: 'Learn pawn structures, middlegame plans, and endgame technique to convert advantages.',
    sections: [
      { to: '/strategy', label: 'Strategy Lessons' },
      { to: '/middlegame', label: 'Middlegame Plans' },
      { to: '/pawn-structures', label: 'Pawn Structures' },
      { to: '/endgames', label: 'Endgame Lessons' },
      { to: '/practical-endgames', label: 'Practical Endgames' },
      { to: '/play?elo=1400', label: 'Play at 1300-1500 ELO' },
    ],
    color: '#FFA726',
  },
  {
    elo: '1500 → 1700',
    title: 'Positional Mastery',
    description: 'Move beyond tactics into deep positional play. Understand prophylaxis, piece coordination, and long-term planning.',
    sections: [
      { to: '/strategy', label: 'Prophylaxis & Prevention' },
      { to: '/middlegame', label: 'IQP, Carlsbad & Hedgehog Plans' },
      { to: '/critical-moments', label: 'Critical Moments (Advanced)' },
      { to: '/master-games', label: 'Study Master Games' },
      { to: '/play?elo=1600', label: 'Play at 1400-1600 ELO' },
      { to: '/game-review', label: 'Review Your Games' },
    ],
    color: '#EF8C3A',
  },
  {
    elo: '1700 → 1850',
    title: 'Advanced Tactics & Calculation',
    description: 'Sharpen deep calculation, learn complex tactical themes, and develop candidate move thinking.',
    sections: [
      { to: '/calculation', label: 'Calculation Trainer (Advanced)' },
      { to: '/tactics', label: 'Advanced Tactics Puzzles' },
      { to: '/pattern-recognition', label: 'Rapid Pattern Recognition' },
      { to: '/visualisation', label: 'Advanced Visualisation' },
      { to: '/pawn-structures', label: 'Dynamic Pawn Structures' },
      { to: '/play?elo=1800', label: 'Play at 1600-1800 ELO' },
    ],
    color: '#E57373',
  },
  {
    elo: '1850 → 2000',
    title: 'Expert Preparation',
    description: 'Refine your opening repertoire, master complex endgames, develop a personal style, and learn to convert small advantages.',
    sections: [
      { to: '/openings', label: 'Deep Opening Preparation' },
      { to: '/repertoire', label: 'Repertoire Refinement' },
      { to: '/endgames', label: 'Complex Endgames' },
      { to: '/theoretical-endgames', label: 'Theoretical Precision' },
      { to: '/master-games', label: 'Annotated Master Games' },
      { to: '/weakness', label: 'Weakness Analysis & Targeted Training' },
      { to: '/play?elo=2000', label: 'Play at 1800-2000 ELO' },
    ],
    color: '#D32F2F',
  },
];

export default function LearningPath() {
  return (
    <div className="page-enter max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-display text-gold mb-1">Learning Path</h1>
      <p className="text-text-dim text-base mb-10">Your roadmap from 500 to 2000 ELO. Follow each stage in order.</p>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 top-0 bottom-0 w-px bg-bg-hover" />

        <div className="space-y-8">
          {stages.map((stage, i) => (
            <div key={i} className="relative pl-16">
              {/* Circle marker */}
              <div className="absolute left-3.5 w-5 h-5 rounded-full border-2 bg-bg" style={{ borderColor: stage.color }} />

              <div className="card-base p-6 card-stagger" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: `${stage.color}20`, color: stage.color }}>{stage.elo}</span>
                  <span className="text-xs text-text-dim">Stage {i + 1}</span>
                </div>
                <h2 className="text-xl font-display mb-1">{stage.title}</h2>
                <p className="text-text-dim text-sm mb-4">{stage.description}</p>

                <div className="flex flex-wrap gap-2">
                  {stage.sections.map(s => (
                    <Link key={s.to} to={s.to} className="text-xs bg-bg-hover hover:bg-bg-elevated px-3 py-1.5 rounded-lg no-underline text-text-dim hover:text-text transition-all btn-press">
                      {s.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
