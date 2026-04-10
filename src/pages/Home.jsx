import { Link } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useSpacedRepetition } from '../hooks/useSpacedRepetition';
import { progressService } from '../services/progressService';
import quotes from '../data/quotes';
import puzzles from '../data/puzzles';

const features = [
  { icon: '\u2654', label: 'Openings Library', desc: '20 key openings with interactive trainers', to: '/openings' },
  { icon: '\u2658', label: 'Tactics Puzzles', desc: '40 puzzles with spaced repetition', to: '/tactics' },
  { icon: '\u2656', label: 'Strategy & Endgames', desc: '22 in-depth lessons with board positions', to: '/strategy' },
  { icon: '\u2655', label: 'Visualisation Drills', desc: 'Train your board vision and memory', to: '/visualisation' },
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

  if (!visited) {
    return (
      <div className="page-enter max-w-3xl mx-auto px-6 py-20 text-center">
        <div className="stat-animate mb-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center mb-6">
            <svg viewBox="0 0 24 24" className="w-8 h-8 text-gold" fill="currentColor">
              <path d="M12 2L9 7H6l1.5 4L6 15h3l1 2h4l1-2h3l-1.5-4L18 7h-3L12 2zM10 17v3h4v-3h-4z" />
            </svg>
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-display text-gold mb-4">Welcome to Chess Mastery</h1>
        <p className="text-lg text-text-dim mb-10 max-w-xl mx-auto leading-relaxed">
          A comprehensive chess learning platform. Master openings, sharpen your tactics with spaced repetition,
          study strategy and endgames, build your repertoire, and train your board vision.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto mb-12">
          {features.map((s, i) => (
            <Link key={s.label} to={s.to} className="no-underline card-stagger" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="card-base p-5 text-left card-hover hover:border-gold/20">
                <span className="text-2xl block mb-2">{s.icon}</span>
                <h3 className="font-display text-sm font-semibold">{s.label}</h3>
                <p className="text-xs text-text-dim mt-0.5">{s.desc}</p>
              </div>
            </Link>
          ))}
        </div>
        <button
          onClick={() => setVisited(true)}
          className="bg-gold text-bg px-10 py-3.5 rounded-xl font-semibold text-lg hover:bg-gold-dim transition-all btn-press shadow-lg shadow-gold/20"
        >
          Get Started
        </button>
      </div>
    );
  }

  return (
    <div className="page-enter max-w-5xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-display text-gold mb-1">Dashboard</h1>
        <p className="text-text-dim text-sm">Welcome back. Here's your chess training overview.</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { value: dueCount, label: 'Puzzles Due Today', accent: true },
          { value: `${stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0}%`, label: 'Puzzle Accuracy' },
          { value: stats.total, label: 'Puzzles Solved' },
          { value: streak, label: 'Day Streak', accent: true },
        ].map((s, i) => (
          <div key={i} className="card-base p-5 text-center card-stagger card-hover" style={{ animationDelay: `${i * 60}ms` }}>
            <div className={`text-2xl font-bold stat-animate ${s.accent ? 'text-gold' : ''}`}>{s.value}</div>
            <div className="text-[11px] text-text-dim mt-1.5 uppercase tracking-wider">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3 mb-10">
        <Link to="/tactics" className="bg-gold text-bg px-6 py-2.5 rounded-xl font-semibold no-underline hover:bg-gold-dim transition-all btn-press shadow-lg shadow-gold/10">
          Start Today's Puzzles
        </Link>
        <Link to="/openings" className="card-base text-text px-6 py-2.5 no-underline hover:border-gold/30 transition-all btn-press">
          Study Openings
        </Link>
        <Link to="/game-review" className="card-base text-text px-6 py-2.5 no-underline hover:border-gold/30 transition-all btn-press">
          Review a Game
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-6">
        {/* Recent activity */}
        <div>
          <h2 className="text-base font-display mb-3 text-text-dim">Recent Activity</h2>
          {recentActivity.length === 0 ? (
            <div className="card-base p-8 text-center">
              <div className="text-3xl mb-3 opacity-30">&#9813;</div>
              <p className="text-text-dim text-sm">No activity yet. Start a lesson or solve some puzzles!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentActivity.map((a, i) => (
                <div key={i} className="card-base !rounded-lg px-4 py-2.5 flex justify-between text-sm card-stagger" style={{ animationDelay: `${i * 40}ms` }}>
                  <span className="truncate mr-3">{a.action}</span>
                  <span className="text-text-dim text-xs whitespace-nowrap">{new Date(a.date).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quote */}
        <div>
          <h2 className="text-base font-display mb-3 text-text-dim">Inspiration</h2>
          <div className="card-base p-6 h-[calc(100%-32px)] flex flex-col justify-center">
            <div className="text-gold/30 text-4xl font-display leading-none mb-2">"</div>
            <p className="italic text-text-dim leading-relaxed mb-3">{quote.text}</p>
            <p className="text-gold text-sm not-italic font-medium">— {quote.author}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
