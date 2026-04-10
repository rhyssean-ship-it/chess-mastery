import LessonCard from '../components/LessonCard';
import endgameLessons from '../data/endgameLessons';
import { progressService } from '../services/progressService';

const categories = ['King & Pawn', 'Rook Endings', 'Minor Piece', 'Queen Endings'];

export default function EndgameIndex() {
  const completed = progressService.getCompletedLessons('endgame');

  return (
    <div className="page-enter max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-display text-gold mb-2">Endgame Trainer</h1>
      <p className="text-text-dim mb-8">Master essential endgame techniques.</p>

      {categories.map(cat => {
        const lessons = endgameLessons.filter(l => l.category === cat);
        if (lessons.length === 0) return null;
        return (
          <div key={cat} className="mb-8">
            <h2 className="text-lg font-display text-text mb-4">{cat}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {lessons.map(lesson => (
                <LessonCard
                  key={lesson.id}
                  to={`/endgames/${lesson.id}`}
                  title={lesson.title}
                  description={lesson.description}
                  difficulty={lesson.difficulty}
                  completed={completed.includes(lesson.id)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
