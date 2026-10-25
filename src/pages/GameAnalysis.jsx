import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Chess } from 'chess.js';
import ChessBoard from '../components/ChessBoard';
import MoveList from '../components/MoveList';
import EvalGraph from '../components/EvalGraph';
import PuzzleSolver from '../components/PuzzleSolver';
import { analyzeGame } from '../services/gameAnalysisService';
import { CLASS, CLASS_META } from '../services/moveClassification';
import { saveAnalysisMistakes } from '../services/mistakeStore';
import { saveAnalysedGame } from '../services/savedGames';
import { recordGame } from '../services/gameLog';
import { markItemDone } from '../services/dailyPlanService';
import { explainPlayedMove, explainBestMove, patternsFromAnalyses } from '../services/moveExplanation';
import { failedStep, tallySteps, STEP_META } from '../services/spyScanSafe';

const SESSION_KEY = 'enpassant:reviewGame';
const PLAY_FROM_FEN_KEY = 'enpassant:playFromFen';
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
  const [showOptions, setShowOptions] = useState(false);
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
      setAnalyses(gameData.savedAnalyses.map(a => (a && a.failedStep === undefined ? { ...a, failedStep: failedStep(a) } : a)));
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
          // Re-analysing the same game (reload, or a deeper pass) must not save or count it twice.
          if (gameData.logged) return;
          try { sessionStorage.setItem(SESSION_KEY, JSON.stringify({ ...gameData, logged: true })); } catch { /* storage unavailable */ }
          const added = saveAnalysisMistakes(result.analyses, {
            label: gameData.label,
            result: gameData.result,
            date: Date.now(),
            playerColor: gameData.playerColor,
          });
          recordGame({ label: gameData.label, playerColor: gameData.playerColor, analyses: result.analyses });
          markItemDone('play-game');
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
      const a = analyses[i];
      if (a && a.color === (gameData?.playerColor || a.color) && a.classification !== CLASS.INACCURACY && MISTAKE_CLASSES.has(a.classification)) {
        setCurrentPly(i);
        return;
      }
    }
  }, [currentPly, analyses, gameData]);

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
    displayFen = history[currentPly].fen || analyses[currentPly]?.fenAfter || STARTING_FEN;
    const a = analyses[currentPly];
    if (a) displayLastMove = [a.from, a.to];
  }

  const bestArrow = (!tryMode && showBestArrow && currentAnalysis && !currentAnalysis.isBest && currentAnalysis.bestMove)
    ? [[currentAnalysis.bestMove.slice(0, 2), currentAnalysis.bestMove.slice(2, 4)]]
    : [];

  const progressPct = progress.total > 0 ? (progress.current / progress.total) * 100 : 0;
  const canTryMode = currentAnalysis?.bestMove && !currentAnalysis.isBest;

  return (
    <div className="page-enter max-w-6xl mx-auto px-4 sm:px-6 py-4 lg:py-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-display leading-tight">Game Review</h1>
          <p className="text-text-dim text-xs truncate">
            {gameData.label || 'Played game'}{gameData.result ? ` — ${gameData.result}` : ''}
          </p>
        </div>
        <button
          onClick={() => setShowOptions(s => !s)}
          aria-expanded={showOptions}
          className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs transition-all ${showOptions ? 'bg-bg-hover border-bg-hover text-text' : 'bg-bg-card border-bg-hover text-text-dim hover:text-text hover:bg-bg-hover'}`}
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          Options
        </button>
      </div>

      {/* Collapsible options — hidden by default to give the board more room */}
      {showOptions && (
        <div className="mb-3 card-base p-3 flex flex-wrap items-center gap-x-5 gap-y-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-text-dim">Eval view</span>
            <div className="flex rounded-lg bg-bg overflow-hidden text-xs border border-bg-hover">
              <button
                onClick={() => setEvalPerspective('objective')}
                className={`px-3 py-1.5 transition-all ${evalPerspective === 'objective' ? 'bg-gold text-bg font-semibold' : 'text-text-dim hover:text-text'}`}
              >Objective</button>
              <button
                onClick={() => setEvalPerspective('your')}
                className={`px-3 py-1.5 transition-all ${evalPerspective === 'your' ? 'bg-gold text-bg font-semibold' : 'text-text-dim hover:text-text'}`}
              >Your side</button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-text-dim">Engine depth</span>
            <div className="flex rounded-lg bg-bg overflow-hidden text-xs border border-bg-hover">
              {[14, 18].map(d => (
                <button
                  key={d}
                  onClick={() => setDepth(d)}
                  disabled={!analysisComplete && d !== depth}
                  className={`px-3 py-1.5 font-medium transition-all disabled:opacity-40 ${depth === d ? 'bg-gold text-bg' : 'text-text-dim hover:text-text'}`}
                >
                  {d === 18 ? `Deep ${d}` : `Quick ${d}`}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mistakes saved toast */}
      {analysisComplete && mistakesSaved > 0 && (
        <div className="mb-4 card-base p-3 flex items-center justify-between gap-3 flex-wrap">
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

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_22rem] gap-5 lg:items-start">
        {/* Board column */}
        <div className="max-w-[520px] mx-auto w-full lg:mx-0 board-fit-mobile">
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
              turnColor={displayFen.split(' ')[1] === 'b' ? 'black' : 'white'}
              lastMove={displayLastMove}
              arrows={bestArrow}
            />
          )}

          {/* Move controls — large touch targets for phone navigation */}
          <div className="mt-2.5">
            <div className="text-center text-xs text-text-dim tabular-nums mb-2">
              {currentPly === -1
                ? 'Starting position'
                : (() => {
                    // number from the position itself, so games started mid-way count correctly
                    const fenBefore = analyses[currentPly]?.fenBefore;
                    const no = parseInt(fenBefore?.split(' ')[5], 10) || Math.floor(currentPly / 2) + 1;
                    const black = fenBefore ? fenBefore.split(' ')[1] === 'b' : currentPly % 2 === 1;
                    return `Move ${no}${black ? '…' : ''}`;
                  })()}
            </div>
            <div className="flex items-stretch gap-2">
              <button onClick={jumpToStart} disabled={currentPly === -1}
                className="flex-1 flex items-center justify-center py-3.5 sm:py-3 rounded-xl bg-bg-card border border-bg-hover hover:bg-bg-hover active:scale-[0.97] transition-all disabled:opacity-25"
                aria-label="Go to start" title="Home"><StepIcon dir="start" /></button>
              <button onClick={goPrev} disabled={currentPly === -1}
                className="flex-[1.6] flex items-center justify-center py-3.5 sm:py-3 rounded-xl bg-bg-card border border-bg-hover hover:bg-bg-hover active:scale-[0.97] transition-all disabled:opacity-25"
                aria-label="Previous move" title="←"><StepIcon dir="prev" /></button>
              <button onClick={goNext} disabled={currentPly >= history.length - 1}
                className="flex-[1.6] flex items-center justify-center py-3.5 sm:py-3 rounded-xl bg-gold/15 border border-gold/40 text-gold hover:bg-gold/25 active:scale-[0.97] transition-all disabled:opacity-25 disabled:bg-bg-card disabled:border-bg-hover disabled:text-text"
                aria-label="Next move" title="→"><StepIcon dir="next" /></button>
              <button onClick={jumpToEnd} disabled={currentPly >= history.length - 1}
                className="flex-1 flex items-center justify-center py-3.5 sm:py-3 rounded-xl bg-bg-card border border-bg-hover hover:bg-bg-hover active:scale-[0.97] transition-all disabled:opacity-25"
                aria-label="Go to end" title="End"><StepIcon dir="end" /></button>
            </div>
            {/* Secondary actions */}
            <div className="flex gap-2 mt-2">
              <button onClick={jumpToNextMistake} disabled={!analysisComplete}
                className="flex-1 py-2.5 rounded-xl bg-bg-card border border-bg-hover text-sm text-text-dim hover:text-text hover:bg-bg-hover transition-all disabled:opacity-25"
                title="↑ — jump to next mistake">Next mistake</button>
              <button
                onClick={() => {
                  const mine = currentAnalysis && currentAnalysis.color === orientation;
                  sessionStorage.setItem(PLAY_FROM_FEN_KEY, mine ? currentAnalysis.fenBefore : displayFen);
                  navigate('/play');
                }}
                className="flex-1 py-2.5 rounded-xl bg-bg-card border border-bg-hover text-sm text-text-dim hover:text-text hover:bg-bg-hover transition-all"
                title="Play this position out against the engine">Play from here</button>
              {canTryMode && (
                <button
                  onClick={() => setTryMode(t => !t)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${tryMode ? 'bg-gold text-bg' : 'bg-bg-card border border-gold/40 text-gold hover:bg-gold/10'}`}
                  title="T — try the engine's move yourself"
                >
                  {tryMode ? '✓ Trying' : 'Try this move'}
                </button>
              )}
            </div>
          </div>

          {/* Mobile: per-move detail below board. Hidden on desktop (it lives in the sidebar). */}
          <div className="lg:hidden">
            {currentAnalysis ? (
              <MoveDetail
                analysis={currentAnalysis}
                showBestArrow={showBestArrow}
                setShowBestArrow={setShowBestArrow}
                evalPerspective={evalPerspective}
                playerColor={orientation}
              />
            ) : (
              <div className="mt-3 card-base p-3 text-sm text-text-dim">
                Starting position. Step through with ▶ or use <kbd className="px-1.5 py-0.5 bg-bg-hover rounded text-[10px]">→</kbd>.
              </div>
            )}
          </div>
        </div>

        {/* Sidebar — sticky on desktop with its own internal scroll so the page doesn't scroll */}
        <div className="space-y-3 lg:sticky lg:top-3 lg:max-h-[calc(100dvh-1.5rem)] lg:overflow-y-auto lg:pr-1">
          {/* Per-move detail at top on desktop — context for what's selected */}
          <div className="hidden lg:block">
            {currentAnalysis ? (
              <MoveDetail
                analysis={currentAnalysis}
                showBestArrow={showBestArrow}
                setShowBestArrow={setShowBestArrow}
                evalPerspective={evalPerspective}
                playerColor={orientation}
                compact
              />
            ) : (
              <div className="card-base p-3 text-xs text-text-dim">
                Step through moves with ◀ ▶ or <kbd>←</kbd>/<kbd>→</kbd>.
              </div>
            )}
          </div>

          <EvalGraph analyses={analyses} currentPly={currentPly} onJump={jumpTo} evalPerspective={evalPerspective} playerColor={orientation} compact />

          {summary && <SummaryCard summary={summary} />}

          {analysisComplete && analyses.length > 0 && (
            <TurningPointsCard analyses={analyses} playerColor={orientation} currentPly={currentPly} onJump={jumpTo} />
          )}

          {analysisComplete && analyses.length > 0 && (
            <PatternCard analyses={analyses} playerColor={orientation} />
          )}

          {analysisComplete && analyses.length > 0 && (
            <RoutineCard analyses={analyses} playerColor={orientation} currentPly={currentPly} onJump={jumpTo} />
          )}

          {/* Move list with view toggle */}
          <div>
            <div className="flex rounded-md bg-bg-card overflow-hidden text-[11px] mb-1.5 w-fit">
              <button
                onClick={() => setMoveListView('order')}
                className={`px-2.5 py-1 transition-all ${moveListView === 'order' ? 'bg-gold text-bg font-semibold' : 'text-text-dim hover:text-text'}`}
              >Chronological</button>
              <button
                onClick={() => setMoveListView('worst')}
                className={`px-2.5 py-1 transition-all ${moveListView === 'worst' ? 'bg-gold text-bg font-semibold' : 'text-text-dim hover:text-text'}`}
              >Worst first</button>
            </div>
            {moveListView === 'order' ? (
              <MoveList startFen={gameData.startingFen || STARTING_FEN} history={history} currentIndex={currentPly} onSelectMove={jumpTo} classifications={classifications} maxHeightClass="max-h-64 lg:max-h-72" />
            ) : (
              <WorstMovesList analyses={analyses} currentPly={currentPly} onSelect={jumpTo} />
            )}
          </div>

          {analysisComplete && (
            <div className="text-[10px] text-text-dim/60 leading-relaxed px-1">
              <kbd>←</kbd> <kbd>→</kbd> step · <kbd>↑</kbd> next mistake · <kbd>T</kbd> try · <kbd>Space</kbd> hint
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// The card already shows the move, so drop it from the start of the explanation.
function stripLeadingMove(text, san) {
  if (!san || !text.startsWith(san)) return text;
  return text.slice(san.length).replace(/^[\s:—-]+/, '');
}

function StepIcon({ dir }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true" className="block">
      {dir === 'start' && (<><rect x="5" y="5.5" width="2.4" height="13" rx="0.8" /><path d="M19 5.5 L8.5 12 L19 18.5 Z" /></>)}
      {dir === 'prev' && <path d="M16.5 5 L8 12 L16.5 19 Z" />}
      {dir === 'next' && <path d="M7.5 5 L16 12 L7.5 19 Z" />}
      {dir === 'end' && (<><path d="M5 5.5 L15.5 12 L5 18.5 Z" /><rect x="16.6" y="5.5" width="2.4" height="13" rx="0.8" /></>)}
    </svg>
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

function MoveDetail({ analysis, showBestArrow, setShowBestArrow, evalPerspective, playerColor, compact = false }) {
  const meta = CLASS_META[analysis.classification];
  const moveColorLabel = analysis.color === 'white' ? 'White' : 'Black';
  const moveNumber = parseInt(analysis.fenBefore?.split(' ')[5], 10) || Math.floor(analysis.ply / 2) + 1;

  const playedExplanation = explainPlayedMove(analysis);
  const bestExplanation = explainBestMove(analysis);

  // Pick eval value to display: objective = always white POV; your = always you (playerColor)
  let evalCp = analysis.cpAfter * (analysis.color === 'white' ? 1 : -1); // White POV
  if (evalPerspective === 'your') {
    if (playerColor === 'black') evalCp = -evalCp;
  }

  return (
    <div className={`card-base ${compact ? 'p-3 mt-0' : 'p-4 mt-3'}`}>
      <div className={`flex items-baseline justify-between ${compact ? 'mb-1.5' : 'mb-2'}`}>
        <div className="flex items-baseline gap-1.5">
          <span className={`${compact ? 'text-lg' : 'text-2xl'} font-bold ${meta?.color}`}>{meta?.symbol}</span>
          <span className={`${compact ? 'text-sm' : 'text-base'} font-semibold ${meta?.color}`}>{meta?.label}</span>
        </div>
        <span className="text-[11px] text-text-dim tabular-nums">
          {moveColorLabel} · {moveNumber}
        </span>
      </div>

      <p className={`text-text ${compact ? 'text-[13px] mb-1.5 leading-snug' : 'text-sm mb-2'}`}>
        <span className="font-semibold">{analysis.san}</span>
        {playedExplanation && <> — {playedExplanation}</>}
      </p>

      {analysis.failedStep && (
        <div className={`rounded-md ${STEP_META[analysis.failedStep].bg} ${compact ? 'text-[12px] mb-2 px-2.5 py-1.5' : 'text-sm mb-3 px-3 py-2'}`}>
          <span className={`font-semibold ${STEP_META[analysis.failedStep].color}`}>Missed at {STEP_META[analysis.failedStep].label}:</span>{' '}
          <span className="text-text-dim">{STEP_META[analysis.failedStep].blurb.toLowerCase()}.</span>
        </div>
      )}

      {bestExplanation && !analysis.isBest && (
        <div className={`text-text-dim bg-bg-hover/30 rounded-md ${compact ? 'text-[12px] mb-2 px-2.5 py-1.5 leading-snug' : 'text-sm mb-3 px-3 py-2'}`}>
          <span className="text-gold font-semibold">{analysis.bestMoveSan}:</span> {stripLeadingMove(bestExplanation, analysis.bestMoveSan)}
        </div>
      )}

      <div className={`grid grid-cols-3 gap-1.5 ${compact ? 'text-[10px]' : 'text-xs'}`}>
        <Stat label="CPL" value={analysis.classification === CLASS.BOOK ? '—' : analysis.cpl.toFixed(0)} compact={compact} />
        <Stat label={evalPerspective === 'your' ? 'Eval (you)' : 'Eval (W)'} value={formatEval(evalCp)} compact={compact} />
        <Stat label="Accuracy" value={analysis.classification !== CLASS.BOOK && analysis.moveAccuracy != null ? `${analysis.moveAccuracy.toFixed(0)}%` : "—"} compact={compact} />
      </div>

      {analysis.bestMove && !analysis.isBest && !compact && (
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

// The 3 moves where the player's win-percentage swung the most — the game's real
// turning points. Tap one to jump there, then use "Try this move" to find the fix.
function TurningPointsCard({ analyses, playerColor, currentPly, onJump }) {
  const mine = analyses.filter(a => a && a.color === playerColor && (a.classification === 'mistake' || a.classification === 'blunder'));
  const points = mine
    .map(a => ({ a, drop: Math.max(0, a.wpBefore - a.wpAfter) }))
    .sort((x, y) => y.drop - x.drop)
    .slice(0, 3)
    .sort((x, y) => x.a.ply - y.a.ply); // present chronologically
  if (points.length === 0) return null;

  const band = (w) => w >= 75 ? 'winning' : w >= 58 ? 'better' : w >= 42 ? 'equal' : w >= 25 ? 'worse' : 'losing';

  return (
    <div className="card-base p-3">
      <div className="text-[10px] text-text-dim uppercase tracking-wide mb-2 font-semibold">Turning points</div>
      <div className="space-y-1.5">
        {points.map(({ a }) => {
          const meta = CLASS_META[a.classification];
          const moveNumber = parseInt(a.fenBefore?.split(' ')[5], 10) || Math.floor(a.ply / 2) + 1;
          const isActive = a.ply === currentPly;
          return (
            <button
              key={a.ply}
              onClick={() => onJump(a.ply)}
              className={`w-full text-left p-2 rounded-md transition-all ${isActive ? 'bg-gold/15' : 'hover:bg-bg-hover/40'}`}
            >
              <div className="flex items-center gap-2 text-sm">
                <span className={`font-bold ${meta?.color}`}>{meta?.symbol}</span>
                <span className="text-text-dim">{moveNumber}.{a.color === 'black' ? '..' : ''}</span>
                <span className="font-semibold">{a.san}</span>
                {a.bestMoveSan && !a.isBest && <span className="text-text-dim/70 text-xs ml-auto">better: {a.bestMoveSan}</span>}
              </div>
              <div className="text-[11px] text-text-dim mt-0.5">You were {band(a.wpBefore)}, then {band(a.wpAfter)}.</div>
            </button>
          );
        })}
      </div>
      <div className="text-[10px] text-text-dim/70 mt-2">Tap one, then “Try this move” to find the better line.</div>
    </div>
  );
}

function PatternCard({ analyses, playerColor }) {
  const { observations, avgMistakeCpl } = patternsFromAnalyses(analyses, playerColor);
  if (observations.length === 0) return null;
  return (
    <div className="card-base p-3">
      <div className="text-[10px] text-text-dim uppercase tracking-wide mb-1.5 font-semibold">Pattern this game</div>
      <ul className="space-y-1 text-[12px] leading-snug">
        {observations.slice(0, 3).map((o, i) => (
          <li key={i} className="flex items-start gap-1.5">
            <span className="text-gold mt-0.5">·</span>
            <span>{o}</span>
          </li>
        ))}
      </ul>
      {avgMistakeCpl > 0 && (
        <div className="text-[11px] text-text-dim mt-2">Avg mistake severity: {(avgMistakeCpl / 100).toFixed(1)} pawns.</div>
      )}
    </div>
  );
}

// Which step of Spy, Scan, Safe the player's mistakes broke this game.
function RoutineCard({ analyses, playerColor, currentPly, onJump }) {
  const mine = analyses.filter(a => a && a.color === playerColor && a.failedStep);
  const { counts, total, weakest } = tallySteps(mine);
  if (total === 0) return null;
  return (
    <div className="card-base p-3">
      <div className="text-[12px] text-text-dim mb-2 font-semibold">Spy, Scan, Safe</div>
      <div className="space-y-1.5">
        {['spy', 'scan', 'safe'].map(step => {
          const meta = STEP_META[step];
          const plies = mine.filter(a => a.failedStep === step);
          return (
            <div key={step} className="flex items-center gap-2 text-[12px]">
              <span className={`w-10 font-semibold ${meta.color}`}>{meta.label}</span>
              <div className="flex-1 h-1.5 bg-bg-hover rounded-full overflow-hidden">
                <div className="h-full bg-gold/70 rounded-full" style={{ width: `${(counts[step] / total) * 100}%` }} />
              </div>
              <span className="tabular-nums w-4 text-right">{counts[step]}</span>
              <span className="flex gap-1">
                {plies.slice(0, 3).map(a => (
                  <button key={a.ply} onClick={() => onJump(a.ply)} className={`px-1.5 rounded ${a.ply === currentPly ? 'bg-gold/20 text-gold' : 'text-text-dim hover:text-text'}`}>
                    {Math.floor(a.ply / 2) + 1}{a.color === 'black' ? '…' : '.'}
                  </button>
                ))}
              </span>
            </div>
          );
        })}
      </div>
      <div className="text-[11px] text-text-dim mt-2 leading-snug">
        Most mistakes came at <span className="text-text font-medium">{STEP_META[weakest].label}</span>: {STEP_META[weakest].blurb.toLowerCase()}.{' '}
        <Link to={`/thinking-drills?step=${weakest}`} className="text-gold">Drill it →</Link>
      </div>
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
    <div className="card-base p-2 max-h-64 lg:max-h-72 overflow-y-auto">
      {sorted.map(a => {
        const meta = CLASS_META[a.classification];
        const isActive = a.ply === currentPly;
        const moveNumber = parseInt(a.fenBefore?.split(' ')[5], 10) || Math.floor(a.ply / 2) + 1;
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

function Stat({ label, value, compact = false }) {
  return (
    <div className={`bg-bg-hover/40 rounded-md ${compact ? 'px-1.5 py-1' : 'px-2 py-1.5'}`}>
      <div className={`text-text-dim uppercase tracking-wide ${compact ? 'text-[9px]' : 'text-[10px]'}`}>{label}</div>
      <div className={`tabular-nums font-medium ${compact ? 'text-[11px]' : 'text-sm'}`}>{value}</div>
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
    { key: CLASS.BRILLIANT, icon: '!!' },
    { key: CLASS.GREAT, icon: '!' },
    { key: CLASS.BEST, icon: '★' },
    { key: CLASS.EXCELLENT, icon: '◆' },
    { key: CLASS.GOOD, icon: '·' },
    { key: CLASS.BOOK, icon: '⨂' },
    { key: CLASS.INACCURACY, icon: '?!' },
    { key: CLASS.MISTAKE, icon: '?' },
    { key: CLASS.BLUNDER, icon: '??' },
  ];
  return (
    <div className="card-base p-3">
      {/* Accuracy header */}
      <div className="grid grid-cols-3 gap-2 mb-2 items-baseline">
        <div className="text-[10px] text-text-dim uppercase tracking-wide font-semibold">Accuracy</div>
        <div className="text-center text-base font-bold text-gold tabular-nums">
          {summary.white.accuracy != null ? `${summary.white.accuracy.toFixed(0)}%` : '—'}
        </div>
        <div className="text-center text-base font-bold text-gold tabular-nums">
          {summary.black.accuracy != null ? `${summary.black.accuracy.toFixed(0)}%` : '—'}
        </div>
        <div className="text-[10px] text-text-dim/70"></div>
        <div className="text-[10px] text-text-dim/70 text-center uppercase tracking-wide">W</div>
        <div className="text-[10px] text-text-dim/70 text-center uppercase tracking-wide">B</div>
      </div>
      {/* Classification rows */}
      <div className="space-y-0.5">
        {rows.map(r => {
          const meta = CLASS_META[r.key];
          return (
            <div key={r.key} className="grid grid-cols-3 gap-2 items-center py-0.5 px-1 rounded hover:bg-bg-hover/40">
              <div className={`text-[11px] ${meta.color} flex items-center gap-1.5 truncate`}>
                <span className="font-bold w-5 text-center">{r.icon}</span>
                <span className="truncate">{meta.label}</span>
              </div>
              <div className="text-xs tabular-nums text-center">{summary.white[r.key] || 0}</div>
              <div className="text-xs tabular-nums text-center">{summary.black[r.key] || 0}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
