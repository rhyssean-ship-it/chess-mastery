import { useState, useEffect, useRef } from 'react';
import { Chess } from 'chess.js';
import ChessBoard from '../components/ChessBoard';

const STORE_KEY = 'chess-mastery:blindfoldLadder';
const STARTING_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

// Curated short tactical sequences from real openings to play out blindfold.
// Each is a list of SAN moves from the starting position. Levels grow.
const SEQUENCES = [
  { ply: 2, moves: ['e4', 'e5'] },
  { ply: 3, moves: ['e4', 'e5', 'Nf3'] },
  { ply: 4, moves: ['e4', 'e5', 'Nf3', 'Nc6'] },
  { ply: 5, moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5'] },
  { ply: 6, moves: ['d4', 'Nf6', 'c4', 'e6', 'Nc3', 'Bb4'] },
  { ply: 7, moves: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4'] },
  { ply: 8, moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'a6', 'Ba4', 'Nf6'] },
  { ply: 9, moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'a6', 'Ba4', 'Nf6', 'O-O'] },
  { ply: 10, moves: ['d4', 'd5', 'c4', 'e6', 'Nc3', 'Nf6', 'Bg5', 'Be7', 'e3', 'O-O'] },
  { ply: 11, moves: ['e4', 'c6', 'd4', 'd5', 'Nc3', 'dxe4', 'Nxe4', 'Bf5', 'Ng3', 'Bg6', 'h4'] },
  { ply: 12, moves: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'a6', 'Be2', 'e5'] },
];

const FILES = ['a','b','c','d','e','f','g','h'];
const RANKS = ['1','2','3','4','5','6','7','8'];

function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function loadStore() { try { return JSON.parse(localStorage.getItem(STORE_KEY)) || { best: 0, attempts: 0 }; } catch { return { best: 0, attempts: 0 }; } }
function saveStore(s) { localStorage.setItem(STORE_KEY, JSON.stringify(s)); }

export default function BlindfoldLadder() {
  const [store, setStore] = useState(loadStore);
  const [phase, setPhase] = useState('idle'); // idle | studying | playing | success | failed
  const [level, setLevel] = useState(0);
  const [studyTime, setStudyTime] = useState(5);
  const [question, setQuestion] = useState(null);
  const [chosen, setChosen] = useState(null);
  const studyTimerRef = useRef(null);

  useEffect(() => () => clearInterval(studyTimerRef.current), []);

  function startLadder() {
    setLevel(0);
    beginLevel(0);
  }

  function beginLevel(lvl) {
    const seq = SEQUENCES[lvl];
    if (!seq) {
      setPhase('success');
      return;
    }
    // Compute the position after the sequence is played (never shown — the
    // user studies the STARTING position and must play the moves in their head).
    const g = new Chess(STARTING_FEN);
    const played = [];
    for (const m of seq.moves) played.push(g.move(m));
    setPhase('studying');
    setChosen(null);
    setStudyTime(5);
    clearInterval(studyTimerRef.current);
    // Count down in the interval closure (not inside a state updater, which
    // must stay pure) and start the quiz when it hits zero.
    let remaining = 5;
    studyTimerRef.current = setInterval(() => {
      remaining -= 1;
      setStudyTime(remaining);
      if (remaining <= 0) {
        clearInterval(studyTimerRef.current);
        beginQuiz(g, seq, played);
      }
    }, 1000);
  }

  function beginQuiz(game, seq, played) {
    // Ask about a square the sequence touched (a piece's new home, or a square
    // it vacated — so "Empty square" can be the answer), occasionally any square.
    const touched = new Set();
    for (const mv of played) {
      touched.add(mv.from);
      touched.add(mv.to);
      if (mv.isKingsideCastle?.() || mv.flags?.includes('k')) { touched.add(mv.color === 'w' ? 'h1' : 'h8'); touched.add(mv.color === 'w' ? 'f1' : 'f8'); }
      if (mv.isQueensideCastle?.() || mv.flags?.includes('q')) { touched.add(mv.color === 'w' ? 'a1' : 'a8'); touched.add(mv.color === 'w' ? 'd1' : 'd8'); }
    }
    const allSquares = [];
    for (const f of FILES) for (const r of RANKS) allSquares.push(f + r);
    // ~85% of the time pick a touched square, otherwise any square. Within
    // the pool, ask about an empty square roughly a third of the time.
    const pool = touched.size > 0 && pickRandom([1, 2, 3, 4, 5, 6, 0]) ? [...touched] : allSquares;
    const occupiedSqs = pool.filter(s => game.get(s));
    const emptySqs = pool.filter(s => !game.get(s));
    const wantEmpty = pickRandom([true, false, false]);
    const sq = pickRandom((wantEmpty && emptySqs.length) || !occupiedSqs.length ? emptySqs : occupiedSqs);
    const piece = game.get(sq);
    const pieceChars = { p: 'pawn', n: 'knight', b: 'bishop', r: 'rook', q: 'queen', k: 'king' };
    const target = { sq, piece };
    const correctLabel = piece
      ? `${piece.color === 'w' ? 'White' : 'Black'} ${pieceChars[piece.type]}`
      : 'Empty square';
    const optionPool = [
      'White pawn', 'White knight', 'White bishop', 'White rook', 'White queen', 'White king',
      'Black pawn', 'Black knight', 'Black bishop', 'Black rook', 'Black queen', 'Black king',
      'Empty square',
    ];
    const wrongs = optionPool.filter(o => o !== correctLabel).sort(() => Math.random() - 0.5).slice(0, 3);
    const options = [correctLabel, ...wrongs].sort(() => Math.random() - 0.5);
    setQuestion({
      seq: seq.moves,
      square: target.sq,
      correct: correctLabel,
      options,
    });
    setPhase('playing');
  }

  function choose(opt) {
    setChosen(opt);
    if (opt === question.correct) {
      // Level passed
      const newBest = Math.max(store.best, level + 1);
      setStore(s => {
        const next = { ...s, best: Math.max(s.best, level + 1) };
        saveStore(next);
        return next;
      });
      setTimeout(() => {
        if (level + 1 >= SEQUENCES.length) {
          setPhase('success');
        } else {
          setLevel(level + 1);
          beginLevel(level + 1);
        }
      }, 900);
    } else {
      // Failed
      setStore(s => {
        const next = { ...s, attempts: s.attempts + 1, best: Math.max(s.best, level) };
        saveStore(next);
        return next;
      });
      setPhase('failed');
    }
  }

  if (phase === 'idle' || phase === 'success' || phase === 'failed') {
    return (
      <div className="page-enter max-w-2xl mx-auto px-4 sm:px-6 py-6 lg:py-10 text-center">
        <h1 className="text-2xl sm:text-3xl font-display mb-1">Blindfold Ladder</h1>
        <p className="text-text-dim mb-6">Study the starting position for 5 seconds, then play the move sequence in your head. Identify what's on a target square in the final position.</p>

        <div className="card-base p-6 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-text-dim">Best level reached</div>
              <div className="text-2xl sm:text-3xl font-display tabular-nums">{store.best}</div>
            </div>
            <div>
              <div className="text-xs text-text-dim">Attempts</div>
              <div className="text-3xl font-display tabular-nums">{store.attempts}</div>
            </div>
          </div>
        </div>

        {phase === 'failed' && (
          <div className="mb-4 text-sm text-incorrect">
            Wrong. The {question?.square.toUpperCase()} square had <span className="font-semibold">{question?.correct}</span>. You reached level {level + 1}.
          </div>
        )}
        {phase === 'success' && (
          <div className="mb-4 text-sm text-correct font-semibold">Maxed out the ladder! Impressive.</div>
        )}

        <button onClick={startLadder} className="bg-gold text-bg px-6 py-3 rounded-lg font-semibold hover:bg-gold-dim btn-press">
          {phase === 'idle' ? 'Start the ladder' : 'Try again'}
        </button>
      </div>
    );
  }

  if (phase === 'studying') {
    return (
      <div className="page-enter max-w-2xl mx-auto px-4 sm:px-6 py-6 text-center">
        <h1 className="text-2xl font-display mb-1">Level {level + 1}</h1>
        <p className="text-text-dim text-sm mb-3">Study the starting position — {studyTime}s remaining. Then play the moves in your head.</p>
        <div className="w-full max-w-[480px] mx-auto">
          <ChessBoard fen={STARTING_FEN} orientation="white" movable={false} />
        </div>
      </div>
    );
  }

  // playing
  return (
    <div className="page-enter max-w-2xl mx-auto px-4 sm:px-6 py-6">
      <div className="text-center mb-4">
        <h1 className="text-2xl font-display mb-1">Level {level + 1}</h1>
        <p className="text-text-dim text-sm">{SEQUENCES[level].ply} moves played from the starting position</p>
      </div>
      <div className="card-base p-5 mb-4">
        <div className="text-xs text-text-dim uppercase tracking-wide mb-2">Sequence</div>
        <div className="font-mono text-lg tabular-nums">
          {question.seq.map((m, i) => (
            <span key={i} className="mr-2">
              {i % 2 === 0 && <span className="text-text-dim/60 mr-1">{Math.floor(i / 2) + 1}.</span>}
              {m}
            </span>
          ))}
        </div>
      </div>
      <div className="card-base p-5 mb-4 text-center">
        <div className="text-xs text-text-dim uppercase tracking-wide mb-2">Question</div>
        <p className="text-lg">After these moves, what is on square <span className="text-gold font-bold text-2xl">{question.square.toUpperCase()}</span>?</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {question.options.map(opt => {
          const correct = chosen && opt === question.correct;
          const wrong = chosen === opt && opt !== question.correct;
          return (
            <button
              key={opt}
              onClick={() => !chosen && choose(opt)}
              disabled={!!chosen}
              className={`p-3 rounded-lg text-sm transition-all ${correct ? 'bg-correct text-bg' : wrong ? 'bg-incorrect text-white' : 'bg-bg-card border border-bg-hover hover:bg-bg-hover'}`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
