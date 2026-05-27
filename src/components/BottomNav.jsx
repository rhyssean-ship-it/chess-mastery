import { Link, useLocation } from 'react-router-dom';
import { sectionFor } from '../services/activityTracker';

const TABS = [
  {
    id: 'home', to: '/', label: 'Home',
    icon: 'M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25',
  },
  {
    id: 'learn', to: '/learn', label: 'Learn',
    icon: 'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25',
  },
  {
    id: 'play', to: '/play', label: 'Play',
    icon: 'M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z',
  },
  {
    id: 'train', to: '/train', label: 'Train',
    icon: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z',
  },
  {
    id: 'profile', to: '/profile', label: 'Profile',
    icon: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z',
  },
];

export default function BottomNav() {
  const location = useLocation();
  const active = sectionFor(location.pathname);

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-bg-card/95 backdrop-blur-md border-t border-bg-hover"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      role="navigation"
      aria-label="Primary"
    >
      <div className="flex justify-around items-stretch h-14">
        {TABS.map(tab => {
          const isActive = active === tab.id;
          return (
            <Link
              key={tab.id}
              to={tab.to}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 no-underline transition-colors duration-150 ${
                isActive ? 'text-gold' : 'text-text-dim hover:text-text'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isActive ? 2 : 1.5} className="w-6 h-6">
                <path d={tab.icon} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className={`text-[10px] ${isActive ? 'font-semibold' : ''}`}>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
