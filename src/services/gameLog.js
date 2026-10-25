// One small row per analysed game, so the blunder trend outlives the 10 full reviews that
// savedGames keeps. Rows: { at, label, color, moves, blunders, mistakes, steps: {spy,scan,safe} }

import { listSavedGames } from './savedGames';

const KEY = 'chess-mastery:gameLog';
const MAX = 100;

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; }
}
function save(rows) {
  try { localStorage.setItem(KEY, JSON.stringify(rows.slice(-MAX))); } catch { /* storage unavailable */ }
}

function summarise(analyses, playerColor) {
  const mine = analyses.filter(a => a && a.color === playerColor);
  const steps = { spy: 0, scan: 0, safe: 0 };
  for (const a of mine) if (a.failedStep && steps[a.failedStep] != null) steps[a.failedStep]++;
  return {
    moves: mine.length,
    blunders: mine.filter(a => a.classification === 'blunder').length,
    mistakes: mine.filter(a => a.classification === 'mistake').length,
    steps,
  };
}

export function recordGame({ label, playerColor, analyses, at = Date.now() }) {
  const rows = listGames();
  rows.push({ at, label, color: playerColor, ...summarise(analyses, playerColor) });
  save(rows);
}

// Oldest first. Seeded from saved reviews the first time it's read.
export function listGames() {
  const rows = load();
  if (rows) return rows;
  const seeded = listSavedGames()
    .map(g => ({ at: g.savedAt || g.date || 0, label: g.label, color: g.playerColor, ...summarise(g.analyses || [], g.playerColor) }))
    .sort((a, b) => a.at - b.at);
  save(seeded);
  return seeded;
}

const avg = (rows, key) => (rows.length ? rows.reduce((s, r) => s + r[key], 0) / rows.length : null);

// Recent average vs the five games before it. `trend` < 0 means fewer blunders (good).
export function blunderTrend() {
  const rows = listGames();
  const last5 = rows.slice(-5);
  const prev5 = rows.slice(-10, -5);
  const recent = avg(last5, 'blunders');
  const before = avg(prev5, 'blunders');
  const steps = { spy: 0, scan: 0, safe: 0 };
  for (const r of rows.slice(-10)) for (const k of Object.keys(steps)) steps[k] += r.steps?.[k] || 0;
  return { rows, recent, before, trend: recent != null && before != null ? recent - before : null, steps };
}
