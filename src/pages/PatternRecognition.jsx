import { useState, useEffect, useMemo } from 'react';
import ChessBoard from '../components/ChessBoard';
import { progressService } from '../services/progressService';

const positions = [
  { fen: 'r1bq1rk1/pp2bppp/2n1pn2/2pp4/3P4/2NBPN2/PP3PPP/R1BQ1RK1 w - - 0 8', better: 'equal', reason: 'Roughly equal. White has a slight space edge but Black is solid with no weaknesses.' },
  { fen: 'r1bq1rk1/ppp2ppp/2n1pn2/3p4/1bPP4/2N1PN2/PP3PPP/R1BQKB1R w KQ - 0 6', better: 'white', reason: 'White is slightly better due to the central pawn duo and more space. Black\'s bishop on b4 may have to retreat.' },
  { fen: 'rnbq1rk1/pp2ppbp/5np1/2pp4/2PP4/2N2NP1/PP2PPBP/R1BQ1RK1 w - - 0 7', better: 'equal', reason: 'A typical Grunfeld position — dynamically equal. Black has counterplay against d4 while White has central space.' },
  { fen: 'r1bqk2r/ppp1bppp/2n1pn2/3p4/2PP4/2N2N2/PP2PPPP/R1BQKB1R w KQkq - 4 5', better: 'white', reason: 'White has a slight opening advantage with the two central pawns and better development. Black is solid but passive.' },
  { fen: 'r2q1rk1/pp2bppp/2n1bn2/3pp3/8/1BN1PN2/PPP2PPP/R1BQ1RK1 w - - 0 9', better: 'black', reason: 'Black has a strong central pawn duo (d5+e5) and active pieces. White\'s pawn on e3 is passive.' },
  { fen: 'r1bq1rk1/1pp2ppp/p1np1n2/4p1B1/2B1P1b1/2NP1N2/PPP2PPP/R2Q1RK1 w - - 0 8', better: 'white', reason: 'White has a strong grip on the position. The Bg5 pin is annoying, the Bc4 eyes f7, and White\'s pieces are more actively placed.' },
  { fen: 'r1b2rk1/ppq1bppp/2n1pn2/2pp4/3P4/1PN1PN2/P1P1BPPP/R1BQ1RK1 w - - 0 8', better: 'equal', reason: 'A balanced position from the Nimzo-Indian. Both sides have completed development and have no weaknesses.' },
  { fen: 'r1bq1rk1/pp1n1ppp/4pn2/2ppP3/3P4/2PB1N2/PP1N1PPP/R1BQ1RK1 b - - 0 9', better: 'white', reason: 'White has more space with the e5 pawn and a typical French Advance advantage. Black is cramped but solid.' },
  { fen: 'r2qr1k1/ppp1bppp/2n2n2/3p1b2/3P1B2/2N1PN2/PPP1BPPP/R2QK2R w KQ - 6 8', better: 'equal', reason: 'Symmetrical development — both sides have similar piece activity. White has a tiny edge due to first-move advantage.' },
  { fen: 'r2q1rk1/1b2bppp/ppn1pn2/2pp4/3P1B2/1QN1PN2/PP2BPPP/R4RK1 w - - 0 10', better: 'black', reason: 'Black has a strong position: solid centre, bishop pair potential, active minor pieces. White\'s queen on b3 is well placed but Black has more long-term potential.' },
];

export default function PatternRecognition() {
  const [phase, setPhase] = useState('viewing'); // viewing | answering | feedback | done
  const [timer, setTimer] = useState(8);
  const shuffled = useMemo(() => [...positions].sort(() => Math.random() - 0.5).slice(0, 6), []);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answer, setAnswer] = useState(null);
  const [score, setScore] = useState(0);

  const pos = shuffled[currentIdx];

  useEffect(() => {
    if (phase !== 'viewing') return;
    if (timer <= 0) { setPhase('answering'); return; }
    const t = setTimeout(() => setTimer(timer - 1), 1000);
    return () => clearTimeout(t);
  }, [timer, phase]);

  function submitAnswer(ans) {
    setAnswer(ans);
    if (ans === pos.better) setScore(s => s + 1);
    setPhase('feedback');
  }

  function next() {
    if (currentIdx + 1 >= shuffled.length) {
      progressService.recordDrillScore('pattern-recognition', score, Math.round((score / shuffled.length) * 100));
      setPhase('done');
      return;
    }
    setCurrentIdx(i => i + 1);
    setAnswer(null);
    setTimer(8);
    setPhase('viewing');
  }

  if (phase === 'done') {
    return (
      <div className="page-enter max-w-3xl mx-auto px-6 py-16 text-center">
        <h1 className="text-3xl font-display text-gold mb-4">Results</h1>
        <p className="text-2xl font-bold mb-2 tabular-nums">{score}/{shuffled.length}</p>
        <p className="text-text-dim mb-6">{score >= 5 ? 'Excellent positional intuition!' : score >= 3 ? 'Good eye! Keep practicing.' : 'Study more positions to improve your evaluation.'}</p>
        <button onClick={() => { setCurrentIdx(0); setAnswer(null); setScore(0); setTimer(8); setPhase('viewing'); }} className="bg-gold text-bg px-6 py-2.5 rounded-lg font-semibold hover:bg-gold-dim transition-all btn-press">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="page-enter max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-display text-gold mb-1">Pattern Recognition</h1>
      <p className="text-text-dim text-sm mb-8">Evaluate the position quickly — who stands better?</p>

      <div className="flex items-center gap-3 mb-6 text-sm text-text-dim">
        <span>Position {currentIdx + 1}/{shuffled.length}</span>
        <span>&middot;</span>
        <span className="tabular-nums">Score: {score}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
        <div className="w-full max-w-[480px]">
          <ChessBoard fen={pos.fen} movable={false} />
        </div>

        <div className="space-y-4">
          {phase === 'viewing' && (
            <div className="card-base p-6 text-center">
              <p className="text-text-dim text-sm mb-3">Study this position...</p>
              <p className="text-3xl font-bold text-gold tabular-nums">{timer}s</p>
            </div>
          )}

          {phase === 'answering' && (
            <>
              <p className="font-semibold text-sm">Who has the better position?</p>
              <div className="space-y-2">
                {[
                  { value: 'white', label: 'White is better', icon: '&#9812;' },
                  { value: 'equal', label: 'Roughly equal', icon: '=' },
                  { value: 'black', label: 'Black is better', icon: '&#9818;' },
                ].map(opt => (
                  <button key={opt.value} onClick={() => submitAnswer(opt.value)} className="card-base p-4 w-full text-left text-sm hover:border-gold/30 transition-all btn-press">
                    <span className="mr-2" dangerouslySetInnerHTML={{ __html: opt.icon }} /> {opt.label}
                  </button>
                ))}
              </div>
            </>
          )}

          {phase === 'feedback' && (
            <>
              <div className={`rounded-xl p-4 border text-sm ${answer === pos.better ? 'bg-correct/10 border-correct/30' : 'bg-incorrect/10 border-incorrect/30'}`}>
                <p className="font-semibold mb-1">{answer === pos.better ? '&#10003; Correct!' : '&#10007; Not quite'}</p>
                <p className="text-text-dim">{pos.reason}</p>
              </div>
              <button onClick={next} className="w-full bg-gold text-bg py-2.5 rounded-lg font-semibold hover:bg-gold-dim transition-all btn-press">
                {currentIdx + 1 >= shuffled.length ? 'See Results' : 'Next Position'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
