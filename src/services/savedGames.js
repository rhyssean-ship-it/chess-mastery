// Stores fully-analysed games (last 10) for revisiting in My Reviews.

const KEY = 'chess-mastery:savedGames';
const MAX = 10;

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
}
function save(entries) {
  localStorage.setItem(KEY, JSON.stringify(entries.slice(0, MAX)));
}

export function listSavedGames() { return load(); }

export function getSavedGame(id) {
  return load().find(g => g.id === id) || null;
}

// Save an analysed game. Returns the saved entry.
export function saveAnalysedGame({ label, result, playerColor, startingFen, history, summary, analyses }) {
  // Strip heavy/unnecessary fields from analyses before saving
  const trimmedAnalyses = analyses
    .filter(Boolean)
    .map(a => ({
      ply: a.ply,
      color: a.color,
      san: a.san,
      uci: a.uci,
      fenBefore: a.fenBefore,
      fenAfter: a.fenAfter,
      from: a.from,
      to: a.to,
      cpBefore: a.cpBefore,
      cpAfter: a.cpAfter,
      cpl: a.cpl,
      wpBefore: a.wpBefore,
      wpAfter: a.wpAfter,
      moveAccuracy: a.moveAccuracy,
      classification: a.classification,
      isBest: a.isBest,
      bestMove: a.bestMove,
      bestMoveSan: a.bestMoveSan,
      bestMovePv: a.bestMovePv?.slice(0, 8),
      secondBestCpGap: a.secondBestCpGap,
    }));
  const entry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    savedAt: Date.now(),
    label, result, playerColor, startingFen,
    history,
    summary,
    analyses: trimmedAnalyses,
    moveCount: history.length,
  };
  const list = load();
  list.unshift(entry);
  try {
    save(list);
  } catch (e) {
    // localStorage quota — drop oldest and retry
    if (e.name === 'QuotaExceededError') {
      save(list.slice(0, Math.max(1, MAX - 1)));
    }
  }
  return entry;
}

export function deleteSavedGame(id) {
  save(load().filter(g => g.id !== id));
}
