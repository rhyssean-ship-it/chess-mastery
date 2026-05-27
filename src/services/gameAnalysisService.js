import { Chess } from 'chess.js';
import StockfishService from './stockfishService';
import openings from '../data/openings';
import {
  CLASS,
  classifyMove,
  toCpScore,
  winPercent,
  moveAccuracy,
  summarize,
} from './moveClassification';

const PIECE_VALUE = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 100 };
const STARTING_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

// Pre-compute SAN sequences for every opening so book detection is a single Set lookup.
function buildBookIndex() {
  const seqs = new Set();
  for (const op of openings) {
    let key = '';
    for (const move of op.moves) {
      key = key ? `${key} ${move.move}` : move.move;
      seqs.add(key);
    }
  }
  return seqs;
}
const BOOK_INDEX = buildBookIndex();

function isBookSequence(sanSeq) {
  return BOOK_INDEX.has(sanSeq.join(' '));
}

// Coarse "Brilliant" sacrifice heuristic.
function isPieceSacrificed(fenAfter, square) {
  const g = new Chess(fenAfter);
  const piece = g.get(square);
  if (!piece) return false;
  const attackers = g.moves({ verbose: true }).filter(m => m.to === square && m.captured);
  if (!attackers.length) return false;
  const movedValue = PIECE_VALUE[piece.type];
  return attackers.some(a => PIECE_VALUE[a.piece] < movedValue);
}

export function replayMoves(history, startingFen = STARTING_FEN) {
  const plies = [];
  const game = new Chess(startingFen);
  for (const entry of history) {
    const fenBefore = game.fen();
    const san = entry.san || entry.move?.san;
    const move = game.move(san);
    if (!move) break;
    plies.push({
      color: move.color === 'w' ? 'white' : 'black',
      fenBefore,
      fenAfter: game.fen(),
      san: move.san,
      uci: move.from + move.to + (move.promotion || ''),
      from: move.from,
      to: move.to,
    });
  }
  return plies;
}

// Build a fully-classified analysis object for one ply from raw engine outputs.
function buildAnalysis(ply, plyIdx, before, after, isBookMove) {
  if (!before || !after) return null;

  const cpBefore = toCpScore(before, false);   // engine reports STM POV = mover's POV
  const cpAfter = toCpScore(after, true);      // engine reports opponent POV after; flip

  let secondBestCpGap = null;
  if (before?.lines?.length >= 2) {
    const top = before.lines.find(l => l.multipv === 1);
    const second = before.lines.find(l => l.multipv === 2);
    if (top && second) {
      secondBestCpGap = toCpScore(top, false) - toCpScore(second, false);
    }
  }

  const isBest = before?.bestMove && before.bestMove === ply.uci;
  const isOnlyMove = new Chess(ply.fenBefore).moves().length === 1;
  const isSacrifice = isBest ? isPieceSacrificed(ply.fenAfter, ply.to) : false;

  const classification = classifyMove({
    cpBefore, cpAfter, isBest, isOnlyMove, isBookMove, secondBestCpGap, isSacrifice,
  });

  const wpDrop = Math.max(0, winPercent(cpBefore) - winPercent(cpAfter));
  const acc = moveAccuracy(wpDrop);

  let bestSan = null;
  if (before?.bestMove) {
    try {
      const g = new Chess(ply.fenBefore);
      const m = g.move({
        from: before.bestMove.slice(0, 2),
        to: before.bestMove.slice(2, 4),
        promotion: before.bestMove[4] || undefined,
      });
      if (m) bestSan = m.san;
    } catch { /* invalid bestMove — leave null */ }
  }

  return {
    ply: plyIdx,
    color: ply.color,
    san: ply.san,
    uci: ply.uci,
    fenBefore: ply.fenBefore,
    fenAfter: ply.fenAfter,
    from: ply.from,
    to: ply.to,
    cpBefore,
    cpAfter,
    cpl: Math.max(0, cpBefore - cpAfter),
    wpBefore: winPercent(cpBefore),
    wpAfter: winPercent(cpAfter),
    moveAccuracy: acc,
    classification,
    isBest,
    bestMove: before?.bestMove || null,
    bestMoveSan: bestSan,
    bestMovePv: before?.pv || [],
    secondBestCpGap,
    preliminary: false,
  };
}

// Worker pool: spin up N Stockfish engines in parallel.
async function initPool(size, shouldAbort) {
  const workers = await Promise.all(
    Array.from({ length: size }, async () => {
      const w = new StockfishService();
      await w.init();
      return w;
    })
  );
  if (shouldAbort()) {
    workers.forEach(w => w.destroy());
    throw new Error('aborted');
  }
  return workers;
}

// Distribute tasks across workers; each worker pulls the next task when free.
async function runPool(workers, tasks, runTask, onTaskComplete, shouldAbort) {
  let nextIdx = 0;
  await Promise.all(workers.map(async (w) => {
    while (true) {
      if (shouldAbort()) return;
      const idx = nextIdx++;
      if (idx >= tasks.length) return;
      const result = await runTask(w, tasks[idx]);
      if (shouldAbort()) return;
      onTaskComplete(idx, tasks[idx], result);
    }
  }));
}

// Pre-compute book-move flags sequentially (only consecutive opening moves from move 1 count).
function computeBookFlags(plies) {
  const flags = new Array(plies.length).fill(false);
  const seq = [];
  let stillBook = true;
  for (let i = 0; i < plies.length; i++) {
    seq.push(plies[i].san);
    if (stillBook) {
      if (isBookSequence(seq)) flags[i] = true;
      else stillBook = false;
    }
  }
  return flags;
}

export async function analyzeGame({
  history,
  startingFen = STARTING_FEN,
  poolSize,
  pass1Depth = 10,
  pass2Depth = 16,
  multiPv = 2,
  onProgress = () => {},
  onMoveAnalyzed = () => {},
  shouldAbort = () => false,
} = {}) {
  const plies = replayMoves(history, startingFen);
  const fens = [startingFen, ...plies.map(p => p.fenAfter)];
  const bookFlags = computeBookFlags(plies);

  // Cap pool size to CPU cores; minimum 1.
  const resolvedPoolSize = Math.max(1, Math.min(
    poolSize ?? Math.min(4, (typeof navigator !== 'undefined' && navigator.hardwareConcurrency) || 4),
    4
  ));

  const workers = await initPool(resolvedPoolSize, shouldAbort);
  const rawAnalyses = new Array(fens.length);
  const positionDone = new Array(fens.length).fill(false);
  const lastEmitted = new Array(plies.length).fill(null); // last emitted classification per ply

  function emitPly(plyIdx, preliminary) {
    if (plyIdx < 0 || plyIdx >= plies.length) return;
    if (!positionDone[plyIdx] || !positionDone[plyIdx + 1]) return;
    const analysis = buildAnalysis(
      plies[plyIdx], plyIdx,
      rawAnalyses[plyIdx], rawAnalyses[plyIdx + 1],
      bookFlags[plyIdx]
    );
    if (!analysis) return;
    analysis.preliminary = preliminary;
    // Skip emit if we've already emitted final for this ply and this would be preliminary
    if (lastEmitted[plyIdx] === 'final' && preliminary) return;
    lastEmitted[plyIdx] = preliminary ? 'preliminary' : 'final';
    onMoveAnalyzed(analysis);
  }

  try {
    // ---- Pass 1: shallow eval (depth 10, MultiPV 1) on every position ----
    const pass1Tasks = fens.map((fen, idx) => ({ fen, idx }));
    let pass1Done = 0;
    await runPool(workers, pass1Tasks,
      (w, task) => w.analyzePosition(task.fen, { depth: pass1Depth, multiPv: 1 }),
      (_, task, result) => {
        rawAnalyses[task.idx] = result;
        positionDone[task.idx] = true;
        pass1Done++;
        onProgress(pass1Done, pass1Tasks.length, 'pass1');
        // Try emit the ply that ends here, and the ply that starts here
        emitPly(task.idx - 1, true);
        emitPly(task.idx, true);
      },
      shouldAbort
    );
    if (shouldAbort()) throw new Error('aborted');

    // ---- Identify positions needing deeper analysis ----
    // A position needs pass 2 if the player's move from it was the engine's pass-1 best move
    // (so we need MultiPV=2 to distinguish Best vs Great vs Brilliant).
    // We refine the BEFORE position of those plies.
    const refinePositionIdxs = new Set();
    for (let i = 0; i < plies.length; i++) {
      if (bookFlags[i]) continue;
      const before = rawAnalyses[i];
      if (before?.bestMove && before.bestMove === plies[i].uci) {
        refinePositionIdxs.add(i);
      }
    }
    const pass2Tasks = Array.from(refinePositionIdxs).map(posIdx => ({
      fen: fens[posIdx], posIdx,
    }));

    // Mark plies that don't need refinement as final now
    for (let i = 0; i < plies.length; i++) {
      const needsRefine = refinePositionIdxs.has(i) || refinePositionIdxs.has(i + 1);
      if (!needsRefine) emitPly(i, false);
    }

    // ---- Pass 2: deeper eval with MultiPV on flagged positions ----
    if (pass2Tasks.length > 0 && multiPv > 1) {
      let pass2Done = 0;
      await runPool(workers, pass2Tasks,
        (w, task) => w.analyzePosition(task.fen, { depth: pass2Depth, multiPv }),
        (_, task, result) => {
          rawAnalyses[task.posIdx] = result;
          pass2Done++;
          onProgress(pass2Done, pass2Tasks.length, 'pass2');
          // This position is `before` for ply task.posIdx and `after` for ply task.posIdx - 1
          emitPly(task.posIdx, false);
          emitPly(task.posIdx - 1, false);
        },
        shouldAbort
      );
    }

    if (shouldAbort()) throw new Error('aborted');

    // Final emit for any ply still marked preliminary (defensive)
    const analyses = [];
    for (let i = 0; i < plies.length; i++) {
      if (lastEmitted[i] !== 'final') emitPly(i, false);
      const a = buildAnalysis(plies[i], i, rawAnalyses[i], rawAnalyses[i + 1], bookFlags[i]);
      if (a) analyses.push(a);
    }

    return { analyses, summary: summarize(analyses) };
  } finally {
    workers.forEach(w => w.destroy());
  }
}

export { CLASS };
