import { CLASS, CLASS_META } from '../services/moveClassification';

const DOT_HEX = {
  [CLASS.BRILLIANT]: '#22d3ee',
  [CLASS.GREAT]: '#60a5fa',
  [CLASS.INACCURACY]: '#f59e0b',
  [CLASS.MISTAKE]: '#fb923c',
  [CLASS.BLUNDER]: '#ef4444',
  [CLASS.MISS]: '#ef4444',
};

// Win-percentage graph over the game, drawn chess.com/Lichess-style: the side
// to play's territory is the light fill, the opponent's is the dark region above.
// `analyses` is the (possibly sparse) array from gameAnalysisService — entries may be null during streaming.
// onJump(plyIndex) makes the whole graph a tap-to-scrub navigator.
export default function EvalGraph({ analyses, currentPly = -1, onJump, evalPerspective = 'objective', playerColor = 'white', compact = false }) {
  if (!analyses || analyses.length === 0) return null;

  const W = 320;
  const H = compact ? 72 : 104;
  const pad = 4;
  const bottom = H - pad;
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
    points.push({ x, y, wp: wpForDisplay, i, classification: a.classification });
  }
  if (points.length === 0) return null;

  const firstX = points[0].x;
  const lastX = points[points.length - 1].x;
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  // Light region = curve down to the floor; dark region = curve up to the ceiling.
  const lightPath = `${linePath} L ${lastX.toFixed(1)} ${bottom} L ${firstX.toFixed(1)} ${bottom} Z`;
  const darkPath = `${linePath} L ${lastX.toFixed(1)} ${pad} L ${firstX.toFixed(1)} ${pad} Z`;
  const midY = pad + (H - pad * 2) / 2;

  const isMarked = (c) =>
    c === CLASS.BLUNDER || c === CLASS.MISTAKE || c === CLASS.INACCURACY ||
    c === CLASS.BRILLIANT || c === CLASS.GREAT;

  const cur = currentPly >= 0 ? points.find(p => p.i === currentPly) : null;
  const sideLabel = evalPerspective === 'your' ? 'You' : 'White';

  function handleScrub(e) {
    if (!onJump) return;
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width === 0) return;
    const ratio = (e.clientX - rect.left) / rect.width;
    const i = Math.round(ratio * (totalLen - 1));
    onJump(Math.max(0, Math.min(totalLen - 1, i)));
  }

  return (
    <div className={`card-base ${compact ? 'p-2' : 'p-3'}`}>
      <div className={`flex justify-between items-center ${compact ? 'mb-1' : 'mb-2'}`}>
        <span className={`text-text-dim font-medium ${compact ? 'text-[10px] uppercase tracking-wide' : 'text-xs'}`}>Evaluation</span>
        <span className="text-[10px] text-text-dim tabular-nums">
          {cur ? `${sideLabel} ${Math.round(cur.wp)}%` : `${sideLabel} ↑`}
        </span>
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        height={H}
        preserveAspectRatio="none"
        className={`block rounded-md overflow-hidden ${onJump ? 'cursor-pointer' : ''}`}
        onClick={handleScrub}
      >
        <defs>
          <linearGradient id="evalLight" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#efece6" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#d7d2c8" stopOpacity="0.85" />
          </linearGradient>
        </defs>
        {/* opponent (dark) territory */}
        <path d={darkPath} fill="#0b0b0d" fillOpacity="0.38" />
        {/* side-to-play (light) territory */}
        <path d={lightPath} fill="url(#evalLight)" />
        {/* 50% reference line */}
        <line x1={firstX} y1={midY} x2={lastX} y2={midY} stroke="#7a766e" strokeOpacity="0.45" strokeDasharray="2 3" strokeWidth="0.8" />
        {/* boundary line */}
        <path d={linePath} fill="none" stroke="#1a1a1c" strokeOpacity="0.45" strokeWidth="1.3" strokeLinejoin="round" />
        {/* current ply marker */}
        {cur && (
          <>
            <line x1={cur.x} x2={cur.x} y1={pad} y2={bottom} stroke="#c9a961" strokeOpacity="0.85" strokeWidth="1.4" />
            <circle cx={cur.x} cy={cur.y} r={compact ? 3.5 : 4} fill="#c9a961" stroke="#1a1a1c" strokeWidth="1" />
          </>
        )}
        {/* notable move dots (mistakes/blunders/great/brilliant) */}
        {points.map(p => isMarked(p.classification) && p.i !== currentPly && (
          <circle
            key={p.i}
            cx={p.x} cy={p.y} r={compact ? 3.5 : 4}
            fill={DOT_HEX[p.classification] || '#9ca3af'}
            stroke="#0b0b0d" strokeWidth="0.9"
            className="cursor-pointer"
            onClick={(e) => { e.stopPropagation(); onJump?.(p.i); }}
          >
            <title>{`${CLASS_META[p.classification]?.label} on move ${Math.floor(p.i / 2) + 1}`}</title>
          </circle>
        ))}
      </svg>
    </div>
  );
}
