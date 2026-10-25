// Tracks the user's most recent activity (route + label) for the Home dashboard's "continue" card.
import { localDateKey, localDateKeyDaysAgo } from '../utils/dateKey';

const KEY = 'chess-mastery:lastActivity';
const STREAK_KEY = 'chess-mastery:dayStreak';
const ROUTE_HISTORY_KEY = 'chess-mastery:routeHistory';

const ROUTE_LABELS = {
  '/': 'Home',
  '/learn': 'Learn',
  '/play': 'Play',
  '/train': 'Train',
  '/profile': 'Profile',
  '/learning-path': 'Learning Path',
  '/daily': 'Daily Challenge',
  '/daily-calculation': 'Daily Calculation',
  '/tactics': 'Tactics Queue',
  '/puzzle-rush': 'Puzzle Rush',
  '/pattern-dojo': 'Pattern Dojo',
  '/calculation': 'Calculation Trainer',
  '/visualisation': 'Visualisation Drills',
  '/blindfold-ladder': 'Blindfold Ladder',
  '/my-mistakes': 'My Mistakes',
  '/openings': 'Openings Library',
  '/opening-traps': 'Opening Traps',
  '/move-order': 'Move-order Quiz',
  '/repertoire': 'Repertoire Builder',
  '/strategy': 'Strategy Lessons',
  '/middlegame': 'Middlegame Plans',
  '/critical-moments': 'Critical Moments',
  '/pattern-recognition': 'Pattern Recognition',
  '/master-games': 'Annotated Games',
  '/pawn-structures': 'Pawn Structures',
  '/endgames': 'Endgame Lessons',
  '/theoretical-endgames': 'Theoretical Endgames',
  '/practical-endgames': 'Practical Endgames',
  '/endgame-drills': 'Endgame Drills',
  '/game-review': 'Game Review',
  '/weakness': 'Weakness Analyzer',
  '/rating-estimator': 'Rating Estimator',
  '/flashcards': 'Concept Flashcards',
  '/glossary': 'Glossary',
  '/notation': 'Board Notation',
  '/checkmate-patterns': 'Checkmate Patterns',
  '/piece-values': 'Piece Values',
  '/hanging-pieces': 'Hanging Pieces',
  '/common-mistakes': 'Common Mistakes',
  '/pre-move-checklist': 'Spy, Scan, Safe',
  '/thinking-drills': 'Spy, Scan, Safe drills',
  '/focus': 'Your 500 → 900 track',
  '/game-phases': 'Game Phases',
  '/blunder-detection': 'Blunder Detection',
  '/practice-play': 'Practice Play',
  '/progress': 'Progress Dashboard',
  '/profile/rating': 'Your Rating',
  '/settings': 'Settings',
};

function labelFor(path) {
  if (ROUTE_LABELS[path]) return ROUTE_LABELS[path];
  // Match dynamic routes (e.g. /master-games/:id)
  for (const base of Object.keys(ROUTE_LABELS)) {
    if (base !== '/' && path.startsWith(base + '/')) return ROUTE_LABELS[base];
  }
  return null;
}

// Section that the route belongs to — used to highlight bottom-nav tabs.
export function sectionFor(path) {
  if (path === '/' || path === '') return 'home';
  if (path.startsWith('/play') || path.startsWith('/practice-play') || path.startsWith('/game-review') || path.startsWith('/lab')) return 'play';
  if (
    path.startsWith('/learn') || path.startsWith('/learning-path') || path.startsWith('/focus') ||
    path.startsWith('/openings') || path.startsWith('/opening-traps') || path.startsWith('/move-order') || path.startsWith('/repertoire') ||
    path.startsWith('/strategy') || path.startsWith('/middlegame') || path.startsWith('/critical-moments') ||
    path.startsWith('/pattern-recognition') || path.startsWith('/master-games') || path.startsWith('/pawn-structures') ||
    path.startsWith('/endgames') || path.startsWith('/theoretical-endgames') || path.startsWith('/practical-endgames') ||
    path.startsWith('/notation') || path.startsWith('/checkmate-patterns') || path.startsWith('/piece-values') ||
    path.startsWith('/hanging-pieces') || path.startsWith('/common-mistakes') || path.startsWith('/pre-move-checklist') ||
    path.startsWith('/game-phases') || path.startsWith('/blunder-detection') ||
    path.startsWith('/flashcards') || path.startsWith('/glossary')
  ) return 'learn';
  if (
    path.startsWith('/train') || path.startsWith('/daily') ||
    path.startsWith('/tactics') || path.startsWith('/puzzle-rush') || path.startsWith('/pattern-dojo') ||
    path.startsWith('/calculation') || path.startsWith('/visualisation') || path.startsWith('/blindfold-ladder') ||
    path.startsWith('/my-mistakes') || path.startsWith('/endgame-drills') || path.startsWith('/thinking-drills')
  ) return 'train';
  if (
    path.startsWith('/profile') || path.startsWith('/progress') || path.startsWith('/weakness') ||
    path.startsWith('/rating-estimator') || path.startsWith('/settings')
  ) return 'profile';
  return 'learn';
}

function load() { try { return JSON.parse(localStorage.getItem(KEY)) || null; } catch { return null; } }
function save(s) { localStorage.setItem(KEY, JSON.stringify(s)); }

// Routes that are not worth resuming (transient or section overviews).
const SKIP_ROUTES = new Set(['/', '/learn', '/train', '/play', '/profile', '/settings', '/play/analysis']);

export function recordVisit(path) {
  if (!path || SKIP_ROUTES.has(path)) return;
  const label = labelFor(path);
  if (!label) return;
  save({ path, label, at: Date.now() });
  // Push onto rolling route history
  try {
    const history = JSON.parse(localStorage.getItem(ROUTE_HISTORY_KEY) || '[]');
    if (history[0]?.path !== path) {
      history.unshift({ path, label, at: Date.now() });
      localStorage.setItem(ROUTE_HISTORY_KEY, JSON.stringify(history.slice(0, 8)));
    }
  } catch { /* ignore */ }
  // Update day streak
  updateStreak();
}

export function lastActivity() { return load(); }

export function recentRoutes() {
  try { return JSON.parse(localStorage.getItem(ROUTE_HISTORY_KEY) || '[]'); } catch { return []; }
}

const dateKey = localDateKey;

function updateStreak() {
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    const s = raw ? JSON.parse(raw) : { lastDay: null, streak: 0 };
    const today = dateKey();
    if (s.lastDay === today) return; // already counted today
    const yesterday = localDateKeyDaysAgo(1);
    s.streak = s.lastDay === yesterday ? s.streak + 1 : 1;
    s.lastDay = today;
    localStorage.setItem(STREAK_KEY, JSON.stringify(s));
  } catch { /* ignore */ }
}

export function dayStreak() {
  try {
    const s = JSON.parse(localStorage.getItem(STREAK_KEY) || '{}');
    if (!s.lastDay) return 0;
    const today = dateKey();
    const yesterday = localDateKeyDaysAgo(1);
    if (s.lastDay === today || s.lastDay === yesterday) return s.streak || 0;
    return 0;
  } catch { return 0; }
}

export { labelFor };
