import { useState, useCallback, useRef } from 'react';
import { Chess } from 'chess.js';

export function useChessGame(initialFen) {
  const gameRef = useRef(new Chess(initialFen));
  const [fen, setFen] = useState(gameRef.current.fen());
  const [history, setHistory] = useState([]);
  const [moveIndex, setMoveIndex] = useState(-1);

  const reset = useCallback((newFen) => {
    const f = newFen || 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    gameRef.current = new Chess(f);
    setFen(f);
    setHistory([]);
    setMoveIndex(-1);
  }, []);

  const makeMove = useCallback((from, to, promotion) => {
    try {
      const move = gameRef.current.move({ from, to, promotion: promotion || 'q' });
      if (move) {
        const newFen = gameRef.current.fen();
        setFen(newFen);
        setHistory(prev => {
          const newHist = [...prev.slice(0, moveIndex + 1), { move, fen: newFen }];
          setMoveIndex(newHist.length - 1);
          return newHist;
        });
        return move;
      }
    } catch {
      return null;
    }
    return null;
  }, [moveIndex]);

  const goToMove = useCallback((index) => {
    if (index < 0) {
      const startFen = initialFen || 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
      gameRef.current = new Chess(startFen);
      setFen(startFen);
      setMoveIndex(-1);
    } else if (index < history.length) {
      gameRef.current = new Chess(history[index].fen);
      setFen(history[index].fen);
      setMoveIndex(index);
    }
  }, [history, initialFen]);

  const getLegalMoves = useCallback(() => {
    const dests = new Map();
    const moves = gameRef.current.moves({ verbose: true });
    for (const m of moves) {
      if (!dests.has(m.from)) dests.set(m.from, []);
      dests.get(m.from).push(m.to);
    }
    return dests;
  }, []);

  const turn = useCallback(() => gameRef.current.turn(), []);
  const isCheck = useCallback(() => gameRef.current.isCheck(), []);
  const isCheckmate = useCallback(() => gameRef.current.isCheckmate(), []);
  const isGameOver = useCallback(() => gameRef.current.isGameOver(), []);

  return {
    game: gameRef.current,
    fen,
    history,
    moveIndex,
    reset,
    makeMove,
    goToMove,
    getLegalMoves,
    turn,
    isCheck,
    isCheckmate,
    isGameOver,
  };
}
