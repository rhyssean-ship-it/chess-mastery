import { Link } from 'react-router-dom';

const difficultyColors = {
  Beginner: 'bg-correct/20 text-correct',
  Intermediate: 'bg-amber/20 text-amber',
  Advanced: 'bg-incorrect/20 text-incorrect',
};

export default function LessonCard({ to, title, description, difficulty, readTime, completed, thumbnail }) {
  return (
    <Link to={to} className="no-underline group">
      <div className="bg-bg-card border border-bg-hover rounded-xl p-5 h-full transition-all hover:border-gold/30 hover:bg-bg-hover">
        {thumbnail && (
          <div className="mb-3 w-full aspect-square max-w-[160px] mx-auto">
            {thumbnail}
          </div>
        )}
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-xs px-2 py-0.5 rounded-full ${difficultyColors[difficulty] || 'bg-bg-hover text-text-dim'}`}>
            {difficulty}
          </span>
          {readTime && <span className="text-xs text-text-dim">{readTime}</span>}
          {completed && <span className="text-xs text-correct ml-auto" title="Completed">&#10003; Done</span>}
        </div>
        <h3 className="font-display text-base font-semibold mb-1 group-hover:text-gold transition-colors">{title}</h3>
        {description && <p className="text-sm text-text-dim leading-relaxed">{description}</p>}
      </div>
    </Link>
  );
}
