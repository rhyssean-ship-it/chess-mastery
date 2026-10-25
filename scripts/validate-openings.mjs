#!/usr/bin/env node
// Validates src/data/openings.js.
//
//   node scripts/validate-openings.mjs            structural checks (fast)
//   node scripts/validate-openings.mjs --engine   + Stockfish blunder check on every ply
//        [--depth 12] [--max-drop 150] [--workers 4] [--only id1,id2]
//
// Structural checks: unique ids, valid eloBand/side/difficulty, every SAN legal when
// replayed from the start, every stored fen === replayed fen, stored SAN is canonical,
// arrows/highlights use real squares, and every arrow starts on a piece that attacks /
// pushes to its target (an arrow that passes through exactly one piece — a pin or a
// battery — is allowed but listed for review).
//
// Engine check: for each ply, compares Stockfish's best eval (mover's view) with the eval
// after the move actually played. A drop above --max-drop centipawns fails, unless the
// ply is listed in ALLOWED_SACRIFICES below (intentional gambits).
import { Chess } from 'chess.js';
import openings from '../src/data/openings.js';

const BANDS = ['400-800', '800-1200', '1200-1600', '1600+'];
const SIDES = ['white', 'black'];
const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];
const SQ = /^[a-h][1-8]$/;

// `${id}:${plyIndex1Based}` -> reason. Gambits deliberately give material.
const ALLOWED_SACRIFICES = {
  'evans-gambit:7': 'Evans Gambit 4.b4 — pawn sacrifice for development',
  // 3.f4 (Vienna Gambit) is long-established mainline theory, but Stockfish rates 3.Nf3/3.Bc4
  // higher; at depth 12 the gap is ~190cp. Kept as an intentional gambit.
  'vienna-game:5': 'Vienna Gambit 3.f4 — gambit-style pawn offer, objectively a bit loose',
};

const args = process.argv.slice(2);
const opt = (name, def) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : def;
};
const ENGINE = args.includes('--engine');
const DEPTH = Number(opt('--depth', 12));
const MAX_DROP = Number(opt('--max-drop', 150));
const WORKERS = Number(opt('--workers', 4));
const ONLY = opt('--only', null)?.split(',');

const errors = [];
const reviews = [];
const err = (msg) => errors.push(msg);

// ── geometry helpers for the arrow check ──
const fileOf = (s) => s.charCodeAt(0) - 97;
const rankOf = (s) => Number(s[1]) - 1;
const sq = (f, r) => String.fromCharCode(97 + f) + (r + 1);

// Returns 0 if `from` piece reaches `to` directly, 1 if through exactly one piece, -1 otherwise.
function reach(game, from, to) {
  const p = game.get(from);
  if (!p) return -1;
  const df = fileOf(to) - fileOf(from);
  const dr = rankOf(to) - rankOf(from);
  const adf = Math.abs(df), adr = Math.abs(dr);
  switch (p.type) {
    case 'p': {
      const dir = p.color === 'w' ? 1 : -1;
      if (adf === 1 && dr === dir) return 0; // capture square
      if (df === 0 && dr === dir && !game.get(to)) return 0; // push
      if (df === 0 && dr === 2 * dir && !game.get(to) && !game.get(sq(fileOf(from), rankOf(from) + dir))) return 0;
      return -1;
    }
    case 'n': return (adf === 1 && adr === 2) || (adf === 2 && adr === 1) ? 0 : -1;
    case 'k': return adf <= 1 && adr <= 1 && (adf || adr) ? 0 : -1;
    default: {
      const diag = adf === adr && adf > 0;
      const straight = (df === 0) !== (dr === 0);
      if (p.type === 'b' && !diag) return -1;
      if (p.type === 'r' && !straight) return -1;
      if (p.type === 'q' && !diag && !straight) return -1;
      const sf = Math.sign(df), sr = Math.sign(dr);
      let blockers = 0;
      for (let f = fileOf(from) + sf, r = rankOf(from) + sr; f !== fileOf(to) || r !== rankOf(to); f += sf, r += sr) {
        if (game.get(sq(f, r))) blockers++;
      }
      return blockers === 0 ? 0 : blockers === 1 ? 1 : -1;
    }
  }
}

// ── structural validation ──
const ids = new Set();
const list = ONLY ? openings.filter(o => ONLY.includes(o.id)) : openings;
for (const o of openings) {
  const where = o.id || o.name || '(no id)';
  if (!o.id) err(`${where}: missing id`);
  if (ids.has(o.id)) err(`${where}: duplicate id`);
  ids.add(o.id);
  for (const k of ['name', 'eco', 'description']) if (!o[k] || typeof o[k] !== 'string') err(`${where}: missing ${k}`);
  if (!DIFFICULTIES.includes(o.difficulty)) err(`${where}: bad difficulty ${o.difficulty}`);
  if (!BANDS.includes(o.eloBand)) err(`${where}: bad eloBand ${o.eloBand}`);
  if (o.side !== undefined && !SIDES.includes(o.side)) err(`${where}: bad side ${o.side}`);
  if (!Array.isArray(o.keyIdeas) || o.keyIdeas.length < 3) err(`${where}: needs at least 3 keyIdeas`);
  if (!Array.isArray(o.moves) || !o.moves.length) { err(`${where}: no moves`); continue; }

  const game = new Chess();
  o.moves.forEach((m, i) => {
    const at = `${where} ply ${i + 1} (${m.move})`;
    let played;
    try { played = game.move(m.move); } catch { played = null; }
    if (!played) { err(`${at}: illegal move`); return; }
    if (played.san !== m.move) err(`${at}: non-canonical SAN, chess.js says ${played.san}`);
    if (m.fen !== game.fen()) err(`${at}: fen mismatch\n    stored:   ${m.fen}\n    replayed: ${game.fen()}`);
    if (!m.explanation || typeof m.explanation !== 'string') err(`${at}: missing explanation`);
    for (const h of m.highlights || []) if (!SQ.test(h)) err(`${at}: bad highlight square ${h}`);
    for (const a of m.arrows || []) {
      if (!Array.isArray(a) || a.length !== 2 || !a.every(s => SQ.test(s))) { err(`${at}: bad arrow ${JSON.stringify(a)}`); continue; }
      // A route arrow (e.g. f1->g2 then g2->b7 to show a fianchetto plan) starts where another arrow ends.
      const isRoute = !game.get(a[0]) && (m.arrows || []).some(b => b !== a && b[1] === a[0]);
      if (isRoute) { reviews.push(`${at}: route arrow ${a[0]}->${a[1]} (planned, not checked)`); continue; }
      const r = reach(game, a[0], a[1]);
      if (r < 0) err(`${at}: arrow ${a[0]}->${a[1]} — no piece on ${a[0]} reaches ${a[1]}`);
      else if (r === 1) reviews.push(`${at}: arrow ${a[0]}->${a[1]} passes through one piece (pin/battery)`);
    }
  });
}

const counts = Object.fromEntries(BANDS.map(b => [b, openings.filter(o => o.eloBand === b).length]));
console.log(`Structural: ${openings.length} openings, ${openings.reduce((n, o) => n + o.moves.length, 0)} plies`);
console.log(`  by band: ${BANDS.map(b => `${b}: ${counts[b]}`).join(', ')}`);
if (reviews.length) {
  console.log(`  ${reviews.length} arrow(s) to review (pins/batteries/route arrows):`);
  for (const r of reviews) console.log('    - ' + r);
}

// ── engine validation ──
async function engineCheck() {
  const { createEngine } = await import('./stockfish-node.mjs');
  const toCp = (e) => (e.mate != null ? (e.mate > 0 ? 10000 - e.mate : -10000 - e.mate) : e.cp);
  const queue = [...list];
  const results = [];
  let checked = 0;
  const totalPlies = list.reduce((n, o) => n + o.moves.length, 0);

  async function worker() {
    const engine = createEngine();
    await engine.init();
    while (queue.length) {
      const o = queue.shift();
      await engine.newGame();
      const game = new Chess();
      // evals[i] = eval of position before ply i+1, from side-to-move's view.
      let before = await engine.evaluate(game.fen(), { depth: DEPTH });
      for (let i = 0; i < o.moves.length; i++) {
        const m = o.moves[i];
        game.move(m.move);
        const after = await engine.evaluate(game.fen(), { depth: DEPTH });
        const bestCp = toCp(before);
        const playedCp = after.cp == null && after.mate == null ? null : -toCp(after);
        const drop = bestCp == null || playedCp == null ? null : bestCp - playedCp;
        const key = `${o.id}:${i + 1}`;
        const row = { key, id: o.id, ply: i + 1, move: m.move, best: before.bestmove, bestCp, playedCp, drop };
        if (drop == null) row.status = 'NO-EVAL';
        else if (drop > MAX_DROP) row.status = ALLOWED_SACRIFICES[key] ? 'ALLOWED' : 'FAIL';
        else row.status = 'ok';
        results.push(row);
        before = after;
        checked++;
      }
      const mine = results.filter(r => r.id === o.id);
      const worst = mine.reduce((a, b) => ((b.drop ?? -1e9) > (a.drop ?? -1e9) ? b : a));
      const finalCp = mine[mine.length - 1].playedCp;
      const whiteView = o.moves.length % 2 === 1 ? finalCp : -finalCp;
      console.log(`  [${checked}/${totalPlies}] ${o.id.padEnd(24)} worst drop ${String(worst.drop).padStart(4)}cp at ply ${worst.ply} (${worst.move})  final eval ${whiteView > 0 ? '+' : ''}${whiteView}cp (White's view)`);
    }
    engine.quit();
  }

  console.log(`Engine: Stockfish depth ${DEPTH}, max drop ${MAX_DROP}cp, ${WORKERS} workers`);
  await Promise.all(Array.from({ length: Math.min(WORKERS, list.length) }, worker));

  for (const r of results.filter(r => r.status === 'ALLOWED')) {
    console.log(`  allowed: ${r.key} ${r.move} drop ${r.drop}cp — ${ALLOWED_SACRIFICES[r.key]}`);
  }
  for (const r of results.filter(r => r.status === 'FAIL' || r.status === 'NO-EVAL')) {
    err(`engine ${r.status}: ${r.key} ${r.move} — best ${r.best} (${r.bestCp}cp), played ${r.playedCp}cp, drop ${r.drop}cp`);
  }
  console.log(`  engine plies checked: ${results.length}, ok: ${results.filter(r => r.status === 'ok').length}, allowed gambits: ${results.filter(r => r.status === 'ALLOWED').length}, failed: ${results.filter(r => r.status === 'FAIL' || r.status === 'NO-EVAL').length}`);
}

if (ENGINE) await engineCheck();

if (errors.length) {
  console.error(`\nFAILED with ${errors.length} error(s):`);
  for (const e of errors) console.error('  ✗ ' + e);
  process.exit(1);
}
console.log('\nPASS: all openings valid' + (ENGINE ? ' (structure + engine)' : ' (structure only — run with --engine for Stockfish checks)'));
process.exit(0);
