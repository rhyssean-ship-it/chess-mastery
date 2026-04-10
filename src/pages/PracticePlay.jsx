import { useState, useEffect, useRef } from 'react';
import { Chess } from 'chess.js';
import ChessBoard from '../components/ChessBoard';
import MoveList from '../components/MoveList';
import StockfishService, { ELO_PRESETS } from '../services/stockfishService';
import openings from '../data/openings';
import { progressService } from '../services/progressService';

export default function PracticePlay() {
  const [phase, setPhase] = useState('setup');
  const [playerColor, setPlayerColor] = useState('white');
  const [levelIndex, setLevelIndex] = useState(4);
  const [selectedOpening, setSelectedOpening] = useState(openings[0]?.id || '');
  const gameRef = useRef(null);
  const [fen, setFen] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  const [history, setHistory] = useState([]);
  const [moveIndex, setMoveIndex] = useState(-1);
  const [evaluation, setEvaluation] = useState(0);
  const [thinking, setThinking] = useState(false);
  const [result, setResult] = useState(null);
  const [lastMove, setLastMove] = useState(null);

  // Coach features
  const [showHints, setShowHints] = useState(true);
  const [showEval, setShowEval] = useState(true);
  const [showTactics, setShowTactics] = useState(true);
  const [coachMessage, setCoachMessage] = useState(null);
  const [hintArrows, setHintArrows] = useState([]);
  const [openingPhase, setOpeningPhase] = useState(true);
  const [openingMoveIdx, setOpeningMoveIdx] = useState(0);

  const engineRef = useRef(null);
  const hintEngineRef = useRef(null);

  const preset = ELO_PRESETS[levelIndex];
  const opening = openings.find(o => o.id === selectedOpening);
  const engineColor = playerColor === 'white' ? 'black' : 'white';

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
    setOpeningPhase(true);
    setOpeningMoveIdx(0);
    setCoachMessage({ type: 'info', text: `Playing the ${opening?.name || 'selected opening'}. Follow the opening moves to build a strong position.` });
    setHintArrows([]);
    setLastMove(null);
    setPhase('playing');

    const engine = new StockfishService();
    engineRef.current = engine;
    engine.setLevel(levelIndex);

    engine.onMove = (uci) => {
      // Delay engine response for more natural feel
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
          checkGameEnd(g2);
          setOpeningMoveIdx(prev => prev + 1);
        }
        setThinking(false);
      }, 400);
    };

    engine.onEval = (score) => {
      // Score is from engine's (opponent's) perspective. Convert to White's perspective.
      const whiteScore = playerColor === 'white' ? -score : score;
      setEvaluation(whiteScore);

      // Tactical alerts need player's perspective (positive = good for player)
      const playerScore = -score; // always negate since engine is opponent
      if (showTactics) {
        if (playerScore > 2 && playerScore < 100) {
          setCoachMessage({ type: 'tip', text: 'You have a significant advantage! Look for tactical opportunities to convert it.' });
        } else if (playerScore < -2 && playerScore > -100) {
          setCoachMessage({ type: 'warning', text: 'You\'re in trouble. Play carefully and look for defensive resources.' });
        } else if (playerScore > 100) {
          setCoachMessage({ type: 'tip', text: 'Checkmate is near! Find the winning combination.' });
        }
      }
    };

    engine.init().then(() => {
      // Also init a hint engine
      const hintEng = new StockfishService();
      hintEngineRef.current = hintEng;
      hintEng.setLevel(7);
      hintEng.onMove = (uci) => {
        setHintArrows([[uci.slice(0, 2), uci.slice(2, 4)]]);
        setCoachMessage({ type: 'info', text: 'The engine suggests this move.' });
      };
      hintEng.init();

      if (playerColor === 'black') {
        setThinking(true);
        engine.getBestMove(g.fen());
      } else if (showHints && opening) {
        showOpeningHint(0);
      }
    });
  }

  function showOpeningHint(idx) {
    if (!opening || idx >= opening.moves.length) {
      setOpeningPhase(false);
      setCoachMessage({ type: 'info', text: 'Opening phase complete. You\'re on your own now! Use the hint button if you need guidance.' });
      setHintArrows([]);
      return;
    }

    const move = opening.moves[idx];
    const isPlayerMove = (idx % 2 === 0 && playerColor === 'white') || (idx % 2 === 1 && playerColor === 'black');

    if (isPlayerMove && showHints) {
      setCoachMessage({ type: 'info', text: `Opening: play ${move.move}. ${move.explanation}` });
      // Try to derive arrow from the move
      try {
        const tempG = new Chess(idx > 0 ? opening.moves[idx - 1].fen : 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
        const m = tempG.move(move.move);
        if (m) setHintArrows([[m.from, m.to]]);
      } catch { setHintArrows([]); }
    } else {
      setCoachMessage(null);
      setHintArrows([]);
    }
  }

  function checkGameEnd(g) {
    if (g.isCheckmate()) {
      const winner = g.turn() === 'w' ? 'black' : 'white';
      setResult(winner === playerColor ? 'You win!' : 'Computer wins!');
      setPhase('ended');
      progressService.logActivity(`Practice game (${opening?.name}, ${preset.label}) — ${winner === playerColor ? 'Won' : 'Lost'}`);
    } else if (g.isDraw() || g.isStalemate() || g.isThreefoldRepetition()) {
      setResult('Draw!');
      setPhase('ended');
    }
  }

  function getLegalDests() {
    if (!gameRef.current) return new Map();
    const dests = new Map();
    for (const m of gameRef.current.moves({ verbose: true })) {
      if (!dests.has(m.from)) dests.set(m.from, []);
      dests.get(m.from).push(m.to);
    }
    return dests;
  }

  function handleMove(from, to) {
    const g = gameRef.current;
    if (!g || thinking || phase !== 'playing') return;
    if ((g.turn() === 'w' ? 'white' : 'black') !== playerColor) return;

    const g2 = new Chess(g.fen());
    const m = g2.move({ from, to, promotion: 'q' });
    if (!m) return;

    if (openingPhase && opening && openingMoveIdx < opening.moves.length) {
      const expected = opening.moves[openingMoveIdx];
      if (m.san !== expected.move) {
        setCoachMessage({ type: 'warning', text: `That's not the book move. The opening recommends ${expected.move}: ${expected.explanation}` });
      } else {
        setCoachMessage({ type: 'tip', text: `Correct! ${expected.explanation}` });
      }
      setOpeningMoveIdx(prev => prev + 1);
    }

    gameRef.current = g2;
    setFen(g2.fen());
    setLastMove([from, to]);
    setHistory(h => [...h, { move: m, fen: g2.fen(), san: m.san }]);
    setMoveIndex(i => i + 1);
    setHintArrows([]);

    if (g2.isGameOver()) { checkGameEnd(g2); return; }

    setThinking(true);
    setTimeout(() => engineRef.current?.getBestMove(g2.fen()), 300);
  }

  // After engine moves, show next opening hint
  useEffect(() => {
    if (!thinking && openingPhase && opening && phase === 'playing' && gameRef.current) {
      const turn = gameRef.current.turn() === 'w' ? 'white' : 'black';
      if (turn === playerColor) {
        showOpeningHint(openingMoveIdx);
      }
    }
  }, [thinking, openingMoveIdx, openingPhase]);

  function requestHint() {
    if (!gameRef.current || thinking || !hintEngineRef.current) return;
    hintEngineRef.current.getQuickHint(gameRef.current.fen());
  }

  const turnColor = gameRef.current ? (gameRef.current.turn() === 'w' ? 'white' : 'black') : 'white';
  const isPlayerTurn = turnColor === playerColor;
  const evalClamped = Math.max(-5, Math.min(5, evaluation));
  const evalPct = ((evalClamped + 5) / 10) * 100;

  if (phase === 'setup') {
    return (
      <div className="page-enter max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-3xl font-display text-gold mb-1">Practice Play</h1>
        <p className="text-text-dim text-base mb-10">Play a guided game with opening support, hints, and tactical alerts.</p>

        <div className="card-base p-6 space-y-8">
          {/* Opening */}
          <div>
            <label className="text-sm text-text-dim block mb-2 font-medium">Opening to practice</label>
            <select
              value={selectedOpening}
              onChange={e => setSelectedOpening(e.target.value)}
              className="w-full bg-bg border border-bg-hover rounded-lg px-4 py-3 text-text text-base"
            >
              {openings.map(o => <option key={o.id} value={o.id}>{o.name} ({o.difficulty})</option>)}
            </select>
          </div>

          {/* Color */}
          <div>
            <label className="text-sm text-text-dim block mb-2 font-medium">Play as</label>
            <div className="flex gap-3">
              {['white', 'black'].map(color => (
                <button key={color} onClick={() => setPlayerColor(color)}
                  className={`flex-1 py-3 rounded-lg text-base font-semibold transition-all btn-press ${playerColor === color ? 'bg-gold text-bg' : 'bg-bg-hover text-text-dim hover:text-text'}`}
>{color === 'white' ? '\u2654 White' : '\u265A Black'}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <div className="flex justify-between items-baseline mb-2">
              <label className="text-sm text-text-dim font-medium">Opponent strength</label>
              <span className="text-gold font-bold tabular-nums">{preset.elo} ELO</span>
            </div>
            <input type="range" min={0} max={ELO_PRESETS.length - 1} value={levelIndex} onChange={e => setLevelIndex(parseInt(e.target.value))} className="w-full accent-gold h-2 rounded-full appearance-none bg-bg-hover cursor-pointer" />
            <p className="text-center text-sm mt-1">{preset.label}</p>
          </div>

          {/* Coach toggles */}
          <div>
            <label className="text-sm text-text-dim block mb-3 font-medium">Coach features</label>
            <div className="space-y-2">
              {[
                { key: 'hints', label: 'Opening move hints', desc: 'Show recommended opening moves', value: showHints, set: setShowHints },
                { key: 'eval', label: 'Evaluation bar', desc: 'Show who\'s winning', value: showEval, set: setShowEval },
                { key: 'tactics', label: 'Tactical alerts', desc: 'Warn about advantages and blunders', value: showTactics, set: setShowTactics },
              ].map(toggle => (
                <div key={toggle.key} className="flex items-center justify-between bg-bg-hover/30 rounded-lg px-4 py-3">
                  <div>
                    <p className="text-sm font-medium">{toggle.label}</p>
                    <p className="text-xs text-text-dim">{toggle.desc}</p>
                  </div>
                  <button onClick={() => toggle.set(!toggle.value)}
                    className={`w-11 h-6 rounded-full transition-all duration-200 relative shrink-0 ${toggle.value ? 'bg-gold' : 'bg-bg-hover'}`}>
                    <div className={`w-4 h-4 rounded-full bg-white shadow absolute top-1 transition-all duration-200 ${toggle.value ? 'left-6' : 'left-1'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button onClick={startGame} className="w-full bg-gold text-bg py-3 rounded-lg font-semibold text-lg hover:bg-gold-dim transition-all btn-press shadow-lg shadow-gold/10">
            Start Practice Game
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-display text-gold mb-0.5">
            {phase === 'ended' ? result : thinking ? 'Engine thinking...' : isPlayerTurn ? 'Your move' : ''}
          </h1>
          <p className="text-text-dim text-sm">{opening?.name} vs Stockfish ({preset.label})</p>
        </div>
      </div>

      {/* Coach message */}
      {coachMessage && (
        <div className={`mb-4 rounded-xl p-4 border text-sm ${
          coachMessage.type === 'tip' ? 'bg-correct/10 border-correct/30 text-correct' :
          coachMessage.type === 'warning' ? 'bg-amber/10 border-amber/30 text-amber' :
          'bg-gold/10 border-gold/30 text-gold'
        }`}>
          <span className="mr-2">{coachMessage.type === 'tip' ? '\u2713' : coachMessage.type === 'warning' ? '\u26A0' : '\u25C6'}</span>
          {coachMessage.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] lg:grid-cols-[1fr_320px] gap-8">
        <div className="w-full max-w-[560px]">
          <div className="flex gap-2">
            {showEval && (
              <div className="w-4 rounded-full overflow-hidden bg-bg-hover flex-shrink-0 relative">
                <div className="absolute bottom-0 left-0 right-0 bg-white transition-all duration-500 ease-out rounded-full" style={{ height: `${evalPct}%` }} />
              </div>
            )}
            <div className="flex-1">
              <ChessBoard
                fen={fen}
                orientation={playerColor}
                movable={isPlayerTurn && phase === 'playing' && !thinking}
                dests={isPlayerTurn && phase === 'playing' && !thinking ? getLegalDests() : new Map()}
                turnColor={turnColor}
                onMove={handleMove}
                lastMove={lastMove}
                arrows={hintArrows}
              />
            </div>
          </div>

          <div className="flex gap-2 mt-3">
            {phase === 'playing' && (
              <>
                <button onClick={requestHint} disabled={thinking || !isPlayerTurn} className="flex-1 py-2 rounded-lg bg-bg-card border border-bg-hover text-base hover:bg-bg-hover transition-all btn-press disabled:opacity-30 disabled:cursor-not-allowed">Hint</button>
                <button onClick={() => { setResult('You resigned'); setPhase('ended'); }} className="flex-1 py-2 rounded-lg bg-incorrect/10 border border-incorrect/20 text-incorrect text-base hover:bg-incorrect/20 transition-all btn-press">Resign</button>
              </>
            )}
            {phase === 'ended' && (
              <button onClick={() => setPhase('setup')} className="flex-1 py-2.5 rounded-lg bg-gold text-bg font-semibold text-base hover:bg-gold-dim transition-all btn-press">New Game</button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <MoveList history={history} currentIndex={moveIndex} onSelectMove={() => {}} />

          {thinking && (
            <div className="card-base p-4 flex items-center gap-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-gold animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-gold animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-gold animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-sm text-text-dim">Calculating...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
