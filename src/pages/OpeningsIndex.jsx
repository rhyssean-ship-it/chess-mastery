import LessonCard from '../components/LessonCard';
import ChessBoard from '../components/ChessBoard';
import openings from '../data/openings';
import { progressService } from '../services/progressService';

export default function OpeningsIndex() {
  const completed = progressService.getCompletedLessons('opening');

  return (
    <div className="page-enter max-w-6xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-display text-gold mb-1">Openings Library</h1>
        <p className="text-text-dim text-sm">Master the most important chess openings with interactive trainers.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {openings.map(op => (
          <LessonCard
            key={op.id}
            to={`/openings/${op.id}`}
            title={op.name}
            description={`${op.eco} — ${op.description}`}
            difficulty={op.difficulty}
            completed={completed.includes(op.id)}
            thumbnail={
              <ChessBoard
                fen={op.moves[op.moves.length - 1].fen}
                movable={false}
                coordinates={false}
                className="pointer-events-none"
              />
            }
          />
        ))}
      </div>
    </div>
  );
}
