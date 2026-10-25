import { useRef, useEffect, useState } from 'react';
import { Chessground } from 'chessground';

// arrows: [from, to] or [from, to, brush]; highlights: 'e4' or { square, brush }.
function buildShapes(arrows, highlights) {
  const shapes = [];
  if (arrows.length > 0) shapes.push(...arrows.map(([from, to, brush]) => ({ orig: from, dest: to, brush: brush || 'green' })));
  if (highlights.length > 0) shapes.push(...highlights.map(h => typeof h === 'string' ? { orig: h, brush: 'yellow' } : { orig: h.square, brush: h.brush || 'yellow' }));
  return shapes;
}

const FILES = 'abcdefgh';

// Board preferences from Settings (chess-mastery:settings).
function boardPrefs() {
  try {
    const s = JSON.parse(localStorage.getItem('chess-mastery:settings')) || {};
    return { coordinates: s.showCoordinates !== false, animation: s.moveAnimation !== false };
  } catch { return { coordinates: true, animation: true }; }
}

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
  onSquareClick,
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
  const onSquareClickRef = useRef(onSquareClick);
  const [loaded, setLoaded] = useState(false);

  // Always keep the latest callbacks
  onMoveRef.current = onMove;
  onHoverRef.current = onHover;
  onSquareClickRef.current = onSquareClick;

  // Destroy and recreate on key prop changes
  useEffect(() => {
    if (!boardRef.current) return;

    // Destroy previous instance
    if (cgRef.current) {
      cgRef.current.destroy();
      cgRef.current = null;
    }

    const destsMap = movable && dests ? dests : new Map();
    const prefs = boardPrefs();

    const config = {
      fen,
      orientation,
      turnColor,
      coordinates: coordinates && prefs.coordinates,
      animation: { enabled: prefs.animation, duration: 280 },
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

  // Tap-a-square (drills): a plain click listener so it works on a non-movable board.
  useEffect(() => {
    const el = boardRef.current;
    if (!el || !onSquareClick) return;
    const handleClick = (e) => {
      const sq = squareAt(el, e.clientX, e.clientY, orientation);
      if (sq) onSquareClickRef.current?.(sq);
    };
    el.addEventListener('click', handleClick);
    return () => el.removeEventListener('click', handleClick);
  }, [orientation, !!onSquareClick]);

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
