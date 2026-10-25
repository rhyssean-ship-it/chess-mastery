import { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Chess } from 'chess.js';
import ChessBoard from '../components/ChessBoard';
import { pickPuzzles } from '../services/lichessPuzzleService';
import { opponentThreats, forcingMoves, safetyCheck, STEPS, pieceName } from '../services/spyScanSafe';
import { recordDrill, drillStats } from '../services/thinkingDrillStore';
import { markItemDone } from '../services/dailyPlanService';

const ROUNDS = 8;
const MODES = {
  spy: { label: 'Spy', title: 'Find their threat', blurb: 'Their last move set something up. Tap the piece or square it’s aiming at.' },
  scan: { label: 'Scan', title: 'Find every check and capture', blurb: 'Play each check and capture you have, one at a time. Press Done when you think you’ve found them all.' },
  safe: { label: 'Safe', title: 'Is this move safe?', blurb: 'A candidate move is drawn on the board. Run the Safe check: is it OK to play?' },
};

function play(g, uci) {
  return g.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] || undefined });
}

// ---- Round generators (from Lichess puzzles; moves[0] is the opponent's setup move) ----

function spyRound(p) {
  // Take the loser's side after the winner's first tactical move: they now face a real threat.
  if (p.moves.length < 3) return null;
  const g = new Chess(p.fen);
  play(g, p.moves[0]);
  const m = play(g, p.moves[1]);
  if (!m || g.isGameOver()) return null;
  const me = g.turn();
  const threats = opponentThreats(g.fen(), me).filter(t => t.severity >= 2);
  if (!threats.length) return null;
  const targets = new Set();
  for (const t of threats) {
    if (t.mate || t.kind === 'mate') targets.add(kingSquare(g, me));
    else targets.add(t.to);
  }
  if (g.inCheck()) targets.add(kingSquare(g, me));
  return {
    fen: g.fen(), lastMove: [m.from, m.to], orientation: me === 'w' ? 'white' : 'black',
    targets: [...targets], threats, lastSan: m.san,
  };
}

function kingSquare(g, color) {
  for (const row of g.board()) for (const sq of row) if (sq && sq.type === 'k' && sq.color === color) return sq.square;
  return null;
}

function scanRound(p) {
  const g = new Chess(p.fen);
  const setup = play(g, p.moves[0]);
  const me = g.turn();
  const f = forcingMoves(g.fen(), me);
  const forcing = [...new Map([...f.checks, ...f.captures].map(x => [x.san, x])).values()];
  if (forcing.length < 2 || forcing.length > 7) return null;
  const sol = new Chess(g.fen()).move({ from: p.moves[1].slice(0, 2), to: p.moves[1].slice(2, 4), promotion: p.moves[1][4] || undefined });
  return {
    fen: g.fen(), lastMove: [setup.from, setup.to], orientation: me === 'w' ? 'white' : 'black',
    forcing, solutionSan: sol?.san,
  };
}

function safeRound(p) {
  const g = new Chess(p.fen);
  const setup = play(g, p.moves[0]);
  const fen = g.fen();
  const solution = new Chess(fen).move({ from: p.moves[1].slice(0, 2), to: p.moves[1].slice(2, 4), promotion: p.moves[1][4] || undefined });
  const base = { fen, lastMove: [setup.from, setup.to], orientation: g.turn() === 'w' ? 'white' : 'black' };
  if (Math.random() < 0.5) {
    if (!solution || !safetyCheck(fen, solution.san).ok) return null;
    return { ...base, candidate: solution, safe: true, why: `Safe, and it’s the strongest move here: ${solution.san} is this puzzle’s answer.` };
  }
  const bad = g.moves({ verbose: true })
    .filter(m => m.san !== solution?.san)
    .sort(() => Math.random() - 0.5)
    .slice(0, 12)
    .map(m => ({ m, check: safetyCheck(fen, m.san) }))
    .filter(x => !x.check.ok && x.check.issues[0].severity >= 2);
  if (!bad.length) return null;
  const pick = bad[Math.floor(Math.random() * bad.length)];
  return { ...base, candidate: pick.m, safe: false, why: pick.check.issues[0].text, issueSquares: pick.check.issues[0].squares };
}

const GENERATORS = { spy: spyRound, scan: scanRound, safe: safeRound };

function buildRounds(mode) {
  const pool = pickPuzzles({ ratingMin: 600, ratingMax: 1600, n: 300 });
  const out = [];
  for (const p of pool) {
    if (out.length >= ROUNDS) break;
    try { const r = GENERATORS[mode](p); if (r) out.push({ ...r, id: p.id }); } catch { /* skip odd positions */ }
  }
  return out;
}

export default function ThinkingDrills() {
  const [params, setParams] = useSearchParams();
  const mode = MODES[params.get('step')] ? params.get('step') : null;
  if (!mode) return <DrillMenu onPick={(m) => setParams({ step: m })} />;
  return <DrillSession key={mode} mode={mode} onExit={() => setParams({})} />;
}

function DrillMenu({ onPick }) {
  const stats = drillStats();
  return (
    <div className="page-enter page page-narrow">
      <h1 className="text-2xl sm:text-3xl font-display mb-1">Spy, Scan, Safe drills</h1>
      <p className="text-text-dim text-sm mb-5">One drill per step of the routine. {ROUNDS} positions a round, taken from real games.</p>
      <div className="space-y-2">
        {STEPS.map(s => {
          const st = stats[s.id];
          return (
            <button key={s.id} onClick={() => onPick(s.id)} className="w-full text-left card-base p-4 hover:bg-bg-hover/30 transition-all flex items-center justify-between gap-3">
              <div>
                <div className="font-semibold">{s.label}: {MODES[s.id].title}</div>
                <div className="text-sm text-text-dim mt-0.5">{MODES[s.id].blurb}</div>
              </div>
              {st.played > 0 && <div className="text-xs text-text-dim tabular-nums shrink-0">{Math.round((st.correct / st.played) * 100)}%</div>}
            </button>
          );
        })}
      </div>
      <p className="text-sm text-text-dim mt-5">New to the routine? <Link to="/pre-move-checklist" className="text-gold">Learn Spy, Scan, Safe</Link> first.</p>
    </div>
  );
}

function DrillSession({ mode, onExit }) {
  const [rounds, setRounds] = useState(null);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => { setRounds(buildRounds(mode)); }, [mode]);

  if (!rounds) return <div className="page text-text-dim">Finding positions…</div>;
  if (rounds.length === 0) return <div className="page text-text-dim">Couldn’t build a round. <button className="text-gold" onClick={() => setRounds(buildRounds(mode))}>Try again</button></div>;

  if (idx >= rounds.length) {
    return (
      <div className="page-enter page page-narrow">
        <h1 className="text-2xl sm:text-3xl font-display mb-1">{MODES[mode].label} drill</h1>
        <div className="card-base p-5 mt-4">
          <div className="text-3xl font-bold text-gold tabular-nums">{score} / {rounds.length}</div>
          <p className="text-sm text-text-dim mt-1">{score === rounds.length ? 'Perfect round.' : score >= rounds.length * 0.7 ? 'Solid. Keep the habit going in your games.' : 'This step needs reps. Run another round.'}</p>
          <div className="flex gap-2 mt-4 flex-wrap">
            <button onClick={() => { setRounds(buildRounds(mode)); setIdx(0); setScore(0); }} className="btn btn-primary">Another round</button>
            <button onClick={onExit} className="btn btn-secondary">All drills</button>
          </div>
        </div>
      </div>
    );
  }

  function finish(correct) {
    recordDrill(mode, correct);
    if (correct) setScore(s => s + 1);
    if (idx === rounds.length - 1) markItemDone('thinking-drill');
  }

  const round = rounds[idx];
  const Round = { spy: SpyRound, scan: ScanRound, safe: SafeRound }[mode];
  return (
    <div className="page-enter page page-wide">
      <div className="flex items-baseline justify-between gap-3 mb-1">
        <h1 className="font-display">{MODES[mode].label} drill</h1>
        <button onClick={onExit} className="text-sm text-text-dim hover:text-text shrink-0">Exit</button>
      </div>
      <p className="text-text-dim text-sm mb-4">{MODES[mode].title} · position {idx + 1} of {rounds.length} · score {score}</p>
      <Round key={round.id} round={round} onResult={finish} onNext={() => setIdx(i => i + 1)} />
    </div>
  );
}

function Layout({ board, children }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_22rem] gap-5 md:items-start">
      <div className="board-fit-mobile md:mx-0"><div className="max-w-[520px] mx-auto md:mx-0">{board}</div></div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Feedback({ ok, children }) {
  return <div className={`rounded-xl p-4 text-sm leading-relaxed ${ok ? 'bg-correct/10' : 'bg-incorrect/10'}`}>{children}</div>;
}

function SpyRound({ round, onResult, onNext }) {
  const [picked, setPicked] = useState(null);
  const ok = picked != null && round.targets.includes(picked);
  function tap(sq) {
    if (picked) return;
    setPicked(sq);
    onResult(round.targets.includes(sq));
  }
  const threatArrows = picked ? round.threats.slice(0, 2).map(t => [t.from, t.to, 'red']) : [];
  return (
    <Layout board={
      <ChessBoard fen={round.fen} orientation={round.orientation} movable={false} lastMove={round.lastMove}
        onSquareClick={tap} arrows={threatArrows}
        highlights={picked ? [{ square: picked, brush: ok ? 'green' : 'red' }] : []} />
    }>
      <div className="card-base p-4">
        <p className="font-semibold">They just played {round.lastSan}.</p>
        <p className="text-sm text-text-dim mt-1">Spy: what is it threatening? Tap the piece (or king) they’re aiming at.</p>
      </div>
      {picked && (
        <>
          <Feedback ok={ok}>
            <p className="font-semibold mb-1">{ok ? 'Spotted it.' : 'Not quite.'}</p>
            {round.threats.slice(0, 2).map((t, i) => <p key={i}>{t.text}.</p>)}
          </Feedback>
          <button onClick={onNext} className="btn btn-primary btn-block">Next</button>
        </>
      )}
    </Layout>
  );
}

function ScanRound({ round, onResult, onNext }) {
  const [found, setFound] = useState([]);
  const [flash, setFlash] = useState(null);
  const [done, setDone] = useState(false);
  const [boardKey, setBoardKey] = useState(0);
  const forcingSans = useMemo(() => new Set(round.forcing.map(f => f.san)), [round]);

  function dests() {
    const map = new Map();
    for (const m of new Chess(round.fen).moves({ verbose: true })) {
      if (!map.has(m.from)) map.set(m.from, []);
      map.get(m.from).push(m.to);
    }
    return map;
  }
  function handleMove(from, to) {
    let m;
    try { m = new Chess(round.fen).move({ from, to, promotion: 'q' }); } catch { m = null; }
    setBoardKey(k => k + 1); // snap the piece back
    if (!m) return;
    if (forcingSans.has(m.san)) {
      if (!found.includes(m.san)) setFound(f => [...f, m.san]);
      setFlash({ ok: true, text: `${m.san}: ${m.san.includes('+') ? 'a check' : 'a capture'}.` });
    } else {
      setFlash({ ok: false, text: `${m.san} isn’t a check or a capture.` });
    }
  }
  function finish() {
    setDone(true);
    onResult(found.length === round.forcing.length);
  }
  const missed = round.forcing.filter(f => !found.includes(f.san));
  const arrows = done
    ? [...round.forcing.filter(f => found.includes(f.san)).map(f => [f.from, f.to, 'green']), ...missed.map(f => [f.from, f.to, 'red'])]
    : round.forcing.filter(f => found.includes(f.san)).map(f => [f.from, f.to, 'green']);

  return (
    <Layout board={
      <ChessBoard key={boardKey} fen={round.fen} orientation={round.orientation} movable={!done} dests={!done ? dests() : new Map()}
        turnColor={round.orientation} onMove={handleMove} lastMove={round.lastMove} arrows={arrows} />
    }>
      <div className="card-base p-4">
        <p className="font-semibold">Find every check and capture you have.</p>
        <p className="text-sm text-text-dim mt-1">Play each one on the board. Found <span className="text-text tabular-nums">{found.length}</span> so far.</p>
      </div>
      {flash && !done && <div className={`text-sm px-3 py-2 rounded-lg ${flash.ok ? 'bg-correct/10 text-correct' : 'bg-bg-hover/40 text-text-dim'}`}>{flash.text}</div>}
      {!done ? (
        <button onClick={finish} className="btn btn-primary btn-block">Done</button>
      ) : (
        <>
          <Feedback ok={missed.length === 0}>
            <p className="font-semibold mb-1">{missed.length === 0 ? `All ${round.forcing.length} found.` : `You found ${found.length} of ${round.forcing.length}.`}</p>
            {missed.length > 0 && <p>Missed (red): {missed.map(f => f.san).join(', ')}.</p>}
            <ul className="mt-2 space-y-0.5">
              {round.forcing.map(f => <li key={f.san}><span className="font-mono">{f.san}</span>: {f.note}{f.then ? `, then ${f.then.san} ${f.then.why}` : ''}</li>)}
            </ul>
            {round.solutionSan && <p className="mt-2 text-text-dim">The move that wins here: <span className="text-gold font-mono">{round.solutionSan}</span>.</p>}
          </Feedback>
          <button onClick={onNext} className="btn btn-primary btn-block">Next</button>
        </>
      )}
    </Layout>
  );
}

function SafeRound({ round, onResult, onNext }) {
  const [answer, setAnswer] = useState(null);
  const ok = answer != null && answer === round.safe;
  function choose(v) {
    if (answer != null) return;
    setAnswer(v);
    onResult(v === round.safe);
  }
  const c = round.candidate;
  return (
    <Layout board={
      <ChessBoard fen={round.fen} orientation={round.orientation} movable={false} lastMove={round.lastMove}
        arrows={[[c.from, c.to, 'blue']]}
        highlights={answer != null && round.issueSquares ? round.issueSquares.map(s => ({ square: s, brush: 'red' })) : []} />
    }>
      <div className="card-base p-4">
        <p className="font-semibold">Candidate: <span className="font-mono text-gold">{answer == null ? c.san.replace(/[+#]/g, '') : c.san}</span> ({pieceName(c.piece)} to {c.to})</p>
        <p className="text-sm text-text-dim mt-1">Is it defended where it lands? Does it leave anything hanging? Does it allow a check or capture?</p>
      </div>
      {answer == null ? (
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => choose(true)} className="btn btn-secondary btn-lg">Safe</button>
          <button onClick={() => choose(false)} className="btn btn-secondary btn-lg">Not safe</button>
        </div>
      ) : (
        <>
          <Feedback ok={ok}>
            <p className="font-semibold mb-1">{ok ? 'Correct.' : 'Not this time.'} {round.safe ? 'It’s safe.' : 'It’s not safe.'}</p>
            <p>{round.why}</p>
          </Feedback>
          <button onClick={onNext} className="btn btn-primary btn-block">Next</button>
        </>
      )}
    </Layout>
  );
}
