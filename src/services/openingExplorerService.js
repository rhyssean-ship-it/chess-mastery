// Opening book built from the app's own openings library. (Lichess's explorer API now needs a
// login token, so it can't be called from here.) Positions are matched on placement, side to
// move, castling and en passant, so transpositions between lines are found too.

import { Chess } from 'chess.js';
import openings from '../data/openings';

const posKey = fen => fen.split(' ').slice(0, 4).join(' ');

// position -> { names: openings passing through, ends: openings whose line ends here, next: Map san -> { uci, names } }
let INDEX = null;
function buildIndex() {
  const index = new Map();
  const node = key => {
    if (!index.has(key)) index.set(key, { names: new Set(), ends: new Set(), next: new Map() });
    return index.get(key);
  };
  for (const op of openings) {
    const g = new Chess();
    for (const step of op.moves) {
      const here = node(posKey(g.fen()));
      let m;
      try { m = g.move(step.move); } catch { break; }
      if (!m) break;
      const entry = here.next.get(m.san) || { uci: m.from + m.to + (m.promotion || ''), names: new Set() };
      entry.names.add(op.name);
      here.next.set(m.san, entry);
      node(posKey(g.fen())).names.add(op.name);
    }
    node(posKey(g.fen())).ends.add(op.name);
  }
  return index;
}

// { opening: name of a line reaching this position | null, moves: [{ san, uci, openings: [names] }] }
// Moves are ordered by how many library openings continue with them.
export function lookupBook(fen) {
  if (!INDEX) INDEX = buildIndex();
  const n = INDEX.get(posKey(fen));
  if (!n) return { opening: null, moves: [] };
  const moves = [...n.next.entries()]
    .map(([san, e]) => ({ san, uci: e.uci, openings: [...e.names] }))
    .sort((a, b) => b.openings.length - a.openings.length);
  // Name the position after a line that ends here, else the only line passing through it.
  const ends = [...n.ends];
  const names = [...n.names];
  return { opening: ends[0] || (names.length === 1 ? names[0] : null), moves };
}
