// Lichess Opening Explorer API — free, CORS-enabled, no auth.
// Docs: https://lichess.org/api#tag/Opening-Explorer
// We query the aggregated "lichess games" database (improver rating bands) so the
// move stats reflect the kind of games the user actually faces.

const ENDPOINT = 'https://explorer.lichess.ovh/lichess';
const CACHE = new Map(); // fen -> result (positions are immutable, safe to cache for the session)

export async function fetchExplorer(fen, { signal } = {}) {
  if (CACHE.has(fen)) return CACHE.get(fen);

  const params = new URLSearchParams({
    fen,
    moves: '12',
    topGames: '0',
    recentGames: '0',
    speeds: 'blitz,rapid,classical',
    ratings: '1200,1400,1600,1800',
  });

  const res = await fetch(`${ENDPOINT}?${params.toString()}`, { signal });
  if (!res.ok) throw new Error(`Explorer ${res.status}`);
  const data = await res.json();

  const total = (data.white || 0) + (data.draws || 0) + (data.black || 0);
  const result = {
    opening: data.opening || null, // { eco, name } or null
    total,
    moves: (data.moves || []).map(m => {
      const games = (m.white || 0) + (m.draws || 0) + (m.black || 0);
      return {
        uci: m.uci,
        san: m.san,
        games,
        pct: total > 0 ? (games / total) * 100 : 0,
        whitePct: games > 0 ? (m.white / games) * 100 : 0,
        drawPct: games > 0 ? (m.draws / games) * 100 : 0,
        blackPct: games > 0 ? (m.black / games) * 100 : 0,
      };
    }),
  };

  CACHE.set(fen, result);
  return result;
}
