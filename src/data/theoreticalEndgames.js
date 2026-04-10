const theoreticalEndgames = [
  // 1. King + Queen vs King
  {
    id: 'te-1',
    name: 'King + Queen vs King',
    difficulty: 'Beginner',
    fen: '4k3/8/8/8/8/8/8/4K2Q w - - 0 1',
    goal: 'win',
    description: 'Deliver checkmate using the queen to restrict the enemy king and your own king to assist.',
    technique: 'Use the queen to cut off ranks or files, gradually pushing the enemy king to the edge. Bring your king up to support. Checkmate on the edge of the board. Be careful not to stalemate!',
    solution: ['Qe4+', 'Kd8', 'Kd2', 'Kc7', 'Kd3', 'Kd6', 'Qe5+', 'Kc6', 'Kd4', 'Kb6', 'Qd5', 'Ka6', 'Kc5', 'Ka7', 'Qb5', 'Ka8', 'Kb6', 'Ka8', 'Qa6#'],
    keyPoints: [
      'Don\'t stalemate — always leave the enemy king a square before delivering mate.',
      'The queen controls from a distance — don\'t bring it too close too early.',
      'King must help — the queen alone cannot force mate.',
    ],
  },

  // 2. King + Rook vs King
  {
    id: 'te-2',
    name: 'King + Rook vs King',
    difficulty: 'Beginner',
    fen: '4k3/8/8/8/8/8/8/R3K3 w - - 0 1',
    goal: 'win',
    description: 'Deliver checkmate by driving the enemy king to the edge using the rook to cut off ranks/files.',
    technique: 'Use the rook to cut off one rank at a time (the "staircase" or "lawnmower" method). Bring the king up in opposition. Mate on the edge.',
    solution: ['Ra5', 'Kd7', 'Kd2', 'Ke6', 'Ke3', 'Kf6', 'Kf4', 'Ke6', 'Ra6+', 'Kd5', 'Kf5', 'Kd4', 'Ra4+', 'Kd3', 'Ke5', 'Ke3', 'Ra3+', 'Ke2', 'Ke4', 'Kf2', 'Ra2+', 'Kg1', 'Kf3', 'Kh1', 'Ra1#'],
    keyPoints: [
      'Cut off the enemy king rank by rank.',
      'Use your king to gain opposition and push the enemy king back.',
      'Patience is key — it can take up to 16 moves.',
    ],
  },

  // 3. King + Bishop + Knight vs King (Basics)
  {
    id: 'te-3',
    name: 'King + Bishop + Knight vs King',
    difficulty: 'Advanced',
    fen: '4k3/8/8/8/8/8/8/1B2K1N1 w - - 0 1',
    goal: 'win',
    description: 'The hardest basic checkmate. Drive the king to a corner that matches the bishop\'s colour.',
    technique: 'Force the king to the correct corner (same colour as the bishop). Use the "W-manoeuvre" with the knight. The king and two pieces work together to restrict the enemy king gradually.',
    solution: ['Kd2', 'Kd7', 'Kd3', 'Ke6', 'Ke4', 'Kd6', 'Nf3', 'Ke6', 'Nd4+', 'Kd6', 'Kd3'],
    keyPoints: [
      'Must force the king to the corner matching the bishop\'s colour.',
      'The "W-manoeuvre" is the key technique for the final phase.',
      'This endgame requires up to 33 moves — within the 50-move rule but tight.',
      'Practice the technique repeatedly; it appears rarely but must be known.',
    ],
  },

  // 4. King + Two Bishops vs King
  {
    id: 'te-4',
    name: 'King + Two Bishops vs King',
    difficulty: 'Intermediate',
    fen: '4k3/8/8/8/8/8/8/2B1KB2 w - - 0 1',
    goal: 'win',
    description: 'Checkmate using two bishops working together to create a barrier.',
    technique: 'The two bishops create a diagonal barrier. Place them side by side on adjacent diagonals to push the king to the edge and then to a corner. The king assists in the final mating net.',
    solution: ['Bd3', 'Kd7', 'Kd2', 'Ke6', 'Ke3', 'Kd5', 'Be4+', 'Ke6', 'Bd4', 'Kd7', 'Kd3'],
    keyPoints: [
      'Two bishops work best on adjacent diagonals, creating a wall.',
      'Any corner works — unlike B+N, colour doesn\'t matter.',
      'Centralise the bishops and bring the king up for the final mate.',
    ],
  },

  // 5. King + Pawn vs King (Opposition)
  {
    id: 'te-5',
    name: 'King + Pawn vs King (Opposition)',
    difficulty: 'Beginner',
    fen: '4k3/8/4K3/4P3/8/8/8/8 w - - 0 1',
    goal: 'win',
    description: 'Understand the key concept of opposition to promote the pawn. White wins because the king is ahead of the pawn.',
    technique: 'The key rule: if your king is in front of the pawn with at least one square between them, you win. Use opposition (kings facing each other with one square between) to outflank the enemy king.',
    solution: ['Kd6', 'Kd8', 'e6', 'Ke8', 'e7', 'Kf7', 'Kd7', 'Kf6', 'e8=Q'],
    keyPoints: [
      'King in front of the pawn = winning (with the key exception of rook pawns).',
      'Opposition means the kings face each other with one square between — the side NOT to move has it.',
      'Rook pawns (a/h) are often drawn because the defending king can hide in the corner.',
    ],
  },

  // 6. Lucena Position
  {
    id: 'te-6',
    name: 'Lucena Position',
    difficulty: 'Intermediate',
    fen: '1K1k4/1P6/8/8/8/8/1r6/5R2 w - - 0 1',
    goal: 'win',
    description: 'The most important rook endgame position. White has a pawn on the 7th rank with the king in front. The "bridge-building" technique wins.',
    technique: 'Build a bridge: 1. Bring the rook to the 4th rank. 2. Use it as a shield for the king to cross. The rook blocks checks from the side by interposing on the 4th rank.',
    solution: ['Rf4', 'Rc2', 'Ka7', 'Ra2+', 'Kb6', 'Rb2+', 'Kc6', 'Rc2+', 'Kb5', 'Rb2+', 'Rb4'],
    keyPoints: [
      'This is the single most important endgame position to know.',
      'The "bridge" concept: rook goes to the 4th rank to shield the king from lateral checks.',
      'Once the rook interposes the checks, the pawn promotes.',
    ],
  },

  // 7. Philidor Position
  {
    id: 'te-7',
    name: 'Philidor Position',
    difficulty: 'Intermediate',
    fen: '4k3/8/4r3/8/8/8/4P3/4K1R1 b - - 0 1',
    goal: 'draw',
    description: 'The key defensive technique in rook endgames. The defender holds a draw with correct rook placement.',
    technique: 'Keep the rook on the 3rd rank (6th from White\'s perspective) to block the enemy king from advancing. Once the pawn advances to the 6th rank, switch the rook to the back rank for infinite checks from behind.',
    solution: ['Re6', 'Kd2', 'Rd6+', 'Ke3', 'Re6'],
    keyPoints: [
      'Rook on the 3rd rank prevents the enemy king from advancing.',
      'Wait until the pawn reaches the 6th rank, then go to the back rank for checks from behind.',
      'The defending king stays on the back rank in front of the pawn.',
      'Pair this with the Lucena — if you know both, you understand rook endgames.',
    ],
  },

  // 8. King + Rook + Pawn vs King + Rook (Basic)
  {
    id: 'te-8',
    name: 'Rook + Pawn vs Rook (Basic Winning Technique)',
    difficulty: 'Intermediate',
    fen: '8/4k3/4P3/8/8/8/8/R3K3 w - - 0 1',
    goal: 'win',
    description: 'White has a far-advanced passed pawn supported by the rook. Understanding when this is winning vs drawn is essential.',
    technique: 'The winning plan depends on cutting off the enemy king with the rook. If the defending king is cut off from the pawn by at least one file, the position is usually winning. Push the pawn while restricting the king.',
    solution: ['Ra7+', 'Kd6', 'Kd2', 'Ke5', 'Ke3', 'Ke6', 'Ke4'],
    keyPoints: [
      'Cut off the enemy king with the rook — even one file of separation is often enough.',
      'If the position becomes a Lucena, you win. If it becomes a Philidor, it\'s drawn.',
      'Centralise your king and push the pawn at the right moment.',
      'Know the "short side" and "long side" concepts for rook placement.',
    ],
  },
];

export default theoreticalEndgames;
