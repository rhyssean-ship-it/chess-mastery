import { Link } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useSpacedRepetition } from '../hooks/useSpacedRepetition';
import { progressService } from '../services/progressService';
import quotes from '../data/quotes';
import puzzles from '../data/puzzles';

export default function Home() {
  const [visited, setVisited] = useLocalStorage('has-visited', false);
  const { getDueCount } = useSpacedRepetition();
  const puzzleIds = puzzles.map(p => p.id);
  const dueCount = getDueCount(puzzleIds);
  const stats = progressService.getPuzzleStats();
  const streak = progressService.getStreak();
  const recentActivity = progressService.getRecentActivity(3);
  const quote = quotes[Math.floor(Math.random() * quotes.length)];

  if (!visited) {
    return (
      <div className="page-enter max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-display text-gold mb-6">Welcome to Chess Mastery</h1>
        <p className="text-lg text-text-dim mb-8 max-w-xl mx-auto leading-relaxed">
          A comprehensive chess learning platform. Master openings, sharpen your tactics with spaced repetition,
          study strategy and endgames, build your repertoire, and train your board vision.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto mb-10">
          {[
            { icon: '&#9812;', label: 'Openings Library', desc: '8 key openings with interactive trainers' },
            { icon: '&#9816;', label: 'Tactics Puzzles', desc: '40 puzzles with spaced repetition' },
            { icon: '&#9814;', label: 'Strategy & Endgames', desc: '22 in-depth lessons' },
            { icon: '&#9813;', label: 'Visualisation Drills', desc: 'Train your board vision' },
          ].map(s => (
            <div key={s.label} className="bg-bg-card border border-bg-hover rounded-lg p-4 text-left">
              <span className="text-2xl" dangerouslySetInnerHTML={{ __html: s.icon }} />
              <h3 className="font-display text-sm font-semibold mt-1">{s.label}</h3>
              <p className="text-xs text-text-dim">{s.desc}</p>
            </div>
          ))}
        </div>
        <button
          onClick={() => setVisited(true)}
          className="bg-gold text-bg px-8 py-3 rounded font-semibold text-lg hover:bg-gold-dim transition-colors"
        >
          Get Started
        </button>
      </div>
    );
  }

  return (
    <div className="page-enter max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-display text-gold mb-8">Dashboard</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-bg-card border border-bg-hover rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gold">{dueCount}</div>
          <div className="text-xs text-text-dim mt-1">Puzzles Due Today</div>
        </div>
        <div className="bg-bg-card border border-bg-hover rounded-lg p-4 text-center">
          <div className="text-2xl font-bold">{stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0}%</div>
          <div className="text-xs text-text-dim mt-1">Puzzle Accuracy</div>
        </div>
        <div className="bg-bg-card border border-bg-hover rounded-lg p-4 text-center">
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-xs text-text-dim mt-1">Puzzles Solved</div>
        </div>
        <div className="bg-bg-card border border-bg-hover rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gold">{streak}</div>
          <div className="text-xs text-text-dim mt-1">Day Streak</div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3 mb-8">
        <Link to="/tactics" className="bg-gold text-bg px-5 py-2.5 rounded font-semibold no-underline hover:bg-gold-dim transition-colors">
          Start Today's Puzzles
        </Link>
        <Link to="/openings" className="bg-bg-card border border-bg-hover text-text px-5 py-2.5 rounded no-underline hover:border-gold/30 transition-colors">
          Study Openings
        </Link>
        <Link to="/game-review" className="bg-bg-card border border-bg-hover text-text px-5 py-2.5 rounded no-underline hover:border-gold/30 transition-colors">
          Review a Game
        </Link>
      </div>

      {/* Recent activity */}
      {recentActivity.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-display mb-3">Recent Activity</h2>
          <div className="space-y-2">
            {recentActivity.map((a, i) => (
              <div key={i} className="bg-bg-card border border-bg-hover rounded-lg px-4 py-2 flex justify-between text-sm">
                <span>{a.action}</span>
                <span className="text-text-dim">{new Date(a.date).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quote */}
      <div className="bg-bg-card border border-bg-hover rounded-xl p-6 text-center italic text-text-dim">
        <p className="mb-2">"{quote.text}"</p>
        <p className="text-gold text-sm not-italic">— {quote.author}</p>
      </div>
    </div>
  );
}
