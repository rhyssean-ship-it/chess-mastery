import { useEffect, useRef } from 'react';

export default function MoveList({ history, currentIndex, onSelectMove }) {
  const activeRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (activeRef.current && containerRef.current) {
      const container = containerRef.current;
      const el = activeRef.current;
      const top = el.offsetTop - container.offsetTop;
      if (top < container.scrollTop || top + el.offsetHeight > container.scrollTop + container.clientHeight) {
        container.scrollTop = top - container.clientHeight / 2;
      }
    }
  }, [currentIndex]);

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

  return (
    <div ref={containerRef} className="bg-bg-card rounded-xl p-3 max-h-72 overflow-y-auto overflow-x-hidden border border-bg-hover">
      <table className="w-full text-base">
        <tbody>
          {pairs.map(p => (
            <tr key={p.number}>
              <td className="text-text-dim/50 w-8 pr-2 text-right text-xs tabular-nums">{p.number}.</td>
              <td
                ref={currentIndex === p.whiteIdx ? activeRef : null}
                className={`px-2 py-1 cursor-pointer rounded-md transition-all duration-150 ${
                  currentIndex === p.whiteIdx ? 'bg-gold text-bg font-semibold shadow-sm' : 'hover:bg-bg-hover'
                }`}
                onClick={() => onSelectMove(p.whiteIdx)}
              >
                {p.white?.move?.san || p.white?.san || ''}
              </td>
              <td
                ref={p.black && currentIndex === p.blackIdx ? activeRef : null}
                className={`px-2 py-1 cursor-pointer rounded-md transition-all duration-150 ${
                  p.black && currentIndex === p.blackIdx ? 'bg-gold text-bg font-semibold shadow-sm' : 'hover:bg-bg-hover'
                }`}
                onClick={() => p.black && onSelectMove(p.blackIdx)}
              >
                {p.black?.move?.san || p.black?.san || ''}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
