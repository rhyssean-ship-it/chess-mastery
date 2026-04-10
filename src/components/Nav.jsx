import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home' },
  { to: '/openings', label: 'Openings' },
  { to: '/tactics', label: 'Tactics' },
  { to: '/strategy', label: 'Strategy' },
  { to: '/endgames', label: 'Endgames' },
  { to: '/repertoire', label: 'Repertoire' },
  { to: '/visualisation', label: 'Visualisation' },
  { to: '/game-review', label: 'Game Review' },
  { to: '/progress', label: 'Progress' },
];

export default function Nav() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-bg-card border-b border-bg-hover sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
        <Link to="/" className="font-display text-gold text-xl font-bold tracking-wide no-underline">
          Chess Mastery
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex gap-1">
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={`px-3 py-1.5 rounded text-sm no-underline transition-colors ${
                isActive(l.to)
                  ? 'text-gold bg-bg-hover'
                  : 'text-text-dim hover:text-text hover:bg-bg-hover'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden text-text-dim hover:text-text p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? (
              <path d="M6 6l12 12M6 18L18 6" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-bg-hover px-4 pb-3">
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setMenuOpen(false)}
              className={`block px-3 py-2 rounded text-sm no-underline ${
                isActive(l.to)
                  ? 'text-gold bg-bg-hover'
                  : 'text-text-dim hover:text-text'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
