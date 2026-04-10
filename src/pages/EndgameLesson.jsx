import { useState, useCallback } from 'react';
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

  if (!lesson) {
    return <div className="page-enter max-w-4xl mx-auto px-6 py-10">
      <p className="text-text-dim">Lesson not found. <Link to="/endgames" className="text-gold">Back to endgames</Link></p>
    </div>;
  }

  function startDrill() {
    const g = new Chess(lesson.drillPosition.fen);
    setDrillGame(g);
    setDrillFen(g.fen());
    setDrillStep(0);
    setDrillFeedback(null);
    setDrillDone(false);
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

  const handleDrillMove = useCallback((from, to) => {
    if (!drillGame || drillDone) return;
    const solution = lesson.drillPosition.solution;
    const expected = solution[drillStep];

    const g = new Chess(drillGame.fen());
    const m = g.move({ from, to, promotion: 'q' });
    if (!m) return;

    if (m.san === expected) {
      setDrillGame(g);
      setDrillFen(g.fen());
      setDrillFeedback({ correct: true, message: `Correct! ${m.san}` });

      const nextStep = drillStep + 1;
      if (nextStep >= solution.length) {
        setDrillDone(true);
      } else {
        // Opponent response
        setTimeout(() => {
          const g2 = new Chess(g.fen());
          const opp = g2.move(solution[nextStep]);
          if (opp) {
            setDrillGame(g2);
            setDrillFen(g2.fen());
            setDrillStep(nextStep + 1);
          }
        }, 400);
        setDrillStep(nextStep);
      }
    } else {
      setDrillFeedback({ correct: false, message: `Not quite. The correct move was ${expected}.` });
      // Reset position
      const g2 = new Chess(lesson.drillPosition.fen);
      for (let i = 0; i < drillStep; i++) g2.move(solution[i]);
      setDrillGame(g2);
      setDrillFen(g2.fen());
    }
  }, [drillGame, drillStep, drillDone, lesson]);

  const turnColor = drillGame ? (drillGame.turn() === 'w' ? 'white' : 'black') : 'white';

  function markComplete() {
    progressService.markLessonComplete('endgame', id);
    window.location.reload();
  }

  return (
    <div className="page-enter max-w-3xl mx-auto px-6 py-10">
      <Breadcrumb to="/endgames" label="Back to Endgames" />
      <h1 className="text-2xl font-display text-gold mb-1">{lesson.title}</h1>
      <p className="text-text-dim text-sm mb-8">{lesson.category} &middot; {lesson.difficulty}</p>

      {drillMode ? (
        <div className="space-y-4">
          <div className="max-w-[480px] mx-auto">
            <ChessBoard
              fen={drillFen}
              movable={!drillDone}
              dests={getLegalDests()}
              turnColor={turnColor}
              onMove={handleDrillMove}
            />
          </div>
          {drillFeedback && (
            <div className={`rounded-xl p-4 border max-w-[480px] mx-auto ${drillFeedback.correct ? 'bg-correct/10 border-correct/30' : 'bg-incorrect/10 border-incorrect/30'}`}>
              <span className="mr-2">{drillFeedback.correct ? '&#10003;' : '&#10007;'}</span>
              {drillFeedback.message}
            </div>
          )}
          {drillDone && (
            <div className="text-center">
              <p className="text-correct font-semibold mb-3">&#10003; Drill complete!</p>
              <p className="text-text-dim text-sm mb-4">{lesson.drillPosition.explanation}</p>
              <button onClick={() => setDrillMode(false)} className="bg-gold text-bg px-5 py-2 rounded-lg font-semibold hover:bg-gold-dim transition-all btn-press">Back to Lesson</button>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="space-y-6 leading-relaxed">
            {lesson.content.map((section, i) => {
              if (section.type === 'text') return <p key={i} className="text-text-dim">{section.content}</p>;
              if (section.type === 'position') return (
                <div key={i} className="my-6">
                  <div className="max-w-[400px] mx-auto">
                    <ChessBoard fen={section.fen} movable={false} arrows={section.arrows || []} highlights={section.highlights || []} />
                  </div>
                  {section.caption && <p className="text-sm text-text-dim text-center mt-2 italic">{section.caption}</p>}
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
              <span className="text-correct text-sm">&#10003; Completed</span>
            ) : (
              <button onClick={markComplete} className="card-base !rounded-lg px-5 py-2.5 text-sm hover:bg-bg-hover transition-all btn-press">
                Mark as Complete
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
