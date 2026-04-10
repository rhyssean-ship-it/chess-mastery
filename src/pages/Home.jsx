import { Link } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useSpacedRepetition } from '../hooks/useSpacedRepetition';
import { progressService } from '../services/progressService';
import quotes from '../data/quotes';
import puzzles from '../data/puzzles';
import strategyLessons from '../data/strategyLessons';
import endgameLessons from '../data/endgameLessons';
import openings from '../data/openings';
import middlegamePlans from '../data/middlegamePlans';

function getDayOfYear() {
  const now = new Date();
  return Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
}

const features = [
  { icon: '\u2654', label: 'Openings', desc: '20 openings with trainers', to: '/openings', color: 'from-gold/20 to-gold/5' },
  { icon: '\u2658', label: 'Tactics', desc: '40 spaced repetition puzzles', to: '/tactics', color: 'from-correct/20 to-correct/5' },
  { icon: '\u2655', label: 'Middlegame', desc: 'Plans, patterns, master games', to: '/middlegame', color: 'from-amber/20 to-amber/5' },
  { icon: '\u2656', label: 'Endgames', desc: 'Theory and practical drills', to: '/endgames', color: 'from-incorrect/20 to-incorrect/5' },
];

export default function Home() {
  const [visited, setVisited] = useLocalStorage('has-visited', false);
  const { getDueCount } = useSpacedRepetition();
  const puzzleIds = puzzles.map(p => p.id);
  const dueCount = getDueCount(puzzleIds);
  const stats = progressService.getPuzzleStats();
  const streak = progressService.getStreak();
  const recentActivity = progressService.getRecentActivity(5);
  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  const dailyDone = useLocalStorage('daily-completed', {})[0][getDayOfYear()];

  const strategyDone = progressService.getCompletedLessons('strategy').length;
  const endgameDone = progressService.getCompletedLessons('endgame').length;
  const middlegameDone = progressService.getCompletedLessons('middlegame').length;
  const openingsDone = progressService.getCompletedLessons('opening').length;
  const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;

  if (!visited) {
    return (
      <div className="page-enter max-w-3xl mx-auto px-6 py-20 text-center">
        <div className="stat-animate mb-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-8 h-8 text-gold" fill="currentColor">
              <path d="M12 2L9 7H6l1.5 4L6 15h3l1 2h4l1-2h3l-1.5-4L18 7h-3L12 2zM10 17v3h4v-3h-4z" />
            </svg>
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-display text-gold mb-4">Welcome to Chess Mastery</h1>
        <p className="text-lg text-text-dim mb-10 max-w-xl mx-auto leading-relaxed">
          A comprehensive chess learning platform with 23 interactive features. Master every phase of the game.
        </p>
        <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto mb-12">
          {features.map((s, i) => (
            <Link key={s.label} to={s.to} className="no-underline card-stagger" style={{ animationDelay: `${i * 80}ms` }}>
              <div className={`card-base p-5 text-left card-hover hover:border-gold/20 bg-gradient-to-br ${s.color}`}>
                <span className="text-2xl block mb-2">{s.icon}</span>
                <h3 className="font-display text-sm font-semibold">{s.label}</h3>
                <p className="text-xs text-text-dim mt-0.5">{s.desc}</p>
              </div>
            </Link>
          ))}
        </div>
        <button onClick={() => setVisited(true)} className="bg-gold text-bg px-10 py-3.5 rounded-xl font-semibold text-lg hover:bg-gold-dim transition-all btn-press shadow-lg shadow-gold/20">
          Get Started
        </button>
      </div>
    );
  }

  return (
    <div className="page-enter max-w-6xl mx-auto px-6 py-8">
      {/* Header row */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display text-gold mb-0.5">Dashboard</h1>
          <p className="text-text-dim text-sm">Your chess training hub.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xl font-bold text-gold tabular-nums">{streak}</div>
            <div className="text-[10px] text-text-dim uppercase tracking-wider">day streak</div>
          </div>
        </div>
      </div>

      {/* Daily Challenge Banner */}
      <Link to="/daily" className="no-underline block mb-6">
        <div className={`card-base p-5 flex items-center justify-between hover:border-gold/30 transition-all ${dailyDone ? 'opacity-60' : 'border-gold/20 bg-gradient-to-r from-gold/5 to-transparent'}`}>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold text-lg">&#9813;</div>
            <div>
              <h3 className="font-display text-sm font-semibold">{dailyDone ? 'Daily Challenge Complete' : 'Today\'s Daily Challenge'}</h3>
              <p className="text-text-dim text-xs">{dailyDone ? 'Come back tomorrow for a fresh challenge.' : 'A tactical puzzle and a positional quiz await.'}</p>
            </div>
          </div>
          {!dailyDone && <span className="bg-gold text-bg text-xs font-semibold px-3 py-1 rounded-lg">Start</span>}
          {dailyDone && <span className="text-correct text-sm">&#10003;</span>}
        </div>
      </Link>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { value: dueCount, label: 'Puzzles Due', to: '/tactics', accent: true },
          { value: `${accuracy}%`, label: 'Accuracy', to: '/progress' },
          { value: stats.total, label: 'Solved', to: '/progress' },
          { value: `${strategyDone + endgameDone + middlegameDone}`, label: 'Lessons Done', to: '/progress' },
        ].map((s, i) => (
          <Link key={i} to={s.to} className="no-underline card-stagger" style={{ animationDelay: `${i * 50}ms` }}>
            <div className={`card-base p-4 text-center card-hover ${s.accent ? 'accent-border-left' : ''}`}>
              <div className={`text-xl font-bold stat-animate tabular-nums ${s.accent ? 'text-gold' : ''}`}>{s.value}</div>
              <div className="text-[10px] text-text-dim mt-1 uppercase tracking-wider">{s.label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        {/* Quick Actions — Left column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Continue Learning */}
          <div>
            <h2 className="text-sm font-display text-text-dim mb-3 uppercase tracking-wider">Continue Learning</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Openings', count: `${openingsDone}/${openings.length}`, to: '/openings', icon: '\u2654' },
                { label: 'Strategy', count: `${strategyDone}/${strategyLessons.length}`, to: '/strategy', icon: '\u2655' },
                { label: 'Middlegame', count: `${middlegameDone}/${middlegamePlans.length}`, to: '/middlegame', icon: '\u265A' },
                { label: 'Endgames', count: `${endgameDone}/${endgameLessons.length}`, to: '/endgames', icon: '\u2656' },
              ].map((s, i) => (
                <Link key={i} to={s.to} className="no-underline card-stagger" style={{ animationDelay: `${i * 40}ms` }}>
                  <div className="card-base p-4 card-hover hover:border-gold/20 text-center">
                    <div className="text-lg mb-1">{s.icon}</div>
                    <div className="text-xs font-semibold mb-0.5">{s.label}</div>
                    <div className="text-[10px] text-text-dim tabular-nums">{s.count}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Practice & Train */}
          <div>
            <h2 className="text-sm font-display text-text-dim mb-3 uppercase tracking-wider">Practice & Train</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: 'Tactics Queue', desc: `${dueCount} due`, to: '/tactics' },
                { label: 'Calculation', desc: 'Mental math', to: '/calculation' },
                { label: 'Visualisation', desc: 'Board vision', to: '/visualisation' },
                { label: 'Critical Moments', desc: 'Best plan?', to: '/critical-moments' },
                { label: 'Pattern Recognition', desc: 'Who\'s better?', to: '/pattern-recognition' },
                { label: 'Repertoire', desc: 'Drill openings', to: '/repertoire' },
              ].map((s, i) => (
                <Link key={i} to={s.to} className="no-underline card-stagger" style={{ animationDelay: `${i * 30}ms` }}>
                  <div className="card-base p-4 card-hover hover:border-gold/20">
                    <div className="text-xs font-semibold mb-0.5">{s.label}</div>
                    <div className="text-[10px] text-text-dim">{s.desc}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Reference */}
          <div>
            <h2 className="text-sm font-display text-text-dim mb-3 uppercase tracking-wider">Reference & Tools</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Opening Traps', to: '/opening-traps' },
                { label: 'Master Games', to: '/master-games' },
                { label: 'Pawn Structures', to: '/pawn-structures' },
                { label: 'Game Review', to: '/game-review' },
                { label: 'Concept Cards', to: '/flashcards' },
                { label: 'Glossary', to: '/glossary' },
                { label: 'Move Order Quiz', to: '/move-order' },
                { label: 'Weakness Analyzer', to: '/weakness' },
              ].map((s, i) => (
                <Link key={i} to={s.to} className="no-underline">
                  <div className="card-base px-3 py-2.5 card-hover hover:border-gold/20 text-center">
                    <div className="text-[11px] font-medium">{s.label}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Recent Activity */}
          <div>
            <h2 className="text-sm font-display text-text-dim mb-3 uppercase tracking-wider">Recent Activity</h2>
            {recentActivity.length === 0 ? (
              <div className="card-base p-6 text-center">
                <div className="text-2xl mb-2 opacity-20">&#9813;</div>
                <p className="text-text-dim text-xs">No activity yet.</p>
              </div>
            ) : (
              <div className="space-y-1.5">
                {recentActivity.map((a, i) => (
                  <div key={i} className="card-base !rounded-lg px-3 py-2 flex justify-between text-[11px] card-stagger" style={{ animationDelay: `${i * 30}ms` }}>
                    <span className="truncate mr-2 text-text-dim">{a.action}</span>
                    <span className="text-text-dim/50 whitespace-nowrap tabular-nums">{new Date(a.date).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quote */}
          <div className="card-base p-5">
            <div className="text-gold/20 text-3xl font-display leading-none mb-1">"</div>
            <p className="italic text-text-dim text-sm leading-relaxed mb-2">{quote.text}</p>
            <p className="text-gold text-xs not-italic font-medium">— {quote.author}</p>
          </div>

          {/* Quick links */}
          <Link to="/progress" className="no-underline block">
            <div className="card-base p-4 card-hover hover:border-gold/20 flex items-center gap-3">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-gold">
                <path d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75z" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div>
                <div className="text-xs font-semibold">Full Progress Dashboard</div>
                <div className="text-[10px] text-text-dim">Detailed stats and analytics</div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
