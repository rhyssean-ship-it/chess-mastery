import { Chess } from 'chess.js';

const PIECE_VALUE = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 100 };
const PIECE_NAME = { p: 'pawn', n: 'knight', b: 'bishop', r: 'rook', q: 'queen', k: 'king' };

function pieceName(p, capitalize = false) {
  const n = PIECE_NAME[p?.toLowerCase()] || 'piece';
  return capitalize ? n.charAt(0).toUpperCase() + n.slice(1) : n;
}

// Convert a UCI move to a Chess.js verbose move on a given FEN.
function uciToVerbose(fen, uci) {
  if (!uci) return null;
  try {
    const g = new Chess(fen);
    const m = g.move({
      from: uci.slice(0, 2),
      to: uci.slice(2, 4),
      promotion: uci[4] || undefined,
    });
    return m;
  } catch { return null; }
}

// Get a list of pieces hanging (attacked & undefended) on a position. Side to evaluate is the
// side NOT to move (since their last move just landed).
function hangingPieces(fen) {
  const g = new Chess(fen);
  const stm = g.turn(); // side to move = opponent of the player who just moved
  const hang = [];
  // Iterate over all of stm's potential captures — squares they attack with a capture move
  const captures = g.moves({ verbose: true }).filter(m => m.captured);
  const seen = new Set();
  for (const c of captures) {
    if (seen.has(c.to)) continue;
    seen.add(c.to);
    // Apply the capture; if the captured piece's defenders can't recapture profitably, it's hanging
    const target = g.get(c.to);
    if (!target) continue;
    const targetValue = PIECE_VALUE[target.type];
    const attackerValue = PIECE_VALUE[c.piece];
    // Quick SEE-lite: if attacker value < target value AND target square is not defended by stm's opponent, it's hanging
    // We approximate "defended" by toggling turn and checking moves landing on the square
    const tmp = new Chess(fen);
    tmp.move({ from: c.from, to: c.to, promotion: c.promotion });
    const recap = tmp.moves({ verbose: true }).filter(m => m.to === c.to && m.captured);
    const isDefended = recap.length > 0;
    const profitable = attackerValue < targetValue || (!isDefended && attackerValue <= targetValue);
    if (profitable) {
      hang.push({ square: c.to, piece: target, attacker: c });
    }
  }
  return hang;
}

// Squares attacked by a piece on `from` (after applying the move encoded by `verbose`).
function attackedSquaresFrom(fen, square) {
  try {
    const g = new Chess(fen);
    // Generate pseudo-legal moves from this square for the side to move
    const moves = g.moves({ square, verbose: true });
    return new Set(moves.map(m => m.to));
  } catch { return new Set(); }
}

// Detect if the move creates a fork — moved piece attacks 2+ enemy pieces of greater-than-or-equal value
function detectFork(fenAfter, toSquare) {
  const g = new Chess(fenAfter);
  const piece = g.get(toSquare);
  if (!piece) return null;
  const movedValue = PIECE_VALUE[piece.type];
  // Generate moves for the side that just moved (toggle turn to see what their piece attacks)
  // Simpler: their attacks are encoded in the legal moves of the side TO move next, but inverted.
  // We'll iterate enemy pieces and check whether our piece's destination attacks them.
  const targets = [];
  for (let r = 0; r < 8; r++) {
    for (let f = 0; f < 8; f++) {
      const sq = 'abcdefgh'[f] + (r + 1);
      const target = g.get(sq);
      if (!target || target.color === piece.color) continue;
      // Does the moved piece attack `sq`? Reuse chess.js move generation for the OTHER side, then check
      const opp = new Chess(fenAfter);
      // Flip turn to the mover's side
      const parts = fenAfter.split(' ');
      parts[1] = piece.color;
      const flipped = parts.join(' ');
      try {
        const f2 = new Chess(flipped);
        const attacks = f2.moves({ square: toSquare, verbose: true });
        if (attacks.some(m => m.to === sq)) {
          targets.push({ square: sq, piece: target });
        }
      } catch { /* ignore */ }
    }
  }
  if (targets.length >= 2) {
    // Sort by value desc to surface the most valuable forked piece
    targets.sort((a, b) => PIECE_VALUE[b.piece.type] - PIECE_VALUE[a.piece.type]);
    return { fromPiece: piece, targets };
  }
  return null;
}

// Did the previous move leave a piece undefended such that the opponent could capture for free?
function checkHangingAfterMove(fenAfter, lastMove) {
  // The side to move now is the opponent. Look at their best capture; if the captured piece is
  // worth more than the capturer and undefended, our last move blundered it.
  const hangs = hangingPieces(fenAfter);
  if (hangs.length === 0) return null;
  // Filter to pieces of the side that just moved
  const moverColor = lastMove.color;
  const ours = hangs.filter(h => h.piece.color === moverColor);
  if (ours.length === 0) return null;
  // Return the most valuable hang
  ours.sort((a, b) => PIECE_VALUE[b.piece.type] - PIECE_VALUE[a.piece.type]);
  return ours[0];
}

// Generate plain-English text for the move the player actually played (only when it's a mistake/blunder/inaccuracy).
export function explainPlayedMove(analysis) {
  if (!analysis) return null;
  const { classification, fenBefore, fenAfter, uci, cpl } = analysis;
  if (!['inaccuracy', 'mistake', 'blunder', 'miss'].includes(classification)) return null;

  const verbose = uciToVerbose(fenBefore, uci);
  if (!verbose) return null;

  // Was a piece on the destination square captured?
  // (The played move itself — usually not the problem unless it was a bad recapture.)

  // After the move, did we leave material hanging?
  const hang = checkHangingAfterMove(fenAfter, verbose);
  if (hang) {
    const sqName = hang.square.toUpperCase();
    const pieceLabel = pieceName(hang.piece.type);
    if (PIECE_VALUE[hang.attacker.piece] < PIECE_VALUE[hang.piece.type]) {
      return `Your ${pieceLabel} on ${sqName} is undefended — it can be won by a lower-valued piece.`;
    }
    return `Your ${pieceLabel} on ${sqName} is hanging.`;
  }

  // Generic severity-based fallback
  if (classification === 'blunder') {
    return `A blunder${cpl > 300 ? ` — about ${(cpl / 100).toFixed(1)} pawns of advantage lost.` : '.'}`;
  }
  if (classification === 'mistake') {
    return `A mistake — about ${(cpl / 100).toFixed(1)} pawns lost.`;
  }
  if (classification === 'inaccuracy') {
    return `An inaccuracy — a small slip worth around ${(cpl / 100).toFixed(1)} pawns.`;
  }
  return null;
}

// Generate plain-English text for the engine's recommended move.
export function explainBestMove(analysis) {
  if (!analysis?.bestMove || !analysis.fenBefore) return null;
  const verbose = uciToVerbose(analysis.fenBefore, analysis.bestMove);
  if (!verbose) return null;

  const san = analysis.bestMoveSan || verbose.san;
  const fenAfterBest = (() => {
    try {
      const g = new Chess(analysis.fenBefore);
      g.move({ from: verbose.from, to: verbose.to, promotion: verbose.promotion });
      return g.fen();
    } catch { return null; }
  })();

  // Capture?
  if (verbose.captured) {
    const captured = pieceName(verbose.captured);
    // Was it a check?
    const isCheck = verbose.san.endsWith('+') || verbose.san.endsWith('#');
    const checkStr = verbose.san.endsWith('#') ? ' with checkmate' : isCheck ? ' with check' : '';
    return `${san} wins the ${captured}${checkStr}.`;
  }

  // Fork after the move?
  if (fenAfterBest) {
    const fork = detectFork(fenAfterBest, verbose.to);
    if (fork) {
      const piece = pieceName(fork.fromPiece.type, true);
      const targets = fork.targets.slice(0, 2).map(t => `${pieceName(t.piece.type)} on ${t.square.toUpperCase()}`).join(' and the ');
      return `${san} — ${piece} forks the ${targets}.`;
    }
  }

  // Checkmate?
  if (verbose.san.endsWith('#')) return `${san} delivers checkmate.`;
  if (verbose.san.endsWith('+')) return `${san} — check.`;

  // Castling?
  if (verbose.san === 'O-O' || verbose.san === 'O-O-O') {
    return `Castles — getting the king to safety and connecting the rooks.`;
  }

  // Fallback: show the engine's principal variation as a continuation
  if (analysis.bestMovePv?.length > 1) {
    const pv = analysis.bestMovePv.slice(0, 5).join(' ');
    return `${san} — engine's line continues ${pv}…`;
  }
  return `${san} keeps the position best.`;
}

// Group blunders/mistakes/inaccuracies by phase so we can surface "your pattern this game".
export function patternsFromAnalyses(analyses, playerColor = null) {
  const filtered = playerColor
    ? analyses.filter(a => a && a.color === playerColor)
    : analyses.filter(Boolean);

  const phaseCounts = {
    opening: { blunder: 0, mistake: 0, inaccuracy: 0 },
    middlegame: { blunder: 0, mistake: 0, inaccuracy: 0 },
    endgame: { blunder: 0, mistake: 0, inaccuracy: 0 },
  };
  let totalMistakeCpl = 0;
  let countOfMistakes = 0;

  for (const a of filtered) {
    const phase = a.ply < 20 ? 'opening' : a.ply < 60 ? 'middlegame' : 'endgame';
    if (a.classification === 'blunder') phaseCounts[phase].blunder++;
    else if (a.classification === 'mistake') phaseCounts[phase].mistake++;
    else if (a.classification === 'inaccuracy') phaseCounts[phase].inaccuracy++;
    if (['blunder', 'mistake'].includes(a.classification)) {
      totalMistakeCpl += a.cpl;
      countOfMistakes++;
    }
  }

  const phaseTotal = (p) => phaseCounts[p].blunder + phaseCounts[p].mistake + phaseCounts[p].inaccuracy;
  const phases = Object.entries(phaseCounts)
    .map(([name, counts]) => ({ name, total: phaseTotal(name), ...counts }))
    .sort((a, b) => b.total - a.total);

  const observations = [];
  for (const p of phases) {
    if (p.total === 0) continue;
    const label = p.name.charAt(0).toUpperCase() + p.name.slice(1);
    if (p.blunder > 0) {
      observations.push(`${label}: ${p.blunder} blunder${p.blunder > 1 ? 's' : ''}${p.mistake ? `, ${p.mistake} mistake${p.mistake > 1 ? 's' : ''}` : ''}.`);
    } else if (p.mistake > 0) {
      observations.push(`${label}: ${p.mistake} mistake${p.mistake > 1 ? 's' : ''}${p.inaccuracy ? `, ${p.inaccuracy} inaccurac${p.inaccuracy > 1 ? 'ies' : 'y'}` : ''}.`);
    } else {
      observations.push(`${label}: ${p.inaccuracy} inaccurac${p.inaccuracy > 1 ? 'ies' : 'y'}.`);
    }
  }
  // Spot a "clean phase"
  for (const p of phases) {
    if (p.total === 0 && filtered.some(a => {
      const phase = a.ply < 20 ? 'opening' : a.ply < 60 ? 'middlegame' : 'endgame';
      return phase === p.name;
    })) {
      const label = p.name.charAt(0).toUpperCase() + p.name.slice(1);
      observations.push(`${label}: clean — no mistakes.`);
    }
  }

  return { observations, phases, avgMistakeCpl: countOfMistakes > 0 ? totalMistakeCpl / countOfMistakes : 0 };
}
