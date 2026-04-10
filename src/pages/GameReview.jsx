import { useState, useEffect, useCallback } from 'react';
import { Chess } from 'chess.js';
import ChessBoard from '../components/ChessBoard';
import MoveList from '../components/MoveList';
import openings from '../data/openings';
import { progressService } from '../services/progressService';

const tagLabels = [
  { value: 'blunder', label: 'Blunder', color: 'bg-incorrect/20 text-incorrect' },
  { value: 'mistake', label: 'Mistake', color: 'bg-amber/20 text-amber' },
  { value: 'inaccuracy', label: 'Inaccuracy', color: 'bg-amber/10 text-amber' },
  { value: 'good', label: 'Good Move', color: 'bg-correct/20 text-correct' },
  { value: 'brilliant', label: 'Brilliant', color: 'bg-gold/20 text-gold' },
];

function hashPgn(pgn) {
  let hash = 0;
  for (let i = 0; i < pgn.length; i++) {
    hash = ((hash << 5) - hash + pgn.charCodeAt(i)) | 0;
  }
  return String(hash);
}

export default function GameReview() {
  const [pgnInput, setPgnInput] = useState('');
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [moves, setMoves] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [annotations, setAnnotations] = useState({});
  const [noteText, setNoteText] = useState('');
  const [matchedOpening, setMatchedOpening] = useState(null);
  const [startFen] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');

  function loadGame() {
    setError('');
    try {
      const game = new Chess();
      game.loadPgn(pgnInput);
      const history = game.history({ verbose: true });
      if (history.length === 0) { setError('No moves found in PGN.'); return; }

      // Build move list with FENs
      const g2 = new Chess();
      const moveList = history.map(m => {
        g2.move(m.san);
        return { move: m, fen: g2.fen(), san: m.san };
      });

      setMoves(moveList);
      setCurrentIndex(-1);
      setLoaded(true);

      // Load saved annotations
      const key = hashPgn(pgnInput);
      const saved = progressService.getAnnotation(key);
      if (saved) setAnnotations(saved);
      else setAnnotations({});

      // Match opening
      const gameMoves = history.map(m => m.san);
      for (const op of openings) {
        const opMoves = op.moves.map(m => m.move);
        const matchLen = Math.min(opMoves.length, gameMoves.length);
        let matched = true;
        for (let i = 0; i < matchLen; i++) {
          if (opMoves[i] !== gameMoves[i]) { matched = false; break; }
        }
        if (matched && matchLen >= 2) { setMatchedOpening(op); break; }
      }

      progressService.logActivity('Imported a game for review');
    } catch (e) {
      setError('Invalid PGN. Please check your input and try again.');
    }
  }

  useEffect(() => {
    const handler = (e) => {
      if (!loaded) return;
      if (e.key === 'ArrowRight') setCurrentIndex(i => Math.min(i + 1, moves.length - 1));
      if (e.key === 'ArrowLeft') setCurrentIndex(i => Math.max(i - 1, -1));
      if (e.key === 'Home') setCurrentIndex(-1);
      if (e.key === 'End') setCurrentIndex(moves.length - 1);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [loaded, moves.length]);

  const currentFen = currentIndex >= 0 ? moves[currentIndex].fen : startFen;
  const lastMove = currentIndex >= 0 ? [moves[currentIndex].move.from, moves[currentIndex].move.to] : undefined;

  function tagMove(tag) {
    const key = String(currentIndex);
    setAnnotations(prev => {
      const updated = { ...prev, [key]: { ...prev[key], tag } };
      progressService.saveAnnotation(hashPgn(pgnInput), updated);
      return updated;
    });
  }

  function saveNote() {
    const key = String(currentIndex);
    setAnnotations(prev => {
      const updated = { ...prev, [key]: { ...prev[key], note: noteText } };
      progressService.saveAnnotation(hashPgn(pgnInput), updated);
      return updated;
    });
  }

  useEffect(() => {
    const key = String(currentIndex);
    setNoteText(annotations[key]?.note || '');
  }, [currentIndex, annotations]);

  if (!loaded) {
    return (
      <div className="page-enter max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-display text-gold mb-1">Game Review</h1>
        <p className="text-text-dim text-sm mb-8">Paste a PGN string to load and annotate your game.</p>
        <textarea
          value={pgnInput}
          onChange={e => setPgnInput(e.target.value)}
          placeholder="Paste PGN here..."
          className="w-full h-48 card-base p-4 text-text text-sm font-mono resize-none focus:outline-none focus:border-gold/50"
        />
        {error && <p className="text-incorrect text-sm mt-2">{error}</p>}
        <button onClick={loadGame} className="mt-4 bg-gold text-bg px-6 py-2.5 rounded-lg font-semibold hover:bg-gold-dim transition-all btn-press">
          Load Game
        </button>
      </div>
    );
  }

  // Build history with tags for MoveList
  const historyWithTags = moves.map((m, i) => ({
    ...m,
    tag: annotations[String(i)]?.tag,
  }));

  return (
    <div className="page-enter max-w-6xl mx-auto px-6 py-10">
      <button onClick={() => setLoaded(false)} className="inline-flex items-center gap-1.5 text-text-dim hover:text-gold text-sm mb-5 group transition-colors"><svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"><path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" /></svg><span>Load Another Game</span></button>
      <h1 className="text-2xl font-display text-gold mb-1">Game Review</h1>
      <p className="text-text-dim text-sm mb-8">Annotate and study your games move by move.</p>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        <div className="w-full max-w-[560px]">
          <ChessBoard fen={currentFen} movable={false} lastMove={lastMove} />

          {/* Navigation */}
          <div className="flex gap-2 mt-3">
            <button onClick={() => setCurrentIndex(-1)} className="flex-1 py-1.5 rounded-lg card-base text-sm hover:bg-bg-hover transition-all btn-press">&#x23EE;</button>
            <button onClick={() => setCurrentIndex(Math.max(-1, currentIndex - 1))} className="flex-1 py-1.5 rounded-lg card-base text-sm hover:bg-bg-hover transition-all btn-press">&larr;</button>
            <button onClick={() => setCurrentIndex(Math.min(moves.length - 1, currentIndex + 1))} className="flex-1 py-1.5 rounded-lg card-base text-sm hover:bg-bg-hover transition-all btn-press">&rarr;</button>
            <button onClick={() => setCurrentIndex(moves.length - 1)} className="flex-1 py-1.5 rounded-lg card-base text-sm hover:bg-bg-hover transition-all btn-press">&#x23ED;</button>
          </div>
        </div>

        <div className="space-y-4">
          {/* Move list */}
          <MoveList history={historyWithTags} currentIndex={currentIndex} onSelectMove={setCurrentIndex} />

          {/* Tag buttons */}
          {currentIndex >= 0 && (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-1.5">
                {tagLabels.map(t => (
                  <button
                    key={t.value}
                    onClick={() => tagMove(t.value)}
                    className={`text-xs px-2 py-1 rounded-lg transition-all btn-press ${annotations[String(currentIndex)]?.tag === t.value ? t.color + ' ring-1 ring-current' : 'bg-bg-hover text-text-dim hover:text-text'}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Note */}
              <textarea
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
                onBlur={saveNote}
                placeholder="Add a note about this position..."
                className="w-full h-20 card-base p-3 text-sm text-text resize-none focus:outline-none focus:border-gold/50"
              />
            </div>
          )}

          {/* Opening match */}
          {matchedOpening && (
            <div className="card-base !border-gold/20 p-4">
              <p className="text-sm text-text-dim">
                This position matches the opening: <span className="text-gold font-semibold">{matchedOpening.name}</span> — <a href={`/openings/${matchedOpening.id}`} className="text-gold underline">see the Openings section</a> for tips.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
