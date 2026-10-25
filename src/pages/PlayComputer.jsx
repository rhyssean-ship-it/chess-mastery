import { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Chess } from 'chess.js';
import ChessBoard from '../components/ChessBoard';
import MoveList from '../components/MoveList';
import OpeningExplorer from '../components/OpeningExplorer';
import StockfishService, { ELO_PRESETS } from '../services/stockfishService';
import { toCpScore } from '../services/moveClassification';
import { progressService } from '../services/progressService';
import { currentRating, listRatedGames, recordRatedGame } from '../services/ratingHistory';
import { PERSONAS, PERSONA_LEVELS, personaById, nearestPersona, nearestLevel } from '../services/humanBot';

const STANDARD_INITIAL = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const PLAY_FROM_FEN_KEY = 'enpassant:playFromFen';
const EMPTY_DESTS = new Map(); // stable identity for "no legal moves"

// Bot personalities. Strength stays governed by the ELO preset; these only bias
// the choice among near-best moves (see stockfishService._pickStyledMove).
const PERSONALITIES = [
  { id: 'balanced',    label: 'Balanced',    desc: 'Plays the engine’s top move.' },
  { id: 'aggressive',  label: 'Aggressive',  desc: 'Loves checks, captures and attacks.' },
  { id: 'defensive',   label: 'Defensive',   desc: 'Solid, quiet, avoids loose play.' },
  { id: 'materialist', label: 'Materialist', desc: 'Grabs material whenever it can.' },
  { id: 'positional',  label: 'Positional',  desc: 'Develops, castles, improves pieces.' },
];

// Depth for the on-the-fly coach evaluations. Shallow enough to feel instant,
// deep enough to spot a hung piece or a big swing.
const COACH_DEPTH = 11;
const BLUNDER_DROP_CP = 150; // warn when a move drops >= 1.5 pawns
const BLUNDER_KEEP_CP = 200; // …unless you're still clearly winning afterwards

const RATED_PREF_KEY = 'chess-mastery:ratedGames';
function loadRatedPref() {
  try { return localStorage.getItem(RATED_PREF_KEY) === 'on'; } catch { return false; }
}

// ?elo= wins; otherwise the bot nearest your rating once you have rated games.
function targetElo(searchParams) {
  return parseInt(searchParams.get('elo')) || (listRatedGames().length ? currentRating() : null);
}

// Human personas cover up to 1200; above that it's Stockfish levels.
function getInitialMode(searchParams) {
  const elo = targetElo(searchParams);
  return elo && elo > PERSONA_LEVELS[PERSONA_LEVELS.length - 1] + 50 ? 'engine' : 'persona';
}

function getInitialPersona(searchParams) {
  return nearestPersona(targetElo(searchParams) || PERSONA_LEVELS[0]).id;
}

function getInitialLevel(searchParams) {
  const elo = targetElo(searchParams);
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

// Pawns from White's view; ±100 means a forced mate.
function fmtEval(e) {
  if (Math.abs(e) >= 100) return e > 0 ? 'White mates' : 'Black mates';
  return (e > 0 ? '+' : '') + e.toFixed(1);
}

export default function PlayComputer() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [phase, setPhase] = useState('setup');
  const [colorChoice, setColorChoice] = useState('white');
  const [playerColor, setPlayerColor] = useState('white');
  const [levelIndex, setLevelIndex] = useState(() => getInitialLevel(searchParams));
  const [opponentMode, setOpponentMode] = useState(() => getInitialMode(searchParams)); // 'persona' | 'engine'
  const [personaId, setPersonaId] = useState(() => getInitialPersona(searchParams));
  const [personality, setPersonality] = useState('balanced');
  const [coachMode, setCoachMode] = useState(false);
  const [rated, setRated] = useState(loadRatedPref);
  const [ratingRow, setRatingRow] = useState(null); // { before, after } once a rated game ends, or { aborted: true }
  const [tcId, setTcId] = useState(DEFAULT_TC_ID);
  const [fen, setFen] = useState(STANDARD_INITIAL);
  const [history, setHistory] = useState([]);
  const [moveIndex, setMoveIndex] = useState(-1);
  const [evaluation, setEvaluation] = useState(0);
  const [thinking, setThinking] = useState(false);
  const [result, setResult] = useState(null);
  const [lastMove, setLastMove] = useState(null);
  const [hintArrow, setHintArrow] = useState(null);
  const [whiteTime, setWhiteTime] = useState(null);
  const [blackTime, setBlackTime] = useState(null);
  const [coachChecking, setCoachChecking] = useState(false);
  const [pendingMove, setPendingMove] = useState(null); // { from, to, promotion, san, threat } when a blunder is flagged
  const [customStartFen, setCustomStartFen] = useState(null); // set when arriving via "Play from here"
  const gameRef = useRef(null);
  // Engine callbacks (onMove) are created once in startGame, before setPlayerColor
  // has committed, so they'd capture a stale playerColor. Read colour from this ref instead.
  const playerColorRef = useRef('white');
  const coachModeRef = useRef(false);
  const ratedRef = useRef(null);          // { elo, label } of the bot while a rated game is in progress
  const personaRef = useRef(null);        // the human-style persona for this game, or null for Stockfish levels
  const playerMovesRef = useRef(0);
  const personalityRef = useRef('balanced');
  const startFenRef = useRef(STANDARD_INITIAL);
  const engineRef = useRef(null);
  const hintEngineRef = useRef(null);
  const coachEngineRef = useRef(null);
  const coachQueueRef = useRef(null);     // serialises coach analyses so they never clobber each other
  const evalBeforeRef = useRef(null);     // { fen, cp } — cached eval of the position before the player's move
  const hintFenRef = useRef(null);       // position the pending hint was asked for
  const gameEndedRef = useRef(false);     // makes game-over handling idempotent (clock can tick past 0 before the interval clears)
  const startEpochRef = useRef(0);        // invalidates in-flight engine.init() callbacks from a previous game
  const cancelBtnRef = useRef(null);      // focus target for the blunder dialog
  const waitingForHint = useRef(false);
  const tickRef = useRef(null);
  const lastTickRef = useRef(null);

  const preset = ELO_PRESETS[levelIndex];
  const persona = opponentMode === 'persona' ? personaById(personaId) : null;
  // One description of the opponent for labels, logs and the rating history.
  const opponent = persona
    ? { elo: persona.elo, label: persona.name, short: `${persona.name} (${persona.elo})`, long: `${persona.name} (${persona.elo})` }
    : { elo: preset.elo, label: preset.label, short: `Stockfish (${preset.label} — ${preset.elo})`, long: `Stockfish (${preset.label} — ${preset.elo} ELO)` };
  const timeControl = TIME_CONTROLS.find(t => t.id === tcId) || TIME_CONTROLS[0];
  const isTimed = timeControl.initial != null;

  // A separate full-strength engine for the eval bar. The playing engine's own search is only
  // 1-5 plies deep at club levels and only reports on its own turn, so it misleads.
  const evalEngineRef = useRef(null);
  const evalQueueRef = useRef(Promise.resolve());
  useEffect(() => {
    const eng = new StockfishService();
    evalEngineRef.current = eng;
    eng.init();
    return () => { eng.destroy(); evalEngineRef.current = null; };
  }, []);
  useEffect(() => {
    if (phase === 'setup') return;
    let stale = false;
    evalQueueRef.current = evalQueueRef.current.then(async () => {
      if (stale || !evalEngineRef.current) return;
      const r = await evalEngineRef.current.analyzePosition(fen, { depth: 12 });
      if (stale || !r) return;
      const sign = fen.split(' ')[1] === 'w' ? 1 : -1; // engine scores are side-to-move
      // ±100 marks a forced mate (mate 0 = the side to move is already mated)
      const white = r.mate != null ? (r.mate > 0 ? 100 : -100) * sign : ((r.scoreCp ?? 0) / 100) * sign;
      setEvaluation(white);
    });
    return () => { stale = true; };
  }, [fen, phase]);

  useEffect(() => {
    return () => {
      if (engineRef.current) engineRef.current.destroy();
      if (hintEngineRef.current) hintEngineRef.current.destroy();
      if (coachEngineRef.current) coachEngineRef.current.destroy();
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, []);

  // "Play from here": GameAnalysis stashes a FEN, we consume it once and pre-fill setup.
  useEffect(() => {
    const stashed = sessionStorage.getItem(PLAY_FROM_FEN_KEY);
    if (!stashed) return;
    sessionStorage.removeItem(PLAY_FROM_FEN_KEY);
    try {
      const g = new Chess(stashed);
      setCustomStartFen(stashed);
      // Default to playing the side that's on move in the stashed position.
      setColorChoice(g.turn() === 'w' ? 'white' : 'black');
      setTcId('untimed');
    } catch { /* ignore an invalid stash */ }
  }, []);

  // Blunder dialog: focus the primary action on open and let Escape dismiss it.
  useEffect(() => {
    if (!pendingMove) return;
    cancelBtnRef.current?.focus();
    const onKey = (e) => { if (e.key === 'Escape') { e.preventDefault(); cancelPendingMove(); } };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [pendingMove]);

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
      // Keep the side-effect (onFlag) out of the pure setState updater — defer it.
      const flag = (color) => {
        if (gameEndedRef.current) return;
        gameEndedRef.current = true;
        queueMicrotask(() => onFlag(color));
      };
      if (turn === 'white') {
        setWhiteTime(t => { const nx = Math.max(0, (t ?? 0) - dt); if (nx === 0) flag('white'); return nx; });
      } else {
        setBlackTime(t => { const nx = Math.max(0, (t ?? 0) - dt); if (nx === 0) flag('black'); return nx; });
      }
    }, 100);
    return () => { if (tickRef.current) { clearInterval(tickRef.current); tickRef.current = null; } };
  }, [phase, isTimed]);

  function onFlag(loserColor) {
    const pc = playerColorRef.current;
    // Time-out is a draw if the side with time left has no mating material (e.g. a bare king).
    const winner = loserColor === 'white' ? 'b' : 'w';
    const pieces = (gameRef.current?.board().flat() || []).filter(p => p && p.color === winner && p.type !== 'k');
    const canMate = pieces.some(p => ['p', 'q', 'r'].includes(p.type)) || pieces.length >= 2;
    if (!canMate) {
      setResult('Draw: time ran out, but the other side can’t mate');
      setPhase('ended');
      finishRated(0.5, 'Draw on time');
      return;
    }
    setResult(loserColor === pc ? 'Lost on time' : 'Computer lost on time');
    setPhase('ended');
    finishRated(loserColor === pc ? 0 : 1, loserColor === pc ? 'Lost on time' : 'Won on time');
    progressService.logActivity?.(`Played vs ${opponent.label} — ${loserColor === pc ? 'Lost on time' : 'Won on time'}`);
  }

  function startGame() {
    if (engineRef.current) engineRef.current.destroy();
    if (hintEngineRef.current) hintEngineRef.current.destroy();
    if (coachEngineRef.current) coachEngineRef.current.destroy();

    // Resolve the colour choice now so rematch with "random" re-rolls each time.
    const resolvedColor = colorChoice === 'random'
      ? (Math.random() < 0.5 ? 'white' : 'black')
      : colorChoice;
    setPlayerColor(resolvedColor);
    playerColorRef.current = resolvedColor;
    // Rated games are unassisted, and only count from the standard start.
    const isRated = rated && !customStartFen;
    ratedRef.current = isRated ? { elo: opponent.elo, label: opponent.label } : null;
    personaRef.current = persona;
    playerMovesRef.current = 0;
    setRatingRow(null);
    coachModeRef.current = coachMode && !isRated;
    personalityRef.current = personality;

    const startFen = customStartFen || STANDARD_INITIAL;
    startFenRef.current = startFen;
    evalBeforeRef.current = null;
    coachQueueRef.current = null;
    gameEndedRef.current = false;
    const myEpoch = ++startEpochRef.current;

    const g = new Chess(startFen);
    gameRef.current = g;
    setFen(g.fen());
    setHistory([]);
    setMoveIndex(-1);
    setResult(null);
    setEvaluation(0);
    setLastMove(null);
    setHintArrow(null);
    setThinking(false);
    setCoachChecking(false);
    setPendingMove(null);
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
        if (gameEndedRef.current) { setThinking(false); return; } // resigned/flagged while it thought
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
          if (!g2.isGameOver() && coachModeRef.current) primeCoachEval(g2.fen());
        }
        setThinking(false);
      }, 400);
    };

    // (the eval bar uses the dedicated eval engine, see evalEngineRef)

    engine.init().then(() => {
      // A newer game started while we were initialising — abandon this one.
      if (startEpochRef.current !== myEpoch) { engine.destroy(); return; }
      engine.setPersonality(personality);

      // Also init a separate hint engine (not needed in a rated game: no hints)
      if (!ratedRef.current) {
        const hintEng = new StockfishService();
        hintEngineRef.current = hintEng;
        hintEng.setLevel(ELO_PRESETS.length - 1); // full strength: hints must be right
        hintEng.onMove = (uci) => {
          if (waitingForHint.current && hintFenRef.current === gameRef.current?.fen()) {
            setHintArrow([[uci.slice(0, 2), uci.slice(2, 4)]]);
            waitingForHint.current = false;
          }
        };
        hintEng.init();
      } else {
        hintEngineRef.current = null;
      }

      // Who is on move in the starting position? (Usually the player, but a
      // "play from here" position can start on either side.)
      const engineToMove = (g.turn() === 'w' ? 'white' : 'black') !== resolvedColor;

      // Separate full-strength engine that powers the blunder warnings
      if (coachModeRef.current) {
        const coachEng = new StockfishService();
        coachEngineRef.current = coachEng;
        coachEng.init().then(() => {
          if (!engineToMove) primeCoachEval(g.fen());
        });
      }

      if (engineToMove) {
        setThinking(true);
        requestEngineMove(g.fen());
      }
    });
  }

  // Route an engine move through the personality if one is active.
  function requestEngineMove(fen) {
    const eng = engineRef.current;
    if (!eng) return;
    if (personaRef.current) { eng.getHumanMove(fen, personaRef.current); return; }
    if (personalityRef.current && personalityRef.current !== 'balanced') eng.getStyledMove(fen);
    else eng.getBestMove(fen);
  }

  // Serialise all coach analyses through one promise chain so concurrent calls on the
  // single coach worker can't clobber each other's message handlers.
  function coachAnalyze(fen) {
    if (!coachEngineRef.current) return Promise.resolve(null);
    const prev = coachQueueRef.current || Promise.resolve();
    const next = prev
      .catch(() => {})
      .then(() => coachEngineRef.current?.analyzePosition(fen, { depth: COACH_DEPTH, multiPv: 1 }));
    coachQueueRef.current = next.catch(() => {});
    return next;
  }

  // Pre-evaluate the position when it becomes the player's turn, so the blunder check
  // only needs one more (post-move) eval and feels near-instant.
  async function primeCoachEval(fen) {
    evalBeforeRef.current = null;
    const r = await coachAnalyze(fen);
    if (r) evalBeforeRef.current = { fen, cp: toCpScore(r, false) }; // player is side-to-move here
  }

  function checkEnd(g) {
    if (gameEndedRef.current) return;
    const pc = playerColorRef.current;
    if (g.isCheckmate()) {
      gameEndedRef.current = true;
      const winner = g.turn() === 'w' ? 'black' : 'white';
      setResult(winner === pc ? 'You win!' : 'Computer wins!');
      setPhase('ended');
      progressService.logActivity(`Played vs ${opponent.label} — ${winner === pc ? 'Won' : 'Lost'}`);
      progressService.recordActivity();
      finishRated(winner === pc ? 1 : 0, winner === pc ? 'Won by checkmate' : 'Lost to checkmate');
    } else if (g.isDraw() || g.isStalemate() || g.isThreefoldRepetition() || g.isInsufficientMaterial()) {
      gameEndedRef.current = true;
      setResult(g.isStalemate() ? 'Draw by stalemate' : g.isInsufficientMaterial() ? 'Draw: not enough material to mate'
        : g.isThreefoldRepetition() ? 'Draw by repetition' : 'Draw (50-move rule)');
      setPhase('ended');
      finishRated(0.5, 'Draw');
    }
  }

  // Score a rated game once. Fewer than two of your own moves counts as an abort, not a result.
  function finishRated(score, result) {
    const bot = ratedRef.current;
    if (!bot) return;
    ratedRef.current = null;
    if (playerMovesRef.current < 2) { setRatingRow({ aborted: true }); return; }
    setRatingRow(recordRatedGame({ botElo: bot.elo, botLabel: bot.label, score, result }));
  }

  async function handleMove(from, to) {
    const g = gameRef.current;
    if (!g || thinking || coachChecking || pendingMove || phase !== 'playing') return;
    if ((g.turn() === 'w' ? 'white' : 'black') !== playerColor) return;

    const beforeFen = g.fen();
    const g2 = new Chess(beforeFen);
    const m = g2.move({ from, to, promotion: 'q' });
    if (!m) return;

    // Coach mode: evaluate the move before committing and warn on a likely blunder.
    if (coachModeRef.current && coachEngineRef.current) {
      setCoachChecking(true);
      try {
        const cached = evalBeforeRef.current;
        const evalBefore = (cached && cached.fen === beforeFen)
          ? cached.cp
          : toCpScore(await coachAnalyze(beforeFen), false);
        const after = await coachAnalyze(g2.fen());
        setCoachChecking(false);
        // Bail if the game moved on while we were thinking (resign / takeback / game over).
        if (gameEndedRef.current || gameRef.current?.fen() !== beforeFen) return;
        if (after) {
          const evalAfter = toCpScore(after, true); // opponent is side-to-move → flip to player POV
          const drop = evalBefore - evalAfter;
          if (drop >= BLUNDER_DROP_CP && evalAfter < BLUNDER_KEEP_CP) {
            setPendingMove({
              from, to, promotion: 'q', san: m.san,
              threat: describeThreat(g2.fen(), after.bestMove),
            });
            return; // hold the move until the player confirms or takes it back
          }
        }
      } catch {
        setCoachChecking(false);
      }
    }

    commitMove(from, to, 'q');
  }

  // Actually play the player's move and trigger the engine's reply.
  function commitMove(from, to, promotion = 'q') {
    const g = gameRef.current;
    if (!g) return;
    const g2 = new Chess(g.fen());
    const m = g2.move({ from, to, promotion });
    if (!m) return;

    gameRef.current = g2;
    playerMovesRef.current++;
    setFen(g2.fen());
    setLastMove([from, to]);
    setHintArrow(null);
    setHistory(h => [...h, { move: m, fen: g2.fen(), san: m.san }]);
    setMoveIndex(i => i + 1);

    // Add increment to the player's clock (they just moved)
    if (isTimed && timeControl.increment) {
      if (playerColorRef.current === 'white') setWhiteTime(t => (t ?? 0) + timeControl.increment * 1000);
      else setBlackTime(t => (t ?? 0) + timeControl.increment * 1000);
    }

    if (g2.isGameOver()) { checkEnd(g2); return; }

    setThinking(true);
    setTimeout(() => requestEngineMove(g2.fen()), 300);
  }

  // Describe what the opponent's best reply punishes, for the blunder warning.
  function describeThreat(fenAfterPlayerMove, oppBestUci) {
    if (!oppBestUci) return null;
    try {
      const g = new Chess(fenAfterPlayerMove);
      const mv = g.move({ from: oppBestUci.slice(0, 2), to: oppBestUci.slice(2, 4), promotion: oppBestUci[4] || undefined });
      if (!mv) return null;
      if (mv.captured) {
        const names = { p: 'pawn', n: 'knight', b: 'bishop', r: 'rook', q: 'queen', k: 'king' };
        return `${mv.san} would win your ${names[mv.captured] || 'piece'}`;
      }
      if (mv.san.endsWith('#')) return `${mv.san} is checkmate`;
      if (mv.san.endsWith('+')) return `${mv.san} comes with check`;
      return `${mv.san} is strong`;
    } catch { return null; }
  }

  function confirmPendingMove() {
    if (!pendingMove) return;
    const { from, to, promotion } = pendingMove;
    setPendingMove(null);
    commitMove(from, to, promotion);
  }

  function cancelPendingMove() {
    // The move was never committed, so the board simply snaps back to `fen`.
    setPendingMove(null);
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
    const newFen = newHistory.length > 0 ? newHistory[newHistory.length - 1].fen : startFenRef.current;
    gameRef.current = new Chess(newFen);
    setFen(newFen);
    setHistory(newHistory);
    setMoveIndex(newHistory.length - 1);
    setLastMove(null);
    setHintArrow(null);
    setThinking(false);
    setCoachChecking(false);
    setPendingMove(null);
    if (coachModeRef.current) primeCoachEval(newFen);
  }

  function resign() {
    if (gameEndedRef.current) return;
    gameEndedRef.current = true;
    setResult('You resigned');
    setPhase('ended');
    progressService.logActivity(`Played vs ${opponent.label} — Resigned`);
    progressService.recordActivity();
    finishRated(0, 'Resigned');
  }

  function requestHint() {
    if (!gameRef.current || thinking || !hintEngineRef.current) return;
    waitingForHint.current = true;
    hintFenRef.current = gameRef.current.fen();
    hintEngineRef.current.getQuickHint(gameRef.current.fen());
  }

  function handleAnalyze() {
    sessionStorage.setItem('enpassant:reviewGame', JSON.stringify({
      history: history.map(h => ({ san: h.san, fen: h.fen })),
      playerColor,
      result,
      label: persona ? `vs ${persona.name} (${persona.elo})` : `vs Stockfish (${preset.label}, ${preset.elo} ELO)`,
      startingFen: startFenRef.current,
    }));
    navigate('/play/analysis');
  }

  const turnColor = gameRef.current ? (gameRef.current.turn() === 'w' ? 'white' : 'black') : 'white';
  const isPlayerTurn = turnColor === playerColor && !thinking;
  const canMove = isPlayerTurn && !coachChecking && !pendingMove;
  const inCheck = phase === 'playing' && !!gameRef.current?.isCheck();
  // Memoised board props — stable identities so a clock tick doesn't recompute or churn them.
  const legalDests = useMemo(
    () => (canMove && phase === 'playing') ? getLegalDests() : EMPTY_DESTS,
    [fen, canMove, phase]
  );
  const boardArrows = useMemo(() => hintArrow || [], [hintArrow]);
  const handleExplorerMove = useMemo(
    () => (canMove ? (uci) => handleMove(uci.slice(0, 2), uci.slice(2, 4)) : null),
    [canMove]
  );
  // evaluation is stored from White's perspective
  const evalClamped = Math.max(-5, Math.min(5, evaluation));
  const evalPct = ((evalClamped + 5) / 10) * 100;

  const ratedSetup = rated && !customStartFen;
  const yourLevel = listRatedGames().length ? nearestLevel(currentRating()) : null;
  // What the subtitle says about the rating: in progress, the change at the end, or an abort.
  const ratingNote = ratingRow
    ? (ratingRow.aborted ? 'Aborted: not rated'
      : `Rating ${ratingRow.before} → ${ratingRow.after} (${ratingRow.after - ratingRow.before >= 0 ? '+' : ''}${ratingRow.after - ratingRow.before})`)
    : (phase === 'playing' && ratedRef.current ? 'Rated' : null);

  if (phase === 'setup') {
    return (
      <div className="page-enter max-w-2xl mx-auto px-4 sm:px-6 py-6 lg:py-10">
        <h1 className="text-2xl sm:text-3xl font-display mb-1">Play vs Computer</h1>
        <p className="text-text-dim text-sm mb-6">Play club-style opponents from 400 to 1200, or Stockfish at any level.</p>
        {customStartFen && (
          <div className="card-base p-3 mb-4 flex items-center justify-between gap-3 bg-gold/5">
            <div className="text-sm">
              <span className="text-gold font-semibold">Playing from a set-up position.</span>
              <span className="text-text-dim"> You'll start as the side to move.</span>
            </div>
            <button onClick={() => setCustomStartFen(null)} className="text-xs px-3 py-1.5 rounded-lg bg-bg-card border border-bg-hover hover:bg-bg-hover shrink-0">Use standard start</button>
          </div>
        )}
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
              <label className="text-sm text-text-dim font-medium">Opponent</label>
              <div className="flex gap-1 text-xs">
                {[{ id: 'persona', label: 'Club players' }, { id: 'engine', label: 'Stockfish' }].map(m => (
                  <button key={m.id} onClick={() => setOpponentMode(m.id)}
                    className={`px-2.5 py-1 rounded-md transition-all ${opponentMode === m.id ? 'bg-bg-hover text-text' : 'text-text-dim hover:text-text'}`}>
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
            {opponentMode === 'persona' ? (
              <>
                <div className="space-y-2">
                  {PERSONA_LEVELS.map(level => (
                    <div key={level} className="flex items-center gap-2">
                      <span className={`w-16 shrink-0 text-xs tabular-nums ${level === yourLevel ? 'text-gold' : 'text-text-dim'}`}>
                        {level}{level === yourLevel && <span className="block leading-tight">your level</span>}
                      </span>
                      <div className="flex-1 grid grid-cols-3 gap-2">
                        {PERSONAS.filter(p => p.elo === level).map(p => (
                          <button key={p.id} onClick={() => setPersonaId(p.id)} aria-pressed={personaId === p.id}
                            className={`py-2 rounded-lg text-sm font-medium transition-all btn-press ${personaId === p.id ? 'bg-gold text-bg' : 'bg-bg-hover text-text-dim hover:text-text'}`}>
                            {p.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-text-dim mt-2">Each one plays differently. Work out how as you go. Ratings are estimates.</p>
              </>
            ) : (
              <div className="space-y-6">
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
                <label className="text-sm text-text-dim block mb-3 font-medium">Opponent style</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {PERSONALITIES.map(p => (
                    <button key={p.id} onClick={() => setPersonality(p.id)}
                      title={p.desc}
                      className={`py-2 rounded-lg text-sm font-medium transition-all btn-press ${personality === p.id ? 'bg-gold text-bg' : 'bg-bg-hover text-text-dim hover:text-text'}`}>
                      {p.label}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-text-dim mt-2">{PERSONALITIES.find(p => p.id === personality)?.desc}</p>
              </div>
              </div>
            )}
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
          <label className={`flex items-center justify-between gap-3 ${customStartFen ? 'opacity-50' : 'cursor-pointer'}`}>
            <span>
              <span className="text-sm font-medium block">Rated game</span>
              <span className="text-xs text-text-dim">
                {customStartFen
                  ? 'Only games from the standard start are rated.'
                  : <>Counts towards your rating (now <span className="text-gold tabular-nums">{currentRating()}</span>). No hints, takebacks, opening book or blunder warnings.</>}
              </span>
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={rated && !customStartFen}
              disabled={!!customStartFen}
              onClick={() => setRated(r => {
                try { localStorage.setItem(RATED_PREF_KEY, r ? 'off' : 'on'); } catch { /* storage unavailable */ }
                return !r;
              })}
              className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${rated && !customStartFen ? 'bg-gold' : 'bg-bg-hover'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-bg transition-transform ${rated && !customStartFen ? 'translate-x-5' : ''}`} />
            </button>
          </label>
          <label className={`flex items-center justify-between gap-3 ${ratedSetup ? 'opacity-50' : 'cursor-pointer'}`}>
            <span>
              <span className="text-sm font-medium block">Blunder warnings</span>
              <span className="text-xs text-text-dim">{ratedSetup ? 'Off in rated games.' : 'Coach checks each of your moves and warns before a big mistake.'}</span>
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={coachMode && !ratedSetup}
              disabled={ratedSetup}
              onClick={() => setCoachMode(c => !c)}
              className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${coachMode && !ratedSetup ? 'bg-gold' : 'bg-bg-hover'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-bg transition-transform ${coachMode && !ratedSetup ? 'translate-x-5' : ''}`} />
            </button>
          </label>
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
            {/* div, not h1: the global h1 size rule would override text-base and push the board down */}
            <div role="heading" aria-level={1} className="text-base font-display text-gold truncate">
              {phase === 'ended' ? result : coachChecking ? 'Checking your move…' : thinking ? 'Engine thinking...' : isPlayerTurn ? 'Your move' : ''}
            </div>
            <p className="text-text-dim text-[11px]">vs {opponent.short}{ratingNote && <> · <span className="text-gold">{ratingNote}</span></>}</p>
          </div>
          {inCheck && (
            <span className="bg-incorrect/15 text-incorrect border border-incorrect/20 px-2 py-0.5 rounded text-xs font-semibold">Check!</span>
          )}
          {thinking && !inCheck && (
            <div className="flex gap-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          )}
        </div>

        {/* Horizontal eval bar. White fill = White's advantage, anchored on White's
            side of the board (right when the board is flipped for a Black player). */}
        <div className="h-2 rounded-full overflow-hidden bg-bg-hover relative mb-1" title={`Eval: ${fmtEval(evaluation)}`}>
          <div
            className={`absolute top-0 bottom-0 bg-white transition-all duration-500 ease-out rounded-full ${playerColor === 'black' ? 'right-0' : 'left-0'}`}
            style={{ width: `${evalPct}%` }}
          />
        </div>

        {/* Opponent clock (above board) */}
        {isTimed && (
          <ClockChip
            label={persona ? persona.name : 'Engine'}
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
            movable={canMove && phase === 'playing'}
            dests={legalDests}
            turnColor={turnColor}
            onMove={handleMove}
            lastMove={lastMove}
            arrows={boardArrows}
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
              {!ratedRef.current && <>
              <button onClick={takeBack} disabled={history.length < 2 || thinking} className="flex-1 py-2.5 rounded-lg bg-bg-card border border-bg-hover text-sm font-medium hover:bg-bg-hover transition-all btn-press disabled:opacity-30">Takeback</button>
              <button onClick={requestHint} disabled={thinking || !isPlayerTurn} className="flex-1 py-2.5 rounded-lg bg-bg-card border border-bg-hover text-sm font-medium hover:bg-bg-hover transition-all btn-press disabled:opacity-30">{hintArrow ? 'Hint ✓' : 'Hint'}</button>
              </>}
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
          <span><span className="text-text-dim mr-1">Eval</span><span className={`tabular-nums font-medium ${evaluation > 0.5 ? 'text-correct' : evaluation < -0.5 ? 'text-incorrect' : 'text-text-dim'}`}>{fmtEval(evaluation)}</span></span>
        </div>
        <div className="mt-1 max-h-20 overflow-y-auto">
          <MoveList history={history} currentIndex={moveIndex} />
        </div>
        {phase === 'playing' && !ratedRef.current && (
          <OpeningExplorer
            fen={fen}
            className="mt-2"
            onPlayMove={handleExplorerMove}
          />
        )}
      </div>

      {/* Desktop: side-by-side layout */}
      <div className="hidden lg:block page-enter max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-display text-gold mb-0.5">
              {phase === 'ended' ? result : coachChecking ? 'Checking your move…' : thinking ? 'Engine thinking...' : isPlayerTurn ? 'Your move' : ''}
            </h1>
            <p className="text-text-dim text-sm">vs {opponent.long}{ratingNote && <> · <span className="text-gold">{ratingNote}</span></>}</p>
          </div>
          {inCheck && (
            <span className="bg-incorrect/15 text-incorrect border border-incorrect/20 px-3 py-1 rounded-lg text-sm font-semibold">Check!</span>
          )}
        </div>
        <div className="grid grid-cols-[1fr_320px] gap-8">
          <div className="max-w-[560px] sticky top-4 self-start">
            {/* Opponent clock above board */}
            {isTimed && (
              <ClockChip
                label={persona ? persona.name : `Stockfish (${preset.label})`}
                ms={playerColor === 'white' ? blackTime : whiteTime}
                active={turnColor !== playerColor && phase === 'playing'}
                className="mb-2"
              />
            )}
            <div className="flex gap-2">
              <div className="w-4 rounded-full overflow-hidden bg-bg-hover flex-shrink-0 relative" title={`Eval: ${fmtEval(evaluation)}`}>
                {/* White fill anchored on White's side of the board — top when flipped for Black. */}
                <div className={`absolute left-0 right-0 bg-white transition-all duration-500 ease-out rounded-full ${playerColor === 'black' ? 'top-0' : 'bottom-0'}`} style={{ height: `${evalPct}%` }} />
              </div>
              <div className="flex-1">
                <ChessBoard
                  fen={fen}
                  orientation={playerColor}
                  movable={canMove && phase === 'playing'}
                  dests={legalDests}
                  turnColor={turnColor}
                  onMove={handleMove}
                  lastMove={lastMove}
                  arrows={boardArrows}
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
                  {!ratedRef.current && <>
                  <button onClick={takeBack} disabled={history.length < 2 || thinking} className="flex-1 py-2 rounded-lg bg-bg-card border border-bg-hover text-base hover:bg-bg-hover transition-all btn-press disabled:opacity-30 disabled:cursor-not-allowed">Takeback</button>
                  <button onClick={requestHint} disabled={thinking || !isPlayerTurn} className="flex-1 py-2 rounded-lg bg-bg-card border border-bg-hover text-base hover:bg-bg-hover transition-all btn-press disabled:opacity-30 disabled:cursor-not-allowed">{hintArrow ? 'Hint shown' : 'Hint'}</button>
                  </>}
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
            <MoveList history={history} currentIndex={moveIndex} />
            <div className="card-base p-4">
              <div className="flex justify-between text-sm mb-2"><span className="text-text-dim">Moves</span><span className="tabular-nums">{Math.ceil(history.length / 2)}</span></div>
              <div className="flex justify-between text-sm mb-2"><span className="text-text-dim">Evaluation</span><span className={`tabular-nums font-medium ${evaluation > 0.5 ? 'text-correct' : evaluation < -0.5 ? 'text-incorrect' : 'text-text-dim'}`}>{fmtEval(evaluation)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-text-dim">Opponent</span><span>{persona ? `${persona.name} (${persona.elo})` : `${preset.label} (${preset.elo})`}</span></div>
            </div>
            {thinking && (
              <div className="card-base p-4 flex items-center gap-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-gold animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-gold animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-gold animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-sm text-text-dim">{persona ? `${persona.name} is thinking…` : 'Stockfish is calculating...'}</span>
              </div>
            )}
            {phase === 'playing' && !ratedRef.current && (
              <OpeningExplorer
                fen={fen}
                onPlayMove={handleExplorerMove}
              />
            )}
          </div>
        </div>
      </div>

      {/* Blunder warning (coach mode) */}
      {pendingMove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="blunder-title">
          <div className="card-base p-5 max-w-sm w-full border border-amber/40 shadow-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-amber text-xl">⚠</span>
              <h2 id="blunder-title" className="text-lg font-display">Hold on — that looks risky</h2>
            </div>
            <p className="text-sm text-text-dim mb-1">
              <span className="font-semibold text-text">{pendingMove.san}</span> may be a blunder.
            </p>
            {pendingMove.threat && (
              <p className="text-sm text-text-dim mb-3">After it, <span className="text-text">{pendingMove.threat}</span>.</p>
            )}
            <p className="text-xs text-text-dim/80 mb-4">Take another look, or play it anyway if you've seen something the coach hasn't.</p>
            <div className="flex gap-2">
              <button ref={cancelBtnRef} onClick={cancelPendingMove} className="flex-1 py-2.5 rounded-lg bg-gold text-bg font-semibold hover:bg-gold-dim transition-all btn-press">Take it back</button>
              <button onClick={confirmPendingMove} className="flex-1 py-2.5 rounded-lg bg-bg-card border border-bg-hover text-sm font-medium hover:bg-bg-hover transition-all btn-press">Play anyway</button>
            </div>
          </div>
        </div>
      )}
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
