import { useRef, useEffect } from 'react';
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
}) {
  const boardRef = useRef(null);
  const cgRef = useRef(null);

  useEffect(() => {
    if (boardRef.current && !cgRef.current) {
      cgRef.current = Chessground(boardRef.current, buildConfig());
    }
    return () => {
      if (cgRef.current) {
        cgRef.current.destroy();
        cgRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (cgRef.current) {
      cgRef.current.set(buildConfig());
    }
  }, [fen, orientation, movable, dests, turnColor, lastMove, check, arrows, highlights]);

  function buildConfig() {
    const config = {
      fen,
      orientation,
      coordinates,
      animation: { enabled: true, duration: 200 },
      highlight: {
        lastMove: true,
        check: true,
      },
      movable: {
        free: false,
        color: movable ? turnColor : undefined,
        dests: movable && dests ? dests : new Map(),
        showDests: true,
        events: {
          after: (orig, dest) => {
            if (onMove) onMove(orig, dest);
          },
        },
      },
      draggable: { enabled: movable },
      selectable: { enabled: movable },
    };

    if (lastMove) config.lastMove = lastMove;
    if (check) config.check = turnColor === 'white' ? 'black' : 'white';

    if (arrows.length > 0) {
      config.drawable = {
        autoShapes: [
          ...arrows.map(([from, to]) => ({
            orig: from,
            dest: to,
            brush: 'green',
          })),
          ...highlights.map(sq => ({
            orig: sq,
            brush: 'yellow',
          })),
        ],
      };
    } else if (highlights.length > 0) {
      config.drawable = {
        autoShapes: highlights.map(sq => ({
          orig: sq,
          brush: 'yellow',
        })),
      };
    }

    return config;
  }

  return (
    <div className={`cg-wrap ${className}`} ref={boardRef} />
  );
}
