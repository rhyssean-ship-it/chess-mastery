import puzzles from '../data/lichessPuzzles';

// Build indexes once on module load.
const byTheme = {};
for (const p of puzzles) {
  for (const t of p.themes) {
    if (!byTheme[t]) byTheme[t] = [];
    byTheme[t].push(p);
  }
}
const byRating = [...puzzles].sort((a, b) => a.rating - b.rating);

export const ALL_THEMES = Object.keys(byTheme).sort();

// Curated user-facing theme list with display labels and order.
export const THEME_GROUPS = [
  { key: 'fork', label: 'Forks' },
  { key: 'pin', label: 'Pins' },
  { key: 'skewer', label: 'Skewers' },
  { key: 'discoveredAttack', label: 'Discovered attacks' },
  { key: 'deflection', label: 'Deflection / decoy' },
  { key: 'hangingPiece', label: 'Hanging pieces' },
  { key: 'sacrifice', label: 'Sacrifices' },
  { key: 'backRankMate', label: 'Back-rank mates' },
  { key: 'mateIn1', label: 'Mate in 1' },
  { key: 'mateIn2', label: 'Mate in 2' },
  { key: 'mateIn3', label: 'Mate in 3' },
  { key: 'opening', label: 'Opening tactics' },
  { key: 'middlegame', label: 'Middlegame' },
  { key: 'endgame', label: 'Endgame' },
  { key: 'zugzwang', label: 'Zugzwang' },
].filter(g => byTheme[g.key]?.length > 0);

// Pick n random puzzles, optionally filtered by theme and rating range.
export function pickPuzzles({ theme = null, ratingMin = 0, ratingMax = 3000, maxMoves = 99, n = 1, exclude = new Set() } = {}) {
  let pool = theme ? (byTheme[theme] || []) : puzzles;
  pool = pool.filter(p => p.rating >= ratingMin && p.rating <= ratingMax && p.moves.length <= maxMoves && !exclude.has(p.id));
  // Shuffle with Fisher-Yates and take n
  const copy = pool.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

// Pick the next puzzle nearest to a target rating, biased to within ±150 cp.
export function pickNearRating(targetRating, exclude = new Set(), theme = null) {
  const pool = theme ? (byTheme[theme] || []) : byRating;
  // Find the index whose rating is closest to target
  let bestIdx = 0;
  let bestDelta = Infinity;
  for (let i = 0; i < pool.length; i++) {
    if (exclude.has(pool[i].id)) continue;
    const delta = Math.abs(pool[i].rating - targetRating);
    if (delta < bestDelta) { bestDelta = delta; bestIdx = i; }
  }
  // Take a window around bestIdx and pick randomly to avoid repetition
  const window = pool.slice(Math.max(0, bestIdx - 8), bestIdx + 8).filter(p => !exclude.has(p.id));
  return window[Math.floor(Math.random() * window.length)] || pool[bestIdx];
}

// Elo update for puzzle rush. K depends on whether attacker is well-established.
export function updateRating(currentRating, puzzleRating, success, k = 32) {
  const expected = 1 / (1 + Math.pow(10, (puzzleRating - currentRating) / 400));
  const actual = success ? 1 : 0;
  return Math.round(currentRating + k * (actual - expected));
}

export default puzzles;
