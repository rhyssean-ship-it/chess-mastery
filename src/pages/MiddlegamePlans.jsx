import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ChessBoard from '../components/ChessBoard';
import Breadcrumb from '../components/Breadcrumb';
import LessonCard from '../components/LessonCard';
import middlegamePlans from '../data/middlegamePlans';
import { progressService } from '../services/progressService';

function PlanIndex() {
  const completed = progressService.getCompletedLessons('middlegame');
  return (
    <div className="page-enter max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-display text-gold mb-1">Middlegame Plans</h1>
      <p className="text-text-dim text-base mb-8">Learn the right plans for every pawn structure.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {middlegamePlans.map(plan => (
          <LessonCard
            key={plan.id}
            to={`/middlegame/${plan.id}`}
            title={plan.title}
            description={`${plan.structure} — ${plan.description}`}
            difficulty={plan.difficulty}
            completed={completed.includes(plan.id)}
          />
        ))}
      </div>
    </div>
  );
}

function PlanDetail() {
  const { id } = useParams();
  const plan = middlegamePlans.find(p => p.id === id);
  const isComplete = progressService.isLessonComplete('middlegame', id);

  if (!plan) return (
    <div className="page-enter max-w-4xl mx-auto px-6 py-10">
      <p className="text-text-dim">Plan not found. <Link to="/middlegame" className="text-gold">Back</Link></p>
    </div>
  );

  return (
    <div className="page-enter max-w-3xl mx-auto px-6 py-10">
      <Breadcrumb to="/middlegame" label="Back to Middlegame Plans" />
      <h1 className="text-2xl font-display text-gold mb-1">{plan.title}</h1>
      <p className="text-text-dim text-base mb-8">{plan.structure} &middot; {plan.difficulty}</p>

      <div className="space-y-6 leading-relaxed">
        {plan.content.map((section, i) => {
          if (section.type === 'text') return <p key={i} className="text-text">{section.content}</p>;
          if (section.type === 'position') return (
            <div key={i} className="my-8">
              <div className="max-w-[440px] mx-auto">
                <ChessBoard fen={section.fen} movable={false} arrows={section.arrows || []} highlights={section.highlights || []} />
              </div>
              {section.caption && <p className="text-sm text-text-dim text-center mt-3 italic">{section.caption}</p>}
            </div>
          );
          if (section.type === 'callout') {
            const variant = section.variant === 'warning' ? 'callout-warning' : section.variant === 'tip' ? 'callout-tip' : 'callout';
            return <div key={i} className={variant}>{section.title && <p className="callout-title">{section.title}</p>}<p className="text-text">{section.content}</p></div>;
          }
          return null;
        })}
      </div>

      {/* Key Plans */}
      <div className="card-base p-5 mt-8 border-gold/20">
        <h3 className="font-display text-sm text-gold mb-3">Key Plans</h3>
        <ul className="text-base text-text space-y-2">
          {plan.keyPlans.map((p, i) => (
            <li key={i} className="flex gap-2"><span className="text-gold/50 mt-0.5">&#9670;</span><span>{p}</span></li>
          ))}
        </ul>
      </div>

      <div className="mt-10 pt-6 border-t border-bg-hover/50">
        {isComplete ? (
          <span className="text-correct text-sm">&#10003; Completed</span>
        ) : (
          <button onClick={() => { progressService.markLessonComplete('middlegame', id); window.location.reload(); }} className="bg-gold text-bg px-6 py-2.5 rounded-lg font-semibold hover:bg-gold-dim transition-all btn-press">
            Mark as Complete
          </button>
        )}
      </div>
    </div>
  );
}

export { PlanIndex, PlanDetail };
