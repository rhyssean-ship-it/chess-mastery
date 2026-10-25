// Builds a Spy, Scan, Safe walkthrough from the player's own saved mistakes, in the same shape as
// data/spyScanSafeGames.js so the walkthrough player can run it. Narration is generated from the
// spyScanSafe heuristics plus the engine's best move stored with each mistake.

import { Chess } from 'chess.js';
import { listMistakes } from './mistakeStore';
import { lastMoveShift, opponentThreats, forcingMoves, safetyCheck, STEP_META } from './spyScanSafe';
import { explainBestMove } from './moveExplanation';

const MAX_MOMENTS = 6;

function list(items, fmt, empty) {
  return items.length ? items.map(fmt).join('; ') : empty;
}

function buildMoment(e) {
  const g = new Chess(e.fen);
  const me = g.turn();
  const played = new Chess(e.fen).move(e.youPlayed);
  const best = e.bestMoveSan ? new Chess(e.fen).move(e.bestMoveSan) : null;
  if (!played || !best) return null;

  // Spy
  const shift = e.prevFen ? lastMoveShift(e.prevFen, e.fen).notes.map(n => n.text) : [];
  const threats = opponentThreats(e.fen, me);
  const spyText = [
    ...shift,
    threats.length
      ? `Their threats: ${list(threats.slice(0, 3), t => t.text)}. A real threat comes first.`
      : 'They had no real threat here, so you were free to look for your own chances.',
  ].join(' ');

  // Scan
  const f = forcingMoves(e.fen, me);
  const scanText = [
    `Your checks: ${list(f.checks.slice(0, 4), c => `${c.san} (${c.note})`, 'none')}.`,
    `Captures: ${list(f.captures.slice(0, 4), c => `${c.san} (${c.note})`, 'none')}.`,
    `Threats: ${list(f.threats.slice(0, 3), t => `${t.san} (${t.note})`, 'none')}.`,
  ].join(' ');

  // Safe
  const safe = safetyCheck(e.fen, e.youPlayed);
  const bestWhy = explainBestMove({ fenBefore: e.fen, bestMove: e.solution?.[0], bestMoveSan: e.bestMoveSan, bestMovePv: [] });
  const safeText = [
    safe.ok
      ? `${e.youPlayed} didn’t hang anything directly, but it wasn’t the move the position needed.`
      : `${e.youPlayed}: ${safe.issues[0].text}`,
    bestWhy ? `The engine’s move: ${bestWhy}` : `The engine’s move was ${e.bestMoveSan}.`,
  ].join(' ');

  const step = e.failedStep ? STEP_META[e.failedStep] : null;
  const from = e.context?.label ? ` (${e.context.label})` : '';
  return {
    fen: e.fen,
    lastMove: e.lastMove || null,
    orientation: me === 'w' ? 'white' : 'black',
    prompt: `From one of your games${from}. You played ${e.youPlayed} here. Run the routine and find something better.`,
    spy: {
      text: spyText,
      arrows: threats.slice(0, 2).map(t => [t.from, t.to, 'red']),
    },
    scan: {
      text: scanText,
      arrows: [...f.checks, ...f.captures.filter(c => c.verdict !== 'loses')].slice(0, 3).map(m => [m.from, m.to, 'green']),
    },
    safe: {
      text: safeText,
      arrows: [[played.from, played.to, 'red'], [best.from, best.to, 'green']],
    },
    answers: {
      [best.san]: { grade: 'best', text: `That’s the engine’s move. ${bestWhy || ''}`.trim() },
      ...(played.san !== best.san ? {
        [played.san]: {
          grade: e.classification === 'blunder' ? 'blunder' : 'risky',
          text: `That’s what you played in the game.${step ? ` The routine broke at ${step.label}: ${step.blurb.toLowerCase()}.` : ''}`,
        },
      } : {}),
    },
    fallback: `Not the engine’s choice. It preferred ${best.san}. Read the three steps to see why.`,
    gameMove: null,
    continuation: [],
    afterText: '',
  };
}

// Most recent mistakes, blunders first, one per position.
export function ownWalkthrough() {
  const picked = listMistakes()
    .filter(e => e.fen && e.youPlayed && e.bestMoveSan)
    .sort((a, b) => (b.classification === 'blunder') - (a.classification === 'blunder') || b.savedAt - a.savedAt);
  const moments = [];
  for (const e of picked) {
    if (moments.length >= MAX_MOMENTS) break;
    try { const m = buildMoment(e); if (m) moments.push(m); } catch { /* skip odd entries */ }
  }
  if (!moments.length) return null;
  return {
    id: 'your-games',
    title: 'Your own mistakes',
    subtitle: `${moments.length} positions from your analysed games`,
    orientation: moments[0].orientation,
    intro: 'The moments where your games turned. Play the move you should have found, then see what each step of the routine would have told you.',
    startMoves: [],
    moments,
    outro: 'These are the positions that cost you points. The same patterns will come back, and now you know what to look for. Analyse more games and this set refreshes itself.',
  };
}
