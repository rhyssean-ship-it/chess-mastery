import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { listSavedGames, deleteSavedGame } from '../services/savedGames';
import EmptyState from '../components/EmptyState';

function formatDate(ts) {
  return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function SavedReviews() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);

  useEffect(() => { setEntries(listSavedGames()); }, []);

  function openReview(entry) {
    sessionStorage.setItem('enpassant:reviewGame', JSON.stringify({
      history: entry.history,
      playerColor: entry.playerColor,
      result: entry.result,
      label: entry.label,
      startingFen: entry.startingFen,
      restoredFromSave: true,        // flag so analysis page can hydrate from saved analyses
      savedAnalyses: entry.analyses,
      savedSummary: entry.summary,
    }));
    navigate('/play/analysis');
  }

  function handleDelete(id) {
    if (!confirm('Delete this reviewed game?')) return;
    deleteSavedGame(id);
    setEntries(listSavedGames());
  }

  if (entries.length === 0) {
    return (
      <div className="page page-narrow">
        <h1 className="text-2xl sm:text-3xl font-display mb-1">Reviewed Games</h1>
        <EmptyState
          icon="♞"
          title="No reviewed games yet"
          body="Games you analyse get saved here automatically. Play a game and tap Analyse on the end screen."
          ctaLabel="Play a game"
          ctaTo="/play"
        />
      </div>
    );
  }

  return (
    <div className="page-enter max-w-4xl mx-auto px-4 sm:px-6 py-6 lg:py-10">
      <h1 className="text-2xl sm:text-3xl font-display mb-1">Reviewed Games</h1>
      <p className="text-text-dim text-sm mb-6">Your last {entries.length} analysed game{entries.length === 1 ? '' : 's'}. Open one to re-review without re-analysing.</p>

      <div className="space-y-2">
        {entries.map(e => {
          const whiteAcc = e.summary?.white?.accuracy?.toFixed(0);
          const blackAcc = e.summary?.black?.accuracy?.toFixed(0);
          // the player's own numbers first; the engine's blunders aren't yours
          const mine = e.playerColor === 'black' ? 'black' : 'white';
          const blunders = e.summary?.[mine]?.blunder || 0;
          const yourAcc = mine === 'white' ? whiteAcc : blackAcc;
          const oppAcc = mine === 'white' ? blackAcc : whiteAcc;
          return (
            <div key={e.id} className="card-base p-4 flex items-center justify-between gap-3 hover:bg-bg-hover/30 transition-all">
              <button onClick={() => openReview(e)} className="flex-1 text-left min-w-0">
                <div className="flex items-baseline gap-2 mb-1">
                  <div className="font-semibold truncate">{e.label || 'Game'}</div>
                  {e.result && <span className="text-xs text-text-dim">— {e.result}</span>}
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-text-dim">
                  <span>{formatDate(e.savedAt)}</span>
                  <span>{Math.ceil(e.moveCount / 2)} moves</span>
                  {yourAcc && <span>Accuracy: you <span className="text-text">{yourAcc}%</span> · opponent {oppAcc}%</span>}
                  {blunders > 0 && <span className="text-incorrect">{blunders} blunder{blunders === 1 ? '' : 's'}</span>}
                </div>
              </button>
              <button onClick={() => handleDelete(e.id)} className="text-text-dim hover:text-incorrect px-2 py-1 text-lg" aria-label="Delete">×</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
