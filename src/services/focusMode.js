// Focus mode: show only what moves the needle from ~500 to ~900, hide the rest of the app.
// On by default; the full app is one toggle away (Settings, the track page, section indexes).

import { useEffect, useState } from 'react';

const KEY = 'chess-mastery:focusMode';
const EVENT = 'enpassant:focusmode';

export const FOCUS_ROUTES = new Set([
  '/', '/focus', '/learn', '/train', '/play', '/profile', '/settings',
  // Learn
  '/learning-path', '/piece-values', '/checkmate-patterns', '/hanging-pieces', '/pre-move-checklist',
  '/blunder-detection', '/openings', '/endgames', '/master-games', '/glossary',
  // Play
  '/practice-play', '/play/analysis',
  // Train
  '/daily', '/puzzle-rush', '/thinking-drills', '/my-mistakes', '/endgame-drills',
  // Profile
  '/progress', '/weakness', '/profile/reviews',
]);

export function isFocusMode() {
  try { return localStorage.getItem(KEY) !== 'off'; } catch { return true; }
}

export function setFocusMode(on) {
  try { localStorage.setItem(KEY, on ? 'on' : 'off'); } catch { /* storage unavailable */ }
  window.dispatchEvent(new Event(EVENT));
}

export function inFocus(path) {
  return FOCUS_ROUTES.has(path);
}

// Re-renders when focus mode is toggled anywhere in the app.
export function useFocusMode() {
  const [on, setOn] = useState(isFocusMode);
  useEffect(() => {
    const update = () => setOn(isFocusMode());
    window.addEventListener(EVENT, update);
    return () => window.removeEventListener(EVENT, update);
  }, []);
  return on;
}
