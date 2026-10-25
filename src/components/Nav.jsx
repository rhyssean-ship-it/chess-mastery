import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useFocusMode, inFocus } from '../services/focusMode';

const I = (d) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-[18px] h-[18px]"><path d={d} strokeLinecap="round" strokeLinejoin="round" /></svg>;

const sections = [
  // === HOME ===
  { id: 'home', label: 'Home', icon: I('M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75'),
    link: '/' },

  // === LEARN ===
  { id: 'learn', label: 'Learn', icon: I('M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25'),
    children: [
      { to: '/learn', label: 'Learn Overview' },
      { to: '/focus', label: 'Your 500 → 900 track' },
      { to: '/learning-path', label: 'Learning Path' },
      { divider: 'Fundamentals' },
      { to: '/game-phases', label: 'Game Phases' },
      { to: '/piece-values', label: 'Piece Values' },
      { to: '/notation', label: 'Board Notation' },
      { to: '/checkmate-patterns', label: 'Checkmate Patterns' },
      { divider: 'Avoid Mistakes' },
      { to: '/hanging-pieces', label: 'Hanging Pieces' },
      { to: '/pre-move-checklist', label: 'Spy, Scan, Safe' },
      { to: '/common-mistakes', label: 'Common Mistakes' },
      { to: '/blunder-detection', label: 'Blunder Detection' },
      { divider: 'Openings' },
      { to: '/openings', label: 'Library' },
      { to: '/opening-traps', label: 'Traps' },
      { to: '/move-order', label: 'Move Order Quiz' },
      { to: '/repertoire', label: 'Repertoire Builder' },
      { divider: 'Strategy' },
      { to: '/strategy', label: 'Strategy Lessons' },
      { to: '/middlegame', label: 'Plans by Structure' },
      { to: '/critical-moments', label: 'Critical Moments' },
      { to: '/pattern-recognition', label: 'Pattern Recognition' },
      { to: '/pawn-structures', label: 'Pawn Structures' },
      { to: '/master-games', label: 'Annotated Games' },
      { divider: 'Endgames' },
      { to: '/endgames', label: 'Endgame Lessons' },
      { to: '/theoretical-endgames', label: 'Key Positions' },
      { to: '/practical-endgames', label: 'Practical Puzzles' },
      { divider: 'Reference' },
      { to: '/flashcards', label: 'Concept Cards' },
      { to: '/glossary', label: 'Glossary' },
    ]},

  // === PLAY ===
  { id: 'play', label: 'Play', icon: I('M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z'),
    children: [
      { to: '/play', label: 'vs Computer' },
      { to: '/practice-play', label: 'Practice Play' },
      { to: '/game-review', label: 'Game Review (PGN)' },
      { to: '/lab', label: 'Position Lab' },
    ]},

  // === TRAIN ===
  { id: 'train', label: 'Train', icon: I('M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z'),
    children: [
      { to: '/train', label: 'Train Overview' },
      { divider: 'Daily' },
      { to: '/daily', label: 'Daily Challenge' },
      { to: '/daily-calculation', label: 'Daily Calculation' },
      { divider: 'Tactics' },
      { to: '/tactics', label: 'Puzzle Queue' },
      { to: '/puzzle-rush', label: 'Puzzle Rush' },
      { to: '/pattern-dojo', label: 'Pattern Dojo' },
      { to: '/my-mistakes', label: 'My Mistakes' },
      { to: '/thinking-drills', label: 'Spy, Scan, Safe drills' },
      { divider: 'Calculation' },
      { to: '/calculation', label: 'Calculation Trainer' },
      { to: '/visualisation', label: 'Visualisation' },
      { to: '/blindfold-ladder', label: 'Blindfold Ladder' },
      { divider: 'Endgame' },
      { to: '/endgame-drills', label: 'Endgame Drills' },
    ]},

  // === PROFILE ===
  { id: 'profile', label: 'Profile', icon: I('M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z'),
    children: [
      { to: '/profile', label: 'Profile Overview' },
      { to: '/profile/rating', label: 'Your Rating' },
      { to: '/progress', label: 'Progress' },
      { to: '/rating-estimator', label: 'Rating Estimator' },
      { to: '/weakness', label: 'Weakness Analyzer' },
      { to: '/profile/reviews', label: 'Reviewed Games' },
    ]},
];

// Focus mode hides routes that aren't on the 500 → 900 track, then drops empty dividers.
function visibleSections(focus) {
  if (!focus) return sections;
  return sections.map(s => {
    if (!s.children) return s;
    const kept = s.children.filter(c => c.divider || inFocus(c.to));
    const children = kept.filter((c, i) => !c.divider || (kept[i + 1] && !kept[i + 1].divider));
    return { ...s, children };
  });
}

function getActiveSection(pathname) {
  for (const s of sections) {
    if (s.link && pathname === s.link) return s.id;
    if (s.children) {
      for (const c of s.children) {
        if (c.divider) continue;
        if (pathname === c.to || pathname.startsWith(c.to + '/')) return s.id;
      }
    }
  }
  return null;
}

export default function Nav() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeSection = getActiveSection(location.pathname);
  const focus = useFocusMode();
  const shownSections = visibleSections(focus);
  const [expanded, setExpanded] = useState(activeSection);

  useEffect(() => {
    setExpanded(getActiveSection(location.pathname));
  }, [location.pathname]);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const toggleSection = (id) => {
    setExpanded(prev => prev === id ? null : id);
  };

  const chevron = (open) => (
    <svg viewBox="0 0 20 20" fill="currentColor" className={`w-3.5 h-3.5 text-text-dim/50 transition-transform duration-200 ${open ? 'rotate-90' : ''}`}>
      <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
    </svg>
  );

  const navContent = (
    <>
      {/* Logo */}
      <div className="px-4 pt-5 pb-4">
        <Link to="/" className="no-underline" onClick={() => setMobileOpen(false)}>
          <div className="font-display text-gold text-2xl font-bold tracking-wide">enPassant</div>
        </Link>
      </div>

      {/* Accordion nav — scrolls when its content exceeds viewport height */}
      <nav className="flex-1 min-h-0 overflow-y-auto px-3 py-1 space-y-0.5" role="navigation">
        {shownSections.map(section => {
          const isOpen = expanded === section.id;
          const sectionActive = activeSection === section.id;

          // Direct link (no children)
          if (section.link) {
            return (
              <Link key={section.id} to={section.link} onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm no-underline transition-all duration-150 ${
                  sectionActive ? 'bg-gold/10 text-gold border border-gold/20' : 'text-text-dim hover:text-text hover:bg-bg-hover border border-transparent'
                }`}>
                <span className={sectionActive ? 'text-gold' : 'text-text-dim'}>{section.icon}</span>
                <span className="font-medium">{section.label}</span>
                {sectionActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-gold" />}
              </Link>
            );
          }

          // Collapsible section
          return (
            <div key={section.id}>
              <button
                onClick={() => toggleSection(section.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-150 ${
                  sectionActive ? 'text-gold' : 'text-text-dim hover:text-text hover:bg-bg-hover'
                }`}
              >
                <span className={sectionActive ? 'text-gold' : 'text-text-dim'}>{section.icon}</span>
                <span className="font-medium flex-1 text-left">{section.label}</span>
                {sectionActive && !isOpen && <span className="w-1.5 h-1.5 rounded-full bg-gold mr-1" />}
                {chevron(isOpen)}
              </button>

              {isOpen && (
                <div className="ml-[26px] pl-3 border-l border-bg-hover/60 mt-0.5 mb-1 space-y-0.5" style={{ animation: 'expandIn 150ms ease-out' }}>
                  {section.children.map((child, idx) => {
                    if (child.divider) {
                      return (
                        <div key={`d-${idx}`} className="text-[10px] uppercase tracking-wider text-text-dim/40 px-3 pt-2.5 pb-1 font-semibold">
                          {child.divider}
                        </div>
                      );
                    }
                    return (
                      <Link key={child.to} to={child.to} onClick={() => setMobileOpen(false)}
                        className={`block px-3 py-2.5 rounded-md text-sm no-underline transition-all duration-150 ${
                          isActive(child.to)
                            ? 'text-gold bg-gold/8 font-medium'
                            : 'text-text-dim hover:text-text hover:bg-bg-hover/50'
                        }`}>
                        {child.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Settings footer */}
      <div className="px-3 py-3 border-t border-bg-hover/50">
        <Link to="/settings" onClick={() => setMobileOpen(false)}
          className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm no-underline transition-all duration-150 ${
            location.pathname === '/settings' ? 'bg-gold/10 text-gold border border-gold/20' : 'text-text-dim hover:text-text hover:bg-bg-hover border border-transparent'
          }`}>
          {I('M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z')}
          <span className="font-medium">Settings</span>
        </Link>
      </div>

      <style>{`
        @keyframes expandIn {
          from { opacity: 0; max-height: 0; }
          to { opacity: 1; max-height: 800px; }
        }
      `}</style>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-52 h-screen bg-bg-card border-r border-bg-hover fixed left-0 top-0 z-40">
        {navContent}
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-bg-card/95 backdrop-blur-sm border-b border-bg-hover flex items-center justify-between px-4">
        <Link to="/" className="no-underline">
          <span className="font-display text-gold text-2xl font-bold">enPassant</span>
        </Link>
        <button className="text-text-dim hover:text-text p-3 btn-press rounded-lg hover:bg-bg-hover transition-colors" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {mobileOpen ? (
              <path d="M6 6l12 12M6 18L18 6" />
            ) : (
              <>
                {/* Rook crenellations — 3 merlons */}
                <path d="M4 7V4h3v3h2.5V4h5v3h2.5V4h3v3" fill="none" />
                {/* Burger lines */}
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="18" x2="20" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-full sm:w-72 bg-bg-card flex flex-col shadow-2xl" style={{ animation: 'slideInLeft 200ms ease-out' }}>
            {navContent}
          </aside>
        </div>
      )}

      <style>{`
        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}
