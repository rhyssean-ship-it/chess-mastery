import { useState } from 'react';
import ChessBoard from '../components/ChessBoard';
import preMoveChecklist from '../data/preMoveChecklist';

export default function PreMoveChecklist() {
  const [mode, setMode] = useState('learn'); // learn | practice
  const [exIdx, setExIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const exercise = preMoveChecklist.exercises[exIdx];
  const currentStep = exercise?.checklistAnswers[stepIdx];

  if (mode === 'learn') {
    return (
      <div className="page-enter max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-3xl font-display text-gold mb-1">Pre-Move Checklist</h1>
        <p className="text-text-dim text-base mb-8">Ask these 5 questions before EVERY move. Build the habit.</p>

        <div className="space-y-4 mb-10">
          {preMoveChecklist.steps.map(step => (
            <div key={step.id} className="card-base p-5 flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold text-lg shrink-0">{step.id}</div>
              <div>
                <p className="font-semibold">{step.question}</p>
                <p className="text-text-dim text-sm mt-1">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <button onClick={() => setMode('practice')} className="w-full bg-gold text-bg py-3 rounded-lg font-semibold text-lg hover:bg-gold-dim transition-all btn-press">
          Practice with Positions
        </button>
      </div>
    );
  }

  return (
    <div className="page-enter max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <button onClick={() => setMode('learn')} className="inline-flex items-center gap-1.5 text-text-dim hover:text-gold text-sm mb-5 group transition-colors">
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"><path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" /></svg>
        <span>Back to Checklist</span>
      </button>
      <h1 className="text-2xl font-display text-gold mb-1">Checklist Practice</h1>
      <p className="text-text-dim text-sm mb-8">Exercise {exIdx + 1}/{preMoveChecklist.exercises.length}</p>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] lg:grid-cols-[1fr_400px] gap-6 sm:gap-8">
        <div className="w-full max-w-[480px]">
          <ChessBoard fen={exercise.fen} movable={false} />
        </div>
        <div className="space-y-4">
          <div className="card-base p-5">
            <p className="text-sm text-text-dim mb-1">Planned move: <span className="text-gold font-mono">{exercise.plannedMove}</span></p>
            <p className="font-semibold">{exercise.question}</p>
          </div>

          {!revealed ? (
            <>
              {/* Step through checklist */}
              <div className="space-y-2">
                {exercise.checklistAnswers.map((step, i) => (
                  <div key={i} className={`card-base p-4 ${i <= stepIdx ? '' : 'opacity-30'}`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                        i < stepIdx ? (step.ok ? 'bg-correct/20 text-correct' : 'bg-incorrect/20 text-incorrect') : i === stepIdx ? 'bg-gold/20 text-gold' : 'bg-bg-hover text-text-dim'
                      }`}>{i + 1}</div>
                      <div>
                        <p className="text-sm font-medium">{preMoveChecklist.steps[i].question}</p>
                        {i < stepIdx && <p className={`text-xs mt-1 ${step.ok ? 'text-correct' : 'text-incorrect'}`}>{step.answer}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {stepIdx < exercise.checklistAnswers.length ? (
                <button onClick={() => setStepIdx(s => s + 1)} className="w-full bg-gold text-bg py-2.5 rounded-lg font-semibold hover:bg-gold-dim transition-all btn-press">
                  Check Step {stepIdx + 1}
                </button>
              ) : (
                <button onClick={() => setRevealed(true)} className="w-full bg-gold text-bg py-2.5 rounded-lg font-semibold hover:bg-gold-dim transition-all btn-press">
                  See Verdict
                </button>
              )}
            </>
          ) : (
            <>
              <div className={`rounded-xl p-5 border ${exercise.betterMove ? 'bg-incorrect/10 border-incorrect/30' : 'bg-correct/10 border-correct/30'}`}>
                <p className="font-semibold mb-2">{exercise.betterMove ? '✗ Bad move!' : '✓ Good move!'}</p>
                <p className="text-text leading-relaxed">{exercise.verdict}</p>
                {exercise.betterMove && <p className="text-sm text-text-dim mt-2">Better: <span className="text-gold font-mono">{exercise.betterMove}</span></p>}
              </div>
              <button onClick={() => {
                if (exIdx + 1 >= preMoveChecklist.exercises.length) { setExIdx(0); } else { setExIdx(i => i + 1); }
                setStepIdx(0);
                setRevealed(false);
              }} className="w-full bg-gold text-bg py-2.5 rounded-lg font-semibold hover:bg-gold-dim transition-all btn-press">
                Next Position
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
