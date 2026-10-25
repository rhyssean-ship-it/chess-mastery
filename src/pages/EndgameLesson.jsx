import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Chess } from 'chess.js';
import ChessBoard from '../components/ChessBoard';
import Breadcrumb from '../components/Breadcrumb';
import endgameLessons from '../data/endgameLessons';
import { progressService } from '../services/progressService';

export default function EndgameLesson() {
  const { id } = useParams();
  const lesson = endgameLessons.find(l => l.id === id);
  const isComplete = progressService.isLessonComplete('endgame', id);

  const [drillMode, setDrillMode] = useState(false);
  const [drillGame, setDrillGame] = useState(null);
  const [drillFen, setDrillFen] = useState('');
  const [drillStep, setDrillStep] = useState(0);
  const [drillFeedback, setDrillFeedback] = useState(null);
  const [drillDone, setDrillDone] = useState(false);
  const [drillSide, setDrillSide] = useState('white');
  const [boardKey, setBoardKey] = useState(0);

  if (!lesson) {
    return <div className="page-enter max-w-4xl mx-auto px-4 sm:px-6 py-6 lg:py-10">
      <p className="text-text-dim">Lesson not found. <Link to="/endgames" className="text-gold">Back to endgames</Link></p>
    </div>;
  }

  // Resolve a SAN from the data against a position; null if illegal/malformed.
  function resolveMove(fenStr, san) {
    try { return new Chess(fenStr).move(san); } catch { return null; }
  }

  function startDrill() {
    const g = new Chess(lesson.drillPosition.fen);
    setDrillGame(g);
    setDrillFen(g.fen());
    setDrillStep(0);
    setDrillFeedback(null);
    setDrillDone(false);
    setDrillSide(g.turn() === 'w' ? 'white' : 'black');
    setDrillMode(true);
  }

  function getLegalDests() {
    if (!drillGame) return new Map();
    const dests = new Map();
    for (const m of drillGame.moves({ verbose: true })) {
      if (!dests.has(m.from)) dests.set(m.from, []);
      dests.get(m.from).push(m.to);
    }
    return dests;
  }

  function handleDrillMove(from, to) {
    if (!drillGame || drillDone) return;
    const solution = lesson.drillPosition.solution || [];
    const expected = resolveMove(drillGame.fen(), solution[drillStep]);
    if (!expected) {
      // Scripted line ran out or is broken for this position — end gracefully.
      setDrillDone(true);
      return;
    }

    // Compare by squares (not SAN text, which may differ in +/# suffixes).
    if (from === expected.from && to === expected.to) {
      const g = new Chess(drillGame.fen());
      const m = g.move(expected.san);
      setDrillGame(g);
      setDrillFen(g.fen());
      setDrillFeedback({ correct: true, message: `Correct! ${m.san}` });

      const nextStep = drillStep + 1;
      if (nextStep >= solution.length || g.isGameOver()) {
        setDrillDone(true);
        return;
      }
      setDrillStep(nextStep);
      // Opponent response
      setTimeout(() => {
        try {
          const g2 = new Chess(g.fen());
          g2.move(solution[nextStep]);
          setDrillGame(g2);
          setDrillFen(g2.fen());
          setDrillStep(nextStep + 1);
          if (nextStep + 1 >= solution.length || g2.isGameOver()) setDrillDone(true);
        } catch {
          setDrillDone(true);
        }
      }, 400);
    } else {
      const g = new Chess(drillGame.fen());
      let tried = null;
      try { tried = g.move({ from, to, promotion: 'q' }); } catch { /* illegal */ }
      if (!tried) return;
      setDrillFeedback({ correct: false, message: `Not quite. The correct move was ${expected.san}.` });
      // Snap the board back to the position before the wrong move.
      setBoardKey(k => k + 1);
    }
  }

  const turnColor = drillGame ? (drillGame.turn() === 'w' ? 'white' : 'black') : 'white';

  function markComplete() {
    progressService.markLessonComplete('endgame', id);
    window.location.reload();
  }

  return (
    <div className="page-enter max-w-3xl mx-auto px-4 sm:px-6 py-6 lg:py-10">
      <Breadcrumb to="/endgames" label="Back to Endgames" />
      <h1 className="text-2xl font-display mb-1">{lesson.title}</h1>
      <p className="text-text-dim text-sm mb-5">{lesson.category} &middot; {lesson.difficulty}</p>

      {drillMode ? (
        <div className="space-y-4">
          <div className="max-w-[480px] mx-auto board-fit-mobile">
            <ChessBoard
              key={boardKey}
              fen={drillFen}
              orientation={drillSide}
              movable={!drillDone && turnColor === drillSide}
              dests={getLegalDests()}
              turnColor={turnColor}
              onMove={handleDrillMove}
            />
          </div>
          {drillFeedback && (
            <div className={`rounded-xl p-4 border max-w-[480px] mx-auto ${drillFeedback.correct ? 'bg-correct/10 border-correct/30' : 'bg-incorrect/10 border-incorrect/30'}`}>
              <span className="mr-2">{drillFeedback.correct ? '\u2713' : '\u2717'}</span>
              {drillFeedback.message}
            </div>
          )}
          {drillDone && (
            <div className="text-center">
              <p className="text-correct font-semibold mb-3">✓ Drill complete!</p>
              <p className="text-text text-base leading-relaxed mb-4">{lesson.drillPosition.explanation}</p>
              <button onClick={() => setDrillMode(false)} className="bg-gold text-bg px-5 py-2 rounded-lg font-semibold hover:bg-gold-dim transition-all btn-press">Back to Lesson</button>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="space-y-6 leading-relaxed">
            {lesson.content.map((section, i) => {
              if (section.type === 'text') return <p key={i} className="text-text">{section.content}</p>;
              if (section.type === 'position') return (
                <div key={i} className="my-6">
                  <div className="max-w-[400px] mx-auto board-fit-mobile">
                    <ChessBoard fen={section.fen} movable={false} arrows={section.arrows || []} highlights={section.highlights || []} />
                  </div>
                  {section.caption && <p className="text-base text-text-dim text-center mt-2 italic">{section.caption}</p>}
                </div>
              );
              return null;
            })}
          </div>

          <div className="mt-10 pt-6 border-t border-bg-hover flex flex-wrap gap-3 items-center">
            <button onClick={startDrill} className="bg-gold text-bg px-5 py-2.5 rounded-lg font-semibold hover:bg-gold-dim transition-all btn-press">
              Drill This Position
            </button>
            {isComplete ? (
              <span className="text-correct text-sm">✓ Completed</span>
            ) : (
              <button onClick={markComplete} className="card-base !rounded-lg px-5 py-2.5 text-base hover:bg-bg-hover transition-all btn-press">
                Mark as Complete
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
