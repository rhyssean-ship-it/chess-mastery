import { Link } from 'react-router-dom';

// Unified empty-state. Replaces ad-hoc "Nothing yet" blocks across the app.
//
// Usage:
//   <EmptyState
//     icon="♟"
//     title="No saved games yet"
//     body="Games you analyse will appear here automatically."
//     ctaLabel="Play a game"
//     ctaTo="/play"
//   />
export default function EmptyState({ icon, title, body, ctaLabel, ctaTo, onCta }) {
  const cta = ctaLabel ? (
    ctaTo
      ? <Link to={ctaTo} className="btn btn-primary mt-1">{ctaLabel}</Link>
      : <button onClick={onCta} className="btn btn-primary mt-1">{ctaLabel}</button>
  ) : null;

  return (
    <div className="text-center py-12 px-4 max-w-sm mx-auto">
      {icon && <div className="text-5xl text-text-dim/40 mb-3 font-display">{icon}</div>}
      {title && <h2 className="text-lg font-semibold mb-1.5">{title}</h2>}
      {body && <p className="text-sm text-text-dim leading-relaxed mb-5">{body}</p>}
      {cta}
    </div>
  );
}
