// Quick-check exercises for the Spy, Scan, Safe routine (the steps themselves live in
// services/spyScanSafe.js so every feature uses the same wording).
// Verdicts checked with Stockfish (depth 15).
const preMoveChecklist = {
  exercises: [
    // === BEGINNER ===
    {
      id: 'pmc-1', difficulty: 'Beginner',
      fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
      plannedMove: 'Qh5',
      question: 'You want to play Qh5. Run Spy, Scan, Safe. Is it a good idea?',
      answers: {
        spy: { answer: '…e5 claimed the centre. Nothing of yours is attacked and they have no threat.', ok: true },
        scan: { answer: 'No checks or captures for either side. Qh5 would create a threat (Qxe5+).', ok: true },
        safe: { answer: 'The queen isn’t attacked on h5, but Black defends with …Nc6 and then hits her with …g6 or …Nf6, gaining time while you move her again.', ok: false },
      },
      verdict: 'Not the best. Qh5 threatens e5, but Black defends easily and develops while chasing your queen. Develop a minor piece first.',
      betterMove: 'Nf3',
    },
    {
      id: 'pmc-2', difficulty: 'Beginner',
      fen: 'r1bqkbnr/pppppppp/2n5/8/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3',
      plannedMove: 'Bc4',
      question: 'You want to play Bc4. Run the routine.',
      answers: {
        spy: { answer: '…Nc6 developed and eyes d4 and e5. No threat to you.', ok: true },
        scan: { answer: 'Nothing forcing for either side.', ok: true },
        safe: { answer: 'The bishop isn’t attacked on c4, nothing is left hanging, and it prepares castling.', ok: true },
      },
      verdict: 'Good move. Bc4 develops, aims at f7 and gets you ready to castle.',
      betterMove: null,
    },
    {
      id: 'pmc-4', difficulty: 'Beginner',
      fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
      plannedMove: 'e5',
      question: 'As Black, you want to play e5. Run the routine.',
      answers: {
        spy: { answer: 'e4 grabbed the centre and opened lines for White’s queen and bishop. No threat yet.', ok: true },
        scan: { answer: 'No checks, captures or threats for either side.', ok: true },
        safe: { answer: 'Nothing attacks e5 yet, and the move opens lines for your own queen and bishop.', ok: true },
      },
      verdict: 'Good move. 1…e5 is the most popular reply: it fights for the centre straight away.',
      betterMove: null,
    },

    // === INTERMEDIATE ===
    {
      id: 'pmc-3', difficulty: 'Intermediate',
      fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',
      plannedMove: 'Nxe5',
      question: 'You want to capture Nxe5. Is it safe?',
      answers: {
        spy: { answer: '…Nf6 attacks your e4 pawn, and nothing defends it. Pass: they’d play …Nxe4.', ok: false },
        scan: { answer: 'Captures: count on e5. Your knight attacks it once and their c6 knight defends it once. Nxe5 Nxe5 gives a knight for a pawn.', ok: false },
        safe: { answer: 'The knight lands on a defended square and gets taken. (The d4 fork trick doesn’t save it: …Bb4+ keeps Black a piece up.)', ok: false },
      },
      verdict: 'Bad move. e5 is defended, so Nxe5 just loses a piece. Spy also found a threat to e4, and d3 deals with it.',
      betterMove: 'd3',
    },
    {
      id: 'pmc-5', difficulty: 'Intermediate',
      fen: 'r1bqk2r/ppppbppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQ1RK1 b kq - 5 5',
      plannedMove: 'Nxe4',
      question: 'Black wants to play Nxe4, grabbing a centre pawn. Safe?',
      answers: {
        spy: { answer: 'White just castled. Nothing of yours is attacked.', ok: true },
        scan: { answer: 'Captures: e4 has no defenders (no knight on c3, no pawn on d3), so Nxe4 wins a pawn.', ok: true },
        safe: { answer: 'And then what? Re1 or Bd5 hits the knight, but it retreats to f6 safely and nothing is left hanging.', ok: true },
      },
      verdict: 'Good move. A free pawn: White has forgotten to defend e4. The engine rates it Black’s best move (≈ +1).',
      betterMove: null,
    },
  ],
};

export default preMoveChecklist;
