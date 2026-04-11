const gamePhases = [
  {
    id: 'opening',
    title: 'The Opening',
    phase: 'Opening',
    principles: [
      'Control the centre with pawns (e4/d4)',
      'Develop knights and bishops early',
      'Castle within the first 10 moves',
      'Don\'t move the same piece twice without reason',
      'Don\'t bring the queen out too early',
    ],
    content: [
      {
        type: 'text',
        content: 'The opening is the first phase of the game, typically lasting 10-15 moves. Your main goals are to control the centre, develop your pieces to active squares, and get your king to safety by castling. A good opening sets you up for a strong middlegame.',
      },
      {
        type: 'position',
        fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1',
        caption: 'After 1.e4 — White occupies the centre and opens lines for the bishop and queen.',
        arrows: [['e2', 'e4']],
        highlights: ['e4', 'd4', 'e5', 'd5'],
      },
      {
        type: 'text',
        content: 'The four central squares — d4, d5, e4, and e5 — are the most important squares on the board. Pieces placed in or near the centre control more squares and can reach both sides of the board quickly. Pawns in the centre restrict your opponent\'s pieces.',
      },
      {
        type: 'text',
        content: 'Development means moving your pieces from their starting squares to more active positions. Knights should typically go to f3/c3 (or f6/c6 for Black), and bishops to active diagonals. Each move that doesn\'t develop a new piece is potentially a wasted tempo.',
      },
      {
        type: 'position',
        fen: 'r1bqk2r/ppppbppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',
        caption: 'Both sides have developed knights and bishops. White should castle next.',
        arrows: [['e1', 'g1']],
        highlights: ['c6', 'f6', 'c4', 'f3'],
      },
    ],
    dos: [
      'Develop a new piece with every move',
      'Castle early, usually kingside',
      'Control the centre with pawns and pieces',
      'Connect your rooks by developing all minor pieces',
      'Look at your opponent\'s moves and respond to threats',
    ],
    donts: [
      'Move the queen out early where it can be attacked',
      'Move the same piece twice without a good reason',
      'Ignore development to grab wing pawns',
      'Push too many pawns instead of developing pieces',
      'Leave your king in the centre too long',
    ],
  },
  {
    id: 'middlegame',
    title: 'The Middlegame',
    phase: 'Middlegame',
    principles: [
      'Create a plan based on the pawn structure',
      'Improve your worst-placed piece',
      'Control open files with rooks',
      'Create weaknesses in your opponent\'s position',
      'Coordinate your pieces for attack or defence',
    ],
    content: [
      {
        type: 'text',
        content: 'The middlegame begins once both sides have completed development and castled. This is where the real battle takes place. You need to formulate a plan based on the position\'s characteristics: pawn structure, piece activity, king safety, and space.',
      },
      {
        type: 'position',
        fen: 'r1bq1rk1/pp2bppp/2n1pn2/2pp4/3P1B2/2PBPN2/PP1N1PPP/R2Q1RK1 w - - 0 8',
        caption: 'A typical middlegame position. White should plan e4 to challenge the centre, or place rooks on open files.',
        arrows: [['e3', 'e4'], ['a1', 'd1']],
        highlights: ['d4', 'd5', 'c5'],
      },
      {
        type: 'text',
        content: 'Piece activity is king in the middlegame. A well-placed knight on an outpost (a square protected by your pawn that cannot be attacked by opponent\'s pawns) is often worth more than a passive bishop. Always ask: "Which is my worst piece, and how can I improve it?"',
      },
      {
        type: 'text',
        content: 'Tactics decide most middlegame battles. Always check for forks, pins, skewers, discovered attacks, and back rank threats before making your move. Calculate forcing moves (checks, captures, threats) first, then consider quiet improving moves.',
      },
      {
        type: 'position',
        fen: 'r4rk1/pp2bppp/2n1pn2/q1Bp4/3P4/2N1PN2/PP3PPP/R2Q1RK1 w - - 0 10',
        caption: 'White\'s bishop on c5 is actively placed. The rooks should aim for the open or semi-open files.',
        arrows: [['f1', 'e1'], ['a1', 'c1']],
        highlights: ['c5', 'e1', 'c1'],
      },
      {
        type: 'text',
        content: 'When attacking, concentrate your forces on the weakest point in your opponent\'s position. When defending, trade off your opponent\'s most dangerous attacking pieces and try to create counterplay on the opposite side of the board.',
      },
    ],
    dos: [
      'Create a plan based on the pawn structure',
      'Place rooks on open and semi-open files',
      'Establish outposts for your knights',
      'Look for tactical opportunities every move',
      'Coordinate your pieces before launching an attack',
    ],
    donts: [
      'Attack without sufficient pieces',
      'Ignore your opponent\'s threats',
      'Trade pieces when you have the initiative',
      'Create weaknesses in your own pawn structure without reason',
      'Play aimlessly without a plan',
    ],
  },
  {
    id: 'endgame',
    title: 'The Endgame',
    phase: 'Endgame',
    principles: [
      'Activate your king — it becomes a fighting piece',
      'Passed pawns must be pushed',
      'Rooks belong behind passed pawns',
      'In rook endings, keep your rook active',
      'The opposition (king facing king) is crucial in pawn endings',
    ],
    content: [
      {
        type: 'text',
        content: 'The endgame begins when most pieces have been exchanged and queens are off the board (though queen endgames exist too). The character of the game changes completely: the king transforms from a piece to protect into a powerful attacking piece that should march toward the centre.',
      },
      {
        type: 'position',
        fen: '8/5kpp/8/5pP1/5P2/6K1/8/8 w - - 0 1',
        caption: 'A king and pawn endgame. White\'s king must advance to support the passed pawn. The concept of "opposition" is critical here.',
        arrows: [['g3', 'f3'], ['g3', 'h4']],
        highlights: ['g5', 'f4', 'f5'],
      },
      {
        type: 'text',
        content: 'Passed pawns are the endgame\'s most valuable asset. A passed pawn is one with no opposing pawns blocking or guarding its path to promotion. Push passed pawns, escort them with your king, and place rooks behind them (whether yours or your opponent\'s).',
      },
      {
        type: 'text',
        content: 'The "opposition" is when two kings stand facing each other with one square between them. The player NOT to move has the opposition and the advantage, because the other king must give way. Mastering this concept is essential for winning king and pawn endgames.',
      },
      {
        type: 'position',
        fen: '8/8/8/8/8/4k3/4P3/4K3 w - - 0 1',
        caption: 'Black has the opposition. If White pushes e4, Black plays Ke4. White must find a way to outflank with the king.',
        arrows: [['e1', 'd2'], ['e1', 'f2']],
        highlights: ['e3', 'e1'],
      },
      {
        type: 'text',
        content: 'In rook endgames (the most common type), keep your rook active even at the cost of a pawn. An active rook that attacks pawns and restricts the opponent\'s king is far more valuable than a passive rook defending a single pawn. Remember Tarrasch\'s rule: place rooks behind passed pawns.',
      },
    ],
    dos: [
      'Bring your king to the centre immediately',
      'Create and push passed pawns',
      'Keep your rook active in rook endgames',
      'Learn basic checkmate patterns (K+R vs K, K+Q vs K)',
      'Use the concept of opposition in king and pawn endgames',
    ],
    donts: [
      'Keep your king passive on the back rank',
      'Rush to promote without calculating properly',
      'Use your rook passively to defend one pawn',
      'Forget that the king is a strong piece in the endgame',
      'Neglect studying basic endgame positions — they decide many games',
    ],
  },
];

export default gamePhases;
