import { useParams, Link } from 'react-router-dom';
import ChessBoard from '../components/ChessBoard';
import Breadcrumb from '../components/Breadcrumb';
import strategyLessons from '../data/strategyLessons';
import { progressService } from '../services/progressService';

export default function StrategyLesson() {
  const { id } = useParams();
  const lesson = strategyLessons.find(l => l.id === id);
  const isComplete = progressService.isLessonComplete('strategy', id);

  if (!lesson) {
    return <div className="page-enter max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <p className="text-text-dim">Lesson not found. <Link to="/strategy" className="text-gold">Back to strategy</Link></p>
    </div>;
  }

  function markComplete() {
    progressService.markLessonComplete('strategy', id);
    window.location.reload();
  }

  return (
    <div className="page-enter max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <Breadcrumb to="/strategy" label="Back to Strategy" />
      <h1 className="text-2xl font-display text-gold mb-1">{lesson.title}</h1>
      <p className="text-text-dim text-base mb-8">{lesson.difficulty} &middot; {lesson.readTime}</p>

      <div className="space-y-6 leading-relaxed">
        {lesson.content.map((section, i) => {
          if (section.type === 'text') {
            return <p key={i} className="text-text">{section.content}</p>;
          }
          if (section.type === 'position') {
            return (
              <div key={i} className="my-8">
                <div className="max-w-[440px] mx-auto">
                  <ChessBoard
                    fen={section.fen}
                    movable={false}
                    arrows={section.arrows || []}
                    highlights={section.highlights || []}
                  />
                </div>
                {section.caption && <p className="text-sm text-text-dim text-center mt-3 italic">{section.caption}</p>}
              </div>
            );
          }
          if (section.type === 'callout') {
            const variant = section.variant === 'warning' ? 'callout-warning' : section.variant === 'tip' ? 'callout-tip' : 'callout';
            return (
              <div key={i} className={variant}>
                {section.title && <p className="callout-title">{section.title}</p>}
                <p className="text-text">{section.content}</p>
              </div>
            );
          }
          return null;
        })}
      </div>

      <div className="mt-10 pt-6 border-t border-bg-hover">
        {isComplete ? (
          <p className="text-correct text-sm">&#10003; Lesson completed</p>
        ) : (
          <button onClick={markComplete} className="bg-gold text-bg px-4 sm:px-6 py-2.5 rounded-lg font-semibold hover:bg-gold-dim transition-all btn-press">
            Mark as Complete
          </button>
        )}
      </div>
    </div>
  );
}
