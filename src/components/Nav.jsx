import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const I = (d) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-[18px] h-[18px]"><path d={d} strokeLinecap="round" strokeLinejoin="round" /></svg>;

const sections = [
  // === JOURNEY ===
  { id: 'path', label: 'Learning Path', icon: I('M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6'),
    link: '/' },

  // === LEARN: FUNDAMENTALS ===
  { id: 'fundamentals', label: 'Fundamentals', icon: I('M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18'),
    children: [
      { to: '/game-phases', label: 'Game Phases' },
      { to: '/piece-values', label: 'Piece Values' },
      { to: '/notation', label: 'Board Notation' },
      { to: '/checkmate-patterns', label: 'Checkmate Patterns' },
    ]},

  // === LEARN: AVOID MISTAKES ===
  { id: 'mistakes', label: 'Avoid Mistakes', icon: I('M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z'),
    children: [
      { to: '/hanging-pieces', label: 'Hanging Pieces' },
      { to: '/pre-move-checklist', label: 'Pre-Move Checklist' },
      { to: '/common-mistakes', label: 'Common Mistakes' },
      { to: '/blunder-detection', label: 'Blunder Detection' },
    ]},

  // === CORE SKILLS ===
  { id: 'tactics', label: 'Tactics', icon: I('M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z'),
    children: [
      { to: '/daily', label: 'Daily Challenge' },
      { to: '/tactics', label: 'Puzzle Queue' },
      { to: '/calculation', label: 'Calculation' },
      { to: '/visualisation', label: 'Visualisation' },
    ]},
  { id: 'openings', label: 'Openings', icon: I('M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25'),
    children: [
      { to: '/openings', label: 'Library' },
      { to: '/opening-traps', label: 'Traps' },
      { to: '/move-order', label: 'Move Order Quiz' },
      { to: '/repertoire', label: 'Repertoire Builder' },
    ]},

  // === DEEPER KNOWLEDGE ===
  { id: 'strategy', label: 'Strategy', icon: I('M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z'),
    children: [
      { to: '/strategy', label: 'Strategy Lessons' },
      { to: '/middlegame', label: 'Plans by Structure' },
      { to: '/critical-moments', label: 'Critical Moments' },
      { to: '/pattern-recognition', label: 'Pattern Recognition' },
      { to: '/pawn-structures', label: 'Pawn Structures' },
      { to: '/master-games', label: 'Master Games' },
    ]},
  { id: 'endgames', label: 'Endgames', icon: I('M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84'),
    children: [
      { to: '/endgames', label: 'Endgame Lessons' },
      { to: '/theoretical-endgames', label: 'Key Positions' },
      { to: '/practical-endgames', label: 'Practical Puzzles' },
    ]},

  // === APPLY ===
  { id: 'play', label: 'Play', icon: I('M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z'),
    children: [
      { to: '/play', label: 'vs Computer' },
      { to: '/practice-play', label: 'Practice Play' },
    ]},

  // === TRACK & TOOLS ===
  { id: 'tools', label: 'Tools', icon: I('M11.42 15.17l-5.658 3.286a.893.893 0 01-1.298-.949l1.08-6.305L.825 6.657a.893.893 0 01.494-1.524l6.328-.92L10.47.37a.893.893 0 011.061 0l2.822 3.843 6.329.92a.893.893 0 01.494 1.524l-4.72 4.545 1.08 6.305a.893.893 0 01-1.299.949l-5.658-3.286z'),
    children: [
      { to: '/game-review', label: 'Game Review' },
      { to: '/weakness', label: 'Weakness Analyzer' },
      { to: '/flashcards', label: 'Concept Cards' },
      { to: '/glossary', label: 'Glossary' },
    ]},
  { id: 'progress', label: 'Progress', icon: I('M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625z'),
    link: '/progress' },
];

function getActiveSection(pathname) {
  for (const s of sections) {
    if (s.link && pathname === s.link) return s.id;
    if (s.children) {
      for (const c of s.children) {
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

      {/* Accordion nav */}
      <nav className="flex-1 px-3 py-1 space-y-0.5" role="navigation">
        {sections.map(section => {
          const isOpen = expanded === section.id;
          const sectionActive = activeSection === section.id;

          // Direct link (no children)
          if (section.link) {
            return (
              <Link key={section.id} to={section.link} onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base no-underline transition-all duration-150 ${
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
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-base transition-all duration-150 ${
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
                  {section.children.map(child => (
                    <Link key={child.to} to={child.to} onClick={() => setMobileOpen(false)}
                      className={`block px-3 py-2.5 rounded-md text-sm no-underline transition-all duration-150 ${
                        isActive(child.to)
                          ? 'text-gold bg-gold/8 font-medium'
                          : 'text-text-dim hover:text-text hover:bg-bg-hover/50'
                      }`}>
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Settings footer */}
      <div className="px-3 py-3 border-t border-bg-hover/50">
        <Link to="/settings" onClick={() => setMobileOpen(false)}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base no-underline transition-all duration-150 ${
            location.pathname === '/settings' ? 'bg-gold/10 text-gold border border-gold/20' : 'text-text-dim hover:text-text hover:bg-bg-hover border border-transparent'
          }`}>
          {I('M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z')}
          <span className="font-medium">Settings</span>
        </Link>
      </div>

      <style>{`
        @keyframes expandIn {
          from { opacity: 0; max-height: 0; }
          to { opacity: 1; max-height: 300px; }
        }
      `}</style>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-56 h-screen bg-bg-card border-r border-bg-hover fixed left-0 top-0 z-40">
        {navContent}
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-bg-card/95 backdrop-blur-sm border-b border-bg-hover flex items-center justify-between px-4">
        <Link to="/" className="no-underline">
          <span className="font-display text-gold text-2xl font-bold">enPassant</span>
        </Link>
        <button className="text-text-dim hover:text-text p-3 btn-press rounded-lg hover:bg-bg-hover transition-colors" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {mobileOpen ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
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
