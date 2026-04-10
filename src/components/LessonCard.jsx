import { Link } from 'react-router-dom';

const difficultyColors = {
  Beginner: 'bg-correct/20 text-correct',
  Intermediate: 'bg-amber/20 text-amber',
  Advanced: 'bg-incorrect/20 text-incorrect',
};

export default function LessonCard({ to, title, description, difficulty, readTime, completed, thumbnail }) {
  return (
    <Link to={to} className="no-underline group card-stagger">
      <div className="bg-bg-card border border-bg-hover rounded-xl p-5 h-full card-hover hover:border-gold/30">
        {thumbnail && (
          <div className="mb-3 w-full aspect-square max-w-[160px] mx-auto rounded-lg overflow-hidden">
            {thumbnail}
          </div>
        )}
        <div className="flex items-center gap-2 mb-2.5">
          <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${difficultyColors[difficulty] || 'bg-bg-hover text-text-dim'}`}>
            {difficulty}
          </span>
          {readTime && <span className="text-[11px] text-text-dim">{readTime}</span>}
          {completed && <span className="text-[11px] text-correct ml-auto font-medium">&#10003; Done</span>}
        </div>
        <h3 className="font-display text-[15px] font-semibold mb-1.5 group-hover:text-gold transition-colors duration-200">{title}</h3>
        {description && <p className="text-sm text-text-dim leading-relaxed line-clamp-2">{description}</p>}
      </div>
    </Link>
  );
}
