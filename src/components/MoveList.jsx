import { useEffect, useRef, memo } from 'react';
import { CLASS_META } from '../services/moveClassification';

function MoveList({ history, currentIndex, onSelectMove, classifications = null, maxHeightClass = 'max-h-[28rem]' }) {
  const interactive = typeof onSelectMove === 'function';
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

  // Build the props for a clickable move cell — keyboard-accessible only when there's a handler.
  const cellProps = (idx, hasMove) => {
    if (!interactive || !hasMove) return {};
    return {
      role: 'button',
      tabIndex: 0,
      'aria-current': currentIndex === idx ? 'true' : undefined,
      onClick: () => onSelectMove(idx),
      onKeyDown: (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectMove(idx); }
      },
    };
  };
  const cellClass = (active) =>
    `px-2 py-1 rounded-md transition-all duration-150 ${interactive ? 'cursor-pointer' : ''} ${
      active ? 'bg-gold text-bg font-semibold shadow-sm' : interactive ? 'hover:bg-bg-hover' : ''
    }`;

  return (
    <div ref={containerRef} className={`bg-bg-card rounded-xl p-3 ${maxHeightClass} overflow-y-auto overflow-x-hidden`}>
      <table className="w-full text-base">
        <tbody>
          {ordered.map(p => (
            <tr key={p.number}>
              <td className="text-text-dim/70 w-8 pr-2 text-right text-xs tabular-nums">{p.number}.</td>
              <td
                ref={currentIndex === p.whiteIdx ? activeRef : null}
                className={cellClass(currentIndex === p.whiteIdx)}
                {...cellProps(p.whiteIdx, true)}
              >
                <span>{p.white?.move?.san || p.white?.san || ''}</span>
                {renderTag(p.whiteIdx)}
              </td>
              <td
                ref={p.black && currentIndex === p.blackIdx ? activeRef : null}
                className={cellClass(p.black && currentIndex === p.blackIdx)}
                {...cellProps(p.blackIdx, !!p.black)}
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

export default memo(MoveList);
