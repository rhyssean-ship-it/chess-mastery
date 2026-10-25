// Generates today's adaptive study plan from existing localStorage signals.
//
// Inputs (all already tracked by other services):
//   - mistakes due for review (mistakeStore.dueCount)
//   - repertoire lines due (repertoireSRS.listDue)
//   - daily challenge completed today?
//   - daily calculation completed today?
//   - recent mistake themes (from listMistakes)
//   - endgame drill freshness (chess-mastery:endgameDrills)
//   - puzzle rush stats
//
// Output: ordered list of plan items with id, title, blurb, route, minutes,
// and a `done` derived from the underlying state — so refreshing the home
// page reflects what the user has actually completed today.

import { dueCount as mistakesDue, listMistakes } from './mistakeStore';
import { listDue as repertoireDue } from './repertoireSRS';
import drills from '../data/endgameDrills';
import { tallySteps, STEP_META } from './spyScanSafe';
import { drillStats } from './thinkingDrillStore';
import { blunderTrend } from './gameLog';
import { localDateKey } from '../utils/dateKey';

const STORE_KEY = 'chess-mastery:dailyPlanState';

const dateKey = localDateKey;
function loadJson(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}

// Which tactical theme appears most in recent mistakes?
function recentMistakeTheme(limit = 20) {
  const recent = listMistakes().slice(0, limit);
  if (recent.length === 0) return null;
  const counts = {};
  for (const m of recent) {
    const phase = m.context?.phase || (m.classification === 'blunder' ? 'blunder' : 'mistake');
    counts[phase] = (counts[phase] || 0) + 1;
  }
  return null; // for now we don't have theme tags on mistakes; could derive from analysis later
}

function endgameDrillToPractice() {
  const store = loadJson('chess-mastery:endgameDrills', {});
  // Pick a drill the user hasn't mastered yet, preferring beginner ones first
  const candidates = drills.filter(d => {
    const s = store[d.id];
    if (!s) return true;
    return s.consecutive < d.wins;
  });
  if (candidates.length === 0) {
    // Everything mastered — rotate through difficulty order
    const oldest = drills.slice().sort((a, b) => {
      const aT = store[a.id]?.lastResult ? 0 : 1;
      const bT = store[b.id]?.lastResult ? 0 : 1;
      return aT - bT;
    });
    return oldest[0];
  }
  // Order: not-touched first, then by lowest progress
  candidates.sort((a, b) => {
    const aS = store[a.id]?.consecutive || 0;
    const bS = store[b.id]?.consecutive || 0;
    return aS - bS;
  });
  return candidates[0];
}

// The Spy, Scan, Safe step to drill today: the one your last 10 games break down at most (same
// numbers as the Home trend card), else all saved mistakes, else the least-practised drill.
function stepToDrill() {
  const { steps } = blunderTrend();
  const recentTotal = steps.spy + steps.scan + steps.safe;
  const weakest = recentTotal
    ? Object.keys(steps).sort((a, b) => steps[b] - steps[a])[0]
    : tallySteps(listMistakes()).weakest;
  if (weakest) return { step: weakest, fromGames: true };
  const stats = drillStats();
  const score = s => (stats[s].played ? stats[s].correct / stats[s].played : -1);
  return { step: ['spy', 'scan', 'safe'].sort((a, b) => score(a) - score(b))[0], fromGames: false };
}

export function generatePlan() {
  const today = dateKey();
  const plan = [];
  const planMarkers = loadJson(STORE_KEY, {});
  const todayMarkers = planMarkers[today] || {};

  // 1. Daily Challenge (always; checks underlying store for completion)
  const dailyChallenge = loadJson('chess-mastery:daily', {});
  plan.push({
    id: 'daily-challenge',
    title: 'Daily Challenge',
    blurb: 'A curated tactical puzzle',
    route: '/daily',
    minutes: 3,
    done: dailyChallenge?.lastCompleted === today,
  });

  // 2. Daily Calculation (always)
  const dailyCalc = loadJson('chess-mastery:dailyCalculation', {});
  plan.push({
    id: 'daily-calc',
    title: 'Daily Calculation',
    blurb: '5-min clock · one position',
    route: '/daily-calculation',
    minutes: 5,
    done: dailyCalc?.lastSolved === today,
  });

  // 3. Review due mistakes (only if any)
  const mDue = mistakesDue();
  const reviewedToday = !!todayMarkers['review-mistakes'];
  if (mDue > 0 || reviewedToday) {
    plan.push({
      id: 'review-mistakes',
      title: mDue > 0 ? `Review ${mDue} mistake${mDue === 1 ? '' : 's'}` : 'Review your mistakes',
      blurb: 'Re-solve blunders from your games',
      route: '/my-mistakes',
      minutes: Math.min(8, Math.max(2, Math.ceil(mDue * 0.8))),
      done: reviewedToday && mDue === 0,
    });
  }

  // 3b. Spy, Scan, Safe drill on the weakest step
  const { step, fromGames } = stepToDrill();
  plan.push({
    id: 'thinking-drill',
    title: `${STEP_META[step].label} drill`,
    blurb: fromGames ? `Your games break down most at ${STEP_META[step].label}` : 'Build the Spy, Scan, Safe habit',
    route: `/thinking-drills?step=${step}`,
    minutes: 4,
    done: !!todayMarkers['thinking-drill'],
  });

  // 4. Repertoire drill (if any due)
  const rDue = repertoireDue();
  if (rDue.length > 0) {
    plan.push({
      id: 'repertoire',
      title: `Drill ${rDue.length} opening line${rDue.length === 1 ? '' : 's'}`,
      blurb: 'Spaced-repetition review of your repertoire',
      route: '/repertoire',
      minutes: Math.min(10, rDue.length * 3),
      done: false,
    });
  }

  // 5. Tactics — puzzle rush short sprint (always good)
  plan.push({
    id: 'puzzles',
    title: '20 easy tactics',
    blurb: 'Short puzzles rated 600–1000 for pattern speed',
    route: '/puzzle-rush?mode=easy',
    minutes: 5,
    done: !!todayMarkers.puzzles,
  });

  // 6. Endgame drill — rotates through the catalogue
  const drill = endgameDrillToPractice();
  if (drill) {
    const drillStore = loadJson('chess-mastery:endgameDrills', {});
    const mastered = (drillStore[drill.id]?.consecutive || 0) >= drill.wins;
    plan.push({
      id: 'endgame-drill',
      title: drill.name,
      blurb: mastered ? 'Refresh — already mastered' : drill.description.slice(0, 80) + '…',
      route: '/endgame-drills',
      minutes: 4,
      done: !!todayMarkers['endgame-drill'],
    });
  }

  // 7. One slow, coached game, then review it (marked done when its analysis finishes)
  plan.push({
    id: 'play-game',
    title: 'Coached game + review',
    blurb: 'Take your time with the Spy, Scan, Safe coach, then analyse it',
    route: '/practice-play?coach=sharp',
    minutes: 25,
    done: !!todayMarkers['play-game'],
  });

  return plan;
}

// Mark an item completed for today (used for items where we can't derive completion from state).
export function markItemDone(itemId) {
  const today = dateKey();
  const state = loadJson(STORE_KEY, {});
  state[today] = { ...(state[today] || {}), [itemId]: true };
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
}

export function totalMinutes(plan) {
  return plan.reduce((sum, p) => sum + p.minutes, 0);
}
export function completedMinutes(plan) {
  return plan.filter(p => p.done).reduce((sum, p) => sum + p.minutes, 0);
}
