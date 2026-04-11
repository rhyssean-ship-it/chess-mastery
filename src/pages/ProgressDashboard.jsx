import { useState } from 'react';
import ProgressBar from '../components/ProgressBar';
import Modal from '../components/Modal';
import { progressService } from '../services/progressService';
import { useSpacedRepetition } from '../hooks/useSpacedRepetition';
import puzzles from '../data/puzzles';
import openings from '../data/openings';
import strategyLessons from '../data/strategyLessons';
import endgameLessons from '../data/endgameLessons';

function getBarColor(value) {
  if (value >= 80) return 'from-correct/80 to-correct';
  if (value >= 50) return 'from-amber/80 to-amber';
  return 'from-incorrect/80 to-incorrect';
}

function BarChart({ data }) {
  const maxVal = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="space-y-3">
      {data.map(d => (
        <div key={d.label} className="flex items-center gap-3">
          <span className="text-xs text-text-dim w-20 sm:w-28 md:w-32 text-right truncate" title={d.label}>{d.label}</span>
          <div className="flex-1 h-6 bg-bg-hover/50 rounded overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${getBarColor(d.value)} rounded progress-fill`}
              style={{ width: `${(d.value / maxVal) * 100}%` }}
            />
          </div>
          <span className={`text-xs font-semibold w-12 tabular-nums ${d.value >= 80 ? 'text-correct' : d.value >= 50 ? 'text-amber' : 'text-incorrect'}`}>{d.value}%</span>
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
    <div className="page-enter max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-display text-gold mb-1">Progress Dashboard</h1>
      <p className="text-text-dim text-base mb-8">Track your chess improvement over time.</p>

      {/* Tactics */}
      <section className="mb-6">
        <h2 className="text-xl font-display mb-4">Tactics Stats</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          {[
            { value: puzzleStats.total, label: 'Puzzles Solved', accent: false },
            { value: `${overallAccuracy}%`, label: 'Accuracy', accent: false },
            { value: streak, label: 'Day Streak', accent: true },
            { value: getDueCount(puzzles.map(p => p.id)), label: 'Due Today', accent: true },
          ].map((s, i) => (
            <div key={i} className={`card-base p-5 text-center card-stagger ${s.accent ? 'accent-border-left' : ''}`}>
              <div className={`text-2xl font-bold stat-animate tabular-nums ${s.accent ? 'text-gold' : ''}`}>{s.value}</div>
              <div className="text-xs text-text-dim mt-1.5 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
        {categoryData.length > 0 && (
          <div className="card-base p-5">
            <h3 className="text-sm text-text-dim mb-4 font-medium">Accuracy by Category</h3>
            <BarChart data={categoryData} />
          </div>
        )}
      </section>

      <hr className="section-divider" />

      {/* Openings */}
      <section className="mb-6">
        <h2 className="text-xl font-display mb-4">Openings Progress</h2>
        <div className="card-base overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-bg-hover text-text-dim text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-3">Opening</th>
                <th className="text-center px-4 py-3">Studied</th>
                <th className="text-center px-4 py-3">Drills</th>
                <th className="text-center px-4 py-3">Accuracy</th>
              </tr>
            </thead>
            <tbody>
              {openings.map(op => {
                const studied = progressService.isLessonComplete('opening', op.id);
                const wStats = openingStats[`${op.id}-white`];
                const bStats = openingStats[`${op.id}-black`];
                const drills = (wStats?.attempts || 0) + (bStats?.attempts || 0);
                const lastAcc = wStats?.lastAccuracy || bStats?.lastAccuracy || null;
                return (
                  <tr key={op.id} className="border-b border-bg-hover/40 hover:bg-bg-hover/30 transition-colors">
                    <td className="px-5 py-2.5 font-medium">{op.name}</td>
                    <td className="px-4 py-2.5 text-center">{studied ? <span className="text-correct">✓</span> : <span className="text-text-dim/30">—</span>}</td>
                    <td className="px-4 py-2.5 text-center tabular-nums">{drills || <span className="text-text-dim/30">—</span>}</td>
                    <td className="px-4 py-2.5 text-center tabular-nums">
                      {lastAcc !== null
                        ? <span className={lastAcc >= 80 ? 'text-correct' : lastAcc >= 50 ? 'text-amber' : 'text-incorrect'}>{lastAcc}%</span>
                        : <span className="text-text-dim/30">—</span>
                      }
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <hr className="section-divider" />

      {/* Strategy & Endgames */}
      <section className="mb-6">
        <h2 className="text-xl font-display mb-4">Strategy & Endgames</h2>
        <div className="space-y-4">
          <ProgressBar value={strategyCompleted.length} max={strategyLessons.length} label="Strategy Lessons" />
          <ProgressBar value={endgameCompleted.length} max={endgameLessons.length} label="Endgame Lessons" />
        </div>
      </section>

      <hr className="section-divider" />

      {/* Visualisation */}
      <section className="mb-6">
        <h2 className="text-xl font-display mb-4">Visualisation Drills</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {['board-vision', 'blindfold', 'piece-counting'].map(type => {
            const s = drillStats[type];
            const label = type.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
            return (
              <div key={type} className="card-base p-5">
                <h4 className="text-sm font-semibold mb-2">{label}</h4>
                {s ? (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs"><span className="text-text-dim">Best Score</span><span className="font-medium">{s.best}</span></div>
                    <div className="flex justify-between text-xs"><span className="text-text-dim">Attempts</span><span className="font-medium">{s.attempts}</span></div>
                    <div className="flex justify-between text-xs"><span className="text-text-dim">Avg Accuracy</span><span className="font-medium">{s.attempts > 0 ? Math.round(s.totalAccuracy / s.attempts) : 0}%</span></div>
                  </div>
                ) : (
                  <p className="text-xs text-text-dim/50">No attempts yet</p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <hr className="section-divider" />

      {/* Recent activity */}
      <section className="mb-6">
        <h2 className="text-xl font-display mb-4">Recent Activity</h2>
        {recentActivity.length === 0 ? (
          <div className="card-base p-8 text-center">
            <div className="text-3xl mb-3 opacity-20">♕</div>
            <p className="text-text-dim text-base">No activity yet. Start learning!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentActivity.map((a, i) => (
              <div key={i} className="card-base px-5 py-3 flex justify-between text-sm card-stagger" style={{ animationDelay: `${i * 30}ms` }}>
                <span className="truncate mr-3">{a.action}</span>
                <span className="text-text-dim text-xs whitespace-nowrap tabular-nums">{new Date(a.date).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Reset */}
      <div className="pt-6 border-t border-bg-hover/50">
        <button onClick={() => setShowReset(true)} className="bg-incorrect/15 text-incorrect border border-incorrect/20 px-5 py-2 rounded-lg text-base hover:bg-incorrect/25 transition-all btn-press">
          Reset All Progress
        </button>
      </div>

      {showReset && (
        <Modal title="Reset All Progress" onClose={() => setShowReset(false)} onConfirm={handleReset} confirmText="Reset Everything" danger>
          <p>This will permanently delete all your progress, puzzle history, annotations, and drill scores. This cannot be undone.</p>
        </Modal>
      )}
    </div>
  );
}
