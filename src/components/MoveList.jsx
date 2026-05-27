import { useEffect, useRef } from 'react';
import { CLASS_META } from '../services/moveClassification';

export default function MoveList({ history, currentIndex, onSelectMove, classifications = null, maxHeightClass = 'max-h-[28rem]' }) {
  const activeRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // When in analysis mode, scroll to the active row instead of pinning to top
    if (classifications && activeRef.current && containerRef.current) {
      const c = containerRef.current;
      const a = activeRef.current;
      const top = a.offsetTop - c.offsetTop - c.clientHeight / 2 + a.clientHeight / 2;
      c.scrollTop = Math.max(0, top);
    } else if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [currentIndex, classifications]);

  const pairs = [];
  for (let i = 0; i < history.length; i += 2) {
    pairs.push({
      number: Math.floor(i / 2) + 1,
      white: history[i],
      black: history[i + 1] || null,
      whiteIdx: i,
      blackIdx: i + 1,
    });
  }

  // In analysis mode, oldest first (top-down reading). In live play mode, latest first.
  const ordered = classifications ? pairs : [...pairs].reverse();

  const renderTag = (idx) => {
    if (!classifications) return null;
    const c = classifications[idx];
    if (!c) return null;
    const meta = CLASS_META[c];
    if (!meta) return null;
    return (
      <span className={`ml-1.5 inline-flex items-center text-[10px] font-bold ${meta.color}`} title={meta.label}>
        {meta.symbol}
      </span>
    );
  };

  return (
    <div ref={containerRef} className={`bg-bg-card rounded-xl p-3 ${maxHeightClass} overflow-y-auto overflow-x-hidden`}>
      <table className="w-full text-base">
        <tbody>
          {ordered.map(p => (
            <tr key={p.number}>
              <td className="text-text-dim/50 w-8 pr-2 text-right text-xs tabular-nums">{p.number}.</td>
              <td
                ref={currentIndex === p.whiteIdx ? activeRef : null}
                className={`px-2 py-1 cursor-pointer rounded-md transition-all duration-150 ${
                  currentIndex === p.whiteIdx ? 'bg-gold text-bg font-semibold shadow-sm' : 'hover:bg-bg-hover'
                }`}
                onClick={() => onSelectMove(p.whiteIdx)}
              >
                <span>{p.white?.move?.san || p.white?.san || ''}</span>
                {renderTag(p.whiteIdx)}
              </td>
              <td
                ref={p.black && currentIndex === p.blackIdx ? activeRef : null}
                className={`px-2 py-1 cursor-pointer rounded-md transition-all duration-150 ${
                  p.black && currentIndex === p.blackIdx ? 'bg-gold text-bg font-semibold shadow-sm' : 'hover:bg-bg-hover'
                }`}
                onClick={() => p.black && onSelectMove(p.blackIdx)}
              >
                <span>{p.black?.move?.san || p.black?.san || ''}</span>
                {p.black && renderTag(p.blackIdx)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
