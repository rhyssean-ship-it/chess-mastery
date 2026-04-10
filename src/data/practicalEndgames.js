const practicalEndgames = [
  // 1. Pawn Promotion
  {
    id: 'pe-1',
    difficulty: 'Intermediate',
    fen: '8/P4kpp/8/8/8/6K1/8/8 w - - 0 1',
    sideToMove: 'white',
    theme: 'Pawn Promotion',
    solution: ['a7a8'],
    explanation: 'The a-pawn is one step from promotion and Black\'s king is too far to stop it. After a8=Q White wins easily with a new queen.',
    hint: 'Push the passed pawn — can the enemy king catch it?',
  },

  // 2. Opposition
  {
    id: 'pe-2',
    difficulty: 'Beginner',
    fen: '8/8/8/3k4/8/3K4/3P4/8 w - - 0 1',
    sideToMove: 'white',
    theme: 'Opposition',
    solution: ['d3e3'],
    explanation: 'Ke3 (not Ke4?) seizes the opposition. After ...Ke5 Kd3 the king can outflank. The key is advancing the king alongside the pawn, not pushing the pawn immediately.',
    hint: 'Take the opposition — place your king directly facing the enemy king.',
  },

  // 3. Rook Activity
  {
    id: 'pe-3',
    difficulty: 'Intermediate',
    fen: '8/1p3kpp/8/1P6/8/6K1/6PP/3r4 b - - 0 1',
    sideToMove: 'black',
    theme: 'Rook Activity',
    solution: ['d1b1'],
    explanation: 'Rb1 attacks the passed b5 pawn from behind with the rook. Rooks belong behind passed pawns — whether your own or the opponent\'s. After Rb1, Black wins the pawn.',
    hint: 'Place the rook behind the passed pawn.',
  },

  // 4. Passed Pawn
  {
    id: 'pe-4',
    difficulty: 'Intermediate',
    fen: '8/5kpp/8/8/1p6/1P4K1/P5PP/8 w - - 0 1',
    sideToMove: 'white',
    theme: 'Passed Pawn',
    solution: ['a2a4'],
    explanation: 'a4! creates a passed a-pawn after bxa3 (en passant) or a4-a5. The outside passed pawn will distract Black\'s king, allowing White\'s king to mop up the kingside pawns.',
    hint: 'Create a passed pawn on the opposite side of the board from the enemy king.',
  },

  // 5. Fortress
  {
    id: 'pe-5',
    difficulty: 'Advanced',
    fen: '8/8/8/8/8/1k6/2p5/1K1R4 b - - 0 1',
    sideToMove: 'black',
    theme: 'Fortress',
    solution: ['c2c1'],
    explanation: 'This position is actually a draw despite Black having a rook for nothing extra. After c1=Q (or c1=R), Rxc1 Kxc1, the position is a basic draw. Sometimes a fortress means accepting material deficit for an impregnable position.',
    hint: 'Sometimes a material advantage doesn\'t win — look for a drawing mechanism.',
  },

  // 6. Zugzwang
  {
    id: 'pe-6',
    difficulty: 'Advanced',
    fen: '8/8/1pk5/1p6/1P4K1/8/1PK5/8 w - - 0 1',
    sideToMove: 'white',
    theme: 'Zugzwang',
    solution: ['g4f4'],
    explanation: 'Kf4! puts Black in zugzwang. Black must move but every move loses: ...Kb7 allows Ke5 penetrating, ...Kd5 allows Kf5, and ...Kd6 allows Kf5 heading for the kingside pawns.',
    hint: 'Put your opponent in a position where any move worsens their position.',
  },

  // 7. Simplification
  {
    id: 'pe-7',
    difficulty: 'Intermediate',
    fen: '8/5pk1/R4bp1/4p3/4P3/5PPK/8/3r4 w - - 0 1',
    sideToMove: 'white',
    theme: 'Simplification',
    solution: ['a6f6'],
    explanation: 'Rxf6! simplifies into a winning king and pawn endgame. After ...Kxf6, White plays Kg4 and penetrates via f5 or h4-h5, winning Black\'s kingside pawns.',
    hint: 'Exchange into a winning pawn endgame.',
  },

  // 8. King Activity
  {
    id: 'pe-8',
    difficulty: 'Beginner',
    fen: '8/pp3ppp/8/8/8/8/PPP2PPP/4K3 w - - 0 1',
    sideToMove: 'white',
    theme: 'King Activity',
    solution: ['e1d2'],
    explanation: 'In the endgame, the king is a fighting piece. Kd2 begins centralising the king towards d3-e4, where it can support pawn advances and attack enemy pawns. The king should rush to the centre.',
    hint: 'The king should be active in the endgame — centralise it!',
  },

  // 9. Stalemate Trick
  {
    id: 'pe-9',
    difficulty: 'Advanced',
    fen: '6k1/5ppp/8/8/8/8/6q1/7K w - - 0 1',
    sideToMove: 'white',
    theme: 'Stalemate Trick',
    solution: ['h1g1'],
    explanation: 'White is losing badly but can try for stalemate. After Kg1, if Black plays carelessly (e.g., ...Qf2), it might be stalemate if White has no legal moves. The defender should always look for stalemate resources when down material.',
    hint: 'When losing, look for stalemate tricks — put yourself in a position with no legal moves.',
  },

  // 10. Wrong Bishop
  {
    id: 'pe-10',
    difficulty: 'Intermediate',
    fen: '7k/8/8/8/8/8/P7/K1B5 w - - 0 1',
    sideToMove: 'white',
    theme: 'Wrong Bishop',
    solution: ['a2a4'],
    explanation: 'This is a draw! The bishop is on light squares but the promotion square a8 is dark. The defending king just sits on a8/a7 and cannot be driven out. This is the classic "wrong bishop" endgame — knowing when K+B+P is drawn is essential.',
    hint: 'Check whether the bishop controls the promotion square of the pawn.',
  },
];

export default practicalEndgames;
