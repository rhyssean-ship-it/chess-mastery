import { useRef, useEffect, useState } from 'react';
import { Chessground } from 'chessground';

export default function ChessBoard({
  fen,
  orientation = 'white',
  movable = false,
  dests = null,
  turnColor = 'white',
  onMove,
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
  const [loaded, setLoaded] = useState(false);

  // Always keep the latest onMove callback
  useEffect(() => {
    onMoveRef.current = onMove;
  }, [onMove]);

  useEffect(() => {
    if (boardRef.current && !cgRef.current) {
      cgRef.current = Chessground(boardRef.current, buildConfig());
      setLoaded(true);
    }
    return () => {
      if (cgRef.current) {
        cgRef.current.destroy();
        cgRef.current = null;
      }
    };
  }, []);

  // Update board on every render when props change
  useEffect(() => {
    if (cgRef.current) {
      cgRef.current.set(buildConfig());
    }
  });

  function buildConfig() {
    const config = {
      fen,
      orientation,
      coordinates,
      animation: { enabled: true, duration: 280 },
      highlight: { lastMove: true, check: true },
      movable: {
        free: false,
        color: movable ? turnColor : undefined,
        dests: movable && dests ? dests : new Map(),
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

    const shapes = [];
    if (arrows.length > 0) shapes.push(...arrows.map(([from, to]) => ({ orig: from, dest: to, brush: 'green' })));
    if (highlights.length > 0) shapes.push(...highlights.map(sq => ({ orig: sq, brush: 'yellow' })));
    if (shapes.length > 0) config.drawable = { autoShapes: shapes };

    return config;
  }

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
