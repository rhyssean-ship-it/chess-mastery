// Your enPassant rating: Elo from rated games vs the computer (no hints, takebacks or coach).
// Bot strengths are the preset labels, so this is relative to the bots, not a FIDE/online rating.
// Rows: { at, botId?, botElo, botLabel, score: 1|0.5|0, result, before, after, review? }
// review (added after the quick post-game review): { blunders, mistakes, steps: { spy, scan, safe } }

import { localDateKey } from '../utils/dateKey';

const KEY = 'chess-mastery:ratingHistory';
const MAX = 500;
export const START_RATING = 400;
export const PROVISIONAL_GAMES = 15;
const FLOOR = 100;

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
}
function save(rows) {
  try { localStorage.setItem(KEY, JSON.stringify(rows.slice(-MAX))); } catch { /* storage unavailable */ }
}

// Oldest first.
export function listRatedGames() {
  return load();
}

export function currentRating() {
  const rows = load();
  return rows.length ? rows[rows.length - 1].after : START_RATING;
}

// Expected score vs a bot of `botElo`, then a K that settles after the provisional games.
export function ratingChange(rating, botElo, score, gamesPlayed) {
  const expected = 1 / (1 + 10 ** ((botElo - rating) / 400));
  const k = gamesPlayed < PROVISIONAL_GAMES ? 40 : 24;
  return Math.round(k * (score - expected));
}

export function recordRatedGame({ botId = null, botElo, botLabel, score, result, at = Date.now() }) {
  const rows = load();
  const before = rows.length ? rows[rows.length - 1].after : START_RATING;
  const after = Math.max(FLOOR, before + ratingChange(before, botElo, score, rows.length));
  const row = { at, botId, botElo, botLabel, score, result, before, after };
  rows.push(row);
  save(rows);
  return row;
}

export function ratingSummary() {
  const rows = load();
  const rating = rows.length ? rows[rows.length - 1].after : START_RATING;
  const weekAgo = Date.now() - 7 * 86400000;
  const firstThisWeek = rows.find(r => r.at >= weekAgo);
  return {
    rows,
    rating,
    games: rows.length,
    provisional: rows.length < PROVISIONAL_GAMES,
    weekDelta: firstThisWeek ? rating - firstThisWeek.before : null,
    best: rows.reduce((m, r) => Math.max(m, r.after), START_RATING),
    record: {
      wins: rows.filter(r => r.score === 1).length,
      draws: rows.filter(r => r.score === 0.5).length,
      losses: rows.filter(r => r.score === 0).length,
    },
  };
}

// Attach the quick review's tally to the rated game recorded at `at`.
export function annotateRatedGame(at, review) {
  const rows = load();
  const row = rows.find(r => r.at === at);
  if (!row) return;
  row.review = review;
  save(rows);
}

// Persona ids you've beaten at least once.
export function beatenPersonaIds() {
  return new Set(load().filter(r => r.score === 1 && r.botId).map(r => r.botId));
}

export function ratedGamesToday() {
  const today = localDateKey();
  return load().filter(r => localDateKey(new Date(r.at)) === today).length;
}

// The last seven days: games, rating change, and where the losses broke down. Each reviewed loss
// is put down to the Spy, Scan, Safe step its mistakes broke most; big mistakes with no step tag
// count as 'mistakes', and losses with no big mistake as 'outplayed'.
export function weeklySummary() {
  const rows = load();
  const weekAgo = Date.now() - 7 * 86400000;
  const week = rows.filter(r => r.at >= weekAgo);
  const losses = week.filter(r => r.score === 0);
  const causes = { spy: 0, scan: 0, safe: 0, mistakes: 0, outplayed: 0 };
  let reviewedLosses = 0;
  for (const r of losses) {
    if (!r.review) continue;
    reviewedLosses++;
    const st = r.review.steps || {};
    const top = ['spy', 'scan', 'safe'].sort((a, b) => (st[b] || 0) - (st[a] || 0))[0];
    const big = (r.review.blunders || 0) + (r.review.mistakes || 0);
    causes[(st[top] || 0) > 0 ? top : big > 0 ? 'mistakes' : 'outplayed']++;
  }
  const mainCause = reviewedLosses
    ? Object.keys(causes).sort((a, b) => causes[b] - causes[a])[0]
    : null;
  return {
    games: week.length,
    delta: week.length ? week[week.length - 1].after - week[0].before : 0,
    wins: week.filter(r => r.score === 1).length,
    losses: losses.length,
    reviewedLosses,
    causes,
    mainCause,
  };
}

export const CAUSE_TEXT = {
  spy: 'you missed what your opponent was threatening',
  scan: 'you missed a check, capture or tactic',
  safe: 'your move hung something or allowed a tactic',
  mistakes: 'of a big mistake (a blunder or a weakening move)',
  outplayed: 'you were simply outplayed, with no single big mistake',
};

// One sentence on the week, and where the losses came from (from the quick reviews).
export function weeklyLine(w = weeklySummary()) {
  if (!w.games) return null;
  const head = `${w.games} rated game${w.games === 1 ? '' : 's'} this week, ${w.delta >= 0 ? '+' : ''}${w.delta}.`;
  if (!w.mainCause || !w.losses) return head;
  const n = w.causes[w.mainCause];
  return `${head} ${n} of ${w.reviewedLosses} reviewed loss${w.reviewedLosses === 1 ? '' : 'es'} came because ${CAUSE_TEXT[w.mainCause]}.`;
}
