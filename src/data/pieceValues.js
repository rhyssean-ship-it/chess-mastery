const pieceValues = {
  pieces: [
    { symbol: '\u2659', name: 'Pawn', letter: '', value: 1, description: 'The foot soldier. Worth 1 point. Pawns are the least valuable individually, but their structure defines the position. A passed pawn can be worth much more.' },
    { symbol: '\u2658', name: 'Knight', letter: 'N', value: 3, description: 'Worth 3 points. Knights are best in closed positions and excel at short-range tactics like forks. They can jump over other pieces.' },
    { symbol: '\u2657', name: 'Bishop', letter: 'B', value: 3, description: 'Worth 3 points. Bishops are long-range pieces that control diagonals. Having both bishops (the "bishop pair") is a significant advantage in open positions.' },
    { symbol: '\u2656', name: 'Rook', letter: 'R', value: 5, description: 'Worth 5 points. Rooks dominate open files and the 7th rank. They are strongest in the endgame when the board opens up.' },
    { symbol: '\u2655', name: 'Queen', letter: 'Q', value: 9, description: 'Worth 9 points. The most powerful piece — combines the rook and bishop. Losing your queen is usually decisive. Protect her!' },
    { symbol: '\u2654', name: 'King', letter: 'K', value: '\u221E', description: 'Infinite value — the game ends when the king is checkmated. In the endgame, the king becomes an active fighting piece.' },
  ],
  tradingRules: [
    { rule: 'Trade when ahead in material', explanation: 'If you have extra material, trading simplifies the position and makes your advantage easier to convert.' },
    { rule: 'Avoid trading when behind', explanation: 'When behind in material, keep pieces on to create complications and chances for your opponent to make mistakes.' },
    { rule: 'A rook is worth more than a minor piece', explanation: 'Rook (5) > Bishop or Knight (3). Giving up a rook for a bishop/knight loses 2 points of material ("losing the exchange").' },
    { rule: 'Two minor pieces are usually better than a rook', explanation: 'Bishop + Knight (6) > Rook (5). Two pieces coordinate better than one in most positions.' },
    { rule: 'Queen ≈ two rooks', explanation: 'Queen (9) ≈ two Rooks (10). Two rooks are slightly stronger, especially when they can coordinate.' },
    { rule: 'Don\'t trade your active pieces for passive ones', explanation: 'A well-placed knight on an outpost is worth more than a bad bishop stuck behind pawns, even though they have the same "value".' },
  ],
  exercises: [
    { id: 'pv-1', question: 'You can capture a knight with your bishop. Should you?', options: ['Yes — fair trade (3 for 3)', 'No — keep the bishop'], correctIndex: 0, explanation: 'Bishop and knight are equal value (3 points each). This is a fair trade. Consider the position — do you want the bishop pair or is the knight on a strong outpost?' },
    { id: 'pv-2', question: 'You can take a rook with your knight, but you\'ll lose the knight. Should you?', options: ['Yes — win material (gain 2 points)', 'No — keep the knight'], correctIndex: 0, explanation: 'Rook (5) for Knight (3) = you gain 2 points of material. Almost always take this trade!' },
    { id: 'pv-3', question: 'Your opponent offers to trade queens. You are ahead by a knight. Should you trade?', options: ['Yes — simplify with extra material', 'No — keep queens on'], correctIndex: 0, explanation: 'When ahead in material, trade pieces! Fewer pieces = fewer chances for your opponent to create complications.' },
    { id: 'pv-4', question: 'You can win a pawn but your queen gets trapped. Worth it?', options: ['Yes — a pawn is a pawn', 'No — losing the queen is catastrophic'], correctIndex: 1, explanation: 'Queen (9) for Pawn (1) = you lose 8 points! Never risk your queen for a pawn.' },
    { id: 'pv-5', question: 'Your opponent offers a rook for your bishop and a pawn. Should you accept?', options: ['Yes — rook is more valuable', 'No — bishop + pawn is equal value'], correctIndex: 1, explanation: 'Rook (5) vs Bishop + Pawn (3+1=4). You\'d gain only 1 point but lose coordination. This is close — consider the specific position.' },
    { id: 'pv-6', question: 'You can sacrifice your queen to force checkmate in 3 moves. Should you?', options: ['No — never give up the queen', 'Yes — checkmate wins the game'], correctIndex: 1, explanation: 'Checkmate wins regardless of material! If you can force mate, sacrifice anything.' },
    { id: 'pv-7', question: 'You\'re behind a whole rook. Should you trade queens?', options: ['Yes — simplify the position', 'No — keep pieces on for chances'], correctIndex: 1, explanation: 'When behind in material, keep pieces on! More pieces = more complexity = more chances for your opponent to blunder.' },
    { id: 'pv-8', question: 'You can capture a pawn with your queen, but it takes 3 moves. Is it worth the tempo?', options: ['Yes — material is material', 'No — development and time matter more'], correctIndex: 1, explanation: 'In the opening, wasting 3 moves (tempi) to grab a pawn with the queen usually loses more than 1 pawn of value. Time is worth more than material early on.' },
  ],
};

export default pieceValues;
