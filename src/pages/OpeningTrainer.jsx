import { useState, useCallback, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Chess } from 'chess.js';
import ChessBoard from '../components/ChessBoard';
import MoveList from '../components/MoveList';
import Breadcrumb from '../components/Breadcrumb';
import openings from '../data/openings';
import { progressService } from '../services/progressService';

export default function OpeningTrainer() {
  const { id } = useParams();
  const opening = openings.find(o => o.id === id);
  const [currentMove, setCurrentMove] = useState(-1);
  const [testMode, setTestMode] = useState(false);
  const [testMoveIndex, setTestMoveIndex] = useState(0);
  const [testCorrect, setTestCorrect] = useState(0);
  const [testTotal, setTestTotal] = useState(0);
  const [testFeedback, setTestFeedback] = useState(null);
  const [testFen, setTestFen] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  const [testGame, setTestGame] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      if (testMode) return;
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });

  if (!opening) {
    return <div className="page-enter max-w-4xl mx-auto px-6 py-10">
      <p className="text-text-dim">Opening not found. <Link to="/openings" className="text-gold">Back to openings</Link></p>
    </div>;
  }

  const moves = opening.moves;
  const startFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  const currentFen = currentMove >= 0 ? moves[currentMove].fen : startFen;
  const currentExplanation = currentMove >= 0 ? moves[currentMove].explanation : 'Click Next to begin stepping through the opening.';
  const currentArrows = currentMove >= 0 && moves[currentMove].arrows ? moves[currentMove].arrows : [];
  const currentHighlights = currentMove >= 0 && moves[currentMove].highlights ? moves[currentMove].highlights : [];

  const lastMove = currentMove >= 0 ? (() => {
    const prev = currentMove > 0 ? moves[currentMove - 1].fen : startFen;
    try {
      const g = new Chess(prev);
      const m = g.move(moves[currentMove].move);
      return m ? [m.from, m.to] : undefined;
    } catch { return undefined; }
  })() : undefined;

  function goNext() { if (currentMove < moves.length - 1) setCurrentMove(currentMove + 1); }
  function goPrev() { if (currentMove > -1) setCurrentMove(currentMove - 1); }

  function startTest() {
    setTestMode(true);
    setTestMoveIndex(0);
    setTestCorrect(0);
    setTestTotal(0);
    setTestFeedback(null);
    setTestFen(startFen);
    setTestGame(new Chess());
  }

  function getLegalDestsForTest() {
    if (!testGame) return new Map();
    const dests = new Map();
    for (const m of testGame.moves({ verbose: true })) {
      if (!dests.has(m.from)) dests.set(m.from, []);
      dests.get(m.from).push(m.to);
    }
    return dests;
  }

  const handleTestMove = useCallback((from, to) => {
    if (!testGame || testMoveIndex >= moves.length) return;
    const expected = moves[testMoveIndex];
    const g = new Chess(testGame.fen());
    const m = g.move({ from, to, promotion: 'q' });
    if (!m) return;

    if (m.san === expected.move) {
      setTestCorrect(prev => prev + 1);
      setTestTotal(prev => prev + 1);
      setTestFeedback({ correct: true, message: `Correct! ${expected.move}` });
    } else {
      setTestTotal(prev => prev + 1);
      setTestFeedback({ correct: false, message: `The correct move was ${expected.move}. ${expected.explanation}` });
      const correctG = new Chess(testGame.fen());
      correctG.move(expected.move);
      setTestGame(correctG);
      setTestFen(correctG.fen());
      setTestMoveIndex(testMoveIndex + 1);
      return;
    }

    setTestGame(g);
    setTestFen(g.fen());
    setTestMoveIndex(testMoveIndex + 1);
  }, [testGame, testMoveIndex, moves]);

  const testFinished = testMode && testMoveIndex >= moves.length;
  const turnColor = testGame ? (testGame.turn() === 'w' ? 'white' : 'black') : 'white';
  const studyHistory = moves.slice(0, currentMove + 1).map(m => ({ san: m.move }));

  return (
    <div className="page-enter max-w-6xl mx-auto px-6 py-10">
      <Breadcrumb to="/openings" label="Back to Openings" />
      <h1 className="text-2xl font-display text-gold mb-1">{opening.name}</h1>
      <p className="text-text-dim text-sm mb-2">{opening.eco} &middot; {opening.difficulty}</p>
      <p className="text-text-dim text-base mb-8">{opening.description}</p>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
        {/* Board */}
        <div className="w-full max-w-[560px]">
          {testMode ? (
            <ChessBoard fen={testFen} movable={!testFinished} dests={getLegalDestsForTest()} turnColor={turnColor} onMove={handleTestMove} />
          ) : (
            <ChessBoard fen={currentFen} movable={false} lastMove={lastMove} arrows={currentArrows} highlights={currentHighlights} />
          )}
        </div>

        {/* Annotation panel */}
        <div className="space-y-4">
          {testMode ? (
            <>
              <div className="card-base p-5">
                <h3 className="font-display text-sm mb-2">Test Mode</h3>
                {testFinished ? (
                  <div>
                    <p className="text-xl font-bold mb-2 tabular-nums">{testCorrect}/{testTotal}</p>
                    <p className="text-text-dim text-base mb-4">
                      {testCorrect === testTotal ? 'Perfect! You know this opening well.' : 'Keep practicing to improve your recall.'}
                    </p>
                    <button onClick={() => { setTestMode(false); progressService.recordOpeningDrill(id, 'white', Math.round((testCorrect / testTotal) * 100)); }} className="bg-gold text-bg px-5 py-2 rounded-lg font-semibold btn-press text-base hover:bg-gold-dim transition-all">
                      Back to Study
                    </button>
                  </div>
                ) : (
                  <p className="text-text-dim text-base">Play move {testMoveIndex + 1} of {moves.length}</p>
                )}
              </div>
              {testFeedback && (
                <div className={`rounded-xl p-4 border text-sm ${testFeedback.correct ? 'bg-correct/10 border-correct/30' : 'bg-incorrect/10 border-incorrect/30'}`}>
                  <span className="mr-2">{testFeedback.correct ? '&#10003;' : '&#10007;'}</span>
                  {testFeedback.message}
                </div>
              )}
            </>
          ) : (
            <>
              {/* Move navigation with kbd hints */}
              <div className="flex gap-2">
                <button onClick={goPrev} disabled={currentMove < 0} className="flex-1 py-2.5 rounded-lg bg-bg-card border border-bg-hover text-base disabled:opacity-30 disabled:cursor-not-allowed hover:bg-bg-hover transition-all btn-press flex items-center justify-center gap-2">
                  <kbd>&larr;</kbd> Prev
                </button>
                <button onClick={goNext} disabled={currentMove >= moves.length - 1} className="flex-1 py-2.5 rounded-lg bg-bg-card border border-bg-hover text-base disabled:opacity-30 disabled:cursor-not-allowed hover:bg-bg-hover transition-all btn-press flex items-center justify-center gap-2">
                  Next <kbd>&rarr;</kbd>
                </button>
              </div>

              <MoveList history={studyHistory} currentIndex={currentMove} onSelectMove={setCurrentMove} />

              {/* Explanation */}
              <div className="card-base p-5">
                {currentMove >= 0 && <p className="text-gold font-semibold text-sm mb-1.5">{moves[currentMove].move}</p>}
                <p className="text-base text-text leading-relaxed">{currentExplanation}</p>
              </div>

              {/* Key ideas (shown at end) */}
              {currentMove === moves.length - 1 && (
                <div className="card-base p-5 border-gold/20">
                  <h3 className="font-display text-sm text-gold mb-3">Key Ideas</h3>
                  <ul className="text-base text-text space-y-2">
                    {opening.keyIdeas.map((idea, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-gold/50 mt-0.5">&#9670;</span>
                        <span>{idea}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button onClick={startTest} className="w-full bg-gold text-bg py-2.5 rounded-lg font-semibold btn-press hover:bg-gold-dim transition-all shadow-lg shadow-gold/10">
                Test Me
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
