// Per-step accuracy for the Spy, Scan, Safe drills.
import { localDateKey } from '../utils/dateKey';

const KEY = 'chess-mastery:thinkingDrills';

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; }
}

export function drillStats() {
  const s = load();
  const blank = { played: 0, correct: 0, lastPlayed: null };
  return { spy: { ...blank, ...s.spy }, scan: { ...blank, ...s.scan }, safe: { ...blank, ...s.safe } };
}

export function recordDrill(step, correct) {
  const s = drillStats();
  s[step].played++;
  if (correct) s[step].correct++;
  const today = localDateKey();
  s[step].lastPlayed = today;
  s.days = [...new Set([...(load().days || []), today])].slice(-60); // any-step practice days
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* storage unavailable */ }
}

export function drillDays() {
  return load().days || [];
}
