const openingTraps = [
  // 1. Fishing Pole Trap — Ruy López
  {
    id: 'trap-1',
    name: 'Fishing Pole Trap',
    opening: 'Ruy López',
    difficulty: 'Intermediate',
    description: 'Black sacrifices a knight to lure White\'s kingside pawns forward and crack open the h-file against the castled king.',
    setupMoves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'Nf6', 'O-O', 'Ng4'],
    fen: 'r1bqkb1r/pppp1ppp/2n5/1B2p3/4P1n1/5N2/PPPP1PPP/RNBQ1RK1 w kq - 5 5',
    trapMove: 'h5',
    fenAfterTrap: 'r1bqkb1r/pppp1ppp/2n5/1B2p2p/4P1n1/5N2/PPPP1PPP/RNBQ1RK1 w kq h6 0 6',
    explanation: 'After ...h5, Black threatens ...h4-h3, cracking open the kingside. If White plays h3, Ng4xf2 is a strong sacrifice. The h-file becomes a highway to White\'s king.',
    howToAvoid: 'White should play d4 before castling, or after O-O simply play d3 and develop naturally rather than allowing Ng4.',
    solution: ['h5'],
  },

  // 2. Elephant Trap — Queen's Gambit Declined
  {
    id: 'trap-2',
    name: 'Elephant Trap',
    opening: 'Queen\'s Gambit Declined',
    difficulty: 'Beginner',
    description: 'Black lures White\'s bishop to capture on d5, then wins a piece with a devastating discovered attack.',
    setupMoves: ['d4', 'd5', 'c4', 'e6', 'Nc3', 'Nf6', 'Bg5', 'Nbd7', 'cxd5', 'exd5', 'Nxd5'],
    fen: 'r1bqkb1r/pppn1ppp/5n2/3Np1B1/3P4/8/PP2PPPP/R2QKBNR b KQkq - 0 6',
    trapMove: 'Nxd5',
    fenAfterTrap: 'r1bqkb1r/pppn1ppp/8/3np1B1/3P4/8/PP2PPPP/R2QKBNR w KQkq - 0 7',
    explanation: 'After ...Nxd5, White naturally recaptures Bxd8, but Black has Bb4+! forking king and queen. After Qd2 Bxd2+ Kxd2, Black plays Kxd8 and is up a whole piece.',
    howToAvoid: 'White should not play Nxd5 in this position. Instead, develop normally with Nf3 or e3.',
    solution: ['Nxd5'],
  },

  // 3. Fried Liver Attack — Italian Game
  {
    id: 'trap-3',
    name: 'Fried Liver Attack',
    opening: 'Italian Game',
    difficulty: 'Intermediate',
    description: 'White sacrifices a knight on f7 to expose Black\'s king and launch a devastating attack.',
    setupMoves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Nf6', 'Ng5', 'd5', 'exd5', 'Nxd5'],
    fen: 'r1bqkb1r/ppp2ppp/2n5/3nN1N1/2B5/8/PPPP1PPP/RNBQK2R w KQkq - 0 6',
    trapMove: 'Nxf7',
    fenAfterTrap: 'r1bqkb1r/ppp2Npp/2n5/3n4/2B5/8/PPPP1PPP/RNBQK2R b KQkq - 0 6',
    explanation: 'Nxf7 is a knight sacrifice that forks the queen and rook. After Kxf7, White plays Qf3+ and the Black king is dragged into the open. White gets a ferocious attack.',
    howToAvoid: 'Black should play ...Na5 instead of ...Nxd5, or avoid ...Nf6 in favour of ...h6 kicking the knight.',
    solution: ['Nxf7'],
  },

  // 4. Siberian Trap — Sicilian Smith-Morra
  {
    id: 'trap-4',
    name: 'Siberian Trap',
    opening: 'Sicilian Defence',
    difficulty: 'Advanced',
    description: 'In the Smith-Morra Gambit, Black sets up a devastating queen trap after White castles.',
    setupMoves: ['e4', 'c5', 'd4', 'cxd4', 'c3', 'dxc3', 'Nxc3', 'Nc6', 'Nf3', 'e6', 'Bc4', 'Qc7', 'O-O', 'Nf6', 'Qe2', 'Ng4'],
    fen: 'r1b1kb1r/ppqp1ppp/2n1p3/8/2B1P1n1/2N2N2/PP2QPPP/R1B2RK1 w kq - 6 9',
    trapMove: 'Qh2#',
    fenAfterTrap: 'r1b1kb1r/ppqp1ppp/2n1p3/8/2B1P1n1/2N2N2/PP2QPqP/R1B2RK1 w kq - 6 10',
    explanation: 'Black manoeuvres the knight to g4 and if White doesn\'t react, Qxh2# is checkmate. The knight on g4 and queen coordinate lethally against h2.',
    howToAvoid: 'White must play h3 to prevent Ng4, or be alert to the Qh2# threat. After Ng4, h3 is mandatory.',
    solution: ['Qh2#'],
  },

  // 5. Stafford Gambit — Petroff Defence
  {
    id: 'trap-5',
    name: 'Stafford Gambit',
    opening: 'Petroff Defence',
    difficulty: 'Intermediate',
    description: 'Black sacrifices a pawn with ...Nf6 allowing Nxe5, setting up tactical tricks if White isn\'t careful.',
    setupMoves: ['e4', 'e5', 'Nf3', 'Nf6', 'Nxe5', 'Nc6'],
    fen: 'r1bqkb1r/pppp1ppp/2n2n2/4N3/4P3/8/PPPP1PPP/RNBQKB1R w KQkq - 3 4',
    trapMove: 'Ng4',
    fenAfterTrap: 'r1bqkb1r/pppp1ppp/2n5/4N3/4P1n1/8/PPPP1PPP/RNBQKB1R w KQkq - 4 5',
    explanation: 'After Nxc6 dxc6, Black plays ...Ng4 threatening Qh4 with attacks on f2 and h2. Many traps lurk: Bc5 threatens Bxf2+ and Qb6 ideas give Black strong compensation.',
    howToAvoid: 'White should play d4 after Nxe5 and be prepared with Nf3 retreating rather than Nxc6.',
    solution: ['Ng4'],
  },

  // 6. Classical Caro-Kann Trap
  {
    id: 'trap-6',
    name: 'Caro-Kann Smothered Mate Trap',
    opening: 'Caro-Kann',
    difficulty: 'Beginner',
    description: 'White falls into a smothered mate after being greedy in the Caro-Kann.',
    setupMoves: ['e4', 'c6', 'd4', 'd5', 'Nc3', 'dxe4', 'Nxe4', 'Nd7', 'Qe2', 'Ngf6', 'Nd6#'],
    fen: 'r1bqkb1r/pp1npppp/2pN1n2/8/3P4/8/PPP1QPPP/R1B1KBNR b KQkq - 1 6',
    trapMove: 'Nd6#',
    fenAfterTrap: 'r1bqkb1r/pp1npppp/2pN1n2/8/3P4/8/PPP1QPPP/R1B1KBNR b KQkq - 1 6',
    explanation: 'Nd6# is checkmate! The knight on d6 delivers check, and the king is smothered by its own pieces. The e7 pawn blocks the king, the queen on e2 covers e7 escape.',
    howToAvoid: 'Black should play ...Ngf6 before ...Nd7, or play ...e5 to open the diagonal for the bishop.',
    solution: ['Nd6#'],
  },

  // 7. Winawer Poisoned Pawn — French Defence
  {
    id: 'trap-7',
    name: 'Winawer Poisoned Pawn Trap',
    opening: 'French Defence',
    difficulty: 'Advanced',
    description: 'In the French Winawer, Black grabs the b2 pawn but falls into a tactical sequence if they\'re not careful.',
    setupMoves: ['e4', 'e6', 'd4', 'd5', 'Nc3', 'Bb4', 'e5', 'c5', 'a3', 'Bxc3+', 'bxc3', 'Ne7', 'Qg4'],
    fen: 'rnbqk2r/pp2nppp/4p3/2ppP3/3P2Q1/P1P5/5PPP/R1B1KBNR b KQkq - 1 7',
    trapMove: 'Qc7',
    fenAfterTrap: 'rnb1k2r/ppq1nppp/4p3/2ppP3/3P2Q1/P1P5/5PPP/R1B1KBNR w KQkq - 2 8',
    explanation: 'Black plays ...Qc7 instead of grabbing the poisoned g7 pawn. If Black plays ...Kf8 or ...Rg8, White\'s Qg4 becomes a monster. ...Qc7 prepares ...cxd4 and keeps the position under control.',
    howToAvoid: 'White should continue with Nf3 and aggressive play; the position is double-edged.',
    solution: ['Qc7'],
  },

  // 8. Scandinavian Trap
  {
    id: 'trap-8',
    name: 'Scandinavian Queen Trap',
    opening: 'Scandinavian Defence',
    difficulty: 'Beginner',
    description: 'Black\'s queen gets trapped after being lured to a vulnerable square.',
    setupMoves: ['e4', 'd5', 'exd5', 'Qxd5', 'Nc3', 'Qa5', 'd4', 'Nf6', 'Nf3', 'Bf5', 'Bc4', 'e6', 'Nd5'],
    fen: 'rn2kb1r/ppp2ppp/4pn2/q2N1b2/2BP4/5N2/PPP2PPP/R1BQK2R b KQkq - 5 7',
    trapMove: 'Qd8',
    fenAfterTrap: 'rn1qkb1r/ppp2ppp/4pn2/3N1b2/2BP4/5N2/PPP2PPP/R1BQK2R w KQkq - 6 8',
    explanation: 'After Nd5, the knight forks the queen and threatens Nc7+ forking king and rook. The queen must retreat and Black loses material after Nc7+ Kd8 Nxa8.',
    howToAvoid: 'Black should avoid placing the queen on a5 where it can be hit by Nd5, or play ...c6 to control d5.',
    solution: ['Qd8'],
  },

  // 9. Budapest Gambit Trap
  {
    id: 'trap-9',
    name: 'Budapest Gambit Trap',
    opening: 'Budapest Gambit',
    difficulty: 'Intermediate',
    description: 'Black wins back the pawn with interest after a sneaky knight manoeuvre.',
    setupMoves: ['d4', 'Nf6', 'c4', 'e5', 'dxe5', 'Ng4', 'Bf4', 'Nc6', 'Nf3', 'Bb4+', 'Nbd2', 'Qe7', 'a3', 'Ngxe5'],
    fen: 'r1b1k2r/ppppqppp/2n5/4n3/1bP2B2/P4N2/1P1NPPPP/R2QKB1R w KQkq - 1 8',
    trapMove: 'Nxf3+',
    fenAfterTrap: 'r1b1k2r/ppppqppp/2n5/8/1bP2B2/P2n1N2/1P2PPPP/R2QKB1R w KQkq - 0 9',
    explanation: 'After ...Ngxe5, if White plays Nxe5 Nxe5, then ...Nd3+ is a fork winning the bishop on f4. Black regains the gambit pawn and wins material.',
    howToAvoid: 'White should play e3 instead of Bf4, keeping the position solid and maintaining the extra pawn.',
    solution: ['Nxf3+'],
  },

  // 10. Albin Counter-Gambit Trap (Lasker Trap)
  {
    id: 'trap-10',
    name: 'Lasker Trap',
    opening: 'Albin Counter-Gambit',
    difficulty: 'Intermediate',
    description: 'Black sacrifices material to promote a pawn to a knight with devastating effect.',
    setupMoves: ['d4', 'd5', 'c4', 'e5', 'dxe5', 'd4', 'e3', 'Bb4+', 'Bd2', 'dxe3'],
    fen: 'rnbqk1nr/ppp2ppp/8/4P3/1b6/4p3/PP1B1PPP/RN1QKBNR w KQkq - 0 6',
    trapMove: 'exf2+',
    fenAfterTrap: 'rnbqk1nr/ppp2ppp/8/4P3/1b6/8/PP1B1pPP/RN1QKBNR w KQkq - 0 7',
    explanation: 'After ...dxe3, if White plays Bxb4, then ...exf2+ Ke2 fxg1=N+! The pawn promotes to a knight with check, forking king and rook. A spectacular underpromotion trick.',
    howToAvoid: 'White should play fxe3 instead of Bxb4, recapturing the pawn safely.',
    solution: ['exf2+'],
  },

  // 11. English Opening Trap
  {
    id: 'trap-11',
    name: 'English Opening Knight Trap',
    opening: 'English Opening',
    difficulty: 'Intermediate',
    description: 'White traps Black\'s knight that ventures too deep into the queenside.',
    setupMoves: ['c4', 'e5', 'Nc3', 'Nf6', 'Nf3', 'Nc6', 'g3', 'Nd4', 'Bg2', 'Nxf3+', 'Bxf3', 'Bc5'],
    fen: 'r1bqk2r/pppp1ppp/5n2/2b1p3/2P5/2N2BP1/PP1PPP1P/R1BQK2R w KQkq - 2 7',
    trapMove: 'e3',
    fenAfterTrap: 'r1bqk2r/pppp1ppp/5n2/2b1p3/2P5/2N1PBP1/PP1P1P1P/R1BQK2R b KQkq - 0 7',
    explanation: 'e3 blocks the bishop\'s diagonal and prepares d4, gaining time. The bishop on c5 is awkwardly placed and must retreat, giving White a strong centre.',
    howToAvoid: 'Black should delay Bc5 and instead play d6 or Be7 for more flexible development.',
    solution: ['e3'],
  },

  // 12. Dutch Staunton Gambit Trap
  {
    id: 'trap-12',
    name: 'Staunton Gambit Trap',
    opening: 'Dutch Defence',
    difficulty: 'Advanced',
    description: 'White sacrifices a pawn in the Staunton Gambit and sets up a devastating attack if Black is careless.',
    setupMoves: ['d4', 'f5', 'e4', 'fxe4', 'Nc3', 'Nf6', 'Bg5', 'g6', 'f3', 'exf3', 'Nxf3', 'Bg7'],
    fen: 'rnbqk2r/ppppp1bp/5np1/6B1/3P4/2N2N2/PPP3PP/R2QKB1R w KQkq - 2 7',
    trapMove: 'Bd3',
    fenAfterTrap: 'rnbqk2r/ppppp1bp/5np1/6B1/3P4/2NB1N2/PPP3PP/R2QK2R b KQkq - 3 7',
    explanation: 'Bd3 sets up Bxf6 followed by Bxg6+, exploiting the weakened kingside. If Black castles, Bxf6 Bxf6 Bxg6 hxg6 Qd3 targets the g6 pawn with devastating effect.',
    howToAvoid: 'Black should avoid the passive ...Bg7 and instead play ...d5 to challenge the centre, or ...c6 preparing ...d5.',
    solution: ['Bd3'],
  },
];

export default openingTraps;
