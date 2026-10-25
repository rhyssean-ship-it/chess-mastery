// Human-style opponents from 400 to 1200. Stockfish scores the top candidate moves; the persona
// then picks like a club player of its rating would: usually a decent move (sampled with a
// rating-scaled temperature, nudged by its style), sometimes a "didn't look" move chosen on
// surface features alone (grab material, give check, follow a habit), which is how pieces get hung.
// Ratings are estimates, not calibrated against real players.

import { Chess } from 'chess.js';

// Three per rating step. Styles and habits are deliberately not shown in the UI: working out
// how an opponent plays is part of the exercise.
const ROSTER = [
  [400,  ['pip',    'Pip',    'aggressive',  ['queenOut']],   ['sam',    'Sam',    'materialist', ['pawnGrab']],  ['robin',  'Robin',  'defensive',  ['edgePawns']]],
  [500,  ['jules',  'Jules',  'aggressive',  ['checks']],     ['casey',  'Casey',  'balanced',    ['knights']],   ['rowan',  'Rowan',  'materialist', ['queenOut']]],
  [600,  ['alex',   'Alex',   'positional',  ['noCastle']],   ['sky',    'Sky',    'aggressive',  ['pawnStorm']], ['drew',   'Drew',   'defensive',  ['trader']]],
  [700,  ['morgan', 'Morgan', 'materialist', ['trader']],     ['riley',  'Riley',  'aggressive',  ['noCastle']],  ['ellis',  'Ellis',  'positional', ['edgePawns']]],
  [800,  ['kit',    'Kit',    'balanced',    ['checks']],     ['avery',  'Avery',  'defensive',   ['knights']],   ['finley', 'Finley', 'aggressive', ['pawnGrab']]],
  [900,  ['ash',    'Ash',    'positional',  ['trader']],     ['jordan', 'Jordan', 'materialist', ['pawnStorm']], ['hayden', 'Hayden', 'aggressive', []]],
  [1000, ['quinn',  'Quinn',  'balanced',    []],             ['jesse',  'Jesse',  'aggressive',  ['checks']],    ['marley', 'Marley', 'defensive',  ['trader']]],
  [1100, ['nico',   'Nico',   'positional',  ['knights']],    ['parker', 'Parker', 'aggressive',  ['pawnStorm']], ['reese',  'Reese',  'materialist', []]],
  [1200, ['sage',   'Sage',   'positional',  []],             ['taylor', 'Taylor', 'aggressive',  []],            ['harper', 'Harper', 'balanced',   ['trader']]],
];

export const PERSONAS = ROSTER.flatMap(([elo, ...ps]) =>
  ps.map(([id, name, style, habits]) => ({ id, name, elo, style, habits })));

export const PERSONA_LEVELS = ROSTER.map(([elo]) => elo);

export function personaById(id) {
  return PERSONAS.find(p => p.id === id) || null;
}

export function nearestLevel(elo) {
  return PERSONA_LEVELS.reduce((best, l) => (Math.abs(l - elo) < Math.abs(best - elo) ? l : best), PERSONA_LEVELS[0]);
}

// A random one of the three at the level nearest `elo`.
export function nearestPersona(elo, rng = Math.random) {
  const pool = PERSONAS.filter(p => p.elo === nearestLevel(elo));
  return pool[Math.floor(rng() * pool.length)];
}

// The ladder: someone you haven't beaten yet at your level, else the next level up (the top level
// repeats once everything is beaten). Random among the candidates so it isn't predictable.
export function nextLadderPersona(rating, beatenIds, rng = Math.random) {
  const start = PERSONA_LEVELS.indexOf(nearestLevel(rating));
  for (let i = start; i < PERSONA_LEVELS.length; i++) {
    const pool = PERSONAS.filter(p => p.elo === PERSONA_LEVELS[i] && !beatenIds.has(p.id));
    if (pool.length) return pool[Math.floor(rng() * pool.length)];
  }
  return nearestPersona(rating, rng);
}

const lerp = (a, b, t) => a + (b - a) * t;

// Everything that scales with rating, interpolated linearly from 400 to 1200.
export function profileFor(elo) {
  const t = Math.max(0, Math.min(1, (elo - 400) / 800));
  return {
    temperature: lerp(250, 60, t),   // cp: how far below best a move can be and still get picked
    careless: lerp(0.22, 0.04, t),   // chance a move is chosen without looking at the reply
    mateInOne: lerp(0.6, 0.97, t),   // chance of spotting a mate in one
    seesRecapture: lerp(0.2, 0.7, t), // in a careless move, chance of noticing the piece can be taken back
    depth: Math.round(lerp(6, 9, t)),
  };
}

const VALUE = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };

function fullmove(fen) {
  return parseInt(fen.split(' ')[5]) || 1;
}

// Style and habit bonus in centipawns. Shared by both ways of choosing.
function flavour(v, persona, fen) {
  let cp = 0;
  const check = /[+#]/.test(v.san);
  const castle = v.san.startsWith('O-O');
  const minorDev = (v.piece === 'n' || v.piece === 'b') && (v.from[1] === '1' || v.from[1] === '8');
  switch (persona.style) {
    case 'aggressive':  cp += (check ? 40 : 0) + (v.captured ? 25 : 0); break;
    case 'materialist': cp += v.captured ? 20 + VALUE[v.captured] * 10 : 0; break;
    case 'defensive':   cp += (castle ? 40 : 0) + (v.captured ? -15 : 10) + (check ? -10 : 0); break;
    case 'positional':  cp += (castle ? 50 : 0) + (minorDev ? 25 : 0); break;
  }
  const opening = fullmove(fen) <= 10;
  for (const h of persona.habits) {
    if (h === 'queenOut' && opening && v.piece === 'q') cp += 60;
    if (h === 'pawnGrab' && v.captured === 'p') cp += 50;
    if (h === 'edgePawns' && v.piece === 'p' && (v.from[0] === 'a' || v.from[0] === 'h')) cp += 45;
    if (h === 'noCastle' && castle) cp -= 80;
    if (h === 'trader' && v.captured && VALUE[v.captured] === VALUE[v.piece]) cp += 50;
    if (h === 'checks' && check) cp += 50;
    if (h === 'knights' && v.piece === 'n') cp += 35;
    if (h === 'pawnStorm' && !opening && v.piece === 'p') cp += 40;
  }
  return cp;
}

// Mover's-view score, with mates folded into a finite range so sampling still works.
function lineScore(ln) {
  if (ln.mate != null) return ln.mate > 0 ? (ln.mate === 1 ? 1500 : 1000) : -1500;
  return Math.max(-1500, Math.min(1500, ln.scoreCp ?? 0));
}

// A move picked on what's visible: material won, checks, habits. Doesn't ask what the
// opponent does next, except sometimes noticing a recapture.
function carelessMove(fen, persona, prof, rng) {
  const g = new Chess(fen);
  const them = g.turn() === 'w' ? 'b' : 'w';
  let best = null;
  for (const v of g.moves({ verbose: true })) {
    let cp = (v.captured ? VALUE[v.captured] * 100 : 0) + (/[+#]/.test(v.san) ? 30 : 0);
    if (v.captured && rng() < prof.seesRecapture) {
      const after = new Chess(fen);
      after.move(v.san);
      if (after.isAttacked(v.to, them)) cp -= VALUE[v.piece] * 100;
    }
    cp += flavour(v, persona, fen) + rng() * 60;
    if (!best || cp > best.cp) best = { uci: v.from + v.to + (v.promotion || ''), cp };
  }
  return best?.uci || null;
}

// lines: Stockfish MultiPV output for `fen` [{ pv, scoreCp, mate }], best first.
export function chooseHumanMove(fen, lines, persona, rng = Math.random) {
  const prof = profileFor(persona.elo);
  const g = new Chess(fen);
  const cands = [];
  for (const ln of lines || []) {
    const uci = ln.pv?.[0];
    if (!uci) continue;
    let v = null;
    try { v = new Chess(fen).move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] || undefined }); } catch { /* skip */ }
    if (v) cands.push({ uci, v, ln, score: lineScore(ln) });
  }
  if (!cands.length) {
    const any = g.moves({ verbose: true })[0];
    return any ? any.from + any.to + (any.promotion || '') : null;
  }

  // Mate in one: found most of the time, more often the stronger the persona.
  const mate = cands.find(c => c.ln.mate === 1);
  if (mate && rng() < prof.mateInOne) return mate.uci;

  if (rng() < prof.careless) {
    const m = carelessMove(fen, persona, prof, rng);
    if (m) return m;
  }

  // Softmax over engine scores (minus an unseen mate in one) plus the persona's flavour.
  const pool = cands.filter(c => !(c.ln.mate === 1));
  const use = pool.length ? pool : cands;
  const adj = use.map(c => c.score + flavour(c.v, persona, fen));
  const top = Math.max(...adj);
  const weights = adj.map(s => Math.exp((s - top) / prof.temperature));
  let r = rng() * weights.reduce((a, b) => a + b, 0);
  for (let i = 0; i < use.length; i++) {
    r -= weights[i];
    if (r <= 0) return use[i].uci;
  }
  return use[use.length - 1].uci;
}
