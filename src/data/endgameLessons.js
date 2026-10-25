// Every position and drill line below has been checked with chess.js and Stockfish.
// Drill solutions are SAN strings in play order: [your move, reply, your move, ...].
// The page compares SAN exactly (including + and #) and auto-plays the replies.
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
      { type: 'position', fen: '8/8/8/4k3/8/3K4/4P3/8 w - - 0 1', caption: 'White to move. Ke3! puts the kings face to face on the e-file with one square between them, and now Black has to move. Black\'s king must step aside: after ...Kd5 White plays Kf4, and after ...Kf5 White plays Kd4. Either way White\'s king gets in front of the pawn and wins.', arrows: [['d3', 'e3']], highlights: ['e5', 'e3'] },
      { type: 'text', content: 'The rule of thumb: in king and pawn against king, the attacking king should go IN FRONT of its pawn, and the opposition decides whether it can stay there. If the defending king gets in front of the pawn and keeps the opposition, it is usually a draw.' },
    ],
    drillPosition: {
      fen: '8/8/8/4k3/8/3K4/4P3/8 w - - 0 1',
      solution: ['Ke3'],
      explanation: 'Ke3! takes the opposition. Black must give way, and White\'s king walks in front of the pawn: ...Kd5 Kf4, or ...Kf5 Kd4. Pushing the pawn first, or any other king move, lets Black take the opposition and draw.',
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
      { type: 'position', fen: '8/8/8/8/1P4k1/8/8/4K3 w - - 0 1', caption: 'Can the Black king catch the b-pawn? The pawn is on b4 and needs 4 moves to promote. The "square" runs from b4 to b8 to f8 to f4. The king on g4 is outside the square, so after b5 it can never catch up — the pawn promotes!', highlights: ['b4', 'b8', 'f8', 'f4'] },
      { type: 'text', content: 'Remember to check whose turn it is: if it is the defender\'s move, the king may step into the square in time. A pawn still on its starting square can move two squares at once, so draw its square as if it were already one rank further forward. Use this rule to save time in practical games — no need to calculate move by move.' },
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
      { type: 'text', content: 'Every pawn has "key squares" — squares that, if the attacking king reaches them, guarantee promotion whatever the defending king does. For a pawn on its 2nd, 3rd or 4th rank, the key squares are the three squares two ranks in front of the pawn.' },
      { type: 'text', content: 'For a pawn on e4, the key squares are d6, e6 and f6. If the White king reaches any of these squares, the pawn will promote. Once the pawn reaches the 5th rank, the squares directly in front of it on the 6th rank and the squares on the 7th rank become key squares too.' },
      { type: 'position', fen: '8/8/5k2/8/3KP3/8/8/8 w - - 0 1', caption: 'White\'s king is on d4 and the pawn is on e4, so the key squares are d6, e6 and f6. Black\'s king on f6 is guarding them. Kd5! heads for d6 and e6, and Black cannot keep White\'s king out.', highlights: ['d6', 'e6', 'f6'] },
      { type: 'text', content: 'Key square theory simplifies king and pawn endgames enormously. Instead of calculating long variations, just ask: can my king reach a key square? If yes, the pawn promotes. If the opponent\'s king can keep you out of all of them, it is likely a draw.' },
    ],
    drillPosition: {
      fen: '8/8/5k2/8/3KP3/8/8/8 w - - 0 1',
      solution: ['Kd5', 'Ke7', 'Ke5'],
      explanation: 'Kd5! steps towards the key squares. After ...Ke7, Ke5 takes the opposition, and Black\'s king must let White\'s king into d6 or f6. From a key square, White escorts the pawn home. Every other first move, including e5, only draws.',
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
      { type: 'text', content: 'The classic scenario: White has pawns on a5, b5 and c5 against Black\'s pawns on a7, b7 and c7, and both kings are far away. White plays b6! If ...cxb6, then a6! bxa6 c6 and the c-pawn queens. If ...axb6, then c6! bxc6 a6 and the a-pawn queens. In every case White gets a passed pawn that cannot be stopped.' },
      { type: 'position', fen: '7k/ppp5/8/PPP5/8/8/8/7K w - - 0 1', caption: 'The classic breakthrough position. Both kings are far away on the h-file. White plays b6! and however Black captures, a passed pawn is created and will promote.', arrows: [['b5', 'b6']], highlights: ['a5', 'b5', 'c5'] },
      { type: 'text', content: 'Recognising breakthrough patterns is essential. They can appear in practical games and completely change the evaluation. Always look for these motifs when you have advanced pawns — they can win games that seem drawn.' },
    ],
    drillPosition: {
      fen: '7k/ppp5/8/PPP5/8/8/8/7K w - - 0 1',
      solution: ['b6', 'cxb6', 'a6', 'bxa6', 'c6'],
      explanation: 'After b6! cxb6 a6! bxa6 c6, the c-pawn is a passed pawn and Black\'s king on h8 is far too far away to catch it. The breakthrough is unstoppable.',
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
      { type: 'text', content: 'The Lucena position is the most important winning technique in rook endgames. It occurs when the attacking side has a pawn on the 7th rank, the king on the promotion square, the defending king cut off from the pawn, and the attacking king needs to escape from checks by the defending rook.' },
      { type: 'text', content: 'The technique is called "building a bridge": the rook moves to the 4th rank. After the king walks out from in front of the pawn, the defending rook gives checks, and when the king reaches the 5th rank the attacking rook blocks the last check (the "bridge"), so the pawn promotes.' },
      { type: 'position', fen: '1K6/1P1k4/8/8/8/8/r7/2R5 w - - 0 1', caption: 'The Lucena position. White\'s king is on b8 in front of the b7 pawn, and Black\'s rook on a2 stops it from stepping out to a7 or a8. White first drives Black\'s king further away with Rd1+, then builds the bridge with Rd4.', highlights: ['b8', 'b7'], arrows: [['c1', 'd1']] },
      { type: 'text', content: 'Steps: 1) Rd1+ pushes Black\'s king one more file away. 2) Rd4 puts the rook on the 4th rank. 3) Kc7 brings the king out, and Black checks with the rook. 4) The king walks down to b5, and when Black checks on the b-file, Rb4 blocks. Nothing can now stop b8=Q.' },
    ],
    drillPosition: {
      fen: '1K6/1P1k4/8/8/8/8/r7/2R5 w - - 0 1',
      solution: ['Rd1+', 'Ke7', 'Rd4', 'Ra1', 'Kc7', 'Rc1+', 'Kb6', 'Rb1+', 'Kc6', 'Rc1+', 'Kb5', 'Rb1+', 'Rb4'],
      explanation: 'Rd1+ drives Black\'s king away, Rd4 builds the bridge on the 4th rank, and the king walks out via c7, b6, c6 and b5. When Black runs out of checks, Rb4 blocks the last one and the b-pawn queens.',
    },
  },
  {
    id: 'philidor',
    title: 'Philidor Position',
    category: 'Rook Endings',
    description: 'The essential drawing technique in rook and pawn against rook.',
    difficulty: 'Intermediate',
    content: [
      { type: 'text', content: 'The Philidor position is the most important drawing technique in rook endgames. When defending against rook and pawn with your king in front of the pawn, keep your rook on your third rank (the 6th rank when you are Black) to stop the enemy king advancing, until the pawn steps onto that rank. Then switch to giving checks from behind.' },
      { type: 'text', content: 'The principle: while the pawn is on the 5th rank, the defender\'s rook on the 6th rank keeps the attacking king out. Once the pawn advances to the 6th rank, it no longer gives the king any shelter from the front, so the rook drops to the far end of the board (the 1st rank for Black) and checks the king from behind. The attacking king has nowhere to hide.' },
      { type: 'position', fen: '4k3/R7/1r6/4PK2/8/8/8/8 w - - 0 1', caption: 'The Philidor position. Black\'s rook on b6 guards the 6th rank, so White\'s king cannot advance to d6, e6 or f6. Black simply waits along the 6th rank. If White plays e6, the rook goes to b1 and checks from behind.', highlights: ['b6', 'e8'] },
      { type: 'text', content: 'This is a theoretical draw. The defending side must know this technique — it saves many rook endgames that look lost. Master it and you\'ll save countless half-points.' },
    ],
    drillPosition: {
      fen: '4k3/R7/8/4PK2/8/8/8/1r6 b - - 0 1',
      solution: ['Rb6', 'e6', 'Rb1', 'Kf6', 'Rf1+'],
      explanation: 'Rb6 sets up the Philidor defence on the 6th rank. When White pushes e6, the pawn no longer shields the king, so the rook drops back to b1 and checks from behind (Rf1+, Re1+, Rd1+...). White\'s king can never escape the checks, and the game is a draw.',
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
      { type: 'text', content: 'The power of the 7th rank comes from geometry: pawns start on the 2nd/7th rank, and a rook there attacks them all simultaneously from behind. Meanwhile, the enemy king is often trapped on the 8th rank, unable to participate.' },
      { type: 'position', fen: '6R1/1p1r2p1/p1p2P1p/7k/3p4/3K4/P7/8 w - - 0 44', caption: 'White\'s rook on g8 can drop to g7, onto Black\'s 7th rank, winning the g7 pawn. From g7 it also stands right next to the f-pawn, ready to support f7 and f8=Q.', arrows: [['g8', 'g7']], highlights: ['g7', 'f6'] },
      { type: 'text', content: 'To achieve a 7th rank rook: control an open file first, then penetrate. Trade off other pieces if needed to reach a favourable rook ending where your rook can invade. The 7th rank is the promised land in rook endings.' },
    ],
    drillPosition: {
      fen: '6R1/1p1r2p1/p1p2P1p/7k/3p4/3K4/P7/8 w - - 0 44',
      solution: ['Rxg7', 'Rd6', 'f7', 'Rf6', 'Kxd4'],
      explanation: 'Rxg7 wins a pawn and puts the rook on the 7th rank beside the f-pawn. After ...Rd6, f7 forces ...Rf6 to stop f8=Q, and with Black\'s rook tied down White collects the d4 pawn with Kxd4. Taking with the pawn instead (fxg7) lets Black\'s rook stop the g-pawn, and White ends up worse.',
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
      { type: 'text', content: 'If the rook can get behind the passed pawn (on the same file), it usually wins easily. From behind, the rook controls every square the pawn must cross, so the pawn cannot promote without being captured. This is why "rooks belong behind passed pawns" — yours or your opponent\'s.' },
      { type: 'position', fen: 'R7/8/7K/8/3p4/1k6/8/8 w - - 0 1', caption: 'White\'s king on h6 is far from the d-pawn, so the rook must stop it alone for a while. Rd8! puts the rook behind the pawn. From d8 it watches d3, d2 and d1, and White\'s king has time to come back and help.', arrows: [['a8', 'd8']] },
      { type: 'text', content: 'The exception: if the pawn is far advanced with its king supporting it and the rook cannot get behind it, the rook may only draw, or even lose. Know the theory and you will navigate rook endings with confidence.' },
    ],
    drillPosition: {
      fen: 'R7/8/7K/8/3p4/1k6/8/8 w - - 0 1',
      solution: ['Rd8', 'Kc3', 'Kg5'],
      explanation: 'Rd8! gets behind the pawn. Checks such as Rb8+ only drive Black\'s king closer to the pawn and draw. With the rook on d8 holding the pawn back, White\'s king runs back (Kg5, Kf4, Ke3) and wins the pawn.',
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
      { type: 'position', fen: '2b5/3k3p/p3p1p1/1pKpP3/1P1N1P1P/P5P1/8/8 w - - 0 1', caption: 'A good knight against a bad bishop. Black\'s pawns on a6, b5, d5, e6 and g6 all stand on light squares, the same colour as the bishop on c8, so the bishop has almost nothing to do. White\'s knight on d4 sits on a dark square that no Black pawn or bishop can ever attack.', highlights: ['d4', 'c8'] },
      { type: 'text', content: 'Practical tip: if you have a bishop, open the position. If you have a knight, keep it closed. Place your pawns on the opposite colour of your bishop to maximise its scope.' },
    ],
    drillPosition: {
      fen: '2b5/3k3p/p3p1p1/1pKpP3/1P1N1P1P/P5P1/8/8 w - - 0 1',
      solution: ['Kb6'],
      explanation: 'Kb6! White\'s king walks in through the dark squares to attack the a6 pawn. Black\'s light-squared bishop can never cover b6, c7 or a7, so White\'s king and knight will win the queenside pawns.',
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
      { type: 'position', fen: '7k/8/6KP/8/8/8/8/5B2 w - - 0 1', caption: 'Despite being a bishop and pawn up, White cannot win. The bishop on f1 runs on light squares, but h8 (the promotion square) is dark. Black\'s king shuffles between h8 and g8, and if White plays h7 it is stalemate.', highlights: ['h8', 'f1'] },
      { type: 'text', content: 'This rule has practical implications: in a winning position, avoid trading down to a rook-pawn ending with the wrong-coloured bishop. Conversely, if you are defending, aim for this drawn configuration. It has saved many games.' },
    ],
    drillPosition: {
      fen: '8/8/4k3/7P/8/6K1/8/1B6 b - - 0 1',
      solution: ['Kf7'],
      explanation: 'Kf7! heads for g8 and h8. The bishop on b1 is light-squared and can never control h8, so once Black\'s king reaches the corner the game is a draw. ...Ke7? is one step too slow and loses, because the h-pawn then gets past.',
    },
  },

  // === QUEEN ENDINGS (2) ===
  {
    id: 'staircase-mate',
    title: 'Queen and King vs King',
    category: 'Queen Endings',
    description: 'The staircase mating technique with queen and king.',
    difficulty: 'Beginner',
    content: [
      { type: 'text', content: 'Checkmating with king and queen vs a lone king is a fundamental technique every player must know. The method is called the "staircase" or "box" technique — you systematically shrink the enemy king\'s available space until checkmate.' },
      { type: 'text', content: 'Steps: 1) Use the queen to cut off ranks or files, restricting the enemy king to a smaller box. 2) Bring your king closer for support. 3) Continue shrinking the box until the enemy king is on the edge. 4) Deliver checkmate on the edge of the board.' },
      { type: 'position', fen: '8/8/8/3k4/8/8/8/4QK2 w - - 0 1', caption: 'The queen on e1 already builds a wall along the e-file: Black\'s king cannot cross to the kingside. White keeps shrinking the box with the queen and brings the king up to help deliver checkmate.', highlights: ['e1', 'd5'] },
      { type: 'text', content: 'Be careful not to stalemate! When the enemy king is in the corner, make sure it still has one legal move before you bring your queen too close. Stalemate is the most common mistake in this endgame. Take your time and use the staircase method.' },
    ],
    drillPosition: {
      fen: '3k4/8/1K6/8/8/4Q3/8/8 w - - 0 1',
      solution: ['Kc6', 'Kc8', 'Qe8#'],
      explanation: 'The queen on e3 keeps Black\'s king off the e-file. Kc6! takes away d7 and c7, so Black\'s only move is ...Kc8, and Qe8# finishes on the back rank.',
    },
  },
  {
    id: 'queen-vs-pawn',
    title: 'Queen vs Pawn on 7th Rank',
    category: 'Queen Endings',
    description: 'When the queen wins and when the pawn draws.',
    difficulty: 'Advanced',
    content: [
      { type: 'text', content: 'Queen vs a pawn on the 7th rank, supported by its king, is usually winning for the queen. There are two famous exceptions, when the attacking king is far away: the rook pawn (a- or h-pawn) and the bishop pawn (c- or f-pawn). Both draw because of stalemate tricks.' },
      { type: 'text', content: 'The queen wins by: 1) Giving checks, or pinning, to force the enemy king in front of its pawn, 2) Using that moment, when the pawn is blocked, to bring her own king one step closer, 3) Repeating until the king arrives and the pawn falls or mate follows. This requires precision but is a systematic technique.' },
      { type: 'position', fen: '8/8/8/4K3/8/1Q6/2p5/k7 w - - 0 1', caption: 'The bishop-pawn trick. Black\'s king has gone to a1 instead of blocking the c-pawn. If White takes the pawn with Qxc2, it is stalemate, and if White\'s king comes closer Black promotes. With White\'s king this far away, it is a draw.', highlights: ['a1', 'c2'] },
      { type: 'text', content: 'With a knight pawn or a centre pawn there is no such trick, so the queen wins. With c/f pawns the defending king hides in the corner, where it would be stalemated if the queen captured the pawn. Unless the attacking king is already close, precise defence draws.' },
    ],
    drillPosition: {
      fen: '8/8/8/8/5K2/8/kp6/6Q1 w - - 0 1',
      solution: ['Qg8+', 'Ka3', 'Qa8+', 'Kb3', 'Qd5+', 'Kc3', 'Qa2'],
      explanation: 'This is a knight pawn, so the queen wins. The checks drive Black\'s king away from its pawn, and Qa2 then attacks b2 and controls b1, so the pawn can never promote. Next White brings the king over to finish the job.',
    },
  },
];

export default endgameLessons;
