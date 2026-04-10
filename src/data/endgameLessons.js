const endgameLessons = [
  // === KING & PAWN (4) ===
  {
    id: 'opposition',
    title: 'King and Pawn vs King — the Opposition',
    category: 'King & Pawn',
    description: 'The fundamental concept that decides most king and pawn endgames.',
    difficulty: 'Beginner',
    content: [
      { type: 'text', content: 'The opposition is the most important concept in king and pawn endings. Two kings are "in opposition" when they face each other with one square between them. The side that does NOT have to move has the opposition — and the advantage.' },
      { type: 'text', content: 'When you have the opposition, the opposing king must give way, allowing your king to advance. This is crucial for escorting a pawn to promotion. With the opposition, you can push the enemy king aside and queen your pawn.' },
      { type: 'position', fen: '8/8/8/3k4/8/3K4/3P4/8 w - - 0 1', caption: 'White to move. Ke3! gains the opposition (kings one square apart, opponent must move). After Kd6, White plays Ke4 and is well on the way to promoting.', arrows: [['d3', 'e3']], highlights: ['d5', 'e3'] },
      { type: 'text', content: 'The rule of the king position: in K+P vs K, the attacking king must be IN FRONT of the pawn and have the opposition to win. If the defending king reaches the square in front of the pawn, it\'s a draw. If the attacking king is behind or beside the pawn, it may only be a draw.' },
    ],
    drillPosition: {
      fen: '8/8/8/3k4/8/3K4/3P4/8 w - - 0 1',
      solution: ['Ke3', 'Kd6', 'Ke4', 'Ke6', 'd4', 'Kd6', 'd5'],
      explanation: 'By gaining the opposition with Ke3, White can advance the king ahead of the pawn and push it forward. The key is the king leads the way.',
    },
  },
  {
    id: 'square-rule',
    title: 'The Square Rule',
    category: 'King & Pawn',
    description: 'Can the king catch the pawn? A simple geometric rule tells you.',
    difficulty: 'Beginner',
    content: [
      { type: 'text', content: 'The "Rule of the Square" is a quick visual technique to determine if a king can catch a passed pawn. Draw an imaginary square from the pawn to the promotion square. If the defending king can step inside this square (on their turn), they can catch the pawn. If not, the pawn promotes.' },
      { type: 'text', content: 'To construct the square: count the number of squares the pawn needs to reach the 8th rank. Then draw a square with that side length, extending from the pawn toward the defending king. If the king is inside or can enter the square, it catches the pawn.' },
      { type: 'position', fen: '8/8/8/8/1P4k1/8/8/4K3 w - - 0 1', caption: 'Can the Black king catch the b-pawn? The pawn is on b4 and needs 4 moves to promote. The "square" extends from b4 to b8 to f8 to f4. The king on g4 is OUTSIDE the square — the pawn promotes!', highlights: ['b4', 'b8', 'f8', 'f4'] },
      { type: 'text', content: 'Remember: when calculating the square, consider whose turn it is. If the pawn hasn\'t moved yet, count from the square in front (because it moves first). Use this technique to save time in practical games — no need to calculate move by move.' },
    ],
    drillPosition: {
      fen: '8/8/8/8/1P4k1/8/8/4K3 w - - 0 1',
      solution: ['b5', 'Kf5', 'b6', 'Ke6', 'b7', 'Kd7', 'b8=Q'],
      explanation: 'The Black king is outside the square and cannot catch the pawn. White simply pushes the pawn forward and promotes.',
    },
  },
  {
    id: 'key-squares',
    title: 'Key Squares',
    category: 'King & Pawn',
    description: 'When a king reaches these squares, the pawn promotes.',
    difficulty: 'Intermediate',
    content: [
      { type: 'text', content: 'Every pawn has "key squares" — squares that, if the attacking king reaches, guarantee promotion regardless of the defending king\'s position. For pawns on the 5th rank, the key squares are the three squares two ranks ahead of the pawn.' },
      { type: 'text', content: 'For a pawn on e5, the key squares are d7, e7, and f7. If the White king reaches any of these squares, the pawn will promote. For pawns further back, the key squares are further from the pawn.' },
      { type: 'position', fen: '8/8/8/4Pk2/4K3/8/8/8 w - - 0 1', caption: 'White king is on e4, pawn on e5. The key squares are d7, e7, f7. White needs to get the king to one of these squares to ensure promotion.', highlights: ['d7', 'e7', 'f7'] },
      { type: 'text', content: 'Key square theory simplifies king and pawn endgames enormously. Instead of calculating long variations, just ask: can my king reach a key square? If yes, the pawn promotes. If the opponent\'s king blocks all key squares, it\'s likely a draw.' },
    ],
    drillPosition: {
      fen: '8/8/8/4Pk2/4K3/8/8/8 w - - 0 1',
      solution: ['Kd5', 'Ke7', 'e6', 'Kd8', 'Kd6'],
      explanation: 'By outflanking with Kd5, White gains the opposition and can advance the king to the key squares ahead of the pawn.',
    },
  },
  {
    id: 'breakthrough',
    title: 'Breakthrough',
    category: 'King & Pawn',
    description: 'Three pawns vs three pawns — the forced pawn promotion trick.',
    difficulty: 'Intermediate',
    content: [
      { type: 'text', content: 'The "breakthrough" is a stunning pawn tactic where one side forces a passed pawn by sacrificing one or two pawns. It occurs when pawns face each other in a line and one side can create a passed pawn by force.' },
      { type: 'text', content: 'The classic scenario: White has pawns on a5, b5, c5 against Black\'s pawns on a7, b7, c7. White plays b6! If cxb6, then a6 creates a passed a-pawn. If axb6, then c6 creates a passed c-pawn. If bxc6, then a6 creates a passed a-pawn. In every case, White gets a passed pawn.' },
      { type: 'position', fen: '4k3/ppp5/8/PPP5/8/8/8/4K3 w - - 0 1', caption: 'The classic breakthrough position. White plays b6! and no matter how Black captures, a passed pawn is created and will promote.', arrows: [['b5', 'b6']], highlights: ['a5', 'b5', 'c5'] },
      { type: 'text', content: 'Recognizing breakthrough patterns is essential. They can appear in practical games and completely change the evaluation. Always look for these motifs when you have a pawn majority — they can win games that seem drawn.' },
    ],
    drillPosition: {
      fen: '4k3/ppp5/8/PPP5/8/8/8/4K3 w - - 0 1',
      solution: ['b6', 'cxb6', 'a6', 'bxa6', 'c6'],
      explanation: 'After b6! cxb6 a6! bxa6 c6, the c-pawn is a passed pawn that will promote. The breakthrough is unstoppable.',
    },
  },

  // === ROOK ENDINGS (4) ===
  {
    id: 'lucena',
    title: 'Lucena Position',
    category: 'Rook Endings',
    description: 'The bridge-building technique to promote a pawn with a rook.',
    difficulty: 'Intermediate',
    content: [
      { type: 'text', content: 'The Lucena position is the most important winning technique in rook endgames. It occurs when the attacking side has a pawn on the 7th rank, the king on the promotion square, and needs to escape checks from the defending rook.' },
      { type: 'text', content: 'The technique is called "building a bridge": the rook moves to the 4th rank to block the checks. After the king emerges from in front of the pawn, the defending rook gives checks, but the attacking rook interposes ("bridges"), allowing the pawn to promote.' },
      { type: 'position', fen: '3K4/3P1k2/8/8/8/8/8/4R3 w - - 0 1', caption: 'The Lucena position. White\'s king is on d8, pawn on d7, king sheltered. The rook must build a bridge on the 4th rank to block future checks.', highlights: ['d8', 'd7'] },
      { type: 'text', content: 'Steps: 1) Move the rook to the 4th rank (e.g., Re4), 2) Play Kc7 to get out from in front of the pawn, 3) When the defending rook checks from the side, interpose the rook (Rd4 blocks), 4) The pawn promotes.' },
    ],
    drillPosition: {
      fen: '3K4/3P1k2/8/8/8/8/8/4R3 w - - 0 1',
      solution: ['Re4', 'Kf6', 'Kc7', 'Rc1+', 'Kd6', 'Rd1+', 'Ke6', 'Re1+', 'Kd5', 'Rd1+', 'Rd4'],
      explanation: 'Re4 "builds the bridge" on the 4th rank. The king escapes, and when checked, the rook interposes on d4, allowing d8=Q.',
    },
  },
  {
    id: 'philidor',
    title: 'Philidor Position',
    category: 'Rook Endings',
    description: 'The essential drawing technique with a rook against a pawn.',
    difficulty: 'Intermediate',
    content: [
      { type: 'text', content: 'The Philidor position is the most important drawing technique in rook endgames. When defending against a rook and pawn, the key idea is to keep your rook on the 6th rank (to prevent the enemy king from advancing) until the pawn advances to the 6th rank, then switch to giving checks from behind.' },
      { type: 'text', content: 'The principle: rook on the 3rd rank (defender\'s perspective) cuts off the enemy king. Once the pawn reaches the 6th rank, retreat the rook to the back rank and give checks from behind. The attacking king has no shelter from the checks.' },
      { type: 'position', fen: '8/8/8/4pk2/8/4R3/4K3/8 w - - 0 1', caption: 'White defends with the Philidor technique. The rook on e3 prevents the Black king from advancing past the 5th rank. White waits passively.', arrows: [], highlights: ['e3'] },
      { type: 'text', content: 'This is a theoretical draw. The defending side must know this technique — it saves many rook endgames that look lost. Master it and you\'ll save countless half-points.' },
    ],
    drillPosition: {
      fen: '8/8/4k3/4p3/8/4R3/4K3/8 b - - 0 1',
      solution: ['Kd5', 'Re1', 'e4', 'Rd1+', 'Ke5', 'Re1'],
      explanation: 'The rook stays on the third rank until the pawn advances, then switches to checking from behind. The attacking king cannot escape the checks.',
    },
  },
  {
    id: 'rook-vs-pawn',
    title: 'Rook vs Pawn',
    category: 'Rook Endings',
    description: 'When to draw and when to win with rook against a pawn.',
    difficulty: 'Advanced',
    content: [
      { type: 'text', content: 'Rook vs a passed pawn near promotion is a critical endgame scenario. Generally, the rook wins — but there are exceptions when the pawn is far advanced and the rook is badly placed. The defending king\'s position relative to the pawn is decisive.' },
      { type: 'text', content: 'If the rook can get behind the passed pawn (on the same file), it usually wins easily. From behind, the rook gains checking distance as the pawn advances, and the attacking king cannot shelter. This is why "rooks belong behind passed pawns" — yours or your opponent\'s.' },
      { type: 'position', fen: '8/8/2k5/3p4/8/8/8/R3K3 w - - 0 1', caption: 'White\'s rook can get behind the d-pawn by playing Rd1. From there, it controls the pawn\'s advance and checks the king from a distance.', arrows: [['a1', 'd1']] },
      { type: 'text', content: 'The exception: if the pawn reaches the 7th rank with the king supporting it and the rook cannot get behind it, special techniques are needed. The Lucena and Philidor positions handle these cases. Know the theory and you will navigate rook endings with confidence.' },
    ],
    drillPosition: {
      fen: '8/8/2k5/3p4/8/8/8/R3K3 w - - 0 1',
      solution: ['Rd1', 'Kd6', 'Kd2', 'd4', 'Kd3'],
      explanation: 'The rook gets behind the pawn with Rd1, then the king advances to blockade. The rook behind the pawn plus the approaching king wins.',
    },
  },
  {
    id: 'seventh-rank-rook',
    title: 'The 7th Rank Rook',
    category: 'Rook Endings',
    description: 'Using a rook on the 7th rank to dominate the endgame.',
    difficulty: 'Intermediate',
    content: [
      { type: 'text', content: 'A rook on the 7th rank (or 2nd rank for Black) is one of the most powerful pieces in chess. It attacks pawns from behind, confines the enemy king to the back rank, and creates relentless threats. Two rooks on the 7th rank is usually decisive.' },
      { type: 'text', content: 'The power of the 7th rank comes from geometry: pawns start on the 2nd/7th rank, and a rook there attacks them all simultaneously from behind. Meanwhile, the enemy king is trapped on the 8th rank, unable to participate.' },
      { type: 'position', fen: '6k1/1R3ppp/8/8/8/8/5PPP/6K1 w - - 0 1', caption: 'White\'s rook dominates the 7th rank, attacking f7 and potentially g7. Black\'s king is confined to the back rank.', arrows: [['b7', 'f7'], ['b7', 'g7']] },
      { type: 'text', content: 'To achieve a 7th rank rook: control an open file first, then penetrate. Trade off other pieces if needed to reach a favourable rook ending where your rook can invade. The 7th rank is the promised land in rook endings.' },
    ],
    drillPosition: {
      fen: '6k1/1R3ppp/8/8/8/8/5PPP/6K1 w - - 0 1',
      solution: ['Rxf7', 'Kh8', 'Kf1'],
      explanation: 'The rook harvests pawns on the 7th rank. After Rxf7, White wins material and the endgame is easily won with the extra pawns.',
    },
  },

  // === MINOR PIECE (2) ===
  {
    id: 'bishop-vs-knight',
    title: 'Bishop vs Knight',
    category: 'Minor Piece',
    description: 'Which is better and when? Understanding the eternal debate.',
    difficulty: 'Intermediate',
    content: [
      { type: 'text', content: 'The bishop and knight are roughly equal in value (approximately 3 points each), but their strengths depend on the position. Understanding when each piece excels is a key strategic skill.' },
      { type: 'text', content: 'Bishops are better in open positions with pawns on both sides of the board. Their long-range power shines when diagonals are clear. They are also superior in endgames where they can control both sides of the board simultaneously.' },
      { type: 'text', content: 'Knights are better in closed positions with fixed pawn structures. They can hop over pawns and occupy outposts where they cannot be challenged. Knights excel when there are outposts on the 4th or 5th rank.' },
      { type: 'position', fen: '8/pp3kpp/4p3/3pP3/PP1n4/4BK2/8/8 w - - 0 1', caption: 'A classic position where the knight is superior. The centre is blocked, and the knight has a beautiful outpost on d4. The bishop is restricted by its own pawns.', highlights: ['d4', 'e3'] },
      { type: 'text', content: 'Practical tip: if you have a bishop, open the position. If you have a knight, keep it closed. Place your pawns on the opposite colour of your bishop to maximise its scope.' },
    ],
    drillPosition: {
      fen: '8/pp3kpp/4p3/3pP3/PP1n4/4BK2/8/8 b - - 0 1',
      solution: ['Nf5', 'Bd2', 'Ke7'],
      explanation: 'The knight manoeuvres to f5, a dominant outpost. From there it controls key squares and Black has a clear advantage in this closed position.',
    },
  },
  {
    id: 'wrong-bishop',
    title: 'Wrong Colour Bishop',
    category: 'Minor Piece',
    description: 'Why some King + Bishop + Pawn endings are drawn.',
    difficulty: 'Advanced',
    content: [
      { type: 'text', content: 'When you have a king, bishop, and rook pawn (a- or h-pawn), and the bishop does NOT control the promotion square, the position is often drawn. This is the "wrong colour bishop" phenomenon — one of the most important endgame facts to know.' },
      { type: 'text', content: 'For example, with a light-squared bishop and an h-pawn, the promotion square h8 is dark. The defending king simply sits on h8, and the bishop cannot drive it away because it can never attack that square. The position is a fortress draw.' },
      { type: 'position', fen: '7k/8/6KP/8/5B2/8/8/8 w - - 0 1', caption: 'Despite being a bishop and pawn up, this is drawn! The bishop on f4 is light-squared but h8 (promotion square) is dark. Black\'s king on h8 cannot be evicted.', highlights: ['h8', 'f4'] },
      { type: 'text', content: 'This rule has practical implications: in a winning position, avoid trading down to a rook-pawn ending with the wrong-coloured bishop. Conversely, if you are defending, aim for this drawn configuration. It has saved many games.' },
    ],
    drillPosition: {
      fen: '7k/8/6KP/8/5B2/8/8/8 w - - 0 1',
      solution: ['Be5', 'Kh7', 'Bf6'],
      explanation: 'Despite White\'s best efforts, Black holds the draw. The king shuttles between h8 and h7. White\'s light-squared bishop can never control h8, the dark promotion square.',
    },
  },

  // === QUEEN ENDINGS (2) ===
  {
    id: 'queen-vs-pawn',
    title: 'Queen vs Pawn on 7th Rank',
    category: 'Queen Endings',
    description: 'When the queen wins and when the pawn draws.',
    difficulty: 'Advanced',
    content: [
      { type: 'text', content: 'Queen vs a pawn on the 7th rank is usually winning for the queen — but there are three famous exceptions where the pawn draws: bishop-pawn (c- or f-pawn), and the central pawns in certain configurations, due to stalemate tricks.' },
      { type: 'text', content: 'The queen wins by: 1) Giving checks to drive the enemy king in front of the pawn, 2) Then approaching with her own king, 3) Eventually forcing the king away and capturing the pawn. This requires precision but is a systematic technique.' },
      { type: 'position', fen: '8/1P6/1K6/8/8/8/6q1/7k w - - 0 1', caption: 'A bishop-pawn (b-pawn) on the 7th rank. But wait — this is not the drawing case. The drawing fortress only works with c/f pawns due to stalemate patterns.', highlights: ['b7'] },
      { type: 'text', content: 'The drawing mechanism with c/f pawns: the defending king hides in the corner where it gets stalemated if the queen captures the pawn. The queen must avoid stalemate while trying to win. With precise defence, it\'s a draw.' },
    ],
    drillPosition: {
      fen: '8/8/8/8/5K2/8/1p6/1k4Q1 w - - 0 1',
      solution: ['Qd4+', 'Ka2', 'Qa4+', 'Kb1', 'Qb3+', 'Ka1', 'Ke3'],
      explanation: 'The queen uses a series of checks to drive the king in front of the pawn, then the king approaches. The queen and king together will eventually win the pawn.',
    },
  },
  {
    id: 'staircase-mate',
    title: 'Queen and King vs King',
    category: 'Queen Endings',
    description: 'The staircase mating technique with queen and king.',
    difficulty: 'Beginner',
    content: [
      { type: 'text', content: 'Checkmating with king and queen vs a lone king is a fundamental technique every player must know. The method is called the "staircase" or "box" technique — you systematically shrink the enemy king\'s available space until checkmate.' },
      { type: 'text', content: 'Steps: 1) Use the queen to cut off ranks or files, restricting the enemy king to a smaller box. 2) Bring your king closer for support. 3) Continue shrinking the box until the enemy king is on the edge. 4) Deliver checkmate on the edge of the board.' },
      { type: 'position', fen: '8/8/8/3k4/8/8/8/4QK2 w - - 0 1', caption: 'White uses the queen to create a "box" — restricting the Black king to fewer and fewer squares, then brings the king up to deliver checkmate.', arrows: [['e1', 'e5']] },
      { type: 'text', content: 'Be careful not to stalemate! When the enemy king is in the corner, make sure it still has one legal move before you bring your queen too close. Stalemate is the most common mistake in this endgame. Take your time and use the staircase method.' },
    ],
    drillPosition: {
      fen: '8/8/8/3k4/8/8/8/4QK2 w - - 0 1',
      solution: ['Qe4+', 'Kd6', 'Kf2', 'Kc5', 'Ke3', 'Kd6', 'Qd4+', 'Ke6', 'Ke4'],
      explanation: 'The queen cuts off the king\'s escape squares (the "staircase"), and the White king marches up to support. Checkmate will follow on the edge of the board.',
    },
  },
];

export default endgameLessons;
