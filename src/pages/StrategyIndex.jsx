import LessonCard from '../components/LessonCard';
import strategyLessons from '../data/strategyLessons';
import { progressService } from '../services/progressService';

export default function StrategyIndex() {
  const completed = progressService.getCompletedLessons('strategy');

  return (
    <div className="page-enter max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-display text-gold mb-1">Strategy Lessons</h1>
      <p className="text-text-dim text-sm mb-8">Deepen your understanding of positional chess.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {strategyLessons.map(lesson => (
          <LessonCard
            key={lesson.id}
            to={`/strategy/${lesson.id}`}
            title={lesson.title}
            description={lesson.description}
            difficulty={lesson.difficulty}
            readTime={lesson.readTime}
            completed={completed.includes(lesson.id)}
          />
        ))}
      </div>
    </div>
  );
}
