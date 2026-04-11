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
      {
        type: 'heading',
        content: 'Pawn Structures from the Opening',
      },
      {
        type: 'text',
        content: 'The pawn structure you create in the opening determines the character of the entire game. Different openings lead to different structures, and understanding what kind of middlegame your structure creates is one of the most important skills in chess.',
      },
      {
        type: 'position',
        fen: 'rnbqkb1r/pp3ppp/4pn2/2pp4/2PP4/2N2N2/PP2PPPP/R1BQKB1R w KQkq - 0 4',
        caption: 'The Queen\'s Gambit pawn structure. White controls more central space with pawns on c4 and d4. Black\'s structure is solid but slightly cramped.',
        arrows: [['c4', 'd5']],
        highlights: ['c4', 'd4', 'c5', 'd5'],
      },
      {
        type: 'text',
        content: 'Open games (1.e4 e5) tend to lead to tactical play with open lines. Semi-open games (1.e4 c5, 1.e4 e6) create asymmetric structures where each side has different plans. Closed games (1.d4 d5) often lead to strategic, manoeuvring play.',
      },
      {
        type: 'position',
        fen: 'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2',
        caption: 'The Sicilian Defence (1...c5). Black fights for the centre asymmetrically — rather than mirroring e5, Black strikes from the flank. This leads to rich, unbalanced positions.',
        arrows: [['c5', 'd4']],
        highlights: ['c5', 'e4'],
      },
      {
        type: 'heading',
        content: 'Development Priorities',
      },
      {
        type: 'text',
        content: 'The ideal development order: 1) Central pawns to claim the centre, 2) Knights before bishops (knights have fewer good squares so decide early), 3) Bishops to active diagonals, 4) Castle to connect the rooks, 5) Rooks to open or semi-open files, 6) Finally position the queen.',
      },
      {
        type: 'position',
        fen: 'r1bq1rk1/pppn1ppp/4pn2/3p4/1bPP4/2N1PN2/PP3PPP/R1BQKB1R w KQ - 0 6',
        caption: 'Black has developed purposefully: knights to natural squares, bishop actively pinning, castled early. White still needs to develop the dark-squared bishop and castle.',
        highlights: ['b4', 'f6', 'd7'],
      },
      {
        type: 'text',
        content: 'Tempo is critical in the opening. A tempo is one move\'s worth of time. If you move a piece twice, your opponent gets a free tempo to develop. If your opponent wastes tempi, you gain a development advantage that can be converted into an attack.',
      },
      {
        type: 'heading',
        content: 'Choosing an Opening System',
      },
      {
        type: 'text',
        content: 'For beginners, start with 1.e4 as White (open, tactical play that teaches piece activity) and 1...e5 as Black (solid, classical). As you progress, expand to 1.d4 as White and defences like the Sicilian, French, or Caro-Kann. Choose openings that match your style: tactical players suit the Sicilian or King\'s Indian; positional players suit the Queen\'s Gambit or English.',
      },
      {
        type: 'text',
        content: 'Don\'t memorise moves — understand ideas. Know the first 5-8 moves and, more importantly, understand the plans that follow. Why does the knight go to c3? What does the bishop do on c4 vs d3? Understanding the "why" means you can find good moves even when your opponent plays something unexpected.',
      },
    ],
    dos: [
      'Develop a new piece with every move',
      'Castle early, usually kingside',
      'Control the centre with pawns and pieces',
      'Connect your rooks by developing all minor pieces',
      'Look at your opponent\'s moves and respond to threats',
      'Learn the ideas behind your openings, not just the moves',
      'Choose openings that suit your style and stick with them',
    ],
    donts: [
      'Move the queen out early where it can be attacked',
      'Move the same piece twice without a good reason',
      'Ignore development to grab wing pawns',
      'Push too many pawns instead of developing pieces',
      'Leave your king in the centre too long',
      'Memorise long opening lines without understanding the plans',
      'Switch openings constantly — build a focused repertoire',
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
        type: 'heading',
        content: 'Attack Patterns',
      },
      {
        type: 'text',
        content: 'Attacks on the king typically require at least three pieces participating, along with weaknesses in the opponent\'s king position. The most common attacking themes: pawn storms against a castled king, sacrifices to open lines (Bxh7+, Nxf7), exploiting a weakened fianchetto, and doubling on an open file toward the king.',
      },
      {
        type: 'position',
        fen: 'r1b2rk1/pp1nqppp/2n1p3/2ppP3/3P4/2PB1N2/PP2QPPP/RNB2RK1 w - - 0 10',
        caption: 'A French Advance structure. White\'s space advantage on the kingside suggests an attack there. Plans include Qe3-Qh3, bringing pieces toward h7, or a pawn storm with f4-f5.',
        arrows: [['e2', 'h5'], ['f2', 'f4']],
        highlights: ['e5', 'h7'],
      },
      {
        type: 'text',
        content: 'A key attacking principle: attack where you have more space. In positions with a closed centre, the side with more space on the kingside attacks there, and vice versa. In the French Advance or King\'s Indian, this creates the classic "race" between opposite-side attacks.',
      },
      {
        type: 'heading',
        content: 'Positional Play',
      },
      {
        type: 'text',
        content: 'Not every position calls for a direct attack. Positional play involves slowly improving your pieces, creating weaknesses in the opponent\'s camp, and restricting their counterplay. Key positional concepts: outposts, the bishop pair, good vs bad bishops, pawn majorities, and control of key files.',
      },
      {
        type: 'position',
        fen: 'r2q1rk1/pb2bppp/1pn1pn2/2pp4/3P1B2/1QN1PN2/PP2BPPP/R4RK1 w - - 0 10',
        caption: 'White has the bishop pair in a semi-open position. The strategic plan is to open the position with dxc5 to unleash the bishops\' long-range power.',
        arrows: [['d4', 'c5']],
        highlights: ['f4', 'e2'],
      },
      {
        type: 'text',
        content: 'The bishop pair (having both bishops while your opponent has traded one) is a lasting advantage in open positions. Plan to open the position by exchanging pawns. Conversely, if your opponent has the bishop pair, keep the position closed with fixed pawns.',
      },
      {
        type: 'heading',
        content: 'Strategic Themes',
      },
      {
        type: 'text',
        content: 'Prophylaxis means preventing your opponent\'s plans before they execute them. Before making your own plan, ask: "What does my opponent want to do?" If you can stop their best idea with a quiet move, that\'s often the strongest choice. The great players spend as much time thinking about their opponent\'s plans as their own.',
      },
      {
        type: 'text',
        content: 'The Isolated Queen\'s Pawn (IQP) is a common structure where a pawn on d4 has no neighbouring pawns on c or e files. It provides dynamic play with central control, open files for rooks, and outposts on c5 and e5. But if pieces get traded, it becomes a weakness in the endgame.',
      },
      {
        type: 'position',
        fen: 'r1bq1rk1/pp2bppp/2n1pn2/3p4/3P4/2NBPN2/PP3PPP/R1BQ1RK1 w - - 0 8',
        caption: 'A classic IQP position. White has active piece play and a central outpost on e5. The d4 pawn controls c5 and e5, but could become weak if pieces are traded off.',
        arrows: [['f3', 'e5'], ['d3', 'h7']],
        highlights: ['d4', 'e5', 'c5'],
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
      {
        type: 'heading',
        content: 'When to Trade Pieces',
      },
      {
        type: 'text',
        content: 'Trade pieces when: you are ahead in material (simplification), your opponent\'s pieces are more active, or you want to transition to a favourable endgame. Avoid trades when: you have the initiative, you are attacking the king, or your pieces are better placed.',
      },
      {
        type: 'text',
        content: 'A useful rule: trade the opponent\'s best piece, and keep your best piece. If their knight on d5 is dominant, offer to exchange knights. If your bishop pair is an advantage, avoid swapping bishops.',
      },
    ],
    dos: [
      'Create a plan based on the pawn structure',
      'Place rooks on open and semi-open files',
      'Establish outposts for your knights',
      'Look for tactical opportunities every move',
      'Coordinate your pieces before launching an attack',
      'Think about your opponent\'s plans (prophylaxis)',
      'Trade pieces strategically, not randomly',
      'Attack where you have more space',
    ],
    donts: [
      'Attack without sufficient pieces',
      'Ignore your opponent\'s threats',
      'Trade pieces when you have the initiative',
      'Create weaknesses in your own pawn structure without reason',
      'Play aimlessly without a plan',
      'Open the position when your opponent has the bishop pair',
      'Launch a premature attack with insufficient pieces',
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
        type: 'heading',
        content: 'King and Pawn Endgames',
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
        content: 'Key squares: every pawn has "key squares" that, if the attacking king reaches, guarantee promotion. For a pawn on e5, the key squares are d7, e7, and f7. If you can get your king to a key square, you win — regardless of where the defending king is.',
      },
      {
        type: 'text',
        content: 'The rule of the square: to check if a king can catch a passed pawn, draw a diagonal square from the pawn to its promotion square. If the defending king is inside this square, it catches the pawn. If outside, the pawn promotes. A simple geometric shortcut that saves calculation.',
      },
      {
        type: 'heading',
        content: 'Rook Endgames',
      },
      {
        type: 'text',
        content: 'Rook endgames are the most common endgame type and arise in roughly half of all games. Two essential positions to know: the Lucena position (winning with a rook and pawn on the 7th rank by "building a bridge") and the Philidor position (drawing by keeping the rook on the 3rd rank).',
      },
      {
        type: 'position',
        fen: '3K4/3P1k2/8/8/8/8/8/4R3 w - - 0 1',
        caption: 'The Lucena Position. White wins by "building a bridge": Re4 (rook to the 4th rank), then Kc7, and when checked from behind, the rook interposes on d4.',
        arrows: [['e1', 'e4']],
        highlights: ['d8', 'd7'],
      },
      {
        type: 'text',
        content: 'In rook endgames, keep your rook active even at the cost of a pawn. An active rook that attacks pawns and restricts the opponent\'s king is far more valuable than a passive rook defending a single pawn. Remember Tarrasch\'s rule: place rooks behind passed pawns.',
      },
      {
        type: 'text',
        content: 'A rook on the 7th rank is one of the most powerful pieces in chess. It attacks pawns from behind, confines the enemy king, and creates mating threats. Achieving a 7th rank rook is often the strategic goal in rook endgames.',
      },
      {
        type: 'heading',
        content: 'Minor Piece Endgames',
      },
      {
        type: 'text',
        content: 'Bishop vs knight: in open positions with pawns on both sides of the board, the bishop is usually superior due to its long-range power. In closed positions with fixed pawns, the knight excels because it can hop over pawns and occupy outposts. If you have a bishop, open the position; if you have a knight, keep it closed.',
      },
      {
        type: 'position',
        fen: '8/pp3kpp/4p3/3pP3/PP1n4/4BK2/8/8 b - - 0 1',
        caption: 'The knight dominates this closed position. It occupies a beautiful outpost on d4 while the bishop is restricted by its own pawns on the same colour.',
        highlights: ['d4', 'e3'],
      },
      {
        type: 'text',
        content: 'The "wrong colour bishop" is a crucial concept: a bishop + rook pawn (a- or h-pawn) is drawn if the bishop doesn\'t control the promotion square. With a light-squared bishop and an h-pawn, the promotion square h8 is dark — the defending king simply sits on h8 and cannot be evicted.',
      },
      {
        type: 'heading',
        content: 'Practical Endgame Technique',
      },
      {
        type: 'text',
        content: 'Zugzwang ("compulsion to move") is a situation where the side to move is at a disadvantage because every possible move worsens their position. Zugzwang is most common in king and pawn endgames. Recognising when to create zugzwang is a key endgame skill.',
      },
      {
        type: 'text',
        content: 'Outside passed pawns are extremely powerful because they force the enemy king to go far away to stop them, leaving the rest of the board undefended. If you can create an outside passed pawn, you win the "decoy" race — your king enters the opponent\'s position while their king chases your pawn.',
      },
      {
        type: 'position',
        fen: '8/8/1pk5/1p6/1P4K1/8/1PK5/8 w - - 0 1',
        caption: 'Zugzwang in action. After Kf4!, Black must move but every king move allows White\'s king to penetrate. The beauty of zugzwang — sometimes the best move is to pass.',
        arrows: [['g4', 'f4']],
        highlights: ['c6', 'f4'],
      },
      {
        type: 'text',
        content: 'When ahead in the endgame, simplify by trading pieces (not pawns). Keep pawns on both sides of the board to stretch the defender. When behind, trade pawns (not pieces) and try to reach a drawn position like opposite-coloured bishops or a fortress.',
      },
      {
        type: 'text',
        content: 'Stalemate awareness: when you\'re winning, always check your opponent has a legal move before delivering what you think is checkmate. When you\'re losing, look for stalemate tricks — especially in queen endgames. Stalemate has saved countless "lost" games.',
      },
    ],
    dos: [
      'Bring your king to the centre immediately',
      'Create and push passed pawns',
      'Keep your rook active in rook endgames',
      'Learn basic checkmate patterns (K+R vs K, K+Q vs K)',
      'Use the concept of opposition in king and pawn endgames',
      'Learn the Lucena and Philidor positions',
      'Trade pieces (not pawns) when ahead in material',
      'Look for zugzwang possibilities',
    ],
    donts: [
      'Keep your king passive on the back rank',
      'Rush to promote without calculating properly',
      'Use your rook passively to defend one pawn',
      'Forget that the king is a strong piece in the endgame',
      'Neglect studying basic endgame positions — they decide many games',
      'Trade pawns when ahead — keep them to create winning chances',
      'Forget about stalemate when you\'re winning',
    ],
  },
];

export default gamePhases;
