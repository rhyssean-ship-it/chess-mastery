import { useState, useEffect, useCallback } from 'react';
import { Chess } from 'chess.js';
import ChessBoard from '../components/ChessBoard';
import { progressService } from '../services/progressService';

const samplePositions = [
  'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',
  'rnbqkb1r/pp2pppp/2p2n2/3p4/3PP3/2N5/PPP2PPP/R1BQKBNR w KQkq - 2 4',
  'r1bqk2r/ppppbppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',
  'rnbqkbnr/pp2pppp/2p5/3pP3/3P4/8/PPP2PPP/RNBQKBNR b KQkq - 0 3',
  'r1bqkbnr/pppppppp/2n5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 1 2',
];

const files = ['a','b','c','d','e','f','g','h'];
const ranks = ['1','2','3','4','5','6','7','8'];
const pieceNames = { p: 'Pawn', n: 'Knight', b: 'Bishop', r: 'Rook', q: 'Queen', k: 'King' };

function parseFen(fen) {
  const board = {};
  const rows = fen.split(' ')[0].split('/');
  for (let r = 0; r < 8; r++) {
    let f = 0;
    for (const ch of rows[r]) {
      if (ch >= '1' && ch <= '8') { f += parseInt(ch); }
      else {
        const sq = files[f] + ranks[7 - r];
        board[sq] = { color: ch === ch.toUpperCase() ? 'white' : 'black', type: ch.toLowerCase() };
        f++;
      }
    }
  }
  return board;
}

function BoardVisionDrill() {
  const [phase, setPhase] = useState('viewing'); // viewing | answering | done
  const [fen] = useState(() => samplePositions[Math.floor(Math.random() * samplePositions.length)]);
  const [board] = useState(() => parseFen(fen));
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [timer, setTimer] = useState(5);

  useEffect(() => {
    if (phase !== 'viewing') return;
    if (timer <= 0) {
      generateQuestions();
      setPhase('answering');
      return;
    }
    const t = setTimeout(() => setTimer(timer - 1), 1000);
    return () => clearTimeout(t);
  }, [timer, phase]);

  function generateQuestions() {
    const qs = [];
    const squares = Object.keys(board);
    const emptySqs = [];
    for (const f of files) for (const r of ranks) {
      const sq = f + r;
      if (!board[sq]) emptySqs.push(sq);
    }

    // Q1: Is there a piece on square X?
    const randomSq = [...squares, ...emptySqs][Math.floor(Math.random() * (squares.length + emptySqs.length))];
    qs.push({
      text: `Is there a piece on ${randomSq}?`,
      type: 'yesno',
      correct: board[randomSq] ? 'Yes' : 'No',
    });

    // Q2: What piece is on square X?
    if (squares.length > 0) {
      const pSq = squares[Math.floor(Math.random() * squares.length)];
      const pName = pieceNames[board[pSq].type];
      qs.push({
        text: `What piece is on ${pSq}?`,
        type: 'choice',
        options: ['Knight', 'Bishop', 'Pawn', 'Rook', 'Queen', 'King'],
        correct: pName,
      });
    }

    // Q3: How many black pawns on kingside?
    let count = 0;
    for (const f of ['e','f','g','h']) for (const r of ranks) {
      const sq = f + r;
      if (board[sq] && board[sq].color === 'black' && board[sq].type === 'p') count++;
    }
    qs.push({ text: 'How many black pawns are on the kingside?', type: 'number', correct: String(count) });

    // Q4: white pieces count
    let wCount = 0;
    for (const sq of squares) if (board[sq].color === 'white') wCount++;
    qs.push({ text: 'How many white pieces are on the board?', type: 'number', correct: String(wCount) });

    // Q5: random empty square check
    const rSq2 = emptySqs.length > 0 ? emptySqs[Math.floor(Math.random() * emptySqs.length)] : squares[0];
    qs.push({
      text: `Is ${rSq2} empty?`,
      type: 'yesno',
      correct: board[rSq2] ? 'No' : 'Yes',
    });

    setQuestions(qs);
  }

  function submitAnswer(ans) {
    const q = questions[currentQ];
    const isCorrect = ans.toLowerCase() === q.correct.toLowerCase();
    if (isCorrect) setScore(s => s + 1);
    setFeedback({ correct: isCorrect, answer: q.correct });
    setTimeout(() => {
      setFeedback(null);
      setAnswer('');
      if (currentQ + 1 >= questions.length) {
        const finalScore = score + (isCorrect ? 1 : 0);
        progressService.recordDrillScore('board-vision', finalScore, Math.round((finalScore / questions.length) * 100));
        setPhase('done');
      } else {
        setCurrentQ(currentQ + 1);
      }
    }, 1200);
  }

  if (phase === 'viewing') {
    return (
      <div className="text-center space-y-4">
        <p className="text-text-dim">Memorize this position... <span className="text-gold font-semibold">{timer}s</span></p>
        <div className="max-w-[400px] mx-auto"><ChessBoard fen={fen} movable={false} /></div>
      </div>
    );
  }

  if (phase === 'done') {
    return (
      <div className="text-center space-y-4">
        <p className="text-2xl font-display text-gold">Score: {score}/{questions.length}</p>
        <p className="text-text-dim">{score === questions.length ? 'Perfect memory!' : 'Keep practicing to improve.'}</p>
      </div>
    );
  }

  const q = questions[currentQ];
  return (
    <div className="max-w-md mx-auto space-y-4">
      <p className="text-sm text-text-dim">Question {currentQ + 1}/{questions.length}</p>
      <p className="font-semibold">{q.text}</p>

      {feedback && (
        <div className={`rounded p-3 text-sm ${feedback.correct ? 'bg-correct/10 text-correct' : 'bg-incorrect/10 text-incorrect'}`}>
          {feedback.correct ? '&#10003; Correct!' : `&#10007; Answer: ${feedback.answer}`}
        </div>
      )}

      {!feedback && q.type === 'yesno' && (
        <div className="flex gap-3">
          <button onClick={() => submitAnswer('Yes')} className="flex-1 py-2 rounded bg-bg-card border border-bg-hover hover:bg-bg-hover">Yes</button>
          <button onClick={() => submitAnswer('No')} className="flex-1 py-2 rounded bg-bg-card border border-bg-hover hover:bg-bg-hover">No</button>
        </div>
      )}
      {!feedback && q.type === 'choice' && (
        <div className="grid grid-cols-2 gap-2">
          {q.options.map(o => (
            <button key={o} onClick={() => submitAnswer(o)} className="py-2 rounded bg-bg-card border border-bg-hover hover:bg-bg-hover text-sm">{o}</button>
          ))}
        </div>
      )}
      {!feedback && q.type === 'number' && (
        <form onSubmit={e => { e.preventDefault(); submitAnswer(answer); }} className="flex gap-2">
          <input
            type="number"
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            className="flex-1 bg-bg border border-bg-hover rounded px-3 py-2 text-text"
            min="0" max="16" autoFocus
          />
          <button type="submit" className="px-4 py-2 rounded bg-gold text-bg font-semibold">Submit</button>
        </form>
      )}
    </div>
  );
}

function BlindfoldDrill() {
  const [phase, setPhase] = useState('setup'); // setup | answering | done
  const [game] = useState(() => {
    const g = new Chess();
    const moveSets = [
      ['Nf3', 'd5', 'c4', 'e6'],
      ['e4', 'e5', 'Nf3', 'Nc6'],
      ['d4', 'Nf6', 'c4', 'g6'],
    ];
    const set = moveSets[Math.floor(Math.random() * moveSets.length)];
    for (const m of set) g.move(m);
    return { game: g, moves: set };
  });
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [targetPiece, setTargetPiece] = useState(null);
  const [feedback, setFeedback] = useState(null);

  function start() {
    // Pick a piece to ask about
    const board = game.game.board();
    const pieces = [];
    for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
      if (board[r][c] && board[r][c].type !== 'p') {
        pieces.push({ piece: board[r][c], square: files[c] + ranks[7 - r] });
      }
    }
    const target = pieces[Math.floor(Math.random() * pieces.length)];
    setTargetPiece(target);
    setPhase('answering');
  }

  function selectSquare(sq) {
    setSelectedSquare(sq);
    const correct = sq === targetPiece.square;
    setFeedback({ correct, answer: targetPiece.square });
    if (correct) progressService.recordDrillScore('blindfold', 1, 100);
    else progressService.recordDrillScore('blindfold', 0, 0);
    setTimeout(() => setPhase('done'), 1500);
  }

  if (phase === 'setup') {
    return (
      <div className="space-y-4">
        <div className="max-w-[400px] mx-auto">
          <ChessBoard fen="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" movable={false} />
        </div>
        <p className="text-text-dim text-sm text-center">Moves played: {game.moves.map((m, i) => `${i % 2 === 0 ? Math.floor(i / 2) + 1 + '. ' : ''}${m}`).join(' ')}</p>
        <div className="text-center">
          <button onClick={start} className="bg-gold text-bg px-5 py-2 rounded font-semibold hover:bg-gold-dim transition-colors">Start</button>
        </div>
      </div>
    );
  }

  if (phase === 'done') {
    return (
      <div className="text-center space-y-4">
        <p className={`text-lg font-semibold ${feedback?.correct ? 'text-correct' : 'text-incorrect'}`}>
          {feedback?.correct ? '&#10003; Correct!' : `&#10007; The ${pieceNames[targetPiece.piece.type]} was on ${targetPiece.square}`}
        </p>
        <div className="max-w-[400px] mx-auto"><ChessBoard fen={game.game.fen()} movable={false} highlights={[targetPiece.square]} /></div>
      </div>
    );
  }

  const colorName = targetPiece.piece.color === 'w' ? 'white' : 'black';
  return (
    <div className="space-y-4 max-w-md mx-auto">
      <p className="font-semibold text-center">Where is the {colorName} {pieceNames[targetPiece.piece.type]}?</p>
      <p className="text-text-dim text-sm text-center">Click the correct square on the grid below.</p>
      <div className="grid grid-cols-8 gap-0.5 max-w-[320px] mx-auto">
        {ranks.slice().reverse().map(r => files.map(f => {
          const sq = f + r;
          const isDark = (files.indexOf(f) + ranks.indexOf(r)) % 2 === 0;
          return (
            <button
              key={sq}
              onClick={() => selectSquare(sq)}
              className={`aspect-square text-[10px] flex items-center justify-center ${
                selectedSquare === sq ? 'bg-gold text-bg' : isDark ? 'bg-[#b58863]' : 'bg-[#f0d9b5]'
              } hover:opacity-80`}
            >
              {sq}
            </button>
          );
        }))}
      </div>
      {feedback && (
        <p className={`text-center text-sm ${feedback.correct ? 'text-correct' : 'text-incorrect'}`}>
          {feedback.correct ? '&#10003; Correct!' : `&#10007; It was on ${feedback.answer}`}
        </p>
      )}
    </div>
  );
}

function PieceCountingDrill() {
  const [phase, setPhase] = useState('viewing');
  const [fen] = useState(() => samplePositions[Math.floor(Math.random() * samplePositions.length)]);
  const [board] = useState(() => parseFen(fen));
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [timer, setTimer] = useState(4);

  useEffect(() => {
    if (phase !== 'viewing') return;
    if (timer <= 0) {
      generateQuestions();
      setPhase('answering');
      return;
    }
    const t = setTimeout(() => setTimer(timer - 1), 1000);
    return () => clearTimeout(t);
  }, [timer, phase]);

  function generateQuestions() {
    const squares = Object.keys(board);
    const qs = [];
    let wPieces = 0, bPieces = 0, wPawns = 0, bPawns = 0;
    for (const sq of squares) {
      if (board[sq].color === 'white') { wPieces++; if (board[sq].type === 'p') wPawns++; }
      else { bPieces++; if (board[sq].type === 'p') bPawns++; }
    }
    qs.push({ text: 'How many pieces does White have?', correct: String(wPieces) });
    qs.push({ text: 'How many pieces does Black have?', correct: String(bPieces) });
    qs.push({ text: 'Which player has more pawns?', correct: wPawns > bPawns ? 'White' : bPawns > wPawns ? 'Black' : 'Equal', type: 'choice', options: ['White', 'Black', 'Equal'] });
    qs.push({ text: 'How many white pawns are there?', correct: String(wPawns) });
    qs.push({ text: 'How many black pawns are there?', correct: String(bPawns) });
    setQuestions(qs);
  }

  function submitAnswer(ans) {
    const q = questions[currentQ];
    const isCorrect = ans.toLowerCase() === q.correct.toLowerCase();
    if (isCorrect) setScore(s => s + 1);
    setFeedback({ correct: isCorrect, answer: q.correct });
    setTimeout(() => {
      setFeedback(null);
      setAnswer('');
      if (currentQ + 1 >= questions.length) {
        const finalScore = score + (isCorrect ? 1 : 0);
        progressService.recordDrillScore('piece-counting', finalScore, Math.round((finalScore / questions.length) * 100));
        setPhase('done');
      } else setCurrentQ(currentQ + 1);
    }, 1000);
  }

  if (phase === 'viewing') {
    return (
      <div className="text-center space-y-4">
        <p className="text-text-dim">Study quickly... <span className="text-gold font-semibold">{timer}s</span></p>
        <div className="max-w-[400px] mx-auto"><ChessBoard fen={fen} movable={false} /></div>
      </div>
    );
  }
  if (phase === 'done') {
    return (
      <div className="text-center space-y-4">
        <p className="text-2xl font-display text-gold">Score: {score}/{questions.length}</p>
      </div>
    );
  }

  const q = questions[currentQ];
  return (
    <div className="max-w-md mx-auto space-y-4">
      <p className="text-sm text-text-dim">Question {currentQ + 1}/{questions.length}</p>
      <p className="font-semibold">{q.text}</p>
      {feedback && (
        <div className={`rounded p-3 text-sm ${feedback.correct ? 'bg-correct/10 text-correct' : 'bg-incorrect/10 text-incorrect'}`}>
          {feedback.correct ? '&#10003; Correct!' : `&#10007; Answer: ${feedback.answer}`}
        </div>
      )}
      {!feedback && q.type === 'choice' ? (
        <div className="flex gap-2">
          {q.options.map(o => <button key={o} onClick={() => submitAnswer(o)} className="flex-1 py-2 rounded bg-bg-card border border-bg-hover hover:bg-bg-hover text-sm">{o}</button>)}
        </div>
      ) : !feedback && (
        <form onSubmit={e => { e.preventDefault(); submitAnswer(answer); }} className="flex gap-2">
          <input type="number" value={answer} onChange={e => setAnswer(e.target.value)} className="flex-1 bg-bg border border-bg-hover rounded px-3 py-2 text-text" min="0" max="16" autoFocus />
          <button type="submit" className="px-4 py-2 rounded bg-gold text-bg font-semibold">Submit</button>
        </form>
      )}
    </div>
  );
}

const drills = [
  { id: 'board-vision', name: 'Board Vision', desc: 'Memorize a position, then answer questions about it.', Component: BoardVisionDrill },
  { id: 'blindfold', name: 'Blindfold Notation', desc: 'Track pieces mentally through a sequence of moves.', Component: BlindfoldDrill },
  { id: 'piece-counting', name: 'Piece Counting', desc: 'Quickly count pieces after a brief glimpse.', Component: PieceCountingDrill },
];

export default function VisualisationDrills() {
  const [activeDrill, setActiveDrill] = useState(null);
  const [key, setKey] = useState(0);
  const stats = progressService.getDrillStats();

  if (activeDrill) {
    const drill = drills.find(d => d.id === activeDrill);
    const DrillComponent = drill.Component;
    return (
      <div className="page-enter max-w-4xl mx-auto px-4 py-10">
        <button onClick={() => setActiveDrill(null)} className="text-text-dim hover:text-gold text-sm mb-4 inline-block">&larr; Back to Drills</button>
        <h1 className="text-2xl font-display text-gold mb-6">{drill.name}</h1>
        <DrillComponent key={key} />
        <div className="text-center mt-6">
          <button onClick={() => setKey(k => k + 1)} className="bg-gold text-bg px-5 py-2 rounded font-semibold hover:bg-gold-dim transition-colors">
            New Round
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-display text-gold mb-2">Visualisation Drills</h1>
      <p className="text-text-dim mb-8">Train your ability to read the board.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {drills.map(d => (
          <button key={d.id} onClick={() => setActiveDrill(d.id)} className="text-left bg-bg-card border border-bg-hover rounded-xl p-5 hover:border-gold/30 transition-colors">
            <h3 className="font-display text-base font-semibold mb-1">{d.name}</h3>
            <p className="text-sm text-text-dim mb-3">{d.desc}</p>
            {stats[d.id] && (
              <p className="text-xs text-text-dim">Best: {stats[d.id].best} &middot; Attempts: {stats[d.id].attempts}</p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
