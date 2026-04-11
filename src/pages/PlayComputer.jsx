import { useState, useEffect, useRef } from 'react';
import { Chess } from 'chess.js';
import ChessBoard from '../components/ChessBoard';
import MoveList from '../components/MoveList';
import StockfishService, { ELO_PRESETS } from '../services/stockfishService';
import { progressService } from '../services/progressService';

export default function PlayComputer() {
  const [phase, setPhase] = useState('setup');
  const [playerColor, setPlayerColor] = useState('white');
  const [levelIndex, setLevelIndex] = useState(4);
  const [fen, setFen] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  const [history, setHistory] = useState([]);
  const [moveIndex, setMoveIndex] = useState(-1);
  const [evaluation, setEvaluation] = useState(0);
  const [thinking, setThinking] = useState(false);
  const [result, setResult] = useState(null);
  const [lastMove, setLastMove] = useState(null);
  const [hintArrow, setHintArrow] = useState(null);
  const gameRef = useRef(null);
  const engineRef = useRef(null);
  const hintEngineRef = useRef(null);
  const waitingForHint = useRef(false);

  const preset = ELO_PRESETS[levelIndex];

  useEffect(() => {
    return () => {
      if (engineRef.current) engineRef.current.destroy();
      if (hintEngineRef.current) hintEngineRef.current.destroy();
    };
  }, []);

  function startGame() {
    if (engineRef.current) engineRef.current.destroy();
    if (hintEngineRef.current) hintEngineRef.current.destroy();

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
          checkEnd(g2);
        }
        setThinking(false);
      }, 400);
    };

    engine.onEval = (score) => {
      // Stockfish score is from the side to move (engine's turn).
      // Convert to White's perspective for objective display.
      setEvaluation(playerColor === 'white' ? -score : score);
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

      if (playerColor === 'black') {
        setThinking(true);
        engine.getBestMove(g.fen());
      }
    });
  }

  function checkEnd(g) {
    if (g.isCheckmate()) {
      const winner = g.turn() === 'w' ? 'black' : 'white';
      setResult(winner === playerColor ? 'You win!' : 'Computer wins!');
      setPhase('ended');
      progressService.logActivity(`Played vs computer (${preset.label}) — ${winner === playerColor ? 'Won' : 'Lost'}`);
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

  const turnColor = gameRef.current ? (gameRef.current.turn() === 'w' ? 'white' : 'black') : 'white';
  const isPlayerTurn = turnColor === playerColor && !thinking;
  // evaluation is stored from White's perspective
  const evalClamped = Math.max(-5, Math.min(5, evaluation));
  const evalPct = ((evalClamped + 5) / 10) * 100;

  if (phase === 'setup') {
    return (
      <div className="page-enter max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-3xl font-display text-gold mb-1">Play vs Computer</h1>
        <p className="text-text-dim text-base mb-10">Challenge Stockfish at any level.</p>
        <div className="card-base p-6 space-y-8">
          <div>
            <label className="text-sm text-text-dim block mb-3 font-medium">Play as</label>
            <div className="flex gap-3">
              {['white', 'black'].map(color => (
                <button key={color} onClick={() => setPlayerColor(color)}
                  className={`flex-1 py-3 rounded-lg text-base font-semibold transition-all btn-press ${playerColor === color ? 'bg-gold text-bg' : 'bg-bg-hover text-text-dim hover:text-text'}`}>
                  {color === 'white' ? '\u2654 White' : '\u265A Black'}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="flex justify-between items-baseline mb-3">
              <label className="text-sm text-text-dim font-medium">Difficulty</label>
              <span className="text-gold font-bold tabular-nums">{preset.elo} ELO</span>
            </div>
            <input type="range" min={0} max={ELO_PRESETS.length - 1} value={levelIndex} onChange={e => setLevelIndex(parseInt(e.target.value))} className="w-full accent-gold h-2 rounded-full appearance-none bg-bg-hover cursor-pointer" />
            <div className="flex justify-between mt-2">
              <span className="text-xs text-text-dim">400</span>
              <span className="text-base font-semibold text-text">{preset.label}</span>
              <span className="text-xs text-text-dim">2600</span>
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
    <div className="page-enter max-w-6xl mx-auto px-4 sm:px-6 py-10">
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

      <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] lg:grid-cols-[1fr_320px] gap-6 sm:gap-8">
        <div className="w-full max-w-[560px] md:sticky md:top-4 self-start">
          <div className="flex gap-2">
            <div className="w-4 rounded-full overflow-hidden bg-bg-hover flex-shrink-0 relative" title={`Eval: ${evaluation > 0 ? '+' : ''}${evaluation.toFixed(1)}`}>
              <div className="absolute bottom-0 left-0 right-0 bg-white transition-all duration-500 ease-out rounded-full" style={{ height: `${evalPct}%` }} />
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
                <button onClick={() => setPhase('setup')} className="flex-1 py-2.5 rounded-lg bg-gold text-bg font-semibold text-base hover:bg-gold-dim transition-all btn-press">New Game</button>
                <button onClick={startGame} className="flex-1 py-2.5 rounded-lg bg-bg-card border border-bg-hover text-base hover:bg-bg-hover transition-all btn-press">Rematch</button>
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
  );
}
