import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chess } from 'chess.js';
import ChessBoard from '../components/ChessBoard';
import MoveList from '../components/MoveList';
import EvalGraph from '../components/EvalGraph';
import { analyzeGame } from '../services/gameAnalysisService';
import { CLASS, CLASS_META } from '../services/moveClassification';
import { saveAnalysisMistakes } from '../services/mistakeStore';

const SESSION_KEY = 'enpassant:reviewGame';
const STARTING_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export default function GameAnalysis() {
  const navigate = useNavigate();
  const [gameData, setGameData] = useState(null);
  const [depth, setDepth] = useState(14);
  const [analyses, setAnalyses] = useState([]);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [summary, setSummary] = useState(null);
  const [mistakesSaved, setMistakesSaved] = useState(0);
  const [currentPly, setCurrentPly] = useState(-1); // -1 = starting position
  const [showBestArrow, setShowBestArrow] = useState(true);
  const abortRef = useRef(false);

  // Load game from sessionStorage on mount
  useEffect(() => {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) {
      navigate('/play');
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      setGameData(parsed);
    } catch {
      navigate('/play');
    }
  }, [navigate]);

  // Kick off analysis whenever depth changes (or initial mount with data)
  useEffect(() => {
    if (!gameData) return;
    abortRef.current = false;
    setAnalyses([]);
    setSummary(null);
    setAnalysisComplete(false);
    setProgress({ current: 0, total: gameData.history.length + 1 });

    (async () => {
      try {
        const result = await analyzeGame({
          history: gameData.history,
          startingFen: gameData.startingFen || STARTING_FEN,
          depth,
          onProgress: (current, total) => { if (!abortRef.current) setProgress({ current, total }); },
          onMoveAnalyzed: (a) => { if (!abortRef.current) setAnalyses(prev => [...prev, a]); },
          shouldAbort: () => abortRef.current,
        });
        if (!abortRef.current) {
          setSummary(result.summary);
          setAnalysisComplete(true);
          setCurrentPly(0);
          const added = saveAnalysisMistakes(result.analyses, {
            label: gameData.label,
            result: gameData.result,
            date: Date.now(),
          });
          setMistakesSaved(added);
        }
      } catch (e) {
        if (e.message !== 'aborted') console.error(e);
      }
    })();

    return () => { abortRef.current = true; };
  }, [gameData, depth]);

  const classifications = useMemo(() => analyses.map(a => a.classification), [analyses]);

  if (!gameData) {
    return (
      <div className="page-enter flex items-center justify-center min-h-[50vh]">
        <div className="text-text-dim">Loading game…</div>
      </div>
    );
  }

  const history = gameData.history;
  const orientation = gameData.playerColor || 'white';
  const currentAnalysis = currentPly >= 0 && currentPly < analyses.length ? analyses[currentPly] : null;

  // Determine displayed FEN
  let displayFen = STARTING_FEN;
  let displayLastMove = null;
  if (currentPly === -1) {
    displayFen = gameData.startingFen || STARTING_FEN;
  } else if (currentPly >= 0 && currentPly < history.length) {
    displayFen = history[currentPly].fen;
    const a = analyses[currentPly];
    if (a) displayLastMove = [a.from, a.to];
  }

  // Engine recommended move arrow (only when this move wasn't best and analysis is done for this ply)
  const bestArrow = (showBestArrow && currentAnalysis && !currentAnalysis.isBest && currentAnalysis.bestMove)
    ? [[currentAnalysis.bestMove.slice(0, 2), currentAnalysis.bestMove.slice(2, 4)]]
    : [];

  const progressPct = progress.total > 0 ? (progress.current / progress.total) * 100 : 0;

  function goPrev() { setCurrentPly(p => Math.max(-1, p - 1)); }
  function goNext() { setCurrentPly(p => Math.min(history.length - 1, p + 1)); }
  function jumpTo(idx) { setCurrentPly(idx); }
  function newGame() {
    sessionStorage.removeItem(SESSION_KEY);
    navigate('/play');
  }

  return (
    <div className="page-enter max-w-6xl mx-auto px-4 sm:px-6 py-6 lg:py-10">
      {/* Header */}
      <div className="flex flex-wrap items-baseline justify-between gap-3 mb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display text-gold">Game Review</h1>
          <p className="text-text-dim text-sm">
            {gameData.label || 'Played game'}{gameData.result ? ` — ${gameData.result}` : ''}
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <div className="text-xs text-text-dim">Depth</div>
          <div className="flex rounded-lg bg-bg-card border border-bg-hover overflow-hidden">
            {[14, 18].map(d => (
              <button
                key={d}
                onClick={() => setDepth(d)}
                disabled={!analysisComplete && d !== depth}
                className={`px-3 py-1.5 text-xs font-medium transition-all ${depth === d ? 'bg-gold text-bg' : 'text-text-dim hover:text-text'}`}
              >
                {d === 18 ? `Deep (${d})` : `Quick (${d})`}
              </button>
            ))}
          </div>
          <button
            onClick={newGame}
            className="px-3 py-1.5 rounded-lg bg-bg-card border border-bg-hover text-xs hover:bg-bg-hover transition-all"
          >
            Play again
          </button>
        </div>
      </div>

      {/* Mistakes saved toast */}
      {analysisComplete && mistakesSaved > 0 && (
        <div className="mb-4 card-base p-3 border-l-4 border-gold flex items-center justify-between gap-3 flex-wrap">
          <div className="text-sm">
            <span className="font-semibold text-gold">{mistakesSaved}</span> {mistakesSaved === 1 ? 'mistake' : 'mistakes'} saved to your trainer.
          </div>
          <button onClick={() => navigate('/my-mistakes')} className="text-xs px-3 py-1.5 rounded-lg bg-bg-card border border-bg-hover hover:bg-bg-hover">Open My Mistakes →</button>
        </div>
      )}

      {/* Progress bar */}
      {!analysisComplete && (
        <div className="mb-4 card-base p-3">
          <div className="flex justify-between text-xs text-text-dim mb-1.5">
            <span>Analysing… {progress.current} / {progress.total}</span>
            <span>{Math.round(progressPct)}%</span>
          </div>
          <div className="h-1.5 bg-bg-hover rounded-full overflow-hidden">
            <div className="h-full bg-gold transition-all duration-200" style={{ width: `${progressPct}%` }} />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        {/* Board column */}
        <div className="max-w-[560px] mx-auto w-full lg:mx-0">
          <ChessBoard
            fen={displayFen}
            orientation={orientation}
            movable={false}
            turnColor={(new Chess(displayFen).turn() === 'w') ? 'white' : 'black'}
            lastMove={displayLastMove}
            arrows={bestArrow}
          />
          {/* Move controls */}
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={() => setCurrentPly(-1)}
              disabled={currentPly === -1}
              className="px-3 py-2 rounded-lg bg-bg-card border border-bg-hover text-sm hover:bg-bg-hover transition-all disabled:opacity-30"
              aria-label="Go to start"
            >|◀</button>
            <button
              onClick={goPrev}
              disabled={currentPly === -1}
              className="px-3 py-2 rounded-lg bg-bg-card border border-bg-hover text-sm hover:bg-bg-hover transition-all disabled:opacity-30"
              aria-label="Previous move"
            >◀</button>
            <div className="flex-1 text-center text-sm text-text-dim tabular-nums">
              {currentPly === -1 ? 'Start' : `Move ${Math.floor(currentPly / 2) + 1}${currentPly % 2 === 0 ? '' : '…'}`}
            </div>
            <button
              onClick={goNext}
              disabled={currentPly >= history.length - 1}
              className="px-3 py-2 rounded-lg bg-bg-card border border-bg-hover text-sm hover:bg-bg-hover transition-all disabled:opacity-30"
              aria-label="Next move"
            >▶</button>
            <button
              onClick={() => setCurrentPly(history.length - 1)}
              disabled={currentPly >= history.length - 1}
              className="px-3 py-2 rounded-lg bg-bg-card border border-bg-hover text-sm hover:bg-bg-hover transition-all disabled:opacity-30"
              aria-label="Go to end"
            >▶|</button>
          </div>

          {/* Per-move detail card */}
          {currentAnalysis ? (
            <MoveDetail analysis={currentAnalysis} showBestArrow={showBestArrow} setShowBestArrow={setShowBestArrow} />
          ) : (
            <div className="mt-3 card-base p-4 text-sm text-text-dim">
              Starting position. Step through with ▶ to review the game move by move.
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {summary && <SummaryCard summary={summary} />}
          <EvalGraph analyses={analyses} currentPly={currentPly} onJump={jumpTo} />
          <MoveList history={history} currentIndex={currentPly} onSelectMove={jumpTo} classifications={classifications} />
        </div>
      </div>
    </div>
  );
}

function MoveDetail({ analysis, showBestArrow, setShowBestArrow }) {
  const meta = CLASS_META[analysis.classification];
  const playerName = analysis.color === 'white' ? 'White' : 'Black';
  const moveNumber = Math.floor(analysis.ply / 2) + 1;
  const cplCp = (analysis.cpl / 100).toFixed(2);

  let blurb = '';
  switch (analysis.classification) {
    case CLASS.BRILLIANT:
      blurb = 'A brilliant sacrifice — gives up material but the position remains strong.';
      break;
    case CLASS.GREAT:
      blurb = 'The only good move in the position — well found.';
      break;
    case CLASS.BEST:
      blurb = 'The engine\'s top choice.';
      break;
    case CLASS.EXCELLENT:
      blurb = 'A strong move, very close to the engine\'s recommendation.';
      break;
    case CLASS.GOOD:
      blurb = 'A reasonable move that doesn\'t spoil the position.';
      break;
    case CLASS.BOOK:
      blurb = 'A known opening move.';
      break;
    case CLASS.FORCED:
      blurb = 'The only legal reply.';
      break;
    case CLASS.INACCURACY:
      blurb = `An inaccuracy. Lost roughly ${cplCp} pawns of advantage.`;
      break;
    case CLASS.MISTAKE:
      blurb = `A mistake — better was ${analysis.bestMoveSan || analysis.bestMove}.`;
      break;
    case CLASS.BLUNDER:
      blurb = `A blunder. ${analysis.bestMoveSan ? `${analysis.bestMoveSan} held the position.` : ''}`;
      break;
    default:
      blurb = '';
  }

  return (
    <div className={`mt-3 card-base p-4 border-l-4 ${meta?.ring?.replace('ring-', 'border-') || 'border-bg-hover'}`}>
      <div className="flex items-baseline justify-between mb-2">
        <div className="flex items-baseline gap-2">
          <span className={`text-2xl font-bold ${meta?.color}`}>{meta?.symbol}</span>
          <span className={`text-base font-semibold ${meta?.color}`}>{meta?.label}</span>
        </div>
        <span className="text-xs text-text-dim tabular-nums">
          {playerName} · move {moveNumber}
        </span>
      </div>
      <p className="text-sm text-text mb-3">
        <span className="font-semibold">{analysis.san}</span> — {blurb}
      </p>
      {analysis.bestMoveSan && !analysis.isBest && (
        <div className="text-xs text-text-dim mb-3">
          Engine prefers: <span className="text-gold font-semibold">{analysis.bestMoveSan}</span>
          {analysis.bestMovePv.length > 1 && (
            <span className="ml-1 opacity-70">({analysis.bestMovePv.slice(0, 4).join(' ')}…)</span>
          )}
        </div>
      )}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <Stat label="CPL" value={analysis.cpl.toFixed(0)} />
        <Stat label="Eval" value={formatEval(analysis.cpAfter * (analysis.color === 'white' ? 1 : -1))} />
        <Stat label="Accuracy" value={analysis.moveAccuracy != null ? `${analysis.moveAccuracy.toFixed(0)}%` : '—'} />
      </div>
      {analysis.bestMove && !analysis.isBest && (
        <label className="mt-3 flex items-center gap-2 text-xs text-text-dim cursor-pointer">
          <input
            type="checkbox"
            checked={showBestArrow}
            onChange={e => setShowBestArrow(e.target.checked)}
            className="accent-gold"
          />
          Show engine's recommended move
        </label>
      )}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-bg-hover/40 rounded-md px-2 py-1.5">
      <div className="text-[10px] text-text-dim uppercase tracking-wide">{label}</div>
      <div className="text-sm tabular-nums font-medium">{value}</div>
    </div>
  );
}

function formatEval(cp) {
  if (cp == null || isNaN(cp)) return '—';
  const pawns = cp / 100;
  if (Math.abs(pawns) > 50) return pawns > 0 ? '#' : '-#';
  return (pawns > 0 ? '+' : '') + pawns.toFixed(2);
}

function SummaryCard({ summary }) {
  const rows = [
    { key: CLASS.BRILLIANT, label: 'Brilliant', icon: '!!' },
    { key: CLASS.GREAT, label: 'Great', icon: '!' },
    { key: CLASS.BEST, label: 'Best', icon: '★' },
    { key: CLASS.EXCELLENT, label: 'Excellent', icon: '◆' },
    { key: CLASS.GOOD, label: 'Good', icon: '·' },
    { key: CLASS.BOOK, label: 'Book', icon: '⨂' },
    { key: CLASS.INACCURACY, label: 'Inaccuracy', icon: '?!' },
    { key: CLASS.MISTAKE, label: 'Mistake', icon: '?' },
    { key: CLASS.BLUNDER, label: 'Blunder', icon: '??' },
  ];
  return (
    <div className="card-base p-4">
      <div className="grid grid-cols-3 gap-3 mb-4 text-center">
        <div />
        <div className="text-[11px] text-text-dim font-semibold uppercase tracking-wide">White</div>
        <div className="text-[11px] text-text-dim font-semibold uppercase tracking-wide">Black</div>
        <div className="text-xs text-text-dim font-medium text-left">Accuracy</div>
        <div className="text-base font-bold text-gold tabular-nums">
          {summary.white.accuracy != null ? `${summary.white.accuracy.toFixed(1)}%` : '—'}
        </div>
        <div className="text-base font-bold text-gold tabular-nums">
          {summary.black.accuracy != null ? `${summary.black.accuracy.toFixed(1)}%` : '—'}
        </div>
      </div>
      <div className="space-y-1">
        {rows.map(r => {
          const meta = CLASS_META[r.key];
          return (
            <div key={r.key} className="grid grid-cols-3 gap-3 items-center py-1 px-1 rounded hover:bg-bg-hover/40">
              <div className={`text-xs font-medium ${meta.color} flex items-center gap-1.5`}>
                <span className="font-bold">{r.icon}</span>
                <span>{r.label}</span>
              </div>
              <div className="text-sm tabular-nums text-center">{summary.white[r.key] || 0}</div>
              <div className="text-sm tabular-nums text-center">{summary.black[r.key] || 0}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
