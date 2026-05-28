import { useRef, useEffect, useState } from 'react';
import { Chessground } from 'chessground';

function buildShapes(arrows, highlights) {
  const shapes = [];
  if (arrows.length > 0) shapes.push(...arrows.map(([from, to]) => ({ orig: from, dest: to, brush: 'green' })));
  if (highlights.length > 0) shapes.push(...highlights.map(sq => ({ orig: sq, brush: 'yellow' })));
  return shapes;
}

const FILES = 'abcdefgh';

// Map a pointer position over the board element to an algebraic square.
function squareAt(el, clientX, clientY, orientation) {
  const rect = el.getBoundingClientRect();
  if (rect.width === 0) return null;
  const sq = rect.width / 8;
  const col = Math.floor((clientX - rect.left) / sq);
  const row = Math.floor((clientY - rect.top) / sq);
  if (col < 0 || col > 7 || row < 0 || row > 7) return null;
  return orientation === 'white'
    ? FILES[col] + (8 - row)
    : FILES[7 - col] + (row + 1);
}

export default function ChessBoard({
  fen,
  orientation = 'white',
  movable = false,
  dests = null,
  turnColor = 'white',
  onMove,
  onHover,
  lastMove,
  check = false,
  arrows = [],
  highlights = [],
  coordinates = true,
  className = '',
  framed = true,
}) {
  const boardRef = useRef(null);
  const cgRef = useRef(null);
  const onMoveRef = useRef(onMove);
  const onHoverRef = useRef(onHover);
  const [loaded, setLoaded] = useState(false);

  // Always keep the latest callbacks
  onMoveRef.current = onMove;
  onHoverRef.current = onHover;

  // Destroy and recreate on key prop changes
  useEffect(() => {
    if (!boardRef.current) return;

    // Destroy previous instance
    if (cgRef.current) {
      cgRef.current.destroy();
      cgRef.current = null;
    }

    const destsMap = movable && dests ? dests : new Map();

    const config = {
      fen,
      orientation,
      turnColor,
      coordinates,
      animation: { enabled: true, duration: 280 },
      highlight: { lastMove: true, check: true },
      movable: {
        free: false,
        color: movable ? turnColor : undefined,
        dests: destsMap,
        showDests: true,
        events: {
          after: (orig, dest) => {
            if (onMoveRef.current) onMoveRef.current(orig, dest);
          },
        },
      },
      draggable: { enabled: movable },
      selectable: { enabled: movable },
    };

    if (lastMove) config.lastMove = lastMove;
    if (check) config.check = turnColor === 'white' ? 'black' : 'white';

    config.drawable = { autoShapes: buildShapes(arrows, highlights) };

    cgRef.current = Chessground(boardRef.current, config);
    setLoaded(true);

    return () => {
      if (cgRef.current) {
        cgRef.current.destroy();
        cgRef.current = null;
      }
    };
  }, [fen, orientation, movable, turnColor, coordinates, lastMove]);

  // Update drawn shapes in place — recreating the board here would wipe an
  // in-progress piece selection/drag (breaks "Show piece moves" interaction).
  useEffect(() => {
    if (cgRef.current) cgRef.current.setAutoShapes(buildShapes(arrows, highlights));
  }, [JSON.stringify(arrows), JSON.stringify(highlights)]);

  // Hover-to-preview: report the square under the cursor without consuming
  // clicks, so click/drag stays free to actually move the piece.
  useEffect(() => {
    const el = boardRef.current;
    if (!el || !onHover) return;
    let current = null;
    const report = (sq) => {
      if (sq !== current) { current = sq; onHoverRef.current?.(sq); }
    };
    const handleMove = (e) => report(squareAt(el, e.clientX, e.clientY, orientation));
    const handleLeave = () => report(null);
    el.addEventListener('mousemove', handleMove);
    el.addEventListener('mouseleave', handleLeave);
    return () => {
      el.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseleave', handleLeave);
    };
  }, [orientation, !!onHover]);

  const frameClass = framed
    ? `board-frame ${movable ? 'board-frame--interactive' : ''}`
    : '';

  return (
    <div className={`${frameClass} ${className}`} aria-label={movable ? 'Interactive chess board' : 'Chess board'}>
      <div className="relative">
        {!loaded && <div className="absolute inset-0 skeleton aspect-square" />}
        <div className="cg-wrap" ref={boardRef} />
      </div>
    </div>
  );
}
