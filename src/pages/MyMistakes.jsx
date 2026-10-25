import { useState, useEffect } from 'react';
import { listMistakes, recordAttempt, deleteMistake } from '../services/mistakeStore';
import PuzzleSolver from '../components/PuzzleSolver';
import EmptyState from '../components/EmptyState';
import { CLASS_META } from '../services/moveClassification';
import { STEP_META } from '../services/spyScanSafe';

export default function MyMistakes() {
  const [entries, setEntries] = useState([]);
  const [filter, setFilter] = useState('due'); // due | all | blunder | mistake
  const [activeId, setActiveId] = useState(null);

  function refresh() { setEntries(listMistakes()); }
  useEffect(refresh, []);

  const now = Date.now();
  const filtered = entries.filter(e => {
    if (filter === 'due') return e.nextReview <= now;
    if (filter === 'blunder') return e.classification === 'blunder';
    if (filter === 'mistake') return e.classification === 'mistake';
    return true;
  });

  const active = filtered.find(e => e.id === activeId) || filtered[0];

  function handleSolved() {
    if (!active) return;
    recordAttempt(active.id, true);
    refresh();
    const idx = filtered.findIndex(e => e.id === active.id);
    const next = filtered[idx + 1];
    setTimeout(() => setActiveId(next?.id || null), 800);
  }
  function handleFailed() {
    if (!active) return;
    recordAttempt(active.id, false);
    refresh();
  }
  function handleDelete(id) {
    deleteMistake(id);
    refresh();
    if (activeId === id) setActiveId(null);
  }

  if (entries.length === 0) {
    return (
      <div className="page page-narrow">
        <h1 className="text-2xl sm:text-3xl font-display mb-1">My Mistakes</h1>
        <EmptyState
          icon="?"
          title="No saved mistakes yet"
          body="Your blunders and mistakes from analysed games will appear here as solvable puzzles. Play a game, then tap Analyse on the end screen."
          ctaLabel="Play a game"
          ctaTo="/play"
        />
      </div>
    );
  }

  const dueCount = entries.filter(e => e.nextReview <= now).length;

  return (
    <div className="page-enter max-w-6xl mx-auto px-4 sm:px-6 py-6 lg:py-10">
      <div className="flex flex-wrap items-baseline justify-between gap-3 mb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display">My Mistakes</h1>
          <p className="text-text-dim text-sm">
            {entries.length} saved, <span className="text-gold font-medium">{dueCount} due</span> for review.
          </p>
        </div>
        <div className="flex rounded-lg bg-bg-card border border-bg-hover overflow-hidden text-xs">
          {[{ id: 'due', label: 'Due' }, { id: 'all', label: 'All' }, { id: 'blunder', label: 'Blunders' }, { id: 'mistake', label: 'Mistakes' }].map(f => (
            <button
              key={f.id}
              onClick={() => { setFilter(f.id); setActiveId(null); }}
              className={`px-3 py-1.5 transition-all ${filter === f.id ? 'bg-gold text-bg' : 'text-text-dim hover:text-text'}`}
            >{f.label}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        <div className="mx-auto w-full max-w-[560px]">
          {active ? (
            <>
              <PuzzleSolver key={active.id} puzzle={active} onSolved={handleSolved} onFailed={handleFailed} />
              <div className="mt-3 card-base p-4">
                <div className="text-xs text-text-dim mb-2">You played: <span className="text-incorrect font-semibold">{active.youPlayed}</span></div>
                <div className="text-xs text-text-dim">Find the engine's recommended move.</div>
                {active.failedStep && (
                  <div className="text-xs mt-2">
                    <span className={`font-semibold ${STEP_META[active.failedStep].color}`}>Missed at {STEP_META[active.failedStep].label}:</span>{' '}
                    <span className="text-text-dim">{STEP_META[active.failedStep].blurb.toLowerCase()}.</span>
                  </div>
                )}
                {active.context?.label && <div className="text-[11px] text-text-dim mt-2 italic">From: {active.context.label}</div>}
              </div>
            </>
          ) : (
            <div className="text-center text-text-dim py-12">
              Nothing due right now — switch to <button className="text-gold hover:underline" onClick={() => setFilter('all')}>All</button> to review anyway.
            </div>
          )}
        </div>

        <div className="space-y-2 max-h-[600px] overflow-y-auto">
          {filtered.map(e => {
            const meta = CLASS_META[e.classification];
            const isActive = active?.id === e.id;
            return (
              <button
                key={e.id}
                onClick={() => setActiveId(e.id)}
                className={`w-full text-left card-base p-3 transition-all flex justify-between items-center gap-2 ${isActive ? 'border-gold ring-1 ring-gold/20' : ''}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className={`text-base font-bold ${meta?.color}`}>{meta?.symbol}</span>
                    <span className="text-sm font-medium">{e.youPlayed}</span>
                    <span className="text-text-dim text-xs">→ {e.bestMoveSan}</span>
                  </div>
                  <div className="text-[10px] text-text-dim mt-0.5">
                    {e.timesSolved}/{e.timesAttempted} solved · CPL {Math.round(e.cpl)}
                    {e.failedStep && <> · <span className={STEP_META[e.failedStep].color}>{STEP_META[e.failedStep].label}</span></>}
                  </div>
                </div>
                <button
                  onClick={(ev) => { ev.stopPropagation(); handleDelete(e.id); }}
                  className="text-text-dim hover:text-incorrect px-2 text-sm"
                  aria-label="Delete"
                >×</button>
              </button>
            );
          })}
          {filtered.length === 0 && <div className="text-center text-text-dim text-sm py-8">No entries match this filter.</div>}
        </div>
      </div>
    </div>
  );
}
