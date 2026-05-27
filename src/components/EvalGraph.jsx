import { CLASS, CLASS_META } from '../services/moveClassification';

const DOT_HEX = {
  [CLASS.BRILLIANT]: '#22d3ee',
  [CLASS.GREAT]: '#60a5fa',
  [CLASS.INACCURACY]: '#f59e0b',
  [CLASS.MISTAKE]: '#fb923c',
  [CLASS.BLUNDER]: '#ef4444',
  [CLASS.MISS]: '#ef4444',
};

// Sparkline graph of win-percentage over the game.
// `analyses` is the (possibly sparse) array from gameAnalysisService — entries may be null during streaming.
// onJump(plyIndex) makes nodes clickable.
export default function EvalGraph({ analyses, currentPly = -1, onJump, evalPerspective = 'objective', playerColor = 'white' }) {
  if (!analyses || analyses.length === 0) return null;

  const W = 320;
  const H = 80;
  const pad = 4;
  const totalLen = analyses.length;
  const flipForPlayer = evalPerspective === 'your' && playerColor === 'black';

  // Only plot entries that have arrived. Map by ply index so X-position reflects the move number.
  const points = [];
  for (let i = 0; i < analyses.length; i++) {
    const a = analyses[i];
    if (!a) continue;
    const whiteWp = a.color === 'white' ? a.wpAfter : 100 - a.wpAfter;
    const wpForDisplay = flipForPlayer ? 100 - whiteWp : whiteWp;
    const x = pad + (i / Math.max(1, totalLen - 1)) * (W - pad * 2);
    const y = pad + (1 - wpForDisplay / 100) * (H - pad * 2);
    points.push({ x, y, whiteWp: wpForDisplay, i, classification: a.classification });
  }
  if (points.length === 0) return null;

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${H - pad} L ${pad} ${H - pad} Z`;
  const midY = pad + (H - pad * 2) / 2;

  const isMarked = (c) =>
    c === CLASS.BLUNDER || c === CLASS.MISTAKE || c === CLASS.INACCURACY ||
    c === CLASS.BRILLIANT || c === CLASS.GREAT;

  return (
    <div className="card-base p-3">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-text-dim font-medium">Evaluation</span>
        <span className="text-[10px] text-text-dim">
          {evalPerspective === 'your' ? 'You ↑ / Opponent ↓' : 'White ↑ / Black ↓'}
        </span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} preserveAspectRatio="none" className="block">
        <defs>
          <linearGradient id="evalArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {/* zero line */}
        <line x1={pad} y1={midY} x2={W - pad} y2={midY} stroke="currentColor" strokeOpacity="0.15" strokeDasharray="2 3" />
        {/* area */}
        <path d={areaPath} fill="url(#evalArea)" />
        {/* line */}
        <path d={linePath} fill="none" stroke="currentColor" strokeOpacity="0.55" strokeWidth="1.4" />
        {/* current ply marker */}
        {currentPly >= 0 && currentPly < points.length && (
          <line
            x1={points[currentPly].x} x2={points[currentPly].x}
            y1={pad} y2={H - pad}
            stroke="#c9a961" strokeOpacity="0.6" strokeWidth="1"
          />
        )}
        {/* notable move dots (mistakes/blunders/great/brilliant) */}
        {points.map(p => isMarked(p.classification) && (
          <circle
            key={p.i}
            cx={p.x} cy={p.y} r={3.5}
            fill={DOT_HEX[p.classification] || '#9ca3af'}
            className="cursor-pointer"
            onClick={() => onJump?.(p.i)}
          >
            <title>{`${CLASS_META[p.classification]?.label} on move ${Math.floor(p.i / 2) + 1}`}</title>
          </circle>
        ))}
      </svg>
    </div>
  );
}
