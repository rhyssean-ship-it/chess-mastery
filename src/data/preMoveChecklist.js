const preMoveChecklist = {
  steps: [
    { id: 1, question: 'Are any of my pieces hanging?', description: 'Check every piece — is each one defended? If not, either defend it or move it.', icon: '\u26A0' },
    { id: 2, question: 'What is my opponent threatening?', description: 'Look at their last move. Does it attack something? Does it create a fork, pin, or skewer? Does it threaten checkmate?', icon: '\u2639' },
    { id: 3, question: 'Is my king safe?', description: 'Is your king castled? Is the pawn shield intact? Are there open files pointing at your king?', icon: '\u2654' },
    { id: 4, question: 'What is my plan?', description: 'Every move should have a purpose. Are you developing, attacking a weakness, improving a piece, or preparing a pawn break?', icon: '\u2605' },
    { id: 5, question: 'After I move, is anything hanging?', description: 'Before you click/touch the piece, visualise the board AFTER your move. Does your move leave anything undefended?', icon: '\u2714' },
  ],
  exercises: [
    // === BEGINNER (3) ===
    {
      id: 'pmc-1', difficulty: 'Beginner',
      fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
      plannedMove: 'Qh5',
      question: 'You want to play Qh5. Run through the checklist — is this a good move?',
      checklistAnswers: [
        { step: 1, answer: 'No hanging pieces — safe.', ok: true },
        { step: 2, answer: 'No immediate threats from Black.', ok: true },
        { step: 3, answer: 'King is still in centre but it\'s early.', ok: true },
        { step: 4, answer: 'The plan is to threaten Qxe5+ and Qxf7#.', ok: true },
        { step: 5, answer: 'BUT — the queen on h5 is exposed. Black can attack it with Nf6 gaining tempo. Moving the queen early violates opening principles.', ok: false },
      ],
      verdict: 'Bad move! While it threatens f7, bringing the queen out early wastes time. Play Nf3 or Bc4 instead — develop minor pieces first.',
      betterMove: 'Nf3',
    },
    {
      id: 'pmc-2', difficulty: 'Beginner',
      fen: 'r1bqkbnr/pppppppp/2n5/8/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3',
      plannedMove: 'Bc4',
      question: 'You want to play Bc4. Run through the checklist.',
      checklistAnswers: [
        { step: 1, answer: 'No pieces hanging.', ok: true },
        { step: 2, answer: 'No threats from Black — Nc6 just developed.', ok: true },
        { step: 3, answer: 'King not castled but we\'re developing toward it.', ok: true },
        { step: 4, answer: 'Bc4 develops a piece, eyes f7, and prepares castling.', ok: true },
        { step: 5, answer: 'After Bc4, no pieces are left hanging. The bishop is on a strong diagonal.', ok: true },
      ],
      verdict: 'Great move! Bc4 follows all opening principles: develops a piece, targets a weakness (f7), and prepares to castle.',
      betterMove: null,
    },
    {
      id: 'pmc-4', difficulty: 'Beginner',
      fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
      plannedMove: 'e5',
      question: 'As Black, you want to play e5. Run the checklist.',
      checklistAnswers: [
        { step: 1, answer: 'Starting position — nothing hanging.', ok: true },
        { step: 2, answer: 'White played e4 — controls d5 and f5.', ok: true },
        { step: 3, answer: 'King is safe in the starting position.', ok: true },
        { step: 4, answer: 'e5 claims the centre and mirrors White\'s strategy.', ok: true },
        { step: 5, answer: 'After e5, the pawn is defended by... nothing directly, but it\'s symmetrical. Standard and safe.', ok: true },
      ],
      verdict: 'Good move! 1...e5 is the most popular response — it fights for the centre immediately.',
      betterMove: null,
    },

    // === INTERMEDIATE (2) ===
    {
      id: 'pmc-3', difficulty: 'Intermediate',
      fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',
      plannedMove: 'Nxe5',
      question: 'You want to capture Nxe5. Is this safe?',
      checklistAnswers: [
        { step: 1, answer: 'No hanging pieces currently.', ok: true },
        { step: 2, answer: 'Black\'s pieces are developed actively — Bc5 eyes f2.', ok: true },
        { step: 3, answer: 'King not yet castled — should castle soon.', ok: true },
        { step: 4, answer: 'Winning a pawn seems good...', ok: true },
        { step: 5, answer: 'DANGER! After Nxe5 Nxe5, the knight on e5 is fine, but then Black can play Bxf2+! forking the king and rook. This is a known trap.', ok: false },
      ],
      verdict: 'Trap! Nxe5 looks like it wins a pawn, but Bxf2+ is a devastating fork. Castle first with O-O instead.',
      betterMove: 'O-O',
    },
    {
      id: 'pmc-5', difficulty: 'Intermediate',
      fen: 'r1bqk2r/ppppbppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQ1RK1 b kq - 5 5',
      plannedMove: 'Nxe4',
      question: 'Black wants to play Nxe4 winning a pawn. Safe?',
      checklistAnswers: [
        { step: 1, answer: 'Check Black\'s pieces — all seem defended.', ok: true },
        { step: 2, answer: 'White just castled — no immediate threat.', ok: true },
        { step: 3, answer: 'Black\'s king hasn\'t castled yet — should prioritise this.', ok: false },
        { step: 4, answer: 'Winning a centre pawn seems great...', ok: true },
        { step: 5, answer: 'After Nxe4, White plays Re1 pinning the knight to the king. Black is in trouble because they haven\'t castled!', ok: false },
      ],
      verdict: 'Dangerous! Grabbing the e4 pawn before castling invites Re1 with a nasty pin. Castle first with O-O, then consider taking.',
      betterMove: 'O-O',
    },
  ],
};

export default preMoveChecklist;
