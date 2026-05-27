// Spaced-repetition scheduling for opening drills.

const STORE_KEY = 'chess-mastery:repertoireSRS';
const DAY = 24 * 60 * 60 * 1000;

function load() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch { return {}; }
}
function save(s) { localStorage.setItem(STORE_KEY, JSON.stringify(s)); }

function entryId(openingId, side) { return `${openingId}:${side}`; }

export function getEntry(openingId, side) {
  const s = load();
  return s[entryId(openingId, side)] || null;
}

// Record a drill attempt. accuracy 0..1.
// SM-2-like: success ≥ 0.85 extends interval, otherwise reset to 1 day.
export function recordDrill(openingId, side, accuracy) {
  const s = load();
  const key = entryId(openingId, side);
  const prev = s[key] || { interval: 1, ease: 2.5, reps: 0, attempts: 0, totalAccuracy: 0 };
  const success = accuracy >= 0.85;
  const next = {
    ...prev,
    attempts: prev.attempts + 1,
    totalAccuracy: prev.totalAccuracy + accuracy,
    lastAccuracy: accuracy,
    lastReview: Date.now(),
  };
  if (success) {
    next.reps = prev.reps + 1;
    next.ease = Math.max(1.3, prev.ease + 0.1 - (1 - accuracy) * 0.5);
    next.interval = prev.reps === 0 ? 1 : prev.reps === 1 ? 3 : Math.round(prev.interval * next.ease);
  } else {
    next.reps = 0;
    next.interval = 1;
  }
  next.nextReview = Date.now() + next.interval * DAY;
  s[key] = next;
  save(s);
  return next;
}

// All openings the user has ever drilled.
export function listTracked() {
  const s = load();
  return Object.entries(s).map(([key, v]) => {
    const [openingId, side] = key.split(':');
    return { openingId, side, ...v };
  });
}

// Openings that are due now.
export function listDue() {
  const now = Date.now();
  return listTracked().filter(e => e.nextReview <= now);
}

// Pick the next opening to drill: prefer due, otherwise oldest.
export function pickNext() {
  const tracked = listTracked();
  if (tracked.length === 0) return null;
  const now = Date.now();
  const due = tracked.filter(e => e.nextReview <= now);
  if (due.length > 0) {
    due.sort((a, b) => a.nextReview - b.nextReview);
    return due[0];
  }
  tracked.sort((a, b) => a.nextReview - b.nextReview);
  return tracked[0];
}
