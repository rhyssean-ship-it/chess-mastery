import { useState, useCallback, useEffect } from 'react';
import { Chess } from 'chess.js';
import ChessBoard from '../components/ChessBoard';
import openings from '../data/openings';
import { progressService } from '../services/progressService';
import { recordDrill, listTracked, listDue, pickNext } from '../services/repertoireSRS';

export default function RepertoireBuilder() {
  const [selectedOpening, setSelectedOpening] = useState(openings[0]?.id || '');
  const [selectedSide, setSelectedSide] = useState('white');
  const [started, setStarted] = useState(false);
  const [game, setGame] = useState(null);
  const [fen, setFen] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  const [moveIndex, setMoveIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [finished, setFinished] = useState(false);
  const [tracked, setTracked] = useState([]);

  useEffect(() => { setTracked(listTracked()); }, []);

  const opening = openings.find(o => o.id === selectedOpening);
  const dueCount = listDue().length;

  function start(openingId = selectedOpening, side = selectedSide) {
    const op = openings.find(o => o.id === openingId);
    const g = new Chess();
    setGame(g);
    setFen(g.fen());
    setMoveIndex(0);
    setCorrect(0);
    setTotal(0);
    setFeedback(null);
    setFinished(false);
    setStarted(true);

    // If user is black, play white's first move automatically
    if (side === 'black' && op) {
      setTimeout(() => {
        const g2 = new Chess();
        g2.move(op.moves[0].move);
        setGame(g2);
        setFen(g2.fen());
        setMoveIndex(1);
      }, 500);
    }
  }

  function getLegalDests() {
    if (!game) return new Map();
    const dests = new Map();
    for (const m of game.moves({ verbose: true })) {
      if (!dests.has(m.from)) dests.set(m.from, []);
      dests.get(m.from).push(m.to);
    }
    return dests;
  }

  const isUserTurn = () => {
    if (!game) return false;
    const turn = game.turn() === 'w' ? 'white' : 'black';
    return turn === selectedSide;
  };

  const handleMove = useCallback((from, to) => {
    if (!game || !opening || finished) return;
    const moves = opening.moves;
    if (moveIndex >= moves.length) return;

    const expected = moves[moveIndex];
    const g = new Chess(game.fen());
    const m = g.move({ from, to, promotion: 'q' });
    if (!m) return;

    if (m.san === expected.move) {
      setCorrect(prev => prev + 1);
      setTotal(prev => prev + 1);
      setFeedback({ correct: true, message: `Correct! ${m.san}` });
      setGame(g);
      setFen(g.fen());

      const nextIdx = moveIndex + 1;
      if (nextIdx >= moves.length) {
        setFinished(true);
        setMoveIndex(nextIdx);
        return;
      }

      // Play opponent's response
      setTimeout(() => {
        const g2 = new Chess(g.fen());
        g2.move(moves[nextIdx].move);
        setGame(g2);
        setFen(g2.fen());
        setMoveIndex(nextIdx + 1);
        if (nextIdx + 1 >= moves.length) setFinished(true);
      }, 400);
      setMoveIndex(nextIdx);
    } else {
      setTotal(prev => prev + 1);
      setFeedback({
        correct: false,
        message: `That's not in your repertoire. The recommended move was ${expected.move}. ${expected.explanation}`,
      });
      // Play the correct move instead
      const g2 = new Chess(game.fen());
      g2.move(expected.move);
      setGame(g2);
      setFen(g2.fen());

      const nextIdx = moveIndex + 1;
      if (nextIdx >= moves.length) {
        setFinished(true);
        setMoveIndex(nextIdx);
        return;
      }

      setTimeout(() => {
        const g3 = new Chess(g2.fen());
        g3.move(moves[nextIdx].move);
        setGame(g3);
        setFen(g3.fen());
        setMoveIndex(nextIdx + 1);
        if (nextIdx + 1 >= moves.length) setFinished(true);
      }, 600);
      setMoveIndex(nextIdx);
    }
  }, [game, opening, moveIndex, finished, selectedSide]);

  const turnColor = game ? (game.turn() === 'w' ? 'white' : 'black') : 'white';
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

  return (
    <div className="page-enter max-w-5xl mx-auto px-4 sm:px-6 py-6 lg:py-10">
      <h1 className="text-2xl sm:text-3xl font-display mb-1">Opening Repertoire Builder</h1>
      <p className="text-text-dim text-sm mb-5">Build and drill your opening lines.</p>

      {!started ? (
        <div className="max-w-md mx-auto space-y-4">
          {tracked.length > 0 && (
            <div className="bg-bg-card border border-bg-hover rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-sm font-semibold">Your repertoire</div>
                  <div className="text-xs text-text-dim">{tracked.length} lines tracked · <span className="text-gold">{dueCount} due</span></div>
                </div>
                {dueCount > 0 && (
                  <button onClick={() => {
                    const next = pickNext();
                    if (!next) return;
                    setSelectedOpening(next.openingId);
                    setSelectedSide(next.side);
                    start(next.openingId, next.side);
                  }} className="px-3 py-1.5 rounded-lg bg-gold text-bg text-xs font-semibold hover:bg-gold-dim btn-press">
                    Drill due ({dueCount})
                  </button>
                )}
              </div>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {tracked
                  .sort((a, b) => a.nextReview - b.nextReview)
                  .slice(0, 6)
                  .map(t => {
                    const op = openings.find(o => o.id === t.openingId);
                    const due = t.nextReview <= Date.now();
                    const avg = Math.round((t.totalAccuracy / t.attempts) * 100);
                    return (
                      <div key={`${t.openingId}-${t.side}`} className="flex items-center justify-between text-xs py-1 px-2 rounded hover:bg-bg-hover/40">
                        <div className="truncate flex-1">
                          <span className={due ? 'text-gold' : 'text-text-dim'}>{due ? '●' : '○'}</span>
                          <span className="ml-2">{op?.name || t.openingId}</span>
                          <span className="text-text-dim/70 ml-1">({t.side})</span>
                        </div>
                        <span className="text-text-dim tabular-nums">{avg}% · {t.reps}r</span>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
          <div className="bg-bg-card border border-bg-hover rounded-xl p-6 space-y-4">
          <div>
            <label className="text-sm text-text-dim block mb-1">Opening</label>
            <select
              value={selectedOpening}
              onChange={e => setSelectedOpening(e.target.value)}
              className="w-full bg-bg border border-bg-hover rounded-lg px-3 py-2 text-text"
            >
              {openings.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm text-text-dim block mb-1">Play as</label>
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedSide('white')}
                className={`flex-1 py-2.5 rounded-lg text-base font-semibold transition-all btn-press ${selectedSide === 'white' ? 'bg-gold text-bg' : 'bg-bg-hover text-text-dim'}`}
              >
                White
              </button>
              <button
                onClick={() => setSelectedSide('black')}
                className={`flex-1 py-2.5 rounded-lg text-base font-semibold transition-all btn-press ${selectedSide === 'black' ? 'bg-gold text-bg' : 'bg-bg-hover text-text-dim'}`}
              >
                Black
              </button>
            </div>
          </div>
          <button onClick={() => start()} className="w-full bg-gold text-bg py-2.5 rounded-lg font-semibold hover:bg-gold-dim transition-all btn-press">
            Start Drill
          </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] lg:grid-cols-[1fr_320px] gap-6">
          <div className="w-full max-w-[560px] board-fit-mobile">
            <ChessBoard
              fen={fen}
              orientation={selectedSide}
              movable={isUserTurn() && !finished}
              dests={isUserTurn() && !finished ? getLegalDests() : new Map()}
              turnColor={turnColor}
              onMove={handleMove}
            />
          </div>
          <div className="space-y-4">
            <div className="bg-bg-card border border-bg-hover rounded-xl p-4">
              <h3 className="text-sm mb-1">{opening?.name}</h3>
              <p className="text-text-dim text-xs">Playing as {selectedSide}</p>
            </div>

            {feedback && (
              <div className={`rounded-xl p-4 border text-sm ${feedback.correct ? 'bg-correct/10 border-correct/30' : 'bg-amber/10 border-amber/30'}`}>
                <span className="mr-2">{feedback.correct ? '\u2713' : '\u26A0'}</span>
                {feedback.message}
              </div>
            )}

            {finished && (
              <div className="bg-bg-card border border-gold/20 rounded-xl p-4 text-center">
                <p className="text-lg font-semibold mb-1">Score: {correct}/{total}</p>
                <p className="text-text-dim text-base leading-relaxed mb-3">Accuracy: {accuracy}%</p>
                <button onClick={() => {
                  progressService.recordOpeningDrill(selectedOpening, selectedSide, accuracy);
                  recordDrill(selectedOpening, selectedSide, accuracy / 100);
                  setTracked(listTracked());
                  start();
                }} className="bg-gold text-bg px-5 py-2 rounded-lg font-semibold text-base hover:bg-gold-dim transition-all btn-press mr-2">
                  Try Again
                </button>
                <button onClick={() => {
                  recordDrill(selectedOpening, selectedSide, accuracy / 100);
                  setTracked(listTracked());
                  const next = pickNext();
                  if (next) {
                    setSelectedOpening(next.openingId);
                    setSelectedSide(next.side);
                    start(next.openingId, next.side);
                  } else {
                    setStarted(false);
                  }
                }} className="bg-bg-card border border-gold/30 text-gold px-5 py-2 rounded-lg text-base transition-all btn-press mr-2">
                  Drill next due
                </button>
                <button onClick={() => {
                  recordDrill(selectedOpening, selectedSide, accuracy / 100);
                  setTracked(listTracked());
                  setStarted(false);
                }} className="bg-bg-hover px-5 py-2 rounded-lg text-base transition-all btn-press">
                  Change Opening
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
