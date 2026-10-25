// Spy, Scan, Safe — the app's one thinking routine, run every move:
//   Spy:  what are they doing? (what their last move changed, what they'd play next)
//   Scan: what's forcing? Checks, captures, threats — theirs first, then yours.
//   Safe: is my move OK? Defended where it lands, nothing left hanging, nothing new allowed.
//
// Pure chess.js heuristics (no engine) shared by the Learn walkthrough, the Practice Play
// coach, Game Analysis mistake tagging and the Train drills.

import { Chess } from 'chess.js';

export const PIECE_VALUE = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 100 };
const PIECE_NAME = { p: 'pawn', n: 'knight', b: 'bishop', r: 'rook', q: 'queen', k: 'king' };
const FILES = 'abcdefgh';
const ALL_SQUARES = [];
for (let r = 1; r <= 8; r++) for (let f = 0; f < 8; f++) ALL_SQUARES.push(FILES[f] + r);

export const STEPS = [
  {
    id: 'spy',
    label: 'Spy',
    title: 'What are they doing?',
    prompts: [
      { key: 'shift', label: 'Shift', text: 'What did their last move attack, stop defending, or open up?' },
      { key: 'pass', label: 'Pass', text: 'If it were their move again, what would they play?' },
      { key: 'targets', label: 'Targets', text: 'What are they aiming at — your king, your loose pieces, or where their pawns point?' },
    ],
    rule: 'If they have a real threat, deal with it first.',
  },
  {
    id: 'scan',
    label: 'Scan',
    title: 'What’s forcing?',
    prompts: [
      { key: 'checks', label: 'Checks', text: 'Every one, even the silly ones.' },
      { key: 'captures', label: 'Captures', text: 'Count attackers against defenders, and spot loose pieces.' },
      { key: 'threats', label: 'Threats', text: 'Forks, pins, skewers, mate threats.' },
    ],
    rule: 'Check both sides, theirs first. For each forcing move ask “and then what?” one reply deeper.',
  },
  {
    id: 'safe',
    label: 'Safe',
    title: 'Is my move OK?',
    prompts: [
      { key: 'landing', label: 'Landing', text: 'Is it defended where it lands?' },
      { key: 'behind', label: 'Behind', text: 'Does moving it leave anything else hanging?' },
      { key: 'allows', label: 'Allows', text: 'Does it allow a check or capture I haven’t looked at?' },
    ],
    rule: 'Run it before you let go of the piece.',
  },
];

export const STEP_META = {
  spy: { label: 'Spy', color: 'text-amber', bg: 'bg-amber/10', blurb: 'Missed what they were threatening' },
  scan: { label: 'Scan', color: 'text-gold', bg: 'bg-gold/10', blurb: 'Missed a check, capture or tactic' },
  safe: { label: 'Safe', color: 'text-incorrect', bg: 'bg-incorrect/10', blurb: 'Your move hung something or allowed a tactic' },
};

export function pieceName(type) { return PIECE_NAME[type] || 'piece'; }
function other(color) { return color === 'w' ? 'b' : 'w'; }
function sqLabel(sq) { return sq; }

// Same position with the other side to move — the "Pass" question. Returns null when the side
// to move is in check (a null move would be illegal and chess.js rejects it).
export function nullMoveFen(fen) {
  const g = new Chess(fen);
  if (g.inCheck()) return null;
  const parts = fen.split(' ');
  parts[1] = parts[1] === 'w' ? 'b' : 'w';
  parts[3] = '-';
  try { return new Chess(parts.join(' ')).fen(); } catch { return null; }
}

// Position as seen with `color` to move (the original FEN when it already is).
function asMover(fen, color) {
  if (fen.split(' ')[1] === color) return fen;
  return nullMoveFen(fen);
}

function piecesOf(g, color) {
  const out = [];
  for (const sq of ALL_SQUARES) {
    const p = g.get(sq);
    if (p && p.color === color) out.push({ square: sq, type: p.type, color });
  }
  return out;
}

// Attack map for one square: who hits it from each side.
function contest(g, square, ownerColor) {
  const attackers = g.attackers(square, other(ownerColor));
  const defenders = g.attackers(square, ownerColor);
  return { attackers, defenders };
}

function cheapest(g, squares) {
  let best = null;
  for (const s of squares) {
    const p = g.get(s);
    if (p && (!best || PIECE_VALUE[p.type] < PIECE_VALUE[best.type])) best = { square: s, type: p.type };
  }
  return best;
}

// Pieces of `color` that are attacked and either undefended or attacked by something cheaper.
// `loose` = undefended but not currently attacked (loose pieces drop off).
export function pieceSafety(fen, color) {
  const g = new Chess(fen);
  const hanging = [];
  const loose = [];
  for (const p of piecesOf(g, color)) {
    if (p.type === 'k') continue;
    const { attackers, defenders } = contest(g, p.square, color);
    if (attackers.length > 0) {
      const low = cheapest(g, attackers);
      if (defenders.length === 0 || PIECE_VALUE[low.type] < PIECE_VALUE[p.type] || attackers.length > defenders.length) {
        hanging.push({ ...p, attackers, defenders, by: low });
      }
    } else if (defenders.length === 0 && p.type !== 'p') {
      loose.push({ ...p });
    }
  }
  hanging.sort((a, b) => PIECE_VALUE[b.type] - PIECE_VALUE[a.type]);
  return { hanging, loose };
}

// Mate-in-one moves for the side to move.
function matesInOne(g) {
  const mates = [];
  for (const m of g.moves({ verbose: true })) {
    if (!m.san.includes('#')) continue;
    mates.push(m);
  }
  return mates;
}

// Squares the piece on `square` attacks (works for either colour), from piece geometry so it
// doesn't need move generation.
const KNIGHT_STEPS = [[1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1], [-1, 2]];
const KING_STEPS = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
function attacksFrom(g, square) {
  const p = g.get(square);
  if (!p) return [];
  const f0 = FILES.indexOf(square[0]);
  const r0 = Number(square[1]);
  const on = (f, r) => f >= 0 && f < 8 && r >= 1 && r <= 8;
  const out = [];
  if (p.type === 'p') {
    const dr = p.color === 'w' ? 1 : -1;
    for (const df of [-1, 1]) if (on(f0 + df, r0 + dr)) out.push(FILES[f0 + df] + (r0 + dr));
    return out;
  }
  if (p.type === 'n' || p.type === 'k') {
    for (const [df, dr] of p.type === 'n' ? KNIGHT_STEPS : KING_STEPS) if (on(f0 + df, r0 + dr)) out.push(FILES[f0 + df] + (r0 + dr));
    return out;
  }
  const dirs = [];
  if (p.type !== 'b') dirs.push([1, 0], [-1, 0], [0, 1], [0, -1]);
  if (p.type !== 'r') dirs.push([1, 1], [1, -1], [-1, 1], [-1, -1]);
  for (const [df, dr] of dirs) {
    let f = f0 + df, r = r0 + dr;
    while (on(f, r)) {
      const s = FILES[f] + r;
      out.push(s);
      if (g.get(s)) break;
      f += df; r += dr;
    }
  }
  return out;
}

// Enemy pieces a just-moved piece now hits that are worth winning (king, undefended, or worth more).
function valuableTargets(g, square) {
  const p = g.get(square);
  if (!p) return [];
  const out = [];
  for (const s of attacksFrom(g, square)) {
    const t = g.get(s);
    if (!t || t.color === p.color) continue;
    const defended = g.attackers(s, t.color).length > 0;
    if (t.type === 'k' || !defended || PIECE_VALUE[t.type] > PIECE_VALUE[p.type]) out.push({ square: s, type: t.type });
  }
  return out;
}

// Pin / skewer along the line the moved slider now controls.
function lineTactic(g, square) {
  const p = g.get(square);
  if (!p || !['b', 'r', 'q'].includes(p.type)) return null;
  const dirs = [];
  if (p.type !== 'b') dirs.push([1, 0], [-1, 0], [0, 1], [0, -1]);
  if (p.type !== 'r') dirs.push([1, 1], [1, -1], [-1, 1], [-1, -1]);
  const f0 = FILES.indexOf(square[0]);
  const r0 = Number(square[1]);
  for (const [df, dr] of dirs) {
    const hits = [];
    let f = f0 + df, r = r0 + dr;
    while (f >= 0 && f < 8 && r >= 1 && r <= 8 && hits.length < 2) {
      const s = FILES[f] + r;
      const t = g.get(s);
      if (t) {
        if (t.color === p.color) break;
        hits.push({ square: s, type: t.type });
      }
      f += df; r += dr;
    }
    if (hits.length < 2) continue;
    const [front, back] = hits;
    if (front.type === 'k' || front.type === 'p') continue; // checks are counted elsewhere; pawn pins are noise
    const fv = PIECE_VALUE[front.type], bv = PIECE_VALUE[back.type];
    if (bv > fv && bv > PIECE_VALUE[p.type] - 1) return { kind: 'pin', front, back };
    if (fv > bv && fv > PIECE_VALUE[p.type] && back.type !== 'p') return { kind: 'skewer', front, back };
  }
  return null;
}

// Capture SEE-lite, read off the attack map (no move generation): an undefended target or a
// cheaper attacker wins material. `g` is the position AFTER the capture.
function captureVerdict(g, m) {
  const tv = PIECE_VALUE[m.captured];
  const av = PIECE_VALUE[m.piece];
  // The king can only recapture on an undefended square.
  const defended = g.attackers(m.to, m.color).length > 0;
  const recapturers = g.attackers(m.to, other(m.color)).filter(sq => !(defended && g.get(sq)?.type === 'k'));
  if (recapturers.length === 0) return { verdict: 'wins', reply: null };
  const low = cheapest(g, recapturers);
  const reply = `${low.type === 'p' ? low.square[0] : low.type.toUpperCase()}x${m.to}`;
  if (tv > av) return { verdict: 'wins', reply };
  if (tv === av) return { verdict: 'trade', reply };
  return { verdict: 'loses', reply };
}

// "And then what?" — the opponent's most forcing reply. `g` is the position after the move.
function bestReply(g) {
  if (g.isCheckmate()) return null;
  const replies = g.moves({ verbose: true });
  const mate = replies.find(r => r.san.includes('#'));
  if (mate) return { san: mate.san, why: 'mates' };
  const caps = replies.filter(r => r.captured).sort((a, b) => PIECE_VALUE[b.captured] - PIECE_VALUE[a.captured]);
  if (caps.length) return { san: caps[0].san, why: `takes the ${pieceName(caps[0].captured)}` };
  const chk = replies.find(r => r.san.includes('+'));
  if (chk) return { san: chk.san, why: 'checks' };
  return null;
}

function kingZone(g, color) {
  for (const row of g.board()) for (const sq of row) {
    if (sq && sq.type === 'k' && sq.color === color) {
      const f0 = FILES.indexOf(sq.square[0]), r0 = Number(sq.square[1]);
      const zone = [];
      for (let df = -1; df <= 1; df++) for (let dr = -1; dr <= 1; dr++) {
        const f = f0 + df, r = r0 + dr;
        if (f >= 0 && f < 8 && r >= 1 && r <= 8) zone.push(FILES[f] + r);
      }
      return zone;
    }
  }
  return [];
}

// Checks, captures and threats for `color` (CCT). When it isn't their move, the position is
// probed with a null move — exactly the "Pass" question. Moves are made and undone on one board
// so this stays cheap enough to run on every move.
export function forcingMoves(fen, color, { replies = true } = {}) {
  const probeFen = asMover(fen, color);
  const empty = { checks: [], captures: [], threats: [], all: [] };
  if (!probeFen) return empty;
  const g = new Chess(probeFen);
  const checks = [], captures = [], threats = [];
  const moves = g.moves({ verbose: true });
  const mateAlready = moves.some(m => m.san.includes('#'));
  const zone = kingZone(g, other(color));
  for (const m of moves) {
    const entry = { san: m.san, from: m.from, to: m.to, piece: m.piece, color: m.color, captured: m.captured || null };
    g.move({ from: m.from, to: m.to, promotion: m.promotion });
    try {
      const isCheck = m.san.includes('+') || m.san.includes('#');
      if (replies && (isCheck || m.captured)) entry.then = bestReply(g);
      if (m.san.includes('#')) { checks.push({ ...entry, mate: true, note: 'checkmate' }); continue; }
      if (isCheck) {
        const extra = valuableTargets(g, m.to).filter(t => t.type !== 'k' && PIECE_VALUE[t.type] >= 3);
        const note = m.captured ? `check, takes the ${pieceName(m.captured)}` : extra.length ? `check, and hits the ${pieceName(extra[0].type)} on ${extra[0].square}` : 'check';
        checks.push({ ...entry, note });
      }
      if (m.captured) {
        const { verdict, reply } = captureVerdict(g, m);
        captures.push({ ...entry, verdict, reply, note: verdict === 'wins' ? `wins the ${pieceName(m.captured)}` : verdict === 'trade' ? 'even trade' : `loses material${reply ? ` to ${reply}` : ''}` });
        continue;
      }
      if (isCheck) continue;
      // Quiet move — does it create a real threat? Mate threats are only probed for pieces that
      // now hit the enemy king's zone.
      if (!mateAlready && m.piece !== 'k' && attacksFrom(g, m.to).some(sq => zone.includes(sq))) {
        const parts = g.fen().split(' ');
        parts[1] = color; parts[3] = '-';
        let probe = null;
        try { probe = new Chess(parts.join(' ')); } catch { /* illegal probe */ }
        const hitters = probe ? piecesOf(probe, color).filter(p => attacksFrom(probe, p.square).some(sq => zone.includes(sq))) : [];
        if (hitters.some(p => probe.moves({ square: p.square, verbose: true }).some(r => r.san.includes('#')))) {
          threats.push({ ...entry, kind: 'mate', note: 'threatens mate' });
          continue;
        }
      }
      // Ignore threats from a piece that just lands en prise to something cheaper.
      const landed = contest(g, m.to, m.color);
      const lowAtt = cheapest(g, landed.attackers);
      if (lowAtt && (landed.defenders.length === 0 || PIECE_VALUE[lowAtt.type] < PIECE_VALUE[m.piece])) continue;
      const targets = valuableTargets(g, m.to).filter(t => t.type !== 'k' && PIECE_VALUE[t.type] >= 3);
      if (targets.length >= 2) {
        threats.push({ ...entry, kind: 'fork', targets, note: `forks the ${targets.slice(0, 2).map(t => `${pieceName(t.type)} on ${t.square}`).join(' and ')}` });
        continue;
      }
      if (targets.length === 1 && PIECE_VALUE[targets[0].type] > PIECE_VALUE[m.piece]) {
        threats.push({ ...entry, kind: 'attack', targets, note: `attacks the ${pieceName(targets[0].type)} on ${targets[0].square}` });
        continue;
      }
      const line = lineTactic(g, m.to);
      if (line) {
        threats.push({ ...entry, kind: line.kind, note: `${line.kind === 'pin' ? 'pins' : 'skewers'} the ${pieceName(line.front.type)} to the ${pieceName(line.back.type)}` });
      }
    } finally {
      g.undo();
    }
  }
  const rank = v => (v === 'wins' ? 0 : v === 'trade' ? 1 : 2);
  captures.sort((a, b) => rank(a.verdict) - rank(b.verdict) || PIECE_VALUE[b.captured] - PIECE_VALUE[a.captured]);
  return { checks, captures, threats, all: [...checks, ...captures, ...threats] };
}

// The real threats `color`'s opponent has right now — what Spy should find. Uses the Pass probe.
const threatCache = new Map();
export function opponentThreats(fen, color) {
  const key = `${fen}|${color}`;
  if (threatCache.has(key)) return threatCache.get(key);
  const result = computeOpponentThreats(fen, color);
  threatCache.set(key, result);
  if (threatCache.size > 200) threatCache.delete(threatCache.keys().next().value);
  return result;
}

function computeOpponentThreats(fen, color) {
  const opp = other(color);
  const { checks, captures, threats } = forcingMoves(fen, opp, { replies: false });
  const real = [];
  for (const c of checks) if (c.mate) real.push({ ...c, severity: 3, text: `${c.san} is checkmate` });
  for (const c of captures) if (c.verdict === 'wins') real.push({ ...c, severity: PIECE_VALUE[c.captured] >= 3 ? 2 : 1, text: `${c.san} ${c.note}` });
  for (const t of threats) if (t.kind === 'mate' || t.kind === 'fork' || t.kind === 'attack') real.push({ ...t, severity: t.kind === 'mate' ? 2 : 1, text: `${t.san} ${t.note}` });
  real.sort((a, b) => b.severity - a.severity);
  return real;
}

// Spy "Shift": what the opponent's last move changed. `fenAfter` has the player to move.
export function lastMoveShift(fenBefore, fenAfter) {
  const before = new Chess(fenBefore);
  const after = new Chess(fenAfter);
  const me = after.turn();
  const them = other(me);
  const hist = (() => {
    for (const m of before.moves({ verbose: true })) {
      const t = new Chess(fenBefore);
      t.move({ from: m.from, to: m.to, promotion: m.promotion });
      if (t.fen().split(' ').slice(0, 4).join(' ') === fenAfter.split(' ').slice(0, 4).join(' ')) return m;
    }
    return null;
  })();
  const notes = [];
  const squares = new Set();
  if (!hist) return { move: null, notes, squares: [] };

  if (after.inCheck()) notes.push({ kind: 'check', text: `${hist.san} gives check — you must deal with it.` });

  // Newly attacked pieces of mine
  for (const p of piecesOf(after, me)) {
    if (p.type === 'k') continue;
    const nowAtt = after.attackers(p.square, them);
    const prevAtt = before.get(p.square)?.color === me ? before.attackers(p.square, them) : [];
    const fresh = nowAtt.filter(s => !prevAtt.includes(s) && s !== hist.from);
    if (fresh.length === 0) continue;
    const defs = after.attackers(p.square, me);
    const low = cheapest(after, nowAtt);
    const inDanger = defs.length === 0 || PIECE_VALUE[low.type] < PIECE_VALUE[p.type] || nowAtt.length > defs.length;
    const trade = !inDanger && p.type !== 'p' && PIECE_VALUE[low.type] === PIECE_VALUE[p.type];
    if (!inDanger && !trade) continue;
    const discovered = fresh.filter(s => s !== hist.to);
    squares.add(p.square);
    const byName = discovered.length ? `the ${pieceName(after.get(discovered[0]).type)} on ${discovered[0]} (opened by the move)` : `the ${pieceName(hist.piece)}`;
    const tail = trade ? ' — defended, so it’s a trade offer' : defs.length === 0 ? ' and it isn’t defended' : '';
    notes.push({ kind: discovered.length ? 'opened' : 'attack', danger: inDanger, text: `Your ${pieceName(p.type)} on ${sqLabel(p.square)} is now attacked by ${byName}${tail}.` });
  }

  // Their pieces that lost a defender (the moved piece stopped guarding them)
  for (const p of piecesOf(after, them)) {
    if (p.type === 'k' || p.square === hist.to) continue;
    const prevDef = before.attackers(p.square, them);
    const nowDef = after.attackers(p.square, them);
    if (prevDef.includes(hist.from) && nowDef.length === 0) {
      const hitByMe = after.attackers(p.square, me).length > 0;
      if (!hitByMe) continue;
      squares.add(p.square);
      notes.push({ kind: 'undefended', text: `Their ${pieceName(p.type)} on ${p.square} is no longer defended${hitByMe ? ' — and you’re attacking it' : ''}.` });
    }
  }
  return { move: hist, notes, squares: [...squares] };
}

// Safe check for a candidate move. Compares the position after the move with before it so only
// problems the move creates are reported.
export function safetyCheck(fenBefore, move) {
  const g = new Chess(fenBefore);
  const me = g.turn();
  let m;
  try { m = g.move(move); } catch { return { ok: true, issues: [] }; }
  if (!m) return { ok: true, issues: [] };
  const fenAfter = g.fen();
  if (g.isCheckmate()) return { ok: true, issues: [], fenAfter };
  const issues = [];

  // Allows mate?
  const mates = matesInOne(g);
  if (mates.length) issues.push({ kind: 'allows', severity: 3, squares: [mates[0].to], text: `It allows ${mates[0].san} — checkmate.` });

  const beforeHang = new Set(pieceSafety(fenBefore, me).hanging.map(h => h.square));
  const afterSafety = pieceSafety(fenAfter, me);

  // Landing square
  const landed = afterSafety.hanging.find(h => h.square === m.to);
  if (landed && !(m.captured && PIECE_VALUE[m.captured] >= PIECE_VALUE[m.piece])) {
    const why = landed.defenders.length === 0 ? 'undefended' : `attacked by a ${pieceName(landed.by.type)}`;
    issues.push({ kind: 'landing', severity: PIECE_VALUE[m.piece] >= 3 ? 2 : 1, squares: [m.to], text: `Your ${pieceName(m.piece)} lands on ${m.to} ${why} — it can be taken.` });
  }

  // Left something behind
  for (const h of afterSafety.hanging) {
    if (h.square === m.to || beforeHang.has(h.square)) continue;
    issues.push({ kind: 'behind', severity: PIECE_VALUE[h.type] >= 3 ? 2 : 1, squares: [h.square], text: `Moving it leaves your ${pieceName(h.type)} on ${h.square} hanging.` });
  }

  // New forcing replies (forks / winning captures that weren't there before)
  const beforeThreats = new Set(opponentThreats(fenBefore, me).map(t => t.san));
  for (const t of opponentThreats(fenAfter, me)) {
    if (beforeThreats.has(t.san) || t.severity >= 3) continue;
    if (t.kind === 'fork') issues.push({ kind: 'allows', severity: 2, squares: [t.to], text: `It allows ${t.san}, which ${t.note}.` });
  }

  issues.sort((a, b) => b.severity - a.severity);
  return { ok: issues.length === 0, issues, fenAfter, move: m };
}

// How sharp is the position? Used to decide when the full routine should run (slow down).
export function isSharp(fen, lastMove = null) {
  const g = new Chess(fen);
  if (g.inCheck()) return true;
  if (lastMove?.captured) return true;
  const me = g.turn();
  if (pieceSafety(fen, me).hanging.length || pieceSafety(fen, other(me)).hanging.length) return true;
  return opponentThreats(fen, me).length > 0;
}

// Which step of the routine a mistake broke, given a Game Analysis ply. Returns 'spy' | 'scan' |
// 'safe' | null. Spy = a threat already existed and the move didn't deal with it. Safe = the move
// itself created the problem. Scan = the best move was forcing and was missed.
export function failedStep(analysis) {
  if (!analysis?.fenBefore || !analysis?.uci) return null;
  if (!['mistake', 'blunder', 'miss'].includes(analysis.classification)) return null;
  try {
    const g = new Chess(analysis.fenBefore);
    const me = g.turn();
    const uci = analysis.uci;
    const move = { from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] || undefined };

    const safe = safetyCheck(analysis.fenBefore, move);
    const threatsBefore = opponentThreats(analysis.fenBefore, me);
    // A fresh blunder (a newly hung piece or newly allowed tactic, not one of the threats that
    // were already there) is a Safe failure even if an older threat is also being ignored.
    const oldTargets = new Set(threatsBefore.map(t => t.to));
    if (safe.issues.some(i => i.severity >= 2 && !i.squares.some(sq => oldTargets.has(sq)))) return 'safe';
    if (threatsBefore.length && safe.fenAfter) {
      const after = new Chess(safe.fenAfter);
      const stillThere = threatsBefore.some(t => {
        try {
          const probe = new Chess(safe.fenAfter);
          const r = probe.move(t.san);
          if (!r) return false;
          if (t.mate) return probe.isCheckmate();
          return !!r.captured && pieceSafety(safe.fenAfter, me).hanging.some(h => h.square === t.to);
        } catch { return false; }
      });
      if (stillThere && !after.isCheckmate()) return 'spy';
    }
    if (!safe.ok && safe.issues.some(i => i.severity >= 2)) return 'safe';

    if (analysis.bestMove) {
      const bg = new Chess(analysis.fenBefore);
      const best = bg.move({ from: analysis.bestMove.slice(0, 2), to: analysis.bestMove.slice(2, 4), promotion: analysis.bestMove[4] || undefined });
      if (best && (best.captured || best.san.includes('+') || best.san.includes('#'))) return 'scan';
      if (best) {
        const forcing = forcingMoves(analysis.fenBefore, me);
        if (forcing.threats.some(t => t.san === best.san)) return 'scan';
      }
    }
    if (!safe.ok) return 'safe';
    return null;
  } catch { return null; }
}

// Tally failed steps across a list of objects carrying `failedStep`.
export function tallySteps(items) {
  const counts = { spy: 0, scan: 0, safe: 0 };
  for (const it of items) if (it?.failedStep && counts[it.failedStep] != null) counts[it.failedStep]++;
  const total = counts.spy + counts.scan + counts.safe;
  let weakest = null;
  if (total > 0) weakest = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  return { counts, total, weakest };
}
