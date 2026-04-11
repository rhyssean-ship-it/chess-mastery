import { useState, useEffect, useMemo } from 'react';
import { progressService } from '../services/progressService';

const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const ranks = ['1', '2', '3', '4', '5', '6', '7', '8'];

const pieceSymbols = { K: '\u2654', Q: '\u2655', R: '\u2656', B: '\u2657', N: '\u2658', P: '\u2659' };
const pieceNames = { K: 'King', Q: 'Queen', R: 'Rook', B: 'Bishop', N: 'Knight', P: 'Pawn' };

function getRandomSquare() {
  return files[Math.floor(Math.random() * 8)] + ranks[Math.floor(Math.random() * 8)];
}

function SquareNameDrill() {
  const [target, setTarget] = useState(getRandomSquare);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [orientation, setOrientation] = useState('white');
  const [feedback, setFeedback] = useState(null);

  function selectSquare(sq) {
    if (feedback) return;
    setSelected(sq);
    setTotal(t => t + 1);
    const correct = sq === target;
    if (correct) {
      setScore(s => s + 1);
      setStreak(s => {
        const next = s + 1;
        setBestStreak(b => Math.max(b, next));
        return next;
      });
    } else {
      setStreak(0);
    }
    setFeedback({ correct, answer: target });
    setTimeout(() => {
      setFeedback(null);
      setSelected(null);
      setTarget(getRandomSquare());
    }, correct ? 600 : 1500);
  }

  const displayRanks = orientation === 'white' ? [...ranks].reverse() : ranks;
  const displayFiles = orientation === 'white' ? files : [...files].reverse();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-text-dim">
          Score: <span className="text-text font-medium">{score}/{total}</span>
          {streak > 1 && <span className="text-gold ml-2">{streak} streak!</span>}
        </div>
        <button onClick={() => setOrientation(o => o === 'white' ? 'black' : 'white')} className="text-xs bg-bg-hover px-3 py-1.5 rounded-lg btn-press transition-all hover:bg-bg-elevated">
          Flip board
        </button>
      </div>

      <div className="card-base p-4 text-center">
        <p className="text-text-dim text-sm mb-1">Tap the square</p>
        <p className="text-3xl font-bold text-gold">{target}</p>
      </div>

      {/* Board grid */}
      <div className="max-w-[400px] mx-auto">
        <div className="grid grid-cols-8 rounded-lg overflow-hidden board-frame">
          {displayRanks.map(r => displayFiles.map(f => {
            const sq = f + r;
            const isDark = (files.indexOf(f) + ranks.indexOf(r)) % 2 === 0;
            const isTarget = feedback && sq === target;
            const isWrong = feedback && sq === selected && !feedback.correct;
            let bg = isDark ? 'bg-[#b58863]' : 'bg-[#f0d9b5]';
            if (isTarget) bg = 'bg-correct';
            if (isWrong) bg = 'bg-incorrect';

            return (
              <button
                key={sq}
                onClick={() => selectSquare(sq)}
                className={`aspect-square flex items-center justify-center text-[10px] sm:text-xs font-mono transition-colors ${bg} hover:opacity-80 btn-press`}
              >
                {feedback && sq === target ? sq : ''}
              </button>
            );
          }))}
        </div>
        {/* File labels */}
        <div className="grid grid-cols-8 mt-1">
          {displayFiles.map(f => <div key={f} className="text-center text-xs text-text-dim">{f}</div>)}
        </div>
      </div>
      {/* Rank labels are implicit from the grid */}
    </div>
  );
}

function NameSquareDrill() {
  const [targetSquare, setTargetSquare] = useState(getRandomSquare);
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [orientation, setOrientation] = useState('white');

  useEffect(() => {
    generateOptions();
  }, [targetSquare]);

  function generateOptions() {
    const opts = new Set([targetSquare]);
    while (opts.size < 4) {
      opts.add(getRandomSquare());
    }
    setOptions([...opts].sort(() => Math.random() - 0.5));
  }

  function select(sq) {
    if (selected) return;
    setSelected(sq);
    setTotal(t => t + 1);
    if (sq === targetSquare) setScore(s => s + 1);
    setTimeout(() => {
      setSelected(null);
      setTargetSquare(getRandomSquare());
    }, sq === targetSquare ? 600 : 1500);
  }

  const displayRanks = orientation === 'white' ? [...ranks].reverse() : ranks;
  const displayFiles = orientation === 'white' ? files : [...files].reverse();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-text-dim">Score: <span className="text-text font-medium">{score}/{total}</span></div>
        <button onClick={() => setOrientation(o => o === 'white' ? 'black' : 'white')} className="text-xs bg-bg-hover px-3 py-1.5 rounded-lg btn-press transition-all hover:bg-bg-elevated">
          Flip board
        </button>
      </div>

      {/* Board with highlighted square */}
      <div className="max-w-[400px] mx-auto">
        <div className="grid grid-cols-8 rounded-lg overflow-hidden board-frame">
          {displayRanks.map(r => displayFiles.map(f => {
            const sq = f + r;
            const isDark = (files.indexOf(f) + ranks.indexOf(r)) % 2 === 0;
            const isTarget = sq === targetSquare;
            let bg = isDark ? 'bg-[#b58863]' : 'bg-[#f0d9b5]';
            if (isTarget) bg = 'bg-gold';
            if (selected && sq === targetSquare) bg = selected === targetSquare ? 'bg-correct' : 'bg-incorrect';

            return (
              <div key={sq} className={`aspect-square ${bg} transition-colors`} />
            );
          }))}
        </div>
        <div className="grid grid-cols-8 mt-1">
          {displayFiles.map(f => <div key={f} className="text-center text-xs text-text-dim">{f}</div>)}
        </div>
      </div>

      <p className="text-center text-sm text-text-dim">What square is highlighted?</p>

      <div className="grid grid-cols-2 gap-2 max-w-[300px] mx-auto">
        {options.map(sq => {
          let cls = 'card-base p-3 text-center text-lg font-mono font-bold btn-press transition-all';
          if (selected) {
            if (sq === targetSquare) cls += ' !border-correct bg-correct/10 text-correct';
            else if (sq === selected) cls += ' !border-incorrect bg-incorrect/10 text-incorrect';
            else cls += ' opacity-40';
          } else {
            cls += ' hover:border-gold/30 cursor-pointer';
          }
          return <button key={sq} onClick={() => select(sq)} className={cls} disabled={!!selected}>{sq}</button>;
        })}
      </div>
    </div>
  );
}

function NotationDrill() {
  const [question, setQuestion] = useState(null);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => { generateQuestion(); }, []);

  function generateQuestion() {
    const types = ['piece-move', 'capture', 'check', 'castle'];
    const type = types[Math.floor(Math.random() * types.length)];
    let notation, explanation, options;

    if (type === 'piece-move') {
      const pieces = ['N', 'B', 'R', 'Q', 'K'];
      const piece = pieces[Math.floor(Math.random() * pieces.length)];
      const sq = getRandomSquare();
      notation = piece + sq;
      explanation = `${pieceNames[piece]} moves to ${sq}`;
      options = [
        { text: explanation, correct: true },
        { text: `${pieceNames[pieces[(pieces.indexOf(piece) + 1) % pieces.length]]} moves to ${sq}`, correct: false },
        { text: `${pieceNames[piece]} moves to ${files[Math.floor(Math.random() * 8)]}${ranks[Math.floor(Math.random() * 8)]}`, correct: false },
        { text: `${pieceNames[piece]} captures on ${sq}`, correct: false },
      ];
    } else if (type === 'capture') {
      const pieces = ['N', 'B', 'R', 'Q'];
      const piece = pieces[Math.floor(Math.random() * pieces.length)];
      const sq = getRandomSquare();
      notation = piece + 'x' + sq;
      explanation = `${pieceNames[piece]} captures on ${sq}`;
      options = [
        { text: explanation, correct: true },
        { text: `${pieceNames[piece]} moves to ${sq}`, correct: false },
        { text: `Pawn captures on ${sq}`, correct: false },
        { text: `${pieceNames[piece]} captures on ${files[Math.floor(Math.random() * 8)]}${ranks[Math.floor(Math.random() * 8)]}`, correct: false },
      ];
    } else if (type === 'check') {
      const pieces = ['N', 'B', 'R', 'Q'];
      const piece = pieces[Math.floor(Math.random() * pieces.length)];
      const sq = getRandomSquare();
      notation = piece + sq + '+';
      explanation = `${pieceNames[piece]} moves to ${sq} with check`;
      options = [
        { text: explanation, correct: true },
        { text: `${pieceNames[piece]} moves to ${sq} (no check)`, correct: false },
        { text: `${pieceNames[piece]} captures on ${sq} with check`, correct: false },
        { text: `${pieceNames[piece]} checkmates on ${sq}`, correct: false },
      ];
    } else {
      const isKingside = Math.random() > 0.5;
      notation = isKingside ? 'O-O' : 'O-O-O';
      explanation = isKingside ? 'Kingside castling (short)' : 'Queenside castling (long)';
      options = [
        { text: explanation, correct: true },
        { text: isKingside ? 'Queenside castling (long)' : 'Kingside castling (short)', correct: false },
        { text: 'King moves two squares', correct: false },
        { text: 'Rook jumps over king', correct: false },
      ];
    }

    setQuestion({ notation, explanation, options: options.sort(() => Math.random() - 0.5) });
  }

  function select(idx) {
    if (selected !== null) return;
    setSelected(idx);
    setTotal(t => t + 1);
    if (question.options[idx].correct) setScore(s => s + 1);
    setTimeout(() => {
      setSelected(null);
      generateQuestion();
    }, question.options[idx].correct ? 600 : 1500);
  }

  if (!question) return null;

  return (
    <div className="space-y-4">
      <div className="text-sm text-text-dim">Score: <span className="text-text font-medium">{score}/{total}</span></div>

      <div className="card-base p-6 text-center">
        <p className="text-text-dim text-sm mb-2">What does this notation mean?</p>
        <p className="text-4xl font-mono font-bold text-gold">{question.notation}</p>
      </div>

      <div className="space-y-2 max-w-[400px] mx-auto">
        {question.options.map((opt, i) => {
          let cls = 'card-base p-4 w-full text-left text-sm btn-press transition-all';
          if (selected !== null) {
            if (opt.correct) cls += ' !border-correct bg-correct/10';
            else if (i === selected) cls += ' !border-incorrect bg-incorrect/10';
            else cls += ' opacity-40';
          } else {
            cls += ' hover:border-gold/30 cursor-pointer';
          }
          return <button key={i} onClick={() => select(i)} className={cls} disabled={selected !== null}>{opt.text}</button>;
        })}
      </div>
    </div>
  );
}

const drills = [
  { id: 'find-square', name: 'Find the Square', desc: 'Given a square name, tap it on the board.', Component: SquareNameDrill },
  { id: 'name-square', name: 'Name the Square', desc: 'A square is highlighted — identify its name.', Component: NameSquareDrill },
  { id: 'read-notation', name: 'Read Notation', desc: 'Decode algebraic notation into plain English.', Component: NotationDrill },
];

export default function BoardNotation() {
  const [activeDrill, setActiveDrill] = useState(null);
  const [key, setKey] = useState(0);

  if (activeDrill) {
    const drill = drills.find(d => d.id === activeDrill);
    const DrillComponent = drill.Component;
    return (
      <div className="page-enter max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <button onClick={() => setActiveDrill(null)} className="inline-flex items-center gap-1.5 text-text-dim hover:text-gold text-sm mb-5 group transition-colors">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"><path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" /></svg>
          <span>Back to Drills</span>
        </button>
        <h1 className="text-2xl font-display text-gold mb-1">{drill.name}</h1>
        <p className="text-text-dim text-base mb-8">{drill.desc}</p>
        <DrillComponent key={key} />
        <div className="text-center mt-8">
          <button onClick={() => setKey(k => k + 1)} className="bg-gold text-bg px-5 py-2 rounded-lg font-semibold hover:bg-gold-dim transition-all btn-press">
            Reset
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-display text-gold mb-1">Board Notation</h1>
      <p className="text-text-dim text-base mb-8">Learn square names and algebraic notation through interactive drills.</p>

      {/* Quick reference */}
      <div className="card-base p-5 mb-8">
        <h2 className="text-xl font-display mb-3">Quick Reference</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium mb-2">Square Names</p>
            <p className="text-text-dim">Each square has a name: file letter (a-h) + rank number (1-8). For example, <span className="text-gold font-mono">e4</span> is the e-file, 4th rank.</p>
          </div>
          <div>
            <p className="font-medium mb-2">Piece Notation</p>
            <div className="text-text-dim space-y-1">
              {Object.entries(pieceNames).map(([key, name]) => (
                <div key={key} className="flex items-center gap-2">
                  <span className="text-lg">{pieceSymbols[key]}</span>
                  <span className="font-mono text-gold w-4">{key === 'P' ? '' : key}</span>
                  <span>{name} {key === 'P' ? '(no letter)' : ''}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="font-medium mb-2">Move Examples</p>
            <div className="text-text-dim space-y-1">
              <p><span className="font-mono text-gold">Nf3</span> — Knight moves to f3</p>
              <p><span className="font-mono text-gold">Bxe5</span> — Bishop captures on e5</p>
              <p><span className="font-mono text-gold">Qd7+</span> — Queen to d7, check</p>
              <p><span className="font-mono text-gold">O-O</span> — Kingside castling</p>
              <p><span className="font-mono text-gold">e4</span> — Pawn to e4</p>
            </div>
          </div>
          <div>
            <p className="font-medium mb-2">Special Symbols</p>
            <div className="text-text-dim space-y-1">
              <p><span className="font-mono text-gold">x</span> — Capture</p>
              <p><span className="font-mono text-gold">+</span> — Check</p>
              <p><span className="font-mono text-gold">#</span> — Checkmate</p>
              <p><span className="font-mono text-gold">=Q</span> — Pawn promotes to Queen</p>
              <p><span className="font-mono text-gold">O-O-O</span> — Queenside castling</p>
            </div>
          </div>
        </div>
      </div>

      {/* Drills */}
      <h2 className="text-xl font-display mb-4">Practice Drills</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {drills.map(d => (
          <button key={d.id} onClick={() => setActiveDrill(d.id)} className="card-base p-5 text-left card-hover card-stagger hover:border-gold/20 btn-press">
            <h3 className="text-base font-semibold mb-1">{d.name}</h3>
            <p className="text-sm text-text-dim">{d.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
