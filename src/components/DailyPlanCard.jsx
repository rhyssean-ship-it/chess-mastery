import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { generatePlan, totalMinutes, completedMinutes } from '../services/dailyPlanService';

export default function DailyPlanCard() {
  const [plan, setPlan] = useState(() => generatePlan());

  // Regenerate when the page comes back into focus (in case the user just finished an item)
  useEffect(() => {
    function onFocus() { setPlan(generatePlan()); }
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onFocus);
    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onFocus);
    };
  }, []);

  const total = totalMinutes(plan);
  const done = completedMinutes(plan);
  const pct = total > 0 ? (done / total) * 100 : 0;

  return (
    <div className="card-base p-4 mb-5">
      <div className="flex items-baseline justify-between mb-3">
        <div>
          <div className="text-sm font-semibold">Today's plan</div>
          <div className="text-xs text-text-dim">{total} min · {done > 0 ? `${done} done` : 'pick where to start'}</div>
        </div>
        {pct > 0 && (
          <div className="text-xs text-gold font-semibold tabular-nums">{Math.round(pct)}%</div>
        )}
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-bg-hover rounded-full overflow-hidden mb-3">
        <div className="h-full bg-gold transition-all duration-300" style={{ width: `${pct}%` }} />
      </div>

      <ul className="space-y-1">
        {plan.map(item => (
          <li key={item.id}>
            <Link
              to={item.route}
              className={`flex items-center gap-2.5 px-2 py-2 rounded-md transition-all -mx-2 ${
                item.done ? 'opacity-50' : 'hover:bg-bg-hover/40'
              }`}
            >
              <span className={`w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] ${
                item.done ? 'bg-correct/20 text-correct' : 'border border-bg-hover'
              }`}>
                {item.done ? '✓' : ''}
              </span>
              <div className="flex-1 min-w-0">
                <div className={`text-sm ${item.done ? 'line-through' : 'font-medium'}`}>{item.title}</div>
                <div className="text-[11px] text-text-dim truncate">{item.blurb}</div>
              </div>
              <span className="text-[11px] text-text-dim tabular-nums shrink-0">{item.minutes}m</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
