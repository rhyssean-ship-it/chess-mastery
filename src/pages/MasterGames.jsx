import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Chess } from 'chess.js';
import ChessBoard from '../components/ChessBoard';
import MoveList from '../components/MoveList';
import masterGames from '../data/masterGames';
import { progressService } from '../services/progressService';

const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const KIND = {
  plan: { label: 'Plan', cls: 'bg-gold/10 text-gold' },
  tactic: { label: 'Tactic', cls: 'bg-correct/10 text-correct' },
  mistake: { label: 'Mistake', cls: 'bg-incorrect/10 text-incorrect' },
  key: { label: 'Key moment', cls: 'bg-amber/10 text-amber' },
  opening: { label: 'Opening', cls: 'bg-bg-hover/60 text-text-dim' },
  defence: { label: 'Defence', cls: 'bg-bg-hover/60 text-text' },
};
const GUESS_KEY = 'chess-mastery:guessTheMove';

// Replays the SAN string once per game: fen + from/to for every ply.
function useReplay(game) {
  return useMemo(() => {
    if (!game) return [];
    const g = new Chess();
    return game.moves.split(' ').map(san => {
      const m = g.move(san);
      return { san: m.san, from: m.from, to: m.to, fenBefore: m.before, fen: g.fen(), color: m.color };
    });
  }, [game]);
}

function loadGuessStats() {
  try { return JSON.parse(localStorage.getItem(GUESS_KEY)) || {}; } catch { return {}; }
}

// ---------- Index ----------

function GamesIndex() {
  const [level, setLevel] = useState('all');
  const filtered = level === 'all' ? masterGames : masterGames.filter(g => g.level === level);
  const guessStats = loadGuessStats();

  return (
    <div className="page-enter page page-wide">
      <h1 className="text-2xl sm:text-3xl font-display mb-1">Annotated Games</h1>
      <p className="text-text-dim text-sm mb-5">Famous games explained move by move: the plan behind each move and the tactics underneath. Step through, or guess the moves as you go.</p>

      <div className="flex rounded-lg bg-bg-card border border-bg-hover overflow-hidden text-sm mb-5 w-fit max-w-full">
        {['all', ...LEVELS].map(l => (
          <button key={l} onClick={() => setLevel(l)}
            className={`px-3 py-2 transition-all whitespace-nowrap ${level === l ? 'bg-gold text-bg font-semibold' : 'text-text-dim hover:text-text'}`}>
            {l === 'all' ? 'All' : l}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map(game => {
          const best = guessStats[game.id];
          return (
            <Link key={game.id} to={`/master-games/${game.id}`} className="card-base p-4 hover:bg-bg-hover/30 transition-all flex flex-col">
              <div className="text-xs text-text-dim">{game.level} · {game.year} · {Math.ceil(game.moves.split(' ').length / 2)} moves</div>
              <div className="font-semibold mt-1">{game.title}</div>
              <div className="text-sm text-text-dim">{game.white} vs {game.black}</div>
              <p className="text-sm text-text-dim mt-2 leading-snug flex-1">{game.summary}</p>
              {best && <div className="text-[11px] text-gold mt-2 tabular-nums">Best guess score: {best.pct}% as {best.side}</div>}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// ---------- Viewer ----------

function GameViewer() {
  const { id } = useParams();
  const game = masterGames.find(g => g.id === id || g.aliases?.includes(id));
  const plies = useReplay(game);
  const [idx, setIdx] = useState(-1);                 // current ply index (-1 = start)
  const [guessSide, setGuessSide] = useState(null);   // null | 'white' | 'black'
  const [guess, setGuess] = useState(null);           // { tries, result: 'correct'|'alt'|'wrong'|'revealed', san }
  const [score, setScore] = useState({ asked: 0, found: 0 });

  const total = plies.length;
  const guessing = guessSide != null;
  // In guess mode, pause before each move of the chosen side.
  const nextPly = plies[idx + 1];
  const awaitingGuess = guessing && nextPly && (nextPly.color === 'w' ? 'white' : 'black') === guessSide
    && (!guess || guess.result === 'wrong'); // a wrong first try still waits for the second

  const step = useCallback((dir) => {
    setGuess(null);
    setIdx(i => Math.max(-1, Math.min(total - 1, i + dir)));
  }, [total]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT') return;
      if (e.key === 'ArrowRight' && !awaitingGuess) step(1);
      if (e.key === 'ArrowLeft' && !guessing) step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [step, awaitingGuess, guessing]);

  // Opponent's moves auto-play in guess mode.
  useEffect(() => {
    if (!guessing || !nextPly || guess) return;
    if ((nextPly.color === 'w' ? 'white' : 'black') === guessSide) return;
    const t = setTimeout(() => setIdx(i => i + 1), 700);
    return () => clearTimeout(t);
  }, [guessing, guessSide, nextPly, guess]);

  // Save the guess score when the game is finished.
  useEffect(() => {
    if (!guessing || idx !== total - 1 || score.asked === 0) return;
    const pct = Math.round((score.found / score.asked) * 100);
    const stats = loadGuessStats();
    if (!stats[game.id] || stats[game.id].pct < pct) {
      stats[game.id] = { pct, side: guessSide };
      try { localStorage.setItem(GUESS_KEY, JSON.stringify(stats)); } catch { /* storage unavailable */ }
    }
    progressService.logActivity?.(`Guess the move: ${game.title} (${pct}%)`);
  }, [idx]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!game) {
    return <div className="page"><p className="text-text-dim">Game not found. <Link to="/master-games" className="text-gold">All games</Link></p></div>;
  }

  const cur = idx >= 0 ? plies[idx] : null;
  const note = idx >= 0 ? game.notes[idx] : null;
  const fen = cur ? cur.fen : START_FEN;
  const orientation = guessSide || (game.result === '0-1' ? 'black' : 'white');

  function startGuess(side) {
    setGuessSide(side); setIdx(-1); setGuess(null); setScore({ asked: 0, found: 0 });
  }
  function stopGuess() { setGuessSide(null); setGuess(null); }

  function guessDests() {
    const map = new Map();
    for (const m of new Chess(fen).moves({ verbose: true })) {
      if (!map.has(m.from)) map.set(m.from, []);
      map.get(m.from).push(m.to);
    }
    return map;
  }

  function handleGuess(from, to) {
    let m;
    try { m = new Chess(fen).move({ from, to, promotion: 'q' }); } catch { m = null; }
    if (!m) return;
    const tries = (guess?.tries || 0) + 1;
    const alt = game.notes[idx + 1]?.alternatives || [];
    if (m.san === nextPly.san) {
      setScore(s => ({ asked: s.asked + 1, found: s.found + (tries === 1 ? 1 : 0) }));
      setGuess({ tries, result: 'correct', san: m.san });
      setIdx(i => i + 1);
    } else if (alt.includes(m.san)) {
      setScore(s => ({ asked: s.asked + 1, found: s.found + (tries === 1 ? 1 : 0) }));
      setGuess({ tries, result: 'alt', san: m.san });
      setIdx(i => i + 1);
    } else if (tries >= 2) {
      setScore(s => ({ asked: s.asked + 1, found: s.found }));
      setGuess({ tries, result: 'revealed', san: m.san });
      setIdx(i => i + 1);
    } else {
      setGuess({ tries, result: 'wrong', san: m.san });
    }
  }
  function revealGuess() {
    setScore(s => ({ asked: s.asked + 1, found: s.found }));
    setGuess({ tries: guess?.tries || 0, result: 'revealed' });
    setIdx(i => i + 1);
  }
  function continueGuess() { setGuess(null); }

  const evalNow = idx >= 0 ? game.evals?.[idx] : 0.2; // pawns, White's view; ±20 = mate
  const evalPct = evalNow == null ? 50 : Math.max(3, Math.min(97, 50 + evalNow * 8));
  const arrows = !awaitingGuess && note?.arrows ? note.arrows : [];
  const finished = idx === total - 1;

  return (
    <div className="page-enter page page-wide">
      <Link to="/master-games" className="text-sm text-text-dim hover:text-text">← All games</Link>
      <h1 className="text-2xl sm:text-3xl font-display mt-2 mb-0.5">{game.title}</h1>
      <p className="text-text-dim text-sm mb-4">{game.white} vs {game.black} · {game.event}, {game.year} · {game.result}</p>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_24rem] gap-5 lg:items-start">
        <div className="board-fit-mobile lg:mx-0 max-w-[560px] sm:mx-auto">
          {/* eval strip, White's share from the left */}
          <div className="h-1.5 rounded-full overflow-hidden bg-bg-hover mb-1.5 mx-1 sm:mx-0" title="Engine evaluation">
            <div className="h-full bg-white transition-all duration-500" style={{ width: `${evalPct}%` }} />
          </div>
          <ChessBoard
            fen={fen}
            orientation={orientation}
            movable={awaitingGuess}
            dests={awaitingGuess ? guessDests() : new Map()}
            turnColor={fen.split(' ')[1] === 'w' ? 'white' : 'black'}
            onMove={handleGuess}
            lastMove={cur ? [cur.from, cur.to] : undefined}
            arrows={arrows}
          />
          {!guessing && (
            <div className="flex items-stretch gap-2 mt-2.5 mx-1 sm:mx-0">
              <NavBtn onClick={() => { setGuess(null); setIdx(-1); }} disabled={idx === -1} label="Start">⏮</NavBtn>
              <NavBtn onClick={() => step(-1)} disabled={idx === -1} label="Previous move" wide>◀</NavBtn>
              <NavBtn onClick={() => step(1)} disabled={finished} label="Next move" wide primary>▶</NavBtn>
              <NavBtn onClick={() => { setGuess(null); setIdx(total - 1); }} disabled={finished} label="End">⏭</NavBtn>
            </div>
          )}
        </div>

        <div className="space-y-3">
          {guessing ? (
            <GuessPanel
              game={game} side={guessSide} score={score} guess={guess} awaiting={awaitingGuess}
              finished={finished} nextPly={nextPly} justPlayed={cur}
              onReveal={revealGuess} onContinue={continueGuess} onStop={stopGuess}
            />
          ) : (
            <div className="card-base p-3 flex items-center gap-2 flex-wrap">
              <span className="text-sm text-text-dim mr-1">Guess the move as</span>
              <button onClick={() => startGuess('white')} className="btn btn-secondary btn-sm">White</button>
              <button onClick={() => startGuess('black')} className="btn btn-secondary btn-sm">Black</button>
            </div>
          )}

          {!awaitingGuess && (idx === -1 ? (
            <div className="card-base p-4">
              <div className="font-semibold mb-1">Why study this game</div>
              <p className="text-sm text-text-dim leading-relaxed">{game.summary}</p>
              <div className="font-semibold mt-3 mb-1">Watch for</div>
              <ul className="text-sm text-text-dim space-y-1">
                {game.lessons.map((l, i) => <li key={i} className="flex gap-2"><span className="text-gold">·</span><span>{l}</span></li>)}
              </ul>
              {!guessing && <button onClick={() => step(1)} className="btn btn-primary btn-block mt-4">Start the game</button>}
            </div>
          ) : (
            <MoveNote ply={cur} note={note} idx={idx} />
          ))}

          {finished && !awaitingGuess && (
            <div className="card-base p-4">
              <div className="font-semibold mb-1">Lessons from this game</div>
              <ul className="text-sm text-text-dim space-y-1">
                {game.lessons.map((l, i) => <li key={i} className="flex gap-2"><span className="text-gold">·</span><span>{l}</span></li>)}
              </ul>
            </div>
          )}

          {/* Guess mode only lists moves already played, so the answers stay hidden. Passing
              classifications switches MoveList to oldest-first with the current move in view. */}
          <MoveList
            history={(guessing ? plies.slice(0, idx + 1) : plies).map(p => ({ san: p.san }))}
            classifications={plies.map(() => null)}
            currentIndex={idx}
            onSelectMove={guessing ? undefined : (i) => { setGuess(null); setIdx(i); }}
            maxHeightClass="max-h-48 lg:max-h-64"
          />
        </div>
      </div>
    </div>
  );
}

function NavBtn({ children, onClick, disabled, label, wide, primary }) {
  return (
    <button onClick={onClick} disabled={disabled} aria-label={label}
      className={`${wide ? 'flex-[1.6]' : 'flex-1'} py-3 rounded-xl border transition-all active:scale-[0.97] disabled:opacity-25 ${primary ? 'bg-gold/15 border-gold/40 text-gold hover:bg-gold/25' : 'bg-bg-card border-bg-hover hover:bg-bg-hover'}`}>
      {children}
    </button>
  );
}

function MoveNote({ ply, note, idx }) {
  const moveNo = `${Math.floor(idx / 2) + 1}${idx % 2 ? '…' : '.'}`;
  const kind = KIND[note?.kind] || null;
  return (
    <div className="card-base p-4">
      <div className="flex items-baseline justify-between gap-2 mb-1.5">
        <div className="text-lg font-semibold"><span className="text-text-dim font-normal mr-1">{moveNo}</span>{ply.san}</div>
        {kind && <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${kind.cls}`}>{kind.label}</span>}
      </div>
      <p className="text-sm leading-relaxed">{note?.text}</p>
      {note?.better && (
        <p className="text-[13px] text-text-dim mt-2 bg-bg-hover/30 rounded-md px-3 py-2">
          <span className="text-gold font-semibold">Engine:</span> {note.better}
        </p>
      )}
    </div>
  );
}

function GuessPanel({ game, side, score, guess, awaiting, finished, nextPly, justPlayed, onReveal, onContinue, onStop }) {
  const pct = score.asked ? Math.round((score.found / score.asked) * 100) : 0;
  return (
    <div className="card-base p-4">
      <div className="flex items-baseline justify-between gap-2 mb-2">
        <div className="font-semibold">Guess the move as {side}</div>
        <button onClick={onStop} className="text-xs text-text-dim hover:text-text">Stop</button>
      </div>
      <div className="text-sm text-text-dim tabular-nums mb-2">First-try score: {score.found} / {score.asked}{score.asked ? ` (${pct}%)` : ''}</div>
      {awaiting && !guess && <p className="text-sm">Your move as {side}. What did {side === 'white' ? game.white : game.black} play?</p>}
      {awaiting && guess?.result === 'wrong' && (
        <div className="text-sm">
          <p className="text-incorrect">Not {guess.san}. One more try.</p>
          <button onClick={onReveal} className="btn btn-secondary btn-sm mt-2">Show me</button>
        </div>
      )}
      {!awaiting && guess && (
        <div className="text-sm">
          {guess.result === 'correct' && <p className="text-correct font-semibold">{guess.tries === 1 ? 'Found it!' : 'Got it on the second try.'}</p>}
          {guess.result === 'alt' && <p className="text-correct font-semibold">{guess.san} is the engine’s choice here, so it counts. The game went {justPlayed?.san}.</p>}
          {guess.result === 'revealed' && <p className="text-text-dim">The move was <span className="text-gold font-mono">{justPlayed?.san}</span>{guess.san ? ` (you tried ${guess.san})` : ''}.</p>}
          {!finished && <button onClick={onContinue} className="btn btn-primary btn-sm mt-2">Continue</button>}
        </div>
      )}
      {finished && <p className="text-sm font-semibold mt-2">Game over. Final score {pct}%.</p>}
      {!awaiting && !guess && !finished && nextPly && <p className="text-sm text-text-dim">Their move…</p>}
    </div>
  );
}

export { GamesIndex, GameViewer };
