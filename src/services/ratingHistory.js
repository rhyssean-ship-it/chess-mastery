// Your enPassant rating: Elo from rated games vs the computer (no hints, takebacks or coach).
// Bot strengths are the preset labels, so this is relative to the bots, not a FIDE/online rating.
// Rows: { at, botElo, botLabel, score: 1|0.5|0, result, before, after }

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

export function recordRatedGame({ botElo, botLabel, score, result, at = Date.now() }) {
  const rows = load();
  const before = rows.length ? rows[rows.length - 1].after : START_RATING;
  const after = Math.max(FLOOR, before + ratingChange(before, botElo, score, rows.length));
  const row = { at, botElo, botLabel, score, result, before, after };
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
