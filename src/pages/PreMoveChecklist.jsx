import { useState, useMemo, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Chess } from 'chess.js';
import ChessBoard from '../components/ChessBoard';
import preMoveChecklist from '../data/preMoveChecklist';
import walkthroughs from '../data/spyScanSafeGames';
import { STEPS, safetyCheck } from '../services/spyScanSafe';
import { ownWalkthrough } from '../services/ownWalkthrough';
import { progressService } from '../services/progressService';

const TABS = [
  { id: 'routine', label: 'Routine' },
  { id: 'games', label: 'Walkthroughs' },
  { id: 'checks', label: 'Quick checks' },
];

const GRADE = {
  best: { label: 'Best move', cls: 'bg-correct/10 text-correct' },
  good: { label: 'Good move', cls: 'bg-correct/10 text-correct' },
  ok: { label: 'Playable', cls: 'bg-gold/10 text-gold' },
  risky: { label: 'Risky', cls: 'bg-amber/10 text-amber' },
  blunder: { label: 'Blunder', cls: 'bg-incorrect/10 text-incorrect' },
  other: { label: 'Your move', cls: 'bg-bg-hover/40 text-text' },
};

export default function PreMoveChecklist() {
  const [tab, setTab] = useState('routine');

  return (
    <div className="page-enter page page-wide">
      <h1 className="text-2xl sm:text-3xl font-display mb-1">Spy, Scan, Safe</h1>
      <p className="text-text-dim text-sm mb-4">One routine, every move, in this order.</p>

      <div className="flex rounded-lg bg-bg-card border border-bg-hover overflow-hidden text-sm mb-6 w-fit max-w-full">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-3 sm:px-4 py-2 transition-all whitespace-nowrap ${tab === t.id ? 'bg-gold text-bg font-semibold' : 'text-text-dim hover:text-text'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'routine' && <Routine onStart={setTab} />}
      {tab === 'games' && <Walkthroughs />}
      {tab === 'checks' && <QuickChecks />}
    </div>
  );
}

function StepCard({ step, index }) {
  return (
    <div className="card-base p-4 sm:p-5">
      <div className="flex items-baseline gap-3 mb-3">
        <span className="w-8 h-8 rounded-lg bg-gold/10 text-gold flex items-center justify-center font-semibold shrink-0">{index + 1}</span>
        <div>
          <div className="text-lg font-semibold">{step.label}</div>
          <div className="text-text-dim text-sm">{step.title}</div>
        </div>
      </div>
      <ul className="space-y-2">
        {step.prompts.map(p => (
          <li key={p.key} className="text-sm leading-snug">
            <span className="font-semibold">{p.label}:</span> <span className="text-text-dim">{p.text}</span>
          </li>
        ))}
      </ul>
      <p className="text-sm mt-3 bg-bg-hover/30 rounded-md px-3 py-2">{step.rule}</p>
    </div>
  );
}

function Routine({ onStart }) {
  return (
    <div className="max-w-3xl">
      <div className="space-y-3 mb-6">
        {STEPS.map((s, i) => <StepCard key={s.id} step={s} index={i} />)}
      </div>

      <div className="card-base p-4 sm:p-5 mb-6">
        <div className="font-semibold mb-1">When nothing is forcing</div>
        <p className="text-sm text-text-dim">If Spy and Scan turn up nothing, play a useful move: develop a piece, improve your worst piece, castle, or take space in the centre. Then run Safe.</p>
        <div className="font-semibold mt-4 mb-1">How much to use it</div>
        <p className="text-sm text-text-dim"><span className="text-text">Every move:</span> a quick pass. Spy is “why did they play that?”, Scan is a glance for checks and captures, Safe is the blunder check.</p>
        <p className="text-sm text-text-dim mt-1"><span className="text-text">Sharp positions, after a capture, or when you’re unsure:</span> the full routine, slowly.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <button onClick={() => onStart('games')} className="btn btn-primary btn-lg">Walk through a game</button>
        <button onClick={() => onStart('checks')} className="btn btn-secondary btn-lg">Quick checks</button>
        <Link to="/thinking-drills" className="btn btn-secondary btn-lg">Drill each step</Link>
        <Link to="/practice-play" className="btn btn-secondary btn-lg">Play with the coach</Link>
      </div>
    </div>
  );
}

// ---------- Game walkthroughs ----------

function Walkthroughs() {
  const [gameId, setGameId] = useState(null);
  const own = useMemo(() => ownWalkthrough(), []);
  const game = gameId === own?.id ? own : walkthroughs.find(g => g.id === gameId);
  if (game) return <WalkthroughPlayer key={game.id} game={game} onExit={() => setGameId(null)} />;
  return (
    <div className="max-w-3xl space-y-2">
      {own ? (
        <button onClick={() => setGameId(own.id)} className="w-full text-left card-base p-4 hover:bg-bg-hover/30 transition-all bg-gold/5">
          <div className="font-semibold">{own.title}</div>
          <div className="text-xs text-text-dim mt-0.5">{own.subtitle}</div>
          <div className="text-sm text-text-dim mt-2">{own.intro}</div>
        </button>
      ) : (
        <div className="card-base p-4 text-sm text-text-dim">
          Analyse a game and your own mistakes will appear here as a walkthrough. <Link to="/practice-play" className="text-gold">Play a coached game</Link>
        </div>
      )}
      <p className="text-sm text-text-dim pt-3 mb-1">Real opening traps, paused at the moments that matter. Play your move, then see how the routine would have found it.</p>
      {walkthroughs.map(g => (
        <button key={g.id} onClick={() => setGameId(g.id)} className="w-full text-left card-base p-4 hover:bg-bg-hover/30 transition-all">
          <div className="font-semibold">{g.title}</div>
          <div className="text-xs text-text-dim mt-0.5">{g.subtitle} · {g.moments.length} moments</div>
          <div className="text-sm text-text-dim mt-2">{g.intro}</div>
        </button>
      ))}
    </div>
  );
}

// Replay start moves + earlier moments to get the position at moment `idx`. Moments taken from
// the player's own games carry their own fen instead.
function positionAt(game, idx) {
  const own = game.moments[idx];
  if (own.fen) return { fen: own.fen, lastMove: own.lastMove, sans: [] };
  const g = new Chess();
  let last = null;
  const play = (san) => { const m = g.move(san); last = [m.from, m.to]; return m; };
  game.startMoves.forEach(play);
  for (let i = 0; i < idx; i++) {
    play(game.moments[i].gameMove);
    game.moments[i].continuation.forEach(play);
  }
  return { fen: g.fen(), lastMove: last, sans: g.history() };
}

function moveListText(sans) {
  let out = '';
  sans.forEach((s, i) => { out += (i % 2 === 0 ? `${i / 2 + 1}.` : '') + s + ' '; });
  return out.trim();
}

function WalkthroughPlayer({ game, onExit }) {
  const [momentIdx, setMomentIdx] = useState(0);
  const [revealed, setRevealed] = useState(0);        // how many of Spy/Scan/Safe are shown
  const [activeStep, setActiveStep] = useState(null); // whose board marks are drawn
  const [result, setResult] = useState(null);         // { san, from, to, grade, text }
  const [replay, setReplay] = useState(null);         // { fen, lastMove } while the game continues
  const [finished, setFinished] = useState(false);
  const timers = useRef([]);

  const moment = game.moments[momentIdx];
  const pos = useMemo(() => positionAt(game, momentIdx), [game, momentIdx]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  function reset(idx) {
    timers.current.forEach(clearTimeout);
    setMomentIdx(idx); setRevealed(0); setActiveStep(null); setResult(null); setReplay(null);
  }

  function dests() {
    const g = new Chess(pos.fen);
    const map = new Map();
    for (const m of g.moves({ verbose: true })) {
      if (!map.has(m.from)) map.set(m.from, []);
      map.get(m.from).push(m.to);
    }
    return map;
  }

  function handleMove(from, to) {
    const g = new Chess(pos.fen);
    let m;
    try { m = g.move({ from, to, promotion: 'q' }); } catch { return; }
    if (!m) return;
    const graded = moment.answers[m.san];
    let grade = graded?.grade || 'other';
    let text = graded?.text;
    if (!graded) {
      const safe = safetyCheck(pos.fen, m.san);
      if (!safe.ok) { grade = safe.issues[0].severity >= 2 ? 'blunder' : 'risky'; text = safe.issues[0].text; }
      else text = moment.fallback || 'Not one of the strongest moves here. Read the three steps to see what the position was asking for.';
    }
    setResult({ san: m.san, from, to, grade, text });
    setRevealed(3);
    setActiveStep('spy');
  }

  function continueGame() {
    if (!moment.gameMove) { next(); return; }
    const g = new Chess(pos.fen);
    const seq = [moment.gameMove, ...moment.continuation];
    seq.forEach((san, i) => {
      timers.current.push(setTimeout(() => {
        const m = g.move(san);
        setReplay({ fen: g.fen(), lastMove: [m.from, m.to], done: i === seq.length - 1 });
      }, 250 + i * 750));
    });
  }

  function next() {
    if (momentIdx + 1 < game.moments.length) reset(momentIdx + 1);
    else {
      setFinished(true);
      progressService.logActivity?.(`Spy, Scan, Safe walkthrough: ${game.title}`);
    }
  }

  const stepData = activeStep ? moment[activeStep] : null;
  const arrows = [...(stepData?.arrows || [])];
  if (result && !replay) arrows.push([result.from, result.to, 'blue']);
  const boardFen = replay ? replay.fen : pos.fen;
  const replayDone = replay?.done;

  if (finished) {
    return (
      <div className="max-w-2xl">
        <div className="card-base p-5">
          <div className="text-lg font-semibold mb-2">{game.title}: done</div>
          <p className="text-sm text-text-dim mb-4">{game.outro}</p>
          <div className="flex gap-2 flex-wrap">
            <button onClick={onExit} className="btn btn-primary">More walkthroughs</button>
            <Link to="/thinking-drills" className="btn btn-secondary">Drill each step</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <button onClick={onExit} className="text-sm text-text-dim hover:text-text mb-3">← All walkthroughs</button>
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_24rem] gap-5 lg:items-start">
        <div className="board-fit-mobile lg:mx-0 max-w-[560px] sm:mx-auto">
          <ChessBoard
            fen={boardFen}
            orientation={moment.orientation || game.orientation}
            movable={!result && !replay}
            dests={!result && !replay ? dests() : new Map()}
            turnColor={boardFen.split(' ')[1] === 'w' ? 'white' : 'black'}
            onMove={handleMove}
            lastMove={replay ? replay.lastMove : pos.lastMove}
            arrows={replay ? [] : arrows}
            highlights={replay ? [] : (stepData?.highlights || [])}
          />
          <div className="text-xs text-text-dim mt-2 px-1 leading-relaxed">{moveListText(pos.sans)}</div>
        </div>

        <div className="space-y-3">
          <div className="card-base p-4">
            <div className="text-xs text-text-dim mb-1">{game.title} · moment {momentIdx + 1} of {game.moments.length}</div>
            <p className="font-semibold leading-snug">{moment.prompt}</p>
            {!result && <p className="text-xs text-text-dim mt-2">Run the routine in your head, then play your move on the board. Stuck? Reveal the steps one at a time.</p>}
          </div>

          {result && (
            <div className={`rounded-xl p-4 ${GRADE[result.grade].cls}`}>
              <div className="font-semibold mb-1">{GRADE[result.grade].label}: {result.san}</div>
              <p className="text-sm text-text leading-relaxed">{result.text}</p>
            </div>
          )}

          {STEPS.map((s, i) => {
            const shown = i < revealed;
            const canReveal = i === revealed && !result;
            const isActive = activeStep === s.id;
            return (
              <div key={s.id} className={`card-base p-4 transition-all ${isActive ? 'ring-1 ring-gold/40' : ''} ${!shown && !canReveal ? 'opacity-50' : ''}`}>
                <button
                  className="w-full flex items-baseline justify-between gap-2 text-left"
                  onClick={() => shown && setActiveStep(s.id)}
                  disabled={!shown}
                >
                  <span><span className="font-semibold">{s.label}</span> <span className="text-text-dim text-sm">· {s.title}</span></span>
                  {shown && <span className="text-[11px] text-text-dim">{isActive ? 'On the board' : 'Show on board'}</span>}
                </button>
                {shown && <p className="text-sm leading-relaxed mt-2">{moment[s.id].text}</p>}
                {canReveal && (
                  <button onClick={() => { setRevealed(r => r + 1); setActiveStep(s.id); }} className="btn btn-secondary btn-sm mt-3">
                    Reveal {s.label}
                  </button>
                )}
              </div>
            );
          })}

          {result && !replay && (
            <button onClick={continueGame} className="btn btn-primary btn-block">
              {moment.gameMove ? 'See what happened in the game' : momentIdx + 1 < game.moments.length ? 'Next position' : 'Finish'}
            </button>
          )}
          {replay && (
            <div className="card-base p-4">
              <p className="text-sm leading-relaxed">{moment.afterText}</p>
              {replayDone && (
                <button onClick={next} className="btn btn-primary btn-block mt-3">
                  {momentIdx + 1 < game.moments.length ? 'Next moment' : 'Finish'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------- Quick checks (planned-move exercises) ----------

function QuickChecks() {
  const exercises = preMoveChecklist.exercises;
  const [exIdx, setExIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const exercise = exercises[exIdx];
  const done = stepIdx >= STEPS.length;

  const plannedArrow = useMemo(() => {
    try {
      const m = new Chess(exercise.fen).move(exercise.plannedMove);
      return [[m.from, m.to, 'blue']];
    } catch { return []; }
  }, [exercise]);

  function nextExercise() {
    setExIdx(i => (i + 1) % exercises.length);
    setStepIdx(0);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_22rem] lg:grid-cols-[minmax(0,1fr)_24rem] gap-5 md:items-start">
      <div className="board-fit-mobile md:mx-0 max-w-[520px] sm:mx-auto">
        <ChessBoard fen={exercise.fen} orientation={exercise.fen.split(' ')[1] === 'w' ? 'white' : 'black'} movable={false} arrows={plannedArrow} />
      </div>
      <div className="space-y-3">
        <div className="card-base p-4">
          <div className="text-xs text-text-dim mb-1">Check {exIdx + 1} of {exercises.length} · {exercise.difficulty}</div>
          <p className="text-sm text-text-dim">Planned move: <span className="text-gold font-mono">{exercise.plannedMove}</span></p>
          <p className="font-semibold mt-1">{exercise.question}</p>
        </div>

        {STEPS.map((s, i) => {
          const a = exercise.answers[s.id];
          const shown = i < stepIdx;
          return (
            <div key={s.id} className={`card-base p-4 ${i > stepIdx ? 'opacity-40' : ''}`}>
              <div className="flex items-baseline gap-2">
                <span className="font-semibold">{s.label}</span>
                <span className="text-text-dim text-sm">· {s.title}</span>
              </div>
              {shown && <p className={`text-sm mt-1.5 leading-relaxed ${a.ok ? 'text-correct' : 'text-incorrect'}`}>{a.answer}</p>}
            </div>
          );
        })}

        {!done ? (
          <button onClick={() => setStepIdx(s => s + 1)} className="btn btn-primary btn-block">
            Check {STEPS[stepIdx].label}
          </button>
        ) : (
          <>
            <div className={`rounded-xl p-4 ${exercise.betterMove ? 'bg-incorrect/10' : 'bg-correct/10'}`}>
              <p className="font-semibold mb-1">{exercise.betterMove ? 'Don’t play it' : 'Safe to play'}</p>
              <p className="text-sm leading-relaxed">{exercise.verdict}</p>
              {exercise.betterMove && <p className="text-sm text-text-dim mt-2">Better: <span className="text-gold font-mono">{exercise.betterMove}</span></p>}
            </div>
            <button onClick={nextExercise} className="btn btn-primary btn-block">Next position</button>
          </>
        )}
      </div>
    </div>
  );
}
