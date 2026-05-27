import { useState, useEffect, useRef } from 'react';
import { Chess } from 'chess.js';
import ChessBoard from './ChessBoard';

// Reusable Lichess-format puzzle solver.
//
// Props:
//   puzzle   — { fen, moves: ['e2e4', ...] }  — moves[0] is opponent's setup move, then alternating
//   onSolved — () => void  — called when the user plays the full solution correctly
//   onFailed — () => void  — called when the user plays a wrong move
//   showHint — boolean      — when true, draws an arrow on the next correct move
//   onReady  — () => void  — called once the opponent's setup move has been played
//   compact  — boolean      — render with smaller padding for embedded use
export default function PuzzleSolver({ puzzle, onSolved, onFailed, showHint = false, onReady, compact = false }) {
  const gameRef = useRef(null);
  const [fen, setFen] = useState(puzzle.fen);
  const [moveIdx, setMoveIdx] = useState(0); // index into puzzle.moves
  const [lastMove, setLastMove] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | playing | solved | failed
  const [feedback, setFeedback] = useState(null);

  // Bootstrap: set up position and auto-play opponent's setup move.
  useEffect(() => {
    const g = new Chess(puzzle.fen);
    gameRef.current = g;
    setFen(puzzle.fen);
    setMoveIdx(0);
    setLastMove(null);
    setStatus('loading');
    setFeedback(null);

    const setupMove = puzzle.moves[0];
    const t = setTimeout(() => {
      try {
        const m = g.move({ from: setupMove.slice(0, 2), to: setupMove.slice(2, 4), promotion: setupMove[4] || undefined });
        if (m) {
          setFen(g.fen());
          setLastMove([m.from, m.to]);
          setMoveIdx(1);
          setStatus('playing');
          onReady?.();
        }
      } catch { /* swallow */ }
    }, 500);
    return () => clearTimeout(t);
  }, [puzzle]);

  const playerColor = new Chess(puzzle.fen).turn() === 'w' ? 'black' : 'white';

  function getLegalDests() {
    const g = gameRef.current;
    if (!g) return new Map();
    const dests = new Map();
    for (const m of g.moves({ verbose: true })) {
      if (!dests.has(m.from)) dests.set(m.from, []);
      dests.get(m.from).push(m.to);
    }
    return dests;
  }

  function handleMove(from, to) {
    if (status !== 'playing') return;
    const g = gameRef.current;
    const expected = puzzle.moves[moveIdx];
    const expectedFrom = expected.slice(0, 2);
    const expectedTo = expected.slice(2, 4);

    if (from !== expectedFrom || to !== expectedTo) {
      // Wrong move — but allow auto-promotion misses to be corrected
      setFeedback('wrong');
      setStatus('failed');
      onFailed?.();
      return;
    }

    const m = g.move({ from, to, promotion: expected[4] || 'q' });
    if (!m) {
      setFeedback('wrong');
      setStatus('failed');
      onFailed?.();
      return;
    }
    setFen(g.fen());
    setLastMove([from, to]);
    const nextIdx = moveIdx + 1;

    // Was that the last player move?
    if (nextIdx >= puzzle.moves.length) {
      setFeedback('correct');
      setStatus('solved');
      onSolved?.();
      return;
    }

    setFeedback('correct');
    setMoveIdx(nextIdx);

    // Opponent's reply (auto-play after a short delay)
    const opponentMove = puzzle.moves[nextIdx];
    setTimeout(() => {
      const om = g.move({ from: opponentMove.slice(0, 2), to: opponentMove.slice(2, 4), promotion: opponentMove[4] || undefined });
      if (om) {
        setFen(g.fen());
        setLastMove([om.from, om.to]);
        setMoveIdx(nextIdx + 1);
        setFeedback(null);
        // If this was the last move in the sequence the puzzle is technically solved
        if (nextIdx + 1 >= puzzle.moves.length) {
          setStatus('solved');
          onSolved?.();
        }
      }
    }, 350);
  }

  const isPlayerTurn = status === 'playing';
  const hintArrow = (showHint && isPlayerTurn && puzzle.moves[moveIdx])
    ? [[puzzle.moves[moveIdx].slice(0, 2), puzzle.moves[moveIdx].slice(2, 4)]]
    : [];

  return (
    <div className={compact ? '' : 'w-full max-w-[480px]'}>
      <ChessBoard
        fen={fen}
        orientation={playerColor}
        movable={isPlayerTurn}
        dests={isPlayerTurn ? getLegalDests() : new Map()}
        turnColor={isPlayerTurn ? playerColor : (playerColor === 'white' ? 'black' : 'white')}
        onMove={handleMove}
        lastMove={lastMove}
        arrows={hintArrow}
      />
      {feedback === 'correct' && status === 'playing' && (
        <div className="mt-2 text-xs text-correct font-medium">✓ Correct — keep going</div>
      )}
      {status === 'solved' && (
        <div className="mt-2 text-sm text-correct font-semibold">Solved!</div>
      )}
      {status === 'failed' && (
        <div className="mt-2 text-sm text-incorrect font-semibold">Not the right move.</div>
      )}
    </div>
  );
}
