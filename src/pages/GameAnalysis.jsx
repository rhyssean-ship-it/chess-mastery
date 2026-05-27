import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chess } from 'chess.js';
import ChessBoard from '../components/ChessBoard';
import MoveList from '../components/MoveList';
import EvalGraph from '../components/EvalGraph';
import PuzzleSolver from '../components/PuzzleSolver';
import { analyzeGame } from '../services/gameAnalysisService';
import { CLASS, CLASS_META } from '../services/moveClassification';
import { saveAnalysisMistakes } from '../services/mistakeStore';
import { saveAnalysedGame } from '../services/savedGames';
import { explainPlayedMove, explainBestMove, patternsFromAnalyses } from '../services/moveExplanation';

const SESSION_KEY = 'enpassant:reviewGame';
const STARTING_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

const MISTAKE_CLASSES = new Set([CLASS.INACCURACY, CLASS.MISTAKE, CLASS.BLUNDER, CLASS.MISS]);

export default function GameAnalysis() {
  const navigate = useNavigate();
  const [gameData, setGameData] = useState(null);
  const [depth, setDepth] = useState(14);
  const [analyses, setAnalyses] = useState([]);
  const [progress, setProgress] = useState({ current: 0, total: 0, phase: 'pass1' });
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [summary, setSummary] = useState(null);
  const [mistakesSaved, setMistakesSaved] = useState(0);
  const [currentPly, setCurrentPly] = useState(-1);
  const [showBestArrow, setShowBestArrow] = useState(true);
  const [evalPerspective, setEvalPerspective] = useState('objective'); // objective | your
  const [moveListView, setMoveListView] = useState('order');           // order | worst
  const [tryMode, setTryMode] = useState(false);
  const abortRef = useRef(false);

  useEffect(() => {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) { navigate('/play'); return; }
    try { setGameData(JSON.parse(raw)); }
    catch { navigate('/play'); }
  }, [navigate]);

  useEffect(() => {
    if (!gameData) return;
    abortRef.current = false;
    setTryMode(false);

    // If restoring from a previously saved review, skip analysis entirely
    if (gameData.restoredFromSave && gameData.savedAnalyses) {
      setAnalyses(gameData.savedAnalyses);
      setSummary(gameData.savedSummary || null);
      setAnalysisComplete(true);
      setCurrentPly(0);
      setProgress({ current: 1, total: 1, phase: 'pass2' });
      setMistakesSaved(0);
      return;
    }

    setAnalyses(new Array(gameData.history.length).fill(null));
    setSummary(null);
    setAnalysisComplete(false);
    setProgress({ current: 0, total: gameData.history.length + 1, phase: 'pass1' });

    (async () => {
      try {
        const result = await analyzeGame({
          history: gameData.history,
          startingFen: gameData.startingFen || STARTING_FEN,
          pass2Depth: depth,
          onProgress: (current, total, phase) => {
            if (!abortRef.current) setProgress({ current, total, phase });
          },
          onMoveAnalyzed: (a) => {
            if (abortRef.current) return;
            setAnalyses(prev => {
              const next = prev.slice();
              next[a.ply] = a;
              return next;
            });
          },
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
          // Persist the whole analysis for re-review later
          saveAnalysedGame({
            label: gameData.label,
            result: gameData.result,
            playerColor: gameData.playerColor,
            startingFen: gameData.startingFen || STARTING_FEN,
            history: gameData.history,
            summary: result.summary,
            analyses: result.analyses,
          });
        }
      } catch (e) {
        if (e.message !== 'aborted') console.error(e);
      }
    })();

    return () => { abortRef.current = true; };
  }, [gameData, depth]);

  const classifications = useMemo(() => analyses.map(a => a?.classification || null), [analyses]);

  const history = gameData?.history || [];
  const orientation = gameData?.playerColor || 'white';
  const currentAnalysis = currentPly >= 0 && currentPly < analyses.length ? analyses[currentPly] : null;

  // Navigation helpers
  const jumpTo = useCallback((idx) => { setTryMode(false); setCurrentPly(idx); }, []);
  const goPrev = useCallback(() => { setTryMode(false); setCurrentPly(p => Math.max(-1, p - 1)); }, []);
  const goNext = useCallback(() => { setTryMode(false); setCurrentPly(p => Math.min(history.length - 1, p + 1)); }, [history.length]);
  const jumpToStart = useCallback(() => { setTryMode(false); setCurrentPly(-1); }, []);
  const jumpToEnd = useCallback(() => { setTryMode(false); setCurrentPly(history.length - 1); }, [history.length]);

  const jumpToNextMistake = useCallback(() => {
    setTryMode(false);
    for (let i = currentPly + 1; i < analyses.length; i++) {
      if (analyses[i] && MISTAKE_CLASSES.has(analyses[i].classification)) {
        setCurrentPly(i);
        return;
      }
    }
  }, [currentPly, analyses]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!gameData) return;
    function onKey(e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowRight') { e.preventDefault(); goNext(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev(); }
      else if (e.key === 'Home') { e.preventDefault(); jumpToStart(); }
      else if (e.key === 'End') { e.preventDefault(); jumpToEnd(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); jumpToNextMistake(); }
      else if (e.key === 't' || e.key === 'T') { if (currentAnalysis?.bestMove && !currentAnalysis.isBest) setTryMode(m => !m); }
      else if (e.key === ' ') { e.preventDefault(); setShowBestArrow(s => !s); }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [gameData, goNext, goPrev, jumpToStart, jumpToEnd, jumpToNextMistake, currentAnalysis]);

  if (!gameData) {
    return (
      <div className="page-enter flex items-center justify-center min-h-[50vh]">
        <div className="text-text-dim">Loading game…</div>
      </div>
    );
  }

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

  const bestArrow = (!tryMode && showBestArrow && currentAnalysis && !currentAnalysis.isBest && currentAnalysis.bestMove)
    ? [[currentAnalysis.bestMove.slice(0, 2), currentAnalysis.bestMove.slice(2, 4)]]
    : [];

  const progressPct = progress.total > 0 ? (progress.current / progress.total) * 100 : 0;
  const canTryMode = currentAnalysis?.bestMove && !currentAnalysis.isBest;

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
        <div className="flex flex-wrap gap-2 items-center">
          {/* Perspective toggle */}
          <div className="flex rounded-lg bg-bg-card border border-bg-hover overflow-hidden text-xs">
            <button
              onClick={() => setEvalPerspective('objective')}
              className={`px-3 py-1.5 transition-all ${evalPerspective === 'objective' ? 'bg-gold text-bg font-semibold' : 'text-text-dim hover:text-text'}`}
            >Objective</button>
            <button
              onClick={() => setEvalPerspective('your')}
              className={`px-3 py-1.5 transition-all ${evalPerspective === 'your' ? 'bg-gold text-bg font-semibold' : 'text-text-dim hover:text-text'}`}
            >Your side</button>
          </div>
          {/* Depth toggle */}
          <div className="flex rounded-lg bg-bg-card border border-bg-hover overflow-hidden text-xs">
            {[14, 18].map(d => (
              <button
                key={d}
                onClick={() => setDepth(d)}
                disabled={!analysisComplete && d !== depth}
                className={`px-3 py-1.5 font-medium transition-all ${depth === d ? 'bg-gold text-bg' : 'text-text-dim hover:text-text'}`}
              >
                {d === 18 ? `Deep ${d}` : `Quick ${d}`}
              </button>
            ))}
          </div>
          <button onClick={newGame} className="px-3 py-1.5 rounded-lg bg-bg-card border border-bg-hover text-xs hover:bg-bg-hover transition-all">
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
            <span>
              {progress.phase === 'pass2' ? 'Deep analysis on candidates' : 'Quick scan'}
              {' · '}
              <span className="tabular-nums">{progress.current} / {progress.total}</span>
            </span>
            <span className="tabular-nums">{Math.round(progressPct)}%</span>
          </div>
          <div className="h-1.5 bg-bg-hover rounded-full overflow-hidden">
            <div className="h-full bg-gold transition-all duration-200" style={{ width: `${progressPct}%` }} />
          </div>
          {progress.phase === 'pass1' && progress.current > 0 && (
            <div className="text-[10px] text-text-dim/70 mt-1">Classifications appear as moves are scanned. Critical positions get a second deeper pass.</div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        {/* Board column */}
        <div className="max-w-[560px] mx-auto w-full lg:mx-0 board-fit-mobile">
          {tryMode && currentAnalysis ? (
            <TryModePanel
              analysis={currentAnalysis}
              orientation={orientation}
              onExit={() => setTryMode(false)}
            />
          ) : (
            <ChessBoard
              fen={displayFen}
              orientation={orientation}
              movable={false}
              turnColor={(new Chess(displayFen).turn() === 'w') ? 'white' : 'black'}
              lastMove={displayLastMove}
              arrows={bestArrow}
            />
          )}

          {/* Move controls */}
          <div className="flex items-center gap-2 mt-3">
            <button onClick={jumpToStart} disabled={currentPly === -1}
              className="px-3 py-2 rounded-lg bg-bg-card border border-bg-hover text-sm hover:bg-bg-hover transition-all disabled:opacity-30"
              aria-label="Go to start" title="Home">|◀</button>
            <button onClick={goPrev} disabled={currentPly === -1}
              className="px-3 py-2 rounded-lg bg-bg-card border border-bg-hover text-sm hover:bg-bg-hover transition-all disabled:opacity-30"
              aria-label="Previous" title="←">◀</button>
            <div className="flex-1 text-center text-sm text-text-dim tabular-nums">
              {currentPly === -1 ? 'Start' : `Move ${Math.floor(currentPly / 2) + 1}${currentPly % 2 === 0 ? '' : '…'}`}
            </div>
            <button onClick={goNext} disabled={currentPly >= history.length - 1}
              className="px-3 py-2 rounded-lg bg-bg-card border border-bg-hover text-sm hover:bg-bg-hover transition-all disabled:opacity-30"
              aria-label="Next" title="→">▶</button>
            <button onClick={jumpToEnd} disabled={currentPly >= history.length - 1}
              className="px-3 py-2 rounded-lg bg-bg-card border border-bg-hover text-sm hover:bg-bg-hover transition-all disabled:opacity-30"
              aria-label="Go to end" title="End">▶|</button>
            <button onClick={jumpToNextMistake} disabled={!analysisComplete}
              className="px-3 py-2 rounded-lg bg-bg-card border border-bg-hover text-sm hover:bg-bg-hover transition-all disabled:opacity-30 hidden sm:block"
              aria-label="Next mistake" title="↑ — jump to next mistake">↑?</button>
            {canTryMode && (
              <button
                onClick={() => setTryMode(t => !t)}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${tryMode ? 'bg-gold text-bg' : 'bg-bg-card border border-gold/40 text-gold hover:bg-gold/10'}`}
                title="T — try the engine's move yourself"
              >
                {tryMode ? '✓ Trying' : 'Try it'}
              </button>
            )}
          </div>

          {/* Per-move detail card */}
          {currentAnalysis ? (
            <MoveDetail
              analysis={currentAnalysis}
              showBestArrow={showBestArrow}
              setShowBestArrow={setShowBestArrow}
              evalPerspective={evalPerspective}
              playerColor={orientation}
            />
          ) : (
            <div className="mt-3 card-base p-4 text-sm text-text-dim">
              Starting position. Step through with ▶ or use <kbd className="px-1.5 py-0.5 bg-bg-hover rounded text-[10px]">→</kbd> on your keyboard.
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {summary && <SummaryCard summary={summary} />}
          {analysisComplete && analyses.length > 0 && (
            <PatternCard analyses={analyses} playerColor={orientation} />
          )}
          <EvalGraph analyses={analyses} currentPly={currentPly} onJump={jumpTo} evalPerspective={evalPerspective} playerColor={orientation} />

          {/* Move list with view toggle */}
          <div>
            <div className="flex rounded-lg bg-bg-card border border-bg-hover overflow-hidden text-xs mb-2 w-fit">
              <button
                onClick={() => setMoveListView('order')}
                className={`px-3 py-1.5 transition-all ${moveListView === 'order' ? 'bg-gold text-bg font-semibold' : 'text-text-dim hover:text-text'}`}
              >Chronological</button>
              <button
                onClick={() => setMoveListView('worst')}
                className={`px-3 py-1.5 transition-all ${moveListView === 'worst' ? 'bg-gold text-bg font-semibold' : 'text-text-dim hover:text-text'}`}
              >Worst first</button>
            </div>
            {moveListView === 'order' ? (
              <MoveList history={history} currentIndex={currentPly} onSelectMove={jumpTo} classifications={classifications} />
            ) : (
              <WorstMovesList analyses={analyses} currentPly={currentPly} onSelect={jumpTo} />
            )}
          </div>

          {analysisComplete && (
            <div className="text-[10px] text-text-dim/60 leading-relaxed px-1">
              <span className="font-semibold uppercase tracking-wide">Shortcuts:</span> <kbd>←</kbd> <kbd>→</kbd> step · <kbd>↑</kbd> next mistake · <kbd>T</kbd> try the move · <kbd>Space</kbd> toggle hint arrow
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TryModePanel({ analysis, orientation, onExit }) {
  // Construct a puzzle from the analysis: fen is fenBefore, the only correct move is the engine's bestMove.
  // PuzzleSolver expects moves[0] to be the opponent's setup; pass an empty setup by using a wrapper FEN.
  // We pass moves: [bestMove] with no setup. But our PuzzleSolver auto-plays moves[0]. Hack: construct fen
  // with opposite STM, and prepend a "null" move? Simpler: just give a custom puzzle where the position is
  // already the player's turn — and treat moves[0] as the answer. We'll embed via a lightweight component below.
  return (
    <div>
      <ManualPuzzleBoard
        fen={analysis.fenBefore}
        expectedUci={analysis.bestMove}
        orientation={orientation}
      />
      <div className="mt-2 flex items-center justify-between gap-2">
        <div className="text-xs text-text-dim">Find the engine's recommended move. Press <kbd className="px-1 py-0.5 bg-bg-hover rounded text-[10px]">T</kbd> to exit.</div>
        <button onClick={onExit} className="text-xs px-3 py-1.5 rounded-lg bg-bg-card border border-bg-hover hover:bg-bg-hover">Stop</button>
      </div>
    </div>
  );
}

// Lightweight puzzle board — single expected move, immediate feedback.
function ManualPuzzleBoard({ fen, expectedUci, orientation }) {
  const [boardFen, setBoardFen] = useState(fen);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong' | null
  const [lastMove, setLastMove] = useState(null);
  const gameRef = useRef(new Chess(fen));

  useEffect(() => {
    gameRef.current = new Chess(fen);
    setBoardFen(fen);
    setFeedback(null);
    setLastMove(null);
  }, [fen]);

  function dests() {
    const map = new Map();
    for (const m of gameRef.current.moves({ verbose: true })) {
      if (!map.has(m.from)) map.set(m.from, []);
      map.get(m.from).push(m.to);
    }
    return map;
  }

  function handleMove(from, to) {
    const expectedFrom = expectedUci.slice(0, 2);
    const expectedTo = expectedUci.slice(2, 4);
    const g = new Chess(gameRef.current.fen());
    const m = g.move({ from, to, promotion: expectedUci[4] || 'q' });
    if (!m) return;
    setBoardFen(g.fen());
    setLastMove([from, to]);
    gameRef.current = g;
    if (from === expectedFrom && to === expectedTo) {
      setFeedback('correct');
    } else {
      setFeedback('wrong');
    }
  }

  function retry() {
    gameRef.current = new Chess(fen);
    setBoardFen(fen);
    setFeedback(null);
    setLastMove(null);
  }

  const stm = gameRef.current.turn() === 'w' ? 'white' : 'black';
  return (
    <div>
      <ChessBoard
        fen={boardFen}
        orientation={orientation}
        movable={feedback === null}
        dests={feedback === null ? dests() : new Map()}
        turnColor={stm}
        onMove={handleMove}
        lastMove={lastMove}
      />
      {feedback === 'correct' && (
        <div className="mt-2 text-sm text-correct font-semibold flex justify-between items-center">
          <span>✓ That's the engine's move.</span>
          <button onClick={retry} className="text-xs px-3 py-1.5 rounded-lg bg-bg-card border border-bg-hover hover:bg-bg-hover">Retry</button>
        </div>
      )}
      {feedback === 'wrong' && (
        <div className="mt-2 text-sm text-incorrect font-semibold flex justify-between items-center">
          <span>✗ Not the recommended move.</span>
          <button onClick={retry} className="text-xs px-3 py-1.5 rounded-lg bg-bg-card border border-bg-hover hover:bg-bg-hover">Try again</button>
        </div>
      )}
    </div>
  );
}

function MoveDetail({ analysis, showBestArrow, setShowBestArrow, evalPerspective, playerColor }) {
  const meta = CLASS_META[analysis.classification];
  const moveColorLabel = analysis.color === 'white' ? 'White' : 'Black';
  const moveNumber = Math.floor(analysis.ply / 2) + 1;

  const playedExplanation = explainPlayedMove(analysis);
  const bestExplanation = explainBestMove(analysis);

  // Pick eval value to display: objective = always white POV; your = always you (playerColor)
  let evalCp = analysis.cpAfter * (analysis.color === 'white' ? 1 : -1); // White POV
  if (evalPerspective === 'your') {
    if (playerColor === 'black') evalCp = -evalCp;
  }

  return (
    <div className={`mt-3 card-base p-4 border-l-4 ${meta?.ring?.replace('ring-', 'border-') || 'border-bg-hover'}`}>
      <div className="flex items-baseline justify-between mb-2">
        <div className="flex items-baseline gap-2">
          <span className={`text-2xl font-bold ${meta?.color}`}>{meta?.symbol}</span>
          <span className={`text-base font-semibold ${meta?.color}`}>{meta?.label}</span>
        </div>
        <span className="text-xs text-text-dim tabular-nums">
          {moveColorLabel} · move {moveNumber}
        </span>
      </div>

      <p className="text-sm text-text mb-2">
        <span className="font-semibold">{analysis.san}</span>
        {playedExplanation && <> — {playedExplanation}</>}
      </p>

      {bestExplanation && !analysis.isBest && (
        <div className="mb-3 text-sm text-text-dim border-l-2 border-gold/40 pl-2.5">
          <span className="text-gold font-semibold">{analysis.bestMoveSan}:</span> {bestExplanation.replace(`${analysis.bestMoveSan} `, '').replace(`${analysis.bestMoveSan}—`, '—')}
        </div>
      )}

      <div className="grid grid-cols-3 gap-2 text-xs">
        <Stat label="CPL" value={analysis.cpl.toFixed(0)} />
        <Stat label={evalPerspective === 'your' ? 'Eval (you)' : 'Eval (W)'} value={formatEval(evalCp)} />
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

function PatternCard({ analyses, playerColor }) {
  const { observations, avgMistakeCpl } = patternsFromAnalyses(analyses, playerColor);
  if (observations.length === 0) return null;
  return (
    <div className="card-base p-4">
      <div className="text-xs text-text-dim uppercase tracking-wide mb-2">Your pattern this game</div>
      <ul className="space-y-1 text-sm">
        {observations.slice(0, 4).map((o, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-gold mt-0.5">·</span>
            <span>{o}</span>
          </li>
        ))}
      </ul>
      {avgMistakeCpl > 0 && (
        <div className="text-xs text-text-dim mt-3">Average mistake severity: {(avgMistakeCpl / 100).toFixed(1)} pawns.</div>
      )}
    </div>
  );
}

function WorstMovesList({ analyses, currentPly, onSelect }) {
  const sorted = analyses
    .filter(a => a && a.cpl > 25 && !['book', 'forced'].includes(a.classification))
    .slice()
    .sort((a, b) => b.cpl - a.cpl);
  if (sorted.length === 0) {
    return <div className="card-base p-4 text-sm text-text-dim text-center">No significant mistakes in this game. 🙌</div>;
  }
  return (
    <div className="card-base p-2 max-h-[28rem] overflow-y-auto">
      {sorted.map(a => {
        const meta = CLASS_META[a.classification];
        const isActive = a.ply === currentPly;
        const moveNumber = Math.floor(a.ply / 2) + 1;
        return (
          <button
            key={a.ply}
            onClick={() => onSelect(a.ply)}
            className={`w-full text-left p-2 rounded-md transition-all flex items-center gap-2 ${isActive ? 'bg-gold/15' : 'hover:bg-bg-hover/40'}`}
          >
            <span className={`text-lg font-bold ${meta?.color}`}>{meta?.symbol}</span>
            <div className="flex-1 min-w-0">
              <div className="text-sm">
                <span className="text-text-dim mr-1">{moveNumber}.{a.color === 'black' ? '..' : ''}</span>
                <span className="font-semibold">{a.san}</span>
                {a.bestMoveSan && !a.isBest && (
                  <span className="text-text-dim/70 text-xs ml-1.5">→ {a.bestMoveSan}</span>
                )}
              </div>
              <div className="text-[10px] text-text-dim">
                {a.color === 'white' ? 'White' : 'Black'} · CPL {a.cpl.toFixed(0)}
              </div>
            </div>
          </button>
        );
      })}
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
