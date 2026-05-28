import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Chess } from 'chess.js';
import ChessBoard from '../components/ChessBoard';
import MoveList from '../components/MoveList';
import StockfishService, { ELO_PRESETS } from '../services/stockfishService';
import { progressService } from '../services/progressService';

function getInitialLevel(searchParams) {
  const elo = parseInt(searchParams.get('elo'));
  if (!elo) return 4;
  // Find the closest ELO preset
  let best = 0;
  let bestDiff = Math.abs(ELO_PRESETS[0].elo - elo);
  for (let i = 1; i < ELO_PRESETS.length; i++) {
    const diff = Math.abs(ELO_PRESETS[i].elo - elo);
    if (diff < bestDiff) { best = i; bestDiff = diff; }
  }
  return best;
}

// Time-control presets. `initial` and `increment` are in seconds. `null` for no clock.
const TIME_CONTROLS = [
  { id: 'untimed', label: 'No clock', initial: null, increment: null },
  { id: '3+0',  label: '3+0',  initial: 180,  increment: 0  },
  { id: '5+0',  label: '5+0',  initial: 300,  increment: 0  },
  { id: '10+5', label: '10+5', initial: 600,  increment: 5  },
  { id: '15+10',label: '15+10', initial: 900,  increment: 10 },
  { id: '30+0', label: '30+0', initial: 1800, increment: 0  },
];
const DEFAULT_TC_ID = '10+5';

function fmtClock(ms) {
  if (ms == null) return '—';
  const s = Math.max(0, Math.ceil(ms / 1000));
  const mm = Math.floor(s / 60);
  const ss = s % 60;
  return `${mm}:${ss.toString().padStart(2, '0')}`;
}

export default function PlayComputer() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [phase, setPhase] = useState('setup');
  const [colorChoice, setColorChoice] = useState('white');
  const [playerColor, setPlayerColor] = useState('white');
  const [levelIndex, setLevelIndex] = useState(() => getInitialLevel(searchParams));
  const [tcId, setTcId] = useState(DEFAULT_TC_ID);
  const [fen, setFen] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  const [history, setHistory] = useState([]);
  const [moveIndex, setMoveIndex] = useState(-1);
  const [evaluation, setEvaluation] = useState(0);
  const [thinking, setThinking] = useState(false);
  const [result, setResult] = useState(null);
  const [lastMove, setLastMove] = useState(null);
  const [hintArrow, setHintArrow] = useState(null);
  const [whiteTime, setWhiteTime] = useState(null);
  const [blackTime, setBlackTime] = useState(null);
  const gameRef = useRef(null);
  // Engine callbacks (onMove) are created once in startGame, before setPlayerColor
  // has committed, so they'd capture a stale playerColor. Read colour from this ref instead.
  const playerColorRef = useRef('white');
  const engineRef = useRef(null);
  const hintEngineRef = useRef(null);
  const waitingForHint = useRef(false);
  const tickRef = useRef(null);
  const lastTickRef = useRef(null);

  const preset = ELO_PRESETS[levelIndex];
  const timeControl = TIME_CONTROLS.find(t => t.id === tcId) || TIME_CONTROLS[0];
  const isTimed = timeControl.initial != null;

  useEffect(() => {
    return () => {
      if (engineRef.current) engineRef.current.destroy();
      if (hintEngineRef.current) hintEngineRef.current.destroy();
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, []);

  // Tick the active player's clock during gameplay
  useEffect(() => {
    if (phase !== 'playing' || !isTimed) {
      if (tickRef.current) { clearInterval(tickRef.current); tickRef.current = null; }
      return;
    }
    lastTickRef.current = performance.now();
    tickRef.current = setInterval(() => {
      const now = performance.now();
      const dt = now - (lastTickRef.current || now);
      lastTickRef.current = now;
      const g = gameRef.current;
      if (!g) return;
      const turn = g.turn() === 'w' ? 'white' : 'black';
      if (turn === 'white') {
        setWhiteTime(t => {
          const nx = Math.max(0, (t ?? 0) - dt);
          if (nx === 0) onFlag('white');
          return nx;
        });
      } else {
        setBlackTime(t => {
          const nx = Math.max(0, (t ?? 0) - dt);
          if (nx === 0) onFlag('black');
          return nx;
        });
      }
    }, 100);
    return () => { if (tickRef.current) { clearInterval(tickRef.current); tickRef.current = null; } };
  }, [phase, isTimed]);

  function onFlag(loserColor) {
    if (phase !== 'playing') return;
    const pc = playerColorRef.current;
    setResult(loserColor === pc ? 'Lost on time' : 'Computer lost on time');
    setPhase('ended');
    progressService.logActivity?.(`Played vs computer (${preset.label}) — ${loserColor === pc ? 'Lost on time' : 'Won on time'}`);
  }

  function startGame() {
    if (engineRef.current) engineRef.current.destroy();
    if (hintEngineRef.current) hintEngineRef.current.destroy();

    // Resolve the colour choice now so rematch with "random" re-rolls each time.
    const resolvedColor = colorChoice === 'random'
      ? (Math.random() < 0.5 ? 'white' : 'black')
      : colorChoice;
    setPlayerColor(resolvedColor);
    playerColorRef.current = resolvedColor;

    const g = new Chess();
    gameRef.current = g;
    setFen(g.fen());
    setHistory([]);
    setMoveIndex(-1);
    setResult(null);
    setEvaluation(0);
    setLastMove(null);
    setHintArrow(null);
    setThinking(false);
    if (isTimed) {
      setWhiteTime(timeControl.initial * 1000);
      setBlackTime(timeControl.initial * 1000);
    } else {
      setWhiteTime(null);
      setBlackTime(null);
    }
    setPhase('playing');

    const engine = new StockfishService();
    engineRef.current = engine;
    engine.setLevel(levelIndex);

    engine.onMove = (uci) => {
      setTimeout(() => {
        const cur = gameRef.current;
        if (!cur) return;
        const from = uci.slice(0, 2);
        const to = uci.slice(2, 4);
        const g2 = new Chess(cur.fen());
        const m = g2.move({ from, to, promotion: uci[4] || undefined });
        if (m) {
          gameRef.current = g2;
          setFen(g2.fen());
          setLastMove([from, to]);
          setHistory(h => [...h, { move: m, fen: g2.fen(), san: m.san }]);
          setMoveIndex(i => i + 1);
          // Add increment to the engine's clock (it just moved)
          if (isTimed && timeControl.increment) {
            const engineIsWhite = resolvedColor === 'black';
            if (engineIsWhite) setWhiteTime(t => (t ?? 0) + timeControl.increment * 1000);
            else setBlackTime(t => (t ?? 0) + timeControl.increment * 1000);
          }
          checkEnd(g2);
        }
        setThinking(false);
      }, 400);
    };

    engine.onEval = (score) => {
      // Stockfish score is from the side to move (engine's turn).
      // Convert to White's perspective for objective display.
      setEvaluation(resolvedColor === 'white' ? -score : score);
    };

    engine.init().then(() => {
      // Also init a separate hint engine
      const hintEng = new StockfishService();
      hintEngineRef.current = hintEng;
      hintEng.setLevel(7); // Strong enough for good hints
      hintEng.onMove = (uci) => {
        if (waitingForHint.current) {
          setHintArrow([[uci.slice(0, 2), uci.slice(2, 4)]]);
          waitingForHint.current = false;
        }
      };
      hintEng.init();

      if (resolvedColor === 'black') {
        setThinking(true);
        engine.getBestMove(g.fen());
      }
    });
  }

  function checkEnd(g) {
    const pc = playerColorRef.current;
    if (g.isCheckmate()) {
      const winner = g.turn() === 'w' ? 'black' : 'white';
      setResult(winner === pc ? 'You win!' : 'Computer wins!');
      setPhase('ended');
      progressService.logActivity(`Played vs computer (${preset.label}) — ${winner === pc ? 'Won' : 'Lost'}`);
      progressService.recordActivity();
    } else if (g.isDraw() || g.isStalemate() || g.isThreefoldRepetition() || g.isInsufficientMaterial()) {
      setResult('Draw!');
      setPhase('ended');
    }
  }

  function handleMove(from, to) {
    const g = gameRef.current;
    if (!g || thinking || phase !== 'playing') return;
    if ((g.turn() === 'w' ? 'white' : 'black') !== playerColor) return;

    const g2 = new Chess(g.fen());
    const m = g2.move({ from, to, promotion: 'q' });
    if (!m) return;

    gameRef.current = g2;
    setFen(g2.fen());
    setLastMove([from, to]);
    setHintArrow(null);
    setHistory(h => [...h, { move: m, fen: g2.fen(), san: m.san }]);
    setMoveIndex(i => i + 1);

    // Add increment to the player's clock (they just moved)
    if (isTimed && timeControl.increment) {
      if (playerColor === 'white') setWhiteTime(t => (t ?? 0) + timeControl.increment * 1000);
      else setBlackTime(t => (t ?? 0) + timeControl.increment * 1000);
    }

    if (g2.isGameOver()) { checkEnd(g2); return; }

    setThinking(true);
    setTimeout(() => engineRef.current?.getBestMove(g2.fen()), 300);
  }

  function getLegalDests() {
    const g = gameRef.current;
    if (!g) return new Map();
    const dests = new Map();
    for (const m of g.moves({ verbose: true })) {
      if (!dests.has(m.from)) dests.set(m.from, []);
      dests.get(m.from).push(m.to);
    }
    return dests;
  }

  function takeBack() {
    if (!gameRef.current || history.length < 2) return;
    const newHistory = history.slice(0, -2);
    const newFen = newHistory.length > 0 ? newHistory[newHistory.length - 1].fen : 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    gameRef.current = new Chess(newFen);
    setFen(newFen);
    setHistory(newHistory);
    setMoveIndex(newHistory.length - 1);
    setLastMove(null);
    setHintArrow(null);
    setThinking(false);
  }

  function resign() {
    setResult('You resigned');
    setPhase('ended');
    progressService.logActivity(`Played vs computer (${preset.label}) — Resigned`);
    progressService.recordActivity();
  }

  function requestHint() {
    if (!gameRef.current || thinking || !hintEngineRef.current) return;
    waitingForHint.current = true;
    hintEngineRef.current.getQuickHint(gameRef.current.fen());
  }

  function handleAnalyze() {
    sessionStorage.setItem('enpassant:reviewGame', JSON.stringify({
      history: history.map(h => ({ san: h.san, fen: h.fen })),
      playerColor,
      result,
      label: `vs Stockfish (${preset.label}, ${preset.elo} ELO)`,
      startingFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    }));
    navigate('/play/analysis');
  }

  const turnColor = gameRef.current ? (gameRef.current.turn() === 'w' ? 'white' : 'black') : 'white';
  const isPlayerTurn = turnColor === playerColor && !thinking;
  // evaluation is stored from White's perspective
  const evalClamped = Math.max(-5, Math.min(5, evaluation));
  const evalPct = ((evalClamped + 5) / 10) * 100;

  if (phase === 'setup') {
    return (
      <div className="page-enter max-w-2xl mx-auto px-4 sm:px-6 py-6 lg:py-10">
        <h1 className="text-2xl sm:text-3xl font-display mb-1">Play vs Computer</h1>
        <p className="text-text-dim text-sm mb-6">Challenge Stockfish at any level.</p>
        <div className="card-base p-6 space-y-8">
          <div>
            <label className="text-sm text-text-dim block mb-3 font-medium">Play as</label>
            <div className="flex gap-2 sm:gap-3">
              {[
                { id: 'white', label: '\u2654 White' },
                { id: 'random', label: '\u2684 Random' },
                { id: 'black', label: '\u265A Black' },
              ].map(opt => (
                <button key={opt.id} onClick={() => setColorChoice(opt.id)}
                  className={`flex-1 py-3 rounded-lg text-base font-semibold transition-all btn-press ${colorChoice === opt.id ? 'bg-gold text-bg' : 'bg-bg-hover text-text-dim hover:text-text'}`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="flex justify-between items-baseline mb-3">
              <label className="text-sm text-text-dim font-medium">Difficulty</label>
              <span className="text-gold font-bold tabular-nums">{preset.elo} ELO</span>
            </div>
            <input type="range" min={0} max={ELO_PRESETS.length - 1} value={levelIndex} onChange={e => setLevelIndex(parseInt(e.target.value))} className="w-full accent-gold h-3 sm:h-2 rounded-full appearance-none bg-bg-hover cursor-pointer" />
            <div className="flex justify-between mt-2">
              <span className="text-xs text-text-dim">400</span>
              <span className="text-base font-semibold text-text">{preset.label}</span>
              <span className="text-xs text-text-dim">2600</span>
            </div>
          </div>
          <div>
            <label className="text-sm text-text-dim block mb-3 font-medium">Time control</label>
            <div className="grid grid-cols-3 gap-2">
              {TIME_CONTROLS.map(tc => (
                <button key={tc.id} onClick={() => setTcId(tc.id)}
                  className={`py-2 rounded-lg text-sm font-medium transition-all btn-press ${tcId === tc.id ? 'bg-gold text-bg' : 'bg-bg-hover text-text-dim hover:text-text'}`}>
                  {tc.label}
                </button>
              ))}
            </div>
          </div>
          <button onClick={startGame} className="w-full bg-gold text-bg py-3 rounded-lg font-semibold text-lg hover:bg-gold-dim transition-all btn-press shadow-lg shadow-gold/10">
            Start Game
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile/Tablet: edge-to-edge board layout */}
      {/* Heights: nav=4rem, header~2rem, eval-strip~0.75rem, buttons~3rem, info~2rem, moves~5rem, gaps~2rem, bottom-nav~4.5rem = ~23rem */}
      <div className="lg:hidden page-enter px-2 pt-1 pb-2">
        {/* Header */}
        <div className="flex items-center justify-between mb-1.5 px-1">
          <div className="min-w-0">
            <h1 className="text-base font-display text-gold truncate">
              {phase === 'ended' ? result : thinking ? 'Engine thinking...' : isPlayerTurn ? 'Your move' : ''}
            </h1>
            <p className="text-text-dim text-[11px]">vs Stockfish ({preset.label} — {preset.elo})</p>
          </div>
          {gameRef.current?.isCheck() && phase === 'playing' && (
            <span className="bg-incorrect/15 text-incorrect border border-incorrect/20 px-2 py-0.5 rounded text-xs font-semibold">Check!</span>
          )}
          {thinking && !gameRef.current?.isCheck() && (
            <div className="flex gap-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          )}
        </div>

        {/* Horizontal eval bar. White fill = White's advantage, anchored on White's
            side of the board (right when the board is flipped for a Black player). */}
        <div className="h-2 rounded-full overflow-hidden bg-bg-hover relative mb-1" title={`Eval: ${evaluation > 0 ? '+' : ''}${evaluation.toFixed(1)}`}>
          <div
            className={`absolute top-0 bottom-0 bg-white transition-all duration-500 ease-out rounded-full ${playerColor === 'black' ? 'right-0' : 'left-0'}`}
            style={{ width: `${evalPct}%` }}
          />
        </div>

        {/* Opponent clock (above board) */}
        {isTimed && (
          <ClockChip
            label="Engine"
            ms={playerColor === 'white' ? blackTime : whiteTime}
            active={turnColor !== playerColor && phase === 'playing'}
            className="mb-1"
          />
        )}

        {/* Board — edge-to-edge */}
        <div style={{ width: `min(calc(100dvh - ${isTimed ? '26rem' : '23rem'}), calc(100vw - 1rem))`, height: `min(calc(100dvh - ${isTimed ? '26rem' : '23rem'}), calc(100vw - 1rem))` }} className="mx-auto">
          <ChessBoard
            fen={fen}
            orientation={playerColor}
            movable={isPlayerTurn && phase === 'playing'}
            dests={isPlayerTurn && phase === 'playing' ? getLegalDests() : new Map()}
            turnColor={turnColor}
            onMove={handleMove}
            lastMove={lastMove}
            arrows={hintArrow || []}
          />
        </div>

        {/* Player clock (below board) */}
        {isTimed && (
          <ClockChip
            label="You"
            ms={playerColor === 'white' ? whiteTime : blackTime}
            active={turnColor === playerColor && phase === 'playing'}
            className="mt-1"
          />
        )}

        {/* Buttons — bigger, fill space */}
        <div className="flex gap-2 mt-2">
          {phase === 'playing' && (
            <>
              <button onClick={takeBack} disabled={history.length < 2 || thinking} className="flex-1 py-2.5 rounded-lg bg-bg-card border border-bg-hover text-sm font-medium hover:bg-bg-hover transition-all btn-press disabled:opacity-30">Takeback</button>
              <button onClick={requestHint} disabled={thinking || !isPlayerTurn} className="flex-1 py-2.5 rounded-lg bg-bg-card border border-bg-hover text-sm font-medium hover:bg-bg-hover transition-all btn-press disabled:opacity-30">{hintArrow ? 'Hint ✓' : 'Hint'}</button>
              <button onClick={resign} className="flex-1 py-2.5 rounded-lg bg-incorrect/10 border border-incorrect/20 text-incorrect text-sm font-medium hover:bg-incorrect/20 transition-all btn-press">Resign</button>
            </>
          )}
          {phase === 'ended' && (
            <>
              <button onClick={handleAnalyze} disabled={history.length === 0} className="flex-1 py-3 rounded-lg bg-gold text-bg font-semibold text-base hover:bg-gold-dim transition-all btn-press disabled:opacity-40">Analyse</button>
              <button onClick={startGame} className="flex-1 py-3 rounded-lg bg-bg-card border border-bg-hover text-sm font-medium hover:bg-bg-hover transition-all btn-press">Rematch</button>
              <button onClick={() => setPhase('setup')} className="flex-1 py-3 rounded-lg bg-bg-card border border-bg-hover text-sm font-medium hover:bg-bg-hover transition-all btn-press">New</button>
            </>
          )}
        </div>

        {/* Info strip + notation */}
        <div className="mt-2 flex gap-3 items-center text-xs card-base px-3 py-2">
          <span><span className="text-text-dim mr-1">Moves</span><span className="tabular-nums">{Math.ceil(history.length / 2)}</span></span>
          <span><span className="text-text-dim mr-1">Eval</span><span className={`tabular-nums font-medium ${evaluation > 0.5 ? 'text-correct' : evaluation < -0.5 ? 'text-incorrect' : 'text-text-dim'}`}>{evaluation > 0 ? '+' : ''}{evaluation.toFixed(1)}</span></span>
        </div>
        <div className="mt-1 max-h-20 overflow-y-auto">
          <MoveList history={history} currentIndex={moveIndex} onSelectMove={() => {}} />
        </div>
      </div>

      {/* Desktop: side-by-side layout */}
      <div className="hidden lg:block page-enter max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-display text-gold mb-0.5">
              {phase === 'ended' ? result : thinking ? 'Engine thinking...' : isPlayerTurn ? 'Your move' : ''}
            </h1>
            <p className="text-text-dim text-sm">vs Stockfish ({preset.label} — {preset.elo} ELO)</p>
          </div>
          {gameRef.current?.isCheck() && phase === 'playing' && (
            <span className="bg-incorrect/15 text-incorrect border border-incorrect/20 px-3 py-1 rounded-lg text-sm font-semibold">Check!</span>
          )}
        </div>
        <div className="grid grid-cols-[1fr_320px] gap-8">
          <div className="max-w-[560px] sticky top-4 self-start">
            {/* Opponent clock above board */}
            {isTimed && (
              <ClockChip
                label={`Stockfish (${preset.label})`}
                ms={playerColor === 'white' ? blackTime : whiteTime}
                active={turnColor !== playerColor && phase === 'playing'}
                className="mb-2"
              />
            )}
            <div className="flex gap-2">
              <div className="w-4 rounded-full overflow-hidden bg-bg-hover flex-shrink-0 relative" title={`Eval: ${evaluation > 0 ? '+' : ''}${evaluation.toFixed(1)}`}>
                {/* White fill anchored on White's side of the board — top when flipped for Black. */}
                <div className={`absolute left-0 right-0 bg-white transition-all duration-500 ease-out rounded-full ${playerColor === 'black' ? 'top-0' : 'bottom-0'}`} style={{ height: `${evalPct}%` }} />
              </div>
              <div className="flex-1">
                <ChessBoard
                  fen={fen}
                  orientation={playerColor}
                  movable={isPlayerTurn && phase === 'playing'}
                  dests={isPlayerTurn && phase === 'playing' ? getLegalDests() : new Map()}
                  turnColor={turnColor}
                  onMove={handleMove}
                  lastMove={lastMove}
                  arrows={hintArrow || []}
                />
              </div>
            </div>
            {/* Player clock below board */}
            {isTimed && (
              <ClockChip
                label="You"
                ms={playerColor === 'white' ? whiteTime : blackTime}
                active={turnColor === playerColor && phase === 'playing'}
                className="mt-2"
              />
            )}
            <div className="flex gap-2 mt-3">
              {phase === 'playing' && (
                <>
                  <button onClick={takeBack} disabled={history.length < 2 || thinking} className="flex-1 py-2 rounded-lg bg-bg-card border border-bg-hover text-base hover:bg-bg-hover transition-all btn-press disabled:opacity-30 disabled:cursor-not-allowed">Takeback</button>
                  <button onClick={requestHint} disabled={thinking || !isPlayerTurn} className="flex-1 py-2 rounded-lg bg-bg-card border border-bg-hover text-base hover:bg-bg-hover transition-all btn-press disabled:opacity-30 disabled:cursor-not-allowed">{hintArrow ? 'Hint shown' : 'Hint'}</button>
                  <button onClick={resign} className="flex-1 py-2 rounded-lg bg-incorrect/10 border border-incorrect/20 text-incorrect text-base hover:bg-incorrect/20 transition-all btn-press">Resign</button>
                </>
              )}
              {phase === 'ended' && (
                <>
                  <button onClick={handleAnalyze} disabled={history.length === 0} className="flex-1 py-2.5 rounded-lg bg-gold text-bg font-semibold text-base hover:bg-gold-dim transition-all btn-press disabled:opacity-40">Analyse Game</button>
                  <button onClick={startGame} className="flex-1 py-2.5 rounded-lg bg-bg-card border border-bg-hover text-base hover:bg-bg-hover transition-all btn-press">Rematch</button>
                  <button onClick={() => setPhase('setup')} className="flex-1 py-2.5 rounded-lg bg-bg-card border border-bg-hover text-base hover:bg-bg-hover transition-all btn-press">New Game</button>
                </>
              )}
            </div>
          </div>
          <div className="space-y-4">
            <MoveList history={history} currentIndex={moveIndex} onSelectMove={() => {}} />
            <div className="card-base p-4">
              <div className="flex justify-between text-sm mb-2"><span className="text-text-dim">Moves</span><span className="tabular-nums">{Math.ceil(history.length / 2)}</span></div>
              <div className="flex justify-between text-sm mb-2"><span className="text-text-dim">Evaluation</span><span className={`tabular-nums font-medium ${evaluation > 0.5 ? 'text-correct' : evaluation < -0.5 ? 'text-incorrect' : 'text-text-dim'}`}>{evaluation > 0 ? '+' : ''}{evaluation.toFixed(1)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-text-dim">Engine</span><span>{preset.label} ({preset.elo})</span></div>
            </div>
            {thinking && (
              <div className="card-base p-4 flex items-center gap-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-gold animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-gold animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-gold animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-sm text-text-dim">Stockfish is calculating...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function ClockChip({ label, ms, active, className = '' }) {
  const seconds = Math.ceil((ms ?? 0) / 1000);
  const low = seconds < 30;
  return (
    <div
      className={`flex items-center justify-between rounded-lg px-3 py-1.5 transition-colors ${
        active ? 'bg-gold/15 ring-1 ring-gold/40' : 'bg-bg-card'
      } ${className}`}
    >
      <span className={`text-xs ${active ? 'text-gold' : 'text-text-dim'}`}>{label}</span>
      <span className={`tabular-nums font-display text-2xl ${low ? 'text-incorrect' : active ? 'text-gold' : 'text-text'}`}>
        {fmtClock(ms)}
      </span>
    </div>
  );
}
