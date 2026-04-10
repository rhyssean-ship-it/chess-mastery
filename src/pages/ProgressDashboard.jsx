import { useState } from 'react';
import ProgressBar from '../components/ProgressBar';
import Modal from '../components/Modal';
import { progressService } from '../services/progressService';
import { useSpacedRepetition } from '../hooks/useSpacedRepetition';
import puzzles from '../data/puzzles';
import openings from '../data/openings';
import strategyLessons from '../data/strategyLessons';
import endgameLessons from '../data/endgameLessons';

function BarChart({ data }) {
  const maxVal = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="space-y-2">
      {data.map(d => (
        <div key={d.label} className="flex items-center gap-3">
          <span className="text-xs text-text-dim w-28 text-right truncate">{d.label}</span>
          <div className="flex-1 h-5 bg-bg-hover rounded-full overflow-hidden">
            <div className="h-full bg-gold rounded-full transition-all" style={{ width: `${(d.value / maxVal) * 100}%` }} />
          </div>
          <span className="text-xs text-text w-10">{d.value}%</span>
        </div>
      ))}
    </div>
  );
}

export default function ProgressDashboard() {
  const [showReset, setShowReset] = useState(false);
  const puzzleStats = progressService.getPuzzleStats();
  const openingStats = progressService.getOpeningStats();
  const drillStats = progressService.getDrillStats();
  const streak = progressService.getStreak();
  const recentActivity = progressService.getRecentActivity(10);
  const { getDueCount } = useSpacedRepetition();

  const strategyCompleted = progressService.getCompletedLessons('strategy');
  const endgameCompleted = progressService.getCompletedLessons('endgame');

  const overallAccuracy = puzzleStats.total > 0 ? Math.round((puzzleStats.correct / puzzleStats.total) * 100) : 0;
  const categoryData = Object.entries(puzzleStats.byCategory || {}).map(([cat, stats]) => ({
    label: cat,
    value: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
  }));

  function handleReset() {
    progressService.resetAll();
    setShowReset(false);
    window.location.reload();
  }

  return (
    <div className="page-enter max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-display text-gold mb-1">Progress Dashboard</h1>
      <p className="text-text-dim text-sm mb-8">Track your chess improvement over time.</p>

      {/* Tactics */}
      <section className="mb-10">
        <h2 className="text-lg font-display mb-4">Tactics Stats</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-bg-card border border-bg-hover rounded-xl p-4 text-center card-stagger">
            <div className="text-xl font-bold stat-animate">{puzzleStats.total}</div>
            <div className="text-xs text-text-dim">Puzzles Solved</div>
          </div>
          <div className="bg-bg-card border border-bg-hover rounded-xl p-4 text-center card-stagger">
            <div className="text-xl font-bold stat-animate">{overallAccuracy}%</div>
            <div className="text-xs text-text-dim">Accuracy</div>
          </div>
          <div className="bg-bg-card border border-bg-hover rounded-xl p-4 text-center card-stagger">
            <div className="text-xl font-bold text-gold stat-animate">{streak}</div>
            <div className="text-xs text-text-dim">Day Streak</div>
          </div>
          <div className="bg-bg-card border border-bg-hover rounded-xl p-4 text-center card-stagger">
            <div className="text-xl font-bold stat-animate">{getDueCount(puzzles.map(p => p.id))}</div>
            <div className="text-xs text-text-dim">Due Today</div>
          </div>
        </div>
        {categoryData.length > 0 && (
          <div className="bg-bg-card border border-bg-hover rounded-xl p-4">
            <h3 className="text-sm text-text-dim mb-3">Accuracy by Category</h3>
            <BarChart data={categoryData} />
          </div>
        )}
      </section>

      {/* Openings */}
      <section className="mb-10">
        <h2 className="text-lg font-display mb-4">Openings Progress</h2>
        <div className="bg-bg-card border border-bg-hover rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-bg-hover text-text-dim text-xs">
                <th className="text-left px-4 py-2">Opening</th>
                <th className="text-center px-4 py-2">Studied</th>
                <th className="text-center px-4 py-2">Drills</th>
                <th className="text-center px-4 py-2">Last Accuracy</th>
              </tr>
            </thead>
            <tbody>
              {openings.map(op => {
                const studied = progressService.isLessonComplete('opening', op.id);
                const wStats = openingStats[`${op.id}-white`];
                const bStats = openingStats[`${op.id}-black`];
                const drills = (wStats?.attempts || 0) + (bStats?.attempts || 0);
                const lastAcc = wStats?.lastAccuracy || bStats?.lastAccuracy || '-';
                return (
                  <tr key={op.id} className="border-b border-bg-hover/50">
                    <td className="px-4 py-2">{op.name}</td>
                    <td className="px-4 py-2 text-center">{studied ? <span className="text-correct">&#10003;</span> : '-'}</td>
                    <td className="px-4 py-2 text-center">{drills || '-'}</td>
                    <td className="px-4 py-2 text-center">{lastAcc !== '-' ? `${lastAcc}%` : '-'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Strategy & Endgames */}
      <section className="mb-10">
        <h2 className="text-lg font-display mb-4">Strategy & Endgames</h2>
        <div className="space-y-3">
          <ProgressBar value={strategyCompleted.length} max={strategyLessons.length} label="Strategy Lessons" />
          <ProgressBar value={endgameCompleted.length} max={endgameLessons.length} label="Endgame Lessons" />
        </div>
      </section>

      {/* Visualisation */}
      <section className="mb-10">
        <h2 className="text-lg font-display mb-4">Visualisation Drills</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {['board-vision', 'blindfold', 'piece-counting'].map(type => {
            const s = drillStats[type];
            return (
              <div key={type} className="bg-bg-card border border-bg-hover rounded-xl p-4">
                <h4 className="text-sm font-semibold mb-1 capitalize">{type.replace('-', ' ')}</h4>
                {s ? (
                  <>
                    <p className="text-xs text-text-dim">Best: {s.best}</p>
                    <p className="text-xs text-text-dim">Attempts: {s.attempts}</p>
                    <p className="text-xs text-text-dim">Avg accuracy: {s.attempts > 0 ? Math.round(s.totalAccuracy / s.attempts) : 0}%</p>
                  </>
                ) : (
                  <p className="text-xs text-text-dim">No attempts yet</p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Recent activity */}
      <section className="mb-10">
        <h2 className="text-lg font-display mb-4">Recent Activity</h2>
        {recentActivity.length === 0 ? (
          <p className="text-text-dim text-sm">No activity yet. Start learning!</p>
        ) : (
          <div className="space-y-2">
            {recentActivity.map((a, i) => (
              <div key={i} className="bg-bg-card border border-bg-hover rounded-xl px-4 py-2 flex justify-between text-sm">
                <span>{a.action}</span>
                <span className="text-text-dim">{new Date(a.date).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Reset */}
      <div className="pt-6 border-t border-bg-hover">
        <button onClick={() => setShowReset(true)} className="bg-incorrect/20 text-incorrect px-5 py-2 rounded-lg text-sm hover:bg-incorrect/30 transition-all btn-press">
          Reset All Progress
        </button>
      </div>

      {showReset && (
        <Modal
          title="Reset All Progress"
          onClose={() => setShowReset(false)}
          onConfirm={handleReset}
          confirmText="Reset Everything"
          danger
        >
          <p>This will permanently delete all your progress, puzzle history, annotations, and drill scores. This cannot be undone.</p>
        </Modal>
      )}
    </div>
  );
}
