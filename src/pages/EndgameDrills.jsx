import { useState, useEffect, useRef } from 'react';
import { Chess } from 'chess.js';
import ChessBoard from '../components/ChessBoard';
import StockfishService from '../services/stockfishService';
import drills from '../data/endgameDrills';
import { markItemDone } from '../services/dailyPlanService';
import { Link, useSearchParams } from 'react-router-dom';

const STORE_KEY = 'chess-mastery:endgameDrills';

function loadStore() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch { return {}; }
}
function saveStore(s) { localStorage.setItem(STORE_KEY, JSON.stringify(s)); }

// Draw-defence drills: holding the draw (or surviving the move limit) is the goal.
function isDrawDrill(drill) {
  return drill.id === 'philidor' || drill.id === 'kpk-2' || /\b(hold|draw)/i.test(drill.objective || '');
}

export default function EndgameDrills() {
  const [params] = useSearchParams();
  const focusIds = params.get('focus')?.split(',') || null; // ?focus=kqk,krk shows just those drills
  const shown = focusIds ? drills.filter(d => focusIds.includes(d.id)) : drills;
  const [store, setStore] = useState(loadStore);
  const [selected, setSelected] = useState(null);
  const [phase, setPhase] = useState('idle'); // idle | playing | success | failed
  const [fen, setFen] = useState('');
  const [history, setHistory] = useState([]);
  const [lastMove, setLastMove] = useState(null);
  const [thinking, setThinking] = useState(false);
  const [moveCount, setMoveCount] = useState(0);
  const [resultReason, setResultReason] = useState('');
  // Refs so the engine's onMove closure (created once per drill) sees live values.
  const moveCountRef = useRef(0);
  const finishedRef = useRef(false);
  const gameRef = useRef(null);
  const engineRef = useRef(null);

  useEffect(() => () => engineRef.current?.destroy(), []);

  function progressFor(drill) { return store[drill.id]?.consecutive || 0; }
  function masteredFor(drill) { return (store[drill.id]?.consecutive || 0) >= drill.wins; }

  function startDrill(drill) {
    setSelected(drill);
    setPhase('playing');
    setFen(drill.fen);
    setHistory([]);
    setLastMove(null);
    setMoveCount(0);
    setResultReason('');
    moveCountRef.current = 0;
    finishedRef.current = false;
    const g = new Chess(drill.fen);
    gameRef.current = g;

    if (engineRef.current) engineRef.current.destroy();
    const eng = new StockfishService();
    engineRef.current = eng;
    eng.setLevel(11); // Grandmaster strength for the defender
    eng.onMove = (uci) => {
      setTimeout(() => {
        const cur = gameRef.current;
        if (!cur || finishedRef.current || engineRef.current !== eng) return;
        const g2 = new Chess(cur.fen());
        const m = g2.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] || undefined });
        if (m) {
          gameRef.current = g2;
          setFen(g2.fen());
          setLastMove([m.from, m.to]);
          setHistory(h => [...h, { san: m.san, fen: g2.fen() }]);
          moveCountRef.current += 1;
          setMoveCount(moveCountRef.current);
          checkResult(g2, drill, m);
        }
        setThinking(false);
      }, 350);
    };
    eng.init().then(() => {
      // If user is black, engine plays first
      const turn = g.turn() === 'w' ? 'white' : 'black';
      if (turn !== drill.requiredColor) {
        setThinking(true);
        eng.getBestMove(g.fen());
      }
    });
  }

  // Returns true if the drill ended.
  function checkResult(g, drill, lastMv) {
    if (finishedRef.current) return true;
    const drawDrill = isDrawDrill(drill);
    if (g.isCheckmate()) {
      const winner = g.turn() === 'w' ? 'black' : 'white';
      const won = winner === drill.requiredColor;
      finish(won, drill, won ? 'Checkmate!' : 'Checkmate — you were mated.');
      return true;
    }
    if (g.isDraw() || g.isStalemate() || g.isThreefoldRepetition() || g.isInsufficientMaterial()) {
      const why = g.isStalemate() ? 'Stalemate'
        : g.isThreefoldRepetition() ? 'Threefold repetition'
        : g.isInsufficientMaterial() ? 'Insufficient material'
        : 'Draw by the fifty-move rule';
      finish(drawDrill, drill, `${why} — that's a draw.`);
      return true;
    }
    // "Promote the pawn" drills: a promotion by the player completes the task.
    const moverColor = lastMv?.color === 'w' ? 'white' : 'black';
    if (!drawDrill && lastMv?.promotion && moverColor === drill.requiredColor && /promote/i.test(drill.objective || '')) {
      finish(true, drill, 'Pawn promoted!');
      return true;
    }
    if (moveCountRef.current >= drill.moveLimit * 2) {
      finish(drawDrill, drill, drawDrill
        ? `Move limit reached — you held for ${drill.moveLimit} moves.`
        : `Move limit reached — not converted within ${drill.moveLimit} moves.`);
      return true;
    }
    return false;
  }

  function finish(success, drill, reason = '') {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setThinking(false);
    setResultReason(reason);
    setPhase(success ? 'success' : 'failed');
    if (success) markItemDone('endgame-drill');
    // Functional update: finish can run from the engine callback's stale closure.
    setStore(prev => {
      const cur = prev[drill.id] || { consecutive: 0, attempts: 0, completions: 0 };
      const next = {
        consecutive: success ? cur.consecutive + 1 : 0,
        attempts: cur.attempts + 1,
        completions: cur.completions + (success ? 1 : 0),
        lastResult: success ? 'win' : 'fail',
      };
      const newStore = { ...prev, [drill.id]: next };
      saveStore(newStore);
      return newStore;
    });
  }

  function handleMove(from, to) {
    if (phase !== 'playing' || thinking || !selected) return;
    const g = gameRef.current;
    if (!g) return;
    const turn = g.turn() === 'w' ? 'white' : 'black';
    if (turn !== selected.requiredColor) return;
    const g2 = new Chess(g.fen());
    const m = g2.move({ from, to, promotion: 'q' });
    if (!m) return;
    gameRef.current = g2;
    setFen(g2.fen());
    setLastMove([from, to]);
    setHistory(h => [...h, { san: m.san, fen: g2.fen() }]);
    moveCountRef.current += 1;
    setMoveCount(moveCountRef.current);
    if (checkResult(g2, selected, m)) return;
    setThinking(true);
    setTimeout(() => engineRef.current?.getBestMove(g2.fen()), 200);
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

  if (selected && phase !== 'idle') {
    const turnColor = gameRef.current ? (gameRef.current.turn() === 'w' ? 'white' : 'black') : 'white';
    const isPlayerTurn = turnColor === selected.requiredColor && !thinking;
    const progress = progressFor(selected);
    return (
      <div className="page-enter max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-wrap items-baseline justify-between gap-3 mb-4">
          <div>
            <h1 className="text-2xl font-display">{selected.name}</h1>
            <p className="text-text-dim text-sm">{selected.objective}</p>
          </div>
          <div className="text-sm text-text-dim">Streak: <span className="text-gold font-bold tabular-nums">{progress}/{selected.wins}</span></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
          <div className="mx-auto w-full max-w-[560px]">
            <ChessBoard
              fen={fen}
              orientation={selected.requiredColor}
              movable={isPlayerTurn && phase === 'playing'}
              dests={isPlayerTurn && phase === 'playing' ? getLegalDests() : new Map()}
              turnColor={turnColor}
              onMove={handleMove}
              lastMove={lastMove}
            />
            <div className="flex gap-2 mt-3">
              {phase === 'playing' && (
                <button onClick={() => finish(false, selected, 'You gave up.')} className="flex-1 py-2 rounded-lg bg-incorrect/10 border border-incorrect/30 text-incorrect text-sm hover:bg-incorrect/20">Give up</button>
              )}
              {phase === 'success' && (
                <>
                  <button onClick={() => startDrill(selected)} className="flex-1 py-2.5 rounded-lg bg-gold text-bg font-semibold hover:bg-gold-dim">Again ({progress}/{selected.wins})</button>
                  <button onClick={() => { setPhase('idle'); setSelected(null); }} className="flex-1 py-2.5 rounded-lg bg-bg-card border border-bg-hover hover:bg-bg-hover">Back to list</button>
                </>
              )}
              {phase === 'failed' && (
                <>
                  <button onClick={() => startDrill(selected)} className="flex-1 py-2.5 rounded-lg bg-gold text-bg font-semibold hover:bg-gold-dim">Retry</button>
                  <button onClick={() => { setPhase('idle'); setSelected(null); }} className="flex-1 py-2.5 rounded-lg bg-bg-card border border-bg-hover hover:bg-bg-hover">Back to list</button>
                </>
              )}
            </div>
          </div>
          <div className="space-y-3">
            <div className="card-base p-4">
              <div className="text-xs text-text-dim mb-1">Description</div>
              <p className="text-sm text-text">{selected.description}</p>
            </div>
            <div className="card-base p-4">
              <div className="grid grid-cols-2 gap-3 text-center">
                <div>
                  <div className="text-xs text-text-dim">Move</div>
                  <div className="text-lg tabular-nums">{Math.min(Math.ceil(moveCount / 2), selected.moveLimit)} / {selected.moveLimit}</div>
                </div>
                <div>
                  <div className="text-xs text-text-dim">Streak</div>
                  <div className="text-lg tabular-nums text-gold">{progress}/{selected.wins}</div>
                </div>
              </div>
            </div>
            {phase === 'success' && (
              <div className="card-base p-4 bg-correct/5">
                <div className="text-correct font-semibold mb-1">Solved!</div>
                {resultReason && <div className="text-sm text-text mb-1">{resultReason}</div>}
                <div className="text-xs text-text-dim">
                  {/* store (and so progress) already includes this win */}
                  {progress >= selected.wins
                    ? `You've mastered this drill — ${selected.wins} in a row.`
                    : `${selected.wins - progress} more in a row to master.`}
                </div>
              </div>
            )}
            {phase === 'failed' && (
              <div className="card-base p-4 bg-incorrect/5">
                <div className="text-incorrect font-semibold mb-1">Not this time.</div>
                {resultReason && <div className="text-sm text-text mb-1">{resultReason}</div>}
                <div className="text-xs text-text-dim">Streak resets to 0. Try again.</div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter max-w-4xl mx-auto px-4 sm:px-6 py-6 lg:py-10">
      <h1 className="text-2xl sm:text-3xl font-display mb-1">Endgame Drills</h1>
      <p className="text-text-dim text-sm mb-5">
        Play these endings vs Stockfish at full strength. Three wins in a row earns mastery.
        {focusIds && <> Showing the {shown.length} you need first. <Link to="/endgame-drills" className="text-gold">Show all</Link></>}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {shown.map(d => {
          const progress = progressFor(d);
          const mastered = masteredFor(d);
          return (
            <button
              key={d.id}
              onClick={() => startDrill(d)}
              className={`text-left p-4 rounded-xl border transition-all ${mastered ? 'border-correct/40 bg-correct/5' : 'border-bg-hover bg-bg-card hover:bg-bg-hover/40'}`}
            >
              <div className="flex items-baseline justify-between mb-1">
                <div className="font-semibold">{d.name}</div>
                {mastered ? <span className="text-correct text-xs font-semibold">✓ Mastered</span> : <span className="text-text-dim text-xs">{progress}/{d.wins}</span>}
              </div>
              <div className="text-xs text-text-dim mb-1">{d.difficulty} · {d.requiredColor === 'white' ? 'You play White' : 'You play Black'}</div>
              <div className="text-sm text-text-dim">{d.description}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
