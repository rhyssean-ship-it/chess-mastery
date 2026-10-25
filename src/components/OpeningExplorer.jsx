import { memo, useMemo } from 'react';
import { lookupBook } from '../services/openingExplorerService';

// Opening-book panel for a given position, from the app's openings library.
// Pass `onPlayMove(uci)` to make the listed moves clickable (e.g. to play them on the board).
function OpeningExplorer({ fen, onPlayMove = null, maxMoves = 8, className = '' }) {
  const book = useMemo(() => (fen ? lookupBook(fen) : null), [fen]);
  const moves = (book?.moves || []).slice(0, maxMoves);

  return (
    <div className={`card-base p-3 ${className}`}>
      <div className="text-xs text-text-dim font-semibold mb-2">Opening book</div>

      {book?.opening && <div className="text-xs text-gold font-medium mb-2 leading-snug">{book.opening}</div>}

      {moves.length === 0 ? (
        <div className="text-xs text-text-dim">Out of book: none of the library's openings reach this position. You're on your own now.</div>
      ) : (
        <div className="space-y-0.5">
          {moves.map(m => {
            const Row = onPlayMove ? 'button' : 'div';
            return (
              <Row
                key={m.uci}
                {...(onPlayMove ? { onClick: () => onPlayMove(m.uci), title: `Play ${m.san}` } : {})}
                className={`w-full flex items-baseline gap-2 px-1 py-1 rounded-md text-left ${onPlayMove ? 'hover:bg-bg-hover/50 transition-colors cursor-pointer' : ''}`}
              >
                <span className="w-12 shrink-0 font-mono text-xs font-semibold">{m.san}</span>
                <span className="flex-1 min-w-0 text-[11px] text-text-dim leading-snug">{m.openings.join(', ')}</span>
              </Row>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default memo(OpeningExplorer);
