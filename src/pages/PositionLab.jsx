import { useState, useEffect, useRef, useMemo } from 'react';
import { Chess } from 'chess.js';
import ChessBoard from '../components/ChessBoard';
import StockfishService from '../services/stockfishService';

const STARTING_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const EMPTY_FEN = '8/8/8/8/8/8/8/8 w - - 0 1';

const PIECE_GLYPHS = [
  ['K', 'Q', 'R', 'B', 'N', 'P'],
  ['k', 'q', 'r', 'b', 'n', 'p'],
];

// FEN <-> 2D board array helpers.
function fenToBoard(fen) {
  const rows = fen.split(' ')[0].split('/');
  const board = Array.from({ length: 8 }, () => Array(8).fill(null));
  for (let r = 0; r < 8; r++) {
    let f = 0;
    for (const ch of rows[r]) {
      if (ch >= '1' && ch <= '8') f += parseInt(ch);
      else { board[r][f] = ch; f++; }
    }
  }
  return board;
}

function boardToFen(board, stm, castling, ep) {
  const rows = [];
  for (let r = 0; r < 8; r++) {
    let row = '';
    let empty = 0;
    for (let f = 0; f < 8; f++) {
      const p = board[r][f];
      if (!p) { empty++; continue; }
      if (empty) { row += empty; empty = 0; }
      row += p;
    }
    if (empty) row += empty;
    rows.push(row);
  }
  return `${rows.join('/')} ${stm} ${castling || '-'} ${ep || '-'} 0 1`;
}

function squareToRC(square) {
  const file = square.charCodeAt(0) - 97;
  const rank = parseInt(square[1]);
  return { r: 8 - rank, c: file };
}

function rcToSquare(r, c) {
  return 'abcdefgh'[c] + (8 - r);
}

// Map piece char → cburnett SVG file name.
function pieceImg(p) {
  if (!p) return null;
  const colour = p === p.toUpperCase() ? 'w' : 'b';
  const type = p.toLowerCase();
  return `/pieces/cburnett/${colour}${type.toUpperCase()}.svg`;
}

export default function PositionLab() {
  const [board, setBoard] = useState(() => fenToBoard(STARTING_FEN));
  const [stm, setStm] = useState('w');
  const [castling, setCastling] = useState('KQkq');
  const [ep, setEp] = useState('-');
  const [selectedPiece, setSelectedPiece] = useState(null); // a single piece char to "paint"
  const [orientation, setOrientation] = useState('white');
  const [lines, setLines] = useState([]);          // [{ score, mate, pv, depth }]
  const [analyzing, setAnalyzing] = useState(false);
  const [fenInputOpen, setFenInputOpen] = useState(false);
  const [fenInput, setFenInput] = useState('');
  const engineRef = useRef(null);
  const lastFenRef = useRef(null);

  const fen = useMemo(() => boardToFen(board, stm, castling, ep), [board, stm, castling, ep]);

  // Validate the FEN — chess.js throws if invalid; we want to know so we can skip analysis.
  const fenValid = useMemo(() => {
    try { new Chess(fen); return true; }
    catch { return false; }
  }, [fen]);

  // Init engine once
  useEffect(() => {
    const eng = new StockfishService();
    engineRef.current = eng;
    eng.init();
    return () => { eng.destroy(); engineRef.current = null; };
  }, []);

  // Re-analyse whenever FEN changes (debounced)
  useEffect(() => {
    if (!fenValid || !engineRef.current) { setLines([]); return; }
    if (lastFenRef.current === fen) return;
    lastFenRef.current = fen;
    setAnalyzing(true);
    const handle = setTimeout(async () => {
      const result = await engineRef.current.analyzePosition(fen, { depth: 14, multiPv: 3 });
      if (lastFenRef.current === fen) {
        setLines(result?.lines || []);
        setAnalyzing(false);
      }
    }, 350);
    return () => clearTimeout(handle);
  }, [fen, fenValid]);

  function clickSquare(r, c) {
    const next = board.map(row => row.slice());
    if (selectedPiece === 'trash') {
      next[r][c] = null;
    } else if (selectedPiece) {
      next[r][c] = selectedPiece;
    } else {
      // No selected piece: tapping a square removes whatever is there
      next[r][c] = null;
    }
    setBoard(next);
  }

  function reset() {
    setBoard(fenToBoard(STARTING_FEN));
    setStm('w');
    setCastling('KQkq');
    setEp('-');
  }
  function clear() {
    setBoard(fenToBoard(EMPTY_FEN));
    setCastling('-');
    setEp('-');
  }

  function applyFen() {
    try {
      const c = new Chess(fenInput);
      const parts = fenInput.trim().split(/\s+/);
      setBoard(fenToBoard(fenInput));
      setStm(parts[1] || 'w');
      setCastling(parts[2] || '-');
      setEp(parts[3] || '-');
      setFenInputOpen(false);
    } catch (e) {
      alert('Not a valid FEN: ' + (e.message || e));
    }
  }

  // Best-move arrow comes from the top engine line
  const topMove = lines.find(l => l.multipv === 1);
  const arrows = topMove?.pv?.[0]
    ? [[topMove.pv[0].slice(0, 2), topMove.pv[0].slice(2, 4)]]
    : [];

  return (
    <div className="page-enter max-w-5xl mx-auto px-4 sm:px-6 py-5">
      <div className="flex flex-wrap items-baseline justify-between gap-3 mb-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-display leading-tight">Position Lab</h1>
          <p className="text-text-dim text-xs">Set up any position, see what the engine thinks.</p>
        </div>
        <div className="flex flex-wrap gap-2 text-sm">
          <button onClick={reset} className="btn btn-secondary btn-sm">Starting position</button>
          <button onClick={clear} className="btn btn-secondary btn-sm">Clear board</button>
          <button onClick={() => setOrientation(o => o === 'white' ? 'black' : 'white')} className="btn btn-secondary btn-sm">Flip</button>
          <button onClick={() => { setFenInput(fen); setFenInputOpen(true); }} className="btn btn-secondary btn-sm">Edit FEN</button>
        </div>
      </div>

      {fenInputOpen && (
        <div className="card-base p-3 mb-3 flex flex-wrap items-center gap-2">
          <input
            value={fenInput}
            onChange={e => setFenInput(e.target.value)}
            placeholder="Paste a FEN here"
            className="flex-1 min-w-[20rem] bg-bg-hover/40 rounded px-3 py-1.5 text-sm font-mono"
          />
          <button onClick={applyFen} className="btn btn-primary btn-sm">Apply</button>
          <button onClick={() => setFenInputOpen(false)} className="btn btn-secondary btn-sm">Cancel</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_18rem] gap-5 lg:items-start">
        {/* Board column */}
        <div className="max-w-[520px] mx-auto w-full lg:mx-0 board-fit-mobile">
          {fenValid ? (
            <div className="relative">
              <ChessBoard
                key={`${fen}-${orientation}`}
                fen={fen}
                orientation={orientation}
                movable={false}
                arrows={arrows}
              />
              {/* Click-overlay: clicking a square places the selected piece (or clears it) */}
              <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 pointer-events-none">
                {Array.from({ length: 64 }).map((_, i) => {
                  const r = Math.floor(i / 8);
                  const c = i % 8;
                  // Flip indexing if orientation is black so the click hits the right square
                  const dispR = orientation === 'white' ? r : 7 - r;
                  const dispC = orientation === 'white' ? c : 7 - c;
                  return (
                    <button
                      key={i}
                      onClick={() => clickSquare(dispR, dispC)}
                      className="pointer-events-auto hover:bg-gold/10 transition-colors"
                      aria-label={`Square ${rcToSquare(dispR, dispC)}`}
                    />
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="card-base p-6 text-center text-incorrect text-sm">
              The current setup isn't a legal chess position.
              <div className="text-text-dim text-xs mt-2">Tip: each side needs exactly one king and no pawns on the 1st / 8th rank.</div>
            </div>
          )}

          {/* Palette */}
          <div className="card-base p-3 mt-3">
            <div className="text-[10px] text-text-dim uppercase tracking-wide mb-2 font-semibold">Piece palette</div>
            <div className="space-y-1.5">
              {PIECE_GLYPHS.map((row, ri) => (
                <div key={ri} className="flex gap-1.5">
                  {row.map(p => (
                    <button
                      key={p}
                      onClick={() => setSelectedPiece(p)}
                      className={`flex-1 aspect-square rounded-md transition-all ${selectedPiece === p ? 'bg-gold/15 ring-1 ring-gold/40' : 'bg-bg-hover/40 hover:bg-bg-hover'}`}
                      aria-label={`Place ${p}`}
                    >
                      <img src={pieceImg(p)} alt={p} className="w-full h-full p-0.5" draggable={false} />
                    </button>
                  ))}
                </div>
              ))}
              <div className="flex gap-1.5 pt-1">
                <button
                  onClick={() => setSelectedPiece('trash')}
                  className={`flex-1 py-1.5 rounded-md text-xs transition-all ${selectedPiece === 'trash' ? 'bg-incorrect/20 text-incorrect ring-1 ring-incorrect/40' : 'bg-bg-hover/40 hover:bg-bg-hover text-text-dim'}`}
                >Eraser</button>
                <button
                  onClick={() => setSelectedPiece(null)}
                  className={`flex-1 py-1.5 rounded-md text-xs transition-all ${selectedPiece === null ? 'bg-gold/15 text-gold ring-1 ring-gold/40' : 'bg-bg-hover/40 hover:bg-bg-hover text-text-dim'}`}
                >None</button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-3">
          {/* Position controls */}
          <div className="card-base p-3 space-y-3">
            <div>
              <div className="text-[10px] text-text-dim uppercase tracking-wide mb-1.5 font-semibold">Side to move</div>
              <div className="flex rounded-md bg-bg-hover/40 p-0.5">
                <button onClick={() => setStm('w')} className={`flex-1 py-1.5 text-xs rounded ${stm === 'w' ? 'bg-gold text-bg font-semibold' : 'text-text-dim'}`}>White</button>
                <button onClick={() => setStm('b')} className={`flex-1 py-1.5 text-xs rounded ${stm === 'b' ? 'bg-gold text-bg font-semibold' : 'text-text-dim'}`}>Black</button>
              </div>
            </div>
            <div>
              <div className="text-[10px] text-text-dim uppercase tracking-wide mb-1.5 font-semibold">Castling rights</div>
              <div className="flex gap-1">
                {['K', 'Q', 'k', 'q'].map(c => {
                  const enabled = castling.includes(c);
                  return (
                    <button
                      key={c}
                      onClick={() => {
                        const next = enabled ? castling.replace(c, '') : (castling === '-' ? c : castling + c);
                        setCastling(next.length === 0 ? '-' : next);
                      }}
                      className={`flex-1 py-1.5 text-xs rounded font-mono ${enabled ? 'bg-gold/15 text-gold ring-1 ring-gold/40' : 'bg-bg-hover/40 text-text-dim'}`}
                    >{c}</button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Engine analysis */}
          <div className="card-base p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="text-[10px] text-text-dim uppercase tracking-wide font-semibold">Engine</div>
              {analyzing && <span className="text-[10px] text-text-dim">analysing…</span>}
            </div>
            {lines.length === 0 && !analyzing && (
              <div className="text-xs text-text-dim">Set up a legal position to see the engine's lines.</div>
            )}
            <div className="space-y-1.5">
              {lines.map(line => {
                const evalText = line.mate != null
                  ? `#${line.mate > 0 ? line.mate : -line.mate}${line.mate < 0 ? '-' : ''}`
                  : (line.scoreCp != null ? ((line.scoreCp > 0 ? '+' : '') + (line.scoreCp / 100).toFixed(2)) : '—');
                return (
                  <div key={line.multipv} className="flex items-baseline gap-2 text-xs">
                    <span className={`tabular-nums font-bold w-12 ${line.multipv === 1 ? 'text-gold' : 'text-text-dim'}`}>{evalText}</span>
                    <span className="font-mono text-text-dim/80 truncate">{(line.pv || []).slice(0, 6).join(' ')}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* FEN display */}
          <div className="card-base p-3">
            <div className="text-[10px] text-text-dim uppercase tracking-wide mb-1.5 font-semibold">FEN</div>
            <code className="block text-[11px] font-mono bg-bg-hover/40 rounded p-2 break-all leading-snug">{fen}</code>
            <button
              onClick={() => navigator.clipboard?.writeText(fen)}
              className="mt-2 btn btn-secondary btn-sm w-full"
            >Copy</button>
          </div>
        </div>
      </div>
    </div>
  );
}
