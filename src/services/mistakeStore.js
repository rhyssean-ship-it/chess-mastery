// Persists mistakes/blunders from game analyses as solvable puzzles.

import { Chess } from 'chess.js';
import { failedStep } from './spyScanSafe';

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
export function saveMistake(analysis, context = {}, prev = null) {
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
    failedStep: analysis.failedStep || null, // spy | scan | safe
    prevFen: prev?.fenBefore || null,        // before the opponent's last move (for Spy's "Shift")
    lastMove: prev ? [prev.from, prev.to] : null,
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

// Bulk-save mistakes/blunders from an analysis result. With context.playerColor set, only the
// player's own mistakes are saved (not the engine's or the opponent's).
export function saveAnalysisMistakes(analyses, context = {}) {
  let added = 0;
  analyses.forEach((a, i) => {
    if (!a || (context.playerColor && a.color !== context.playerColor)) return;
    if (a.classification === 'mistake' || a.classification === 'blunder') {
      if (saveMistake(a, context, analyses[i - 1])) added++;
    }
  });
  return added;
}

// Entries saved before Spy, Scan, Safe tagging existed get tagged lazily, a few per call so
// no single page load pays for the whole backlog.
const BACKFILL_PER_CALL = 25;
function backfillSteps(entries) {
  let changed = 0;
  for (const e of entries) {
    if (e.failedStep !== undefined || changed >= BACKFILL_PER_CALL) continue;
    let step = null;
    try {
      const m = new Chess(e.fen).move(e.youPlayed);
      step = failedStep({ fenBefore: e.fen, uci: m.from + m.to + (m.promotion || ''), classification: e.classification, bestMove: e.solution?.[0] });
    } catch { /* unparseable entry — leave untagged */ }
    e.failedStep = step;
    changed++;
  }
  if (changed) save(entries);
  return entries;
}

export function listMistakes() { return backfillSteps(load()); }

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
