// Persists mistakes/blunders from game analyses as solvable puzzles.

const STORE_KEY = 'chess-mastery:mistakes';
const MAX_ENTRIES = 200;

function load() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY)) || []; } catch { return []; }
}
function save(entries) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(entries.slice(0, MAX_ENTRIES)));
  } catch { /* quota exceeded or storage unavailable — skip rather than crash the analysis flow */ }
}

// Insert a mistake derived from a GameAnalysis entry.
// `analysis` is one item from gameAnalysisService.analyses[].
export function saveMistake(analysis, context = {}) {
  if (!analysis?.bestMove || !analysis?.fenBefore) return false;
  const entries = load();
  const id = `${analysis.fenBefore}|${analysis.bestMove}`;
  if (entries.some(e => e.id === id)) return false; // already stored
  entries.unshift({
    id,
    fen: analysis.fenBefore,
    solution: [analysis.bestMove],          // PuzzleSolver consumes UCI moves
    moves: [analysis.bestMove],             // alias for Lichess-style schema
    youPlayed: analysis.san,
    bestMoveSan: analysis.bestMoveSan,
    classification: analysis.classification,
    cpl: analysis.cpl,
    color: analysis.color,
    context,                                // { label, result, date }
    savedAt: Date.now(),
    timesAttempted: 0,
    timesSolved: 0,
    nextReview: Date.now(),
    interval: 1,
  });
  save(entries);
  return true;
}

// Bulk-save mistakes/blunders from an analysis result.
export function saveAnalysisMistakes(analyses, context = {}) {
  let added = 0;
  for (const a of analyses) {
    if (a.classification === 'mistake' || a.classification === 'blunder') {
      if (saveMistake(a, context)) added++;
    }
  }
  return added;
}

export function listMistakes() { return load(); }

// Mark attempt; success extends SM-2-like interval, failure resets.
export function recordAttempt(id, success) {
  const entries = load();
  const idx = entries.findIndex(e => e.id === id);
  if (idx === -1) return;
  const e = entries[idx];
  e.timesAttempted++;
  if (success) {
    e.timesSolved++;
    e.interval = Math.min(e.interval * 2.2, 60);
  } else {
    e.interval = 1;
  }
  e.nextReview = Date.now() + e.interval * 24 * 60 * 60 * 1000;
  entries[idx] = e;
  save(entries);
}

export function deleteMistake(id) {
  save(load().filter(e => e.id !== id));
}

export function dueCount() {
  const now = Date.now();
  return load().filter(e => e.nextReview <= now).length;
}
