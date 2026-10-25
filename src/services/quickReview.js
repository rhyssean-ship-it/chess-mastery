// The short review after a rated game: a fast analysis, then the two or three moves that cost
// the most, saved to My Mistakes and the blunder trend like a full review would.

import { analyzeGame } from './gameAnalysisService';
import { saveAnalysisMistakes } from './mistakeStore';
import { recordGame } from './gameLog';
import { saveAnalysedGame } from './savedGames';

const COSTLY = new Set(['blunder', 'mistake', 'miss']);

// Your moves that lost the most winning chances. Falls back to inaccuracies for a clean game.
export function costliestMoments(analyses, playerColor, n = 3) {
  const mine = analyses.filter(a => a && a.color === playerColor && a.bestMove && a.bestMove !== a.uci);
  const drop = a => (a.wpBefore ?? 0) - (a.wpAfter ?? 0);
  let picked = mine.filter(a => COSTLY.has(a.classification));
  const minor = !picked.length;
  if (minor) picked = mine.filter(a => a.classification === 'inaccuracy');
  return {
    minor,
    moments: picked.sort((a, b) => drop(b) - drop(a)).slice(0, n).sort((a, b) => a.ply - b.ply),
  };
}

export function tallyReview(analyses, playerColor) {
  const mine = analyses.filter(a => a && a.color === playerColor);
  const steps = { spy: 0, scan: 0, safe: 0 };
  for (const a of mine) if (a.failedStep && steps[a.failedStep] != null) steps[a.failedStep]++;
  return {
    blunders: mine.filter(a => a.classification === 'blunder').length,
    mistakes: mine.filter(a => a.classification === 'mistake').length,
    steps,
  };
}

// Shallower than Game Analysis (depth 14 on flagged moves) so it's ready in seconds.
export async function runQuickReview({ history, startingFen, playerColor, label, result, shouldAbort, onProgress }) {
  const { analyses, summary } = await analyzeGame({
    history, startingFen, pass1Depth: 10, pass2Depth: 14, shouldAbort,
    onProgress: (current, total, phase) => onProgress?.(phase === 'pass1' ? current / total * 0.7 : 0.7 + current / total * 0.3),
  });
  const mistakesSaved = saveAnalysisMistakes(analyses, { label, result, date: Date.now(), playerColor });
  recordGame({ label, playerColor, analyses });
  saveAnalysedGame({ label, result, playerColor, startingFen, history, summary, analyses });
  return { analyses, summary, mistakesSaved, ...costliestMoments(analyses, playerColor) };
}
