import LessonCard from '../components/LessonCard';
import ChessBoard from '../components/ChessBoard';
import openings from '../data/openings';
import { progressService } from '../services/progressService';
import { currentRating, listRatedGames } from '../services/ratingHistory';

const BANDS = [
  { id: '400-800', label: '400–800', blurb: 'Simple, sound set-ups with clear plans. Develop, castle and fight for the centre.' },
  { id: '800-1200', label: '800–1200', blurb: 'Main answers to common replies, plus a first gambit or two.' },
  { id: '1200-1600', label: '1200–1600', blurb: 'More theory and sharper positions that reward understanding the plans.' },
  { id: '1600+', label: '1600+', blurb: 'Deep, theory-heavy openings for when the basics are second nature.' },
];

function bandForRating(rating) {
  if (rating < 800) return '400-800';
  if (rating < 1200) return '800-1200';
  if (rating < 1600) return '1200-1600';
  return '1600+';
}

export default function OpeningsIndex() {
  const completed = progressService.getCompletedLessons('opening');
  // No rated games yet: treat the starting rating (400) as their level.
  const hasRated = listRatedGames().length > 0;
  const rating = hasRated ? currentRating() : 400;
  const myBand = bandForRating(rating);
  const ordered = [...BANDS.filter(b => b.id === myBand), ...BANDS.filter(b => b.id !== myBand)];

  return (
    <div className="page-enter max-w-6xl mx-auto px-4 sm:px-6 py-6 lg:py-10">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-display mb-1">Openings Library</h1>
        <p className="text-text-dim text-base">Master the most important chess openings with interactive trainers.</p>
        <p className="text-text-dim text-sm mt-2">
          Grouped by rating band, so you can focus on openings that suit your level.
          {hasRated ? ` Your rating is ${rating}, so your band is shown first.` : ' Play rated games against the computer and your band will follow your rating.'}
        </p>
      </div>

      {ordered.map(band => {
        const items = openings.filter(op => op.eloBand === band.id);
        if (!items.length) return null;
        const isMine = band.id === myBand;
        return (
          <section key={band.id} className="mb-10" aria-labelledby={`band-${band.id}`}>
            <div className="flex items-center gap-3 mb-1">
              <h2 id={`band-${band.id}`} className="text-xl font-display text-text">{band.label}</h2>
              {isMine && (
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-correct/20 text-correct">Your level</span>
              )}
              <span className="text-xs text-text-dim ml-auto">{items.length} openings</span>
            </div>
            <p className="text-text-dim text-sm mb-4">{band.blurb}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {items.map(op => (
                <LessonCard
                  key={op.id}
                  to={`/openings/${op.id}`}
                  title={op.name}
                  description={null}
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
          </section>
        );
      })}
    </div>
  );
}
