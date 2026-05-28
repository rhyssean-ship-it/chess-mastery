import { useEffect, useState, useRef } from 'react';
import { fetchExplorer } from '../services/openingExplorerService';

// Live opening-book panel for a given position. Self-manages loading / empty / error.
// Pass `onPlayMove(uci)` to make the listed moves clickable (e.g. to play them on the board).
export default function OpeningExplorer({ fen, onPlayMove = null, maxMoves = 8, className = '' }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const fenRef = useRef(fen);
  fenRef.current = fen;

  useEffect(() => {
    if (!fen) return;
    const controller = new AbortController();
    setError(false);
    const handle = setTimeout(async () => {
      setLoading(true);
      try {
        const result = await fetchExplorer(fen, { signal: controller.signal });
        if (fenRef.current === fen) { setData(result); setLoading(false); }
      } catch (e) {
        if (e.name !== 'AbortError' && fenRef.current === fen) { setError(true); setLoading(false); }
      }
    }, 300);
    return () => { clearTimeout(handle); controller.abort(); };
  }, [fen]);

  const openingName = data?.opening?.name;
  const moves = (data?.moves || []).slice(0, maxMoves);
  const outOfBook = data && data.total === 0;

  return (
    <div className={`card-base p-3 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="text-[10px] text-text-dim uppercase tracking-wide font-semibold">Opening book</div>
        {loading && <span className="text-[10px] text-text-dim">loading…</span>}
      </div>

      {openingName && (
        <div className="text-xs text-gold font-medium mb-2 leading-snug">
          {data.opening.eco && <span className="text-text-dim mr-1">{data.opening.eco}</span>}
          {openingName}
        </div>
      )}

      {error && <div className="text-xs text-text-dim">Couldn't reach the opening database.</div>}

      {!error && outOfBook && (
        <div className="text-xs text-text-dim">Out of book — no common games reach this position. You're on your own now.</div>
      )}

      {!error && !outOfBook && moves.length > 0 && (
        <div className="space-y-1">
          {/* header */}
          <div className="flex items-center gap-2 text-[9px] text-text-dim/70 uppercase tracking-wide px-1">
            <span className="w-12">Move</span>
            <span className="w-10 text-right">Games</span>
            <span className="flex-1 text-center">W / D / B</span>
          </div>
          {moves.map(m => {
            const Row = onPlayMove ? 'button' : 'div';
            return (
              <Row
                key={m.uci}
                {...(onPlayMove ? { onClick: () => onPlayMove(m.uci), title: `Play ${m.san}` } : {})}
                className={`w-full flex items-center gap-2 px-1 py-1 rounded-md text-left ${onPlayMove ? 'hover:bg-bg-hover/50 transition-colors cursor-pointer' : ''}`}
              >
                <span className="w-12 font-mono text-xs font-semibold truncate">{m.san}</span>
                <span className="w-10 text-right text-[10px] text-text-dim tabular-nums">{fmtGames(m.games)}</span>
                <span className="flex-1">
                  <span className="flex h-3 rounded-sm overflow-hidden bg-bg-hover" title={`White ${m.whitePct.toFixed(0)}% · Draw ${m.drawPct.toFixed(0)}% · Black ${m.blackPct.toFixed(0)}%`}>
                    <span style={{ width: `${m.whitePct}%` }} className="bg-white/90" />
                    <span style={{ width: `${m.drawPct}%` }} className="bg-text-dim/50" />
                    <span style={{ width: `${m.blackPct}%` }} className="bg-bg-card" />
                  </span>
                </span>
                <span className="w-9 text-right text-[10px] text-text-dim tabular-nums">{m.pct.toFixed(0)}%</span>
              </Row>
            );
          })}
        </div>
      )}

      {!error && !data && !loading && (
        <div className="text-xs text-text-dim">—</div>
      )}
    </div>
  );
}

function fmtGames(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k`;
  return `${n}`;
}
