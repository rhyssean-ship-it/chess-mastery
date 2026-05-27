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

// Detect if a piece on `square` (in the FEN after the move) is attacked by an
// opponent piece of LOWER value — i.e., the player apparently gave up material.
// Used as a coarse "Brilliant" sacrifice heuristic.
function isPieceSacrificed(fenAfter, square) {
  const g = new Chess(fenAfter);
  const piece = g.get(square);
  if (!piece) return false;
  // Opponent is now to move. List their captures landing on `square`.
  const attackers = g.moves({ verbose: true }).filter(m => m.to === square && m.captured);
  if (!attackers.length) return false;
  const movedValue = PIECE_VALUE[piece.type];
  return attackers.some(a => PIECE_VALUE[a.piece] < movedValue);
}

// Generate { color, fenBefore, fenAfter, san, uci } for each ply by replaying from startingFen.
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

// Run engine analysis on every distinct position (N+1 for N moves), then classify each move.
// Streams progress via onProgress(current, total) and onMoveAnalyzed(analysis) callbacks.
export async function analyzeGame({
  history,
  startingFen = STARTING_FEN,
  depth = 14,
  multiPv = 2,
  onProgress = () => {},
  onMoveAnalyzed = () => {},
  shouldAbort = () => false,
} = {}) {
  const plies = replayMoves(history, startingFen);
  const total = plies.length + 1; // need eval before move 1 + after each move

  const engine = new StockfishService();
  try {
    await engine.init();

    // Step 1: analyze every position (replayed FENs in order)
    const fens = [startingFen, ...plies.map(p => p.fenAfter)];
    const rawAnalyses = new Array(fens.length);
    for (let i = 0; i < fens.length; i++) {
      if (shouldAbort()) throw new Error('aborted');
      rawAnalyses[i] = await engine.analyzePosition(fens[i], { depth, multiPv });
      onProgress(i + 1, total);
    }

    // Step 2: classify each ply using rawAnalyses[i] (before) and rawAnalyses[i+1] (after)
    const analyses = [];
    const sanSeq = [];
    let bookStillMatching = true;

    for (let i = 0; i < plies.length; i++) {
      const ply = plies[i];
      const before = rawAnalyses[i];
      const after = rawAnalyses[i + 1];
      sanSeq.push(ply.san);

      // The engine eval at `before` is from the side-to-move POV = the player making this move.
      const cpBefore = toCpScore(before, false);
      // The engine eval at `after` is from the OPPONENT's POV. Flip to get player POV.
      const cpAfter = toCpScore(after, true);

      // Second-best gap for "Great" detection (player POV)
      let secondBestCpGap = null;
      if (before?.lines?.length >= 2) {
        const top = before.lines.find(l => l.multipv === 1);
        const second = before.lines.find(l => l.multipv === 2);
        if (top && second) {
          const topCp = toCpScore(top, false);
          const secondCp = toCpScore(second, false);
          secondBestCpGap = topCp - secondCp;
        }
      }

      const isBest = before?.bestMove && before.bestMove === ply.uci;

      // Forced move detection
      const positionBefore = new Chess(ply.fenBefore);
      const isOnlyMove = positionBefore.moves().length === 1;

      // Book detection: only counts if sequence is matching from move 1
      let isBookMove = false;
      if (bookStillMatching) {
        if (isBookSequence(sanSeq)) isBookMove = true;
        else bookStillMatching = false;
      }

      // Sacrifice heuristic for Brilliant
      const isSacrifice = isBest ? isPieceSacrificed(ply.fenAfter, ply.to) : false;

      const classification = classifyMove({
        cpBefore,
        cpAfter,
        isBest,
        isOnlyMove,
        isBookMove,
        secondBestCpGap,
        isSacrifice,
      });

      const wpDrop = Math.max(0, winPercent(cpBefore) - winPercent(cpAfter));
      const acc = moveAccuracy(wpDrop);

      // Decode engine's best move into SAN for human display
      let bestSan = null;
      if (before?.bestMove) {
        const g = new Chess(ply.fenBefore);
        const m = g.move({
          from: before.bestMove.slice(0, 2),
          to: before.bestMove.slice(2, 4),
          promotion: before.bestMove[4] || undefined,
        });
        if (m) bestSan = m.san;
      }

      const analysis = {
        ply: i,
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
      };

      analyses.push(analysis);
      onMoveAnalyzed(analysis);
    }

    const summary = summarize(analyses);
    return { analyses, summary };
  } finally {
    engine.destroy();
  }
}

export { CLASS };
