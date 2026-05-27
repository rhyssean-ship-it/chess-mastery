import { useState, useEffect, useRef } from 'react';
import ChessBoard from '../components/ChessBoard';
import { pickPuzzles, THEME_GROUPS } from '../services/lichessPuzzleService';

const STORE_KEY = 'chess-mastery:patternDojo';

// Tactical motifs we'll quiz on. Order matters for option layout.
const MOTIFS = THEME_GROUPS
  .filter(g => ['fork', 'pin', 'skewer', 'discoveredAttack', 'deflection', 'hangingPiece', 'sacrifice', 'backRankMate', 'mateIn1', 'mateIn2'].includes(g.key))
  .map(g => ({ key: g.key, label: g.label.replace(/s$/, '').replace('Forks', 'Fork').replace('Pins', 'Pin').replace('Skewers', 'Skewer') }));

function loadStore() { try { return JSON.parse(localStorage.getItem(STORE_KEY)) || { correct: 0, total: 0, streak: 0, best: 0 }; } catch { return { correct: 0, total: 0, streak: 0, best: 0 }; } }
function saveStore(s) { localStorage.setItem(STORE_KEY, JSON.stringify(s)); }

// Determine the primary motif of a puzzle (first match from our key set).
function primaryMotif(puzzle) {
  for (const m of MOTIFS) if (puzzle.themes.includes(m.key)) return m.key;
  return null;
}

export default function PatternDojo() {
  const [store, setStore] = useState(loadStore);
  const [phase, setPhase] = useState('idle'); // idle | flashing | choosing | reveal
  const [puzzle, setPuzzle] = useState(null);
  const [options, setOptions] = useState([]);
  const [chosen, setChosen] = useState(null);
  const [flashTimer, setFlashTimer] = useState(0);
  const [streak, setStreak] = useState(0);
  const flashRef = useRef(null);

  useEffect(() => () => clearInterval(flashRef.current), []);

  function newPuzzle() {
    setChosen(null);
    // Sample a puzzle that has at least one motif from our list
    let p = null;
    for (let i = 0; i < 8 && !p; i++) {
      const candidates = pickPuzzles({ n: 6, ratingMin: 1100, ratingMax: 2000 });
      p = candidates.find(c => primaryMotif(c)) || null;
    }
    if (!p) p = pickPuzzles({ n: 1 })[0];
    setPuzzle(p);

    // Build 4 options: the correct motif + 3 distractors
    const correct = primaryMotif(p) || MOTIFS[0].key;
    const distractors = MOTIFS.filter(m => m.key !== correct).sort(() => Math.random() - 0.5).slice(0, 3);
    const opts = [...distractors.map(d => d.key), correct].sort(() => Math.random() - 0.5);
    setOptions(opts);

    // Flash
    setPhase('flashing');
    setFlashTimer(5);
    clearInterval(flashRef.current);
    flashRef.current = setInterval(() => {
      setFlashTimer(t => {
        if (t <= 1) {
          clearInterval(flashRef.current);
          setPhase('choosing');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }

  function choose(motifKey) {
    setChosen(motifKey);
    setPhase('reveal');
    const correct = primaryMotif(puzzle);
    const isRight = motifKey === correct;
    const newStreak = isRight ? streak + 1 : 0;
    setStreak(newStreak);
    setStore(s => {
      const next = {
        correct: s.correct + (isRight ? 1 : 0),
        total: s.total + 1,
        streak: newStreak,
        best: Math.max(s.best, newStreak),
      };
      saveStore(next);
      return next;
    });
  }

  function start() { setStreak(0); newPuzzle(); }
  function next() { newPuzzle(); }

  const playerColor = puzzle ? (puzzle.fen.split(' ')[1] === 'w' ? 'black' : 'white') : 'white';
  const correct = puzzle ? primaryMotif(puzzle) : null;

  if (phase === 'idle') {
    return (
      <div className="page-enter max-w-2xl mx-auto px-4 sm:px-6 py-6 lg:py-10 text-center">
        <h1 className="text-2xl sm:text-3xl font-display mb-1">Pattern Dojo</h1>
        <p className="text-text-dim mb-6">A position flashes for 5 seconds. Identify the tactical motif. Build pattern intuition through repetition.</p>
        <div className="card-base p-5 mb-6 grid grid-cols-3 gap-3 text-center">
          <div><div className="text-xs text-text-dim">Accuracy</div><div className="text-2xl font-display text-gold tabular-nums">{store.total > 0 ? Math.round(store.correct / store.total * 100) : 0}%</div></div>
          <div><div className="text-xs text-text-dim">Solved</div><div className="text-2xl font-display tabular-nums">{store.correct}/{store.total}</div></div>
          <div><div className="text-xs text-text-dim">Best streak</div><div className="text-2xl font-display tabular-nums">{store.best}</div></div>
        </div>
        <button onClick={start} className="bg-gold text-bg px-6 py-3 rounded-lg font-semibold hover:bg-gold-dim btn-press">Start training</button>
      </div>
    );
  }

  return (
    <div className="page-enter max-w-3xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex justify-between items-baseline mb-3">
        <h1 className="text-xl font-display text-gold">Pattern Dojo</h1>
        <div className="text-sm text-text-dim">Streak <span className="text-gold font-bold tabular-nums">{streak}</span> · Best {store.best}</div>
      </div>

      <div className="mx-auto w-full max-w-[480px] relative">
        <ChessBoard fen={puzzle.fen} orientation={playerColor} movable={false} />
        {phase === 'choosing' && (
          <div className="absolute inset-0 bg-bg-card flex items-center justify-center rounded-xl">
            <div className="text-text-dim text-center">
              <div className="text-2xl sm:text-3xl font-display mb-2">?</div>
              <div className="text-sm">What was the motif?</div>
            </div>
          </div>
        )}
        {phase === 'flashing' && (
          <div className="absolute top-2 right-2 bg-bg/80 px-2 py-1 rounded text-sm tabular-nums text-gold">{flashTimer}s</div>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {options.map(opt => {
          const meta = MOTIFS.find(m => m.key === opt);
          const isCorrect = phase === 'reveal' && opt === correct;
          const isChosenWrong = phase === 'reveal' && chosen === opt && opt !== correct;
          return (
            <button
              key={opt}
              onClick={() => phase === 'choosing' && choose(opt)}
              disabled={phase !== 'choosing'}
              className={`p-3 rounded-lg text-sm transition-all ${isCorrect ? 'bg-correct text-bg font-semibold' : isChosenWrong ? 'bg-incorrect text-white' : 'bg-bg-card border border-bg-hover hover:bg-bg-hover disabled:opacity-50'}`}
            >
              {meta?.label || opt}
            </button>
          );
        })}
      </div>

      {phase === 'reveal' && (
        <div className="mt-4 flex gap-2">
          <button onClick={next} className="flex-1 py-2.5 rounded-lg bg-gold text-bg font-semibold hover:bg-gold-dim btn-press">Next pattern</button>
          <button onClick={() => setPhase('idle')} className="px-5 py-2.5 rounded-lg bg-bg-card border border-bg-hover hover:bg-bg-hover">Stop</button>
        </div>
      )}
    </div>
  );
}
