import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Chess } from 'chess.js';
import ChessBoard from '../components/ChessBoard';
import Breadcrumb from '../components/Breadcrumb';
import MoveList from '../components/MoveList';
import LessonCard from '../components/LessonCard';
import masterGames from '../data/masterGames';

function GamesIndex() {
  return (
    <div className="page-enter max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-display text-gold mb-1">Annotated Master Games</h1>
      <p className="text-text-dim text-base mb-8">Study how the greatest players navigated complex positions.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {masterGames.map(game => (
          <LessonCard
            key={game.id}
            to={`/master-games/${game.id}`}
            title={`${game.white} vs ${game.black}`}
            description={`${game.event} — ${game.theme}`}
            difficulty={game.result}
            readTime={`${game.moves.length} moves`}
          />
        ))}
      </div>
    </div>
  );
}

function GameViewer() {
  const { id } = useParams();
  const game = masterGames.find(g => g.id === id);
  const [moveIndex, setMoveIndex] = useState(-1);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight') setMoveIndex(i => Math.min(i + 1, (game?.moves.length || 1) - 1));
      if (e.key === 'ArrowLeft') setMoveIndex(i => Math.max(i - 1, -1));
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [game]);

  if (!game) return (
    <div className="page-enter max-w-4xl mx-auto px-6 py-10">
      <p className="text-text-dim">Game not found.</p>
    </div>
  );

  const startFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  const currentFen = moveIndex >= 0 ? game.moves[moveIndex].fen : startFen;
  const currentAnnotation = moveIndex >= 0 ? game.moves[moveIndex].annotation : '';
  const lastMove = moveIndex >= 0 ? (() => {
    try {
      const prevFen = moveIndex > 0 ? game.moves[moveIndex - 1].fen : startFen;
      const g = new Chess(prevFen);
      const m = g.move(game.moves[moveIndex].move);
      return m ? [m.from, m.to] : undefined;
    } catch { return undefined; }
  })() : undefined;

  const history = game.moves.map(m => ({ san: m.move, annotation: m.annotation }));

  return (
    <div className="page-enter max-w-6xl mx-auto px-6 py-10">
      <Breadcrumb to="/master-games" label="Back to Master Games" />
      <h1 className="text-2xl font-display text-gold mb-1">{game.white} vs {game.black}</h1>
      <p className="text-text-dim text-base mb-1">{game.event} &middot; Result: {game.result}</p>
      <p className="text-text-dim text-sm mb-8">{game.description}</p>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
        <div className="w-full max-w-[560px]">
          <ChessBoard fen={currentFen} movable={false} lastMove={lastMove} />

          <div className="flex gap-2 mt-3">
            <button onClick={() => setMoveIndex(-1)} className="flex-1 py-2 rounded-lg bg-bg-card border border-bg-hover text-sm hover:bg-bg-hover transition-all btn-press flex items-center justify-center gap-1"><kbd>Home</kbd></button>
            <button onClick={() => setMoveIndex(Math.max(-1, moveIndex - 1))} className="flex-1 py-2 rounded-lg bg-bg-card border border-bg-hover text-sm hover:bg-bg-hover transition-all btn-press flex items-center justify-center gap-1"><kbd>&larr;</kbd> Prev</button>
            <button onClick={() => setMoveIndex(Math.min(game.moves.length - 1, moveIndex + 1))} className="flex-1 py-2 rounded-lg bg-bg-card border border-bg-hover text-sm hover:bg-bg-hover transition-all btn-press flex items-center justify-center gap-1">Next <kbd>&rarr;</kbd></button>
            <button onClick={() => setMoveIndex(game.moves.length - 1)} className="flex-1 py-2 rounded-lg bg-bg-card border border-bg-hover text-sm hover:bg-bg-hover transition-all btn-press flex items-center justify-center gap-1"><kbd>End</kbd></button>
          </div>
        </div>

        <div className="space-y-4">
          <MoveList history={history} currentIndex={moveIndex} onSelectMove={setMoveIndex} />

          {/* Annotation */}
          {currentAnnotation ? (
            <div className="card-base p-5 border-gold/20">
              <p className="text-gold font-semibold text-xs uppercase tracking-wider mb-2">Commentary</p>
              <p className="text-base text-text-dim leading-relaxed">{currentAnnotation}</p>
            </div>
          ) : (
            <div className="card-base p-5 opacity-50">
              <p className="text-base text-text-dim italic">No annotation for this move.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export { GamesIndex, GameViewer };
