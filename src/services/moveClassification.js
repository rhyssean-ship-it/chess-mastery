// Pure, testable move classification utilities.
// All score inputs are in centipawns from the perspective of the player who just moved.

export const CLASS = {
  BRILLIANT: 'brilliant',
  GREAT: 'great',
  BEST: 'best',
  EXCELLENT: 'excellent',
  GOOD: 'good',
  BOOK: 'book',
  INACCURACY: 'inaccuracy',
  MISTAKE: 'mistake',
  BLUNDER: 'blunder',
  MISS: 'miss',
  FORCED: 'forced',
};

export const CLASS_META = {
  [CLASS.BRILLIANT]:  { label: 'Brilliant',   symbol: '!!', color: 'text-cyan-400',   bg: 'bg-cyan-400/15',   ring: 'ring-cyan-400/30' },
  [CLASS.GREAT]:      { label: 'Great',       symbol: '!',  color: 'text-blue-400',   bg: 'bg-blue-400/15',   ring: 'ring-blue-400/30' },
  [CLASS.BEST]:       { label: 'Best',        symbol: '★', color: 'text-correct',    bg: 'bg-correct/15',    ring: 'ring-correct/30' },
  [CLASS.EXCELLENT]:  { label: 'Excellent',   symbol: '◆', color: 'text-correct/80', bg: 'bg-correct/10',    ring: 'ring-correct/20' },
  [CLASS.GOOD]:       { label: 'Good',        symbol: '·', color: 'text-text',       bg: 'bg-bg-hover/40',   ring: 'ring-bg-hover' },
  [CLASS.BOOK]:       { label: 'Book',        symbol: '⨂', color: 'text-gold',       bg: 'bg-gold/10',       ring: 'ring-gold/30' },
  [CLASS.INACCURACY]: { label: 'Inaccuracy',  symbol: '?!', color: 'text-amber',      bg: 'bg-amber/10',      ring: 'ring-amber/30' },
  [CLASS.MISTAKE]:    { label: 'Mistake',     symbol: '?',  color: 'text-orange-400', bg: 'bg-orange-400/15', ring: 'ring-orange-400/30' },
  [CLASS.BLUNDER]:    { label: 'Blunder',     symbol: '??', color: 'text-incorrect',  bg: 'bg-incorrect/15',  ring: 'ring-incorrect/30' },
  [CLASS.MISS]:       { label: 'Miss',        symbol: '×', color: 'text-incorrect/80', bg: 'bg-incorrect/10', ring: 'ring-incorrect/20' },
  [CLASS.FORCED]:     { label: 'Forced',      symbol: '=',  color: 'text-text-dim',   bg: 'bg-bg-hover/40',   ring: 'ring-bg-hover' },
};

// Cap mate scores so arithmetic stays sane. 1000cp = "winning" range; mate gets ~10000cp.
const MATE_SCORE = 10000;

// Convert an engine analysis result to a centipawn score from a fixed POV.
// The engine returns score from the side-to-move POV. Pass `flip=true` when
// the side to move is the OPPONENT of the player you care about.
export function toCpScore(analysis, flip = false) {
  if (!analysis) return 0;
  let cp;
  if (analysis.mate != null) {
    // Mate in N. Positive mate = good for side to move. Smaller |N| = stronger.
    const sign = analysis.mate > 0 ? 1 : -1;
    cp = sign * (MATE_SCORE - Math.abs(analysis.mate) * 10);
  } else if (analysis.scoreCp != null) {
    cp = analysis.scoreCp;
  } else {
    cp = 0;
  }
  return flip ? -cp : cp;
}

// Lichess win-percentage formula: maps centipawn eval to expected win % (0-100).
export function winPercent(cp) {
  const clamped = Math.max(-1000, Math.min(1000, cp));
  return 50 + 50 * (2 / (1 + Math.exp(-0.00368208 * clamped)) - 1);
}

// Per-move accuracy (Lichess): how close the move kept the player to optimal.
// winPercentDrop must be from the player's POV (positive = position got worse).
export function moveAccuracy(winPercentDrop) {
  const drop = Math.max(0, winPercentDrop);
  const raw = 103.1668 * Math.exp(-0.04354 * drop) - 3.1669;
  return Math.max(0, Math.min(100, raw));
}

// Arithmetic mean accuracy across all of a player's moves.
export function aggregateAccuracy(perMoveAccuracies) {
  if (!perMoveAccuracies.length) return null;
  const sum = perMoveAccuracies.reduce((a, b) => a + b, 0);
  return sum / perMoveAccuracies.length;
}

// Classify a move given pre/post evals (both from the moving player's POV in centipawns).
// `opts` enables Phase 4 features when supplied.
export function classifyMove({
  cpBefore,
  cpAfter,
  isBest,
  isOnlyMove,             // only one legal move → forced
  isBookMove = false,     // matches an opening database move
  secondBestCpGap = null, // best - second-best, from player POV (>=0)
  isSacrifice = false,    // moved a piece into a lower-or-equal-valued attacker's range
} = {}) {
  if (isBookMove) return CLASS.BOOK;
  if (isOnlyMove) return CLASS.FORCED;

  const cpl = Math.max(0, cpBefore - cpAfter);
  const wpBefore = winPercent(cpBefore);
  const wpAfter = winPercent(cpAfter);
  const wpDrop = Math.max(0, wpBefore - wpAfter);

  // Winning → losing transitions get an automatic blunder upgrade
  const crossedZero = cpBefore > 100 && cpAfter < -100;

  // Severity by win-percent drop (closer to how Lichess and Chess.com feel)
  if (crossedZero || wpDrop >= 20) return CLASS.BLUNDER;
  if (wpDrop >= 10) return CLASS.MISTAKE;
  if (wpDrop >= 5) return CLASS.INACCURACY;

  // From here the move is at worst "good". Promote when best / brilliant / great.
  if (isBest) {
    if (isSacrifice && cpAfter >= 0) return CLASS.BRILLIANT;
    if (secondBestCpGap != null && secondBestCpGap >= 150) return CLASS.GREAT;
    return CLASS.BEST;
  }
  if (cpl <= 25) return CLASS.EXCELLENT;
  return CLASS.GOOD;
}

// Summary counts per side.
export function summarize(analyses) {
  const init = () => ({
    [CLASS.BRILLIANT]: 0, [CLASS.GREAT]: 0, [CLASS.BEST]: 0, [CLASS.EXCELLENT]: 0,
    [CLASS.GOOD]: 0, [CLASS.BOOK]: 0, [CLASS.INACCURACY]: 0, [CLASS.MISTAKE]: 0,
    [CLASS.BLUNDER]: 0, [CLASS.MISS]: 0, [CLASS.FORCED]: 0,
    accuracy: null, _accuracies: [],
  });
  const white = init();
  const black = init();

  for (const a of analyses) {
    if (!a || !a.classification) continue;
    const bucket = a.color === 'white' ? white : black;
    bucket[a.classification]++;
    if (a.moveAccuracy != null && a.classification !== CLASS.BOOK && a.classification !== CLASS.FORCED) {
      bucket._accuracies.push(a.moveAccuracy);
    }
  }
  white.accuracy = aggregateAccuracy(white._accuracies);
  black.accuracy = aggregateAccuracy(black._accuracies);
  delete white._accuracies; delete black._accuracies;
  return { white, black };
}
