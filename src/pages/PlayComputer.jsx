import { useState, useEffect, useCallback, useRef } from 'react';
import { Chess } from 'chess.js';
import ChessBoard from '../components/ChessBoard';
import MoveList from '../components/MoveList';
import StockfishService, { ELO_PRESETS } from '../services/stockfishService';
import { progressService } from '../services/progressService';

export default function PlayComputer() {
  const [phase, setPhase] = useState('setup'); // setup | playing | ended
  const [playerColor, setPlayerColor] = useState('white');
  const [levelIndex, setLevelIndex] = useState(4);
  const gameRef = useRef(null);
  const [fen, setFen] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  const [history, setHistory] = useState([]);
  const [moveIndex, setMoveIndex] = useState(-1);
  const [evaluation, setEvaluation] = useState(0);
  const [thinking, setThinking] = useState(false);
  const [result, setResult] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [hintMove, setHintMove] = useState(null);
  const engineRef = useRef(null);
  const hintEngineRef = useRef(null);

  const preset = ELO_PRESETS[levelIndex];
  const engineColor = playerColor === 'white' ? 'black' : 'white';

  // Initialize engine
  useEffect(() => {
    return () => {
      if (engineRef.current) engineRef.current.destroy();
      if (hintEngineRef.current) hintEngineRef.current.destroy();
    };
  }, []);

  function startGame() {
    const g = new Chess();
    gameRef.current = g;
    setFen(g.fen());
    setHistory([]);
    setMoveIndex(-1);
    setResult(null);
    setEvaluation(0);
    setShowHint(false);
    setHintMove(null);
    setPhase('playing');

    const engine = new StockfishService();
    engineRef.current = engine;
    engine.setLevel(levelIndex);

    engine.onMove = (uci) => {
      setThinking(false);
      const cur = gameRef.current;
      if (!cur) return;
      const g2 = new Chess(cur.fen());
      const from = uci.slice(0, 2);
      const to = uci.slice(2, 4);
      const promotion = uci[4] || undefined;
      const m = g2.move({ from, to, promotion });
      if (m) {
        gameRef.current = g2;
        const newFen = g2.fen();
        setFen(newFen);
        setHistory(h => {
          const newH = [...h, { move: m, fen: newFen, san: m.san }];
          setMoveIndex(newH.length - 1);
          return newH;
        });
        checkGameEnd(g2);
      }
    };

    engine.onEval = (score) => {
      setEvaluation(playerColor === 'white' ? score : -score);
    };

    engine.init().then(() => {
      // If player is black, engine plays first
      if (playerColor === 'black') {
        setThinking(true);
        engine.getBestMove(g.fen());
      }
    });
  }

  function checkGameEnd(g) {
    if (g.isCheckmate()) {
      const winner = g.turn() === 'w' ? 'black' : 'white';
      setResult(winner === playerColor ? 'You win!' : 'Computer wins!');
      setPhase('ended');
      progressService.logActivity(`Played vs computer (${preset.label}) — ${winner === playerColor ? 'Won' : 'Lost'}`);
      progressService.recordActivity();
    } else if (g.isDraw() || g.isStalemate() || g.isThreefoldRepetition() || g.isInsufficientMaterial()) {
      setResult('Draw!');
      setPhase('ended');
      progressService.logActivity(`Played vs computer (${preset.label}) — Draw`);
      progressService.recordActivity();
    }
  }

  const getLegalDests = useCallback(() => {
    if (!gameRef.current) return new Map();
    const dests = new Map();
    for (const m of gameRef.current.moves({ verbose: true })) {
      if (!dests.has(m.from)) dests.set(m.from, []);
      dests.get(m.from).push(m.to);
    }
    return dests;
  }, [fen]);

  const handleMove = useCallback((from, to) => {
    if (!gameRef.current || thinking || phase !== 'playing') return;
    const turn = gameRef.current.turn() === 'w' ? 'white' : 'black';
    if (turn !== playerColor) return;

    const g = new Chess(gameRef.current.fen());
    const m = g.move({ from, to, promotion: 'q' });
    if (!m) return;

    const newFen = g.fen();
    gameRef.current = g;
    setFen(newFen);
    setHistory(h => {
      const newH = [...h, { move: m, fen: newFen, san: m.san }];
      setMoveIndex(newH.length - 1);
      return newH;
    });
    setShowHint(false);
    setHintMove(null);

    if (checkGameEnd(g) !== undefined) return;

    // Engine responds
    setThinking(true);
    setTimeout(() => {
      engineRef.current?.getBestMove(newFen);
      engineRef.current?.evaluate(newFen);
    }, 200);
  }, [fen, thinking, phase, playerColor]);

  function takeBack() {
    if (!gameRef.current || history.length < 2) return;
    // Undo two moves (player + engine)
    const newHistory = history.slice(0, -2);
    const newFen = newHistory.length > 0 ? newHistory[newHistory.length - 1].fen : 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    const g = new Chess(newFen);
    gameRef.current = g;
    setFen(newFen);
    setHistory(newHistory);
    setMoveIndex(newHistory.length - 1);
    setShowHint(false);
    setHintMove(null);
  }

  function resign() {
    setResult('You resigned');
    setPhase('ended');
    progressService.logActivity(`Played vs computer (${preset.label}) — Resigned`);
    progressService.recordActivity();
  }

  function requestHint() {
    if (!gameRef.current || thinking) return;
    setShowHint(true);
    const hint = new StockfishService();
    hintEngineRef.current = hint;
    hint.setLevel(11); // Use strong engine for hints
    hint.onMove = (uci) => {
      setHintMove({ from: uci.slice(0, 2), to: uci.slice(2, 4) });
      hint.destroy();
    };
    hint.init().then(() => {
      hint.getBestMove(gameRef.current.fen());
    });
  }

  const turnColor = game ? (gameRef.current.turn() === 'w' ? 'white' : 'black') : 'white';
  const isPlayerTurn = turnColor === playerColor;
  const evalBar = Math.max(-5, Math.min(5, evaluation));
  const evalPct = ((evalBar + 5) / 10) * 100;

  // Setup screen
  if (phase === 'setup') {
    return (
      <div className="page-enter max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-3xl font-display text-gold mb-1">Play vs Computer</h1>
        <p className="text-text-dim text-base mb-10">Challenge Stockfish at any level.</p>

        <div className="card-base p-6 space-y-8">
          {/* Color selection */}
          <div>
            <label className="text-sm text-text-dim block mb-3 font-medium">Play as</label>
            <div className="flex gap-3">
              {['white', 'black'].map(color => (
                <button
                  key={color}
                  onClick={() => setPlayerColor(color)}
                  className={`flex-1 py-3 rounded-lg text-base font-semibold transition-all btn-press ${
                    playerColor === color ? 'bg-gold text-bg' : 'bg-bg-hover text-text-dim hover:text-text'
                  }`}
                >
                  {color === 'white' ? '\u2654 White' : '\u265A Black'}
                </button>
              ))}
            </div>
          </div>

          {/* ELO Slider */}
          <div>
            <div className="flex justify-between items-baseline mb-3">
              <label className="text-sm text-text-dim font-medium">Difficulty</label>
              <span className="text-gold font-bold tabular-nums">{preset.elo} ELO</span>
            </div>
            <input
              type="range"
              min={0}
              max={ELO_PRESETS.length - 1}
              value={levelIndex}
              onChange={e => setLevelIndex(parseInt(e.target.value))}
              className="w-full accent-gold h-2 rounded-full appearance-none bg-bg-hover cursor-pointer"
            />
            <div className="flex justify-between mt-2">
              <span className="text-xs text-text-dim">400</span>
              <span className="text-base font-semibold text-text">{preset.label}</span>
              <span className="text-xs text-text-dim">2600</span>
            </div>
          </div>

          {/* Description */}
          <div className="bg-bg-hover/30 rounded-lg p-4">
            <p className="text-sm text-text-dim">
              {levelIndex <= 2 && 'The engine will make frequent mistakes and miss tactics. Good for learning basic checkmate patterns.'}
              {levelIndex >= 3 && levelIndex <= 5 && 'A moderate opponent that plays reasonable moves but can be outplayed with solid tactics.'}
              {levelIndex >= 6 && levelIndex <= 8 && 'A strong opponent that plays positionally. You\'ll need good strategy and tactics to win.'}
              {levelIndex >= 9 && levelIndex <= 10 && 'Near-master level. Requires deep calculation and precise play to find advantages.'}
              {levelIndex >= 11 && 'Full Stockfish power. One of the strongest chess engines in the world. Good luck.'}
            </p>
          </div>

          <button
            onClick={startGame}
            className="w-full bg-gold text-bg py-3 rounded-lg font-semibold text-lg hover:bg-gold-dim transition-all btn-press shadow-lg shadow-gold/10"
          >
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
            {phase === 'ended' ? result : thinking ? 'Engine is thinking...' : isPlayerTurn ? 'Your move' : 'Waiting...'}
          </h1>
          <p className="text-text-dim text-sm">vs Stockfish ({preset.label} — {preset.elo} ELO)</p>
        </div>
        {gameRef.current?.isCheck() && phase === 'playing' && (
          <span className="bg-incorrect/15 text-incorrect border border-incorrect/20 px-3 py-1 rounded-lg text-sm font-semibold">Check!</span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] lg:grid-cols-[1fr_320px] gap-8">
        {/* Board + eval bar */}
        <div className="w-full max-w-[560px]">
          <div className="flex gap-2">
            {/* Evaluation bar */}
            <div className="w-4 rounded-full overflow-hidden bg-bg-hover flex-shrink-0 relative" title={`Eval: ${evaluation > 0 ? '+' : ''}${evaluation.toFixed(1)}`}>
              <div
                className="absolute bottom-0 left-0 right-0 bg-white transition-all duration-500 ease-out rounded-full"
                style={{ height: `${evalPct}%` }}
              />
            </div>

            {/* Board */}
            <div className="flex-1">
              <ChessBoard
                fen={fen}
                orientation={playerColor}
                movable={isPlayerTurn && phase === 'playing' && !thinking}
                dests={isPlayerTurn && phase === 'playing' && !thinking ? getLegalDests() : new Map()}
                turnColor={turnColor}
                onMove={handleMove}
                arrows={hintMove ? [[hintMove.from, hintMove.to]] : []}
              />
            </div>
          </div>

          {/* Game controls */}
          <div className="flex gap-2 mt-3">
            {phase === 'playing' && (
              <>
                <button onClick={takeBack} disabled={history.length < 2 || thinking} className="flex-1 py-2 rounded-lg bg-bg-card border border-bg-hover text-base hover:bg-bg-hover transition-all btn-press disabled:opacity-30 disabled:cursor-not-allowed">
                  Takeback
                </button>
                <button onClick={requestHint} disabled={thinking || !isPlayerTurn} className="flex-1 py-2 rounded-lg bg-bg-card border border-bg-hover text-base hover:bg-bg-hover transition-all btn-press disabled:opacity-30 disabled:cursor-not-allowed">
                  {showHint && hintMove ? 'Hint shown' : 'Hint'}
                </button>
                <button onClick={resign} className="flex-1 py-2 rounded-lg bg-incorrect/10 border border-incorrect/20 text-incorrect text-base hover:bg-incorrect/20 transition-all btn-press">
                  Resign
                </button>
              </>
            )}
            {phase === 'ended' && (
              <>
                <button onClick={() => setPhase('setup')} className="flex-1 py-2.5 rounded-lg bg-gold text-bg font-semibold text-base hover:bg-gold-dim transition-all btn-press">
                  New Game
                </button>
                <button onClick={() => { startGame(); }} className="flex-1 py-2.5 rounded-lg bg-bg-card border border-bg-hover text-base hover:bg-bg-hover transition-all btn-press">
                  Rematch
                </button>
              </>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Move list */}
          <MoveList history={history} currentIndex={moveIndex} onSelectMove={() => {}} />

          {/* Game info */}
          <div className="card-base p-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-text-dim">Moves</span>
              <span className="tabular-nums">{Math.ceil(history.length / 2)}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-text-dim">Evaluation</span>
              <span className={`tabular-nums font-medium ${evaluation > 0.5 ? 'text-correct' : evaluation < -0.5 ? 'text-incorrect' : 'text-text-dim'}`}>
                {evaluation > 0 ? '+' : ''}{evaluation.toFixed(1)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-dim">Engine</span>
              <span>{preset.label} ({preset.elo})</span>
            </div>
          </div>

          {/* Thinking indicator */}
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
