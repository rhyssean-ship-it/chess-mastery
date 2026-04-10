import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const I = (d) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-[18px] h-[18px]"><path d={d} strokeLinecap="round" strokeLinejoin="round" /></svg>;

const sections = [
  { id: 'daily', label: 'Daily', icon: I('M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5'),
    link: '/' },
  { id: 'openings', label: 'Openings', icon: I('M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25'),
    children: [
      { to: '/openings', label: 'Library' },
      { to: '/opening-traps', label: 'Traps' },
      { to: '/move-order', label: 'Move Order Quiz' },
      { to: '/repertoire', label: 'Repertoire Builder' },
    ]},
  { id: 'tactics', label: 'Tactics', icon: I('M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z'),
    children: [
      { to: '/tactics', label: 'Puzzle Queue' },
      { to: '/calculation', label: 'Calculation' },
      { to: '/visualisation', label: 'Visualisation' },
    ]},
  { id: 'middlegame', label: 'Middlegame', icon: I('M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z'),
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
  { id: 'tools', label: 'Tools', icon: I('M11.42 15.17l-5.658 3.286a.893.893 0 01-1.298-.949l1.08-6.305L.825 6.657a.893.893 0 01.494-1.524l6.328-.92L10.47.37a.893.893 0 011.061 0l2.822 3.843 6.329.92a.893.893 0 01.494 1.524l-4.72 4.545 1.08 6.305a.893.893 0 01-1.299.949l-5.658-3.286z'),
    children: [
      { to: '/game-review', label: 'Game Review' },
      { to: '/flashcards', label: 'Concept Cards' },
      { to: '/glossary', label: 'Glossary' },
      { to: '/weakness', label: 'Weakness Analyzer' },
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
          <div className="font-display text-gold text-lg font-bold tracking-wide">enPassant</div>
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
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-base no-underline transition-all duration-150 ${
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
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-base transition-all duration-150 ${
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
                      className={`block px-3 py-1.5 rounded-md text-sm no-underline transition-all duration-150 ${
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
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-bg-card/95 backdrop-blur-sm border-b border-bg-hover flex items-center justify-between px-4">
        <Link to="/" className="no-underline">
          <span className="font-display text-gold text-base font-bold">enPassant</span>
        </Link>
        <button className="text-text-dim hover:text-text p-2 btn-press rounded-lg hover:bg-bg-hover transition-colors" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {mobileOpen ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-bg-card flex flex-col shadow-2xl" style={{ animation: 'slideInLeft 200ms ease-out' }}>
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
